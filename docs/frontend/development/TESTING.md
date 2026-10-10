# Frontend Testing

**Project:** Kritva RaaS  
**Document:** `docs/frontend/development/TESTING.md`  
**Scope:** Frontend-specific automated tests, Local Runtime test integration, visual regression, accessibility validation, and frontend coverage targets  
**Audience:** Frontend developers, UI engineers, frontend architects, and reviewers  
**Status:** Frontend testing guide

## 1. Purpose

This document defines the testing practices specific to the Kritva RaaS frontend and its Local Runtime integration.

It covers:

- Vitest unit and module tests.
- React Testing Library component tests.
- Playwright browser-based end-to-end tests.
- Tauri command and event mocks.
- Frontend-to-IPC integration testing.
- Rust Local Runtime test integration where frontend behavior depends on runtime capabilities.
- Visual regression and component appearance testing.
- Accessibility testing.
- Frontend coverage targets and exclusions.
- Test fixtures, deterministic execution, and frontend-specific debugging.
- Frontend test evidence for UI review and milestone acceptance.

The purpose is to make frontend behavior reproducible, maintainable, accessible, and verifiable without duplicating the global testing strategy.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns frontend-specific testing implementation and practices:

- Configuration and usage of Vitest for frontend tests.
- React Testing Library conventions for component behavior.
- Playwright conventions for browser-based workflows.
- Frontend-specific test organization and fixtures.
- Tauri command, event, and Local Runtime mocks used by frontend tests.
- Tests for frontend adapters that communicate through IPC.
- Frontend integration tests involving API and event consumers.
- Frontend-related Rust test invocation and coordination when validating the Local Runtime boundary.
- Visual regression testing of frontend components and screens.
- Frontend accessibility validation.
- Frontend coverage targets and exclusions.
- Frontend-specific test diagnostics and review evidence.

### 2.2 Global Testing Strategy Ownership

`docs/development/TESTING_STRATEGY.md` is the authoritative document for the global testing strategy.

It owns:

- The organization-wide testing philosophy.
- Test levels and their overall responsibilities.
- Repository-wide testing policy.
- Global quality gates and required checks.
- Cross-domain integration and system-level test policy.
- General test reporting and evidence expectations.
- Organization-wide coverage policy, where defined.
- Release and CI testing requirements.
- General failure triage and test ownership policy.

This document MUST link to the global strategy rather than redefine it.

Frontend-specific coverage targets in this document are domain targets. They do not override a stricter global requirement.

### 2.3 Other Document Ownership

