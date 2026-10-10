# Kritva RaaS Threat Model

## 1. Purpose

This document defines the production-grade threat model for Kritva RaaS.

Kritva RaaS allows users to:

- develop robotics applications locally;
- build source code locally;
- package applications as `.krv` execution artifacts;
- select robotic platforms;
- reserve robotic resources;
- upload execution artifacts;
- execute applications on virtual or physical robots;
- observe video, telemetry, and logs;
- retrieve results;
- compare experiments;
- repeat experiments.

The threat model establishes:

- protected assets;
- actors and capabilities;
- trust boundaries;
- security assumptions;
- data flows;
- attack surfaces;
- STRIDE analysis;
- attack scenarios;
- mitigations;
- residual risks;
- security verification;
- review cadence.

The central security principle is:

> Source remains local. Only an authorized, validated execution artifact crosses the
> RaaS boundary. Physical robot safety remains authoritative at the local robot
> and laboratory boundary.

## 2. Scope

This threat model covers:

- RaaS Studio.
- Studio Local Runtime.
- RaaS Web Console.
- RaaS Control Plane.
- Authentication and authorization.
- PostgreSQL.
- Object storage.
- Queues and workers.
- Cloud infrastructure.
- Lab Agent.
- Kritva Runtime.
- Simulated robots.
- Physical robots.
- Robot control interfaces.
- Artifact generation and validation.
- Booking.
- Credits.
- Jobs and Runs.
- Results.
- Experiments.
- Video.
- Telemetry.
- Logs.
- Audit records.
- CI/CD and software supply chain.
- Administrative interfaces.
- Security monitoring.
- Backup and recovery boundaries.

## 3. Out of Scope

The following are outside the primary scope:

- Detailed mechanical robot design.
- Formal robot functional-safety certification.
- Detailed emergency-stop circuit design.
- Vendor-specific cloud implementation.
- Individual robot hardware silicon security.
- Physical building security except where it affects the RaaS threat model.
- User's personal workstation security beyond the RaaS attack surface.
- General Internet threats unrelated to Kritva RaaS.

However, external threats that cross into the RaaS boundary remain in scope.

## 4. Security Goals

The threat model shall protect:

1. User identity.
2. Organization isolation.
3. Project confidentiality.
4. Source-code privacy.
5. Artifact integrity.
6. Artifact authenticity.
7. Robot authorization.
8. Booking integrity.
9. Credit integrity.
10. Job and Run integrity.
11. Result confidentiality.
12. Lab infrastructure.
13. Robot operational safety.
14. Administrative control.
15. Audit evidence.
16. Availability of critical services.
17. Software supply chain integrity.

## 5. Non-Goals

This document does not attempt to:

- guarantee that an end-user workstation is uncompromised;
- guarantee that arbitrary user code is safe;
- replace robot-specific safety certification;
- replace emergency-stop mechanisms;
- make the cloud responsible for physical safety;
- eliminate all possible zero-day vulnerabilities;
- provide unrestricted remote robot control;
- treat successful software testing as proof of physical safety.

# 6. Security Principles

## 6.1 Zero Trust

No component is trusted solely because it belongs to the Kritva environment.

Every protected boundary shall authenticate and authorize the applicable actor.

## 6.2 Least Privilege

Every user, service, Lab Agent, worker, and administrator receives only the
permissions required for its function.

## 6.3 Defense in Depth

Security shall be enforced at multiple layers:

    Identity
      |
      v
    Authentication
      |
      v
    Authorization
      |
      v
    Tenant Isolation
      |
      v
    Domain Policy
      |
      v
    Artifact Integrity
      |
      v
    Resource/Booking Validation
      |
      v
    Lab Policy
      |
      v
    Local Safety Controls

## 6.4 Fail Closed

Security-sensitive uncertainty shall result in denial rather than an insecure
fallback.

## 6.5 Local Physical Safety

Physical robot safety shall not depend exclusively on:

- Internet connectivity;
- cloud availability;
- PostgreSQL availability;
- authentication service availability;
- video streaming;
- telemetry;
- job scheduling;
- the Control Plane.

## 6.6 Source Privacy

The default development model is:

    Local Source
        |
        v
    Local Build
        |
        v
    Local Test
        |
        v
    .krv Artifact
        |
        v
    Remote Execution

The source code is not a normal RaaS cloud asset.

# 7. Definitions

| Term | Definition |
|---|---|
| Asset | Information, capability, service, or physical resource requiring protection |
| Actor | Entity capable of initiating an action |
| Trust Boundary | Boundary across which trust assumptions change |
| Threat | Potential cause of harm |
| Attack | Deliberate exploitation of a weakness |
| Vulnerability | Weakness that can be exploited |
| Control | Security mechanism reducing a threat |
| Residual Risk | Risk remaining after controls |
| User | Authenticated human account |
| Organization | Primary logical tenant |
| Project | Organization-owned development unit |
| Studio | Desktop RaaS application |
| Local Runtime | Trusted local component used by Studio |
| Control Plane | Cloud backend and business service layer |
| Lab Agent | Local service bridging cloud control to laboratory resources |
| Platform | Robotic platform definition |
| Resource | Allocatable execution resource |
| Robot | Physical robot identity |
| Artifact | Packaged `.krv` execution unit |
| Manifest | Artifact metadata defining compatibility and requirements |
| Job | Requested remote execution |
| Run | Actual execution instance |
| Result | Output generated by a Run |
| Experiment | Group of related Runs |
| Safety Boundary | Local controls governing safe robot operation |

# 8. Security Classification of Assets

