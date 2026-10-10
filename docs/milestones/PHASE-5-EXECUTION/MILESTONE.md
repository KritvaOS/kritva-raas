# P5 EXECUTION — Milestone Dossier

**Primary Phase:** P5 EXECUTION

**Supporting Phases:** P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE; P4 BOOKING & COMMERCIAL; P6 LAB & ROBOT; P7 LIVE & RESULTS; P8 PRODUCTION

**Document Type:** Phase-level milestone dossier

**Status:** Planning baseline

**Scope Authority:** This document defines the phase-level objectives, boundaries, dependencies, deliverables, risks, and exit criteria for P5 EXECUTION. The milestone dossiers under `docs/**/milestones/` are authoritative for their respective milestone scopes.

---

## Ownership and Boundaries

### What this document owns

This document owns the phase-level definition of P5 EXECUTION, with a specific focus on remote execution against a simulated robot environment.

It defines:

- The objective and outcomes required from P5.
- The included and excluded execution capabilities.
- The dependencies required from booking, control-plane, artifact, and infrastructure domains.
- The execution lifecycle and orchestration responsibilities at phase level.
- The requirements for dispatching an authorized execution request to a simulated execution target.
- The requirements for tracking execution state and returning execution outcomes.
- The boundary between execution orchestration and lab, robot, live-session, results, and production responsibilities.
- The phase-level risks and exit conditions.
- The integration handoff required for later phases.

P5 must demonstrate a coherent remote-execution path in which an eligible request is validated, dispatched to a simulated target, executed within the supported simulation environment, and reported through an authoritative execution lifecycle.

The simulated environment is the required initial target for this phase. A successful simulation demonstrates software orchestration and interface behavior; it does not establish physical robot readiness or certify hardware safety.

### What this document does not own

This dossier does not define individual implementation tasks, detailed acceptance tests, reviewer procedures, change history, or Git commands.

Those responsibilities belong to the sibling files:

- [`TASKS.md`](TASKS.md) — task decomposition, dependencies, sequencing, and ownership.
- [`ACCEPTANCE_CRITERIA.md`](ACCEPTANCE_CRITERIA.md) — detailed, verifiable acceptance conditions and evidence.
- [`REVIEW_CHECKLIST.md`](REVIEW_CHECKLIST.md) — reviewer checks and evidence inspection.
- [`CHANGELOG.md`](CHANGELOG.md) — milestone changes and accepted updates.
- [`GIT_COMMIT_STEP.md`](GIT_COMMIT_STEP.md) — repository and commit procedure.

This document does not replace system architecture, backend implementation architecture, API contracts, database architecture, cloud architecture, security architecture, testing strategy, or release procedures.

### Ownership map

| Concern | Authoritative owner | P5 relationship |
|---|---|---|
| Canonical phase definitions | `docs/planning/PHASES.md` | Uses the frozen phase model |
| System-level decisions | `docs/planning/DECISIONS.md` | Consumes approved system decisions |
| System architecture | `docs/architecture/` | Follows system-wide ownership boundaries |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` | Implements execution services within the approved architecture |
| API wire contract | `docs/protocol/API_CONTRACT.md` | Uses the approved request, response, and error contract |
| Security architecture | `docs/architecture/SECURITY_ARCHITECTURE.md` and `docs/security/` | Applies established authentication and authorization rules |
| Database implementation | `docs/database/architecture/DATABASE_ARCHITECTURE.md` | Persists execution state using approved database practices |
| Cloud implementation | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` | Provides development and staging infrastructure |
| Global development workflow | `docs/development/` | Follows shared engineering and review policy |
| Global testing strategy | `docs/development/TESTING_STRATEGY.md` | Follows common verification policy |
| Global release process | `docs/development/RELEASE_PROCESS.md` | Follows shared release policy |
| Booking and commercial rules | P4 BOOKING & COMMERCIAL dossier and domain documents | Supplies eligible booking context; P5 does not own booking or credit semantics |
| Execution phase outcomes | This document | Authoritative at phase level |
| Execution tasks | `TASKS.md` | Authoritative for task decomposition |
| Execution acceptance | `ACCEPTANCE_CRITERIA.md` | Authoritative for detailed acceptance |
| Execution review | `REVIEW_CHECKLIST.md` | Authoritative for review execution |
| Execution change history | `CHANGELOG.md` | Authoritative for milestone history |
| Execution Git procedure | `GIT_COMMIT_STEP.md` | Authoritative for commit procedure |

When a question concerns implementation details or policy owned by another document, this dossier links to that owner rather than duplicating its specification.

---

## 1. Objective

P5 EXECUTION establishes the remote-execution software path required to submit an authorized execution request, dispatch it to a simulated robot environment, track its lifecycle, and retrieve its outcome.

The phase connects confirmed booking and eligible resource context from P4 BOOKING & COMMERCIAL with simulated execution behavior that can later be integrated with lab and robot capabilities. It establishes the execution control boundary without making physical hardware operation a prerequisite for software-level acceptance.

The primary objective is to demonstrate that execution is a durable, observable, permission-controlled service workflow rather than a local function call or a frontend-only simulation.

### 1.1 Primary outcomes

P5 must establish the following outcomes:

1. An authorized caller can request execution through the approved interface.
2. The request can be associated with a valid booking or other explicitly approved execution authorization context.
3. The service validates the request before dispatch.
4. The service identifies an eligible simulated execution target.
5. The execution request receives a stable execution identifier.
6. Dispatch is performed through a defined execution boundary.
7. A simulated target can accept and process the request.
8. Execution state progresses through defined lifecycle transitions.
9. The service exposes execution status to authorized callers.
10. Duplicate submissions and retry scenarios have defined behavior.
11. Cancellation or termination requests follow explicit rules.
12. Failures are classified and reported without fabricating success.
13. Execution events and relevant state changes are observable.
14. Execution state is persisted according to the approved database architecture.
15. The frontend can submit and inspect an execution through the approved API contract.
16. The execution outcome can be handed off to the owners of live interaction and results.
17. The software-only scope remains distinct from physical robot safety and production deployment.

### 1.2 Required simulation target

The required target for this phase is a simulated robot environment. It may model the interfaces and behavior required to validate remote dispatch, command acceptance, lifecycle progression, completion, failure, and cancellation.

The simulation must provide meaningful integration evidence. A mocked API response that simply returns success without exercising the execution lifecycle is insufficient.

The simulator should make it possible to validate:

- Target discovery or configured target selection.
- Request validation.
- Command submission.
- Acceptance or rejection by the target.
- Execution progress.
- Completion and failure.
- Cancellation where supported.
- Communication loss or timeout.
- Duplicate command handling.
- State reporting and diagnostic information.

The simulation must not imply that physical actuators have been operated or that hardware safety requirements have been met.

### 1.3 Engineering outcome

The engineering outcome is a maintainable remote-execution path with explicit interfaces between API handling, execution orchestration, dispatch, simulated target behavior, durable state, and status reporting.

The implementation must keep business validation separate from target-specific execution details. It must avoid embedding simulator-specific assumptions into the public API or making the frontend responsible for authoritative execution state.

The phase must establish enough isolation that a future target adapter can be integrated without rewriting the execution lifecycle contract. Such future adapters remain subject to the scope and acceptance criteria of their owning phases.

### 1.4 Product outcome

A user should be able to initiate an authorized execution request, observe whether the request was accepted, inspect its progress, and obtain an outcome when it completes or fails.

The product experience must distinguish:

- A request being submitted.
- A request being validated.
- An execution being accepted.
- An execution being queued or dispatched.
- An execution being active.
- An execution being completed.
- An execution failing or being cancelled.
- An execution result being available from its authoritative owner.

The exact lifecycle values and transitions are defined in the applicable backend and protocol documents. This dossier defines the required phase-level behavior, not the complete wire-level enumeration.

### 1.5 Completion principle

P5 is complete when the approved remote-execution workflow works end to end against the simulated robot environment, preserves its defined lifecycle and authorization invariants, and produces repeatable verification evidence.

A user-interface demonstration alone is insufficient. A local simulator that bypasses the production execution service path is insufficient. An execution service that reports success without authoritative target acknowledgement and completion evidence is insufficient.

The detailed task-level acceptance conditions are maintained in `ACCEPTANCE_CRITERIA.md`.

---

## 2. Scope and non-scope

### 2.1 In-scope capabilities

P5 includes the phase-level capabilities required to implement, operate, and verify remote execution against a simulated robot environment.

#### 2.1.1 Execution request contract

