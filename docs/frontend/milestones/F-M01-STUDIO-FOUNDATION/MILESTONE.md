# F-M01 — Studio Foundation

## Milestone Dossier

**Milestone ID:** F-M01-STUDIO-FOUNDATION  
**Product:** Kritva RaaS  
**Primary Phase:** P0 FOUNDATION  
**Primary Surface:** RaaS Studio  
**Technology:** Tauri + Rust + React + TypeScript  
**Priority:** PRI-1 (primary product path per Priority Matrix; see `docs/planning/IMPLEMENTATION_ROADMAP.md` Section 5)  
**Status:** PLANNED  
**Target:** Production-grade Studio foundation  
**Primary Outcome:** A secure, navigable, authenticated Studio shell that establishes the
foundation for all subsequent RaaS Studio workflows.

---

# 1. Objective

## 1.1 Milestone Objective

F-M01 establishes the production-grade foundation of the Kritva RaaS Studio.

The milestone creates the application shell that later milestones will extend into
project management, local builds, artifacts, platform discovery, booking, remote
execution, telemetry, and results.

The foundation must establish:

- Tauri desktop application structure;
- React and TypeScript frontend structure;
- Rust native layer;
- application startup;
- navigation;
- route protection;
- authentication UI;
- session state;
- dashboard shell;
- profile;
- settings;
- platform awareness;
- loading/error/empty states;
- design-system foundation;
- API-client boundary;
- local runtime boundary;
- secure credential/session handling;
- logging and diagnostics foundation;
- test infrastructure.

## 1.2 Product Context

The Studio is the developer-facing entry point to Kritva RaaS.

The intended long-term workflow is:

    Login
      |
      v
    Dashboard
      |
      v
    Project
      |
      v
    Platform
      |
      v
    Local Build
      |
      v
    .krv Artifact
      |
      v
    Booking
      |
      v
    Remote Job
      |
      v
    Live Run
      |
      v
    Results
      |
      v
    Rerun

F-M01 does not implement this complete workflow.

It establishes the application foundation through which those workflows will
later be delivered.

## 1.3 Architectural Objective

The milestone shall establish the following boundary:

    +------------------------------------------------------+
    |                 Kritva RaaS Studio                  |
    |                                                      |
    |  +---------------- React / TypeScript -------------+ |
    |  | Navigation                                       | |
    |  | Authentication UI                                | |
    |  | Dashboard                                        | |
    |  | Profile                                          | |
    |  | Settings                                         | |
    |  | Platform Awareness                               | |
    |  +--------------------+-----------------------------+ |
    |                       |                               |
    |                 API Client / IPC                      |
    |                       |                               |
    +-----------------------+-------------------------------+
                            |
                 +----------+----------+
                 |                     |
                 v                     v
          Control Plane API      Tauri/Rust Layer
                                      |
                                      v
                              Local Runtime Boundary

The Studio must not become responsible for authoritative backend business state.

## 1.4 Primary Success Definition

F-M01 is successful when a new user can install and launch the Studio, authenticate,
establish a session, navigate the application, view a dashboard shell, inspect
profile/settings, see supported platform awareness, sign out, and recover from
normal loading/error/session-expiry states without bypassing security boundaries.

---

# 2. Scope and Non-Scope

## 2.1 In Scope

F-M01 includes:

- Tauri application shell;
- Rust application bootstrap;
- React application bootstrap;
- TypeScript configuration;
- routing;
- navigation shell;
- authenticated and unauthenticated route handling;
- login UI;
- logout UI;
- session state;
- session expiry handling;
- dashboard shell;
- profile screen;
- settings screen;
- platform awareness foundation;
- API client foundation;
- Tauri IPC foundation;
- secure local session storage abstraction;
- application configuration;
- error boundary;
- loading states;
- empty states;
- notifications;
- keyboard navigation;
- accessibility foundation;
- light/dark theme foundation;
- responsive window behavior;
- test infrastructure;
- CI integration for Studio;
- basic diagnostics/logging;
- coding-agent integration foundation: provider adapter trait, mock provider, agent session manager skeleton, environment sanitizer, workspace guard and the `agent.*` IPC contract (`docs/architecture/CODING_AGENT_INTEGRATION.md`).

## 2.2 Explicitly Out of Scope

