# Frontend Development Workflow

**Project:** Kritva RaaS  
**Document:** `docs/frontend/development/DEVELOPMENT_WORKFLOW.md`  
**Scope:** Frontend-specific feature development, component implementation, IPC contract coordination, and UI review hand-off  
**Audience:** Frontend developers, UI engineers, frontend architects, and reviewers  
**Status:** Frontend development workflow guide

## 1. Purpose

This document defines how frontend work is organized and handed off for implementation within Kritva RaaS.

It focuses exclusively on frontend-specific workflow:

- Feature module conventions.
- Frontend feature implementation sequence.
- Component design and reuse.
- Component and story development.
- Frontend state and interaction implementation.
- IPC contract change coordination.
- UI review preparation and hand-off.
- Frontend-specific validation before review.
- Coordination with backend, protocol, and system architecture owners.
- Traceability from frontend changes to authoritative requirements and milestone dossiers.

This document does not define the global engineering workflow. It assumes that contributors follow the shared development, branching, review, and CI policies maintained under `docs/development/`.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns frontend-specific development workflow and conventions, including:

- How frontend features are structured and implemented.
- How feature modules expose their public interfaces.
- How frontend components are designed, composed, and reused.
- How component stories and visual examples are maintained.
- How frontend interaction and state behavior are developed and validated.
- How frontend IPC changes are identified, proposed, and coordinated with contract owners.
- How frontend API and event integration changes are handed off.
- How UI changes are prepared for design, accessibility, and functional review.
- What evidence a frontend implementation should provide before UI review.
- How frontend changes are traced to frontend architecture decisions and milestone dossiers.
- How frontend work coordinates with backend and system owners without taking ownership of their contracts.

### 2.2 Global Workflow Ownership

Global workflow policies are owned by documents under `docs/development/`.

These include:

- Repository-wide branching and merge policies.
- Commit-message conventions.
- Pull request creation and approval policy.
- Required CI checks and release gates.
- General code-review responsibilities.
- Contributor onboarding and repository access.
- Shared issue and task management procedures.
- General security reporting and incident escalation.
- Cross-domain integration and release coordination.

This document MUST link to the applicable global workflow documents rather than duplicate their requirements.

Frontend-specific review preparation MAY add evidence requirements, but MUST NOT redefine global approval rules or CI gates.

### 2.3 Other Document Ownership

| Concern | Authoritative document |
|---|---|
| Global development workflow | Applicable documents under `docs/development/` |
| Global development setup | `docs/development/DEVELOPMENT_SETUP.md` |
| Frontend-specific development setup | `docs/frontend/development/DEVELOPMENT_SETUP.md` |
| Frontend-specific workflow | `docs/frontend/development/DEVELOPMENT_WORKFLOW.md` |
| Frontend architecture and implementation | Applicable architecture documents under `docs/frontend/` |
| Frontend architecture decisions | `docs/frontend/planning/DECISIONS.md` |
| Frontend milestone scope and acceptance | Authoritative dossiers under `docs/frontend/milestones/` |
| Product/system-level decisions | `planning/DECISIONS.md` |
| Canonical phase definitions | `planning/PHASES.md` |
| System backend responsibilities and ownership | `docs/architecture/BACKEND_ARCHITECTURE.md` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| Backend-specific decisions | `docs/backend/planning/DECISIONS.md` |
| API wire contract | `docs/protocol/API_CONTRACT.md` |
| Event wire contract | `docs/protocol/EVENT_CONTRACT.md` |
| Artifact contract and manifest | `docs/protocol/ARTIFACT_MANIFEST.md` |
| Application security model and trust boundaries | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Database implementation | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Cloud implementation architecture | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Cross-domain milestone scope | Applicable authoritative dossiers under `docs/**/milestones/` |

The listed documents remain authoritative for their named responsibilities.

### 2.4 Explicit Non-Goals

This document MUST NOT become the authoritative home for:

- Global branching, commit, pull request, or merge policy.
- Repository-wide CI configuration or release policy.
- General development setup instructions.
- Product-wide architecture decisions.
- Frontend architecture specifications in full.
- API, event, or IPC wire-contract definitions.
- Backend implementation procedures.
- Database or cloud implementation procedures.
- Product requirements or business rules.
- Milestone acceptance criteria.
- Detailed task tracking.
- Production incident management.
- General coding standards already defined by the global development documentation.

When a topic belongs elsewhere, this document MUST link to its authoritative owner.

## 3. Frontend Workflow Principles

### 3.1 Follow the Authoritative Requirement

Every frontend change MUST have an identifiable requirement, defect, architecture decision, or approved improvement as its reason for existing.

