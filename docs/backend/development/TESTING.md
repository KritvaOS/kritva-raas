# Backend Testing

**Project:** Kritva RaaS  
**Document:** `docs/backend/development/TESTING.md`  
**Scope:** Backend-specific unit, integration, and contract testing; database and queue validation; simulated lab agent testing; load and security tests; and backend test fixtures  
**Audience:** Backend developers, database developers, service engineers, integration engineers, and test engineers  
**Status:** Backend testing guide

## 1. Purpose

This document defines how to test the Kritva RaaS backend implementation and its dependencies.

It covers only backend-specific testing:

- Unit tests for backend logic and modules.
- Service and application-layer integration tests.
- API and protocol contract tests.
- PostgreSQL integration and migration tests.
- Object storage integration tests.
- Queue and asynchronous processing tests.
- Simulated lab agent testing.
- Backend-to-simulator integration.
- Load and performance tests for backend services.
- Backend security tests.
- Test fixtures, synthetic data, and isolated test environments.
- Backend-specific failure diagnosis and validation evidence.

This document complements the global testing strategy. It does not redefine repository-wide testing policy, global quality gates, CI enforcement, release acceptance, or the overall testing philosophy.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns backend-specific testing practices and implementation guidance:

- Test organization for backend modules and services.
- Unit tests for backend business and application logic.
- Integration tests for backend service dependencies.
- API contract conformance tests.
- Event and artifact contract validation from the backend perspective.
- Database integration and migration validation performed with backend code.
- Object storage adapter tests.
- Queue, consumer, and asynchronous processing tests.
- Simulated lab agent integration tests.
- Backend load and performance testing.
- Backend-specific security testing.
- Test fixtures, synthetic records, and dependency isolation.
- Backend test execution, diagnostics, and evidence.

### 2.2 Global Testing Strategy Ownership

`docs/development/TESTING_STRATEGY.md` is the authoritative document for global testing strategy and policy.

It owns:

- Organization-wide testing principles.
- The overall test-level taxonomy.
- Global quality gates and mandatory checks.
- Repository-wide CI testing requirements.
- Cross-domain system testing policy.
- General test reporting and evidence expectations.
- Global coverage policy where defined.
- Release-blocking test requirements.
- General failure triage and escalation policy.
- Organization-wide testing ownership.

This document MUST link to the global strategy rather than duplicate it.

Backend-specific recommendations in this file MUST remain consistent with any stricter global requirement.

### 2.3 Other Document Ownership

| Concern | Authoritative document |
|---|---|
| Global testing strategy and policy | `docs/development/TESTING_STRATEGY.md` |
| Global development workflow and CI | Applicable documents under `docs/development/` |
| Global development setup | `docs/development/DEVELOPMENT_SETUP.md` |
| Global release process | `docs/development/RELEASE_PROCESS.md` |
| Backend-specific setup | `docs/backend/development/DEVELOPMENT_SETUP.md` |
| Backend-specific development workflow | `docs/backend/development/DEVELOPMENT_WORKFLOW.md` |
| Backend testing implementation | `docs/backend/development/TESTING.md` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| Backend architecture decisions | `docs/backend/planning/DECISIONS.md` |
| System backend responsibilities | `docs/architecture/BACKEND_ARCHITECTURE.md` |
| Product and system decisions | `docs/planning/DECISIONS.md` |
| Canonical phase definitions | `docs/planning/PHASES.md` |
| API wire contract | `docs/protocol/API_CONTRACT.md` |
| Event wire contract | `docs/protocol/EVENT_CONTRACT.md` |
| Artifact contract and manifest | `docs/protocol/ARTIFACT_MANIFEST.md` |
| Database implementation architecture | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Database-specific decisions | `docs/database/planning/DECISIONS.md` |
| Cloud deployment implementation | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Cloud infrastructure security | `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` |
| Application security and trust boundaries | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Backend milestone scope and acceptance | Authoritative dossiers under `docs/backend/milestones/` |
| Database milestone scope and acceptance | Authoritative dossiers under `docs/database/milestones/` |
| Cloud milestone scope and acceptance | Authoritative dossiers under `docs/cloud/milestones/` |
| Cross-domain milestone scope | Applicable authoritative dossiers under `docs/**/milestones/` |

### 2.4 Explicit Non-Goals

This document MUST NOT become the authoritative home for:

- Global testing strategy or repository-wide CI policy.
- Frontend unit, component, browser, or visual testing procedures.
- Database architecture or complete database operations policy.
- Cloud infrastructure testing architecture.
- Product requirements or protocol contract definitions.
- Complete application security policy.
- Global release authorization.
- Milestone acceptance criteria.
- Task tracking or release checklists.

When a concern belongs elsewhere, this document MUST link to its authoritative owner.

## 3. Backend Testing Principles

### 3.1 Test the Contract and Behavior

