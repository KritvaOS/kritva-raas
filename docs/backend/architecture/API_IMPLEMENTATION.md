# Kritva RaaS Backend API Implementation Architecture

**Document:** `docs/backend/architecture/API_IMPLEMENTATION.md`  
**Status:** Normative backend implementation architecture  
**Document version:** 1.0.0  
**Implementation boundary:** Backend HTTP API and realtime gateway implementation  
**Product API architecture:** `docs/architecture/API_ARCHITECTURE.md`  
**Wire contract:** `docs/protocol/API_CONTRACT.md`  
**Event contract:** `docs/protocol/EVENT_CONTRACT.md`  
**WebSocket contract:** `docs/protocol/WEBSOCKET_CONTRACT.md`  
**Lab protocol:** `docs/protocol/LAB_PROTOCOL.md`  
**Artifact manifest:** `docs/protocol/ARTIFACT_MANIFEST.md`  
**Canonical phase definitions:** `docs/planning/PHASES.md`

---

## 1. Purpose

This document defines how the Kritva RaaS backend implements its HTTP API and realtime gateway.

It establishes the responsibilities, boundaries, dependencies, and implementation rules for:

- HTTP routing and controller dispatch.
- Request and response DTOs.
- Mapping between transport DTOs and application models.
- Middleware and request-processing pipelines.
- Authentication context propagation.
- Request validation and authorization enforcement.
- Application service invocation.
- Repository integration.
- Transaction boundaries and idempotency coordination.
- Error mapping and response serialization.
- OpenAPI generation and validation.
- Realtime gateway implementation and event delivery integration.
- Backend API observability, testing, and operational behavior.

This document is implementation-focused. It does not define a second public API contract or establish an alternative set of endpoint semantics.

## 2. Ownership and Boundaries

### 2.1 What this document owns

This document owns the backend implementation of the API boundary.

The backend implementation MUST follow the requirements in this document for:

1. HTTP routing and controller responsibilities.
2. Request binding and transport DTO validation.
3. Mapping between public DTOs and application-layer inputs and outputs.
4. Middleware ordering and request context propagation.
5. Authentication integration and authorization enforcement.
6. Application service invocation and result handling.
7. Repository access through application-owned persistence boundaries.
8. Transaction coordination and idempotency enforcement.
9. Exception classification and HTTP error mapping.
10. Response DTO construction and serialization.
11. OpenAPI generation, validation, and implementation consistency.
12. Realtime gateway integration with the canonical event contract.
13. Backend-specific observability, resilience, and conformance testing.

### 2.2 Product API architecture ownership

`docs/architecture/API_ARCHITECTURE.md` owns the product and system API architecture.

It defines the API's architectural role, resource relationships, consumer-facing interaction patterns, and the system-level placement of API capabilities.

This document MUST NOT redefine those product-level architectural decisions.

When a backend implementation decision affects the product API architecture, the implementation MUST follow the architecture document or request an explicit architecture decision.

### 2.3 Wire contract ownership

`docs/protocol/API_CONTRACT.md` owns the normative REST wire contract.

It defines public endpoint paths, HTTP methods, request and response fields, field types, authorization scopes, status codes, error representations, pagination, filtering, idempotency requirements, versioning, compatibility, and OpenAPI contract requirements.

Backend controllers and DTOs MUST implement that contract.

This document MUST NOT create alternative endpoint definitions, public field names, or externally visible semantics.

If an implementation detail conflicts with the wire contract, the wire contract takes precedence until formally revised.

### 2.4 Event and realtime contract ownership

`docs/protocol/EVENT_CONTRACT.md` owns canonical event envelopes, domain event types, payload schemas, event identity, delivery semantics, ordering, replay, retention, and consumer compatibility.

`docs/protocol/WEBSOCKET_CONTRACT.md` owns WebSocket transport, connection handling, subscription messages, resume behavior, and transport-level delivery.

`docs/protocol/LAB_PROTOCOL.md` owns the Lab Agent protocol.

`docs/protocol/ARTIFACT_MANIFEST.md` owns the artifact manifest representation and integrity requirements.

This document defines only how backend implementation components connect to these contracts.

### 2.5 Ownership decision table

| Concern | Authoritative document | Responsibility of this document |
|---|---|---|
| Product and system API architecture | `docs/architecture/API_ARCHITECTURE.md` | Implement architectural boundaries |
| REST endpoints and wire schemas | `docs/protocol/API_CONTRACT.md` | Bind, validate, and serialize requests and responses |
| Event payloads and delivery semantics | `docs/protocol/EVENT_CONTRACT.md` | Integrate event publication and consumption |
| WebSocket transport | `docs/protocol/WEBSOCKET_CONTRACT.md` | Implement gateway adapters and connection lifecycle |
| Lab Agent messaging | `docs/protocol/LAB_PROTOCOL.md` | Integrate validated Lab Agent messages |
| Artifact manifest | `docs/protocol/ARTIFACT_MANIFEST.md` | Invoke manifest validation and storage interfaces |
| Backend controllers and routing | This document | Define implementation structure and responsibilities |
| DTOs and mapping | This document | Define mapping boundaries and implementation rules |
| Middleware and error translation | This document | Define request pipeline and backend behavior |
| Repository integration | This document | Define persistence access boundaries |
| OpenAPI build and validation | This document | Define implementation-generation workflow |
| Realtime gateway implementation | This document | Define gateway responsibilities and adapters |

## 3. Normative language

The terms MUST, MUST NOT, REQUIRED, SHOULD, SHOULD NOT, RECOMMENDED, MAY, and OPTIONAL are normative.

A MUST requirement is mandatory for a conforming implementation.

A SHOULD requirement may be departed from only when the implementation has a documented reason and the deviation does not violate an authoritative contract.

Implementation-specific choices MAY vary where this document does not establish a mandatory rule.

A backend implementation MUST NOT use an implementation-specific exception to override an externally visible contract requirement.

## 4. Architectural principles

The backend API implementation MUST follow these principles:

1. Controllers remain thin transport adapters.
2. Application services own use-case orchestration.
3. Domain logic MUST NOT depend on HTTP framework types.
4. Repositories MUST be accessed through defined application or domain persistence interfaces.
5. Public DTOs MUST remain separate from internal domain entities.
6. Authorization MUST be enforced on the server.
7. Validation MUST occur before domain side effects.
8. Database transactions MUST protect invariants that require atomic changes.
9. Retries MUST NOT duplicate billable or executable operations.
10. Errors MUST be mapped through a centralized policy.
11. OpenAPI output MUST be reproducible from authoritative contract sources.
12. Realtime delivery MUST preserve canonical event identity and payload semantics.
13. Tenant isolation MUST be enforced at every applicable access boundary.
14. Backend implementation modules MUST have explicit ownership and dependencies.