F-M01 does not implement:

- project creation;
- project source management;
- local compilation;
- local build orchestration;
- artifact packaging;
- artifact signing;
- artifact upload;
- robot booking;
- credit purchase;
- credit consumption;
- Job creation;
- Run execution;
- live robot control;
- physical robot control;
- live video;
- telemetry visualization;
- log streaming;
- result generation;
- result comparison;
- admin console;
- payment processing;
- subscription management;
- production billing;
- physical Lab Agent integration;
- real coding-agent provider sessions, consent and diff review (F-M02 PROJECTS);
- the Kritva Studio MCP server and the second provider adapter (F-M03 BUILD & ARTIFACT);
- organization coding-agent policy and provider metadata services (B-M01 CONTROL PLANE, B-M03 PLATFORM).

Those capabilities belong to later milestones.

## 2.3 Source Privacy Boundary

The Studio foundation must preserve the core RaaS principle:

> Customer source code remains local.

F-M01 must not introduce an architecture in which source files are automatically
uploaded to the Control Plane.

The application shell may establish local filesystem permissions and local runtime
interfaces, but it must not collect or transmit source content.

## 2.4 Safety Boundary

F-M01 contains no physical robot-control capability.

The Studio UI must nevertheless establish the architectural rule that:

> UI controls cannot override physical robot safety authority.

Future execution controls must respect local runtime and laboratory safety
boundaries.

## 2.5 Coding-Agent Integration Boundary

Studio offers external coding agents (Claude Code, OpenAI Codex) as a PRI-1 capability; using them is optional for each user. Architecture: `docs/architecture/CODING_AGENT_INTEGRATION.md`. Decisions: SYS-ADR-007, FE-ADR-008, SEC-ADR-001.

F-M01 establishes only the foundation that later milestones build on:

- a provider-neutral adapter trait in the Rust Local Runtime and a deterministic mock provider;
- an agent session manager skeleton with the lifecycle states defined in the architecture, a durable session journal, a cross-process workspace lock and the normalized error taxonomy;
- an environment sanitizer that removes Kritva session tokens, API keys, Control Plane credentials and signing material from any agent process environment;
- a workspace guard that detects file modifications outside an allowed root;
- the versioned `agent.*` IPC contract (`docs/frontend/architecture/IPC_ARCHITECTURE.md` Section 52).

F-M01 STUDIO FOUNDATION MUST NOT add a generic process-execution IPC, and MUST NOT store or read provider credentials. Studio MUST remain fully usable when no provider is installed.

---

# 3. Dependencies

## 3.1 Product Dependencies

F-M01 depends on:

- approved Kritva RaaS product architecture;
- approved Studio information architecture;
- approved UI acceptance criteria;
- approved UI review checklist;
- approved design system direction;
- authentication architecture;
- authorization architecture;
- source privacy requirements.

## 3.2 Documentation Dependencies

Primary references:

| Document | Relationship |
|---|---|
| `docs/ui/UI_SPECIFICATION.md` | Studio screen and interaction definition |
| `docs/ui/UI_DESIGN_SYSTEM.md` | Visual and component foundation |
| `docs/ui/UI_ACCEPTANCE_CRITERIA.md` | Acceptance requirements |
| `docs/ui/UI_REVIEW_CHECKLIST.md` | Review procedure |
| `docs/ui/ARTWORK_GUIDELINES.md` | Artwork and asset rules |
| `docs/security/AUTHENTICATION.md` | Authentication/session rules |
| `docs/security/AUTHORIZATION.md` | Authorization rules |
| `docs/security/SOURCE_CODE_PRIVACY.md` | Source privacy boundary |
| `docs/planning/INTEGRATION_PLAN.md` | Integration architecture |
| `docs/development/DEVELOPMENT_SETUP.md` | Development environment |
| `docs/development/DEVELOPMENT_WORKFLOW.md` | Engineering workflow |

## 3.3 Technical Dependencies

F-M01 depends on:

- Node.js;
- pnpm;
- Rust;
- Cargo;
- Tauri;
- React;
- TypeScript;
- workspace configuration;
- CI;
- API client package;
- shared UI package;
- configuration package.

## 3.4 Backend Dependency

The Studio must be designed against the Control Plane contract.

