# Kritva RaaS Frontend State Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Kritva RaaS Frontend State Architecture |
| Path | `docs/frontend/architecture/STATE_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service |
| Frontend | Kritva RaaS Studio + Web Console |
| UI Framework | React + TypeScript |
| UI State | Zustand |
| Server State | TanStack Query |
| Realtime | WebSocket + event integration |
| Local Native State | Rust Local Runtime through Tauri IPC |
| Persistence | Controlled local persistence |
| Status | Production Architecture Baseline |

## 2. Purpose

This document defines the production-grade state architecture for the Kritva
RaaS frontend.

The architecture covers both:

- Kritva RaaS Studio desktop application;
- Kritva RaaS Web Console.

The central design principle is:

> **UI state, server state, local-runtime state, and realtime state are
> different classes of state and must not be treated as one global store.**

The architecture therefore uses:

    React Components
          |
          +--------------------+
          |                    |
          v                    v
    Zustand UI State      TanStack Query
                               |
                               v
                         Server State
                               |
                         +-----+------+
                         |            |
                         v            v
                       REST       WebSocket
                         |            |
                         +-----+------+
                               |
                               v
                       Query Cache / UI

For Studio:

    React
      |
      +--> Zustand
      +--> TanStack Query
      +--> Realtime
      +--> Tauri IPC
                    |
                    v
              Rust Local Runtime

## 3. Scope

This document covers:

- frontend state classification;
- Zustand architecture;
- TanStack Query architecture;
- server-state caching;
- realtime event integration;
- query invalidation;
- query updates;
- optimistic updates;
- rollback;
- loading states;
- error states;
- session state;
- authentication state;
- organization context;
- project context;
- Studio local-runtime state;
- operation state;
- persistence;
- cache lifecycle;
- synchronization;
- offline/reconnect behavior;
- state ownership;
- selectors;
- performance;
- testing;
- Phase 0–8 implementation mapping.

It applies to:

- Studio;
- Web Console;
- shared UI packages;
- shared frontend API client.

## 4. Goals

The state architecture shall:

1. maintain a clear ownership model;
2. prevent duplicate sources of truth;
3. keep server state in TanStack Query;
4. keep transient UI state in Zustand;
5. integrate realtime events with server-state caches;
6. support session lifecycle;
7. support organization switching;
8. support project context;
9. support long-running jobs;
10. support live run state;
11. support booking state;
12. support credits;
13. support results;
14. support Studio local operations;
15. provide predictable loading and error states;
16. support optimistic updates only where safe;
17. support cache invalidation;
18. support reconnect and reconciliation;
19. minimize unnecessary rendering;
20. remain testable and observable.

## 5. Non-Goals

This architecture does not:

- replace backend persistence;
- make Zustand a database;
- make WebSocket state authoritative;
- duplicate PostgreSQL state in the browser;
- implement authentication itself;
- provide physical robot safety;
- make optimistic UI authoritative for financial operations;
- persist arbitrary sensitive application state.

## 6. State Classification

Every piece of frontend state must belong to a defined category.

| State | Primary Owner |
|---|---|
| Modal visibility | Zustand |
| Sidebar state | Zustand |
| Theme | Zustand |
| Selected project ID | Zustand |
| Current workspace tab | Zustand |
| Form draft | Local component state/Zustand |
| API project data | TanStack Query |
| Platform catalogue | TanStack Query |
| Booking data | TanStack Query |
| Credit balance | TanStack Query |
| Job status | TanStack Query + realtime |
| Run telemetry | Specialized realtime state |
| Session | Auth/session state |
| Local build operation | Zustand + Tauri runtime |
| Remote artifact | TanStack Query |
| Remote result | TanStack Query |
| Realtime connection status | Zustand |
| Notifications | Zustand |
| Cached server data | TanStack Query |

## 7. State Ownership Principle

A state value should have exactly one authoritative frontend owner.

For example:

    Project Details
        |
        v
    TanStack Query

not:

    Project Details
       |
       +--> Zustand
       +--> TanStack Query
       +--> Component State

unless there is a deliberate distinction between:

- persisted server value;
- temporary editing value.

## 8. Server State versus UI State

Server state is:

- remotely owned;
- asynchronous;
- cacheable;
- potentially stale;
- shared between screens.

UI state is:

- local to the application;
- generally synchronous;
- interaction-driven;
- temporary;
- not authoritative outside the frontend.

Examples:

    "Project name from server"
        = server state

    "Project name currently typed into form"
        = UI/form state

## 9. Zustand Responsibility

Zustand owns application UI state that does not belong in the server cache.

Primary areas:

- navigation;
- layout;
- selected context;
- dialogs;
- filters where local;
- notifications;
- connection state;
- local-runtime operation state;
- Studio preferences;
- ephemeral interaction state.

Zustand must not become a replacement for TanStack Query.

## 10. TanStack Query Responsibility

TanStack Query owns remote server state.

Examples:

- users;
- organizations;
- projects;
- platforms;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- results;
- experiments.

It provides:

- caching;
- deduplication;
- fetching;
- stale state;
- refetch;
- mutation lifecycle;
- retry;
- invalidation.

## 11. Realtime Responsibility

WebSocket events provide changes and notifications.

They do not become a second independent database.

The preferred model is:

    REST
      |
      v
    TanStack Query
      ^
      |
    WebSocket Events

Realtime events update or invalidate the relevant query cache.

## 12. Authority Hierarchy

The authority model is:

    Backend Database
          |
          v
    REST/API State
          |
          v
    TanStack Query Cache
          |
          v
    React UI

Realtime events provide timely synchronization:

    WebSocket
        |
        v
    Query Cache Update/Invalidation
        |
        v
    React UI

Zustand is not authoritative for server business data.

## 13. Store Architecture

The Zustand layer should use focused stores rather than one monolithic
application store.

Recommended logical stores:

    useUiStore
    useNavigationStore
    useSessionStore
    useContextStore
    useRealtimeStore
    useNotificationStore
    useStudioRuntimeStore
    usePreferencesStore

The exact number may evolve, but ownership must remain clear.

## 14. UI Store

`useUiStore` may contain:

- sidebar state;
- modal state;
- drawer state;
- command palette;
- global loading overlays;
- responsive layout state;
- theme-related UI state.

It must not contain API resource objects.

## 15. Navigation Store

Navigation state may contain:

- current application area;
- selected project;
- selected tab;
- route-level UI preferences.

The URL remains authoritative for navigable Web Console state where appropriate.

Zustand should not duplicate the complete router state.

## 16. Context Store

`useContextStore` may hold:

- active organization ID;
- active project ID;
- active platform context where appropriate.

Context values are identifiers, not complete server objects.

Example:

    activeOrganizationId = "org-001"
    activeProjectId = "project-001"

The corresponding objects come from TanStack Query.

## 17. Session Store

Session state represents the local authentication/session lifecycle.

It may include:

- authenticated/unauthenticated state;
- user identity reference;
- authentication initialization state;
- session expiration state;
- organization context;
- logout state.

Sensitive token material should not be exposed unnecessarily to React state.

## 18. Authentication Authority

The authentication subsystem owns credential/token handling.

The frontend state layer should consume an abstract session interface.

Example:

    session.status
    session.user
    session.organization
    session.expiration

The exact token storage mechanism follows the authentication architecture.

## 19. Session Lifecycle

    APPLICATION_START
          |
          v
    SESSION_INITIALIZING
          |
       +--+--+
       |     |
       v     v
    AUTHENTICATED   UNAUTHENTICATED
       |
       v
    SESSION_ACTIVE
       |
       v
    EXPIRING / EXPIRED
       |
       +--> REFRESH
       |
       +--> LOGOUT

The UI must not briefly display protected application content while session
state is still being initialized.

## 20. Session Bootstrap

Application startup:

    Start Application
        |
        v
    Initialize Session
        |
        v
    Resolve Identity
        |
        v
    Resolve Organization Context
        |
        v
    Initialize Query Client
        |
        v
    Initialize Realtime
        |
        v
    Render Application

Ordering may be optimized, but unauthorized requests must not be issued
unnecessarily.

## 21. Session Expiration

When a session expires:

    API / Auth Event
          |
          v
    Session State
          |
          v
    SESSION_EXPIRED
          |
          +--> Refresh if permitted
          |
          +--> Login if refresh fails
          |
          v
    Query Cache Policy

Protected server cache data must not remain visibly usable as though the
session were still active.

## 22. Logout

Logout should:

1. terminate authentication;
2. close realtime connection;
3. clear protected query caches;
4. clear organization/project context;
5. clear transient sensitive state;
6. return the UI to the unauthenticated route.

Public cache data may be retained only if explicitly classified as public.

## 23. Organization Context

Kritva RaaS supports organization-based tenancy.

The active organization ID is frontend context.

Changing organization requires:

    Change Organization
        |
        v
    Update Context
        |
        v
    Close/Rebind Realtime
        |
        v
    Invalidate Tenant Queries
        |
        v
    Load New Organization Data

Cached data from the previous organization must not leak into the new context.

## 24. Query Key Design

Query keys must encode all dimensions that affect server state.

Example:

    ["projects", organizationId]

For project:

    ["project", organizationId, projectId]

For platform:

    ["platforms", platformFilter]

For bookings:

    ["bookings", organizationId, filters]

For credits:

    ["creditBalance", organizationId, platformId]

## 25. Query Key Rules

Query keys shall be:

- deterministic;
- serializable;
- stable;
- sufficiently scoped;
- tenant-aware where required.

Avoid:

    ["projects"]

when projects are organization-scoped.

Prefer:

    ["projects", organizationId, filters]

## 26. Query Key Factory

Shared query-key factories should be used.

Conceptual:

    projectKeys.all()
    projectKeys.list(orgId, filters)
    projectKeys.detail(orgId, projectId)

This prevents inconsistent cache addressing across features.

## 27. Tenant Isolation in Cache

Tenant identity is part of cache identity.

The frontend must never assume that a query cache can safely be reused across
organizations without explicit verification.

This is a defense-in-depth measure; backend authorization remains authoritative.

## 28. Project Context

Project selection should store only:

    activeProjectId

The project object is fetched through TanStack Query.

When the selected project is unavailable:

    activeProjectId
        |
        v
    Query
        |
        +--> NOT_FOUND
        |
        v
    Clear Context / Show Recovery

## 29. Query Client

A single TanStack Query client should normally serve the application runtime.

The client owns:

- query cache;
- mutation cache;
- default retry behavior;
- stale-time policy;
- garbage collection;
- query cancellation.

Separate clients should only be introduced for deliberate isolation boundaries.

## 30. Query Defaults

Defaults should be conservative.

General policy:

- do not refetch unnecessarily;
- use domain-specific stale times;
- retry transient failures;
- avoid retrying authorization errors;
- avoid retrying deterministic validation errors.

## 31. Stale Time

Different domains require different freshness.

| Data | Typical Policy |
|---|---|
| Platform catalogue | Long |
| Project metadata | Medium |
| Booking availability | Short |
| Credit balance | Short |
| Job status | Very short/realtime |
| Results | Medium |
| Static configuration | Long |

Exact values should be tuned using production measurements.

## 32. Cache Time

Unused query data should eventually be garbage-collected.

Long-lived caches should be justified by:

- navigation patterns;
- offline requirements;
- data cost;
- privacy.

The frontend must not retain sensitive data indefinitely.

## 33. Cache Invalidation

Invalidation should occur when:

- mutation succeeds;
- realtime event indicates change;
- tenant context changes;
- session changes;
- resource becomes stale;
- explicit refresh is requested.

Example:

    project.updated
        |
        v
    invalidate ["project", orgId, projectId]
        |
        v
    Refetch

## 34. Direct Cache Update

When an event contains the complete updated representation, the cache may be
updated directly.

Example:

    job.updated
        |
        v
    setQueryData(["job", orgId, jobId], updatedJob)

This avoids an unnecessary request.

## 35. Invalidate versus Update

Use direct update when:

- event payload is authoritative;
- payload contains sufficient fields;
- schema is compatible.

Use invalidation when:

- event contains only a notification;
- payload is partial;
- related queries may also change;
- server-calculated data may have changed.

## 36. Realtime Integration

The realtime architecture is:

    WebSocket
        |
        v
    Event Decoder
        |
        v
    Authorization/Context Check
        |
        v
    Event Router
        |
        +--> Query Update
        +--> Query Invalidation
        +--> Zustand Notification
        +--> Realtime Status
        |
        v
    React

## 37. Event Router

The Event Router maps event names to state actions.

Example:

    job.running
        |
        +--> update job query
        +--> update runs query if necessary
        +--> notify execution screen

The event router should not contain presentation-specific logic.

## 38. Event-to-Query Mapping

| Event | Primary Action |
|---|---|
| `project.created` | Invalidate project list |
| `project.updated` | Update/invalidate project detail |
| `artifact.uploaded` | Invalidate artifact list |
| `booking.confirmed` | Update booking |
| `credit.consumed` | Invalidate/update balance |
| `job.running` | Update job |
| `job.completed` | Update job + invalidate results |
| `run.metrics.updated` | Update live run state |
| `result.available` | Invalidate result list |
| `agent.offline` | Update platform/resource state |

## 39. Event Context Validation

Before applying a realtime event, the client should verify:

- organization context;
- resource identity;
- event type;
- protocol version;
- expected schema.

Events belonging to another organization must not update the active cache.

## 40. Realtime Connection State

`useRealtimeStore` may represent:

    DISCONNECTED
    CONNECTING
    CONNECTED
    RECONNECTING
    AUTHENTICATING
    FAILED

Connection state is UI/application state, not business state.

## 41. Reconnect

Reconnect flow:

    Connection Lost
        |
        v
    RECONNECTING
        |
        v
    AUTHENTICATE
        |
        v
    SUBSCRIBE
        |
        v
    RECONCILE
        |
        v
    CONNECTED

Reconciliation is required because events may have been missed.

## 42. Reconciliation

After reconnect:

    WebSocket Connected
         |
         v
    Reconcile Critical Queries
         |
         +--> Jobs
         +--> Bookings
         +--> Credits
         +--> Active Runs
         |
         v
    Resume Realtime

REST/query state is authoritative during reconciliation.

## 43. Realtime Failure

Realtime failure should not automatically make the entire application
unusable.

For example:

    WebSocket FAILED
        |
        +--> show degraded realtime status
        +--> continue REST operations
        +--> poll critical state if required

The UI must distinguish degraded realtime from complete backend outage.

## 44. High-Frequency Telemetry

Robot telemetry should not necessarily enter the normal TanStack Query cache
at full frequency.

Preferred:

    WebSocket / Telemetry Stream
            |
            v
    Telemetry Buffer
            |
            v
    Throttled UI State
            |
            v
    Charts / Robot Visualization

Durable run metrics remain server state.

## 45. Live Run State

Live run state can contain:

- current status;
- current telemetry snapshot;
- connection status;
- latest metrics;
- recent logs;
- video connection state.

High-frequency transient values may use a specialized Zustand store or local
buffer rather than replacing durable query state.

## 46. Durable versus Transient Run Data

| Data | Owner |
|---|---|
| Run identity | TanStack Query |
| Run status | TanStack Query + realtime |
| Final metrics | TanStack Query |
| Historical result | TanStack Query |
| Current telemetry sample | Realtime transient state |
| Video connection | UI/realtime state |
| Recent log window | Transient state |
| Final logs | Server state |

## 47. Optimistic Updates

Optimistic updates are permitted only where:

- failure is recoverable;
- user expectation is clear;
- rollback is reliable;
- operation is not financially or physically dangerous.

Examples:

- local preference changes;
- UI settings;
- project draft changes where server semantics are simple.

## 48. Restricted Optimistic Updates

Avoid optimistic updates for:

- credit consumption;
- refunds;
- booking confirmation;
- job start;
- job stop;
- robot safety actions;
- resource allocation.

These operations require server confirmation.

## 49. Booking Mutation

Booking flow:

    User Submit
        |
        v
    booking.create
        |
        v
    SERVER VALIDATION
        |
        +--> success
        |      |
        |      v
        |   cache update
        |
        +--> conflict
               |
               v
          show current availability

The UI must not represent a booking as confirmed before server acceptance.

## 50. Credit Consumption

Credits are financial/business state.

Therefore:

    Start Job
        |
        v
    Server Quote / Validation
        |
        v
    Server Consumption
        |
        v
    Confirmed Balance
        |
        v
    Query Update

The frontend must not locally subtract credits as an authoritative operation.

## 51. Job Start

Job start is not optimistically treated as `RUNNING`.

Preferred:

    job.start
        |
        v
    ACCEPTED / QUEUED
        |
        v
    job.queued
        |
        v
    job.starting
        |
        v
    job.running

This preserves backend execution semantics.

## 52. Optimistic UI for Non-Server State

A button may optimistically change local interaction state:

    SUBMITTING
        |
        v
    DISABLED

while server state remains unchanged until the response arrives.

This distinction is encouraged.

## 53. Mutation Lifecycle

Generic mutation flow:

    User Action
        |
        v
    Validate Local Input
        |
        v
    Mutation
        |
        +--> Pending
        |
        +--> Success
        |      |
        |      v
        |   Cache Update/Invalidate
        |
        +--> Error
               |
               v
            Error State

## 54. Mutation Deduplication

Mutations should be protected against accidental double submission.

For critical commands:

- disable UI while pending;
- use backend idempotency where applicable;
- preserve request identity;
- reconcile final state.

The frontend must not rely solely on button disabling.

## 55. Loading State Model

Loading should distinguish:

    INITIAL_LOADING
    FETCHING
    REFRESHING
    MUTATING
    RECONNECTING
    LOCAL_OPERATION

A screen already containing data should generally show `REFRESHING` rather
than replacing the entire screen with a blank spinner.

## 56. Skeletons

Skeleton UI is appropriate for:

- initial dashboard;
- project list;
- platform list;
- results list.

Skeletons should not appear repeatedly during every background refetch.

## 57. Empty State

Empty state means:

> The request succeeded and there is no data.

It is different from:

    loading
    error
    unauthorized
    unavailable

Examples:

    No Projects
    No Bookings
    No Results
    No Artifacts

## 58. Error State

Error state should distinguish:

- authentication;
- authorization;
- validation;
- conflict;
- unavailable;
- timeout;
- unknown.

The UI should provide appropriate recovery actions.

## 59. Retry

Retry should be automatic only for transient failures.

Suitable examples:

- network interruption;
- temporary service unavailable;
- realtime reconnect.

Avoid automatic retries for:

- invalid request;
- forbidden;
- not found;
- booking conflict;
- insufficient credits.

## 60. Query Cancellation

Queries should be cancellable when:

- route changes;
- project context changes;
- user leaves the screen;
- a newer query supersedes an old one.

This reduces unnecessary work and stale UI updates.

## 61. Query Prefetching

Prefetching may be used for predictable navigation.

Examples:

    Projects List
        |
        +--> prefetch likely Project Detail

    Platform List
        |
        +--> prefetch Platform Detail

Prefetching must not create uncontrolled API traffic.

## 62. Cache Hydration

The application may hydrate safe cache state from persistence.

Hydration sequence:

    Persisted Cache
        |
        v
    Validate Metadata
        |
        v
    Restore Eligible Queries
        |
        v
    Revalidate Stale Data

Sensitive or tenant-bound data requires stricter rules.

## 63. Persistence Strategy

Persist only state that provides meaningful UX benefit.

Potential persisted state:

- theme;
- layout preferences;
- recent project ID;
- non-sensitive Studio preferences;
- selected toolchain preference.

Potentially persisted query cache must be carefully scoped and encrypted or
otherwise protected where sensitive.

## 64. State That Must Not Be Persisted

Do not persist casually:

- access tokens;
- refresh tokens in ordinary storage;
- private signing keys;
- credentials;
- raw source code in global state;
- high-frequency telemetry;
- transient process handles.

## 65. Studio Local Runtime State

Studio needs state for local operations.

Recommended:

    useStudioRuntimeStore

It may track:

- runtime availability;
- active operation IDs;
- operation state;
- current workspace;
- local toolchain status;
- local build status;
- local test status.

The actual authoritative operation state remains Rust Local Runtime state.

## 66. Local Runtime Synchronization

Flow:

    Rust Local Runtime
          |
          v
    Tauri Event
          |
          v
    Studio Runtime Store
          |
          v
    React UI

If an event is missed:

    useStudioRuntimeStore
          |
          v
    runtime.status query
          |
          v
    Reconcile

## 67. Local Operation Cache

Local operation state is not server state.

Therefore it should not be forced into TanStack Query merely because it has
a query-like lifecycle.

Zustand is appropriate for active local operation coordination.

## 68. Form State

Form state should normally remain local to the form.

Examples:

- project creation form;
- booking form;
- settings form;
- artifact configuration form.

Only submit validated values to server mutations.

## 69. Draft State

Long-lived drafts may use Zustand if they span multiple components or steps.

Otherwise:

    Component Local State

is preferred.

Do not put every input field into the global Zustand store.

## 70. Filters

Filters can be:

- URL state for navigable Web Console pages;
- local component state for temporary filters;
- Zustand for cross-component persistent UI filters.

The URL should be preferred when users expect bookmarkable/shareable state.

## 71. Pagination

Server pagination remains in TanStack Query.

Query keys include:

- filter;
- sort;
- cursor;
- organization;
- project where applicable.

Do not copy complete paginated datasets into Zustand.

## 72. Infinite Queries

Infinite queries may be used for:

- logs;
- result history;
- artifact history;
- activity feeds.

High-volume streams should not be modeled as unbounded browser memory.

## 73. Cache Eviction

Cache eviction should occur when:

- data is unused;
- tenant changes;
- logout occurs;
- resource becomes obsolete;
- memory pressure requires cleanup.

Explicit cache clearing should be part of security-sensitive lifecycle events.

## 74. Cache Invalidation on Logout

On logout:

    QueryClient.clear()
          |
          v
    Protected Server State Removed

The exact mechanism may use selective removal if public state is intentionally
retained.

## 75. Cache Invalidation on Organization Switch

On organization switch:

    Previous Organization
          |
          v
    Clear/Invalidate Tenant Cache
          |
          v
    Set New Organization
          |
          v
    Fetch New Tenant State

The UI must not briefly display old tenant data under the new tenant context.

## 76. Query Error Boundaries

Critical route-level queries may use error boundaries.

Recoverable component-level queries may display local error states.

The goal is to prevent one failed widget from taking down the entire
application.

## 77. Global Error Handling

Global error handling should cover:

- uncaught application errors;
- authentication expiration;
- backend outage;
- realtime failure;
- runtime failure.

It must not replace local domain-specific error presentation.

## 78. Notifications

Notifications are UI state.

`useNotificationStore` may contain:

- ID;
- severity;
- title;
- message;
- timestamp;
- dismissal state.

Notifications should not be used as the sole representation of important
server state.

## 79. Server Events and Notifications

An event may generate both:

    job.failed
        |
        +--> update job cache
        |
        +--> notification

The cache update is authoritative UI state synchronization.

The notification is merely user feedback.

## 80. Realtime Event Deduplication

Events should be deduplicated by `event_id` where required.

The client may maintain a bounded recent-event identity set.

The deduplication cache must not grow indefinitely.

## 81. Realtime Ordering

If events arrive out of order:

    event.sequence

may be used where available.

For critical business state, the client should reconcile with REST rather than
trying to reconstruct authoritative state entirely from events.

## 82. Event Replay

If the realtime service supports replay:

    last_event_id / sequence
            |
            v
        reconnect
            |
            v
        replay
            |
            v
        reconcile

Replay is an optimization.

REST remains authoritative.

## 83. Connection Indicators

The UI should distinguish:

    ONLINE
    RECONNECTING
    OFFLINE
    DEGRADED

For a live run, connection state should be visible without incorrectly
representing the robot itself as stopped.

## 84. Remote Job State

Remote job lifecycle:

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

TanStack Query stores the durable job record.

Realtime events accelerate updates.

## 85. Run State

Run state follows the backend lifecycle.

The frontend must not invent intermediate terminal states.

For example:

    RUNNING -> COMPLETED

must come from server state or authoritative event processing.

## 86. Results State

Results are server state.

Use:

    ["results", organizationId, projectId, filters]

for result lists.

Individual result:

    ["result", organizationId, resultId]

Result availability events invalidate or update the corresponding queries.

## 87. Artifact State

Artifacts are server state after upload.

Local artifact state belongs to Studio Runtime state.

The distinction is:

    Local `.krv`
        = local runtime state

    Registered remote artifact
        = server state

## 88. Platform State

Platform catalogue is server state.

Platform selection is UI/context state.

Example:

    selectedPlatformId
        = Zustand / route state

    platform details
        = TanStack Query

## 89. Booking State

Booking form:

    local/form state

Booking record:

    TanStack Query

Booking lifecycle events:

    realtime -> query cache

Booking availability:

    short-lived TanStack Query cache

## 90. Credit State

Credit balance is server state.

Credit transactions are server state.

Credit UI filters may be local state.

Credit consumption must be reconciled with server-confirmed state.

## 91. Session and Query Coordination

When session changes:

    Session
      |
      +--> Query enable/disable
      +--> Cache clear
      +--> Realtime connect/disconnect
      +--> Context reset

The query layer must not continue protected requests after logout.

## 92. Query Enable Conditions

Protected queries should require:

    authenticated
        &&
    organization selected
        &&
    required route/context available

This prevents invalid requests during application initialization.

## 93. Suspense Policy

Suspense may be used selectively.

It should not obscure critical error or loading distinctions.

Production pages should have predictable loading boundaries.

## 94. State Selectors

Zustand selectors should be narrow.

Prefer:

    useUiStore(state => state.sidebarOpen)

rather than subscribing to the complete store.

This reduces unnecessary renders.

## 95. Query Selectors

TanStack Query consumers should use `select` or equivalent transformation
where useful to avoid unnecessary component updates.

Components should consume the smallest useful representation.

## 96. Derived State

Derived values should generally be calculated rather than duplicated.

Example:

    remainingCredits
        = balance - reserved

should not be stored independently if it can be safely derived from current
server state.

Duplicated derived state creates synchronization risk.

## 97. State Normalization

TanStack Query generally provides resource-level caching.

Do not build a custom normalized global entity store unless production
requirements demonstrate a clear need.

The default architecture favors query-key isolation and server ownership.

## 98. Performance Strategy

Performance controls include:

- narrow Zustand selectors;
- query caching;
- request deduplication;
- bounded realtime buffers;
- virtualized long lists;
- lazy routes;
- selective prefetch;
- throttled telemetry;
- event batching.

## 99. Large Lists

Potentially large lists include:

- jobs;
- runs;
- results;
- artifacts;
- audit records;
- logs.

Use:

- pagination;
- cursor APIs;
- virtualization;
- bounded client cache.

Never load unlimited history into a single browser state structure.

## 100. Telemetry Rendering

High-frequency telemetry should be throttled for presentation.

Example:

    1000 samples/sec
          |
          v
    telemetry buffer
          |
          v
    10-30 UI updates/sec
          |
          v
    chart

Exact rates depend on visualization requirements.

## 101. Video State

Video connection state is UI/realtime state.

The video stream itself should not be stored in Zustand or TanStack Query.

The state contains:

- connecting;
- connected;
- reconnecting;
- failed;
- stopped.

## 102. Local Build Logs

Build logs are transient local state.

The runtime may retain a bounded log buffer.

The UI should virtualize long logs and avoid copying the entire log into global
state repeatedly.

## 103. State Persistence in Studio

Studio preferences may be persisted locally.

Examples:

- selected theme;
- sidebar width;
- preferred build profile;
- recent project references.

The persisted state must be versioned.

## 104. Persistence Migration

Persisted state should include a schema version.

Example:

    {
        "schema_version": 2,
        "preferences": {}
    }

Unknown or incompatible persisted state should be safely discarded or migrated.

## 105. Browser Storage

Web Console persistence must account for:

- browser storage limits;
- multi-tab behavior;
- logout;
- tenant isolation;
- XSS implications.

Sensitive authentication material should use the dedicated authentication
architecture rather than arbitrary Zustand persistence.

## 106. Multi-Tab Behavior

Web Console may run in multiple tabs.

Important state includes:

- session;
- organization;
- realtime connection;
- mutations.

Cross-tab synchronization may be required for:

- logout;
- session expiry;
- organization changes.

A single tab should not be assumed to be the only application instance.

## 107. Studio Single Instance

Studio may initially operate as a single desktop application instance.

If multiple instances are later supported, workspace locking and state
synchronization must be revisited.

## 108. State Debugging

Development tooling may inspect:

- Zustand state;
- query cache;
- realtime connection;
- operation IDs.

Production builds must not expose sensitive state through developer tooling.

## 109. Observability

State-related telemetry may include:

- query failure counts;
- mutation failure counts;
- realtime reconnect count;
- cache hit/miss where measurable;
- operation durations;
- local build failures.

Do not transmit source code or credentials.

## 110. State and Audit

Business audit records remain server-owned.

Frontend state transitions are not authoritative audit records.

For example:

    User clicks "Start Job"
        |
        v
    Frontend mutation
        |
        v
    Backend audit record

The frontend cannot create authoritative audit entries by itself.

## 111. State Synchronization Flow

General server workflow:

    User Action
        |
        v
    Mutation
        |
        v
    Backend
        |
        +--> Response
        |
        +--> Event
        |
        v
    Query Cache
        |
        v
    React

This ensures response and event paths converge on one state model.

## 112. Realtime Synchronization Flow

    Backend State Change
          |
          +--> WebSocket Event
          |
          v
    Event Router
          |
          +--> setQueryData
          |
          +--> invalidateQueries
          |
          +--> UI Notification
          |
          v
    React

## 113. Error Recovery Flow

    Query Error
        |
        v
    Classify Error
        |
        +--> Auth
        +--> Forbidden
        +--> Conflict
        +--> Network
        +--> Validation
        |
        v
    Recovery Action
        |
        +--> Login
        +--> Retry
        +--> Refresh
        +--> Correct Input
        +--> Reconcile

## 114. Stale Data Indication

The UI should be able to distinguish:

    FRESH
    STALE
    REFRESHING
    OFFLINE

Stale data may remain visible while a refresh is in progress.

This is preferable to unnecessary blank-screen transitions.

## 115. Offline Behavior

The application should distinguish:

- offline UI;
- stale cached data;
- unavailable backend;
- realtime disconnected.

Offline support does not imply full offline business operation.

Financial, booking, and execution operations require backend confirmation.

## 116. Offline Mutation Policy

Default:

    Offline
       |
       +--> local UI changes allowed
       |
       +--> server mutations blocked/queued only if explicitly designed
       |
       +--> booking/job/credit operations not silently queued

The initial RaaS architecture should prefer explicit retry over hidden offline
mutation queues for critical operations.

## 117. Reconnect Mutation Handling

After reconnect:

- do not automatically repeat uncertain financial/resource operations unless
  idempotency guarantees are available;
- query authoritative state;
- reconcile pending UI actions.

This avoids duplicate bookings or job starts.

## 118. Query Retry Policy

Retry should use bounded attempts and backoff.

Retry should consider:

- HTTP status;
- application error code;
- network error;
- request type.

Do not retry permanent failures indefinitely.

## 119. Mutation Retry Policy

Mutation retries are more restrictive than query retries.

A mutation may be retried automatically only when:

- request is idempotent;
- backend supports idempotency;
- failure is clearly transient.

Otherwise surface the uncertain state and reconcile.

## 120. Idempotency Integration

Critical frontend mutations should supply idempotency keys where required by
the API architecture.

Examples:

- booking creation;
- artifact upload;
- job start;
- credit-related operations.

The frontend must preserve the idempotency key across retries of the same
logical operation.

## 121. Optimistic Rollback

Where optimistic updates are permitted:

    Current State
        |
        v
    Snapshot
        |
        v
    Optimistic Update
        |
        v
    Mutation
       / \
      /   \
 success   failure
    |         |
    v         v
 commit    rollback

Rollback must restore the correct previous state.

## 122. Server Reconciliation

Even after mutation success, the frontend may invalidate the query if the
server computes additional fields.

Example:

    booking.create
        |
        v
    Success
        |
        v
    invalidate booking + availability

This avoids assumptions about server-side allocation.

## 123. Cache Consistency

Consistency strategy:

    Strongest
       |
       v
    Backend
       |
       v
    API Response
       |
       v
    Realtime Event
       |
       v
    Query Cache
       |
       v
    UI

The UI should be designed to tolerate eventual synchronization between events
and query refresh.

## 124. Phase Mapping

| Phase | State Architecture Scope |
|---|---|
| Phase 0 | State foundations |
| Phase 1 | Session/UI state |
| Phase 2 | Build/artifact/local operation state |
| Phase 3 | Server query state |
| Phase 4 | Booking/credit state |
| Phase 5 | Job/run state |
| Phase 6 | Lab/platform realtime |
| Phase 7 | Live telemetry/results |
| Phase 8 | Production hardening |

## 125. P0 FOUNDATION

Implement:

- Zustand foundation;
- QueryClient;
- query-key conventions;
- state classification;
- error/loading model;
- contract integration.

Acceptance:

- no uncontrolled global state;
- server state uses TanStack Query;
- UI state uses explicit Zustand ownership.

## 126. P1 STUDIO — Session and UI

Implement:

- session state;
- organization context;
- navigation state;
- layout state;
- preferences;
- authentication transitions.

Acceptance:

- login/logout correctly controls protected state;
- tenant switching clears/rebinds state.

## 127. P2 BUILD & ARTIFACT — Local Development

Implement:

- local runtime state;
- toolchain status;
- build operations;
- test operations;
- artifact packaging state;
- log stream state.

Acceptance:

    Build
      |
      v
    Test
      |
      v
    Artifact

is represented without placing local operation data in server query caches.

## 128. P3 CONTROL PLANE

Implement:

- projects query;
- platforms query;
- artifacts query;
- API mutations;
- cache invalidation;
- query error handling.

Acceptance:

- server data is not duplicated in Zustand.

## 129. P4 BOOKING & COMMERCIAL — Booking and Credits

Implement:

- availability queries;
- booking queries/mutations;
- credit balance;
- credit transactions;
- realtime booking/credit updates.

Acceptance:

- booking and credit state are server-confirmed;
- no unsafe optimistic financial state.

## 130. P5 EXECUTION

Implement:

- job queries;
- run queries;
- job mutations;
- execution event routing;
- status reconciliation.

Acceptance:

    job.start
        |
        v
    server state
        |
        v
    realtime
        |
        v
    query cache

## 131. P6 LAB & ROBOT

Implement:

- platform/resource state;
- lab health;
- agent events;
- resource availability;
- compatibility status.

Acceptance:

- lab events correctly update relevant query state;
- offline lab state is distinguishable.

## 132. P7 LIVE & RESULTS

Implement:

- live run state;
- telemetry buffering;
- video state;
- live logs;
- result queries;
- result availability events.

Acceptance:

- high-frequency telemetry does not overload the main query cache;
- final results remain server state.

## 133. P8 PRODUCTION

Complete:

- cache policy tuning;
- performance profiling;
- multi-tab handling;
- reconnect reliability;
- security review;
- state persistence migration;
- error recovery;
- observability;
- production E2E.

## 134. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Duplicate sources of truth | High | Explicit state ownership |
| Zustand becomes server cache | High | Query architecture rules |
| Stale data | Medium | Realtime + invalidation |
| Event loss | High | REST reconciliation |
| Tenant data leakage | Critical | Tenant-scoped query keys/cache clearing |
| Optimistic financial state | Critical | Server-confirmed mutations |
| Cache memory growth | Medium | GC/pagination/bounds |
| Realtime flood | High | Buffer/throttle |
| Session leakage | Critical | Cache clearing on logout |
| Mutation duplication | High | Idempotency |
| UI desynchronization | High | Query reconciliation |
| Cross-tab inconsistency | Medium | Explicit synchronization |

## 135. Risk — Duplicate State

If project data exists in Zustand and TanStack Query, one may become stale.

Mitigation:

> Resource data belongs to TanStack Query.

Zustand stores only resource identifiers/context where necessary.

## 136. Risk — Event Loss

WebSocket delivery may fail.

Mitigation:

- event IDs;
- resource sequences where available;
- REST reconciliation;
- reconnect query refresh;
- authoritative backend state.

## 137. Risk — Tenant Leakage

Old organization data may remain in cache.

Mitigation:

- organization in query keys;
- clear/invalidate on organization switch;
- clear protected cache on logout;
- validate event context.

## 138. Risk — Unsafe Optimistic Updates

A booking or job may fail after optimistic UI.

Mitigation:

- no optimistic confirmation for critical operations;
- server-confirmed lifecycle;
- backend idempotency;
- explicit pending states.

## 139. Risk — Realtime Flood

Telemetry and logs may produce excessive updates.

Mitigation:

- dedicated transient buffers;
- batching;
- throttling;
- virtualization;
- bounded history.

## 140. Risk — Session Race

A query may start while logout or session expiry occurs.

Mitigation:

- query enable conditions;
- abort/cancel;
- auth-aware API client;
- cache clearing;
- session lifecycle coordination.

## 141. Open Questions

1. What exact Zustand store decomposition will be used?
2. Which stores will use persistence?
3. Which persistence mechanism will be standardized?
4. What exact TanStack Query version will be pinned?
5. What exact stale-time values will be production defaults?
6. What exact cache garbage-collection policy will be used?
7. Which queries require realtime invalidation?
8. Which events contain enough data for direct cache updates?
9. What exact telemetry update rate will the UI support?
10. Will telemetry use a dedicated Zustand store?
11. Which query caches are safe to persist?
12. What exact multi-tab synchronization mechanism will be used?
13. What exact session bootstrap sequence will be implemented?
14. How will organization switching synchronize with realtime subscriptions?
15. Which mutations may use optimistic updates?
16. Which mutations require mandatory idempotency keys?
17. How long should notification state remain available?
18. What exact event deduplication window will be used?
19. What exact reconnect reconciliation set is mandatory?
20. What exact offline functionality will be supported in P0?
21. How will persisted state schemas be migrated?
22. What telemetry metrics will be retained locally?
23. What exact query error boundary strategy will be standardized?
24. What performance thresholds will become release gates?
25. What exact cache-clearing guarantees are required for logout?

## 142. Full Acceptance Criteria — State Ownership

- [ ] Every state category has an explicit owner.
- [ ] UI state uses Zustand where global state is required.
- [ ] Server state uses TanStack Query.
- [ ] Component-local state remains local where appropriate.
- [ ] Local runtime state is not incorrectly modeled as server state.
- [ ] Realtime state has an explicit ownership model.
- [ ] Resource objects are not duplicated unnecessarily.
- [ ] Derived state is calculated where practical.
- [ ] Global stores remain focused.
- [ ] Ownership rules are documented.

## 143. Full Acceptance Criteria — Zustand

- [ ] Zustand is integrated.
- [ ] Stores are domain-focused.
- [ ] Selectors are narrow.
- [ ] UI state is separated from server state.
- [ ] Session state has explicit lifecycle.
- [ ] Organization context is represented by IDs.
- [ ] Project context is represented by IDs.
- [ ] Realtime connection state is represented.
- [ ] Studio runtime operation state is represented.
- [ ] Sensitive state is not persisted casually.

## 144. Full Acceptance Criteria — TanStack Query

- [ ] QueryClient is configured.
- [ ] Query keys use factories.
- [ ] Tenant identity is represented in relevant keys.
- [ ] Projects use queries.
- [ ] Platforms use queries.
- [ ] Artifacts use queries.
- [ ] Bookings use queries.
- [ ] Credits use queries.
- [ ] Jobs use queries.
- [ ] Runs use queries.
- [ ] Results use queries.
- [ ] Query retry policies are domain-aware.

## 145. Full Acceptance Criteria — Caching

- [ ] Stale-time policies exist.
- [ ] Garbage-collection policies exist.
- [ ] Query invalidation is defined.
- [ ] Direct cache updates are defined.
- [ ] Tenant cache isolation exists.
- [ ] Logout cache clearing exists.
- [ ] Organization-switch cache handling exists.
- [ ] Large lists are paginated.
- [ ] Cache growth is bounded.
- [ ] Sensitive data persistence is controlled.

## 146. Full Acceptance Criteria — Realtime

- [ ] WebSocket integration exists.
- [ ] Connection state is represented.
- [ ] Authentication is coordinated with session state.
- [ ] Events are schema validated.
- [ ] Events are context checked.
- [ ] Event routing exists.
- [ ] Query invalidation is supported.
- [ ] Direct query updates are supported.
- [ ] Duplicate events are tolerated.
- [ ] Reconnect reconciliation exists.

## 147. Full Acceptance Criteria — Loading and Errors

- [ ] Initial loading is distinguishable.
- [ ] Background refreshing is distinguishable.
- [ ] Mutation pending state is distinguishable.
- [ ] Reconnect state is distinguishable.
- [ ] Empty state is distinguished from error.
- [ ] Authorization errors are distinguished.
- [ ] Validation errors are distinguished.
- [ ] Conflict errors are distinguished.
- [ ] Retryable errors are identified.
- [ ] Error boundaries exist where appropriate.

## 148. Full Acceptance Criteria — Optimistic Updates

- [ ] Optimistic update policy is documented.
- [ ] Booking confirmation is not optimistically authoritative.
- [ ] Credit consumption is not optimistically authoritative.
- [ ] Job start is not optimistically marked RUNNING.
- [ ] Physical safety operations are never optimistically confirmed.
- [ ] Allowed optimistic updates have rollback.
- [ ] Mutation success reconciles server state.
- [ ] Mutation failure restores correct state.
- [ ] Idempotency is used for critical retries.
- [ ] Uncertain operations are reconciled.

## 149. Full Acceptance Criteria — Session

- [ ] Session initialization exists.
- [ ] Authenticated state exists.
- [ ] Unauthenticated state exists.
- [ ] Session expiration is handled.
- [ ] Refresh is coordinated.
- [ ] Logout clears protected state.
- [ ] Realtime disconnects on logout.
- [ ] Protected queries are disabled when unauthenticated.
- [ ] Organization context is reset on logout.
- [ ] Sensitive state is not leaked after logout.

## 150. Full Acceptance Criteria — Studio Runtime

- [ ] Local runtime status is represented.
- [ ] Local operation IDs are tracked.
- [ ] Build state is tracked.
- [ ] Test state is tracked.
- [ ] Artifact packaging state is tracked.
- [ ] Local logs are bounded.
- [ ] Tauri events update runtime state.
- [ ] Missed events can be reconciled.
- [ ] Runtime restart behavior is defined.
- [ ] Local operation state is not confused with remote job state.

## 151. Full Acceptance Criteria — Performance

- [ ] Narrow Zustand selectors are used.
- [ ] Query caching reduces duplicate requests.
- [ ] Queries are deduplicated.
- [ ] Large lists are virtualized where necessary.
- [ ] Telemetry is throttled.
- [ ] Logs are bounded.
- [ ] Realtime events are batched where necessary.
- [ ] Cache memory is monitored.
- [ ] Unused queries are garbage-collected.
- [ ] Performance tests cover representative workloads.

## 152. Full Acceptance Criteria — Testing

- [ ] Zustand stores have unit tests.
- [ ] Query key factories have tests.
- [ ] Query hooks have tests.
- [ ] Mutation lifecycle has tests.
- [ ] Realtime event routing has tests.
- [ ] Reconnect behavior has tests.
- [ ] Session transitions have tests.
- [ ] Tenant switching has tests.
- [ ] Optimistic rollback has tests.
- [ ] Critical end-to-end workflows have tests.

## 153. Full Acceptance Criteria — Security

- [ ] Tenant-scoped cache keys exist.
- [ ] Cross-tenant events are rejected.
- [ ] Logout clears protected state.
- [ ] Tokens are not stored in ordinary Zustand persistence.
- [ ] Secrets are not included in telemetry.
- [ ] Sensitive query persistence is restricted.
- [ ] Authorization failures are handled.
- [ ] Realtime authentication is session-aware.
- [ ] Multi-tab logout is considered.
- [ ] State debugging does not expose secrets in production.

## 154. Full Acceptance Criteria — Integration

- [ ] React components use feature hooks/services.
- [ ] Components do not directly manipulate QueryClient unnecessarily.
- [ ] Components do not directly invoke raw WebSocket handlers.
- [ ] Components do not use Zustand for server resource objects.
- [ ] API client integrates with TanStack Query.
- [ ] Realtime integrates through a centralized event router.
- [ ] Studio IPC integrates through local-runtime state services.
- [ ] Remote and local operation states remain distinct.
- [ ] Server responses remain authoritative.
- [ ] State architecture is shared consistently between Studio and Web Console.

## 155. Architectural Invariants

The following rules are mandatory:

1. TanStack Query owns server state.
2. Zustand owns application UI state.
3. Component state remains local unless shared state is justified.
4. Query keys include tenant context where required.
5. Realtime events update or invalidate server caches.
6. WebSocket state is never the sole authority.
7. REST/API state remains authoritative.
8. Critical business operations are server-confirmed.
9. Credit state is never locally authoritative.
10. Booking confirmation is never locally authoritative.
11. Job execution state is never invented by the UI.
12. Physical safety state is never inferred from frontend state.
13. Session lifecycle controls protected query access.
14. Logout clears protected cached state.
15. Organization switching isolates tenant data.
16. High-frequency telemetry is not stored as unlimited query cache.
17. Large logs are bounded and virtualized.
18. Optimistic updates require reliable rollback.
19. Critical retries use backend idempotency.
20. Reconnect requires state reconciliation.
21. Event delivery is treated as at-least-once where applicable.
22. Duplicate events must be tolerated.
23. Derived state should not be duplicated.
24. Global stores must remain domain-focused.
25. State persistence must be explicitly justified.

## 156. Final State Architecture

The production state architecture is:

    +----------------------------------------------------------------+
    |                        React UI                                |
    +-------------------------+--------------------------------------+
                              |
          +-------------------+-------------------+
          |                                       |
          v                                       v
    Zustand Stores                         TanStack Query
          |                                       |
          |                               +-------+-------+
          |                               |               |
          |                               v               v
          |                              REST         WebSocket
          |                               |               |
          |                               +-------+-------+
          |                                       |
          |                                       v
          |                                Query Cache
          |                                       |
          +-------------------+-------------------+
                              |
                              v
                         React Render

Studio adds:

    React
      |
      +--> Zustand
      +--> TanStack Query
      +--> Realtime
      |
      +--> Tauri IPC
              |
              v
        Rust Local Runtime
              |
              v
        Local Operations

The state ownership model is:

    +----------------------+-----------------------------+
    | State Type           | Owner                       |
    +----------------------+-----------------------------+
    | UI interaction       | Zustand / component        |
    | Navigation context   | Router / Zustand           |
    | Session              | Auth/session state          |
    | Server resources     | TanStack Query             |
    | Server mutations     | TanStack Query             |
    | Realtime connection  | Zustand                    |
    | Realtime events      | Event Router               |
    | Live telemetry       | Transient realtime state   |
    | Local build          | Studio Runtime Store       |
    | Local tests          | Studio Runtime Store       |
    | Final results        | TanStack Query             |
    +----------------------+-----------------------------+

The fundamental synchronization model is:

    Backend
       |
       +----------------------+
       |                      |
       v                      v
      REST                 WebSocket
       |                      |
       v                      v
    TanStack Query <---- Event Router
       |
       v
    React

The fundamental local Studio model is:

    Rust Local Runtime
            |
            +---- Tauri Events
            |
            v
    Studio Runtime Store
            |
            v
          React

The architecture deliberately avoids a monolithic global frontend store.
Server-owned data remains server state, transient application behavior remains
UI state, and realtime communication acts as a synchronization mechanism
rather than a competing source of truth.

This separation is essential for maintaining predictable behavior as Kritva
RaaS evolves from the initial developer workflow through booking, remote
execution, live robot operation, results, and production-scale multi-tenant
operation.
