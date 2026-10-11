# Frontend Architecture Decision Register

**Document:** `docs/frontend/planning/DECISIONS.md`  
**Project:** Kritva RaaS  
**Status:** Frontend-specific architecture decision register  
**Audience:** Frontend engineers, frontend architecture owners, UX engineering, and reviewers  
**Normative language:** MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY express requirements.

## 1. Purpose

This document records architectural decisions specific to the Kritva RaaS frontend.

It provides a consistent record of frontend implementation choices, the context behind them, alternatives considered, consequences, and validation expectations.

The register is intended to help frontend engineers make consistent decisions while preserving the separation between frontend implementation, product/system architecture, backend implementation, protocol contracts, cloud infrastructure, and database implementation.

This document MUST contain only frontend-specific architectural decisions. Product-wide and cross-domain decisions MUST be recorded in `planning/DECISIONS.md` and referenced here when they constrain frontend behavior.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns frontend-specific architecture decision records, including decisions about:

- Frontend application structure and composition.
- UI component organization and reuse boundaries.
- Frontend routing and navigation implementation.
- Client-side state management.
- Frontend data-fetching and caching implementation.
- Frontend API client organization and integration patterns.
- Frontend handling of loading, empty, error, and retry states.
- Frontend form architecture and client-side validation presentation.
- Frontend accessibility implementation.
- Frontend styling, design-system implementation, and visual consistency.
- Frontend build tooling and dependency choices.
- Frontend testing strategy and test tooling.
- Frontend performance and bundle-size optimization.
- Frontend observability and client-side diagnostics.
- Frontend-specific browser compatibility and progressive enhancement.
- Frontend deployment integration where it does not change cloud architecture.
- Frontend-specific technical debt, migration, and compatibility decisions.

Each decision MUST be limited to a frontend concern or to the frontend implementation of a broader requirement.

### 2.2 Product-Wide Decision Ownership

`planning/DECISIONS.md` owns product/system-level architectural decisions and the index to domain decision registers.

A frontend decision MUST reference the product-wide register when it implements, depends on, or proposes changing a cross-domain architectural constraint.

This document MUST NOT independently redefine:

- Product-wide system boundaries.
- Cross-domain ownership.
- System-level security trust boundaries.
- API or event wire contracts.
- System-wide persistence authority.
- Product-wide deployment topology.
- Product-level business rules.
- Shared cross-domain compatibility requirements.

If a frontend proposal requires changing a product/system-level decision, the proposal MUST be raised for review in `planning/DECISIONS.md` before it is treated as an approved frontend architecture choice.

### 2.3 Other Document Ownership

| Concern | Authoritative document |
|---|---|
| Product/system-level decisions | `planning/DECISIONS.md` |
| Canonical phase definitions | `planning/PHASES.md` |
| Frontend architecture and implementation | Applicable architecture documents under `docs/frontend/` |
| Frontend-specific decisions | `docs/frontend/planning/DECISIONS.md` |
| Frontend milestone scope and acceptance | Authoritative dossiers under `docs/frontend/milestones/` |
| System backend modules and ownership | `docs/architecture/BACKEND_ARCHITECTURE.md` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| API wire contract | `docs/protocol/API_CONTRACT.md` |
| Event contract | `docs/protocol/EVENT_CONTRACT.md` |
| Artifact manifest and artifact semantics | `docs/protocol/ARTIFACT_MANIFEST.md` |
| System database role and authority | `docs/architecture/DATABASE_ARCHITECTURE.md` |
| PostgreSQL implementation architecture | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Product/system cloud topology | `docs/architecture/CLOUD_ARCHITECTURE.md` |
| Cloud implementation architecture | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Application security model and trust boundaries | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Cloud and infrastructure security | `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` |
| Cross-discipline milestone scope | Applicable authoritative dossiers under `docs/**/milestones/` |

A referenced directory identifies the document family responsible for the subject. The applicable document or milestone dossier remains authoritative for its scope.

### 2.4 Frontend Decision Versus Frontend Documentation

This register records why a frontend architecture choice was made and the consequences of that choice.

The frontend architecture documents describe the current architecture and its implementation constraints.

Frontend implementation guides describe how to perform a task.

Frontend milestone dossiers define milestone scope and acceptance criteria.

This register MUST NOT duplicate those documents. It SHOULD link to them when a decision materially affects their contents.

