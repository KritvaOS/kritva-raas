# Kritva RaaS Studio Design System

## 1. Purpose

This document defines the production design system for Kritva RaaS Studio.

The design system provides the visual language, interaction primitives,
accessibility rules, layout system, semantic tokens, reusable components,
interaction patterns, motion behavior, theming model, and React implementation
guidance required to build a consistent desktop application.

The system supports the product principle:

> Build locally. Book remotely. Run on real robots.

The design system must make the distinction between local development and remote
robot execution understandable without requiring users to understand the
underlying architecture.

## 2. Scope

This specification covers:

- design principles;
- design tokens;
- light and dark themes;
- semantic colors;
- typography;
- spacing;
- grid;
- layout;
- elevation;
- borders;
- iconography;
- buttons;
- inputs;
- forms;
- selects;
- tables;
- cards;
- badges;
- alerts;
- dialogs;
- drawers;
- tabs;
- breadcrumbs;
- progress indicators;
- skeletons;
- empty states;
- toasts;
- charts;
- video player;
- log viewer;
- telemetry panels;
- navigation;
- status indicators;
- motion;
- responsive desktop behavior;
- accessibility;
- React implementation;
- component testing;
- theme architecture;
- design review.

## 3. Goals

The design system shall:

1. provide consistent visual language across Studio;
2. support light and dark themes;
3. make operational state immediately understandable;
4. distinguish local and remote operations;
5. provide reusable accessible components;
6. minimize visual noise in technical workflows;
7. support dense engineering information without becoming difficult to scan;
8. support keyboard-first workflows;
9. provide predictable interaction patterns;
10. support live telemetry, logs and video;
11. scale from development workflows to production operations;
12. remain implementation-independent from a specific UI library where practical.

## 4. Non-Goals

This document does not define:

- marketing website branding;
- robot hardware industrial design;
- physical robot display design;
- web-console-specific layouts;
- backend API implementation;
- cloud infrastructure;
- robot safety implementation;
- commercial pricing policy.

The design system may be shared with the Web Console where appropriate, but
Studio remains the primary design target.

## 5. Design Principles

### 5.1 Clarity Over Decoration

Every visual element must communicate information or support an action.

Decorative complexity should not compete with:

- build status;
- compatibility;
- booking state;
- credit cost;
- execution state;
- safety state.

### 5.2 Technical Density With Structure

Studio is an engineering application.

Dense information is acceptable when organized through:

- hierarchy;
- grouping;
- whitespace;
- alignment;
- progressive disclosure.

### 5.3 State Must Be Obvious

Users must be able to distinguish:

    READY
    RUNNING
    WARNING
    FAILED
    OFFLINE
    PROCESSING

without depending solely on color.

### 5.4 Local and Remote Must Be Visually Distinct

Local operations:

    Source
    Build
    Test
    Package
    Validate

Remote operations:

    Upload
    Booking
    Deployment
    Execution
    Results

must have consistent contextual treatment.

### 5.5 Safety Must Never Look Decorative

Safety indicators must have strong hierarchy and explicit text.

The UI must never imply that Studio replaces local robot safety controls.

### 5.6 Accessibility Is Foundational

Accessibility is implemented at the primitive/component level rather than added
after screen implementation.

## 6. Product Visual Character

Kritva RaaS Studio should communicate:

- engineering precision;
- reliability;
- modern robotics;
- technical confidence;
- operational clarity;
- controlled complexity.

The visual language should avoid:

- excessive gradients;
- decorative illustrations in operational views;
- excessive animation;
- overly rounded consumer-app styling;
- ambiguous status colors.

## 7. Design Token Architecture

Tokens are organized into:

    Primitive Tokens
          |
          v
    Semantic Tokens
          |
          v
    Component Tokens
          |
          v
    Feature UI

Primitive tokens define raw values.

Semantic tokens define meaning.

Component tokens define component-specific usage.

## 8. Token Naming

Use names based on purpose rather than visual color names.

Preferred:

    --color-bg-primary
    --color-text-primary
    --color-status-success

Avoid:

    --blue-500
    --green-button
    --dark-gray

This allows themes to change without rewriting component logic.

## 9. Color Architecture

The color system contains:

- neutral palette;
- brand palette;
- semantic status palette;
- interaction palette;
- data visualization palette.

The semantic layer is authoritative for application UI.

## 10. Light Theme Background Tokens

| Token | Value | Usage |
|---|---|---|
| bg-primary | #FFFFFF | Main application background |
| bg-secondary | #F7F8FA | Secondary surfaces |
| bg-tertiary | #F0F2F5 | Tertiary panels |
| bg-elevated | #FFFFFF | Cards/dialogs |
| bg-inset | #EEF1F4 | Log/input inset surfaces |
| bg-disabled | #E5E7EB | Disabled controls |

## 11. Light Theme Text Tokens

| Token | Value | Usage |
|---|---|---|
| text-primary | #111827 | Primary content |
| text-secondary | #4B5563 | Secondary content |
| text-tertiary | #6B7280 | Supporting content |
| text-muted | #9CA3AF | Metadata |
| text-disabled | #9CA3AF | Disabled content |
| text-inverse | #FFFFFF | Dark surfaces |

## 12. Light Theme Border Tokens

| Token | Value | Usage |
|---|---|---|
| border-subtle | #E5E7EB | Low emphasis |
| border-default | #D1D5DB | Standard controls |
| border-strong | #9CA3AF | Strong separation |
| border-focus | #2563EB | Keyboard focus |

## 13. Light Theme Brand Tokens

| Token | Value | Usage |
|---|---|---|
| brand-primary | #2563EB | Primary actions |
| brand-hover | #1D4ED8 | Hover |
| brand-active | #1E40AF | Active |
| brand-subtle | #DBEAFE | Soft brand surface |
| brand-text | #1D4ED8 | Brand text |

The exact final Kritva brand palette may be refined during visual branding
review without changing semantic token names.

## 14. Light Theme Status Tokens

| Semantic | Base | Background | Text |
|---|---|---|---|
| Success | #16A34A | #DCFCE7 | #166534 |
| Warning | #D97706 | #FEF3C7 | #92400E |
| Error | #DC2626 | #FEE2E2 | #991B1B |
| Info | #2563EB | #DBEAFE | #1E40AF |
| Neutral | #6B7280 | #F3F4F6 | #374151 |