## 5. Logical backend structure

The implementation SHOULD separate the backend into the following logical layers:

| Layer | Primary responsibility |
|---|---|
| HTTP routing | Match method and path and dispatch the request |
| Middleware | Apply cross-cutting request policies |
| Controllers | Translate HTTP requests into application invocations |
| Request DTOs | Represent and validate incoming wire data |
| Mapping layer | Convert between DTOs and application inputs or outputs |
| Application services | Orchestrate use cases and transaction boundaries |
| Domain layer | Enforce business invariants and state transitions |
| Repository interfaces | Define persistence operations required by the application |
| Repository implementations | Translate repository operations into database access |
| External adapters | Integrate identity, artifact storage, execution, and other services |
| Response mapping | Construct contract-compliant response DTOs |
| Error mapping | Convert known failures into documented HTTP errors |
| Realtime gateway | Authenticate connections and deliver authorized events |
| Observability | Record metrics, logs, traces, and request outcomes |

An implementation MAY use a modular monolith or distributed services, provided these responsibilities remain distinguishable.

A framework's package layout MUST NOT be treated as proof of architectural separation.

## 6. Dependency direction

The preferred dependency direction is:

    HTTP route
        -> middleware
        -> controller
        -> request DTO and mapper
        -> application service
        -> domain model and repository interfaces
        -> repository or external adapter implementation

Responses follow the reverse data path through application results, response mapping, and serialization.

Controllers MUST NOT invoke database drivers directly.

Domain entities MUST NOT depend on HTTP request or response types.

Repository implementations MUST NOT determine public HTTP status codes.

Realtime transport handlers MUST NOT bypass authorization or domain validation merely because a message arrived through an authenticated connection.

Dependencies between layers MUST be explicit and testable.

## 7. Suggested source layout

The backend SHOULD use a source layout that makes implementation ownership visible.

    backend/
        src/
            api/
                routes/
                controllers/
                dto/
                mappers/
                middleware/
                errors/
                openapi/
            application/
                services/
                commands/
                queries/
                results/
                ports/
            domain/
                models/
                value_objects/
                policies/
                errors/
            infrastructure/
                repositories/
                database/
                transactions/
                identity/
                artifact_storage/
                execution/
                messaging/
            realtime/
                gateway/
                connections/
                subscriptions/
                delivery/
                adapters/
            observability/
                logging/
                metrics/
                tracing/
        tests/
            unit/
            integration/
            contract/
            security/
            realtime/
            conformance/

This layout is RECOMMENDED, not a requirement to use these exact directory names.

If the repository uses a different language or framework, equivalent logical separation MUST be preserved.

The implementation MUST NOT create a second source of truth for public endpoint definitions.

## 8. HTTP routing responsibilities

The routing layer MUST map each supported HTTP method and path to exactly one intended handler.

Route registration MUST use the endpoint definitions in `docs/protocol/API_CONTRACT.md`.

Route definitions MUST NOT embed business logic.

A route MUST declare or reference its authentication and authorization requirements.

A protected route MUST NOT accidentally inherit a public security policy because middleware was omitted.

Route matching MUST distinguish path parameters from literal path segments.

The router MUST reject unsupported methods with `405 Method Not Allowed`.

The implementation SHOULD return an appropriate `Allow` header for a method-not-allowed response.

Unknown paths MUST be handled by the centralized error policy.

The router MUST NOT expose framework debugging pages, internal file paths, or stack traces through public responses.

## 9. Route registration and completeness

Every implemented public endpoint MUST be registered through the backend's authoritative route configuration.

Route registration MUST be testable without starting the full production environment.

A route inventory SHOULD be generated or checked in continuous integration.

The route inventory MUST identify:

- HTTP method.
- Path.
- Handler or controller.
- Authentication requirement.
- Required authorization scope.
- Request DTO, where applicable.
- Response DTO, where applicable.
- Declared success status.
- Declared error behavior.

A route MUST NOT be considered complete merely because it returns a placeholder response.

The implementation MUST detect duplicate route registrations that produce ambiguous dispatch.

Disabled endpoints MUST fail predictably rather than return fabricated resource representations.

## 10. Controller responsibilities

Controllers MUST act as transport adapters.

A controller MUST:

1. Receive a request already processed by the applicable middleware.
2. Read the authenticated principal and request context.
3. Bind and validate the request DTO.
4. Perform any controller-level authorization checks required by the route policy.
5. Map the request DTO into an application input.
6. Invoke the appropriate application service.
7. Map the application result to the public response DTO.
8. Return the contract-defined HTTP status and headers.
9. Allow centralized error middleware to handle unclassified failures.

A controller MUST NOT implement domain state machines.

A controller MUST NOT perform complex database queries.

A controller MUST NOT duplicate validation rules already owned by the domain layer when those rules enforce business invariants.

A controller MAY perform transport-level validation, such as required fields, string length, JSON type, and syntactic timestamp validation.

## 11. Controller boundaries

A controller MUST NOT expose internal domain entities directly as JSON.

A controller MUST NOT return repository models without mapping.

A controller MUST NOT convert every exception into `200 OK`.

A controller MUST NOT independently invent error response structures.

A controller SHOULD avoid direct calls to multiple repositories. Multi-step use cases SHOULD be orchestrated by application services.

If a controller requires a business rule to determine the operation outcome, that rule SHOULD be implemented in the application or domain layer.

Controllers SHOULD remain small enough that their behavior can be tested without a live database.

## 12. Request DTO design

Each endpoint with a JSON request body MUST have an explicit request DTO or an equivalent validated schema binding.

Request DTOs MUST represent the public wire contract, not the internal persistence schema.

DTO property names and JSON serialization MUST match `docs/protocol/API_CONTRACT.md`.

A DTO MUST declare required and optional fields explicitly.

DTOs MUST enforce syntactic constraints supported by the selected validation framework.

Examples of transport-level constraints include:

- Required properties.
- String length limits.
- Numeric ranges.
- Enum membership.
- Array bounds.
- Timestamp syntax.
- Nested object structure.
- Allowed property sets.