Tests SHOULD verify observable behavior and defined module contracts.

Unit tests SHOULD focus on backend logic in isolation.

Integration tests SHOULD verify interactions across real dependencies when those interactions are the purpose of the test.

Contract tests MUST compare backend behavior with the authoritative protocol definition rather than a backend-only assumption.

### 3.2 Use the Appropriate Test Boundary

Choose the narrowest test that gives meaningful confidence.

Examples:

- Unit tests for deterministic business logic.
- Service tests for application orchestration.
- Contract tests for API and event conformance.
- Database integration tests for persistence behavior.
- Queue integration tests for asynchronous processing.
- Simulator integration tests for lab-facing interactions.
- Load tests for throughput, latency, and resource behavior.
- Security tests for backend trust boundaries and failure handling.

Do not treat one test category as a substitute for another when they validate different risks.

### 3.3 Keep Tests Deterministic

Tests SHOULD avoid uncontrolled dependencies on:

- Production services.
- Real customer data.
- Uncontrolled wall-clock timing.
- Random data without a fixed seed.
- Shared mutable test records.
- Unmanaged external network resources.
- Implicit test execution order.

Where a dependency is necessary, use a dedicated test environment and explicit readiness checks.

### 3.4 Isolate Test Data

Tests MUST use dedicated test databases, namespaces, buckets, queues, or equivalent resources when interacting with persistent services.

Destructive tests MUST NOT run against production resources.

Parallel tests SHOULD NOT modify the same records unless concurrency is the intended behavior being tested.

### 3.5 Distinguish Mocks from Integration

A passing mock-based test proves behavior only within the configured mock boundary.

It does not prove that a real database, queue, simulator, or external service behaves identically.

Test reports MUST identify whether the test used a mock, an emulator, a simulator, or a real dependency.

### 3.6 Test Failure Paths

Backend tests SHOULD cover meaningful failures, including invalid inputs, dependency unavailability, rejected operations, and persistence errors where relevant.

Tests MUST NOT assert only that an operation returned without throwing if the required outcome is more specific.

### 3.7 Avoid False Confidence from Coverage

Coverage is a diagnostic measure, not proof of correctness.

Prioritize assertions that verify behavior, state transitions, contract conformance, and important failure paths.

Follow global coverage and quality-gate policy in `docs/development/TESTING_STRATEGY.md`.

## 4. Backend Test Architecture

### 4.1 Test Categories

| Category | Primary responsibility |
|---|---|
| Unit tests | Deterministic backend logic and isolated module behavior |
| Service tests | Application orchestration and module interaction |
| Contract tests | API, event, and artifact contract conformance |
| Database integration tests | Persistence behavior against a dedicated database |
| Migration tests | Schema transition and data migration behavior |
| Storage integration tests | Object storage adapter behavior |
| Queue integration tests | Message publication, consumption, and retry behavior |
| Simulated lab agent tests | Backend interactions with the lab simulation boundary |
| Load tests | Throughput, latency, concurrency, and resource behavior |
| Security tests | Backend input, authorization, data exposure, and dependency failure handling |

The repository's actual test tooling MUST be used. This table defines responsibilities rather than prescribing a particular framework.

### 4.2 Test Ownership

Each backend test SHOULD have an identifiable implementation owner.

A test may exercise a database or queue, but it MUST NOT silently take ownership of the corresponding infrastructure implementation.

Backend tests validate application behavior against the dependencies they exercise.

### 4.3 Test Organization

Follow the existing backend repository's test directory and naming conventions.

Tests SHOULD be organized so that contributors can identify:

- The module under test.
- The required dependencies.
- The test fixtures.
- The test command.
- The expected isolation boundary.

Do not introduce a second test hierarchy that duplicates an existing repository convention without a clear reason.

### 4.4 Shared Test Utilities

Shared test utilities SHOULD provide deterministic fixture creation, controlled dependency setup, and repeatable cleanup.

They MUST have a clear owner and purpose.

Domain-specific fixture assumptions SHOULD remain close to the owning module's tests.

### 4.5 Naming and Assertions

Test names SHOULD describe the behavior or condition being verified.

Assertions SHOULD be specific enough to detect a meaningful regression.

Avoid tests whose only assertion is that a function returned a non-null value when the contract requires a particular result, state change, or error.

## 5. Unit Testing

### 5.1 Scope

Unit tests SHOULD cover deterministic backend logic, including:

- Domain rules.
- Application-service decisions.
- Validation helpers.
- Data transformation.
- Request and response mapping.
- Error conversion.
- State transition logic.
- Retry and scheduling decisions where isolated testing is possible.
- Utility functions.

### 5.2 Isolation

A unit test SHOULD avoid requiring PostgreSQL, object storage, a queue, or the simulated lab agent unless that dependency is essential to the unit's defined behavior.

Use interfaces or controlled test doubles where supported by the backend architecture.

