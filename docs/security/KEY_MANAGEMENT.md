# Kritva RaaS Key Management

## 1. Purpose

This document defines the production-grade cryptographic key-management
architecture for Kritva RaaS.

Key management protects the cryptographic roots used to establish trust,
protect data, authenticate services, sign artifacts, sign tokens, protect
certificates, and recover encrypted information.

The design establishes:

- key hierarchy;
- key ownership;
- key classification;
- KMS/HSM usage;
- artifact-signing keys;
- token-signing keys;
- encryption keys;
- certificate-authority keys;
- service keys;
- Lab Agent keys;
- key generation;
- key storage;
- key activation;
- key rotation;
- key revocation;
- key destruction;
- backup and escrow;
- cryptographic ceremonies;
- compromise response;
- audit and governance.

The key-management architecture shall remain provider-neutral while permitting
managed cloud KMS and HSM implementations.

## 2. Scope

This document covers keys used for:

- artifact signing;
- token signing;
- data encryption;
- database encryption;
- object-storage encryption;
- TLS/mTLS;
- Lab Agent certificates;
- certificate authorities;
- device identity;
- service authentication;
- key wrapping;
- backup protection;
- recovery;
- break-glass operations.

It applies to:

- RaaS Control Plane;
- RaaS Studio;
- CI/CD;
- cloud infrastructure;
- PostgreSQL;
- object storage;
- Lab Agents;
- laboratory infrastructure;
- execution infrastructure.

## 3. Non-Goals

This document does not define:

- general authentication;
- general authorization;
- password hashing;
- general secrets management;
- artifact package format;
- physical robot safety;
- detailed cryptographic algorithm research.

Those controls consume and depend upon keys governed by this document.

# 4. Key Management Principles

## 4.1 Root Trust

High-value trust shall originate from a small number of strongly protected
cryptographic roots.

## 4.2 Separation of Duties

A key used for one security purpose shall not automatically be reused for
another.

Examples:

    Artifact Signing Key
        X
        |-- Token Signing
        |-- Database Encryption
        |-- TLS Server Authentication

## 4.3 Least Privilege

Applications should use cryptographic operations through controlled interfaces
rather than obtaining unrestricted private-key material.

## 4.4 Hardware Protection

Critical private keys should be generated and protected in KMS/HSM-backed
systems where practical.

## 4.5 Key Non-Exportability

Root and high-value private keys should be non-exportable.

Preferred operation:

    Application
        |
        v
    KMS/HSM
        |
        v
    Sign / Decrypt / Wrap
        |
        v
    Result

rather than:

    KMS
      |
      v
    Export Private Key
      |
      v
    Application Memory

## 4.6 Cryptographic Agility

The architecture shall permit cryptographic algorithm replacement without
redesigning application authorization or artifact lifecycle.

# 5. Definitions

| Term | Definition |
|---|---|
| Root Key | Highest-trust key in a defined hierarchy |
| KEK | Key Encryption Key |
| DEK | Data Encryption Key |
| KMS | Key Management Service |
| HSM | Hardware Security Module |
| CA | Certificate Authority |
| Signing Key | Private key used to create signatures |
| Verification Key | Public key used to verify signatures |
| Key Version | Versioned cryptographic instance |
| Active Key | Key currently permitted for new operations |
| Retired Key | Key no longer used for new operations |
| Revoked Key | Key explicitly invalidated |
| Destroyed Key | Key material permanently destroyed |
| Escrow | Controlled recovery storage of key material |
| Ceremony | Controlled procedure for sensitive key operation |
| Key Custodian | Authorized person responsible for key governance |
| Envelope Encryption | Encryption of DEKs using KEKs |
| Rotation | Replacement of active key material |
| Cryptoperiod | Approved period during which a key may be used |

# 6. Key Classes

Kritva RaaS shall classify keys by impact.

| Class | Description | Protection |
|---|---|---|
| K0 | Non-sensitive public key | Normal distribution |
| K1 | Operational key | Managed secret storage |
| K2 | Restricted key | KMS/protected storage |
| K3 | Critical production key | KMS/HSM |
| K4 | Root trust key | HSM, strong ceremony |

Examples:

- public artifact verification key: K0;
- service TLS key: K1/K2;
- token signing key: K3;
- artifact root signing key: K3/K4;
- root CA key: K4;
- master encryption key: K4.

# 7. Key Inventory

Every production key shall have metadata:

    key_id
    key_class
    purpose
    algorithm
    environment
    owner
    status
    created_at
    activated_at
    rotation_policy
    expiration
    parent_key_id
    kms_reference
    hsm_reference
    last_used_at

Private key material shall not be included in inventory metadata.

# 8. Key Lifecycle

The standard lifecycle is:

    GENERATE
       |
       v
    REGISTER
       |
       v
    APPROVE
       |
       v
    ACTIVATE
       |
       v
    USE
       |
       v
    ROTATE
       |
       v
    RETIRE
       |
       v
    REVOKE
       |
       v
    DESTROY

Not every key follows the exact same sequence.

For example, encryption keys may remain available for decryption after
retirement until all protected data is migrated.

# 9. Key Hierarchy

The conceptual hierarchy is:

    Root of Trust
          |
          +--------------------+
          |                    |
          v                    v
       KMS/HSM             Root CA
          |
    +-----+------+-------------------+
    |            |                   |
    v            v                   v
 Artifact     Token              Encryption
 Signing      Signing            Hierarchy
    |            |                   |
    v            v                   v
 Artifact      Access             KEKs
 Signatures    Tokens               |
                                     v
                                    DEKs

Separate trust domains shall use separate key hierarchies where practical.

# 10. Root of Trust

