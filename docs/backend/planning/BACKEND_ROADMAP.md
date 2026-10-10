# Kritva RaaS Backend Roadmap

## 1. Purpose

This document defines the backend engineering roadmap for Kritva RaaS across the seven frozen backend milestones, from control-plane services through production readiness.

It establishes:

- milestone scope and phase mapping
- backend implementation sequence
- upstream and downstream dependencies
- service and API deliverables
- integration boundaries
- architectural risks and mitigations
- milestone exit criteria
- testing and acceptance expectations
- cross-domain integration requirements
- production readiness requirements

This roadmap is the backend sequencing and dependency-planning document. It does not replace detailed milestone specifications, API contracts, protocol documents, database design, or security requirements.

## 2. Canonical References and Governance

### 2.1 Authoritative Sources

| Concern | Authoritative source |
|---|---|
| Canonical phase definitions | `docs/planning/PHASES.md` |
| Program implementation sequence | `docs/planning/IMPLEMENTATION_ROADMAP.md` |
| Cross-domain dependencies | `docs/planning/DEPENDENCY_MAP.md` |
| Release sequencing | `docs/planning/RELEASE_ROADMAP.md` |
| Backend milestone scope | `docs/backend/milestones/` |
| Frontend integration sequence | `docs/frontend/planning/FRONTEND_ROADMAP.md` |
| Database implementation sequence | `docs/database/planning/DATABASE_ROADMAP.md` |
| Cloud implementation sequence | `docs/cloud/planning/CLOUD_ROADMAP.md` |
| API and wire contracts | `docs/protocol/` |
| Security requirements | `docs/security/` |
| Task status | `docs/tracking/TASK_STATUS.md` |
| Milestone status | `docs/tracking/MILESTONE_STATUS.md` |

The milestone dossiers under `docs/backend/milestones/` are authoritative for the detailed scope of their respective milestones. If this roadmap conflicts with an approved dossier, record the discrepancy and resolve it through the project change-control process.

### 2.2 Frozen Backend Milestones

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| B-M01 | CONTROL PLANE | P3 |
| B-M02 | ARTIFACT | P2-P3 |
| B-M03 | PLATFORM | P3 |
| B-M04 | BOOKING | P4 |
| B-M05 | EXECUTION | P5 |
| B-M06 | RESULTS | P6-P7 |
| B-M07 | PRODUCTION | P8 |

Phase names and boundaries are defined exclusively in `docs/planning/PHASES.md`. The mapping above associates backend milestones with the canonical phase model; it does not redefine those phases.

### 2.3 Roadmap Maintenance

The Backend Lead owns roadmap maintenance, dependency clarification, and backend milestone readiness.

Changes to milestone scope require review against the authoritative milestone dossier and all affected contracts.

Changes that affect frontend, database, cloud, security, or release sequencing must be reflected in the relevant planning and tracking documents.

## 3. Backend Engineering Principles

### 3.1 Contract-First Development

Define and review service contracts before implementing cross-domain integrations.

Contracts must specify:

- resource identity
- request and response schemas
- authorization requirements
- validation behavior
- error codes and retryability
- idempotency requirements
- pagination and filtering
- versioning and compatibility
- timestamps and units
- audit requirements
- lifecycle transitions

Implementation must not rely on undocumented behavior in another service.

### 3.2 Durable State Is Authoritative

Durable backend state is authoritative for resources such as projects, artifacts, bookings, Jobs, Runs, Results, and billing or credit records.

In-memory state may support coordination, caching, and performance, but must not silently replace required durable records.

### 3.3 Explicit Lifecycle Models

Each resource must have a documented lifecycle and legal transitions.

Commands and events must not imply that a transition succeeded before the authoritative service confirms it.

A Job represents an orchestration request and its lifecycle. A Run represents an execution attempt. These entities must remain distinct in APIs, storage, events, and user-facing integrations.

### 3.4 Security by Default

Every service must enforce authentication, authorization, tenant isolation, input validation, secret handling, auditability, and safe error reporting.

Frontend checks improve usability but do not replace backend authorization.

### 3.5 Observable and Recoverable Services

