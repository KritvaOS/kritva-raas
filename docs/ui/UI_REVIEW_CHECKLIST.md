# Kritva RaaS Studio UI Review Checklist

## 1. Purpose

This document defines the production-grade review process for Kritva RaaS Studio
UI work.

It provides a repeatable checklist for:

- design review;
- implementation review;
- usability review;
- accessibility audit;
- visual QA;
- cross-platform validation;
- interaction review;
- API integration review;
- security and source-privacy review;
- safety-sensitive UI review;
- performance review;
- release review;
- milestone sign-off.

The review process ensures that UI work is evaluated as a complete product
experience rather than merely as rendered React components.

The governing product principle is:

> Build locally. Book remotely. Run on real robots.

## 2. Scope

This checklist applies to:

- UI Foundation;
- F-M01 through F-M07;
- Studio screens;
- shared components;
- feature components;
- navigation;
- forms;
- tables;
- dialogs;
- dashboards;
- build workflows;
- artifact workflows;
- booking;
- credits;
- jobs;
- live execution;
- telemetry;
- logs;
- video;
- results;
- settings;
- administrative UI exposed through Studio.

It also applies to design-system changes that affect multiple screens.

## 3. Goals

The review process shall:

1. detect design defects before implementation;
2. detect implementation drift from approved design;
3. verify usability;
4. verify accessibility;
5. verify light/dark themes;
6. verify keyboard workflows;
7. verify error and recovery states;
8. verify cross-platform behavior;
9. verify performance;
10. verify API integration;
11. verify security and source privacy;
12. verify safety-sensitive UI behavior;
13. create objective sign-off evidence;
14. prevent incomplete UI work from being marked accepted.

## 4. Non-Goals

This document does not replace:

- backend code review;
- database review;
- cloud infrastructure review;
- security architecture review;
- physical robot safety review;
- product requirements;
- UI acceptance criteria.

Those reviews remain mandatory where applicable.

## 5. Review Philosophy

The review sequence is:

    Requirement
        |
        v
    Design Review
        |
        v
    Implementation
        |
        v
    Implementation Review
        |
        v
    Functional Review
        |
        v
    Accessibility Audit
        |
        v
    Visual QA
        |
        v
    Cross-Platform QA
        |
        v
    E2E Review
        |
        v
    Sign-off

No single review stage is sufficient for production acceptance.

## 6. Review Levels

| Level | Purpose |
|---|---|
| R0 | Developer self-review |
| R1 | Design review |
| R2 | Implementation review |
| R3 | Accessibility/usability review |
| R4 | Integration review |
| R5 | Release review |

Critical workflows may require specialist review.

## 7. Review Roles

| Role | Responsibility |
|---|---|
| UI Developer | Implementation correctness |
| UI Reviewer | React/component quality |
| Designer | Visual/design correctness |
| Accessibility Reviewer | WCAG/accessibility |
| Backend Reviewer | API/contract integration |
| Security Reviewer | Security/privacy |
| Safety Reviewer | Robot/execution safety |
| QA Reviewer | Functional/E2E validation |
| Release Owner | Release qualification |

One person may perform multiple roles only when the risk profile permits.

## 8. Review Independence

For S0/S1 security or safety-sensitive changes, implementation and approval should
be separated where practical.

A developer must not self-approve a critical safety behavior without an
independent review.

## 9. Definition of Review Ready

A UI change is Review Ready when:

- [ ] task exists;
- [ ] acceptance criteria exist;
- [ ] design is available;
- [ ] implementation is complete enough to review;
- [ ] tests pass locally;
- [ ] API contracts are identified;
- [ ] known limitations are documented;
- [ ] affected screens are identified;
- [ ] screenshots or equivalent evidence are available.

## 10. Definition of Review Complete

A review is complete when:

- [ ] all applicable checklists are completed;
- [ ] defects are classified;
- [ ] blockers are resolved or formally dispositioned;
- [ ] evidence is attached;
- [ ] required specialist reviews are complete;
- [ ] reviewer decision is recorded.

## 11. Review Classification

| Result | Meaning |
|---|---|
| APPROVED | Meets criteria |
| APPROVED_WITH_ACTIONS | Non-blocking tracked actions |
| CHANGES_REQUIRED | Rework required |
| BLOCKED | Dependency prevents review |
| REJECTED | Fundamental approach unacceptable |

## 12. Defect Severity

| Severity | Review Effect |
|---|---|
| S0 | Immediate blocker |
| S1 | Acceptance blocker |
| S2 | Normally blocks milestone |
| S3 | Track and fix |
| S4 | Cosmetic/backlog |

S0/S1 issues must not be silently waived.

# 13. Design Review

## 13.1 Purpose

Design review confirms that the proposed UI solves the intended user problem
before implementation becomes expensive.

## 13.2 Design Inputs

Reviewer checks:

- [ ] Product requirement exists.
- [ ] User workflow is understood.
- [ ] Target persona/user role is known.
- [ ] Entry point is defined.
- [ ] Exit condition is defined.
- [ ] Success state is defined.
- [ ] Failure states are defined.
- [ ] Permission constraints are defined.
- [ ] Safety constraints are defined where applicable.

## 13.3 Information Architecture

- [ ] Screen belongs in the correct navigation hierarchy.
- [ ] Page title is clear.
- [ ] Primary action is identifiable.
- [ ] Secondary actions are subordinate.
- [ ] Related information is grouped.
- [ ] Navigation depth is reasonable.
- [ ] Breadcrumb requirement is considered.
- [ ] Project context is preserved.

## 13.4 Task Flow Review

Review:

    User Goal
       |
       v
    Entry
       |
       v
    Information
       |
       v
    Decision
       |
       v
    Action
       |
       v
    Confirmation
       |
       v
    Result / Recovery

Reviewer checks:

- [ ] No unnecessary step exists.
- [ ] Required information appears before decisions.
- [ ] Consequences are clear before irreversible actions.
- [ ] Recovery path exists.
- [ ] User does not need to remember hidden state.

