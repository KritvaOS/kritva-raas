# Backend Architecture Decision Register

**Document:** `docs/backend/planning/DECISIONS.md`  
**Project:** Kritva RaaS  
**Status:** Backend-specific architecture decision register  
**Audience:** Backend architects, backend engineers, technical reviewers, and implementation owners  
**Normative language:** MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY express requirements.

## 1. Purpose

This document records architectural decisions specific to the backend implementation of Kritva RaaS.

It provides a consistent, traceable record of backend implementation choices, the context behind them, alternatives considered, consequences, and validation expectations.

The register exists to keep backend decisions explicit and reviewable without duplicating product/system decisions or the authoritative architecture and protocol documents.

Backend decisions MUST remain consistent with the product/system architecture and contracts. When a backend proposal requires a change to a product-wide architectural constraint, that change MUST be reviewed through `docs/planning/DECISIONS.md`.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns backend-specific architecture decision records, including decisions about:

- Backend application layering and dependency direction.
- Backend module implementation and package boundaries.
- Dependency injection and application composition.
- Controller, routing, DTO, and mapping implementation.
- Application-service invocation and orchestration patterns.
- Backend validation and error translation.
- Repository implementation and persistence access patterns.
- Transaction boundaries and concurrency handling in backend code.
- Backend worker implementation and job-processing patterns.
- Backend event publication and consumption implementation.
- Backend implementation of realtime gateways.
- Backend-specific idempotency and retry mechanisms.
- Backend configuration and dependency management.
- Backend logging, metrics, tracing, and diagnostics.
- Backend unit, integration, and contract testing strategy.
- Backend build, run, and development workflow.
- Backend-specific performance and resource-management choices.
- Backend dependency upgrades and implementation migrations.
- Backend-specific technical debt and implementation trade-offs.

Each record MUST describe a backend implementation decision rather than restate a product-wide requirement.

### 2.2 Product-Wide Decision Ownership

`docs/planning/DECISIONS.md` owns product/system-level architecture decisions and the index to domain decision registers.

This backend register MUST NOT independently define or override:

- Product-wide service boundaries.
- Cross-domain responsibility and ownership.
- System-level API semantics.
- Shared wire-contract definitions.
- Product-level identity, authentication, or authorization policy.
- System-wide trust boundaries.
- Product-level persistence authority.
- System-level event semantics.
- Cloud topology and infrastructure ownership.
- Product-wide availability, recovery, or deployment guarantees.
- Cross-domain compatibility rules.

When a backend proposal changes one of these concerns, the proposal MUST reference the relevant product/system decision and request a change through the product-wide decision process.

### 2.3 Other Document Ownership

| Concern | Authoritative document |
|---|---|
| Product/system-level decisions | `docs/planning/DECISIONS.md` |
| Canonical phase definitions | `docs/planning/PHASES.md` |
| System backend responsibilities and ownership | `docs/architecture/BACKEND_ARCHITECTURE.md` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| Backend-specific architecture decisions | `docs/backend/planning/DECISIONS.md` |
| Backend milestone scope and acceptance | Authoritative dossiers under `docs/backend/milestones/` |
| API wire contract | `docs/protocol/API_CONTRACT.md` |
| Event wire contract | `docs/protocol/EVENT_CONTRACT.md` |
| Artifact contract and manifest | `docs/protocol/ARTIFACT_MANIFEST.md` |
| System database role and authority | `docs/architecture/DATABASE_ARCHITECTURE.md` |
| PostgreSQL implementation architecture | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Database-specific decisions | Applicable database decision register under `docs/database/` |
| System cloud topology | `docs/architecture/CLOUD_ARCHITECTURE.md` |
| Cloud implementation architecture | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Cloud and infrastructure security | `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` |
| Application security model and trust boundaries | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Frontend implementation and decisions | Applicable documents under `docs/frontend/` |
| Cross-domain milestone scope | Applicable authoritative dossiers under `docs/**/milestones/` |

The referenced documents are authoritative for their named responsibilities. This register MUST link to them rather than reproduce their full content.

### 2.4 Decision Register Versus Architecture Documents

This register records why a backend implementation choice was made.

`docs/backend/architecture/BACKEND_ARCHITECTURE.md` describes the current backend implementation architecture, including package layout, layering, dependency injection, module wiring, configuration, workers, testing seams, and development workflow.

`docs/backend/architecture/API_IMPLEMENTATION.md` describes the backend implementation of API routing, controllers, DTOs, validation, service invocation, error mapping, OpenAPI generation, and realtime gateways.

A backend architecture document MUST link to the relevant decision when the decision explains a consequential implementation constraint.

This register MUST NOT duplicate complete architecture descriptions or implementation instructions.

### 2.5 Explicit Non-Goals

This document MUST NOT become the authoritative home for:

- Product/system architecture decisions.
- Product requirements or business policy.
- API, event, or artifact wire contracts.
- Frontend implementation decisions.
- Database schema and PostgreSQL implementation decisions.
- Cloud topology or infrastructure-security decisions.
- Application-wide authentication and authorization policy.
- Milestone acceptance criteria.
- Detailed task tracking.
- Operational runbooks.
- General coding standards that do not represent a consequential architecture decision.
- Complete backend architecture descriptions.
- API endpoint catalogs that belong in the API contract.

