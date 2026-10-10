# Kritva RaaS Protocol Authentication Specification

## 1. Document Control

| Item | Value |
|---|---|
| Document | Kritva RaaS Protocol Authentication Specification |
| Path | `docs/protocol/AUTHENTICATION.md` |
| Product | Kritva Robotics-as-a-Service |
| API Base | `/api/v1/` |
| Primary Transport | HTTPS REST |
| Realtime Transport | WebSocket |
| Lab Transport | Secure Lab Protocol |
| Local Transport | Tauri IPC |
| Identity Authority | External/managed Identity Provider |
| Authorization Authority | Kritva RaaS Control Plane |
| Credential Store | Secure platform/managed secret storage |
| Status | Production Architecture Baseline |

## 2. Purpose

This document defines the authentication architecture for Kritva RaaS protocol
boundaries.

Authentication establishes:

> **Who or what is communicating with the system?**

Authorization establishes:

> **What is that authenticated identity allowed to do?**

The two concerns must remain separate.

The authentication architecture covers:

- human users;
- organizations;
- Studio sessions;
- Web Console sessions;
- API access tokens;
- refresh tokens;
- service identities;
- Lab Agent identities;
- WebSocket connections;
- protocol handshakes;
- token claims;
- scopes;
- token rotation;
- credential revocation;
- expiration;
- failure handling;
- auditability.

## 3. Scope

This specification covers authentication for:

    User
      |
      +--> Kritva RaaS Studio
      |
      +--> Web Console
      |
      +--> Control Plane REST API
      |
      +--> WebSocket
      |
      +--> Lab Agent
      |
      +--> Secure Lab Protocol
      |
      +--> Internal services

It also defines the relationship between:

- authentication;
- authorization;
- tenant identity;
- organization membership;
- API scopes;
- service identities;
- protocol versions;
- token lifecycle.

## 4. Goals

The authentication system shall:

1. provide secure user authentication;
2. support desktop and browser clients;
3. use short-lived access tokens;
4. use refresh tokens for session continuation;
5. support token rotation;
6. support service-to-service authentication;
7. uniquely identify every Lab Agent;
8. support mutual authentication for Lab connectivity;
9. authenticate WebSocket connections;
10. prevent token replay where practical;
11. provide explicit token claims;
12. support scoped access;
13. support credential revocation;
14. support tenant isolation;
15. provide useful audit information;
16. fail closed for privileged operations;
17. support credential rotation without service interruption.

## 5. Non-Goals

This document does not define:

- complete user-interface login design;
- password policy details;
- payment authentication;
- physical robot safety authentication;
- application-level authorization policy for every resource;
- database row-level security implementation;
- complete identity-provider deployment;
- TLS certificate authority operations in full detail.

Authorization is defined separately, although authentication claims provide inputs
to authorization.

# 6. Authentication Architecture

The baseline architecture is:

    User
      |
      v
    Identity Provider
      |
      | authentication
      v
    Access Token
      |
      v
    Studio / Web Console
      |
      | HTTPS
      v
    RaaS Control Plane
      |
      +--> Authorization
      |
      +--> Domain Services
      |
      +--> WebSocket
      |
      v
    Lab Gateway / Lab Protocol
      |
      | mTLS + service identity
      v
    Lab Agent
      |
      v
    Kritva Runtime / Robot

Authentication mechanisms differ by boundary.

# 7. Authentication Boundaries

| Boundary | Authentication |
|---|---|
| User → Identity Provider | Identity-provider authentication |
| Studio → Control Plane | OAuth/OIDC access token |
| Web Console → Control Plane | OAuth/OIDC access token |
| Studio → Local Runtime | Tauri local trust/IPC |
| Browser → WebSocket | Access-token-authenticated handshake |
| Control Plane → Lab Agent | mTLS + service identity |
| Lab Agent → Control Plane | mTLS + service identity |
| Internal service → service | Workload/service identity |
| Lab Agent → Runtime | Local authenticated channel |

# 8. Identity Provider

The preferred user authentication model is based on a standards-compliant
OpenID Connect identity provider.

The identity provider is responsible for:

- user authentication;
- credential verification;
- MFA where enabled;
- session management;
- identity claims;
- token issuance;
- refresh-token lifecycle.

The RaaS Control Plane remains responsible for:

- token validation;
- organization membership;
- application authorization;
- scopes;
- platform/resource permissions;
- RaaS-specific account state.

# 9. OAuth and OpenID Connect

User authentication should use:

    OAuth 2.0
    +
    OpenID Connect

OIDC provides identity information.

OAuth access tokens provide API authorization.

The Control Plane must not treat an arbitrary OIDC identity token as an API
authorization token unless the contract explicitly defines it as such.

# 10. Desktop Authentication

Kritva RaaS Studio is a desktop application.

The preferred authentication flow is:

    Studio
       |
       v
    System Browser
       |
       v
    Identity Provider
       |
       v
    Authorization Code
       |
       v
    Studio callback
       |
       v
    Token Set

For a native desktop application, PKCE must be used.

# 11. PKCE

The Studio should use:

    Authorization Code Flow
        +
    PKCE

The code verifier is generated locally.

The authorization request carries the derived challenge.

The authorization code alone must not be sufficient to obtain tokens without
the corresponding verifier.

# 12. Browser Authentication

The Web Console should use the identity provider's browser-oriented OIDC flow.

The preferred architecture is:

    Browser
       |
       v
    Identity Provider
       |
       v
    Authenticated Session
       |
       v
    Web Console
       |
       v
    API Access

Token exposure in browser JavaScript should be minimized.

# 13. Token Types

Kritva RaaS uses multiple credential classes:

| Token/Credential | Purpose |
|---|---|
| Access Token | Short-lived API authorization |
| Refresh Token | Obtain a new access token |
| ID Token | Identity information for client |
| Service Credential | Service authentication |
| Lab Agent Certificate | Mutual TLS identity |
| Internal Service Token | Controlled service-to-service calls |

These credentials must not be interchangeable.

# 14. Access Token

An access token authorizes API operations.

Typical properties:

- short lifetime;
- audience restricted;
- issuer validated;
- subject identified;
- scopes included;
- tenant context available;
- issued-at timestamp;
- expiration timestamp.

# 15. Access Token Lifetime

The exact lifetime is configurable.

Recommended initial policy:

    access_token:
        5 to 15 minutes

Short lifetimes reduce the impact of stolen tokens.

Long-running operations do not require long-lived access tokens because operation
identity is maintained by the Control Plane.

# 16. Refresh Token

A refresh token allows the client to obtain a new access token without requiring
the user to authenticate interactively again.

Refresh tokens are:

- longer-lived;
- more sensitive;
- revocable;
- rotated;
- stored securely.

# 17. Refresh Token Storage

