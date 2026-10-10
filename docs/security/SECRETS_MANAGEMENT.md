# Kritva RaaS Secrets Management

## 1. Purpose

This document defines the production-grade secrets-management architecture for
Kritva RaaS.

Secrets are high-value security assets used to authenticate, authorize,
encrypt, sign, connect, provision, recover, and operate RaaS infrastructure.

The system shall ensure that secrets are:

- classified;
- generated securely;
- stored securely;
- accessed only by authorized principals;
- injected only when required;
- never committed to source control;
- excluded from logs and telemetry;
- rotated according to policy;
- revoked when compromised;
- auditable;
- recoverable through controlled procedures;
- securely destroyed when no longer required.

The design covers both cloud-side and developer/lab-side secrets.

## 2. Scope

This document covers secrets used by:

- RaaS Studio;
- Studio Local Runtime;
- Web Console;
- Control Plane;
- backend workers;
- CI/CD;
- development environments;
- staging;
- production;
- PostgreSQL;
- object storage;
- queues;
- external integrations;
- service identities;
- API keys;
- Lab Agents;
- Lab Agent certificates;
- laboratory infrastructure;
- robot-side operational credentials;
- emergency break-glass operations.

It covers:

- classification;
- ownership;
- storage;
- access;
- injection;
- rotation;
- revocation;
- detection;
- incident response;
- audit;
- retention;
- secure deletion.

## 3. Non-Goals

This document does not define:

- general authentication architecture;
- authorization roles and permissions;
- artifact signing implementation;
- source-code privacy policy;
- physical robot safety;
- application-level encryption algorithms;
- general database architecture.

Those systems consume secrets according to the policies defined here.

## 4. Security Goals

Kritva RaaS secrets management shall:

1. Prevent plaintext secret storage where avoidable.
2. Prevent secrets from entering source control.
3. Minimize secret lifetime.
4. Minimize secret distribution.
5. Enforce least-privilege access.
6. Separate environments.
7. Support automatic rotation.
8. Support emergency revocation.
9. Protect developer-machine credentials.
10. Protect CI/CD credentials.
11. Protect Lab Agent credentials.
12. Protect production credentials.
13. Detect leaked secrets.
14. Prevent secrets from appearing in logs.
15. Provide auditable access.
16. Support break-glass operations.
17. Support incident response.
18. Provide controlled recovery.
19. Prevent accidental cross-environment use.
20. Fail safely when required secret infrastructure is unavailable.

# 5. Secrets Management Principles

## 5.1 Never Trust Configuration Files

A configuration file shall not be considered secure merely because it is outside
source control.

Sensitive values shall use a dedicated secret-storage mechanism.

## 5.2 Least Privilege

A workload shall receive only the secrets required for its operation.

Example:

    result-worker
        |
        +-- result-storage credential
        +-- database credential
        |
        X-- billing master credential
        X-- Lab Agent private key
        X-- customer API keys

## 5.3 Short Lifetime

Short-lived credentials are preferred over static credentials.

Preferred:

    Workload Identity
          |
          v
    Short-Lived Credential
          |
          v
    API / Database / Storage

## 5.4 Environment Separation

Secrets shall be isolated by:

    Local
    Development
    Staging
    Production

A Development credential shall never authenticate against Production unless
explicitly designed for a controlled administrative purpose.

## 5.5 No Secret in Logs

Secrets shall never appear in:

- application logs;
- audit logs;
- tracing;
- metrics;
- crash dumps;
- analytics;
- telemetry;
- error messages;
- support bundles.

# 6. Definitions

| Term | Definition |
|---|---|
| Secret | Sensitive value whose disclosure can enable unauthorized access |
| Credential | Secret or cryptographic identity used for authentication |
| Key | Cryptographic secret used for encryption/signing/authentication |
| Token | Credential used to authenticate or authorize |
| Secret Store | System providing protected secret storage |
| Secret Manager | Service responsible for secret lifecycle |
| Injection | Secure delivery of a secret to a workload |
| Rotation | Replacement of an active credential |
| Revocation | Explicit invalidation of a credential |
| Break-Glass | Emergency privileged secret access |
| Workload Identity | Identity assigned to a running service/workload |
| OS Keychain | Operating-system protected credential store |
| Lab Secret | Secret used by laboratory infrastructure |
| Bootstrap Secret | Initial credential used to establish trusted identity |
| Secret Material | Actual sensitive bytes/value |
| Secret Metadata | Non-secret information describing a secret |

# 7. Secret Classification

Kritva RaaS shall classify secrets according to impact.

| Class | Description | Example |
|---|---|---|
| S0 | Public/non-secret | Public API endpoint |
| S1 | Internal | Non-sensitive configuration |
| S2 | Confidential | Service API credential |
| S3 | Restricted | Production database credential |
| S4 | Critical | Root signing/private CA key |

S0 and S1 are not secrets in the strict sense but remain configuration data.

S2-S4 shall use formal secrets-management controls.

# 8. Secret Categories

Secrets include:

- user authentication credentials;
- password hashes and reset secrets;
- access/refresh credentials;
- API keys;
- service credentials;
- database credentials;
- object-storage credentials;
- queue credentials;
- TLS private keys;
- Lab Agent private keys;
- certificate enrollment credentials;
- CI/CD credentials;
- cloud credentials;
- webhook secrets;
- external service credentials;
- encryption keys;
- signing keys;
- break-glass credentials.

# 9. Secret Ownership

Every secret shall have:

- owner;
- purpose;
- environment;
- system;
- classification;
- creation date;
- expiration/rotation policy;
- access policy;
- lifecycle status.

Example:

    secret_id
    owner
    purpose
    environment
    classification
    created_at
    expires_at
    rotation_policy
    status

# 10. Secret Lifecycle

