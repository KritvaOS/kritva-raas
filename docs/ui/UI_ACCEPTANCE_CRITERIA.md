# Kritva RaaS Studio UI Acceptance Criteria

## 1. Purpose

This document defines the production acceptance criteria for Kritva RaaS Studio
UI implementation.

It establishes the measurable criteria required for a UI feature, screen,
component, frontend milestone, or complete Studio release to be considered
acceptable.

The acceptance model covers:

- functional correctness;
- visual consistency;
- accessibility;
- keyboard interaction;
- responsiveness;
- performance;
- loading behavior;
- empty states;
- error handling;
- offline/reconnect behavior;
- security;
- source privacy;
- safety;
- internationalization readiness;
- cross-platform desktop behavior;
- API integration;
- testing;
- evidence;
- review;
- release readiness.

The governing product principle is:

> Build locally. Book remotely. Run on real robots.

## 2. Scope

This specification applies to:

- F-M01 STUDIO FOUNDATION (P0-P1);
- F-M02 PROJECTS (P1);
- F-M03 BUILD & ARTIFACT (P2);
- F-M04 BOOKING (P4);
- F-M05 EXECUTION (P5);
- F-M06 LIVE (P7);
- F-M07 RESULTS (P7).

It applies to:

- screens;
- routes;
- shared components;
- feature components;
- dialogs;
- forms;
- tables;
- charts;
- video;
- logs;
- telemetry;
- navigation;
- notifications;
- settings;
- authentication flows.

## 3. Goals

The acceptance system shall:

1. prevent "screen renders" from being treated as completion;
2. require functional and visual correctness;
3. enforce accessibility from the beginning;
4. verify every important state;
5. require real API integration before milestone acceptance;
6. protect the local source-code boundary;
7. enforce safe execution UX;
8. make evidence reproducible;
9. support consistent milestone reviews;
10. provide objective Definition of Done criteria.

## 4. Non-Goals

This document does not define:

- backend acceptance criteria in full;
- PostgreSQL schema acceptance in full;
- robot hardware validation;
- physical emergency-stop validation;
- cloud infrastructure acceptance in full;
- product pricing policy;
- marketing website acceptance.

Where UI acceptance depends on another domain, this document defines the UI
dependency and evidence required from that domain.

## 5. Acceptance Philosophy

UI acceptance follows:

    Requirement
        |
        v
    Design
        |
        v
    Implementation
        |
        v
    Unit / Component Tests
        |
        v
    Contract Integration
        |
        v
    Accessibility
        |
        v
    E2E
        |
        v
    Review
        |
        v
    Evidence
        |
        v
    ACCEPTED

No UI work is accepted solely from screenshots or a successful local launch.

## 6. Definitions

| Term | Definition |
|---|---|
| Screen | User-facing route or major application view |
| Component | Reusable UI building block |
| Feature | User-facing capability composed of components |
| Milestone | F-M01 through F-M07 delivery unit |
| Acceptance | Evidence-based confirmation that criteria are met |
| DoD | Definition of Done |
| WCAG | Web Content Accessibility Guidelines |
| E2E | End-to-end test |
| Visual QA | Review of visual implementation against approved design |
| Contract | Versioned frontend/backend interface |
| Evidence | Artifact proving an acceptance criterion |
| Regression | Previously accepted behavior that has broken |
| Blocking Defect | Defect preventing acceptance or safe operation |

## 7. Acceptance Categories

Every applicable UI item is evaluated across:

| Category | Required |
|---|---|
| Functional | Yes |
| Visual | Yes |
| Accessibility | Yes |
| Keyboard | Yes |
| Responsive/Desktop | Yes |
| Loading | Yes |
| Empty | Yes |
| Error | Yes |
| Performance | Yes |
| Security | Where applicable |
| Safety | Where applicable |
| i18n readiness | Yes |
| API integration | Where applicable |
| Tests | Yes |
| Evidence | Yes |

## 8. Severity Classification

| Severity | Meaning |
|---|---|
| S0 | Safety/security/data-integrity critical |
| S1 | Major functionality or release blocker |
| S2 | Significant but contained defect |
| S3 | Minor defect with workaround |
| S4 | Cosmetic/informational |

S0 and S1 defects block acceptance.

S2 defects normally block acceptance unless explicitly waived.

S3/S4 defects may be accepted only when documented and tracked.

## 9. Evidence Principle

Evidence must demonstrate actual behavior.

Acceptable evidence includes:

- automated test output;
- accessibility audit;
- visual regression result;
- E2E result;
- API integration test;
- screen recording;
- screenshots;
- performance measurements;
- build logs;
- CI result;
- review approval;
- security scan.

Screenshots alone are insufficient for functional acceptance.

## 10. Evidence Chain

The preferred evidence chain is:

    Task
      |
      v
    Implementation Commit
      |
      v
    Automated Tests
      |
      v
    Integration Test
      |
      v
    Visual / Accessibility Review
      |
      v
    E2E Evidence
      |
      v
    Reviewer Approval

## 11. General Screen Acceptance

Every production screen shall satisfy:

- [ ] Correct route.
- [ ] Correct page title.
- [ ] Correct heading hierarchy.
- [ ] Correct navigation context.
- [ ] Correct authorization behavior.
- [ ] Correct API integration.
- [ ] Correct loading state.
- [ ] Correct empty state.
- [ ] Correct error state.
- [ ] Correct offline behavior.
- [ ] Correct keyboard behavior.
- [ ] Correct accessibility semantics.
- [ ] Correct light theme.
- [ ] Correct dark theme.
- [ ] Correct desktop scaling.
- [ ] Correct responsive behavior.
- [ ] Correct terminology.
- [ ] Correct analytics/privacy behavior.
- [ ] Tests pass.

## 12. Global Functional Criteria

All screens shall:

- [ ] Render successfully.
- [ ] Load required data.
- [ ] Handle missing data.
- [ ] Handle authorization failures.
- [ ] Handle network failures.
- [ ] Handle server errors.
- [ ] Prevent invalid actions.
- [ ] Prevent duplicate submissions.
- [ ] Preserve valid input after recoverable errors.
- [ ] Navigate to related resources correctly.
- [ ] Preserve relevant context.
- [ ] Avoid mutating remote state unintentionally.

