# Kritva RaaS Frontend Task Backlog

## 1. Purpose

This document defines the implementation backlog for the Kritva RaaS frontend across the seven frozen frontend milestones.

It translates the frontend roadmap into actionable engineering tasks with stable task IDs, descriptions, dependencies, effort estimates, owner roles, and acceptance references.

The backlog supports:

- milestone planning and sequencing
- engineering effort estimation
- implementation assignment
- dependency tracking
- review and acceptance
- integration planning
- release readiness
- traceability between tasks, requirements, and tests

The canonical phase definition is maintained exclusively in:

    docs/planning/PHASES.md

The frontend roadmap is maintained in:

    docs/frontend/planning/FRONTEND_ROADMAP.md

The detailed scope of each frontend milestone is authoritative in its dossier under:

    docs/frontend/milestones/

This file is the consolidated frontend task inventory. Task-specific execution instructions and acceptance criteria should be maintained in task-scoped directories when implementation begins.

## 2. Backlog Governance

### 2.1 Sources of Authority

| Concern | Authoritative source |
|---|---|
| Phase names and boundaries | `docs/planning/PHASES.md` |
| Frontend milestone scope | `docs/frontend/milestones/` |
| Frontend sequencing | `docs/frontend/planning/FRONTEND_ROADMAP.md` |
| Cross-domain dependencies | `docs/planning/DEPENDENCY_MAP.md` |
| Program implementation sequence | `docs/planning/IMPLEMENTATION_ROADMAP.md` |
| Normative protocol contracts | `docs/protocol/` |
| Security requirements | `docs/security/` |
| Task status | `docs/tracking/TASK_STATUS.md` |
| Milestone status | `docs/tracking/MILESTONE_STATUS.md` |
| Task-specific acceptance | `docs/tasks/<TASK-ID>/ACCEPTANCE_CRITERIA.md` |

### 2.2 Task ID Format

Every task uses this format:

    KR-FE-<phase>-<nnn>

Examples:

- `KR-FE-P0-001`
- `KR-FE-P1-001`
- `KR-FE-P2-001`
- `KR-FE-P4-001`
- `KR-FE-P5-001`
- `KR-FE-P7-001`
- `KR-FE-P8-001`

The phase token must match the canonical phase that owns the task. The phase token is an identifier, not a redefinition of the phase.

A task's milestone field must use one of the seven frozen frontend milestones.

Tasks that support more than one phase must be assigned to the phase in which their principal deliverable is accepted. Cross-phase dependencies must be recorded explicitly.

### 2.3 Task Status Values

Use the following status values in the task tracker:

- `NOT_STARTED`
- `READY`
- `IN_PROGRESS`
- `BLOCKED`
- `IN_REVIEW`
- `ACCEPTED`
- `DEFERRED`
- `CANCELLED`

A task is not accepted solely because its code has been committed.

Acceptance requires implementation evidence, test results, review, and satisfaction of the task's acceptance criteria.

### 2.4 Effort Estimates

Effort is expressed in engineering person-days.

One person-day represents approximately eight productive engineering hours.

Estimates include implementation, local testing, documentation, and task-level review. They do not automatically include waiting time for another team, external approvals, or environment provisioning.

The estimates are planning estimates, not commitments.

For tasks with material uncertainty, use the upper end of the estimate until a technical investigation reduces uncertainty.

### 2.5 Owner Roles

| Role | Responsibility |
|---|---|
| FE Architect | Frontend architecture, contracts, technical decisions |
| FE Engineer | React, TypeScript, application features |
| Native Engineer | Tauri, Rust, IPC, filesystem and process integration |
| UX Engineer | Interaction design, accessibility, usability |
| FE Test Engineer | Component, contract, integration, and end-to-end testing |
| Security Engineer | Privacy, authentication, authorization, secure handling |
| Integration Engineer | Cross-domain integration and environment validation |
| FE Lead | Task assignment, review, dependency resolution, acceptance |

One role is the accountable owner. Additional contributors may be assigned in the task execution record.

## 3. Frozen Frontend Milestone Mapping

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 |
| F-M02 | PROJECTS | P1 |
| F-M03 | BUILD & ARTIFACT | P2 |
| F-M04 | BOOKING | P4 |
| F-M05 | EXECUTION | P5 |
| F-M06 | LIVE | P7 |
| F-M07 | RESULTS | P7 |

The phase mapping above is a reference to `docs/planning/PHASES.md`.

No task in this backlog creates or renames a phase or milestone.

## 4. Dependency Notation

Dependencies use the following notation:

- `None`: no prerequisite task in this backlog.
- `KR-FE-...`: prerequisite frontend task.
- `API:<contract>`: required API contract.
- `PROTO:<contract>`: required protocol contract.
- `BE:<milestone>`: backend milestone dependency.
- `DB:<milestone>`: database milestone dependency.
- `CLOUD:<milestone>`: cloud milestone dependency.
- `SEC:<requirement>`: security requirement.
- `EXT:<dependency>`: external tool, service, or environment.

A dependency may be an implementation dependency, a contract dependency, or an integration dependency. The task owner must clarify the dependency type in the task execution record.

A dependency listed as required must be resolved or replaced by an explicitly approved test substitute before final integration acceptance.

## 5. F-M01 STUDIO FOUNDATION

Phase mapping: P0-P1.

Authoritative scope: the F-M01 STUDIO FOUNDATION dossier under `docs/frontend/milestones/`.

### KR-FE-P0-001 — Establish Frontend Workspace

- **Description:** Establish the frontend workspace, package conventions, TypeScript configuration, linting, formatting, and reproducible development commands.
- **Milestone:** F-M01 STUDIO FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** None; `EXT:Node.js`; `EXT:pnpm`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M01 dossier; frontend development conventions; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Workspace configuration, scripts, package conventions, and developer instructions.
- **Acceptance:** Clean installation succeeds; lint, type-check, and test commands run consistently.

### KR-FE-P0-002 — Establish Frontend CI Checks

- **Description:** Add automated checks for installation, linting, type-checking, unit tests, and production compilation.
- **Milestone:** F-M01 STUDIO FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-FE-P0-001`; `CLOUD:C-M01 FOUNDATION`
- **Estimate:** 2–4 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M01 dossier; CI policy; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** CI workflow, failure reporting, and documented local equivalents.
- **Acceptance:** Required checks run automatically and block merging when required checks fail.

### KR-FE-P0-003 — Define Frontend Architecture Boundaries

- **Description:** Document UI, application-service, API-client, native-runtime, and shared-contract boundaries.
- **Milestone:** F-M01 STUDIO FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-FE-P0-001`; `API:API versioning`; `PROTO:API envelopes`
- **Estimate:** 2–3 person-days
- **Owner role:** FE Architect
- **Acceptance reference:** F-M01 dossier; frontend architecture; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Architecture notes, dependency rules, and module ownership.
- **Acceptance:** Feature code has documented dependency direction; direct infrastructure access from UI components is prohibited.

