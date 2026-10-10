# F-M01-STUDIO-FOUNDATION — Tasks

Milestone: F-M01 — Studio Foundation
Source of scope: [MILESTONE.md](MILESTONE.md)

# 5. Detailed Task Breakdown

## 5.1 Task Register

The following task IDs are milestone-scoped.

| ID | Description | Estimate | Owner Role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-FE-0-001 | Initialize Studio workspace | 1.0d | Frontend | None | [ ] |
| KR-FE-0-002 | Initialize Tauri/Rust shell | 1.5d | Rust | 001 | [ ] |
| KR-FE-0-003 | Initialize React/TypeScript shell | 1.5d | Frontend | 001 | [ ] |
| KR-FE-0-004 | Establish shared UI package | 2.0d | Frontend | 003 | [ ] |
| KR-FE-0-005 | Implement design tokens | 1.5d | UX/UI | 004 | [ ] |
| KR-FE-0-006 | Implement application layout | 2.0d | Frontend | 004,005 | [ ] |
| KR-FE-0-007 | Implement navigation | 2.0d | Frontend | 006 | [ ] |
| KR-FE-0-008 | Implement route guards | 1.5d | Frontend | 007 | [ ] |
| KR-FE-0-009 | Implement login UI | 2.0d | Frontend | 008 | [ ] |
| KR-FE-0-010 | Implement authentication client | 2.0d | Backend/Frontend | 009 | [ ] |
| KR-FE-0-011 | Implement session state | 2.0d | Frontend/Rust | 010 | [ ] |
| KR-FE-0-012 | Implement logout/session expiry | 1.0d | Frontend | 011 | [ ] |
| KR-FE-0-013 | Implement dashboard shell | 2.0d | Frontend | 006,011 | [ ] |
| KR-FE-0-014 | Implement profile screen | 1.0d | Frontend | 011 | [ ] |
| KR-FE-0-015 | Implement settings screen | 1.5d | Frontend | 011 | [ ] |
| KR-FE-0-016 | Implement platform awareness | 2.0d | Frontend/Backend | 011 | [ ] |
| KR-FE-0-017 | Implement loading/error/empty states | 1.5d | Frontend | 006 | [ ] |
| KR-FE-0-018 | Implement notification system | 1.0d | Frontend | 004 | [ ] |
| KR-FE-0-019 | Implement keyboard/accessibility baseline | 2.0d | Frontend/UX | 006 | [ ] |
| KR-FE-0-020 | Implement theme support | 1.5d | Frontend/UX | 005 | [ ] |
| KR-FE-0-021 | Implement API client boundary | 2.0d | Backend/Frontend | 010 | [ ] |
| KR-FE-0-022 | Implement Tauri IPC boundary | 2.0d | Rust | 002 | [ ] |
| KR-FE-0-023 | Implement secure session storage | 2.0d | Rust/Security | 011 | [ ] |
| KR-FE-0-024 | Implement application diagnostics | 1.0d | Rust/DevOps | 002 | [ ] |
| KR-FE-0-025 | Add frontend unit tests | 2.0d | QA/Frontend | 013-020 | [ ] |
| KR-FE-0-026 | Add authentication integration tests | 2.0d | QA | 010-012 | [ ] |
| KR-FE-0-027 | Add navigation E2E tests | 1.5d | QA | 007-013 | [ ] |
| KR-FE-0-028 | Add accessibility tests | 1.5d | QA/UX | 019 | [ ] |
| KR-FE-0-029 | Add cross-platform build checks | 1.5d | DevOps | 002,003 | [ ] |
| KR-FE-0-030 | Add Studio CI pipeline | 2.0d | DevOps | 025-029 | [ ] |
| KR-FE-0-031 | Complete Studio documentation | 1.5d | Frontend/Docs | All | [ ] |
| KR-FE-0-032 | Conduct milestone review | 1.0d | Architect | All | [ ] |

Estimates are engineering-day estimates and should be refined during task
refinement.

## 5.2 Workspace Initialization

`KR-FE-0-001` establishes:

- application directory;
- package metadata;
- workspace membership;
- linting;
- formatting;
- TypeScript;
- build scripts.

Expected structure:

    apps/
      studio/

    packages/
      ui/
      api-client/
      auth/
      config/
      utils/

## 5.3 Tauri Shell

`KR-FE-0-002` establishes:

- Tauri application;
- Rust main process;
- window lifecycle;
- secure IPC registration;
- application metadata;
- development build;
- production build.

