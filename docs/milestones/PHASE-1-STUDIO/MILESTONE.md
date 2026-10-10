# P1 STUDIO — Milestone Dossier

**Primary Phase:** P1 STUDIO  
**Supporting Phases:** P0 FOUNDATION; P2 BUILD & ARTIFACT; P3 CONTROL PLANE; P4 BOOKING & COMMERCIAL; P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS; P8 PRODUCTION  
**Document Type:** Phase milestone dossier  
**Document Path:** `docs/milestones/PHASE-1-STUDIO/MILESTONE.md`  
**Status:** Planning baseline  
**Scope Focus:** Desktop Studio foundation, native application shell, local user experience, runtime boundary, and desktop development workflow.

## Ownership and Boundaries

This document defines the objective, scope, dependencies, deliverables, risks, and exit criteria for **P1 STUDIO**, with a specific focus on establishing the desktop Studio foundation.

It describes the expected outcomes and boundaries of the phase. It does not replace task-level implementation plans, acceptance evidence, review records, or global project policy.

The following sibling files are authoritative for their respective purposes:

- `TASKS.md` — the P1 task inventory, task identifiers, dependencies, implementation order, and task ownership.
- `ACCEPTANCE_CRITERIA.md` — detailed acceptance requirements and evidence expectations for this phase.
- `REVIEW_CHECKLIST.md` — review checks for implementation quality, integration, and completeness.
- `CHANGELOG.md` — the recorded changes associated with this phase.
- `GIT_COMMIT_STEP.md` — the prescribed commit, verification, and repository-recording steps.

These files MUST be maintained as separate artifacts. This dossier MUST link to them rather than reproduce their contents.

Other documentation owns the following concerns:

| Concern | Authoritative owner |
|---|---|
| Canonical phase definitions | `docs/planning/PHASES.md` |
| System-level architecture and product-wide decisions | Applicable documents under `docs/architecture/` and `docs/planning/DECISIONS.md` |
| Frontend architecture | Applicable documents under `docs/frontend/architecture/` |
| Frontend development setup | `docs/frontend/development/DEVELOPMENT_SETUP.md` |
| Frontend development workflow | `docs/frontend/development/DEVELOPMENT_WORKFLOW.md` |
| Frontend testing procedures | `docs/frontend/development/TESTING.md` |
| Frontend release and packaging procedures | `docs/frontend/development/RELEASE_PROCESS.md` |
| Global development setup | `docs/development/DEVELOPMENT_SETUP.md` |
| Global development workflow | Applicable documents under `docs/development/` |
| Global testing strategy | `docs/development/TESTING_STRATEGY.md` |
| Global release policy | `docs/development/RELEASE_PROCESS.md` |
| Backend architecture and service implementation | Applicable documents under `docs/backend/architecture/` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| API and event wire contracts | Applicable documents under `docs/protocol/` |
| Database architecture and persistence policy | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Cloud topology and infrastructure | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Application security and trust boundaries | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Cloud infrastructure security | `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` |
| Frontend milestone scope and acceptance | Authoritative dossiers under `docs/frontend/milestones/` |
| Backend milestone scope and acceptance | Authoritative dossiers under `docs/backend/milestones/` |
| Database milestone scope and acceptance | Authoritative dossiers under `docs/database/milestones/` |
| Cloud milestone scope and acceptance | Authoritative dossiers under `docs/cloud/milestones/` |
| Other phase-level scope and acceptance | Applicable authoritative dossiers under `docs/**/milestones/` |

This dossier owns the phase-level outcomes for the desktop Studio foundation. It does not own the complete implementation architecture, global engineering policy, backend service behavior, cloud infrastructure, or downstream milestone acceptance.

---

# 1. Objective

## 1.1 Primary Objective

P1 STUDIO establishes the desktop Studio foundation for Kritva RaaS.

The objective is to provide a usable, maintainable desktop application shell that gives users a consistent starting point for accessing the platform while establishing a clear boundary between the desktop user interface, local desktop capabilities, and backend services.

The phase builds on the repository, contract, and engineering foundations established in P0 FOUNDATION.

P1 STUDIO MUST establish a coherent desktop development and validation path without attempting to implement every product workflow.

The result should be a desktop application that can be built, launched, tested, and extended through a documented and repeatable workflow.

## 1.2 Intended Outcomes

P1 STUDIO aims to establish:

1. A native desktop application structure suitable for continued development.
2. A consistent application shell and navigation foundation.
3. A clear separation between presentation logic and desktop-specific capabilities.
4. A defined communication boundary between the desktop application and backend services.
5. A controlled approach to local configuration and runtime state.
6. A predictable startup, shutdown, and error-reporting experience.
7. A baseline strategy for desktop packaging and platform-specific integration.
8. Automated validation for the implemented desktop foundation.
9. A repeatable development workflow for frontend and desktop contributors.
10. A foundation that can accommodate later Studio features without requiring a redesign of the application shell.

## 1.3 Desktop-First Scope

The primary deliverable is the desktop Studio application.

The phase MAY establish reusable frontend components or conventions where they directly support the desktop foundation.

However, a reusable UI component does not transfer ownership of backend APIs, database schemas, cloud infrastructure, or global product architecture to the frontend domain.

The desktop application MUST use explicit boundaries for backend communication and operating-system integration.

## 1.4 User Experience Objective

The initial desktop experience SHOULD provide:

- A predictable application startup.
- A recognizable application shell.
- Consistent navigation structure.
- Clear loading, success, and error feedback where applicable.
- A coherent approach to empty and unavailable states.
- Consistent layout and interaction conventions.
- Accessible interaction patterns appropriate to the selected UI technology.
- Useful diagnostic information when initialization or integration fails.

These outcomes establish a usable foundation. They do not imply that all later product workflows are available.

## 1.5 Engineering Objective

The desktop foundation MUST be maintainable by contributors who can follow the documented setup and development process.

The implementation SHOULD support:

- Repeatable local builds.
- Automated tests.
- Clear separation of UI and native capabilities.
- Explicit application configuration.
- Controlled dependency management.
- Reviewable changes.
- Useful diagnostics.
- A documented packaging path.

The detailed frontend implementation architecture and development workflow remain owned by their respective documents.

## 1.6 Relationship to the Canonical Phase Model

P1 STUDIO depends on the foundation established in P0 FOUNDATION and supports subsequent phases through a stable desktop application shell and development workflow.

| Phase | Canonical name | Relationship to P1 STUDIO |
|---|---|---|
| P0 | FOUNDATION | Supplies repository conventions, contracts, CI, and skeleton application foundations |
| P1 | STUDIO | Establishes the desktop Studio foundation |
| P2 | BUILD & ARTIFACT | May extend the desktop application with build and artifact workflows |
| P3 | CONTROL PLANE | May integrate desktop experiences with control-plane services |
| P4 | BOOKING & COMMERCIAL | May integrate booking and commercial workflows |
| P5 | EXECUTION | May integrate execution-related workflows |
| P6 | LAB & ROBOT | May integrate lab and robot workflows |
| P7 | LIVE & RESULTS | May integrate live operation and results experiences |
| P8 | PRODUCTION | May extend the desktop experience for production use where applicable |

