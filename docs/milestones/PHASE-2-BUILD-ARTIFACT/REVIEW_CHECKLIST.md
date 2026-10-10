# PHASE-2-BUILD-ARTIFACT — Review Checklist

Milestone: PHASE-2-BUILD-ARTIFACT — Local Build and Secure `.krv` Artifact

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

### 7.1 Verification architecture

Testing shall follow:

    Source
      |
      v
    Toolchain
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
    Scan
      |
      v
    Sign
      |
      v
    Validate
      |
      v
    Upload
      |
      v
    Registry
      |
      v
    Privacy Verification

### 7.2 Build tests

Test:

- successful Debug;
- successful Release;
- compiler error;
- linker error;
- missing dependency;
- missing toolchain;
- target mismatch;
- cancellation;
- timeout;
- disk-space failure.

### 7.3 Deterministic packaging tests

Build identical source twice using controlled inputs.

Verify:

- deterministic manifest fields where expected;
- deterministic file ordering;
- equivalent package contents;
- defined treatment of build timestamp;
- reproducible digest when deterministic mode is enabled.

### 7.4 Manifest tests

Test:

- missing required field;
- invalid version;
- invalid architecture;
- invalid capability;
- invalid entrypoint;
- malformed JSON;
- unsupported artifact format.

Expected:

Artifact validation fails safely.

### 7.5 Privacy tests

Construct packages containing:

    main.cpp
    README.md
    .git/
    .env
    id_rsa
    source.map
    compiler.tmp

Verify prohibited content is detected.

Construct a valid runtime package.

Verify:

    SCAN = PASS

### 7.6 Secret tests

Insert test credentials into:

- environment files;
- configuration;
- text files;
- private key files.

Verify scanner detects them before upload.

### 7.7 Signature tests

Test:

- valid signature;
- invalid signature;
- modified artifact;
- modified manifest;
- missing signature;
- unsupported algorithm;
- revoked signer.

### 7.8 Compatibility tests

Test artifacts against:

- matching platform;
- wrong platform;
- matching architecture;
- wrong architecture;
- unsupported KritvaOS;
- unsupported SDK;
- missing capability;
- incompatible configuration.

### 7.9 Upload tests

Test:

- authenticated upload;
- unauthorized upload;
- cross-tenant upload;
- duplicate upload;
- interrupted upload;
- corrupted upload;
- checksum mismatch;
- server-side validation failure.

### 7.10 Source-isolation test

Monitor all Control Plane network requests during:

    project open
    build
    test
    package
    scan
    sign
    upload

Expected:

Only permitted artifact/metadata requests are observed.

### 7.11 Artifact inspection test

Inspect uploaded `.krv`.

Verify:

- source absent;
- Git metadata absent;
- secrets absent;
- manifest valid;
- signature valid;
- digest valid;
- expected executable present.

### 7.12 Tenant isolation test

Organization A uploads Artifact A.

Organization B attempts access.

Expected:

    A -> A = ALLOWED
    A -> B = DENIED
    B -> A = DENIED
    B -> B = ALLOWED

### 7.13 Failure recovery

Terminate build during:

- compile;
- link;
- test;
- package;
- upload.

Verify:

- temporary state cleaned;
- no false artifact success;
- incomplete artifacts are not APPROVED;
- retry behavior is safe.

### 7.14 Performance

Initial targets:

- toolchain detection p95 < 2 seconds after warm startup;
- local build performance is toolchain dependent;
- artifact manifest generation < 1 second for normal packages;
- local privacy scan throughput shall be benchmarked;
- upload metadata request p95 < 500 ms excluding artifact transfer;
- artifact registration p95 < 750 ms excluding object-storage transfer.

Targets shall be refined using real package sizes.

### 7.15 CI verification

CI shall execute:

- unit tests;
- packaging tests;
- contract tests;
- backend artifact tests;
- privacy regression tests;
- security scans;
- artifact validation tests.

CI shall not upload real customer artifacts.

### 7.16 Evidence

Required evidence:

- build test report;
- package inspection;
- privacy scan output;
- signature verification;
- upload integration test;
- source-isolation network capture;
- tenant-isolation test;
- compatibility test;
- CI run;
- architecture/security review.

---

## 8 Demo script

### 8.1 Demo objective

Demonstrate the complete local-source-to-artifact workflow and prove that only the resulting `.krv` artifact crosses the RaaS boundary.

### 8.2 Step 1 — Open project

Launch Studio.

Open:

    Demo Project

Select:

    Target Platform
    Target Platform Version
    Target Architecture
    KritvaOS Version
    SDK Version

### 8.3 Step 2 — Check toolchain

Open Build.

Expected:

    Toolchain = DETECTED
    Target = COMPATIBLE
    SDK = COMPATIBLE
    KritvaOS = COMPATIBLE

### 8.4 Step 3 — Configure build

Select:

    Profile = Release

Expected:

Build configuration is shown before execution.

### 8.5 Step 4 — Build locally

Start Build.

Expected:

    QUEUED
       |
       v
    BUILDING
       |
       v
    COMPLETED

Compiler output remains on the developer machine.

### 8.6 Step 5 — Run tests

Run local tests.

Expected:

    TESTS = PASS

If tests fail, artifact approval is blocked.

### 8.7 Step 6 — Package

Generate `.krv`.

Expected:

    demo-app-1.0.0.krv

### 8.8 Step 7 — Inspect package

Inspect package structure.

Expected:

    manifest.json
    executable/
    libraries/
    resources/
    runtime-config/
    integrity/
    signature/

No source files shall be present.

### 8.9 Step 8 — Privacy scan

Run scanner.

Expected:

    PRIVACY SCAN = PASS

### 8.10 Step 9 — Manifest

Display manifest.

Expected:

- application ID;
- version;
- platform;
- architecture;
- KritvaOS;
- SDK;
- entrypoint;
- capabilities;
- digest;
- signature.

### 8.11 Step 10 — Sign

Perform development signing.

Expected:

    SIGNATURE = VALID

### 8.12 Step 11 — Validate

Run complete artifact validation.

Expected:

    STRUCTURE = PASS
    MANIFEST = PASS
    DIGEST = PASS
    SIGNATURE = PASS
    COMPATIBILITY = PASS
    POLICY = PASS

### 8.13 Step 12 — Upload

Upload artifact.

Expected:

    UPLOAD = SUCCESS

### 8.14 Step 13 — Verify registry

Open Artifacts.

Expected:

Artifact appears with:

- version;
- status;
- digest;
- platform;
- architecture;
- signature status;
- validation status.

### 8.15 Step 14 — Demonstrate source privacy

Inspect network traffic.

Expected:

No source files or source content were transmitted.

### 8.16 Step 15 — Demonstrate rejection

Modify the artifact or introduce prohibited content.

Run validation.

Expected:

    VALIDATION = REJECTED

Artifact must not become APPROVED.

### 8.17 Step 16 — Demonstrate compatibility failure

Select an incompatible platform.

Expected:

    COMPATIBILITY = FAILED

Upload/approval is blocked.

### 8.18 Demo completion

The demo passes when:

> A local source tree is compiled and tested entirely on the developer machine, transformed into a signed `.krv` artifact, privacy-scanned and validated, and only the artifact and permitted metadata are uploaded to the Control Plane.

---