DTO validation MUST NOT be the sole enforcement point for authorization, resource ownership, credit integrity, or other business invariants.

## 13. DTO separation

Request and response DTOs SHOULD be separate types.

The implementation SHOULD NOT reuse one DTO for creation, partial update, and response serialization when those operations have different field permissions.

Create DTOs MUST exclude server-generated fields unless the public contract explicitly allows client-generated values.

Update DTOs MUST distinguish omitted fields from explicit values where partial-update semantics require that distinction.

Response DTOs MUST exclude internal fields that are not part of the public contract.

DTOs MUST NOT expose:

- Password hashes.
- Access tokens or refresh tokens beyond the authorized authentication response.
- Private keys or signing material.
- Internal database connection details.
- Internal stack traces.
- Unredacted secret configuration.
- Private storage credentials.

## 14. Response DTO design

Every resource response MUST be constructed using a defined response DTO or an equivalent explicit serialization schema.

Response mapping MUST include all required public fields.

Response mapping MUST NOT omit required fields because the underlying repository query failed to load a related object.

If required response data cannot be obtained, the operation MUST fail according to the error policy rather than emit a misleading partial representation.

Optional response fields MAY be omitted when their values are unavailable and the contract permits omission.

Nullable fields MUST be serialized according to the contract.

Server-managed identifiers, timestamps, status values, and revision values MUST be sourced from authoritative application results.

## 15. Mapping layer

The mapping layer MUST convert transport DTOs into application commands, queries, and result representations.

Mapping logic MUST remain deterministic for a given input and mapping configuration.

Mapping MUST NOT silently discard a required public field.

Mapping MUST NOT infer authorization from resource IDs or field names.

Mapping MUST NOT generate side effects.

The mapper SHOULD be independently unit-tested.

The implementation SHOULD distinguish:

- Request DTO to application command mapping.
- Query parameter to application query mapping.
- Domain or application result to response DTO mapping.
- Internal failure to public error mapping.

A mapper MUST NOT contain repository access or transaction management.

## 16. Partial update mapping

For `PATCH` operations, the implementation MUST preserve the difference between an omitted field and a supplied field.

If the public contract permits explicit `null`, the mapper MUST preserve the documented null semantics.

If the public contract does not permit `null`, request validation MUST reject it.

A partial update MUST NOT overwrite unspecified fields with default values.

The application service MUST validate the complete resulting state after applying the permitted changes.

Fields that are immutable through a particular endpoint MUST be rejected or ignored only as explicitly defined by the wire contract. The implementation MUST NOT silently broaden mutation permissions.

## 17. Middleware chain

The backend MUST implement a documented middleware chain.

The recommended request-processing order is:

1. Request size and basic transport checks.
2. Request ID and correlation context initialization.
3. Access logging with sensitive-data redaction.
4. CORS handling where applicable.
5. Authentication.
6. Tenant and principal context establishment.
7. Rate limiting.
8. Route matching.
9. Authorization policy resolution.
10. Request content-type and schema validation.
11. Idempotency handling where required.
12. Controller dispatch.
13. Centralized exception handling.
14. Response serialization and security headers.
15. Completion metrics and tracing.

The exact framework execution order MAY differ when required by framework semantics.

The effective order MUST preserve the security and correctness guarantees described in this document.

Middleware MUST NOT depend on undocumented side effects from unrelated middleware.

## 18. Request identity and correlation

Each request MUST have a server-generated request identifier.

The server MAY accept a client-provided request identifier only when it validates the value and follows the deployment's trust policy.

A request identifier MUST NOT be treated as proof of identity.

The backend SHOULD propagate a correlation identifier across downstream service calls.

If the client provides `X-Correlation-ID`, the server MUST validate its length and allowed character set before accepting it.

Invalid correlation metadata MUST be rejected or replaced according to a documented policy.

Request IDs and correlation IDs SHOULD appear in diagnostic logs and error responses where the wire contract allows them.

## 19. Authentication middleware

Authentication middleware MUST validate the configured identity credential before protected application logic executes.

It MUST establish a trusted principal context containing the identity information required by downstream authorization.

The principal context SHOULD contain:

- Principal identifier.
- Tenant or organization context where applicable.
- Granted scopes or permissions.
- Authentication mechanism.
- Credential expiry metadata where available.
- Correlation and request identifiers.

Authentication middleware MUST NOT trust a user ID or tenant ID copied directly from an unverified request body.

Missing or invalid credentials MUST be translated to the documented `401 Unauthorized` response.

Authentication failures MUST NOT reveal token validation internals or cryptographic details.

## 20. Authorization middleware and application checks

Authorization MUST be enforced at the API boundary and, where necessary, within application services.

Route-level scope checks MUST be centralized or declared through a consistent policy mechanism.

Resource-level checks MUST verify the caller's access to the actual resource.

A valid scope MUST NOT automatically grant access to every resource in the same resource category.

Tenant isolation MUST be enforced in repository queries and application operations, not solely in the user interface or route configuration.

Application services MUST revalidate critical permissions when they can be invoked through non-HTTP entry points.

Authorization denial MUST produce a documented `403 Forbidden` or a non-disclosing `404 Not Found` according to the public contract and resource-discovery policy.

## 21. Tenant context propagation

The authenticated tenant context MUST be propagated to application services and repository operations.

Tenant-scoped repository methods SHOULD require an explicit tenant or authorization context.

A repository MUST NOT rely on a caller-supplied tenant identifier without the corresponding authorization check.

Application services MUST verify cross-resource relationships within the same authorized tenant boundary.

The implementation SHOULD make tenant context explicit in method signatures or a typed request context.

Ambient global tenant state MUST NOT be used where concurrent requests could leak context across tenants.

Background workers MUST receive an explicit authorized tenant context for tenant-owned work.

## 22. Rate-limiting middleware

Rate limiting MUST be applied according to the policy defined by `docs/protocol/API_CONTRACT.md`.

The middleware SHOULD support configurable limits by principal, tenant, service identity, and endpoint category.

The middleware MUST distinguish rate-limit rejection from application-level domain failure.

Rate-limited requests MUST use the documented HTTP status and error code.

The middleware SHOULD set applicable rate-limit headers when the deployment supports them.

The middleware MUST NOT include sensitive account or tenant information in publicly visible rate-limit diagnostics.

