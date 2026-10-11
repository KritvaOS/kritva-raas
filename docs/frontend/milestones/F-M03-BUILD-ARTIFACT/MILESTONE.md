# F-M03 — Build & Artifact

## Milestone Dossier

**Milestone ID:** F-M03-BUILD-ARTIFACT  
**Product:** Kritva RaaS  
**Primary Phase:** P2 BUILD & ARTIFACT  
**Primary Surface:** RaaS Studio + Local Runtime  
**Technology:** Tauri + Rust + React + TypeScript + Local Toolchain  
**Priority:** PRI-1 (primary product path per Priority Matrix; see `planning/IMPLEMENTATION_ROADMAP.md` Section 5)  
**Status:** PLANNED  
**Primary Outcome:** A secure local build and artifact workflow that detects the
developer toolchain, builds and tests the project locally, produces a validated
`.krv` artifact, generates a manifest and checksum, signs the artifact, and
uploads only the packaged artifact without customer source code.

---

# 1. Objective

## 1.1 Milestone Objective

F-M03 establishes the complete local build-to-artifact boundary of Kritva RaaS.

The milestone transforms the Project Workspace established by F-M02 into a
developer workflow capable of producing a remotely executable artifact.

The primary workflow is:

    Project Workspace
          |
          v
    Toolchain Detection
          |
          v
    Build Configuration
          |
          v
    Local Build
          |
          v
    Local Tests
          |
          v
    Package
          |
          v
    Manifest Generation
          |
          v
    Integrity Checksum
          |
          v
    Security / Privacy Validation
          |
          v
    Artifact Signing
          |
          v
    .krv Artifact
          |
          v
    Upload Artifact Only
          |
          v
    Remote Artifact Record

The source remains on the developer machine throughout this workflow.

## 1.2 Product Intent

Kritva RaaS intentionally separates development from remote execution.

The developer builds locally.

The remote platform receives a controlled executable artifact.

The intended boundary is:

    +------------------------------------------------------+
    |                  Developer Machine                   |
    |                                                      |
    |  Source                                             |
    |    |                                                 |
    |    v                                                 |
    |  Local Runtime                                       |
    |    |                                                 |
    |    +--> Toolchain Detection                          |
    |    +--> Build                                       |
    |    +--> Test                                        |
    |    +--> Package                                     |
    |    +--> Manifest                                    |
    |    +--> Checksum                                    |
    |    +--> Privacy/Security Scan                        |
    |    +--> Sign                                        |
    |    |                                                 |
    |    v                                                 |
    |  .krv Artifact                                      |
    +-------------------------+----------------------------+
                              |
                              | artifact only
                              v
                     RaaS Control Plane
                              |
                              v
                         Object Storage

Source code must not cross this boundary as part of normal operation.

## 1.3 Primary Success Definition

F-M03 is successful when an authenticated developer can:

1. select an existing project;
2. inspect detected local toolchains;
3. verify platform/runtime/SDK compatibility;
4. configure a local build;
5. start a build;
6. observe live build logs;
7. cancel a running build safely;
8. run local tests;
9. inspect test results;
10. package a `.krv` artifact;
11. generate a complete manifest;
12. calculate integrity checksums;
13. validate artifact contents;
14. sign the artifact;
15. inspect artifact metadata;
16. upload only the artifact;
17. verify the server-side artifact record;
18. demonstrate that source code did not leave the developer machine.

## 1.4 Architectural Objective

The milestone establishes the following architecture:

    React UI
       |
       | typed command
       v
    Tauri IPC
       |
       v
    Rust Local Runtime
       |
       +--> Toolchain Detector
       +--> Build Orchestrator
       +--> Test Runner
       +--> Package Builder
       +--> Manifest Generator
       +--> Checksum Generator
       +--> Privacy Scanner
       +--> Artifact Validator
       +--> Signing Interface
       |
       v
    Local .krv Artifact
       |
       | upload artifact only
       v
    API Client
       |
       v
    Control Plane
       |
       v
    Object Storage

The React application is responsible for user interaction.

