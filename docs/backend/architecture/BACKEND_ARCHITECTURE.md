# Kritva RaaS Backend Implementation Architecture

**Document:** `docs/backend/architecture/BACKEND_ARCHITECTURE.md`  
**Status:** Normative implementation architecture  
**Version:** 1.0.0  
**Scope:** Backend implementation structure, module wiring, runtime configuration, development workflow, and implementation extension rules  
**Control Plane system architecture:** `docs/architecture/BACKEND_ARCHITECTURE.md`  
**API implementation architecture:** `docs/backend/architecture/API_IMPLEMENTATION.md`  
**Product API architecture:** `docs/architecture/API_ARCHITECTURE.md`  
**REST wire contract:** `docs/protocol/API_CONTRACT.md`  
**Canonical phase definitions:** `planning/PHASES.md`

---

## 1. Purpose

This document defines the implementation architecture for the Kritva RaaS backend codebase.

It establishes the engineering conventions and implementation boundaries needed to build, run, test, configure, and extend backend modules consistently.

It covers:

- Repository and package layout.
- Source-code layering.
- Module implementation boundaries.
- Dependency injection and application composition.
- Configuration loading and validation.
- Logging, tracing, and error handling.
- Database and external-service integration seams.
- Background worker implementation.
- Testing seams and test organization.
- Build, run, migration, and local development workflows.
- Module extension and change-management rules.
- Implementation-level quality gates.

This document is intended to keep implementation structure coherent as the backend grows across the canonical Kritva RaaS phases and milestones.

## 2. Ownership and Boundaries

### 2.1 What this document owns

This document owns backend implementation architecture.

It defines how backend code is organized and assembled, including:

1. Repository and package layout.
2. Source-code layering and dependency direction.
3. Module package structure and implementation conventions.
4. Dependency injection and application composition.
5. Configuration loading, validation, and environment overrides.
6. Logging, tracing, metrics integration, and sensitive-data handling.
7. Internal error types and exception propagation conventions.
8. Background worker structure and lifecycle.
9. Repository and external-adapter implementation seams.
10. Unit-test, integration-test, and test-double organization.
11. Build, run, migration, and local-development conventions.
12. Rules for adding or extending backend modules.
13. Implementation-level code review and quality gates.

### 2.2 Control Plane system architecture ownership

`docs/architecture/BACKEND_ARCHITECTURE.md` owns the system/module/ownership architecture of the Control Plane.

That document is authoritative for:

- Control Plane system responsibilities.
- System-level module boundaries and ownership.
- The responsibilities assigned to each Control Plane module.
- Inter-module relationships at the system architecture level.
- Architectural constraints governing how Control Plane capabilities are divided.

This document MUST NOT redefine those responsibilities or create competing module ownership.

When implementation structure requires a decision about which system module owns a capability, the implementation MUST follow `docs/architecture/BACKEND_ARCHITECTURE.md`.

### 2.3 API implementation ownership

`docs/backend/architecture/API_IMPLEMENTATION.md` owns the implementation architecture of the HTTP API and realtime gateway.

It defines controller and routing responsibilities, DTOs and mapping, middleware, request validation, application-service invocation, error mapping, OpenAPI generation, repository integration at the API boundary, and realtime gateway implementation.

This document MUST NOT duplicate or replace those API-specific rules.

### 2.4 Product API and protocol ownership

`docs/architecture/API_ARCHITECTURE.md` owns the product and system API architecture.

`docs/protocol/API_CONTRACT.md` owns the normative REST API wire contract.

`docs/protocol/EVENT_CONTRACT.md` owns event envelopes, event names, payload schemas, identity, ordering, replay, delivery, and consumer compatibility.

`docs/protocol/WEBSOCKET_CONTRACT.md` owns WebSocket transport and connection behavior.

`docs/protocol/LAB_PROTOCOL.md` owns the Lab Agent protocol.

`docs/protocol/ARTIFACT_MANIFEST.md` owns the artifact manifest contract.

This document MUST refer to those sources rather than restate their public schemas or transport semantics.

### 2.5 Ownership matrix

