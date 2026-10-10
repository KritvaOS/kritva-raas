# P0 FOUNDATION — Milestone Dossier

**Primary Phase:** P0 FOUNDATION  
**Supporting Phases:** P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE; P4 BOOKING & COMMERCIAL; P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS; P8 PRODUCTION  
**Document Type:** Phase milestone dossier  
**Document Path:** `docs/milestones/PHASE-0-FOUNDATION/MILESTONE.md`  
**Status:** Planning baseline  
**Scope Focus:** Monorepo structure, cross-domain contracts, engineering conventions, continuous integration foundations, and skeleton applications.

## Ownership and Boundaries

This document defines the objective, scope, dependencies, deliverables, risks, and exit criteria for **P0 FOUNDATION**. It establishes the foundation expected from the phase without duplicating task-level implementation instructions or acceptance records.

The following sibling files are authoritative for their respective purposes:

- `TASKS.md` — the P0 task inventory, task identifiers, implementation order, and task ownership.
- `ACCEPTANCE_CRITERIA.md` — the acceptance criteria applicable to this phase.
- `REVIEW_CHECKLIST.md` — the review checks used to assess implementation quality and completeness.
- `CHANGELOG.md` — the recorded changes associated with this phase.
- `GIT_COMMIT_STEP.md` — the prescribed commit, verification, and repository-recording steps.

This document MUST link to these files rather than reproduce their contents.

Other documentation owns the following concerns:

| Concern | Authoritative owner |
|---|---|
| Canonical phase definitions and cross-phase sequencing | `docs/planning/PHASES.md` |
| Cross-project decisions and system-level architecture | `docs/planning/DECISIONS.md` and applicable documents under `docs/architecture/` |
| Domain-specific milestone scope and acceptance | Authoritative dossiers under `docs/**/milestones/` |
| Frontend implementation architecture | Applicable documents under `docs/frontend/architecture/` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| API and event wire contracts | Applicable documents under `docs/protocol/` |
| Database architecture and migration design | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Cloud architecture and deployment topology | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Application and trust-boundary security | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Global development workflow | Applicable documents under `docs/development/` |
| Global development setup | `docs/development/DEVELOPMENT_SETUP.md` |
| Global testing strategy | `docs/development/TESTING_STRATEGY.md` |
| Global release process | `docs/development/RELEASE_PROCESS.md` |
| Domain-specific development and testing procedures | Applicable documents under `docs/frontend/development/`, `docs/backend/development/`, `docs/database/development/`, and `docs/cloud/` |

The authoritative owner of a topic defines its detailed policy and implementation requirements. This dossier records only the P0 foundation outcomes and their dependencies.

---

# 1. Objective

## 1.1 Primary Objective

P0 FOUNDATION establishes the repository, engineering, contract, automation, and application-skeleton foundations needed for Kritva RaaS to evolve through the canonical phase sequence without repeatedly restructuring its engineering environment.

The phase MUST establish a coherent starting point for parallel work across frontend, backend, database, and cloud domains.

The result is a verifiable foundation that allows teams to add domain capabilities through explicit interfaces, repeatable builds, automated checks, and consistent engineering practices.

P0 FOUNDATION is not intended to deliver the complete product or implement all domain functionality. It establishes the shared structures and minimum working skeletons required for later phases.

## 1.2 Outcomes

P0 FOUNDATION aims to produce the following outcomes:

1. A clearly organized monorepo with identifiable ownership boundaries.
2. A documented and consistently applied directory and naming convention.
3. Initial cross-domain contracts that prevent teams from inventing incompatible interfaces independently.
4. A repeatable local development foundation.
5. A working continuous integration path for the supported repository components.
6. Skeleton applications and services that can be built and validated.
7. Initial automated tests and validation hooks.
8. A traceable relationship between source changes, automated checks, review evidence, and commits.
9. A documented dependency model for subsequent phases.
10. A foundation that can be extended without requiring every domain to redesign its repository structure.

## 1.3 Engineering Principles

P0 FOUNDATION MUST establish the following principles.

### 1.3.1 Explicit Ownership

Every maintained component MUST have an identifiable location and responsible domain.

A directory name alone does not grant unrestricted ownership of adjacent components or contracts.

Cross-domain changes MUST identify the affected owners and relevant interfaces.

### 1.3.2 Contract Before Integration

Shared interfaces SHOULD be defined before dependent implementations independently establish incompatible assumptions.

Contract definitions MUST identify their intended consumers, compatibility expectations, and validation approach.

Detailed contract content belongs to the appropriate protocol or architecture document.

### 1.3.3 Reproducibility

A contributor SHOULD be able to reproduce the supported development and validation workflow by following the repository's documented instructions.

Build and test results MUST identify the source state against which they were produced when that evidence is used for acceptance.

### 1.3.4 Automated Validation

The repository MUST provide an automated path for detecting relevant errors before changes are accepted.

Checks SHOULD be repeatable and suitable for execution in the project's supported CI environment.

### 1.3.5 Incremental Evolution

Skeleton components MUST be sufficient to validate the development path without pretending that unimplemented product capabilities already exist.

New capabilities SHOULD be added through controlled, reviewable changes rather than untracked structural changes.

### 1.3.6 Honest Readiness

A repository, application, service, or contract MUST NOT be described as production-ready merely because its initial skeleton builds.

P0 completion demonstrates foundation readiness only.

## 1.4 Relationship to the Product Roadmap

P0 FOUNDATION supplies shared engineering foundations used by all subsequent canonical phases.

It does not absorb the scope of those phases.

| Phase | Canonical name | Relationship to P0 FOUNDATION |
|---|---|---|
| P0 | FOUNDATION | Establishes repository, contracts, CI, conventions, and skeleton applications |
| P1 | STUDIO | Builds on the foundation for Studio capabilities |
| P2 | BUILD & ARTIFACT | Uses shared conventions and contracts for build and artifact capabilities |
| P3 | CONTROL PLANE | Uses the foundation for control-plane services and integration |
| P4 | BOOKING & COMMERCIAL | Uses established contracts and CI for booking and commercial workflows |
| P5 | EXECUTION | Uses the foundation for execution-related integration |
| P6 | LAB & ROBOT | Uses shared interfaces and validation practices for lab and robot integration |
| P7 | LIVE & RESULTS | Uses established interfaces and CI for live operations and results |
| P8 | PRODUCTION | Builds on the foundation for production deployment and operation |

The table describes dependency relationships, not the detailed scope or completion criteria of the referenced phases.

---

# 2. Scope and Non-Scope

## 2.1 In Scope

P0 FOUNDATION covers the initial shared structures and minimum viable engineering mechanisms required to support subsequent implementation.

The scope includes:

- Monorepo organization.
- Repository ownership boundaries.
- Directory and file naming conventions.
- Baseline source-control conventions.
- Cross-domain contract organization.
- Contract versioning and validation foundations.
- Skeleton frontend application.
- Skeleton backend application and service.
- Initial database integration foundation.
- Initial cloud and deployment configuration structure.
- Shared configuration conventions.
- Automated CI workflows.
- Build and test entry points.
- Baseline linting and formatting integration where applicable.
- Minimal automated smoke tests.
- Development and validation documentation references.
- Initial dependency and integration mapping.
- Repository-level traceability for implementation and review.

The exact tasks, ownership assignments, and acceptance checks are maintained in the sibling files linked in the header and Ownership and Boundaries section.

## 2.2 Monorepo Foundation

The monorepo MUST provide a predictable location for the principal implementation domains and shared engineering resources.

The organization SHOULD make it straightforward to locate:

- Frontend source and frontend-specific documentation.
- Backend source and backend-specific documentation.
- Database definitions, migrations, and database documentation.
- Cloud infrastructure definitions and cloud documentation.
- Shared protocol and contract definitions.
- Global architecture and planning documentation.
- Build, test, and CI configuration.
- Examples, fixtures, and other maintained engineering resources.

The exact directory structure MUST follow the repository's approved layout and current implementation.

This phase MUST avoid creating multiple competing authoritative copies of the same contract, architecture decision, or global policy.

## 2.3 Repository Boundaries

The repository SHOULD distinguish between:

1. Shared policy and architecture.
2. Domain implementation.
3. Cross-domain interfaces.
4. Build and validation infrastructure.
5. Phase and milestone planning.
6. Generated outputs and temporary artifacts.

Each maintained component MUST have a clear authoritative location.

Generated outputs MUST NOT be treated as source-of-truth files unless the repository explicitly defines them as maintained deliverables.

Temporary build products, local credentials, caches, and unrelated local state MUST NOT be committed as ordinary source artifacts.

## 2.4 Cross-Domain Contracts

P0 FOUNDATION establishes the initial organization and validation approach for cross-domain contracts.

The initial contract inventory SHOULD identify applicable interfaces between:

- Frontend and backend.
- Backend and database.
- Backend and asynchronous processing.
- Backend and object storage.
- Backend and cloud-managed dependencies.
- Backend and external or simulated execution agents.
- Shared services and their consumers.

Only interfaces required to establish the foundation need to be defined at this stage.

The existence of an inventory MUST NOT be interpreted as evidence that every future interface is fully specified.

## 2.5 Contract Organization

Contracts MUST have a clearly identifiable authoritative location.

A contract SHOULD describe, as applicable:

- Its purpose.
- Its producer and consumers.
- Request and response structures.
- Field types and constraints.
- Error behavior.
- Compatibility expectations.
- Versioning rules.
- Validation mechanisms.
- Security-relevant assumptions.

Detailed API, event, artifact, and other protocol definitions belong to their respective documents under `docs/protocol/`.

This dossier establishes the requirement for an organized and reviewable contract foundation; it does not duplicate individual wire schemas.

## 2.6 Contract Validation

Where practical, the repository SHOULD provide automated checks that validate contract syntax and detect inconsistent or invalid definitions.

If code or test fixtures are generated from a contract, the generation workflow SHOULD be reproducible and SHOULD make the authoritative source explicit.

Generated code MUST NOT silently become a competing authority for the contract.

The phase SHOULD establish a clear method for identifying which checks validate source contracts and which validate implementations against them.

## 2.7 Engineering Conventions

P0 FOUNDATION establishes a minimum consistent approach to:

- File and directory naming.
- Source formatting.
- Error handling conventions appropriate to each domain.
- Configuration ownership.
- Logging and diagnostic conventions.
- Test organization.
- Documentation organization.
- Code review expectations.
- Commit traceability.
- Cross-domain change notification.

Domain-specific details remain owned by the relevant implementation and development documentation.

A global convention SHOULD be adopted only when it genuinely applies across domains. Domain-specific differences MUST remain explicit where they are justified by the technology or runtime.

## 2.8 Configuration Foundation

The repository MUST establish a clear separation between source-controlled configuration templates and environment-specific values.

The foundation SHOULD distinguish:

- Safe default configuration.
- Local development configuration.
- CI configuration.
- Environment-specific deployment configuration.
- Sensitive credentials and secrets.

Credentials and secrets MUST NOT be committed to the repository.

The exact secret-management mechanism, cloud configuration, and runtime configuration behavior are owned by the relevant architecture and security documentation.

## 2.9 Skeleton Frontend Application

The frontend skeleton MUST establish a minimal, buildable application structure.

Depending on the selected frontend architecture, the skeleton SHOULD demonstrate:

- Application entry point.
- Basic routing or navigation structure, where applicable.
- Shared configuration loading.
- A minimal application shell.
- A clear boundary between UI and backend communication.
- A basic test entry point.
- A repeatable build command.
- A repeatable local development command.

The skeleton is not expected to provide the complete Studio experience or implement later-phase product workflows.

Detailed frontend design, state management, component architecture, and user interaction requirements belong to the frontend-owned documentation.

## 2.10 Skeleton Backend Application

The backend skeleton MUST establish a minimal, buildable and testable service structure.

It SHOULD demonstrate:

- Application entry point.
- Configuration loading.
- A minimal service startup path.
- A health or readiness mechanism appropriate to the service.
- Structured error handling at the relevant boundary.
- Logging sufficient for local diagnosis.
- A clear boundary between transport handling and application logic.
- A test entry point.
- A repeatable build and startup path.

The skeleton MUST NOT claim that future business operations, security controls, or asynchronous workflows are implemented unless they actually exist.

Detailed service layering, API implementation, background processing, and runtime behavior belong to the backend architecture and implementation documentation.

## 2.11 Database Integration Foundation

P0 FOUNDATION SHOULD establish the minimum structure needed to validate backend-to-database integration.

This may include:

- A documented database dependency.
- Development configuration.
- A connectivity check.
- A migration framework or approved migration entry point.
- A repeatable database test setup.
- A clear location for schema and migration definitions.

The phase does not require the full product data model or every future database migration.

Schema ownership, data modeling, migration design, transaction policy, indexing, backup, and recovery remain owned by the database domain.

## 2.12 Cloud and Deployment Configuration Foundation

P0 FOUNDATION SHOULD establish the repository organization needed to maintain deployment-related configuration.

Where applicable, this includes:

- A clearly identifiable location for infrastructure definitions.
- Environment configuration templates.
- A separation between application configuration and infrastructure configuration.
- A basic validation path for infrastructure changes.
- A documented relationship between application components and their deployment configuration.

This phase does not require a complete production environment or full operational deployment.

Cloud architecture, provider-specific resource design, networking, identity, and deployment topology remain owned by the cloud domain.