| Asset | Classification | Primary Security Property |
|---|---|---|
| User credentials | Restricted | Confidentiality |
| Session tokens | Restricted | Confidentiality |
| Organization data | Confidential | Confidentiality |
| Project metadata | Confidential | Confidentiality |
| Source code | Restricted | Confidentiality |
| Artifact binary | Confidential/Restricted | Integrity + confidentiality |
| Signing keys | Restricted | Confidentiality + integrity |
| Credit ledger | Restricted | Integrity |
| Booking state | Confidential | Integrity |
| Robot authorization | Safety-Critical | Integrity |
| Job state | Confidential | Integrity |
| Run state | Confidential | Integrity |
| Video | Confidential | Confidentiality |
| Telemetry | Confidential | Confidentiality |
| Logs | Confidential | Confidentiality |
| Results | Confidential | Confidentiality |
| Audit records | Restricted | Integrity |
| Lab Agent credentials | Restricted | Confidentiality |
| Robot control channel | Safety-Critical | Integrity + availability |
| Robot emergency stop | Safety-Critical | Availability + integrity |
| Database backups | Restricted | Confidentiality |
| Infrastructure credentials | Restricted | Confidentiality |

# 9. Asset Inventory

## 9.1 Identity Assets

- User identities.
- Organization memberships.
- Roles.
- Session tokens.
- Refresh tokens.
- Service identities.
- Lab Agent identities.
- Signing identities.

## 9.2 Intellectual Property Assets

- Local source code.
- Build configuration.
- Compiled artifacts.
- Application behavior.
- Experiment methodology.
- Results.
- Models.
- Robot-specific configurations.

## 9.3 Financial Assets

- Credit wallets.
- Credit ledger.
- Reservations.
- Invoices.
- Financial transactions.
- Refund records.
- Subscription information.

## 9.4 Operational Assets

- Platform definitions.
- Platform versions.
- Resource states.
- Robot identity.
- Lab state.
- Booking state.
- Job state.
- Run state.
- Runtime configuration.

## 9.5 Safety Assets

- Robot authorization.
- Resource allocation.
- Local safety state.
- Emergency-stop state.
- Lab Agent policy.
- Runtime execution policy.
- Motion/control constraints.

# 10. Actors

## 10.1 Legitimate Actors

| Actor | Capability |
|---|---|
| Student User | Develop and execute permitted applications |
| Developer | Develop and execute permitted applications |
| Researcher | Develop and execute permitted experiments |
| Project Admin | Manage project configuration |
| Organization Admin | Manage organization |
| Lab Operator | Operate assigned lab resources |
| Platform Admin | Manage platform catalog |
| Security Admin | Manage security controls |
| System Admin | Controlled infrastructure administration |
| Lab Agent | Execute authorized local operations |
| Control Plane | Authoritative business orchestration |
| Worker | Perform scoped asynchronous work |

## 10.2 Adversarial Actors

| Actor | Capability |
|---|---|
| Anonymous Internet Attacker | Probe public interfaces |
| Compromised User | Abuse valid account |
| Malicious User | Intentionally violate policy |
| Cross-Tenant Attacker | Attempt access to another organization |
| Compromised Administrator | Abuse privileged credentials |
| Rogue Lab Agent | Attempt unauthorized laboratory access |
| Malicious Artifact Author | Submit harmful execution payload |
| Compromised Dependency | Introduce supply-chain compromise |
| Insider | Abuse legitimate access |
| Compromised Robot | Return malicious/unexpected data |
| Network Attacker | Intercept or manipulate traffic |
| Cloud Credential Attacker | Abuse infrastructure identity |

# 11. Attacker Capability Model

The threat model assumes an attacker may:

- send arbitrary HTTP requests;
- modify client-side application behavior;
- replay valid requests;
- change object identifiers;
- attempt credential stuffing;
- steal a valid session;
- submit malformed artifacts;
- submit malicious artifacts;
- modify network traffic where TLS is absent or compromised;
- attempt tenant boundary bypass;
- race booking requests;
- attempt credit double spending;
- attempt object-storage enumeration;
- exploit application dependencies;
- compromise a service credential;
- compromise a Lab Agent;
- attempt unauthorized robot execution.

The attacker is not assumed to have:

- direct physical access to robot safety controls;
- cryptographic signing keys unless a key compromise scenario is explicitly
  modeled;
- database administrator access unless the database itself is compromised.

# 12. Trust Model

The system shall explicitly distinguish:

    UNTRUSTED
        |
        | Internet
        v
    PARTIALLY TRUSTED
        |
        | Authenticated API
        v
    CONTROLLED
        |
        | Secure Lab Protocol
        v
    LOCAL TRUST DOMAIN
        |
        v
    SAFETY AUTHORITY

The safety authority remains local to the laboratory/robot.

# 13. Trust Boundaries

## TB-01: User Device to Studio

Threats include:

- malicious local applications;
- stolen credentials;
- local token theft;
- compromised operating system;
- manipulated Studio binaries.

Controls:

- secure credential handling;
- OS account protection;
- signed application releases;
- short-lived tokens;
- server-side authorization.

Residual risk:

A fully compromised user workstation can potentially access local source code and
credentials available to that user.

## TB-02: Studio to Control Plane

Threats include:

- credential theft;
- man-in-the-middle attack;
- request manipulation;
- replay;
- session theft.

Controls:

- TLS;
- authenticated sessions;
- request validation;
- authorization;
- rate limiting;
- request identifiers.

## TB-03: Control Plane to Database

Threats include:

- SQL injection;
- excessive database privileges;
- compromised service credentials;
- unauthorized direct access.

Controls:

- parameterized queries;
- repository layer;
- least-privilege DB roles;
- private networking;
- encryption;
- audit.

## TB-04: Control Plane to Object Storage

Threats include:

- unauthorized file access;
- public exposure;
- object enumeration;
- malicious object replacement.

Controls:

- private storage;
- scoped service identities;
- checksums;
- immutable artifact identity;
- short-lived download URLs.

## TB-05: Control Plane to Lab

Threats include:

- rogue Lab Agent;
- compromised credentials;
- command manipulation;
- unauthorized robot access.

Controls:

- strong Lab Agent identity;
- authenticated secure protocol;
- scoped authorization;
- platform/resource binding;
- local policy.

## TB-06: Lab Agent to Robot

Threats include:

- malicious commands;
- malformed commands;
- runtime compromise;
- unsafe state transitions.

Controls:

- local validation;
- platform-specific policy;
- safety controller;
- emergency stop;
- bounded command interface.

