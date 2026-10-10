# F-M03-BUILD-ARTIFACT — Tasks

Milestone: F-M03 — Build & Artifact
Source of scope: [MILESTONE.md](MILESTONE.md)

# 5. Detailed Task Breakdown

## 5.1 Task Register

| ID | Description | Estimate | Owner Role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-FE-2-001 | Define build UI information architecture | 1.5d | UX/UI | F-M02 | [ ] |
| KR-FE-2-002 | Define build/artifact API contracts | 2.0d | Architect/Backend | F-M02 | [ ] |
| KR-FE-2-003 | Implement build configuration model | 2.0d | Frontend/Rust | 002 | [ ] |
| KR-FE-2-004 | Implement toolchain detector | 3.0d | Rust | F-M02 | [ ] |
| KR-FE-2-005 | Implement environment validator | 2.0d | Rust | 004 | [ ] |
| KR-FE-2-006 | Implement build process runner | 3.0d | Rust | 005 | [ ] |
| KR-FE-2-007 | Implement build cancellation | 1.5d | Rust | 006 | [ ] |
| KR-FE-2-008 | Implement build state machine | 2.0d | Rust/Frontend | 006,007 | [ ] |
| KR-FE-2-009 | Implement build log streaming | 2.0d | Rust/Frontend | 006 | [ ] |
| KR-FE-2-010 | Implement Build screen | 2.5d | Frontend | 003,008,009 | [ ] |
| KR-FE-2-011 | Implement local test runner | 2.5d | Rust | 006 | [ ] |
| KR-FE-2-012 | Implement test result model | 1.5d | Frontend/Rust | 011 | [ ] |
| KR-FE-2-013 | Implement package builder | 3.0d | Rust | 011 | [ ] |
| KR-FE-2-014 | Implement manifest generator | 2.0d | Rust | 013 | [ ] |
| KR-FE-2-015 | Implement checksum generator | 1.0d | Rust | 013 | [ ] |
| KR-FE-2-016 | Implement artifact validator | 2.5d | Rust/Security | 014,015 | [ ] |
| KR-FE-2-017 | Implement privacy scanner | 2.5d | Security/Rust | 013 | [ ] |
| KR-FE-2-018 | Implement signing interface | 2.5d | Security/Rust | 016,017 | [ ] |
| KR-FE-2-019 | Implement signature validation | 1.5d | Security/Rust | 018 | [ ] |
| KR-FE-2-020 | Implement artifact metadata UI | 2.0d | Frontend | 016,019 | [ ] |
| KR-FE-2-021 | Implement upload session API | 2.0d | Backend/Frontend | 002 | [ ] |
| KR-FE-2-022 | Implement artifact upload | 2.5d | Rust/Frontend | 021 | [ ] |
| KR-FE-2-023 | Implement upload progress/cancel/retry | 2.0d | Frontend/Rust | 022 | [ ] |
| KR-FE-2-024 | Implement server artifact registration | 2.0d | Backend | 021,022 | [ ] |
| KR-FE-2-025 | Add build unit/component tests | 2.5d | QA | 006-012 | [ ] |
| KR-FE-2-026 | Add packaging tests | 2.0d | QA/Security | 013-019 | [ ] |
| KR-FE-2-027 | Add source privacy network tests | 2.0d | Security/QA | 017,022 | [ ] |
| KR-FE-2-028 | Add upload integration tests | 2.0d | QA | 021-024 | [ ] |
| KR-FE-2-029 | Add E2E build-to-upload test | 2.5d | QA | 010-024 | [ ] |
| KR-FE-2-030 | Add cross-platform build verification | 2.0d | QA/DevOps | 004-023 | [ ] |
| KR-FE-2-031 | Update CI pipeline | 1.5d | DevOps | 025-030 | [ ] |
| KR-FE-2-032 | Complete documentation | 1.5d | Frontend/Docs | All | [ ] |
| KR-FE-2-033 | Conduct milestone review | 1.0d | Architect | All | [ ] |
| KR-CA-015 | Implement second provider adapter with compatibility matrix | 3.0d | Rust | F-M02 (KR-CA-008) | [ ] |
| KR-CA-016 | Implement local Kritva Studio MCP server (transport, session binding, audit log) | 3.0d | Rust | F-M01 (KR-CA-003) | [ ] |
| KR-CA-017 | Implement MCP tools: project.info, platform.describe, build.logs | 1.5d | Rust | KR-CA-016 | [ ] |
| KR-CA-018 | Implement MCP tools: build.run, test.run, artifact.package, artifact.validate with approvals | 2.5d | Rust | KR-CA-016 | [ ] |
| KR-CA-019 | Implement agent-to-build handoff UI and agent-assisted provenance | 1.5d | Frontend/Rust | KR-CA-018 | [ ] |
| KR-CA-020 | Add MCP negative tests and prompt-injection fixture | 2.0d | Security/QA | KR-CA-017, KR-CA-018 | [ ] |
| KR-CA-021 | Add two-provider contract and E2E tests | 2.0d | QA | KR-CA-015, KR-CA-019 | [ ] |
| KR-CA-039 | Publish MCP tool schemas; implement approval binding, loopback token and replay protection, output hygiene and the provenance hash registry | 3.0d | Rust/Security | KR-CA-016 to KR-CA-019 | [ ] |

