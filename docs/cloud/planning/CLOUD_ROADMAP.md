# Kritva RaaS Cloud Roadmap

**Document Type:** Cloud domain roadmap

**Domain:** Cloud Infrastructure and Operations

**Scope:** C-M01 FOUNDATION through C-M04 PRODUCTION

**Canonical Phase Model:** P0 FOUNDATION through P8 PRODUCTION

**Status:** Planning baseline

**Authority:** Cloud milestone dossiers under `docs/cloud/milestones/` are authoritative for milestone scope. This roadmap defines the cloud delivery sequence, phase mapping, cross-domain dependencies, milestone-level outcomes, and cloud-specific risks.

---

## Ownership and Boundaries

### 1. What this document owns

This document owns the cloud domain roadmap across the four canonical cloud milestones:

- C-M01 FOUNDATION (P0)
- C-M02 DEVELOPMENT (P1-P3)
- C-M03 STAGING (P4-P7)
- C-M04 PRODUCTION (P8)

It establishes:

- The purpose and sequencing of each cloud milestone.
- The mapping between cloud milestones and the canonical phases.
- Cloud milestone entry conditions and dependencies.
- Cross-domain dependencies on the canonical backend and database milestones.
- Infrastructure handoffs between development, staging, and production.
- Cloud roadmap risks, sequencing constraints, and dependency management.
- Milestone-level cloud outcomes and readiness expectations.
- The relationship between cloud roadmap planning and authoritative milestone dossiers.
- The criteria for assessing roadmap progress without duplicating task-level acceptance evidence.

### 2. What this document does not own

This roadmap does not replace or duplicate:

- Canonical phase definitions: `planning/PHASES.md`.
- System-level planning decisions: `planning/DECISIONS.md`.
- System architecture: `docs/architecture/`.
- System cloud topology: `docs/architecture/CLOUD_ARCHITECTURE.md`.
- Cloud implementation architecture: `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.
- Cloud security architecture: `docs/cloud/architecture/SECURITY_ARCHITECTURE.md`.
- Cloud milestone scope and exit criteria: the corresponding `docs/cloud/milestones/` dossiers.
- Backend service scope and acceptance: the corresponding `docs/backend/milestones/` dossiers.
- Database schema, migration, and data-integrity scope: the corresponding `docs/database/milestones/` dossiers.
- Frontend feature scope: the corresponding `docs/frontend/milestones/` dossiers.
- Global development workflow: `docs/development/`.
- Global testing policy: `docs/development/TESTING_STRATEGY.md`.
- Global release policy: `docs/development/RELEASE_PROCESS.md`.
- Detailed cloud implementation tasks, acceptance conditions, review records, changelog entries, and Git procedures: the relevant milestone sibling files.
- Application business rules, API behavior, database semantics, or physical robot safety approval.

The roadmap identifies these owners and their dependencies but does not redefine their implementation contracts.

### 3. Authority and precedence

Use the following authority order when planning or reviewing cloud work:

1. `planning/PHASES.md` defines canonical phase names and phase boundaries.
2. The milestone dossier for a milestone under `docs/**/milestones/` defines that milestone's scope.
3. System architecture and approved decisions define cross-domain architecture and constraints.
4. This roadmap defines the cloud delivery sequence, cross-domain dependencies, and roadmap-level risks.
5. Sibling task and acceptance files define task execution and detailed evidence requirements.

If a roadmap statement conflicts with an authoritative milestone dossier, the dossier controls milestone scope. If a phase name or number conflicts with `planning/PHASES.md`, the canonical phase model controls.

### 4. Canonical naming rule

All phases and milestones in this document use the frozen canonical names and identifiers.

Phase names:

- P0 FOUNDATION
- P1 STUDIO
- P2 BUILD & ARTIFACT
- P3 CONTROL PLANE
- P4 BOOKING & COMMERCIAL
- P5 EXECUTION
- P6 LAB & ROBOT
- P7 LIVE & RESULTS
- P8 PRODUCTION

Cloud milestone names:

- C-M01 FOUNDATION (P0)
- C-M02 DEVELOPMENT (P1-P3)
- C-M03 STAGING (P4-P7)
- C-M04 PRODUCTION (P8)

Backend milestone names:

- B-M01 CONTROL PLANE (P3)
- B-M02 ARTIFACT (P2-P3)
- B-M03 PLATFORM (P3)
- B-M04 BOOKING (P4)
- B-M05 EXECUTION (P5)
- B-M06 RESULTS (P6-P7)
- B-M07 PRODUCTION (P8)

Database milestone names:

- DB-M01 FOUNDATION (P0-P3)
- DB-M02 CORE DATA (P3)
- DB-M03 BOOKING DATA (P4)
- DB-M04 EXECUTION DATA (P5-P7)

Frontend milestone names:

- F-M01 STUDIO FOUNDATION (P0-P1)
- F-M02 PROJECTS (P1)
- F-M03 BUILD & ARTIFACT (P2)
- F-M04 BOOKING (P4)
- F-M05 EXECUTION (P5)
- F-M06 LIVE (P7)
- F-M07 RESULTS (P7)

The identifiers and names above must be used exactly in tables, headings, dependency descriptions, and cross-references.

---

## 1. Roadmap Objective

The objective of the Kritva RaaS cloud roadmap is to deliver a controlled progression from reusable cloud foundations to development infrastructure, production-parity staging, and a secure, highly available, recoverable production environment.

Cloud delivery must follow the product and engineering phases without taking ownership of application functionality, backend business logic, database semantics, or robot safety.

The roadmap sequences infrastructure capabilities so that each downstream milestone consumes a stable and validated foundation rather than introducing an independent infrastructure model.

### 1.1 Outcomes

The cloud roadmap must deliver the following outcomes:

1. A repeatable and controlled cloud foundation.
2. A development environment suitable for engineering integration.
3. Infrastructure provisioning and configuration practices that are reproducible and reviewable.
4. Secure identity, network, and secret-management conventions.
5. Development deployment integration for approved application artifacts.
6. A staging environment that exercises integrated system capabilities.
7. A documented production-parity assessment.
8. Production infrastructure with explicit availability and recovery objectives.
9. High-availability mechanisms validated against relevant failure scenarios.
10. Backup and restore procedures validated through exercises.
11. Disaster recovery evidence measured against approved RTO and RPO.
12. Production observability and operational ownership.
13. Controlled production deployment and go-live infrastructure.
14. Clear dependency and handoff boundaries between cloud, backend, database, frontend, and operational owners.

### 1.2 Roadmap principles

The cloud roadmap follows these principles:

- **Canonical naming:** use only the frozen phase and milestone names.
- **Single ownership:** each milestone dossier defines its milestone's authoritative scope.
- **Incremental delivery:** downstream environments build on established foundations.
- **Reproducibility:** persistent infrastructure is defined and version-controlled.
- **Environment separation:** development, staging, and production boundaries are explicit.
- **Least privilege:** access is limited to the required workload or operational function.
- **Evidence-based readiness:** configuration alone does not prove availability, recoverability, or operational readiness.
- **Production parity:** staging should exercise the production architecture where practical, with differences documented.
- **Controlled promotion:** deployment to a more consequential environment requires the applicable approvals and checks.
- **Recovery by design:** backup, restoration, and disaster recovery are planned and tested rather than assumed.
- **Cross-domain coordination:** cloud dependencies are explicit, while backend and database owners retain their implementation responsibilities.
- **No implicit safety claims:** cloud readiness does not establish physical robot safety.

### 1.3 Roadmap completion principle

The cloud roadmap is complete when C-M01 FOUNDATION, C-M02 DEVELOPMENT, C-M03 STAGING, and C-M04 PRODUCTION have each met their authoritative exit criteria and the required cross-domain handoffs have been accepted.

A cloud milestone may be technically complete while a dependent product capability remains blocked by another domain. Such a state must be recorded as a dependency status, not concealed by broad claims of system readiness.

---

## 2. Canonical Phase and Milestone Mapping

### 2.1 Phase model

| Phase | Canonical name | Cloud relationship |
|---|---|---|
| P0 | FOUNDATION | Establishes the reusable cloud foundation through C-M01 FOUNDATION (P0) |
| P1 | STUDIO | Consumes the foundation for early engineering and application development through C-M02 DEVELOPMENT (P1-P3) |
| P2 | BUILD & ARTIFACT | Supports artifact creation and controlled deployment through C-M02 DEVELOPMENT (P1-P3) |
| P3 | CONTROL PLANE | Supports development integration for identity, projects, platforms, and artifact services through C-M02 DEVELOPMENT (P1-P3) |
| P4 | BOOKING & COMMERCIAL | Exercises booking-related workloads in C-M03 STAGING (P4-P7) |
| P5 | EXECUTION | Exercises execution-related workloads in C-M03 STAGING (P4-P7) |
| P6 | LAB & ROBOT | Exercises approved lab and robot integration in C-M03 STAGING (P4-P7) |
| P7 | LIVE & RESULTS | Exercises live and results workloads in C-M03 STAGING (P4-P7) |
| P8 | PRODUCTION | Establishes the production environment through C-M04 PRODUCTION (P8) |

### 2.2 Cloud milestone map

| Cloud milestone | Phase mapping | Primary responsibility | Main handoff |
|---|---|---|---|
| C-M01 FOUNDATION (P0) | P0 FOUNDATION | Shared cloud foundation, account and project conventions, baseline networking, identity, and infrastructure tooling | Reusable cloud foundation |
| C-M02 DEVELOPMENT (P1-P3) | P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE | Development infrastructure, engineering integration, and deployment patterns | Development environment and reusable provisioning patterns |
| C-M03 STAGING (P4-P7) | P4 BOOKING & COMMERCIAL; P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS | Integrated staging environment, parity assessment, and pre-production validation infrastructure | Staging evidence and production-parity findings |
| C-M04 PRODUCTION (P8) | P8 PRODUCTION | Production infrastructure, HA, DR, operational readiness, and go-live infrastructure | Production environment and operational handoff |

### 2.3 Frontend milestone dependencies

The frontend milestones define client behavior and feature requirements. Cloud milestones provide hosting, delivery, endpoint, and runtime infrastructure where applicable.

| Frontend milestone | Phase mapping | Cloud dependency |
|---|---|---|
| F-M01 STUDIO FOUNDATION (P0-P1) | P0 FOUNDATION; P1 STUDIO | Development hosting and environment conventions |
| F-M02 PROJECTS (P1) | P1 STUDIO | Development service connectivity and configuration |
| F-M03 BUILD & ARTIFACT (P2) | P2 BUILD & ARTIFACT | Artifact-related development integration and deployment targets |
| F-M04 BOOKING (P4) | P4 BOOKING & COMMERCIAL | Staging and production endpoint and runtime availability |
| F-M05 EXECUTION (P5) | P5 EXECUTION | Staging and production runtime and connectivity |
| F-M06 LIVE (P7) | P7 LIVE & RESULTS | Live endpoint availability and delivery infrastructure |
| F-M07 RESULTS (P7) | P7 LIVE & RESULTS | Results endpoint and frontend delivery infrastructure |

The relevant frontend milestone dossier remains authoritative for feature scope and frontend acceptance.

### 2.4 Backend milestone dependencies

Backend milestones define service behavior and service-specific requirements. Cloud milestones provide infrastructure, networking, identity integration, deployment targets, and operational observability.

| Backend milestone | Phase mapping | Cloud dependency |
|---|---|---|
| B-M01 CONTROL PLANE (P3) | P3 CONTROL PLANE | Development identity, network, and runtime integration |
| B-M02 ARTIFACT (P2-P3) | P2 BUILD & ARTIFACT; P3 CONTROL PLANE | Artifact-service runtime, registry or storage connectivity, and deployment integration |
| B-M03 PLATFORM (P3) | P3 CONTROL PLANE | Platform-service runtime, identity integration, and resource connectivity |
| B-M04 BOOKING (P4) | P4 BOOKING & COMMERCIAL | Staging and production runtime, database connectivity, and observability |
| B-M05 EXECUTION (P5) | P5 EXECUTION | Staging and production execution-service runtime and dependency connectivity |
| B-M06 RESULTS (P6-P7) | P6 LAB & ROBOT; P7 LIVE & RESULTS | Results-service runtime, storage, telemetry paths, and observability |
| B-M07 PRODUCTION (P8) | P8 PRODUCTION | Production deployment targets, runtime availability, and operational integration |

Backend milestone dossiers remain authoritative for API behavior, business logic, service state transitions, and service-level correctness.

### 2.5 Database milestone dependencies

Database milestones define schema, migrations, data integrity, and persistence semantics. Cloud milestones provide database infrastructure, connectivity, protection, and recovery integration.

| Database milestone | Phase mapping | Cloud dependency |
|---|---|---|
| DB-M01 FOUNDATION (P0-P3) | P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE | Development database infrastructure, identity integration, and migration execution support |
| DB-M02 CORE DATA (P3) | P3 CONTROL PLANE | Platform and artifact metadata database infrastructure and access |
| DB-M03 BOOKING DATA (P4) | P4 BOOKING & COMMERCIAL | Staging and production database capacity, access, backup, and recovery integration |
| DB-M04 EXECUTION DATA (P5-P7) | P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS | Staging and production persistence, storage, backup, and recovery integration |

Database milestone dossiers remain authoritative for schema design, migrations, constraints, RLS, transactions, and data-level restore validation.

---

## 3. Roadmap Sequencing and Dependencies

### 3.1 Sequence overview

The cloud roadmap follows this sequence:

1. C-M01 FOUNDATION (P0) establishes shared infrastructure conventions and reusable cloud primitives.
2. C-M02 DEVELOPMENT (P1-P3) applies those primitives to development workloads and engineering integration.
3. C-M03 STAGING (P4-P7) provides a representative integrated environment for cross-domain validation and parity assessment.
4. C-M04 PRODUCTION (P8) establishes the production environment, availability and recovery controls, operational readiness, and go-live infrastructure.

The sequence expresses infrastructure dependency and evidence progression. It does not imply that all application work in a phase must be completed before all cloud work can begin. Parallel implementation is allowed when prerequisite interfaces, security assumptions, and resource boundaries are stable.

### 3.2 Dependency gates

| Gate | Required condition | Downstream effect |
|---|---|---|
| Foundation readiness | C-M01 FOUNDATION (P0) establishes approved cloud conventions and usable infrastructure primitives | Enables repeatable development provisioning |
| Development readiness | C-M02 DEVELOPMENT (P1-P3) supports the required engineering and service integration paths | Enables integrated staging deployment |
| Staging readiness | C-M03 STAGING (P4-P7) has the required workload paths, diagnostics, and parity evidence | Enables production-specific planning and validation |
| Production infrastructure readiness | C-M04 PRODUCTION (P8) meets its infrastructure, security, availability, and recovery criteria | Enables consideration of go-live |
| Go-live authorization | Required application, data, security, operational, business, and relevant safety approvals are recorded | Permits the authorized production cutover |

A dependency gate must be assessed using evidence from the authoritative owner. A downstream team must not infer readiness solely from a status label.

### 3.3 Parallel work

Cloud work can proceed in parallel with backend, database, and frontend work when the relevant contracts are stable.

Examples include:

- Creating development infrastructure while backend service contracts are being finalized, provided runtime and network assumptions are explicit.
- Preparing database connectivity while schema implementation continues, provided the database owner controls schema and migration decisions.
- Preparing staging ingress while frontend integration continues, provided endpoint and TLS requirements are agreed.
- Preparing production infrastructure definitions before go-live approval, provided production activation remains gated.
- Preparing recovery infrastructure while application acceptance continues, provided the recovery scope and data requirements are approved.

Parallel work must not turn provisional interfaces into unreviewed permanent contracts.

### 3.4 Cross-domain dependency classification

Each dependency must be classified as:

- **Blocking:** the cloud milestone cannot safely meet its objective without the dependency.
- **Conditionally blocking:** preparation may continue, but a dependent capability or go-live must wait for evidence or approval.
- **Non-blocking:** the dependency does not invalidate the current accepted infrastructure scope and has a documented disposition.

Examples:

| Dependency | Typical classification | Required treatment |
|---|---|---|
| Missing production environment identity | Blocking for production activation | Establish and verify the production boundary |
| Missing backend runtime contract | Blocking for deployment of the affected service | Obtain an agreed runtime and health contract |
| Unapproved database migration | Blocking for the affected release | Obtain database-owner approval and execution evidence |
| Missing staging parity evidence | Conditionally blocking for production planning; may block go-live | Record the gap and validate the affected production path |
| Unvalidated HA mechanism | Blocking where required by approved production objectives | Execute the relevant failure exercise |
| Unproven required restore path | Blocking where recoverability is a required production invariant | Execute and validate a restore exercise |
| Non-critical dashboard refinement | Usually non-blocking if required operational visibility exists | Record follow-up and owner |
| Unavailable physical safety approval | Blocking for the affected physical deployment | Obtain the required safety authorization |

The exact classification depends on the approved system and service requirements.

### 3.5 Dependency management

Cross-domain dependencies must have:

- A canonical milestone identifier.
- A named producing owner.
- A consuming cloud milestone.
- A clear input or contract.
- A required-by milestone or decision point.
- A status supported by evidence.
- A classification.
- A resolution owner for open gaps.

Detailed work breakdown and task sequencing belong in the milestone `TASKS.md` files. The roadmap records the milestone-level dependency and its effect on sequencing.

### 3.6 Change propagation

Changes to service interfaces, identity requirements, data access, artifact formats, or runtime topology may affect multiple cloud milestones.

A material dependency change must be assessed for its effect on:

- C-M01 FOUNDATION (P0) conventions.
- C-M02 DEVELOPMENT (P1-P3) provisioning and deployment patterns.
- C-M03 STAGING (P4-P7) integration and parity evidence.
- C-M04 PRODUCTION (P8) security, availability, recovery, and go-live.
- Relevant backend and database milestone contracts.
- Relevant frontend endpoint and delivery requirements.

The authoritative owner must approve changes to its own contract. Cloud implementation changes must follow the approved architecture and change-control processes.

---

## 4. C-M01 FOUNDATION (P0)

### 4.1 Objective

Establish the reusable cloud foundation required for subsequent development, staging, and production environments.

### 4.2 Scope summary

C-M01 FOUNDATION owns the shared cloud infrastructure conventions and foundational capabilities needed by the later cloud milestones.

The milestone may include:

- Cloud account, project, or subscription conventions.
- Foundational network and routing structure.
- Resource naming and tagging.
- Baseline identity and access model.
- Infrastructure-as-code tooling and repository conventions.
- Secret-management integration patterns.
- Shared DNS and certificate conventions where applicable.
- Baseline audit and infrastructure logging.
- Common provisioning and validation patterns.
- Foundational resource ownership.
- Documentation of cloud prerequisites and access.
- Initial infrastructure security baseline.
- Cost and quota visibility for foundational resources.

The exact scope and exit criteria are authoritative in `docs/cloud/milestones/C-M01-FOUNDATION/MILESTONE.md`.

### 4.3 Dependencies

C-M01 FOUNDATION depends on approved system architecture, selected cloud-provider capabilities, organizational access, and the agreed security baseline.

It must identify any cloud-provider assumptions that materially constrain later deployment, availability, or recovery.

### 4.4 Handoff

C-M01 FOUNDATION hands off reusable cloud conventions and infrastructure primitives to C-M02 DEVELOPMENT (P1-P3), C-M03 STAGING (P4-P7), and C-M04 PRODUCTION (P8).

Later milestones may specialize these foundations but must not create inconsistent parallel conventions without an approved reason.

### 4.5 Exit expectation

The milestone is ready for acceptance when the required foundational resources and conventions are reproducible, documented, access-controlled, and usable by the development workflow.

Detailed evidence and pass/fail conditions belong in the C-M01 milestone acceptance file.

---

## 5. C-M02 DEVELOPMENT (P1-P3)

### 5.1 Objective

Provide a repeatable development environment and deployment workflow for the capabilities delivered across P1 STUDIO, P2 BUILD & ARTIFACT, and P3 CONTROL PLANE.

### 5.2 Scope summary

C-M02 DEVELOPMENT applies the shared foundation to engineering workloads and service integration.

The milestone may include:

- Development environment provisioning.
- Developer and workload identity integration.
- Development network and service connectivity.
- Development ingress and endpoint configuration.
- Runtime and orchestration conventions.
- Development database connectivity.
- Artifact registry or storage integration.
- Development deployment automation.
- Configuration and secret injection.
- Development observability.
- Service health and readiness integration.
- Reusable provisioning and deployment patterns.
- Development resource cleanup and lifecycle management.
- Engineering integration support.
- Documented development environment access and troubleshooting.

The exact scope and exit criteria are authoritative in `docs/cloud/milestones/C-M02-DEVELOPMENT/MILESTONE.md`.

### 5.3 Backend dependencies

C-M02 DEVELOPMENT supports the development deployment requirements of:

- B-M01 CONTROL PLANE (P3).
- B-M02 ARTIFACT (P2-P3).
- B-M03 PLATFORM (P3).

The backend milestones own their service behavior, APIs, identity semantics, artifact semantics, and platform rules. Cloud owns the runtime and infrastructure mechanisms required to run and connect those services.

### 5.4 Database dependencies

C-M02 DEVELOPMENT supports:

- DB-M01 FOUNDATION (P0-P3).
- DB-M02 CORE DATA (P3).

Cloud supplies development database infrastructure and connectivity. Database owners retain schema, migration, data-integrity, and persistence-contract ownership.

### 5.5 Frontend dependencies

C-M02 DEVELOPMENT supports:

- F-M01 STUDIO FOUNDATION (P0-P1).
- F-M02 PROJECTS (P1).
- F-M03 BUILD & ARTIFACT (P2).

Cloud provides development hosting, endpoint configuration, and required service connectivity. Frontend owners retain client workflow and user-interface behavior.

### 5.6 Handoff

C-M02 DEVELOPMENT hands off reusable provisioning and deployment patterns, environment configuration conventions, and integration evidence to C-M03 STAGING (P4-P7).

### 5.7 Exit expectation

The milestone is ready for acceptance when required development workloads can be provisioned, deployed, connected, observed, and debugged through documented and repeatable workflows.

Detailed evidence and pass/fail conditions belong in the C-M02 milestone acceptance file.

---

## 6. C-M03 STAGING (P4-P7)

### 6.1 Objective

Provide an integrated staging environment that exercises the system capabilities delivered across P4 BOOKING & COMMERCIAL, P5 EXECUTION, P6 LAB & ROBOT, and P7 LIVE & RESULTS.

Staging must expose integration failures and environment differences before production activation.

### 6.2 Scope summary

C-M03 STAGING owns staging infrastructure, integration environment configuration, staging observability, and production-parity assessment.

The milestone may include:

- Staging environment provisioning.
- Environment isolation and access boundaries.
- Integrated service deployment.
- Staging ingress, DNS, and TLS.
- Staging database and storage connectivity.
- Staging artifact retrieval.
- Staging deployment and configuration promotion.
- Service health and readiness integration.
- Integration diagnostics and log collection.
- Staging monitoring and alert validation.
- Representative capacity checks.
- External integration configuration or approved test modes.
- Lab and robot integration connectivity where in scope.
- Live and results endpoint validation.
- Production-parity comparison.
- Environment-specific differences and risk records.
- Deployment rehearsal and rollback-path assessment.

The exact scope and exit criteria are authoritative in `docs/cloud/milestones/C-M03-STAGING/MILESTONE.md`.

### 6.3 Backend dependencies

C-M03 STAGING supports integrated validation for:

- B-M04 BOOKING (P4).
- B-M05 EXECUTION (P5).
- B-M06 RESULTS (P6-P7).

C-M03 may also validate integration with previously established control-plane, artifact, and platform services where required by the integrated system.

Backend owners remain responsible for service behavior and functional correctness. Staging infrastructure supplies the deployment and diagnostic environment.

### 6.4 Database dependencies

C-M03 STAGING supports:

- DB-M03 BOOKING DATA (P4).
- DB-M04 EXECUTION DATA (P5-P7).

Staging must provide the database connectivity, storage access, and environment configuration required for integration tests.

Database owners remain responsible for schema, migration, data-integrity, and data-level recovery correctness.

### 6.5 Frontend dependencies

C-M03 STAGING supports:

- F-M04 BOOKING (P4).
- F-M05 EXECUTION (P5).
- F-M06 LIVE (P7).
- F-M07 RESULTS (P7).

Staging must provide the appropriate endpoints, TLS configuration, runtime connectivity, and observability needed for frontend integration.

### 6.6 Production-parity assessment

The staging environment must be compared with the intended production architecture for the properties that affect deployment and operation.

The comparison should include:

- Environment isolation.
- Network topology and routing.
- Identity and permission boundaries.
- Secret delivery.
- Runtime configuration.
- Artifact retrieval.
- Database and storage integration.
- Ingress and TLS.
- Monitoring and alerts.
- Deployment strategy.
- Resource and quota assumptions.
- HA and recovery differences.
- External dependency modes.
- Operational access and runbooks.

Parity does not mean that every staging resource must match production capacity or cost. Differences must be explicit, justified, and assessed for their effect on confidence in the validation results.

### 6.7 Handoff

C-M03 STAGING hands off integrated staging evidence, production-parity findings, and known differences to C-M04 PRODUCTION (P8).

The handoff must distinguish verified properties from assumptions and must identify any gap that blocks a production capability or go-live.

### 6.8 Exit expectation

The milestone is ready for acceptance when required integrated workloads can be deployed and exercised, the environment is observable, critical dependencies are reachable, and production-parity differences have been recorded with clear dispositions.

Detailed evidence and pass/fail conditions belong in the C-M03 milestone acceptance file.

---

## 7. C-M04 PRODUCTION (P8)

### 7.1 Objective

Establish a secure, resilient, recoverable, observable, and operationally controlled production environment for authorized Kritva RaaS workloads.

### 7.2 Scope summary

C-M04 PRODUCTION owns production cloud infrastructure, HA, DR, production deployment integration, infrastructure readiness, and go-live infrastructure.

The milestone may include:

- Production environment boundary and resource inventory.
- Production infrastructure as code.
- Production network, routing, ingress, and DNS.
- Production identity and access controls.
- Production secret-management integration.
- Production runtime and orchestration.
- High availability and failure-domain configuration.
- Capacity and quota assessment.
- Production deployment and artifact traceability.
- Database infrastructure and failover integration.
- Backup and restore orchestration.
- Disaster recovery architecture and exercises.
- Approved RTO and RPO assessment.
- Production observability and alerting.
- Incident response integration.
- Infrastructure patching and drift management.
- Production change-control integration.
- Go-live planning and cutover.
- Post-deployment verification.
- Rollback or forward-recovery procedures.
- Production operational handoff.

The exact scope and exit criteria are authoritative in `docs/cloud/milestones/C-M04-PRODUCTION/MILESTONE.md`.

### 7.3 Backend dependencies

C-M04 PRODUCTION supports production deployment and operation of:

- B-M01 CONTROL PLANE (P3).
- B-M02 ARTIFACT (P2-P3).
- B-M03 PLATFORM (P3).
- B-M04 BOOKING (P4).
- B-M05 EXECUTION (P5).
- B-M06 RESULTS (P6-P7).
- B-M07 PRODUCTION (P8).

These dependencies do not transfer backend service ownership to the cloud domain.

Cloud provides the production runtime, network paths, identity integration, secret delivery, infrastructure observability, and operational mechanisms. Backend owners remain responsible for API contracts, business behavior, service lifecycle, and application-level correctness.

### 7.4 Database dependencies

C-M04 PRODUCTION supports production data infrastructure and recovery integration for:

- DB-M01 FOUNDATION (P0-P3).
- DB-M02 CORE DATA (P3).
- DB-M03 BOOKING DATA (P4).
- DB-M04 EXECUTION DATA (P5-P7).

Database owners remain responsible for schema correctness, migration semantics, RLS, transaction guarantees, and data validation after restoration.

Cloud owns infrastructure configuration, availability integration, backup orchestration, and the cloud-level recovery mechanisms required by the approved architecture.

### 7.5 Frontend dependencies

C-M04 PRODUCTION supports production hosting and delivery for:

- F-M01 STUDIO FOUNDATION (P0-P1).
- F-M02 PROJECTS (P1).
- F-M03 BUILD & ARTIFACT (P2).
- F-M04 BOOKING (P4).
- F-M05 EXECUTION (P5).
- F-M06 LIVE (P7).
- F-M07 RESULTS (P7).

Frontend owners remain responsible for user-facing behavior, feature acceptance, and client correctness.

### 7.6 High availability and disaster recovery

Production HA and DR must be designed around approved service requirements and validated through relevant exercises.

The milestone must identify:

- Critical infrastructure components.
- Failure scenarios and failover behavior.
- Capacity under degraded conditions.
- Backup scope and retention.
- Restore sequence and data validation.
- Recovery environment and required access.
- RTO and RPO targets approved by the relevant owners.
- Measured recovery results.
- Unresolved recovery gaps and their dispositions.

Configured redundancy alone is not evidence of HA. Successful backup execution alone is not evidence of recoverability.

### 7.7 Go-live readiness

Go-live readiness must consider infrastructure, application, database, security, operational, business, and relevant safety requirements.

The cloud milestone provides production readiness evidence and executes the approved infrastructure cutover.

It does not independently authorize product launch or physical robot operation.

### 7.8 Exit expectation

The milestone is ready for acceptance when the production environment is reproducible, access-controlled, appropriately resilient, recoverable to the approved scope, observable, and operationally owned.

Go-live requires the explicit authorization of the designated authority and completion of the applicable gates.

Detailed evidence and pass/fail conditions belong in the C-M04 milestone acceptance file.

---

## 8. Cross-Domain Dependency Register

### 8.1 Backend dependency register

| Backend milestone | Phase mapping | Cloud milestones affected | Dependency contract |
|---|---|---|---|
| B-M01 CONTROL PLANE (P3) | P3 CONTROL PLANE | C-M02 DEVELOPMENT (P1-P3); C-M03 STAGING (P4-P7); C-M04 PRODUCTION (P8) | Runtime, identity integration, service connectivity, configuration, and observability |
| B-M02 ARTIFACT (P2-P3) | P2 BUILD & ARTIFACT; P3 CONTROL PLANE | C-M02 DEVELOPMENT (P1-P3); C-M03 STAGING (P4-P7); C-M04 PRODUCTION (P8) | Artifact-service runtime, artifact storage or registry connectivity, deployment identity, and traceability |
| B-M03 PLATFORM (P3) | P3 CONTROL PLANE | C-M02 DEVELOPMENT (P1-P3); C-M03 STAGING (P4-P7); C-M04 PRODUCTION (P8) | Platform runtime, resource connectivity, identity integration, and infrastructure observability |
| B-M04 BOOKING (P4) | P4 BOOKING & COMMERCIAL | C-M03 STAGING (P4-P7); C-M04 PRODUCTION (P8) | Runtime, database access, configuration, secrets, health checks, and observability |
| B-M05 EXECUTION (P5) | P5 EXECUTION | C-M03 STAGING (P4-P7); C-M04 PRODUCTION (P8) | Execution runtime, capacity, dependency access, deployment, and operational diagnostics |
| B-M06 RESULTS (P6-P7) | P6 LAB & ROBOT; P7 LIVE & RESULTS | C-M03 STAGING (P4-P7); C-M04 PRODUCTION (P8) | Results runtime, storage connectivity, telemetry paths, and observability |
| B-M07 PRODUCTION (P8) | P8 PRODUCTION | C-M04 PRODUCTION (P8) | Production service runtime, release integration, availability requirements, and operational handoff |

### 8.2 Database dependency register

| Database milestone | Phase mapping | Cloud milestones affected | Dependency contract |
|---|---|---|---|
| DB-M01 FOUNDATION (P0-P3) | P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE | C-M02 DEVELOPMENT (P1-P3); C-M03 STAGING (P4-P7); C-M04 PRODUCTION (P8) | Database infrastructure, identity integration, migration execution support, and recovery conventions |
| DB-M02 CORE DATA (P3) | P3 CONTROL PLANE | C-M02 DEVELOPMENT (P1-P3); C-M03 STAGING (P4-P7); C-M04 PRODUCTION (P8) | Platform and artifact metadata database connectivity, access, backup, and recovery integration |
| DB-M03 BOOKING DATA (P4) | P4 BOOKING & COMMERCIAL | C-M03 STAGING (P4-P7); C-M04 PRODUCTION (P8) | Booking data-store connectivity, capacity, backup, and recovery integration |
| DB-M04 EXECUTION DATA (P5-P7) | P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS | C-M03 STAGING (P4-P7); C-M04 PRODUCTION (P8) | Execution, run, telemetry/log metadata, and results persistence infrastructure and recovery integration |

### 8.3 Dependency acceptance

Each backend or database dependency is accepted for a cloud milestone when:

- The authoritative owner is identified.
- The required service or data interface is documented.
- Environment-specific configuration is defined.
- Network and identity requirements are agreed.
- Required health and readiness signals are available.
- Capacity and failure assumptions are documented where material.
- Relevant backup and recovery expectations are understood.
- Required integration evidence is available.
- Known gaps are classified and dispositioned.

Cloud must not claim a backend or database milestone is complete merely because its infrastructure dependency is available.

### 8.4 Dependency escalation

A dependency gap must be escalated to the authoritative owner when it affects a milestone gate, changes an approved architecture assumption, or introduces material security, availability, data-protection, or recovery risk.

The consuming cloud milestone must record the impact and the required-by point. It must not silently absorb unresolved service or data responsibilities.

---

## 9. Roadmap Risks

### 9.1 Foundation inconsistency

**Risk:** Cloud milestones create divergent account, identity, network, or infrastructure conventions.

**Impact:** Rework, inconsistent security, and difficult environment promotion.

**Mitigation:** Establish and reuse C-M01 FOUNDATION (P0) conventions. Review material deviations before they propagate.

### 9.2 Unstable service contracts

**Risk:** Cloud implementation commits to runtime or network assumptions before backend or database interfaces are stable.

**Impact:** Rework across development, staging, and production.

**Mitigation:** Record the contract owner, classify provisional assumptions, and require review before they become permanent infrastructure dependencies.

### 9.3 Development patterns do not scale to staging

**Risk:** Development infrastructure lacks integration, isolation, or operational capabilities required by staging.

**Impact:** C-M03 STAGING (P4-P7) requires extensive redesign.

**Mitigation:** Identify staging needs during C-M02 DEVELOPMENT (P1-P3) and retain reusable provisioning patterns without prematurely claiming production readiness.

### 9.4 Staging parity is overstated

**Risk:** Staging is treated as equivalent to production despite differences in identity, network, capacity, availability, or recovery.

**Impact:** Production-only failures remain undiscovered.

**Mitigation:** Maintain an explicit parity assessment, identify limitations, and require production-specific validation where staging cannot represent a required property.

### 9.5 Backend dependency delays

**Risk:** B-M01 CONTROL PLANE (P3), B-M02 ARTIFACT (P2-P3), B-M03 PLATFORM (P3), B-M04 BOOKING (P4), B-M05 EXECUTION (P5), B-M06 RESULTS (P6-P7), or B-M07 PRODUCTION (P8) does not provide a required runtime or interface contract on time.

**Impact:** Cloud deployment or integration work is blocked.

**Mitigation:** Record dependency owners and required-by milestones. Prepare independent infrastructure work where safe, and avoid inventing service behavior to bypass a missing contract.

### 9.6 Database dependency delays

**Risk:** DB-M01 FOUNDATION (P0-P3), DB-M02 CORE DATA (P3), DB-M03 BOOKING DATA (P4), or DB-M04 EXECUTION DATA (P5-P7) does not provide required schema, migration, connectivity, or recovery assumptions.

**Impact:** Integration and production-readiness evidence is incomplete.

**Mitigation:** Track database dependencies explicitly and require database-owner review for migration, data-integrity, and restore semantics.

### 9.7 Environment isolation is inadequate

**Risk:** Development or staging identities can mutate production, or production credentials are reused across environments.

**Impact:** Unauthorized changes, exposure, or production data loss.

**Mitigation:** Separate production identities, secrets, permissions, and network boundaries. Validate effective permissions rather than relying on naming conventions alone.

### 9.8 Infrastructure is not reproducible

**Risk:** Environments depend on undocumented manual operations.

**Impact:** Recovery, scaling, and consistent deployment become unreliable.

**Mitigation:** Use reviewed infrastructure definitions, record revisions, and reconcile emergency changes into the authoritative configuration.

### 9.9 Deployment traceability is incomplete

**Risk:** The deployed artifact or configuration revision cannot be identified reliably.

**Impact:** Incident diagnosis, rollback, and release accountability are impaired.

**Mitigation:** Record immutable artifact identity where supported, source revision, infrastructure revision, configuration revision, and deployment outcome.

### 9.10 Availability claims are unverified

**Risk:** Redundant resources are assumed to provide HA without testing failure behavior.

**Impact:** Production interruption exceeds expectations.

**Mitigation:** Define failure scenarios and validate the relevant failover mechanisms before relying on them for required production objectives.

### 9.11 Recovery objectives are not achievable

**Risk:** Approved RTO or RPO targets exceed what the architecture and recovery process can deliver.

**Impact:** Recovery commitments cannot be met.

**Mitigation:** Obtain owner-approved objectives, execute recovery exercises, measure actual outcomes, and disposition gaps before accepting the affected production scope.

### 9.12 Backup coverage is incomplete

**Risk:** Critical data or configuration is not protected by the declared backup process.

**Impact:** Incomplete restoration or irreversible loss.

**Mitigation:** Identify protected resources and data classes, monitor backup outcomes, and validate restoration with the relevant data owners.

### 9.13 Production capacity is underestimated

**Risk:** Capacity and quotas are insufficient for peak load, failover, or recovery.

**Impact:** Saturation, failed deployment, or inability to restore service.

**Mitigation:** Document workload assumptions, monitor quota usage, validate relevant load conditions, and include failover and recovery headroom.

### 9.14 Observability is incomplete

**Risk:** Critical infrastructure failures are not detected or do not reach an accountable operator.

**Impact:** Incidents persist without timely response.

**Mitigation:** Map critical components to signals and actionable alerts, test alert delivery, and assign owners and escalation paths.

### 9.15 Infrastructure security is inconsistent

**Risk:** Production controls do not align with the approved security architecture.

**Impact:** Unauthorized access, data exposure, or elevated compromise impact.

**Mitigation:** Review network exposure, identities, secrets, TLS, runtime permissions, storage access, deployment identities, and backup protection.

### 9.16 Production activation occurs prematurely

**Risk:** Go-live proceeds before required application, data, security, operational, business, or safety gates are satisfied.

**Impact:** Unacceptable operational or business risk.

**Mitigation:** Keep infrastructure readiness separate from go-live authorization. Record required approvals and block cutover when a required gate is missing.

### 9.17 Cloud scope absorbs application responsibilities

**Risk:** Cloud tasks begin implementing backend behavior, database semantics, or application policy to work around missing ownership.

**Impact:** Duplicate logic, conflicting contracts, and difficult maintenance.

**Mitigation:** Refer unresolved behavior to the authoritative domain. Keep cloud ownership focused on infrastructure, deployment integration, availability, recovery, and operational controls.

### 9.18 Roadmap status is confused with milestone acceptance

**Risk:** A roadmap percentage or summary status is treated as proof that the milestone's acceptance criteria pass.

**Impact:** Required evidence or blocking gaps are overlooked.

**Mitigation:** Use milestone dossiers and their acceptance files as the source of truth. Treat roadmap status as a summary of evidenced milestone progress.

### 9.19 Cloud-provider assumptions are undocumented

**Risk:** A selected provider's quota, managed-service behavior, region support, or failover limitation is assumed rather than verified.

**Impact:** Architecture or recovery objectives become infeasible.

**Mitigation:** Record provider-specific constraints, validate required capabilities, and raise material limitations through the architecture and decision process.

### 9.20 Operational ownership is unclear

**Risk:** Infrastructure changes, alert response, recovery, or access review lack accountable owners.

**Impact:** Incidents and maintenance are delayed.

**Mitigation:** Assign operational ownership and escalation paths before the relevant milestone is accepted.

### 9.21 Cross-domain readiness is inferred

**Risk:** Available infrastructure is interpreted as evidence that backend services, database semantics, or frontend workflows are complete.

**Impact:** Integration failures or data defects are discovered too late.

**Mitigation:** Require evidence from each authoritative domain and record dependency status separately from cloud infrastructure status.

### 9.22 Risk acceptance is implicit

**Risk:** A known production limitation remains unresolved without an authorized decision.

**Impact:** Go-live proceeds with an unowned risk.

**Mitigation:** Record the limitation, impact, owner, mitigation, and explicit disposition. Required production invariants cannot be waived by a cloud status update alone.

---

## 10. Roadmap Tracking and Completion

### 10.1 Tracking model

Track each cloud milestone using its authoritative dossier and sibling planning files.

The roadmap should summarize, not replace, milestone evidence.

For each cloud milestone, track:

- Milestone status.
- Entry conditions.
- Required dependency milestones.
- Blocking dependencies.
- Deliverable readiness.
- Acceptance evidence.
- Open risks.
- Handoff readiness.
- Exit decision.
- Follow-up ownership.

Task-level status and detailed acceptance evidence belong in the corresponding milestone files.

### 10.2 Recommended status definitions

| Status | Meaning |
|---|---|
| NOT STARTED | No implementation work has been accepted for the milestone |
| PLANNED | Scope and dependencies are identified, but implementation has not been accepted |
| IN PROGRESS | Work is underway and required evidence is incomplete |
| BLOCKED | A material dependency or unresolved issue prevents required progress |
| READY FOR REVIEW | Required implementation evidence is assembled for review |
| ACCEPTED | The milestone's authoritative acceptance conditions are met and recorded |
| COMPLETE | Required milestone outputs and handoff are accepted; remaining non-blocking follow-up is recorded |
| DEFERRED | Authorized decision postpones the milestone or a defined portion of scope |

These labels summarize progress; they do not override the acceptance requirements in the milestone dossier.

### 10.3 Milestone readiness summary

| Cloud milestone | Required readiness evidence | Handoff |
|---|---|---|
| C-M01 FOUNDATION (P0) | Reproducible foundation, documented conventions, access controls, and usable infrastructure primitives | Shared cloud foundation |
| C-M02 DEVELOPMENT (P1-P3) | Repeatable development provisioning, deployment integration, service connectivity, and diagnostics | Development patterns and environment |
| C-M03 STAGING (P4-P7) | Integrated deployment, required diagnostics, parity assessment, and dispositioned environment gaps | Staging evidence and parity findings |
| C-M04 PRODUCTION (P8) | Production security, deployment traceability, HA/DR evidence, operations readiness, and authorized go-live decision | Production operations and handoff |

### 10.4 Cross-domain acceptance

A cloud milestone that depends on backend or database work must identify whether the dependency is:

- Accepted by the authoritative owner.
- Available with explicit limitations.
- Still in progress.
- Blocking.
- Not applicable to the accepted scope.

The roadmap must not claim acceptance of a backend or database milestone on behalf of its owner.

### 10.5 Exit and deferral

A cloud milestone may exit when its authoritative exit criteria are satisfied and the required handoff is accepted.

A deferral must identify:

- The deferred scope.
- The reason.
- The affected downstream milestones.
- The residual risk.
- The decision owner.
- The condition for resuming work.
- Any effect on production readiness or go-live.

A deferral must not silently remove a required security, availability, recovery, or safety gate.

### 10.6 Roadmap review cadence

Review the roadmap when:

- A cloud milestone is accepted.
- A material backend or database dependency changes.
- The system cloud architecture changes.
- A staging parity gap affects production assumptions.
- An HA or DR exercise reveals a material limitation.
- Production capacity or provider constraints change.
- A security finding affects cloud infrastructure.
- A go-live decision changes.
- A milestone is blocked, deferred, or re-scoped.

Review should update dependency status and risk disposition without copying implementation details from the authoritative documents.

### 10.7 Roadmap completion criteria

The cloud roadmap is complete when:

- C-M01 FOUNDATION (P0) has been accepted.
- C-M02 DEVELOPMENT (P1-P3) has been accepted.
- C-M03 STAGING (P4-P7) has been accepted.
- C-M04 PRODUCTION (P8) has been accepted.
- Required cross-domain dependencies have explicit status and ownership.
- Staging parity findings relevant to production have been dispositioned.
- Production security and operational controls have been verified.
- Required HA and DR evidence meets approved objectives or gaps have authorized dispositions.
- Production deployment and rollback or forward-recovery procedures are documented and validated.
- The designated authority has explicitly authorized go-live where go-live is in scope.
- Operational handoff is accepted.
- Remaining non-blocking risks have owners and documented dispositions.

Roadmap completion does not independently establish application correctness, contractual service-level compliance, regulatory compliance, or physical robot safety. Those outcomes remain with their respective authoritative owners and require their own evidence and approvals.

---

## References and Related Documents

- `planning/PHASES.md` — canonical phase definitions.
- `planning/DECISIONS.md` — system-level planning decisions.
- `docs/architecture/CLOUD_ARCHITECTURE.md` — system cloud topology.
- `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` — cloud implementation architecture.
- `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` — cloud infrastructure security architecture.
- `docs/cloud/milestones/C-M01-FOUNDATION/MILESTONE.md` — C-M01 FOUNDATION (P0) scope.
- `docs/cloud/milestones/C-M02-DEVELOPMENT/MILESTONE.md` — C-M02 DEVELOPMENT (P1-P3) scope.
- `docs/cloud/milestones/C-M03-STAGING/MILESTONE.md` — C-M03 STAGING (P4-P7) scope.
- `docs/cloud/milestones/C-M04-PRODUCTION/MILESTONE.md` — C-M04 PRODUCTION (P8) scope.
- `docs/development/TESTING_STRATEGY.md` — global testing strategy.
- `docs/development/RELEASE_PROCESS.md` — global release process.

Backend and database milestone dossiers under `docs/backend/milestones/` and `docs/database/milestones/` remain authoritative for their respective contracts and acceptance conditions.