## 15. Dark Theme Background Tokens

| Token | Value | Usage |
|---|---|---|
| bg-primary | #0F1115 | Main background |
| bg-secondary | #151922 | Secondary surfaces |
| bg-tertiary | #1C2230 | Tertiary panels |
| bg-elevated | #1A1F29 | Cards/dialogs |
| bg-inset | #0B0D11 | Logs/code/telemetry |
| bg-disabled | #2A303B | Disabled controls |

## 16. Dark Theme Text Tokens

| Token | Value | Usage |
|---|---|---|
| text-primary | #F3F4F6 | Primary content |
| text-secondary | #D1D5DB | Secondary content |
| text-tertiary | #9CA3AF | Supporting content |
| text-muted | #6B7280 | Metadata |
| text-disabled | #6B7280 | Disabled content |
| text-inverse | #111827 | Light surfaces |

## 17. Dark Theme Border Tokens

| Token | Value | Usage |
|---|---|---|
| border-subtle | #252B36 | Low emphasis |
| border-default | #343B48 | Standard controls |
| border-strong | #4B5563 | Strong separation |
| border-focus | #60A5FA | Keyboard focus |

## 18. Dark Theme Brand Tokens

| Token | Value | Usage |
|---|---|---|
| brand-primary | #60A5FA | Primary actions |
| brand-hover | #93C5FD | Hover |
| brand-active | #3B82F6 | Active |
| brand-subtle | #172554 | Soft brand surface |
| brand-text | #93C5FD | Brand text |

## 19. Dark Theme Status Tokens

| Semantic | Base | Background | Text |
|---|---|---|---|
| Success | #4ADE80 | #14532D | #BBF7D0 |
| Warning | #FBBF24 | #78350F | #FEF3C7 |
| Error | #F87171 | #7F1D1D | #FECACA |
| Info | #60A5FA | #1E3A8A | #DBEAFE |
| Neutral | #9CA3AF | #1F2937 | #E5E7EB |

## 20. Status Semantics

Status colors must communicate semantic meaning:

    Success  -> completed / healthy / available
    Warning  -> degraded / attention required
    Error    -> failed / unsafe / blocked
    Info     -> informational / active guidance
    Neutral  -> inactive / unknown / historical

Status must always include text, iconography or another non-color indicator.

## 21. Safety Status

Safety status receives a dedicated semantic treatment.

Examples:

    SAFE
    SAFETY CHECK REQUIRED
    SAFETY UNAVAILABLE
    EXECUTION BLOCKED

Safety must not be represented merely as generic Success/Warning/Error.

## 22. Local/Remote Tokens

Use semantic contextual tokens:

| Context | Token |
|---|---|
| Local operation | context-local |
| Remote operation | context-remote |
| Security boundary | context-security |
| Safety boundary | context-safety |

These tokens may influence subtle surfaces, labels or icons but must not create
a separate competing color language.

## 23. Typography

Typography shall prioritize:

- readability;
- technical density;
- numerical clarity;
- hierarchy;
- platform consistency.

Recommended primary UI font:

    Inter

Recommended monospace font:

    JetBrains Mono

Fallbacks shall use system sans-serif and monospace fonts.

## 24. Typography Scale

| Token | Size | Line Height | Usage |
|---|---:|---:|---|
| display | 32px | 40px | Major page heading |
| h1 | 28px | 36px | Page title |
| h2 | 22px | 30px | Section title |
| h3 | 18px | 26px | Subsection |
| body-lg | 16px | 24px | Important body |
| body | 14px | 20px | Default UI |
| body-sm | 13px | 18px | Secondary |
| caption | 12px | 16px | Metadata |
| overline | 11px | 16px | Labels |
| code | 13px | 20px | Logs/code |

## 25. Typography Weight

| Weight | Value | Usage |
|---|---:|---|
| Regular | 400 | Body |
| Medium | 500 | Labels |
| Semibold | 600 | Headings/actions |
| Bold | 700 | Critical emphasis |

Use bold sparingly.

## 26. Numeric Typography

Technical values should use tabular numerals where supported.

Examples:

- credit balances;
- durations;
- CPU percentages;
- temperatures;
- telemetry values;
- timestamps.

This improves vertical scanning and comparison.

## 27. Monospace Usage

Monospace is reserved for:

- build logs;
- code;
- artifact IDs;
- hashes;
- Job IDs;
- Run IDs;
- protocol values;
- technical identifiers.

Do not use monospace for ordinary UI labels.

## 28. Spacing System

Use a 4px base unit.

Primary scale:

| Token | Value |
|---|---:|
| space-1 | 4px |
| space-2 | 8px |
| space-3 | 12px |
| space-4 | 16px |
| space-5 | 20px |
| space-6 | 24px |
| space-8 | 32px |
| space-10 | 40px |
| space-12 | 48px |
| space-16 | 64px |

## 29. Spacing Rules

Use:

- 8px for closely related controls;
- 16px for standard control grouping;
- 24px for component separation;
- 32px for major sections;
- 48px or more for page-level separation.

Avoid arbitrary spacing values unless required by platform conventions.

## 30. Grid System

Studio uses a flexible desktop grid.

Base structure:

    +-----------------------------------------------------------+
    | Header                                                    |
    +----------+-----------------------------------------------+
    | Sidebar  | Main Content                                  |
    |          |                                               |
    |          | 12-column logical grid                        |
    |          |                                               |
    +----------+-----------------------------------------------+

The main content area uses a 12-column logical grid.

## 31. Content Width

Recommended page content:

- minimum readable width;
- flexible expansion;
- maximum content width for dense forms;
- full width for tables and telemetry.

Large empty horizontal space should be avoided on operational screens.

## 32. Page Layout

Standard page:

    Page Header
        |
        +-- Title
        +-- Description
        +-- Actions
        |
        v
    Filters / Tabs
        |
        v
    Main Content
        |
        v
    Supporting Content

## 33. Cards

Cards group related information.

Use cards for:

- dashboard widgets;
- platform summaries;
- credit balances;
- result summaries;
- configuration blocks.

Avoid excessive card nesting.

## 34. Borders and Radius

Recommended radius:

| Token | Value |
|---|---:|
| radius-sm | 4px |
| radius-md | 6px |
| radius-lg | 8px |
| radius-xl | 12px |
| radius-pill | 999px |

Controls should generally use radius-md.

