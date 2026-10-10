# Kritva RaaS Studio UI Specification

## 1. Purpose

This document defines the production UI specification for Kritva RaaS Studio.

Kritva RaaS Studio is the primary desktop application through which a developer
creates robotics projects locally, builds and validates execution artifacts,
selects a robotic platform, books execution resources, submits an artifact,
runs it remotely, observes execution, and retrieves results.

The core product principle is:

> Build locally. Book remotely. Run on real robots.

The primary workflow is:

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
    Local Build / Test
      |
      v
    .krv Artifact
      |
      v
    Select Platform
      |
      v
    Book Resource
      |
      v
    Upload Artifact
      |
      v
    Start Job
      |
      v
    Live Run
      |
      v
    Results
      |
      v
    Run Again

The UI shall preserve the architectural boundary that customer source code
remains on the developer machine during the normal RaaS workflow.

## 2. Scope

This specification covers the Kritva RaaS Studio desktop application,
including:

- authentication;
- session management;
- dashboard;
- projects;
- local source management;
- local build;
- local test;
- artifact generation;
- artifact validation;
- artifact upload;
- platform discovery;
- platform selection;
- booking;
- credits;
- jobs;
- live execution;
- video;
- telemetry;
- logs;
- results;
- rerun;
- settings;
- account/profile;
- administration entry points where applicable.

The specification covers:

- information architecture;
- navigation;
- screen layouts;
- components;
- interactions;
- states;
- error handling;
- loading behavior;
- empty states;
- keyboard interaction;
- accessibility;
- responsive desktop behavior;
- UI-to-backend interfaces.

## 3. Goals

The Studio UI shall:

1. make the local-build/remote-execution boundary obvious;
2. make the primary workflow discoverable;
3. minimize unnecessary navigation;
4. keep project context visible;
5. make platform compatibility understandable;
6. make booking cost explicit before confirmation;
7. prevent accidental execution;
8. make execution state observable;
9. provide useful recovery paths;
10. support keyboard-first workflows;
11. meet production accessibility expectations;
12. expose errors with actionable remediation;
13. avoid exposing customer source to the Control Plane;
14. clearly distinguish local and remote operations.

## 4. Non-Goals

Studio does not:

- store customer source code in the RaaS cloud;
- replace the web administration console;
- directly control robot safety hardware;
- implement physical emergency-stop functionality;
- become the authoritative financial ledger;
- become the authoritative booking database;
- replace the Lab Agent;
- replace the robot runtime;
- expose internal cloud infrastructure details to normal users.

## 5. Product Positioning

Studio is the developer-facing application.

The web console provides broader account, commercial and administrative
functionality.

The conceptual separation is:

    RaaS Studio
        |
        +--> Local Development
        +--> Project Workflow
        +--> Artifact Workflow
        +--> Booking
        +--> Execution
        +--> Results
        |
        v
    RaaS Control Plane

    Web Console
        |
        +--> Account
        +--> Organization
        +--> Administration
        +--> Billing
        +--> Operations

## 6. Platform Targets

Initial production Studio targets:

| Platform | Priority | Status |
|---|---|---|
| Linux x86_64 | P0 | Primary |
| Windows x86_64 | P0 | Primary |
| macOS Apple Silicon | P1 | Later |

The Studio host architecture is independent of the target robot architecture.

A project may target:

- x86_64;
- ARM64;
- embedded architectures;
- supported Kritva platform architectures.

## 7. Technology Baseline

Studio shall use:

- Tauri;
- Rust native layer;
- React;
- TypeScript.

The architecture is:

    React / TypeScript UI
             |
             v
       Tauri IPC Layer
             |
             v
          Rust
             |
       +-----+------+
       |            |
       v            v
    Local FS    Local Build
       |
       v
    Artifact
       |
       v
    HTTPS / WebSocket
       |
       v
    Control Plane

## 8. UI Design Principles

The UI shall follow these principles:

- local-first source handling;
- clear system status;
- progressive disclosure;
- predictable navigation;
- explicit destructive actions;
- visible execution state;
- consistent terminology;
- keyboard accessibility;
- accessible contrast;
- recoverable errors;
- minimal modal interruption;
- clear ownership of actions.

## 9. Primary User Journey

The primary journey is:

    Authenticate
       |
       v
    Select/Create Project
       |
       v
    Build Locally
       |
       v
    Generate Artifact
       |
       v
    Select Platform
       |
       v
    Review Compatibility
       |
       v
    Book
       |
       v
    Upload Artifact
       |
       v
    Validate
       |
       v
    Start Job
       |
       v
    Observe
       |
       v
    Complete
       |
       v
    Results
       |
       v
    Rerun

## 10. Information Architecture

The primary navigation is:

    Home
    Projects
    Platforms
    Bookings
    Jobs
    Results
    Credits
    Settings

Project-context navigation:

    Overview
    Source
    Build
    Artifacts
    Runs
    Results

Administrative functions should be exposed only to authorized users and should
primarily remain in the web console.

## 11. Global Application Layout

The standard Studio shell is:

    +---------------------------------------------------------------+
    | Kritva | Project Context | Environment | Notifications | User |
    +----------------+----------------------------------------------+
    |                |                                              |
    | Navigation     | Main Content                                 |
    |                |                                              |
    | Home           |                                              |
    | Projects       |                                              |
    | Platforms      |                                              |
    | Bookings       |                                              |
    | Jobs           |                                              |
    | Results        |                                              |
    | Credits        |                                              |
    | Settings       |                                              |
    |                |                                              |
    +----------------+----------------------------------------------+
    | Status / Connection / Build State                              |
    +---------------------------------------------------------------+

## 12. Global Header

The header contains:

- Kritva logo;
- current project;
- connection status;
- notification indicator;
- user/profile menu.

Optional contextual actions appear on the right.

The header must remain stable across primary screens.

## 13. Global Sidebar

The sidebar contains:

- Home;
- Projects;
- Platforms;
- Bookings;
- Jobs;
- Results;
- Credits;
- Settings.

The current route must be visually indicated.

The sidebar may collapse to icon mode.

Collapsed mode must retain accessible labels/tooltips.

## 14. Global Status Bar

The status bar displays contextual state such as:

- Local runtime: Ready;
- Build: Idle;
- Control Plane: Connected;
- Lab connection: Available;
- active job count;
- pending upload;
- current project.

Errors should be actionable rather than merely indicated by color.

## 15. Global UI States

All screens shall support:

- loading;
- loaded;
- empty;
- partial;
- error;
- permission denied;
- offline;
- reconnecting;
- stale data.

State must be communicated through text and structure, not color alone.

## 16. Global Loading Rules

Loading indicators should:

- appear near the affected content;
- preserve layout stability;
- avoid unnecessary full-screen blocking;
- provide progress for long operations;
- allow cancellation where safe.

Use skeletons for predictable content.

Use progress indicators for known-duration operations.

## 17. Global Error Rules

Errors shall provide:

- human-readable explanation;
- affected operation;
- recovery action;
- retry where appropriate;
- support/reference identifier when useful.