## TB-07: User Artifact to Runtime

Threats include:

- malicious code;
- privilege escalation;
- resource exhaustion;
- unauthorized hardware access.

Controls:

- artifact validation;
- compatibility checks;
- capability policy;
- runtime isolation where practical;
- Lab Agent policy;
- resource limits.

# 14. System Context Diagram

    +-----------------------+
    |       User            |
    +-----------+-----------+
                |
                v
    +-----------------------+
    |    RaaS Studio        |
    | Web Console           |
    +-----------+-----------+
                |
              HTTPS
                |
                v
    +-----------------------+
    |     Control Plane     |
    | API / Auth / Services |
    +---+--------+-------+--+
        |        |       |
        v        v       v
    +------+ +------+ +--------+
    | DB   | |Store | | Queue  |
    +------+ +------+ +--------+
                          |
                          v
                    +-----------+
                    |  Worker   |
                    +-----+-----+
                          |
                    Secure Lab
                       Channel
                          |
                          v
                    +-----------+
                    |Lab Agent  |
                    +-----+-----+
                          |
                          v
                    +-----------+
                    | Kritva    |
                    | Runtime   |
                    +-----+-----+
                          |
                          v
                    +-----------+
                    | Robot /   |
                    | Simulator |
                    +-----------+

# 15. Data Flow Diagram: Local Development

    User Source
        |
        v
    Studio
        |
        v
    Local Runtime
        |
        +---- Compiler
        |
        +---- Tests
        |
        v
    Artifact Package
        |
        v
    Manifest Generation
        |
        v
    Artifact Signing
        |
        v
    .krv Artifact

Security properties:

- source remains local;
- compiler executes locally;
- source is not uploaded;
- only packaged artifact leaves the device.

# 16. Data Flow Diagram: Artifact Upload

    .krv Artifact
        |
        v
    TLS
        |
        v
    API
        |
        v
    Authentication
        |
        v
    Authorization
        |
        v
    Manifest Validation
        |
        v
    Checksum Validation
        |
        v
    Signature Validation
        |
        v
    Object Storage
        |
        v
    Artifact Metadata DB

Threats:

- upload interception;
- artifact substitution;
- manifest manipulation;
- unauthorized storage;
- cross-tenant access.

# 17. Data Flow Diagram: Booking

    User
      |
      v
    API
      |
      v
    Authentication
      |
      v
    Organization Authorization
      |
      v
    Project Authorization
      |
      v
    Platform Validation
      |
      v
    Resource Availability
      |
      v
    Credit Reservation
      |
      v
    Booking Transaction
      |
      v
    Resource Allocation

Security invariant:

> A booking shall not grant execution authority unless all required authorization,
> resource, platform, and credit checks succeed.

# 18. Data Flow Diagram: Execution

    User
      |
      v
    Job Request
      |
      v
    Authorization
      |
      v
    Artifact Validation
      |
      v
    Booking Validation
      |
      v
    Resource Validation
      |
      v
    Control Plane
      |
      v
    Lab Agent
      |
      v
    Local Policy
      |
      v
    Runtime
      |
      v
    Robot

The Lab Agent shall independently validate security-sensitive execution state.

# 19. Data Flow Diagram: Results

    Robot / Runtime
          |
          v
       Run Data
          |
          +---- Logs
          +---- Telemetry
          +---- Video
          +---- Metrics
          |
          v
        Result
          |
          v
      Object Storage
          |
          v
      Authorized User
          |
          v
       Download

Result data shall inherit project and organization authorization.

# 20. STRIDE Method

The threat model uses STRIDE:

| Category | Meaning |
|---|---|
| S | Spoofing identity |
| T | Tampering with data |
| R | Repudiation |
| I | Information disclosure |
| D | Denial of service |
| E | Elevation of privilege |

STRIDE analysis is applied independently to each major component and trust
boundary.

# 21. STRIDE: RaaS Studio

| Threat | Example | Impact | Mitigation |
|---|---|---|---|
| S | Stolen session token | Account takeover | Token controls, MFA |
| T | Modified client request | Unauthorized operation | Server validation |
| R | User denies action | Accountability gap | Server audit |
| I | Local source leakage | IP loss | Local protection |
| D | Malicious project/build input | Local resource exhaustion | Limits |
| E | Modified Studio binary | Credential theft | Signed releases |

Important principle:

> The Studio is not a security authority.

The server shall never trust client-side authorization decisions.

# 22. STRIDE: Studio Local Runtime

| Threat | Example | Impact | Mitigation |
|---|---|---|---|
| S | Fake local runtime | Credential interception | Authenticated IPC |
| T | Build artifact manipulation | Malicious deployment | Checksums/signatures |
| R | Local build denial | Weak traceability | Build metadata |
| I | Source exposure | IP loss | OS permissions |
| D | Malicious build | Resource exhaustion | Process limits |
| E | Local runtime exploit | Source/token access | OS isolation |

# 23. STRIDE: Control Plane

| Threat | Example | Impact | Mitigation |
|---|---|---|---|
| S | Forged service identity | System compromise | Service authentication |
| T | Modified booking | Financial/resource loss | Transactions |
| R | Admin denies change | Audit gap | Audit records |
| I | Tenant data leak | Confidentiality loss | Tenant isolation |
| D | API flooding | Service outage | Rate limiting |
| E | Authorization bypass | System compromise | Central policy |

# 24. STRIDE: Database

| Threat | Example | Impact | Mitigation |
|---|---|---|---|
| S | Forged DB identity | Data compromise | Strong DB auth |
| T | Direct record modification | State corruption | Least privilege |
| R | Untracked mutation | Audit gap | Restricted roles |
| I | Cross-tenant query | Data leak | Repository + DB controls |
| D | Connection exhaustion | Outage | Connection budgets |
| E | DB credential escalation | Full compromise | Scoped credentials |

# 25. STRIDE: Object Storage

