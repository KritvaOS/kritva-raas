# Kritva RaaS Integration Plan

## Document Control

| Field | Value |
|---|---|
| Document | Integration Plan |
| Path | `docs/planning/INTEGRATION_PLAN.md` |
| Project | Kritva RaaS |
| Status | Planning baseline |
| Scope | P0 FOUNDATION through P8 PRODUCTION |
| Primary audience | Engineering leadership, frontend, backend, database, cloud, runtime, robotics, QA, and operations teams |
| Primary purpose | Define phase-by-phase integration sequencing, environments, interface contracts, checkpoints, and acceptance evidence |
| Naming authority | `docs/planning/PHASES.md` |
| Milestone scope authority | Applicable milestone dossiers under `docs/**/milestones/` |

---

## Ownership and Boundaries

### What This Document Owns

This document owns the cross-domain integration strategy for Kritva RaaS. It defines:

- How Studio, Local Runtime, Control Plane, database, cloud infrastructure, Lab Agent, simulated robots, physical Lab Agent, and physical robots integrate across P0 FOUNDATION through P8 PRODUCTION.
- Integration order and dependencies between domains.
- Integration environments and promotion of changes between those environments.
- Interface-contract coordination and cross-domain compatibility expectations.
- Contract-test strategy, integration-test layers, end-to-end checkpoints, and integration evidence.
- Phase-level acceptance checkpoints for verifying that integrated components work together.
- Integration defect triage, dependency escalation, and cross-team integration responsibilities.
- Integration readiness criteria and handoff expectations between phases.

### What This Document Does Not Own

| Subject | Authoritative owner |
|---|---|
| Canonical phase names, phase numbering, and phase definitions | `docs/planning/PHASES.md` |
| Milestone objectives, scope, dependencies, deliverables, risks, and exit criteria | Applicable milestone dossiers under `docs/**/milestones/` |
| Implementation tasks and task ownership | Applicable milestone `TASKS.md` |
| Task-specific acceptance conditions | Task-scoped `ACCEPTANCE_CRITERIA.md` |
| Review procedures and required review evidence | Applicable `REVIEW_CHECKLIST.md` |
| Accepted implementation history | Applicable `CHANGELOG.md` |
| Required Git operations and commit sequence | Applicable `GIT_COMMIT_STEP.md` |
| Frontend architecture and detailed Studio behavior | Frontend architecture and specification documents |
| Backend service architecture and API behavior | Backend architecture and API specification documents |
| Database schemas, migrations, constraints, and retention definitions | Database architecture and schema documents |
| Cloud topology, deployment configuration, and infrastructure implementation | Cloud architecture and infrastructure documents |
| Local Runtime implementation and lifecycle contracts | Applicable runtime and platform architecture documents |
| Lab Agent implementation, hardware interfaces, and robot-specific behavior | Applicable robotics, runtime, and device specifications |
| Security policy and detailed threat model | Security architecture and security planning documents |
| Robot safety assessment and physical test authorization | Designated safety reviewer and approved safety process |
| Staffing, hiring, budget, and procurement | `docs/planning/RESOURCE_PLAN.md` and approved financial records |
| Detailed release and production operating procedures | Applicable production, operations, and release documents |

### Boundary Rules

1. Use only the frozen canonical phase names, numbers, and milestone IDs in this document.
2. Treat the applicable milestone dossier as the authority for whether a capability belongs in a phase.
3. Describe integration between components without duplicating their internal implementation specifications.
4. Use links to the owning architecture, task, acceptance, and operational documents when more detail is required.
5. Distinguish the Local Runtime from the Control Plane and cloud infrastructure.
6. In P5 EXECUTION, integrate the simulated Lab Agent and simulated robot path.
7. In P6 LAB & ROBOT, integrate the physical Lab Agent and physical robots through approved procedures.
8. In P7 LIVE & RESULTS, integrate live video, telemetry, and results.
9. In P8 PRODUCTION, harden security and operations and validate production readiness.
10. Integration acceptance does not replace milestone acceptance, security approval, physical safety approval, or production release authorization.

---

## 1. Purpose

The purpose of this document is to establish a controlled integration path from foundational engineering setup through production readiness.

Kritva RaaS spans multiple independently developed domains. Studio, Local Runtime, Control Plane, database, cloud infrastructure, Lab Agent, and robot capabilities must work together through explicit interfaces and testable contracts. Integration must be planned as a sequence of verified connections rather than deferred until individual components appear complete.

This plan provides a common reference for:

- Integration sequencing across P0 FOUNDATION through P8 PRODUCTION.
- The order in which cross-domain interfaces should become available.
- The environments used for development, contract testing, simulation, physical validation, and production readiness.
- The evidence needed to demonstrate that integrated workflows behave as intended.
- Ownership and escalation when one domain blocks another.
- Preventing accidental coupling between implementation details owned by different teams.

The applicable milestone dossiers remain authoritative for milestone scope and exit criteria. This plan explains how to integrate that scope across domains.

## 2. Integration Principles

### 2.1 Contract-First Integration

Agree on interface contracts before parallel teams depend on them. A contract should define the request and response structure, data types, versioning expectations, error behavior, lifecycle semantics, authorization requirements, and relevant timing or resource limits.

Where a contract changes, the owning team must communicate the change and provide a compatibility and migration plan.

### 2.2 Incremental Integration

Integrate the smallest useful vertical path first, then expand coverage. Each checkpoint should produce observable evidence that can be reproduced by another engineer.

Avoid relying exclusively on unit tests, mocks, or component-level success to claim end-to-end readiness.

### 2.3 Explicit Environment Boundaries

Each environment has a specific purpose and controlled dependencies. Development environments should enable fast iteration; staging environments should provide representative integration behavior; physical laboratory environments should support only approved test procedures; production environments should apply operational and security controls.

### 2.4 Deterministic Evidence

Contract tests and integration tests should use controlled inputs and produce identifiable results. Where physical behavior or external services introduce variability, define measurable acceptance thresholds and preserve diagnostic evidence.

### 2.5 Failure-Path Integration

Integration coverage must include more than successful operation. It should verify timeouts, unavailable dependencies, malformed data, authorization failures, cancellation, retries, partial completion, recovery, and cleanup where applicable.