Services must expose health, readiness, structured logs, metrics, correlation identifiers, and appropriate operational diagnostics.

Transient failures must be classified so that callers can distinguish retryable failures from permanent validation or authorization errors.

### 3.6 Compatibility and Controlled Change

Changes to APIs, event envelopes, artifact metadata, persistence models, and service configuration must follow the documented compatibility and versioning policy.

Breaking changes require explicit coordination, migration planning, and release approval.

## 4. Milestone Dependency Overview

The backend roadmap follows the frozen milestone model. The implementation order below is a planning sequence, not a change to milestone identifiers or phase boundaries.

| Milestone | Primary dependency | Main consumers |
|---|---|---|
| B-M01 CONTROL PLANE | Identity, organization, and core API contracts | Studio, project workflows, service authorization |
| B-M02 ARTIFACT | Artifact contract and storage foundations | Studio build and upload workflows, execution |
| B-M03 PLATFORM | Platform catalog and capability contracts | Studio target selection, booking, Lab integration |
| B-M04 BOOKING | Platform inventory, availability, and credit contracts | Studio booking, execution eligibility |
| B-M05 EXECUTION | Approved artifacts, bookings, platform and execution contracts | Studio execution, Lab Agent, live sessions |
| B-M06 RESULTS | Execution records, event contracts, storage and telemetry integration | Studio live views and Results |
| B-M07 PRODUCTION | Accepted services, security evidence, operational controls | Production deployment and supported product workflows |

### 4.1 Logical Dependency Sequence

The expected logical sequence is:

1. Establish identity, organization, authorization, and shared API conventions.
2. Establish artifact registration, validation, integrity, and storage behavior.
3. Establish platform identity, capabilities, and availability information.
4. Establish booking, reservation, and credit operations.
5. Establish Job and Run orchestration and execution controls.
6. Establish Lab integration, telemetry, and durable Results.
7. Complete production qualification, operational readiness, and security acceptance.

B-M02 ARTIFACT may be implemented in parallel with B-M01 CONTROL PLANE when shared API, authorization, storage, and database contracts are stable. B-M03 PLATFORM may also proceed in parallel with artifact implementation when its own contracts and persistence dependencies are ready.

A milestone may not be accepted merely because another milestone has started. Acceptance depends on its own exit criteria and the completion or approved substitution of required dependencies.

## 5. B-M01 CONTROL PLANE

Phase mapping: P3.

Authoritative scope: the B-M01 CONTROL PLANE dossier under `docs/backend/milestones/`.

### 5.1 Objective

Provide the shared backend foundation for identity-aware API access, organization context, project operations, service-level authorization, and consistent API behavior.

### 5.2 Core Deliverables

- API routing and version conventions
- authentication integration
- session and identity context
- organization and membership access
- project metadata operations
- common request and response envelopes
- standard error mapping
- authorization middleware
- request correlation and audit integration
- health and readiness endpoints
- contract and integration tests

### 5.3 Dependency Requirements

**Upstream dependencies**

- `DB-M01 FOUNDATION`
- `C-M01 FOUNDATION`
- approved identity and session contracts
- agreed API envelope and error conventions

**Downstream consumers**

- `B-M02 ARTIFACT`
- `B-M03 PLATFORM`
- `B-M04 BOOKING`
- `B-M05 EXECUTION`
- frontend F-M01 STUDIO FOUNDATION
- frontend F-M02 PROJECTS

### 5.4 Principal Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Inconsistent authorization | Cross-organization data exposure | Centralize policy enforcement and test negative access cases |
| Inconsistent API errors | Fragile clients and poor recovery behavior | Standardize error envelopes and contract tests |
| Identity-provider coupling | Difficult testing and provider changes | Define an internal identity boundary |
| Missing audit events | Weak incident investigation | Identify mandatory auditable actions early |
| Project ownership ambiguity | Incorrect access decisions | Define organization and project ownership rules |

### 5.5 Exit Criteria

- Authentication and identity context are integrated.
- Organization and project access are authorization-enforced.
- Shared API conventions are documented and tested.
- Health and readiness behavior is defined.
- Error responses are consistent across representative endpoints.
- Tenant-isolation tests cover permitted and denied access.
- Correlation identifiers support request tracing.
- Security review findings are resolved or explicitly block acceptance.
- Downstream services can consume the approved shared contracts.

