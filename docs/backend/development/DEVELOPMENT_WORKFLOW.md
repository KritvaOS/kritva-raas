# Backend Development Workflow

**Project:** Kritva RaaS  
**Document:** `docs/backend/development/DEVELOPMENT_WORKFLOW.md`  
**Scope:** Backend-specific contract-first development, module ownership, API change coordination, database migration hand-off, and cross-domain implementation coordination  
**Audience:** Backend developers, service architects, database developers, integration engineers, and reviewers  
**Status:** Backend development workflow guide

## 1. Purpose

This document defines how backend changes are planned, implemented, coordinated, and handed off within Kritva RaaS.

It covers only backend-specific workflow:

- Contract-first implementation.
- Backend module ownership and dependency boundaries.
- API change identification and coordination.
- Request, response, and error behavior alignment.
- Database change hand-off to database development.
- Event and artifact contract coordination.
- Cross-domain implementation dependencies.
- Backend-specific validation preparation.
- Integration hand-off and evidence.
- Traceability from backend changes to authoritative requirements and milestone dossiers.

This document does not define the global engineering workflow. Contributors MUST follow the shared development, branching, review, and CI policies maintained under `docs/development/`.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns backend-specific development workflow and coordination conventions:

- How backend changes begin from approved requirements and contracts.
- How backend modules establish and preserve ownership boundaries.
- How API changes are identified, proposed, implemented, and handed off.
- How backend request and response behavior is aligned with authoritative contracts.
- How error handling and validation changes are coordinated.
- How backend changes that require database work are handed off to database development.
- How event and artifact dependencies are identified.
- How cross-domain implementation dependencies are communicated.
- How backend implementation evidence is prepared for integration and review.
- How backend changes are traced to architecture decisions and milestone dossiers.

### 2.2 Global Workflow Ownership

Documents under `docs/development/` own the global engineering workflow, including:

- Branching and merge policy.
- Commit-message requirements.
- Pull request creation and approval policy.
- Repository-wide CI requirements.
- General code-review procedures.
- Global quality gates.
- Contributor workflow and repository conventions.
- Release authorization and release governance.
- General issue and task management procedures.

This document MUST link to the applicable global documents rather than reproduce their rules.

Backend-specific implementation evidence MAY supplement the global review process but MUST NOT create a separate approval or merge policy.

### 2.3 Other Document Ownership

| Concern | Authoritative document |
|---|---|
| Global development workflow | Applicable documents under `docs/development/` |
| Global development setup | `docs/development/DEVELOPMENT_SETUP.md` |
| Global testing strategy | `docs/development/TESTING_STRATEGY.md` |
| Global release policy | `docs/development/RELEASE_PROCESS.md` |
| Backend-specific setup | `docs/backend/development/DEVELOPMENT_SETUP.md` |
| Backend-specific development workflow | `docs/backend/development/DEVELOPMENT_WORKFLOW.md` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| Backend architecture decisions | `docs/backend/planning/DECISIONS.md` |
| System backend responsibilities and ownership | `docs/architecture/BACKEND_ARCHITECTURE.md` |
| Product and system decisions | `docs/planning/DECISIONS.md` |
| Canonical phase definitions | `docs/planning/PHASES.md` |
| API wire contract | `docs/protocol/API_CONTRACT.md` |
| Event wire contract | `docs/protocol/EVENT_CONTRACT.md` |
| Artifact contract and manifest | `docs/protocol/ARTIFACT_MANIFEST.md` |
| Database implementation architecture | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Database-specific decisions | `docs/database/planning/DECISIONS.md` |
| Cloud deployment implementation | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Application security and trust boundaries | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Backend milestone scope and acceptance | Authoritative dossiers under `docs/backend/milestones/` |
| Database milestone scope and acceptance | Authoritative dossiers under `docs/database/milestones/` |
| Cross-domain milestone scope | Applicable authoritative dossiers under `docs/**/milestones/` |

### 2.4 Explicit Non-Goals

This document MUST NOT become the authoritative home for:

- Global branching, review, merge, or CI policy.
- Backend package structure and architecture specifications in full.
- API, event, or artifact wire-contract definitions.
- Database schema design or migration implementation details.
- Cloud infrastructure deployment procedures.
- Global testing or release strategy.
- Product requirements and business rules.
- Milestone acceptance criteria.
- Task tracking or release checklists.

When a concern belongs to another document, this workflow MUST link to its authoritative owner.

## 3. Backend Workflow Principles

### 3.1 Requirements Before Implementation

Every backend change MUST have an identifiable requirement, approved defect, architecture decision, contract change, or authorized improvement.

The implementation SHOULD reference the relevant task and authoritative milestone dossier.

A backend implementation MUST NOT create new externally visible behavior solely because it is convenient for a particular module.

### 3.2 Contracts Before Cross-Domain Changes

When a change affects communication across a domain boundary, identify the authoritative contract before implementing the change.

A backend MUST NOT silently redefine request fields, response fields, event semantics, artifact metadata, or error meanings.

If a contract is incomplete, coordinate with its owner before relying on assumptions.

### 3.3 One Clear Owner per Responsibility

Every backend module and public interface SHOULD have an identifiable owner.

Ownership includes responsibility for implementation behavior, tests, dependencies, and coordination with consumers.

Overlapping ownership SHOULD be resolved through architecture review rather than maintained through duplicated implementations.

### 3.4 Separate Implementation from Contract Authority

Backend code implements API and service behavior, but the authoritative API contract remains in `docs/protocol/API_CONTRACT.md`.

Likewise, event and artifact semantics remain owned by their authoritative protocol documents.

Implementation code and tests MUST remain consistent with those contracts.

### 3.5 Database Changes Require Coordination

Backend changes that affect persistent data MUST identify the required database work and coordinate with database development.

The backend MUST NOT independently introduce schema changes outside the established migration workflow.

### 3.6 Evidence Must Match the Claim

A passing backend unit test does not prove cross-domain integration.

Implementation hand-offs MUST distinguish unit, adapter, integration, and environment-dependent evidence.

### 3.7 Preserve Global Workflow Policy

All contributors MUST follow the shared policies under `docs/development/`.

This document adds backend-specific development and hand-off conventions only.

## 4. Contract-First Development Process

### 4.1 Identify the Change Boundary

Before implementation, determine whether the change affects:

- Internal backend behavior.
- A backend module interface.
- An HTTP or other API request or response.
- An event payload or delivery expectation.
- An artifact or manifest.
- Persistent data.
- A frontend-facing behavior.
- A cross-domain workflow.

A change may affect multiple boundaries. Each affected boundary MUST be identified before implementation begins.

### 4.2 Locate the Authoritative Contract

Use the appropriate authoritative contract:

- API behavior: `docs/protocol/API_CONTRACT.md`.
- Event behavior: `docs/protocol/EVENT_CONTRACT.md`.
- Artifact behavior: `docs/protocol/ARTIFACT_MANIFEST.md`.

If the relevant contract does not exist or does not define the required behavior, identify the contract owner and propose the necessary change.

Do not create a backend-only interpretation and assume that consumers will follow it.

### 4.3 Classify the Change

Classify the proposed work as one of the following:

- Implementation-only change that preserves the contract.
- Additive contract change.
- Behavior change within an existing contract.
- Compatibility-sensitive change.
- Breaking contract change.
- Cross-domain architecture change.

The classification SHOULD be recorded in the task or review description where it affects implementation coordination.

### 4.4 Check Existing Consumers

Before changing a public interface, identify known consumers.

These may include:

- Frontend modules.
- Other backend modules.
- Background workers.
- Event consumers.
- Artifact processors.
- Integration tests.
- External clients where applicable.

The consumer list SHOULD be based on repository references, architecture documentation, and known deployment behavior.

Do not assume that an interface has no consumers merely because there are no obvious imports in the current module.

### 4.5 Define Expected Behavior

Clarify the behavior before implementation.

For an API operation, this generally includes:

- Request validation.
- Successful response.
- Relevant failure responses.
- Authorization requirements.
- State changes.
- Idempotency behavior where applicable.
- Relevant event or artifact effects.
- Persistence implications.

Only requirements relevant to the operation need to be specified. Do not create unsupported product semantics to fill documentation space.

