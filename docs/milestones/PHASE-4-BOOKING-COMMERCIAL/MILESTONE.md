# P4 BOOKING & COMMERCIAL — Milestone Dossier

**Primary Phase:** P4 BOOKING & COMMERCIAL

**Supporting Phases:** P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE; P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS; P8 PRODUCTION

**Document Type:** Phase-level milestone dossier

**Status:** Planning baseline

**Scope Authority:** This document defines the outcomes, boundaries, dependencies, deliverables, risks, and exit criteria for P4 BOOKING & COMMERCIAL. The milestone dossiers under `docs/**/milestones/` are authoritative for their respective milestone scopes.

---

## Ownership and Boundaries

### What this document owns

This document owns the phase-level definition of P4 BOOKING & COMMERCIAL, including:

- The objective and intended outcomes of P4.
- The in-scope and explicitly excluded capabilities.
- Dependencies on completed or required capabilities from other phases.
- Cross-domain deliverables required to establish resource and commercial workflows.
- Phase-level risks and mitigations.
- Conditions required to declare P4 complete.
- The ownership boundaries and handoffs between booking, resource management, availability, credits, and commercial workflows and the systems that support them.

P4 BOOKING & COMMERCIAL establishes the ability to describe bookable resources, determine their availability, create and manage bookings, and enforce the agreed commercial and credit rules associated with those bookings.

### What this document does not own

This document does not define detailed task breakdowns, implementation instructions, test-case inventories, review procedures, change histories, or Git commands.

Those responsibilities belong to the sibling files:

- [`TASKS.md`](TASKS.md) — phase task decomposition, sequencing, and ownership.
- [`ACCEPTANCE_CRITERIA.md`](ACCEPTANCE_CRITERIA.md) — detailed, verifiable acceptance conditions.
- [`REVIEW_CHECKLIST.md`](REVIEW_CHECKLIST.md) — reviewer checks and evidence requirements.
- [`CHANGELOG.md`](CHANGELOG.md) — milestone changes and accepted updates.
- [`GIT_COMMIT_STEP.md`](GIT_COMMIT_STEP.md) — repository and commit procedure.

This document also does not replace domain architecture, protocol specifications, implementation guides, security policies, testing strategy, release procedures, or the authoritative milestone dossiers for other phases.

### Ownership map

| Concern | Owner | P4 relationship |
|---|---|---|
| Canonical phase definitions | `docs/planning/PHASES.md` | Uses the frozen phase model |
| System-level decisions | `docs/planning/DECISIONS.md` | Consumes approved product and system decisions |
| System architecture and cross-domain boundaries | `docs/architecture/` | Follows defined subsystem responsibilities |
| Frontend implementation | `docs/frontend/` | Defines the user-facing booking workflow requirements through the applicable frontend milestone |
| Backend implementation | `docs/backend/` | Defines the booking services and API behavior through the applicable backend milestone |
| Database implementation | `docs/database/` | Defines persistence implementation through the applicable database milestone |
| Cloud infrastructure | `docs/cloud/` | Defines deployment and infrastructure concerns through the applicable cloud milestone |
| API wire contract | `docs/protocol/API_CONTRACT.md` | Uses the agreed API contract |
| Security architecture | `docs/architecture/SECURITY_ARCHITECTURE.md` and `docs/security/` | Uses the established authentication, authorization, and trust model |
| Global development workflow | `docs/development/` | Follows shared engineering policy |
| Global testing strategy | `docs/development/TESTING_STRATEGY.md` | Follows shared verification policy |
| Global release process | `docs/development/RELEASE_PROCESS.md` | Follows shared release policy |
| P4 phase outcomes and boundaries | This document | Authoritative at phase level |
| P4 tasks and sequencing | `TASKS.md` | Authoritative for task decomposition |
| P4 acceptance conditions | `ACCEPTANCE_CRITERIA.md` | Authoritative for detailed acceptance |
| P4 review and evidence checks | `REVIEW_CHECKLIST.md` | Authoritative for review execution |
| P4 change history | `CHANGELOG.md` | Authoritative for milestone history |
| P4 Git procedure | `GIT_COMMIT_STEP.md` | Authoritative for commit procedure |

If a detailed implementation question is not answered by this dossier, consult the owner document rather than expanding the phase dossier into a second specification.

---

## 1. Objective

P4 BOOKING & COMMERCIAL establishes the resource and commercial capabilities required for a user to discover eligible resources, evaluate availability, reserve resources for a defined period, and understand the credit or commercial consequences of the reservation.

The phase connects the project and platform capabilities established by P3 CONTROL PLANE with the execution capabilities established by P5 EXECUTION. It introduces the reservation boundary between a user's intent to use a resource and the later process that may execute work on that resource.

The phase must make booking behavior explicit, consistent, auditable, and safe under concurrent requests. It must prevent conflicting reservations, avoid duplicate commercial effects, enforce authorization and eligibility, and provide enough durable state for downstream execution to determine whether a valid booking exists.

### 1.1 Primary outcomes

P4 is intended to establish the following outcomes:

1. A consistent resource model identifies resources that may be offered for booking.
2. Resource eligibility and bookability can be determined using explicit rules.
3. Availability can be queried over a defined time interval.
4. Availability results distinguish a candidate resource from a confirmed reservation.
5. A booking can be created only when the caller is authorized and the required conditions are satisfied.
6. Concurrent booking attempts cannot silently create conflicting reservations.
7. A booking has a defined lifecycle and durable identity.
8. Booking changes, cancellations, and expirations follow explicit rules.
9. Credit balances and credit movements are handled through a consistent commercial contract.
10. Booking-related credit operations are protected against duplicate processing.
11. The user can inspect booking status and the relevant commercial information.
12. Authorized services can retrieve the booking information needed by P5 EXECUTION.
13. Booking activity produces auditable records and useful operational outcomes.
14. Failure paths preserve resource and commercial consistency.
15. The interfaces and persisted records support the subsequent phases without coupling booking logic to execution internals.

### 1.2 Product outcome

A user should be able to select an eligible resource, request an available interval, review the commercial implications, and obtain a durable booking result.

A successful booking must mean that the system has accepted the reservation according to the defined rules. It must not merely mean that an availability query returned a candidate or that a frontend request was submitted.

The product experience should make the distinction clear between:

- A resource being registered.
- A resource being eligible for use.
- A resource appearing available for a requested interval.
- A booking being requested.
- A booking being confirmed.
- A booking being changed, cancelled, or expired.
- A booking being eligible for downstream execution.

P4 owns the booking and commercial meaning of these states. Other documents define their implementation and any additional lifecycle state owned by other subsystems.

### 1.3 Engineering outcome

The phase must establish a coherent contract across the frontend, backend, database, and cloud deployment domains without allowing any one implementation to become the sole source of truth for business behavior.

The booking service and durable persistence layer must enforce the critical invariants. The frontend may improve usability and present availability, but it must not be trusted to enforce authorization, prevent conflicts, or calculate authoritative credit effects.

Commercial state must be durable and auditable. Resource reservations must remain consistent when requests are retried, concurrent requests arrive, services fail, or clients lose connectivity.

### 1.4 Completion principle

P4 is complete when its agreed booking and commercial capabilities are implemented, validated, reviewed, and integrated with the phase boundaries defined here.

A user-interface demonstration alone is insufficient. A booking workflow that lacks concurrency protection, durable state, authorization enforcement, or reliable credit handling is not complete.

The detailed evidence and task-level acceptance conditions are owned by `ACCEPTANCE_CRITERIA.md` and `REVIEW_CHECKLIST.md`.

---

## 2. Scope and non-scope

### 2.1 In-scope capabilities

P4 includes the following phase-level capabilities.

#### 2.1.1 Resource catalogue for booking