This table describes the relationship between phases. It does not redefine their scope or acceptance criteria.

---

# 2. Scope and Non-Scope

## 2.1 In Scope

P1 STUDIO covers the foundation required to develop, launch, test, and extend the desktop Studio application.

The scope includes:

- Desktop application structure.
- Native application shell.
- Application startup and shutdown.
- Baseline navigation.
- Shared UI layout foundations.
- Desktop-specific configuration.
- UI-to-native boundary.
- UI-to-backend communication boundary.
- Local application state required by the shell.
- Basic loading, error, and empty states.
- Desktop logging and diagnostic integration.
- Initial platform-specific application configuration.
- Development build and launch workflow.
- Automated desktop and frontend validation.
- Initial packaging configuration where required to prove the desktop build path.
- Documentation discoverability for desktop contributors.
- Coding-agent integration foundation and project-scoped coding-agent sessions (Section 2.10a).

Detailed task ownership and acceptance conditions are maintained in the sibling files.

## 2.2 Desktop Application Structure

The application MUST have a clearly identifiable entry point and maintainable internal organization.

The structure SHOULD distinguish, as appropriate:

- Application initialization.
- UI shell and navigation.
- Reusable presentation components.
- Feature-level UI modules.
- Backend communication clients.
- Desktop-native integration.
- Configuration.
- State management.
- Tests and fixtures.

The exact package and directory layout is owned by the frontend architecture and implementation documentation.

This milestone requires a coherent structure, not a particular directory naming scheme unless that scheme is already adopted by the repository.

## 2.3 Native Desktop Shell

The application MUST provide a working desktop shell using the selected desktop framework.

The shell SHOULD establish:

- Application window creation.
- Initial window configuration.
- Startup behavior.
- Basic navigation structure.
- A consistent layout.
- Appropriate handling of application initialization failures.
- A controlled shutdown path.
- A clear boundary between web-based UI rendering and native desktop capabilities.

The shell MUST NOT expose unrestricted operating-system capabilities to the UI.

Native operations SHOULD be exposed through explicit, narrowly scoped interfaces.

## 2.4 Desktop Framework Integration

The implementation MUST follow the desktop framework selected by the project.

Where Tauri is the selected framework, the foundation SHOULD clearly separate the frontend application from the Rust-based native runtime and its command interface.

The exact framework choice, dependency versions, permissions, and project configuration MUST be recorded in the appropriate architecture and implementation documents.

This dossier does not independently establish a new technology decision.

If the selected framework changes, the implementation and acceptance records MUST reflect the approved decision.

## 2.5 Application Initialization

The desktop application MUST have an explicit initialization sequence.

The sequence SHOULD account for:

- Loading application configuration.
- Initializing required frontend services.
- Establishing the native communication boundary.
- Preparing navigation and application state.
- Determining whether required local capabilities are available.
- Handling initialization failures.
- Presenting a useful state while initialization is incomplete.

Initialization MUST NOT be treated as successful merely because the main window appears.

The exact startup sequence belongs to the frontend architecture.

## 2.6 Navigation Foundation

The desktop shell SHOULD provide a consistent navigation structure suitable for adding subsequent workflows.

Navigation SHOULD make the current application context understandable and support a clear approach to unavailable or unimplemented destinations.

The initial navigation structure MUST NOT imply that a feature is implemented when only a placeholder exists.

Navigation definitions SHOULD remain separate from backend API and domain workflow definitions.

## 2.7 UI Component Foundation

The application SHOULD establish reusable UI patterns for common shell elements.

Examples include:

- Application header or title region.
- Navigation controls.
- Main content region.
- Loading indicators.
- Error presentation.
- Empty states.
- Confirmation or notification patterns where required.
- Consistent form and button behavior.
- Shared layout and spacing conventions.

Only patterns needed by the desktop foundation are required.

A complete design system, full feature component library, or product-wide visual specification is not automatically part of this phase.

## 2.8 UI State and Error Handling

The application MUST distinguish normal initialization and interaction states from failures.

Where relevant, the UI SHOULD represent:

- Initial loading.
- Ready state.
- Missing or unavailable configuration.
- Backend connection failure.
- Native command failure.
- Invalid user input.
- Unexpected application error.
- Unsupported or unimplemented functionality.

Errors SHOULD provide actionable information without exposing secrets or internal sensitive data.

The UI MUST NOT silently convert a failed operation into an apparent success.

Detailed error models and backend error contracts remain owned by the applicable contract and implementation documents.

## 2.9 Desktop-Native Boundary

The application MUST define how frontend code invokes desktop-native capabilities.

Where native commands are exposed, the interface SHOULD specify:

- The operation's purpose.
- Expected inputs.
- Returned data or result.
- Failure behavior.
- Required permissions.
- Validation responsibilities.
- Any relevant resource lifecycle constraints.

Native capabilities MUST be exposed deliberately rather than through a broad, unrestricted interface.

The native boundary MUST be testable independently where the chosen framework supports such testing.

## 2.10 Local Runtime Boundary

If the desktop application communicates with a local runtime, that runtime MUST have a clearly defined interface and lifecycle boundary.

The foundation SHOULD establish how the UI determines whether the local runtime is available and how failures are represented.

The desktop shell MUST NOT silently take ownership of backend business logic or runtime behavior merely because it runs locally.

The detailed runtime architecture, lifecycle semantics, and local service ownership belong to the applicable architecture and implementation documents.

## 2.10a Coding-Agent Integration

P1 STUDIO delivers the first part of the coding-agent capability (PRI-1; optional to use). Architecture: `docs/architecture/CODING_AGENT_INTEGRATION.md`. Decision: SYS-ADR-007, which MUST be dispositioned before F-M02 PROJECTS coding-agent work starts.

- F-M01 STUDIO FOUNDATION: adapter trait, mock provider, session manager, journal and lock, environment sanitizer, workspace guard and `agent.*` IPC (KR-CA-001 to KR-CA-005, KR-CA-035).
- F-M02 PROJECTS: discovery and capability verification, consent lifecycle, staging and change sets, recovery, isolation launcher, first provider and the default local policy (KR-CA-006 to KR-CA-014, KR-CA-036 to KR-CA-038).

Provider processes are launched only by the Local Runtime. No project content reaches Kritva services.

## 2.11 Backend Communication Boundary

The desktop application MUST have an explicit boundary for communicating with backend services.

This may be implemented through typed clients, service modules, or another approved mechanism.

The boundary SHOULD centralize:

- Endpoint configuration.
- Request construction.
- Response interpretation.
- Error mapping.
- Authentication integration where required by the applicable contract.
- Timeout and cancellation behavior where supported.
- Diagnostic context that does not expose sensitive data.

The foundation does not require implementing the complete backend API surface.

API schemas and wire-level behavior are owned by the authoritative protocol contracts.

## 2.12 Configuration Foundation

The desktop application MUST have a clear configuration strategy for the supported development workflow.

Configuration SHOULD distinguish:

- Safe defaults.
- Local development settings.
- Build-time configuration.
- Runtime configuration.
- Environment-specific service endpoints.
- Sensitive values that must not be embedded in the application.

Secrets MUST NOT be placed in frontend bundles or packaged desktop resources under the assumption that they will remain private.

The exact security and configuration architecture remains owned by the relevant architecture and security documents.

## 2.13 Local State

The desktop shell MAY maintain local state required for basic operation, such as navigation context or non-sensitive UI preferences.

The foundation MUST define the intended scope of local state and avoid creating competing sources of truth for backend-owned domain data.

If state persistence is introduced, its storage location, lifecycle, and failure behavior SHOULD be explicit.

Sensitive data MUST NOT be persisted without an approved security design.

The complete data ownership and persistence strategy remains with the relevant architecture and database documentation.

## 2.14 Application Lifecycle

The desktop application MUST handle startup and shutdown in a controlled manner.

Where applicable, lifecycle behavior SHOULD cover:

- Window initialization.
- UI initialization.
- Native command availability.
- Local runtime connection.
- Backend connection state.
- User-requested exit.
- Native resource cleanup.
- Logging of relevant failures.

The foundation does not need to implement a complete service supervisor or product-wide lifecycle orchestration system.

## 2.15 Desktop Logging and Diagnostics

The desktop foundation SHOULD make relevant failures diagnosable.

Diagnostic support SHOULD distinguish, where practical:

- Frontend initialization errors.
- Native command errors.
- Configuration failures.
- Local runtime connection failures.
- Backend communication failures.
- Packaging or startup problems.

Diagnostics MUST avoid exposing credentials, tokens, private keys, or sensitive user data.

The complete observability architecture and operational alerting policy remain outside this dossier.

## 2.16 Development Workflow

The desktop foundation MUST be buildable and runnable through documented development instructions.

The workflow SHOULD identify:

- Required frontend tooling.
- Required desktop framework tooling.
- Native build prerequisites.
- Dependency installation.
- Local configuration.
- Development launch command.
- Production-mode build command.
- Test commands.
- Common startup troubleshooting.

The actual toolchain and commands MUST be maintained in `docs/frontend/development/DEVELOPMENT_SETUP.md`.

Global setup conventions remain owned by `docs/development/DEVELOPMENT_SETUP.md`.

## 2.17 Automated Validation

The desktop foundation MUST support automated validation appropriate to the implemented code.

Where applicable, validation SHOULD include:

- Formatting and lint checks.
- Type or compile checks.
- UI component tests.
- Application-shell tests.
- Native command tests.
- UI-to-native boundary tests.
- Build verification.
- Startup or smoke checks.
- Basic accessibility checks.

The exact test suites and required thresholds are defined in the frontend testing documentation and global testing strategy.

## 2.18 Packaging Foundation

The phase SHOULD establish the minimum configuration needed to prove that the desktop application can be packaged through the selected framework.

Where applicable, this includes:

- Application metadata.
- Package identity.
- Resource inclusion.
- Runtime dependency inclusion.
- Platform-specific build configuration.
- A repeatable packaging command.
- A basic validation path for the resulting package.

Full distribution, signing, notarization, update delivery, and release operations remain owned by `docs/frontend/development/RELEASE_PROCESS.md` and the global release process.

## 2.19 Platform Compatibility

The foundation SHOULD identify the desktop platforms that are explicitly supported for development and validation.

Platform-specific behavior MUST be documented where it affects buildability or application startup.

The phase MUST NOT claim support for an operating system that has not been built and validated through the supported workflow.

A list of possible target platforms is not evidence of tested compatibility.

## 2.20 Documentation Discoverability

Desktop contributors MUST be able to locate the authoritative instructions for building, running, testing, and extending the application.

The desktop entry-point documentation SHOULD link to:

- Frontend architecture.
- Frontend development setup.
- Frontend development workflow.
- Frontend testing.
- Frontend release and packaging.
- Relevant system architecture.
- Relevant protocol contracts.
- P1 task and acceptance records.

This dossier does not replace those documents.

## 2.21 Explicit Non-Scope

The following are outside the direct scope of P1 STUDIO:

- Complete project-management workflows.
- Complete build orchestration and artifact management.
- Full control-plane implementation.
- Complete booking, billing, and commercial workflows.
- Complete execution orchestration.
- Full lab and physical robot integration.
- Complete live monitoring and results workflows.
- Production-grade service operations.
- Full backend API implementation.
- Complete database schema and data lifecycle.
- Cloud resource provisioning and production topology.
- Full identity, authorization, and security-control implementation.
- Complete product-wide design system.
- Complete desktop auto-update service.
- Final production signing, notarization, and distribution process.
- Product-wide release authorization.

These capabilities belong to their applicable canonical phases and authoritative domain documents.

P1 MAY establish interfaces and shell integration points needed for later capabilities. It MUST NOT claim those capabilities are complete unless they are implemented and accepted under their owning scope.

## 2.22 Scope Change Control

Proposed additions SHOULD be evaluated against the objective of establishing the desktop Studio foundation.

A proposed scope change SHOULD explain:

1. Why the change is required for the desktop foundation.
2. Which deliverable it supports.
3. Which domain owns the implementation.
4. Whether the requirement is already owned by another document or milestone.
5. Whether the change introduces new dependencies.
6. Whether the change belongs in a later canonical phase.
7. How the change affects the phase's exit criteria.

Scope changes MUST be reflected in the authoritative task and acceptance files.

---

# 3. Dependencies

## 3.1 Dependency Principles

P1 STUDIO builds on the repository and engineering foundations established in P0 FOUNDATION.

It also depends on agreed system architecture, supported development tooling, and a clear distinction between desktop UI, native capabilities, and backend services.

Dependencies MUST be explicit. The desktop application MUST NOT invent new system-level ownership or contracts to work around unresolved decisions.

The task-level dependency graph belongs in `TASKS.md`.

## 3.2 P0 FOUNDATION

P1 STUDIO depends on the usable foundation provided by P0 FOUNDATION.

Relevant inputs include:

- Monorepo organization.
- Repository and naming conventions.
- Shared contract organization.
- Initial CI workflows.
- Build and test entry points.
- Skeleton application conventions.
- Documentation entry points.
- Change traceability and review practices.