## 6. B-M02 ARTIFACT

Phase mapping: P2-P3.

Authoritative scope: the B-M02 ARTIFACT dossier under `docs/backend/milestones/`.

### 6.1 Objective

Provide a secure artifact registration and management service for approved build outputs. The service must distinguish local project source from remotely registered artifacts and accept only authorized, validated packages.

### 6.2 Core Deliverables

- artifact resource model
- artifact manifest validation
- upload initiation and completion contracts
- authorized object-storage integration
- checksum and integrity verification
- optional signature verification where required by policy
- artifact compatibility metadata
- artifact listing and detail APIs
- artifact lifecycle and validation status
- retention and deletion policy integration
- audit events for upload and state changes

### 6.3 Dependency Requirements

**Upstream dependencies**

- `DB-M01 FOUNDATION`
- `C-M01 FOUNDATION`
- `C-M02 DEVELOPMENT`
- shared API and authorization contracts from B-M01 where available
- artifact manifest and package-format specifications

**Downstream consumers**

- frontend F-M03 BUILD & ARTIFACT
- B-M05 EXECUTION
- platform compatibility validation
- storage and audit operations

### 6.4 Principal Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Malformed or malicious packages | Service or execution compromise | Validate manifest and package structure; enforce size and content limits |
| Incorrect tenant ownership | Artifact exposure | Enforce organization and project access on every operation |
| Integrity validation gaps | Execution of modified content | Verify checksums and required signatures before approval |
| Uncontrolled upload retry | Duplicate records or wasted storage | Use idempotency and explicit upload-session states |
| Source leakage | Unintended disclosure of project source | Enforce package allowlists and privacy regression tests |
| Storage lifecycle mismatch | Broken downloads or orphaned objects | Reconcile metadata and object storage; test retention behavior |

### 6.5 Exit Criteria

- Artifact schemas and manifest rules are documented.
- Upload initiation and completion are authorization-enforced.
- Package validation rejects malformed or unsupported artifacts.
- Integrity checks are enforced before an artifact reaches an approved state.
- Artifact metadata and object storage remain consistent.
- Listing and detail APIs expose authoritative state.
- Idempotent retries and interrupted uploads are tested.
- Audit events cover security-relevant artifact transitions.
- Retention and deletion behavior is defined.
- Frontend integration can use stable contracts without privileged storage access.

## 7. B-M03 PLATFORM

Phase mapping: P3.

Authoritative scope: the B-M03 PLATFORM dossier under `docs/backend/milestones/`.

### 7.1 Objective

Provide a consistent backend model of supported robotic platforms, platform versions, capabilities, compatibility constraints, and resource identity.

### 7.2 Core Deliverables

- platform catalog
- platform and version identity
- capability metadata
- artifact compatibility checks
- resource identity and status contracts
- platform availability inputs
- Lab Agent registration and identity contracts where included in the dossier
- platform listing and detail APIs
- resource health and readiness reporting
- audit and operational events

### 7.3 Dependency Requirements

**Upstream dependencies**

- `DB-M01 FOUNDATION`
- `DB-M02 CORE DATA`
- `C-M02 DEVELOPMENT`
- shared API, identity, and authorization conventions
- approved platform and capability schemas

**Downstream consumers**

- frontend F-M02 PROJECTS
- frontend F-M04 BOOKING
- B-M04 BOOKING
- B-M05 EXECUTION
- B-M06 RESULTS
- Lab Agent and resource integrations

### 7.4 Principal Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Inconsistent platform identity | Incorrect scheduling or execution | Use stable identifiers and explicit versioning |
| Capability metadata drift | Incompatible artifacts or unsafe operation | Validate catalog updates and maintain compatibility rules |
| Stale resource state | Incorrect availability decisions | Timestamp observations and expose freshness |
| Lab connectivity ambiguity | False readiness claims | Separate registered, connected, ready, and unhealthy states |
| Platform-specific assumptions | Reduced extensibility | Define shared contracts and explicit capability extensions |

