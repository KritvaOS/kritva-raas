# P6 LAB & ROBOT — Milestone Dossier

**Primary Phase:** P6 LAB & ROBOT

**Supporting Phases:** P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE; P4 BOOKING & COMMERCIAL; P5 EXECUTION; P7 LIVE & RESULTS; P8 PRODUCTION

**Document Type:** Phase-level milestone dossier

**Status:** Planning baseline

**Scope Authority:** This document defines the phase-level objectives, boundaries, dependencies, deliverables, risks, and exit criteria for P6 LAB & ROBOT. The milestone dossiers under `docs/**/milestones/` are authoritative for their respective milestone scopes.

---

## Ownership and Boundaries

### What this document owns

This document owns the phase-level definition of P6 LAB & ROBOT, focused on the Lab Agent and physical robot integration.

It defines:

- The objectives and expected outcomes of the lab and robot integration phase.
- The boundary between software execution and physical resource interaction.
- The requirements for a Lab Agent that connects a lab resource to the platform through approved contracts.
- The requirements for integrating physical robot resources with the execution and resource-management workflows.
- The requirements for resource health, capability reporting, command mediation, telemetry collection, and fault reporting within the approved scope.
- The safety boundary between software orchestration and hardware-enforced protective mechanisms.
- The dependencies on booking, execution, identity, platform, and infrastructure domains.
- The deliverables, phase-level risks, and exit criteria for P6.
- The integration handoffs to P5 EXECUTION and P7 LIVE & RESULTS.

P6 establishes a controlled, observable software integration boundary between the platform and physical lab or robot resources. It does not imply that a robot is safe for unsupervised operation merely because its software interface is reachable or a simulated execution succeeded.

### What this document does not own

This dossier does not define individual tasks, detailed acceptance tests, review procedures, change history, or Git commands.

Those responsibilities belong to the sibling files:

- [`TASKS.md`](TASKS.md) — task decomposition, sequencing, dependencies, and ownership.
- [`ACCEPTANCE_CRITERIA.md`](ACCEPTANCE_CRITERIA.md) — detailed, verifiable acceptance conditions and evidence.
- [`REVIEW_CHECKLIST.md`](REVIEW_CHECKLIST.md) — reviewer checks and evidence inspection.
- [`CHANGELOG.md`](CHANGELOG.md) — milestone changes and accepted updates.
- [`GIT_COMMIT_STEP.md`](GIT_COMMIT_STEP.md) — repository and commit procedure.

This document does not replace the system architecture, backend implementation architecture, API contracts, database architecture, cloud architecture, security architecture, testing strategy, or release procedures.

### Ownership map

| Concern | Authoritative owner | P6 relationship |
|---|---|---|
| Canonical phase definitions | `planning/PHASES.md` | Uses the frozen phase model |
| System-level decisions | `planning/DECISIONS.md` | Consumes approved system decisions |
| System architecture | `docs/architecture/` | Follows cross-domain ownership boundaries |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` | Implements Lab Agent and robot integration services |
| API wire contract | `docs/protocol/API_CONTRACT.md` | Uses the approved request, response, and error contract |
| Security architecture | `docs/architecture/SECURITY_ARCHITECTURE.md` and `docs/security/` | Applies identity, authorization, trust, and audit requirements |
| Database implementation | `docs/database/architecture/DATABASE_ARCHITECTURE.md` | Persists lab and robot integration state |
| Cloud implementation | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` | Provides the required development and staging infrastructure |
| Global development workflow | `docs/development/` | Follows shared engineering and review policy |
| Global testing strategy | `docs/development/TESTING_STRATEGY.md` | Follows common verification policy |
| Global release process | `docs/development/RELEASE_PROCESS.md` | Follows shared release policy |
| Resource reservation and commercial rules | P4 BOOKING & COMMERCIAL dossier and domain documents | Supplies authorized resource reservations and commercial context |
| Remote execution orchestration | P5 EXECUTION dossier and domain documents | Supplies execution requests and lifecycle contracts |
| Lab Agent and physical robot integration outcomes | This document | Authoritative at phase level |
| P6 tasks | `TASKS.md` | Authoritative for task decomposition |
| P6 acceptance | `ACCEPTANCE_CRITERIA.md` | Authoritative for detailed acceptance |
| P6 review | `REVIEW_CHECKLIST.md` | Authoritative for review execution |
| P6 change history | `CHANGELOG.md` | Authoritative for milestone history |
| P6 Git procedure | `GIT_COMMIT_STEP.md` | Authoritative for commit procedure |

Implementation-specific questions must be resolved through the designated owner documents rather than by expanding this phase dossier into a second architecture or safety specification.

---

## 1. Objective

P6 LAB & ROBOT establishes the software integration needed to connect the platform's execution capabilities to lab resources and physical robot systems through a controlled Lab Agent boundary.

The phase extends the software-only execution path established by P5 EXECUTION into a lab and robot environment. It introduces the integration mechanisms required to identify connected resources, report their capabilities and health, mediate supported commands, collect relevant telemetry, and report physical-resource outcomes through approved interfaces.

The primary objective is to make physical lab and robot resources accessible to the platform through explicit, observable, and controlled software contracts while preserving the separation between platform orchestration and hardware-specific behavior.

### 1.1 Primary outcomes

P6 is intended to establish the following outcomes:

1. A Lab Agent can establish a controlled connection between a supported lab or robot resource and the platform.
2. The agent has a stable identity and reports its supported capabilities.
3. The platform can determine whether the connected resource is available and eligible for the requested integration workflow.
4. Physical robot resources can be represented through the approved resource and capability contracts.
5. Supported commands can be translated and mediated through a defined adapter boundary.
6. The agent can report command acceptance, progress, completion, and failure where supported.
7. Relevant physical-resource telemetry can be collected and exposed through approved interfaces.
8. Communication loss and resource faults are detected and reported.
9. Reconnection and recovery behavior is explicit and testable.
10. Agent and resource access are authenticated and authorized.
11. Physical safety controls remain independent of ordinary software status and command success.
12. Resource state and integration events are observable and diagnosable.
13. The implementation preserves the execution lifecycle contract established by P5 EXECUTION.
14. Live interaction and result consumers can access the required resource and execution context through approved contracts.
15. The supported integration can be verified in a controlled environment with documented safety precautions.

### 1.2 Lab Agent outcome

The Lab Agent provides the software boundary between platform services and the connected lab or robot resource.

The agent is responsible, within the approved implementation scope, for:

- Establishing its identity and connection to the platform.
- Advertising supported capabilities.
- Reporting resource availability and health.
- Accepting only authorized and supported requests.
- Translating platform-level operations into target-specific operations.
- Reporting acknowledgement and completion information.
- Collecting supported telemetry and fault information.
- Handling communication loss and reconnect scenarios.
- Maintaining correlation between platform requests and target operations.
- Preventing unsupported requests from reaching the resource.
- Exposing sufficient diagnostics for integration and troubleshooting.

The agent must not be treated as a substitute for a safety-rated controller, a certified protective system, or a hardware emergency-stop mechanism.

### 1.3 Physical robot integration outcome

P6 establishes a supported integration path to physical robot hardware without embedding hardware-specific behavior into the general execution orchestration contract.

The integration should identify the physical interface, capability mapping, command boundary, feedback path, and fault behavior for each supported robot configuration.

The first accepted configuration must be explicitly bounded. Supporting one robot or lab configuration does not imply compatibility with every robot, actuator, sensor, controller, or communication protocol.

The supported robot configuration and its limitations must be documented and validated through the relevant acceptance evidence.

### 1.4 Lab integration outcome

The lab integration must provide the minimum facilities needed to connect, identify, observe, and control a supported lab resource through the approved software boundary.

Depending on the accepted resource configuration, this may include:

- Lab Agent deployment and configuration.
- Resource identity and registration.
- Connection and health reporting.
- Capability discovery.
- Command mediation.
- Telemetry forwarding.
- Fault reporting.
- Resource availability reporting.
- Diagnostic collection.
- Controlled startup and shutdown.
- Recovery from communication interruption.

P6 does not automatically include a full lab inventory-management product, generalized laboratory scheduling, or a universal adapter framework. Those capabilities must be separately scoped if required.

### 1.5 Safety outcome

The phase must demonstrate that software access to physical resources is bounded by explicit safety assumptions and approved operating procedures.

At a minimum, the integration must define:

- Which actions are permitted.
- Which commands are rejected.
- Which authority approves physical operation.
- Which hardware or controller mechanisms enforce protective limits.
- How communication failure affects command acceptance and ongoing operation.
- How faults are reported.
- How recovery is permitted.
- How an operator can prevent or interrupt unsafe operation through the approved independent mechanism.
- What evidence is required before a physical test is authorized.

A successful software test is not evidence of safety certification. A reported `HEALTHY` state is not proof that the physical system is safe to move.