Studio should store refresh tokens using the operating system's secure
credential storage.

Examples include:

- Linux secret service/keyring;
- Windows Credential Manager;
- macOS Keychain.

Refresh tokens must not be stored in:

- plaintext configuration files;
- project directories;
- source repositories;
- application logs.

# 18. Browser Refresh Tokens

Browser deployments should minimize persistent refresh-token exposure.

Where possible:

    Browser
       |
       v
    Secure Session
       |
       v
    Auth Backend / BFF
       |
       v
    Control Plane

If refresh tokens are handled directly by the browser, they must use secure
browser storage and appropriate rotation protections.

The final deployment choice remains an implementation decision.

# 19. ID Token

The ID token represents authenticated identity information for the client.

It is not automatically a permission token for every RaaS API.

Typical claims include:

    sub
    iss
    aud
    exp
    iat
    nonce

The client may use it to establish the authenticated user identity.

# 20. Access Token Claims

The baseline access-token claims should include:

    iss
    sub
    aud
    exp
    iat
    nbf
    jti
    scope

RaaS-specific claims may include:

    organization_id
    roles
    client_id
    token_type
    auth_time

# 21. Example Access Token Claims

Conceptual decoded claims:

    {
        "iss": "https://identity.example",
        "sub": "user-001",
        "aud": "kritva-raas-api",
        "exp": 1791418200,
        "iat": 1791417900,
        "nbf": 1791417900,
        "jti": "token-001",
        "scope": "openid profile projects:read projects:write",
        "organization_id": "org-001",
        "client_id": "kritva-studio",
        "token_type": "user"
    }

The actual signed token must never be represented by a decoded payload alone;
signature verification is mandatory.

# 22. Token Issuer

The Control Plane must validate:

    iss

against a trusted configured issuer.

An arbitrary issuer supplied by a client must never be trusted.

# 23. Audience

The API must validate:

    aud

against the expected API audience.

A token issued for another service must not automatically authorize access to
the RaaS Control Plane.

# 24. Subject

The:

    sub

claim identifies the authenticated principal.

The Control Plane maps the subject to the RaaS user identity.

The subject must be treated as an opaque stable identifier.

# 25. Expiration

The API must reject expired tokens.

Validation includes:

    exp > current_time

with a bounded clock-skew allowance.

Expired access tokens should result in:

    AUTH_SESSION_EXPIRED

or an equivalent stable authentication error.

# 26. Not-Before

If:

    nbf > current_time

the token must not be accepted yet.

This prevents tokens from becoming valid before their intended activation time.

# 27. Issued-At

The:

    iat

claim identifies token issuance time.

It supports:

- diagnostics;
- token-age policy;
- incident investigation;
- revocation strategy.

# 28. Token ID

The:

    jti

claim provides a unique token identifier.

It may be used for:

- security telemetry;
- revocation;
- incident response;
- replay detection.

A full token blacklist should not be required for every normal request if short
token lifetimes and refresh rotation are sufficient.

# 29. Scopes

Scopes define coarse-grained API permissions.

Example:

    projects:read
    projects:write
    platforms:read
    bookings:read
    bookings:write
    artifacts:write
    jobs:read
    jobs:execute
    results:read

Scopes are an input to authorization, not the complete authorization model.

# 30. Scope Categories

Recommended categories:

| Scope | Purpose |
|---|---|
| `profile:read` | Read user profile |
| `projects:read` | Read projects |
| `projects:write` | Modify projects |
| `platforms:read` | Read robot platforms |
| `bookings:read` | Read bookings |
| `bookings:write` | Create/modify bookings |
| `artifacts:read` | Read artifacts |
| `artifacts:write` | Upload/manage artifacts |
| `jobs:read` | Read jobs |
| `jobs:execute` | Start/stop execution |
| `results:read` | Read results |
| `credits:read` | Read credit balance |
| `credits:use` | Consume credits |
| `admin:read` | Read administrative data |
| `admin:write` | Modify administrative data |

# 31. Scope Principle

Scopes should be:

- explicit;
- least-privilege;
- stable;
- understandable;
- auditable.

Avoid broad scopes such as:

    *

unless explicitly restricted to trusted internal service identities.

# 32. Roles

Roles are different from scopes.

Example:

    role = organization_admin

A role can imply a collection of permissions.

Scopes represent what the token is permitted to request.

Authorization evaluates:

    identity
    +
    organization membership
    +
    role
    +
    scope
    +
    resource policy

# 33. Tenant Context

A user token may contain:

    organization_id

but the Control Plane must derive and validate effective tenant context from
server-side membership.

Client-supplied organization identifiers must never override authorization.

# 34. Multi-Organization Users

A user may belong to multiple organizations.

The token/session may identify:

    active organization

but the server must verify:

    user ∈ organization

before allowing access.

An organization switch may require a new access-token context or an explicit
server-side organization selection operation.

# 35. Organization Isolation

Authentication alone does not guarantee tenant isolation.

The request processing model is:

    Token
       |
       v
    Principal
       |
       v
    Organization Membership
       |
       v
    Authorization
       |
       v
    Resource Ownership
       |
       v
    Operation

# 36. Authentication Middleware

Every protected API request passes through:

    HTTPS
       |
       v
    Token Extraction
       |
       v
    Token Validation
       |
       v
    Principal Construction
       |
       v
    Scope/Authorization
       |
       v
    Application Service

# 37. Token Extraction

REST clients use:

    Authorization: Bearer <access-token>

The server must reject:

- malformed authorization headers;
- unsupported authentication schemes;
- empty bearer tokens.

# 38. Token Validation Order

Recommended order:

1. extract credential;
2. validate token structure;
3. verify signature;
4. validate issuer;
5. validate audience;
6. validate expiration;
7. validate `nbf`;
8. validate token type;
9. validate scopes;
10. resolve principal;
11. resolve tenant;
12. authorize operation.

# 39. Signature Validation

Signed access tokens must be validated using trusted signing keys.

The API must not trust:

- unsigned tokens;
- client-selected algorithms;
- arbitrary public keys supplied in the token.

The accepted signing algorithms are deployment policy and must be explicitly
configured.

# 40. Key Discovery

For OIDC/JWT deployments, signing keys may be obtained through the identity
provider's trusted key-discovery mechanism.

The Control Plane should cache keys safely.

Key cache refresh must handle signing-key rotation.

# 41. Key Rotation

Identity-provider signing keys must rotate without causing unnecessary
authentication outages.

The API should support:

    old key
       +
    new key
       |
       v
    overlap period
       |
       v
    old key retired

# 42. Refresh Token Rotation

Refresh tokens should use rotation.

Flow:

    Refresh Token R1
         |
         v
    Token Endpoint
         |
         v
    Access Token A2
    Refresh Token R2
         |
         v
    R1 invalidated