Example:

    Build failed
    The local compiler returned exit code 2.

    [View Build Log] [Retry Build]

Do not expose raw stack traces by default.

## 18. Global Empty-State Rules

Every empty state shall answer:

1. What is empty?
2. Why is it empty?
3. What should the user do next?

Example:

    No projects yet.

    Create your first project to begin building a robotics application.

    [Create Project]

## 19. Global Confirmation Rules

Confirmation is required for:

- starting remote execution;
- cancelling an active booking where credits may be affected;
- deleting a project;
- removing an artifact where it affects history;
- logging out from a shared environment where appropriate.

Confirmation dialogs must state consequences.

## 20. Login Screen

Layout:

    +--------------------------------------------------+
    |                    Kritva                        |
    |                                                  |
    |              Sign in to RaaS                     |
    |                                                  |
    | Email                                            |
    | [________________________________]               |
    |                                                  |
    | Password                                         |
    | [________________________________]               |
    |                                                  |
    | [ Sign In ]                                      |
    |                                                  |
    | [ Continue with SSO ]                            |
    |                                                  |
    | Forgot password?                                |
    +--------------------------------------------------+

Supported options may include:

- email/password;
- SSO;
- MFA/passkey where configured.

## 21. Login Interactions

The login screen shall:

- validate required fields;
- disable submission while processing;
- preserve entered email after failure;
- avoid revealing whether an account exists during recovery;
- support password visibility toggle;
- support keyboard submission.

On successful login:

    Login
      |
      v
    Session Establishment
      |
      v
    Dashboard

## 22. Login States

Loading:

    Signing in...

Error:

    Sign-in failed. Check your credentials and try again.

MFA:

    Additional verification required.

Offline:

    A network connection is required to sign in.

Authenticated session:

    Redirect to Dashboard.

## 23. Dashboard

The dashboard is the user's operational home.

Layout:

    +--------------------------------------------------------------+
    | Welcome / Current Project                                    |
    +-------------------+-------------------+----------------------+
    | Projects          | Available Credits | Platform Status      |
    +-------------------+-------------------+----------------------+
    | Current Build     | Active Jobs       | Upcoming Booking    |
    +--------------------------------------------------------------+
    | Recent Runs / Results                                         |
    +--------------------------------------------------------------+
    | Quick Actions                                                 |
    +--------------------------------------------------------------+

## 24. Dashboard Quick Actions

Primary actions:

- Create Project;
- Open Project;
- Build Current Project;
- Browse Platforms;
- Book Robot;
- View Active Job;
- View Results.

Quick actions should be context-aware.

## 25. Dashboard Widgets

Widgets may include:

- recent projects;
- latest build;
- latest artifact;
- upcoming booking;
- active job;
- credit balance;
- recent results;
- platform availability.

Users should be able to navigate from each widget to its detailed screen.

## 26. Projects Screen

The Projects screen displays:

- project name;
- project key;
- platform;
- status;
- last build;
- last run;
- updated time.

Layout:

    Projects
    [Search] [Filter]                         [New Project]

    +-----------------------------------------------------------+
    | Project | Platform | Build | Last Run | Updated | Status |
    +-----------------------------------------------------------+
    | ...                                                       |
    +-----------------------------------------------------------+

## 27. Project Creation

Create Project form:

- name;
- project key;
- description;
- optional default platform;
- local source directory;
- optional SDK/runtime configuration.

The source directory is local.

The UI must clearly state:

> Your source code remains on this computer. Kritva RaaS uploads packaged
> execution artifacts, not your source tree.

## 28. Project Overview

Layout:

    Project Name
    Status | Platform | Runtime | SDK

    [Build] [Artifacts] [Run] [Book]

    Overview
    Source
    Build
    Artifacts
    Runs
    Results

    Project Summary
    Latest Build
    Latest Artifact
    Latest Run

## 29. Source Screen

The Source screen provides local project context.

It may show:

- source directory;
- file count;
- local Git status;
- detected project type;
- SDK;
- compiler;
- local build configuration.

The default UI shall not upload source files.

## 30. Source Privacy Indicator

The project source view shall include a persistent local indicator:

    Source: LOCAL ONLY

Clicking the indicator displays:

- what remains local;
- what data can leave the machine;
- artifact upload boundary.

## 31. Build Screen

The Build screen is the primary local engineering screen.

Layout:

    Build
    Project: ExampleRobot

    Target Platform
    [Kritva Platform v1 ▼]

    Build Configuration
    [Debug ▼]

    [ Build ] [ Test ] [ Clean ]

    Build Progress
    ------------------------------------------------
    Compile       ████████████████
    Link          █████████████
    Package       ███████
    Validate      █████
    ------------------------------------------------

    Build Output
    [terminal/log area]

## 32. Build Configuration

Build configuration may include:

- Debug;
- Release;
- target architecture;
- SDK version;
- runtime version;
- compiler/toolchain;
- build profile;
- feature flags.

Only supported combinations may be selected.

## 33. Local Build Flow

    User presses Build
          |
          v
    Tauri IPC
          |
          v
    Rust Local Runtime
          |
          v
    Local Build Toolchain
          |
          v
    Tests
          |
          v
    Package
          |
          v
    Privacy Scan
          |
          v
    Artifact Candidate

## 34. Build States

States include:

- idle;
- preparing;
- compiling;
- linking;
- testing;
- packaging;
- scanning;
- succeeded;
- failed;
- cancelled.

The UI shall prevent duplicate builds unless explicitly requested.

## 35. Build Failure

Build failure shall display:

- failed stage;
- exit code;
- concise summary;
- log access;
- likely remediation where available.

Example:

    Build failed during linking.

    Error: unresolved symbol ...

    [View Full Log] [Retry]

## 36. Artifact Screen

Artifacts represent packaged execution units.

Layout:

    Artifacts
    [Filter] [Search]

    +------------------------------------------------------------+
    | Version | Platform | Arch | Status | Size | Created        |
    +------------------------------------------------------------+
    | ...                                                        |
    +------------------------------------------------------------+

## 37. Artifact Detail

Artifact detail displays:

- artifact ID;
- version;
- application name;
- platform;
- architecture;
- runtime;
- SDK;
- capabilities;
- checksum;
- signature status;
- scan status;
- creation time;
- compatibility status.

## 38. Artifact Security Presentation

The artifact screen shall clearly show:

    Signature: VALID
    Integrity: VALID
    Security Scan: PASSED
    Compatibility: VALID

A failure must block execution where the backend policy requires it.

## 39. Artifact Upload

Upload flow:

    Select Artifact
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

The UI must not imply that source files are uploaded.

## 40. Platform Screen

The Platforms screen lists available robotic platforms.

Layout:

    Platforms

    [Search] [Filter]

    +----------------------------------------------------------+
    | Platform | Type | Version | Architecture | Availability |
    +----------------------------------------------------------+
    | ...                                                      |
    +----------------------------------------------------------+

Platform types:

- physical;
- simulated;
- reference.

## 41. Platform Detail

Platform detail displays:

- platform name;
- description;
- version;
- architecture;
- runtime;
- SDK;
- capabilities;
- available configurations;
- resource type;
- availability;
- credit rate;
- documentation link.

## 42. Platform Compatibility

When an artifact is selected:

    Artifact
       |
       v
    Platform Compatibility
       |
       +--> Compatible
       +--> Compatible with Warning
       +--> Incompatible
       |
       v
    Booking / Execution

Compatibility failures shall explain the mismatch.

Example:

    Incompatible

    Artifact requires SDK >= 1.4.
    Selected platform provides SDK 1.3.

    [Choose Compatible Platform]

## 43. Booking Screen

Booking shall be a guided flow.

Steps:

    1. Platform
    2. Configuration
    3. Date / Time
    4. Duration
    5. Resource
    6. Credits
    7. Review
    8. Confirm

## 44. Booking Layout

    Book Robot

    Step 1  Step 2  Step 3  Step 4  Step 5

    Platform
    [Selected Platform]

    Configuration
    [Configuration ▼]

    Date
    [Date Picker]

    Time
    [Available Slots]

    Duration
    [30 min ▼]

    Estimated Cost
    450 credits

    [Back] [Continue]

## 45. Booking Availability

Availability shall reflect:

- resource state;
- maintenance;
- existing bookings;
- capacity;
- platform compatibility;
- operational policy.

The UI shall not infer availability solely from stale cached data.

## 46. Credit Rate Presentation

The booking screen shall show:

    Platform:
        Kritva Robot A

    Rate:
        15 credits / minute

    Duration:
        30 minutes

    Required:
        450 credits

    Available:
        1200 credits

    Remaining:
        750 credits

## 47. Booking Confirmation

Confirmation must display:

- platform;
- version;
- configuration;
- resource where known;
- date;
- time;
- duration;
- credits required;
- cancellation policy;
- artifact compatibility;
- relevant restrictions.

The final action should be:

    [Confirm Booking]

## 48. Booking States

UI states include:

- draft;
- checking availability;
- available;
- unavailable;
- reserving;
- confirmed;
- failed;
- cancelled;
- expired;
- completed.

## 49. Booking Failure

Example:

    Booking could not be confirmed.

    The selected resource became unavailable before confirmation.

    [Choose Another Time]
    [Choose Another Platform]

The UI must never display a false confirmed state.

## 50. Credits Screen

The Credits screen displays platform-specific balances.

Layout:

    Credits

    Platform
    Balance
    Rate
    Reserved
    Available

    +-----------------------------------------------------+
    | Platform A | 1200 | ...                             |
    | Platform B |  400 | ...                             |
    +-----------------------------------------------------+

Credits are not globally interchangeable unless explicitly supported by
commercial policy.

## 51. Credit Detail

Credit detail may display:

- platform;
- credit plan;
- current balance;
- reserved credits;
- consumed credits;
- ledger activity;
- expiry where applicable.

## 52. Credit Ledger View

Ledger entries should show:

- date;
- transaction type;
- amount;
- reference;
- balance after transaction.

The UI is a presentation layer.

The authoritative ledger remains server-side.

## 53. Jobs Screen

Jobs represent execution requests.

Layout:

    Jobs

    [Active] [Queued] [Completed] [Failed]

    +-------------------------------------------------------------+
    | Job | Project | Platform | Status | Started | Duration     |
    +-------------------------------------------------------------+
    | ...                                                         |
    +-------------------------------------------------------------+

## 54. Job Detail

Job detail displays:

- job ID;
- project;
- artifact;
- platform;
- resource;
- booking;
- status;
- timestamps;
- execution progress;
- run;
- logs;
- video;
- telemetry;
- results.

## 55. Job State Visualization

The job lifecycle is:

    CREATED
      |
      v
    QUEUED
      |
      v
    VALIDATING
      |
      v
    ALLOCATING
      |
      v
    DEPLOYING
      |
      v
    STARTING
      |
      v
    RUNNING
      |
      v
    STOPPING
      |
      v
    COMPLETED

Failure states include:

    FAILED
    CANCELLED
    TIMEOUT

The UI must represent the current state and previous transitions where useful.

## 56. Live Run Screen

The Live Run screen is the primary operational execution screen.

Layout:

    +--------------------------------------------------------------+
    | RUNNING | Robot A | Job 12345 | 00:12:31                    |
    +--------------------------------------+-----------------------+
    |                                      | Run Status            |
    |                                      | CPU / Memory          |
    |          LIVE VIDEO                  | Sensors               |
    |                                      | Motors                |
    |                                      | Network               |
    +--------------------------------------+-----------------------+
    | Logs                                                           |
    +--------------------------------------------------------------+
    | Telemetry                                                     |
    +--------------------------------------------------------------+
    | [Stop Run]                                                    |
    +--------------------------------------------------------------+

## 57. Live Video

Video component shall support:

- play/pause where applicable;
- reconnect;
- full-screen;
- timestamp;
- stream status;
- connection quality.

Video loss must not imply robot loss.

Example:

    Video disconnected.

    Execution status remains RUNNING.

    [Reconnect Video]

## 58. Telemetry

Telemetry panels may show:

- CPU;
- memory;
- temperature;
- network;
- robot state;
- sensor values;
- motor state;
- execution metrics.

High-frequency telemetry should be summarized rather than overwhelming the UI.

## 59. Logs

Logs shall provide:

- timestamp;
- severity;
- component;
- message;
- filtering;
- search;
- pause/follow mode;
- download where permitted.

Sensitive information must be redacted server-side or before presentation.

## 60. Run Stop Interaction

Stopping a run requires explicit confirmation unless an emergency or safety
mechanism is invoked outside the UI.

Example:

    Stop this run?

    The robot may stop according to its configured safe-stop behavior.

    [Cancel] [Stop Run]

The Studio UI is not an emergency-stop replacement.

## 61. Safety Indicator

Live Run shall clearly show:

    SAFETY AUTHORITY: LOCAL

The UI should explain:

> Emergency stop and physical safety controls are provided locally by the
> robot/lab safety system.

## 62. Run Disconnect

If Studio loses connection:

    Connection Lost

    The run may still be executing remotely.

    [Reconnect]

The UI must not automatically assume that the run stopped.

## 63. Results Screen

Results provide post-run evidence.

Layout:

    Results

    [Search] [Filter] [Project] [Platform]

    +--------------------------------------------------------------+
    | Run | Project | Platform | Status | Duration | Created       |
    +--------------------------------------------------------------+
    | ...                                                          |
    +--------------------------------------------------------------+

## 64. Result Detail

Result detail includes:

- Run;
- Job;
- project;
- platform;
- artifact;
- timestamps;
- result status;
- metrics;
- files;
- video;
- logs;
- telemetry;
- experiment association.

## 65. Result States

Results may be:

- created;
- processing;
- available;
- failed;
- cancelled;
- archived;
- purged.

Processing state must explain what is occurring.

## 66. Result Files

Files may include:

- logs;
- telemetry;
- video;
- metrics;
- reports;
- result bundles.

Each file should display:

- type;
- size;
- availability;
- checksum where appropriate;
- download action.

