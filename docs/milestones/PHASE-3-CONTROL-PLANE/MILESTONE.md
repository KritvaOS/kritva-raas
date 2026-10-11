# P3 CONTROL PLANE — Milestone Dossier

**Primary Phase:** P3 CONTROL PLANE  
**Supporting Phases:** P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P4 BOOKING & COMMERCIAL; P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS; P8 PRODUCTION  
**Document Type:** Phase milestone dossier  
**Document Path:** `docs/milestones/PHASE-3-CONTROL-PLANE/MILESTONE.md`  
**Status:** Planning baseline  
**Scope Focus:** Identity, projects, platform management, artifact registration and access, and Demo-0 integration.

## Ownership and Boundaries

This document defines the phase-level objective, scope, dependencies, deliverables, risks, and exit criteria for **P3 CONTROL PLANE**. It focuses on the control-plane capabilities required to identify users and workspaces, manage projects and platform configurations, register and reference artifacts, and demonstrate the integrated workflow through Demo-0.

This dossier defines outcomes and boundaries. It does not replace task-level implementation plans, API contracts, database schemas, security architecture, deployment specifications, or acceptance evidence.

The following sibling files are authoritative for their respective purposes:

- `TASKS.md` — task inventory, identifiers, dependencies, implementation order, and ownership.
- `ACCEPTANCE_CRITERIA.md` — detailed acceptance requirements and evidence expectations.
- `REVIEW_CHECKLIST.md` — implementation, security, and integration review checks.
- `CHANGELOG.md` — recorded changes associated with the phase.
- `GIT_COMMIT_STEP.md` — prescribed commit, verification, and repository-recording steps.

These files MUST remain separate artifacts. This dossier MUST link to them rather than reproduce their contents.

Other documentation owns the following concerns:

| Concern | Authoritative owner |
|---|---|
| Canonical phase definitions | `planning/PHASES.md` |
| System-level architecture and product-wide decisions | Applicable documents under `docs/architecture/` and `planning/DECISIONS.md` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| API and event wire contracts | Applicable authoritative documents under `docs/protocol/` |
| Artifact format contract | Authoritative artifact contract under `docs/protocol/` |
| Application security and trust boundaries | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Cloud infrastructure security | `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` |
| Database implementation and persistence | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Cloud topology and infrastructure | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Frontend implementation architecture | Applicable documents under `docs/frontend/architecture/` |
| Global development setup | `docs/development/DEVELOPMENT_SETUP.md` |
| Global development workflow | Applicable documents under `docs/development/` |
| Global testing strategy | `docs/development/TESTING_STRATEGY.md` |
| Global release policy | `docs/development/RELEASE_PROCESS.md` |
| Backend development setup | `docs/backend/development/DEVELOPMENT_SETUP.md` |
| Backend development workflow | `docs/backend/development/DEVELOPMENT_WORKFLOW.md` |
| Backend testing procedures | `docs/backend/development/TESTING.md` |
| Backend release implementation | `docs/backend/development/RELEASE_PROCESS.md` |
| Frontend development and testing | Applicable documents under `docs/frontend/development/` |
| Database milestone scope and acceptance | Authoritative dossiers under `docs/database/milestones/` |
| Cloud milestone scope and acceptance | Authoritative dossiers under `docs/cloud/milestones/` |
| Frontend milestone scope and acceptance | Authoritative dossiers under `docs/frontend/milestones/` |
| Other phase and milestone scope | Applicable authoritative dossiers under `docs/**/milestones/` |

This dossier owns phase-level outcomes for identity, projects, platform management, artifact registration and access, and Demo-0. It does not own every backend implementation detail or the complete identity, database, cloud, booking, execution, or production architecture.

---

# 1. Objective

## 1.1 Primary Objective

P3 CONTROL PLANE establishes the core service capabilities required to manage identities, projects, platform configurations, and artifact references through explicit and consistent backend interfaces.

The phase provides the control-plane foundation connecting the desktop experience and local build outputs to backend-managed project and platform metadata.

The control plane MUST establish clear ownership for identity context, project metadata, platform definitions, and artifact records without absorbing responsibilities that belong to the local build system or later operational workflows.

The phase also delivers Demo-0: an integrated demonstration showing that the agreed control-plane capabilities work together through the approved application and service boundaries.

## 1.2 Intended Outcomes

P3 CONTROL PLANE aims to establish:

1. A defined identity and authentication integration boundary.
2. A consistent model for user and workspace context where required by the approved architecture.
3. Project creation, discovery, and metadata management.
4. Platform definition and configuration management.
5. Artifact registration and metadata retrieval.
6. Explicit references between projects, platforms, and artifacts where required.
7. Backend APIs that follow the authoritative protocol contracts.
8. Persistence that follows the approved database architecture.
9. Consistent authorization and ownership enforcement.
10. Error handling and diagnostics for the implemented control-plane operations.
11. Automated validation of the relevant API, service, and persistence boundaries.
12. Demo-0 demonstrating the integrated control-plane workflow.

The exact entity schemas, API shapes, and detailed task sequence are maintained by the authoritative domain documents and sibling phase files.

## 1.3 Control-Plane Objective

The control plane provides the authoritative service interfaces for the management capabilities included in this phase.

It MUST distinguish metadata management from the execution of local build operations.

The control plane MAY register a locally created `.krv` artifact and retain metadata or an approved artifact reference. It MUST NOT imply that registering an artifact requires uploading the original source project.

Any transfer or storage of artifact payloads MUST follow the authoritative artifact contract, security requirements, and approved implementation design.

## 1.4 Identity Objective

The phase MUST establish the identity context required to protect control-plane operations.

Identity-related functionality SHOULD provide a consistent basis for determining who is making a request and what permissions apply.

The implementation MUST distinguish authentication from authorization:

- Authentication establishes the identity context.
- Authorization determines whether the identity may perform the requested operation.
- Resource ownership and workspace boundaries constrain access to managed data.
- Service identities, where required, remain distinct from human identities.

The complete authentication and authorization model remains owned by the system security architecture and relevant protocol contracts.

## 1.5 Project Management Objective

The project capability MUST provide a stable way to create, identify, retrieve, and update project metadata within the approved ownership model.

Projects MUST have stable identifiers and explicit ownership or workspace associations where required.

Project metadata MUST remain distinct from the source files on the user's local machine.

Creating or updating a project record MUST NOT implicitly upload the project source.

## 1.6 Platform Management Objective

The platform capability MUST represent the supported platform definitions and their relevant configuration metadata.

The phase SHOULD establish a consistent way to discover platform definitions and associate approved platform references with projects or artifacts where required.

Platform metadata MUST NOT be confused with live physical robot state, hardware provisioning, or execution status.

The implementation MUST keep platform definition and configuration management separate from later lab, robot, and execution workflows.

## 1.7 Artifact Management Objective

The control plane MUST provide the metadata-level operations required to register and discover artifacts produced by P2 BUILD & ARTIFACT.

The artifact record SHOULD identify the artifact using the authoritative contract and include only the metadata required by the approved data model.

Artifact registration MUST distinguish between:

- Artifact identity and metadata.
- Local artifact file location.
- Artifact payload storage.
- Artifact validation status.
- Any remote artifact copy, if separately authorized.