The execution request must have a defined meaning and validation boundary.

The phase includes:

- Accepting an execution request through the approved API.
- Validating the request structure and required fields.
- Establishing the authenticated caller and authorization context.
- Associating the request with a valid booking or approved execution entitlement where required.
- Validating resource and target references.
- Identifying the supported command or execution payload type.
- Applying supported size, format, and parameter limits.
- Rejecting unsupported commands and malformed requests.
- Returning a stable execution identifier for accepted requests.
- Defining idempotency behavior for repeated submissions where required.
- Returning explicit failure outcomes when validation or authorization fails.

The API contract owns the exact request and response schemas. P5 owns the requirement that the execution service enforce the agreed semantics.

#### 2.1.2 Booking and execution eligibility

P5 consumes the booking and commercial authority established by P4 BOOKING & COMMERCIAL.

Before execution begins, the service must determine whether the request satisfies the required execution eligibility rules. These may include:

- A valid booking identity.
- A booking state that permits execution.
- A resource reference consistent with the booking.
- A supported execution interval or authorization window.
- An authorized caller or service principal.
- The existence of the required artifact or command input.
- The presence of a compatible simulated target.
- The absence of a known condition that makes dispatch invalid.

The exact eligibility policy must be explicit and must use authoritative state.

P5 must not recreate booking validation, reservation conflict detection, credit accounting, or commercial policy. It consumes the approved P4 contracts and rejects requests that fail the required execution eligibility checks.

#### 2.1.3 Execution orchestration

P5 owns the software workflow that coordinates an accepted request from validation through dispatch and terminal outcome.

The orchestration capability includes:

- Creating an execution record.
- Assigning or retaining a stable execution identifier.
- Establishing the initial execution state.
- Selecting or resolving the simulated target.
- Preparing the request for dispatch.
- Tracking dispatch acknowledgement.
- Tracking execution progress and terminal outcomes.
- Persisting state transitions.
- Handling retryable and non-retryable failures.
- Applying supported cancellation semantics.
- Preventing invalid or contradictory lifecycle transitions.
- Exposing authoritative status to authorized consumers.

The orchestration layer must not depend on frontend process state to maintain execution truth. A frontend disconnect must not silently erase or reset an accepted execution.

Detailed service boundaries, worker architecture, dependency injection, and internal module structure belong to `docs/backend/architecture/BACKEND_ARCHITECTURE.md` and the applicable backend implementation documentation.

#### 2.1.4 Simulated execution target

The phase includes a simulated robot target capable of exercising the remote-execution contract.

The simulator must support the minimum behavior needed for end-to-end verification:

- Target identity and supported capability declaration.
- Request acceptance and rejection.
- Command or action processing within the simulation.
- Progress or state updates where supported.
- Completion outcomes.
- Failure outcomes.
- Cancellation or stop behavior where supported by the defined contract.
- Deterministic test scenarios.
- Configurable delay, timeout, or failure injection where useful.
- Diagnostic information that helps explain simulated execution behavior.

The simulator may model robot actions, but it must not be treated as a physical robot controller or a source of certified safety behavior.

The simulator's implementation details, internal state model, and test controls belong to the relevant backend, simulator, or integration documentation. This dossier owns the required phase outcome.

#### 2.1.5 Target selection and compatibility

The execution service must identify a target capable of processing the requested execution type.

For the P5 software-only scope, target selection may use a configured or registered simulated target. The selection mechanism must be explicit and testable.

The phase includes:

- Resolving the target reference.
- Validating that the target is enabled and reachable according to the supported model.
- Checking declared capability compatibility.
- Rejecting unsupported command types.
- Distinguishing target unavailability from request invalidity.
- Defining behavior when the selected target disappears or becomes unavailable.
- Keeping target-specific details behind a defined adapter or dispatch boundary.

P5 does not own the general platform registry or physical resource inventory. It consumes target and resource metadata through approved interfaces.

#### 2.1.6 Dispatch boundary

P5 must define a reliable boundary between execution orchestration and the simulated target.

The dispatch boundary must establish:

- How an execution request is represented for the target.
- How target acceptance is acknowledged.
- How rejection is reported.
- How request identity is correlated with execution identity.
- How timeouts are represented.
- How duplicate delivery is handled or detected.
- How dispatch failures are surfaced.
- How the service distinguishes accepted dispatch from completed execution.
- How target status is correlated with persisted execution state.

A successful dispatch acknowledgement must not be interpreted as proof that the command completed successfully.

The transport implementation and any messaging or communication protocol details belong to the backend and protocol owner documents. P5 defines the lifecycle and correctness requirements that the transport must preserve.

#### 2.1.7 Execution lifecycle

The phase requires a clear lifecycle for an execution request.

At minimum, the implementation must distinguish request acceptance, dispatch progress, active execution, and terminal outcome. Additional intermediate states may be used when required by the implementation, provided their meanings are documented and transitions remain consistent.

The lifecycle must address:

- Creation and acceptance.
- Validation failure.
- Dispatch initiation.
- Target acknowledgement or rejection.
- Execution progress.
- Successful completion.
- Failure.
- Cancellation or termination where supported.
- Timeout or loss of target communication.
- Reconciliation of uncertain outcomes.
- Repeated or delayed status updates.
- Recovery after service restart.

The authoritative lifecycle enumeration and legal transition table belong to the backend implementation and API contract documents.

P5 must ensure that a terminal outcome is not silently overwritten by a stale progress update, that illegal transitions are rejected, and that the reported status reflects authoritative execution state.

#### 2.1.8 Execution state persistence

Execution state must be durable according to the approved database architecture.

The phase requires persistence of the information needed to:

- Identify the execution.
- Associate it with its caller, booking, resource, and target as applicable.
- Track its lifecycle state.
- Correlate dispatch and target responses.
- Record relevant timestamps.
- Store failure classification and diagnostic references.
- Support authorized status retrieval.
- Support idempotency and recovery where required.
- Preserve enough history for investigation and downstream handoff.

The exact schema, indexes, constraints, transaction isolation, and migration strategy belong to the database domain, especially DB-M04 EXECUTION DATA (P5-P7).

The phase must not be accepted on the basis of process-local state alone when the approved product requires durable execution records.

#### 2.1.9 Status queries and progress reporting

P5 includes the service-side capability to retrieve authoritative execution state.

The implementation must support:

- Retrieval by stable execution identifier.
- Authorization checks on status access.
- Consistent status semantics.
- Reporting of terminal outcomes.
- Reporting of supported progress information.
- Clear handling of unknown or inaccessible identifiers.
- Appropriate behavior when the target is temporarily unreachable.
- Protection against stale target messages corrupting authoritative state.
- Correlation of status with the original request and resource context.

Progress may be coarse-grained in the simulated environment. The product must not imply a precision or physical measurement that the simulator does not provide.

Streaming live telemetry and rich interactive sessions belong to P7 LIVE & RESULTS. P5 provides the execution state and progress interfaces needed for that later integration.

#### 2.1.10 Cancellation and termination

P5 includes cancellation or termination behavior where supported by the approved execution contract and simulated target.

The implementation must define:

- Which lifecycle states permit cancellation.
- Whether a cancellation request is accepted, rejected, or already satisfied.
- How cancellation is communicated to the target.
- How acknowledgement is represented.
- What happens when cancellation races with completion.
- How duplicate cancellation requests behave.
- How cancellation failures are reported.
- How final state is reconciled when the target becomes unreachable.

A cancellation request is not proof that the target stopped. The system must distinguish a cancellation request from an authoritative cancelled outcome when the contract requires acknowledgement.

Physical emergency stop, safety-rated stopping, and real actuator inhibition are outside P5 and must not be inferred from simulator behavior.

#### 2.1.11 Retry and idempotency behavior

The execution path must define how retries interact with request identity, dispatch, and target processing.

P5 includes:

- Safe handling of repeated API submissions where idempotency is required.
- Correlation of retries with an existing execution.
- Classification of retryable and non-retryable errors.
- Defined behavior for dispatch timeouts with uncertain target acceptance.
- Prevention of unintended duplicate execution.
- Protection against duplicate status events.
- Bounded retry behavior where retries are supported.
- Observable reporting of exhausted retries or unresolved outcomes.

The implementation must not blindly repeat a non-idempotent physical action in a future adapter. Although P5 targets simulation, the software contract should make duplicate-delivery semantics explicit before additional target types are introduced.

Detailed retry policies, queue configuration, and transport-level delivery guarantees belong to the backend and protocol owner documents.

#### 2.1.12 Failure classification and recovery