- Define the booking-facing representation of a resource.
- Identify the resource owner or managing subsystem.
- Identify resource type, stable identity, and relevant descriptive metadata.
- Represent whether a resource is enabled for booking.
- Represent eligibility and booking restrictions.
- Support resource discovery and filtering where required by the product.
- Expose sufficient resource information for availability queries.
- Define how resource lifecycle changes affect future booking requests.
- Prevent retired, disabled, or ineligible resources from receiving new bookings.
- Preserve references to resources associated with existing bookings.

The catalogue is a booking-facing view of resource information. P4 does not become the authority for hardware inventory, platform provisioning, robot telemetry, or physical-device configuration.

#### 2.1.2 Resource eligibility

- Determine whether a resource is eligible for a requested booking.
- Apply resource-level restrictions.
- Apply caller authorization and applicable workspace or project boundaries.
- Validate required booking parameters.
- Reject requests for resources that are unknown, disabled, unavailable, or otherwise ineligible.
- Define the conditions that must remain true when a booking is confirmed.
- Handle resources whose eligibility changes while a booking request is being processed.
- Ensure downstream consumers can distinguish a valid booking from a mere availability candidate.

Eligibility checks must be enforced by trusted services. A client-side eligibility indicator is informational and cannot authorize a booking.

#### 2.1.3 Availability queries

- Accept a resource or supported resource-selection criteria.
- Accept a requested start and end time or another explicitly defined interval representation.
- Validate interval boundaries and temporal constraints.
- Identify reservations that conflict with the requested interval.
- Account for configured booking rules, resource eligibility, and applicable capacity limits.
- Return availability results with clear semantics.
- Communicate the difference between unavailable, eligible-but-unconfirmed, and confirmed states.
- Support appropriate filtering and pagination when the catalogue requires them.
- Avoid exposing reservations or workspace information that the caller is not authorized to see.
- Make availability calculations consistent with the booking service's authoritative reservation rules.

Availability is a query result, not a reservation guarantee. A resource can become unavailable between a query and a booking request. Confirmation must therefore revalidate availability within the authoritative booking transaction or equivalent consistency boundary.

#### 2.1.4 Booking creation

- Accept a booking request for an eligible resource.
- Validate caller identity and authorization.
- Validate the requested interval, resource, project or workspace context, and required commercial inputs.
- Apply booking policies and applicable credit requirements.
- Prevent conflicting reservations.
- Assign a stable booking identifier.
- Persist the confirmed booking and its essential commercial references.
- Return a result that clearly identifies success or failure.
- Support idempotent request handling where retries could otherwise create duplicate bookings or commercial effects.
- Preserve a clear distinction between validation failures, conflicts, authorization failures, and transient system failures.
- Make a confirmed booking discoverable to authorized downstream services.

A booking must not be reported as confirmed before its authoritative state is durable. If booking and credit operations require multiple persistence steps, their consistency and recovery behavior must be explicitly defined by the owning implementation documents.

#### 2.1.5 Booking lifecycle

The phase defines the product-level meaning and required behavior of booking lifecycle operations.

These include:

- Creation and confirmation.
- Retrieval and status inspection.
- Modification where permitted.
- Cancellation where permitted.
- Expiration where applicable.
- Rejection of invalid lifecycle transitions.
- Preservation of historical booking identity and audit context.
- Handling of repeated or delayed lifecycle requests.
- Reconciliation of associated credit effects when a lifecycle change has commercial consequences.

Lifecycle operations must be explicit and deterministic. A request to cancel a booking must not silently delete the record or erase the history needed to understand prior resource allocation and commercial activity.

Detailed status enumerations, transition tables, endpoint shapes, and persistence constraints belong to their respective domain specifications and implementation documents.

#### 2.1.6 Booking conflicts and concurrency

- Define the invariant that incompatible confirmed bookings must not overlap on a resource.
- Enforce the invariant at an authoritative service or persistence boundary.
- Address simultaneous booking attempts for the same resource and interval.
- Handle retries without creating duplicate reservations.
- Ensure cancellation or expiration updates do not leave conflicting or orphaned reservation state.
- Define how capacity-based resources differ from exclusive resources when such resource types are supported.
- Ensure conflict outcomes are deterministic and observable.
- Validate the invariant with concurrent tests and durable-state inspection.

A frontend availability check, distributed cache, or optimistic client assumption is not sufficient to protect booking integrity.

The exact database constraints, locking strategy, isolation level, and retry policy are implementation decisions owned by the database and backend architecture documents.

#### 2.1.7 Credits and commercial rules

P4 establishes the booking-facing commercial behavior required by the product, including:

- Credit balance visibility for authorized callers.
- Validation of sufficient credits where credits are required.
- Definition of when a booking consumes, reserves, releases, or refunds credits.
- Consistent linkage between a booking and its commercial effects.
- Clear outcomes when a booking fails after commercial validation.
- Protection against duplicate debit, reservation, release, or refund operations.
- Durable records of commercial movements.
- Inspection of relevant credit and booking history by authorized users.
- Explicit handling of cancellation, expiration, and other events that affect credits.
- Clear representation of commercial failures without incorrectly confirming a booking.

The product-level credit contract must specify which event creates a commercial obligation and which event finalizes or reverses it. Those semantics must not be left implicit in UI code or scattered across unrelated services.

If the product uses a ledger, reservation entry, debit entry, refund entry, or other financial representation, its authoritative schema and transaction implementation belong to the database and backend domains.

#### 2.1.8 Pricing and booking estimates

Where pricing is part of the approved P4 product scope, the phase includes:

- Identifying the applicable pricing rule or tariff.
- Providing an estimate before confirmation when required.
- Validating the commercial inputs used for a booking.
- Recording the applicable pricing reference or calculation context.
- Distinguishing an estimate from a finalized commercial movement.
- Communicating when a price or tariff is unavailable or invalid.
- Preventing a stale client-provided estimate from overriding the authoritative commercial rule.
- Defining whether price changes affect existing confirmed bookings or only future bookings.

P4 does not establish a general-purpose billing platform unless that capability is separately approved. Invoices, tax treatment, payment-gateway settlement, refunds to external payment methods, accounting exports, and revenue recognition remain outside this phase unless explicitly assigned through an approved scope change.

#### 2.1.9 Commercial eligibility and limits

- Apply the commercial restrictions required to confirm a booking.
- Check the relevant credit or account state.
- Enforce configured booking limits.
- Reject requests that exceed applicable limits.
- Ensure commercial validation is performed against authoritative state.
- Define how a depleted balance affects new bookings.
- Preserve the distinction between account eligibility and resource availability.
- Return actionable failure information without exposing private commercial details.

The exact commercial policy must be centrally defined and testable. The phase must not introduce separate, contradictory rules in the frontend, API handlers, and background workers.

#### 2.1.10 Booking history and auditability

- Maintain stable booking identifiers.
- Record the relevant creation and lifecycle events.
- Associate commercial movements with the appropriate booking where applicable.
- Record actor and timestamp information according to the approved audit model.
- Preserve enough context to explain booking outcomes.
- Restrict access to booking and commercial history by authorization policy.
- Support investigation of conflicts, retries, cancellations, and commercial inconsistencies.
- Avoid logging secrets, payment credentials, or unnecessary personal data.

The detailed audit event schema, retention rules, and infrastructure log pipeline belong to the security, backend, database, and cloud owner documents.

#### 2.1.11 User-facing booking workflow

The applicable frontend milestone must provide the user-facing workflow required to:

- Discover eligible resources.
- Request and inspect availability.
- Review the requested interval and relevant restrictions.
- Review an estimate or credit requirement when applicable.
- Submit a booking request.
- Receive a clear confirmation or failure result.
- Inspect booking details and status.
- Perform supported lifecycle operations.
- Understand credit effects and commercial outcomes.
- Recover from stale availability and retryable failures without duplicate actions.

The frontend must use the approved API contract and must not duplicate authoritative booking, concurrency, authorization, or credit enforcement.

#### 2.1.12 Integration with downstream execution

P4 must expose the booking state and references required for P5 EXECUTION to determine whether a booking is eligible for execution.

The handoff must establish:

- A stable booking identity.
- The associated resource identity.
- The requested interval or other relevant reservation constraints.
- The booking status and eligibility result.
- The authorization context required by the consuming service.
- The references needed to retrieve additional authoritative information.
- Clear behavior for cancelled, expired, conflicting, or otherwise ineligible bookings.

P4 does not own execution scheduling, job dispatch, worker orchestration, remote agents, execution logs, or execution retry policies. Those capabilities belong to P5 EXECUTION.

### 2.2 Resource categories and booking semantics

P4 should support a clear distinction between resource categories where their reservation semantics differ.

Potential resource categories may include:

- Shared development resources.
- Compute or build-related resources.
- Remote execution resources.
- Lab equipment.
- Robot or physical test resources.

The existence of a category in this list does not imply that the corresponding physical or remote capability is operational in P4. A resource is bookable only when the required capabilities are available and the relevant milestone's scope permits it.

For each supported resource category, the implementation must establish:

- Whether reservation is exclusive or capacity-based.
- Which interval boundaries apply.
- Which eligibility rules are enforced.
- Which lifecycle events affect availability.
- Which commercial rules apply.
- What happens if the underlying resource becomes unavailable.
- Which downstream service consumes the booking.

P4 defines the cross-domain requirements. Detailed resource-type models and physical-resource behavior belong to the corresponding architecture and milestone documents.

### 2.3 Time and interval semantics

Booking correctness depends on unambiguous time handling.

P4 requires a consistent definition for:

- Time-zone interpretation at the API boundary.
- Canonical time representation in persisted data.
- Start and end boundary inclusion.
- Rejection of invalid or zero-length intervals where not supported.
- Minimum and maximum booking duration.
- Minimum notice and advance-booking windows where configured.
- Booking expiration and cancellation cutoffs where applicable.
- Clock and timestamp consistency across services.
- Display conversion between canonical timestamps and user-local time.

The selected interval convention must be applied consistently to availability queries, conflict checks, booking creation, modification, and tests.

The canonical timestamp representation, database column types, clock abstraction, and time-related implementation rules belong to the database and backend implementation documents. This dossier does not select a database-specific timestamp type or locking strategy.

### 2.4 Commercial consistency requirements

Booking and credit state must not drift silently.

The implementation must define a reliable consistency boundary for operations that combine reservation and commercial state. Depending on the approved architecture, this may use a single database transaction, a durable state machine, an outbox-driven workflow, or another explicitly documented mechanism.

Regardless of implementation, the observable behavior must satisfy these principles:

1. A rejected booking must not leave an unintended confirmed reservation.
2. A retry must not create a second booking or duplicate commercial movement.
3. A failed operation must not silently consume credits without the agreed outcome.
4. A cancellation must apply the defined commercial reversal or release rule.
5. A confirmed booking must retain a durable reference to its commercial context.
6. Partial failure must be detectable and recoverable.
7. Reconciliation must not invent or silently erase commercial history.
8. Concurrent operations must preserve resource and credit invariants.
9. Commercial history must remain auditable.
10. The user must receive a result that accurately reflects the authoritative outcome.

The backend and database documents define the transaction and recovery mechanisms. Security and testing documents define the relevant control and verification requirements.

### 2.5 Authorization and tenancy boundaries

Every booking and commercial operation must respect the approved identity and authorization model established by P3 CONTROL PLANE.

P4 requires authorization checks for:

- Resource discovery where resource visibility is restricted.
- Availability queries.
- Booking creation and retrieval.
- Booking modification and cancellation.
- Credit balance and commercial history access.
- Administrative resource and booking operations.
- Downstream access to booking information.

Workspace, project, user, and resource ownership relationships must be validated against authoritative data. A caller must not gain access by guessing an identifier or changing a request field.

P4 does not define the complete identity provider, authentication protocol, token issuance system, or global authorization architecture. It consumes the established control-plane and security contracts.

### 2.6 Observability requirements

P4 must expose enough operational information to detect and diagnose booking and commercial failures.

Relevant signals include:

- Booking requests and outcomes.
- Availability-query latency and error rates.
- Conflict rejection rates.
- Booking lifecycle transitions.
- Credit validation failures.
- Duplicate-request and idempotency outcomes.
- Commercial reconciliation exceptions.
- Booking-to-execution handoff failures.
- Unexpected resource state changes affecting reservations.

Metrics must avoid sensitive or high-cardinality labels where inappropriate. Logs and traces must follow the approved privacy and security policy.

The detailed metric names, dashboards, alert rules, tracing configuration, log storage, and retention policy belong to the owning observability, backend, database, and cloud documents.

### 2.7 Explicit non-scope

The following are not owned by P4 BOOKING & COMMERCIAL:

- General repository bootstrap, shared CI conventions, and common engineering policy.
- Desktop Studio foundation and project-management capabilities.
- Local source compilation and artifact packaging.
- Artifact format and artifact validation internals.
- Full identity-provider implementation, account provisioning, and token issuance.
- General platform registration and platform-management implementation.
- Remote build orchestration or artifact publication beyond the established artifact contract.
- Execution dispatch, workers, agents, queues, remote process control, and execution retries.
- Lab orchestration, physical robot control, hardware safety enforcement, and robot telemetry.
- Live session streaming, execution results, and detailed result analysis.
- Production deployment, production hardening, and production operational readiness.
- General-purpose invoicing, payment-gateway integration, external settlement, taxation, or accounting.
- A full subscription-management or contract-management platform.
- A generic inventory or asset-management product.
- Detailed database schema design, indexes, isolation levels, migration implementation, or backup operations.
- Detailed cloud networking, infrastructure provisioning, secrets management, or deployment pipelines.
- The complete API wire specification and global security architecture.
- Global testing policy, release policy, and repository branching policy.

If any excluded capability is required to unblock P4, the dependency must be documented and assigned to its authoritative owner. It must not be absorbed into P4 without an explicit scope decision.

### 2.8 Phase relationship and handoff table

The following table uses only the frozen canonical phase and milestone model.

| Phase | Relationship to P4 | Required boundary |
|---|---|---|
| P0 FOUNDATION | Supplies repository conventions, common contracts, and shared engineering foundations | P4 follows established shared conventions |
| P1 STUDIO | Supplies the Studio foundation and project-facing user experience | P4 builds on established project context |
| P2 BUILD & ARTIFACT | Supplies artifact creation and artifact contracts | P4 may associate bookings with supported artifact references but does not own artifact creation |
| P3 CONTROL PLANE | Supplies identity, authorization context, project and platform metadata, and artifact registration capabilities | P4 consumes the established control-plane contracts |
| P4 BOOKING & COMMERCIAL | Owns resources for booking, availability, reservation lifecycle, credits, and agreed commercial rules | Defines authoritative booking and commercial outcomes |
| P5 EXECUTION | Consumes eligible bookings to initiate supported execution workflows | Owns execution lifecycle and orchestration |
| P6 LAB & ROBOT | Supplies lab and robot capabilities within its defined scope | Owns physical-resource behavior and associated lab integration |
| P7 LIVE & RESULTS | Supplies live interaction and results capabilities | Owns live session and result semantics |
| P8 PRODUCTION | Supplies production deployment and operational capabilities | Owns production readiness and production operation |

### 2.9 Cross-domain milestone mapping