The implementation SHOULD link to the relevant frontend milestone dossier or other authoritative requirement.

A frontend implementation MUST NOT introduce new product behavior solely because it is convenient to implement.

### 3.2 Respect Module Boundaries

Frontend features MUST follow the module boundaries defined in the frontend architecture.

Feature code SHOULD use declared public interfaces rather than import unrelated implementation details.

A feature MUST NOT bypass an established module boundary merely to simplify a local change without reviewing the architectural impact.

### 3.3 Separate Presentation and Behavior

UI components SHOULD distinguish presentation, interaction state, data access, and domain-specific behavior according to the frontend architecture.

Reusable components SHOULD expose clear inputs and outputs.

A component MUST NOT silently acquire unrelated responsibilities as new features are added.

### 3.4 Contracts Are Not UI-Owned

Frontend code consumes API, event, and IPC contracts, but does not independently own shared contract definitions.

A frontend change that requires a contract change MUST follow the relevant coordination process and obtain review from the contract owner.

### 3.5 Accessibility Is Part of Implementation

Accessibility MUST be considered during component design rather than deferred until the end of a feature.

Keyboard behavior, focus management, semantic structure, accessible names, and state announcements SHOULD be validated for interactive components.

### 3.6 Review Evidence Must Be Reproducible

Frontend review SHOULD include enough evidence for another contributor to understand and validate the change.

Evidence MAY include component stories, screenshots, interaction recordings, automated test results, accessibility checks, or a reproducible local workflow.

Evidence MUST NOT be presented as proof of behavior that has not actually been tested.

### 3.7 No Duplicate Global Policy

Frontend contributors MUST follow the shared engineering workflow under `docs/development/`.

This document adds frontend-specific implementation and review guidance only.

## 4. Frontend Feature Module Conventions

### 4.1 Feature Ownership

Each frontend feature SHOULD have a clear functional responsibility.

Examples of feature areas may include project management, build presentation, execution monitoring, booking workflows, or results presentation.

These examples do not create new product capabilities or change the authoritative milestone scope.

The feature's actual responsibilities MUST be derived from approved requirements and the relevant architecture documents.

### 4.2 Module Structure

The exact directory structure MUST follow the frontend architecture.

A feature module SHOULD organize its code so that its public interface, components, state behavior, data access, and tests are easy to discover.

A conceptual feature organization may contain:

    feature/
        components/
        hooks/
        services/
        state/
        types/
        tests/

This is illustrative, not a mandatory directory layout. Existing repository conventions and architecture decisions take precedence.

### 4.3 Public Interfaces

A feature module SHOULD expose a deliberate public interface for use by other modules.

Consumers MUST NOT depend on internal files unless the frontend architecture explicitly permits that dependency.

Public interfaces SHOULD remain small enough to understand and review.

When an interface changes, the implementation MUST identify affected consumers and validate them.

### 4.4 Internal Components

Components used only within a feature SHOULD remain internal to that feature.

A component SHOULD be promoted to a shared component only when its reuse, behavior, and interface are sufficiently stable.

Premature abstraction SHOULD be avoided when two screens only appear similar but have materially different behavior.

### 4.5 Shared Utilities

Shared frontend utilities MUST have a clear owner and purpose.

Feature-specific business logic MUST NOT be moved into a generic utility solely to avoid a local dependency.

A shared utility change MUST consider all known consumers.

### 4.6 Dependency Direction

Feature modules SHOULD depend on approved shared infrastructure and public interfaces.

Shared infrastructure MUST NOT depend on feature-specific implementation details.

Circular dependencies SHOULD be prevented through module design, architecture checks, or code review.

### 4.7 Naming

Feature, component, hook, service, and state names SHOULD communicate their responsibility.

Names SHOULD remain consistent with the current repository conventions.

A naming change that affects public imports MUST be treated as an interface change and validated across affected consumers.

### 4.8 Avoid Unowned Abstractions

Before adding a new abstraction, identify:

- The problem it solves.
- Its intended consumers.
- Its owner.
- Its public interface.
- Its test strategy.
- Whether an existing abstraction already provides the required behavior.

An abstraction without a clear owner SHOULD NOT be introduced into shared frontend infrastructure.

## 5. Frontend Feature Implementation Sequence

### 5.1 Step 1 — Establish Scope

Before implementation, identify:

- The user-facing behavior being changed.
- The affected route, screen, component, or workflow.
- Relevant frontend architecture constraints.
- Relevant API, event, and IPC contracts.
- The authoritative milestone dossier, when applicable.
- Dependencies on backend or system implementation.

