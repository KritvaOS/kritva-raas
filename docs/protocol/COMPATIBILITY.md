# Kritva RaaS Compatibility Specification

## 1. Document Control

| Item | Value |
|---|---|
| Document | Kritva RaaS Compatibility Specification |
| Path | `docs/protocol/COMPATIBILITY.md` |
| Product | Kritva Robotics-as-a-Service |
| API Base | `/api/v1/` |
| Protocol Baseline | `1.x` |
| Artifact | `.krv` |
| Contract Location | `packages/contracts` |
| API Client | `packages/api-client` |
| Primary Database | PostgreSQL |
| Status | Production Architecture Baseline |

## 2. Purpose

This document defines the compatibility model for Kritva RaaS.

Compatibility determines whether two independently versioned components can
communicate and operate together correctly.

The governing principle is:

> **A component is compatible only when its protocol, API, artifact, runtime,
> architecture, capability, security, and operational requirements are all
> satisfied.**

A version number alone does not establish compatibility.

## 3. Scope

This specification covers compatibility between:

- Studio and Control Plane;
- Web Console and Control Plane;
- API clients and APIs;
- protocol peers;
- Control Plane and Lab Agent;
- Lab Agent and Kritva Runtime;
- artifacts and runtime;
- artifacts and robot platforms;
- SDK and application source;
- SDK and artifact format;
- CPU architecture and executable artifacts;
- platform capabilities and application requirements;
- rolling upgrades;
- staged deployment;
- compatibility negotiation;
- compatibility matrices;
- hard and soft incompatibility;
- failure reporting;
- compatibility testing.

## 4. Goals

The compatibility system shall:

1. make compatibility explicit;
2. distinguish version compatibility from capability compatibility;
3. prevent unsafe execution;
4. support rolling upgrades;
5. support independent component releases;
6. support multiple supported versions during migration;
7. provide deterministic failure codes;
8. validate compatibility before resource allocation;
9. validate compatibility again before execution;
10. support machine-readable compatibility metadata;
11. provide clear diagnostics;
12. support production observability.

## 5. Non-Goals

This document does not define:

- detailed authentication mechanisms;
- complete authorization policy;
- complete versioning policy;
- database schema design;
- physical robot safety procedures;
- cloud-provider-specific deployment implementation;
- complete artifact packaging implementation.

Those concerns are defined by their respective specifications.

# 6. Compatibility Model

Kritva RaaS compatibility is multidimensional.

    Application
        |
        v
    Artifact
        |
        +--> Artifact Format
        +--> CPU Architecture
        +--> KritvaOS
        +--> Runtime
        +--> SDK
        +--> Platform
        +--> Capabilities
        |
        v
    Lab Agent
        |
        +--> Protocol
        +--> Version
        +--> Capabilities
        |
        v
    Control Plane

All required dimensions must pass before execution.

# 7. Compatibility Dimensions

| Dimension | Example | Primary Check |
|---|---|---|
| API | `v1` | API contract |
| Protocol | `1.1` | Wire compatibility |
| Envelope | `1.0` | Message schema |
| Artifact | `2.1` | Package format |
| SDK | `4.1.0` | Build/runtime contract |
| KritvaOS | `3.2.0` | OS/runtime environment |
| Runtime | `2.3.0` | Execution environment |
| CPU | `aarch64` | Binary architecture |
| Platform | `humanoid-a@2.1` | Robot platform |
| Capability | `vision.rgb` | Required feature |
| Lab Agent | `1.5.0` | Lab compatibility |
| Security | policy-defined | Trust/compliance |

# 8. Compatibility Principle

Compatibility is evaluated as:

    Protocol
      AND API
      AND Artifact
      AND Runtime
      AND Architecture
      AND Platform
      AND Capabilities
      AND Security
      AND Operational Policy

Only when all mandatory conditions pass may execution proceed.

# 9. Hard Compatibility

A hard incompatibility means the operation cannot safely continue.

Examples:

- unsupported CPU architecture;
- incompatible artifact format;
- unsupported runtime ABI;
- incompatible protocol major version;
- missing mandatory capability;
- revoked runtime;
- blocked security version.

Result:

    COMPATIBILITY = FAIL

The operation must be rejected.

# 10. Soft Compatibility

A soft incompatibility means the operation can continue with a warning or
degraded behavior when explicitly permitted.

Examples:

- optional capability unavailable;
- optional telemetry format downgraded;
- preferred video resolution unavailable;
- optional performance feature unavailable.

Result:

    COMPATIBILITY = PASS_WITH_WARNINGS

Soft compatibility must never silently weaken:

- safety;
- security;
- data integrity;
- execution correctness.

# 11. Compatibility Levels

Recommended compatibility results:

    COMPATIBLE
    COMPATIBLE_WITH_WARNINGS
    INCOMPATIBLE
    UNKNOWN
    BLOCKED

Definitions:

| Result | Meaning |
|---|---|
| Compatible | All required checks pass |
| Compatible with warnings | Required checks pass, optional conditions differ |
| Incompatible | One or more mandatory checks fail |
| Unknown | Required information is unavailable |
| Blocked | Technically compatible but prohibited by policy |

# 12. Unknown Is Not Compatible

An unknown compatibility result must not be treated as success for physical
execution.

Example:

    Runtime version = unknown

must not be interpreted as:

    Runtime version = compatible

For production robot execution:

    UNKNOWN -> BLOCKED/REJECTED

unless an explicit policy defines a safe exception.

# 13. Version Compatibility

Version compatibility follows `VERSIONING.md`.

Examples:

    API v1
       |
       +--> compatible with supported v1 clients

    Protocol 1.1
       |
       +--> compatible with supported 1.x peers

Major-version incompatibility is normally hard.

Minor-version differences may be compatible when explicitly supported.

# 14. API Compatibility

The REST API uses:

    /api/v1/

A client declaring support for API v1 may communicate only with a server that
supports v1.

A server may support:

    /api/v1/
    /api/v2/

simultaneously during migration.

# 15. API Compatibility Rules

Compatible changes include:

- new endpoints;
- optional response fields;
- optional request fields;
- new error codes;
- additive metadata.

Breaking changes include:

- removing required fields;
- changing field types;
- changing semantics;
- removing endpoints;
- changing authentication requirements incompatibly.

# 16. Protocol Compatibility

Protocol versions use:

    MAJOR.MINOR

Example:

    1.0
    1.1

Protocol major versions are not assumed compatible.

Protocol minor versions may interoperate when the compatibility matrix explicitly
declares them compatible.

# 17. Protocol Negotiation

Peer protocols should negotiate supported versions.

    Peer A
       |
       | supported: 1.0, 1.1
       v
    Peer B
       |
       | supported: 1.1, 1.2
       v
    Selected: 1.1

If no compatible version exists:

    PROTOCOL_VERSION_UNSUPPORTED

# 18. Envelope Compatibility

Every protocol message carries:

    protocol_version

Envelope semantics remain stable within a supported protocol generation.

Breaking envelope changes require a new protocol major version.

# 19. Command Compatibility

Commands such as:

    booking.create
    artifact.upload
    job.start

must preserve their semantic meaning within a supported protocol version.

Adding optional request fields is generally compatible.

Changing required semantics is breaking.

# 20. Event Compatibility

Events are compatibility contracts.

Example:

    job.running

must retain the same semantic meaning.

New events are generally additive.

Existing events must not silently change meaning.

# 21. Unknown Events

Consumers must tolerate unknown events.

Example:

    event = "job.paused"

An older supported client should not terminate the entire event stream merely
because it does not recognize the event.

The client may ignore the event and reconcile durable state through REST.

# 22. Error Compatibility

