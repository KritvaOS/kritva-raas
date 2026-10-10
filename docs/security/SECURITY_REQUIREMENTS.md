# Kritva RaaS Security Requirements

## 1. Purpose

This document defines the production-grade security requirements for Kritva RaaS.

Kritva RaaS enables users to build robotics applications locally, package executable
artifacts, book robotic resources, upload artifacts, execute applications on virtual
or physical robots, and retrieve results.

The security architecture must protect:

- User identities and credentials.
- Organization and tenant data.
- Local robotics source code.
- Compiled and signed execution artifacts.
- Credit, booking, billing, and financial records.
- Robot and laboratory infrastructure.
- Runtime execution environments.
- Video, telemetry, logs, and experiment results.
- Administrative and operational interfaces.
- Security and audit evidence.

The primary security principle is:

> Source remains local; only an authorized execution artifact crosses the RaaS boundary.

Security must not depend on the assumption that the cloud is trusted, the robot is
trusted, or the user device is trusted.

## 2. Scope

This document applies to:

- RaaS Studio.
- RaaS Web Console.
- RaaS backend/control plane.
- Authentication and authorization.
- PostgreSQL database.
- Object storage.
- Queues and asynchronous workers.
- Lab Agent.
- Robot runtime integration.
- Robot and laboratory resources.
- Artifact packaging, signing, validation, deployment, and execution.
- Booking and credit operations.
- Results and experiment data.
- Audit and security logging.
- Cloud infrastructure.
- CI/CD and deployment infrastructure.
- Administrative operations.
- Security incident handling.
- Data retention and deletion.

Security requirements cover:

    User
      |
      v
    RaaS Studio / Web Console
      |
      | TLS
      v
    API / Control Plane
      |
      +---- PostgreSQL
      +---- Object Storage
      +---- Queue / Workers
      |
      | Secure Lab Protocol
      v
    Lab Agent
      |
      v
    Kritva Runtime
      |
      v
    Robot / Simulator

## 3. Goals

The security architecture shall:

1. Authenticate every protected user and service interaction.
2. Authorize every protected operation.
3. Enforce organization-level tenant isolation.
4. Keep user source code outside the RaaS service boundary by default.
5. Protect artifacts against tampering.
6. Verify artifact compatibility before execution.
7. Prevent unauthorized robot access.
8. Prevent cloud compromise from directly defeating physical robot safety.
9. Protect credentials, tokens, keys, and secrets.
10. Protect sensitive user and experiment data.
11. Provide security-relevant auditability.
12. Detect suspicious and unauthorized activity.
13. Support controlled administrative access.
14. Support secure deployment and software supply-chain controls.
15. Provide evidence suitable for future compliance programs.
16. Maintain security controls across Development, Staging, and Production.

## 4. Non-Goals

This document does not define:

- Physical robot mechanical design.
- Detailed emergency-stop circuitry.
- Functional robot control algorithms.
- Full privacy policy wording.
- Product pricing.
- General application architecture unrelated to security.
- Vendor-specific cloud implementation.
- Formal certification requirements unless later adopted.
- Source-code storage as a default RaaS feature.
- Physical safety certification of third-party robots.

Physical safety remains authoritative at the robot, controller, and local laboratory
layers.

## 5. Security Principles

### 5.1 Zero-trust boundary

No component shall implicitly trust another component solely because it is inside
the Kritva network or cloud environment.

### 5.2 Least privilege

Users, services, workers, Lab Agents, and administrators shall receive only the
permissions required for their responsibilities.

### 5.3 Defense in depth

Security shall be enforced through multiple independent controls:

    Identity
      -> Authentication
      -> Authorization
      -> Tenant validation
      -> Domain policy
      -> Repository filtering
      -> Database constraints
      -> Audit
      -> Detection

### 5.4 Secure by default

New accounts, projects, platforms, robots, credentials, APIs, and resources shall
default to the most restrictive practical configuration.

### 5.5 Fail closed

Security failures shall result in denial of access or execution rather than
automatic fallback to an insecure mode.

### 5.6 Explicit trust boundaries

The major trust boundaries are:

    [Untrusted User Device]
              |
              v
    [Studio / Browser]
              |
        Internet/TLS
              |
              v
    [RaaS Control Plane]
        |             |
        v             v
    [Database]   [Object Storage]
              |
              v
         [Lab Boundary]
              |
              v
        [Lab Agent]
              |
              v
       [Robot Runtime]
              |
              v
        [Physical Robot]

### 5.7 Physical safety independence

Cloud services shall never be the sole safety mechanism for a physical robot.

A loss of:

- Internet connectivity,
- cloud service availability,
- authentication service availability,
- Lab Agent connectivity,
- telemetry,
- video,
- job scheduler,
- database,

shall not cause unsafe autonomous robot behavior.

## 6. Definitions

| Term | Definition |
|---|---|
| User | Authenticated human account |
| Organization | Primary logical tenant |
| Membership | User's relationship to an Organization |
| Role | Set of authorized permissions |
| Project | Organization-owned robotics development unit |
| Platform | Global robotic platform definition |
| Platform Version | Versioned platform/runtime contract |
| Resource | Allocatable execution unit |
| Robot | Physical robot identity |
| Lab | Physical or logical robotics facility |
| Lab Agent | Trusted local service connecting RaaS to lab resources |
| Artifact | Packaged executable `.krv` execution unit |
| Manifest | Artifact metadata describing compatibility and policy requirements |
| Booking | Reservation of a platform/resource/time interval |
| Job | Requested remote execution operation |
| Run | Actual execution instance associated with a Job |
| Result | Persisted output of a completed or failed Run |
| Source Code | User's original robotics source and development files |
| Tenant | Organization isolation boundary |
| Security Event | Event indicating security-relevant activity |
| Audit Record | Immutable or append-oriented evidence of important operations |
| Service Principal | Non-human identity used by software |
| Secret | Credential or cryptographic material requiring protection |
| Restricted Data | Data requiring stronger access controls |
| Safety-Critical Operation | Operation capable of affecting physical robot behavior |
| Artifact Signature | Cryptographic proof of artifact authenticity/integrity |

## 7. Security Classification

Kritva RaaS shall classify data according to sensitivity.

| Classification | Examples | Minimum Controls |
|---|---|---|
| Public | Published platform metadata | Integrity |
| Internal | Operational metadata | Authenticated access |
| Confidential | Project metadata, results | Tenant isolation + encryption |
| Restricted | Credentials, tokens, financial records | Strong access + encryption + audit |
| Safety-Critical | Robot control/deployment authorization | Strong authorization + audit + local safety |

Security classification shall influence:

- Access control.
- Logging.
- Encryption.
- Retention.
- Export.
- Administrative access.
- Incident handling.

# 8. Security Requirements Catalogue

## 8.1 Authentication Requirements

