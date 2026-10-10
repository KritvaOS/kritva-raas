# Kritva RaaS Artifact Security

## 1. Purpose

This document defines the production-grade security architecture and requirements
for executable artifacts used by Kritva RaaS.

The artifact is the primary security object crossing the boundary between the
developer machine and the RaaS cloud.

The security model is:

    Customer Source
         |
         v
    Local Build
         |
         v
    Local Test
         |
         v
    Package
         |
         v
    Privacy / Security Scan
         |
         v
    Manifest
         |
         v
    Checksum
         |
         v
    Signature
         |
         v
    .krv Artifact
         |
         | artifact only
         v
    RaaS Control Plane
         |
         v
    Validation
         |
         v
    Booking / Authorization
         |
         v
    Lab Agent
         |
         v
    Runtime Sandbox / Policy
         |
         v
    Robot

The artifact security architecture shall protect:

- artifact integrity;
- artifact authenticity;
- artifact provenance;
- customer intellectual property;
- target compatibility;
- runtime safety;
- capability authorization;
- supply-chain integrity;
- artifact storage;
- artifact deployment;
- artifact execution;
- artifact revocation;
- artifact retention and deletion.

The core principle is:

> No artifact shall execute remotely unless its identity, integrity, provenance,
> authorization, compatibility, policy, and execution context have been validated.

## 2. Scope

This document applies to:

- `.krv` artifact format;
- artifact packaging;
- manifest generation;
- artifact checksums;
- artifact signatures;
- signing keys;
- provenance;
- local privacy scanning;
- malware scanning;
- policy scanning;
- artifact upload;
- object storage;
- artifact metadata in PostgreSQL;
- artifact validation;
- artifact deployment;
- Lab Agent validation;
- runtime execution;
- sandboxing;
- capability authorization;
- artifact revocation;
- artifact retention;
- secure deletion;
- artifact downloads;
- audit records;
- supply-chain dependencies;
- artifact incident response.

## 3. Non-Goals

This document does not define:

- application source-code privacy in full;
- general user authentication;
- complete tenant authorization architecture;
- physical robot safety certification;
- detailed robot control algorithms;
- compiler implementation;
- specific cloud provider;
- specific container runtime;
- a guarantee that arbitrary application behavior is safe.

Source-code privacy is defined separately in:

    docs/security/SOURCE_CODE_PRIVACY.md

The artifact security model complements, but does not replace, physical robot
safety mechanisms.

## 4. Goals

Artifact security shall:

1. Establish immutable artifact identity.
2. Detect artifact tampering.
3. Authenticate artifact origin.
4. Preserve artifact provenance.
5. Detect prohibited package contents.
6. Detect malware where applicable.
7. Validate target compatibility.
8. Enforce declared capabilities.
9. Enforce actual runtime capabilities.
10. Restrict filesystem access.
11. Restrict network access.
12. Restrict process privileges.
13. Restrict resource consumption.
14. Prevent unauthorized hardware access.
15. Support artifact revocation.
16. Support secure retention and deletion.
17. Support incident investigation.
18. Prevent execution of invalid artifacts.
19. Support deterministic security decisions.
20. Provide auditable evidence.

# 5. Security Principles

## 5.1 Artifact Is a Security Boundary

The `.krv` artifact is not merely a compressed executable.

It is a security-controlled execution unit with:

- identity;
- manifest;
- integrity;
- provenance;
- signature;
- policy classification;
- target compatibility;
- capability requirements.

## 5.2 Verify Before Trust

The artifact shall be treated as untrusted until validation completes.

    Uploaded Artifact
          |
          v
    Parse Safely
          |
          v
    Verify Integrity
          |
          v
    Verify Signature
          |
          v
    Verify Provenance
          |
          v
    Scan Security
          |
          v
    Validate Compatibility
          |
          v
    Validate Capabilities
          |
          v
    Validate Booking
          |
          v
    Validate Runtime Policy
          |
          v
    Execute

## 5.3 Fail Closed

If validation cannot establish required security properties:

    UNKNOWN
       |
       v
    EXECUTION DENIED

Examples:

- invalid signature;
- checksum mismatch;
- revoked signing key;
- unsupported manifest;
- incompatible architecture;
- failed malware scan;
- prohibited capability;
- expired artifact;
- invalid provenance;
- unavailable policy decision.

## 5.4 Defense in Depth

No single mechanism shall be considered sufficient.

Required layers include:

- checksum;
- digital signature;
- manifest validation;
- provenance;
- malware/policy scanning;
- compatibility validation;
- authorization;
- capability enforcement;
- runtime sandbox;
- local Lab Agent policy;
- physical safety controls.

# 6. Definitions

| Term | Definition |
|---|---|
| Artifact | Packaged executable `.krv` unit |
| Manifest | Structured artifact metadata |
| Artifact ID | Immutable logical artifact identity |
| Digest | Cryptographic hash of artifact data |
| Signature | Cryptographic proof of artifact authenticity/integrity |
| Signing Key | Cryptographic key authorized to sign artifacts |
| Provenance | Evidence describing artifact origin and build process |
| Capability | Permission/resource required by an application |
| Scanner | Security analysis component |
| Policy | Rules governing artifact acceptance/execution |
| Revocation | Invalidating an artifact/key before normal expiry |
| Sandbox | Restricted execution environment |
| Runtime | Environment executing the artifact |
| Lab Agent | Local service controlling laboratory execution |
| Target | Platform/resource on which artifact executes |
| SBOM | Software Bill of Materials |
| Dependency | Software required by the artifact |
| Vulnerability | Known or suspected security weakness |
| Retention | Period during which an artifact is retained |
| Secure Deletion | Controlled removal that prevents normal future retrieval |
| Provenance Attestation | Signed or otherwise authenticated build-origin evidence |

# 7. Artifact Security Classification

| Artifact State | Meaning | Execution |
|---|---|---|
| UPLOADED | Received but not validated | No |
| VALIDATING | Security validation in progress | No |
| VALID | Security checks passed | Conditional |
| APPROVED | Eligible for target execution | Yes |
| REVOKED | Explicitly invalidated | No |
| EXPIRED | Outside permitted lifetime | No |
| QUARANTINED | Security investigation | No |
| REJECTED | Validation failed | No |
| ARCHIVED | Retained but inactive | No |
| PURGED | Securely deleted | No |

# 8. Artifact Lifecycle

The canonical lifecycle is:

    CREATED
       |
       v
    PACKAGED
       |
       v
    SCANNED
       |
       v
    SIGNED
       |
       v
    UPLOADED
       |
       v
    VALIDATING
       |
       v
    VALID
       |
       v
    APPROVED
       |
       +------------------+
       |                  |
       v                  v
    EXECUTING           REVOKED
       |                  |
       v                  v
    COMPLETED          QUARANTINED
       |
       v
    ARCHIVED
       |
       v
    PURGED

A validation failure transitions the artifact to REJECTED or QUARANTINED
according to policy.

# 9. Artifact Package Model

The `.krv` package shall have a versioned format.

Conceptual package:

    application.krv
      |
      +-- manifest.json
      +-- executable/
      +-- libraries/
      +-- resources/
      +-- runtime-config/
      +-- integrity/
      +-- signature/

The actual package structure may evolve, but every version shall define:

- required entries;
- optional entries;
- prohibited entries;
- canonicalization rules;
- hashing rules;
- signing rules;
- compatibility rules.