## 13.5 Design System Compliance

- [ ] Approved tokens are used.
- [ ] Typography follows design system.
- [ ] Spacing follows design system.
- [ ] Grid follows design system.
- [ ] Buttons use approved variants.
- [ ] Forms use approved patterns.
- [ ] Status badges use approved semantics.
- [ ] Dialogs use approved patterns.
- [ ] Tables use approved patterns.
- [ ] Icons use approved library/style.

## 13.6 State Design Review

Every applicable screen must define:

    Loading
       |
       +--> Ready
       |
       +--> Empty
       |
       +--> Error
       |
       +--> Offline
       |
       +--> Reconnecting

Reviewer checks:

- [ ] Loading state exists.
- [ ] Empty state exists.
- [ ] Error state exists.
- [ ] Permission state exists.
- [ ] Offline state exists where relevant.
- [ ] Reconnecting state exists for live features.
- [ ] Disabled state is explained where needed.

## 13.7 Design Error Prevention

- [ ] Dangerous actions are visually distinct.
- [ ] Destructive actions require appropriate confirmation.
- [ ] Financial consequences are visible.
- [ ] Booking conflicts are considered.
- [ ] Compatibility failures are understandable.
- [ ] Safety constraints are explicit.
- [ ] Source privacy is visible where relevant.

# 14. Implementation Review

## 14.1 Architecture

- [ ] Component ownership is clear.
- [ ] Shared components remain reusable.
- [ ] Feature components remain feature-specific.
- [ ] Business logic is not embedded in primitives.
- [ ] API calls are not scattered through presentational components.
- [ ] Server state is distinct from UI state.
- [ ] Local state is appropriately scoped.

## 14.2 React Quality

- [ ] Components are appropriately sized.
- [ ] Props are typed.
- [ ] Variants are explicit.
- [ ] Hooks have clear responsibility.
- [ ] Effects are justified.
- [ ] Memoization is used only where useful.
- [ ] Lists have stable keys.
- [ ] No unnecessary global state exists.
- [ ] No obvious render loops exist.

## 14.3 Component Reuse

Reviewer checks for unnecessary duplication.

Example:

    Existing Button
        |
        +--> Use existing component

    New Button requirement
        |
        +--> Extend component only if reusable
        |
        +--> Otherwise use feature styling

Creating duplicate controls requires justification.

## 14.4 Token Usage

- [ ] No unexplained hardcoded colors.
- [ ] No arbitrary spacing where tokens apply.
- [ ] Typography tokens are used.
- [ ] Radius tokens are used.
- [ ] Semantic status tokens are used.
- [ ] Dark theme tokens resolve correctly.

## 14.5 API Integration

- [ ] Typed API client is used.
- [ ] Request state is handled.
- [ ] Response state is handled.
- [ ] Error mapping is handled.
- [ ] Authorization failures are handled.
- [ ] Pagination is handled.
- [ ] Retry behavior is intentional.
- [ ] Idempotency is used where required.
- [ ] Stale data is not presented as authoritative.

# 15. Usability Heuristics

## 15.1 Visibility of System Status

Reviewer asks:

- Can the user tell what the system is doing?
- Is a build running?
- Is booking pending?
- Is a Job running?
- Is video connected?
- Is telemetry live?
- Is the Studio offline?

Acceptance:

- [ ] Current state is visible.
- [ ] Long operations provide progress or pending indication.
- [ ] Live connection state is visible.

## 15.2 Match With the Real World

Terminology must match domain terminology:

- Project;
- Platform;
- Resource;
- Robot;
- Artifact;
- Booking;
- Credit;
- Job;
- Run;
- Result.

Reviewer checks:

- [ ] UI terminology matches product/domain model.
- [ ] Job is not mislabeled as Run.
- [ ] Robot is not incorrectly equated with Resource.
- [ ] Credits are not represented as generic currency.

## 15.3 User Control and Freedom

- [ ] Cancel is available for cancellable operations.
- [ ] Navigation does not unintentionally cancel execution.
- [ ] Dialogs can be dismissed where safe.
- [ ] Users can recover from mistakes.
- [ ] Destructive actions require appropriate confirmation.

## 15.4 Consistency

- [ ] Same operation uses same terminology.
- [ ] Same state uses same visual treatment.
- [ ] Same action uses same icon.
- [ ] Same error structure is reused.
- [ ] Same navigation model is reused.

## 15.5 Error Prevention

- [ ] Invalid input is prevented where practical.
- [ ] Server constraints are reflected in UI.
- [ ] Credit insufficiency is detected before confirmation.
- [ ] Booking conflicts are handled.
- [ ] Incompatible artifacts cannot be submitted.
- [ ] Unsafe execution cannot be initiated.

## 15.6 Recognition Over Recall

- [ ] Required information is visible.
- [ ] Platform context is visible.
- [ ] Credit cost is visible before confirmation.
- [ ] Artifact identity is visible before execution.
- [ ] Job/Run identity is visible during execution.

## 15.7 Flexibility

- [ ] Search exists for large lists.
- [ ] Filters exist where useful.
- [ ] Keyboard shortcuts do not conflict with OS behavior.
- [ ] Power users can operate efficiently.
- [ ] Novice users receive sufficient context.

## 15.8 Minimalist Design

Reviewer checks:

- [ ] No decorative content competes with operational state.
- [ ] Secondary metadata is visually subordinate.
- [ ] Cards are not overused.
- [ ] Empty space is intentional.
- [ ] Primary actions remain dominant.

## 15.9 Error Recovery

Errors should communicate:

    What happened
        +
    Why
        +
    What to do next

Reviewer checks:

- [ ] Error is understandable.
- [ ] Recovery action exists where possible.
- [ ] Technical diagnostic information is available without overwhelming users.

## 15.10 Help and Documentation

- [ ] Complex controls provide supporting information.
- [ ] Tooltips are used for unfamiliar icons.
- [ ] Critical workflows do not depend on tooltips alone.
- [ ] Help links do not interrupt primary tasks.