Large containers may use radius-lg.

## 35. Elevation

Elevation should be subtle.

Use elevation primarily for:

- dialogs;
- popovers;
- menus;
- elevated cards where needed.

Avoid strong shadows in dark mode.

## 36. Iconography

Icons must be:

- simple;
- geometric;
- consistent in stroke;
- understandable at small sizes;
- accessible.

Recommended default icon family:

    Lucide-style outline icons

The final library may change, but stroke and sizing conventions must remain
consistent.

## 37. Icon Sizes

| Size | Usage |
|---|---|
| 12px | Inline metadata |
| 16px | Standard controls |
| 20px | Navigation |
| 24px | Primary feature |
| 32px | Empty states |
| 48px | Major status illustration |

Icons should not replace required text labels for critical actions.

## 38. Icon Accessibility

Decorative icons:

    aria-hidden="true"

Meaningful icons require accessible labels.

Icon-only controls must have:

- accessible name;
- tooltip where appropriate;
- keyboard support.

## 39. Status Icons

Use consistent icon semantics:

| Status | Example Icon |
|---|---|
| Success | Check |
| Warning | Triangle |
| Error | X/Circle |
| Info | Info |
| Running | Activity/Loader |
| Offline | Cloud-off |
| Locked | Lock |
| Safety | Shield |

The exact icon library may vary while semantics remain consistent.

## 40. Button System

Button variants:

- primary;
- secondary;
- tertiary;
- destructive;
- link;
- icon-only.

## 41. Primary Button

Used for the main action:

    [ Build ]
    [ Confirm Booking ]
    [ Start Run ]

Only one primary action should normally dominate a region.

## 42. Secondary Button

Used for supporting actions:

    [ Preview ]
    [ Refresh ]
    [ Configure ]

## 43. Destructive Button

Used for:

- stop;
- delete;
- cancel;
- revoke.

Destructive actions require explicit consequence messaging where appropriate.

## 44. Button States

Every button supports:

- default;
- hover;
- focus;
- active;
- disabled;
- loading;
- success where useful.

Loading buttons must prevent accidental duplicate submission.

## 45. Button Sizing

| Size | Height |
|---|---:|
| Small | 32px |
| Medium | 36px |
| Large | 40px |

Default application action size is Medium.

## 46. Form Controls

Form controls include:

- text input;
- password;
- number;
- search;
- textarea;
- select;
- combobox;
- date picker;
- time picker;
- checkbox;
- radio;
- switch.

All controls require visible labels.

## 47. Form Validation

Validation states:

    Default
    Focus
    Valid
    Warning
    Error
    Disabled

Error messages appear near the affected field.

## 48. Input Requirements

Inputs shall:

- support keyboard operation;
- preserve values after errors;
- expose accessible names;
- use appropriate input types;
- provide clear validation;
- avoid placeholder-only labels.

## 49. Select and Combobox

Use Select for finite known lists.

Use Combobox for:

- large platform lists;
- projects;
- resources;
- searchable options.

Remote searches should not upload local source information.

## 50. Forms Layout

Default form width should prioritize readability.

    Label
    [ Input                                  ]

    Supporting text

    Label
    [ Input                                  ]

    Error message

Actions align consistently:

    [Cancel] [Save]

## 51. Tables

Tables are used for:

- projects;
- artifacts;
- platforms;
- bookings;
- jobs;
- results;
- ledger entries.

## 52. Table Rules

Tables shall support:

- sortable columns where meaningful;
- filters;
- search;
- pagination;
- keyboard navigation;
- row actions;
- responsive density.

## 53. Table Density

Default density:

    44px row height

Compact operational tables:

    36px row height

Touch-oriented density may be increased where required.

## 54. Table States

Every table supports:

- loading skeleton;
- empty;
- no search results;
- permission denied;
- network error;
- stale data;
- pagination state.

## 55. Status Badges

Badges should use:

    [ RUNNING ]
    [ READY ]
    [ FAILED ]
    [ CANCELLED ]

rather than relying on colored dots alone.

## 56. Progress Indicators

Use:

- determinate progress for known progress;
- indeterminate progress for unknown duration;
- step progress for workflows.

Build example:

    Compile     ████████████ 80%
    Link        ███████      50%
    Package     pending

## 57. Skeletons

Skeletons are preferred when:

- page structure is known;
- data loading is expected;
- loading should not block interaction with other areas.

Skeletons must preserve approximate final layout.

## 58. Empty States

Empty states contain:

- icon or visual cue;
- heading;
- explanation;
- primary next action.

Example:

    No artifacts yet

    Build your project locally to generate your first .krv artifact.

    [Open Build]

## 59. Alerts

Alerts are persistent contextual messages.

Variants:

- info;
- success;
- warning;
- error;
- safety.

Use alerts for information users need to see until resolved.

## 60. Toasts

Toasts are for transient confirmations.

Examples:

    Project created.

    Artifact uploaded.

    Settings saved.

Do not use toasts for critical safety or financial errors.

## 61. Toast Requirements

Toasts shall:

- not block essential controls;
- have accessible announcements;
- disappear after an appropriate duration;
- remain dismissible;
- provide action where useful.

## 62. Dialogs

Dialogs are used for:

- confirmations;
- focused actions;
- short forms;
- important warnings.

Dialogs shall have:

- title;
- description;
- clear actions;
- focus management;
- Escape handling.

## 63. Destructive Dialog

Example:

    Stop this run?

    The active execution will receive a stop request.

    [Cancel] [Stop Run]

The destructive action must be explicit.

## 64. Drawers

Drawers may be used for:

- detailed metadata;
- filters;
- secondary context;
- logs.

They should not contain long multi-step workflows.

## 65. Tabs

Tabs are used for closely related content:

    Overview | Source | Build | Artifacts | Runs | Results

Tabs must:

- have clear active state;
- support keyboard navigation;
- preserve context;
- not become a replacement for global navigation.

## 66. Breadcrumbs

Breadcrumbs provide hierarchy:

    Projects / MyRobot / Build

They should be used on nested project views.

## 67. Navigation

Global navigation:

    Home
    Projects
    Platforms
    Bookings
    Jobs
    Results
    Credits
    Settings

The active item must be obvious.

## 68. Header

The global header contains:

- Kritva branding;
- project context;
- connection status;
- notifications;
- user menu.