The root of trust shall be established through:

- KMS/HSM root keys;
- protected CA keys;
- controlled signing roots;
- controlled administrative identities.

Root keys shall have the strongest protection and narrowest access.

# 11. Key Purpose Separation

Keys shall be purpose-bound.

Examples:

    artifact-signing
    token-signing
    database-encryption
    object-storage-encryption
    tls
    lab-ca
    device-identity

A key's purpose shall be represented in metadata and policy.

# 12. Environment Separation

Production keys shall be distinct from:

    Local
    Development
    Staging

Development keys must never be trusted by Production verification paths.

Production artifact verification shall not trust an arbitrary development
signing root.

# 13. Regional Separation

The initial architecture may use a single production trust domain.

Future multi-region deployments shall define whether keys are:

- globally shared;
- region-specific;
- replicated;
- independently rooted.

Active-active multi-region key use shall not be introduced without explicit
key-governance design.

# 14. KMS Architecture

KMS shall provide:

- key generation;
- key storage;
- access control;
- key versioning;
- cryptographic operations;
- rotation;
- audit;
- lifecycle state.

Conceptual:

    Workload Identity
          |
          v
       KMS API
          |
          v
      Key Policy
          |
          v
       Key Version
          |
          v
    Sign / Encrypt / Decrypt

# 15. HSM Architecture

HSM protection shall be considered mandatory for the highest-value roots.

Candidate HSM-protected keys:

- artifact root signing key;
- root CA key;
- critical token-signing root;
- master encryption root where required.

The exact HSM technology remains provider-neutral.

# 16. KMS versus HSM

| Requirement | KMS | HSM |
|---|---:|---:|
| Application encryption | Preferred | Optional |
| Envelope encryption | Preferred | Optional |
| Routine signing | Preferred | Preferred for high value |
| Artifact root signing | Preferred/HSM-backed | Strongly preferred |
| Root CA | HSM preferred | Strongly preferred |
| Token signing | KMS preferred | Required for highest assurance |
| Master root | KMS/HSM | Preferred |
| Lab private key | Local secure hardware/store | Where available |

# 17. Key Non-Exportability

The following keys should be non-exportable:

- production root keys;
- artifact root signing keys;
- production token signing roots;
- root CA keys;
- master encryption roots.

Cryptographic operations should occur within KMS/HSM.

# 18. Key Generation

Keys shall be generated using approved cryptographically secure mechanisms.

High-value keys shall be generated inside KMS/HSM where supported.

Human-generated key material is prohibited for production roots.

# 19. Public Key Distribution

Public keys may be distributed broadly when required for verification.

Public-key distribution shall still maintain:

- key ID;
- algorithm;
- purpose;
- validity;
- trust root;
- lifecycle status.

# 20. Key Identification

Every key shall have a stable key identifier.

Verification metadata should include:

    key_id
    algorithm
    key_version
    purpose

Key IDs shall not encode private information.

# 21. Artifact Signing Keys

Artifact signing establishes trust in `.krv` execution artifacts.

The signing hierarchy shall distinguish:

    Artifact Root
         |
         v
    Production Signing Key
         |
         v
    .krv Artifact

Development signing shall use a separate trust root.

# 22. Artifact Signing Architecture

    Build
      |
      v
    Package
      |
      v
    Hash / Canonicalize
      |
      v
    Signing Service
      |
      v
    KMS/HSM
      |
      v
    Signature
      |
      v
    Signed .krv

The build environment shall not receive unrestricted production signing private
keys.

# 23. Artifact Signing Service

Production signing should be isolated behind a dedicated signing interface.

Conceptual:

    signArtifact(
        artifactDigest,
        manifestDigest,
        signingPolicy
    )

The signing service shall verify:

- artifact identity;
- artifact policy;
- platform;
- environment;
- signer authorization;
- malware/policy scan result;
- signing-key status.

# 24. Artifact Signing Key Access

Production signing shall require:

- authorized service identity;
- approved artifact;
- approved policy;
- correct environment;
- active signing key.

A compromised build worker must not automatically obtain arbitrary signing
authority.

# 25. Artifact Key Rotation

Artifact signing keys shall support:

- active key;
- previous verification keys;
- future key;
- revoked key.

Example:

    K1 = retired, verification only
    K2 = active signing
    K3 = staged

# 26. Artifact Verification

Verification shall check:

    artifact digest
         +
    signature
         +
    key ID
         +
    trusted key
         +
    key status
         +
    artifact policy

A valid signature from an untrusted or revoked key shall not authorize
execution.

# 27. Artifact Signing Compromise

If an artifact signing key is compromised:

1. Revoke the key.
2. Stop new signing.
3. Identify affected artifacts.
4. Identify signing period.
5. Determine trusted/untrusted artifacts.
6. Issue replacement key.
7. Re-sign approved artifacts where required.
8. Update trust metadata.
9. Investigate execution history.

# 28. Token Signing Keys

Authentication tokens may be signed using dedicated token-signing keys.

Token-signing keys shall not be reused for artifact signing.

Conceptual:

    Token Service
         |
         v
    Token Signing Key
         |
         v
    Access Token
         |
         v
    API Verification

# 29. Token Key Rotation

Token signing shall support key overlap:

    Old Key -> verify existing tokens
    New Key -> sign new tokens

After the accepted verification period:

    Old Key -> retire/revoke

The overlap period shall align with maximum token lifetime.

# 30. Token Key Exposure

If a token signing private key is compromised:

- revoke the key;
- stop signing;
- invalidate affected token trust;
- rotate key;
- force reauthentication where required;
- investigate token issuance;
- update verification key sets.

# 31. Encryption Key Hierarchy