| Domain | Canonical milestone | Relationship to P4 |
|---|---|---|
| Frontend | F-M01 STUDIO FOUNDATION (P0-P1) | Provides the shared Studio foundation |
| Frontend | F-M02 PROJECTS (P1) | Provides project context |
| Frontend | F-M03 BUILD & ARTIFACT (P2) | Provides artifact-related user experience |
| Frontend | F-M04 BOOKING (P4) | Implements the P4 booking and commercial user experience |
| Frontend | F-M05 EXECUTION (P5) | Consumes bookings through the approved handoff |
| Frontend | F-M06 LIVE (P7) | Owns live interaction experience |
| Frontend | F-M07 RESULTS (P7) | Owns results presentation |
| Backend | B-M01 CONTROL PLANE (P3) | Supplies identity, projects, and control-plane capabilities |
| Backend | B-M02 ARTIFACT (P2-P3) | Supplies artifact registration and discovery contracts |
| Backend | B-M03 PLATFORM (P3) | Supplies platform metadata and eligibility inputs |
| Backend | B-M04 BOOKING (P4) | Implements booking, availability, credits, and commercial service behavior |
| Backend | B-M05 EXECUTION (P5) | Consumes valid bookings and owns execution behavior |
| Backend | B-M06 RESULTS (P6-P7) | Owns lab-associated results and result-service behavior |
| Backend | B-M07 PRODUCTION (P8) | Owns production backend readiness and operations |
| Database | DB-M01 FOUNDATION (P0-P3) | Supplies foundational persistence conventions |
| Database | DB-M02 CORE DATA (P3) | Supplies control-plane data required by P4 |
| Database | DB-M03 BOOKING DATA (P4) | Implements durable resource, availability, booking, and commercial data |
| Database | DB-M04 EXECUTION DATA (P5-P7) | Owns execution, lab, and results persistence beyond the P4 booking boundary |
| Cloud | C-M01 FOUNDATION (P0) | Supplies foundational cloud conventions |
| Cloud | C-M02 DEVELOPMENT (P1-P3) | Supplies development infrastructure and environments |
| Cloud | C-M03 STAGING (P4-P7) | Supplies staging infrastructure for booking integration and later validation |
| Cloud | C-M04 PRODUCTION (P8) | Owns production infrastructure and operational readiness |

### 2.10 Required cross-domain invariants

All P4 implementations must preserve these invariants:

- **Authoritative reservation:** only the trusted booking boundary can confirm a reservation.
- **No silent conflict:** incompatible confirmed reservations must not coexist.
- **Durable identity:** every confirmed booking has a stable identifier.
- **Authorized access:** booking and commercial data remain within the approved access boundary.
- **Commercial traceability:** applicable credit movements can be traced to their booking or other authoritative commercial reference.
- **Retry safety:** repeated requests do not create unintended duplicate state or commercial effects.
- **Lifecycle integrity:** only permitted booking transitions are accepted.
- **Handoff clarity:** downstream execution can distinguish an eligible booking from an invalid, cancelled, or expired booking.
- **Failure visibility:** failures and recoverable inconsistencies are observable.
- **Ownership clarity:** booking, execution, lab, results, and production behavior remain within their designated phase boundaries.

---

## 3. Dependencies

### 3.1 Required upstream dependencies

P4 depends on established outcomes from earlier phases. A dependency may be consumed through an approved contract; P4 does not require every implementation detail in the upstream domain to be reproduced in its own codebase.

#### P0 FOUNDATION

Required inputs:

- Repository and engineering conventions.
- Common identifiers, error conventions, and contract practices where already established.
- Automated build and test foundations.
- Shared configuration and environment conventions.
- Code review and change-management procedures.

If a required shared convention is missing, resolve it through the owner of the common foundation rather than defining a competing P4-only convention.

#### P1 STUDIO

Required inputs:

- The established Studio application foundation.
- Project-facing user context where applicable.
- Common frontend navigation and presentation conventions.
- Approved client-to-service integration conventions.

P4 must not recreate the project model or introduce a separate frontend framework solely for booking.

#### P2 BUILD & ARTIFACT

Required inputs:

- A stable artifact identity and supported artifact reference contract where booking associates work with an artifact.
- Clear artifact registration and validation semantics.
- An agreed distinction between an artifact being available and an artifact being eligible for a later operation.

P4 must not assume that the existence of an artifact reference means the artifact is valid for every resource or execution path.

#### P3 CONTROL PLANE

Required inputs:

- Authenticated caller context.
- Authorization and tenancy rules.
- Project or workspace identity and access rules.
- Platform and resource-related metadata required by booking eligibility.
- Artifact registration and discovery capabilities where applicable.
- Stable identifiers and API error conventions.
- Approved persistence and service integration conventions.

P4 must not bypass these capabilities by implementing parallel identity, project, or platform registries.

### 3.2 Cross-domain dependencies

| Dependency | Required input | P4 use | Owner |
|---|---|---|---|
| Identity and authorization | Authenticated actor and authorization decision inputs | Restrict booking and commercial operations | P3 CONTROL PLANE and security owner documents |
| Project context | Authorized project or workspace reference | Scope booking access and policy | P3 CONTROL PLANE |
| Resource metadata | Stable resource identity and eligibility attributes | Catalogue, availability, and booking validation | Applicable resource-owning domain and P4 booking contract |
| Artifact metadata | Stable artifact reference and validation state, when relevant | Associate a booking with a supported artifact | P2 BUILD & ARTIFACT and P3 CONTROL PLANE |
| Persistence conventions | Migration, transaction, and identifier conventions | Persist booking and commercial state | Database domain |
| API contract | Approved request, response, error, and authorization semantics | Frontend and service integration | Protocol owner documents |
| Cloud development environment | Configured application services and persistence dependencies | Run integration validation | Cloud domain |
| Testing infrastructure | Unit, integration, contract, and concurrency test capability | Verify booking invariants | Global and domain testing documents |
| Execution handoff | Agreed booking eligibility and identity semantics | Enable P5 consumption | P4 and P5 milestone dossiers |

### 3.3 Dependency on database capability

P4 requires durable persistence capable of supporting booking lifecycle operations and commercial consistency.

The implementation must establish how to:

- Persist a booking and its lifecycle state.
- Identify conflicting reservations.
- Enforce uniqueness and other critical invariants.
- Associate credit movements with a stable commercial reference.
- Prevent duplicate processing of retryable requests.
- Preserve audit and lifecycle history.
- Recover from failed or interrupted operations.
- Apply schema changes safely.

The database domain owns the physical schema, migrations, constraints, indexes, transaction configuration, concurrency mechanisms, and operational recovery procedures. P4 owns the business invariants those mechanisms must enforce.

P4 cannot be accepted solely on the basis of in-memory state or test-only storage if the agreed product requires durable bookings.

### 3.4 Dependency on API and protocol contracts

The frontend, backend, and downstream consumers must share a defined contract for:

- Resource discovery.
- Availability queries.
- Booking creation and retrieval.
- Supported lifecycle operations.
- Credit or commercial information.
- Error classification.
- Idempotency behavior where required.
- Booking eligibility for downstream execution.

The canonical request and response definitions belong to the API and protocol owner documents. P4 defines the required product outcomes and confirms that its milestone deliverables use the approved contracts.

Breaking contract changes must follow the shared change process. A P4 implementation must not silently introduce an undocumented endpoint, status, field, or error interpretation.

### 3.5 Dependency on security and privacy

P4 handles access-controlled resource and commercial data. It therefore depends on:

- The established authentication and authorization model.
- Approved workspace and project isolation.
- Input validation and abuse protection.
- Secret-handling and logging rules.
- Data retention and audit requirements.
- Security review and vulnerability handling.

The security owner documents define the controls and threat model. P4 must demonstrate that its booking and commercial workflows apply those controls correctly.

### 3.6 Dependency on the execution handoff

P5 EXECUTION requires a reliable way to identify a valid booking and establish whether it may proceed.

The handoff must agree on:

- Which booking states are eligible.
- How a consumer retrieves authoritative booking state.
- How cancellation or expiration affects eligibility.
- How resource identity is conveyed.
- How duplicate consumption is prevented or handled.
- Which system owns execution status after handoff.
- How failures are reported without corrupting booking state.

P4 does not define the execution worker, dispatch queue, or remote-agent protocol. Those details belong to P5 EXECUTION and its domain documents.

### 3.7 Dependency readiness and blocking policy

A dependency is ready when its required contract is available, its owner is identified, and P4 can validate the integration assumptions without relying on undocumented behavior.

