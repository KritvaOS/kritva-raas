# Kritva RaaS Frontend Code Style and Engineering Conventions

## 1. Document Control

| Item | Value |
|---|---|
| Document | Frontend Code Style |
| Path | `docs/frontend/development/CODE_STYLE.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Frontend | Studio + Web Console |
| UI | React + TypeScript |
| Native Runtime | Rust + Tauri |
| UI State | Zustand |
| Server State | TanStack Query |
| API | REST `/api/v1/` |
| Realtime | WebSocket |
| Live Video | WebRTC |
| Workspace | pnpm + Turborepo |
| Formatter | Prettier / repository configuration |
| Linter | ESLint / repository configuration |
| Rust Formatter | rustfmt |
| Rust Linter | Clippy |
| Status | Engineering Baseline |

## 2. Purpose

This document defines the coding conventions for Kritva RaaS frontend and
Studio native-runtime development.

The objective is to make code:

- readable;
- predictable;
- maintainable;
- testable;
- secure;
- reviewable;
- cross-platform;
- architecturally consistent.

The conventions apply to both new code and meaningful modifications to existing
code.

## 3. Scope

This document covers:

- TypeScript;
- React;
- React hooks;
- Zustand;
- TanStack Query;
- API clients;
- WebSocket handling;
- Tauri IPC;
- Rust;
- filesystem operations;
- process execution;
- logging;
- errors;
- security;
- naming;
- folders;
- imports;
- formatting;
- linting;
- comments;
- tests;
- code review.

## 4. Non-Goals

This document does not define:

- product UX specifications;
- protocol semantics;
- backend coding standards;
- database conventions;
- cloud infrastructure coding standards;
- robot firmware coding standards.

Where another domain owns an interface, this document requires frontend code to
consume that interface consistently.

## 5. Core Principles

Kritva RaaS code should follow:

1. Explicit over implicit.
2. Small modules over large modules.
3. Typed boundaries over dynamic boundaries.
4. Domain terminology over generic terminology.
5. Server authority over client assumptions.
6. Structured errors over strings.
7. Structured logs over ad-hoc output.
8. Least privilege over convenience.
9. Reuse approved abstractions before creating new ones.
10. Tests accompany implementation.
11. Documentation accompanies architectural change.
12. Formatting and linting are automated.

## 6. Architecture Context

The frontend architecture is:

    React
      |
      +--> Zustand
      +--> TanStack Query
      +--> API Client
      +--> WebSocket
      +--> WebRTC
      |
      +--> Typed Tauri IPC
                  |
                  v
              Rust Runtime
                  |
          +-------+-------+
          |               |
          v               v
      Filesystem       Processes

Remote application state flows through:

    Frontend
       |
       v
    REST / WebSocket
       |
       v
    Control Plane
       |
       v
    Durable State

## 7. Language Responsibilities

| Language | Responsibility |
|---|---|
| TypeScript | Frontend application logic |
| JSX/TSX | React UI |
| Rust | Native Studio/runtime operations |
| JSON | Protocol/configuration data |
| YAML | CI/configuration where approved |
| Markdown | Documentation |

Do not move privileged native behavior into browser-side TypeScript.

## 8. Repository Structure

The expected high-level structure is:

    kritva-raas/
    ├── apps/
    │   ├── studio/
    │   ├── web/
    │   └── backend/
    ├── packages/
    │   ├── ui/
    │   ├── contracts/
    │   ├── api-client/
    │   ├── auth/
    │   ├── config/
    │   └── utils/
    ├── tests/
    ├── docs/
    └── tooling/

Actual application names must follow the repository implementation.

## 9. Feature-Based Structure

Frontend applications should use feature-oriented organization.

Example:

    apps/web/src/
    ├── app/
    ├── features/
    │   ├── auth/
    │   ├── projects/
    │   ├── platforms/
    │   ├── artifacts/
    │   ├── booking/
    │   ├── credits/
    │   ├── jobs/
    │   ├── runs/
    │   └── results/
    ├── components/
    ├── hooks/
    ├── lib/
    └── styles/

Feature code should remain cohesive.

## 10. Feature Boundary

A feature should generally contain:

    feature/
    ├── components/
    ├── hooks/
    ├── api/
    ├── state/
    ├── types/
    ├── utils/
    └── tests/

Do not create every directory if a feature does not require it.

Avoid empty structural directories.

## 11. Shared Package Boundary

Shared functionality belongs in:

    packages/ui
    packages/contracts
    packages/api-client
    packages/auth
    packages/config
    packages/utils

A module should move to a shared package only when it has a meaningful shared
responsibility.

## 12. Dependency Direction

Preferred dependency direction:

    Application Feature
          |
          v
    Shared Package
          |
          v
    Platform Abstraction

Avoid:

    Shared Package
          |
          v
    Application Feature

Shared packages must not depend on application-specific modules.

## 13. TypeScript Baseline

TypeScript should use strict type checking.

Expected principles:

- `strict` enabled;
- avoid implicit `any`;
- avoid unsafe casts;
- model nullable values explicitly;
- use discriminated unions for state;
- validate external input at boundaries.

## 14. TypeScript Naming

| Item | Convention | Example |
|---|---|---|
| Variable | camelCase | `projectId` |
| Function | camelCase | `loadProject()` |
| Constant | camelCase unless global constant style required | `defaultPageSize` |
| Type | PascalCase | `ProjectSummary` |
| Interface | PascalCase | `ArtifactRepository` |
| Enum | PascalCase | `JobState` |
| React Component | PascalCase | `ProjectCard` |
| Hook | `use` + PascalCase | `useProject()` |
| File | feature convention | `ProjectCard.tsx` |
| Test | `.test` / `.spec` | `ProjectCard.test.tsx` |

## 15. Boolean Naming

Boolean names should communicate a predicate.

Preferred:

    isLoading
    isAuthenticated
    hasCredits
    canCancel
    shouldReconnect

Avoid ambiguous:

    loading
    auth
    flag
    enabledThing

## 16. Function Naming

Functions should use verbs.

Preferred:

    createProject()
    fetchPlatforms()
    validateArtifact()
    calculateCreditQuote()
    startJob()

Avoid:

    project()
    platform()
    artifact()

unless the function is intentionally a selector or factory.

## 17. Event Handler Naming

Use:

    handleSubmit
    handleCancel
    handlePlatformSelect
    handleJobStop

Props representing callbacks should use:

    onSubmit
    onCancel
    onPlatformSelect
    onJobStop

## 18. React Component Naming

Components use PascalCase:

    ProjectWorkspace
    PlatformCard
    BookingDialog
    JobStatusBadge

One primary exported component per file is preferred.

Small helper components may remain local to a feature when they are not reusable.

## 19. React Component Design

Components should generally follow:

    Props
      |
      v
    Render
      |
      +--> Hook
      +--> Query
      +--> Event
      |
      v
    User-visible State

Avoid putting:

- API calls;
- filesystem operations;
- complex business logic;
- protocol parsing

directly into large JSX blocks.

## 20. Component Size

Large components should be decomposed when they contain multiple independent
responsibilities.

Warning signs:

- excessive JSX;
- multiple unrelated effects;
- several independent server queries;
- complex validation;
- large event handlers.

Do not split components merely to satisfy an arbitrary line count.

## 21. Props

Props should be explicit and typed.

Prefer:

    type PlatformCardProps = {
        platform: PlatformSummary;
        isSelected: boolean;
        onSelect: (platformId: string) => void;
    };

Avoid broad:

    props: any

## 22. Optional Props

Use optional props only when omission has a meaningful semantic.

Prefer:

    disabled?: boolean

when omission means "use normal behavior."

Avoid excessive optional properties that create ambiguous component states.

## 23. React Hooks

Hooks should:

- follow React hook rules;
- have deterministic dependencies;
- avoid hidden side effects;
- encapsulate cohesive behavior.

Custom hooks should be named:

    useProject
    useBooking
    useJobStatus
    useRealtimeSubscription

## 24. Hook Responsibility

A hook should have a clear responsibility.

Good:

    useJob(jobId)

Poor:

    useEverything()

Avoid hooks that silently:

- mutate unrelated state;
- navigate unexpectedly;
- trigger unrelated API calls;
- manage multiple independent features.

## 25. useEffect

`useEffect` should be used for actual synchronization with external systems.

Examples:

- WebSocket subscription;
- browser event;
- media connection;
- native IPC event.

Do not use `useEffect` as a replacement for normal derived computation.

Prefer:

    const total = credits * rate;

over an effect that stores the derived value.

## 26. Memoization

Use `useMemo` and `useCallback` when they provide measurable or structural
value.

Do not memoize every function automatically.

Premature memoization increases complexity.

## 27. Conditional Rendering

Prefer readable conditions.

Good:

    {isLoading && <LoadingState />}

    {error && <ErrorState error={error} />}

    {project && <ProjectWorkspace project={project} />}

Complex conditional trees should be extracted into named components.

## 28. React Keys

Keys must represent stable identity.

Preferred:

    key={project.projectId}

Avoid:

    key={index}

for dynamic domain collections.

## 29. Accessibility Naming

Interactive elements must have meaningful accessible names.

Prefer:

    <button aria-label="Stop job">

Avoid icon-only controls without accessible labels.

## 30. Type Definitions

Use domain types from shared contracts when they represent protocol entities.

Do not recreate:

    type Project = ...

in multiple packages when the canonical contract already exists.

Local view models are acceptable when they intentionally represent a different
presentation model.

## 31. Domain vs View Models

Keep boundaries explicit:

    API Contract
       |
       v
    Domain Model
       |
       v
    View Model
       |
       v
    UI

Do not leak backend-specific transport details throughout UI components.

## 32. Type Assertions

Avoid unnecessary:

    value as SomeType

Prefer:

- type guards;
- schema validation;
- narrowing;
- explicit transformation.

Type assertions are acceptable when the invariant is established and documented.

## 33. `any`

`any` should be avoided.

If unavoidable:

- isolate it;
- document why;
- validate the boundary;
- avoid propagating it.

Use `unknown` for untrusted values.

## 34. External Data

All external data is untrusted until validated.

Boundary:

    Unknown JSON
       |
       v
    Validation
       |
       v
    Typed Data
       |
       v
    Application

This applies to:

- API;
- WebSocket;
- IPC;
- local files;
- artifact manifests;
- browser storage.

## 35. API Client Style

API calls belong in the API client or feature API module.

Preferred:

    const project = await projectApi.get(projectId);

Avoid:

    fetch("/api/v1/projects/" + projectId)

inside a React component.

## 36. API Error Handling

API errors must use structured errors.

Preferred conceptual model:

    {
        code,
        message,
        details,
        retryable
    }

Do not make UI behavior depend on parsing human-readable messages.

## 37. Error Codes

Use canonical protocol codes such as:

    BOOKING_CONFLICT
    INSUFFICIENT_CREDITS
    ARTIFACT_INCOMPATIBLE
    JOB_RESOURCE_UNAVAILABLE

Do not create feature-local aliases for established protocol codes without
justification.

## 38. Error Mapping

The API layer should translate transport errors into application errors.

Flow:

    HTTP / Network
         |
         v
    Protocol Error
         |
         v
    Domain Error
         |
         v
    UI Error State

UI components should not parse raw HTTP response bodies.

## 39. Error Messages

Human-readable messages are presentation content.

Machine behavior must use stable codes.

Do not write:

    if (message.includes("not available"))

Use:

    if (error.code === "PLATFORM_UNAVAILABLE")

## 40. Error Boundaries

React error boundaries should protect major application regions.

They should:

- show a recoverable UI;
- log diagnostic information;
- avoid exposing internal details;
- provide recovery where possible.

An error boundary must not silently hide critical application failures.

## 41. Async Error Handling

Every async operation must define:

- loading;
- success;
- failure;
- cancellation where relevant.

Avoid unhandled promises.

## 42. Mutation Rules

Mutations should use TanStack Query where they represent server operations.

Example:

    useMutation({
        mutationFn: createBooking
    })

The mutation result should determine authoritative state.

## 43. Optimistic Updates

Optimistic updates are restricted.

Do not optimistically confirm:

- bookings;
- credits;
- payments;
- job start;
- job stop;
- resource allocation;
- safety operations.

Low-risk presentation changes may be optimistic.

## 44. Server State

TanStack Query owns:

- projects;
- platforms;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- results.

Zustand should not become a second copy of these entities.

## 45. Zustand State

Zustand is appropriate for:

- UI preferences;
- navigation;
- local interaction state;
- modal state;
- filter state;
- transient application state.

Persistent server truth remains outside Zustand.

## 46. Query Keys

Query keys must be stable and tenant-aware.

Conceptually:

    ["projects", organizationId, filters]

    ["project", organizationId, projectId]

Avoid:

    ["project"]

for tenant-scoped resources.

## 47. WebSocket Style

WebSocket code should be isolated behind a service or hook.

Preferred:

    WebSocket
       |
       v
    Connection Manager
       |
       v
    Event Router
       |
       v
    Query Invalidation / Update

Do not open WebSocket connections directly from many components.

## 48. WebSocket Events

Event processing should use:

- event ID;
- event type;
- resource ID;
- sequence;
- organization context.

Duplicate events must be harmless.

## 49. WebSocket Reconnect

Reconnect logic should be centralized.

Expected:

    DISCONNECTED
       |
       v
    CONNECTING
       |
       v
    CONNECTED
       |
       v
    SUBSCRIBED

After reconnect, reconcile authoritative state.

## 50. WebRTC Style

WebRTC code should remain isolated from business state.

Video lifecycle:

    Authorization
       |
       v
    Signaling
       |
       v
    Peer Connection
       |
       v
    Media Stream
       |
       v
    Video Element

Video failure must not be interpreted as robot failure.

## 51. Tauri IPC

React code must use typed IPC wrappers.

Preferred:

    studioRuntime.build(request)

Avoid:

    invoke("some-command", arbitraryObject)

throughout components.

## 52. IPC Command Naming

Use domain-oriented names consistent with the IPC architecture.

Examples:

    studio.project.create
    studio.project.open
    toolchain.detect
    build.start
    test.start
    artifact.package

## 53. No Generic Shell API

The frontend must never expose:

    shell.execute(command)

or equivalent unrestricted command execution.

The native runtime exposes explicit operations.

## 54. IPC Error Handling

IPC errors must use structured codes.

Examples:

    LOCAL_TOOLCHAIN_NOT_FOUND
    LOCAL_BUILD_FAILED
    LOCAL_TEST_FAILED
    LOCAL_ARTIFACT_PACKAGE_FAILED
    LOCAL_ARTIFACT_SOURCE_DETECTED

Do not expose raw Rust panic messages to users.

## 55. Long-Running IPC

Long operations should return an operation ID.

Example:

    {
        "status": "ACCEPTED",
        "operation_id": "op-001"
    }

Events provide progress.

Status query remains authoritative.

## 56. Rust Naming

Rust conventions follow standard Rust idioms.

| Item | Convention | Example |
|---|---|---|
| Function | snake_case | `start_build` |
| Variable | snake_case | `project_path` |
| Module | snake_case | `artifact_manager` |
| Struct | PascalCase | `ArtifactManager` |
| Enum | PascalCase | `OperationState` |
| Enum Variant | PascalCase | `Running` |
| Constant | SCREAMING_SNAKE_CASE | `MAX_LOG_BYTES` |
| Trait | PascalCase | `ProcessRunner` |

## 57. Rust Modules

Prefer small modules with clear responsibility.

Example:

    runtime/
    ├── operation.rs
    ├── filesystem.rs
    ├── process.rs
    ├── toolchain.rs
    ├── artifact.rs
    ├── logging.rs
    └── error.rs

Avoid a single large `runtime.rs`.

## 58. Rust Struct Design

Structs should model meaningful domain concepts.

Prefer:

    struct ArtifactManifest {
        ...
    }

over generic:

    struct Data {
        ...
    }

## 59. Rust Enums

Enums should model finite state explicitly.

Example:

    enum OperationState {
        Created,
        Running,
        Completed,
        Failed,
        Cancelled,
    }

Avoid stringly typed lifecycle state in internal Rust logic.

## 60. Rust Traits

Traits should represent meaningful boundaries.

Examples:

    trait ProcessRunner
    trait FileSystem
    trait ToolchainDetector
    trait ArtifactSigner

Use traits when they provide:

- testability;
- abstraction;
- platform separation;
- dependency inversion.

Do not create traits merely to wrap every function.

## 61. Rust Ownership

Prefer Rust ownership and borrowing idioms.

Avoid unnecessary:

    .clone()

when ownership can be designed cleanly.

Clone intentionally when it improves correctness or simplifies a bounded
operation.

## 62. Rust Error Handling

Rust functions should return `Result<T, E>` for recoverable failures.

Avoid:

    unwrap()

and:

    expect()

in production paths unless the invariant is genuinely impossible to violate
and documented.

## 63. Rust Error Types

Prefer structured domain errors.

Example conceptual categories:

    ToolchainNotFound
    InvalidWorkspace
    ProcessStartFailed
    ArtifactInvalid
    PermissionDenied

Errors should retain useful context without leaking secrets.

## 64. Panic Policy

A panic should represent a violated internal invariant, not normal user input.

Never use panic as ordinary validation.

User input must produce structured errors.

## 65. Rust Result Propagation

Use idiomatic propagation:

    operation()
        .await?;

Add context where it materially improves diagnostics.

Do not discard errors silently.

## 66. Error Context

Good error context identifies:

- operation;
- resource;
- safe diagnostic details.

Avoid logging:

- credentials;
- tokens;
- private keys;
- sensitive source content.

## 67. Logging Principles

Logging should be:

- structured;
- contextual;
- bounded;
- actionable;
- redacted.

Preferred conceptual fields:

    timestamp
    level
    component
    operation_id
    request_id
    event
    code
    message

## 68. Log Levels

Use:

| Level | Purpose |
|---|---|
| TRACE | Detailed diagnostics |
| DEBUG | Developer diagnostics |
| INFO | Normal lifecycle |
| WARN | Recoverable abnormality |
| ERROR | Operation failure |
| FATAL | Process-level unrecoverable condition |

Avoid logging everything at ERROR.

## 69. Frontend Logging

Browser logs should be intentional.

Avoid:

    console.log("HERE")
    console.log(data)

Use the application's logging abstraction where provided.

Production logging must be minimized and privacy-aware.

## 70. Rust Logging

Rust should use the repository-approved structured logging framework.

Logs should include operation context.

Example conceptual record:

    {
        "level": "INFO",
        "component": "artifact",
        "operation_id": "op-001",
        "event": "artifact.packaging.started"
    }

## 71. Correlation IDs

Where available, preserve:

- request ID;
- operation ID;
- trace ID;
- event ID.

Flow:

    UI Action
       |
       v
    Request ID
       |
       v
    Backend
       |
       v
    Lab / Runtime

This enables cross-boundary debugging.

## 72. Sensitive Logging Rules

Never log:

- access tokens;
- refresh tokens;
- passwords;
- private keys;
- API secrets;
- signing keys;
- full environment files;
- unredacted credentials;
- unnecessary source code.

## 73. Artifact Logging

Artifact logs may include:

- artifact ID;
- digest;
- platform;
- architecture;
- validation result.

Do not log the entire artifact contents or proprietary source.

## 74. Filesystem Security

Filesystem paths are untrusted inputs.

Rust must validate:

- workspace boundary;
- path traversal;
- allowed roots;
- permissions;
- symbolic links where relevant.

Never assume a path supplied by TypeScript is safe.

## 75. Process Security

Process execution must use structured arguments.

Avoid shell interpolation.

Preferred conceptual flow:

    Validated Operation
       |
       v
    Program
       +
    Argument List
       |
       v
    Process Manager

Never construct shell commands from raw user input.

## 76. Environment Security

Frontend environment variables are public to bundled code.

Never place secrets in:

    VITE_*

or other browser-exposed configuration.

Native secrets require approved secure storage.

## 77. Authentication

Authentication state must be handled through the approved auth abstraction.

Do not duplicate authentication logic across features.

## 78. Authorization

The frontend may hide unauthorized actions for usability.

It must never assume that UI visibility provides security.

The backend remains authoritative.

## 79. Tenant Isolation

Organization context must be treated as security-sensitive.

Do not allow:

    URL organization ID
        +
    Client state

to override server authorization.

Frontend query keys and cache behavior must still prevent accidental cross-tenant
display.

## 80. Input Validation

Validate at boundaries:

- forms;
- API responses;
- WebSocket messages;
- IPC requests;
- local manifests.

Use canonical schemas where available.

## 81. Serialization

Protocol serialization should use approved contract utilities.

Do not manually construct inconsistent envelopes in multiple modules.

## 82. Dates and Time

Use a consistent date/time library or approved utilities.

Rules:

- store/transmit UTC;
- display according to user locale where appropriate;
- never assume browser local time is UTC;
- make booking timezone explicit.

## 83. IDs

Use opaque IDs from the backend.

Do not infer meaning from ID formatting.

Do not generate fake production IDs for durable server entities unless the API
explicitly supports client-generated IDs.

## 84. Constants

Constants should have descriptive names.

Good:

    MAX_LOG_BYTES
    DEFAULT_PAGE_SIZE
    JOB_RECONNECT_DELAY_MS

Avoid:

    MAX
    LIMIT
    TIMEOUT

unless scope makes the meaning unambiguous.

## 85. Magic Numbers

Avoid unexplained numeric literals.

Prefer:

    const DEFAULT_RECONNECT_DELAY_MS = 1000;

instead of:

    setTimeout(reconnect, 1000);

## 86. Configuration

Configuration should be centralized.

Preferred:

    packages/config/

Configuration should not be scattered through components.

## 87. Imports

Import order should be automated.

Recommended conceptual grouping:

    External packages
    Shared packages
    Application modules
    Relative modules
    Styles

Do not rely on manually maintained ordering.

## 88. Import Boundaries

Avoid deep imports into another package's private internals.

Preferred:

    @kritva/contracts

instead of:

    ../../packages/contracts/src/internal/schema

Package public APIs should define supported imports.

## 89. Circular Dependencies

Circular dependencies should be avoided.

If a cycle appears:

    A -> B -> C -> A

reconsider module ownership.

Do not solve cycles with lazy imports unless the architecture intentionally
requires them.

## 90. Comments

Comments should explain:

- why;
- constraints;
- non-obvious invariants;
- security assumptions;
- protocol decisions.

Avoid comments that merely repeat code.

Bad:

    // Increment i
    i++;

Good:

    // Preserve resource ordering because backend sequence numbers are scoped
    // to a single resource.

## 91. TODO Policy

TODOs should identify actionable work.

Preferred:

    // TODO(F05-012): add replay support after server cursor API is available.

Avoid:

    // TODO: fix this

Critical TODOs should have tracked tasks.

## 92. Deprecated Code

Deprecated APIs should:

- identify replacement;
- identify removal task/version;
- avoid new usage;
- remain only as long as necessary.

## 93. Dead Code

Do not keep unused code "just in case."

Use version control to recover historical implementations.

## 94. Duplication

Duplication should be evaluated rather than mechanically eliminated.

Good duplication can be preferable when:

- abstractions are not stable;
- responsibilities differ;
- coupling would increase.

Shared abstractions should be introduced when semantics are genuinely shared.

## 95. Utility Functions

Utilities should have narrow responsibilities.

Avoid generic:

    helpers.ts

containing unrelated functions.

Prefer:

    date/
    validation/
    artifacts/
    formatting/

or domain-specific modules.

## 96. Naming Domain Concepts

Use canonical product terms:

- Project;
- Platform;
- Artifact;
- Booking;
- Credit;
- Job;
- Run;
- Result;
- Lab;
- Resource.

Do not alternate between terms such as:

    Task / Job / Execution

when they represent distinct domain concepts.

## 97. Status Handling

Use canonical status types.

For job state:

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

Do not invent UI-only states that contradict server state.

## 98. State Transition Modeling

When state transitions are complex, model them explicitly.

Example:

    Job State
       |
       +--> valid transition
       |
       +--> invalid transition

Tests should cover both.

## 99. Loading State Naming

Use consistent names:

    isLoading
    isFetching
    isSubmitting
    isSaving
    isConnecting

Do not reuse one boolean for multiple independent asynchronous operations.

## 100. Error State Naming

Prefer:

    error
    validationError
    apiError
    connectionError

when their scope is clear.

Avoid:

    problem
    issue
    badThing

## 101. Logging vs User Messaging

Logs and UI messages have different purposes.

    Internal Error
        |
        +--> Structured Log
        |
        +--> Stable Error Code
                    |
                    v
                User Message

Never display raw internal stack traces to users.

## 102. Security Review Triggers

Security review is required for changes involving:

- authentication;
- authorization;
- credentials;
- filesystem;
- process execution;
- artifact signing;
- artifact upload;
- tenant isolation;
- IPC capabilities;
- WebSocket authorization;
- local secret storage.

## 103. Performance Rules

Avoid:

- unbounded lists;
- excessive re-renders;
- high-frequency global state updates;
- rendering entire large logs;
- storing large binary payloads in React state.

Use:

- virtualization;
- pagination;
- sampling;
- memoization where justified;
- streaming;
- bounded buffers.

## 104. Telemetry Rendering

Telemetry should follow:

    High-rate Stream
         |
         v
    Buffer / Aggregate
         |
         v
    UI Update
         |
         v
    Chart

Do not cause one React render per raw telemetry packet when rates are high.

## 105. Large Files

Do not transport large artifacts through JSON application state.

Use controlled:

- object storage;
- streaming;
- signed URLs;
- upload/download APIs.

React state should contain metadata, not entire artifacts.

## 106. WebSocket Payloads

WebSocket handlers should validate incoming events before updating application
state.

Flow:

    Raw Event
       |
       v
    Schema Validation
       |
       v
    Event Router
       |
       v
    State Update

## 107. IPC Payloads

IPC requests must be validated by Rust even if TypeScript has already validated
them.

TypeScript validation improves UX.

Rust validation establishes the native security boundary.

## 108. Formatting Configuration

The repository should provide centralized formatting configuration.

Typical files:

    .editorconfig
    .prettierrc
    .prettierignore

The exact configuration is repository-controlled.

Developers should not introduce local formatting rules.

## 109. ESLint Configuration

The repository should provide centralized ESLint configuration.

The configuration should cover:

- TypeScript;
- React;
- React Hooks;
- accessibility;
- imports;
- unused variables;
- unsafe patterns.

CI must run the same lint configuration used locally.

## 110. Rust Formatting

Run:

    cargo fmt --all -- --check

Formatting must use rustfmt.

Developers should not commit Rust code that requires automatic reformatting.

## 111. Rust Clippy

Run:

    cargo clippy --all-targets --all-features -- -D warnings

The exact feature set may vary by workspace.

Warnings should not be ignored without documented justification.

## 112. TypeScript Validation

Run:

    pnpm typecheck

The repository TypeScript configuration is authoritative.

Do not suppress errors with:

    // @ts-ignore

unless there is a documented reason and reviewer approval.

Prefer:

    // @ts-expect-error <reason>

only when the expected error is intentional and tested.

## 113. Formatting Validation

Run:

    pnpm format

or repository-equivalent validation.

CI should reject formatting drift.

## 114. Lint Validation

Run:

    pnpm lint

Lint rules should encode enforceable engineering policy.

Rules that cannot be automatically enforced should be documented here or in
review checklists.

## 115. Pre-Commit Validation

A developer should normally run:

    pnpm format
    pnpm lint
    pnpm typecheck
    pnpm test

before creating a PR.

## 116. CI Style Gate

CI should run:

    format check
        |
        v
    ESLint
        |
        v
    TypeScript
        |
        v
    Rust fmt
        |
        v
    Clippy
        |
        v
    Tests

The exact pipeline may run jobs in parallel.

## 117. Formatting Exceptions

Formatting exceptions should be extremely rare.

If required:

- isolate the exception;
- document why;
- avoid broad disabling;
- obtain review.

Do not disable the formatter for entire directories merely to preserve
non-standard style.

## 118. Lint Suppressions

Lint suppressions must be narrow.

Avoid:

    /* eslint-disable */

for an entire file unless strongly justified.

Prefer the smallest possible suppression with an explanation.

## 119. Generated Code

Generated code may have separate formatting/lint rules.

Generated files should not be manually modified if regeneration is expected.

The source generator/configuration must be authoritative.

## 120. Test Code Style

Tests follow the same TypeScript standards.

Test-specific helpers should still be typed.

Tests may use controlled mocks and fixtures but must not hide production
behavior.

## 121. Test Naming

Use behavior-oriented names:

    it("shows an insufficient credit error when the balance is too low")

Avoid:

    it("test credit")

## 122. Test Assertions

Assertions should be specific.

Prefer:

    expect(screen.getByRole("alert")).toHaveTextContent("Insufficient credits")

over broad:

    expect(container).toMatchSnapshot()

unless a snapshot is intentionally appropriate.

## 123. Mock Naming

Mocks should identify their purpose.

Examples:

    mockControlPlane
    mockWebSocket
    fakeClock
    testPlatform
    testArtifact

Avoid ambiguous:

    mock1
    fakeData

## 124. Rust Test Style

Rust tests should use descriptive names:

    rejects_path_outside_workspace()
    packages_artifact_without_git_metadata()
    maps_missing_toolchain_to_error()

Tests should verify behavior rather than private implementation details.

## 125. API Interface Example

A typed API client should conceptually look like:

    interface ProjectApi {
        list(request: ListProjectsRequest): Promise<ProjectPage>;
        get(projectId: ProjectId): Promise<Project>;
        create(request: CreateProjectRequest): Promise<Project>;
        archive(projectId: ProjectId): Promise<void>;
    }

Interfaces should use domain terms.

## 126. IPC Interface Example

Conceptually:

    interface StudioRuntime {
        createProject(request: CreateProjectRequest): Promise<OperationResult>;
        openProject(request: OpenProjectRequest): Promise<OperationResult>;
        detectToolchains(): Promise<ToolchainInfo[]>;
        startBuild(request: BuildRequest): Promise<OperationResult>;
        getOperationStatus(operationId: OperationId): Promise<OperationStatus>;
    }

The interface should hide raw Tauri implementation from React components.

## 127. Repository Interfaces

Frontend repositories should not imitate backend repositories unless there is a
clear client-side abstraction.

The frontend primarily consumes:

- API clients;
- query hooks;
- IPC services.

Do not create a generic frontend "repository" layer solely for architectural
symmetry.

## 128. Data Flow Style

Preferred:

    UI
      |
      v
    Feature Hook
      |
      v
    API Client
      |
      v
    Control Plane
      |
      v
    Server State

For Studio local:

    UI
      |
      v
    IPC Service
      |
      v
    Rust Runtime
      |
      v
    Native Resource

## 129. File Naming

Use consistent filenames.

Recommended:

    ProjectCard.tsx
    ProjectCard.test.tsx
    useProject.ts
    projectApi.ts
    projectTypes.ts
    projectUtils.ts

Rust:

    artifact.rs
    process.rs
    toolchain.rs
    error.rs

## 130. Index Files

Index/barrel files should be used selectively.

Avoid large barrel files that:

- obscure dependency direction;
- create cycles;
- increase import ambiguity.

Explicit package public APIs are preferred.

## 131. Public Exports

Packages should expose only intended public APIs.

Internal implementation should remain private.

Conceptually:

    package/
    ├── src/
    │   ├── public.ts
    │   └── internal/
    └── package.json

## 132. Environment Access

Application code should not read arbitrary environment variables throughout the
codebase.

Preferred:

    config.apiBaseUrl

rather than:

    import.meta.env.VITE_API_BASE_URL

in dozens of files.

## 133. Feature Flags

Feature flags should:

- have explicit names;
- have defined owners;
- have lifecycle;
- default safely;
- not become permanent hidden architecture.

## 134. Experimental Code

Experimental features should be clearly isolated.

Do not mix experimental implementation with production-critical paths without
review.

## 135. Security-Critical Code

Security-sensitive modules should favor:

- explicit validation;
- minimal dependencies;
- small functions;
- strong types;
- detailed tests;
- structured errors;
- careful review.

Examples:

- IPC;
- artifact signing;
- filesystem;
- process execution;
- authentication.

## 136. Code Review Checklist

Reviewers should verify:

### TypeScript

- [ ] Strict typing is preserved.
- [ ] No unnecessary `any`.
- [ ] External data is validated.
- [ ] Types are not duplicated unnecessarily.
- [ ] No unsafe assertions.

### React

- [ ] Component responsibility is clear.
- [ ] Hooks are used correctly.
- [ ] Effects have justified dependencies.
- [ ] Accessibility is present.
- [ ] Server state is not copied into Zustand.

### Rust

- [ ] Ownership is idiomatic.
- [ ] Errors use `Result`.
- [ ] No unsafe panic path for user input.
- [ ] Filesystem/process boundaries are secure.
- [ ] Clippy is clean.

## 137. Error Review Checklist

- [ ] Error is structured.
- [ ] Stable code is used.
- [ ] Human message is separate.
- [ ] Retryability is defined.
- [ ] Sensitive data is not exposed.
- [ ] UI provides actionable recovery.
- [ ] Logs contain safe diagnostic context.

## 138. Logging Review Checklist

- [ ] Appropriate log level.
- [ ] Operation/request context included.
- [ ] No secrets.
- [ ] No unnecessary source content.
- [ ] No high-frequency uncontrolled logging.
- [ ] Structured fields used where supported.

## 139. Security Review Checklist

- [ ] Input validation.
- [ ] Authorization boundary preserved.
- [ ] Tenant context protected.
- [ ] IPC permissions unchanged or reviewed.
- [ ] Filesystem access scoped.
- [ ] Process arguments validated.
- [ ] Secrets excluded.
- [ ] Artifact boundary preserved.

## 140. Performance Review Checklist

- [ ] No obvious unnecessary renders.
- [ ] Large lists are bounded/virtualized.
- [ ] Telemetry updates are controlled.
- [ ] Large logs are handled incrementally.
- [ ] Binary data is not stored in React state.
- [ ] Query caching is appropriate.

## 141. Documentation Review Checklist

- [ ] Task documentation updated.
- [ ] Architecture documentation updated if needed.
- [ ] Protocol documentation updated if needed.
- [ ] ADR updated if needed.
- [ ] Comments explain non-obvious decisions.
- [ ] Deprecated behavior is documented.

## 142. Phase Mapping

| Phase | Code Style Focus |
|---|---|
| Phase 0 | Tooling, TypeScript, React, Rust baseline |
| Phase 1 | Auth, session, tenant-aware state |
| Phase 2 | IPC, filesystem, process, artifact security |
| Phase 3 | API client, contracts, realtime |
| Phase 4 | Booking/credit correctness |
| Phase 5 | Job/run lifecycle |
| Phase 6 | Lab/telemetry/safety boundaries |
| Phase 7 | WebRTC/results/performance |
| Phase 8 | Production hardening and cross-platform |

## 143. Phase 0

Establish:

- ESLint;
- Prettier;
- TypeScript strict mode;
- rustfmt;
- Clippy;
- shared package conventions;
- CI style gates.

No feature should establish a competing style system.

## 144. Phase 1

Enforce:

- auth abstraction;
- tenant-aware query keys;
- structured errors;
- secure session handling;
- no client-side authorization assumptions.

## 145. Phase 2

Enforce:

- typed IPC;
- explicit native operations;
- filesystem validation;
- process security;
- artifact boundary.

This phase has the highest native security sensitivity.

## 146. Phase 3

Enforce:

- contract-first API integration;
- structured protocol errors;
- WebSocket event validation;
- REST reconciliation.

## 147. Phase 4

Enforce:

- server-authoritative booking;
- server-authoritative credits;
- idempotent mutations;
- no unsafe optimistic financial state.

## 148. Phase 5

Enforce:

- canonical job/run states;
- event-driven synchronization;
- cancellation semantics;
- structured execution errors.

## 149. Phase 6

Enforce:

- Lab Agent boundary;
- telemetry rate control;
- offline/reconnect handling;
- explicit safety-state semantics.

## 150. Phase 7

Enforce:

- isolated WebRTC implementation;
- bounded telemetry rendering;
- result-state authority;
- performance discipline;
- accessibility and visual regression.

## 151. Phase 8

Enforce:

- full lint/format gates;
- security review;
- cross-platform validation;
- accessibility;
- performance;
- dependency governance;
- production logging policy.

## 152. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Inconsistent formatting | Medium | Automated formatter |
| Weak typing | High | Strict TypeScript |
| `any` propagation | High | Lint + review |
| State duplication | High | State ownership rules |
| Raw API calls | High | API client abstraction |
| Generic shell execution | Critical | Typed IPC only |
| Secret leakage | Critical | Security rules |
| Tenant leakage | Critical | Cache and auth review |
| Excessive logging | Medium | Structured logging |
| Rust panic | High | Result-based errors |
| Large components | Medium | Feature decomposition |
| Circular dependencies | Medium | Import boundaries |
| Protocol drift | Critical | Shared contracts |
| Performance regressions | High | Performance tests |
| Accessibility regressions | High | Automated + manual tests |

## 153. Open Questions

1. What exact ESLint configuration will become canonical?
2. Will Prettier remain the sole formatter?
3. What exact TypeScript version will be pinned?
4. What exact Rust version will be pinned?
5. What exact Clippy lint set will be enforced?
6. What exact logging library will be used in Rust?
7. What frontend logging abstraction will be standardized?
8. What exact schema-validation library will be adopted?
9. Will API clients be generated from OpenAPI?
10. Will IPC bindings be generated?
11. What exact import-boundary lint will be adopted?
12. What exact accessibility lint configuration will be mandatory?
13. What exact performance budgets will be enforced?
14. What exact security scanner will run in CI?
15. Which lint warnings may be downgraded?
16. What exact dependency update cadence will be used?
17. What exact architecture-review threshold will apply?
18. What exact Rust unsafe-code policy will be adopted?
19. What exact visual regression tooling will be standardized?
20. What exact code ownership model will be used?

## 154. Full Acceptance Criteria

### General

- [ ] Code style is documented.
- [ ] Naming conventions are documented.
- [ ] Folder conventions are documented.
- [ ] Architecture boundaries are documented.
- [ ] Security rules are documented.
- [ ] Review rules are documented.

### TypeScript

- [ ] Strict mode is enabled.
- [ ] `any` is minimized.
- [ ] `unknown` is used for untrusted data.
- [ ] Domain types are reused.
- [ ] External data is validated.
- [ ] Naming conventions are followed.
- [ ] Async operations handle errors.
- [ ] Type assertions are justified.
- [ ] No unsafe protocol parsing exists.

### React

- [ ] Components use clear responsibilities.
- [ ] Hooks follow React rules.
- [ ] Effects are justified.
- [ ] Accessibility is considered.
- [ ] Stable keys are used.
- [ ] Server state uses TanStack Query.
- [ ] UI state uses Zustand.
- [ ] Components do not contain raw API calls.
- [ ] Large components are decomposed appropriately.

### Rust

- [ ] Rust naming follows standard conventions.
- [ ] rustfmt passes.
- [ ] Clippy passes.
- [ ] Recoverable failures use `Result`.
- [ ] User input cannot trigger ordinary panic paths.
- [ ] Ownership is idiomatic.
- [ ] Filesystem access is scoped.
- [ ] Process execution is controlled.
- [ ] Native security boundaries are preserved.

### Errors

- [ ] Stable error codes are used.
- [ ] Human messages are separate.
- [ ] Raw backend messages are not used for control flow.
- [ ] Retryability is respected.
- [ ] Sensitive details are redacted.
- [ ] Errors have actionable UI behavior.

### Logging

- [ ] Structured logging is used.
- [ ] Log levels are appropriate.
- [ ] Request/operation context is preserved.
- [ ] Secrets are never logged.
- [ ] Source code is not unnecessarily logged.
- [ ] High-frequency logs are bounded.

### Security

- [ ] No secrets in frontend bundles.
- [ ] Authentication logic is centralized.
- [ ] Backend authorization remains authoritative.
- [ ] Tenant boundaries are preserved.
- [ ] IPC commands are typed.
- [ ] No generic shell execution exists.
- [ ] Filesystem paths are validated.
- [ ] Process arguments are controlled.
- [ ] Artifact security boundary is preserved.

### Formatting and Linting

- [ ] Prettier configuration is centralized.
- [ ] ESLint configuration is centralized.
- [ ] `.editorconfig` is provided.
- [ ] rustfmt is enforced.
- [ ] Clippy is enforced.
- [ ] CI runs formatting checks.
- [ ] CI runs lint checks.
- [ ] CI runs TypeScript checks.

### Review

- [ ] Architecture reviewed.
- [ ] Type safety reviewed.
- [ ] State ownership reviewed.
- [ ] Error handling reviewed.
- [ ] Logging reviewed.
- [ ] Security reviewed.
- [ ] Performance reviewed.
- [ ] Accessibility reviewed.
- [ ] Tests reviewed.
- [ ] Documentation reviewed.

## 155. Final Engineering Invariants

The following rules are mandatory:

1. TypeScript remains strict.
2. React components remain focused.
3. Zustand owns UI state, not server truth.
4. TanStack Query owns server state.
5. REST remains authoritative for durable state.
6. WebSocket events synchronize state but do not replace durable state.
7. API access uses typed clients.
8. IPC access uses typed commands.
9. Generic shell execution is prohibited.
10. Rust validates native-boundary input independently.
11. User input never becomes an unchecked shell command.
12. Recoverable Rust failures use structured errors.
13. Machine behavior never depends on human-readable error messages.
14. Logs never contain secrets.
15. Frontend configuration never contains private credentials.
16. Tenant context is never treated as authorization.
17. Artifact packaging remains an explicit security boundary.
18. Large binary data does not live in React state.
19. High-rate telemetry is bounded before rendering.
20. Architecture changes require documentation and review.

## 156. Final Code Quality Flow

The expected development flow is:

    Requirement
        |
        v
    Architecture
        |
        v
    Contract
        |
        v
    Types
        |
        v
    Implementation
        |
        v
    Tests
        |
        v
    Format
        |
        v
    Lint
        |
        v
    Typecheck
        |
        v
    Security Review
        |
        v
    Code Review
        |
        v
    CI
        |
        v
    Merge

Code style is therefore not a cosmetic concern.

It is part of the Kritva RaaS engineering architecture and exists to preserve
clarity, correctness, security, and long-term maintainability.

> **Write code that makes the architecture visible, the contracts explicit, the failure modes understandable, and the security boundaries difficult to violate.**