Do not introduce excessive mocking that makes the test validate only its own assumptions.

### 5.3 Input Coverage

Test representative normal, boundary, and invalid inputs.

For request validation, consider:

- Missing required fields.
- Invalid formats.
- Values outside supported limits.
- Unexpected enumerated values.
- Empty collections.
- Duplicate identifiers.
- Invalid state transitions.

Only test cases relevant to the module's contract and behavior need to be included.

### 5.4 Error Behavior

Unit tests SHOULD verify the intended error category and any relevant contextual information.

Internal exceptions MUST NOT be exposed as public API behavior unless the contract explicitly defines that behavior.

### 5.5 Time and Randomness

Use controlled clocks and deterministic random sources when time or randomness affects behavior.

Avoid tests that pass only because of the current wall-clock time or a particular random sequence.

### 5.6 Side Effects

Where a unit performs a logical decision that triggers an external side effect, test the decision independently from the actual integration when possible.

Verify the real side effect at an appropriate integration boundary.

## 6. Service and Module Integration Tests

### 6.1 Scope

Service integration tests verify interactions among backend components that form an application workflow.

They are appropriate when correctness depends on orchestration across multiple modules.

### 6.2 Module Boundaries

Tests SHOULD exercise public module interfaces where practical.

Avoid relying on private implementation details unless the test specifically validates an internal invariant.

A test MUST NOT bypass required validation or lifecycle behavior simply to simplify setup.

### 6.3 Dependency Injection

Where the backend architecture uses dependency injection, tests SHOULD configure dependencies explicitly.

Test configuration MUST NOT accidentally load production credentials or connect to production services.

### 6.4 State Transitions

Where application behavior changes state, tests SHOULD verify:

- Initial conditions.
- Accepted transitions.
- Rejected transitions.
- Resulting state.
- Relevant side effects.
- Failure behavior.

Do not assert only that a service method completed when the intended outcome includes a state change.

### 6.5 Transactional Behavior

When service behavior depends on transaction boundaries, validate the relevant persistence and failure behavior through database integration tests.

Unit tests alone cannot prove database transaction semantics.

Database transaction design and implementation remain owned by `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

### 6.6 Cross-Module Regression

When a shared module changes, identify the known consumers and add or update tests for affected public interfaces.

Avoid duplicating every internal test of a dependency in every consumer's test suite.

## 7. API Contract Testing

### 7.1 Contract Authority

`docs/protocol/API_CONTRACT.md` is the authoritative source for API wire behavior.

Backend implementation practices are defined in `docs/backend/architecture/API_IMPLEMENTATION.md`.

This section covers backend-specific validation against the authoritative API contract.

### 7.2 Contract Coverage

API contract tests SHOULD verify relevant:

- Endpoint and operation identity.
- Request structure.
- Required and optional fields.
- Validation behavior.
- Response structure.
- Status codes.
- Error response shape.
- Pagination or filtering behavior where applicable.
- Compatibility-sensitive defaults.
- Authorization-related outcomes where defined by the contract.

### 7.3 Request Validation

Test valid requests and representative invalid requests.

Verify that malformed input produces the documented error behavior.

Tests SHOULD confirm that invalid requests do not cause unintended state changes.

### 7.4 Response Conformance

Verify that response fields, types, and semantics match the contract.

Do not expose internal persistence models or implementation-only fields unintentionally.

Contract tests SHOULD detect accidental field removal, type changes, or altered error mapping.

### 7.5 Compatibility

When changing an existing API operation, assess compatibility with known consumers.

Tests SHOULD cover the compatibility behavior that matters to the change.

A change that is syntactically additive may still be behaviorally incompatible if defaults, validation, or response semantics change.

### 7.6 Error Responses

Verify relevant error categories and response shapes.

Do not assert unstable internal stack traces or implementation-specific messages as public behavior.

Error responses MUST NOT disclose secrets, SQL details, internal network topology, or sensitive diagnostic information.

### 7.7 API Test Fixtures

API fixtures MUST reflect the authoritative contract.

When the contract changes, update fixtures and tests as part of the same coordinated change.

A fixture MUST NOT be treated as the contract's source of truth.

### 7.8 Contract Change Handoff

Use `docs/backend/development/DEVELOPMENT_WORKFLOW.md` for the backend API change process.

The test hand-off SHOULD identify the contract revision, relevant tests, affected consumers, and any integration validation that remains outstanding.

## 8. Event and Artifact Contract Testing

### 8.1 Event Contract

`docs/protocol/EVENT_CONTRACT.md` is authoritative for event wire behavior.

Backend tests MUST verify that produced and consumed events conform to that contract.

### 8.2 Event Producer Tests

Producer tests SHOULD verify:

- Event identity.
- Required payload fields.
- Field types and semantics.
- Relevant metadata.
- Publication behavior.
- Failure handling where applicable.

A successful internal service call does not prove that the intended event was published.

### 8.3 Event Consumer Tests

Consumer tests SHOULD verify behavior for:

- Valid events.
- Invalid or incomplete payloads.
- Unsupported values or versions.
- Duplicate delivery where relevant.
- Dependency failures.
- Processing failures and retry behavior.

The expected behavior MUST follow the authoritative contract and backend implementation.

### 8.4 Event Ordering and Delivery

When application correctness depends on event ordering or delivery guarantees, validate those assumptions at the appropriate integration boundary.

Do not assume that an in-memory unit test proves broker delivery guarantees.

### 8.5 Artifact Contract

`docs/protocol/ARTIFACT_MANIFEST.md` is authoritative for artifact manifest behavior.

Backend tests that create or expose artifacts SHOULD verify relevant identifiers, metadata, integrity information, and expected error behavior.

### 8.6 Artifact Integrity

Where integrity metadata is part of the contract, tests SHOULD verify that it is generated, preserved, and validated correctly.

Do not treat a successful upload as proof that an artifact manifest is correct.

### 8.7 Cross-Domain Evidence

Event and artifact test reports SHOULD distinguish mocked publication from real broker or storage integration.

Do not claim full cross-domain validation when only an isolated contract test has run.

## 9. Database Integration Testing

### 9.1 Scope

Database integration tests verify backend persistence behavior against an isolated database environment.

They cover application-to-database interactions, not the complete database architecture.

### 9.2 Database Ownership

Database implementation architecture is owned by `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