### 2.5 Explicit Non-Goals

This document MUST NOT become the authoritative home for:

- Product-wide architecture decisions.
- Backend implementation decisions.
- Cloud infrastructure decisions.
- Database implementation decisions.
- Application-wide authentication and authorization design.
- API, event, or artifact wire contracts.
- Product requirements or business policies.
- Detailed frontend task tracking.
- Milestone acceptance criteria.
- General coding guidelines that do not represent a consequential architecture choice.
- Operational runbooks.
- Complete architecture descriptions that belong in frontend architecture documents.

When content belongs elsewhere, this register MUST link to the authoritative owner rather than reproduce the content.

## 3. Frontend Decision Principles

### 3.1 One Authoritative Record

Every frontend architecture decision MUST have one authoritative record.

An accepted decision MUST NOT be independently re-created in a second document with different wording or status.

Related documents MAY summarize a decision when necessary, but MUST link to this register.

### 3.2 Narrow Scope

A frontend decision MUST state the problem and the scope it addresses.

It SHOULD avoid constraining unrelated components or future implementations unnecessarily.

A decision that affects only one component SHOULD NOT impose a product-wide architectural rule unless the wider impact is intentional and approved.

### 3.3 Explicit Trade-Offs

Decisions MUST document material trade-offs.

The rationale SHOULD explain why the selected option is preferable under the stated constraints.

A decision MUST NOT rely solely on popularity, familiarity, or personal preference when meaningful alternatives exist.

### 3.4 Reversibility

The register SHOULD identify whether a decision is easy to reverse or creates substantial migration cost.

High-cost decisions SHOULD receive stronger review and validation.

A reversible implementation detail SHOULD NOT be elevated into a permanent architectural constraint without a clear benefit.

### 3.5 Compatibility

Frontend decisions MUST preserve the applicable API, event, artifact, and product/system contracts.

A frontend implementation MAY introduce internal adapters or view models, but MUST NOT silently redefine a published contract.

### 3.6 Accessibility

Frontend architecture choices MUST consider accessibility implications.

Accessibility MUST NOT be deferred merely because the selected component library or styling mechanism makes it inconvenient.

### 3.7 Performance

Frontend decisions SHOULD consider user-perceived performance, bundle size, rendering behavior, network use, and memory use where relevant.

Performance claims SHOULD be supported by measurement or an explicit validation plan.

### 3.8 Security Boundary

Frontend controls MUST NOT be treated as the authoritative enforcement mechanism for application permissions.

Application security requirements are owned by `docs/architecture/SECURITY_ARCHITECTURE.md` and the applicable documents under `docs/security/`.

Frontend decisions MUST implement the approved security design without inventing a competing authorization model.

## 4. Decision Record Format

### 4.1 Required Fields

Every accepted frontend decision MUST include:

- **ID:** Stable, unique identifier.
- **Title:** Concise decision name.
- **Status:** Proposed, Accepted, Rejected, Superseded, or Withdrawn.
- **Date:** Date of the decision or latest status transition.
- **Context:** The problem, requirement, or constraint.
- **Decision:** The selected frontend-specific choice.
- **Rationale:** Why the choice is appropriate.
- **Alternatives:** Material alternatives considered.
- **Consequences:** Benefits, limitations, and obligations.
- **Affected areas:** Frontend modules, routes, components, or capabilities.
- **Related decisions:** IDs of decisions that constrain or depend on this decision.
- **References:** Links to relevant architecture documents, contracts, tests, and milestone dossiers.
- **Review triggers:** Conditions that would require reconsideration.

A proposed decision MAY have incomplete implementation evidence. Missing evidence MUST be resolved before implementation is declared complete.

### 4.2 Stable IDs

Frontend decision IDs MUST use the prefix `FE-ADR-` followed by a zero-padded numeric identifier.

Examples:

- `FE-ADR-001`
- `FE-ADR-002`
- `FE-ADR-003`

An ID MUST NOT be reused after rejection, withdrawal, or supersession.

Product/system decision IDs MUST remain under the convention used by `planning/DECISIONS.md`.

### 4.3 Status Definitions

| Status | Meaning |
|---|---|
| Proposed | Under discussion; not an approved implementation constraint |
| Accepted | Approved and authoritative until superseded or withdrawn |
| Rejected | Reviewed and not selected |
| Superseded | Replaced by a later decision |
| Withdrawn | No longer applicable and not replaced by a direct successor |