If a previously used refresh token is presented again, this may indicate token
theft or replay.

# 43. Refresh Token Replay

A replayed rotated refresh token should trigger:

- rejection;
- session invalidation according to policy;
- security telemetry;
- possible revocation of the token family.

The user may be required to authenticate again.

# 44. Refresh Token Family

Conceptually:

    Session
       |
       v
    R1
       |
       v
    R2
       |
       v
    R3
       |
       v
    R4

The server may associate all rotated refresh tokens with one session/token
family.

Compromise detection can invalidate the entire family.

# 45. Refresh Failure

If the refresh token is:

- expired;
- revoked;
- malformed;
- reused;
- invalid;

the client should clear local authentication state and require interactive
login when appropriate.

# 46. Access Token Refresh

Typical Studio behavior:

    API Request
       |
       v
    401
       |
       v
    Access token expired?
       |
       v
    Refresh
       |
       v
    New access token
       |
       v
    Retry original request

The original request must preserve its idempotency key if it is a side-effecting
operation.

# 47. Critical Retry Rule

Authentication retry must not accidentally become operation duplication.

Example:

    booking.create
       |
       | key = K
       v
    access token expires
       |
       v
    refresh
       |
       v
    retry booking.create
       |
       | same key K
       v
    Control Plane

The idempotency contract remains intact.

# 48. Concurrent Token Refresh

Multiple Studio requests may discover an expired token simultaneously.

The client should coordinate refresh:

    Request A --\
    Request B ----> Refresh Coordinator ---> R2
    Request C --/

Only one refresh operation should normally be active per session.

# 49. Service Authentication

Internal services should not use human user tokens.

Service-to-service authentication should use dedicated service identities.

Example:

    Worker
       |
       | service credential
       v
    Control Plane

Service identities should have:

- unique identity;
- narrow scope;
- lifecycle management;
- rotation;
- auditability.

# 50. Service Token

A service token is a credential representing an application/service rather than
a human user.

Example claims:

    {
        "iss": "kritva-identity",
        "sub": "service:worker",
        "aud": "kritva-raas-internal",
        "scope": "jobs:dispatch results:write",
        "token_type": "service"
    }

# 51. Service Token Principle

Service credentials must not inherit human permissions implicitly.

A worker should receive only the permissions required for its function.

# 52. Workload Identity

Where the cloud platform supports workload identity, it is preferred over
long-lived static secrets.

Architecture:

    Worker
       |
       v
    Workload Identity
       |
       v
    Short-Lived Service Credential
       |
       v
    Control Plane / Infrastructure

# 53. Static Service Secrets

Static credentials should be avoided where workload identity is available.

If unavoidable:

- store in managed secret storage;
- rotate;
- scope narrowly;
- audit access;
- never commit to source control.

# 54. Service Token Audience

Service tokens must use service-specific audiences where practical.

Example:

    aud = "kritva-raas-control-plane"

A token issued for another internal service must not automatically authorize
Control Plane access.

# 55. Service-to-Service Authorization

The Control Plane should authorize:

    service identity
      +
    scope
      +
    operation

Example:

    worker-artifact-validator
        allowed:
            artifacts:validate

    worker-scheduler
        allowed:
            resources:allocate
            jobs:dispatch

# 56. Lab Agent Identity

Every Lab Agent must have a unique cryptographic identity.

The recommended mechanism is:

    mTLS
      +
    device/service certificate
      +
    agent identity

Example:

    lab-agent-001
       |
       | client certificate
       v
    Lab Gateway / Control Plane

# 57. Mutual TLS

Lab connectivity should authenticate both sides:

    Control Plane
       |\
       | \ server certificate
       |  \
       |   \
       |    v
       |   Lab Agent
       |      |
       |      |
       +------+
       client certificate

Both peers validate the other party.

# 58. Why mTLS

mTLS provides:

- strong machine identity;
- encrypted transport;
- protection against unauthenticated lab connections;
- credential rotation;
- explicit certificate lifecycle;
- resistance to simple credential copying.

# 59. Lab Agent Certificate

A certificate should identify:

    agent_id
    organization/lab association
    certificate serial
    validity period
    issuer

The certificate must not contain unnecessary sensitive information.

# 60. Agent Registration

Initial provisioning:

    Lab Administrator
       |
       v
    Registration Process
       |
       v
    Agent Identity
       |
       v
    Certificate
       |
       v
    Lab Agent
       |
       v
    Secure Connection
       |
       v
    Control Plane

The exact enrollment method is an implementation decision.

# 61. Agent Bootstrap

Bootstrap credentials must be:

- short-lived;
- one-time or tightly bounded;
- associated with the intended lab;
- auditable.

A permanent bootstrap secret should not become the agent's long-term identity.

# 62. Agent Authentication

When connecting:

    Lab Agent
       |
       | TLS ClientHello
       |
       | Client Certificate
       v
    Lab Gateway
       |
       v
    Certificate validation
       |
       v
    Agent identity resolution
       |
       v
    Authorization
       |
       v
    Lab Protocol handshake

# 63. Agent Authorization

Authentication proves:

    agent-001

Authorization determines:

    agent-001
       |
       +--> allowed lab
       +--> allowed resources
       +--> allowed protocol
       +--> allowed capabilities

An authenticated agent must not automatically access all robots.

# 64. Agent Certificate Rotation

Certificates should have bounded lifetimes.

Rotation:

    Certificate A
       |
       v
    New Certificate B
       |
       v
    Overlap
       |
       v
    Agent switches to B
       |
       v
    A revoked/expired

Rotation should not require physical reinstallation where avoidable.

# 65. Agent Revocation

An agent must be revocable.

Reasons include:

- stolen host;
- compromised credentials;
- decommissioned lab;
- unauthorized software;
- security incident.

Revoked agents must not reconnect successfully.

# 66. Agent Offline Behavior

If the Lab Agent loses cloud connectivity:

    Agent
       |
       X
    Control Plane

The agent may retain local runtime operation according to safety policy, but:

- new cloud-authorized jobs should normally be blocked;
- credentials should remain bounded by expiry;
- queued cloud commands must not be blindly executed;
- local safety remains authoritative.

# 67. Agent Reconnect

On reconnect:

    Agent
       |
       v
    mTLS authentication
       |
       v
    Protocol negotiation
       |
       v
    Version validation
       |
       v
    Capability report
       |
       v
    State reconciliation
       |
       v
    ONLINE

# 68. WebSocket Authentication

WebSocket connections require authentication.

Preferred flow:

    Client
       |
       | HTTPS auth
       v
    Access Token
       |
       v
    WebSocket handshake
       |
       v
    Authenticated connection

The WebSocket must not be considered authenticated merely because it originated
from an authenticated webpage.

# 69. WebSocket Token Transport