Where the backend is not yet fully implemented, the frontend may use a typed
mock or contract stub.

The mock must not become a permanent replacement for the real API.

## 3.5 Dependency Flow

    F-M01 Studio
         |
         +--> UI Design System
         |
         +--> API Contracts
         |
         +--> Authentication Contract
         |
         +--> Authorization Contract
         |
         +--> Tauri/Rust Boundary
         |
         +--> CI/Test Infrastructure
         |
         v
    F-M02 PROJECTS

---

# 4. Deliverables

## 4.1 Primary Deliverables

F-M01 shall deliver:

1. runnable Tauri application;
2. React application shell;
3. Rust native layer;
4. route/navigation system;
5. authentication screens;
6. authenticated session handling;
7. dashboard shell;
8. profile screen;
9. settings screen;
10. platform-awareness foundation;
11. shared layout;
12. shared navigation;
13. shared UI primitives;
14. error/loading/empty state system;
15. API client boundary;
16. secure session storage abstraction;
17. Tauri IPC abstraction;
18. test foundation;
19. CI build/test workflow;
20. Studio developer documentation;
21. coding-agent integration foundation (Section 2.5).

## 4.2 Screen Deliverables

| Screen | F-M01 Status |
|---|---|
| Login | Full foundation |
| Dashboard | Shell |
| Profile | Foundation |
| Settings | Foundation |
| Platforms | Awareness/read-only foundation |
| Projects | Placeholder/navigation target |
| Build | Placeholder/navigation target |
| Artifacts | Placeholder/navigation target |
| Booking | Placeholder/navigation target |
| Jobs | Placeholder/navigation target |
| Live Run | Placeholder/navigation target |
| Results | Placeholder/navigation target |

Placeholder screens must clearly communicate that functionality is not yet
available.

They must not present fake operational state as real data.

## 4.3 Platform Awareness

The Studio must establish a platform model capable of later displaying:

- platform name;
- platform ID;
- platform version;
- architecture;
- supported status;
- availability indicator;
- capability summary.

F-M01 may use contract fixtures if the live Platform API is not available.

---

# 9. Risks

## 9.1 R-FM01-001 — Tauri/React Boundary Complexity

**Risk:** Native and web layers become tightly coupled.

**Impact:** High.

**Mitigation:**

- typed IPC;
- narrow Rust command surface;
- shared contracts;
- architecture review.

## 9.2 R-FM01-002 — Authentication Contract Drift

**Risk:** Frontend session implementation diverges from backend authentication.

**Impact:** High.

**Mitigation:**

- contract-first implementation;
- typed API client;
- integration tests;
- shared authentication specification.

## 9.3 R-FM01-003 — Token Leakage

**Risk:** Tokens appear in logs, local storage or diagnostics.

**Impact:** Critical.

**Mitigation:**

- secure storage abstraction;
- log redaction;
- security review;
- automated scanning.

## 9.4 R-FM01-004 — Source Privacy Violation

**Risk:** Future-facing Studio architecture accidentally uploads source.

**Impact:** Critical.

**Mitigation:**

- explicit local source boundary;
- package-only remote interface;
- network tests;
- security review.

## 9.5 R-FM01-005 — UI Becomes API Authority

**Risk:** UI starts making authoritative booking, credit or platform decisions.

**Impact:** High.

**Mitigation:**

- server-authoritative architecture;
- typed API client;
- clear domain ownership.

## 9.6 R-FM01-006 — Premature Feature Implementation

**Risk:** F-M01 becomes overloaded with project/build/booking functionality.

**Impact:** Medium.

**Mitigation:**

- enforce scope;
- defer functionality to later milestones;
- use explicit placeholders.

## 9.7 R-FM01-007 — Design System Drift

**Risk:** Screens develop independent styles.

**Impact:** Medium.

**Mitigation:**

- shared UI package;
- semantic tokens;
- UI review checklist.

## 9.8 R-FM01-008 — Accessibility Deferred

**Risk:** Accessibility becomes expensive to retrofit.

**Impact:** Medium.

**Mitigation:**

- accessibility acceptance in F-M01;
- keyboard-first navigation;
- semantic components.

## 9.9 R-FM01-009 — Cross-Platform Divergence

**Risk:** Linux and Windows behavior diverges.

