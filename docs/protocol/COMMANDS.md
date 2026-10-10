# Kritva RaaS Command Catalogue

## 1. Document Control

| Item | Value |
|---|---|
| Document | Kritva RaaS Command Catalogue |
| Path | `docs/protocol/COMMANDS.md` |
| Product | Kritva Robotics-as-a-Service |
| Protocol Model | Contract-driven command/response |
| Public API | REST + WebSocket |
| Desktop IPC | Tauri IPC |
| Lab Protocol | Secure Lab Channel |
| Contract Package | `packages/contracts` |
| API Client | `packages/api-client` |
| Status | Production Architecture Baseline |

## 2. Purpose

This document defines the complete command catalogue for Kritva RaaS.

A command represents an explicit request for an operation.

The catalogue defines, for every command:

- command name;
- owning domain;
- direction;
- request payload;
- response payload;
- synchronous or asynchronous behavior;
- errors;
- idempotency;
- authorization;
- implementation phase.

The catalogue is the authoritative planning reference for protocol command
implementation across Studio, Control Plane, Lab Agent, and local Runtime.

## 3. Scope

The catalogue covers:

- authentication;
- users;
- organizations;
- projects;
- platforms;
- local builds;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- results;
- experiments;
- Lab Agent protocol;
- local Studio IPC;
- internal asynchronous operations where they are protocol-relevant.

## 4. Goals

The command architecture shall:

1. provide deterministic command naming;
2. define explicit request and response contracts;
3. separate synchronous and asynchronous work;
4. enforce authorization at every boundary;
5. support safe retries;
6. provide idempotency for side-effecting operations;
7. support protocol versioning;
8. support tenant isolation;
9. provide complete lifecycle coverage;
10. remain compatible with the RaaS architecture.

## 5. Non-Goals

This document does not define:

- database table schemas;
- SQL queries;
- UI layouts;
- detailed robot hardware protocols;
- physical emergency-stop implementation;
- video codec selection;
- cloud-provider-specific APIs;
- implementation-specific class structures;
- internal database repository implementations.

Those concerns are specified by their respective architecture documents.

## 6. Command Model

The command model is:

    Client
       |
       | COMMAND
       v
    Protocol Boundary
       |
       v
    Validation
       |
       v
    Authorization
       |
       v
    Domain Service
       |
       +---- synchronous result ----> RESPONSE
       |
       +---- asynchronous operation --> ACCEPTED
                                      |
                                      +--> EVENT(S)
                                      |
                                      +--> durable state

## 7. Protocol Boundaries

| Boundary | Direction | Transport | Main Commands |
|---|---|---|---|
| A | Studio UI ↔ Local Runtime | Tauri IPC | build, test, package, filesystem |
| B | Studio ↔ Control Plane | HTTPS REST | business commands |
| B | Control Plane → Studio | WebSocket | asynchronous state events |
| C | Control Plane ↔ Lab Agent | Secure Lab Channel | deployment, jobs, resources |
| D | Lab Agent ↔ Runtime | Local runtime interface | execution lifecycle |

## 8. Command Naming

Commands use:

    <domain>.<operation>

Examples:

    auth.login
    project.create
    artifact.upload
    booking.create
    job.start

Names are lowercase and use dot-separated components.

Command names are stable protocol identifiers.

## 9. Direction Convention

Direction is expressed relative to the logical command initiator.

Examples:

| Direction | Meaning |
|---|---|
| Studio → Control Plane | User-facing cloud command |
| Control Plane → Lab Agent | Remote execution command |
| Lab Agent → Control Plane | Lab-originated command |
| Studio UI → Local Runtime | Local IPC command |
| Runtime → Lab Agent | Local runtime command |

## 10. Standard Request Envelope

All commands logically contain:

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T00:00:00Z",
        "command": "project.create",
        "actor": {
            "type": "user",
            "id": "user-001"
        },
        "context": {
            "organization_id": "org-001"
        },
        "payload": {}
    }

Transport-specific APIs may move some envelope fields into HTTP headers or
transport metadata.

## 11. Standard Response Envelope

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T00:00:01Z",
        "status": "SUCCESS",
        "code": "PROJECT_CREATED",
        "message": "Project created",
        "data": {},
        "error": null
    }

## 12. Asynchronous Response

Asynchronous commands return an acceptance response.

    {
        "protocol_version": "1.0",
        "request_id": "req-12345",
        "timestamp": "2026-10-08T00:00:01Z",
        "status": "ACCEPTED",
        "code": "JOB_ACCEPTED",
        "data": {
            "job_id": "job-001"
        }
    }

Completion is communicated through durable state and events.

## 13. Standard Error Response

    {
        "status": "ERROR",
        "code": "RESOURCE_UNAVAILABLE",
        "message": "Requested resource is unavailable",
        "error": {
            "details": {}
        }
    }

Machine-readable error codes are stable.

Human-readable messages may evolve.

## 14. Request Schema Conventions

The catalogue uses compact schema references.

`{id}` means a required opaque identifier.

`{id?}` means optional identifier.

`string`, `integer`, `number`, `boolean`, `timestamp`, and `enum` have their
usual JSON-compatible meanings.

Arrays are written as `array<T>`.

Objects are written as named field groups.

## 15. Response Schema Conventions

Unless otherwise stated, response payloads are wrapped in the standard response
envelope.

`data: Resource` means a single resource.

`data: Resource[]` means a collection.

`data: OperationAccepted` means an asynchronous operation identifier.

## 16. Standard Types

### ResourceReference

    {
        "id": "opaque-id",
        "type": "resource-type"
    }

### Pagination

    {
        "items": [],
        "next_cursor": "cursor-or-null",
        "has_more": false
    }

### OperationAccepted

    {
        "operation_id": "operation-001",
        "resource_id": "resource-001",
        "status": "ACCEPTED"
    }

### ErrorDetails

    {
        "field": "optional-field",
        "reason": "validation-or-domain-reason",
        "metadata": {}
    }

## 17. Authorization Model

Authorization is evaluated using:

    authenticated identity
            |
            v
    organization membership
            |
            v
    role / permission
            |
            v
    resource ownership
            |
            v
    operation authorization

Client-supplied organization or project identifiers do not grant access.

## 18. Authorization Labels

| Label | Meaning |
|---|---|
| Public | No authenticated identity required |
| User | Authenticated user |
| Member | Organization member |
| ProjectMember | Member with project access |
| OrgAdmin | Organization administrator |
| PlatformAdmin | Platform management role |
| BillingAdmin | Billing/credit authority |
| LabAdmin | Lab administration role |
| Operator | Execution/operator permission |
| System | Internal trusted service |
| Agent | Authenticated Lab Agent |
| Runtime | Authenticated runtime |

## 19. Idempotency Model

Idempotency is mandatory for commands where retries can create financial,
resource, booking, or execution side effects.

Idempotency is represented as:

    Idempotency-Key: <unique-key>

The key is scoped to the authenticated actor and command semantics.

## 20. Idempotency Labels

| Label | Meaning |
|---|---|
| Required | Caller must provide an idempotency key |
| Supported | Key may be provided |
| Not Required | Operation is read-only or inherently safe |

## 21. Error Catalogue

Common errors include:

| Code | Meaning |
|---|---|
| INVALID_REQUEST | Invalid payload |
| UNAUTHORIZED | Authentication required |
| FORBIDDEN | Authorization failure |
| NOT_FOUND | Resource not found |
| CONFLICT | Resource state conflict |
| INVALID_STATE | Invalid lifecycle transition |
| VALIDATION_FAILED | Domain validation failure |
| VERSION_UNSUPPORTED | Unsupported protocol version |
| IDEMPOTENCY_CONFLICT | Key reused with different operation |
| RESOURCE_UNAVAILABLE | Required resource unavailable |
| INSUFFICIENT_CREDITS | Insufficient credit balance |
| BOOKING_CONFLICT | Requested slot unavailable |
| ARTIFACT_INCOMPATIBLE | Artifact incompatible |
| ARTIFACT_INVALID | Artifact failed validation |
| SIGNATURE_INVALID | Artifact signature invalid |
| AGENT_OFFLINE | Lab Agent unavailable |
| RUNTIME_UNAVAILABLE | Runtime unavailable |
| JOB_FAILED | Job execution failed |
| TIMEOUT | Operation timed out |
| RATE_LIMITED | Rate limit exceeded |
| INTERNAL_ERROR | Unexpected server error |
| SERVICE_UNAVAILABLE | Temporary service failure |

# 22. Authentication Commands

## 22.1 `auth.login`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `LoginRequest { email:string, credential:object, device?:object }` |
| Response | `AuthSession { user, organization_context, access_token, expires_at, refresh_token_reference? }` |
| Mode | Sync |
| Errors | `INVALID_REQUEST`, `UNAUTHORIZED`, `RATE_LIMITED`, `SERVICE_UNAVAILABLE` |
| Idempotency | Not Required |
| Authorization | Public |
| Phase | Phase 1 |

Purpose: authenticate a user and establish a session.

Credentials must never be logged.

## 22.2 `auth.logout`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `LogoutRequest { session_id? }` |
| Response | `LogoutResult { success:boolean }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `NOT_FOUND`, `SERVICE_UNAVAILABLE` |
| Idempotency | Supported |
| Authorization | User |
| Phase | Phase 1 |

## 22.3 `auth.refresh`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `RefreshRequest { refresh_token }` |
| Response | `AuthSession { access_token, expires_at }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `INVALID_REQUEST`, `SERVICE_UNAVAILABLE` |
| Idempotency | Not Required |
| Authorization | Authenticated refresh credential |
| Phase | Phase 1 |

## 22.4 `auth.me`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `EmptyRequest {}` |
| Response | `UserContext { user, organizations, permissions }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `SERVICE_UNAVAILABLE` |
| Idempotency | Not Required |
| Authorization | User |
| Phase | Phase 1 |

# 23. User Commands

## 23.1 `user.get`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `UserGetRequest { user_id }` |
| Response | `User` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | User or authorized administrator |
| Phase | Phase 3 |

## 23.2 `user.update`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `UserUpdateRequest { user_id, display_name?, timezone?, preferences? }` |
| Response | `User` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_FAILED` |
| Idempotency | Supported |
| Authorization | User or authorized administrator |
| Phase | Phase 3 |

# 24. Organization Commands

## 24.1 `organization.create`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `OrganizationCreateRequest { name, slug?, billing_profile? }` |
| Response | `Organization` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `VALIDATION_FAILED`, `CONFLICT` |
| Idempotency | Required |
| Authorization | User |
| Phase | Phase 3 |

## 24.2 `organization.get`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `OrganizationGetRequest { organization_id }` |
| Response | `Organization` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | Member |
| Phase | Phase 3 |

## 24.3 `organization.update`

| Property | Specification |
|---|---|
| Direction | Web → Control Plane |
| Request | `OrganizationUpdateRequest { organization_id, name?, settings? }` |
| Response | `Organization` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_FAILED` |
| Idempotency | Supported |
| Authorization | OrgAdmin |
| Phase | Phase 3 |

## 24.4 `organization.members.list`

| Property | Specification |
|---|---|
| Direction | Web → Control Plane |
| Request | `MemberListRequest { organization_id, cursor?, limit? }` |
| Response | `Pagination<Member>` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | OrgAdmin |
| Phase | Phase 3 |

## 24.5 `organization.members.add`

| Property | Specification |
|---|---|
| Direction | Web → Control Plane |
| Request | `MemberAddRequest { organization_id, user_id, role }` |
| Response | `Membership` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `VALIDATION_FAILED` |
| Idempotency | Required |
| Authorization | OrgAdmin |
| Phase | Phase 3 |

## 24.6 `organization.members.remove`

| Property | Specification |
|---|---|
| Direction | Web → Control Plane |
| Request | `MemberRemoveRequest { organization_id, user_id }` |
| Response | `OperationResult { success:boolean }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT` |
| Idempotency | Supported |
| Authorization | OrgAdmin |
| Phase | Phase 3 |

# 25. Project Commands

## 25.1 `project.create`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `ProjectCreateRequest { organization_id, name, description?, metadata? }` |
| Response | `Project` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `VALIDATION_FAILED`, `CONFLICT` |
| Idempotency | Required |
| Authorization | Member |
| Phase | Phase 1 |

## 25.2 `project.list`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `ProjectListRequest { organization_id, cursor?, limit?, status? }` |
| Response | `Pagination<Project>` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | Member |
| Phase | Phase 1 |

## 25.3 `project.get`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `ProjectGetRequest { project_id }` |
| Response | `Project` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 1 |

## 25.4 `project.update`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `ProjectUpdateRequest { project_id, name?, description?, metadata?, version? }` |
| Response | `Project` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `VALIDATION_FAILED` |
| Idempotency | Supported |
| Authorization | ProjectMember |
| Phase | Phase 1 |

## 25.5 `project.archive`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `ProjectArchiveRequest { project_id }` |
| Response | `Project` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `INVALID_STATE` |
| Idempotency | Supported |
| Authorization | ProjectMember |
| Phase | Phase 1 |

## 25.6 `project.delete`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `ProjectDeleteRequest { project_id, confirmation }` |
| Response | `OperationResult { success:boolean }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `VALIDATION_FAILED` |
| Idempotency | Supported |
| Authorization | OrgAdmin or project owner |
| Phase | Phase 8 |

# 26. Platform Commands

## 26.1 `platform.list`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `PlatformListRequest { cursor?, limit?, status?, capability? }` |
| Response | `Pagination<Platform>` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `SERVICE_UNAVAILABLE` |
| Idempotency | Not Required |
| Authorization | User |
| Phase | Phase 1 |

## 26.2 `platform.get`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `PlatformGetRequest { platform_id }` |
| Response | `Platform` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | User |
| Phase | Phase 1 |

## 26.3 `platform.capabilities`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `PlatformCapabilitiesRequest { platform_id, version? }` |
| Response | `PlatformCapabilities { capabilities, interfaces, limits }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `NOT_FOUND`, `VERSION_UNSUPPORTED` |
| Idempotency | Not Required |
| Authorization | User |
| Phase | Phase 1 |

## 26.4 `platform.compatibility`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `CompatibilityRequest { artifact_id?, platform_id, runtime_version?, sdk_version? }` |
| Response | `CompatibilityResult { compatible, reasons[], requirements[] }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `NOT_FOUND`, `ARTIFACT_INVALID`, `VERSION_UNSUPPORTED` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 2 |

# 27. Build Commands

Build commands primarily execute at Boundary A.

## 27.1 `build.validate`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `BuildValidateRequest { project_path, target, profile?, toolchain? }` |
| Response | `BuildValidation { valid, diagnostics[], toolchain }` |
| Mode | Sync |
| Errors | `INVALID_REQUEST`, `VALIDATION_FAILED` |
| Idempotency | Not Required |
| Authorization | Local user |
| Phase | Phase 1 |

## 27.2 `build.configure`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `BuildConfigureRequest { project_path, target, profile, options? }` |
| Response | `BuildConfiguration { build_id, configuration }` |
| Mode | Sync |
| Errors | `INVALID_REQUEST`, `VALIDATION_FAILED` |
| Idempotency | Supported |
| Authorization | Local user |
| Phase | Phase 1 |

## 27.3 `build.start`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `BuildStartRequest { build_id, clean?, environment? }` |
| Response | `OperationAccepted { operation_id, resource_id:build_id, status:ACCEPTED }` |
| Mode | Async |
| Errors | `INVALID_REQUEST`, `VALIDATION_FAILED`, `CONFLICT`, `TIMEOUT` |
| Idempotency | Supported |
| Authorization | Local user |
| Phase | Phase 1 |