Envelope encryption is preferred:

    Master / KEK
          |
          v
    Encrypt DEK
          |
          v
    DEK
          |
          v
    Data

Applications may receive DEKs for short operations but should not receive
master KEKs.

# 32. Data Encryption Keys

DEKs should be generated per:

- object;
- logical dataset;
- tenant;
- database scope;

according to security and operational requirements.

DEKs shall be protected by KEKs.

# 33. Database Encryption

PostgreSQL encryption shall use managed infrastructure encryption where
available.

Additional application-level encryption may protect highly sensitive fields.

Database master encryption keys shall not be stored in application
configuration.

# 34. Object Storage Encryption

Object storage shall use managed encryption keys.

Sensitive customer objects should use tenant-aware key policies where
practical.

Artifact binaries and result files shall be encrypted at rest.

# 35. Tenant Encryption

The initial system may use shared infrastructure keys with strong tenant
authorization.

Higher-assurance tenants may later receive dedicated encryption keys.

Tenant-specific key architecture shall not weaken operational isolation.

# 36. Encryption Key Rotation

Encryption-key rotation shall distinguish:

- rotating the KEK;
- rotating DEKs;
- re-encrypting existing data.

KEK rotation may not require rewriting all data if encrypted DEKs are rewrapped.

# 37. Key Rotation Flow

    Existing DEK
        |
        v
    Old KEK
        |
        v
    Unwrap
        |
        v
    New KEK
        |
        v
    Rewrap DEK
        |
        v
    Store New Wrapped DEK

# 38. Key Destruction

Key destruction shall be irreversible where supported.

A key shall not be destroyed while required for:

- decrypting retained data;
- validating required historical artifacts;
- compliance evidence;
- active recovery.

Key destruction shall require explicit policy.

# 39. Cryptoperiod

Every key shall have an approved cryptoperiod.

The cryptoperiod depends on:

- key purpose;
- key strength;
- exposure surface;
- transaction volume;
- operational risk.

Critical signing keys should have shorter operational exposure and stronger
controls.

# 40. Key Rotation Triggers

Rotation may be triggered by:

- scheduled cryptoperiod;
- personnel change;
- compromise;
- algorithm change;
- environment change;
- certificate expiration;
- vendor incident;
- suspected unauthorized use.

# 41. Revocation

Keys shall support explicit revocation.

Revocation status shall be distributed to all relevant verification systems.

Examples:

    artifact verifier
    token verifier
    Lab Agent
    Control Plane
    certificate validator

# 42. Revocation versus Retirement

Retirement means:

> Do not use this key for new operations.

Revocation means:

> Treat this key as untrusted.

A retired artifact key may remain valid for historical verification.

A revoked artifact key may invalidate trust in associated artifacts depending on
the incident policy.

# 43. Key Backup

Backup requirements depend on key type.

Keys that can be regenerated should generally not be backed up as raw private
material.

Keys protecting irreplaceable encrypted data may require controlled backup.

# 44. Key Escrow

Escrow shall be used only when necessary.

Potential escrow candidates:

- critical recovery keys;
- certificate authority recovery material;
- encryption recovery keys.

Artifact signing keys should preferably remain non-exportable rather than being
placed into routine escrow.

# 45. Escrow Protection

Escrowed material shall have:

- separate access policy;
- stronger authentication;
- independent audit;
- encryption;
- restricted custodians;
- recovery procedure.

# 46. Escrow Separation

No single routine operator should normally be able to:

1. retrieve an escrowed root;
2. activate it;
3. use it without additional control.

High-value recovery should use separation of duties.

# 47. Key Ceremony

A key ceremony is a controlled procedure for creation or recovery of a
high-value key.

Examples:

- artifact root creation;
- root CA creation;
- master encryption root recovery;
- production trust-root migration.

# 48. Ceremony Participants

A ceremony may require:

- security owner;
- platform owner;
- operations representative;
- key custodians;
- auditor/witness where appropriate.

The exact quorum shall be defined by key class.

# 49. Ceremony Preparation

Before a ceremony:

- define objective;
- identify key purpose;
- identify participants;
- verify authorization;
- verify environment;
- verify hardware/software;
- prepare audit records;
- verify backup/recovery procedure;
- establish rollback plan.

# 50. Key Ceremony Procedure

Conceptual:

    Prepare
       |
       v
    Authenticate Participants
       |
       v
    Verify Environment
       |
       v
    Generate Key
       |
       v
    Verify Fingerprint
       |
       v
    Register Metadata
       |
       v
    Activate
       |
       v
    Verify Operation
       |
       v
    Record Evidence
       |
       v
    Close Ceremony

# 51. Ceremony Evidence

Evidence shall include:

- key ID;
- purpose;
- algorithm;
- participants;
- timestamp;
- environment;
- fingerprints;
- policy version;
- activation result;
- verification result.

Private key material shall never be included in the evidence.

# 52. Key Fingerprints

Public key fingerprints shall be verified during sensitive ceremonies.

The fingerprint should be independently calculated or validated.

Human verification shall use a representation resistant to transcription errors.

# 53. Root CA

If Kritva operates a private CA for Lab Agent identity, the root CA key shall
receive K4 classification.

Preferred hierarchy:

    Offline / Highly Protected Root CA
              |
              v
        Intermediate CA
              |
       +------+------+
       |             |
       v             v
    Lab Agent     Service TLS

The root CA should sign intermediates rather than individual Lab Agent
certificates.

# 54. Lab Agent Key Management

Lab Agent identity keys should be generated locally.

Preferred:

    Lab Agent
        |
        v
    Generate Private Key
        |
        v
    Create CSR
        |
        v
    CA
        |
        v
    Lab Agent Certificate