| Threat | Example | Impact | Mitigation |
|---|---|---|---|
| S | Forged storage identity | Data access | Scoped identity |
| T | Artifact replacement | Unsafe execution | Checksums/signatures |
| R | Download denial | Investigation issue | Access records |
| I | Public object | IP/result exposure | Private storage |
| D | Storage abuse | Availability loss | Quotas |
| E | Bucket policy escalation | Broad compromise | IaC + review |

# 26. STRIDE: Cloud Infrastructure

| Threat | Example | Impact | Mitigation |
|---|---|---|---|
| S | Stolen cloud credentials | Infrastructure compromise | Short-lived identity |
| T | Deployment tampering | Malicious release | Protected pipeline |
| R | Unauthorized deployment | Accountability gap | Deployment audit |
| I | Secret exposure | System compromise | Secret manager |
| D | Infrastructure attack | Service outage | HA/rate limiting |
| E | CI privilege escalation | Production compromise | Least privilege |

# 27. STRIDE: Lab Agent

| Threat | Example | Impact | Mitigation |
|---|---|---|---|
| S | Rogue agent impersonation | Robot compromise | Machine identity |
| T | Modified command | Unsafe operation | Signed/authenticated protocol |
| R | Operator denies action | Safety investigation issue | Audit |
| I | Robot data leakage | IP/privacy loss | Scoped channels |
| D | Agent flooding | Lab outage | Rate limits |
| E | Agent compromise | Robot control | Least privilege/local policy |

The Lab Agent is a high-value security component.

# 28. STRIDE: Kritva Runtime

| Threat | Example | Impact | Mitigation |
|---|---|---|---|
| S | Fake runtime | Artifact theft | Local identity |
| T | Modified executable | Unsafe execution | Artifact validation |
| R | Execution dispute | Audit gap | Run provenance |
| I | Telemetry leak | IP exposure | Authorization |
| D | Malicious workload | Resource exhaustion | Runtime limits |
| E | Application escapes sandbox | Robot compromise | Isolation + policy |

# 29. STRIDE: Robot

| Threat | Example | Impact | Mitigation |
|---|---|---|---|
| S | Fake robot identity | Wrong deployment | Resource identity |
| T | Malicious command | Physical harm | Local safety controls |
| R | Untracked motion | Investigation gap | Runtime/audit records |
| I | Camera leakage | Privacy/IP loss | Access controls |
| D | Resource exhaustion | Robot unavailable | Limits |
| E | Runtime escape | Safety compromise | Hardware safety boundary |

# 30. STRIDE: Web Console

The Web Console shall be treated as an untrusted client.

Threats include:

- XSS;
- CSRF where applicable;
- session theft;
- malicious API requests;
- insecure local storage;
- manipulated identifiers;
- unauthorized downloads.

Mitigations include:

- secure session architecture;
- CSP where applicable;
- output encoding;
- CSRF protections where applicable;
- server-side authorization;
- secure cookie configuration where cookies are used;
- no secrets in frontend source.

# 31. STRIDE: Queue and Workers

Threats include:

- forged messages;
- replayed messages;
- malicious payloads;
- unauthorized worker access;
- queue flooding;
- privilege escalation.

Controls:

- authenticated producers/consumers;
- scoped queue permissions;
- schema validation;
- idempotency;
- retry limits;
- dead-letter handling;
- worker least privilege.

# 32. Attack Scenario AS-001: Cross-Tenant Project Access

### Attack

Attacker obtains a valid project identifier belonging to another organization.

    GET /projects/{victim-project-id}

### Objective

Read or modify victim project data.

### Mitigations

- organization membership check;
- project membership check;
- repository tenant filtering;
- database constraints;
- adversarial tests.

### Expected Result

Request returns authorization failure without revealing whether the target exists.

### Residual Risk

A previously undiscovered authorization path could bypass centralized controls.

### Verification

Automated cross-tenant E2E suite.

# 33. Attack Scenario AS-002: Artifact Substitution

### Attack

Attacker uploads a legitimate artifact and attempts to replace the binary while
preserving metadata.

### Objective

Execute attacker-controlled code on a robot.

### Mitigations

- immutable artifact identity;
- checksum;
- digital signature;
- immutable storage;
- validation immediately before execution.

### Expected Result

Modified binary fails integrity/signature validation.

# 34. Attack Scenario AS-003: Malicious Artifact

### Attack

Authorized user uploads an artifact containing intentionally harmful behavior.

### Objective

Control robot outside permitted behavior.

### Mitigations

- capability declaration;
- platform compatibility;
- local Lab Agent policy;
- runtime isolation where practical;
- simulator-first policy;
- physical safety systems.

### Residual Risk

Arbitrary authorized application code can remain behaviorally unsafe.

### Security Boundary

RaaS authorization does not equal robot functional-safety certification.

# 35. Attack Scenario AS-004: Stolen User Token

### Attack

Attacker obtains a valid session token.

### Objective

Act as the victim.

### Mitigations

- bounded token lifetime;
- refresh-token controls;
- revocation;
- MFA;
- suspicious activity monitoring;
- authorization on every operation.

### Residual Risk

Attacker may act until token expiration or revocation.

# 36. Attack Scenario AS-005: Credit Double Spend

### Attack

Attacker submits concurrent booking/credit requests.

### Objective

Consume a resource without sufficient credits.

### Mitigations

- transactional reservation;
- row locking;
- idempotency;
- append-only ledger;
- atomic wallet update.

### Expected Result

Only one valid transaction succeeds.

# 37. Attack Scenario AS-006: Booking Race

### Attack

Two users attempt to reserve the same resource/time interval.

### Objective

Gain exclusive access without valid allocation.

### Mitigations

- database exclusion constraints;
- transactional allocation;
- deterministic conflict handling.

### Expected Result

At most one conflicting allocation is confirmed.

# 38. Attack Scenario AS-007: Rogue Lab Agent

### Attack

Attacker attempts to impersonate a legitimate Lab Agent.

### Objective

Issue commands to laboratory resources.

### Mitigations

- machine identity;
- credential rotation;
- Lab Agent enrollment;
- organization/lab/resource binding;
- secure protocol;
- local policy.

### Expected Result

