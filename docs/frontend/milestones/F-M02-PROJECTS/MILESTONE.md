# F-M02 — Projects

## Milestone Dossier

**Milestone ID:** F-M02-PROJECTS  
**Product:** Kritva RaaS  
**Primary Phase:** P1 STUDIO  
**Primary Surface:** RaaS Studio  
**Technology:** Tauri + Rust + React + TypeScript  
**Priority:** PRI-1 (primary product path per Priority Matrix; see `docs/planning/IMPLEMENTATION_ROADMAP.md` Section 5)  
**Status:** PLANNED  
**Primary Outcome:** A production-grade project workspace that allows authenticated
users to create, list, open, configure and manage local RaaS projects while
selecting the target robotic platform, KritvaOS version and SDK version.

---

# 1. Objective

## 1.1 Milestone Objective

F-M02 establishes the Project Workspace as the central development context of
Kritva RaaS Studio.

The milestone builds on the Studio foundation delivered by F-M01 and introduces
the first meaningful developer workflow:

    Login
      |
      v
    Dashboard
      |
      v
    Projects
      |
      +--> Create Project
      |
      +--> Open Project
      |
      +--> Project Metadata
      |
      +--> Local Workspace
      |
      +--> Target Platform
      |
      +--> KritvaOS Version
      |
      +--> SDK Version
      |
      v
    Project Workspace

The project becomes the primary context for subsequent milestones including
local build, artifact generation, platform compatibility, booking, execution
and results.

## 1.2 Product Intent

A Kritva RaaS Project represents a customer's robotics application workspace.

The Project is not the source code itself in the cloud.

The source code remains on the developer machine.

The Control Plane stores project metadata required to manage the project,
authorize access, identify target platforms and coordinate later RaaS workflows.

## 1.3 Primary Success Definition

F-M02 is successful when an authenticated developer can:

1. view projects they are authorized to access;
2. create a new project;
3. select or configure a local workspace;
4. provide project metadata;
5. select a target robotic platform;
6. select a compatible KritvaOS version;
7. select an SDK version;
8. save project configuration;
9. reopen the project;
10. continue working from the same local workspace;
11. switch between authorized projects;
12. receive safe validation and error feedback.

## 1.4 Architectural Objective

F-M02 establishes:

    Control Plane
         |
         | Project Metadata
         v
    PostgreSQL
         ^
         |
    Project API
         ^
         |
    API Client
         ^
         |
    Studio Project Workspace
         |
         v
    Local Filesystem
         |
         v
    Customer Source

The metadata path is remote.

The source path is local.

These paths must not be accidentally merged.

---

# 2. Scope and Non-Scope

## 2.1 In Scope

F-M02 includes:

- Projects list;
- project creation;
- project opening;
- project selection;
- project metadata;
- project key/name validation;
- project description;
- local workspace selection;
- local workspace validation;
- local workspace persistence;
- target platform selection;
- platform version selection;
- KritvaOS version selection;
- SDK version selection;
- project settings foundation;
- project platform binding;
- preferred/default platform handling;
- project member visibility;
- project archive foundation where supported;
- project search/filter foundation;
- project loading/error/empty states;
- project API integration;
- local workspace Tauri integration;
- project state management;
- project navigation;
- project-level authorization handling;
- project tests;
- CI integration;
- project documentation.

## 2.2 Explicitly Out of Scope

F-M02 does not implement:

- source-code upload;
- cloud source repository;
- local compilation;
- remote compilation;
- artifact packaging;
- artifact signing;
- artifact upload;
- booking;
- credits;
- Job creation;
- Run execution;
- live video;
- telemetry;
- physical robot control;
- result generation;
- experiment comparison;
- payment;
- subscription management;
- complete admin project management;
- collaborative real-time editing.

These capabilities are delivered in later milestones.

## 2.3 Source Privacy Scope

The Project Workspace may access local source directories because the developer
explicitly selects or creates a local workspace.

The workspace itself remains local.

The Studio must not:

- upload source files;
- synchronize source files to the cloud;
- include source contents in project metadata;
- include source contents in ordinary project API requests;
- send source paths to remote services unless explicitly required and approved.

## 2.4 Project Metadata Scope

Project metadata may include:

- project ID;
- project key;
- project name;
- description;
- organization;
- lifecycle status;
- owner/member information;
- local workspace association;
- default target platform;
- target platform version;
- KritvaOS version;
- SDK version;
- artifact format;
- execution enablement;
- project settings.

Metadata must remain bounded and structured.

---

# 3. Dependencies

## 3.1 Milestone Dependencies

F-M02 depends on F-M01 for:

- Studio shell;
- navigation;
- authentication;
- session;
- dashboard;
- settings;
- API client;
- Tauri/Rust boundary;
- UI components;
- theme;
- accessibility foundation;
- test infrastructure.