| ID | Priority | Requirement | Rationale | Verification | Phase |
|---|---|---|---|---|---|
| SEC-001 | PRI-0 | All protected API operations shall require authenticated identity. | Prevent anonymous access to protected resources. | Integration test | 1 |
| SEC-002 | PRI-0 | Authentication shall use industry-standard protocols and shall not transmit passwords in plaintext. | Protect credentials. | Security review + test | 1 |
| SEC-003 | PRI-0 | Password credentials, where supported, shall be stored only using an approved adaptive password hashing algorithm. | Prevent credential disclosure from database compromise. | Code review + test | 1 |
| SEC-004 | PRI-0 | Session tokens shall be cryptographically random and non-predictable. | Prevent session hijacking. | Security test | 1 |
| SEC-005 | PRI-0 | Access tokens shall have bounded lifetime. | Limit impact of stolen tokens. | Configuration test | 1 |
| SEC-006 | PRI-0 | Refresh-token handling shall support revocation. | Enable account/session containment. | Integration test | 1 |
| SEC-007 | PRI-0 | Logout shall invalidate or revoke the applicable session/token. | Prevent continued unauthorized use. | Integration test | 1 |
| SEC-008 | PRI-0 | Authentication failure responses shall not reveal whether an account exists. | Reduce account enumeration. | API test | 1 |
| SEC-009 | PRI-0 | Authentication endpoints shall implement rate limiting and abuse protection. | Reduce brute-force attacks. | Load/security test | 1 |
| SEC-010 | PRI-1 | Multi-factor authentication shall be supported for administrators. | Protect privileged accounts. | Integration test | 1 |
| SEC-011 | PRI-1 | MFA shall be enforceable by organization security policy. | Allow enterprise security requirements. | Policy test | 8 |
| SEC-012 | PRI-0 | Administrative accounts shall not use shared credentials. | Preserve accountability. | Review | 1 |
| SEC-013 | PRI-0 | Service-to-service authentication shall use non-human service identities. | Prevent shared user credentials. | Architecture review | 2 |
| SEC-014 | PRI-0 | Lab Agents shall authenticate using provisioned machine identity or equivalent strong credentials. | Prevent rogue lab connections. | Integration test | 6 |
| SEC-015 | PRI-0 | Expired, revoked, or disabled credentials shall not authorize new operations. | Contain compromised identities. | Integration test | 1 |
| SEC-016 | PRI-1 | Suspicious authentication activity shall be logged. | Enable detection and investigation. | Log verification | 7 |
| SEC-017 | PRI-1 | Administrative authentication events shall be auditable. | Required for privileged accountability. | Audit test | 7 |
| SEC-018 | PRI-1 | Sessions shall be terminated after configurable inactivity where appropriate. | Reduce unattended-session risk. | Integration test | 8 |

## 8.2 Authorization Requirements

| ID | Priority | Requirement | Rationale | Verification | Phase |
|---|---|---|---|---|---|
| SEC-020 | PRI-0 | Every protected operation shall perform authorization after authentication. | Authentication alone is insufficient. | Integration test | 1 |
| SEC-021 | PRI-0 | Authorization shall be based on explicit permissions/roles. | Prevent implicit privilege. | Unit + integration test | 1 |
| SEC-022 | PRI-0 | Organization membership shall be checked before organization-owned operations. | Enforce tenancy. | Integration test | 1 |
| SEC-023 | PRI-0 | Project access shall be checked before project-owned operations. | Prevent project data leakage. | Integration test | 2 |
| SEC-024 | PRI-0 | Resource operations shall validate platform and booking authorization. | Prevent unauthorized robot use. | Integration test | 4 |
| SEC-025 | PRI-0 | Artifact execution shall require explicit execution authorization. | Execution affects remote resources. | Integration test | 5 |
| SEC-026 | PRI-0 | Physical robot execution shall require valid booking and resource allocation. | Prevent unreserved robot control. | Integration test | 5 |
| SEC-027 | PRI-0 | Users shall not elevate their own roles. | Prevent privilege escalation. | Security test | 1 |
| SEC-028 | PRI-0 | Organization administrators shall not automatically gain physical safety override capability. | Separate business administration from safety control. | Architecture review | 6 |
| SEC-029 | PRI-0 | Platform catalog permissions shall be separated from lab operational permissions. | Limit operational authority. | Role test | 6 |
| SEC-030 | PRI-0 | Lab Agent permissions shall be restricted to assigned lab resources. | Limit blast radius. | Integration test | 6 |
| SEC-031 | PRI-0 | Service identities shall use scoped permissions. | Limit compromised-service impact. | IAM review | 2 |
| SEC-032 | PRI-1 | Sensitive administrative operations shall require elevated authorization. | Protect high-impact functions. | Integration test | 8 |
| SEC-033 | PRI-1 | Authorization failures shall be audited without exposing sensitive data. | Support investigation. | Audit test | 7 |
| SEC-034 | PRI-0 | Deny-by-default authorization shall apply when policy is missing or ambiguous. | Prevent fail-open security behavior. | Negative tests | 1 |

## 8.3 Source-Code Privacy Requirements

| ID | Priority | Requirement | Rationale | Verification | Phase |
|---|---|---|---|---|---|
| SEC-040 | PRI-0 | RaaS shall not require source code upload for remote execution. | Protect intellectual property. | Architecture review | 2 |
| SEC-041 | PRI-0 | Studio shall build source locally where supported. | Keep source outside cloud boundary. | E2E test | 2 |
| SEC-042 | PRI-0 | The remote execution interface shall accept packaged artifacts rather than source by default. | Minimize source exposure. | API test | 3 |
| SEC-043 | PRI-0 | Server logs shall not contain source-code contents. | Prevent accidental disclosure. | Log inspection | 3 |
| SEC-044 | PRI-0 | API errors shall not echo source code or sensitive build content. | Prevent leakage through diagnostics. | Negative test | 3 |
| SEC-045 | PRI-0 | Source files shall not be persisted in PostgreSQL by RaaS application services. | Maintain source privacy boundary. | Repository review | 2 |
| SEC-046 | PRI-0 | Source files shall not be automatically copied to object storage. | Prevent hidden source retention. | Integration test | 2 |
| SEC-047 | PRI-1 | Crash reports shall sanitize source paths and source contents. | Protect developer information. | Failure test | 7 |
| SEC-048 | PRI-0 | Debug logging shall not expose source or secrets in Production. | Reduce accidental leakage. | Configuration test | 8 |
| SEC-049 | PRI-1 | Local build caches shall be protected by the Studio operating-system account boundary. | Protect source on endpoint. | Security review | 2 |
| SEC-050 | PRI-1 | Documentation shall clearly identify the source-to-artifact security boundary. | Establish user expectations. | Documentation review | 2 |

## 8.4 Artifact Integrity Requirements

| ID | Priority | Requirement | Rationale | Verification | Phase |
|---|---|---|---|---|---|
| SEC-060 | PRI-0 | Every remotely executable artifact shall have a unique immutable identity. | Prevent ambiguity and substitution. | Integration test | 3 |
| SEC-061 | PRI-0 | Artifact metadata shall include platform identity. | Validate target compatibility. | Contract test | 3 |
| SEC-062 | PRI-0 | Artifact metadata shall include architecture. | Prevent incompatible execution. | Contract test | 3 |
| SEC-063 | PRI-0 | Artifact metadata shall include KritvaOS/runtime compatibility. | Prevent unsupported execution. | Compatibility test | 3 |
| SEC-064 | PRI-0 | Artifact metadata shall include SDK compatibility. | Prevent API/runtime mismatch. | Compatibility test | 3 |
| SEC-065 | PRI-0 | Artifact checksum shall be verified after upload. | Detect corruption or tampering. | Integration test | 3 |
| SEC-066 | PRI-0 | Signed artifacts shall have their signature verified before execution. | Establish artifact authenticity. | Cryptographic test | 3 |
| SEC-067 | PRI-0 | Invalid signatures shall block execution. | Fail closed. | Negative test | 3 |
| SEC-068 | PRI-0 | Revoked artifacts/signing identities shall be rejected. | Contain compromised artifacts. | Integration test | 8 |
| SEC-069 | PRI-0 | Artifact content shall not be modified after successful validation. | Preserve validated execution unit. | Storage/integration test | 3 |
| SEC-070 | PRI-0 | Artifact storage shall enforce organization/project authorization. | Prevent cross-tenant artifact access. | Security test | 3 |
| SEC-071 | PRI-0 | Artifact deployment shall validate manifest against target Platform Version. | Prevent incompatible execution. | Integration test | 5 |
| SEC-072 | PRI-0 | Required capabilities shall be validated before execution. | Prevent unauthorized hardware use. | Integration test | 5 |
| SEC-073 | PRI-0 | Artifact entrypoint shall be explicitly declared. | Prevent ambiguous execution. | Validation test | 3 |
| SEC-074 | PRI-1 | Artifact expiration shall be enforceable where policy requires it. | Limit stale artifact execution. | Policy test | 8 |
| SEC-075 | PRI-0 | Artifact download shall require authorization. | Protect executable IP. | API test | 3 |
| SEC-076 | PRI-1 | Artifact provenance shall be retained for security investigation. | Support incident analysis. | Audit review | 7 |