Preferred options should avoid placing access tokens in URLs because URLs can
leak into:

- logs;
- proxies;
- browser history;
- telemetry.

The implementation should use a secure handshake mechanism supported by the
deployment environment.

A short-lived connection token may be used if required.

# 70. WebSocket Authentication Example

Conceptual handshake metadata:

    Authorization: Bearer <access-token>

After authentication:

    connection_id
    principal
    organization
    scopes
    protocol_version

are associated with the WebSocket session.

# 71. WebSocket Authorization

Authentication occurs at connection establishment.

Authorization still applies to every subscription or command.

Example:

    WebSocket
       |
       v
    authenticated user
       |
       +--> subscribe project-001
       |
       v
    authorization check

A valid connection does not grant access to every resource.

# 72. WebSocket Token Expiration

A WebSocket may outlive the access token used to establish it.

The server must define a policy.

Preferred:

- authenticate connection;
- track token/session expiry;
- reauthenticate or close when required;
- never allow an indefinitely authenticated connection.

# 73. WebSocket Reauthentication

If supported:

    existing connection
       |
       v
    token refresh
       |
       v
    reauthentication
       |
       v
    continue

Otherwise:

    token/session expires
       |
       v
    close connection
       |
       v
    reconnect with new token

# 74. WebSocket Reconnect

After disconnect:

    refresh token if necessary
       |
       v
    new access token
       |
       v
    new WebSocket
       |
       v
    authenticate
       |
       v
    resubscribe
       |
       v
    REST state reconciliation

# 75. Protocol Authentication Handshake

The Lab Protocol handshake should establish:

- peer identity;
- protocol version;
- capabilities;
- session identity;
- connection identity.

Conceptual:

    {
        "protocol_version": "1.0",
        "request_id": "req-handshake-001",
        "timestamp": "2026-10-08T00:00:00Z",
        "command": "protocol.negotiate",
        "payload": {
            "supported_versions": [
                "1.0",
                "1.1"
            ],
            "agent_id": "agent-001"
        }
    }

Authentication is established by mTLS before the application-level handshake.

# 76. Authentication vs Protocol Negotiation

The sequence is:

    Transport Security
          |
          v
    Peer Authentication
          |
          v
    Protocol Version Negotiation
          |
          v
    Capability Negotiation
          |
          v
    Authorization
          |
          v
    Command Processing

Protocol negotiation must not replace authentication.

# 77. Authentication Context

The Control Plane should create an internal authentication context:

    AuthContext
    -----------
    principal_id
    principal_type
    organization_id
    scopes
    roles
    client_id
    token_id
    authentication_method
    issued_at
    expires_at

This context is passed into application services.

# 78. Principal Types

Recommended:

    USER
    SERVICE
    LAB_AGENT
    ADMIN_SERVICE

The exact list may evolve.

Application services should not infer principal type from an arbitrary string.

# 79. Authentication Methods

Recommended identifiers:

    oidc
    oauth2
    mtls
    workload_identity
    service_token

The method should be recorded for audit and security analysis.

# 80. Token Type Claim

The `token_type` claim may distinguish:

    user
    service

Lab Agent certificates should use certificate identity rather than pretending
to be user JWTs.

# 81. Service Impersonation

A service must not impersonate a user by simply changing:

    sub

in a token.

If delegated execution is required, the protocol must explicitly represent:

    actor
    delegated_by
    service_principal

and authorization must validate both.

# 82. Delegation

Example:

    actor:
        user-001

    delegated_by:
        service:scheduler

The resulting action must remain auditable.

Delegation is not part of ordinary authentication and requires explicit
authorization design.

# 83. User Logout

Logout should invalidate the user's refresh session.

Access tokens already issued may remain valid until expiration unless the
deployment implements active token revocation.

Short access-token lifetimes reduce the exposure window.

# 84. Session Revocation

A user/session may be revoked because of:

- logout;
- password reset;
- security incident;
- administrator action;
- suspected refresh-token replay.

The identity provider is normally the authority for user session revocation.

The Control Plane may maintain additional application-level session state.

# 85. Access Token Revocation

Immediate access-token revocation can be implemented through:

- token introspection;
- denylist;
- session version;
- short expiration;
- gateway enforcement.

The baseline should favor short-lived access tokens and revocable refresh
sessions rather than a database lookup on every normal API request.

# 86. Critical Operations

For particularly sensitive operations, additional checks may be required:

- payment;
- organization administration;
- production robot execution;
- credential administration.

The system may require recent authentication or step-up authentication.

# 87. Step-Up Authentication

Conceptual:

    User
       |
       v
    Normal Session
       |
       v
    Sensitive Operation
       |
       v
    Step-Up Authentication
       |
       v
    Operation

The exact operations requiring step-up authentication are a product/security
policy decision.

# 88. Authentication Failure Codes

The authentication error registry should include:

    AUTH_REQUIRED
    AUTH_INVALID_CREDENTIALS
    AUTH_SESSION_EXPIRED
    AUTH_TOKEN_INVALID
    AUTH_TOKEN_REVOKED
    AUTH_TOKEN_AUDIENCE_INVALID
    AUTH_TOKEN_ISSUER_INVALID
    AUTH_TOKEN_NOT_YET_VALID
    AUTH_SCOPE_MISSING
    AUTH_MTLS_REQUIRED
    AUTH_MTLS_INVALID
    AUTH_AGENT_REVOKED
    AUTH_AGENT_NOT_REGISTERED
    AUTH_REFRESH_INVALID
    AUTH_REFRESH_REUSED

These should be formally registered in `ERROR_CODES.md`.

# 89. HTTP Authentication Failures

Typical mappings:

| Condition | HTTP |
|---|---:|
| Missing credentials | 401 |
| Invalid token | 401 |
| Expired token | 401 |
| Revoked token | 401 |
| Insufficient permission | 403 |
| Invalid client certificate | TLS/application failure |
| Agent revoked | 403/connection rejected |

The exact mapping must remain consistent with `ERROR_CODES.md`.

# 90. WWW-Authenticate

For HTTP 401 responses, the API should use the standard:

    WWW-Authenticate

header where appropriate.

Example:

    WWW-Authenticate: Bearer

The response body provides the stable RaaS error code.

# 91. Authentication Error Response

Example:

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T00:00:01Z",
        "status": "UNAUTHORIZED",
        "code": "AUTH_TOKEN_INVALID",
        "message": "The access token is invalid.",
        "data": null,
        "error": {
            "details": {},
            "retryable": false,
            "field_errors": []
        }
    }

Authentication failures must not expose internal validation details.

# 92. Token Failure Handling

Clients should distinguish:

    401
       |
       +--> access token expired
       |       |
       |       v
       |    refresh
       |
       +--> refresh failed
               |
               v
            login required