The standard lifecycle is:

    REQUEST
       |
       v
    APPROVE
       |
       v
    GENERATE
       |
       v
    STORE
       |
       v
    DISTRIBUTE / INJECT
       |
       v
    USE
       |
       v
    ROTATE
       |
       v
    REVOKE
       |
       v
    DESTROY

Not every secret requires every lifecycle stage in the same implementation.

# 11. Secret Generation

Secrets shall be generated using cryptographically secure random mechanisms.

Secrets shall not be generated from:

- timestamps;
- predictable counters;
- usernames;
- hostnames;
- repository names;
- project IDs;
- human-selected strings.

Where possible, secret generation shall occur inside a managed secret store,
HSM, KMS, OS secure enclave, or equivalent protected environment.

# 12. Secret Storage Architecture

Conceptual architecture:

    Application
        |
        v
    Identity
        |
        v
    Secret Authorization
        |
        v
    Secret Manager
        |
        +------------------+
        |                  |
        v                  v
      KMS/HSM          Encrypted Storage
        |
        v
    Secret Material

The application should receive the secret only after authentication and
authorization.

# 13. Provider Neutrality

The architecture shall not depend on a specific cloud provider.

The implementation shall support a provider-neutral abstraction:

    SecretProvider
        |
        +-- get()
        +-- put()
        +-- rotate()
        +-- revoke()
        +-- metadata()
        +-- delete()

A cloud-native secret service may implement the interface in production.

# 14. Secret Manager Interface

Conceptual interface:

    SecretValue getSecret(
        SecretReference reference,
        Principal principal
    )

    SecretMetadata getMetadata(
        SecretReference reference
    )

    void rotateSecret(
        SecretReference reference
    )

    void revokeSecret(
        SecretReference reference
    )

Applications should not directly manipulate secret-store internals.

# 15. Secret References

Applications should use references rather than embedding secrets.

Example:

    database.primary.password

or:

    secret://production/database/primary/password

The exact URI format is implementation-specific.

# 16. Secret Metadata

Metadata may include:

- secret ID;
- environment;
- owner;
- classification;
- version;
- status;
- created time;
- expiration;
- rotation schedule.

Metadata must not expose secret material.

# 17. Secret Versioning

Secrets shall support versions where practical.

Example:

    secret:
        database/password
        version: 17

Rotation creates:

    version 18

The old version remains available only for the controlled overlap period.

# 18. Secret Rotation

Rotation shall support:

- planned rotation;
- automatic rotation;
- emergency rotation;
- compromise rotation.

Preferred sequence:

    Generate New
         |
         v
    Store New
         |
         v
    Deploy Consumer
         |
         v
    Verify
         |
         v
    Revoke Old

# 19. Zero-Downtime Rotation

Services requiring uninterrupted availability should support overlapping
credentials.

Example:

    Credential A = ACTIVE
    Credential B = ACTIVE

    Consumer migrates A -> B

    Credential A = REVOKED

Rotation shall not require hard-coded credentials.

# 20. Rotation Frequency

Rotation frequency shall depend on risk.

| Secret | Recommended Policy |
|---|---|
| Production DB credential | Automatic/short policy |
| Service credential | Regular rotation |
| API key | Expiration + rotation |
| Lab certificate | Before expiry |
| CI credential | Short-lived preferred |
| Encryption key | Managed key rotation |
| Signing key | Controlled lifecycle |
| Break-glass | Rotate after every use |

Exact periods shall be defined by environment and secret class.

# 21. Emergency Rotation

Emergency rotation shall be possible without application source changes.

Triggers:

- leak;
- compromise;
- suspicious use;
- employee departure;
- service compromise;
- certificate compromise;
- vendor breach.

# 22. Revocation

Revocation shall invalidate a secret immediately where technically possible.

Examples:

- API key;
- service credential;
- refresh credential;
- Lab certificate;
- CI credential.

Encryption-key retirement may require a different lifecycle because existing
data may depend on historical keys.

# 23. Secret Access Policy

Every secret shall have an explicit access policy.

Conceptual:

    Principal
       |
       v
    Environment
       |
       v
    Workload
       |
       v
    Secret Scope
       |
       v
    Allow / Deny

Access should be based on workload identity rather than shared static
credentials.

# 24. Human Access

Human access to production secrets shall be exceptional.

Normal developers should not retrieve:

- production database passwords;
- production private keys;
- customer credentials;
- Lab Agent private keys;
- root encryption keys.

Humans should normally access systems through audited administrative interfaces.

# 25. Service Access

Services receive only required secrets.

Example:

    booking-service
        |
        +-- database booking credential
        +-- required queue credential
        |
        X-- artifact-signing key
        X-- billing master key

# 26. Administrative Access

Administrative secret access requires:

- strong authentication;
- privileged authorization;
- explicit purpose;
- audit;
- short-lived access where possible.

# 27. Break-Glass Secrets

Break-glass secrets are reserved for emergencies.

Examples:

- emergency production recovery;
- unavailable identity provider;
- secret-manager outage;
- certificate recovery;
- database emergency access.

Break-glass credentials shall be:

- separately stored;
- strongly protected;
- rarely used;
- monitored;
- rotated after use.

# 28. Break-Glass Flow

    Incident
       |
       v
    Emergency Approval
       |
       v
    Strong Authentication
       |
       v
    Break-Glass Secret Access
       |
       v
    Emergency Operation
       |
       v
    Audit
       |
       v
    Secret Rotation
       |
       v
    Post-Incident Review

# 29. Studio Secret Storage

RaaS Studio shall use the operating system's secure credential storage.

The Studio shall not store refresh tokens or private credentials in:

- plaintext JSON;
- local SQLite without encryption;
- `.env` files;
- application preferences;
- source repositories.