A proposed decision MUST NOT be described as an established frontend architecture requirement.

A rejected decision SHOULD record why it was not selected.

A superseded decision MUST identify its successor.

### 4.4 Decision Scope

The record MUST identify the affected frontend scope.

Examples of scope include a routing subsystem, a shared component layer, a client data-access layer, a form framework, or the frontend build pipeline.

A decision MUST distinguish a local implementation constraint from a rule intended to apply to the entire frontend.

### 4.5 Alternatives

Material alternatives SHOULD be documented.

The record SHOULD explain why each major alternative was accepted or rejected.

A decision MAY omit an extensive alternative analysis when the constraints leave only one practical option, but the constraints MUST be stated.

### 4.6 Consequences

Consequences MUST identify material effects on:

- Implementation complexity.
- Maintainability.
- Testability.
- Accessibility.
- Performance.
- Browser compatibility.
- Dependency management.
- Developer workflow.
- Migration cost.
- Contract compatibility.
- Security assumptions.

The record SHOULD identify follow-up work needed to realize the intended benefits.

## 5. Frontend Decision Index

### 5.1 Index Purpose

The index provides a discoverable entry point for frontend architecture decisions.

Only decisions that have actually been proposed or approved by the project may appear as active records.

The initial entries below are proposed placeholders for review. They do not imply that the listed choices have already been approved or implemented.

### 5.2 Initial Register

| ID | Decision title | Status | Scope | Authoritative record |
|---|---|---|---|---|
| FE-ADR-001 | Frontend architecture ownership and decision governance | Proposed | Frontend documentation and decision workflow | This document, Section 6 |
| FE-ADR-002 | Frontend application composition and module boundaries | Proposed | Application composition and module organization | This document, Section 7 |
| FE-ADR-003 | Client-side state ownership and lifecycle | Proposed | UI state and server-derived state | This document, Section 8 |
| FE-ADR-004 | Frontend API integration and data-fetching boundaries | Proposed | Client data-access implementation | This document, Section 9 |
| FE-ADR-005 | Shared component and design-system boundaries | Proposed | UI components, styling, and accessibility | This document, Section 10 |
| FE-ADR-006 | Frontend testing and quality gates | Proposed | Frontend verification and CI quality controls | This document, Section 11 |
| FE-ADR-007 | Frontend performance and observability strategy | Proposed | Runtime performance and client diagnostics | This document, Section 12 |
| FE-ADR-008 | Coding-agent provider adapters and agent session UI | Proposed | Local Runtime adapters, agent IPC, session and diff-review UI | This document, Section 13 |

Each proposed record MUST be reviewed and either completed, rejected, withdrawn, or removed from the active index.

The register MUST NOT mark a placeholder Accepted merely to make the index appear complete.

### 5.3 Index Maintenance

When a decision is accepted, the index MUST link to its complete record and identify its status.

When a decision is superseded, the index MUST identify the successor.

When a frontend decision depends on a product/system decision, the index or full record SHOULD link to the corresponding record in `planning/DECISIONS.md`.

The index MUST NOT duplicate product/system-level decision content.

## 6. FE-ADR-001 — Frontend Architecture Ownership and Decision Governance

**Status:** Proposed  
**Scope:** Frontend architecture records and frontend-specific decisions

### 6.1 Context

Frontend architecture decisions can be duplicated across planning files, architecture documents, implementation notes, and milestone dossiers.

Without explicit ownership, it becomes unclear whether a statement represents an approved decision, a proposed approach, an implementation detail, or a milestone requirement.

### 6.2 Proposed Decision

Frontend-specific architectural decisions MUST be recorded in this register.

Product/system-level decisions MUST be recorded in `planning/DECISIONS.md`.

Current frontend architecture MUST be described in the applicable frontend architecture documents.

Frontend milestone scope and acceptance MUST remain in the authoritative dossiers under `docs/frontend/milestones/`.

### 6.3 Rationale

This separation preserves frontend decision history while allowing implementation documents to remain focused on the current design.

It also avoids creating a frontend register that competes with the product-wide decision register.

### 6.4 Consequences

