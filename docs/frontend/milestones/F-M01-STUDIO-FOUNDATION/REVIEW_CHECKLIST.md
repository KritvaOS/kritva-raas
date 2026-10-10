# F-M01-STUDIO-FOUNDATION — Review Checklist

Milestone: F-M01 — Studio Foundation

## Review Gate

The milestone may be closed only when every item below is checked by the reviewer, the acceptance criteria in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) are all met, and the exit criteria in [MILESTONE.md](MILESTONE.md) are satisfied.

- [ ] All tasks in [TASKS.md](TASKS.md) are ACCEPTED (none open, none deferred without a change record).
- [ ] Every acceptance criterion has recorded evidence (test run, demo capture, or document).
- [ ] Architecture, protocol and database contracts referenced by this milestone were not changed without a change record.
- [ ] Security review items for this milestone are closed (source-code privacy, tenant isolation, secrets).
- [ ] Documentation affected by this milestone is updated and the tracking files are current.
- [ ] CHANGELOG.md is updated.
- [ ] The commit/tag step in [GIT_COMMIT_STEP.md](GIT_COMMIT_STEP.md) is prepared.

# 7. Test and Verification Plan

## 7.1 Test Pyramid

F-M01 testing follows:

    Unit Tests
        |
        v
    Component Tests
        |
        v
    Integration Tests
        |
        v
    Tauri/Native Tests
        |
        v
    E2E Tests
        |
        v
    Cross-Platform Verification
        |
        v
    Milestone Acceptance

## 7.2 Unit Testing

Unit tests cover:

- route guards;
- session reducer/state;
- authentication state;
- API client behavior;
- error mapping;
- platform model mapping;
- settings state;
- navigation state.

## 7.3 Component Testing

Components to test:

- Login;
- navigation;
- dashboard cards;
- profile;
- settings;
- platform cards;
- loading state;
- empty state;
- error state;
- dialogs;
- notifications.

## 7.4 Authentication Integration Tests

Minimum scenarios:

1. successful login;
2. invalid credentials;
3. unavailable backend;
4. session restoration;
5. expired session;
6. unauthorized API response;
7. logout;
8. repeated login/logout.

## 7.5 Navigation E2E Tests

Minimum flow:

    Launch
      |
      v
    Login
      |
      v
    Dashboard
      |
      v
    Profile
      |
      v
    Settings
      |
      v
    Platforms
      |
      v
    Logout
      |
      v
    Login

## 7.6 Security Verification

Verify:

- tokens absent from logs;
- source files never sent;
- IPC commands reject invalid inputs;
- protected routes redirect correctly;
- unauthorized API responses clear session;
- production builds contain no development secrets.

## 7.7 Cross-Platform Verification

P0 targets:

- Linux x86_64;
- Windows x86_64.

P1:

- macOS Apple Silicon.

Verification includes:

- startup;
- login;
- navigation;
- session;
- settings;
- theme;
- packaging;
- secure storage;
- shutdown.

## 7.8 Performance Verification

Measure:

- startup time;
- login-to-dashboard transition;
- route transition;
- memory baseline;
- idle CPU;
- rendering responsiveness.

F-M01 should establish baseline measurements rather than optimize prematurely.

## 7.9 CI Verification

CI must run:

- format;
- lint;
- typecheck;
- unit tests;
- component tests;
- integration tests;
- build;
- security checks.

## 7.10 Review Verification

Required reviews:

- architecture review;
- UI design review;
- implementation review;
- accessibility review;
- security review;
- QA review.

---

# 8. Demo Script

## 8.1 Demo Objective

Demonstrate that the Studio foundation is operational and ready to support the
next frontend milestone.

The demo must use a real build of the Studio.

Mocks may be used only where the corresponding backend contract is not yet
implemented.

## 8.2 Demo Preparation

Before demo:

- [ ] build succeeds;
- [ ] CI is green;
- [ ] test suite passes;
- [ ] test account exists;
- [ ] platform fixture exists;
- [ ] demo environment is available;
- [ ] no production secrets are used.

## 8.3 Step 1 — Launch

Action:

    Start Kritva RaaS Studio.

Expected:

- application launches;
- branded shell appears;
- no fatal startup error;
- Login screen is displayed if no session exists.

## 8.4 Step 2 — Login

Action:

- enter valid credentials;
- submit.

Expected:

- loading indicator appears;
- authentication succeeds;
- session is established;
- Dashboard appears.

## 8.5 Step 3 — Dashboard

Show:

- user identity;
- organization;
- platform awareness;
- navigation;
- application state.

Confirm that future features are visibly marked as unavailable rather than
represented as completed functionality.

## 8.6 Step 4 — Navigation

Navigate:

    Dashboard
       ->
    Projects
       ->
    Platforms
       ->
    Build
       ->
    Artifacts
       ->
    Booking
       ->
    Jobs
       ->
    Results
       ->
    Settings

Expected:

- navigation works;
- protected routes remain protected;
- placeholder states are clear;
- no crashes occur.

## 8.7 Step 5 — Platforms

Show:

- platform name;
- version;
- architecture;
- capability representation;
- availability representation.

Explain that this is platform awareness, not booking.

## 8.8 Step 6 — Profile

Open Profile.

Verify:

- identity;
- organization context;
- session/account information.

## 8.9 Step 7 — Settings

Demonstrate:

- theme;
- application settings;
- diagnostics;
- session-related controls.

Confirm no secrets are exposed.

## 8.10 Step 8 — Session Expiry

Simulate or trigger session expiration.

Expected:

    Session Expired
         |
         v
    Safe Notification
         |
         v
    Login Screen

Protected application state must not remain accessible.

## 8.11 Step 9 — Logout

Log out.

Expected:

- session cleared;
- protected routes unavailable;
- Login displayed.

## 8.12 Demo Success Criteria

The demo passes when:

- application launches;
- authentication works;
- navigation works;
- session lifecycle works;
- dashboard works;
- profile works;
- settings works;
- platform awareness works;
- error/loading states are demonstrable;
- logout works;
- no source code crosses the remote boundary.

---
