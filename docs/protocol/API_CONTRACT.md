# Kritva RaaS REST API Contract

**Document:** `docs/protocol/API_CONTRACT.md`  
**Status:** Normative contract  
**API base path:** `/api/v1`  
**API contract version:** `1.0.0`  
**Media type:** `application/json`  
**Character encoding:** UTF-8  
**Transport:** HTTPS  
**Architecture reference:** `docs/architecture/PROTOCOL_ARCHITECTURE.md`  
**Related contracts:** `docs/protocol/EVENT_CONTRACT.md`, `docs/protocol/WEBSOCKET_CONTRACT.md`, `docs/protocol/LAB_PROTOCOL.md`, `docs/protocol/ARTIFACT_MANIFEST.md`  
**Canonical phase definitions:** `docs/planning/PHASES.md`

---

## 1. Purpose

This document defines the normative HTTP REST API contract for Kritva RaaS.

It specifies the resource model, endpoint catalogue, authentication and authorization requirements, request and response representations, error behavior, pagination, filtering, idempotency, rate limiting, concurrency control, versioning, compatibility, and OpenAPI generation.

The contract establishes the public API boundary between clients and the Kritva RaaS platform.

The API MUST remain independent of internal service classes, database table names, message broker implementations, and deployment topology.

Implementations MUST expose only the operations documented by this contract or by an explicitly approved compatible extension.

## 2. Normative language

The terms MUST, MUST NOT, REQUIRED, SHALL, SHALL NOT, SHOULD, SHOULD NOT, RECOMMENDED, NOT RECOMMENDED, MAY, and OPTIONAL are normative.

- MUST and MUST NOT define mandatory requirements.
- SHOULD and SHOULD NOT define recommendations that require a documented reason when not followed.
- MAY defines an allowed implementation choice.
- OPTIONAL identifies a field or behavior that may be absent where the schema permits it.

A request or response that violates a REQUIRED constraint MUST be rejected or handled according to the error behavior specified here.

An implementation MUST NOT silently change the meaning of a documented field, endpoint, status code, or authorization scope.

## 3. API design principles

The API MUST follow these principles:

1. Resources use stable, opaque identifiers.
2. Collection and resource paths use lowercase plural nouns.
3. HTTP methods communicate the operation being performed.
4. JSON field names use `snake_case`.
5. Timestamps use UTC RFC 3339 serialization.
6. Authentication and authorization are enforced server-side.
7. Tenant isolation applies to every tenant-owned resource.
8. Long-running work is represented by durable jobs and runs.
9. Event delivery and REST resource retrieval remain separate contracts.
10. Mutating operations MUST define retry and concurrency behavior.
11. Error responses MUST provide stable machine-readable codes.
12. API schemas MUST be suitable for OpenAPI generation and automated conformance testing.

## 4. API base path and transport

All endpoints in this document are relative to:

    /api/v1

The production API MUST use HTTPS.

A production deployment MUST NOT transmit bearer credentials over unencrypted HTTP.

Development environments MAY use local HTTP only when explicitly configured and isolated from production credentials and data.

The server MUST reject unsupported request content types with `415 Unsupported Media Type`.

The server MUST return JSON for successful API responses unless an endpoint explicitly defines a binary or streaming response.

The server MUST use `application/json` for JSON response bodies.

Clients SHOULD send:

    Accept: application/json

Mutating JSON requests SHOULD send:

    Content-Type: application/json

## 5. Resource model

The canonical public resources are:

| Resource | Collection path | Primary identifier |
|---|---|---|
| Authentication sessions | `/auth/sessions` | `session_id` |
| Users | `/users` | `user_id` |
| Organizations | `/organizations` | `organization_id` |
| Projects | `/projects` | `project_id` |
| Platforms | `/platforms` | `platform_id` |
| Artifacts | `/artifacts` | `artifact_id` |
| Bookings | `/bookings` | `booking_id` |
| Credit accounts | `/credits/accounts` | `credit_account_id` |
| Credit transactions | `/credits/transactions` | `transaction_id` |
| Jobs | `/jobs` | `job_id` |
| Runs | `/runs` | `run_id` |
| Results | `/results` | `result_id` |
| Labs | `/labs` | `lab_id` |

The resource identifier MUST be treated as opaque by clients.

Clients MUST NOT derive resource ownership, tenant membership, or authorization from the textual form of an identifier.

The server MUST validate resource relationships and authorization independently of the path supplied by the client.

## 6. Identifier and naming rules

All public resource identifiers MUST be non-empty strings.

The server MUST generate identifiers unless a specific endpoint explicitly supports client-generated identifiers.

Identifiers MUST remain stable for the lifetime of the resource.

Identifiers MUST NOT contain credentials or other secrets.

JSON property names MUST use `snake_case`.

Path parameter names shown in this contract are descriptive placeholders and are not literal path segments.

For example, `/api/v1/projects/{project_id}` identifies a project resource whose identifier is supplied in the path.

Clients MUST URL-encode identifiers when necessary.

## 7. Common JSON conventions

JSON objects MUST use the documented property names.

Unknown request properties MUST be rejected with `400 Bad Request` unless the endpoint schema explicitly allows extension properties.

Consumers of API responses SHOULD ignore unknown response properties to preserve forward compatibility.

A missing OPTIONAL property is distinct from a property whose value is `null`.

Unless a schema explicitly permits `null`, clients MUST omit optional fields rather than send `null`.

The server MUST reject malformed JSON.

The server MUST reject NaN, Infinity, negative Infinity, and other non-standard JSON numeric values.

Numeric fields MUST be within the range specified by their schema.

Currency, credit quantities, and accounting amounts MUST use integer minor units or an explicitly documented integer credit unit. They MUST NOT use binary floating-point values.

## 8. Timestamp conventions

API timestamps MUST use UTC RFC 3339 strings with a `Z` suffix.

The canonical representation SHOULD include millisecond precision.

Example:

    "created_at": "2026-10-09T07:30:00.000Z"

Clients MUST NOT submit local timestamps without an explicit timezone.

The server MUST reject invalid timestamps and timestamps that violate endpoint-specific constraints.

The server MUST serialize timestamps consistently across resource types.

A timestamp representing a completed operation MUST NOT be populated before the operation has completed.

## 9. Authentication model

The API MUST authenticate protected requests using a supported platform authentication mechanism.

For user-facing clients, the baseline mechanism is an OAuth 2.0 access token presented as a bearer token.

Protected requests MUST include:

    Authorization: Bearer <access_token>

The placeholder above MUST be replaced by a valid access token and MUST NOT be sent literally.

The server MUST validate token integrity, issuer, audience, expiration, and applicable authorization claims.

The server MUST reject missing or invalid credentials with `401 Unauthorized`.

The server MUST NOT treat a user ID, tenant ID, organization ID, or role supplied in a request body as proof of identity or authorization.

Service-to-service callers MUST use an approved workload identity or service credential mechanism.

Long-lived secrets MUST NOT be embedded in browser applications or distributed client binaries.

## 10. Authentication sessions

Authentication session endpoints manage the API's supported session lifecycle.

An authentication implementation MUST define the identity provider and credential exchange mechanism used by the deployment.

The REST API MUST NOT require clients to send account passwords to resource endpoints.

Refresh tokens, when supported, MUST be handled only by the designated authentication mechanism.

Access tokens MUST NOT be written into application logs.

### 10.1 Authentication endpoints

| Method | Path | Scope | Purpose |
|---|---|---|---|
| POST | `/auth/sessions` | `auth:login` | Establish an authenticated session |
| GET | `/auth/sessions/current` | `auth:read` | Retrieve the current session |
| DELETE | `/auth/sessions/current` | `auth:logout` | Revoke the current session |
| POST | `/auth/sessions/refresh` | `auth:refresh` | Refresh a session when enabled |

The deployment MUST document the credential or identity-provider flow supported by `POST /auth/sessions`.

The request and response schemas below define the platform-facing session contract, not a requirement to implement password-based authentication.

### 10.2 Create session

`POST /api/v1/auth/sessions`

The request MUST contain the identity-provider credential exchange data required by the configured authentication mechanism.

A deployment MUST NOT accept arbitrary unverified identity claims.

A successful response MUST contain `session_id`, `access_token`, `token_type`, and `expires_at` when the platform is responsible for issuing those values.

`token_type` MUST be `Bearer`.

`expires_at` MUST be a UTC RFC 3339 timestamp.

Example response:

    {
        "session_id": "session-001",
        "access_token": "<issued-access-token>",
        "token_type": "Bearer",
        "expires_at": "2026-10-09T08:30:00.000Z"
    }

A session creation failure MUST NOT return a partially valid access token.

### 10.3 Current session

`GET /api/v1/auth/sessions/current`

The response MUST describe the authenticated principal and session.

The response MUST NOT include a refresh token or secret credential.

Example response:

    {
        "session_id": "session-001",
        "user_id": "user-001",
        "tenant_id": "tenant-001",
        "issued_at": "2026-10-09T07:30:00.000Z",
        "expires_at": "2026-10-09T08:30:00.000Z"
    }

### 10.4 Logout and refresh

`DELETE /api/v1/auth/sessions/current` MUST revoke the current session when server-side revocation is supported.

A successful logout MUST return `204 No Content`.

`POST /api/v1/auth/sessions/refresh` MUST validate the refresh credential using the configured authentication mechanism.

The server MUST reject revoked, expired, malformed, or replayed refresh credentials according to the authentication policy.

## 11. Authorization scopes

Protected operations MUST require the appropriate scope and resource-level permission.

The following scope names define the baseline vocabulary:

| Scope | Permission |
|---|---|
| `auth:login` | Establish a session |
| `auth:read` | Read current session information |
| `auth:logout` | Revoke the current session |
| `auth:refresh` | Refresh an authorized session |
| `users:read` | Read authorized user information |
| `users:write` | Modify permitted user information |
| `organizations:read` | Read organizations |
| `organizations:write` | Create or modify organizations |
| `projects:read` | Read projects |
| `projects:write` | Create or modify projects |
| `platforms:read` | Read platform definitions |
| `platforms:write` | Create or modify permitted platform definitions |
| `artifacts:read` | Read authorized artifact metadata |
| `artifacts:write` | Create or modify authorized artifacts |
| `bookings:read` | Read bookings |
| `bookings:write` | Create or modify permitted bookings |
| `credits:read` | Read credit accounts and transactions |
| `credits:write` | Perform permitted credit operations |
| `jobs:read` | Read jobs |
| `jobs:write` | Submit or modify permitted jobs |
| `runs:read` | Read runs |
| `runs:write` | Perform permitted run-control operations |
| `results:read` | Read result metadata and authorized outputs |
| `results:write` | Publish or modify permitted result metadata |
| `labs:read` | Read lab metadata and health |
| `labs:write` | Perform permitted lab administration |
| `admin:read` | Read authorized administrative information |
| `admin:write` | Perform explicitly authorized administrative operations |

A scope grants a category of permission; it MUST NOT bypass tenant isolation or resource ownership checks.

The server MAY enforce narrower resource-level permissions in addition to scopes.

An API implementation MUST document any additional scopes before exposing the associated endpoint.

## 12. Common request headers

| Header | Requirement | Purpose |
|---|---|---|
| `Authorization` | Required for protected endpoints | Bearer or approved service credential |
| `Content-Type` | Required for JSON request bodies | Declares request media type |
| `Accept` | Recommended | Declares acceptable response media type |
| `Idempotency-Key` | Required where specified | Deduplicates retried mutations |
| `If-Match` | Required for protected conditional updates where specified | Optimistic concurrency control |
| `X-Correlation-ID` | Optional | Request correlation |
| `X-Request-ID` | Server-generated or accepted under policy | Request diagnostics |

The server MUST validate any client-supplied correlation identifier against configured length and character constraints.

The server MUST NOT use correlation identifiers as authentication credentials.

The server MUST return a server-generated request identifier when one is available.

## 13. Common response envelope

Successful responses MUST use the resource representation defined by the endpoint.

Collection endpoints MUST use the pagination envelope in Section 15.

Error responses MUST use the error envelope in Section 18.

The server MUST NOT return a success response when the requested operation failed.

A successful `204 No Content` response MUST have no response body.

The server MUST use the appropriate HTTP status code for the operation outcome.

## 14. Common resource metadata

Where applicable, resource representations SHOULD contain:

| Field | Type | Meaning |
|---|---|---|
| `id` | string | Resource identifier |
| `created_at` | string | Resource creation time |
| `updated_at` | string | Most recent committed update time |
| `version` | integer | Resource revision |
| `tenant_id` | string | Owning tenant identifier |

A resource schema MAY use a domain-specific identifier such as `project_id` instead of `id`.

The selected representation MUST remain consistent within that resource type.

`version` MUST be a positive integer when present.

`updated_at` MUST change when a committed modification changes the public resource representation.

Clients MUST NOT modify server-managed metadata unless an endpoint explicitly permits it.

## 15. Pagination contract

Collection endpoints MUST support bounded pagination.

The baseline pagination query parameters are:

| Parameter | Type | Default | Constraint |
|---|---|---|---|
| `limit` | integer | `50` | Minimum 1, maximum 100 |
| `cursor` | string | Absent | Opaque continuation cursor |

A deployment MAY support a lower maximum limit.

A deployment MUST NOT silently return more items than the requested limit.

The server SHOULD use cursor-based pagination for mutable collections.

A cursor MUST be opaque and MUST NOT be interpreted or modified by clients.

The server MUST bind a cursor to the applicable query, tenant, sort order, and authorization scope.

A cursor MUST NOT be reusable across incompatible filters or tenants.

### 15.1 Collection response

A collection response MUST contain `items` and `page`.

`items` MUST be an array.

`page` MUST contain `limit`, `has_more`, and `next_cursor`.

`next_cursor` MUST be a string when more results are available and MUST be `null` when no additional results are available.

Example:

    {
        "items": [
            {
                "project_id": "project-001",
                "name": "robot-demo",
                "status": "ACTIVE"
            }
        ],
        "page": {
            "limit": 50,
            "has_more": false,
            "next_cursor": null
        }
    }

A client MUST stop requesting pages when `has_more` is `false`.

A client MUST treat a cursor as a continuation token, not as a resource identifier.

## 16. Filtering and sorting

Collection endpoints MAY support documented filters.

Supported filters MUST be listed in the endpoint's OpenAPI operation.

Undocumented query parameters MUST be rejected with `400 Bad Request` unless the endpoint explicitly allows extensions.

Filters MUST be validated for type, length, allowed values, and authorization scope.

The baseline filter conventions are:

- `status`: exact match against documented enum values.
- `created_after`: inclusive lower timestamp bound.
- `created_before`: exclusive upper timestamp bound.
- `updated_after`: inclusive lower timestamp bound.
- `updated_before`: exclusive upper timestamp bound.
- `project_id`: exact project identifier match where applicable.
- `organization_id`: exact organization identifier match where applicable.
- `resource_id`: exact resource identifier match where applicable.
- `job_id`: exact job identifier match where applicable.
- `run_id`: exact run identifier match where applicable.

Timestamp filters MUST use UTC RFC 3339 values.

If both lower and upper bounds are supplied, the lower bound MUST precede the upper bound.

A collection MUST use a deterministic default ordering.

When sorting is supported, the allowed sort fields and direction syntax MUST be documented.

Clients MUST NOT assume that a field is sortable merely because it is returned in a resource representation.

## 17. Request validation

The server MUST validate requests before performing domain side effects.

Validation MUST include:

- HTTP method and path.
- Authentication and authorization.
- Content type and JSON syntax.
- Required fields and JSON types.
- String lengths and character constraints.
- Numeric ranges.
- Enum values.
- Resource existence and relationships.
- Tenant ownership.
- State-transition preconditions.
- Idempotency requirements.
- Concurrency preconditions.
- Configured request-size limits.

A validation failure MUST return a documented client error.

A server MUST NOT partially commit a domain mutation when validation fails.

If a multi-resource operation is supported, its atomicity semantics MUST be explicitly documented.

## 18. Error response contract

Errors MUST use the following JSON representation:

    {
        "error": {
            "code": "VALIDATION_ERROR",
            "message": "The request contains invalid fields.",
            "retryable": false,
            "request_id": "req-7a91",
            "correlation_id": "workflow-9f2c",
            "details": [
                {
                    "field": "name",
                    "code": "REQUIRED_FIELD",
                    "message": "The field is required."
                }
            ]
        }
    }

The `error` object MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `code` | string | Required |
| `message` | string | Required |
| `retryable` | boolean | Required |
| `request_id` | string or null | Required |
| `correlation_id` | string or null | Required |
| `details` | array | Required |

Each `details` entry MUST contain `field`, `code`, and `message` when field-level details are available.

`details` MAY be an empty array.

Error messages MUST NOT contain credentials, private keys, access tokens, or sensitive stack traces.

Clients MUST branch on `code` or HTTP status, not on human-readable message text.

## 19. Standard HTTP status codes

| Status | Meaning |
|---|---|
| `200 OK` | Request succeeded with a response representation |
| `201 Created` | Resource created |
| `202 Accepted` | Asynchronous operation accepted but not completed |
| `204 No Content` | Request succeeded without a response body |
| `400 Bad Request` | Malformed request or invalid query parameters |
| `401 Unauthorized` | Authentication is missing or invalid |
| `403 Forbidden` | Authenticated caller lacks permission |
| `404 Not Found` | Resource does not exist or is not visible to the caller |
| `405 Method Not Allowed` | Method is not supported for the path |
| `409 Conflict` | State or idempotency conflict |
| `410 Gone` | Resource or replayable representation is permanently unavailable |
| `412 Precondition Failed` | Conditional request precondition failed |
| `413 Content Too Large` | Request body exceeds the configured limit |
| `415 Unsupported Media Type` | Unsupported request media type |
| `422 Unprocessable Content` | Syntactically valid request violates domain constraints |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server failure |
| `502 Bad Gateway` | Upstream dependency returned an invalid response |
| `503 Service Unavailable` | Service temporarily unavailable |
| `504 Gateway Timeout` | Upstream operation timed out |

The server MUST NOT return `200 OK` for a failed domain operation.

The server SHOULD use `404 Not Found` when revealing the existence of a protected resource would disclose information to an unauthorized caller.

## 20. Standard error codes

The API MUST use stable machine-readable error codes.