When content belongs elsewhere, this register MUST link to the authoritative owner.

## 3. Backend Decision Principles

### 3.1 Single Authority

Each backend architecture decision MUST have one authoritative record.

A decision MUST NOT be copied into another document as a second independent authority.

Other documents MAY summarize the decision where necessary, but MUST link to this register.

### 3.2 Implementation Scope

A backend decision MUST identify the implementation concern it governs.

A decision SHOULD be as narrow as possible while still solving the stated problem.

A local implementation choice MUST NOT silently impose a product-wide architectural constraint.

### 3.3 Contract Preservation

Backend implementation MUST conform to the applicable published API, event, and artifact contracts.

A backend implementation MAY use internal models and adapters, but MUST NOT silently change the external contract.

A proposed contract change MUST be reviewed by the contract owner and escalated to the product-wide decision process when it changes a system-level constraint.

### 3.4 Explicit Dependencies

Backend modules SHOULD depend on declared interfaces rather than concrete implementation details owned by unrelated modules.

Dependency direction MUST be reviewable and SHOULD be enforced through module structure, build rules, architecture tests, or code review.

### 3.5 Testability

Backend implementation decisions SHOULD preserve the ability to test business orchestration, persistence behavior, asynchronous processing, and external integrations independently.

Test seams MUST NOT undermine production security or correctness guarantees.

### 3.6 Failure Handling

Decisions involving retries, timeouts, transactions, background jobs, or external services MUST explain relevant failure behavior.

A retry mechanism MUST account for duplicate effects, partial completion, and whether the operation is safe to repeat.

### 3.7 Operational Evidence

Decisions that affect performance, reliability, or resource consumption SHOULD identify how their outcomes will be measured.

Claims about throughput, latency, resilience, or scalability SHOULD be supported by tests, measurements, or a documented validation plan.

### 3.8 Security Alignment

Backend implementation MUST follow the approved application security model.

This register MAY decide how backend code implements a security requirement, but MUST NOT create an independent application authentication or authorization policy.

### 3.9 Reversibility

A decision SHOULD identify whether it can be reversed locally or requires a costly migration.

High-cost decisions SHOULD receive stronger review and explicit migration planning.

### 3.10 No Implied Approval

A proposed decision is not an approved implementation requirement.

The presence of a proposal in this register MUST NOT be interpreted as evidence that the choice has been accepted, implemented, or tested.

## 4. Decision Record Format

### 4.1 Required Fields

Every accepted backend decision MUST include:

- **ID:** Stable, unique identifier.
- **Title:** Concise decision name.
- **Status:** Proposed, Accepted, Rejected, Superseded, or Withdrawn.
- **Date:** Date of the decision or latest status transition.
- **Context:** Problem, requirement, and relevant constraints.
- **Decision:** Selected backend implementation approach.
- **Rationale:** Reasons for selecting the approach.
- **Alternatives:** Material alternatives considered.
- **Consequences:** Benefits, limitations, and obligations.
- **Affected areas:** Backend modules, packages, services, or implementation paths.
- **Related decisions:** IDs of decisions that constrain or depend on this decision.
- **References:** Links to architecture documents, contracts, tests, and milestone dossiers.
- **Review triggers:** Conditions that would require reconsideration.
- **Validation evidence:** Tests, measurements, or implementation references when applicable.

A proposed decision MAY have incomplete implementation evidence. Such evidence MUST be completed before implementation is declared conformant.

### 4.2 Stable IDs

Backend decision IDs MUST use the prefix `BE-ADR-` followed by a zero-padded numeric identifier.

Examples:

- `BE-ADR-001`
- `BE-ADR-002`
- `BE-ADR-003`

IDs MUST NOT be reused after a decision is rejected, withdrawn, or superseded.

Product/system decision IDs MUST follow the convention defined in `docs/planning/DECISIONS.md`.

### 4.3 Status Definitions

| Status | Meaning |
|---|---|
| Proposed | Under discussion; not an approved implementation constraint |
| Accepted | Approved and authoritative until superseded or withdrawn |
| Rejected | Reviewed and not selected |
| Superseded | Replaced by a later decision |
| Withdrawn | No longer applicable and not replaced by a direct successor |

A proposed decision MUST NOT be described as an established backend architecture requirement.

A rejected decision SHOULD record the reason for rejection.

A superseded decision MUST identify its successor.

### 4.4 Decision Scope

Each record MUST identify the backend scope it governs.

Examples include dependency injection, worker retry behavior, repository implementation, API error mapping, or backend test isolation.

A decision MUST distinguish local implementation requirements from constraints that affect multiple backend modules.

### 4.5 Alternatives

Material alternatives SHOULD be recorded with their relevant trade-offs.

When an alternative is rejected, the rationale SHOULD explain why it does not meet the requirements as well as the selected option.

A record MAY use a concise alternatives analysis when the decision is low-risk and readily reversible.

### 4.6 Consequences

Consequences MUST identify material effects on:

- Maintainability.
- Testability.
- Dependency direction.
- Runtime behavior.
- Transaction and concurrency behavior.
- Failure handling.
- Observability.
- Security implementation.
- Performance and resource usage.
- Migration cost.
- Contract compatibility.
- Development and operational workflow.

Follow-up implementation work SHOULD be linked to its authoritative task or milestone record.

## 5. Backend Decision Index

### 5.1 Index Purpose

The index provides a discoverable entry point for backend implementation decisions.

The entries below are proposed placeholders for review. They do not establish that a choice has already been approved or implemented.

Each entry MUST be completed, rejected, withdrawn, or removed from the active index through the decision workflow.

### 5.2 Initial Register

| ID | Decision title | Status | Scope | Record |
|---|---|---|---|---|
| BE-ADR-001 | Backend decision governance and ownership | Proposed | Decision boundaries and record maintenance | Section 6 |
| BE-ADR-002 | Backend layering and dependency direction | Proposed | Package and module implementation | Section 7 |
| BE-ADR-003 | Dependency injection and application composition | Proposed | Runtime wiring and dependency lifecycle | Section 8 |
| BE-ADR-004 | API controller and DTO implementation boundaries | Proposed | API implementation | Section 9 |
| BE-ADR-005 | Backend validation and error mapping | Proposed | Input validation and error translation | Section 10 |
| BE-ADR-006 | Repository and transaction implementation | Proposed | Persistence integration and concurrency | Section 11 |
| BE-ADR-007 | Background workers and retry behavior | Proposed | Asynchronous backend processing | Section 12 |
| BE-ADR-008 | Backend events and realtime integration | Proposed | Event publication and gateway implementation | Section 13 |
| BE-ADR-009 | Backend testing and quality gates | Proposed | Verification and CI | Section 14 |
| BE-ADR-010 | Backend observability and performance | Proposed | Diagnostics and runtime efficiency | Section 15 |
| BE-ADR-011 | Coding-agent policy and provider metadata services | Proposed | Organization policy (B-M01) and provider metadata (B-M03) | Section 16 |

These entries identify areas requiring explicit decisions. They MUST NOT be interpreted as a mandate to adopt any particular framework, database access library, queue, or observability vendor.

### 5.3 Index Maintenance

When a decision is accepted, the index MUST link to its complete record and show its current status.

When a decision is superseded, the index MUST identify the successor.

When a decision depends on a product/system decision, the full record SHOULD link to the relevant entry in `docs/planning/DECISIONS.md`.

The index MUST NOT duplicate product-wide decision content.

## 6. BE-ADR-001 — Backend Decision Governance and Ownership

**Status:** Proposed  
**Scope:** Backend-specific decision records

### 6.1 Context

Backend implementation choices can be repeated across architecture documents, planning files, code comments, and milestone dossiers.

Without explicit ownership, proposed approaches may be mistaken for accepted architecture, and backend implementation choices may accidentally become competing definitions of product-wide behavior.

### 6.2 Proposed Decision

Backend-specific architecture decisions MUST be recorded in this register.

Product/system-level decisions MUST be recorded in `docs/planning/DECISIONS.md`.

Backend implementation architecture MUST be described in `docs/backend/architecture/BACKEND_ARCHITECTURE.md`.

Backend API implementation MUST be described in `docs/backend/architecture/API_IMPLEMENTATION.md`.

Backend milestone scope and acceptance MUST remain in the authoritative dossiers under `docs/backend/milestones/`.

### 6.3 Rationale

This separation preserves the rationale and history of backend choices while keeping system-level responsibilities and implementation descriptions in their proper locations.

### 6.4 Consequences

- Backend decisions require stable IDs and explicit status.
- Cross-domain decisions must be escalated to the product-wide register.
- Architecture documents MUST link to relevant accepted decisions.
- Milestone dossiers remain authoritative for acceptance.
- Superseded decisions remain discoverable.
- Backend implementation documents MUST NOT silently redefine external contracts.

### 6.5 Review Triggers

Review this decision if the repository documentation structure, decision workflow, or backend ownership model changes materially.

## 7. BE-ADR-002 — Backend Layering and Dependency Direction

**Status:** Proposed  
**Scope:** Backend module and package boundaries

### 7.1 Context

Backend implementations can become difficult to maintain when transport handling, application orchestration, business rules, persistence, and infrastructure integrations are mixed together.

Unclear dependency direction can make modules difficult to test and change independently.

### 7.2 Proposed Decision

Backend implementation MUST define explicit responsibilities for its layers and modules.

Dependency direction MUST be documented in `docs/backend/architecture/BACKEND_ARCHITECTURE.md`.

Transport-specific code SHOULD remain separate from application orchestration and persistence implementation.

A module MUST NOT access another module's internal implementation merely because the code is available in the same repository.

### 7.3 Rationale

Explicit layering limits accidental coupling and allows implementation details to change without unnecessarily affecting transport, application, or domain-facing interfaces.

### 7.4 Consequences