## 8.5 Tenant Isolation Requirements

| ID | Priority | Requirement | Rationale | Verification | Phase |
|---|---|---|---|---|---|
| SEC-080 | PRI-0 | Organization shall be the primary logical tenant boundary. | Establish consistent isolation. | Architecture review | 1 |
| SEC-081 | PRI-0 | Customer-owned records shall carry organization context where practical. | Defense in depth. | Schema review | 2 |
| SEC-082 | PRI-0 | Repository queries shall filter by organization context. | Prevent accidental cross-tenant reads. | Code review + tests | 2 |
| SEC-083 | PRI-0 | API path parameters shall never override authenticated tenant context without authorization. | Prevent IDOR attacks. | Security test | 1 |
| SEC-084 | PRI-0 | Cross-organization object references shall be rejected unless explicitly authorized. | Prevent data crossing tenants. | Integration test | 2 |
| SEC-085 | PRI-0 | Project membership shall be organization-consistent. | Prevent membership boundary bypass. | DB + integration test | 2 |
| SEC-086 | PRI-0 | Artifact access shall enforce organization ownership. | Protect IP. | Integration test | 3 |
| SEC-087 | PRI-0 | Booking access shall enforce organization ownership. | Protect resource and financial state. | Integration test | 4 |
| SEC-088 | PRI-0 | Credit wallets and ledgers shall be organization-scoped. | Prevent financial leakage. | DB + integration test | 4 |
| SEC-089 | PRI-0 | Results and experiments shall be organization-scoped. | Protect experiment data. | Integration test | 7 |
| SEC-090 | PRI-0 | Object-storage keys shall include tenant-scoped namespaces or equivalent isolation. | Prevent object-level leakage. | Storage test | 3 |
| SEC-091 | PRI-0 | Tenant authorization shall not depend solely on frontend filtering. | Frontend can be bypassed. | Security review | 1 |
| SEC-092 | PRI-1 | Optional database row-level security may provide defense in depth. | Reduce impact of application defects. | Architecture test | 8 |
| SEC-093 | PRI-0 | Tenant isolation shall be tested using adversarial cross-tenant scenarios. | Validate actual isolation. | E2E security suite | 8 |

## 8.6 Lab and Robot Safety Requirements

| ID | Priority | Requirement | Rationale | Verification | Phase |
|---|---|---|---|---|---|
| SEC-100 | PRI-0 | Cloud services shall never be the sole physical safety mechanism. | Network/cloud failure must not create unsafe motion. | Architecture review | 6 |
| SEC-101 | PRI-0 | Physical emergency stop shall remain local to the robot/lab safety system. | Ensure immediate safety response. | Human safety review | 6 |
| SEC-102 | PRI-0 | Lab Agent shall enforce local execution policy before robot deployment. | Protect against cloud-side mistakes. | Integration test | 6 |
| SEC-103 | PRI-0 | Lab Agent shall reject artifacts incompatible with its assigned platform. | Prevent unsafe deployment. | Negative test | 6 |
| SEC-104 | PRI-0 | Physical robot execution shall require explicit resource allocation. | Prevent concurrent control. | Integration test | 6 |
| SEC-105 | PRI-0 | Resource allocation shall prevent conflicting active bookings. | Prevent competing control sessions. | Concurrency test | 4 |
| SEC-106 | PRI-0 | Robot state FAULT shall block normal job execution. | Prevent operation of known-fault hardware. | Integration test | 6 |
| SEC-107 | PRI-0 | Robot state MAINTENANCE shall block normal execution. | Prevent operation during maintenance. | Integration test | 6 |
| SEC-108 | PRI-0 | Lab Agent loss of control connectivity shall trigger configured safe behavior. | Contain communication failures. | Failure-injection test | 6 |
| SEC-109 | PRI-0 | Unsafe automatic robot restart shall not occur after cloud failure. | Prevent uncontrolled recovery. | Failure test | 6 |
| SEC-110 | PRI-0 | Remote users shall not directly access robot management networks. | Reduce attack surface. | Network review | 6 |
| SEC-111 | PRI-0 | Lab Agent shall expose only required robot-control operations. | Minimize privileged interface. | Interface review | 6 |
| SEC-112 | PRI-0 | Safety-critical controls shall be auditable. | Enable accountability. | Audit test | 7 |
| SEC-113 | PRI-0 | Human safety review shall remain an explicit gate for physical deployment. | Software validation is not physical safety certification. | Review checklist | 6 |
| SEC-114 | PRI-1 | Simulator execution shall be preferred for untrusted or experimental workloads where policy requires. | Reduce physical risk. | Policy test | 6 |

## 8.7 Data Protection Requirements

| ID | Priority | Requirement | Rationale | Verification | Phase |
|---|---|---|---|---|---|
| SEC-120 | PRI-0 | Sensitive data shall be encrypted in transit. | Prevent network interception. | TLS/security scan | 1 |
| SEC-121 | PRI-0 | Sensitive persistent data shall be encrypted at rest using platform-supported encryption. | Protect storage compromise. | Configuration review | 2 |
| SEC-122 | PRI-0 | Secrets shall not be stored in source repositories. | Prevent credential leakage. | CI scan | 0 |
| SEC-123 | PRI-0 | Production secrets shall be managed through a dedicated secret-management mechanism. | Centralize access control. | Infrastructure review | 2 |
| SEC-124 | PRI-0 | Cryptographic keys shall not be embedded in application binaries. | Prevent key extraction. | Binary inspection | 3 |
| SEC-125 | PRI-0 | Secrets shall not be written to normal application logs. | Prevent accidental disclosure. | Log test | 7 |
| SEC-126 | PRI-0 | Database credentials shall use least privilege. | Limit database compromise. | IAM review | 2 |
| SEC-127 | PRI-0 | Object storage access shall use scoped identities. | Limit storage compromise. | IAM review | 3 |
| SEC-128 | PRI-1 | Personal data shall be minimized. | Reduce privacy exposure. | Data review | 8 |
| SEC-129 | PRI-1 | Data retention shall be defined by data class. | Prevent indefinite unnecessary retention. | Policy review | 8 |
| SEC-130 | PRI-1 | User data export shall preserve tenant boundaries. | Support data portability safely. | Integration test | 8 |
| SEC-131 | PRI-1 | Account deletion shall trigger defined retention/anonymization behavior. | Meet privacy obligations. | Integration test | 8 |
| SEC-132 | PRI-1 | Financial and audit records shall be retained according to applicable policy. | Preserve required evidence. | Retention test | 8 |
| SEC-133 | PRI-0 | Backup data shall receive protection equivalent to production data. | Backups contain sensitive information. | Backup review | 8 |
| SEC-134 | PRI-1 | Production data shall not be copied to Development without approved sanitization. | Prevent uncontrolled data exposure. | Environment review | 2 |
| SEC-135 | PRI-0 | Object-storage signed URLs shall be short-lived and scoped. | Reduce leaked-link impact. | Integration test | 7 |

## 8.8 Logging and Audit Requirements