# 10. Package Allowlist

Production artifacts shall contain only approved content.

| Content | Status |
|---|---|
| Executable | Allowed |
| Required runtime library | Allowed |
| Approved resource | Allowed |
| Runtime configuration | Allowed |
| Manifest | Required |
| Integrity metadata | Required |
| Signature metadata | Required |
| Source code | Prohibited |
| Git metadata | Prohibited |
| Source maps | Prohibited |
| Full debug symbols | Prohibited |
| Compiler caches | Prohibited |
| Build scripts | Prohibited |
| Credentials | Prohibited |
| Private keys | Prohibited |
| Temporary files | Prohibited |

# 11. Artifact Identity

Every artifact shall have a unique immutable identifier.

The artifact identity shall not be reused after deletion.

Recommended conceptual identity:

    artifact_id
    organization_id
    project_id
    application_id
    version
    platform_id
    platform_version
    architecture
    digest

The digest shall provide content identity.

The artifact ID provides business identity.

# 12. Artifact Digest

The artifact shall have a cryptographic digest.

The digest shall be calculated over a canonical representation of the artifact.

The digest shall be:

- cryptographically strong;
- stored with artifact metadata;
- validated after upload;
- validated before execution;
- included in provenance;
- included in audit records.

Example:

    sha256:<hex-digest>

The exact approved algorithm shall be centrally defined.

# 13. Canonicalization

Signature and digest verification require deterministic canonicalization.

The artifact format shall define:

- file ordering;
- metadata encoding;
- newline normalization where applicable;
- compression handling;
- manifest canonicalization;
- signature field exclusion/inclusion rules.

Ambiguous representations shall not be accepted.

# 14. Signature Model

The artifact signature establishes authenticity and integrity.

The conceptual process is:

    Artifact
       |
       v
    Canonicalize
       |
       v
    Digest
       |
       v
    Sign
       |
       v
    Signature + Key ID

Verification:

    Artifact
       |
       v
    Canonicalize
       |
       v
    Digest
       |
       +---- Compare expected digest
       |
       v
    Verify Signature
       |
       v
    Trusted Key?
       |
       v
    PASS / FAIL

# 15. Signing Requirements

Signing shall:

1. Use approved cryptographic algorithms.
2. Use protected private keys.
3. Associate signatures with key IDs.
4. Support key rotation.
5. Support key revocation.
6. Record signing time.
7. Bind the signature to artifact identity.
8. Bind the signature to artifact content.
9. Bind the signature to the applicable manifest.
10. Reject malformed signatures.

# 16. Signing Key Protection

Signing keys are among the highest-value RaaS security assets.

Private keys shall:

- never be committed to source control;
- never be embedded in Studio source;
- never be embedded in artifacts;
- not be transmitted unnecessarily;
- be access controlled;
- be rotated;
- be revocable;
- be auditable.

Production signing should use an approved protected key-management mechanism,
such as an HSM/KMS-backed service where appropriate.

# 17. Key Hierarchy

The architecture should distinguish:

- development signing keys;
- test signing keys;
- research signing keys;
- production signing keys.

Example:

    Development Key
          |
          X
    Production Robot

Production robot execution shall not automatically trust development keys.

# 18. Signing Trust Store

The Control Plane and Lab Agent shall maintain or obtain an authoritative
trust configuration containing:

- key ID;
- public key;
- status;
- validity period;
- artifact policy;
- environment;
- platform scope where required.

Unknown signing keys shall not be trusted.

# 19. Key Rotation

Key rotation shall support:

    Active Key
        |
        v
    New Key Provisioned
        |
        v
    New Artifacts -> New Key
        |
        v
    Old Key -> Verification Only
        |
        v
    Old Key -> Revoked

Previously valid artifacts may remain executable only according to explicit
key-revocation policy.

# 20. Key Revocation

A signing key may be revoked due to:

- suspected compromise;
- confirmed compromise;
- personnel/security event;
- cryptographic weakness;
- policy violation.

Revocation shall be auditable.

The system shall support determining all artifacts signed by a revoked key.

# 21. Artifact Revocation

An individual artifact may be revoked because:

- malware is discovered;
- source/privacy violation is discovered;
- malicious behavior is identified;
- compatibility defect is found;
- signing identity is compromised;
- policy changes;
- customer requests removal;
- artifact integrity becomes uncertain.

Revoked artifacts shall not be eligible for new execution.

# 22. Manifest

The manifest is the authoritative artifact declaration.

It shall contain, at minimum:

    {
        "artifact_id": "...",
        "format_version": "1.0",
        "application_id": "...",
        "version": "...",
        "platform_id": "...",
        "platform_version": "...",
        "architecture": "...",
        "kritva_os_version": "...",
        "sdk_version": "...",
        "entrypoint": "...",
        "required_capabilities": [],
        "artifact_digest": "sha256:...",
        "signing_key_id": "...",
        "artifact_class": "PRODUCTION"
    }

The manifest shall not contain:

- source code;
- secrets;
- private keys;
- absolute local source paths;
- credentials;
- arbitrary environment variables.

# 23. Manifest Integrity

The manifest shall be cryptographically bound to the artifact.

Changing:

- platform;
- architecture;
- capabilities;
- entrypoint;
- runtime requirements;

shall invalidate the original integrity/signature relationship.

A client shall not be able to modify the manifest after signing without detection.

# 24. Capability Declarations

Artifacts shall declare required capabilities.

Examples:

    camera
    depth_camera
    imu
    lidar
    microphone
    gpu
    network
    ethercat
    motor_control
    gpio
    filesystem_write
    filesystem_read

Capabilities shall be explicit rather than inferred only at runtime.

# 25. Capability Authorization

The manifest declaration is not permission.

The authorization model is:

    Artifact Declares Capability
              |
              v
    Platform Supports Capability
              |
              v
    Project Authorized
              |
              v
    Booking Permits Capability
              |
              v
    Lab Policy Permits Capability
              |
              v
    Runtime Grants Capability
              |
              v
    Execution

A capability missing from the manifest shall not be silently granted.

# 26. Capability Denial

If:

    requested capability
          >
    authorized capability

execution shall be denied.

Examples:

- artifact requests motor control but booking is simulation-only;
- artifact requests camera but platform lacks camera;
- artifact requests EtherCAT but resource policy prohibits EtherCAT;
- artifact requests network access but network policy denies it.

# 27. Capability Least Privilege

Applications should request only the capabilities required.

Default runtime policy should be:

    no network
    no unrestricted filesystem
    no host process execution
    no privileged device access
    no access to unrelated resources

Capabilities shall be granted explicitly.

# 28. Target Compatibility

Before execution, the system shall validate:

- platform ID;
- platform version;
- architecture;
- operating system/runtime;
- KritvaOS version;
- SDK compatibility;
- ABI compatibility;
- required capabilities;
- resource configuration.

The authoritative platform catalog remains the source of truth.

# 29. Compatibility Decision

Conceptual interface:

    validate_compatibility(
        artifact_manifest,
        platform_version,
        architecture,
        resource_configuration
    ) -> CompatibilityResult

The result shall identify:

    COMPATIBLE
    INCOMPATIBLE
    UNKNOWN

UNKNOWN shall fail closed for Production execution.

# 30. Provenance

Artifact provenance shall answer:

- where the artifact came from;
- which application produced it;
- which toolchain created it;
- which SDK was used;
- which target it was built for;
- which dependencies were used;
- which scanner evaluated it;
- which key signed it.

Provenance shall not contain source contents.

# 31. Provenance Metadata

Recommended provenance:

| Field | Purpose |
|---|---|
| Artifact ID | Artifact identity |
| Build ID | Build traceability |
| Application ID | Application identity |
| Toolchain | Build environment |
| Compiler version | Compatibility |
| SDK version | Runtime compatibility |
| KritvaOS version | Runtime compatibility |
| Platform | Target identity |
| Architecture | CPU target |
| Dependency versions | Supply-chain traceability |
| Scanner version | Security evidence |
| Policy version | Security policy |
| Signing key ID | Authenticity |
| Build timestamp | Timeline |
| Digest | Content identity |

# 32. SBOM

Production artifacts should have an associated Software Bill of Materials.

The SBOM may contain:

- component name;
- version;
- package identifier;
- license;
- dependency relationship;
- vulnerability identifiers where known.

The SBOM shall not contain:

- source contents;
- private credentials;
- private repository credentials;
- unnecessary local filesystem paths.

# 33. SBOM Security

SBOMs shall be integrity-protected.

The SBOM shall be associated with:

- artifact ID;
- artifact digest;
- generation timestamp;
- generator version.

An SBOM mismatch shall trigger policy evaluation.

# 34. Dependency Security

Dependencies shall be evaluated before Production artifact approval.

The process shall include:

    Dependency Resolution
          |
          v
    Version Locking
          |
          v
    SBOM Generation
          |
          v
    Vulnerability Scan
          |
          v
    Policy Evaluation
          |
          v
    Artifact Approval

# 35. Vulnerability Policy

Dependency findings shall be classified.

Example:

| Severity | Default Action |
|---|---|
| Critical | Block |
| High | Block or explicit security approval |
| Medium | Policy dependent |
| Low | Track |
| Unknown | Review |

Policy may vary by platform and artifact class.

# 36. Malware Scanning

Artifacts shall be scanned for malware before Production execution.

Scanning may include:

- executable signature analysis;
- known malware detection;
- suspicious package structures;
- embedded payload detection;
- known malicious libraries;
- prohibited executable behavior indicators.

Malware scanning shall be performed:

- locally where practical;
- server-side before approval;
- at additional execution boundaries where risk justifies.

# 37. Malware Scanner Failure

If malware scanning is unavailable or inconclusive:

    Scan Unavailable
         |
         v
    Artifact Not Approved
         |
         v
    Execution Blocked

Production execution shall not silently bypass malware scanning.

# 38. Policy Scanning

Policy scanning shall detect:

- prohibited files;
- prohibited capabilities;
- prohibited network access;
- prohibited privileges;
- source inclusion;
- secrets;
- unsupported runtime features;
- unsupported architecture;
- disallowed dependencies.

# 39. Scanner Independence

Security scanning should use independent controls where practical.

For example:

    Local Scanner
         |
         v
    Upload
         |
         v
    Server Scanner
         |
         v
    Lab Validation

A single compromised scanner should not automatically grant execution.

# 40. Artifact Tamper Detection

Tampering may occur:

- before upload;
- during upload;
- in object storage;
- in transit to Lab Agent;
- before execution;
- during deployment.

Controls:

- digest;
- signature;
- TLS;
- immutable storage;
- storage integrity checks;
- deployment verification;
- runtime startup verification.

# 41. Upload Integrity

The upload flow shall verify:

    Local Digest
         |
         v
    Uploaded Object
         |
         v
    Server Digest
         |
         v
    Compare
         |
      +--+--+
      |     |
     PASS  FAIL
      |     |
      v     v
    Store  Reject

A mismatch shall result in rejection and investigation according to policy.

# 42. Storage Integrity

Artifact storage shall use:

- immutable object identity;
- checksum;
- access controls;
- versioning where appropriate;
- protected lifecycle policy.

Artifact objects shall not be modified in place after approval.

# 43. Deployment Integrity

Before deployment:

    Stored Artifact
          |
          v
    Recalculate Digest
          |
          v
    Verify Stored Digest
          |
          v
    Verify Signature
          |
          v
    Verify Policy
          |
          v
    Deploy

A failed check shall prevent deployment.

# 44. Runtime Startup Verification

The runtime should verify the artifact identity before startup.

At minimum:

- artifact digest;
- manifest;
- signature status;
- execution authorization;
- platform identity;
- capability grant.

The runtime shall not execute a different binary than the one validated.

# 45. Sandbox Model

Untrusted application code shall execute under explicit runtime constraints.

Conceptual model:

    +-----------------------------------------+
    |             Runtime Host               |
    |                                         |
    |  +-----------------------------------+  |
    |  |       Application Sandbox         |  |
    |  |                                   |  |
    |  | executable                       |  |
    |  | libraries                        |  |
    |  | approved resources               |  |
    |  | temporary storage                |  |
    |  +-----------------------------------+  |
    |                                         |
    |  Policy Enforcement                     |
    +-----------------------------------------+

# 46. Filesystem Restrictions

Default application permissions:

- read approved application files;
- write only approved temporary locations;
- no access to host secrets;
- no access to unrelated projects;
- no access to other tenants;
- no access to host operating-system credentials.

Filesystem access shall be capability-controlled where practical.

# 47. Process Restrictions

The application shall not automatically receive unrestricted ability to:

- create privileged processes;
- change system configuration;
- access host process namespaces;
- load arbitrary privileged modules;
- execute shell commands outside policy.

Process creation should be denied by default unless explicitly required.

# 48. Network Restrictions

Network access shall be denied by default unless declared and authorized.

If network capability is granted:

- destinations may be restricted;
- protocols may be restricted;
- bandwidth may be limited;
- connection count may be limited;
- DNS access may be controlled;
- external Internet access may be disabled.

# 49. Hardware Access

Hardware access shall be mediated.

The application shall not receive unrestricted device access.

Examples requiring explicit policy:

- camera;
- microphone;
- GPU;
- GPIO;
- SPI;
- I2C;
- UART;
- EtherCAT;
- motor controllers;
- encoder interfaces.

# 50. Privilege Restrictions

Application execution shall use the least privileged available identity.

Production workloads should not run as:

- root;
- administrator;
- privileged operating-system identity.

Exceptions require platform-specific security review.

# 51. Resource Limits

Runtime shall enforce limits for:

- CPU;
- memory;
- disk;
- process count;
- file descriptors;
- network connections;
- telemetry rate;
- log rate;
- execution duration.

Resource exhaustion shall not compromise other workloads.

# 52. Execution Time Limits

Every Job shall have an execution policy.

Possible limits:

- maximum duration;
- maximum CPU;
- maximum memory;
- maximum storage;
- maximum telemetry;
- maximum network.

Timeout shall result in controlled termination.

# 53. Runtime Isolation

Where multiple users or organizations share infrastructure, workloads shall be
isolated according to the risk profile.

Possible mechanisms include:

- containers;
- virtual machines;
- process isolation;
- namespaces;
- mandatory access controls;
- dedicated execution hosts.

The final mechanism is implementation-specific but the security objective is
mandatory.

# 54. Tenant Runtime Isolation

A workload shall never have access to:

- another tenant's filesystem;
- another tenant's artifact;
- another tenant's secrets;
- another tenant's process;
- another tenant's telemetry;
- another tenant's network namespace.

# 55. Simulator Isolation

Simulation workloads shall follow the same artifact validation rules as physical
workloads.

Simulator execution may use a less restrictive physical safety layer but shall
not bypass:

- authentication;
- authorization;
- tenant isolation;
- artifact integrity;
- malware scanning.

# 56. Physical Robot Execution

Physical execution requires additional controls:

    Artifact Valid
         |
         v
    Platform Compatible
         |
         v
    Booking Valid
         |
         v
    Resource Allocated
         |
         v
    Robot Healthy
         |
         v
    Lab Policy Valid
         |
         v
    Capability Authorized
         |
         v
    Human Safety Gate
         |
         v
    Execute

Physical safety remains local.

# 57. Lab Agent Artifact Validation

The Lab Agent shall independently verify:

- artifact identity;
- digest;
- signature;
- trust key;
- revocation;
- target platform;
- architecture;
- capabilities;
- policy;
- booking;
- resource state.

The Lab Agent shall not rely solely on an earlier Control Plane decision.

# 58. Lab Agent Trust Model

The Lab Agent is trusted to enforce local policy but shall remain least privileged.

It shall:

- serve assigned resources;
- validate execution;
- enforce local policy;
- report state;
- stop execution according to local policy.

It shall not become a general-purpose administrative gateway.

# 59. Artifact Deployment Protocol

Conceptual flow:

    Control Plane
         |
         | artifact + metadata
         v
    Lab Agent
         |
         v
    Verify Digest
         |
         v
    Verify Signature
         |
         v
    Verify Policy
         |
         v
    Verify Resource
         |
         v
    Stage Artifact
         |
         v
    Final Verification
         |
         v
    Start Runtime

# 60. Secure Staging

Artifacts shall be staged into controlled storage.

Staging shall:

- prevent cross-tenant access;
- prevent unauthorized modification;
- use unique job/run identity;
- enforce size limits;
- support cleanup;
- avoid execution directly from an unverified download stream.

# 61. Secure Deletion of Staged Artifacts

After execution, staged artifacts shall be removed according to policy.

Secure deletion shall account for:

- local filesystem;
- temporary directories;
- container layers;
- worker scratch space;
- cache;
- object storage lifecycle.

Where physical secure erasure cannot be guaranteed, encryption plus key
destruction may be used where appropriate.

# 62. Artifact Retention

Retention shall distinguish:

- active artifacts;
- archived artifacts;
- revoked artifacts;
- quarantined artifacts;
- temporary copies;
- execution staging copies;
- backups.

Indicative policy:

| Artifact Copy | Retention |
|---|---|
| Active artifact | Policy-defined |
| Staging copy | Until execution completion + cleanup |
| Temporary upload | Short |
| Revoked artifact | Retain metadata/evidence, binary policy-dependent |
| Quarantined artifact | Investigation period |
| Archived artifact | Long-term if required |
| Backup copy | Backup lifecycle |

# 63. Artifact Deletion

Deletion shall be authorization-controlled.

Deletion shall:

- mark business state first;
- prevent new execution;
- remove active object access;
- follow storage lifecycle;
- preserve required audit metadata;
- respect legal/financial retention requirements.

# 64. Secure Deletion Model

    Delete Request
         |
         v
    Authorization
         |
         v
    Revoke Execution
         |
         v
    Mark Deleted
         |
         v
    Remove Active Storage
         |
         v
    Lifecycle Purge
         |
         v
    Backup Expiry
         |
         v
    Deletion Evidence

Artifact IDs shall not be reused.

# 65. Quarantine

Potentially malicious artifacts shall be quarantined.

Quarantine shall prevent:

- execution;
- normal download;
- automatic deployment;
- normal sharing.

Quarantined artifacts may be retained for investigation according to security
retention policy.

# 66. Malware Incident Handling

If an artifact is determined malicious:

1. Revoke artifact.
2. Block new execution.
3. Identify affected Runs.
4. Identify affected resources.
5. Identify related signing key.
6. Identify related dependencies.
7. Preserve evidence.
8. Notify affected parties where required.
9. Review executed behavior.
10. Add regression detection.

# 67. Supply-Chain Threat Model

Supply-chain threats include:

- compromised dependency;
- malicious package;
- typosquatting;
- dependency confusion;
- compromised compiler;
- compromised SDK;
- compromised base image;
- malicious build tool;
- CI compromise;
- signing-key compromise.

# 68. Supply-Chain Controls

Required controls include:

- dependency pinning;
- lockfiles;
- dependency scanning;
- SBOM;
- provenance;
- signed release artifacts;
- protected CI;
- least-privilege build identities;
- vulnerability monitoring;
- controlled toolchains.

# 69. Toolchain Trust

The local build toolchain is outside the RaaS cloud trust boundary.

Kritva shall publish supported toolchain versions where appropriate.

Artifact provenance should identify:

- compiler;
- linker;
- SDK;
- runtime;
- relevant build tools.

# 70. SDK Security

The SDK shall be versioned.

The artifact shall identify SDK compatibility.

Unsupported SDK versions shall not automatically execute on Production platforms.

SDK vulnerabilities shall be assessed for affected artifacts.

# 71. Runtime Security Updates

When a runtime vulnerability is discovered:

- affected platform versions shall be identified;
- affected artifacts shall be identified;
- execution policy may block vulnerable combinations;
- customers may need to rebuild;
- old artifacts may be revoked or retired.

# 72. Artifact Security Policy Engine

Conceptual interface:

    evaluate_artifact(
        artifact,
        manifest,
        provenance,
        target,
        policy
    ) -> SecurityDecision

Decision:

    APPROVE
    REJECT
    QUARANTINE
    REVIEW

Production automation should not execute REVIEW states.

# 73. Validation Pipeline

The complete validation sequence shall be:

    Receive
      |
      v
    Parse
      |
      v
    Size Check
      |
      v
    Structure Check
      |
      v
    Digest Check
      |
      v
    Signature Check
      |
      v
    Manifest Check
      |
      v
    Provenance Check
      |
      v
    Privacy Check
      |
      v
    Malware Check
      |
      v
    Dependency/SBOM Check
      |
      v
    Policy Check
      |
      v
    Compatibility Check
      |
      v
    Capability Check
      |
      v
    Approve / Reject / Quarantine

# 74. Validation Ordering

Cheap deterministic checks should occur early:

1. request authentication;
2. size;
3. structure;
4. checksum;
5. signature;
6. manifest;
7. provenance;
8. scanning;
9. compatibility;
10. policy.

The ordering may be optimized but shall never omit required controls.

# 75. Validation Result

The system shall retain:

- artifact ID;
- digest;
- validation timestamp;
- validator version;
- policy version;
- scanner results;
- compatibility result;
- capability result;
- final decision;
- rejection reason where applicable.

# 76. Audit Requirements

The following artifact events shall be auditable:

- created;
- packaged;
- scanned;
- signed;
- uploaded;
- validated;
- approved;
- rejected;
- quarantined;
- downloaded;
- deployed;
- executed;
- revoked;
- archived;
- deleted.

Audit records shall include:

    actor
    organization
    project
    artifact_id
    digest
    operation
    outcome
    timestamp
    request_id
    policy_version

# 77. Download Security

Artifact downloads shall require authorization.