| Code | Meaning | Typical status |
|---|---|---|
| `VALIDATION_ERROR` | Request fields failed validation | 400 |
| `INVALID_JSON` | Request body is malformed JSON | 400 |
| `UNAUTHENTICATED` | Authentication is missing or invalid | 401 |
| `FORBIDDEN` | Permission is insufficient | 403 |
| `RESOURCE_NOT_FOUND` | Resource is absent or not visible | 404 |
| `METHOD_NOT_ALLOWED` | HTTP method is unsupported | 405 |
| `STATE_CONFLICT` | Requested state transition conflicts with current state | 409 |
| `IDEMPOTENCY_CONFLICT` | Idempotency key conflicts with prior request content | 409 |
| `VERSION_CONFLICT` | Resource revision conflicts with request precondition | 412 |
| `RESOURCE_GONE` | Resource is permanently unavailable | 410 |
| `PAYLOAD_TOO_LARGE` | Request body exceeds limit | 413 |
| `UNSUPPORTED_MEDIA_TYPE` | Content type is unsupported | 415 |
| `DOMAIN_CONSTRAINT_VIOLATION` | Request violates domain rules | 422 |
| `RATE_LIMITED` | Caller exceeded a configured limit | 429 |
| `TEMPORARY_UNAVAILABLE` | A transient dependency is unavailable | 503 |
| `UPSTREAM_TIMEOUT` | An upstream dependency timed out | 504 |
| `INTERNAL_ERROR` | Unexpected server error | 500 |

The server MAY define additional documented error codes.

A code MUST retain the same meaning across compatible API revisions.

## 21. Idempotency contract

Mutating operations that create billable, reservable, or executable work MUST support idempotency where explicitly required by the endpoint catalogue.

Clients MUST send `Idempotency-Key` for those operations.

The value MUST be a non-empty opaque string with a maximum length of 255 characters.

The server MUST scope idempotency records by authenticated principal, tenant, operation, and key.

The server MUST associate the key with a fingerprint of the canonical request content.

Repeating the same operation with the same key and equivalent request content MUST return the original logical outcome.

Reusing the same key with conflicting request content MUST return `409 Conflict` with `IDEMPOTENCY_CONFLICT`.

The server MUST NOT execute the same logical billable operation twice because of a retry.

The server MUST document the idempotency-record retention period.

Clients SHOULD reuse the same key when retrying after a network timeout where the operation outcome is unknown.

## 22. Concurrency and conditional updates

Resource updates SHOULD support optimistic concurrency control.

Where an endpoint requires `If-Match`, the client MUST provide the current resource ETag.

The server MUST return `412 Precondition Failed` if the ETag does not match the current resource representation.

A successful update MUST produce a new ETag when the resource representation changes.

A client MUST NOT assume that a previous ETag remains valid after another update.

If an endpoint uses a body `version` field instead of an ETag, that behavior MUST be explicitly documented in its schema.

A resource MUST NOT be updated using both conflicting revision preconditions.

## 23. Endpoint catalogue conventions

The endpoint tables below define the baseline public API.

Every protected endpoint MUST enforce authentication, scope, tenant isolation, resource-level authorization, and request validation.

`{id}` path variables MUST be replaced with the identifier for the relevant resource type.

Request and response schemas are defined in the endpoint sections.

If an endpoint is not enabled in a deployment, the deployment MUST document that availability.

An implementation MUST NOT claim endpoint support merely because a route returns a generic response.

## 24. User endpoints

| Method | Path | Scope | Success |
|---|---|---|---|
| GET | `/users` | `users:read` | 200 |
| POST | `/users` | `users:write` | 201 |
| GET | `/users/{user_id}` | `users:read` | 200 |
| PATCH | `/users/{user_id}` | `users:write` | 200 |
| DELETE | `/users/{user_id}` | `users:write` | 204 |

### 24.1 List users

`GET /api/v1/users`

The endpoint MUST return only users visible to the caller.

Supported query parameters MAY include `limit`, `cursor`, `organization_id`, and `status`.

The response MUST use the collection envelope.

The server MUST NOT expose private authentication credentials or internal security attributes in user representations.

### 24.2 Create user

`POST /api/v1/users`

The request MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `email` | string | Required |
| `display_name` | string | Required |
| `organization_id` | string | Optional, subject to authorization |

`email` MUST be validated and normalized according to the identity policy.

`display_name` MUST be non-empty after trimming whitespace.

The server MUST NOT allow an unprivileged caller to create users in an unauthorized organization.

The response MUST contain `user_id`, `email`, `display_name`, and `status`.

### 24.3 Get user

`GET /api/v1/users/{user_id}`

The response MUST return the authorized public user representation.

The server MUST return `404 Not Found` when the user is absent or not visible to the caller.

### 24.4 Update user

`PATCH /api/v1/users/{user_id}`

The request MAY contain `display_name` and other explicitly permitted mutable fields.

The request MUST NOT change immutable identifiers or privileged authorization attributes unless a dedicated administrative operation permits the change.

The server MUST validate the full resulting resource state.

### 24.5 Delete user

`DELETE /api/v1/users/{user_id}`

Deletion MUST follow the platform's account lifecycle and data-retention policy.

If physical deletion is not permitted, the implementation MAY deactivate or logically delete the account, but MUST document the semantics.

A successful deletion or deactivation MUST return `204 No Content`.

## 25. Organization endpoints

| Method | Path | Scope | Success |
|---|---|---|---|
| GET | `/organizations` | `organizations:read` | 200 |
| POST | `/organizations` | `organizations:write` | 201 |
| GET | `/organizations/{organization_id}` | `organizations:read` | 200 |
| PATCH | `/organizations/{organization_id}` | `organizations:write` | 200 |
| GET | `/organizations/{organization_id}/members` | `organizations:read` | 200 |
| PUT | `/organizations/{organization_id}/members/{user_id}` | `organizations:write` | 204 |
| DELETE | `/organizations/{organization_id}/members/{user_id}` | `organizations:write` | 204 |

### 25.1 Organization representation

Organization resources MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `organization_id` | string | Required |
| `name` | string | Required |
| `status` | string | Required |
| `created_at` | string | Required |
| `updated_at` | string | Required |

`status` MUST be one of `ACTIVE`, `SUSPENDED`, or `DELETED`.

### 25.2 Create organization

`POST /api/v1/organizations`

The request MUST contain `name`.

The server MUST validate the caller's permission to create an organization.

A successful response MUST return `201 Created` and the created organization representation.

### 25.3 Organization membership

`GET /api/v1/organizations/{organization_id}/members` MUST return a paginated collection.

`PUT /api/v1/organizations/{organization_id}/members/{user_id}` MUST create or confirm membership idempotently.

The membership operation MUST validate both resource identities and the caller's organization-administration permission.

`DELETE /api/v1/organizations/{organization_id}/members/{user_id}` MUST remove the membership where permitted.

Membership changes MUST NOT grant permissions beyond the role or policy authorized by the operation.

### 25.4 Organization coding-agent policy

| Method | Path | Scope | Success |
|---|---|---|---|
| GET | `/organizations/{organization_id}/coding-agent-policy` | `organizations:read` | 200 |
| PUT | `/organizations/{organization_id}/coding-agent-policy` | `organizations:write` (organization administrator role required) | 200 |

The policy governs the use of coding agents in Studio. Architecture: `docs/architecture/CODING_AGENT_INTEGRATION.md` Section 8.1. The policy resource MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `organization_id` | string | Required |
| `enabled` | boolean | Required |
| `allowed_providers` | array of string | Required; each value MUST be a `provider_id` from Section 27.4 |
| `max_permission_mode` | string | Required; `READ_ONLY` or `PROPOSE`. `WORKSPACE_WRITE` is reserved and MUST be rejected until enabled by a decision record |
| `require_consent` | boolean | Required; MUST be `true` |
| `mcp_enabled` | boolean | Required |
| `allowed_mcp_tools` | array of string | Required; each value MUST be a documented Kritva Studio MCP tool name |
| `min_isolation_tier` | string | Required; `A` or `C` |
| `require_config_isolation` | boolean | Required |
| `max_cache_age_seconds` | integer | Required; 300 to 604800 |
| `configured` | boolean | Required; server-assigned. `false` only when no administrator has ever set a policy |
| `policy_version` | integer | Required; server-assigned, incremented on every change |
| `updated_at` | string | Required |
| `updated_by` | string | Required |

When no policy has been set, `GET` MUST return 200 with `configured: false`, `policy_version` = 0 and the default field values (`docs/architecture/CODING_AGENT_INTEGRATION.md` Section 8.1). Under the recommended SYS-ADR-007 Option 2, `enabled` is `false` in this response. A client MUST treat `configured: false` as `POLICY_UNCONFIGURED` and MUST treat any error response or transport failure as `POLICY_UNAVAILABLE`; it MUST NOT infer one from the other. The response MUST include an `ETag`. `configured` is read-only and MUST be rejected in `PUT`.

`PUT` MUST require `If-Match`, MUST validate every provider and tool identifier, and MUST reject `require_consent: false`. It MUST emit an audit event containing the previous and new policy.

The server MUST reject any request field not listed above. Source code, prompts, transcripts, diffs, file names and paths MUST never be accepted by this resource.

## 26. Project endpoints

| Method | Path | Scope | Success |
|---|---|---|---|
| GET | `/projects` | `projects:read` | 200 |
| POST | `/projects` | `projects:write` | 201 |
| GET | `/projects/{project_id}` | `projects:read` | 200 |
| PATCH | `/projects/{project_id}` | `projects:write` | 200 |
| DELETE | `/projects/{project_id}` | `projects:write` | 204 |
| GET | `/projects/{project_id}/artifacts` | `artifacts:read` | 200 |
| GET | `/projects/{project_id}/jobs` | `jobs:read` | 200 |

### 26.1 Project representation

Project resources MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `project_id` | string | Required |
| `organization_id` | string | Required |
| `name` | string | Required |
| `description` | string or null | Optional |
| `status` | string | Required |
| `created_at` | string | Required |
| `updated_at` | string | Required |
| `version` | integer | Required |

`status` MUST be one of `ACTIVE`, `ARCHIVED`, or `DELETED`.

### 26.2 Create project

`POST /api/v1/projects`