### 1.6 Completion principle

P6 is complete when the agreed Lab Agent and physical robot integration path is implemented, its supported capabilities and safety assumptions are documented, and the required verification evidence demonstrates correct behavior under normal and fault conditions.

A connected robot that accepts a command is not sufficient evidence of phase completion. The phase must also establish correct authorization, command mediation, telemetry and fault reporting, recovery behavior, and the required safety controls for the accepted configuration.

Detailed task-level acceptance conditions are maintained in `ACCEPTANCE_CRITERIA.md`.

---

## 2. Scope and non-scope

### 2.1 In-scope capabilities

P6 includes the capabilities required to integrate a supported lab or physical robot resource through a Lab Agent.

#### 2.1.1 Lab Agent identity and connection

The Lab Agent must have an explicit identity and controlled connection lifecycle.

The phase includes:

- Establishing a stable agent identity.
- Configuring the agent for an approved lab or robot resource.
- Establishing an authenticated connection to the platform.
- Reporting connection and registration status.
- Detecting loss of the platform connection.
- Detecting loss of the resource connection where supported.
- Reconnecting according to an approved recovery policy.
- Preventing an unauthenticated or unregistered agent from receiving protected commands.
- Maintaining correlation between the agent, resource, and supported execution context.
- Reporting agent version and supported capability information where required.

Agent identity must be bound to the approved authentication and authorization model. A device name or network address alone is not an identity or authorization credential.

Detailed credential provisioning, certificate management, secret storage, and transport security belong to the security and cloud implementation documents.

#### 2.1.2 Resource registration and identity

P6 must support the resource identity needed to connect a physical or lab resource to the platform.

The integration must establish:

- A stable resource identifier.
- The relationship between the Lab Agent and its managed resource.
- Resource type and supported capability information.
- The distinction between a configured resource and a connected resource.
- The distinction between a connected resource and a healthy resource.
- The handling of duplicate or conflicting registration.
- The behavior when resource identity or configuration changes.
- The reporting of disabled, unavailable, or faulted resources.
- The association between a physical resource and the platform context that is authorized to use it.

P6 consumes the applicable platform and resource-management contracts. It does not create a parallel global platform registry.

#### 2.1.3 Capability discovery

The agent must advertise the operations and telemetry supported by its configured target.

Capabilities may include, when supported by the accepted hardware configuration:

- Supported command types.
- Supported motion or action primitives.
- Joint or actuator interface availability.
- Encoder or position feedback availability.
- Sensor or status channels.
- Supported operating modes.
- Supported control rates.
- Available fault and health signals.
- Supported cancellation or stop behavior.
- Supported diagnostics.

The advertised capability set must match the implementation. The agent must not claim support for a command that it cannot validate or execute through the configured hardware boundary.

Capability discovery does not itself authorize a command. Authorization, resource eligibility, and safety checks remain separate requirements.

#### 2.1.4 Hardware adapter boundary

P6 includes an adapter boundary between the Lab Agent's platform-facing contract and the physical hardware or controller interface.

The adapter must isolate target-specific details such as:

- Controller communication.
- Vendor-specific command formats.
- Hardware identifiers.
- Feedback and telemetry formats.
- Device-specific error codes.
- Supported operating modes.
- Connection establishment and recovery.
- Command acknowledgement and completion interpretation.

The adapter must translate between the approved platform-facing operation and the actual supported target interface without silently changing the requested operation's meaning.

Hardware-specific code must not leak into the public execution API or cause the platform to depend on vendor-specific details unless the architecture explicitly permits such exposure.

The exact adapter interfaces, packages, and implementation patterns belong to the backend and hardware integration documents.

#### 2.1.5 Command mediation

P6 must provide a controlled command path from an authorized execution request to the supported physical or lab resource.

The command path must:

- Validate the command type and required parameters.
- Verify that the configured resource advertises the required capability.
- Verify the applicable authorization and operating conditions.
- Reject malformed or unsupported commands.
- Preserve execution and request correlation.
- Translate commands through the approved adapter.
- Report target acknowledgement or rejection.
- Report completion or failure where the hardware interface supports it.
- Prevent unauthorized direct bypass of the approved command boundary.
- Preserve a clear distinction between command submission, acceptance, active operation, and terminal outcome.

The exact execution lifecycle remains owned by P5 EXECUTION. P6 provides the target-facing behavior and reports the outcomes needed by that lifecycle.

#### 2.1.6 Physical feedback and telemetry

P6 includes collection and forwarding of telemetry required by the accepted lab and robot integration.

Depending on the supported configuration, telemetry may include:

- Resource connection state.
- Controller state.
- Robot operating mode.
- Joint or actuator feedback.
- Position or velocity measurements where available.
- Encoder feedback.
- Sensor values required by the supported integration.
- Temperature or fault signals when exposed by the target.
- Command progress or completion feedback.
- Resource health and diagnostic codes.

The implementation must identify the source, units, timestamps, and validity of telemetry where those attributes are available and necessary for correct interpretation.

Missing, stale, invalid, or unavailable measurements must not be represented as fresh, valid physical observations.

The exact telemetry schema, streaming transport, retention, and visualization belong to their respective domain documents.

#### 2.1.7 Health and fault reporting

The Lab Agent must report the health and fault information required to make the resource's operating condition visible to authorized platform services.

The phase includes:

- Detecting supported connection failures.
- Reporting controller or adapter faults.
- Reporting unsupported or rejected commands.
- Reporting stale or unavailable feedback.
- Distinguishing agent health from resource health.
- Distinguishing communication health from physical safety status.
- Exposing diagnostic codes or references.
- Preserving relevant fault context.
- Defining which faults prevent new commands.
- Defining which faults require operator intervention before recovery.

Health reporting must not be used as a substitute for hardware-enforced protective mechanisms. A software-reported health value can be delayed, incomplete, or unavailable during a failure.

The global health model and shared status types belong to their authoritative contracts and architecture documents. P6 defines how the supported integration maps target-specific conditions to those contracts.

#### 2.1.8 Connection loss and recovery

The integration must define behavior when communication between the platform, Lab Agent, and physical target is interrupted.

The phase includes:

- Detecting connection loss according to the supported interface.
- Reporting degraded or unavailable status.
- Preventing new commands when required preconditions cannot be verified.
- Defining the behavior of an operation already in progress.
- Reconnecting according to an explicit policy.
- Re-establishing resource identity and capability state.
- Avoiding blind replay of non-idempotent commands.
- Reconciling uncertain command outcomes where the target interface permits it.
- Reporting unresolved state to the platform.
- Requiring the approved recovery process before resuming restricted operations.

The correct response to communication loss depends on the physical system and its independent safety design. P6 must not assume that loss of network connectivity automatically stops a robot.

#### 2.1.9 Resource availability and readiness

The agent must provide the information required to determine whether the connected resource is available for an authorized workflow.

Availability and readiness may depend on:

- Agent connection state.
- Resource connection state.
- Controller status.
- Supported operating mode.
- Active fault conditions.
- Capability compatibility.
- Maintenance or operator-controlled disablement.
- Local interlocks or controller-reported permissives.
- The applicable booking and execution context.

P6 reports physical and integration readiness information through approved contracts. P4 BOOKING & COMMERCIAL owns reservation and commercial availability semantics; P5 EXECUTION owns execution eligibility and orchestration.

P6 must not independently confirm bookings or create commercial reservations.

#### 2.1.10 Controlled startup and shutdown

The phase includes the software lifecycle needed to initialize and shut down the Lab Agent and its integration adapters.

The implementation must define:

- Configuration validation before connection.
- Resource discovery or configured resource resolution.
- Connection establishment.
- Capability discovery.
- Health initialization.
- Safe handling of partial startup failure.
- Orderly shutdown of agent services.
- Adapter disconnection.
- Reporting of incomplete shutdown where detectable.
- Recovery behavior after an interrupted process lifecycle.

Software startup and shutdown must not be represented as proof that the physical robot is in a safe state. Any required physical safe-state procedure must be defined by the robot and lab safety documentation.

#### 2.1.11 Physical command safety boundary

P6 must preserve the distinction between ordinary software command validation and independent physical safety enforcement.

The phase requires the accepted integration to document:

- The supported operating envelope.
- The commands permitted through the software interface.
- The parameter limits enforced by software.
- The limits enforced by the robot controller or other independent protective mechanism.
- The handling of controller-reported interlocks.
- The behavior when a protective condition is active.
- The process for authorizing a physical test.
- The required operator supervision.
- The approved means to stop or inhibit motion.
- The conditions required before operation can resume after a fault.

Software validation should reject out-of-range commands where applicable, but it must not be the only protective layer for hazards requiring independent safety mechanisms.

The detailed safety design, hazard analysis, physical risk assessment, emergency-stop implementation, and safety certification belong to the designated hardware, robotics, and safety owners.

