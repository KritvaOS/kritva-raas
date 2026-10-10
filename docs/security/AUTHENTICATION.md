# Kritva RaaS Authentication

## 1. Purpose

This document defines the production-grade authentication architecture for
Kritva RaaS.

Authentication establishes the identity of:

- human users;
- organizations and administrators;
- RaaS Studio installations;
- API clients;
- service-to-service callers;
- Lab Agents;
- controlled robot/lab infrastructure.

Authentication is distinct from authorization.

Authentication answers:

> Who or what is making this request?

Authorization answers:

> Is that identity permitted to perform this operation?

The authentication architecture shall support:

- password login;
- enterprise SSO;
- multi-factor authentication;
- access tokens;
- refresh tokens;
- API keys;
- service identities;
- Lab Agent identities;
- mutual TLS;
- device/session binding;
- brute-force protection;
- account recovery;
- credential rotation;
- revocation;
- auditability.

The design shall remain provider-neutral and shall not make the RaaS product
dependent on a particular identity provider.

## 2. Scope

This document covers authentication for:

- RaaS Web Console;
- RaaS Studio;
- Control Plane APIs;
- WebSocket connections;
- service-to-service APIs;
- background workers;
- Lab Agents;
- laboratory infrastructure;
- future robot-side authenticated channels;
- administrative APIs;
- API keys;
- service accounts;
- session management;
- account recovery.

It also covers:

- credential lifecycle;
- token lifecycle;
- authentication events;
- authentication security monitoring;
- device/session controls;
- identity federation.

## 3. Non-Goals

This document does not define:

- detailed RBAC permissions;
- organization membership policy;
- project authorization;
- credit authorization;
- booking authorization;
- physical robot safety authorization;
- artifact security;
- source-code privacy.

Those are defined by their respective security and domain documents.

Authentication establishes trusted identity; it does not grant domain access.

## 4. Security Goals

The authentication system shall:

1. Authenticate users securely.
2. Support password authentication.
3. Support enterprise SSO.
4. Support MFA.
5. Protect credentials from disclosure.
6. Prevent credential stuffing.
7. Prevent brute-force attacks.
8. Protect sessions.
9. Protect access tokens.
10. Protect refresh tokens.
11. Support API keys for appropriate machine clients.
12. Support non-human service identities.
13. Support Lab Agent identity.
14. Support mutual TLS for Lab connectivity.
15. Support credential rotation.
16. Support credential revocation.
17. Support account recovery.
18. Detect suspicious authentication activity.
19. Maintain authentication audit records.
20. Minimize long-lived credentials.
21. Avoid storing plaintext passwords.
22. Fail securely during authentication infrastructure failures.

# 5. Authentication Principles

## 5.1 Strong Identity

Every authenticated request shall resolve to an authenticated principal.

A principal may be:

    USER
    SERVICE
    LAB_AGENT
    ADMINISTRATIVE_SERVICE
    DEVICE

## 5.2 Least Credential Lifetime

Credentials should be short-lived wherever practical.

Preferred pattern:

    Long-Lived Root Credential
             |
             v
    Short-Lived Access Token
             |
             v
    API Operation

Refresh tokens and machine credentials shall be separately protected.

## 5.3 Defense in Depth

Authentication shall combine:

- credential security;
- MFA;
- token validation;
- TLS;
- session controls;
- rate limiting;
- anomaly detection;
- revocation;
- audit.

## 5.4 Fail Closed

Unknown identity, invalid credential, expired token, invalid certificate, or
uncertain authentication state shall result in authentication failure.

# 6. Definitions

| Term | Definition |
|---|---|
| Principal | Authenticated human or machine identity |
| User | Human account |
| Service Identity | Non-human application identity |
| Lab Agent | Authenticated RaaS laboratory connector |
| Access Token | Short-lived credential used for API access |
| Refresh Token | Credential used to obtain a new access token |
| Session | Authenticated interaction context |
| API Key | Long-lived machine credential |
| MFA | Multi-factor authentication |
| SSO | Federated single sign-on |
| IdP | Identity Provider |
| OIDC | OpenID Connect |
| SAML | Security Assertion Markup Language |
| mTLS | Mutual TLS |
| Device Binding | Association of session/credential with a trusted device |
| Credential Rotation | Replacement of a credential |
| Revocation | Explicit invalidation of a credential |
| Recovery | Process for regaining account access |
| Token Family | Related sequence of rotated refresh tokens |
| Session ID | Identifier for an authenticated session |

# 7. Authentication Architecture

The conceptual architecture is:

    +-------------------+
    | User              |
    +---------+---------+
              |
              v
    +-------------------+
    | Web Console       |
    | / RaaS Studio     |
    +---------+---------+
              |
              v
    +-------------------+
    | Authentication    |
    | Service           |
    +----+---------+----+
         |         |
         |         +------------------+
         |                            |
         v                            v
    Password/MFA                    SSO IdP
         |                            |
         +-------------+--------------+
                       |
                       v
                Session / Tokens
                       |
                       v
                Control Plane API

Machine path:

    Service Identity
          |
          v
    Access Credential
          |
          v
    Control Plane API

Lab path:

    Lab Agent Certificate
          |
          | mTLS
          v
    Lab Gateway / Control Plane
          |
          v
    Authenticated Lab Agent Principal

# 8. Principal Types

| Principal | Authentication | Typical Use |
|---|---|---|
| User | Password/SSO + MFA | Console/Studio |
| Service Identity | Client credential | Backend service |
| API Client | API key or OAuth-style credential | Automation |
| Lab Agent | mTLS certificate | Lab connectivity |
| Administrative Service | Workload identity | Operations |
| Device | Device credential/certificate | Future device integration |

A principal shall have a unique immutable identity.

# 9. User Account Identity

A user account shall have:

- immutable user ID;
- normalized login identity;
- email address where applicable;
- authentication methods;
- account status;
- MFA status;
- recovery status;
- creation timestamp;
- last authentication timestamp;
- audit metadata.

Example:

    user_id = 01J...
    status = ACTIVE
    email = user@example.com
    mfa_enabled = true

The user ID shall not be reused.

# 10. Account States

Recommended user states:

    INVITED
    ACTIVE
    SUSPENDED
    LOCKED
    RECOVERY_REQUIRED
    DEACTIVATED

Execution authorization shall not be inferred from account state alone.

A suspended or deactivated user shall not authenticate successfully.

# 11. Password Authentication

Password authentication shall be supported for accounts where local credentials
are enabled.

Passwords shall:

- never be stored plaintext;
- never be logged;
- never be returned through an API;
- be stored using a modern password hashing algorithm;
- use a unique salt;
- support configurable work factors;
- be rehashed when policy requires.

Preferred algorithms include an approved memory-hard password hashing scheme.

# 12. Password Policy

The password policy shall prioritize resistance to guessing and credential
stuffing.

Requirements:

- minimum length shall be policy-controlled;
- common/breached passwords shall be rejected;
- password reuse controls should be implemented;
- passwords shall not be required to follow arbitrary complexity rules that
  encourage insecure user behavior;
- password reset shall invalidate appropriate sessions.

The exact password policy shall be configurable.

# 13. Password Reset

A password reset shall:

1. Verify possession of the recovery channel.
2. Issue a single-use reset credential.
3. Limit reset credential lifetime.
4. Invalidate the credential after use.
5. Rotate authentication state.
6. Notify the user.
7. Record the event.

Reset tokens shall not be included in logs.

# 14. Password Change

Authenticated users may change passwords subject to policy.

A password change should:

- require current authentication for normal changes;
- require reauthentication for sensitive accounts;
- invalidate or rotate sessions according to policy;
- preserve the current recovery mechanism;
- generate an audit event.

# 15. SSO

Kritva RaaS shall support enterprise SSO through provider-neutral federation.

Preferred protocols:

- OpenID Connect;
- SAML where required.

SSO authentication shall establish a RaaS user identity.

The external IdP remains responsible for primary enterprise credential
verification.

RaaS remains responsible for:

- session issuance;
- token security;
- authorization mapping;
- tenant association;
- audit;
- local account state.

# 16. OIDC Flow

Preferred browser flow:

    User
      |
      v
    RaaS
      |
      v
    Authorization Request
      |
      v
    Identity Provider
      |
      v
    User Authentication
      |
      v
    Authorization Code
      |
      v
    RaaS Callback
      |
      v
    Code Exchange
      |
      v
    Validate ID Token
      |
      v
    Resolve User
      |
      v
    Create RaaS Session

Authorization Code with PKCE shall be used for public clients.

# 17. SAML Flow

Where SAML is required:

    User
      |
      v
    RaaS
      |
      v
    Enterprise IdP
      |
      v
    Signed Assertion
      |
      v
    RaaS Assertion Validation
      |
      v
    User Mapping
      |
      v
    RaaS Session

SAML assertions shall be validated for:

- issuer;
- audience;
- signature;
- validity period;
- recipient;
- replay;
- subject.

# 18. SSO Account Linking

SSO identities shall map to a stable RaaS user identity.

Email address alone shall not be the sole identity-binding mechanism where
account takeover risk exists.

The mapping should use:

- provider identifier;
- issuer;
- subject;
- verified identity attributes.

Example:

    issuer + subject -> user_id

# 19. MFA

MFA shall be supported for local and, where policy permits, federated accounts.

Preferred methods include:

- passkeys/WebAuthn;
- authenticator-based TOTP;
- enterprise IdP MFA.

SMS should not be the preferred high-assurance factor.

# 20. MFA Enrollment

MFA enrollment shall require:

1. authenticated account;
2. step-up authentication where appropriate;
3. factor registration;
4. factor verification;
5. recovery-code generation;
6. audit event.

Recovery codes shall be displayed only when appropriate and shall be stored
securely.

# 21. WebAuthn / Passkeys

Where supported, passkeys should be the preferred phishing-resistant factor.

The system shall validate:

- credential ID;
- relying-party identity;
- origin;
- challenge;
- signature;
- user verification requirements.

Private keys remain on the user-controlled authenticator.

# 22. TOTP

TOTP may be supported as an authenticator factor.

TOTP secrets shall:

- be encrypted at rest;
- not be logged;
- not be exposed after enrollment;
- be rotated through re-enrollment.

# 23. MFA Recovery

Loss of a primary MFA device shall not automatically disable account security.

Recovery shall require stronger identity evidence or an administrator-controlled
recovery process.

Recovery events shall be high-priority security events.

# 24. Session Model

A successful authentication establishes a RaaS session.

The session shall have:

- session ID;
- user ID;
- authentication method;
- authentication assurance level;
- creation time;
- last activity;
- expiration;
- device context where available;
- revocation state.

# 25. Browser Session

The Web Console should use secure server-managed sessions or a carefully
designed token-based session architecture.

If cookies are used:

- Secure;
- HttpOnly;
- SameSite;
- appropriate domain/path scope

shall be configured.

Session identifiers shall be high entropy.

# 26. Studio Session

RaaS Studio is a native desktop application.

It shall avoid storing long-lived access tokens in plaintext configuration files.

Preferred approach:

    Studio
      |
      v
    OS Secure Credential Store
      |
      v
    Refresh Credential
      |
      v
    Short-Lived Access Token

Supported OS secure stores shall be used where available.

# 27. Access Tokens

Access tokens shall be:

- short-lived;
- audience restricted;
- scope limited;
- issuer validated;
- signature validated;
- expiration checked;
- not accepted after revocation where immediate revocation is required.

Recommended access-token lifetime shall be policy-controlled and typically short.

# 28. Access Token Claims

Conceptual claims:

    {
        "iss": "kritva-raas",
        "sub": "user-001",
        "aud": "raas-api",
        "exp": 1791540000,
        "iat": 1791539700,
        "jti": "token-001",
        "session_id": "session-001",
        "amr": ["pwd", "mfa"]
    }

Claims shall contain only information required for authentication and policy
evaluation.

# 29. Token Audience

Tokens shall be audience restricted.

A token issued for:

    raas-api

shall not automatically be accepted by:

    lab-agent-api
    internal-admin-api
    unrelated-service

Separate audiences reduce credential reuse.

# 30. Token Issuer

Every token shall identify its issuer.

The receiver shall validate:

- expected issuer;
- signature;
- key;
- audience;
- expiration;
- not-before;
- required claims.

# 31. Refresh Tokens

Refresh tokens shall:

- be long-lived only when necessary;
- be protected as high-value credentials;
- be stored securely;
- support rotation;
- support reuse detection;
- be associated with a session/device;
- be revocable.

Refresh tokens shall not be logged.

# 32. Refresh Token Rotation

Preferred model:

    Refresh Token R1
          |
          v
    Refresh Request
          |
          v
    Validate R1
          |
          v
    Issue Access Token
          |
          v
    Issue Refresh Token R2
          |
          v
    Invalidate R1

If R1 is used again after rotation, the token family should be treated as
compromised according to policy.

# 33. Refresh Token Reuse Detection

A replayed refresh token is a strong compromise indicator.

The system shall:

- identify token family;
- identify session;
- revoke affected token family;
- require reauthentication;
- record a security event.

# 34. Token Revocation

Tokens may be revoked because of:

- logout;
- password reset;
- account suspension;
- suspected compromise;
- MFA reset;
- administrator action;
- refresh-token reuse;
- security incident.

Short-lived access tokens reduce the revocation propagation window.

# 35. Token Storage

Browser:

- HttpOnly secure cookies where applicable.

Studio:

- OS credential/keychain storage.

Backend:

- secrets manager;
- encrypted configuration;
- workload identity.

Never store authentication tokens in:

- source control;
- application logs;
- analytics payloads;
- crash reports;
- telemetry.

# 36. API Keys

API keys shall be supported for appropriate machine-to-machine use cases.

They shall not be the preferred mechanism for interactive human login.

API keys shall have:

- key ID;
- secret;
- owner;
- scope;
- creation time;
- expiration;
- last-used timestamp;
- status;
- optional IP/network restrictions.

# 37. API Key Format

API keys should have a public identifier and secret component.

Conceptual:

    krv_live_<key-id>_<secret>

The server shall store only a secure representation of the secret where
practical.

The complete key should be shown only at creation.

# 38. API Key Lifecycle

    CREATE
      |
      v
    ACTIVE
      |
      +----> ROTATED
      |
      +----> SUSPENDED
      |
      +----> REVOKED
      |
      v
    EXPIRED

Revoked keys shall not become active again.

# 39. API Key Scope

API keys shall be least privilege.

Examples:

    artifact:upload
    artifact:read
    job:create
    job:read
    result:read

A key shall not automatically inherit all user privileges.

# 40. Service Identities

Backend components shall use service identities rather than user credentials.

Examples:

- API service;
- worker;
- result processor;
- notification service;
- billing integration;
- Lab Agent gateway.

Service identity shall have:

- immutable ID;
- environment;
- owner;
- allowed audiences;
- allowed operations;
- credential lifecycle.

# 41. Service Authentication

Preferred mechanisms:

- workload identity;
- short-lived service tokens;
- mTLS;
- provider-neutral service credentials.

Long-lived shared service passwords shall be avoided.

# 42. Service Token Audience

Service tokens shall be audience-specific.

Example:

    worker -> result-service

shall not automatically authorize:

    worker -> admin-service

# 43. Service Credential Rotation

Service credentials shall support:

- automated rotation;
- overlap period;
- old credential retirement;
- emergency revocation.

Credential rotation shall not require application source changes.

# 44. Lab Agent Identity

Every Lab Agent shall have a unique identity.

Example:

    lab_agent_id = lab-agent-001

The identity shall be bound to:

- organization/lab;
- environment;
- agent registration;
- certificate identity;
- status;
- provisioning metadata.

Lab Agent IDs shall never be reused.

# 45. Lab Agent Authentication

Lab Agents shall use mutual TLS for Control Plane connectivity.

Conceptual flow:

    Lab Agent
       |
       | Client Certificate
       v
    TLS Handshake
       ^
       | Server Certificate
       |
    Control Plane
       |
       v
    Certificate Validation
       |
       v
    Lab Agent Identity
       |
       v
    Authorization

# 46. mTLS Requirements

mTLS shall provide:

- server authentication;
- client authentication;
- encrypted transport;
- certificate identity;
- certificate expiration;
- certificate revocation or equivalent status;
- certificate rotation.

TLS 1.2+ should be supported, with modern TLS versions preferred.

# 47. Lab Certificate

The Lab Agent certificate shall identify the agent.

The certificate shall not contain unnecessary sensitive information.

Conceptual identity:

    URI SAN:
      spiffe://kritva.example/lab-agent/lab-agent-001

The exact identity format is implementation-specific.

# 48. Certificate Provisioning

Provisioning shall be secure.

Preferred flow:

    Lab Administrator
          |
          v
    Registration Request
          |
          v
    Approval / Enrollment
          |
          v
    Certificate Issuance
          |
          v
    Lab Agent
          |
          v
    mTLS Connection

Bootstrap credentials shall be short-lived or single-use where possible.

# 49. Lab Certificate Rotation

Certificates shall be rotated before expiration.

Preferred model:

    Current Certificate
          |
          v
    Obtain New Certificate
          |
          v
    Validate New Certificate
          |
          v
    Switch
          |
          v
    Retire Old Certificate

Rotation should not require physical access to the robot where avoidable.

# 50. Lab Agent Revocation

A Lab Agent shall be revocable.

Revocation may occur because of:

- device compromise;
- lab removal;
- certificate compromise;
- unauthorized configuration;
- hardware replacement.

A revoked Lab Agent shall fail authentication.

# 51. Device Binding

Device binding may associate a session with:

- Studio installation;
- operating-system device identifier;
- device-generated key;
- WebAuthn credential;
- cryptographic device identity.

Device binding shall not depend solely on easily spoofed hardware identifiers.

# 52. Studio Device Registration

For high-value operations, Studio may create a device key.

Conceptual:

    Studio
      |
      v
    Generate Device Key
      |
      v
    OS Secure Storage
      |
      v
    Register Public Key
      |
      v
    Device Identity

The private key shall remain local.

# 53. Device Trust

Device binding shall support:

- device registration;
- device naming;
- last-seen timestamp;
- revocation;
- reauthentication;
- security event logging.

Users should be able to see active devices/sessions.

# 54. Device Revocation

When a device is revoked:

- associated refresh tokens are revoked;
- new token issuance requires reauthentication;
- device-bound credentials become invalid;
- security event is recorded.

# 55. Step-Up Authentication

Sensitive operations should require recent strong authentication.

Examples:

- changing password;
- disabling MFA;
- creating API key;
- creating service identity;
- adding Lab Agent;
- rotating signing credentials;
- changing organization security settings;
- accessing sensitive administrative controls.

# 56. Authentication Assurance

The system should classify authentication assurance.

Example:

| Level | Example |
|---|---|
| AAL1 | Password |
| AAL2 | Password + MFA |
| AAL2+ | Phishing-resistant MFA |
| Service | Workload identity |
| Lab | mTLS |

High-risk operations should require stronger assurance.

# 57. Brute-Force Protection

The authentication service shall protect against:

- password guessing;
- credential stuffing;
- MFA guessing;
- token guessing;
- reset-token guessing;
- API-key guessing.

Controls include:

- rate limits;
- progressive delays;
- temporary lockout where appropriate;
- IP/network reputation;
- account-level controls;
- anomaly detection.

# 58. Login Rate Limiting

Rate limiting shall consider:

- account;
- IP address;
- device;
- authentication method;
- geographic/network risk where available.

Rate limiting shall not allow an attacker to trivially lock out another user's
account.

# 59. Credential Stuffing

The system should detect patterns such as:

- many accounts from one source;
- one credential across many accounts;
- repeated failures with known breached passwords;
- abnormal login velocity.

Responses may include:

- increased challenge;
- temporary block;
- MFA requirement;
- security notification.

# 60. MFA Brute Force

MFA attempts shall be rate-limited separately from password attempts.

Repeated failed MFA shall result in:

- temporary protection;
- security event;
- session challenge reset.

# 61. API Key Abuse Protection

API keys shall have:

- request rate limits;
- scope restrictions;
- expiration where appropriate;
- anomaly detection;
- revocation.

API key secrets shall never appear in logs.

# 62. Login Enumeration Protection

Authentication APIs shall avoid revealing whether an account exists.

For example, password login failures should use a generic response:

    INVALID_CREDENTIALS

rather than:

    USER_NOT_FOUND

Recovery flows shall use similar enumeration-resistant responses.

# 63. Authentication Errors

Error messages shall not disclose:

- password validity separately from account existence;
- internal identity-provider details;
- token values;
- secrets;
- certificate private-key information.

Detailed diagnostics remain server-side.

# 64. Session Fixation

The system shall prevent session fixation.

After successful authentication:

- issue a new session;
- rotate session identifier;
- discard unauthenticated session credentials.

# 65. Session Timeout

Sessions shall have:

- idle timeout;
- absolute timeout;
- optional reauthentication timeout.

Security-sensitive sessions should use shorter limits.

# 66. Logout

Logout shall:

- terminate the current session;
- revoke/rotate refresh credentials;
- clear browser session state;
- remove local session state where applicable.

For Studio, logout shall clear active authentication state while retaining only
securely stored credentials explicitly intended for future login.

# 67. Global Logout

Users and administrators should be able to invalidate:

- current session;
- all sessions;
- selected devices.

Password reset and account compromise response shall support global session
revocation.

# 68. Session Concurrency

The system may permit multiple sessions.

Users should be able to see:

- device;
- approximate login context;
- last activity;
- authentication method;
- session creation time.

High-risk accounts may have configurable session limits.

# 69. WebSocket Authentication

WebSocket connections shall authenticate before accepting application traffic.

The connection shall be associated with:

- principal;
- session;
- organization;
- authorization context.

Expired/revoked authentication shall cause the connection to close or require
reauthentication according to protocol policy.

# 70. API Authentication

API requests shall carry authentication through an approved mechanism.

Conceptual:

    Authorization: Bearer <access-token>

The API shall validate:

- token format;
- signature;
- issuer;
- audience;
- expiration;
- principal;
- session;
- required authentication assurance.

# 71. Authentication Middleware

All protected APIs shall pass through centralized authentication middleware.

The middleware shall produce a normalized principal:

    Principal {
        principal_id
        principal_type
        authentication_method
        assurance_level
        session_id
        scopes
        issued_at
        expires_at
    }

# 72. Authorization Boundary

Authentication middleware shall not directly implement business authorization.

The sequence is:

    Request
      |
      v
    Authentication
      |
      v
    Principal
      |
      v
    Authorization
      |
      v
    Domain Service
      |
      v
    Repository

# 73. Authentication Events

Authentication events shall include:

- login success;
- login failure;
- logout;
- MFA enrollment;
- MFA failure;
- password change;
- password reset;
- SSO login;
- API key creation;
- API key revocation;
- service identity creation;
- Lab Agent enrollment;
- certificate rotation;
- device registration;
- session revocation.

# 74. Audit Data

Authentication audit records should contain:

    event_id
    principal_id
    principal_type
    authentication_method
    outcome
    timestamp
    request_id
    session_id
    device_id
    source_context

Audit records shall not contain:

- passwords;
- access tokens;
- refresh tokens;
- API key secrets;
- private keys;
- MFA secrets.

# 75. Suspicious Login Detection

The system should detect:

- impossible travel where meaningful;
- abnormal login velocity;
- new device;
- repeated failures;
- unusual authentication method;
- unexpected country/network;
- API key behavior anomalies.

Detection should generate a security event rather than automatically blocking all
activity without policy.

# 76. Authentication Notifications

Users should receive notifications for significant events:

- new device;
- password reset;
- MFA change;
- API key creation;
- service identity creation;
- suspicious login;
- global logout;
- account recovery.

Notifications shall not contain credentials.

# 77. Account Recovery

Account recovery shall be treated as an authentication flow, not a support
shortcut.

Recovery shall use one or more:

- verified email;
- authenticator recovery code;
- passkey;
- enterprise IdP recovery;
- administrator-approved recovery;
- organization-managed identity process.

# 78. Recovery Risk

Account recovery is equivalent to authentication.

Therefore:

> Weak recovery can defeat strong authentication.

Recovery shall have security controls comparable to login.

# 79. Recovery Token

Recovery tokens shall be:

- cryptographically random;
- single-use;
- short-lived;
- bound to recovery intent;
- rate-limited;
- invalidated after use.

They shall never be logged.

# 80. Recovery Notifications

A recovery request shall generate a notification.

Successful recovery should generate a separate notification.

Where possible, users should be warned about unexpected recovery requests.

# 81. Administrator Recovery

Administrators may initiate recovery only under explicit authorization.

Administrator recovery shall:

- require privileged authentication;
- be auditable;
- notify the user;
- avoid revealing the old password;
- invalidate appropriate sessions.

# 82. Enterprise SSO Recovery

For SSO-managed users, RaaS should defer primary credential recovery to the
enterprise IdP.

RaaS shall still manage:

- local sessions;
- local account state;
- device sessions;
- RaaS MFA where applicable;
- audit.

# 83. Account Locking

Account locking shall be carefully designed.

Hard permanent lockout shall not be the default response to repeated password
failures because it can enable denial-of-service against legitimate users.

Preferred controls:

- progressive delay;
- risk-based challenges;
- temporary restrictions;
- anomaly detection.

# 84. Credential Breach Response

If a credential is suspected compromised:

1. Revoke affected credentials.
2. Invalidate sessions.
3. Require reauthentication.
4. Reset password where applicable.
5. Reset MFA if compromised.
6. Rotate API keys if affected.
7. Notify user.
8. Record incident.
9. Investigate associated activity.

# 85. API Key Exposure Response

If an API key is exposed:

    Detect
      |
      v
    Revoke
      |
      v
    Investigate usage
      |
      v
    Issue replacement
      |
      v
    Update client
      |
      v
    Verify old key inactive