| ID | Priority | Requirement | Rationale | Verification | Phase |
|---|---|---|---|---|---|
| SEC-140 | PRI-0 | Authentication events shall be logged. | Detect account attacks. | Log test | 7 |
| SEC-141 | PRI-0 | Authorization failures shall be logged. | Detect access attempts. | Log test | 7 |
| SEC-142 | PRI-0 | Administrative actions shall be audited. | Preserve privileged accountability. | Audit test | 7 |
| SEC-143 | PRI-0 | Artifact upload, validation, signing, revocation, and execution shall be auditable. | Protect execution boundary. | Audit test | 7 |
| SEC-144 | PRI-0 | Booking and resource-allocation security events shall be auditable. | Protect physical resources. | Audit test | 7 |
| SEC-145 | PRI-0 | Credit-affecting operations shall be auditable. | Protect financial state. | Audit test | 7 |
| SEC-146 | PRI-0 | Robot deployment and execution authorization shall be auditable. | Safety and accountability. | Audit test | 7 |
| SEC-147 | PRI-0 | Audit records shall include actor, organization, operation, target, timestamp, and outcome where applicable. | Provide investigation context. | Schema review | 7 |
| SEC-148 | PRI-0 | Security logs shall not contain plaintext credentials or secrets. | Prevent secondary leakage. | Security scan | 7 |
| SEC-149 | PRI-1 | Logs shall support correlation using request/trace identifiers. | Enable incident reconstruction. | Integration test | 7 |
| SEC-150 | PRI-1 | Security logs shall be protected against unauthorized modification. | Preserve evidence. | Infrastructure test | 8 |
| SEC-151 | PRI-1 | Audit retention shall be multi-year according to policy. | Preserve historical security evidence. | Retention test | 8 |
| SEC-152 | PRI-1 | Security monitoring shall alert on configurable high-risk events. | Enable timely response. | Detection test | 8 |

## 8.9 Compliance and Governance Requirements

| ID | Priority | Requirement | Rationale | Verification | Phase |
|---|---|---|---|---|---|
| SEC-160 | PRI-1 | Security policies shall be documented and version controlled. | Establish governance. | Documentation review | 8 |
| SEC-161 | PRI-1 | Production changes shall be traceable to an authorized change. | Support accountability. | CI/CD review | 8 |
| SEC-162 | PRI-0 | Dependencies shall be scanned for known critical vulnerabilities. | Reduce supply-chain risk. | CI test | 0 |
| SEC-163 | PRI-1 | Critical dependency vulnerabilities shall have defined remediation SLAs. | Ensure timely response. | Process review | 8 |
| SEC-164 | PRI-0 | Production builds shall be reproducible or provenance-traceable. | Support supply-chain investigation. | Build review | 3 |
| SEC-165 | PRI-0 | CI/CD credentials shall use scoped service identities. | Reduce pipeline compromise impact. | IAM review | 0 |
| SEC-166 | PRI-0 | Production deployment shall require authenticated and authorized pipeline execution. | Prevent unauthorized releases. | CI/CD test | 8 |
| SEC-167 | PRI-1 | Security reviews shall be performed before Production release of security-sensitive features. | Reduce release risk. | Review evidence | 8 |
| SEC-168 | PRI-1 | Penetration testing shall be performed before production launch and periodically thereafter. | Validate external attack resistance. | Security assessment | 8 |
| SEC-169 | PRI-1 | Security findings shall have severity, owner, remediation status, and target date. | Enable accountable remediation. | Issue review | 8 |
| SEC-170 | PRI-1 | Security incidents shall have documented response procedures. | Reduce incident impact. | Tabletop exercise | 8 |
| SEC-171 | PRI-1 | Evidence needed for future compliance programs shall be retained. | Enable later certification. | Audit review | 8 |

## 8.10 Coding-Agent Integration Requirements

Architecture: `docs/architecture/CODING_AGENT_INTEGRATION.md`. Decision: SEC-ADR-001 in `docs/security/DECISIONS.md`. The Phase column of these rows uses canonical identifiers.

| ID | Priority | Requirement | Rationale | Verification | Phase |
|---|---|---|---|---|---|
| SEC-180 | PRI-0 | Coding-agent sessions shall run only on the developer machine, launched by the Rust Local Runtime; the Control Plane shall never launch, proxy or observe agent sessions. | Preserve the Kritva source-privacy guarantee. | Architecture review + network capture | P1 STUDIO |
| SEC-181 | PRI-0 | Studio shall not send source, prompts, agent transcripts, diffs, file names or paths to any Kritva service, log, telemetry or crash report. | Prevent source disclosure to Kritva. | Network capture + log inspection tests | P1 STUDIO |
| SEC-182 | PRI-0 | The agent process environment shall not contain Kritva session tokens, API keys, Control Plane credentials or signing material. | Prevent credential theft by agent or prompt injection. | Environment inspection test | P1 STUDIO |
| SEC-183 | PRI-0 | Studio shall obtain explicit per-project, per-provider consent that discloses third-party data flow before the first session, and again when the disclosure version changes. | Informed user choice about third-party disclosure. | UI + E2E test | P1 STUDIO |
| SEC-184 | PRI-0 | Agents shall work only in a per-session staging workspace; the user's working tree shall change only through an explicit, journaled apply with a restore point, and every apply shall be revertible. | Recover from harmful agent changes; preserve review guarantees. | Change-set, conflict, revert and fault-injection tests | P1 STUDIO |
| SEC-185 | PRI-0 | Studio shall offer only `READ_ONLY` and `PROPOSE` in the first release, shall not offer provider modes that bypass permission prompts or sandboxing, and shall refuse a session whose effective mode cannot be verified. | Least privilege. | Contract and capability-verification tests per provider | P1 STUDIO |
| SEC-186 | PRI-0 | Studio shall declare an isolation tier per OS and provider; tier A shall confine reads and writes to the staging workspace and shall be listed only after enforcement tests pass per OS and provider; tier C shall make no isolation claim and shall be disclosed and acknowledged before every session, stating that any user-readable file may be read; a policy requiring tier A shall reject tier C regardless of user consent; combinations below the required tier shall be shown unsupported; a failed tier A session-start probe shall never silently downgrade to tier C, and shall stop the session before agent work, reject it when tier A is required, or require a fresh tier C acknowledgement; in every tier, modifications outside staging shall be detected and fail the session. | Make isolation claims match enforceable controls. | CAT-03 isolation and escape tests per OS and provider (symlinks, traversal, hard links, mounts, subprocesses, reads, writes, network), session-start probe, tier-C disclosure and policy-rejection tests | P1 STUDIO |
| SEC-187 | PRI-0 | The Kritva Studio MCP server shall be local-only and shall not expose signing, upload, booking, credit, Job, Run, robot, Control Plane mutation, out-of-workspace filesystem or generic shell operations. | Prevent prompt injection from causing financial, publishing or physical effects. | MCP negative tests + prompt-injection fixture | P2 BUILD & ARTIFACT |
| SEC-188 | PRI-1 | Organization coding-agent policy changes shall require an organization administrator, shall be versioned and shall be audited; the policy API shall reject content fields. | Governed, traceable use. | API + audit tests | P3 CONTROL PLANE |
| SEC-189 | PRI-1 | Studio provider credentials shall remain in the provider CLI's own store; Studio shall not read, store or forward them. | Avoid holding third-party credentials. | Code review + test | P1 STUDIO |
| SEC-190 | PRI-0 | Every Kritva-controlled egress path (API, WebSocket, telemetry, crash reports, update checks, support bundles, log export, artifact upload) shall exclude coding-agent content, each with a negative test. | Make the source-privacy guarantee provable. | Egress negative tests | P1 STUDIO |
| SEC-191 | PRI-0 | Consent withdrawal, provider or tool disablement, mode reduction and policy expiry shall deny new tool calls immediately and stop active sessions within 10 seconds. | Governance changes take effect deterministically. | Policy and consent tests during active sessions | P1 STUDIO |
| SEC-192 | PRI-0 | MCP tools shall have published schemas with size limits; agents shall select only saved build profiles and test targets; approvals shall be bound to request, arguments, staging content hash and the version hash of the referenced build profile or test-target definition. | Bound side effects of build, test and package. | MCP schema, approval-binding and malicious-build fixtures | P2 BUILD & ARTIFACT |
| SEC-193 | PRI-0 | The MCP loopback transport, where used, shall bind to loopback only, require a per-session token and reject replayed requests. | Prevent other local processes from using Studio tools. | Transport tests | P2 BUILD & ARTIFACT |
| SEC-194 | PRI-1 | Provider configuration shall be isolated so that only the Kritva Studio MCP server is connected where the provider allows; partial isolation shall be disclosed and may be prohibited by policy. | Keep the tool allowlist meaningful. | Configuration-isolation tests per provider | P1 STUDIO |
| SEC-195 | PRI-1 | The cached organization policy shall be checksum-protected, aged by a monotonic clock and treated as absent (`READ_ONLY`) when corrupt or older than its maximum age. | Predictable offline behaviour. | Cache corruption, clock-change and expiry tests | P3 CONTROL PLANE |