### KR-FE-P0-004 — Establish Shared UI Foundation

- **Description:** Implement reusable layout, typography, spacing, buttons, form controls, status indicators, dialogs, and feedback components.
- **Milestone:** F-M01 STUDIO FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-FE-P0-001`; `KR-FE-P0-003`
- **Estimate:** 5–8 person-days
- **Owner role:** UX Engineer
- **Acceptance reference:** F-M01 dossier; shared UI acceptance criteria; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Reusable component library and usage examples.
- **Acceptance:** Components support keyboard use, accessible labels, visible focus, and consistent validation feedback.

### KR-FE-P0-005 — Implement Application Shell and Navigation

- **Description:** Build the Studio window layout, primary navigation, page containers, breadcrumbs where needed, and global status area.
- **Milestone:** F-M01 STUDIO FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-FE-P0-004`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M01 dossier; UI acceptance criteria; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Navigable application shell and route definitions.
- **Acceptance:** All in-scope routes render; navigation state is predictable; invalid routes have a usable fallback.

### KR-FE-P0-006 — Define Typed API Client Foundation

- **Description:** Implement the shared HTTP client with base URL configuration, typed responses, error normalization, request correlation, and timeout handling.
- **Milestone:** F-M01 STUDIO FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-FE-P0-003`; `PROTO:API envelopes`; `PROTO:API errors`; `PROTO:API versioning`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M01 dossier; `docs/protocol/`; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** API client module and contract tests.
- **Acceptance:** Success and error responses are typed; credentials and sensitive request content are not written to logs.

### KR-FE-P0-007 — Establish Error, Loading, and Empty States

- **Description:** Implement shared handling for pending operations, empty collections, retryable failures, authorization errors, and unexpected failures.
- **Milestone:** F-M01 STUDIO FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-FE-P0-004`; `KR-FE-P0-006`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M01 dossier; UI acceptance criteria; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Shared state components and usage guidance.
- **Acceptance:** Each initial screen has defined loading, empty, success, and error behavior.

### KR-FE-P0-008 — Implement Tauri IPC Boundary

- **Description:** Define typed frontend-to-Rust commands, responses, errors, and operation identifiers for native operations.
- **Milestone:** F-M01 STUDIO FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-FE-P0-003`; `EXT:Tauri`
- **Estimate:** 4–7 person-days
- **Owner role:** Native Engineer
- **Acceptance reference:** F-M01 dossier; IPC contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** IPC types, native command registry, and tests.
- **Acceptance:** Commands are allowlisted; invalid inputs fail safely; errors do not expose secrets or unrestricted local paths.

### KR-FE-P0-009 — Establish Frontend Test Harness

- **Description:** Configure unit, component, and UI interaction tests, including deterministic fixtures and isolated test configuration.
- **Milestone:** F-M01 STUDIO FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-FE-P0-001`; `KR-FE-P0-004`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Test Engineer
- **Acceptance reference:** F-M01 dossier; frontend testing conventions; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Test configuration, example tests, and coverage reporting.
- **Acceptance:** CI executes tests; tests do not require production credentials or production data.

### KR-FE-P0-010 — Implement Authentication and Session UI