#### 2.1.12 Lab environment integration

P6 includes integration with the lab environment required for the accepted physical-resource workflow.

Depending on the supported configuration, this may include:

- Lab Agent deployment on an approved host.
- Resource connection configuration.
- Network reachability checks.
- Controller connection checks.
- Resource identity and capability verification.
- Diagnostic collection.
- Controlled test setup and teardown.
- Integration with an approved resource-access process.
- Documentation of environmental assumptions.

Cloud infrastructure, general network architecture, host provisioning, and secret distribution belong to the cloud and infrastructure documents. The lab integration documents must identify the configuration requirements and expected interface without duplicating infrastructure policy.

#### 2.1.13 Execution integration

P6 must integrate with P5 EXECUTION through the approved target-facing contract.

The integration must preserve:

- Stable execution identity.
- Command and target correlation.
- Request acceptance and rejection semantics.
- Supported progress and terminal outcome reporting.
- Fault and timeout classification.
- Cancellation or stop behavior where supported.
- Clear behavior for uncertain target state.
- The distinction between execution orchestration and physical target behavior.

P6 must not create a second execution lifecycle or independently report a terminal execution outcome without the required target evidence.

#### 2.1.14 Live and results integration

P6 must provide the physical-resource information needed by P7 LIVE & RESULTS through approved interfaces.

This may include:

- Telemetry source identity.
- Resource and execution references.
- Relevant timestamps.
- Measurement validity and units.
- Physical-resource fault events.
- Execution-related feedback.
- Data-source classification.
- Access restrictions for sensitive resource information.

P6 owns the acquisition and integration semantics for the accepted resource configuration. P7 owns live-session presentation, stream consumption, results processing, and user-facing results capabilities.

#### 2.1.15 Diagnostics and audit context

The Lab Agent and integration path must expose enough diagnostics to investigate:

- Agent connection and registration failures.
- Resource identification and capability mismatches.
- Command validation and rejection.
- Controller communication failures.
- Command acknowledgement and completion.
- Telemetry loss or invalid measurements.
- Resource health transitions.
- Reconnection and recovery attempts.
- Physical fault reports.
- Failures in execution or live-data handoff.

Diagnostics must include stable correlation identifiers where applicable and must follow the approved privacy and security policy.

Detailed log formats, metrics, dashboards, tracing, retention, and alerting belong to the backend, cloud, and security owner documents.

### 2.2 Supported physical integration scope

P6 must define a bounded, reviewable physical integration target.

The accepted configuration must identify:

- The robot or lab resource class.
- The controller or interface used.
- The supported commands and operating modes.
- The available feedback and telemetry.
- The Lab Agent deployment environment.
- The required network and authentication assumptions.
- The independent protective mechanisms.
- The test environment and supervision requirements.
- The supported failure and recovery behaviors.
- The limitations and excluded capabilities.

A successful integration with one configuration does not establish compatibility with all robots or lab equipment.

Additional resource types require explicit capability mapping and appropriate acceptance evidence rather than implicit reuse of assumptions from the first integration.

### 2.3 Physical operation prerequisites

Before physical commands are enabled for an accepted target, the responsible owners must establish the prerequisites applicable to that configuration.

These may include:

- Hardware and controller documentation.
- A documented operating envelope.
- Verified command parameter bounds.
- Independent emergency-stop or protective mechanisms where required.
- Controller configuration and interlock verification.
- Controlled test-area setup.
- Qualified operator supervision.
- Defined startup and shutdown procedures.
- Fault and recovery procedures.
- A clear authorization process for physical tests.

The phase dossier does not certify that these prerequisites have been satisfied for any particular robot. The task acceptance and safety review evidence must identify the actual target, procedures, and verification results.

### 2.4 Telemetry quality and interpretation

Physical telemetry must be treated as data with explicit provenance and quality.

The integration should define, where supported:

- Measurement name and meaning.
- Units and scaling.
- Timestamp source.
- Sampling or update behavior.
- Validity and quality indicators.
- Expected range.
- Behavior when data is missing or stale.
- Relationship to the associated resource and execution.
- Whether a value is directly measured, controller-reported, derived, or simulated.

The platform must not silently treat stale telemetry as current or use a communication-health signal as proof that a physical measurement is valid.

The detailed telemetry schema and downstream presentation behavior belong to the relevant protocol and P7 LIVE & RESULTS documents.

### 2.5 Resource and command authority

P6 must preserve one clear authority for each class of decision.

- P3 CONTROL PLANE owns identity, authorization context, project and platform metadata.
- P4 BOOKING & COMMERCIAL owns booking, reservation, and commercial decisions.
- P5 EXECUTION owns execution orchestration and the authoritative execution lifecycle.
- P6 LAB & ROBOT owns the Lab Agent, physical target integration, target-facing command mediation, and physical-resource feedback.
- P7 LIVE & RESULTS owns live interaction and result consumption and presentation.
- P8 PRODUCTION owns production deployment and operational readiness.

The Lab Agent may enforce local validation and target constraints, but it must not redefine project authorization, booking eligibility, or the platform execution lifecycle.

Hardware controllers and independent protective mechanisms remain authoritative for their supported physical safety functions.

### 2.6 Security and isolation requirements

P6 must apply the established security model to agent and resource access.

The implementation must ensure that:

- Only approved agents can establish protected platform connections.
- Credentials are not embedded in source code or exposed in diagnostics.
- Agent identity is associated with the permitted resource scope.
- Commands are accepted only from authorized callers or services.
- Resource identifiers cannot be used to bypass authorization.
- Sensitive telemetry is exposed only to authorized consumers.
- Reconnection does not bypass authentication or authorization.
- Configuration changes are controlled and auditable.
- Untrusted input cannot cause arbitrary commands to be sent to a controller.
- Network exposure is restricted according to the approved infrastructure policy.

P6 does not define the global identity provider, credential lifecycle platform, cloud network architecture, or security monitoring system. It must integrate with their approved contracts.

### 2.7 Explicit non-scope

The following are outside P6 LAB & ROBOT unless explicitly approved through a documented scope change:

- General repository bootstrap and shared engineering policy.
- Studio foundation and project-management implementation.
- Artifact creation and validation internals.
- Identity-provider implementation and token issuance.
- Global project, platform, or resource registry implementation.
- Booking, availability calculation, reservation conflict enforcement, credits, and commercial rules.
- General execution orchestration, dispatch scheduling, and execution lifecycle authority.
- A general-purpose simulator platform beyond the simulation support required for integration tests.
- Live-session UI, streaming presentation, and interactive telemetry visualization.
- Results interpretation, analytics, and results presentation.
- Production deployment, production hardening, and production operations.
- General cloud infrastructure architecture and network provisioning.
- Global database architecture and backup policy.
- Safety certification, formal certification of a robot, or claims of compliance not supported by evidence.
- Design or implementation of safety-rated controllers or emergency-stop circuits unless separately scoped to a qualified hardware safety project.
- Universal support for all robot vendors, controllers, buses, sensors, and actuator types.
- Unsupervised physical robot operation without an approved safety and operating process.
- A general-purpose lab inventory, facility-management, or resource-booking product.

P6 may depend on these capabilities or integrate with them through approved contracts. It must not absorb their ownership simply because they are needed for an end-to-end demonstration.

### 2.8 Canonical phase relationship table

| Phase | Relationship to P6 | Boundary |
|---|---|---|
| P0 FOUNDATION | Supplies shared repository, build, and engineering foundations | P6 follows common engineering conventions |
| P1 STUDIO | Supplies the Studio foundation and project-facing context | P6 integrates with the established user experience |
| P2 BUILD & ARTIFACT | Supplies artifact creation and artifact references | P6 consumes supported inputs where required; it does not own artifact creation |
| P3 CONTROL PLANE | Supplies identity, authorization context, projects, platforms, and artifact registration | P6 consumes approved control-plane contracts |
| P4 BOOKING & COMMERCIAL | Supplies reservation and commercial eligibility | P6 does not confirm bookings or enforce commercial accounting |
| P5 EXECUTION | Owns remote execution orchestration and lifecycle | P6 implements the target-facing physical integration boundary |
| P6 LAB & ROBOT | Owns Lab Agent and physical robot integration | Connects approved platform workflows to supported physical resources |
| P7 LIVE & RESULTS | Owns live interaction and results capabilities | Consumes authorized telemetry and execution outcome references |
| P8 PRODUCTION | Owns production deployment and operational readiness | Establishes production controls for deployed integrations |

### 2.9 Canonical cross-domain milestone mapping