The control plane MUST NOT report an artifact as validated merely because a registration request succeeded.

## 1.8 Demo-0 Objective

Demo-0 MUST demonstrate the integrated control-plane path within the approved scope.

The demonstration SHOULD show the relevant user interaction and backend operations for identity context, project management, platform discovery or association, and artifact registration or discovery.

The demonstration MUST distinguish real service behavior from test doubles, static fixtures, and unavailable integrations.

Demo-0 is integration evidence for P3 CONTROL PLANE. It is not proof that all later-phase workflows or production requirements have been completed.

## 1.9 Relationship to the Canonical Phase Model

P3 CONTROL PLANE depends on the repository, desktop, and local artifact foundations established by earlier phases. It provides service capabilities that later phases may consume.

| Phase | Canonical name | Relationship to P3 CONTROL PLANE |
|---|---|---|
| P0 | FOUNDATION | Provides repository conventions, contracts, CI, and engineering foundations |
| P1 | STUDIO | Provides the desktop application shell and local integration boundary |
| P2 | BUILD & ARTIFACT | Produces local `.krv` artifacts and defines the artifact contract |
| P3 | CONTROL PLANE | Establishes identity, project, platform, artifact metadata, and Demo-0 integration |
| P4 | BOOKING & COMMERCIAL | May consume project, identity, and artifact references in booking and commercial workflows |
| P5 | EXECUTION | May consume approved project, platform, and artifact references for execution workflows |
| P6 | LAB & ROBOT | May use platform definitions and references in lab and robot workflows |
| P7 | LIVE & RESULTS | May consume control-plane identities and references where applicable |
| P8 | PRODUCTION | May extend control-plane capabilities under production operational requirements |

This table describes the phase relationships and handoffs. It does not redefine the scope or acceptance criteria of any other phase.

---

# 2. Scope and Non-Scope

## 2.1 In Scope

P3 CONTROL PLANE covers the core backend management capabilities for identity context, projects, platforms, and artifact metadata.

The scope includes:

- Identity integration required by the approved architecture.
- Authentication context propagation where applicable.
- Authorization enforcement for control-plane resources.
- Workspace or tenant context where required by the approved model.
- Project creation and retrieval.
- Project metadata updates within approved rules.
- Project ownership and access checks.
- Platform definition discovery.
- Platform metadata and configuration references.
- Artifact metadata registration.
- Artifact lookup and discovery.
- Project-to-artifact associations where required.
- Project-to-platform associations where required.
- Backend API implementation for these capabilities.
- Persistence integration using the authoritative data model.
- Input validation and consistent error mapping.
- Audit-relevant events for sensitive management operations where required.
- API and persistence tests.
- Organization coding-agent policy and coding-agent provider metadata, and Studio's switch from the default local policy to the Control Plane policy (`docs/architecture/CODING_AGENT_INTEGRATION.md` Section 8; KR-CA-022 to KR-CA-034).
- Demo-0 integration evidence.

The precise implementation tasks and acceptance conditions remain in the sibling files.

## 2.2 Identity Integration

The control plane MUST integrate with the approved identity mechanism.

The service SHOULD establish how identity context is obtained, validated, propagated, and used for access decisions.

The implementation MUST NOT trust identity fields supplied directly by an untrusted client without the required validation.

Where an external identity provider is used, the control plane MUST follow the approved token or session validation design.

Identity provider selection, credential lifecycle, and complete authentication policy remain owned by the security architecture and relevant implementation documents.

## 2.3 Authentication Context

Requests to protected control-plane operations MUST use the approved authentication mechanism.

The backend MUST define which operations require an authenticated identity and which, if any, are explicitly public.

The implementation SHOULD handle:

- Missing credentials.
- Invalid or expired credentials.
- Invalid identity claims.
- Unsupported authentication context.
- Identity provider failures.
- Missing required workspace or tenant context.

Errors MUST follow the authoritative API contract and MUST NOT reveal sensitive authentication details.

## 2.4 Authorization and Resource Ownership

The control plane MUST enforce authorization for protected resources.

Authorization SHOULD consider the applicable combination of:

- Authenticated identity.
- Workspace or tenant context.
- Resource ownership.
- Assigned permissions or roles.
- Operation being requested.
- Resource state where relevant.

The backend MUST NOT rely solely on frontend visibility controls to protect projects, platform configuration, or artifact records.

Unauthorized requests MUST fail through the approved error model.

The complete authorization policy and trust-boundary design remain owned by the security architecture.

## 2.5 Workspace or Tenant Context

Where the approved product model uses workspaces or tenants, the control plane MUST maintain a consistent boundary for their resources.

Project and artifact records MUST NOT be exposed across workspace boundaries without explicit authorization.

The implementation SHOULD ensure that workspace context is derived from a trusted identity or validated request context rather than accepted blindly from arbitrary client input.

If workspace management itself is not included in the approved P3 scope, this phase MUST integrate with the existing authoritative workspace model rather than invent a competing lifecycle.

## 2.6 Project Creation and Retrieval

The control plane MUST support the project operations required by the approved phase acceptance criteria.

At minimum, the project model SHOULD support:

- Stable project identity.
- Project name or display label.
- Ownership or workspace association where required.
- Creation metadata.
- Update metadata where applicable.
- Defined lifecycle status where needed.
- Retrieval of project details.
- Listing or discovery within the caller's authorized scope.

The authoritative data model and API contract define the exact fields and operations.

## 2.7 Project Metadata Updates

Project metadata updates MUST follow an explicit validation and authorization model.

The backend SHOULD distinguish mutable fields from fields that are system-managed or immutable.

Updates MUST NOT allow a caller to transfer project ownership, change workspace boundaries, or modify protected metadata without the required authorization.

Where concurrent updates are possible, the implementation SHOULD use the approved conflict-handling strategy.

## 2.8 Project Listing and Discovery

Project discovery MUST respect the caller's authorization and workspace scope.

The implementation SHOULD provide predictable pagination or bounded listing behavior if the project collection may grow beyond a small fixed size.

The API MUST NOT expose projects merely because their identifiers are known.

Filtering, ordering, pagination, and response limits MUST follow the authoritative API contract.

## 2.9 Platform Definition Management

The control plane MUST provide the platform discovery and metadata behavior included in the approved P3 scope.

A platform definition may describe a supported execution or development target without representing a live robot or physical hardware instance.

The platform model SHOULD identify the information required to select or understand a target platform.

The exact platform schema and extensibility rules remain owned by the applicable system architecture and protocol contracts.

## 2.10 Platform Configuration References

Where projects or artifacts refer to a platform, the relationship MUST use an explicit identifier or versioned reference consistent with the approved data model.

The implementation SHOULD avoid copying mutable platform definitions into unrelated records without a documented reason.

If platform configuration changes over time, the applicable contract MUST define whether references resolve to a current definition, a specific version, or a snapshot.

P3 MUST NOT invent a versioning policy independently of the platform contract.

## 2.11 Platform Discovery

Authorized clients SHOULD be able to discover the platform definitions available within the approved scope.

The control plane MUST distinguish supported platform definitions from:

- Physical device inventory.
- Hardware connection status.
- Live robot telemetry.
- Lab reservation state.
- Execution-agent availability.
- Production deployment status.