- Modules SHOULD expose deliberate interfaces.
- Internal package details SHOULD NOT become accidental public APIs.
- Circular dependencies SHOULD be prevented.
- Cross-module calls MUST have an identifiable owner and contract.
- Shared utilities MUST have a clear purpose and ownership.
- Architecture tests or static checks SHOULD enforce critical dependency constraints.

### 7.5 Alternatives

Possible structures include a flat package layout, feature-oriented modules, or a layered application structure.

The chosen structure MUST be documented in the backend implementation architecture and justified by the actual module boundaries and team needs.

### 7.6 Review Triggers

Review this decision if cross-module imports proliferate, dependency cycles appear, or implementation changes repeatedly require unrelated modules to change.

## 8. BE-ADR-003 — Dependency Injection and Application Composition

**Status:** Proposed  
**Scope:** Backend dependency construction and lifecycle

### 8.1 Context

Scattered dependency construction makes runtime wiring difficult to inspect and test. It can also create inconsistent configuration and lifecycle behavior across services and workers.

### 8.2 Proposed Decision

The backend MUST define an explicit application composition mechanism.

Production dependency construction SHOULD be centralized in the application composition root or an equivalent declared mechanism.

Business and application services SHOULD receive dependencies through explicit interfaces or constructors rather than resolve arbitrary dependencies from hidden global state.

### 8.3 Rationale

Explicit construction makes dependencies visible, simplifies testing, and clarifies ownership of resource lifecycles.

### 8.4 Consequences

- Dependency registrations MUST be discoverable.
- Required dependencies MUST fail clearly when configuration or construction is invalid.
- Long-lived and request-scoped resources MUST have deliberate lifetimes.
- Database connections, network clients, and worker resources MUST be managed according to their lifecycle requirements.
- Tests SHOULD be able to substitute controlled implementations at declared boundaries.
- Hidden service locators SHOULD be avoided unless explicitly justified.

### 8.5 Configuration and Lifecycle

The concrete composition mechanism, startup sequence, shutdown sequence, and resource lifecycle rules MUST be documented in `docs/backend/architecture/BACKEND_ARCHITECTURE.md`.

This decision MUST NOT duplicate the complete runtime wiring specification.

### 8.6 Review Triggers

Review this decision if dependency lifecycle bugs recur, tests require extensive global setup, or composition becomes distributed across unrelated modules.

## 9. BE-ADR-004 — API Controller and DTO Implementation Boundaries

**Status:** Proposed  
**Scope:** Backend API implementation

### 9.1 Context

Controllers that contain application workflows, persistence logic, and transport-specific mapping become difficult to test and evolve.

Conversely, excessive abstraction can introduce unnecessary layers for simple operations.

### 9.2 Proposed Decision

API controllers and route handlers SHOULD remain focused on transport concerns.

They SHOULD handle request binding, invocation of the appropriate application service, response mapping, and transport-level metadata.

Application orchestration MUST remain in the appropriate application service or declared equivalent.

DTOs MUST be treated as transport representations rather than automatically exposing internal persistence models.

### 9.3 Rationale

Separating transport handling from application behavior reduces coupling and makes both layers independently testable.

### 9.4 Consequences

- Request and response DTOs MUST conform to `docs/protocol/API_CONTRACT.md`.
- Mapping logic SHOULD be explicit and testable.
- Controllers MUST NOT independently redefine business rules.
- Persistence entities MUST NOT be exposed directly merely to reduce mapping code when doing so compromises contract stability.
- Authorization enforcement MUST follow the approved application security design.
- OpenAPI output MUST represent the actual API contract.

### 9.5 Ownership Boundary

The detailed controller, routing, DTO, mapping, middleware, validation, service invocation, OpenAPI, and realtime gateway implementation rules belong in `docs/backend/architecture/API_IMPLEMENTATION.md`.

The wire contract belongs in `docs/protocol/API_CONTRACT.md`.

This record owns only the decision rationale and the backend-specific choice of implementation boundaries.

### 9.6 Review Triggers

Review this decision if controllers accumulate application workflows, response mapping becomes inconsistent, or API contract changes cause avoidable internal coupling.

## 10. BE-ADR-005 — Backend Validation and Error Mapping

**Status:** Proposed  
**Scope:** Backend input validation and failure translation

### 10.1 Context

Validation and error handling can become inconsistent when individual endpoints implement their own conventions.

Leaking internal exceptions can expose implementation details, while collapsing all failures into generic responses can make clients unable to respond appropriately.

### 10.2 Proposed Decision

Backend validation and error translation MUST follow a consistent implementation strategy.

Transport-level validation MUST be distinguished from application-level invariants and persistence constraints.

Internal exceptions MUST NOT be exposed directly as public API errors.

### 10.3 Rationale

Consistent validation and error mapping improve client behavior, diagnosability, and contract stability.

### 10.4 Consequences

- Request validation MUST use the contract-defined field and error semantics.
- Application invariants MUST be enforced at an authoritative backend boundary.
- Persistence constraints MUST remain enforced by the persistence system where required for correctness.
- Error mapping MUST preserve useful diagnostic context without exposing secrets or internal stack traces.
- Unexpected failures MUST be distinguishable from expected domain or validation failures.
- Logs and public responses MUST have separate disclosure policies.

### 10.5 Contract Boundary

