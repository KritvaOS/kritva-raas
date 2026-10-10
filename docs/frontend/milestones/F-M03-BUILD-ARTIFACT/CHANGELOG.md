# F-M03-BUILD-ARTIFACT — Changelog

Milestone: F-M03 — Build & Artifact

# 11. Changelog

## Added

- Date:
- Change:
- Task:
- Author:
- Evidence:

## Changed

- Date:
- Change:
- Task:
- Author:
- Evidence:

## Fixed

- Date:
- Issue:
- Task:
- Author:
- Evidence:

## Removed

- Date:
- Change:
- Reason:
- Task:
- Author:
- Evidence:

## Notes

- Initial F-M03 milestone dossier.
- No implementation is implied by this document.
- F-M03 establishes local build and artifact generation.
- Remote execution is intentionally outside this milestone.
- Source code remains local.
- The `.krv` artifact is the controlled remote execution boundary.

---

# Appendix A — Phase Mapping

## A.1 Phase 0

F-M03 consumes Phase 0 foundations:

- Tauri;
- React;
- Rust;
- navigation;
- API client;
- UI system;
- CI;
- security scanning;
- development workflow.

## A.2 Phase 1

F-M03 consumes F-M02 project context:

- project ID;
- local workspace;
- platform;
- KritvaOS;
- SDK.

## A.3 Phase 2

F-M03 is a primary Phase 2 milestone.

Phase 2 establishes:

> A developer can turn a local project into a validated, signed `.krv`
> artifact without sending source code to the cloud.

## A.4 Phase 3

F-M03 provides the artifact consumed by:

- remote deployment;
- Job creation;
- Run execution;
- Lab Agent;
- Runtime.

## A.5 Phase 4

Artifact identity becomes associated with:

- booking;
- platform resource allocation;
- credit consumption.

## A.6 Phase 5

Artifacts are consumed by:

- simulation;
- Lab Agent;
- physical robots;
- HIL.

## A.7 Phase 6

Artifact security expands into:

- production signing;
- key rotation;
- revocation;
- quarantine;
- malware/security scanning;
- audit.

## A.8 Phase 7

Artifact infrastructure scales for:

- multiple platforms;
- larger artifact sizes;
- concurrent uploads;
- fleet deployment.

## A.9 Phase 8

Artifact lifecycle becomes part of:

- production release;
- customer support;
- rollback;
- revocation;
- production deployment.

---

# Appendix B — End-to-End Data Flow

## B.1 Local Build

    Project Metadata
          |
          v
    Local Workspace
          |
          v
    Toolchain Detection
          |
          v
    Environment Validation
          |
          v
    Build Runner
          |
          v
    Build Output
          |
          v
    Test Runner
          |
          v
    Test Results
          |
          v
    Package Builder
          |
          v
    Manifest
          |
          v
    Checksum
          |
          v
    Privacy Scan
          |
          v
    Artifact Validation
          |
          v
    Signing
          |
          v
    .krv

## B.2 Remote Upload

    .krv
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
    Server Integrity Check
      |
      v
    Server Signature Check
      |
      v
    Artifact Registration
      |
      v
    Artifact Record

## B.3 Explicitly Forbidden Flow

    Source
      |
      X
      |
      v
    Control Plane

The Studio must not implement this path.

---

# Appendix C — Artifact Lifecycle

The local artifact lifecycle is:

    CREATED
       |
       v
    PACKAGED
       |
       v
    SCANNED
       |
       v
    VALIDATED
       |
       v
    SIGNED
       |
       v
    READY
       |
       v
    UPLOADING
       |
       v
    UPLOADED

Failure states include:

- REJECTED;
- QUARANTINED;
- INVALID;
- SIGNING_FAILED;
- UPLOAD_FAILED;
- CANCELLED.

The remote artifact lifecycle may add:

- APPROVED;
- REVOKED;
- EXPIRED;
- ARCHIVED;
- PURGED.

---

# Appendix D — Build State Model

    IDLE
      |
      v
    DETECTING
      |
      +----> DETECTION_FAILED
      |
      v
    READY
      |
      v
    BUILDING
      |
      +----> BUILD_FAILED
      |
      +----> CANCELLING
      |          |
      |          v
      |       CANCELLED
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
      +----> INVALID
      |
      v
    SIGNING
      |
      +----> SIGNING_FAILED
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

---

# Appendix E — Artifact Security Boundary

    +-------------------------------------------------------+
    | Developer Machine                                    |
    |                                                       |
    | Source                                                 |
    |   |                                                   |
    |   v                                                   |
    | Build / Test                                          |
    |   |                                                   |
    |   v                                                   |
    | Package                                               |
    |   |                                                   |
    |   v                                                   |
    | Privacy Scan                                          |
    |   |                                                   |
    |   v                                                   |
    | Validate                                              |
    |   |                                                   |
    |   v                                                   |
    | Sign                                                  |
    |   |                                                   |
    |   v                                                   |
    | .krv                                                   |
    +---+---------------------------------------------------+
        |
        | only approved artifact
        v
    +-------------------------------------------------------+
    | RaaS Control Plane                                    |
    |                                                       |
    | Authorization                                         |
    | Integrity                                             |
    | Signature                                             |
    | Compatibility                                         |
    | Artifact Metadata                                     |
    +-------------------------------------------------------+