### 7.5 Exit Criteria

- Platform and version identities are stable.
- Catalog APIs are documented and authorization-enforced.
- Capability metadata has defined validation rules.
- Compatibility checks produce structured outcomes.
- Resource status includes freshness and error information.
- Lab identity and connectivity behavior is defined where in scope.
- Frontend and booking integrations use the approved catalog contracts.
- Tests cover unsupported platforms, stale status, and malformed metadata.

## 8. B-M04 BOOKING

Phase mapping: P4.

Authoritative scope: the B-M04 BOOKING dossier under `docs/backend/milestones/`.

### 8.1 Objective

Provide authoritative booking and resource-reservation operations, including availability, quote validation, credit accounting integration, reservation lifecycle, cancellation, and auditability.

### 8.2 Core Deliverables

- availability query APIs
- reservation-window validation
- booking creation and retrieval
- booking lifecycle and status transitions
- server-generated quotes
- credit balance and consumption integration
- idempotency and conflict handling
- cancellation and refund-status contracts
- concurrency-safe reservation operations
- audit events and operational metrics

### 8.3 Dependency Requirements

**Upstream dependencies**

- `B-M01 CONTROL PLANE`
- `B-M03 PLATFORM`
- `DB-M03 BOOKING DATA`
- `C-M03 STAGING`
- approved booking, availability, and credit contracts

**Downstream consumers**

- frontend F-M04 BOOKING
- B-M05 EXECUTION
- reporting and audit consumers

### 8.4 Principal Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Concurrent booking conflicts | Double reservation | Use transactional conflict checks and concurrency tests |
| Quote drift | Unexpected credit consumption | Enforce quote validity and server-side recalculation |
| Duplicate submissions | Duplicate bookings or charges | Require idempotency for applicable operations |
| Inconsistent cancellation | Incorrect resource or credit state | Define atomic transitions and explicit refund status |
| Time-zone errors | Wrong reservation windows | Store canonical timestamps and define display conventions |
| Credit inconsistency | Incorrect balance or over-consumption | Use transactional accounting records and reconciliation |

### 8.5 Exit Criteria

- Availability responses identify freshness and relevant constraints.
- Booking creation is concurrency-safe.
- Idempotency behavior is tested.
- Quotes and credit estimates are authoritative server outputs.
- Booking lifecycle transitions are documented and validated.
- Cancellation and refund outcomes are explicit.
- Booking and credit records remain consistent under failure.
- Audit records support reconciliation.
- Frontend booking flows can use stable contracts.
- Execution eligibility can reliably validate booking state.

## 9. B-M05 EXECUTION

Phase mapping: P5.

Authoritative scope: the B-M05 EXECUTION dossier under `docs/backend/milestones/`.

### 9.1 Objective

Provide secure, durable orchestration of execution requests and execution attempts, integrating approved artifacts, bookings, platform capabilities, and execution resources.

### 9.2 Core Deliverables

- execution eligibility evaluation
- Job creation and retrieval
- Run creation and lifecycle
- explicit Job-to-Run relationships
- command validation and authorization
- scheduling and dispatch integration
- start, stop, and cancellation semantics
- idempotency and duplicate-command protection
- execution events and durable state reconciliation
- failure classification and retry policy
- audit and execution correlation

### 9.3 Dependency Requirements

**Upstream dependencies**

- `B-M01 CONTROL PLANE`
- `B-M02 ARTIFACT`
- `B-M03 PLATFORM`
- `B-M04 BOOKING`
- `DB-M04 EXECUTION DATA`
- `C-M03 STAGING`
- approved Job, Run, and execution-command contracts

**Downstream consumers**

- frontend F-M05 EXECUTION
- frontend F-M06 LIVE
- B-M06 RESULTS
- Lab Agent and runtime integration