## 2.13 Continuous Integration Foundation

The repository MUST provide an automated validation path for the maintained components included in P0 scope.

The initial CI foundation SHOULD:

- Trigger for relevant source changes.
- Install or resolve required dependencies through the approved mechanism.
- Validate formatting or linting where configured.
- Build applicable skeleton applications.
- Run available automated tests.
- Validate contract definitions where supported.
- Report failures clearly.
- Make the result available to reviewers.
- Fail visibly when required checks fail.

The workflow SHOULD avoid passing silently when an expected validation step has not executed.

Exact branch protections, approval rules, release triggers, and organization-wide CI policy belong to the global development workflow and release documentation.

## 2.14 CI Scope and Reliability

The initial CI pipeline MUST be proportionate to the foundation scope.

It SHOULD distinguish required checks from optional or informational checks.

A check MUST have a clear purpose and an identifiable failure signal.

External dependencies SHOULD be controlled where practical so that transient infrastructure failures can be distinguished from genuine source failures.

If a required check is unavailable, the failure or exception MUST be visible rather than silently treated as a pass.

## 2.15 Build and Test Entry Points

P0 FOUNDATION SHOULD establish predictable entry points for common repository operations.

Examples include:

- Building a supported skeleton application.
- Running the applicable unit or smoke tests.
- Validating contract definitions.
- Checking formatting or lint rules.
- Running CI-equivalent local validation.

The actual command names MUST be documented in the repository's authoritative development instructions.

This dossier does not prescribe command names that may not exist in the repository.

## 2.16 Initial Automated Tests

The foundation MUST include enough automated validation to prove that the initial repository and skeleton applications are not merely empty directory structures.

Depending on the implemented components, the initial checks SHOULD cover:

- Successful configuration loading.
- Successful application initialization.
- Basic health or readiness behavior.
- Contract syntax or schema validation.
- Basic frontend application rendering or startup.
- Backend startup and shutdown behavior.
- Database connectivity where database integration is included.
- CI execution of the configured tests.

Tests MUST verify real behavior rather than only confirm that files or directories exist.

The complete testing strategy and domain-specific test suites are owned by their authoritative testing documents.

## 2.17 Documentation Discoverability

The repository MUST make its foundational documentation discoverable.

A contributor SHOULD be able to identify:

- Where to begin.
- Which domain owns a component.
- Where contracts are defined.
- How to build and test a skeleton application.
- Where global conventions are documented.
- Where domain-specific instructions are maintained.
- Which milestone and task files govern the work.

Documentation MUST link to authoritative sources rather than copy large sections of their content.

## 2.18 Traceability and Reviewability

P0 FOUNDATION SHOULD establish a practical relationship between implementation work and review evidence.

Changes SHOULD be traceable to their tasks, relevant acceptance criteria, and review outcomes.

Repository changes SHOULD be small enough to review coherently and SHOULD identify cross-domain effects.

The detailed task inventory, acceptance requirements, review checks, change records, and commit procedure are maintained in the sibling files.

## 2.19 Explicit Non-Scope

The following are outside the direct scope of P0 FOUNDATION:

- Complete Studio functionality.
- Full project management workflows.
- Production build orchestration and artifact lifecycle.
- Complete control-plane services.
- Booking, billing, payments, and commercial workflows.
- Full execution orchestration.
- Lab and physical robot integration.
- Live operational dashboards and complete results workflows.
- Full production deployment and operational readiness.
- Complete domain data models.
- Complete production security implementation.
- Full-scale performance optimization.
- Comprehensive disaster recovery implementation.
- Full product acceptance and launch approval.

These concerns belong to their applicable canonical phases, domain documents, and authoritative milestone dossiers.

P0 MAY define the structural interfaces and engineering mechanisms needed to support later work, but MUST NOT claim the later capabilities are complete.

## 2.20 Scope Change Control

Any proposed addition to P0 scope SHOULD explain:

1. Why the capability is necessary to establish the foundation.
2. Which P0 outcome it supports.
3. Which domain owns its implementation.
4. Whether an existing authoritative document already covers the requirement.
5. Whether the change creates a dependency on later work.
6. Whether it delays the foundation without materially improving readiness.

Scope changes MUST be reflected in the authoritative task and acceptance files.

This dossier SHOULD be updated only when the objective, boundaries, dependencies, deliverables, risks, or exit criteria change materially.

---

# 3. Dependencies

## 3.1 Dependency Principles

P0 FOUNDATION depends on the availability of an agreed repository direction, identifiable technical ownership, and a consistent approach to documenting shared interfaces.

Dependencies MUST be made explicit so that foundational work does not silently depend on unapproved implementation choices.

The dependency list describes prerequisites and coordination requirements. It does not replace the task-level dependency graph in `TASKS.md`.

## 3.2 Product and Repository Direction

The project MUST have a sufficiently clear product and repository direction to determine:

- The principal implementation domains.
- The intended repository organization.
- The initial application and service boundaries.
- The contract categories needed for early integration.
- The supported development and CI environments.

The foundation SHOULD avoid locking in detailed product behavior that has not yet been specified.

## 3.3 Canonical Phase Definitions

`docs/planning/PHASES.md` is the authoritative source for canonical phase definitions.

P0 FOUNDATION MUST align its scope with the frozen phase model.

The foundation MUST NOT create alternate phase names or independently redefine cross-phase responsibilities.

## 3.4 Global Architecture and Decisions

The applicable documents under `docs/architecture/` and `docs/planning/DECISIONS.md` provide the system-level context required to organize the repository and shared interfaces.

P0 MUST identify unresolved decisions that materially block foundational implementation.

It MUST NOT turn an unresolved assumption into a permanent architectural constraint without the appropriate decision process.

## 3.5 Domain Ownership

The frontend, backend, database, and cloud domains MUST identify the owners responsible for their initial skeletons and shared interfaces.

Where a shared contract crosses domains, its ownership and review participants MUST be identifiable.

If ownership is unresolved, the issue SHOULD be recorded and assigned through the phase task process rather than resolved by duplicating implementation ownership.

## 3.6 Development Environment

The foundation depends on supported development tools being available to contributors and CI.

These may include:

- Source-control tooling.
- Language runtimes and package managers.
- Build tools.
- Test runners.
- Contract validation tools.
- Container tooling where required.
- Database tooling where required.

Exact installation instructions belong to the global and domain-specific development setup documents.

## 3.7 CI Environment

The CI environment MUST support the initial build and validation operations.

Required secrets, credentials, permissions, dependency access, and runner capabilities MUST be configured through approved mechanisms.

CI MUST NOT depend on a developer's untracked local configuration.

The infrastructure that provides CI runners and related cloud services remains owned by the relevant infrastructure documentation.

## 3.8 Cross-Domain Contract Inputs