| Concern | Authoritative document |
|---|---|
| Global testing strategy and policy | `docs/development/TESTING_STRATEGY.md` |
| Global development workflow and CI policy | Applicable documents under `docs/development/` |
| Global development setup | `docs/development/DEVELOPMENT_SETUP.md` |
| Frontend development setup | `docs/frontend/development/DEVELOPMENT_SETUP.md` |
| Frontend development workflow | `docs/frontend/development/DEVELOPMENT_WORKFLOW.md` |
| Frontend architecture and implementation | Applicable architecture documents under `docs/frontend/` |
| Frontend architecture decisions | `docs/frontend/planning/DECISIONS.md` |
| Frontend milestone scope and acceptance | Authoritative dossiers under `docs/frontend/milestones/` |
| Canonical phase definitions | `docs/planning/PHASES.md` |
| Product and system decisions | `docs/planning/DECISIONS.md` |
| API wire contract | `docs/protocol/API_CONTRACT.md` |
| Event wire contract | `docs/protocol/EVENT_CONTRACT.md` |
| Artifact contract and manifest | `docs/protocol/ARTIFACT_MANIFEST.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Database implementation | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Cloud implementation architecture | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Application security and trust boundaries | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Cross-domain milestone scope | Applicable authoritative dossiers under `docs/**/milestones/` |

Rust Local Runtime tests remain owned by the runtime implementation and its relevant test documentation. This file describes only the frontend-specific test integration needed to validate the frontend/runtime boundary.

### 2.4 Explicit Non-Goals

This document MUST NOT become the authoritative home for:

- Global testing strategy.
- Repository-wide test policy.
- Global CI configuration or release gates.
- Complete backend, database, or cloud test plans.
- Product-wide system validation strategy.
- API or event contract definitions.
- Full Rust runtime testing methodology.
- Security policy or penetration-testing standards.
- Milestone acceptance criteria.
- Task tracking or release checklists owned elsewhere.

Where a concern belongs to another document, this file MUST link to that owner.

## 3. Frontend Testing Principles

### 3.1 Test Observable Behavior

Tests SHOULD verify observable behavior rather than internal implementation details.

A component test SHOULD focus on what a user sees and does.

A module test MAY verify internal behavior when that behavior is part of a meaningful contract or when a narrower test improves fault localization.

Tests MUST NOT be coupled unnecessarily to private component structure, incidental CSS classes, or implementation-specific call sequences.

### 3.2 Choose the Appropriate Test Layer

Use the narrowest test layer that provides meaningful confidence:

- Unit tests for deterministic functions and isolated logic.
- Component tests for rendered UI and interactions.
- Adapter tests for API, event, and IPC boundaries.
- End-to-end tests for important user journeys.
- Runtime tests for native implementation behavior.
- Visual tests for unintended presentation changes.
- Accessibility tests for keyboard, semantic, and assistive-technology behavior.

Do not use end-to-end tests for every small logic branch.

Do not use isolated unit tests as the only evidence for a workflow that depends on routing, services, or IPC.

### 3.3 Deterministic Tests

Tests SHOULD be deterministic and repeatable.

Avoid dependencies on:

- Live production services.
- Real user accounts.
- Uncontrolled wall-clock timing.
- Random fixture data without a fixed seed.
- Unmanaged external network resources.
- Machine-specific filesystem assumptions.
- Implicit execution order between tests.

When a test requires time, randomness, or external interaction, use an explicit control or test fixture where possible.

### 3.4 Test Real Contracts

Mocks MUST reflect the authoritative API, event, and IPC contracts.

A mock MUST NOT create unsupported request fields, response fields, commands, or error semantics.

When a contract changes, update the relevant fixtures and tests along with the implementation.

### 3.5 Avoid False Confidence

A passing mock-based test proves behavior only within the mocked boundary.

It does not prove that the actual backend or Local Runtime implements the same behavior.

Where integration matters, supplement mock-based tests with appropriate integration evidence.

### 3.6 Accessibility Is Testable Behavior

Accessibility MUST be included in the testing process.

Tests SHOULD verify semantic roles, accessible names, keyboard behavior, focus handling, and appropriate state announcements where relevant.

Automated accessibility checks are useful but MUST NOT be treated as complete proof of accessibility.

### 3.7 Coverage Is Not Correctness

Coverage helps identify untested code, but a high coverage percentage does not guarantee correct behavior.

Prioritize tests for important user journeys, failure paths, authorization-sensitive presentation, state transitions, and contract boundaries.

## 4. Frontend Test Architecture

### 4.1 Test Categories

| Category | Primary tool | Main responsibility |
|---|---|---|
| Unit tests | Vitest | Deterministic functions, hooks, adapters, and isolated logic |
| Component tests | Vitest and React Testing Library | Rendered UI, interactions, accessible semantics, and state behavior |
| Browser workflows | Playwright | Important user journeys in a real browser |
| IPC adapter tests | Vitest with Tauri mocks | Frontend command and event handling |
| Local Runtime validation | Rust test suite plus frontend integration tests | Behavior across the frontend/runtime boundary |
| Visual regression | Repository-approved visual tooling | Detection of unintended visual changes |
| Accessibility checks | Testing Library, Playwright, and approved accessibility tooling | Automated and manual accessibility validation |

The tools listed here describe responsibilities, not mandatory adoption of additional dependencies. Use the tooling already established in the repository unless an approved change introduces a new tool.

### 4.2 Test Ownership

Frontend tests SHOULD live near the implementation or in a dedicated frontend test tree, according to repository conventions.

Each test MUST have an identifiable owner.

A frontend test MAY depend on a backend or runtime fixture, but it MUST NOT silently take ownership of the backend or runtime implementation.

### 4.3 Test Boundaries

Tests SHOULD make boundaries explicit:

- Component tests mock external services when testing isolated UI behavior.
- Adapter tests mock the underlying transport when testing frontend mapping logic.
- Integration tests use a real boundary when the purpose is to validate interoperability.
- End-to-end tests exercise the application workflow through supported interfaces.

A test MUST NOT claim integration coverage if all relevant integration boundaries are mocked.

### 4.4 Shared Test Utilities

Shared test utilities SHOULD provide stable rendering helpers, fixture builders, accessibility helpers, and controlled environment setup.

They MUST have a clear owner and documented purpose.

Feature-specific assumptions SHOULD remain in the owning feature's test helpers rather than accumulating in a global utility.

### 4.5 Test Naming

Test names SHOULD describe behavior or the condition being verified.

Prefer a name such as:

    displays a recoverable error when the runtime is unavailable

Avoid names that describe only implementation details:

    calls setRuntimeError

The test title SHOULD remain meaningful when implementation details change.

## 5. Vitest Unit Testing

### 5.1 Scope

Vitest SHOULD be used for deterministic frontend unit tests, including:

- Pure functions.
- Data formatting and mapping.
- Validation logic.
- State transition helpers.
- Custom hooks.
- API and IPC adapters.
- Error conversion.
- Utility functions.
- Frontend-specific contract handling.

### 5.2 Test Configuration

The Vitest configuration MUST follow the repository's current frontend tooling setup.

The test environment SHOULD be selected deliberately:

- A Node-like environment for logic that does not require browser APIs.
- A DOM environment for components and browser-dependent behavior.

Do not add multiple overlapping test configurations unless a concrete requirement justifies them.

### 5.3 Test Isolation

Each test SHOULD establish the state required for its assertions.

Tests MUST NOT depend on the execution order of other tests.

Shared mocks SHOULD be reset or restored according to the configured test lifecycle.

A test that modifies global objects, timers, environment variables, or module state MUST restore them after execution.

### 5.4 Pure Function Tests

Pure functions SHOULD be tested with representative normal, boundary, and invalid inputs.

For example, a formatting function may require coverage for:

- Typical values.
- Empty values.
- Boundary values.
- Invalid or missing values.
- Values with unusual lengths or characters.

Do not add redundant cases that exercise identical behavior without improving confidence.

### 5.5 Hook Tests

Custom hooks SHOULD be tested through their observable behavior.

Where practical, prefer testing the hook through a component that consumes it.

Use a dedicated hook-testing utility only when it materially improves clarity or when the hook's lifecycle behavior cannot be tested cleanly through a component.

Test cleanup, asynchronous updates, and state transitions where relevant.

### 5.6 Mocking Dependencies

Mock external dependencies at their boundaries.

Avoid mocking the function under test or every internal function it calls.

Mocks SHOULD expose only the behavior needed by the test.

A mock SHOULD fail clearly when an unexpected call or unsupported input occurs if silent acceptance could hide a defect.

### 5.7 Timers and Asynchronous Logic

Use controlled timers for debounce, polling, delayed state transitions, and timeout behavior.

Prefer explicit synchronization over arbitrary sleeps.

Tests MUST wait for the observable condition being asserted rather than assume that a fixed delay is sufficient.

### 5.8 Error Paths

Unit tests SHOULD cover meaningful error conversion and recovery behavior.

Where errors originate from API or IPC adapters, verify that the frontend preserves the distinctions required by the relevant contract.

Do not collapse all failures into a generic success-shaped result merely to simplify UI handling.

## 6. React Testing Library Component Testing

### 6.1 Scope

React Testing Library SHOULD be used to verify rendered components through user-visible behavior.

Component tests SHOULD cover:

- Initial rendering.
- User interactions.
- State transitions.
- Form validation.
- Loading and empty states.
- Error presentation.
- Accessible semantics.
- Conditional rendering.
- Relevant callback behavior.

### 6.2 Query Strategy

Prefer queries that reflect how users and assistive technologies identify elements.

Recommended preference:

1. Accessible role and accessible name.
2. Label associated with a form control.
3. Placeholder when it is the meaningful available identifier.
4. Visible text.
5. Test identifier when semantic queries are unsuitable.

Avoid selectors that depend on private component structure unless no suitable behavioral selector exists.

### 6.3 User Interactions

Use the repository-approved user interaction utilities.

Tests SHOULD model meaningful user actions such as clicking, typing, selecting, keyboard navigation, and form submission.

Prefer complete interaction sequences when event order matters.

### 6.4 Asynchronous Rendering

When a component updates asynchronously, wait for the expected visible state.

Do not assert intermediate state prematurely unless that intermediate state is itself the behavior being tested.

Ensure asynchronous work is settled or cancelled before test cleanup.

### 6.5 Form Testing

Form tests SHOULD cover relevant cases:

- Valid submission.
- Required-field validation.
- Invalid input.
- Server-side validation feedback.
- Pending submission.
- Duplicate-submit prevention.
- Successful completion.
- Recoverable failure.

The exact cases MUST reflect the form's actual behavior and risk.

### 6.6 Dialogs and Overlays

Dialog tests SHOULD verify:

- Opening behavior.
- Accessible dialog semantics.
- Initial focus where required.
- Keyboard dismissal when supported.
- Focus restoration after closing.
- Confirmation and cancellation behavior.
- Appropriate handling of unavailable actions.

Tests SHOULD also verify that a dialog does not accidentally leave inaccessible or misleading background interaction available.

### 6.7 Navigation and Routing

For routing-dependent components, use the repository's routing test setup.

Verify the visible result of navigation rather than testing router internals.

Test invalid routes, missing identifiers, or guarded navigation where those conditions are relevant to the feature.

### 6.8 Avoid Excessive Mocking

Do not mock the component's entire child tree when the purpose is to verify composition or user interaction.

Mock only boundaries that are outside the component's responsibility or that make the test nondeterministic.

A test SHOULD preserve enough real component behavior to detect meaningful regressions.

## 7. Playwright End-to-End Testing

### 7.1 Scope

Playwright SHOULD validate important frontend user journeys in a real browser.

It is appropriate for workflows involving multiple screens, routing, forms, asynchronous updates, and interactions among frontend modules.

It MAY also validate the frontend's integration with a controlled test backend.

### 7.2 Journey Selection

Choose end-to-end journeys based on user impact, business importance, and integration risk.

Potential examples include:

- Opening the Studio and navigating between primary screens.
- Creating or selecting a project.
- Inspecting build or artifact information.
- Completing a booking workflow.
- Starting or observing an execution workflow.
- Viewing live status or results.
- Recovering from a service or runtime failure.

These examples do not expand product scope. Implement only journeys supported by approved requirements and the authoritative milestone dossiers.

### 7.3 Test Environment

The environment MUST be isolated from production services and real customer data.

Test configuration SHOULD identify:

- Frontend base URL.
- Test service endpoints.
- Fixture or seed-data strategy.
- Authentication approach for the test environment.
- Browser and viewport configuration.
- Artifact output location.
- Cleanup requirements.

Use the established environment configuration rather than introducing untracked local assumptions.

### 7.4 Selectors

Prefer accessible role, name, and label selectors.

Use stable test identifiers when the element cannot be reliably identified through its semantics.

Avoid selectors based on generated CSS classes, incidental DOM nesting, or unstable text that is not part of the expected behavior.

### 7.5 Synchronization

Wait for meaningful application state, network responses, or user-visible conditions.

Avoid fixed sleeps except when a real timing behavior is specifically under test and the test is designed to control it.

A test SHOULD fail with useful diagnostics when the expected state does not occur.

### 7.6 Test Data

Use isolated, deterministic test data.

Tests SHOULD create or obtain the records they require and clean up after themselves when applicable.

Do not depend on manually created records or the execution order of other end-to-end tests.

### 7.7 Failure Scenarios

Include high-value failure scenarios such as:

- API unavailability.
- Invalid form input.
- Empty results.
- Expired or unavailable session state where relevant.
- Local Runtime unavailability.
- IPC command failure.
- Interrupted asynchronous workflows.

Select scenarios according to product behavior and milestone scope.

### 7.8 Browser Coverage

Use the browser matrix defined by the global testing strategy or approved project tooling.

Do not introduce a separate mandatory browser-support policy in this document.

Where browser-specific behavior is important, include targeted tests and record the supported environment.

### 7.9 Flakiness

A flaky test MUST be investigated.

Possible causes include unstable selectors, uncontrolled asynchronous work, shared test data, network dependence, or race conditions.

Do not repeatedly rerun a failing test until it happens to pass and treat that result as sufficient evidence.

### 7.10 Diagnostics

When a Playwright test fails, retain useful diagnostics supported by the repository configuration, such as:

- Failure messages.
- Screenshots.
- Browser traces.
- Console errors.
- Relevant network information.
- Video recordings when configured and useful.

Diagnostics MUST avoid exposing credentials, access tokens, or sensitive customer data.

## 8. Tauri and IPC Testing

### 8.1 Scope

This section covers frontend testing of Tauri commands, events, and related IPC adapters.

It does not define the authoritative IPC contract or replace Rust-side testing of native command implementations.

### 8.2 Test Layers

Use separate tests for distinct responsibilities:

- Frontend adapter tests verify request mapping and response handling.
- Component tests verify user-visible behavior when IPC succeeds or fails.
- Integration tests verify interoperability with a real Local Runtime where practical.
- Rust tests verify native command and runtime behavior in the Rust implementation.

The selected test layer MUST match the claim made by the test.

### 8.3 Command Mocks

A Tauri command mock SHOULD:

- Match the approved command name.
- Validate expected input fields.
- Return contract-compatible data.
- Model relevant errors.
- Support deterministic test setup.
- Fail clearly on unexpected commands when appropriate.

Mocks MUST NOT silently accept invalid requests if doing so could hide a contract mismatch.

### 8.4 Event Mocks

Event mocks SHOULD provide a controllable way to register, emit, and remove event listeners.

Tests SHOULD verify listener cleanup when components unmount or subscriptions are replaced.

Where event order matters, fixtures SHOULD control the order explicitly.

### 8.5 Success and Failure

For an IPC adapter, test the meaningful outcomes defined by the contract.

These MAY include:

- Successful response.
- Expected application error.
- Runtime unavailable.
- Command rejection.
- Malformed or unexpected response.
- Cancellation or timeout where supported.

Do not invent error categories that are absent from the authoritative contract.

### 8.6 Lifecycle Behavior

If frontend behavior depends on Local Runtime initialization or shutdown, test the expected lifecycle interaction.

The frontend MUST NOT assume that a command is available before the runtime reaches the required state.

Test unavailable or transitional states when they are visible to users.

### 8.7 Permissions and Capabilities

Where IPC operations are subject to native permissions or capabilities, test that the frontend handles denial and unavailability correctly.

Frontend tests do not replace validation of the native permission boundary.

Security-sensitive behavior MUST also follow the authoritative security architecture and applicable security test policy.

### 8.8 Real Runtime Integration

When a real Local Runtime is available in the test environment, integration tests SHOULD validate representative end-to-end IPC behavior.

The test MUST clearly identify whether it uses a mock, a simulator, or the real runtime.

A mock-only test MUST NOT be reported as proof of native integration.

### 8.9 Contract Updates

When an IPC contract changes:

1. Update the authoritative contract through its owner.
2. Update frontend types or generated bindings.
3. Update command and event mocks.
4. Update adapter tests.
5. Update affected component tests.
6. Add or update real-runtime integration tests where required.
7. Record any unavailable integration validation in the review hand-off.

Use `docs/frontend/development/DEVELOPMENT_WORKFLOW.md` for the frontend-specific contract change process.

## 9. Rust Local Runtime Test Integration

### 9.1 Ownership

Rust runtime implementation tests belong to the Rust runtime codebase and its applicable testing documentation.

This document covers only how those tests relate to frontend confidence and how frontend integration tests consume their results.

### 9.2 Rust Test Execution

Run Rust tests using the commands defined by the runtime repository and its build configuration.

A typical Rust workspace may use:

    cargo test

This example is not a guarantee that every workspace or package uses the same command. Follow the runtime repository's documented test entry point.

### 9.3 Frontend Dependencies on Runtime Tests

A frontend feature that relies on native behavior SHOULD identify the corresponding runtime capability and its available validation evidence.

Examples include:

- Command availability.
- Request validation.
- Runtime lifecycle behavior.
- Event delivery.
- Error propagation.
- Resource cleanup.
- Cancellation semantics.

Frontend tests SHOULD NOT reimplement the full native test suite.

### 9.4 Mock Versus Runtime Evidence

Keep mock-based and runtime-based evidence separate.

| Evidence | What it demonstrates |
|---|---|
| Vitest adapter test with a mock | Frontend mapping and error handling against the configured mock |
| Component test with an IPC mock | User-visible behavior for the modeled IPC outcomes |
| Rust unit test | Behavior covered by the native unit test |
| Frontend/runtime integration test | Interoperability exercised across the tested boundary |
| Playwright test with a real runtime integration environment | The end-to-end behavior exercised in that environment |

The test report MUST describe the actual environment used.

### 9.5 Runtime Unavailable

When the runtime cannot be launched in a local or CI environment, mock-based tests MAY still validate frontend behavior.

The missing runtime integration MUST be recorded when it is required by the relevant milestone or review.

Do not imply that successful mock tests prove that the native runtime is operational.

### 9.6 Runtime Failure Simulation

Frontend tests SHOULD simulate runtime failure conditions that produce meaningful user-visible behavior.

Examples include unavailable runtime services, rejected commands, delayed responses, and unexpected disconnection where supported by the interface.

Use controlled mocks or a dedicated integration fixture rather than depending on accidental machine failures.

## 10. Visual Regression Testing

### 10.1 Purpose

Visual regression testing detects unintended changes in the appearance or layout of the frontend.

It complements behavioral testing and MUST NOT replace functional assertions.

### 10.2 Appropriate Coverage

Visual regression testing is especially useful for:

- Shared components.
- Navigation and layout.
- Complex forms.
- Dialogs and overlays.
- Dense data displays.
- Loading and empty states.
- Responsive layouts.
- High-impact user workflows.

Avoid generating snapshots for every trivial component without a clear maintenance benefit.

### 10.3 Stable Rendering

Visual tests SHOULD control factors that cause irrelevant differences:

- Viewport dimensions.
- Font availability.
- Animation state.
- Clock-dependent content.
- Fixture data.
- Network resources.
- Browser version where practical.
- Device scale factor when relevant.

The test environment SHOULD use stable assets and deterministic content.

### 10.4 Snapshot Review

When a visual comparison changes:

1. Identify the changed regions.
2. Determine whether the difference is intended.
3. Check whether the change affects layout, readability, or interaction.
4. Review responsive and accessibility implications.
5. Update approved baselines only after validating the new appearance.

Do not approve snapshots solely to silence a failing test.

### 10.5 Visual Test Boundaries

Visual tests SHOULD verify presentation, not duplicate every business logic assertion.

Behavior that cannot be inferred reliably from pixels MUST be verified through functional tests.

### 10.6 Responsive Testing

Where the frontend supports multiple viewport sizes, test representative layouts.

Prioritize breakpoints where navigation, content density, or interaction behavior changes.

A screenshot at one viewport MUST NOT be treated as proof that all responsive layouts work correctly.

### 10.7 Environment Differences

Font rendering and operating-system differences can produce legitimate pixel variations.

Use the repository's established visual testing environment and documented tolerances.

Tolerances MUST NOT be so broad that they hide meaningful layout or styling defects.

## 11. Accessibility Testing

### 11.1 Scope

Accessibility testing SHOULD be performed at component and workflow levels.

It MUST be appropriate to the interactive behavior and intended use of the frontend.

### 11.2 Semantic Queries

React Testing Library tests SHOULD use semantic queries where possible.

This encourages components to expose meaningful roles, labels, and accessible names.

Tests SHOULD NOT be changed to use implementation-specific selectors merely because a component has inaccessible semantics.

### 11.3 Keyboard Interaction

Test keyboard interaction for controls that require it.

Relevant checks MAY include:

- Tab order.
- Focus visibility.
- Enter and Space activation.
- Arrow-key behavior for composite widgets.
- Escape dismissal where supported.
- Focus trapping and restoration for modal dialogs.
- Keyboard access to menus and navigation.

Only assert key behavior required by the actual component pattern.

### 11.4 Focus Management

Components that open overlays, change routes, or replace substantial content SHOULD handle focus appropriately.

Tests SHOULD verify focus placement and restoration when these are part of the component's expected behavior.

### 11.5 Accessible Names and Descriptions

Interactive elements MUST expose suitable accessible names.

Form errors and descriptions SHOULD be associated with the relevant fields.

Tests SHOULD verify these relationships for complex or reusable form components.

### 11.6 Dynamic State Announcements

Where an operation updates content asynchronously, determine whether assistive technologies need a status announcement.

Test the semantic mechanism and observable state where practical.

Do not add live announcements to every changing element without considering usability.

### 11.7 Automated Scanning

Use the accessibility scanning tools already approved for the frontend.

Automated scans SHOULD cover representative screens and important states.

A clean automated scan does not establish full compliance; manual keyboard and assistive-technology evaluation may still be required.

### 11.8 Manual Review

Manual accessibility review SHOULD be used for:

- Complex interactive widgets.
- Important multi-step workflows.
- Dialogs and overlays.
- Keyboard-dependent interaction.
- Content whose meaning depends on visual presentation.
- Areas where automated tooling cannot verify the expected behavior.

Record material limitations and unresolved accessibility defects through the established project workflow.

## 12. Frontend Coverage Targets

### 12.1 Purpose

Coverage targets guide frontend test completeness and help identify untested logic.

They do not replace behavioral assertions, contract validation, accessibility testing, or end-to-end evidence.

### 12.2 Proposed Domain Targets

The following are frontend-specific engineering targets. They are not claims about current repository coverage and do not override stricter requirements in `docs/development/TESTING_STRATEGY.md`.

| Scope | Target | Rationale |
|---|---:|---|
| Pure utility and transformation logic | At least 90% statement coverage | Deterministic logic is inexpensive to exercise thoroughly |
| Frontend API and IPC adapters | At least 85% statement coverage | Boundary mapping and failure behavior need strong coverage |
| Important state transition logic | At least 85% statement coverage | Incorrect transitions can affect entire workflows |
| Shared component behavior | At least 80% statement coverage | Reused UI requires consistent behavior |
| Feature-specific component logic | At least 75% statement coverage | Provides a baseline while allowing UI-specific variation |
| Overall frontend code | At least 80% statement coverage | Useful aggregate target without replacing risk-based testing |

These targets are proposed frontend domain targets and MUST be reconciled with actual repository tooling and any stricter approved global policy before being enforced as blocking gates.

### 12.3 Coverage Metrics

Where supported, report:

- Statement coverage.
- Branch coverage.
- Function coverage.
- Line coverage.

Statement coverage is the primary target in the table above. Other metrics SHOULD be used to identify gaps that statement coverage alone may miss.

### 12.4 Coverage Exclusions

Coverage exclusions SHOULD be narrow and justified.

Potential exclusions MAY include:

- Generated code.
- Build configuration files.
- Type declarations with no executable logic.
- Thin bootstrap files that cannot be meaningfully isolated.

Do not exclude complex or failure-prone logic merely because it is difficult to test.

### 12.5 Coverage Interpretation

A coverage report SHOULD be reviewed alongside test quality.

For example, a test that executes a branch but never asserts its observable result contributes coverage without necessarily providing confidence.

Prioritize missing assertions and meaningful failure-path coverage over cosmetic percentage improvements.

### 12.6 Coverage Changes

When a change materially reduces coverage, identify the reason.

A temporary exclusion or target adjustment MUST have a clear justification and follow the relevant global quality policy.

Do not lower a target solely to make a failing change pass.

### 12.7 Coverage Ownership

This file defines frontend domain targets only.

Global enforcement, CI thresholds, release-blocking rules, and repository-wide reporting remain owned by `docs/development/TESTING_STRATEGY.md` and the applicable global development documents.

## 13. Test Fixtures and Test Data

### 13.1 Fixture Design

Fixtures SHOULD be small, deterministic, and relevant to the behavior being tested.

Use named fixture builders when many tests need related data.

Avoid large copied payloads when a smaller example can demonstrate the same contract behavior.

### 13.2 Contract Compatibility

API, event, artifact, and IPC fixtures MUST follow their authoritative contracts.

When a contract changes, search for and update affected fixtures.

A fixture MUST NOT be treated as authoritative evidence of the contract itself.

### 13.3 Sensitive Data

Tests MUST NOT include real production credentials, access tokens, private keys, or unnecessary personal data.

Use synthetic test data and approved test identities.

Diagnostic artifacts MUST be reviewed for accidental disclosure before being shared.

### 13.4 Test Data Isolation

Tests SHOULD use isolated records and unique identifiers when interacting with a test service.

Cleanup MUST be reliable where tests create persistent state.

Parallel tests MUST NOT interfere with each other's fixtures.

### 13.5 Fixture Lifecycle

Fixture setup and teardown SHOULD be explicit.

Tests MUST release listeners, timers, subscriptions, temporary files, and other resources they create.

Leaked resources can cause flaky tests and misleading failures in later tests.

## 14. Frontend Test Failure Diagnosis

### 14.1 Failure Classification

Classify a frontend test failure before changing the test or implementation.

Possible categories include:

- Product behavior defect.
- Frontend implementation defect.
- Incorrect or outdated mock.
- Contract mismatch.
- Test isolation problem.
- Timing or synchronization problem.
- Environment or dependency failure.
- Visual baseline change.
- Accessibility defect.

### 14.2 Unit and Component Failures

For Vitest or React Testing Library failures:

1. Inspect the assertion and rendered output.
2. Confirm the fixture represents the intended contract.
3. Check asynchronous state updates.
4. Check mock lifecycle and cleanup.
5. Determine whether the implementation or expectation is incorrect.
6. Add a regression test when a real defect is fixed.

### 14.3 Playwright Failures

For browser workflow failures:

1. Inspect the failing step and browser trace.
2. Check console and relevant network errors.
3. Confirm test data and environment availability.
4. Check selectors and synchronization.
5. Reproduce the behavior in the configured test environment.
6. Separate genuine product failures from infrastructure failures.

### 14.4 IPC Failures

For IPC-related failures:

1. Confirm the command or event name.
2. Compare the payload with the authoritative contract.
3. Inspect the mock response or rejection.
4. Check adapter error mapping.
5. Confirm listener registration and cleanup.
6. Run runtime integration tests when the failure crosses the native boundary.

### 14.5 Visual Failures

For visual test failures:

1. Compare the actual and expected rendering.
2. Check viewport, fonts, assets, and fixture data.
3. Determine whether the difference is intentional.
4. Review layout and accessibility impact.
5. Update the baseline only when the new result is correct.

### 14.6 Do Not Mask Failures

Tests MUST NOT be disabled, weakened, or broadly skipped simply to obtain a passing result.

A justified skip SHOULD have a clear reason and a defined path to restoration.

Follow global failure reporting and escalation policy in `docs/development/TESTING_STRATEGY.md`.

## 15. Frontend Test Execution and Tooling

### 15.1 Discover Repository Commands

Use the actual scripts declared in the frontend package manifest and repository documentation.

Do not assume that all projects use identical package names or script aliases.

A frontend package may expose commands such as:

    pnpm test
    pnpm test:watch
    pnpm test:coverage
    pnpm test:e2e

These are illustrative examples only. Run the commands actually provided by the repository.

### 15.2 Vitest

Use the configured Vitest script for unit and component tests.

For focused debugging, use the supported test-name or file filters.

Do not make local-only configuration changes that diverge from CI without documenting and reviewing the need.

### 15.3 Playwright

Use the repository's configured Playwright script and browser installation process.

Confirm that required services and test fixtures are available.

Retain the relevant failure artifacts when investigating a failed workflow.

### 15.4 Rust Runtime Tests

Use the Local Runtime repository's documented test commands.

When frontend confidence depends on native behavior, record whether runtime tests were executed and whether frontend/runtime integration was validated.

Do not replace the runtime's test policy with frontend-specific commands.

### 15.5 Test Setup Documentation

General installation and environment preparation are owned by:

- `docs/development/DEVELOPMENT_SETUP.md`
- `docs/frontend/development/DEVELOPMENT_SETUP.md`

This file describes how testing is organized and what it verifies; it does not repeat the complete development setup process.

## 16. Relationship to Phases and Milestones

### 16.1 Phase Authority

`docs/planning/PHASES.md` is the canonical source for phase definitions.

This document MUST NOT redefine phase scope or use testing guidance to create additional product deliverables.

### 16.2 Canonical Phases

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

### 16.3 Frontend Milestones

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 |
| F-M02 | PROJECTS | P1 |
| F-M03 | BUILD & ARTIFACT | P2 |
| F-M04 | BOOKING | P4 |
| F-M05 | EXECUTION | P5 |
| F-M06 | LIVE | P7 |
| F-M07 | RESULTS | P7 |

The authoritative dossiers under `docs/frontend/milestones/` define milestone scope and acceptance.

This document defines frontend testing practices only. It MUST NOT replace or duplicate milestone acceptance criteria.

### 16.4 Cross-Domain Validation

Frontend tests may contribute evidence for cross-domain workflows.

Backend, database, cloud, and native runtime acceptance remain owned by their respective implementation and milestone documents.

A frontend test MUST NOT be presented as proof that an untested downstream domain is correct.

## 17. Maintenance and Change Control

### 17.1 When to Update This Document

Update this document when frontend testing practices materially change, including:

- Vitest configuration or test conventions.
- React Testing Library usage.
- Playwright workflows.
- IPC mock or integration strategy.
- Rust runtime integration evidence.
- Visual regression tooling.
- Accessibility validation.
- Frontend coverage targets.
- Frontend test fixture conventions.

### 17.2 Global Testing Policy Changes

Global testing strategy, repository-wide test gates, and release requirements MUST be changed in their authoritative global documents.

Do not duplicate global requirements in this file.

### 17.3 Contract Changes

API contract changes belong to the owner of `docs/protocol/API_CONTRACT.md`.

Event contract changes belong to the owner of `docs/protocol/EVENT_CONTRACT.md`.

Artifact contract changes belong to the owner of `docs/protocol/ARTIFACT_MANIFEST.md`.

IPC contract changes MUST follow the applicable authoritative IPC definition and the coordination workflow in `docs/frontend/development/DEVELOPMENT_WORKFLOW.md`.

Frontend tests MUST be updated to match approved contract changes.

### 17.4 Architecture Changes

Material frontend testing architecture changes SHOULD be reviewed against the frontend architecture and recorded through `docs/frontend/planning/DECISIONS.md` when appropriate.

Cross-domain decisions MUST follow `docs/planning/DECISIONS.md`.

### 17.5 Review of Testing Guidance

When changing this document, verify that:

- Testing tool recommendations match the repository.
- Examples are clearly identified as illustrative where appropriate.
- Coverage targets are not misrepresented as existing results.
- Mock-based tests are distinguished from integration tests.
- Accessibility guidance remains actionable.
- Global policy is not duplicated.
- Phase and milestone references use the frozen canonical model.
- Links point to the authoritative owners.

## 18. Frontend Testing Checklist

### 18.1 Unit and Component Tests

- [ ] Tests focus on observable behavior or meaningful module contracts.
- [ ] Normal and important boundary cases are covered.
- [ ] Asynchronous behavior is synchronized deterministically.
- [ ] Mocks are isolated and restored.
- [ ] Loading, empty, and failure states are tested where relevant.
- [ ] Components are queried through accessible semantics where possible.
- [ ] Tests do not depend on execution order.

### 18.2 End-to-End Tests

- [ ] Important user journeys are represented.
- [ ] Test data is deterministic and isolated.
- [ ] Selectors are stable and meaningful.
- [ ] Synchronization relies on observable conditions.
- [ ] High-value failure scenarios are covered.
- [ ] Diagnostics do not expose sensitive information.
- [ ] Test environment limitations are documented.

### 18.3 Tauri and IPC

- [ ] Mocks match the authoritative contract.
- [ ] Success and meaningful failure cases are covered.
- [ ] Event listeners are cleaned up.
- [ ] Lifecycle assumptions are tested where relevant.
- [ ] Permission-related failures are handled.
- [ ] Mock-based and real-runtime evidence are distinguished.
- [ ] Required runtime integration tests are identified.

### 18.4 Visual and Accessibility Testing

- [ ] Important visual states are represented.
- [ ] Snapshot changes are reviewed before baselines are updated.
- [ ] Representative responsive layouts are checked.
- [ ] Keyboard interaction is tested where relevant.
- [ ] Focus behavior is verified for overlays and navigation changes.
- [ ] Accessible names and error associations are checked.
- [ ] Automated accessibility results are not treated as complete proof.

### 18.5 Coverage and Evidence

- [ ] Coverage is reviewed alongside assertion quality.
- [ ] Exclusions are narrow and justified.
- [ ] Frontend targets are distinguished from global gates.
- [ ] Relevant test results are available for review.
- [ ] Known limitations and unavailable integration checks are documented.
- [ ] The authoritative milestone dossier remains the source of acceptance criteria.

## 19. Definition of Done

Frontend testing practices are adequately documented when:

1. The ownership boundary with `docs/development/TESTING_STRATEGY.md` is explicit.
2. Vitest and React Testing Library responsibilities are clear.
3. Playwright is used for appropriate browser-level workflows.
4. Tauri and IPC mocks represent approved contracts.
5. Mock-based tests are not confused with runtime integration evidence.
6. Rust Local Runtime testing remains owned by the runtime implementation.
7. Visual regression and accessibility validation are included where appropriate.
8. Frontend coverage targets are explicit and do not override global policy.
9. Fixtures are deterministic, isolated, and free of sensitive production data.
10. Test failures can be diagnosed without masking genuine defects.
11. Testing evidence is traceable to the relevant architecture and milestone dossiers.
12. Phase and milestone references use the frozen canonical model.
13. No global testing policy or unrelated domain test plan is duplicated.

This document owns frontend-specific testing only. Global testing strategy and enforcement remain owned by `docs/development/TESTING_STRATEGY.md`; authoritative contracts, implementation architectures, and milestone acceptance remain owned by their respective documents.