Unknown agent cannot establish an authorized control session.

# 39. Attack Scenario AS-008: Compromised Lab Agent

### Attack

A legitimate Lab Agent is compromised.

### Objective

Control robots or exfiltrate laboratory data.

### Mitigations

- least privilege;
- resource scoping;
- command allowlisting;
- local safety systems;
- credential revocation;
- monitoring;
- network segmentation.

### Residual Risk

A fully compromised local machine may have access to resources physically connected
to that machine.

This is why the Lab Agent shall not be the sole safety boundary.

# 40. Attack Scenario AS-009: Cloud Compromise

### Attack

An attacker compromises a cloud service credential or backend component.

### Objective

Access customer data or influence robot execution.

### Mitigations

- scoped service identities;
- network segmentation;
- secret management;
- tenant authorization;
- artifact verification;
- Lab Agent local authorization;
- physical safety controls.

### Residual Risk

A sufficiently privileged cloud compromise may disrupt service or authorize
malicious business operations.

Physical safety must remain independent.

# 41. Attack Scenario AS-010: Source-Code Exfiltration

### Attack

Attacker compromises the RaaS backend and searches for customer source.

### Objective

Steal intellectual property.

### Mitigations

- source is not uploaded;
- local build;
- no source persistence;
- sanitized logs;
- restricted diagnostics.

### Residual Risk

Source may still exist on user endpoints.

# 42. Attack Scenario AS-011: Object Storage Exposure

### Attack

Attacker obtains or guesses an object-storage URL.

### Objective

Download artifacts or results.

### Mitigations

- private storage;
- non-guessable object identifiers;
- short-lived signed URLs;
- server-side authorization;
- scoped storage identities.

# 43. Attack Scenario AS-012: Privilege Escalation

### Attack

Project member modifies an API request to claim administrative privileges.

### Objective

Manage organization users or robot resources.

### Mitigations

- server-side RBAC;
- immutable identity context;
- deny-by-default policy;
- privileged audit.

# 44. Attack Scenario AS-013: Malicious Dependency

### Attack

A compromised third-party dependency is introduced into the build.

### Objective

Compromise Studio, backend, CI, or production infrastructure.

### Mitigations

- dependency scanning;
- version control;
- lockfiles;
- provenance;
- code review;
- CI isolation;
- release signing.

# 45. Attack Scenario AS-014: CI Credential Theft

### Attack

Attacker compromises CI and steals deployment credentials.

### Objective

Deploy malicious production code.

### Mitigations

- short-lived credentials;
- workload identity;
- protected branches;
- required approvals;
- deployment audit;
- scoped permissions.

# 46. Attack Scenario AS-015: Replay Attack

### Attack

Attacker captures a previously valid operation and replays it.

### High-Risk Operations

- credit reservation;
- booking confirmation;
- cancellation;
- artifact deployment;
- job start;
- refund.

### Mitigations

- idempotency keys;
- request identifiers;
- timestamps where appropriate;
- server-side state validation;
- one-time operation semantics.

# 47. Attack Scenario AS-016: Unauthorized Result Access

### Attack

User obtains a Result ID belonging to another project.

### Objective

Read video, telemetry, logs, or experiment data.

### Mitigations

- organization authorization;
- project membership;
- result-level access policy;
- short-lived download URLs.

# 48. Attack Scenario AS-017: Telemetry Injection

### Attack

Compromised runtime submits false telemetry.

### Objective

Mislead users or operational monitoring.

### Mitigations

- authenticated runtime channel;
- sequence numbers;
- timestamps;
- run correlation;
- source identity;
- sanity checks.

### Residual Risk

Telemetry is operational evidence, not an independent safety authority.

# 49. Attack Scenario AS-018: Video Privacy Exposure

### Attack

Attacker accesses live or recorded robot video.

### Objective

Observe people, facilities, or proprietary experiments.

### Mitigations

- resource authorization;
- authenticated stream;
- short-lived access;
- retention policy;
- audit.

# 50. Attack Scenario AS-019: Denial of Service

### Attack

Attacker floods:

- authentication endpoints;
- APIs;
- artifact uploads;
- booking requests;
- job creation;
- WebSockets.

### Mitigations

- rate limiting;
- quotas;
- request size limits;
- connection limits;
- queue backpressure;
- resource quotas;
- autoscaling where appropriate.

### Residual Risk

A large-scale infrastructure attack may still degrade service availability.

# 51. Attack Scenario AS-020: Safety Communication Loss

### Attack

Control Plane connectivity to Lab Agent is interrupted during execution.

### Objective

Potentially cause uncontrolled robot behavior.

### Mitigation

Robot safety shall not depend on continuous cloud connectivity.

The Lab Agent/runtime shall enter configured local safe behavior.

### Expected Result

Cloud failure does not result in uncontrolled autonomous operation.

# 52. Attack Scenario AS-021: Unauthorized Robot Restart

### Attack

Attacker or failed service attempts to restart a robot automatically.

### Objective

Resume potentially unsafe execution.

### Mitigation

Automatic restart shall require local policy and shall not bypass safety state.

### Expected Result

A faulted or safety-blocked robot remains blocked.

# 53. Attack Scenario AS-022: Database Compromise

### Attack

Attacker obtains application/database credentials.

### Objective

Read or modify tenant state.

### Mitigations

- least-privilege DB roles;
- encrypted storage;
- network isolation;
- tenant controls;
- audit;
- backups;
- credential rotation.

### Residual Risk

A sufficiently privileged database compromise may expose confidential business
data.

Source-code exposure remains reduced because source is not stored in the database.

# 54. Attack Scenario AS-023: Insider Abuse

### Attack

Privileged operator intentionally accesses customer information.

### Mitigations

- least privilege;
- separation of duties;
- administrative audit;
- MFA;
- break-glass procedures;
- monitoring;
- periodic access review.

# 55. Attack Scenario AS-024: Audit Tampering

### Attack

Compromised service attempts to remove evidence of malicious activity.

### Mitigations