| Domain | Canonical milestone | Relationship to P6 |
|---|---|---|
| Frontend | F-M01 STUDIO FOUNDATION (P0-P1) | Provides the shared Studio foundation |
| Frontend | F-M02 PROJECTS (P1) | Provides project context |
| Frontend | F-M03 BUILD & ARTIFACT (P2) | Provides artifact-related user experience |
| Frontend | F-M04 BOOKING (P4) | Provides booking context |
| Frontend | F-M05 EXECUTION (P5) | Provides execution initiation and status workflow |
| Frontend | F-M06 LIVE (P7) | Owns live interaction experience |
| Frontend | F-M07 RESULTS (P7) | Owns results presentation |
| Backend | B-M01 CONTROL PLANE (P3) | Supplies identity and control-plane contracts |
| Backend | B-M02 ARTIFACT (P2-P3) | Supplies artifact registration and discovery |
| Backend | B-M03 PLATFORM (P3) | Supplies platform metadata and resource-related inputs |
| Backend | B-M04 BOOKING (P4) | Supplies booking and commercial eligibility contracts |
| Backend | B-M05 EXECUTION (P5) | Supplies execution orchestration and target-facing integration contracts |
| Backend | B-M06 RESULTS (P6-P7) | Covers lab-associated results and result-service behavior within its defined scope |
| Backend | B-M07 PRODUCTION (P8) | Owns production backend readiness and operations |
| Database | DB-M01 FOUNDATION (P0-P3) | Supplies foundational persistence conventions |
| Database | DB-M02 CORE DATA (P3) | Supplies control-plane data and relationships |
| Database | DB-M03 BOOKING DATA (P4) | Owns booking and commercial persistence |
| Database | DB-M04 EXECUTION DATA (P5-P7) | Persists execution, lab, and results data within its defined scope |
| Cloud | C-M01 FOUNDATION (P0) | Supplies foundational cloud conventions |
| Cloud | C-M02 DEVELOPMENT (P1-P3) | Supplies development infrastructure and environments |
| Cloud | C-M03 STAGING (P4-P7) | Supplies staging infrastructure for lab and robot integration |
| Cloud | C-M04 PRODUCTION (P8) | Owns production infrastructure and operational readiness |

### 2.10 Required integration invariants

All P6 implementations must preserve the following invariants:

- **Authenticated agent:** protected platform connections require an approved agent identity.
- **Authorized command:** only authorized operations reach the supported target.
- **Capability correctness:** the agent advertises only implemented and validated capabilities.
- **Target correlation:** target responses and feedback are associated with the correct resource and execution.
- **Fault visibility:** relevant physical and integration faults are observable.
- **Telemetry provenance:** measurements retain their source and validity semantics where available.
- **Safe failure handling:** communication or software failure does not create unsupported safety claims.
- **Independent protection:** required physical protective mechanisms do not depend solely on the Lab Agent.
- **Execution boundary:** P5 EXECUTION remains authoritative for execution lifecycle state.
- **Booking boundary:** P4 BOOKING & COMMERCIAL remains authoritative for reservation and commercial state.
- **Live/results boundary:** P7 LIVE & RESULTS remains authoritative for live interaction and result presentation.
- **Production boundary:** P8 PRODUCTION remains authoritative for production readiness.
- **Bounded support:** acceptance applies only to the explicitly supported physical configuration and capabilities.

---

## 3. Dependencies

### 3.1 Required upstream dependencies

P6 consumes capabilities from earlier phases through approved interfaces. It must not duplicate upstream functionality merely because an integration dependency is incomplete.

#### P0 FOUNDATION

Required inputs:

- Repository and engineering conventions.
- Common build and test foundations.
- Shared identifier and error conventions where established.
- Configuration and environment practices.
- Code review and change-management procedures.

P6 must use the shared conventions and resolve missing foundational behavior through the relevant owner.

#### P1 STUDIO

Required inputs:

- The established Studio application foundation.
- Common project-facing context where needed.
- Approved frontend-to-service integration conventions.
- Shared navigation and presentation conventions for relevant workflows.

P6 does not create a separate UI architecture for lab resources.

#### P2 BUILD & ARTIFACT

Required inputs:

- Stable artifact or command-input references where relevant to a supported physical workflow.
- Artifact validation and registration semantics.
- Clear handling for unavailable or unsupported inputs.

P6 must not assume that an artifact identifier or command payload is valid for every physical target.

#### P3 CONTROL PLANE

Required inputs:

- Authenticated actor and service identity.
- Authorization and tenancy rules.
- Project and platform context.
- Resource metadata and identifiers needed for integration.
- Artifact registration and discovery contracts where applicable.
- Common API error and identifier conventions.

P6 must not implement a parallel identity provider or global resource registry.

#### P4 BOOKING & COMMERCIAL

Required inputs:

- Authoritative booking identity and status where resource reservation is required.
- Resource reference and applicable reservation context.
- Eligibility information needed before a physical operation is initiated.
- Clear behavior when a booking is cancelled, expires, or becomes invalid.

P6 must not implement booking creation, availability calculations, or credit accounting.

#### P5 EXECUTION

Required inputs:

- The approved execution request and lifecycle contract.
- Stable execution identity.
- Dispatch and target-adapter integration boundary.
- Defined acknowledgement, progress, failure, and terminal-outcome semantics.
- Cancellation or stop-request semantics where supported.
- Correlation and error-classification conventions.

P6 implements the physical target integration and returns relevant outcomes through this contract. P5 remains the owner of execution orchestration.

### 3.2 Cross-domain dependency matrix

| Dependency | Required input | P6 use | Owner |
|---|---|---|---|
| Agent authentication | Trusted agent identity and credentials | Establish protected platform connection | Security and cloud domains |
| Authorization | Caller, service, and resource permissions | Gate commands and telemetry access | P3 CONTROL PLANE and security owner documents |
| Project context | Authorized project or workspace identity | Associate resource access with the approved context | P3 CONTROL PLANE |
| Resource metadata | Stable resource identity and platform relationships | Register and identify the managed target | P3 CONTROL PLANE and applicable resource owner |
| Booking context | Confirmed reservation and eligibility information where required | Verify the operation has an approved resource context | P4 BOOKING & COMMERCIAL |
| Execution contract | Request, lifecycle, and error semantics | Mediate commands and report target outcomes | P5 EXECUTION |
| Hardware/controller interface | Supported command and feedback specification | Translate platform requests to the target | P6 integration owner and hardware vendor documentation |
| Safety controls | Approved operating limits and protective mechanisms | Constrain physical integration and testing | Designated robot and safety owners |
| Persistence | Approved data and migration conventions | Persist required agent/resource integration state | Database domain |
| Cloud environment | Network, host, secrets, and service configuration | Deploy and connect the Lab Agent | Cloud domain |
| Live-data contract | Telemetry and provenance semantics | Provide resource feedback to consumers | P6 and P7 integration owners |
| Test environment | Controlled target, instrumentation, and test procedures | Validate normal and fault behavior | P6 and testing owners |

### 3.3 Dependency on hardware and controller documentation

Physical integration requires reliable documentation for the supported target.

The relevant owner must provide, as applicable:

- Controller interface and connection requirements.
- Supported commands and operating modes.
- Parameter ranges and command semantics.
- Feedback and telemetry definitions.
- Error and fault codes.
- Controller configuration requirements.
- Connection-loss behavior.
- Startup and shutdown requirements.
- Protective interlocks and safety-related constraints.
- Supported diagnostic mechanisms.

P6 must not infer undocumented hardware behavior or assume that a generic command has the same semantics across different robot systems.

When the hardware documentation is incomplete, the affected operation must remain disabled or restricted until the required assumptions are validated.

### 3.4 Dependency on physical safety review

Physical testing requires an approved safety process appropriate to the supported robot and lab configuration.

The review must determine the required operating controls, supervision, protective mechanisms, permitted test envelope, and recovery procedures.

A software reviewer cannot substitute for the designated physical safety authority. A passing software test cannot certify an emergency-stop circuit, controller interlock, safe operating envelope, or physical risk assessment.

The detailed safety review process and evidence are owned by the relevant safety and hardware documents. P6 must record the resulting restrictions and demonstrate that the software integration respects them.

### 3.5 Dependency on execution orchestration

P6 relies on P5 EXECUTION to provide the authoritative execution workflow.

The integration must agree on:

- How a target receives an execution request.
- Which target acknowledgement maps to which execution event.
- How progress and terminal outcomes are reported.
- How failures and timeouts are classified.
- How cancellation or stop requests are represented.
- How uncertain target outcomes are handled.
- How target identity and execution identity are correlated.

P6 must not bypass the approved execution service for normal platform-driven operations. Any local maintenance or diagnostic interface must have its own authorization and safety boundary and must be documented separately.

### 3.6 Dependency on resource and booking contracts

The physical resource may be subject to booking or other approved access controls.

Where booking is required, the integration must validate the relevant eligibility before permitting the operation. The precise policy is owned by P4 BOOKING & COMMERCIAL.

P6 must distinguish:

- A resource being registered.
- A resource being connected.
- A resource being healthy.
- A resource being available.
- A resource being booked.
- A resource being eligible for a particular execution.
- A resource being physically safe for a particular action.

These states are not interchangeable. In particular, registration or connectivity does not prove availability, and availability does not prove physical safety.

### 3.7 Dependency on database architecture

P6 may require durable records for agent identity references, resource association, capability state, health transitions, and integration diagnostics.

The database domain owns the physical schema, migrations, indexes, constraints, retention, and recovery design.

P6 defines the required information and behavioral invariants. It must not create competing persistence conventions or embed database-specific architecture decisions in this dossier.

### 3.8 Dependency on cloud and infrastructure

The Lab Agent may run on an approved lab host, edge system, or other supported deployment target.

The infrastructure owner must establish the required:

- Host or runtime provisioning.
- Network connectivity and access restrictions.
- Secret and credential distribution.
- Service configuration.
- Update and recovery mechanism.
- Logging and diagnostics collection.
- Connectivity to required platform services.
- Separation between development, staging, and production environments.

P6 defines application-level integration requirements. It does not own the general cloud infrastructure or production deployment model.

### 3.9 Dependency on live and results integration

P7 LIVE & RESULTS may consume physical telemetry, execution-related feedback, and resource context.

The integration must define:

- Which telemetry is available.
- Which source produced each measurement.
- How timestamps and units are interpreted.
- How telemetry is associated with a resource and execution.
- How invalid or stale data is indicated.
- How faults are exposed to authorized consumers.
- Which service owns storage and presentation of results.

P6 is responsible for the accepted target-facing data acquisition and provenance. P7 owns the live interaction and results consumer behavior.

### 3.10 Dependency readiness and blocking policy

A dependency is ready when its contract is available, its owner is identified, and P6 can validate its assumptions without relying on undocumented behavior.

A missing dependency must be classified as:

- **Blocking:** the affected physical operation cannot be safely or correctly demonstrated.
- **Conditionally blocking:** integration development may continue, but the affected capability cannot be accepted until the dependency is resolved.
- **Non-blocking:** the dependency concerns a later or optional capability and does not invalidate the accepted scope.

A simulator or test double may be used for isolated software development. It must not be presented as evidence of physical robot integration, hardware behavior, or physical safety.

The task owner and dependency impact must be recorded in `TASKS.md`, with acceptance evidence maintained in the appropriate sibling files.

### 3.11 Cross-phase handoff table

| Handoff | Producing phase | Consuming phase | Required evidence |
|---|---|---|---|
| Shared engineering foundation | P0 FOUNDATION | P6 LAB & ROBOT | Common build, test, and engineering conventions are available |
| Studio and project context | P1 STUDIO | P6 LAB & ROBOT | Required user and project context can be consumed |
| Artifact or command-input references | P2 BUILD & ARTIFACT | P6 LAB & ROBOT | Supported input identity and validation semantics are documented |
| Identity, projects, platforms, and resource metadata | P3 CONTROL PLANE | P6 LAB & ROBOT | Required identity, authorization, and resource contracts are available |
| Booking and commercial eligibility | P4 BOOKING & COMMERCIAL | P6 LAB & ROBOT | Resource access and booking semantics are available where required |
| Execution requests and lifecycle | P5 EXECUTION | P6 LAB & ROBOT | Target integration contract and execution correlation are defined |
| Physical-resource feedback and faults | P6 LAB & ROBOT | P7 LIVE & RESULTS | Telemetry provenance, resource identity, and fault semantics are documented |
| Production deployment and operation | P8 PRODUCTION | Deployed lab and robot integration | Production controls and readiness evidence satisfy the production owner dossier |

---

## 4. Deliverables

The following deliverables describe phase-level outcomes. Detailed implementation tasks and pass/fail criteria remain in the sibling files.

### 4.1 Lab Agent identity and lifecycle

P6 delivers an agent lifecycle that supports authenticated connection, resource association, capability reporting, and controlled shutdown.

The implementation must define:

- Stable agent identity.
- Approved authentication and connection behavior.
- Resource association.
- Startup and initialization requirements.
- Capability registration or reporting.
- Connection-loss detection.
- Recovery behavior.
- Controlled shutdown.
- Diagnostic status.

**Completion evidence:** agent lifecycle tests demonstrate successful initialization, connection failure handling, resource association, reconnection behavior, and shutdown behavior for the accepted configuration.

### 4.2 Resource registration and capability report

P6 delivers the integration needed to represent the supported lab or robot resource through the approved resource contract.

The capability report must accurately describe the supported command, feedback, telemetry, and diagnostic interfaces.

It must distinguish configured, connected, healthy, available, and eligible states where those distinctions apply.

**Completion evidence:** integration tests verify stable identity, correct capability reporting, unsupported-capability rejection, and expected behavior when a resource becomes unavailable.

### 4.3 Hardware adapter and command mediation

P6 delivers the adapter boundary between the Lab Agent and the supported physical target.

The adapter must:

- Validate supported command types and parameters.
- Translate approved operations to the target interface.
- Preserve request and execution correlation.
- Reject unsupported operations.
- Interpret target acknowledgements.
- Return supported completion and failure information.
- Handle target communication errors.
- Avoid bypassing the approved authorization and execution boundaries.

**Completion evidence:** controlled integration tests demonstrate successful command mediation and rejection of invalid or unsupported requests.

### 4.4 Physical robot integration

P6 delivers a bounded integration with the approved robot or lab configuration.

The implementation must document the target, controller interface, supported commands, feedback paths, operating assumptions, and known limitations.

The physical integration must not claim generic compatibility beyond the configuration that has been tested.

**Completion evidence:** the accepted physical configuration completes the defined integration tests under the approved test procedure, with required supervision and safety controls in place.

### 4.5 Health and fault reporting

P6 delivers health and fault reporting for the Lab Agent and supported target.

The implementation must distinguish relevant agent, connection, controller, and resource conditions. It must report faults through the approved contracts and make unresolved conditions visible.

**Completion evidence:** fault-injection or controlled fault tests verify the expected status changes, diagnostic records, and restrictions on subsequent commands.

### 4.6 Telemetry acquisition and provenance

P6 delivers the supported telemetry acquisition and forwarding path.

For each accepted telemetry type, the implementation must document the meaning, units, timestamp source, validity semantics, and resource association where applicable.

Missing or stale measurements must not be silently presented as fresh and valid.

**Completion evidence:** integration tests verify telemetry acquisition, source association, validity behavior, and handling of unavailable or stale data.

### 4.7 Connection-loss and recovery behavior

P6 delivers the connection-loss and recovery behavior required by the accepted physical integration.

The implementation must define how the agent responds to platform disconnection, target disconnection, stale feedback, and uncertain command outcomes.

It must not blindly replay non-idempotent operations after reconnection.

**Completion evidence:** controlled tests demonstrate the expected status, command restrictions, reconnection, and recovery behavior for the supported fault scenarios.

### 4.8 Safety boundary and operating restrictions

P6 delivers documentation and implementation evidence for the safety-related boundary of the accepted integration.

This includes:

- Supported operating envelope.
- Software-enforced command restrictions.
- Controller-enforced or independent protective mechanisms.
- Fault response.
- Operator supervision requirements.
- Startup and shutdown restrictions.
- Recovery prerequisites.
- The approved physical test procedure.
- Known limitations and explicitly excluded behaviors.

**Completion evidence:** the designated safety and hardware owners review the accepted configuration and provide the required evidence before physical operation is authorized.

This deliverable does not imply formal safety certification unless a separate approved process produces that certification.

### 4.9 Execution integration

P6 delivers the target-facing integration with P5 EXECUTION.

The integration must preserve execution identity, command correlation, acknowledgement semantics, supported progress reporting, terminal outcomes, and fault classification.

**Completion evidence:** integration tests demonstrate that the execution service receives correct target responses and that target-side failures are not misreported as successful execution.

### 4.10 Resource availability and readiness integration

P6 delivers the physical-resource readiness information needed by the platform.

The implementation must distinguish connection and health information from booking availability, execution eligibility, and physical safety.

**Completion evidence:** integration tests verify that unavailable, disconnected, faulted, or unsupported resources are reported accurately and that command acceptance follows the approved preconditions.

### 4.11 Live and results integration

P6 delivers the resource and telemetry information required by P7 LIVE & RESULTS.

The handoff must include the relevant resource and execution references, data-source identity, timestamps, validity semantics, and fault information.

**Completion evidence:** contract or integration tests demonstrate that authorized consumers can identify the source and meaning of the supported physical-resource data.

### 4.12 Persistence and diagnostic integration

P6 delivers the application-level integration needed to retain required agent, resource, health, and diagnostic context.

The exact database schema and migration implementation belong to the database domain.

**Completion evidence:** the supported persistence integration retains required records across the agreed service lifecycle and provides sufficient diagnostic context for representative failures.

