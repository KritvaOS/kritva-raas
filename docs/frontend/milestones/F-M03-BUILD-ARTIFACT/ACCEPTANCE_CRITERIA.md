# F-M03-BUILD-ARTIFACT — Acceptance Criteria

Milestone: F-M03 — Build & Artifact

# 6. Acceptance Criteria

## 6.1 Build Preparation

- [ ] Project can be selected.
- [ ] Project configuration loads.
- [ ] Target platform is shown.
- [ ] KritvaOS version is shown.
- [ ] SDK version is shown.
- [ ] Architecture is shown.
- [ ] Toolchain detection can be started.
- [ ] Missing tools are clearly identified.
- [ ] Incompatible toolchains are clearly identified.
- [ ] Build cannot start when mandatory prerequisites are missing.
- [ ] User can refresh toolchain detection.

## 6.2 Toolchain Detection

- [ ] Required compiler is detected.
- [ ] Required SDK is detected.
- [ ] Required build tools are detected.
- [ ] Tool versions are captured.
- [ ] Tool paths are handled locally.
- [ ] Target architecture is detected.
- [ ] Version incompatibilities are reported.
- [ ] Missing tools are actionable.
- [ ] Detection does not upload source.
- [ ] Detection does not upload secrets.
- [ ] Detection errors are recoverable.

## 6.3 Build Execution

- [ ] Build can be started.
- [ ] Build status is visible.
- [ ] Build progress is visible where measurable.
- [ ] Build logs stream to the UI.
- [ ] Build logs remain locally controlled.
- [ ] Build completion is detected.
- [ ] Build failure is detected.
- [ ] Build exit code is recorded.
- [ ] Build duration is recorded.
- [ ] Build output is identified.
- [ ] Build failure does not produce false success.

## 6.4 Cancellation

- [ ] Running build can be cancelled.
- [ ] Cancellation is acknowledged.
- [ ] Child processes are handled.
- [ ] Temporary resources are cleaned.
- [ ] Build state becomes CANCELLED.
- [ ] Cancellation does not report success.
- [ ] Repeated cancellation is safe.
- [ ] User can start a new build after cancellation.

## 6.5 Local Tests

- [ ] Tests can run locally.
- [ ] Test progress is visible.
- [ ] Test logs are available.
- [ ] Passed tests are reported.
- [ ] Failed tests are reported.
- [ ] Skipped tests are reported.
- [ ] Test duration is reported.
- [ ] Failed tests block packaging by default.
- [ ] Test cancellation is supported where applicable.
- [ ] Test output remains local unless explicitly approved.

## 6.6 Packaging

- [ ] Packaging runs locally.
- [ ] `.krv` is generated.
- [ ] Package structure is valid.
- [ ] Required manifest exists.
- [ ] Executable entrypoint exists.
- [ ] Required libraries/resources are present.
- [ ] Prohibited content is rejected.
- [ ] Path traversal is rejected.
- [ ] Package size policy is enforced.
- [ ] Packaging does not include unrelated workspace files.

## 6.7 Manifest

- [ ] Manifest is generated.
- [ ] Format version is present.
- [ ] Application identity is present.
- [ ] Project ID is present.
- [ ] Platform ID is present.
- [ ] Platform version is present.
- [ ] Architecture is present.
- [ ] KritvaOS version is present.
- [ ] SDK version is present.
- [ ] Entrypoint is present.
- [ ] Capabilities are represented.
- [ ] Integrity information is present.
- [ ] Signature information is represented after signing.
- [ ] Manifest validates against the approved contract.

## 6.8 Checksum

- [ ] Cryptographic digest is generated.
- [ ] Algorithm is identified.
- [ ] Digest covers the canonical artifact.
- [ ] Digest is embedded/referenced correctly.
- [ ] Digest is independently reproducible.
- [ ] Modified artifacts fail integrity validation.

## 6.9 Validation

- [ ] Package structure is validated.
- [ ] Manifest is validated.
- [ ] Required files are validated.
- [ ] Entrypoint is validated.
- [ ] Platform is validated.
- [ ] Architecture is validated.
- [ ] KritvaOS compatibility is validated.
- [ ] SDK compatibility is validated.
- [ ] Capabilities are validated.
- [ ] File allowlist is validated.
- [ ] Prohibited content is detected.
- [ ] Checksum is validated.
- [ ] Signature is validated when present.
- [ ] Validation errors block upload.