# 30. OS Keychain

Preferred secure stores include:

- Windows Credential Manager / protected credential APIs;
- macOS Keychain;
- Linux Secret Service or equivalent secure credential store.

The exact implementation shall use platform-native secure storage.

# 31. Studio Credential Flow

    User Login
        |
        v
    Authentication
        |
        v
    Access + Refresh Credential
        |
        v
    Store Refresh Credential
        |
        v
    OS Keychain
        |
        v
    Studio Runtime

Access tokens should remain memory resident for their short lifetime.

# 32. Studio Logout

Logout shall:

- revoke/rotate session credentials as appropriate;
- remove active credentials from memory;
- clear local session state;
- remove persistent refresh credentials when policy requires.

# 33. Studio Device Binding

Where device binding is enabled:

    Studio
       |
       v
    Generate Device Key
       |
       v
    OS Secure Key Store
       |
       v
    Register Public Key

The private key shall never be uploaded.

# 34. Studio Local Build Secrets

Local builds may require developer-specific credentials.

These shall remain local.

Examples:

- private package registry token;
- developer signing credential;
- private dependency credential.

The RaaS cloud shall not receive these secrets as part of normal artifact
generation.

# 35. Artifact Privacy Boundary

The artifact security model requires:

    Customer Source + Local Secrets
                 |
                 v
            Local Build
                 |
                 v
             .krv Artifact
                 |
                 v
            Cloud Upload

The `.krv` artifact shall not contain unrelated developer credentials.

# 36. CI/CD Secrets

CI/CD systems shall use dedicated machine credentials.

Secrets shall not be embedded in:

- workflow YAML;
- Dockerfiles;
- scripts;
- source code;
- test fixtures.

Preferred:

    CI Workload
         |
         v
    Workload Identity
         |
         v
    Secret Manager
         |
         v
    Short-Lived Credential

# 37. CI Credential Scope

CI credentials shall be limited to the repository and operation required.

Examples:

    build
    test
    package
    publish

A build job should not automatically have production deployment credentials.

# 38. CI Environment Separation

Separate:

    CI Development
    CI Staging
    CI Production

credentials shall be maintained.

Production deployment credentials shall require explicit protected workflow
approval.

# 39. CI Secret Injection

Secrets should be injected into the job environment only for the required
step.

Example:

    build
      |
      v
    request secret
      |
      v
    inject
      |
      v
    command
      |
      v
    clear

Long-lived secrets should not be written to workspace files unless absolutely
necessary.

# 40. CI Log Protection

CI systems shall:

- automatically mask known secrets;
- prevent shell tracing of secrets;
- avoid printing environment variables;
- prevent secrets in test failure output;
- scan artifacts for credential leakage.

# 41. Pull Request Security

Secrets shall not be made available to untrusted pull-request execution.

Forked or untrusted builds shall have restricted credentials.

This prevents malicious code from exfiltrating CI secrets.

# 42. Container Secrets

Container images shall not contain secrets.

Forbidden:

    ENV API_KEY=...
    ARG PASSWORD=...
    COPY secret-file ...

Secrets should be injected at runtime.

# 43. Kubernetes/Orchestrator Secrets

Where an orchestrator is used:

- secrets shall be encrypted at rest;
- access shall be RBAC controlled;
- workloads shall receive only required secrets;
- service accounts shall be scoped;
- secret mounts shall be restricted.

The exact orchestration technology remains provider-neutral.

# 44. Database Credentials

Database credentials shall be:

- environment-specific;
- scoped to the application;
- rotated;
- stored in secret management infrastructure;
- prohibited from source control.

Where supported, dynamic database credentials are preferred.

# 45. Database Credential Separation

Separate credentials should exist for:

- application runtime;
- migrations;
- administration;
- reporting;
- emergency recovery.

Application services shall not use database superuser credentials.

# 46. Object Storage Credentials

Object storage access should use workload identity or scoped credentials.

A service should receive only:

- required bucket;
- required prefix;
- required operations.

Global storage administration credentials shall not be distributed to normal
application workloads.

# 47. Queue Credentials

Queue credentials shall be scoped to:

- required queue/topic;
- required producer/consumer operations.

A worker consuming one queue shall not automatically receive access to every
queue.

# 48. External Integration Secrets

External integrations may require:

- API keys;
- OAuth client credentials;
- webhook signing secrets;
- certificates.

These shall be stored in the central secret-management system.

External credentials shall be classified according to impact.

# 49. Webhook Secrets

Webhook verification secrets shall:

- be stored securely;
- be rotated;
- be used to validate signatures;
- never be logged.

Webhook requests shall fail closed when signature verification fails.

# 50. Encryption Keys

Encryption keys shall be managed separately from ordinary application
configuration.

Preferred architecture:

    Application
        |
        v
    KMS / HSM
        |
        v
    Data Encryption Key
        |
        v
    Encrypted Data

Root/master keys shall not be embedded in application source.

# 51. Key Encryption Keys

Where envelope encryption is used:

    Master Key
        |
        v
    Encrypt Data Key
        |
        v
    Data Encryption Key
        |
        v
    Data

Master key access shall be more restricted than application secret access.

# 52. Signing Keys

Artifact or protocol signing keys shall receive critical classification.

Private signing keys shall:

- never be committed;
- never be embedded in Studio;
- never be available to normal CI jobs;
- be protected using managed key storage or HSM where practical;
- require explicit authorization.

Signing-key lifecycle is governed additionally by artifact security policy.

# 53. Lab Secrets

Lab secrets include:

- Lab Agent private keys;
- mTLS certificates;
- certificate enrollment credentials;
- local service credentials;
- robot interface credentials;
- facility network credentials;
- maintenance credentials.

Lab secrets shall remain local unless cloud storage is explicitly required.