The system shall use:

- tenant checks;
- project checks;
- role checks;
- short-lived access;
- audit where required.

The artifact itself remains protected intellectual property.

# 78. Artifact Immutability

Once an artifact is approved, its binary shall not be modified.

A changed binary is a new artifact.

This rule simplifies:

- integrity;
- provenance;
- rollback;
- revocation;
- audit;
- incident investigation.

# 79. Artifact Versioning

Application version and artifact identity shall be distinct.

Example:

    Application:
      vision-controller 1.4

    Artifact:
      artifact-0193
      digest sha256:...

Two artifacts with the same application version but different binary content
shall have different artifact identities/digests.

# 80. Rollback

Rollback shall use a previously approved artifact.

Rollback shall still validate:

- signature;
- revocation;
- compatibility;
- policy;
- booking;
- resource state.

An old artifact is not automatically trusted forever.

# 81. Artifact Expiration

Artifacts may have an expiration policy.

Expiration may be based on:

- explicit artifact expiry;
- signing key expiry;
- runtime compatibility;
- platform retirement;
- security policy;
- customer retention policy.

Expired artifacts shall not execute unless an explicit policy permits it.

# 82. Revocation Propagation

Revocation shall propagate to execution boundaries.

Conceptual flow:

    Revoke Artifact
         |
         v
    Control Plane
         |
         +---- Prevent New Jobs
         |
         +---- Notify Lab Agents
         |
         +---- Update Trust/Policy State
         |
         v
    Lab Agent
         |
         v
    Block Execution

Active execution behavior shall follow platform safety policy.

# 83. Active Run and Revocation

Revoking an artifact does not automatically imply unsafe immediate termination.

The response shall depend on:

- physical safety;
- application state;
- platform policy;
- incident severity.

For critical security incidents, local Lab Agent policy may terminate execution
safely.

# 84. Artifact Security and Results

Results generated by an artifact shall retain:

- artifact ID;
- artifact digest;
- platform;
- platform version;
- runtime;
- SDK;
- Run ID.

This allows reconstruction of what executed.

# 85. Historical Integrity

A Run shall retain the artifact digest that actually executed.

Historical results shall not depend on the current mutable artifact record alone.

This prevents ambiguity after:

- revocation;
- deletion;
- platform upgrades;
- key rotation.

# 86. Database Ownership

Artifact metadata belongs to the Artifact domain.

The domain owns:

- artifact identity;
- manifest;
- digest;
- signature metadata;
- provenance;
- validation status;
- lifecycle;
- retention metadata.

Other domains reference the artifact but shall not directly mutate artifact
security state.

# 87. Object Storage Ownership

Artifact binaries belong to the Artifact storage boundary.

Object storage shall not become the business authority.

PostgreSQL remains authoritative for:

- ownership;
- status;
- policy;
- identity;
- lifecycle.

Object storage holds the binary payload.

# 88. Idempotency

Artifact operations shall support idempotency where applicable.

Examples:

- upload;
- registration;
- validation;
- signing;
- revocation;
- deletion.

Duplicate requests shall not create ambiguous artifact identities.

# 89. Race Conditions

Security-sensitive races include:

- upload while artifact is revoked;
- execute while artifact is revoked;
- delete while job is deploying;
- key revocation while artifact is being validated;
- policy update during execution.

State transitions shall be transactional and explicit.

# 90. Artifact State Integrity

Invalid transitions shall be rejected.

Examples:

    PURGED -> APPROVED
    REVOKED -> APPROVED
    REJECTED -> EXECUTING
    UPLOADED -> EXECUTING

shall not be allowed.

# 91. Security State Machine

A simplified state machine:

    CREATED
      |
      v
    PACKAGED
      |
      v
    SCANNED
      |
      v
    SIGNED
      |
      v
    UPLOADED
      |
      v
    VALIDATING
      |
      +----> REJECTED
      |
      +----> QUARANTINED
      |
      v
    VALID
      |
      v
    APPROVED
      |
      +----> REVOKED
      |
      v
    ARCHIVED
      |
      v
    PURGED

# 92. Security and Multi-Tenancy

Artifacts shall always be associated with:

- organization;
- project;
- authorized ownership context.

Cross-tenant artifact references shall fail.

Artifact object storage shall use tenant-scoped access.

# 93. Security and Booking

Artifact security is one input to booking/execution authorization.

Booking shall not authorize:

- invalid artifact;
- revoked artifact;
- incompatible artifact;
- unauthorized capability.

# 94. Security and Credits

Credits do not grant artifact trust.

The sequence remains:

    Valid Artifact
        +
    Authorized User
        +
    Valid Booking
        +
    Valid Credit State
        +
    Valid Resource
        +
    Lab Policy
        =
    Eligible Execution

# 95. Security and Physical Safety

Artifact validation cannot prove that an application is physically safe.

Therefore:

- artifact security;
- runtime security;
- local Lab Agent policy;
- physical safety;

are separate controls.

A valid signature means:

> This artifact is authentic according to the configured trust policy.

It does not mean:

> This application is physically safe.

# 96. Artifact Security Incident

An artifact security incident includes:

- malicious artifact;
- compromised signing key;
- signature bypass;
- checksum bypass;
- scanner bypass;
- malware detection;
- sandbox escape;
- unauthorized capability access;
- artifact storage compromise;
- artifact privacy violation.

Incident response shall include:

1. Identify affected artifact(s).
2. Revoke if necessary.
3. Block new execution.
4. Identify affected Runs.
5. Identify affected resources.
6. Identify affected tenants.
7. Preserve evidence.
8. Contain.
9. Remediate.
10. Add regression tests.
11. Update threat model.
12. Review this document.

# 97. Signing-Key Incident

If a production signing key is compromised:

    Key Compromise
         |
         v
    Revoke Key
         |
         v
    Identify Signed Artifacts
         |
         v
    Assess Execution
         |
         v
    Block Affected Artifacts
         |
         v
    Issue New Key
         |
         v
    Rebuild / Resign
         |
         v
    Restore Approved Set

# 98. Malware Incident

If malware is discovered:

- artifact is quarantined;
- new execution is blocked;
- related artifacts are evaluated;
- dependency chain is inspected;
- signing key is evaluated;
- affected Runs are identified;
- Lab resources are inspected;
- incident evidence is preserved.

# 99. Secure Deletion

Secure deletion shall be policy-driven.

Required controls:

- revoke before deletion;
- prevent new downloads;
- prevent new execution;
- delete active object;
- expire temporary copies;
- follow backup lifecycle;
- preserve required audit evidence.

Audit records should retain:

    artifact_id
    digest
    deletion_time
    deletion_actor
    deletion_reason

The binary may be deleted while minimal audit metadata remains.

# 100. Retention Policy

Recommended initial policy:

| Object | Retention |
|---|---|
| Artifact metadata | Long-term |
| Approved artifact | Customer/policy driven |
| Temporary upload | Short |
| Staging copy | Execution + cleanup window |
| Quarantined artifact | Investigation period |
| Revoked artifact metadata | Long-term |
| Signing evidence | Long-term |
| Validation evidence | Long-term |
| Audit record | Multi-year |
| Backup artifact | Backup policy |

# 101. Phase Mapping