The initial contract inventory depends on agreement about the interfaces that must exist for the skeleton components to communicate.

Where detailed contracts are not yet required, P0 SHOULD document the boundary and explicitly identify unresolved contract work.

A placeholder interface MUST NOT be treated as a complete or stable protocol.

## 3.9 Database Availability

If the initial backend skeleton requires database connectivity, a suitable development and test database environment MUST be available.

Database schema design beyond the foundation requirement remains a database-domain responsibility.

The phase MUST distinguish a connectivity check from evidence that the complete data model or production database configuration is ready.

## 3.10 Cloud and Infrastructure Availability

If CI or skeleton validation requires external infrastructure, the necessary resources and permissions MUST be available.

Infrastructure prerequisites SHOULD be minimized so that foundational development does not depend unnecessarily on a complete production deployment.

Cloud provisioning and resource lifecycle procedures remain owned by the cloud domain.

## 3.11 Security Inputs

The foundation depends on agreed minimum practices for handling credentials, environment configuration, repository permissions, and sensitive information.

Security-sensitive assumptions MUST be visible to the relevant security owner.

The full security architecture and control implementation are outside the scope of this dossier.

## 3.12 Testing and Validation Inputs

The project MUST identify the initial checks that demonstrate successful foundation implementation.

Each required check SHOULD have a defined execution mechanism and an observable result.

Global testing policy belongs to `docs/development/TESTING_STRATEGY.md`, with domain-specific implementation in the relevant testing documents.

## 3.13 Documentation Availability

P0 implementation depends on contributors being able to locate the applicable architecture, development, protocol, and milestone documents.

Where an authoritative document is missing, the gap SHOULD be recorded and assigned to its owner.

This dossier MUST NOT silently substitute for a missing domain architecture or implementation specification.

## 3.14 Dependency Matrix

| Dependency | Required contribution | Primary owner |
|---|---|---|
| Canonical phase model | Stable phase definitions and sequencing | Global planning |
| System architecture | Initial component and ownership boundaries | Architecture |
| Repository access | Source control and contributor access | Repository administration |
| Frontend skeleton | Buildable initial UI application | Frontend |
| Backend skeleton | Buildable initial service | Backend |
| Contract inventory | Identified cross-domain interfaces | Relevant contract owners |
| Database foundation | Initial database integration support, if required | Database |
| CI environment | Automated execution of required checks | CI and infrastructure owners |
| Development tooling | Repeatable local build and test environment | Relevant domain owners |
| Security guidance | Minimum secret and configuration handling rules | Security owners |
| Documentation index | Discoverable authoritative instructions | Documentation owners |

## 3.15 Dependency Failure Handling

If a dependency blocks foundational work:

1. Identify the blocked outcome or task.
2. Record the specific missing input or unavailable capability.
3. Identify the authoritative owner.
4. Determine whether a safe, temporary alternative exists.
5. Avoid creating a competing interface or undocumented workaround.
6. Update the task dependency record.
7. Reassess the impact on the P0 exit criteria.

A workaround MUST be explicit about its limitations and MUST NOT be mistaken for the final architecture.

## 3.16 Cross-Phase Handoffs

P0 FOUNDATION provides structures and engineering mechanisms that later phases can extend.

| Phase | Canonical name | Expected foundation handoff |
|---|---|---|
| P1 | STUDIO | Repository conventions, frontend skeleton, shared development and CI practices |
| P2 | BUILD & ARTIFACT | Contract organization, backend and frontend build foundations, automated validation |
| P3 | CONTROL PLANE | Backend skeleton, service boundaries, initial data integration and contract conventions |
| P4 | BOOKING & COMMERCIAL | Shared interfaces, repository practices, and testable application foundations |
| P5 | EXECUTION | Backend integration patterns, CI checks, and cross-domain contract discipline |
| P6 | LAB & ROBOT | Maintainable repository structure, clear interfaces, and repeatable validation |
| P7 | LIVE & RESULTS | Shared contract conventions and reliable build and test practices |
| P8 | PRODUCTION | Traceable source and build artifacts, repeatable validation, and clear ownership |

These handoffs do not assert that the receiving phase is complete or that its milestone acceptance criteria are satisfied.

The authoritative milestone dossiers define the actual scope and required evidence for each phase's work.

---

# 4. Deliverables

## 4.1 Deliverable Principles

P0 deliverables MUST be identifiable, reviewable, and verifiable.

A directory or configuration file existing in the repository is not sufficient evidence of a completed deliverable when the expected behavior has not been validated.

Each deliverable MUST have a clear owner and a verification method recorded through the authoritative task and acceptance files.

The deliverable list defines the intended outcome categories; it does not replace the task-level implementation plan.

## 4.2 Monorepo Structure

The repository MUST have an agreed structure that separates major implementation domains and shared resources.

The structure SHOULD make it possible to locate:

- Frontend source.
- Backend source.
- Database resources.
- Cloud and infrastructure resources.
- Shared contracts.
- Architecture and planning documentation.
- Development and validation tooling.
- Tests and supporting fixtures.

The structure MUST avoid unnecessary duplication of authoritative documents.

**Expected evidence:**

- The repository contains the agreed directory structure.
- Domain ownership is documented.
- Shared resources have identifiable owners.
- Repository entry-point documentation directs contributors to the relevant locations.
- Generated and temporary outputs are handled consistently.

## 4.3 Repository Conventions

A documented baseline MUST establish the conventions necessary for contributors to work consistently.

It SHOULD cover:

- Naming and directory organization.
- Source formatting and linting.
- Configuration and secret handling.
- Test placement.
- Documentation placement.
- Commit traceability.
- Cross-domain change review.

**Expected evidence:**

- The conventions are documented in their authoritative locations.
- Applicable automated checks are configured.
- The conventions do not conflict with domain-specific requirements.
- The contribution path identifies how deviations or changes are reviewed.

## 4.4 Contract Inventory and Organization

The project MUST have an identifiable location and ownership model for shared contracts.

The initial inventory SHOULD identify the principal contract categories required by the skeleton components.

**Expected evidence:**

- Contract categories and authoritative locations are discoverable.
- Producers and consumers are identified where known.
- Contract ownership is clear.
- Unresolved interface questions are visible.
- Contract validation can be executed where applicable.

This deliverable does not require every future API, event, or artifact contract to be fully implemented.

## 4.5 Initial Contract Validation

The foundation SHOULD provide automated validation for contract definitions that have reached the required level of specificity.

**Expected evidence:**

- The validation command or workflow is documented.
- Invalid contract definitions produce a visible failure.
- CI invokes required contract checks.
- Validation output can be associated with the source revision being checked.
- Generated outputs, where used, have an explicit source-of-truth relationship.

Detailed schemas remain in the relevant protocol documents.

## 4.6 Skeleton Frontend Application