Those operational concerns remain owned by their applicable domains and phases.

## 2.12 Artifact Registration

The control plane MUST support artifact registration for artifacts created through the P2 BUILD & ARTIFACT workflow.

Registration SHOULD include the artifact identity and required metadata defined by the authoritative artifact contract.

The backend MUST validate registration inputs and reject records that violate the contract or data model.

Registration MUST NOT imply that the backend has inspected the artifact payload unless that validation actually occurred.

## 2.13 Artifact Metadata

The artifact record SHOULD contain the minimum metadata required to identify and discover an artifact.

Depending on the authoritative contract, this may include:

- Artifact identifier.
- Format version.
- Artifact type.
- Creation or registration metadata.
- Project association.
- Platform reference.
- Integrity information.
- Validation status with clear provenance.
- Storage or retrieval reference, where applicable.

The exact fields and validation rules belong to the artifact contract and database architecture.

P3 MUST NOT duplicate the full schema in this dossier.

## 2.14 Artifact Location and Payload Boundaries

The control plane MUST distinguish artifact metadata from the physical artifact payload.

An artifact may remain local while the control plane retains only a metadata record, if that is the approved P3 behavior.

Any payload transfer or remote storage MUST be explicitly defined by the authoritative contract and security architecture.

The service MUST NOT assume that a local filesystem path is accessible to the backend.

A local path MUST NOT be presented as a remote download URL or a backend-accessible storage location unless the implementation has established that relationship.

## 2.15 Artifact Discovery

The control plane SHOULD provide the artifact lookup and listing behavior required by the approved API contract.

Discovery MUST respect project and workspace authorization.

The service SHOULD support a predictable response when an artifact identifier does not exist or is not accessible to the caller.

The response MUST NOT disclose whether a protected resource exists when the approved security model requires indistinguishable not-found and forbidden behavior.

## 2.16 Artifact Validation Status

The control plane MUST preserve the distinction between registration and validation.

A registration request confirms only that the service accepted the metadata operation under its implemented rules.

If the artifact is validated locally, the control plane MAY record that status only when the status and its provenance are defined by the authoritative contract.

If the backend independently validates a payload, the validation result MUST be tied to the actual validation operation.

The service MUST NOT invent a successful validation status to simplify UI behavior.

## 2.17 Backend API Implementation

The backend MUST implement the required control-plane operations using the approved API and service architecture.

Implementation responsibilities may include:

- Routing and request handling.
- Input validation.
- Authentication and authorization integration.
- Application-service invocation.
- Data mapping.
- Persistence integration.
- Error mapping.
- API documentation generation.
- Relevant audit or diagnostic hooks.

Detailed implementation conventions remain owned by `docs/backend/architecture/API_IMPLEMENTATION.md` and the applicable backend architecture documents.

## 2.18 Database Integration

The control plane MUST persist required project, platform, and artifact metadata through the approved database access boundary.

Persistence behavior MUST follow the authoritative schema and migration strategy.

The service SHOULD preserve referential integrity between related records where required by the data model.

Database schema, indexing, transactions, and migration details remain owned by `docs/database/architecture/DATABASE_ARCHITECTURE.md` and the relevant database milestone dossiers.

## 2.19 Data Integrity and Concurrency

Control-plane operations MUST preserve the data integrity requirements defined by the approved model.

The implementation SHOULD handle:

- Duplicate creation attempts.
- Conflicting metadata updates.
- Missing related records.
- Invalid associations.
- Concurrent requests.
- Partial failures across service and persistence boundaries.

The exact transaction and concurrency model belongs to the database architecture and backend implementation documents.

## 2.20 Error Handling

Control-plane APIs MUST return consistent, contract-compliant errors for invalid requests, authorization failures, missing resources, and internal failures.

Error responses SHOULD help clients identify the failed operation without exposing internal stack traces, credentials, SQL details, or sensitive resource information.

The implementation MUST distinguish expected validation failures from unexpected service failures.

Error identifiers and response shapes MUST follow the authoritative protocol contract.

## 2.21 Audit-Relevant Operations

Where required by the approved security model, the control plane SHOULD record security-relevant management actions.

Potentially relevant operations include:

- Project creation or ownership changes.
- Platform configuration changes.
- Artifact registration.
- Changes to artifact associations.
- Changes to access-control-relevant metadata.

Audit records MUST be designed according to the applicable security and data-retention policies.

This dossier does not define a complete audit pipeline or retention architecture.

## 2.22 Demo-0 Integration

Demo-0 MUST demonstrate the integrated P3 capabilities through the approved interfaces.

The demonstration SHOULD include a coherent sequence such as:

1. Establishing an authenticated or explicitly approved test identity context.
2. Discovering or creating a project.
3. Retrieving platform definitions.
4. Associating relevant platform metadata with a project where supported.
5. Registering a locally produced `.krv` artifact.
6. Retrieving artifact metadata through the authorized control-plane interface.
7. Showing success and representative failure behavior.

The exact sequence MUST follow the authoritative task and acceptance files.

Demo-0 MUST clearly identify any fixture, mock, or simulated dependency.

## 2.23 Observability for Control-Plane Operations

The implemented service SHOULD expose sufficient diagnostics to investigate failures in the included control-plane operations.

Where applicable, diagnostics SHOULD identify:

- Operation category.
- Request or correlation identifier.
- Relevant resource identifier where safe.
- Failure category.
- Persistence or dependency failure.
- Authorization rejection category.
- Operation outcome.

Sensitive identity claims, tokens, secrets, and protected project data MUST NOT be logged unnecessarily.

Global observability and operations policy remain owned by the relevant system and infrastructure documentation.

## 2.24 Automated Validation

The control-plane implementation MUST have automated validation appropriate to its scope.

Validation SHOULD include:

- API request validation.
- Authentication and authorization behavior.
- Project CRUD and discovery operations within the approved scope.
- Platform discovery and reference handling.
- Artifact registration and lookup.
- Persistence and transaction behavior.
- Contract compliance.
- Cross-workspace access isolation where applicable.
- Demo-0 integration behavior.
- Expected failure handling.

The global testing strategy and backend testing documentation define the broader test policy.

## 2.25 Explicit Non-Scope

The following are outside the direct scope of P3 CONTROL PLANE unless explicitly assigned by the authoritative milestone and acceptance files:

- Local build engine implementation.
- `.krv` format definition owned by the artifact contract.
- Automatic source upload during artifact registration.
- Remote source compilation.
- Complete artifact payload storage and distribution.
- Booking, billing, and commercial transactions.
- Execution scheduling and job orchestration.
- Physical robot control.
- Lab reservation and hardware provisioning.
- Live telemetry processing.
- Results aggregation and reporting.
- Complete production deployment and operations.
- Cloud infrastructure provisioning.
- Full identity-provider product implementation where an existing provider is integrated.
- Product-wide authorization policy definition independent of the security architecture.

These concerns belong to the applicable canonical phases and authoritative domain documents.

P3 MAY establish the interfaces and metadata relationships required for future integration. It MUST NOT claim that later-phase capabilities are complete merely because their identifiers or references exist in the control plane.

## 2.26 Scope Change Control

Any proposed addition to P3 scope SHOULD explain:

1. Why it is necessary for identity, projects, platforms, artifact management, or Demo-0.
2. Which deliverable it supports.
3. Which domain owns the implementation.
4. Whether an authoritative API or data contract already covers the behavior.
5. Whether the change introduces a new security or persistence requirement.
6. Whether the change implies source or artifact payload transfer.
7. Whether it belongs to a later canonical phase.
8. How it affects the exit criteria.

Scope changes MUST be recorded in the authoritative task and acceptance files.

---

# 3. Dependencies

## 3.1 Dependency Principles

P3 CONTROL PLANE builds on the repository and desktop foundations established in P0 FOUNDATION and P1 STUDIO and the local artifact capability established in P2 BUILD & ARTIFACT.

It depends on approved identity and authorization boundaries, authoritative API and artifact contracts, the database data model, and a repeatable backend validation environment.

Dependencies MUST be explicit. The control plane MUST NOT introduce incompatible contracts or silently take ownership of another domain's behavior.

Task-level sequencing and dependency tracking belong in `TASKS.md`.

## 3.2 P0 FOUNDATION

P3 depends on the shared repository and engineering conventions established in P0 FOUNDATION.

Relevant inputs include:

- Monorepo organization.
- Contract organization.
- CI and test entry points.
- Naming and coding conventions.
- Documentation structure.
- Review and traceability practices.
- Initial application and service foundations.

The control-plane implementation MUST follow the established repository and contract conventions.

## 3.3 P1 STUDIO

Where the desktop Studio is used to demonstrate the control-plane capabilities, P3 depends on its application shell and backend communication boundary.

Relevant inputs include:

- Desktop application startup.
- Configuration management.
- API client conventions.
- Error presentation.
- Local build integration.
- A supported development and validation workflow.

The frontend remains responsible for presentation and client-side integration. The control plane remains responsible for the backend operations and access checks it exposes.

## 3.4 P2 BUILD & ARTIFACT

P3 depends on the authoritative `.krv` artifact contract and the artifact identity produced by the local build workflow.

Relevant inputs include:

- Artifact format version.
- Artifact identity rules.
- Required metadata.
- Integrity metadata where defined.
- Validation status semantics.
- Project and platform association rules where applicable.

P3 MUST NOT create a conflicting artifact schema or assume that local source files are available to the backend.

## 3.5 System Architecture

The control-plane implementation depends on the approved system architecture for component boundaries, service responsibilities, and integration paths.

The implementation SHOULD identify unresolved architecture decisions that affect identity context, project ownership, platform definitions, or artifact registration.

A missing decision MUST be assigned to the relevant architecture owner rather than silently embedded in the API implementation.

## 3.6 Identity and Authentication

P3 depends on the approved identity and authentication mechanism.

The service MUST know how to validate the caller's identity context and how that context is propagated to protected operations.

Where an external identity provider is used, the service depends on the approved integration configuration and validation procedure.

Identity-provider administration and credential lifecycle remain outside this milestone unless explicitly included in the authoritative scope.

## 3.7 Authorization Model

The control plane depends on a clear authorization model for projects, platforms, and artifacts.

The implementation MUST know which operations are permitted for the authenticated identity and which resources are accessible within the relevant workspace or ownership boundary.

Unresolved authorization rules MUST be treated as blockers for the affected protected operations.

The security architecture remains authoritative for the trust boundaries and policy.

## 3.8 API Contracts

The control plane depends on authoritative contracts for the APIs it implements.

The contracts MUST define the required request and response shapes, error behavior, and relevant versioning rules.

Backend implementation code MUST NOT become the only source of truth for externally visible behavior.

## 3.9 Artifact Contract

Artifact registration and discovery depend on the authoritative `.krv` contract.

The contract MUST define the metadata required for registration and the meaning of any validation status.

If the control plane stores a reference rather than the payload, that distinction MUST be clear in the contract.

## 3.10 Database Architecture

P3 depends on the approved data model and database implementation strategy.

Relevant inputs include:

- Project and workspace relationships.
- Platform metadata representation.
- Artifact record structure.
- Referential integrity.
- Transaction boundaries.
- Migration practices.
- Indexing and query constraints.
- Authorization-related data access requirements.

The database domain owns schema and migration implementation. P3 owns the required control-plane behavior that uses those structures.

## 3.11 Backend Architecture

The implementation depends on the backend architecture for module boundaries, service layering, dependency injection, configuration, logging, and error handling.

The control-plane functionality MUST be implemented within the approved backend structure rather than creating a parallel service framework.

## 3.12 Development Environment

The backend development environment MUST support running the service and its required local dependencies.

The exact language toolchain, package manager, service configuration, database startup, and local test commands belong to `docs/backend/development/DEVELOPMENT_SETUP.md`.

Global setup conventions remain owned by `docs/development/DEVELOPMENT_SETUP.md`.

## 3.13 CI and Testing Infrastructure

CI MUST be able to execute the required control-plane checks.

The environment SHOULD support the necessary database and service integration tests.

Where external identity-provider behavior cannot be exercised in CI, an approved test double MAY be used for specific tests. Such tests MUST NOT be represented as proof of successful integration with the real provider.

## 3.14 Security Guidance

P3 depends on the security architecture for authentication, authorization, trust boundaries, data isolation, secrets, and audit requirements.

The implementation MUST follow that guidance rather than invent an independent security model.

Any unresolved security requirement that affects access to protected resources MUST be treated as a blocking dependency for the affected operation.

## 3.15 Artifact Availability

P3 depends on a clear distinction between an artifact record and the artifact payload.

If the approved design retains only metadata, artifact registration MUST work without assuming backend access to the user's local filesystem.

If payload storage is separately included, the required storage interface, access policy, and validation process MUST be established by the responsible domain before integration is considered complete.

## 3.16 Demo-0 Environment

Demo-0 depends on a repeatable environment in which the relevant frontend, backend, database, and artifact interfaces can be exercised.

The demonstration SHOULD use a controlled configuration and known test inputs.

Its environment MUST clearly identify which services are real, which dependencies are mocked, and which operations are intentionally absent.

## 3.17 Dependency Matrix

| Dependency | Required contribution | Primary owner |
|---|---|---|
| P0 FOUNDATION | Repository, contract, CI, and engineering conventions | Foundation owners |
| P1 STUDIO | Desktop shell and client integration boundary | Frontend |
| P2 BUILD & ARTIFACT | `.krv` contract and local artifact identity | Build and artifact owners |
| System architecture | Service responsibilities and integration boundaries | Architecture |
| Identity mechanism | Validated caller identity context | Security and identity owners |
| Authorization model | Resource and workspace access rules | Security and architecture |
| API contracts | Request, response, error, and versioning semantics | Protocol owners |
| Artifact contract | Artifact metadata and validation semantics | Protocol/artifact owners |
| Database architecture | Data model and persistence strategy | Database |
| Backend architecture | Service implementation structure | Backend |
| Development environment | Repeatable local service and database setup | Backend and global development owners |
| CI and testing | Automated service and integration checks | CI and testing owners |
| Security guidance | Authentication, authorization, isolation, and audit constraints | Security |
| Artifact availability | Metadata-versus-payload handling | Artifact and backend owners |
| Demo-0 environment | Repeatable integration demonstration | Frontend, backend, and testing owners |