Distributed deployments SHOULD use a shared or otherwise coordinated rate-limit mechanism when per-instance limits would permit materially higher aggregate rates than intended.

## 23. Request validation pipeline

Validation MUST be divided into distinct stages.

### 23.1 Transport validation

Transport validation checks:

- HTTP method and route.
- Request media type.
- JSON syntax.
- Required request properties.
- Property types and allowed fields.
- String lengths and numeric bounds.
- Query parameter syntax.
- Timestamp formatting.
- Collection limits.

Transport validation SHOULD occur before application service invocation.

### 23.2 Application validation

Application validation checks:

- Resource existence.
- Resource relationships.
- Current resource state.
- Caller permissions.
- Idempotency consistency.
- Scheduling constraints.
- Credit and reservation preconditions.
- Cross-resource invariants.
- Whether the requested use case is permitted.

### 23.3 Domain validation

Domain validation MUST enforce invariants that remain true regardless of the calling transport.

Examples include valid state transitions, credit-ledger integrity, immutable identity rules, and domain-specific resource constraints.

A request MUST NOT bypass domain validation by invoking an application service through a different adapter.

## 24. Validation error representation

Validation failures MUST be mapped to the error envelope defined by `docs/protocol/API_CONTRACT.md`.

The backend MUST use stable error codes.

The implementation SHOULD distinguish:

- Invalid JSON.
- Missing required field.
- Invalid field type.
- Invalid field value.
- Invalid resource relationship.
- Invalid state transition.
- Authorization failure.
- Concurrency conflict.

Field-level details SHOULD identify the relevant public field without exposing internal implementation names.

A validation error MUST NOT include a stack trace or raw database exception.

The backend MUST NOT translate a transient infrastructure failure into a field-validation error.

## 25. Application service invocation

Controllers MUST invoke application services through explicit interfaces.

An application service MUST represent a use case or a coherent application operation.

Application services MAY coordinate multiple repositories and external adapters.

Application services MUST enforce the use case's authorization, state-transition, and consistency requirements.

Application services MUST NOT depend on framework-specific HTTP request objects.

Application service inputs SHOULD be immutable or treated as immutable after validation.

Application service outputs SHOULD provide sufficient information for response mapping without requiring the controller to query repositories again.

Application services SHOULD return typed outcomes or raise documented application exceptions rather than encode every failure as a generic string.

## 26. Command and query separation

The implementation SHOULD distinguish operations that change state from operations that retrieve state.

Commands MUST declare their expected side effects.

Queries MUST NOT perform domain mutations.

A command SHOULD return the authoritative result of the committed operation or a documented asynchronous acceptance result.

A query MUST apply tenant and authorization filters before returning data.

The implementation MAY use separate command and query interfaces, but MUST NOT introduce duplicate sources of truth for resource state.

Read models MAY be optimized independently where their consistency guarantees are documented.

## 27. Transaction boundaries

Application services MUST define transaction boundaries for operations that require atomic changes.

Repository calls participating in one database transaction MUST use the same transaction context.

A transaction MUST either commit all required database changes or roll them back.

The backend MUST NOT report a successful mutation when its required transaction has rolled back.

Credit reservations, credit consumption, booking transitions, and other invariant-sensitive operations MUST preserve their domain consistency requirements.

External network calls SHOULD NOT be held inside a long-running database transaction unless the design explicitly requires it and documents the failure behavior.

For multi-service operations, the implementation MUST document the consistency model and recovery strategy.

## 28. Idempotency implementation

The backend MUST implement idempotency for operations requiring it under `docs/protocol/API_CONTRACT.md`.

The idempotency layer MUST identify the authenticated principal, tenant, operation, key, and request fingerprint.

The backend MUST persist the operation outcome sufficiently to handle retries after process failure.

The request fingerprint MUST be computed from a deterministic representation of the semantically relevant request fields.

Equivalent requests MUST NOT be treated as conflicting solely because JSON object keys were serialized in a different order.

The same key with conflicting content MUST return the documented idempotency conflict.

Concurrent requests using the same key MUST NOT execute the same protected side effect twice.

Idempotency records MUST have a documented retention policy.

## 29. Idempotency and transaction coordination

Where possible, the idempotency record, domain mutation, and durable operation outcome MUST be committed atomically.

If the architecture requires an outbox record, it SHOULD be committed in the same transaction as the domain mutation.

If the operation invokes an external service, the application service MUST use a documented recovery mechanism.

The backend MUST distinguish an operation that failed before commitment from one whose outcome is uncertain because the connection failed after commitment.

When the outcome is uncertain, a retry with the same key MUST resolve to the original logical operation rather than create a new operation.

The implementation MUST NOT depend exclusively on in-memory idempotency caches for durable operations.

## 30. Repository integration

Repository interfaces MUST express the persistence operations required by application services.

Repository implementations MUST encapsulate database-specific queries and mapping.

Controllers MUST NOT use repositories directly.

Domain entities MUST NOT depend on a specific SQL client, ORM session, or database connection pool.

Repository methods MUST make transaction participation explicit or use a documented transaction context.

Repository queries MUST apply tenant isolation and applicable authorization filters.

A repository MUST NOT return records outside the caller's authorized scope merely because the caller supplied a valid resource ID.

Repository failures MUST be translated into typed infrastructure or application failures.

## 31. Repository result semantics

Repository interfaces SHOULD distinguish:

- Resource found.
- Resource not found.
- Duplicate or unique-key conflict.
- Optimistic concurrency conflict.
- Transaction failure.
- Infrastructure unavailable.
- Data integrity violation.

The application layer MUST NOT infer that every empty query result is an infrastructure failure.

A missing resource MUST be mapped according to the endpoint's documented visibility policy.

Unique constraints SHOULD enforce critical uniqueness requirements at the database layer in addition to application validation.

The backend MUST NOT expose SQL statements, table names, database credentials, or raw database errors in public responses.

## 32. Optimistic concurrency

The backend MUST enforce conditional-update requirements defined by the wire contract.

Where the contract uses ETags and `If-Match`, the controller or middleware MUST validate the precondition before committing the mutation.

The application service MUST protect against stale updates even if concurrency changes occur between request validation and transaction commit.

A repository MAY use a version column or equivalent database mechanism to detect conflicting updates.

A detected conflict MUST be mapped to the documented `412 Precondition Failed` response.

The implementation MUST NOT silently overwrite concurrent changes when the operation requires optimistic concurrency.

## 33. Event publication integration