| Phase | Artifact Security Focus |
|---|---|
| Phase 0 | Supply-chain/security foundation |
| Phase 1 | Artifact ownership and authorization foundation |
| Phase 2 | Artifact metadata/storage model |
| Phase 3 | Packaging, manifest, checksum, signing, scanning |
| Phase 4 | Booking/capability/security integration |
| Phase 5 | Deployment/runtime validation |
| Phase 6 | Lab Agent and physical execution security |
| Phase 7 | Results/provenance/audit |
| Phase 8 | Revocation, retention, compliance, penetration testing |

# 102. Phase 0 Requirements

Phase 0 shall establish:

- artifact threat model;
- security ownership;
- dependency scanning;
- secret scanning;
- secure CI;
- signing architecture;
- security policy versioning.

No production signing key shall be stored in source control.

# 103. Phase 1 Requirements

Phase 1 shall establish:

- artifact authorization model;
- organization ownership;
- project ownership;
- role-based artifact access;
- secure artifact identity.

# 104. Phase 2 Requirements

Phase 2 shall establish:

- artifact database model;
- object storage;
- immutable artifact identity;
- tenant-scoped storage;
- artifact retention metadata.

# 105. Phase 3 Requirements

Phase 3 is the core artifact security milestone.

Required:

- `.krv` format;
- manifest;
- checksum;
- signature;
- signing-key lifecycle;
- privacy scanner;
- malware scanner;
- policy scanner;
- provenance;
- SBOM;
- artifact state machine;
- tamper detection.

# 106. Phase 4 Requirements

Phase 4 shall integrate artifact security with:

- booking;
- credit authorization;
- platform capabilities;
- resource eligibility.

A valid artifact must still satisfy booking and policy requirements.

# 107. Phase 5 Requirements

Phase 5 shall establish:

- pre-deployment verification;
- Lab Agent validation;
- runtime startup verification;
- sandbox constraints;
- execution-time capability enforcement.

# 108. Phase 6 Requirements

Phase 6 shall establish:

- local Lab Agent trust;
- hardware capability mediation;
- resource limits;
- physical execution policy;
- safe failure behavior.

# 109. Phase 7 Requirements

Phase 7 shall establish:

- Run provenance;
- artifact-to-result traceability;
- security audit;
- artifact-related result metadata;
- secure artifact/result access.

# 110. Phase 8 Requirements

Phase 8 shall establish:

- formal revocation;
- key compromise response;
- retention;
- secure deletion;
- vulnerability monitoring;
- penetration testing;
- production security review;
- incident response exercises.

# 111. Security Testing Strategy

Artifact security verification shall include:

- unit tests;
- package tests;
- cryptographic tests;
- negative tests;
- fuzzing;
- malware test corpus;
- policy tests;
- compatibility tests;
- sandbox tests;
- capability tests;
- concurrency tests;
- deployment tests;
- revocation tests;
- deletion tests.

# 112. Checksum Tests

Tests shall verify:

- unchanged artifact passes;
- one-byte modification fails;
- manifest modification fails;
- binary modification fails;
- package-entry modification fails;
- storage corruption fails.

# 113. Signature Tests

Tests shall verify:

- valid signature passes;
- wrong key fails;
- unknown key fails;
- modified artifact fails;
- modified manifest fails;
- malformed signature fails;
- revoked key fails;
- expired key policy is enforced.

# 114. Provenance Tests

Tests shall verify:

- provenance exists;
- artifact digest matches;
- build metadata is consistent;
- scanner version is recorded;
- signing key is recorded;
- platform is consistent;
- SBOM identity matches artifact.

# 115. Capability Tests

Tests shall verify:

- undeclared capability is denied;
- declared but unauthorized capability is denied;
- authorized capability is granted;
- capability removed by policy is denied;
- simulator/physical capability differences are enforced.

# 116. Sandbox Tests

Tests shall verify:

- filesystem escape fails;
- process privilege escalation fails;
- unauthorized network access fails;
- unauthorized device access fails;
- resource exhaustion is bounded;
- cross-tenant access fails;
- host secret access fails.

# 117. Malware Tests

A controlled test corpus shall verify:

- known test signatures are detected;
- malformed executables are rejected;
- prohibited payload structures are rejected;
- scanner failure blocks Production approval.

No real malware should be used outside controlled security-testing environments.

# 118. Supply-Chain Tests

CI shall verify:

- dependency lock consistency;
- vulnerability policy;
- SBOM generation;
- provenance;
- signed release artifacts;
- protected deployment.

# 119. Revocation Tests

Tests shall verify:

- revoked artifact cannot start;
- revoked key blocks applicable artifacts;
- revocation reaches Lab Agent;
- new jobs are blocked;
- historical Run data remains available for investigation.

# 120. Retention Tests

Tests shall verify:

- temporary copies expire;
- staging copies are cleaned;
- archived artifacts follow policy;
- revoked artifacts follow retention policy;
- deletion does not create a new execution path;
- audit evidence remains according to policy.

# 121. Secure Deletion Tests

Tests shall verify:

- deleted artifact cannot be downloaded;
- deleted artifact cannot be executed;
- active object is removed;
- metadata reflects deletion;
- lifecycle processing occurs;
- artifact ID is not reused.

# 122. Attack Scenarios

Major artifact-specific attacks include:

1. Binary tampering.
2. Manifest tampering.
3. Signature bypass.
4. Signing-key compromise.
5. Dependency compromise.
6. Malicious package.
7. Malware injection.
8. Capability escalation.
9. Sandbox escape.
10. Object-storage replacement.
11. Replay.
12. Artifact substitution.
13. Unauthorized download.
14. Revocation bypass.
15. Retention/deletion bypass.

# 123. Attack Scenario: Binary Tampering

Attacker modifies an artifact after signing.

Expected:

    Modified Binary
        |
        v
    Digest Mismatch
        |
        v
    Signature Failure
        |
        v
    Execution Blocked

Residual risk is limited by immutable storage and deployment revalidation.

# 124. Attack Scenario: Manifest Tampering

Attacker changes:

    platform_id
    architecture
    required_capabilities

The signature/integrity relationship must fail.

The modified manifest shall not be accepted.

# 125. Attack Scenario: Capability Escalation

Attacker changes manifest from:

    ["camera"]

to:

    ["camera", "motor_control", "ethercat"]

The signature shall fail.

Even if a signature bypass occurred, Lab Agent policy shall independently reject
unauthorized capabilities.

# 126. Attack Scenario: Malicious Dependency

A dependency contains malicious code.

Controls:

- dependency pinning;
- vulnerability scanning;
- SBOM;
- provenance;
- malware scanning;
- trusted build process;
- runtime sandbox.

Residual risk remains for sophisticated supply-chain attacks.

# 127. Attack Scenario: Signing Key Theft

An attacker obtains a valid signing key.

Controls:

- protected key storage;
- restricted signing identity;
- audit;
- key revocation;
- artifact inventory;
- rapid re-signing.

The ability to revoke the key is mandatory.

# 128. Attack Scenario: Artifact Replay

Attacker attempts to execute an old artifact.

Controls:

- artifact lifecycle;
- expiration;
- revocation;
- compatibility;
- policy;
- booking;
- platform state.

Old does not mean trusted.

# 129. Attack Scenario: Artifact Substitution

Attacker attempts to make artifact ID A point to artifact B.

Controls:

- immutable artifact identity;
- digest;
- storage binding;
- signature;
- database uniqueness;
- deployment revalidation.