Database-specific decisions are owned by `docs/database/planning/DECISIONS.md`.

This file defines the backend testing of database-dependent behavior.

### 9.3 Test Database Isolation

Use a dedicated test database or an explicitly isolated test environment.

Test setup MUST NOT connect to production databases.

Destructive tests MUST verify the target environment before executing cleanup or reset operations.

### 9.4 Schema Initialization

Database tests SHOULD initialize schema through the repository's documented migration mechanism.

Do not rely on a developer-specific schema created manually outside the migration workflow.

The test environment SHOULD be reproducible from the approved schema and migrations.

### 9.5 Repository and Persistence Tests

Test relevant persistence behavior, including:

- Insert and retrieval.
- Update behavior.
- Deletion or archival behavior.
- Query filters.
- Constraint enforcement.
- Handling of missing records.
- Mapping between database records and application types.

The selected cases MUST reflect the module's responsibility.

### 9.6 Transaction Behavior

Where transaction boundaries matter, test the intended outcome when an operation succeeds or fails.

Verify that partial operations do not leave inconsistent application state when atomicity is required.

Detailed transaction and isolation policy remains owned by the database architecture.

### 9.7 Migration Tests

Migration tests SHOULD verify that supported schema transitions produce the expected result.

Where relevant, test:

- Applying migrations to an empty database.
- Upgrading from a supported prior schema.
- Required backfills.
- Constraints after migration.
- Compatibility with backend code.
- Failure handling for invalid or incomplete input data.

The database owner remains responsible for the authoritative migration design.

### 9.8 Seed Data

Use deterministic synthetic seed data.

Tests MUST NOT depend on manually inserted developer records.

Seed operations SHOULD be repeatable or explicitly document why they cannot be repeated safely.

### 9.9 Cleanup

Tests SHOULD clean up the records and resources they create.

Where isolated database recreation is the intended cleanup method, use the documented test-environment procedure.

Do not drop or reset a shared database without explicit authorization.

### 9.10 Concurrency

When correctness depends on concurrent updates or transaction conflicts, use integration tests that exercise the actual database behavior.

Unit tests with mocked repositories are not sufficient evidence for database concurrency guarantees.

## 10. Object Storage Integration Testing

### 10.1 Scope

Storage integration tests validate backend adapters that interact with object storage.

Use the configured emulator or a dedicated test storage service.

### 10.2 Operations

Where supported by the backend implementation, test:

- Upload.
- Retrieval.
- Metadata handling.
- Missing objects.
- Invalid object references.
- Permission failures.
- Storage unavailability.
- Integrity verification.
- Cleanup.

Only include operations that exist in the authoritative implementation and contract.

### 10.3 Test Isolation

Use dedicated test buckets, containers, namespaces, or unique object prefixes.

Test data MUST NOT overlap with production data.

Parallel tests SHOULD use isolated names or another supported isolation mechanism.

### 10.4 Failure Behavior

Test relevant storage failures and verify that backend error mapping follows the expected application and API contracts.

Do not expose storage credentials, private endpoints, or provider-specific internal details through public responses.

### 10.5 Integrity and Metadata

Where artifacts depend on integrity metadata, verify the backend's behavior against `docs/protocol/ARTIFACT_MANIFEST.md`.

A storage integration test MUST NOT replace contract tests for artifact metadata.