### 4.6 Resolve Contract Questions

If the proposed behavior conflicts with an existing contract, stop the affected implementation work until the discrepancy is resolved.

The contract owner MUST approve the authoritative change.

Cross-domain architectural consequences SHOULD be reviewed through `docs/planning/DECISIONS.md` when appropriate.

### 4.7 Implement Against the Approved Contract

Once the required behavior is clear, implement the backend behavior using the architecture defined in `docs/backend/architecture/BACKEND_ARCHITECTURE.md` and `docs/backend/architecture/API_IMPLEMENTATION.md`.

The implementation MUST NOT change the public contract accidentally through a DTO, serializer, controller, or validation refactor.

### 4.8 Validate Contract Conformance

Validate the implementation against the approved contract.

Evidence SHOULD cover successful behavior and meaningful failure cases.

Where practical, tests SHOULD make it possible to detect incompatible changes to request validation, response mapping, or error behavior.

### 4.9 Complete the Handoff

When a change affects other domains, identify the updated contract, affected consumers, test evidence, and any remaining dependencies.

Do not mark an unvalidated cross-domain behavior as fully integrated merely because the backend implementation compiles.

## 5. Backend Module Ownership

### 5.1 Establish the Owning Module

Before adding behavior, identify the backend module responsible for it.

Use the module boundaries in `docs/architecture/BACKEND_ARCHITECTURE.md` and the implementation boundaries in `docs/backend/architecture/BACKEND_ARCHITECTURE.md`.

Extend an existing module when the responsibility belongs to it.

Create a new module only when the new boundary has a meaningful responsibility and ownership model.

### 5.2 Module Responsibilities

A backend module SHOULD have a clearly defined:

- Functional responsibility.
- Public interface.
- Data ownership boundary.
- Dependency set.
- Error-handling responsibility.
- Test boundary.
- Consumer set.
- Operational behavior where applicable.

These responsibilities SHOULD be reflected in architecture documentation when they materially affect the system.

### 5.3 Public Interfaces

Modules SHOULD expose deliberate interfaces rather than allow other modules to depend on internal implementation details.

A public interface SHOULD communicate the inputs, outputs, errors, and relevant lifecycle assumptions.

Changes to a public interface MUST identify affected consumers.

### 5.4 Internal Implementation

Internal services, repositories, mapping functions, and helpers SHOULD remain internal unless another module has a justified need to consume them.

A module MUST NOT expose internal details merely to avoid defining an appropriate public interface.

### 5.5 Dependency Direction

Dependencies MUST follow the approved backend architecture.

Avoid circular dependencies between modules.

If two modules require each other's internal details, review whether the responsibility boundary or public interfaces are incorrect.

### 5.6 Shared Services

Shared services SHOULD have a clear responsibility and owner.

Do not create a generic service that becomes a container for unrelated business behavior.

Changes to shared services MUST consider their known consumers and relevant tests.

### 5.7 Cross-Module Calls

Cross-module calls SHOULD use the approved public interfaces.

Callers MUST NOT bypass a module's validation or lifecycle requirements by directly invoking its internal repository or implementation classes.

### 5.8 Module Ownership Changes

When responsibility moves between modules:

1. Identify the current owner.
2. Identify the intended new owner.
3. Identify affected consumers and stored data.
4. Review API and event implications.
5. Coordinate database changes where required.
6. Update architecture documentation when necessary.
7. Validate the migration of behavior and tests.

A module ownership change MUST NOT leave two implementations independently authoritative for the same responsibility.

## 6. API Change Process

### 6.1 API Contract Ownership

`docs/protocol/API_CONTRACT.md` is the authoritative source for API wire behavior.

`docs/backend/architecture/API_IMPLEMENTATION.md` owns backend API implementation practices, including routing, controllers, DTO mapping, validation, middleware, error conversion, and application-service invocation.

This workflow describes the coordination process between contract changes and backend implementation.

### 6.2 Identify API Impact

For a proposed API change, determine whether it affects:

- Endpoint or operation identity.
- HTTP method or transport behavior.
- Request path or query parameters.
- Request body.
- Response body.
- Status codes.
- Error format.
- Authentication or authorization expectations.
- Pagination or filtering behavior.
- Idempotency.
- Event or artifact side effects.
- Compatibility with existing clients.

Only the affected areas need to change, but the impact assessment MUST be explicit.

### 6.3 Additive Changes

An additive change may introduce an optional field or a new operation, provided that the change remains compatible with existing consumers.

Compatibility MUST be evaluated against the actual contract and serialization behavior.

A field is not automatically compatible merely because it appears optional in a backend type definition.

### 6.4 Behavior Changes

Changes to existing validation, error mapping, default values, or state transitions can break consumers even when the schema remains unchanged.

Identify these changes explicitly.

Update the authoritative contract if the externally observable behavior changes.

### 6.5 Breaking Changes

A breaking API change MUST be coordinated with affected consumers and the contract owner before implementation is treated as complete.

The proposal SHOULD identify:

- Existing behavior.
- Intended behavior.
- Affected consumers.
- Compatibility consequences.
- Migration approach.
- Required tests.
- Deployment dependencies.

Versioning and release approval MUST follow the global policies under `docs/development/`.

### 6.6 Request and Response Types

Backend request and response types MUST map to the authoritative contract.

Internal domain models SHOULD NOT be exposed directly if doing so leaks internal persistence details or creates unintended coupling.

Use the DTO and mapping approach defined by `docs/backend/architecture/API_IMPLEMENTATION.md`.

### 6.7 Validation Changes

Request validation MUST align with the contract.

Validation changes SHOULD consider missing fields, invalid formats, boundary values, and relevant business-rule failures.

Backend validation remains authoritative for server-side enforcement even when the frontend also validates input.

### 6.8 Error Mapping

The backend MUST map implementation failures to the error behavior defined by the API contract.

Do not leak stack traces, secrets, database details, or internal infrastructure information through public error responses.

Tests SHOULD verify both the error category and the relevant response shape.

### 6.9 API Test Updates

An API change SHOULD update the relevant tests at the appropriate layers:

- Request validation tests.
- Controller or route tests.
- Application-service tests where behavior changes.
- API contract conformance tests.
- Integration tests where the boundary requires real dependencies.

Follow `docs/development/TESTING_STRATEGY.md` for global testing expectations.

### 6.10 Consumer Handoff

The API hand-off SHOULD identify:

- The authoritative contract change.
- The implementation change.
- Affected consumers.
- Compatibility implications.
- Test evidence.
- Required coordination or migration steps.

Frontend implementation details remain owned by the frontend domain.

## 7. Database Development Handoff

### 7.1 Identify Persistent Data Impact

Every backend change that affects persistent state MUST assess database impact.

Examples include:

- New stored attributes.
- Changed field semantics.
- New entity relationships.
- New indexes or constraints.
- Changed transaction boundaries.
- New persistence access patterns.
- Data backfills.
- Changes to retention or deletion behavior.

Not every backend change requires a schema migration. The impact assessment MUST distinguish schema work from application-only persistence changes.

### 7.2 Database Ownership

Database schema and migration implementation are owned by the database development domain.

`docs/database/architecture/DATABASE_ARCHITECTURE.md` is authoritative for database implementation architecture.

`docs/database/planning/DECISIONS.md` owns database-specific architecture decisions.

This workflow defines the backend-to-database hand-off, not the database migration design itself.

### 7.3 Prepare the Handoff

A database hand-off SHOULD include:

- The backend requirement.
- The relevant data ownership boundary.
- The affected entity or table, if known.
- The required read and write behavior.
- Constraints or integrity requirements.
- Expected data volume or access pattern when material.
- Compatibility requirements.
- Required backfill or migration behavior.
- Relevant API or event implications.
- Validation expectations.

The backend SHOULD describe required behavior without prescribing an implementation that conflicts with database architecture.

### 7.4 Schema Change Proposal

When a schema change is required, identify the change and coordinate with database development before relying on the new schema.

The database owner determines the appropriate schema design, migration approach, and database-specific validation.

The backend MUST NOT independently apply an unreviewed schema change to a shared environment.

### 7.5 Migration Ordering

