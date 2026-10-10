# P2 BUILD & ARTIFACT — Milestone Dossier

**Primary Phase:** P2 BUILD & ARTIFACT  
**Supporting Phases:** P0 FOUNDATION; P1 STUDIO; P3 CONTROL PLANE; P4 BOOKING & COMMERCIAL; P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS; P8 PRODUCTION  
**Document Type:** Phase milestone dossier  
**Document Path:** `docs/milestones/PHASE-2-BUILD-ARTIFACT/MILESTONE.md`  
**Status:** Planning baseline  
**Scope Focus:** Local build execution and creation of a versioned `.krv` artifact without uploading source code.

## Ownership and Boundaries

This document defines the objective, scope, dependencies, deliverables, risks, and exit criteria for **P2 BUILD & ARTIFACT**. Its focus is the local build workflow and production of a `.krv` artifact while keeping source code on the user's local environment.

The following sibling files are authoritative for their respective purposes:

- `TASKS.md` — task inventory, task identifiers, dependencies, implementation order, and task ownership.
- `ACCEPTANCE_CRITERIA.md` — detailed acceptance requirements and evidence expectations.
- `REVIEW_CHECKLIST.md` — implementation, security, and integration review checks.
- `CHANGELOG.md` — recorded changes associated with the phase.
- `GIT_COMMIT_STEP.md` — prescribed commit, verification, and repository-recording steps.

These files MUST be maintained separately. This dossier MUST link to them rather than duplicate their contents.

Other documentation owns the following concerns:

| Concern | Authoritative owner |
|---|---|
| Canonical phase definitions | `docs/planning/PHASES.md` |
| System-level architecture and decisions | Applicable documents under `docs/architecture/` and `docs/planning/DECISIONS.md` |
| Frontend implementation architecture | Applicable documents under `docs/frontend/architecture/` |
| Desktop Studio foundation | `docs/milestones/PHASE-1-STUDIO/MILESTONE.md` and applicable frontend documentation |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| API, event, and artifact wire contracts | Applicable authoritative documents under `docs/protocol/` |
| Database architecture and persistence | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Cloud architecture and infrastructure | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Application security and trust boundaries | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Cloud infrastructure security | `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` |
| Global development setup | `docs/development/DEVELOPMENT_SETUP.md` |
| Global development workflow | Applicable documents under `docs/development/` |
| Global testing strategy | `docs/development/TESTING_STRATEGY.md` |
| Global release policy | `docs/development/RELEASE_PROCESS.md` |
| Frontend development and testing | Applicable documents under `docs/frontend/development/` |
| Backend build and testing procedures | Applicable documents under `docs/backend/development/` |
| Backend artifact implementation and persistence | Applicable backend architecture and implementation documents |
| Frontend milestone scope and acceptance | Authoritative dossiers under `docs/frontend/milestones/` |
| Backend milestone scope and acceptance | Authoritative dossiers under `docs/backend/milestones/` |
| Database milestone scope and acceptance | Authoritative dossiers under `docs/database/milestones/` |
| Cloud milestone scope and acceptance | Authoritative dossiers under `docs/cloud/milestones/` |
| Other phase and milestone scope | Applicable authoritative dossiers under `docs/**/milestones/` |

This dossier owns phase-level outcomes for local build and `.krv` artifact creation. It does not own the complete build engine architecture, all backend artifact lifecycle services, global security policy, cloud deployment, or downstream milestone acceptance.

---

# 1. Objective

## 1.1 Primary Objective

P2 BUILD & ARTIFACT establishes a repeatable local build workflow that transforms user-selected project inputs into a versioned `.krv` artifact without uploading source code to a remote service.

The phase must establish a clear and testable path from local project selection through build execution, result reporting, and artifact creation.

The central requirement is that source code remains under the user's local control during the defined build workflow. The design MUST NOT require source upload to a cloud service or remote build worker to create the initial `.krv` artifact.

Any future remote processing capability requires a separate, explicit architecture and security decision. It MUST NOT be introduced implicitly into this phase.

## 1.2 Intended Outcomes

P2 BUILD & ARTIFACT aims to establish:

1. A local build invocation path suitable for the supported project types.
2. A defined boundary between the Studio UI and local build execution.
3. A predictable build lifecycle with observable status and errors.
4. A versioned `.krv` artifact format with an authoritative contract.
5. Deterministic identification of build inputs and relevant toolchain information.
6. Artifact validation before an output is declared successful.
7. Safe handling of local paths, temporary files, and build outputs.
8. A clear separation between source inputs and generated artifacts.
9. Repeatable local build and artifact verification.
10. A documented foundation for later backend integration without requiring source upload.

The actual supported project types, artifact schema, and detailed task sequence are defined by the authoritative contract, architecture, and sibling phase files.

## 1.3 Local-First Build Principle

The local build workflow MUST execute on the user's machine or another explicitly approved local execution environment under the user's control.

For this phase, the standard build path MUST NOT upload source files, source archives, generated intermediate files containing source, or equivalent project contents to a remote build service.

Network use for unrelated, explicitly configured dependency retrieval is not automatically equivalent to source upload. However, the implementation MUST make such network dependencies identifiable and MUST NOT silently transmit project source as part of dependency resolution or telemetry.

If the build requires dependencies that are not available locally, the workflow MUST follow its documented dependency policy and clearly report when it cannot proceed offline.

## 1.4 Artifact Objective

A successful local build MUST produce a `.krv` artifact that can be identified, inspected, and validated using the project's authoritative artifact contract.

The artifact MUST be distinguishable from source files, temporary build products, diagnostic logs, and incomplete outputs.

Artifact creation MUST have a well-defined success condition. A file existing at the expected path is not sufficient evidence that the artifact is valid.

## 1.5 User Experience Objective

The build experience SHOULD allow the user to understand:

- Which local project or inputs are being built.
- Which build operation is active.
- Whether the build is queued, running, successful, failed, or cancelled, as applicable.
- Where the artifact is written.
- Whether artifact validation passed.
- What action is needed after a failure.
- Whether a build depends on unavailable tools or dependencies.

The user interface MUST NOT imply that source code has been uploaded or that a remote build occurred when the operation was local.

## 1.6 Engineering Objective

The build workflow MUST be maintainable, testable, and separated from UI presentation logic.

The implementation SHOULD support:

- A defined build invocation interface.
- Explicit build configuration.
- Controlled process execution.
- Useful diagnostics.
- Artifact validation.
- Cancellation where supported by the underlying build process.
- Reliable cleanup of temporary resources.
- Reproducible build inputs.
- Automated validation of the build and artifact workflow.

Detailed implementation design remains owned by the applicable frontend and backend architecture documents.

## 1.7 Relationship to the Canonical Phase Model

P2 BUILD & ARTIFACT depends on the engineering and desktop foundations already established and provides a local build and artifact capability that later phases can extend.