## 11. Queue and Asynchronous Processing Tests

### 11.1 Scope

Queue tests validate backend behavior involving asynchronous publication, consumption, and processing.

The actual broker technology and configuration MUST follow the backend architecture.

### 11.2 Unit-Level Processing Tests

Test the message-processing logic independently when possible.

Use deterministic message fixtures and controlled dependency behavior.

Verify that processing outcomes match the defined application behavior.

### 11.3 Broker Integration Tests

Use an isolated test broker, queue, topic, or namespace.

Verify that the backend can perform the intended publish and consume operations.

A successful broker connection alone does not prove that messages are processed correctly.

### 11.4 Consumer Lifecycle

Where relevant, test consumer startup, shutdown, and recovery behavior.

Tests SHOULD verify that resources are released and that shutdown does not leave uncontrolled background work.

### 11.5 Retry Behavior

When retries are part of the implementation, verify:

- Which failures are retryable.
- Which failures are terminal.
- The configured retry limit or policy.
- The resulting processing outcome.
- Relevant observability or error reporting.

The expected policy MUST follow the backend architecture and approved contracts.

### 11.6 Duplicate Delivery

If the broker or processing design permits duplicate delivery, test the required duplicate-handling behavior.

Do not assume exactly-once processing without an explicit architectural guarantee.

### 11.7 Dead-Letter or Terminal Failure Handling

Where the implementation supports a dead-letter mechanism or terminal failure state, test the relevant behavior.

Verify that a permanently failing message does not cause an uncontrolled retry loop.

### 11.8 Test Cleanup

Tests MUST clean up test messages and temporary broker resources when required.

Cleanup SHOULD be safe when a test fails partway through execution.

### 11.9 Queue Failure Diagnosis

When a queue test fails, check the broker's readiness, resource configuration, consumer logs, and fixture state before changing the application logic.

Do not weaken the test merely because the broker is unavailable.

## 12. Simulated Lab Agent Testing

### 12.1 Purpose

A simulated lab agent allows backend workflows that depend on lab-facing interactions to be exercised without requiring a physical lab or robot.

The simulator MUST implement the supported interface expected by the backend test.

It MUST NOT be treated as proof of physical hardware behavior.

### 12.2 Ownership Boundary

This document owns backend tests that interact with the simulated lab agent.

The simulator implementation, hardware behavior, and lab architecture remain owned by their respective implementation and architecture documents.

The authoritative milestone dossiers determine whether simulator evidence is sufficient for a particular milestone.

### 12.3 Simulation Scope

A simulated lab agent MAY model:

- Agent registration or availability.
- Capability reporting.
- Request acceptance and rejection.
- Status transitions.
- Completion and failure.
- Timeout behavior.
- Disconnection.
- Delayed responses.
- Invalid payloads.

Only implement behaviors supported by the authoritative lab interface and backend requirements.

### 12.4 Deterministic Simulation

The simulator SHOULD provide deterministic scenarios that can be selected by a test.

Avoid uncontrolled timing and random failures in normal test runs.

Where random or fault-injection behavior is needed, use explicit seeds or scenario parameters.

### 12.5 Contract Alignment

Simulator messages and responses MUST match the authoritative interface or protocol contract.

Do not make the simulator more permissive than the real interface in ways that conceal backend defects.

### 12.6 Backend Integration Scenarios

Backend integration tests SHOULD cover relevant scenarios such as:

- Successful registration or discovery.
- Valid request acceptance.
- Rejected requests.
- Progress or status updates.
- Completion.
- Reported failure.
- Agent unavailability.
- Timeout or interrupted communication.
- Malformed responses.

The actual scenarios MUST match the implemented contract and milestone scope.

### 12.7 Simulation Versus Physical Validation

Test reports MUST identify when a scenario used the simulated lab agent.

Simulator tests validate software interactions under the modeled conditions.

They do not prove motor safety, physical timing, sensor fidelity, or real hardware behavior.

### 12.8 Failure Injection

Where supported, use explicit failure injection to test backend recovery behavior.

Examples include delayed replies, disconnects, malformed messages, or unavailable simulated services.

Failure injection MUST be repeatable and MUST NOT destabilize unrelated test runs.

### 12.9 Integration Evidence

The test hand-off SHOULD state:

- Simulator version or source revision.
- Scenario used.
- Backend configuration.
- Relevant test command.
- Actual result.
- Remaining real-environment validation.

Do not describe simulator-only results as physical lab validation.

## 13. Load and Performance Testing

### 13.1 Scope

Backend load testing evaluates service behavior under representative concurrency, request rates, and data volumes.

It is separate from unit and functional correctness testing.

### 13.2 Test Objectives

Before a load test, define the objective.

Examples include:

- Request throughput.
- Response latency.
- Error rate.
- Concurrent request handling.
- Queue processing rate.
- Resource utilization.
- Recovery after a traffic spike.

