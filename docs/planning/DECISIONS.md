# Product and System Architecture Decisions

**Document:** `docs/planning/DECISIONS.md`  
**Project:** Kritva RaaS  
**Status:** Product/system architecture decision register and domain decision index  
**Audience:** Product architecture, system architecture, engineering leads, and milestone owners  
**Normative language:** MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY express requirements.

## 1. Purpose

This document records architectural decisions that apply across Kritva RaaS as a product and system.

It provides a central register for cross-domain architectural decisions, records their rationale and consequences, and identifies the authoritative decision registers for domain-specific decisions.

The objective is to make system-level architectural choices discoverable, traceable, and stable while ensuring that implementation decisions remain owned by the appropriate domain.

This document is not a general repository of every technical decision. It MUST contain only decisions whose scope crosses domain boundaries or materially constrains the product's system architecture.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns:

- The index of product/system-level architectural decisions.
- The records of cross-domain architectural decisions.
- The rationale and consequences of system-level choices.
- The status and lifecycle of product/system architecture decision records.
- The relationship between system-level decisions and domain decision registers.
- The process for proposing, reviewing, accepting, superseding, or rejecting system-level decisions.
- The traceability of system-level decisions to the canonical phases and authoritative milestone dossiers.
- The governance rules preventing duplicated or conflicting decision records.

A decision belongs here when it affects multiple engineering domains, establishes a product-wide architectural constraint, changes a system-level ownership boundary, or requires agreement across domain decision owners.

### 2.2 What This Document Does Not Own

This document MUST NOT duplicate domain-specific architecture decision records.

The following domain registers own decisions within their respective boundaries:

| Domain | Decision ownership | Register or authoritative documentation |
|---|---|---|
| Frontend | Frontend architecture, client application structure, UI state, client integration, and frontend implementation choices | `docs/frontend/` and the designated frontend decision register |
| Backend | Backend modules, application services, runtime behavior, API implementation, workers, and backend implementation choices | `docs/backend/` and the designated backend decision register |
| Cloud | Cloud deployment, accounts, networks, infrastructure, provider services, IaC, capacity, and infrastructure security | `docs/cloud/` and the designated cloud decision register |
| Database | Data persistence implementation, schema evolution, transactions, PostgreSQL security, indexing, partitioning, and recovery | `docs/database/` and the designated database decision register |

If a designated domain decision register does not yet exist, the relevant domain owner MUST establish it in the domain's planning or architecture area and link it from this index. This document MUST NOT become the permanent substitute for a missing domain register.

### 2.3 System Architecture Ownership

The following documents own system-level architecture within their subject areas:

| Subject | Authoritative document |
|---|---|
| Product/system cloud topology | `docs/architecture/CLOUD_ARCHITECTURE.md` |
| System backend modules and ownership | `docs/architecture/BACKEND_ARCHITECTURE.md` |
| System database role and authority | `docs/architecture/DATABASE_ARCHITECTURE.md` |
| Application security model, trust boundaries, and authentication/authorization design | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Canonical phase definitions | `docs/planning/PHASES.md` |
| Cross-domain system requirements and architecture constraints | The applicable product and system architecture documents |

A system architecture document owns the current architecture and its rationale. This decision register records the decision history and cross-domain commitments. Neither role authorizes duplicating domain implementation decisions.

### 2.4 Decision Ownership Rule

Every decision MUST have one authoritative home.

A decision that affects multiple domains MUST be recorded here only for the cross-domain choice, constraints, rationale, and consequences.

Domain-specific decisions that implement the cross-domain choice MUST be recorded in the relevant domain register and linked from the system-level decision when material.

For example, a product-wide requirement to isolate production from development may be recorded here as a system decision. The concrete cloud account structure, IAM policies, network controls, database configuration, and deployment pipeline implementation belong in their respective domain registers and architecture documents.

### 2.5 Explicit Non-Goals

This document MUST NOT become the authoritative home for:

- Every frontend implementation choice.
- Every backend implementation choice.
- Every cloud resource configuration decision.
- Every database schema or migration decision.
- API or event wire contracts.
- Application-level security implementation details.
- Milestone task lists or acceptance checklists.
- Product requirements already defined in authoritative requirements documents.
- Phase definitions or milestone scope.
- Operational runbooks or deployment instructions.
- A duplicate copy of architecture documents.

