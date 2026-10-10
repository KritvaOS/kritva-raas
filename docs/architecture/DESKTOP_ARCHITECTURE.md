# Kritva RaaS Desktop Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Desktop Architecture |
| Path | `docs/architecture/DESKTOP_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service (RaaS) |
| Desktop Application | Kritva RaaS Studio |
| UI Framework | React + TypeScript |
| Desktop Framework | Tauri |
| Native Runtime | Rust |
| Primary Targets | Linux x86_64, Windows x86_64 |
| Future Targets | macOS Apple Silicon, additional architectures as required |
| Status | Architecture Baseline |

## 2. Purpose

This document defines the architecture of Kritva RaaS Studio, the desktop
application used by developers to build robotics applications locally and
execute validated artifacts remotely through the Kritva RaaS platform.

The central product principle is:

> **Build locally. Book remotely. Run on real robots.**

The desktop architecture enforces the related security principle:

> **Customer source code stays on the customer's machine; only the execution artifact crosses the RaaS upload boundary.**

## 3. Scope

This document covers:

1. React/TypeScript user interface.
2. Tauri application shell.
3. Rust Local Runtime.
4. Tauri IPC.
5. Local filesystem access.
6. Local project management.
7. Local toolchain discovery.
8. Local build execution.
9. Local test execution.
10. `.krv` artifact packaging.
11. Local artifact validation.
12. Remote API integration.
13. WebSocket integration.
14. Authentication/session handling.
15. Booking integration.
16. Remote execution integration.
17. Live execution integration.
18. Results integration.
19. Desktop security.
20. Sandboxing.
21. OS integration.
22. Desktop packaging.
23. Desktop updates.
24. Supported operating systems.
25. Offline behavior.
26. Logging and diagnostics.
27. Phase 0-8 implementation.

## 4. Goals

The desktop application shall:

- provide a professional robotics development workflow;
- keep source code local;
- integrate with existing local development toolchains;
- generate validated `.krv` artifacts locally;
- communicate securely with the RaaS Control Plane;
- provide booking and execution workflows;
- provide live execution visibility;
- provide results and experiment history;
- minimize native privilege;
- support Linux and Windows initially;
- support independent desktop releases;
- be observable and diagnosable;
- support secure automatic updates.

## 5. Non-Goals

The Studio does not initially aim to:

- replace the user's IDE;
- host a complete cloud compiler;
- upload source repositories to RaaS;
- provide unrestricted shell access to plugins;
- directly control physical robots;
- connect directly to PostgreSQL;
- connect directly to cloud object storage using permanent credentials;
- implement robot safety functions;
- become a general-purpose remote desktop.

The Studio is a RaaS developer client, not a general operating system.

## 6. Product Role

Studio is the primary developer workspace.

It provides:

    DEVELOP
      Projects
      Builds
      Artifacts

    ROBOTS
      Platforms
      Bookings

    EXECUTE
      Runs
      Live

    ANALYZE
      Results

    ACCOUNT
      Credits
      Profile

The Web Console remains the preferred browser-based interface for broader
administrative and commercial operations.

## 7. Architectural Model

The Studio consists of:

    Kritva RaaS Studio
    |
    +-- React/TypeScript UI
    |
    +-- Tauri Application Shell
    |
    +-- Rust Local Runtime
          |
          +-- Filesystem Manager
          +-- Toolchain Manager
          +-- Build Manager
          +-- Test Manager
          +-- Artifact Manager
          +-- OS Integration
          +-- Secure Storage
          +-- Update Manager
          |
          +-- API Client
          +-- Realtime Client

The React layer must not directly perform privileged local operations.

## 8. Technology Baseline

Recommended desktop technology:

| Area | Technology |
|---|---|
| Desktop shell | Tauri |
| UI | React |
| Language | TypeScript |
| Native layer | Rust |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Client state | Zustand |
| Server state | TanStack Query |
| API | REST/OpenAPI |
| Realtime | WebSocket |
| Charts | Apache ECharts |
| Testing | Vitest + React Testing Library + Playwright |
| Build | pnpm + Turborepo |

The exact versions are implementation configuration and should be pinned.

## 9. UI Architecture

The React application contains:

- application shell;
- navigation;
- pages;
- feature workflows;
- reusable components;
- UI state;
- server state;
- IPC client;
- API client;
- WebSocket client.

Conceptually:

    App Shell
       |
       +-- Navigation
       |
       +-- Routing
       |
       +-- Feature Pages
              |
              +-- Projects
              +-- Builds
              +-- Artifacts
              +-- Platforms
              +-- Bookings
              +-- Runs
              +-- Live
              +-- Results
              +-- Account

## 10. UI State

UI state represents transient presentation state.

Examples:

- selected project;
- active tab;
- modal visibility;
- filters;
- panel state;
- local form state.

UI state must not become the authoritative source for backend state.

## 11. Server State

Server state is managed through a dedicated server-state layer.

Examples:

- projects;
- platforms;
- bookings;
- jobs;
- runs;
- results;
- credits.

TanStack Query is the preferred baseline.

## 12. Local State

Local desktop state may include:

- selected workspace;
- recent projects;
- local build preferences;
- local toolchain configuration;
- local artifact history;
- user UI preferences.

Sensitive credentials must use secure OS-backed storage where possible.

## 13. Tauri Application Shell

Tauri provides:

- desktop window;
- native application lifecycle;
- secure IPC;
- filesystem integration;
- process integration;
- update integration;
- OS-specific packaging.

The shell should remain thin.

Business logic belongs in reusable application services rather than UI callbacks.

## 14. Tauri IPC

IPC is the controlled bridge between React and Rust.

Conceptually:

    React
      |
      | typed IPC command
      v
    Tauri
      |
      v
    Rust Local Runtime
      |
      +--> filesystem
      +--> process
      +--> build
      +--> packaging

The UI must never receive arbitrary native capability.

## 15. IPC Contract

IPC commands should be explicitly defined.

Examples:

    project.list
    project.open
    project.create
    build.detect
    build.configure
    build.start
    build.cancel
    build.status
    build.logs
    test.start
    artifact.package
    artifact.validate
    toolchain.detect
    system.info

## 16. IPC Request

Conceptual request:

    {
        "request_id": "req-001",
        "command": "build.start",
        "payload": {
            "project_id": "project-001",
            "configuration": "release"
        }
    }

The exact Tauri serialization is implementation-specific.

## 17. IPC Response

Conceptual response:

    {
        "request_id": "req-001",
        "status": "SUCCESS",
        "data": {
            "build_id": "build-001"
        },
        "error": null
    }

## 18. IPC Events

Long-running native operations should emit events.

Example:

    build.start
       |
       v
    build.started
       |
       v
    build.progress
       |
       v
    build.completed

The UI can subscribe without polling the Rust runtime excessively.

## 19. IPC Security

The IPC boundary must:

- expose only approved commands;
- validate all inputs;
- enforce filesystem boundaries;
- restrict process execution;
- avoid arbitrary command execution;
- avoid unrestricted environment access;
- protect credentials.

The Rust runtime must treat all UI input as untrusted.

## 20. IPC Failure Model

Failures should distinguish:

- invalid request;
- permission denied;
- path invalid;
- toolchain missing;
- process failure;
- cancellation;
- timeout;
- internal native error.

The UI receives stable error codes.

## 21. Local Runtime

The Rust Local Runtime is the privileged desktop service layer.

It owns:

- filesystem access;
- process execution;
- toolchain discovery;
- build orchestration;
- test orchestration;
- artifact packaging;
- artifact validation;
- OS integration;
- secure local storage;
- update integration.

## 22. Local Runtime Principles

The Local Runtime should be:

- explicit;
- least privilege;
- testable;
- deterministic;
- platform-aware;
- observable.

The Rust layer should not contain UI-specific presentation logic.

## 23. Filesystem Architecture

Studio works with local project directories.

Conceptually:

    User Workspace
       |
       +-- Project A
       |     +-- source
       |     +-- build
       |     +-- artifacts
       |
       +-- Project B
             +-- source
             +-- build
             +-- artifacts

The exact directory layout may be configurable.

## 24. Filesystem Access Policy

The application should access only:

- user-selected project directories;
- application-managed cache;
- application-managed configuration;
- application-managed temporary directories.

Broad unrestricted filesystem access should be avoided.

## 25. Project Directory Authorization

A project directory should be explicitly registered with Studio.

The UI can request:

    project.open

The Rust runtime verifies that subsequent filesystem operations remain within
authorized project roots.

## 26. Path Security

Filesystem operations must prevent:

- path traversal;
- arbitrary absolute-path access;
- symbolic-link escape where relevant;
- accidental system-file modification.

Canonical paths should be validated before privileged operations.

## 27. Project Metadata

Local project metadata may include:

- project ID;
- project name;
- local path;
- selected platform;
- SDK configuration;
- build configuration;
- last build;
- artifact history.

Server project metadata remains authoritative for cloud resources.

## 28. Local Source Ownership

Source code remains local.

The Studio may:

- read source;
- invoke compilers;
- run tests;
- generate binaries;
- package artifacts.

It does not automatically synchronize source with the RaaS Control Plane.

## 29. Local Build Model

The build flow is:

    Source
      |
      v
    Toolchain Detection
      |
      v
    Configure
      |
      v
    Compile
      |
      v
    Link
      |
      v
    Test
      |
      v
    Package
      |
      v
    .krv

## 30. Local Toolchain

Studio may integrate with existing local toolchains.

Examples include:

- GCC;
- Clang;
- CMake;
- Ninja;
- Make;
- ROS 2 tooling;
- Kritva SDK;
- cross-compilers;
- platform-specific SDKs.

Studio should orchestrate rather than reimplement compilers.

## 31. Toolchain Detection

The Local Runtime should detect:

- executable path;
- version;
- architecture;
- SDK version;
- compiler version;
- CMake version;
- build generator;
- target toolchain.

Example:

    toolchain.detect
       |
       +--> compiler
       +--> linker
       +--> cmake
       +--> ninja
       +--> kritva-sdk

## 32. Toolchain Configuration

Toolchain configuration should support:

- automatic detection;
- explicit path selection;
- version selection;
- target architecture;
- environment configuration.

Configuration must not contain cloud secrets.

## 33. Host and Target Architecture

Host architecture and robot target architecture are independent.

Example:

    Windows x86_64
        |
        +--> build ARM64 artifact
        |
        v
    Humanoid-A aarch64

The Studio must clearly distinguish:

- host OS;
- host CPU;
- target OS;
- target CPU;
- target platform.

## 34. Cross Compilation

Cross compilation may be required for robotics targets.

The Studio should support:

- target toolchain selection;
- target SDK;
- sysroot;
- compiler;
- linker;
- libraries;
- runtime compatibility.

The exact cross-compilation setup is platform-specific.

## 35. Build Configuration

A build configuration may include:

    {
        "configuration": "release",
        "platform_id": "humanoid-a",
        "architecture": "aarch64",
        "sdk_version": "1.4",
        "build_system": "cmake"
    }

The configuration is local and may be validated against remote platform metadata.

## 36. Build Profiles

Recommended initial profiles:

- Debug;
- Release.

Production `.krv` artifacts should normally originate from Release builds.

## 37. Build Isolation

Build commands should execute with:

- controlled working directory;
- controlled environment;
- bounded output;
- cancellation;
- timeout;
- resource policy.

The Studio should not expose arbitrary shell execution as a general feature.

## 38. Process Execution

The Rust Local Runtime may spawn approved tools.

Process execution should specify:

- executable;
- arguments;
- working directory;
- environment;
- timeout;
- cancellation;
- stdout/stderr handling.

Arguments should be constructed safely rather than concatenated into shell strings.

## 39. Shell Invocation

Direct shell invocation should be minimized.

Preferred:

    executable = "cmake"
    args = ["--build", "build", "--config", "Release"]

rather than constructing:

    shell("cmake --build ...")

This reduces command-injection risk.

## 40. Build Logs

Build logs should be captured locally.

The UI displays:

- timestamp;
- severity;
- tool;
- stdout;
- stderr;
- exit status.

Build logs should not automatically upload to RaaS.

## 41. Build Cancellation

Users should be able to cancel a local build.

Cancellation should:

1. request process termination;
2. terminate child processes where safe;
3. clean temporary state;
4. record cancellation;
5. return control to the UI.

## 42. Build Timeout

Builds may have configurable maximum durations.

Timeout should result in:

    RUNNING
       |
       v
    TIMEOUT
       |
       v
    PROCESS TERMINATION
       |
       v
    CLEANUP

## 43. Build Status

Local build states may include:

    CREATED
    CONFIGURING
    BUILDING
    TESTING
    PACKAGING
    COMPLETED
    FAILED
    CANCELLED
    TIMEOUT

## 44. Local Testing

Studio may invoke local tests before packaging.

Testing can include:

- unit tests;
- integration tests;
- robotics simulation;
- static checks;
- platform compatibility checks.

A Release artifact should not be offered as production-ready if required tests fail.

## 45. Artifact Packaging

The Local Runtime owns `.krv` packaging.

Flow:

    Build Output
       |
       v
    Package Allowlist
       |
       v
    Manifest Generation
       |
       v
    Payload Assembly
       |
       v
    SHA-256
       |
       v
    Signature
       |
       v
    Local Validation
       |
       v
    application.krv

## 46. Source-Code Protection

The packaging process must not package:

- source directories;
- Git repositories;
- IDE metadata;
- compiler caches;
- private credentials;
- development-only files.

The package builder should operate from an explicit runtime payload allowlist.

## 47. Source-Code Upload Boundary

The Studio's remote upload API accepts:

    .krv

It does not accept:

    source directory
    Git repository
    arbitrary archive

The UI should make this boundary explicit.

## 48. Artifact Validation

Before upload, Studio validates:

- package structure;
- manifest;
- entrypoint;
- checksums;
- signature;
- target platform;
- target architecture;
- runtime;
- SDK;
- required capabilities.

## 49. Artifact Signature

Production artifacts should be signed.

The Studio should never expose private signing keys through the React UI.

Signing operations belong in the trusted native layer or controlled signing service.

## 50. Artifact Upload Flow

    Studio
       |
       v
    Artifact Created
       |
       v
    Local Validation
       |
       v
    artifact.create
       |
       v
    Upload Authorization
       |
       v
    Object Storage
       |
       v
    artifact.upload/complete
       |
       v
    Server Validation

## 51. Remote API Client

The TypeScript API client should provide typed access to:

- authentication;
- projects;
- platforms;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- results.

The API client uses `packages/contracts`.

## 52. API Client Architecture

    React Feature
       |
       v
    TanStack Query
       |
       v
    API Client
       |
       v
    HTTPS
       |
       v
    Control Plane

The UI should not construct raw HTTP requests throughout feature components.

## 53. WebSocket Client

The desktop WebSocket client handles:

- authentication;
- subscription;
- events;
- reconnect;
- state synchronization.

It should not become the authoritative state store.

## 54. WebSocket Recovery

On disconnect:

    WebSocket Lost
       |
       v
    Reconnect
       |
       v
    Query Current State
       |
       v
    Resume Subscriptions

This ensures UI correctness after network interruption.

## 55. Authentication

Studio manages the user session through the configured authentication mechanism.

Sensitive tokens should be stored using secure OS facilities where possible.

The React layer should not directly persist long-lived credentials in plain local
storage.

## 56. Secure Credential Storage

Preferred storage locations:

- Linux secret/keyring facilities;
- Windows Credential Manager;
- macOS Keychain when macOS support is introduced.

The Rust Local Runtime should mediate access where necessary.

## 57. Session Lifecycle

    Login
      |
      v
    Access Token / Session
      |
      v
    API Calls
      |
      v
    Refresh
      |
      +--> success
      |
      +--> failure -> Reauthenticate
      |
      v
    Logout

Logout should clear local session material.

## 58. Project Workflow

Primary project flow:

    Login
      |
      v
    Create/Open Project
      |
      v
    Select Platform
      |
      v
    Configure Toolchain
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
    Upload Artifact

## 59. Robot Platform Workflow

Studio retrieves platform information remotely.

Platform metadata includes:

- platform ID;
- version;
- architecture;
- runtime;
- capabilities;
- availability;
- credit type;
- resource requirements.

## 60. Platform Selection

The user selects a target platform before final artifact packaging where possible.

The Studio uses this information to validate:

- target architecture;
- SDK;
- runtime;
- required capabilities.

## 61. Booking Workflow

    Select Platform
       |
       v
    Availability
       |
       v
    Quote
       |
       v
    Select Time
       |
       v
    Confirm Booking
       |
       v
    Booking ID

Booking is performed through the Control Plane.

Studio does not directly allocate robots.

## 62. Credit Display

Studio may display:

- current platform-specific credit balance;
- required credits;
- rate;
- remaining credits.

The backend remains authoritative for balances and financial operations.

## 63. Job Creation

Execution flow:

    Artifact
       +
    Booking
       |
       v
    job.create
       |
       v
    QUEUED
       |
       v
    job.start

The job references the exact artifact.

## 64. Job Lifecycle

The Studio should display:

    CREATED
    QUEUED
    VALIDATING
    ALLOCATING
    DEPLOYING
    STARTING
    RUNNING
    STOPPING
    COMPLETED
    FAILED
    CANCELLED
    TIMEOUT

## 65. Live Execution

The signature execution screen provides:

- Run ID;
- project;
- artifact;
- platform;
- lab;
- job status;
- live video;
- robot status;
- CPU;
- memory;
- temperature;
- battery;
- telemetry;
- logs;
- events;
- credits used;
- Stop Job.

## 66. Stop Semantics

The Studio `Stop Job` control requests application/job termination.

It is not a physical emergency stop.

The UI should clearly distinguish:

- Stop Job;
- Cancel Job;
- Robot Safety State;
- Physical E-stop.

## 67. Results Workflow

After execution:

    Job Completed
       |
       v
    Run
       |
       v
    Results
       |
       +--> Summary
       +--> Metrics
       +--> Logs
       +--> Files
       |
       v
    Download / Rerun

## 68. Rerun

Rerun should reference:

- original project;
- exact artifact or selected artifact;
- platform;
- optional new booking.

The system must make clear whether the rerun uses the same artifact or a newly
built artifact.

## 69. Local Data Model

Studio local data may include:

- project metadata;
- build records;
- local artifact metadata;
- toolchain configuration;
- UI preferences;
- session metadata;
- cache indexes.

The local data model must not be treated as authoritative for remote business state.

## 70. Remote State

Remote authoritative state includes:

- organizations;
- projects;
- platforms;
- bookings;
- credits;
- jobs;
- runs;
- results;
- artifact lifecycle.

These are retrieved from the Control Plane.

## 71. Local Cache

Studio may cache remote data for responsiveness.

Cached data must have:

- timestamp;
- freshness policy;
- invalidation;
- tenant context.

Stale cached data must not authorize financial or execution operations.

## 72. Offline Mode

The Studio may continue limited local development while offline.

Offline operations may include:

- opening local projects;
- editing source;
- local builds;
- local tests;
- local artifact generation.

Remote operations require connectivity.

## 73. Offline Restrictions

Without Control Plane connectivity, Studio should not assume:

- booking availability;
- credit balance;
- robot availability;
- execution authorization.

It may display cached data as stale.

## 74. Local Build Offline

Local builds should work without cloud connectivity if all required toolchains and
SDKs are locally available.

This reinforces the local-first development model.

## 75. Local Artifact History

Studio may retain local artifact metadata.

Example:

    project
      |
      +-- artifact-001
      +-- artifact-002
      +-- artifact-003

Remote registration state should be visible.

## 76. Desktop Security Model

Security zones:

    React UI
       |
       | Restricted IPC
       v
    Rust Local Runtime
       |
       +-- User Files
       +-- Toolchains
       +-- Credentials
       |
       | Secure Network
       v
    RaaS Control Plane

The Rust layer is trusted more than the UI but remains exposed to untrusted
project content.

## 77. Untrusted Project Content

Source projects may contain malicious or unexpected build behavior.

Therefore:

- build commands must be controlled;
- project configuration must be treated as untrusted;
- scripts must not automatically gain unrestricted privileges;
- environment exposure should be minimized.

## 78. Build Security Boundary

The local build is executed on the user's machine.

The product cannot guarantee a completely sandboxed build across all supported
toolchains without imposing significant constraints.

The architecture therefore uses:

- explicit user consent;
- controlled process invocation;
- bounded filesystem scope where practical;
- limited environment inheritance;
- warnings for custom scripts;
- least privilege.

## 79. Project Script Policy

Projects may require custom scripts.

Studio should distinguish:

- trusted standard build commands;
- project-defined commands;
- arbitrary custom commands.

Future policy may require explicit approval before executing project-defined scripts.

## 80. Environment Variables

The Local Runtime should avoid exposing unnecessary environment variables to builds.

Especially avoid automatic exposure of:

- cloud tokens;
- authentication credentials;
- signing private keys;
- production secrets.

## 81. Signing Key Isolation

If local signing is supported, signing credentials must be isolated from ordinary
project processes.

A build process must never be able to read the signing private key simply because
the Studio can sign artifacts.

## 82. Temporary Files

Temporary build and packaging files should be placed in application-managed
temporary directories.

Sensitive temporary data should be deleted after use where practical.

## 83. Crash Recovery

Studio should preserve enough local state to recover from crashes.

Examples:

- active project;
- build state;
- artifact packaging state;
- pending upload state.

Recovery must not automatically resume a dangerous remote operation without
explicit state validation.

## 84. Remote Job Recovery

If Studio crashes while a remote job is running:

    Studio Crash
       |
       v
    Restart
       |
       v
    Authenticate
       |
       v
    Query Active Jobs
       |
       v
    Restore Run State

The job continues according to backend/lab policy, not according to Studio process
lifetime.

## 85. Update Architecture

Studio should support signed application updates.

Flow:

    Installed Studio
       |
       v
    Check Update Metadata
       |
       v
    Verify Metadata
       |
       v
    Download Package
       |
       v
    Verify Signature
       |
       v
    Install
       |
       v
    Restart
       |
       v
    Health Check

## 86. Update Security

Updates must be:

- authenticated;
- integrity-checked;
- signed;
- versioned;
- rollback-capable where platform supports it.

The Studio must not install arbitrary unsigned binaries.

## 87. Update Channels

Potential channels:

- stable;
- beta;
- development.

Production users should default to stable.

The exact channel model may be finalized later.

## 88. Update Rollback

If an update fails:

1. preserve previous package;
2. restore previous executable;
3. restart;
4. validate;
5. report failure.

The update mechanism must not leave the application permanently unusable after
a failed package installation.

## 89. Desktop Version Compatibility

Studio versions must be compatible with:

- API version;
- authentication system;
- artifact format;
- WebSocket protocol.

A Studio update must not silently introduce an incompatible backend requirement
unless the release explicitly declares it.

## 90. Supported OS Matrix

| Platform | Initial Priority | Architecture | Status |
|---|---:|---|---|
| Linux | P0 | x86_64 | Initial |
| Windows | P0 | x86_64 | Initial |
| macOS | P1 | Apple Silicon | Future |
| macOS Intel | P2 | x86_64 | Optional |
| Linux ARM64 | Future | ARM64 | Future |

## 91. Linux Support

Initial Linux support targets x86_64.

The application should support mainstream enterprise/developer distributions
subject to build and runtime testing.

Packaging may include:

- AppImage;
- `.deb`;
- `.rpm`.

The final distribution set is an implementation decision.

## 92. Windows Support

Initial Windows support targets x86_64.

Packaging may use:

- MSI;
- signed installer.

Windows filesystem and process semantics must be handled by the Rust layer.

## 93. macOS Support

macOS Apple Silicon is planned as P1.

Requirements include:

- Apple Silicon build;
- signing;
- notarization;
- Keychain integration;
- filesystem permissions.

## 94. Cross-Platform Architecture

React/TypeScript should remain platform-neutral.

Rust isolates OS-specific behavior:

    React
      |
      v
    Platform-Neutral Service Interface
      |
      +-- Linux Adapter
      +-- Windows Adapter
      +-- macOS Adapter
      |
      v
    OS

This prevents UI code from accumulating platform-specific logic.

## 95. Native Adapter Interfaces

Conceptual interfaces:

    FileSystemAdapter
    ProcessAdapter
    CredentialStore
    ToolchainAdapter
    UpdateAdapter
    SystemInfoAdapter

Platform-specific implementations reside below these interfaces.

## 96. System Information

Studio may expose:

- host OS;
- host architecture;
- available CPU;
- memory;
- disk;
- detected toolchains.

This information is useful for diagnostics and build configuration.

## 97. Diagnostics

A diagnostics page should provide:

- Studio version;
- OS;
- architecture;
- API endpoint;
- authentication status;
- toolchain status;
- SDK status;
- recent errors;
- connectivity status.

Sensitive information must be redacted.

## 98. Logging

Studio logging is split into:

- UI logs;
- Local Runtime logs;
- build logs;
- API logs;
- update logs.

Logs should be locally accessible for troubleshooting.

## 99. Remote Log Separation

Studio logs should not automatically upload all local logs.

Remote execution logs come from the Control Plane/Lab Agent and are displayed
separately.

## 100. Telemetry and Privacy

Product telemetry, if introduced, should be explicitly defined.

It should not silently transmit:

- source code;
- project files;
- source paths beyond necessary diagnostics;
- credentials;
- `.krv` contents unless part of the explicit upload workflow.

## 101. Source Upload Verification

The Studio upload workflow should enforce:

    Selected Input
        |
        v
    Is .krv?
        |
        +-- No --> Reject
        |
        v
    Validate Package
        |
        v
    Upload

The UI should not offer a generic "Upload Folder" action for RaaS execution.

## 102. Artifact Upload UI

The artifact workflow should show:

- artifact name;
- version;
- platform;
- architecture;
- digest;
- validation status;
- upload progress;
- server validation status.

## 103. Build-to-Artifact Traceability

Studio should preserve:

    Project
       |
       v
    Build
       |
       v
    Artifact
       |
       v
    Remote Job
       |
       v
    Run
       |
       v
    Result

This provides end-to-end developer traceability.

## 104. Build ID

Every local build should have a local build ID.

The build record may include:

- timestamp;
- project;
- configuration;
- toolchain;
- result;
- artifact ID.

## 105. Artifact ID

The artifact receives a stable artifact ID when registered remotely.

The artifact digest identifies exact content.

## 106. Security Boundary for API Tokens

API tokens should be inaccessible to:

- project build processes;
- arbitrary plugins;
- source scripts.

The Rust runtime should mediate authenticated API access.

## 107. Network Access

Studio network access should be limited to configured RaaS endpoints.

The application should not expose generic network capabilities to UI plugins.

## 108. Certificate Validation

HTTPS connections must validate server certificates.

Certificate bypass should not be available in production builds.

## 109. Development Environment

Development builds may support:

- local backend;
- development backend;
- mock Lab Agent;
- simulated platform.

Production credentials must never be embedded in development binaries.

## 110. Build-Time Configuration

Build-time configuration may identify:

- environment;
- API endpoint;
- update channel.

Secrets must not be compiled into the desktop binary.

## 111. Environment Selection

For development:

    Studio Dev
       |
       v
    Development Control Plane

For production:

    Studio Stable
       |
       v
    Production Control Plane

The production build should have a controlled endpoint configuration.

## 112. API Endpoint Protection

Production endpoint configuration should be protected against accidental override.

Development endpoints should not be reachable through normal production user
configuration.

## 113. Testing Architecture

Studio testing consists of:

- unit tests;
- component tests;
- IPC tests;
- integration tests;
- end-to-end tests;
- packaging tests;
- update tests;
- security tests.

## 114. UI Unit Tests

Test:

- state;
- components;
- validation;
- formatting;
- workflows.

Tests must not require a physical robot.

## 115. Rust Unit Tests

Test:

- path validation;
- process invocation;
- toolchain detection;
- package creation;
- manifest generation;
- checksum;
- signature;
- secure storage.

## 116. IPC Integration Tests

Test:

    React/IPC Client
       |
       v
    Tauri
       |
       v
    Rust Runtime

Verify:

- valid commands;
- invalid commands;
- permission failures;
- cancellation;
- timeouts;
- event delivery.

## 117. Build Integration Tests

Use controlled fixture projects.

Test:

- successful build;
- failed build;
- cancellation;
- timeout;
- toolchain missing;
- cross-compilation configuration.

## 118. Artifact Integration Tests

Verify:

- `.krv` structure;
- source exclusion;
- manifest;
- checksum;
- signature;
- upload;
- server validation.

## 119. End-to-End Tests

Primary E2E flow:

    Login
      |
      v
    Create Project
      |
      v
    Select Platform
      |
      v
    Build
      |
      v
    Package
      |
      v
    Upload
      |
      v
    Book
      |
      v
    Run
      |
      v
    Observe
      |
      v
    Results

## 120. Physical Lab E2E

Physical lab E2E tests should be controlled separately.

They should validate:

- artifact compatibility;
- booking;
- deployment;
- runtime;
- telemetry;
- result;
- stop behavior.

## 121. Packaging Tests

Each supported OS must test:

- installer generation;
- installation;
- application startup;
- update;
- uninstall;
- configuration preservation.

## 122. Update Tests

Test:

- valid update;
- invalid signature;
- interrupted download;
- failed installation;
- rollback;
- downgrade prevention.

## 123. Performance

Studio should remain responsive during:

- compilation;
- packaging;
- uploads;
- WebSocket event streams.

Long operations must run outside the UI thread.

## 124. Memory Management

The UI must not retain unbounded:

- build logs;
- telemetry;
- WebSocket events;
- result metadata.

Large streams should be windowed or bounded.

## 125. Large Build Logs

Build logs should be streamed incrementally.

The UI should retain only a bounded in-memory window while optionally retaining the
full log on disk.

## 126. Large Artifact Upload

Uploads should support:

- progress;
- retry;
- cancellation;
- resumability where practical.

The server must verify the final artifact digest.

## 127. Network Interruption During Upload

If upload fails:

    Upload
      |
      v
    Network Failure
      |
      v
    Retry / Resume
      |
      v
    Complete
      |
      v
    Validate

The artifact must not become available merely because an incomplete object exists.

## 128. Network Interruption During Job

If Studio loses connectivity during a running job:

- the job continues according to backend/lab policy;
- Studio reconnects;
- current state is queried;
- UI restores the run.

Studio connectivity is not the robot control safety mechanism.

## 129. Desktop Crash During Build

After restart:

- build status may be reconstructed from local records;
- orphan processes should be detected where practical;
- partial artifacts should be marked incomplete;
- user can restart the build.

## 130. Desktop Crash During Upload

After restart:

- incomplete upload sessions are detected;
- upload can be resumed or restarted;
- artifact registration remains consistent.

## 131. Desktop Crash During Remote Run

After restart:

    Authenticate
       |
       v
    Get Active Jobs
       |
       v
    Match Project/Run
       |
       v
    Restore UI State

The backend remains authoritative.

## 132. Security Sandboxing

The desktop security model should apply least privilege to:

- frontend;
- native runtime;
- filesystem;
- process execution;
- network;
- credentials.

Tauri capability configuration should expose only required permissions.

## 133. Tauri Capability Policy

Tauri capabilities should be:

- explicitly listed;
- reviewed;
- environment-specific where necessary;
- minimized.

Avoid granting broad filesystem or shell capabilities.

## 134. Native Command Allowlist

Rust commands should be allowlisted.

Conceptually:

    Allowed:
      build.start
      build.cancel
      artifact.package
      toolchain.detect

    Not Allowed:
      execute.arbitrary_shell

## 135. Plugin Policy

Third-party desktop plugins should not initially receive unrestricted native access.

Future plugin support requires:

- capability declarations;
- permission model;
- versioning;
- signature/trust;
- isolation.

## 136. Local Security Boundary

The Studio is installed on the user's machine and therefore cannot guarantee
protection against a fully compromised host OS.

The security architecture protects against:

- accidental exposure;
- application-level privilege escalation;
- unauthorized remote source upload;
- malicious project behavior within reasonable boundaries.

## 137. Deployment Packaging

Studio packages should include:

- signed application binary;
- UI assets;
- required native runtime;
- update metadata integration.

They should not include:

- production secrets;
- signing private keys;
- customer source;
- mutable cloud credentials.

## 138. Version Identity

The Studio release should expose:

- semantic version;
- build number;
- Git commit or release identifier;
- build timestamp where appropriate.

Diagnostics should make these values visible.

## 139. Release Channels

Recommended:

    stable
    beta
    dev

Stable is the default production channel.

Development builds may point to development infrastructure.

## 140. Desktop Release Process

    Commit
      |
      v
    CI
      |
      +--> UI Tests
      +--> Rust Tests
      +--> IPC Tests
      +--> E2E
      +--> Security Scan
      |
      v
    Build Packages
      |
      v
    Sign
      |
      v
    Publish
      |
      v
    Staging
      |
      v
    Release
      |
      v
    Update Metadata

## 141. Production Release Approval

Production Studio release requires:

- successful CI;
- package installation tests;
- signing;
- staging validation;
- API compatibility;
- artifact compatibility;
- update validation.

## 142. Rollback

If a release fails:

- stop rollout;
- retain previous release;
- publish/restore previous package;
- prevent automatic repeated failure;
- investigate;
- record incident.

## 143. Backward Compatibility

Studio should maintain compatibility with supported backend versions.

If a backend requires a new Studio version, the server should communicate this
explicitly rather than failing with generic errors.

## 144. Architecture Interfaces

Key local interfaces include:

    ProjectManager
    FileSystemAdapter
    ToolchainManager
    BuildManager
    TestManager
    ArtifactManager
    ProcessManager
    CredentialStore
    UpdateManager
    SystemInfoProvider

Remote interfaces include:

    AuthClient
    ProjectClient
    PlatformClient
    ArtifactClient
    BookingClient
    CreditClient
    JobClient
    RunClient
    ResultClient
    RealtimeClient

## 145. ProjectManager Interface

Conceptual operations:

    create()
    open()
    list()
    close()
    getMetadata()
    registerPath()
    validatePath()

ProjectManager coordinates local project state but does not own remote project
business rules.

## 146. ToolchainManager Interface

Conceptual operations:

    detect()
    list()
    validate()
    configure()
    getVersion()

ToolchainManager does not execute arbitrary commands without BuildManager policy.

## 147. BuildManager Interface

Conceptual operations:

    configure()
    start()
    cancel()
    getStatus()
    getLogs()

BuildManager owns the local build lifecycle.

## 148. ArtifactManager Interface

Conceptual operations:

    package()
    validate()
    inspect()
    calculateDigest()
    sign()
    register()
    upload()

The implementation must enforce source-exclusion policy.

## 149. ProcessManager Interface

Conceptual operations:

    start()
    terminate()
    status()
    collectOutput()

ProcessManager should enforce execution policy.

## 150. UpdateManager Interface

Conceptual operations:

    check()
    download()
    verify()
    install()
    rollback()

UpdateManager owns application update lifecycle.

## 151. Phase Mapping

| Phase | Desktop Scope | Outcome |
|---|---|---|
| Phase 0 | Desktop foundation | Tauri shell + build system |
| Phase 1 | Studio | Core UI + local runtime |
| Phase 2 | Build/artifact | Local build and `.krv` |
| Phase 3 | Control Plane | API/realtime integration |
| Phase 4 | Commercial | Booking/credits |
| Phase 5 | Execution | Remote jobs |
| Phase 6 | Lab | Physical robots |
| Phase 7 | Live/results | Full execution UX |
| Phase 8 | Production | Packaging, updates, hardening |

## 152. Phase 0 — Foundation

Deliver:

- Tauri application;
- React application;
- TypeScript configuration;
- Rust runtime;
- monorepo integration;
- CI.

Acceptance:

- clean checkout builds;
- Studio launches;
- IPC works;
- tests execute.

## 153. Phase 1 — Studio Core

Deliver:

- authentication;
- shell;
- navigation;
- dashboard;
- projects;
- platform discovery.

Acceptance:

- login works;
- projects work;
- platform information is visible;
- local project can be opened.

## 154. Phase 2 — Build and Artifact

Deliver:

- toolchain detection;
- build;
- test;
- package;
- `.krv`;
- local validation.

Acceptance:

- project builds locally;
- build logs display;
- cancellation works;
- artifact is generated;
- source is not uploaded;
- artifact validates.

## 155. Phase 3 — Control Plane Integration

Deliver:

- API client;
- WebSocket;
- artifact upload;
- server state synchronization.

Acceptance:

- API integration works;
- events update UI;
- reconnect restores state;
- artifact upload works.

## 156. Phase 4 — Booking and Commercial

Deliver:

- platform selection;
- availability;
- booking;
- credits.

Acceptance:

- booking works;
- platform-specific credits display;
- credit state comes from backend;
- booking conflicts are handled.

## 157. Phase 5 — Remote Execution

Deliver:

- job creation;
- job start;
- job stop;
- live status;
- logs.

Acceptance:

- artifact can execute remotely;
- job lifecycle is visible;
- Stop Job works;
- backend remains authoritative.

## 158. Phase 6 — Physical Lab

Deliver:

- physical platform metadata;
- robot state;
- live lab integration.

Acceptance:

- real platform can be selected;
- deployment status is visible;
- robot safety state is distinguished from application state.

## 159. Phase 7 — Live and Results

Deliver:

- WebSocket telemetry;
- video;
- logs;
- results;
- rerun.

Acceptance:

- live video works;
- telemetry works;
- results are displayed;
- rerun is supported.

## 160. Phase 8 — Production

Deliver:

- signed installers;
- automatic updates;
- diagnostics;
- crash recovery;
- security hardening;
- release process.

Acceptance:

- Linux release works;
- Windows release works;
- updates are signed;
- rollback is tested;
- security permissions are reviewed.

## 161. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Native privilege too broad | Critical | Tauri capability allowlist |
| Malicious project build | High | Controlled process execution |
| Source uploaded accidentally | Critical | `.krv`-only upload path |
| Credential exposure | Critical | OS secure storage |
| Toolchain mismatch | High | Detection + validation |
| Cross-platform differences | High | Native adapters |
| Desktop crash during run | Medium | Backend-authoritative state |
| WebSocket loss | High | REST recovery |
| Update failure | High | Signed package + rollback |
| API incompatibility | High | Versioned contracts |
| Large log memory usage | Medium | Bounded streaming |
| Arbitrary shell execution | Critical | Explicit process policy |
| Local host compromise | Critical | Trust-boundary limitation |
| Signing key exposure | Critical | Key isolation |
| Unsafe robot control assumption | Critical | Local safety boundary |

## 162. Risk: Project Build Executes Malicious Code

Mitigation:

- user-controlled local execution model;
- explicit project trust;
- restricted environment;
- controlled process invocation;
- warnings;
- optional sandboxing;
- no cloud credential exposure.

## 163. Risk: Desktop Token Is Stolen

Mitigation:

- OS-backed secure storage;
- short-lived access tokens;
- refresh controls;
- session revocation;
- no token exposure to build processes.

## 164. Risk: Studio Update Is Compromised

Mitigation:

- signed packages;
- secure update metadata;
- protected signing keys;
- checksum verification;
- rollback.

## 165. Risk: Source Code Accidentally Uploaded

Mitigation:

- local-only source workspace;
- `.krv`-only upload API;
- packaging allowlist;
- source extension rejection;
- server archive inspection;
- UI workflow that does not expose folder upload.

## 166. Risk: Remote Job Continues After Studio Crash

Mitigation:

- backend-owned job state;
- lab-owned execution state;
- restart-time job discovery;
- clear user-visible active-run recovery.

## 167. Risk: Studio Cannot Build Target Artifact

Mitigation:

- platform-specific toolchain detection;
- compatibility diagnostics;
- documented SDK/toolchain requirements;
- clear build errors;
- local toolchain configuration.

## 168. Open Questions

1. Which exact Tauri version will be pinned?
2. Which React version will be pinned?
3. Which Rust toolchain version will be pinned?
4. Which Linux distributions are officially supported?
5. Will AppImage, deb, rpm, or all three be distributed?
6. Which Windows installer format is preferred?
7. When will macOS support enter production?
8. What exact macOS signing/notarization process will be used?
9. Which OS credential stores will be used?
10. Which build sandbox strategy is practical?
11. How will custom project scripts be handled?
12. Which toolchains are supported in the first release?
13. Which ROS 2 distributions are supported?
14. How will SDK versions be installed and managed?
15. Will Studio download SDK/toolchain components?
16. How are cross-compilers distributed?
17. Will multiple toolchain versions be supported side by side?
18. How will toolchain environment configuration be stored?
19. Which artifact signing model will be used?
20. Will signing occur locally or remotely?
21. What is the maximum artifact upload size?
22. What update framework will be selected?
23. What update channel strategy will be used?
24. What minimum supported backend version applies to each Studio release?
25. What telemetry, if any, will be collected?
26. How long will local logs be retained?
27. What crash-reporting mechanism will be used?
28. Will enterprise deployments support offline installers?
29. Will air-gapped or restricted-network environments be supported?
30. What proxy configuration is required?
31. How will corporate certificate authorities be supported?
32. What exact local build sandbox is required?
33. Which desktop security permissions require explicit user approval?
34. What is the policy for arbitrary project scripts?
35. How will partial builds and stale artifacts be cleaned?
36. What exact UI/API contract compatibility policy will be enforced?

## 169. Full Acceptance Criteria Checklist

### Application Foundation

- [ ] Tauri application builds.
- [ ] React/TypeScript application builds.
- [ ] Rust Local Runtime builds.
- [ ] Monorepo integration works.
- [ ] CI builds all desktop components.
- [ ] Version identity is available.
- [ ] Development environment is documented.

### UI

- [ ] Application shell exists.
- [ ] Navigation exists.
- [ ] Projects workflow exists.
- [ ] Builds workflow exists.
- [ ] Artifacts workflow exists.
- [ ] Platforms workflow exists.
- [ ] Booking workflow exists.
- [ ] Runs workflow exists.
- [ ] Live workflow exists.
- [ ] Results workflow exists.
- [ ] Account workflow exists.

### IPC

- [ ] IPC commands are explicitly defined.
- [ ] IPC requests are validated.
- [ ] IPC responses are structured.
- [ ] IPC events are supported.
- [ ] Native capabilities are allowlisted.
- [ ] Arbitrary shell execution is not exposed.
- [ ] Filesystem permissions are restricted.
- [ ] IPC failures are typed.
- [ ] IPC tests exist.

### Filesystem

- [ ] Project paths are explicitly registered.
- [ ] Path traversal is prevented.
- [ ] Unauthorized absolute paths are rejected.
- [ ] Temporary directories are controlled.
- [ ] Source remains local.
- [ ] Local project metadata is stored safely.
- [ ] Cache directories are controlled.

### Toolchain

- [ ] Toolchain detection exists.
- [ ] Compiler version is detected.
- [ ] Build-system version is detected.
- [ ] SDK version is detected.
- [ ] Target architecture is detected.
- [ ] Cross-compilation configuration is supported.
- [ ] Toolchain errors are actionable.
- [ ] Multiple toolchains can be handled where required.

### Build

- [ ] Build configuration is defined.
- [ ] Release builds are supported.
- [ ] Build logs are captured.
- [ ] Build cancellation works.
- [ ] Build timeout is supported.
- [ ] Failed builds are represented correctly.
- [ ] Build state is recoverable.
- [ ] Build processes do not receive production secrets.

### Artifact

- [ ] `.krv` packaging works.
- [ ] Manifest is generated.
- [ ] SHA-256 digest is generated.
- [ ] Signature is supported.
- [ ] Package allowlist is enforced.
- [ ] Source files are excluded.
- [ ] Git metadata is excluded.
- [ ] Credentials are excluded.
- [ ] Local validation works.
- [ ] Artifact metadata is traceable to the build.

### Source-Code Protection

- [ ] Studio does not upload source directories.
- [ ] Studio does not upload Git repositories.
- [ ] Execution upload accepts `.krv`.
- [ ] Source extension checks exist.
- [ ] Package inspection exists.
- [ ] Debug-symbol policy exists.
- [ ] UI does not expose generic folder upload for execution.
- [ ] Documentation states the limitations of source detection accurately.

### API

- [ ] Typed API client exists.
- [ ] `packages/contracts` is used.
- [ ] Authentication works.
- [ ] Authorization failures are handled.
- [ ] API version is supported.
- [ ] Pagination is supported.
- [ ] Errors are typed.
- [ ] Idempotency is supported where required.

### WebSocket

- [ ] WebSocket authentication exists.
- [ ] Subscription authorization exists.
- [ ] Event handling exists.
- [ ] Duplicate events are tolerated.
- [ ] Reconnect works.
- [ ] REST state recovery works.
- [ ] Event streams are bounded.

### Authentication

- [ ] Login works.
- [ ] Logout works.
- [ ] Session refresh works.
- [ ] Credentials use secure storage.
- [ ] Tokens are not exposed to build processes.
- [ ] Session failure causes controlled reauthentication.

### Booking

- [ ] Platform selection works.
- [ ] Availability query works.
- [ ] Quote works.
- [ ] Booking creation works.
- [ ] Booking cancellation works.
- [ ] Platform-specific credit type is visible.
- [ ] Backend remains authoritative.

### Execution

- [ ] Job creation works.
- [ ] Job lifecycle is visible.
- [ ] Artifact identity is preserved.
- [ ] Job start works.
- [ ] Stop Job works.
- [ ] Logs are visible.
- [ ] Robot state is visible.
- [ ] Studio crash does not incorrectly terminate backend state.

### Results

- [ ] Results are retrievable.
- [ ] Result metadata is displayed.
- [ ] Metrics are displayed.
- [ ] Files are downloadable.
- [ ] Runs reference exact artifacts.
- [ ] Rerun is supported.

### Security

- [ ] Tauri permissions are minimized.
- [ ] Native commands are allowlisted.
- [ ] Filesystem access is controlled.
- [ ] Process execution is controlled.
- [ ] Network endpoints are controlled.
- [ ] TLS verification is enforced.
- [ ] Credentials use secure storage.
- [ ] Production secrets are never packaged.
- [ ] Signing keys are protected.
- [ ] Build processes cannot access cloud credentials.

### Updates

- [ ] Update metadata is authenticated.
- [ ] Update packages are signed.
- [ ] Package integrity is verified.
- [ ] Update installation works.
- [ ] Failed update can recover.
- [ ] Previous release can be restored.
- [ ] Downgrade policy is defined.
- [ ] Update channels are defined.

### Platforms

- [ ] Linux x86_64 package exists.
- [ ] Windows x86_64 package exists.
- [ ] Linux installation is tested.
- [ ] Windows installation is tested.
- [ ] macOS architecture plan exists.
- [ ] Platform-specific native adapters are isolated.

### Testing

- [ ] React unit tests exist.
- [ ] Rust unit tests exist.
- [ ] IPC tests exist.
- [ ] Build integration tests exist.
- [ ] Artifact tests exist.
- [ ] API integration tests exist.
- [ ] WebSocket tests exist.
- [ ] E2E tests exist.
- [ ] Packaging tests exist.
- [ ] Update tests exist.
- [ ] Security tests exist.

### Diagnostics

- [ ] Studio version is visible.
- [ ] OS is visible.
- [ ] Host architecture is visible.
- [ ] API endpoint status is visible.
- [ ] Toolchain status is visible.
- [ ] SDK status is visible.
- [ ] Recent errors are available.
- [ ] Sensitive values are redacted.

### Phase Completion

- [ ] Phase 0 desktop foundation is complete.
- [ ] Phase 1 Studio core is complete.
- [ ] Phase 2 local build/artifact is complete.
- [ ] Phase 3 Control Plane integration is complete.
- [ ] Phase 4 booking/commercial workflow is complete.
- [ ] Phase 5 remote execution is complete.
- [ ] Phase 6 physical lab integration is complete.
- [ ] Phase 7 live/results workflow is complete.
- [ ] Phase 8 production packaging and hardening is complete.

## 170. Final Desktop Architecture Baseline

Kritva RaaS Studio is a secure developer desktop application built around a
thin Tauri shell, React/TypeScript UI, and privileged Rust Local Runtime.

The architecture is:

    React / TypeScript
          |
          | Typed Tauri IPC
          v
    Rust Local Runtime
          |
          +--> Project Files
          +--> Toolchains
          +--> Build
          +--> Tests
          +--> Artifact Packaging
          +--> Secure Credentials
          +--> OS Integration
          |
          | HTTPS REST
          | WebSocket
          v
    RaaS Control Plane
          |
          v
    Lab / Robot

The most important boundary is:

    CUSTOMER MACHINE
    ----------------
    Source Code
        |
        v
    Local Build
        |
        v
    Local Test
        |
        v
    .krv Artifact
        |
        v
    Local Validation
    ----------------
        |
        | Only validated execution artifact
        v
    RaaS
        |
        v
    Real Robot

The Studio therefore does not become a remote source-code development
environment.

Its primary responsibility is to give developers a high-quality local robotics
development workflow while providing a secure bridge into RaaS execution.

The architecture deliberately separates:

- UI from native privileges;
- local development from cloud execution;
- source code from execution artifacts;
- host architecture from target architecture;
- remote job state from desktop process state;
- application stop from physical emergency stop.

The final product workflow is:

    Login
      |
      v
    Create/Open Project
      |
      v
    Select Robot Platform
      |
      v
    Configure Toolchain
      |
      v
    Build Locally
      |
      v
    Test Locally
      |
      v
    Package .krv
      |
      v
    Validate
      |
      v
    Upload Artifact
      |
      v
    Book Robot
      |
      v
    Create Job
      |
      v
    Execute Remotely
      |
      v
    Observe Live
      |
      v
    Analyze Results
      |
      v
    Rerun

The architecture is therefore aligned with the fundamental Kritva RaaS product
principle:

> **Build locally. Book remotely. Run on real robots.**

And with the security boundary:

> **Source code stays local; the RaaS platform receives only the validated execution artifact required to run the application.**