Header height should remain stable across screens.

## 69. Local/Remote Context Component

A reusable context indicator should support:

    LOCAL
    Source / Build / Test

and:

    REMOTE
    Booking / Execution / Results

The indicator must be subtle but persistent.

## 70. Connection Indicator

Connection states:

    CONNECTED
    RECONNECTING
    OFFLINE

The indicator must expose textual state to assistive technology.

## 71. Notification Center

Notifications may include:

- build complete;
- booking confirmation;
- job started;
- job complete;
- result available;
- security warning.

Notifications should deep-link to the relevant resource.

## 72. Video Player

The video player is a specialized operational component.

It supports:

- live state;
- playback state where permitted;
- reconnect;
- full-screen;
- timestamp;
- stream quality;
- connection state.

## 73. Video Layout

    +---------------------------------------------+
    | LIVE                                        |
    |                                             |
    |              VIDEO STREAM                   |
    |                                             |
    +---------------------------------------------+
    | 00:12:42 | Connected | Full Screen         |
    +---------------------------------------------+

## 74. Video States

States:

- connecting;
- live;
- buffering;
- disconnected;
- unavailable;
- ended.

Video state must not alter Job state.

## 75. Log Viewer

The Log Viewer is optimized for engineering workflows.

Features:

- monospace rendering;
- timestamp;
- severity;
- component;
- search;
- filter;
- follow mode;
- pause;
- download.

## 76. Log Viewer Layout

    +-----------------------------------------------------------+
    | Search | Level | Component | Follow | Pause              |
    +-----------------------------------------------------------+
    | 12:30:01 INFO  runtime    Started                        |
    | 12:30:02 INFO  motion     Initializing                    |
    | 12:30:03 WARN  sensor     Delay detected                  |
    +-----------------------------------------------------------+

## 77. Log Viewer Performance

Logs must be virtualized or incrementally rendered for large streams.

The browser/React DOM must not contain unlimited log rows.

## 78. Telemetry Panel

Telemetry displays:

- current values;
- units;
- status;
- timestamp;
- trend where useful.

Examples:

    CPU       42%
    Memory    1.8 GB
    Temp      52 C
    Network   24 Mbps

## 79. Telemetry Cards

Each metric card contains:

- label;
- value;
- unit;
- status;
- timestamp;
- optional trend.

## 80. Charts

Charts should be used when trends provide more value than individual values.

Supported conceptual types:

- line;
- area;
- bar;
- gauge;
- sparkline.

## 81. Chart Rules

Charts must:

- have accessible summaries;
- label axes;
- include units;
- provide tooltips;
- remain legible in light/dark themes;
- avoid color-only distinctions.

## 82. Data Visualization Palette

Charts use semantic series tokens rather than arbitrary colors.

Series should remain distinguishable through:

- color;
- line pattern;
- marker;
- label.

Critical status colors must not be overloaded for ordinary data series.

## 83. Telemetry Time Series

Telemetry rendering pipeline:

    Raw Telemetry
          |
          v
    Sampling / Aggregation
          |
          v
    Chart Model
          |
          v
    React Visualization

The UI should not render every raw high-frequency sample.

## 84. Dashboard Cards

Dashboard cards should have:

- title;
- value/summary;
- status;
- supporting metadata;
- action or link.

Cards should remain scannable without opening detail views.

## 85. Platform Card

Platform cards display:

- platform name;
- version;
- type;
- architecture;
- availability;
- capabilities;
- primary action.

## 86. Credit Card

Credit cards display:

    Platform A

    Available
    900

    Rate
    15 / minute

    [View Details]

The platform identity must always remain visible.

## 87. Artifact Status Component

Artifact status should expose:

    Signature       VALID
    Integrity       VALID
    Security Scan   PASSED
    Compatibility   VALID

A blocked state must explain why.

## 88. Booking Summary Component

Booking summary displays:

- platform;
- configuration;
- resource;
- date;
- time;
- duration;
- credit cost;
- cancellation policy.

## 89. Job Timeline

The Job Timeline visualizes:

    Created
      |
    Queued
      |
    Validating
      |
    Allocating
      |
    Deploying
      |
    Running
      |
    Completed

Current state is highlighted.

Historical states remain visible.

## 90. Safety Indicator Component

The safety component displays:

    SAFETY AUTHORITY
    LOCAL

Optional state:

    SAFE
    SAFETY CHECK REQUIRED
    BLOCKED

It must not provide a misleading "Emergency Stop" button.

## 91. Rerun Component

The Rerun action should summarize:

- source artifact;
- platform;
- configuration;
- expected booking;
- expected credits.

The user must explicitly confirm a new execution.

## 92. Motion Principles

Motion shall:

- communicate state;
- preserve spatial relationships;
- guide attention;
- avoid decoration;
- respect reduced-motion preferences.

## 93. Motion Durations

Recommended:

| Motion | Duration |
|---|---:|
| Micro interaction | 100-150ms |
| Standard transition | 150-250ms |
| Panel transition | 200-300ms |
| Major transition | 250-350ms |

Avoid long animations in operational screens.

## 94. Motion Patterns

Use motion for:

- expanding panels;
- navigation transitions;
- loading indicators;
- status changes;
- toast entry/exit.

Do not animate:

- rapidly changing telemetry values;
- every log line;
- large table rows;
- safety warnings excessively.

## 95. Reduced Motion

When reduced motion is requested:

- remove nonessential transitions;
- retain essential state feedback;
- avoid continuous decorative animation.

## 96. Theme Architecture

Theme selection:

    System
       |
       +--> Light
       |
       +--> Dark

The application may store user preference locally.

Theme tokens are exposed through CSS variables.

## 97. Theme Implementation

Conceptually:

    :root
        --color-bg-primary: ...
        --color-text-primary: ...

    [data-theme="dark"]
        --color-bg-primary: ...
        --color-text-primary: ...

React components consume semantic tokens rather than hardcoded values.

## 98. React Component Architecture

Recommended hierarchy:

    App
      |
      +-- AppShell
            |
            +-- Header
            +-- Sidebar
            +-- Page
                  |
                  +-- Feature
                        |
                        +-- Shared Components

## 99. Component API Principles

Components should:

- use typed props;
- expose semantic variants;
- avoid leaking implementation details;
- support accessibility attributes;
- support controlled/uncontrolled patterns where appropriate;
- avoid domain-specific logic in generic components.