- **Description:** Integrate sign-in, sign-out, session restoration, expired-session handling, and authentication-required navigation.
- **Milestone:** F-M01 STUDIO FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-FE-P0-006`; `API:Authentication`; `API:Session`
- **Estimate:** 5–8 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M01 dossier; authentication and session contracts; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Authentication screens, session state, and protected-route handling.
- **Acceptance:** Expired sessions are handled safely; sign-out clears local session state; protected actions require valid authentication.

### KR-FE-P0-011 — Implement Organization Context

- **Description:** Display and manage the current organization context according to the identity and membership contracts.
- **Milestone:** F-M01 STUDIO FOUNDATION
- **Phase:** P0-P1
- **Dependencies:** `KR-FE-P0-010`; `API:Organization`; `BE:B-M01 CONTROL PLANE`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M01 dossier; organization contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Organization selector or context display, where applicable.
- **Acceptance:** Organization context is explicit and cannot be changed through untrusted client-side identifiers alone.

### KR-FE-P0-012 — Establish Accessibility and Visual Regression Checks

- **Description:** Add baseline accessibility checks and representative UI regression tests for the application shell and shared components.
- **Milestone:** F-M01 STUDIO FOUNDATION
- **Phase:** P0 FOUNDATION
- **Dependencies:** `KR-FE-P0-004`; `KR-FE-P0-005`; `KR-FE-P0-009`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Test Engineer
- **Acceptance reference:** F-M01 dossier; UI review checklist; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Accessibility test suite and baseline snapshots where appropriate.
- **Acceptance:** Critical accessibility violations fail required checks; snapshots are deterministic and reviewed.

### KR-FE-P1-013 — Integrate Local Runtime Status

- **Description:** Present local runtime availability, supported toolchain status, and actionable native-runtime errors.
- **Milestone:** F-M01 STUDIO FOUNDATION
- **Phase:** P1 STUDIO
- **Dependencies:** `KR-FE-P0-008`; `API:Local runtime status`; `EXT:Local runtime`
- **Estimate:** 3–5 person-days
- **Owner role:** Native Engineer
- **Acceptance reference:** F-M01 dossier; local runtime contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Runtime status view and native error mapping.
- **Acceptance:** Missing or unhealthy runtime dependencies are clearly reported; the UI does not claim readiness without native evidence.

### KR-FE-P1-014 — Establish Frontend Configuration Management

- **Description:** Define validated configuration for API endpoints, development modes, feature flags, and non-secret runtime settings.
- **Milestone:** F-M01 STUDIO FOUNDATION
- **Phase:** P1 STUDIO
- **Dependencies:** `KR-FE-P0-006`; `KR-FE-P0-008`
- **Estimate:** 2–4 person-days
- **Owner role:** FE Architect
- **Acceptance reference:** F-M01 dossier; configuration contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Typed configuration loader and validation tests.
- **Acceptance:** Invalid configuration fails clearly; secrets are not embedded in frontend bundles.

## 6. F-M02 PROJECTS

Phase mapping: P1.

Authoritative scope: the F-M02 PROJECTS dossier under `docs/frontend/milestones/`.

### KR-FE-P1-015 — Implement Project Listing

- **Description:** Display accessible projects with pagination, loading state, empty state, search or filtering where supported, and error recovery.
- **Milestone:** F-M02 PROJECTS
- **Phase:** P1 STUDIO
- **Dependencies:** `KR-FE-P0-006`; `KR-FE-P0-007`; `API:Project listing`; `BE:B-M01 CONTROL PLANE`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M02 dossier; project API contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Project list screen and tests.
- **Acceptance:** Results reflect backend authorization and pagination; empty and failure states are usable.

### KR-FE-P1-016 — Implement Project Creation

- **Description:** Provide validated project creation with name, description, organization context, and supported initial configuration.
- **Milestone:** F-M02 PROJECTS
- **Phase:** P1 STUDIO
- **Dependencies:** `KR-FE-P1-015`; `API:Project creation`; `BE:B-M01 CONTROL PLANE`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M02 dossier; project API contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Project creation form and mutation tests.
- **Acceptance:** Validation errors map to fields; duplicate submission is prevented or safely handled.

### KR-FE-P1-017 — Implement Project Details and Metadata

- **Description:** Display project metadata, ownership context, target configuration, and available project actions.
- **Milestone:** F-M02 PROJECTS
- **Phase:** P1 STUDIO
- **Dependencies:** `KR-FE-P1-015`; `KR-FE-P1-016`; `API:Project detail`
- **Estimate:** 3–4 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M02 dossier; project API contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Project detail screen and metadata components.
- **Acceptance:** Displayed values come from authoritative state; unauthorized access is handled.

### KR-FE-P1-018 — Implement Local Workspace Selection

- **Description:** Integrate native directory selection and validate the chosen local project workspace without uploading source files.
- **Milestone:** F-M02 PROJECTS
- **Phase:** P1 STUDIO
- **Dependencies:** `KR-FE-P0-008`; `KR-FE-P1-017`; `SEC:Source code privacy`
- **Estimate:** 4–6 person-days
- **Owner role:** Native Engineer
- **Acceptance reference:** F-M02 dossier; IPC contract; source privacy requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Workspace selection and validation workflow.
- **Acceptance:** Paths are validated natively; source content remains local; inaccessible directories produce actionable errors.

### KR-FE-P1-019 — Implement Project Open and Recent Projects

- **Description:** Allow users to open a project and return to recently used local workspaces where the product policy permits.
- **Milestone:** F-M02 PROJECTS
- **Phase:** P1 STUDIO
- **Dependencies:** `KR-FE-P1-017`; `KR-FE-P1-018`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M02 dossier; local workspace contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Open-project flow and recent-project presentation.
- **Acceptance:** Missing or moved workspaces are detected; stored references do not bypass filesystem authorization.

### KR-FE-P1-020 — Implement Project Target Selection

- **Description:** Allow selection and display of a target platform and supported version using the platform catalog contract.
- **Milestone:** F-M02 PROJECTS
- **Phase:** P1 STUDIO
- **Dependencies:** `KR-FE-P1-017`; `API:Platform catalog`; `BE:B-M03 PLATFORM`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M02 dossier; platform API contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Target selector and persisted project configuration.
- **Acceptance:** Unsupported or unavailable targets cannot be silently selected; current catalog state is visible.

### KR-FE-P1-021 — Implement Project Metadata Updates

- **Description:** Support updates to permitted project metadata and reflect server-side validation and concurrency errors.
- **Milestone:** F-M02 PROJECTS
- **Phase:** P1 STUDIO
- **Dependencies:** `KR-FE-P1-017`; `API:Project update`
- **Estimate:** 2–4 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M02 dossier; project API contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Metadata editor and mutation tests.
- **Acceptance:** Successful updates refresh authoritative state; stale writes are handled without silent data loss.

### KR-FE-P1-022 — Enforce Project Privacy in Diagnostics

- **Description:** Review project workflows for accidental source disclosure through logs, telemetry, crash reports, or diagnostic export.
- **Milestone:** F-M02 PROJECTS
- **Phase:** P1 STUDIO
- **Dependencies:** `KR-FE-P1-018`; `SEC:Source code privacy`; `SEC:Logging and diagnostics`
- **Estimate:** 3–5 person-days
- **Owner role:** Security Engineer
- **Acceptance reference:** F-M02 dossier; source privacy requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Privacy tests and findings report.
- **Acceptance:** Representative source paths and source contents are absent from remote diagnostics unless specifically approved by policy.

## 7. F-M03 BUILD & ARTIFACT

Phase mapping: P2.

Authoritative scope: the F-M03 BUILD & ARTIFACT dossier under `docs/frontend/milestones/`.

### KR-FE-P2-023 — Implement Toolchain Detection UI

- **Description:** Present available compiler/toolchain versions, target support, missing dependencies, and environment readiness.
- **Milestone:** F-M03 BUILD & ARTIFACT
- **Phase:** P2 BUILD & ARTIFACT
- **Dependencies:** `KR-FE-P1-018`; `KR-FE-P1-020`; `EXT:Build toolchain`; `BE:B-M03 PLATFORM`
- **Estimate:** 3–5 person-days
- **Owner role:** Native Engineer
- **Acceptance reference:** F-M03 dossier; local runtime contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Toolchain status screen and validation tests.
- **Acceptance:** Missing and incompatible toolchains are identified before a build starts.

### KR-FE-P2-024 — Implement Build Configuration

- **Description:** Provide a validated build configuration interface for the selected project and target platform.
- **Milestone:** F-M03 BUILD & ARTIFACT
- **Phase:** P2 BUILD & ARTIFACT
- **Dependencies:** `KR-FE-P2-023`; `KR-FE-P1-020`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M03 dossier; build configuration contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Build configuration form and persistence behavior.
- **Acceptance:** Invalid combinations are rejected before native execution; defaults are explicit.

### KR-FE-P2-025 — Implement Build Lifecycle Controls

- **Description:** Integrate build start, progress, completion, cancellation, and failure states through the local runtime.
- **Milestone:** F-M03 BUILD & ARTIFACT
- **Phase:** P2 BUILD & ARTIFACT
- **Dependencies:** `KR-FE-P2-024`; `KR-FE-P0-008`
- **Estimate:** 5–8 person-days
- **Owner role:** Native Engineer
- **Acceptance reference:** F-M03 dossier; local build IPC contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Build controller and lifecycle UI.
- **Acceptance:** Concurrent builds are handled according to policy; cancellation state is not reported as complete before confirmation.

### KR-FE-P2-026 — Implement Build Log Viewer

- **Description:** Display local build output with bounded buffering, filtering, safe text rendering, and useful error navigation.
- **Milestone:** F-M03 BUILD & ARTIFACT
- **Phase:** P2 BUILD & ARTIFACT
- **Dependencies:** `KR-FE-P2-025`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M03 dossier; UI acceptance criteria; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Build log viewer and rendering tests.
- **Acceptance:** Large logs do not freeze the UI; output is rendered as text; secrets are redacted according to policy.

### KR-FE-P2-027 — Implement Local Test Execution

- **Description:** Provide test execution controls and present test summaries, failures, and logs.
- **Milestone:** F-M03 BUILD & ARTIFACT
- **Phase:** P2 BUILD & ARTIFACT
- **Dependencies:** `KR-FE-P2-025`; `EXT:Local test runner`
- **Estimate:** 3–5 person-days
- **Owner role:** Native Engineer
- **Acceptance reference:** F-M03 dossier; local test contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Test execution view and result mapping.
- **Acceptance:** Failed tests block artifact readiness when required by the selected policy.

### KR-FE-P2-028 — Implement Artifact Manifest Validation

- **Description:** Display and validate required artifact manifest fields, including application identity, version, target architecture, runtime compatibility, capabilities, and entry point.
- **Milestone:** F-M03 BUILD & ARTIFACT
- **Phase:** P2 BUILD & ARTIFACT
- **Dependencies:** `KR-FE-P2-024`; `PROTO:Artifact manifest`; `BE:B-M02 ARTIFACT`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M03 dossier; `docs/protocol/ARTIFACT_MANIFEST.md`; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Manifest parser integration and validation presentation.
- **Acceptance:** Missing, malformed, or incompatible manifest fields are clearly identified.

### KR-FE-P2-029 — Implement Local Artifact Packaging

- **Description:** Integrate local package creation for the approved `.krv` format, including required binaries, libraries, configuration, and manifest.
- **Milestone:** F-M03 BUILD & ARTIFACT
- **Phase:** P2 BUILD & ARTIFACT
- **Dependencies:** `KR-FE-P2-027`; `KR-FE-P2-028`; `SEC:Artifact security`
- **Estimate:** 5–8 person-days
- **Owner role:** Native Engineer
- **Acceptance reference:** F-M03 dossier; artifact format contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Package operation and package validation tests.
- **Acceptance:** Package contents follow the allowlist; source files and secrets are excluded.

### KR-FE-P2-030 — Implement Checksum and Signature Status

- **Description:** Display checksum generation and verification results and integrate approved artifact signing status.
- **Milestone:** F-M03 BUILD & ARTIFACT
- **Phase:** P2 BUILD & ARTIFACT
- **Dependencies:** `KR-FE-P2-029`; `PROTO:Artifact manifest`; `SEC:Artifact signing`
- **Estimate:** 3–6 person-days
- **Owner role:** Security Engineer
- **Acceptance reference:** F-M03 dossier; artifact security requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Integrity status UI and verification tests.
- **Acceptance:** Invalid integrity or signature status cannot be presented as valid.

### KR-FE-P2-031 — Implement Artifact History

- **Description:** Present artifacts associated with the current project, including version, target, creation time, and authoritative validation state.
- **Milestone:** F-M03 BUILD & ARTIFACT
- **Phase:** P2 BUILD & ARTIFACT
- **Dependencies:** `KR-FE-P2-028`; `BE:B-M02 ARTIFACT`; `API:Artifact listing`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M03 dossier; artifact API contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Artifact list and details.
- **Acceptance:** The UI distinguishes local artifacts from remotely registered artifacts and displays current server state.

### KR-FE-P2-032 — Implement Artifact Upload Workflow

- **Description:** Integrate upload initiation, authorized transfer, progress, retry, completion, and server-side validation status.
- **Milestone:** F-M03 BUILD & ARTIFACT
- **Phase:** P2 BUILD & ARTIFACT
- **Dependencies:** `KR-FE-P2-029`; `KR-FE-P2-030`; `BE:B-M02 ARTIFACT`; `PROTO:Artifact upload`
- **Estimate:** 5–8 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M03 dossier; artifact upload contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Upload workflow and integration tests.
- **Acceptance:** Retry behavior is safe; completion and approval are separate states; unauthorized uploads fail.

### KR-FE-P2-033 — Implement Source Privacy Regression Tests

- **Description:** Test the complete project, build, packaging, and upload path for unintended source transfer.
- **Milestone:** F-M03 BUILD & ARTIFACT
- **Phase:** P2 BUILD & ARTIFACT
- **Dependencies:** `KR-FE-P2-025`; `KR-FE-P2-029`; `KR-FE-P2-032`; `SEC:Source code privacy`
- **Estimate:** 4–6 person-days
- **Owner role:** Security Engineer
- **Acceptance reference:** F-M03 dossier; source privacy requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Automated privacy regression suite and evidence.
- **Acceptance:** Tests detect source files or content crossing the remote boundary through supported normal workflows.

## 8. F-M04 BOOKING

Phase mapping: P4.

Authoritative scope: the F-M04 BOOKING dossier under `docs/frontend/milestones/`.

### KR-FE-P4-034 — Implement Platform Catalog Screen

- **Description:** Display available robotic platforms, versions, capabilities, compatibility, and supported configurations.
- **Milestone:** F-M04 BOOKING
- **Phase:** P4 BOOKING & COMMERCIAL
- **Dependencies:** `KR-FE-P1-020`; `BE:B-M03 PLATFORM`; `API:Platform catalog`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M04 dossier; platform API contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Platform discovery screen.
- **Acceptance:** Unavailable or unsupported platforms are clearly identified.

### KR-FE-P4-035 — Implement Resource Availability View

- **Description:** Display available booking windows, resource status, duration constraints, and stale-data indicators.
- **Milestone:** F-M04 BOOKING
- **Phase:** P4 BOOKING & COMMERCIAL
- **Dependencies:** `KR-FE-P4-034`; `BE:B-M04 BOOKING`; `API:Availability`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M04 dossier; availability contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Availability selector and refresh behavior.
- **Acceptance:** Availability is refreshed before booking submission; stale data is not presented as a reservation guarantee.

### KR-FE-P4-036 — Implement Booking Quote and Credit Estimate

- **Description:** Display server-generated booking quotes, applicable rate units, estimated consumption, and available platform-specific credit balance.
- **Milestone:** F-M04 BOOKING
- **Phase:** P4 BOOKING & COMMERCIAL
- **Dependencies:** `KR-FE-P4-034`; `KR-FE-P4-035`; `BE:B-M04 BOOKING`; `DB:DB-M03 BOOKING DATA`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M04 dossier; booking and credit contracts; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Quote and credit summary.
- **Acceptance:** Units and quote validity are explicit; the UI does not calculate authoritative charges independently.

### KR-FE-P4-037 — Implement Booking Creation and Confirmation

- **Description:** Integrate booking submission, idempotent retry, confirmation, and server-side conflict handling.
- **Milestone:** F-M04 BOOKING
- **Phase:** P4 BOOKING & COMMERCIAL
- **Dependencies:** `KR-FE-P4-035`; `KR-FE-P4-036`; `BE:B-M04 BOOKING`; `PROTO:Booking`
- **Estimate:** 5–7 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M04 dossier; booking contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Booking confirmation workflow.
- **Acceptance:** Duplicate submissions are safe; booking confirmation appears only after authoritative confirmation.

### KR-FE-P4-038 — Implement Booking History and Details

- **Description:** Present the user's accessible bookings, status, platform, time window, resource, and associated credit information.
- **Milestone:** F-M04 BOOKING
- **Phase:** P4 BOOKING & COMMERCIAL
- **Dependencies:** `KR-FE-P4-037`; `API:Booking listing`; `API:Booking detail`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M04 dossier; booking API contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Booking history and detail screens.
- **Acceptance:** Status reflects server state and refreshes after relevant operations.

### KR-FE-P4-039 — Implement Cancellation and Refund Status

- **Description:** Support permitted cancellation requests and display cancellation outcomes, credit adjustments, and refund status.
- **Milestone:** F-M04 BOOKING
- **Phase:** P4 BOOKING & COMMERCIAL
- **Dependencies:** `KR-FE-P4-038`; `BE:B-M04 BOOKING`; `API:Cancellation`; `API:Refund`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M04 dossier; cancellation and refund contracts; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Cancellation flow and refund-status display.
- **Acceptance:** Eligibility is confirmed by the backend; the UI does not promise a refund before authoritative status is returned.

### KR-FE-P4-040 — Test Booking Concurrency and Time-Zone Behavior

- **Description:** Validate frontend behavior for conflicting availability, stale quotes, daylight-saving transitions where relevant, and local time-zone display.
- **Milestone:** F-M04 BOOKING
- **Phase:** P4 BOOKING & COMMERCIAL
- **Dependencies:** `KR-FE-P4-035`; `KR-FE-P4-037`; `BE:B-M04 BOOKING`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Test Engineer
- **Acceptance reference:** F-M04 dossier; booking acceptance criteria; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Automated booking edge-case tests.
- **Acceptance:** Conflicts are surfaced clearly; canonical timestamps are handled consistently.

## 9. F-M05 EXECUTION

Phase mapping: P5.

Authoritative scope: the F-M05 EXECUTION dossier under `docs/frontend/milestones/`.

### KR-FE-P5-041 — Implement Execution Eligibility Summary

- **Description:** Present the current artifact, booking, platform, resource, and authorization conditions required to request execution.
- **Milestone:** F-M05 EXECUTION
- **Phase:** P5 EXECUTION
- **Dependencies:** `KR-FE-P2-031`; `KR-FE-P4-038`; `BE:B-M05 EXECUTION`; `API:Execution eligibility`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M05 dossier; execution API contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Eligibility summary and blocked-state presentation.
- **Acceptance:** Eligibility is sourced from the backend; unresolved conditions are explicit.

### KR-FE-P5-042 — Implement Job Creation

- **Description:** Integrate Job creation from an approved artifact and eligible booking, including idempotency and response handling.
- **Milestone:** F-M05 EXECUTION
- **Phase:** P5 EXECUTION
- **Dependencies:** `KR-FE-P5-041`; `BE:B-M05 EXECUTION`; `PROTO:Job`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M05 dossier; Job contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Job submission flow and tests.
- **Acceptance:** The UI distinguishes accepted submission from execution start; retries do not unintentionally create duplicate Jobs.

### KR-FE-P5-043 — Implement Job and Run Status Views

- **Description:** Present Job orchestration state and Run attempt state as separate entities with independent identifiers and lifecycle details.
- **Milestone:** F-M05 EXECUTION
- **Phase:** P5 EXECUTION
- **Dependencies:** `KR-FE-P5-042`; `BE:B-M05 EXECUTION`; `PROTO:Job`; `PROTO:Run`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M05 dossier; Job and Run contracts; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Execution details and status components.
- **Acceptance:** Job and Run states are never silently collapsed into one lifecycle.

### KR-FE-P5-044 — Implement Execution Controls

- **Description:** Integrate supported start, stop, and cancellation requests with explicit pending, accepted, completed, and failed states.
- **Milestone:** F-M05 EXECUTION
- **Phase:** P5 EXECUTION
- **Dependencies:** `KR-FE-P5-043`; `BE:B-M05 EXECUTION`; `PROTO:Execution commands`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M05 dossier; execution command contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Execution control components and integration tests.
- **Acceptance:** The UI does not report a successful stop until supported authoritative evidence confirms the result.

### KR-FE-P5-045 — Implement Execution Event Subscription

- **Description:** Subscribe to authorized execution events and reconcile event updates with durable Job and Run state.
- **Milestone:** F-M05 EXECUTION
- **Phase:** P5 EXECUTION
- **Dependencies:** `KR-FE-P5-043`; `PROTO:WebSocket`; `PROTO:Event envelope`; `BE:B-M05 EXECUTION`
- **Estimate:** 4–7 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M05 dossier; WebSocket and event contracts; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Event subscription service and deduplication tests.
- **Acceptance:** Duplicate events are tolerated; gaps trigger reconciliation where supported.

### KR-FE-P5-046 — Implement Reconnect and State Reconciliation

- **Description:** Recover from network interruptions by reconnecting, refreshing durable state, and resuming authorized subscriptions without resubmitting execution commands.
- **Milestone:** F-M05 EXECUTION
- **Phase:** P5 EXECUTION
- **Dependencies:** `KR-FE-P5-045`; `PROTO:WebSocket`; `API:Job detail`; `API:Run detail`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M05 dossier; reconnect requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Reconnection state machine and integration tests.
- **Acceptance:** Reconnection never restarts execution; displayed state is reconciled against the backend.

### KR-FE-P5-047 — Implement Execution Failure and Timeout UX

- **Description:** Present execution validation failures, resource allocation errors, deployment failures, runtime errors, and timeouts with actionable recovery guidance.
- **Milestone:** F-M05 EXECUTION
- **Phase:** P5 EXECUTION
- **Dependencies:** `KR-FE-P5-043`; `PROTO:API errors`; `BE:B-M05 EXECUTION`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M05 dossier; error contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Error mapping and recovery guidance.
- **Acceptance:** Error messages do not expose secrets and do not claim recovery has occurred without evidence.

### KR-FE-P5-048 — Implement Safety-State Presentation

- **Description:** Present safety-related status supplied by authorized system interfaces, clearly separating software controls from physical emergency-stop mechanisms.
- **Milestone:** F-M05 EXECUTION
- **Phase:** P5 EXECUTION
- **Dependencies:** `KR-FE-P5-043`; `SEC:Safety requirements`; `API:Safety status`
- **Estimate:** 4–6 person-days
- **Owner role:** Security Engineer
- **Acceptance reference:** F-M05 dossier; safety requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Safety-state UI and reviewed behavior.
- **Acceptance:** Unknown status is not shown as safe; software Stop is not represented as emergency stop; human safety review is recorded where required.

## 10. F-M06 LIVE

Phase mapping: P7.

Authoritative scope: the F-M06 LIVE dossier under `docs/frontend/milestones/`.

### KR-FE-P7-049 — Implement Live Session Initialization

- **Description:** Create or retrieve an authorized live session for a selected Job or Run and manage its lifecycle.
- **Milestone:** F-M06 LIVE
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P5-043`; `BE:B-M05 EXECUTION`; `PROTO:Live session`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M06 dossier; live session contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Live-session controller and tests.
- **Acceptance:** Unauthorized or expired sessions are rejected; session failure does not change execution state.