Such content MUST be removed from this document or replaced with a link to the authoritative owner.

## 3. Decision Record Model

### 3.1 What Qualifies as a System-Level Decision

A decision SHOULD be recorded here when one or more of the following applies:

- It changes a product-wide architectural constraint.
- It changes ownership between system components or engineering domains.
- It introduces or removes a major system boundary.
- It constrains multiple domain architectures.
- It changes the system's supported deployment or operating model.
- It materially changes product-wide security, reliability, or recovery expectations.
- It establishes a system-wide compatibility or interoperability requirement.
- It creates a significant cross-domain dependency.
- It supersedes an earlier system-level decision.
- It introduces a product-wide constraint that cannot be resolved independently by one domain.

A decision MUST NOT be recorded here merely because it is technically important within a single domain.

### 3.2 Decision Record Fields

Every accepted system-level decision MUST include:

- **ID:** Stable, unique identifier.
- **Title:** Short description of the decision.
- **Status:** Proposed, Accepted, Rejected, Superseded, or Withdrawn.
- **Date:** Date of the decision or latest status transition.
- **Context:** Problem, requirement, or constraint motivating the decision.
- **Decision:** The selected product/system-level choice.
- **Rationale:** Why the selected choice is preferred.
- **Consequences:** Benefits, limitations, and obligations introduced.
- **Affected domains:** Frontend, backend, cloud, database, security, or other applicable domains.
- **Related decisions:** IDs of decisions that constrain, depend on, or supersede this decision.
- **Implementation references:** Links to the authoritative architecture documents or domain decisions.
- **Review trigger:** Conditions that would require reconsideration.

A proposed decision MAY have incomplete implementation references, but the missing references MUST be resolved before the decision is considered fully implemented.

### 3.3 Stable Identifiers

System-level decision IDs MUST remain stable after acceptance.

IDs MUST NOT be reused.

A superseding decision MUST receive a new ID and reference the decision it supersedes.

Domain decision IDs MUST remain under their domain's naming convention and authoritative register. They MUST NOT be renumbered to match this document.

### 3.4 Decision Status

| Status | Meaning |
|---|---|
| Proposed | Under discussion; not yet an authoritative constraint |
| Accepted | Approved and authoritative until superseded or withdrawn |
| Rejected | Reviewed and not selected |
| Superseded | Replaced by a later decision |
| Withdrawn | No longer applicable and not replaced by a direct successor |

A proposed decision MUST NOT be represented as an approved architecture constraint.

A superseded decision MUST remain discoverable for historical traceability.

A rejected or withdrawn decision MUST include a brief reason.

### 3.5 Decision Scope

Each decision MUST explicitly state its scope.

The scope SHOULD identify whether the decision applies to the complete product, a system boundary, an environment, a deployment model, or a specific cross-domain capability.

A decision MUST NOT accidentally become a universal requirement when it was intended for one constrained use case.

### 3.6 Consequences

Accepted decisions MUST document material consequences, including:

- New constraints on domain implementation.
- Compatibility obligations.
- Security or reliability implications.
- Operational responsibilities.
- Cost or capacity implications.
- Migration requirements.
- Testing and acceptance obligations.
- Risks accepted by the decision owner.

Consequences MUST be actionable enough for affected domain owners to implement or explicitly reject a proposed interpretation.

## 4. Cross-Domain Decision Index

### 4.1 Index Purpose

This section is the entry point for system-level decisions.

Each entry MUST link to the authoritative record or section containing the complete decision. The index MUST NOT copy the full content of a domain-specific decision.

The register SHOULD identify the decision's status and the domains affected so that reviewers can determine whether a change requires cross-domain review.

### 4.2 Decision Index

No cross-domain decision should be inferred solely from the existence of this index. The entries below are intended as the canonical index structure. Only decisions actually approved by the project may be marked Accepted.