The backend MUST use `docs/protocol/EVENT_CONTRACT.md` for canonical event schemas and delivery semantics.

Application services MUST NOT invent private public-event envelopes.

For state changes that require durable event publication, the implementation SHOULD use a transactional outbox or equivalent reliable publication mechanism.

The outbox publisher MUST preserve the original event ID and canonical payload across retries.

A publication retry MUST NOT create a new logical event merely because an earlier transmission failed.

The event consumer or broker adapter MUST validate authorization and schema according to its role.

The backend MUST distinguish successful database commitment from successful downstream event delivery when those operations are not atomic.

## 34. Outbox processing

An outbox record SHOULD contain enough information to reconstruct the canonical event, including event identity, event type, schema version, aggregate identity, and payload.

The outbox MUST be durable for events that the contract requires to survive process failure.

The publisher SHOULD retry transient failures with bounded exponential backoff and jitter.

Permanent schema or authorization failures MUST be surfaced for operator intervention rather than retried indefinitely.

Outbox processing MUST be observable through metrics and structured logs.

Cleanup MUST NOT remove unpublished records.

Published-record retention MUST follow the operational and audit policy.

## 35. Error classification

The backend MUST classify failures before mapping them to HTTP responses.

At minimum, the error layer MUST distinguish:

| Failure class | Example | Handling |
|---|---|---|
| Transport validation | Invalid JSON | Client error |
| Authentication | Expired credential | Unauthorized response |
| Authorization | Missing permission | Forbidden or non-disclosing not-found response |
| Domain validation | Invalid state transition | Documented domain error |
| Concurrency | Stale resource revision | Precondition failure |
| Idempotency | Same key with conflicting content | Conflict response |
| Persistence | Database unavailable | Service error |
| External dependency | Upstream timeout | Gateway or service error |
| Unexpected failure | Unclassified exception | Internal error |

The implementation MUST NOT classify failures solely by matching human-readable exception messages.

Typed exceptions or stable internal error codes SHOULD be used.

## 36. Centralized error mapping

A centralized error mapper MUST translate application and infrastructure failures into the public error representation.

The error mapper MUST follow `docs/protocol/API_CONTRACT.md`.

Known error classes MUST map consistently across endpoints.

Unexpected exceptions MUST be logged with a request identifier and converted to a generic internal error response.

The mapper MUST NOT expose stack traces, raw SQL errors, secret values, or internal service credentials.

The mapper MUST set the correct HTTP status and stable error code.

If an error response includes field details, those details MUST use public field names.

The mapper MUST preserve correlation metadata where the contract permits it.

## 37. Error response consistency

All controller paths MUST use the same error envelope.

A controller MUST NOT return an ad hoc JSON object for an error.

Validation libraries MUST be adapted to the canonical error model.

Framework-generated error pages MUST be disabled for public API responses.

The implementation MUST test errors produced before routing, during authentication, during validation, in application services, and during response serialization.

If response serialization fails after a domain commit, the backend MUST preserve the operation outcome so a safe retry can retrieve it where idempotency applies.

## 38. Response serialization

Response serialization MUST use explicit DTO schemas or controlled serializer configuration.

The serializer MUST produce valid JSON and documented field names.

Timestamps MUST follow the UTC RFC 3339 requirements in the wire contract.

Identifiers MUST be serialized as strings.

Nullable and optional fields MUST follow their declared schema semantics.

Enums MUST serialize using the exact public values defined by the contract.

The serializer MUST NOT expose private domain properties by default through automatic object reflection.

Serialization behavior SHOULD be covered by contract tests.

## 39. OpenAPI ownership and generation

The backend implementation MUST generate or validate OpenAPI output against `docs/protocol/API_CONTRACT.md`.

The product-level API architecture remains owned by `docs/architecture/API_ARCHITECTURE.md`.

This document owns the implementation process for producing, validating, and testing the generated OpenAPI artifact.

OpenAPI generation MUST use authoritative route metadata and DTO schemas, or a checked-in specification validated against those sources.

The implementation MUST NOT maintain an undocumented third definition of public endpoints.

If code-first generation is used, generated operations MUST be reviewed against the normative wire contract.

If contract-first generation is used, implementation DTOs and routes MUST be tested against the checked-in contract.

## 40. OpenAPI generation rules

The generated specification MUST include:

- The `/api/v1` versioned API path or its equivalent server configuration.
- Every supported operation and HTTP method.
- Unique operation identifiers.
- Request DTO schemas.
- Response DTO schemas.
- Required fields and optional fields.
- Authentication and authorization declarations.
- Documented success status codes.
- Documented error responses.
- Pagination parameters where applicable.
- Idempotency headers where applicable.
- Concurrency headers where applicable.
- Timestamp and identifier formats.
- Relevant enum and numeric constraints.

The specification MUST NOT include secrets or internal credentials.

Generation MUST be deterministic for the same source revision and configuration.

Generated files MUST NOT be manually modified unless the build workflow explicitly supports and validates such modifications.

## 41. OpenAPI consistency gates

Continuous integration MUST validate the generated OpenAPI document.

Validation MUST detect duplicate operation IDs, invalid references, missing schemas, missing security declarations, and contradictory field constraints.

The implementation SHOULD compare generated OpenAPI output with the accepted baseline to detect breaking changes.

Any detected breaking change MUST be reviewed against the versioning and compatibility policy in `docs/protocol/API_CONTRACT.md`.

An operation MUST NOT be considered implemented if it is absent from the generated specification but declared supported by the API contract.

A documented operation MUST NOT be marked supported merely because an OpenAPI path exists.

## 42. Realtime gateway responsibilities

The realtime gateway implements the backend side of WebSocket connections and subscriptions.

It MUST follow `docs/protocol/WEBSOCKET_CONTRACT.md`.

The gateway MUST authenticate connections before granting access to protected subscriptions.

The gateway MUST validate subscription requests and enforce tenant and resource authorization.

The gateway MUST preserve canonical event IDs and event payloads.

The gateway MUST NOT redefine event schemas.

The gateway MUST NOT treat a successful WebSocket handshake as authorization to receive every event stream.

The gateway SHOULD separate connection management, subscription management, event delivery, and transport serialization into independently testable components.

## 43. Realtime connection lifecycle

The gateway MUST implement the connection lifecycle defined by the WebSocket contract.

It MUST handle authentication failure, connection closure, heartbeat behavior, and reconnect behavior according to that contract.