The Rust Local Runtime is responsible for privileged local operations.

The Control Plane remains authoritative for remote artifact identity,
authorization and persistence.

---

# 2. Scope and Non-Scope

## 2.1 In Scope

F-M03 includes:

- Build screen;
- build configuration;
- local toolchain detection;
- compiler detection;
- SDK detection;
- KritvaOS version detection/validation;
- target platform detection;
- architecture validation;
- build command orchestration;
- build environment validation;
- build logs;
- log streaming;
- log filtering;
- build cancellation;
- build result;
- local test execution;
- test logs;
- test summary;
- test failure reporting;
- artifact packaging;
- `.krv` format foundation;
- manifest generation;
- checksum generation;
- artifact content validation;
- source/privacy scanning;
- dependency/provenance metadata where available;
- artifact signing;
- signature validation;
- artifact upload;
- upload progress;
- upload cancellation;
- upload retry;
- server-side artifact registration;
- artifact metadata display;
- artifact status;
- artifact local retention;
- error recovery;
- automated tests;
- security verification;
- documentation;
- second coding-agent provider adapter (Section 2.6);
- Kritva Studio MCP server and its tool catalogue (Section 2.6);
- agent-to-build handoff and agent-assisted build provenance (Section 2.6).

## 2.2 Explicitly Out of Scope

F-M03 does not implement:

- remote robot execution;
- booking;
- credit consumption;
- physical robot control;
- live video;
- telemetry;
- Job creation;
- Run creation;
- result analysis;
- experiment comparison;
- source-code cloud synchronization;
- remote compilation;
- server-side source builds;
- complete artifact malware sandboxing;
- production artifact approval workflow;
- production robot deployment;
- fleet rollout;
- any MCP tool for signing, upload, booking, credits, Jobs, Runs or robot commands (never in scope; see Section 2.6).

Those functions belong to later milestones.

## 2.3 Local Build Principle

The build must execute locally.

The Control Plane must not receive:

- source files;
- source archives;
- compiler inputs;
- Git history;
- local build directories;
- source maps;
- unrequested dependency trees containing source content.

The remote system receives only the output explicitly approved by the artifact
packaging policy.

## 2.4 Artifact Boundary

The controlled boundary is:

    Source
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
    .krv
      |
      v
    Upload

The `.krv` artifact is the security and execution boundary.

## 2.5 Build Reproducibility

F-M03 should establish reproducible build foundations.

Where practical, the build records:

- toolchain version;
- compiler version;
- SDK version;
- KritvaOS target version;
- target architecture;
- build configuration;
- dependency versions;
- build timestamp;
- source revision identifier if locally available;
- artifact digest.

The source revision identifier must not require source upload.

## 2.6 Coding-Agent Build Integration and MCP Tools

F-M03 completes the coding-agent capability started in F-M02 PROJECTS. Architecture: `docs/architecture/CODING_AGENT_INTEGRATION.md` Sections 7 and 9. Decisions: SYS-ADR-007, FE-ADR-008, SEC-ADR-001.

Scope:

- **Second provider adapter.** Both Claude Code and OpenAI Codex are supported by F-M03 exit and pass the same contract suite.
- **Kritva Studio MCP server.** A local-only MCP server that connected agents can call, exposing exactly: `kritva.project.info`, `kritva.platform.describe`, `kritva.build.run`, `kritva.test.run`, `kritva.artifact.package` (unsigned), `kritva.artifact.validate` and `kritva.build.logs`. Tools call the same Rust build, test and artifact services as the UI, with the same validation. Each tool has a published JSON schema with size limits. Agents select only saved build profiles and test targets by ID; they cannot supply commands, flags, environment variables or paths. Runs execute in the session's staging workspace with the manual-build limits and network policy. `kritva.build.run`, `kritva.test.run` and `kritva.artifact.package` require user approval per call; an approval is bound to the request, its arguments and the staging content hash, and highlights changed build-definition files. Stdio transport is preferred; loopback requires a per-session token and rejects replays. `kritva.build.logs` reads only the current session's runs.
- **Handoff.** From a completed agent session, the user can run build and test directly. The agent's report of success is never shown as build success.
- **Provenance.** Studio keeps a registry of content hashes produced by applied change sets. A build is "agent-assisted", and the manifest sets `build_metadata.agent_assisted`, if and only if a build-input file currently has a registered hash (`docs/protocol/ARTIFACT_MANIFEST.md` Section 13). The flag is informational, not an attestation.