## 67. Rerun

Rerun should reuse prior configuration where valid.

Flow:

    Result
      |
      v
    Rerun
      |
      v
    Validate Artifact
      |
      v
    Validate Platform
      |
      v
    Check Booking / Availability
      |
      v
    Review Cost
      |
      v
    Confirm
      |
      v
    New Job

A rerun creates a new Job/Run.

Historical results must not be overwritten.

## 68. Settings Screen

Settings shall contain:

    Account
    Organization
    Studio
    Build
    Security
    Notifications
    Storage
    Network
    About

Only settings applicable to the current user role are shown.

## 69. Account Settings

Account settings include:

- name;
- email;
- authentication method;
- MFA/passkey status;
- session management;
- sign out.

Security-sensitive changes may require reauthentication.

## 70. Organization Settings

Where authorized:

- current organization;
- role;
- organization selection;
- project access.

Broader administration belongs in the web console.

## 71. Studio Settings

Studio settings may include:

- theme;
- language;
- notification behavior;
- local workspace;
- default build profile;
- log retention;
- update channel;
- proxy/network settings.

## 72. Build Settings

Build settings include:

- default compiler;
- SDK location;
- toolchain;
- parallel build count;
- build cache;
- artifact output location.

Invalid paths must be detected before build.

## 73. Security Settings

Security settings may show:

- signed-in sessions;
- trusted device;
- authentication method;
- local credential storage;
- security notifications.

Secrets shall not be displayed in plaintext.

## 74. Notifications

Notifications may include:

- build completed;
- build failed;
- booking confirmed;
- booking changed;
- job started;
- job completed;
- job failed;
- result available;
- credit warning;
- security event.

Notifications must not reveal sensitive source content.

## 75. Admin Entry

Administrative operations should primarily use the RaaS Web Console.

Studio may expose:

    [Open Admin Console]

Only authorized administrators should see this action.

Admin capabilities include:

- users;
- organizations;
- platforms;
- labs;
- hardware;
- bookings;
- jobs;
- credits;
- payments;
- refunds;
- monitoring;
- audit;
- settings.

## 76. Admin Access Control

The UI shall not rely solely on hiding navigation items.

The backend remains authoritative.

Unauthorized requests must return appropriate authorization errors.

## 77. Navigation Rules

Navigation shall preserve:

- project context;
- unsaved local state;
- active build state;
- active run state.

Navigating away from an active run must not stop the run.

## 78. Breadcrumbs

Project-context screens should use:

    Projects / Project Name / Build

or:

    Projects / Project Name / Runs / Run 123

Breadcrumbs must be keyboard accessible.

## 79. Search

Global search may search:

- projects;
- artifacts;
- platforms;
- jobs;
- results.

Search must not search or upload local source contents to the server merely to
provide global search.

## 80. Filters

Filters should support:

- status;
- platform;
- date;
- project;
- architecture;
- result state.

Filter state should persist during navigation where useful.

## 81. Tables

Tables must support:

- keyboard navigation;
- sorting;
- filtering;
- column labels;
- row selection;
- empty states;
- loading state;
- pagination or virtualization where needed.

Status must be represented through text as well as visual indicators.

## 82. Forms

Forms shall:

- use explicit labels;
- group related fields;
- validate inline;
- preserve valid input on failure;
- show required fields;
- avoid ambiguous placeholders;
- support keyboard submission.

## 83. Buttons

Primary action hierarchy:

- primary;
- secondary;
- tertiary;
- destructive.

A screen should normally have one visually dominant primary action.

## 84. Destructive Actions

Destructive actions include:

- delete;
- cancel booking;
- stop run;
- revoke artifact where exposed;
- remove local configuration.

Destructive actions require explicit consequences.

## 85. Toasts

Toasts are appropriate for:

- successful save;
- background completion;
- non-blocking notification.

Critical errors should remain visible in the relevant screen.

## 86. Modal Dialogs

Modals should be used for:

- confirmation;
- focused short forms;
- important warnings.

Do not use modals for long workflows.

## 87. Keyboard Requirements

Minimum keyboard support:

| Action | Shortcut |
|---|---|
| Navigate next focus | Tab |
| Navigate previous focus | Shift+Tab |
| Activate control | Enter / Space |
| Close dialog | Escape |
| Submit focused form | Enter |
| Search | Ctrl/Cmd+K where implemented |
| Refresh | Ctrl/Cmd+R where safe |

Platform-native conventions should be respected.

## 88. Keyboard Navigation

Keyboard focus must:

- be visible;
- follow logical order;
- never become trapped except inside intentional modal focus traps;
- return to a sensible location after modal close.

## 89. Accessibility Target

The UI should target WCAG 2.2 AA-level accessibility practices for applicable
desktop UI components.

Requirements include:

- keyboard access;
- sufficient contrast;
- visible focus;
- semantic labels;
- accessible names;
- status announcements;
- non-color-only state indication;
- scalable text;
- reduced motion support.

## 90. Screen Reader Requirements

Important dynamic states shall be announced.

Examples:

    "Build completed successfully."

    "Booking confirmed."

    "Job status changed to running."

    "Connection lost. Attempting to reconnect."

Use appropriate ARIA semantics where applicable.

## 91. Color and Status

Do not communicate state using color alone.

Example:

    RUNNING
    ●

rather than relying solely on green.

Statuses should include text:

- Ready;
- Running;
- Failed;
- Warning;
- Offline.

## 92. Focus Management

After actions:

- form submission should return focus appropriately;
- dialogs should focus their heading or first actionable element;
- errors should move or announce focus when appropriate;
- navigation should focus the page heading where practical.

## 93. Reduced Motion

Animations shall respect reduced-motion preferences.

Execution dashboards should prioritize stable information over decorative
animation.

## 94. Responsive Desktop Behavior

Studio is desktop-first.

Minimum usable width should support:

- sidebar;
- primary content;
- essential action controls.

At narrower widths:

    Full Sidebar
        |
        v
    Collapsed Sidebar
        |
        v
    Stacked Panels

Critical actions must remain reachable.

## 95. Window Management

Studio should support:

- resizable window;
- maximize;
- minimize;
- persistent reasonable dimensions;
- restoration of previous layout where safe.

## 96. Offline Behavior

When disconnected:

- local source and build functionality may remain available;
- cloud-dependent actions are disabled or clearly marked;
- stale remote data is identified;
- reconnect is automatic where appropriate.

Example:

    Offline

    Local builds remain available.
    Booking and remote execution require a connection.

## 97. Reconnection

Connection state:

    CONNECTED
       |
       v
    DISCONNECTED
       |
       v
    RECONNECTING
       |
       +----> CONNECTED
       |
       +----> OFFLINE

Reconnection must not duplicate business operations.

## 98. Idempotent UI Actions

For operations such as:

- booking;
- upload;
- job creation;
- cancellation;
- rerun;

the UI should use request identifiers or backend-supported idempotency mechanisms.

Repeated clicks must not create duplicate operations.

## 99. Long-Running Operations

Long operations include:

- build;
- upload;
- artifact scanning;
- booking;
- deployment;
- execution;
- result generation.

The UI shall show:

- current state;
- progress where known;
- elapsed time where useful;
- cancellation where safe;
- completion/error.

## 100. Upload Progress

Upload shall display:

    Preparing
       |
       v
    Uploading 63%
       |
       v
    Server Validation
       |
       v
    Accepted

The UI must not claim success until server acknowledgement is received.

## 101. Notifications and Background Operations

Background operations may continue when navigating away.

Examples:

- build;
- upload;
- job;
- result processing.

The global status area should expose active operations.

## 102. State Persistence

Persist locally where appropriate:

- selected project;
- UI layout;
- non-sensitive preferences;
- recent navigation;
- build preferences.

Do not persist sensitive tokens or secrets in plaintext.

Use the OS credential store for sensitive credentials.

## 103. Error Taxonomy

UI errors should map to common classes:

- validation;
- authentication;
- authorization;
- network;
- conflict;
- unavailable;
- compatibility;
- security;
- safety;
- server;
- local build;
- filesystem.

## 104. Error Interface

Conceptually:

    {
        "code": "ARTIFACT_INCOMPATIBLE",
        "message": "Artifact is incompatible with selected platform.",
        "details": {
            "required_sdk": "1.4",
            "available_sdk": "1.3"
        },
        "retryable": false,
        "reference_id": "err-123"
    }

The UI should map machine codes to consistent user-facing messages.

## 105. Conflict Handling

For conflicts:

    Conflict detected

    The booking changed while you were confirming it.

    [Refresh Availability]

Do not silently overwrite remote state.

## 106. Authorization Errors

For forbidden actions:

    You do not have permission to perform this action.

Where useful:

    Required role: Project Admin

Do not expose unnecessary internal authorization details.

## 107. Security Error Handling

Security failures should be clear without revealing attack-sensitive details.

Example:

    Artifact rejected by security policy.

    Review the artifact validation report.

## 108. Safety Error Handling

Safety failures require strong visual and textual treatment.

Example:

    Robot execution unavailable.

    The local safety system has not reported a safe operating state.

    Execution cannot continue.

No automatic bypass is offered.

## 109. Build Artifact Boundary UI

The UI should visually separate:

    LOCAL
    Source
    Build
    Test
    Package

from:

    REMOTE
    Upload
    Booking
    Deployment
    Execution
    Results

This distinction is a core product concept.

## 110. Project Context

The current project should remain visible in the application header.

Example:

    Kritva RaaS | MyRobotProject | Connected

Switching project should require deliberate selection.

## 111. Platform Context

Platform context should display:

- platform;
- version;
- architecture;
- runtime;
- SDK.

Avoid ambiguous labels such as:

    "Robot A"

Prefer:

    "Kritva Reference Robot / v1.2 / ARM64"

## 112. Booking Context

Booking screens should clearly distinguish:

- requested slot;
- confirmed slot;
- active slot;
- expired slot.

The UI must not treat a requested slot as confirmed.

## 113. Credit Context

Every credit-consuming operation should show:

- platform;
- rate;
- estimated amount;
- current balance;
- remaining balance.

Unexpected charges should never be hidden.

## 114. Job Context

Every execution view should expose:

- Job ID;
- Run ID where created;
- artifact;
- platform;
- booking.

This supports supportability and auditability.

## 115. Result Context

Every result should trace back to:

    Result
      |
      v
    Run
      |
      v
    Job
      |
      v
    Artifact
      |
      v
    Project
      |
      v
    Platform / Resource

## 116. UI Security Boundaries

Studio shall:

- avoid source upload;
- protect session credentials;
- avoid plaintext secrets;
- validate server responses;
- enforce backend authorization;
- sanitize displayed logs;
- prevent unsafe command injection through UI inputs.

## 117. Local Filesystem Security

The Rust layer shall mediate privileged filesystem operations.

The UI should not directly receive unrestricted filesystem access.

Filesystem permissions should be limited to configured project/workspace areas.

## 118. Artifact Security UI

Artifact actions shall reflect:

- signature state;
- scan state;
- compatibility;
- upload state;
- revocation state.

Revoked or invalid artifacts must not be presented as executable.

## 119. Telemetry Privacy

Telemetry and logs may contain sensitive operational data.

The UI shall:

- respect authorization;
- avoid exposing another organization's telemetry;
- redact sensitive content;
- use secure transport.

## 120. Performance Requirements

The UI should remain responsive during:

- builds;
- uploads;
- telemetry streams;
- log streams;
- video;
- result processing.

CPU-intensive local operations belong in Rust/native workers or child processes,
not on the React UI thread.

## 121. Table Performance

Large tables should use:

- pagination;
- virtualization;
- server-side filtering;
- incremental loading.

Do not render thousands of telemetry rows directly.

## 122. Live Dashboard Performance

Live execution should separate:

    High-frequency telemetry
          |
          v
    Aggregation / Sampling
          |
          v
    UI

The UI should not attempt to render every raw telemetry sample.

## 123. Video Performance

Video decoding should use appropriate native/platform capabilities where
possible.

UI overlays should not unnecessarily duplicate video frames.

## 124. Build Log Performance

Build logs should support:

- streaming;
- bounded rendering;
- search;
- filtering;
- download.

The UI should avoid keeping unlimited logs in memory.

## 125. UI Telemetry

Product telemetry should not capture:

- source code;
- source filenames if sensitive;
- compiler input;
- secrets;
- raw customer code.

Operational analytics should use metadata where practical.

## 126. Analytics

Allowed product analytics may include:

- screen usage;
- action completion;
- build duration;
- booking conversion;
- job completion;
- error categories.

Analytics must respect privacy policy and organizational controls.

## 127. Testing Strategy

UI testing shall include:

- component tests;
- accessibility tests;
- interaction tests;
- contract tests;
- integration tests;
- E2E;
- platform-specific desktop testing.

## 128. Primary E2E Scenario

The mandatory primary E2E flow is:

    Login
      ->
    Create Project
      ->
    Select Platform
      ->
    Local Build
      ->
    Generate .krv
      ->
    Book
      ->
    Upload
      ->
    Start Job
      ->
    Live Video
      ->
    Telemetry / Logs
      ->
    Complete
      ->
    Results
      ->
    Rerun

## 129. Accessibility Testing

Accessibility testing shall verify:

- keyboard-only operation;
- focus order;
- accessible labels;
- dialog behavior;
- status announcements;
- contrast;
- reduced motion;
- screen-reader semantics.

## 130. Error-State Testing

Every major screen must test:

- loading;
- empty;
- network error;
- authorization error;
- validation error;
- conflict;
- server error;
- retry;
- recovery.

## 131. Security Testing

Studio security tests shall include:

- session handling;
- credential storage;
- IPC authorization;
- filesystem boundaries;
- source privacy;
- artifact upload allowlisting;
- log sanitization;
- malicious input handling.

## 132. Local Build Testing

Build UI tests shall verify:

- successful build;
- compilation failure;
- test failure;
- packaging failure;
- scanner failure;
- cancellation;
- toolchain missing;
- invalid workspace.