### KR-FE-P7-050 — Implement WebRTC Video View

- **Description:** Integrate approved WebRTC signaling, video connection, playback, and media-error presentation.
- **Milestone:** F-M06 LIVE
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P7-049`; `PROTO:WebRTC signaling`; `BE:B-M06 RESULTS`; `CLOUD:C-M03 STAGING`
- **Estimate:** 5–8 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M06 dossier; video signaling contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Video panel and connection tests.
- **Acceptance:** Media errors are distinguishable from execution errors; authorization and session expiry are handled.

### KR-FE-P7-051 — Implement Telemetry Panels

- **Description:** Render agreed telemetry streams with units, timestamps, freshness indicators, and bounded update rates.
- **Milestone:** F-M06 LIVE
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P7-049`; `PROTO:Telemetry`; `BE:B-M06 RESULTS`
- **Estimate:** 4–7 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M06 dossier; telemetry contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Telemetry panels and rendering tests.
- **Acceptance:** Stale or missing telemetry is not presented as current; units are displayed consistently.

### KR-FE-P7-052 — Implement Live Log Streaming

- **Description:** Display authorized live logs with filtering, safe rendering, bounded memory use, and clear connection state.
- **Milestone:** F-M06 LIVE
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P7-049`; `PROTO:Logs`; `PROTO:WebSocket`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M06 dossier; log and WebSocket contracts; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Live log panel and stream tests.
- **Acceptance:** Large streams do not freeze the application; sensitive values are redacted according to policy.

### KR-FE-P7-053 — Implement Lab and Robot Connectivity Indicators

- **Description:** Present Lab Agent connectivity, Robot availability, and relevant platform state using authoritative status information.
- **Milestone:** F-M06 LIVE
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P7-049`; `BE:B-M03 PLATFORM`; `BE:B-M06 RESULTS`; `PROTO:Lab status`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M06 dossier; platform and Lab status contracts; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Connectivity indicators and tests.
- **Acceptance:** Unknown, stale, and disconnected states remain distinguishable.