# 9. Identity and Access-Control Model

The authorization model shall distinguish:

    User
      |
      v
    Organization Membership
      |
      v
    Organization Role
      |
      +---- Project Role
      |
      +---- Resource Permissions
      |
      +---- Administrative Permissions

Recommended baseline roles include:

| Role | Typical Authority |
|---|---|
| USER | Own permitted projects and executions |
| PROJECT_VIEWER | Read project information |
| PROJECT_MEMBER | Develop and execute within project policy |
| PROJECT_ADMIN | Manage project members/settings |
| ORG_ADMIN | Manage organization users/projects/policies |
| LAB_OPERATOR | Operate assigned lab resources |
| PLATFORM_ADMIN | Manage global platform catalog |
| SECURITY_ADMIN | Manage security policies and investigations |
| SYSTEM_ADMIN | Controlled infrastructure administration |

Roles shall not automatically imply physical safety override authority.

# 10. Authorization Decision Flow

    Request
      |
      v
    Authenticate
      |
      v
    Resolve User + Organization
      |
      v
    Check Resource Ownership
      |
      v
    Check Role/Permission
      |
      v
    Check Domain Policy
      |
      v
    Check Booking / Credit / Platform Policy
      |
      v
    Check Safety Policy
      |
      +---- DENY ---> Audit ---> Response
      |
      v
    Execute Operation
      |
      v
    Audit Outcome

Authorization shall be implemented server-side.

Frontend visibility controls are usability features and shall never be treated
as security controls.

# 11. Artifact Security Model

The artifact boundary is:

    Local Source
        |
        v
    Local Build
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
    Sign
        |
        v
    .krv Artifact
        |
        | HTTPS/TLS
        v
    Artifact Store
        |
        v
    Compatibility Validation
        |
        v
    Signature Verification
        |
        v
    Booking Validation
        |
        v
    Lab Policy Validation
        |
        v
    Deployment
        |
        v
    Execution

The artifact manifest shall identify at minimum:

    {
        "artifact_id": "...",
        "application_id": "...",
        "version": "...",
        "platform_id": "...",
        "platform_version": "...",
        "architecture": "...",
        "kritva_os_version": "...",
        "sdk_version": "...",
        "entrypoint": "...",
        "required_capabilities": [],
        "checksum": "...",
        "signature": "...",
        "signing_key_id": "..."
    }

The manifest itself shall be covered by the artifact integrity mechanism.

# 12. Tenant Isolation Model

Every request involving organization-owned state shall derive the effective
organization from authenticated identity and authorized membership.

The following pattern shall be used:

    authenticated_user
          |
          v
    organization_membership
          |
          v
    authorized organization context
          |
          v
    repository query
          |
          v
    organization-scoped record

Direct object access such as:

    GET /projects/{project_id}

shall not imply that possession of `project_id` grants access.

The server shall verify:

    user -> organization membership
    user -> project membership
    project -> organization
    requested object -> project/organization

# 13. Lab and Robot Security Boundary

The cloud shall not directly expose robot control networks.

Preferred architecture:

    Internet
       |
       v
    Control Plane
       |
       | authenticated outbound/controlled channel
       v
    Lab Agent
       |
       +---- local policy
       +---- resource state
       +---- safety state
       +---- runtime validation
       |
       v
    Robot Runtime
       |
       v
    Robot

The Lab Agent shall:

- authenticate itself;
- validate its assigned laboratory;
- validate target resource identity;
- validate platform compatibility;
- validate artifact authorization;
- validate booking/resource allocation;
- enforce local execution policy;
- report health and execution state;
- refuse unsafe or unauthorized operations;
- fail into configured safe behavior on communication loss.

The Lab Agent shall not become a general-purpose remote shell.

# 14. Network Security

Required baseline:

| Boundary | Requirement |
|---|---|
| Internet/API | TLS |
| Studio/API | Authenticated TLS |
| Browser/API | Secure transport |
| API/Database | Private network + authenticated connection |
| API/Object Storage | Private/scoped access |
| Control Plane/Lab | Authenticated secure protocol |
| Lab Agent/Robot | Local protected network |
| Robot safety | Independent physical/local controls |

Production database and object storage endpoints shall not be publicly exposed
unless explicitly required and protected by compensating controls.

Administrative interfaces shall not be publicly exposed without strong
authentication and authorization.

# 15. Secrets Management

Secrets include:

- Database credentials.
- Signing keys.
- API credentials.
- Service credentials.
- Lab Agent credentials.
- Cloud credentials.
- Payment-provider credentials.
- Encryption keys.
- Authentication-provider secrets.

Requirements:

1. Secrets shall not be committed to Git.
2. Secrets shall not appear in CI logs.
3. Secrets shall not be embedded in frontend bundles.
4. Production secrets shall be managed centrally.
5. Secret access shall be logged where practical.
6. Secret rotation shall be supported.
7. Compromised secrets shall be revocable.
8. Long-lived credentials shall be minimized.
9. Signing keys shall receive stronger protection than ordinary application
   secrets.
10. Production and non-production secrets shall be separate.

# 16. Cryptographic Requirements

Approved cryptographic algorithms shall be selected through the security
architecture and periodically reviewed.

The system shall:

- use modern TLS;
- use cryptographically secure random generation;
- use approved password hashing;
- use cryptographic hashes for artifact integrity;
- use asymmetric signatures for artifact authenticity where signing is enabled;
- protect private signing keys;
- support key rotation;
- maintain key identifiers and provenance;
- reject unsupported or invalid cryptographic algorithms.

Cryptography shall not be implemented using custom algorithms.

# 17. Logging Requirements

Security logs shall be structured and machine-readable.

Minimum fields:

    timestamp
    event_id
    event_type
    severity
    actor_type
    actor_id
    organization_id
    resource_type
    resource_id
    request_id
    trace_id
    outcome
    reason_code
    source_ip
    user_agent
    metadata

Sensitive payloads shall not be logged.

Logging shall distinguish:

- operational logs;
- application logs;
- audit records;
- security events;
- telemetry;
- robot runtime logs.

Audit records are authoritative evidence and shall not depend exclusively on
ephemeral application logs.

# 18. Security Events

Minimum security event categories:

- authentication.success;
- authentication.failure;
- authentication.lockout;
- session.created;
- session.revoked;
- authorization.denied;
- privilege.changed;
- membership.changed;
- artifact.uploaded;
- artifact.validation_failed;
- artifact.signature_failed;
- artifact.revoked;
- artifact.executed;
- booking.authorization_failed;
- resource.authorization_failed;
- robot.deployment.denied;
- robot.execution.denied;
- secret.access;
- administrative.operation;
- security.policy.changed;
- suspicious.activity;
- account.disabled.