Connection state MUST be bounded by configured resource limits.

The gateway MUST release subscriptions and associated resources when a connection closes or expires.

A connection failure MUST NOT cause a domain mutation to be repeated automatically.

The gateway MUST distinguish a connection-level acknowledgement from successful application processing of a domain event.

The gateway MUST NOT promise durable delivery beyond the guarantees defined by the event and WebSocket contracts.

## 44. Subscription management

Subscription handling MUST validate the requested topics, event filters, tenant scope, and resource access.

The gateway MUST reject unauthorized subscriptions.

The gateway MUST NOT widen access because a client changes a filter after authentication.

Subscription state MUST be isolated between authenticated principals and tenants.

The gateway SHOULD enforce maximum subscriptions per connection and maximum concurrent connections per principal.

Subscription changes MUST be observable and auditable where required by security policy.

If a subscription is resumed, the gateway MUST apply the cursor and replay rules defined by the WebSocket and event contracts.

## 45. Event delivery adapter

The delivery adapter MUST translate the event-store or broker representation into the canonical event representation without changing event semantics.

Transport-specific metadata MAY be added outside the canonical event where permitted by the WebSocket contract.

The adapter MUST NOT replace the canonical `event_id` with a connection ID or delivery-attempt ID.

The adapter MUST NOT rewrite timestamps to the current delivery time.

Duplicate delivery MUST preserve the original event identity.

The gateway SHOULD use bounded queues and explicit backpressure handling.

A slow consumer MUST NOT be allowed to exhaust unbounded memory or indefinitely block unrelated connections.

## 46. Realtime authorization and privacy

The gateway MUST authorize every subscription against the authenticated principal and current policy.

Tenant isolation MUST apply to event routing, replay, and delivery.

The gateway MUST NOT trust a tenant ID in a subscription payload without verifying it against the authenticated context.

Sensitive events MUST be restricted to authorized consumers.

The gateway MUST NOT log access tokens or complete sensitive payloads unnecessarily.

When permissions are revoked, the implementation MUST apply the documented policy for terminating or narrowing existing subscriptions.

Security-relevant delivery failures SHOULD generate structured operational records.

## 47. Realtime failure handling

The gateway MUST classify connection, authorization, serialization, broker, and backpressure failures.

Transient infrastructure failures SHOULD use bounded retry behavior.

Invalid event payloads MUST NOT be silently transformed into different event types.

An event that cannot be serialized according to the contract MUST be rejected or quarantined according to the delivery policy.

The gateway MUST expose metrics for connection counts, subscription counts, delivery latency, delivery failures, reconnects, and backpressure.

Failure handling MUST preserve event identity and replay consistency.

## 48. Lab Agent integration boundary

The backend MUST treat Lab Agent communication as a separate protocol boundary defined by `docs/protocol/LAB_PROTOCOL.md`.

A Lab Agent message MUST be authenticated and validated before it can trigger an application service.

The backend MUST distinguish an agent-reported observation from an authoritative platform state transition.

Lab registration, heartbeat, capability updates, health observations, and disconnection reports MUST be processed through explicit application use cases.

The backend MUST NOT allow a public REST controller to impersonate a Lab Agent.

The backend MUST NOT claim that a heartbeat proves attached hardware is safe to operate.

## 49. Artifact integration boundary

Artifact creation, validation, publication, and retrieval MUST use the artifact contract defined by `docs/protocol/ARTIFACT_MANIFEST.md`.

Controllers MUST NOT implement artifact integrity checks directly.

Artifact validation MUST be invoked through an application service or a dedicated adapter.

Storage references MUST be validated before they are exposed to authorized consumers.

The backend MUST NOT expose storage credentials in DTOs or error responses.

Artifact lifecycle state MUST be updated through the authoritative application service.

When artifact operations produce events, those events MUST conform to `docs/protocol/EVENT_CONTRACT.md`.

## 50. External service adapters

External services MUST be accessed through explicit adapters or application ports.

Adapters MUST translate external protocol responses into stable internal result types.

Application services MUST NOT depend directly on vendor-specific SDK objects unless the dependency is isolated behind an adapter.

External errors MUST be classified into retryable and non-retryable categories.

Timeouts MUST be configured for external calls.

Retries MUST be bounded and MUST NOT duplicate non-idempotent side effects.

Adapters SHOULD expose health and failure metrics.

A missing external dependency MUST result in a documented failure, not a fabricated successful response.

## 51. Background processing

Long-running work SHOULD be delegated to background workers or asynchronous processing components.

The HTTP layer MUST return the response semantics defined by the wire contract.

A background worker MUST receive the resource identity, correlation metadata, and authorized execution context required for the operation.

Workers MUST revalidate time-sensitive preconditions before performing consequential side effects.

A worker MUST NOT trust a stale authorization decision indefinitely.

Retries MUST preserve operation identity and respect idempotency requirements.

Worker completion and failure MUST update authoritative application state before corresponding events are published.

## 52. Observability

The backend MUST provide structured logging, metrics, and distributed tracing appropriate to the deployment.

Request logs SHOULD include:

- Request ID.
- Correlation ID.
- HTTP method.
- Route template.
- Response status.
- Duration.
- Authenticated principal identifier where permitted.
- Tenant identifier where permitted.
- Error code when an operation fails.

Logs MUST NOT include bearer tokens, refresh tokens, passwords, private keys, or other authentication secrets.

The backend SHOULD measure request volume, latency, error rate, rate-limit rejections, validation failures, repository latency, transaction failures, and external dependency failures.

Realtime metrics SHOULD include active connections, subscription counts, event delivery latency, replay volume, and backpressure events.

Metrics MUST avoid unbounded user-controlled labels.

## 53. Health and readiness

The implementation SHOULD expose operational health and readiness through the deployment's approved interface.

Liveness MUST indicate whether the process is functioning sufficiently to remain running.

Readiness MUST indicate whether the instance can safely accept the relevant class of work.

A readiness check MAY inspect required dependencies, but MUST use bounded timeouts.

Health endpoints MUST NOT expose credentials, internal connection strings, or sensitive deployment configuration.

A degraded optional dependency SHOULD be reported distinctly from a failure that prevents all useful API operation.

## 54. Configuration management

Backend configuration MUST be validated at startup.

Required configuration MUST fail fast when absent or invalid.

Secrets MUST be supplied through the approved secret-management mechanism and MUST NOT be checked into source control.