Backend and database implementation MUST agree on when the new schema becomes available relative to the backend code that uses it.

For compatibility-sensitive changes, assess whether old and new backend versions may run concurrently.

Where required, use a staged migration approach defined by the database architecture and global deployment policy.

### 7.6 Expand-and-Contract Coordination

When an incompatible schema change cannot be deployed atomically, database and backend owners SHOULD agree on a staged transition.

The hand-off SHOULD identify:

1. The existing schema behavior.
2. The intermediate compatible state.
3. The backend version that uses the new behavior.
4. Any required backfill.
5. The criteria for removing obsolete schema elements.

The database owner defines the actual migration strategy and safety constraints.

### 7.7 Backfill and Data Transformation

If existing records require transformation, the hand-off MUST describe the required logical transformation and expected result.

The database owner SHOULD review execution safety, batching, locking, retryability, and validation.

The backend MUST NOT assume that a schema migration automatically transforms all existing data correctly.

### 7.8 Test Coordination

Coordinate the tests needed to validate both the database change and backend behavior.

These may include:

- Migration tests.
- Persistence integration tests.
- Constraint validation.
- Data backfill verification.
- Compatibility tests.
- API behavior tests.

The database owner validates database-specific behavior; the backend owner validates application behavior against the resulting schema.

### 7.9 Migration Failure

If a migration or backfill fails, preserve diagnostic evidence and coordinate with the database owner.

Do not attempt ad hoc schema repair in a shared environment without following the database recovery procedure.

Any required data restoration or database rollback remains owned by the database and operations domains.

### 7.10 Handoff Completion

The backend-to-database hand-off is complete when the required database work has a clear owner, the intended data behavior is understood, dependencies are recorded, and the relevant validation responsibilities are assigned.

The hand-off does not imply that the database migration has already been implemented or accepted.

## 8. Event and Artifact Coordination

### 8.1 Event Contract

`docs/protocol/EVENT_CONTRACT.md` is authoritative for event wire behavior.

When backend behavior publishes or consumes events, identify the relevant event contract and coordinate changes with its owner.

### 8.2 Event Change Impact

Assess changes to:

- Event identity.
- Payload fields.
- Event meaning.
- Ordering assumptions.
- Delivery and retry expectations.
- Consumer compatibility.
- Duplicate handling.
- Failure behavior.

The specific behavior MUST follow the authoritative event contract and backend architecture.

### 8.3 Event Producer Changes

When changing event production, confirm that the published event matches the contract.

Tests SHOULD validate payload mapping and relevant publication behavior.

Do not treat a successful internal function call as proof that an event was delivered to its intended consumer.

### 8.4 Event Consumer Changes

When changing event consumption, verify compatibility with the published event contract.

Consider malformed events, unexpected versions, duplicate delivery, and failure handling where applicable.

Do not silently discard events that require explicit error handling or operational visibility.

### 8.5 Artifact Contract

`docs/protocol/ARTIFACT_MANIFEST.md` is authoritative for artifact manifest behavior.

If backend behavior creates, stores, or exposes artifacts, ensure that identifiers, metadata, integrity information, and compatibility behavior match the approved contract.

### 8.6 Cross-Domain Handoff

Event and artifact changes SHOULD identify:

- The authoritative contract.
- Producers and consumers.
- Compatibility implications.
- Required implementation changes.
- Relevant test evidence.
- Any unresolved dependencies.

This workflow MUST NOT redefine event or artifact schemas.

## 9. Backend Implementation and Validation Handoff

### 9.1 Implementation Ownership

Backend implementation details MUST follow:

- `docs/backend/architecture/BACKEND_ARCHITECTURE.md`
- `docs/backend/architecture/API_IMPLEMENTATION.md`

This workflow MUST NOT duplicate their complete implementation specifications.

### 9.2 Validate at the Appropriate Boundary

Select tests according to the behavior being changed.

A backend module change may require unit or service tests.

An API change may require contract conformance and integration tests.

A persistent data change may require database integration and migration validation.

A cross-domain workflow may require integration evidence beyond backend-local tests.

### 9.3 Contract Conformance Evidence

For a public API or event change, evidence SHOULD demonstrate that implementation behavior matches the authoritative contract.

