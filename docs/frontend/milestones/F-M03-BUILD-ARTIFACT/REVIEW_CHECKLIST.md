# F-M03-BUILD-ARTIFACT — Review Checklist

Milestone: F-M03 — Build & Artifact

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
    Native Integration
      |
      v
    Build Integration
      |
      v
    Artifact Validation
      |
      v
    Upload Integration
      |
      v
    E2E
      |
      v
    Security Qualification

## 7.2 Toolchain Tests

Test:

- installed tool;
- missing tool;
- unsupported version;
- invalid path;
- incompatible architecture;
- invalid SDK;
- stale tool cache.

## 7.3 Build Tests

Test:

1. successful build;
2. compiler error;
3. linker error;
4. missing dependency;
5. timeout;
6. cancellation;
7. child-process failure;
8. unexpected process termination;
9. output missing;
10. repeated build.

## 7.4 Test Runner Tests

Test:

- all pass;
- one failure;
- multiple failures;
- skipped test;
- timeout;
- cancellation;
- malformed test output.

## 7.5 Packaging Tests

Test:

- valid package;
- missing manifest;
- invalid manifest;
- missing entrypoint;
- prohibited file;
- duplicate file;
- path traversal;
- oversized file;
- oversized package;
- corrupted archive.

## 7.6 Manifest Tests

Verify:

- required fields;
- field types;
- version consistency;
- project ID;
- platform;
- architecture;
- KritvaOS;
- SDK;
- entrypoint;
- capability declaration.

## 7.7 Integrity Tests

Test:

    Original Artifact
          |
          v
        SHA-256
          |
          v
        Digest A

    Modified Artifact
          |
          v
        SHA-256
          |
          v
        Digest B

Expected:

    Digest A != Digest B

## 7.8 Signing Tests

Test:

- valid signature;
- invalid signature;
- wrong key;
- unknown key;
- revoked key;
- modified artifact;
- modified manifest;
- signature metadata corruption.

## 7.9 Privacy Tests

Create deliberately contaminated packages containing:

- `.git`;
- source files;
- source maps;
- private key;
- environment file;
- cloud credential;
- access token.

Expected:

    Privacy Scan
         |
         v
      FINDING
         |
         v
    Upload Blocked

## 7.10 Network Privacy Test

Run a complete build/upload workflow while monitoring network traffic.

Verify:

- source files never appear in request bodies;
- source text never appears in API requests;
- source archives are absent;
- `.krv` is the only artifact payload;
- diagnostics do not expose source content.

## 7.11 Upload Tests

Test:

- successful upload;
- interrupted upload;
- retry;
- cancellation;
- duplicate upload;
- checksum mismatch;
- unauthorized upload;
- expired upload session;
- server rejection.

## 7.12 E2E Test

Primary scenario:

    Login
      |
      v
    Open Project
      |
      v
    Detect Toolchain
      |
      v
    Build
      |
      v
    Test
      |
      v
    Package
      |
      v
    Validate
      |
      v
    Sign
      |
      v
    Upload
      |
      v
    Verify Artifact

## 7.13 Regression

F-M01/F-M02 regression must pass:

- login;
- session;
- navigation;
- projects;
- workspace;
- platform selection;
- settings.

## 7.14 Cross-Platform Verification

P0:

- Linux x86_64;
- Windows x86_64.

Verify:

- tool detection;
- path handling;
- process execution;
- cancellation;
- packaging;
- secure signing integration;
- upload.

## 7.15 Coding-Agent and MCP Tests

Verify:

- the contract suite for both providers;
- MCP catalogue enumeration matches the documented list exactly;
- negative tests for each forbidden operation;
- indirect prompt-injection fixtures in source, build logs, test output, instruction files and generated artifacts;
- malicious build-script fixture and resource exhaustion;
- approval invalidation when staging content changes;
- loopback token and replay rejection;
- per-call approval in `PROPOSE` mode;
- provenance flag set only when accepted agent changes exist;
- build-to-upload E2E still passes with no provider installed.

---

# 8. Demo Script

## 8.1 Demo Objective

Demonstrate the complete local build-to-signed-artifact-to-upload workflow while
proving that customer source remains local.

## 8.2 Preparation

- [ ] Authenticated test account.
- [ ] Project exists.
- [ ] Local workspace contains sample application.
- [ ] Required toolchain is installed.
- [ ] Compatible platform is available.
- [ ] KritvaOS version is available.
- [ ] SDK is available.
- [ ] Signing environment is configured.
- [ ] Upload endpoint is available.
- [ ] Network inspection is available.

## 8.3 Step 1 — Open Project

Open the F-M02 project.

Expected:

- workspace loads;
- platform is shown;
- KritvaOS version is shown;
- SDK version is shown.

## 8.4 Step 2 — Detect Toolchain

Select toolchain detection.

Expected:

- compiler found;
- SDK found;
- target architecture shown;
- compatibility status shown.

## 8.5 Step 3 — Configure Build

Select a standard development build profile.

Expected:

- configuration is visible;
- target is correct;
- no source upload occurs.

## 8.6 Step 4 — Build

Start the build.

Expected:

- state changes to BUILDING;
- logs stream;
- progress is visible where possible;
- build completes successfully.

## 8.7 Step 5 — Test

Run local tests.

Expected:

- test execution is local;
- results are shown;
- all required tests pass.

## 8.8 Step 6 — Package

Start packaging.

Expected:

- `.krv` is generated;
- package size is shown;
- manifest is generated.

## 8.9 Step 7 — Validate

Run artifact validation.

Expected:

- package structure valid;
- checksum valid;
- platform valid;
- runtime/SDK valid;
- privacy scan passes.

## 8.10 Step 8 — Sign

Sign the artifact.

Expected:

- signing succeeds;
- key identity is shown;
- private key is never exposed.

## 8.11 Step 9 — Inspect Artifact

Show:

- artifact name;
- version;
- project;
- platform;
- architecture;
- KritvaOS;
- SDK;
- digest;
- signature status.

## 8.12 Step 10 — Upload

Upload the artifact.

Expected:

- upload progress appears;
- only artifact data is transferred;
- server accepts the artifact;
- artifact ID is returned.

## 8.13 Step 11 — Privacy Evidence

Review network logs or automated test evidence.

Expected:

- no source file transmitted;
- no source text transmitted;
- no secret transmitted;
- artifact payload only.

## 8.14 Step 12 — Cancellation Demonstration

Start a second build and cancel it.

Expected:

- cancellation is visible;
- process terminates;
- build does not report success;
- user can restart.

## 8.14a Step 13 — Agent-Assisted Build

Ask a connected agent to fix a failing test, using MCP to run tests.

Expected:

- the agent's `kritva.test.run` call asks for approval;
- the change is reviewed and accepted;
- Studio's own build and tests pass;
- the build shows "agent-assisted";
- an agent attempt to sign or upload is refused because the tool does not exist.

## 8.15 Demo Success Criteria

The demo passes when:

- toolchain detection works;
- local build works;
- tests work;
- logs work;
- cancellation works;
- `.krv` is generated;
- manifest is valid;
- checksum is valid;
- signing succeeds;
- upload succeeds;
- an agent-assisted build is demonstrated with MCP approvals;
- source privacy is demonstrated.

---