# 54. Lab Agent Private Keys

The Lab Agent private key shall be generated and stored on the Lab Agent host
where practical.

Preferred:

    Lab Agent
       |
       v
    Generate Key
       |
       v
    Local Protected Key Store
       |
       v
    CSR
       |
       v
    Certificate Authority

The private key shall not be transmitted to the Control Plane.

# 55. Lab Certificate Storage

Lab certificates and private keys shall have filesystem permissions restricted
to the Lab Agent service account or protected system keystore.

Private keys shall not be world-readable.

# 56. Lab Bootstrap Secret

A Lab Agent may require an initial bootstrap credential.

The bootstrap credential shall be:

- short-lived;
- single-use where practical;
- bound to the intended lab/agent;
- revocable;
- audited.

After certificate enrollment, the bootstrap credential shall be disabled.

# 57. Robot Credentials

If robot hardware requires credentials, they shall be:

- scoped to the robot or controller;
- stored locally where practical;
- inaccessible to cloud users;
- rotated according to vendor capability.

Robot credentials shall not be included in `.krv` artifacts.

# 58. Development Secrets

Development secrets shall use isolated development infrastructure.

Developers shall not use production credentials for local development.

Safe alternatives include:

- local mock services;
- ephemeral credentials;
- development secret store;
- synthetic data.

# 59. Local `.env` Files

`.env` files may be used for local development only when:

- excluded from source control;
- protected by filesystem permissions;
- documented as non-production;
- never shared.

Production deployments shall not depend on developer `.env` files.

# 60. Secret Detection

Secret detection shall occur at multiple stages:

    Developer
        |
        v
    Pre-commit
        |
        v
    CI
        |
        v
    Artifact Scan
        |
        v
    Repository Monitoring
        |
        v
    Runtime Monitoring

# 61. Secret Scanning

Scanning shall detect:

- API keys;
- tokens;
- passwords;
- private keys;
- certificates;
- cloud credentials;
- database URLs with credentials;
- known vendor credential patterns;
- high-entropy suspicious strings.

# 62. Pre-Commit Detection

Developers should receive immediate feedback when a likely secret is detected.

High-confidence secrets should block the commit.

False positives should be suppressible only through reviewed configuration.

# 63. CI Secret Detection

CI shall scan:

- source;
- configuration;
- generated files;
- artifacts;
- container layers where applicable.

A confirmed high-confidence production secret shall fail the pipeline.

# 64. Repository Scanning

Repositories should be periodically rescanned for historical leaks.

Detection shall cover:

- current branches;
- tags;
- recent history;
- configuration directories.

Historical exposure may require credential rotation even after deletion.

# 65. Leak Response

If a secret is detected:

    DETECT
      |
      v
    CLASSIFY
      |
      v
    REVOKE / ROTATE
      |
      v
    INVESTIGATE
      |
      v
    REMOVE
      |
      v
    RESCAN
      |
      v
    AUDIT

Deleting the secret from Git is not sufficient.

# 66. Secret Exposure Severity

| Severity | Example |
|---|---|
| Critical | Production root/private signing key |
| High | Production database/API credential |
| Medium | Restricted staging credential |
| Low | Expired development credential |
| Informational | Known public/non-secret value |

Critical and High exposure shall trigger immediate rotation.

# 67. Secret Redaction

Applications shall use centralized secret-redaction utilities.

Potential secret patterns shall be redacted from:

- logs;
- exceptions;
- HTTP traces;
- diagnostics;
- support bundles.

Redaction shall occur before persistence.

# 68. Structured Logging

Structured logs shall explicitly exclude fields such as:

    password
    token
    access_token
    refresh_token
    api_key
    client_secret
    private_key
    certificate_private_key

Sensitive request headers shall also be excluded.

# 69. Telemetry

Telemetry shall never capture:

- Authorization headers;
- API keys;
- cookies;
- client secrets;
- private keys;
- database passwords.

Distributed tracing shall use request IDs rather than credential values.

# 70. Crash Reports

Crash-reporting systems shall sanitize:

- environment variables;
- command lines;
- headers;
- configuration;
- filesystem paths containing secrets.

# 71. Secret Access Auditing

Secret retrieval should generate an audit event containing:

    secret_id
    principal_id
    workload
    environment
    timestamp
    action
    result

The actual secret value shall never be logged.

# 72. Secret Store Availability

Applications shall define behavior when the secret store is unavailable.

Preferred behavior:

- fail startup if a required credential is unavailable;
- do not fall back to plaintext credentials;
- do not use hard-coded emergency passwords.

For long-running services, already-loaded credentials may continue only under
explicitly defined policy.

# 73. Secret Store Outage

An outage shall not trigger unsafe credential fallback.

Forbidden:

    Secret Manager unavailable
           |
           X
    Use default password

Instead:

    Secret Manager unavailable
           |
           v
        Fail Safe

# 74. Secret Caching

Secrets may be cached in process memory for limited periods.

Requirements:

- shortest practical lifetime;
- no disk persistence;
- no logging;
- clear on process termination;
- invalidate after rotation where practical.

# 75. Memory Protection

Applications should minimize the lifetime of sensitive values in memory.

Where practical:

- avoid unnecessary copies;
- clear buffers after use;
- avoid dumping process memory;
- prevent debug logging.

Language/runtime limitations shall be documented.

# 76. Access Policy Model

Secret access policy should contain:

    secret
    principal
    environment
    operation
    scope
    conditions
    expiration

Example:

    production/database/booking/password
        |
        +-- booking-service
        +-- production
        +-- read
        +-- active

# 77. Human Secret Retrieval

Human secret retrieval shall require:

- strong authentication;
- authorization;
- purpose;
- audit;
- possibly step-up MFA;
- time-limited access.