The task inventory MUST identify the actual assigned owners and blocking dependencies.

## 3.18 Dependency Failure Handling

When a dependency blocks P3:

1. Identify the affected control-plane operation.
2. Record the missing contract, identity rule, schema, environment, or service capability.
3. Identify the authoritative owner.
4. Determine whether a safe test double is appropriate.
5. Mark test-double evidence clearly.
6. Update the task dependency record.
7. Reassess the effect on the phase exit criteria.

A mock MUST NOT be treated as proof of real integration where real integration is required by acceptance.

## 3.19 Cross-Phase Handoffs

P3 provides management interfaces and metadata relationships that later phases may consume.

| Phase | Canonical name | Expected P3 handoff |
|---|---|---|
| P0 | FOUNDATION | Shared contracts and engineering conventions remain in force |
| P1 | STUDIO | Desktop client can use the control-plane API boundary |
| P2 | BUILD & ARTIFACT | Artifact metadata can be registered using the authoritative `.krv` contract |
| P3 | CONTROL PLANE | Identity, project, platform, artifact metadata, and Demo-0 outcomes are established |
| P4 | BOOKING & COMMERCIAL | Approved project and artifact references are available for commercial workflows |
| P5 | EXECUTION | Approved project, platform, and artifact references are available for execution integration |
| P6 | LAB & ROBOT | Platform definitions and relevant references are available for lab integration |
| P7 | LIVE & RESULTS | Applicable control-plane references can be used by live and results workflows |
| P8 | PRODUCTION | Control-plane interfaces can be extended under production requirements |

These handoffs do not transfer ownership of later-phase functionality to P3.

The applicable milestone dossiers define downstream scope and acceptance.

---

# 4. Deliverables

## 4.1 Deliverable Principles

P3 deliverables MUST be identifiable, reviewable, and verifiable.

An API route existing in the repository is not sufficient evidence that the operation is correctly secured or integrated with persistence.

Each deliverable MUST have an identifiable owner and verification method recorded in the authoritative task and acceptance files.

## 4.2 Identity Integration

The control plane MUST integrate with the approved identity mechanism for protected operations.

**Expected evidence:**

- Identity context is obtained and validated through the approved mechanism.
- Protected operations reject missing or invalid identity context.
- Authentication failures follow the API contract.
- Identity context is not trusted solely because the client supplied it.
- Sensitive authentication information is not exposed in responses or logs.
- The integration boundary is documented.

## 4.3 Authorization Enforcement

The backend MUST enforce authorization for protected project, platform, and artifact operations.

**Expected evidence:**

- Authorization is performed in the backend.
- Resource ownership or workspace scope is applied where required.
- Unauthorized operations are rejected.
- Cross-workspace access is prevented where applicable.
- Frontend visibility is not treated as the security boundary.
- Representative negative tests demonstrate enforcement.

## 4.4 Project Management API

The control plane MUST implement the approved project operations within P3 scope.

**Expected evidence:**

- Project creation works within the approved authorization model.
- Project retrieval returns the contract-defined representation.
- Listing or discovery is restricted to the caller's authorized scope.
- Metadata updates follow the approved validation rules.
- Invalid associations are rejected.
- Data integrity is maintained through the approved persistence boundary.

## 4.5 Platform Discovery and Metadata

The control plane MUST provide the platform discovery and metadata operations included in the approved scope.

**Expected evidence:**

- Platform definitions are identifiable.
- Required platform metadata follows the authoritative contract.
- Access follows the approved policy.
- Project or artifact references use valid identifiers.
- Platform definitions are not confused with live hardware status.
- Missing or invalid platform references are handled explicitly.

## 4.6 Artifact Registration

The control plane MUST implement artifact registration according to the authoritative `.krv` contract.

**Expected evidence:**

- The artifact identity is validated.
- Required metadata is checked.
- Invalid registrations are rejected.
- Project and platform associations follow the approved data model.
- Registration does not imply unperformed payload validation.
- Registration does not require source upload.
- The result follows the API contract.

## 4.7 Artifact Discovery

The control plane SHOULD provide the artifact lookup and listing behavior required by the approved contract.

**Expected evidence:**

- Registered artifacts can be retrieved within the permitted scope.
- Missing or inaccessible resources follow the approved error behavior.
- Discovery respects project and workspace authorization.
- Returned metadata follows the authoritative contract.
- Local file paths are not misrepresented as backend-accessible URLs.
- Payload availability is represented accurately.

## 4.8 Data Persistence Integration

The implemented control-plane operations MUST use the approved persistence boundary.

**Expected evidence:**

- Project, platform, and artifact records use the authoritative data model.
- Required relationships are preserved.
- Persistence errors are mapped consistently.
- Invalid references are rejected.
- Transaction behavior follows the database architecture.
- Schema changes follow the authoritative migration process.

## 4.9 API Contract Compliance

The backend APIs MUST comply with their authoritative contracts.

**Expected evidence:**

- Request and response shapes are consistent with the contract.
- Required fields are validated.
- Error responses use the approved model.
- Authorization behavior is consistent with the contract and security architecture.
- Contract tests or equivalent validation are available.
- API documentation reflects the implemented behavior.

## 4.10 Error Handling and Diagnostics

The service MUST provide consistent error handling for the implemented operations.

**Expected evidence:**

- Invalid input is distinguishable from unexpected service failure.
- Authentication and authorization failures are handled.
- Missing-resource behavior follows the contract.
- Persistence failures are diagnosable.
- Internal implementation details are not unnecessarily exposed.
- Relevant operation context is available in diagnostics without leaking sensitive information.

## 4.11 Security-Relevant Audit Behavior

Where required by the approved security model, sensitive management operations SHOULD produce appropriate audit evidence.

**Expected evidence:**

- Relevant operations are identified.
- Audit records include the required context.
- Sensitive credentials and tokens are excluded.
- Audit behavior follows the applicable security and data-retention rules.
- Audit failures have a defined disposition where audit is required for correctness or compliance.

## 4.12 Demo-0 Integration

Demo-0 MUST demonstrate the agreed control-plane capabilities through the approved interfaces.

**Expected evidence:**

- The demonstration can be started using documented instructions.
- The identity context is real or its test-double status is clearly stated.
- Project operations execute through the implemented API.
- Platform definitions are retrieved through the approved interface.
- A local `.krv` artifact can be registered using the agreed metadata contract.
- Artifact metadata can be retrieved through the authorized API.
- Representative failure behavior is visible.
- Mocked and real components are distinguished.
- The demonstration does not claim later-phase functionality is complete.

## 4.13 Automated Validation

The control-plane implementation MUST have repeatable automated tests.

**Expected evidence:**

- API input validation is tested.
- Authentication and authorization paths are exercised.
- Project operations are tested.
- Platform discovery and reference validation are tested.
- Artifact registration and lookup are tested.
- Persistence behavior is tested.
- Contract compliance is checked.
- Cross-workspace isolation is tested where applicable.
- Demo-0 integration behavior is validated.
- CI reports required failures visibly.

## 4.14 Developer and Integration Documentation

The implemented capabilities MUST have discoverable developer-facing documentation.

**Expected evidence:**