Error codes are stable machine-readable contracts.

Example:

    ARTIFACT_INCOMPATIBLE

must retain its meaning.

Error messages may evolve.

Clients must branch on:

    code

rather than:

    message

# 23. Artifact Compatibility

The `.krv` artifact contains compatibility metadata.

Conceptually:

    {
        "artifact_format_version": "2.1",
        "platform_id": "humanoid-a",
        "platform_version": "2.1",
        "architecture": "aarch64",
        "kritva_os_version": "3.2.0",
        "runtime_version": "2.3.0",
        "sdk_version": "4.1.0",
        "required_capabilities": [
            "vision.rgb",
            "motion.joint_control"
        ]
    }

# 24. Artifact Identity

Artifact identity consists of:

    artifact_id
    digest

Compatibility metadata identifies requirements.

The digest identifies immutable content.

# 25. Artifact Format Compatibility

Artifact format uses:

    MAJOR.MINOR

Example:

    2.1

A runtime may support:

    2.0
    2.1

if explicitly declared.

A runtime supporting only:

    1.x

must reject:

    2.x

when formats are incompatible.

# 26. Artifact Format Rules

Compatible format changes may include:

- optional manifest fields;
- optional metadata;
- backward-compatible package extensions.

Hard incompatibilities include:

- incompatible binary layout;
- changed mandatory manifest semantics;
- unsupported compression/encryption;
- unsupported loader behavior.

# 27. CPU Architecture Compatibility

Architecture is a mandatory execution check.

Examples:

    x86_64
    aarch64
    armv7
    riscv64

An artifact compiled for:

    aarch64

cannot execute directly on:

    x86_64

unless an explicitly supported execution layer exists.

# 28. Architecture Check

The compatibility engine compares:

    artifact.architecture
        ==
    runtime.architecture

or verifies an explicitly supported compatibility mechanism.

Example:

    artifact: aarch64
    robot runtime: aarch64

    result:
        COMPATIBLE

# 29. Cross Compilation

Host architecture does not need to equal robot architecture.

Example:

    Developer PC
        x86_64
          |
          | cross compile
          v
    Artifact
        aarch64
          |
          v
    Robot
        aarch64

This is valid.

# 30. Host vs Target

Compatibility must distinguish:

    build_host_architecture

from:

    target_architecture

The artifact manifest records the target.

The Studio host architecture does not determine robot execution compatibility.

# 31. OS Compatibility

The artifact may declare:

    kritva_os_version

The runtime evaluates:

    required KritvaOS range
        against
    installed KritvaOS version

Example:

    required >=3.1 <4.0

Runtime:

    3.2.0

Result:

    COMPATIBLE

# 32. Runtime Compatibility

The artifact declares runtime requirements.

Example:

    required_runtime:
        >=2.2
        <3.0

Runtime:

    2.3.0

Result:

    COMPATIBLE

Runtime:

    3.1.0

Result:

    INCOMPATIBLE

# 33. SDK Compatibility

The SDK used to build the artifact is recorded.

Example:

    sdk_version = 4.1.0

The runtime may enforce:

    supported_sdk:
        >=4.0
        <5.0

The exact SDK/runtime compatibility matrix must be explicitly maintained.

# 34. SDK and Source Compatibility

SDK compatibility has two dimensions:

    Source Compatibility
        |
        +--> application builds

    Runtime Compatibility
        |
        +--> artifact executes

A source-compatible SDK does not necessarily imply runtime compatibility.

# 35. Platform Compatibility

The selected platform must match artifact requirements.

Example:

    artifact:
        platform_id = humanoid-a
        platform_version >=2.0

    selected resource:
        humanoid-a@2.1

Result:

    COMPATIBLE

# 36. Platform Family

Platform family and platform version are distinct.

Example:

    humanoid-a
       |
       +--> 2.0
       +--> 2.1
       +--> 3.0

An artifact targeting:

    humanoid-a

may still require a specific version range.

# 37. Platform Capability Compatibility

Capabilities must be checked independently.

Example:

    required:
        vision.rgb
        vision.depth
        joint_control

Available:

    vision.rgb
    joint_control

Result:

    HARD INCOMPATIBILITY

because `vision.depth` is mandatory.

# 38. Capability Categories

Capabilities may be:

- mandatory;
- optional;
- preferred.

Example:

    required_capabilities:
        - joint_control
        - vision.rgb

    optional_capabilities:
        - vision.depth

# 39. Capability Result

| Capability | Required | Available | Result |
|---|---:|---:|---|
| `joint_control` | Yes | Yes | Pass |
| `vision.rgb` | Yes | Yes | Pass |
| `vision.depth` | Yes | No | Fail |
| `video.h265` | No | No | Warning |

# 40. Capability Versioning

Capabilities may themselves be versioned.

Example:

    telemetry.v2

A runtime supporting:

    telemetry.v1

is not automatically compatible with:

    telemetry.v2

unless an explicit compatibility adapter exists.

# 41. Capability Negotiation

Capabilities should be exchanged where the protocol supports negotiation.

    Peer A
       |
       | capabilities
       v
    Peer B
       |
       | intersection
       v
    common capabilities

Mandatory capabilities must exist in the intersection.

# 42. Optional Capability Downgrade

If an optional capability is unavailable:

    requested:
        video.4k

    available:
        video.1080p

The system may select:

    video.1080p

and report:

    COMPATIBLE_WITH_WARNINGS

provided the application can operate correctly.

# 43. Mandatory Capability Failure

If:

    required:
        joint_control

and:

    available:
        no joint_control

the result is:

    INCOMPATIBLE

The job must not proceed.

# 44. Security Compatibility

Compatibility must include security policy.

Example:

    runtime version = 2.3
    technically compatible = true
    security status = blocked

Final result:

    BLOCKED

Security policy overrides technical compatibility.

# 45. Version Blocklist

The compatibility service may maintain:

    blocked_versions

for:

- vulnerable runtime;
- vulnerable Lab Agent;
- compromised artifact format;
- unsupported protocol;
- revoked platform software.

# 46. Compatibility Evaluation

The compatibility engine should evaluate:

    evaluate(
        artifact,
        platform,
        runtime,
        agent,
        protocol,
        capabilities,
        policy
    )

Return:

    CompatibilityResult

# 47. Compatibility Result Interface

Conceptual:

    CompatibilityResult
    -------------------
    status
    hard_failures[]
    warnings[]
    matched_versions[]
    missing_capabilities[]
    unsupported_capabilities[]
    policy_blocks[]
    evaluated_at
    evaluator_version

# 48. Example Compatibility Result

    {
        "status": "INCOMPATIBLE",
        "hard_failures": [
            {
                "code": "CPU_ARCHITECTURE_MISMATCH",
                "expected": "aarch64",
                "actual": "x86_64"
            }
        ],
        "warnings": [],
        "missing_capabilities": [],
        "policy_blocks": []
    }

# 49. Compatibility API

A compatibility query may be exposed through:

    platform.compatibility

or a dedicated compatibility endpoint.

It should support preflight evaluation without starting execution.

# 50. Preflight Flow

    Studio
       |
       | artifact + platform
       v
    Control Plane
       |
       v
    Compatibility Engine
       |
       +--> API
       +--> Artifact metadata
       +--> Platform metadata
       +--> Runtime metadata
       +--> Agent capabilities
       +--> Policy
       |
       v
    Compatibility Result

# 51. Execution Gate

Compatibility must be checked before:

    resource allocation
       |
       v
    deployment
       |
       v
    execution

Recommended:

    Upload
       |
       v
    Validate Artifact
       |
       v
    Booking
       |
       v
    Preflight
       |
       v
    Allocate
       |
       v
    Final Compatibility Check
       |
       v
    Deploy
       |
       v
    Execute