## 27.4 `build.status`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `BuildStatusRequest { build_id }` |
| Response | `BuildStatus { build_id, state, progress, started_at?, completed_at?, diagnostics[] }` |
| Mode | Sync |
| Errors | `NOT_FOUND`, `INVALID_REQUEST` |
| Idempotency | Not Required |
| Authorization | Local user |
| Phase | Phase 1 |

## 27.5 `build.logs`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `BuildLogsRequest { build_id, cursor?, since? }` |
| Response | `LogPage { entries[], next_cursor? }` |
| Mode | Sync |
| Errors | `NOT_FOUND`, `INVALID_REQUEST` |
| Idempotency | Not Required |
| Authorization | Local user |
| Phase | Phase 1 |

## 27.6 `build.cancel`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `BuildCancelRequest { build_id }` |
| Response | `BuildStatus` |
| Mode | Sync |
| Errors | `NOT_FOUND`, `INVALID_STATE`, `CONFLICT` |
| Idempotency | Supported |
| Authorization | Local user |
| Phase | Phase 1 |

## 27.7 `build.result`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `BuildResultRequest { build_id }` |
| Response | `BuildResult { success, outputs[], diagnostics[], duration }` |
| Mode | Sync |
| Errors | `NOT_FOUND`, `INVALID_STATE` |
| Idempotency | Not Required |
| Authorization | Local user |
| Phase | Phase 1 |

# 28. Artifact Commands

## 28.1 `artifact.create`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `ArtifactCreateRequest { project_id, name, version, manifest, digest, size }` |
| Response | `ArtifactUploadSession { artifact_id, upload_url/session, expires_at }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `VALIDATION_FAILED`, `CONFLICT` |
| Idempotency | Required |
| Authorization | ProjectMember |
| Phase | Phase 2 |

## 28.2 `artifact.upload`

| Property | Specification |
|---|---|
| Direction | Studio → Object Storage via authorized upload |
| Request | `ArtifactUploadRequest { artifact_id, binary, digest, size }` |
| Response | `ArtifactUploadResult { artifact_id, uploaded, digest }` |
| Mode | Async |
| Errors | `NOT_FOUND`, `ARTIFACT_INVALID`, `VALIDATION_FAILED`, `TIMEOUT` |
| Idempotency | Required |
| Authorization | ProjectMember |
| Phase | Phase 2 |

## 28.3 `artifact.get`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `ArtifactGetRequest { artifact_id }` |
| Response | `Artifact` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 2 |

## 28.4 `artifact.list`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `ArtifactListRequest { project_id, cursor?, limit?, status? }` |
| Response | `Pagination<Artifact>` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 2 |

## 28.5 `artifact.validate`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `ArtifactValidateRequest { artifact_id }` |
| Response | `ArtifactValidation { status, checks[], compatibility }` |
| Mode | Async |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `ARTIFACT_INVALID`, `SIGNATURE_INVALID` |
| Idempotency | Supported |
| Authorization | ProjectMember |
| Phase | Phase 2 |

## 28.6 `artifact.delete`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `ArtifactDeleteRequest { artifact_id, confirmation }` |
| Response | `OperationResult { success:boolean }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT` |
| Idempotency | Supported |
| Authorization | ProjectMember |
| Phase | Phase 8 |

## 28.7 `artifact.download`

| Property | Specification |
|---|---|
| Direction | Studio/Lab Agent → Control Plane |
| Request | `ArtifactDownloadRequest { artifact_id, purpose }` |
| Response | `ArtifactDownload { url_or_stream, expires_at, digest }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `ARTIFACT_INVALID` |
| Idempotency | Not Required |
| Authorization | ProjectMember or authorized Agent |
| Phase | Phase 2 |

# 29. Booking Commands

## 29.1 `availability.query`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `AvailabilityQueryRequest { platform_id, start_time, end_time, quantity?, capability_filter? }` |
| Response | `AvailabilityResult { slots[], resources[] }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `NOT_FOUND`, `VALIDATION_FAILED` |
| Idempotency | Not Required |
| Authorization | User |
| Phase | Phase 4 |

## 29.2 `booking.quote`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `BookingQuoteRequest { platform_id, start_time, end_time, resource_id?, configuration? }` |
| Response | `BookingQuote { quote_id, platform_id, duration, credit_rate, required_credits, expires_at }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `NOT_FOUND`, `RESOURCE_UNAVAILABLE`, `VALIDATION_FAILED` |
| Idempotency | Not Required |
| Authorization | User |
| Phase | Phase 4 |

## 29.3 `booking.create`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `BookingCreateRequest { quote_id, project_id, start_time, end_time, platform_id, resource_id?, idempotency_key }` |
| Response | `Booking` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `BOOKING_CONFLICT`, `INSUFFICIENT_CREDITS`, `CONFLICT`, `VALIDATION_FAILED` |
| Idempotency | Required |
| Authorization | ProjectMember |
| Phase | Phase 4 |

## 29.4 `booking.get`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `BookingGetRequest { booking_id }` |
| Response | `Booking` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 4 |

## 29.5 `booking.list`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `BookingListRequest { organization_id, project_id?, cursor?, limit?, status? }` |
| Response | `Pagination<Booking>` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | Member |
| Phase | Phase 4 |

## 29.6 `booking.modify`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `BookingModifyRequest { booking_id, start_time?, end_time?, resource_id?, version }` |
| Response | `Booking` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `BOOKING_CONFLICT`, `CONFLICT`, `VALIDATION_FAILED` |
| Idempotency | Required |
| Authorization | ProjectMember |
| Phase | Phase 4 |

## 29.7 `booking.cancel`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `BookingCancelRequest { booking_id, reason?, version }` |
| Response | `BookingCancellation { booking, refund }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `INVALID_STATE`, `CONFLICT` |
| Idempotency | Required |
| Authorization | ProjectMember |
| Phase | Phase 4 |

# 30. Credit Commands

## 30.1 `credit.balance`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `CreditBalanceRequest { organization_id, platform_id? }` |
| Response | `CreditBalance { wallets[] }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | Member |
| Phase | Phase 4 |