Invariants:

- Signing, upload, booking, credits, Jobs, Runs, robot commands, Control Plane mutations, out-of-workspace file access and generic shell execution MUST NOT be reachable through the MCP server.
- Agent-produced files receive no exemption from the privacy scan, allowlist, validation or signing.

---

# 3. Dependencies

## 3.1 Milestone Dependencies

F-M03 depends on:

- F-M01 Studio Foundation;
- F-M02 Projects;
- authentication;
- project metadata;
- local workspace association;
- platform catalog;
- KritvaOS version;
- SDK version;
- API client;
- Tauri/Rust IPC;
- shared UI components.

## 3.2 Documentation Dependencies

Primary references:

| Document | Relationship |
|---|---|
| `docs/frontend/milestones/F-M01-STUDIO-FOUNDATION/MILESTONE.md` | Studio foundation |
| `docs/frontend/milestones/F-M02-PROJECTS/MILESTONE.md` | Project workspace |
| `docs/ui/UI_SPECIFICATION.md` | Build/artifact UI |
| `docs/ui/UI_ACCEPTANCE_CRITERIA.md` | UI acceptance |
| `docs/ui/UI_REVIEW_CHECKLIST.md` | UI review |
| `docs/security/SOURCE_CODE_PRIVACY.md` | Source boundary |
| `docs/security/ARTIFACT_SECURITY.md` | Artifact security |
| `docs/security/KEY_MANAGEMENT.md` | Signing/key controls |
| `docs/security/SECRETS_MANAGEMENT.md` | Secret handling |
| `docs/protocol/ARTIFACT_MANIFEST.md` | Artifact contract |
| `planning/INTEGRATION_PLAN.md` | Integration |
| `docs/development/TESTING_STRATEGY.md` | Testing |
| `docs/database/schema/PROJECTS.md` | Project metadata |

## 3.3 Backend Dependencies

F-M03 depends on Control Plane capabilities for:

- artifact registration;
- artifact metadata;
- artifact upload authorization;
- upload session creation;
- checksum validation;
- artifact status;
- artifact ownership;
- artifact compatibility metadata.

## 3.4 Security Dependencies

F-M03 depends on:

- approved signing architecture;
- secure signing key handling;
- source privacy controls;
- artifact allowlist policy;
- prohibited-content policy;
- secret scanning;
- logging redaction.

Production signing keys must not be distributed to ordinary build workers or
stored in project workspaces.

## 3.5 Toolchain Dependencies

A project may require:

- compiler;
- linker;
- SDK;
- runtime;
- build system;
- package manager;
- target-specific tools;
- architecture-specific tools.

Toolchain detection must identify availability before build execution.

---

# 4. Deliverables

## 4.1 Primary Deliverables

F-M03 shall deliver:

1. Build screen;
2. build configuration;
3. toolchain detection;
4. environment validation;
5. local build orchestration;
6. live build logs;
7. build cancellation;
8. local test execution;
9. test results;
10. `.krv` package generation;
11. manifest generation;
12. checksum generation;
13. artifact validation;
14. privacy scanning;
15. artifact signing;
16. signature validation;
17. upload workflow;
18. upload progress;
19. upload retry/cancellation;
20. remote artifact registration;
21. artifact metadata display;
22. artifact lifecycle status;
23. build/test/artifact history foundation;
24. automated tests;
25. security/privacy verification;
26. second coding-agent provider adapter with contract-test evidence;
27. Kritva Studio MCP server with the documented tool catalogue;
28. agent-to-build handoff and `build_metadata.agent_assisted` provenance.

## 4.2 Build Screen