If an essential foundation element is missing, record the dependency and determine whether the P1 work can proceed safely without creating a competing implementation.

## 3.3 System Architecture

The desktop implementation depends on the agreed system-level component boundaries and intended relationship between the desktop application, local runtime, and backend services.

Applicable system architecture documents MUST remain authoritative for those relationships.

The desktop implementation SHOULD identify unresolved decisions that materially affect its structure.

## 3.4 Frontend Architecture

The desktop application depends on the frontend architecture for component organization, state management, navigation, frontend-to-native interaction, and UI implementation conventions.

This dossier defines outcomes, not the complete component architecture.

The frontend architecture MUST remain consistent with the selected desktop framework and repository conventions.

## 3.5 Desktop Framework and Toolchain

The foundation depends on the availability of the selected desktop framework and its supported toolchain.

Where Tauri is selected, this may include:

- Node.js.
- The approved JavaScript package manager.
- Rust tooling.
- The relevant system build prerequisites.
- Framework-specific development and packaging tools.

The exact versions and installation procedures MUST be maintained by the authoritative development setup documentation.

## 3.6 Supported Operating Systems

The project MUST identify the operating systems intended for initial desktop development and validation.

Platform support affects:

- Native build prerequisites.
- Packaging behavior.
- Resource handling.
- Filesystem behavior.
- Window management.
- Permission requirements.
- Automated test execution.

P1 MUST distinguish supported and tested environments from possible future targets.

## 3.7 Backend Interface Contracts

Where the desktop shell communicates with backend services, its implementation depends on the relevant API contracts.

The desktop client MUST NOT establish an incompatible request or response model independently.

Where the backend endpoint is not yet implemented, the frontend SHOULD use an explicit development fixture or controlled mock rather than silently assume the service exists.

The mock MUST NOT be represented as proof of successful backend integration.

## 3.8 Native Command Contracts

The frontend depends on the interfaces exposed by the desktop-native layer.

The command boundary SHOULD identify inputs, outputs, errors, and permission requirements.

If the native implementation is not available, an approved test double MAY be used to validate the frontend behavior.

The test double MUST remain distinguishable from the real native implementation.

## 3.9 Local Runtime Availability

If the application shell integrates with a local runtime, the desktop implementation depends on the runtime's documented availability and lifecycle interface.

The application SHOULD be able to represent the unavailable-runtime state without crashing or falsely reporting success.

The local runtime implementation remains owned by its authoritative architecture and implementation documents.

## 3.10 Configuration and Environment

The desktop application depends on a documented mechanism for loading safe configuration and selecting appropriate service endpoints.

The configuration model MUST distinguish development settings from packaged application defaults.

Environment-specific secrets MUST NOT be embedded in client-distributed resources.

## 3.11 CI and Build Infrastructure

The desktop foundation depends on CI runners capable of executing the required frontend and native build checks.

Where platform-specific packaging is required, the relevant runner or build environment MUST be available.

The CI workflow MUST report unavailable platform coverage honestly.

Infrastructure provisioning and runner administration remain owned by the relevant infrastructure documentation.

## 3.12 Testing Infrastructure

The desktop foundation depends on an available test runner and a repeatable mechanism for validating the frontend and native boundary.

The required testing mechanisms SHOULD be appropriate to the selected technology stack.

The global testing strategy and frontend testing documentation define the authoritative test policy.

## 3.13 Security Requirements

The desktop implementation depends on the applicable security architecture for:

- Handling sensitive configuration.
- Restricting native capabilities.
- Managing backend credentials or session state.
- Controlling local filesystem access.
- Handling untrusted inputs.
- Preventing sensitive data from appearing in logs.

The full security design remains with the security domain.

## 3.14 Documentation and Ownership

The phase depends on authoritative documents being discoverable and maintained by their owners.

Where a required specification is missing, the gap MUST be assigned to the responsible domain.

P1 MUST NOT silently replace a missing API contract, architecture decision, or global policy with an undocumented frontend assumption.

## 3.15 Dependency Matrix

| Dependency | Required contribution | Primary owner |
|---|---|---|
| P0 FOUNDATION | Repository conventions, contracts, CI, and skeleton foundations | Foundation owners |
| System architecture | Desktop, local runtime, and backend boundaries | Architecture |
| Frontend architecture | UI structure, navigation, and frontend conventions | Frontend |
| Desktop framework | Native application framework and build integration | Frontend |
| Development toolchain | Repeatable local build and launch environment | Frontend and global development owners |
| API contracts | Backend communication schemas and semantics | Protocol and backend owners |
| Native command contracts | Explicit UI-to-native interface | Frontend |
| Local runtime interface | Runtime availability and lifecycle boundary where applicable | Runtime owner |
| CI infrastructure | Automated build and validation execution | CI and infrastructure owners |
| Test infrastructure | Repeatable frontend and native-boundary tests | Frontend and testing owners |
| Security architecture | Configuration and native capability constraints | Security owners |
| Documentation | Discoverable authoritative instructions | Documentation and domain owners |

The task records MUST identify actual assigned owners and blocking dependencies.

## 3.16 Dependency Failure Handling

When a dependency blocks P1 STUDIO:

1. Identify the affected outcome or task.
2. Record the missing interface, tool, decision, or environment.
3. Identify the authoritative owner.
4. Determine whether a safe mock or temporary alternative is permitted.
5. Clearly label any temporary implementation and its limitations.
6. Update the task dependency record.
7. Reassess the effect on the phase's exit criteria.

A mock MUST NOT be treated as a substitute for required real integration evidence.

## 3.17 Cross-Phase Handoffs

P1 STUDIO establishes a desktop shell and development path that subsequent phases may extend.

| Phase | Canonical name | Expected Studio foundation handoff |
|---|---|---|
| P0 | FOUNDATION | Repository and engineering conventions consumed by the desktop implementation |
| P1 | STUDIO | Desktop shell, native boundary, and repeatable desktop development workflow |
| P2 | BUILD & ARTIFACT | Desktop extension points for build and artifact workflows |
| P3 | CONTROL PLANE | Defined client boundary for control-plane integration |
| P4 | BOOKING & COMMERCIAL | UI foundation capable of hosting booking and commercial experiences |
| P5 | EXECUTION | UI foundation capable of hosting execution-related experiences |
| P6 | LAB & ROBOT | Desktop integration boundary for lab and robot-related experiences |
| P7 | LIVE & RESULTS | UI foundation capable of hosting live and results experiences |
| P8 | PRODUCTION | Maintainable desktop foundation that can be extended under production requirements |

These handoffs do not transfer ownership of later-phase functionality to P1 STUDIO.

The applicable milestone dossiers define the actual scope and acceptance criteria of downstream work.

---

# 4. Deliverables

## 4.1 Deliverable Principles

P1 STUDIO deliverables MUST be identifiable, reviewable, and verifiable.