| ID | Decision title | Status | Affected domains | Authoritative record |
|---|---|---|---|---|
| SYS-ADR-001 | Product/system architecture ownership and decision governance | Proposed | All domains | This document, Section 5 |
| SYS-ADR-002 | Environment separation and production isolation | Proposed | Backend, cloud, database, security | `docs/architecture/CLOUD_ARCHITECTURE.md` and the designated domain decision registers |
| SYS-ADR-003 | System-wide data authority and persistence boundaries | Proposed | Backend, database, security | `docs/architecture/DATABASE_ARCHITECTURE.md` |
| SYS-ADR-004 | Cross-domain security boundary enforcement | Proposed | Frontend, backend, cloud, database, security | `docs/architecture/SECURITY_ARCHITECTURE.md` |
| SYS-ADR-005 | Cross-domain compatibility and change coordination | Proposed | Frontend, backend, cloud, database | This document, Section 9 |
| SYS-ADR-006 | System-wide operational evidence and acceptance traceability | Proposed | All domains | This document, Sections 8 and 10 |

These entries are proposed register placeholders, not evidence that the underlying decisions have been accepted. Each entry MUST be reviewed and either completed, rejected, or removed from the active index.

### 4.3 Index Maintenance

When a system-level decision is accepted, the index MUST link to its full record and identify its status.

When a decision is superseded, the index MUST identify the successor.

When a domain implementation decision materially affects a system-level decision, the system-level record SHOULD link to the relevant domain decision.

The index MUST NOT duplicate the domain decision's implementation details.

## 5. System-Level Decision Records

### 5.1 SYS-ADR-001 — Product/System Architecture Ownership and Decision Governance

**Status:** Proposed  
**Scope:** All Kritva RaaS engineering domains  
**Affected domains:** Frontend, backend, cloud, database, security, and system architecture

#### Context

Kritva RaaS requires coordinated architecture decisions across multiple domains. Without explicit decision ownership, the same architectural choice can be documented differently in planning files, implementation architecture documents, domain registers, and milestone dossiers.

Duplicate decisions create uncertainty about which record is authoritative and make changes difficult to review.

#### Proposed Decision

Each architectural decision MUST have one authoritative home based on its scope.

Product/system-level decisions that affect multiple domains belong in this register.

Domain implementation decisions belong in their respective domain decision registers.

Current architecture and its rationale remain documented in the applicable system architecture documents.

Milestone scope and acceptance remain governed by the authoritative dossiers under `docs/**/milestones/`.

#### Rationale

This separation preserves cross-domain traceability without duplicating implementation-level decisions.

It also allows domain owners to evolve implementation details independently as long as the accepted system-level constraints remain satisfied.

#### Consequences

- System-level decisions require cross-domain review when multiple domains are materially affected.
- Domain owners are responsible for maintaining their own decision records.
- Architecture documents MUST link to relevant decisions instead of copying full records.
- Milestone dossiers remain the authority for milestone acceptance.
- Decision history MUST preserve status transitions and supersession relationships.

#### Review Triggers

Review this decision if the project changes its documentation governance, domain ownership model, or architecture decision workflow.

### 5.2 SYS-ADR-002 — Environment Separation and Production Isolation

**Status:** Proposed  
**Scope:** System-level deployment and environment boundaries  
**Affected domains:** Backend, cloud, database, security

#### Context

The product requires separate environments for engineering, release validation, and production operation. Cross-environment dependencies can introduce security exposure, reduce release confidence, and create unexpected production failure paths.

#### Proposed Decision

Development, staging, and production MUST have explicit environment boundaries.

Production data, credentials, and workloads MUST be isolated from routine non-production access.

The detailed account, network, resource, and identity implementation MUST be recorded in the cloud and security domain documentation.

Database-specific environment controls MUST be recorded in the database domain documentation.

#### Rationale

Environment isolation reduces the likelihood that testing activity, development credentials, or non-production failures affect production resources.

It also provides a clear basis for release promotion, access review, and recovery planning.

#### Consequences

- Cloud architecture MUST define the concrete environment and resource boundaries.
- Infrastructure security MUST define the enforcement controls.
- Database architecture MUST define environment-specific access and recovery behavior.
- Deployment automation MUST respect the approved environment boundary.
- Exceptions MUST be explicit, justified, and reviewed.

#### Review Triggers