## 6.10 Privacy Scan

- [ ] Source files are scanned for accidental inclusion.
- [ ] Source maps are scanned.
- [ ] Git metadata is scanned.
- [ ] Private keys are scanned.
- [ ] Access tokens are scanned.
- [ ] Cloud credentials are scanned.
- [ ] Passwords/secrets are scanned.
- [ ] Privacy failures block upload.
- [ ] Privacy scan results are visible to the developer.
- [ ] Privacy scan does not transmit source.

## 6.11 Signing

- [ ] Signing is explicit.
- [ ] Signing occurs only after validation.
- [ ] Production private keys are not exposed to the UI.
- [ ] Signing credentials are not stored in the project.
- [ ] Signature metadata is included in the artifact.
- [ ] Signature can be independently verified.
- [ ] Invalid signatures block upload.
- [ ] Signing failures are recoverable.
- [ ] Key identity is recorded without exposing private material.

## 6.12 Upload

- [ ] Upload authorization is requested.
- [ ] Upload session is created.
- [ ] Only `.krv` artifact data is uploaded.
- [ ] Upload progress is visible.
- [ ] Upload can be cancelled.
- [ ] Upload can be retried safely.
- [ ] Upload checksum is verified.
- [ ] Server registers the artifact.
- [ ] Artifact ownership is correct.
- [ ] Artifact metadata is correct.
- [ ] Server-side artifact validation is respected.
- [ ] Source files are not uploaded.

## 6.13 UI

- [ ] Build screen is accessible.
- [ ] Build state is clear.
- [ ] Logs are readable.
- [ ] Errors are actionable.
- [ ] Test results are understandable.
- [ ] Artifact metadata is understandable.
- [ ] Upload state is clear.
- [ ] Light theme works.
- [ ] Dark theme works.
- [ ] Keyboard navigation works.

## 6.14 Security

- [ ] Source privacy tests pass.
- [ ] Secret scanning passes.
- [ ] Artifact validation passes.
- [ ] Signing review passes.
- [ ] IPC security review passes.
- [ ] Upload authorization is enforced.
- [ ] Tenant/project ownership is enforced.
- [ ] Sensitive logs are redacted.
- [ ] Production signing material is protected.

## 6.15 Quality

- [ ] Unit tests pass.
- [ ] Component tests pass.
- [ ] Integration tests pass.
- [ ] Packaging tests pass.
- [ ] Privacy tests pass.
- [ ] Upload tests pass.
- [ ] E2E build-to-upload passes.
- [ ] Linux verification passes.
- [ ] Windows verification passes.
- [ ] CI passes.

## 6.16 Coding-Agent Build Integration and MCP Tools

- [ ] Claude Code and OpenAI Codex adapters both pass the adapter contract suite for their supported CLI versions.
- [ ] The MCP server is local-only and bound to a single session.
- [ ] The MCP server exposes exactly the documented tool catalogue.
- [ ] Signing, upload, booking, credit, Job, Run, robot, Control Plane mutation, out-of-workspace file and generic shell operations are unreachable through MCP.
- [ ] Every tool has a published schema; unknown fields and oversize inputs are rejected.
- [ ] Agents can select only saved build profiles and test targets; commands, flags, environment variables and paths cannot be supplied.
- [ ] Build, test and package runs execute in the staging workspace with manual-build limits; outputs stay in the staging build-output directory; symlinked outputs are rejected.
- [ ] `kritva.build.run`, `kritva.test.run` and `kritva.artifact.package` require per-call approval bound to request, arguments and staging content hash; changed build-definition files are highlighted.
- [ ] Loopback transport (where used) requires the per-session token and rejects replays.
- [ ] `kritva.build.logs` cannot read other sessions or projects; outputs are bounded and redacted.
- [ ] MCP tools apply the same validation as the UI paths.
- [ ] Every MCP tool call is logged locally with tool, argument summary, outcome and duration.
- [ ] The prompt-injection fixture cannot trigger signing, upload, booking or robot commands.
- [ ] Agent-reported success is never shown as build, test or validation success.
- [ ] `build_metadata.agent_assisted` is set if and only if a build-input file has a hash registered by an applied change set; manual edits, reverts and branch switches change the result deterministically.
- [ ] Agent-produced files receive no privacy-scan, allowlist or validation exemption.

---

