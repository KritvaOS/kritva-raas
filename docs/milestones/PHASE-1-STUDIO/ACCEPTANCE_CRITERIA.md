# PHASE-1-STUDIO — Acceptance Criteria

Milestone: PHASE-1-STUDIO — Desktop Studio Foundation

## 6 Acceptance criteria

### 6.1 Application foundation

- [ ] Tauri application launches.
- [ ] React application renders.
- [ ] TypeScript compilation passes.
- [ ] Rust compilation passes.
- [ ] Application package is discovered by workspace tooling.
- [ ] Development mode works.
- [ ] Production build works.
- [ ] Application version is displayed.
- [ ] Environment is displayed where appropriate.

### 6.2 Application shell

- [ ] Header exists.
- [ ] Navigation exists.
- [ ] Main content region exists.
- [ ] User context exists.
- [ ] Organization context exists.
- [ ] Status indicator exists.
- [ ] Settings route exists.
- [ ] Error boundary exists.
- [ ] Loading states exist.
- [ ] Empty states exist.
- [ ] Notifications are consistent.

### 6.3 Navigation

- [ ] Dashboard route works.
- [ ] Projects route works.
- [ ] Platforms route works.
- [ ] Settings route works.
- [ ] Profile route works.
- [ ] Unknown route is handled.
- [ ] Navigation preserves active organization context.
- [ ] Future routes can be added without shell redesign.

### 6.4 Authentication

- [ ] Login screen exists.
- [ ] Valid authentication creates session.
- [ ] Invalid authentication produces safe error.
- [ ] Session restoration works.
- [ ] Logout works.
- [ ] Expired session is detected.
- [ ] Unauthorized API response returns user to appropriate state.
- [ ] Tokens are not stored in localStorage.
- [ ] Tokens are not stored in project metadata.
- [ ] Sensitive credentials use secure storage boundary.

### 6.5 Organization

- [ ] User organizations can be loaded.
- [ ] Active organization is visible.
- [ ] Organization can be selected.
- [ ] Organization switch refreshes scoped data.
- [ ] Organization ID is attached to authorized API context.
- [ ] Organization switching cannot expose prior organization data.
- [ ] Membership role is displayed where appropriate.

### 6.6 Projects

- [ ] Project list loads.
- [ ] Empty project state is useful.
- [ ] Project can be created.
- [ ] Project key validation exists.
- [ ] Project name validation exists.
- [ ] Project detail loads.
- [ ] Project status is displayed.
- [ ] Project organization is displayed.
- [ ] Project target platform can be represented.
- [ ] Target KritvaOS version can be represented.
- [ ] Target SDK version can be represented.
- [ ] Project metadata API does not upload source code.
- [ ] Project authorization is enforced by backend.

### 6.7 Platforms

- [ ] Platform catalog loads.
- [ ] Platform type is displayed.
- [ ] Platform lifecycle is respected.
- [ ] Platform version is displayed.
- [ ] Architecture is displayed.
- [ ] Runtime compatibility is displayed.
- [ ] SDK compatibility is displayed.
- [ ] Capabilities are displayed.
- [ ] Deprecated platforms are clearly identified.
- [ ] Platform data is server-authoritative.

### 6.8 API client

- [ ] Typed request/response contracts are used.
- [ ] Base URL is configurable.
- [ ] Authentication is attached through the session mechanism.
- [ ] Request IDs are generated or propagated.
- [ ] Errors are normalized.
- [ ] Timeout behavior exists.
- [ ] Request cancellation exists where applicable.
- [ ] Safe retries are supported only for retryable operations.
- [ ] Non-idempotent operations are not blindly retried.
- [ ] Network errors are distinguishable from business errors.

### 6.9 WebSocket foundation

- [ ] WebSocket connection abstraction exists.
- [ ] Authentication boundary exists.
- [ ] Organization context exists.
- [ ] Event envelope is validated.
- [ ] Duplicate events can be detected.
- [ ] Sequence metadata can be processed.
- [ ] Reconnect is supported at the transport layer.
- [ ] Reconnect does not imply business-operation restart.
- [ ] Durable REST state remains authoritative.

### 6.10 Local Runtime IPC

- [ ] IPC interface is explicitly defined.
- [ ] IPC commands are typed.
- [ ] IPC responses are typed.
- [ ] IPC errors are normalized.
- [ ] Unavailable Local Runtime is represented safely.
- [ ] UI cannot execute arbitrary native commands.
- [ ] Privileged native operations are allowlisted.
- [ ] Local Runtime mock works.
- [ ] Future build commands have a defined integration point.

### 6.11 Local source privacy