## 13. Global Visual Criteria

All screens shall:

- [ ] Use approved design tokens.
- [ ] Use approved typography.
- [ ] Use approved spacing.
- [ ] Use approved iconography.
- [ ] Use approved component variants.
- [ ] Align to the application grid.
- [ ] Maintain visual hierarchy.
- [ ] Have consistent action placement.
- [ ] Have consistent status presentation.
- [ ] Work in light mode.
- [ ] Work in dark mode.
- [ ] Have no unintended clipping.
- [ ] Have no overlapping controls.
- [ ] Have no unexplained visual artifacts.

## 14. Global Accessibility Criteria

All screens shall target WCAG 2.2 AA practices.

- [ ] All controls have accessible names.
- [ ] All form fields have labels.
- [ ] Heading hierarchy is logical.
- [ ] Keyboard navigation works.
- [ ] Focus is visible.
- [ ] Focus order is logical.
- [ ] Dialog focus is managed.
- [ ] Dynamic status is announced where required.
- [ ] Color is not the only status indicator.
- [ ] Contrast is acceptable.
- [ ] Reduced motion is respected.
- [ ] Screen-reader semantics are meaningful.

## 15. Global Keyboard Criteria

- [ ] Tab moves through interactive controls logically.
- [ ] Shift+Tab reverses navigation.
- [ ] Enter activates applicable controls.
- [ ] Space activates applicable controls.
- [ ] Escape closes dialogs/popovers where appropriate.
- [ ] Arrow keys work for composite widgets where applicable.
- [ ] No keyboard trap exists outside intentional dialogs.
- [ ] Focus remains visible.
- [ ] Focus returns correctly after modal closure.

## 16. Global Loading Criteria

Loading states shall:

- [ ] appear near affected content;
- [ ] preserve page structure where possible;
- [ ] avoid unnecessary full-screen blocking;
- [ ] show progress for known-duration operations;
- [ ] show indeterminate state otherwise;
- [ ] prevent duplicate actions;
- [ ] recover on completion or failure.

## 17. Global Empty-State Criteria

Every empty state shall:

- [ ] explain what is empty;
- [ ] explain why where useful;
- [ ] provide a next action;
- [ ] use accessible text;
- [ ] avoid implying an error;
- [ ] work in light and dark themes.

## 18. Global Error Criteria

Every error state shall:

- [ ] identify the failed operation;
- [ ] provide a human-readable explanation;
- [ ] indicate whether retry is possible;
- [ ] provide recovery where possible;
- [ ] avoid raw stack traces;
- [ ] preserve user input where possible;
- [ ] expose a reference identifier where appropriate.

## 19. Global Performance Criteria

The UI shall:

- [ ] remain responsive during local builds;
- [ ] avoid blocking the React UI thread;
- [ ] virtualize large lists;
- [ ] bound log rendering;
- [ ] aggregate high-frequency telemetry;
- [ ] lazy-load heavy visualizations where practical;
- [ ] avoid unnecessary re-renders;
- [ ] handle large result sets predictably.

## 20. Global Responsiveness Criteria

Studio is desktop-first.

Acceptance shall cover:

- [ ] Linux x86_64.
- [ ] Windows x86_64.
- [ ] macOS Apple Silicon when P1 support is enabled.
- [ ] common desktop scaling.
- [ ] resized windows.
- [ ] maximized windows.
- [ ] reduced available width.
- [ ] collapsed navigation.

Critical actions must remain reachable at supported window sizes.

## 21. Global i18n Readiness

Initial production language may be English, but the UI shall be localization
ready.

- [ ] No user-facing strings are unnecessarily hardcoded into logic.
- [ ] Text is externalizable.
- [ ] Dates use locale-aware formatting.
- [ ] Numbers use locale-aware formatting.
- [ ] Timezones are explicit where needed.
- [ ] Layout does not depend on fixed English string lengths.
- [ ] Pluralization can be supported.
- [ ] Long translated strings do not break controls.

## 22. Global Security Criteria

Where applicable:

- [ ] Authorization is enforced by the backend.
- [ ] Unauthorized controls are not executable.
- [ ] Secrets are never rendered.
- [ ] Sensitive logs are protected.
- [ ] Tenant boundaries are preserved.
- [ ] Artifact trust state is visible.
- [ ] Source privacy is maintained.
- [ ] Analytics do not capture source code.

## 23. Global Safety Criteria

For execution-related UI:

- [ ] Local safety authority is visible.
- [ ] Studio is not presented as an emergency-stop system.
- [ ] Unsafe states block applicable operations.
- [ ] Disconnect behavior is explicit.
- [ ] No unsafe automatic restart is offered.
- [ ] Safety errors cannot be bypassed through normal UI controls.

# 24. Screen Acceptance — Login

## 24.1 Functional

- [ ] Email/password login works where configured.
- [ ] SSO works where configured.
- [ ] MFA/passkey works where configured.
- [ ] Invalid credentials are handled.
- [ ] Session restoration works.
- [ ] Logout works.
- [ ] Session expiry is handled.

## 24.2 Visual

- [ ] Kritva branding is visible.
- [ ] Login form is visually centered and readable.
- [ ] Primary action is obvious.
- [ ] Authentication methods are clearly separated.
- [ ] Loading state is visible.
- [ ] Error state is visually clear.

## 24.3 Accessibility

- [ ] Email field has label.
- [ ] Password field has label.
- [ ] Password visibility control is accessible.
- [ ] Form can be submitted by keyboard.
- [ ] Authentication errors are announced.
- [ ] Focus moves appropriately after failure.

## 24.4 Performance and Error Handling

- [ ] Login does not freeze the UI.
- [ ] Network failure is recoverable.
- [ ] Authentication timeout is handled.
- [ ] Retry does not duplicate session creation.

# 25. Screen Acceptance — Dashboard

## 25.1 Functional

- [ ] Recent projects load.
- [ ] Active jobs load.
- [ ] Upcoming bookings load.
- [ ] Credit summary loads.
- [ ] Recent results load.
- [ ] Quick actions navigate correctly.

## 25.2 Visual

- [ ] Widget hierarchy is clear.
- [ ] Important operational state is prominent.
- [ ] Cards use consistent spacing.
- [ ] Status text is explicit.
- [ ] Empty widgets have meaningful messages.