If the requirement is ambiguous, clarify it before committing to a broad UI or state design.

### 5.2 Step 2 — Identify the Owning Module

Determine which frontend module owns the behavior.

Prefer extending an existing module when the behavior belongs to its responsibility.

Create a new module only when it provides a meaningful boundary justified by the architecture.

Record any cross-module dependency introduced by the change.

### 5.3 Step 3 — Identify Contract Dependencies

Determine whether the feature depends on an existing API, event, or IPC contract.

If the contract already provides the required behavior, implement against that contract.

If the required information or operation is missing, identify the contract owner before creating frontend-specific assumptions.

### 5.4 Step 4 — Define Interaction States

Identify the relevant UI states before implementation.

Depending on the feature, these MAY include:

- Initial.
- Loading.
- Ready.
- Empty.
- Validation failure.
- Recoverable error.
- Unrecoverable error.
- Submitting.
- In progress.
- Completed.
- Cancelled.
- Unavailable.

Use only states meaningful to the feature.

Do not introduce UI states that conflict with the authoritative backend or protocol semantics.

### 5.5 Step 5 — Implement the Component Structure

Implement the smallest component structure that satisfies the requirement while preserving module boundaries.

Prefer composition over components with excessive conditional behavior.

Ensure that reusable components have explicit interfaces and that feature-specific logic remains with the owning feature.

### 5.6 Step 6 — Implement Data and State Behavior

Implement the data-access and state behavior using the approved frontend architecture.

Handle asynchronous operations, cancellation, stale responses, and error states where relevant.

Do not treat browser state as authoritative for server-owned business data.

### 5.7 Step 7 — Validate the Feature

Run the relevant frontend checks defined by the repository.

Verify the normal user journey and important failure paths.

Review keyboard behavior, focus, semantics, responsive layout, and other accessibility concerns relevant to the component.

### 5.8 Step 8 — Prepare Review Evidence

Prepare the UI review hand-off described in Section 10.

The review evidence SHOULD allow a reviewer to identify what changed, how to reproduce it, and which requirements or contracts it implements.

### 5.9 Step 9 — Follow Global Review Policy

Submit the change using the branching, commit, pull request, approval, and CI requirements defined under `docs/development/`.

This document MUST NOT create a separate frontend merge policy.

## 6. Component Development Workflow

### 6.1 Component Purpose

Every non-trivial component SHOULD have a clear purpose and an understandable public interface.

The component design SHOULD identify:

- Inputs and configuration.
- User interactions.
- Emitted actions or callbacks.
- Loading and error behavior.
- Accessibility requirements.
- Dependencies on external data.
- Reuse expectations.

These details MAY be documented through the component's types, implementation, tests, or story metadata where appropriate.

### 6.2 Component Boundaries

A component SHOULD own presentation and local interaction behavior appropriate to its responsibility.

A component SHOULD NOT independently implement unrelated network access, persistence, or cross-feature orchestration when those responsibilities belong to another layer.

The exact boundary MUST follow the frontend architecture.

### 6.3 Component Composition

Compose complex screens from smaller components when doing so improves clarity, reuse, accessibility, or testability.

Do not split a component into many trivial components solely to maximize file count.

A composition boundary SHOULD correspond to a meaningful visual or behavioral responsibility.

### 6.4 Inputs and Outputs

Component inputs MUST be typed or otherwise explicitly defined according to the frontend framework.

Callbacks and emitted events SHOULD represent meaningful user actions rather than expose unnecessary implementation details.

Components MUST handle missing or invalid inputs according to their documented contract.

### 6.5 Loading and Empty States

Components that display asynchronously loaded data SHOULD support an appropriate loading state.

Empty states SHOULD explain the absence of content and, where appropriate, offer a relevant next action.

A loading indicator MUST NOT be shown indefinitely after a terminal failure.

### 6.6 Error States

User-visible errors SHOULD explain the condition and a useful next step.

Technical diagnostics SHOULD remain available through the approved frontend observability mechanism without exposing internal secrets or unnecessary implementation details.

Components MUST NOT invent success states when an operation has failed or its outcome is unknown.

### 6.7 Reuse Decisions

Before extracting a shared component, assess:

- Whether the pattern appears in multiple meaningful contexts.
- Whether the behavior is genuinely common.
- Whether consumers need similar configuration.
- Whether accessibility behavior can be shared consistently.
- Whether changes can be made without excessive cross-feature coupling.

When the abstraction introduces significant architectural consequences, record the choice through `docs/frontend/planning/DECISIONS.md`.

## 7. Component Story Workflow

### 7.1 Purpose of Stories