A minimal frontend application MUST be present and buildable using the documented workflow.

**Expected evidence:**

- The application entry point is identifiable.
- The basic application shell can initialize.
- Required configuration can be loaded.
- Backend communication has a defined boundary, even if the initial implementation is minimal.
- The build command is documented.
- The configured frontend checks can execute.

The deliverable does not claim that complete product workflows or user experiences are available.

## 4.7 Skeleton Backend Application

A minimal backend application MUST be present and buildable using the documented workflow.

**Expected evidence:**

- The service entry point is identifiable.
- Configuration loading is established.
- Startup and shutdown can be exercised.
- A suitable health or readiness mechanism exists where required.
- Logging supports basic diagnosis.
- The test entry point is available.
- The service can be built and started through documented commands.

The deliverable does not claim that all domain APIs, background jobs, or production security controls are implemented.

## 4.8 Initial Database Integration

Where database connectivity is required by the skeleton backend, the foundation SHOULD provide a repeatable integration path.

**Expected evidence:**

- The database dependency is documented.
- Development configuration is available without committed secrets.
- Connectivity can be checked.
- The approved migration entry point is identifiable where migrations are used.
- Relevant database integration checks can run.
- Database implementation ownership is explicit.

This deliverable does not establish the complete product schema or production data lifecycle.

## 4.9 Initial Infrastructure Organization

The repository SHOULD provide a clear place for infrastructure and deployment-related configuration where these resources are required by the foundation.

**Expected evidence:**

- Infrastructure definitions have an identifiable location.
- Environment-specific configuration is separated from source defaults.
- Infrastructure validation has a documented path where applicable.
- Infrastructure ownership is clear.
- The initial structure does not claim production readiness without evidence.

Detailed infrastructure design and provisioning procedures remain with the cloud domain.

## 4.10 Continuous Integration Pipeline

The repository MUST provide a working CI path for the required P0 checks.

**Expected evidence:**

- Relevant changes trigger the expected workflow.
- Dependencies are installed or resolved using the supported process.
- Applicable skeleton builds execute.
- Required tests execute.
- Contract validation runs where configured.
- Required failures are visible in the workflow result.
- The result is accessible to reviewers.
- CI does not silently skip a required check and report success.

The exact CI implementation may evolve, but required validation MUST remain observable.

## 4.11 Local Validation Workflow

The foundation SHOULD provide a documented way to run the relevant checks locally.

**Expected evidence:**

- Contributors can find the supported commands.
- Required tool versions or prerequisites are documented by the relevant setup documents.
- Local checks correspond meaningfully to CI checks.
- Failures provide sufficient diagnostic information.
- Domain-specific commands remain documented by their owners.

This dossier does not replace global or domain-specific development setup instructions.

## 4.12 Baseline Automated Tests

The initial repository and skeleton components MUST have automated checks appropriate to their implemented behavior.

**Expected evidence:**

- Test entry points exist for the applicable components.
- At least the required startup, initialization, or contract checks are implemented where applicable.
- CI runs the required tests.
- Failures are visible.
- Test results are not represented as passing when tests did not execute.

The complete testing inventory and coverage policy are maintained in the authoritative testing documents.

## 4.13 Configuration and Secret Separation

The foundation MUST demonstrate that non-sensitive defaults and environment-specific secrets are handled separately.

**Expected evidence:**

- Safe configuration templates are identifiable.
- Required environment variables or settings are documented by the relevant owners.
- Credentials are not committed.
- CI and local development use approved mechanisms for sensitive values.
- Configuration errors are observable during initialization or validation.

Detailed security controls remain owned by the security and cloud domains.

## 4.14 Documentation Entry Points

Contributors MUST have a clear route to the documentation needed for foundation work.

**Expected evidence:**

- The repository entry point links to the relevant architecture and development instructions.
- Domain-specific documentation is discoverable.
- Shared contract locations are documented.
- The P0 task and acceptance records are discoverable.
- Links identify authoritative documents rather than duplicate their contents.

## 4.15 Traceable Foundation Changes

The foundation SHOULD provide a consistent way to associate implementation changes with tasks, reviews, and validation results.

**Expected evidence:**

- Changes can be associated with their task identifiers where applicable.
- Review outcomes can be located.
- Commit records follow the repository's agreed procedure.
- Validation evidence identifies the relevant source state.
- Cross-domain changes identify affected owners or contracts.

The exact task list, review checks, changelog entries, and commit instructions belong to the sibling files.

## 4.16 Foundation Integration Demonstration

The initial skeleton components and CI path SHOULD be exercised together to demonstrate that the repository organization works as an engineering system.

The integration demonstration SHOULD validate the applicable build and test path without requiring complete product behavior.

**Expected evidence:**

- The relevant components can be built using the supported workflow.
- The required CI path completes successfully.
- Contract checks execute where applicable.
- Initial integration assumptions are documented.
- Failures can be traced to a component or dependency.
- Unimplemented capabilities remain explicitly identified.

## 4.17 Deliverable Ownership Matrix

| Deliverable | Primary owner | Supporting owners |
|---|---|---|
| Monorepo structure | Repository maintainers | All domain owners |
| Repository conventions | Global engineering owners | Frontend, backend, database, cloud |
| Contract inventory | Relevant contract owners | Frontend and backend |
| Contract validation | Contract and CI owners | Relevant domain owners |
| Skeleton frontend | Frontend | Backend and CI |
| Skeleton backend | Backend | Database and CI |
| Database integration foundation | Database | Backend |
| Infrastructure organization | Cloud | Backend and CI |
| CI pipeline | CI or infrastructure owner | All applicable domains |
| Local validation workflow | Global and domain development owners | All contributors |
| Baseline automated tests | Relevant domain owners | CI |
| Configuration and secret separation | Security and relevant domain owners | Cloud and CI |
| Documentation entry points | Documentation maintainers | All domain owners |
| Foundation change traceability | Repository and engineering owners | All contributors |
| Integration demonstration | Foundation integration owner | Frontend, backend, database, cloud |

The task records MUST identify the actual assigned owners. This matrix defines responsibility categories and does not substitute for named task assignments.

## 4.18 Deliverable Completion Rules

A deliverable MUST NOT be considered complete solely because its files have been committed.

Completion requires the applicable evidence to demonstrate that the deliverable works as intended within P0 scope.

Where a deliverable is intentionally deferred or not applicable, the reason MUST be recorded in the authoritative task and acceptance records.

Any exception MUST preserve the distinction between:

- Completed and verified.
- Implemented but not yet verified.
- Blocked by a dependency.
- Intentionally deferred.
- Not applicable to the selected foundation architecture.

The acceptance and review files determine how these states are evaluated for phase exit.

---

# 9. Risks

## 9.1 Risk Management Principles