### 4.13 Deployment and configuration documentation

P6 delivers configuration and deployment guidance for the supported Lab Agent target.

The guidance must identify:

- Supported runtime environment.
- Required configuration values and secret references.
- Network and service dependencies.
- Resource and controller connection requirements.
- Capability configuration.
- Startup and shutdown behavior.
- Diagnostics and troubleshooting references.
- Safety prerequisites for physical testing.
- Known unsupported configurations.

Infrastructure provisioning, credential distribution, and production deployment instructions remain in the cloud and development owner documents.

**Completion evidence:** an authorized engineer can configure and validate the supported integration using the documented process without relying on undocumented assumptions.

### 4.14 Verification evidence

P6 delivers evidence for:

- Agent identity and connection.
- Resource association and capability reporting.
- Command validation and mediation.
- Target acknowledgement and outcome correlation.
- Physical feedback and telemetry validity.
- Health and fault reporting.
- Connection loss and recovery.
- Duplicate or uncertain command handling.
- Authorization and access restrictions.
- Execution integration.
- Live and results handoff.
- Required physical safety review.
- Controlled physical integration tests.

The global testing strategy defines common verification policy. Domain testing documents define detailed procedures and tooling. `ACCEPTANCE_CRITERIA.md` and `REVIEW_CHECKLIST.md` define P6-specific acceptance evidence.

### 4.15 Documentation and ownership handoff

P6 delivers a clear handoff for maintenance and subsequent integration.

The handoff must identify:

- The supported Lab Agent deployment.
- The physical target and controller configuration.
- The capability contract.
- The command and feedback interfaces.
- The telemetry schema and provenance.
- Health and fault semantics.
- Connection-loss and recovery behavior.
- Safety assumptions and restrictions.
- The P5 EXECUTION integration boundary.
- The P7 LIVE & RESULTS data handoff.
- Known limitations and deferred capabilities.
- Authoritative implementation and testing documents.

**Completion evidence:** documentation links resolve, owners are identified, and the supported physical integration can be understood without relying on undocumented hardware assumptions.

### 4.16 Deliverable ownership summary

| Deliverable | Phase-level owner | Implementation owner |
|---|---|---|
| Lab Agent identity and connection | P6 LAB & ROBOT | Backend and agent implementation owner |
| Resource association and capability reporting | P6 LAB & ROBOT | Backend and applicable resource owner |
| Hardware adapter | P6 LAB & ROBOT | Hardware integration owner |
| Command mediation | P6 LAB & ROBOT | Agent and backend integration owners |
| Physical robot integration | P6 LAB & ROBOT | Robot and hardware integration owner |
| Booking eligibility | P4 BOOKING & COMMERCIAL | Booking and backend owners |
| Execution lifecycle | P5 EXECUTION | Backend execution owner |
| Physical telemetry acquisition | P6 LAB & ROBOT | Agent and hardware integration owner |
| Live-session presentation | P7 LIVE & RESULTS | Frontend and results owners |
| Database schema and migrations | P6 defines behavioral requirements | Database domain |
| Cloud host and network provisioning | Cloud domain | Cloud domain |
| Physical safety assessment | Designated safety and hardware owners | Qualified responsible personnel |
| Production deployment | P8 PRODUCTION | Cloud and production owners |
| Detailed P6 acceptance evidence | `ACCEPTANCE_CRITERIA.md` | Task owners and reviewers |

### 4.17 Required phase records

The P6 phase directory maintains the following sibling records:

| File | Purpose |
|---|---|
| `MILESTONE.md` | Phase objective, scope, dependencies, deliverables, risks, exit criteria, and ownership boundaries |
| `TASKS.md` | Work decomposition, sequencing, dependencies, and ownership |
| `ACCEPTANCE_CRITERIA.md` | Detailed pass/fail conditions and required evidence |
| `REVIEW_CHECKLIST.md` | Review checks and evidence inspection |
| `CHANGELOG.md` | Accepted changes and milestone history |
| `GIT_COMMIT_STEP.md` | Repository and commit procedure |

These files are complementary. Task details belong in `TASKS.md`; verifiable conditions belong in `ACCEPTANCE_CRITERIA.md`; reviewer actions belong in `REVIEW_CHECKLIST.md`; accepted history belongs in `CHANGELOG.md`; and commit procedure belongs in `GIT_COMMIT_STEP.md`.

---

## 9. Risks

### 9.1 Unauthorized physical command

**Risk:** An unauthorized caller or service can cause a command to reach the physical target.

**Impact:** Unapproved resource use or unsafe physical behavior.

**Mitigation:**

- Enforce authorization at the trusted service boundary.
- Bind agent identity to an approved resource scope.
- Validate caller, resource, and execution relationships.
- Prevent direct bypass of the approved command path.
- Test unauthorized request and identifier-substitution scenarios.
- Follow the established security architecture.

**Owner:** Backend and security domains.

### 9.2 Agent identity or credentials are compromised

**Risk:** An agent credential is exposed, reused, or associated with the wrong resource.

**Impact:** An unauthorized system may impersonate an agent or access a physical resource.

**Mitigation:**

- Use the approved agent identity and credential model.
- Avoid hard-coded secrets.
- Restrict credential access and distribution.
- Provide an approved credential replacement or revocation process.
- Avoid logging credentials.
- Follow the security and cloud owner documents.

**Owner:** Security and cloud domains.

### 9.3 Unsupported command reaches the target

**Risk:** The platform or agent submits an operation not supported by the configured robot or controller.

**Impact:** Command rejection, unexpected behavior, or damage if a target interprets the operation differently than intended.

**Mitigation:**

- Advertise only validated capabilities.
- Validate command type and parameters.
- Maintain a documented capability mapping.
- Reject unknown or unsupported operations.
- Test invalid commands and boundary parameters.
- Require target-specific review for new capabilities.

**Owner:** P6 hardware integration owner.

### 9.4 Software checks are mistaken for safety protection

**Risk:** Software validation is treated as the sole safeguard against hazardous physical movement.

**Impact:** A software defect, compromised agent, or lost connection may result in hazardous behavior.

**Mitigation:**

- Identify independent protective mechanisms.
- Document the physical operating envelope.
- Require the applicable controller interlocks and stop mechanisms.
- Keep physical safety review separate from software acceptance.
- Do not claim certification without evidence from the responsible authority.
- Restrict operation until required protections are verified.

**Owner:** Designated hardware and safety owners.

### 9.5 Communication loss leaves physical state uncertain

**Risk:** The agent loses contact with the controller or platform while an operation is active.

**Impact:** The platform cannot reliably determine whether the robot is moving, stopped, or faulted.

**Mitigation:**

- Define target-specific communication-loss behavior.
- Detect and report stale feedback.
- Avoid claiming that network loss automatically stops motion.
- Use independent protective mechanisms where required.
- Prevent new commands when critical preconditions cannot be verified.
- Require an explicit recovery process for uncertain state.

**Owner:** P6 hardware integration owner and designated safety owners.

### 9.6 Reconnection replays a non-idempotent command

**Risk:** A reconnecting agent retransmits an operation that the controller already accepted.

**Impact:** Duplicate movement or repeated physical action.

**Mitigation:**

- Define request and command correlation.
- Distinguish known acceptance from uncertain acceptance.
- Avoid blind replay of non-idempotent commands.
- Reconcile target state where supported.
- Require explicit recovery when the outcome cannot be determined.
- Test interruption around command acknowledgement.

**Owner:** Agent and backend integration owners.

### 9.7 Telemetry is stale or incorrectly interpreted

**Risk:** The platform treats old, invalid, or incorrectly scaled measurements as current physical data.

**Impact:** Misleading status, incorrect decisions, or unsafe assumptions about the robot's state.

**Mitigation:**

- Define telemetry meaning, units, timestamps, and validity.
- Identify measurement source and provenance.
- Detect missing or stale data where supported.
- Validate scaling and expected ranges.
- Distinguish measured values from derived or simulated values.
- Test invalid and unavailable telemetry paths.

**Owner:** P6 integration owner and P7 data-consumer owner.

### 9.8 Health state is mistaken for physical safety

**Risk:** An agent reports healthy connectivity and the platform assumes the robot is safe to operate.

**Impact:** A hazardous physical condition may be overlooked.

**Mitigation:**

- Separate software health, resource health, readiness, and safety status.
- Define which target and controller signals are available.
- Do not infer safety from connectivity alone.
- Keep required protective mechanisms independent.
- Document the limitations of health reporting.

**Owner:** P6 and designated safety owners.

### 9.9 Resource identity is inconsistent

**Risk:** The agent, platform, booking service, and execution service refer to the same physical resource using inconsistent identities.

**Impact:** Commands may target the wrong resource or be associated with the wrong booking.

**Mitigation:**