Configuration changes MUST follow the deployment's approved update policy.

The backend MUST distinguish configuration values from user-supplied request data.

Environment-specific configuration MUST NOT change public API semantics without an explicit contract decision.

Operational configuration SHOULD include request-size limits, timeout limits, rate limits, retry policies, and realtime connection limits.

## 55. Resource management

The backend MUST bound resource consumption.

Bounds SHOULD cover request bodies, concurrent requests, database connections, external calls, event queues, WebSocket connections, subscriptions, and background jobs.

A slow external service MUST NOT cause unbounded request accumulation.

Database connection pools MUST have explicit limits.

Realtime queues MUST apply backpressure or disconnect policies when limits are reached.

Resource exhaustion MUST produce a controlled error or connection outcome.

The implementation MUST release locks, database sessions, subscriptions, and temporary resources on both success and failure paths.

## 56. Security hardening

The backend MUST enforce secure transport in production.

The backend MUST validate authentication and authorization on every protected route.

The backend MUST prevent cross-tenant data access through route manipulation or identifier substitution.

Request parsing MUST defend against malformed or oversized input.

CORS MUST be configured explicitly for browser-facing deployments.

Security headers SHOULD be applied where appropriate.

Error responses MUST NOT reveal internal stack traces.

Administrative operations MUST be auditable.

Dependencies MUST be maintained according to the project's security-update policy.

Security-sensitive changes MUST include regression tests.

## 57. Testing strategy

The implementation MUST use multiple test levels.

### 57.1 Unit tests

Unit tests MUST cover:

- Controller-to-application mapping.
- Request and response DTO validation.
- Mapper behavior.
- Application service orchestration.
- Error classification.
- Authorization policy evaluation.
- Idempotency decisions.
- Realtime subscription authorization.
- Event envelope preservation.

Unit tests SHOULD avoid requiring a live database or broker.

### 57.2 Integration tests

Integration tests MUST cover:

- HTTP routing and middleware order.
- Authentication and authorization.
- Repository queries and tenant filters.
- Transaction boundaries.
- Idempotency persistence.
- Error mapping.
- Outbox publication.
- OpenAPI generation.
- Realtime connection and subscription behavior.

Integration tests SHOULD use isolated test resources and deterministic fixtures.

### 57.3 Contract tests

Contract tests MUST compare implementation behavior with `docs/protocol/API_CONTRACT.md`.

They MUST verify endpoint paths, methods, required fields, field types, status codes, error schemas, pagination, idempotency, and concurrency behavior.

Event integration tests MUST validate against `docs/protocol/EVENT_CONTRACT.md`.

Realtime tests MUST validate transport behavior against `docs/protocol/WEBSOCKET_CONTRACT.md`.

### 57.4 Security tests

Security tests MUST include missing authentication, insufficient scope, cross-tenant resource access, malformed input, excessive payload size, and unauthorized administrative operations.

Tests MUST verify that denied requests produce no unintended domain side effects.

## 58. Failure injection and recovery tests

The backend SHOULD test failures at important transaction and integration boundaries.

Scenarios SHOULD include:

- Database unavailable before a transaction begins.
- Transaction failure before commit.
- Connection loss after commit but before response delivery.
- Outbox publisher unavailable.
- External service timeout.
- Duplicate idempotent request.
- Conflicting idempotency key.
- Stale resource revision.
- Event serialization failure.
- WebSocket disconnect during delivery.
- Slow realtime consumer.
- Worker restart during an asynchronous operation.

The tests MUST verify that retries do not duplicate protected side effects.

Recovery behavior MUST preserve the distinction between a failed operation and an operation whose result is not yet known to the caller.

## 59. Continuous integration requirements

Continuous integration MUST perform the checks applicable to the backend repository.

At minimum, the pipeline SHOULD include:

1. Formatting and lint checks.
2. Static analysis.
3. Unit tests.
4. Integration tests.
5. API contract tests.
6. OpenAPI generation and validation.
7. Security-focused tests.
8. Realtime gateway tests.
9. Dependency vulnerability checks.
10. Build and packaging validation.

A failing mandatory contract test MUST block acceptance of the affected change.

Generated OpenAPI artifacts MUST be reproducible.

Changes to controllers, DTOs, authorization, error mapping, or gateway behavior MUST include the relevant tests.

## 60. Phase and milestone traceability

Canonical phase definitions are maintained in `docs/planning/PHASES.md`.

Existing milestone dossiers under `docs/**/milestones/` remain authoritative for milestone scope.

The following table identifies implementation relevance only.

| Phase | Backend implementation relevance |
|---|---|
| P0 FOUNDATION | Establish API implementation boundaries, validation, and common middleware |
| P1 STUDIO | Implement required identity and project-facing handlers within milestone scope |
| P2 BUILD & ARTIFACT | Implement artifact controllers, DTOs, mapping, and validation adapters |
| P3 CONTROL PLANE | Implement routing, authorization, application invocation, repository integration, and error mapping |
| P4 BOOKING & COMMERCIAL | Implement booking and credit use cases with idempotency and transaction safety |
| P5 EXECUTION | Implement job and run handlers, asynchronous operations, and execution adapters |
| P6 LAB & ROBOT | Implement Lab Agent integration, lab administration, and authorized operational observations |
| P7 LIVE & RESULTS | Implement realtime gateway integration and result access |
| P8 PRODUCTION | Enforce operational hardening, observability, security, and compatibility checks |

### 60.1 Frontend milestone traceability

| Milestone | Backend implementation relationship |
|---|---|
| F-M01 STUDIO FOUNDATION | Provide contract-compliant authentication and common API behavior |
| F-M02 PROJECTS | Provide project and organization-facing handlers |
| F-M03 BUILD & ARTIFACT | Provide artifact metadata and lifecycle handlers |
| F-M04 BOOKING | Provide booking and credit operations |
| F-M05 EXECUTION | Provide job and run operations |
| F-M06 LIVE | Provide authorized realtime gateway integration |
| F-M07 RESULTS | Provide result and manifest retrieval |

### 60.2 Backend milestone traceability

| Milestone | Implementation relationship |
|---|---|
| B-M01 CONTROL PLANE | Establish route, middleware, authorization, and application-service integration |
| B-M02 ARTIFACT | Implement artifact controllers, mapping, and validation integration |
| B-M03 PLATFORM | Implement platform resources and backend integration boundaries |
| B-M04 BOOKING | Implement booking and credit transaction workflows |
| B-M05 EXECUTION | Implement job and run lifecycle handlers |
| B-M06 RESULTS | Implement result, lab, and telemetry-facing integration within milestone scope |
| B-M07 PRODUCTION | Complete operational hardening, error consistency, observability, and conformance |