- append-oriented audit model;
- restricted audit writes;
- separate storage where appropriate;
- protected retention;
- immutable/WORM capability where required.

# 56. Attack Scenario AS-025: Malicious Booking Cancellation

### Attack

Attacker cancels another organization's booking.

### Mitigations

- tenant authorization;
- booking ownership;
- role validation;
- cancellation policy;
- audit.

# 57. Attack Scenario AS-026: Resource Identifier Enumeration

### Attack

Attacker enumerates robot/resource identifiers.

### Mitigations

- non-sequential IDs where practical;
- authorization before detailed response;
- generic not-authorized/not-found behavior;
- rate limiting.

# 58. Attack Scenario AS-027: Manifest Manipulation

### Attack

Attacker modifies:

- platform ID;
- architecture;
- capabilities;
- entrypoint;
- runtime version.

### Objective

Bypass compatibility or capability restrictions.

### Mitigations

- manifest included in signed integrity boundary;
- server-side validation;
- target platform lookup from authoritative catalog.

# 59. Attack Scenario AS-028: Capability Escalation

### Attack

Artifact declares a harmless capability but attempts access to restricted hardware.

### Mitigations

- capability authorization;
- Lab Agent allowlist;
- runtime enforcement;
- resource-specific policy.

The manifest is declarative evidence, not an authority by itself.

# 60. Attack Scenario AS-029: Credential Rotation Failure

### Attack

Old credentials remain valid after rotation.

### Mitigations

- explicit revocation;
- overlapping rotation windows;
- credential versioning;
- automated verification.

# 61. Attack Scenario AS-030: Backup Exposure

### Attack

Attacker gains access to database or object-storage backups.

### Mitigations

- encrypted backups;
- separate access policy;
- restricted backup identities;
- retention controls;
- restoration testing.

# 62. Security Control Matrix

| Threat Area | Primary Control | Secondary Control |
|---|---|---|
| Identity | Authentication | MFA |
| Authorization | RBAC/policy | Repository enforcement |
| Tenant isolation | Organization scope | DB constraints/RLS |
| Source privacy | Local build | Log sanitization |
| Artifact integrity | Signature/checksum | Immutable storage |
| Robot safety | Local safety | Lab Agent policy |
| Financial integrity | Ledger | Transactions/idempotency |
| Booking integrity | DB exclusion | Application locking |
| Secrets | Secret manager | Rotation |
| Data confidentiality | Encryption | Access control |
| Availability | Rate limits | Queue/backpressure |
| Audit | Audit records | Protected storage |
| Supply chain | Scanning | Provenance/signing |

# 63. Security Assumptions

The system assumes:

1. Physical emergency-stop mechanisms are correctly implemented.
2. Robot vendors provide supported interfaces.
3. The host operating system can enforce basic local process permissions.
4. TLS cryptography is correctly implemented by approved libraries.
5. Cloud provider infrastructure provides stated isolation guarantees.
6. Administrators protect their privileged credentials.
7. Users are responsible for security of their local source environment.
8. Lab operators maintain physical laboratory security.
9. Runtime and robot firmware are maintained.
10. Security policies are reviewed as platforms evolve.

These assumptions shall be documented and periodically reassessed.

# 64. Residual Risk Model

Not every risk can be eliminated.

Residual risk categories include:

| Risk | Residual Reason |
|---|---|
| Compromised endpoint | Source is inherently local |
| Malicious authorized code | User controls application logic |
| Cloud outage | Availability cannot be guaranteed |
| Zero-day | Unknown vulnerabilities |
| Physical hardware failure | Outside cloud control |
| Lab insider | Physical access may bypass cloud |
| Compromised robot firmware | Hardware/vendor dependency |
| Supply-chain compromise | External dependencies |
| Telemetry deception | Runtime may be compromised |
| Large DDoS | External infrastructure event |

Residual risks shall be explicitly accepted by the appropriate owner.

# 65. Risk Rating

Threats shall be evaluated using:

    Risk = Likelihood x Impact

Likelihood:

| Rating | Meaning |
|---|---|
| 1 | Rare |
| 2 | Unlikely |
| 3 | Possible |
| 4 | Likely |
| 5 | Almost Certain |

Impact:

| Rating | Meaning |
|---|---|
| 1 | Negligible |
| 2 | Minor |
| 3 | Moderate |
| 4 | Major |
| 5 | Critical |

Risk score:

| Score | Classification |
|---|---|
| 1-4 | Low |
| 5-9 | Medium |
| 10-16 | High |
| 17-25 | Critical |

Critical and high risks shall require documented mitigation before Production.

# 66. Security Requirements Traceability

Threats shall trace to security requirements.

Example:

    AS-001 Cross-Tenant Access
        |
        +--> SEC-080
        +--> SEC-082
        +--> SEC-083
        +--> SEC-084
        +--> SEC-091
        +--> SEC-093

    AS-002 Artifact Substitution
        |
        +--> SEC-060
        +--> SEC-065
        +--> SEC-066
        +--> SEC-067
        +--> SEC-069
        +--> SEC-071

    AS-008 Compromised Lab Agent
        |
        +--> SEC-030
        +--> SEC-102
        +--> SEC-108
        +--> SEC-110
        +--> SEC-111

# 67. Phase Mapping

| Phase | Threat-Model Activity |
|---|---|
| Phase 0 | Baseline threats, supply chain, CI security |
| Phase 1 | Identity, authentication, authorization threats |
| Phase 2 | Tenant, project, secret, storage threats |
| Phase 3 | Artifact and source-boundary threats |
| Phase 4 | Booking and credit attack scenarios |
| Phase 5 | Job, Run, deployment threats |
| Phase 6 | Lab Agent and physical robot threats |
| Phase 7 | Results, video, telemetry, audit threats |
| Phase 8 | Production, compliance, penetration testing |

# 68. Phase 0 Threat Activities

Required:

- establish threat-model ownership;
- inventory assets;
- identify trust boundaries;
- identify external dependencies;
- scan dependencies;
- establish secure CI;
- define security severity model.

Deliverable:

    docs/security/THREAT_MODEL.md