- Use the approved stable resource identifier.
- Validate the agent-to-resource association.
- Preserve execution and booking references.
- Reject conflicting registration.
- Test identity mismatch and reassignment scenarios.
- Avoid creating a parallel global resource registry.

**Owner:** P3 control-plane and P6 integration owners.

### 9.10 Execution and target state diverge

**Risk:** The target reports completion or failure but the execution service retains a different state.

**Impact:** Users and downstream consumers see incorrect execution outcomes.

**Mitigation:**

- Preserve request and execution correlation.
- Validate target messages against the accepted lifecycle.
- Define acknowledgement and terminal-outcome semantics.
- Report uncertain outcomes explicitly.
- Test delayed, duplicate, and out-of-order feedback.
- Keep P5 EXECUTION authoritative for the execution lifecycle.

**Owner:** P5 and P6 integration owners.

### 9.11 Resource becomes unavailable during an operation

**Risk:** The controller faults, the agent disconnects, or the resource is disabled while a command is active.

**Impact:** The operation may fail or remain in an uncertain state.

**Mitigation:**

- Detect and report resource faults.
- Define target-specific response behavior.
- Avoid fabricating successful completion.
- Preserve diagnostic and correlation context.
- Define the operator recovery process.
- Keep physical protection independent of platform reporting.

**Owner:** P6 hardware integration owner and designated safety owners.

### 9.12 Lab Agent update breaks hardware compatibility

**Risk:** An agent update changes command mapping, timing, configuration, or controller interaction.

**Impact:** Previously working operations fail or behave differently on the physical target.

**Mitigation:**

- Version the agent and capability contract where required.
- Validate compatibility against the supported target.
- Use controlled deployment and rollback procedures.
- Keep hardware-specific assumptions documented.
- Test the accepted configuration after relevant updates.
- Assign production update policy to the appropriate operational owner.

**Owner:** P6 integration owner and cloud/operations owners.

### 9.13 Hardware documentation is incomplete

**Risk:** The integration relies on assumptions about controller behavior, command limits, feedback, or fault semantics.

**Impact:** The software may send invalid commands or misinterpret target behavior.

**Mitigation:**

- Identify the required controller documentation.
- Validate assumptions with the hardware owner.
- Restrict unsupported operations.
- Record unresolved questions and owners.
- Do not enable physical operation when safety-critical assumptions remain unresolved.

**Owner:** Hardware integration owner.

### 9.14 Physical testing occurs without required controls

**Risk:** A physical test begins without the required supervision, controlled area, interlock verification, or recovery procedure.

**Impact:** Injury, equipment damage, or uncontrolled robot behavior.

**Mitigation:**

- Define the approved test procedure.
- Identify the responsible operator and safety authority.
- Verify required protective mechanisms before testing.
- Restrict the supported operating envelope.
- Provide a controlled shutdown and fault-recovery procedure.
- Stop testing when prerequisites are not met.

**Owner:** Designated lab and safety owners.

### 9.15 Lab Agent becomes a second execution authority

**Risk:** The agent independently creates or modifies execution lifecycle state instead of reporting target behavior through the approved contract.

**Impact:** Conflicting state, duplicate orchestration, and unclear responsibility for failures.

**Mitigation:**

- Keep P5 EXECUTION authoritative for orchestration and lifecycle.
- Restrict the agent to target-facing mediation and reporting.
- Define acknowledgement and outcome mapping.
- Test lifecycle correlation.
- Avoid duplicating dispatch scheduling or execution policy inside the agent.

**Owner:** P5 and P6 integration owners.

### 9.16 Physical telemetry leaks sensitive information

**Risk:** Telemetry, logs, or diagnostic records expose restricted resource information or credentials.

**Impact:** Security or privacy incidents and unauthorized access to lab operations.

**Mitigation:**

- Apply the approved data classification and access policy.
- Avoid logging secrets and unnecessary payloads.
- Restrict telemetry and diagnostics by authorization.
- Validate log and error output.
- Use approved retention and access controls.

**Owner:** Security, backend, and cloud domains.

### 9.17 Environment and network configuration is unreliable

**Risk:** Agent connectivity depends on undocumented network routes, local credentials, or host assumptions.

**Impact:** Unreproducible tests, intermittent connectivity, or unintended network exposure.

**Mitigation:**

- Document supported deployment prerequisites.
- Use the approved configuration and secret-distribution process.
- Restrict network access to required endpoints.
- Test startup and reconnect behavior in the supported environment.
- Keep infrastructure policy with the cloud owner.

**Owner:** Cloud and P6 integration owners.

### 9.18 Vendor-specific behavior leaks into shared contracts

**Risk:** A particular controller's command semantics become implicit requirements for all resources.

**Impact:** Additional robot integrations require incompatible special cases or break existing consumers.

**Mitigation:**

- Maintain an explicit adapter boundary.
- Keep the shared contract capability-oriented.
- Document target-specific mappings.
- Reject unsupported capabilities clearly.
- Require compatibility evidence before adding another target.

**Owner:** P6 integration architecture owner.

### 9.19 Test environment does not represent the physical target

**Risk:** A simulator or mock passes tests that do not cover controller-specific behavior.

**Impact:** Failures appear only during physical integration.

**Mitigation:**

- Use simulation for software lifecycle tests, not as proof of hardware behavior.
- Define the physical acceptance configuration.
- Verify supported controller behavior through controlled tests.
- Document differences between simulated and physical targets.
- Require physical evidence for physical integration claims.

**Owner:** P6 integration owner and testing owners.

### 9.20 Telemetry streaming overwhelms the agent or platform

**Risk:** High-rate sensor data or diagnostics exceed the capacity of the agent, network, or downstream consumers.

**Impact:** Increased latency, dropped messages, stale measurements, or resource instability.

**Mitigation:**

- Define required telemetry rates for the accepted scope.
- Apply appropriate filtering, sampling, or bounded buffering.
- Separate critical control behavior from non-critical telemetry forwarding.
- Expose dropped or stale data where supported.
- Measure behavior under the agreed integration load.
- Keep general platform scaling and production capacity with P8 PRODUCTION.

**Owner:** P6 integration owner and relevant platform owners.

### 9.21 Recovery behavior creates an unsafe restart

**Risk:** An agent restart automatically resumes commands or assumes the physical resource is in its previous state.

**Impact:** Unexpected motion or inconsistent control after a fault.

**Mitigation:**

- Define restart behavior for the target.
- Require state revalidation before resuming restricted operations.
- Avoid automatic replay of uncertain commands.
- Preserve and expose unresolved state.
- Require operator intervention where specified by the safety process.
- Test restart while disconnected and while an operation is unresolved.

**Owner:** P6 hardware integration owner and designated safety owners.

### 9.22 Scope expands into unrelated systems

**Risk:** P6 absorbs booking, execution orchestration, live presentation, results processing, production operations, or general lab management.

**Impact:** Duplicated ownership and delayed physical integration.

**Mitigation:**

- Keep the non-scope section explicit.
- Assign cross-domain work to its authoritative owner.
- Use contracts and handoffs rather than duplicate implementations.
- Record approved scope changes through the project workflow.
- Review boundary changes with the affected domain owners.

**Owner:** P6 phase owner and relevant domain owners.

### 9.23 Acceptance overstates physical readiness

**Risk:** Passing integration tests is interpreted as proof of production readiness or safety certification.

**Impact:** Physical deployment proceeds without the required qualification, controls, or operational evidence.

**Mitigation:**

- State the tested configuration and limitations.
- Separate software integration acceptance from safety review.
- Separate phase acceptance from production readiness.
- Require the designated safety authority to approve applicable physical tests.
- Leave production deployment and operation to P8 PRODUCTION.
- Make unsupported claims a review-blocking issue.

**Owner:** P6 phase owner, designated safety owners, and P8 production owner.

---

## 10. Exit criteria

P6 LAB & ROBOT may be declared complete only when the accepted Lab Agent and physical robot integration scope is implemented, verified, and reviewed against the documented operating and safety boundaries.

Acceptance must be based on evidence from the supported configuration. A simulated run alone does not demonstrate physical integration, and a successful physical command alone does not demonstrate reliable lifecycle handling, telemetry quality, recovery, or safety.

Detailed pass/fail conditions are maintained in `ACCEPTANCE_CRITERIA.md`. Review execution and evidence inspection are maintained in `REVIEW_CHECKLIST.md`.

### 10.1 Scope and ownership

- [ ] The accepted P6 scope is consistent with this dossier.
- [ ] The supported Lab Agent deployment and physical target configuration are identified.
- [ ] The Lab Agent and hardware adapter responsibilities are explicit.
- [ ] P5 EXECUTION remains authoritative for execution orchestration and lifecycle.
- [ ] P4 BOOKING & COMMERCIAL remains authoritative for reservation and commercial rules.
- [ ] P7 LIVE & RESULTS remains authoritative for live interaction and results presentation.
- [ ] P8 PRODUCTION remains authoritative for production readiness.
- [ ] Physical safety responsibilities are assigned to the designated hardware and safety owners.
- [ ] The canonical phase and milestone references follow the frozen model.
- [ ] The sibling task, acceptance, review, changelog, and Git procedure files are maintained separately.