The Build screen should expose:

- project;
- target platform;
- KritvaOS version;
- SDK version;
- detected toolchain;
- build configuration;
- build action;
- test action;
- package action;
- current status;
- logs;
- test results;
- artifact status.

## 4.3 Build State

The local build lifecycle should support:

    IDLE
      |
      v
    DETECTING
      |
      v
    READY
      |
      v
    BUILDING
      |
      +----> CANCELLING
      |          |
      |          v
      |      CANCELLED
      |
      v
    BUILT
      |
      v
    TESTING
      |
      +----> TEST_FAILED
      |
      v
    TEST_PASSED
      |
      v
    PACKAGING
      |
      v
    VALIDATING
      |
      v
    SIGNING
      |
      v
    ARTIFACT_READY
      |
      v
    UPLOADING
      |
      +----> UPLOAD_FAILED
      |
      v
    UPLOADED

Failures must be explicit and recoverable.

## 4.4 Toolchain Detection

The toolchain detector should identify:

- executable path;
- tool name;
- version;
- target architecture;
- supported project requirements;
- availability;
- validation status.

Conceptual result:

    {
        "tool": "kritva-sdk",
        "version": "1.0.0",
        "path": "/opt/kritva/sdk",
        "architecture": "x86_64",
        "status": "AVAILABLE"
    }

The detector must not upload local environment information unless explicitly
required and approved.

## 4.5 Build Logs

Logs must support:

- timestamp;
- severity;
- process;
- phase;
- message;
- stream;
- correlation/build ID.

Example:

    10:21:01 INFO  DETECT  SDK 1.0.0 detected
    10:21:02 INFO  BUILD   Starting target
    10:21:04 INFO  BUILD   Compiling module
    10:21:10 WARN  BUILD   Warning
    10:21:15 INFO  BUILD   Build completed

Logs may contain source paths locally.

They must not be uploaded automatically unless the future remote diagnostic
policy explicitly permits sanitized log content.

## 4.6 Cancellation

Cancellation must:

1. signal the build process;
2. wait for controlled termination;
3. terminate child processes if required;
4. clean temporary build resources;
5. update build state;
6. preserve useful local logs;
7. avoid falsely reporting success.

Cancellation must be idempotent.

## 4.7 Local Tests

Tests run locally before packaging.

The Studio should display:

- total tests;
- passed;
- failed;
- skipped;
- duration;
- failure summary;
- log access.

A failed test should normally prevent artifact packaging unless the user has
an explicitly approved policy that allows packaging with failed tests.

## 4.8 Artifact Package

The `.krv` package is a controlled archive.

Conceptual structure:

    artifact.krv
      |
      +-- manifest.json
      +-- executable/
      +-- libraries/
      +-- resources/
      +-- runtime-config/
      +-- integrity/
      +-- signature/

Only approved content types may be included.

## 4.9 Manifest

The manifest should identify at least:

- artifact ID or local artifact identity;
- application name;
- application version;
- project ID;
- platform ID;
- platform version;
- architecture;
- KritvaOS version;
- SDK version;
- capabilities;
- entrypoint;
- artifact format version;
- checksum;
- signature metadata;
- build metadata.

Conceptual manifest:

    {
        "format_version": "1.0",
        "application": {
            "name": "vision-tracker",
            "version": "0.1.0"
        },
        "project_id": "project-001",
        "platform_id": "platform-001",
        "platform_version_id": "platform-version-001",
        "architecture": "x86_64",
        "kritva_os_version": "1.0",
        "sdk_version": "1.0",
        "entrypoint": "executable/main",
        "capabilities": [],
        "integrity": {
            "algorithm": "SHA-256",
            "digest": "..."
        },
        "signature": {
            "algorithm": "...",
            "key_id": "..."
        }
    }

The final manifest contract is governed by the protocol documentation.

## 4.10 Checksum

The artifact must have a cryptographic integrity digest.

SHA-256 is the baseline recommended algorithm unless the approved security
architecture specifies an equivalent stronger standard.