A configuration file or UI component existing in the repository is not sufficient evidence that the desktop application works.

Each deliverable MUST have an identifiable owner and a verification method captured in the authoritative task and acceptance files.

## 4.2 Desktop Application Skeleton

A buildable desktop application MUST exist using the selected framework.

**Expected evidence:**

- The application entry point is identifiable.
- The native desktop shell can be launched.
- The main UI initializes.
- The selected framework's development workflow is documented.
- The application can be built using the supported toolchain.
- Startup failures are observable.
- The implemented behavior is distinguished from future functionality.

## 4.3 Application Shell and Navigation

The desktop application SHOULD provide a consistent shell and basic navigation foundation.

**Expected evidence:**

- The main content region is available.
- Navigation is structured and predictable.
- The current application context is understandable.
- Loading and error states are represented where relevant.
- Unimplemented destinations are not presented as fully functional features.
- The shell can be extended without restructuring the entire application.

## 4.4 Frontend and Native Boundary

The desktop implementation MUST establish an explicit interface between frontend code and native desktop capabilities.

**Expected evidence:**

- Native operations have identifiable interfaces.
- Inputs and outputs are defined.
- Errors are represented explicitly.
- Access is limited to the intended operations.
- The interface can be exercised through automated tests or approved test doubles.
- Native capabilities are not exposed indiscriminately to UI code.

## 4.5 Backend Communication Boundary

Where backend communication is part of the shell foundation, a clearly identifiable communication boundary MUST exist.

**Expected evidence:**

- Endpoint configuration is centralized or follows the approved architecture.
- Request and response handling follows the relevant contracts.
- Error mapping is explicit.
- Connection or request failures are observable.
- Development mocks are identifiable as mocks.
- The client does not claim successful backend integration without actual integration evidence.

## 4.6 Configuration Foundation

The application MUST have a documented approach to the configuration required by the desktop foundation.

**Expected evidence:**

- Safe defaults are identifiable.
- Environment-specific values are handled explicitly.
- Configuration loading behavior is testable where practical.
- Invalid or missing configuration produces useful diagnostic information.
- Sensitive values are not embedded in the distributed frontend.
- The configuration implementation follows the applicable security guidance.

## 4.7 Lifecycle Foundation

The desktop application MUST demonstrate controlled initialization and shutdown.

**Expected evidence:**

- Startup steps are identifiable.
- Initialization failures are handled.
- The shell can represent unavailable required dependencies.
- Shutdown does not leave known uncontrolled resources within the implemented scope.
- Lifecycle diagnostics are sufficient to investigate basic failures.
- The documented behavior matches the implementation.

## 4.8 UI State and Error Presentation

The shell SHOULD provide a consistent baseline for loading, error, empty, and unavailable states.

**Expected evidence:**

- Relevant states are represented clearly.
- Failures are not silently presented as successful operations.
- User-facing messages are understandable.
- Diagnostic details are kept separate from sensitive internal information.
- State handling follows the frontend architecture.

## 4.9 Local State Foundation

Where local state is required by the shell, its ownership and lifecycle MUST be clear.

**Expected evidence:**

- The state model is identifiable.
- Backend-owned domain data is not accidentally duplicated as an independent authority.
- Persistence behavior is explicit where persistence exists.
- Sensitive information is not stored without an approved design.
- State initialization and failure behavior are testable where practical.

## 4.10 Desktop Build Workflow

The desktop application MUST have a documented build and launch workflow.

**Expected evidence:**

- Required tooling is identified.
- Local development instructions are available.
- The application can be launched through the documented workflow.
- The production-mode build path is identifiable.
- Required platform-specific prerequisites are documented.
- Common build failures can be diagnosed from the available instructions.

The authoritative commands and prerequisites belong to `docs/frontend/development/DEVELOPMENT_SETUP.md`.

## 4.11 Automated Validation

The foundation MUST provide automated checks appropriate to the implemented desktop code.

**Expected evidence:**

- Applicable formatting, lint, and type checks can run.
- Relevant frontend tests execute.
- Native-boundary behavior can be tested through the supported approach.
- Build verification is available.
- Startup or smoke checks exist where practical.
- Failures are visible and actionable.

Detailed test implementation and coverage requirements remain owned by the frontend testing documentation and global testing strategy.

## 4.12 CI Integration

The desktop build and validation path SHOULD be integrated with the repository's CI workflow.

**Expected evidence:**

- Relevant desktop changes trigger the intended checks.
- Required frontend validation executes.
- Native build checks execute where supported by the CI environment.
- Platform coverage is documented accurately.
- Failures are visible to reviewers.
- A skipped required check is not reported as a successful validation.

Global CI policy remains owned by the applicable global development documentation.

## 4.13 Packaging Foundation

The desktop application SHOULD have enough packaging configuration to demonstrate the selected framework's supported packaging path.

**Expected evidence:**

- Application metadata is configured.
- Required resources are identified.
- The package build can be invoked through the documented process.
- The output location and basic validation mechanism are known.
- Platform-specific limitations are documented.
- Packaging success is not misrepresented as completed production distribution.

Signing, notarization, update delivery, and distribution procedures remain owned by the frontend release process.

## 4.14 Desktop Diagnostics

The desktop foundation SHOULD provide useful diagnostics for application startup and integration failures.

**Expected evidence:**

- Relevant failures can be identified.
- Diagnostics distinguish major frontend and native-boundary failure categories where practical.
- Backend connection failures are visible.
- Sensitive configuration is not emitted.
- The diagnostic approach is documented by the appropriate owner.

## 4.15 Desktop Documentation Entry Point

The desktop foundation MUST provide discoverable instructions for contributors.

**Expected evidence:**

- The application location is documented.
- The supported setup and launch instructions are linked.
- Frontend architecture and workflow documents are discoverable.
- Testing and packaging instructions are linked.
- Relevant protocol and system architecture documents are referenced.
- The P1 task and acceptance files are accessible.

## 4.16 Integration Demonstration

The phase SHOULD demonstrate the desktop foundation through a repeatable build, launch, and validation sequence.

**Expected evidence:**

- The desktop application builds.
- The application shell launches.
- The implemented initialization path can be exercised.
- Relevant automated checks execute.
- The native boundary is verified where implemented.
- Backend integration is verified only where an actual backend integration is available.
- Mocks and unimplemented capabilities are explicitly identified.

## 4.17 Deliverable Ownership Matrix