Estimates are engineering-day estimates and must be refined during task
refinement.

## 5.2 Build Configuration

Build configuration should contain:

- project ID;
- local workspace;
- target platform;
- platform version;
- architecture;
- KritvaOS version;
- SDK version;
- build profile;
- test policy;
- artifact output policy.

The configuration must be validated before build execution.

## 5.3 Toolchain Detection Interface

Conceptual interface:

    ToolchainDetector.detect(projectContext)
        -> ToolchainReport

The report should contain:

- required tools;
- detected tools;
- versions;
- paths;
- target architecture;
- compatibility;
- missing requirements;
- warnings.

## 5.4 Build Runner Interface

Conceptual interface:

    BuildRunner.start(BuildConfiguration)
        -> BuildHandle

    BuildRunner.cancel(BuildHandle)
        -> CancellationResult

    BuildRunner.status(BuildHandle)
        -> BuildStatus

    BuildRunner.logs(BuildHandle)
        -> LogStream

The Rust layer owns process execution.

## 5.5 Test Runner Interface

Conceptual interface:

    TestRunner.run(TestConfiguration)
        -> TestRun

    TestRunner.cancel(TestRun)
        -> CancellationResult

The test runner must use the same project/toolchain context as the build unless
the project explicitly defines another test environment.

## 5.6 Package Builder Interface

Conceptual interface:

    PackageBuilder.package(BuildOutput, PackagePolicy)
        -> LocalArtifact

The package builder must operate entirely on local files.

## 5.7 Manifest Generator Interface

Conceptual interface:

    ManifestGenerator.generate(ProjectContext, BuildContext, ArtifactContents)
        -> Manifest

The manifest generator must not read more project data than necessary.

## 5.8 Validator Interface

Conceptual interface:

    ArtifactValidator.validate(LocalArtifact)
        -> ValidationReport

The report must distinguish:

- ERROR;
- WARNING;
- INFO.

Errors block signing/upload.

## 5.9 Privacy Scanner Interface

Conceptual interface:

    PrivacyScanner.scan(LocalArtifact)
        -> PrivacyReport

Critical findings block artifact release.

## 5.10 Signing Interface

Conceptual interface:

    ArtifactSigner.sign(LocalArtifact, SigningContext)
        -> SignedArtifact

The signing implementation must not expose private keys to React.

## 5.11 Upload Interface

Conceptual interface:

    ArtifactApi.createUploadSession(metadata)
        -> UploadSession

    ArtifactUploader.upload(UploadSession, LocalArtifact)
        -> UploadResult

    ArtifactApi.finalizeArtifact(uploadId, digest)
        -> ArtifactRecord

The server must independently verify the uploaded object.

---