## 5.4 React Shell

`KR-FE-0-003` establishes:

- React root;
- application provider hierarchy;
- router;
- global state boundary;
- error boundary;
- theme provider.

## 5.5 Shared UI

`KR-FE-0-004` establishes reusable components.

Minimum components:

- Button;
- Input;
- Select;
- Checkbox;
- Dialog;
- Toast;
- Spinner;
- EmptyState;
- ErrorState;
- Card;
- Table;
- Badge;
- Avatar;
- NavigationItem.

## 5.6 Design Tokens

`KR-FE-0-005` establishes semantic tokens for:

- background;
- foreground;
- surface;
- border;
- primary action;
- danger;
- warning;
- success;
- informational state;
- focus;
- disabled state.

Exact production values must follow `UI_DESIGN_SYSTEM.md`.

## 5.7 Application Layout

The shell should use:

    +---------------------------------------------------------+
    | Kritva RaaS | Context / Breadcrumbs | User              |
    +-------------+-------------------------------------------+
    |             |                                           |
    | Navigation  |                 Main Content               |
    |             |                                           |
    | Dashboard   |                                           |
    | Projects    |                                           |
    | Platforms   |                                           |
    | Build       |                                           |
    | Artifacts   |                                           |
    | Booking     |                                           |
    | Jobs        |                                           |
    | Results     |                                           |
    |             |                                           |
    | Settings    |                                           |
    +-------------+-------------------------------------------+

Navigation items whose functionality is not yet implemented must be visually
marked as unavailable or presented as planned navigation targets.

## 5.8 Navigation

Navigation must support:

- mouse;
- keyboard;
- direct route access;
- browser-like back/forward semantics where applicable;
- protected routes;
- session expiry;
- deep links.

## 5.9 Authentication UI

Login must provide:

- username/email field as defined by backend contract;
- password or configured authentication method;
- submit action;
- loading state;
- invalid credentials state;
- unavailable service state;
- session restoration;
- logout.

Future SSO/MFA/passkey support must not require redesigning the navigation shell.

## 5.10 Session State

Session state should conceptually be:

    UNKNOWN
       |
       v
    CHECKING
      / \
     /   \
    v     v
 AUTHENTICATED   UNAUTHENTICATED
       |
       v
    EXPIRED
       |
       v
 UNAUTHENTICATED

Session state must be authoritative from the authentication service.

## 5.11 Dashboard

F-M01 dashboard is a foundation shell.

It should provide:

- welcome context;
- account identity;
- platform awareness;
- future workflow entry points;
- system status area;
- recent activity placeholder;
- project placeholder.

It must not fabricate bookings, jobs, credits or results.

## 5.12 Profile

Profile provides:

- display name;
- account identity;
- organization context;
- account state;
- authentication/security entry points where supported.

Profile editing must use backend APIs when the backend supports it.

## 5.13 Settings

Settings foundation should establish categories for:

- appearance;
- application;
- session;
- diagnostics;
- platform defaults;
- future local build configuration.

Settings must distinguish local settings from server-authoritative settings.

## 5.14 Platform Awareness

Platform awareness establishes:

    Platform Catalog
         |
         v
    Studio Platform Model
         |
         +--> Platform Name
         +--> Version
         +--> Architecture
         +--> Capabilities
         +--> Availability
         +--> Compatibility

F-M01 does not implement complete booking or compatibility validation.

## 5.15 API Client Boundary

The frontend must not scatter raw HTTP calls throughout components.

Preferred flow:

    React Component
          |
          v
    Application Hook
          |
          v
    API Client
          |
          v
    Contract Types
          |
          v
    HTTPS API

Authentication/session concerns should be centralized.

## 5.16 Tauri IPC Boundary

Native operations should follow:

    React
      |
      | typed command
      v
    Tauri IPC
      |
      v
    Rust Command
      |
      v
    Native Operation

The UI must not gain unrestricted native filesystem or process access.

## 5.17 Secure Session Storage

Session credentials/tokens must use the approved secure storage abstraction.

Do not store sensitive credentials in:

- plain localStorage;
- arbitrary JSON files;
- source files;
- application logs;
- unencrypted SQLite.

The exact secure storage mechanism is platform-specific and must follow
`AUTHENTICATION.md`.

## 5.18 Diagnostics

Diagnostics must support:

- application version;
- environment;
- startup status;
- non-sensitive error information;
- correlation/request IDs where available.

Secrets, tokens and source code must not appear in diagnostics.

---