# 52. Why Two Compatibility Checks

Compatibility can change after booking.

Examples:

- runtime upgraded;
- robot capability changed;
- Lab Agent upgraded;
- resource moved to maintenance;
- platform configuration changed.

Therefore:

> **Preflight at booking/execution preparation does not replace the final
> execution compatibility check.**

# 53. Final Execution Check

Immediately before deployment:

    artifact
       +
    selected resource
       +
    runtime
       +
    agent
       +
    protocol
       |
       v
    compatibility evaluation
       |
       +--> pass
       |     |
       |     v
       |   deploy
       |
       +--> fail
             |
             v
          reject execution

# 54. Compatibility Cache

Compatibility results may be cached when inputs are immutable.

Cache key should include:

    artifact_digest
    platform_version
    runtime_version
    agent_version
    protocol_version
    capability_revision
    policy_revision

Stale compatibility results must not be used for final physical execution.

# 55. Capability Revision

A Lab Agent should expose a capability revision or configuration version.

Example:

    capability_revision = 42

If hardware changes:

    revision 42
       |
       v
    revision 43

Cached compatibility results become invalid.

# 56. Runtime Revision

Runtime compatibility should similarly identify:

    runtime_version
    runtime_build
    runtime_configuration_revision

This helps distinguish nominal version compatibility from actual deployment
state.

# 57. Compatibility Matrix

The platform should maintain a compatibility matrix.

Example:

| Artifact | SDK | Runtime | OS | Arch | Platform | Result |
|---|---|---|---|---|---|---|
| 2.1 | 4.1 | 2.3 | 3.2 | arm64 | HA-2.1 | Pass |
| 2.1 | 4.1 | 2.0 | 3.0 | arm64 | HA-2.1 | Fail |
| 2.1 | 4.1 | 2.3 | 3.2 | x86_64 | HA-2.1 | Fail |
| 2.1 | 4.1 | 2.3 | 3.2 | arm64 | HB-1.0 | Fail |
| 2.1 | 4.1 | 2.3 | 3.2 | arm64 | HA-2.1 | Pass |

The production matrix must be generated from actual declared support rules.

# 58. Protocol Matrix

Example:

| Control Plane | Lab Agent | Result |
|---|---|---|
| 1.0 | 1.0 | Pass |
| 1.1 | 1.0 | Pass if matrix allows |
| 1.1 | 1.1 | Pass |
| 2.0 | 1.0 | Fail |
| 2.0 | 2.0 | Pass |

# 59. API Matrix

Example:

| Client | Server API | Result |
|---|---|---|
| Studio 3.x | v1 | Pass |
| Studio 4.x | v1 | Supported during migration |
| Studio 4.x | v2 | Pass |
| Studio 3.x | v2 | Fail unless compatibility adapter exists |

# 60. Runtime Matrix

Example:

| Artifact | Runtime | Result |
|---|---|---|
| Format 2.0 | Runtime 2.2 | Pass |
| Format 2.1 | Runtime 2.2 | Pass |
| Format 3.0 | Runtime 2.2 | Fail |
| Format 2.1 | Runtime 3.0 | Policy-dependent |

# 61. Architecture Matrix

Example:

| Artifact | Resource | Result |
|---|---|---|
| x86_64 | x86_64 | Pass |
| aarch64 | aarch64 | Pass |
| armv7 | aarch64 | Fail |
| riscv64 | aarch64 | Fail |
| aarch64 | x86_64 | Fail |

# 62. Capability Matrix

Example:

| Application | Platform | Result |
|---|---|---|
| Motion Demo | Joint Control | Pass |
| Vision Demo | RGB + Depth | Pass |
| Vision Demo | RGB only | Fail |
| Telemetry Demo | Basic Telemetry | Pass with warning if optional feature missing |

# 63. Hard Failure Codes

The compatibility error registry should include:

    API_VERSION_UNSUPPORTED
    PROTOCOL_VERSION_UNSUPPORTED
    PROTOCOL_SCHEMA_UNSUPPORTED
    ARTIFACT_FORMAT_UNSUPPORTED
    ARTIFACT_RUNTIME_UNSUPPORTED
    ARTIFACT_SDK_UNSUPPORTED
    PLATFORM_INCOMPATIBLE
    PLATFORM_VERSION_UNSUPPORTED
    CPU_ARCHITECTURE_MISMATCH
    KRITVA_OS_UNSUPPORTED
    RUNTIME_VERSION_UNSUPPORTED
    SDK_VERSION_UNSUPPORTED
    CAPABILITY_MISSING
    CAPABILITY_VERSION_UNSUPPORTED
    AGENT_VERSION_UNSUPPORTED
    AGENT_CAPABILITY_MISSING
    SECURITY_VERSION_BLOCKED

# 64. Soft Warning Codes

Recommended warning codes:

    OPTIONAL_CAPABILITY_UNAVAILABLE
    OPTIONAL_CAPABILITY_DOWNGRADED
    TELEMETRY_FEATURE_DEGRADED
    VIDEO_PROFILE_DOWNGRADED
    NON_PREFERRED_RUNTIME_VERSION
    NON_PREFERRED_PLATFORM_VERSION

Warnings must not be used for mandatory requirements.

# 65. Compatibility Error Envelope

Example:

    {
        "protocol_version": "1.0",
        "request_id": "req-compat-001",
        "timestamp": "2026-10-08T00:00:01Z",
        "status": "REJECTED",
        "code": "ARTIFACT_INCOMPATIBLE",
        "message": "The artifact is not compatible with the selected platform.",
        "data": {
            "compatibility_status": "INCOMPATIBLE",
            "failures": [
                {
                    "code": "CPU_ARCHITECTURE_MISMATCH"
                }
            ]
        },
        "error": {
            "details": {},
            "retryable": false,
            "field_errors": []
        }
    }

# 66. Failure Classification

Compatibility failures should be classified as:

    HARD
    SOFT
    POLICY
    UNKNOWN

Example:

    CPU_ARCHITECTURE_MISMATCH
        HARD

    OPTIONAL_CAPABILITY_UNAVAILABLE
        SOFT

    SECURITY_VERSION_BLOCKED
        POLICY

    RUNTIME_VERSION_UNKNOWN
        UNKNOWN

# 67. Retryability

Most hard compatibility failures are not retryable without changing inputs.

Examples:

    CPU_ARCHITECTURE_MISMATCH
        retryable = false

    CAPABILITY_MISSING
        retryable = false

But:

    AGENT_VERSION_UNSUPPORTED

may become compatible after an agent upgrade.

The operation itself should not automatically retry indefinitely.

# 68. User Remediation

Compatibility failures should explain:

- what was required;
- what was found;
- why it failed;
- how to remediate.

Example:

    Required:
        aarch64

    Found:
        x86_64

    Remediation:
        Select an aarch64 robot or rebuild the artifact for a supported
        target architecture.

# 69. Administrative Remediation

Admins may resolve compatibility issues by:

- upgrading runtime;
- upgrading Lab Agent;
- adding capability;
- changing platform configuration;
- updating compatibility policy.

They must not override safety/security blocks without explicit policy.

# 70. Capability Discovery

Lab Agent should report:

    agent_id
    version
    protocol_versions
    runtime_version
    architecture
    platform
    capabilities
    capability_revision
    health

Example:

    {
        "agent_id": "agent-001",
        "version": "1.5.0",
        "protocol_versions": [
            "1.0",
            "1.1"
        ],
        "runtime_version": "2.3.0",
        "architecture": "aarch64",
        "capabilities": [
            "vision.rgb",
            "motion.joint_control"
        ],
        "capability_revision": 42
    }