The execution service must distinguish failures that require different caller or operator responses.

Relevant failure classes may include:

- Invalid request.
- Authorization failure.
- Ineligible booking.
- Unsupported target capability.
- Target unavailable.
- Dispatch rejection.
- Dispatch timeout.
- Execution failure.
- Execution timeout.
- Cancellation failure.
- Persistence failure.
- Conflicting or stale lifecycle update.
- Uncertain outcome requiring reconciliation.

The exact error codes and API response shape belong to the API contract and backend implementation documents.

P5 must ensure that failure handling does not fabricate a successful outcome, silently discard a valid execution record, or cause uncontrolled repeated dispatch.

#### 2.1.13 Frontend execution workflow

The applicable frontend milestone must expose the user-facing remote-execution workflow.

It must support the agreed user path to:

- Select or reference an eligible execution context.
- Submit a supported execution request.
- Receive the authoritative acceptance result.
- Inspect execution status.
- View progress information when available.
- Understand terminal success, failure, or cancellation.
- Handle timeouts and temporary communication errors.
- Retry safely when the contract permits it.
- Navigate to results when those are available through their owning capability.

The frontend must not independently invent execution status, treat a dispatch acknowledgement as completion, or bypass the backend authorization boundary.

Detailed UI components, state-management patterns, accessibility, and frontend test implementation belong to the frontend domain documents.

#### 2.1.14 Observability and audit context

P5 must provide enough diagnostic information to investigate execution behavior.

The execution path should expose:

- Execution creation and acceptance outcomes.
- Dispatch attempts and acknowledgements.
- Target acceptance and rejection.
- Lifecycle transitions.
- Execution completion and failure.
- Cancellation attempts and outcomes.
- Timeout and retry behavior.
- Simulator availability and communication errors.
- State recovery and reconciliation outcomes.
- Failures during persistence or downstream handoff.

Execution identifiers and correlation identifiers should be used to connect related logs and events. Sensitive request payloads, credentials, and unnecessary personal information must not be logged.

Detailed telemetry names, dashboards, alerts, log pipelines, retention rules, and security controls belong to their authoritative operational and security documents.

#### 2.1.15 Downstream handoff

P5 must make execution outcomes available to the owners of P6 LAB & ROBOT and P7 LIVE & RESULTS through defined integration boundaries.

The handoff must preserve:

- Stable execution identity.
- The associated booking and resource references where applicable.
- Authoritative execution lifecycle state.
- Terminal outcome and failure classification.
- Relevant timestamps and correlation references.
- Authorization requirements for consumers.
- Clear distinction between simulator-generated data and physical observations.

P5 does not own live-session streaming, robot telemetry collection, result interpretation, or lab evidence management. It supplies execution state and outcome references through the agreed contract.

### 2.2 Simulation-specific requirements

The simulation must be capable of exercising the complete supported software lifecycle, not merely returning a fixed successful response.

The phase should include deterministic scenarios for:

- A valid request completing successfully.
- An invalid request being rejected before dispatch.
- An ineligible booking being rejected.
- A target rejecting an unsupported operation.
- A target being unavailable.
- A dispatch timeout.
- An execution failure.
- A repeated submission.
- A cancellation request.
- A service restart while an execution record exists.
- A stale or duplicate target update.
- A downstream status query after completion.

Where the implementation supports configurable failure injection, those controls should be available to automated tests without becoming part of the public product API unless explicitly approved.

Simulation output must be clearly identified as simulated. It must not be represented as physical sensor data, hardware validation, or evidence of safe real-world motion.

### 2.3 Execution and resource boundaries

P5 coordinates execution but does not become the owner of every resource involved in it.

The phase must maintain the following boundaries:

- P4 BOOKING & COMMERCIAL owns booking confirmation, reservation integrity, and commercial effects.
- P5 EXECUTION owns the software execution lifecycle and remote dispatch.
- P6 LAB & ROBOT owns lab and robot integration, including the relevant physical-resource boundary.
- P7 LIVE & RESULTS owns live interaction and results capabilities.
- P8 PRODUCTION owns production deployment and operational readiness.

The execution service may consume information from each domain, but it must not silently redefine their state models.

### 2.4 Execution authorization and booking validity

The service must validate the caller and execution context at the point required by the approved security and booking contracts.

At a minimum, P5 must ensure that:

- The caller is authenticated.
- The caller is authorized to request the operation.
- The referenced booking or entitlement is valid where required.
- The booking belongs to the expected project, workspace, or resource context.
- The requested operation is supported by the selected target.
- The request does not rely solely on client-supplied assertions of eligibility.

Where a booking may become cancelled or expired between request acceptance and dispatch, the approved contract must define whether the service revalidates state before dispatch and how the race is resolved.

P5 consumes the P4 commercial and reservation decision. It does not implement a second credit ledger or an independent booking policy.

### 2.5 Execution lifecycle integrity

The lifecycle implementation must preserve consistent state despite retries, delayed events, service restarts, and target communication failures.

The implementation must define:

- The authority for each lifecycle transition.
- Which transitions are synchronous and which are asynchronous.
- How state updates are persisted.
- How target acknowledgements are correlated.
- How duplicate messages are detected or safely ignored.
- How stale messages are prevented from overwriting newer state.
- How terminal states are preserved.
- How uncertain outcomes are surfaced.
- How reconciliation is performed when the target and service disagree.

The exact transition table and storage mechanism belong to the backend and database implementation documents. P5 acceptance must nevertheless demonstrate the required invariants end to end.

### 2.6 Non-functional expectations

The phase must establish measurable expectations for the supported simulated workflow, including:

- Bounded request-validation latency under the agreed test conditions.
- Bounded dispatch acknowledgement latency for deterministic simulator scenarios.
- Consistent status retrieval.
- Controlled retry behavior.
- Durable state across supported service restarts.
- Predictable failure responses.
- Safe concurrent handling of multiple independent execution requests.
- Sufficient diagnostics to investigate failures.

Numeric targets must be established in the task and acceptance records based on the agreed environment. This dossier does not invent performance targets or imply production-scale capacity.

P5 is not a production capacity certification. Production scaling, high availability, service-level objectives, and operational readiness are owned by P8 PRODUCTION and the relevant operational documents.

### 2.7 Explicit non-scope

The following capabilities are outside P5 EXECUTION unless explicitly approved through a documented scope change:

- General repository bootstrap and common engineering policy.
- Studio foundation and project-management implementation.
- Local build orchestration and artifact packaging.
- Artifact storage and validation internals.
- Identity-provider implementation, account provisioning, and token issuance.
- Platform registry and general resource inventory implementation.
- Booking creation, availability calculation, reservation conflict enforcement, and commercial policy.
- Credit ledger implementation, billing, invoices, external payment settlement, and accounting.
- Physical robot actuation or direct hardware control.
- Safety-rated motion control, emergency-stop circuitry, and physical safety certification.
- EtherCAT master implementation and motor/joint control.
- Hardware driver implementation and physical sensor acquisition.
- Lab booking and lab resource lifecycle beyond the execution integration contract.
- General robot simulation product development beyond the simulator behavior required for P5 verification.
- Rich live telemetry, interactive streaming, and live-session user experience.
- Result interpretation, analytics, and results presentation.
- Production deployment, production infrastructure hardening, and production operations.
- Cloud-provider infrastructure architecture and global observability platform design.
- General database schema architecture and migration operations.
- Global API contract governance and security policy.
- Global testing strategy and release policy.

The required simulated robot environment is an execution test target, not a claim that P5 delivers a complete simulator platform or a physical robotics runtime.

### 2.8 Canonical phase relationship table

| Phase | Relationship to P5 | Boundary |
|---|---|---|
| P0 FOUNDATION | Supplies shared repository, build, and engineering foundations | P5 follows shared conventions |
| P1 STUDIO | Supplies the Studio application foundation and project-facing context | P5 integrates through the established frontend structure |
| P2 BUILD & ARTIFACT | Supplies artifact creation and artifact references | P5 consumes supported artifacts or command inputs; it does not own artifact creation |
| P3 CONTROL PLANE | Supplies identity, authorization context, project and platform metadata, and artifact registration | P5 consumes approved control-plane contracts |
| P4 BOOKING & COMMERCIAL | Supplies confirmed booking and commercial eligibility context | P5 validates execution eligibility without owning booking or credits |
| P5 EXECUTION | Owns remote execution orchestration against a simulated robot environment | Validates, dispatches, tracks, and reports execution |
| P6 LAB & ROBOT | Owns lab and robot integration and physical-resource behavior | Consumes the execution contract for its supported integration |
| P7 LIVE & RESULTS | Owns live interaction and result capabilities | Consumes execution state and outcome references |
| P8 PRODUCTION | Owns production deployment and operational readiness | Deploys and operates accepted capabilities under production controls |