Component stories SHOULD demonstrate meaningful component states and interactions in an isolated, reproducible environment.

A story is a development and review aid. It is not a replacement for integration or end-to-end tests.

The story tooling and file conventions MUST follow the current frontend architecture and repository scripts.

### 7.2 When to Add or Update a Story

Add or update a story when a change materially affects:

- A shared component.
- A reusable interaction pattern.
- A complex visual state.
- Loading, empty, or error presentation.
- Responsive behavior.
- Keyboard interaction.
- Accessibility behavior that can be demonstrated in isolation.

A simple implementation change may not require a new story if existing stories adequately represent the behavior.

### 7.3 Story Coverage

For a non-trivial component, stories SHOULD cover the relevant combinations of:

- Typical inputs.
- Boundary values.
- Empty content.
- Loading behavior.
- Error behavior.
- Disabled or unavailable interaction.
- Long text or large data.
- Responsive layout.
- Accessibility-sensitive states.

Do not create every theoretical combination. Prioritize states that reveal meaningful behavior or layout differences.

### 7.4 Stable Fixtures

Stories SHOULD use deterministic fixture data.

They SHOULD NOT depend on production services or mutable external data unless the story is explicitly designed for an integration environment.

Sensitive production data MUST NOT be copied into component fixtures.

### 7.5 Interaction Examples

Where supported by the project's story tooling, stories SHOULD demonstrate relevant interactions.

Examples include opening a menu, changing a selection, submitting a form, dismissing a dialog, or navigating between states.

An interaction example MUST represent actual component behavior rather than a decorative simulation that differs from the implementation.

### 7.6 Story Maintenance

When a component interface changes, update affected stories.

Remove obsolete story states when they no longer correspond to supported behavior.

Story failures MUST be investigated rather than hidden by disabling relevant checks without review.

### 7.7 Review Use

Reviewers MAY use stories to inspect visual states and interaction behavior before reviewing the full application.

The feature owner MUST still provide integration evidence when the behavior depends on routing, API calls, IPC, or other application-level interactions.

## 8. Frontend State and Interaction Workflow

### 8.1 Identify State Ownership

For each new state value, identify whether it belongs to:

- A component.
- A feature module.
- Shared frontend state.
- The URL or navigation state.
- Server-derived data.
- Persisted client preferences.
- A Local Runtime integration boundary.

Follow the state ownership model in the frontend architecture.

### 8.2 Keep State Narrow

State SHOULD live at the narrowest scope that satisfies its consumers.

Do not place transient component state into a global store without a clear requirement.

Do not duplicate server-derived state across unrelated stores without a defined synchronization strategy.

### 8.3 Asynchronous Operations

Asynchronous interactions SHOULD define their pending, successful, failed, and cancelled behavior where applicable.

The UI MUST avoid displaying a confirmed result when the operation outcome is unknown.

When a user can repeat an operation, the frontend SHOULD prevent accidental duplicate submissions where appropriate.

Backend idempotency and authoritative execution behavior remain owned by backend and protocol contracts.

### 8.4 Stale Responses

Navigation and repeated requests can cause stale responses to arrive after the user has moved to another context.

Implement cancellation, request identity checks, or another appropriate mechanism when stale responses could corrupt the visible state.

The selected mechanism SHOULD match the frontend architecture and the operation's lifecycle.

### 8.5 Forms

Forms SHOULD define:

- Required and optional fields.
- Client-side validation behavior.
- Pending submission behavior.
- Server-side validation error presentation.
- Success behavior.
- Retry or correction behavior.

Client-side validation improves usability but MUST NOT replace backend validation.

Field names and request payloads MUST conform to the applicable API contract.

### 8.6 Navigation

Navigation changes MUST preserve the frontend routing conventions.

Where appropriate, route state SHOULD be shareable or restorable through URLs.

A feature MUST NOT bypass route guards, authorization-related presentation rules, or application navigation conventions to simplify implementation.

Authoritative access control remains a backend and application security responsibility.

## 9. IPC Contract Change Process

### 9.1 Purpose

IPC is a communication boundary between frontend code and a local or native runtime.

IPC may involve a Tauri command interface, a local service interface, or another explicitly defined inter-process communication mechanism.

The exact IPC mechanism MUST follow the current frontend and system architecture.

This section governs the frontend-specific process for identifying and coordinating IPC contract changes. It does not define the complete IPC wire contract.

### 9.2 Contract Ownership

The IPC contract MUST have an identifiable authoritative owner.

If the IPC interface is documented in a dedicated protocol or system architecture document, that document remains authoritative.

If an IPC contract change affects product-wide behavior or crosses domain boundaries, the decision MUST be reviewed through `planning/DECISIONS.md`.