- Frontend decisions require stable IDs and explicit status.
- Cross-domain decisions must be referred to the product-wide register.
- Architecture documents MUST link to relevant decisions.
- Milestone dossiers remain authoritative for milestone acceptance.
- Superseded decisions remain discoverable.

### 6.5 Review Triggers

Review this decision if the frontend documentation structure, decision workflow, or frontend ownership model changes materially.

## 7. FE-ADR-002 — Frontend Application Composition and Module Boundaries

**Status:** Proposed  
**Scope:** Frontend application composition and internal module organization

### 7.1 Context

As frontend capabilities grow, components and features can become tightly coupled. Shared state, cross-feature imports, and duplicate infrastructure code can make independent development and testing difficult.

### 7.2 Proposed Decision

The frontend architecture MUST define explicit module and composition boundaries.

A frontend module SHOULD expose a deliberate public interface rather than allow unrestricted imports into its internal implementation.

Application composition, routing integration, shared infrastructure, and feature-specific behavior SHOULD have distinct responsibilities.

The detailed module structure MUST be maintained in the authoritative frontend architecture document rather than duplicated in this decision record.

### 7.3 Rationale

Explicit module boundaries improve maintainability, reduce accidental coupling, and make ownership clearer.

### 7.4 Consequences

- Module dependencies SHOULD be directed and reviewable.
- Shared utilities MUST have a clear owner.
- Circular dependencies SHOULD be prevented through architecture checks or review.
- Feature modules MUST NOT independently reimplement shared infrastructure without a documented reason.
- Composition changes MUST consider route loading, state lifetime, and testability.

### 7.5 Alternatives

Possible approaches include a flat component structure, feature-oriented modules, or a layered module structure.

The accepted structure MUST be selected based on the actual application, team ownership, and dependency requirements.

### 7.6 Review Triggers

Review this decision if the frontend becomes a multi-application system, module ownership changes materially, or cross-feature coupling becomes a recurring maintenance problem.

## 8. FE-ADR-003 — Client-Side State Ownership and Lifecycle

**Status:** Proposed  
**Scope:** Frontend state implementation

### 8.1 Context

Frontend applications manage several kinds of state, including transient interaction state, URL state, server-derived data, and user preferences.

Treating all state as one undifferentiated store can introduce unnecessary synchronization, stale data, and unclear ownership.

### 8.2 Proposed Decision

Frontend state MUST have an explicit owner and lifecycle.

The implementation SHOULD distinguish:

- Local component interaction state.
- Shared state required by multiple components.
- Server-derived state and its cache.
- URL and navigation state.
- Persisted client preferences.
- Ephemeral workflow state.

The specific state-management library and implementation conventions MUST be documented in the frontend architecture or domain decision register once selected.

### 8.3 Rationale

Explicit state ownership reduces unnecessary global state and makes invalidation, synchronization, and testing more predictable.

### 8.4 Consequences

- State SHOULD live at the narrowest scope that satisfies its consumers.
- Server-derived data SHOULD NOT be copied into unrelated local stores without a clear reason.
- URL state SHOULD be used when a state must be bookmarkable, shareable, or restored through navigation.
- Persisted client state MUST have a defined versioning and invalidation strategy where applicable.
- Sensitive information MUST NOT be persisted in browser storage without an approved security design.

### 8.5 Alternatives

Alternatives may include local component state, context-based sharing, a centralized store, URL-driven state, or a dedicated server-state cache.

The chosen mechanism MUST reflect the state lifetime and consistency requirements rather than treating a single library as the answer to every state problem.

### 8.6 Review Triggers

Review this decision if state synchronization becomes unreliable, global state grows without clear ownership, or client persistence introduces material security or compatibility concerns.

## 9. FE-ADR-004 — Frontend API Integration and Data-Fetching Boundaries

**Status:** Proposed  
**Scope:** Frontend data-access implementation

### 9.1 Context

Direct network calls embedded throughout UI components can duplicate error handling, make tests difficult, and couple presentation code to transport details.

### 9.2 Proposed Decision

Frontend API access SHOULD be implemented through a consistent data-access layer.

UI components SHOULD depend on frontend-facing service functions, hooks, or equivalent interfaces rather than independently constructing transport behavior.

The data-access layer MUST conform to `docs/protocol/API_CONTRACT.md`.

Backend implementation and API behavior remain owned by the applicable backend architecture and protocol documents.