The request MUST contain `organization_id` and `name`.

The request MAY contain `description`.

The server MUST validate organization membership and project-creation permissions.

Example request:

    {
        "organization_id": "org-001",
        "name": "humanoid-demo",
        "description": "Reference robot development project"
    }

A successful response MUST return `201 Created` and the complete project representation.

### 26.3 Update and delete project

`PATCH /api/v1/projects/{project_id}` MAY update `name`, `description`, and other documented mutable fields.

The server MUST reject attempts to change `project_id` or `organization_id` through this endpoint.

`DELETE /api/v1/projects/{project_id}` MUST follow the project's retention and dependency policy.

The server MUST NOT silently delete dependent jobs, runs, artifacts, or results where retention obligations remain.

### 26.4 Project collections

The artifact and job subresource endpoints MUST apply the same authorization rules as the corresponding top-level collections.

A client MUST NOT gain access to an artifact or job merely by knowing its project identifier.

## 27. Platform endpoints

| Method | Path | Scope | Success |
|---|---|---|---|
| GET | `/platforms` | `platforms:read` | 200 |
| POST | `/platforms` | `platforms:write` | 201 |
| GET | `/platforms/{platform_id}` | `platforms:read` | 200 |
| PATCH | `/platforms/{platform_id}` | `platforms:write` | 200 |
| GET | `/platforms/{platform_id}/capabilities` | `platforms:read` | 200 |

### 27.1 Platform representation

Platform resources MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `platform_id` | string | Required |
| `name` | string | Required |
| `platform_type` | string | Required |
| `status` | string | Required |
| `capabilities` | array | Required |
| `created_at` | string | Required |
| `updated_at` | string | Required |

`platform_type` MUST identify a registered platform category.

`status` MUST be one of `ACTIVE`, `INACTIVE`, `DEGRADED`, or `RETIRED`.

Each capability MUST be a documented capability identifier or a schema-defined capability object.

### 27.2 Create platform

`POST /api/v1/platforms`

The request MUST contain `name` and `platform_type`.

The request MAY contain `capabilities` when the caller is authorized to register them.

The server MUST validate all submitted capability identifiers.

A client MUST NOT be able to assert that a physical resource is safe or available merely by registering a platform capability.

### 27.3 Platform capability retrieval

`GET /api/v1/platforms/{platform_id}/capabilities` MUST return a representation of the capabilities currently registered for the platform.

The response MUST distinguish declared capabilities from dynamically observed availability when both are represented.

### 27.4 Coding-agent provider metadata

| Method | Path | Scope | Success |
|---|---|---|---|
| GET | `/coding-agent-providers` | `platforms:read` | 200 |
| GET | `/coding-agent-providers/{provider_id}` | `platforms:read` | 200 |
| PUT | `/coding-agent-providers/{provider_id}` | `platforms:write` (platform operator) | 200 |

Coding-agent providers are not execution platforms. They MUST NOT appear in `/platforms` responses or in platform compatibility results. Architecture: `docs/architecture/CODING_AGENT_INTEGRATION.md` Section 8.2. Each provider resource MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `provider_id` | string | Required; stable, for example `claude-code` or `openai-codex` |
| `display_name` | string | Required |
| `status` | string | Required; one of `SUPPORTED`, `DEPRECATED`, `BLOCKED` |
| `adapter_versions` | string | Required; semver range of supported Kritva adapters |
| `cli_version_range` | string | Required; supported provider CLI versions |
| `capabilities` | object | Required; `permission_modes`, `supports_mcp`, `supports_streaming`, `supports_resume`, `change_reporting` |
| `disclosure_version` | string | Required; version of the consent and disclosure text Studio must show |
| `documentation_url` | string | Optional |
| `updated_at` | string | Required |

Collection responses MUST be cacheable (`ETag`). Changes MUST be audited.

## 28. Artifact endpoints

| Method | Path | Scope | Success |
|---|---|---|---|
| GET | `/artifacts` | `artifacts:read` | 200 |
| POST | `/artifacts` | `artifacts:write` | 201 |
| GET | `/artifacts/{artifact_id}` | `artifacts:read` | 200 |
| PATCH | `/artifacts/{artifact_id}` | `artifacts:write` | 200 |
| POST | `/artifacts/{artifact_id}/validate` | `artifacts:write` | 202 |
| POST | `/artifacts/{artifact_id}/publish` | `artifacts:write` | 202 |
| POST | `/artifacts/{artifact_id}/deprecate` | `artifacts:write` | 202 |
| GET | `/artifacts/{artifact_id}/manifest` | `artifacts:read` | 200 |

### 28.1 Artifact representation

Artifact resources MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `artifact_id` | string | Required |
| `project_id` | string | Required |
| `artifact_type` | string | Required |
| `name` | string | Required |
| `version` | string | Required |
| `status` | string | Required |
| `created_at` | string | Required |
| `updated_at` | string | Required |

`status` MUST be one of `REGISTERED`, `VALIDATING`, `VALIDATED`, `PUBLISHED`, `DEPRECATED`, `FAILED`, or `DELETED`.

Artifact manifest fields MUST conform to `docs/protocol/ARTIFACT_MANIFEST.md`.

### 28.2 Create artifact

`POST /api/v1/artifacts`

The request MUST contain `project_id`, `artifact_type`, `name`, and `version`.

The request MAY contain an immutable content reference or manifest reference defined by the artifact manifest contract.

The server MUST validate project access and artifact-type policy.

A successful response MUST return `201 Created`.

### 28.3 Validate artifact

`POST /api/v1/artifacts/{artifact_id}/validate`

The operation MUST be authorized and MUST validate the artifact using the registered validation policy.

The server SHOULD return `202 Accepted` when validation is asynchronous.

The response MUST identify the artifact and validation operation when the validation operation is asynchronous.

The artifact MUST NOT be reported as validated until validation has completed successfully.

### 28.4 Publish and deprecate artifact

`POST /api/v1/artifacts/{artifact_id}/publish` MUST publish only an artifact that satisfies the required validation and authorization policy.

`POST /api/v1/artifacts/{artifact_id}/deprecate` MUST require a documented reason code.

Both operations MAY return `202 Accepted` for asynchronous processing.

The corresponding lifecycle events MUST follow `docs/protocol/EVENT_CONTRACT.md`.

### 28.5 Get artifact manifest

`GET /api/v1/artifacts/{artifact_id}/manifest` MUST return the manifest representation defined by the artifact manifest contract.

The endpoint MUST enforce tenant and project authorization.

The endpoint MUST NOT expose private storage credentials or signed download references beyond their permitted lifetime.

## 29. Booking endpoints

| Method | Path | Scope | Success |
|---|---|---|---|
| GET | `/bookings` | `bookings:read` | 200 |
| POST | `/bookings` | `bookings:write` | 201 |
| GET | `/bookings/{booking_id}` | `bookings:read` | 200 |
| POST | `/bookings/{booking_id}/confirm` | `bookings:write` | 200 |
| POST | `/bookings/{booking_id}/cancel` | `bookings:write` | 200 |
| POST | `/bookings/{booking_id}/reschedule` | `bookings:write` | 200 |

### 29.1 Booking representation

Booking resources MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `booking_id` | string | Required |
| `resource_id` | string | Required |
| `status` | string | Required |
| `starts_at` | string | Required |
| `ends_at` | string | Required |
| `created_at` | string | Required |
| `updated_at` | string | Required |

`status` MUST be one of `REQUESTED`, `HELD`, `CONFIRMED`, `REJECTED`, `CANCELLED`, or `EXPIRED`.

`ends_at` MUST be later than `starts_at`.

### 29.2 Create booking

`POST /api/v1/bookings`

The request MUST contain `resource_id`, `starts_at`, and `ends_at`.

The request MAY contain `job_id` and `credit_reservation_id` when supported by the configured booking workflow.

The request MUST include `Idempotency-Key`.

Example request:

    {
        "resource_id": "robot-cell-02",
        "starts_at": "2026-10-10T09:00:00.000Z",
        "ends_at": "2026-10-10T10:00:00.000Z",
        "job_id": "job-000123"
    }

The server MUST validate availability, access rights, scheduling constraints, and any required credit reservation.

A successful synchronous booking creation MUST return `201 Created`.

If processing is asynchronous, the server MAY return `202 Accepted` with an operation or booking reference.

### 29.3 Confirm booking

`POST /api/v1/bookings/{booking_id}/confirm` MUST confirm only a booking whose current state permits confirmation.

The operation MUST be idempotent for retries using the same idempotency key where the endpoint accepts one.

A successful response MUST return the authoritative booking representation.

### 29.4 Cancel booking

`POST /api/v1/bookings/{booking_id}/cancel` MUST accept a documented cancellation reason.

The operation MUST NOT claim that associated execution has stopped unless the execution system confirms that outcome.

If cancellation is not possible in the current state, the server MUST return `409 Conflict` with `STATE_CONFLICT`.

### 29.5 Reschedule booking

`POST /api/v1/bookings/{booking_id}/reschedule` MUST contain `starts_at` and `ends_at`.

The server MUST validate the new interval and resource availability.

The reschedule operation MUST preserve booking identity and increment the resource version.

## 30. Credit endpoints

| Method | Path | Scope | Success |
|---|---|---|---|
| GET | `/credits/accounts` | `credits:read` | 200 |
| GET | `/credits/accounts/{credit_account_id}` | `credits:read` | 200 |
| GET | `/credits/accounts/{credit_account_id}/transactions` | `credits:read` | 200 |
| POST | `/credits/grants` | `credits:write` | 201 |
| POST | `/credits/reservations` | `credits:write` | 201 |
| POST | `/credits/reservations/{reservation_id}/release` | `credits:write` | 200 |
| POST | `/credits/reservations/{reservation_id}/consume` | `credits:write` | 200 |
| POST | `/credits/refunds` | `credits:write` | 201 |