# 86. Lab Certificate Compromise

If a Lab Agent certificate is compromised:

1. Revoke the agent identity/certificate.
2. Block mTLS.
3. Identify associated lab/resource activity.
4. Investigate recent commands.
5. Issue a new certificate.
6. Re-register if required.
7. Verify agent software state.

# 87. Authentication Secret Management

Secrets shall be stored using:

- OS secure storage for desktop credentials;
- managed secret stores for server credentials;
- protected key storage for certificates;
- secure database encryption where appropriate.

Secrets shall not be stored in:

- Git;
- source files;
- container images;
- plain configuration;
- logs;
- telemetry.

# 88. Environment Isolation

Authentication credentials shall be environment-specific.

Separate:

    Local
    Development
    Staging
    Production

credentials shall be used.

Development credentials shall never authenticate to Production.

# 89. Production Identity Separation

Production services shall use production-specific identities.

A developer credential shall not automatically have production service identity
privileges.

# 90. Authentication Availability

Authentication is a critical dependency.

The system shall define behavior for IdP/authentication-service outages.

Default:

- existing valid short-lived sessions may continue until expiration;
- new authentication may be unavailable;
- sensitive operations may require fresh authentication;
- Lab Agents may continue according to explicit local policy.

# 91. Lab Connectivity During Cloud Outage

Cloud authentication failure shall not create unsafe robot behavior.

The Lab Agent and local safety system shall determine:

- whether existing execution may continue;
- whether new execution is allowed;
- whether safe shutdown is required.

Physical safety remains local.

# 92. Certificate Trust Store

The Lab Agent shall validate the Control Plane server certificate against an
explicit trust policy.

Trust shall not be based solely on:

- hostname;
- unverified certificate;
- user confirmation.

# 93. Certificate Pinning

Strict public-key/certificate pinning may be used where operationally justified.

If implemented, rotation and emergency recovery procedures are mandatory.

The design shall avoid making routine certificate rotation unsafe.

# 94. Service-to-Service TLS

Internal service traffic shall use authenticated transport.

Where practical:

- TLS;
- mTLS;
- workload identity;

shall be used.

Internal network location shall not itself be treated as authentication.

# 95. Authentication Replay Protection

The system shall mitigate replay of:

- authorization codes;
- refresh tokens;
- reset tokens;
- enrollment tokens;
- bootstrap credentials.

Controls include:

- nonce;
- PKCE;
- short expiration;
- one-time use;
- token rotation;
- server-side state.

# 96. CSRF Protection

Browser authentication flows shall implement CSRF protection.

OIDC state and nonce mechanisms shall be validated.

Cookie-based authenticated APIs shall use appropriate CSRF controls.

# 97. OAuth/OIDC Redirect Security

Allowed redirect URIs shall be explicitly registered.

The system shall reject arbitrary redirect URIs.

Open redirect behavior shall not be introduced into authentication flows.

# 98. Authentication API Rate Limits

Recommended initial categories:

| Endpoint | Protection |
|---|---|
| Login | Strict |
| MFA verify | Strict |
| Password reset request | Strict |
| Password reset confirm | Strict |
| Token refresh | Strict |
| API key creation | Authenticated + step-up |
| Lab enrollment | Very strict |
| Certificate renewal | Strict |
| SSO callback | Protocol-specific |

Exact limits shall be tuned using operational data.

# 99. Authentication Data Model

The Identity domain should own:

- users;
- authentication methods;
- sessions;
- refresh-token families;
- API keys;
- service identities;
- device registrations;
- Lab Agent identities;
- certificates;
- recovery records.

Credential secrets shall not be stored in plaintext.

# 100. Authentication and Organization

Organization membership is separate from authentication.

A user can authenticate successfully while having no access to a particular
organization.

The authorization layer determines organization membership.

# 101. Authentication and Projects

Project access shall not be inferred from successful login.

The authenticated principal is passed to project authorization.

# 102. Authentication and Artifacts

Authentication establishes the identity requesting:

- artifact upload;
- artifact download;
- artifact deletion;
- artifact execution.

Artifact authorization remains a domain responsibility.

# 103. Authentication and Booking

Authentication establishes the identity requesting:

- availability;
- booking;
- cancellation;
- execution.

Booking policy determines whether the authenticated principal may perform the
operation.

# 104. Authentication and Credits

Authentication establishes the actor.

Credit services determine whether that actor is authorized to operate on the
organization wallet.

# 105. Authentication Interfaces

## 105.1 Login

Conceptual interface:

    POST /auth/login

Request:

    {
        "identifier": "user@example.com",
        "password": "<secret>"
    }

Response shall not expose the password or internal credential details.

## 105.2 Token Refresh

    POST /auth/token/refresh

Request contains the refresh credential through the approved secure mechanism.

Response:

    {
        "access_token": "<short-lived-token>",
        "token_type": "Bearer",
        "expires_in": 900
    }

Refresh credentials shall not be returned unnecessarily.

# 106. Logout Interface

    POST /auth/logout

The operation invalidates the appropriate session/token state.

# 107. MFA Interface

Conceptual:

    POST /auth/mfa/verify

The request shall include only the required challenge response.

MFA secrets shall never be returned.

# 108. API Key Interface

Conceptual:

    POST /auth/api-keys

The response may show the complete key once.

Subsequent retrieval shall return only:

    key_id
    status
    scopes
    created_at
    expires_at
    last_used_at

# 109. Lab Enrollment Interface

Conceptual:

    POST /auth/lab-agents/enroll

Enrollment shall require:

- authorized actor;
- enrollment credential;
- Lab Agent identity;
- certificate issuance policy.

Enrollment credentials shall be short-lived.

# 110. Certificate Renewal

Conceptual:

    POST /auth/lab-agents/{id}/certificate/renew

The Lab Agent shall already possess valid credentials sufficient for renewal.

Emergency recovery shall require separate authorization.

# 111. Device Registration

Conceptual:

    POST /auth/devices

The request may contain:

- device public key;
- device metadata;
- installation identity.

The private key shall remain on the device.

# 112. Authentication Middleware Contract

Every protected API shall receive:

    Principal {
        principal_id
        principal_type
        authentication_method
        assurance_level
        session_id
        scopes
    }

If authentication fails:

    HTTP 401

Authorization failure:

    HTTP 403

The distinction shall be consistent across APIs.

# 113. Authentication Error Codes