Public error schemas and semantics are owned by `docs/protocol/API_CONTRACT.md`.

Implementation rules for middleware, exception translation, logging, and controller behavior belong in `docs/backend/architecture/API_IMPLEMENTATION.md`.

Application security requirements remain owned by `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/`.

### 10.6 Review Triggers

Review this decision if clients cannot reliably distinguish failure classes, sensitive implementation details appear in responses, or different endpoints return inconsistent representations of equivalent failures.

## 11. BE-ADR-006 — Repository and Transaction Implementation

**Status:** Proposed  
**Scope:** Backend persistence integration

### 11.1 Context

Backend services need reliable access to persistent data while preserving transaction boundaries, concurrency correctness, and the ownership of database operations.

An overly generic repository abstraction can obscure query behavior, while direct database access from arbitrary application components can create inconsistent persistence rules.

### 11.2 Proposed Decision

Backend persistence access MUST follow the boundaries documented in `docs/backend/architecture/BACKEND_ARCHITECTURE.md`.

Database implementation details MUST follow `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

Backend code MUST NOT create a competing definition of schema ownership, database-wide isolation policy, or database security configuration.

### 11.3 Rationale

The separation allows backend code to express application operations while leaving PostgreSQL implementation policy with the database architecture owner.

### 11.4 Consequences

- Persistence access MUST have an identifiable module or repository owner.
- Transaction boundaries MUST be explicit for operations requiring atomicity.
- Concurrent updates MUST have a defined correctness strategy.
- Database constraints MUST NOT be treated as a substitute for user-facing validation.
- Backend retries MUST account for transaction rollback and uncertain outcomes.
- Persistence integration tests SHOULD exercise actual transaction behavior.
- Query-specific optimizations MAY use direct database capabilities when justified and documented.

### 11.5 Transaction and Concurrency Boundary

This register may decide how backend application services coordinate transactions and handle concurrency outcomes.

The database architecture document owns PostgreSQL transaction and isolation policy, migrations, row-level security, indexing, partitioning, pooling, backup, restore, and upgrade safety.

The database decision register owns database-specific ADRs.

### 11.6 Review Triggers

Review this decision if transaction ownership becomes unclear, concurrent updates cause correctness defects, or repository abstractions hide important database behavior.

## 12. BE-ADR-007 — Background Workers and Retry Behavior

**Status:** Proposed  
**Scope:** Backend asynchronous processing implementation

### 12.1 Context

Background workers may encounter transient failures, process restarts, duplicate delivery, timeouts, and partial completion.

Without explicit retry and recovery behavior, asynchronous processing can cause duplicate side effects or silently lose work.

### 12.2 Proposed Decision

Every backend background-processing implementation MUST define its execution lifecycle and failure behavior.

Retry behavior MUST be based on the operation's failure classification and repeatability.

A worker MUST NOT assume that a failed acknowledgement proves that the underlying operation did not complete.

### 12.3 Rationale

Explicit failure semantics make asynchronous processing more predictable and improve recovery after worker or dependency failures.

### 12.4 Consequences

- Retryable and non-retryable failures MUST be distinguishable.
- Retry delays and limits SHOULD be bounded and configurable.
- Repeated delivery MUST be considered where the delivery mechanism permits it.
- Side-effecting operations SHOULD use an appropriate idempotency or deduplication strategy.
- Permanently failing work MUST have a defined terminal handling path.
- Worker shutdown MUST consider in-flight operations.
- Logs and metrics SHOULD identify repeated failures and processing delays.

### 12.5 Ownership Boundary

This decision covers backend worker implementation, lifecycle, and retry behavior.

System-level execution semantics and user-visible job states belong to the relevant product/system architecture and protocol documents.

Cloud queue selection, infrastructure delivery guarantees, and resource configuration belong to `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

### 12.6 Review Triggers

Review this decision if work is repeatedly lost, duplicate side effects occur, retry storms appear, or workers cannot shut down safely.

## 13. BE-ADR-008 — Backend Events and Realtime Integration

**Status:** Proposed  
**Scope:** Backend event publication, consumption, and realtime gateway implementation

### 13.1 Context

Backend components may need to publish events, consume asynchronous messages, or deliver updates through a realtime gateway.

Mixing event semantics with transport implementation can create duplicate definitions and inconsistent delivery behavior.

### 13.2 Proposed Decision

Backend event implementation MUST conform to `docs/protocol/EVENT_CONTRACT.md`.

The backend MUST distinguish event payload semantics from the mechanism used to publish, transport, or deliver an event.

Realtime gateway implementation MUST adapt the approved contract to the supported client transport without redefining the underlying event meaning.

### 13.3 Rationale

Separating contract semantics from transport implementation supports consistent event interpretation across services and clients.

### 13.4 Consequences

- Event names, schemas, and compatibility rules MUST follow the event contract.
- Publication behavior MUST define how failures are handled.
- Duplicate delivery MUST be considered where applicable.
- Event ordering MUST NOT be assumed unless guaranteed by the relevant contract and implementation.
- Realtime connections MUST have explicit lifecycle and failure handling.
- Authorization and tenant isolation MUST follow the approved application security model.
- Event publication SHOULD be observable and testable independently from delivery transport.