If an upstream implementation is incomplete, P4 may use a clearly identified test double for isolated development. Such a test double must not be presented as evidence that the upstream integration is complete.

A missing dependency must be classified as one of the following:

- **Blocking:** the relevant P4 acceptance condition cannot be demonstrated safely or correctly.
- **Conditionally blocking:** work may continue, but the affected capability cannot be accepted until the dependency is resolved.
- **Non-blocking:** the dependency affects a later integration or optional capability and does not invalidate the current acceptance scope.

The task-specific impact and owner must be recorded in `TASKS.md` and the acceptance evidence. This dossier does not prescribe the day-to-day tracking format.

### 3.8 Cross-phase handoff table

| Handoff | Producing phase | Consuming phase | Required evidence |
|---|---|---|---|
| Shared engineering foundation | P0 FOUNDATION | P4 BOOKING & COMMERCIAL | Conventions and build/test prerequisites are available |
| Project and Studio context | P1 STUDIO | P4 BOOKING & COMMERCIAL | Required project context can be consumed through approved contracts |
| Artifact references | P2 BUILD & ARTIFACT | P4 BOOKING & COMMERCIAL | Artifact identity and eligibility semantics are documented where applicable |
| Identity, projects, platforms, and artifact registration | P3 CONTROL PLANE | P4 BOOKING & COMMERCIAL | Required APIs, authorization context, and persisted metadata are available |
| Booking eligibility and confirmed reservation | P4 BOOKING & COMMERCIAL | P5 EXECUTION | Stable booking identity, status, resource reference, and eligibility semantics are available |
| Physical resource and lab integration | P6 LAB & ROBOT | Relevant booking and execution consumers | Resource capability and safety boundaries are documented by the owning domain |
| Live and results integration | P7 LIVE & RESULTS | Relevant booking and execution consumers | Live-session and results contracts remain owned by P7 |
| Production deployment and operations | P8 PRODUCTION | All deployed capabilities | Production controls and readiness evidence satisfy the production owner dossier |

---

## 4. Deliverables

The following deliverables describe the phase-level outcomes. They do not replace task-level implementation details or acceptance evidence in the sibling documents.

### 4.1 Resource catalogue and eligibility contract

P4 delivers a documented booking-facing resource contract that establishes:

- Stable resource identity.
- Supported resource categories.
- Resource eligibility and bookability semantics.
- The metadata required for availability and booking.
- The handling of disabled, retired, or otherwise ineligible resources.
- The relationship between resource ownership and booking ownership.
- The behavior when resource eligibility changes after a booking is created.

**Completion evidence:** the resource contract is approved, implemented for the agreed scope, and validated against eligible and ineligible resource cases.

### 4.2 Availability contract and behavior

P4 delivers an availability capability that:

- Accepts validated query parameters.
- Uses authoritative reservation state.
- Applies the defined interval and conflict rules.
- Returns clear availability semantics.
- Enforces access boundaries.
- Handles malformed, unsupported, or out-of-range requests.
- Does not treat a query result as a reservation.
- Is tested against overlapping, adjacent, and non-overlapping intervals.

**Completion evidence:** availability tests demonstrate the agreed interval semantics and show that existing reservations are reflected in subsequent queries.

### 4.3 Booking lifecycle contract

P4 delivers the product-level booking lifecycle contract, including:

- Creation and confirmation.
- Booking identity and retrieval.
- Supported modification and cancellation operations.
- Expiration behavior where applicable.
- Valid and invalid transitions.
- Retry and idempotency expectations.
- Auditability and historical identity.
- Downstream eligibility semantics.

**Completion evidence:** lifecycle behavior is documented and tested, including invalid transitions and repeated requests.

### 4.4 Concurrency and reservation integrity

P4 delivers an implementation that preserves the reservation invariant under concurrent access.

The implementation must:

- Reject conflicting reservation attempts.
- Define deterministic conflict outcomes.
- Avoid relying on client-side checks.
- Avoid relying solely on eventually consistent availability caches.
- Preserve correctness during cancellation and modification.
- Provide evidence from concurrency tests.
- Make relevant integrity failures observable.

**Completion evidence:** concurrent test runs demonstrate that the agreed resource exclusivity or capacity constraints cannot be violated through supported API operations.

### 4.5 Credits and commercial contract

P4 delivers the booking-facing credit and commercial contract, including:

- Credit validation.
- The event that reserves, consumes, releases, or refunds credits.
- Association between booking state and commercial effects.
- Failure semantics.
- Idempotency requirements.
- Authorized balance and history visibility.
- Audit and reconciliation expectations.

**Completion evidence:** documented and automated tests demonstrate that successful and failed booking operations produce the agreed commercial outcomes without unintended duplicate movements.

### 4.6 Pricing and estimates, where approved

Where pricing is included in the approved P4 scope, the phase delivers:

- The pricing inputs and applicable rule reference.
- Estimate behavior.
- Validation of authoritative pricing inputs.
- The relationship between an estimate and a confirmed booking.
- Defined handling of changed or unavailable pricing rules.
- A clear boundary between booking estimates and finalized commercial movements.

**Completion evidence:** the applicable pricing paths are documented and tested, and the user-visible amount cannot override the authoritative commercial calculation.

If pricing is not approved for a particular booking category, that category must not display an invented or misleading price.

### 4.7 Persistence and migration integration

P4 delivers the booking and commercial behavior using the approved database architecture.

The implementation must provide:

- Durable booking state.
- Required resource and booking relationships.
- Durable commercial references and movements where applicable.
- Migration and upgrade compatibility.
- Transactional or otherwise reliable consistency mechanisms.
- Integrity constraints appropriate to the chosen data model.
- Recovery and diagnostic information for failed operations.

**Completion evidence:** integration tests run against the supported persistence environment, migrations apply successfully, and the relevant invariants are verified against persisted state.

The exact schema and migration files are owned by the database implementation and its milestone documentation.

### 4.8 Frontend booking workflow

P4 delivers the user-visible workflow through the applicable frontend milestone.

The workflow must:

- Present eligible resources.
- Show availability with clear limitations.
- Collect valid booking parameters.
- Present relevant credit or commercial information.
- Submit requests through the approved API contract.
- Display authoritative booking outcomes.
- Handle conflicts and stale availability.
- Prevent confusing duplicate submissions.
- Provide access to booking details and supported lifecycle operations.
- Communicate failure without implying that a failed booking was confirmed.

**Completion evidence:** frontend tests and integrated user-flow tests demonstrate the agreed booking paths and critical failure paths.

### 4.9 API and integration readiness

P4 delivers integration-ready interfaces for the frontend and downstream services.

Required outcomes include:

- Contract-compliant resource and availability operations.
- Contract-compliant booking lifecycle operations.
- Consistent error semantics.
- Authorization enforcement.
- Stable booking identifiers.
- Documented idempotency behavior where required.
- Reliable access to booking eligibility for P5 EXECUTION.
- Contract tests or equivalent evidence for the approved interfaces.

**Completion evidence:** contract validation and integration tests pass against the supported development environment.

### 4.10 Audit and operational diagnostics

P4 delivers enough diagnostic capability to explain booking and commercial outcomes.

The implementation must make it possible to investigate:

- Why a booking was rejected.
- Why an interval was unavailable.
- Whether a booking was confirmed.
- Whether a retry reused an existing result.
- Whether a commercial movement was applied.
- Whether cancellation or expiration produced the expected commercial effect.
- Whether a downstream handoff failed.
- Whether reconciliation or manual investigation is required.

**Completion evidence:** representative success and failure scenarios produce the expected diagnostic and audit evidence without exposing restricted data.

### 4.11 Integration and verification evidence

P4 delivers verification evidence covering:

- Resource eligibility.
- Availability semantics.
- Booking creation and lifecycle.
- Concurrent reservation attempts.
- Authorization and tenancy boundaries.
- Credit validation and commercial consistency.
- Idempotency and retry behavior.
- Persistence and migration integration.
- Frontend-to-backend contract integration.
- P5 handoff eligibility.
- Error handling and operational diagnostics.