| Phase | Canonical name | Relationship to P2 BUILD & ARTIFACT |
|---|---|---|
| P0 | FOUNDATION | Provides repository conventions, contracts, CI, and skeleton application foundations |
| P1 | STUDIO | Provides the desktop application shell and local integration boundary |
| P2 | BUILD & ARTIFACT | Establishes local build execution and `.krv` artifact creation |
| P3 | CONTROL PLANE | May add control-plane integration around artifact metadata and workflows |
| P4 | BOOKING & COMMERCIAL | May consume artifact identity in commercial workflows where applicable |
| P5 | EXECUTION | May use validated artifacts as inputs to execution workflows |
| P6 | LAB & ROBOT | May consume validated artifacts in lab and robot workflows |
| P7 | LIVE & RESULTS | May expose artifact-related status or results where applicable |
| P8 | PRODUCTION | May extend artifact handling under production operational requirements |

The table describes dependencies and possible integration points. It does not expand the P2 scope into later-phase functionality.

---

# 2. Scope and Non-Scope

## 2.1 In Scope

P2 BUILD & ARTIFACT covers the local build and `.krv` artifact workflow.

The scope includes:

- Local project and input selection.
- Local build invocation.
- A defined build execution boundary.
- Build configuration and validation.
- Build lifecycle reporting.
- Local process execution where required.
- Build logs and diagnostic reporting.
- Build cancellation where supported.
- Temporary directory and intermediate-output management.
- `.krv` artifact creation.
- Artifact manifest and metadata according to the authoritative contract.
- Artifact integrity validation.
- Atomic or otherwise safe publication of completed outputs.
- Local artifact location and identification.
- Automated build and artifact tests.
- Verification that source files are not uploaded during the defined workflow.
- Documentation of supported inputs, prerequisites, and limitations.
- Second coding-agent provider, the Kritva Studio MCP server and agent-assisted build provenance (F-M03 BUILD & ARTIFACT Section 2.6; KR-CA-015 to KR-CA-021, KR-CA-039).

The precise implementation assignments and acceptance conditions remain in the sibling files.

## 2.2 Local Project Inputs

The build workflow MUST identify the local project or inputs that form the basis of a build.

The implementation SHOULD define:

- How the user selects or identifies the project.
- Which input paths are permitted.
- How required project files are discovered.
- How invalid or incomplete inputs are reported.
- How the selected project identity is associated with the build.
- How the build determines which files are included.
- How path traversal and unintended file inclusion are prevented.

The exact project model and supported project formats are owned by the applicable architecture and contract documents.

## 2.3 Source Upload Prohibition

The standard P2 build path MUST NOT upload source code to a remote service.

This restriction applies to the source files and project contents consumed by the build, including source archives or equivalent representations.

The implementation MUST NOT silently:

- Send source files to a backend API.
- Package source and transmit it to a remote build worker.
- Upload source as a diagnostic attachment.
- Include source contents in telemetry.
- Include source contents in crash reports.
- Transmit source through an undocumented helper service.
- Treat source upload as an implicit fallback when local build execution fails.

If a feature would require source transmission, it is outside the approved P2 behavior and requires a separate explicit decision and security review.

## 2.4 Local Execution Boundary

The build operation MUST execute within the approved local environment.

The implementation SHOULD expose a clear interface between the desktop application and the component responsible for running the build.

That interface SHOULD identify:

- Build request inputs.
- Configuration parameters.
- Build identifier or correlation identifier.
- Progress and status reporting.
- Standard output and error handling.
- Cancellation behavior.
- Exit status.
- Artifact output location.
- Failure details.

The exact interface and process model belong to the relevant implementation architecture.

## 2.5 Build Toolchain

The build workflow MUST identify the toolchain required for each supported build type.

Where applicable, the implementation SHOULD validate:

- Tool availability.
- Supported tool versions.
- Required environment configuration.
- Required input files.
- Output directory permissions.
- Dependency availability.
- Compatibility between build configuration and selected inputs.

The workflow SHOULD fail early when a required tool or prerequisite is missing.

It MUST NOT report successful build completion when a required build process has failed.

## 2.6 Build Invocation

The application MUST provide a repeatable way to invoke a local build.

The invocation mechanism MAY use a command-line process, a local library, or another approved local execution interface.

The implementation MUST use the selected architecture rather than introduce an unreviewed alternative execution model.

The build invocation SHOULD ensure that:

- Inputs are passed safely.
- Paths are handled consistently.
- Environment variables are controlled.
- The working directory is explicit.
- Output and error streams are captured appropriately.
- Process termination is handled.
- Exit status is checked.
- Temporary resources are cleaned up safely.

Avoid constructing shell commands by concatenating untrusted user input.

## 2.7 Build Lifecycle

The build workflow SHOULD represent its lifecycle explicitly.

Relevant states may include:

- Not started.
- Preparing inputs.
- Running.
- Validating outputs.
- Succeeded.
- Failed.
- Cancelled.

The exact state model MUST follow the approved build interface and artifact workflow.

A transition to success MUST occur only after required build steps and artifact validation have completed successfully.

The UI MUST distinguish build execution from post-build artifact validation when both stages exist.

## 2.8 Build Cancellation

Where the underlying build process supports safe cancellation, the workflow SHOULD provide a controlled cancellation path.

Cancellation SHOULD:

- Identify the build being cancelled.
- Stop or signal the relevant local process according to the approved process model.
- Prevent an incomplete output from being presented as a valid artifact.
- Clean up temporary outputs where safe.
- Preserve useful diagnostic information.
- Report the final cancellation state.

The implementation MUST NOT claim that a process has stopped until its termination has been confirmed through the supported mechanism.

## 2.9 Build Logs and Diagnostics

The workflow MUST provide enough diagnostic information to understand build failures.

Where applicable, the implementation SHOULD capture:

- Build identity.
- Start and completion times.
- Relevant tool version.
- Sanitized command or invocation details.
- Exit status.
- Standard output and error output.
- Failed build stage.
- Artifact validation result.

Logs MUST NOT contain unnecessary sensitive values or source contents.

The implementation SHOULD avoid copying full source files into logs or error messages.

## 2.10 Temporary Files and Intermediate Outputs

The build workflow MUST distinguish temporary files from completed artifacts.

Temporary directories SHOULD have an identifiable lifecycle and ownership.

The implementation SHOULD:

- Create temporary outputs in a controlled location.
- Avoid overwriting unrelated user files.
- Clean up temporary resources after success or failure where safe.
- Preserve diagnostics when needed for failure investigation.
- Prevent concurrent builds from accidentally sharing mutable temporary paths.
- Avoid exposing partial output as a completed artifact.

Cleanup behavior MUST account for cancellation and process failure.

## 2.11 `.krv` Artifact Format

P2 MUST use an authoritative `.krv` artifact contract.

The contract MUST define the artifact structure and required metadata at the level needed to create and validate a valid artifact.

The contract SHOULD specify, as applicable:

- Format version.
- Artifact identity.
- Artifact type.
- Manifest structure.
- Required metadata.
- Included payloads.
- File naming and path rules.
- Integrity information.
- Compatibility expectations.
- Validation rules.
- Error handling for invalid artifacts.