# 130. Attack Scenario: Sandbox Escape

Malicious artifact attempts to access host resources.

Controls:

- least privilege;
- process isolation;
- filesystem isolation;
- network isolation;
- device mediation;
- resource limits;
- runtime hardening.

Residual risk depends on the chosen execution isolation technology.

# 131. Attack Scenario: Unauthorized Download

Attacker obtains an artifact ID.

Controls:

- authentication;
- project authorization;
- organization authorization;
- short-lived access;
- audit.

Possession of artifact ID is not authorization.

# 132. Attack Scenario: Revocation Race

Artifact is revoked while deployment is occurring.

Required behavior:

- deployment checks current state;
- Lab Agent validates current revocation state;
- state transition is transactional where possible;
- active execution follows safety policy.

# 133. Attack Scenario: Storage Replacement

Attacker replaces an object in storage.

Controls:

- private storage;
- restricted write identity;
- checksum;
- signature;
- immutable object/versioning;
- deployment revalidation.

# 134. Artifact Security Monitoring

Security monitoring should detect:

- repeated validation failures;
- signature failures;
- checksum mismatches;
- malware detections;
- unusual artifact upload rates;
- unusual downloads;
- repeated capability-denial attempts;
- repeated execution failures;
- revoked artifact execution attempts;
- suspicious signing activity.

# 135. Security Metrics

Recommended metrics:

| Metric | Purpose |
|---|---|
| Signature failure rate | Detect tampering |
| Checksum mismatch rate | Detect corruption |
| Malware detection count | Threat monitoring |
| Policy rejection count | Policy monitoring |
| Revoked execution attempts | Incident detection |
| Sandbox violations | Runtime security |
| Capability denials | Authorization monitoring |
| Artifact download anomalies | IP protection |
| Scanner failure rate | Control availability |
| Key rotation age | Key hygiene |

# 136. Security Review Cadence

Artifact security shall be reviewed:

- each artifact-format change;
- each signing implementation change;
- each runtime isolation change;
- each new capability;
- each new platform;
- each new dependency model;
- after security incidents;
- after major vulnerabilities;
- quarterly during active development;
- annually after production stabilization.

# 137. Change Impact Review

Changes requiring security review include:

- `.krv` format;
- manifest fields;
- signing algorithm;
- key management;
- scanner;
- sandbox;
- runtime;
- Lab Agent;
- capability catalog;
- storage;
- retention;
- deletion;
- artifact download.

# 138. Open Questions

The following require explicit final decisions:

1. What exact `.krv` container format will be adopted?
2. Which signing algorithm will be standardized?
3. Will production signing use HSM/KMS?
4. Who controls production signing keys?
5. Will customers bring their own signing keys?
6. What exact SBOM standard will be used?
7. Which provenance standard will be used?
8. Which malware scanner will be integrated?
9. Which sandbox technology will be used for Linux?
10. Which isolation model will be used for Windows?
11. Will physical robot workloads use containers, dedicated hosts, or another
    isolation model?
12. Which capabilities require human approval?
13. Which capabilities are forbidden for remote execution?
14. What vulnerability severity blocks artifact approval?
15. How long will revoked artifacts be retained?
16. What is the exact deletion SLA?
17. How will revocation reach disconnected Lab Agents?
18. What happens to active Runs during critical artifact revocation?
19. What artifact security evidence is customer-visible?
20. What compliance standards will apply to artifact retention and deletion?

# 139. Residual Risks

The following risks cannot be completely eliminated:

| Risk | Reason | Primary Mitigation |
|---|---|---|
| Zero-day in runtime | Unknown vulnerability | Isolation + patching |
| Zero-day in scanner | Detection failure | Multiple scanners |
| Signing key compromise | Credential compromise | HSM + revocation |
| Malicious authorized code | User-controlled behavior | Sandbox + capability controls |
| Compiler compromise | Local toolchain | Provenance + trusted versions |
| Dependency compromise | External supply chain | SBOM + scanning |
| Host compromise | Runtime infrastructure | Isolation |
| Hardware vulnerability | Robot dependency | Local safety |
| Insider misuse | Privileged access | Least privilege + audit |
| Cloud compromise | Infrastructure threat | Defense in depth |

# 140. Acceptance Criteria: Artifact Format

- [ ] `.krv` format is versioned.
- [ ] Package contents are explicitly defined.
- [ ] Package canonicalization is defined.
- [ ] Required fields are documented.
- [ ] Prohibited contents are documented.
- [ ] Artifact identity is immutable.
- [ ] Artifact digest is defined.
- [ ] Artifact lifecycle is defined.

# 141. Acceptance Criteria: Signing

- [ ] Production artifacts are signed.
- [ ] Signature algorithm is approved.
- [ ] Private signing keys are protected.
- [ ] Key IDs are recorded.
- [ ] Signature verification is mandatory.
- [ ] Unknown keys are rejected.
- [ ] Revoked keys are rejected.
- [ ] Key rotation is supported.
- [ ] Key compromise response is documented.
- [ ] Signing operations are auditable.

# 142. Acceptance Criteria: Integrity

- [ ] Digest is generated.
- [ ] Digest is stored.
- [ ] Upload digest is verified.
- [ ] Storage integrity is protected.
- [ ] Deployment digest is revalidated.
- [ ] Runtime verifies artifact identity.
- [ ] Binary modification is detected.
- [ ] Manifest modification is detected.

# 143. Acceptance Criteria: Provenance

- [ ] Artifact provenance is recorded.
- [ ] Build ID is recorded.
- [ ] Toolchain version is recorded.
- [ ] SDK version is recorded.
- [ ] Platform is recorded.
- [ ] Architecture is recorded.
- [ ] Scanner version is recorded.
- [ ] Policy version is recorded.
- [ ] Signing key ID is recorded.
- [ ] Provenance is integrity protected.

# 144. Acceptance Criteria: Supply Chain

- [ ] Dependencies are controlled.
- [ ] Dependency versions are traceable.
- [ ] SBOM is generated.
- [ ] Vulnerability scanning exists.
- [ ] Critical vulnerabilities block approval.
- [ ] Build provenance is available.
- [ ] CI credentials are scoped.
- [ ] Production release artifacts are protected.

# 145. Acceptance Criteria: Malware and Policy Scanning

- [ ] Local privacy scanning exists.
- [ ] Malware scanning exists.
- [ ] Policy scanning exists.
- [ ] Scanner versions are recorded.
- [ ] Scanner failures block Production approval.
- [ ] High-confidence findings block execution.
- [ ] Quarantine exists.
- [ ] Security findings are auditable.

# 146. Acceptance Criteria: Capabilities

- [ ] Artifact capabilities are declared.
- [ ] Manifest capabilities are integrity protected.
- [ ] Unsupported capabilities are rejected.
- [ ] Unauthorized capabilities are rejected.
- [ ] Runtime capability grants are explicit.
- [ ] Hardware access is mediated.
- [ ] Network access is capability controlled.
- [ ] Filesystem access is capability controlled.

# 147. Acceptance Criteria: Sandbox

- [ ] Application executes with least privilege.
- [ ] Filesystem is isolated.
- [ ] Host secrets are inaccessible.
- [ ] Process privileges are restricted.
- [ ] Network is denied by default.
- [ ] Device access is mediated.
- [ ] CPU is bounded.
- [ ] Memory is bounded.
- [ ] Storage is bounded.
- [ ] Process count is bounded.
- [ ] Execution duration is bounded.
- [ ] Cross-tenant access is impossible through normal interfaces.