# 19. Data Protection and Retention

Security architecture shall follow data minimization.

Indicative retention policy:

| Data | Retention |
|---|---|
| Core business records | Indefinite unless policy applies |
| Credit ledger | Long-term |
| Audit records | Multi-year |
| Security events | Multi-year according to policy |
| Jobs/Runs | Long-term |
| Results | Policy/configuration driven |
| Raw telemetry | Policy driven |
| Video | Policy driven |
| Temporary downloads | Short-lived |
| Idempotency records | Short TTL |
| Outbox records | Short after successful publication |
| Backups | Defined backup lifecycle |

Retention shall be implemented deliberately rather than through arbitrary
database deletion jobs.

# 20. Privacy Boundary

The system shall minimize collection of:

- Personal information.
- Device information.
- IP addresses.
- Browser metadata.
- Operational telemetry.
- Usage data.

Where collected, such data shall have:

- defined purpose;
- defined retention;
- access controls;
- auditability;
- export/deletion behavior where applicable.

Source code shall not be treated as ordinary user metadata and shall remain
outside the RaaS service unless the product explicitly introduces a future
source-management capability.

# 21. Administrative Security

Administrative operations shall be separated from normal user operations.

Sensitive operations include:

- user disabling;
- role changes;
- organization changes;
- platform activation;
- resource state changes;
- robot registration;
- Lab Agent enrollment;
- credit adjustments;
- refunds;
- artifact revocation;
- signing-key changes;
- security-policy changes;
- retention changes.

Sensitive administrative actions shall:

1. require authorization;
2. generate audit records;
3. identify the actor;
4. record target;
5. record outcome;
6. avoid exposing unnecessary confidential data.

# 22. Credit and Financial Security

Credit operations are financially sensitive.

The system shall:

- isolate wallets by organization and platform credit type;
- preserve append-only ledger evidence;
- prevent direct client-side credit mutation;
- authorize refunds and grants;
- enforce transaction consistency;
- prevent double spending;
- use idempotency for financial operations;
- audit credit-affecting actions.

The authoritative principle remains:

> Subscription determines access; robotic platform determines credit type;
> resource configuration and duration determine consumption.

# 23. Booking Security

Booking operations shall protect against:

- unauthorized bookings;
- booking ownership bypass;
- resource double allocation;
- credit bypass;
- race conditions;
- cancellation abuse;
- unauthorized resource selection.

Booking confirmation shall verify:

    authenticated user
        |
        v
    organization authorization
        |
        v
    project authorization
        |
        v
    platform eligibility
        |
        v
    resource eligibility
        |
        v
    time availability
        |
        v
    credit authorization
        |
        v
    booking confirmation

Database exclusion constraints and transaction-level locking shall remain
authoritative for conflicting resource allocations.

# 24. Job and Run Security

A Job shall not execute merely because an artifact exists.

Execution authorization shall verify:

1. authenticated actor;
2. organization membership;
3. project permission;
4. artifact ownership;
5. artifact signature/checksum;
6. platform compatibility;
7. required capabilities;
8. booking validity;
9. resource allocation;
10. resource state;
11. lab policy;
12. safety policy.

Run records shall preserve enough immutable historical context to establish
what actually executed.

# 25. Result Security

Results may contain:

- robotics behavior data;
- images;
- video;
- telemetry;
- logs;
- performance measurements;
- experiment outputs.

Result access shall therefore inherit project and organization authorization.

Result files shall use controlled object-storage access.

Download URLs shall be:

- authorized;
- short-lived;
- scoped;
- non-guessable.

# 26. Secure Download Flow

    User
      |
      v
    Authenticate
      |
      v
    Authorize Result
      |
      v
    Validate File
      |
      v
    Generate Short-Lived URL
      |
      v
    Object Storage
      |
      v
    Download

The object-storage URL shall not become a permanent authorization mechanism.

# 27. Supply-Chain Security

CI/CD shall include:

- dependency vulnerability scanning;
- secret scanning;
- static analysis where applicable;
- container/image scanning where applicable;
- license-policy checking where required;
- artifact provenance;
- protected production branches;
- authenticated deployment;
- controlled release artifacts.

Production dependencies shall be version-pinned or otherwise controlled according
to the build system.

Critical security findings shall block release unless explicitly waived by an
authorized security owner.

# 28. Secure Development Lifecycle

Every security-sensitive feature shall follow:

    Requirement
       |
       v
    Threat Review
       |
       v
    Design
       |
       v
    Implementation
       |
       v
    Security Tests
       |
       v
    Review
       |
       v
    Release
       |
       v
    Monitoring

Security requirements shall be traceable to implementation and verification.

# 29. Threat Model

Primary threats include:

| Threat | Impact | Primary Controls |
|---|---|---|
| Credential theft | Account takeover | MFA, token controls |
| IDOR | Tenant data leak | Server authorization |
| SQL injection | Data compromise | Parameterized access |
| Artifact tampering | Unsafe execution | Signing/checksum |
| Rogue Lab Agent | Robot compromise | Strong identity |
| Cloud compromise | Robot/resource impact | Local lab boundary |
| Source leakage | IP loss | Local-only source |
| Secret leakage | System compromise | Secret management |
| Credit manipulation | Financial loss | Ledger + authorization |
| Booking race | Resource conflict | DB constraints |
| Malicious artifact | Robot compromise | Validation + policy |
| Log leakage | Data exposure | Sanitization |
| Supply-chain attack | Platform compromise | CI controls |
| Admin compromise | System-wide impact | MFA + least privilege |
| Object-storage leakage | Result/IP exposure | Scoped access |

# 30. Security Failure Behavior

Security-sensitive failures shall fail closed.

Examples:

    Invalid token              -> DENY
    Missing membership        -> DENY
    Invalid signature          -> DENY
    Checksum mismatch          -> DENY
    Unsupported platform       -> DENY
    Missing booking            -> DENY
    Resource unavailable       -> DENY
    Robot fault                -> DENY
    Lab Agent unauthorized     -> DENY
    Unknown policy             -> DENY
    Safety state unavailable   -> DENY physical execution

A failure shall not silently downgrade to an insecure execution mode.

# 31. Incident Response

The production security process shall define:

1. Detection.
2. Triage.
3. Containment.
4. Eradication.
5. Recovery.
6. Evidence preservation.
7. Customer communication where required.
8. Root-cause analysis.
9. Corrective action.
10. Security regression testing.

Potential incident classes include:

- account compromise;
- tenant data exposure;
- artifact compromise;
- signing-key compromise;
- Lab Agent compromise;
- robot-control compromise;
- database compromise;
- object-storage exposure;
- credential leakage;
- supply-chain compromise.

# 32. Signing-Key Compromise

If an artifact signing key is suspected or confirmed compromised:

1. Disable/revoke the key.
2. Prevent new artifacts using the key.
3. Identify artifacts signed by the key.
4. Determine affected platforms/resources.
5. Block execution where required.
6. Issue replacement signing credentials.
7. Re-sign trusted artifacts.
8. Audit execution history.
9. Preserve evidence.
10. Complete incident review.

Key identifiers shall therefore be retained with artifact provenance.

# 33. Security Testing Strategy

Security verification shall include:

- unit tests;
- integration tests;
- negative authorization tests;
- cross-tenant tests;
- concurrency tests;
- API security tests;
- dependency scanning;
- secret scanning;
- static analysis;
- infrastructure configuration review;
- penetration testing;
- failure-injection testing;
- Lab Agent security tests;
- artifact tampering tests.