The detailed schema belongs to the authoritative artifact contract under `docs/protocol/`.

This milestone MUST NOT create a competing schema in implementation code or duplicate the full format specification here.

## 2.12 Artifact Identity and Metadata

The generated artifact MUST have a stable way to identify its format version and relevant build metadata.

Where defined by the contract, metadata SHOULD identify:

- Artifact identifier.
- Artifact format version.
- Build configuration.
- Relevant toolchain version.
- Creation time.
- Input or project reference that does not expose source contents.
- Payload inventory.
- Integrity information.

The metadata MUST NOT contain source files or unintended sensitive values.

Exact required fields and serialization rules are owned by the artifact contract.

## 2.13 Artifact Validation

The workflow MUST validate the completed `.krv` artifact before reporting success.

Validation SHOULD include the checks required by the authoritative contract, such as:

- Container or archive structure.
- Required manifest presence.
- Format version recognition.
- Required metadata fields.
- Payload presence and consistency.
- Path safety.
- Integrity values where defined.
- Absence of incomplete or malformed output.

A successful build process MUST NOT override a failed artifact validation result.

## 2.14 Safe Artifact Publication

The output workflow MUST prevent incomplete artifacts from being mistaken for completed outputs.

Where supported, the implementation SHOULD write to a temporary location and publish the final artifact only after validation succeeds.

Publication SHOULD avoid silently overwriting unrelated artifacts.

If the destination already contains an artifact with the same intended identity, the implementation MUST follow an explicit conflict policy.

The artifact creation operation MUST report the final output location and result.

## 2.15 Artifact Storage Location

The phase MUST define how the user or application identifies the location of the generated artifact.

The output path SHOULD be explicit and consistent with the selected project and build configuration.

The workflow SHOULD handle:

- Missing output directories.
- Insufficient write permissions.
- Invalid destination paths.
- Existing output files.
- Insufficient storage.
- Partial output after failure.
- Cleanup of abandoned temporary artifacts.

The application MUST NOT silently place an artifact in an unexpected location.

## 2.16 Source and Artifact Separation

Source files and generated artifacts MUST remain distinguishable.

The build process SHOULD define which files are inputs, which are intermediate products, and which are final outputs.

The `.krv` artifact MUST NOT be treated as an upload of the original source project.

If the artifact format legitimately contains source-derived content, the exact included content MUST be defined by the artifact contract and made clear to the user. This does not authorize remote upload.

## 2.17 Dependency Retrieval

A local build may depend on tools, libraries, or other build dependencies.

The implementation MUST document whether dependencies are expected to be preinstalled, cached locally, or retrieved over a network.

Dependency retrieval MUST NOT be used as an undocumented route for transmitting project source.

Where network access is needed to retrieve dependencies, the workflow SHOULD identify the dependency source and report failures clearly.

Offline operation MUST be supported only to the extent actually provided by the toolchain and cached dependencies.

The phase MUST NOT claim fully offline operation unless it has been verified.

## 2.18 Build Reproducibility

The build workflow SHOULD make inputs and toolchain versions sufficiently identifiable to support repeatability.

Where the toolchain supports deterministic output, the implementation SHOULD preserve that property.

The project MUST distinguish deterministic output from a build that is merely repeatable under similar conditions.

If timestamps, random identifiers, or environment-specific values affect artifact bytes, the artifact contract and validation strategy SHOULD account for those fields.

The milestone does not require bit-for-bit reproducibility unless the approved acceptance criteria explicitly require it.

## 2.19 Local Security Boundaries

The build process MUST treat project paths, configuration values, and build parameters as potentially unsafe inputs.

The implementation SHOULD:

- Validate paths before access.
- Restrict operations to the intended project and output scope.
- Avoid unsafe shell interpolation.
- Prevent accidental traversal outside permitted directories.
- Limit permissions of temporary outputs where applicable.
- Avoid exposing sensitive environment variables in diagnostics.
- Keep remote transmission outside the standard source-processing path.

The security architecture and threat model remain owned by the relevant security documents.

## 2.20 Desktop Integration

The desktop Studio MAY provide the user interface for selecting inputs, invoking the build, showing progress, and locating the artifact.

The UI MUST communicate through the approved build execution boundary rather than embedding the complete build engine in presentation components.

The desktop application MUST distinguish local build status from backend service status.

A local build MUST NOT be shown as a remote job unless a separately approved remote execution path exists.

## 2.21 Backend Integration Boundary

The initial local build path MUST NOT depend on uploading source to the backend.

Backend services MAY later consume artifact metadata or validated artifacts through an explicitly defined contract where required by downstream work.

Such integration MUST preserve the source-upload prohibition for the standard P2 workflow.

The detailed backend service implementation and any later artifact persistence behavior remain owned by the backend architecture and relevant milestone dossiers.

## 2.22 Automated Validation

The build and artifact workflow MUST have automated checks appropriate to the implemented behavior.

The initial validation SHOULD cover:

- Build request validation.
- Missing-tool handling.
- Invalid project inputs.
- Build success and failure reporting.
- Cancellation behavior where supported.
- Artifact creation.
- Artifact manifest validation.
- Malformed artifact rejection.
- Output path conflicts.
- Temporary-file cleanup.
- Source-upload prohibition checks.

Testing procedures and global testing policy remain owned by the authoritative testing documents.

## 2.23 Explicit Non-Scope

The following are outside the direct scope of P2 BUILD & ARTIFACT:

- Remote source upload for build execution.
- Remote build workers requiring source transmission.
- A cloud compilation service.
- Complete backend artifact management services.
- Full artifact catalog and long-term artifact retention.
- Commercial licensing or billing for builds.
- Booking workflows.
- Execution scheduling and robot deployment.
- Lab hardware integration.
- Live operational monitoring.
- Complete production release and artifact distribution.
- A full compiler or toolchain implementation where the project only integrates an existing tool.
- General-purpose remote job orchestration.
- Product-wide account and workspace management.
- Complete production security certification.

These concerns belong to the applicable canonical phases and authoritative domain documents.

P2 may establish the local artifact contract and interfaces needed for future integration. It MUST NOT silently implement remote source transfer or claim the completion of downstream capabilities.

## 2.24 Scope Change Control

Any proposed addition to P2 scope SHOULD explain:

1. Why it is necessary for local build or `.krv` artifact creation.
2. Which deliverable it supports.
3. Whether it transmits source or source-derived project content.
4. Which domain owns the implementation.
5. Whether an authoritative contract already covers the behavior.
6. Whether it introduces remote infrastructure or additional security assumptions.
7. Whether it belongs in a later canonical phase.
8. How it changes the phase exit criteria.

Any proposal to transmit source MUST be treated as a material scope and security change, not as an implementation detail.

Scope changes MUST be reflected in the authoritative task and acceptance files.

---

# 3. Dependencies

## 3.1 Dependency Principles

P2 BUILD & ARTIFACT builds on the repository and desktop foundations established by P0 FOUNDATION and P1 STUDIO.