### 2.6 No Implicit Ownership Transfer

A component owner remains accountable for its implementation and contract. Integration coordination does not make the integration lead the owner of every participating component.

### 2.7 Safety and Security Are Independent Gates

Passing software integration tests does not establish that a physical robot is safe to operate or that a deployment is approved for production. Required human reviews and formal approvals remain separate gates.

---

## 3. System Integration Model

### 3.1 Logical Components

| Component | Integration responsibility | Primary integration concern |
|---|---|---|
| Studio | User-facing project and workflow interface | Stable user-facing contracts and workflow state |
| Local Runtime | Local build, artifact, and supported runtime interaction | Reproducibility, lifecycle behavior, and local resource management |
| Control Plane | Coordinates platform services and authorized workflows | API contracts, identity, state coordination, and service dependencies |
| Database | Persists platform, booking, execution, and results data within approved scope | Data integrity, migrations, consistency, and query behavior |
| Cloud | Provides development, staging, and production infrastructure | Environment configuration, connectivity, security, and operational controls |
| Lab Agent | Connects the platform execution path to a laboratory execution environment | Registration, health, command handling, and evidence reporting |
| Simulated robot | Represents a robot endpoint in controlled software execution | Deterministic behavior, lifecycle, and failure simulation |
| Physical robot | Provides real hardware behavior through approved interfaces | Hardware compatibility, control behavior, diagnostics, and safety |
| Video subsystem | Provides live video integration where approved | Stream lifecycle, latency, access, and resource use |
| Telemetry subsystem | Provides operational and robot-related measurements | Data validity, ordering, ingestion, and retention |
| Results subsystem | Makes execution and validation outcomes available | Traceability, completeness, access, and retrieval |

The table defines integration responsibilities at a planning level. Detailed internal architecture belongs to the corresponding domain documentation.

### 3.2 Logical Integration Flow

The intended logical flow is:

1. Studio initiates a supported user workflow.
2. Local Runtime provides the applicable local build, artifact, or runtime capability.
3. Control Plane validates and coordinates operations that require platform services.
4. Database persists the authoritative state for the relevant domain.
5. Cloud supplies the required environment and supporting infrastructure.
6. The execution path reaches the simulated Lab Agent in P5 EXECUTION.
7. P6 LAB & ROBOT extends the approved integration path to a physical Lab Agent and physical robots.
8. P7 LIVE & RESULTS integrates live video, telemetry, and results into the workflow.
9. P8 PRODUCTION validates the security, reliability, operational, and scale requirements for production use.

Not every workflow traverses every component. The relevant milestone dossiers and technical contracts determine which dependencies apply to a particular capability.

### 3.3 Integration Invariants

The following invariants apply across the plan:

- A caller must not rely on undocumented internal implementation details of another component.
- Requests and responses must have a defined schema and error model.
- Persisted state must have an identified owner and defined consistency expectations.
- Environment-specific configuration must not silently change application contracts.
- Identity and authorization checks must be applied at the appropriate trust boundaries.
- Integration tests must be reproducible enough to support regression diagnosis.
- Physical robot commands must follow the approved safety controls and test procedures.
- Video, telemetry, and results access must respect applicable authorization and retention policies.
- Production readiness must be supported by evidence rather than inferred from successful development tests.

---

## 4. Canonical Phase and Milestone Alignment

### 4.1 Phase Integration Map

| Phase | Canonical name | Integration focus |
|---|---|---|
| P0 | FOUNDATION | Establish interface ownership, development conventions, and baseline integration infrastructure |
| P1 | STUDIO | Integrate desktop Studio workflows and their initial dependencies |
| P2 | BUILD & ARTIFACT | Integrate local build and artifact workflows |
| P3 | CONTROL PLANE | Integrate backend, identity, data, and service contracts |
| P4 | BOOKING & COMMERCIAL | Integrate resource booking and financial-system workflows |
| P5 | EXECUTION | Integrate remote execution on simulated robots |
| P6 | LAB & ROBOT | Integrate the physical Lab Agent and robots |
| P7 | LIVE & RESULTS | Integrate live video, telemetry, and results |
| P8 | PRODUCTION | Harden security and operations for production |

### 4.2 Frontend Milestones

| Milestone | Canonical name | Phase | Integration responsibility |
|---|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 | Establish frontend integration foundations and desktop Studio |
| F-M02 | PROJECTS | P1 | Integrate project-oriented Studio workflows |
| F-M03 | BUILD & ARTIFACT | P2 | Integrate local build and artifact user workflows |
| F-M04 | BOOKING | P4 | Integrate booking and commercial user workflows |
| F-M05 | EXECUTION | P5 | Integrate remote execution workflows for simulated robots |
| F-M06 | LIVE | P7 | Integrate live video and telemetry presentation |
| F-M07 | RESULTS | P7 | Integrate results presentation and retrieval |

### 4.3 Backend Milestones

| Milestone | Canonical name | Phase | Integration responsibility |
|---|---|---|---|
| B-M01 | CONTROL PLANE | P3 | Integrate control-plane services and platform coordination |
| B-M02 | ARTIFACT | P2-P3 | Integrate artifact-related services and their contracts |
| B-M03 | PLATFORM | P3 | Integrate backend platform capabilities |
| B-M04 | BOOKING | P4 | Integrate booking and commercial services |
| B-M05 | EXECUTION | P5 | Integrate remote execution services for simulated robots |
| B-M06 | RESULTS | P6-P7 | Integrate results-related services and data |
| B-M07 | PRODUCTION | P8 | Integrate production service requirements and readiness |

### 4.4 Database Milestones

| Milestone | Canonical name | Phase | Integration responsibility |
|---|---|---|---|
| DB-M01 | FOUNDATION | P0-P3 | Establish data foundations and integration conventions |
| DB-M02 | CORE DATA | P3 | Integrate core platform data |
| DB-M03 | BOOKING DATA | P4 | Integrate booking and commercial data |
| DB-M04 | EXECUTION DATA | P5-P7 | Integrate execution, laboratory, telemetry, and results data as approved |

### 4.5 Cloud Milestones