A 403 should not normally trigger token refresh.

It indicates an authorization problem rather than expired authentication.

# 93. Token Refresh and Idempotency

If an authenticated side-effecting operation fails due to an expired token:

    original request
       |
       v
    401
       |
       v
    refresh
       |
       v
    retry
       |
       v
    SAME idempotency key

The client must preserve the original operation identity.

# 94. Authentication and API Versioning

Authentication semantics are part of the API contract.

A new API major version may change:

- supported token claims;
- scope requirements;
- authentication mechanisms.

Such changes must be documented and migrated explicitly.

# 95. Protocol Authentication Versioning

Lab authentication must remain compatible with protocol version negotiation.

The system may support:

    Protocol 1.x
       +
    mTLS authentication

and later:

    Protocol 2.x
       +
    mTLS authentication

Authentication must not silently downgrade security to achieve protocol
compatibility.

# 96. TLS

All network authentication channels must use TLS.

Requirements include:

- certificate validation;
- hostname/service identity validation;
- modern TLS configuration;
- disabled obsolete protocols;
- managed certificate lifecycle.

# 97. Certificate Validation

The Lab Gateway validates:

- issuer;
- certificate validity period;
- chain;
- identity;
- revocation policy where supported;
- intended usage.

The Lab Agent validates the server identity.

# 98. Lab Trust Model

The trust relationship is:

    Trusted CA
       |
       +--> Control Plane identity
       |
       +--> Lab Agent identity
       |
       v
    Mutual authentication

Neither side should trust arbitrary self-signed certificates unless explicit
private-CA policy defines the trust root.

# 99. Certificate Rotation Without Downtime

Recommended:

    Agent
       |
       | old cert
       v
    Control Plane

    provision new cert
       |
       v
    validate new cert
       |
       v
    switch connection
       |
       v
    retire old cert

A controlled overlap prevents avoidable lab outages.

# 100. Agent Provisioning

Provisioning should establish:

    agent_id
    lab_id
    certificate
    private key
    trust anchors
    configuration
    protocol support

Private keys must remain under agent control where practical.

# 101. Private Key Protection

Lab Agent private keys must not be:

- committed to source;
- included in artifact packages;
- transmitted in logs;
- embedded in configuration repositories.

Where hardware-backed key storage is available, it should be preferred.

# 102. Agent Identity Persistence

The Lab Agent identity must survive normal software restarts.

It must not generate a new identity every process launch.

Replacing an agent identity requires explicit re-enrollment.

# 103. Agent Replacement

If a machine is replaced:

    old agent
       |
       v
    revoke
       |
       v
    new enrollment
       |
       v
    new agent identity

The new machine must not reuse the old private key unless an approved secure
migration process explicitly requires it.

# 104. Service Credential Rotation

Service credentials should support overlap:

    Credential A
        |
        +--> active
        |
    Credential B
        |
        +--> provisioned
        |
        v
    switch to B
        |
        v
    retire A

This avoids coordinated downtime.

# 105. Rotation Frequency

Exact rotation periods are security policy decisions.

The baseline principles are:

- short-lived access tokens;
- regularly rotated refresh tokens;
- bounded service credentials;
- bounded Lab certificates;
- emergency revocation.

# 106. Secret Storage

Secrets should use managed secret storage.

Examples:

- cloud secret manager;
- OS keyring;
- hardware-backed key store;
- managed certificate store.

Secrets must not be stored in:

- Git;
- source code;
- public object storage;
- database application tables unless explicitly encrypted and required.

# 107. Authentication Audit

Authentication events should include:

    authentication.success
    authentication.failure
    token.refresh
    token.refresh_failed
    token.revoked
    session.revoked
    agent.registered
    agent.authenticated
    agent.rejected
    credential.rotated

The final event catalogue should be aligned with `EVENTS.md`.

# 108. Audit Data

Audit records should include:

- timestamp;
- principal;
- organization;
- authentication method;
- client;
- source/network metadata where policy permits;
- result;
- failure code;
- token/session identifier where safe.

Secrets and raw tokens must never be logged.

# 109. Token Logging Rule

Never log:

    Authorization: Bearer <token>

Never log:

    refresh_token

Never log:

    private_key

Never log:

    client_secret

Logs should contain safe identifiers or hashes instead.

# 110. Authentication Monitoring

Recommended metrics:

    auth.requests_total
    auth.success_total
    auth.failure_total
    auth.token_expired_total
    auth.token_invalid_total
    auth.refresh_total
    auth.refresh_reuse_total
    auth.agent_connections
    auth.agent_rejections
    auth.mtls_failures
    auth.websocket_auth_failures

# 111. Security Alerts

Alert on:

- refresh-token reuse;
- abnormal failed logins;
- repeated invalid service credentials;
- unexpected agent connections;
- certificate failures;
- revoked agent reconnect attempts;
- unusual token use;
- suspicious geographic/network changes where policy permits.

# 112. Rate Limiting

Authentication endpoints require rate limiting.

Examples:

- login;
- token refresh;
- agent enrollment;
- WebSocket authentication;
- service authentication failures.

Rate limits must not create an easy denial-of-service vector against valid
production robot control.

# 113. Brute Force Protection

The identity provider should provide primary protection against:

- password brute force;
- credential stuffing;
- suspicious authentication patterns.

The Control Plane should protect its own token and service endpoints.

# 114. Clock Synchronization

Token and certificate validation depend on accurate time.

Production hosts should synchronize time through trusted time services.

Clock skew tolerance must be bounded.

Excessive clock drift should produce operational alerts.

# 115. Token Claim Validation

At minimum:

    iss
    sub
    aud
    exp
    iat
    nbf
    jti
    scope

Additional claims must be validated only if they are part of the trusted
contract.

# 116. Unknown Claims

Clients and servers should generally tolerate unknown optional claims.

Security-critical claims must never be ignored if required by the contract.

# 117. Claim Trust

A claim is trusted only after:

1. token signature verification;
2. issuer validation;
3. audience validation;
4. expiration validation;
5. token-type validation.

Claims from untrusted request parameters must not override token claims.

# 118. Organization Claim

If:

    organization_id

is present in the token, it is a security input, not an unconditional truth.

The Control Plane must verify the user's current organization membership and
application policy.

# 119. Scope Validation

Example:

    booking.create

requires:

    bookings:write

and may also require:

    platforms:read
    credits:use

The exact permission matrix belongs to authorization policy.

# 120. Least Privilege

Studio should request only scopes necessary for its supported operations.

An application should not request:

    admin:write

unless it is an administrative client.

# 121. Admin Authentication

Administrative access should use:

- dedicated scopes;
- dedicated roles;
- stronger authentication;
- audit logging;
- optional step-up authentication.

Admin APIs should not be exposed to ordinary user tokens.