It depends on an agreed local execution model, an authoritative `.krv` contract, an available build toolchain, and a repeatable validation path.

Dependencies MUST be explicit so the build workflow does not silently introduce unsupported remote services or incompatible artifact structures.

Task-level dependency sequencing belongs in `TASKS.md`.

## 3.2 P0 FOUNDATION

P2 depends on the repository conventions, contract organization, CI, and engineering practices established in P0 FOUNDATION.

Relevant inputs include:

- Monorepo organization.
- Source and generated-output conventions.
- Contract ownership and validation.
- Build and test entry points.
- CI execution.
- Documentation discoverability.
- Review and change traceability.

P2 MUST use these foundations rather than introduce competing repository or contract structures.

## 3.3 P1 STUDIO

Where the desktop application provides the user interface for the build workflow, P2 depends on the desktop shell and native integration boundary established in P1 STUDIO.

Relevant inputs include:

- Application startup and configuration.
- UI-to-native communication.
- Error presentation.
- Local state conventions.
- Desktop build and test workflow.
- Application packaging foundation where needed for validation.

The P2 build implementation MUST preserve the ownership boundary established by the frontend architecture.

## 3.4 Build Toolchain

P2 depends on the toolchain required for each supported local build.

The toolchain MUST be identified and its prerequisites documented.

Where relevant, this includes:

- Executable or library availability.
- Supported version range.
- Runtime dependencies.
- Configuration requirements.
- Required input format.
- Output format.
- Exit-status semantics.
- Cancellation behavior.
- Known platform limitations.

The project MUST NOT claim support for a build type whose toolchain has not been identified and validated.

## 3.5 Local Execution Environment

The build execution component depends on the local environment having sufficient permissions and resources to perform the operation.

The implementation SHOULD account for:

- Filesystem access.
- Process creation permissions.
- Available disk space.
- Memory and CPU requirements.
- Temporary directory availability.
- Path encoding and platform differences.
- Operating-system restrictions.

The exact supported environments are defined by the approved implementation and validation records.

## 3.6 Artifact Contract

P2 depends on the authoritative `.krv` artifact contract.

The contract MUST define enough structure for the build implementation and validator to agree on a valid artifact.

If the contract is incomplete, the gap MUST be recorded and resolved by its owner.

The build implementation MUST NOT independently establish incompatible manifest fields or format-version behavior.

## 3.7 Protocol and Interface Definitions

Where the desktop UI, native runtime, and backend communicate across defined interfaces, P2 depends on their authoritative contracts.

The implementation MUST identify which interfaces are local-only and which cross process or service boundaries.

The build execution interface MUST NOT be confused with a remote backend job API.

## 3.8 Filesystem and Output Permissions

The build process depends on permission to read the intended project inputs and write the intended output location.

The workflow MUST handle permission failures explicitly.

It SHOULD avoid broad filesystem access where narrower access is sufficient.

Output paths MUST be validated before creating or replacing files.

## 3.9 Dependency Availability

A build may require third-party packages, compiler components, or other external dependencies.

P2 depends on a documented policy for obtaining those dependencies.

The workflow SHOULD distinguish missing dependencies from invalid project inputs and build failures.

Dependency retrieval MUST NOT transmit project source as an undocumented side effect.

## 3.10 CI Environment

CI MUST be able to execute the build and artifact validation checks required by the acceptance criteria.

Where a complete toolchain is too expensive or platform-specific for every CI run, the supported validation split MUST be explicit.

CI MUST NOT report artifact validation as successful if the validation step did not run.

## 3.11 Test Fixtures

The build and artifact validation workflow depends on suitable test inputs.

Fixtures SHOULD cover representative valid and invalid cases without including proprietary or sensitive source material.

Tests SHOULD be able to verify artifact structure and validation behavior independently from large production workloads.

The fixture inventory and detailed test strategy remain with the relevant testing documentation.

## 3.12 Security Guidance

P2 depends on the applicable security architecture for local filesystem access, process execution, configuration, logging, and network behavior.

The source-upload prohibition MUST be represented as an explicit design constraint and validated where practical.

Any proposed exception requires a separate, explicit decision and security review.

## 3.13 Desktop and Backend Ownership

The phase depends on clear ownership between:

- Frontend presentation and user interaction.
- Local build execution.
- Artifact contract definition.
- Backend artifact handling where later required.
- Cloud infrastructure where later required.
- Security policy and review.

Unresolved ownership MUST be recorded and assigned rather than resolved through duplicated implementations.

## 3.14 Dependency Matrix

| Dependency | Required contribution | Primary owner |
|---|---|---|
| P0 FOUNDATION | Repository conventions, contracts, CI, and validation foundations | Foundation owners |
| P1 STUDIO | Desktop shell and native integration boundary | Frontend |
| Build toolchain | Supported local build capability | Build implementation owner |
| Local execution environment | Process and filesystem capability | Desktop/runtime implementation owner |
| `.krv` artifact contract | Artifact structure, versioning, and validation rules | Protocol/artifact contract owner |
| Desktop build interface | Request, status, cancellation, and result semantics | Frontend and build owners |
| Backend interfaces | Authoritative API behavior where applicable | Backend and protocol owners |
| Filesystem permissions | Safe input and output access | Build implementation owner |
| Dependency policy | Approved dependency sources and retrieval behavior | Relevant domain owners |
| CI environment | Automated build and artifact validation | CI and infrastructure owners |
| Test fixtures | Valid and invalid build/artifact cases | Testing and build owners |
| Security guidance | Local execution, secret handling, and source-transfer constraints | Security owners |
| Documentation | Discoverable build and validation instructions | Documentation and domain owners |

The task inventory MUST identify the actual assigned owners and blocking dependencies.

## 3.15 Dependency Failure Handling

When a dependency blocks P2:

1. Identify the affected build or artifact outcome.
2. Record the missing tool, contract, permission, or environment.
3. Identify the authoritative owner.
4. Determine whether a safe local alternative exists.
5. Avoid transmitting source to a remote service as an undocumented workaround.
6. Update the task dependency record.
7. Reassess the effect on the exit criteria.

Any temporary workaround MUST be explicitly documented and MUST NOT be represented as the final supported workflow.

## 3.16 Cross-Phase Handoffs

P2 BUILD & ARTIFACT establishes a local build and validated artifact capability that subsequent phases may consume or extend.

| Phase | Canonical name | Expected P2 handoff |
|---|---|---|
| P0 | FOUNDATION | Repository, contract, and CI foundations consumed by the build workflow |
| P1 | STUDIO | Desktop shell and native boundary used to invoke local builds |
| P2 | BUILD & ARTIFACT | Local build execution and validated `.krv` artifact creation |
| P3 | CONTROL PLANE | A stable artifact identity and contract for later integration where applicable |
| P4 | BOOKING & COMMERCIAL | Artifact identity available for later commercial workflows where applicable |
| P5 | EXECUTION | Validated artifact available as an input to later execution workflows |
| P6 | LAB & ROBOT | Artifact contract available for later lab and robot integration |
| P7 | LIVE & RESULTS | Artifact identity and build outcome available for later result integration |
| P8 | PRODUCTION | A defined artifact format and validation basis for later production handling |