### 2.9 Canonical cross-domain milestone mapping

| Domain | Canonical milestone | Relationship to P5 |
|---|---|---|
| Frontend | F-M01 STUDIO FOUNDATION (P0-P1) | Provides the shared Studio foundation |
| Frontend | F-M02 PROJECTS (P1) | Provides project context |
| Frontend | F-M03 BUILD & ARTIFACT (P2) | Provides artifact-related user experience |
| Frontend | F-M04 BOOKING (P4) | Provides booking context for execution |
| Frontend | F-M05 EXECUTION (P5) | Implements the execution user workflow |
| Frontend | F-M06 LIVE (P7) | Owns live interaction experience |
| Frontend | F-M07 RESULTS (P7) | Owns results presentation |
| Backend | B-M01 CONTROL PLANE (P3) | Supplies identity, project, and control-plane capabilities |
| Backend | B-M02 ARTIFACT (P2-P3) | Supplies artifact registration and discovery contracts |
| Backend | B-M03 PLATFORM (P3) | Supplies platform metadata and capability inputs |
| Backend | B-M04 BOOKING (P4) | Supplies booking and commercial eligibility contracts |
| Backend | B-M05 EXECUTION (P5) | Implements execution orchestration and remote dispatch |
| Backend | B-M06 RESULTS (P6-P7) | Owns lab-associated result and result-service behavior |
| Backend | B-M07 PRODUCTION (P8) | Owns production backend readiness and operations |
| Database | DB-M01 FOUNDATION (P0-P3) | Supplies foundational persistence conventions |
| Database | DB-M02 CORE DATA (P3) | Supplies control-plane data required by execution |
| Database | DB-M03 BOOKING DATA (P4) | Owns booking and commercial persistence |
| Database | DB-M04 EXECUTION DATA (P5-P7) | Persists execution, lab, and results data within its defined scope |
| Cloud | C-M01 FOUNDATION (P0) | Supplies foundational cloud conventions |
| Cloud | C-M02 DEVELOPMENT (P1-P3) | Supplies development infrastructure and environments |
| Cloud | C-M03 STAGING (P4-P7) | Supplies staging infrastructure for execution integration |
| Cloud | C-M04 PRODUCTION (P8) | Owns production infrastructure and operational readiness |

### 2.10 Required execution invariants

All P5 implementations must preserve the following invariants:

- **Authorized request:** execution cannot begin without the required authorization and eligibility checks.
- **Stable identity:** an accepted execution has a stable execution identifier.
- **Authoritative lifecycle:** execution status is derived from the authoritative service state and validated target outcomes.
- **Dispatch distinction:** dispatch acknowledgement is not equivalent to successful completion.
- **Retry safety:** retries do not create unintended duplicate execution.
- **Terminal-state integrity:** stale updates do not overwrite authoritative terminal outcomes.
- **Durable state:** accepted executions retain the required state across supported service restarts.
- **Failure visibility:** failures and uncertain outcomes are reported and diagnosable.
- **Simulation clarity:** simulated outcomes are never presented as physical observations.
- **Booking boundary:** booking and commercial state remain owned by P4 BOOKING & COMMERCIAL.
- **Physical boundary:** physical robot and lab behavior remain owned by P6 LAB & ROBOT.
- **Results boundary:** result interpretation and presentation remain owned by P7 LIVE & RESULTS.
- **Production boundary:** production readiness remains owned by P8 PRODUCTION.

---

## 3. Dependencies

### 3.1 Required upstream dependencies

P5 consumes capabilities from earlier phases through approved interfaces. It must not duplicate those capabilities simply because a dependency is incomplete.

#### P0 FOUNDATION

Required inputs:

- Repository conventions and common build practices.
- Shared error and identifier conventions where defined.
- Automated build and test foundations.
- Configuration and environment conventions.
- Code review and change-management procedures.

P5 must use established shared conventions and resolve missing foundational behavior through the relevant owner rather than introducing incompatible execution-specific standards.

#### P1 STUDIO

Required inputs:

- The established Studio application foundation.
- Shared navigation and user-context conventions.
- The approved client-to-service integration mechanism.
- Project context where needed by the execution workflow.

P5 does not create a separate frontend architecture for execution.

#### P2 BUILD & ARTIFACT

Required inputs:

- Stable artifact references or supported execution-input contracts where applicable.
- Artifact validation and registration semantics.
- Clear behavior for unsupported or unavailable inputs.

The existence of an artifact identifier does not automatically establish that the artifact is executable by the selected target. P5 must validate the supported compatibility and eligibility requirements through approved contracts.

#### P3 CONTROL PLANE

Required inputs:

- Authenticated caller context.
- Authorization and tenancy rules.
- Project or workspace identity.
- Platform and resource metadata required for target selection.
- Artifact registration and discovery where applicable.
- Common API identifiers and error conventions.

P5 must not create a parallel identity system, project registry, or platform registry.

#### P4 BOOKING & COMMERCIAL

Required inputs:

- Stable booking identity.
- Authoritative booking status.
- Resource identity and relevant reservation context.
- Eligibility rules for initiating execution.
- Defined behavior for cancellation or expiration affecting execution.
- Authorized access to booking information.

P5 must consume the booking contract rather than recreate booking, availability, credit, or commercial logic.

### 3.2 Cross-domain dependency matrix

| Dependency | Required input | P5 use | Owner |
|---|---|---|---|
| Authentication | Trusted caller identity | Establish who requested execution | P3 CONTROL PLANE and security owner documents |
| Authorization | Permission and resource scope | Determine whether execution is permitted | Security and control-plane domains |
| Project context | Authorized project or workspace reference | Associate execution with the correct context | P3 CONTROL PLANE |
| Booking | Stable booking identifier and eligibility state | Validate execution preconditions | P4 BOOKING & COMMERCIAL |
| Resource metadata | Resource identity and supported capability information | Resolve the intended target | Applicable resource-owning domain |
| Artifact or input | Stable reference and validation state where applicable | Provide supported execution input | P2 BUILD & ARTIFACT and P3 CONTROL PLANE |
| API contract | Request, response, and error semantics | Integrate clients and services | `docs/protocol/API_CONTRACT.md` |
| Database | Approved persistence and migration conventions | Store execution lifecycle state | Database domain |
| Simulator | Defined target interface and deterministic behavior | Execute and validate remote dispatch | P5 implementation scope |
| Cloud development environment | Required service and database configuration | Run integrated execution tests | Cloud domain |
| Test infrastructure | Unit, contract, integration, and failure-test capability | Verify lifecycle invariants | Global and domain testing owners |
| Live and results contract | Execution identifiers and outcome semantics | Support later consumption | P5 and P7 integration owners |

### 3.3 Dependency on API and protocol contracts

The execution workflow requires an approved contract for:

- Execution request submission.
- Request acceptance and rejection.
- Execution identity.
- Status retrieval.
- Lifecycle and terminal outcomes.
- Cancellation where supported.
- Error classification.
- Idempotency behavior where required.
- Target capability representation where exposed.
- Downstream status and outcome consumption.

The canonical wire definitions belong to `docs/protocol/API_CONTRACT.md` and any applicable protocol-specific owner documents.

P5 must implement the approved contract and provide evidence that the simulated execution path respects it. It must not silently introduce incompatible state names, fields, or error semantics.

### 3.4 Dependency on backend architecture

The backend implementation must establish clear responsibilities for:

- Request validation.
- Execution service orchestration.
- Dispatch abstraction.
- Simulated target adapter.
- Lifecycle state persistence.
- Status retrieval.
- Retry and recovery.
- Error mapping.
- Event or message processing where applicable.

The concrete module layout, service wiring, worker model, configuration, logging, and internal interfaces belong to `docs/backend/architecture/BACKEND_ARCHITECTURE.md` and the applicable backend implementation documentation.

This dossier defines the required behavior and ownership boundary, not the exact class names or package structure.

### 3.5 Dependency on database architecture

P5 requires durable execution state and a reliable mechanism to preserve lifecycle invariants.

The database implementation must support the approved requirements for:

- Execution identity.
- Booking and resource references.
- Lifecycle state.
- Correlation identifiers.
- Dispatch and target acknowledgement references.
- Timestamps.
- Failure details or diagnostic references.
- Idempotency and recovery data where required.
- Historical and audit context.