### 10.2 Agent identity and connection

- [ ] The Lab Agent has a stable identity.
- [ ] Protected connections use the approved authentication mechanism.
- [ ] Agent-to-resource association is explicit.
- [ ] Unauthorized agents cannot receive protected commands.
- [ ] Startup and initialization behavior are documented.
- [ ] Connection loss is detected and reported according to the supported contract.
- [ ] Reconnection behavior is documented and tested.
- [ ] Shutdown behavior is documented and tested.
- [ ] Credentials and secrets are not exposed in logs or source code.

### 10.3 Resource identity and capabilities

- [ ] The supported resource has a stable identity.
- [ ] The relationship between agent and resource is validated.
- [ ] The configured target and controller are documented.
- [ ] Advertised capabilities match implemented and tested behavior.
- [ ] Unsupported capabilities are rejected.
- [ ] Configured, connected, healthy, available, and eligible states are distinguished where applicable.
- [ ] Conflicting or invalid resource registration is handled consistently.
- [ ] Resource ownership remains with the appropriate domain.

### 10.4 Command mediation

- [ ] Supported commands and parameters are documented.
- [ ] Command inputs are validated before reaching the target.
- [ ] Target compatibility is checked.
- [ ] Authorization is enforced.
- [ ] The hardware adapter preserves command semantics.
- [ ] Request and execution correlation is maintained.
- [ ] Target acknowledgement is distinct from completion.
- [ ] Unsupported and malformed commands are rejected.
- [ ] Target errors are mapped to the approved contract.
- [ ] The normal platform-driven command path does not bypass the approved execution boundary.

### 10.5 Physical robot integration

- [ ] The accepted physical target and controller interface are identified.
- [ ] Hardware and controller documentation has been reviewed.
- [ ] Supported operating modes and commands are documented.
- [ ] Command parameter constraints are validated.
- [ ] Feedback and telemetry interfaces are documented.
- [ ] Target-specific faults and limitations are documented.
- [ ] Controlled integration tests pass for the accepted configuration.
- [ ] Physical integration claims do not exceed the verified configuration.
- [ ] Additional robot or controller types are not assumed to be supported without evidence.

### 10.6 Health, faults, and recovery

- [ ] Agent health and resource health are distinguishable.
- [ ] Connection and controller failures are reported.
- [ ] Unsupported commands and target faults are diagnosable.
- [ ] Stale or unavailable telemetry is handled according to the contract.
- [ ] Connection-loss behavior is documented.
- [ ] Reconnection does not blindly replay non-idempotent commands.
- [ ] Uncertain command outcomes remain visible.
- [ ] Restart and recovery behavior is tested.
- [ ] Operator intervention requirements are documented where applicable.
- [ ] A reported healthy state is not treated as proof of physical safety.

### 10.7 Telemetry and data provenance

- [ ] Supported telemetry types are documented.
- [ ] Units and scaling are defined where applicable.
- [ ] Timestamp source and validity semantics are defined where available.
- [ ] Telemetry is associated with the correct resource and execution.
- [ ] Missing, invalid, or stale measurements are not silently presented as fresh.
- [ ] Simulated and physical data sources are distinguishable.
- [ ] Fault and diagnostic data is exposed only to authorized consumers.
- [ ] The P7 LIVE & RESULTS handoff is documented and tested.

### 10.8 Physical safety boundary

- [ ] The accepted physical operating envelope is documented.
- [ ] Software-enforced command restrictions are documented.
- [ ] Independent protective mechanisms are identified where required.
- [ ] Controller interlocks and required stop mechanisms have been verified by the responsible owners.
- [ ] Communication-loss behavior has been reviewed for the supported target.
- [ ] Startup, shutdown, fault, and recovery procedures are documented.
- [ ] The approved physical test procedure identifies required supervision.
- [ ] The designated safety and hardware owners have completed the required review.
- [ ] Physical testing has not been authorized solely on the basis of software tests.
- [ ] No unsupported claim of safety certification or production readiness is made.

### 10.9 Execution and booking integration

- [ ] The P5 EXECUTION contract is used for normal platform-driven operations.
- [ ] Execution identifiers and target outcomes are correlated correctly.
- [ ] Target acceptance and terminal outcomes are mapped consistently.
- [ ] Failure and uncertain outcomes are not reported as successful execution.
- [ ] Required booking eligibility is validated through the approved contract.
- [ ] P6 does not create or modify booking and commercial authority.
- [ ] Cancellation or stop behavior is implemented where supported.
- [ ] Contract or integration tests verify the P5-to-P6 boundary.

### 10.10 Persistence, configuration, and infrastructure

- [ ] Required agent, resource, and diagnostic state is retained according to the approved architecture.
- [ ] Persistence integration is validated where required.
- [ ] Configuration and secret references are documented.
- [ ] Network and service dependencies are documented.
- [ ] The Lab Agent can be configured using the supported procedure.
- [ ] Infrastructure provisioning remains owned by the cloud domain.
- [ ] The integration does not rely on undocumented local configuration.
- [ ] Relevant startup, shutdown, and reconnection scenarios are repeatable.

### 10.11 Security and diagnostics

- [ ] Agent and command authorization are enforced.
- [ ] Resource scope and caller relationships are validated.
- [ ] Unauthorized command and telemetry access tests pass.
- [ ] Credentials and sensitive payloads are protected.
- [ ] Agent, resource, command, and execution events can be correlated.
- [ ] Relevant connection and target faults are diagnosable.
- [ ] Logging and retention follow the approved security policy.
- [ ] Relevant security findings are resolved or formally dispositioned.

### 10.12 Verification evidence

- [ ] Unit tests cover command validation and capability mapping.
- [ ] Contract tests cover the agent and execution integration boundary.
- [ ] Integration tests cover connection, command mediation, and target outcomes.
- [ ] Tests cover invalid and unsupported commands.
- [ ] Tests cover communication loss and reconnection.
- [ ] Tests cover stale or unavailable telemetry.
- [ ] Tests cover target fault reporting.
- [ ] Tests cover duplicate or uncertain command handling.
- [ ] Tests cover relevant startup and shutdown behavior.
- [ ] Physical integration tests use the approved procedure and required supervision.
- [ ] Simulation results are not substituted for required physical evidence.
- [ ] Required safety review evidence is available.
- [ ] Test results are repeatable and linked from the acceptance records.
- [ ] Any accepted exception has an explicit owner and documented disposition.

### 10.13 Documentation and handoff

- [ ] The Lab Agent deployment and configuration are documented.
- [ ] The supported physical target and controller are identified.
- [ ] The capability and command contracts are documented.
- [ ] Telemetry meaning, units, and provenance are documented where applicable.
- [ ] Health, fault, and recovery behavior are documented.
- [ ] Safety assumptions and operating restrictions are documented.
- [ ] The P5 EXECUTION integration boundary is documented.
- [ ] The P7 LIVE & RESULTS handoff is documented.
- [ ] Known limitations and unsupported configurations are explicit.
- [ ] Implementation, database, cloud, security, and testing details link to their authoritative owner documents.
- [ ] The sibling task, acceptance, review, changelog, and Git procedure files are complete for the accepted scope.

### 10.14 Final phase acceptance

P6 LAB & ROBOT is ready for formal acceptance when:

1. The agreed Lab Agent connects to the supported physical or lab resource through the approved boundary.
2. Agent identity, resource identity, and capabilities are correctly represented.
3. Supported commands are validated, authorized, mediated, and correlated.
4. Physical feedback, telemetry, and faults are reported with the required provenance and validity semantics.
5. Connection loss, recovery, and uncertain command outcomes are handled according to the accepted contract.
6. The P5 EXECUTION integration preserves authoritative execution lifecycle semantics.
7. The P7 LIVE & RESULTS handoff is documented and validated.
8. Required physical safety prerequisites and reviews are complete for the accepted configuration.
9. Required automated and controlled physical integration tests pass.
10. Critical risks are mitigated or formally dispositioned by their owners.
11. The required evidence is available through the sibling acceptance and review records.
12. No unresolved issue invalidates authorization, target correlation, required safety controls, or the integrity of physical-resource reporting.
13. Remaining work is explicitly assigned to its authoritative phase or domain owner.

Acceptance of P6 does not imply that live interaction, results processing, or production deployment is complete. Those outcomes remain governed by their respective canonical phases and authoritative milestone dossiers. Physical operation beyond the accepted target, operating envelope, and safety review remains outside the evidence established by this milestone.