These handoffs do not make later-phase functionality part of P2 scope.

The authoritative milestone dossiers define downstream requirements and acceptance.

---

# 4. Deliverables

## 4.1 Deliverable Principles

P2 deliverables MUST be identifiable, reviewable, and verifiable.

A build command existing in the repository is not sufficient evidence that local builds work, and a `.krv` file existing on disk is not sufficient evidence that the artifact is valid.

Each deliverable MUST have a verification method recorded through the authoritative task and acceptance files.

## 4.2 Local Build Invocation

The implementation MUST provide a supported way to request a local build.

**Expected evidence:**

- The build invocation interface is identifiable.
- Inputs and configuration are validated.
- The selected local project is identifiable.
- The build executes through the approved local mechanism.
- The outcome is observable.
- Failures are reported clearly.
- The invocation does not require source upload.

## 4.3 Build Toolchain Validation

The workflow SHOULD validate the required build prerequisites before execution.

**Expected evidence:**

- Required tools and versions are identifiable.
- Missing prerequisites produce a clear failure.
- Invalid input paths are rejected safely.
- Output permissions are checked where practical.
- Toolchain failures are distinguished from artifact validation failures.
- Supported platform limitations are documented.

## 4.4 Build Lifecycle Reporting

The application MUST report the build lifecycle in a way consistent with the approved interface.

**Expected evidence:**

- Build initiation is observable.
- Running state is distinguishable from completion.
- Failure is distinguishable from success.
- Cancellation is reported where supported.
- Artifact validation is represented where it is a separate step.
- A successful state is reported only after required validation passes.

## 4.5 Build Process Management

Where the build uses a child process or equivalent execution mechanism, its lifecycle MUST be managed safely.

**Expected evidence:**

- Process creation uses validated inputs.
- Working directory and environment are controlled.
- Exit status is captured.
- Output and error streams are handled.
- Cancellation behavior is defined where supported.
- Temporary resources are cleaned up safely.
- Failed or terminated processes do not produce a falsely successful artifact.

## 4.6 Build Diagnostics

The workflow MUST provide relevant diagnostic information for failed builds.

**Expected evidence:**

- Build identity is available.
- The failing stage can be identified where practical.
- Exit status and relevant tool output are captured.
- Sensitive values are not exposed unnecessarily.
- Source files are not copied into diagnostics.
- The diagnostic record can be associated with the build attempt.

## 4.7 `.krv` Artifact Contract

The project MUST have an authoritative contract for the `.krv` artifact.

**Expected evidence:**

- The contract has an identifiable authoritative location.
- The format version is defined.
- Required manifest and metadata rules are documented.
- Payload and path constraints are explicit.
- Validation requirements are defined.
- Compatibility expectations are documented where required.
- Implementation code refers to the authoritative contract.

The full contract belongs in the relevant protocol documentation, not in this milestone dossier.

## 4.8 Artifact Creation

The local build workflow MUST create a `.krv` artifact for a successful supported build.

**Expected evidence:**

- The artifact is written to the intended location.
- The artifact follows the authoritative contract.
- Required metadata is present.
- Required payloads are included.
- The output is distinguishable from temporary files.
- Incomplete outputs are not reported as valid artifacts.
- The artifact can be validated independently.

## 4.9 Artifact Validation

The implementation MUST validate the generated artifact before declaring success.

**Expected evidence:**

- Required structure is checked.
- Required manifest fields are checked.
- The format version is recognized.
- Payload consistency is checked where required.
- Integrity validation is performed where defined by the contract.
- Malformed artifacts are rejected.
- Validation failures produce actionable diagnostics.

## 4.10 Safe Output Publication

The workflow MUST prevent partial or invalid artifacts from being presented as complete outputs.

**Expected evidence:**

- Temporary and final output locations are distinguishable.
- The final artifact is published only after required validation.
- Existing destination conflicts follow an explicit policy.
- Write failures are handled.
- Partial outputs are handled safely.
- The final output location is reported.

## 4.11 Source-Upload Prevention

The standard local build workflow MUST not upload project source to a remote build service.

**Expected evidence:**

- The build architecture identifies the local execution boundary.
- The standard build path contains no source-upload step.
- Diagnostic and telemetry paths do not silently include source contents.
- Build failures do not trigger an implicit remote-source fallback.
- Relevant tests, inspection, or network-boundary checks provide evidence for the claim.
- Any dependency network access is documented separately from source transfer.

The exact verification method is defined in the authoritative acceptance and review files.

## 4.12 Temporary Output Management

The workflow SHOULD manage intermediate files and temporary directories predictably.

**Expected evidence:**

- Temporary paths are controlled.
- Concurrent builds do not unintentionally overwrite each other's intermediates.
- Cleanup behavior is defined.
- Failure diagnostics can be preserved when needed.
- Abandoned partial artifacts can be identified.
- Cleanup does not remove unrelated user files.

## 4.13 Dependency and Offline Behavior

The build workflow MUST document its dependency assumptions.

**Expected evidence:**

- Required tools and dependencies are identifiable.
- Dependency retrieval behavior is documented.
- Missing dependencies produce a clear result.
- Source upload is not used as part of dependency retrieval.
- Offline capability is claimed only when validated.
- Network failures are distinguishable from source or build errors where practical.

## 4.14 Desktop Integration

The desktop application SHOULD provide a usable path to invoke the local build and inspect its result.

**Expected evidence:**

- The user can identify the selected build input.
- Build status is displayed accurately.
- Failures are represented clearly.
- The resulting artifact location is available.
- The UI invokes the approved local build interface.
- The UI does not claim remote execution or source upload.

## 4.15 Automated Test Foundation

The build and artifact workflow MUST have automated validation for the behavior required by P2.

**Expected evidence:**

- Valid and invalid inputs are exercised.
- Build success and failure paths are covered.
- Artifact creation and validation are tested.
- Output conflicts are handled.
- Cancellation is tested where supported.
- Temporary output handling is tested where practical.
- Source-upload restrictions are verified through the approved approach.
- CI reports the required test outcomes.

## 4.16 Documentation Entry Point

The build and artifact workflow MUST have discoverable instructions.

**Expected evidence:**

- Required tools and prerequisites are documented.
- The local build invocation is described.
- Supported input types are identified.
- Artifact output and validation behavior are described.
- Known limitations are visible.
- Relevant contract, architecture, testing, and development documents are linked.
- The P2 task and acceptance files are accessible.

## 4.17 Integration Demonstration

The phase SHOULD demonstrate the end-to-end local build path using a supported representative input.

**Expected evidence:**

- The input is selected or identified locally.
- The build executes through the supported local mechanism.
- The build result is observable.
- A `.krv` artifact is produced for a successful build.
- The artifact passes the authoritative validator.
- The artifact output location is reported.
- The source-upload prohibition is verified.
- Failure behavior is demonstrated through suitable negative tests.