# 71. Platform Discovery

Platform metadata should include:

    platform_id
    platform_version
    architecture
    runtime_requirements
    capabilities
    safety_constraints
    availability

# 72. Artifact Discovery

Artifact metadata should include:

    artifact_id
    digest
    artifact_format_version
    architecture
    platform_id
    platform_version_range
    runtime_range
    sdk_version
    KritvaOS_range
    required_capabilities

# 73. Compatibility Contract

The compatibility engine consumes three primary declarations:

    Artifact Requirements
            |
            v
    Platform/Runtime Capabilities
            |
            v
    Compatibility Policy

and produces:

    CompatibilityResult

# 74. Compatibility Interface

Conceptual interface:

    evaluate_artifact(
        artifact,
        target,
        policy
    ) -> CompatibilityResult

Target includes:

    platform
    runtime
    architecture
    agent
    protocol

# 75. Protocol Interface

Conceptual:

    negotiate_protocol(
        local_supported_versions,
        peer_supported_versions
    ) -> selected_version

Failure:

    PROTOCOL_VERSION_UNSUPPORTED

# 76. Capability Interface

Conceptual:

    check_capabilities(
        required,
        available
    ) -> CapabilityResult

Result:

    required_missing[]
    optional_missing[]
    selected_versions[]

# 77. Runtime Interface

Conceptual:

    check_runtime(
        artifact_requirements,
        runtime_metadata
    ) -> RuntimeCompatibility

Checks:

- version;
- ABI;
- OS;
- architecture;
- loader;
- security state.

# 78. Architecture Interface

Conceptual:

    check_architecture(
        target_architecture,
        runtime_architecture
    ) -> ArchitectureCompatibility

No implicit architecture conversion is assumed.

# 79. API Interface

The API client should expose supported versions.

Example:

    api_client.supported_api_versions()

The Control Plane should expose its supported API versions through
documentation or a discovery mechanism.

# 80. Compatibility Discovery

A client may query:

    GET /api/v1/platforms/{platform_id}/compatibility

or use:

    platform.compatibility

The exact endpoint is subject to API design.

# 81. Booking Compatibility

Booking should validate compatibility sufficiently to prevent obviously
invalid reservations.

However, final execution compatibility must still be checked later.

Flow:

    Select Platform
       |
       v
    Select Resource
       |
       v
    Artifact Requirements
       |
       v
    Compatibility Preflight
       |
       v
    Quote
       |
       v
    Booking

# 82. Booking Does Not Guarantee Execution Compatibility

A booking represents resource availability.

It does not guarantee that a subsequently uploaded or changed artifact will be
compatible.

Therefore:

    Booking
        !=
    Execution Compatibility

# 83. Artifact Upload Compatibility

The Control Plane should validate artifact structure and metadata at upload.

It may also validate:

- known architecture;
- supported format;
- known SDK;
- known platform.

Unknown metadata should be rejected or quarantined according to policy.

# 84. Execution Compatibility

At execution:

    artifact
       |
       +--> format
       +--> architecture
       +--> OS
       +--> runtime
       +--> SDK
       +--> platform
       +--> capabilities
       +--> agent
       +--> protocol
       +--> security
       |
       v
    FINAL GATE

# 85. Deployment Compatibility

Compatibility must be checked before deployment to the runtime.

A failed deployment should not leave an invalid artifact in an executable state.

The Lab Agent should validate again before starting execution.

# 86. Lab Agent Compatibility

The Control Plane and Lab Agent must agree on:

- protocol;
- supported commands;
- security;
- artifact handling;
- runtime control;
- capability model.

The Lab Agent must not accept commands that require unsupported protocol
semantics.

# 87. Rolling Upgrade Principle

Kritva RaaS must support rolling upgrades where practical.

The desired sequence is:

    Old Version
       |
       v
    Introduce Compatible New Version
       |
       v
    Mixed-Version Operation
       |
       v
    Migrate Clients/Agents
       |
       v
    Retire Old Version

# 88. Control Plane Rolling Upgrade

For a backward-compatible release:

    CP Instance A
        v1
    CP Instance B
        v1

Upgrade:

    CP Instance A
        v1 + compatible changes

    CP Instance B
        v1

Then:

    CP Instance A
        v1 new

    CP Instance B
        v1 new

No client-visible incompatibility should occur.

# 89. API Major Upgrade

For a breaking API release:

    API v1
       |
       +--> remain active
       |
    API v2
       |
       +--> introduced
       |
       v
    clients migrate
       |
       v
    v1 retirement

Both versions may temporarily share domain services.

# 90. Lab Agent Rolling Upgrade

Recommended:

    Control Plane
       supports 1.0 + 1.1
           |
           v
    Upgrade Agent A
           |
           v
    Validate Agent A
           |
           v
    Upgrade Agent B
           |
           v
    Upgrade remaining agents
           |
           v
    Retire 1.0

# 91. Runtime Rolling Upgrade

Robot runtime upgrades must be more conservative.

Recommended:

    Validate compatibility
        |
        v
    Drain resource
        |
        v
    Stop execution
        |
        v
    Upgrade runtime
        |
        v
    Health check
        |
        v
    Capability check
        |
        v
    Return resource to pool

Physical deployment must follow safety procedures.

# 92. Mixed Runtime Versions

The Control Plane may support:

    Runtime 2.2
    Runtime 2.3

simultaneously.

The compatibility matrix determines which artifacts can execute on each
resource.

# 93. Rolling Upgrade and Artifacts

New runtime versions should initially support existing supported artifact
formats.

Example:

    Runtime 2.3
       |
       +--> Artifact 2.0
       +--> Artifact 2.1

This enables runtime upgrades without forcing immediate rebuilds.

# 94. Rolling Upgrade and SDK

New SDK releases should normally produce artifacts compatible with the current
supported runtime window.

If not:

    SDK 5
       |
       v
    requires Runtime 3
       |
       v
    compatibility boundary

The build system must clearly communicate the requirement.

# 95. Rolling Upgrade Failure

If an upgraded resource becomes incompatible:

    resource
       |
       v
    compatibility failure
       |
       v
    remove from eligible pool
       |
       v
    rollback/fix
       |
       v
    revalidate
       |
       v
    restore availability

# 96. Compatibility and Scheduler

The scheduler should consider compatibility before selecting a resource.

Selection:

    Candidate Resources
        |
        v
    Availability
        |
        v
    Compatibility
        |
        v
    Capability
        |
        v
    Health
        |
        v
    Policy
        |
        v
    Eligible Resource

# 97. Scheduler Hard Filter

Hard incompatibilities must eliminate a resource from the candidate set.

Example:

    architecture mismatch
        |
        v
    resource excluded

# 98. Scheduler Soft Filter

Soft differences may influence ranking.

Example:

    preferred GPU capability unavailable

If optional:

    resource remains eligible
    warning recorded

# 99. Resource Allocation

Compatibility should be evaluated before resource locking where possible.

However, the final state must be checked after locking because resource state
can change between selection and deployment.

# 100. TOCTOU Protection

Compatibility has a time-of-check/time-of-use risk.

Flow:

    Check
       |
       v
    Resource changes
       |
       v
    Execute

Therefore the system must perform a final compatibility validation immediately
before deployment/execution.

# 101. Capability Drift

Hardware configuration may change while a resource remains registered.

Examples:

- sensor removed;
- camera disabled;
- motor controller replaced;
- accelerator unavailable.

The Lab Agent must update capability revision and health.