| Deliverable | Primary owner | Supporting owners |
|---|---|---|
| Desktop application skeleton | Frontend | CI and repository maintainers |
| Application shell and navigation | Frontend | Product and design stakeholders |
| Frontend/native boundary | Frontend | Native runtime owner |
| Backend communication boundary | Frontend | Backend and protocol owners |
| Configuration foundation | Frontend | Security and cloud owners |
| Lifecycle foundation | Frontend | Native runtime owner |
| UI state and error presentation | Frontend | Backend and protocol owners |
| Local state foundation | Frontend | Architecture and security owners |
| Desktop build workflow | Frontend | Global development owners |
| Automated validation | Frontend | Testing and CI owners |
| CI integration | CI owner | Frontend and infrastructure owners |
| Packaging foundation | Frontend | Build and infrastructure owners |
| Desktop diagnostics | Frontend | Runtime and observability owners |
| Documentation entry point | Frontend documentation owner | Global documentation owners |
| Integration demonstration | Frontend | Backend, runtime, and CI owners |

The task inventory MUST record the actual assignments and dependencies. This matrix does not replace task ownership.

## 4.18 Deliverable Completion Rules

A deliverable is complete only when the applicable implementation and verification evidence supports its intended outcome.

The following states MUST remain distinguishable:

- Implemented and verified.
- Implemented but not yet verified.
- Blocked by a dependency.
- Intentionally deferred.
- Not applicable to the approved implementation.

Exceptions MUST be recorded in the authoritative task and acceptance files.

---

# 9. Risks

## 9.1 Risk Management Principles

P1 STUDIO introduces a desktop application boundary that will be extended by later work. Incorrect assumptions in this boundary can create repeated rework and integration problems.

The risks below identify the principal categories relevant to the desktop foundation.

Task-specific mitigation assignments and review evidence belong in the authoritative task and review files.

## 9.2 Desktop Framework Assumptions

**Risk:** The application structure depends on undocumented or unapproved framework assumptions.

**Impact:** Native integration, packaging, or development workflow may require structural rework.

**Mitigation:**

- Follow the approved framework decision.
- Document the relevant framework constraints.
- Keep framework-specific behavior within identifiable boundaries.
- Validate the supported build and launch path early.

**Evidence:** The implemented framework configuration and documented workflow are consistent.

## 9.3 UI and Native Code Become Tightly Coupled

**Risk:** UI components directly depend on unrestricted native operations or framework-specific internals.

**Impact:** Testing becomes difficult and changes to native integration propagate throughout the UI.

**Mitigation:**

- Define explicit native command interfaces.
- Keep native operations narrow and purpose-specific.
- Separate UI behavior from operating-system operations.
- Test the boundary independently where practical.

**Evidence:** Native interactions use identifiable interfaces and can be validated.

## 9.4 Backend Contracts Are Duplicated in the Frontend

**Risk:** Frontend code independently defines API behavior that conflicts with the authoritative protocol contract.

**Impact:** Integration failures, inconsistent error handling, and duplicated maintenance.

**Mitigation:**

- Reference authoritative protocol contracts.
- Centralize frontend client behavior.
- Validate contract-derived types or schemas where supported.
- Identify unresolved backend dependencies.
- Keep mocks consistent with the agreed contract.

**Evidence:** The frontend communication boundary identifies its authoritative contracts.

## 9.5 Desktop Startup Is Fragile

**Risk:** Application startup assumes that configuration, native capabilities, or backend services are always available.

**Impact:** The application may fail without useful diagnostics or present a misleading ready state.

**Mitigation:**

- Define an explicit initialization sequence.
- Handle unavailable dependencies.
- Distinguish loading, ready, and failed states.
- Provide actionable diagnostics.
- Exercise startup failure paths where practical.

**Evidence:** Startup and initialization behavior can be validated through the documented workflow.

## 9.6 Configuration and Secrets Leak into the Client

**Risk:** Sensitive values are embedded in frontend bundles, native resources, or packaged configuration.

**Impact:** Distributed application users may extract credentials or other protected values.

**Mitigation:**

- Keep client configuration free of embedded server secrets.
- Separate safe defaults from sensitive values.
- Follow the security architecture.
- Review packaged resources and build configuration.
- Avoid logging sensitive configuration.

**Evidence:** The implementation follows the approved configuration and secret-handling model.

## 9.7 Local State Becomes a Competing Source of Truth

**Risk:** The desktop application persists domain data independently without a clear authority or synchronization model.

**Impact:** State divergence, confusing user experiences, and data integrity problems.

**Mitigation:**

- Limit local state to the approved shell and client requirements.
- Identify the owner of each persisted value.
- Avoid duplicating backend-owned state without an approved model.
- Document persistence behavior.
- Apply the relevant security constraints.

**Evidence:** Local state has explicit ownership and lifecycle semantics.

## 9.8 Platform Compatibility Is Overstated

**Risk:** The project claims support for desktop platforms that have not been built or validated.

**Impact:** Contributors encounter unrecognized build failures or runtime differences.

**Mitigation:**

- Identify the supported development and validation platforms.
- Run the relevant platform-specific checks.
- Record known limitations.
- Avoid claiming compatibility from source portability alone.

**Evidence:** Platform support statements match actual validation evidence.

## 9.9 Packaging Is Confused with Production Readiness

**Risk:** A successful package build is treated as evidence of production distribution readiness.

**Impact:** Signing, permissions, update, or distribution requirements may remain unresolved.

**Mitigation:**

- Keep P1 packaging scope limited to the foundation.
- Document what the packaging checks actually verify.
- Keep signing, notarization, distribution, and update procedures with the release owner.
- Avoid claims beyond available evidence.

**Evidence:** Packaging documentation clearly distinguishes buildability from release readiness.

## 9.10 CI Does Not Exercise the Desktop Build

**Risk:** CI validates only frontend source checks while missing native compilation or packaging configuration failures.

**Impact:** Desktop-specific failures are discovered late.

**Mitigation:**

- Identify the required desktop checks.
- Include native build checks where supported.
- Document platform limitations.
- Make missing required checks visible.
- Verify that relevant changes trigger the appropriate workflow.

**Evidence:** The CI result demonstrates the actual checks that ran.

## 9.11 Test Doubles Hide Integration Defects

**Risk:** Mocks or test doubles are treated as evidence that the real native or backend integration works.

**Impact:** Runtime failures are discovered only after integration with the real component.

**Mitigation:**

- Label mocks clearly.
- Identify which boundaries are tested using test doubles.
- Add real integration verification when the relevant component is available.
- Distinguish unit, boundary, and integration evidence.
- Avoid unsupported end-to-end claims.

**Evidence:** Verification records state which real components were exercised.

## 9.12 Error Handling Is Inconsistent

**Risk:** UI components represent failures differently or silently discard errors.

**Impact:** Users cannot understand application state and debugging becomes harder.

**Mitigation:**

- Establish baseline error presentation patterns.
- Centralize boundary error mapping where appropriate.
- Preserve useful diagnostic context.
- Avoid exposing sensitive internal details.
- Exercise relevant failure paths.

**Evidence:** Representative failures are visible and consistently represented.

## 9.13 UI Shell Becomes Overloaded with Product Logic