**Impact:** High.

**Mitigation:**

- CI builds;
- platform-specific testing;
- Rust abstraction;
- explicit P0 platform matrix.

## 9.10 R-FM01-010 — Native Capability Overexposure

**Risk:** Tauri exposes unrestricted filesystem/process functionality.

**Impact:** Critical.

**Mitigation:**

- narrow IPC;
- capability restrictions;
- security review;
- input validation.

## 9.11 R-FM01-011 — Backend Unavailability

**Risk:** Studio cannot be developed because backend is incomplete.

**Impact:** Medium.

**Mitigation:**

- contract fixtures;
- mock API;
- replace mocks progressively;
- integration tests against real backend.

## 9.12 R-FM01-012 — Milestone Becomes Visual-Only

**Risk:** Studio appears complete but lacks robust session/error/test behavior.

**Impact:** High.

**Mitigation:**

- acceptance criteria;
- automated tests;
- security verification;
- demo script.

## 9.13 R-FM01-013 — Agent Process Boundary Weakened

**Risk:** Agent integration introduces a generic command-execution path or leaks Studio credentials into agent processes.

**Mitigation:** Typed `agent.*` IPC only; environment sanitizer with tests; security review of the adapter trait before F-M02 PROJECTS starts. Related: R-SEC-013 in `docs/tracking/RISK_REGISTER.md`.

---

# 10. Exit Criteria

F-M01 may transition to ACCEPTED only when all required conditions are satisfied.

## 10.1 Functional Exit

- [ ] Studio launches.
- [ ] Authentication works.
- [ ] Session lifecycle works.
- [ ] Navigation works.
- [ ] Dashboard works.
- [ ] Profile works.
- [ ] Settings works.
- [ ] Platform awareness works.
- [ ] Logout works.
- [ ] Session expiry works.
- [ ] Loading/error/empty states work.

## 10.2 Architecture Exit

- [ ] Tauri/Rust boundary is defined.
- [ ] React/TypeScript structure is defined.
- [ ] API client boundary exists.
- [ ] IPC boundary exists.
- [ ] Secure session storage abstraction exists.
- [ ] Native capabilities are restricted.
- [ ] Source privacy boundary is preserved.
- [ ] Coding-agent adapter trait, mock provider and `agent.*` IPC contract exist and are reviewed.

## 10.3 Quality Exit

- [ ] Unit tests pass.
- [ ] Component tests pass.
- [ ] Integration tests pass.
- [ ] E2E tests pass.
- [ ] Accessibility checks pass.
- [ ] Linux build passes.
- [ ] Windows build is validated.
- [ ] CI passes.

## 10.4 Security Exit

- [ ] No token leakage.
- [ ] No source upload.
- [ ] Protected routes verified.
- [ ] IPC reviewed.
- [ ] Secrets excluded from builds.
- [ ] Agent environment sanitizer verified (no Kritva credential in agent process environment).
- [ ] No generic command-execution IPC exists.
- [ ] Security review completed.

## 10.5 UI Exit

- [ ] Design system tokens used.
- [ ] Light theme works.
- [ ] Dark theme works.
- [ ] Keyboard navigation works.
- [ ] Focus states work.
- [ ] Error states are usable.
- [ ] Loading states are usable.
- [ ] Placeholder screens clearly identify unavailable functionality.

## 10.6 Documentation Exit

- [ ] F-M01 tasks are updated.
- [ ] Acceptance evidence is recorded.
- [ ] Architecture changes are recorded.
- [ ] README is updated.
- [ ] Development setup reflects the implementation.
- [ ] Relevant tracking files are updated.

## 10.7 Review Exit

Required approvals:

- [ ] Architecture review.
- [ ] Frontend implementation review.
- [ ] UX/UI review.
- [ ] Security review.
- [ ] QA review.
- [ ] Milestone owner acceptance.

## 10.8 Formal Status Transition

The intended lifecycle is:

    PLANNED
       |
       v
    READY
       |
       v
    IN_PROGRESS
       |
       v
    REVIEW
       |
       v
    QUALIFICATION
       |
       v
    ACCEPTED
       |
       v
    COMPLETE

The milestone must not be marked COMPLETE merely because implementation is
merged.

Acceptance requires evidence.

---
