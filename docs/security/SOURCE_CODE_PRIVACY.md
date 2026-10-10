# Kritva RaaS Source Code Privacy

## 1. Purpose

This document defines the production-grade source-code privacy architecture and
requirements for Kritva RaaS.

The primary product security guarantee is:

> Customer source code never leaves the developer machine as part of the normal
> Kritva RaaS development, build, packaging, booking, or remote execution flow.

Kritva RaaS shall use a local-build, artifact-execution model:

    Customer Source Code
            |
            v
      Developer Machine
            |
            v
      RaaS Studio
            |
            v
      Studio Local Runtime
            |
            v
      Local Build / Test
            |
            v
      Package + Validate
            |
            v
       Sign Artifact
            |
            v
       .krv Artifact
            |
            | artifact only
            v
      RaaS Control Plane
            |
            v
       Lab / Robot

The cloud receives an execution artifact and required metadata, not the original
source tree.

This document defines the boundary, implementation requirements, verification
mechanisms, exceptions, failure behavior, audit model, and acceptance criteria
needed to make that guarantee credible and testable.

## 2. Scope

This document applies to:

- RaaS Studio.
- Studio Local Runtime.
- Local build tooling.
- Local test execution.
- Artifact packaging.
- Artifact manifest generation.
- Artifact validation.
- Artifact signing.
- Artifact upload.
- Control Plane APIs.
- Artifact object storage.
- Lab Agent.
- Kritva Runtime.
- Remote execution.
- Telemetry.
- Logs.
- Video.
- Results.
- Diagnostics.
- Crash reporting.
- Security monitoring.
- Administrative tooling.
- CI/CD components involved in RaaS software.
- Documentation and user-facing product behavior.

The scope includes source-code privacy during:

- project creation;
- local development;
- local builds;
- local tests;
- artifact creation;
- artifact upload;
- remote execution;
- telemetry;
- results;
- failures;
- support;
- diagnostics;
- auditing.

## 3. Non-Goals

This document does not guarantee that source code cannot leave the developer
machine through channels unrelated to Kritva RaaS.

Examples include:

- developer-initiated Git pushes;
- developer-selected cloud backups;
- developer-selected source sharing;
- malware on the developer machine;
- operating-system compromise;
- third-party development tools;
- source code pasted into external services;
- screenshots intentionally shared by the developer.

The guarantee applies specifically to the normal Kritva RaaS product workflow.

RaaS shall not claim that the developer machine itself is secure.

## 4. Goals

The source privacy architecture shall:

1. Keep original source files local.
2. Perform normal builds locally.
3. Perform normal tests locally where supported.
4. Generate `.krv` artifacts locally.
5. Upload only the execution artifact and approved metadata.
6. Prevent accidental source inclusion in artifacts.
7. Prevent source leakage through manifests.
8. Prevent source leakage through logs.
9. Prevent source leakage through telemetry.
10. Prevent source leakage through crash reports.
11. Prevent source leakage through API errors.
12. Prevent source leakage through support diagnostics.
13. Minimize artifact debug information.
14. Make source privacy continuously testable.
15. Provide auditable evidence that the cloud did not receive source files through
    supported RaaS interfaces.

## 5. Core Privacy Guarantee

The system shall distinguish three categories:

| Category | Default Location | Cloud Upload |
|---|---|---|
| Original source | Developer machine | No |
| Local build workspace | Developer machine | No |
| `.krv` execution artifact | Developer machine then object storage | Yes |
| Artifact manifest | Developer machine then Control Plane | Yes |
| Artifact checksum | Developer machine then Control Plane | Yes |
| Artifact signature | Developer machine then Control Plane | Yes |
| Runtime configuration | Developer machine / cloud as required | Limited |
| Telemetry | Remote execution environment | Yes |
| Logs | Remote execution environment | Yes |
| Video | Lab/remote execution environment | Yes |
| Results | Remote execution environment | Yes |

The artifact itself may contain executable code derived from the source.

Therefore:

> "Source code never leaves the developer machine" does not mean that the
> executable artifact contains no intellectual property.

The artifact is treated as a separate protected asset.

## 6. Security Principle

The source boundary is:

    +------------------------------------------------------+
    |                 DEVELOPER MACHINE                    |
    |                                                      |
    |  Source -> Build -> Test -> Package -> Sign          |
    |                                                      |
    |  Source Code remains inside this boundary            |
    +-----------------------------+------------------------+
                                  |
                                  | .krv + approved metadata
                                  v
    +------------------------------------------------------+
    |                  RaaS CLOUD                          |
    |                                                      |
    |  Artifact -> Validate -> Book -> Execute -> Results  |
    +------------------------------------------------------+

The source boundary shall be enforced by architecture rather than by user
instructions alone.

# 7. Definitions

| Term | Definition |
|---|---|
| Source Code | Original human-authored or generated development source |
| Source Tree | Complete local project directory used for development |
| Build Workspace | Local files required to compile/package the project |
| Local Runtime | Trusted local component used by Studio |
| Artifact | Packaged `.krv` execution unit |
| Manifest | Structured metadata describing an artifact |
| Package | Process that creates the `.krv` artifact |
| Source Inclusion | Presence of source files/content in an uploaded artifact |
| Debug Information | Compiler/linker metadata useful for debugging |
| Symbol | Symbol-table information identifying code/data entities |
| Telemetry | Runtime measurements and events |
| Runtime Log | Text or structured execution record |
| Diagnostic | Information generated to troubleshoot execution |
| Upload Boundary | Point where information leaves developer machine |
| Privacy Scanner | Tool detecting prohibited source content |
| Artifact Scanner | Tool inspecting package contents before upload |
| Source Fingerprint | Hash or equivalent identifier derived from source |
| Build Metadata | Information describing a build without containing source |
| Reproducible Build | Build producing deterministic or traceable output |
| Provenance | Evidence describing how an artifact was produced |
| Remote Execution | Execution on RaaS infrastructure or robot |
| Developer Machine | Local computer containing customer source |

# 8. Source Privacy Threat Model

Primary threats include:

- accidental source upload;
- source embedded in package;
- source paths in manifest;
- source paths in stack traces;
- source fragments in logs;
- source in compiler diagnostics;
- source in crash reports;
- source in telemetry;
- source in generated metadata;
- source in debug symbols;
- source in archive files;
- source in build cache;
- source in temporary upload directories;
- source in support bundles.

The primary security objective is:

> No supported RaaS interface shall intentionally or accidentally transmit customer
> source code to the RaaS cloud during normal product operation.