# 148. Acceptance Criteria: Lab Agent

- [ ] Lab Agent authenticates.
- [ ] Lab Agent validates artifact digest.
- [ ] Lab Agent validates signature.
- [ ] Lab Agent validates revocation.
- [ ] Lab Agent validates platform.
- [ ] Lab Agent validates capabilities.
- [ ] Lab Agent validates booking.
- [ ] Lab Agent validates resource state.
- [ ] Lab Agent applies local policy.
- [ ] Lab Agent cannot be used as a general shell.

# 149. Acceptance Criteria: Revocation

- [ ] Individual artifacts can be revoked.
- [ ] Signing keys can be revoked.
- [ ] Revoked artifacts cannot start new Runs.
- [ ] Revocation reaches execution boundaries.
- [ ] Revocation is audited.
- [ ] Affected Runs can be identified.
- [ ] Key compromise response is documented.

# 150. Acceptance Criteria: Retention and Deletion

- [ ] Artifact retention policy exists.
- [ ] Temporary copies are cleaned.
- [ ] Staging copies are cleaned.
- [ ] Revoked artifacts follow retention policy.
- [ ] Quarantined artifacts follow investigation policy.
- [ ] Deletion is authorization controlled.
- [ ] Deleted artifacts cannot execute.
- [ ] Deleted artifacts cannot be downloaded.
- [ ] Audit evidence is retained as required.
- [ ] Artifact IDs are never reused.

# 151. Acceptance Criteria: Audit

- [ ] Artifact creation is auditable.
- [ ] Artifact upload is auditable.
- [ ] Validation is auditable.
- [ ] Approval is auditable.
- [ ] Download is auditable.
- [ ] Deployment is auditable.
- [ ] Execution is auditable.
- [ ] Revocation is auditable.
- [ ] Deletion is auditable.
- [ ] Audit records contain artifact digest.
- [ ] Audit records contain actor.
- [ ] Audit records contain outcome.

# 152. Acceptance Criteria: Testing

- [ ] Checksum tests pass.
- [ ] Signature tests pass.
- [ ] Tamper tests pass.
- [ ] Manifest tests pass.
- [ ] Capability tests pass.
- [ ] Malware tests pass.
- [ ] Sandbox tests pass.
- [ ] Supply-chain tests pass.
- [ ] Revocation tests pass.
- [ ] Retention tests pass.
- [ ] Deletion tests pass.
- [ ] Network-level artifact tests pass.
- [ ] Cross-tenant tests pass.

# 153. Acceptance Criteria: Production

- [ ] P0 artifact controls are implemented.
- [ ] Production signing keys are protected.
- [ ] Production artifacts are scanned.
- [ ] Production artifacts are signed.
- [ ] Production execution verifies signatures.
- [ ] Production execution verifies capabilities.
- [ ] Production execution uses runtime isolation.
- [ ] Lab Agent independently validates artifacts.
- [ ] Physical deployment safety review is complete.
- [ ] Incident response is tested.
- [ ] Artifact security review is approved.

# 154. Final Artifact Security Invariants

The following invariants are mandatory:

1. An artifact has one immutable identity.
2. An artifact has a cryptographic digest.
3. A Production artifact has a valid signature.
4. Signature verification is mandatory before execution.
5. Unknown signing keys are rejected.
6. Revoked signing keys are rejected according to policy.
7. Revoked artifacts cannot start new Runs.
8. Manifest and binary integrity are cryptographically linked.
9. Artifact compatibility is validated against authoritative platform metadata.
10. Artifact capabilities are explicitly declared.
11. Manifest declarations do not grant permission by themselves.
12. Unauthorized capabilities are denied.
13. Network access is denied by default.
14. Filesystem access is restricted.
15. Host privileges are not granted by default.
16. Runtime resources are bounded.
17. Cross-tenant access is prohibited.
18. Malware/policy scanning is required for Production approval.
19. Scanner failure does not result in fail-open execution.
20. Source code is not required for remote execution.
21. Artifact provenance is retained.
22. SBOM/provenance information is integrity protected.
23. Artifact storage is private and tenant scoped.
24. Approved artifacts are immutable.
25. Deployment revalidates artifact integrity.
26. Lab Agent independently validates execution eligibility.
27. Physical safety remains independent of artifact trust.
28. Artifact security failures fail closed.
29. Temporary artifact copies are cleaned according to policy.
30. Artifact deletion prevents future execution.
31. Audit evidence survives artifact deletion where required.
32. Artifact identity is never reused.

# 155. Final Security Architecture

    +------------------------------------------------------------------+
    |                       DEVELOPER MACHINE                          |
    |                                                                  |
    |  Source -> Build -> Test -> Package -> Privacy Scan              |
    |                                      |                           |
    |                                      v                           |
    |                                  Manifest                        |
    |                                      |                           |
    |                                      v                           |
    |                                  Digest                          |
    |                                      |                           |
    |                                      v                           |
    |                                  Sign                            |
    |                                      |                           |
    |                                      v                           |
    |                                  .krv                            |
    +--------------------------------------+---------------------------+
                                           |
                                           | TLS / Artifact Only
                                           v
    +------------------------------------------------------------------+
    |                         RAAS CONTROL PLANE                       |
    |                                                                  |
    |  Authenticate -> Authorize -> Receive -> Validate                |
    |                                                                  |
    |  Digest -> Signature -> Provenance -> Malware -> Policy          |
    |                                                                  |
    |  Compatibility -> Capability -> Booking -> Approval              |
    +--------------------------------------+---------------------------+
                                           |
                                           v
    +------------------------------------------------------------------+
    |                           OBJECT STORAGE                         |
    |                                                                  |
    |  Immutable Artifact -> Digest -> Encryption -> Retention         |
    +--------------------------------------+---------------------------+
                                           |
                                           v
    +------------------------------------------------------------------+
    |                             LAB                                  |
    |                                                                  |
    |  Lab Agent -> Digest -> Signature -> Revocation -> Policy         |
    |      |                                                           |
    |      v                                                           |
    |  Runtime Sandbox -> Capability Enforcement -> Resource Limits     |
    |      |                                                           |
    |      v                                                           |
    |  Robot Runtime                                                    |
    +--------------------------------------+---------------------------+
                                           |
                                           v
    +------------------------------------------------------------------+
    |                      PHYSICAL SAFETY DOMAIN                      |
    |                                                                  |
    |  Local Safety Controller / E-Stop / Robot Protection              |
    |                                                                  |
    |  Independent of cloud artifact trust and network availability     |
    +------------------------------------------------------------------+

The definitive artifact-security principle is:

> The `.krv` artifact is an authenticated, integrity-protected, provenance-aware,
> policy-controlled execution unit. It is never trusted merely because it was
> uploaded, signed, or associated with a valid user. Kritva RaaS must validate
> the artifact independently at every security boundary, enforce least-privilege
> capabilities during execution, detect tampering and malicious content, support
> rapid revocation, retain sufficient provenance for investigation, and securely
> remove artifacts when their retention period ends.

Artifact security is complete only when the artifact remains trustworthy from
local packaging through cloud storage, booking, deployment, runtime execution,
result generation, revocation, retention, and deletion.