- Relevant APIs are documented.
- Required identity configuration is referenced.
- Project and platform behavior is described.
- Artifact registration requirements are linked to the authoritative contract.
- Local setup and test instructions are linked.
- Demo-0 startup and verification instructions are available.
- Known limitations and mocked dependencies are explicit.

Detailed implementation and setup instructions remain with the authoritative backend and global development documents.

## 4.15 Deliverable Ownership Matrix

| Deliverable | Primary owner | Supporting owners |
|---|---|---|
| Identity integration | Backend and identity owners | Security |
| Authorization enforcement | Backend | Security and architecture |
| Project management API | Backend | Database and protocol |
| Platform discovery and metadata | Backend | Architecture and protocol |
| Artifact registration | Backend | Artifact contract and database |
| Artifact discovery | Backend | Protocol and database |
| Persistence integration | Backend and database | Testing |
| API contract compliance | Backend | Protocol and testing |
| Error handling and diagnostics | Backend | Security and observability owners |
| Security-relevant audit behavior | Backend and security | Database and infrastructure |
| Demo-0 integration | Backend and frontend | Database, protocol, and testing |
| Automated validation | Backend and testing | CI and database |
| Developer and integration documentation | Backend documentation owner | Frontend and global documentation owners |

The task inventory MUST record actual assignments and dependencies. This matrix does not replace task ownership.

## 4.16 Deliverable Completion Rules

A deliverable is complete only when implementation and verification evidence support the intended outcome.

The following states MUST remain distinguishable:

- Implemented and verified.
- Implemented but not verified.
- Blocked by a dependency.
- Intentionally deferred.
- Not applicable to the approved implementation.

Exceptions MUST be recorded in the authoritative task and acceptance files.

---

# 9. Risks

## 9.1 Risk Management Principles

P3 CONTROL PLANE introduces protected service interfaces and shared metadata used by multiple parts of the product. Incorrect identity, ownership, or artifact semantics can create security defects and downstream integration failures.

The risks below identify the principal categories relevant to this phase. Task-level mitigation assignments and review evidence belong in the authoritative task and review files.

## 9.2 Authentication Context Is Not Validated

**Risk:** The backend trusts client-supplied identity information or fails to validate authentication context.

**Impact:** An unauthenticated or incorrectly identified caller may access protected operations.

**Mitigation:**

- Use the approved authentication mechanism.
- Validate identity context at the backend boundary.
- Reject invalid or expired credentials.
- Avoid trusting identity fields supplied independently by the client.
- Test expected authentication failures.

**Evidence:** Protected operations enforce the approved identity boundary.

## 9.3 Authorization Is Enforced Only in the Frontend

**Risk:** The UI hides unauthorized actions but backend endpoints do not enforce access rules.

**Impact:** Direct API calls may expose or modify protected resources.

**Mitigation:**

- Enforce authorization in backend operations.
- Validate resource ownership and workspace scope.
- Test direct unauthorized requests.
- Keep frontend visibility separate from backend permission checks.

**Evidence:** Negative API tests demonstrate backend authorization enforcement.

## 9.4 Cross-Workspace Data Exposure

**Risk:** Project or artifact queries return records outside the caller's permitted workspace.

**Impact:** Protected project metadata and artifact information become visible to other users.

**Mitigation:**

- Derive or validate workspace context through the approved model.
- Apply access scope to reads and writes.
- Test cross-workspace access attempts.
- Review queries for missing authorization filters.
- Follow the database and security architecture.

**Evidence:** Relevant tests demonstrate isolation across the approved resource boundary.

## 9.5 Project Ownership Can Be Changed Improperly

**Risk:** Project metadata updates permit unauthorized ownership or workspace changes.

**Impact:** A caller may transfer or expose a project outside the permitted scope.

**Mitigation:**

- Distinguish mutable and protected fields.
- Validate ownership changes explicitly.
- Apply backend authorization.
- Reject unexpected ownership or workspace fields.
- Test protected update paths.

**Evidence:** Project update behavior follows the approved ownership model.

## 9.6 Duplicate or Inconsistent Project Records

**Risk:** Concurrent or repeated requests create inconsistent project records.

**Impact:** Users see duplicates or related resources become attached to the wrong project.

**Mitigation:**

- Define project identity rules.
- Use the approved persistence and transaction strategy.
- Handle repeated requests consistently.
- Validate related-resource references.
- Test relevant concurrent or repeated operations.

**Evidence:** Project identity and persistence behavior match the authoritative data model.

## 9.7 Platform Metadata Is Confused with Live State

**Risk:** Platform definitions are treated as proof that a physical device or execution environment is available.

**Impact:** Later workflows make unsupported assumptions about hardware availability or operational status.

**Mitigation:**

- Define platform metadata separately from live operational state.
- Keep platform references explicit.
- Avoid exposing unsupported status claims.
- Route hardware availability requirements to their authoritative domain.

**Evidence:** Platform APIs represent only the platform information they actually own.

## 9.8 Platform Configuration Changes Break References

**Risk:** A platform definition changes while projects or artifacts refer to it.

**Impact:** Existing records may become ambiguous or incompatible.

**Mitigation:**

- Define reference and version semantics in the authoritative contract.
- Validate associations.
- Avoid undocumented snapshots.
- Coordinate schema and contract changes with affected consumers.

**Evidence:** Platform reference behavior is explicit and testable.

## 9.9 Artifact Registration Is Mistaken for Validation

**Risk:** The service marks an artifact as validated solely because registration succeeded.

**Impact:** Consumers may trust malformed or unverified artifacts.

**Mitigation:**

- Separate registration status from validation status.
- Define provenance for validation results.
- Validate payloads only through an actual validation operation.
- Follow the artifact contract.

**Evidence:** API responses and stored metadata distinguish registration from validation.

## 9.10 Source Upload Is Introduced Implicitly

**Risk:** Artifact registration or backend integration begins uploading the local project source without explicit approval.

**Impact:** The P2 local-source guarantee is violated and security assumptions change.

**Mitigation:**

- Register metadata without requiring source upload where specified.
- Define payload handling explicitly.
- Review network and storage boundaries.
- Prevent implicit remote build or upload fallbacks.
- Require a separate architecture and security decision for source transfer.

**Evidence:** The implemented registration path follows the approved source-handling model.

## 9.11 Artifact Metadata Is Inconsistent

**Risk:** Backend records diverge from the authoritative `.krv` contract.

**Impact:** Artifact discovery and downstream consumers cannot reliably interpret metadata.

**Mitigation:**

- Use one authoritative contract.
- Validate required fields.
- Avoid duplicated schemas.
- Add contract tests.
- Coordinate format changes with the artifact owner.

**Evidence:** Registration and retrieval conform to the same contract.

## 9.12 Database and API Models Diverge

**Risk:** API behavior and persisted data structures evolve independently.

**Impact:** Invalid records, inconsistent responses, and migration failures occur.

**Mitigation:**

- Keep the database architecture authoritative for persistence.
- Map API and database models explicitly.
- Validate schema changes.
- Use migration and integration tests.
- Avoid treating implementation models as the public contract.

**Evidence:** API behavior, persistence mapping, and schema migration evidence are consistent.

## 9.13 Partial Failure Creates Inconsistent Records

**Risk:** A multi-step operation partially updates project, platform, or artifact relationships.