## 25.3 Accessibility

- [ ] Widget headings are semantic.
- [ ] Cards are keyboard navigable when actionable.
- [ ] Status is not color-only.
- [ ] Dynamic updates are announced where appropriate.

# 26. Screen Acceptance — Projects

## 26.1 Functional

- [ ] Project list loads.
- [ ] Search works.
- [ ] Filtering works.
- [ ] Project creation works.
- [ ] Project detail opens.
- [ ] Project switching works.
- [ ] Project authorization is respected.

## 26.2 Visual

- [ ] Table alignment is correct.
- [ ] Status is visible.
- [ ] Project metadata is scannable.
- [ ] Primary New Project action is prominent.

## 26.3 Accessibility

- [ ] Table headers are semantic.
- [ ] Row actions are keyboard accessible.
- [ ] Search has accessible label.
- [ ] Filters have accessible names.

# 27. Screen Acceptance — Project Overview

- [ ] Project name is visible.
- [ ] Project status is visible.
- [ ] Platform is visible.
- [ ] Runtime and SDK are visible where applicable.
- [ ] Build action works.
- [ ] Artifact action works.
- [ ] Run action follows authorization/state.
- [ ] Project tabs work.
- [ ] Breadcrumbs work.
- [ ] Empty states work.
- [ ] Unauthorized actions are blocked.

# 28. Screen Acceptance — Source

## 28.1 Functional

- [ ] Local source directory is displayed.
- [ ] Local project metadata is detected.
- [ ] Local build configuration is visible.
- [ ] Source remains local.
- [ ] Files are not uploaded merely for display.

## 28.2 Visual and Accessibility

- [ ] "SOURCE: LOCAL ONLY" is visible.
- [ ] Local/remote boundary is understandable.
- [ ] Filesystem actions are keyboard accessible.
- [ ] Permission errors are actionable.

## 28.3 Security

- [ ] Source privacy test passes.
- [ ] Analytics do not contain source contents.
- [ ] Logs do not expose source unexpectedly.

# 29. Screen Acceptance — Build

## 29.1 Functional

- [ ] Build configuration can be selected.
- [ ] Build starts.
- [ ] Build progress updates.
- [ ] Test stage is visible.
- [ ] Package stage is visible.
- [ ] Build completes.
- [ ] Build can fail cleanly.
- [ ] Build can be cancelled where safe.

## 29.2 Visual

- [ ] Build stages are clearly ordered.
- [ ] Current stage is obvious.
- [ ] Progress is readable.
- [ ] Logs are visually distinct.
- [ ] Local operation is clearly identified.

## 29.3 Accessibility

- [ ] Build state is announced.
- [ ] Progress has accessible semantics.
- [ ] Log controls are keyboard accessible.
- [ ] Errors are announced.

# 30. Screen Acceptance — Build Logs

- [ ] Logs stream correctly.
- [ ] Search works.
- [ ] Severity filtering works.
- [ ] Follow mode works.
- [ ] Pause works.
- [ ] Large logs remain responsive.
- [ ] Log severity is textual.
- [ ] Sensitive values are not exposed.
- [ ] Download works where authorized.
- [ ] Keyboard scrolling works.

# 31. Screen Acceptance — Artifacts

## 31.1 Functional

- [ ] Artifact list loads.
- [ ] Search/filter works.
- [ ] Artifact detail opens.
- [ ] Metadata is accurate.
- [ ] Security status is displayed.
- [ ] Compatibility status is displayed.
- [ ] Upload can be initiated.
- [ ] Upload progress works.
- [ ] Server validation result is shown.

## 31.2 Security

- [ ] Source is not included in upload.
- [ ] Signature status is authoritative.
- [ ] Integrity status is authoritative.
- [ ] Scan status is authoritative.
- [ ] Revoked artifact cannot be executed.

# 32. Screen Acceptance — Platforms

- [ ] Platform list loads.
- [ ] Search works.
- [ ] Filtering works.
- [ ] Platform type is visible.
- [ ] Version is visible.
- [ ] Architecture is visible.
- [ ] Runtime is visible.
- [ ] SDK is visible.
- [ ] Capabilities are visible.
- [ ] Configuration is visible.
- [ ] Availability is represented.
- [ ] Platform detail works.

# 33. Screen Acceptance — Compatibility

- [ ] Compatible state works.
- [ ] Warning state works.
- [ ] Incompatible state works.
- [ ] Unknown state works.
- [ ] Validation-in-progress state works.
- [ ] Mismatch is explained.
- [ ] Required and available versions are shown where useful.
- [ ] User receives an actionable alternative where possible.

# 34. Screen Acceptance — Booking

## 34.1 Functional

- [ ] Platform can be selected.
- [ ] Configuration can be selected.
- [ ] Date can be selected.
- [ ] Available times are displayed.
- [ ] Duration can be selected.
- [ ] Resource can be selected where applicable.
- [ ] Credit estimate is calculated.
- [ ] Booking can be confirmed.
- [ ] Booking state is refreshed from server.

## 34.2 Financial

- [ ] Rate is visible.
- [ ] Required credits are visible.
- [ ] Current balance is visible.
- [ ] Remaining balance is visible.
- [ ] Insufficient credits are handled.
- [ ] Client calculation is not treated as authoritative.

## 34.3 Conflict Handling

- [ ] Stale availability is handled.
- [ ] Concurrent booking conflict is handled.
- [ ] Duplicate confirmation is prevented.
- [ ] Expired booking is represented.

# 35. Screen Acceptance — Booking Detail

- [ ] Booking ID is visible.
- [ ] Platform is visible.
- [ ] Configuration is visible.
- [ ] Resource is visible.
- [ ] Time is visible.
- [ ] Duration is visible.
- [ ] Credit reservation is visible where authorized.
- [ ] Status is authoritative.
- [ ] Cancellation is policy-controlled.

# 36. Screen Acceptance — Credits

## 36.1 Functional

- [ ] Platform-specific wallets are visible.
- [ ] Balance is visible.
- [ ] Reserved amount is visible.
- [ ] Available amount is visible.
- [ ] Rate information is visible where applicable.
- [ ] Ledger is accessible.
- [ ] Platform identity is always clear.