## 4.18 Deliverable Ownership Matrix

| Deliverable | Primary owner | Supporting owners |
|---|---|---|
| Local build invocation | Build implementation owner | Frontend |
| Toolchain validation | Build implementation owner | Development tooling owners |
| Build lifecycle reporting | Build implementation owner | Frontend |
| Process management | Build/runtime implementation owner | Security |
| Build diagnostics | Build implementation owner | Frontend and testing |
| `.krv` artifact contract | Protocol/artifact contract owner | Frontend and backend |
| Artifact creation | Build implementation owner | Artifact contract owner |
| Artifact validation | Artifact contract and build owners | Testing |
| Safe output publication | Build implementation owner | Security |
| Source-upload prevention | Build and security owners | Frontend and testing |
| Temporary output management | Build implementation owner | Runtime owner |
| Dependency and offline behavior | Build implementation owner | Development tooling owners |
| Desktop integration | Frontend | Build implementation owner |
| Automated tests | Build and testing owners | Frontend and CI |
| Documentation entry point | Documentation owner | Build and frontend |
| Integration demonstration | Build implementation owner | Frontend, contract, and CI owners |

The task inventory MUST record actual assignments and dependencies. This matrix does not replace task ownership.

## 4.19 Deliverable Completion Rules

A deliverable is complete only when its implementation and verification evidence support the stated outcome.

The following states MUST remain distinguishable:

- Implemented and verified.
- Implemented but not verified.
- Blocked by a dependency.
- Intentionally deferred.
- Not applicable to the approved implementation.

An exception MUST be recorded in the authoritative task and acceptance files.

---

# 9. Risks

## 9.1 Risk Management Principles

P2 BUILD & ARTIFACT introduces a local execution workflow and a versioned artifact format. Failures in either can compromise reliability, user trust, or source confidentiality.

The risks below identify the principal categories relevant to this phase. Task-level mitigation assignments and review evidence belong in the authoritative task and review files.

## 9.2 Source Is Uploaded Unexpectedly

**Risk:** A build helper, telemetry mechanism, remote service, or fallback path transmits project source without explicit authorization.

**Impact:** Source confidentiality is compromised and the local-first requirement is violated.

**Mitigation:**

- Keep the standard build execution path local.
- Review network-capable components in the build path.
- Prevent source from being included in telemetry or diagnostic attachments.
- Avoid implicit remote fallbacks.
- Validate the behavior through the approved security and acceptance checks.

**Evidence:** The source-upload restriction is documented and supported by implementation and verification evidence.

## 9.3 Build Execution Uses Unsafe Inputs

**Risk:** User-controlled paths or parameters are passed unsafely to the build process.

**Impact:** Unintended commands may execute or files outside the intended project may be accessed.

**Mitigation:**

- Validate build inputs.
- Avoid unsafe shell interpolation.
- Use controlled process invocation.
- Validate paths and working directories.
- Restrict filesystem operations to the intended scope.

**Evidence:** Input validation and process invocation follow the approved implementation design.

## 9.4 Artifact Format Becomes Ambiguous

**Risk:** The build implementation and artifact validator use different assumptions about `.krv` structure.

**Impact:** Artifacts are unreadable, invalid, or incompatible with future consumers.

**Mitigation:**

- Maintain one authoritative artifact contract.
- Define format versioning and validation.
- Avoid duplicated schemas.
- Validate generated artifacts independently.
- Review contract changes with affected consumers.

**Evidence:** Artifact creation and validation follow the same authoritative contract.

## 9.5 Incomplete Artifacts Are Published

**Risk:** A failed or interrupted build leaves a partial file that is reported as successful.

**Impact:** Downstream consumers receive unusable or misleading artifacts.

**Mitigation:**

- Separate temporary and final output paths.
- Validate before publication.
- Check build exit status.
- Handle cancellation and write failures.
- Define output conflict behavior.

**Evidence:** Failure and cancellation tests demonstrate that incomplete artifacts are not reported as valid.

## 9.6 Build Success Is Reported Prematurely

**Risk:** The UI reports success before artifact validation completes.

**Impact:** Users attempt to use invalid outputs and cannot determine which stage failed.

**Mitigation:**

- Define build and validation states.
- Make the success transition conditional on required checks.
- Report validation failures explicitly.
- Test lifecycle transitions.

**Evidence:** The application reports success only after required build and artifact validation steps pass.

## 9.7 Toolchain Drift Causes Non-Reproducible Results

**Risk:** Different tool versions or environment settings produce incompatible build results.

**Impact:** Failures are difficult to reproduce and artifacts differ unexpectedly.

**Mitigation:**

- Document supported tool versions.
- Control dependencies where practical.
- Capture relevant build metadata.
- Use consistent CI and local commands.
- Distinguish deterministic output from best-effort repeatability.

**Evidence:** The build workflow identifies its relevant toolchain and configuration.

## 9.8 Dependency Retrieval Is Misunderstood

**Risk:** Network dependency retrieval is confused with offline operation or becomes an undocumented source-transfer path.

**Impact:** Builds fail unexpectedly, users misunderstand network requirements, or project data is transmitted.

**Mitigation:**

- Document dependency sources and retrieval behavior.
- Distinguish dependency downloads from source uploads.
- Do not transmit source as part of dependency resolution.
- Report missing dependencies clearly.
- Claim offline support only when validated.

**Evidence:** Network requirements and source-transfer constraints are explicit.

## 9.9 Temporary Files Leak Sensitive Data

**Risk:** Intermediate files contain sensitive source-derived content and remain in unexpected locations.

**Impact:** Local information is exposed to unintended users or processes.

**Mitigation:**

- Use controlled temporary locations.
- Define cleanup behavior.
- Restrict permissions where appropriate.
- Avoid logging source contents.
- Handle failures and cancellation safely.

**Evidence:** Temporary output behavior follows the approved security and cleanup requirements.

## 9.10 Concurrent Builds Interfere

**Risk:** Multiple build operations share mutable temporary paths or output names.

**Impact:** Artifacts are corrupted or build results are associated with the wrong request.

**Mitigation:**

- Assign unique build identities.
- Isolate temporary output locations.
- Define output conflict behavior.
- Avoid shared mutable intermediates.
- Test concurrency where the implementation supports concurrent builds.

**Evidence:** Concurrent operations do not silently overwrite each other's outputs.

## 9.11 Artifact Metadata Exposes Sensitive Information

**Risk:** Artifact metadata includes local paths, secrets, or unnecessary source-identifying details.

**Impact:** The artifact exposes information beyond the intended output contract.

**Mitigation:**

- Define metadata in the authoritative contract.
- Exclude secrets.
- Review source-derived metadata.
- Limit path disclosure.
- Validate metadata before publication.

**Evidence:** Generated metadata conforms to the contract and does not contain unintended sensitive values.

## 9.12 Filesystem Operations Affect Unrelated Data

**Risk:** Output cleanup or path handling deletes or overwrites files outside the intended build scope.