# 102. Capability Drift Handling

    capability_revision 42
          |
          v
    hardware change
          |
          v
    capability_revision 43
          |
          v
    invalidate compatibility cache
          |
          v
    re-evaluate jobs

# 103. Runtime Drift

If the runtime is updated:

    runtime 2.2
       |
       v
    runtime 2.3

previous compatibility results may become stale.

The scheduler must invalidate affected cached results.

# 104. Protocol Drift

If a Lab Agent changes protocol support:

    protocol 1.0
       |
       v
    protocol 1.1

the Control Plane must renegotiate or update the compatibility state.

# 105. Compatibility State

Resources should expose:

    compatibility_status

Possible values:

    READY
    DEGRADED
    INCOMPATIBLE
    UNKNOWN
    MAINTENANCE
    BLOCKED

This is distinct from robot safety state.

# 106. Compatibility and Health

Health and compatibility are separate.

Example:

    Resource:
        HEALTHY
        INCOMPATIBLE

It is operationally healthy but cannot execute the selected artifact.

Another:

    Resource:
        UNHEALTHY
        COMPATIBLE

The resource is compatible but unavailable.

# 107. Compatibility and Safety

Safety is a separate gate.

    Compatibility
         |
         v
    Safety
         |
         v
    Authorization
         |
         v
    Execution

Passing compatibility never implies safety approval.

# 108. Compatibility and Authentication

Authentication establishes:

    who is communicating

Compatibility establishes:

    whether they can communicate/operate together

Both checks are required.

# 109. Compatibility and Authorization

Authorization establishes:

    whether the principal may perform the action

Compatibility establishes:

    whether the target can perform the action

All three must pass.

# 110. Execution Gate Model

    Authentication
          |
          v
    Authorization
          |
          v
    Compatibility
          |
          v
    Safety
          |
          v
    Resource Allocation
          |
          v
    Deployment
          |
          v
    Execution

The exact ordering may vary for optimization, but no mandatory gate may be
skipped.

# 111. Compatibility Failure During Queueing

If a job is queued and compatibility changes:

    QUEUED
       |
       v
    compatibility recheck
       |
       +--> pass
       |      |
       |      v
       |    allocate
       |
       +--> fail
              |
              v
        JOB_INCOMPATIBLE

The job should not remain indefinitely queued for an impossible resource.

# 112. Compatibility Failure During Booking

If the selected resource becomes incompatible:

    booking
       |
       v
    resource state changed
       |
       v
    execution preflight fails

The system should provide a deterministic remediation path such as:

- select another resource;
- reschedule;
- upgrade artifact;
- upgrade runtime.

# 113. Compatibility Failure During Deployment

If deployment detects incompatibility:

    deployment
       |
       v
    validation
       |
       v
    reject

The runtime must not start the artifact.

# 114. Failure Codes

Compatibility failures should map to stable error codes.

Core baseline:

    API_VERSION_UNSUPPORTED
    PROTOCOL_VERSION_UNSUPPORTED
    PROTOCOL_SCHEMA_UNSUPPORTED
    ARTIFACT_FORMAT_UNSUPPORTED
    ARTIFACT_INCOMPATIBLE
    ARTIFACT_RUNTIME_UNSUPPORTED
    ARTIFACT_SDK_UNSUPPORTED
    PLATFORM_INCOMPATIBLE
    PLATFORM_VERSION_UNSUPPORTED
    PLATFORM_CAPABILITY_MISSING
    CPU_ARCHITECTURE_MISMATCH
    KRITVA_OS_UNSUPPORTED
    RUNTIME_VERSION_UNSUPPORTED
    SDK_VERSION_UNSUPPORTED
    CAPABILITY_MISSING
    CAPABILITY_VERSION_UNSUPPORTED
    AGENT_VERSION_UNSUPPORTED
    AGENT_CAPABILITY_MISSING
    SECURITY_VERSION_BLOCKED

# 115. Error Retryability

| Code | Retryable | Typical Remediation |
|---|---|---|
| `CPU_ARCHITECTURE_MISMATCH` | No | Select/rebuild target |
| `CAPABILITY_MISSING` | No | Select capable resource |
| `ARTIFACT_FORMAT_UNSUPPORTED` | No | Rebuild/repackage |
| `RUNTIME_VERSION_UNSUPPORTED` | No | Upgrade runtime or rebuild |
| `AGENT_VERSION_UNSUPPORTED` | No | Upgrade agent |
| `PROTOCOL_VERSION_UNSUPPORTED` | No | Upgrade compatible peer |
| `SECURITY_VERSION_BLOCKED` | No | Upgrade blocked component |
| `PLATFORM_UNAVAILABLE` | Yes | Retry with another resource/time |

# 116. Compatibility Diagnostics

A failure should identify the failing dimension.

Example:

    Compatibility failure:
        Dimension: CPU
        Required: aarch64
        Actual: x86_64
        Severity: HARD
        Code: CPU_ARCHITECTURE_MISMATCH

This is preferable to:

    "Execution failed."

# 117. Failure Details

Failure details may include:

    expected
    actual
    component
    version
    capability
    remediation

Sensitive infrastructure information must not be exposed to unauthorized
users.

# 118. Compatibility API Response

Successful result:

    {
        "status": "COMPATIBLE",
        "warnings": []
    }

Warning result:

    {
        "status": "COMPATIBLE_WITH_WARNINGS",
        "warnings": [
            {
                "code": "OPTIONAL_CAPABILITY_UNAVAILABLE"
            }
        ]
    }

Failure:

    {
        "status": "INCOMPATIBLE",
        "hard_failures": [
            {
                "code": "RUNTIME_VERSION_UNSUPPORTED"
            }
        ]
    }

# 119. Compatibility Matrix Ownership

Each matrix dimension must have an owner.

| Matrix | Owner |
|---|---|
| API | Control Plane/API |
| Protocol | Protocol |
| Artifact | Artifact/Runtime |
| SDK | SDK |
| Runtime | Runtime |
| Platform | Robotics Platform |
| Capability | Platform/Lab |
| Security | Security |
| Agent | Lab |

No compatibility rule should exist without an accountable owner.

# 120. Machine-Readable Compatibility

Where practical, compatibility declarations should be stored in machine-readable
form.

Example:

    {
        "component": "kritva-runtime",
        "version": "2.3.0",
        "supported_artifact_formats": [
            "2.0",
            "2.1"
        ],
        "architectures": [
            "aarch64"
        ],
        "supported_protocols": [
            "1.1"
        ]
    }

# 121. Compatibility Registry

Recommended repository structure:

    packages/contracts/
        compatibility/
            api.json
            protocol.json
            artifact.json
            runtime.json
            platforms.json
            capabilities.json

The exact filenames may evolve, but compatibility rules must remain
version-controlled.

# 122. Runtime Declaration

A runtime should declare:

    runtime_version
    architecture
    kritva_os_version
    artifact_formats
    sdk_ranges
    platform
    capabilities
    protocol_versions
    security_state

# 123. Lab Agent Declaration

A Lab Agent should declare:

    agent_version
    protocol_versions
    runtime_version
    architecture
    capabilities
    capability_revision
    platform
    security_state

# 124. Platform Declaration

A platform should declare:

    platform_id
    platform_version
    supported_architectures
    runtime_requirements
    capabilities
    protocol_requirements
    safety_constraints

# 125. Compatibility Contract Testing

CI should test:

    Producer
        |
        v
    Consumer

for every supported compatibility pair.

Examples:

- old Studio → new Control Plane;
- new Studio → supported Control Plane;
- old Agent → new Control Plane;
- new Agent → supported Control Plane;
- old artifact → new runtime;
- new artifact → supported runtime.

# 126. Negative Compatibility Testing

CI must also verify rejection of:

- unsupported protocol major;
- unsupported API major;
- wrong architecture;
- missing capability;
- unsupported artifact format;
- unsupported runtime;
- blocked version.

# 127. Schema Compatibility Testing

Schema diff tooling should detect:

- removed required fields;
- changed field types;
- changed enum semantics;
- incompatible constraints;
- removed endpoints;
- incompatible event schemas.

# 128. Behavioral Compatibility Testing

Schema compatibility is insufficient.

Tests should verify:

- command semantics;
- status meanings;
- retry behavior;
- error behavior;
- ordering guarantees;
- capability behavior.

# 129. Compatibility Test Matrix

Example:

| Test | Old | New | Required |
|---|---|---|---|
| API client/server | Yes | Yes | Yes |
| Protocol peer | Yes | Yes | Yes |
| Artifact/runtime | Yes | Yes | Yes |
| Agent/control plane | Yes | Yes | Yes |
| Capability negotiation | Yes | Yes | Yes |
| Architecture mismatch | N/A | N/A | Negative |
| Missing capability | N/A | N/A | Negative |

# 130. Rolling Upgrade Acceptance

A rolling upgrade is compatible only if:

    Old Component
         |
         v
    Mixed Deployment
         |
         v
    New Component

can operate without unsafe behavior.

If mixed-version operation is not supported, the deployment must use an explicit
drain/upgrade window.

# 131. Drain Strategy

For incompatible upgrades:

    Resource
       |
       v
    stop accepting new jobs
       |
       v
    drain existing jobs
       |
       v
    upgrade
       |
       v
    validate
       |
       v
    re-enable scheduling

# 132. Backward Compatibility Window

Each production component should declare:

    current
    supported previous
    deprecated
    retired

The exact window is governed by `VERSIONING.md`.

# 133. Forward Compatibility

Where practical, newer servers should tolerate older supported clients.

However, forward compatibility must not compromise:

- security;
- correctness;
- safety.

# 134. Compatibility During Partial Deployment

A production environment may temporarily contain:

    Control Plane 4.1
    Control Plane 4.2

Both must remain compatible with the active shared database and protocol
contracts during the rollout.

# 135. Database Compatibility

Application compatibility depends on database migration strategy.

Preferred:

    Expand
       |
       v
    Compatible application versions
       |
       v
    Migrate
       |
       v
    Contract

Breaking database changes must not make rollback impossible.

# 136. Configuration Compatibility

Configuration schemas are also compatibility contracts.

An upgraded component should either:

- accept supported old configuration;
- provide migration;
- fail with a clear configuration compatibility error.

# 137. Configuration Failure

Recommended code:

    CONFIGURATION_VERSION_UNSUPPORTED

The final error registry should include this code if required by implementation.

# 138. Cloud Compatibility

Cloud infrastructure changes must preserve application compatibility.

Examples:

- queue schema;
- object-storage metadata;
- secret formats;
- environment variables;
- service identity configuration.

Provider-specific changes must not silently alter application semantics.

# 139. Object Storage Compatibility

Artifact object metadata should remain readable across supported application
versions.

The object key must not be the only source of artifact compatibility metadata.

# 140. Queue Compatibility

Queue messages should contain:

    protocol_version
    message_type
    operation_id
    resource_id
    schema_version

Workers must reject unsupported message schemas safely.

# 141. Queue Failure

An unsupported queue message should not be endlessly retried.

It should enter:

    dead-letter / quarantine

with a stable diagnostic.

# 142. Compatibility and Results

Results must retain enough version metadata to remain interpretable.

Example:

    result
        |
        +--> artifact_version
        +--> runtime_version
        +--> platform_version
        +--> agent_version
        +--> protocol_version

This supports experiment reproducibility.

# 143. Compatibility and Experiments

An experiment may contain multiple runs.

Each run may use:

    artifact A
    runtime 2.2

and:

    artifact B
    runtime 2.3

Compatibility metadata must be recorded per run, not only per experiment.

# 144. Compatibility and Reproducibility

A result should be reproducible only when the relevant environment is known.

Required metadata may include:

- artifact digest;
- SDK version;
- runtime version;
- KritvaOS version;
- platform version;
- CPU architecture;
- Lab Agent version;
- protocol version;
- capability revision.

# 145. Compatibility and Credits

Credits are independent of compatibility.

A user may have enough credits but still be unable to execute an incompatible
artifact.

The correct order is:

    Eligibility
       |
       v
    Compatibility
       |
       v
    Availability
       |
       v
    Quote/Credit
       |
       v
    Booking/Execution

Exact commercial sequencing may be optimized, but incompatible execution must
never be charged as a successful run.

# 146. Compatibility and Booking

A booking may reserve a platform/resource.

It must not silently imply that every artifact is compatible with that resource.

The selected artifact should be validated before execution.

# 147. Compatibility and Idempotency

Compatibility checks must not break idempotency.

If:

    job.start
        key = K

returns:

    ARTIFACT_INCOMPATIBLE

then a retry with the same key should preserve the same logical outcome unless
the server explicitly transitions the operation into a new reconciliation state.

A changed artifact or target requires a new logical operation/key.

# 148. Compatibility and Authentication

Authentication identifies the caller.

Compatibility evaluates the target environment.

Both are required:

    Authenticated User
          +
    Compatible Target
          |
          v
    Eligible Operation

# 149. Compatibility and Authorization

A user may be:

    authenticated = true
    authorized = true
    compatible = false

The operation must still be rejected.

# 150. Compatibility and Safety

A user may be:

    authenticated = true
    authorized = true
    compatible = true

but:

    safety = false

Execution must still be blocked.

# 151. End-to-End Execution Gate

    User Authentication
           |
           v
    Authorization
           |
           v
    Artifact Validation
           |
           v
    Compatibility
           |
           v
    Resource Availability
           |
           v
    Resource Allocation
           |
           v
    Final Compatibility
           |
           v
    Safety/Interlock
           |
           v
    Deployment
           |
           v
    Execution

# 152. Phase Mapping Overview

| Phase | Compatibility Scope |
|---|---|
| Phase 0 | Compatibility contracts and matrix |
| Phase 1 | Studio/API compatibility |
| Phase 2 | Artifact/SDK/architecture compatibility |
| Phase 3 | Control Plane/API/protocol compatibility |
| Phase 4 | Booking/commercial compatibility |
| Phase 5 | Job/agent compatibility |
| Phase 6 | Runtime/platform/capability compatibility |
| Phase 7 | Live/result compatibility |
| Phase 8 | Production rolling upgrades and retirement |

# 153. P0 FOUNDATION

Implement:

- compatibility model;
- hard/soft classification;
- compatibility registry;
- version matrix;
- standard failure codes;
- compatibility result contract.

Acceptance:

- compatibility dimensions are documented;
- incompatible states are machine-detectable.

# 154. P1 STUDIO

Implement:

- API compatibility detection;
- client version metadata;
- protocol negotiation;
- graceful unsupported-version handling.

Acceptance:

- unsupported API versions fail clearly;
- supported Studio versions operate against supported Control Plane versions.

# 155. P2 BUILD & ARTIFACT

Implement:

- artifact manifest compatibility;
- architecture validation;
- SDK/runtime compatibility;
- artifact format validation.

Acceptance:

- invalid artifacts are rejected before execution;
- target architecture is explicit.

# 156. P3 CONTROL PLANE

Implement:

- compatibility service;
- API version matrix;
- protocol matrix;
- machine-readable compatibility declarations;
- contract testing.

Acceptance:

- Control Plane can evaluate supported combinations deterministically.

# 157. P4 BOOKING & COMMERCIAL

Implement:

- booking compatibility preflight;
- resource eligibility;
- compatibility-aware quoting where required;
- no-charge-on-invalid-execution behavior.

Acceptance:

- incompatible resources are excluded or clearly rejected.

# 158. P5 EXECUTION

Implement:

- Lab Agent compatibility;
- job compatibility checks;
- protocol negotiation;
- scheduler integration.

Acceptance:

- incompatible agents/resources cannot receive execution commands.

# 159. P6 LAB & ROBOT

Implement:

- runtime compatibility;
- CPU architecture checks;
- platform capability checks;
- capability revision;
- final execution gate.

Acceptance:

- physical execution cannot proceed through a hard incompatibility.

# 160. P7 LIVE & RESULTS

Implement:

- WebSocket compatibility;
- telemetry compatibility;
- result metadata;
- experiment environment recording.

Acceptance:

- results remain interpretable across supported versions.

# 161. P8 PRODUCTION

Implement:

- rolling upgrades;
- compatibility dashboards;
- version retirement;
- security blocking;
- migration automation;
- operational runbooks.

Acceptance:

- supported mixed-version deployments are validated;
- unsupported combinations are rejected safely.

# 162. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Wrong architecture | Critical | Mandatory architecture check |
| Missing capability | Critical | Capability gate |
| Runtime drift | High | Final pre-execution check |
| Protocol mismatch | High | Negotiation |
| Version explosion | High | Support window |
| Stale cache | High | Revision-aware cache |
| Rolling upgrade break | Critical | Compatibility matrix |
| Security block bypass | Critical | Policy gate |
| Unknown capability | High | Fail closed |
| Hidden semantic change | High | Behavioral tests |
| Agent drift | Critical | Agent metadata/revision |
| Artifact aging | High | Format compatibility window |
| Scheduler race | High | Final compatibility check |
| Configuration drift | Medium | Configuration validation |

# 163. Risk — Capability Drift

A robot may report a capability at registration and lose it later.

Mitigation:

- capability revision;
- health reporting;
- final validation;
- cache invalidation.

# 164. Risk — Compatibility Cache Staleness

Cached compatibility can become invalid.

Mitigation:

- include all relevant versions/revisions in cache key;
- invalidate on runtime/platform/agent changes;
- never rely solely on cache for final execution.

# 165. Risk — Mixed-Version Deployment

Old and new services may interact unexpectedly.

Mitigation:

- explicit compatibility matrix;
- contract tests;
- staged rollout;
- rollback;
- minimum supported version enforcement.

# 166. Risk — Soft Failure Misuse

An engineer may classify a mandatory feature as optional.

Mitigation:

- capability requirement metadata;
- architectural review;
- hard/soft classification tests;
- safety review for physical capabilities.

# 167. Risk — Unknown Treated as Compatible

Missing metadata may result in unsafe assumptions.

Mitigation:

    UNKNOWN != COMPATIBLE

Production execution should fail closed when required information is missing.

# 168. Risk — Version Number Misinterpretation

A component may share a major version but still be incompatible.

Mitigation:

- explicit compatibility declarations;
- capability checks;
- protocol negotiation;
- matrix-driven validation.

# 169. Open Questions

1. What exact machine-readable compatibility registry format will be used?
2. What exact API endpoint will expose compatibility preflight?
3. What exact protocol negotiation command will be finalized?
4. What exact supported API major-version window will be maintained?
5. What exact protocol minor-version compatibility rules will be supported?
6. What exact artifact-format support window will be maintained?
7. What exact SDK/runtime compatibility ranges will be published?
8. Which CPU architectures are P0?
9. Will `x86_64`, `aarch64`, and `riscv64` be supported initially?
10. Will any architecture emulation/translation be supported?
11. What exact platform capability naming convention will be used?
12. Will capability versions be Semantic Versioning, integers, or named levels?
13. What exact capability revision mechanism will be used?
14. What exact compatibility cache lifetime is acceptable?
15. Which changes invalidate cached compatibility?
16. What exact soft incompatibilities are allowed?
17. Which compatibility failures are user-visible?
18. Which compatibility failures are administrative only?
19. What exact rolling-upgrade windows are required?
20. How many mixed runtime versions can a lab support?
21. How many Lab Agent protocol versions can coexist?
22. What exact scheduler compatibility filter is required?
23. What exact security blocklist mechanism will be used?
24. How will offline agents receive compatibility/security updates?
25. What exact compatibility SLOs should be monitored?
26. What exact matrix should be generated automatically in CI?
27. How will incompatible artifacts be handled after runtime retirement?
28. What exact compatibility metadata must be retained for historical runs?
29. How should compatibility interact with credit charging and refunds?
30. What exact human safety review is required before runtime upgrades on
    physical robots?

# 170. Full Acceptance Criteria — Compatibility Model

- [ ] Compatibility is defined as a multidimensional evaluation.
- [ ] Protocol compatibility is defined.
- [ ] API compatibility is defined.
- [ ] Artifact compatibility is defined.
- [ ] SDK compatibility is defined.
- [ ] Runtime compatibility is defined.
- [ ] CPU architecture compatibility is defined.
- [ ] Platform compatibility is defined.
- [ ] Capability compatibility is defined.
- [ ] Security compatibility is defined.
- [ ] Hard incompatibility is defined.
- [ ] Soft incompatibility is defined.
- [ ] Unknown compatibility is defined.
- [ ] Blocked compatibility is defined.

# 171. Full Acceptance Criteria — Protocol/API

- [ ] API major versions are explicit.
- [ ] Protocol versions are explicit.
- [ ] Protocol negotiation is defined.
- [ ] Unsupported protocol versions are rejected.
- [ ] API compatibility rules are documented.
- [ ] Envelope compatibility is tested.
- [ ] Command semantics are stable.
- [ ] Event semantics are stable.
- [ ] Error codes are stable.
- [ ] API migration follows versioning policy.

# 172. Full Acceptance Criteria — Artifact

- [ ] `.krv` contains artifact format version.
- [ ] Artifact digest is recorded.
- [ ] Target architecture is recorded.
- [ ] Platform requirement is recorded.
- [ ] Runtime requirement is recorded.
- [ ] SDK version is recorded.
- [ ] KritvaOS requirement is recorded.
- [ ] Required capabilities are recorded.
- [ ] Unsupported artifact formats are rejected.
- [ ] Incompatible artifacts cannot execute.

# 173. Full Acceptance Criteria — CPU Architecture

- [ ] Host architecture is distinguished from target architecture.
- [ ] Target architecture is validated.
- [ ] Architecture mismatch is a hard failure by default.
- [ ] Supported cross-compilation is allowed.
- [ ] Unsupported emulation is not assumed.
- [ ] Architecture is recorded in run metadata.
- [ ] Architecture mismatch produces a stable error code.

# 174. Full Acceptance Criteria — Runtime and SDK

- [ ] Runtime version is explicit.
- [ ] SDK version is explicit.
- [ ] Runtime/SDK compatibility is defined.
- [ ] Runtime/KritvaOS compatibility is defined.
- [ ] Artifact/runtime compatibility is checked.
- [ ] Unsupported runtime versions are rejected.
- [ ] Unsupported SDK requirements are rejected.
- [ ] Runtime security state is checked.
- [ ] Runtime upgrades invalidate stale compatibility results.

# 175. Full Acceptance Criteria — Capabilities

- [ ] Required capabilities are explicit.
- [ ] Optional capabilities are explicit.
- [ ] Preferred capabilities can be represented.
- [ ] Capability versions can be represented.
- [ ] Capability revisions are supported.
- [ ] Missing mandatory capabilities cause hard failure.
- [ ] Missing optional capabilities produce warnings.
- [ ] Unknown mandatory capabilities do not pass.
- [ ] Capability drift invalidates affected compatibility state.