Production secret retrieval should be exceptional.

# 78. Secret Sharing

Secrets shall not be shared through:

- email;
- chat;
- issue trackers;
- source control;
- documentation;
- screenshots;
- tickets.

Secure secret-sharing mechanisms may be used only where necessary.

# 79. Documentation

Documentation shall use placeholders.

Example:

    DATABASE_PASSWORD=<managed-secret>

Never:

    DATABASE_PASSWORD=ActualProductionPassword

# 80. Test Secrets

Test credentials shall be:

- synthetic;
- environment-specific;
- non-production;
- disposable.

Production credentials shall never be used in automated tests.

# 81. Sample Configuration

Example configuration:

    database:
        host: managed
        username: service-account
        password_reference: secret://dev/database/password

The configuration contains a reference, not the secret.

# 82. Secret Injection Patterns

Supported patterns:

1. Environment injection.
2. Mounted temporary file.
3. In-memory retrieval.
4. Workload identity.
5. OS keychain retrieval.
6. Hardware-backed key operation.

Preferred order is toward identity-based access rather than static injection.

# 83. Environment Injection

Environment variables may be used for runtime secrets when:

- process isolation is acceptable;
- the environment does not expose them;
- diagnostics do not dump them;
- child-process inheritance is controlled.

For highly sensitive credentials, direct secret APIs or file descriptors may be
preferred.

# 84. File Injection

If a secret must be provided as a file:

- use temporary protected storage;
- restrict permissions;
- avoid shared volumes;
- delete after use;
- prevent accidental artifact inclusion.

# 85. Build-Time Secrets

Build-time secrets shall be minimized.

A secret required only to access a private dependency must not remain in the
resulting artifact or container image.

Build systems shall verify that build secrets do not leak into output layers.

# 86. Runtime Secrets

Runtime secrets shall be injected only when required.

Example:

    booking-service
        |
        v
    Request DB credential
        |
        v
    Secret Manager
        |
        v
    Memory
        |
        v
    PostgreSQL

# 87. Artifact Boundary

Secrets shall never be packaged into `.krv` artifacts unless an explicit,
reviewed architecture requires encrypted runtime credentials.

The default rule is:

> A customer execution artifact contains no reusable infrastructure secret.

# 88. Customer Secrets

Customer-owned credentials shall not become platform-owned secrets without an
explicit integration architecture.

Customer credentials should be:

- scoped;
- encrypted;
- tenant isolated;
- separately authorized;
- auditable;
- revocable.

# 89. External OAuth Credentials

OAuth client secrets shall remain server-side.

Public desktop applications shall not embed confidential client secrets.

PKCE shall be used where appropriate for public clients.

# 90. Web Console Secrets

Browser applications shall not receive backend master credentials.

The browser may receive:

- short-lived access credentials;
- CSRF tokens where applicable;
- non-secret configuration.

It shall never receive:

- database passwords;
- service master credentials;
- signing keys;
- cloud root credentials.

# 91. API Gateway Secrets

Gateway credentials shall be stored in the central secret-management system.

They shall be rotated independently from application credentials.

# 92. Cloud Provider Credentials

Long-lived cloud access keys should be avoided.

Preferred:

    Workload
       |
       v
    Workload Identity
       |
       v
    Temporary Cloud Credential

Static cloud administrator credentials shall not be used by normal workloads.

# 93. Infrastructure-as-Code

Infrastructure code shall contain references, not secret values.

State files may contain sensitive values depending on tooling.

Therefore state storage shall be:

- encrypted;
- access controlled;
- isolated by environment;
- audited;
- protected from public exposure.

# 94. CI/CD Deployment Credentials

Production deployment credentials shall require:

- protected branch/workflow;
- authorized identity;
- environment protection;
- audit.

Deployment jobs shall receive credentials only during the deployment step.

# 95. Secret Rotation and Deployments

Rotation shall be designed so that:

    New Secret
        |
        v
    Application accepts New
        |
        v
    Validate
        |
        v
    Revoke Old

Application releases should not be required merely to rotate a secret.

# 96. Certificate Rotation

Certificate rotation shall support:

- overlapping validity;
- automated renewal;
- validation before activation;
- old certificate revocation.

Lab Agent certificate rotation shall not require transmitting private keys to
the Control Plane.

# 97. Private Key Handling

Private keys should be generated as close as possible to their point of use.

Preferred:

    Generate
       |
       v
    Protect
       |
       v
    Use Cryptographically
       |
       v
    Never Export

Where hardware-backed key storage is available, it should be considered for
high-value keys.

# 98. Break-Glass Storage

Break-glass secrets shall be stored separately from routine credentials.

Requirements:

- restricted access;
- dual-control where appropriate;
- strong audit;
- explicit emergency reason;
- automatic notification;
- post-use rotation.

# 99. Break-Glass Testing

Break-glass credentials shall be tested periodically.

Testing shall verify:

- credential validity;
- access procedure;
- audit;
- notification;
- rotation after use.

Testing must not expose the actual secret.

# 100. Employee/Contractor Departure

When a privileged employee or contractor leaves:

- personal credentials are revoked;
- sessions are revoked;
- API keys are reviewed;
- service ownership is reviewed;
- shared credentials are rotated where applicable;
- support delegations are revoked.

# 101. Secret Ownership Transfer

If a service owner changes:

- secret ownership metadata is updated;
- access policy is reviewed;
- credentials are rotated where appropriate;
- audit records are preserved.

# 102. Vendor Offboarding

External integration credentials shall be:

- revoked;
- deleted where applicable;
- removed from CI/CD;
- removed from configuration;
- reviewed in historical logs.

# 103. Retention

Secret material should be retained only while operationally required.

Secret metadata may need longer retention for audit.