## 100. Example Component Contract

Conceptually:

    <Button
        variant="primary"
        size="medium"
        loading={isSubmitting}
        disabled={isDisabled}
        onClick={handleSubmit}
    >
        Confirm Booking
    </Button>

The component owns presentation and interaction semantics.

The feature owns business behavior.

## 101. Component Composition

Prefer composition:

    <Card>
        <CardHeader />
        <CardBody />
        <CardFooter />
    </Card>

rather than large components with dozens of configuration flags.

## 102. Feature Components

Feature-specific components include:

- BuildProgress;
- ArtifactSecurityStatus;
- PlatformCompatibility;
- BookingSummary;
- CreditEstimate;
- JobTimeline;
- LiveVideo;
- TelemetryPanel;
- LogViewer;
- ResultSummary.

These use shared primitives.

## 103. Component State Ownership

State belongs at the lowest level that can safely own it.

Examples:

- input value: input/form;
- dialog open state: feature/page;
- authentication state: auth layer;
- job state: server query/store;
- local build state: local runtime adapter.

## 104. Server State

Server state should be managed separately from local UI state.

Examples of server state:

- projects;
- platforms;
- bookings;
- credits;
- jobs;
- runs;
- results.

The UI must not duplicate authoritative business state unnecessarily.

## 105. Local State

Local UI state includes:

- dialog visibility;
- selected tab;
- filter;
- expanded panel;
- temporary form input;
- layout preferences.

## 106. React Data Flow

Recommended:

    API / Local Runtime
          |
          v
    Feature Data Hook
          |
          v
    Feature Component
          |
          v
    Presentational Components

This prevents visual components from becoming API clients.

## 107. API Client Mapping

The API client package should expose typed operations such as:

    projects.list()
    projects.get()
    platforms.list()
    artifacts.list()
    bookings.create()
    credits.getBalance()
    jobs.get()
    results.get()

The exact method names may evolve with implementation.

## 108. WebSocket Mapping

Live features consume typed events:

    useJobEvents()
    useTelemetryStream()
    useLogStream()
    useNotificationStream()

The hooks own subscription lifecycle.

Components own presentation.

## 109. Loading Architecture

Feature-level loading should be expressed through reusable:

- Skeleton;
- Spinner;
- Progress;
- Pending state.

Avoid a global full-screen spinner for normal API operations.

## 110. Error Boundary Architecture

Use layered error boundaries:

    Application Boundary
          |
          v
    Route Boundary
          |
          v
    Feature Boundary
          |
          v
    Component Error State

Operational screens should degrade locally where possible.

## 111. Accessibility Architecture

Accessibility responsibilities:

| Layer | Responsibility |
|---|---|
| Token | Contrast |
| Primitive | Keyboard semantics |
| Component | ARIA/state |
| Feature | Meaningful labels |
| Page | Heading hierarchy |
| Application | Navigation/focus |
| Test | Verification |

## 112. Keyboard Interaction

Required:

- Tab;
- Shift+Tab;
- Enter;
- Space;
- Escape;
- arrow-key navigation for composite controls where appropriate.

Focus must remain visible.

## 113. Focus Management

Dialogs trap focus.

After close:

    Dialog
      |
      v
    Trigger receives focus

After navigation:

    Page heading
      |
      v
    Focus

where appropriate and non-disruptive.

## 114. Screen Reader Announcements

Use live regions for:

- build completion;
- booking confirmation;
- job status changes;
- connection state;
- critical errors.

Do not announce every telemetry update.

## 115. Contrast

The design system shall target WCAG 2.2 AA contrast requirements.

Normal text, large text, controls and focus indicators must be evaluated against
the actual rendered theme.

## 116. Focus Indicator

Focus must remain clearly visible in both themes.

Recommended:

    2px visible outline
    plus sufficient offset

Focus must not rely on subtle color changes.

## 117. Disabled Controls

Disabled controls must remain distinguishable while maintaining readable
labels.

Disabled state should not be the only explanation for unavailable actions.

Where useful, provide supporting text explaining why an action is unavailable.

## 118. Accessibility of Tables

Tables must provide:

- header associations;
- row/column context;
- accessible sort state;
- keyboard-accessible actions;
- meaningful empty state.

## 119. Accessibility of Charts

Charts require a text alternative.

Example:

    CPU usage increased from 35% to 52% during the last five minutes.

Charts must not be the only representation of critical information.

## 120. Accessibility of Video

Video controls require:

- keyboard access;
- accessible names;
- visible focus;
- captions where applicable;
- stream status;
- alternative status information.

## 121. Accessibility of Logs

Log viewers should support:

- keyboard scrolling;
- searchable content;
- accessible filtering;
- meaningful severity labels.

Color-coded log severity alone is insufficient.

## 122. Accessibility of Telemetry

Telemetry must expose:

- metric label;
- value;
- unit;
- status;
- timestamp.

Color-only health indicators are prohibited.

## 123. Desktop Behavior

Studio is desktop-first.

Primary target:

- Linux x86_64;
- Windows x86_64.

Future:

- macOS Apple Silicon.

The design system must account for native title bars, window scaling and OS font
rendering differences.

## 124. Scaling

UI should remain usable under common desktop display scaling settings.

Layouts must not depend on a single physical pixel density.

## 125. Dense Operational Mode

Live Run, Logs and Telemetry may use higher information density.

Density changes must remain within the same design token system.

Do not create a completely separate visual language for operational screens.

## 126. Forms and Technical Values

Technical forms should show units explicitly:

    Duration
    [30] minutes

    Temperature threshold
    [70] °C

    Credit rate
    15 credits / minute

Units must not exist only in placeholders.

## 127. Date and Time

Use localized presentation while preserving timezone context.

Booking views should show:

    10 Oct 2026
    14:00-14:30
    Asia/Kolkata

when timezone ambiguity exists.

## 128. Number Formatting

Use consistent numeric formatting for:

- credits;
- file sizes;
- duration;
- telemetry;
- percentages.

Avoid unnecessary decimal precision.

## 129. Security UI Patterns

Security-related states use:

- lock/shield iconography;
- clear status;
- concise explanation;
- actionable remediation.

Do not expose secrets.

## 130. Source Privacy Pattern

The source privacy indicator is a persistent reusable pattern:

    SOURCE
    LOCAL ONLY