# 122. Service-to-Service TLS

Even when service tokens are used, TLS remains mandatory.

Authentication and encryption are separate controls.

# 123. Internal Network Trust

Private network location must not be treated as sufficient authentication.

Example:

    internal network
        X
    automatically trusted

Instead:

    network
       +
    cryptographic identity
       +
    authorization
       |
       v
    trusted operation

# 124. WebSocket Subscription Security

Subscriptions must be checked against:

- organization;
- project;
- resource;
- scope;
- role.

Example:

    subscribe run-001 telemetry

requires authorization to access run-001.

# 125. WebSocket Event Isolation

An authenticated user must never receive another organization's events.

The server should enforce subscription filters server-side.

Client-side filtering is not a security control.

# 126. Lab Event Security

Lab Agent events must be scoped to:

- authorized lab;
- agent;
- resources;
- assigned jobs.

An agent must not subscribe to unrelated labs.

# 127. Authentication Failure and Reconnect

If authentication fails:

    connection
       |
       v
    rejected
       |
       v
    no command execution

The client may obtain fresh credentials and reconnect.

It must not continue sending commands over an unauthenticated connection.

# 128. Authentication Failure During Job

An expired Studio token does not automatically stop a running robot job.

The job is a server-side operation.

The user may reauthenticate and reconnect to observe or control it, subject to
authorization.

This prevents a UI session expiration from unexpectedly stopping a robot.

# 129. Safety Separation

Authentication controls access.

It does not replace:

- robot safety controller;
- physical E-stop;
- local interlocks;
- motion limits;
- human safety procedures.

A valid authenticated user is not automatically permitted to bypass safety.

# 130. Token Revocation During Execution

If a user token is revoked while a job is running:

    user session
       |
       v
    revoked
       |
       v
    existing job

The job should continue or stop according to job/safety policy, not merely
because the viewing session expired.

Control actions require current authorization.

# 131. Long-Running Jobs

A job should be identified by:

    job_id
    run_id
    operation_id

not by the lifetime of a user's access token.

This is consistent with asynchronous execution architecture.

# 132. Authentication Context in Jobs

At job creation, record:

- initiating principal;
- organization;
- artifact;
- platform;
- authorization context;
- relevant client version;
- token/session metadata required for audit.

Do not store the raw access token.

# 133. Authentication and Idempotency

Authentication identity participates in idempotency context.

Conceptually:

    organization
       +
    principal
       +
    command
       +
    idempotency key

This prevents unauthorized users from replaying another user's operation.

# 134. Token Refresh and Idempotency

Token refresh must not generate a new operation identity.

Example:

    Access Token A
       |
       v
    booking.create
       |
       v
    refresh
       |
       v
    Access Token B
       |
       v
    booking.create
       |
       v
    same Idempotency-Key

# 135. Authentication and Audit Correlation

Use:

    request_id
    trace_id
    operation_id
    principal_id

to correlate authentication and business actions.

This enables:

    login
      |
      v
    API request
      |
      v
    booking
      |
      v
    job
      |
      v
    robot run

without storing credentials.

# 136. Version Compatibility

Authentication contract versions must follow `VERSIONING.md`.

Breaking changes to:

- token claims;
- authentication flows;
- scopes;
- service identity;
- Lab Agent authentication;

require explicit migration.

# 137. Authentication Migration

Example:

    Auth v1
       |
       v
    Auth v2 introduced
       |
       +--> old clients supported
       |
       v
    Studio migration
       |
       v
    Lab Agent migration
       |
       v
    old auth retired

Security vulnerabilities may shorten this window.

# 138. Phase Mapping Overview

| Phase | Authentication Work |
|---|---|
| Phase 0 | Identity and token foundation |
| Phase 1 | Studio/Web authentication |
| Phase 2 | Artifact authorization integration |
| Phase 3 | Control Plane authentication |
| Phase 4 | Commercial/admin authentication |
| Phase 5 | Job execution authorization |
| Phase 6 | Lab Agent mTLS |
| Phase 7 | WebSocket/live authentication |
| Phase 8 | Production security and rotation |

# 139. P0 FOUNDATION

Implement:

- identity provider integration;
- OIDC/OAuth contract;
- access tokens;
- refresh tokens;
- token claims;
- scope model;
- authentication middleware;
- error codes.

Acceptance:

- invalid tokens are rejected;
- valid tokens produce an authenticated principal;
- issuer/audience/expiry are validated.

# 140. P1 STUDIO and Web

Implement:

- Studio PKCE;
- browser authentication;
- secure refresh storage;
- token refresh;
- logout;
- API client authentication.

Acceptance:

- Studio can login securely;
- expired access tokens refresh;
- refresh failure returns user to authentication.

# 141. P2 BUILD & ARTIFACT — Artifact

Implement:

- artifact scope validation;
- upload authorization;
- project ownership checks;
- artifact access control.

Acceptance:

- users cannot access another organization's artifacts.

# 142. P3 CONTROL PLANE

Implement:

- authentication middleware;
- principal context;
- service identity;
- API authorization integration;
- authentication audit.

Acceptance:

- every protected endpoint validates authentication consistently.

# 143. P4 BOOKING & COMMERCIAL — Commercial

Implement:

- booking scopes;
- credit scopes;
- payment/admin authentication;
- stronger admin authentication.

Acceptance:

- financial operations require authenticated and authorized identities.

# 144. P5 EXECUTION

Implement:

- job execution scopes;
- operation identity;
- execution authorization;
- audit of execution initiator.

Acceptance:

- only authorized users/services can start robot jobs.

# 145. P6 LAB & ROBOT — Lab Agent

Implement:

- agent enrollment;
- mTLS;
- certificate validation;
- agent authorization;
- certificate rotation;
- revocation.

Acceptance:

- only registered authorized Lab Agents can connect.

# 146. P7 LIVE & RESULTS

Implement:

- WebSocket authentication;
- subscription authorization;
- token expiration handling;
- reconnect/re-authentication;
- results access control.

Acceptance:

- authenticated users receive only authorized realtime data.

# 147. P8 PRODUCTION

Implement:

- security monitoring;
- credential rotation;
- emergency revocation;
- incident response;
- key management;
- authentication dashboards;
- security audits.

Acceptance:

- credentials can be rotated/revoked without uncontrolled service outage.

# 148. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Stolen access token | High | Short lifetime |
| Stolen refresh token | Critical | Rotation + family revocation |
| Service credential leak | Critical | Workload identity + rotation |
| Lab certificate theft | Critical | mTLS + revocation |
| Cross-tenant access | Critical | Server-side authorization |
| Token replay | High | Short TTL + jti/session controls |
| Key rotation outage | High | Overlap periods |
| WebSocket auth bypass | Critical | Authenticated handshake |
| Expired token during job | Medium | Job identity independent of session |
| Clock drift | High | Time synchronization |
| Overprivileged scopes | High | Least privilege |
| Token leakage in logs | Critical | Secret-safe logging |
| Rogue Lab Agent | Critical | Enrollment + mTLS |
| Identity-provider outage | High | Defined session/token behavior |
| Credential rotation failure | High | Staged rotation |