### 13.5 Ownership Boundary

The event wire contract belongs to `docs/protocol/EVENT_CONTRACT.md`.

Realtime gateway implementation belongs to `docs/backend/architecture/API_IMPLEMENTATION.md`.

The system-level meaning of events and cross-domain event ownership belong to the relevant product/system architecture documents.

Infrastructure messaging resources belong to `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

### 13.6 Review Triggers

Review this decision if consumers interpret the same event differently, delivery failures are difficult to diagnose, or gateway implementation becomes coupled to business logic.

## 14. BE-ADR-009 — Backend Testing and Quality Gates

**Status:** Proposed  
**Scope:** Backend verification strategy

### 14.1 Context

Backend defects may arise from application logic, persistence, concurrency, transport mapping, external dependencies, asynchronous processing, and runtime configuration.

A test strategy focused on only one level may leave important behavior unverified.

### 14.2 Proposed Decision

The backend MUST define a layered verification strategy appropriate to its architecture.

The strategy SHOULD distinguish:

- Unit tests for isolated application logic.
- Module-level tests for backend boundaries.
- Integration tests for persistence and external adapters.
- API contract tests.
- Event contract tests where applicable.
- Worker lifecycle and failure tests.
- Security-related backend tests required by the approved security model.
- Build, static-analysis, and dependency checks.
- Performance and load tests where required by the applicable milestone.

### 14.3 Rationale

Layered verification provides rapid feedback while preserving confidence in integrated backend behavior.

### 14.4 Consequences

- Tests MUST verify observable behavior and relevant invariants.
- Persistence tests SHOULD validate actual transaction behavior where correctness depends on the database.
- API tests MUST respect the published contract.
- Worker tests MUST cover failure, retry, and shutdown paths where applicable.
- External dependencies SHOULD be replaced with controlled test implementations for unit tests.
- Integration tests MUST remain reproducible.
- Flaky tests MUST be investigated rather than permanently ignored.

### 14.5 Quality Gates

The backend CI pipeline SHOULD validate formatting, static analysis, tests, dependency policy, and production build behavior as applicable.

Mandatory checks MUST have explicit failure conditions.

A bypass MUST be authorized, documented, and limited in scope.

### 14.6 Review Triggers

Review this decision if critical regressions escape repeatedly, integration tests are unreliable, or verification time becomes disproportionate to the value provided.

## 15. BE-ADR-010 — Backend Observability and Performance

**Status:** Proposed  
**Scope:** Backend diagnostics and runtime efficiency

### 15.1 Context

Backend failures can cross module boundaries and external dependencies. Without consistent diagnostics, root-cause analysis becomes slow.

Performance changes made without measurement may optimize the wrong component or weaken correctness.

### 15.2 Proposed Decision

Backend observability SHOULD use consistent structured logging, metrics, and tracing where appropriate to the deployed architecture.

Performance-sensitive decisions SHOULD be supported by representative measurements.

Observability MUST follow the approved security and privacy requirements.

### 15.3 Rationale

Consistent diagnostics improve fault isolation and provide evidence for performance and reliability decisions.

### 15.4 Consequences

- Logs SHOULD contain stable event names and useful contextual fields.
- Sensitive credentials, tokens, and secret values MUST NOT be logged.
- Request or operation correlation SHOULD be preserved across backend boundaries when supported.
- Metrics SHOULD distinguish success, failure, latency, and saturation where meaningful.
- Traces SHOULD identify important dependency boundaries without creating uncontrolled overhead.
- Performance claims SHOULD identify the workload and environment used for measurement.
- Diagnostic retention and access MUST follow the applicable security and operational policies.

### 15.5 Ownership Boundary

This decision covers backend instrumentation and implementation-level performance measurement.

Cloud logging services, infrastructure monitoring, cloud security monitoring, and retention infrastructure belong to `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` and `docs/cloud/architecture/SECURITY_ARCHITECTURE.md`.

Product-level service objectives remain in the relevant product/system documents.

### 15.6 Review Triggers

Review this decision if production incidents cannot be diagnosed reliably, telemetry creates excessive overhead, or measured performance contradicts the assumptions behind the implementation.

## 16. BE-ADR-011 — Coding-Agent Policy and Provider Metadata Services

**Status:** Proposed  
**Scope:** Control Plane implementation of the coding-agent organization policy and provider metadata  
**Implements:** SYS-ADR-007 (`docs/planning/DECISIONS.md`); architecture in `docs/architecture/CODING_AGENT_INTEGRATION.md` Section 8

### 16.1 Context

Organizations need to govern customer use of coding agents in Studio, and Studio needs authoritative provider support data. The Control Plane must not execute, proxy or observe agent sessions.

### 16.2 Proposed Decision

- The organization coding-agent policy MUST be implemented in the B-M01 CONTROL PLANE organization module as a versioned, audited resource that only organization administrators can change.
- Provider metadata MUST be implemented in the B-M03 PLATFORM module as a resource separate from robot platforms, capabilities and resources. Platform compatibility queries MUST NOT return coding-agent providers.
- Neither module may accept source, prompts, transcripts, diffs, file names or paths. Request validation MUST reject unknown fields.
- Policy reads MUST be cacheable by Studio (ETag and `policyVersion`). Policy changes MUST emit an audit event.
- No session telemetry endpoint is implemented. Adding one requires a new decision record.

### 16.3 Rationale

Placing the policy with the organization and the metadata with the platform catalogue reuses existing authorization, audit and caching patterns while keeping coding agents distinct from execution platforms.

### 16.4 Consequences

- New endpoints in `docs/protocol/API_CONTRACT.md` Sections 25.4 and 27.4.
- New persistence in DB-M02 CORE DATA (DB-ADR-011).
- Contract tests prove that payloads containing content fields are rejected.

### 16.5 Review Triggers

Review this decision if server-side enforcement or usage reporting is proposed, or if provider metadata needs per-organization overrides.

## 17. Backend Decision Workflow

### 17.1 Proposal

A proposal MUST identify:

- The affected backend capability.
- The problem or requirement.
- Relevant current architecture.
- Constraints imposed by product/system decisions.
- Material alternatives.
- The proposed option.
- Expected consequences.
- Validation requirements.
- The accountable owner.
- Relevant milestone dependencies.

A proposal MUST distinguish a verified technical constraint from an assumption.

### 17.2 Review

The backend owner responsible for the affected implementation area MUST review the proposal.

Other domain owners SHOULD participate when the decision affects their contracts, implementation responsibilities, or operational assumptions.

A decision that changes product-wide behavior MUST be escalated to `docs/planning/DECISIONS.md`.

### 17.3 Acceptance

A decision MAY be marked Accepted only after approval by the authorized backend owner.

Acceptance MUST identify the selected choice and any material conditions.

A proposal dependent on unresolved product/system approval MUST remain Proposed.

### 17.4 Implementation

Implementation MUST follow the accepted decision or record a justified deviation for review.

The relevant backend architecture document SHOULD be updated to describe the resulting implementation.

The decision record MUST NOT substitute for implementation instructions or task acceptance criteria.

### 17.5 Verification

Verification MUST confirm that the implementation satisfies the decision's stated requirements.

Evidence MAY include tests, measurements, architecture checks, code review, or implementation revision references.

Milestone completion MUST follow the applicable authoritative milestone dossier.

### 17.6 Closure

A decision MAY be marked implemented when the required implementation and validation are complete.

The record SHOULD link to the relevant implementation revision and evidence.

Implementation completion does not prevent a future decision from superseding the choice.

## 18. Relationship to Phases and Milestones

### 18.1 Phase Authority

`docs/planning/PHASES.md` is the canonical source for phase definitions.

This register MUST NOT redefine phase meaning or use phase references to expand milestone scope.

Backend decisions MAY reference phases to indicate applicability or expected delivery context.

### 18.2 Canonical Phases

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

These names MUST be used exactly whenever phases are referenced in this register.

### 18.3 Backend Milestones

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| B-M01 | CONTROL PLANE | P3 |
| B-M02 | ARTIFACT | P2-P3 |
| B-M03 | PLATFORM | P3 |
| B-M04 | BOOKING | P4 |
| B-M05 | EXECUTION | P5 |
| B-M06 | RESULTS | P6-P7 |
| B-M07 | PRODUCTION | P8 |

Backend milestone scope and acceptance MUST be taken from the authoritative dossiers under `docs/backend/milestones/`.

### 18.4 Cross-Domain Milestone References

Backend decisions MAY affect frontend, database, or cloud implementation milestones.

When a decision affects multiple domains, the record SHOULD identify those dependencies and link to the applicable authoritative dossiers.

This register MUST NOT reproduce frontend, database, or cloud milestone scope.

Each domain dossier remains authoritative for its own acceptance criteria.

### 18.5 Milestone Traceability

When a backend decision is required to deliver a milestone, the relevant milestone dossier SHOULD reference the decision ID.

When implementation reveals that an accepted decision must change, the decision record MUST be reviewed through the defined workflow.

A decision's presence in a milestone dossier does not automatically make it Accepted or implemented.

## 19. Change Control and Supersession

### 19.1 Changes to Accepted Decisions

An accepted decision MUST NOT be silently changed to represent a materially different choice.

A material change MUST create a successor decision or use an explicit review process when the decision's identity and historical meaning remain unchanged.

The record MUST preserve the previous decision and explain the change.

### 19.2 Supersession

A superseding decision MUST:

- Have a new stable ID.
- Reference the decision it supersedes.
- Explain why the earlier choice is no longer appropriate.
- State the replacement choice.
- Identify affected backend areas.
- Document migration and compatibility implications.
- Link to updated architecture documents and verification evidence.

The previous record MUST remain available for historical traceability.

### 19.3 Rejected Decisions

A rejected decision MUST remain distinguishable from an accepted decision.

The rejection rationale SHOULD be recorded so that future proposals can reuse the analysis.

A rejected ID MUST NOT be reused.

### 19.4 Withdrawn Decisions

A decision MAY be withdrawn when its context no longer applies and no direct successor is required.

The withdrawal MUST state why the decision is no longer relevant.

### 19.5 Conflicting Records

If a backend implementation document conflicts with an accepted backend decision, the backend owner MUST resolve the inconsistency.

If a backend decision conflicts with a product/system decision, the product/system decision remains authoritative until formally changed.

A copied description in another document MUST NOT override the authoritative decision record.

## 20. Review and Maintenance

### 20.1 Decision Ownership

Every backend decision MUST have an accountable owner.

The owner is responsible for status, rationale, references, and review triggers.

The owner SHOULD ensure that current backend architecture documents reflect the accepted choice without duplicating the complete decision record.

### 20.2 Review Triggers

Backend decisions SHOULD be reviewed when:

- Backend module boundaries change materially.
- A major framework or dependency change is proposed.
- Dependency lifecycle problems recur.
- A published API or event contract changes.
- Transaction or concurrency behavior reveals a correctness issue.
- Worker retry behavior causes duplicate effects or lost work.
- Observability fails to support incident diagnosis.
- A product/system decision changes.
- A milestone dossier identifies a blocker requiring a backend architecture change.

### 20.3 Periodic Review

The backend decision register SHOULD be reviewed at major backend architecture and release checkpoints.

The review SHOULD identify:

- Decisions that remain valid.
- Decisions that need implementation evidence.
- Decisions that should be superseded.
- Proposed decisions that are no longer relevant.
- Implementation deviations requiring formal review.
- Backend implementation concerns that expose a missing product/system decision.

Periodic review MUST NOT become a duplicate review of every implementation detail.

### 20.4 Decision Quality

A backend decision SHOULD be:

- Specific and actionable.
- Narrowly scoped.
- Clear about assumptions.
- Honest about alternatives and trade-offs.
- Verifiable through tests or review.
- Traceable to affected backend architecture.
- Consistent with product/system and protocol contracts.

### 20.5 Exceptions

A deviation from an accepted backend decision MUST be documented when it materially affects architecture, reliability, security, or compatibility.

The exception MUST identify the scope, rationale, owner, and review date.

A temporary deviation MUST NOT silently become the permanent implementation.

## 21. Backend Decision Register Checklist

### 21.1 Ownership

- [ ] Backend-specific decisions are recorded here.
- [ ] Product/system decisions link to `docs/planning/DECISIONS.md`.
- [ ] System backend responsibilities remain in `docs/architecture/BACKEND_ARCHITECTURE.md`.
- [ ] Backend implementation architecture remains in `docs/backend/architecture/BACKEND_ARCHITECTURE.md`.
- [ ] Backend API implementation remains in `docs/backend/architecture/API_IMPLEMENTATION.md`.
- [ ] API, event, and artifact contracts remain in their protocol documents.
- [ ] Database implementation decisions remain with the database architecture owner.
- [ ] Cloud implementation and infrastructure-security decisions remain with the cloud architecture owners.
- [ ] No product-wide decision content has been duplicated.

### 21.2 Record Quality

- [ ] Every accepted decision has a stable ID.
- [ ] Status and date are explicit.
- [ ] Context, decision, rationale, and consequences are recorded.
- [ ] Material alternatives are documented.
- [ ] Affected backend areas are identified.
- [ ] Related decisions and architecture documents are linked.
- [ ] Review triggers are defined.
- [ ] Superseded decisions identify their successors.

### 21.3 Implementation and Verification

- [ ] Accepted decisions are reflected in current backend architecture documents.
- [ ] Required implementation work is traceable.
- [ ] Validation criteria are explicit.
- [ ] Evidence links identify relevant tests or implementation revisions.
- [ ] Deviations are reviewed.
- [ ] External contract compatibility is preserved.
- [ ] Failure handling, observability, and security implications are considered where applicable.

### 21.4 Phase and Milestone Traceability

- [ ] Phase references use the canonical model in `docs/planning/PHASES.md`.
- [ ] Backend milestone identifiers and names use the frozen canonical model.
- [ ] Milestone scope is obtained from authoritative backend milestone dossiers.
- [ ] Cross-domain impacts link to relevant domain dossiers.
- [ ] Milestone acceptance criteria are not duplicated in this register.

## 22. Definition of Done

The backend decision register is ready for ongoing use when:

1. Its backend-only ownership boundary is explicit.
2. Product/system decisions are referenced through `docs/planning/DECISIONS.md`.
3. Backend decisions have stable IDs, statuses, owners, and review triggers.
4. Current backend implementation architecture remains documented in the appropriate architecture documents.
5. API, event, and artifact contracts remain authoritative in their designated documents.
6. Database and cloud implementation choices are not duplicated here.
7. Decision history and supersession relationships remain traceable.
8. Backend milestone scope remains governed by authoritative dossiers.
9. Phase and milestone references use the frozen canonical model.
10. Decisions can be verified without turning this register into a task tracker or implementation manual.

This document owns backend-specific architecture decisions only. Product-wide decisions remain owned by `docs/planning/DECISIONS.md`, and all other domain decisions remain in their respective authoritative registers, architecture documents, contracts, and milestone dossiers. All changes MUST preserve this ownership boundary.