### 30.1 Credit account representation

Credit accounts MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `credit_account_id` | string | Required |
| `owner_id` | string | Required |
| `balance` | integer | Required |
| `reserved_balance` | integer | Required |
| `unit` | string | Required |
| `version` | integer | Required |

`balance` MUST follow the accounting definition configured by the platform.

`reserved_balance` MUST be non-negative.

The response MUST distinguish available, reserved, and consumed quantities where those concepts are exposed.

### 30.2 Credit transactions

Credit transaction resources MUST contain `transaction_id`, `credit_account_id`, `transaction_type`, `quantity`, `unit`, `created_at`, and `status`.

`transaction_type` MUST be a documented value such as `GRANT`, `RESERVE`, `RELEASE`, `CONSUME`, `ADJUSTMENT`, or `REFUND`.

`quantity` MUST be a positive integer.

Transactions MUST be immutable accounting records after commitment.

### 30.3 Grant credits

`POST /api/v1/credits/grants`

The request MUST contain `credit_account_id`, `quantity`, `unit`, and `reason_code`.

The request MUST include `Idempotency-Key`.

The server MUST authorize the grant operation independently of ordinary account-read permission.

A successful response MUST identify the committed transaction and resulting balance.

### 30.4 Reserve credits

`POST /api/v1/credits/reservations`

The request MUST contain `credit_account_id`, `quantity`, `unit`, and `purpose`.

The request MUST include `Idempotency-Key`.

The request MAY contain `expires_at`.

The server MUST reject reservations that violate the account's available-credit policy.

Example request:

    {
        "credit_account_id": "credit-account-001",
        "quantity": 25,
        "unit": "CREDIT",
        "purpose": "run-usage",
        "expires_at": "2026-10-10T10:00:00.000Z"
    }

The server MUST NOT count a reservation as consumed credit.

### 30.5 Release and consume credits

`POST /api/v1/credits/reservations/{reservation_id}/release` MUST release a valid reservation at most once.

`POST /api/v1/credits/reservations/{reservation_id}/consume` MUST consume a valid reservation at most once.

Both operations MUST support idempotent retry handling.

The server MUST reject conflicting terminal operations with `409 Conflict`.

### 30.6 Refund credits

`POST /api/v1/credits/refunds` MUST contain `original_transaction_id`, `quantity`, and `reason_code`.

The request MUST include `Idempotency-Key`.

The server MUST validate that the original transaction is eligible for a refund.

The API MUST NOT permit a refund to exceed the refundable amount under the applicable accounting policy.

## 31. Job endpoints

| Method | Path | Scope | Success |
|---|---|---|---|
| GET | `/jobs` | `jobs:read` | 200 |
| POST | `/jobs` | `jobs:write` | 202 |
| GET | `/jobs/{job_id}` | `jobs:read` | 200 |
| POST | `/jobs/{job_id}/cancel` | `jobs:write` | 202 |
| GET | `/jobs/{job_id}/runs` | `runs:read` | 200 |

### 31.1 Job representation

Job resources MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `job_id` | string | Required |
| `project_id` | string | Required |
| `job_type` | string | Required |
| `status` | string | Required |
| `priority` | integer | Required |
| `submitted_at` | string | Required |
| `created_at` | string | Required |
| `updated_at` | string | Required |

`status` MUST be one of `SUBMITTED`, `QUEUED`, `SCHEDULED`, `RUNNING`, `CANCEL_REQUESTED`, `CANCELLED`, `FAILED`, or `COMPLETED`.

### 31.2 Submit job

`POST /api/v1/jobs`

The request MUST contain `project_id`, `job_type`, and the validated job specification.

The request MAY contain `artifact_id`, `platform_id`, `booking_id`, and documented scheduling options.

The request MUST include `Idempotency-Key`.

Example request:

    {
        "project_id": "project-001",
        "job_type": "robot_execution",
        "artifact_id": "artifact-001",
        "platform_id": "platform-001",
        "booking_id": "booking-0091",
        "priority": 5,
        "specification": {
            "entrypoint": "main",
            "parameters": {}
        }
    }

The server MUST validate the project, artifact, platform, booking, and specification relationships.

A successful submission MUST return `202 Accepted` when scheduling or execution remains asynchronous.

The response MUST include `job_id`, `status`, and a resource reference or URL.

Submission MUST NOT imply that a run has started.

### 31.3 Get job

`GET /api/v1/jobs/{job_id}` MUST return the authoritative job representation visible to the caller.

The endpoint MAY support filtering by `status`, `project_id`, `created_after`, and `created_before` on the collection endpoint.

### 31.4 Cancel job

`POST /api/v1/jobs/{job_id}/cancel` MUST request cancellation of the job.

The operation SHOULD accept a cancellation reason.

The server MAY return `202 Accepted` while cancellation is being processed.

A cancellation request MUST NOT be represented as a completed cancellation until the authoritative state confirms it.

## 32. Run endpoints

| Method | Path | Scope | Success |
|---|---|---|---|
| GET | `/runs` | `runs:read` | 200 |
| GET | `/runs/{run_id}` | `runs:read` | 200 |
| POST | `/runs/{run_id}/pause` | `runs:write` | 202 |
| POST | `/runs/{run_id}/resume` | `runs:write` | 202 |
| POST | `/runs/{run_id}/stop` | `runs:write` | 202 |
| GET | `/runs/{run_id}/telemetry` | `runs:read` | 200 |
| GET | `/runs/{run_id}/logs` | `runs:read` | 200 |

### 32.1 Run representation

Run resources MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `run_id` | string | Required |
| `job_id` | string | Required |
| `attempt` | integer | Required |
| `status` | string | Required |
| `resource_id` | string or null | Required |
| `created_at` | string | Required |
| `updated_at` | string | Required |

`attempt` MUST be a positive integer.

`status` MUST be one of `CREATED`, `QUEUED`, `DISPATCHED`, `RUNNING`, `PAUSED`, `STOP_REQUESTED`, `STOPPED`, `COMPLETED`, `FAILED`, `TIMED_OUT`, or `LOST`.

### 32.2 Run control operations

The pause, resume, and stop endpoints MUST validate the current run state.

Each operation MUST return `202 Accepted` when the requested transition is asynchronous.

The response MUST identify the run and the accepted operation or current state.

The server MUST reject an unsupported state transition with `409 Conflict`.

A stop request MUST NOT be treated as proof that physical motion has stopped.

Safety-related stopping MUST follow the applicable runtime, Lab Agent, and hardware safety contracts.

### 32.3 Run telemetry

`GET /api/v1/runs/{run_id}/telemetry` MUST return an authorized, bounded collection of telemetry samples or documented stream references.

The endpoint MUST support cursor pagination or an explicitly documented time-window mechanism.

Telemetry values and units MUST follow `docs/protocol/EVENT_CONTRACT.md`.

### 32.4 Run logs

`GET /api/v1/runs/{run_id}/logs` MUST return authorized logs for the run.

The endpoint SHOULD support `limit`, `cursor`, `created_after`, and `created_before`.

Logs MUST be bounded by response-size and retention policies.

The server MUST redact secrets and sensitive information before returning logs.

## 33. Result endpoints

| Method | Path | Scope | Success |
|---|---|---|---|
| GET | `/results` | `results:read` | 200 |
| GET | `/results/{result_id}` | `results:read` | 200 |
| GET | `/results/{result_id}/manifest` | `results:read` | 200 |
| POST | `/results/{result_id}/publish` | `results:write` | 202 |
| POST | `/results/{result_id}/expire` | `results:write` | 202 |

### 33.1 Result representation

Result resources MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `result_id` | string | Required |
| `job_id` | string | Required |
| `run_id` | string | Required |
| `status` | string | Required |
| `created_at` | string | Required |
| `updated_at` | string | Required |

`status` MUST be one of `CREATED`, `VALIDATED`, `PUBLISHED`, `FAILED`, `EXPIRED`, or `DELETED`.

### 33.2 List and get results

`GET /api/v1/results` MUST return only results visible to the caller.

The collection endpoint SHOULD support filters by `job_id`, `run_id`, `status`, and creation time.

`GET /api/v1/results/{result_id}` MUST return the authorized result representation.

### 33.3 Get result manifest

`GET /api/v1/results/{result_id}/manifest` MUST return the manifest or a documented reference to it.

The endpoint MUST enforce tenant, project, and result authorization.

Large result data MUST be retrieved through the authorized storage mechanism rather than embedded without bound in the response.

### 33.4 Publish and expire results

`POST /api/v1/results/{result_id}/publish` MUST publish only results that satisfy validation and access-policy requirements.

`POST /api/v1/results/{result_id}/expire` MUST require authorization and MUST apply the documented retention policy.

Both operations MAY return `202 Accepted` while processing is asynchronous.

The corresponding result lifecycle events MUST follow `docs/protocol/EVENT_CONTRACT.md`.

## 34. Lab endpoints

| Method | Path | Scope | Success |
|---|---|---|---|
| GET | `/labs` | `labs:read` | 200 |
| POST | `/labs` | `labs:write` | 201 |
| GET | `/labs/{lab_id}` | `labs:read` | 200 |
| PATCH | `/labs/{lab_id}` | `labs:write` | 200 |
| GET | `/labs/{lab_id}/capabilities` | `labs:read` | 200 |
| GET | `/labs/{lab_id}/health` | `labs:read` | 200 |
| POST | `/labs/{lab_id}/disable` | `labs:write` | 202 |
| POST | `/labs/{lab_id}/enable` | `labs:write` | 202 |