Include relevant success and failure behavior.

If the contract cannot be exercised in the current environment, document the limitation rather than claiming full integration validation.

### 9.4 Dependency Evidence

When a backend change depends on a database, queue, storage service, or external integration, identify which dependencies were used during validation.

Distinguish mock-based evidence from tests that exercised a real service.

### 9.5 Failure Handling

Backend changes SHOULD preserve the expected error behavior and operational diagnostics.

Tests SHOULD verify meaningful failures and recovery paths where relevant.

Do not conceal an implementation failure by returning a successful response with incomplete or misleading data.

### 9.6 Handoff to Other Domains

When another domain must complete work, provide enough information to proceed without guessing.

The hand-off SHOULD identify:

- Required behavior.
- Contract or architecture reference.
- Dependency and compatibility assumptions.
- Implementation status.
- Validation already completed.
- Remaining work and limitations.

The receiving domain remains responsible for its implementation and acceptance criteria.

## 10. Cross-Domain Dependency Management

### 10.1 Identify Dependencies Early

Identify frontend, database, cloud, and protocol dependencies before they block implementation.

A dependency SHOULD have a named owning domain and a clear expected output.

### 10.2 Avoid Implicit Contracts

If a backend module depends on behavior not yet defined by another domain, record the dependency and resolve the interface.

Do not rely on undocumented field names, event semantics, storage layout, or lifecycle assumptions.

### 10.3 Parallel Implementation

Parallel work is appropriate when the contract and ownership boundary are sufficiently clear.

If implementation must proceed before another dependency is available, use a contract-aligned mock or fixture.

The mock MUST be clearly distinguished from real integration evidence.

### 10.4 Dependency Changes

When a dependency changes, identify affected backend modules and tests.

Update relevant adapters, fixtures, and implementation documentation.

Coordinate breaking changes with the authoritative owner before assuming that all consumers can change together.

### 10.5 Unresolved Dependencies

An unresolved dependency SHOULD be recorded with:

- The required behavior.
- The owning domain.
- The relevant contract or architecture reference.
- The expected hand-off.
- The impact on backend implementation.
- The validation still required.

Whether the unresolved dependency blocks a milestone is determined by its authoritative dossier and the global project workflow.

## 11. Backend Change Handoff

### 11.1 Handoff Purpose

The hand-off explains the implementation change and the evidence supporting it.

It supplements the global review process defined under `docs/development/`.

It MUST NOT redefine pull request approvals, CI requirements, or merge policy.

### 11.2 Required Context

A backend hand-off SHOULD identify:

- The requirement or defect.
- The owning backend module.
- The relevant architecture decision.
- The authoritative API, event, or artifact contract.
- Database impact.
- Cross-domain dependencies.
- The tests performed.
- Known limitations.
- Required follow-up work.

### 11.3 Contract Changes

For contract changes, identify the old and new observable behavior and link to the authoritative contract.

Where compatibility is relevant, describe affected consumers and the migration approach.

### 11.4 Database Changes

For changes requiring database work, identify the database hand-off and its status.

Do not state that a schema migration is complete unless the database owner has confirmed the relevant implementation and validation.

### 11.5 Test Results

Record the actual validation performed.

Distinguish:

- Passed checks.
- Failed checks.
- Skipped checks.
- Blocked checks.
- Checks not run.

Follow the global testing and review evidence policy under `docs/development/`.

### 11.6 Known Limitations

Known limitations MUST be stated clearly when they affect correctness, compatibility, or integration confidence.

Do not describe mock-only behavior as verified end-to-end behavior.

### 11.7 Handoff Completion

The backend hand-off is ready when the change's intent, ownership, contract dependencies, database implications, and validation evidence are clear.

Final approval and merge remain governed by the global development workflow.

## 12. Common Workflow Problems

### 12.1 Contract Drift

**Symptoms**

- Backend response fields differ from documented behavior.
- Consumers rely on undocumented defaults.
- Error responses vary between implementations.

**Actions**

1. Locate the authoritative contract.
2. Compare implementation behavior with the contract.
3. Identify whether the defect is in the contract or implementation.
4. Coordinate any contract correction with its owner.
5. Update affected tests and consumers.