- [ ] Studio does not upload source during login.
- [ ] Studio does not upload source during project creation.
- [ ] Studio does not upload source during project metadata synchronization.
- [ ] Studio API client has no source-upload operation in P1 STUDIO.
- [ ] Source access remains inside the local workspace boundary.
- [ ] Source paths are not written into remote metadata unnecessarily.
- [ ] Error messages do not disclose source content.
- [ ] Logs do not disclose source content.

### 6.12 Secure storage

- [ ] OS credential-store abstraction exists.
- [ ] Access tokens are not persisted as plain text.
- [ ] Refresh/session credentials are protected.
- [ ] Logout removes or invalidates local credentials according to policy.
- [ ] Credential-store failures are handled safely.
- [ ] Development mocks are clearly separated from production storage.

### 6.13 UI system

- [ ] Shared buttons exist.
- [ ] Shared inputs exist.
- [ ] Shared forms exist.
- [ ] Shared dialogs exist.
- [ ] Shared tables exist.
- [ ] Shared cards exist.
- [ ] Shared status indicators exist.
- [ ] Shared loading components exist.
- [ ] Shared empty-state components exist.
- [ ] Shared error-state components exist.
- [ ] Visual hierarchy is consistent.

### 6.14 Accessibility

- [ ] Keyboard navigation works for primary workflows.
- [ ] Focus is visible.
- [ ] Form controls have labels.
- [ ] Dialog focus behavior is correct.
- [ ] Errors are accessible.
- [ ] Loading state is communicated.
- [ ] Color is not the only state indicator.
- [ ] Minimum contrast requirements are addressed.
- [ ] Screen-reader semantics are established for primary controls.

### 6.15 Desktop behavior

- [ ] Application window opens reliably.
- [ ] Window can resize.
- [ ] Minimum usable window size is defined.
- [ ] Application shutdown is clean.
- [ ] Unsaved local state is handled safely.
- [ ] Application restart restores appropriate session state.
- [ ] No privileged process remains unexpectedly after shutdown.

### 6.16 Testing

- [ ] Unit tests pass.
- [ ] Component tests pass.
- [ ] API-client tests pass.
- [ ] IPC tests pass.
- [ ] Authentication E2E passes.
- [ ] Project E2E passes.
- [ ] Platform E2E passes.
- [ ] Desktop smoke test passes.
- [ ] Linux build passes.
- [ ] Windows build path passes.
- [ ] macOS build path is validated according to priority.

### 6.17 Security

- [ ] Frontend dependencies are scanned.
- [ ] Tauri/Rust dependencies are scanned.
- [ ] Secrets scan passes.
- [ ] CSP/security policy is defined.
- [ ] Native IPC is allowlisted.
- [ ] External navigation is controlled.
- [ ] Authentication failures are safe.
- [ ] Authorization remains backend authoritative.
- [ ] Tenant data is not cached across organization contexts.
- [ ] Sensitive data is not written to logs.

### 6.18 Cross-domain exit criteria

The following integrated flow must pass:

    Studio Launch
        |
        v
    Login
        |
        v
    Session Established
        |
        v
    Organization Loaded
        |
        v
    Dashboard
        |
        v
    Projects
        |
        v
    Create Project
        |
        v
    Select Platform Metadata
        |
        v
    Local Runtime Health
        |
        v
    Logout
        |
        v
    Session Cleared

Acceptance requires:

- [ ] Control Plane authentication works.
- [ ] Organization context propagates correctly.
- [ ] Project API works.
- [ ] Platform API works.
- [ ] Local Runtime IPC works.
- [ ] Errors remain correctly scoped.
- [ ] Source remains local.
- [ ] A coding-agent session (mock provider in CI, first real provider in the review environment) can be started, reviewed and reverted inside the flow.
- [ ] The full flow also passes with no coding-agent provider installed.
- [ ] The coding-agent P1 STUDIO exit gate (`docs/architecture/CODING_AGENT_INTEGRATION.md` Section 12) is met with test-matrix evidence.
- [ ] CI validates the full Studio flow.

### 6.19 No-go conditions

P1 STUDIO shall not close if:

- [ ] Studio cannot build reproducibly;
- [ ] authentication stores credentials insecurely;
- [ ] organization switching leaks data;
- [ ] project APIs upload source;
- [ ] frontend bypasses backend authorization;
- [ ] IPC allows arbitrary privileged operations;
- [ ] any project content, prompt, transcript or diff reaches a Kritva service during a coding-agent session;
- [ ] a coding-agent session can start without consent or with Kritva credentials in its environment, or can change the working tree without an explicit apply;
- [ ] CI does not validate Studio;
- [ ] critical desktop startup failure remains;
- [ ] cross-domain smoke flow fails.

---