The digest must be calculated over a canonical artifact representation.

## 4.11 Artifact Validation

Validation includes:

- package structure;
- manifest presence;
- manifest syntax;
- required fields;
- entrypoint;
- platform;
- architecture;
- KritvaOS;
- SDK;
- capabilities;
- allowed files;
- prohibited files;
- checksum;
- signature;
- size limits;
- path traversal protection.

## 4.12 Privacy Validation

Before signing/uploading, the Local Runtime should scan the package for:

- source files;
- source maps;
- Git metadata;
- private keys;
- cloud credentials;
- access tokens;
- passwords;
- prohibited build inputs;
- unintended workspace files.

A privacy scan failure blocks upload.

## 4.13 Signing

Signing must use the approved key-management architecture.

The design must distinguish:

- development signing;
- test signing;
- production signing.

Production signing keys must not be stored in the project directory.

## 4.14 Upload

The upload path is:

    Local .krv
        |
        v
    Upload Authorization
        |
        v
    Upload Session
        |
        v
    Object Storage
        |
        v
    Artifact Registration
        |
        v
    Server Validation
        |
        v
    Artifact Record

No source file participates in this flow.

---

# 9. Risks

## 9.1 R-FM03-001 — Source Leakage

**Risk:** Source code or unintended workspace files enter the artifact or upload.

**Impact:** Critical.

**Mitigation:**

- strict package allowlist;
- privacy scanner;
- network inspection;
- security review;
- automated contamination tests.

## 9.2 R-FM03-002 — Signing Key Exposure

**Risk:** Private signing material becomes accessible to the Studio UI or
project workspace.

**Impact:** Critical.

**Mitigation:**

- controlled signing interface;
- OS secure storage for approved local keys;
- production signing service where required;
- no private key in project files;
- key management review.

## 9.3 R-FM03-003 — Toolchain Drift

**Risk:** Local toolchain differs from expected build environment.

**Impact:** High.

**Mitigation:**

- toolchain detection;
- version validation;
- manifest provenance;
- compatibility checks;
- documented supported toolchains.

## 9.4 R-FM03-004 — Non-Reproducible Builds

**Risk:** Same project produces inconsistent artifacts.

**Impact:** High.

**Mitigation:**

- pinned toolchains;
- dependency versions;
- recorded build metadata;
- deterministic packaging;
- reproducibility tests.

## 9.5 R-FM03-005 — Malformed Artifact

**Risk:** Invalid `.krv` reaches the Control Plane.

**Impact:** High.

**Mitigation:**

- local validation;
- server-side validation;
- schema validation;
- checksum;
- signature verification.

## 9.6 R-FM03-006 — Unsafe Artifact Contents

**Risk:** Artifact contains prohibited executable or configuration content.

**Impact:** Critical.

**Mitigation:**

- allowlist;
- prohibited-content scanner;
- capability validation;
- server-side security scanning;
- quarantine.

## 9.7 R-FM03-007 — Build Process Hang

**Risk:** Compiler or child process never exits.

**Impact:** Medium.

**Mitigation:**

- timeout;
- cancellation;
- process-tree management;
- resource cleanup.

## 9.8 R-FM03-008 — Log Leakage

**Risk:** Logs expose secrets or sensitive source information.

**Impact:** High.

**Mitigation:**

- local-first logs;
- secret redaction;
- upload policy;
- privacy testing.

## 9.9 R-FM03-009 — Upload Interruption

**Risk:** Network failure leaves ambiguous artifact state.

**Impact:** Medium.

**Mitigation:**

- upload session;
- checksums;
- idempotency;
- resumable/retry support;
- explicit server state.

## 9.10 R-FM03-010 — Artifact/Runtime Mismatch

**Risk:** Artifact targets incompatible KritvaOS, SDK or architecture.

**Impact:** High.

**Mitigation:**

- manifest;
- platform compatibility;
- local validation;
- server validation;
- later Lab Agent validation.

## 9.11 R-FM03-011 — Native Process Security

**Risk:** Build orchestration exposes unsafe arbitrary process execution.