Do not run a load test without a clear measurement goal.

### 13.3 Environment

Use a dedicated test or approved staging environment.

Load tests MUST NOT target production unless explicitly authorized through the global release and operational policies.

Record relevant environment details so results can be interpreted.

### 13.4 Workload Definition

A workload SHOULD identify:

- Request or job mix.
- Concurrency.
- Arrival rate or request rate.
- Test duration.
- Data volume.
- Warm-up period where needed.
- Success and failure conditions.
- Relevant service dependencies.

The workload SHOULD resemble the behavior being evaluated rather than generate arbitrary traffic.

### 13.5 Baseline Measurements

Capture a baseline before comparing implementation changes.

Where applicable, record:

- Throughput.
- Median latency.
- Tail latency.
- Error rate.
- CPU and memory use.
- Database connection behavior.
- Queue depth and processing rate.

Use consistent measurement methods when comparing results.

### 13.6 Database Load

If the workload stresses PostgreSQL, monitor the relevant database behavior and connection pool.

Database tuning and production sizing remain owned by the database and cloud architecture documents.

Do not modify database production parameters based solely on a local benchmark.

### 13.7 Queue Load

For asynchronous workloads, measure enqueue rate, processing rate, backlog, and failure behavior where relevant.

A high enqueue rate alone does not prove that the system can process the workload sustainably.

### 13.8 Test Safety

Load tests MUST use controlled traffic and isolated test data.

Avoid unbounded loops or uncontrolled traffic generation.

Stop a test when it exceeds the approved environment's resource or safety limits.

### 13.9 Result Interpretation

A performance result SHOULD identify:

- Test environment.
- Source revision.
- Workload.
- Tool and configuration.
- Observed metrics.
- Errors and anomalies.
- Known limitations.

Do not claim a universal capacity limit from a single environment-specific run.

### 13.10 Performance Regression

When a regression is observed, compare the workload and environment with the baseline before attributing the change to the code.

Use profiling and service-specific diagnostics to identify the cause.

Do not weaken correctness checks to improve benchmark numbers.

## 14. Backend Security Testing

### 14.1 Scope

This section covers backend-specific security testing of application behavior and trust boundaries.

It does not replace the global security policy, security architecture, or dedicated security assessment procedures.

### 14.2 Security Ownership

Application security and trust boundaries are defined by `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/`.

Cloud infrastructure security is owned by `docs/cloud/architecture/SECURITY_ARCHITECTURE.md`.

This file describes backend test practices that validate the applicable security requirements.

### 14.3 Input Validation

Test malformed, unexpected, oversized, or invalid input where relevant.

Verify that invalid input is rejected without unintended state changes.

Tests SHOULD cover relevant boundary conditions rather than only the expected valid request.

### 14.4 Authentication and Authorization

Where backend operations require authentication or authorization, test the relevant allowed and denied outcomes.

Verify that authorization is enforced by the backend rather than relying solely on frontend presentation.

Tests SHOULD include attempts to access resources outside the authorized context when applicable.

### 14.5 Data Exposure

Verify that API responses and error messages do not expose secrets, private credentials, sensitive internal details, or unauthorized data.

Test the relevant response and logging behavior.

### 14.6 Injection and Query Safety

Test relevant input paths for unsafe query construction or command interpretation.

Use the backend's approved data-access and execution abstractions.

Do not rely on frontend validation as the security boundary.

### 14.7 Dependency Failure

Where security depends on an external service or credential provider, test relevant failure behavior.

The backend SHOULD fail safely when required authorization or trust checks cannot be completed.

Do not create permissive fallback behavior that bypasses a required security check.

### 14.8 Secrets and Test Configuration

Security tests MUST use test credentials and isolated resources.

Do not place production secrets in fixtures, logs, snapshots, or generated reports.

### 14.9 Security Test Limitations

A passing set of backend security tests does not establish that the entire application is secure.

Record the tested scope and any exclusions.

Follow the applicable global security assessment and release policy for additional requirements.

## 15. Fixtures and Synthetic Test Data

### 15.1 Fixture Principles

Fixtures SHOULD be small, deterministic, and focused on the behavior being tested.

Use fixture builders when they improve consistency and reduce duplicated setup.

Avoid copying large payloads when a smaller contract-valid example is sufficient.

### 15.2 Synthetic Records

Use synthetic test data.

Do not copy production records into tests unless an explicitly approved and appropriately protected process permits it.

Avoid real personal information and production identifiers.

### 15.3 Contract-Conformant Fixtures

Fixtures representing API requests, responses, events, or artifacts MUST follow the relevant authoritative contract.

A fixture MUST NOT silently introduce undocumented fields or semantics.

### 15.4 Fixture Isolation

Use unique identifiers or isolated namespaces when tests create persistent resources.

Parallel tests SHOULD NOT overwrite each other's data.