| Concern | Authoritative document | Responsibility here |
|---|---|---|
| Control Plane system/module ownership | `docs/architecture/BACKEND_ARCHITECTURE.md` | Implement the assigned module boundaries |
| Backend repository and package layout | This document | Define implementation conventions |
| Dependency injection and startup wiring | This document | Define composition and lifecycle rules |
| Configuration and runtime setup | This document | Define loading and validation |
| Logging and internal error conventions | This document | Define implementation standards |
| Background worker implementation | This document | Define worker structure and lifecycle |
| HTTP API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` | Keep general backend structure compatible |
| Product API architecture | `docs/architecture/API_ARCHITECTURE.md` | Avoid redefining product-level API decisions |
| REST wire contract | `docs/protocol/API_CONTRACT.md` | Keep implementation behavior compatible |
| Event schema and delivery | `docs/protocol/EVENT_CONTRACT.md` | Integrate event infrastructure without redefining it |
| WebSocket transport | `docs/protocol/WEBSOCKET_CONTRACT.md` | Provide implementation seams where needed |
| Lab Agent protocol | `docs/protocol/LAB_PROTOCOL.md` | Provide adapters and worker integration |
| Artifact manifest | `docs/protocol/ARTIFACT_MANIFEST.md` | Provide storage and validation integration seams |
| Phase definitions | `planning/PHASES.md` | Use canonical phase names and identifiers |
| Milestone scope | `docs/**/milestones/` | Implement the scope defined by each dossier |

## 3. Normative language

The terms MUST, MUST NOT, REQUIRED, SHOULD, SHOULD NOT, RECOMMENDED, and OPTIONAL are normative.

A MUST requirement is mandatory for conformance.

A SHOULD requirement is recommended. Deviations MUST have a documented engineering reason and MUST NOT violate a system architecture or protocol contract.

This document defines implementation conventions, not a new public API.

Where an implementation detail is not constrained here, the implementation MAY choose a suitable approach consistent with the authoritative system and protocol documents.

## 4. Implementation architecture principles

Backend code MUST follow these principles:

1. Each module has one clearly assigned system-level responsibility.
2. Implementation packages MUST reflect the ownership boundaries in `docs/architecture/BACKEND_ARCHITECTURE.md`.
3. Dependencies MUST be explicit.
4. Business logic MUST remain independent of transport and framework details.
5. Infrastructure implementations MUST be replaceable through defined interfaces where isolation is valuable.
6. Configuration MUST be validated before dependent components start.
7. Runtime resources MUST have explicit owners and lifecycles.
8. Errors MUST retain their meaning across layer boundaries.
9. Background work MUST be observable and recoverable.
10. Tests MUST exercise business behavior without requiring every production dependency.
11. Module extensions MUST preserve existing contracts unless a reviewed change explicitly updates them.
12. No implementation module may silently assume ownership of another module's data or behavior.

## 5. Repository layout

The repository SHOULD use a layout that makes source ownership and execution entry points easy to identify.

    backend/
        src/
            bootstrap/
            composition/
            config/
            shared/
            modules/
            infrastructure/
            workers/
            observability/
            runtime/
        migrations/
        scripts/
        tests/
            unit/
            integration/
            contract/
            architecture/
            fixtures/
        docs/
        Makefile
        pyproject.toml or package manifest
        lockfile

The exact language-specific files MAY differ.

The implementation MUST preserve the logical separation between module code, shared infrastructure, runtime composition, migrations, and tests.

A directory named `shared` MUST NOT become an unrestricted dumping ground for unrelated business logic.

## 6. Package responsibilities

### 6.1 `bootstrap/`

The bootstrap package owns the process entry point and startup sequence.

It MUST:

- Load configuration.
- Initialize logging and observability.
- Validate startup prerequisites.
- Invoke the composition root.
- Start the application or worker runtime.
- Coordinate graceful shutdown.
- Return a non-zero exit status when required startup steps fail.

It MUST NOT contain domain rules or endpoint-specific business logic.

### 6.2 `composition/`

The composition package owns dependency construction and wiring.

It MUST instantiate the selected implementations of application ports and infrastructure adapters.

It MUST make important dependencies explicit.

It MUST NOT create hidden global service locators.

It SHOULD expose a composition function that can be exercised by tests with alternate configuration and test doubles.

### 6.3 `config/`

The configuration package owns configuration parsing, defaults, validation, and typed access.

It MUST NOT perform business operations.

It MUST NOT expose secrets through ordinary configuration logging.

### 6.4 `shared/`

The shared package MAY contain genuinely cross-cutting primitives such as clock abstractions, identifier utilities, common typed errors, and narrowly scoped interfaces.

It MUST NOT own business behavior assigned to a system module.

New shared functionality MUST have at least two credible consumers or a documented architectural reason to be shared.

### 6.5 `modules/`

The modules package contains implementations of system modules defined by `docs/architecture/BACKEND_ARCHITECTURE.md`.

Each module MUST remain within its assigned responsibility.

Package names SHOULD match the authoritative module names where practical.

A package name MUST NOT be interpreted as permission to expand system-level ownership.

### 6.6 `infrastructure/`

The infrastructure package contains reusable technical adapters, such as database connectivity, message transport, object storage clients, identity-provider integration, and external-service clients.

Infrastructure adapters MUST NOT own unrelated domain decisions.

### 6.7 `workers/`

The workers package contains process entry points and runtime adapters for background work.

Worker use cases SHOULD call the same application interfaces used by other entry points rather than duplicate business logic.

### 6.8 `observability/`

The observability package owns logging, tracing, metrics setup, and common instrumentation utilities.

It MUST NOT contain business policy.

### 6.9 `runtime/`

The runtime package owns process lifecycle coordination and shared runtime services.

It MAY include health checks, shutdown coordination, and worker supervision.

It MUST NOT duplicate the bootstrap or composition root.

## 7. Module package layout

A module SHOULD use a predictable internal layout.

    modules/
        <module_name>/
            __init__.py or module entry file
            api/
            application/
            domain/
            ports/
            infrastructure/
            config/
            tests/

Equivalent directories or packages MAY be used for another language.

Not every module needs every subdirectory.

A small module SHOULD NOT be forced to create empty layers with no architectural purpose.

Where a module is large enough to contain several use cases, its internal layout MUST make the following concerns distinguishable:

- Entry-point adapters.
- Application orchestration.
- Domain rules.
- External dependency interfaces.
- Infrastructure implementations.
- Module-specific configuration.

## 8. Layering rules

The implementation SHOULD separate code into these conceptual layers:

| Layer | Owns | Must not own |
|---|---|---|
| Entry-point adapters | HTTP, worker, or message dispatch | Core business rules |
| Application | Use-case orchestration and transaction coordination | Framework-specific transport details |
| Domain | Business invariants and state transitions | Network clients or database sessions |
| Ports | Interfaces required by application and domain code | Vendor-specific implementation details |
| Infrastructure | Database and external-system adapters | Public API policy |
| Composition | Dependency construction | Business decisions |
| Bootstrap/runtime | Process lifecycle | Resource-specific domain behavior |

A layer MAY be represented by packages, classes, modules, or functions according to the language.

The logical dependency direction MUST remain clear.

## 9. Dependency direction

Application and domain code MUST NOT depend on concrete infrastructure implementations.

Infrastructure implementations MAY depend on application-owned interfaces.

Entry-point adapters MAY depend on application services and transport-specific libraries.

Composition code MAY depend on all layers needed to construct the running system.

Domain code MUST NOT import HTTP framework types, database session types, or message broker client types.

Circular module dependencies MUST be removed or resolved through a narrower interface.

Architecture tests SHOULD detect prohibited imports and dependency cycles.

## 10. Application services

Application services implement use cases assigned to their owning system module.

A service SHOULD have a name that communicates the operation it performs.

Application services MUST:

- Accept explicit inputs.
- Validate use-case preconditions.
- Invoke domain behavior.
- Coordinate required repositories and adapters.
- Establish or join the appropriate transaction.
- Return a typed result.
- Preserve the documented failure classification.

Application services MUST NOT depend on an HTTP request object or global request state.

They MUST NOT duplicate use cases already owned by another module.

Cross-module workflows MUST use the interfaces and coordination pattern approved by the system architecture.

## 11. Domain model boundaries

Domain objects MUST enforce the invariants they own.

Domain objects SHOULD be independent of persistence schemas.

Database records MUST NOT automatically become the domain model merely because an ORM maps them conveniently.

State transitions MUST be explicit where the resource has a constrained lifecycle.

A domain operation MUST reject an invalid transition rather than silently normalize an impossible state.

Domain failures SHOULD use typed errors or typed outcomes.

A domain model MUST NOT publish transport-specific error responses.

## 12. Ports and adapters

Ports define the operations an application component requires from an external dependency.

Examples include:

- Repository interfaces.
- Clock interfaces.
- Identity-verification interfaces.
- Artifact storage interfaces.
- Event publication interfaces.
- Execution-provider interfaces.
- External service clients.

A port MUST express the minimum required capability.

It SHOULD avoid exposing vendor-specific types.

An adapter MUST translate between the port contract and the external system.

Adapter errors MUST be translated into stable internal error categories.

The implementation SHOULD use fake adapters for unit tests and controlled adapters for integration tests.

## 13. Dependency injection

The backend MUST use an explicit dependency-construction strategy.

Constructor injection or explicit factory parameters SHOULD be preferred for required dependencies.

A component MUST NOT retrieve arbitrary dependencies from a global mutable service locator.

The composition root MUST be the authoritative location where production implementations are selected and connected.

Dependencies MUST be constructed once at the appropriate scope.

Process-wide clients MAY be singletons when their libraries support safe concurrent use.

Request-scoped or transaction-scoped dependencies MUST NOT be accidentally shared across concurrent requests.

Tests MUST be able to replace external dependencies without patching unrelated global state.

## 14. Composition root

The composition root MUST construct the running application in a predictable order.

The order SHOULD be:

1. Parse and validate configuration.
2. Initialize logging and tracing.
3. Initialize shared infrastructure clients.
4. Construct repository implementations.
5. Construct module application services.
6. Construct worker handlers and transport adapters.
7. Register routes, subscriptions, and scheduled jobs.
8. Run required startup checks.
9. Mark the process ready.

The composition root MUST fail startup when a required dependency cannot be constructed.

Optional dependencies MAY be unavailable only when the runtime has a documented degraded mode.

The composition root MUST NOT silently substitute a production dependency with an in-memory fake.

## 15. Module registration and wiring

Module registration MUST be explicit.

Each module SHOULD expose a narrow registration function or factory.

Registration SHOULD declare the dependencies it needs and the entry points it contributes.

A module MUST NOT modify unrelated module registries through hidden import-time side effects.

Duplicate registration MUST be detected when it would create ambiguous behavior.

The composition root MUST follow the system ownership architecture when deciding which modules are instantiated and how they interact.

Module wiring MUST NOT establish direct database access between modules as a shortcut around the approved ownership boundary.

## 16. Configuration model

Configuration MUST be represented through typed settings objects or an equivalent validated configuration model.

Configuration SHOULD be grouped by concern, including:

- Application runtime.
- Database.
- Authentication and identity.
- External service endpoints.
- Object storage.
- Event transport.
- Realtime transport.
- Background workers.
- Logging and tracing.
- Timeouts and retry policies.
- Resource limits.

A module MUST receive only the configuration it requires.

The implementation MUST NOT make unrelated configuration globally mutable.

Configuration defaults MUST be documented.

Security-sensitive configuration MUST NOT have an unsafe production default.

## 17. Configuration sources and precedence

The configuration loader SHOULD support a documented precedence order.

A recommended order, from lower to higher priority, is:

1. Built-in safe defaults.
2. Checked-in non-secret configuration.
3. Environment-specific configuration.
4. Environment variables.
5. Approved secret provider.
6. Explicit command-line overrides where supported.

The actual order MUST be documented and tested.

A secret provider MUST NOT be overridden by an untrusted source.

The configuration loader MUST distinguish a missing value from an explicitly empty value when that distinction matters.

Configuration values MUST be validated before dependent components start.

## 18. Secret management

Secrets MUST NOT be committed to source control.

Secrets MUST NOT be printed in startup logs, exception messages, metrics, or diagnostic endpoints.

Configuration logging MUST redact secret fields by default.

Production credentials SHOULD be supplied through a managed secret provider or deployment secret mechanism.

Secret rotation MUST follow the lifecycle supported by the consuming client.

The implementation SHOULD avoid copying secrets into long-lived strings or objects when the language permits safer handling.

Test credentials MUST be isolated from production credentials.

## 19. Configuration validation

Startup validation MUST reject invalid required configuration.

Validation MUST cover:

- Required endpoints.
- Supported protocol schemes.
- Numeric ranges.
- Timeout and retry limits.
- Database configuration.
- Authentication settings.
- Worker concurrency limits.
- Queue and connection limits.
- Storage configuration.
- Required secret availability.

Error messages SHOULD identify the invalid configuration key but MUST NOT reveal secret values.

The process MUST fail before readiness if a required setting is invalid.

A deployment MUST NOT rely on a runtime request to discover that a mandatory configuration value is missing.

## 20. Logging conventions

The backend MUST use structured logging.

Log records SHOULD include:

- Timestamp.
- Severity.
- Service name.
- Environment.
- Request or correlation ID where applicable.
- Module or component.
- Operation name.
- Stable error code when applicable.

Logs MUST NOT contain access tokens, passwords, private keys, or unredacted secret configuration.

Sensitive request and event payloads MUST be redacted or omitted according to the applicable data policy.

A log message MUST NOT be the only record of a durable business transition.

Business state and required audit records MUST be persisted through the appropriate application workflow.

## 21. Log severity

The implementation SHOULD use severity levels consistently.

| Level | Intended use |
|---|---|
| DEBUG | Detailed diagnostics disabled by default in production |
| INFO | Normal lifecycle events and meaningful operational milestones |
| WARN | Recoverable problems or unexpected but handled conditions |
| ERROR | Failed operations requiring investigation or recovery |
| CRITICAL or FATAL | Process-level failure when supported by the logging framework |

Expected client errors SHOULD NOT automatically produce high-severity server logs.

Repeated transient failures SHOULD be rate-limited or aggregated to prevent log flooding.

Logs MUST avoid recording a full sensitive payload merely to improve debugging.

## 22. Error model inside the backend

Internal errors MUST preserve the distinction between failure categories.

The implementation SHOULD define typed error categories for:

- Input validation.
- Authorization.
- Missing resources.
- Invalid state transitions.
- Concurrency conflicts.
- Idempotency conflicts.
- Persistence failures.
- External dependency failures.
- Timeout and cancellation.
- Unexpected internal failures.

Error types MUST NOT be coupled to HTTP status classes.

Transport adapters MUST map internal errors to the canonical public contract.

Workers and event consumers MUST map the same internal errors to their own documented retry or failure policies.

A raw infrastructure exception MUST NOT cross a public API boundary.

## 23. Exception handling rules

Exceptions MUST be caught at boundaries where the implementation can take meaningful action.

A component MUST NOT catch an exception and silently continue as if the operation succeeded.

When an exception is translated, the original cause SHOULD be preserved for internal diagnostics.

Public error messages MUST NOT contain stack traces or internal resource details.

Cleanup logic MUST run when an operation fails.

Broad exception handlers MUST rethrow, classify, or report failures rather than discard them.

The implementation MUST distinguish cancellation from an ordinary unexpected failure.

## 24. Retry policy

Retries MUST be limited to operations known to be safe to retry.

Retry policies MUST define:

- Retryable error categories.
- Maximum attempts or elapsed time.
- Backoff strategy.
- Timeout behavior.
- Cancellation behavior.
- Idempotency requirements.

Exponential backoff with jitter SHOULD be used for transient distributed-system failures.

Non-idempotent operations MUST NOT be retried unless a deduplication or idempotency mechanism protects the side effect.

Validation failures and authorization failures MUST NOT be retried automatically.

Retries MUST be observable through metrics and structured logs.

## 25. Database integration

Database connectivity MUST be owned by infrastructure code.

The application layer MUST use repository interfaces or another explicitly approved persistence port.

Database sessions and transactions MUST have bounded lifetimes.

Connection pools MUST have explicit limits.

Database migrations MUST be versioned and reproducible.

Application startup MUST NOT silently apply destructive schema changes in production unless the deployment process explicitly authorizes them.

Repository implementations MUST enforce tenant filters and other access constraints required by the owning module.

Database schema ownership MUST follow the system architecture and the relevant database milestone dossiers.

## 26. Transaction management

Transactions MUST be initiated at a boundary that understands the complete consistency requirement.

A transaction SHOULD cover one coherent application use case.

Nested transaction behavior MUST be explicit.

The implementation MUST NOT assume that two repository calls are atomic merely because they occur in the same service method.

External service calls MUST NOT be assumed to participate in a database transaction.

Operations spanning multiple independent systems MUST document the recovery strategy.

Transaction failures MUST be surfaced to the caller or worker as a failure.

A transaction MUST NOT be reported successful before the database confirms commitment.

## 27. Migration workflow

Database migrations MUST be ordered and uniquely identified.

Each migration MUST be reviewed for:

- Data preservation.
- Locking behavior.
- Execution time.
- Rollback or forward-recovery strategy.
- Compatibility with the application version being deployed.
- Impact on concurrent reads and writes.

Production schema changes SHOULD follow an expand-and-contract strategy when multiple application versions may overlap.

Destructive migrations MUST require explicit review.

Migration tooling MUST report the applied schema version.

A deployment MUST NOT silently ignore a failed migration.

## 28. Background worker architecture

Background workers MUST be implemented as explicit runtime components.

A worker SHOULD separate:

- Message or schedule acquisition.
- Input validation.
- Application-service invocation.
- Retry classification.
- Acknowledgement or completion.
- Logging and metrics.
- Graceful shutdown.

Worker code MUST NOT duplicate domain logic already implemented by application services.

Each job MUST have a stable identity when the workflow requires deduplication.

Workers MUST use bounded concurrency and bounded resource consumption.

The worker MUST NOT acknowledge durable work before the required outcome has been safely recorded.

## 29. Worker retries and dead-letter handling

Workers MUST distinguish retryable failures from permanent failures.

Retryable failures SHOULD use bounded exponential backoff with jitter.

Permanent failures MUST be recorded and surfaced according to the operational policy.

A dead-letter mechanism SHOULD be provided when the underlying queue supports it and the workload requires it.

Dead-letter records MUST retain enough metadata for diagnosis without unnecessarily retaining sensitive payloads.

Reprocessing a dead-letter record MUST follow the original idempotency and authorization rules.

A worker MUST NOT retry a permanently invalid message indefinitely.

## 30. Worker lifecycle

Workers MUST support controlled startup and shutdown.

On shutdown, a worker SHOULD stop accepting new work before draining active operations.

The shutdown grace period MUST be bounded.

If work cannot finish within the grace period, the worker MUST leave it in a recoverable state or use the queue's documented visibility and acknowledgement behavior.

Worker readiness MUST reflect whether it can accept its assigned work.

Worker liveness MUST not fail merely because one recoverable job failed.

Long-running operations MUST expose progress or heartbeat information when needed to detect stalled execution.

## 31. Event integration seams

Event schema and delivery semantics are owned by `docs/protocol/EVENT_CONTRACT.md`.

The backend implementation MUST use an event publisher or consumer adapter that preserves the canonical contract.

Business modules MUST NOT depend directly on a particular broker client when an application-owned event interface is appropriate.

Event publication that must survive process failure SHOULD use a durable outbox or equivalent mechanism.

Event consumers MUST be designed for duplicate delivery where the contract permits at-least-once delivery.

Event handling MUST distinguish a delivery attempt from a unique logical event.

This document defines the implementation seam only; it does not redefine event payloads, event ordering, or replay guarantees.

## 32. Realtime integration seams

WebSocket transport behavior is owned by `docs/protocol/WEBSOCKET_CONTRACT.md`.

API gateway implementation details are owned by `docs/backend/architecture/API_IMPLEMENTATION.md`.

General backend code SHOULD interact with realtime delivery through a defined adapter or application port.

Business services MUST NOT write directly to a socket from domain logic.

The realtime adapter MUST preserve canonical event identity and payload semantics.

Connection state MUST have an explicit owner and bounded lifecycle.

Realtime integration tests MUST be able to substitute a deterministic test adapter.

## 33. External dependency integration

External services MUST be accessed through isolated adapters.

Each adapter MUST define:

- Required configuration.
- Connection and request timeouts.
- Retry policy.
- Error translation.
- Resource cleanup.
- Observability.
- Test substitution strategy.

External SDK types SHOULD NOT leak into domain models.

The implementation MUST handle dependency unavailability explicitly.

A successful local request MUST NOT be inferred from an external service timeout.

Circuit breakers MAY be used when they improve resilience and have a well-defined recovery policy.

## 34. Time and identifier abstractions

Business logic SHOULD use a clock abstraction when time affects decisions or tests.

Code MUST NOT rely on uncontrolled wall-clock calls when deterministic time is necessary for correctness.

Timestamps MUST use the formats defined by the applicable protocol contracts at public boundaries.

Identifier creation SHOULD be centralized where consistency, testability, or uniqueness requirements justify it.

Tests SHOULD be able to inject deterministic clocks and identifiers.

Identifiers MUST NOT be treated as authorization credentials.

## 35. Resource lifecycle and cleanup

Every long-lived client, database pool, worker, listener, and background task MUST have a clear owner.

The owner MUST define initialization and shutdown behavior.

Resources MUST be closed or released on startup failure where possible.

Temporary resources MUST be cleaned up on success, failure, and cancellation.

The application MUST avoid starting duplicate background tasks through repeated initialization.

Shared clients MUST be safe for their intended concurrency model.

Resource lifecycle behavior SHOULD be covered by integration tests.

## 36. Build and local development

The backend MUST provide a documented local development workflow.

The workflow SHOULD support:

- Installing pinned dependencies.
- Loading non-secret development configuration.
- Starting required local dependencies.
- Applying database migrations.
- Running the API process.
- Running background workers.
- Running unit and integration tests.
- Generating or validating OpenAPI output.
- Formatting and linting.
- Building a deployable artifact.

Commands SHOULD be exposed through a Makefile, task runner, or equivalent stable interface.

A developer MUST NOT need production credentials to run unit tests.

Local development defaults MUST NOT weaken production security configuration.

## 37. Recommended development commands

The repository SHOULD provide equivalent commands for the following operations:

    make setup
    make lint
    make test
    make test-unit
    make test-integration
    make migrate
    make run-api
    make run-worker
    make openapi
    make build

The exact commands MAY differ by language and repository tooling.

Each command MUST have documented behavior and failure exit codes.

Commands that change database state MUST identify the target environment explicitly.

A local convenience command MUST NOT silently target production infrastructure.

## 38. Startup and runtime modes

The backend MAY provide separate runtime modes for the API, workers, scheduled jobs, and administrative tasks.

Each mode MUST construct only the components required for its purpose.

The API process MUST NOT start a duplicate worker fleet unless that is an explicit deployment decision.

Worker processes MUST NOT register public HTTP routes unless their runtime mode requires them.

All runtime modes MUST share the same validated configuration model and application-service implementations where appropriate.

The startup mode MUST be explicit and observable.

## 39. Shutdown and cancellation

The backend MUST support graceful shutdown.

Shutdown handling MUST stop new work from entering components that are closing.

Active requests and jobs SHOULD be allowed to finish within a bounded grace period.

Cancellation MUST propagate to downstream operations where supported.

A cancelled operation MUST NOT be reported as successful unless its outcome was already committed and is correctly represented.

Cleanup MUST be idempotent so that repeated shutdown signals do not corrupt state.

Forced termination MUST leave durable work recoverable according to the persistence or queue contract.

## 40. Test architecture

Tests MUST be organized so that business behavior can be validated independently of production infrastructure.

The implementation SHOULD provide:

- Unit tests for domain and application logic.
- Integration tests for infrastructure adapters.
- API tests for HTTP routing and serialization.
- Contract tests against normative protocol documents.
- Architecture tests for dependency boundaries.
- Worker tests for retry and acknowledgement behavior.
- Realtime adapter tests for delivery and authorization seams.
- Migration tests for schema compatibility.

Test naming SHOULD identify the behavior being verified.

Tests MUST NOT depend on execution order unless that dependency is explicitly part of the test.

## 41. Test doubles and fixtures

Test doubles MUST implement the same interface as the dependency they replace.

Fakes SHOULD be used when they can preserve meaningful behavior.

Mocks SHOULD be used for interaction verification when the interaction itself is part of the requirement.

Fixtures MUST be deterministic and isolated between tests.

Tests MUST NOT rely on production user accounts, real credits, or production artifact storage.

Test data containing secrets or personal information MUST be synthetic or appropriately protected.

The implementation SHOULD provide reusable fixtures for tenant context, authenticated principals, domain entities, and clock control.

## 42. Architecture tests

Architecture tests SHOULD enforce the dependency rules in this document.

They SHOULD detect:

- Domain imports from transport frameworks.
- Application imports from concrete infrastructure adapters.
- Circular module dependencies.
- Unauthorized direct cross-module persistence access.
- Import-time construction of production clients.
- Accidental use of global mutable state.
- Unapproved dependencies between module packages.

An architecture-test failure MUST be reviewed rather than bypassed by broad exclusions.

Any intentional exception MUST be documented with an owner and a reason.

## 43. Integration test environments

Integration tests SHOULD use disposable databases, local containers, or controlled test services.

The test environment MUST be isolated from production.

External-service tests SHOULD use deterministic simulators or controlled test credentials.

Integration tests MUST clean up resources they create.

The test suite SHOULD verify migration application from an empty schema and, where relevant, upgrade from the supported previous schema.

Tests MUST have bounded timeouts and clear failure diagnostics.

## 44. Code quality gates

Backend changes MUST pass the repository's required code quality gates.

The gates SHOULD include:

1. Formatting.
2. Linting.
3. Static analysis.
4. Type checking where supported.
5. Unit tests.
6. Integration tests for affected boundaries.
7. Architecture tests.
8. API and protocol contract tests where applicable.
9. Dependency and security checks.
10. Build validation.

A change MUST NOT disable a failing gate solely to obtain a passing pipeline.

New warnings SHOULD be resolved or explicitly reviewed.

## 45. Dependency management

Production dependencies MUST be declared explicitly and pinned through the repository's supported lock mechanism where applicable.

Unnecessary dependencies SHOULD be avoided.

A new dependency MUST have a clear purpose and acceptable maintenance and security posture.

Transitive dependency changes MUST be reviewed when they affect security, runtime behavior, or reproducibility.

Development-only dependencies MUST be separated from production dependencies where the ecosystem supports it.

The build MUST fail clearly when a required dependency is unavailable or incompatible.

## 46. Module extension workflow

A developer extending a backend module MUST follow this sequence:

1. Read the authoritative Control Plane system architecture.
2. Identify the owning module and its permitted responsibility.
3. Read the applicable phase and milestone dossiers.
4. Identify existing application interfaces and repository ports.
5. Define the required use case and its invariants.
6. Add or extend domain behavior where required.
7. Add or extend application orchestration.
8. Add infrastructure adapters only where needed.
9. Wire the implementation through the composition root.
10. Add configuration through the validated settings model.
11. Add tests at the appropriate layers.
12. Update observability for meaningful new operations.
13. Validate applicable API, event, and transport contracts.
14. Run the required quality gates.
15. Update documentation and change records.

A developer MUST NOT begin by adding direct database access to a controller or worker as a shortcut.

## 47. Adding a new module

A new system module MUST first be justified against `docs/architecture/BACKEND_ARCHITECTURE.md`.

This implementation document does not authorize new system-level module ownership.

Before implementation, the change MUST identify:

- The existing architecture decision that assigns ownership, or the required decision to amend it.
- The module's public internal interfaces.
- Its dependencies on other modules.
- Its persistence and external-system needs.
- Its runtime entry points.
- Its configuration.
- Its tests and operational metrics.
- Its phase and milestone traceability.

A module MUST NOT be introduced solely to wrap a single function when a smaller package is sufficient.

## 48. Extending an existing module

An extension MUST preserve the existing module's ownership boundary.

New functionality SHOULD be added through the existing application and domain interfaces where appropriate.

Cross-module requests MUST use approved interfaces rather than reach into another module's internal package.

A new repository method MUST be justified by an application use case.

A new configuration option MUST have a documented default, validation rule, and operational meaning.

An extension MUST include tests for new behavior and for any existing behavior whose assumptions changed.

## 49. Cross-module interaction

Cross-module interaction MUST follow the interfaces and ownership rules in `docs/architecture/BACKEND_ARCHITECTURE.md`.

A module MUST NOT mutate another module's private domain state directly.

Where synchronous interaction is required, the owning module SHOULD expose a narrow application interface.

Where asynchronous interaction is required, the implementation MUST use the approved event or messaging boundary.

Cross-module workflows MUST document failure handling and consistency expectations.

A module MUST NOT bypass authorization by calling an internal interface with unvalidated user-controlled identifiers.

## 50. Persistence ownership

Persistence implementation MUST follow the ownership decisions in the system architecture and the applicable database milestone dossiers.

A module MUST access its assigned data through its repository interfaces.

Direct access to another module's private tables MUST NOT be introduced without an explicit architecture decision.

Shared database infrastructure MAY be reused, but shared infrastructure does not imply shared ownership of business records.

Database migrations MUST be attributable to the module or schema owner responsible for the affected data.

Cross-module read models MAY be introduced when their ownership, freshness, and update mechanism are documented.

## 51. Security implementation practices

The backend MUST follow the security requirements defined by the authoritative architecture and protocol documents.

Implementation code MUST validate authorization at the applicable boundary.

Tenant context MUST be propagated explicitly.

Secrets MUST be redacted from logs and errors.

Input parsing MUST use bounded resource limits.

External calls MUST use secure transport where supported and required.

Administrative actions MUST be auditable.

Security checks MUST be covered by tests that verify denied operations have no unintended side effects.

## 52. Performance and scalability

The implementation SHOULD avoid blocking operations on asynchronous event loops or request threads where they would cause material contention.

Database access MUST use bounded connection pools.

Network calls MUST have explicit timeouts.

Large data collections MUST use the pagination and streaming behavior required by their authoritative contracts.

Background processing MUST use bounded concurrency.

Realtime delivery MUST use bounded queues and backpressure.

Performance optimizations MUST preserve authorization, consistency, and idempotency guarantees.

The implementation SHOULD measure before introducing caching or complex concurrency mechanisms.

## 53. Health checks and readiness

Runtime health and readiness MUST be implemented consistently across deployed process types.

Liveness SHOULD indicate whether the process can continue operating.

Readiness SHOULD indicate whether the process can safely accept its assigned work.

Required dependency failures MUST prevent readiness when accepting work would be unsafe or consistently unsuccessful.

Optional dependency failures MAY produce a degraded state if the affected capabilities are explicitly isolated.

Health endpoints MUST NOT reveal credentials, internal secrets, or sensitive infrastructure details.

## 54. Operational diagnostics

The backend SHOULD provide diagnostic information suitable for incident investigation.

Diagnostics SHOULD include process version, build identifier, startup status, dependency health summaries, and worker state where appropriate.

Diagnostics MUST NOT expose secret configuration.

Detailed dependency information SHOULD be restricted to authorized operators.

The implementation SHOULD expose metrics for request latency, failure rate, worker queue depth, retry count, database pool usage, and external dependency health.

Operational alerts SHOULD use stable metrics and thresholds rather than parsing free-form log text.

## 55. Phase and milestone traceability

Canonical phase definitions are maintained in `planning/PHASES.md`.

Existing milestone dossiers under `docs/**/milestones/` are authoritative for milestone scope.

This table describes implementation relevance only. It MUST NOT be used to redefine the system-level responsibilities of the Control Plane.

| Phase | Implementation relevance |
|---|---|
| P0 FOUNDATION | Establish repository conventions, configuration, composition, and test seams |
| P1 STUDIO | Apply module and runtime conventions to the capabilities in scope |
| P2 BUILD & ARTIFACT | Apply artifact-related module structure and infrastructure-adapter rules |
| P3 CONTROL PLANE | Apply dependency boundaries, persistence interfaces, and composition rules |
| P4 BOOKING & COMMERCIAL | Apply transaction, idempotency, and worker reliability practices |
| P5 EXECUTION | Apply asynchronous worker, recovery, and resource lifecycle practices |
| P6 LAB & ROBOT | Apply Lab Agent adapters and operational integration seams |
| P7 LIVE & RESULTS | Apply event and realtime adapters, observability, and test seams |
| P8 PRODUCTION | Apply operational hardening, deployment validation, and recovery controls |

### 55.1 Frontend milestone traceability

| Milestone | Implementation relationship |
|---|---|
| F-M01 STUDIO FOUNDATION | Provide consistent runtime and configuration foundations for required API capabilities |
| F-M02 PROJECTS | Preserve module boundaries for project-facing backend capabilities |
| F-M03 BUILD & ARTIFACT | Provide maintainable artifact integration seams |
| F-M04 BOOKING | Apply transaction and idempotency implementation conventions |
| F-M05 EXECUTION | Provide background processing and execution integration seams |
| F-M06 LIVE | Provide realtime integration seams and observability |
| F-M07 RESULTS | Provide stable result retrieval and serialization support through the API implementation |

### 55.2 Backend milestone traceability

| Milestone | Implementation relationship |
|---|---|
| B-M01 CONTROL PLANE | Establish implementation layering, dependency injection, and module wiring |
| B-M02 ARTIFACT | Implement artifact-related adapters and validation integration |
| B-M03 PLATFORM | Apply module structure and external integration conventions |
| B-M04 BOOKING | Enforce transaction, idempotency, and persistence implementation practices |
| B-M05 EXECUTION | Implement reliable worker lifecycle and recovery |
| B-M06 RESULTS | Integrate lab, telemetry, event, and result adapters within assigned ownership |
| B-M07 PRODUCTION | Complete runtime hardening, observability, security, and build validation |

### 55.3 Database milestone traceability

| Milestone | Implementation relationship |
|---|---|
| DB-M01 FOUNDATION | Establish repository interfaces, transaction integration, and migration conventions |
| DB-M02 CORE DATA | Apply persistence implementation boundaries to core data |
| DB-M03 BOOKING DATA | Preserve booking and credit invariants through transaction-safe adapters |
| DB-M04 EXECUTION DATA | Support execution, result, and event-related persistence within assigned ownership |

### 55.4 Cloud milestone traceability

| Milestone | Implementation relationship |
|---|---|
| C-M01 FOUNDATION | Establish runtime configuration, secret handling, and process composition |
| C-M02 DEVELOPMENT | Provide reproducible local development and automated build workflows |
| C-M03 STAGING | Validate integrated module wiring, workers, persistence, and external adapters |
| C-M04 PRODUCTION | Apply production startup, shutdown, health, observability, and recovery controls |

## 56. Implementation acceptance checklist

### 56.1 Ownership and structure

- [ ] System/module ownership follows `docs/architecture/BACKEND_ARCHITECTURE.md`.
- [ ] This document is limited to backend implementation architecture.
- [ ] API implementation follows `docs/backend/architecture/API_IMPLEMENTATION.md`.
- [ ] Public REST behavior follows `docs/protocol/API_CONTRACT.md`.
- [ ] Event behavior follows `docs/protocol/EVENT_CONTRACT.md`.
- [ ] WebSocket behavior follows `docs/protocol/WEBSOCKET_CONTRACT.md`.
- [ ] Lab Agent behavior follows `docs/protocol/LAB_PROTOCOL.md`.
- [ ] Artifact manifest behavior follows `docs/protocol/ARTIFACT_MANIFEST.md`.
- [ ] Package boundaries are explicit.
- [ ] Domain and application code are independent of infrastructure implementations.
- [ ] Cross-module dependencies follow approved interfaces.

### 56.2 Wiring and configuration

- [ ] The composition root is explicit and testable.
- [ ] Required dependencies are injected rather than retrieved from global mutable state.
- [ ] Module registration is deterministic.
- [ ] Configuration is typed and validated.
- [ ] Production secrets are managed outside source control.
- [ ] Invalid required configuration prevents readiness.
- [ ] Runtime modes instantiate only their required components.
- [ ] Startup and shutdown behavior is bounded and observable.

### 56.3 Logging and errors

- [ ] Logging is structured.
- [ ] Sensitive values are redacted.
- [ ] Error categories are stable and typed.
- [ ] Exceptions are not silently discarded.
- [ ] Public errors are handled by the API implementation boundary.
- [ ] Worker failures follow explicit retry and recovery policies.
- [ ] Correlation metadata is propagated where appropriate.
- [ ] Operational metrics avoid unbounded labels.

### 56.4 Persistence and workers

- [ ] Repository interfaces have explicit owners.
- [ ] Database adapters remain in infrastructure code.
- [ ] Transaction boundaries protect required invariants.
- [ ] Migrations are versioned and reviewed.
- [ ] Workers have bounded concurrency and shutdown behavior.
- [ ] Retry policies distinguish transient and permanent failures.
- [ ] Durable work is acknowledged only after the required outcome is recorded.
- [ ] Event integration preserves canonical event identity and payloads.

### 56.5 Testing and build

- [ ] Unit tests cover domain and application behavior.
- [ ] Integration tests cover infrastructure adapters.
- [ ] Architecture tests enforce dependency rules.
- [ ] Contract tests validate relevant API and protocol boundaries.
- [ ] Test doubles can replace external dependencies.
- [ ] Build and development commands are documented.
- [ ] Dependency versions are reproducible.
- [ ] Required quality gates pass.
- [ ] Operational behavior is tested for critical failure paths.

## 57. Change control

Implementation changes MUST be reviewed against the ownership boundary defined in Section 2.

Changes to system/module responsibilities MUST be handled in `docs/architecture/BACKEND_ARCHITECTURE.md`.

Changes to backend package layout, dependency injection, runtime composition, configuration, worker lifecycle, or testing conventions MAY be documented here.

Changes to HTTP controller, DTO, middleware, OpenAPI, or realtime gateway implementation MUST be reviewed against `docs/backend/architecture/API_IMPLEMENTATION.md`.

Changes to public endpoint behavior MUST be reviewed against `docs/protocol/API_CONTRACT.md`.

Changes to event payloads or delivery semantics MUST be reviewed against `docs/protocol/EVENT_CONTRACT.md`.

Changes to WebSocket transport MUST be reviewed against `docs/protocol/WEBSOCKET_CONTRACT.md`.

Changes to Lab Agent messaging MUST be reviewed against `docs/protocol/LAB_PROTOCOL.md`.

Changes to artifact manifest representation MUST be reviewed against `docs/protocol/ARTIFACT_MANIFEST.md`.

A code change MUST NOT resolve an ownership conflict by introducing a private implementation path that bypasses the authoritative document.

## 58. Final implementation statement

This document defines how the Kritva RaaS backend is organized, wired, configured, tested, built, run, and extended.

It owns repository and package conventions, implementation layering, dependency injection, module wiring, configuration, logging, internal error handling, background workers, testing seams, development workflows, and implementation extension rules.

It does not own the system/module ownership architecture of the Control Plane, product API architecture, public REST wire contract, event schema, WebSocket transport contract, Lab Agent protocol, or artifact manifest.

Implementations MUST follow the authoritative system and protocol documents for those concerns.

The intended result is a backend codebase whose implementation structure is explicit, testable, observable, secure, and extensible without creating overlapping ownership or competing sources of truth.