Revoked secret material shall be securely destroyed according to policy.

# 104. Secure Deletion

Deletion shall cover:

- secret store version;
- temporary files;
- CI workspace;
- local cache;
- backup copies according to retention policy.

For hardware-backed keys, destruction shall follow the key-management system's
secure destruction mechanism.

# 105. Backups

Backups containing secret material shall be protected at the same or higher
security level as the original.

Backup access shall be separately controlled.

Expired secrets should not be unnecessarily retained in active backups beyond
the required recovery policy.

# 106. Disaster Recovery

Disaster recovery shall preserve the ability to restore required credentials
without exposing them.

Recovery procedures shall define:

- secret-store recovery;
- key recovery;
- access recovery;
- break-glass process;
- rotation after restoration.

# 107. Secret Inventory

A production secret inventory shall exist.

It should include:

| Field | Required |
|---|---|
| Secret ID | Yes |
| Owner | Yes |
| Environment | Yes |
| Classification | Yes |
| Purpose | Yes |
| Rotation policy | Yes |
| Expiration | Yes |
| Status | Yes |
| Consumers | Yes |
| Last rotation | Yes |
| Last access | Preferred |

# 108. Secret Discovery

Inventory should be reconciled with deployed infrastructure.

Unknown secrets shall be investigated.

Unused secrets should be removed.

# 109. Secret Access Review

Access should be reviewed:

- during deployment;
- after role changes;
- after service changes;
- quarterly for production;
- after security incidents.

Unused access should be removed.

# 110. Secret Metrics

Recommended metrics:

- active secrets;
- secrets by classification;
- secrets nearing expiration;
- rotation success;
- rotation failure;
- secret access count;
- unauthorized access attempts;
- detected leaks;
- revoked credentials;
- emergency rotations.

# 111. Leak Detection Pipeline

    Source
      |
      v
    Secret Scanner
      |
      +----> No Finding ----> Continue
      |
      v
    Suspected Secret
      |
      v
    Validate
      |
      v
    Classify
      |
      v
    Revoke / Rotate
      |
      v
    Investigate
      |
      v
    Rescan

# 112. Secret Leak Prevention

Preventive controls include:

- pre-commit scanning;
- CI scanning;
- repository scanning;
- secret redaction;
- secure configuration;
- least privilege;
- short credential lifetime;
- environment isolation.

# 113. Secret Leak Detection Response

The response owner shall:

1. Determine whether the value is a real credential.
2. Determine environment.
3. Determine scope.
4. Determine exposure window.
5. Revoke or rotate.
6. Investigate use.
7. Remove exposure.
8. Rescan.
9. Document incident.

# 114. Authentication Integration

Secrets management supports authentication by protecting:

- session infrastructure;
- API keys;
- service credentials;
- Lab Agent private keys;
- certificate authorities;
- recovery credentials.

Secrets management shall not duplicate identity policy.

# 115. Authorization Integration

Secret retrieval itself is an authorization-protected operation.

Example:

    service identity
          |
          v
    secret.read
          |
          v
    specific secret
          |
          v
    allow/deny

Possessing a service identity does not automatically grant access to all
secrets.

# 116. Audit Integration

Secret access should be correlated with:

- request ID;
- principal ID;
- workload;
- deployment;
- environment.

This supports incident investigation without recording secret values.

# 117. Security Boundaries

Critical boundaries include:

    Developer Machine -> Cloud
    Studio -> Control Plane
    CI -> Production
    Service -> Secret Manager
    Lab Agent -> Control Plane
    Lab Agent -> Robot
    Administrator -> Production Secrets

Each boundary requires explicit trust establishment.

# 118. Threat Model

Primary threats:

- source-control leakage;
- CI log leakage;
- compromised developer machine;
- stolen API key;
- stolen service credential;
- Lab Agent compromise;
- secret-manager compromise;
- insider misuse;
- backup exposure;
- container image leakage;
- debug logging;
- accidental artifact packaging.

# 119. Threat: Source-Control Leak

Mitigation:

- pre-commit scanning;
- CI scanning;
- repository scanning;
- immediate rotation;
- secret-store references.

# 120. Threat: CI Exfiltration

Mitigation:

- short-lived credentials;
- protected workflows;
- untrusted PR isolation;
- minimal scopes;
- log masking;
- deployment approvals.

# 121. Threat: Developer Machine Compromise

Mitigation:

- OS keychain;
- short-lived tokens;
- device binding;
- limited production access;
- no production secrets in local development.

# 122. Threat: Lab Host Compromise

Mitigation:

- mTLS;
- protected private keys;
- certificate rotation;
- scoped lab identity;
- local command authorization;
- incident revocation.

# 123. Threat: Secret Manager Compromise

Mitigation:

- strong IAM;
- separate administrative roles;
- KMS/HSM;
- audit;
- environment isolation;
- credential rotation;
- break-glass recovery.

# 124. Threat: Insider Misuse

Mitigation:

- least privilege;
- human access restrictions;
- step-up authentication;
- audit;
- support delegation;
- break-glass controls;
- periodic access review.

# 125. Phase Mapping

| Phase | Secrets Management Focus |
|---|---|
| Phase 0 | Secret classification and architecture |
| Phase 1 | Basic application secret storage |
| Phase 2 | Environment-specific secret infrastructure |
| Phase 3 | CI/CD and service credentials |
| Phase 4 | Automated rotation and stronger controls |
| Phase 5 | Lab Agent and certificate secrets |
| Phase 6 | Device/robot operational secrets |
| Phase 7 | Leak detection and operational governance |
| Phase 8 | Production hardening and formal validation |

# 126. Phase 0 Requirements

Define:

- secret classes;
- owners;
- environments;
- storage architecture;
- access model;
- rotation policy;
- audit requirements;
- emergency process.