The private key shall never be transmitted to the Control Plane.

# 55. Device Keys

Device identity keys should be generated on the device.

Where available, TPM/secure-element-backed keys should be considered.

Private device keys should be non-exportable.

# 56. TLS Keys

TLS keys shall:

- use approved algorithms;
- have controlled certificate lifecycle;
- rotate before expiration;
- be stored securely;
- be revoked when compromised.

Server TLS keys and Lab Agent client keys shall have separate identities.

# 57. Service Authentication Keys

Service authentication keys shall use:

- workload identity where possible;
- mTLS where appropriate;
- short-lived tokens;
- KMS/HSM protection for long-lived private keys.

Shared service private keys are discouraged.

# 58. Backup and Restore

Key recovery shall be tested.

A backup that has never been restored shall not be considered a verified backup.

Recovery testing shall confirm:

- key availability;
- integrity;
- authorization;
- audit;
- ability to decrypt/sign as required.

# 59. Backup Separation

Production key backups shall not be stored solely in the same failure domain as
the primary key infrastructure.

The exact topology shall remain provider-neutral.

# 60. Recovery Key Access

Recovery access shall require:

- strong authentication;
- privileged authorization;
- quorum where required;
- explicit incident/recovery reason;
- audit.

# 61. Key Compromise

A suspected key compromise shall be treated as real until disproven.

Response:

    DETECT
      |
      v
    CONTAIN
      |
      v
    REVOKE
      |
      v
    ROTATE
      |
      v
    IDENTIFY IMPACT
      |
      v
    REVALIDATE TRUST
      |
      v
    RECOVER
      |
      v
    REVIEW

# 62. Artifact Key Compromise Response

Actions include:

- stop signing;
- revoke compromised key;
- freeze affected signing workflow;
- identify artifacts signed by key;
- determine exposure period;
- update trusted key set;
- issue replacement;
- revalidate artifacts;
- investigate executions.

# 63. Token Key Compromise Response

Actions include:

- stop token issuance using compromised key;
- revoke key;
- rotate signing key;
- invalidate affected sessions where required;
- require reauthentication;
- update verification keys;
- inspect authentication logs.

# 64. Encryption Key Compromise Response

Actions include:

- revoke/disable key according to data policy;
- determine affected encrypted data;
- rotate KEK/DEK;
- re-encrypt or rewrap;
- investigate unauthorized decryption;
- preserve evidence.

# 65. CA Key Compromise Response

CA compromise is critical.

Actions include:

1. Stop issuance.
2. Determine root/intermediate scope.
3. Revoke affected certificates.
4. Establish replacement CA hierarchy.
5. Re-enroll affected Lab Agents.
6. Update trust stores.
7. Investigate historical authentication.
8. Preserve incident evidence.

# 66. Key Compromise Notification

Notifications shall be based on impact.

Potential recipients:

- security team;
- operations;
- affected organization;
- platform administrators;
- lab administrators.

Customer notification shall not expose unnecessary internal security details.

# 67. Key Access Audit

KMS/HSM operations shall be audited.

Audit should capture:

    key_id
    principal
    operation
    environment
    timestamp
    result
    request_id

Private key material shall never be logged.

# 68. Key Usage Monitoring

Monitor:

- signing frequency;
- unusual signing volume;
- unexpected key consumers;
- failed operations;
- access from unexpected workloads;
- use of retired keys;
- use of revoked keys.

# 69. Signing Anomaly Detection

Examples:

    Normal:
        100 artifacts/hour

    Suspicious:
        10,000 artifacts/hour

Such anomalies should trigger investigation and potentially automatic signing
suspension.

# 70. Key Policy

Every high-value key shall have a key policy specifying:

- permitted principals;
- permitted operations;
- environment;
- purpose;
- rotation;
- revocation;
- backup;
- destruction.

# 71. Key Access Separation

Separate permission classes should exist for:

    key.read_metadata
    key.sign
    key.encrypt
    key.decrypt
    key.rotate
    key.revoke
    key.admin
    key.recover

Possession of one permission shall not imply all others.

# 72. Signing Authorization

Artifact signing should require both:

    artifact policy approval
           +
    signing key authorization

A caller cannot sign an arbitrary digest merely because it can invoke the
signing service.

# 73. Decryption Authorization

Decryption shall require:

- authorized principal;
- authorized resource;
- authorized purpose;
- active key;
- applicable data policy.

A KMS permission alone should not bypass application authorization.

# 74. Key Rotation Automation

Rotation should be automated where safe.

Automated rotation shall:

- create new version;
- validate;
- activate;
- migrate consumers;
- retire old version;
- verify operation;
- record audit.

# 75. Rotation Failure

If rotation fails:

- keep last known good key active where safe;
- alert operations;
- do not partially revoke the only working credential;
- prevent inconsistent key state;
- require remediation before final retirement.

# 76. Key State Machine

    CREATED
       |
       v
    ACTIVE
       |
       +----> ROTATING
       |          |
       |          v
       |        ACTIVE
       |
       v
    RETIRED
       |
       +----> REVOKED
       |
       v
    DESTROYED

Some key classes may transition directly from ACTIVE to REVOKED after
compromise.

# 77. Key Destruction Approval

Critical key destruction shall require explicit authorization.

Before destruction verify:

- no active dependency;
- no required historical verification;
- no required encrypted data;
- recovery evidence;
- approved destruction request.

# 78. Key Destruction Evidence

Record:

- key ID;
- key version;
- reason;
- authorized actor;
- timestamp;
- destruction status;
- dependent systems.

Do not record the private key.

# 79. Key and Artifact Retention

Artifact signatures may need historical verification.