It should be visible in Source, Build and Artifact workflows.

## 131. Artifact Trust Pattern

Use a compact trust summary:

    Signature     VALID
    Integrity     VALID
    Scan          PASSED
    Compatibility VALID

Clicking opens detail.

## 132. Execution Trust Pattern

Execution status should show:

    JOB
    RUNNING

    SAFETY
    LOCAL

    CONNECTION
    CONNECTED

This separates business state, safety authority and UI connectivity.

## 133. Credit Transparency Pattern

Before consumption:

    Required       450
    Available      1200
    Remaining       750

The same pattern is reused across booking and rerun.

## 134. Error Recovery Pattern

Standard recovery structure:

    What happened
    Why it happened
    What can be done

Example:

    Booking failed

    The resource was allocated to another booking before confirmation.

    [Refresh Availability]

## 135. Empty State Pattern

Standard structure:

    [Icon]

    No artifacts yet

    Build your project locally to create an artifact.

    [Open Build]

## 136. Loading Pattern

Standard structure:

    Page Skeleton
        |
        v
    Data Loaded
        |
        +--> Content
        |
        +--> Empty
        |
        +--> Error

## 137. Confirmation Pattern

Standard confirmation structure:

    Action title

    Consequence

    Secondary action
    Primary/destructive action

## 138. Notification Pattern

Notifications should be:

- short;
- contextual;
- actionable;
- non-sensitive.

Example:

    Artifact uploaded successfully.
    [View Artifact]

## 139. Component Documentation

Every shared component should document:

- purpose;
- variants;
- props;
- states;
- accessibility;
- examples;
- usage constraints.

## 140. Component Testing

Shared components require tests for:

- rendering;
- keyboard behavior;
- state;
- accessibility;
- theme;
- responsive behavior where applicable.

## 141. Visual Regression

Important components should have visual regression coverage:

- Button;
- Input;
- Table;
- Dialog;
- Badge;
- Alert;
- Card;
- Video;
- Logs;
- Telemetry;
- Navigation.

## 142. Theme Testing

Every component with visual state must be tested in:

- light;
- dark;
- focused;
- disabled;
- error;
- warning;
- success where applicable.

## 143. Phase 0 Mapping

Phase 0 establishes:

- design tokens;
- typography;
- colors;
- spacing;
- grid;
- iconography;
- global layout;
- primitives;
- accessibility foundation;
- theming;
- motion system.

The design system should be usable before major feature implementation begins.

## 144. Phase 1 Mapping

Phase 1 applies the design system to:

- Login;
- Dashboard;
- Projects;
- Project Overview;
- Source;
- Platforms.

Focus:

- navigation;
- forms;
- tables;
- cards;
- authentication states.

## 145. Phase 2 Mapping

Phase 2 applies the system to:

- Build;
- Build Log;
- Artifact;
- Artifact Detail;
- Compatibility.

Focus:

- progress;
- technical status;
- logs;
- security indicators;
- local/remote boundary.

## 146. Phase 3 Mapping

Phase 3 applies the system to:

- Jobs;
- Job Detail;
- Live Run;
- Results foundation.

Focus:

- timelines;
- live state;
- video;
- telemetry;
- logs;
- reconnect behavior.

## 147. Phase 4 Mapping

Phase 4 applies the system to:

- Booking;
- Availability;
- Credits;
- Credit Ledger.

Focus:

- forms;
- calendars;
- resource states;
- cost summaries;
- financial transparency.

## 148. Phase 5 Mapping

Phase 5 applies the system to physical lab workflows.

Focus:

- robot state;
- safety state;
- telemetry;
- video;
- operational density.

## 149. Phase 6 Mapping

Phase 6 hardens:

- security status;
- authentication;
- authorization;
- source privacy;
- artifact trust;
- audit-aware UX;
- accessibility qualification.

## 150. Phase 7 Mapping

Phase 7 improves:

- dense tables;
- telemetry rendering;
- performance;
- large result sets;
- operational dashboards.

## 151. Phase 8 Mapping

Phase 8 completes:

- production visual qualification;
- release UX;
- cross-platform qualification;
- support diagnostics;
- stable theming;
- accessibility audit.

## 152. Design System Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Hardcoded colors proliferate | High | Semantic token enforcement |
| Inconsistent components | High | Shared component package |
| Accessibility deferred | High | Primitive-level requirements |
| Dark mode breaks | Medium | Theme matrix testing |
| Excessive visual density | Medium | Density review |
| Status depends on color | High | Text/icon semantics |
| Motion distracts operators | Medium | Reduced motion and restrained animation |
| Telemetry overloads rendering | High | Aggregation/virtualization |
| Component API becomes complex | Medium | Composition-first design |
| Brand changes break UI | Medium | Semantic token abstraction |
| Inconsistent terminology | Medium | Shared domain vocabulary |
| Security state visually weak | High | Dedicated security patterns |
| Safety state misunderstood | Critical | Explicit safety component |

## 153. Design Governance

The design system is governed through:

- design review;
- frontend architecture review;
- accessibility review;
- security review where applicable;
- release review.

Changes to core tokens or primitives require impact assessment.

## 154. Token Change Policy

Changes to semantic tokens must evaluate:

- all themes;
- all components;
- accessibility;
- screenshots;
- operational screens;
- status semantics.

Breaking token changes require migration.

## 155. Component Change Policy

A component API change requires:

- usage search;
- migration plan;
- tests;
- visual review;
- accessibility review;
- changelog entry where externally relevant.

## 156. Design Debt

Design debt shall be tracked explicitly.

Examples:

- duplicated component;
- inconsistent spacing;
- temporary color;
- missing dark-mode state;
- missing accessibility semantics.

Design debt must not silently become permanent.

## 157. Implementation Directory Mapping

Recommended UI package structure:

    packages/ui/
        src/
            tokens/
            theme/
            primitives/
            forms/
            navigation/
            feedback/
            data-display/
            charts/
            media/
            telemetry/
            logs/
            layout/
            accessibility/

Feature components remain in:

    apps/studio/src/features/

## 158. Token Implementation

Tokens should be represented as CSS custom properties and, where useful,
typed TypeScript constants.

Example:

    --color-bg-primary
    --color-text-primary
    --color-border-default
    --color-status-success
    --space-4
    --radius-md
    --font-size-body

## 159. React Theme Provider