| Milestone | Canonical name | Phase | Integration responsibility |
|---|---|---|---|
| C-M01 | FOUNDATION | P0 | Establish baseline infrastructure and access controls |
| C-M02 | DEVELOPMENT | P1-P3 | Support development and integration environments |
| C-M03 | STAGING | P4-P7 | Support staged integration and validation environments |
| C-M04 | PRODUCTION | P8 | Support production hardening and operational readiness |

These mappings establish coordination points. They do not replace the scope and exit criteria in the applicable milestone dossiers.

---

## 5. Integration Environments

### 5.1 Environment Strategy

Use progressively more representative environments as integration risk increases.

| Environment | Primary purpose | Expected components | Main control |
|---|---|---|---|
| Local development | Fast component iteration | Individual components, local dependencies, test doubles | Reproducible developer setup |
| Contract test | Verify producer and consumer agreement | Contract definitions, mocks, compatibility fixtures | Automated contract verification |
| Shared integration | Validate cross-domain behavior | Integrated frontend, services, database, and development infrastructure | Stable test configuration and diagnostic evidence |
| Staging | Validate representative workflows and operational behavior | Integrated platform and controlled test data | Deployment control and test isolation |
| Simulation | Validate execution workflows without physical robot dependency | Execution services, simulated Lab Agent, simulated robots | Deterministic scenarios and failure injection |
| Physical lab | Validate approved physical hardware workflows | Physical Lab Agent, approved robot configuration, instrumentation | Approved safety procedures and access control |
| Production | Deliver the authorized service | Production-approved components and infrastructure | Security, monitoring, change control, and operational approval |

An environment may be implemented using separate infrastructure or isolated logical configurations. The choice must preserve the purpose and controls of the environment.

### 5.2 Environment Promotion

Promotion between environments requires:

- Identifiable software and artifact versions.
- Configuration appropriate to the destination environment.
- Passing tests required for the relevant checkpoint.
- Review of unresolved defects and known limitations.
- Verification that required secrets and access controls are configured.
- Logs and test evidence that can be traced to the promoted version.
- Approval from the designated environment owner.

A successful test in one environment does not automatically qualify a component for every subsequent environment.

### 5.3 Environment Isolation

- Do not use production credentials in local development or routine contract tests.
- Do not use uncontrolled production data in development or staging.
- Keep simulated robot execution distinguishable from physical robot execution in configuration, logs, and results.
- Restrict physical lab access to approved personnel and procedures.
- Apply appropriate network boundaries to worker, database, Lab Agent, and robot interfaces.
- Keep production secrets and environment-specific configuration outside source control.
- Define retention and cleanup for test artifacts, video, telemetry, and execution records.

### 5.4 Environment Ownership

| Environment | Accountable owner | Supporting owners |
|---|---|---|
| Local development | Relevant component team | DevOps and developer productivity |
| Contract test | Producer and consumer owners jointly | QA / test automation |
| Shared integration | Designated integration owner | Frontend, backend, database, and cloud owners |
| Staging | Cloud / platform operations owner | Domain owners and QA |
| Simulation | Execution and simulation owner | Backend, Local Runtime, and QA |
| Physical lab | Robotics / lab owner | Lab Agent, embedded, controls, and safety reviewer |
| Production | Designated operations owner | Security, domain owners, release lead |

One person may hold multiple roles in a small team, but each environment must have an explicitly accountable owner.

---

## 6. Interface Contract Management

### 6.1 Contract Inventory

Maintain an inventory of interfaces that cross component boundaries.

| Contract area | Producer and consumer | Required contract information |
|---|---|---|
| Studio workflow | Studio and applicable backend services | Request shape, user-visible state, validation, and errors |
| Local build | Studio, Local Runtime, and build services as applicable | Inputs, outputs, process status, cancellation, and diagnostics |
| Artifact | Local Runtime, artifact services, and downstream consumers | Identity, version, integrity, storage, and retrieval |
| Identity and authorization | Studio, Control Plane, and protected services | Identity context, permissions, denial behavior, and audit requirements |
| Core platform data | Control Plane and database | Schema ownership, transactions, consistency, and migration behavior |
| Booking | Studio, booking services, and database | Resource state, reservation behavior, conflicts, and cancellation |
| Execution | Control Plane, execution services, and Lab Agent | Command lifecycle, acknowledgement, timeout, cancellation, and errors |
| Lab Agent | Platform and Lab Agent | Registration, health, capability reporting, command handling, and evidence |
| Robot interface | Lab Agent and robot | Supported commands, feedback, operating limits, and failure behavior |
| Video | Video producer and consuming services or clients | Stream identity, lifecycle, access, transport, and failure behavior |
| Telemetry | Telemetry producer and data consumers | Schema, timestamps, units, ordering, and loss handling |
| Results | Execution and results services, database, and Studio | Completion state, result identity, provenance, and retrieval |
| Operational telemetry | Services and observability infrastructure | Metric names, labels, health indicators, and alert semantics |

The inventory identifies contract categories. Detailed schemas and API definitions remain in the domain specifications.

### 6.2 Contract Requirements

Each cross-domain contract should specify:

- A stable name and accountable owner.
- Producer and consumer responsibilities.
- Supported version or compatibility policy.
- Required fields and field semantics.
- Error codes or failure categories.
- Authentication and authorization expectations.
- Timeouts, retry rules, and idempotency where applicable.
- Ordering and consistency expectations where applicable.
- Observability and correlation identifiers.
- Test fixtures and representative success and failure cases.
- Deprecation and migration behavior.

### 6.3 Contract Change Procedure

For a proposed contract change:

1. The owning team records the change and its motivation.
2. Affected consumers are identified.
3. Compatibility and migration implications are assessed.
4. Contract tests are updated or added.
5. The change is reviewed by the relevant producer and consumer owners.
6. Implementation and deployment sequencing is agreed.
7. The integrated behavior is verified in the appropriate environment.
8. Documentation and compatibility evidence are updated.

Breaking changes must not be introduced silently into shared environments.

### 6.4 Contract-Test Expectations

Contract tests should verify:

- Valid request and response structures.
- Required-field and type validation.
- Rejection of malformed or unsupported inputs.
- Error behavior and failure semantics.
- Authorization behavior where relevant.
- Compatibility with supported contract versions.
- Required correlation identifiers and diagnostic fields.
- Boundary conditions and relevant resource limits.
- Retry and idempotency behavior where required.

