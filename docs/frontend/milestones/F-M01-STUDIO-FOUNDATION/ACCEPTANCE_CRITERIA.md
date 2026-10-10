# F-M01-STUDIO-FOUNDATION — Acceptance Criteria

Milestone: F-M01 — Studio Foundation

# 6. Acceptance Criteria

## 6.1 Application Startup

- [ ] Studio launches successfully in development mode.
- [ ] Studio launches successfully in production build mode.
- [ ] Tauri initializes without fatal errors.
- [ ] React initializes without fatal errors.
- [ ] Startup errors are visible to the user.
- [ ] Application version is available through diagnostics/about.
- [ ] Startup does not expose secrets.

## 6.2 Navigation

- [ ] Main navigation renders consistently.
- [ ] Active route is visually identifiable.
- [ ] Protected routes require authentication.
- [ ] Unauthenticated users are redirected to Login.
- [ ] Authenticated users can reach Dashboard.
- [ ] Logout returns the user to Login.
- [ ] Deep links do not bypass route guards.
- [ ] Keyboard navigation reaches all primary navigation items.
- [ ] Focus state is visible.
- [ ] Navigation remains usable at supported window sizes.

## 6.3 Authentication

- [ ] Login form validates required fields.
- [ ] Login shows progress state.
- [ ] Invalid credentials produce a safe error.
- [ ] Network failure produces a recoverable error.
- [ ] Successful login establishes session state.
- [ ] Session restoration is attempted on startup.
- [ ] Expired sessions are detected.
- [ ] Expired sessions redirect to Login.
- [ ] Logout invalidates the local session.
- [ ] Authentication errors do not reveal sensitive information.
- [ ] Tokens are not displayed in UI.
- [ ] Tokens are not written to logs.

## 6.4 Session

- [ ] Session state has explicit loading/checking behavior.
- [ ] Authenticated and unauthenticated states are distinct.
- [ ] Session expiry is handled centrally.
- [ ] API unauthorized responses can invalidate the session.
- [ ] Concurrent UI requests do not create inconsistent auth state.
- [ ] Session restoration does not expose protected content before validation.
- [ ] Session state survives normal application navigation.
- [ ] Sign-out clears appropriate local session information.

## 6.5 Dashboard

- [ ] Dashboard loads for authenticated users.
- [ ] User identity is displayed correctly.
- [ ] Organization context is displayed correctly where available.
- [ ] Platform awareness is visible.
- [ ] Unavailable features are clearly marked.
- [ ] No fake booking state is displayed.
- [ ] No fake job state is displayed.
- [ ] No fake credit balance is displayed.
- [ ] No fake robot status is displayed.
- [ ] Loading state exists.
- [ ] Empty state exists.
- [ ] Error state exists.

## 6.6 Profile

- [ ] Profile route is protected.
- [ ] User identity loads from the appropriate source.
- [ ] Organization membership context is correct.
- [ ] Loading state exists.
- [ ] Error state exists.
- [ ] Sensitive identity data is not exposed unnecessarily.
- [ ] Profile changes, if enabled, use the authoritative API.

## 6.7 Settings

- [ ] Settings route is protected.
- [ ] Settings categories are discoverable.
- [ ] Local settings are distinguished from server settings.
- [ ] Appearance settings work.
- [ ] Session settings do not expose secrets.
- [ ] Diagnostic controls do not expose source code.
- [ ] Settings persist according to their defined ownership.
- [ ] Reset behavior is safe and understandable.

## 6.8 Platform Awareness

- [ ] Platform data uses typed contracts.
- [ ] Platform ID is stable.
- [ ] Platform name is displayed.
- [ ] Platform version can be displayed.
- [ ] Architecture can be displayed.
- [ ] Capability information can be represented.
- [ ] Availability state can be represented.
- [ ] Unknown platform state is handled.
- [ ] API failure does not crash the Studio.
- [ ] Platform awareness does not imply booking availability.
- [ ] Platform awareness does not imply compatibility approval.

## 6.9 UI States

Every major F-M01 screen must define:

- [ ] loading;
- [ ] success;
- [ ] empty;
- [ ] error;
- [ ] unavailable;
- [ ] unauthorized where applicable.

No screen may depend on an implicit loading state.

## 6.10 Accessibility

- [ ] Primary workflows are keyboard accessible.
- [ ] Visible focus exists.
- [ ] Labels are associated with controls.
- [ ] Buttons have accessible names.
- [ ] Dialog focus is managed correctly.
- [ ] Errors are discoverable by assistive technology.
- [ ] Color is not the sole state indicator.
- [ ] Contrast follows the design system requirement.
- [ ] Reduced-motion behavior is considered.
- [ ] Screen-reader semantics are appropriate.

## 6.11 Theme

- [ ] Light theme is supported.
- [ ] Dark theme is supported.
- [ ] Theme tokens are semantic.
- [ ] Components do not hard-code unrelated colors.
- [ ] Focus states remain visible in both themes.
- [ ] Error/warning/success states remain distinguishable.
- [ ] Theme selection persists according to settings policy.

## 6.12 Security

- [ ] Authentication uses approved API contracts.
- [ ] Authorization is not implemented solely in the UI.
- [ ] Protected routes are guarded.
- [ ] Session secrets are securely stored.
- [ ] Tokens are not logged.
- [ ] Source code is not uploaded.
- [ ] Native capabilities are restricted.
- [ ] IPC commands validate inputs.
- [ ] Error messages do not disclose secrets.
- [ ] Development credentials are not packaged into production builds.

## 6.13 Quality

- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] Navigation E2E tests pass.
- [ ] Authentication tests pass.
- [ ] Accessibility checks pass.
- [ ] Linux build passes.
- [ ] Windows build path is validated.
- [ ] CI is green.
- [ ] Static analysis is clean.
- [ ] Formatting is clean.
- [ ] Type checking is clean.

## 6.14 Coding-Agent Foundation

- [ ] The provider-neutral adapter trait and capability descriptor match `docs/architecture/CODING_AGENT_INTEGRATION.md` Section 5.1.
- [ ] The mock provider passes the adapter contract tests.
- [ ] The session manager implements the documented lifecycle states and timeouts.
- [ ] The session journal is durable across Studio restarts, and the workspace lock prevents two agent sessions on one workspace across Studio processes.
- [ ] Adapter errors map to the normalized taxonomy (`docs/architecture/CODING_AGENT_INTEGRATION.md` Section 5.9).
- [ ] The agent process environment contains no Kritva session token, API key, Control Plane credential or signing material.
- [ ] The workspace guard detects modifications outside the allowed root.
- [ ] The `agent.*` IPC commands validate inputs and are covered by contract tests.
- [ ] No generic command-execution IPC exists.
- [ ] Studio starts and works normally with no coding-agent provider installed.

---