Review this decision if the deployment model changes materially, if environments are consolidated, or if a new environment or trust boundary is introduced.

### 5.3 SYS-ADR-003 — System-Wide Data Authority and Persistence Boundaries

**Status:** Proposed  
**Scope:** System-level data ownership and persistence boundaries  
**Affected domains:** Backend, database, security

#### Context

Multiple services may read or modify related data. Without explicit system-level authority, duplicated state and competing write paths can lead to inconsistent records and unclear recovery responsibility.

#### Proposed Decision

Canonical data ownership MUST be defined by the system database architecture.

The system architecture MUST identify which component or domain is authoritative for each persistent data category.

The PostgreSQL implementation MUST enforce the approved ownership and integrity requirements without redefining them.

Database schema, migration, transaction, indexing, and recovery details MUST be maintained in the database implementation architecture and domain decision register.

#### Rationale

Separating data authority from persistence implementation preserves a stable system contract while allowing the physical database design to evolve.

#### Consequences

- System data ownership MUST be explicit.
- Application services MUST respect canonical write ownership.
- Database constraints and transactions MUST implement approved invariants.
- Cross-domain data duplication MUST have a documented consistency and lifecycle strategy.
- Recovery procedures MUST preserve the authoritative data model.

#### Review Triggers

Review this decision if a data domain changes its authoritative owner, a new persistent store is introduced, or cross-domain consistency requirements materially change.

### 5.4 SYS-ADR-004 — Cross-Domain Security Boundary Enforcement

**Status:** Proposed  
**Scope:** System-level security responsibilities across application and infrastructure layers  
**Affected domains:** Frontend, backend, cloud, database, security

#### Context

Application security and infrastructure security operate at different layers. Treating a network control or cloud role as a replacement for application authorization can leave access paths insufficiently protected. Duplicating security design in multiple documents can also create conflicting requirements.

#### Proposed Decision

The application security model, trust boundaries, and authentication/authorization design MUST be owned by `docs/architecture/SECURITY_ARCHITECTURE.md` and the applicable documents under `docs/security/`.

Cloud infrastructure controls MUST be owned by `docs/cloud/architecture/SECURITY_ARCHITECTURE.md`.