### KR-FE-P7-054 — Implement Live Reconnect and Resource Cleanup

- **Description:** Handle reconnect, subscription recovery, session teardown, and cleanup of media and event resources.
- **Milestone:** F-M06 LIVE
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P7-050`; `KR-FE-P7-051`; `KR-FE-P7-052`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M06 dossier; live session requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Cleanup lifecycle and reconnect tests.
- **Acceptance:** Reconnect does not duplicate subscriptions indefinitely or restart execution; unmounted views release resources.

### KR-FE-P7-055 — Test Live Performance and Failure Modes

- **Description:** Test high-rate telemetry, extended logs, video interruption, token expiry, reconnect storms, and simultaneous live panels.
- **Milestone:** F-M06 LIVE
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P7-050`; `KR-FE-P7-051`; `KR-FE-P7-052`; `KR-FE-P7-054`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Test Engineer
- **Acceptance reference:** F-M06 dossier; performance and resilience criteria; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Test results and identified performance limits.
- **Acceptance:** UI remains responsive within the agreed operating envelope; failures are isolated and recoverable where supported.

## 11. F-M07 RESULTS

Phase mapping: P7.

Authoritative scope: the F-M07 RESULTS dossier under `docs/frontend/milestones/`.

### KR-FE-P7-056 — Implement Results Listing