Conceptually:

    <ThemeProvider theme="system">
        <App />
    </ThemeProvider>

The provider resolves:

    system -> light/dark
    light  -> light
    dark   -> dark

## 160. Component Variant Strategy

Variants should be explicit.

Example:

    Button
      variant:
        primary
        secondary
        destructive
        tertiary
        link

Avoid Boolean combinations that create uncontrolled visual permutations.

## 161. Design Token Validation

CI should detect:

- hardcoded forbidden colors;
- invalid spacing values where practical;
- inaccessible contrast combinations;
- missing theme values;
- unused tokens where tooling supports detection.

## 162. Storybook or Equivalent

A component documentation environment is recommended for:

- component exploration;
- accessibility testing;
- visual regression;
- theme comparison;
- state demonstration.

The exact tool is implementation-dependent.

## 163. Component State Matrix

Shared interactive components should demonstrate:

    Default
    Hover
    Focus
    Active
    Disabled
    Loading
    Success
    Warning
    Error

Not every component requires every state, but applicable states must be defined.

## 164. Cross-Platform Review

Before production release, validate:

- Linux x86_64;
- Windows x86_64.

For P1:

- macOS Apple Silicon.

Check:

- font rendering;
- window scaling;
- keyboard behavior;
- dialogs;
- file pickers;
- video;
- notifications.

## 165. Performance Requirements

The design system should not introduce significant runtime overhead.

Particular attention is required for:

- tables;
- logs;
- telemetry;
- charts;
- video overlays.

Heavy components should support lazy loading where practical.

## 166. Bundle Strategy

Large optional libraries should not be loaded into the initial shell unless
required.

Candidates for lazy loading:

- charts;
- video;
- specialized telemetry;
- advanced diagnostics.

## 167. Visual QA

Visual QA shall check:

- alignment;
- typography;
- spacing;
- theme;
- status;
- responsive desktop behavior;
- focus;
- hover;
- disabled;
- error;
- loading;
- empty states.

## 168. Design Review Gate

A component or pattern is accepted only when:

- visual design is reviewed;
- interaction is defined;
- accessibility is defined;
- states are defined;
- theme states are defined;
- implementation mapping exists;
- tests exist where applicable.

## 169. Full Acceptance Checklist — Tokens

- [ ] Primitive tokens are defined.
- [ ] Semantic tokens are defined.
- [ ] Component tokens are defined where needed.
- [ ] Light theme is implemented.
- [ ] Dark theme is implemented.
- [ ] Status tokens are semantic.
- [ ] Safety tokens are defined.
- [ ] Local/remote context is defined.
- [ ] Token naming is purpose-based.
- [ ] Hardcoded application colors are controlled.

## 170. Full Acceptance Checklist — Typography

- [ ] Primary font is defined.
- [ ] Monospace font is defined.
- [ ] Type scale is implemented.
- [ ] Heading hierarchy is consistent.
- [ ] Body hierarchy is consistent.
- [ ] Numeric rendering is appropriate.
- [ ] Technical identifiers use monospace where appropriate.
- [ ] Typography works in both themes.

## 171. Full Acceptance Checklist — Layout

- [ ] 4px spacing system exists.
- [ ] 12-column logical grid exists.
- [ ] Page layout pattern exists.
- [ ] Header is consistent.
- [ ] Sidebar is consistent.
- [ ] Cards are consistent.
- [ ] Dense layouts are defined.
- [ ] Desktop scaling is tested.
- [ ] Narrow desktop layouts remain usable.

## 172. Full Acceptance Checklist — Iconography

- [ ] Icon family is selected.
- [ ] Icon stroke style is consistent.
- [ ] Icon sizes are defined.
- [ ] Icon-only controls have labels.
- [ ] Decorative icons are hidden from assistive technology.
- [ ] Status icons have semantic meaning.
- [ ] Safety icons are distinct.

## 173. Full Acceptance Checklist — Buttons

- [ ] Primary exists.
- [ ] Secondary exists.
- [ ] Tertiary exists.
- [ ] Destructive exists.
- [ ] Link exists.
- [ ] Icon-only exists.
- [ ] Hover works.
- [ ] Focus works.
- [ ] Disabled works.
- [ ] Loading works.
- [ ] Duplicate submission is prevented.

## 174. Full Acceptance Checklist — Forms

- [ ] Inputs have labels.
- [ ] Required fields are identified.
- [ ] Validation is clear.
- [ ] Error messages are actionable.
- [ ] Selects are keyboard accessible.
- [ ] Comboboxes are accessible.
- [ ] Date/time controls are accessible.
- [ ] Form focus behavior is correct.
- [ ] Error recovery preserves valid input.

## 175. Full Acceptance Checklist — Tables

- [ ] Table headers are semantic.
- [ ] Sorting state is accessible.
- [ ] Filtering works.
- [ ] Search works.
- [ ] Loading exists.
- [ ] Empty exists.
- [ ] Error exists.
- [ ] Pagination exists where needed.
- [ ] Large datasets are efficiently rendered.
- [ ] Keyboard navigation works.

## 176. Full Acceptance Checklist — Feedback

- [ ] Alerts exist.
- [ ] Toasts exist.
- [ ] Dialogs exist.
- [ ] Skeletons exist.
- [ ] Progress indicators exist.
- [ ] Empty states exist.
- [ ] Error states exist.
- [ ] Permission states exist.
- [ ] Offline states exist.
- [ ] Reconnecting states exist.

## 177. Full Acceptance Checklist — Video

- [ ] Video player exists.
- [ ] Live state exists.
- [ ] Connecting state exists.
- [ ] Buffering state exists.
- [ ] Disconnected state exists.
- [ ] Full-screen works.
- [ ] Keyboard controls work.
- [ ] Accessible labels exist.
- [ ] Video state is independent from Job state.

## 178. Full Acceptance Checklist — Logs

- [ ] Log viewer exists.
- [ ] Search works.
- [ ] Filtering works.
- [ ] Severity is textual.
- [ ] Follow mode exists.
- [ ] Pause exists.
- [ ] Large logs are virtualized/bounded.
- [ ] Keyboard navigation works.
- [ ] Download works where authorized.

## 179. Full Acceptance Checklist — Telemetry

