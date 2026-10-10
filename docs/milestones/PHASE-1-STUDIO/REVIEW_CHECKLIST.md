# PHASE-1-STUDIO — Review Checklist

Milestone: PHASE-1-STUDIO — Desktop Studio Foundation

## Review Gate

The milestone may be closed only when every item below is checked by the reviewer, the acceptance criteria in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) are all met, and the exit criteria in [MILESTONE.md](MILESTONE.md) are satisfied.

- [ ] All tasks in [TASKS.md](TASKS.md) are ACCEPTED (none open, none deferred without a change record).
- [ ] Every acceptance criterion has recorded evidence (test run, demo capture, or document).
- [ ] Architecture, protocol and database contracts referenced by this milestone were not changed without a change record.
- [ ] Security review items for this milestone are closed (source-code privacy, tenant isolation, secrets).
- [ ] Documentation affected by this milestone is updated and the tracking files are current.
- [ ] CHANGELOG.md is updated.
- [ ] The commit/tag step in [GIT_COMMIT_STEP.md](GIT_COMMIT_STEP.md) is prepared.

## 7 Test and verification plan

### 7.1 Test architecture

P1 STUDIO testing follows:

    Unit
      |
      v
    Component
      |
      v
    API Client
      |
      v
    IPC
      |
      v
    Integration
      |
      v
    E2E
      |
      v
    Desktop Smoke
      |
      v
    Cross-Domain

### 7.2 Unit tests

Test:

- state reducers/store;
- API error mapping;
- validation;
- routing;
- configuration;
- organization context;
- session state;
- capability formatting.

### 7.3 Component tests

Test:

- navigation;
- login form;
- organization selector;
- project form;
- project list;
- platform card;
- status indicator;
- error state;
- empty state;
- loading state.

### 7.4 API-client tests

Mock Control Plane responses for:

- authentication;
- organization list;
- project list;
- project creation;
- platform list;
- platform detail;
- health;
- unauthorized;
- forbidden;
- conflict;
- unavailable.

### 7.5 IPC tests

Verify:

    UI
      |
      v
    IPC Command
      |
      v
    Rust Handler
      |
      v
    Mock Local Runtime
      |
      v
    Typed Response

Test invalid commands and unavailable runtime.

### 7.6 Authentication E2E

Scenario:

    Launch
      |
      v
    Login
      |
      v
    Session
      |
      v
    Organization
      |
      v
    Dashboard
      |
      v
    Logout

Also test:

- invalid credentials;
- expired session;
- network failure;
- backend unavailable.

### 7.7 Project E2E

Scenario:

    Login
      |
      v
    Organization
      |
      v
    Projects
      |
      v
    Create Project
      |
      v
    Project Detail
      |
      v
    Select Platform

Verify source code is never transmitted.

### 7.8 Platform E2E

Verify:

- catalog loading;
- version selection;
- architecture;
- capability display;
- unavailable platform;
- deprecated platform.

### 7.9 Organization isolation test

Create two organizations.

Verify:

    Org A
      |
      +--> Project A
      |
      X--> Project B

    Org B
      |
      +--> Project B
      |
      X--> Project A

### 7.10 Reconnect test

Disconnect Control Plane.

Verify:

- UI shows disconnected state;
- no false success is shown;
- reconnect occurs;
- durable state is refreshed;
- no duplicate project creation occurs.

### 7.11 Local Runtime failure test

Stop the Local Runtime mock.

Expected:

- Studio remains usable for cloud metadata;
- local-runtime-specific operations are disabled or fail clearly;
- no application crash occurs.

### 7.12 Security verification

Verify:

- tokens absent from localStorage;
- credentials protected;
- source absent from network requests;
- unsafe IPC calls rejected;
- external URLs controlled;
- sensitive data absent from logs.

### 7.13 Cross-platform verification

P0:

- Linux x86_64;
- Windows x86_64.

P1:

- macOS Apple Silicon.

Verify:

- launch;
- authentication;
- navigation;
- API connectivity;
- project workflow;
- graceful shutdown.

### 7.14 CI verification

CI shall validate:

    install
      |
      v
    lint
      |
      v
    typecheck
      |
      v
    test
      |
      v
    build
      |
      v
    security scan
      |
      v
    desktop build/smoke

### 7.15 Evidence

Required evidence:

- CI run;
- test report;
- desktop build artifact;
- security scan;
- source-privacy test;
- organization-isolation test;
- clean-machine bootstrap;
- architecture review;
- UI review.

---

## 8 Demo script

### 8.1 Demo objective

Demonstrate a complete P1 STUDIO Studio workflow from application launch through authenticated organization/project/platform interaction and Local Runtime integration.

### 8.2 Step 1 — Launch Studio

Start the desktop application.

Expected:

- native window opens;
- shell renders;
- version is visible;
- initial service status is shown.

### 8.3 Step 2 — Login

Enter valid development credentials.

Expected:

    Login
      -> Session Established
      -> Organization Loaded
      -> Dashboard

### 8.4 Step 3 — Organization selection

Display available organizations.

Select one.

Expected:

- active organization changes;
- organization context is visible;
- organization-scoped data refreshes.

### 8.5 Step 4 — Dashboard

Display:

- user;
- organization;
- service status;
- project summary;
- platform summary.

The dashboard shall not imply functionality that is not implemented.

### 8.6 Step 5 — Projects

Open Projects.

Expected:

Project list is loaded from the Control Plane.

### 8.7 Step 6 — Create Project

Create:

    Name: Demo Project
    Key: DEMO
    Platform: Selected supported platform

Expected:

Project is created server-side.

### 8.8 Step 7 — Project detail

Open project.

Display:

- project name;
- project key;
- organization;
- status;
- target platform;
- KritvaOS version;
- SDK version.

### 8.9 Step 8 — Platform discovery

Open Platforms.

Expected:

    Platform
       |
       v
    Version
       |
       v
    Architecture
       |
       v
    Capabilities

All values are server-authoritative.

### 8.10 Step 9 — Local Runtime

Open Local Runtime status.

Expected:

    Runtime = AVAILABLE

If the runtime is stopped:

    Runtime = UNAVAILABLE

Studio remains stable.

### 8.11 Step 10 — Disconnect Control Plane

Simulate backend/network failure.

Expected:

- Studio displays disconnected state;
- no operation reports false success;
- reconnect is attempted safely.

### 8.12 Step 11 — Restore connectivity

Restore backend.

Expected:

- connection returns;
- organization/project/platform state refreshes;
- no duplicate mutation occurs.

### 8.13 Step 12 — Logout

Logout.

Expected:

- session cleared;
- protected routes become inaccessible;
- credentials are handled according to secure-storage policy.

### 8.14 Step 13 — Source privacy evidence

Inspect network activity.

Expected:

- no source upload;
- no compiler input upload;
- no Git metadata upload;
- no source file content in API payloads.

### 8.15 Demo completion

The demo passes when:

> Studio operates as a stable desktop developer boundary, integrates with the Control Plane through contracts, integrates with the Local Runtime through controlled IPC, preserves organization context, and maintains source-code privacy.

---