**Impact:** Critical.

**Mitigation:**

- controlled process execution;
- validated commands;
- restricted environment;
- explicit project configuration;
- security review.

## 9.12 R-FM03-012 — Scope Expansion

**Risk:** F-M03 becomes a remote build or robot execution milestone.

**Impact:** Medium.

**Mitigation:**

- enforce local-only build scope;
- defer remote execution to later milestones;
- explicit milestone boundaries.

## 9.13 R-FM03-013 — Prompt Injection Through MCP Tools

**Risk:** Workspace content instructs the agent to use Studio tools to publish an artifact, spend credits or affect a robot.

**Mitigation:** The tool catalogue excludes all such operations; per-call approval for build, test and package; prompt-injection test fixture. Related: R-SEC-014, threat scenario AS-031.

## 9.14 R-FM03-014 — Agent Success Mistaken for Build Acceptance

**Risk:** Users treat the agent's claim of success as a passing build or a valid artifact.

**Mitigation:** Studio shows only its own build, test and validation results as status; the agent output is labelled as agent output.

---

# 10. Exit Criteria

## 10.1 Functional Exit

- [ ] Toolchain detection works.
- [ ] Environment validation works.
- [ ] Local build works.
- [ ] Build logs work.
- [ ] Build cancellation works.
- [ ] Local tests work.
- [ ] Test results work.
- [ ] `.krv` packaging works.
- [ ] Manifest generation works.
- [ ] Checksum generation works.
- [ ] Artifact validation works.
- [ ] Privacy scanning works.
- [ ] Signing works.
- [ ] Signature validation works.
- [ ] Upload works.
- [ ] Upload progress works.
- [ ] Upload cancellation/retry works.
- [ ] Both Claude Code and OpenAI Codex adapters pass the contract suite.
- [ ] The Kritva Studio MCP server exposes exactly the documented tool catalogue.
- [ ] Agent-to-build handoff and agent-assisted provenance work.

## 10.2 Source Privacy Exit

- [ ] Source is never uploaded.
- [ ] Source is not packaged unintentionally.
- [ ] Source maps are excluded.
- [ ] Git metadata is excluded.
- [ ] Secrets are excluded.
- [ ] Network privacy test passes.
- [ ] Security review passes.

## 10.3 Artifact Security Exit

- [ ] Manifest validates.
- [ ] Checksum validates.
- [ ] Signature validates.
- [ ] Package structure validates.
- [ ] Allowlist validates.
- [ ] Prohibited content is rejected.
- [ ] Server-side artifact registration validates.
- [ ] Signing and upload are unreachable through the MCP server.

## 10.4 Quality Exit

- [ ] Unit tests pass.
- [ ] Component tests pass.
- [ ] Integration tests pass.
- [ ] Packaging tests pass.
- [ ] Privacy tests pass.
- [ ] Upload tests pass.
- [ ] E2E workflow passes.
- [ ] Linux verification passes.
- [ ] Windows verification passes.
- [ ] CI passes.

## 10.5 Documentation Exit

- [ ] Build behavior is documented.
- [ ] Toolchain requirements are documented.
- [ ] `.krv` structure is documented.
- [ ] Manifest is documented.
- [ ] Signing is documented.
- [ ] Upload contract is documented.
- [ ] Source privacy behavior is documented.
- [ ] Acceptance evidence is recorded.
- [ ] Tracking documents are updated.

## 10.6 Review Exit

Required:

- [ ] Architecture review.
- [ ] Frontend implementation review.
- [ ] Rust/native review.
- [ ] Security review.
- [ ] Artifact security review.
- [ ] QA review.
- [ ] UX/UI review.
- [ ] Milestone owner acceptance.

## 10.7 Formal Status

The milestone follows:

    PLANNED
       |
       v
    READY
       |
       v
    IN_PROGRESS
       |
       v
    REVIEW
       |
       v
    QUALIFICATION
       |
       v
    ACCEPTED
       |
       v
    COMPLETE

`COMPLETE` requires evidence and tracking updates.

---