## 30.2 `credit.quote`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `CreditQuoteRequest { platform_id, duration, resource_id?, configuration? }` |
| Response | `CreditQuote { rate, duration, required_credits, credit_plan_id }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `NOT_FOUND`, `RESOURCE_UNAVAILABLE`, `VALIDATION_FAILED` |
| Idempotency | Not Required |
| Authorization | Member |
| Phase | Phase 4 |

## 30.3 `credit.transaction.list`

| Property | Specification |
|---|---|
| Direction | Web → Control Plane |
| Request | `CreditTransactionListRequest { organization_id, wallet_id?, cursor?, limit?, from?, to? }` |
| Response | `Pagination<CreditTransaction>` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | Member |
| Phase | Phase 4 |

## 30.4 `credit.consumption`

| Property | Specification |
|---|---|
| Direction | Control Plane → Credit Service |
| Request | `CreditConsumptionRequest { wallet_id, job_id, amount, reference, idempotency_key }` |
| Response | `CreditTransaction` |
| Mode | Sync |
| Errors | `INSUFFICIENT_CREDITS`, `CONFLICT`, `IDEMPOTENCY_CONFLICT`, `NOT_FOUND` |
| Idempotency | Required |
| Authorization | System |
| Phase | Phase 4 |

## 30.5 `credit.refund`

| Property | Specification |
|---|---|
| Direction | Web/Admin → Control Plane |
| Request | `CreditRefundRequest { transaction_id, amount?, reason, idempotency_key }` |
| Response | `CreditTransaction` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `VALIDATION_FAILED` |
| Idempotency | Required |
| Authorization | BillingAdmin |
| Phase | Phase 4 |

# 31. Job Commands

## 31.1 `job.create`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `JobCreateRequest { project_id, artifact_id, booking_id, platform_id, configuration?, idempotency_key }` |
| Response | `Job` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `ARTIFACT_INCOMPATIBLE`, `BOOKING_CONFLICT`, `CONFLICT` |
| Idempotency | Required |
| Authorization | ProjectMember |
| Phase | Phase 5 |

## 31.2 `job.get`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `JobGetRequest { job_id }` |
| Response | `Job` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 5 |

## 31.3 `job.list`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `JobListRequest { project_id?, organization_id?, cursor?, limit?, status? }` |
| Response | `Pagination<Job>` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | Member |
| Phase | Phase 5 |

## 31.4 `job.start`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `JobStartRequest { job_id, idempotency_key }` |
| Response | `OperationAccepted { operation_id, resource_id:job_id, status:ACCEPTED }` |
| Mode | Async |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `INVALID_STATE`, `RESOURCE_UNAVAILABLE`, `AGENT_OFFLINE` |
| Idempotency | Required |
| Authorization | ProjectMember |
| Phase | Phase 5 |

## 31.5 `job.stop`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `JobStopRequest { job_id, reason?, idempotency_key }` |
| Response | `OperationAccepted { operation_id, resource_id:job_id, status:ACCEPTED }` |
| Mode | Async |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `INVALID_STATE`, `AGENT_OFFLINE`, `TIMEOUT` |
| Idempotency | Required |
| Authorization | ProjectMember or Operator |
| Phase | Phase 5 |

## 31.6 `job.cancel`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `JobCancelRequest { job_id, reason?, idempotency_key }` |
| Response | `Job` |
| Mode | Sync/Async depending on state |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `INVALID_STATE`, `CONFLICT` |
| Idempotency | Required |
| Authorization | ProjectMember |
| Phase | Phase 5 |

## 31.7 `job.status`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `JobStatusRequest { job_id }` |
| Response | `JobStatus { state, resource_id?, run_id?, timestamps, failure? }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 5 |

## 31.8 `job.logs`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `JobLogsRequest { job_id, cursor?, since?, level? }` |
| Response | `LogPage` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

# 32. Run Commands

## 32.1 `run.get`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `RunGetRequest { run_id }` |
| Response | `Run` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 32.2 `run.list`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `RunListRequest { project_id?, job_id?, cursor?, limit?, status? }` |
| Response | `Pagination<Run>` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 32.3 `run.status`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `RunStatusRequest { run_id }` |
| Response | `RunStatus { state, progress?, timestamps, health? }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 32.4 `run.metrics`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `RunMetricsRequest { run_id, metric_names?, from?, to?, resolution? }` |
| Response | `MetricSeries[]` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_FAILED` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 32.5 `run.telemetry`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `RunTelemetryRequest { run_id, channels?, from?, to?, cursor? }` |
| Response | `TelemetryPage { samples[], next_cursor? }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_FAILED` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 32.6 `run.logs`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `RunLogsRequest { run_id, cursor?, since?, level? }` |
| Response | `LogPage` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 32.7 `run.stop`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `RunStopRequest { run_id, reason?, idempotency_key }` |
| Response | `OperationAccepted { operation_id, resource_id:run_id, status:ACCEPTED }` |
| Mode | Async |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `INVALID_STATE`, `AGENT_OFFLINE`, `TIMEOUT` |
| Idempotency | Required |
| Authorization | ProjectMember or Operator |
| Phase | Phase 7 |

# 33. Result Commands

## 33.1 `result.get`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `ResultGetRequest { result_id }` |
| Response | `Result` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 33.2 `result.list`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `ResultListRequest { project_id?, run_id?, cursor?, limit? }` |
| Response | `Pagination<Result>` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 33.3 `result.files`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `ResultFilesRequest { result_id }` |
| Response | `ResultFile[]` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 33.4 `result.download`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `ResultDownloadRequest { result_file_id }` |
| Response | `DownloadReference { url, expires_at, digest }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 33.5 `result.summary`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `ResultSummaryRequest { result_id }` |
| Response | `ResultSummary { status, metrics, highlights, warnings }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 33.6 `result.metrics`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `ResultMetricsRequest { result_id, metric_names? }` |
| Response | `MetricSeries[]` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

# 34. Experiment Commands

Experiments provide a higher-level grouping over projects, artifacts, runs, and
results.

They do not replace jobs or runs.

## 34.1 `experiment.create`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `ExperimentCreateRequest { project_id, name, description?, metadata? }` |
| Response | `Experiment` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_FAILED`, `CONFLICT` |
| Idempotency | Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 34.2 `experiment.get`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `ExperimentGetRequest { experiment_id }` |
| Response | `Experiment` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 34.3 `experiment.list`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `ExperimentListRequest { project_id, cursor?, limit?, status? }` |
| Response | `Pagination<Experiment>` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 34.4 `experiment.update`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `ExperimentUpdateRequest { experiment_id, name?, description?, metadata?, version }` |
| Response | `Experiment` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `VALIDATION_FAILED` |
| Idempotency | Supported |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 34.5 `experiment.add_run`

| Property | Specification |
|---|---|
| Direction | Studio → Control Plane |
| Request | `ExperimentAddRunRequest { experiment_id, run_id, idempotency_key }` |
| Response | `ExperimentRunReference` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `VALIDATION_FAILED` |
| Idempotency | Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

## 34.6 `experiment.results`

| Property | Specification |
|---|---|
| Direction | Studio/Web → Control Plane |
| Request | `ExperimentResultsRequest { experiment_id, cursor?, limit? }` |
| Response | `ExperimentResults { runs[], results[], metrics[] }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | ProjectMember |
| Phase | Phase 7 |

# 35. Lab Agent Commands

## 35.1 `agent.register`

| Property | Specification |
|---|---|
| Direction | Lab Agent → Control Plane |
| Request | `AgentRegisterRequest { agent_id, certificate_identity, agent_version, protocol_versions[], lab_id, capabilities }` |
| Response | `AgentRegistration { accepted, negotiated_protocol_version, configuration, heartbeat_interval }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `VERSION_UNSUPPORTED`, `VALIDATION_FAILED`, `CONFLICT` |
| Idempotency | Required |
| Authorization | Agent |
| Phase | Phase 5 |

## 35.2 `agent.heartbeat`

| Property | Specification |
|---|---|
| Direction | Lab Agent → Control Plane |
| Request | `AgentHeartbeatRequest { agent_id, timestamp, health, resources_summary, active_jobs[] }` |
| Response | `AgentHeartbeatResponse { accepted, commands_pending, server_time }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VERSION_UNSUPPORTED` |
| Idempotency | Supported |
| Authorization | Agent |
| Phase | Phase 5 |

## 35.3 `agent.status`

| Property | Specification |
|---|---|
| Direction | Control Plane → Lab Agent |
| Request | `AgentStatusRequest { agent_id }` |
| Response | `AgentStatus { state, health, version, last_seen }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND` |
| Idempotency | Not Required |
| Authorization | LabAdmin/System |
| Phase | Phase 5 |

## 35.4 `agent.capabilities`

| Property | Specification |
|---|---|
| Direction | Control Plane → Lab Agent |
| Request | `AgentCapabilitiesRequest { agent_id }` |
| Response | `AgentCapabilities { platforms[], runtimes[], resources[], capabilities[] }` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `AGENT_OFFLINE` |
| Idempotency | Not Required |
| Authorization | LabAdmin/System |
| Phase | Phase 5 |

## 35.5 `agent.resources`

| Property | Specification |
|---|---|
| Direction | Control Plane → Lab Agent |
| Request | `AgentResourcesRequest { agent_id, refresh? }` |
| Response | `Resource[]` |
| Mode | Sync |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `AGENT_OFFLINE` |
| Idempotency | Not Required |
| Authorization | LabAdmin/System |
| Phase | Phase 5 |

## 35.6 `agent.configure`

| Property | Specification |
|---|---|
| Direction | Control Plane → Lab Agent |
| Request | `AgentConfigureRequest { agent_id, configuration, version }` |
| Response | `AgentConfigurationResult { accepted, applied_version }` |
| Mode | Async |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_FAILED`, `AGENT_OFFLINE` |
| Idempotency | Required |
| Authorization | LabAdmin |
| Phase | Phase 6 |