**Impact:** The control plane contains dangling references or incomplete metadata.

**Mitigation:**

- Identify transaction boundaries.
- Validate references before persistence.
- Follow the approved transaction model.
- Define failure behavior.
- Test partial-failure scenarios where applicable.

**Evidence:** The persistence layer preserves the required data integrity.

## 9.14 Error Responses Leak Internal Details

**Risk:** Authentication, database, or service errors expose internal implementation information.

**Impact:** Sensitive details may assist attackers or disclose protected data.

**Mitigation:**

- Use contract-defined error responses.
- Keep stack traces and database details out of client responses.
- Avoid exposing sensitive identity claims.
- Preserve useful internal diagnostics with appropriate controls.
- Test error handling.

**Evidence:** Public responses follow the error contract without unnecessary internal detail.

## 9.15 Audit Records Contain Sensitive Data

**Risk:** Audit events record credentials, tokens, or unnecessary protected resource contents.

**Impact:** The audit system becomes a source of sensitive data exposure.

**Mitigation:**

- Follow the approved audit schema.
- Exclude secrets and credentials.
- Limit recorded resource details.
- Apply the security and retention policies.
- Review representative audit events.

**Evidence:** Audit records satisfy the applicable security requirements.

## 9.16 API Contracts Drift

**Risk:** Backend implementation changes without corresponding updates to authoritative API contracts.

**Impact:** Frontend and backend behavior diverges and integration becomes unreliable.

**Mitigation:**

- Treat protocol contracts as authoritative.
- Review externally visible changes.
- Validate API behavior against the contract.
- Update generated documentation where applicable.
- Coordinate changes with affected consumers.

**Evidence:** Implemented operations match the approved contract version.

## 9.17 Demo-0 Hides Missing Integration

**Risk:** Demo-0 relies on fixtures or mocks while presenting the result as a fully integrated system.

**Impact:** Real API, persistence, identity, or artifact integration failures remain undiscovered.

**Mitigation:**

- Identify real and mocked components.
- Exercise real service paths for the capabilities claimed as integrated.
- Include representative failure cases.
- Document known limitations.
- Avoid claiming downstream functionality that is not implemented.

**Evidence:** Demo-0 results identify which boundaries were actually exercised.

## 9.18 Test Environment Masks Authorization Defects

**Risk:** Tests run with overly privileged credentials or incomplete data isolation.

**Impact:** Authorization failures are not detected before integration.

**Mitigation:**

- Use distinct test identities and resource scopes where practical.
- Test both allowed and denied operations.
- Include cross-workspace cases where applicable.
- Avoid relying exclusively on administrator-level test contexts.

**Evidence:** Test results demonstrate representative positive and negative authorization behavior.

## 9.19 Unclear Artifact Payload Ownership

**Risk:** Frontend, backend, and infrastructure implementations disagree about where an artifact payload resides.

**Impact:** The system reports inaccessible paths or assumes a payload is available when it is not.

**Mitigation:**

- Distinguish artifact metadata from payload storage.
- Define payload ownership in the authoritative contract and architecture.
- Validate references before claiming availability.
- Avoid treating local paths as server-accessible locations.

**Evidence:** Artifact metadata and payload availability are represented accurately.

## 9.20 Scope Expands into Later Phases

**Risk:** P3 expands into booking, execution, live monitoring, or production operations.

**Impact:** Control-plane completion becomes ambiguous and required identity, project, and artifact capabilities are delayed.

**Mitigation:**

- Evaluate additions against the P3 objective.
- Identify the owning canonical phase and milestone.
- Keep extension points distinct from implemented functionality.
- Track deferred work in the authoritative planning records.
- Update acceptance scope through the approved process.

**Evidence:** P3 deliverables remain focused on identity, projects, platforms, artifacts, and Demo-0.

## 9.21 Risk Disposition at Exit

Material P3 risks MUST be reviewed before phase exit.

Each material unresolved risk SHOULD have an identifiable owner and a documented disposition.

The existence of a planned mitigation does not prove that the risk has been eliminated.

Residual risks MUST be assessed through the authoritative acceptance and review process.

---

# 10. Exit Criteria

## 10.1 Exit Principles

P3 CONTROL PLANE is ready for formal exit consideration when the agreed identity, project, platform, and artifact metadata operations are implemented through their authoritative interfaces, protected appropriately, and validated through repeatable tests.

Demo-0 MUST provide credible integration evidence for the capabilities claimed as complete.

Exit MUST be based on verified service behavior rather than API route existence or a successful UI walkthrough alone.

The authoritative `ACCEPTANCE_CRITERIA.md` defines detailed acceptance requirements. `REVIEW_CHECKLIST.md` defines review checks. `TASKS.md` maintains task status, ownership, and dependencies.

This section states outcome-level exit conditions without duplicating those files.

## 10.2 Identity Integration

The identity integration required by the approved P3 scope MUST be implemented and verified.

Exit evidence MUST support the following outcomes:

- The approved authentication boundary is identifiable.
- Protected operations validate the required identity context.
- Missing or invalid identity context is handled correctly.
- The backend does not trust arbitrary client-supplied identity fields.
- Authentication errors follow the authoritative API contract.
- Sensitive authentication information is not exposed unnecessarily.

## 10.3 Authorization Enforcement

Protected control-plane operations MUST enforce the approved authorization model.

Exit evidence MUST support the following outcomes:

- Authorization occurs in the backend.
- Resource ownership and workspace scope are enforced where applicable.
- Unauthorized requests are rejected.
- Protected metadata cannot be modified through unapproved fields.
- Cross-workspace access is prevented where required.
- Representative negative tests demonstrate enforcement.

## 10.4 Project Management

The approved project operations MUST work through the control-plane API.

Exit evidence MUST support the following outcomes:

- Project creation and retrieval behave according to the contract.
- Project discovery is restricted to the authorized scope.
- Metadata updates follow the approved rules.
- Project identifiers and ownership associations are consistent.
- Invalid references are rejected.
- Persistence behavior preserves the required data integrity.

## 10.5 Platform Management

The platform discovery and metadata behavior included in P3 MUST be implemented.

Exit evidence MUST support the following outcomes:

- Platform definitions follow the authoritative model.
- Required platform metadata is available through the approved interface.
- Platform references are validated.
- Platform metadata is not presented as live hardware status.
- Access follows the approved security model.
- Relevant negative cases are covered by automated validation.

## 10.6 Artifact Registration

Artifact registration MUST follow the authoritative `.krv` contract.

Exit evidence MUST support the following outcomes:

- Artifact identity and required metadata are validated.
- Registration follows the approved API contract.
- Required project and platform associations are checked.
- Invalid registrations are rejected.
- Registration is distinct from artifact payload storage.
- Registration is distinct from artifact validation.
- The standard workflow does not require source upload.

## 10.7 Artifact Discovery

The artifact lookup and discovery operations required by the approved scope MUST be implemented.

Exit evidence MUST support the following outcomes:

- Authorized clients can retrieve registered artifact metadata.
- Access restrictions are enforced.
- Missing and inaccessible resources follow the approved error behavior.
- Returned metadata follows the authoritative contract.
- Payload availability is represented accurately.
- Local paths are not misrepresented as remote artifact locations.