Do not resolve contract drift by silently changing one implementation.

### 12.2 Unclear Module Ownership

**Symptoms**

- Multiple modules implement the same responsibility.
- A module accesses another module's internal repository.
- A small change requires broad unrelated modifications.

**Actions**

1. Identify the intended responsibility.
2. Review the system and backend implementation architectures.
3. Identify the authoritative module owner.
4. Define or correct public interfaces.
5. Coordinate affected consumers.
6. Add tests for the corrected boundary.

### 12.3 API Compatibility Failure

**Symptoms**

- Existing clients reject responses.
- New validation rejects previously accepted requests.
- Error mapping changes unexpectedly.

**Actions**

1. Compare the change with the API contract.
2. Identify affected consumers.
3. Determine whether the change is compatible.
4. Coordinate a contract change when required.
5. Validate the implementation and consumer migration.

### 12.4 Database Handoff Is Incomplete

**Symptoms**

- Backend implementation assumes a missing column or constraint.
- Migration ordering is unclear.
- Backfill behavior is undefined.
- Tests pass only against a developer-specific schema.

**Actions**

1. Stop relying on undocumented schema state.
2. Prepare a database hand-off.
3. Identify the migration and compatibility requirements.
4. Coordinate the migration strategy with database development.
5. Validate backend behavior against the approved schema.

### 12.5 Mock and Integration Results Differ

**Symptoms**

- Mock-based tests pass but real integration fails.
- Fixture fields differ from service responses.
- Error behavior differs across boundaries.

**Actions**

1. Compare the mock with the authoritative contract.
2. Inspect the real integration response.
3. Correct the contract or implementation discrepancy.
4. Update fixtures and adapter tests.
5. Repeat the relevant integration validation.

### 12.6 Cross-Domain Work Is Blocked

**Symptoms**

- The backend waits for an undefined API or event.
- Database changes are not assigned.
- Consumers implement conflicting assumptions.

**Actions**

1. Identify the missing behavior.
2. Identify the authoritative contract and owning domain.
3. Document the dependency and expected hand-off.
4. Resolve the interface before depending on it.
5. Use a contract-aligned mock only when appropriate.
6. Record the remaining integration evidence required.

## 13. Relationship to Phases and Milestones

### 13.1 Phase Authority

`docs/planning/PHASES.md` is the canonical source for phase definitions.

This document defines backend workflow practices only. It MUST NOT redefine phase scope or create additional product milestones.

### 13.2 Canonical Phases

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

### 13.3 Backend Milestones

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

This workflow MUST NOT replace or duplicate milestone acceptance criteria.

### 13.4 Database Dependencies

Backend work may depend on database milestones:

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| DB-M01 | FOUNDATION | P0-P3 |
| DB-M02 | CORE DATA | P3 |
| DB-M03 | BOOKING DATA | P4 |
| DB-M04 | EXECUTION DATA | P5-P7 |

The authoritative dossiers under `docs/database/milestones/` define database milestone scope and acceptance.

The tables above provide canonical references only. They do not assign database implementation ownership to the backend.

### 13.5 Cross-Domain Traceability

When a backend change depends on frontend, database, or cloud work, reference the relevant authoritative dossier.

Do not copy another domain's acceptance criteria into a backend task.

## 14. Maintenance and Change Control

### 14.1 When to Update This Document

Update this document when backend workflow conventions change materially, including:

- Contract-first implementation.
- Module ownership and public interfaces.
- API change coordination.
- Database hand-off expectations.
- Event and artifact integration.
- Cross-domain dependency management.
- Backend implementation hand-off evidence.

### 14.2 Global Workflow Changes

Changes to branching, commits, reviews, CI, merge approvals, or release authorization MUST be made in the appropriate documents under `docs/development/`.

This file MUST link to those documents rather than duplicate their policies.

### 14.3 Architecture Changes

Backend implementation architecture changes SHOULD be reflected in `docs/backend/architecture/BACKEND_ARCHITECTURE.md`.

API implementation changes SHOULD be reflected in `docs/backend/architecture/API_IMPLEMENTATION.md`.