## 36.2 Visual

- [ ] Credit numbers are easy to scan.
- [ ] Financial information has strong hierarchy.
- [ ] Negative/insufficient state is explicit.
- [ ] No misleading global balance is shown where credits are platform-specific.

# 37. Screen Acceptance — Jobs

- [ ] Job list loads.
- [ ] Status filters work.
- [ ] Job detail loads.
- [ ] Job ID is visible.
- [ ] Project is visible.
- [ ] Artifact is visible.
- [ ] Platform is visible.
- [ ] Booking is visible.
- [ ] Run is visible where created.
- [ ] Lifecycle is visible.
- [ ] Failure states are visible.

# 38. Screen Acceptance — Live Run

## 38.1 Functional

- [ ] Run status is authoritative.
- [ ] Job ID is visible.
- [ ] Run ID is visible.
- [ ] Platform is visible.
- [ ] Video connects where configured.
- [ ] Telemetry streams.
- [ ] Logs stream.
- [ ] Stop operation works according to policy.
- [ ] Reconnect works.
- [ ] Completion is reflected.

## 38.2 Video

- [ ] Connecting state exists.
- [ ] Live state exists.
- [ ] Buffering state exists.
- [ ] Disconnected state exists.
- [ ] Full-screen works.
- [ ] Video loss does not change Job state.

## 38.3 Safety

- [ ] "SAFETY AUTHORITY: LOCAL" is visible.
- [ ] No emergency-stop claim exists.
- [ ] Safety-blocked execution cannot be bypassed.
- [ ] Cloud disconnect does not falsely imply robot stop.

# 39. Screen Acceptance — Telemetry

- [ ] Current values are shown.
- [ ] Units are shown.
- [ ] Timestamp is shown.
- [ ] Status is textual.
- [ ] Charts are readable.
- [ ] High-frequency streams are sampled.
- [ ] Large data does not freeze UI.
- [ ] Accessibility summary exists.
- [ ] Dark theme is readable.

# 40. Screen Acceptance — Results

## 40.1 Functional

- [ ] Results list loads.
- [ ] Search/filter works.
- [ ] Result detail works.
- [ ] Metrics load.
- [ ] Files load.
- [ ] Video/log/telemetry files are represented.
- [ ] Processing state works.
- [ ] Failure state works.
- [ ] Downloads work where authorized.

## 40.2 Rerun

- [ ] Rerun action is visible when allowed.
- [ ] Artifact is validated.
- [ ] Platform is validated.
- [ ] Availability is checked.
- [ ] Credit cost is displayed.
- [ ] Confirmation is explicit.
- [ ] New Job/Run is created.
- [ ] Original Result is unchanged.

# 41. Screen Acceptance — Settings

- [ ] Account settings work.
- [ ] Organization context works.
- [ ] Studio settings work.
- [ ] Build settings work.
- [ ] Security settings work.
- [ ] Notification settings work.
- [ ] Network settings work where exposed.
- [ ] About/version information is accurate.
- [ ] Sensitive values are not exposed.

# 42. Screen Acceptance — Admin Entry

- [ ] Admin entry is visible only where authorized.
- [ ] Backend authorization remains authoritative.
- [ ] Admin deep links work.
- [ ] Unauthorized users cannot execute admin actions.
- [ ] Sensitive administrative information is not exposed unnecessarily.

# 43. Cross-Cutting API Acceptance

- [ ] API client uses typed contracts.
- [ ] API versions are explicit.
- [ ] Error codes are mapped.
- [ ] Authentication headers/tokens are handled securely.
- [ ] Request retries follow policy.
- [ ] Idempotency is used for supported operations.
- [ ] Pagination is supported.
- [ ] WebSocket events are typed.
- [ ] Durable state can refresh after event loss.

# 44. Cross-Cutting Local Runtime Acceptance

- [ ] Tauri IPC calls are typed.
- [ ] Rust validates privileged operations.
- [ ] Filesystem access is bounded.
- [ ] Build commands cannot be injected through UI inputs.
- [ ] Local build errors are normalized.
- [ ] Local source is not sent to the Control Plane.
- [ ] Artifact packaging follows the defined boundary.

# 45. Cross-Cutting State Acceptance

The following state model must be supported:

    LOADING
       |
       v
    READY
       |
       +--> EMPTY
       |
       +--> ERROR
       |
       +--> OFFLINE
       |
       +--> RECONNECTING
       |
       v
    UPDATED

For live operations:

    CONNECTED
       |
       v
    DISCONNECTED
       |
       v
    RECONNECTING
       |
       +--> CONNECTED
       |
       +--> OFFLINE

State must be derived from authoritative sources where applicable.

# 46. Cross-Cutting Navigation Acceptance

- [ ] Global navigation is consistent.
- [ ] Project context is retained.
- [ ] Breadcrumbs are correct.
- [ ] Back navigation does not mutate remote state.
- [ ] Active jobs continue if the user navigates away.
- [ ] Unsaved local state is protected.
- [ ] Deep links work.
- [ ] Unauthorized routes fail safely.

# 47. Cross-Cutting Theming Acceptance

- [ ] Light theme passes visual QA.
- [ ] Dark theme passes visual QA.
- [ ] System theme works.
- [ ] Theme switching does not lose state.
- [ ] Focus is visible in both themes.
- [ ] Status is distinguishable in both themes.
- [ ] Charts work in both themes.
- [ ] Logs work in both themes.
- [ ] Video controls work in both themes.

# 48. Cross-Cutting Accessibility Acceptance

- [ ] WCAG-oriented automated checks pass.
- [ ] Keyboard-only workflow passes.
- [ ] Screen-reader smoke tests pass.
- [ ] Focus management passes.
- [ ] Contrast checks pass.
- [ ] Reduced-motion tests pass.
- [ ] Dynamic announcements work.
- [ ] No critical workflow depends on color.

# 49. Cross-Cutting Performance Acceptance

The UI shall be measured for:

- initial application startup;
- route navigation;
- API rendering;
- table rendering;
- build-log rendering;
- telemetry rendering;
- chart rendering;
- video initialization;
- result loading.

Performance thresholds shall be finalized during Phase 0/1 benchmarking and
recorded with evidence rather than guessed solely from design requirements.