A mock-based contract test verifies an interface assumption. It does not replace a test against the actual integrated implementation.

---

## 7. Integration Test Strategy

### 7.1 Test Layers

| Layer | Objective | Typical execution point | Evidence |
|---|---|---|---|
| Unit tests | Validate component-local behavior | Local development and CI | Test results |
| Contract tests | Validate producer-consumer agreement | CI and integration environments | Contract test report |
| Component integration tests | Validate a component with its direct dependencies | CI or shared integration | Logs and test report |
| Cross-domain integration tests | Validate connected components across ownership boundaries | Shared integration and staging | Versioned test evidence |
| End-to-end tests | Validate complete approved user workflows | Staging and simulation | Workflow result and correlation data |
| Failure-injection tests | Validate behavior under selected dependency failures | Isolated test environment | Failure and recovery evidence |
| Physical validation tests | Validate approved hardware behavior | Physical lab | Test records and required safety approvals |
| Production readiness tests | Validate deployment, recovery, monitoring, and operational controls | Production-like environment | Readiness report and approvals |

### 7.2 Test Design Rules

- Each test should have a named owner and a clear purpose.
- Tests must identify the components and versions under test.
- Use deterministic fixtures when practical.
- Keep test setup and cleanup explicit.
- Preserve diagnostic logs for failures.
- Avoid tests that silently depend on mutable external state.
- Keep slow or hardware-dependent tests separate from fast component tests.
- Make environment-specific prerequisites visible.
- Link test evidence to the applicable milestone acceptance criteria.
- Treat flaky tests as defects in the test system or an identified source of nondeterminism; do not silently ignore them.

### 7.3 Minimum Failure Scenarios

As applicable to the contract and approved scope, test:

- Dependency unavailable at request time.
- Dependency failure after partial progress.
- Invalid or expired credentials.
- Unauthorized access.
- Malformed requests and responses.
- Duplicate requests.
- Timeout and cancellation.
- Stale or inconsistent state.
- Database failure or migration incompatibility.
- Worker or Lab Agent disconnection.
- Simulated robot fault or unresponsive endpoint.
- Video or telemetry stream interruption.
- Incomplete results or delayed persistence.
- Storage or capacity exhaustion.
- Configuration mismatch between environments.
- Recovery and cleanup after an interrupted workflow.

Not every failure scenario belongs in every phase. Apply scenarios where they are relevant and permitted by the milestone scope.

---

## 8. Phase Integration Checkpoints

### 8.1 Checkpoint Model

Each phase should use explicit integration checkpoints.

| Checkpoint | Purpose | Required evidence |
|---|---|---|
| IC-01: Contract readiness | Confirm cross-domain contracts are defined and owned | Contract inventory and reviewed interfaces |
| IC-02: Environment readiness | Confirm required integration environment is available | Configuration, access, and health checks |
| IC-03: Component compatibility | Confirm required component versions work together | Contract and component integration tests |
| IC-04: Workflow integration | Confirm the intended cross-domain workflow operates | Repeatable workflow evidence |
| IC-05: Failure-path verification | Confirm required error and recovery behavior | Failure tests and diagnostic records |
| IC-06: Acceptance handoff | Confirm integration evidence is available for milestone review | Linked reports, open-defect list, and review status |

Checkpoint identifiers are integration tracking identifiers, not phase or milestone identifiers.

### 8.2 Checkpoint Completion Rules

A checkpoint is complete only when:

- The intended scope is clear.
- Required components and versions are identified.
- Required tests have executed in the appropriate environment.
- Results are recorded and traceable.
- Blocking defects are resolved or explicitly dispositioned by the authorized owner.
- Applicable acceptance evidence is linked.
- Required security or safety reviews have not been bypassed.

A checkpoint can be blocked even when individual components have passed their own tests.

---

## 9. P0 FOUNDATION — Integration Plan

### 9.1 Integration Objective

Establish the basic integration discipline, ownership model, and development infrastructure needed for cross-domain work.

### 9.2 Integration Activities

- Identify component owners and integration counterparts.
- Establish repository, CI, and environment conventions.
- Define how interface contracts are proposed, reviewed, versioned, and tested.
- Establish the initial contract inventory.
- Identify the data and configuration boundaries between local development and shared services.
- Agree on common diagnostic practices, including correlation identifiers where applicable.
- Create the initial integration test structure.
- Establish a documented process for reporting cross-domain defects.

### 9.3 Environment

Use local development and baseline CI environments. Add only the shared infrastructure required to validate the initial approved interfaces.

### 9.4 Checkpoint

Complete IC-01 and IC-02 for the interfaces and environments required by the applicable milestone scope.

### 9.5 Acceptance

- Accountable owners exist for the initial integration boundaries.
- The team can build and test the baseline code in a reproducible environment.
- Initial contracts are discoverable and version-controlled.
- CI can execute the agreed baseline tests.
- Cross-domain defects can be tracked to an owner and reproducible evidence.

---

## 10. P1 STUDIO — Integration Plan

### 10.1 Integration Objective

Integrate desktop Studio workflows with their approved local and service dependencies while preserving clear boundaries between user interface, Local Runtime, and platform services.

### 10.2 Integration Activities

- Integrate the desktop application shell with project workflows.
- Verify configuration and error handling at frontend boundaries.
- Define the interaction between Studio and Local Runtime for supported local operations.
- Validate behavior when local dependencies are missing or unavailable.
- Define the frontend-facing contract assumptions needed for later backend integration.
- Verify application startup, shutdown, and error reporting.
- Ensure UI state does not falsely imply that a backend or runtime operation has succeeded.
- Establish automated tests for the critical Studio workflows.

### 10.3 Relevant Milestones

- F-M01 STUDIO FOUNDATION (P0-P1)
- F-M02 PROJECTS (P1)

Cloud support may use C-M02 DEVELOPMENT (P1-P3), subject to the scope of the applicable cloud milestone dossier.

### 10.4 Environment

Use local development and CI with controlled local dependencies. Use contract fixtures for backend interfaces that are not yet available as integrated services.

### 10.5 Acceptance