### 9.4 Principal Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Duplicate dispatch | Multiple execution attempts | Use idempotency, durable dispatch records, and reconciliation |
| Incorrect lifecycle transitions | Misleading status or unsafe operations | Define legal transitions and enforce them in the owning service |
| Job and Run conflation | Lost attempt history and ambiguous status | Maintain separate identities, schemas, and lifecycle contracts |
| Lost execution events | Stale frontend state | Persist state changes and support reconciliation queries |
| Unclear stop semantics | False safety confidence | Document command acceptance separately from confirmed outcome |
| Resource loss during execution | Orphaned or inconsistent Runs | Define lease, timeout, and recovery behavior |
| Authorization gaps | Unauthorized execution | Revalidate user, artifact, booking, and resource permissions server-side |

### 9.5 Exit Criteria

- Execution eligibility is checked using authoritative state.
- Job and Run are separate durable entities.
- Creation and command endpoints enforce authorization and idempotency.
- Legal lifecycle transitions are tested.
- Dispatch and recovery behavior is documented.
- State changes can be reconciled after event loss or reconnect.
- Stop and cancellation outcomes are not overstated.
- Failure classification supports appropriate recovery.
- Execution audit trails include correlation identifiers.
- Integration tests cover artifact, booking, platform, and runtime failures.

## 10. B-M06 RESULTS

Phase mapping: P6-P7.

Authoritative scope: the B-M06 RESULTS dossier under `docs/backend/milestones/`.

### 10.1 Objective

Provide durable Results, execution telemetry integration, live-session support, log access, result files, metrics, experiments, and comparisons, consistent with the approved API contracts.

### 10.2 Core Deliverables

- Result resource and lifecycle
- Job and Run association
- durable result metadata
- authorized result-file access
- telemetry ingestion or integration
- live-session coordination
- WebSocket event distribution where required
- WebRTC signaling integration where required
- log access and retention behavior
- metrics schemas and validation
- experiment and comparison APIs
- retention and archival integration

### 10.3 Dependency Requirements

**Upstream dependencies**

- `B-M05 EXECUTION`
- `B-M03 PLATFORM`
- `DB-M04 EXECUTION DATA`
- `C-M03 STAGING`
- approved Result, telemetry, log, live-session, and download contracts

**Downstream consumers**

- frontend F-M06 LIVE
- frontend F-M07 RESULTS
- operational diagnostics
- experiment and analysis workflows

### 10.4 Principal Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Result not aligned with Run | Incorrect analysis and audit history | Enforce explicit immutable Job and Run references |
| Telemetry overload | Increased latency or dropped observations | Apply bounded ingestion, backpressure, and retention policies |
| Stale live data | Misleading operational view | Include timestamps, freshness, and connection status |
| Unauthorized file access | Data exposure | Use scoped authorization and short-lived download access where appropriate |
| WebSocket event loss | Incomplete live state | Reconcile against durable APIs |
| Media-session failure | Degraded observation | Separate media status from execution lifecycle |
| Metric schema drift | Invalid comparisons | Version metric definitions and validate compatibility |
| Excessive retention cost | Unbounded storage growth | Define lifecycle and retention policy explicitly |

### 10.5 Exit Criteria

- Results are durably associated with the correct Job and Run.
- Result listing and detail APIs are authorization-enforced.
- File access follows the approved security model.
- Telemetry and logs have defined schemas and retention rules.
- Live sessions distinguish media state from execution state.
- Event loss can be recovered through reconciliation.
- Metrics include documented units and compatibility rules.
- Experiment and comparison behavior is contract-tested.
- Retention and archival behavior is validated.
- Frontend live and Results workflows pass integration tests.

## 11. B-M07 PRODUCTION

Phase mapping: P8.

Authoritative scope: the B-M07 PRODUCTION dossier under `docs/backend/milestones/`.

### 11.1 Objective

Qualify backend services for supported production deployment, including security, reliability, operational readiness, data protection, release controls, and incident recovery.

### 11.2 Core Deliverables

- production configuration and secret handling
- service identity and least-privilege access
- security review and remediation
- deployment and migration compatibility
- service health and readiness checks
- metrics, logs, traces, and alerts
- backup and recovery procedures
- capacity and load qualification
- rate limiting and abuse protection
- operational runbooks
- incident and rollback procedures
- release evidence and acceptance records

### 11.3 Dependency Requirements

**Upstream dependencies**