# 149. Risk — Token Theft

If an access token is stolen:

    attacker
       |
       v
    API

Mitigations:

- short expiration;
- TLS;
- audience restriction;
- scope restriction;
- anomaly detection;
- revocation for high-risk cases.

# 150. Risk — Refresh Token Theft

Refresh tokens provide longer access.

Mitigations:

- secure storage;
- rotation;
- replay detection;
- family revocation;
- limited lifetime;
- device/session binding where supported.

# 151. Risk — Lab Agent Compromise

A compromised Lab Agent can be particularly dangerous because it sits near
physical systems.

Mitigations:

- unique mTLS identity;
- least privilege;
- certificate rotation;
- revocation;
- agent health checks;
- signed software;
- local safety controls;
- execution authorization.

# 152. Risk — Authentication Outage

An identity provider outage must not automatically become uncontrolled robot
behavior.

Existing jobs should follow server-side job policy.

New authenticated operations may be blocked.

Physical safety remains local.

# 153. Risk — Stale Credentials

Long-lived credentials increase compromise exposure.

Mitigation:

- short-lived access tokens;
- rotating refresh tokens;
- bounded certificates;
- service credential rotation;
- automated expiry monitoring.

# 154. Risk — Scope Drift

New API endpoints may accidentally accept overly broad scopes.

Mitigation:

- explicit authorization matrix;
- contract tests;
- security review;
- least privilege;
- deny-by-default.

# 155. Open Questions

1. Which production OIDC provider will be selected?
2. Will the Web Console use a BFF/session-cookie architecture?
3. What exact access-token lifetime will be adopted?
4. What exact refresh-token lifetime will be adopted?
5. What exact refresh-token family replay policy will be used?
6. What exact scope names are final?
7. Which organization claims will be present in tokens?
8. How will multi-organization users select an active organization?
9. What exact admin authentication policy will be required?
10. Which operations require step-up authentication?
11. Which JWT signing algorithms will be supported?
12. What exact key rotation interval will be used?
13. What exact clock-skew tolerance will be allowed?
14. Will access-token revocation use introspection, denylist, or short TTL?
15. What exact service identity mechanism will be used in each cloud environment?
16. Which cloud workload identity system will be adopted?
17. What exact Lab Agent PKI/CA will be used?
18. How will Lab Agent enrollment be performed?
19. How will certificate revocation work for offline labs?
20. What exact certificate lifetime will be used?
21. Will the WebSocket use bearer-token handshake or short-lived connection
    tokens?
22. How will WebSocket token expiration be handled?
23. What exact Lab Protocol authentication handshake will be finalized?
24. What hardware-backed key storage will be required for production agents?
25. What exact authentication events will be retained?
26. What exact authentication SLOs and alerts will be defined?
27. How will identity-provider outage affect new job starts?
28. How will emergency credential revocation propagate to disconnected labs?
29. What exact delegated-service model will be required?
30. What exact authentication contract versioning policy will be adopted?

# 156. Full Acceptance Criteria — User Authentication

- [ ] OIDC/OAuth architecture is defined.
- [ ] Studio uses authorization code + PKCE.
- [ ] Web authentication flow is defined.
- [ ] Access tokens are short-lived.
- [ ] Refresh tokens are supported.
- [ ] Refresh tokens are securely stored.
- [ ] Refresh token rotation is implemented.
- [ ] Refresh replay is detected.
- [ ] Logout invalidates the appropriate session.
- [ ] Authentication failures are handled deterministically.

# 157. Full Acceptance Criteria — Access Tokens

- [ ] `iss` is validated.
- [ ] `sub` is validated.
- [ ] `aud` is validated.
- [ ] `exp` is validated.
- [ ] `iat` is validated.
- [ ] `nbf` is validated where present.
- [ ] `jti` is supported where required.
- [ ] Signature is verified.
- [ ] Signing algorithm is restricted by policy.
- [ ] Token type is validated.
- [ ] Scope is extracted securely.
- [ ] Token claims are never trusted before signature validation.

# 158. Full Acceptance Criteria — Claims

- [ ] User identity is represented by stable `sub`.
- [ ] Audience is explicit.
- [ ] Issuer is trusted.
- [ ] Expiration is explicit.
- [ ] Token issuance is auditable.
- [ ] Organization context is validated server-side.
- [ ] Roles are not treated as sufficient authorization.
- [ ] Scopes are explicit.
- [ ] Unknown optional claims do not break clients.
- [ ] Security-critical claims are validated.

# 159. Full Acceptance Criteria — Scopes

- [ ] Scope names are defined.
- [ ] Scope semantics are documented.
- [ ] Least privilege is enforced.
- [ ] Admin scopes are restricted.
- [ ] Execution scopes are restricted.
- [ ] Financial scopes are restricted.
- [ ] Artifact scopes are restricted.
- [ ] Scope checks are server-side.
- [ ] Missing scopes produce stable errors.
- [ ] Scope changes follow versioning policy.

# 160. Full Acceptance Criteria — Refresh

- [ ] Refresh tokens are rotated.
- [ ] Old refresh tokens are invalidated.
- [ ] Refresh replay is detected.
- [ ] Token families can be revoked.
- [ ] Refresh failure requires appropriate reauthentication.
- [ ] Refresh tokens are never logged.
- [ ] Concurrent refresh is coordinated.
- [ ] Access-token renewal does not change operation identity.
- [ ] Idempotency keys survive authentication retry.

# 161. Full Acceptance Criteria — Service Authentication

- [ ] Services have unique identities.
- [ ] Human tokens are not used as generic service credentials.
- [ ] Service scopes are least privilege.
- [ ] Service audiences are validated.
- [ ] Workload identity is preferred.
- [ ] Static service credentials are securely stored when unavoidable.
- [ ] Service credentials are rotated.
- [ ] Service authentication is audited.
- [ ] Revoked service identities are rejected.

# 162. Full Acceptance Criteria — Lab Agent

- [ ] Every Lab Agent has a unique identity.
- [ ] Lab connectivity uses TLS.
- [ ] mTLS is supported.
- [ ] Server identity is validated.
- [ ] Client identity is validated.
- [ ] Agent registration is controlled.
- [ ] Agent certificates have bounded lifetime.
- [ ] Certificates can rotate.
- [ ] Certificates can be revoked.
- [ ] Revoked agents cannot reconnect.
- [ ] Agent authorization is separate from authentication.
- [ ] Agent identity survives normal restart.