# 9. Data Flow Overview

    +---------------------+
    | Developer Source    |
    +----------+----------+
               |
               | local filesystem
               v
    +---------------------+
    | RaaS Studio         |
    +----------+----------+
               |
               v
    +---------------------+
    | Studio Local        |
    | Runtime             |
    +----------+----------+
               |
               v
    +---------------------+
    | Local Build         |
    +----------+----------+
               |
               v
    +---------------------+
    | Local Test          |
    +----------+----------+
               |
               v
    +---------------------+
    | Artifact Packaging  |
    +----------+----------+
               |
               v
    +---------------------+
    | Source Inclusion    |
    | Scanner             |
    +----------+----------+
               |
               v
    +---------------------+
    | Manifest Generator  |
    +----------+----------+
               |
               v
    +---------------------+
    | Artifact Signer     |
    +----------+----------+
               |
               v
    +---------------------+
    | .krv Artifact       |
    +----------+----------+
               |
               | artifact only
               v
    +---------------------+
    | RaaS Control Plane  |
    +----------+----------+
               |
               v
    +---------------------+
    | Lab / Runtime       |
    +---------------------+

# 10. Local Build Model

The default build architecture shall be local.

The developer machine performs:

- source discovery;
- dependency resolution;
- compilation;
- assembly;
- linking;
- local testing;
- package generation;
- package validation;
- source inclusion scanning;
- signing.

The cloud shall not be required to access the source tree.

## 10.1 Local Build Flow

    Source
      |
      v
    Project Configuration
      |
      v
    Dependency Resolution
      |
      v
    Compiler
      |
      v
    Linker
      |
      v
    Tests
      |
      v
    Package Builder
      |
      v
    Privacy Scanner
      |
      v
    Manifest Generator
      |
      v
    Artifact Signer
      |
      v
    Upload

A build failure shall remain local unless the user explicitly chooses to share
diagnostic information.

# 11. Local Runtime Boundary

The Studio Local Runtime shall be responsible for operations that require direct
source access.

It may access:

- selected project directory;
- source files;
- local build tools;
- compiler;
- linker;
- test framework;
- package builder;
- signing interface;
- local cache.

It shall not automatically transmit source contents to the Control Plane.

The Local Runtime shall expose structured status rather than raw source data.

# 12. Studio Source Access

Studio may provide:

- project selection;
- build invocation;
- test invocation;
- build status;
- compiler status;
- package status;
- artifact status.

Studio shall not upload:

- source files;
- source archives;
- Git repositories;
- source patches;
- source diffs;
- compiler input files;
- preprocessor output;
- generated source;
- source snippets.

unless a future explicitly opt-in feature changes the product security model.

# 13. What Is Uploaded

The normal remote execution upload contains:

1. `.krv` artifact.
2. Artifact identifier.
3. Artifact manifest.
4. Artifact checksum.
5. Artifact signature.
6. Signing-key identifier.
7. Platform identity.
8. Platform version.
9. Architecture.
10. KritvaOS compatibility.
11. SDK compatibility.
12. Required capabilities.
13. Entrypoint.
14. Application/version identifiers.
15. Build/provenance metadata that does not contain source.

The server may also receive:

- organization ID;
- project ID;
- user/service actor ID;
- upload timestamp;
- request ID;
- artifact size;
- artifact format/version.

# 14. What Must Never Be Uploaded

The normal RaaS upload path shall reject or prevent:

- `.c`;
- `.cc`;
- `.cpp`;
- `.h`;
- `.hpp`;
- `.rs`;
- `.py`;
- `.js`;
- `.ts`;
- `.tsx`;
- `.java`;
- `.go`;
- `.yaml` source configuration where it contains customer source;
- `.json` source configuration containing source;
- `.xml` source configuration containing source;
- Git repositories;
- `.git` directories;
- source archives;
- patch files;
- diffs;
- compiler preprocessed source;
- source maps;
- editor backups;
- IDE project files containing source;
- test source;
- generated source;
- build scripts containing customer source.

The exact extension list shall not be treated as the sole detection mechanism.

Content-based scanning is required.

# 15. Artifact Format

The `.krv` artifact shall contain only information required for remote execution
and approved runtime operation.

Conceptual structure:

    application.krv
      |
      +-- manifest.json
      +-- executable/
      +-- libraries/
      +-- runtime-config/
      +-- resources/
      +-- signature/
      +-- integrity/

The actual package layout may evolve, but the package contract shall explicitly
define permitted and prohibited content.

# 16. Manifest Privacy Rules

The manifest shall contain execution metadata, not source content.

Permitted examples:

    {
        "artifact_id": "artifact-123",
        "application_id": "app-001",
        "version": "1.0.0",
        "platform_id": "kritva-reference-v1",
        "platform_version": "1.2",
        "architecture": "x86_64",
        "kritva_os_version": "1.0",
        "sdk_version": "1.0",
        "entrypoint": "bin/app",
        "required_capabilities": [
            "camera",
            "imu"
        ],
        "checksum": "sha256:...",
        "signing_key_id": "key-001"
    }

The manifest shall not contain:

- source code;
- source snippets;
- source file contents;
- full source-tree paths;
- private Git URLs;
- Git credentials;
- compiler command lines containing secrets;
- environment variables containing secrets;
- local usernames unless explicitly required;
- absolute home-directory paths;
- source comments;
- source maps.

# 17. Path Privacy

Absolute local paths shall not cross the upload boundary.

Examples of prohibited values:

    /home/user/customer_project/src/main.cpp
    /Users/developer/company/project/robot.cpp
    C:\Users\developer\project\src\main.cpp

If provenance requires a path-like value, it shall be normalized to a non-sensitive
logical identifier.

Permitted:

    src/main.cpp

only when the product explicitly determines that the path itself is acceptable
and it does not expose customer identity or filesystem information.

The preferred behavior is to omit source paths entirely.

# 18. Build Metadata Privacy

Build metadata shall be minimized.

Allowed:

- compiler version;
- SDK version;
- target architecture;
- platform version;
- build timestamp;
- build identifier;
- reproducibility identifier;
- dependency versions where safe.

Disallowed:

- compiler command lines containing source paths;
- environment dumps;
- secret-bearing environment variables;
- Git remote URLs containing credentials;
- complete local filesystem paths;
- source snippets.

# 19. Source Inclusion Scanner

Every artifact intended for remote upload shall pass a local source-inclusion
scan.

The scanner shall inspect:

1. Archive entries.
2. File names.
3. File extensions.
4. File signatures.
5. Text content.
6. Binary metadata.
7. Embedded strings where practical.
8. Debug sections.
9. Symbol tables.
10. Source maps.
11. Build metadata.
12. Package manifests.

The scanner shall operate locally.

Source scanning shall not require uploading the artifact to a remote scanning
service.

# 20. Scanner Architecture

    .krv Artifact
         |
         v
    Package Parser
         |
         +---- File List
         |
         +---- File Type Detection
         |
         +---- Text Scanner
         |
         +---- Debug Metadata Scanner
         |
         +---- Symbol Scanner
         |
         +---- Path Scanner
         |
         +---- Secret Scanner
         |
         v
    Privacy Decision
         |
       +---+---+
       |       |
     PASS     FAIL
       |       |
       v       v
    Sign     Block
    Upload   Upload

# 21. Scanner Decision Rules

The scanner shall classify findings as:

| Severity | Meaning | Action |
|---|---|---|
| BLOCK | Definite source/secret inclusion | Upload prohibited |
| HIGH | Strong source/debug evidence | Upload prohibited |
| MEDIUM | Potential privacy exposure | Review or policy decision |
| LOW | Informational metadata | Allowed if policy permits |

Production default:

> BLOCK and HIGH findings shall prevent artifact upload.

# 22. Source File Detection

The scanner shall detect common source types by:

- extension;
- MIME type;
- magic bytes;
- language signatures;
- lexical patterns.

It shall not rely exclusively on filename extensions because source may be
renamed.

For example:

    application.bin

may still contain embedded source text.

# 23. Source Content Detection

Content-based detection shall look for patterns including:

- source-language syntax;
- preprocessor directives;
- source comments;
- function definitions;
- class definitions;
- import/include statements;
- source maps;
- compiler-generated source records.

Detection shall be conservative for privacy-sensitive packages.

False positives shall be reviewable locally.

# 24. Secret Detection

The privacy scanner shall also detect likely secrets.

Examples:

- API keys;
- cloud credentials;
- private keys;
- access tokens;
- passwords;
- signing keys;
- credential-bearing URLs.

A detected secret shall block upload by default.

Source privacy and secret protection are separate controls but shall share the
local scanning boundary.

# 25. Debug Information Policy

Debug information requires special handling.

Default Production policy:

> Full source-level debug information shall not be included in remotely
> executable Production artifacts.

The following are generally prohibited:

- embedded source text;
- DWARF source contents;
- source paths;
- source maps;
- line tables containing sensitive local paths;
- IDE-specific debug metadata.

# 26. Symbol Policy

Symbols may be necessary for limited runtime diagnostics.

The default policy shall be:

| Symbol Type | Production |
|---|---|
| Public runtime entrypoint | Allowed |
| Required ABI symbols | Allowed |
| Internal function names | Prefer stripped |
| Local variable names | Prohibited |
| Source filenames | Prohibited |
| Full debug symbols | Prohibited |
| Source maps | Prohibited |
| Private symbols | Prohibited unless explicitly approved |

Where diagnostics require symbols, a separate protected symbol artifact may be
generated locally and retained by the developer.

It shall not be uploaded automatically.

# 27. Developer Debug Builds

Debug artifacts may contain additional information but shall not automatically
be eligible for Production physical execution.

A debug artifact shall be explicitly classified:

    DEVELOPMENT
    TEST
    RESEARCH
    PRODUCTION

Production policy shall prevent accidental upload of development-only debug
content.

# 28. Symbol Server Policy

RaaS shall not require customer source to operate a symbol server.

If future remote debugging is introduced:

1. Source privacy impact shall be reviewed.
2. Symbols shall be separated from source.
3. Symbols shall be access controlled.
4. Upload shall be explicitly enabled.
5. Retention shall be defined.
6. Tenant isolation shall be enforced.
7. The security requirements shall be updated.

# 29. Telemetry Privacy

Telemetry shall contain runtime information required to operate and analyze
remote execution.

Telemetry shall not contain:

- source code;
- source snippets;
- source comments;
- source file contents;
- compiler input;
- source-level variable values unless explicitly approved;
- arbitrary environment dumps.

Telemetry may contain:

- CPU utilization;
- memory usage;
- execution state;
- sensor values;
- actuator state;
- timing;
- runtime counters;
- application-defined metrics.

Application-defined telemetry shall be treated as potentially sensitive.

# 30. Application-Generated Telemetry

Applications may intentionally emit arbitrary telemetry.

Therefore the RaaS runtime shall:

- document telemetry privacy expectations;
- provide structured telemetry APIs;
- avoid automatic source collection;
- provide configurable size limits;
- provide rate limits;
- record Run context;
- avoid implicit filesystem scraping.

The product cannot guarantee privacy of information intentionally emitted by
customer applications.

# 31. Runtime Logs

Remote runtime logs shall be structured where practical.

Logs shall not automatically include:

- source files;
- source snippets;
- environment dumps;
- full command lines;
- local source paths;
- credentials;
- private keys.

Runtime logs may include:

- application ID;
- artifact ID;
- Run ID;
- timestamps;
- status;
- exit code;
- runtime events;
- safe diagnostic identifiers.

# 32. Stack Traces

Stack traces require special handling.

The runtime shall prefer:

    artifact_id
    run_id
    module
    symbol
    address
    error_code

rather than:

    /home/customer/private_project/src/controller.cpp:187

Absolute local paths shall be stripped or normalized.

Source-level stack traces shall remain local by default.

# 33. Crash Reporting

Automatic crash reporting shall not upload source.

Crash reports may contain:

- artifact ID;
- Run ID;
- platform version;
- runtime version;
- architecture;
- error code;
- sanitized stack information;
- resource status;
- sanitized metrics.

Crash reports shall be scanned for:

- source;
- secrets;
- filesystem paths;
- environment variables.

# 34. Compiler Diagnostics

Compiler diagnostics occur locally.

They shall not be transmitted automatically.

For example:

    error: /home/dinesh/project/src/main.cpp:137: ...
    
shall remain local.

Studio may show the diagnostic to the developer locally.

If a user explicitly submits diagnostics for support, that submission becomes a
separate explicit data-sharing operation and shall require clear user action.

# 35. Build Failure Handling

A failed local build shall not automatically trigger:

- source upload;
- build workspace upload;
- compiler log upload;
- source archive upload;
- environment dump.

The cloud shall receive only a high-level build result if required:

    BUILD_SUCCEEDED
    BUILD_FAILED
    TEST_FAILED
    PACKAGE_FAILED
    PRIVACY_SCAN_FAILED

Detailed diagnostics remain local unless explicitly shared.

# 36. Support Diagnostics

Support bundles shall be privacy-sensitive.

Default support bundle content:

- application version;
- Studio version;
- runtime version;
- OS version;
- architecture;
- error code;
- sanitized logs;
- artifact identifier;
- Run identifier.

Default prohibited content:

- source files;
- Git repository;
- source archives;
- compiler input;
- credentials;
- environment dumps.

A future source-sharing workflow must be explicitly opt-in and clearly separated
from ordinary support diagnostics.

# 37. Crash Dumps

Native crash dumps can contain memory that includes source-derived content.

Therefore:

- automatic full-memory dumps shall not be uploaded;
- local crash dumps shall be stored locally;
- upload requires explicit policy;
- sanitized minidumps may be permitted;
- crash artifacts shall be scanned before upload.

# 38. Local Cache Policy

Studio and Local Runtime caches may contain source-derived data.

Caches shall:

- remain local;
- be protected by OS filesystem permissions;
- have bounded retention;
- support cleanup;
- not be uploaded automatically.

Cache directories shall be excluded from artifact packaging unless explicitly
required.

# 39. Build Directory Policy

The package builder shall use an explicit allowlist.

Preferred model:

    source/
      |
      v
    build/
      |
      v
    staging/
      |
      v
    approved package contents
      |
      v
    .krv

The package builder shall not recursively package the project directory.

# 40. Package Allowlist

A Production artifact shall contain only approved categories:

| Category | Allowed |
|---|---|
| Executable | Yes |
| Required runtime library | Yes |
| Required configuration | Yes |
| Required runtime resource | Yes |
| Manifest | Yes |
| Signature | Yes |
| Integrity metadata | Yes |
| Source files | No |
| Source maps | No |
| Debug symbols | No |
| Build scripts | No |
| Git metadata | No |
| Editor metadata | No |
| Compiler cache | No |
| Temporary files | No |

# 41. Package Denylist

The following shall trigger scanning or rejection:

    .git/
    .svn/
    .hg/
    *.c
    *.cc
    *.cpp
    *.h
    *.hpp
    *.rs
    *.py
    *.js
    *.ts
    *.tsx
    *.java
    *.go
    *.patch
    *.diff
    *.map
    *.dSYM
    *.pdb
    *.dwo

The denylist is supplementary, not authoritative.

# 42. Build Reproducibility

Where practical, builds should be reproducible.

Reproducibility improves privacy verification because:

- unexpected package contents are easier to detect;
- build provenance is clearer;
- artifact comparison becomes possible;
- malicious build modifications are easier to identify.

Reproducibility is not itself a source-privacy guarantee.

# 43. Artifact Provenance

The artifact shall retain non-source provenance such as:

- build ID;
- application ID;
- artifact ID;
- platform;
- architecture;
- runtime version;
- SDK version;
- build timestamp;
- dependency versions where appropriate;
- signing-key ID;
- checksum.

Provenance shall not expose:

- source;
- secrets;
- private repository URLs;
- private filesystem paths.

# 44. Source Fingerprints

The product may use source-derived fingerprints for local verification.

If used:

- the fingerprint shall not permit source reconstruction;
- it shall not be used as a substitute for source privacy;
- it shall not expose source content;
- the product shall document whether hashes can reveal information through
  dictionary attacks.

Where practical, fingerprints should be derived from approved build inputs and
stored only locally unless required for a documented security function.

# 45. Git Metadata

The normal artifact shall not contain:

- `.git`;
- commit objects;
- branches;
- remotes;
- commit messages;
- author emails;
- repository URLs.

A commit identifier may be retained as provenance only if the developer opts
into that metadata and the identifier does not expose confidential information.

The default is to omit it.

# 46. Dependency Metadata

Dependency metadata may be necessary for compatibility and security.

Permitted:

- package name;
- package version;
- runtime ABI;
- license identifier;
- security advisory identifier.

Prohibited unless explicitly approved:

- local dependency paths;
- private repository URLs;
- access credentials;
- source contents.

# 47. Environment Variables

Environment variables shall never be dumped automatically.

The following are prohibited from upload:

- cloud credentials;
- API keys;
- tokens;
- passwords;
- signing keys;
- secret URLs;
- complete environment snapshots.

Only explicitly approved non-sensitive build metadata may be retained.

# 48. Network Boundary Enforcement

The Local Runtime should provide a clear separation between:

    Local Source Operations
              |
              v
       Local-only services

and:

    Remote RaaS Operations
              |
              v
        Authenticated API

The implementation shall make accidental source transmission difficult.

# 49. Upload API Contract

The upload API shall accept:

    artifact_id
    artifact_metadata
    manifest
    checksum
    signature
    artifact_binary

It shall not define an ordinary field such as:

    source
    source_archive
    source_files
    source_tree

for normal execution uploads.

Any future source-bearing API shall be treated as a new security boundary and
shall require explicit security review.

# 50. Upload Validation

The server shall independently validate:

- artifact format;
- artifact size;
- manifest schema;
- artifact ID;
- checksum;
- signature;
- platform;
- architecture;
- runtime compatibility;
- SDK compatibility;
- capabilities.

The server cannot prove the absence of all source content from arbitrary binaries,
so local scanning remains mandatory.

# 51. Server-Side Artifact Inspection

The server may inspect artifacts for:

- package integrity;
- malware;
- executable validity;
- prohibited file classes;
- manifest consistency;
- size;
- signature.

Server-side inspection shall not be treated as a replacement for local source
privacy scanning.

If server inspection identifies likely source content, execution/upload policy shall
be able to reject the artifact.

# 52. Privacy Scan Evidence

Each Production artifact should have local evidence containing:

    artifact_id
    scanner_version
    scanner_policy_version
    scan_timestamp
    scan_result
    finding_count
    package_hash

The evidence shall not contain source contents.

The server may retain the scan result and policy version.

# 53. Privacy Scan Failure

If the scanner:

- crashes;
- times out;
- cannot inspect a package;
- cannot identify a file type;
- cannot validate archive structure;

the artifact shall not be uploaded as Production by default.

The safe behavior is:

    Scanner Failure
        |
        v
    Upload Blocked
        |
        v
    Local Diagnostic

# 54. False Positives

False positives shall be handled locally.

The developer may:

- inspect the finding;
- modify packaging;
- remove prohibited content;
- select an explicitly approved exception.

Exceptions shall never silently bypass Production privacy policy.

# 55. Exceptions

An exception may be allowed only when:

1. the content is demonstrably not customer source;
2. the security impact is documented;
3. the exception is approved by the applicable policy;
4. the exception is versioned;
5. the artifact remains within the execution security boundary.

Exceptions shall not allow:

- secrets;
- credentials;
- source archives;
- arbitrary source files;
- private keys.

# 56. Artifact Encryption

Artifact confidentiality is separate from source privacy.

Because artifacts may contain valuable executable IP, artifact storage shall be
protected using:

- encryption at rest;
- authenticated access;
- tenant authorization;
- scoped object-storage credentials;
- short-lived download URLs.

# 57. Artifact Download

Users may download artifacts only when authorized.

Artifact downloads shall:

- authenticate the requester;
- verify organization/project authorization;
- be audited where required;
- use protected transport;
- use short-lived access URLs where applicable.

# 58. Remote Execution Does Not Require Source

Remote execution shall require:

- artifact;
- manifest;
- booking;
- resource allocation;
- authorization;
- platform compatibility;
- runtime compatibility;
- capability authorization.

It shall not require:

- source tree;
- source archive;
- compiler input;
- local build workspace.

# 59. Runtime Source Access

The remote runtime shall not expect a source directory.

The runtime execution environment shall contain:

- executable;
- required libraries;
- approved resources;
- runtime configuration;
- manifest;
- execution context.

No generic source directory shall be mounted.

# 60. Runtime Filesystem Policy

Where practical, remote runtime environments shall use:

- read-only application layers;
- isolated temporary directories;
- bounded writable storage;
- no access to unrelated customer data;
- no access to other tenants' artifacts.

# 61. Artifact-to-Source Relationship

An executable artifact may be derived from source.

Therefore, source privacy shall not be interpreted as:

> "The cloud learns nothing about the application."

The cloud may necessarily know:

- application identity;
- artifact identity;
- target platform;
- architecture;
- capabilities;
- runtime requirements;
- resource consumption;
- execution behavior;
- telemetry intentionally emitted by the application.

The protected boundary is the original source representation.