### 9.3 Rationale

A consistent data-access boundary makes request behavior, cancellation, error handling, caching, and contract evolution easier to manage.

### 9.4 Consequences

- Request construction SHOULD be centralized where reuse or consistency requires it.
- API response handling MUST respect the published contract.
- Frontend view models MAY adapt response structures for presentation without redefining the wire contract.
- Request cancellation and stale-response handling SHOULD be considered for navigation-sensitive operations.
- Retry behavior MUST account for whether the operation is safe to repeat.
- Error presentation MUST distinguish recoverable user-facing conditions from unexpected failures.

### 9.5 Contract Changes

A frontend decision MUST NOT independently alter API routes, request schemas, response schemas, or error semantics.

A required wire-contract change MUST be reviewed with the API contract owner and, when it changes a product/system-level constraint, referenced in `planning/DECISIONS.md`.

### 9.6 Review Triggers

Review this decision if network behavior is duplicated across features, contract changes repeatedly break consumers, or client-side caching creates correctness issues.

## 10. FE-ADR-005 — Shared Components, Design System, and Accessibility

**Status:** Proposed  
**Scope:** Frontend presentation architecture

### 10.1 Context

Repeated UI patterns can diverge in behavior, accessibility, styling, and maintenance. Excessive abstraction can also make feature-specific interfaces difficult to implement.

### 10.2 Proposed Decision

The frontend SHOULD maintain shared components for stable, repeated interaction patterns and visual primitives.

Shared components MUST have clear public interfaces and documented accessibility expectations.

A component SHOULD be shared when doing so reduces duplication without creating inappropriate coupling between unrelated features.

### 10.3 Rationale

A coherent component system improves consistency and makes accessibility and visual improvements reusable.

### 10.4 Consequences

- Shared components MUST have a clear owner.
- Component APIs SHOULD expose only the configuration needed by their intended consumers.
- Accessibility behavior MUST be validated as part of component testing.
- Feature-specific composition SHOULD remain in the feature module when it does not represent a stable reusable primitive.
- Shared component changes MUST consider compatibility across existing consumers.

### 10.5 Styling Decisions

The styling approach, token model, theme handling, and component-library selection MUST be recorded in the applicable frontend decision record once selected.

This register MUST NOT duplicate the complete design-system specification.

### 10.6 Accessibility

Shared interactive components SHOULD provide appropriate keyboard behavior, focus management, semantic roles, accessible names, and state announcements.

Accessibility behavior MUST be tested rather than inferred from visual appearance alone.

### 10.7 Review Triggers

Review this decision if shared components become difficult to evolve, accessibility defects recur across features, or styling and interaction behavior diverge materially.

## 11. FE-ADR-006 — Frontend Testing and Quality Gates

**Status:** Proposed  
**Scope:** Frontend verification strategy

### 11.1 Context

Frontend defects may arise from component behavior, state transitions, API integration, navigation, browser differences, accessibility, and build configuration.

A test strategy limited to one level may leave important user-facing behavior unverified.

### 11.2 Proposed Decision

The frontend MUST define a layered verification strategy appropriate to its architecture.

The strategy SHOULD distinguish:

- Unit tests for isolated logic.
- Component tests for UI behavior.
- Integration tests for feature interactions and data access.
- End-to-end tests for critical user workflows.
- Accessibility checks.
- Build and static-analysis checks.
- Performance checks where relevant.

The exact toolchain MUST be maintained in the frontend architecture or frontend decision register.

### 11.3 Rationale

Layered testing balances rapid feedback with confidence in integrated user behavior.

### 11.4 Consequences

- Tests MUST verify meaningful behavior rather than implementation details alone.
- Critical workflows SHOULD have end-to-end coverage.
- Shared components SHOULD have reusable behavioral tests.
- API integration tests MUST respect the published wire contract.
- Flaky tests MUST be investigated rather than permanently ignored.
- Test data MUST be isolated and reproducible.

### 11.5 Quality Gates

The frontend CI pipeline SHOULD validate formatting, linting, type checking where applicable, tests, and production builds.

Mandatory checks MUST have clear failure behavior.

Exceptions MUST be explicit and reviewed.

### 11.6 Review Triggers

Review this decision if test feedback becomes too slow, critical regressions escape repeatedly, or the testing strategy no longer matches the frontend architecture.