- accepted backend milestones B-M01 through B-M06
- `DB-M01 FOUNDATION`
- `DB-M02 CORE DATA`
- `DB-M03 BOOKING DATA`
- `DB-M04 EXECUTION DATA`
- `C-M04 PRODUCTION`
- approved security, release, and operational requirements

**Downstream consumers**

- production deployment
- supported customer workflows
- production support and incident response

### 11.4 Principal Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Configuration drift | Unpredictable production behavior | Validate configuration and use controlled promotion |
| Secret exposure | Unauthorized access | Use managed secret handling and rotation |
| Migration failure | Data loss or service interruption | Test backup, migration, rollback, and recovery procedures |
| Inadequate capacity | Degraded service during load | Load-test critical paths and define capacity thresholds |
| Incomplete observability | Slow incident diagnosis | Define service-level signals and alert ownership |
| Unverified rollback | Extended outages | Exercise rollback and recovery procedures |
| Unresolved security findings | Production exposure | Enforce risk-based release gates and documented approval |

### 11.5 Exit Criteria

- Required upstream milestones are accepted.
- Security review is complete and blocking findings are resolved.
- Production configuration and secret handling are validated.
- Database migration and recovery procedures are tested.
- Critical service-level indicators and alerts are operational.
- Load and resilience qualification meets agreed thresholds.
- Incident, escalation, and rollback runbooks are reviewed.
- Release compatibility is verified across services and clients.
- Production approval evidence is recorded.
- Known limitations and residual risks have explicit owners.

## 12. Cross-Domain Integration Plan

### 12.1 Frontend Integration

The frontend consumes published backend contracts. Frontend code must not bypass backend authorization, infer successful state transitions from a submitted command, or access internal persistence directly.

| Frontend milestone | Backend dependency | Integration objective |
|---|---|---|
| F-M01 STUDIO FOUNDATION | B-M01 CONTROL PLANE | Identity, session, organization, and shared API behavior |
| F-M02 PROJECTS | B-M01 CONTROL PLANE; B-M03 PLATFORM | Project metadata and platform catalog |
| F-M03 BUILD & ARTIFACT | B-M02 ARTIFACT; B-M03 PLATFORM | Artifact registration, validation, and compatibility |
| F-M04 BOOKING | B-M03 PLATFORM; B-M04 BOOKING | Availability, quotes, booking, and credit status |
| F-M05 EXECUTION | B-M04 BOOKING; B-M05 EXECUTION | Eligibility, Job and Run state, and commands |
| F-M06 LIVE | B-M05 EXECUTION; B-M06 RESULTS | Live sessions, telemetry, logs, and media signaling |
| F-M07 RESULTS | B-M05 EXECUTION; B-M06 RESULTS | Results, files, metrics, experiments, comparisons, and reruns |

### 12.2 Database Integration

Database changes must be coordinated with the corresponding backend milestone.

| Database milestone | Backend integration |
|---|---|
| DB-M01 FOUNDATION | Shared identity, tenant, and persistence foundations |
| DB-M02 CORE DATA | B-M01 CONTROL PLANE; B-M02 ARTIFACT; B-M03 PLATFORM |
| DB-M03 BOOKING DATA | B-M04 BOOKING |
| DB-M04 EXECUTION DATA | B-M05 EXECUTION; B-M06 RESULTS |

Database constraints and transaction boundaries must enforce invariants that cannot safely depend on client behavior.

### 12.3 Cloud Integration

| Cloud milestone | Backend integration |
|---|---|
| C-M01 FOUNDATION | Environment, network, identity, and secret foundations |
| C-M02 DEVELOPMENT | Development service deployment and integration testing |
| C-M03 STAGING | Booking, execution, Lab, live, and Results qualification |
| C-M04 PRODUCTION | Production deployment, operational controls, and recovery |

Environment-specific configuration must be externalized. Production credentials must not be committed to source control or embedded in frontend assets.

### 12.4 Protocol Integration

The backend must publish and maintain contracts for:

- API versioning and response envelopes
- authentication and authorization errors
- project and platform resources
- artifact manifests and upload sessions
- availability, booking, and credit operations
- Job and Run lifecycles
- execution commands and events
- Lab status and resource health
- live sessions, telemetry, and logs
- Results, files, metrics, experiments, and comparisons
- idempotency, pagination, timestamps, and error codes