### 34.1 Lab representation

Lab resources MUST contain:

| Field | Type | Requirement |
|---|---|---|
| `lab_id` | string | Required |
| `agent_id` | string | Required |
| `name` | string | Required |
| `status` | string | Required |
| `created_at` | string | Required |
| `updated_at` | string | Required |

`status` MUST be one of `REGISTERED`, `ONLINE`, `DEGRADED`, `OFFLINE`, or `DEREGISTERED`.

### 34.2 Create and update lab

`POST /api/v1/labs` MUST contain the documented lab identity and registration metadata.

The server MUST validate the caller's administrative permission and the associated Lab Agent identity.

A caller MUST NOT be able to register an arbitrary agent identity without the required proof or administrative authorization.

`PATCH /api/v1/labs/{lab_id}` MAY update documented mutable metadata.

The endpoint MUST NOT allow a client to forge heartbeat observations or override authoritative connection state.

### 34.3 Capabilities and health

`GET /api/v1/labs/{lab_id}/capabilities` MUST return registered capability metadata.

`GET /api/v1/labs/{lab_id}/health` MUST return the latest authorized health observation and its observation timestamp.

A health response SHOULD distinguish reported health from connectivity freshness.

A heartbeat MUST NOT be treated as proof that physical hardware is safe.

### 34.4 Disable and enable lab

`POST /api/v1/labs/{lab_id}/disable` MUST prevent new work from being assigned according to the platform's lab policy.

`POST /api/v1/labs/{lab_id}/enable` MUST restore eligibility only after the required authorization and health checks.

Both operations MAY return `202 Accepted`.

Disabling a lab MUST NOT imply that all existing runs have stopped.

Any required stop behavior MUST be handled by the relevant run-control and safety mechanisms.

## 35. Cross-resource relationship rules

The server MUST validate every resource reference in a mutation.

A job's `project_id` MUST identify an authorized project.

An artifact referenced by a job MUST be accessible to the job's tenant and project under the applicable policy.

A booking's resource and time interval MUST satisfy the scheduling policy.

A run's `job_id` MUST identify the job from which the run originated.

A result's `run_id` MUST identify its originating run.

A credit reservation MUST belong to the account and tenant authorized for the associated operation.

A lab assignment MUST be compatible with the platform and resource constraints of the requested job.

A client MUST NOT bypass these validations by supplying valid-looking identifiers.

## 36. Asynchronous operations

Operations that cannot complete within the request-response lifecycle MAY return `202 Accepted`.

A `202 Accepted` response MUST NOT imply that the requested operation succeeded.

The response MUST identify the affected resource and, where available, an operation status reference.

Example:

    {
        "operation_id": "operation-001",
        "status": "ACCEPTED",
        "resource": {
            "type": "job",
            "id": "job-000123"
        },
        "accepted_at": "2026-10-09T07:30:00.000Z"
    }

The operation status reference MUST use a documented endpoint if the deployment exposes operation resources.

Clients SHOULD poll the authoritative resource or consume the relevant event stream rather than repeatedly submit the mutation.

A client MUST use the same idempotency key when retrying an operation whose outcome is unknown.

## 37. Rate limiting

The API MUST enforce configurable rate limits.

Rate limits MAY vary by tenant, authenticated principal, endpoint class, service identity, and deployment policy.

The server SHOULD return the following headers when rate limiting is applied:

- `RateLimit-Limit`
- `RateLimit-Remaining`
- `RateLimit-Reset`
- `Retry-After` when a retry delay is known

A rate-limited request MUST return `429 Too Many Requests`.

The error body MUST use the standard error envelope with code `RATE_LIMITED`.

Clients MUST respect `Retry-After` when provided.

Clients SHOULD use bounded exponential backoff with jitter when retrying rate-limited operations.

A client MUST NOT treat rate limiting as permission to increase request concurrency indefinitely.

The server MUST NOT expose sensitive tenant usage data through rate-limit headers.

## 38. Request and response size limits

The API MUST define configurable request-body and response-size limits.

The server MUST reject oversized request bodies with `413 Content Too Large`.

The server MUST NOT silently truncate a request body.

Large artifacts, logs, telemetry collections, and result bundles MUST use documented references or bounded retrieval mechanisms.

Collection endpoints MUST use pagination.

A deployment MUST document any endpoint-specific limits that differ from the default policy.

The server SHOULD enforce limits before expensive parsing or downstream processing.

## 39. API versioning

The major API version MUST appear in the URL path.

The baseline API prefix is:

    /api/v1

A backward-compatible change MAY be introduced within the current major API version.

An incompatible change MUST use a new major API version or a separately documented migration mechanism.

The server MUST NOT silently change the meaning of a field or endpoint within the same major API version.

The API contract version in this document is independent of the version of an individual resource.

The version of an artifact, platform, or result MUST NOT be confused with the API version.

## 40. Backward compatibility

Compatible additions MAY include new optional response fields, new endpoints, or new documented filters that do not alter existing behavior.

The server MUST NOT add a required request field to an existing operation without a compatible default or a new major version.

The server MUST NOT remove a response field, change a field's type, or narrow an accepted value range in a way that breaks conforming clients within the same major API version.

Adding an enum value MUST be reviewed for compatibility with exhaustive clients.

Clients SHOULD ignore unknown response fields.

Clients MUST NOT assume that unknown enum values are safe to process as known values.

When a client encounters an unsupported state value, it MUST avoid performing unsafe state-dependent operations and SHOULD report the value through diagnostics.

## 41. Deprecation policy

An endpoint or field MAY be deprecated when a replacement is available.

Deprecation MUST be documented in the API specification and release notes.

A deprecated endpoint SHOULD include a `Deprecation` response header when the deployment supports it.

The server SHOULD provide a `Link` header with a successor specification or migration guidance where applicable.

A deprecation notice MUST identify the affected endpoint or field and the planned removal conditions.

An endpoint MUST NOT be removed from a supported major API version without the documented compatibility and migration process, except when required by an urgent security or legal obligation.

## 42. OpenAPI generation requirements

The OpenAPI document MUST be generated from the same authoritative schemas and endpoint definitions used by the implementation.

The generated document MUST describe the `/api/v1` base path or equivalent server URL configuration.

Every operation MUST declare:

- A unique `operationId`.
- HTTP method and path.
- Summary and description.
- Required authentication and scopes.
- Path and query parameters.
- Request body schema where applicable.
- Success response schemas.
- Error responses.
- Idempotency requirements where applicable.
- Pagination behavior where applicable.
- Relevant concurrency preconditions.

Every public resource MUST have a reusable schema component.

Shared error, pagination, timestamp, identifier, and common metadata schemas SHOULD be reusable components.

The generated specification MUST NOT contradict this contract.

## 43. OpenAPI schema rules

Schemas MUST declare property types and required fields.

Enum values MUST be explicitly listed.

String length, numeric range, array bounds, and format constraints MUST be represented in the schema where supported.

Timestamps SHOULD use `type: string` and `format: date-time`, with UTC requirements documented in descriptions.

Identifiers MUST use string schemas.

Nullable properties MUST be explicitly declared according to the OpenAPI version in use.

The schema MUST NOT describe a field as optional if the endpoint requires it.

The schema MUST NOT describe a response as successful when the corresponding operation can return only an error or accepted-operation response under the endpoint's documented semantics.

## 44. OpenAPI security rules

The OpenAPI document MUST define the bearer authentication scheme or the approved authentication mechanism used by the deployment.

Each protected operation MUST reference the appropriate security requirement.

The operation's scope declarations MUST agree with the authorization catalogue.

Public authentication endpoints MUST explicitly declare their security requirements.

The specification MUST NOT contain real credentials, access tokens, signing keys, private endpoints, or production secrets.

If a deployment adds service-specific authentication, it MUST document the scheme and its relationship to the baseline authorization model.

## 45. OpenAPI validation and generation gates

The API specification MUST be validated in continuous integration.

Validation MUST detect:

- Duplicate `operationId` values.
- Missing response schemas.
- Missing error responses.
- Invalid references.
- Undocumented required fields.
- Inconsistent enum definitions.
- Incorrect path parameter declarations.
- Missing security declarations on protected operations.
- Conflicting request and response schemas.
- Invalid or contradictory version declarations.

A generated OpenAPI document MUST be reproducible from the checked-in schema sources and generation configuration.

Generated artifacts MUST NOT be manually edited in a way that is lost on regeneration.

Any intentional generation exception MUST be documented and tested.

## 46. REST and event contract relationship

REST responses expose current authorized resource representations.

Events expose immutable facts about domain changes or operational observations.

A REST mutation MAY cause one or more events defined by `docs/protocol/EVENT_CONTRACT.md`.

A successful REST response MUST NOT guarantee event delivery beyond the documented durability contract.

Where a mutation changes durable domain state and requires an event, the implementation SHOULD commit the state change and event outbox record atomically.

Event delivery MUST preserve event identity and schema semantics independently of the REST request ID.

A client MUST NOT treat an event as a replacement for a REST resource when the latest authoritative state is required.

## 47. REST and WebSocket relationship

REST endpoints provide resource retrieval and mutation.

The WebSocket contract provides authorized live event delivery according to `docs/protocol/WEBSOCKET_CONTRACT.md`.

A client MAY use REST to obtain the current resource and WebSocket delivery to receive subsequent updates.