Representative adversarial tests:

    User A -> Project B
    User A -> Artifact B
    User A -> Result B
    User A -> Booking B
    User A -> Wallet B

All unauthorized operations shall be rejected.

# 34. Phase Mapping

| Phase | Security Focus | Key Requirements |
|---|---|---|
| Phase 0 | Security foundation | SEC-122, SEC-162, SEC-165 |
| Phase 1 | Identity and access | SEC-001..034 |
| Phase 2 | Projects, tenancy, secrets | SEC-040..050, SEC-080..093, SEC-121..127 |
| Phase 3 | Build/artifact security | SEC-060..076 |
| Phase 4 | Booking/credits | SEC-080..090, booking and financial controls |
| Phase 5 | Remote execution | SEC-025..026, SEC-071..072 |
| Phase 6 | Lab/robot security | SEC-100..114 |
| Phase 7 | Results/audit | SEC-140..152 and result access controls |
| Phase 8 | Production/compliance | SEC-010..018, SEC-092, SEC-128..171 |

# 35. Phase 0 Requirements

Phase 0 shall establish:

- repository secret scanning;
- dependency scanning;
- CI identity controls;
- security coding standards;
- environment separation;
- security baseline documentation;
- initial threat model.

No known plaintext production credentials shall exist in the repository.

# 36. Phase 1 Requirements

Phase 1 shall establish:

- authentication;
- sessions;
- roles;
- organization membership;
- authorization middleware;
- rate limiting;
- authentication auditing;
- privileged-account protection.

The API shall have no anonymous access to protected business data.

# 37. Phase 2 Requirements

Phase 2 shall establish:

- tenant isolation;
- project authorization;
- secret management;
- encrypted persistence;
- secure object-storage foundations;
- project membership controls.

Cross-tenant negative tests shall become mandatory CI coverage.

# 38. Phase 3 Requirements

Phase 3 shall establish:

- artifact identity;
- manifest validation;
- checksum validation;
- signature validation;
- artifact authorization;
- secure artifact storage;
- artifact provenance.

No invalid artifact shall reach execution.

# 39. Phase 4 Requirements

Phase 4 shall establish:

- booking authorization;
- resource ownership;
- credit authorization;
- credit transaction integrity;
- anti-double-spend controls;
- cancellation/refund authorization;
- auditability.

# 40. Phase 5 Requirements

Phase 5 shall establish:

- execution authorization;
- platform compatibility;
- runtime compatibility;
- capability authorization;
- job lifecycle security;
- run provenance;
- controlled deployment.

# 41. Phase 6 Requirements

Phase 6 shall establish:

- Lab Agent identity;
- secure Lab Protocol;
- local execution policy;
- robot/resource authorization;
- failure-safe behavior;
- physical deployment safety gate;
- network isolation.

The software milestone shall not be interpreted as physical safety certification.

# 42. Phase 7 Requirements

Phase 7 shall establish:

- result access control;
- secure downloads;
- security audit records;
- security event correlation;
- execution history;
- administrative auditability;
- security monitoring foundations.

# 43. Phase 8 Requirements

Phase 8 shall establish:

- MFA enforcement;
- penetration testing;
- production security review;
- backup security;
- retention controls;
- incident response;
- vulnerability management;
- compliance evidence;
- security monitoring;
- production change control.

# 44. Security Interfaces

## 44.1 Authentication Interface

Conceptual interface:

    authenticate(credentials) -> AuthSession
    refresh(refresh_token) -> AuthSession
    revoke(session_id) -> Result
    logout(session_id) -> Result

## 44.2 Authorization Interface

    authorize(
        actor,
        action,
        resource,
        context
    ) -> AuthorizationDecision

AuthorizationDecision shall be:

    ALLOW
    DENY

No ambiguous third state shall result in permission.

## 44.3 Artifact Security Interface

    validate_artifact(
        artifact_id,
        manifest,
        target_platform,
        target_resource
    ) -> ValidationResult

Validation shall include:

- identity;
- checksum;
- signature;
- platform;
- architecture;
- runtime;
- SDK;
- capabilities;
- policy;
- expiration/revocation.

## 44.4 Lab Authorization Interface

    authorize_execution(
        job,
        booking,
        artifact,
        resource,
        safety_context
    ) -> ExecutionDecision

The Lab Agent shall independently enforce local policy.

# 45. Security Data Ownership

| Dataset | Owner |
|---|---|
| User identity | Identity |
| Membership | Organization |
| Project access | Project |
| Artifact metadata | Artifact |
| Artifact binary | Artifact/Object Storage |
| Booking authorization | Booking |
| Credit authorization | Credit |
| Job authorization | Execution |
| Run provenance | Execution |
| Result access | Result |
| Robot operational state | Lab |
| Security audit | Audit |
| Security policy | System/Security |

Cross-domain services shall not directly mutate another domain's authoritative
tables.

# 46. Security and Database Controls

The database shall enforce security-relevant invariants where practical:

- foreign keys;
- uniqueness;
- check constraints;
- non-null tenant ownership;
- resource allocation exclusion constraints;
- immutable ledger semantics;
- state transition validation;
- restricted database roles.

Application authorization remains mandatory even where database constraints
exist.

# 47. Security and Object Storage

Object storage shall:

- use private buckets/containers by default;
- prevent public listing;
- prevent public writes;
- use scoped service identities;
- use immutable or versioned artifact storage where appropriate;
- verify checksums;
- support lifecycle policies;
- support deletion/retention policies;
- produce access evidence where practical.

Object keys shall not expose secrets or unnecessary personal information.

# 48. Security and WebSocket/Streaming Channels

WebSocket connections for:

- live job status;
- telemetry;
- logs;
- video signaling;

shall authenticate the initiating user/session and enforce resource authorization.

A valid WebSocket connection shall not grant access to arbitrary resources.

Subscriptions shall be resource-scoped.

Disconnecting authorization or session state shall terminate protected streams
according to policy.

# 49. Security and Video

Video may contain:

- people;
- laboratory environments;
- proprietary equipment;
- robot operation;
- experiment data.

Therefore:

1. Video access shall require authorization.
2. Video URLs shall be short-lived.
3. Video retention shall be configurable.
4. Video shall not be publicly accessible by default.
5. Access shall be auditable where required.
6. Video metadata shall preserve organization/project/run context.

# 50. Security and Telemetry

Telemetry may reveal:

- robot configuration;
- hardware behavior;
- experiment characteristics;
- operational timing;
- performance;
- potentially sensitive environment information.

Telemetry shall therefore inherit project/run authorization.

High-frequency telemetry may use a specialized transport, but durable summaries
shall retain authoritative ownership and authorization context.

# 51. Security and Logs

Robot/runtime logs shall be treated as potentially sensitive.

Logs shall:

- be scoped to Run/Job/Project;
- not expose credentials;
- not expose authentication tokens;
- not expose source code unnecessarily;
- be subject to retention policy;
- require authorization for download.

# 52. Security and Experiments

Experiments may aggregate multiple Runs and therefore require explicit access
control.

Experiment membership shall not allow a user to include Runs from another
organization unless an explicitly supported sharing model exists.

Comparisons shall inherit the authorization boundary of the participating data.

# 53. Security and Sharing

Cross-organization sharing shall not exist by default.

If introduced later, sharing shall require:

- explicit owner action;
- scoped recipient;
- scoped resource;
- expiration where appropriate;
- revocation;
- auditability;
- no implicit write permission.

# 54. Security Review Gates

Security gates shall occur at:

    Architecture
        |
        v
    Implementation
        |
        v
    Integration
        |
        v
    Pre-release
        |
        v
    Production
        |
        v
    Periodic reassessment

P0 security requirements shall not be knowingly skipped for Production without
documented security-owner approval and compensating controls.