The global testing strategy defines common test levels and quality policy. Domain testing documents define implementation-specific test execution. The P4 acceptance and review files define the evidence required for phase acceptance.

### 4.12 Documentation and ownership handoff

P4 delivers sufficient documentation for the next phase and for maintenance by the relevant domain owners.

The handoff must identify:

- The authoritative booking contract.
- The supported resource categories and their semantics.
- The confirmed-booking invariant.
- The lifecycle and cancellation rules.
- The commercial and credit behavior.
- The downstream eligibility contract.
- Known limitations and unresolved dependencies.
- The location of implementation, testing, and operational documentation.

**Completion evidence:** the owning documents are updated, links resolve, and downstream owners can identify the supported integration surface without relying on undocumented assumptions.

### 4.13 Deliverable ownership summary

| Deliverable | Phase-level owner | Implementation owner |
|---|---|---|
| Booking-facing resource contract | P4 BOOKING & COMMERCIAL | Backend and applicable resource domain |
| Availability semantics | P4 BOOKING & COMMERCIAL | Backend and database |
| Booking lifecycle | P4 BOOKING & COMMERCIAL | Backend and database |
| Reservation concurrency invariant | P4 BOOKING & COMMERCIAL | Backend and database |
| Credit and commercial behavior | P4 BOOKING & COMMERCIAL | Backend and database |
| Pricing estimate, if approved | P4 BOOKING & COMMERCIAL | Backend and applicable commercial domain |
| Booking database schema and migrations | P4 requirements; database implementation owns design | Database domain |
| Booking frontend workflow | P4 requirements; frontend implementation owns UI | Frontend domain |
| API wire definitions | P4 requirements; protocol owner owns contract | Protocol and backend domains |
| Cloud environment and deployment | Cloud domain | Cloud domain |
| Execution handoff | P4 and P5 jointly at the boundary | Backend integration owners |
| Global test policy | Global development documentation | Global development owner |
| Detailed P4 acceptance evidence | `ACCEPTANCE_CRITERIA.md` | Assigned task owners and reviewers |

### 4.14 Required phase records

The P4 phase directory must maintain its agreed sibling records:

| File | Purpose |
|---|---|
| `MILESTONE.md` | Phase objective, scope, dependencies, deliverables, risks, exit criteria, and ownership boundaries |
| `TASKS.md` | Work decomposition, ordering, dependencies, and ownership |
| `ACCEPTANCE_CRITERIA.md` | Detailed pass/fail criteria and required evidence |
| `REVIEW_CHECKLIST.md` | Review checks, boundary checks, and evidence inspection |
| `CHANGELOG.md` | Accepted scope and milestone changes |
| `GIT_COMMIT_STEP.md` | Required repository and commit procedure |

These files must remain complementary. A task detail belongs in `TASKS.md`; a verifiable pass/fail condition belongs in `ACCEPTANCE_CRITERIA.md`; a reviewer action belongs in `REVIEW_CHECKLIST.md`; a historical change belongs in `CHANGELOG.md`; and a commit procedure belongs in `GIT_COMMIT_STEP.md`.

---

## 9. Risks

### 9.1 Availability becomes stale before booking

**Risk:** A resource appears available during a query but is reserved by another request before the user confirms.

**Impact:** Users receive conflicting outcomes, resource allocation becomes unreliable, or incompatible reservations are recorded.

**Mitigation:**

- Treat availability as advisory until booking confirmation.
- Revalidate eligibility and availability at the authoritative confirmation boundary.
- Enforce conflict prevention through the backend and persistence design.
- Return a clear conflict result when another request wins.
- Verify the behavior with concurrent integration tests.

**Owner:** Backend and database domains.

### 9.2 Concurrent requests violate resource integrity

**Risk:** Two or more simultaneous requests pass an initial availability check and create overlapping reservations.

**Impact:** Resource overbooking, downstream execution conflicts, and loss of trust in booking results.

**Mitigation:**

- Define the invariant independently of the selected implementation.
- Enforce the invariant at an authoritative boundary.
- Use the database's supported integrity and concurrency mechanisms.
- Test simultaneous requests against real persistence.
- Confirm that only the permitted number of requests can succeed for a constrained resource.

**Owner:** Backend and database domains.

### 9.3 Duplicate booking from retries

**Risk:** A client retries after a timeout even though the original request succeeded.

**Impact:** Duplicate bookings, multiple credit movements, or ambiguous user-visible outcomes.

**Mitigation:**

- Define idempotency requirements for booking creation and commercial operations.
- Persist or otherwise reliably recover the original request outcome.
- Return a consistent result for a valid retry.
- Test timeouts and repeated requests.
- Keep request identity and booking identity distinct where the contract requires it.

**Owner:** Backend domain, with database support.

### 9.4 Booking and credit state diverge

**Risk:** A booking succeeds while the associated credit operation fails, or a credit operation succeeds without the intended booking outcome.

**Impact:** Incorrect balances, disputed commercial records, and bookings that cannot be explained or reconciled.

**Mitigation:**

- Define the authoritative commercial events and their ordering.
- Establish the consistency and recovery mechanism.
- Make partial failure detectable.
- Prevent duplicate processing.
- Test failure injection at relevant transaction boundaries.
- Preserve an auditable history of commercial movements.

**Owner:** Backend and database domains, with security and commercial policy review as applicable.

### 9.5 Ambiguous commercial lifecycle

**Risk:** The implementation does not define when credits are reserved, consumed, released, or refunded.

**Impact:** Inconsistent behavior across creation, cancellation, expiration, and retries.

**Mitigation:**

- Approve explicit commercial lifecycle semantics.
- Associate each commercial effect with a defined triggering event.
- Specify behavior for rejected, cancelled, and expired bookings.
- Test every supported lifecycle path.
- Keep user-visible commercial explanations consistent with authoritative state.

**Owner:** P4 product scope owner and backend implementation owner.

### 9.6 Unauthorized resource or booking access

**Risk:** A caller accesses another user's, project's, or workspace's booking or commercial data by modifying identifiers or query parameters.

**Impact:** Confidentiality breach, commercial data exposure, and violation of tenancy boundaries.

**Mitigation:**

- Apply authorization on every protected operation.
- Validate resource and project relationships against authoritative state.
- Test cross-workspace and cross-project access attempts.
- Avoid treating unguessable identifiers as authorization.
- Restrict audit and commercial history to authorized callers.
- Follow the security architecture and application security requirements.

**Owner:** Backend and security domains.

### 9.7 Resource lifecycle changes invalidate bookings

**Risk:** A resource is disabled, removed, or becomes ineligible while future bookings exist.

**Impact:** Users may hold reservations that cannot be fulfilled, or existing booking records may lose their resource references.

**Mitigation:**

- Define the effect of resource-state changes on existing bookings.
- Preserve historical resource identity.
- Prevent new bookings against ineligible resources.
- Identify affected reservations when a resource becomes unavailable.
- Define cancellation, notification, and commercial remediation responsibilities.
- Keep physical resource remediation within the relevant resource-owning domain.

**Owner:** P4 booking owner and applicable resource domain.

### 9.8 Inconsistent time semantics

**Risk:** Services interpret timestamps, interval boundaries, or time zones differently.

**Impact:** Incorrect conflict detection, unexpected booking durations, and inconsistent availability results.

**Mitigation:**

- Define a canonical time representation.
- Specify interval boundary semantics.
- Validate time inputs at the API boundary.
- Use consistent clock and timestamp conventions.
- Test daylight-saving transitions where relevant, local display conversion, adjacent intervals, and boundary equality.
- Keep canonical storage and transaction behavior within the database and backend implementation documents.

**Owner:** Backend and database domains.

### 9.9 Pricing estimates differ from authoritative outcomes

**Risk:** A frontend estimate is treated as authoritative or pricing inputs change between estimate and confirmation.

**Impact:** Incorrect user expectations, commercial inconsistency, or unapproved pricing behavior.