# 127. Phase 1 Requirements

Implement:

- secure application secret storage;
- development secret isolation;
- local Studio OS keychain;
- secret references;
- secret redaction.

# 128. Phase 2 Requirements

Implement:

- Development/Staging/Production secret separation;
- application credentials;
- database credentials;
- object-storage credentials;
- queue credentials;
- access policies.

# 129. Phase 3 Requirements

Implement:

- CI/CD credentials;
- workload identity;
- deployment secrets;
- secret injection;
- CI leak scanning;
- protected production workflows.

# 130. Phase 4 Requirements

Implement:

- automated rotation;
- credential versioning;
- emergency rotation;
- access reviews;
- centralized audit;
- secret inventory.

# 131. Phase 5 Requirements

Implement:

- Lab Agent private-key protection;
- certificate enrollment;
- bootstrap credential lifecycle;
- certificate rotation;
- certificate revocation.

# 132. Phase 6 Requirements

Implement:

- robot credentials;
- local facility secrets;
- device identities;
- operational credential isolation;
- offline recovery procedures.

# 133. Phase 7 Requirements

Implement:

- repository scanning;
- advanced leak detection;
- secret access monitoring;
- suspicious access detection;
- incident automation.

# 134. Phase 8 Requirements

Implement:

- production secret governance;
- formal access review;
- penetration testing;
- disaster recovery exercises;
- break-glass exercises;
- compromise/rotation exercises.

# 135. Open Questions

The following require final implementation decisions:

1. Which provider-neutral secret-store interface will be standardized?
2. Which managed secret service will be used in production?
3. Will KMS/HSM be mandatory for S3/S4 secrets?
4. Which secrets require hardware-backed storage?
5. What exact rotation periods apply to each secret class?
6. Will dynamic database credentials be used?
7. Which cloud workload identity mechanism will be used?
8. What exact OS keychain library will Studio use?
9. How will Linux headless deployments protect Lab Agent keys?
10. Will Lab Agent keys use TPM-backed storage?
11. What exact certificate authority architecture will be used?
12. What is the required secret-store availability target?
13. How will secret-store disaster recovery be performed?
14. What exact secret-scanning engine will be standardized?
15. What constitutes a confirmed versus suspected leak?
16. Which secrets require dual-control access?
17. What support personnel may access production secrets?
18. How will customer-owned integration secrets be isolated?
19. How long are revoked secret versions retained?
20. What compliance requirements apply to secret retention and destruction?

# 136. Acceptance Criteria: Classification

- [ ] All production secrets have classifications.
- [ ] Secret owners are recorded.
- [ ] Secret purpose is recorded.
- [ ] Environment is recorded.
- [ ] Rotation policy is recorded.
- [ ] Critical secrets are explicitly identified.
- [ ] Secret inventory exists.
- [ ] Unknown production secrets are investigated.

# 137. Acceptance Criteria: Storage

- [ ] Production secrets are stored in a managed secret system.
- [ ] Secrets are encrypted at rest.
- [ ] Critical keys use protected key management.
- [ ] Secrets are not stored in source control.
- [ ] Secrets are not stored in container images.
- [ ] Secrets are not stored in plaintext configuration.
- [ ] Secret-store access is audited.

# 138. Acceptance Criteria: Studio

- [ ] Studio uses the OS secure credential store.
- [ ] Refresh credentials are not stored in plaintext.
- [ ] Access tokens are short-lived.
- [ ] Device private keys remain local.
- [ ] Logout clears required local credentials.
- [ ] Studio does not package infrastructure secrets into `.krv`.
- [ ] Local build secrets remain local.

# 139. Acceptance Criteria: CI/CD

- [ ] CI uses dedicated identities.
- [ ] CI secrets are environment-specific.
- [ ] Production deployment credentials are protected.
- [ ] Untrusted pull requests do not receive production secrets.
- [ ] Secrets are masked in CI logs.
- [ ] CI scans source and generated output.
- [ ] Build secrets do not leak into artifacts or images.
- [ ] Deployment credentials can be rotated without source changes.

# 140. Acceptance Criteria: Injection

- [ ] Applications use secret references.
- [ ] Secrets are injected only when required.
- [ ] Secrets are not written unnecessarily to disk.
- [ ] Secret files use restrictive permissions.
- [ ] Environment injection is controlled.
- [ ] Runtime secrets are not included in artifacts.
- [ ] Secret-store failure does not trigger plaintext fallback.

# 141. Acceptance Criteria: Rotation

- [ ] Secrets support rotation.
- [ ] Critical secrets support emergency rotation.
- [ ] Rotation can occur without application source changes.
- [ ] Services support overlapping credentials where required.
- [ ] Old credentials are revoked.
- [ ] Rotation is audited.
- [ ] Failed rotation is detectable.
- [ ] Rotation status is observable.

# 142. Acceptance Criteria: Access

- [ ] Secret access is explicitly authorized.
- [ ] Service identities have least privilege.
- [ ] Human production access is restricted.
- [ ] Environment isolation is enforced.
- [ ] Secret access is auditable.
- [ ] Access reviews occur periodically.
- [ ] Unused secret access is removed.
- [ ] Cross-tenant secret access is impossible.

# 143. Acceptance Criteria: Lab

- [ ] Lab Agent private keys are protected locally.
- [ ] Lab Agent private keys are not uploaded.
- [ ] Bootstrap credentials are short-lived.
- [ ] Lab certificates can rotate.
- [ ] Lab certificates can be revoked.
- [ ] Robot credentials are isolated.
- [ ] Lab secrets are not included in `.krv`.
- [ ] Lab credential compromise can be contained.

# 144. Acceptance Criteria: Break-Glass

