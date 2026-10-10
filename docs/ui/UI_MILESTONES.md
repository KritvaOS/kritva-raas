# Kritva RaaS UI Delivery Milestones

## 1. Purpose

This document defines the user interface delivery milestones for Kritva RaaS. It establishes the screens, design deliverables, review gates, API dependencies, integration expectations, and acceptance evidence required to deliver the UI incrementally.

The UI milestone sequence follows the frozen frontend milestone model:

- F-M01 STUDIO FOUNDATION
- F-M02 PROJECTS
- F-M03 BUILD & ARTIFACT
- F-M04 BOOKING
- F-M05 EXECUTION
- F-M06 LIVE
- F-M07 RESULTS

This document is the UI delivery coordination plan. It does not replace the authoritative frontend milestone dossiers, frontend task backlog, backend API contracts, security requirements, or canonical phase definition.

The intended outcomes are:

- a coherent user experience across the Kritva RaaS workflow
- progressive delivery of useful screens
- explicit backend API and authorization dependencies
- predictable design and implementation reviews
- clear acceptance criteria for every milestone
- consistent navigation, loading, error, empty, and recovery states
- traceable delivery evidence for implementation and release reviews

## 2. Canonical References

| Concern | Authoritative source |
|---|---|
| Canonical phase definitions | `docs/planning/PHASES.md` |
| Frontend milestone scope | `docs/frontend/milestones/` |
| UI milestone delivery plan | `docs/ui/UI_MILESTONES.md` |
| Frontend task backlog | `docs/frontend/planning/FRONTEND_TASKS.md` |
| Frontend roadmap | `docs/frontend/planning/FRONTEND_ROADMAP.md` |
| Backend milestone scope | `docs/backend/milestones/` |
| Backend task backlog | `docs/backend/planning/BACKEND_TASKS.md` |
| Backend roadmap | `docs/backend/planning/BACKEND_ROADMAP.md` |
| API contracts | `docs/protocol/` |
| Database milestone scope | `docs/database/milestones/` |
| Database roadmap | `docs/database/planning/DATABASE_ROADMAP.md` |
| Cloud milestone scope | `docs/cloud/milestones/` |
| Security requirements | `docs/security/` |
| Accessibility requirements | `docs/ui/UI_ACCEPTANCE_CRITERIA.md` |
| UI design system | `docs/ui/UI_DESIGN_SYSTEM.md` |
| UI navigation model | `docs/ui/UI_SPECIFICATION.md` |
| UI acceptance tracking | `docs/tracking/` |

If a referenced file does not yet exist, its creation must be tracked as a separate documentation task rather than treated as completed evidence.

The existing milestone dossiers under `docs/**/milestones/` are authoritative for their respective milestone scopes.

`docs/planning/PHASES.md` is the sole canonical definition of phase names and boundaries. This document records UI delivery mapping and does not redefine the phases.

## 3. Frozen Frontend Milestone Mapping

| Milestone | Canonical name | Phase mapping | Primary UI outcome |
|---|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 | Application shell, design system, identity-aware entry, and initial Studio experience |
| F-M02 | PROJECTS | P1 | Project discovery, creation, selection, and project context |
| F-M03 | BUILD & ARTIFACT | P2 | Build workflow, build feedback, artifact inspection, and artifact readiness |
| F-M04 | BOOKING | P4 | Resource discovery, availability, booking, quote, and credit confirmation |
| F-M05 | EXECUTION | P5 | Job submission, execution status, command feedback, and recovery-aware execution controls |
| F-M06 | LIVE | P7 | Live session entry, connection state, telemetry presentation, and operator awareness |
| F-M07 | RESULTS | P7 | Result discovery, files, metrics, comparisons, and execution history |

The phase mapping in this table is frozen. Phase definitions remain in `docs/planning/PHASES.md`.

## 4. UI Delivery Principles

### 4.1 Progressive delivery

Each milestone must deliver a coherent, reviewable increment. A milestone must not be considered complete merely because its screens exist.

A deliverable includes:

- user-visible screens
- navigation and route behavior
- design-system compliance
- API integration or explicitly documented mock boundaries
- loading, empty, error, and retry states
- authorization-aware behavior
- accessibility checks
- automated tests
- review evidence
- updated documentation

### 4.2 Backend state is authoritative

The UI displays and requests changes to backend-owned state. It must not independently determine whether a booking is confirmed, a Job is accepted, a Run has started, a Result is final, or a resource is safe to use.