DB-M04 EXECUTION DATA (P5-P7) owns the execution-related data implementation within its defined scope.

P5 owns the behavioral invariants that the persistence layer must support. It does not select database-specific indexes, locking rules, partitioning, migration mechanics, or backup policy in this dossier.

### 3.6 Dependency on the simulated target

The simulator must provide a stable and testable interface for execution requests and status updates.

The integration must define:

- How the target is identified.
- How capability compatibility is represented.
- How commands are accepted or rejected.
- How execution identity is correlated.
- How progress and terminal outcomes are returned.
- How timeouts and communication loss are represented.
- How duplicate requests are handled.
- How simulated failures can be exercised in tests.

A test double that bypasses the dispatch boundary may be useful for unit tests, but it cannot replace end-to-end evidence against the supported simulator path.

### 3.7 Dependency on cloud development and staging

P5 requires an environment capable of running the execution service, persistence dependencies, and simulated target in the supported configuration.

The cloud domain owns infrastructure provisioning, environment configuration, network policy, secrets management, deployment templates, and infrastructure operations.

P5 owns the application-level configuration and behavior needed to connect the execution service to its simulated target, subject to the approved infrastructure contracts.

The phase must document required environment variables or configuration references in the appropriate implementation guide rather than reproducing infrastructure setup instructions here.

### 3.8 Dependency on security

Execution can cause resource consumption and, in later integrations, may initiate robot actions. Even in the simulated phase, authorization and request validation must be treated as essential controls.

P5 depends on:

- The approved authentication model.
- Authorization rules for the requested resource and operation.
- Project and workspace isolation.
- Input validation requirements.
- Secret-handling conventions.
- Logging and data-classification policy.
- Security review and vulnerability-management processes.

The system security architecture and application security documents own the overall threat model and control requirements. P5 must demonstrate that the execution service applies those controls correctly.

### 3.9 Dependency on P7 LIVE & RESULTS

P7 requires stable execution identifiers and authoritative outcome semantics to associate live interaction and results with the correct execution.

The handoff must establish:

- Which execution states are available to consumers.
- How terminal success and failure are represented.
- How execution metadata is retrieved.
- How the source of data is identified as simulated or physical.
- How consumers access execution information under authorization rules.
- How a later results record can refer to its originating execution.

P5 does not implement the results data model or result interpretation. It provides the execution contract and references required by the consuming domain.

### 3.10 Dependency readiness and blocking policy

A dependency is ready when its contract is available, its owner is identified, and P5 can validate the integration assumptions without relying on undocumented behavior.

Where an upstream implementation is incomplete, isolated development may use a clearly identified test double. The test double must not be represented as evidence that the actual integration has passed.

Dependencies must be classified in the task records as:

- **Blocking:** the relevant P5 acceptance condition cannot be demonstrated correctly or safely.
- **Conditionally blocking:** work can continue, but the affected capability cannot be accepted until the dependency is resolved.
- **Non-blocking:** the dependency concerns a later integration or optional capability and does not invalidate the accepted P5 scope.

The task owner and impact must be recorded in `TASKS.md`, with acceptance evidence recorded in the appropriate sibling file.

### 3.11 Cross-phase handoff table

| Handoff | Producing phase | Consuming phase | Required evidence |
|---|---|---|---|
| Shared engineering foundation | P0 FOUNDATION | P5 EXECUTION | Build, test, and engineering conventions are available |
| Studio and project context | P1 STUDIO | P5 EXECUTION | Required client and project context can be consumed |
| Artifact or execution-input references | P2 BUILD & ARTIFACT | P5 EXECUTION | Supported input identity and validation semantics are documented |
| Identity, projects, platforms, and artifact registration | P3 CONTROL PLANE | P5 EXECUTION | Required contracts and authorization context are available |
| Confirmed booking and eligibility | P4 BOOKING & COMMERCIAL | P5 EXECUTION | Booking identity, state, resource reference, and eligibility semantics are available |
| Remote execution and terminal outcome | P5 EXECUTION | P6 LAB & ROBOT | Execution identity, lifecycle, and integration boundary are documented |
| Execution state and outcome references | P5 EXECUTION | P7 LIVE & RESULTS | Authorized consumers can retrieve authoritative execution state |
| Production deployment and operation | P8 PRODUCTION | Deployed execution capability | Production controls and readiness evidence satisfy the production owner dossier |

---

## 4. Deliverables

The deliverables below describe the phase-level outcomes. Detailed implementation tasks and pass/fail criteria remain in the sibling files.

### 4.1 Execution request and eligibility contract

P5 delivers a documented and implemented request contract that establishes:

- Required request fields and validation semantics.
- Caller and authorization context.
- Booking and resource eligibility requirements.
- Supported execution input types.
- Target compatibility checks.
- Stable execution identity.
- Idempotency expectations.
- Explicit validation and authorization failures.

**Completion evidence:** contract tests and service tests demonstrate that valid requests are accepted and invalid or unauthorized requests are rejected before dispatch.

### 4.2 Remote execution service

P5 delivers the service-side orchestration path from accepted request to terminal outcome.

The service must:

- Create a durable execution record.
- Assign or retain a stable identifier.
- Validate required preconditions.
- Resolve the simulated target.
- Initiate dispatch through the defined boundary.
- Track target acknowledgement and lifecycle progress.
- Persist state changes.
- Return authoritative status.
- Classify failures and preserve diagnostic context.

**Completion evidence:** an integrated test demonstrates the supported execution path from request submission through terminal outcome using the actual service and simulator interfaces.

### 4.3 Simulated robot execution target

P5 delivers a simulator integration that exercises the execution contract.

The target must support the required successful and failure scenarios, including acceptance, rejection, progress where supported, completion, and communication failure. Cancellation must be implemented where included in the accepted contract.

The simulator must provide deterministic behavior suitable for automated testing and must clearly identify its output as simulated.

**Completion evidence:** automated integration tests execute supported scenarios against the simulator and verify both target behavior and authoritative service state.

### 4.4 Dispatch and correlation boundary

P5 delivers a defined dispatch interface between the orchestration service and simulated target.

The interface must preserve:

- Request and execution identity.
- Target identity.
- Acceptance and rejection outcomes.
- Correlation between target responses and the originating execution.
- Timeout and communication-failure semantics.
- Duplicate-delivery behavior.
- Separation between dispatch acknowledgement and execution completion.

**Completion evidence:** integration tests demonstrate that dispatch outcomes are correlated correctly and do not incorrectly imply terminal success.

### 4.5 Execution lifecycle and durable state

P5 delivers a lifecycle implementation with persisted state and valid transition enforcement.

The implementation must:

- Represent accepted, active, and terminal outcomes according to the approved contract.
- Reject invalid transitions.
- Prevent stale updates from corrupting terminal state.
- Persist required state across supported service restarts.
- Preserve execution identity and associated references.
- Support authorized status retrieval.
- Retain relevant failure and diagnostic context.

**Completion evidence:** lifecycle tests verify valid and invalid transitions, terminal-state integrity, persistence, and status retrieval.

### 4.6 Retry, idempotency, and recovery

P5 delivers retry and recovery behavior for the failure modes included in the approved scope.

The implementation must:

- Define behavior for repeated submissions.
- Avoid unintended duplicate executions.
- Classify retryable and non-retryable failures.
- Handle dispatch timeouts with uncertain outcomes.
- Avoid unsafe repeated command delivery.
- Detect duplicate or stale target updates.
- Recover or expose unresolved state after supported service restarts.
- Provide observable failure information when automatic recovery is not possible.

**Completion evidence:** retry, duplicate-request, timeout, and recovery tests demonstrate the documented behavior.

### 4.7 Status and cancellation interfaces

P5 delivers the supported interfaces for execution status and cancellation.

The interfaces must:

- Retrieve status using a stable execution identifier.
- Enforce authorization.
- Report terminal outcomes accurately.
- Represent unknown and inaccessible executions correctly.
- Support cancellation where approved.
- Distinguish a cancellation request from confirmed cancellation when necessary.
- Handle cancellation races and repeated cancellation requests consistently.

**Completion evidence:** contract and integration tests verify status and cancellation behavior for valid, invalid, repeated, and failure scenarios.

### 4.8 Frontend execution workflow

The applicable frontend milestone delivers the user-facing execution workflow.

The workflow must:

- Submit a valid execution request.
- Display authoritative acceptance or rejection.
- Show execution status and available progress.
- Distinguish dispatch from completion.
- Display terminal success, failure, or cancellation.
- Handle communication errors and retryable failures.
- Avoid duplicate actions where practical.
- Preserve the execution identifier for later status retrieval.
- Link to later results capabilities when available.

**Completion evidence:** frontend and integrated user-flow tests verify the supported path and representative failure scenarios.

### 4.9 Booking and control-plane integration

P5 delivers integration with the required P3 CONTROL PLANE and P4 BOOKING & COMMERCIAL contracts.

The integration must:

- Use the approved caller and authorization context.
- Validate the required booking or execution entitlement.
- Resolve project, resource, and target references.
- Reject invalid or unauthorized execution requests.
- Preserve booking ownership and commercial boundaries.
- Avoid parallel project, resource, or booking authorities.

**Completion evidence:** integration tests verify successful eligibility checks and representative authorization, booking-state, and resource-state failures.

### 4.10 Persistence and migration integration

P5 delivers execution behavior using the approved database architecture.

The integrated solution must persist the execution state and references required for the accepted scope. Schema and migration implementation remain owned by the database domain.

**Completion evidence:** integration tests run against supported persistence, verify required state and relationships, and demonstrate the agreed behavior after a supported service restart.

### 4.11 Observability and diagnostics

P5 delivers application-level diagnostics sufficient to investigate execution requests and failures.

The implementation must make it possible to correlate:

- Request acceptance.
- Execution creation.
- Dispatch attempts.
- Target acknowledgement.
- Lifecycle transitions.
- Terminal outcomes.
- Cancellation requests.
- Retry and timeout behavior.
- Persistence failures.
- Downstream handoff failures.

**Completion evidence:** representative success and failure scenarios produce the expected logs, events, or diagnostic records without exposing restricted data.

### 4.12 Downstream integration readiness

P5 delivers a documented and testable handoff for P6 LAB & ROBOT and P7 LIVE & RESULTS.

The handoff must identify:

- The stable execution identifier.
- The relationship to the booking and resource.
- The authoritative lifecycle state.
- The terminal outcome and failure classification.
- The simulation-versus-physical data distinction.
- The authorized retrieval mechanism.
- Known limitations and unsupported behaviors.

**Completion evidence:** relevant contract or integration tests pass, and consuming owners can identify the supported interface without relying on undocumented assumptions.

### 4.13 Verification evidence

P5 delivers verification evidence for:

- Request validation and authorization.
- Booking eligibility.
- Target compatibility.
- Dispatch acknowledgement and rejection.
- Successful simulated execution.
- Execution failure.
- Timeout and communication loss.
- Lifecycle transition correctness.
- Durable state and restart recovery.
- Duplicate requests and idempotency.
- Cancellation where supported.
- Stale or duplicate target updates.
- Status retrieval.
- Frontend-to-backend integration.
- Downstream execution outcome handoff.

The global testing strategy defines common test levels and quality policy. The domain testing documents define detailed execution and diagnostic procedures. `ACCEPTANCE_CRITERIA.md` and `REVIEW_CHECKLIST.md` define the P5-specific evidence required for acceptance.

### 4.14 Documentation and ownership handoff

P5 delivers sufficient documentation for integration and maintenance.

The handoff must identify:

- The execution request contract.
- The lifecycle and transition semantics.
- The dispatch and simulator boundary.
- The persistence and recovery assumptions.
- The retry and idempotency behavior.
- The booking eligibility dependency.
- The status and cancellation interfaces.
- The P6 LAB & ROBOT and P7 LIVE & RESULTS integration points.
- Known limitations and deferred capabilities.
- The authoritative implementation and testing documents.

**Completion evidence:** documentation links resolve, interfaces are described at the appropriate owner location, and downstream teams can identify the supported execution boundary.

### 4.15 Deliverable ownership summary

| Deliverable | Phase-level owner | Implementation owner |
|---|---|---|
| Execution request semantics | P5 EXECUTION | Backend and protocol domains |
| Booking eligibility integration | P5 consumes; P4 owns booking rules | Backend integration owners |
| Execution orchestration | P5 EXECUTION | Backend domain |
| Simulated target behavior | P5 EXECUTION scope | Assigned simulator implementation owner |
| Dispatch interface | P5 EXECUTION | Backend and protocol domains |
| Lifecycle and state persistence | P5 EXECUTION requirements | Backend and database domains |
| Execution data schema and migrations | P5 defines behavioral needs | Database domain |
| Frontend execution workflow | P5 defines required outcome | Frontend domain |
| API wire definitions | P5 defines required behavior | Protocol owner documents |
| Cloud environment | Cloud domain | Cloud domain |
| Live and results handoff | P5 and P7 jointly at the boundary | Backend integration owners |
| Physical robot and lab integration | P6 LAB & ROBOT | Lab and robot domain |
| Production deployment | P8 PRODUCTION | Cloud and production domain owners |
| Global test policy | Global development documentation | Global development owner |
| Detailed P5 acceptance evidence | `ACCEPTANCE_CRITERIA.md` | Task owners and reviewers |

### 4.16 Required phase records

The P5 phase directory maintains the following sibling records:

| File | Purpose |
|---|---|
| `MILESTONE.md` | Phase objective, scope, dependencies, deliverables, risks, exit criteria, and ownership boundaries |
| `TASKS.md` | Work decomposition, dependencies, sequencing, and ownership |
| `ACCEPTANCE_CRITERIA.md` | Detailed pass/fail conditions and required evidence |
| `REVIEW_CHECKLIST.md` | Review checks and evidence inspection |
| `CHANGELOG.md` | Accepted changes and milestone history |
| `GIT_COMMIT_STEP.md` | Repository and commit procedure |

These files are complementary and must not become duplicate specifications. Task details belong in `TASKS.md`; pass/fail criteria belong in `ACCEPTANCE_CRITERIA.md`; reviewer actions belong in `REVIEW_CHECKLIST.md`; history belongs in `CHANGELOG.md`; and commit procedures belong in `GIT_COMMIT_STEP.md`.

---

## 9. Risks

### 9.1 Dispatch acknowledgement is mistaken for completion

**Risk:** The service reports success as soon as the simulator accepts a request.

**Impact:** Users and downstream systems may believe that execution completed when it never started or later failed.

**Mitigation:**

- Define dispatch acknowledgement separately from terminal completion.
- Require authoritative completion evidence before reporting successful completion.
- Test target rejection, delayed completion, and execution failure.
- Ensure frontend status presentation follows the authoritative lifecycle.

**Owner:** Backend domain.

### 9.2 Execution begins without valid booking eligibility

**Risk:** A request is dispatched using stale or client-supplied booking information.

**Impact:** Execution may proceed after cancellation, expiration, or loss of authorization.

**Mitigation:**

- Consume the authoritative P4 BOOKING & COMMERCIAL contract.
- Validate required eligibility at the approved point in the workflow.
- Define behavior for a booking that changes state before dispatch.
- Reject requests that cannot establish eligibility.
- Test invalid, cancelled, and expired booking scenarios where applicable.

**Owner:** Backend integration owners, with P4 contract ownership.

### 9.3 Duplicate submission causes duplicate execution

**Risk:** A client retries after a timeout and the same operation is dispatched more than once.

**Impact:** Duplicate work, conflicting state, or unsafe behavior if the same contract is later used by physical targets.

**Mitigation:**

- Define idempotency semantics.
- Persist request-to-execution correlation where required.
- Reuse the existing execution identity for valid retries.
- Make target duplicate handling explicit.
- Test retry after uncertain dispatch acknowledgement.

**Owner:** Backend domain, with database and protocol support.

### 9.4 Dispatch timeout creates an uncertain outcome

**Risk:** The service times out without knowing whether the target accepted the request.

**Impact:** Blind retries may duplicate execution, while treating the request as failed may hide an active execution.

**Mitigation:**

- Represent uncertain dispatch outcomes explicitly.
- Query or reconcile target state where the supported simulator contract permits.
- Avoid automatic redispatch unless the operation is known to be safe.
- Persist correlation identifiers and diagnostic context.
- Test communication loss around target acceptance.

**Owner:** Backend domain.

### 9.5 Lifecycle state becomes inconsistent

**Risk:** Delayed or duplicated target messages overwrite newer execution state.

**Impact:** A completed execution may appear active, a failed execution may appear successful, or cancellation may be lost.

**Mitigation:**

- Define legal state transitions.
- Validate every state update.
- Reject or safely ignore stale updates.
- Preserve terminal-state integrity.
- Test out-of-order and duplicate event delivery.
- Persist lifecycle transitions according to the database contract.