## 3.2 Backend Dependencies

F-M02 depends on Control Plane support for:

- project creation;
- project listing;
- project retrieval;
- project update;
- project authorization;
- organization context;
- platform catalog;
- platform version catalog.

Where backend implementation is incomplete, contract fixtures may be used.

Fixtures must remain clearly identified as test/development data.

## 3.3 Database Dependencies

F-M02 depends on the Project schema defined in:

`docs/database/schema/PROJECTS.md`

The project model includes:

- `project.projects`;
- `project.project_settings`;
- `project.project_members`;
- `project.project_platform_bindings`.

## 3.4 Platform Dependencies

F-M02 depends on:

- Platform;
- Platform Version;
- Architecture;
- Capability;
- platform lifecycle;
- version lifecycle;
- compatibility metadata.

F-M02 establishes selection, not final artifact compatibility validation.

## 3.5 Security Dependencies

Relevant security documents:

- `docs/security/AUTHENTICATION.md`;
- `docs/security/AUTHORIZATION.md`;
- `docs/security/SOURCE_CODE_PRIVACY.md`;
- `docs/security/TENANT_ISOLATION.md`.

Project access must be authorized by the backend.

The UI must never assume that possession of a project ID grants access.

## 3.6 Planning Dependencies

Relevant planning documents:

- `docs/planning/IMPLEMENTATION_ROADMAP.md`;
- `docs/planning/PHASES.md`;
- `docs/planning/INTEGRATION_PLAN.md`;
- `docs/planning/DECISIONS.md`;
- `docs/planning/RESOURCE_PLAN.md`.

## 3.7 Dependency Flow

    F-M01 STUDIO FOUNDATION
             |
             v
    F-M02 PROJECTS
             |
       +-----+-----+
       |           |
       v           v
    Platform    Local Workspace
    Selection      |
       |           |
       +-----+-----+
             |
             v
       F-M03 BUILD & ARTIFACT

---

# 4. Deliverables

## 4.1 Primary Deliverables

F-M02 shall deliver:

1. Projects list screen;
2. project creation workflow;
3. project overview/workspace screen;
4. project metadata display;
5. project metadata editing;
6. local workspace selection;
7. local workspace validation;
8. persistent local workspace association;
9. target platform selection;
10. KritvaOS version selection;
11. SDK version selection;
12. project platform binding;
13. project settings integration;
14. project search/filter;
15. project loading/error/empty states;
16. project authorization handling;
17. project API client integration;
18. local workspace Rust/Tauri integration;
19. automated project tests;
20. project documentation.

## 4.2 Project List

The Projects screen should provide:

- project name;
- project key;
- organization;
- lifecycle status;
- target platform;
- KritvaOS version;
- SDK version;
- last updated timestamp;
- local workspace state;
- open action;
- create action.

The list must not expose projects outside the authenticated user's authorized
scope.

## 4.3 Project Creation

Creation flow:

    Projects
       |
       v
    Create Project
       |
       v
    Name / Key
       |
       v
    Description
       |
       v
    Local Workspace
       |
       v
    Target Platform
       |
       v
    KritvaOS Version
       |
       v
    SDK Version
       |
       v
    Review
       |
       v
    Create
       |
       v
    Project Workspace

## 4.4 Project Overview

The project overview should show:

- project identity;
- metadata;
- organization;
- workspace;
- target platform;
- KritvaOS version;
- SDK version;
- project status;
- project actions;
- future workflow entry points.

## 4.5 Local Workspace

The Studio must support an explicit local workspace association.

The association should record sufficient local information to reopen the project
without uploading source.

The design should prefer a stable local workspace identity/reference rather than
treating an absolute filesystem path as portable project metadata.

## 4.6 Target Platform

The user must be able to select an authorized/supported target platform.

The UI should show:

- platform name;
- platform type;
- platform version;
- architecture;
- lifecycle status;
- capability summary.

## 4.7 KritvaOS Version

The project must support selecting the intended KritvaOS runtime version.

Example:

    Platform
       |
       v
    KritvaOS Version
       |
       v
    SDK Version

The UI must prevent selection of combinations explicitly marked incompatible by
the platform catalog where compatibility data is available.

## 4.8 SDK Version

The project must store the intended SDK version.

The selected SDK version becomes part of later build and artifact compatibility
validation.

---

# 9. Risks

## 9.1 R-FM02-001 — Source Leakage Through Workspace Integration

**Risk:** Local workspace implementation accidentally sends source information.

**Impact:** Critical.

**Mitigation:**

- Rust-only local filesystem boundary;
- metadata-only API;
- network inspection tests;
- security review.

## 9.2 R-FM02-002 — Platform Catalog Drift

**Risk:** Frontend hard-codes platform information that diverges from backend.

**Impact:** High.

**Mitigation:**

- API-driven catalog;
- typed contracts;
- no business logic hard-coded into components.