Cleanup MUST be reliable even when a test fails partway through.

### 15.5 Time-Dependent Fixtures

Use controlled timestamps when behavior depends on time.

Avoid tests whose expected result changes as real time advances.

### 15.6 Fixture Maintenance

When a contract or module interface changes, identify affected fixtures and update them accordingly.

Remove obsolete fixtures that no longer represent supported behavior.

Do not preserve outdated fixtures merely to keep old tests passing.

## 16. Test Execution and Diagnostics

### 16.1 Discover Repository Commands

Use the test commands declared by the backend repository.

Do not assume that every backend uses the same language, test framework, or package-manager script.

A repository may expose commands for unit tests, integration tests, contract tests, and load tests separately.

The actual commands MUST come from its manifests and documentation.

### 16.2 Required Dependencies

Before running integration tests, confirm that the required database, storage, queue, or simulator is available.

Use the backend setup guide at `docs/backend/development/DEVELOPMENT_SETUP.md`.

### 16.3 Test Isolation

Verify that the selected test environment is isolated from production resources.

Check configuration before running destructive integration tests.

### 16.4 Failure Classification

Classify failures before changing code or tests.

Possible categories include:

- Backend implementation defect.
- Contract mismatch.
- Incorrect fixture.
- Database or migration problem.
- Queue or storage dependency failure.
- Simulator configuration error.
- Test isolation defect.
- Timing or concurrency problem.
- Test environment failure.

### 16.5 Diagnostic Evidence

Capture relevant diagnostic information, such as:

- Failing test name.
- Assertion or exception.
- Service logs.
- Dependency health.
- Test environment.
- Fixture or scenario identifier.
- Source revision.

Review logs before sharing them to avoid exposing credentials or sensitive information.

### 16.6 Flaky Tests

Flaky tests MUST be investigated.

Check uncontrolled timing, shared mutable data, asynchronous cleanup, service readiness, and test ordering.

Do not repeatedly rerun a flaky test until it passes and treat that as proof of correctness.

### 16.7 Skipped and Blocked Tests

Distinguish tests that passed, failed, were skipped, were blocked, or were not run.

If a test requires an unavailable dependency, document the limitation.

Whether the missing evidence blocks a milestone or release is determined by the authoritative milestone dossier and global policy.

## 17. Relationship to Phases and Milestones

### 17.1 Phase Authority

`docs/planning/PHASES.md` is the canonical source for phase definitions.

This document defines backend testing practices only and MUST NOT redefine phase scope.

### 17.2 Canonical Phases

| Phase | Canonical name |
|---|---|
| P0 | FOUNDATION |
| P1 | STUDIO |
| P2 | BUILD & ARTIFACT |
| P3 | CONTROL PLANE |
| P4 | BOOKING & COMMERCIAL |
| P5 | EXECUTION |
| P6 | LAB & ROBOT |
| P7 | LIVE & RESULTS |
| P8 | PRODUCTION |

### 17.3 Backend Milestones

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| B-M01 | CONTROL PLANE | P3 |
| B-M02 | ARTIFACT | P2-P3 |
| B-M03 | PLATFORM | P3 |
| B-M04 | BOOKING | P4 |
| B-M05 | EXECUTION | P5 |
| B-M06 | RESULTS | P6-P7 |
| B-M07 | PRODUCTION | P8 |

The authoritative dossiers under `docs/backend/milestones/` define backend milestone scope and acceptance.

This document MUST NOT replace or duplicate those acceptance criteria.

### 17.4 Database Dependencies

Backend tests may depend on database capabilities associated with these canonical milestones:

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| DB-M01 | FOUNDATION | P0-P3 |
| DB-M02 | CORE DATA | P3 |
| DB-M03 | BOOKING DATA | P4 |
| DB-M04 | EXECUTION DATA | P5-P7 |

The authoritative dossiers under `docs/database/milestones/` define database milestone scope and acceptance.

This reference does not transfer database implementation ownership to the backend.

### 17.5 Cross-Domain Test Evidence

Backend testing may contribute evidence to cross-domain workflows.

A backend test MUST NOT be presented as proof that an untested frontend, database, cloud, or physical system behavior is correct.

## 18. Maintenance and Change Control

### 18.1 When to Update This Document

Update this document when backend testing practices change materially, including:

- Unit and service testing conventions.
- API and protocol contract testing.
- Database integration and migration testing.
- Object storage or queue integration.
- Simulated lab agent behavior.
- Load and performance test procedures.
- Backend security test coverage.
- Test fixture conventions.
- Test diagnostics and evidence.

### 18.2 Global Testing Policy Changes

Global test strategy, repository-wide quality gates, and release-blocking checks MUST be changed in `docs/development/TESTING_STRATEGY.md` or the appropriate global owner document.

This file MUST link to those policies rather than duplicate them.