- **Description:** Display accessible Results with filters, pagination, status, creation time, and associated Job and Run references.
- **Milestone:** F-M07 RESULTS
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P5-043`; `BE:B-M06 RESULTS`; `API:Result listing`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M07 dossier; Result API contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Results list and tests.
- **Acceptance:** Pagination and filters preserve authorization; empty and failure states are implemented.

### KR-FE-P7-057 — Implement Result Detail View

- **Description:** Present Result metadata, lifecycle status, associated Run, platform, artifact, and available result files.
- **Milestone:** F-M07 RESULTS
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P7-056`; `API:Result detail`; `BE:B-M06 RESULTS`
- **Estimate:** 3–5 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M07 dossier; Result contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Result details screen.
- **Acceptance:** Result identity and source Run are explicit; unavailable data is not fabricated.

### KR-FE-P7-058 — Implement Result File Browser and Downloads

- **Description:** Display result files and integrate authorized download requests, status, expiration, and error handling.
- **Milestone:** F-M07 RESULTS
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P7-057`; `API:Result files`; `API:Downloads`; `BE:B-M06 RESULTS`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M07 dossier; file and download contracts; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** File browser and download controller.
- **Acceptance:** Unauthorized downloads fail; expired links are handled; filenames and content types are validated.

### KR-FE-P7-059 — Implement Result Metrics Visualization

- **Description:** Present structured numeric, integer, Boolean, and string metrics with units and supported aggregation metadata.
- **Milestone:** F-M07 RESULTS
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P7-057`; `API:Result metrics`; `BE:B-M06 RESULTS`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M07 dossier; metric contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Metrics components and data validation tests.
- **Acceptance:** Missing values and units are handled correctly; charts do not imply unsupported precision.

### KR-FE-P7-060 — Implement Experiment Management

