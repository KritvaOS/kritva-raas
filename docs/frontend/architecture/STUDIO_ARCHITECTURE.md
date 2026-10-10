# Kritva RaaS Studio Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Kritva RaaS Studio Architecture |
| Path | `docs/frontend/architecture/STUDIO_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service |
| Application | Kritva RaaS Studio |
| Application Type | Desktop Developer Application |
| Desktop Framework | Tauri |
| UI Framework | React + TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Client State | Zustand |
| Server State | TanStack Query |
| API | REST/OpenAPI |
| Realtime | WebSocket |
| Local Runtime | Tauri/Rust |
| Charts | Apache ECharts |
| Testing | Vitest + React Testing Library + Playwright |
| Status | Production Architecture Baseline |

## 2. Purpose

This document defines the production architecture of Kritva RaaS Studio.

Kritva RaaS Studio is the primary developer workspace for the Kritva Robotics-as-a-Service
platform.

Its central purpose is to allow a developer to:

    Develop locally
        |
        v
    Build locally
        |
        v
    Test locally
        |
        v
    Package execution artifact
        |
        v
    Select robot
        |
        v
    Book robot
        |
        v
    Upload artifact
        |
        v
    Execute remotely
        |
        v
    Observe execution
        |
        v
    Analyze results
        |
        v
    Re-run experiment

The fundamental product principle is:

> **Build locally. Book remotely. Run on real robots.**

## 3. Scope

This document covers:

- Studio application shell;
- desktop layout;
- navigation;
- screens;
- feature modules;
- local project management;
- local source handling;
- local toolchain integration;
- local builds;
- local tests;
- artifact packaging;
- artifact validation;
- artifact upload;
- robot platform discovery;
- booking;
- credits;
- remote jobs;
- live runs;
- telemetry;
- video;
- logs;
- results;
- reruns;
- settings;
- authentication;
- organization context;
- realtime;
- state management;
- Tauri IPC;
- error handling;
- offline behavior;
- accessibility;
- performance;
- testing;
- diagnostics;
- update behavior;
- Phase 0–8 implementation mapping.

It does not define:

- backend implementation;
- PostgreSQL schema;
- cloud infrastructure;
- Lab Agent internals;
- robot firmware;
- physical safety implementation;
- detailed video transport implementation.

## 4. Goals

Studio shall:

1. provide a professional desktop development environment;
2. keep source code local by default;
3. provide local build and test workflows;
4. produce a controlled `.krv` execution artifact;
5. provide platform-aware artifact validation;
6. integrate robot discovery and booking;
7. provide remote execution;
8. provide live execution visibility;
9. provide durable results;
10. support rerunning experiments;
11. support multiple organizations where authorized;
12. support reliable authentication;
13. support realtime state updates;
14. provide accessible workflows;
15. remain performant during long-running executions;
16. support production diagnostics and updates.

## 5. Non-Goals

Studio is not:

- a remote source-code editor;
- a source-code hosting service;
- a generic cloud IDE;
- a remote build farm in the initial architecture;
- a robot safety controller;
- a physical emergency-stop interface;
- a replacement for Kritva Runtime;
- a replacement for the Web Console administration interface.

## 6. Product Boundary

Studio is split into two major execution domains:

    +----------------------------------------------------------+
    |                  Kritva RaaS Studio                     |
    +----------------------------------------------------------+
    |                                                          |
    |  React UI                                                |
    |      |                                                   |
    |      +--------------------+                              |
    |      |                    |                              |
    |      v                    v                              |
    |  RaaS Control Plane    Tauri IPC                         |
    |      |                    |                              |
    |      v                    v                              |
    |  REST/WebSocket       Rust Native Layer                 |
    |                           |                              |
    |                           +--> Filesystem                |
    |                           +--> Toolchain                 |
    |                           +--> Build                     |
    |                           +--> Tests                     |
    |                           +--> Artifact Packaging        |
    +----------------------------------------------------------+

Remote operations use the Control Plane.

Privileged local operations use Tauri/Rust.

## 7. Technology Baseline

Studio uses:

| Layer | Technology |
|---|---|
| Desktop shell | Tauri |
| UI | React |
| Language | TypeScript |
| Native layer | Rust |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Local state | Zustand |
| Server state | TanStack Query |
| API | REST/OpenAPI |
| Realtime | WebSocket |
| Charts | Apache ECharts |
| Testing | Vitest + React Testing Library |
| E2E | Playwright |
| Package management | pnpm |
| Monorepo | Turborepo |

## 8. Application Structure

Recommended Studio structure:

    apps/studio/
      src/
        app/
        routes/
        features/
          auth/
          dashboard/
          projects/
          builds/
          artifacts/
          platforms/
          bookings/
          credits/
          jobs/
          live/
          results/
          settings/
          diagnostics/
        components/
        hooks/
        stores/
        services/
        styles/
      src-tauri/
        commands/
        services/
        filesystem/
        process/
        build/
        artifact/
        diagnostics/
        security/

## 9. Architectural Layers

Studio follows:

    Presentation
        |
        v
    Feature Logic
        |
        v
    Application Services
        |
        +--------------------+
        |                    |
        v                    v
    API Client           Tauri IPC
        |                    |
        v                    v
    Control Plane        Local Runtime

The presentation layer must not directly invoke operating-system APIs.

## 10. Feature Modules

Primary modules:

| Module | Responsibility |
|---|---|
| Auth | Login, logout, session |
| Dashboard | Workspace summary |
| Projects | Project lifecycle |
| Builds | Local build/test |
| Artifacts | Package/upload/manage artifacts |
| Platforms | Robot discovery |
| Bookings | Resource reservation |
| Credits | Platform-specific credits |
| Jobs | Remote job lifecycle |
| Live | Active execution |
| Results | Results and analysis |
| Settings | User/application settings |
| Diagnostics | System and connectivity diagnostics |

## 11. Navigation Model

Studio navigation:

    HOME
      Dashboard

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
      Settings

A navigation item may display contextual badges such as:

    Running: 1
    Failed: 2
    Booking Today: 1

Badges must not become the primary source of execution state.

## 12. Application Shell

The Studio shell contains:

    +----------------------------------------------------------------+
    | Kritva | Project Context | Connection | Notifications | User  |
    +----------------+-----------------------------------------------+
    |                |                                               |
    | Navigation     | Main Workspace                                |
    |                |                                               |
    | HOME           |                                               |
    | DEVELOP        |                                               |
    | ROBOTS         |                                               |
    | EXECUTE        |                                               |
    | ANALYZE        |                                               |
    | ACCOUNT        |                                               |
    |                |                                               |
    +----------------+-----------------------------------------------+
    | Status Bar: API | Realtime | Local Runtime | Version          |
    +----------------------------------------------------------------+

The shell remains persistent across route transitions.

## 13. Header

The header should provide:

- Kritva branding;
- current project;
- organization;
- connectivity;
- notifications;
- account menu.

The header must remain compact enough to preserve workspace area.

## 14. Sidebar

The sidebar provides global navigation.

It should support:

- expanded mode;
- collapsed mode;
- keyboard navigation;
- active-route indication;
- contextual badges.

Sidebar state may be stored in Zustand.

## 15. Status Bar

Studio should expose:

    API       Connected
    Realtime  Connected
    Runtime   Ready
    Version   vX.Y.Z

States include:

    CONNECTED
    DEGRADED
    DISCONNECTED
    UNAVAILABLE

Local runtime and cloud connectivity are separate indicators.

## 16. Dashboard

Dashboard provides a developer-oriented summary.

Recommended cards:

- current project;
- recent builds;
- recent artifacts;
- upcoming bookings;
- running jobs;
- recent results;
- credit balances.

The dashboard is an aggregation view, not the source of truth for individual
resources.

## 17. Dashboard Layout

Conceptual layout:

    +--------------------------------------------------------------+
    | Welcome / Current Project                                    |
    +----------------------+----------------------+----------------+
    | Build Status         | Active Runs          | Credits        |
    +----------------------+----------------------+----------------+
    | Upcoming Bookings    | Recent Artifacts     | Results        |
    +----------------------+----------------------+----------------+
    | Recent Activity                                             |
    +--------------------------------------------------------------+

Cards should link directly to the corresponding resource.

## 18. Authentication Module

Authentication provides:

- login;
- logout;
- session restoration;
- token refresh;
- authentication failure;
- profile retrieval.

Studio should use the defined OAuth/OIDC authorization flow with PKCE.

## 19. Authentication Flow

    Launch Studio
        |
        v
    Check Session
        |
        +--> Valid --> Dashboard
        |
        +--> Invalid
                |
                v
              Login
                |
                v
            Auth Provider
                |
                v
            Authorization
                |
                v
            Studio Session
                |
                v
            Dashboard

## 20. Authentication Storage

Sensitive authentication credentials must use secure mechanisms appropriate
to the desktop platform.

The UI must not directly manipulate refresh-token storage.

Tokens must never be written to project files, logs, diagnostics, or artifacts.

## 21. Session Expiration

When a session expires:

    API request
        |
        v
      401
        |
        v
    Refresh Session
        |
        +--> Success --> Retry
        |
        +--> Failure --> Login

Studio should preserve useful local context when requiring reauthentication.

## 22. Organization Context

If a user belongs to multiple organizations, Studio provides an organization
selector.

Switching organization requires:

    Select Organization
        |
        v
    Clear Organization Queries
        |
        v
    Reconnect Realtime
        |
        v
    Fetch New Context
        |
        v
    Refresh Workspace

Stale organization data must not appear as current.

## 23. Projects Module

Projects represent the developer's RaaS workspace.

Project information includes:

- project ID;
- name;
- description;
- organization;
- local path;
- selected platform;
- build configuration;
- artifact references;
- bookings;
- runs;
- results.

## 24. Project List

Project list should support:

- search;
- sorting;
- filtering;
- recent projects;
- creation;
- archive;
- opening local projects.

Example:

    Projects
    +------------------------------------------------------+
    | Search                     | New Project             |
    +------------------------------------------------------+
    | Project | Platform | Last Build | Last Run | Status |
    +------------------------------------------------------+

Large lists must use server-side pagination where appropriate.

## 25. Create Project

Create Project should capture:

- project name;
- optional description;
- local directory;
- target platform;
- initial build configuration.

The local directory remains local.

Remote project metadata is created separately.

## 26. Open Project

Opening a project:

    Select Directory
        |
        v
    Validate Project
        |
        v
    Load Project Metadata
        |
        v
    Detect Toolchain
        |
        v
    Open Workspace

The filesystem path must be validated by the Rust layer.

## 27. Project Workspace

Project workspace navigation:

    Overview | Source | Build | Artifacts | Bookings | Runs | Results

The workspace should preserve project context across tabs.

## 28. Overview Screen

Overview shows:

- project metadata;
- target platform;
- local path;
- latest build;
- latest artifact;
- next booking;
- latest run;
- latest result.

## 29. Source Screen

Source screen represents local source state.

It may show:

- source tree;
- project files;
- detected build system;
- source status.

Source content remains local unless a future explicit feature changes this
architecture.

## 30. Build Module

Build module owns the local development build workflow.

It provides:

- toolchain detection;
- configuration;
- build;
- cancellation;
- logs;
- test execution;
- build history.

## 31. Toolchain Detection

Studio asks the local runtime to detect supported tools.

Example:

    Toolchain
      GCC             Found
      Clang           Found
      CMake           Found
      ROS2            Found / Missing
      Kritva SDK      Found
      Target SDK      Found

The detection result should identify versions and compatibility.

## 32. Build Configuration

Build configuration includes:

- target platform;
- target architecture;
- build type;
- SDK;
- runtime version;
- feature options;
- output configuration.

The UI should validate configuration before starting a build.

## 33. Build Flow

    Configure
        |
        v
    Validate
        |
        v
    Start Local Build
        |
        v
    Stream Logs
        |
        v
    Build Complete
        |
        +--> Failed
        |
        +--> Passed
                |
                v
             Run Tests
                |
                v
             Package Artifact

## 34. Build Screen

Build screen should provide:

- current configuration;
- build status;
- elapsed time;
- progress where measurable;
- terminal/log view;
- warnings;
- errors;
- cancel action;
- output summary.

## 35. Build State

Build states:

    IDLE
    CONFIGURING
    RUNNING
    CANCELLING
    COMPLETED
    FAILED
    CANCELLED

The local runtime remains authoritative for the active build process.

## 36. Build Logs

Logs should support:

- live streaming;
- severity;
- timestamps;
- search;
- copy;
- clear display;
- bounded memory.

The UI must not retain unbounded logs.

## 37. Test Workflow

After a successful build:

    Build Complete
        |
        v
    Test Selection
        |
        v
    Local Test
        |
        v
    Test Result
        |
        +--> Failure --> Fix / Rebuild
        |
        +--> Success --> Package

Test failures should prevent automatic artifact promotion unless explicitly
overridden by an approved workflow.

## 38. Artifacts Module

Artifacts are remote execution packages.

The standard format is:

    .krv

The artifact is not a source archive.

## 39. Artifact Contents

A `.krv` artifact may contain:

    manifest.json
    application binary
    required libraries
    configuration
    signature

It must exclude:

- source directories;
- Git metadata;
- build caches;
- credentials;
- unrelated files.

## 40. Artifact Manifest

Conceptual manifest:

    {
        "application": "vision-demo",
        "version": "1.0.0",
        "platform_id": "humanoid-a",
        "architecture": "arm64",
        "kritva_os_version": "x.y",
        "sdk_version": "x.y",
        "capabilities": [],
        "digest": "...",
        "signature": "..."
    }

The canonical schema is defined by the artifact architecture and contracts.

## 41. Artifact Inspection

Before upload Studio should inspect:

- manifest;
- package contents;
- digest;
- target architecture;
- platform;
- runtime;
- SDK;
- capabilities;
- signature;
- package size.

## 42. Artifact Validation

Validation occurs locally and remotely.

    Local Validation
        |
        v
    Upload
        |
        v
    Control Plane Validation
        |
        v
    Lab Validation Before Execution

No single frontend validation step is sufficient for security or execution
authorization.

## 43. Artifact Upload

Upload flow:

    Select Artifact
        |
        v
    Inspect
        |
        v
    Confirm
        |
        v
    Upload
        |
        v
    Verify Digest
        |
        v
    Server Validation
        |
        v
    ACCEPTED / REJECTED

The UI must clearly display upload progress and final validation state.

## 44. Artifact List

Artifact list should show:

- version;
- platform;
- architecture;
- digest;
- validation state;
- creation date;
- runtime;
- SDK;
- size.

Immutable artifacts should not be edited in place.

## 45. Platforms Module

Platforms represents available robotic targets.

A platform may describe:

- robot family;
- version;
- architecture;
- runtime;
- capabilities;
- lab availability;
- credit type;
- credit rate.

## 46. Platform Screen

Platform list:

    +-----------------------------------------------------------+
    | Robot Platforms                                           |
    +-----------------------------------------------------------+
    | Platform Card | Capability | Availability | Credits       |
    +-----------------------------------------------------------+

Platform cards should use modular artwork so additional robots can be added
without redesigning the application.

## 47. Platform Detail

Platform detail provides:

- description;
- capabilities;
- supported architecture;
- runtime;
- SDK;
- availability;
- credit plans;
- booking rules;
- compatibility requirements.

## 48. Compatibility Preflight

Before booking or execution:

    Artifact
        |
        +--> Architecture
        +--> Platform Version
        +--> Runtime
        +--> SDK
        +--> Capabilities
        +--> Security
        |
        v
    Compatibility Result

The UI should explain incompatibility and provide remediation.

## 49. Bookings Module

Booking reserves a robot/resource for a defined time window.

Booking inputs:

- platform;
- resource;
- date;
- start time;
- duration.

## 50. Booking Flow

    Select Platform
        |
        v
    Select Resource
        |
        v
    Availability
        |
        v
    Select Time
        |
        v
    Credit Quote
        |
        v
    Compatibility Check
        |
        v
    Confirm Booking
        |
        v
    Booking Created

## 51. Availability Screen

Availability should show:

- available;
- reserved;
- unavailable;
- maintenance;
- fault.

Availability is server-authoritative and may change between viewing and
confirmation.

## 52. Booking Confirmation

Before confirmation display:

- platform;
- resource;
- date;
- timezone;
- start time;
- end time;
- duration;
- credit type;
- rate;
- required credits;
- remaining credits;
- cancellation policy.

## 53. Booking Conflicts

If the resource becomes unavailable:

    Booking Request
        |
        v
    BOOKING_CONFLICT
        |
        v
    Refresh Availability
        |
        v
    User Selects Alternative

The UI must not automatically select another robot without explicit user
approval.

## 54. Credits Module

Credits are platform-specific.

Example:

    Humanoid-A Credits
    Humanoid-B Credits

Credits are not generic unless the backend explicitly defines a transferable
credit system.

## 55. Credit Screen

Credit screen should show:

- wallet;
- platform;
- balance;
- plan;
- rate information;
- transaction history.

Example:

    Humanoid-A Credits
    Balance: 2,000

    Booking Rate:
    15 credits / minute

## 56. Credit Quote

For:

    15 credits/min
    30 minutes

display:

    Required: 450 credits
    Current Balance: 2,000
    Remaining: 1,550

The final transaction remains authoritative on the backend.

## 57. Jobs Module

Jobs represent remote execution requests.

A job associates:

    Project
      +
    Artifact
      +
    Booking
      +
    Resource
      |
      v
    Remote Execution

## 58. Job List

Job list supports:

- project;
- platform;
- status;
- date;
- run ID;
- artifact;
- booking.

States:

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

## 59. Start Job

Start flow:

    Booking
        |
        v
    Select Artifact
        |
        v
    Compatibility Preflight
        |
        v
    Confirm Credits
        |
        v
    Start Job
        |
        v
    QUEUED
        |
        v
    RUNNING

The start operation must be idempotency-aware.

## 60. Job Detail

Job detail shows:

- job ID;
- project;
- artifact;
- booking;
- platform;
- resource;
- status;
- timestamps;
- credit consumption;
- run reference;
- logs;
- errors.

## 61. Live Run Module

Live Run is the primary execution observation workspace.

It provides:

- run status;
- video;
- telemetry;
- robot state;
- logs;
- events;
- resource health;
- controls.

## 62. Live Run Layout

    +----------------------------------------------------------------+
    | Run ID | Platform | Resource | RUNNING | Credits              |
    +-----------------------------------+----------------------------+
    |                                   | Robot Status              |
    |                                   | CPU / Memory / Temp       |
    |           Live Video              | Battery                   |
    |                                   |                            |
    +-----------------------------------+----------------------------+
    | Telemetry / Charts                                             |
    +----------------------------------------------------------------+
    | Logs / Events                                                   |
    +----------------------------------------------------------------+
    | Stop Job                                                       |
    +----------------------------------------------------------------+

## 63. Live Video

Video should be presented as an independent media stream.

The UI should show:

- connection state;
- stream status;
- latency where available;
- reconnect state.

Video failure must not terminate the telemetry/logging UI.

## 64. Robot Status

Robot status should show:

- online/offline;
- health;
- resource availability;
- safety status where exposed;
- CPU;
- memory;
- temperature;
- battery;
- runtime state.

Physical safety status is informational unless the local safety architecture
explicitly authorizes a control operation.

## 65. Telemetry

Telemetry should be buffered and downsampled.

    Incoming Telemetry
        |
        v
    Buffer
        |
        v
    Aggregate
        |
        v
    Chart Model
        |
        v
    React View

The UI must not render every high-frequency sample independently.

## 66. Logs and Events

Logs should support:

- severity;
- timestamp;
- search;
- filtering;
- pause display;
- copy;
- bounded retention in the client.

Events should be displayed separately when useful for operational understanding.

## 67. Stop Job

Stop Job is an application/job control.

Flow:

    User selects Stop
        |
        v
    Confirm
        |
        v
    job.stop
        |
        v
    STOPPING
        |
        v
    Authoritative State
        |
        v
    STOPPED / COMPLETED / FAILED

Studio must not label a job stopped before authoritative confirmation.

## 68. Safety Boundary

Studio Stop Job is not a physical emergency stop.

The architecture explicitly distinguishes:

    Application Control
        |
        v
    Job Stop

from:

    Physical Safety System
        |
        v
    Emergency Stop

Cloud or Studio connectivity must never be treated as the physical safety
mechanism.

## 69. Results Module

Results represent durable outputs of completed runs.

Results may include:

- summary;
- metrics;
- logs;
- files;
- telemetry;
- execution metadata.

## 70. Results Screen

Results list should show:

- project;
- run;
- platform;
- artifact;
- completion time;
- status;
- result availability.

## 71. Result Detail

Result detail:

    Run
      |
      +--> Summary
      +--> Metrics
      +--> Telemetry
      +--> Logs
      +--> Files
      +--> Environment
      +--> Artifact
      +--> Rerun

## 72. Experiment View

An experiment may aggregate multiple runs.

    Experiment
       |
       +--> Run 1
       +--> Run 2
       +--> Run 3
       |
       v
    Comparative Results

Experiment UI should support comparison without duplicating run authority.

## 73. Rerun Workflow

Rerun should reuse compatible configuration where possible:

    Existing Result
        |
        v
    Review Configuration
        |
        v
    Select Booking
        |
        v
    Confirm Artifact
        |
        v
    Run Again

A rerun creates a new job/run identity.

## 74. Settings Module

Settings should contain:

    Account
    Organization
    Appearance
    Notifications
    Developer
    Security
    Local Toolchains
    Diagnostics
    About

Not all settings need to be implemented in the first release.

## 75. Account Settings

Account settings may provide:

- name;
- email;
- organization;
- session information;
- logout.

Identity changes remain controlled by the identity system.

## 76. Appearance Settings

Appearance should support:

- light/dark/system theme;
- compact/comfortable density where appropriate;
- reduced motion;
- sidebar preference.

Theme state belongs to local UI state.

## 77. Notification Settings

Notifications may include:

- job completed;
- job failed;
- booking reminder;
- artifact rejected;
- credit warning.

High-frequency telemetry must never generate one notification per sample.

## 78. Developer Settings

Developer settings may provide:

- SDK path;
- toolchain preferences;
- build defaults;
- log verbosity;
- experimental features.

Dangerous options should be clearly marked.

## 79. Local Toolchain Settings

The user should be able to view detected tools and paths.

Example:

    CMake
    GCC
    Clang
    ROS2
    Kritva SDK

The Rust layer remains responsible for actual process execution.

## 80. Diagnostics Screen

Diagnostics should show:

- Studio version;
- build ID;
- OS;
- host architecture;
- API connectivity;
- WebSocket connectivity;
- Tauri runtime;
- local toolchains;
- current organization;
- current project;
- relevant support IDs.

Credentials and secrets must never be displayed.

## 81. About Screen

About should show:

- Kritva RaaS Studio;
- version;
- build ID;
- commit identifier where appropriate;
- licenses;
- support information.

## 82. State Architecture

Studio separates state into:

    +-----------------------------+
    | React Local State           |
    +-----------------------------+
                |
    +-----------+-----------+
    |                       |
    v                       v
    Zustand             TanStack Query
    UI state             Server state
    |                       |
    +-----------+-----------+
                |
                v
        Realtime Updates
                |
                v
        Authoritative API

## 83. Zustand State

Use Zustand for:

- sidebar state;
- selected organization;
- active project;
- transient UI state;
- modal state;
- preferences.

Avoid putting complete server resource collections in Zustand.

## 84. TanStack Query State

Use TanStack Query for:

- projects;
- platforms;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- results.

Query invalidation follows domain changes.

## 85. Local Build State

Local build state is owned by the Tauri runtime.

React observes the process through IPC.

The UI should not pretend to own the native process lifecycle.

## 86. Realtime State

WebSocket events update or invalidate relevant server state.

Example:

    job.running
        |
        v
    Realtime Router
        |
        +--> Update run view
        +--> Invalidate job query
        +--> Update notification
        +--> Update activity

## 87. API Client

Studio uses the shared:

    packages/api-client

The application should not issue arbitrary `fetch()` requests from feature
components.

## 88. API Request Flow

    Feature Hook
        |
        v
    Domain Service
        |
        v
    API Client
        |
        v
    REST /api/v1/
        |
        v
    Control Plane

The API client handles:

- authorization;
- serialization;
- error translation;
- retry;
- cancellation;
- idempotency.

## 89. WebSocket Flow

    WebSocket
        |
        v
    Protocol Validation
        |
        v
    Event Router
        |
        +--> Query Invalidation
        +--> Realtime State
        +--> Notifications
        +--> Live View

WebSocket is at-least-once.

Events are deduplicated using `event_id` where required.

## 90. Reconnect

On disconnect:

    Detect Disconnect
        |
        v
    Exponential Backoff
        |
        v
    Reconnect
        |
        v
    Re-authenticate
        |
        v
    Re-subscribe
        |
        v
    Replay if available
        |
        v
    REST Reconciliation

## 91. Tauri IPC Architecture

The frontend uses explicit commands.

Examples:

    studio.project.open
    studio.project.create
    studio.project.validate
    toolchain.detect
    test.start
    test.status
    test.cancel
    artifact.package
    artifact.inspect
    system.info

The IPC surface should be small and auditable.

## 92. Filesystem Boundary

Rust owns:

- directory selection;
- path validation;
- file access;
- project discovery;
- artifact packaging.

The UI passes controlled paths and receives structured results.

Arbitrary filesystem access must not be exposed.

## 93. Process Boundary

Rust owns:

- compiler execution;
- CMake;
- test processes;
- packaging tools.

Process arguments must be constructed from validated configuration rather than
raw shell command strings.

## 94. Local Command Security

The following are prohibited as generic UI functionality:

    execute arbitrary shell command
    execute arbitrary executable
    read arbitrary filesystem path

All privileged operations must have explicit purpose and validation.

## 95. Artifact Security

Before upload:

    Project Files
        |
        v
    Allowlist Packaging
        |
        v
    .krv
        |
        v
    Digest
        |
        v
    Signature
        |
        v
    Upload

The frontend must not expose a generic "upload project directory" action.

## 96. Offline Mode

Studio should continue supporting local work during Control Plane outages where
possible.

Available offline:

- open local project;
- inspect source;
- configure build;
- build;
- test;
- package artifact.

Unavailable offline:

- booking;
- remote upload;
- job execution;
- remote result synchronization.

## 97. Offline Indicator

Studio should distinguish:

    Local Runtime: READY
    Control Plane: OFFLINE
    Realtime: OFFLINE

The user must not interpret local readiness as remote execution readiness.

## 98. Long-Running Sessions

Studio must support sessions lasting hours.

Required controls:

- bounded telemetry;
- bounded logs;
- cleanup subscriptions;
- chart throttling;
- memory monitoring;
- stable WebSocket reconnection.

## 99. Performance

Performance targets:

| Area | Target |
|---|---:|
| Shell startup | <2 s target on supported systems |
| Cached route transition | <500 ms target |
| Normal interaction response | <100 ms |
| Realtime UI propagation | <250 ms where practical |
| Long-run memory growth | bounded |
| Large log rendering | virtualized |
| Telemetry chart | throttled |

Final production budgets must be validated by measurement.

## 100. Accessibility

Studio targets WCAG 2.2 AA principles where applicable.

Requirements:

- keyboard navigation;
- visible focus;
- semantic controls;
- accessible labels;
- accessible dialogs;
- contrast;
- reduced motion;
- screen-reader compatible status updates.

## 101. Keyboard Shortcuts

Potential shortcuts:

    Ctrl/Cmd + P       Command navigation
    Ctrl/Cmd + B       Build
    Ctrl/Cmd + Shift+B Build and test
    Ctrl/Cmd + O       Open Project

Shortcuts must never bypass authorization or safety gates.

## 102. Command Navigation

A command palette may provide navigation and developer actions.

Example:

    > Open Project
    > Build Project
    > Run Tests
    > Open Artifacts
    > Open Platforms
    > View Active Runs
    > Open Diagnostics

Dangerous actions require confirmation.

## 103. Error Handling

Errors are classified:

    Validation
    Authentication
    Authorization
    Connectivity
    Compatibility
    Booking
    Credits
    Build
    Artifact
    Execution
    Results
    Local Runtime

Each error should provide appropriate remediation.

## 104. Error Display

Example:

    Artifact incompatible with selected platform.

    Required architecture:
      arm64

    Selected platform:
      x86_64

    Action:
      Select a compatible artifact or platform.

The UI should not expose internal stack traces.

## 105. Notifications

Notifications are suitable for:

- build completion;
- artifact acceptance;
- booking confirmation;
- job completion;
- job failure;
- result availability.

Transient notifications must not replace durable state.

## 106. Confirmation Dialogs

Confirmation is required for high-impact actions such as:

- deleting/archiving project;
- cancelling booking;
- cancelling upload;
- stopping job;
- logout where meaningful unsaved state exists.

The confirmation must explain consequences.

## 107. Job Stop Confirmation

Example:

    Stop this running job?

    The application will receive a stop request.
    This is not a physical emergency stop.

    [Cancel] [Stop Job]

## 108. Accessibility of Live Run

Live execution must remain usable with:

- keyboard controls;
- readable status;
- non-color status indicators;
- accessible log controls;
- accessible telemetry summaries.

Video is supplementary; critical state must also be represented as text.

## 109. Testing Architecture

Studio testing layers:

    Unit
      |
      v
    Component
      |
      v
    Feature
      |
      v
    Tauri Integration
      |
      v
    E2E

## 110. Unit Tests

Test:

- validators;
- state reducers;
- formatters;
- compatibility calculations;
- credit display calculations;
- event handling;
- error mapping.

## 111. Component Tests

Test:

- buttons;
- forms;
- dialogs;
- navigation;
- tables;
- status indicators;
- artifact cards;
- platform cards;
- job timelines.

## 112. Feature Tests

Test workflows:

- create project;
- build;
- package artifact;
- upload;
- book;
- start;
- stop;
- view results;
- rerun.

## 113. Tauri Integration Tests

Test:

- project directory validation;
- toolchain discovery;
- process launch;
- process cancellation;
- build status;
- artifact inspection;
- packaging;
- diagnostics.

## 114. E2E Tests

Playwright should validate:

    Login
      |
      v
    Create Project
      |
      v
    Build
      |
      v
    Package
      |
      v
    Book
      |
      v
    Upload
      |
      v
    Run
      |
      v
    Live
      |
      v
    Results

Test environments must not use production robots or customer credits.

## 115. Realtime Tests

Test:

- connection;
- authentication;
- subscription;
- duplicate event;
- sequence gap;
- reconnect;
- replay;
- REST reconciliation;
- unauthorized subscription.

## 116. Accessibility Tests

Automated tests should cover:

- labels;
- focus;
- roles;
- contrast where tooling permits;
- keyboard paths.

Manual testing is required for complex live-run workflows.

## 117. Visual Testing

Visual regression candidates:

- Studio shell;
- sidebar;
- project workspace;
- platform cards;
- booking screens;
- job timeline;
- live run;
- results;
- dialogs.

## 118. Security Testing

Security tests should verify:

- restricted filesystem paths;
- restricted process execution;
- safe IPC inputs;
- no token logging;
- secure credential storage;
- artifact source exclusion;
- permission-aware UI;
- signed application update.

## 119. Update Architecture

Studio releases should be signed.

Update process:

    New Version
        |
        v
    Download Metadata
        |
        v
    Verify Signature
        |
        v
    Download Package
        |
        v
    Verify Package
        |
        v
    Install
        |
        v
    Restart
        |
        v
    Health Check

Rollback must be available if an update fails.

## 120. Version Information

Studio exposes:

    application_version
    build_id
    commit_id

The API client should provide client version metadata to the Control Plane
where defined by the protocol.

## 121. Application Settings Persistence

Persist only safe preferences.

Allowed examples:

- theme;
- sidebar state;
- density;
- recent project path;
- non-sensitive UI preferences.

Do not persist:

- refresh tokens in arbitrary storage;
- private keys;
- credentials;
- secrets.

## 122. Project Context Persistence

Studio may remember:

- last project;
- last selected project tab;
- last organization.

Before restoring remote context, authorization and resource validity must be
revalidated.

## 123. Multi-Window Considerations

If multi-window support is introduced:

    Global
      Session
      Organization

    Window
      Project
      Route
      UI State

Window-local state must not corrupt another project's context.

## 124. Resource Lifecycle

When leaving a live run:

    Unsubscribe
        |
        v
    Stop unnecessary streams
        |
        v
    Release listeners
        |
        v
    Preserve durable state

This prevents memory and connection leaks.

## 125. Product Workflow Integration

Complete Studio workflow:

    Login
      |
      v
    Dashboard
      |
      v
    Project
      |
      v
    Local Source
      |
      v
    Build
      |
      v
    Test
      |
      v
    .krv Artifact
      |
      v
    Platform
      |
      v
    Booking
      |
      v
    Upload
      |
      v
    Job
      |
      v
    Live Run
      |
      v
    Results
      |
      v
    Rerun

## 126. Phase Mapping

| Phase | Studio Scope |
|---|---|
| Phase 0 | Application foundation |
| Phase 1 | Authentication and shell |
| Phase 2 | Local development and artifact |
| Phase 3 | Control Plane integration |
| Phase 4 | Booking and credits |
| Phase 5 | Remote execution |
| Phase 6 | Lab and robot integration |
| Phase 7 | Live execution and results |
| Phase 8 | Production hardening |

## 127. P0 FOUNDATION

Deliver:

- Tauri application;
- React application;
- routing;
- shell;
- shared UI;
- API client foundation;
- state foundation;
- Tauri IPC foundation;
- testing;
- CI.

Gate:

- Studio launches;
- shell renders;
- native boundary is operational;
- test suite runs.

## 128. Phase 1 — Authentication

Deliver:

- login;
- logout;
- session;
- token refresh;
- organization;
- account settings;
- route protection.

Gate:

- authenticated user reaches dashboard;
- expired sessions recover safely;
- unauthorized routes are blocked.

## 129. P2 BUILD & ARTIFACT

Deliver:

- Projects;
- Source;
- Toolchain;
- Build;
- Tests;
- Artifact packaging;
- Artifact inspection;
- Artifact upload.

Gate:

- local source remains local;
- successful build creates valid `.krv`;
- upload is explicit.

## 130. P3 CONTROL PLANE

Deliver:

- typed API client;
- project API;
- platform API;
- artifact API;
- server state caching;
- realtime foundation;
- error handling.

Gate:

- Studio can synchronize authoritative remote state.

## 131. P4 BOOKING & COMMERCIAL — Booking and Credits

Deliver:

- platform discovery;
- availability;
- booking;
- credit wallets;
- quotes;
- booking history.

Gate:

- platform-specific credit type is correctly represented;
- booking conflicts are handled;
- insufficient credits are handled.

## 132. P5 EXECUTION

Deliver:

- jobs;
- runs;
- job start;
- job stop;
- logs;
- execution timeline.

Gate:

- complete remote execution workflow works;
- duplicate requests are safe;
- authoritative state is displayed.

## 133. P6 LAB & ROBOT

Deliver:

- resource health;
- lab status;
- compatibility;
- robot capabilities;
- agent state.

Gate:

- incompatible execution is blocked;
- unavailable resources are clearly represented.

## 134. P7 LIVE & RESULTS

Deliver:

- live video;
- telemetry;
- realtime logs;
- results;
- experiments;
- rerun.

Gate:

- reconnect works;
- long-running sessions remain stable;
- results are durable and discoverable.

## 135. P8 PRODUCTION

Deliver:

- performance hardening;
- accessibility verification;
- security review;
- crash reporting;
- diagnostics;
- signed updates;
- rollback;
- production E2E;
- visual regression.

Gate:

- production release checklist passes.

## 136. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Source accidentally uploaded | Critical | Explicit `.krv` boundary |
| Tauri privilege escalation | Critical | Narrow IPC surface |
| API drift | High | Shared contracts/OpenAPI |
| Realtime disconnect | High | Reconnect/reconciliation |
| Telemetry overload | High | Buffer/downsample |
| Long-run memory leak | High | Bounded state/cleanup |
| Unsafe stop semantics | Critical | Distinct safety boundary |
| Stale booking availability | High | Server validation |
| Credit race | Critical | Backend authority/idempotency |
| Large log rendering | Medium | Virtualization |
| Slow startup | Medium | Code splitting |
| Update corruption | Critical | Signed updates |
| Token exposure | Critical | Secure storage |
| UI-only authorization | Critical | Backend authorization |

## 137. Risk — Local Build Security

A compromised or malformed project could attempt unsafe process execution.

Mitigations:

- validate executable paths;
- constrain working directories;
- avoid shell interpolation;
- construct process arguments structurally;
- restrict filesystem scope;
- provide explicit user confirmation where required.

## 138. Risk — Artifact Leakage

A build directory may accidentally contain secrets.

Mitigations:

- allowlist artifact contents;
- inspect manifest;
- reject prohibited files;
- display package contents;
- require explicit upload;
- backend revalidation.

## 139. Risk — Remote State Drift

The UI may display stale state after a network interruption.

Mitigations:

- WebSocket reconnect;
- event replay;
- REST reconciliation;
- visible connectivity state;
- authoritative refresh after important operations.

## 140. Risk — Booking Race

Availability may change between viewing and confirmation.

Mitigations:

- server-side availability validation;
- booking idempotency;
- conflict handling;
- refresh availability;
- never silently substitute a resource.

## 141. Risk — Credit Race

Multiple sessions could consume credits concurrently.

Mitigation:

- backend atomic credit ledger;
- idempotent operations;
- frontend refresh after transaction;
- never rely solely on displayed balance.

## 142. Risk — Physical Safety Misinterpretation

Users may confuse Stop Job with E-stop.

Mitigation:

- explicit wording;
- separate safety status;
- confirmation text;
- no E-stop claim in cloud UI;
- local safety system remains authoritative.

## 143. Open Questions

1. Which exact Tauri release will be pinned for production?
2. Which Linux distributions will be officially supported?
3. Which Windows versions will be supported?
4. When will macOS Apple Silicon support enter the roadmap?
5. What exact OAuth/OIDC provider will be used?
6. What exact secure credential storage mechanism will be selected per OS?
7. Which OpenAPI client generator will be used?
8. Which WebSocket implementation will be standardized?
9. What exact live-video protocol will be selected?
10. What exact telemetry transport will be selected?
11. What exact local build systems will be supported in P0?
12. Which ROS2 distributions will be supported?
13. What exact `.krv` packaging tool will be used?
14. What exact artifact signing mechanism will be used?
15. What exact desktop auto-update service will be used?
16. Will Studio support multiple windows in the initial release?
17. Which workflows should support offline execution?
18. What exact command palette behavior is desired?
19. Which settings require organization-level administration?
20. What exact diagnostics information may be shared with support?
21. Which frontend crash-reporting provider will be used?
22. What exact accessibility certification process will be adopted?
23. What exact performance budgets become CI release gates?
24. Which result file types receive native viewers?
25. What exact experiment-comparison capabilities are required?

## 144. Full Acceptance Criteria — Application

- [ ] Studio is a Tauri desktop application.
- [ ] React and TypeScript are used for the UI.
- [ ] Rust owns privileged native operations.
- [ ] Studio is independently buildable.
- [ ] Studio launches on every supported host OS.
- [ ] Application shell is persistent.
- [ ] Navigation is feature-based.
- [ ] Route boundaries are explicit.
- [ ] Error boundaries exist.
- [ ] Global connectivity state is visible.

## 145. Full Acceptance Criteria — Authentication

- [ ] Login is implemented.
- [ ] Logout is implemented.
- [ ] Session restoration is implemented.
- [ ] Access-token refresh is implemented.
- [ ] Refresh-token storage is secure.
- [ ] Tokens are not exposed to feature components.
- [ ] Tokens are not logged.
- [ ] Protected routes are enforced.
- [ ] Session expiration is handled.
- [ ] Organization context is enforced.

## 146. Full Acceptance Criteria — Projects

- [ ] Project list exists.
- [ ] Project creation exists.
- [ ] Project opening exists.
- [ ] Local path validation exists.
- [ ] Project workspace exists.
- [ ] Overview exists.
- [ ] Source view exists.
- [ ] Project context persists appropriately.
- [ ] Remote project metadata is synchronized.
- [ ] Source remains local by default.

## 147. Full Acceptance Criteria — Build

- [ ] Toolchain detection exists.
- [ ] Build configuration exists.
- [ ] Local build execution exists.
- [ ] Build cancellation exists.
- [ ] Build logs stream.
- [ ] Build errors are represented.
- [ ] Local tests can run.
- [ ] Test failures are visible.
- [ ] Build history is available.
- [ ] Build state is bounded.

## 148. Full Acceptance Criteria — Artifacts

- [ ] `.krv` is supported.
- [ ] Artifact packaging is local.
- [ ] Artifact manifest is validated.
- [ ] Artifact contents are allowlisted.
- [ ] Source files are excluded.
- [ ] Digest is calculated.
- [ ] Signature is supported.
- [ ] Artifact inspection is available.
- [ ] Upload progress is visible.
- [ ] Remote validation state is visible.

## 149. Full Acceptance Criteria — Platforms

- [ ] Platform list exists.
- [ ] Platform detail exists.
- [ ] Capabilities are displayed.
- [ ] Architecture is displayed.
- [ ] Runtime requirements are displayed.
- [ ] SDK requirements are displayed.
- [ ] Availability is displayed.
- [ ] Credit type is displayed.
- [ ] Compatibility preflight is implemented.
- [ ] Incompatible combinations are clearly explained.

## 150. Full Acceptance Criteria — Booking

- [ ] Platform selection exists.
- [ ] Resource selection exists.
- [ ] Availability query exists.
- [ ] Date/time selection exists.
- [ ] Duration selection exists.
- [ ] Credit quote exists.
- [ ] Compatibility check exists.
- [ ] Booking confirmation exists.
- [ ] Booking conflict is handled.
- [ ] Booking cancellation is represented.

## 151. Full Acceptance Criteria — Credits

- [ ] Platform-specific wallets are represented.
- [ ] Balance is displayed.
- [ ] Credit type is displayed.
- [ ] Credit rate is displayed.
- [ ] Required credits are calculated/displayed.
- [ ] Remaining balance is displayed.
- [ ] Transaction history exists.
- [ ] Backend remains authoritative.
- [ ] Insufficient-credit errors are handled.
- [ ] Credit consumption is never treated as UI-only state.

## 152. Full Acceptance Criteria — Jobs

- [ ] Job list exists.
- [ ] Job detail exists.
- [ ] Job states are represented.
- [ ] Start workflow exists.
- [ ] Stop workflow exists.
- [ ] Job logs exist.
- [ ] Run reference exists.
- [ ] Idempotency is respected.
- [ ] Duplicate actions are controlled.
- [ ] Authoritative completion state is displayed.

## 153. Full Acceptance Criteria — Live Run

- [ ] Live run screen exists.
- [ ] Run ID is displayed.
- [ ] Platform is displayed.
- [ ] Resource is displayed.
- [ ] Job state is displayed.
- [ ] Live video is integrated.
- [ ] Robot status is displayed.
- [ ] Telemetry is displayed.
- [ ] Logs are displayed.
- [ ] Stop Job is available where authorized.

## 154. Full Acceptance Criteria — Results

- [ ] Results list exists.
- [ ] Result detail exists.
- [ ] Summary is displayed.
- [ ] Metrics are displayed.
- [ ] Logs are accessible.
- [ ] Result files are accessible.
- [ ] Environment metadata is displayed.
- [ ] Artifact identity is displayed.
- [ ] Experiment grouping is supported where implemented.
- [ ] Rerun creates a new execution identity.

## 155. Full Acceptance Criteria — Settings

- [ ] Account settings exist.
- [ ] Organization context exists.
- [ ] Appearance settings exist.
- [ ] Notification settings exist.
- [ ] Developer settings exist.
- [ ] Toolchain settings exist.
- [ ] Diagnostics exists.
- [ ] About exists.
- [ ] Sensitive values are protected.
- [ ] Preferences persist safely.

## 156. Full Acceptance Criteria — Realtime

- [ ] WebSocket authentication exists.
- [ ] Subscriptions are scoped.
- [ ] Events are validated.
- [ ] Duplicate events are handled.
- [ ] Sequence handling exists.
- [ ] Reconnect exists.
- [ ] Replay is used where available.
- [ ] REST reconciliation exists.
- [ ] Subscriptions are cleaned up.
- [ ] Telemetry rendering is bounded.

## 157. Full Acceptance Criteria — Tauri

- [ ] IPC commands are explicit.
- [ ] Filesystem access is restricted.
- [ ] Process execution is restricted.
- [ ] IPC arguments are validated.
- [ ] Arbitrary shell execution is unavailable.
- [ ] Toolchain discovery is native.
- [ ] Build execution is native.
- [ ] Artifact packaging is native.
- [ ] Diagnostics are native where appropriate.
- [ ] Native failures are translated into structured UI errors.

## 158. Full Acceptance Criteria — Performance

- [ ] Startup performance is measured.
- [ ] Route performance is measured.
- [ ] Bundle size is monitored.
- [ ] Large tables are optimized.
- [ ] Logs are bounded or virtualized.
- [ ] Telemetry is buffered.
- [ ] Charts are throttled.
- [ ] WebSocket subscriptions are cleaned up.
- [ ] Long-running memory is tested.
- [ ] Performance regressions are reviewed.

## 159. Full Acceptance Criteria — Accessibility

- [ ] Keyboard navigation works.
- [ ] Focus is visible.
- [ ] Dialog focus is managed.
- [ ] Controls have accessible names.
- [ ] Forms have accessible labels.
- [ ] Errors are accessible.
- [ ] Status is not conveyed only by color.
- [ ] Charts provide accessible information.
- [ ] Reduced motion is supported.
- [ ] WCAG 2.2 AA is targeted.

## 160. Full Acceptance Criteria — Testing

- [ ] Unit tests exist.
- [ ] Component tests exist.
- [ ] Feature tests exist.
- [ ] API integration tests exist.
- [ ] WebSocket tests exist.
- [ ] Tauri integration tests exist.
- [ ] E2E tests exist.
- [ ] Accessibility tests exist.
- [ ] Visual regression covers critical screens.
- [ ] Production smoke tests exist.

## 161. Full Acceptance Criteria — Security

- [ ] Frontend is not treated as the authorization boundary.
- [ ] Secure token storage is used.
- [ ] Secrets are excluded from logs.
- [ ] IPC capabilities are restricted.
- [ ] Filesystem access is scoped.
- [ ] Process execution is constrained.
- [ ] Artifact contents are validated.
- [ ] Source leakage tests exist.
- [ ] Studio packages are signed.
- [ ] Updates verify signatures.

## 162. Full Acceptance Criteria — Production

- [ ] Local environment is supported.
- [ ] Development environment is supported.
- [ ] Staging environment is supported.
- [ ] Production build is reproducible.
- [ ] Version/build identifiers are available.
- [ ] Crash reporting is available.
- [ ] Diagnostics are available.
- [ ] Rollback is documented.
- [ ] Release smoke tests pass.
- [ ] Production acceptance criteria are signed off.

## 163. Architectural Invariants

The following Studio properties are mandatory:

1. Studio is a desktop developer application.
2. Tauri is the privileged native boundary.
3. React is the presentation layer.
4. Source code remains local by default.
5. Build occurs locally in the initial architecture.
6. `.krv` is the explicit execution artifact.
7. Remote execution occurs through the Control Plane.
8. TanStack Query owns remote server state.
9. Zustand owns local UI state where shared client state is required.
10. WebSocket provides realtime updates, not authoritative state.
11. REST remains authoritative for durable remote state.
12. Tauri IPC is explicit and capability-restricted.
13. Backend authorization remains authoritative.
14. Stop Job is not physical E-stop.
15. Compatibility is validated before execution.
16. Credits are platform-specific unless explicitly made transferable.
17. Side-effecting operations are idempotency-aware.
18. Long-running execution sessions must remain resource bounded.
19. Local source and remote artifact boundaries must remain explicit.
20. Production Studio releases must be signed.
21. Studio must support rollback.
22. Accessibility is a production requirement.
23. Testing covers local, remote, realtime, and native boundaries.
24. New robot platforms must be addable without redesigning the application.
25. No frontend feature may bypass Control Plane authorization, compatibility,
    or safety gates.

## 164. Final Architecture

The resulting Studio architecture is:

    +--------------------------------------------------------------------+
    |                    KRITVA RAAS STUDIO                             |
    +--------------------------------------------------------------------+
    |                                                                    |
    |                         React UI                                   |
    |                                                                    |
    |  +---------+ +----------+ +----------+ +------------------------+ |
    |  |Projects | |Build     | |Artifacts | |Platforms / Booking    | |
    |  +---------+ +----------+ +----------+ +------------------------+ |
    |  +---------+ +----------+ +----------+ +------------------------+ |
    |  |Credits  | |Jobs      | |Live Run  | |Results / Settings      | |
    |  +---------+ +----------+ +----------+ +------------------------+ |
    |                                                                    |
    +---------------------------+----------------------------------------+
                                |
               +----------------+----------------+
               |                                 |
               v                                 v
        Control Plane                       Tauri IPC
               |                                 |
        +------+-------+                         v
        |              |                  Rust Native Layer
        v              v                         |
       REST         WebSocket                    +--> Filesystem
        |              |                         +--> Toolchains
        |              |                         +--> Build
        |              |                         +--> Tests
        |              |                         +--> Packaging
        |              |                         +--> Diagnostics
        v              v
    Remote State     Realtime
                       |
                       v
                  Live Execution

The complete developer journey is:

    Login
      |
      v
    Dashboard
      |
      v
    Create/Open Project
      |
      v
    Develop Locally
      |
      v
    Detect Toolchain
      |
      v
    Build
      |
      v
    Test
      |
      v
    Package .krv
      |
      v
    Inspect Artifact
      |
      v
    Select Robot Platform
      |
      v
    Book Resource
      |
      v
    Upload Artifact
      |
      v
    Compatibility Validation
      |
      v
    Start Job
      |
      v
    Live Run
      |
      +--> Video
      +--> Telemetry
      +--> Logs
      +--> Robot Status
      |
      v
    Complete
      |
      v
    Results
      |
      v
    Rerun

Kritva RaaS Studio therefore provides a single desktop workflow connecting
local robotics development with controlled remote execution on real robotic
platforms, while preserving the architectural boundaries between developer
source, execution artifacts, cloud control, realtime observation, and physical
robot systems.