Frontend implementation details MUST NOT silently redefine command names, payload fields, error semantics, or compatibility requirements.

### 9.3 Identify the Change

Before modifying IPC usage, determine whether the change is:

- A frontend-only adapter change.
- A change to an existing IPC command invocation.
- A request or response schema change.
- A new command or event.
- A change to error mapping.
- A change to lifecycle or cancellation behavior.
- A change to permissions or capability requirements.
- A breaking compatibility change.

A frontend-only adapter change MUST preserve the existing contract.

A contract change MUST be explicitly identified as such.

### 9.4 Assess Compatibility

For a proposed contract change, identify:

- Existing frontend consumers.
- Local Runtime or native consumers.
- Request and response types.
- Error behavior.
- Lifecycle and cancellation assumptions.
- Permission implications.
- Versioning and compatibility requirements.
- Required tests.
- Migration or coordinated-release implications.

Do not assume that a frontend and local runtime will always be updated atomically unless the architecture explicitly guarantees it.

### 9.5 Coordinate with the Owner

The frontend contributor MUST submit the proposed contract change to the authoritative IPC owner.

The proposal SHOULD include:

- Current behavior.
- Required behavior.
- Proposed interface change.
- Reason for the change.
- Compatibility analysis.
- Affected consumers.
- Validation strategy.

The contract owner is responsible for approving changes to the authoritative contract.

### 9.6 Update Types and Adapters

After the contract change is approved, update the frontend-facing types, adapters, or generated bindings according to the project conventions.

Where types or bindings are generated, use the authoritative generation workflow.

Do not manually modify generated artifacts as a substitute for updating their source definitions.

### 9.7 Error and Failure Behavior

The frontend MUST handle IPC failures according to the approved contract.

It SHOULD distinguish expected failures from unexpected runtime errors.

Timeouts, unavailable runtime services, malformed responses, and cancellation MUST be handled where relevant to the contract.

The frontend MUST NOT report an operation as successful merely because the IPC request was sent.

### 9.8 Contract Verification

IPC changes SHOULD be verified through applicable tests, such as:

- Type or schema validation.
- Adapter unit tests.
- Mocked IPC interaction tests.
- Integration tests against the actual Local Runtime.
- Compatibility tests where multiple versions can coexist.

Use the test layers supported by the repository.

### 9.9 Security Review

Changes affecting native commands, file access, process execution, local network access, or other privileged capabilities MUST receive the applicable security review.

The frontend MUST request only the permissions required by its functionality.

Application security policy and native trust boundaries remain owned by the authoritative security and system architecture documents.

### 9.10 Completion Criteria

An IPC change is ready for frontend review when:

- The contract owner has reviewed the contract change where required.
- Frontend types and adapters match the approved contract.
- Error and cancellation behavior are handled.
- Relevant tests have been run.
- Permission implications have been assessed.
- Affected consumers are identified.
- The review hand-off links to the authoritative contract and evidence.

## 10. UI Review Hand-Off

### 10.1 Purpose

The UI review hand-off gives reviewers a concise, reproducible view of the frontend change and its intended behavior.

It supplements the global review process defined under `docs/development/`.

It MUST NOT redefine pull request approval, branching, merge, or CI requirements.

### 10.2 Required Context

The hand-off SHOULD identify:

- The feature or screen changed.
- The requirement or defect being addressed.
- The relevant frontend module.
- The main user-visible behavior.
- The important interaction states.
- Related API, event, or IPC contract changes.
- Relevant frontend architecture decisions.
- The authoritative milestone dossier, where applicable.

### 10.3 Visual Evidence

When the change affects visible UI, provide screenshots or another suitable visual representation when useful.

Evidence SHOULD show the relevant state rather than an unrelated or empty screen.

For a responsive change, provide evidence at representative viewport sizes.

For a stateful component, show the relevant state transitions or provide a reproducible interaction sequence.

Visual evidence MUST reflect the implementation being reviewed.

### 10.4 Interaction Evidence

For behavior that cannot be adequately demonstrated by a screenshot, provide concise reproduction steps.

Examples include:

- Opening and dismissing a dialog.
- Navigating through a multi-step flow.
- Submitting a form and displaying validation errors.
- Starting or cancelling a Local Runtime operation.
- Recovering from an unavailable backend.
- Displaying updated execution or result information.

The evidence SHOULD explain both the expected behavior and the observed result.

### 10.5 Accessibility Evidence

When a change affects an interactive or reusable component, the hand-off SHOULD identify the relevant accessibility checks.

Depending on the component, these may include:

- Keyboard-only operation.
- Focus order and focus restoration.
- Accessible names and semantic roles.
- Screen-reader announcements.
- Visible focus indication.
- Error association with form fields.
- Contrast and responsive behavior.

Do not claim accessibility compliance based solely on a screenshot.

### 10.6 Test Evidence

The hand-off SHOULD list the relevant frontend validation results.

Identify checks that were not run and explain why when that omission materially affects confidence in the change.

Do not repeat the complete CI policy; link to the global workflow documentation under `docs/development/`.

### 10.7 Known Limitations

Known limitations SHOULD be stated explicitly.

Examples include a dependent backend operation not yet available, an unresolved IPC contract change, a browser-specific issue, or an interaction that requires a service not available in the local environment.

A known limitation MUST NOT be concealed by presenting a partial implementation as fully integrated.

### 10.8 Review Questions

The frontend hand-off SHOULD help reviewers answer:

- Does the UI implement the intended behavior?
- Are loading, empty, success, and error states appropriate?
- Are module boundaries respected?
- Are shared components reused appropriately?
- Does the implementation follow the approved contracts?
- Is the interface accessible and responsive for the intended use?
- Are relevant tests and stories present?
- Are unresolved dependencies and limitations clearly identified?

### 10.9 Handoff Completion

A hand-off is ready when the reviewer can identify the change's intent, inspect the relevant behavior, and locate its supporting architecture, contract, and validation evidence.

Final approval and merge remain governed by the global development workflow.

## 11. Frontend-to-Backend Coordination

### 11.1 API Dependencies

Frontend changes that depend on API behavior MUST use the published contract in `docs/protocol/API_CONTRACT.md`.

If the API does not provide the required capability, identify the gap and coordinate with the backend owner.

The frontend MUST NOT invent request or response fields and treat them as an agreed contract.

### 11.2 Event Dependencies

Frontend event consumers MUST follow `docs/protocol/EVENT_CONTRACT.md`.

A change to event meaning, payload structure, or compatibility behavior MUST be coordinated with the event contract owner.

The frontend SHOULD handle connection loss and unavailable updates according to the supported product behavior.

### 11.3 Artifact Dependencies

When the UI displays or consumes artifacts, it MUST follow `docs/protocol/ARTIFACT_MANIFEST.md` and other applicable authoritative artifact contracts.

Frontend presentation logic MAY adapt an artifact for display but MUST NOT redefine artifact identity, integrity, ownership, or compatibility semantics.

### 11.4 Mock Data

Mocks MAY be used to develop components before the backend is available.

Mocks MUST be clearly distinguishable from real integration evidence.

Mock schemas SHOULD derive from the published contract or an explicitly approved interface definition.

Mocks MUST NOT silently introduce new API semantics.

### 11.5 Integration Handoff

When a frontend change requires backend work, the hand-off SHOULD identify:

- The required API, event, or IPC behavior.
- The authoritative contract.
- The expected UI behavior.
- The error and loading states.
- The test or mock needed for frontend development.
- The integration evidence required when the backend capability becomes available.

Backend implementation acceptance remains owned by the relevant backend task and milestone dossier.

## 12. Frontend-Specific Validation Before Review

### 12.1 Scope

This section describes frontend review preparation, not the global CI policy.

The required repository-wide checks remain defined under `docs/development/`.

### 12.2 Component Validation

For a component change, validate the relevant:

- Input and output behavior.
- State transitions.
- Loading and error presentation.
- Keyboard interactions.
- Responsive behavior.
- Accessibility semantics.
- Component stories.
- Unit or component tests.

Not every component requires every test type. Select validation according to the component's behavior and risk.

### 12.3 Feature Validation

For a feature change, validate the affected user journey.

Check navigation, data loading, state transitions, submission behavior, and recovery from expected failures where applicable.

A component story alone is insufficient evidence for a feature that depends on routing, API behavior, or IPC.

### 12.4 Contract Validation

When an API, event, or IPC integration changes, validate that the frontend follows the authoritative contract.

Check relevant types, adapters, error mapping, and compatibility assumptions.

### 12.5 Visual Regression

Where visual regression tooling is available, use it for changes to shared components or visually sensitive workflows.

Review differences rather than automatically accepting every generated snapshot update.

A snapshot update MUST NOT be used to hide an unintended visual regression.

### 12.6 Final Local Review

Before requesting review, inspect the changed files and confirm that:

- No unrelated feature behavior changed.
- No private environment configuration was added.
- No generated files were modified unexpectedly.
- Relevant tests and stories reflect the new behavior.
- The review hand-off contains the required evidence.
- Outstanding contract dependencies are documented.