**Risk:** The shell accumulates feature-specific logic before clear module boundaries are established.

**Impact:** Navigation, initialization, and feature development become tightly coupled.

**Mitigation:**

- Keep the shell focused on shared application responsibilities.
- Place feature behavior within appropriate frontend modules.
- Define explicit extension points.
- Review structural changes against frontend architecture.
- Avoid implementing downstream features merely to demonstrate shell completeness.

**Evidence:** The shell remains independently understandable and extensible.

## 9.14 Toolchain Drift

**Risk:** Frontend, native, and packaging tool versions drift across local and CI environments.

**Impact:** Builds become non-reproducible and environment-specific failures increase.

**Mitigation:**

- Document supported tool versions.
- Pin or control dependencies where practical.
- Use consistent package management.
- Verify the supported build path in CI.
- Update setup documentation when the toolchain changes.

**Evidence:** The supported development workflow can be reproduced.

## 9.15 Inadequate Desktop Diagnostics

**Risk:** Native and frontend failures produce insufficient information to identify their source.

**Impact:** Basic startup and integration defects take excessive effort to diagnose.

**Mitigation:**

- Establish diagnostic conventions.
- Record relevant lifecycle failures.
- Distinguish frontend, native, and backend connection errors where practical.
- Ensure logs avoid secrets.
- Validate that CI and local runs expose useful failure output.

**Evidence:** Representative failures can be identified from available diagnostics.

## 9.16 Accessibility and Interaction Inconsistency

**Risk:** The initial shell establishes interaction patterns that are difficult to use consistently or accessibly.

**Impact:** Later UI work must replace foundational components and interaction conventions.

**Mitigation:**

- Use consistent controls and layout patterns.
- Include appropriate accessibility checks.
- Define focus and keyboard behavior where relevant.
- Avoid relying exclusively on color or visual state.
- Keep accessibility expectations aligned with the frontend testing guidance.

**Evidence:** The initial shell is reviewed against applicable accessibility expectations.

## 9.17 Documentation Drift

**Risk:** Desktop setup, build, testing, or packaging instructions no longer match the implementation.

**Impact:** Contributors follow unsupported commands or cannot reproduce failures.

**Mitigation:**

- Keep detailed instructions with their authoritative owners.
- Link from the repository entry point.
- Update instructions alongside workflow changes.
- Verify important commands where practical.
- Avoid duplicate setup procedures.

**Evidence:** The documented desktop workflow matches the supported implementation.

## 9.18 Scope Expansion into Later Phases

**Risk:** P1 STUDIO expands into complete workflows owned by subsequent phases.

**Impact:** The desktop foundation is delayed and acceptance becomes ambiguous.

**Mitigation:**

- Evaluate additions against the desktop foundation objective.
- Identify the owning canonical phase and milestone.
- Keep extension points distinct from implemented features.
- Track deferred functionality in the appropriate planning documents.
- Update acceptance scope through the approved process.

**Evidence:** P1 deliverables remain focused on the desktop application foundation.

## 9.19 Unclear Cross-Domain Ownership

**Risk:** Frontend work makes independent decisions about backend APIs, data persistence, native runtime lifecycle, or cloud configuration.

**Impact:** Competing ownership and incompatible implementation assumptions emerge.

**Mitigation:**

- Identify authoritative owners for cross-domain concerns.
- Use documented contracts.
- Request decisions from the relevant domain.
- Record blockers rather than silently inventing behavior.
- Keep desktop integration distinct from underlying service ownership.

**Evidence:** Cross-domain interfaces have identifiable owners and documented boundaries.

## 9.20 Risk Disposition at Exit

Material risks MUST be reviewed before P1 STUDIO exit.

Each material unresolved risk SHOULD have an identifiable owner and a documented disposition.

The existence of a planned mitigation does not prove that the risk has been eliminated.

Residual risk acceptance MUST follow the applicable project governance and acceptance process.

---

# 10. Exit Criteria

## 10.1 Exit Principles

P1 STUDIO is ready for formal exit consideration when the desktop foundation has been implemented, the required validation is available, ownership boundaries are clear, and the evidence demonstrates the intended outcomes.

Exit MUST be based on verified behavior rather than the presence of application files alone.

The authoritative `ACCEPTANCE_CRITERIA.md` defines the detailed acceptance requirements. `REVIEW_CHECKLIST.md` defines the review checks. `TASKS.md` maintains task status, ownership, and dependencies.

This section states outcome-level exit conditions without duplicating those files.

## 10.2 Desktop Application Buildability

The desktop application MUST build through the supported development workflow.

Exit evidence MUST support the following outcomes:

- The application entry point is identifiable.
- Required development tooling is documented.
- The supported build command executes successfully.
- Required frontend and native build steps complete where applicable.
- Build failures are visible and diagnosable.
- The build result can be associated with the relevant source state.

A frontend-only build MUST NOT be presented as a successful desktop build if native compilation is a required part of the selected framework.

## 10.3 Desktop Application Startup

The desktop application MUST launch and initialize through the supported workflow.

Exit evidence MUST support the following outcomes:

- The native desktop shell starts.
- The main UI initializes.
- Required configuration is loaded.
- Initialization failures are handled.
- Required native capabilities are available or reported as unavailable.
- The application does not falsely report readiness when a required dependency has failed.
- Basic startup diagnostics are available.

## 10.4 Application Shell and Navigation

The initial shell and navigation foundation MUST be usable.

Exit evidence MUST support the following outcomes:

- The main content structure is present.
- Navigation is consistent and understandable.
- Relevant loading and error states are represented.
- Unimplemented features are not presented as complete.
- The shell can accommodate later feature modules.
- The implementation follows the approved frontend architecture.

## 10.5 Native Boundary

Where native commands or capabilities are implemented, the boundary MUST be explicit and testable.

Exit evidence MUST support the following outcomes:

- Native operations have identifiable interfaces.
- Inputs, outputs, and failures are defined.
- Native capabilities are limited to their intended purpose.
- Relevant tests or approved test doubles exercise the boundary.
- Security-sensitive behavior follows the applicable architecture.
- Test doubles are not represented as real native integration evidence.

## 10.6 Backend Communication Boundary

Where backend communication is included in the foundation, the communication boundary MUST follow the authoritative contracts.

Exit evidence MUST support the following outcomes:

- The client boundary is identifiable.
- Relevant API behavior follows the applicable contract.
- Configuration and error handling are explicit.
- Connection failures are represented appropriately.
- Mocks and real integrations are distinguished.
- Unimplemented backend functionality is not claimed as available.

## 10.7 Configuration and Local State

The configuration and local state behavior required by the desktop shell MUST be explicit.

Exit evidence MUST support the following outcomes:

- Safe configuration defaults are identifiable.
- Environment-specific configuration is handled through the approved mechanism.
- Sensitive values are not embedded in the client package.
- Local state has a clear ownership boundary.
- Persistence behavior is explicit where implemented.
- Relevant configuration and state failures can be diagnosed.

