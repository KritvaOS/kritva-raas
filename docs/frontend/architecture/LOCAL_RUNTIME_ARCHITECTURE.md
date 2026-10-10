# Kritva RaaS Studio Local Runtime Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Kritva RaaS Studio Local Runtime Architecture |
| Path | `docs/frontend/architecture/LOCAL_RUNTIME_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service |
| Application | Kritva RaaS Studio |
| Component | Studio Local Runtime |
| Native Framework | Rust |
| Desktop Shell | Tauri |
| UI | React + TypeScript |
| Local IPC | Tauri IPC |
| Build | Local developer machine |
| Artifact | `.krv` |
| Signing | Local signing integration |
| Status | Production Architecture Baseline |

## 2. Purpose

This document defines the architecture of the Rust-based Studio Local Runtime.

The Local Runtime is the privileged native subsystem of Kritva RaaS Studio.
It provides controlled access to local operating-system capabilities required
for robotics development.

The primary responsibility is to keep source code and development operations
local while producing a controlled execution artifact for remote RaaS
execution.

The fundamental boundary is:

    User Project
        |
        v
    Studio Local Runtime
        |
        +--> Workspace
        +--> Toolchains
        +--> Build
        +--> Test
        +--> Package
        +--> Sign
        +--> Validate
        |
        v
    .krv Artifact
        |
        v
    RaaS Control Plane

The Local Runtime does not become a generic shell execution service.

## 3. Scope

This document covers:

- Rust Local Runtime architecture;
- Tauri IPC;
- project management;
- workspace validation;
- filesystem access;
- toolchain detection;
- toolchain compatibility;
- build orchestration;
- test execution;
- process management;
- logs;
- cancellation;
- artifact packaging;
- artifact signing;
- artifact validation;
- artifact inspection;
- checksums;
- local configuration;
- security;
- permissions;
- resource limits;
- error handling;
- lifecycle management;
- local persistence;
- concurrency;
- cleanup;
- diagnostics;
- testing;
- Phase 0–8 implementation mapping.

It does not define:

- remote Control Plane implementation;
- PostgreSQL;
- cloud object storage;
- Lab Agent internals;
- robot runtime internals;
- physical robot safety;
- remote execution scheduling;
- cloud-side artifact validation.

## 4. Goals

The Local Runtime shall:

1. provide a secure native boundary for Studio;
2. manage local robotics projects;
3. validate project workspaces;
4. discover required toolchains;
5. orchestrate local builds;
6. execute local tests;
7. stream logs to the UI;
8. support cancellation;
9. package `.krv` artifacts;
10. validate artifact contents;
11. calculate artifact digests;
12. integrate artifact signing;
13. prevent accidental source upload;
14. isolate native operations from React;
15. provide structured errors;
16. provide diagnostics;
17. support long-running operations;
18. remain responsive during builds and tests;
19. provide deterministic behavior where possible;
20. support supported desktop platforms.

## 5. Non-Goals

The Local Runtime is not:

- a generic command shell;
- a remote execution engine;
- a cloud build farm;
- a source-code repository;
- a container orchestration system;
- a robot controller;
- a physical safety controller;
- a backend API server;
- a general-purpose process supervisor for arbitrary applications.

## 6. Architectural Principle

The primary principle is:

> **Build locally, execute remotely.**

The source code remains on the developer's machine.

Only the explicitly generated and validated execution artifact crosses the
RaaS boundary.

    Source
      |
      v
    Local Build
      |
      v
    Local Test
      |
      v
    .krv Package
      |
      v
    Local Validation
      |
      v
    Explicit Upload
      |
      v
    Remote RaaS

This architecture reduces source-code exposure and avoids requiring a remote
build farm for the initial RaaS product.

## 7. Runtime Boundary

The Studio architecture is:

    +---------------------------------------------------------------+
    |                     Kritva RaaS Studio                        |
    +---------------------------------------------------------------+
    |                                                               |
    |  React UI                                                     |
    |      |                                                        |
    |      | Tauri IPC                                              |
    |      v                                                        |
    |  Rust Local Runtime                                           |
    |      |                                                        |
    |      +--> Workspace Manager                                   |
    |      +--> Toolchain Manager                                  |
    |      +--> Build Manager                                      |
    |      +--> Test Manager                                       |
    |      +--> Artifact Manager                                   |
    |      +--> Process Manager                                    |
    |      +--> Log Manager                                        |
    |      +--> Security Manager                                   |
    |      +--> Diagnostics                                        |
    |                                                               |
    +---------------------------------------------------------------+
             |
             +--> Local Filesystem
             +--> Compiler / Build Tools
             +--> Test Tools
             +--> Signing Tools

## 8. Design Rationale

Rust is used because the Local Runtime requires:

- memory safety;
- explicit resource management;
- strong concurrency primitives;
- controlled process execution;
- filesystem safety;
- predictable native integration;
- good cross-platform support.

React remains responsible for presentation.

Rust remains responsible for privileged native operations.

## 9. Runtime Layering

The Local Runtime follows:

    Tauri Command Layer
          |
          v
    Application Services
          |
          v
    Domain Services
          |
          +---------------------+
          |                     |
          v                     v
    Infrastructure         Process / Filesystem
          |
          v
    Operating System

The command layer must remain thin.

Business and security logic must not be implemented directly inside Tauri
command handlers.

## 10. Major Components

| Component | Responsibility |
|---|---|
| IPC Layer | Tauri command/event boundary |
| Workspace Manager | Projects and local paths |
| Toolchain Manager | Detection and compatibility |
| Build Manager | Build orchestration |
| Test Manager | Test execution |
| Process Manager | Controlled subprocess lifecycle |
| Log Manager | Structured output and streaming |
| Artifact Manager | Packaging and inspection |
| Signing Manager | Artifact signing |
| Validation Manager | Artifact/workspace validation |
| Cancellation Manager | Cooperative process cancellation |
| Security Manager | Capability and path enforcement |
| Persistence Manager | Safe local metadata |
| Diagnostics Manager | System diagnostics |

## 11. Tauri IPC Boundary

The React application interacts with the Local Runtime only through explicit
Tauri IPC operations.

Baseline commands include:

    studio.project.open
    studio.project.create
    studio.project.validate
    toolchain.detect
    test.start
    test.status
    test.cancel
    artifact.package
    artifact.inspect
    artifact.validate
    system.info

Build-specific commands may include:

    build.configure
    build.start
    build.status
    build.logs
    build.cancel
    build.result

The final command names must remain aligned with the shared protocol contract.

## 12. IPC Command Contract

Each command should have:

- command name;
- request schema;
- response schema;
- operation ID where asynchronous;
- validation rules;
- authorization/context rules;
- cancellation semantics;
- error codes.

Conceptual request:

    {
        "operation_id": "op-123",
        "project_id": "project-001",
        "payload": {}
    }

Conceptual response:

    {
        "operation_id": "op-123",
        "status": "ACCEPTED",
        "data": {}
    }

## 13. IPC Principle

The UI must request an operation.

The UI must not receive arbitrary native privileges.

For example, the UI may request:

    build.start

but must not request:

    execute arbitrary shell command

This distinction is fundamental to the security model.

## 14. Project Model

A local project contains:

- local filesystem root;
- project metadata;
- source;
- build configuration;
- target configuration;
- test configuration;
- artifact configuration.

Remote project metadata may additionally contain:

- project ID;
- organization ID;
- platform references;
- remote artifacts;
- bookings;
- runs.

Local and remote project identities must not be conflated.

## 15. Workspace Model

A workspace is the validated local representation of a project.

Conceptually:

    Workspace
      |
      +--> Root Directory
      +--> Project Metadata
      +--> Source
      +--> Build Configuration
      +--> Test Configuration
      +--> Artifact Configuration

The Workspace Manager owns workspace lifecycle.

## 16. Workspace Lifecycle

    PATH_SELECTED
        |
        v
    DISCOVERING
        |
        v
    VALIDATING
        |
        v
    READY
        |
        +--> INVALID
        |
        v
    OPEN
        |
        v
    CLOSED

Workspace state must be persisted only when safe and necessary.

## 17. Workspace Root Validation

The runtime must validate:

- path exists;
- path is accessible;
- expected project structure;
- configuration validity;
- supported project type;
- filesystem permissions.

Symbolic links and path traversal must be handled explicitly.

## 18. Path Security

All paths supplied through IPC are untrusted inputs.

The runtime must:

- normalize paths;
- canonicalize where appropriate;
- reject traversal;
- enforce allowed roots;
- validate symlink behavior;
- avoid unintended access outside workspace scope.

A project cannot grant the application arbitrary filesystem access.

## 19. Project Creation

Project creation flow:

    User selects location
        |
        v
    Rust validates location
        |
        v
    Create project directory
        |
        v
    Create project metadata
        |
        v
    Initialize workspace
        |
        v
    Return workspace identity

Directory creation must fail safely if the destination already contains
unexpected content.

## 20. Project Opening

Open flow:

    Directory
       |
       v
    Canonicalize
       |
       v
    Discover
       |
       v
    Validate
       |
       v
    Load Configuration
       |
       v
    Detect Toolchain
       |
       v
    READY

The UI receives structured workspace information rather than direct filesystem
objects.

## 21. Workspace Configuration

Configuration should identify:

- project type;
- target platform;
- target architecture;
- SDK;
- runtime;
- build system;
- build profiles;
- test configuration;
- artifact configuration.

Configuration must be versioned.

## 22. Toolchain Manager

The Toolchain Manager discovers locally installed development tools.

Potential tools include:

- GCC;
- Clang;
- CMake;
- Ninja;
- Make;
- ROS 2;
- Kritva SDK;
- target-specific SDKs;
- packaging/signing tools.

The supported tool list is platform-dependent.

## 23. Toolchain Detection

Detection flow:

    Detect Request
        |
        v
    Candidate Discovery
        |
        v
    Version Detection
        |
        v
    Capability Detection
        |
        v
    Compatibility Evaluation
        |
        v
    Toolchain Report

The runtime should avoid expensive full-system scans.

## 24. Toolchain Detection Output

Conceptual result:

    {
        "tool": "cmake",
        "path": "/usr/bin/cmake",
        "version": "x.y.z",
        "status": "SUPPORTED",
        "capabilities": []
    }

The exact schema belongs in shared contracts.

## 25. Toolchain Search

Preferred search order:

1. project-configured path;
2. explicit Studio configuration;
3. supported environment configuration;
4. platform-standard locations;
5. controlled PATH lookup.

Arbitrary filesystem crawling is prohibited.

## 26. Toolchain Compatibility

Compatibility evaluates:

- tool version;
- host OS;
- host architecture;
- target architecture;
- SDK version;
- runtime requirements;
- project requirements.

A tool may be:

    FOUND
    SUPPORTED
    UNSUPPORTED
    MISSING
    INVALID
    UNKNOWN

## 27. Toolchain Configuration

The user may configure preferred tools in Settings.

Configuration should identify:

- executable path;
- version;
- target;
- SDK;
- environment variables required.

The runtime validates configured paths before use.

## 28. Environment Variables

Environment handling must be explicit.

The runtime should construct a controlled environment from:

- safe system defaults;
- approved project variables;
- toolchain configuration;
- operation-specific variables.

It should not blindly inherit all sensitive environment variables.

## 29. Secret Environment Variables

The runtime must avoid propagating secrets such as:

- cloud credentials;
- access tokens;
- private keys;
- unrelated service credentials.

Sensitive environment variables should be filtered according to policy.

## 30. Build Manager

The Build Manager orchestrates local compilation.

Responsibilities:

- resolve build configuration;
- validate toolchain;
- create build operation;
- launch processes;
- stream output;
- monitor status;
- handle cancellation;
- collect results;
- clean temporary resources.

## 31. Build Orchestration

    Build Request
        |
        v
    Validate Workspace
        |
        v
    Resolve Toolchain
        |
        v
    Resolve Configuration
        |
        v
    Prepare Build Directory
        |
        v
    Launch Process
        |
        v
    Stream Output
        |
        v
    Monitor
        |
        v
    Collect Result
        |
        v
    Cleanup

## 32. Build Directory

Build output should be separated from source where practical.

Example conceptual structure:

    project/
      src/
      include/
      config/
      build/
      dist/
      .kritva/

The exact directory names are project-specific.

Generated files must not be mistaken for source inputs.

## 33. Build Profiles

Baseline profiles:

    Debug
    Release

Additional target-specific profiles may be introduced later.

The profile must be part of the build identity.

## 34. Build Identity

A build operation should have:

- operation ID;
- project identity;
- configuration hash;
- toolchain identity;
- target platform;
- target architecture;
- start time;
- end time;
- result.

This enables reproducibility and diagnostics.

## 35. Build Determinism

Where practical, builds should record:

- compiler version;
- linker version;
- SDK version;
- build flags;
- target architecture;
- environment;
- source revision;
- configuration.

The runtime should not claim perfect reproducibility unless all required
inputs are controlled.

## 36. Process Manager

All compiler and test subprocesses are managed through the Process Manager.

The Process Manager owns:

- process creation;
- argument construction;
- environment;
- working directory;
- process groups;
- stdout;
- stderr;
- exit status;
- cancellation;
- cleanup.

## 37. Process Execution Security

The runtime must never construct commands by concatenating untrusted strings.

Preferred:

    executable
        +
    validated argument vector
        +
    controlled environment

rather than:

    shell command string

Shell invocation should be avoided unless explicitly required by a supported
build system and safely constrained.

## 38. Process Resource Controls

Where supported, the runtime should enforce:

- maximum concurrent operations;
- output limits;
- timeout;
- process tree termination;
- temporary storage limits.

Exact resource limits may vary by host platform.

## 39. Concurrent Operations

The runtime must prevent unsafe conflicts.

Examples:

- two builds for the same workspace;
- packaging while a build is active;
- deleting a workspace during a build;
- changing toolchain configuration while a process is active.

Operations should return structured conflict errors.

## 40. Build Concurrency Policy

Initial policy:

    One active build per workspace.

Different workspaces may build concurrently subject to global resource limits.

This avoids ambiguous build outputs and reduces local resource contention.

## 41. Test Manager

The Test Manager provides controlled local test execution.

Responsibilities:

- test discovery;
- test selection;
- test execution;
- output streaming;
- cancellation;
- result collection.

## 42. Test Flow

    Build
      |
      v
    Test Configuration
      |
      v
    Discover Tests
      |
      v
    Execute
      |
      v
    Stream Logs
      |
      v
    Collect Results
      |
      v
    PASS / FAIL / CANCELLED

## 43. Test Isolation

Tests should run in a controlled working directory.

Where practical:

- test output is isolated;
- generated files are separated;
- environment is controlled;
- process trees are tracked.

## 44. Test Results

Test results should include:

- operation ID;
- test suite;
- test count;
- passed;
- failed;
- skipped;
- duration;
- exit status;
- log reference.

The UI receives a structured summary plus streamed logs.

## 45. Cancellation

Cancellation is cooperative first and forceful second.

    Cancel Request
        |
        v
    Mark CANCELLING
        |
        v
    Graceful Process Termination
        |
        +--> Exits
        |
        v
    Process Tree Cleanup
        |
        +--> Force Termination if required
        |
        v
    CANCELLED

The runtime must prevent orphaned child processes.

## 46. Cancellation Semantics

Cancellation must be:

- operation-specific;
- idempotent;
- observable;
- bounded in completion time.

A second cancellation request must not create a second termination sequence.

## 47. Cancellation and UI

The UI displays:

    RUNNING
       |
       v
    CANCELLING
       |
       v
    CANCELLED

It must not immediately show `CANCELLED` before the runtime confirms final
process state.

## 48. Log Manager

The Log Manager provides structured local operation output.

Sources include:

- build stdout;
- build stderr;
- test output;
- packaging;
- signing;
- validation.

## 49. Log Event

Conceptual event:

    {
        "operation_id": "op-123",
        "timestamp": "2026-10-08T00:00:01Z",
        "stream": "stderr",
        "severity": "ERROR",
        "message": "compiler error"
    }

The canonical IPC event schema should be defined in shared contracts.

## 50. Log Streaming

Flow:

    Process
        |
        +--> stdout
        +--> stderr
              |
              v
        Log Manager
              |
              v
        Normalize
              |
              v
        Buffer
              |
              v
        Tauri Event
              |
              v
        React UI

## 51. Log Backpressure

The runtime must handle processes producing output faster than the UI can
consume it.

Strategies include:

- bounded buffers;
- batching;
- event coalescing;
- disk-backed operation logs where necessary;
- UI throttling.

The runtime must not allow unbounded memory growth.

## 52. Log Retention

Active operations retain logs for UI streaming.

Completed operation logs may be stored as local diagnostics for a bounded
period.

Long-term authoritative execution logs belong to the RaaS backend when the
operation is remote.

## 53. Artifact Manager

The Artifact Manager transforms validated local build output into a `.krv`
execution artifact.

Responsibilities:

- collect allowed files;
- generate manifest;
- validate manifest;
- calculate digest;
- sign artifact;
- validate package;
- expose package metadata.

## 54. Artifact Packaging Flow

    Build Output
        |
        v
    Allowlist Selection
        |
        v
    Package Staging
        |
        v
    Manifest Generation
        |
        v
    Package Creation
        |
        v
    Digest
        |
        v
    Signature
        |
        v
    Final Validation
        |
        v
    .krv

## 55. Artifact Allowlist

The package builder must use an explicit allowlist.

Allowed categories may include:

- executable;
- required shared libraries;
- runtime configuration;
- manifest;
- approved resources.

Everything else is excluded by default.

## 56. Artifact Denylist

A denylist may provide defense in depth for:

- source files;
- Git metadata;
- credentials;
- private keys;
- build caches;
- editor metadata;
- unrelated binaries.

A denylist must not replace the allowlist.

## 57. Source Detection

The Local Runtime should detect obvious source-code leakage attempts.

Potential checks include:

- source extensions;
- Git directories;
- SSH keys;
- credential files;
- environment files;
- secret patterns.

Detection is a safety mechanism, not a mathematical guarantee that source cannot
be reconstructed from binaries.

## 58. Artifact Manifest

The manifest must identify:

- application;
- version;
- platform;
- platform version where applicable;
- architecture;
- KritvaOS requirements;
- runtime requirements;
- SDK requirements;
- required capabilities;
- package format version;
- digest;
- signing metadata.

## 59. Artifact Identity

Artifact identity is based on:

    artifact_id
        +
    content_digest

Artifacts are immutable.

Changing package content creates a new artifact identity.

## 60. Artifact Digest

The runtime calculates a cryptographic digest over the canonical artifact
content.

The digest is used for:

- integrity;
- identity;
- upload verification;
- compatibility;
- result traceability.

The exact algorithm must be fixed by the artifact specification.

## 61. Artifact Signing

Production artifacts should be signed.

Signing flow:

    Final Package
        |
        v
    Canonicalization
        |
        v
    Digest
        |
        v
    Signing Key
        |
        v
    Signature
        |
        v
    Signed Artifact

Signing keys must not be embedded in source code or ordinary application
configuration.

## 62. Signing Key Storage

The architecture should prefer OS-protected secure storage or an approved
external signing mechanism.

Potential mechanisms:

- OS keychain;
- secure hardware-backed key;
- managed signing service.

The initial implementation may support a local developer signing key, but
production policy must distinguish development and production trust.

## 63. Signing Policy

Artifact signing states may include:

    UNSIGNED
    SIGNED
    SIGNATURE_INVALID
    KEY_UNAVAILABLE
    KEY_REVOKED

Production upload policy may require `SIGNED`.

## 64. Artifact Validation

Validation occurs at multiple stages:

    Workspace Validation
          |
          v
    Build Validation
          |
          v
    Package Validation
          |
          v
    Signature Validation
          |
          v
    Upload Validation
          |
          v
    Remote Validation
          |
          v
    Lab Validation

The local runtime must not assume local validation replaces server validation.

## 65. Package Inspection

Inspection should verify:

- package format;
- manifest;
- required fields;
- package contents;
- prohibited files;
- digest;
- signature;
- target;
- architecture;
- runtime;
- SDK;
- capabilities.

## 66. Artifact Size

The runtime should enforce configured package size limits before upload.

Oversized packages should fail locally where possible.

This avoids unnecessary network transfer.

## 67. Temporary Files

Packaging uses a controlled temporary directory.

Requirements:

- unique operation directory;
- restrictive permissions;
- cleanup on success;
- cleanup on failure;
- cleanup after cancellation;
- no sensitive data left unnecessarily.

## 68. Atomic Output

Final artifact creation should be atomic where practical.

Preferred:

    Temporary Artifact
        |
        v
    Validate
        |
        v
    Rename/Commit
        |
        v
    Final .krv

This prevents partial artifacts from being presented as complete.

## 69. Artifact Upload Boundary

The Local Runtime creates the artifact.

The API client uploads it.

Preferred flow:

    Rust Artifact Manager
        |
        v
    Validated .krv
        |
        v
    React/API Client
        |
        v
    Control Plane

The API client must not independently package arbitrary project files.

## 70. Upload Preflight

Before upload the UI/runtime should confirm:

- package exists;
- package is complete;
- digest available;
- signature state known;
- target platform known;
- architecture known;
- runtime/SDK known;
- size acceptable.

## 71. Error Model

The Local Runtime uses structured errors.

Categories include:

    Workspace
    Toolchain
    Build
    Test
    Process
    Artifact
    Signing
    Validation
    Filesystem
    Permission
    Cancellation
    Configuration
    IPC
    Resource

## 72. Error Structure

Conceptual error:

    {
        "code": "LOCAL_BUILD_FAILED",
        "message": "The local build failed.",
        "operation_id": "op-123",
        "retryable": false,
        "details": {}
    }

Error codes are stable machine-readable identifiers.

Messages are human-readable and may evolve.

## 73. Local Error Codes

Baseline codes include:

    LOCAL_TOOLCHAIN_NOT_FOUND
    LOCAL_TOOLCHAIN_UNSUPPORTED
    LOCAL_WORKSPACE_INVALID
    LOCAL_WORKSPACE_NOT_FOUND
    LOCAL_PATH_DENIED
    LOCAL_PERMISSION_DENIED
    LOCAL_BUILD_FAILED
    LOCAL_BUILD_CANCELLED
    LOCAL_TEST_FAILED
    LOCAL_TEST_CANCELLED
    LOCAL_PROCESS_START_FAILED
    LOCAL_PROCESS_TIMEOUT
    LOCAL_PROCESS_CANCEL_FAILED
    LOCAL_ARTIFACT_PACKAGE_FAILED
    LOCAL_ARTIFACT_INVALID
    LOCAL_ARTIFACT_SOURCE_DETECTED
    LOCAL_ARTIFACT_TOO_LARGE
    LOCAL_SIGNATURE_FAILED
    LOCAL_VALIDATION_FAILED
    LOCAL_OPERATION_CONFLICT
    LOCAL_CONFIGURATION_INVALID

## 74. Error Mapping

Rust errors are mapped before crossing the IPC boundary.

    OS Error
       |
       v
    Rust Domain Error
       |
       v
    Stable Local Error Code
       |
       v
    IPC Response/Event
       |
       v
    UI Error Presentation

Raw OS errors should not become the public frontend contract.

## 75. Retry Policy

Retry is operation-specific.

Safe candidates:

- transient tool detection failure;
- temporary filesystem contention;
- interrupted non-mutating inspection.

Do not blindly retry:

- build;
- test;
- packaging;
- signing;
- destructive filesystem operations.

A retry must not produce ambiguous outputs.

## 76. Operation Manager

Long-running local operations should have:

- operation ID;
- type;
- state;
- start time;
- cancellation handle;
- process reference;
- log stream;
- result;
- error.

Example states:

    CREATED
    QUEUED
    RUNNING
    CANCELLING
    COMPLETED
    FAILED
    CANCELLED
    TIMEOUT

## 77. Operation Registry

The runtime maintains an in-memory registry for active operations.

Example:

    operation_id
        |
        +--> workspace
        +--> type
        +--> process
        +--> cancellation token
        +--> log channel
        +--> state

Completed operations should be removed from active state after their results
are safely delivered.

## 78. Runtime Startup

Startup sequence:

    Tauri Start
        |
        v
    Initialize Configuration
        |
        v
    Initialize Security Policy
        |
        v
    Initialize Operation Manager
        |
        v
    Initialize Workspace Manager
        |
        v
    Initialize Diagnostics
        |
        v
    Register IPC Commands
        |
        v
    READY

## 79. Runtime Shutdown

Shutdown sequence:

    Shutdown Requested
        |
        v
    Reject New Operations
        |
        v
    Signal Active Operations
        |
        v
    Graceful Cleanup
        |
        v
    Terminate Remaining Processes
        |
        v
    Flush Diagnostics
        |
        v
    Exit

The runtime must avoid leaving orphaned child processes.

## 80. Crash Recovery

After an unexpected Studio termination:

- stale operation state must not be treated as running;
- child process cleanup should be attempted on next startup;
- temporary directories should be cleaned;
- incomplete artifacts should be ignored;
- diagnostics should record abnormal termination.

## 81. Local Persistence

The Local Runtime may persist:

- safe project metadata;
- toolchain discovery cache;
- operation history metadata;
- Studio preferences where appropriate;
- diagnostic references.

It must not persist:

- access tokens in arbitrary files;
- refresh tokens outside secure storage;
- private signing keys in plaintext;
- credentials;
- source snapshots unnecessarily.

## 82. Cache Strategy

Toolchain and non-sensitive metadata may be cached.

Cache entries require:

- version;
- timestamp;
- host identity;
- invalidation rules.

Caches must never become authoritative for security decisions.

## 83. Configuration Precedence

Recommended precedence:

    Explicit Operation Configuration
        |
        v
    Project Configuration
        |
        v
    Studio Settings
        |
        v
    Platform Defaults

Security restrictions always override user configuration.

## 84. Resource Limits

The Local Runtime should define:

- maximum active builds;
- maximum active tests;
- maximum log buffer;
- maximum artifact size;
- maximum operation duration where appropriate;
- temporary storage thresholds.

Limits should be configurable by supported policy without allowing unsafe
unbounded values.

## 85. Disk Space

Before build/package operations the runtime should check available disk space
where practical.

Failure should produce:

    LOCAL_INSUFFICIENT_STORAGE

rather than a generic build failure when the condition can be identified.

## 86. File Permissions

Generated files should use appropriate platform permissions.

Sensitive temporary files should not be world-readable.

Unix-specific permissions must be applied where supported.

## 87. Symlink Handling

Symlinks require explicit policy.

The package builder must not follow a symlink outside the allowed workspace
without explicit approval and validation.

This prevents path escape during artifact packaging.

## 88. Archive Security

If packaging uses an archive format, the runtime must protect against:

- path traversal;
- absolute paths;
- duplicate file ambiguity;
- symlink escapes;
- malformed archives;
- decompression/resource bombs.

## 89. Supply-Chain Validation

Toolchains and packaging utilities should be identified by:

- executable path;
- version;
- expected tool;
- optional digest/signature.

The runtime should provide diagnostics when an unexpected executable is selected.

## 90. Build Reproducibility

The runtime should capture:

- tool versions;
- target;
- profile;
- relevant configuration;
- source revision;
- SDK;
- runtime;
- build timestamp.

This information becomes part of build metadata.

## 91. Build-to-Artifact Traceability

A generated artifact should be traceable to:

    Project
       |
       v
    Build ID
       |
       v
    Configuration
       |
       v
    Toolchain
       |
       v
    Artifact ID / Digest

This enables debugging and experiment reproducibility.

## 92. Artifact-to-Run Traceability

Remote execution records should reference:

    Artifact Digest
       |
       v
    Booking
       |
       v
    Job
       |
       v
    Run
       |
       v
    Result

The Local Runtime contributes the immutable artifact identity.

## 93. Diagnostics

Diagnostics should expose:

- runtime version;
- Studio version;
- host OS;
- host architecture;
- workspace;
- toolchain versions;
- active operations;
- disk space;
- connectivity state if supplied by Studio;
- recent local error codes.

Secrets must be excluded.

## 94. Health State

The runtime may expose:

    READY
    DEGRADED
    ERROR

Example degraded conditions:

- optional tool missing;
- insufficient disk space warning;
- signing key unavailable;
- stale toolchain cache.

Critical native failures may prevent specific operations without necessarily
making Studio unusable.

## 95. Observability

Local runtime telemetry may include:

- build duration;
- test duration;
- packaging duration;
- toolchain detection duration;
- operation failures;
- cancellation latency;
- artifact size;
- IPC errors.

Telemetry must not include source code or secrets.

## 96. Privacy

The runtime should minimize collection.

It should not automatically upload:

- source files;
- compiler source paths where avoidable;
- environment variables;
- credentials;
- local filenames unrelated to diagnostics.

Diagnostic data should be explicitly classified before remote submission.

## 97. Logging Security

Logs must redact:

- access tokens;
- refresh tokens;
- API keys;
- private keys;
- credentials;
- secret environment variables.

Redaction should occur before logs cross the UI or diagnostic boundary.

## 98. Build Environment Isolation

The runtime should isolate build environment variables from the Studio process
where practical.

A failed build must not mutate Studio's own process environment.

## 99. Process Tree Management

Build and test operations may create child processes.

The Process Manager must track the process tree sufficiently to support
cancellation and cleanup.

Example:

    Build Process
       |
       +--> Compiler
       +--> Linker
       +--> Helper
       +--> Test Process

Cancellation must not terminate unrelated user processes.

## 100. Platform Abstraction

The Local Runtime should expose platform-neutral services:

    Filesystem
    Process
    SecureStorage
    Path
    Environment
    Signing

Platform-specific implementation remains behind Rust traits/interfaces.

## 101. Native Interface Example

Conceptual interface:

    trait ProcessRunner {
        fn start(request: ProcessRequest) -> Result<ProcessHandle>;
        fn cancel(handle: ProcessHandle) -> Result<()>;
        fn status(handle: ProcessHandle) -> Result<ProcessStatus>;
    }

The exact implementation may differ, but the boundary should remain explicit.

## 102. Filesystem Interface

Conceptual responsibilities:

    WorkspaceFilesystem
        open_project()
        validate_path()
        create_directory()
        inspect()
        copy_allowed()
        remove_temporary()
        atomic_commit()

The interface must enforce workspace policy.

## 103. Toolchain Interface

Conceptual responsibilities:

    ToolchainProvider
        discover()
        inspect()
        validate()
        capabilities()

Providers may exist for:

- GCC;
- Clang;
- CMake;
- ROS2;
- Kritva SDK.

## 104. Build Interface

Conceptual interface:

    BuildService
        configure()
        start()
        status()
        cancel()
        result()

The service owns build orchestration, not React.

## 105. Test Interface

Conceptual interface:

    TestService
        discover()
        start()
        status()
        cancel()
        result()

Test execution should reuse Process Manager infrastructure.

## 106. Artifact Interface

Conceptual interface:

    ArtifactService
        inspect()
        package()
        validate()
        digest()
        sign()
        verify()

Signing must remain isolated from ordinary packaging logic.

## 107. Cancellation Interface

Conceptual interface:

    CancellationRegistry
        register(operation_id)
        request(operation_id)
        is_cancelled(operation_id)
        complete(operation_id)

Cancellation tokens must propagate to all layers participating in an
operation.

## 108. Event Model

Local events may include:

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

Events are local IPC events and must not be confused with remote RaaS events.

## 109. Local Event Delivery

Local events should be:

- operation-scoped;
- structured;
- validated;
- bounded;
- cancellable where applicable.

The UI must tolerate missed transient events by querying operation status.

## 110. State Recovery

If an event is missed:

    UI detects missing state
        |
        v
    operation.status
        |
        v
    Runtime State
        |
        v
    UI Reconciliation

The runtime should expose authoritative operation status for active operations.

## 111. Workspace Locking

The runtime should prevent conflicting operations against the same workspace.

Potential policy:

    Workspace
       |
       +--> Build Lock
       +--> Packaging Lock
       +--> Configuration Lock

Read-only inspection may continue concurrently where safe.

## 112. Build and Package Ordering

Packaging should require a known build result.

Preferred:

    Build Complete
       |
       v
    Verify Output
       |
       v
    Package

A stale build output should not silently become the new artifact.

## 113. Stale Output Detection

The runtime should identify stale outputs using appropriate metadata such as:

- build ID;
- configuration hash;
- source revision;
- timestamps.

If freshness cannot be established, the UI should request a rebuild or explicit
confirmation.

## 114. Artifact Validation Before Upload

Minimum local checks:

- format valid;
- manifest valid;
- package complete;
- digest valid;
- signature policy satisfied;
- target identified;
- architecture identified;
- prohibited files absent.

Remote validation remains mandatory.

## 115. Signing Failure

If signing fails:

    Package
       |
       v
    Signing
       |
       X
    SIGNATURE_FAILED
       |
       v
    Do Not Mark Production-Ready

An unsigned artifact may be allowed for development only if policy explicitly
permits it.

## 116. Local Development Mode

Development mode may relax selected production constraints.

Examples:

- unsigned artifacts;
- verbose logs;
- test signing keys.

Development mode must be explicitly identifiable and must not silently apply
production trust.

## 117. Production Mode

Production mode requires stricter policy:

- approved artifact format;
- required signature;
- approved target;
- compatible runtime;
- approved SDK;
- prohibited content checks.

## 118. Security Policy Separation

Policy should distinguish:

    Development Policy
        |
        v
    Staging Policy
        |
        v
    Production Policy

The UI may display the current policy mode.

The Local Runtime enforces the policy.

## 119. Failure Recovery

For a failed operation:

    Failure
       |
       +--> Preserve useful diagnostics
       +--> Cleanup temporary resources
       +--> Release workspace lock
       +--> Release process resources
       +--> Return stable error
       v
    READY

Failure recovery must not leave the workspace permanently locked.

## 120. Timeout

Operations may have timeouts.

A timeout results in:

    TIMEOUT
       |
       v
    Cancellation
       |
       v
    Process Cleanup
       |
       v
    Final State

Timeout does not automatically imply that all child processes were successfully
terminated until cleanup confirms it.

## 121. Resource Cleanup

Cleanup is required for:

- child processes;
- pipes;
- event subscriptions;
- temporary directories;
- locks;
- cancellation registrations;
- file handles.

Cleanup must run on:

- success;
- failure;
- cancellation;
- timeout;
- runtime shutdown.

## 122. Testing Strategy

Local Runtime testing includes:

    Unit Tests
        |
        v
    Service Tests
        |
        v
    IPC Tests
        |
        v
    Process Integration Tests
        |
        v
    Artifact Tests
        |
        v
    Cross-Platform Tests
        |
        v
    Studio E2E

## 123. Unit Testing

Unit tests cover:

- path validation;
- configuration;
- error mapping;
- state transitions;
- artifact manifest;
- digest;
- policy;
- cancellation;
- compatibility.

## 124. Process Testing

Integration tests should use controlled test executables.

Test:

- successful process;
- failed process;
- stdout;
- stderr;
- non-zero exit;
- timeout;
- cancellation;
- child processes;
- output flooding.

## 125. Filesystem Testing

Test:

- valid project;
- invalid project;
- nonexistent path;
- permission failure;
- symlink escape;
- path traversal;
- temporary cleanup;
- atomic output.

Tests should use isolated temporary directories.

## 126. Artifact Testing

Test:

- valid package;
- malformed package;
- missing manifest;
- prohibited source;
- digest mismatch;
- signature mismatch;
- oversized package;
- path traversal;
- symlink escape.

## 127. Signing Testing

Test:

- valid key;
- missing key;
- invalid key;
- signature verification;
- revoked/untrusted key;
- development signing;
- production signing policy.

## 128. Cancellation Testing

Test:

- cancellation before start;
- cancellation while running;
- cancellation during output;
- repeated cancellation;
- cancellation timeout;
- child-process cleanup;
- cancellation during packaging.

## 129. IPC Testing

Test:

- valid command;
- invalid request;
- unauthorized capability;
- malformed path;
- operation conflict;
- cancellation;
- event delivery;
- status reconciliation.

## 130. Cross-Platform Testing

Minimum supported host categories should be validated independently:

    Linux x86_64
    Windows x86_64

Planned:

    macOS Apple Silicon

Additional platforms require explicit support qualification.

## 131. Phase Mapping

| Phase | Local Runtime Scope |
|---|---|
| Phase 0 | Native foundation |
| Phase 1 | Runtime/session integration |
| Phase 2 | Workspace/build/test/artifact |
| Phase 3 | Control Plane integration |
| Phase 4 | Booking/credit integration |
| Phase 5 | Remote execution integration |
| Phase 6 | Lab/robot compatibility |
| Phase 7 | Live/result integration |
| Phase 8 | Production hardening |

## 132. Phase 0 — Native Foundation

Implement:

- Tauri Rust foundation;
- IPC framework;
- service boundaries;
- security policy;
- operation registry;
- diagnostics;
- testing framework.

Gate:

- native runtime starts;
- IPC command works;
- no arbitrary shell API exists.

## 133. Phase 1 — Studio Integration

Implement:

- application lifecycle;
- secure configuration;
- project path handling;
- session integration;
- runtime status;
- diagnostics.

Gate:

- Studio reliably communicates with Rust runtime.

## 134. Phase 2 — Local Development

Implement:

- workspace;
- toolchain detection;
- build;
- tests;
- logs;
- cancellation;
- artifact packaging;
- validation;
- signing.

Gate:

    Source
      |
      v
    Build
      |
      v
    Test
      |
      v
    .krv
      |
      v
    Signed / Validated

## 135. Phase 3 — Control Plane

Implement:

- artifact metadata synchronization;
- upload integration;
- remote project metadata;
- API error mapping;
- upload status.

Gate:

- validated local `.krv` can be uploaded without source directory transfer.

## 136. Phase 4 — Booking and Credits

Implement Studio integration for:

- platform selection;
- availability;
- booking;
- credit quote;
- credit balance.

The Local Runtime itself remains primarily local; remote commercial state remains
owned by the Control Plane.

## 137. Phase 5 — Remote Execution

Integrate:

- artifact selection;
- compatibility preflight;
- job start;
- job stop;
- remote job status.

Local Runtime provides the artifact; the Control Plane owns remote execution.

## 138. Phase 6 — Lab and Robot

Support frontend/runtime diagnostics for:

- platform compatibility;
- architecture;
- SDK;
- runtime;
- capabilities.

The Local Runtime does not directly control remote robots.

## 139. Phase 7 — Live and Results

The Local Runtime supports:

- local diagnostics;
- artifact identity;
- local build provenance.

Live telemetry, video, and remote logs are handled by Studio's remote
communication architecture rather than by the Local Runtime.

## 140. Phase 8 — Production

Complete:

- security hardening;
- cross-platform qualification;
- performance;
- crash recovery;
- signed updates;
- artifact signing policy;
- diagnostics;
- production test suite;
- operational documentation.

## 141. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Arbitrary command execution | Critical | Explicit IPC operations |
| Path traversal | Critical | Canonicalization and root policy |
| Source leakage | Critical | Allowlist packaging |
| Secret leakage | Critical | Environment/log redaction |
| Orphan processes | High | Process-tree management |
| Memory growth | High | Bounded buffers |
| Toolchain mismatch | High | Version detection |
| Artifact corruption | High | Digest/atomic output |
| Signing compromise | Critical | Secure key storage |
| Build conflicts | Medium | Workspace locking |
| Stale artifacts | High | Build provenance |
| Runtime crash | High | Cleanup/recovery |
| Cross-platform differences | High | Platform abstraction/tests |
| UI/runtime desynchronization | High | Operation status reconciliation |

## 142. Risk — Arbitrary Execution

A generic command API could turn Studio into an unrestricted local execution
broker.

Mitigation:

- fixed command set;
- validated arguments;
- approved executables;
- controlled working directories;
- explicit operation types.

## 143. Risk — Source Leakage

Packaging could accidentally include source or secrets.

Mitigation:

- allowlist;
- denylist defense in depth;
- source detection;
- manifest inspection;
- package inspection;
- explicit upload;
- remote validation.

## 144. Risk — Signing Key Exposure

A compromised signing key could allow unauthorized artifacts.

Mitigation:

- OS secure storage;
- least privilege;
- separate development and production keys;
- key rotation;
- revocation;
- signing audit metadata.

## 145. Risk — Orphaned Processes

A failed Studio process could leave compiler/test processes running.

Mitigation:

- process tree tracking;
- shutdown cleanup;
- startup recovery;
- cancellation tests;
- platform-specific process-group handling.

## 146. Risk — Build Reproducibility

Local environments vary substantially.

Mitigation:

- record toolchain versions;
- record target;
- record configuration;
- capture SDK/runtime;
- report environment metadata;
- avoid claiming deterministic builds without evidence.

## 147. Risk — Long Build Output

A compiler can produce millions of log lines.

Mitigation:

- bounded buffers;
- batched IPC;
- disk-backed logs when required;
- UI virtualization;
- configurable verbosity.

## 148. Risk — Filesystem Race

Files may change during packaging.

Mitigation:

- build output validation;
- file metadata checks;
- controlled staging;
- atomic package generation;
- lock or snapshot strategy where required.

## 149. Open Questions

1. Which exact Tauri version will be standardized?
2. Which Rust version/toolchain will be pinned?
3. What exact IPC serialization format will be standardized?
4. Which project metadata format will be used?
5. What exact `.krv` container format will be selected?
6. What exact digest algorithm will be mandatory?
7. What exact signing algorithm will be mandatory?
8. Which OS secure-storage APIs will be used?
9. Will production signing ever use a remote signing service?
10. Which build systems are P0?
11. Which ROS 2 distributions are supported?
12. What exact process sandboxing is feasible across Linux and Windows?
13. What exact resource limits become configurable?
14. What exact operation persistence is required?
15. Should operation logs survive application restart?
16. What exact source-detection policy is required?
17. What exact secret-scanning mechanism will be used?
18. What exact archive/container format security policy is required?
19. How should symlinked dependencies be packaged?
20. Which host architectures beyond x86_64 will be supported?
21. What exact macOS support target is planned?
22. What exact artifact upload size limit will apply?
23. Which local signing keys are trusted for staging?
24. What exact diagnostics can be uploaded with user consent?
25. What exact crash recovery behavior is required for active builds?

## 150. Full Acceptance Criteria — Runtime Foundation

- [ ] Rust Local Runtime exists.
- [ ] Tauri IPC boundary exists.
- [ ] Command handlers are thin.
- [ ] Application services are separated.
- [ ] Domain services are separated.
- [ ] Platform-specific infrastructure is isolated.
- [ ] Arbitrary shell execution is not exposed.
- [ ] Operation IDs exist for long-running operations.
- [ ] Runtime lifecycle is defined.
- [ ] Runtime diagnostics exist.

## 151. Full Acceptance Criteria — Workspace

- [ ] Project creation works.
- [ ] Project opening works.
- [ ] Workspace validation works.
- [ ] Paths are canonicalized.
- [ ] Path traversal is rejected.
- [ ] Workspace scope is enforced.
- [ ] Symlink policy is implemented.
- [ ] Workspace state is structured.
- [ ] Workspace conflicts are detected.
- [ ] Temporary workspace state is cleaned.

## 152. Full Acceptance Criteria — Toolchain

- [ ] Supported tools are discoverable.
- [ ] Tool versions are captured.
- [ ] Tool paths are validated.
- [ ] Tool compatibility is evaluated.
- [ ] Missing tools are reported clearly.
- [ ] Unsupported versions are reported.
- [ ] Toolchain configuration is supported.
- [ ] Search scope is controlled.
- [ ] Environment handling is controlled.
- [ ] Toolchain diagnostics are available.

## 153. Full Acceptance Criteria — Build

- [ ] Build configuration is validated.
- [ ] Build operation receives an operation ID.
- [ ] Build process is managed by Rust.
- [ ] Arguments are passed safely.
- [ ] Environment is controlled.
- [ ] Build logs stream.
- [ ] Build status is queryable.
- [ ] Build cancellation works.
- [ ] Child processes are cleaned.
- [ ] Build results are structured.

## 154. Full Acceptance Criteria — Tests

- [ ] Tests can be discovered.
- [ ] Tests can be selected.
- [ ] Tests execute locally.
- [ ] Test output streams.
- [ ] Test status is queryable.
- [ ] Test cancellation works.
- [ ] Test child processes are cleaned.
- [ ] Test results are structured.
- [ ] Failed tests are distinguishable from infrastructure failures.
- [ ] Test logs are bounded.

## 155. Full Acceptance Criteria — Logging

- [ ] stdout is captured.
- [ ] stderr is captured.
- [ ] Logs contain operation identity.
- [ ] Logs have timestamps.
- [ ] Log severity can be represented.
- [ ] Output buffering is bounded.
- [ ] UI event delivery is batched where required.
- [ ] Log redaction exists.
- [ ] Long logs do not cause unbounded memory growth.
- [ ] Log cleanup is implemented.

## 156. Full Acceptance Criteria — Cancellation

- [ ] Operations expose cancellation.
- [ ] Cancellation is idempotent.
- [ ] Cancellation state is observable.
- [ ] Graceful termination is attempted.
- [ ] Force termination is available where required.
- [ ] Process trees are cleaned.
- [ ] Cancellation has bounded completion.
- [ ] Cancellation errors are structured.
- [ ] Temporary resources are cleaned.
- [ ] UI receives final authoritative operation state.

## 157. Full Acceptance Criteria — Artifact

- [ ] `.krv` packaging exists.
- [ ] Packaging uses an allowlist.
- [ ] Source exclusion is implemented.
- [ ] Secret exclusion is implemented.
- [ ] Manifest is generated.
- [ ] Manifest is validated.
- [ ] Digest is calculated.
- [ ] Artifact identity is immutable.
- [ ] Package creation is atomic.
- [ ] Package size is checked.

## 158. Full Acceptance Criteria — Signing

- [ ] Signing service is isolated.
- [ ] Development and production trust are distinguishable.
- [ ] Signing keys are securely stored.
- [ ] Keys are never embedded in source.
- [ ] Signature is verifiable.
- [ ] Invalid signatures are rejected.
- [ ] Missing keys produce stable errors.
- [ ] Key revocation can be represented.
- [ ] Signing metadata is recorded.
- [ ] Production policy can require signatures.

## 159. Full Acceptance Criteria — Validation

- [ ] Workspace validation exists.
- [ ] Toolchain validation exists.
- [ ] Build output validation exists.
- [ ] Artifact format validation exists.
- [ ] Manifest validation exists.
- [ ] Package content validation exists.
- [ ] Digest validation exists.
- [ ] Signature validation exists.
- [ ] Target compatibility is checked.
- [ ] Remote validation remains mandatory.

## 160. Full Acceptance Criteria — Security

- [ ] IPC commands are explicit.
- [ ] IPC arguments are validated.
- [ ] Filesystem access is scoped.
- [ ] Arbitrary command execution is unavailable.
- [ ] Process arguments are not shell-concatenated.
- [ ] Environment variables are filtered.
- [ ] Secrets are redacted.
- [ ] Temporary files are protected.
- [ ] Archive traversal is blocked.
- [ ] Signing keys are protected.

## 161. Full Acceptance Criteria — Error Model

- [ ] Errors have stable codes.
- [ ] Errors contain operation IDs where applicable.
- [ ] Retryability is represented.
- [ ] Raw OS errors are translated.
- [ ] Build failures are distinguishable.
- [ ] Test failures are distinguishable.
- [ ] Cancellation failures are distinguishable.
- [ ] Artifact failures are distinguishable.
- [ ] Permission failures are distinguishable.
- [ ] UI-safe messages are available.

## 162. Full Acceptance Criteria — Lifecycle

- [ ] Runtime startup is deterministic.
- [ ] Runtime shutdown is deterministic.
- [ ] New operations are rejected during shutdown.
- [ ] Active operations receive shutdown signals.
- [ ] Child processes are cleaned.
- [ ] Temporary files are cleaned.
- [ ] Locks are released.
- [ ] Abnormal termination is detected.
- [ ] Startup recovery exists.
- [ ] Stale operation state is not treated as active.

## 163. Full Acceptance Criteria — Persistence

- [ ] Only approved metadata is persisted.
- [ ] Tokens are not stored in ordinary files.
- [ ] Private keys are not stored in plaintext.
- [ ] Toolchain cache is versioned.
- [ ] Cache invalidation exists.
- [ ] Cache is not authoritative for security.
- [ ] Operation metadata is bounded.
- [ ] Temporary state is cleaned.
- [ ] Persistence failures are recoverable.
- [ ] Sensitive metadata is protected.

## 164. Full Acceptance Criteria — Performance

- [ ] Build execution does not block UI rendering.
- [ ] Test execution does not block UI rendering.
- [ ] Logs are bounded.
- [ ] IPC events are batched where required.
- [ ] Telemetry-independent local operations remain responsive.
- [ ] Concurrent operation limits exist.
- [ ] Disk usage is monitored where practical.
- [ ] Memory growth is measured.
- [ ] Long operations are tested.
- [ ] Performance regressions are reviewed.

## 165. Full Acceptance Criteria — Testing

- [ ] Unit tests exist.
- [ ] Filesystem tests exist.
- [ ] Process tests exist.
- [ ] Toolchain tests exist.
- [ ] Artifact tests exist.
- [ ] Signing tests exist.
- [ ] Cancellation tests exist.
- [ ] IPC tests exist.
- [ ] Cross-platform tests exist.
- [ ] Studio E2E covers the critical local workflow.

## 166. Full Acceptance Criteria — Integration

- [ ] Studio can open a local project.
- [ ] Studio can detect the toolchain.
- [ ] Studio can build locally.
- [ ] Studio can execute local tests.
- [ ] Studio can package `.krv`.
- [ ] Studio can inspect `.krv`.
- [ ] Studio can validate `.krv`.
- [ ] Studio can upload the validated artifact.
- [ ] Studio can associate artifact identity with remote execution.
- [ ] Studio never requires uploading the source directory for normal execution.

## 167. Architectural Invariants

The following are mandatory:

1. Rust owns privileged native operations.
2. React never receives unrestricted operating-system privileges.
3. Tauri IPC exposes explicit operations only.
4. The Local Runtime is not a generic shell.
5. Source code remains local by default.
6. Build occurs locally in the initial architecture.
7. Tests occur locally in the initial architecture.
8. `.krv` is the explicit execution artifact.
9. Artifact packaging uses an allowlist.
10. Artifact contents are validated before upload.
11. Artifact identity is immutable.
12. Production artifacts use approved signing policy.
13. Signing keys are protected.
14. Process execution is controlled.
15. Process trees are cleaned after cancellation.
16. Long-running operations have operation IDs.
17. Logs are bounded.
18. Cancellation is idempotent.
19. Workspace paths are validated.
20. Symlink/path traversal cannot escape approved boundaries.
21. Secrets are filtered from environments and logs.
22. Local validation does not replace remote validation.
23. Backend authorization remains authoritative.
24. Local Stop/Cancel controls are not physical safety controls.
25. The Local Runtime remains independently testable from the React UI.

## 168. Final Architecture

The production Local Runtime architecture is:

    +----------------------------------------------------------------+
    |                    Kritva RaaS Studio                         |
    +----------------------------------------------------------------+
    |                        React UI                                |
    +------------------------------+---------------------------------+
                                   |
                              Tauri IPC
                                   |
    +------------------------------v---------------------------------+
    |                   Rust Local Runtime                           |
    |                                                                |
    |  +----------------+    +----------------+                      |
    |  | Workspace      |    | Toolchain      |                      |
    |  | Manager        |    | Manager        |                      |
    |  +----------------+    +----------------+                      |
    |                                                                |
    |  +----------------+    +----------------+                      |
    |  | Build Manager  |    | Test Manager   |                      |
    |  +----------------+    +----------------+                      |
    |                                                                |
    |  +----------------+    +----------------+                      |
    |  | Process        |    | Log Manager    |                      |
    |  | Manager        |    |                |                      |
    |  +----------------+    +----------------+                      |
    |                                                                |
    |  +----------------+    +----------------+                      |
    |  | Artifact       |    | Security /     |                      |
    |  | Manager        |    | Validation     |                      |
    |  +----------------+    +----------------+                      |
    |                                                                |
    +-------------------------+--------------------------------------+
                              |
              +---------------+----------------+
              |               |                |
              v               v                v
         Filesystem       Toolchains       Signing Keys
              |               |                |
              +---------------+----------------+
                              |
                              v
                         `.krv` Artifact
                              |
                              v
                       RaaS Control Plane
                              |
                              v
                         Remote Robot

The Local Runtime therefore establishes a controlled and auditable boundary
between the developer's machine and the Kritva RaaS platform.

Its essential workflow is:

    Local Project
        |
        v
    Workspace Validation
        |
        v
    Toolchain Detection
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
    Sign
        |
        v
    Validate
        |
        v
    Immutable `.krv`
        |
        v
    Explicit Upload

The architecture deliberately preserves the separation:

    SOURCE CODE
        |
        | stays local
        v
    STUDIO LOCAL RUNTIME
        |
        | produces only approved artifact
        v
    EXECUTION ARTIFACT
        |
        | crosses RaaS boundary
        v
    CONTROL PLANE
        |
        v
    LAB / ROBOT

This boundary is a core architectural property of Kritva RaaS and must remain
intact as the platform evolves from development through production.