### 18.3 Contract Changes

API changes MUST follow `docs/protocol/API_CONTRACT.md`.

Event changes MUST follow `docs/protocol/EVENT_CONTRACT.md`.

Artifact changes MUST follow `docs/protocol/ARTIFACT_MANIFEST.md`.

Tests MUST be updated to match approved contract changes.

### 18.4 Database Changes

Database architecture and migration strategy changes MUST follow `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

Database-specific decisions MUST follow `docs/database/planning/DECISIONS.md`.

Backend tests SHOULD validate the resulting application behavior without becoming the authoritative definition of database implementation.

### 18.5 Architecture Changes

Backend implementation architecture changes SHOULD be reflected in `docs/backend/architecture/BACKEND_ARCHITECTURE.md`.

API implementation changes SHOULD be reflected in `docs/backend/architecture/API_IMPLEMENTATION.md`.

Consequential backend architecture decisions SHOULD be recorded in `docs/backend/planning/DECISIONS.md`.

### 18.6 Milestone Changes

Changes to milestone scope or acceptance MUST be made in the authoritative dossiers under `docs/backend/milestones/` or the relevant domain's milestone directory.

This document MUST NOT independently introduce milestone gates.

## 19. Backend Testing Checklist

### 19.1 Unit and Service Tests

- [ ] Tests verify meaningful backend behavior.
- [ ] Normal, boundary, and invalid inputs are covered where relevant.
- [ ] Failure behavior is tested.
- [ ] Shared dependencies are controlled appropriately.
- [ ] Time and randomness are deterministic where required.
- [ ] Tests do not depend on execution order.

### 19.2 Contracts and APIs

- [ ] API tests follow `docs/protocol/API_CONTRACT.md`.
- [ ] Event tests follow `docs/protocol/EVENT_CONTRACT.md`.
- [ ] Artifact tests follow `docs/protocol/ARTIFACT_MANIFEST.md`.
- [ ] Request validation and error behavior are tested.
- [ ] Compatibility implications are assessed.
- [ ] Fixtures match the authoritative contracts.

### 19.3 Database, Storage, and Queue

- [ ] Tests use isolated test resources.
- [ ] Database schema is initialized through the approved migration mechanism.
- [ ] Migration and backfill behavior is validated where relevant.
- [ ] Storage operations and error behavior are tested.
- [ ] Queue publication and consumption are tested where applicable.
- [ ] Retry and duplicate-delivery behavior are covered when required.
- [ ] Cleanup is reliable and does not affect shared resources.

### 19.4 Simulated Lab Agent

- [ ] Simulator behavior matches the authoritative interface.
- [ ] Success and failure scenarios are deterministic.
- [ ] Timeout and disconnection behavior are tested where applicable.
- [ ] Simulator evidence is distinguished from physical validation.
- [ ] Remaining real-environment validation is recorded.

### 19.5 Load and Security

- [ ] Load-test objectives and workload are defined.
- [ ] Load testing uses an approved isolated environment.
- [ ] Performance measurements identify their environment and limitations.
- [ ] Relevant authentication and authorization behavior is tested.
- [ ] Invalid inputs and data exposure risks are covered where relevant.
- [ ] Test credentials and fixtures contain no production secrets.
- [ ] Security test limitations are documented.

### 19.6 Results and Evidence

- [ ] Actual test commands and outcomes are recorded where required.
- [ ] Passed, failed, skipped, blocked, and unrun tests are distinguished.
- [ ] Mock-based and real integration results are identified separately.
- [ ] Diagnostic evidence is reviewed for sensitive information.
- [ ] Global testing policy is followed through `docs/development/TESTING_STRATEGY.md`.
- [ ] Milestone acceptance remains owned by the authoritative milestone dossier.

## 20. Definition of Done

Backend testing practices are adequately documented when:

1. The ownership boundary with `docs/development/TESTING_STRATEGY.md` is explicit.
2. Unit, service, integration, and contract testing responsibilities are clear.
3. API, event, and artifact tests follow their authoritative contracts.
4. Database tests use isolated environments and the approved migration process.
5. Queue and object storage integration tests cover relevant success and failure behavior.
6. Simulated lab agent tests are deterministic and clearly distinguished from physical validation.
7. Load tests define measurable objectives and use approved environments.
8. Backend security tests validate relevant application trust boundaries without replacing global security policy.
9. Fixtures are synthetic, contract-conformant, and isolated.
10. Test results distinguish mocks from real integration evidence.
11. Global test policy and milestone acceptance remain owned by their authoritative documents.
12. Phase and milestone references use the frozen canonical model.
13. The document remains limited to backend-specific testing.

This document owns backend-specific testing only. Global testing strategy and enforcement remain owned by `docs/development/TESTING_STRATEGY.md`; protocol contracts, database implementation, security policy, and milestone acceptance remain owned by their respective authoritative documents.