- Approved desktop Studio workflows can be executed reproducibly.
- Local and service errors are surfaced accurately.
- Frontend integration assumptions are documented and testable.
- UI tests cover critical paths and relevant failure behavior.
- Tests do not require uncontrolled production data or credentials.

---

## 11. P2 BUILD & ARTIFACT — Integration Plan

### 11.1 Integration Objective

Integrate local build and artifact workflows across Studio, Local Runtime, artifact-related services, and required infrastructure.

### 11.2 Integration Activities

- Define and verify the interface for initiating a supported local build.
- Verify build status, diagnostics, cancellation, and completion behavior.
- Integrate artifact creation, identity, validation, and retrieval as applicable.
- Verify that consumers can identify the artifact version and its provenance.
- Confirm the handling of failed builds and incomplete artifacts.
- Integrate relevant CI and artifact storage capabilities.
- Verify that frontend status accurately reflects the underlying operation.
- Test compatibility between local build outputs and downstream consumers.

### 11.3 Relevant Milestones

- F-M03 BUILD & ARTIFACT (P2)
- B-M02 ARTIFACT (P2-P3)
- DB-M01 FOUNDATION (P0-P3)
- C-M02 DEVELOPMENT (P1-P3)

### 11.4 Environment

Use local development, contract tests, CI, and shared integration. Artifact storage must use controlled test data and explicit retention behavior.

### 11.5 Acceptance

- Local build requests and outcomes follow a documented contract.
- Successful artifacts can be identified and validated.
- Failed or incomplete operations produce actionable diagnostics.
- Artifact integrity and versioning behavior are tested.
- Integration tests cover the applicable producer-consumer paths.
- The evidence is sufficient for the applicable milestone review.

---

## 12. P3 CONTROL PLANE — Integration Plan

### 12.1 Integration Objective

Integrate backend services, identity, database behavior, and supporting cloud infrastructure into a coherent platform service boundary.

### 12.2 Integration Activities

- Verify authentication and authorization across relevant service boundaries.
- Integrate the Control Plane with core platform data.
- Verify database migrations and schema compatibility.
- Exercise service startup, health checks, and dependency failure behavior.
- Confirm request validation, error mapping, and correlation identifiers.
- Verify that local and cloud environment configuration remains explicit.
- Integrate artifact-related services with the platform interfaces where applicable.
- Validate frontend-to-backend contracts using both contract tests and actual integrated services.
- Establish service-level observability for integration failures.

### 12.3 Relevant Milestones

- B-M01 CONTROL PLANE (P3)
- B-M02 ARTIFACT (P2-P3)
- B-M03 PLATFORM (P3)
- DB-M01 FOUNDATION (P0-P3)
- DB-M02 CORE DATA (P3)
- C-M02 DEVELOPMENT (P1-P3)

### 12.4 Environment

Use shared integration with controlled database instances, test identities, and versioned configuration. Use staging-like deployment only where needed by the applicable milestone scope.

### 12.5 Acceptance

- Core service interfaces and identity behavior are verified.
- Database migrations are repeatable and tested.
- Service failures produce diagnosable results.
- Authorization and invalid-request paths are tested.
- Relevant frontend and backend contracts are verified against integrated implementations.
- Environment configuration and secrets are controlled.
- Required integration evidence is linked to the applicable milestone acceptance criteria.

---

## 13. P4 BOOKING & COMMERCIAL — Integration Plan

### 13.1 Integration Objective

Integrate resource booking and financial-system workflows across Studio, backend services, database, and cloud staging infrastructure.

### 13.2 Integration Activities

- Verify booking requests against the authoritative resource state.
- Test reservation conflicts and concurrent requests.
- Verify transaction behavior for creation, updates, cancellation, and relevant retries.
- Integrate frontend status and error behavior with the booking service contract.
- Validate persistence and consistency of booking records.
- Integrate financial-system interfaces within the approved scope.
- Verify auditability and access controls for sensitive operations.
- Exercise failure recovery and reconciliation behavior.
- Validate that test transactions cannot unintentionally affect production systems.

### 13.3 Relevant Milestones

- F-M04 BOOKING (P4)
- B-M04 BOOKING (P4)
- DB-M03 BOOKING DATA (P4)
- C-M03 STAGING (P4-P7)

### 13.4 Environment

Use staging with isolated test resources and non-production financial-system credentials. Use controlled test fixtures to validate conflicts, retries, and reconciliation.

### 13.5 Acceptance

- Booking behavior follows the documented contract.
- Concurrent requests and conflicts produce defined outcomes.
- Persistence and transaction behavior are verified.
- Cancellation and retry behavior are covered where applicable.
- Financial-system test paths are isolated and traceable.
- Authorization and audit requirements are verified.
- No test can unintentionally commit an uncontrolled production transaction.

---

## 14. P5 EXECUTION — Integration Plan

### 14.1 Integration Objective

Integrate remote execution through the Control Plane and execution services to a simulated Lab Agent and simulated robots.

P5 EXECUTION validates the software execution path without making physical robot availability a prerequisite.

### 14.2 Integration Activities

- Define the execution request and lifecycle contract.
- Integrate execution orchestration with the approved backend services.
- Connect the platform execution path to the simulated Lab Agent.
- Verify simulated robot discovery or configuration, health, and capability representation as applicable.
- Test command acknowledgement, progress, completion, failure, timeout, and cancellation.
- Verify that execution records and status transitions are persisted consistently.
- Test worker and Lab Agent disconnection.
- Confirm cleanup after failed or interrupted runs.
- Verify that execution results can be associated with the originating request and artifact where applicable.
- Ensure simulation identity is explicit in configuration and diagnostic records.

### 14.3 Relevant Milestones

- F-M05 EXECUTION (P5)
- B-M05 EXECUTION (P5)
- DB-M04 EXECUTION DATA (P5-P7)
- C-M03 STAGING (P4-P7)

### 14.4 Environment

Use an isolated simulation environment with a simulated Lab Agent and simulated robot endpoints. Keep test scenarios reproducible and support controlled failure injection.

### 14.5 Acceptance

- A supported execution request can traverse the integrated software path to the simulated Lab Agent.
- Simulated robot interactions follow the defined interface contract.
- Lifecycle transitions and terminal outcomes are traceable.
- Timeout, cancellation, and disconnection behavior are tested.
- Execution state is persisted and retrievable as required.
- Failures produce sufficient diagnostic evidence.
- The test environment clearly distinguishes simulated operation from physical hardware operation.