### 60.3 Database milestone traceability

| Milestone | Implementation relationship |
|---|---|
| DB-M01 FOUNDATION | Establish repository interfaces and shared persistence integration |
| DB-M02 CORE DATA | Integrate core resource repositories and tenant filters |
| DB-M03 BOOKING DATA | Preserve booking and credit transaction invariants |
| DB-M04 EXECUTION DATA | Integrate execution records, result metadata, and event-related persistence |

### 60.4 Cloud milestone traceability

| Milestone | Implementation relationship |
|---|---|
| C-M01 FOUNDATION | Configure secure API ingress and required runtime dependencies |
| C-M02 DEVELOPMENT | Enable local API development, automated testing, and OpenAPI generation |
| C-M03 STAGING | Validate integrated API, repository, event, and realtime behavior |
| C-M04 PRODUCTION | Enforce production security, scaling, monitoring, and recovery controls |

This section MUST NOT redefine product API architecture or expand the scope defined by authoritative milestone dossiers.

## 61. Implementation acceptance checklist

An implementation MUST satisfy the applicable requirements before the affected backend work is accepted.

### 61.1 Ownership and layering

- [ ] This document contains only backend implementation requirements.
- [ ] Product API architecture remains in `docs/architecture/API_ARCHITECTURE.md`.
- [ ] Public wire behavior remains defined by `docs/protocol/API_CONTRACT.md`.
- [ ] Event semantics remain defined by `docs/protocol/EVENT_CONTRACT.md`.
- [ ] WebSocket behavior remains defined by `docs/protocol/WEBSOCKET_CONTRACT.md`.
- [ ] Lab Agent messaging remains defined by `docs/protocol/LAB_PROTOCOL.md`.
- [ ] Artifact manifest semantics remain defined by `docs/protocol/ARTIFACT_MANIFEST.md`.
- [ ] Controllers do not depend directly on database drivers.
- [ ] Domain logic does not depend on HTTP framework types.
- [ ] Repository interfaces and implementations have explicit boundaries.

### 61.2 Routing and DTOs

- [ ] Every supported endpoint has an authoritative route registration.
- [ ] Route methods and paths match the wire contract.
- [ ] Controllers remain thin transport adapters.
- [ ] Request DTOs validate documented field constraints.
- [ ] Response DTOs exclude internal and sensitive fields.
- [ ] Mapping preserves omitted, optional, and nullable field semantics.
- [ ] Serialization uses canonical names, types, enums, and timestamps.
- [ ] Unknown request fields follow the wire contract's rules.

### 61.3 Middleware and security

- [ ] Middleware ordering is documented and tested.
- [ ] Authentication establishes a trusted principal context.
- [ ] Authorization scopes and resource-level permissions are enforced.
- [ ] Tenant context is propagated safely.
- [ ] Rate limiting is applied consistently.
- [ ] Request-size limits are enforced.
- [ ] Secrets are excluded from logs and public errors.
- [ ] Unexpected exceptions are mapped centrally.
- [ ] Administrative operations are auditable.

### 61.4 Application and persistence

- [ ] Application services own use-case orchestration.
- [ ] Domain invariants are enforced independently of HTTP.
- [ ] Repository access is isolated behind defined interfaces.
- [ ] Tenant filtering is enforced in repository operations.
- [ ] Transaction boundaries protect required invariants.
- [ ] Idempotency survives retries and process restarts.
- [ ] Concurrency preconditions are enforced.
- [ ] External calls use explicit adapters and bounded timeouts.
- [ ] Required event publication uses durable integration where applicable.

### 61.5 OpenAPI and realtime

- [ ] OpenAPI output is generated or validated reproducibly.
- [ ] Every operation matches the authoritative wire contract.
- [ ] Authentication and authorization declarations are accurate.
- [ ] Request, response, and error schemas are validated.
- [ ] Realtime connections are authenticated.
- [ ] Subscription authorization is enforced.
- [ ] Canonical event identity and payloads are preserved.
- [ ] Reconnect and replay behavior follows the transport contracts.
- [ ] Backpressure and resource limits are enforced.
- [ ] Realtime failure paths are observable and tested.

### 61.6 Quality and release

- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] API contract tests pass.
- [ ] Security tests pass.
- [ ] OpenAPI validation passes.
- [ ] Event and realtime conformance tests pass.
- [ ] Failure-injection tests cover critical recovery paths.
- [ ] Required CI gates pass.
- [ ] Relevant milestone acceptance criteria are satisfied.

## 62. Change control

Changes to backend implementation architecture MUST identify the affected components and ownership boundaries.

Changes affecting public endpoints, wire schemas, status codes, or authorization scope MUST be reviewed against `docs/protocol/API_CONTRACT.md`.

Changes affecting product-level API architecture MUST be reviewed in `docs/architecture/API_ARCHITECTURE.md`.

Changes affecting event payloads or delivery behavior MUST be reviewed against `docs/protocol/EVENT_CONTRACT.md`.

Changes affecting WebSocket transport MUST be reviewed against `docs/protocol/WEBSOCKET_CONTRACT.md`.

Changes affecting Lab Agent communication MUST be reviewed against `docs/protocol/LAB_PROTOCOL.md`.

Changes affecting manifest representation or integrity MUST be reviewed against `docs/protocol/ARTIFACT_MANIFEST.md`.

A code change MUST NOT silently resolve a contract conflict by introducing a private alternative behavior.

Required implementation deviations MUST be documented and reviewed before acceptance.

## 63. Final implementation statement

This document is the normative implementation baseline for Kritva RaaS backend API handlers and realtime gateway components.

It owns backend routing, controllers, DTOs, mapping, middleware, application service invocation, validation, repository integration, transaction and idempotency coordination, error mapping, OpenAPI generation, and realtime gateway implementation.

It does not own product API architecture or public wire semantics.

All backend implementations MUST follow the authoritative architecture and protocol documents for externally visible behavior.

The implementation MUST preserve explicit ownership boundaries, tenant isolation, validated domain operations, duplicate-safe mutations, consistent error handling, canonical event semantics, and reproducible API contract validation.