# 16. Accessibility Audit

## 16.1 Automated Accessibility

Run an approved automated accessibility scanner.

Check:

- [ ] missing labels;
- [ ] invalid ARIA;
- [ ] contrast;
- [ ] heading hierarchy;
- [ ] duplicate IDs;
- [ ] landmark structure;
- [ ] keyboard issues where detectable.

Automated tools do not replace manual review.

## 16.2 Keyboard Audit

Perform a complete keyboard-only pass.

Checklist:

- [ ] Start from application entry.
- [ ] Tab through navigation.
- [ ] Enter project.
- [ ] Open feature.
- [ ] Operate forms.
- [ ] Open dialogs.
- [ ] Close dialogs.
- [ ] Operate tables.
- [ ] Operate filters.
- [ ] Start actions.
- [ ] Recover errors.
- [ ] Navigate to results.
- [ ] Return to previous context.

No unexpected keyboard trap may remain.

## 16.3 Focus Audit

- [ ] Focus is always visible.
- [ ] Focus order is logical.
- [ ] Modal focus is trapped.
- [ ] Focus returns to trigger.
- [ ] Dynamic content does not unexpectedly steal focus.
- [ ] Route navigation establishes useful focus.

## 16.4 Screen Reader Audit

At minimum review:

- page title;
- headings;
- navigation;
- form labels;
- validation errors;
- buttons;
- status badges;
- dialogs;
- tables;
- live status.

Check that a user can understand the primary workflow without seeing the screen.

## 16.5 Color Audit

- [ ] Status is not color-only.
- [ ] Error has text/icon.
- [ ] Warning has text/icon.
- [ ] Success has text/icon.
- [ ] Chart series have non-color distinctions where necessary.
- [ ] Focus remains visible.

## 16.6 Motion Audit

- [ ] Reduced-motion preference is respected.
- [ ] No essential information depends on animation.
- [ ] No continuous decorative animation distracts.
- [ ] Telemetry does not create excessive motion.

# 17. Visual QA

## 17.1 Reference Comparison

Compare implementation against approved design.

Review:

- [ ] overall layout;
- [ ] alignment;
- [ ] spacing;
- [ ] typography;
- [ ] icon size;
- [ ] colors;
- [ ] border;
- [ ] radius;
- [ ] shadows;
- [ ] status;
- [ ] action placement.

## 17.2 Pixel-Level Review

Pixel-perfect matching is not required where OS rendering differs.

However, reviewers shall investigate:

- unexpected offsets;
- inconsistent spacing;
- incorrect typography hierarchy;
- clipping;
- overlapping elements;
- incorrect component dimensions.

## 17.3 Light Theme

- [ ] Background hierarchy correct.
- [ ] Text contrast correct.
- [ ] Borders visible.
- [ ] Status colors correct.
- [ ] Disabled state distinguishable.
- [ ] Charts readable.
- [ ] Logs readable.

## 17.4 Dark Theme

- [ ] Background hierarchy correct.
- [ ] Text contrast correct.
- [ ] Borders visible.
- [ ] Status colors correct.
- [ ] Disabled state distinguishable.
- [ ] Charts readable.
- [ ] Logs readable.
- [ ] Video controls readable.

## 17.5 State Visual QA

Review:

- [ ] default;
- [ ] hover;
- [ ] focus;
- [ ] active;
- [ ] disabled;
- [ ] loading;
- [ ] success;
- [ ] warning;
- [ ] error;
- [ ] empty.

# 18. Cross-Platform Review

## 18.1 Linux

Check:

- [ ] window behavior;
- [ ] font rendering;
- [ ] keyboard behavior;
- [ ] dialogs;
- [ ] filesystem integration;
- [ ] video;
- [ ] notifications;
- [ ] theme.

## 18.2 Windows

Check:

- [ ] window behavior;
- [ ] font rendering;
- [ ] keyboard behavior;
- [ ] dialogs;
- [ ] filesystem integration;
- [ ] video;
- [ ] notifications;
- [ ] theme.

## 18.3 macOS

When P1 is enabled:

- [ ] Apple Silicon performance;
- [ ] native window behavior;
- [ ] keyboard conventions;
- [ ] dialogs;
- [ ] filesystem permissions;
- [ ] video;
- [ ] notifications;
- [ ] theme.

## 18.4 Display Scaling

Review common scaling configurations.

Check:

- [ ] no clipping;
- [ ] no overlap;
- [ ] text remains readable;
- [ ] buttons remain usable;
- [ ] tables remain usable;
- [ ] dialogs remain inside window.

# 19. Screen Review Checklist — Login

- [ ] Correct branding.
- [ ] Correct authentication options.
- [ ] Clear labels.
- [ ] Password handling is secure.
- [ ] MFA/passkey state is clear.
- [ ] Invalid login is understandable.
- [ ] Network failure is recoverable.
- [ ] Focus is correct.
- [ ] Screen-reader flow works.
- [ ] Light/dark theme works.
- [ ] Cross-platform rendering works.

# 20. Screen Review Checklist — Dashboard

- [ ] Correct summary data.
- [ ] Correct project context.
- [ ] Active jobs are understandable.
- [ ] Bookings are understandable.
- [ ] Credit summary is correct.
- [ ] Results summary is correct.
- [ ] Empty widgets are useful.
- [ ] Loading skeletons are consistent.
- [ ] Errors are local where possible.
- [ ] Cards do not become visually noisy.

# 21. Screen Review Checklist — Projects

- [ ] Project table is readable.
- [ ] Search works.
- [ ] Filters work.
- [ ] Create action is obvious.
- [ ] Project status is explicit.
- [ ] Row actions are consistent.
- [ ] Empty state is useful.
- [ ] Pagination is usable.
- [ ] Keyboard operation works.
- [ ] Authorization behavior is correct.

# 22. Screen Review Checklist — Source

- [ ] Local source boundary is obvious.
- [ ] No source upload occurs.
- [ ] Filesystem state is clear.
- [ ] Build entry point is obvious.
- [ ] Permission errors are understandable.
- [ ] Source contents are not leaked to analytics/logging.
- [ ] Keyboard access works.