# 62. Application Metadata Privacy

Application names and descriptions may themselves contain confidential information.

Therefore:

- users should be warned not to put secrets in names/descriptions;
- metadata shall be tenant-protected;
- public platform catalogs shall not expose private project metadata;
- logs shall avoid unnecessary metadata duplication.

# 63. Telemetry Data Flow

    Robot / Runtime
          |
          v
      Telemetry API
          |
          v
    Sanitization / Validation
          |
          v
    Run Context
          |
          v
    RaaS Telemetry
          |
          v
    Result / Metrics

The telemetry API shall not read source files.

# 64. Logs Data Flow

    Runtime
       |
       v
    Structured Logger
       |
       v
    Secret/Path Sanitization
       |
       v
    Log Transport
       |
       v
    RaaS Log Store

Logs shall not automatically traverse the source filesystem.

# 65. Diagnostics Data Flow

    Failure
      |
      v
    Local Diagnostic
      |
      +---- Developer View
      |
      +---- Sanitization
               |
               v
          Optional Remote
          Diagnostic

Remote diagnostics require sanitization before crossing the boundary.

# 66. Audit Data Flow

Audit records may contain:

- actor;
- organization;
- operation;
- artifact ID;
- project ID;
- Run ID;
- timestamp;
- outcome.

Audit records shall not contain source content.

Example:

    {
        "event": "artifact.uploaded",
        "organization_id": "org-001",
        "project_id": "project-001",
        "artifact_id": "artifact-001",
        "actor_id": "user-001",
        "outcome": "SUCCESS"
    }

# 67. Error Handling

API errors shall use structured error codes.

Example:

    {
        "status": "FAILED",
        "code": "ARTIFACT_PRIVACY_SCAN_FAILED",
        "message": "Artifact failed local privacy validation"
    }

Errors shall not include:

- source snippets;
- local absolute paths;
- compiler command lines;
- environment dumps;
- secrets.

# 68. Security Logging

Security logs shall record:

- upload attempts;
- artifact validation;
- privacy-scan status;
- execution authorization;
- download events;
- policy failures.

They shall not record:

- source contents;
- source snippets;
- full package contents;
- secret values.

# 69. Audit Requirements

The system shall be able to establish:

1. Which user uploaded an artifact.
2. Which organization owned it.
3. Which project used it.
4. Which artifact identity was uploaded.
5. Which checksum was validated.
6. Which signing identity was used.
7. Which platform was targeted.
8. Which Run executed it.
9. Which Result was generated.

It shall not need to retain the original source to establish this provenance.

# 70. Privacy Verification Model

Source privacy shall be verified through multiple layers:

    Architecture
        |
        v
    API Contract
        |
        v
    Local Scanner
        |
        v
    Package Allowlist
        |
        v
    Server Validation
        |
        v
    Network Verification
        |
        v
    Storage Inspection
        |
        v
    Audit Verification

# 71. Network-Level Verification

The development team shall periodically inspect upload traffic to verify that
normal Studio operation transmits:

- artifact data;
- approved metadata;
- approved control messages.

Testing shall confirm that source files are not transmitted.

Representative verification:

    Source Tree
        |
        v
    Build
        |
        v
    Upload
        |
        v
    Capture/Inspect Network Traffic
        |
        v
    Verify No Source Payload

Network verification shall be performed in a controlled test environment.

# 72. Storage-Level Verification

After an artifact upload, automated tests shall inspect:

- PostgreSQL records;
- object-storage objects;
- worker payloads;
- audit records.

The test shall verify that source files are absent.

# 73. Artifact-Level Verification

A test project containing deliberately recognizable source markers shall be built.

Example marker:

    KRITVA_SOURCE_PRIVACY_TEST_MARKER_12345

The test shall verify that the marker does not appear in:

- uploaded artifact contents;
- manifest;
- API request payload;
- logs;
- telemetry;
- result metadata.

If the marker is legitimately compiled into an executable string, the test must
distinguish executable behavior from source-file leakage.

# 74. Path-Leakage Verification

A unique local path shall be created:

    /tmp/KRITVA_PRIVATE_PATH_TEST_12345/src/controller.cpp

After upload and remote execution, automated tests shall verify that this path
does not appear in:

- manifest;
- API response;
- audit records;
- logs;
- telemetry;
- Result metadata.

# 75. Secret-Leakage Verification

A test secret shall be placed in local source/build configuration.

The test shall verify:

- scanner detects it;
- artifact upload is blocked if included;
- logs do not expose it;
- diagnostics do not expose it.

The test secret shall never be a real credential.

# 76. Source Inclusion Test Matrix

| Test | Expected Result |
|---|---|
| `.cpp` inside package | BLOCK |
| `.h` inside package | BLOCK |
| `.git` inside package | BLOCK |
| Source map inside package | BLOCK |
| Debug source path | BLOCK/HIGH |
| Private key | BLOCK |
| API token | BLOCK |
| Binary executable | ALLOW |
| Required library | ALLOW |
| Runtime configuration | ALLOW if approved |
| Manifest | ALLOW |
| Signature | ALLOW |
| Checksum | ALLOW |

# 77. Production Build Policy

Production artifacts shall:

- pass privacy scanning;
- pass signature validation;
- pass compatibility validation;
- pass package allowlist validation;
- contain no prohibited source artifacts;
- contain no prohibited debug information;
- contain no secrets.

A failed privacy scan is a release-blocking condition.

# 78. Development Build Policy

Development builds may have additional debug capabilities.

However:

- source shall remain local;
- upload shall remain disabled unless policy allows;
- Development artifacts shall not accidentally be treated as Production;
- debug information shall be explicitly classified.

# 79. Research Build Policy

Research artifacts may use additional instrumentation.

The same source boundary applies.

Additional telemetry must:

- be explicitly declared;
- remain within data-size limits;
- not read source files automatically;
- not contain credentials;
- be subject to retention policy.

# 80. Physical Robot Policy

Physical robot execution shall require Production-eligible artifacts unless an
explicit laboratory policy allows development/research artifacts.

Any exception shall require:

- platform-specific approval;
- lab policy;
- safety review;
- artifact classification;
- audit.

# 81. Object Storage Namespace

Artifacts shall use tenant-scoped object keys.

Conceptual structure:

    artifacts/
      {organization_id}/
        {project_id}/
          {artifact_id}/
            artifact.krv

The exact storage key shall not expose unnecessary private metadata.

# 82. Object Storage Access

The client shall not receive permanent object-store credentials.

Preferred flow:

    Authorized API Request
            |
            v
    Authorization
            |
            v
    Short-Lived Signed Access
            |
            v
    Object Storage

# 83. Database Storage Rules

PostgreSQL may store:

- artifact metadata;
- checksum;
- signature metadata;
- manifest;
- build metadata;
- privacy scan status;
- provenance;
- organization/project ownership.

PostgreSQL shall not store:

- source tree;
- source files;
- source archives;
- build workspace.

# 84. Queue Payload Rules

Queue messages shall not contain source.