- [ ] Metric cards exist.
- [ ] Units are displayed.
- [ ] Timestamp is available.
- [ ] Status is textual.
- [ ] Charts have labels.
- [ ] Charts have accessible summaries.
- [ ] High-frequency data is sampled/aggregated.
- [ ] Large streams do not freeze the UI.
- [ ] Dark theme is supported.

## 180. Full Acceptance Checklist — Motion

- [ ] Motion tokens exist.
- [ ] Standard durations are defined.
- [ ] Essential state transitions are animated appropriately.
- [ ] Decorative animation is limited.
- [ ] Reduced motion is supported.
- [ ] Telemetry does not excessively animate.
- [ ] Safety warnings remain visually stable.

## 181. Full Acceptance Checklist — Theming

- [ ] Light theme works.
- [ ] Dark theme works.
- [ ] System theme works.
- [ ] Theme persists appropriately.
- [ ] All semantic tokens resolve.
- [ ] Focus remains visible.
- [ ] Status remains distinguishable.
- [ ] Charts remain readable.
- [ ] Logs remain readable.
- [ ] Video controls remain readable.

## 182. Full Acceptance Checklist — Accessibility

- [ ] Keyboard-only navigation works.
- [ ] Focus is visible.
- [ ] Focus order is logical.
- [ ] Dialog focus trapping works.
- [ ] Focus returns after dialogs.
- [ ] Accessible names exist.
- [ ] Status changes are announced.
- [ ] Color is not the sole status signal.
- [ ] Contrast is compliant.
- [ ] Reduced motion works.
- [ ] Screen-reader testing is completed.
- [ ] Primary workflows are keyboard completable.

## 183. Full Acceptance Checklist — React

- [ ] Shared components live in the UI package.
- [ ] Feature components remain feature-owned.
- [ ] Components have typed props.
- [ ] Business logic is not embedded in primitives.
- [ ] API calls are isolated in the API client/data layer.
- [ ] Server state is distinct from UI state.
- [ ] Theme is centralized.
- [ ] Accessibility is componentized.
- [ ] Components have tests.
- [ ] Visual regression is implemented for critical components.

## 184. Full Acceptance Checklist — Security

- [ ] Source privacy pattern exists.
- [ ] Security state is explicit.
- [ ] Secrets are never displayed.
- [ ] Artifact trust is visible.
- [ ] Authorization failures are clear.
- [ ] Tenant boundaries are preserved.
- [ ] Sensitive logs are handled safely.
- [ ] Analytics do not capture source code.

## 185. Full Acceptance Checklist — Safety

- [ ] Safety authority is explicitly labeled.
- [ ] Local safety remains authoritative.
- [ ] Emergency stop is not falsely represented.
- [ ] Unsafe state is clearly visible.
- [ ] Safety-blocked actions cannot be bypassed.
- [ ] Disconnect behavior is clearly represented.
- [ ] No unsafe automatic restart is exposed.

## 186. Full Acceptance Checklist — Integration

- [ ] Design system is used by F-M01.
- [ ] F-M02 screens use shared components.
- [ ] F-M03 platform views use shared patterns.
- [ ] F-M04 build/artifact views use shared status patterns.
- [ ] F-M05 booking/credit views use shared forms and summaries.
- [ ] F-M06 execution views use shared operational components.
- [ ] F-M07 results/settings use shared patterns.
- [ ] No feature introduces an incompatible visual language.

## 187. Final Design Invariants

The following invariants are mandatory:

1. Semantic tokens are preferred over hardcoded visual values.
2. Light and dark themes share semantic meaning.
3. Status is never communicated through color alone.
4. Accessibility is required at the primitive/component level.
5. Keyboard focus must remain visible.
6. Critical operational states must remain textually explicit.
7. Safety status must never be represented as generic decorative feedback.
8. Local and remote workflows must remain distinguishable.
9. Financial/resource information must be explicit before confirmation.
10. Video state must remain separate from execution state.
11. Telemetry must not overwhelm the UI.
12. Logs must remain performant at large volumes.
13. Shared components must not contain domain business logic.
14. Feature components must consume shared design primitives.
15. Server state remains authoritative.
16. UI state must not silently mutate remote business state.
17. Component variants must remain bounded and intentional.
18. New design patterns require review.
19. Breaking token changes require migration.
20. Accessibility cannot be deferred until production release.
21. Theme support cannot be deferred until after feature implementation.
22. Security and safety states receive explicit visual treatment.
23. Design debt must be tracked.
24. Visual consistency must be maintained across all F-M01 through F-M07
    milestones.
25. The design system must support the complete RaaS workflow without creating
    separate visual languages for individual features.

## 188. Final Design Architecture

The complete design system architecture is:

    Design Tokens
        |
        +--> Color
        +--> Typography
        +--> Spacing
        +--> Radius
        +--> Elevation
        +--> Motion
        |
        v
    Theme
        |
        +--> Light
        +--> Dark
        |
        v
    Primitives
        |
        +--> Button
        +--> Input
        +--> Select
        +--> Dialog
        +--> Badge
        +--> Alert
        +--> Card
        +--> Table
        +--> Progress
        +--> Skeleton
        |
        v
    Specialized Components
        |
        +--> Video
        +--> Logs
        +--> Telemetry
        +--> Charts
        +--> Job Timeline
        +--> Compatibility
        +--> Credit Summary
        |
        v
    Feature Screens
        |
        +--> Login
        +--> Dashboard
        +--> Projects
        +--> Platforms
        +--> Build
        +--> Artifacts
        +--> Booking
        +--> Credits
        +--> Jobs
        +--> Live Run
        +--> Results
        +--> Settings

## 189. Final Principle

> The Kritva RaaS Studio design system shall provide one coherent visual and
> interaction language for the complete robotics development lifecycle. It
> shall combine engineering-grade information density with strong hierarchy,
> semantic status communication, accessible interaction, predictable motion,
> light/dark theming and reusable React components. The system shall make local
> development, remote execution, platform compatibility, credit consumption,
> Job/Run state, results and safety authority immediately understandable. The
> design system is not a cosmetic layer added after implementation; it is a
> foundational product architecture established in Phase 0 and applied
> consistently through Phases 1-8. Every new Studio screen shall consume the
> shared token, component and accessibility system, and every new component
> shall have defined states, theme behavior, keyboard interaction and review
> evidence. The result shall be a production-grade Studio experience that
> remains technically precise, visually consistent, operationally clear and
> safe to use throughout the Kritva RaaS workflow.