- [ ] Break-glass credentials are separately protected.
- [ ] Break-glass access requires strong authentication.
- [ ] Break-glass use is audited.
- [ ] Break-glass access is time limited.
- [ ] Break-glass use generates notification.
- [ ] Break-glass credentials rotate after use.
- [ ] Break-glass recovery is tested.

# 145. Acceptance Criteria: Leak Detection

- [ ] Pre-commit scanning exists.
- [ ] CI secret scanning exists.
- [ ] Repository scanning exists.
- [ ] Artifact scanning exists.
- [ ] High-confidence leaks fail appropriate pipelines.
- [ ] Production leaks trigger rotation.
- [ ] Secret values are redacted from logs.
- [ ] Historical exposure is investigated.
- [ ] Rescanning occurs after remediation.

# 146. Acceptance Criteria: Logging

- [ ] Passwords are not logged.
- [ ] Tokens are not logged.
- [ ] API keys are not logged.
- [ ] Private keys are not logged.
- [ ] Database passwords are not logged.
- [ ] Authorization headers are not logged.
- [ ] Crash reports are sanitized.
- [ ] Telemetry is sanitized.
- [ ] CI logs mask secrets.

# 147. Acceptance Criteria: Disaster Recovery

- [ ] Secret-store recovery is documented.
- [ ] Critical key recovery is documented.
- [ ] Break-glass recovery is documented.
- [ ] Backup access is protected.
- [ ] Recovery procedures are tested.
- [ ] Restored credentials are validated.
- [ ] Compromised credentials can be rotated after recovery.

# 148. Acceptance Criteria: Security Testing

- [ ] Secret storage tests pass.
- [ ] Secret injection tests pass.
- [ ] Rotation tests pass.
- [ ] Revocation tests pass.
- [ ] Leak detection tests pass.
- [ ] CI secret exposure tests pass.
- [ ] Studio keychain tests pass.
- [ ] Lab certificate tests pass.
- [ ] Break-glass tests pass.
- [ ] Cross-environment isolation tests pass.

# 149. Acceptance Criteria: Production Governance

- [ ] Production secret inventory is complete.
- [ ] Production secret owners are assigned.
- [ ] Access policies are reviewed.
- [ ] Rotation schedules are operational.
- [ ] Secret monitoring is operational.
- [ ] Leak detection is operational.
- [ ] Emergency rotation is tested.
- [ ] Break-glass access is tested.
- [ ] Privileged secret access is reviewed.
- [ ] Security incidents have documented response procedures.

# 150. Final Secrets Management Invariants

The following invariants are mandatory:

1. Secrets are never committed to source control.
2. Secrets are never intentionally logged.
3. Secrets are never included in customer `.krv` artifacts by default.
4. Production secrets are environment isolated.
5. Secret access is explicitly authorized.
6. Service identities receive only required secrets.
7. Human access to production secrets is exceptional.
8. Studio credentials use OS secure storage.
9. CI/CD credentials are isolated from untrusted workloads.
10. Lab Agent private keys remain protected on the Lab side.
11. Bootstrap credentials are short-lived.
12. Critical credentials can be revoked.
13. Critical credentials can be rotated.
14. Secret leaks trigger credential response, not merely file deletion.
15. Secret-store failure does not result in insecure fallback credentials.
16. Break-glass access is exceptional and audited.
17. Secret access is observable.
18. Secret inventories are maintained.
19. Expired and unused secrets are removed.
20. Backups containing secrets receive equivalent protection.
21. Secret metadata never exposes secret material.
22. Development credentials cannot silently access Production.
23. CI secrets cannot be exposed to untrusted pull requests.
24. Authentication and authorization credentials are distinct from physical
    robot safety controls.
25. Secret compromise shall be containable without requiring a full platform
    redeployment.

# 151. Final Secrets Architecture

    +-----------------------------------------------------------------------+
    |                         KRITVA RAAS                                  |
    +-----------------------------------------------------------------------+
                    |
          +---------+----------+
          |                    |
          v                    v
    Human / Studio       Machine / Service
          |                    |
          v                    v
    OS Keychain          Workload Identity
          |                    |
          +---------+----------+
                    |
                    v
          +---------------------+
          | Secret Authorization|
          +----------+----------+
                     |
                     v
          +---------------------+
          | Secret Manager      |
          +----------+----------+
                     |
          +----------+----------+
          |                     |
          v                     v
       KMS/HSM             Encrypted Store
          |                     |
          +----------+----------+
                     |
                     v
              Secret Versions
                     |
        +------------+-------------+
        |            |             |
        v            v             v
    Control Plane    CI/CD       Lab Agent
        |            |             |
        v            v             v
    Runtime      Deployment    Local Key Store
        |                          |
        v                          v
    Database / Storage         Robot / Runtime

Secret detection surrounds the lifecycle:

    Developer
       |
       v
    Pre-Commit Scan
       |
       v
    CI Scan
       |
       v
    Repository Scan
       |
       v
    Artifact Scan
       |
       v
    Runtime Monitoring
       |
       v
    Incident Response
       |
       v
    Revoke / Rotate / Rescan

The definitive secrets-management principle is:

> Kritva RaaS shall treat every credential, private key, token, certificate
> private key, API secret and infrastructure credential as a controlled
> security asset. Secrets shall be classified, stored in appropriate secure
> stores, accessed through explicit identity and authorization policy, injected
> only when required, rotated and revoked throughout their lifecycle, and
> continuously protected against accidental or malicious disclosure. RaaS
> Studio shall use the operating system's secure credential store, CI/CD shall
> use isolated short-lived credentials, Lab Agents shall protect private keys
> locally, and break-glass credentials shall remain exceptional, time-limited
> and fully audited. A leaked secret shall be treated as compromised and
> rotated or revoked rather than merely removed from the location where it was
> discovered.