**Impact:** User data is lost or modified unexpectedly.

**Mitigation:**

- Validate input and output paths.
- Separate temporary and final outputs.
- Require explicit conflict handling.
- Avoid broad cleanup operations.
- Test failure and cleanup paths.

**Evidence:** Output handling is bounded to intended paths and preserves unrelated data.

## 9.13 Cancellation Leaves Orphaned Processes

**Risk:** A cancelled build leaves child processes running or temporary resources unmanaged.

**Impact:** Resource consumption continues and later builds may behave unpredictably.

**Mitigation:**

- Define cancellation semantics.
- Track the process or execution handle.
- Confirm termination where supported.
- Clean up temporary resources safely.
- Test cancellation under representative conditions.

**Evidence:** Cancellation results in an observable terminal state and appropriate cleanup.

## 9.14 Local Build Depends on Hidden Environment State

**Risk:** A build succeeds only because of undocumented local paths, installed tools, or environment variables.

**Impact:** Other contributors and CI cannot reproduce the build.

**Mitigation:**

- Document prerequisites.
- Validate tool availability.
- Control environment variables.
- Use explicit working directories.
- Exercise the documented workflow in CI.

**Evidence:** The supported build path can be reproduced using the documented prerequisites.

## 9.15 Artifact Validation Is Too Weak

**Risk:** The validator checks only that a file exists or has the expected extension.

**Impact:** Malformed artifacts are accepted as valid.

**Mitigation:**

- Validate against the authoritative contract.
- Check required manifest and payload structure.
- Reject unsupported format versions.
- Validate integrity information where defined.
- Include negative test cases.

**Evidence:** Invalid artifacts are rejected through automated validation.

## 9.16 Desktop and Build Boundaries Become Coupled

**Risk:** UI components contain build-engine logic or directly manipulate process and artifact internals.

**Impact:** The build workflow becomes difficult to test and maintain.

**Mitigation:**

- Use a defined build interface.
- Keep presentation logic separate from execution.
- Centralize process and artifact handling.
- Test the boundary independently.
- Follow the frontend and implementation architecture.

**Evidence:** UI code invokes the approved build interface rather than duplicating the build engine.

## 9.17 Artifact Consumers Expect Unsupported Compatibility

**Risk:** Later components assume a format or compatibility guarantee that P2 has not established.

**Impact:** Integration fails or consumers depend on undocumented artifact behavior.

**Mitigation:**

- Define the artifact version and compatibility expectations.
- Document unsupported assumptions.
- Keep the contract authoritative.
- Coordinate changes with affected consumers.
- Avoid claiming compatibility beyond the validated scope.

**Evidence:** Artifact versioning and limitations are documented in the contract.

## 9.18 Test Doubles Hide Real Build Failures

**Risk:** Mocked toolchain or artifact responses are used as the only evidence of build correctness.

**Impact:** The real process or packaging path fails after integration.

**Mitigation:**

- Distinguish unit tests from real build checks.
- Exercise the actual supported toolchain where required.
- Validate generated artifacts independently.
- Document environment limitations.
- Include representative integration evidence.

**Evidence:** Acceptance evidence identifies which real build and validation steps were executed.

## 9.19 Scope Expands into Remote Build Services

**Risk:** A remote build service is added to avoid local toolchain or resource limitations.

**Impact:** Source-transfer, security, infrastructure, and operational requirements enter the phase without review.

**Mitigation:**

- Keep the P2 standard path local.
- Treat source transmission as a material scope change.
- Require explicit architecture and security review for any proposed exception.
- Keep remote execution outside the approved behavior unless separately authorized.
- Preserve the local-source guarantee in tests and documentation.

**Evidence:** The approved implementation does not introduce an implicit remote-source build path.

## 9.20 Risk Disposition at Exit

Material P2 risks MUST be reviewed before phase exit.

Each material unresolved risk SHOULD have an identifiable owner and documented disposition.

The existence of a mitigation plan does not prove that a risk has been eliminated.

Residual risks MUST be assessed through the authoritative acceptance and review process.

---

# 10. Exit Criteria

## 10.1 Exit Principles

P2 BUILD & ARTIFACT is ready for formal exit consideration when the local build workflow operates through the supported path, valid `.krv` artifacts are produced and verified, and the source-upload prohibition is supported by evidence.

Exit MUST be based on demonstrated behavior rather than the existence of build scripts or output files alone.

The authoritative `ACCEPTANCE_CRITERIA.md` defines detailed acceptance requirements. `REVIEW_CHECKLIST.md` defines review checks. `TASKS.md` maintains task status, ownership, and dependencies.

This section states outcome-level exit conditions without duplicating those files.

## 10.2 Local Build Workflow

The supported local build workflow MUST be identifiable and executable.

Exit evidence MUST support the following outcomes:

- The supported input type is documented.
- Build prerequisites are identifiable.
- Build invocation uses the approved local mechanism.
- Inputs and configuration are validated.
- The build outcome is observable.
- Required build failures are reported.
- The workflow does not require source upload.
- The documented workflow matches the implementation.

## 10.3 Source-Upload Prohibition

The standard P2 build workflow MUST NOT upload project source to a remote build service.

Exit evidence MUST support the following outcomes:

- The build execution architecture is explicitly local.
- No source-upload step exists in the standard build path.
- No implicit remote-source fallback is triggered by local build failure.
- Diagnostic and telemetry paths do not silently transmit source contents.
- Network dependency retrieval is documented separately.
- Relevant implementation inspection and tests support the source-transfer restriction.
- Any limitation in the verification method is recorded.

The claim MUST be no broader than the evidence. If a component's network behavior has not been assessed, the phase MUST NOT assert that the component cannot transmit source.

## 10.4 Build Lifecycle and Process Management

The build lifecycle MUST be observable and correctly reported.

Exit evidence MUST support the following outcomes:

- Build initiation is observable.
- Running and terminal states are distinguishable.
- Exit status is checked.
- Failures are reported.
- Cancellation is handled where supported.
- Success is not reported before required validation finishes.
- Temporary resources are handled safely.

## 10.5 Artifact Contract

The `.krv` artifact contract MUST be authoritative and sufficiently defined for creation and validation.

Exit evidence MUST support the following outcomes:

- The contract location is discoverable.
- The format version is defined.
- Required manifest and metadata rules are explicit.
- Payload and path requirements are defined.
- Validation requirements are documented.
- Implementation code does not establish a competing schema.
- Known compatibility limitations are recorded.

## 10.6 Artifact Creation

The local build workflow MUST create a valid `.krv` artifact for a successful supported build.

Exit evidence MUST support the following outcomes:

- The artifact is written to the intended location.
- Required contract fields are present.
- Required payloads are included.
- The artifact can be identified.
- The artifact is distinguishable from temporary output.
- The resulting artifact passes validation.
- The final output location is reported.

## 10.7 Artifact Validation

The artifact validator MUST detect invalid outputs relevant to the authoritative contract.

Exit evidence MUST support the following outcomes:

- Required structure is validated.
- Required metadata is checked.
- Unsupported format versions are handled correctly.
- Malformed artifacts are rejected.
- Required integrity checks execute where specified.
- Validation failures are reported.
- Build success is conditional on required artifact validation.

## 10.8 Safe Output Handling

The build workflow MUST handle output paths and incomplete artifacts safely.

Exit evidence MUST support the following outcomes:

- Temporary and final output paths are distinguishable.
- Existing output conflicts follow an explicit policy.
- Write failures are handled.
- Incomplete artifacts are not published as valid outputs.
- Cleanup does not affect unrelated user files.
- Concurrent builds do not silently corrupt or replace one another's outputs where concurrency is supported.

## 10.9 Toolchain and Dependency Behavior

The supported toolchain and dependency assumptions MUST be documented.

Exit evidence MUST support the following outcomes:

- Required tools and versions are identifiable.
- Missing tools produce clear failures.
- Dependency retrieval behavior is documented.
- Source transfer is not an undocumented dependency side effect.
- Offline capability is claimed only when verified.
- Environment-specific limitations are explicit.

## 10.10 Desktop Integration

Where desktop integration is included, the UI MUST invoke the approved local build boundary and represent the outcome accurately.

Exit evidence MUST support the following outcomes:

- The user can identify the selected inputs.
- Build status is shown correctly.
- Failures are visible.
- Artifact location is available after successful creation.
- The UI distinguishes local build status from backend service status.
- Mocks and actual integrations are clearly distinguished.

## 10.11 Automated Validation and CI

The build and artifact workflow MUST have repeatable automated validation appropriate to the accepted scope.

Exit evidence MUST support the following outcomes:

- Valid and invalid inputs are exercised.
- Build success and failure paths are covered.
- Artifact creation and validation are tested.
- Required cleanup and output conflict behavior is tested.
- Cancellation is tested where supported.
- Source-upload restrictions are checked through the approved method.
- Required CI checks execute and report failures visibly.
- Unexecuted tests are not represented as passing.

The authoritative testing documents define the broader testing policy.

## 10.12 Documentation

The local build and artifact workflow MUST be discoverable and documented.

Exit evidence MUST support the following outcomes:

- Prerequisites and supported inputs are documented.
- The local invocation path is described.
- The `.krv` contract is linked.
- Artifact output and validation behavior are documented.
- Dependency and network assumptions are visible.
- Source-upload restrictions are explicit.
- Known limitations are recorded.
- Relevant development, testing, security, and architecture documents are linked.

## 10.13 Cross-Domain Ownership

P2 MUST preserve the boundaries between frontend, build execution, artifact contract, backend, database, cloud, and security responsibilities.

Exit evidence MUST support the following outcomes:

- The local build execution boundary is identifiable.
- The frontend does not own build-engine internals by accident.
- The artifact contract has an authoritative owner.
- Backend artifact handling remains with backend-owned implementation documents.
- Cloud infrastructure remains with cloud-owned documents.
- Security constraints remain with the security domain.
- Global testing and release policy are referenced rather than redefined.
- Unresolved cross-domain decisions are visible and assigned.

## 10.14 Risk Disposition

Material P2 risks MUST be reviewed before exit.

Exit evidence MUST support the following outcomes:

- Material risks are recorded.
- Risk ownership is identifiable.
- Required mitigations have been completed or residual risks assessed.
- Blocking dependencies are resolved or have an approved disposition.
- Known limitations are documented.
- Follow-up work is traceable to an authoritative task or planning record.

An undocumented blocker MUST NOT be treated as an accepted residual risk.

## 10.15 Cross-Phase Handoff Readiness

P2 MUST provide a local build and validated artifact foundation that subsequent phases can consume without depending on undocumented behavior.

| Phase | Canonical name | Handoff outcome |
|---|---|---|
| P0 | FOUNDATION | Build workflow follows repository and contract conventions |
| P1 | STUDIO | Desktop shell can invoke the local build boundary |
| P2 | BUILD & ARTIFACT | Local build and validated `.krv` artifact creation are demonstrated |
| P3 | CONTROL PLANE | Artifact identity and contract are available for approved integration |
| P4 | BOOKING & COMMERCIAL | Artifact identity can be referenced where required by approved workflows |
| P5 | EXECUTION | Validated artifact can be used as an input to approved execution workflows |
| P6 | LAB & ROBOT | Artifact contract is available for later lab and robot integration |
| P7 | LIVE & RESULTS | Build and artifact results can be referenced by later workflows where applicable |
| P8 | PRODUCTION | Artifact format and validation rules provide a basis for later production handling |

These outcomes indicate readiness of the P2 deliverables only. They do not establish acceptance of downstream functionality.

## 10.16 Formal Exit Review

Formal exit review MUST use the authoritative acceptance and review files.

The review SHOULD confirm:

1. The P2 objective has been met within the approved scope.
2. The local build workflow executes through the supported path.
3. The source-upload prohibition is supported by implementation and verification evidence.
4. The `.krv` artifact contract is authoritative and usable.
5. Successful builds produce artifacts that pass required validation.
6. Failure and cancellation behavior is handled as required.
7. Temporary outputs and destination conflicts are handled safely.
8. Required automated checks execute and report trustworthy results.
9. Documentation and ownership boundaries are clear.
10. Material risks and dependencies have been assessed.
11. Task-level acceptance evidence is complete or has an explicitly approved disposition.

This section does not replace the formal acceptance decision or its recorded evidence.

## 10.17 Exit Failure and Remediation

If an exit criterion is not satisfied:

1. Identify the unmet outcome.
2. Link it to the applicable task and acceptance criterion.
3. Record the missing or failed evidence.
4. Identify the responsible owner.
5. Determine whether the issue blocks phase exit.
6. Record the corrective action and required verification.
7. Reassess the criterion after remediation.

A documentation-only change MUST NOT be used to claim that an unverified build or artifact behavior is complete.

## 10.18 Exit Evidence Record

The authoritative phase files MUST provide traceable evidence for the exit decision.

Use the sibling files for their intended roles:

- `TASKS.md` — task inventory, dependencies, status, and ownership.
- `ACCEPTANCE_CRITERIA.md` — detailed acceptance requirements and evidence expectations.
- `REVIEW_CHECKLIST.md` — review checks and disposition.
- `CHANGELOG.md` — recorded phase changes.
- `GIT_COMMIT_STEP.md` — prescribed commit and repository-recording procedure.

This dossier SHOULD link to those files rather than duplicate their contents.

## 10.19 Completion Statement

P2 BUILD & ARTIFACT may be considered ready for formal exit when the required acceptance criteria are satisfied, the applicable review has been completed, the required evidence is recorded, and material residual risks have been assessed through the authorized process.

The phase establishes a repeatable local build workflow and a validated `.krv` artifact creation path without requiring source upload to a remote build service.

It does not declare the completion of any subsequent canonical phase or domain milestone.

Formal acceptance MUST be recorded through the authoritative phase acceptance and review process, with global governance requirements continuing to apply.