## 12. FE-ADR-007 — Frontend Performance and Observability Strategy

**Status:** Proposed  
**Scope:** Browser-side performance and diagnostics

### 12.1 Context

Frontend performance depends on network behavior, JavaScript execution, rendering, asset delivery, data volume, and client device capability.

Without measurement, optimization can focus on the wrong bottleneck. Without diagnostics, production-only client failures can be difficult to reproduce.

### 12.2 Proposed Decision

Frontend performance SHOULD be measured using representative user journeys and appropriate browser-side metrics.

Client-side observability SHOULD support diagnosis of unexpected failures without collecting unnecessary sensitive information.

The implementation MUST follow the approved product security and privacy requirements.

### 12.3 Rationale

Measurement provides evidence for prioritizing optimization, while carefully designed diagnostics reduce the time required to identify client-side defects.

### 12.4 Consequences

- Bundle size SHOULD be tracked where it materially affects loading performance.
- Large routes or features SHOULD consider lazy loading when it improves user-perceived performance.
- Rendering and data-fetching behavior SHOULD be measured before major optimization work.
- Client errors SHOULD include useful context without exposing secrets or unnecessary personal data.
- Correlation identifiers MAY be propagated where the system contract supports them.
- Performance budgets MAY be introduced when baseline measurements and product requirements justify them.

### 12.5 Review Triggers

Review this decision if user-perceived performance regresses, client diagnostics are insufficient for incident investigation, or observability introduces material privacy or cost concerns.

## 13. FE-ADR-008 — Coding-Agent Provider Adapters and Agent Session UI

**Status:** Proposed  
**Scope:** Studio UI and Rust Local Runtime implementation of coding-agent integration  
**Implements:** SYS-ADR-007 (`planning/DECISIONS.md`); architecture in `docs/architecture/CODING_AGENT_INTEGRATION.md`

### 13.1 Context

Studio must support Claude Code and OpenAI Codex as optional coding agents (PRI-1), and later other providers. Provider CLIs differ in sign-in, permission, sandbox, output and MCP behaviour, and they change frequently.

### 13.2 Proposed Decision

- Provider integration MUST live in Rust adapters behind one provider-neutral trait in the Local Runtime. React MUST NOT reference provider-specific flags, binaries or output formats.
- React MUST interact only through the typed `agent.*` IPC commands and events. There MUST NOT be a generic command-execution IPC.
- Session state MUST be held in a dedicated agent-session store that is separate from project, build and server-derived state (FE-ADR-003). It MUST be scoped to the active project.
- Agent changes MUST be produced in a staging workspace and presented as change sets; the UI MUST NOT offer a mode that writes the working tree directly in the first release.
- Diff review MUST use a shared diff-viewer component that supports per-file and per-hunk accept or reject, and that is accessible by keyboard and screen reader (FE-ADR-005).
- Every agent UI surface MUST handle all provider statuses (`AVAILABLE`, `NOT_INSTALLED`, `NOT_AUTHENTICATED`, `UNSUPPORTED_VERSION`, `DISABLED_BY_POLICY`, `ERROR`) without blocking non-agent workflows.
- A mock provider adapter MUST exist, and MUST be used in component, integration and end-to-end tests (FE-ADR-006).

### 13.3 Rationale

Keeping provider logic in Rust preserves the process-security boundary and lets adapter changes ship without UI redesign.

### 13.4 Consequences

- Each new provider is an adapter plus contract-test evidence, not a UI feature.
- UI copy for consent and disclosure is versioned so that consent can be requested again when it changes.
- An adapter compatibility matrix (provider CLI version to supported modes) is maintained with the Local Runtime.

### 13.5 Alternatives

- Embedding provider SDKs in React: rejected, because it breaks the process and credential boundary.
- Running agents in the cloud: rejected by SYS-ADR-007, because it breaks the source-privacy guarantee.

### 13.6 Review Triggers

Review this decision if a provider requires an in-process SDK instead of a CLI, if adapter maintenance cost becomes excessive, or if a third provider is added.

## 14. Domain-Specific Decision Workflow

### 14.1 Proposal

A frontend decision proposal MUST identify:

- The affected frontend capability.
- The problem or requirement.
- Relevant current architecture.
- Constraints imposed by product/system decisions.
- Material alternatives.
- The proposed option.
- Expected consequences.
- Validation requirements.
- The decision owner.