A missing contract is a tracked dependency, not permission to invent incompatible behavior independently in each consumer.

## 13. Testing Strategy

### 13.1 Unit Tests

Test domain validation, lifecycle transitions, authorization decisions, error mapping, compatibility checks, and idempotency behavior in isolation.

### 13.2 Contract Tests

Validate request and response schemas, error envelopes, lifecycle values, versioning, and event payloads against approved contracts.

Contract tests should run in CI for both provider and consumer changes where practical.

### 13.3 Integration Tests

Exercise interactions with databases, object storage, identity providers, resource registries, queues, event delivery, and external runtime interfaces.

Use deterministic test doubles for unavailable dependencies, but do not treat mock-only success as sufficient evidence of real integration readiness.

### 13.4 Security Tests

Include:

- unauthenticated request rejection
- cross-organization access denial
- permission escalation attempts
- malformed and oversized input
- artifact integrity failures
- unauthorized download attempts
- replay and duplicate-command handling
- secret and sensitive-data redaction
- rate limiting and abuse controls

### 13.5 Resilience Tests

Test interrupted requests, duplicate events, storage failures, database conflicts, transient network errors, stale resource state, and service restart recovery.

Verify that durable state remains authoritative and that retries do not create unintended duplicate operations.

### 13.6 End-to-End Tests

Validate representative workflows across the frontend, backend, database, cloud environment, and available Lab or Robot integrations.

End-to-end acceptance must include failure paths and authorization checks, not only the successful path.

## 14. Milestone Readiness and Acceptance

A backend milestone is ready for implementation when:

- [ ] Its authoritative dossier is available.
- [ ] Scope and exclusions are explicit.
- [ ] Upstream contracts are available or tracked as blockers.
- [ ] Database and cloud dependencies are identified.
- [ ] Security and privacy requirements are understood.
- [ ] Acceptance criteria are testable.
- [ ] Owners are assigned to major deliverables.

A backend milestone is accepted when:

- [ ] All required deliverables are implemented.
- [ ] Unit tests pass.
- [ ] Contract tests pass.
- [ ] Integration tests pass.
- [ ] Security requirements are satisfied.
- [ ] Operational diagnostics are available where required.
- [ ] Failure and recovery behavior is tested.
- [ ] Documentation is current.
- [ ] Known limitations and residual risks are recorded.
- [ ] Required downstream integration evidence is available.
- [ ] The milestone status is updated in the tracking system.

## 15. Critical Path and Parallel Work

### 15.1 Critical Dependencies

The primary product workflow requires:

1. B-M01 CONTROL PLANE for shared identity, authorization, and API behavior.
2. B-M02 ARTIFACT for approved artifact registration and integrity.
3. B-M03 PLATFORM for target and resource identity.
4. B-M04 BOOKING for authoritative reservation and credit state.
5. B-M05 EXECUTION for Job and Run orchestration.
6. B-M06 RESULTS for durable outcomes and live observation.
7. B-M07 PRODUCTION for production qualification and operational acceptance.

The exact schedule depends on contract readiness, database work, cloud environment availability, security review, and integration results.

### 15.2 Parallelizable Work

The following work may proceed in parallel when contracts and ownership are stable:

- B-M01 shared API work and B-M02 artifact-domain implementation
- B-M02 artifact validation and B-M03 platform catalog implementation
- database schema development and provider contract tests
- frontend screen scaffolding and backend contract-driven implementation
- operational observability foundations and domain service development
- security test preparation and implementation of agreed controls

Parallel development must not create competing definitions for shared schemas or lifecycle semantics.

### 15.3 Integration Gates

Use integration gates when a deliverable becomes a prerequisite for another domain:

- shared API and identity contracts before broad service integration
- artifact manifest and integrity rules before artifact upload acceptance
- platform capability contracts before booking compatibility acceptance
- booking and credit invariants before execution eligibility acceptance
- Job and Run lifecycle contracts before execution UI acceptance
- event reconciliation contracts before live-state acceptance
- Result and file-access contracts before Results workflow acceptance
- security and operational evidence before production acceptance