- **Description:** Provide experiment creation, naming, Run membership, experiment status, and experiment detail views.
- **Milestone:** F-M07 RESULTS
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P7-056`; `API:Experiment`; `BE:B-M06 RESULTS`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M07 dossier; Experiment contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Experiment workflows and tests.
- **Acceptance:** Membership changes reflect server state; Runs retain their original identity and history.

### KR-FE-P7-061 — Implement Result Comparison

- **Description:** Support creating and viewing comparisons across eligible Results, including metric alignment and comparability warnings.
- **Milestone:** F-M07 RESULTS
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P7-059`; `KR-FE-P7-060`; `API:Comparison`; `BE:B-M06 RESULTS`
- **Estimate:** 5–8 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M07 dossier; Comparison contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Comparison workflow and visualization.
- **Acceptance:** Incompatible metrics are not silently compared; the server remains authoritative for comparison state.

### KR-FE-P7-062 — Implement Rerun Workflow

- **Description:** Allow an authorized user to initiate a new execution from an eligible historical configuration, with explicit confirmation of the new execution.
- **Milestone:** F-M07 RESULTS
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P7-057`; `KR-FE-P5-042`; `BE:B-M05 EXECUTION`; `BE:B-M06 RESULTS`
- **Estimate:** 4–6 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M07 dossier; rerun contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Rerun action and confirmation flow.
- **Acceptance:** Rerun creates a new Job and Run; historical Result records are not overwritten.

### KR-FE-P7-063 — Implement Result Retention and Availability States

- **Description:** Display relevant result retention, archival, and availability states supported by the API.
- **Milestone:** F-M07 RESULTS
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P7-057`; `API:Result retention`; `BE:B-M06 RESULTS`
- **Estimate:** 2–4 person-days
- **Owner role:** FE Engineer
- **Acceptance reference:** F-M07 dossier; result retention contract; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Retention-state indicators and tests.
- **Acceptance:** The UI does not imply that archived or purged data remains downloadable.

### KR-FE-P7-064 — Test Results Workflow End to End

- **Description:** Validate the complete Results workflow from completed Run through result listing, file download, metrics, comparison, and rerun.
- **Milestone:** F-M07 RESULTS
- **Phase:** P7 LIVE & RESULTS
- **Dependencies:** `KR-FE-P7-056`; `KR-FE-P7-057`; `KR-FE-P7-058`; `KR-FE-P7-059`; `KR-FE-P7-060`; `KR-FE-P7-061`; `KR-FE-P7-062`
- **Estimate:** 4–7 person-days
- **Owner role:** FE Test Engineer
- **Acceptance reference:** F-M07 dossier; end-to-end test plan; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Automated workflow tests and execution evidence.
- **Acceptance:** The workflow preserves Result history, enforces authorization, and handles expected failure paths.

## 12. Cross-Milestone Engineering Tasks

### KR-FE-P8-065 — Perform Frontend Security Review

- **Description:** Review authentication, session handling, IPC, source privacy, artifact upload, downloads, live access, and sensitive logging across the frontend.
- **Milestone:** F-M07 RESULTS
- **Phase:** P8 PRODUCTION
- **Dependencies:** `KR-FE-P0-010`; `KR-FE-P0-008`; `KR-FE-P2-033`; `KR-FE-P4-039`; `KR-FE-P5-048`; `KR-FE-P7-058`; `SEC:Security requirements`; `BE:B-M07 PRODUCTION`
- **Estimate:** 5–8 person-days
- **Owner role:** Security Engineer
- **Acceptance reference:** B-M07 PRODUCTION dossier; security requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Security review report and tracked remediation.
- **Acceptance:** Critical findings are resolved or explicitly block production acceptance; evidence is recorded.

### KR-FE-P8-066 — Perform Cross-Platform Qualification

- **Description:** Qualify Studio on the supported P0-P1 operating-system targets and validate native integration, filesystem behavior, and build execution.
- **Milestone:** F-M01 STUDIO FOUNDATION
- **Phase:** P8 PRODUCTION
- **Dependencies:** `KR-FE-P0-008`; `KR-FE-P1-018`; `KR-FE-P2-025`; `BE:B-M07 PRODUCTION`
- **Estimate:** 5–8 person-days
- **Owner role:** FE Test Engineer
- **Acceptance reference:** F-M01 dossier; release qualification plan; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Cross-platform qualification report.
- **Acceptance:** All declared supported targets pass required smoke and integration tests; unsupported targets are documented.

### KR-FE-P8-067 — Validate Frontend Observability and Diagnostics

- **Description:** Verify useful operational diagnostics while preventing secrets, source contents, and sensitive identifiers from being exposed.
- **Milestone:** F-M07 RESULTS
- **Phase:** P8 PRODUCTION
- **Dependencies:** `KR-FE-P0-006`; `KR-FE-P2-033`; `KR-FE-P5-047`; `SEC:Logging and diagnostics`; `BE:B-M07 PRODUCTION`
- **Estimate:** 3–5 person-days
- **Owner role:** Integration Engineer
- **Acceptance reference:** B-M07 PRODUCTION dossier; observability and security requirements; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Diagnostic validation report and redaction tests.
- **Acceptance:** Errors are traceable through correlation identifiers without exposing secrets or source content.

### KR-FE-P8-068 — Complete Frontend Release Qualification

- **Description:** Execute the frontend release checklist, verify supported workflows, record known issues, and produce release evidence.
- **Milestone:** F-M07 RESULTS
- **Phase:** P8 PRODUCTION
- **Dependencies:** `KR-FE-P8-065`; `KR-FE-P8-066`; `KR-FE-P8-067`; `BE:B-M07 PRODUCTION`; `CLOUD:C-M04 PRODUCTION`
- **Estimate:** 4–7 person-days
- **Owner role:** FE Lead
- **Acceptance reference:** Frontend roadmap; release roadmap; task-scoped `ACCEPTANCE_CRITERIA.md`
- **Deliverables:** Release qualification record and sign-off recommendation.
- **Acceptance:** Required checks pass; blocking defects are resolved; remaining risks are explicitly documented.

## 13. Milestone Task Summary

| Milestone | Task range | Task count | Primary outcome |
|---|---|---:|---|
| F-M01 STUDIO FOUNDATION | KR-FE-P0-001 to KR-FE-P1-014 | 14 | Application foundation, native boundary, authentication, session, and configuration |
| F-M02 PROJECTS | KR-FE-P1-015 to KR-FE-P1-022 | 8 | Project workflows and local workspace integration |
| F-M03 BUILD & ARTIFACT | KR-FE-P2-023 to KR-FE-P2-033 | 11 | Local build, test, package, validation, and upload |
| F-M04 BOOKING | KR-FE-P4-034 to KR-FE-P4-040 | 7 | Platform selection, availability, credits, and booking |
| F-M05 EXECUTION | KR-FE-P5-041 to KR-FE-P5-048 | 8 | Job/Run lifecycle, controls, events, and safety-state presentation |
| F-M06 LIVE | KR-FE-P7-049 to KR-FE-P7-055 | 7 | Video, telemetry, logs, connectivity, and reconnect |
| F-M07 RESULTS | KR-FE-P7-056 to KR-FE-P7-064 | 9 | Results, files, metrics, experiments, comparisons, and rerun |
| Cross-milestone production qualification | KR-FE-P8-065 to KR-FE-P8-068 | 4 | Security, cross-platform, diagnostics, and release qualification |
| **Total** | **KR-FE-P0-001 to KR-FE-P8-068** | **68** | **End-to-end frontend delivery and qualification** |