---

# Appendix F — Build Log Model

Conceptual log record:

    {
        "build_id": "build-001",
        "timestamp": "2026-10-10T10:21:01Z",
        "phase": "BUILD",
        "severity": "INFO",
        "stream": "stdout",
        "message": "Build completed"
    }

Logs may remain local.

Any future server upload must apply:

- explicit policy;
- sanitization;
- authorization;
- retention;
- privacy controls.

---

# Appendix G — Artifact Metadata Model

| Field | Authority | Purpose |
|---|---|---|
| Artifact ID | Control Plane | Remote identity |
| Project ID | Control Plane | Ownership |
| Application Name | Project/Manifest | Human identity |
| Application Version | Local Build | Release identity |
| Platform ID | Project | Target |
| Platform Version | Project | Compatibility |
| Architecture | Build/Platform | Execution target |
| KritvaOS | Project/Build | Runtime |
| SDK | Project/Build | Build compatibility |
| Digest | Local + Server | Integrity |
| Signature | Signing System | Authenticity |
| Created At | Control Plane | Lifecycle |
| Status | Control Plane | Remote state |

---

# Appendix H — Resource Estimate

Indicative effort:

| Capability | Estimate |
|---|---:|
| Frontend | 14–18 engineer-days |
| Rust/Local Runtime | 18–24 engineer-days |
| Backend/API | 8–12 engineer-days |
| Security | 5–7 engineer-days |
| QA | 12–16 engineer-days |
| DevOps/CI | 3–5 engineer-days |
| UX/UI | 3–4 engineer-days |
| Architecture/Review | 3–4 engineer-days |
| Documentation | 2–3 engineer-days |

The estimate should be recalibrated after toolchain and signing architecture
are finalized.

---

# Appendix I — F-M03 Definition of Done

F-M03 is Done only when:

    Project
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
    Manifest
      |
      v
    Checksum
      |
      v
    Privacy Scan
      |
      v
    Validation
      |
      v
    Sign
      |
      v
    Upload
      |
      v
    Server Registration
      |
      v
    Evidence
      |
      v
    Acceptance

Every stage must have verifiable evidence.

---

# Appendix J — Final Milestone Invariants

1. Builds execute locally.
2. Source code remains on the developer machine.
3. The Control Plane never receives source as part of the normal build flow.
4. The Local Runtime owns local process execution.
5. React does not directly execute arbitrary native processes.
6. Native commands use controlled Tauri IPC.
7. Toolchain detection occurs before build execution.
8. Toolchain versions are recorded where required.
9. Target architecture is explicit.
10. KritvaOS version is explicit.
11. SDK version is explicit.
12. Build configuration is project-scoped.
13. Build state is explicit.
14. Build cancellation is supported.
15. Build failure cannot be represented as success.
16. Test execution occurs locally.
17. Failed tests block packaging by default.
18. `.krv` is the controlled artifact format.
19. Artifact contents are explicitly controlled.
20. Manifest is mandatory.
21. Artifact integrity is cryptographically verified.
22. Artifact signature is independently verifiable.
23. Production signing keys are not exposed to the project.
24. Privacy scanning occurs before upload.
25. Prohibited content blocks upload.
26. Server independently validates the uploaded artifact.
27. Upload is authorized.
28. Upload is idempotent or safely retryable.
29. Upload progress is visible.
30. Upload cancellation is safe.
31. Source files are never included in upload payloads.
32. Source maps are not included unless explicitly allowed by policy.
33. Git metadata is not included unless explicitly allowed by policy.
34. Secrets are not included in artifacts.
35. Logs do not expose credentials.
36. Build output remains distinguishable from source.
37. Artifact identity is separate from Project identity.
38. Artifact compatibility is explicit.
39. Remote execution consumes the artifact, not the source workspace.
40. F-M03 provides the trusted artifact foundation for remote execution.

# Appendix K — Milestone Principle

> F-M03 is the critical boundary between local development and remote robotics
> execution in Kritva RaaS. The milestone must make the developer's local
> environment capable of detecting the required toolchain, building and
> testing the project, packaging only the intended executable content,
> generating a complete manifest, calculating a verifiable integrity digest,
> validating privacy and security policy, signing the artifact and uploading
> only the resulting `.krv` package. The Control Plane must never need the
> developer's source code to perform these operations. This separation is
> fundamental to the Kritva RaaS product promise: developers retain their
> source locally while the service receives a controlled execution artifact.
> F-M03 is therefore not merely a build screen milestone. It establishes the
> security, reproducibility, compatibility and provenance boundary on which
> remote execution, booking, laboratory deployment, robot execution and
> production RaaS depend.