# 50. Performance Regression Criteria

A UI change shall be investigated if it causes:

- material startup regression;
- visible interaction lag;
- sustained high CPU without justification;
- excessive memory growth;
- dropped live updates;
- frozen logs;
- telemetry rendering instability.

# 51. Responsive Acceptance

At supported desktop dimensions:

- [ ] No horizontal clipping of essential controls.
- [ ] No overlapping content.
- [ ] Sidebar can collapse.
- [ ] Tables remain usable.
- [ ] Dialogs remain accessible.
- [ ] Primary actions remain visible.
- [ ] Forms remain readable.
- [ ] Live Run remains operationally understandable.

# 52. i18n Acceptance

Before production localization:

- [ ] Strings are externalizable.
- [ ] No concatenation creates grammar constraints.
- [ ] Date formatting is locale-aware.
- [ ] Number formatting is locale-aware.
- [ ] Timezone display is explicit.
- [ ] UI tolerates longer labels.
- [ ] Pluralization is supported.
- [ ] Translation does not break button layout.

# 53. Source Privacy Acceptance

The following invariant is mandatory:

> Customer source code does not leave the developer machine as part of the
> normal RaaS development, build, packaging, booking, or execution workflow.

Evidence must include:

- [ ] source privacy architecture review;
- [ ] network boundary test;
- [ ] upload allowlist test;
- [ ] artifact inspection;
- [ ] log inspection;
- [ ] analytics inspection;
- [ ] E2E verification.

# 54. Artifact Acceptance

Artifact UI must accurately represent:

- [ ] manifest;
- [ ] platform;
- [ ] architecture;
- [ ] runtime;
- [ ] SDK;
- [ ] capabilities;
- [ ] checksum;
- [ ] signature;
- [ ] scan status;
- [ ] compatibility;
- [ ] revocation.

The UI must not independently override server artifact trust decisions.

# 55. Booking Acceptance

Booking UI must satisfy:

- [ ] server availability validation;
- [ ] explicit confirmation;
- [ ] credit estimate;
- [ ] idempotency;
- [ ] conflict handling;
- [ ] cancellation policy;
- [ ] authoritative state refresh.

# 56. Credit Acceptance

Credit UI must satisfy:

- [ ] platform-specific identity;
- [ ] current balance;
- [ ] reserved balance;
- [ ] required amount;
- [ ] remaining balance;
- [ ] authoritative server values;
- [ ] clear insufficient-credit state.

The UI must never perform authoritative financial mutation independently.

# 57. Job/Run Acceptance

The UI must preserve:

    Job
      |
      v
    Run

A Job is the execution request.

A Run is the execution instance.

The UI must not collapse the two concepts merely for convenience.

# 58. Live Execution Acceptance

Live execution shall distinguish:

    UI Connection
        |
        v
    Control Plane
        |
        v
    Job / Run
        |
        v
    Lab Agent
        |
        v
    Robot Runtime

Loss of one channel must not automatically imply loss of another.

# 59. Result Acceptance

Result acceptance requires:

- [ ] traceability to Run;
- [ ] traceability to Job;
- [ ] traceability to Artifact;
- [ ] traceability to Project;
- [ ] traceability to Platform;
- [ ] file availability state;
- [ ] download authorization;
- [ ] rerun traceability.

# 60. Definition of Ready for UI Work

A UI task is Ready when:

- [ ] user outcome is defined;
- [ ] screen/component scope is defined;
- [ ] design reference exists;
- [ ] API contract exists or is explicitly marked A1;
- [ ] state model is defined;
- [ ] accessibility requirements are defined;
- [ ] dependencies are identified;
- [ ] acceptance criteria exist;
- [ ] owner exists.

# 61. Definition of Done for UI Work

A UI task is Done when:

- [ ] implementation is complete;
- [ ] code is reviewed;
- [ ] unit/component tests pass;
- [ ] API contract tests pass where applicable;
- [ ] accessibility checks pass;
- [ ] visual QA passes;
- [ ] loading/empty/error states exist;
- [ ] light/dark themes pass;
- [ ] keyboard interaction passes;
- [ ] performance is acceptable;
- [ ] security review is complete where required;
- [ ] safety review is complete where required;
- [ ] evidence is attached;
- [ ] documentation is updated;
- [ ] issues are recorded;
- [ ] risks are updated.

# 62. Definition of Done for Shared Components

A shared component is Done when:

- [ ] API is documented;
- [ ] variants are bounded;
- [ ] states are defined;
- [ ] keyboard behavior is defined;
- [ ] accessibility semantics are implemented;
- [ ] light theme works;
- [ ] dark theme works;
- [ ] loading/error states are defined where applicable;
- [ ] component tests pass;
- [ ] visual regression passes;
- [ ] documentation exists.

# 63. Definition of Done for Screens

A screen is Done when:

- [ ] route works;
- [ ] design is approved;
- [ ] real or approved contract integration works;
- [ ] functional criteria pass;
- [ ] visual criteria pass;
- [ ] accessibility criteria pass;
- [ ] keyboard criteria pass;
- [ ] responsive criteria pass;
- [ ] loading state works;
- [ ] empty state works;
- [ ] error state works;
- [ ] offline state works where applicable;
- [ ] performance is acceptable;
- [ ] security/safety criteria pass where applicable.

# 64. Definition of Done for Milestones

A milestone is Done when:

- [ ] all milestone screens are implemented;
- [ ] all milestone components are accepted;
- [ ] backend dependencies are integrated;
- [ ] tests pass;
- [ ] accessibility review passes;
- [ ] visual review passes;
- [ ] security review passes where applicable;
- [ ] safety review passes where applicable;
- [ ] E2E flows pass;
- [ ] known issues are recorded;
- [ ] risks are updated;
- [ ] acceptance evidence is complete;
- [ ] reviewer approves milestone closure.

# 65. Evidence Package Structure

Each accepted UI task should produce:

    evidence/
        test-results/
        accessibility/
        visual/
        screenshots/
        recordings/
        integration/
        performance/
        security/
        review/

The exact repository location may vary, but evidence must be traceable.

# 66. Evidence Metadata

Each evidence item should identify:

- task ID;
- milestone;
- commit;
- build/version;
- environment;
- OS;
- test name;
- timestamp;
- reviewer where applicable;
- result.