# 23. Screen Review Checklist — Build

- [ ] Configuration is clear.
- [ ] Build/test/package stages are visible.
- [ ] Progress is meaningful.
- [ ] Logs are readable.
- [ ] Failure recovery is clear.
- [ ] Local-only status is visible.
- [ ] Cancellation behavior is clear.
- [ ] Build completion is announced.
- [ ] Artifact transition is obvious.

# 24. Screen Review Checklist — Artifacts

- [ ] Artifact identity is clear.
- [ ] Platform is clear.
- [ ] Architecture is clear.
- [ ] Runtime/SDK is clear.
- [ ] Signature is clear.
- [ ] Integrity is clear.
- [ ] Scan status is clear.
- [ ] Compatibility is clear.
- [ ] Revocation is clear.
- [ ] Upload state is clear.

# 25. Screen Review Checklist — Platforms

- [ ] Platform identity is clear.
- [ ] Version is visible.
- [ ] Architecture is visible.
- [ ] Capabilities are visible.
- [ ] Configuration is understandable.
- [ ] Availability is clear.
- [ ] Robot/resource distinction is preserved.
- [ ] Platform-specific credit context is discoverable.

# 26. Screen Review Checklist — Booking

- [ ] Platform selection is clear.
- [ ] Configuration selection is clear.
- [ ] Date/time is clear.
- [ ] Timezone is clear.
- [ ] Duration is clear.
- [ ] Availability is clear.
- [ ] Credit rate is clear.
- [ ] Required credits are clear.
- [ ] Remaining balance is clear.
- [ ] Confirmation is explicit.
- [ ] Conflict recovery works.
- [ ] Cancellation behavior is clear.

# 27. Screen Review Checklist — Credits

- [ ] Platform-specific wallet is clear.
- [ ] Balance is authoritative.
- [ ] Reserved amount is clear.
- [ ] Available amount is clear.
- [ ] Rate is clear.
- [ ] Ledger entries are understandable.
- [ ] No global balance ambiguity exists.
- [ ] Financial terminology is consistent.

# 28. Screen Review Checklist — Jobs

- [ ] Job status is clear.
- [ ] Job ID is clear.
- [ ] Project is clear.
- [ ] Artifact is clear.
- [ ] Platform is clear.
- [ ] Booking is clear.
- [ ] Run relationship is clear.
- [ ] Failure is actionable.
- [ ] State timeline is understandable.

# 29. Screen Review Checklist — Live Run

- [ ] Run identity is clear.
- [ ] Job identity is clear.
- [ ] Video is clear.
- [ ] Telemetry is clear.
- [ ] Logs are clear.
- [ ] Connection status is clear.
- [ ] Safety authority is clear.
- [ ] Stop behavior is clear.
- [ ] Reconnect behavior is clear.
- [ ] Completion state is clear.

# 30. Screen Review Checklist — Results

- [ ] Result identity is clear.
- [ ] Run relationship is clear.
- [ ] Metrics are readable.
- [ ] Files are readable.
- [ ] Download controls are clear.
- [ ] Processing state is clear.
- [ ] Failed result state is clear.
- [ ] Rerun is clearly differentiated from original Run.
- [ ] Credit implications are visible before rerun.

# 31. Screen Review Checklist — Settings

- [ ] Sections are understandable.
- [ ] Save behavior is clear.
- [ ] Unsaved changes are handled.
- [ ] Security settings are protected.
- [ ] Sensitive information is not exposed.
- [ ] Account context is correct.
- [ ] Studio version is visible.
- [ ] Reset actions are appropriately protected.

# 32. Live Operational Review

For live Run screens, perform:

    Start
      |
      v
    Connecting
      |
      v
    Running
      |
      +--> Video Lost
      |
      +--> Telemetry Lost
      |
      +--> Logs Lost
      |
      v
    Reconnect
      |
      v
    Running / Offline
      |
      v
    Complete

Reviewer verifies each transition.

# 33. Log Viewer Review

- [ ] Large logs remain responsive.
- [ ] Search is responsive.
- [ ] Follow mode works.
- [ ] Pause works.
- [ ] Severity is clear.
- [ ] Timestamp is clear.
- [ ] Component is clear.
- [ ] Download is authorized.
- [ ] Sensitive values are redacted.
- [ ] Screen reader behavior is usable.

# 34. Telemetry Review

- [ ] Current value is clear.
- [ ] Unit is clear.
- [ ] Timestamp is clear.
- [ ] Status is clear.
- [ ] Trend is meaningful.
- [ ] Sampling is appropriate.
- [ ] Chart scale is understandable.
- [ ] Tooltip is accessible.
- [ ] High-frequency stream does not freeze UI.

# 35. Video Review

- [ ] Correct stream selected.
- [ ] Connecting state works.
- [ ] Live state works.
- [ ] Buffering state works.
- [ ] Disconnected state works.
- [ ] Full screen works.
- [ ] Keyboard controls work.
- [ ] Accessible controls exist.
- [ ] Video loss does not falsely report Job failure.

# 36. Security Review Checklist

- [ ] Authentication state is correct.
- [ ] Authorization state is correct.
- [ ] Tenant boundary is respected.
- [ ] Sensitive fields are hidden.
- [ ] Secrets are not rendered.
- [ ] Source code is not uploaded unexpectedly.
- [ ] Artifact trust state is authoritative.
- [ ] Audit-sensitive actions are represented accurately.
- [ ] Security errors do not expose internals.

# 37. Source Privacy Review

Perform an explicit source privacy review for local build flows.

Verify:

- [ ] filesystem source is local;
- [ ] local build executes locally;
- [ ] source upload endpoint is not called;
- [ ] `.krv` package contains only allowed content;
- [ ] logs do not contain source unexpectedly;
- [ ] analytics do not capture source;
- [ ] network inspection supports the expected boundary.

# 38. Safety Review

For execution UI:

- [ ] local safety authority is explicit;
- [ ] safety state is visible;
- [ ] safety-blocked operation is blocked;
- [ ] disconnect state is not misrepresented;
- [ ] no automatic unsafe restart is exposed;
- [ ] emergency-stop semantics are not falsely represented;
- [ ] human safety review is completed where required.

# 39. Financial Review

For booking/credits:

- [ ] platform credit type is correct;
- [ ] rate is correct;
- [ ] required credits are correct;
- [ ] balance is correct;
- [ ] reservation state is correct;
- [ ] cancellation result is correct;
- [ ] duplicate action is prevented;
- [ ] server remains authoritative.

# 40. API Error Review

Test:

- [ ] 400/validation failure;
- [ ] 401/session expiry;
- [ ] 403/authorization;
- [ ] 404/not found;
- [ ] 409/conflict;
- [ ] 422/business validation where applicable;
- [ ] 429/rate limiting where applicable;
- [ ] 5xx/server failure;
- [ ] network timeout;
- [ ] connection loss.

Every error must produce an appropriate UI state.

# 41. Offline Review

Where applicable:

- [ ] offline state is visible;
- [ ] stale data is identified appropriately;
- [ ] prohibited actions are disabled;
- [ ] reconnect is attempted according to policy;
- [ ] user is not falsely told that a remote action succeeded.

# 42. Reconnect Review

For live channels:

- [ ] reconnect starts when appropriate;
- [ ] reconnect status is visible;
- [ ] subscriptions are restored;
- [ ] missed state is recovered from authoritative state;
- [ ] duplicate events do not duplicate UI state;
- [ ] permanent failure is communicated.

# 43. Usability Review Session

A usability review should test realistic workflows:

1. Login.
2. Create project.
3. Select platform.
4. Build locally.
5. Review artifact.
6. Book resource.
7. Upload artifact.
8. Start Job.
9. Observe Run.
10. Review results.
11. Rerun.

Reviewer should record:

- confusion points;
- unnecessary steps;
- terminology issues;
- navigation issues;
- error recovery problems;
- information gaps.

# 44. First-Time User Review

Check whether a technically competent new user can determine:

- what to do first;
- where projects are;
- where to build;
- what `.krv` means;
- how to select a platform;
- how credits work;
- how to book;
- how to start a Run;
- where results appear.

# 45. Expert User Review

Check:

- efficient navigation;
- keyboard workflow;
- dense tables;
- filtering;
- search;
- fast access to Jobs;
- fast access to logs;
- fast access to results;
- clear identifiers.

# 46. Information Hierarchy Review

For every screen:

    Primary
       |
       +-- User goal
       |
       +-- Current state
       |
       +-- Primary action
       |
       v
    Secondary
       |
       +-- Metadata
       +-- Supporting actions
       |
       v
    Tertiary
       |
       +-- Diagnostics
       +-- Advanced detail

Reviewer verifies that tertiary information does not overpower primary action.

# 47. Responsive Review Procedure

For each target OS:

1. Launch Studio.
2. Set normal window.
3. Resize smaller.
4. Resize larger.
5. Maximize.
6. Restore.
7. Check navigation.
8. Check tables.
9. Check dialogs.
10. Check live execution.
11. Check forms.
12. Check long text.

Record any clipping or overlap.

# 48. Theme Review Procedure

For each screen:

1. Open light mode.
2. Record visual state.
3. Switch dark mode.
4. Verify semantic consistency.
5. Verify contrast.
6. Verify status.
7. Verify focus.
8. Verify charts.
9. Verify logs.
10. Verify video controls.

No business state should change when switching theme.

# 49. Accessibility Review Procedure

Perform:

    Automated Scan
          |
          v
    Keyboard Audit
          |
          v
    Screen Reader Audit
          |
          v
    Contrast Audit
          |
          v
    Reduced Motion Audit
          |
          v
    Manual Sign-off

Any critical accessibility failure blocks acceptance.

# 50. Visual Review Procedure

For each screen:

- [ ] compare against approved design;
- [ ] inspect global layout;
- [ ] inspect header;
- [ ] inspect navigation;
- [ ] inspect content grid;
- [ ] inspect controls;
- [ ] inspect status;
- [ ] inspect spacing;
- [ ] inspect typography;
- [ ] inspect empty state;
- [ ] inspect error state;
- [ ] inspect dark mode.

# 51. Cross-Platform Evidence Matrix

| Screen/Feature | Linux | Windows | macOS P1 | Evidence |
|---|---|---|---|---|
| Login | Required | Required | P1 | Screenshot/test |
| Dashboard | Required | Required | P1 | Screenshot/test |
| Projects | Required | Required | P1 | E2E |
| Build | Required | Required | P1 | E2E |
| Artifacts | Required | Required | P1 | E2E |
| Booking | Required | Required | P1 | E2E |
| Credits | Required | Required | P1 | E2E |
| Jobs | Required | Required | P1 | E2E |
| Live Run | Required | Required | P1 | Recording |
| Results | Required | Required | P1 | E2E |

# 52. Review Evidence Matrix

| Review | Evidence |
|---|---|
| Design | Approved design/reference |
| Implementation | Code review |
| Functional | Test report |
| Accessibility | Audit |
| Visual | Screenshots/regression |
| Performance | Measurement |
| Security | Security test |
| Safety | Safety review |
| Cross-platform | OS matrix |
| E2E | Workflow result |
| Release | Sign-off record |

# 53. F-M01 Review Gate

F-M01 review requires:

- [ ] design tokens reviewed;
- [ ] shell reviewed;
- [ ] navigation reviewed;
- [ ] shared primitives reviewed;
- [ ] theme reviewed;
- [ ] accessibility foundation reviewed;
- [ ] CI passes;
- [ ] component tests pass.

Decision:

    F-M01
       |
       +--> ACCEPT
       |
       +--> CHANGES_REQUIRED
       |
       +--> BLOCKED

# 54. F-M02 Review Gate

Review:

- [ ] Login.
- [ ] Dashboard.
- [ ] Projects.
- [ ] Source.
- [ ] Settings foundation.
- [ ] Authentication integration.
- [ ] Authorization.
- [ ] Source privacy.

Evidence must include the login-to-project workflow.

# 55. F-M03 Review Gate

Review:

- [ ] Platforms.
- [ ] Platform detail.
- [ ] Configuration.
- [ ] Compatibility.
- [ ] Availability.
- [ ] Platform-specific context.

Backend platform contracts must be available.

# 56. F-M04 Review Gate

Review:

- [ ] Build.
- [ ] Build logs.
- [ ] Artifact.
- [ ] Security state.
- [ ] Compatibility state.
- [ ] Upload.
- [ ] Source privacy.

Local build and artifact security evidence is mandatory.

# 57. F-M05 Review Gate

Review:

- [ ] Availability.
- [ ] Booking.
- [ ] Credits.
- [ ] Booking detail.
- [ ] Cancellation.
- [ ] Conflict handling.

Financial correctness and booking idempotency evidence is mandatory.

# 58. F-M06 Review Gate

Review:

- [ ] Jobs.
- [ ] Live Run.
- [ ] Video.
- [ ] Logs.
- [ ] Telemetry.
- [ ] Reconnect.
- [ ] Stop.
- [ ] Safety status.

Simulation evidence is required before physical deployment.

# 59. F-M07 Review Gate

Review:

- [ ] Results.
- [ ] Rerun.
- [ ] Settings.
- [ ] Notifications.
- [ ] production UX.
- [ ] accessibility qualification.
- [ ] performance qualification.
- [ ] cross-platform qualification.

# 60. Phase 0 Review

Phase 0 review checks:

- [ ] UI architecture.
- [ ] design system.
- [ ] tokens.
- [ ] component structure.
- [ ] accessibility foundation.
- [ ] theme.
- [ ] routing.
- [ ] Tauri IPC boundary.

Phase 0 cannot be accepted solely on screen screenshots.

# 61. Phase 1 Review

Phase 1 checks:

- [ ] identity;
- [ ] projects;
- [ ] dashboard;
- [ ] initial platform discovery;
- [ ] API integration;
- [ ] authorization;
- [ ] source privacy.

# 62. Phase 2 Review

Phase 2 checks:

- [ ] build;
- [ ] artifacts;
- [ ] compatibility;
- [ ] local source boundary;
- [ ] upload;
- [ ] artifact security.

# 63. Phase 3 Review

Phase 3 checks:

- [ ] Job;
- [ ] Run;
- [ ] live execution;
- [ ] WebSocket;
- [ ] reconnect;
- [ ] video;
- [ ] telemetry;
- [ ] logs.

# 64. Phase 4 Review

Phase 4 checks:

- [ ] booking;
- [ ] availability;
- [ ] credits;
- [ ] reservation;
- [ ] cancellation;
- [ ] financial correctness.

# 65. Phase 5 Review

Phase 5 checks:

- [ ] Lab Agent integration;
- [ ] robot state;
- [ ] resource state;
- [ ] physical/simulation distinction;
- [ ] safety UX;
- [ ] HIL evidence.

# 66. Phase 6 Review

Phase 6 checks:

- [ ] authentication;
- [ ] authorization;
- [ ] tenant isolation;
- [ ] source privacy;
- [ ] artifact security;
- [ ] secrets;
- [ ] audit behavior;
- [ ] accessibility.

# 67. Phase 7 Review

Phase 7 checks:

- [ ] scalability;
- [ ] large data;
- [ ] telemetry performance;
- [ ] result performance;
- [ ] operational usability;
- [ ] supportability.

# 68. Phase 8 Review

Phase 8 checks:

- [ ] release UX;
- [ ] production build;
- [ ] cross-platform qualification;
- [ ] accessibility qualification;
- [ ] security qualification;
- [ ] safety qualification;
- [ ] support readiness;
- [ ] rollback/recovery UX.

# 69. Review Risks

| Risk | Mitigation |
|---|---|
| Design approved without edge states | State review checklist |
| Developer self-approval | Independent review for critical work |
| Accessibility deferred | Dedicated audit gate |
| Visual drift | Reference comparison |
| Mock-only integration | Real API gate |
| Source privacy overlooked | Explicit privacy review |
| Safety ambiguity | Safety specialist review |
| Financial UI error | Financial review |
| OS-specific defect | Cross-platform matrix |
| Performance regression | Measurement baseline |
| Inconsistent components | Shared component review |

# 70. Open Questions

The following remain implementation decisions unless already fixed:

1. Final automated accessibility tool.
2. Final screen-reader test matrix.
3. Final visual regression tool.
4. Final design review platform.
5. Final charting library.
6. Final video implementation.
7. Final performance thresholds.
8. Final i18n framework.
9. Final design evidence storage convention.
10. Final formal UI approval workflow.

No open question may weaken an already established security, safety, privacy,
financial or accessibility requirement.

# 71. Design Review Template

Use the following structure:

    UI DESIGN REVIEW

    Task:
    Milestone:
    Screen/Component:
    Designer:
    Reviewer:
    Date:

    User Goal:
    Primary Action:
    Secondary Actions:
    Entry Point:
    Exit State:

    Loading:
    Empty:
    Error:
    Offline:
    Permission:
    Safety:

    Design System:
    Accessibility:
    i18n:
    Security:
    Safety:

    Decision:
    Open Issues:
    Evidence:

# 72. Implementation Review Template

    UI IMPLEMENTATION REVIEW

    Task:
    Milestone:
    PR/Commit:
    Developer:
    Reviewer:
    Date:

    Architecture:
    Components:
    State:
    API:
    IPC:
    Error Handling:
    Accessibility:
    Theme:
    Performance:
    Security:
    Safety:

    Tests:
    Visual Evidence:
    Accessibility Evidence:

    Decision:
    Follow-up Issues:

# 73. Accessibility Review Template

    ACCESSIBILITY REVIEW

    Screen:
    Milestone:
    Reviewer:
    Date:

    Automated Scan:
    Keyboard:
    Focus:
    Screen Reader:
    Contrast:
    Motion:
    Forms:
    Tables:
    Dialogs:
    Dynamic Status:

    Critical Findings:
    Non-Critical Findings:

    Decision:
    Evidence:

# 74. Visual QA Template

    VISUAL QA REVIEW

    Screen:
    Milestone:
    Build:
    OS:
    Theme:
    Reviewer:
    Date:

    Layout:
    Typography:
    Spacing:
    Icons:
    Colors:
    Components:
    Status:
    Loading:
    Empty:
    Error:
    Dialogs:

    Differences:
    Decision:
    Evidence:

# 75. Cross-Platform Review Template

    CROSS-PLATFORM REVIEW

    Feature:
    Milestone:
    Build:
    Reviewer:
    Date:

    Linux:
    Windows:
    macOS:

    Window Scaling:
    Keyboard:
    Fonts:
    Dialogs:
    Filesystem:
    Video:
    Notifications:
    Theme:

    Findings:
    Decision:
    Evidence:

# 76. Final Sign-Off Template

    UI MILESTONE SIGN-OFF

    Milestone:
    Release:
    Commit:
    Build:
    Date:

    Functional: PASS / FAIL
    Visual: PASS / FAIL
    Accessibility: PASS / FAIL
    Keyboard: PASS / FAIL
    Performance: PASS / FAIL
    Responsive: PASS / FAIL
    i18n Readiness: PASS / FAIL
    Security: PASS / FAIL / N/A
    Safety: PASS / FAIL / N/A
    API Integration: PASS / FAIL

    Blocking Issues:
    Non-Blocking Issues:
    Risks:
    Waivers:
    Evidence:

    Reviewer:
    Approver:

    Decision:
    ACCEPTED / ACCEPTED_WITH_ACTIONS / CHANGES_REQUIRED / BLOCKED

# 77. Sign-Off Procedure

The formal procedure is:

    1. Developer Self-Review
              |
              v
    2. Design Review
              |
              v
    3. Implementation Review
              |
              v
    4. Automated Tests
              |
              v
    5. Accessibility Review
              |
              v
    6. Visual QA
              |
              v
    7. Cross-Platform Review
              |
              v
    8. Integration/E2E
              |
              v
    9. Security/Safety Review
              |
              v
    10. Milestone Sign-Off

Steps may run in parallel where dependencies permit, but all required gates
must be complete before acceptance.

# 78. Developer Self-Review

Before requesting review:

- [ ] Acceptance criteria read.
- [ ] Design reference read.
- [ ] Shared components reused.
- [ ] States implemented.
- [ ] Tests written.
- [ ] Accessibility checked.
- [ ] Theme checked.
- [ ] Error handling checked.
- [ ] API integration checked.
- [ ] No secrets included.
- [ ] No source privacy violation.
- [ ] No unsafe control added.
- [ ] Evidence prepared.

# 79. Reviewer First Pass

Reviewer first checks:

- [ ] Is this the right architectural location?
- [ ] Is the design system being reused?
- [ ] Is the feature boundary correct?
- [ ] Are business rules incorrectly embedded in UI?
- [ ] Are state transitions correct?
- [ ] Are acceptance criteria testable?

If the answer is no, return for changes before detailed visual review.

# 80. Reviewer Detailed Pass

Detailed review covers:

- implementation;
- component structure;
- state;
- API;
- error handling;
- accessibility;
- visual behavior;
- performance;
- security;
- safety.

The reviewer records evidence rather than relying on verbal confirmation.

# 81. Defect Handling

Each defect must have:

- severity;
- description;
- reproduction;
- expected behavior;
- actual behavior;
- owner;
- status;
- related task.

S0/S1 defects block sign-off.

# 82. Review Rework

After changes:

- [ ] original defect is verified;
- [ ] regression test is added where appropriate;
- [ ] affected review areas are repeated;
- [ ] evidence is refreshed;
- [ ] previous approval is reconsidered.

A previous approval does not automatically survive a material implementation
change.

# 83. Review Changes to Shared Components

Any change to a shared component requires:

- [ ] impact search;
- [ ] consumer identification;
- [ ] visual regression;
- [ ] accessibility regression;
- [ ] light/dark validation;
- [ ] affected feature review.

# 84. Review Changes to Design Tokens

Token changes require:

- [ ] all consuming components identified;
- [ ] light theme tested;
- [ ] dark theme tested;
- [ ] contrast reviewed;
- [ ] visual regression;
- [ ] affected screens reviewed;
- [ ] migration documented if breaking.

# 85. Review Changes to Navigation

Navigation changes require:

- [ ] information architecture review;
- [ ] keyboard review;
- [ ] focus review;
- [ ] deep-link review;
- [ ] authorization review;
- [ ] breadcrumbs review;
- [ ] project-context review.

# 86. Review Changes to Live Execution

Live execution changes require:

- [ ] Job/Run model review;
- [ ] WebSocket review;
- [ ] reconnect review;
- [ ] video review;
- [ ] telemetry review;
- [ ] logs review;
- [ ] safety review;
- [ ] cloud disconnect behavior review.

# 87. Review Changes to Booking

Booking changes require:

- [ ] availability review;
- [ ] conflict review;
- [ ] idempotency review;
- [ ] credit review;
- [ ] cancellation review;
- [ ] timezone review;
- [ ] authorization review.

# 88. Review Changes to Credits

Credit UI changes require:

- [ ] platform-specific credit review;
- [ ] balance review;
- [ ] reservation review;
- [ ] consumption review;
- [ ] refund review;
- [ ] ledger representation review;
- [ ] financial correctness review.

# 89. Review Changes to Artifact Security

Artifact UI changes require:

- [ ] manifest review;
- [ ] checksum review;
- [ ] signature review;
- [ ] scan review;
- [ ] compatibility review;
- [ ] revocation review;
- [ ] authorization review.

# 90. Review Changes to Source Privacy

Any UI change that touches:

- source browsing;
- build;
- packaging;
- upload;
- logging;
- telemetry;
- analytics;

requires source privacy review.

# 91. Review Metrics

Track:

- review cycle time;
- defects per screen;
- accessibility defects;
- visual defects;
- regressions;
- S0/S1 findings;
- reopened findings;
- milestone rework;
- review acceptance rate.

Metrics are for process improvement, not for reducing review rigor.

# 92. Review Evidence Retention

Evidence for accepted milestones should remain traceable to:

- commit;
- build;
- milestone;
- release;
- environment.

Security and safety evidence follows the stronger retention policy of the
applicable domain.

# 93. Final Acceptance Checklist — Design

- [ ] User goal defined.
- [ ] Information architecture approved.
- [ ] Primary action defined.
- [ ] State model defined.
- [ ] Error recovery defined.
- [ ] Design-system tokens used.
- [ ] Accessibility considered.
- [ ] i18n considered.
- [ ] Security considered.
- [ ] Safety considered.

# 94. Final Acceptance Checklist — Implementation

- [ ] Architecture correct.
- [ ] Components reusable.
- [ ] Business logic separated.
- [ ] API integration typed.
- [ ] State management appropriate.
- [ ] Tests pass.
- [ ] No duplicate component where reuse is appropriate.
- [ ] No unexplained hardcoded styling.
- [ ] Error boundaries work.
- [ ] Performance is acceptable.

# 95. Final Acceptance Checklist — Usability

- [ ] System status visible.
- [ ] Domain terminology correct.
- [ ] User control preserved.
- [ ] Consistency maintained.
- [ ] Error prevention exists.
- [ ] Recognition over recall.
- [ ] Efficient expert workflow.
- [ ] Minimal visual noise.
- [ ] Recovery paths exist.

# 96. Final Acceptance Checklist — Accessibility

- [ ] Automated audit passes.
- [ ] Keyboard audit passes.
- [ ] Focus audit passes.
- [ ] Screen-reader smoke test passes.
- [ ] Contrast passes.
- [ ] Motion audit passes.
- [ ] Forms are accessible.
- [ ] Tables are accessible.
- [ ] Dialogs are accessible.
- [ ] Dynamic status is accessible.

# 97. Final Acceptance Checklist — Visual

- [ ] Light mode passes.
- [ ] Dark mode passes.
- [ ] Typography passes.
- [ ] Spacing passes.
- [ ] Grid passes.
- [ ] Icons pass.
- [ ] Status presentation passes.
- [ ] Loading passes.
- [ ] Empty passes.
- [ ] Error passes.
- [ ] Visual regression passes.

# 98. Final Acceptance Checklist — Cross-Platform

- [ ] Linux passes.
- [ ] Windows passes.
- [ ] macOS passes when applicable.
- [ ] Window scaling passes.
- [ ] Font rendering is acceptable.
- [ ] Keyboard conventions work.
- [ ] Dialog behavior works.
- [ ] Filesystem behavior works.
- [ ] Video works.
- [ ] Notifications work.

# 99. Final Acceptance Checklist — Security and Safety

- [ ] Source privacy passes.
- [ ] Tenant isolation behavior is correct.
- [ ] Authorization is correct.
- [ ] Artifact trust is correct.
- [ ] Secrets are protected.
- [ ] Safety authority is explicit.
- [ ] Unsafe actions are blocked.
- [ ] Disconnect behavior is correct.
- [ ] No unsafe automatic restart.
- [ ] Specialist review is complete.

# 100. Final Acceptance Checklist — Release

- [ ] All milestone screens reviewed.
- [ ] All blocking defects closed.
- [ ] Non-blocking defects tracked.
- [ ] Accessibility approved.
- [ ] Visual QA approved.
- [ ] Cross-platform QA approved.
- [ ] E2E approved.
- [ ] Performance approved.
- [ ] Security approved where required.
- [ ] Safety approved where required.
- [ ] Evidence complete.
- [ ] Sign-off recorded.

# 101. Final Invariants

1. Design review precedes implementation for new major workflows.
2. Implementation review verifies architectural correctness.
3. Accessibility review is mandatory.
4. Visual QA is mandatory.
5. Cross-platform review is mandatory for supported platforms.
6. Loading, empty and error states are reviewed.
7. Light and dark themes are reviewed.
8. Keyboard-only workflows are reviewed.
9. Source privacy is explicitly reviewed.
10. Financial UI is explicitly reviewed.
11. Safety-sensitive UI is explicitly reviewed.
12. Live execution is reviewed across disconnect/reconnect states.
13. Job and Run remain distinct.
14. Video state does not define execution state.
15. Server state remains authoritative.
16. Shared components require regression review.
17. Token changes require impact review.
18. S0/S1 findings block acceptance.
19. Acceptance requires evidence.
20. Approval must be traceable to a commit/build.
21. Material changes after approval require re-review.
22. No review may silently waive security or safety requirements.
23. Phase acceptance requires all applicable UI review gates.
24. UI review does not replace system-level release qualification.
25. Production readiness requires both technical correctness and user-facing
    quality.

# 102. Final Review Principle

> Kritva RaaS Studio UI review is an engineering control, not a cosmetic
> inspection. A screen is acceptable only when its information architecture,
> interaction model, implementation, accessibility, visual treatment,
> performance, error behavior, cross-platform behavior and integration with
> authoritative system contracts have all been reviewed and evidenced. The
> review process must preserve the fundamental RaaS boundaries: customer
> source remains local, artifacts are the controlled object crossing the
> security boundary, the Control Plane remains authoritative for remote
> business state, credits and bookings, Job and Run remain distinct, and
> physical safety remains local to the lab and robot. Every F-M01 through
> F-M07 milestone must pass the applicable design, implementation,
> accessibility, usability, visual, cross-platform, security, safety and
> integration gates before it is considered accepted. The objective is not
> merely a visually polished application, but a reliable, understandable,
> accessible, safe and production-grade engineering environment for building,
> booking, executing and analyzing robotics applications.