## 10.8 Lifecycle and Error Handling

The desktop application MUST demonstrate the required initialization, failure, and shutdown behavior.

Exit evidence MUST support the following outcomes:

- Initialization steps are identifiable.
- Failures are observable.
- The application represents unavailable dependencies appropriately.
- Relevant shutdown behavior is exercised.
- Error messages do not expose sensitive internal information.
- The implementation follows the approved frontend conventions.

## 10.9 Automated Validation

The desktop foundation MUST have a repeatable automated validation path.

Exit evidence MUST support the following outcomes:

- Required frontend checks execute.
- Relevant native checks execute where applicable.
- Automated tests cover the implemented foundation behavior.
- Build verification is available.
- CI reports required failures visibly.
- Unexecuted tests are not reported as passed.
- Known coverage limitations are documented and assessed.

The global testing strategy and frontend testing document remain authoritative for test policy and implementation detail.

## 10.10 CI Integration

The desktop build and validation workflow MUST be integrated with the repository's required CI process to the extent defined by the phase acceptance criteria.

Exit evidence MUST support the following outcomes:

- Relevant changes trigger the expected checks.
- The supported desktop build path is exercised.
- Required tests execute.
- Platform limitations are stated accurately.
- CI failures are visible to reviewers.
- The workflow does not silently skip required checks.

Global CI policy remains owned by the applicable global development documentation.

## 10.11 Packaging Foundation

Where packaging is part of the approved P1 scope, the desktop application MUST demonstrate the required packaging path.

Exit evidence MUST support the following outcomes:

- Application metadata and required resources are configured.
- The documented package build executes.
- The resulting package can be identified.
- Basic package validation is available.
- Platform-specific limitations are documented.
- Packaging success is not represented as proof of production distribution readiness.

The frontend release process owns the detailed packaging, signing, notarization, and distribution procedures.

## 10.12 Development Documentation

The desktop development workflow MUST be discoverable and sufficiently repeatable.

Exit evidence MUST support the following outcomes:

- Required tooling and prerequisites are documented.
- Build and launch instructions are available.
- Testing instructions are linked.
- Packaging instructions are discoverable.
- Relevant architecture and protocol documents are referenced.
- The instructions match the actual supported implementation.

## 10.13 Cross-Domain Boundaries

The desktop foundation MUST preserve clear ownership boundaries.

Exit evidence MUST support the following outcomes:

- Frontend responsibilities are identifiable.
- Native desktop responsibilities are explicitly bounded.
- Backend interfaces refer to authoritative contracts.
- Backend service behavior remains owned by the backend domain.
- Database schema and persistence policy remain owned by the database domain.
- Cloud infrastructure remains owned by the cloud domain.
- Global testing and release policy are referenced rather than redefined.
- Unresolved cross-domain decisions are visible and assigned.

## 10.14 Risk Disposition

Material P1 risks MUST be reviewed before exit.

Exit evidence MUST support the following outcomes:

- Material risks are recorded.
- Risk ownership is identifiable.
- Required mitigations have been completed or residual risks assessed.
- Blocking dependencies are resolved or have an approved disposition.
- Known limitations are documented.
- Follow-up work is traceable to its authoritative task or planning record.

An undocumented blocker MUST NOT be treated as an accepted residual risk.

## 10.15 Cross-Phase Handoff Readiness

The desktop foundation MUST be structured so that subsequent canonical phases can extend the application without needing to replace its basic shell and integration boundaries.

| Phase | Canonical name | Handoff outcome |
|---|---|---|
| P0 | FOUNDATION | Desktop implementation follows the shared repository and engineering conventions |
| P1 | STUDIO | Desktop shell, native boundary, and repeatable development workflow are established |
| P2 | BUILD & ARTIFACT | Extension points exist for build and artifact experiences |
| P3 | CONTROL PLANE | Backend integration can be extended through defined client boundaries |
| P4 | BOOKING & COMMERCIAL | The shell can host future booking and commercial experiences |
| P5 | EXECUTION | The shell can host future execution-related experiences |
| P6 | LAB & ROBOT | Desktop integration boundaries can support future lab and robot experiences |
| P7 | LIVE & RESULTS | The shell can host future live and results experiences |
| P8 | PRODUCTION | The desktop foundation can be extended under production requirements |

These outcomes indicate desktop foundation readiness only. They do not establish acceptance of later-phase capabilities.

## 10.16 Formal Exit Review

Formal exit review MUST use the authoritative acceptance and review files.

The review SHOULD confirm:

1. The P1 objective has been met within the approved scope.
2. Required desktop deliverables have implementation and verification evidence.
3. The application builds and starts through the supported workflow.
4. The UI-to-native and UI-to-backend boundaries are explicit where implemented.
5. Required automated checks execute and report trustworthy results.
6. Configuration and local state follow the approved ownership and security boundaries.
7. Material risks and dependencies have been assessed.
8. Cross-domain responsibilities remain clear.
9. The handoff to subsequent canonical phases is documented.
10. Task-level evidence is complete or has an explicitly approved disposition.

This section does not replace the formal acceptance decision or its recorded evidence.

## 10.17 Exit Failure and Remediation

If an exit criterion is not satisfied:

1. Identify the unmet outcome.
2. Link it to the applicable task and acceptance criterion.
3. Record the missing or failed evidence.
4. Identify the responsible owner.
5. Determine whether the issue blocks phase exit.
6. Record the corrective action and required verification.
7. Reassess the criterion after remediation.

A documentation change MUST NOT be used to claim that unverified application behavior is complete.

## 10.18 Exit Evidence Record

The authoritative phase files MUST provide the traceable evidence for the exit decision.

Use the sibling files for their intended roles:

- `TASKS.md` — task inventory, dependencies, status, and ownership.
- `ACCEPTANCE_CRITERIA.md` — detailed acceptance requirements and evidence expectations.
- `REVIEW_CHECKLIST.md` — review checks and disposition.
- `CHANGELOG.md` — recorded phase changes.
- `GIT_COMMIT_STEP.md` — prescribed commit and repository-recording procedure.

This dossier SHOULD link to those files rather than duplicate their contents.

## 10.19 Completion Statement

P1 STUDIO may be considered ready for formal exit when the required acceptance criteria are satisfied, the applicable review has been completed, the required evidence is recorded, and material residual risks have been assessed through the authorized process.

The phase establishes a buildable desktop Studio foundation with a maintainable application shell, explicit native and backend integration boundaries, documented configuration and lifecycle behavior, and repeatable development and validation workflows.

It does not declare the completion of any subsequent canonical phase or domain milestone.

Formal acceptance MUST be recorded through the authoritative phase acceptance and review process, with global governance requirements continuing to apply.