# 163. Full Acceptance Criteria — WebSocket

- [ ] WebSocket connections are authenticated.
- [ ] Authentication occurs during connection establishment.
- [ ] Access tokens are not unnecessarily placed in URLs.
- [ ] Connection identity is recorded.
- [ ] Subscription authorization is enforced.
- [ ] Command authorization is enforced.
- [ ] Token expiration is handled.
- [ ] Reconnect performs authentication.
- [ ] Reconnect performs state reconciliation.
- [ ] Cross-tenant events are impossible.

# 164. Full Acceptance Criteria — Failure Handling

- [ ] Missing credentials return authentication failure.
- [ ] Invalid credentials are rejected.
- [ ] Expired tokens are rejected.
- [ ] Revoked tokens are rejected.
- [ ] Invalid audiences are rejected.
- [ ] Invalid issuers are rejected.
- [ ] Invalid signatures are rejected.
- [ ] Missing scopes produce authorization failure.
- [ ] Authentication failure does not expose secrets.
- [ ] Clients distinguish 401 from 403.

# 165. Full Acceptance Criteria — Rotation

- [ ] Identity-provider signing keys can rotate.
- [ ] API key caches refresh safely.
- [ ] Access tokens continue validating during normal key overlap.
- [ ] Refresh tokens rotate.
- [ ] Service credentials rotate.
- [ ] Lab certificates rotate.
- [ ] Credential overlap is supported where required.
- [ ] Old credentials can be retired.
- [ ] Emergency revocation is supported.
- [ ] Rotation is observable.

# 166. Full Acceptance Criteria — Security

- [ ] TLS is mandatory for network authentication.
- [ ] Private keys are protected.
- [ ] Tokens are not logged.
- [ ] Refresh tokens are not logged.
- [ ] Secrets are not committed to source control.
- [ ] Authentication is tenant-aware.
- [ ] Authorization is server-side.
- [ ] Internal network location is not sufficient trust.
- [ ] Admin access has stronger controls.
- [ ] Physical safety is independent of authentication.

# 167. Full Acceptance Criteria — Jobs

- [ ] Job identity is independent of user session lifetime.
- [ ] Access-token expiry does not unexpectedly terminate a job.
- [ ] Job commands require appropriate scopes.
- [ ] Execution initiator is auditable.
- [ ] Reauthentication can restore observation/control.
- [ ] Revoked users cannot perform new unauthorized control actions.
- [ ] Existing job state remains authoritative.
- [ ] Lab execution uses authenticated machine identity.

# 168. Full Acceptance Criteria — Observability

- [ ] Authentication success is measurable.
- [ ] Authentication failure is measurable.
- [ ] Refresh failure is measurable.
- [ ] Refresh replay is measurable.
- [ ] Agent authentication is measurable.
- [ ] mTLS failures are measurable.
- [ ] WebSocket authentication failures are measurable.
- [ ] Authentication method is auditable.
- [ ] Principal identity is auditable.
- [ ] Sensitive credentials never appear in telemetry.

# 169. Full Acceptance Criteria — Versioning

- [ ] Authentication changes follow `VERSIONING.md`.
- [ ] Breaking token-contract changes use explicit migration.
- [ ] Scope changes are documented.
- [ ] Lab authentication changes are versioned.
- [ ] WebSocket authentication changes are versioned.
- [ ] Service identity changes are migrated.
- [ ] Security emergencies may shorten migration windows.
- [ ] Deprecated authentication mechanisms are monitored.
- [ ] Retired authentication mechanisms are rejected explicitly.

# 170. Full Acceptance Criteria — Production

- [ ] Authentication infrastructure is highly available.
- [ ] Identity-provider dependencies are monitored.
- [ ] Certificate infrastructure is monitored.
- [ ] Token signing-key rotation is tested.
- [ ] Refresh-token rotation is tested.
- [ ] Lab certificate rotation is tested.
- [ ] Authentication failure runbooks exist.
- [ ] Credential compromise runbooks exist.
- [ ] Agent compromise runbooks exist.
- [ ] Emergency revocation is tested.
- [ ] Production audit records are retained according to policy.

# 171. Architectural Invariants

The following are mandatory:

1. Authentication and authorization remain separate concerns.
2. User authentication uses a standards-based identity mechanism.
3. Studio authentication uses PKCE.
4. Access tokens are short-lived.
5. Refresh tokens are protected and rotated.
6. Refresh-token replay can invalidate the token family.
7. Service identities are separate from human identities.
8. Service credentials use least privilege.
9. Lab Agents have unique cryptographic identities.
10. Lab connectivity uses mutual authentication.
11. WebSocket connections require authentication.
12. WebSocket subscriptions require authorization.
13. Token claims are trusted only after signature and issuer/audience validation.
14. Organization context is validated server-side.
15. Authentication credentials are never logged.
16. Token expiration does not equal job termination.
17. Physical robot safety does not depend on cloud authentication.
18. Authentication retry preserves idempotency identity.
19. Credential rotation must support controlled overlap.
20. Revoked credentials cannot reconnect.
21. Internal network location is not sufficient trust.
22. Authentication failures fail closed for protected operations.
23. Long-running operations use durable operation identity.
24. Authentication contracts follow the platform versioning policy.
25. Security policy may force immediate credential or protocol retirement.

# 172. Final Production Baseline

The Kritva RaaS authentication model is:

    HUMAN USER
        |
        v
    OIDC / OAuth 2.0
        |
        v
    Access Token + Refresh Token
        |
        v
    Studio / Web Console
        |
        | Bearer Token
        v
    RaaS Control Plane
        |
        +--> Authentication
        |
        +--> Authorization
        |
        +--> Tenant Isolation
        |
        v
    Jobs / Booking / Artifacts / Credits / Results

Machine authentication is separate:

    Control Plane
        |
        | mTLS
        v
    Lab Agent
        |
        | authenticated local channel
        v
    Kritva Runtime
        |
        v
    Robot

The core security rules are:

> **Authenticate the principal before processing protected protocol commands.**

> **Validate issuer, audience, signature, lifetime, token type, and required
> claims before trusting token identity.**

> **Use short-lived access tokens and rotating refresh tokens for user sessions.**

> **Use dedicated, least-privileged service identities for machine-to-machine
> communication.**

> **Use unique cryptographic identities and mutual TLS for Lab Agents.**

> **Authenticate WebSocket connections and authorize every subscription and
> command.**

> **Never expose or log credentials.**

> **Authentication establishes identity; authorization determines permission;
> physical safety remains local and independent.**

This architecture provides a secure authentication foundation for Kritva RaaS
while preserving the previously established boundaries between Studio,
Control Plane, cloud infrastructure, Lab Agent, Kritva Runtime, and physical
robot systems.