### 4.3 Preserve domain distinctions

The interface must preserve the distinction between:

- a Project and an Artifact
- a Build and a successfully validated Artifact
- a Booking and an Execution
- a Job and a Run
- a Live session and an execution lifecycle
- a Result and the files associated with that Result

A retry must not silently imply that the original operation was cancelled or replaced.

### 4.4 Explicit user feedback

Every operation that can take meaningful time must communicate its current state. Every operation that can fail must explain the failure and provide a safe next step where possible.

### 4.5 Design consistency

Screens must reuse approved components, typography, spacing, color tokens, form conventions, status representations, and interaction patterns.

### 4.6 Reviewability

Each milestone must provide evidence that reviewers can inspect without relying solely on verbal confirmation or screenshots of a happy path.

## 5. Milestone Lifecycle and Review Gates

Every milestone uses the following review gates.

| Gate | Name | Required evidence |
|---|---|---|
| G1 | Scope review | Screens, user journeys, and exclusions confirmed |
| G2 | Design review | Layouts, interaction states, navigation, and accessibility reviewed |
| G3 | Contract review | Required APIs, request/response schemas, authorization, and error behavior identified |
| G4 | Implementation review | Screens implemented, components reused, and tests added |
| G5 | Integration review | UI behavior verified against the required backend contracts |
| G6 | Acceptance review | Acceptance criteria passed and known limitations recorded |

A gate may be marked not applicable only with a recorded rationale.

### 5.1 Gate ownership

| Review area | Accountable role |
|---|---|
| UI scope and user journeys | Product/UI Lead |
| Visual design and interaction consistency | UI/UX Designer |
| Frontend architecture | Frontend Lead |
| API contract readiness | Backend Lead |
| Data consistency assumptions | Backend and Database Leads |
| Authorization and privacy | Security Reviewer |
| Accessibility | UI/UX Designer and Frontend Lead |
| End-to-end workflow acceptance | Product/Integration Lead |

### 5.2 Review outcomes

Each gate records one of the following outcomes:

- **PASS:** Required evidence is complete and acceptance criteria are satisfied.
- **PASS WITH ACTIONS:** No blocking issue remains; non-blocking actions have owners and due dates.
- **BLOCKED:** A required dependency or acceptance condition is unmet.
- **NOT APPLICABLE:** The gate is demonstrably outside the milestone scope, with rationale recorded.

A blocked gate prevents milestone acceptance unless the authoritative milestone dossier explicitly defines an approved exception.

## 6. F-M01 STUDIO FOUNDATION

**Phase mapping:** P0-P1.

**Purpose:** Establish the application shell, design foundation, primary navigation, and identity-aware entry into Kritva RaaS.

**Authoritative scope:** The F-M01 STUDIO FOUNDATION dossier under `docs/frontend/milestones/`.

### 6.1 Screens delivered

| Screen or surface | Delivery expectation |
|---|---|
| Application entry | Initial loading, service availability, and entry routing |
| Sign-in and identity entry | Identity-provider integration or an explicitly scoped development substitute |
| Access-denied state | Clear explanation without exposing protected resource details |
| Studio landing page | Product orientation and available user actions |
| Global navigation | Consistent access to Projects and milestone-appropriate destinations |
| User/account menu | Account identity and supported account actions |
| Global notifications | Success, warning, and error feedback |
| Not-found page | Recovery navigation for invalid routes |
| Service-unavailable page | Clear distinction between service unavailability and an empty dataset |
| Responsive shell | Layout behavior across supported viewport sizes |

### 6.2 Design deliverables

- Application information architecture.
- Initial navigation map.
- Design tokens for color, typography, spacing, borders, and elevation.
- Base button, input, form, dialog, notification, table, and status components.
- Shared page layout and content-width conventions.
- Responsive layout rules.
- Keyboard navigation and focus conventions.
- Initial accessibility review.
- Error, empty, loading, and disabled-state patterns.

### 6.3 Backend and platform dependencies

| Dependency | Requirement |
|---|---|
| `B-M01 CONTROL PLANE` | Identity, session, authorization, and service-level API contracts as required by the dossier |
| `C-M01 FOUNDATION` | Initial deployment and configuration assumptions |
| `C-M02 DEVELOPMENT` | Development environment and integration configuration when needed |
| Security requirements | Session handling, authorization behavior, and safe error presentation |

UI work may use clearly identified development substitutes where allowed, but production acceptance requires the appropriate real integration.

### 6.4 Review gates