**Mitigation:**

- Define whether estimates are indicative or binding.
- Revalidate applicable pricing rules at the agreed confirmation point.
- Record the pricing context required to explain a confirmed booking.
- Return a clear outcome if pricing changes or is unavailable.
- Do not include pricing in a booking category unless the approved scope defines its behavior.

**Owner:** P4 commercial scope owner and backend implementation owner.

### 9.10 Cancellation produces an inconsistent reservation

**Risk:** Cancellation changes booking state but does not release the resource interval or apply the agreed commercial effect.

**Impact:** Resources remain unavailable incorrectly, credits remain reserved, or the booking and ledger disagree.

**Mitigation:**

- Define cancellation as an explicit lifecycle transition.
- Make resource and commercial consequences part of the contract.
- Ensure repeated cancellation requests are safe.
- Test cancellation under concurrent modification and retry conditions.
- Preserve historical records and make incomplete recovery visible.

**Owner:** Backend and database domains.

### 9.11 Expiration is inconsistent or delayed

**Risk:** Expired reservations continue to block availability, or a reservation expires while a confirmation or execution handoff is being processed.

**Impact:** Reduced resource utilization, inconsistent eligibility, and race conditions between booking and downstream consumers.

**Mitigation:**

- Define whether and where expiration applies.
- Establish the authoritative expiration rule and clock basis.
- Ensure expired bookings cannot be treated as eligible.
- Define the interaction between expiration, commercial release, and downstream eligibility.
- Test boundary timing and repeated expiration processing.
- Assign any asynchronous expiration worker to the appropriate backend implementation owner.

**Owner:** Backend and database domains.

### 9.12 Insufficient integration with P3 CONTROL PLANE

**Risk:** P4 relies on assumptions about project identity, authorization, platform metadata, or artifact eligibility that differ from the actual control-plane contracts.

**Impact:** Integration failures, duplicate models, or inconsistent authorization.

**Mitigation:**

- Consume approved P3 contracts.
- Confirm required fields and status semantics before integration.
- Use contract tests.
- Avoid duplicating control-plane ownership in booking services.
- Escalate missing upstream capabilities to their owners.

**Owner:** P4 integration owner and P3 domain owners.

### 9.13 Insufficient handoff to P5 EXECUTION

**Risk:** Downstream execution cannot determine whether a booking is confirmed, cancelled, expired, or otherwise eligible.

**Impact:** Execution may start without a valid reservation or reject valid work inconsistently.

**Mitigation:**

- Define the booking eligibility contract.
- Provide stable booking and resource identifiers.
- Make authoritative state retrievable by authorized consumers.
- Define the behavior when booking state changes around handoff.
- Test valid and invalid handoff scenarios.
- Keep execution state transitions and dispatch behavior within P5.

**Owner:** P4 and P5 integration owners.

### 9.14 Test doubles conceal integration gaps

**Risk:** Local tests use mocked availability, identity, persistence, or commercial services without validating the real integration behavior.

**Impact:** Failures emerge only during integrated deployment or concurrent use.

**Mitigation:**

- Label test doubles clearly.
- Maintain unit, contract, and persistence integration tests.
- Exercise critical paths against the supported development environment.
- Test transaction and concurrency behavior against the intended persistence implementation.
- Require evidence from integrated workflows before acceptance.

**Owner:** Backend, database, frontend, and testing owners.

### 9.15 Commercial or audit data is exposed through logs

**Risk:** Diagnostics include sensitive user, workspace, credit, or payment-related data.

**Impact:** Privacy violations, unauthorized disclosure, or expanded security incident impact.

**Mitigation:**

- Follow the approved data classification and logging policy.
- Log identifiers and outcomes rather than secrets or unnecessary payloads.
- Restrict access to commercial history and operational logs.
- Test error responses for unintended information disclosure.
- Apply retention and access controls through the relevant security and cloud owner documents.

**Owner:** Security, backend, and cloud domains.

### 9.16 Scope expands into adjacent systems

**Risk:** P4 absorbs execution orchestration, lab control, physical safety, live sessions, results, invoicing, or production infrastructure.

**Impact:** Unclear ownership, schedule growth, duplicated systems, and delayed booking acceptance.

**Mitigation:**

- Keep this dossier's non-scope explicit.
- Assign cross-domain work to the authoritative milestone dossier.
- Record dependencies and handoffs instead of duplicating implementations.
- Use the task and decision records for approved scope changes.
- Require explicit review when a proposed change crosses a domain boundary.

**Owner:** P4 phase owner and relevant domain owners.

### 9.17 Migration or deployment breaks existing bookings

**Risk:** Schema changes or application rollout invalidate existing reservations, commercial references, or lifecycle history.

**Impact:** Data loss, failed booking operations, or inability to reconcile previous commercial effects.

**Mitigation:**

- Follow the database migration and release procedures.
- Use compatible schema evolution where required.
- Test upgrades against representative existing data.
- Define rollback and recovery behavior.
- Preserve historical booking and commercial references.
- Keep production rollout and operational controls within P8 PRODUCTION.

**Owner:** Database, backend, and cloud domains.

### 9.18 Acceptance is based on UI appearance rather than invariants

**Risk:** The phase is declared complete because the user interface looks correct while concurrency, authorization, persistence, or commercial failure paths remain unverified.

**Impact:** A visually complete workflow produces unsafe or incorrect booking outcomes.

**Mitigation:**

- Use the phase acceptance criteria as the required pass/fail baseline.
- Verify critical invariants through automated tests and persisted-state inspection.
- Require contract and integration evidence.
- Review failure and retry scenarios.
- Use the review checklist to confirm that evidence supports each accepted outcome.

**Owner:** P4 phase owner and reviewers.

### 9.19 Ownership boundaries remain ambiguous

**Risk:** Multiple domains implement conflicting resource, booking, credit, or execution semantics.

**Impact:** Duplicate logic, incompatible contracts, and failures at phase handoffs.

**Mitigation:**

- Keep booking and commercial semantics owned by P4.
- Keep identity and project authority with P3 CONTROL PLANE.
- Keep execution orchestration with P5 EXECUTION.
- Keep lab and physical-resource behavior with P6 LAB & ROBOT.
- Keep live interaction and results with P7 LIVE & RESULTS.
- Keep production deployment and operational readiness with P8 PRODUCTION.
- Route detailed implementation questions to the designated owner documents.

**Owner:** P4 phase owner and relevant domain owners.

---

## 10. Exit criteria

P4 BOOKING & COMMERCIAL may be declared complete only when the approved phase scope has been delivered and the required evidence demonstrates the booking and commercial invariants.

Completion requires both functional behavior and reliable failure handling. A successful demonstration with mocked persistence or unverified commercial side effects is not sufficient evidence for a capability that requires durable state.

The authoritative task-level pass/fail conditions are maintained in `ACCEPTANCE_CRITERIA.md`. Review execution and evidence inspection are maintained in `REVIEW_CHECKLIST.md`.

### 10.1 Scope and ownership

- [ ] The accepted P4 scope is consistent with this dossier.
- [ ] Resource, availability, booking, credit, and commercial responsibilities are explicitly assigned.
- [ ] The implementation does not duplicate identity, project, platform, artifact, execution, lab, results, or production ownership.
- [ ] Cross-domain dependencies have named owners.
- [ ] Out-of-scope capabilities are documented as dependencies or follow-on work rather than silently absorbed into P4.
- [ ] The canonical phase and milestone references match the frozen model.
- [ ] The sibling task, acceptance, review, changelog, and Git procedure files are maintained separately.

### 10.2 Resource catalogue and eligibility

- [ ] Supported resource categories are documented.
- [ ] Resource identifiers are stable and consistently used.
- [ ] Booking eligibility is explicit and enforced by trusted services.
- [ ] Disabled, retired, unknown, or ineligible resources cannot receive new confirmed bookings.
- [ ] Resource visibility follows the approved authorization and tenancy rules.
- [ ] Resource-state changes have defined behavior for existing bookings.
- [ ] Resource ownership remains with the appropriate domain.