---

## 15. P6 LAB & ROBOT — Integration Plan

### 15.1 Integration Objective

Integrate the physical Lab Agent and approved physical robots into the platform execution path, building on the software contracts exercised in P5 EXECUTION.

Physical integration introduces hardware, electrical, mechanical, timing, and safety concerns that cannot be fully validated by simulation.

### 15.2 Integration Activities

- Confirm physical Lab Agent configuration and software version.
- Verify connectivity, identity, health, and capability reporting.
- Integrate the Lab Agent with the approved robot interface.
- Verify hardware discovery and configuration as applicable.
- Test command and feedback paths within approved operating limits.
- Validate error reporting for disconnected, unhealthy, or unresponsive hardware.
- Verify that execution records distinguish physical runs from simulated runs.
- Check timeouts, cleanup, and recovery behavior under controlled conditions.
- Preserve hardware configuration, test procedure, and validation evidence.
- Verify emergency-stop and other required protective behavior through approved procedures.
- Ensure that physical test authorization and supervision requirements are satisfied.

### 15.3 Relevant Milestones

- B-M06 RESULTS (P6-P7), where physical execution evidence or results integration is within the approved scope.
- DB-M04 EXECUTION DATA (P5-P7)
- C-M03 STAGING (P4-P7)

Other milestone participation must follow the scope defined by the applicable milestone dossiers.

### 15.4 Environment

Use the designated physical lab with the approved hardware configuration, instrumentation, access controls, and test procedures. Physical testing must not be treated as a routine extension of simulation CI.

### 15.5 Acceptance

- The physical Lab Agent connects through the documented interface.
- Hardware identity and configuration are traceable.
- Approved command and feedback paths are validated.
- Relevant fault and recovery behavior is tested.
- Physical execution records are distinguishable from simulation records.
- Required safety checks and human approvals are recorded.
- Test evidence is sufficient for the applicable milestone review.

Passing software integration tests alone is not authorization to operate physical hardware.

---

## 16. P7 LIVE & RESULTS — Integration Plan

### 16.1 Integration Objective

Integrate live video, telemetry, and results with the execution and laboratory data paths so that approved workflows can present traceable operational evidence.

### 16.2 Integration Activities

- Integrate live video lifecycle and access behavior.
- Verify telemetry schemas, timestamps, units, and relevant ordering assumptions.
- Connect execution and lab events to the appropriate results records.
- Verify correlation between requests, execution records, telemetry, video, and results where required.
- Test stream interruption and recovery behavior.
- Validate missing, delayed, or incomplete telemetry handling.
- Verify results persistence, retrieval, and authorization.
- Confirm storage and retention behavior for video and telemetry.
- Test the frontend's handling of partial availability.
- Measure representative throughput, latency, and storage usage.
- Ensure access and privacy requirements are enforced.

### 16.3 Relevant Milestones

- F-M06 LIVE (P7)
- F-M07 RESULTS (P7)
- B-M06 RESULTS (P6-P7)
- DB-M04 EXECUTION DATA (P5-P7)
- C-M03 STAGING (P4-P7)

### 16.4 Environment

Use staging with representative video and telemetry sources, controlled test identities, and realistic but bounded data volumes. Use physical-lab data only where its use is authorized.

### 16.5 Acceptance

- Live video and telemetry behave according to the defined contracts.
- Stream or ingestion failures are observable and handled.
- Results can be associated with the correct execution or test context.
- Relevant data is persisted and retrievable.
- Access control and retention requirements are tested.
- Partial availability is represented accurately to users.
- Representative load tests produce evidence for capacity planning.

---

## 17. P8 PRODUCTION — Integration Plan

### 17.1 Integration Objective

Harden the integrated system for security, scale, operations, and authorized production launch.

### 17.2 Integration Activities

- Verify production configuration and deployment artifacts.
- Review trust boundaries, access controls, secrets, and service identities.
- Validate vulnerability remediation and security test outcomes.
- Exercise backup and restore procedures.
- Verify observability, alerting, and incident diagnostics.
- Run capacity and load tests against agreed production targets.
- Test failure recovery and service dependency behavior.
- Validate database migration and rollback strategy.
- Confirm operational runbooks, ownership, and escalation paths.
- Verify release and rollback procedures.
- Confirm support readiness and change-control practices.
- Complete required production security and release approvals.

### 17.3 Relevant Milestones

- B-M07 PRODUCTION (P8)
- C-M04 PRODUCTION (P8)

Other participating milestones remain governed by their own scope and acceptance criteria.

### 17.4 Environment

Use a production-like staging environment before any authorized production deployment. Production credentials, access, data, and change procedures must remain restricted.

### 17.5 Acceptance

- Required security and production checks have passed or have approved dispositions.
- Deployment artifacts and configuration are identifiable and reproducible.
- Backup, restore, and rollback procedures have been exercised as required.
- Observability and incident response are operational.
- Performance and capacity evidence supports the approved launch scope.
- Operations and support ownership is explicit.
- Release authorization is recorded by the designated accountable owners.

Production integration readiness does not itself authorize physical robot deployment or operation.

---

## 18. Cross-Domain End-to-End Workflows

### 18.1 Studio to Local Build and Artifact

**Primary phase:** P1 STUDIO and P2 BUILD & ARTIFACT.

Verify that a user can initiate an approved local build workflow, observe progress and failure states, and identify the resulting artifact where applicable.

Evidence should include:

- User workflow result.
- Build request and outcome.
- Artifact identity and integrity result.
- Failure-path diagnostics.
- Contract and integration test reports.

### 18.2 Platform and Data Integration

**Primary phase:** P3 CONTROL PLANE.

Verify that the relevant frontend and backend operations use the intended identity context, service contracts, and persistent data model.

Evidence should include:

- Contract test results.
- Authorization and invalid-request tests.
- Migration and data-integrity evidence.
- Service diagnostics.
- Traceable test data and component versions.

### 18.3 Booking and Financial Workflows

**Primary phase:** P4 BOOKING & COMMERCIAL.