- G1: Entry journey, shell scope, and navigation agreed.
- G2: Design tokens, shared components, and responsive rules reviewed.
- G3: Identity and service contracts documented.
- G4: Shell, route guards, and shared states implemented and tested.
- G5: Identity, denied-access, and unavailable-service scenarios verified.
- G6: Accessibility, navigation, and acceptance evidence reviewed.

### 6.5 Acceptance criteria

- Users can reach the supported entry points.
- Protected routes do not expose protected data without authorization.
- Navigation is consistent across the delivered shell.
- Loading, empty, unavailable, and access-denied states are distinct.
- Shared components follow the approved design system.
- Keyboard navigation and visible focus behavior are verified.
- Responsive behavior is tested at supported viewport sizes.
- Automated component and route tests pass.
- Known limitations and development substitutes are documented.

## 7. F-M02 PROJECTS

**Phase mapping:** P1.

**Purpose:** Enable users to discover, create, select, and manage project context for subsequent workflows.

**Authoritative scope:** The F-M02 PROJECTS dossier under `docs/frontend/milestones/`.

### 7.1 Screens delivered

| Screen or surface | Delivery expectation |
|---|---|
| Project list | Authorized projects with relevant metadata |
| Project search and filtering | Supported discovery behavior and filter reset |
| Project creation | Validated form and clear creation outcome |
| Project details | Project identity, metadata, and supported actions |
| Project settings | Editable fields within the approved API scope |
| Project empty state | Guidance when no projects are available |
| Project loading state | Clear feedback while project data is retrieved |
| Project error state | Retry or recovery path for failed requests |
| Project access state | Clear handling of unavailable or unauthorized projects |
| Project context selector | Consistent current-project context where required |

### 7.2 Design deliverables

- Project-list layout and responsive behavior.
- Project card or table specification.
- Create and edit form patterns.
- Validation and field-error conventions.
- Destructive-action confirmation pattern where applicable.
- Project context and breadcrumb behavior.
- Empty, loading, error, and no-access variants.
- Project-list accessibility review.

### 7.3 Backend and data dependencies

| Dependency | Requirement |
|---|---|
| `B-M01 CONTROL PLANE` | Project CRUD, authorization, and organization-scoped access |
| `DB-M02 CORE DATA` | Durable project identity and ownership |
| `F-M01 STUDIO FOUNDATION` | Navigation, shared components, and identity-aware shell |
| Project API contract | Request validation, response schema, and error semantics |

### 7.4 Review gates

- G1: Project lifecycle and supported actions agreed.
- G2: List, details, and form designs reviewed.
- G3: Project API and authorization behavior confirmed.
- G4: List, create, details, and edit workflows implemented.
- G5: Empty, invalid, unauthorized, and service-failure cases tested.
- G6: End-to-end project workflow accepted.

### 7.5 Acceptance criteria

- Authorized users can view their permitted projects.
- Project creation validates required fields.
- Server validation errors are associated with relevant fields where possible.
- Project ownership and authorization are enforced by the backend.
- A project cannot be treated as created until the backend confirms success.
- Empty results are not confused with API failures.
- Invalid or inaccessible project routes are handled safely.
- Project context remains consistent when navigating between screens.
- Automated tests cover successful and unsuccessful operations.
- API assumptions and remaining limitations are recorded.

## 8. F-M03 BUILD & ARTIFACT

**Phase mapping:** P2.

**Purpose:** Present the build workflow, its feedback, and the resulting Artifact lifecycle without confusing a successful build request with a validated, usable Artifact.

**Authoritative scope:** The F-M03 BUILD & ARTIFACT dossier under `docs/frontend/milestones/`.

### 8.1 Screens delivered

| Screen or surface | Delivery expectation |
|---|---|
| Build workspace | Project-specific build entry point |
| Build configuration | Supported build parameters and validation |
| Build submission | Clear request submission and acknowledgement |
| Build progress | Backend-reported status and timestamps |
| Build history | Discoverable previous build records where supported |
| Build details | Logs, status, errors, and relevant metadata |
| Build failure state | Useful failure summary and supported recovery actions |
| Artifact list | Project-associated Artifacts and their states |
| Artifact details | Version, manifest metadata, integrity state, and provenance |
| Artifact readiness | Clear distinction between uploaded, validated, and eligible states |
| Artifact unavailable state | Safe handling of missing or inaccessible content |

### 8.2 Design deliverables