Database-specific privilege and row-level security implementation MUST be owned by `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

Each layer MUST implement its own controls and MUST NOT assume that another layer provides an equivalent control unless that dependency is explicit and verified.

#### Rationale

The decision creates clear accountability for application-level access rules and infrastructure enforcement while allowing defense in depth.

#### Consequences

- Application authorization MUST be evaluated at the application boundary.
- Cloud IAM MUST restrict workload access to infrastructure resources.
- Database roles and RLS MUST enforce approved database-level restrictions.
- Security tests MUST verify both intended access and prohibited access.
- Cross-layer security changes MUST be reviewed by the affected owners.

#### Review Triggers

Review this decision if trust boundaries change, new authentication or identity mechanisms are introduced, or an infrastructure control becomes a critical dependency for an application security guarantee.

### 5.5 SYS-ADR-005 — Cross-Domain Compatibility and Change Coordination

**Status:** Proposed  
**Scope:** Cross-domain changes that affect published contracts or multiple deployable components  
**Affected domains:** Frontend, backend, cloud, database

#### Context

A change in one domain can affect other domains through APIs, events, artifacts, persistent data, deployment configuration, or runtime dependencies.

Independent implementation without compatibility review can cause a deployment to break consumers or prevent safe rollback.

#### Proposed Decision

Cross-domain changes MUST identify affected contracts, domains, and deployment dependencies.

The authoritative protocol, architecture, or domain decision document MUST record the implementation-level details.

This register MUST record only the system-level compatibility obligation and cross-domain decision when a material product/system choice is involved.

#### Rationale

Explicit change coordination reduces incompatible releases and prevents this register from becoming a duplicate of protocol or implementation documentation.

#### Consequences

- Changes MUST identify affected consumers and providers.
- Compatibility assumptions MUST be documented.
- Database migrations MUST consider supported application versions.
- Deployment order MUST be documented when order affects correctness.
- Domain owners MUST review material changes affecting their contracts.
- Rollback limitations MUST be documented when the previous version cannot safely consume the new state.

#### Review Triggers

Review this decision when a new deployment model, contract-versioning policy, or cross-domain compatibility strategy is introduced.

### 5.6 SYS-ADR-006 — Operational Evidence and Acceptance Traceability

**Status:** Proposed  
**Scope:** Cross-domain architecture and release evidence  
**Affected domains:** All domains

#### Context

Architecture decisions are useful only when their implementation can be verified. Milestone closure also requires evidence that the agreed scope and acceptance criteria have been met.

#### Proposed Decision

Every material system-level decision MUST identify the evidence required to demonstrate compliance.

Milestone acceptance MUST follow the applicable authoritative milestone dossier.

Domain-specific test evidence, infrastructure evidence, database migration evidence, and application security evidence MUST remain with their respective domain or milestone documentation.

This register MUST link to that evidence rather than duplicate detailed test results.

#### Rationale

This approach preserves traceability from architectural intent to implementation without creating multiple competing acceptance records.

#### Consequences

- System-level decisions identify verifiable outcomes.
- Domain registers identify implementation-specific validation.
- Milestone dossiers determine milestone closure.
- Evidence MUST identify the tested revision and relevant environment.
- Exceptions MUST be recorded and linked to an accountable owner.

#### Review Triggers

Review this decision if the project changes its release governance, evidence-retention policy, or milestone acceptance process.

## 6. Domain Decision Register Index

### 6.1 Frontend Decisions

**Domain:** Frontend  
**Scope owner:** Frontend architecture and implementation owners  
**Documentation root:** `docs/frontend/`

The frontend decision register MUST contain decisions limited to frontend architecture and implementation, including client structure, component organization, client state, frontend build configuration, presentation-layer dependencies, and frontend-specific performance and testing strategy.

Frontend decisions that alter system-level API contracts, authentication assumptions, or cross-domain ownership MUST reference the relevant system or protocol decision.

This document MUST NOT duplicate frontend implementation records.

The frontend decision register SHOULD provide:

- Stable frontend decision IDs.
- Decision status and date.
- Context and selected option.
- Rationale and consequences.
- Affected frontend milestones.
- Links to the authoritative frontend architecture.
- Links to cross-domain system decisions when applicable.

Canonical frontend milestone scope is defined by the authoritative dossiers under `docs/frontend/milestones/`.

### 6.2 Backend Decisions

**Domain:** Backend  
**Scope owner:** Backend architecture and implementation owners  
**Documentation root:** `docs/backend/`

The backend decision register MUST contain backend implementation decisions, including module wiring, service implementation, controller structure, worker execution, internal dependency management, application-level persistence integration, and backend testing strategy.

System-level module responsibilities remain governed by `docs/architecture/BACKEND_ARCHITECTURE.md`.

Backend implementation details remain governed by `docs/backend/architecture/BACKEND_ARCHITECTURE.md` and the relevant implementation documents.

API implementation decisions MUST align with `docs/backend/architecture/API_IMPLEMENTATION.md`. Wire behavior MUST align with `docs/protocol/API_CONTRACT.md`.

This document MUST NOT duplicate backend implementation records.

The backend decision register SHOULD provide:

- Stable backend decision IDs.
- Decision status and date.
- Context and selected option.
- Rationale and consequences.
- Affected backend milestones.
- Links to authoritative backend architecture documents.
- Links to cross-domain system decisions when applicable.

Canonical backend milestone scope is defined by the authoritative dossiers under `docs/backend/milestones/`.

### 6.3 Cloud Decisions

**Domain:** Cloud  
**Scope owner:** Cloud architecture and infrastructure owners  
**Documentation root:** `docs/cloud/`

The cloud decision register MUST contain infrastructure implementation decisions, including provider configuration, account layout, VPC design, managed service selection, infrastructure-as-code modules, deployment resources, scaling, capacity, cost controls, and cloud-specific security enforcement.

Product/system cloud topology remains governed by `docs/architecture/CLOUD_ARCHITECTURE.md`.

Concrete cloud implementation remains governed by `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

Cloud infrastructure security remains governed by `docs/cloud/architecture/SECURITY_ARCHITECTURE.md`.

This document MUST NOT duplicate cloud implementation records.