Example allowed:

    {
        "job_id": "job-001",
        "artifact_id": "artifact-001",
        "organization_id": "org-001",
        "run_id": "run-001"
    }

Queue messages shall not contain:

    source
    source_files
    source_archive
    compiler_input

# 85. Worker Rules

Workers shall operate using:

- artifact IDs;
- storage references;
- manifests;
- execution metadata.

Workers shall not have permissions to access developer source because the source
is not stored in the cloud.

# 86. Backup Rules

Backups may contain:

- artifact metadata;
- artifact binaries;
- results;
- logs;
- telemetry;
- audit records.

Backups shall not contain source because source is not part of the cloud system.

Backup security remains important because artifacts and results may be highly
confidential.

# 87. Administrative Access

Administrators shall not have a hidden mechanism to retrieve customer source
from normal RaaS infrastructure.

The architecture should make this impossible by absence:

    No source in cloud
          |
          v
    No source database query
          |
          v
    No source storage object
          |
          v
    No source administrative export

# 88. Support Access

Support personnel may access:

- artifact metadata;
- sanitized logs;
- Run state;
- Result metadata;
- approved diagnostics.

Support personnel shall not receive source by default.

If a customer voluntarily supplies source, that source becomes outside the normal
RaaS source-privacy boundary and must be handled under the applicable support
and privacy policy.

# 89. Customer Communication

Product documentation shall clearly communicate:

> Kritva RaaS builds applications locally. The normal RaaS workflow uploads only
> the packaged execution artifact and approved execution metadata, not the
> customer's source tree.

Documentation shall also explain:

- artifacts contain executable IP;
- telemetry can contain application-defined data;
- results may contain sensitive information;
- explicit support uploads are separate from normal execution.

# 90. User Interface Requirements

The Studio shall make the source boundary visible.

Before first upload, the user should be able to see:

    Source:
      LOCAL ONLY

    Upload:
      .krv ARTIFACT + APPROVED METADATA

    Source upload:
      NOT REQUIRED

The UI shall not imply that the server needs access to source.

# 91. Build Status UI

The Studio should distinguish:

    BUILDING LOCALLY
    TESTING LOCALLY
    SCANNING LOCALLY
    PACKAGING LOCALLY
    SIGNING LOCALLY
    UPLOADING ARTIFACT
    REMOTE VALIDATION
    REMOTE EXECUTION

This makes the trust boundary understandable to users.

# 92. Explicit Upload Confirmation

For Production execution, the Studio should show:

    Artifact: application.krv
    Size: <size>
    Platform: <platform>
    Architecture: <architecture>
    Privacy Scan: PASS
    Signature: VALID
    Source Upload: NOT REQUIRED

The user should not be asked to upload a source archive as part of the normal
flow.

# 93. Interface Requirements

## 93.1 Local Build API

Conceptual:

    build_project(
        project_path,
        platform,
        configuration
    ) -> LocalBuildResult

The result shall contain status and metadata, not source.

## 93.2 Privacy Scan API

    scan_artifact(
        artifact_path,
        policy
    ) -> PrivacyScanResult

Example result:

    {
        "status": "PASS",
        "scanner_version": "1.0",
        "policy_version": "1.0",
        "finding_count": 0
    }

## 93.3 Package API

    package_artifact(
        build_output,
        package_policy
    ) -> Artifact

## 93.4 Upload API

    upload_artifact(
        artifact,
        manifest,
        checksum,
        signature
    ) -> UploadResult

No source parameter shall exist in the normal contract.

# 94. Privacy Policy Versioning

Privacy scanning shall be policy-versioned.

Each scan shall record:

- scanner version;
- policy version;
- scan timestamp;
- artifact checksum;
- result.

When the privacy policy changes, previously accepted artifacts may be re-evaluated
according to product policy.

# 95. Scanner Version Compatibility

The server may reject artifacts generated by unsupported privacy scanner versions.

This prevents obsolete scanners from bypassing newer privacy rules.

Example:

    minimum_scanner_version = 1.4

An artifact generated with scanner version 1.2 shall require local re-scanning.

# 96. Artifact Revocation

An artifact may be revoked for:

- discovered source leakage;
- discovered secret;
- signing compromise;
- malicious behavior;
- incompatible package;
- policy violation.

Revoked artifacts shall not execute on new Runs.

# 97. Source Privacy Incident

A source privacy incident includes:

- source uploaded unintentionally;
- source stored in cloud;
- source exposed through logs;
- source exposed through telemetry;
- source exposed through diagnostics;
- source path leaked;
- source embedded in debug information.

Incident response shall include:

1. Stop further exposure.
2. Identify affected tenants.
3. Preserve evidence.
4. Remove unauthorized copies where policy permits.
5. Rotate exposed secrets.
6. Assess artifact impact.
7. Notify affected customers where required.
8. Correct the implementation.
9. Add regression tests.
10. Update this document.

# 98. Residual Risks

The source privacy model has residual risks.

| Risk | Residual Reason | Mitigation |
|---|---|---|
| Malicious local software | Endpoint compromise | User OS security |
| Source embedded in binary | Compiled IP | Artifact protection |
| Intentional telemetry | Application behavior | Telemetry policy |
| Unknown source format | Scanner limitation | Layered scanning |
| Compiler metadata leakage | Toolchain behavior | Strip/sanitize |
| Crash memory leakage | Memory may contain source | Local crash handling |
| Support upload | Explicit user action | Clear consent |
| Debug artifact | Developer choice | Production policy |
| Third-party build tool | External behavior | Local isolation |
| Zero-day scanner bypass | Unknown vulnerability | Multiple controls |

# 99. Source Privacy Risk Matrix

| Risk | Likelihood | Impact | Rating |
|---|---:|---:|---:|
| Accidental source packaging | 3 | 5 | High |
| Source path leakage | 3 | 3 | Medium |
| Debug symbol leakage | 3 | 4 | High |
| Secret in artifact | 3 | 5 | High |
| Telemetry source leakage | 2 | 4 | Medium |
| Crash dump leakage | 2 | 4 | Medium |
| Object-storage artifact theft | 3 | 5 | High |
| Local endpoint compromise | 3 | 5 | High |
| Scanner bypass | 2 | 5 | High |

High risks require explicit controls before Production.

# 100. Phase Mapping

| Phase | Source Privacy Focus |
|---|---|
| Phase 0 | Privacy architecture and secure development baseline |
| Phase 1 | Studio/local runtime boundary |
| Phase 2 | Project/tenant privacy controls |
| Phase 3 | Artifact packaging and privacy scanner |
| Phase 4 | Booking/credit metadata privacy |
| Phase 5 | Remote execution without source |
| Phase 6 | Lab/runtime telemetry and diagnostics |
| Phase 7 | Results, video, logs and audit privacy |
| Phase 8 | Verification, penetration testing and production governance |

# 101. Phase 0 Requirements

Phase 0 shall establish:

- source privacy principle;
- trust boundary;
- threat model;
- API design principle;
- dependency scanning;
- secret scanning;
- privacy ownership.