- Build configuration and validation patterns.
- Progress and status presentation.
- Build history and detail layouts.
- Log viewing and truncation behavior.
- Artifact metadata presentation.
- Integrity and validation status indicators.
- Build-to-Artifact navigation.
- Empty, error, and retry states.
- Accessible status announcements for asynchronous updates.

### 8.3 Backend and data dependencies

| Dependency | Requirement |
|---|---|
| `B-M02 ARTIFACT` | Artifact metadata, manifest validation, integrity state, and artifact access |
| `B-M01 CONTROL PLANE` | Project authorization and user access |
| `DB-M02 CORE DATA` | Project and Artifact metadata persistence |
| `C-M02 DEVELOPMENT` | Development integration and any required artifact-storage configuration |
| Build API contract | Build request, progress, error, and output metadata |
| Artifact API contract | Artifact identity, version, manifest, and validation status |

### 8.4 Review gates

- G1: Build and Artifact user journeys agreed.
- G2: Configuration, progress, logs, and Artifact states reviewed.
- G3: Build and Artifact contracts confirmed.
- G4: Build workspace and Artifact views implemented.
- G5: Success, failure, invalid configuration, and inaccessible Artifact cases tested.
- G6: Build-to-Artifact workflow accepted.

### 8.5 Acceptance criteria

- Build configuration is validated before submission where practical.
- Backend acknowledgement is distinguished from build completion.
- Build status is based on authoritative backend state.
- Build failure does not imply that an Artifact was produced successfully.
- Artifact identity and provenance remain visible.
- Artifact validation and integrity status are not inferred by the UI.
- Logs and errors are presented without leaking secrets.
- Retry actions are explicit and do not silently duplicate operations.
- Loading and empty states remain distinguishable.
- Automated tests cover build and Artifact state transitions.

## 9. F-M04 BOOKING

**Phase mapping:** P4.

**Purpose:** Enable users to discover eligible resources, review availability and pricing, and request or manage reservations.

**Authoritative scope:** The F-M04 BOOKING dossier under `docs/frontend/milestones/`.

### 9.1 Screens delivered

| Screen or surface | Delivery expectation |
|---|---|
| Resource catalog | Authorized resources and relevant capabilities |
| Resource details | Supported capabilities, availability, and restrictions |
| Availability search | Requested time window and supported filters |
| Availability results | Backend-confirmed availability information |
| Booking configuration | Resource, time window, and required options |
| Quote review | Price, units, validity, and applicable conditions |
| Credit summary | Relevant balance and reservation information |
| Booking confirmation | Server-confirmed reservation outcome |
| Booking details | Reservation identity, time window, and current status |
| Cancellation workflow | Eligibility, consequences, and confirmation |
| Booking failure state | Conflict, expired quote, or service error handling |

### 9.2 Design deliverables

- Resource catalog and capability presentation.
- Availability search and result states.
- Date/time selection and timezone conventions.
- Quote summary and expiration indicators.
- Credit-impact presentation.
- Booking confirmation and cancellation patterns.
- Conflict and retry behavior.
- Accessibility review for date/time and availability controls.

### 9.3 Backend and data dependencies

| Dependency | Requirement |
|---|---|
| `B-M03 PLATFORM` | Resource catalog, capability metadata, and resource status |
| `B-M04 BOOKING` | Availability, reservation, quote, cancellation, and credit APIs |
| `DB-M02 CORE DATA` | Resource and capability persistence |
| `DB-M03 BOOKING DATA` | Booking, quote, reservation, and credit persistence |
| `C-M03 STAGING` | Integrated staging environment when required |
| Security requirements | Resource authorization and safe presentation of booking information |

### 9.4 Review gates

- G1: Resource discovery and booking journeys agreed.
- G2: Availability, quote, credit, and cancellation designs reviewed.
- G3: Booking contracts and transaction outcomes confirmed.
- G4: Booking screens and form validation implemented.
- G5: Conflict, expiration, cancellation, and retry scenarios verified.
- G6: End-to-end booking workflow accepted.

### 9.5 Acceptance criteria

- Resource availability is sourced from the backend.
- The UI does not promise availability before reservation confirmation.
- Quotes show their validity and applicable units.
- Expired quotes are not silently reused.
- Credit impact is explicit before confirmation where required.
- A booking is shown as confirmed only after backend confirmation.
- Reservation conflicts are communicated clearly.
- Cancellation outcomes reflect the authoritative service response.
- Repeated submissions do not create misleading duplicate confirmations.
- Automated tests cover success, conflict, expiration, and cancellation paths.