## 16. Risk Management

Maintain a risk register linked to the milestone and task that owns each mitigation.

Each risk record should include:

- unique risk identifier
- affected milestone
- probability and impact
- trigger or early-warning indicator
- mitigation action
- contingency plan
- accountable owner
- target resolution date
- residual risk and acceptance authority

Risks involving authorization, tenant isolation, artifact integrity, credit consistency, execution lifecycle correctness, safety-state presentation, or data loss must be treated as release-relevant.

A risk cannot be closed merely because a workaround exists. Closure requires evidence that the failure mode is mitigated or an explicitly approved decision documenting the residual exposure.

## 17. Roadmap Change Control

Changes to this roadmap must preserve the frozen phase and milestone identifiers.

For every material change, record:

- reason for change
- affected milestone and phase
- affected contracts
- upstream and downstream dependencies
- estimate and schedule impact
- security and privacy implications
- acceptance impact
- reviewer and decision
- required updates to milestone dossiers and tracking documents

Do not redefine phase boundaries in this file. Refer to `docs/planning/PHASES.md`.

Do not duplicate detailed milestone acceptance requirements. Refer to the authoritative dossier under `docs/backend/milestones/`.

## 18. Backend Roadmap Acceptance Checklist

- [ ] B-M01 CONTROL PLANE is represented with phase P3.
- [ ] B-M02 ARTIFACT is represented with phase mapping P2-P3.
- [ ] B-M03 PLATFORM is represented with phase P3.
- [ ] B-M04 BOOKING is represented with phase P4.
- [ ] B-M05 EXECUTION is represented with phase P5.
- [ ] B-M06 RESULTS is represented with phase mapping P6-P7.
- [ ] B-M07 PRODUCTION is represented with phase P8.
- [ ] Every milestone includes objectives, deliverables, dependencies, risks, and exit criteria.
- [ ] Frontend integration points use canonical frontend milestone names.
- [ ] Database integration points use canonical database milestone names.
- [ ] Cloud integration points use canonical cloud milestone names.
- [ ] Protocol dependencies are explicit.
- [ ] Security and operational readiness are represented.
- [ ] Job and Run are treated as distinct entities.
- [ ] Durable backend state is authoritative.
- [ ] Production qualification has explicit evidence requirements.
- [ ] `docs/planning/PHASES.md` remains the canonical phase definition.
- [ ] Milestone dossiers remain authoritative for detailed milestone scope.

## 19. Final Invariants

1. The canonical phase model is defined only in `docs/planning/PHASES.md`.
2. The frozen backend milestones are B-M01 through B-M07 with the names and mappings specified in this roadmap.
3. The milestone dossiers under `docs/backend/milestones/` are authoritative for detailed milestone scope.
4. Backend authorization is enforced by services, not trusted to frontend behavior.
5. Durable records are authoritative for domain state.
6. Artifact approval requires the applicable validation and integrity checks.
7. Platform identity and capability metadata have explicit contracts.
8. Booking and credit operations enforce consistency under concurrency and retry.
9. Job and Run remain separate entities with distinct lifecycle semantics.
10. Execution commands and outcomes are represented accurately.
11. Live observation is separated from execution control.
12. Results preserve their association with the original execution records.
13. Cross-domain dependencies are tracked and verified.
14. Security, resilience, observability, and recovery are acceptance concerns.
15. Production readiness requires explicit evidence and approval.

## 20. Changelog

### Current Baseline

- Established the consolidated backend roadmap for B-M01 through B-M07.
- Aligned all backend milestone names and phase mappings with the frozen canonical model.
- Delegated phase definitions to `docs/planning/PHASES.md`.
- Delegated detailed milestone scope to authoritative backend milestone dossiers.
- Added cross-domain dependencies for frontend, database, cloud, and protocol work.
- Added risks, mitigations, and exit criteria for every backend milestone.
- Added testing, integration, production-readiness, and change-control guidance.

### Future Updates

For each approved roadmap update, record:

- date
- affected milestone
- affected phase
- change summary
- dependency impact
- risk impact
- acceptance impact
- review status