Recommended codes:

    AUTH_INVALID_CREDENTIALS
    AUTH_TOKEN_EXPIRED
    AUTH_TOKEN_INVALID
    AUTH_TOKEN_REVOKED
    AUTH_MFA_REQUIRED
    AUTH_MFA_FAILED
    AUTH_SESSION_REVOKED
    AUTH_API_KEY_INVALID
    AUTH_API_KEY_REVOKED
    AUTH_CERTIFICATE_INVALID
    AUTH_CERTIFICATE_REVOKED
    AUTH_ACCOUNT_SUSPENDED
    AUTH_RECOVERY_INVALID
    AUTH_RATE_LIMITED

# 114. Security Logging

Authentication logs shall be structured.

Example:

    {
        "event": "auth.login",
        "principal_id": "user-001",
        "method": "password_mfa",
        "outcome": "SUCCESS",
        "timestamp": "...",
        "request_id": "req-001"
    }

Secrets shall never be logged.

# 115. Authentication Metrics

Recommended metrics:

| Metric | Purpose |
|---|---|
| Login success rate | Availability |
| Login failure rate | Attack detection |
| MFA failure rate | Abuse detection |
| Token refresh failure | Session health |
| API key creation | Credential monitoring |
| API key usage | Machine identity monitoring |
| Certificate failure | Lab health |
| Recovery requests | Account abuse |
| Account lock events | Security monitoring |
| Suspicious login events | Threat detection |

# 116. Security Alerts

High-priority alerts should include:

- suspected credential stuffing;
- refresh-token reuse;
- signing/authentication key compromise;
- mass authentication failures;
- mass API-key creation;
- unexpected Lab Agent certificate activity;
- abnormal service identity use.

# 117. Authentication Testing

Testing shall include:

- unit tests;
- integration tests;
- protocol tests;
- browser tests;
- Studio tests;
- API tests;
- mTLS tests;
- abuse tests;
- recovery tests;
- concurrency tests.

# 118. Password Tests

Tests shall verify:

- plaintext passwords are never stored;
- weak passwords are rejected;
- password hashing works;
- password reset works;
- reset tokens expire;
- reset tokens are single-use;
- password change invalidates required sessions.

# 119. SSO Tests

Tests shall verify:

- valid OIDC login;
- invalid issuer;
- invalid audience;
- invalid signature;
- expired assertion;
- replay;
- invalid redirect;
- PKCE enforcement;
- identity mapping.

# 120. MFA Tests

Tests shall verify:

- enrollment;
- successful verification;
- failed verification;
- rate limiting;
- recovery codes;
- MFA reset;
- step-up authentication.

# 121. Token Tests

Tests shall verify:

- signature;
- issuer;
- audience;
- expiration;
- not-before;
- token rotation;
- refresh-token reuse detection;
- session revocation;
- malformed tokens.

# 122. API Key Tests

Tests shall verify:

- creation;
- scope;
- authentication;
- expiration;
- rotation;
- revocation;
- secret non-retrievability;
- rate limiting.

# 123. mTLS Tests

Tests shall verify:

- valid server certificate;
- valid client certificate;
- invalid certificate;
- expired certificate;
- revoked certificate;
- wrong identity;
- certificate rotation;
- unknown CA;
- hostname validation.

# 124. Device Binding Tests

Tests shall verify:

- device registration;
- device-key proof;
- device revocation;
- session revocation after device compromise;
- multiple devices;
- replacement device.

# 125. Recovery Tests

Tests shall verify:

- valid recovery;
- expired recovery;
- reused recovery;
- invalid recovery;
- notification;
- session invalidation;
- rate limiting;
- administrator recovery audit.

# 126. Brute-Force Tests

Tests shall simulate:

- password guessing;
- distributed credential stuffing;
- MFA guessing;
- recovery-token guessing;
- API-key guessing.

Expected outcome:

- requests are rate-limited;
- account enumeration is minimized;
- successful credentials remain protected.

# 127. Lab Agent Tests

Tests shall verify:

- unique Lab Agent identity;
- certificate enrollment;
- mTLS;
- certificate renewal;
- certificate revocation;
- wrong-agent rejection;
- cross-environment rejection.

# 128. Service Identity Tests

Tests shall verify:

- service authentication;
- audience restriction;
- scope restriction;
- credential rotation;
- revocation;
- environment separation.

# 129. Authentication Security Review

Security review shall verify:

- password storage;
- token handling;
- session lifecycle;
- MFA;
- SSO;
- API keys;
- service identities;
- Lab Agent mTLS;
- recovery;
- rate limiting;
- audit;
- monitoring.

# 130. Phase Mapping

| Phase | Authentication Focus |
|---|---|
| Phase 0 | Identity architecture and security baseline |
| Phase 1 | User login and sessions |
| Phase 2 | Organization identity integration |
| Phase 3 | API/service authentication and Studio credentials |
| Phase 4 | MFA, API keys and stronger assurance |
| Phase 5 | Execution authentication and Lab Agent mTLS |
| Phase 6 | Device identity and lab operational identity |
| Phase 7 | Security monitoring, audit and recovery hardening |
| Phase 8 | Production identity governance and penetration testing |

# 131. Phase 0 Requirements

Phase 0 shall define:

- principal model;
- authentication boundary;
- credential policy;
- identity ownership;
- environment separation;
- audit requirements.

# 132. Phase 1 Requirements

Phase 1 shall implement:

- user registration/invitation;
- password authentication;
- basic sessions;
- logout;
- password reset;
- authentication audit.

# 133. Phase 2 Requirements

Phase 2 shall implement:

- organization identity;
- SSO integration;
- user identity mapping;
- account lifecycle;
- session/device visibility.

# 134. Phase 3 Requirements

Phase 3 shall implement:

- access tokens;
- refresh tokens;
- Studio credential storage;
- API authentication;
- service identities;
- token rotation.

# 135. Phase 4 Requirements

Phase 4 shall implement:

- MFA;
- passkeys/TOTP;
- API keys;
- step-up authentication;
- stronger administrative authentication.

# 136. Phase 5 Requirements

Phase 5 shall implement:

- Lab Agent identity;
- mTLS;
- certificate provisioning;
- certificate rotation;
- certificate revocation;
- execution authentication.

# 137. Phase 6 Requirements

Phase 6 shall implement:

- device binding;
- resource-level identity;
- lab identity hardening;
- offline/cloud-outage behavior;
- hardware authentication integration where required.

# 138. Phase 7 Requirements

Phase 7 shall implement:

- authentication monitoring;
- anomaly detection;
- security alerts;
- comprehensive audit;
- incident response integration.

# 139. Phase 8 Requirements

Phase 8 shall implement:

- formal identity governance;
- credential rotation automation;
- penetration testing;
- recovery exercises;
- certificate compromise exercises;
- production access review;
- authentication security review.

# 140. Threats and Mitigations

| Threat | Mitigation |
|---|---|
| Password guessing | Rate limiting + strong hashing |
| Credential stuffing | Detection + MFA + throttling |
| Token theft | Short lifetime + secure storage |
| Refresh replay | Rotation + reuse detection |
| API key leakage | Scoping + rotation + revocation |
| Session hijacking | Secure cookies/tokens + TLS |
| MFA bypass | Strong factor + recovery controls |
| SSO assertion forgery | Signature validation |
| Lab Agent impersonation | mTLS |
| Certificate theft | Rotation + revocation |
| Device compromise | Device revocation |
| Recovery abuse | Strong recovery + notifications |
| Service credential theft | Workload identity + rotation |
| Enumeration | Generic errors |
| DoS via lockout | Progressive controls |

# 141. Residual Risks

Authentication cannot completely prevent:

- compromised endpoint;
- stolen authenticated session;
- compromised IdP;
- compromised administrator;
- malware on developer machine;
- compromised Lab Agent host;
- browser vulnerabilities;
- undiscovered cryptographic vulnerabilities.

These risks require:

- endpoint security;
- monitoring;
- short credential lifetimes;
- least privilege;
- rapid revocation;
- incident response.

# 142. Authentication Incident Response

An authentication incident shall trigger:

1. Identify affected principal.
2. Identify affected credentials.
3. Revoke credentials.
4. Revoke sessions.
5. Rotate secrets if necessary.
6. Review authentication logs.
7. Identify affected operations.
8. Identify affected tenants/resources.
9. Notify affected parties where required.
10. Remediate.
11. Add regression tests.

# 143. Credential Compromise Runbook

    Suspected Compromise
          |
          v
    Identify Credential
          |
          v
    Revoke Credential
          |
          v
    Revoke Sessions
          |
          v
    Review Audit
          |
          v
    Determine Impact
          |
          v
    Rotate Credential
          |
          v
    Restore Access
          |
          v
    Monitor

# 144. Security Review Cadence

Authentication shall be reviewed:

- on every authentication architecture change;
- on new authentication protocols;
- on new identity-provider integration;
- after credential incidents;
- after certificate incidents;
- quarterly during active development;
- annually after production stabilization.

# 145. Open Questions

The following require final implementation decisions:

1. Which OIDC providers will be supported initially?
2. Is SAML required for the first enterprise release?
3. Will RaaS maintain local passwords for all users or only non-SSO users?
4. Which password hashing algorithm and parameters will be standardized?
5. Will passkeys be supported in the first release?
6. Will TOTP be mandatory for administrators?
7. What exact access-token lifetime will be used?
8. What exact refresh-token lifetime will be used?
9. Will refresh tokens use server-side opaque identifiers or JWTs?
10. Which API-key scopes will exist initially?
11. Will API keys expire by default?
12. Which service-to-service identity mechanism will be standardized?
13. What exact PKI architecture will issue Lab Agent certificates?
14. Will Lab Agent certificates use an internal CA?
15. How will certificate revocation work for intermittently connected labs?
16. Will device binding be mandatory for Studio?
17. Which operations require step-up authentication?
18. What recovery evidence is required for high-value accounts?
19. What authentication anomaly engine will be used?
20. What exact authentication retention period applies?

# 146. Acceptance Criteria: User Authentication

- [ ] User identities have immutable IDs.
- [ ] Passwords are never stored plaintext.
- [ ] Password hashing uses an approved modern algorithm.
- [ ] Password login is rate limited.
- [ ] Common/breached passwords can be rejected.
- [ ] Password reset is supported.
- [ ] Reset tokens are single-use.
- [ ] Reset tokens expire.
- [ ] Password reset invalidates required sessions.
- [ ] Authentication errors do not enable trivial account enumeration.

# 147. Acceptance Criteria: SSO

- [ ] OIDC is supported or explicitly deferred.
- [ ] PKCE is enforced for public clients.
- [ ] Issuer is validated.
- [ ] Audience is validated.
- [ ] Signature is validated.
- [ ] Nonce/state are validated.
- [ ] Redirect URIs are allowlisted.
- [ ] Identity mapping is stable.
- [ ] SSO account linking is protected.
- [ ] SSO failures are audited.

# 148. Acceptance Criteria: MFA

- [ ] MFA is supported.
- [ ] MFA enrollment is authenticated.
- [ ] MFA verification is rate limited.
- [ ] MFA secrets are protected.
- [ ] Recovery codes are protected.
- [ ] MFA reset is audited.
- [ ] Administrators can require MFA.
- [ ] High-risk operations support step-up authentication.
- [ ] Passkeys are supported or formally deferred.

# 149. Acceptance Criteria: Sessions

- [ ] Sessions have unique identifiers.
- [ ] Sessions have expiration.
- [ ] Sessions have idle timeout.
- [ ] Session fixation is prevented.
- [ ] Logout invalidates session state.
- [ ] Global logout is supported.
- [ ] Users can view active sessions/devices.
- [ ] Revoked sessions cannot authenticate further.
- [ ] Browser session cookies use Secure/HttpOnly/SameSite as applicable.

# 150. Acceptance Criteria: Access Tokens

- [ ] Access tokens are short-lived.
- [ ] Tokens have issuer.
- [ ] Tokens have audience.
- [ ] Tokens have expiration.
- [ ] Token signatures are validated.
- [ ] Invalid tokens return HTTP 401.
- [ ] Tokens are not logged.
- [ ] Token audiences are restricted.
- [ ] Token claims are minimized.

# 151. Acceptance Criteria: Refresh Tokens

- [ ] Refresh tokens are protected.
- [ ] Refresh tokens rotate.
- [ ] Reuse detection exists.
- [ ] Token families can be revoked.
- [ ] Password reset can revoke refresh sessions.
- [ ] Compromised refresh tokens trigger security response.
- [ ] Refresh tokens are not logged.
- [ ] Refresh credentials are not stored in plaintext application files.

# 152. Acceptance Criteria: API Keys

- [ ] API keys are supported for machine use where appropriate.
- [ ] API keys have unique IDs.
- [ ] API keys have scopes.
- [ ] API keys support expiration.
- [ ] API key secrets are shown only at creation.
- [ ] API keys can be revoked.
- [ ] API keys are rate limited.
- [ ] API keys are audited.
- [ ] API keys are not logged.

# 153. Acceptance Criteria: Service Identities