## 10. F-M05 EXECUTION

**Phase mapping:** P5.

**Purpose:** Let users submit eligible Artifacts for execution and inspect Job and Run state with explicit feedback and safe recovery behavior.

**Authoritative scope:** The F-M05 EXECUTION dossier under `docs/frontend/milestones/`.

### 10.1 Screens delivered

| Screen or surface | Delivery expectation |
|---|---|
| Execution eligibility | Backend-reported readiness and blocking conditions |
| Execution configuration | Supported execution options and validation |
| Job submission | Explicit submission and acknowledgement |
| Job details | Job identity, lifecycle state, and associated Runs |
| Run details | Run identity, attempt state, and outcome metadata |
| Execution history | Authorized historical Jobs and Runs |
| Execution event view | Available progress and event information |
| Command controls | Only the commands authorized by the execution contract |
| Cancellation request | Explicit request and backend-reported result |
| Recovery state | Reconnect, delayed response, and uncertain-outcome handling |

### 10.2 Design deliverables

- Eligibility and prerequisite summary.
- Submission confirmation pattern.
- Separate Job and Run visual representations.
- State and transition presentation.
- Command authorization and disabled-state rules.
- Cancellation request and result states.
- Retry and uncertain-outcome guidance.
- Accessible asynchronous progress updates.

### 10.3 Backend and data dependencies

| Dependency | Requirement |
|---|---|
| `B-M05 EXECUTION` | Eligibility, Job, Run, dispatch, command, and lifecycle APIs |
| `DB-M04 EXECUTION DATA` | Durable Job, Run, event, and reconciliation records |
| `B-M02 ARTIFACT` | Artifact metadata and eligibility information |
| `B-M04 BOOKING` | Applicable reservation eligibility and booking references |
| `C-M03 STAGING` | Integrated execution testing environment |
| Execution API contract | Accepted states, errors, command outcomes, and recovery semantics |

### 10.4 Review gates

- G1: Execution journeys and supported commands agreed.
- G2: Job, Run, progress, and recovery states reviewed.
- G3: Execution contracts and authorization requirements confirmed.
- G4: Submission, detail, and history screens implemented.
- G5: Duplicate submission, reconnect, delayed response, and failure scenarios tested.
- G6: Execution workflow accepted against authoritative backend state.

### 10.5 Acceptance criteria

- The UI displays Job and Run as distinct entities.
- Submission acknowledgement is not presented as successful execution.
- Job and Run state is derived from authoritative backend responses.
- Reconnecting does not automatically submit a new Job.
- An uncertain outcome is not treated as a confirmed failure or success without evidence.
- Commands are available only when supported and authorized.
- Cancellation is presented as a request until its outcome is known.
- Execution history preserves the association between Jobs and Runs.
- Error states provide safe next steps.
- Automated tests cover lifecycle, authorization, and recovery scenarios.

## 11. F-M06 LIVE

**Phase mapping:** P7.

**Purpose:** Provide an operator-facing view of a live session, including connection state, supported telemetry, and explicit indication of data freshness.

**Authoritative scope:** The F-M06 LIVE dossier under `docs/frontend/milestones/`.

### 11.1 Screens delivered

| Screen or surface | Delivery expectation |
|---|---|
| Live entry | Supported path into an authorized live session |
| Session connection | Connecting, connected, reconnecting, and disconnected states |
| Live overview | Current session and relevant execution context |
| Telemetry panel | Supported metrics with units and timestamps |
| Data freshness indicator | Distinction between current, delayed, and stale data |
| Connection diagnostics | Safe connection status and recoverable error information |
| Live session exit | Explicit navigation and session-exit behavior |
| Unsupported telemetry state | Clear indication when a signal is unavailable |
| Live service error | Recovery guidance for failed connections |

### 11.2 Design deliverables

- Live session layout.
- Connection-state visual language.
- Telemetry cards and chart conventions.
- Units, timestamps, and freshness indicators.
- Reconnection and stale-data patterns.
- Responsive layout for operator visibility.
- Accessibility rules for frequently updating values.
- Guidance for distinguishing missing data from a zero value.

### 11.3 Backend and platform dependencies

| Dependency | Requirement |
|---|---|
| `B-M06 RESULTS` | Live session and telemetry access contracts where defined by the milestone dossier |
| `DB-M04 EXECUTION DATA` | Relevant execution and Result references |
| `C-M03 STAGING` | Live connection and streaming integration |
| Execution service | Current Job/Run context where applicable |
| Live protocol contract | Connection, message, freshness, and error semantics |