System-level ownership changes MUST be evaluated against `docs/architecture/BACKEND_ARCHITECTURE.md`.

Consequential backend architecture decisions SHOULD be recorded in `docs/backend/planning/DECISIONS.md`.

### 14.4 Contract Changes

API changes MUST follow `docs/protocol/API_CONTRACT.md`.

Event changes MUST follow `docs/protocol/EVENT_CONTRACT.md`.

Artifact changes MUST follow `docs/protocol/ARTIFACT_MANIFEST.md`.

This workflow coordinates implementation with those contracts but MUST NOT become their authoritative definition.

### 14.5 Database Changes

Database implementation changes MUST follow `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

Database-specific decisions MUST follow `docs/database/planning/DECISIONS.md`.

This workflow MUST preserve the distinction between backend application requirements and database implementation ownership.

### 14.6 Testing and Release Changes

Global testing policy MUST follow `docs/development/TESTING_STRATEGY.md`.

Global release policy MUST follow `docs/development/RELEASE_PROCESS.md`.

Backend-specific validation and integration hand-offs MUST remain consistent with those policies.

## 15. Backend Workflow Checklist

### 15.1 Change Preparation

- [ ] The requirement or defect is clear.
- [ ] The owning backend module is identified.
- [ ] Relevant architecture documents have been reviewed.
- [ ] API, event, and artifact contract impacts are identified.
- [ ] Database impact is assessed.
- [ ] Cross-domain dependencies have clear owners.
- [ ] The authoritative milestone dossier is identified where applicable.

### 15.2 Contract-First Implementation

- [ ] The authoritative contract is identified.
- [ ] Contract changes are distinguished from implementation-only changes.
- [ ] Affected consumers are identified.
- [ ] Compatibility implications are understood.
- [ ] Contract questions are resolved with the owner.
- [ ] Implementation types and mappings conform to the approved contract.
- [ ] Relevant success and failure behavior is validated.

### 15.3 Module Ownership

- [ ] The module has a clear responsibility.
- [ ] Public interfaces are deliberate.
- [ ] Internal implementation details remain internal.
- [ ] Dependency direction follows the approved architecture.
- [ ] Shared service changes consider known consumers.
- [ ] Ownership changes are coordinated and documented.

### 15.4 Database Handoff

- [ ] Persistent data impact is assessed.
- [ ] Required schema work is identified.
- [ ] Database ownership is clear.
- [ ] Migration ordering and compatibility are discussed where relevant.
- [ ] Backfill requirements are documented.
- [ ] Database and backend validation responsibilities are assigned.
- [ ] No unreviewed schema change is applied to a shared environment.

### 15.5 Integration and Handoff

- [ ] API, event, and artifact changes follow authoritative contracts.
- [ ] Relevant tests have been run.
- [ ] Mock-based and real integration evidence are distinguished.
- [ ] Cross-domain dependencies are documented.
- [ ] Known limitations are explicit.
- [ ] Test results accurately describe what passed or was blocked.
- [ ] Global review and CI policy is followed through `docs/development/`.

## 16. Definition of Done

The backend development workflow is adequately documented when:

1. The ownership boundary with global development workflow is explicit.
2. Contract-first implementation is the expected process for cross-domain behavior.
3. Backend module ownership and dependency boundaries are clear.
4. API changes are coordinated with the authoritative contract owner.
5. Event and artifact changes follow their respective contracts.
6. Database work is handed off to database development with clear requirements and compatibility context.
7. Backend implementation evidence distinguishes local tests from cross-domain integration.
8. Unresolved dependencies and limitations are recorded.
9. Architecture and contract documents remain authoritative for their respective concerns.
10. Global branching, review, CI, and release policies are not duplicated.
11. Backend milestone scope remains owned by the authoritative dossiers under `docs/backend/milestones/`.
12. Phase and milestone references use the frozen canonical model.
13. The workflow remains focused on backend-specific implementation and coordination.

This document owns backend-specific development workflow only. Global workflow, branching, review, and CI policy remain owned by documents under `docs/development/`; API and event contracts, database implementation, architecture, and milestone acceptance remain owned by their respective authoritative documents.