The cloud decision register SHOULD provide:

- Stable cloud decision IDs.
- Decision status and date.
- Context and selected option.
- Rationale and consequences.
- Affected cloud milestones.
- Links to authoritative cloud architecture documents.
- Links to cross-domain system decisions when applicable.

Canonical cloud milestone scope is defined by the authoritative dossiers under `docs/cloud/milestones/`.

### 6.4 Database Decisions

**Domain:** Database  
**Scope owner:** Database architecture and implementation owners  
**Documentation root:** `docs/database/`

The database decision register MUST contain database implementation decisions, including PostgreSQL schema organization, migration tooling, transaction strategy, isolation levels, RLS, indexes, partitioning, connection pooling, backup and restore, and database engine upgrades.

System database role and authority remain governed by `docs/architecture/DATABASE_ARCHITECTURE.md`.

PostgreSQL implementation remains governed by `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

This document MUST NOT duplicate database implementation records.

The database decision register SHOULD provide:

- Stable database decision IDs.
- Decision status and date.
- Context and selected option.
- Rationale and consequences.
- Affected database milestones.
- Links to authoritative database architecture documents.
- Links to cross-domain system decisions when applicable.

Canonical database milestone scope is defined by the authoritative dossiers under `docs/database/milestones/`.

### 6.5 Security Decisions Across Domains

Security decisions MUST be recorded in the register that owns the decision's primary subject.

Application security decisions belong to the applicable system security and security documentation.

Cloud infrastructure security decisions belong to the cloud security register and architecture.

Database access-control implementation decisions belong to the database decision register.

A cross-domain security decision that changes a product/system-level trust boundary or establishes a shared system-wide constraint MUST be recorded here and linked to the detailed domain decisions.

The same decision MUST NOT be copied into every domain register as an independent authoritative record.

## 7. Cross-Domain Decision Workflow

### 7.1 Proposal

A system-level decision proposal MUST identify:

- The problem or requirement.
- The domains affected.
- The relevant existing architecture.
- The available options.
- The proposed option and rationale.
- The main risks and consequences.
- The decision owner.
- The expected implementation and acceptance evidence.

A proposal MUST distinguish facts from assumptions.

### 7.2 Impact Assessment

Before acceptance, the proposer MUST identify material impacts on:

- System boundaries and ownership.
- API, event, or artifact contracts.
- Persistent data and migration compatibility.
- Cloud infrastructure and security.
- Application security.
- Reliability, recovery, and operations.
- Implementation cost and ongoing operating cost.
- Current and planned milestones.

Only affected domains need to provide detailed implementation analysis, but all material cross-domain impacts MUST be acknowledged.

### 7.3 Review

The review MUST include the system architecture owner and the owners of materially affected domains.

Security, data, or operational owners MUST participate when their authoritative requirements are affected.

Reviewers MUST evaluate whether the proposal belongs in this register or in a domain decision register.

A domain-only decision MUST be routed to the domain register rather than duplicated here.

### 7.4 Acceptance

A decision MAY be marked Accepted only after the authorized decision owner approves it.

Acceptance MUST identify the selected option and any conditions.

If the decision remains dependent on an unresolved critical condition, it MUST remain Proposed or explicitly record the condition preventing implementation.

### 7.5 Implementation

After acceptance, each affected domain MUST record its implementation-specific decisions in the appropriate domain register.

Implementation references SHOULD link back to the system-level decision ID.

A system-level decision MUST NOT be considered fully implemented solely because the decision record is accepted.

### 7.6 Verification

Verification MUST confirm that the implemented design satisfies the accepted decision.

Evidence MUST identify the relevant source revision, environment, and test or review result where applicable.

Milestone completion MUST still follow the authoritative milestone dossier.

### 7.7 Closure

A decision MAY be considered implemented when all required domain changes and verification evidence are complete.

The decision record SHOULD link to the relevant evidence and implementation references.

Closure MUST NOT imply that future changes no longer require review.

## 8. Relationship to Phases and Milestones

### 8.1 Canonical Phase Authority

`docs/planning/PHASES.md` is the authoritative definition of the canonical phases.

This document MUST NOT redefine phase descriptions, phase boundaries, or milestone scope.

System-level decisions MAY reference phases to indicate when a decision becomes relevant or when its implementation is expected to be validated.

### 8.2 Frozen Phase Model

The canonical phases are:

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

These names MUST be used exactly when phases are referenced in this register.

### 8.3 Frontend Milestone Index

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 |
| F-M02 | PROJECTS | P1 |
| F-M03 | BUILD & ARTIFACT | P2 |
| F-M04 | BOOKING | P4 |
| F-M05 | EXECUTION | P5 |
| F-M06 | LIVE | P7 |
| F-M07 | RESULTS | P7 |

Frontend milestone scope MUST be obtained from the authoritative dossiers under `docs/frontend/milestones/`.

### 8.4 Backend Milestone Index

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| B-M01 | CONTROL PLANE | P3 |
| B-M02 | ARTIFACT | P2-P3 |
| B-M03 | PLATFORM | P3 |
| B-M04 | BOOKING | P4 |
| B-M05 | EXECUTION | P5 |
| B-M06 | RESULTS | P6-P7 |
| B-M07 | PRODUCTION | P8 |

Backend milestone scope MUST be obtained from the authoritative dossiers under `docs/backend/milestones/`.

### 8.5 Database Milestone Index

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| DB-M01 | FOUNDATION | P0-P3 |
| DB-M02 | CORE DATA | P3 |
| DB-M03 | BOOKING DATA | P4 |
| DB-M04 | EXECUTION DATA | P5-P7 |

Database milestone scope MUST be obtained from the authoritative dossiers under `docs/database/milestones/`.

### 8.6 Cloud Milestone Index

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| C-M01 | FOUNDATION | P0 |
| C-M02 | DEVELOPMENT | P1-P3 |
| C-M03 | STAGING | P4-P7 |
| C-M04 | PRODUCTION | P8 |

Cloud milestone scope MUST be obtained from the authoritative dossiers under `docs/cloud/milestones/`.

### 8.7 Milestone Authority

The tables in this section are navigation and traceability aids. They MUST NOT replace the authoritative milestone dossiers.

A system-level decision MAY affect multiple milestones and domains.

Each affected milestone MUST apply its own acceptance criteria to the implementation work within its scope.

A decision's presence in a milestone reference does not automatically make the decision accepted or the milestone complete.

## 9. Change Coordination and Supersession

### 9.1 Changes to Accepted Decisions

An accepted decision MUST NOT be silently edited to express a materially different choice.

A material change MUST either:

- Create a new decision that supersedes the original; or
- Reopen the original decision through the documented review process when its identity and historical meaning remain unchanged.

The decision history MUST preserve the prior choice and the reason for changing it.

### 9.2 Domain Decisions That Affect System Constraints

If a domain implementation decision requires changing an accepted system-level constraint, the domain owner MUST raise a system-level proposal before treating the change as approved.

The domain register MAY record the implementation proposal, but MUST link to the unresolved system-level decision.

Implementation MUST NOT silently violate an accepted system-level decision.

### 9.3 System Decisions That Affect Domain Implementation

When an accepted system-level decision constrains a domain implementation, the affected domain owner MUST assess the impact and update the relevant domain decision register or architecture document.

The domain owner MUST record any implementation trade-offs, migration requirements, and tests needed to satisfy the system-level decision.

This document MUST NOT copy those implementation details.

### 9.4 Supersession

A superseding decision MUST:

- Reference the previous decision ID.
- Explain why the previous decision is no longer sufficient.
- State the new decision.
- Identify affected domains.
- Document migration or transition requirements.
- Link to updated architecture documents and domain decisions.

The prior decision MUST remain available for historical reference.

### 9.5 Conflicting Records

If two documents appear to contain conflicting decisions, the owners MUST determine which document is authoritative based on the ownership boundaries in Section 2.

The conflict MUST be resolved explicitly.

A copied description in a non-authoritative document MUST NOT override the designated decision record.

## 10. Review and Governance

### 10.1 Decision Ownership

Every system-level decision MUST have an accountable owner.

The owner is responsible for ensuring that the decision remains accurate, links to relevant implementation records, and is reviewed when its assumptions change.

Domain owners remain accountable for decisions within their domains.

### 10.2 Review Triggers

System-level decisions SHOULD be reviewed when:

- A foundational product requirement changes.
- A system boundary or ownership model changes.
- A new domain or major subsystem is introduced.
- A domain proposes a change that conflicts with an accepted system constraint.
- A security, reliability, or recovery assumption becomes invalid.
- A major compatibility requirement changes.
- A decision's consequences become materially different from those originally assessed.
- An authoritative milestone dossier identifies a blocker requiring an architecture change.

### 10.3 Periodic Review

The project SHOULD review active system-level decisions at major architecture and release checkpoints.

The review SHOULD identify:

- Decisions that remain valid.
- Decisions that need implementation references.
- Decisions with unresolved consequences.
- Decisions that should be superseded.
- Proposed decisions that are no longer relevant.
- Domain decisions that have exposed a missing system-level choice.

Periodic review MUST NOT be used to duplicate or reapprove every domain-level implementation decision.

### 10.4 Decision Quality

An accepted decision SHOULD be:

- Specific enough to guide implementation.
- Narrow enough to avoid unnecessary constraints.
- Explicit about assumptions.
- Clear about alternatives and rationale.
- Honest about trade-offs and unresolved risks.
- Verifiable through review, tests, or operational evidence.
- Traceable to the affected architecture and milestone documentation.

### 10.5 Governance Exceptions

Exceptions to an accepted system-level decision MUST be explicit.

An exception MUST identify the affected scope, rationale, owner, duration or review date, and required compensating measures.

An exception MUST NOT become an undocumented alternate architecture.

## 11. Decision Register Maintenance Checklist

### 11.1 Ownership

- [ ] Every system-level decision has one authoritative record.
- [ ] Domain implementation decisions remain in domain registers.
- [ ] Application security decisions link to the security authority.
- [ ] Cloud implementation decisions link to the cloud authority.
- [ ] Database implementation decisions link to the database authority.
- [ ] Backend implementation decisions link to the backend authority.
- [ ] Frontend implementation decisions link to the frontend authority.
- [ ] No duplicate domain ADR content is maintained here.

### 11.2 Record Quality

- [ ] Each accepted decision has a stable ID.
- [ ] Decision status and date are explicit.
- [ ] Context, decision, rationale, and consequences are recorded.
- [ ] Affected domains are identified.
- [ ] Related and superseded decisions are linked.
- [ ] Implementation references point to authoritative documents.
- [ ] Review triggers are defined.
- [ ] Rejected and withdrawn decisions include reasons.

### 11.3 Traceability

- [ ] Phase references use the canonical model in `docs/planning/PHASES.md`.
- [ ] Milestone references use the frozen canonical names and identifiers.
- [ ] Existing milestone dossiers remain authoritative for scope.
- [ ] Domain decisions link back to applicable system-level decisions.
- [ ] Acceptance evidence is linked rather than duplicated.
- [ ] Cross-domain changes identify affected owners.

### 11.4 Governance

- [ ] Proposed decisions are not presented as accepted constraints.
- [ ] Material changes preserve decision history.
- [ ] Superseded decisions identify their successors.
- [ ] Conflicts are resolved according to document ownership.
- [ ] Exceptions have an owner and review date.
- [ ] The register is reviewed when system assumptions change.

## 12. Definition of Done

The system-level decision register is ready for ongoing use when:

1. Its ownership boundary is explicit.
2. Cross-domain decisions have stable identifiers and clear status.
3. Every accepted system-level decision has an accountable owner.
4. Domain-specific decision registers are linked and remain authoritative for implementation details.
5. System architecture documents remain authoritative for current architecture and rationale.
6. Domain decisions that materially change system constraints are escalated for cross-domain review.
7. Supersession preserves decision history.
8. Phase and milestone references follow the frozen canonical model.
9. Milestone dossiers remain authoritative for milestone scope and acceptance.
10. The register provides traceability without duplicating domain ADR content.

This document owns product/system-level architectural decisions and the index to domain decision registers. Frontend, backend, cloud, database, security, and other domain implementation decisions MUST remain in their respective authoritative documents. All changes MUST preserve this ownership boundary.