# 55. Risks and Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Credential theft | Critical | MFA, short-lived sessions, monitoring |
| Tenant isolation defect | Critical | Defense in depth + adversarial tests |
| Signing key compromise | Critical | Protected keys + revocation |
| Malicious artifact | Critical | Signature + compatibility + local policy |
| Lab Agent compromise | Critical | Strong identity + least privilege |
| Cloud compromise | Critical | Local safety boundary |
| Source leakage | High | Local build + no source persistence |
| Object-storage exposure | High | Private storage + scoped URLs |
| Credit manipulation | High | Ledger + idempotency |
| Booking race | High | DB constraints + transactions |
| Admin compromise | Critical | MFA + privileged audit |
| Dependency compromise | High | Scanning + provenance |
| Log leakage | High | Sanitization |
| Excessive retention | Medium | Retention policy |
| Weak incident response | High | Runbooks + exercises |

# 56. Open Questions

The following require explicit decisions before final Production security sign-off:

1. Which external identity provider(s) will be supported?
2. Which MFA methods will be mandatory for administrators?
3. Will enterprise SSO/SAML/OIDC be supported in the initial commercial release?
4. What exact artifact signing infrastructure will be used?
5. Will signing keys use HSM/KMS-backed protection?
6. What vulnerability severity thresholds will block releases?
7. What exact audit retention period is required?
8. What privacy regulations apply to target markets?
9. What is the formal incident notification process?
10. What security monitoring/SIEM integration will be used?
11. Will database RLS be enabled in Production?
12. What exact Lab Agent credential lifecycle will be adopted?
13. How will compromised Lab Agents be revoked?
14. What robot-specific safety policies are mandatory per platform?
15. What video retention period is appropriate?
16. What data-sharing capabilities, if any, will be supported?
17. What formal penetration-testing cadence will be adopted?
18. What compliance targets are planned after MVP?
19. Will customer-managed encryption keys be supported?
20. What formal security SLA applies to critical vulnerabilities?

# 57. Security Acceptance Criteria

## 57.1 Authentication

- [ ] Protected endpoints require authentication.
- [ ] Authentication credentials are protected.
- [ ] Password storage uses approved adaptive hashing.
- [ ] Sessions/tokens are cryptographically secure.
- [ ] Token lifetime is bounded.
- [ ] Revocation works.
- [ ] Authentication abuse is rate limited.
- [ ] Authentication failures are audited.
- [ ] Administrator MFA is implemented before Production.
- [ ] Shared administrator credentials are prohibited.

## 57.2 Authorization

- [ ] Every protected operation performs authorization.
- [ ] Roles and permissions are explicit.
- [ ] Deny-by-default behavior is implemented.
- [ ] Project membership is enforced.
- [ ] Organization membership is enforced.
- [ ] Resource authorization is enforced.
- [ ] Physical execution requires explicit authorization.
- [ ] Privilege escalation tests pass.
- [ ] Authorization failures are audited.

## 57.3 Source Privacy

- [ ] Source code remains local by default.
- [ ] Remote execution accepts `.krv` artifacts.
- [ ] Source is not persisted in PostgreSQL.
- [ ] Source is not automatically copied to object storage.
- [ ] Logs do not expose source.
- [ ] Errors do not echo source.
- [ ] Production debugging does not expose source.
- [ ] Documentation clearly states the source boundary.

## 57.4 Artifact Integrity

- [ ] Artifact identity is immutable.
- [ ] Manifest is validated.
- [ ] Checksum is validated.
- [ ] Signature is validated.
- [ ] Invalid signatures block execution.
- [ ] Revoked signing identities block execution.
- [ ] Platform compatibility is checked.
- [ ] Architecture compatibility is checked.
- [ ] Runtime/SDK compatibility is checked.
- [ ] Capability requirements are checked.
- [ ] Artifact authorization is checked.
- [ ] Artifact provenance is retained.

## 57.5 Tenant Isolation

- [ ] Organization is the primary tenant boundary.
- [ ] Organization ownership is persisted where required.
- [ ] Repository queries are tenant scoped.
- [ ] Cross-tenant object access fails.
- [ ] Project membership is tenant consistent.
- [ ] Artifact access is tenant isolated.
- [ ] Booking access is tenant isolated.
- [ ] Credit state is tenant isolated.
- [ ] Results are tenant isolated.
- [ ] Object storage is tenant scoped.
- [ ] Cross-tenant adversarial tests pass.

## 57.6 Lab and Robot Safety

- [ ] Cloud is not the sole safety mechanism.
- [ ] Local emergency stop remains authoritative.
- [ ] Lab Agent has strong identity.
- [ ] Lab Agent has least privilege.
- [ ] Resource allocation is mandatory.
- [ ] Conflicting allocations are rejected.
- [ ] Robot FAULT state blocks execution.
- [ ] Maintenance state blocks execution.
- [ ] Communication failure produces configured safe behavior.
- [ ] Unsafe automatic restart is prohibited.
- [ ] Robot management networks are not directly internet exposed.
- [ ] Physical safety review remains an explicit gate.

## 57.7 Data Protection

- [ ] TLS is enforced.
- [ ] Sensitive storage is encrypted.
- [ ] Secrets are centrally managed.
- [ ] Secrets are absent from source repositories.
- [ ] Secrets are absent from application logs.
- [ ] Production and non-production credentials are separated.
- [ ] Backup data is protected.
- [ ] Retention policies are implemented.
- [ ] Object-storage URLs are short-lived.
- [ ] Privacy/data lifecycle requirements are documented.

## 57.8 Logging and Audit

- [ ] Authentication events are logged.
- [ ] Authorization failures are logged.
- [ ] Administrative actions are audited.
- [ ] Artifact security events are audited.
- [ ] Booking/security events are audited.
- [ ] Credit-affecting operations are audited.
- [ ] Robot deployment/execution authorization is audited.
- [ ] Audit records identify actor and target.
- [ ] Logs contain correlation identifiers.
- [ ] Sensitive values are redacted.
- [ ] Audit storage is protected from unauthorized modification.

## 57.9 Compliance and Operations

- [ ] Security requirements are version controlled.
- [ ] Dependencies are scanned.
- [ ] Secrets are scanned in CI.
- [ ] Production deployment is authenticated.
- [ ] Security-sensitive changes receive review.
- [ ] Vulnerability severity is tracked.
- [ ] Security findings have owners.
- [ ] Incident response procedures exist.
- [ ] Penetration testing is completed before Production.
- [ ] Security evidence is retained.
- [ ] Backup and recovery security is tested.

# 58. Final Security Invariants

The following invariants are mandatory:

1. No unauthenticated access to protected business operations.
2. No authorization based solely on frontend state.
3. No cross-tenant access through object identifiers.
4. No source-code requirement for remote execution.
5. No execution of an invalid artifact.
6. No execution without platform compatibility validation.
7. No physical execution without valid authorization and resource allocation.
8. No direct public exposure of robot management networks.
9. No cloud-only physical safety mechanism.
10. No plaintext secrets in source or logs.
11. No uncontrolled credit mutation.
12. No uncontrolled resource allocation.
13. No privileged operation without auditability.
14. No fail-open behavior for ambiguous security decisions.
15. No Production release without required P0 security controls.
16. No physical deployment treated as safe solely because software tests pass.

The final security boundary is:

    User Identity
         |
         v
    Authorization
         |
         v
    Tenant Isolation
         |
         v
    Artifact Integrity
         |
         v
    Booking + Credit Validation
         |
         v
    Lab Policy
         |
         v
    Local Safety Controls
         |
         v
    Robot Execution

Kritva RaaS security is complete only when all layers independently enforce
their responsibilities and no single cloud component is required to provide
the entire security or physical-safety boundary.