The client MUST handle reconnects, duplicate events, and out-of-order observations according to the event and WebSocket contracts.

The WebSocket transport MUST NOT weaken the authentication, authorization, or tenant-isolation rules defined here.

## 48. REST and Lab protocol relationship

The REST API exposes authorized lab metadata and supported administrative operations.

Lab Agent registration, heartbeat, and operational messages MUST follow `docs/protocol/LAB_PROTOCOL.md`.

A REST request MUST NOT impersonate a Lab Agent message.

The server MUST validate the Lab Agent's identity and authority before accepting state changes originating from agent communication.

The REST API MUST distinguish a requested administrative action from a verified operational outcome.

## 49. Artifact and result integrity

Artifact and result endpoints MUST follow `docs/protocol/ARTIFACT_MANIFEST.md` for manifest representation, integrity, and immutable references.

Artifact publication MUST NOT bypass required validation.

Result publication MUST NOT bypass result validation and access policy.

The server MUST authorize access to artifact and result content separately from authorization to read metadata where necessary.

Signed or temporary download references MUST expire according to the applicable security policy.

The API MUST NOT expose private storage credentials.

## 50. Audit requirements

Security-sensitive and commercially significant API operations MUST produce auditable records.

These operations include, where applicable:

- Session creation and revocation.
- Organization membership changes.
- Artifact publication and deprecation.
- Booking confirmation, cancellation, and rescheduling.
- Credit grants, reservations, consumption, adjustments, and refunds.
- Job submission and cancellation.
- Run control operations.
- Result publication and expiration.
- Lab enablement, disablement, and administrative changes.

Audit records MUST identify the principal, tenant, operation, resource, outcome, and timestamp when those attributes are available.

Audit records MUST NOT expose authentication secrets.

Audit retention MUST follow the applicable platform and legal policy.

## 51. Security requirements

The server MUST validate authorization for every protected operation.

The server MUST prevent insecure direct object reference vulnerabilities by checking access to the referenced resource.

The server MUST validate input lengths, types, ranges, and encodings.

The server MUST apply appropriate protections against injection, request smuggling, malformed JSON, and resource-exhaustion attacks.

The server MUST NOT trust client-supplied ownership fields without verifying them.

Administrative endpoints MUST require explicit administrative authorization.

The API SHOULD support security monitoring for repeated authentication failures, authorization failures, idempotency conflicts, and abnormal request rates.

Sensitive errors MUST be redacted from responses and logs.

## 52. Operational behavior

The API MUST expose health and readiness information through the deployment's approved operational interface.

Operational health endpoints MUST NOT expose sensitive configuration or protected resource data.

The server SHOULD propagate correlation identifiers across downstream service calls.

The server MUST return stable error codes for known failure conditions.

A temporary dependency outage SHOULD result in `503 Service Unavailable` or another appropriate gateway status.

The server SHOULD include `Retry-After` when a reliable retry delay is available.

The server MUST NOT claim a durable mutation succeeded if the required authoritative commit failed.

## 53. Endpoint availability and capability discovery

A deployment MAY expose only the endpoints required by its enabled product capabilities.

Disabled operations MUST fail predictably and MUST NOT return fabricated successful resource representations.

Where capability discovery is provided, it MUST report the enabled API features and supported schema versions without exposing secrets.

The deployment's OpenAPI document MUST describe the endpoints actually supported by that deployment.

A client MUST NOT infer feature availability solely from a successful authentication response.

## 54. Endpoint-specific error behavior

Every endpoint MUST document the applicable standard errors from Section 19 and any domain-specific errors.

The following rules apply in addition to the common error contract:

- Create operations MUST return `409 Conflict` for conflicting unique resources or incompatible idempotency reuse.
- Read operations MUST return `404 Not Found` for missing or unauthorized-to-discover resources.
- Update operations MUST return `412 Precondition Failed` when a required `If-Match` precondition fails.
- State-transition operations MUST return `409 Conflict` when the current state does not permit the transition.
- Domain-invalid values MUST return `422 Unprocessable Content` where the request is syntactically valid but violates domain rules.
- Rate-limited operations MUST return `429 Too Many Requests`.
- Operations that exceed request-size limits MUST return `413 Content Too Large`.

The server MUST use the standard error envelope for these failures.

## 55. Conformance levels

An implementation MAY declare one or more conformance roles:

- API server.
- Authentication provider or authentication adapter.
- Resource service.
- Asynchronous operation handler.
- API client.
- OpenAPI generator and validator.

Each role MUST satisfy the requirements applicable to it.

An implementation MUST NOT claim full API conformance if a required endpoint violates its documented schema, authorization scope, error behavior, or idempotency requirements.

## 56. API server conformance tests

A conforming API server MUST pass tests that verify:

1. HTTPS is required in production.
2. Protected requests require valid authentication.
3. Invalid or expired credentials return `401 Unauthorized`.
4. Insufficient permissions return `403 Forbidden` or a non-disclosing `404 Not Found`.
5. Tenant isolation is enforced for every resource family.
6. Request JSON is validated before domain side effects.
7. Unknown request fields are rejected unless explicitly permitted.
8. All endpoint paths and methods match the catalogue.
9. Success status codes match the documented operation semantics.
10. Error responses use the standard error envelope.
11. Pagination respects limits and opaque cursors.
12. Invalid filters and cursors return documented errors.
13. Idempotency keys prevent duplicate billable or executable operations.
14. Conflicting idempotency reuse returns `IDEMPOTENCY_CONFLICT`.
15. Conditional updates enforce ETag or documented version preconditions.
16. Rate limits return `429 Too Many Requests`.
17. Request-size limits are enforced.
18. Asynchronous operations return `202 Accepted` without falsely claiming completion.
19. Resource relationships are validated.
20. Sensitive values are excluded from responses and logs.

## 57. API client conformance tests

A conforming client SHOULD be tested to verify that it:

1. Sends the required authentication headers.
2. Sends JSON with the correct media type.
3. Handles pagination without altering cursors.
4. Uses stable idempotency keys for retriable mutations.
5. Handles `401 Unauthorized` without infinite retry.
6. Handles `403 Forbidden` without repeatedly resubmitting the same operation.
7. Handles `409 Conflict` and `412 Precondition Failed` using explicit reconciliation.
8. Respects `Retry-After` for rate-limited requests.
9. Handles `202 Accepted` as an incomplete operation.
10. Ignores unknown response fields where permitted.
11. Rejects unsupported state values for safety-sensitive decisions.
12. Does not expose credentials in client logs.
13. Uses the event and WebSocket contracts for live updates where appropriate.
14. Validates downloaded manifests and result references before use.

## 58. OpenAPI conformance tests

The generated OpenAPI specification MUST pass automated validation.

Tests MUST verify that every endpoint in the catalogue is represented.

Tests MUST verify that every operation has a unique `operationId`.

Tests MUST verify required fields, property types, enum values, authentication requirements, and response status codes.

Tests MUST compare schema definitions against the implementation's validation rules.

Tests MUST verify that documented errors match actual error envelopes.

Tests MUST detect unreviewed breaking changes against the previously accepted API specification.

A specification that omits security requirements or misstates mutation semantics MUST fail the conformance gate.

## 59. Negative conformance cases

The test suite MUST include:

- Missing authentication.
- Expired access token.
- Insufficient scope.
- Cross-tenant resource access.
- Malformed JSON.
- Unsupported content type.
- Missing required fields.
- Incorrect field types.
- Invalid timestamps.
- Unknown enum values.
- Invalid path identifiers.
- Unknown query parameters.
- Invalid pagination cursor.
- Cursor reuse under a different tenant.
- Oversized request body.
- Reused idempotency key with conflicting content.
- Duplicate credit consumption attempt.
- Invalid booking time interval.
- Invalid job-to-project relationship.
- Invalid run-to-job relationship.
- Invalid result-to-run relationship.
- Invalid lab administrative operation.
- Stale ETag.
- Unsupported state transition.
- Rate-limit exhaustion.
- Upstream dependency timeout.

Each negative test MUST verify that unauthorized or invalid requests do not produce unintended domain side effects.

## 60. Example: create project

Request:

    POST /api/v1/projects
    Authorization: Bearer <access-token>
    Content-Type: application/json
    Idempotency-Key: create-project-tenant-001-001

    {
        "organization_id": "org-001",
        "name": "humanoid-demo",
        "description": "Reference robot development project"
    }

Response:

    {
        "project_id": "project-001",
        "organization_id": "org-001",
        "name": "humanoid-demo",
        "description": "Reference robot development project",
        "status": "ACTIVE",
        "created_at": "2026-10-09T07:30:00.000Z",
        "updated_at": "2026-10-09T07:30:00.000Z",
        "version": 1
    }

The server MUST validate the caller's organization permission before creating the project.

## 61. Example: submit job

Request:

    POST /api/v1/jobs
    Authorization: Bearer <access-token>
    Content-Type: application/json
    Idempotency-Key: submit-job-tenant-001-abc

    {
        "project_id": "project-001",
        "job_type": "robot_execution",
        "artifact_id": "artifact-001",
        "platform_id": "platform-001",
        "booking_id": "booking-0091",
        "priority": 5,
        "specification": {
            "entrypoint": "main",
            "parameters": {}
        }
    }

Response:

    {
        "job_id": "job-000123",
        "project_id": "project-001",
        "job_type": "robot_execution",
        "status": "SUBMITTED",
        "priority": 5,
        "submitted_at": "2026-10-09T07:35:00.000Z",
        "created_at": "2026-10-09T07:35:00.000Z",
        "updated_at": "2026-10-09T07:35:00.000Z"
    }