### 10.3 Availability correctness

- [ ] Availability requests validate resource identity and interval parameters.
- [ ] Canonical time and interval boundary semantics are documented.
- [ ] Availability queries use authoritative reservation state or an explicitly approved equivalent.
- [ ] Conflicting reservations are reflected in availability results.
- [ ] Adjacent and non-overlapping interval cases behave as specified.
- [ ] Availability results are clearly distinguished from confirmed bookings.
- [ ] Unauthorized resource or booking information is not exposed.
- [ ] Availability failure paths return defined errors and do not create reservations.

### 10.4 Booking lifecycle correctness

- [ ] A valid booking can be created for an eligible resource and interval.
- [ ] A confirmed booking receives a stable identifier.
- [ ] Confirmation reflects durable authoritative state.
- [ ] Invalid booking requests are rejected.
- [ ] Unsupported lifecycle transitions are rejected.
- [ ] Retrieval and supported modification or cancellation operations behave as specified.
- [ ] Expiration is implemented where it is part of the approved scope.
- [ ] Repeated requests do not create unintended duplicate bookings.
- [ ] Historical identity and audit context are preserved.
- [ ] The user-visible status matches the authoritative booking outcome.

### 10.5 Reservation integrity and concurrency

- [ ] The reservation invariant is documented and enforced.
- [ ] Concurrent conflicting requests cannot violate the resource's exclusivity or capacity rule.
- [ ] Conflict responses are deterministic and contract-compliant.
- [ ] Client-side checks are not the sole protection against conflicts.
- [ ] Cancellation and modification preserve reservation integrity.
- [ ] Retry behavior is verified.
- [ ] Concurrency tests run against the supported persistence implementation.
- [ ] Persisted-state inspection confirms that the invariant holds after the test run.

### 10.6 Credits and commercial behavior

- [ ] Credit requirements are explicit for the supported booking categories.
- [ ] The authoritative credit validation boundary is documented.
- [ ] Reserve, consume, release, and refund semantics are defined wherever applicable.
- [ ] Successful bookings produce the agreed commercial outcome.
- [ ] Failed bookings do not leave unintended confirmed reservations or commercial effects.
- [ ] Duplicate requests cannot produce unintended duplicate commercial movements.
- [ ] Cancellation and expiration apply the agreed commercial consequences.
- [ ] Commercial records can be traced to their booking or authoritative reference.
- [ ] Authorized users can inspect the relevant commercial information.
- [ ] Reconciliation and partial-failure behavior are documented and testable.

### 10.7 Pricing, if approved

- [ ] Pricing scope is explicitly approved for the applicable booking category.
- [ ] The distinction between estimates and authoritative commercial outcomes is documented.
- [ ] Authoritative pricing inputs are validated.
- [ ] The applicable pricing context is retained where required.
- [ ] Unavailable or changed pricing produces a clear result.
- [ ] No unsupported pricing or billing behavior is presented to the user.

If pricing is excluded from the accepted P4 scope, the acceptance record must make that exclusion explicit and must not imply that pricing-related deliverables have been completed.

### 10.8 Security and tenancy

- [ ] Every protected booking and commercial operation enforces authorization.
- [ ] Project, workspace, actor, and resource relationships are validated.
- [ ] Cross-workspace and cross-project access attempts are tested.
- [ ] Identifiers alone do not grant access.
- [ ] Commercial history and credit information follow the approved access rules.
- [ ] Logs and errors do not expose secrets or unnecessary sensitive data.
- [ ] Relevant security review findings are resolved or formally dispositioned through the approved process.

### 10.9 Database and persistence

- [ ] Booking and commercial state are durable for the agreed product scope.
- [ ] Required migrations apply successfully.
- [ ] Relevant integrity constraints are enforced.
- [ ] The implementation uses the approved transaction or recovery strategy.
- [ ] Failure and retry behavior is verified against persisted state.
- [ ] Migration compatibility and recovery expectations are documented.
- [ ] Database implementation details remain owned by the database domain.

### 10.10 Frontend and API integration

- [ ] The user can discover supported resources.
- [ ] The user can inspect availability and submit a valid booking request.
- [ ] Relevant credit or commercial information is presented accurately.
- [ ] Confirmed and failed booking outcomes are distinguishable.
- [ ] Stale availability and conflict failures are handled clearly.
- [ ] The UI does not claim success before the authoritative outcome is known.
- [ ] The frontend uses the approved API contract.
- [ ] Contract and integration tests pass for the supported booking workflow.

### 10.11 Downstream execution handoff

- [ ] The booking eligibility contract for P5 EXECUTION is documented.
- [ ] Stable booking and resource identifiers are available to authorized consumers.
- [ ] Consumers can distinguish eligible, cancelled, expired, and otherwise ineligible bookings.
- [ ] The behavior of booking changes around handoff is defined.
- [ ] The P4-to-P5 integration is validated through an agreed contract or integration test.
- [ ] Execution dispatch and execution lifecycle implementation remain owned by P5 EXECUTION.

### 10.12 Diagnostics and operational readiness

- [ ] Booking successes and failures can be diagnosed.
- [ ] Conflict and idempotency outcomes are observable.
- [ ] Commercial failures and reconciliation exceptions are detectable.
- [ ] Audit information supports investigation of representative booking scenarios.
- [ ] Diagnostic data follows the approved security and privacy rules.
- [ ] The implementation provides actionable failure information without exposing restricted data.
- [ ] Operational implementation details are documented by the relevant domain owners.

### 10.13 Verification evidence

- [ ] Unit tests cover critical booking and commercial rules.
- [ ] Integration tests cover persistence and relevant service interactions.
- [ ] Contract tests cover the agreed frontend and downstream interfaces.
- [ ] Concurrency tests verify reservation integrity.
- [ ] Authorization tests verify resource and commercial access boundaries.
- [ ] Retry and idempotency tests verify duplicate-request behavior.
- [ ] Failure-injection or equivalent tests cover critical commercial consistency paths.
- [ ] Required frontend workflow tests pass.
- [ ] Test evidence is repeatable and linked from the authoritative acceptance records.
- [ ] Any accepted exception is explicitly documented with an owner and disposition.

### 10.14 Documentation and handoff

- [ ] The booking-facing resource and eligibility contract is documented.
- [ ] Availability and interval semantics are documented.
- [ ] Booking lifecycle and conflict behavior are documented.
- [ ] Credit and commercial semantics are documented.
- [ ] API and protocol references resolve to their authoritative documents.
- [ ] Database and cloud implementation references resolve to their authoritative documents.
- [ ] The P5 EXECUTION handoff is explicit.
- [ ] Known limitations and deferred capabilities are recorded in the appropriate owner files.
- [ ] The task, acceptance, review, changelog, and Git procedure files are complete for the agreed phase scope.
- [ ] Documentation does not duplicate detailed implementation or policy owned elsewhere.

### 10.15 Final phase acceptance

P4 BOOKING & COMMERCIAL is ready for formal acceptance when:

1. The approved resource, availability, booking, credit, and commercial scope is implemented.
2. The authoritative reservation and commercial invariants are verified.
3. Required persistence, authorization, contract, and integration tests pass.
4. The frontend accurately reflects authoritative booking outcomes.
5. The handoff to P5 EXECUTION is documented and validated.
6. Critical risks have been mitigated or formally dispositioned by their owners.
7. Required review evidence is available in the sibling acceptance and review records.
8. No unresolved issue invalidates booking integrity, authorization, or commercial consistency.
9. Remaining work is explicitly assigned to its authoritative phase or domain owner.
10. The P4 phase owner records the acceptance outcome using the approved project workflow.

Acceptance of P4 does not imply that execution orchestration, lab or robot operation, live interaction, results processing, or production readiness is complete. Those outcomes remain governed by their respective canonical phases and authoritative milestone dossiers.