**Owner:** Backend and database domains.

### 9.6 Execution state is lost on service restart

**Risk:** The service relies on process-local state or fails to recover accepted executions after restart.

**Impact:** Users cannot retrieve status, duplicate work may be dispatched, or terminal outcomes may be lost.

**Mitigation:**

- Persist the required execution state.
- Define startup recovery behavior.
- Reconcile incomplete executions according to the supported target contract.
- Test restart during queued, active, and terminal scenarios.
- Avoid claiming recovery guarantees that have not been verified.

**Owner:** Backend and database domains.

### 9.7 Simulator provides unrealistic success-only behavior

**Risk:** The simulator always accepts and completes commands successfully.

**Impact:** Important failure handling, timeout, cancellation, and recovery paths remain untested.

**Mitigation:**

- Define deterministic success and failure scenarios.
- Exercise target rejection and communication loss.
- Support repeatable failure injection where practical.
- Verify service state as well as simulator output.
- Keep simulation test controls separate from public product behavior unless approved.

**Owner:** P5 simulator implementation owner.

### 9.8 Simulator output is confused with physical evidence

**Risk:** Simulated completion or telemetry is presented as evidence of real robot movement or sensor observation.

**Impact:** Misleading product claims and unsafe assumptions about physical readiness.

**Mitigation:**

- Mark simulation origin explicitly.
- Keep simulator and physical target types distinguishable.
- Avoid presenting simulated values as measured physical data.
- Document the limits of the simulation.
- Require separate validation before physical integration is accepted.

**Owner:** P5 and P6 integration owners.

### 9.9 Authorization is checked only in the frontend

**Risk:** A caller bypasses the UI and invokes the execution API directly.

**Impact:** Unauthorized resource use or access to another workspace's execution records.

**Mitigation:**

- Enforce authorization in trusted backend services.
- Validate project, workspace, booking, and resource relationships.
- Test direct API access and identifier substitution.
- Do not treat an opaque identifier as an authorization mechanism.
- Follow the established security architecture.

**Owner:** Backend and security domains.

### 9.10 Execution target compatibility is insufficiently validated

**Risk:** A request is dispatched to a target that does not support the requested command or input format.

**Impact:** Predictable execution failures, invalid state, or misleading acceptance results.

**Mitigation:**

- Define target capabilities.
- Validate compatibility before dispatch.
- Reject unsupported operations explicitly.
- Test capability mismatch.
- Keep target-specific behavior behind the dispatch boundary.

**Owner:** Backend domain.

### 9.11 Cancellation is reported before it is confirmed

**Risk:** A cancellation request is treated as proof that the target has stopped.

**Impact:** The service reports a terminal state inconsistent with the actual target state.

**Mitigation:**

- Distinguish cancellation requested from cancellation confirmed where necessary.
- Define the behavior when completion races with cancellation.
- Handle target unavailability and missing acknowledgement.
- Test repeated cancellation and cancellation failure.
- Do not equate simulated cancellation with a physical emergency stop.

**Owner:** Backend domain.

### 9.12 Retry policy causes uncontrolled dispatch

**Risk:** Repeated transient failures trigger unbounded retries or retry non-idempotent operations.

**Impact:** Resource exhaustion, repeated execution, noisy failures, or unpredictable simulator behavior.

**Mitigation:**

- Classify retryable errors.
- Bound retry behavior where retries are supported.
- Define backoff and termination behavior in implementation documentation.
- Preserve request and execution correlation.
- Test retry exhaustion and duplicate suppression.

**Owner:** Backend domain.

### 9.13 Execution state and target state diverge

**Risk:** The simulator and execution service disagree after a timeout, restart, or lost status message.

**Impact:** The service exposes a stale or incorrect execution outcome.

**Mitigation:**

- Define the authority for each state transition.
- Correlate target messages with the execution record.
- Detect missing or conflicting updates.
- Provide an explicit reconciliation path where supported.
- Expose unresolved uncertainty rather than inventing a terminal result.

**Owner:** Backend and database domains.

### 9.14 Persistence failure corrupts lifecycle behavior

**Risk:** A target accepts a command but the service cannot persist the resulting lifecycle state.

**Impact:** The command may be active without a recoverable record or may be dispatched repeatedly after a retry.

**Mitigation:**

- Define the ordering of persistence and dispatch.
- Establish recovery behavior for partial failures.
- Use the approved database transaction and consistency mechanisms.
- Test persistence failures around dispatch boundaries.
- Make incomplete or uncertain state observable.

**Owner:** Backend and database domains.

### 9.15 Execution API and implementation contract drift

**Risk:** The service, frontend, simulator, and downstream consumers use different interpretations of execution states or errors.

**Impact:** Broken integrations and inconsistent user-visible outcomes.

**Mitigation:**

- Maintain one authoritative API contract.
- Use contract tests.
- Review changes through the approved workflow.
- Avoid duplicating wire definitions in implementation-specific documents.
- Validate the full simulated workflow after contract changes.

**Owner:** Protocol and backend domains.

### 9.16 Execution data leaks through status or diagnostics

**Risk:** Status endpoints, error responses, logs, or traces expose restricted payloads or other users' execution data.

**Impact:** Security and privacy violations.

**Mitigation:**

- Enforce authorization on status retrieval.
- Apply data minimization to logs and errors.
- Protect secrets and sensitive request payloads.
- Test unauthorized status queries.
- Follow the security and logging policy.

**Owner:** Backend and security domains.

### 9.17 Frontend reports stale or invented status

**Risk:** The UI maintains a local execution state that diverges from the service or reports completion based on a timeout or dispatch response.

**Impact:** Users make decisions based on incorrect execution status.

**Mitigation:**

- Treat backend status as authoritative.
- Distinguish submission, dispatch, active execution, and terminal outcome.
- Handle stale responses and temporary connectivity loss.
- Test reload and reconnect behavior.
- Avoid optimistic terminal-state updates.

**Owner:** Frontend and backend domains.

### 9.18 Downstream result integration is ambiguous

**Risk:** P7 LIVE & RESULTS cannot reliably associate results with their originating execution.

**Impact:** Results may be lost, duplicated, or associated with the wrong request.

**Mitigation:**

- Preserve stable execution identifiers.
- Define terminal outcome semantics.
- Document the authorized retrieval path.
- Identify simulated data clearly.
- Validate the contract with downstream consumers.

**Owner:** P5 and P7 integration owners.

### 9.19 Scope expands into physical robot control

**Risk:** P5 begins implementing hardware drivers, motor control, safety-rated stopping, or physical robot behavior.

**Impact:** Ownership confusion, unverified physical risk, and delayed software-only acceptance.

**Mitigation:**

- Keep the required target simulated.
- Maintain a clear dispatch adapter boundary.
- Route physical integration to P6 LAB & ROBOT.
- Do not treat simulator tests as hardware-safety evidence.
- Require an explicit scope decision for any proposed physical integration.

**Owner:** P5 phase owner and P6 domain owner.

### 9.20 Cloud or production assumptions block local verification

**Risk:** Execution testing requires undeclared production infrastructure or relies on environment-specific configuration.

**Impact:** Poor reproducibility and delayed integration testing.

**Mitigation:**

- Document development prerequisites in the appropriate setup guide.
- Keep application configuration separate from infrastructure provisioning.
- Provide a repeatable supported simulator test path.
- Validate against the agreed development and staging environments.
- Leave production readiness to P8 PRODUCTION.

**Owner:** Backend and cloud domains.

### 9.21 Acceptance relies only on a happy-path demo

**Risk:** A single successful simulated execution is treated as complete verification.

**Impact:** Authorization, concurrency, retry, recovery, and failure-handling defects remain undiscovered.

**Mitigation:**

- Verify the critical lifecycle invariants.
- Exercise negative and failure scenarios.
- Test durable state and restart behavior.
- Require contract and integration evidence.
- Use the authoritative acceptance and review records.

**Owner:** P5 phase owner and reviewers.

### 9.22 Ownership boundaries become blurred

**Risk:** P5 duplicates booking, lab, results, or production functionality.

**Impact:** Conflicting state models, duplicated business rules, and unclear maintenance responsibility.

**Mitigation:**

- Keep P4 booking and commercial semantics authoritative.
- Keep P5 execution orchestration and simulated dispatch authoritative.
- Keep P6 lab and robot integration authoritative.
- Keep P7 live interaction and results authoritative.
- Keep P8 production readiness authoritative.
- Link to owner documents instead of repeating their implementation specifications.