- [ ] Service identities have immutable IDs.
- [ ] Service credentials are environment-specific.
- [ ] Service tokens are audience restricted.
- [ ] Service scopes are least privilege.
- [ ] Service credentials can rotate.
- [ ] Service credentials can be revoked.
- [ ] Shared human credentials are not used for service authentication.
- [ ] Service authentication events are auditable.

# 154. Acceptance Criteria: Lab Agent

- [ ] Every Lab Agent has a unique identity.
- [ ] Lab Agents authenticate using mTLS.
- [ ] Server certificates are validated.
- [ ] Client certificates are validated.
- [ ] Certificate identity maps to the Lab Agent.
- [ ] Certificate expiration is enforced.
- [ ] Certificate rotation is supported.
- [ ] Certificate revocation is supported.
- [ ] Enrollment is authorized.
- [ ] Bootstrap credentials are short-lived.
- [ ] Cross-environment certificates are rejected.

# 155. Acceptance Criteria: Device Binding

- [ ] Device identities are unique.
- [ ] Device private keys remain local.
- [ ] Device registration is authenticated.
- [ ] Device revocation is supported.
- [ ] Device revocation invalidates associated credentials.
- [ ] Users can view active devices.
- [ ] Sensitive operations can require trusted-device context.

# 156. Acceptance Criteria: Brute-Force Protection

- [ ] Login is rate limited.
- [ ] MFA is rate limited.
- [ ] Recovery is rate limited.
- [ ] API-key guessing is rate limited.
- [ ] Credential stuffing is monitored.
- [ ] Hard lockout is not trivially exploitable for denial of service.
- [ ] Suspicious activity generates security events.
- [ ] Rate-limit behavior is tested.

# 157. Acceptance Criteria: Recovery

- [ ] Recovery uses verified identity channels.
- [ ] Recovery tokens are random.
- [ ] Recovery tokens expire.
- [ ] Recovery tokens are single-use.
- [ ] Recovery is rate limited.
- [ ] Recovery events are audited.
- [ ] Successful recovery generates notification.
- [ ] Recovery invalidates appropriate sessions.
- [ ] Administrator recovery is separately audited.

# 158. Acceptance Criteria: Secrets

- [ ] Passwords are protected.
- [ ] Refresh tokens are protected.
- [ ] API keys are protected.
- [ ] Service credentials are protected.
- [ ] Private keys are protected.
- [ ] Lab certificates are protected.
- [ ] Secrets are not committed to source control.
- [ ] Secrets are not logged.
- [ ] Secrets are not included in telemetry.
- [ ] Environment credentials are isolated.

# 159. Acceptance Criteria: Audit and Monitoring

- [ ] Login success is audited.
- [ ] Login failure is audited.
- [ ] MFA events are audited.
- [ ] Password changes are audited.
- [ ] Password resets are audited.
- [ ] API key lifecycle is audited.
- [ ] Service identity lifecycle is audited.
- [ ] Lab Agent lifecycle is audited.
- [ ] Certificate lifecycle is audited.
- [ ] Session revocation is audited.
- [ ] Suspicious authentication activity is monitored.

# 160. Acceptance Criteria: Production

- [ ] Authentication architecture is reviewed.
- [ ] Production credentials are isolated.
- [ ] Production signing/identity keys are protected.
- [ ] MFA is enabled for administrators.
- [ ] Service credentials are rotated.
- [ ] Lab certificates are managed.
- [ ] Recovery procedures are tested.
- [ ] Credential compromise procedures are tested.
- [ ] Authentication penetration testing is completed.
- [ ] Security monitoring is operational.

# 161. Final Authentication Invariants

The following invariants are mandatory:

1. Every protected request has an authenticated principal.
2. Authentication does not imply authorization.
3. Passwords are never stored plaintext.
4. Access tokens are short-lived.
5. Refresh tokens are protected and rotated.
6. Refresh-token reuse is detectable.
7. API keys are scoped and revocable.
8. Service identities are distinct from human identities.
9. Service credentials are least privilege.
10. Lab Agents have unique identities.
11. Lab Agent communication uses authenticated mutual TLS.
12. Lab certificates are rotatable and revocable.
13. Device identities are revocable.
14. MFA is available for high-assurance authentication.
15. Sensitive operations can require step-up authentication.
16. Authentication endpoints are rate limited.
17. Recovery is treated as an authentication boundary.
18. Authentication secrets never appear in logs.
19. Authentication tokens never appear in telemetry.
20. Development credentials cannot authenticate to Production.
21. Production credentials are environment-specific.
22. Authentication failures fail closed.
23. Authentication events are auditable.
24. Suspicious authentication activity is detectable.
25. Physical robot safety does not depend on cloud authentication availability.

# 162. Final Authentication Architecture

    +------------------------------------------------------------------+
    |                         HUMAN USER                               |
    |                                                                  |
    |       Password / Passkey / TOTP / Enterprise SSO                 |
    +-------------------------------+----------------------------------+
                                    |
                                    v
                         +----------------------+
                         | Authentication      |
                         | Service              |
                         +----------+-----------+
                                    |
                         +----------+----------+
                         |                     |
                         v                     v
                  Session / MFA          Identity Mapping
                         |
                         v
                  Short-Lived Token
                         |
                         v
    +------------------------------------------------------------------+
    |                       CONTROL PLANE                              |
    |                                                                  |
    |  Authentication -> Principal -> Authorization -> Domain Service   |
    +------------------------------------------------------------------+
                ^                         ^
                |                         |
        +-------+-------+         +-------+-------+
        |               |         |               |
        | Service       |         | RaaS Studio   |
        | Identity      |         | Device Key    |
        |               |         |               |
        +---------------+         +---------------+
                |
                |
                v
    +------------------------------------------------------------------+
    |                         LAB NETWORK                              |
    |                                                                  |
    |  +------------------+       mTLS       +----------------------+   |
    |  | Lab Agent        | <--------------> | RaaS Control Plane  |   |
    |  +--------+---------+                  +----------------------+   |
    |           |                                                      |
    |           v                                                      |
    |  Local Runtime / Robot                                            |
    +------------------------------------------------------------------+

The definitive authentication principle is:

> Kritva RaaS shall establish strong, explicit, auditable identity for every
> human and machine principal crossing a security boundary. Human users shall
> authenticate through password, SSO and/or strong MFA according to policy;
> machine identities shall use scoped credentials or workload identity; Lab
> Agents shall use unique identities with mutual TLS; sessions and tokens shall
> be short-lived, protected and revocable; recovery shall be treated as a
> high-risk authentication operation; and no authentication credential shall
> become an implicit substitute for authorization or physical safety policy.