## 10.8 Persistence and Data Integrity

The implemented control-plane operations MUST use the approved persistence architecture.

Exit evidence MUST support the following outcomes:

- Required records use the authoritative data model.
- Referential integrity is preserved.
- Invalid relationships are rejected.
- Transaction and concurrency behavior follows the approved design.
- Database failures are mapped appropriately.
- Required schema changes follow the authoritative migration process.
- Persistence tests provide evidence for the implemented operations.

## 10.9 API Contract Compliance

The implemented APIs MUST comply with their authoritative contracts.

Exit evidence MUST support the following outcomes:

- Request and response structures match the contract.
- Required input validation is implemented.
- Error behavior is consistent.
- Authorization semantics are clear.
- Contract tests or equivalent validation are available.
- API documentation reflects the implemented behavior.

## 10.10 Error Handling and Diagnostics

The service MUST provide appropriate error handling and diagnostic information for the implemented operations.

Exit evidence MUST support the following outcomes:

- Validation failures are distinguishable from unexpected service failures.
- Authentication and authorization failures are handled.
- Missing-resource behavior follows the contract.
- Persistence failures can be investigated.
- Sensitive information is not unnecessarily exposed.
- Relevant operation context is available for diagnosis.

## 10.11 Security and Data Isolation

The control-plane implementation MUST satisfy the applicable security requirements.

Exit evidence MUST support the following outcomes:

- Authentication follows the approved boundary.
- Authorization is enforced by the backend.
- Resource ownership is respected.
- Workspace isolation is verified where applicable.
- Sensitive credentials are not exposed in responses or logs.
- Artifact payload and metadata boundaries are explicit.
- Material security risks have been assessed.

## 10.12 Demo-0 Integration

Demo-0 MUST demonstrate the agreed P3 capabilities through the implemented interfaces.

Exit evidence MUST support the following outcomes:

- The demonstration can be started through documented instructions.
- The identity context is established through the approved mechanism or is clearly labelled as a test double.
- Project operations execute through the implemented API.
- Platform definitions are retrieved through the approved interface.
- Artifact metadata is registered and retrieved through the agreed contract.
- Representative failures are handled visibly.
- Real and mocked components are distinguished.
- The demonstration does not imply completion of later-phase functionality.

## 10.13 Automated Validation

The control-plane implementation MUST have a repeatable validation path.

Exit evidence MUST support the following outcomes:

- API validation tests execute.
- Authentication and authorization tests execute.
- Project operations are tested.
- Platform operations are tested.
- Artifact registration and lookup are tested.
- Persistence integration is validated.
- Contract compliance is checked.
- Cross-workspace isolation is tested where applicable.
- Demo-0 integration behavior is validated.
- Required CI checks report failures visibly.

The global testing strategy and backend testing documentation remain authoritative for detailed testing policy.

## 10.14 Documentation and Ownership

The control-plane capabilities MUST have discoverable documentation and clear ownership boundaries.

Exit evidence MUST support the following outcomes:

- Relevant APIs are documented.
- Identity and authorization requirements are linked to their authoritative owners.
- Project and platform behavior is documented.
- Artifact registration refers to the authoritative `.krv` contract.
- Database implementation details remain with database documentation.
- Backend setup and testing instructions are linked.
- Demo-0 instructions are available.
- Global testing and release policy are referenced rather than redefined.
- Unresolved cross-domain decisions are assigned.

## 10.15 Risk Disposition

Material P3 risks MUST be reviewed before exit.

Exit evidence MUST support the following outcomes:

- Material risks are recorded.
- Risk ownership is identifiable.
- Required mitigations have been completed or residual risks assessed.
- Blocking dependencies are resolved or have an approved disposition.
- Known limitations are documented.
- Follow-up work is traceable to an authoritative task or planning record.

An undocumented blocker MUST NOT be treated as an accepted residual risk.

## 10.16 Cross-Phase Handoff Readiness

P3 MUST provide clear control-plane interfaces and data semantics for later phases to consume.

| Phase | Canonical name | Handoff outcome |
|---|---|---|
| P0 | FOUNDATION | Shared repository and contract conventions remain in force |
| P1 | STUDIO | Desktop client can use the defined control-plane interface |
| P2 | BUILD & ARTIFACT | Artifact registration follows the authoritative `.krv` contract |
| P3 | CONTROL PLANE | Identity, project, platform, artifact metadata, and Demo-0 outcomes are established |
| P4 | BOOKING & COMMERCIAL | Approved project and artifact references are available for later commercial workflows |
| P5 | EXECUTION | Approved project, platform, and artifact references are available for later execution integration |
| P6 | LAB & ROBOT | Platform definitions and references are available for later lab integration |
| P7 | LIVE & RESULTS | Applicable control-plane references are available for later live and results integration |
| P8 | PRODUCTION | Control-plane interfaces can be extended under production requirements |

These outcomes indicate readiness of the P3 deliverables only. They do not establish acceptance of downstream functionality.

## 10.17 Formal Exit Review

Formal exit review MUST use the authoritative acceptance and review files.

The review SHOULD confirm:

1. The P3 objective has been met within the approved scope.
2. Identity integration follows the approved authentication boundary.
3. Protected operations enforce authorization.
4. Project operations follow the approved data model and API contract.
5. Platform discovery and metadata follow the authoritative model.
6. Artifact registration and discovery follow the `.krv` contract.
7. Persistence and data integrity requirements are satisfied.
8. Demo-0 provides credible integration evidence.
9. Required automated checks execute and report trustworthy results.
10. Material risks and dependencies have been assessed.
11. Task-level evidence is complete or has an explicitly approved disposition.

This section does not replace the formal acceptance decision or its recorded evidence.

## 10.18 Exit Failure and Remediation

If an exit criterion is not satisfied:

1. Identify the unmet outcome.
2. Link it to the applicable task and acceptance criterion.
3. Record the missing or failed evidence.
4. Identify the responsible owner.
5. Determine whether the issue blocks phase exit.
6. Record the corrective action and required verification.
7. Reassess the criterion after remediation.

A documentation-only change MUST NOT be used to claim that an unverified API, authorization, or persistence behavior is complete.

## 10.19 Exit Evidence Record

The authoritative phase files MUST provide traceable evidence for the exit decision.

Use the sibling files for their intended roles:

- `TASKS.md` — task inventory, dependencies, status, and ownership.
- `ACCEPTANCE_CRITERIA.md` — detailed acceptance requirements and evidence expectations.
- `REVIEW_CHECKLIST.md` — review checks and disposition.
- `CHANGELOG.md` — recorded phase changes.
- `GIT_COMMIT_STEP.md` — prescribed commit and repository-recording procedure.

This dossier SHOULD link to those files rather than duplicate their contents.

## 10.20 Completion Statement

P3 CONTROL PLANE may be considered ready for formal exit when the required acceptance criteria are satisfied, the applicable review has been completed, the required evidence is recorded, and material residual risks have been assessed through the authorized process.

The phase establishes the control-plane foundation for identity, projects, platform metadata, artifact registration and discovery, and Demo-0 integration.

It does not declare the completion of any subsequent canonical phase or domain milestone.

Formal acceptance MUST be recorded through the authoritative phase acceptance and review process, with global governance requirements continuing to apply.