Verify booking operations and the relevant financial-system path in an isolated environment.

Evidence should include:

- Booking creation and state transitions.
- Conflict and cancellation behavior.
- Transaction and reconciliation evidence.
- Access-control and audit records.
- Confirmation that the test environment cannot modify production transactions.

### 18.4 Remote Simulated Execution

**Primary phase:** P5 EXECUTION.

Verify the end-to-end software execution path from request to simulated Lab Agent and simulated robot, including lifecycle transitions and failure behavior.

Evidence should include:

- Execution request identity.
- Simulated Lab Agent and robot configuration.
- Command and state-transition trace.
- Terminal outcome.
- Persisted execution record.
- Failure and recovery results.

### 18.5 Physical Robot Integration

**Primary phase:** P6 LAB & ROBOT.

Verify the approved physical Lab Agent and robot path under documented lab procedures.

Evidence should include:

- Hardware and software configuration.
- Approved test procedure.
- Test operator and review records where required.
- Command and feedback evidence.
- Fault handling and recovery results.
- Applicable safety approvals.

### 18.6 Live Video, Telemetry, and Results

**Primary phase:** P7 LIVE & RESULTS.

Verify that approved execution or laboratory activity can be associated with live video, telemetry, and results.

Evidence should include:

- Stream and telemetry identifiers.
- Timestamps and correlation information.
- Results records and retrieval outcomes.
- Access-control and retention checks.
- Representative performance and failure evidence.

### 18.7 Production Operation

**Primary phase:** P8 PRODUCTION.

Verify that the integrated product can be deployed, observed, recovered, and supported within the approved production scope.

Evidence should include:

- Deployment and configuration records.
- Security review and remediation status.
- Load and recovery test results.
- Backup and restore evidence.
- Monitoring and alert verification.
- Incident and rollback procedures.
- Required release approvals.

---

## 19. Integration Acceptance and Defect Management

### 19.1 Acceptance Evidence Package

For each phase-level integration checkpoint, retain an evidence package containing:

- Phase and applicable milestone IDs.
- Components and versions tested.
- Environment and configuration identity.
- Contract and integration test results.
- Relevant logs, traces, and diagnostic records.
- Known defects and approved dispositions.
- Required security, privacy, or safety review records.
- Reviewer and acceptance status.
- Links to the applicable milestone acceptance criteria.

Do not copy complete task acceptance documents into this plan. Link to their authoritative locations.

### 19.2 Defect Severity

Use the project's agreed defect-severity policy. At a minimum, distinguish:

- **Blocker:** Prevents a required integration workflow or violates a mandatory safety or security condition.
- **High:** Breaks a critical contract or prevents a required acceptance scenario.
- **Medium:** Affects a non-critical path with a documented workaround.
- **Low:** Minor behavior or diagnostic issue that does not block the agreed checkpoint.

The exact severity definitions and release policy should be maintained in the applicable testing and review documentation.

### 19.3 Defect Ownership

- The component owner investigates defects localized to that component.
- The contract owner coordinates clarification when the interface itself is ambiguous.
- The integration owner coordinates reproduction across component boundaries.
- The environment owner investigates configuration and infrastructure failures.
- Security and safety findings are routed to the designated reviewers and cannot be waived by ordinary integration triage.
- The milestone owner determines whether a defect blocks milestone acceptance under the applicable criteria.

### 19.4 Defect Closure

A defect is ready for closure when:

- The root cause or accepted explanation is recorded.
- The fix or approved disposition is identified.
- Relevant regression tests pass.
- The affected integration workflow is revalidated.
- Required evidence is attached or linked.
- Any remaining limitations are communicated to affected owners.

---

## 20. Integration Readiness and Phase Handoffs

### 20.1 Handoff Requirements

Before handing integrated work to the next phase, confirm:

- Required contracts are documented and versioned.
- The relevant integrated workflow is reproducible.
- Required tests and evidence are available.
- Known limitations and defects are documented.
- The receiving phase's dependencies are identified.
- Ownership for unresolved integration work is explicit.
- Required environment and tooling access is available.
- Security, safety, and release gates remain visible and assigned.

### 20.2 Handoff Matrix

| From phase | To phase | Handoff focus |
|---|---|---|
| P0 FOUNDATION | P1 STUDIO | Engineering conventions, interface ownership, and baseline tooling |
| P1 STUDIO | P2 BUILD & ARTIFACT | Desktop workflow and local-operation integration assumptions |
| P2 BUILD & ARTIFACT | P3 CONTROL PLANE | Artifact and service integration contracts |
| P3 CONTROL PLANE | P4 BOOKING & COMMERCIAL | Backend, identity, and data foundations |
| P4 BOOKING & COMMERCIAL | P5 EXECUTION | Approved booking and resource workflow dependencies needed by execution |
| P5 EXECUTION | P6 LAB & ROBOT | Validated simulated execution contracts and diagnostic practices |
| P6 LAB & ROBOT | P7 LIVE & RESULTS | Approved physical test evidence and data-source integration requirements |
| P7 LIVE & RESULTS | P8 PRODUCTION | Integrated live and results workflows, measured workloads, and operational requirements |

This matrix is a coordination aid. It does not mean every downstream capability depends on every upstream deliverable; the applicable milestone dossiers determine the actual dependency set.

### 20.3 Handoff Acceptance

A handoff should not be marked complete merely because the producing team has merged its code. The receiving team must be able to identify the relevant contracts, run or inspect the required tests, and understand any limitations that affect its work.

---

## 21. Integration Risks and Mitigations