# 176. Full Acceptance Criteria — Hard and Soft

- [ ] Hard incompatibility blocks execution.
- [ ] Soft incompatibility can produce warnings.
- [ ] Soft compatibility cannot weaken safety.
- [ ] Soft compatibility cannot weaken security.
- [ ] Unknown is not automatically compatible.
- [ ] Policy blocks override technical compatibility.
- [ ] Compatibility severity is machine-readable.

# 177. Full Acceptance Criteria — Scheduler

- [ ] Scheduler evaluates compatibility.
- [ ] Hard incompatibilities exclude resources.
- [ ] Optional capabilities may influence ranking.
- [ ] Resource health is evaluated separately.
- [ ] Capability revision is considered.
- [ ] Runtime version is considered.
- [ ] Final compatibility is checked after allocation.
- [ ] Scheduler cannot select a known incompatible resource.

# 178. Full Acceptance Criteria — Execution

- [ ] Compatibility is checked before deployment.
- [ ] Compatibility is checked immediately before execution.
- [ ] Runtime metadata is current.
- [ ] Agent metadata is current.
- [ ] Platform capabilities are current.
- [ ] Security policy is checked.
- [ ] Hard failures block execution.
- [ ] Compatibility failures do not start the robot runtime.

# 179. Full Acceptance Criteria — Rolling Upgrades

- [ ] Compatible rolling upgrades are supported.
- [ ] Mixed-version operation is explicitly tested.
- [ ] API major migrations support overlap where required.
- [ ] Lab Agent upgrades are staged.
- [ ] Runtime upgrades drain resources where required.
- [ ] Rollback is defined.
- [ ] Database changes support application rollback.
- [ ] Compatibility matrices are updated before release.

# 180. Full Acceptance Criteria — Failure Codes

- [ ] Protocol failure codes are stable.
- [ ] API failure codes are stable.
- [ ] Artifact failure codes are stable.
- [ ] Architecture failure code exists.
- [ ] Runtime failure code exists.
- [ ] SDK failure code exists.
- [ ] Capability failure code exists.
- [ ] Agent failure code exists.
- [ ] Security block code exists.
- [ ] Retryability is documented.

# 181. Full Acceptance Criteria — Compatibility Registry

- [ ] Registry is version controlled.
- [ ] Component owners are defined.
- [ ] Supported versions are recorded.
- [ ] Deprecated versions are recorded.
- [ ] Retired versions are recorded.
- [ ] Supported protocol versions are recorded.
- [ ] Supported artifact formats are recorded.
- [ ] Runtime compatibility is recorded.
- [ ] Architecture support is recorded.
- [ ] Capability support is recorded.

# 182. Full Acceptance Criteria — Testing

- [ ] Positive compatibility tests exist.
- [ ] Negative compatibility tests exist.
- [ ] API contract tests exist.
- [ ] Protocol negotiation tests exist.
- [ ] Artifact/runtime tests exist.
- [ ] Architecture mismatch tests exist.
- [ ] Capability mismatch tests exist.
- [ ] Rolling upgrade tests exist.
- [ ] Mixed-version tests exist.
- [ ] Security-block tests exist.
- [ ] Unknown-version tests exist.

# 183. Full Acceptance Criteria — Observability

- [ ] Compatibility evaluations are measurable.
- [ ] Hard failures are measurable.
- [ ] Soft warnings are measurable.
- [ ] Unknown states are measurable.
- [ ] Blocked states are measurable.
- [ ] Protocol negotiation failures are measurable.
- [ ] Architecture mismatches are measurable.
- [ ] Capability failures are measurable.
- [ ] Runtime incompatibilities are measurable.
- [ ] Compatibility cache invalidations are measurable.

# 184. Full Acceptance Criteria — Reproducibility

- [ ] Artifact digest is retained.
- [ ] Artifact format is retained.
- [ ] SDK version is retained.
- [ ] Runtime version is retained.
- [ ] KritvaOS version is retained.
- [ ] CPU architecture is retained.
- [ ] Platform version is retained.
- [ ] Lab Agent version is retained.
- [ ] Protocol version is retained.
- [ ] Capability revision is retained.

# 185. Full Acceptance Criteria — Security

- [ ] Security-blocked versions cannot execute.
- [ ] Authentication is performed independently.
- [ ] Authorization is performed independently.
- [ ] Compatibility does not bypass authorization.
- [ ] Compatibility does not bypass safety.
- [ ] Unknown security state is handled safely.
- [ ] Security policy can override technical compatibility.
- [ ] Emergency blocking is supported.

# 186. Architectural Invariants

The following are mandatory:

1. Version equality does not imply compatibility.
2. Compatibility is multidimensional.
3. Protocol compatibility is explicit.
4. API compatibility is explicit.
5. Artifact format compatibility is explicit.
6. SDK compatibility is explicit.
7. Runtime compatibility is explicit.
8. CPU architecture is a mandatory execution dimension.
9. Platform identity is separate from platform capability.
10. Mandatory capabilities are hard requirements.
11. Optional capabilities may produce warnings.
12. Unknown mandatory requirements do not pass.
13. Security blocks override technical compatibility.
14. Host architecture is distinct from target architecture.
15. Booking does not guarantee execution compatibility.
16. Compatibility must be checked before execution.
17. Compatibility must be checked again immediately before deployment.
18. Capability drift invalidates stale compatibility state.
19. Runtime drift invalidates affected compatibility state.
20. Scheduler selection must exclude hard-incompatible resources.
21. Rolling upgrades require an explicit compatibility window.
22. Mixed-version deployments must be tested.
23. Compatibility failures use stable machine-readable codes.
24. Compatibility results must be observable.
25. Physical safety remains an independent execution gate.

# 187. Final Production Baseline

The Kritva RaaS compatibility model is:

    USER
      |
      v
    AUTHENTICATION
      |
      v
    AUTHORIZATION
      |
      v
    ARTIFACT
      |
      +--> Format
      +--> SDK
      +--> Architecture
      +--> KritvaOS
      +--> Runtime
      +--> Platform
      +--> Capabilities
      |
      v
    SCHEDULER
      |
      +--> Agent Version
      +--> Protocol
      +--> Runtime
      +--> Capabilities
      +--> Health
      +--> Policy
      |
      v
    FINAL COMPATIBILITY CHECK
      |
      v
    SAFETY
      |
      v
    DEPLOYMENT
      |
      v
    EXECUTION

The essential compatibility rule is:

> **Every mandatory compatibility dimension must pass before execution.**

The essential failure rule is:

> **Hard incompatibility blocks execution; soft incompatibility may warn or
> degrade only when explicitly permitted; unknown compatibility is not success.**

The essential upgrade rule is:

> **Introduce compatible versions first, operate in a controlled mixed-version
> window, migrate consumers, and retire the old version only after compatibility
> evidence confirms migration.**

The essential physical execution rule is:

> **Compatibility must be validated against the actual selected resource,
> runtime, Lab Agent, architecture, capabilities, and security state immediately
> before deployment.**

The essential architectural rule is:

> **Authentication establishes who is communicating, authorization establishes
> what they may do, compatibility establishes whether the target environment
> can support the operation, and safety establishes whether physical execution
> may proceed.**

This compatibility architecture provides the production foundation for evolving
Kritva RaaS independently across Studio, Web Console, Control Plane, APIs,
protocols, artifacts, SDKs, runtimes, Lab Agents, CPU architectures, and robotic
platforms without allowing version drift or capability mismatch to become an
unsafe execution condition.