**Owner:** P5 phase owner and relevant domain owners.

---

## 10. Exit criteria

P5 EXECUTION may be declared complete only when the approved remote-execution workflow is implemented and verified against the simulated robot environment, and the required lifecycle, authorization, persistence, and integration invariants are demonstrated.

A UI-only demonstration, a fixed-response mock, or a success-only simulator is not sufficient evidence.

The authoritative detailed pass/fail conditions are maintained in `ACCEPTANCE_CRITERIA.md`. Review execution and evidence inspection are maintained in `REVIEW_CHECKLIST.md`.

### 10.1 Scope and ownership

- [ ] The accepted P5 scope is consistent with this dossier.
- [ ] Remote execution against a simulated robot environment is the demonstrated target.
- [ ] Execution orchestration and booking/commercial ownership are clearly separated.
- [ ] Execution and physical robot ownership are clearly separated.
- [ ] Execution and live/results ownership are clearly separated.
- [ ] Production deployment and operational readiness remain outside P5.
- [ ] Cross-domain dependencies have named owners.
- [ ] The canonical phase and milestone references follow the frozen model.
- [ ] The sibling task, acceptance, review, changelog, and Git procedure files are maintained separately.

### 10.2 Request validation and authorization

- [ ] The execution request contract is documented and implemented.
- [ ] Required fields and supported input types are validated.
- [ ] Authentication and authorization are enforced by trusted services.
- [ ] Required booking or execution eligibility is validated.
- [ ] Resource and target references are checked.
- [ ] Unsupported requests are rejected before dispatch.
- [ ] Invalid or unauthorized requests do not create unintended active executions.
- [ ] Cross-workspace or cross-project access attempts are tested.
- [ ] Failure responses follow the approved API contract.

### 10.3 Remote dispatch and simulator

- [ ] The execution service dispatches through the defined target boundary.
- [ ] The simulator identifies its supported capabilities.
- [ ] The simulator accepts and rejects supported test requests as specified.
- [ ] Request identity and execution identity are correlated correctly.
- [ ] Dispatch acknowledgement is distinct from execution completion.
- [ ] A valid simulated execution reaches the expected terminal outcome.
- [ ] Failure, timeout, and target-unavailable scenarios are exercised.
- [ ] Simulation output is explicitly distinguishable from physical observations.
- [ ] The integration test uses the actual supported service-to-simulator path.

### 10.4 Lifecycle integrity

- [ ] The lifecycle states and transitions are documented in the authoritative implementation contract.
- [ ] Valid transitions succeed.
- [ ] Invalid transitions are rejected.
- [ ] Terminal outcomes are authoritative.
- [ ] Stale updates do not overwrite newer or terminal state.
- [ ] Duplicate target messages are handled consistently.
- [ ] Failure and uncertain outcomes are represented without fabricated success.
- [ ] Status retrieval reflects the persisted authoritative state.
- [ ] Cancellation behavior is verified where cancellation is in the accepted scope.

### 10.5 Idempotency and recovery

- [ ] Repeated request behavior is documented.
- [ ] Required idempotency guarantees are implemented.
- [ ] Repeated submissions do not create unintended duplicate executions.
- [ ] Dispatch timeout behavior is defined and tested.
- [ ] Retryable and non-retryable failures are distinguished.
- [ ] Retry behavior is bounded where retries are supported.
- [ ] Duplicate and stale status updates are handled safely.
- [ ] Supported service restart scenarios preserve execution identity and required state.
- [ ] Uncertain outcomes remain visible and can be investigated.
- [ ] Recovery behavior does not blindly redispatch non-idempotent operations.

### 10.6 Persistence and database integration

- [ ] Required execution state is durable.
- [ ] Execution identity and relevant booking, resource, and target references are persisted.
- [ ] Required lifecycle timestamps and failure context are retained.
- [ ] Migrations apply successfully in the supported environment.
- [ ] Required database integrity mechanisms are in place.
- [ ] Integration tests validate persisted state.
- [ ] Supported restart recovery is verified against persisted records.
- [ ] Database implementation details remain owned by the database domain.

### 10.7 Frontend and API integration

- [ ] The frontend can submit a supported execution request.
- [ ] The UI reports authoritative acceptance and rejection.
- [ ] The UI distinguishes dispatch acknowledgement from completion.
- [ ] The UI retrieves status through the approved contract.
- [ ] Terminal success, failure, and cancellation are presented correctly where supported.
- [ ] Temporary connectivity failures do not fabricate terminal outcomes.
- [ ] Retry actions follow the idempotency contract.
- [ ] The execution identifier is preserved for subsequent status retrieval.
- [ ] Frontend and backend integration tests pass for the supported workflow.

### 10.8 Downstream integration

- [ ] The P5 execution contract is documented for P6 LAB & ROBOT where applicable.
- [ ] The P5 execution contract is documented for P7 LIVE & RESULTS.
- [ ] Stable execution identifiers are available to authorized consumers.
- [ ] Terminal outcome and failure semantics are explicit.
- [ ] Simulation origin is distinguishable from physical data.
- [ ] Downstream consumers do not need to infer execution success from dispatch acknowledgement.
- [ ] Contract or integration evidence verifies the agreed handoff.
- [ ] P5 does not implement downstream lab, results, or production ownership.

### 10.9 Observability and security

- [ ] Execution requests and outcomes can be correlated.
- [ ] Dispatch attempts and target responses are diagnosable.
- [ ] Failure, timeout, retry, and recovery outcomes are observable.
- [ ] Status endpoints enforce authorization.
- [ ] Logs and errors avoid exposing secrets or unnecessary sensitive data.
- [ ] Relevant security findings are resolved or formally dispositioned.
- [ ] Diagnostic evidence is sufficient to investigate representative failures.
- [ ] Operational infrastructure implementation remains owned by the appropriate domain.

### 10.10 Verification evidence

- [ ] Unit tests cover request validation and lifecycle rules.
- [ ] Contract tests cover execution request and status interfaces.
- [ ] Integration tests exercise the supported service-to-simulator path.
- [ ] Tests cover successful simulated execution.
- [ ] Tests cover invalid and unauthorized requests.
- [ ] Tests cover target rejection and unavailability.
- [ ] Tests cover dispatch timeout and uncertain outcomes.
- [ ] Tests cover duplicate submission and idempotency.
- [ ] Tests cover lifecycle transition and stale-update behavior.
- [ ] Tests cover persistence and supported restart recovery.
- [ ] Tests cover cancellation where supported.
- [ ] Tests cover frontend-to-backend integration.
- [ ] Test results are repeatable and linked from the acceptance records.
- [ ] Any accepted exception has an explicit owner and documented disposition.

### 10.11 Documentation and handoff

- [ ] The execution request and status contracts are documented.
- [ ] The lifecycle and transition semantics are documented by their authoritative owner.
- [ ] The dispatch and simulator boundary is documented.
- [ ] Retry, idempotency, timeout, and recovery behavior are documented.
- [ ] Booking eligibility dependencies are linked to their authoritative owner.
- [ ] Persistence and migration details are linked to the database owner.
- [ ] Cloud and environment setup details are linked to the cloud and development owner documents.
- [ ] The P6 LAB & ROBOT and P7 LIVE & RESULTS handoffs are documented.
- [ ] Known limitations and deferred capabilities are recorded.
- [ ] The sibling task, acceptance, review, changelog, and Git procedure files are complete for the agreed scope.
- [ ] Detailed implementation specifications remain in their authoritative documents.

### 10.12 Final phase acceptance

P5 EXECUTION is ready for formal acceptance when:

1. The approved remote-execution path operates end to end against the simulated robot environment.
2. Request validation and authorization are enforced.
3. Dispatch acknowledgement and terminal completion are clearly distinguished.
4. Execution identity and lifecycle state are durable and authoritative.
5. Retry, timeout, duplicate-request, and recovery behavior satisfy the accepted contract.
6. Required integration and contract tests pass.
7. The frontend reflects authoritative execution outcomes.
8. The downstream handoffs are documented and validated.
9. Critical risks are mitigated or formally dispositioned by their owners.
10. The required evidence is available through the sibling acceptance and review records.
11. No unresolved defect invalidates authorization, lifecycle integrity, idempotency, or reliable outcome reporting.
12. Remaining work is explicitly assigned to its authoritative phase or domain owner.

Acceptance of P5 does not imply that physical robot control, lab operation, live interaction, results processing, or production readiness is complete. Those outcomes remain governed by their respective canonical phases and authoritative milestone dossiers.