P0 FOUNDATION creates shared structures that later work will depend on. An unclear or incorrect foundation can therefore multiply rework across domains.

Risks MUST be recorded with sufficient context to identify their impact, owner, and mitigation.

The risk register in this section identifies the principal risk categories for the phase. Detailed risk assignments, task-level mitigations, and review evidence belong in the authoritative task and review records.

## 9.2 Monorepo Structure Becomes Unclear

**Risk:** Domain source, shared resources, generated outputs, and documentation are organized inconsistently.

**Impact:** Contributors duplicate files, place changes in the wrong location, or introduce accidental ownership overlap.

**Mitigation:**

- Establish a documented repository structure.
- Assign ownership to shared and domain-specific directories.
- Identify authoritative locations for shared contracts.
- Review structural changes for cross-domain effects.
- Keep generated and temporary artifacts distinguishable from maintained source.

**Evidence of mitigation:** The repository layout and ownership conventions are discoverable and consistently applied.

## 9.3 Duplicate Sources of Truth

**Risk:** Multiple documents or files independently define the same contract, policy, or architecture decision.

**Impact:** Different domains implement incompatible assumptions and later integration requires corrective changes.

**Mitigation:**

- Assign one authoritative owner to each shared concern.
- Link to existing authoritative documents.
- Avoid copying full policies into milestone dossiers.
- Identify generated files and their source definitions.
- Review proposed documentation for overlap before adding new content.

**Evidence of mitigation:** Shared concerns have identifiable authoritative locations and references.

## 9.4 Premature Contract Assumptions

**Risk:** Skeleton implementations encode interface details before the relevant contract has been reviewed.

**Impact:** Frontend, backend, and other consumers diverge or require repeated rework.

**Mitigation:**

- Identify required interfaces before implementing dependent behavior.
- Record unresolved contract questions.
- Assign contract ownership.
- Validate contract definitions where practical.
- Avoid treating placeholders as stable interfaces.

**Evidence of mitigation:** Initial interfaces and unresolved questions are visible to affected owners.

## 9.5 CI Does Not Reflect Actual Repository Needs

**Risk:** CI omits required components, fails to run important checks, or reports success despite skipped validation.

**Impact:** Defects are discovered late, and reviewers cannot rely on automated results.

**Mitigation:**

- Identify required P0 checks explicitly.
- Connect each required check to an observable result.
- Verify that relevant changes trigger the intended workflows.
- Make required-check failures visible.
- Review CI behavior against the actual repository structure.

**Evidence of mitigation:** A representative change exercises the expected build and validation path.

## 9.6 Local and CI Environments Diverge

**Risk:** Contributors can build locally but the same source fails in CI, or CI passes only because of undocumented environment state.

**Impact:** Integration becomes unpredictable and failures are difficult to reproduce.

**Mitigation:**

- Document required toolchains and prerequisites.
- Pin or control dependencies where practical.
- Use consistent build and test entry points.
- Keep local secrets and configuration out of tracked source.
- Investigate environment-dependent failures rather than suppressing them.

**Evidence of mitigation:** Required validation can be run through documented local and CI workflows.

## 9.7 Skeleton Applications Create a False Sense of Readiness

**Risk:** Minimal applications are described as complete services or production-ready components.

**Impact:** Later teams rely on missing functionality, security controls, or operational behavior.

**Mitigation:**

- Define the intended behavior of each skeleton.
- Document known limitations.
- Use narrow, meaningful verification.
- Avoid claiming capabilities that have not been implemented.
- Keep later-phase scope with the applicable milestone dossiers.

**Evidence of mitigation:** Skeleton deliverables distinguish demonstrated behavior from future work.

## 9.8 Unclear Cross-Domain Ownership

**Risk:** Shared contracts, configuration, or CI changes have no identifiable owner.

**Impact:** Work stalls, responsibilities overlap, and incompatible changes reach integration.

**Mitigation:**

- Identify the owner for each shared concern.
- Record supporting reviewers for cross-domain changes.
- Escalate unresolved ownership through the task process.
- Keep domain implementation responsibilities explicit.
- Avoid duplicating a component merely to bypass an ownership conflict.

**Evidence of mitigation:** The initial ownership map identifies responsible domains and unresolved assignments.

## 9.9 Configuration and Secret Leakage

**Risk:** Credentials or sensitive values are committed to source, embedded in images, or exposed in CI output.

**Impact:** Unauthorized access, service compromise, and remediation work.

**Mitigation:**

- Separate safe defaults from sensitive values.
- Use approved secret-injection mechanisms.
- Avoid printing sensitive configuration.
- Review repository and CI configuration for accidental exposure.
- Follow applicable security guidance.

**Evidence of mitigation:** Tracked configuration uses safe defaults and no known credentials are committed as part of the foundation.

## 9.10 Hidden Infrastructure Dependencies

**Risk:** Foundational build or validation depends on undocumented external infrastructure or privileged local configuration.

**Impact:** Contributors cannot reproduce the workflow and CI becomes fragile.

**Mitigation:**

- Document required external dependencies.
- Minimize unnecessary infrastructure requirements.
- Validate access and permissions explicitly.
- Provide clear diagnostics for unavailable dependencies.
- Keep infrastructure provisioning owned by the relevant domain.

**Evidence of mitigation:** Required external dependencies and access assumptions are documented.

## 9.11 Insufficient Automated Test Coverage

**Risk:** Skeleton components build but lack checks for initialization, contract validity, or basic integration behavior.

**Impact:** Structural defects remain undetected until later phases.

**Mitigation:**

- Define minimum foundation-level checks.
- Add meaningful smoke tests.
- Run required checks in CI.
- Verify that failures are visible.
- Avoid using file-existence checks as a substitute for behavioral tests.

**Evidence of mitigation:** Required foundation checks execute and report their results.

## 9.12 Documentation Drift

**Risk:** Repository structure, setup instructions, contract references, and CI commands diverge from actual implementation.

**Impact:** Contributors waste time following obsolete instructions and may use unsupported workflows.

**Mitigation:**

- Keep documentation close to the relevant ownership domain.
- Link to authoritative procedures.
- Update references when paths or commands change.
- Validate important commands through CI or review where practical.
- Avoid copying the same instructions into multiple files.

**Evidence of mitigation:** The documented foundation workflow matches the implemented repository.

## 9.13 Uncontrolled Scope Growth

**Risk:** P0 absorbs work intended for later canonical phases.

**Impact:** The foundation is delayed and the distinction between foundational readiness and product functionality becomes unclear.

**Mitigation:**

- Evaluate proposed work against the P0 objective.
- Require explicit justification for new foundational dependencies.
- Keep later-phase capabilities outside P0 unless a specific foundation requirement demands them.
- Record deferred work in the appropriate planning and task documents.
- Use the authoritative phase and milestone definitions to resolve scope questions.