| Risk | Potential impact | Mitigation |
|---|---|---|
| Contract changes without coordination | Integration breakage and rework | Version contracts and require consumer review |
| Mock-only verification | False confidence in end-to-end behavior | Test against actual integrated implementations |
| Shared environment instability | Unreliable test results | Assign environment ownership and control configuration changes |
| Unclear data ownership | Conflicting state and migration problems | Document authoritative data owners and schema contracts |
| Identity inconsistency | Unauthorized access or blocked workflows | Test identity propagation and authorization at trust boundaries |
| Uncontrolled retries | Duplicate operations or inconsistent state | Define idempotency and retry semantics |
| Missing diagnostics | Slow failure isolation | Standardize correlation identifiers and preserve logs |
| Simulation differs from hardware | Incorrect assumptions during physical integration | Document simulation limits and validate physical behavior separately |
| Physical test performed without approval | Safety risk | Require approved procedures and designated human review |
| Video or telemetry overload | Latency, cost, or data loss | Measure workloads and define retention and backpressure behavior |
| Environment drift | Different behavior across development, staging, and production | Version configuration and automate environment checks |
| Incomplete recovery behavior | Stuck workflows and inconsistent state | Test timeouts, cancellation, cleanup, and recovery |
| Inadequate production evidence | Uncontrolled launch risk | Use explicit readiness criteria and recorded approvals |
| Duplicate ownership across teams | Delays and conflicting fixes | Name a single accountable owner for each contract and environment |
| Integration work deferred until late | Expensive cross-domain rework | Integrate incrementally at each phase checkpoint |

Review integration risks at each phase boundary and when a major contract, environment, or dependency changes.

---

## 22. Integration Governance

### 22.1 Roles

| Role | Responsibility |
|---|---|
| Integration lead | Maintains cross-domain sequencing, checkpoints, and escalation |
| Component owner | Owns component implementation and local test evidence |
| Contract owner | Maintains the interface definition and coordinates changes |
| Environment owner | Maintains environment configuration, access, and health |
| QA / test owner | Maintains integration test strategy and evidence quality |
| Database owner | Maintains data contracts, migration safety, and integrity verification |
| Cloud / operations owner | Maintains environment deployment and operational integration |
| Lab Agent / robotics owner | Maintains approved physical integration and hardware diagnostics |
| Security reviewer | Reviews applicable security boundaries and findings |
| Safety reviewer | Reviews applicable physical testing and safety requirements |
| Milestone owner | Confirms milestone-specific acceptance under the authoritative criteria |

Small teams may combine roles, but the accountability for each responsibility must remain explicit.

### 22.2 Integration Review Cadence

At regular integration reviews, assess:

- Current phase checkpoint status.
- Contracts that are missing, changing, or incompatible.
- Cross-domain defects and their owners.
- Environment stability and availability.
- Test coverage and reproducibility.
- Upcoming integration dependencies.
- Physical lab prerequisites and review availability where relevant.
- Security, privacy, and production readiness findings.
- Evidence required for upcoming milestone acceptance.

### 22.3 Decision Records

Record integration decisions when they affect:

- Cross-domain interface contracts.
- Environment promotion or isolation.
- Data ownership or compatibility.
- Execution lifecycle or failure behavior.
- Simulation-to-physical integration.
- Video, telemetry, or results traceability.
- Security, safety, or production gates.

Use the applicable domain planning decisions document and link it from the relevant integration record. Do not use this plan as a substitute for detailed technical decision records.

---

## 23. Integration Plan Maintenance

### 23.1 Update Triggers

Update this plan when:

- The canonical phase or milestone model changes through an approved project decision.
- An authoritative milestone dossier changes a material dependency.
- A new cross-domain contract is introduced.
- Integration environments or promotion rules change.
- A checkpoint identifies a recurring integration gap.
- A phase handoff reveals missing acceptance evidence.
- A security or safety review changes the required integration sequence.
- Production readiness requirements change materially.

### 23.2 Update Rules

- Preserve canonical phase names, numbers, and milestone IDs.
- Keep component implementation details in their owning architecture documents.
- Keep task-specific requirements in task-scoped acceptance documents.
- Replace duplicated material with links to the authoritative source.
- Update the integration dependency and checkpoint tables when the actual dependency changes.
- Record material changes through the project's documentation and review process.

---

## 24. References

Use these documents as the authoritative source for their respective subjects:

- `docs/planning/PHASES.md` — canonical phase definitions.
- Applicable frontend milestone dossiers under `docs/frontend/milestones/` — frontend milestone scope.
- Applicable backend milestone dossiers under `docs/backend/milestones/` — backend milestone scope.
- Applicable database milestone dossiers under `docs/database/milestones/` — database milestone scope.
- Applicable cloud milestone dossiers under `docs/cloud/milestones/` — cloud milestone scope.
- Applicable project milestone dossiers under `docs/milestones/` — project-level phase scope.
- Domain architecture documents under `docs/**/architecture/` — component architecture and interface boundaries.
- Domain planning decisions under `docs/**/planning/DECISIONS.md` — recorded domain decisions.
- Applicable milestone `TASKS.md` — implementation tasks and ownership.
- Task-scoped `ACCEPTANCE_CRITERIA.md` — task-specific acceptance conditions.
- Applicable `REVIEW_CHECKLIST.md` — review requirements and evidence.
- Applicable `CHANGELOG.md` — accepted implementation history.
- Applicable `GIT_COMMIT_STEP.md` — Git operation and commit guidance.
- `docs/planning/RESOURCE_PLAN.md` — staffing, infrastructure, laboratory equipment, and budget categories.

When a conflict exists, use `docs/planning/PHASES.md` for canonical phase names and the applicable milestone dossier for milestone scope. Update this plan to reflect approved changes rather than redefining those sources.

---

## 25. Summary

This integration plan establishes a phased and evidence-driven approach to connecting Kritva RaaS components.

- P0 FOUNDATION establishes integration ownership, contracts, and development infrastructure.
- P1 STUDIO integrates desktop Studio and project workflows.
- P2 BUILD & ARTIFACT integrates local build and artifact workflows.
- P3 CONTROL PLANE integrates backend, identity, data, and platform services.
- P4 BOOKING & COMMERCIAL integrates resource booking and financial-system workflows.
- P5 EXECUTION integrates remote execution with a simulated Lab Agent and simulated robots.
- P6 LAB & ROBOT integrates the physical Lab Agent and physical robots under approved procedures.
- P7 LIVE & RESULTS integrates live video, telemetry, and results.
- P8 PRODUCTION hardens security and operations and validates production readiness.

The plan's core control is explicit ownership: component teams own their implementations, contract owners maintain interfaces, environment owners maintain test environments, and the integration lead coordinates cross-domain evidence and dependencies.

A phase is integration-ready only when its required contracts, environments, tests, diagnostics, and acceptance evidence are available. Physical safety and production release remain separate authorization gates.