Therefore:

    Active signing key
          |
          v
    Retired signing key
          |
          v
    Historical verification
          |
          v
    Destroy only when policy permits

Key destruction must not invalidate required historical security evidence.

# 80. Key and Token Retention

Token signing keys may be retained for verification until all tokens signed with
the key have expired, subject to compromise policy.

Compromised keys follow revocation policy instead.

# 81. Key and Encryption Retention

Encryption keys must remain available as long as required data remains
decryptable.

Data retention and key destruction policies shall therefore be coordinated.

# 82. Key and Backup Retention

Keys protecting backups shall remain available until the corresponding backups
expire, unless the backup is intentionally rendered inaccessible according to
approved destruction policy.

# 83. Key Inventory Reconciliation

Periodic reconciliation shall compare:

    Key Inventory
        |
        v
    KMS/HSM
        |
        v
    Deployed Consumers
        |
        v
    Certificate Stores
        |
        v
    Artifact Trust Stores

Unknown or orphaned keys shall be investigated.

# 84. Key Governance

A key owner shall be responsible for:

- purpose;
- access policy;
- cryptoperiod;
- rotation;
- incident response;
- retirement;
- destruction.

Security governance owns the overall policy.

# 85. Development Key Policy

Development keys may be less restrictive but shall remain isolated.

Development signing keys must never be trusted by production execution systems.

Development encryption keys must not protect production data.

# 86. Test Key Policy

Automated test keys shall be:

- synthetic;
- disposable;
- isolated;
- non-production.

Test keys should be regenerated automatically where practical.

# 87. CI Signing Policy

CI shall not receive unrestricted production signing keys.

Preferred:

    CI
      |
      v
    Build + Scan
      |
      v
    Signing Service
      |
      v
    KMS/HSM

The signing service performs policy validation before signing.

# 88. Production Signing Ceremony

Production signing-root activation shall require a controlled ceremony.

Minimum evidence:

- key fingerprint;
- key purpose;
- environment;
- participants;
- policy version;
- verification artifact;
- activation result.

# 89. Emergency Signing

Emergency signing shall be exceptional.

It shall require:

- privileged authorization;
- incident/change reference;
- explicit reason;
- enhanced audit;
- post-event review.

# 90. Key Separation Matrix

| Key | Artifact | Token | Encryption | TLS/CA |
|---|---:|---:|---:|---:|
| Artifact Signing | Yes | No | No | No |
| Token Signing | No | Yes | No | No |
| Encryption KEK | No | No | Yes | No |
| TLS | No | No | No | Yes |
| Root CA | No | No | No | CA |
| Lab Agent | No | No | No | Identity |

# 91. Provider-Neutral Interfaces

The system should expose interfaces such as:

    interface KeyProvider {
        generateKey()
        sign()
        verify()
        encrypt()
        decrypt()
        wrapKey()
        unwrapKey()
        rotate()
        revoke()
        getMetadata()
    }

Actual provider implementations remain infrastructure-specific.

# 92. Signing Interface

Conceptual:

    Signature sign(
        key_reference,
        algorithm,
        message_digest
    )

The implementation should prefer digest signing where the protocol defines a
canonical digest.

# 93. Encryption Interface

Conceptual:

    EncryptedData encrypt(
        key_reference,
        plaintext
    )

For large data, envelope encryption should be used rather than sending large
payloads directly through a KMS API.

# 94. Verification Interface

Verification should resolve:

    key_id
       |
       v
    trusted key registry
       |
       v
    key status
       |
       v
    algorithm policy
       |
       v
    signature verification

# 95. Key Registry

The platform should maintain a key registry containing non-secret metadata.

The registry shall distinguish:

- active;
- retired;
- revoked;
- destroyed.

The registry shall not become an alternate private-key store.

# 96. Trust Store

Verification components shall maintain trusted public-key information.

Examples:

- artifact verification;
- token verification;
- Lab Agent TLS;
- device authentication.

Trust-store updates shall be authenticated and version controlled.

# 97. Trust Store Rollout

A trust-store change should follow:

    Generate
       |
       v
    Validate
       |
       v
    Stage
       |
       v
    Deploy
       |
       v
    Verify
       |
       v
    Retire Old

# 98. Emergency Trust Update

Compromised keys require accelerated trust-store propagation.

Emergency revocation shall not wait for normal deployment cadence.

# 99. Offline Lab Considerations

Lab Agents may experience intermittent connectivity.

The system shall define:

- cached trusted keys;
- maximum trust-cache age;
- revocation propagation;
- behavior when trust status cannot be refreshed.

Cached trust shall not permit indefinite use of revoked credentials.

# 100. Cloud Outage

A cloud KMS outage shall not cause unsafe physical behavior.

Lab Agent/local runtime behavior shall follow explicit local safety policy.

No automatic use of fallback unprotected private keys is permitted.

# 101. Key Recovery

Recovery shall distinguish:

- recoverable key;
- regeneratable key;
- irreplaceable key;
- intentionally unrecoverable key.

Artifact signing keys may be regenerated only if trust transition and artifact
policy permit it.

Encryption keys protecting retained data may require recovery.

# 102. Key Escrow Decision

Escrow shall be decided per key class.

| Key Type | Escrow Recommendation |
|---|---|
| Public verification key | Not required |
| Ephemeral session key | No |
| Artifact signing key | Prefer non-exportable |
| Token signing key | Prefer non-exportable |
| Encryption root | Controlled recovery |
| Root CA | Controlled escrow/recovery |
| Lab private key | Local recovery policy |

# 103. Key Compromise Drills

Critical key compromise procedures shall be exercised periodically.

Exercises should include:

- artifact signing compromise;
- token signing compromise;
- CA compromise;
- encryption-key compromise;
- Lab Agent certificate compromise.

# 104. Security Review

Key-management architecture shall be reviewed:

- before production;
- after key hierarchy changes;
- after cryptographic algorithm changes;
- after KMS/HSM changes;
- after signing architecture changes;
- after key compromise;
- periodically during production.

# 105. Cryptographic Algorithm Governance

Algorithms shall be approved centrally.

The system shall maintain:

- approved algorithms;
- prohibited algorithms;
- minimum security levels;
- migration requirements.

Algorithms approaching end of support shall have migration plans.

# 106. Cryptographic Agility

Algorithm selection shall not be hard-coded into business logic.

Configuration should identify:

    purpose
    algorithm
    key_id
    version

Migration should permit coexistence of old and new verification keys during
transition.

# 107. Key Migration

Key migration shall follow:

    New Key
       |
       v
    Register
       |
       v
    Trust
       |
       v
    Dual Operation
       |
       v
    Migrate Consumers
       |
       v
    Retire Old
       |
       v
    Destroy/Retain

# 108. Audit Requirements

Key operations shall be audited:

- creation;
- activation;
- signing;
- encryption;
- decryption;
- rotation;
- revocation;
- recovery;
- destruction;
- trust-store modification.

# 109. Audit Protection

Key-management audit data shall be:

- append-oriented;
- access controlled;
- retained according to security policy;
- protected against unauthorized modification.

# 110. Monitoring

Key-management monitoring shall detect:

- unexpected signing;
- unexpected decrypt operations;
- unusual key usage;
- failed operations;
- use of retired keys;
- attempts to use revoked keys;
- unauthorized key-policy changes.

# 111. Key Usage Limits

Where supported, keys may have usage limits.

Examples:

- maximum signing operations;
- maximum decrypt operations;
- geographic/workload restriction;
- service identity restriction.

High-volume signing shall have anomaly detection even if hard limits are not
implemented.

# 112. Administrative Access

KMS/HSM administration shall be separate from application operations.

Normal application operators should not be able to:

- export root keys;
- change root policy;
- destroy critical keys;
- disable audit;
- alter trust roots.

# 113. Separation of Duties

For critical operations:

    Requestor
       |
       v
    Approver
       |
       v
    Operator / Automated System
       |
       v
    KMS/HSM
       |
       v
    Audit

The exact quorum depends on key class.

# 114. Emergency Key Access

Emergency access shall:

- require explicit incident reference;
- use strong authentication;
- be time limited;
- generate high-priority audit;
- require post-incident review.

# 115. Key Management Risks

| Risk | Mitigation |
|---|---|
| Root key theft | HSM/KMS + non-exportability |
| Signing key compromise | Isolation + rotation |
| Token key compromise | Key rotation + session invalidation |
| Encryption key loss | Controlled backup/recovery |
| CA compromise | Protected root + intermediates |
| Insider misuse | Separation of duties |
| Unauthorized signing | Signing service policy |
| Key destruction | Approval + dependency check |
| Rotation failure | Overlap + rollback |
| Stale trust store | Versioning + propagation |
| KMS outage | Safe fail-closed behavior |
| Backup exposure | Encrypted protected backup |
| Algorithm obsolescence | Crypto agility |

# 116. Phase Mapping

| Phase | Key Management Focus |
|---|---|
| Phase 0 | Key hierarchy and cryptographic policy |
| Phase 1 | Application/KMS foundation |
| Phase 2 | Encryption keys and TLS |
| Phase 3 | Token/service signing keys |
| Phase 4 | Artifact signing infrastructure |
| Phase 5 | Lab PKI and Lab Agent keys |
| Phase 6 | Device/robot key management |
| Phase 7 | Rotation, monitoring and compromise drills |
| Phase 8 | HSM hardening, ceremonies and formal validation |

# 117. Phase 0 Requirements

Define:

- key classes;
- hierarchy;
- purposes;
- owners;
- cryptoperiods;
- algorithms;
- KMS/HSM architecture;
- ceremony policy.

# 118. Phase 1 Requirements

Implement:

- KMS integration;
- key registry;
- environment separation;
- access policies;
- audit;
- application encryption foundations.

# 119. Phase 2 Requirements

Implement:

- database encryption;
- object-storage encryption;
- envelope encryption;
- TLS key management;
- encryption-key rotation.

# 120. Phase 3 Requirements

Implement:

- token signing keys;
- service authentication keys;
- verification-key distribution;
- token key rotation.

# 121. Phase 4 Requirements

Implement:

- artifact signing service;
- production signing key;
- signing authorization;
- artifact trust store;
- signing-key rotation;
- compromise response.

# 122. Phase 5 Requirements

Implement:

- Lab CA;
- Lab Agent certificates;
- Lab Agent private-key protection;
- certificate rotation;
- certificate revocation.

# 123. Phase 6 Requirements

Implement:

- device keys;
- robot credentials;
- secure-element/TPM integration where applicable;
- local operational key management.

# 124. Phase 7 Requirements

Implement:

- key monitoring;
- anomaly detection;
- automated rotation;
- key inventory reconciliation;
- compromise drills;
- recovery drills.

# 125. Phase 8 Requirements

Implement:

- HSM hardening;
- root-key ceremonies;
- formal key governance;
- backup/escrow validation;
- penetration testing;
- cryptographic algorithm review.

# 126. Open Questions

The following require final implementation decisions:

1. Which provider-neutral KMS interface will be standardized?
2. Which managed KMS will be used in Production?
3. Which keys require HSM protection?
4. Will artifact signing use dedicated HSM-backed keys?
5. Will token signing use KMS-managed asymmetric keys?
6. What exact artifact signing algorithm will be standardized?
7. What exact token signing algorithm will be standardized?
8. What encryption algorithms will be approved?
9. What exact cryptoperiod applies to each key class?
10. Will the root CA be offline or highly isolated?
11. What certificate authority implementation will be used?
12. Will Lab Agent keys use TPM/secure elements?
13. Which encryption keys require escrow?
14. What quorum is required for K4 ceremonies?
15. What is the approved emergency key-recovery process?
16. How will revoked keys propagate to disconnected labs?
17. How long will retired signing keys remain available for verification?
18. How will historical artifacts be verified after key retirement?
19. What exact HSM backup/recovery architecture will be used?
20. What compliance requirements apply to key ceremonies and custody?

# 127. Acceptance Criteria: Key Inventory

- [ ] Every production key has a unique key ID.
- [ ] Every key has a documented purpose.
- [ ] Every key has an owner.
- [ ] Every key has an environment.
- [ ] Every critical key has a classification.
- [ ] Rotation policy is recorded.
- [ ] Key status is tracked.
- [ ] KMS/HSM references are tracked.
- [ ] Private key material is excluded from inventory metadata.

# 128. Acceptance Criteria: Hierarchy

- [ ] Key hierarchy is documented.
- [ ] Root keys are separated by purpose.
- [ ] Artifact signing keys are separate.
- [ ] Token signing keys are separate.
- [ ] Encryption keys are separate.
- [ ] CA keys are separate.
- [ ] Development and production trust roots are separate.
- [ ] High-value root keys use strongest available protection.

# 129. Acceptance Criteria: KMS/HSM

- [ ] Production KMS is deployed.
- [ ] Critical keys use appropriate KMS/HSM protection.
- [ ] High-value private keys are non-exportable where supported.
- [ ] Key policies enforce least privilege.
- [ ] KMS operations are audited.
- [ ] HSM operations are audited where applicable.
- [ ] Key administration is separated from application operation.
- [ ] Key destruction requires explicit authorization.

# 130. Acceptance Criteria: Artifact Signing

- [ ] Artifact signing keys are separate from other purposes.
- [ ] Production signing keys are protected.
- [ ] Build workers do not receive unrestricted signing private keys.
- [ ] Signing requests are policy validated.
- [ ] Artifact digest is cryptographically bound to the signature.
- [ ] Signing key ID is included in verification metadata.
- [ ] Verification checks key status.
- [ ] Signing keys can rotate.
- [ ] Compromised signing keys can be revoked.
- [ ] A signing-key compromise response is documented and tested.

# 131. Acceptance Criteria: Token Signing

- [ ] Token signing keys are separate from artifact keys.
- [ ] Token keys are protected.
- [ ] Key IDs are published to verifiers.
- [ ] Key rotation supports overlap.
- [ ] Retired keys remain available only as policy requires.
- [ ] Compromised token keys can be revoked.
- [ ] Token compromise response can force reauthentication.

# 132. Acceptance Criteria: Encryption

- [ ] Encryption uses managed keys where appropriate.
- [ ] Envelope encryption is supported where appropriate.
- [ ] DEKs are protected by KEKs.
- [ ] Master keys are not stored in application configuration.
- [ ] Database encryption keys are protected.
- [ ] Object-storage encryption is protected.
- [ ] Encryption keys can rotate.
- [ ] Historical data remains decryptable according to retention policy.
- [ ] Key destruction does not accidentally destroy required data access.

# 133. Acceptance Criteria: CA and Lab

- [ ] Lab Agent keys are uniquely identified.
- [ ] Lab Agent private keys are generated locally where practical.
- [ ] Private keys are never transmitted unnecessarily.
- [ ] CA keys are strongly protected.
- [ ] Intermediate CA architecture is defined where applicable.
- [ ] Certificates can rotate.
- [ ] Certificates can be revoked.
- [ ] Trust-store updates are authenticated.
- [ ] CA compromise response is documented.

# 134. Acceptance Criteria: Rotation

- [ ] Routine rotation is automated where practical.
- [ ] Emergency rotation is supported.
- [ ] Rotation has rollback behavior.
- [ ] New keys are validated before activation.
- [ ] Old keys remain available only for required operations.
- [ ] Rotation is audited.
- [ ] Rotation failures are detectable.
- [ ] Application releases are not required for routine key rotation.

# 135. Acceptance Criteria: Revocation

- [ ] Keys can be revoked.
- [ ] Revocation status is propagated.
- [ ] Revoked signing keys cannot create trusted signatures.
- [ ] Revoked certificate keys cannot authenticate.
- [ ] Revocation behavior is tested.
- [ ] Offline Lab Agent revocation policy is documented.
- [ ] Emergency revocation can bypass normal deployment cadence.

# 136. Acceptance Criteria: Backup and Escrow

- [ ] Backup requirements are defined by key class.
- [ ] Critical recoverable keys have protected recovery mechanisms.
- [ ] Backup access is separately controlled.
- [ ] Escrow is used only where required.
- [ ] Escrow access requires strong authorization.
- [ ] Recovery procedures are documented.
- [ ] Restore procedures are tested.
- [ ] Backup integrity is verified.
- [ ] Backup copies receive equivalent protection.

# 137. Acceptance Criteria: Ceremonies

- [ ] Critical key ceremonies are documented.
- [ ] Ceremony participants are authorized.
- [ ] Separation of duties is enforced.
- [ ] Key fingerprints are verified.
- [ ] Ceremony evidence is recorded.
- [ ] Private key material is not included in evidence.
- [ ] Activation is independently verified.
- [ ] Ceremony records are retained.

# 138. Acceptance Criteria: Compromise