# 69. Phase 1 Threat Activities

Focus:

- account takeover;
- credential stuffing;
- session theft;
- privilege escalation;
- IDOR;
- unauthorized role changes.

Required evidence:

- authentication tests;
- authorization tests;
- negative access tests;
- MFA design.

# 70. Phase 2 Threat Activities

Focus:

- cross-tenant access;
- project isolation;
- secret exposure;
- storage exposure;
- database compromise.

Required evidence:

- cross-tenant E2E suite;
- repository authorization review;
- storage access review;
- secret scanning.

# 71. Phase 3 Threat Activities

Focus:

- malicious artifacts;
- artifact substitution;
- manifest manipulation;
- signing-key compromise;
- object-storage attacks.

Required evidence:

- signature tests;
- checksum tests;
- malformed artifact tests;
- compatibility tests.

# 72. Phase 4 Threat Activities

Focus:

- credit double spending;
- booking races;
- unauthorized cancellation;
- resource enumeration;
- financial privilege escalation.

Required evidence:

- concurrency tests;
- ledger consistency tests;
- authorization tests;
- idempotency tests.

# 73. Phase 5 Threat Activities

Focus:

- unauthorized deployment;
- malicious execution;
- capability escalation;
- runtime compromise;
- job manipulation.

Required evidence:

- execution authorization tests;
- artifact validation tests;
- Run provenance tests;
- failure tests.

# 74. Phase 6 Threat Activities

Focus:

- rogue Lab Agent;
- compromised Lab Agent;
- robot command manipulation;
- network isolation;
- safety communication failure;
- unsafe restart.

Required evidence:

- Lab Agent authentication;
- command authorization;
- failure injection;
- safety review.

# 75. Phase 7 Threat Activities

Focus:

- result leakage;
- video leakage;
- telemetry injection;
- audit tampering;
- unauthorized downloads.

Required evidence:

- result authorization tests;
- signed URL tests;
- audit integrity tests;
- stream authorization tests.

# 76. Phase 8 Threat Activities

Focus:

- production penetration testing;
- incident response;
- compliance;
- monitoring;
- privileged access;
- backup security;
- disaster recovery.

Required evidence:

- penetration test;
- incident exercise;
- vulnerability report;
- access review;
- security sign-off.

# 77. Threat-Model Review Cadence

The threat model shall be reviewed:

- at every major architecture change;
- before each production release affecting security boundaries;
- after a significant security incident;
- after a major dependency compromise;
- after adding a new robot platform;
- after adding a new Lab Agent capability;
- after changing artifact signing;
- after introducing new data classes;
- at least quarterly during active development;
- at least annually after Production stabilization.

# 78. Event-Driven Threat Review

An immediate review shall be triggered by:

- signing-key compromise;
- authentication-provider compromise;
- database compromise;
- object-storage exposure;
- Lab Agent compromise;
- robot-control security incident;
- major CVE affecting a critical component;
- new remote execution capability;
- new cross-tenant data path;
- introduction of source-code cloud storage.

# 79. Threat-Model Change Process

A security-impacting change shall follow:

    Proposed Change
          |
          v
    Security Impact Assessment
          |
          v
    Threat Model Update
          |
          v
    Requirement Update
          |
          v
    Implementation
          |
          v
    Security Verification
          |
          v
    Review Approval
          |
          v
    Release

Threat-model changes shall be version controlled.

# 80. Security Review Ownership

Recommended ownership:

| Area | Owner |
|---|---|
| Identity | Backend/Security |
| Authorization | Backend/Security |
| Tenant Isolation | Backend/Database |
| Artifact Security | Build/Platform |
| Lab Security | Robotics/Platform |
| Physical Safety | Robotics/Safety |
| Cloud Security | Infrastructure |
| CI Supply Chain | DevOps/Security |
| Privacy | Product/Security |
| Audit | Backend/Security |
| Threat Model | Security/Architecture |

# 81. Security Verification Methods

Verification shall use multiple methods:

| Method | Purpose |
|---|---|
| Code Review | Implementation correctness |
| Architecture Review | Boundary correctness |
| Unit Test | Local behavior |
| Integration Test | Cross-component behavior |
| E2E Test | User-visible security |
| Negative Test | Denial correctness |
| Fuzz Test | Malformed input |
| Static Analysis | Code weaknesses |
| Dependency Scan | Supply-chain risk |
| Penetration Test | External attack resistance |
| Configuration Review | Infrastructure security |
| Failure Injection | Resilience |
| Human Safety Review | Physical deployment safety |

# 82. Acceptance Criteria: Assets

- [ ] All security-relevant assets are inventoried.
- [ ] Asset owners are identified.
- [ ] Data classification exists.
- [ ] Safety-critical assets are identified.
- [ ] Source-code privacy is explicitly modeled.
- [ ] Signing keys are explicitly modeled.
- [ ] Robot-control interfaces are explicitly modeled.

# 83. Acceptance Criteria: Actors

- [ ] Legitimate actors are identified.
- [ ] Adversarial actors are identified.
- [ ] Actor capabilities are documented.
- [ ] Privileged actors are separated.
- [ ] Insider threats are modeled.
- [ ] Compromised service identities are modeled.
- [ ] Rogue Lab Agents are modeled.

# 84. Acceptance Criteria: Trust Boundaries

- [ ] Studio boundary is documented.
- [ ] Local Runtime boundary is documented.
- [ ] Control Plane boundary is documented.
- [ ] Database boundary is documented.
- [ ] Object-storage boundary is documented.
- [ ] Cloud infrastructure boundary is documented.
- [ ] Lab boundary is documented.
- [ ] Robot/runtime boundary is documented.
- [ ] Physical safety boundary is documented.

# 85. Acceptance Criteria: Data Flows

- [ ] Local development flow is documented.
- [ ] Artifact upload flow is documented.
- [ ] Booking flow is documented.
- [ ] Execution flow is documented.
- [ ] Result flow is documented.
- [ ] Security-sensitive data crossings are identified.
- [ ] Trust changes are identified.

