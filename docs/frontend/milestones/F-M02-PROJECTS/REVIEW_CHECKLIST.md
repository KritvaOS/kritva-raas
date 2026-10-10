# F-M02-PROJECTS — Review Checklist

Milestone: F-M02 — Projects

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

    Unit
      |
      v
    Component
      |
      v
    API Integration
      |
      v
    Native Workspace Integration
      |
      v
    E2E
      |
      v
    Cross-Platform
      |
      v
    Acceptance

## 7.2 Project API Unit Tests

Test:

- request serialization;
- response parsing;
- validation;
- pagination;
- errors;
- authorization failures;
- conflict handling.

## 7.3 Project Component Tests

Test:

- project list;
- project cards/rows;
- creation form;
- metadata form;
- platform selector;
- KritvaOS selector;
- SDK selector;
- workspace control;
- empty state;
- error state.

## 7.4 Workspace Tests

Minimum scenarios:

1. valid empty directory;
2. valid existing project workspace;
3. nonexistent directory;
4. inaccessible directory;
5. selected file instead of directory;
6. workspace association persistence;
7. application restart;
8. workspace reassociation.

## 7.5 Platform Selection Tests

Test:

- platform loading;
- version loading;
- compatibility filtering;
- deprecated version;
- retired version;
- missing version;
- backend failure;
- stale selection.

## 7.6 Project Lifecycle Tests

Test:

    Create
      |
      v
    List
      |
      v
    Open
      |
      v
    Edit Metadata
      |
      v
    Change Target
      |
      v
    Close
      |
      v
    Reopen

## 7.7 Authorization Tests

Test each role:

- OWNER;
- ADMIN;
- MEMBER;
- VIEWER.

Verify both:

- UI behavior;
- backend authorization.

## 7.8 Source Privacy Tests

Network-level tests should verify that project operations do not transmit:

- source files;
- source text;
- compiler inputs;
- Git history;
- source maps;
- unrelated local files.

Only project metadata and explicitly authorized control information may cross
the API boundary.

## 7.9 E2E Test

Primary E2E scenario:

    Login
      |
      v
    Projects
      |
      v
    Create Project
      |
      v
    Select Workspace
      |
      v
    Select Platform
      |
      v
    Select KritvaOS
      |
      v
    Select SDK
      |
      v
    Create
      |
      v
    Open Project
      |
      v
    Verify Metadata
      |
      v
    Restart Studio
      |
      v
    Reopen Project

## 7.10 Cross-Platform Verification

P0:

- Linux x86_64;
- Windows x86_64.

Verify:

- workspace picker;
- filesystem permissions;
- path handling;
- project persistence;
- startup;
- navigation;
- project creation.

P1:

- macOS Apple Silicon.

## 7.11 Regression Verification

F-M01 regression must remain green:

- login;
- session;
- navigation;
- dashboard;
- settings;
- profile;
- theme;
- accessibility.

## 7.12 Performance Verification

Measure:

- Projects list load;
- project open;
- project creation;
- platform catalog load;
- workspace picker response.

The UI must remain responsive while network operations execute.

## 7.13 Coding-Agent Session Tests

Verify, with the mock provider and the first real provider:

- provider status handling (each status simulated);
- consent required, recorded, re-requested after a disclosure version change and withdrawn during a session;
- staging isolation of the working tree, accept per hunk, conflict on concurrent edit, reject, revert;
- fault injection: Studio killed during a session and during an apply, then recovered from the journal;
- isolation tier tests per supported OS (symlinks, traversal, hard links, reads outside the workspace);
- policy expiry and policy change during a session;
- cancellation during a running session;
- workspace-escape detection;
- environment inspection (no Kritva credentials);
- network capture during a session (no content to Kritva endpoints);
- normal project E2E flow with no provider installed.

---

# 8. Demo Script

## 8.1 Demo Objective

Demonstrate a complete authenticated project workflow from project discovery to
local workspace association and target platform configuration.

## 8.2 Demo Preparation

- [ ] F-M01 build is available.
- [ ] Backend project API is available or contract fixture is enabled.
- [ ] Test organization exists.
- [ ] Test user has project creation permission.
- [ ] At least one active platform exists.
- [ ] At least one supported KritvaOS version exists.
- [ ] At least one compatible SDK version exists.
- [ ] Test local workspace directory exists.

## 8.3 Step 1 — Login

Launch Studio and authenticate.

Expected:

- Dashboard appears;
- session is active;
- Projects navigation is available.

## 8.4 Step 2 — Open Projects

Navigate to Projects.

Expected:

- project list loads;
- existing authorized projects appear;
- empty state appears if none exist.

## 8.5 Step 3 — Create Project

Select Create Project.

Enter:

    Name: Vision Tracker
    Key: vision-tracker
    Description: Robotics vision application

Select a local workspace.

Expected:

- directory is validated;
- workspace is associated locally;
- no source content is uploaded.

## 8.6 Step 4 — Select Platform

Select the target platform.

Expected:

- platform list comes from the platform catalog;
- platform details are visible;
- unsupported/retired selections are unavailable.

## 8.7 Step 5 — Select KritvaOS

Select the compatible KritvaOS version.

Expected:

- available versions reflect platform compatibility;
- deprecated versions are clearly marked;
- invalid combinations cannot be submitted.

## 8.8 Step 6 — Select SDK

Select the compatible SDK version.

Expected:

- SDK options reflect platform/runtime compatibility;
- selected version is visible.

## 8.9 Step 7 — Create

Submit the project.

Expected:

- server creates the project;
- project ID is returned;
- Studio opens the Project Workspace;
- metadata matches the submitted values.

## 8.10 Step 8 — Reopen

Return to Projects and reopen the project.

Expected:

- project appears in the list;
- metadata is preserved;
- workspace association is restored;
- platform configuration is restored.

## 8.11 Step 9 — Restart

Close and reopen Studio.

Expected:

- authenticated session is restored according to policy;
- project workspace association remains;
- project can be reopened.

## 8.12 Step 10 — Demonstrate Privacy

Review network/test diagnostics.

Expected:

- project metadata requests contain no source files;
- source text is absent;
- local workspace remains local.

## 8.12a Step 11 — Agent-Assisted Change

Open the project, select the available provider, accept the disclosure, choose `PROPOSE`, and ask the agent to make a small change.

Expected:

- consent is requested before the first session;
- the diff is shown before anything is written;
- one hunk is accepted and one rejected;
- a manual edit before apply produces a conflict, not an overwrite;
- revert restores the pre-apply state;
- network diagnostics show no project content sent to Kritva.

## 8.13 Demo Success Criteria

The demo passes when:

- project can be created;
- project appears in list;
- project can be opened;
- local workspace persists;
- platform is selected;
- KritvaOS version is selected;
- SDK version is selected;
- metadata persists;
- an agent-assisted change is proposed, reviewed and reverted;
- privacy boundary remains intact.

---