# 67. Screenshot Evidence

Screenshots are useful for:

- visual QA;
- theme validation;
- layout;
- error state;
- empty state;
- responsive behavior.

Screenshots must not be the sole evidence for:

- authentication;
- authorization;
- source privacy;
- financial correctness;
- execution correctness;
- safety.

# 68. Screen Recording Evidence

Recordings are useful for:

- keyboard navigation;
- complete workflows;
- live execution;
- booking;
- rerun;
- accessibility demonstrations.

Recordings should avoid exposing credentials, secrets or sensitive source code.

# 69. Automated Evidence

Preferred automated evidence includes:

- test output;
- CI status;
- accessibility scanner results;
- type checking;
- linting;
- build output;
- E2E report;
- performance report.

# 70. Manual Review Evidence

Manual review shall document:

- reviewer;
- date;
- environment;
- screen;
- criteria checked;
- defects found;
- disposition.

# 71. F-M01 STUDIO FOUNDATION Acceptance

F-M01 passes when:

- [ ] Studio shell is functional.
- [ ] Navigation is functional.
- [ ] Design tokens are implemented.
- [ ] Shared primitives are tested.
- [ ] Theme works.
- [ ] Accessibility foundation works.
- [ ] Error boundary works.
- [ ] Offline/reconnect foundation works.
- [ ] CI passes.
- [ ] Architecture review passes.

# 72. F-M02 PROJECTS Acceptance

F-M02 passes when:

- [ ] Authentication is integrated.
- [ ] Dashboard is integrated.
- [ ] Projects are integrated.
- [ ] Project creation works.
- [ ] Project context works.
- [ ] Platform discovery and selection work.
- [ ] Platform detail and compatibility information are explained.
- [ ] Platform/resource/robot concepts remain distinct.
- [ ] Source privacy indicator works.
- [ ] Local source remains local.
- [ ] Account settings work.
- [ ] Accessibility review passes.
- [ ] E2E login/project/platform selection flow passes.

# 73. F-M03 BUILD & ARTIFACT Acceptance

F-M03 passes when:

- [ ] Local build works.
- [ ] Local test works.
- [ ] Package works.
- [ ] Artifact UI works.
- [ ] Artifact validation works.
- [ ] Upload works.
- [ ] Source privacy evidence passes.
- [ ] Artifact security evidence passes.
- [ ] Build logs perform acceptably.
- [ ] E2E artifact flow passes.

# 74. F-M04 BOOKING Acceptance

F-M04 passes when:

- [ ] Availability works.
- [ ] Booking works.
- [ ] Credit estimate works.
- [ ] Insufficient credit works.
- [ ] Booking conflict works.
- [ ] Cancellation works.
- [ ] Idempotency works.
- [ ] Financial display is clear.
- [ ] Accessibility passes.
- [ ] E2E booking flow passes.

# 75. F-M05 EXECUTION Acceptance

F-M05 passes when:

- [ ] Job lifecycle works.
- [ ] Run lifecycle works.
- [ ] Execution logs work.
- [ ] Software Stop flow works and is distinct from E-stop.
- [ ] Safety authority is clear.
- [ ] No unsafe restart is exposed.
- [ ] E2E execution flow passes against the simulated Lab Agent and simulated robot.
- [ ] No acceptance item requires a physical robot (physical execution is a P6 LAB & ROBOT gate).

# 76. F-M06 LIVE Acceptance

F-M06 passes when:

- [ ] Live Run view works.
- [ ] Video works where configured.
- [ ] Telemetry works.
- [ ] Live logs work.
- [ ] Reconnect works.
- [ ] Simulated versus physical data source is identified.
- [ ] Accessibility passes.

# 77. F-M07 RESULTS Acceptance

F-M07 passes when:

- [ ] Results work.
- [ ] Metrics work.
- [ ] Files work.
- [ ] Downloads work.
- [ ] Rerun works.
- [ ] Settings work.
- [ ] Notifications work.
- [ ] Full primary product path (Build Locally, Book Remotely, Run, Observe, Results) passes.
- [ ] Accessibility qualification passes.
- [ ] Performance qualification passes.
- [ ] Security qualification passes.
- [ ] Production UX review passes.

# 78. Phase 0 Mapping

Phase 0 acceptance focuses on:

- design system;
- shell;
- routing;
- tokens;
- primitives;
- accessibility;
- API client;
- IPC.

Evidence:

- component tests;
- accessibility tests;
- visual review;
- CI;
- architecture review.

# 79. Phase 1 Mapping

Phase 1 acceptance focuses on:

- authentication;
- project workspace;
- dashboard;
- platforms foundation.

Evidence:

- authentication E2E;
- project E2E;
- authorization tests;
- visual QA;
- accessibility QA.

# 80. Phase 2 Mapping

Phase 2 acceptance focuses on:

- local build;
- test;
- artifact;
- compatibility;
- upload.

Evidence:

- build tests;
- artifact tests;
- privacy tests;
- security tests;
- integration E2E.

# 81. Phase 3 Mapping

Phase 3 acceptance focuses on:

- Jobs;
- Runs;
- live execution;
- results foundation.

Evidence:

- lifecycle tests;
- WebSocket tests;
- reconnect tests;
- live execution recording;
- E2E.

# 82. Phase 4 Mapping

Phase 4 acceptance focuses on:

- booking;
- credits;
- availability;
- cancellation.

Evidence:

- booking integration;
- idempotency;
- credit tests;
- conflict tests;
- financial UX review.

# 83. Phase 5 Mapping

Phase 5 acceptance focuses on:

- physical resource status;
- Lab Agent;
- robot state;
- video;
- telemetry;
- safety UX.

Evidence requires:

- simulation;
- HIL where applicable;
- safety review;
- disconnect tests;
- physical-lab qualification evidence.

# 84. Phase 6 Mapping

Phase 6 acceptance focuses on:

- source privacy;
- authentication;
- authorization;
- artifact trust;
- tenant isolation;
- audit-aware UX;
- accessibility qualification.

Evidence requires:

- security tests;
- tenant-isolation tests;
- privacy tests;
- penetration/security review where required.

# 85. Phase 7 Mapping

Phase 7 acceptance focuses on:

- scale;
- performance;
- large result sets;
- telemetry;
- operational dashboards.

Evidence requires:

- load testing;
- performance profiling;
- large dataset testing;
- memory/CPU measurements.

# 86. Phase 8 Mapping

Phase 8 acceptance focuses on:

- production release;
- cross-platform qualification;
- supportability;
- release UX;
- rollback/recovery.

Evidence requires:

- release qualification;
- OS matrix;
- production-like E2E;
- accessibility qualification;
- security sign-off.

# 87. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| UI accepted against mocks only | Real API integration gate |
| Accessibility deferred | Per-screen acceptance |
| Source upload leakage | Network/privacy tests |
| Stale execution state | Durable refresh |
| Duplicate booking | Backend idempotency |
| Incorrect credit display | Server-authoritative values |
| Misleading safety state | Dedicated safety acceptance |
| Large telemetry freezes UI | Sampling and performance tests |
| Dark theme regression | Theme matrix |
| i18n breaks layout | Localization readiness checks |
| Visual drift | Shared components and visual regression |
| Cross-platform defect | OS qualification matrix |

# 88. Open Questions

The following require final decisions where not already resolved:

1. Final accessibility automation toolchain.
2. Final screen-reader test matrix.
3. Final visual regression tool.
4. Final performance thresholds after baseline measurement.
5. Final i18n framework.
6. Final charting library.
7. Final video player technology.
8. Final diagnostic evidence format.
9. Final macOS qualification date.
10. Final support diagnostic bundle format.

Open questions affecting security, safety, financial correctness or source privacy
must be resolved before the affected milestone can be accepted.

# 89. Acceptance Review Checklist

Before a reviewer signs off:

- [ ] Requirement is traceable.
- [ ] Design is approved.
- [ ] Implementation is identified.
- [ ] Tests are identified.
- [ ] API dependency is identified.
- [ ] All required states are demonstrated.
- [ ] Accessibility is checked.
- [ ] Keyboard behavior is checked.
- [ ] Theme behavior is checked.
- [ ] Responsive behavior is checked.
- [ ] Error handling is checked.
- [ ] Performance is checked.
- [ ] Security is checked where applicable.
- [ ] Safety is checked where applicable.
- [ ] i18n readiness is checked.
- [ ] Evidence is attached.
- [ ] Open defects are dispositioned.
- [ ] Risk register is updated.

# 90. Release Blocking Criteria

The following automatically block UI acceptance:

- [ ] S0 safety defect.
- [ ] S0 security defect.
- [ ] source privacy violation.
- [ ] tenant-isolation violation.
- [ ] financial calculation/mutation integrity defect.
- [ ] unsafe execution UX.
- [ ] authentication bypass.
- [ ] authorization bypass.
- [ ] artifact trust bypass.
- [ ] critical accessibility failure in a primary workflow.
- [ ] duplicate booking/job creation caused by UI integration.
- [ ] data corruption caused by UI behavior.

# 91. Conditional Acceptance

Conditional acceptance is permitted only for:

- documented S3/S4 issues;
- non-critical visual inconsistencies;
- known platform-specific minor defects;
- explicitly deferred enhancements.

Conditional acceptance must include:

- issue ID;
- rationale;
- owner;
- target milestone;
- risk assessment.

# 92. UI Review Roles

Typical reviewers:

| Area | Reviewer |
|---|---|
| Visual | UI/Design reviewer |
| React architecture | Frontend reviewer |
| API | Backend/API reviewer |
| Accessibility | Accessibility reviewer |
| Security | Security reviewer |
| Safety | Safety/robotics reviewer |
| Financial | Backend/commercial reviewer |
| Release | Release owner |

One person may perform multiple roles only where appropriate and approved.

# 93. Review Evidence

A milestone review record should include:

    Milestone:
    Commit:
    Build:
    Environment:
    OS:
    API Version:
    Test Result:
    Accessibility Result:
    Visual Result:
    Performance Result:
    Security Result:
    Safety Result:
    Known Issues:
    Risks:
    Reviewer:
    Decision:

# 94. Regression Acceptance

Every change must identify affected existing behavior.

Regression testing shall cover:

- directly modified screen;
- shared components;
- related routes;
- navigation;
- API client behavior;
- accessibility;
- themes.

Changes to shared primitives require broader regression testing.

# 95. Shared Component Regression

If a shared component changes:

- [ ] all consuming features are identified;
- [ ] light/dark behavior is checked;
- [ ] accessibility is checked;
- [ ] keyboard behavior is checked;
- [ ] visual regression is checked;
- [ ] affected screens are reviewed.

# 96. Contract Regression

If an API contract changes:

- [ ] contract version/change is identified;
- [ ] affected screens are identified;
- [ ] error mapping is checked;
- [ ] loading states are checked;
- [ ] authorization behavior is checked;
- [ ] integration tests pass.

# 97. Performance Evidence

Performance evidence should include, where applicable:

- startup measurement;
- route render measurement;
- memory usage;
- CPU usage;
- table rendering measurement;
- log rendering measurement;
- telemetry rendering measurement;
- video initialization measurement.

Baseline and threshold must be documented for repeatability.

# 98. Accessibility Evidence

Accessibility evidence should include:

- automated scan;
- keyboard walkthrough;
- screen-reader smoke test;
- contrast validation;
- focus validation;
- reduced-motion validation.

Critical failures must block acceptance.

# 99. Visual Evidence

Visual evidence should include:

- approved reference;
- implementation screenshot;
- light theme;
- dark theme;
- loading;
- empty;
- error;
- important interaction state.

Visual review should compare hierarchy, spacing, typography, status, and alignment.

# 100. E2E Evidence

The primary E2E evidence must demonstrate:

    Login
      ->
    Create Project
      ->
    Select Platform
      ->
    Build Locally
      ->
    Generate .krv
      ->
    Validate Artifact
      ->
    Book
      ->
    Review Credits
      ->
    Upload
      ->
    Start Job
      ->
    Live Run
      ->
    Video / Telemetry / Logs
      ->
    Complete
      ->
    Results
      ->
    Rerun

The E2E flow is a release-level acceptance criterion, not merely a demo.

# 101. Final UI Acceptance Checklist

## Architecture