No design shall require cloud source storage without explicit architecture review.

# 102. Phase 1 Requirements

Phase 1 shall establish:

- local Studio source access;
- Local Runtime;
- local build execution;
- local diagnostic handling;
- secure Studio-to-cloud interface.

Source upload shall not be part of authentication or project creation.

# 103. Phase 2 Requirements

Phase 2 shall establish:

- tenant-protected project metadata;
- local project configuration;
- object-storage security;
- database ownership;
- source exclusion from cloud persistence.

# 104. Phase 3 Requirements

Phase 3 is the primary source privacy implementation milestone.

Required:

- `.krv` packaging;
- package allowlist;
- package denylist;
- content scanning;
- debug stripping;
- symbol policy;
- manifest privacy;
- secret scanning;
- checksum;
- signing;
- scan evidence.

# 105. Phase 4 Requirements

Booking and credit services shall receive only:

- project identifiers;
- platform identifiers;
- booking metadata;
- credit information.

They shall never require source access.

# 106. Phase 5 Requirements

Remote execution shall operate entirely from:

- artifact;
- manifest;
- booking;
- authorization;
- resource;
- platform metadata.

No source access shall be required.

# 107. Phase 6 Requirements

The Lab Agent and Runtime shall:

- execute the artifact;
- generate controlled telemetry;
- generate sanitized logs;
- avoid source filesystem access;
- prevent arbitrary source-path reporting.

Physical deployment shall remain subject to safety review.

# 108. Phase 7 Requirements

Results infrastructure shall:

- protect result confidentiality;
- protect video;
- protect telemetry;
- protect logs;
- prevent source inclusion in generated diagnostics;
- provide audit evidence.

# 109. Phase 8 Requirements

Production readiness shall include:

- network verification;
- package scanning verification;
- storage inspection;
- penetration testing;
- privacy regression testing;
- incident response;
- policy review;
- customer documentation.

# 110. Security Testing Strategy

Testing shall occur at four levels:

    Level 1: Unit
       |
       v
    Level 2: Package
       |
       v
    Level 3: Integration
       |
       v
    Level 4: End-to-End Network

All levels are required because no single scanner can establish the entire
source-privacy guarantee.

# 111. Unit Tests

Required unit tests include:

- manifest sanitization;
- path sanitization;
- package allowlist;
- package denylist;
- source detection;
- secret detection;
- debug metadata detection;
- log sanitization;
- telemetry validation;
- error sanitization.

# 112. Package Tests

Required package tests include:

- source-file inclusion;
- `.git` inclusion;
- source maps;
- debug symbols;
- absolute paths;
- private keys;
- credentials;
- source markers;
- malformed archives.

# 113. Integration Tests

Integration tests shall verify:

- upload contains artifact only;
- database contains no source;
- object storage contains only approved package;
- queue payload contains no source;
- audit records contain no source;
- logs contain no source.

# 114. End-to-End Tests

An end-to-end privacy test shall:

1. Create a test project locally.
2. Place unique source markers.
3. Build locally.
4. Package artifact.
5. Run privacy scanner.
6. Upload artifact.
7. Execute remotely.
8. Generate telemetry.
9. Generate logs.
10. Generate results.
11. Download results.
12. Inspect all remote data.
13. Verify source markers are absent except where intentionally compiled into
   executable behavior.

# 115. Network Capture Test

The test environment shall capture Studio network traffic.

Expected:

    HTTPS
      |
      +---- API metadata
      +---- Artifact upload
      +---- Authenticated control messages

