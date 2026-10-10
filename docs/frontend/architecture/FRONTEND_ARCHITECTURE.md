# Kritva RaaS Frontend Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Kritva RaaS Frontend Architecture |
| Path | `docs/frontend/architecture/FRONTEND_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service |
| Desktop Application | Kritva RaaS Studio |
| Web Application | Kritva RaaS Web Console |
| UI Framework | React + TypeScript |
| Desktop Shell | Tauri + Rust |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Client State | Zustand |
| Server State | TanStack Query |
| API | REST/OpenAPI |
| Realtime | WebSocket |
| Charts | Apache ECharts |
| Testing | Vitest + React Testing Library + Playwright |
| Monorepo | `KritvaOS/kritva-raas` |
| Status | Production Architecture Baseline |

## 2. Purpose

This document defines the production frontend architecture for Kritva RaaS.

The frontend consists of two closely related applications:

1. Kritva RaaS Studio, a desktop application for developers.
2. Kritva RaaS Web Console, a browser application for users and administrators.

The architecture provides a shared foundation while keeping desktop-specific
and browser-specific responsibilities isolated.

The primary product workflow is:

    Build locally.
        |
        v
    Package execution artifact.
        |
        v
    Discover robot.
        |
        v
    Book resource.
        |
        v
    Upload artifact.
        |
        v
    Execute remotely.
        |
        v
    Observe live execution.
        |
        v
    Analyze results.
        |
        v
    Re-run experiment.

## 3. Scope

This document covers:

- frontend application boundaries;
- Studio architecture;
- Web Console architecture;
- shared UI;
- feature organization;
- routing;
- navigation;
- state management;
- API client;
- authentication integration;
- WebSocket/realtime integration;
- local Tauri runtime integration;
- project workspace;
- artifact workflow;
- booking workflow;
- execution workflow;
- results workflow;
- accessibility;
- performance;
- error handling;
- testing;
- frontend observability;
- build and packaging;
- phase mapping;
- frontend risks.

It does not define the backend domain architecture, database schema, or cloud
infrastructure in detail.

## 4. Goals

The frontend architecture shall:

1. provide one coherent RaaS user experience;
2. support Studio and Web Console independently;
3. maximize code reuse without coupling platform-specific behavior;
4. keep business contracts in shared packages;
5. keep source code local during development;
6. integrate local builds with remote execution;
7. provide reliable realtime execution visibility;
8. support responsive web administration;
9. provide accessible user interfaces;
10. remain performant for large projects and long-running jobs;
11. support automated testing;
12. support production diagnostics;
13. evolve through Phases 0–8 without architectural replacement.

## 5. Non-Goals

This document does not define:

- backend service implementation;
- PostgreSQL schema;
- cloud deployment topology;
- robot runtime internals;
- Lab Agent implementation;
- physical robot safety implementation;
- detailed design-system visual specifications;
- identity-provider implementation.

# 6. Frontend Product Model

Kritva RaaS has two frontend products.

    +------------------------------------------------------+
    |                    Kritva RaaS                       |
    +------------------------------------------------------+
             |                              |
             v                              v
    +-------------------+          +----------------------+
    | RaaS Studio       |          | RaaS Web Console    |
    | Desktop           |          | Browser              |
    +-------------------+          +----------------------+
             |                              |
             +--------------+---------------+
                            |
                            v
                   Shared Frontend Packages
                            |
                            v
                    RaaS Control Plane

Studio is developer-oriented.

Web Console is account, booking, commercial, monitoring, and administration
oriented.

## 7. Studio Responsibilities

Studio provides:

- authentication;
- dashboard;
- projects;
- local source management;
- local toolchain detection;
- local build;
- local tests;
- artifact packaging;
- artifact inspection;
- artifact upload;
- robot platform discovery;
- booking;
- remote job execution;
- live video;
- telemetry;
- logs;
- results;
- rerun.

Studio owns the local developer workflow.

## 8. Web Console Responsibilities

The Web Console provides:

- authentication;
- dashboard;
- project visibility;
- robot platform discovery;
- bookings;
- jobs;
- results;
- credits;
- billing;
- profile;
- organization management;
- administrative operations.

Administration is initially web-only.

## 9. Shared Responsibilities

Both applications share:

- domain types;
- API contracts;
- API client;
- authentication abstractions;
- UI components;
- validation;
- formatting;
- error mapping;
- realtime event types;
- accessibility primitives;
- design tokens.

# 10. Technology Baseline

The frontend technology baseline is:

    React
      |
      +--> TypeScript
      |
      +--> Tailwind CSS
      |
      +--> shadcn/ui
      |
      +--> Zustand
      |
      +--> TanStack Query
      |
      +--> Apache ECharts
      |
      +--> Vitest
      |
      +--> React Testing Library
      |
      +--> Playwright

Studio additionally uses:

    Tauri
      |
      +--> Rust native layer
      |
      +--> React WebView UI

## 11. Repository Boundary

Recommended repository:

    KritvaOS/kritva-raas

Frontend structure:

    apps/
      studio/
      web/

    packages/
      ui/
      contracts/
      api-client/
      auth/
      config/
      utils/

The exact Web Console directory may be named `web/` or another approved name,
but Studio and Web must remain independently buildable.

# 12. Monorepo Principle

The frontend monorepo provides:

- atomic contract updates;
- shared UI;
- shared types;
- shared validation;
- consistent tooling;
- centralized testing.

It must not become a mechanism for sharing application-specific state or
platform-specific implementation indiscriminately.

# 13. Package Dependency Direction

Preferred dependency direction:

    apps/studio
          |
          +--> ui
          +--> api-client
          +--> auth
          +--> contracts
          +--> utils

    apps/web
          |
          +--> ui
          +--> api-client
          +--> auth
          +--> contracts
          +--> utils

Shared packages must not import application-specific modules.

# 14. Shared UI Package

`packages/ui` contains reusable visual components.

Examples:

- Button;
- Input;
- Select;
- Dialog;
- Drawer;
- Tabs;
- Table;
- Card;
- Badge;
- Toast;
- Tooltip;
- Form controls;
- Data visualization wrappers;
- Status indicators;
- Robot status components;
- Job status components.

# 15. UI Package Principle

Shared UI should provide:

    visual primitives
        +
    reusable domain presentation
        +
    accessibility behavior

It should not own:

- API calls;
- backend state;
- navigation;
- authentication sessions;
- application-specific business workflows.

# 16. Design System

The UI should use shared:

- typography;
- spacing;
- border radius;
- elevation;
- colors;
- status semantics;
- interaction states;
- responsive breakpoints.

The visual language should communicate:

> Professional cloud engineering platform for real robots.

It should be technical, clean, futuristic, and trustworthy rather than
game-oriented.

# 17. Feature-Based Architecture

Application code should be organized by feature rather than by technical
layer alone.

Preferred structure:

    src/
      app/
      features/
        auth/
        dashboard/
        projects/
        platforms/
        builds/
        artifacts/
        bookings/
        credits/
        jobs/
        runs/
        live/
        results/
        experiments/
        profile/
        admin/
      components/
      hooks/
      routes/
      stores/
      services/

Feature boundaries should reflect product capabilities.

# 18. Feature Ownership

Each feature should contain the code required for its user-facing behavior.

Example:

    features/bookings/
        api/
        components/
        hooks/
        pages/
        schemas/
        types/
        utils/
        tests/

Feature modules should avoid reaching directly into another feature's private
implementation.

# 19. Cross-Feature Dependencies

Allowed:

    bookings -> platforms
    jobs -> artifacts
    jobs -> bookings
    results -> runs
    runs -> jobs

Avoid:

    feature A
       |
       +--> private internals of feature B

Shared behavior should move to a shared package or explicit feature contract.

# 20. Application Shell

Both applications use an application shell.

    +------------------------------------------------------+
    | Header / Account / Notifications                     |
    +------------------------------------------------------+
    | Sidebar          | Main Content                      |
    |                  |                                  |
    | Navigation       | Route Page                       |
    |                  |                                  |
    |                  |                                  |
    +------------------+----------------------------------+

Studio may additionally provide:

- desktop menu;
- project context;
- local toolchain status;
- local build status;
- connection status.

# 21. Studio Navigation

Baseline Studio navigation:

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
      Profile

The navigation may adapt based on feature availability and user permissions.

# 22. Web Console Navigation

User navigation:

    Dashboard
    Projects
    Robot Platforms
    Bookings
    Jobs
    Results
    Credits & Billing
    Profile

Administrative navigation:

    Overview
    Users
    Organizations
    Robot Platforms
    Labs
    Hardware
    Bookings
    Jobs
    Usage
    Credit Plans
    Payments
    Refunds
    Monitoring
    Audit Logs
    Settings

# 23. Routing

Routing should be explicit and typed where practical.

Conceptual routes:

    /login
    /dashboard
    /projects
    /projects/:projectId
    /platforms
    /platforms/:platformId
    /bookings
    /jobs
    /jobs/:jobId
    /runs/:runId
    /runs/:runId/live
    /results
    /results/:resultId
    /credits
    /profile

Admin:

    /admin
    /admin/users
    /admin/organizations
    /admin/platforms
    /admin/labs
    /admin/hardware
    /admin/bookings
    /admin/jobs
    /admin/usage
    /admin/credits
    /admin/payments
    /admin/refunds
    /admin/monitoring
    /admin/audit

# 24. Route Guards

Routes should be protected according to:

    Authentication
        |
        v
    Organization Context
        |
        v
    Role / Permission
        |
        v
    Route

Examples:

    /admin/*
        requires administrative authorization

    /projects/*
        requires authenticated project access

The frontend guard is a usability control.

The backend remains the authoritative authorization boundary.

# 25. Route Loading

Route transitions should support:

- loading indicators;
- skeleton states;
- error boundaries;
- retry;
- cancellation where appropriate.

Long operations must not block the entire application shell.

# 26. Project Workspace

The primary Studio project workspace is:

    Project
      |
      +--> Overview
      +--> Source
      +--> Build
      +--> Artifacts
      +--> Bookings
      +--> Runs
      +--> Results

The project workspace provides contextual navigation without duplicating global
application navigation.

# 27. Source Workspace

Source management remains local to Studio.

The frontend may display:

- project directory;
- source status;
- build configuration;
- toolchain;
- local test results.

Source files must not be uploaded merely because the user opens the project.

# 28. Build Workflow

Studio build flow:

    Project
       |
       v
    Toolchain Detection
       |
       v
    Build Configuration
       |
       v
    Local Build
       |
       v
    Local Tests
       |
       v
    Artifact Packaging
       |
       v
    Artifact Inspection
       |
       v
    Upload

The backend is not the initial build farm.

# 29. Local Runtime Boundary

Tauri provides the native boundary.

    React UI
       |
       | Tauri IPC
       v
    Rust Native Layer
       |
       +--> filesystem
       +--> process execution
       +--> toolchain discovery
       +--> local build
       +--> local test
       +--> artifact packaging
       +--> OS integration

The UI must not directly access privileged operating-system APIs.

# 30. Tauri IPC

Local commands should be explicit.

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

These commands align with the protocol contract but are local IPC operations,
not REST API operations.

# 31. IPC Security

Tauri IPC must validate:

- command arguments;
- filesystem scope;
- process invocation;
- artifact path;
- project path;
- operation ownership.

Arbitrary shell execution must not be exposed as a generic UI command.

# 32. Local Build State

Build state belongs primarily to the local runtime.

The frontend subscribes to:

    BUILD_STARTED
    BUILD_PROGRESS
    BUILD_LOG
    BUILD_COMPLETED
    BUILD_FAILED

The UI should maintain a user-friendly projection of that state.

# 33. Server State

Remote backend data belongs to TanStack Query.

Examples:

- projects;
- platforms;
- bookings;
- credits;
- jobs;
- runs;
- results;
- profile.

The frontend should not duplicate server state unnecessarily in Zustand.

# 34. Client State

Zustand is appropriate for local UI state.

Examples:

- selected organization;
- sidebar state;
- active project;
- active panel;
- local filters;
- UI preferences;
- transient execution controls.

Do not use Zustand as a second backend cache.

# 35. State Ownership

| State | Owner |
|---|---|
| User session | Auth layer |
| Projects | TanStack Query |
| Platforms | TanStack Query |
| Bookings | TanStack Query |
| Jobs | TanStack Query + realtime |
| Results | TanStack Query |
| Sidebar state | Zustand |
| Modal state | Local/Zustand |
| Build process | Tauri/local runtime |
| Live telemetry | Realtime store/stream |
| Form input | Local component state |

# 36. TanStack Query

TanStack Query provides:

- caching;
- request deduplication;
- retries;
- stale-state management;
- pagination;
- mutations;
- invalidation.

Query keys must map cleanly to backend resources.

Example:

    ["projects", organizationId]

    ["project", projectId]

    ["jobs", projectId]

# 37. Query Invalidation

Mutation success should invalidate only affected queries.

Example:

    booking.create
        |
        +--> invalidate ["bookings"]
        +--> invalidate availability query

Avoid global cache invalidation after every operation.

# 38. Optimistic Updates

Optimistic updates should be used selectively.

Safe examples:

- local UI preferences;
- non-critical presentation state.

Avoid optimistic updates for:

- credits;
- payments;
- bookings;
- job execution;
- robot safety;
- resource allocation.

For these, the server is authoritative.

# 39. API Client

`packages/api-client` provides the typed frontend interface to the Control
Plane.

It should provide:

- request construction;
- authentication;
- serialization;
- error mapping;
- retries;
- cancellation;
- pagination;
- API version handling;
- telemetry hooks.

# 40. API Client Architecture

    Feature
       |
       v
    API Client
       |
       v
    HTTP Transport
       |
       v
    RaaS Control Plane

Feature code should not construct arbitrary HTTP requests.

# 41. OpenAPI

The backend API contract should be represented using OpenAPI.

The client should derive or validate types against the authoritative API contract.

Generated code should be isolated from hand-written client logic.

# 42. API Error Mapping

Backend errors such as:

    ARTIFACT_INCOMPATIBLE
    BOOKING_CONFLICT
    INSUFFICIENT_CREDITS
    JOB_INVALID_STATE

must map to typed client errors.

The UI can then provide contextual remediation.

# 43. API Retry Policy

Automatic retry is allowed for safe transient failures.

Examples:

- connection reset;
- selected 5xx failures;
- temporary network unavailability.

Avoid automatic retries for:

- booking creation;
- payment;
- credit consumption;
- job start;
- job stop;

unless the API operation is explicitly idempotent and the client preserves its
idempotency key.

# 44. Idempotency Integration

Side-effecting frontend operations must support idempotency where required.

Example:

    booking.create
       |
       v
    API client
       |
       +--> Idempotency-Key
       |
       v
    Control Plane

The API client owns generation and propagation mechanics, while the feature
owns the logical operation.

# 45. Authentication Integration

The API client receives authenticated credentials through the auth layer.

Conceptually:

    Auth Provider
       |
       v
    Access Token
       |
       v
    API Client
       |
       v
    HTTPS API

The API client must never persist refresh tokens itself.

# 46. Authentication Refresh

When an access token expires:

    API request
       |
       v
    401
       |
       v
    Auth layer refresh
       |
       v
    New access token
       |
       v
    Retry request

The API client must avoid refresh storms.

# 47. Realtime Architecture

Realtime data uses WebSocket.

Primary uses:

- job state;
- run state;
- telemetry;
- logs;
- resource state;
- booking changes;
- agent status;
- result availability.

REST remains authoritative.

# 48. Realtime Principle

The frontend treats WebSocket as:

    realtime notification/update channel

not:

    durable state database.

On reconnect:

    WebSocket
       |
       v
    reconnect
       |
       v
    replay where available
       |
       v
    REST reconciliation
       |
       v
    current state

# 49. WebSocket Client

A shared realtime client should provide:

- connection lifecycle;
- authentication;
- subscription;
- reconnection;
- heartbeat;
- event parsing;
- duplicate detection;
- sequence tracking;
- backoff;
- state reconciliation.

# 50. Event Handling

Event flow:

    WebSocket
       |
       v
    Event Parser
       |
       v
    Event Validation
       |
       v
    Event Router
       |
       +--> Query Invalidation
       +--> Realtime Store
       +--> UI Notification

# 51. Event Deduplication

WebSocket delivery is at-least-once.

The frontend should deduplicate by:

    event_id

where the event category requires durable processing.

# 52. Event Ordering

Events are resource-scoped.

The frontend must not assume global ordering.

Example:

    job-001 sequence 10
    job-002 sequence 5

These are independent streams.

# 53. Sequence Gaps

If a resource sequence gap is detected:

    sequence 10
        |
        X
    expected 11
        |
        v
    received 12

the client should trigger reconciliation/replay according to protocol support.

It must not blindly assume that event 11 is irrelevant.

# 54. Live Execution

The signature Run UI contains:

- Run ID;
- project;
- artifact;
- platform;
- lab;
- status;
- live video;
- robot status;
- CPU;
- memory;
- temperature;
- battery;
- telemetry;
- console/logs/events;
- credits used;
- Stop Job.

# 55. Execution State Model

Frontend job states:

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

The UI must map unknown future states safely.

# 56. Safety UI

The UI must distinguish:

    Stop Job
        !=
    Physical E-Stop

Stop Job means application/job control.

Physical emergency stop remains local to the robot/lab safety system.

The frontend must never present a cloud action as equivalent to physical E-stop.

# 57. Telemetry

Telemetry may be high-frequency.

The UI should not render every incoming sample independently.

Recommended pipeline:

    Telemetry Stream
       |
       v
    Buffer
       |
       v
    Downsample / Aggregate
       |
       v
    Chart State
       |
       v
    Render

# 58. Video

Live video should use a dedicated streaming mechanism rather than sending
high-bandwidth video through ordinary REST or normal event messages.

The frontend should receive:

- stream URL/session;
- authorization context;
- stream metadata.

The exact media protocol is defined separately.

# 59. Logs

Logs should support:

- streaming;
- pagination;
- search;
- severity filtering;
- timestamps;
- copy/export.

High-volume logs should be virtualized.

# 60. Results

Results are durable server-side resources.

The frontend obtains:

    Result Metadata
       |
       +--> Summary
       +--> Metrics
       +--> Files
       +--> Run Environment
       +--> Artifact Digest

Large files should be downloaded through controlled object-storage access.

# 61. Results and Reproducibility

The Results UI should expose environment metadata:

- artifact digest;
- runtime version;
- platform version;
- SDK version;
- architecture;
- Lab Agent version;
- protocol version;
- capability revision.

# 62. Project Data Loading

The project workspace should load progressively.

Preferred:

    Project Summary
       |
       +--> immediate
       |
    Builds
       |
       +--> lazy
       |
    Artifacts
       |
       +--> lazy
       |
    Runs
       |
       +--> lazy
       |
    Results
       |
       +--> lazy

Do not load the entire project graph at startup.

# 63. Pagination

Large collections must use server-side pagination.

Examples:

- projects;
- jobs;
- runs;
- results;
- audit events;
- logs.

Cursor-based pagination is preferred.

# 64. Filtering

Filters should be represented as query parameters where server-side filtering
is required.

Examples:

    status
    platform
    date range
    project
    organization

The UI should not fetch thousands of records merely to filter locally.

# 65. Tables

Large data tables should support:

- virtualization where needed;
- server-side pagination;
- sorting;
- filtering;
- column selection;
- responsive behavior.

# 66. Performance Budget

The frontend should define measurable budgets.

Initial targets:

| Metric | Target |
|---|---:|
| Initial shell render | <2 s on target desktop |
| Route transition | <500 ms for cached data |
| Interaction response | <100 ms |
| Realtime UI update | <250 ms where practical |
| Large table scrolling | 60 FPS target |
| Main bundle | monitored and budgeted |
| Memory growth during long run | bounded |

Exact production thresholds may be tuned after profiling.

# 67. Code Splitting

Feature routes should be lazy-loaded where appropriate.

High-cost modules include:

- admin console;
- charts;
- live execution;
- video;
- advanced results.

The dashboard should not load every feature bundle at startup.

# 68. Rendering Strategy

The Web Console should use standard React client rendering unless a future
requirement justifies server rendering.

Studio uses React rendering inside the Tauri WebView.

# 69. Memoization

Memoization should be driven by profiling.

Avoid unnecessary:

- global rerenders;
- derived state recomputation;
- chart recreation;
- telemetry object allocation.

Do not introduce memoization everywhere without evidence.

# 70. Realtime Rendering Budget

Telemetry and logs must be decoupled from React's global render cycle.

Recommended:

    Network
       |
       v
    Stream Buffer
       |
       v
    Aggregator
       |
       v
    View Model
       |
       v
    React Render

# 71. Offline Behavior

Studio should detect loss of Control Plane connectivity.

The UI should show:

    CONNECTED
    DEGRADED
    OFFLINE

Local project/source operations should continue when possible.

Remote operations should be clearly disabled or queued only where explicitly
supported.

# 72. Web Offline Behavior

The Web Console may provide limited cached read-only state.

It must not imply that cached information is current for:

- booking availability;
- credits;
- robot status;
- execution state.

# 73. Connectivity Indicator

A global connectivity indicator should communicate:

- API connectivity;
- realtime connectivity;
- local runtime connectivity for Studio.

These are separate states.

# 74. Error Boundaries

React error boundaries should isolate failures.

A failure in:

    Results chart

must not crash:

    Application shell

Critical shell failure should provide recovery options.

# 75. Error Presentation

Errors should include:

- user-friendly summary;
- stable error code where useful;
- remediation;
- retry action where safe;
- support/reference ID.

Never expose stack traces to ordinary users.

# 76. Loading States

Every asynchronous feature should define:

- initial loading;
- refreshing;
- empty;
- error;
- success.

Loading should not be represented solely by a generic spinner.

Use skeletons for major page structures.

# 77. Empty States

Examples:

    No Projects
    No Bookings
    No Artifacts
    No Runs
    No Results
    No Credits

Empty states should explain:

- what is missing;
- why it matters;
- what the user can do next.

# 78. Accessibility

Accessibility is a production requirement.

The frontend should target WCAG 2.2 AA where applicable.

Requirements include:

- keyboard navigation;
- focus management;
- semantic HTML;
- accessible names;
- contrast;
- screen-reader support;
- reduced-motion support;
- form validation;
- accessible dialogs;
- accessible tables.

# 79. Keyboard Navigation

All primary workflows must be usable without a mouse.

Examples:

    Login
    Create Project
    Build
    Book
    Start Job
    Stop Job
    View Results

Keyboard focus must remain visible.

# 80. Focus Management

Dialogs and route transitions should manage focus predictably.

Example:

    Open Dialog
       |
       v
    Focus first meaningful control
       |
       v
    Close
       |
       v
    Restore triggering control

# 81. Accessibility and Live Updates

Realtime status updates must not overwhelm screen readers.

Use appropriate ARIA live-region strategies.

High-frequency telemetry must not be announced sample-by-sample.

# 82. Accessibility and Charts

Charts must provide:

- accessible title;
- summary;
- tabular/alternative representation where meaningful;
- keyboard-accessible controls.

Important metrics must not be conveyed through color alone.

# 83. Responsive Web Design

The Web Console must support:

- desktop;
- laptop;
- tablet where practical.

Admin workflows are primarily desktop-oriented.

Critical user actions should remain usable at reduced widths.

# 84. Studio Desktop Layout

Studio should optimize for developer desktops.

Recommended layout:

    Sidebar
       |
       +--> Project Context
       |
       +--> Main Workspace
       |
       +--> Optional Inspector/Logs

Dense technical information should remain readable.

# 85. Forms

Forms should use shared validation schemas where possible.

Validation occurs:

    User Input
       |
       v
    Client Validation
       |
       v
    API
       |
       v
    Server Validation

Client validation improves UX.

Server validation remains authoritative.

# 86. Validation Errors

Field errors should map from backend validation errors when available.

Example:

    FIELD_INVALID

may map to:

    artifact.target_architecture

The UI should highlight the specific field.

# 87. Notifications

Use a consistent notification system for:

- success;
- warning;
- error;
- informational events.

Persistent operational failures should not rely only on transient toast messages.

# 88. Job Notifications

Job state changes may produce:

- in-app notification;
- status indicator;
- activity entry.

Do not produce excessive notifications for every telemetry event.

# 89. Security UI

The frontend must:

- avoid displaying credentials;
- redact sensitive fields;
- avoid exposing tokens in URLs;
- prevent accidental artifact/source disclosure;
- enforce permission-aware navigation.

Frontend security is supplemental to backend controls.

# 90. Source-Code Boundary

Studio should preserve:

> Source code stays on the user's machine; only the execution artifact crosses
> into RaaS.

The frontend must not accidentally upload:

- source files;
- Git metadata;
- build caches;
- credentials;
- unrelated project files.

Artifact packaging and validation enforce the actual boundary.

# 91. Artifact UI

Artifact UI should display:

- artifact ID;
- version;
- digest;
- platform;
- architecture;
- SDK;
- runtime;
- capabilities;
- validation status;
- upload status.

# 92. Artifact Upload

Flow:

    Select .krv
       |
       v
    Inspect
       |
       v
    Local Validation
       |
       v
    Upload
       |
       v
    Server Validation
       |
       v
    Accepted / Rejected

Upload progress must be visible.

# 93. Booking UI

Booking flow:

    Platform
       |
       v
    Resource
       |
       v
    Date/Time
       |
       v
    Duration
       |
       v
    Credit Quote
       |
       v
    Compatibility Preflight
       |
       v
    Confirm
       |
       v
    Booking

# 94. Platform Credits

The frontend must distinguish credit types by platform.

Example:

    Humanoid-A Credits
    Humanoid-B Credits

The UI must not imply that platform-specific credits are interchangeable unless
the backend explicitly supports it.

# 95. Credit Consumption

Example:

    rate = 15 credits/min
    duration = 30 min

    required = 450 credits

The UI should show:

- credit type;
- rate;
- required credits;
- current balance;
- remaining balance.

The backend remains authoritative.

# 96. Job Start Flow

    Booking
       |
       v
    Artifact
       |
       v
    Compatibility
       |
       v
    Credit/eligibility validation
       |
       v
    Start Job
       |
       v
    Job Status
       |
       v
    Live Run

# 97. Stop Job

The Stop Job action should:

1. confirm the target run;
2. send the stop command;
3. display stopping state;
4. wait for authoritative completion;
5. show final state.

The UI must not immediately claim:

    STOPPED

until authoritative state confirms it.

# 98. Race Conditions

Frontend operations must tolerate:

- double clicks;
- delayed responses;
- stale state;
- reconnect;
- duplicate events;
- user opening the same run in multiple windows.

Disable duplicate controls where appropriate and rely on backend idempotency.

# 99. Multiple Sessions

A user may have:

- Studio open;
- Web Console open;
- multiple browser tabs.

State changes from one session should propagate through realtime or query
reconciliation.

# 100. Query and Event Consistency

The frontend should follow:

    REST = authoritative state
    WebSocket = realtime signal

When an event says:

    job.completed

the client may:

    invalidate ["job", jobId]

and fetch authoritative state.

# 101. API Version Compatibility

The frontend must declare supported API versions.

During migration:

    Studio vNext
       |
       +--> API v1
       +--> API v2

only supported combinations are allowed.

Unsupported combinations must produce a clear compatibility screen.

# 102. Frontend Version Metadata

Requests should provide client metadata where supported:

    client_name
    client_version
    platform
    build_id

This helps support and compatibility diagnostics.

# 103. Build Identification

Each production build should have:

    application_version
    build_id
    commit_id

The UI should expose version information in an About or Diagnostics view.

# 104. Diagnostics

Studio should provide a diagnostics view containing:

- application version;
- OS;
- host architecture;
- backend connectivity;
- realtime connectivity;
- API version;
- local toolchain;
- selected project;
- relevant error IDs.

Sensitive credentials must be excluded.

# 105. Web Diagnostics

The Web Console may expose:

- frontend version;
- API version;
- realtime status;
- request/reference ID.

Detailed infrastructure information should remain admin-only.

# 106. Logging

Frontend logs should be structured where practical.

Levels:

    DEBUG
    INFO
    WARN
    ERROR

Production default should avoid verbose debug logging.

# 107. Error Correlation

Backend errors should expose a safe reference such as:

    request_id
    trace_id
    operation_id

The UI can show a support reference.

# 108. Frontend Telemetry

Recommended metrics:

    page_load
    route_transition
    api_request_duration
    api_error
    websocket_connect
    websocket_disconnect
    websocket_reconnect
    build_duration
    artifact_upload_duration
    job_start_latency
    render_error

Telemetry must not contain source code or secrets.

# 109. Privacy

Frontend telemetry must not collect:

- source contents;
- artifact secrets;
- access tokens;
- refresh tokens;
- private keys.

User and organization identifiers should follow the platform privacy policy.

# 110. Testing Strategy

Testing occurs at multiple levels:

    Unit
      |
      v
    Component
      |
      v
    Feature
      |
      v
    Integration
      |
      v
    E2E
      |
      v
    Production smoke

# 111. Unit Testing

Vitest should test:

- utility functions;
- validation;
- state transitions;
- formatters;
- compatibility logic;
- event reducers;
- error mapping.

# 112. Component Testing

React Testing Library should test:

- rendering;
- user interaction;
- accessibility;
- loading;
- error;
- empty states;
- form behavior.

Tests should focus on observable behavior.

# 113. Feature Testing

Feature tests should validate complete workflows.

Examples:

    Create Project
    Build
    Package Artifact
    Upload Artifact
    Book Resource
    Start Job
    Observe Run
    View Result

# 114. API Integration Testing

The API client should be tested against:

- mock server;
- contract fixtures;
- representative error responses;
- pagination;
- authentication;
- retries;
- idempotency.

# 115. WebSocket Testing

Test:

- connection;
- authentication;
- subscription;
- event parsing;
- duplicate events;
- sequence gaps;
- reconnect;
- state reconciliation;
- authorization failure.

# 116. Tauri Testing

Test:

- IPC commands;
- argument validation;
- path validation;
- process execution;
- cancellation;
- build output;
- artifact packaging.

Native integration tests should cover supported host platforms.

# 117. End-to-End Testing

Playwright should test critical user flows.

Minimum:

    Login
      |
      v
    Create Project
      |
      v
    Build
      |
      v
    Artifact
      |
      v
    Book
      |
      v
    Run
      |
      v
    Live
      |
      v
    Results

# 118. E2E Environment

E2E tests should use isolated environments.

They must not consume production:

- credits;
- robot slots;
- customer data.

# 119. Accessibility Testing

Automated accessibility testing should be included in CI where practical.

Manual review remains necessary for:

- keyboard workflows;
- screen readers;
- complex tables;
- charts;
- live execution UI.

# 120. Visual Regression

Critical shared UI components should support visual regression testing.

Candidates:

- navigation;
- dialogs;
- tables;
- status cards;
- robot cards;
- job timeline;
- result dashboards.

# 121. Test Data

Frontend tests should use deterministic fixtures.

Examples:

    project fixture
    platform fixture
    artifact fixture
    booking fixture
    job fixture
    run fixture
    result fixture

Sensitive production data must never be used as fixtures.

# 122. Mocking Strategy

Mock at explicit boundaries.

Recommended:

    Component
       |
       v
    Feature API abstraction
       |
       v
    Mock API

Avoid mocking internal React implementation details.

# 123. Build Pipeline

Frontend CI should include:

    Install
       |
       v
    Type Check
       |
       v
    Lint
       |
       v
    Unit Tests
       |
       v
    Component Tests
       |
       v
    Build
       |
       v
    E2E
       |
       v
    Package / Publish

# 124. Type Safety

TypeScript should use strict mode.

Avoid:

    any

except for explicitly justified boundary adapters.

API contracts should generate or validate types.

# 125. Linting

Linting should enforce:

- React correctness;
- hooks rules;
- unused imports;
- unsafe patterns;
- accessibility rules;
- import boundaries.

# 126. Formatting

Use a single formatter configuration across the monorepo.

Formatting must be automatic in CI/development.

# 127. Dependency Management

Dependencies should be centrally managed where practical.

Security scanning should detect:

- vulnerable packages;
- malicious packages;
- outdated dependencies.

Frontend dependencies must be regularly updated.

# 128. Bundle Analysis

CI should monitor:

- JavaScript bundle size;
- CSS size;
- route chunk size;
- duplicate dependencies.

Unexpected large increases should require review.

# 129. Memory Management

Long-running execution sessions may remain open for hours.

The frontend must avoid:

- unbounded telemetry arrays;
- retained event listeners;
- unreleased WebSocket subscriptions;
- chart object leaks;
- repeated query cache growth.

# 130. Telemetry Retention

The UI should keep only the window necessary for visualization.

Example:

    live chart:
        last N minutes

Long-term telemetry belongs to backend/result storage.

# 131. Realtime Cleanup

When leaving a run:

    unsubscribe
       |
       v
    release event handlers
       |
       v
    stop unnecessary streams

This prevents hidden resource consumption.

# 132. Resource Cleanup

React effects must clean up:

- timers;
- event listeners;
- subscriptions;
- WebSocket handlers;
- media streams;
- native IPC listeners.

# 133. Browser Security

The Web Console should use:

- HTTPS;
- secure security headers;
- Content Security Policy;
- secure cookie policy if cookies are used;
- appropriate frame restrictions;
- dependency security controls.

# 134. Desktop Security

Studio should:

- restrict Tauri capabilities;
- limit filesystem access;
- limit process execution;
- protect credentials;
- validate IPC parameters;
- use signed application packages.

# 135. Update Strategy

Studio updates should be signed.

Update flow:

    New Release
       |
       v
    Signature Verification
       |
       v
    Download
       |
       v
    Install
       |
       v
    Restart
       |
       v
    Validate

Unsigned or tampered updates must be rejected.

# 136. Web Deployment

Web releases should be immutable/versioned.

CDN/browser caching must account for:

- application version;
- API compatibility;
- asset hashes.

Old assets should remain available long enough to avoid broken deployments.

# 137. Frontend Rollback

Rollback should restore:

- frontend assets;
- application version;
- compatible configuration.

A frontend rollback must remain compatible with the supported backend version.

# 138. Deployment Compatibility

Preferred deployment sequence:

    Backend compatibility
       |
       v
    Deploy backend
       |
       v
    Deploy frontend
       |
       v
    Migrate clients
       |
       v
    Retire old contract

Frontend must not require an API change before the backend supports it.

# 139. API Evolution

For additive API changes:

    Backend
       |
       v
    New optional capability
       |
       v
    Frontend adopts
       |
       v
    Old frontend continues

For breaking changes:

    New API version
       |
       v
    Frontend migration
       |
       v
    Compatibility window
       |
       v
    Old API retirement

# 140. Feature Flags

Feature flags may control:

- staged frontend features;
- experimental UI;
- platform availability;
- rollout percentages.

Feature flags must not be used as the primary safety mechanism.

# 141. Feature Flag Ownership

Flags should define:

    name
    purpose
    owner
    default
    environment
    expiry/review date

Temporary flags should have explicit removal tasks.

# 142. Platform Extensibility

New robot platforms should be added through configuration/data and modular UI
where possible.

Platform cards should consume:

    platform metadata
       +
    capabilities
       +
    artwork
       +
    availability
       +
    credit plans

rather than requiring application-wide redesign.

# 143. Robot Platform Card

A platform card may show:

- platform name;
- image/artwork;
- capabilities;
- architecture;
- runtime;
- availability;
- credit type;
- rate;
- supported use cases.

# 144. Artwork Architecture

Visual assets should be modular.

Required categories include:

- RaaS Hero;
- Platform Card;
- Lab/Hardware Card;
- Credit Type;
- Booking;
- Job Execution;
- Robot Status;
- Results;
- Admin Dashboard;
- Empty States;
- Error States;
- Loading;
- Maintenance;
- Robot Offline;
- No Credits.

# 145. Internationalization

The frontend should be structured so localization can be added later.

User-visible strings should not be scattered across logic.

Dates, times, and numeric formatting should use locale-aware utilities.

The backend remains authoritative for timestamps.

# 146. Time Handling

Frontend displays should convert UTC server timestamps into the user's selected
display timezone where appropriate.

Internal API values remain normalized.

Booking times must clearly show:

- date;
- timezone;
- duration;
- start/end.

# 147. Date and Time Safety

The UI must avoid ambiguous timestamps.

Example:

    2026-10-08 14:00 IST

is preferable to:

    14:00

for booking and execution operations.

# 148. Forms and Unsaved Changes

The frontend should warn before abandoning significant unsaved configuration.

Examples:

- build configuration;
- booking form;
- project settings.

Do not interrupt users for trivial transient UI state.

# 149. Long Operations

Long operations should be represented as durable resources.

Examples:

- build;
- upload;
- booking processing;
- job;
- result processing.

The UI should allow navigation away and return later without losing operation
context.

# 150. Progress Reporting

Progress should distinguish:

    known progress
    unknown progress
    completed
    failed

Do not display fake percentages for operations without measurable progress.

# 151. Cancellation

Cancellation must distinguish:

    local cancellation
    remote cancellation
    job stop
    job cancellation
    upload cancellation
    build cancellation

The UI must reflect authoritative final state.

# 152. Upload Resumption

Large artifact uploads should support resumable/multipart behavior when provided
by the backend.

The UI should show:

- uploaded bytes;
- total size;
- transfer rate;
- remaining estimate;
- pause/cancel if supported.

# 153. Project Security

Projects should not expose source content to the backend unintentionally.

The frontend should clearly distinguish:

    LOCAL PROJECT
    REMOTE PROJECT METADATA

# 154. Error Recovery

For recoverable errors:

    error
      |
      +--> retry
      +--> refresh
      +--> reconnect
      +--> reauthenticate
      +--> remediate

For non-recoverable errors:

    error
      |
      v
    clear explanation
      |
      v
    next action/support reference

# 155. Reauthentication UX

When authentication expires:

    Session Expired
       |
       v
    Sign In Again
       |
       v
    Restore Context
       |
       v
    Return to Previous Page

Unsaved local state should be preserved where practical.

# 156. Authorization UX

A forbidden action should communicate:

    You do not have permission to perform this action.

It should not expose backend authorization internals.

Controls may be hidden or disabled based on permissions, but backend enforcement
remains mandatory.

# 157. Organization Switching

If multi-organization support is enabled:

    Current Organization
       |
       v
    Switch
       |
       v
    Refresh organization-scoped queries
       |
       v
    Reconnect realtime subscriptions
       |
       v
    New organization context

Stale organization data must not remain visible as if current.

# 158. Realtime on Organization Switch

The sequence should be:

    unsubscribe old organization
       |
       v
    clear organization-scoped realtime state
       |
       v
    establish new authorization context
       |
       v
    subscribe new organization
       |
       v
    fetch authoritative state

# 159. Browser Tab Coordination

Multiple tabs may coordinate:

- authentication refresh;
- logout;
- organization changes.

The implementation should avoid redundant refresh-token operations.

# 160. Desktop Multi-Window

Studio may eventually support multiple windows.

Shared state must distinguish:

- global session;
- project context;
- window-local UI state.

# 161. State Persistence

Persist only necessary client state.

Potential persisted state:

- UI preferences;
- selected organization;
- non-sensitive navigation state.

Never persist:

- access tokens in arbitrary local storage;
- refresh tokens outside secure storage;
- private keys;
- source secrets.

# 162. Frontend API Boundary

Feature code should interact through domain-oriented APIs.

Preferred:

    bookingService.createBooking()

rather than:

    fetch("/api/v1/booking/create")

This improves testability and contract stability.

# 163. Service Layer

Recommended structure:

    Feature UI
       |
       v
    Feature Hook
       |
       v
    Domain Service
       |
       v
    API Client
       |
       v
    Transport

Services should remain thin and explicit.

# 164. Custom Hooks

Hooks should encapsulate feature behavior.

Examples:

    useProjects()
    useProject()
    useCreateBooking()
    useJob()
    useRunTelemetry()
    useResults()

Hooks should not hide major side effects unexpectedly.

# 165. Forms Architecture

Recommended:

    Form UI
       |
       v
    Schema Validation
       |
       v
    Feature Mutation
       |
       v
    API Client

Form state remains local unless shared across multiple routes.

# 166. Shared Contracts

`packages/contracts` should define:

- request types;
- response types;
- event types;
- enums;
- status types;
- artifact metadata;
- compatibility structures;
- domain identifiers.

The package should not contain React components.

# 167. Shared Utilities

`packages/utils` may contain:

- date formatting;
- number formatting;
- ID utilities;
- safe parsing;
- error helpers.

Domain-specific logic belongs in the owning feature/package.

# 168. Frontend Configuration

Configuration should distinguish:

    build-time
    runtime
    environment

Examples:

- API base URL;
- WebSocket URL;
- feature flags;
- environment name.

Secrets must not be embedded in frontend builds.

# 169. Environment Model

Frontend environments:

    Local
      |
      v
    Development
      |
      v
    Staging
      |
      v
    Production

Each environment must point to compatible backend contracts.

# 170. Phase Mapping Overview

| Phase | Frontend Activity |
|---|---|
| Phase 0 | Foundation and shared architecture |
| Phase 1 | Studio/Web authentication and shell |
| Phase 2 | Build/artifact workflow |
| Phase 3 | Control Plane integration |
| Phase 4 | Booking/credits/commercial UI |
| Phase 5 | Execution UI |
| Phase 6 | Lab/robot integration |
| Phase 7 | Live/video/results |
| Phase 8 | Production hardening |

# 171. P0 FOUNDATION

Implement:

- monorepo;
- Studio shell;
- Web shell;
- shared UI;
- contracts;
- API client foundation;
- auth abstraction;
- routing;
- state architecture;
- CI;
- testing foundation.

Acceptance:

- both apps build independently;
- shared packages build;
- TypeScript strict mode passes;
- test infrastructure is operational.

# 172. Phase 1 — Authentication

Implement:

- login;
- logout;
- session;
- token refresh;
- profile;
- organization context;
- route protection.

Acceptance:

- authenticated routes work;
- unauthorized routes are protected;
- session expiration is handled.

# 173. P2 BUILD & ARTIFACT

Implement:

- Projects;
- Source;
- Builds;
- Toolchain;
- Tests;
- Artifact packaging;
- Artifact validation;
- Artifact upload.

Acceptance:

- source remains local;
- `.krv` is generated;
- upload is explicit;
- artifact metadata is visible.

# 174. P3 CONTROL PLANE

Implement:

- projects API;
- platforms API;
- artifacts API;
- API error handling;
- realtime foundation;
- query caching.

Acceptance:

- frontend communicates through typed API client;
- server state is authoritative.

# 175. P4 BOOKING & COMMERCIAL

Implement:

- platform discovery;
- availability;
- booking;
- quotes;
- credits;
- billing;
- booking history.

Acceptance:

- platform-specific credits are visible;
- booking conflict handling works;
- credit balances are authoritative.

# 176. P5 EXECUTION

Implement:

- jobs;
- runs;
- start/stop;
- status;
- logs;
- execution timeline.

Acceptance:

- job state is authoritative;
- duplicate start requests are safely handled;
- stop state is accurately represented.

# 177. P6 LAB & ROBOT

Implement:

- lab status;
- resource status;
- compatibility;
- agent status;
- robot platform details.

Acceptance:

- incompatible resources are not presented as executable;
- lab/resource health is visible.

# 178. P7 LIVE & RESULTS

Implement:

- WebSocket;
- telemetry;
- video;
- logs;
- results;
- experiment views;
- rerun.

Acceptance:

- reconnect works;
- event duplication is handled;
- state reconciliation works;
- results remain accessible.

# 179. P8 PRODUCTION

Implement:

- performance budgets;
- accessibility certification;
- security hardening;
- signed Studio releases;
- production monitoring;
- crash reporting;
- rollback;
- visual regression;
- operational diagnostics.

Acceptance:

- critical user journeys pass production gates;
- release/rollback is repeatable.

# 180. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Frontend/backend contract drift | High | OpenAPI/contracts + CI |
| Shared UI coupling | Medium | Explicit package boundaries |
| State duplication | High | TanStack Query for server state |
| Realtime loss | High | REST reconciliation |
| Telemetry overload | High | Buffer/downsample |
| Source leakage | Critical | Local build + explicit artifact upload |
| Token exposure | Critical | Auth abstraction + secure storage |
| Poor accessibility | High | WCAG + automated/manual testing |
| Memory leaks | High | cleanup + long-run tests |
| Slow initial load | Medium | code splitting |
| Broken rolling deploy | High | backend-first compatibility |
| Unsafe Stop semantics | Critical | distinguish job stop from E-stop |
| Excessive retries | High | idempotency-aware retry policy |
| UI permission bypass | High | backend authorization |
| Platform-specific UI duplication | Medium | shared domain components |

# 181. Risk — Realtime Loss

A WebSocket disconnect must not result in permanently stale execution state.

Mitigation:

    disconnect
       |
       v
    reconnect
       |
       v
    replay
       |
       v
    REST reconciliation

# 182. Risk — Source-Code Leakage

The desktop UI could accidentally package or upload source files.

Mitigation:

- `.krv` allowlist;
- local artifact inspection;
- explicit upload action;
- manifest validation;
- backend validation;
- no generic project-directory upload API.

# 183. Risk — Frontend as Security Boundary

A malicious client can bypass UI controls.

Mitigation:

> The frontend is never the authoritative authorization boundary.

All protected operations are authorized by the Control Plane.

# 184. Risk — Long-Running Run UI

A run may last hours.

Mitigation:

- bounded telemetry buffers;
- virtualized logs;
- controlled chart updates;
- event cleanup;
- memory profiling.

# 185. Risk — Version Mismatch

An old Studio may communicate with a newer backend.

Mitigation:

- explicit client version;
- API compatibility policy;
- compatibility checks;
- migration windows;
- clear unsupported-version screen.

# 186. Open Questions

1. What exact React router implementation will be selected?
2. What exact Tauri version will be used?
3. Will the Web Console use a BFF/session architecture?
4. What exact API client generation strategy will be used?
5. Which OpenAPI generator will be selected?
6. What exact WebSocket client implementation will be used?
7. Which media streaming protocol will be selected for live video?
8. What exact telemetry transport will be used?
9. What exact browser support matrix will be supported?
10. What exact Linux distributions will Studio support?
11. What exact Windows versions will Studio support?
12. What exact macOS versions will be supported in P1?
13. What exact accessibility certification process will be used?
14. What exact frontend performance budgets will become release gates?
15. Which frontend telemetry provider will be used?
16. What exact crash-reporting mechanism will be used?
17. What exact feature-flag service will be used?
18. Will frontend internationalization be P1 or later?
19. What exact organization-switch behavior will be used?
20. What exact browser session architecture will be used?
21. How will video authorization be integrated?
22. What exact artifact upload resumability mechanism will be supported?
23. Which frontend pages require offline support?
24. What exact Studio auto-update mechanism will be used?
25. What exact UI visual-regression tooling will be used?

# 187. Full Acceptance Criteria — Architecture

- [ ] Studio is independently buildable.
- [ ] Web Console is independently buildable.
- [ ] Shared UI package is independent of application code.
- [ ] Shared contracts are independent of React.
- [ ] API client is centralized.
- [ ] Feature boundaries are explicit.
- [ ] Application shell is defined.
- [ ] Routing architecture is defined.
- [ ] State ownership is defined.
- [ ] Realtime architecture is defined.
- [ ] Tauri boundary is defined.

# 188. Full Acceptance Criteria — Studio

- [ ] Studio uses Tauri.
- [ ] Studio uses React and TypeScript.
- [ ] Rust owns privileged native operations.
- [ ] Filesystem access is scoped.
- [ ] Process execution is controlled.
- [ ] Local build is supported.
- [ ] Local tests are supported.
- [ ] Artifact packaging is local.
- [ ] Artifact upload is explicit.
- [ ] Source code remains local by default.
- [ ] Studio supports the defined host OS matrix.

# 189. Full Acceptance Criteria — Web Console

- [ ] Web Console supports authentication.
- [ ] User navigation is defined.
- [ ] Admin navigation is defined.
- [ ] Route protection is implemented.
- [ ] Responsive layout is implemented.
- [ ] Credits and billing are represented.
- [ ] Booking is represented.
- [ ] Jobs and results are represented.
- [ ] Administrative functions are isolated.

# 190. Full Acceptance Criteria — Shared UI

- [ ] Shared design tokens exist.
- [ ] Shared primitives exist.
- [ ] Shared status components exist.
- [ ] Shared forms exist where useful.
- [ ] Components are accessible.
- [ ] Components are independently tested.
- [ ] Shared UI has no API dependency.
- [ ] Shared UI has no application routing dependency.
- [ ] Domain components remain reusable.

# 191. Full Acceptance Criteria — State

- [ ] Server state uses TanStack Query.
- [ ] Local UI state uses Zustand/local state.
- [ ] Server state is not duplicated unnecessarily.
- [ ] Query keys are consistent.
- [ ] Mutations invalidate affected queries.
- [ ] Optimistic updates are restricted.
- [ ] Long-running state is durable.
- [ ] Realtime updates reconcile server state.

# 192. Full Acceptance Criteria — API Client

- [ ] API calls use the shared API client.
- [ ] OpenAPI contracts are authoritative.
- [ ] API errors are typed.
- [ ] Authentication is integrated.
- [ ] Token refresh is integrated.
- [ ] Retry policy is explicit.
- [ ] Idempotency is supported.
- [ ] Pagination is supported.
- [ ] Cancellation is supported.
- [ ] Client version metadata is supported.

# 193. Full Acceptance Criteria — Realtime

- [ ] WebSocket authentication is supported.
- [ ] Subscription authorization is respected.
- [ ] Events are validated.
- [ ] Duplicate events are handled.
- [ ] Resource sequence is handled.
- [ ] Reconnect is implemented.
- [ ] Replay is supported where available.
- [ ] REST reconciliation is implemented.
- [ ] Event handlers are cleaned up.
- [ ] High-frequency telemetry is buffered.

# 194. Full Acceptance Criteria — Execution

- [ ] Job states are represented.
- [ ] Run states are represented.
- [ ] Start is idempotency-aware.
- [ ] Stop is authoritative.
- [ ] Stop Job is distinct from E-stop.
- [ ] Live telemetry is bounded.
- [ ] Logs are virtualized/paginated.
- [ ] Video is separately streamed.
- [ ] Credits used are displayed.
- [ ] Execution environment metadata is visible.

# 195. Full Acceptance Criteria — Artifact

- [ ] `.krv` is the execution upload format.
- [ ] Artifact metadata is displayed.
- [ ] Artifact digest is displayed.
- [ ] Platform compatibility is displayed.
- [ ] Architecture is displayed.
- [ ] SDK/runtime requirements are displayed.
- [ ] Capability requirements are displayed.
- [ ] Upload progress is displayed.
- [ ] Upload failures are recoverable where supported.
- [ ] Source directories are not uploaded by default.

# 196. Full Acceptance Criteria — Accessibility

- [ ] Keyboard navigation works.
- [ ] Focus is visible.
- [ ] Dialog focus is managed.
- [ ] Forms have accessible labels.
- [ ] Errors are accessible.
- [ ] Color is not the sole status indicator.
- [ ] Charts have accessible alternatives.
- [ ] Live updates do not overwhelm assistive technology.
- [ ] Reduced motion is supported.
- [ ] WCAG 2.2 AA is targeted.

# 197. Full Acceptance Criteria — Performance

- [ ] Initial-load budget is measured.
- [ ] Route performance is measured.
- [ ] Bundle size is measured.
- [ ] Large tables are optimized.
- [ ] Telemetry rendering is bounded.
- [ ] Log rendering is bounded.
- [ ] Charts are optimized.
- [ ] Memory growth is measured.
- [ ] Long-running sessions are tested.
- [ ] Performance regressions are visible in CI/release review.

# 198. Full Acceptance Criteria — Testing

- [ ] Unit tests exist.
- [ ] Component tests exist.
- [ ] Feature tests exist.
- [ ] API integration tests exist.
- [ ] WebSocket tests exist.
- [ ] Tauri IPC tests exist.
- [ ] E2E tests exist.
- [ ] Accessibility tests exist.
- [ ] Visual regression exists for critical components.
- [ ] Production smoke tests exist.

# 199. Full Acceptance Criteria — Security

- [ ] Frontend does not act as the authorization boundary.
- [ ] Tokens are not logged.
- [ ] Refresh tokens are securely stored.
- [ ] Tauri filesystem access is restricted.
- [ ] Tauri process execution is restricted.
- [ ] CSP/security headers are configured.
- [ ] Dependencies are scanned.
- [ ] Studio packages are signed.
- [ ] Artifact upload is explicit.
- [ ] Source leakage controls are tested.

# 200. Full Acceptance Criteria — Deployment

- [ ] Local environment works.
- [ ] Development environment works.
- [ ] Staging environment works.
- [ ] Production build is reproducible.
- [ ] Web assets are immutable/versioned.
- [ ] Studio builds are versioned.
- [ ] Studio updates are signed.
- [ ] Backend compatibility precedes frontend dependency.
- [ ] Rollback is documented.
- [ ] Deployment smoke tests exist.

# 201. Full Acceptance Criteria — Observability

- [ ] Frontend errors are captured.
- [ ] API latency is measured.
- [ ] API failures are measured.
- [ ] WebSocket connectivity is measured.
- [ ] Build duration is measurable.
- [ ] Artifact upload duration is measurable.
- [ ] Job-start latency is measurable.
- [ ] Crash reporting exists for Studio.
- [ ] Request/reference IDs are available.
- [ ] Sensitive information is excluded.

# 202. Full Acceptance Criteria — Compatibility

- [ ] Frontend version is known.
- [ ] Backend API version is known.
- [ ] Supported combinations are documented.
- [ ] Unsupported combinations fail clearly.
- [ ] Compatibility checks occur before critical operations.
- [ ] API migration is backward compatible where required.
- [ ] Rolling upgrades are tested.
- [ ] Old clients have a defined retirement path.
- [ ] New clients have a defined minimum backend.
- [ ] Version information is available for diagnostics.

# 203. Architectural Invariants

The following are mandatory:

1. Studio and Web Console remain distinct applications.
2. Shared UI is reusable but not application-aware.
3. Feature boundaries are explicit.
4. TanStack Query owns server state.
5. Zustand/local state owns client UI state.
6. REST remains authoritative.
7. WebSocket provides realtime updates, not durable truth.
8. Tauri owns privileged desktop operations.
9. Source code remains local by default.
10. `.krv` is the explicit remote execution artifact.
11. Backend authorization remains authoritative.
12. Job state is durable and independent of UI lifetime.
13. Stop Job is not physical E-stop.
14. Realtime reconnect performs reconciliation.
15. High-frequency telemetry is buffered and bounded.
16. Accessibility is a release requirement.
17. Long-running sessions must remain memory bounded.
18. Side-effecting operations use idempotency where required.
19. Frontend/backend compatibility is explicitly versioned.
20. Production frontend releases support rollback.
21. Shared contracts remain framework-independent.
22. Platform-specific robot UI must remain extensible.
23. Authentication credentials are never exposed through ordinary UI state.
24. Compatibility and safety gates cannot be bypassed by frontend behavior.
25. The frontend remains a user experience layer over authoritative backend and
    local-runtime boundaries.

# 204. Final Production Baseline

The Kritva RaaS frontend architecture is:

    +-------------------------------------------------------------+
    |                         FRONTEND                            |
    +-------------------------------+-----------------------------+
    |                               |                             |
    v                               v                             |
    RaaS Studio                 RaaS Web Console                  |
    Tauri + React               React + TypeScript                |
    |                               |                             |
    +---------------+---------------+-----------------------------+
                    |
                    v
          Shared Frontend Packages
                    |
          +---------+---------+
          |         |         |
          v         v         v
         UI      Contracts  API Client
          |         |         |
          +---------+---------+
                    |
                    v
             RaaS Control Plane
                    |
             +------+------+
             |             |
             v             v
           REST        WebSocket
             |             |
             +------+------+
                    |
                    v
             Remote RaaS State

Studio additionally has:

    React UI
       |
       v
    Tauri IPC
       |
       v
    Rust Native Runtime
       |
       +--> Filesystem
       +--> Toolchains
       +--> Build
       +--> Tests
       +--> Artifact Packaging

The primary architectural principles are:

> **Build locally, execute remotely.**

> **Keep source code on the user's machine; upload only the validated execution
> artifact.**

> **Use shared contracts and UI primitives without coupling application
> workflows.**

> **Use TanStack Query for server state and Zustand/local state for UI state.**

> **Treat REST as authoritative and WebSocket as realtime notification and
> update transport.**

> **Authenticate through the defined authentication architecture and enforce
> authorization at the Control Plane.**

> **Treat compatibility, authorization, and safety as independent gates.**

> **Design the frontend so a robot execution session can remain open for hours
> without unbounded memory, rendering, or event-processing growth.**

> **Make accessibility, performance, security, observability, and automated
> testing production requirements rather than post-MVP enhancements.**

This architecture provides the frontend foundation for the complete Kritva RaaS
workflow:

    Login
      |
      v
    Create Project
      |
      v
    Develop Locally
      |
      v
    Build Locally
      |
      v
    Generate .krv
      |
      v
    Validate Artifact
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
    Validate Compatibility
      |
      v
    Start Job
      |
      v
    Live Video + Telemetry + Logs
      |
      v
    Complete Run
      |
      v
    Results
      |
      v
    Rerun

The frontend therefore remains a coherent developer and operations experience
while preserving the architectural boundaries between local development,
remote control-plane state, realtime execution, cloud infrastructure, Lab
Agents, and physical robotic systems.