**Evidence of mitigation:** P0 deliverables remain focused on shared engineering foundations and skeleton applications.

## 9.14 Dependency on Unresolved Architecture Decisions

**Risk:** Foundation work proceeds using assumptions that later prove incompatible with the intended architecture.

**Impact:** Repository layout, contracts, or skeleton applications require substantial rework.

**Mitigation:**

- Identify decisions that block foundational work.
- Record assumptions and their owners.
- Resolve material decisions through the global decision process.
- Prefer reversible implementation choices while decisions remain open.
- Avoid embedding speculative future behavior into skeletons.

**Evidence of mitigation:** Blocking decisions are resolved or explicitly represented as dependencies.

## 9.15 Database Integration Misrepresents Readiness

**Risk:** A successful connectivity check is interpreted as evidence that the database schema, migration process, and production data lifecycle are ready.

**Impact:** Later implementation encounters missing schema, unsafe migration assumptions, or data integrity problems.

**Mitigation:**

- Define the limited purpose of the initial database integration.
- Keep schema ownership with the database domain.
- Distinguish connectivity tests from migration and data-integrity validation.
- Document unimplemented database behavior.
- Avoid claiming production readiness from a development-only setup.

**Evidence of mitigation:** The foundation's database scope and limitations are explicit.

## 9.16 Infrastructure Foundations Are Mistaken for Production Deployment

**Risk:** Initial deployment configuration or CI infrastructure is treated as evidence of production operational readiness.

**Impact:** Required security, availability, recovery, or monitoring controls may be absent.

**Mitigation:**

- Keep P0 infrastructure work limited to the agreed foundation.
- Document the environment and capabilities actually validated.
- Leave production deployment requirements with their authoritative owners.
- Avoid claims that exceed available evidence.
- Preserve later-phase infrastructure acceptance requirements.

**Evidence of mitigation:** The documented infrastructure scope distinguishes foundation validation from production readiness.

## 9.17 Integration Failures Are Difficult to Diagnose

**Risk:** Initial components do not expose sufficient logs, error messages, or validation output to identify failures.

**Impact:** Basic integration defects require disproportionate investigation.

**Mitigation:**

- Establish minimum diagnostic conventions.
- Make configuration and startup failures visible.
- Include actionable error context without leaking secrets.
- Ensure CI captures useful failure output.
- Define component boundaries so failures can be localized.

**Evidence of mitigation:** Representative build and integration failures produce useful diagnostics.

## 9.18 Changes Break Existing Foundation Workflows

**Risk:** A repository restructuring, toolchain update, or contract change breaks another domain's workflow without detection.

**Impact:** Contributors lose a reliable baseline and downstream work becomes blocked.

**Mitigation:**

- Validate shared changes across affected domains.
- Keep required CI checks enabled.
- Identify impacted consumers before changing shared interfaces.
- Record compatibility effects.
- Preserve a known-good source revision or recovery path through normal repository practices.

**Evidence of mitigation:** Shared changes receive appropriate validation and their cross-domain effects are recorded.

## 9.19 Risk Ownership Is Unclear

**Risk:** A documented risk has no owner or mitigation path.

**Impact:** The risk remains unresolved despite appearing in documentation.

**Mitigation:**

- Assign risks through the authoritative task or project tracking process.
- Identify the domain responsible for mitigation.
- Track unresolved blockers explicitly.
- Reassess material risks before P0 exit.
- Escalate risks that affect multiple domains.

**Evidence of mitigation:** Material risks have an identifiable owner, disposition, or documented escalation.

## 9.20 Risk Acceptance and Exit Impact

An unresolved risk MUST be evaluated for its impact on the P0 objective and exit criteria.

The existence of a mitigation plan does not mean that the risk has been eliminated.

Any risk accepted at phase exit MUST have a documented rationale and an identifiable owner where follow-up is required.

The formal review and acceptance of residual risks are governed by the authoritative acceptance and review files and the global project process.

---

# 10. Exit Criteria

## 10.1 Exit Principles

P0 FOUNDATION is ready for exit consideration when the foundation deliverables are implemented, the required validation is available, ownership boundaries are clear, and the evidence supports the intended outcomes.

Exit MUST be based on verified outcomes rather than the completion of directory creation or documentation alone.

The authoritative `ACCEPTANCE_CRITERIA.md` defines the detailed acceptance requirements. `REVIEW_CHECKLIST.md` defines the review checks. The phase task inventory and implementation status are maintained in `TASKS.md`.

This section states the outcome-level exit conditions without duplicating those files.

## 10.2 Repository Foundation

The monorepo structure is established and usable.

Exit evidence MUST support the following outcomes:

- Major implementation domains have identifiable locations.
- Shared resources have authoritative locations.
- Repository conventions are documented.
- Ownership boundaries are understandable.
- Generated and temporary outputs are handled consistently.
- Contributors can discover the relevant documentation.
- No known foundational structural conflict prevents the intended domain work.

## 10.3 Contract Foundation

The initial contract organization is established.

Exit evidence MUST support the following outcomes:

- Required initial contract categories are identifiable.
- Contract ownership is explicit.
- Producers and consumers are recorded where known.
- Authoritative contract locations are discoverable.
- Required contract validation executes where applicable.
- Material unresolved interface questions are visible and assigned.
- No known foundational contract conflict prevents skeleton integration.

This criterion does not require every future product contract to be complete.

## 10.4 Engineering Conventions

The required foundation conventions are documented and usable.

Exit evidence MUST support the following outcomes:

- Naming and repository organization are consistent with the agreed baseline.
- Configuration and secret-handling expectations are explicit.
- Test and documentation locations are discoverable.
- Review and change-traceability practices are documented.
- Applicable automated formatting or lint checks are available.
- Domain-specific requirements remain with their respective owners.

## 10.5 Frontend Skeleton

The frontend skeleton is buildable and its initial validation path is usable.

Exit evidence MUST support the following outcomes:

- The application entry point and basic structure are identifiable.
- The minimal application shell initializes.
- The required build command executes.
- Applicable configured tests or smoke checks execute.
- Required configuration assumptions are documented.
- Unimplemented product functionality is not represented as complete.

## 10.6 Backend Skeleton

The backend skeleton is buildable and its initial validation path is usable.

Exit evidence MUST support the following outcomes:

- The service entry point and basic structure are identifiable.
- Configuration loading works for the supported environment.
- Startup and shutdown can be exercised.
- Required health or readiness behavior is verified where applicable.
- Relevant automated checks execute.
- Basic diagnostic output is available.
- Unimplemented domain behavior is explicitly distinguished from implemented behavior.

## 10.7 Database Integration Foundation

Where database integration is part of the approved P0 scope, the foundation provides a repeatable path for verifying that integration.

Exit evidence MUST support the following outcomes:

- The required database dependency is documented.
- Development configuration is available.
- Connectivity can be verified.
- The migration mechanism is identifiable where applicable.
- Relevant integration checks can execute.
- Database ownership and the limits of the foundation are explicit.

This criterion does not require completion of the entire product data model.

## 10.8 Infrastructure Organization

Where infrastructure configuration is required by the P0 scope, its organization and validation path are established.

Exit evidence MUST support the following outcomes:

- Infrastructure resources have an identifiable ownership boundary.
- Relevant configuration is organized consistently.
- Required validation is documented and available where applicable.
- Environment-specific and sensitive values are handled appropriately.
- The implemented scope is clearly distinguished from production readiness.

## 10.9 Continuous Integration

The required P0 CI path executes and provides trustworthy results.

Exit evidence MUST support the following outcomes:

- Relevant changes trigger the intended checks.
- Required builds execute.
- Required automated tests execute.
- Required contract validation executes where applicable.
- Required failures are visible.
- Reviewers can inspect the resulting evidence.
- Required checks do not silently pass when skipped.
- Known CI limitations are documented and assessed.

## 10.10 Local Development and Validation

The initial development workflow is discoverable and sufficiently repeatable.

Exit evidence MUST support the following outcomes:

- Required setup instructions are available from the relevant owners.
- Contributors can locate the supported build and test commands.
- The local validation path is documented.
- Material prerequisites are identified.
- Environment-specific assumptions are explicit.
- CI and local validation differences are understood.

The detailed development setup remains owned by the applicable global and domain-specific documents.

## 10.11 Automated Test Foundation

The repository has meaningful automated checks for the implemented foundation behavior.

Exit evidence MUST support the following outcomes:

- Applicable test entry points are available.
- Required foundation tests execute.
- Relevant initialization, contract, or smoke behavior is checked.
- CI reports the results.
- Failed or unexecuted checks are not represented as passed.
- Known test gaps are documented and assessed against the acceptance criteria.

The global testing strategy and domain testing documents determine the broader test requirements.

## 10.12 Documentation and Traceability

The foundation documentation is discoverable and points to authoritative owners.

Exit evidence MUST support the following outcomes:

- Repository entry points link to relevant documentation.
- Domain documentation can be located.
- Shared contract locations are documented.
- The P0 task and acceptance records are discoverable.
- Review and change evidence can be located.
- Duplicate sources of truth have been avoided or explicitly resolved.
- The documented workflow reflects the implemented repository.

## 10.13 Integration Demonstration

The foundation MUST have a verifiable integration demonstration appropriate to the implemented skeletons.

The demonstration SHOULD show that the relevant applications, contracts, and CI checks can operate through the documented workflow.

Exit evidence MUST distinguish between:

- A component that builds.
- A component that starts.
- A component that passes its available tests.
- An integration path that has actually been exercised.
- A capability that remains unimplemented.

The evidence MUST NOT imply end-to-end product readiness when only foundation-level behavior has been demonstrated.

## 10.14 Risk Disposition

Material P0 risks MUST be reviewed before exit.

Exit evidence MUST support the following outcomes:

- Material risks are recorded.
- Risk ownership is identifiable.
- Required mitigations have been completed or their residual risk is explicitly assessed.
- Blocking dependencies are resolved or handled through an approved disposition.
- Known structural and integration limitations are visible.
- Any accepted follow-up work has an identifiable tracking location.

An undocumented unresolved blocker MUST NOT be treated as an accepted residual risk.

## 10.15 Cross-Phase Handoff Readiness

The foundation MUST be structured so subsequent phases can build on it without needing to rediscover basic repository and engineering conventions.

| Phase | Canonical name | Handoff outcome |
|---|---|---|
| P1 | STUDIO | Frontend skeleton, repository conventions, and CI foundations are discoverable |
| P2 | BUILD & ARTIFACT | Build and contract validation foundations are available |
| P3 | CONTROL PLANE | Backend skeleton, shared interfaces, and initial data integration boundaries are available |
| P4 | BOOKING & COMMERCIAL | Shared engineering practices and interface ownership are established |
| P5 | EXECUTION | Build, validation, and cross-domain integration practices are available |
| P6 | LAB & ROBOT | Shared interface and validation foundations are available |
| P7 | LIVE & RESULTS | Contract organization and repeatable engineering practices are available |
| P8 | PRODUCTION | Source traceability, build evidence, and ownership boundaries are established |

These outcomes indicate readiness of the shared foundation, not completion of the receiving phase.

The authoritative milestone dossiers remain the source of truth for downstream scope and acceptance.

## 10.16 Formal Exit Review

Formal exit review MUST use the authoritative acceptance and review files.

The review SHOULD confirm:

1. The P0 objective has been met within the approved scope.
2. Required deliverables have evidence of implementation and verification.
3. Required CI and validation checks are available and trustworthy.
4. Repository, contract, and domain ownership boundaries are clear.
5. Material risks and unresolved dependencies have been assessed.
6. The documented handoff to subsequent phases is usable.
7. Task-level acceptance evidence is complete or has an explicitly approved disposition.
8. No requirement owned by another document has been silently redefined by this dossier.

This section does not replace the formal acceptance decision or its recorded evidence.

## 10.17 Exit Failure and Remediation

If an exit criterion is not satisfied:

1. Identify the unmet outcome.
2. Link it to the applicable acceptance criterion and task.
3. Record the missing or failed evidence.
4. Identify the responsible owner.
5. Determine whether the issue blocks P0 exit.
6. Record the corrective action and required verification.
7. Reassess the affected criterion after remediation.

A documentation-only update MUST NOT be used to claim implementation completion when the underlying behavior remains unverified.

## 10.18 Exit Evidence Record

The authoritative phase files MUST provide the traceable evidence for the exit decision.

Use the sibling files for their intended roles:

- `TASKS.md` — task inventory, status, dependencies, and ownership.
- `ACCEPTANCE_CRITERIA.md` — detailed acceptance requirements and evidence expectations.
- `REVIEW_CHECKLIST.md` — review verification and disposition.
- `CHANGELOG.md` — recorded phase changes.
- `GIT_COMMIT_STEP.md` — prescribed commit and repository-recording procedure.

This dossier SHOULD reference those files rather than duplicate their entries.

## 10.19 Completion Statement

P0 FOUNDATION may be considered ready for formal exit when the required acceptance criteria are satisfied, the applicable review has been completed, the required evidence is recorded, and material residual risks have been assessed through the authorized process.

The phase establishes a maintainable monorepo, identifiable cross-domain contracts, repeatable engineering conventions, working CI foundations, and buildable skeleton applications.

It does not declare the completion of any subsequent canonical phase or domain milestone.

Formal acceptance MUST be recorded through the authoritative phase acceptance and review process, with global governance requirements continuing to apply.
