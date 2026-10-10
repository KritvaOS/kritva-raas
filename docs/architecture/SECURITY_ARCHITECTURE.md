# Kritva RaaS Security Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Security Architecture |
| Path | `docs/architecture/SECURITY_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service (RaaS) |
| Security Model | Zero-Trust / Least Privilege |
| Primary Trust Boundary | Control Plane ↔ Lab |
| Primary Identity Boundary | User/Organization ↔ Control Plane |
| Artifact Boundary | Customer Source ↔ `.krv` Artifact |
| Robot Boundary | Lab Agent ↔ Kritva Runtime ↔ Robot |
| Status | Architecture Baseline |

## 2. Purpose

This document defines the production-grade security architecture for Kritva RaaS.

The architecture protects:

- customer source code;
- compiled execution artifacts;
- user identities;
- organization data;
- projects;
- bookings;
- credits;
- execution jobs;
- robot resources;
- telemetry;
- logs;
- video;
- results;
- lab infrastructure;
- credentials;
- cryptographic keys;
- audit records.

The central security principle is:

> **Customer source stays local; only an authorized execution artifact crosses the RaaS boundary; cloud execution is explicitly authorized; robot execution remains locally controlled; physical safety remains independent of the cloud.**

## 3. Scope

This document covers:

1. Security principles.
2. Trust boundaries.
3. Threat model.
4. Source-code privacy.
5. Artifact security.
6. Authentication.
7. Authorization.
8. Tenant isolation.
9. Secrets.
10. Cryptographic keys.
11. API security.
12. WebSocket security.
13. Lab security.
14. Lab Agent security.
15. Runtime sandboxing.
16. Robot security.
17. Network segmentation.
18. Data security.
19. Audit.
20. Logging.
21. Monitoring.
22. Incident response.
23. Supply-chain security.
24. Dependency security.
25. Vulnerability management.
26. Security testing.
27. Physical safety boundary.
28. Phase 0-8 implementation.

## 4. Goals

The security architecture shall:

1. Protect customer intellectual property.
2. Prevent cross-tenant data access.
3. Authenticate every privileged actor.
4. Authorize every sensitive operation.
5. Protect artifacts from tampering.
6. Protect signing keys.
7. Prevent unauthorized robot execution.
8. Isolate customer workloads.
9. Prevent direct Internet exposure of robot networks.
10. Protect Lab Agents.
11. Restrict runtime privileges.
12. Protect secrets.
13. Provide auditable security events.
14. Detect abnormal behavior.
15. Support incident investigation.
16. Support secure upgrades.
17. Preserve physical safety independence.

## 5. Non-Goals

This architecture does not attempt to:

- guarantee that a compiled binary cannot be reverse engineered;
- replace robot safety controllers;
- make the cloud a hard real-time control system;
- provide unrestricted remote shell access;
- treat network security as a substitute for physical safety;
- eliminate every vulnerability in third-party dependencies;
- expose customer source code to the cloud for remote building.

## 6. Security Principles

The architecture follows:

1. Zero trust.
2. Least privilege.
3. Defense in depth.
4. Explicit authorization.
5. Secure defaults.
6. Fail closed for security decisions.
7. Local safety authority.
8. Strong workload identity.
9. Short-lived credentials.
10. Immutable execution artifacts.
11. Tenant isolation.
12. Complete auditability.
13. Minimized data collection.
14. Separation of duties.
15. Continuous verification.

## 7. Security Architecture Overview

    Customer
       |
       | Source Code
       v
    Kritva RaaS Studio
       |
       | Local Build
       v
    Signed .krv Artifact
       |
       | HTTPS
       v
    RaaS Control Plane
       |
       +--> Identity
       +--> Authorization
       +--> Artifact Validation
       +--> Booking
       +--> Credits
       +--> Job Authorization
       |
       v
    Secure Lab Protocol
       |
       v
    Lab Agent
       |
       v
    Kritva Runtime
       |
       v
    Robot

The security model deliberately places multiple verification points between customer
intent and physical execution.

## 8. Trust Zones

Primary trust zones are:

| Zone | Description | Trust Level |
|---|---|---|
| Z0 | Public Internet | Untrusted |
| Z1 | User Device / Studio | User-controlled |
| Z2 | Cloud Edge | Controlled |
| Z3 | Control Plane | Trusted application boundary |
| Z4 | Cloud Data Services | Restricted |
| Z5 | Lab Network | Restricted |
| Z6 | Lab Agent | Highly privileged boundary |
| Z7 | Runtime | Workload boundary |
| Z8 | Robot Control | Safety-sensitive |
| Z9 | Safety Controller | Independent safety authority |

No zone should implicitly trust another zone merely because network connectivity exists.

## 9. Trust Boundary Diagram

    +------------------- UNTRUSTED -------------------+
    |                                                 |
    | User Device / Internet                          |
    +-------------------------+-----------------------+
                              |
                         TLS / AuthN
                              |
    +-------------------------v-----------------------+
    |                 CLOUD CONTROL                   |
    |                                                 |
    | API Edge -> AuthN -> AuthZ -> Domain Services  |
    +-------------------------+-----------------------+
                              |
                    Secure Lab Protocol
                              |
    +-------------------------v-----------------------+
    |                    LAB                          |
    |                                                 |
    | Lab Agent -> Runtime -> Robot                  |
    |                    |                            |
    |                    +--> Safety Controller      |
    +-------------------------------------------------+

## 10. Source-Code Privacy Boundary

The initial architecture intentionally creates a strong source-code boundary.

    Customer Source
          |
          | NEVER REQUIRED BY RaaS
          v
    Local Build Environment
          |
          v
    .krv Artifact
          |
          v
    RaaS

The cloud does not need:

- source repository;
- source files;
- build workspace;
- compiler inputs;

for the initial execution model.

## 11. Source-Code Privacy Goal

The design minimizes source-code exposure.

The RaaS platform receives only the artifact required for execution.

This reduces:

- accidental source disclosure;
- cloud source retention;
- build-system exposure;
- third-party build access;
- source repository integration requirements.

## 12. Source-Code Privacy Limitations

Source privacy is not equivalent to binary confidentiality.

A `.krv` artifact may contain:

- proprietary algorithms;
- compiled code;
- embedded constants;
- debugging symbols if incorrectly packaged;
- configuration;
- intellectual property.

A customer must therefore understand:

> **RaaS minimizes source exposure but does not guarantee that executable artifacts are impossible to inspect or reverse engineer.**

## 13. Source Privacy Controls

Studio should:

- build locally;
- keep source local;
- package only required files;
- exclude source files from `.krv`;
- exclude unnecessary debug symbols;
- generate checksums;
- sign artifacts;
- provide artifact inspection before upload.

## 14. Artifact Trust Boundary

    Local Build
        |
        v
    Package
        |
        v
    Sign
        |
        v
    .krv
        |
        v
    Control Plane
        |
        v
    Lab Agent
        |
        v
    Verify
        |
        v
    Runtime

Each security boundary can reject the artifact.

## 15. Artifact Manifest

An artifact manifest should contain:

    artifact_id
    artifact_version
    project_id
    platform_id
    architecture
    runtime_version
    sdk_version
    required_capabilities
    checksum
    signature
    created_at

The manifest must not contain secrets.

## 16. Artifact Signing

Artifacts should be cryptographically signed.

The intended trust model is:

    Approved Signer
          |
          v
    Artifact Signature
          |
          v
    Control Plane Verification
          |
          v
    Lab Agent Verification
          |
          v
    Runtime Policy
          |
          v
    Execute

## 17. Signing Key Protection

Signing private keys are highly sensitive.

They must not be:

- embedded in Studio;
- stored in source repositories;
- stored in artifacts;
- transmitted to Lab Agents;
- exposed to ordinary application processes.

Preferred protection includes:

- managed key management;
- hardware-backed key storage;
- dedicated signing service;
- restricted signing identities.

## 18. Artifact Signature Policy

The system should define:

- trusted signer;
- signature algorithm;
- key rotation;
- key revocation;
- signature validity;
- artifact expiration if required.

Unsigned artifacts may be allowed only in explicitly configured development environments.

## 19. Artifact Integrity

Integrity validation includes:

- checksum;
- signature;
- expected artifact size;
- manifest consistency;
- platform compatibility.

A mismatch must prevent deployment.

## 20. Artifact Immutability

Accepted artifacts should be immutable.

If source changes:

    Source v1
       |
       v
    Artifact v1

    Source v2
       |
       v
    Artifact v2

Artifact v1 must not be overwritten by Artifact v2.

## 21. Artifact Authorization

A valid signature alone does not authorize execution.

The Control Plane must also verify:

- user permission;
- organization ownership;
- project ownership;
- booking;
- selected platform;
- resource compatibility;
- artifact status.

## 22. Artifact Revocation

The architecture should support artifact revocation.

Revocation may be required for:

- compromised artifact;
- compromised signing key;
- security vulnerability;
- customer request;
- policy violation.

A revoked artifact must not be newly deployed.

## 23. Authentication Architecture

Authentication establishes identity.

    User / Agent
        |
        v
    Identity Provider
        |
        v
    Credential / Token
        |
        v
    Control Plane

Authentication does not grant permission by itself.

## 24. Authentication Actors

The architecture recognizes:

- human users;
- administrative users;
- service accounts;
- Lab Agents;
- future integrations;
- internal workers.

Each actor type requires an appropriate credential model.

## 25. Human Authentication

Human authentication should support:

- secure passwordless or password-based identity provider;
- MFA;
- session expiration;
- credential recovery;
- account lockout/risk controls.

MFA should be mandatory for privileged administrative access.

## 26. Lab Agent Authentication

Lab Agents should use strong machine identity.

Preferred options include:

- mutual TLS;
- device certificates;
- hardware-backed keys;
- short-lived tokens.

Each agent receives a unique identity.

## 27. Agent Identity

An agent identity must bind:

    agent_id
       +
    lab_id
       +
    credential
       +
    authorization policy

A credential copied from Agent A must not automatically authenticate Agent B.

## 28. Agent Revocation

The system must support revoking an agent.

Reasons include:

- compromise;
- decommissioning;
- credential theft;
- unauthorized software;
- lab transfer.

Revocation must prevent new cloud-authorized execution.

## 29. Service Identity

Workers and internal services should use workload identities rather than shared
passwords.

Examples:

    API -> Queue
    Worker -> Object Storage
    Worker -> Database
    Lab Gateway -> Lab Agent

Permissions must be scoped to required operations.

## 30. Authorization Architecture

Authorization determines whether an authenticated actor may perform an operation.

Conceptually:

    Identity
       +
    Organization
       +
    Role
       +
    Resource Ownership
       +
    Requested Operation
       +
    Resource State
       |
       v
    Authorization Decision

## 31. Role Model

Initial roles may include:

    OWNER
    ADMIN
    MEMBER
    VIEWER

Additional specialized roles may be introduced later.

## 32. Resource Authorization

A user accessing:

    /api/v1/jobs/{job_id}

must be authorized against the organization and resource associated with that job.

Client-supplied organization IDs cannot bypass this check.

## 33. Tenant Isolation

The primary tenant boundary is organization.

Tenant-scoped resources include:

- projects;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- results.

Server-side enforcement is mandatory.

## 34. Tenant Isolation Model

    Request
       |
       v
    Authenticated User
       |
       v
    Organization Context
       |
       v
    Authorization
       |
       v
    Tenant-Scoped Repository
       |
       v
    Data

Tenant filtering must never depend solely on frontend behavior.

## 35. Database Tenant Isolation

Tenant-scoped repositories should enforce organization ownership.

Defense-in-depth may include PostgreSQL row-level security if adopted consistently.

Database design must prevent accidental unscoped queries from becoming a security bypass.

## 36. Cross-Tenant Access

Cross-tenant access is prohibited by default.

Exceptions require explicit capabilities such as:

- public platform data;
- approved organization sharing;
- privileged support access.

Such access must be auditable.

## 37. API Security

The API must enforce:

- HTTPS;
- authentication;
- authorization;
- request validation;
- rate limiting;
- request size limits;
- secure error handling.

Sensitive endpoints require stronger controls.

## 38. Idempotency Security

Idempotency protects against:

- duplicate bookings;
- duplicate credit operations;
- duplicate execution;
- retry-induced side effects.

Idempotency keys must be scoped appropriately and stored securely.

## 39. API Rate Limiting

Rate limiting should protect:

- login;
- expensive searches;
- availability;
- booking;
- credit operations;
- job execution;
- WebSocket connections.

Rate limits should be based on user, token, organization, endpoint, or IP as appropriate.

## 40. WebSocket Security

WebSocket connections must be:

- authenticated;
- encrypted;
- authorization-controlled;
- rate-limited;
- observable.

Subscriptions must be validated against tenant and resource ownership.

## 41. WebSocket Trust Model

    Authenticated Client
           |
           v
    WebSocket Gateway
           |
           v
    Authorization
           |
           v
    Event Subscription
           |
           v
    Authorized Events Only

A user must never subscribe to another tenant's job or telemetry.

## 42. WebSocket Reconnection

After reconnect:

1. Authenticate again.
2. Revalidate authorization.
3. Restore subscriptions.
4. Query authoritative REST state.
5. Resume realtime observation.

This prevents stale authorization and stale state.

## 43. Secrets Architecture

Secrets include:

- database credentials;
- API secrets;
- identity-provider secrets;
- object-storage credentials;
- queue credentials;
- TLS private keys;
- Lab Agent credentials;
- signing keys.

Secrets must be stored in dedicated secret-management systems.

## 44. Secret Management Principles

Secrets should be:

- centrally managed;
- encrypted;
- access-controlled;
- rotated;
- audited;
- short-lived where practical;
- excluded from source control.

## 45. Secret Injection

Applications should receive secrets through secure runtime mechanisms.

Preferred flow:

    Secret Store
        |
        v
    Workload Identity
        |
        v
    Runtime
        |
        v
    Application

Secrets should not be embedded in container images or Git repositories.

## 46. Secret Rotation

Rotation should support:

1. New secret creation.
2. Application acceptance.
3. Validation.
4. Old secret retirement.
5. Audit.

Rotation should avoid unnecessary service downtime.

## 47. Cryptographic Keys

Key categories include:

- artifact signing keys;
- TLS keys;
- Lab Agent identity keys;
- encryption keys;
- token signing keys.

Each category should have separate ownership and rotation policies.

## 48. Key Separation

A single master key should not be reused for unrelated purposes.

For example:

    Artifact Signing Key
        !=
    Database Encryption Key
        !=
    Lab Agent Identity Key

Compromise of one key should not automatically compromise all security domains.

## 49. Key Rotation

Key rotation should preserve the ability to validate historical artifacts.

The system should maintain trusted historical public keys while old signatures remain
valid.

## 50. Key Revocation

Revocation is required when:

- private key compromise occurs;
- signer is deauthorized;
- certificate is invalidated;
- cryptographic algorithm is deprecated.

Revocation events must be audited.

## 51. Data Encryption

Sensitive data should be encrypted:

- in transit;
- at rest.

Examples:

    Studio <-> API       TLS
    API <-> PostgreSQL   TLS
    Agent <-> Cloud      TLS/mTLS
    Object Storage       Encryption at rest
    Database             Encryption at rest

## 52. Network Security

The cloud network should use:

- private subnets;
- security groups/firewall rules;
- restricted ingress;
- restricted egress;
- TLS;
- network segmentation.

Only required public endpoints should be exposed.

## 53. Lab Network Security

Preferred architecture:

    Internet
       |
       v
    Firewall
       |
       v
    Lab Management Network
       |
       +--> Lab Agent
       |
       v
    Robot Control Network
       |
       +--> Robot
       +--> Safety Controller

The robot control network should not be directly Internet-accessible.

## 54. Outbound Lab Connectivity

The preferred model is outbound secure connectivity:

    Lab Agent
       |
       | outbound TLS
       v
    Cloud Control Plane

This reduces inbound firewall exposure.

## 55. No Direct Robot Internet Access

Robots should not require public Internet access for normal RaaS execution.

The Lab Agent acts as the controlled cloud boundary.

## 56. Lab Agent Network Permissions

The Lab Agent should have access only to:

- Control Plane;
- required object storage;
- robot management interfaces;
- runtime;
- approved telemetry sources;
- approved media sources.

It must not become an unrestricted network bridge.

## 57. Runtime Network Sandbox

Remote application networking should be restricted.

Policies may define:

- allowed endpoints;
- ports;
- protocols;
- bandwidth;
- DNS behavior;
- local network access.

Default policy should be deny-by-default where practical.

## 58. Runtime Sandboxing

Kritva Runtime should isolate customer workloads using appropriate mechanisms.

Possible mechanisms include:

- process isolation;
- containers;
- namespaces;
- seccomp;
- cgroups;
- filesystem restrictions;
- device allowlists.

The exact mechanism depends on the target robot OS.

## 59. Runtime Privileges

Applications should not run with unnecessary privileges.

Avoid:

    root
    unrestricted filesystem
    unrestricted network
    unrestricted device access

Use dedicated service identities and minimum permissions.

## 60. Device Sandboxing

Hardware interfaces should be allowlisted.

Examples:

    /dev/camera
    /dev/imu
    /dev/motor-controller

Applications should not automatically access every device on the host.

## 61. Privileged Hardware Access

High-risk interfaces require explicit platform policy.

Examples:

- raw EtherCAT;
- motor controller;
- safety controller;
- GPIO;
- CAN;
- SPI;
- I2C.

The artifact manifest cannot grant itself unrestricted privileges.

## 62. Filesystem Sandboxing

An application should have access only to:

- its deployment directory;
- approved configuration;
- approved runtime interfaces;
- temporary workspace.

It must not access:

- Lab Agent credentials;
- other tenants' artifacts;
- other jobs;
- system secrets;
- unrelated host data.

## 63. Process Isolation

The Lab Agent should run separately from customer application processes.

A compromised application should not automatically compromise the agent.

Where possible:

    Lab Agent Process
          X
    Customer Process

with separate users, namespaces, permissions, and filesystem boundaries.

## 64. Resource Limits

Runtime sandboxing should enforce:

- CPU;
- memory;
- disk;
- process count;
- network;
- execution duration.

This reduces denial-of-service risk.

## 65. Artifact Extraction Security

The Lab Agent must treat artifact contents as untrusted until validation completes.

Archive extraction must prevent:

- path traversal;
- symlink attacks;
- oversized expansion;
- malicious filenames;
- unexpected executables.

## 66. Artifact Package Validation

Validation should enforce:

- expected manifest;
- allowed file types;
- maximum size;
- maximum file count;
- checksum;
- signature;
- compatible platform;
- compatible runtime.

## 67. Artifact Supply-Chain Security

The build process should protect against:

- compromised dependencies;
- malicious packages;
- compiler tampering;
- injected binaries;
- unsigned components.

Future supply-chain controls may include:

- SBOM;
- dependency scanning;
- reproducible builds;
- provenance;
- signed build metadata.

## 68. Local Build Security

Because builds occur locally, Studio should provide:

- artifact validation;
- package inspection;
- dependency checks where practical;
- signing workflow;
- clear upload confirmation.

The cloud should not assume the local build environment is trusted.

## 69. Build Artifact Boundary

The security boundary is:

    Local Source
       |
       v
    Local Toolchain
       |
       v
    Artifact
       |
       +--> Signature
       +--> Checksum
       +--> Manifest
       |
       v
    RaaS

The artifact becomes the cloud-visible execution unit.

## 70. Dependency Security

All software components should be tracked.

The repository should support:

- dependency lockfiles;
- vulnerability scanning;
- update policy;
- license review;
- security advisories.

Critical vulnerabilities require defined response SLAs.

## 71. Container/Image Security

Where containers are used:

- images must come from approved registries;
- images should be scanned;
- images should be pinned;
- unnecessary packages should be removed;
- containers should run non-root where possible;
- runtime capabilities should be minimized.

## 72. CI/CD Security

CI/CD must protect:

- source repositories;
- build credentials;
- signing keys;
- deployment credentials;
- artifact registries.

Production deployment credentials should not be available to arbitrary pull requests.

## 73. Branch Protection

Production repositories should use:

- protected branches;
- mandatory review;
- CI checks;
- signed releases where appropriate;
- controlled deployment permissions.

## 74. Software Provenance

Production software should be traceable to:

- source commit;
- build pipeline;
- dependency versions;
- build environment;
- release version.

This applies to:

- Studio;
- Control Plane;
- workers;
- Lab Agent;
- Kritva Runtime;
- platform adapters.

## 75. Lab Agent Supply Chain

The Lab Agent is security-sensitive.

Production installation should verify:

- package signature;
- expected version;
- checksum;
- source/release provenance.

Unauthorized binaries must not be installed.

## 76. Runtime Supply Chain

Kritva Runtime releases should have:

- version identity;
- checksum;
- signature;
- compatibility metadata;
- rollback capability.

## 77. Secure Update

Updates should follow:

    Release
       |
       v
    Sign
       |
       v
    Publish
       |
       v
    Verify
       |
       v
    Install
       |
       v
    Health Check
       |
       v
    Commit / Rollback

## 78. Audit Architecture

Security-sensitive actions must generate audit events.

Examples:

- login;
- logout;
- role change;
- artifact upload;
- artifact revocation;
- booking;
- credit consumption;
- job start;
- job stop;
- lab registration;
- credential rotation;
- admin changes.

## 79. Audit Event Integrity

Audit records should be:

- append-only;
- access-controlled;
- timestamped;
- correlated;
- retained according to policy.

High-assurance environments may additionally use tamper-evident storage.

## 80. Audit Data

An audit event may include:

    event_id
    timestamp
    actor_id
    organization_id
    action
    resource_type
    resource_id
    request_id
    source
    outcome

Secrets must never be included.

## 81. Security Logging

Security logs should include:

- authentication failures;
- authorization failures;
- suspicious API activity;
- rate-limit violations;
- agent authentication failures;
- artifact validation failures;
- signature failures;
- sandbox violations;
- security configuration changes.

## 82. Logging Separation

Operational logs and audit logs should be logically separated.

    Application Logs
        = debugging/operations

    Audit Logs
        = accountability

    Security Events
        = detection/investigation

They may share infrastructure but must retain distinct semantics.

## 83. Monitoring

Security monitoring should detect:

- unusual login activity;
- cross-tenant access attempts;
- repeated authorization failures;
- abnormal API rates;
- unexpected agent connections;
- signature failures;
- repeated artifact failures;
- unusual execution patterns;
- privileged configuration changes.

## 84. Security Alerts

Critical alerts should include:

- signing key compromise;
- agent compromise;
- database credential compromise;
- cross-tenant access;
- repeated failed authentication;
- unauthorized robot execution;
- safety boundary violation;
- suspicious artifact execution.

## 85. Incident Response

Security incidents should follow:

    Detect
       |
       v
    Triage
       |
       v
    Contain
       |
       v
    Investigate
       |
       v
    Eradicate
       |
       v
    Recover
       |
       v
    Review

## 86. Agent Compromise Response

If an agent is compromised:

1. Revoke agent credentials.
2. Prevent new execution.
3. Isolate the lab if required.
4. Preserve logs.
5. Investigate deployed artifacts.
6. Rotate affected credentials.
7. Reinstall trusted software.
8. Recommission the lab.

## 87. Signing Key Compromise

If an artifact signing key is compromised:

1. Revoke the key.
2. Stop accepting newly signed artifacts from it.
3. Identify affected artifacts.
4. Determine execution history.
5. Issue replacement key.
6. Re-sign trusted artifacts.
7. Audit affected runs.
8. Investigate compromise.

## 88. Tenant Isolation Incident

If cross-tenant exposure is suspected:

1. Disable affected endpoint/workflow.
2. Preserve audit evidence.
3. Identify affected tenants.
4. Revoke compromised sessions if required.
5. Fix authorization defect.
6. Test tenant isolation.
7. Restore service under controlled conditions.

## 89. Robot Security Incident

If unauthorized robot execution is detected:

1. Stop application execution through the safest available local mechanism.
2. Preserve physical safety state.
3. Disable affected resource.
4. Revoke job/artifact authorization.
5. Isolate lab if required.
6. Investigate.
7. Recommission only after human review.

The cloud must not attempt to bypass physical safety controls.

## 90. Security and Physical Safety

Cybersecurity and physical safety are related but distinct.

    Cybersecurity
        |
        +--> identity
        +--> authorization
        +--> artifact trust
        +--> network
        +--> sandbox

    Physical Safety
        |
        +--> E-stop
        +--> safety controller
        +--> motion limits
        +--> watchdogs
        +--> mechanical protection

Cybersecurity controls cannot replace physical safety controls.

## 91. Cloud Stop Semantics

`job.stop` means:

> Stop the authorized RaaS application execution according to runtime and platform policy.

It does not mean:

> Trigger a physical emergency stop.

This distinction must exist in:

- API documentation;
- Studio UI;
- Lab Agent protocol;
- operational runbooks.

## 92. Local Watchdog Security

Local watchdogs protect against:

- application hangs;
- runtime failure;
- communication failure;
- control-loop failure.

They operate independently of cloud availability.

## 93. Lab Commissioning Security

Before production activation:

1. Verify network segmentation.
2. Verify agent identity.
3. Verify credentials.
4. Verify runtime version.
5. Verify artifact signature validation.
6. Verify sandbox.
7. Verify resource restrictions.
8. Verify audit.
9. Verify safety systems.
10. Complete human safety review.

## 94. Lab Decommissioning Security

Decommissioning requires:

- disable scheduling;
- revoke agent identity;
- revoke credentials;
- remove cached secrets;
- remove artifacts according to policy;
- archive required audit data;
- remove cloud connectivity;
- verify no active sessions.

## 95. Administrative Security

Administrative operations require stronger controls.

Examples:

- user management;
- role changes;
- credit adjustments;
- refunds;
- platform configuration;
- lab registration;
- resource configuration;
- signing key management.

Privileged operations should require:

- MFA;
- least privilege;
- audit;
- possibly approval workflow.

## 96. Separation of Duties

Where practical, separate:

    Developer
       !=
    Production Operator
       !=
    Security Administrator
       !=
    Financial Administrator

This reduces the impact of compromised accounts.

## 97. Support Access

Support personnel should not receive unrestricted customer access.

Support access should be:

- explicitly authorized;
- time-limited;
- scoped;
- audited;
- revocable.

## 98. Break-Glass Access

Emergency administrative access may be provided through a controlled break-glass
mechanism.

It should require:

- strong authentication;
- explicit reason;
- audit;
- notification;
- automatic expiration.

## 99. Data Security

Data security follows:

    Classification
        |
        v
    Authorization
        |
        v
    Encryption
        |
        v
    Retention
        |
        v
    Deletion

Sensitive data should be minimized and retained only as long as necessary.

## 100. Video Security

Video can contain sensitive information.

Controls should include:

- authenticated access;
- tenant authorization;
- run-level authorization;
- stream expiration;
- optional recording;
- retention controls;
- audit.

## 101. Telemetry Security

Telemetry may reveal:

- robot behavior;
- physical environment;
- system health;
- customer algorithms.

Access must be limited to authorized users.

## 102. Result Security

Results are customer data.

Result downloads should use:

- authenticated API;
- authorization;
- short-lived object URLs;
- audit where appropriate.

## 103. Artifact Confidentiality

Artifacts should be encrypted at rest.

Access should be limited to:

- authorized Control Plane services;
- authorized validation workers;
- authorized Lab Agents;
- authorized users for download.

## 104. Object Storage Security

Object storage should use:

- private buckets/containers;
- encryption;
- scoped access;
- short-lived URLs;
- lifecycle policies;
- access logging.

Public object access should be disabled unless explicitly required.

## 105. Database Security

PostgreSQL should be:

- private;
- encrypted in transit;
- encrypted at rest;
- access-controlled;
- credential-managed;
- monitored.

Applications should use separate identities with minimum permissions.

## 106. Database Privilege Separation

Recommended identities include:

    Application Runtime
    Migration Service
    Read-only Analytics
    Administrative Operator

Application runtime should not have unrestricted schema administration privileges.

## 107. Database Security Monitoring

Monitor:

- failed authentication;
- unusual queries;
- privilege changes;
- connection spikes;
- long-running queries;
- unexpected network sources.

## 108. Queue Security

Queues should be private and authenticated.

Messages may contain sensitive identifiers and therefore require:

- encrypted transport;
- access control;
- retention limits;
- dead-letter protection.

## 109. Dead-Letter Security

Dead-letter queues may contain:

- artifact IDs;
- job IDs;
- error details;
- customer metadata.

They require the same tenant/security controls as the originating workflow.

## 110. API Input Security

All API input is untrusted.

Validation must protect against:

- injection;
- malformed data;
- oversized requests;
- path traversal;
- invalid identifiers;
- unsafe configuration.

## 111. Output Security

API responses must not expose:

- internal database IDs where unnecessary;
- infrastructure secrets;
- stack traces;
- credentials;
- private object-storage credentials;
- internal network details.

## 112. SSRF Protection

Where the platform accepts URLs or remote references, SSRF protections must be applied.

The API should not allow untrusted users to make arbitrary server-side requests.

## 113. Path Traversal Protection

Artifact and result handling must reject:

- `../`;
- absolute paths;
- malicious symlinks;
- unsafe archive extraction paths.

All filesystem operations should resolve against controlled directories.

## 114. Command Injection Protection

The Lab Agent and backend must not construct shell commands directly from untrusted
user input.

Where system commands are required:

- use structured argument APIs;
- allowlist commands;
- avoid shell interpretation;
- validate parameters.

## 115. Remote Shell Policy

The initial RaaS architecture does not provide general remote shell access to robots.

This is a deliberate security boundary.

Diagnostics should use explicit APIs and controlled operational mechanisms.

## 116. Security of Job Parameters

Execution parameters are untrusted input.

They must be validated against:

- artifact manifest;
- platform capabilities;
- runtime policy;
- resource limits.

The user cannot override security policy through job configuration.

## 117. Security of Environment Variables

Environment variables supplied to an application must not expose:

- cloud credentials;
- database credentials;
- Lab Agent credentials;
- signing keys.

Only explicitly approved configuration may be injected.

## 118. Credential Isolation

A customer workload must not access credentials belonging to:

- another customer;
- the Lab Agent;
- the Control Plane;
- cloud infrastructure;
- other applications.

## 119. Multi-Tenant Runtime

If multiple customers can share physical compute, runtime isolation is mandatory.

Where strong isolation cannot be guaranteed, resources should be dedicated.

Physical robot sharing should also follow explicit booking/resource ownership semantics.

## 120. Resource Reuse

After a job completes:

1. Stop application.
2. Clean runtime state.
3. Remove temporary files.
4. Clear application-specific credentials/configuration.
5. Verify resource health.
6. Release resource.

The next customer must not inherit prior customer state.

## 121. Memory and Process Cleanup

Where technically possible, reused resources should ensure:

- terminated processes;
- cleared temporary memory-sensitive state;
- closed devices;
- closed network sessions.

The exact depth depends on operating system and hardware capabilities.

## 122. Customer Data Residue

The lab must prevent persistent residue from one customer being visible to another.

Examples:

- logs;
- artifacts;
- result files;
- caches;
- temporary directories;
- application databases.

Cleanup must be part of resource release.

## 123. Security Testing

Security testing should include:

- SAST;
- dependency scanning;
- secret scanning;
- DAST;
- API authorization tests;
- tenant isolation tests;
- container scanning;
- artifact validation tests;
- Lab Agent security tests;
- penetration testing.

## 124. Threat Modeling

Threat modeling should be repeated when introducing:

- new robot platform;
- new Lab Agent capability;
- new device interface;
- new network path;
- new data type;
- new cloud provider;
- new customer isolation model.

## 125. Threat Summary

Primary threats include:

| Threat | Impact | Primary Control |
|---|---|---|
| Source disclosure | Critical | Local build |
| Artifact tampering | Critical | Signature + checksum |
| Tenant leakage | Critical | AuthZ + isolation |
| Account takeover | Critical | MFA + session security |
| Agent compromise | Critical | Strong identity + sandbox |
| Malicious artifact | Critical | Validation + sandbox |
| Robot takeover | Critical | Explicit authorization + local boundary |
| Network intrusion | High | Segmentation + TLS |
| Credential theft | Critical | Secret manager + rotation |
| API abuse | High | Rate limiting + WAF |
| Supply-chain compromise | Critical | Signing + scanning |
| Data loss | Critical | Backup + recovery |
| Video exposure | High | Authorization + retention |
| Telemetry leakage | High | Tenant isolation |
| Insider abuse | High | Least privilege + audit |

## 126. Threat: Compromised User Device

A compromised developer machine may produce malicious artifacts.

Controls:

- artifact signing;
- platform compatibility;
- runtime sandbox;
- capability restrictions;
- resource limits;
- audit;
- anomaly detection.

Signing proves artifact provenance, not that the application is safe.

## 127. Threat: Compromised Artifact

Controls:

- signature validation;
- checksum;
- artifact scanning;
- capability policy;
- sandbox;
- network restrictions;
- filesystem restrictions;
- runtime resource limits.

## 128. Threat: Compromised Lab Agent

Controls:

- unique identity;
- credential revocation;
- least privilege;
- network segmentation;
- signed software;
- update/rollback;
- monitoring;
- lab isolation.

## 129. Threat: Malicious Customer

A malicious customer may attempt to:

- access another tenant;
- upload malicious artifacts;
- consume resources improperly;
- bypass credit controls;
- access raw hardware;
- abuse network connectivity.

Controls exist at API, artifact, runtime, resource, and lab boundaries.

## 130. Threat: Insider

Insider risks include:

- unauthorized data access;
- credit manipulation;
- artifact access;
- customer data export;
- privileged lab control.

Controls:

- separation of duties;
- MFA;
- least privilege;
- audit;
- support access controls;
- break-glass governance.

## 131. Threat: Stolen Session

Controls:

- short-lived access tokens;
- secure refresh handling;
- session revocation;
- MFA;
- suspicious login detection;
- secure cookies where applicable.

## 132. Threat: Stolen Agent Credential

Controls:

1. Revoke credential.
2. Mark agent unauthorized.
3. Block new execution.
4. Rotate affected secrets.
5. Investigate activity.
6. Recommission agent.

## 133. Threat: Signing Key Compromise

Signing key compromise is a critical incident.

The system must be capable of:

- key revocation;
- replacement;
- artifact identification;
- execution-history analysis;
- trusted-key migration.

## 134. Threat: Cloud Compromise

Even if cloud services are compromised, the architecture should limit blast radius through:

- lab isolation;
- agent authorization;
- runtime sandbox;
- local safety;
- least privilege;
- separate signing keys;
- separate credentials.

## 135. Threat: Robot Network Compromise

Controls:

- segmentation;
- no direct Internet exposure;
- restricted Lab Agent access;
- firewall;
- device allowlists;
- local safety controller.

## 136. Threat: Data Exfiltration

Controls:

- tenant authorization;
- object-storage private access;
- network egress policy;
- runtime network sandbox;
- audit;
- anomaly detection.

## 137. Threat: Denial of Service

Controls:

- API rate limiting;
- quotas;
- queue limits;
- telemetry backpressure;
- video rate controls;
- resource limits;
- autoscaling where appropriate.

## 138. Threat: Replay Attack

Controls:

- TLS;
- short-lived credentials;
- request IDs;
- timestamps where required;
- idempotency keys;
- protocol sequence/nonce mechanisms where required.

## 139. Threat: Stale Authorization

Authorization should be evaluated against current state.

Examples:

- cancelled booking;
- revoked artifact;
- revoked agent;
- disabled user.

Cached authorization must have bounded lifetime.

## 140. Threat: Cross-Lab Access

A Lab Agent identity must be scoped to its assigned lab.

An agent must not automatically access:

- another lab;
- another lab's resources;
- another tenant's artifacts.

## 141. Security Configuration Management

Security configuration should be versioned and auditable.

Examples:

- rate limits;
- platform permissions;
- runtime capabilities;
- network allowlists;
- retention;
- privileged roles.

## 142. Secure Defaults

New resources should default to:

- disabled until configured;
- private;
- least privilege;
- no public object access;
- no unrestricted device access;
- no unrestricted network access.

## 143. Fail-Closed Security

When security state is uncertain:

- deny new execution;
- reject invalid artifacts;
- reject unknown agents;
- reject unauthorized subscriptions.

Physical safety behavior remains governed by local safety systems.

## 144. Security State vs Operational State

Security state must be distinct from operational state.

Example:

    Resource = AVAILABLE
    Agent Identity = REVOKED

The resource must not become schedulable.

## 145. Security and Booking

A valid booking does not bypass security checks.

Before execution:

    Booking
      +
    User Authorization
      +
    Artifact Trust
      +
    Agent Trust
      +
    Resource Compatibility
      +
    Runtime Policy
      |
      v
    Execute

## 146. Security and Credits

Financial authorization and execution authorization are separate.

Sufficient credits do not imply:

- permission to use a platform;
- permission to access a lab;
- permission to execute an artifact.

## 147. Security and Results

Result ownership follows the organization/project/run relationship.

A user cannot access results merely by knowing the result ID.

Authorization is always evaluated.

## 148. Security and Telemetry

Telemetry access must follow run/project authorization.

Lab operators may have broader operational access, but customer access remains scoped.

## 149. Security and Video

Video access requires authorization to the relevant run/resource.

Live stream URLs should be short-lived and non-public.

## 150. Security Phase Mapping

| Phase | Security Scope | Primary Outcome |
|---|---|---|
| Phase 0 | Threat model + boundaries | Security baseline |
| Phase 1 | AuthN/AuthZ | Identity security |
| Phase 2 | Artifact security | Trusted execution |
| Phase 3 | Runtime sandbox | Workload isolation |
| Phase 4 | Commercial security | Financial integrity |
| Phase 5 | Lab security | Secure execution |
| Phase 6 | Robot security | Physical boundary |
| Phase 7 | Data security | Observation protection |
| Phase 8 | Production security | Full hardening |

## 151. Phase 0 — Security Foundation

Deliver:

- threat model;
- trust zones;
- security boundaries;
- identity model;
- tenant model;
- secret model;
- artifact trust model.

Acceptance:

- threats are documented;
- trust boundaries are reviewed;
- security invariants are approved.

## 152. Phase 1 — Authentication and Authorization

Deliver:

- identity integration;
- MFA for privileged users;
- RBAC;
- tenant isolation;
- session management;
- audit.

Acceptance:

- unauthorized access is blocked;
- tenant isolation tests pass;
- privileged access requires strong authentication.

## 153. Phase 2 — Artifact Security

Deliver:

- artifact signing;
- checksum;
- validation;
- immutable artifacts;
- revocation;
- secure object access.

Acceptance:

- tampered artifacts are rejected;
- unsigned production artifacts are rejected;
- unauthorized artifacts cannot execute.

## 154. Phase 3 — Runtime Security

Deliver:

- sandbox;
- process isolation;
- filesystem policy;
- network policy;
- device allowlist;
- resource limits.

Acceptance:

- workload cannot access agent secrets;
- workload cannot access other customer data;
- prohibited device access is blocked.

## 155. Phase 4 — Commercial Security

Deliver:

- credit authorization;
- immutable ledger;
- idempotency;
- financial audit;
- privileged financial roles.

Acceptance:

- duplicate transactions are prevented;
- unauthorized adjustments are blocked;
- financial actions are audited.

## 156. Phase 5 — Lab Security

Deliver:

- Lab Agent identity;
- secure lab protocol;
- network segmentation;
- agent authorization;
- signed agent software.

Acceptance:

- unauthorized agents are rejected;
- robot networks are not Internet-exposed;
- agent credentials can be revoked.

## 157. Phase 6 — Physical Robot Security

Deliver:

- platform security policy;
- hardware access controls;
- local watchdog;
- safety integration;
- physical commissioning checklist.

Acceptance:

- raw privileged hardware access is restricted;
- safety controller remains authoritative;
- physical safety review passes.

## 158. Phase 7 — Data and Observation Security

Deliver:

- telemetry authorization;
- log authorization;
- video authorization;
- result authorization;
- retention.

Acceptance:

- users can access only authorized observation data;
- video access is protected;
- retention policies are enforced.

## 159. Phase 8 — Production Security

Deliver:

- WAF;
- vulnerability management;
- SIEM/security monitoring;
- incident response;
- penetration testing;
- key rotation;
- DR security validation;
- operational runbooks.

Acceptance:

- production security controls are continuously monitored;
- critical incidents have documented response;
- security recovery is tested.

## 160. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Customer source exposure | Critical | Local build |
| Binary reverse engineering | Medium/High | Minimize artifact contents |
| Malicious artifact | Critical | Signature + sandbox |
| Signing key compromise | Critical | KMS/HSM + rotation |
| Tenant isolation failure | Critical | Server-side AuthZ + tests |
| Account takeover | Critical | MFA + secure sessions |
| Agent compromise | Critical | Identity + segmentation |
| Runtime escape | Critical | Sandbox + least privilege |
| Robot takeover | Critical | Lab boundary + safety |
| Secret leakage | Critical | Secret manager |
| API abuse | High | Rate limiting/WAF |
| Supply-chain compromise | Critical | Signing/scanning |
| Data exfiltration | High | Egress controls |
| Video exposure | High | Authorization |
| Telemetry exposure | High | Tenant isolation |
| Data loss | Critical | Backup/restore |
| Insider abuse | High | Separation + audit |

## 161. Open Questions

1. Which identity provider will be selected?
2. Will MFA be mandatory for all users or only privileged roles?
3. JWT or opaque access tokens?
4. What token lifetime will be used?
5. Which signing algorithm will be standardized?
6. Will artifact signing use KMS, HSM, or both?
7. How will developer signing keys be managed?
8. Will unsigned development artifacts be permitted?
9. What artifact scanning tools will be used?
10. Will an SBOM be mandatory?
11. Which runtime sandbox mechanism will be used on Linux?
12. Which sandbox is available on each target robot platform?
13. Will containers be mandatory where supported?
14. Which device interfaces require privileged access?
15. What network egress policy will applications receive?
16. What exact Lab Agent identity mechanism will be used?
17. Will hardware-backed agent identity be mandatory?
18. What credential rotation interval is required?
19. What API rate limits will be used?
20. Which WAF will be selected?
21. What exact tenant isolation defense-in-depth will be deployed?
22. Will PostgreSQL RLS be enabled?
23. What security event/SIEM platform will be used?
24. What incident response SLA applies to critical incidents?
25. What vulnerability remediation SLA applies to critical CVEs?
26. What support-access model will be used?
27. What break-glass process is required?
28. What exact video privacy requirements apply?
29. What regulatory requirements apply to customer data?
30. What penetration-testing cadence is required?
31. What exact production key-rotation policy is required?
32. What physical safety certification is required per robot platform?

## 162. Security Architectural Invariants

The following invariants must remain true:

1. Customer source code is not required by the initial cloud build architecture.
2. The cloud receives execution artifacts rather than source code.
3. Production artifacts are cryptographically authenticated.
4. Signing keys are never embedded in artifacts.
5. Every human user is authenticated.
6. Every privileged user has stronger authentication.
7. Every sensitive operation is authorized.
8. Tenant isolation is enforced server-side.
9. Lab Agents have unique identities.
10. Revoked agents cannot receive new authorized execution.
11. Runtime workloads run with least privilege.
12. Customer workloads cannot access Lab Agent secrets.
13. Customer workloads cannot access other customers' data.
14. Robot networks are not directly exposed to the Internet.
15. The Lab Agent is the cloud-to-lab security boundary.
16. Raw robot control is not exposed through the public API.
17. Physical safety remains independent of cloud authorization.
18. Audit records are protected from unauthorized modification.
19. Secrets are managed outside source repositories.
20. Security decisions fail closed when trust is uncertain.
21. Large artifacts use protected object storage.
22. WebSocket subscriptions are authorization-controlled.
23. Financial operations are protected by idempotency and transactional controls.
24. Security events are observable.
25. Security controls are tested continuously.

## 163. Full Acceptance Criteria Checklist

### Security Architecture

- [ ] Security principles are documented.
- [ ] Trust zones are defined.
- [ ] Trust boundaries are defined.
- [ ] Security authorities are defined.
- [ ] Threat model exists.
- [ ] Security invariants are approved.

### Source-Code Privacy

- [ ] Source code remains local by default.
- [ ] Local build is supported.
- [ ] Source is not required by the cloud.
- [ ] Artifact packaging excludes unnecessary source.
- [ ] Debug symbols are controlled.
- [ ] Artifact contents can be inspected before upload.
- [ ] Source exposure limitations are documented.

### Artifact Security

- [ ] Artifact manifest exists.
- [ ] Artifact checksum exists.
- [ ] Artifact signature exists.
- [ ] Production signing keys are protected.
- [ ] Artifact signature is verified.
- [ ] Artifact checksum is verified.
- [ ] Artifact compatibility is verified.
- [ ] Artifact immutability is enforced.
- [ ] Artifact revocation is supported.
- [ ] Tampered artifacts are rejected.

### Authentication

- [ ] Human authentication is implemented.
- [ ] MFA is implemented for privileged roles.
- [ ] Session management is secure.
- [ ] Access tokens are protected.
- [ ] Lab Agents have unique identities.
- [ ] Service identities are unique.
- [ ] Agent credentials can be revoked.
- [ ] Credential rotation is supported.

### Authorization

- [ ] RBAC exists.
- [ ] Resource-level authorization exists.
- [ ] Organization-level authorization exists.
- [ ] Tenant isolation is server-side.
- [ ] Cross-tenant access is blocked.
- [ ] Administrative access is restricted.
- [ ] Privileged operations are audited.
- [ ] Authorization is re-evaluated for sensitive operations.

### Tenant Isolation

- [ ] Organization is the tenant boundary.
- [ ] Projects are tenant-scoped.
- [ ] Artifacts are tenant-scoped.
- [ ] Bookings are tenant-scoped.
- [ ] Credits are tenant-scoped.
- [ ] Jobs are tenant-scoped.
- [ ] Runs are tenant-scoped.
- [ ] Results are tenant-scoped.
- [ ] Telemetry access is tenant-scoped.
- [ ] Video access is tenant-scoped.
- [ ] Tenant isolation tests exist.

### Secrets

- [ ] Secrets are not stored in Git.
- [ ] Secrets use a secret manager.
- [ ] Secrets are encrypted.
- [ ] Access is least privilege.
- [ ] Secret rotation exists.
- [ ] Credentials are audited where appropriate.
- [ ] Secrets are excluded from logs.
- [ ] Customer workloads cannot access platform secrets.

### Cryptographic Keys

- [ ] Signing keys are separated.
- [ ] Encryption keys are separated.
- [ ] Agent identity keys are separated.
- [ ] Key rotation exists.
- [ ] Key revocation exists.
- [ ] Historical artifact verification remains possible.
- [ ] Private keys are protected by approved mechanisms.

### API Security

- [ ] HTTPS is mandatory.
- [ ] Authentication is enforced.
- [ ] Authorization is enforced.
- [ ] Input validation exists.
- [ ] Request size limits exist.
- [ ] Rate limiting exists.
- [ ] Idempotency protects sensitive operations.
- [ ] Error responses do not leak secrets.
- [ ] SSRF protections exist where required.
- [ ] Command injection protections exist.

### WebSocket Security

- [ ] WebSocket connections are authenticated.
- [ ] WebSocket connections use encryption.
- [ ] Subscriptions are authorized.
- [ ] Tenant boundaries are enforced.
- [ ] Connection rate limiting exists.
- [ ] Reconnection revalidates authorization.
- [ ] Missed events can be reconciled through REST.

### Runtime Security

- [ ] Runtime sandbox exists.
- [ ] Application processes are isolated.
- [ ] Filesystem access is restricted.
- [ ] Network access is restricted.
- [ ] Device access is restricted.
- [ ] CPU limits exist.
- [ ] Memory limits exist.
- [ ] Disk limits exist.
- [ ] Process limits exist.
- [ ] Execution duration limits exist.
- [ ] Customer workload cannot access agent credentials.

### Lab Security

- [ ] Lab Agent has unique identity.
- [ ] Agent authentication is secure.
- [ ] Agent authorization is scoped.
- [ ] Agent credentials can be revoked.
- [ ] Lab network is segmented.
- [ ] Robot network is protected.
- [ ] Robot network is not directly Internet-accessible.
- [ ] Agent software is signed.
- [ ] Agent updates are verified.
- [ ] Lab compromise can be isolated.

### Robot Security

- [ ] Platform identity is validated.
- [ ] Runtime version is validated.
- [ ] Device access is allowlisted.
- [ ] Raw hardware access is restricted.
- [ ] Local watchdog is implemented where required.
- [ ] Robot safety state is independent.
- [ ] Physical E-stop remains authoritative.
- [ ] Cloud commands cannot bypass safety controls.

### Data Security

- [ ] Data classification exists.
- [ ] Sensitive data is encrypted.
- [ ] Object storage is private.
- [ ] Database is protected.
- [ ] Result access is authorized.
- [ ] Telemetry access is authorized.
- [ ] Video access is authorized.
- [ ] Data retention is defined.
- [ ] Data deletion is controlled.

### Audit

- [ ] Authentication events are audited.
- [ ] Authorization-sensitive actions are audited.
- [ ] Role changes are audited.
- [ ] Artifact operations are audited.
- [ ] Booking operations are audited.
- [ ] Credit operations are audited.
- [ ] Execution operations are audited.
- [ ] Lab operations are audited.
- [ ] Administrative operations are audited.
- [ ] Audit records are protected.

### Monitoring

- [ ] Authentication failures are monitored.
- [ ] Authorization failures are monitored.
- [ ] Rate-limit violations are monitored.
- [ ] Agent authentication failures are monitored.
- [ ] Artifact signature failures are monitored.
- [ ] Sandbox violations are monitored.
- [ ] Security configuration changes are monitored.
- [ ] Suspicious execution is monitored.
- [ ] Critical alerts are defined.

### Incident Response

- [ ] Incident response process exists.
- [ ] Agent compromise procedure exists.
- [ ] Signing key compromise procedure exists.
- [ ] Tenant isolation incident procedure exists.
- [ ] Robot security incident procedure exists.
- [ ] Credential revocation procedure exists.
- [ ] Evidence preservation procedure exists.
- [ ] Recovery procedure exists.
- [ ] Post-incident review exists.

### Supply Chain

- [ ] Dependencies are locked.
- [ ] Dependencies are scanned.
- [ ] Secrets are scanned.
- [ ] Containers/images are scanned.
- [ ] Production binaries are signed.
- [ ] Build provenance is tracked.
- [ ] Release versions are traceable.
- [ ] Critical vulnerabilities have remediation SLAs.

### CI/CD

- [ ] Production credentials are protected.
- [ ] Signing operations are protected.
- [ ] Branch protection exists.
- [ ] Mandatory CI exists.
- [ ] Security scans run in CI.
- [ ] Deployment permissions are restricted.
- [ ] Release provenance is recorded.

### Physical Safety Boundary

- [ ] Physical E-stop remains independent.
- [ ] Local safety controller remains authoritative.
- [ ] Cloud stop is documented as non-E-stop.
- [ ] Local watchdog is independent of cloud connectivity.
- [ ] Human safety review is required before physical production deployment.
- [ ] Safety incidents can block resource scheduling.

### Production Readiness

- [ ] WAF is configured.
- [ ] Rate limiting is configured.
- [ ] Secrets are centrally managed.
- [ ] Keys are rotated.
- [ ] Security monitoring is active.
- [ ] Incident response is documented.
- [ ] Penetration testing is completed.
- [ ] Backup security is validated.
- [ ] Disaster recovery security is validated.
- [ ] Security runbooks are available.

### Phase Completion

- [ ] Phase 0 security foundation is complete.
- [ ] Phase 1 authentication/authorization is complete.
- [ ] Phase 2 artifact security is complete.
- [ ] Phase 3 runtime sandboxing is complete.
- [ ] Phase 4 commercial security is complete.
- [ ] Phase 5 lab security is complete.
- [ ] Phase 6 physical robot security is complete.
- [ ] Phase 7 observation/data security is complete.
- [ ] Phase 8 production security hardening is complete.

## 164. Final Security Architecture Baseline

Kritva RaaS uses a layered security architecture in which no single control is
expected to provide complete protection.

The resulting security model is:

    Customer Source
          |
          | Local Only
          v
    Kritva RaaS Studio
          |
          | Signed Artifact
          v
    +----------------------+
    | RaaS Control Plane   |
    |                      |
    | AuthN                |
    | AuthZ                |
    | Tenant Isolation     |
    | Artifact Validation  |
    | Booking              |
    | Credits              |
    | Job Authorization    |
    +----------+-----------+
               |
          Secure Protocol
               |
               v
    +----------------------+
    | Lab Agent            |
    |                      |
    | Identity             |
    | Policy               |
    | Artifact Validation  |
    | Deployment           |
    | Runtime Boundary     |
    +----------+-----------+
               |
               v
    +----------------------+
    | Kritva Runtime       |
    |                      |
    | Sandbox              |
    | Resource Limits      |
    | Device Policy        |
    | Network Policy       |
    +----------+-----------+
               |
               v
    +----------------------+
    | Robot Controller     |
    +----------+-----------+
               |
               v
    +----------------------+
    | Safety Controller    |
    |                      |
    | E-Stop               |
    | Motion Safety        |
    | Local Watchdog       |
    +----------------------+

The most important security boundary is the transition from customer source to
execution artifact:

    Source
       |
       | stays local
       v
    Local Build
       |
       v
    Signed .krv
       |
       | controlled transfer
       v
    Cloud
       |
       | authorization
       v
    Lab
       |
       | verification
       v
    Robot Runtime

The second critical boundary is the cloud-to-lab boundary:

    Cloud
       |
       | authenticated + authorized
       v
    Lab Agent
       |
       | local policy
       v
    Runtime
       |
       | platform policy
       v
    Robot

The third critical boundary is the robot-to-safety boundary:

    Cloud
       X
    Safety Controller

The cloud must never become the ultimate authority for physical safety.

The governing security principles are:

1. Keep customer source local.
2. Treat every uploaded artifact as untrusted until verified.
3. Cryptographically authenticate production artifacts.
4. Protect signing keys independently.
5. Authenticate every actor.
6. Authorize every sensitive operation.
7. Enforce tenant isolation on the server.
8. Use least privilege everywhere.
9. Keep Lab Agents uniquely identifiable.
10. Keep robot networks isolated.
11. Sandbox customer workloads.
12. Restrict device and network access.
13. Protect secrets outside application source.
14. Audit privileged and security-sensitive actions.
15. Monitor security-relevant behavior.
16. Make security decisions fail closed.
17. Preserve local physical safety.
18. Separate cybersecurity from safety authority.
19. Make recovery and revocation operationally practical.
20. Continuously test the security boundaries.

The architecture therefore treats security as a property of the complete execution path,
not as a feature of the API alone.

The production trust chain is:

    Identity
       |
       v
    Authorization
       |
       v
    Booking
       |
       v
    Artifact Trust
       |
       v
    Agent Trust
       |
       v
    Runtime Policy
       |
       v
    Resource Policy
       |
       v
    Local Safety

Only when all applicable security conditions are satisfied may an authorized RaaS
execution proceed.

This layered model provides the foundation for operating Kritva RaaS across multiple
organizations, robot platforms, physical laboratories, and future RaaS deployments
while preserving customer IP, tenant isolation, execution integrity, and physical
safety boundaries.