### 11.4 Review gates

- G1: Live use cases and supported telemetry agreed.
- G2: Session, freshness, and connection states reviewed.
- G3: Streaming and session contracts confirmed.
- G4: Live screens and connection feedback implemented.
- G5: Stale data, disconnection, reconnect, and unsupported-signal cases tested.
- G6: Live operator workflow accepted.

### 11.5 Acceptance criteria

- Live connection state is visible.
- Telemetry includes relevant units and timestamps.
- Stale data is not presented as current.
- Missing telemetry is not silently rendered as zero.
- Reconnection does not create a new Job or Run.
- The UI communicates connection failures and recovery status.
- Supported live-session authorization is enforced by the backend.
- Rapid updates do not make the interface unusable.
- Automated tests cover connection-state transitions and stale-data behavior.

## 12. F-M07 RESULTS

**Phase mapping:** P7.

**Purpose:** Provide a durable, navigable view of execution outcomes, associated files, metrics, experiments, and comparisons.

**Authoritative scope:** The F-M07 RESULTS dossier under `docs/frontend/milestones/`.

### 12.1 Screens delivered

| Screen or surface | Delivery expectation |
|---|---|
| Results list | Authorized Results with useful filters and metadata |
| Result details | Outcome, provenance, and linked Job/Run context |
| Result files | File metadata, access state, and supported download actions |
| Metrics view | Supported measurements with units and provenance |
| Experiment view | Experiment metadata and associated Results |
| Comparison view | Selected Results and comparable metrics |
| Result unavailable state | Clear handling of missing, archived, or inaccessible content |
| Historical execution navigation | Links between Results, Runs, and Jobs |
| Retention state | Supported indication of archival or expiration where exposed by the contract |

### 12.2 Design deliverables

- Result-list and detail layouts.
- Result provenance presentation.
- File list and download behavior.
- Metric display and unit conventions.
- Experiment and comparison layouts.
- Incompatible-metric warning patterns.
- Archived and unavailable content states.
- Accessibility review for data-heavy screens.

### 12.3 Backend and data dependencies

| Dependency | Requirement |
|---|---|
| `B-M06 RESULTS` | Result, file metadata, metrics, experiments, and comparison APIs |
| `DB-M04 EXECUTION DATA` | Result provenance, metrics, experiment, and retention metadata |
| `B-M05 EXECUTION` | Job and Run associations |
| `C-M03 STAGING` | Result-file access and integration testing |
| Result API contract | Provenance, access permissions, metadata, and retention behavior |

### 12.4 Review gates

- G1: Result discovery and analysis journeys agreed.
- G2: Result, file, metric, experiment, and comparison designs reviewed.
- G3: Result and file contracts confirmed.
- G4: Results screens and data views implemented.
- G5: Missing files, incompatible metrics, authorization, and retention cases tested.
- G6: End-to-end Results workflow accepted.

### 12.5 Acceptance criteria

- Results are linked to their authoritative execution records.
- Result provenance is visible and not inferred from client-side assumptions.
- File availability reflects backend and storage state.
- Download actions follow authorization and access contracts.
- Metrics display their units and relevant context.
- Comparisons do not imply equivalence between incompatible metrics.
- Archived or unavailable content is distinguished from empty data.
- Result access respects project and organization boundaries.
- Automated tests cover data rendering, authorization, and error handling.

## 13. Cross-Milestone UI Standards

These standards apply to all seven frontend milestones.

### 13.1 Navigation and context

- Preserve a consistent global navigation model.
- Keep the active Project context visible where relevant.
- Provide clear navigation between related entities.
- Preserve useful context when returning from details to lists.
- Handle stale or invalid route parameters safely.
- Avoid links to actions that the user is not authorized to perform.

### 13.2 Loading, empty, and error states

Every data-driven screen must distinguish:

- initial loading
- successful data retrieval
- successful retrieval with no records
- partial data availability
- validation failure
- authorization failure
- missing or deleted resource
- backend service failure
- connection interruption
- stale or outdated data where applicable

A loading indicator must not imply that a transaction has completed.

### 13.3 Form behavior

- Identify required fields.
- Validate locally when rules are deterministic.
- Respect backend validation as authoritative.
- Preserve safe user input after recoverable errors.
- Prevent accidental duplicate submissions where practical.
- Clearly communicate whether a request was accepted.
- Require confirmation for consequential actions where appropriate.