A proposal MUST distinguish a technical constraint from a preference.

### 14.2 Review

The review MUST include the frontend owner responsible for the affected area.

Other domain owners SHOULD participate when the proposal affects their contracts, dependencies, or implementation responsibilities.

A product/system decision MUST be escalated to `planning/DECISIONS.md` when the proposal would change a cross-domain architectural constraint.

### 14.3 Acceptance

A decision MAY be marked Accepted only after the authorized frontend owner approves it.

Acceptance MUST identify the selected option and material conditions.

If the choice depends on unresolved product/system approval, it MUST remain Proposed until that approval is obtained.

### 14.4 Implementation

Implementation MUST follow the accepted decision or record a justified deviation for review.

The relevant frontend architecture document SHOULD be updated to describe the resulting current architecture.

The decision record MUST NOT become a substitute for implementation instructions.

### 14.5 Verification

Verification MUST confirm that the implemented approach satisfies the decision's intended outcome.

Evidence MAY include tests, measurements, architecture checks, or reviewed implementation references.

Milestone completion MUST continue to follow the authoritative milestone dossier.

### 14.6 Closure

A frontend decision MAY be marked implemented when the implementation and required validation are complete.

The record SHOULD link to the implementation revision or relevant evidence.

Implementation completion does not prevent a future decision from superseding the choice.

## 15. Relationship to Phases and Milestones

### 15.1 Phase Authority

`planning/PHASES.md` is the canonical source for phase definitions.

This register MUST NOT redefine the phases or use phase references to expand milestone scope.

Frontend decisions MAY reference phases to describe expected applicability or timing.

### 15.2 Canonical Phases

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

### 15.3 Frontend Milestones

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 |
| F-M02 | PROJECTS | P1 |
| F-M03 | BUILD & ARTIFACT | P2 |
| F-M04 | BOOKING | P4 |
| F-M05 | EXECUTION | P5 |
| F-M06 | LIVE | P7 |
| F-M07 | RESULTS | P7 |

Frontend milestone scope and acceptance MUST be taken from the authoritative dossiers under `docs/frontend/milestones/`.

### 15.4 Cross-Domain Milestone References

Frontend decisions MAY affect backend, database, or cloud implementation milestones.

When a decision affects multiple domains, the record SHOULD identify those dependencies and link to the relevant authoritative dossiers.

This register MUST NOT reproduce backend, database, or cloud milestone scope.

The relevant domain dossier remains authoritative for its acceptance criteria.

### 15.5 Milestone Traceability

When a frontend decision is required to deliver a milestone, the milestone dossier SHOULD reference the decision ID.

When a milestone implementation changes an accepted decision, the decision record MUST be reviewed and updated through the defined workflow.

A decision's presence in a milestone dossier does not automatically make it accepted or implemented.

## 16. Change Control and Supersession

### 16.1 Changes to Accepted Decisions

An accepted decision MUST NOT be silently edited to represent a materially different choice.

A material change MUST create a successor decision or reopen the existing record through an explicit review process when its identity and historical meaning remain unchanged.

The record MUST preserve the previous decision and explain the change.

### 16.2 Supersession

A superseding decision MUST:

- Have a new stable ID.
- Reference the decision it supersedes.
- Explain why the prior decision is no longer appropriate.
- State the replacement choice.
- Identify affected frontend areas.
- Document migration and compatibility implications.
- Link to updated architecture documents and tests.

The previous record MUST remain available for historical traceability.

### 16.3 Rejected Decisions

A rejected decision MUST remain distinguishable from an accepted decision.

The rejection reason SHOULD be recorded so that future proposals can reuse the prior analysis.

A rejected ID MUST NOT be reused.

### 16.4 Withdrawn Decisions

A decision MAY be withdrawn when its context no longer applies and no direct successor is required.

The withdrawal MUST state why the decision is no longer relevant.

### 16.5 Conflicting Records

If a frontend architecture document conflicts with an accepted frontend decision, the frontend owner MUST resolve the inconsistency.

If a frontend decision conflicts with a product/system decision, the product/system decision remains authoritative until formally changed.

A copied description in another document MUST NOT override the authoritative decision record.

## 17. Review and Maintenance

### 17.1 Decision Ownership

Every frontend decision MUST have an accountable owner.