- [ ] Tauri shell is production-ready.
- [ ] React architecture is componentized.
- [ ] Rust owns privileged local operations.
- [ ] API client is isolated.
- [ ] Contracts are versioned.
- [ ] Server state is separated from UI state.

## Functional

- [ ] Login works.
- [ ] Dashboard works.
- [ ] Projects work.
- [ ] Source works.
- [ ] Build works.
- [ ] Artifacts work.
- [ ] Platforms work.
- [ ] Booking works.
- [ ] Credits work.
- [ ] Jobs work.
- [ ] Live Run works.
- [ ] Results work.
- [ ] Rerun works.
- [ ] Settings work.

## Visual

- [ ] Design system is applied.
- [ ] Light theme passes.
- [ ] Dark theme passes.
- [ ] Typography passes.
- [ ] Spacing passes.
- [ ] Iconography passes.
- [ ] Status presentation passes.
- [ ] No visual regressions remain.

## Accessibility

- [ ] WCAG-oriented checks pass.
- [ ] Keyboard workflow passes.
- [ ] Screen-reader smoke test passes.
- [ ] Contrast passes.
- [ ] Focus passes.
- [ ] Reduced motion passes.
- [ ] Dynamic announcements pass.

## Performance

- [ ] Startup is acceptable.
- [ ] Navigation is responsive.
- [ ] Tables are performant.
- [ ] Logs are performant.
- [ ] Telemetry is performant.
- [ ] Charts are performant.
- [ ] Video is performant.
- [ ] Memory behavior is acceptable.

## Error Handling

- [ ] Loading states work.
- [ ] Empty states work.
- [ ] Validation errors work.
- [ ] Authorization errors work.
- [ ] Network errors work.
- [ ] Conflict errors work.
- [ ] Server errors work.
- [ ] Offline state works.
- [ ] Reconnect works.

## Security

- [ ] Source privacy passes.
- [ ] Tenant isolation passes.
- [ ] Authorization passes.
- [ ] Artifact trust passes.
- [ ] Secrets are protected.
- [ ] Logs are sanitized.

## Safety

- [ ] Local safety authority is visible.
- [ ] No false emergency-stop claim exists.
- [ ] Unsafe states block execution.
- [ ] Disconnect behavior is safe.
- [ ] No unsafe automatic restart exists.

## i18n

- [ ] Strings are localizable.
- [ ] Dates are locale-aware.
- [ ] Numbers are locale-aware.
- [ ] Timezones are clear.
- [ ] Layout tolerates longer text.

## Evidence

- [ ] Automated tests attached.
- [ ] CI result attached.
- [ ] Accessibility evidence attached.
- [ ] Visual evidence attached.
- [ ] Integration evidence attached.
- [ ] E2E evidence attached.
- [ ] Performance evidence attached where required.
- [ ] Security evidence attached where required.
- [ ] Safety evidence attached where required.
- [ ] Reviewer approval attached.

# 102. Final Definition of UI Done

Kritva RaaS Studio UI is considered complete for a milestone only when the
implemented experience is:

    FUNCTIONALLY CORRECT
             +
    VISUALLY CONSISTENT
             +
    ACCESSIBLE
             +
    KEYBOARD USABLE
             +
    RESPONSIVE
             +
    PERFORMANT
             +
    ERROR RESILIENT
             +
    SECURITY COMPLIANT
             +
    SAFETY CORRECT
             +
    API INTEGRATED
             +
    TESTED
             +
    EVIDENCE BACKED
             =
    ACCEPTED

A screen is not complete because it renders.

A feature is not complete because its happy path works.

A milestone is not complete because all planned screens exist.

Acceptance requires the complete behavior, states, accessibility, integration,
performance, security/safety properties and evidence defined in this document.

# 103. Final Invariants

The following invariants apply to all Studio UI acceptance:

1. Customer source remains local during the normal RaaS workflow.
2. The UI never treats client-side calculations as authoritative financial
   state.
3. The UI never treats stale availability as confirmed availability.
4. A booking is confirmed only by authoritative server state.
5. A Job and Run remain distinct.
6. Video state is independent from execution state.
7. Studio connectivity is independent from robot execution state.
8. Local safety remains authoritative.
9. The UI cannot bypass safety controls.
10. Backend authorization remains authoritative.
11. Tenant isolation is tested server-side and through UI integration.
12. Artifact trust state is authoritative.
13. Duplicate business operations are prevented through idempotent interfaces.
14. Accessibility is part of acceptance, not an optional enhancement.
15. Loading, empty and error states are first-class requirements.
16. Light and dark themes are both production states.
17. Keyboard operation is required for primary workflows.
18. Localization readiness is required even when English is the initial
    production language.
19. Large operational data sets must remain usable.
20. Every accepted milestone has reproducible evidence.
21. Every release-blocking defect is explicitly resolved or formally waived.
22. Shared components receive regression testing.
23. API contract changes receive integration review.
24. Security-sensitive UI changes receive security review.
25. Safety-sensitive UI changes receive safety review.
26. Financial/resource UI changes receive correctness review.
27. Screen completion requires more than visual implementation.
28. Frontend acceptance does not replace system-level acceptance.
29. UI milestones must remain aligned with F-M01 through F-M07.
30. Phase completion requires broader system evidence than UI acceptance alone.

# 104. Final Acceptance Principle

> Kritva RaaS Studio UI shall be accepted only when it provides an evidence-
> backed, production-grade user experience across functionality, visual
> consistency, accessibility, keyboard interaction, responsiveness,
> performance, error handling, localization readiness, security, safety and
> backend integration. Every screen must work beyond the happy path, every
> major state must be understandable, and every critical workflow must be
> reproducible through automated and manual evidence. The acceptance process
> shall preserve the fundamental RaaS architecture: source remains local,
> artifacts cross the security boundary, the Control Plane remains
> authoritative for remote state and financial/resource operations, Job and
> Run remain distinct, and physical safety remains local to the robot and
> laboratory. The final standard is not merely that the UI looks correct, but
> that it behaves correctly, communicates state clearly, remains accessible
> under real operating conditions, performs under realistic workloads, fails
> safely, integrates with authoritative backend contracts, and provides
> sufficient evidence for a reviewer to confidently declare the milestone or
> release production-ready.