- [ ] Key compromise procedures exist.
- [ ] Artifact signing compromise is covered.
- [ ] Token signing compromise is covered.
- [ ] Encryption compromise is covered.
- [ ] CA compromise is covered.
- [ ] Lab Agent key compromise is covered.
- [ ] Emergency rotation is supported.
- [ ] Affected assets can be identified.
- [ ] Trust stores can be updated quickly.
- [ ] Compromise drills are performed.

# 139. Acceptance Criteria: Monitoring

- [ ] Key operations are audited.
- [ ] Unexpected signing is detectable.
- [ ] Unexpected decryption is detectable.
- [ ] Revoked-key use is detectable.
- [ ] Retired-key use is detectable.
- [ ] Key-policy changes are audited.
- [ ] High-risk key usage generates alerts.
- [ ] Key inventory reconciliation is performed.

# 140. Acceptance Criteria: Cryptographic Governance

- [ ] Approved algorithms are documented.
- [ ] Deprecated algorithms are documented.
- [ ] Cryptographic agility exists.
- [ ] Key purposes are explicit.
- [ ] Cryptoperiods are defined.
- [ ] Algorithm migration is planned.
- [ ] Security review occurs after cryptographic changes.

# 141. Acceptance Criteria: Production

- [ ] Production roots are isolated from Development.
- [ ] Production signing keys are protected.
- [ ] Production encryption keys are protected.
- [ ] Production token keys are protected.
- [ ] Root CA keys are protected.
- [ ] Key access is least privilege.
- [ ] Key rotation is operational.
- [ ] Key compromise procedures are tested.
- [ ] Backup/recovery is tested.
- [ ] Critical key ceremonies are operational.

# 142. Final Key Management Invariants

The following invariants are mandatory:

1. Keys are purpose-specific.
2. Production and Development trust roots are separated.
3. Critical private keys are protected by KMS/HSM or equivalent controls.
4. Root keys are non-exportable where technically possible.
5. Artifact signing keys are separate from token-signing keys.
6. Token-signing keys are separate from encryption keys.
7. CA keys are separate from application signing keys.
8. High-value keys have explicit owners.
9. High-value keys have defined cryptoperiods.
10. Key rotation does not require source-code changes.
11. Key compromise can trigger emergency revocation.
12. Retired keys are not automatically trusted for new operations.
13. Revoked keys are not trusted.
14. Encryption keys are retained only as long as required.
15. Historical verification requirements are considered before key destruction.
16. Critical recovery keys have controlled backup/recovery mechanisms.
17. High-value key operations are auditable.
18. Key ceremonies are documented and evidenced.
19. No application receives unrestricted root-key access.
20. Build workers do not receive unrestricted production artifact-signing keys.
21. Lab Agent private keys remain protected on the Lab side.
22. Private CA keys receive the strongest available protection.
23. Development keys cannot establish Production trust.
24. KMS/HSM failure cannot cause unsafe physical fallback behavior.
25. Cryptographic trust changes are versioned, auditable and recoverable.

# 143. Final Key Management Architecture

    +-----------------------------------------------------------------------+
    |                         ROOT OF TRUST                                |
    +-----------------------------------------------------------------------+
                              |
              +---------------+----------------+
              |                                |
              v                                v
         +---------+                       +---------+
         | KMS/HSM |                       | Root CA |
         +----+----+                       +----+----+
              |                                 |
       +------+------+                    +-----+------+
       |      |      |                    |            |
       v      v      v                    v            v
    Artifact Token Encryption          Intermediate  Device/Lab
    Signing  Signing Hierarchy             CA           Keys
       |       |        |
       |       |        +----> KEK
       |       |               |
       |       |               +----> DEK
       |       |
       |       +----> Access/Service Tokens
       |
       +----> Signed .krv Artifacts

    Artifact Flow:

    Build
      |
      v
    Scan / Policy
      |
      v
    Artifact Digest
      |
      v
    Signing Service
      |
      v
    KMS/HSM
      |
      v
    Signature
      |
      v
    Signed Artifact
      |
      v
    Verification
      |
      v
    Remote Execution

    Encryption Flow:

    Data
      |
      v
    DEK
      |
      v
    Encrypt Data
      |
      v
    Wrapped DEK
      |
      v
    KEK in KMS/HSM

    Lab Identity Flow:

    Lab Agent
      |
      v
    Local Key Generation
      |
      v
    CSR
      |
      v
    CA
      |
      v
    Certificate
      |
      v
    mTLS
      |
      v
    Control Plane

    Compromise Flow:

    Detect
      |
      v
    Identify Key
      |
      v
    Stop Use
      |
      v
    Revoke
      |
      v
    Rotate / Replace
      |
      v
    Update Trust
      |
      v
    Revalidate Assets
      |
      v
    Investigate
      |
      v
    Close Incident

The definitive key-management principle is:

> Kritva RaaS shall establish a purpose-separated, hierarchical cryptographic
> trust architecture in which critical keys are protected by KMS/HSM-backed
> infrastructure or equivalent hardware-protected mechanisms, high-value
> private keys are non-exportable wherever practical, artifact signing,
> token signing, encryption and certificate authority keys remain independent,
> and all key lifecycle operations are explicitly governed, auditable and
> reversible where operationally required. Production artifact signing shall
> occur through a controlled signing service rather than distributing signing
> private keys to build workers. Encryption shall use an appropriate
> envelope-key hierarchy, Lab Agent identity keys shall remain protected on
> the laboratory side, and compromise of any high-value key shall trigger a
> defined containment, revocation, rotation, trust-update and investigation
> procedure. Key destruction shall occur only after dependency and recovery
> requirements have been verified.