# 86. Acceptance Criteria: STRIDE

- [ ] Studio STRIDE analysis exists.
- [ ] Local Runtime STRIDE analysis exists.
- [ ] Control Plane STRIDE analysis exists.
- [ ] Database STRIDE analysis exists.
- [ ] Object Storage STRIDE analysis exists.
- [ ] Cloud STRIDE analysis exists.
- [ ] Lab Agent STRIDE analysis exists.
- [ ] Runtime STRIDE analysis exists.
- [ ] Robot STRIDE analysis exists.
- [ ] Web Console threats are modeled.
- [ ] Queue/worker threats are modeled.

# 87. Acceptance Criteria: Attack Scenarios

- [ ] Cross-tenant access is modeled.
- [ ] Artifact substitution is modeled.
- [ ] Malicious artifacts are modeled.
- [ ] Token theft is modeled.
- [ ] Credit double spending is modeled.
- [ ] Booking races are modeled.
- [ ] Rogue Lab Agent is modeled.
- [ ] Compromised Lab Agent is modeled.
- [ ] Cloud compromise is modeled.
- [ ] Source exfiltration is modeled.
- [ ] Object-storage exposure is modeled.
- [ ] Privilege escalation is modeled.
- [ ] Supply-chain attack is modeled.
- [ ] CI credential theft is modeled.
- [ ] Replay attacks are modeled.
- [ ] Result leakage is modeled.
- [ ] Telemetry injection is modeled.
- [ ] Video exposure is modeled.
- [ ] Denial of service is modeled.
- [ ] Safety communication loss is modeled.

# 88. Acceptance Criteria: Mitigations

- [ ] Every high-risk threat has a mitigation.
- [ ] Critical threats have defense in depth.
- [ ] Residual risks are documented.
- [ ] Mitigations map to SEC requirements.
- [ ] Verification methods are identified.
- [ ] Security ownership is assigned.
- [ ] Production-blocking risks are identified.

# 89. Acceptance Criteria: Physical Safety

- [ ] Cloud is not the physical safety authority.
- [ ] Emergency stop remains local.
- [ ] Lab Agent has local policy.
- [ ] Robot FAULT state blocks execution.
- [ ] Maintenance state blocks execution.
- [ ] Communication failure behavior is defined.
- [ ] Unsafe automatic restart is prohibited.
- [ ] Physical safety review remains mandatory.
- [ ] Software acceptance is not treated as safety certification.

# 90. Acceptance Criteria: Review Cadence

- [ ] Quarterly review is defined for active development.
- [ ] Annual review is defined for Production.
- [ ] Security incidents trigger review.
- [ ] Major architecture changes trigger review.
- [ ] New robot platforms trigger review.
- [ ] New execution capabilities trigger review.
- [ ] Signing-key changes trigger review.
- [ ] Threat-model changes are version controlled.

# 91. Final Threat-Model Invariants

The following invariants are mandatory:

1. The user device is not trusted merely because it runs Studio.
2. The frontend is never an authorization authority.
3. Object identifiers do not grant access.
4. Organization is the primary tenant boundary.
5. Source code is not required to enter the RaaS cloud boundary.
6. Artifact manifests are not trusted without integrity validation.
7. Artifact signatures are verified before execution where signing is required.
8. Artifact compatibility is validated against authoritative platform metadata.
9. Booking does not by itself imply physical execution authority.
10. Credit ownership cannot be changed by client-side requests.
11. Lab Agents are explicitly authenticated.
12. Lab Agents are resource-scoped.
13. Cloud authorization does not replace local robot policy.
14. Cloud connectivity is not a physical safety mechanism.
15. Physical emergency stop remains local.
16. Robot fault state blocks normal execution.
17. Security failures fail closed.
18. Audit evidence identifies privileged and security-sensitive operations.
19. Security logs do not contain secrets.
20. High-risk threats require explicit mitigation or risk acceptance.
21. New security boundaries require threat-model review.
22. Production deployment requires security verification appropriate to the risk.

# 92. Final Security Architecture View

The complete security model is:

    +-------------------------------------------------------------+
    |                     UNTRUSTED DOMAIN                        |
    |                                                             |
    |  User / Internet / Local Endpoint                          |
    +-----------------------------+-------------------------------+
                                  |
                                  | TLS + Authentication
                                  v
    +-------------------------------------------------------------+
    |                     CONTROL PLANE                           |
    |                                                             |
    |  Auth -> Authorization -> Tenant -> Domain Policy           |
    |                                                             |
    |  Projects / Platforms / Artifacts / Booking / Credits      |
    |  Jobs / Runs / Results / Audit                              |
    +----------------+--------------------+-----------------------+
                     |                    |
                     v                    v
              PostgreSQL             Object Storage
                     |                    |
                     +----------+---------+
                                |
                                v
                     Secure Lab Protocol
                                |
                                v
    +-------------------------------------------------------------+
    |                         LAB BOUNDARY                         |
    |                                                             |
    |  Lab Agent -> Local Policy -> Runtime -> Resource           |
    |                                                             |
    |  Authentication + Authorization + Compatibility             |
    |  + Local Safety + Resource State                             |
    +-----------------------------+-------------------------------+
                                  |
                                  v
    +-------------------------------------------------------------+
    |                    PHYSICAL SAFETY DOMAIN                    |
    |                                                             |
    |  Robot Controller / Safety Controller / Emergency Stop      |
    |                                                             |
    |  Independent of cloud availability and authorization path   |
    +-------------------------------------------------------------+

The principal threat-model conclusion is:

> Kritva RaaS must assume that individual software components, user devices,
> credentials, artifacts, network paths, cloud services, and even Lab Agents may
> eventually be compromised. Security therefore depends on explicit trust
> boundaries, independent authorization, artifact integrity, tenant isolation,
> least privilege, local laboratory policy, and an independent physical safety
> boundary.

A production-ready Kritva RaaS security posture exists only when the threat model,
security requirements, implementation controls, verification evidence, operational
monitoring, and physical-safety boundaries remain consistent as the platform
evolves.