### 13.4 Status representation

- Use shared status components.
- Keep labels explicit and consistent.
- Do not rely on color alone.
- Distinguish unknown, unavailable, pending, active, successful, and failed states where supported.
- Avoid inventing states not defined by the relevant API contract.
- Display timestamps in a consistent and documented format.

### 13.5 Accessibility

- Provide keyboard-operable navigation and controls.
- Maintain visible focus indicators.
- Associate form labels and validation errors with controls.
- Provide appropriate accessible names for icon-only controls.
- Support screen-reader announcements for important asynchronous updates.
- Avoid excessive announcements for high-frequency telemetry.
- Preserve readable contrast and responsive text behavior.
- Include accessibility checks in milestone acceptance.

### 13.6 Security and privacy

- Do not place credentials, tokens, or secrets in visible UI output.
- Do not treat hidden controls as authorization enforcement.
- Respect backend authorization responses.
- Avoid leaking protected identifiers or metadata through error messages.
- Confirm consequential actions before submission where required.
- Do not expose resource controls unless the API contract and authorization permit them.
- Avoid retaining sensitive information in client-side logs.

## 14. Cross-Domain Dependency Matrix

| UI milestone | Backend dependency | Database dependency | Cloud dependency |
|---|---|---|---|
| F-M01 STUDIO FOUNDATION | B-M01 CONTROL PLANE | DB-M01 FOUNDATION | C-M01 FOUNDATION; C-M02 DEVELOPMENT |
| F-M02 PROJECTS | B-M01 CONTROL PLANE | DB-M02 CORE DATA | C-M02 DEVELOPMENT |
| F-M03 BUILD & ARTIFACT | B-M02 ARTIFACT; B-M01 CONTROL PLANE | DB-M02 CORE DATA | C-M02 DEVELOPMENT |
| F-M04 BOOKING | B-M03 PLATFORM; B-M04 BOOKING | DB-M02 CORE DATA; DB-M03 BOOKING DATA | C-M03 STAGING |
| F-M05 EXECUTION | B-M05 EXECUTION; B-M02 ARTIFACT; B-M04 BOOKING | DB-M04 EXECUTION DATA | C-M03 STAGING |
| F-M06 LIVE | B-M06 RESULTS; B-M05 EXECUTION as applicable | DB-M04 EXECUTION DATA | C-M03 STAGING |
| F-M07 RESULTS | B-M06 RESULTS; B-M05 EXECUTION | DB-M04 EXECUTION DATA | C-M03 STAGING |

The table identifies coordination dependencies, not a claim that every API must be complete before any UI work begins.

A screen may be implemented against a contract-approved mock or development substitute when permitted. Final integration acceptance requires the appropriate backend behavior.

## 15. API Dependency Readiness

Before a milestone's integration review, the frontend and backend leads must agree on:

- endpoint or operation identity
- request and response schemas
- authentication and authorization expectations
- error categories and stable error codes where applicable
- pagination, sorting, and filtering conventions
- lifecycle states and permitted transitions
- idempotency and retry behavior for consequential operations
- timestamps and timezone handling
- consistency and freshness expectations
- versioning and compatibility expectations
- test fixtures and integration-environment availability

A missing API contract must be recorded as a dependency, not silently replaced with an assumed response structure.

## 16. UI Test and Evidence Requirements

Each milestone must maintain evidence for the following test categories where applicable.

| Test category | Minimum expectation |
|---|---|
| Component tests | Shared controls, states, validation, and rendering |
| Screen tests | Primary screen behavior and supported interactions |
| Route tests | Navigation, invalid routes, and protected routes |
| API integration tests | Request mapping, responses, and error handling |
| Accessibility tests | Keyboard, focus, labels, and relevant automated checks |
| Responsive tests | Supported viewport layouts |
| Error-path tests | Timeouts, server failures, invalid responses, and denied access |
| Workflow tests | Primary user journey across integrated screens |
| Regression tests | Previously accepted workflows remain functional |

### 16.1 Required evidence record

Each milestone acceptance record should include:

- milestone identifier and frozen name
- phase mapping
- screens delivered
- design review outcome
- backend contract versions or references
- automated test results
- integration test results
- accessibility review outcome
- known limitations
- unresolved defects and their severity
- approval outcome and reviewer roles

## 17. UI Milestone Exit Criteria

A milestone may be marked complete only when:

- its authoritative milestone dossier's scope is satisfied
- planned screens are delivered or explicitly dispositioned
- design deliverables are reviewed
- backend dependencies are resolved or accepted under documented development-only arrangements
- all required review gates have an outcome
- primary and failure workflows are tested
- accessibility expectations are met
- security and authorization behavior is verified
- documentation and evidence are current
- blocking defects are resolved
- remaining limitations have owners and explicit acceptance
- the milestone status is updated in the project tracking system

Milestone completion does not automatically imply overall product or production readiness.

## 18. Delivery Tracking Template

Use the following fields in the project tracking system for each milestone:

| Field | Required content |
|---|---|
| Milestone ID | Frozen identifier, for example `F-M03` |
| Milestone name | Exact frozen name |
| Phase mapping | Canonical phase identifier or range |
| Scope reference | Authoritative frontend milestone dossier |
| Design owner | Accountable design role |
| Implementation owner | Accountable frontend role |
| Backend dependencies | Required API and backend milestones |
| Data dependencies | Required database milestones |
| Cloud dependencies | Required cloud milestones |
| Planned screens | Screen inventory |
| Design status | Not started, in progress, review, accepted |
| Implementation status | Not started, in progress, review, accepted |
| Integration status | Not started, blocked, in progress, accepted |
| Acceptance status | Not started, blocked, accepted |
| Evidence reference | Test reports, review records, and acceptance evidence |
| Risks and blockers | Issue, owner, and resolution plan |

Statuses must reflect evidence rather than estimates or informal verbal updates.

## 19. Frozen Milestone Inventory

| Sequence | Milestone ID | Exact name | Phase mapping |
|---:|---|---|---|
| 1 | F-M01 | STUDIO FOUNDATION | P0-P1 |
| 2 | F-M02 | PROJECTS | P1 |
| 3 | F-M03 | BUILD & ARTIFACT | P2 |
| 4 | F-M04 | BOOKING | P4 |
| 5 | F-M05 | EXECUTION | P5 |
| 6 | F-M06 | LIVE | P7 |
| 7 | F-M07 | RESULTS | P7 |

This inventory is the complete frozen frontend milestone list for this document. Do not create alternate milestone names or renumber the listed milestones in derivative UI planning records.

## 20. Final Review Checklist

- [ ] The document references `docs/planning/PHASES.md` as the canonical phase definition.
- [ ] All seven frontend milestones use the frozen identifiers and names.
- [ ] Each milestone has an explicit phase mapping.
- [ ] Screen delivery expectations are defined for each milestone.
- [ ] Design deliverables are defined for each milestone.
- [ ] Review gates are defined and have explicit evidence requirements.
- [ ] Backend API dependencies are identified.
- [ ] Database and cloud coordination dependencies are identified.
- [ ] Loading, empty, error, authorization, and recovery states are covered.
- [ ] Job and Run remain distinct.
- [ ] Booking and execution remain distinct.
- [ ] Result provenance and file availability are represented explicitly.
- [ ] Accessibility and security are part of milestone acceptance.
- [ ] Milestone dossiers remain authoritative for detailed scope.
- [ ] Test evidence and acceptance ownership are defined.
- [ ] No retired phase or milestone names are used.

## 21. Change Control

Changes to this document must preserve the frozen frontend milestone model.

For each approved change, record:

- date and author
- affected milestone
- reason for change
- affected screens and user journeys
- API or data contract impact
- design-system impact
- test and acceptance impact
- review outcome

Changes to phase definitions must be made only in `docs/planning/PHASES.md` through the appropriate project governance process.

Changes to milestone scope must be reflected in the corresponding authoritative dossier under `docs/frontend/milestones/` and then propagated to this UI delivery plan.

## 22. Changelog

### Current Baseline

- Consolidated UI delivery milestones under F-M01 through F-M07.
- Aligned milestone names and phase mappings with the frozen canonical model.
- Defined screen inventories and design deliverables for each milestone.
- Identified backend API, database, and cloud coordination dependencies.
- Standardized milestone review gates and acceptance evidence.
- Added shared navigation, state, accessibility, and security expectations.
- Explicitly preserved Job/Run, Booking/Execution, and Result provenance distinctions.
- Delegated phase definitions to `docs/planning/PHASES.md`.
- Preserved existing milestone dossiers as the authoritative source for detailed scope.

### Future Changes

Any future update must preserve the frozen milestone identifiers, exact names, and phase mappings unless the project governance process formally changes the canonical model.