The task count represents the inventory in this document. It is not a completion count.

## 14. Effort Estimation Summary

Estimates are expressed in engineering person-days.

| Milestone or group | Low estimate | High estimate |
|---|---:|---:|
| F-M01 STUDIO FOUNDATION | 46 | 76 |
| F-M02 PROJECTS | 21 | 34 |
| F-M03 BUILD & ARTIFACT | 43 | 69 |
| F-M04 BOOKING | 26 | 40 |
| F-M05 EXECUTION | 31 | 49 |
| F-M06 LIVE | 26 | 42 |
| F-M07 RESULTS | 34 | 55 |
| Cross-milestone production qualification | 17 | 28 |
| **Total estimated effort** | **244** | **393** |

These totals are planning ranges and must be recalculated if task scope or dependencies change.

They exclude backend, database, cloud, protocol ownership, external vendor work, and project management effort not explicitly represented by a frontend task.

## 15. Dependency and Sequencing Rules

1. Establish the application and contract foundations before implementing feature screens.
2. Complete project and workspace integration before local build workflows depend on it.
3. Validate build and packaging contracts before enabling remote artifact upload.
4. Use backend-generated availability and quotes for booking.
5. Require authoritative artifact, booking, and platform eligibility before execution.
6. Keep Job and Run models separate.
7. Complete event reconciliation before relying on live execution updates.
8. Complete live session authorization before video and telemetry integration.
9. Build Results around durable backend records.
10. Treat rerun as creation of a new execution.
11. Do not accept frontend integration solely on mocked API behavior.
12. Track missing protocol contracts as explicit blockers.
13. Do not bypass security acceptance for schedule reasons.
14. Keep milestone completion evidence in the task and milestone tracking systems.

## 16. Definition of Ready

A task is ready for implementation when:

- [ ] Its task ID is stable.
- [ ] Its milestone and phase are correct.
- [ ] Its description defines a reviewable deliverable.
- [ ] Dependencies are identified.
- [ ] Required API or protocol contracts are available or approved for development.
- [ ] Acceptance criteria are recorded.
- [ ] Test expectations are clear.
- [ ] Owner role is assigned.
- [ ] Security and privacy implications are reviewed.
- [ ] External prerequisites are visible.

## 17. Definition of Done

A task is done when:

- [ ] Implementation matches the accepted scope.
- [ ] Relevant unit tests pass.
- [ ] Relevant component tests pass.
- [ ] API or IPC contract tests pass where applicable.
- [ ] Integration tests pass where applicable.
- [ ] Error and failure behavior is tested.
- [ ] Accessibility expectations are satisfied.
- [ ] Security and privacy expectations are satisfied.
- [ ] Code review is complete.
- [ ] Documentation is updated.
- [ ] Acceptance evidence is recorded.
- [ ] The task status is updated to `ACCEPTED`.

## 18. Backlog Maintenance

The FE Lead maintains this inventory.

Changes must preserve:

- canonical task ID format
- frozen milestone names
- frozen phase names and numbers
- explicit dependencies
- estimate units
- accountable owner roles
- acceptance traceability

New tasks must use unused IDs and the correct phase token.

Task-specific details belong in:

    docs/tasks/<TASK-ID>/TASK.md
    docs/tasks/<TASK-ID>/ACCEPTANCE_CRITERIA.md

The task backlog must not duplicate the complete contents of every task dossier.

The canonical phase definition remains in `docs/planning/PHASES.md`.

## 19. Backlog Acceptance Checklist

- [ ] All seven frontend milestones are represented.
- [ ] Every task has a stable ID.
- [ ] Every task has a title.
- [ ] Every task has a description.
- [ ] Every task names its milestone.
- [ ] Every task names its phase.
- [ ] Every task lists dependencies.
- [ ] Every task has an effort estimate.
- [ ] Every task has an owner role.
- [ ] Every task has an acceptance reference.
- [ ] Backend dependencies use canonical milestone IDs.
- [ ] Database dependencies use canonical milestone IDs.
- [ ] Cloud dependencies use canonical milestone IDs.
- [ ] Protocol dependencies are explicit.
- [ ] Source-code privacy is covered.
- [ ] Job and Run remain distinct.
- [ ] Live and Results dependencies are represented.
- [ ] Production qualification is represented.
- [ ] Phase definitions are delegated to `docs/planning/PHASES.md`.
- [ ] Detailed milestone scope remains delegated to milestone dossiers.

## 20. Final Invariants

1. This file is the consolidated frontend task inventory.
2. `docs/planning/PHASES.md` is the canonical phase definition.
3. The existing milestone dossiers under `docs/frontend/milestones/` are authoritative for milestone scope.
4. Task IDs follow `KR-FE-<phase>-<nnn>`.
5. Task estimates use engineering person-days.
6. Every task has an accountable owner role and acceptance reference.
7. Backend business state is authoritative.
8. Source code remains local during the normal workflow.
9. Only approved artifacts cross the remote execution boundary.
10. Job and Run are separate entities.
11. Reconnection does not restart execution.
12. Unknown safety state is not presented as safe.
13. Historical Results are not overwritten by reruns.
14. Security, privacy, accessibility, and integration testing are part of acceptance.
15. No task changes the frozen phase or milestone model.

## 21. Changelog

### Current Baseline

- Established a consolidated frontend task backlog.
- Organized feature tasks under F-M01 through F-M07.
- Assigned phase tokens according to the canonical phase mapping.
- Added explicit backend, database, cloud, protocol, and security dependencies.
- Added person-day estimates and accountable owner roles.
- Added acceptance references for all tasks.
- Included source privacy, execution safety, reconnect, Results, and production qualification tasks.
- Delegated canonical phase definitions to `docs/planning/PHASES.md`.
- Delegated detailed milestone scope to the authoritative milestone dossiers.

### Future Changes

Every approved change should record:

- date
- task ID
- milestone
- phase
- change description
- dependency impact
- estimate impact
- acceptance impact
- review status