## 133. Booking Testing

Booking UI tests shall verify:

- available slot;
- unavailable slot;
- stale availability;
- concurrent booking conflict;
- insufficient credits;
- cancellation;
- expired booking;
- server retry.

## 134. Execution Testing

Execution UI tests shall verify:

- queued;
- validating;
- deploying;
- running;
- stopping;
- completed;
- failed;
- timeout;
- disconnect;
- reconnect;
- duplicate start prevention.

## 135. Result Testing

Result tests shall verify:

- processing;
- available;
- failed;
- archived;
- file download;
- missing file;
- rerun;
- historical immutability.

## 136. Phase 0 UI Mapping

Phase 0 establishes:

- Tauri shell;
- React application;
- routing;
- global layout;
- theme;
- accessibility foundation;
- IPC boundary;
- API client foundation;
- error model.

Required screens:

- login;
- shell;
- dashboard placeholder;
- settings foundation.

## 137. Phase 1 UI Mapping

Phase 1 implements:

- authentication;
- organizations;
- projects;
- platform catalog;
- project navigation;
- tenant-aware views.

Primary screens:

- Login;
- Dashboard;
- Projects;
- Project Overview;
- Platforms;
- Settings.

## 138. Phase 2 UI Mapping

Phase 2 implements:

- local source;
- build;
- tests;
- artifacts;
- artifact validation;
- artifact upload.

Primary screens:

- Source;
- Build;
- Artifacts;
- Artifact Detail.

## 139. Phase 3 UI Mapping

Phase 3 implements:

- jobs;
- live execution;
- video;
- telemetry;
- logs;
- result processing.

Primary screens:

- Jobs;
- Job Detail;
- Live Run;
- Results.

## 140. Phase 4 UI Mapping

Phase 4 implements:

- platform availability;
- booking;
- credits;
- reservations;
- cancellation;
- pricing.

Primary screens:

- Platform Detail;
- Booking;
- Credits.

## 141. Phase 5 UI Mapping

Phase 5 implements:

- physical resource status;
- safety indicators;
- HIL status;
- robot-specific execution context.

The UI shall clearly distinguish local safety authority from cloud status.

## 142. Phase 6 UI Mapping

Phase 6 implements:

- security indicators;
- session controls;
- artifact security state;
- audit-aware support information;
- production error handling.

## 143. Phase 7 UI Mapping

Phase 7 implements:

- high-volume jobs;
- multi-resource status;
- capacity information;
- performance improvements;
- scalable result browsing.

## 144. Phase 8 UI Mapping

Phase 8 implements:

- production-ready onboarding;
- stable release UX;
- operational notifications;
- commercial flows;
- support diagnostics;
- production rollout compatibility.

## 145. UI Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Source accidentally uploaded | Critical | Local-only source architecture and scanner |
| UI shows stale booking availability | High | Server validation before confirmation |
| Duplicate booking | High | Idempotency |
| Duplicate job | High | Idempotent job creation |
| User cannot understand platform compatibility | High | Explicit compatibility panel |
| Credit cost unclear | High | Pre-confirmation cost breakdown |
| Live run status becomes stale | High | WebSocket + durable refresh |
| Video loss interpreted as robot stop | High | Separate video and execution status |
| Safety state misunderstood | Critical | Local safety indicator |
| Accessibility gaps | Medium | WCAG-oriented testing |
| UI blocks during builds | Medium | Native/background execution |
| Large telemetry stream overloads UI | Medium | Sampling/aggregation |
| Documentation/UI terminology drift | Medium | Central terminology |
| Cross-tenant data displayed | Critical | Backend authz + tenant-aware UI |
| Cloud outage prevents safe robot stop | Critical | Local safety authority |

## 146. Terminology Standards

Use:

| Preferred | Avoid |
|---|---|
| Project | Workspace account |
| Artifact | Binary upload |
| Platform | Robot type |
| Resource | Slot robot |
| Robot | Machine where physical identity matters |
| Booking | Reservation request when confirmed |
| Job | Execution request |
| Run | Actual execution |
| Result | Output record |
| Credits | Tokens |
| Local Build | Cloud Build |
| Live Run | Remote session |

## 147. UI Content Rules

Messages shall be:

- concise;
- actionable;
- technically accurate;
- non-alarming unless necessary;
- consistent with backend terminology.

Avoid exposing internal service names.

## 148. Date and Time

All timestamps received from the backend should preserve timezone information.

The UI should:

- display local timezone by default;
- show timezone when ambiguity exists;
- preserve exact timestamp in detail views;
- avoid silently changing booked times.

## 149. Numeric and Unit Formatting

Use consistent units for:

- duration;
- credits;
- CPU;
- memory;
- temperature;
- network;
- file size.

Robot telemetry units should follow platform metadata.

## 150. Localization

Initial release may use English.

UI architecture should permit localization later.

Do not concatenate user-visible strings in a way that prevents translation.

## 151. Theme

Studio should support:

- light mode;
- dark mode;
- system preference.

Status meaning must remain clear in both themes.

## 152. Focused User Experience

The Studio should prioritize:

    Create
    Build
    Validate
    Book
    Run
    Observe
    Analyze
    Rerun

Administrative complexity should remain out of the primary development path.

## 153. UI Navigation State

The UI should maintain navigation state independently from remote business
state.

For example:

    Studio navigated away
         |
         v
    Job continues remotely

Navigation does not mutate execution state.

## 154. Session Expiration

If the session expires during a long operation:

- preserve local state;
- explain authentication requirement;
- reconnect/re-authenticate;
- avoid duplicate submission;
- recover operation status from server.

## 155. Server Restart

If the Control Plane restarts:

- reconnect automatically;
- refresh durable state;
- preserve local source/build state;
- do not duplicate operations.

## 156. Lab Disconnect

If the Lab Agent disconnects:

    Studio
      |
      v
    Control Plane
      |
      X
    Lab Agent

The UI should show:

    Lab connection unavailable.

It must not claim that the robot stopped unless authoritative state confirms it.

## 157. Booking Expiration

Expired bookings shall display:

    EXPIRED

and provide:

    [Book Again]

No execution should be started from an expired booking.

## 158. Insufficient Credits

The booking UI should show:

    Insufficient credits.

    Required: 450
    Available: 200
    Shortfall: 250

Possible action:

    [View Credit Options]

## 159. Incompatible Artifact

Execution should be blocked when required compatibility checks fail.

The user should see:

    Artifact incompatible with selected platform.

    Required architecture: ARM64
    Platform architecture: x86_64

    [Choose Compatible Platform]

## 160. Revoked Artifact

A revoked artifact must display:

    REVOKED

and:

    This artifact cannot be executed.

No retry button should imply that execution is possible without a new artifact.

## 161. Build Toolchain Missing

Example:

    Required SDK not found.

    Expected:
    /path/to/sdk

    [Configure Toolchain]

## 162. Local Permission Failure

Example:

    Cannot access project directory.

    Verify that Studio has permission to access this folder.

    [Choose Project Folder]