## 35.7 `artifact.fetch`

| Property | Specification |
|---|---|
| Direction | Control Plane → Lab Agent |
| Request | `ArtifactFetchRequest { agent_id, artifact_id, digest, destination_policy }` |
| Response | `ArtifactFetchResult { artifact_id, downloaded, verified_digest }` |
| Mode | Async |
| Errors | `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `ARTIFACT_INVALID`, `SIGNATURE_INVALID`, `AGENT_OFFLINE`, `TIMEOUT` |
| Idempotency | Required |
| Authorization | System |
| Phase | Phase 5 |

## 35.8 `deployment.prepare`

| Property | Specification |
|---|---|
| Direction | Control Plane → Lab Agent |
| Request | `DeploymentPrepareRequest { job_id, artifact_id, resource_id, configuration }` |
| Response | `DeploymentPreparation { deployment_id, validated, diagnostics[] }` |
| Mode | Async |
| Errors | `NOT_FOUND`, `ARTIFACT_INCOMPATIBLE`, `RESOURCE_UNAVAILABLE`, `AGENT_OFFLINE`, `VALIDATION_FAILED` |
| Idempotency | Required |
| Authorization | System |
| Phase | Phase 5 |

## 35.9 `deployment.start`

| Property | Specification |
|---|---|
| Direction | Control Plane → Lab Agent |
| Request | `DeploymentStartRequest { deployment_id, idempotency_key }` |
| Response | `OperationAccepted { operation_id, resource_id:deployment_id, status:ACCEPTED }` |
| Mode | Async |
| Errors | `NOT_FOUND`, `INVALID_STATE`, `RESOURCE_UNAVAILABLE`, `AGENT_OFFLINE`, `TIMEOUT` |
| Idempotency | Required |
| Authorization | System |
| Phase | Phase 5 |

## 35.10 `deployment.stop`

| Property | Specification |
|---|---|
| Direction | Control Plane → Lab Agent |
| Request | `DeploymentStopRequest { deployment_id, reason, idempotency_key }` |
| Response | `OperationAccepted { operation_id, resource_id:deployment_id, status:ACCEPTED }` |
| Mode | Async |
| Errors | `NOT_FOUND`, `INVALID_STATE`, `AGENT_OFFLINE`, `TIMEOUT` |
| Idempotency | Required |
| Authorization | System |
| Phase | Phase 5 |

## 35.11 `job.start` — Lab Channel

| Property | Specification |
|---|---|
| Direction | Control Plane → Lab Agent |
| Request | `LabJobStartRequest { job_id, run_id, deployment_id, resource_id, configuration, idempotency_key }` |
| Response | `OperationAccepted { operation_id, resource_id:run_id, status:ACCEPTED }` |
| Mode | Async |
| Errors | `NOT_FOUND`, `INVALID_STATE`, `RESOURCE_UNAVAILABLE`, `AGENT_OFFLINE`, `RUNTIME_UNAVAILABLE`, `TIMEOUT` |
| Idempotency | Required |
| Authorization | System |
| Phase | Phase 5 |

## 35.12 `job.stop` — Lab Channel

| Property | Specification |
|---|---|
| Direction | Control Plane → Lab Agent |
| Request | `LabJobStopRequest { job_id, run_id, reason, idempotency_key }` |
| Response | `OperationAccepted { operation_id, resource_id:run_id, status:ACCEPTED }` |
| Mode | Async |
| Errors | `NOT_FOUND`, `INVALID_STATE`, `AGENT_OFFLINE`, `RUNTIME_UNAVAILABLE`, `TIMEOUT` |
| Idempotency | Required |
| Authorization | System |
| Phase | Phase 5 |

## 35.13 `job.cancel` — Lab Channel

| Property | Specification |
|---|---|
| Direction | Control Plane → Lab Agent |
| Request | `LabJobCancelRequest { job_id, reason, idempotency_key }` |
| Response | `OperationAccepted { operation_id, resource_id:job_id, status:ACCEPTED }` |
| Mode | Async |
| Errors | `NOT_FOUND`, `INVALID_STATE`, `AGENT_OFFLINE`, `TIMEOUT` |
| Idempotency | Required |
| Authorization | System |
| Phase | Phase 5 |

## 35.14 `resource.lock`

| Property | Specification |
|---|---|
| Direction | Control Plane → Lab Agent |
| Request | `ResourceLockRequest { resource_id, job_id, lease_duration, idempotency_key }` |
| Response | `ResourceLock { allocation_id, resource_id, expires_at }` |
| Mode | Sync |
| Errors | `NOT_FOUND`, `CONFLICT`, `RESOURCE_UNAVAILABLE`, `AGENT_OFFLINE` |
| Idempotency | Required |
| Authorization | System |
| Phase | Phase 5 |

## 35.15 `resource.release`

| Property | Specification |
|---|---|
| Direction | Control Plane → Lab Agent |
| Request | `ResourceReleaseRequest { allocation_id, reason, idempotency_key }` |
| Response | `ResourceReleaseResult { released, allocation_id }` |
| Mode | Sync |
| Errors | `NOT_FOUND`, `CONFLICT`, `AGENT_OFFLINE` |
| Idempotency | Required |
| Authorization | System |
| Phase | Phase 5 |

# 36. Local Studio IPC Commands

Local IPC commands never directly expose a generic shell interface.

Each command maps to a specific allowlisted capability.

## 36.1 `studio.project.open`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `LocalProjectOpenRequest { path }` |
| Response | `LocalProject { project_root, metadata }` |
| Mode | Sync |
| Errors | `INVALID_REQUEST`, `NOT_FOUND`, `FORBIDDEN` |
| Idempotency | Not Required |
| Authorization | Local user |
| Phase | Phase 1 |

## 36.2 `studio.project.create`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `LocalProjectCreateRequest { parent_path, name, template? }` |
| Response | `LocalProject` |
| Mode | Sync |
| Errors | `INVALID_REQUEST`, `CONFLICT`, `FORBIDDEN` |
| Idempotency | Supported |
| Authorization | Local user |
| Phase | Phase 1 |

## 36.3 `studio.project.validate`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `LocalProjectValidateRequest { project_root }` |
| Response | `LocalValidation { valid, diagnostics[] }` |
| Mode | Sync |
| Errors | `INVALID_REQUEST`, `NOT_FOUND`, `VALIDATION_FAILED` |
| Idempotency | Not Required |
| Authorization | Local user |
| Phase | Phase 1 |

## 36.4 `toolchain.detect`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `ToolchainDetectRequest { project_root?, target?, refresh? }` |
| Response | `ToolchainInventory { compilers[], cmake?, ninja?, ros2?, sdk?, cross_compilers[] }` |
| Mode | Sync |
| Errors | `INVALID_REQUEST`, `VALIDATION_FAILED` |
| Idempotency | Not Required |
| Authorization | Local user |
| Phase | Phase 1 |

## 36.5 `test.start`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `TestStartRequest { project_root, profile?, filter? }` |
| Response | `OperationAccepted { operation_id, resource_id:test_id, status:ACCEPTED }` |
| Mode | Async |
| Errors | `INVALID_REQUEST`, `VALIDATION_FAILED`, `TIMEOUT` |
| Idempotency | Supported |
| Authorization | Local user |
| Phase | Phase 1 |

## 36.6 `test.status`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `TestStatusRequest { test_id }` |
| Response | `TestStatus { state, passed, failed, skipped, diagnostics[] }` |
| Mode | Sync |
| Errors | `NOT_FOUND`, `INVALID_REQUEST` |
| Idempotency | Not Required |
| Authorization | Local user |
| Phase | Phase 1 |

## 36.7 `test.cancel`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `TestCancelRequest { test_id }` |
| Response | `TestStatus` |
| Mode | Sync |
| Errors | `NOT_FOUND`, `INVALID_STATE`, `CONFLICT` |
| Idempotency | Supported |
| Authorization | Local user |
| Phase | Phase 1 |

## 36.8 `artifact.package`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `ArtifactPackageRequest { project_root, build_id, manifest, include_allowlist?, signing_profile? }` |
| Response | `LocalArtifact { path, size, digest, signature?, manifest }` |
| Mode | Async |
| Errors | `INVALID_REQUEST`, `VALIDATION_FAILED`, `SIGNATURE_INVALID`, `TIMEOUT` |
| Idempotency | Supported |
| Authorization | Local user |
| Phase | Phase 2 |

## 36.9 `artifact.inspect`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `ArtifactInspectRequest { artifact_path }` |
| Response | `ArtifactInspection { manifest, digest, entries[], source_entries_detected, valid }` |
| Mode | Sync |
| Errors | `NOT_FOUND`, `ARTIFACT_INVALID`, `VALIDATION_FAILED` |
| Idempotency | Not Required |
| Authorization | Local user |
| Phase | Phase 2 |

## 36.10 `system.info`

| Property | Specification |
|---|---|
| Direction | Studio UI → Local Runtime |
| Request | `SystemInfoRequest {}` |
| Response | `SystemInfo { os, architecture, version, runtime_version, capabilities }` |
| Mode | Sync |
| Errors | `SERVICE_UNAVAILABLE` |
| Idempotency | Not Required |
| Authorization | Local user |
| Phase | Phase 1 |

# 37. Command-to-Event Relationship

Commands initiate operations.

Events communicate resulting state changes.

Example:

    booking.create
         |
         v
    Booking Service
         |
         +--> booking.created
         |
         +--> booking.confirmed

Another example:

    job.start
         |
         v
    Scheduler
         |
         +--> job.queued
         +--> job.validating
         +--> job.allocating
         +--> job.deploying
         +--> job.starting
         +--> job.running

## 38. Command State Ownership

| Domain | Command Authority | State Authority |
|---|---|---|
| Auth | Control Plane | Identity subsystem |
| User | Control Plane | Identity |
| Organization | Control Plane | Organization module |
| Project | Control Plane | Project module |
| Platform | Control Plane | Platform module |
| Build | Local Runtime | Local Runtime |
| Artifact | Control Plane | Artifact module/object storage |
| Booking | Control Plane | Booking module |
| Credit | Control Plane | Credit ledger |
| Job | Control Plane | Job module |
| Run | Control Plane | Run module |
| Result | Control Plane | Result module/object storage |
| Experiment | Control Plane | Experiment module |
| Lab | Control Plane/Lab Agent | Lab/resource modules |
| Runtime | Lab Agent | Runtime |

# 39. Command Processing Pipeline

The standard cloud processing path is:

    HTTP Request
       |
       v
    Authentication
       |
       v
    Envelope Validation
       |
       v
    Authorization
       |
       v
    Idempotency Check
       |
       v
    Domain Validation
       |
       v
    Transaction
       |
       v
    Domain Service
       |
       +--> Durable State
       |
       +--> Outbox/Event
       |
       v
    Response

## 40. Command Processing Rules

A command must not:

- bypass authentication;
- bypass authorization;
- mutate another tenant;
- directly manipulate database tables from transport code;
- execute arbitrary shell commands;
- silently ignore invalid state;
- create duplicate financial operations;
- create duplicate resource allocations.

## 41. Asynchronous Command Processing

For long-running operations:

    Command
       |
       v
    Validate
       |
       v
    Persist Operation
       |
       v
    Queue
       |
       v
    Worker
       |
       v
    Domain Operation
       |
       v
    Event
       |
       v
    Durable Final State

## 42. Idempotency and Async Operations

The idempotency record must be created before a side effect becomes externally
visible where required.

Example:

    job.start
       |
       v
    Idempotency Check
       |
       v
    Job State Transition
       |
       v
    Dispatch
       |
       v
    Lab Agent

Repeated `job.start` must not start a second execution.

# 43. Command Security

Every cloud command must have:

- authenticated principal;
- authorization decision;
- tenant context;
- audit context where appropriate;
- request correlation.

Every Lab command must additionally have:

- Agent identity;
- protocol version;
- resource authorization;
- execution authorization.

# 44. Command Auditability

Commands with material business effects should create audit records.

Examples:

- organization membership changes;
- artifact acceptance/rejection;
- booking creation/cancellation;
- credit consumption/refund;
- job start/stop/cancel;
- administrative Lab changes.

Audit records should contain:

- actor;
- organization;
- command;
- resource;
- request ID;
- timestamp;
- outcome.

# 45. Phase 0 Mapping — Protocol Foundation

Phase 0 establishes:

- command naming;
- common envelopes;
- error model;
- identifiers;
- versioning;
- contracts;
- OpenAPI foundation;
- IPC command conventions;
- Lab command conventions.

Primary commands established:

    auth.*
    project.*
    platform.*
    system.info
    toolchain.detect

Phase 0 acceptance is contract-level rather than feature-complete.

# 46. Phase 1 Mapping — Studio

Phase 1 implements:

- authentication;
- projects;
- local workspace;
- local toolchain discovery;
- local build;
- local test;
- REST client;
- WebSocket foundation.

Primary commands:

    auth.*
    project.*
    platform.list
    platform.get
    build.*
    test.*
    studio.project.*
    toolchain.detect
    system.info

# 47. Phase 2 Mapping — Build and Artifact

Phase 2 implements:

- `.krv` packaging;
- artifact registration;
- upload;
- digest;
- signature;
- validation;
- compatibility.

Primary commands:

    artifact.*
    platform.compatibility
    artifact.package
    artifact.inspect

# 48. Phase 3 Mapping — Control Plane

Phase 3 implements:

- Control Plane domain modules;
- users;
- organizations;
- projects;
- platforms;
- durable APIs;
- asynchronous workers.

Primary commands:

    user.*
    organization.*
    project.*
    platform.*
    artifact.*

# 49. Phase 4 Mapping — Booking and Commercial

Phase 4 implements:

- availability;
- quotes;
- booking;
- credit wallets;
- consumption;
- refunds;
- transaction history.

Primary commands:

    availability.query
    booking.*
    credit.*

# 50. Phase 5 Mapping — Remote Execution

Phase 5 implements:

- Lab Agent;
- registration;
- heartbeat;
- resource discovery;
- artifact retrieval;
- deployment;
- job execution.

Primary commands:

    job.*
    agent.*
    artifact.fetch
    deployment.*
    resource.*

# 51. Phase 6 Mapping — Physical Robot Integration

Phase 6 extends the command model to:

- physical platform compatibility;
- runtime configuration;
- robot resources;
- safety-aware execution;
- agent configuration.

Primary commands:

    agent.configure
    platform.capabilities
    platform.compatibility
    resource.lock
    resource.release
    deployment.*

# 52. Phase 7 Mapping — Live and Results

Phase 7 implements:

- run lifecycle;
- telemetry;
- logs;
- live state;
- results;
- experiments.

Primary commands:

    run.*
    result.*
    experiment.*
    job.logs

# 53. Phase 8 Mapping — Production

Phase 8 hardens:

- command security;
- rate limits;
- idempotency;
- audit;
- compatibility;
- observability;
- operational controls;
- deprecation.

No new core business command should bypass the established command model.

# 54. Command Catalogue Summary

| Domain | Commands | Main Phase |
|---|---:|---|
| Auth | 4 | 1 |
| Users | 2 | 3 |
| Organizations | 6 | 3 |
| Projects | 6 | 1–8 |
| Platforms | 4 | 1–2 |
| Builds | 7 | 1 |
| Artifacts | 7 | 2 |
| Bookings | 7 | 4 |
| Credits | 5 | 4 |
| Jobs | 8 | 5–7 |
| Runs | 7 | 7 |
| Results | 6 | 7 |
| Experiments | 6 | 7 |
| Lab Agent | 15 | 5–6 |
| Local IPC | 10 | 1–2 |

## 55. Complete Command Inventory

    auth.login
    auth.logout
    auth.refresh
    auth.me

    user.get
    user.update

    organization.create
    organization.get
    organization.update
    organization.members.list
    organization.members.add
    organization.members.remove

    project.create
    project.list
    project.get
    project.update
    project.archive
    project.delete

    platform.list
    platform.get
    platform.capabilities
    platform.compatibility

    build.validate
    build.configure
    build.start
    build.status
    build.logs
    build.cancel
    build.result

    artifact.create
    artifact.upload
    artifact.get
    artifact.list
    artifact.validate
    artifact.delete
    artifact.download

    availability.query
    booking.quote
    booking.create
    booking.get
    booking.list
    booking.modify
    booking.cancel

    credit.balance
    credit.quote
    credit.transaction.list
    credit.consumption
    credit.refund

    job.create
    job.get
    job.list
    job.start
    job.stop
    job.cancel
    job.status
    job.logs

    run.get
    run.list
    run.status
    run.metrics
    run.telemetry
    run.logs
    run.stop

    result.get
    result.list
    result.files
    result.download
    result.summary
    result.metrics

    experiment.create
    experiment.get
    experiment.list
    experiment.update
    experiment.add_run
    experiment.results

    agent.register
    agent.heartbeat
    agent.status
    agent.capabilities
    agent.resources
    agent.configure
    artifact.fetch
    deployment.prepare
    deployment.start
    deployment.stop
    job.start
    job.stop
    job.cancel
    resource.lock
    resource.release

    studio.project.open
    studio.project.create
    studio.project.validate
    toolchain.detect
    test.start
    test.status
    test.cancel
    artifact.package
    artifact.inspect
    system.info

# 56. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Command naming drift | High | Central catalogue |
| Duplicate command implementation | High | Shared contracts |
| Missing authorization | Critical | Mandatory auth matrix |
| Duplicate booking | Critical | Idempotency |
| Duplicate charge | Critical | Ledger + idempotency |
| Duplicate execution | Critical | Job state + idempotency |
| API version break | High | Contract compatibility |
| Lab command replay | Critical | Secure channel + identity |
| WebSocket dependence | High | REST state recovery |
| IPC privilege escalation | Critical | Explicit allowlist |
| Arbitrary shell execution | Critical | No generic shell command |
| Payload growth | Medium | Explicit schemas and limits |
| Event duplication | Medium | Consumer deduplication |
| Resource stale lock | High | Lease + reconciliation |
| Tenant leakage | Critical | Server-side authorization |
| Protocol drift | High | CI contract tests |
| Ambiguous state transition | High | State-machine validation |
| Unsafe cloud stop semantics | Critical | Separate physical safety |
| Lab outage | High | Reconciliation |
| Version proliferation | Medium | Deprecation policy |

# 57. Risk — Generic Command Handler

A generic handler such as:

    execute(command, arbitrary_payload)

can bypass domain controls.

Mitigation:

- explicit command registrations;
- typed schemas;
- domain-specific handlers;
- authorization policy per command;
- command-level tests.

# 58. Risk — Command/Database Coupling

Exposing database fields directly as API payloads creates long-term compatibility
problems.

Mitigation:

- domain DTOs;
- protocol schemas;
- service-layer mapping;
- database-independent contracts.

# 59. Risk — Local IPC Privilege Escalation

A malicious or compromised UI could attempt unauthorized native operations.

Mitigation:

- Tauri capability restrictions;
- explicit IPC commands;
- path validation;
- process allowlists;
- no generic shell API;
- controlled environment variables.

# 60. Risk — Lab Agent Overreach

A compromised Control Plane or command could affect physical resources.

Mitigation:

- Agent authorization;
- resource-level authorization;
- local policy;
- safety controller;
- physical E-stop;
- audit;
- command validation.

# 61. Risk — Incomplete Command Lifecycle

A command may be implemented without corresponding events or durable state.

Mitigation:

Every asynchronous command must define:

    request
      +
    acceptance
      +
    state machine
      +
    events
      +
    durable state
      +
    recovery

# 62. Open Questions

1. Should the final public API expose every logical command as a REST endpoint?
2. Which commands should be represented as resource-specific HTTP methods?
3. Should command names be embedded in REST metadata or remain internal?
4. Which schema language will be canonical?
5. Will JSON Schema and OpenAPI share generated definitions?
6. Which commands require exactly-once business semantics?
7. What is the idempotency retention period?
8. Which Lab Channel transport will be selected?
9. Will Lab Agent commands use request/response correlation IDs?
10. Should Lab commands support explicit command sequence numbers?
11. What event replay mechanism is required?
12. What is the maximum artifact size?
13. What is the maximum result size?
14. What are telemetry rate limits?
15. Which commands require elevated audit logging?
16. Should organization creation be restricted to administrators?
17. What exact billing/payment commands are required for production?
18. Should payment commands be added to this catalogue or isolated in a billing
    protocol?
19. Should experiment commands be promoted to Phase 6 or remain Phase 7?
20. Should runs support multiple attempts per job?
21. Should `job.cancel` and `job.stop` remain distinct?
22. Should `run.stop` be exposed independently from `job.stop`?
23. What exact physical safety states must be exposed through protocol?
24. What command operations remain available while a Lab Agent is offline?
25. What commands require online authorization on every execution?
26. What command compatibility guarantees are required across Lab Agent versions?
27. What is the exact protocol retirement policy?

# 63. Full Acceptance Criteria

## Command Catalogue

- [ ] Every command has a unique name.
- [ ] Every command has a defined domain.
- [ ] Every command has a defined direction.
- [ ] Every command has a request schema.
- [ ] Every command has a response schema.
- [ ] Every command is marked sync or async.
- [ ] Every command has defined errors.
- [ ] Every command has an idempotency policy.
- [ ] Every command has an authorization policy.
- [ ] Every command has an implementation phase.

## Authentication

- [ ] `auth.login` is defined.
- [ ] `auth.logout` is defined.
- [ ] `auth.refresh` is defined.
- [ ] `auth.me` is defined.
- [ ] Credential handling is secure.
- [ ] Authentication errors are standardized.

## Users and Organizations

- [ ] User read operation is defined.
- [ ] User update operation is defined.
- [ ] Organization creation is defined.
- [ ] Organization read is defined.
- [ ] Organization update is defined.
- [ ] Membership listing is defined.
- [ ] Membership addition is defined.
- [ ] Membership removal is defined.
- [ ] Administrative authorization is enforced.

## Projects

- [ ] Project creation is defined.
- [ ] Project listing is defined.
- [ ] Project retrieval is defined.
- [ ] Project update is defined.
- [ ] Project archival is defined.
- [ ] Project deletion is defined.
- [ ] Project operations enforce tenant isolation.

## Platforms

- [ ] Platform listing is defined.
- [ ] Platform retrieval is defined.
- [ ] Platform capability discovery is defined.
- [ ] Artifact/platform compatibility is defined.
- [ ] Platform information is treated as authoritative Control Plane data.

## Builds

- [ ] Local build validation is defined.
- [ ] Local build configuration is defined.
- [ ] Local build execution is defined.
- [ ] Build status is defined.
- [ ] Build logs are defined.
- [ ] Build cancellation is defined.
- [ ] Build result retrieval is defined.
- [ ] Build operations remain local to the Studio.

## Artifacts

- [ ] Artifact creation is defined.
- [ ] Artifact upload is defined.
- [ ] Artifact retrieval is defined.
- [ ] Artifact listing is defined.
- [ ] Artifact validation is defined.
- [ ] Artifact deletion is defined.
- [ ] Artifact download is defined.
- [ ] Artifact digest is represented.
- [ ] Artifact signature is represented where required.
- [ ] Artifact compatibility is validated.
- [ ] Source-code upload is not represented as a supported command.

## Bookings

- [ ] Availability query is defined.
- [ ] Booking quote is defined.
- [ ] Booking creation is idempotent.
- [ ] Booking retrieval is defined.
- [ ] Booking listing is defined.
- [ ] Booking modification is defined.
- [ ] Booking cancellation is defined.
- [ ] Booking conflict is explicitly represented.
- [ ] Credit reservation is associated with booking where required.

## Credits

- [ ] Balance query is defined.
- [ ] Credit quote is defined.
- [ ] Transaction history is defined.
- [ ] Consumption is idempotent.
- [ ] Refund is idempotent.
- [ ] Platform-specific wallets are supported.
- [ ] Financial operations are auditable.

## Jobs

- [ ] Job creation is idempotent.
- [ ] Job retrieval is defined.
- [ ] Job listing is defined.
- [ ] Job start is idempotent.
- [ ] Job stop is idempotent.
- [ ] Job cancellation is idempotent.
- [ ] Job status is defined.
- [ ] Job logs are defined.
- [ ] Job state transitions are validated.

## Runs

- [ ] Run retrieval is defined.
- [ ] Run listing is defined.
- [ ] Run status is defined.
- [ ] Run metrics are defined.
- [ ] Run telemetry is defined.
- [ ] Run logs are defined.
- [ ] Run stop is idempotent.
- [ ] Run state remains recoverable after disconnect.

## Results

- [ ] Result retrieval is defined.
- [ ] Result listing is defined.
- [ ] Result files are defined.
- [ ] Result download is defined.
- [ ] Result summary is defined.
- [ ] Result metrics are defined.
- [ ] Large result objects use object storage or equivalent.

## Experiments

- [ ] Experiment creation is defined.
- [ ] Experiment retrieval is defined.
- [ ] Experiment listing is defined.
- [ ] Experiment update is defined.
- [ ] Runs can be associated with experiments.
- [ ] Experiment result aggregation is defined.

## Lab Agent

- [ ] Agent registration is defined.
- [ ] Agent heartbeat is defined.
- [ ] Agent status is defined.
- [ ] Agent capability discovery is defined.
- [ ] Agent resource discovery is defined.
- [ ] Agent configuration is defined.
- [ ] Artifact fetch is defined.
- [ ] Deployment preparation is defined.
- [ ] Deployment start is defined.
- [ ] Deployment stop is defined.
- [ ] Lab job start is defined.
- [ ] Lab job stop is defined.
- [ ] Lab job cancellation is defined.
- [ ] Resource locking is defined.
- [ ] Resource release is defined.
- [ ] Agent identity is authenticated.
- [ ] Lab commands are authorized.
- [ ] Lab commands are auditable.

## Local Studio IPC

- [ ] Project open is defined.
- [ ] Project creation is defined.
- [ ] Project validation is defined.
- [ ] Toolchain discovery is defined.
- [ ] Local tests can be started.
- [ ] Test status is available.
- [ ] Tests can be cancelled.
- [ ] Artifact packaging is defined.
- [ ] Artifact inspection is defined.
- [ ] System information is defined.
- [ ] IPC uses explicit commands.
- [ ] Generic shell execution is not exposed.
- [ ] Filesystem paths are validated.
- [ ] Native capabilities are restricted.

## Protocol Semantics

- [ ] Common request envelope is defined.
- [ ] Common response envelope is defined.
- [ ] Asynchronous acceptance is defined.
- [ ] Request IDs are mandatory.
- [ ] Event IDs are supported.
- [ ] Stable error codes exist.
- [ ] Versioning is explicit.
- [ ] Unknown optional fields are tolerated.
- [ ] Breaking changes require versioning.
- [ ] Database schema is not the protocol contract.

## Idempotency

- [ ] Side-effecting commands identify idempotency requirements.
- [ ] Booking creation is protected.
- [ ] Credit consumption is protected.
- [ ] Credit refunds are protected.
- [ ] Job creation is protected.
- [ ] Job start is protected.
- [ ] Job stop is protected.
- [ ] Resource locking is protected.
- [ ] Deployment commands are protected.
- [ ] Lab execution commands are protected.

## Authorization

- [ ] Every cloud command has authorization.
- [ ] Tenant context is enforced.
- [ ] Project ownership/access is enforced.
- [ ] Administrative commands require elevated roles.
- [ ] Billing commands require billing authorization.
- [ ] Lab commands require system/agent authorization.
- [ ] Local IPC commands require local capability authorization.

## Failure and Recovery

- [ ] Transient failures are distinguishable.
- [ ] Invalid states are rejected.
- [ ] Resource conflicts are explicit.
- [ ] Retry semantics are defined.
- [ ] Async operations survive client disconnect.
- [ ] WebSocket disconnect does not lose authoritative state.
- [ ] Lab disconnect triggers reconciliation.
- [ ] Duplicate requests are safe.

## Security

- [ ] Credentials are never logged.
- [ ] Secrets are never included in ordinary command payloads.
- [ ] Tenant isolation is tested.
- [ ] Authentication failures are tested.
- [ ] Authorization failures are tested.
- [ ] Replay risks are addressed.
- [ ] Payload limits exist.
- [ ] Rate limits exist.
- [ ] Lab Agent identity is protected.
- [ ] Physical safety is independent of command protocol.

## Phase Completion

- [ ] Phase 0 command contracts are defined.
- [ ] Phase 1 Studio commands are implemented.
- [ ] Phase 2 artifact commands are implemented.
- [ ] Phase 3 Control Plane domain commands are implemented.
- [ ] Phase 4 booking and credit commands are implemented.
- [ ] Phase 5 Lab execution commands are implemented.
- [ ] Phase 6 physical integration commands are implemented.
- [ ] Phase 7 run/result/experiment commands are implemented.
- [ ] Phase 8 production command hardening is complete.

# 64. Final Command Architecture Baseline

The Kritva RaaS command model establishes a single consistent rule:

> **A command requests a controlled operation; the receiving authority validates, authorizes, executes, persists, and reports the outcome through a typed response and, where applicable, durable state and events.**

The complete execution relationship is:

    Studio
       |
       | User Command
       v
    Control Plane
       |
       +--> Authentication
       |
       +--> Authorization
       |
       +--> Idempotency
       |
       +--> Validation
       |
       +--> Domain Service
       |
       +--> Durable State
       |
       +--> Event
       |
       v
    Lab Agent
       |
       +--> Resource Lock
       |
       +--> Artifact Fetch
       |
       +--> Deployment
       |
       +--> Runtime
       |
       v
    Robot

For local development:

    Studio UI
       |
       | Explicit IPC Command
       v
    Rust Local Runtime
       |
       +--> Project
       +--> Toolchain
       +--> Build
       +--> Test
       +--> Package
       |
       v
    .krv Artifact

The catalogue therefore preserves the central RaaS product boundary:

> **Source code stays local; only the validated execution artifact crosses into the remote execution environment.**

It also preserves the physical execution boundary:

> **Cloud commands control authorized application execution, but local robot safety remains independent of cloud protocol availability.**

The command catalogue is the contract foundation from which the REST API,
WebSocket events, Lab Protocol, Studio IPC, backend services, workers, and
integration tests shall be implemented.