Not expected:

    source/main.cpp
    source/archive.tar
    compiler-input.txt
    .git/objects/*
    source snippets

# 116. Storage Inspection Test

After execution, automated tests shall inspect:

- PostgreSQL;
- object storage;
- queues;
- worker scratch storage;
- logs;
- audit storage.

The source test marker must not appear.

# 117. Result Inspection Test

Results shall be scanned for:

- source markers;
- source paths;
- credentials;
- compiler diagnostics;
- debug information.

Result generation shall not create a new source-leakage path.

# 118. Telemetry Inspection Test

Telemetry shall be tested using:

- source markers;
- private path markers;
- fake credentials.

Expected result:

- source marker absent unless intentionally emitted by the test application;
- local path absent;
- fake credential rejected or sanitized.

# 119. Diagnostic Inspection Test

Diagnostics shall be generated from:

- compiler failure;
- runtime crash;
- invalid configuration;
- failed deployment.

The resulting remote diagnostics shall contain no source contents.

# 120. Audit Inspection Test

Audit records shall be checked for:

- actor;
- organization;
- project;
- artifact;
- checksum;
- Run;
- outcome.

They shall not contain:

- source;
- source paths;
- source snippets;
- secrets.

# 121. Security Review Checklist

Architecture review shall verify:

- [ ] Source boundary is explicit.
- [ ] Local build is authoritative.
- [ ] Upload API is artifact-only.
- [ ] No cloud source dependency exists.
- [ ] Package allowlist exists.
- [ ] Source scanner exists.
- [ ] Debug policy exists.
- [ ] Symbol policy exists.
- [ ] Telemetry policy exists.
- [ ] Diagnostic policy exists.
- [ ] Audit policy exists.

# 122. Acceptance Criteria: Local Build

- [ ] Normal builds execute locally.
- [ ] Normal tests execute locally.
- [ ] Source is not sent to the Control Plane.
- [ ] Compiler input remains local.
- [ ] Compiler diagnostics remain local by default.
- [ ] Build workspace remains local.
- [ ] Build caches remain local.
- [ ] Source directories are not recursively uploaded.

# 123. Acceptance Criteria: Artifact

- [ ] `.krv` is the remote execution unit.
- [ ] Artifact has immutable identity.
- [ ] Artifact contains only approved content.
- [ ] Package allowlist is enforced.
- [ ] Package denylist is enforced.
- [ ] Content scanning is implemented.
- [ ] Secret scanning is implemented.
- [ ] Source scanning is implemented.
- [ ] Artifact checksum is generated.
- [ ] Artifact signature is generated where required.

# 124. Acceptance Criteria: Manifest

- [ ] Manifest contains platform identity.
- [ ] Manifest contains architecture.
- [ ] Manifest contains runtime compatibility.
- [ ] Manifest contains SDK compatibility.
- [ ] Manifest contains capabilities.
- [ ] Manifest contains entrypoint.
- [ ] Manifest contains checksum/signature metadata.
- [ ] Manifest contains no source contents.
- [ ] Manifest contains no secrets.
- [ ] Manifest does not expose absolute local paths.

# 125. Acceptance Criteria: Debug Information

- [ ] Production source-level debug information is removed.
- [ ] Production source paths are removed.
- [ ] Source maps are removed.
- [ ] Private symbols are removed.
- [ ] Required runtime symbols are explicitly allowlisted.
- [ ] Development debug artifacts are classified.
- [ ] Development artifacts cannot silently become Production artifacts.

# 126. Acceptance Criteria: Telemetry and Logs

- [ ] Telemetry API does not read source files automatically.
- [ ] Runtime logs do not contain source by default.
- [ ] Runtime logs do not contain secrets.
- [ ] Absolute local source paths are removed.
- [ ] Crash reports are sanitized.
- [ ] Environment dumps are prohibited.
- [ ] Application telemetry is size/rate controlled.
- [ ] Result data is tenant protected.

# 127. Acceptance Criteria: Diagnostics

- [ ] Compiler diagnostics remain local by default.
- [ ] Build failures do not upload source.
- [ ] Runtime stack traces are sanitized.
- [ ] Crash dumps are not automatically uploaded.
- [ ] Support bundles exclude source by default.
- [ ] Explicit diagnostic sharing is clearly separated from normal execution.

# 128. Acceptance Criteria: Verification

- [ ] Source inclusion tests exist.
- [ ] Secret inclusion tests exist.
- [ ] Path leakage tests exist.
- [ ] Debug-symbol tests exist.
- [ ] Network capture tests exist.
- [ ] Storage inspection tests exist.
- [ ] Queue inspection tests exist.
- [ ] Audit inspection tests exist.
- [ ] Telemetry inspection tests exist.
- [ ] Results inspection tests exist.

# 129. Acceptance Criteria: Security

- [ ] Artifact upload requires authentication.
- [ ] Artifact upload requires authorization.
- [ ] Artifact access is tenant scoped.
- [ ] Object storage is private.
- [ ] Artifact downloads are authorized.
- [ ] Signed URLs are short-lived.
- [ ] Artifact integrity is verified.
- [ ] Artifact compatibility is verified.
- [ ] Revoked artifacts cannot execute.

# 130. Acceptance Criteria: Operations

- [ ] Privacy scanner version is recorded.
- [ ] Privacy policy version is recorded.
- [ ] Scan results are auditable.
- [ ] Privacy incidents have response procedures.
- [ ] Privacy regressions block release.
- [ ] Security reviews occur on architecture changes.
- [ ] Production privacy verification is documented.
- [ ] Customer documentation explains the source boundary.

# 131. Open Questions

The following require explicit decisions before final Production sign-off:

1. Which exact archive/package format will `.krv` use?
2. Which languages must the source scanner recognize initially?
3. Which binary-analysis library will inspect debug sections?
4. Which symbol formats must be stripped?
5. Will source-derived fingerprints be retained?
6. Which build provenance fields are mandatory?
7. Will commit identifiers be retained?
8. Will private dependency names be allowed in manifests?
9. What exact scanner false-positive workflow will be provided?
10. Will customer-controlled signing keys be supported?
11. Will HSM/KMS-backed artifact signing be used?
12. Will Development artifacts support remote debugging?
13. What exact telemetry fields are permitted?
14. What is the maximum telemetry payload size?
15. Will customer-defined telemetry schemas be validated?
16. What diagnostic data may support personnel access?
17. What artifact retention period applies?
18. What result retention period applies?
19. What formal customer notification policy applies to source leakage?
20. Will future source-sharing functionality ever be supported?

# 132. Residual Security Position

The Kritva RaaS source privacy guarantee is architectural, not merely procedural.

The cloud does not receive source because:

1. Source is developed locally.
2. Builds execute locally.
3. Tests execute locally.
4. Packaging executes locally.
5. Privacy scanning executes locally.
6. Signing executes locally or through an approved signing boundary.
7. Only `.krv` artifacts cross the upload boundary.
8. Server APIs do not require source.
9. Cloud storage does not contain source.
10. Runtime does not require source.
11. Telemetry does not automatically read source.
12. Logs are sanitized.
13. Diagnostics are sanitized.
14. Production artifacts are scanned.

# 133. Final Source Privacy Invariants

The following invariants are mandatory:

1. Customer source code shall remain on the developer machine during normal
   RaaS operation.
2. The normal RaaS upload contract shall contain no source payload.
3. Local builds shall not depend on cloud source access.
4. Local tests shall not depend on cloud source access.
5. `.krv` shall be the normal remote execution unit.
6. Production artifacts shall pass a local source-inclusion scan.
7. Production artifacts shall not contain source files.
8. Production artifacts shall not contain source maps.
9. Production artifacts shall not contain full source-level debug information.
10. Production artifacts shall not contain secrets.
11. Manifest data shall not contain source contents.
12. Manifest data shall not expose sensitive absolute local paths.
13. Compiler diagnostics shall remain local by default.
14. Crash dumps shall remain local by default.
15. Telemetry shall not automatically read source.
16. Runtime logs shall not automatically read source.
17. Queue messages shall not contain source.
18. PostgreSQL shall not store source.
19. Object storage shall not store source.
20. Administrators shall not have a normal cloud-side mechanism to retrieve
    customer source.
21. Remote execution shall not require source.
22. Physical robot execution shall not require source.
23. Privacy-scan failure shall block Production upload.
24. Security-sensitive privacy exceptions shall be explicit and auditable.
25. Source privacy regressions shall block Production release until resolved.

# 134. Final Architecture

    +-------------------------------------------------------------------+
    |                       CUSTOMER MACHINE                            |
    |                                                                   |
    |  +-------------+       +----------------+       +---------------+ |
    |  | Source Tree | ----> | Local Build    | ----> | Local Tests   | |
    |  +-------------+       +----------------+       +-------+-------+ |
    |                                                        |         |
    |                                                        v         |
    |                                               +----------------+ |
    |                                               | Package .krv   | |
    |                                               +--------+-------+ |
    |                                                        |         |
    |                                                        v         |
    |                                               +----------------+ |
    |                                               | Privacy Scan   | |
    |                                               +--------+-------+ |
    |                                                        |         |
    |                                                        v         |
    |                                               +----------------+ |
    |                                               | Sign Artifact  | |
    |                                               +--------+-------+ |
    +--------------------------------------------------------|---------+
                                                             |
                                                             | .krv only
                                                             v
    +-------------------------------------------------------------------+
    |                          RAAS CLOUD                               |
    |                                                                   |
    |  API -> Authentication -> Authorization -> Validation             |
    |                              |                                    |
    |                              v                                    |
    |                       Artifact Storage                             |
    |                              |                                    |
    |                              v                                    |
    |                       Booking / Job                               |
    |                              |                                    |
    +------------------------------|------------------------------------+
                                   |
                                   | secure lab channel
                                   v
    +-------------------------------------------------------------------+
    |                           LAB                                     |
    |                                                                   |
    |  Lab Agent -> Local Policy -> Kritva Runtime -> Robot             |
    |                                                                   |
    |  Safety Controller / Emergency Stop remain independent             |
    +-------------------------------------------------------------------+

The definitive product guarantee is:

> Kritva RaaS does not need the customer's source code to build, package, book,
> upload, deploy, execute, monitor, or analyze a robotics application remotely.
> The normal product boundary is the signed `.krv` artifact. Customer source
> remains on the developer machine, while artifact integrity, tenant isolation,
> telemetry controls, diagnostics sanitization, and continuous verification
> protect the information that does cross the boundary.