## 163. Network Failure

Example:

    Cannot reach Kritva RaaS.

    Your local project and build remain available.

    [Retry Connection]

## 164. Server Failure

Example:

    Kritva RaaS is temporarily unavailable.

    Your local work is safe.

    [Retry]

## 165. Accessibility Acceptance

A user must be able to complete the primary workflow using keyboard-only
interaction except for operations inherently requiring pointer or native
hardware interaction.

## 166. Accessibility Focus Rules

All interactive elements must:

- have accessible names;
- expose role;
- expose state;
- expose keyboard behavior;
- maintain visible focus.

## 167. Accessibility Dynamic State

Dynamic state changes shall be exposed to assistive technologies where
appropriate.

Examples:

- build progress;
- booking confirmation;
- job state;
- connection status;
- result availability.

## 168. UI Acceptance Criteria — Architecture

- [ ] Tauri is the desktop shell.
- [ ] React/TypeScript is the UI layer.
- [ ] Rust mediates privileged local operations.
- [ ] Local source remains outside the cloud workflow.
- [ ] Control Plane is accessed through defined APIs.
- [ ] WebSocket is used for live updates where appropriate.
- [ ] Backend remains authoritative for remote business state.

## 169. UI Acceptance Criteria — Navigation

- [ ] Global navigation exists.
- [ ] Project context is visible.
- [ ] Breadcrumbs work.
- [ ] Active navigation is identifiable.
- [ ] Navigation does not stop active jobs.
- [ ] Unauthorized navigation is handled correctly.
- [ ] Browser-like back/forward behavior is predictable where supported.

## 170. UI Acceptance Criteria — Authentication

- [ ] Login screen exists.
- [ ] Password login is supported where configured.
- [ ] SSO is supported where configured.
- [ ] MFA/passkey flow is supported where configured.
- [ ] Authentication errors are actionable.
- [ ] Session expiration is handled.
- [ ] Credential secrets are protected.

## 171. UI Acceptance Criteria — Dashboard

- [ ] Dashboard exists.
- [ ] Projects are visible.
- [ ] Credits are visible.
- [ ] Active jobs are visible.
- [ ] Upcoming bookings are visible.
- [ ] Recent results are visible.
- [ ] Quick actions are available.
- [ ] Empty state is implemented.

## 172. UI Acceptance Criteria — Projects

- [ ] Project list exists.
- [ ] Project creation exists.
- [ ] Project detail exists.
- [ ] Local source location is represented.
- [ ] Source privacy indicator exists.
- [ ] Project platform is visible.
- [ ] Project state is visible.
- [ ] Project deletion is protected.

## 173. UI Acceptance Criteria — Build

- [ ] Build screen exists.
- [ ] Build configuration is selectable.
- [ ] Local build executes through the local runtime.
- [ ] Build progress is visible.
- [ ] Build logs are accessible.
- [ ] Build errors are actionable.
- [ ] Build cancellation is supported where safe.
- [ ] Build success creates an artifact candidate.

## 174. UI Acceptance Criteria — Artifacts

- [ ] Artifact list exists.
- [ ] Artifact detail exists.
- [ ] Signature status is visible.
- [ ] Integrity status is visible.
- [ ] Security scan status is visible.
- [ ] Compatibility status is visible.
- [ ] Upload progress is visible.
- [ ] Server validation is visible.
- [ ] Revoked artifacts cannot be executed.

## 175. UI Acceptance Criteria — Platforms

- [ ] Platform list exists.
- [ ] Platform detail exists.
- [ ] Version is visible.
- [ ] Architecture is visible.
- [ ] Runtime is visible.
- [ ] SDK is visible.
- [ ] Capabilities are visible.
- [ ] Availability is visible.
- [ ] Compatibility is explicit.

## 176. UI Acceptance Criteria — Booking

- [ ] Booking wizard exists.
- [ ] Platform selection exists.
- [ ] Configuration selection exists.
- [ ] Date selection exists.
- [ ] Time availability exists.
- [ ] Duration selection exists.
- [ ] Credit estimate exists.
- [ ] Confirmation exists.
- [ ] Cancellation state exists.
- [ ] Stale availability is handled.
- [ ] Duplicate booking is prevented.

## 177. UI Acceptance Criteria — Credits

- [ ] Platform-specific balances exist.
- [ ] Credit rate is visible.
- [ ] Reserved credits are visible.
- [ ] Available balance is visible.
- [ ] Ledger activity is visible where permitted.
- [ ] Insufficient balance is actionable.
- [ ] Credit-consuming operations show expected cost.

## 178. UI Acceptance Criteria — Jobs

- [ ] Job list exists.
- [ ] Job detail exists.
- [ ] Job lifecycle is visible.
- [ ] Artifact is identified.
- [ ] Booking is identified.
- [ ] Run is identified.
- [ ] Errors are visible.
- [ ] Retry/recovery follows backend policy.

## 179. UI Acceptance Criteria — Live Run

- [ ] Live Run screen exists.
- [ ] Job ID is visible.
- [ ] Run ID is visible.
- [ ] Platform is visible.
- [ ] Video is available where configured.
- [ ] Telemetry is available.
- [ ] Logs are available.
- [ ] Execution status is durable.
- [ ] Video status is independent of execution status.
- [ ] Disconnect/reconnect is handled.
- [ ] Stop confirmation is explicit.
- [ ] Local safety authority is visible.

## 180. UI Acceptance Criteria — Results

- [ ] Results list exists.
- [ ] Result detail exists.
- [ ] Metrics are displayed.
- [ ] Files are displayed.
- [ ] Video/log/telemetry results are represented.
- [ ] Processing state is visible.
- [ ] Downloads are protected.
- [ ] Rerun is supported.
- [ ] Historical results are preserved.

## 181. UI Acceptance Criteria — Settings

- [ ] Account settings exist.
- [ ] Organization context exists.
- [ ] Studio settings exist.
- [ ] Build settings exist.
- [ ] Security settings exist.
- [ ] Notification settings exist.
- [ ] Credential secrets are not displayed.

## 182. UI Acceptance Criteria — Admin

- [ ] Admin access is role controlled.
- [ ] Unauthorized users cannot perform admin operations.
- [ ] Admin navigation does not expose sensitive information unnecessarily.
- [ ] Web Console remains the primary administration surface.
- [ ] Studio can deep-link to authorized administration where appropriate.

## 183. UI Acceptance Criteria — State Handling

- [ ] Loading state exists on every remote screen.
- [ ] Empty state exists on every list screen.
- [ ] Error state exists on every remote workflow.
- [ ] Permission denied state exists.
- [ ] Offline state exists.
- [ ] Reconnecting state exists.
- [ ] Stale data is distinguishable.

## 184. UI Acceptance Criteria — Keyboard

- [ ] All primary actions are keyboard accessible.
- [ ] Tab order is logical.
- [ ] Shift+Tab works.
- [ ] Enter activates controls.
- [ ] Space activates appropriate controls.
- [ ] Escape closes dialogs.
- [ ] Focus remains visible.
- [ ] Modal focus traps are correct.
- [ ] Focus returns appropriately after dialogs.