## 9.3 R-FM02-003 — Invalid Version Combination

**Risk:** User selects incompatible platform, KritvaOS and SDK versions.

**Impact:** High.

**Mitigation:**

- dependency-aware selectors;
- server validation;
- compatibility API;
- clear UI warnings.

## 9.4 R-FM02-004 — Workspace Path Portability

**Risk:** Absolute path is treated as portable project identity.

**Impact:** Medium.

**Mitigation:**

- separate remote Project ID and local workspace identity;
- explicit reassociation;
- local workspace marker.

## 9.5 R-FM02-005 — Unauthorized Project Access

**Risk:** User accesses another organization's project through a stale project ID.

**Impact:** Critical.

**Mitigation:**

- server authorization;
- tenant filtering;
- integration tests;
- UI route guards.

## 9.6 R-FM02-006 — Project Key Conflict

**Risk:** Concurrent project creation causes duplicate key behavior.

**Impact:** Medium.

**Mitigation:**

- database unique constraint;
- server validation;
- conflict handling;
- idempotent create semantics where required.

## 9.7 R-FM02-007 — Workspace Permission Problems

**Risk:** OS permissions prevent expected local operations.

**Impact:** Medium.

**Mitigation:**

- explicit validation;
- clear error messages;
- platform-specific tests.

## 9.8 R-FM02-008 — Scope Expansion

**Risk:** Build, artifact or booking functionality is pulled into F-M02.

**Impact:** Medium.

**Mitigation:**

- milestone scope enforcement;
- task decomposition;
- subsequent milestone ownership.

## 9.9 R-FM02-009 — Metadata Becomes Source Storage

**Risk:** Developers use project metadata fields to store source/configuration
content.

**Impact:** High.

**Mitigation:**

- bounded metadata;
- explicit schema;
- validation;
- no arbitrary source blobs.

## 9.10 R-FM02-010 — Backend Availability

**Risk:** Backend project APIs are delayed.

**Impact:** Medium.

**Mitigation:**

- contract fixtures;
- mock server;
- API-first implementation;
- integration replacement tests.

## 9.11 R-FM02-011 — Cross-Platform Filesystem Divergence

**Risk:** Workspace behavior differs across Linux and Windows.

**Impact:** High.

**Mitigation:**

- native abstraction;
- path normalization;
- cross-platform tests;
- platform-specific QA.

## 9.12 R-FM02-012 — Configuration Drift

**Risk:** Project settings used by Studio differ from future build/runtime
configuration.

**Impact:** High.

**Mitigation:**

- typed contracts;
- versioned project settings;
- architecture review;
- integration with future build milestones.

---

# 10. Exit Criteria

## 10.1 Functional Exit

- [ ] Projects list works.
- [ ] Project creation works.
- [ ] Project opening works.
- [ ] Project metadata works.
- [ ] Project editing works.
- [ ] Local workspace association works.
- [ ] Target platform selection works.
- [ ] KritvaOS version selection works.
- [ ] SDK version selection works.
- [ ] Project settings foundation works.
- [ ] Authorization behavior is correct.

## 10.2 Source Privacy Exit

- [ ] No source is uploaded.
- [ ] No source is included in project metadata.
- [ ] No source is logged.
- [ ] Workspace operations remain local.
- [ ] Network privacy tests pass.

## 10.3 Architecture Exit

- [ ] Project API client exists.
- [ ] Workspace IPC boundary exists.
- [ ] Platform selection uses catalog contracts.
- [ ] Project state is centralized.
- [ ] Local and remote project identity are distinguished.
- [ ] Backend remains authoritative.

## 10.4 Quality Exit

- [ ] Unit tests pass.
- [ ] Component tests pass.
- [ ] Integration tests pass.
- [ ] E2E project flow passes.
- [ ] Accessibility checks pass.
- [ ] Linux verification passes.
- [ ] Windows verification passes.
- [ ] CI passes.

## 10.5 Security Exit

- [ ] Tenant authorization tested.
- [ ] Project authorization tested.
- [ ] Workspace boundary reviewed.
- [ ] Sensitive local data protected.
- [ ] Security review completed.

## 10.6 Documentation Exit

- [ ] F-M02 tasks are updated.
- [ ] Project API contracts are documented.
- [ ] Workspace behavior is documented.
- [ ] Platform selection behavior is documented.
- [ ] Acceptance evidence is recorded.
- [ ] Tracking documents are updated.

## 10.7 Review Exit

Required:

- [ ] Architecture review.
- [ ] Frontend implementation review.
- [ ] UX/UI review.
- [ ] Database/API review.
- [ ] Security review.
- [ ] QA review.
- [ ] Milestone owner acceptance.

## 10.8 Formal Status

The milestone follows:

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

`COMPLETE` requires evidence and tracking updates.

---