Follow the global submission process under `docs/development/`.

## 13. Common Frontend Workflow Problems

### 13.1 Feature Logic Leaks Across Modules

**Symptoms**

- A feature imports many unrelated internal files.
- A small UI change requires edits across unrelated modules.
- Shared utilities accumulate feature-specific behavior.

**Actions**

1. Identify the owning feature.
2. Review the public module interfaces.
3. Determine whether an existing shared abstraction is appropriate.
4. Restore clear ownership or propose an explicit architecture decision.
5. Add or update tests for affected consumers.

### 13.2 Component Duplication

**Symptoms**

- Multiple components implement the same interaction pattern.
- Accessibility behavior differs between similar controls.
- Fixes must be repeated in several places.

**Actions**

1. Compare the behavior, not only the visual appearance.
2. Identify the genuinely shared responsibility.
3. Review existing shared components.
4. Extract a common component only when the interface is stable.
5. Add representative stories and tests.

### 13.3 Story and Application Behavior Diverge

**Symptoms**

- A component story works but the feature fails.
- Mock data hides a contract mismatch.
- The story represents a state the application cannot produce.

**Actions**

1. Verify that the story reflects the current component interface.
2. Compare mock data with the authoritative contract.
3. Add feature-level integration coverage where needed.
4. Validate the actual application workflow.
5. Clearly label any remaining mock-only behavior.

### 13.4 IPC Contract Mismatch

**Symptoms**

- The frontend invokes an unknown command.
- Request fields are missing or incorrectly named.
- The runtime returns an unexpected error shape.

**Actions**

1. Locate the authoritative IPC contract.
2. Confirm the command and payload definitions.
3. Check generated types or bindings.
4. Coordinate contract changes with the owner.
5. Add or update adapter and integration tests.

Do not fix the mismatch by silently changing the frontend's assumed contract.

### 13.5 UI Review Is Blocked

**Symptoms**

- Reviewers cannot reproduce the change.
- Screenshots do not show the relevant behavior.
- Required backend or Local Runtime dependencies are unavailable.

**Actions**

1. Provide a concise reproduction sequence.
2. Attach representative visual evidence.
3. State which dependencies are unavailable.
4. Provide mock-based evidence only when it is clearly identified.
5. Record the remaining integration validation needed.

### 13.6 Accessibility Problems Appear Late

**Symptoms**

- Keyboard focus is lost after a dialog closes.
- Controls lack accessible names.
- Validation errors are not announced.
- Interactive elements cannot be operated without a pointer.

**Actions**

1. Identify the shared component or feature responsible.
2. Correct the component's semantics and interaction behavior.
3. Add repeatable accessibility checks.
4. Update affected stories and tests.
5. Recheck other consumers when the component is shared.

## 14. Relationship to Phases and Milestones

### 14.1 Phase Authority

`planning/PHASES.md` is the canonical source for phase definitions.

This workflow MUST NOT redefine phase meaning or use phase references to expand milestone scope.

Frontend workflow practices apply wherever frontend implementation is performed.

### 14.2 Canonical Phases

| Phase | Canonical name |
|---|---|
| P0 | FOUNDATION |
| P1 | STUDIO |
| P2 | BUILD & ARTIFACT |
| P3 | CONTROL PLANE |
| P4 | BOOKING & COMMERCIAL |
| P5 | EXECUTION |
| P6 | LAB & ROBOT |
| P7 | LIVE & RESULTS |
| P8 | PRODUCTION |

These names MUST be used exactly whenever phases are referenced in this document.

### 14.3 Frontend Milestones

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 |
| F-M02 | PROJECTS | P1 |
| F-M03 | BUILD & ARTIFACT | P2 |
| F-M04 | BOOKING | P4 |
| F-M05 | EXECUTION | P5 |
| F-M06 | LIVE | P7 |
| F-M07 | RESULTS | P7 |

Frontend milestone scope and acceptance MUST be taken from the authoritative dossiers under `docs/frontend/milestones/`.

This workflow defines frontend implementation and hand-off practices only. It MUST NOT introduce or modify milestone acceptance criteria.

### 14.4 Cross-Domain Dependencies

Frontend changes may depend on backend, database, or cloud capabilities.

When another domain is required, coordinate through its authoritative architecture, contract, and milestone documents.

This workflow MUST NOT duplicate another domain's acceptance criteria or implementation process.

### 14.5 Traceability

A frontend milestone dossier MAY reference this workflow when a feature needs specific module, component, IPC, or UI review practices.

Changes to this workflow MUST preserve the canonical phase and milestone model.