## 185. UI Acceptance Criteria — Accessibility

- [ ] Accessible names exist.
- [ ] Semantic roles are correct.
- [ ] Status is not communicated by color alone.
- [ ] Contrast is sufficient.
- [ ] Focus indicators are visible.
- [ ] Dynamic state changes are announced.
- [ ] Reduced motion is supported.
- [ ] Screen-reader workflows are tested.
- [ ] Primary workflow is keyboard completable.

## 186. UI Acceptance Criteria — Security

- [ ] Source is not uploaded as part of normal workflow.
- [ ] Local filesystem access is mediated by Rust.
- [ ] Secrets use secure storage.
- [ ] Backend authorization is authoritative.
- [ ] Logs are sanitized.
- [ ] Tenant boundaries are respected.
- [ ] Artifact security status is enforced.
- [ ] Session handling is secure.

## 187. UI Acceptance Criteria — Safety

- [ ] Local safety authority is explicitly represented.
- [ ] UI does not claim emergency-stop capability.
- [ ] Unsafe execution is blocked by backend/runtime policy.
- [ ] Disconnect behavior is clear.
- [ ] Stop behavior is explicit.
- [ ] Safety errors cannot be bypassed through normal UI actions.

## 188. UI Acceptance Criteria — Performance

- [ ] Build does not freeze UI.
- [ ] Upload progress is responsive.
- [ ] Large logs are bounded.
- [ ] Large tables use efficient rendering.
- [ ] Telemetry is sampled/aggregated.
- [ ] Video does not unnecessarily block UI.
- [ ] Navigation remains responsive during background operations.

## 189. UI Acceptance Criteria — Testing

- [ ] Component tests exist.
- [ ] Interaction tests exist.
- [ ] Accessibility tests exist.
- [ ] Contract tests exist.
- [ ] Integration tests exist.
- [ ] E2E primary workflow exists.
- [ ] Offline tests exist.
- [ ] Error-state tests exist.
- [ ] Platform-specific desktop tests exist.

## 190. UI Acceptance Criteria — Primary MVP

The following end-to-end scenario must be supported:

- [ ] Login.
- [ ] Create Project.
- [ ] Select Robot Platform.
- [ ] Build Locally.
- [ ] Generate .krv.
- [ ] Validate Artifact.
- [ ] Book Robot.
- [ ] Upload Artifact.
- [ ] Start Job.
- [ ] Observe Live Video.
- [ ] Observe Telemetry.
- [ ] Observe Logs.
- [ ] Complete Run.
- [ ] View Results.
- [ ] Run Again.

## 191. UI Acceptance Criteria — Final Invariants

The following invariants are mandatory:

1. Customer source remains local during normal RaaS development.
2. The cloud receives packaged execution artifacts rather than source.
3. The UI never treats an unconfirmed booking as confirmed.
4. The UI never treats a requested job as running without authoritative state.
5. Video loss does not imply robot execution stopped.
6. Studio disconnect does not imply remote execution stopped.
7. Remote execution does not replace local physical safety.
8. Emergency stop remains outside the normal cloud UI control path.
9. Credit cost is visible before a credit-consuming confirmation.
10. Platform compatibility is explicit before execution.
11. Invalid or revoked artifacts cannot be presented as executable.
12. Duplicate business actions are prevented through idempotent backend operations.
13. Backend authorization remains authoritative.
14. Tenant boundaries are enforced server-side.
15. Accessibility does not depend on color alone.
16. Primary workflows are keyboard accessible.
17. Dynamic states are accessible to assistive technology.
18. Loading, empty and error states are designed for every major screen.
19. Historical Runs and Results are not overwritten by reruns.
20. UI navigation does not mutate remote execution state.
21. Local source/build operations remain usable during cloud outages where
    technically possible.
22. Safety-critical errors cannot be bypassed through normal UI controls.
23. UI terminology remains aligned with backend domain terminology.
24. UI changes affecting architecture, contracts, security or safety are
    tracked through the project change-management process.
25. The Studio UI remains a client of the authoritative Control Plane rather
    than becoming an independent source of business truth.

## 192. Final UI Architecture

The complete UI architecture is:

    +----------------------------------------------------------------+
    |                         Kritva RaaS Studio                     |
    +----------------------------------------------------------------+
    | Global Shell                                                   |
    |  Header | Project Context | Connection | Notifications | User |
    +--------------------+-------------------------------------------+
    | Navigation          | Application Screens                     |
    |                     |                                           |
    | Home                | Login                                    |
    | Projects            | Dashboard                                |
    | Platforms           | Projects                                 |
    | Bookings            | Project / Source / Build / Artifacts     |
    | Jobs                | Platforms / Booking / Credits            |
    | Results             | Jobs / Live Run / Results                |
    | Credits             | Settings / Admin Link                   |
    | Settings            |                                           |
    +--------------------+-------------------------------------------+
    | Global Status / Background Operations                         |
    +----------------------------------------------------------------+
                  |
                  +-----------------------+
                  |                       |
                  v                       v
          Tauri IPC / Rust          HTTPS / WebSocket
                  |                       |
                  v                       v
          Local Workspace          RaaS Control Plane
          Local Build              PostgreSQL / Storage
          Local Test               Queue / Workers
          Artifact Package         Lab Agent
                  |                       |
                  +-----------+-----------+
                              |
                              v
                         Remote Robot

## 193. Final UI Product Flow

The canonical product experience is:

    Discover
       |
       v
    Create Project
       |
       v
    Develop Locally
       |
       v
    Build / Test
       |
       v
    Package .krv
       |
       v
    Validate
       |
       v
    Select Platform
       |
       v
    Review Compatibility
       |
       v
    Book
       |
       v
    Review Credits
       |
       v
    Upload Artifact
       |
       v
    Execute
       |
       v
    Observe
       |
       v
    Analyze Results
       |
       v
    Rerun

## 194. Final Principle

> Kritva RaaS Studio shall provide a focused, production-grade developer
> experience centered on the principle "Build locally. Book remotely. Run on
> real robots." The UI shall make the boundary between local source/build
> operations and remote artifact execution explicit and understandable. Every
> major workflow shall provide predictable loading, empty, error, offline,
> authorization and recovery states. Platform compatibility, booking
> availability, credit consumption, Job/Run state, artifact security and
> physical safety status shall be represented clearly without allowing the UI
> to become an independent source of truth. The Studio shall use Tauri,
> React/TypeScript and Rust to securely bridge local development capabilities
> with the RaaS Control Plane. Keyboard access, visible focus, semantic
> labeling, screen-reader support, non-color status communication and reduced
> motion shall be treated as production requirements. Safety authority shall
> remain local to the robot and lab, while the Studio provides observation and
> controlled operational interaction. The resulting experience shall allow a
> developer to move from project creation through local build, artifact
> validation, platform selection, booking, remote execution, live observation,
> result analysis and rerun without ambiguity about what is local, what is
> remote, what is authoritative, what consumes credits, or what requires
> explicit safety and security controls.