The response MUST NOT imply that the job has been scheduled or that execution has started.

## 62. Example: idempotency conflict

If a client reuses an idempotency key with conflicting request content, the server MUST return `409 Conflict`.

    {
        "error": {
            "code": "IDEMPOTENCY_CONFLICT",
            "message": "The idempotency key was previously used with different request content.",
            "retryable": false,
            "request_id": "req-8821",
            "correlation_id": "workflow-9f2c",
            "details": []
        }
    }

The server MUST NOT execute the conflicting operation.

## 63. Example: validation failure

A malformed booking interval MUST be rejected before any booking or credit side effect occurs.

    {
        "error": {
            "code": "DOMAIN_CONSTRAINT_VIOLATION",
            "message": "The booking end time must be later than its start time.",
            "retryable": false,
            "request_id": "req-9012",
            "correlation_id": "workflow-booking-91",
            "details": [
                {
                    "field": "ends_at",
                    "code": "INVALID_TIME_INTERVAL",
                    "message": "The end time must be later than the start time."
                }
            ]
        }
    }

The server MUST NOT partially create the booking.

## 64. Example: rate-limited response

A rate-limited request MUST return `429 Too Many Requests`.

    {
        "error": {
            "code": "RATE_LIMITED",
            "message": "The request rate limit has been exceeded.",
            "retryable": true,
            "request_id": "req-10001",
            "correlation_id": null,
            "details": []
        }
    }

If `Retry-After` is provided, the client MUST honor the indicated retry delay.

## 65. Phase and milestone traceability

Canonical phase definitions are maintained in `docs/planning/PHASES.md`. Existing milestone dossiers under `docs/**/milestones/` remain authoritative for milestone scope.

| Phase | API contract relevance |
|---|---|
| P0 FOUNDATION | Define common API conventions, schemas, authentication boundaries, and validation |
| P1 STUDIO | Support studio-facing identity and project API requirements within milestone scope |
| P2 BUILD & ARTIFACT | Support artifact metadata, validation, publication, and manifest access |
| P3 CONTROL PLANE | Support resource APIs, authorization, orchestration, and platform integration |
| P4 BOOKING & COMMERCIAL | Support booking, credit reservation, consumption, and accounting operations |
| P5 EXECUTION | Support job submission, scheduling, run control, and execution status |
| P6 LAB & ROBOT | Support lab registration, capability discovery, health, and telemetry access |
| P7 LIVE & RESULTS | Support result access and live operational integration |
| P8 PRODUCTION | Support production security, compatibility, operational reliability, and audit controls |

### 65.1 Frontend milestone traceability

| Milestone | API contract relevance |
|---|---|
| F-M01 STUDIO FOUNDATION | Shared authentication, request, response, and error handling |
| F-M02 PROJECTS | Project and organization-facing API consumption |
| F-M03 BUILD & ARTIFACT | Artifact metadata, validation, and publication API consumption |
| F-M04 BOOKING | Booking and credit API consumption |
| F-M05 EXECUTION | Job and run API consumption |
| F-M06 LIVE | Integration with live updates and current resource state |
| F-M07 RESULTS | Result retrieval, manifest access, and result lifecycle |

### 65.2 Backend milestone traceability

| Milestone | API contract relevance |
|---|---|
| B-M01 CONTROL PLANE | Common API routing, authentication, authorization, and validation |
| B-M02 ARTIFACT | Artifact resource and manifest endpoints |
| B-M03 PLATFORM | Platform resource APIs and domain integration |
| B-M04 BOOKING | Booking and credit endpoint behavior |
| B-M05 EXECUTION | Job and run endpoints and asynchronous operations |
| B-M06 RESULTS | Result, lab, and telemetry endpoint integration within milestone scope |
| B-M07 PRODUCTION | Production security, versioning, compatibility, rate limiting, and audit |

### 65.3 Database milestone traceability

| Milestone | API contract relevance |
|---|---|
| DB-M01 FOUNDATION | Common resource metadata and identity persistence |
| DB-M02 CORE DATA | User, organization, project, platform, and artifact data |
| DB-M03 BOOKING DATA | Booking, credit account, reservation, and transaction consistency |
| DB-M04 EXECUTION DATA | Job, run, result, lab, telemetry, and execution history |

### 65.4 Cloud milestone traceability

| Milestone | API contract relevance |
|---|---|
| C-M01 FOUNDATION | Secure API ingress and baseline environment configuration |
| C-M02 DEVELOPMENT | API implementation, schema generation, and automated validation |
| C-M03 STAGING | Cross-service integration, idempotency, error, and compatibility testing |
| C-M04 PRODUCTION | Production authentication, availability, rate limiting, monitoring, and audit |

This traceability section MUST NOT redefine phase definitions or milestone scope.

## 66. Acceptance checklist

An implementation MUST satisfy every applicable item before claiming API contract conformance.

### 66.1 Resource model and endpoint coverage

- [ ] All supported resource identifiers are stable and opaque.
- [ ] Endpoint paths and methods match the endpoint catalogue.
- [ ] Resource relationships are validated.
- [ ] Request and response schemas are documented.
- [ ] Collection endpoints use bounded pagination.
- [ ] Supported filters and sort fields are documented.
- [ ] Unsupported query parameters are handled consistently.
- [ ] Asynchronous operations return an explicit accepted state.
- [ ] Resource deletion follows the documented retention policy.

### 66.2 Authentication and authorization

- [ ] Protected endpoints require valid authentication.
- [ ] Authorization scopes are enforced.
- [ ] Resource-level authorization is enforced.
- [ ] Tenant isolation applies to every resource family.
- [ ] Authentication endpoints do not expose credentials.
- [ ] Administrative operations require explicit permission.
- [ ] Secrets are excluded from responses and logs.

### 66.3 Mutation integrity

- [ ] Required idempotency keys are enforced.
- [ ] Idempotency conflicts return a stable error.
- [ ] Conditional updates enforce documented preconditions.
- [ ] State transitions are validated.
- [ ] Credit operations are atomic and duplicate-safe.
- [ ] Booking operations validate resource availability.
- [ ] Job, run, and result relationships are checked.
- [ ] Invalid requests do not create unintended side effects.
- [ ] Asynchronous acceptance is not reported as completion.

### 66.4 Error and operational behavior

- [ ] Errors use the common error envelope.
- [ ] Error codes remain stable and machine-readable.
- [ ] HTTP status codes match documented outcomes.
- [ ] Rate limits return `429 Too Many Requests`.
- [ ] Request and response size limits are enforced.
- [ ] Retry behavior is documented and bounded.
- [ ] Request correlation supports diagnosis.
- [ ] Operational logs redact sensitive information.

### 66.5 Versioning and OpenAPI

- [ ] The API major version is represented in the URL path.
- [ ] Compatible changes follow the documented policy.
- [ ] Breaking changes require a migration plan.
- [ ] The OpenAPI document is generated reproducibly.
- [ ] Every endpoint has a unique `operationId`.
- [ ] Security requirements match the authorization catalogue.
- [ ] Required fields and enum definitions match implementation schemas.
- [ ] OpenAPI validation runs in continuous integration.
- [ ] Breaking API changes are detected before release.

### 66.6 Protocol integration and traceability

- [ ] Event-producing mutations align with `docs/protocol/EVENT_CONTRACT.md`.
- [ ] Live delivery aligns with `docs/protocol/WEBSOCKET_CONTRACT.md`.
- [ ] Lab integration aligns with `docs/protocol/LAB_PROTOCOL.md`.
- [ ] Artifact and result manifest references align with `docs/protocol/ARTIFACT_MANIFEST.md`.
- [ ] Architecture responsibilities align with `docs/architecture/PROTOCOL_ARCHITECTURE.md`.
- [ ] Phase references align with `docs/planning/PHASES.md`.
- [ ] Milestone scope remains governed by the authoritative milestone dossiers.
- [ ] Server, client, security, and OpenAPI conformance tests pass.

## 67. Release gate

The API MUST be reviewed before an implementation is declared conformant for a production deployment.

The review MUST verify endpoint coverage, schema accuracy, authorization enforcement, tenant isolation, idempotency, concurrency behavior, error semantics, OpenAPI validity, and integration with related protocol contracts.

A production deployment MUST NOT claim conformance while known cross-tenant access defects, duplicate accounting effects, unauthorized execution operations, or unresolved breaking API changes remain.

Any deviation from this contract MUST be documented, reviewed, and reflected in the implementation and generated API specification.

The authoritative milestone dossiers determine when this contract is required by a milestone. This document defines the API contract and does not independently redefine milestone scope.

## 68. Change control

Every normative change MUST identify:

- The affected endpoint paths and HTTP methods.
- The affected request and response schemas.
- The compatibility classification.
- The affected clients and services.
- The migration strategy.
- The required conformance tests.
- The impact on authentication, authorization, tenant isolation, and audit.
- The impact on event publication and downstream protocols.

A breaking change MUST NOT be introduced without a documented migration plan.

Changes to error codes, idempotency behavior, state-transition semantics, and authorization scopes MUST receive explicit review.

Generated OpenAPI output MUST be regenerated and validated after a contract change.

## 69. Final contract statement

This document defines the normative REST API baseline for Kritva RaaS under `/api/v1`.

Every conforming API server and client MUST implement the requirements applicable to its role.

The API MUST preserve stable resource semantics, authenticated access, tenant isolation, explicit mutation outcomes, duplicate-safe operations, bounded resource usage, machine-readable errors, and disciplined schema compatibility.

No implementation-specific behavior may override these requirements unless a formally reviewed contract revision explicitly changes them.