## 15. Maintenance and Change Control

### 15.1 Workflow Changes

This document MUST be updated when frontend conventions change materially, including:

- Feature module structure.
- Shared component and story conventions.
- Frontend state implementation patterns.
- IPC change coordination.
- UI review hand-off expectations.
- Frontend-specific validation practices.

### 15.2 Global Policy Changes

Changes to branching, commits, pull requests, CI, merge approvals, or release gates MUST be made in the appropriate documents under `docs/development/`.

This file MUST link to those documents rather than copy their policy.

### 15.3 Architecture Changes

Changes to frontend module boundaries, state ownership, or major implementation choices SHOULD be reflected in the relevant frontend architecture documents.

A consequential frontend architecture choice MUST be recorded in `docs/frontend/planning/DECISIONS.md`.

A cross-domain architecture change MUST be reviewed through `planning/DECISIONS.md`.

### 15.4 Contract Changes

API changes MUST follow `docs/protocol/API_CONTRACT.md`.

Event changes MUST follow `docs/protocol/EVENT_CONTRACT.md`.

Artifact changes MUST follow `docs/protocol/ARTIFACT_MANIFEST.md`.

IPC changes MUST follow the applicable authoritative IPC contract and the coordination process in Section 9.

This document MUST NOT become the authoritative wire-contract definition.

### 15.5 Documentation Review

When updating this workflow, verify that:

- Links point to the authoritative documents.
- Examples reflect actual repository conventions.
- Module and story guidance matches the frontend architecture.
- IPC guidance does not conflict with the authoritative contract.
- UI hand-off requirements remain frontend-specific.
- Global workflow policy has not been duplicated.
- Phase and milestone references use the frozen canonical model.

## 16. Frontend Workflow Checklist

### 16.1 Feature Preparation

- [ ] The requirement and affected user behavior are clear.
- [ ] The owning frontend module is identified.
- [ ] Relevant architecture decisions are reviewed.
- [ ] API, event, and IPC dependencies are identified.
- [ ] The authoritative milestone dossier is identified where applicable.
- [ ] Cross-domain dependencies have clear owners.

### 16.2 Implementation

- [ ] Feature module boundaries are respected.
- [ ] Public interfaces are deliberate and stable.
- [ ] Components have clear responsibilities.
- [ ] State is owned at the appropriate scope.
- [ ] Loading, empty, and error behavior are handled where relevant.
- [ ] Accessibility is considered during implementation.
- [ ] Mocks conform to the approved contracts.
- [ ] Shared abstractions have clear owners.

### 16.3 Component and Story Workflow

- [ ] Relevant stories are added or updated.
- [ ] Important states are represented.
- [ ] Fixtures are deterministic and contain no sensitive production data.
- [ ] Interaction examples match actual component behavior.
- [ ] Component tests cover important behavior.
- [ ] Shared component consumers are considered.

### 16.4 IPC and Contract Changes

- [ ] The authoritative contract is identified.
- [ ] Contract changes are explicitly distinguished from adapter changes.
- [ ] The contract owner is involved where required.
- [ ] Types and bindings reflect the approved interface.
- [ ] Error and cancellation behavior are handled.
- [ ] Permission and security implications are reviewed.
- [ ] Relevant integration evidence is available.

### 16.5 UI Review Hand-Off

- [ ] The feature intent is summarized.
- [ ] Reproduction steps are provided where needed.
- [ ] Visual evidence is included for meaningful UI changes.
- [ ] Accessibility considerations are identified.
- [ ] Relevant tests and stories are linked.
- [ ] API, event, and IPC dependencies are documented.
- [ ] Known limitations are explicit.
- [ ] Global review and CI policies are followed through `docs/development/`.

## 17. Definition of Done

The frontend development workflow is ready for ongoing use when:

1. Its frontend-only ownership boundary is explicit.
2. Global branching, review, and CI policies remain owned by `docs/development/`.
3. Feature modules follow the authoritative frontend architecture.
4. Component and story practices are clear and reproducible.
5. IPC changes are coordinated with the authoritative contract owner.
6. UI review hand-offs contain useful, verifiable evidence.
7. API, event, artifact, and security responsibilities remain with their designated owners.
8. Frontend changes are traceable to the relevant architecture decisions and milestone dossiers.
9. Phase and milestone references use the frozen canonical model.
10. The workflow does not duplicate global engineering policy or become a task tracker.

This document owns frontend-specific development workflow only. Global workflow policies remain owned by documents under `docs/development/`; product architecture, frontend architecture, protocol contracts, and milestone scope remain owned by their respective authoritative documents. All changes MUST preserve this ownership boundary.