The owner is responsible for the decision's status, rationale, references, and review triggers.

The owner SHOULD ensure that implementation documents reflect the accepted architecture without copying the full decision record.

### 17.2 Review Triggers

Frontend decisions SHOULD be reviewed when:

- Frontend module boundaries change materially.
- A major dependency or framework change is proposed.
- A client-state strategy creates recurring consistency problems.
- A published API contract changes.
- Accessibility defects reveal a shared architectural weakness.
- Browser compatibility requirements change.
- Performance measurements invalidate prior assumptions.
- A product/system decision changes.
- A milestone dossier identifies a blocker requiring a frontend architecture change.

### 17.3 Periodic Review

The frontend decision register SHOULD be reviewed at major frontend architecture and release checkpoints.

The review SHOULD identify:

- Decisions that remain valid.
- Decisions that need implementation references.
- Decisions that should be superseded.
- Proposed decisions that are no longer relevant.
- Implementation deviations that need formal review.
- Frontend decisions that have exposed a missing product/system decision.

Periodic review MUST NOT become a duplicate review of every implementation detail.

### 17.4 Decision Quality

A decision SHOULD be:

- Specific and actionable.
- Narrowly scoped.
- Clear about assumptions.
- Honest about alternatives and trade-offs.
- Verifiable through tests or review.
- Traceable to affected frontend architecture.
- Consistent with product/system and protocol contracts.

### 17.5 Exceptions

A deviation from an accepted frontend decision MUST be documented when it materially affects architecture or compatibility.

The exception MUST identify the scope, rationale, owner, and review date.

A temporary deviation MUST NOT silently become the permanent implementation.

## 18. Frontend Decision Register Checklist

### 18.1 Ownership

- [ ] Frontend-specific decisions are recorded here.
- [ ] Product/system decisions link to `planning/DECISIONS.md`.
- [ ] Frontend architecture documents describe the current design.
- [ ] Frontend milestone dossiers remain authoritative for acceptance.
- [ ] Backend, cloud, and database implementation decisions remain in their domain registers.
- [ ] API and event wire contracts remain in their protocol documents.
- [ ] No product-wide ADR content has been duplicated.

### 18.2 Record Quality

- [ ] Every accepted decision has a stable ID.
- [ ] Status and date are explicit.
- [ ] Context, decision, rationale, and consequences are recorded.
- [ ] Material alternatives are documented.
- [ ] Affected frontend areas are identified.
- [ ] Related decisions and architecture documents are linked.
- [ ] Review triggers are defined.
- [ ] Superseded decisions identify their successors.

### 18.3 Implementation and Verification

- [ ] Accepted decisions are reflected in current frontend architecture documents.
- [ ] Required implementation work is traceable.
- [ ] Validation criteria are explicit.
- [ ] Evidence links identify relevant tests or implementation revisions.
- [ ] Deviations are reviewed.
- [ ] Contract compatibility is preserved.
- [ ] Accessibility, performance, and security implications are considered where applicable.

### 18.4 Phase and Milestone Traceability

- [ ] Phase references use the canonical model in `planning/PHASES.md`.
- [ ] Frontend milestone identifiers and names use the frozen canonical model.
- [ ] Milestone scope is obtained from authoritative frontend milestone dossiers.
- [ ] Cross-domain impacts link to the relevant domain dossiers.
- [ ] No milestone acceptance criteria are duplicated in this register.

## 19. Definition of Done

The frontend decision register is ready for ongoing use when:

1. Its frontend-only ownership boundary is explicit.
2. Product/system-level decisions are referenced through `planning/DECISIONS.md`.
3. Frontend decisions have stable IDs, statuses, owners, and review triggers.
4. Current frontend architecture remains documented in the appropriate architecture documents.
5. API, event, artifact, and product/system contracts remain authoritative in their designated documents.
6. Domain-specific implementation choices are not duplicated here.
7. Decision history and supersession relationships remain traceable.
8. Frontend milestone scope remains governed by the authoritative dossiers.
9. Phase and milestone references use the frozen canonical model.
10. Decisions can be verified without turning this register into a task tracker or implementation manual.

This document owns frontend-specific architecture decisions only. Product-wide decisions remain owned by `planning/DECISIONS.md`, and all other domain decisions remain in their respective authoritative registers and architecture documents. All changes MUST preserve this ownership boundary.
