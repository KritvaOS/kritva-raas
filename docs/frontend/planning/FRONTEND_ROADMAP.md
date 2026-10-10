# Kritva RaaS Frontend Roadmap

## 1. Purpose

This document defines the frontend implementation roadmap for Kritva RaaS Studio and its user-facing execution workflows.

It establishes the sequencing, dependencies, integration points, risks, priorities, and acceptance expectations for the seven canonical frontend milestones.

The canonical phase definitions, phase names, phase numbers, and phase boundaries are maintained in:

    docs/planning/PHASES.md

This document references that file and does not independently redefine the phase model.

The detailed scope of each frontend milestone is authoritative in its dossier under:

    docs/frontend/milestones/

Backend, database, cloud, protocol, and security dependencies are defined by their corresponding authoritative documents and milestone dossiers.

This roadmap covers:

- Studio foundation and application shell
- Project workspace
- Local build and artifact workflows
- Booking and credits
- Remote execution
- Live observation
- Results and rerun workflows
- Frontend-to-backend integration
- Protocol dependencies
- Cross-platform requirements
- Security and source-code privacy
- Testing and acceptance
- Risks and dependency management

## 2. Canonical References

| Document | Authority |
|---|---|
| `docs/planning/PHASES.md` | Canonical phase definition |
| `docs/planning/IMPLEMENTATION_ROADMAP.md` | Program implementation sequencing |
| `docs/planning/DEPENDENCY_MAP.md` | Cross-domain dependency relationships |
| `docs/planning/RELEASE_ROADMAP.md` | Release sequencing and qualification |
| `docs/frontend/milestones/` | Authoritative frontend milestone scope |
| `docs/frontend/architecture/` | Frontend architecture |
| `docs/frontend/development/` | Frontend development practices |
| `docs/protocol/` | Normative protocol contracts |
| `docs/security/` | Security requirements and architecture |
| `docs/ui/UI_ACCEPTANCE_CRITERIA.md` | Shared UI acceptance requirements |
| `docs/ui/UI_REVIEW_CHECKLIST.md` | UI review requirements |
| `docs/tracking/MILESTONE_STATUS.md` | Milestone implementation status |
| `docs/tracking/TASK_STATUS.md` | Task implementation status |

The frontend roadmap must not redefine phase names or numbers.

The frontend roadmap must not redefine the detailed scope of a milestone.

## 3. Frozen Frontend Milestone Model

The following milestone identifiers and names are canonical.

| Milestone | Name | Phase mapping |
|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 |
| F-M02 | PROJECTS | P1 |
| F-M03 | BUILD & ARTIFACT | P2 |
| F-M04 | BOOKING | P4 |
| F-M05 | EXECUTION | P5 |
| F-M06 | LIVE | P7 |
| F-M07 | RESULTS | P7 |

The phase mapping references `docs/planning/PHASES.md`.

Milestone scope must be taken from the corresponding dossier under `docs/frontend/milestones/`.

## 4. Frontend Product Principles

The frontend implementation follows these principles:

1. Studio is the primary developer-facing application.
2. Customer source code remains local during the normal development workflow.
3. Build and packaging operations run through the local runtime.
4. Only approved artifacts are uploaded for remote execution.
5. Remote business state is authoritative on the Control Plane.
6. The frontend never makes authoritative booking or credit decisions.
7. Job and Run are distinct entities.
8. Live observation is separate from execution control.
9. Durable state is authoritative over transient WebSocket events.
10. Video uses a transport suited to real-time media.
11. Telemetry freshness must be visible.
12. Reconnection must not restart execution.
13. Software Stop is not emergency stop.
14. Unknown safety state must never be presented as safe.
15. Result history must remain independently accessible.
16. Rerun creates a new Job and Run.
17. Authorization is enforced by the backend, not merely by UI visibility.
18. All major screens provide loading, empty, success, and error states.
19. Accessibility and keyboard operation are part of acceptance.
20. Frontend behavior must remain compatible with approved API and protocol contracts.

## 5. Frontend Architecture

The logical frontend architecture is:

    User
      |
      v
    Kritva RaaS Studio
      |
      +--> React UI
      |      |
      |      +--> Navigation
      |      +--> Projects
      |      +--> Build & Artifact
      |      +--> Booking
      |      +--> Execution
      |      +--> Live
      |      +--> Results
      |
      +--> TypeScript API Client
      |      |
      |      +--> HTTPS REST
      |      +--> WebSocket
      |
      +--> Tauri IPC
             |
             v
         Rust Local Runtime
             |
             +--> Local Workspace
             +--> Toolchain
             +--> Build
             +--> Tests
             +--> Package
             +--> Privacy Scan
             +--> Artifact Operations

The React UI must not directly access filesystem resources outside the approved native boundary.

The Rust Local Runtime owns privileged local operations.

The API client owns remote API interaction and contract serialization.

Shared contract types should be reused where practical rather than independently recreated.

## 6. Frontend Milestone Dependency Graph

The primary milestone sequence is:

    F-M01 STUDIO FOUNDATION
              |
              v
        F-M02 PROJECTS
              |
              v
    F-M03 BUILD & ARTIFACT
              |
              v
        F-M04 BOOKING
              |
              v
       F-M05 EXECUTION
              |
              +------------+
              |            |
              v            v
          F-M06 LIVE   F-M07 RESULTS

This diagram represents the principal product workflow.

The actual dependency graph also includes backend, database, protocol, cloud, and security dependencies.

F-M04 BOOKING requires the applicable Control Plane and booking services.

F-M05 EXECUTION requires artifact, platform, booking, and execution services.

F-M06 LIVE and F-M07 RESULTS require execution and Lab integration, plus the applicable live and result services.

## 7. F-M01 STUDIO FOUNDATION

### 7.1 Phase Mapping

P0-P1.

The canonical phase definitions are maintained in `docs/planning/PHASES.md`.

### 7.2 Objective

Establish the Studio application shell, native application boundary, development environment, authentication integration, navigation, and reusable frontend foundations.

### 7.3 Scope

The milestone dossier is:

    docs/frontend/milestones/F-M01-STUDIO-FOUNDATION/MILESTONE.md

The milestone covers the foundation needed for subsequent frontend implementation.

Expected capabilities include:

- Tauri application shell
- Rust native integration
- React and TypeScript setup
- navigation
- shared layout
- API client foundation
- session integration
- error handling
- loading states
- empty states
- reusable UI components
- theme support
- logging boundaries
- native IPC boundaries
- initial platform build support

### 7.4 Dependencies

- P0 FOUNDATION outputs.
- Development environment.
- CI.
- Authentication contract.
- API client conventions.
- UI guidelines.
- Local runtime boundary.
- Required frontend development tooling.

### 7.5 Backend and Protocol Dependencies

F-M01 may use controlled development substitutes while remote services are under implementation.

Required contracts include:

- authentication and session contract
- standard API request and response behavior
- error representation
- API versioning
- Tauri IPC contract
- configuration contract

Relevant protocol references include:

- `docs/protocol/PROTOCOL_OVERVIEW.md`
- `docs/protocol/ENVELOPES.md`
- `docs/protocol/RESPONSES.md`
- `docs/protocol/ERROR_CODES.md`
- `docs/protocol/VERSIONING.md`

### 7.6 Risks

- Native/frontend boundary instability.
- Inconsistent application state.
- Uncontrolled local filesystem access.
- Authentication state leakage.
- Platform-specific build failures.
- Duplicate UI primitives.
- Inconsistent error handling.

### 7.7 Exit Criteria

- Studio launches.
- Navigation works.
- Shared components are available.
- IPC boundaries are defined.
- Authentication integration is testable.
- API client behavior is testable.
- Supported development targets build successfully.
- Required UI acceptance checks pass.

### 7.8 Acceptance Checklist

- [ ] Application shell is functional.
- [ ] Navigation is functional.
- [ ] API client foundation is implemented.
- [ ] IPC boundary is documented and tested.
- [ ] Loading states are consistent.
- [ ] Error states are actionable.
- [ ] Empty states are implemented.
- [ ] Accessibility checks pass.
- [ ] Supported builds pass.
- [ ] No source code is sent to remote APIs by the foundation workflow.
- [ ] Milestone evidence is recorded.

## 8. F-M02 PROJECTS

### 8.1 Phase Mapping

P1.

The canonical phase definitions are maintained in `docs/planning/PHASES.md`.

### 8.2 Objective

Provide project creation, discovery, selection, metadata management, and local workspace integration.

### 8.3 Scope

The milestone dossier is:

    docs/frontend/milestones/F-M02-PROJECTS/MILESTONE.md

Expected capabilities include:

- project listing
- project creation
- project opening
- project metadata
- organization context
- project membership
- local workspace selection
- target platform selection
- project settings
- project lifecycle presentation
- project error handling

Project metadata may be remote.

Project source code must remain local.

### 8.4 Dependencies

- F-M01 STUDIO FOUNDATION.
- Authentication and organization context.
- Project API contract.
- Authorization contract.
- Platform catalog contract.
- Local workspace implementation.
- DB-M01 FOUNDATION.
- C-M02 DEVELOPMENT.

### 8.5 Backend Dependencies

F-M02 PROJECTS depends on the project services provided by B-M01 CONTROL PLANE as they become available.

Required operations include:

- list projects
- create project
- retrieve project
- update project metadata
- archive or restore where supported
- retrieve project membership
- retrieve organization context

The backend remains authoritative for project ownership, membership, and permissions.

### 8.6 Protocol Dependencies

Required contracts include:

- identity and organization context
- project resource schemas
- pagination
- error handling
- idempotency for retryable writes
- API versioning

The frontend must not independently invent project fields or authorization semantics.

### 8.7 Risks

- Project metadata diverges from server state.
- Local workspace paths are handled unsafely.
- Project ownership is inferred from UI state.
- Tenant identifiers are incorrectly reused.
- Source code enters project API requests.
- Stale project state is displayed as authoritative.

### 8.8 Exit Criteria

- Projects can be created and listed.
- Project metadata can be retrieved and updated.
- Local workspace integration works.
- Organization context is enforced.
- Unauthorized projects are not accessible.
- Project operations handle retries and failures.
- Source privacy tests pass.

### 8.9 Acceptance Checklist

- [ ] Project listing works.
- [ ] Project creation works.
- [ ] Project selection works.
- [ ] Project metadata is displayed correctly.
- [ ] Organization context is visible and consistent.
- [ ] Local workspace selection works.
- [ ] Platform selection is available where required.
- [ ] Authorization failures are handled.
- [ ] Network failures are handled.
- [ ] Source code is not included in project API payloads.
- [ ] Milestone evidence is recorded.

## 9. F-M03 BUILD & ARTIFACT

### 9.1 Phase Mapping

P2.

The canonical phase definitions are maintained in `docs/planning/PHASES.md`.

### 9.2 Objective

Provide the local build and artifact workflow, including toolchain detection, build execution, testing, packaging, validation, and controlled artifact upload.

### 9.3 Scope

The milestone dossier is:

    docs/frontend/milestones/F-M03-BUILD-ARTIFACT/MILESTONE.md

Expected capabilities include:

- local toolchain detection
- build configuration
- build start
- build progress
- build cancellation
- build logs
- local test execution
- package generation
- `.krv` artifact creation
- manifest display
- checksum display
- signature status
- artifact validation
- artifact history
- artifact upload
- upload progress
- validation error presentation

### 9.4 Dependencies

- F-M02 PROJECTS.
- Local Runtime.
- Build toolchain integration.
- Artifact manifest contract.
- Artifact packaging rules.
- Artifact signing interface.
- Source privacy controls.
- Platform compatibility metadata.
- B-M02 ARTIFACT.
- DB-M02 CORE DATA.
- C-M02 DEVELOPMENT.

### 9.5 Backend Dependencies

B-M02 ARTIFACT must provide the applicable services for:

- artifact registration
- artifact metadata
- upload authorization
- upload completion
- validation status
- signature verification status
- compatibility status
- artifact retrieval

The frontend must not assume that successful upload means the artifact is approved for execution.

### 9.6 Protocol Dependencies

Normative contract requirements include:

- artifact manifest
- artifact format
- checksum
- signature
- upload initiation
- upload completion
- validation response
- artifact lifecycle
- compatibility response

The manifest contract must be maintained under `docs/protocol/ARTIFACT_MANIFEST.md`.

### 9.7 Security Requirements

- Source remains local.
- Build inputs remain local.
- Package contents follow the allowlist.
- Secrets are excluded.
- Artifact checksums are validated.
- Signatures are validated.
- Upload authorization is enforced.
- Invalid artifacts are rejected.
- UI status does not override server validation.

### 9.8 Risks

- Source leakage.
- Packaging errors.
- Unsupported target architecture.
- Stale manifest data.
- Signature validation failures.
- Upload retries creating duplicates.
- Incorrect representation of artifact approval.

### 9.9 Exit Criteria

- Local build works.
- Tests can be run locally.
- Artifact packaging works.
- Manifest validation works.
- Source privacy checks pass.
- Artifact upload works.
- Backend validation status is visible.
- Invalid artifacts are rejected.

### 9.10 Acceptance Checklist

- [ ] Toolchain detection works.
- [ ] Build start and cancellation work.
- [ ] Logs are available.
- [ ] Local tests can be executed.
- [ ] `.krv` package is generated.
- [ ] Manifest is displayed and validated.
- [ ] Checksum is displayed and validated.
- [ ] Signature status is shown accurately.
- [ ] Upload progress is visible.
- [ ] Upload retry behavior is safe.
- [ ] Source privacy tests pass.
- [ ] Invalid artifacts cannot be treated as approved.
- [ ] Milestone evidence is recorded.

## 10. F-M04 BOOKING

### 10.1 Phase Mapping

P4.

The canonical phase definitions are maintained in `docs/planning/PHASES.md`.

### 10.2 Objective

Provide the frontend workflows for platform discovery, resource availability, booking, credit visibility, quotes, and booking management.

### 10.3 Scope

The milestone dossier is:

    docs/frontend/milestones/F-M04-BOOKING/MILESTONE.md

Expected capabilities include:

- platform discovery
- platform version selection
- configuration selection
- resource availability
- availability refresh
- booking quote
- credit wallet display
- required-credit display
- booking confirmation
- booking history
- booking details
- cancellation
- refund status
- booking error handling

### 10.4 Dependencies

- F-M02 PROJECTS.
- B-M01 CONTROL PLANE.
- B-M03 PLATFORM.
- B-M04 BOOKING.
- DB-M02 CORE DATA.
- DB-M03 BOOKING DATA.
- C-M03 STAGING.
- Authentication and authorization.
- Platform, booking, and credit contracts.

### 10.5 Backend Dependencies

B-M03 PLATFORM must provide the platform catalog and relevant resource metadata.

B-M04 BOOKING must provide authoritative operations for:

- availability
- quote
- booking creation
- booking confirmation
- booking retrieval
- cancellation
- credit reservation
- refund status

The frontend must not treat availability or quotes as final authorization to execute.

### 10.6 Protocol Dependencies

Required contracts include:

- platform catalog
- platform version
- capability metadata
- resource availability
- booking lifecycle
- quote
- credit wallet
- cancellation
- refund
- pagination
- idempotency
- error codes

### 10.7 UI Requirements

The UI must display:

- selected platform and configuration
- requested time and duration
- quote and rate assumptions
- available credit balance
- required credits
- booking status
- cancellation rules where applicable
- stale availability warnings
- server rejection details

The server remains authoritative for booking and credit decisions.

### 10.8 Risks

- Stale availability.
- Duplicate booking requests.
- Misleading credit balances.
- Confusing quote and final charge.
- Time-zone errors.
- Inconsistent cancellation state.
- Authorization failure.
- Incorrect platform configuration.

### 10.9 Exit Criteria

- Platform selection works.
- Availability is displayed.
- Quotes are retrieved from the backend.
- Booking confirmation works.
- Credit status is visible.
- Cancellation and refund status are visible.
- Conflicts are handled correctly.
- Backend state is refreshed after mutations.

### 10.10 Acceptance Checklist

- [ ] Platform discovery works.
- [ ] Version and configuration selection work.
- [ ] Availability refresh works.
- [ ] Quotes display the correct units.
- [ ] Credit balance is displayed.
- [ ] Required credits are displayed.
- [ ] Booking confirmation works.
- [ ] Duplicate submission is prevented or safely handled.
- [ ] Booking status is authoritative.
- [ ] Cancellation behavior is clear.
- [ ] Refund status is displayed.
- [ ] Time-zone handling is tested.
- [ ] Authorization failures are handled.
- [ ] Milestone evidence is recorded.

## 11. F-M05 EXECUTION

### 11.1 Phase Mapping

P5.

The canonical phase definitions are maintained in `docs/planning/PHASES.md`.

### 11.2 Objective

Provide the frontend execution workflow for creating Jobs, monitoring Runs, controlling supported operations, and presenting durable execution state.

### 11.3 Scope

The milestone dossier is:

    docs/frontend/milestones/F-M05-EXECUTION/MILESTONE.md

Expected capabilities include:

- execution eligibility
- Job creation
- Job status
- Run status
- execution detail
- start-state presentation
- stop request
- cancellation request where supported
- failure presentation
- timeout presentation
- execution history
- authorization errors
- reconnect behavior

### 11.4 Dependencies

- F-M03 BUILD & ARTIFACT.
- F-M04 BOOKING.
- B-M02 ARTIFACT.
- B-M03 PLATFORM.
- B-M04 BOOKING.
- B-M05 EXECUTION.
- DB-M04 EXECUTION DATA.
- C-M03 STAGING.
- Job and Run contracts.
- Lab Protocol integration.

### 11.5 Backend Dependencies

B-M05 EXECUTION provides the authoritative Job and Run workflows.

The frontend must display the difference between:

- Job orchestration state
- Run attempt state
- booking state
- artifact validation state
- resource state
- Lab Agent state

The frontend must not collapse these into a single status.

### 11.6 Protocol Dependencies

Required contracts include:

- Job
- Run
- execution eligibility
- start
- stop
- cancellation
- status retrieval
- asynchronous operation response
- event envelope
- error codes
- idempotency
- WebSocket event delivery

### 11.7 Safety Requirements

- Software Stop is not emergency stop.
- Unknown safety state must not be presented as safe.
- A failed frontend request does not prove that execution stopped.
- A disconnected Studio does not imply that execution stopped.
- Reconnect must not restart execution.
- Durable backend state is authoritative.
- Physical safety remains local to the Lab and Robot environment.

### 11.8 Risks

- Job and Run status confusion.
- Duplicate start requests.
- Incorrect stop confirmation.
- Stale execution state.
- Lost WebSocket events.
- Reconnect causing unintended operations.
- Misleading safety presentation.
- Unclear failure recovery.

### 11.9 Exit Criteria

- Job creation works.
- Job and Run state are distinct.
- Execution state can be refreshed.
- Stop behavior is clearly represented.
- Reconnect works without restarting execution.
- Failures are actionable.
- Authorization is enforced.
- Execution operations are idempotently handled.

### 11.10 Acceptance Checklist

- [ ] Job creation works.
- [ ] Job state is displayed.
- [ ] Run state is displayed.
- [ ] Booking association is visible.
- [ ] Artifact association is visible.
- [ ] Start and stop behavior is clear.
- [ ] Stop requests are idempotently handled.
- [ ] Reconnect refreshes durable state.
- [ ] Duplicate events are handled.
- [ ] Unknown safety state is not shown as safe.
- [ ] Emergency stop is not represented as an ordinary software command.
- [ ] Milestone evidence is recorded.

## 12. F-M06 LIVE

### 12.1 Phase Mapping

P7.

The canonical phase definitions are maintained in `docs/planning/PHASES.md`.

### 12.2 Objective

Provide live observation of execution, including video, telemetry, logs, Lab state, Robot state, and connection health.

### 12.3 Scope

The milestone dossier is:

    docs/frontend/milestones/F-M06-LIVE/MILESTONE.md

Expected capabilities include:

- live execution view
- WebRTC video
- telemetry panels
- log streaming
- Job/Run state
- Lab connectivity
- Robot state
- freshness indicators
- reconnect
- stale-state handling
- video session failure handling

### 12.4 Dependencies

- F-M05 EXECUTION.
- B-M05 EXECUTION.
- B-M06 RESULTS.
- DB-M04 EXECUTION DATA.
- C-M03 STAGING.
- WebSocket contract.
- WebRTC signaling contract.
- telemetry contract.
- log contract.
- Lab Agent integration.

### 12.5 Backend and Protocol Dependencies

Required backend capabilities include:

- authorized live session creation
- WebSocket event delivery
- video signaling
- telemetry delivery
- log delivery
- Lab and Robot status
- durable state snapshots
- reconnect support

Video, telemetry, logs, and execution state may use different transports.

The UI must not assume that all live channels share the same availability or failure mode.

### 12.6 UI Requirements

The UI must distinguish:

- CONNECTED
- STALE
- DISCONNECTED
- UNKNOWN

The exact protocol representation must follow the authoritative contracts.

Freshness timestamps or equivalent indicators must be available where appropriate.

A video failure must not automatically be represented as execution failure.

### 12.7 Risks

- Stale telemetry.
- Misleading connection indicators.
- Video connection instability.
- Event duplication.
- Missing sequence numbers.
- Excessive rendering load.
- Reconnect storms.
- Authorization expiry during a live session.

### 12.8 Exit Criteria

- Live video works in the supported environment.
- Telemetry is displayed.
- Logs are streamed.
- State freshness is visible.
- Reconnect works.
- Durable state is restored.
- Video failure is isolated from unrelated execution state.
- Live access is authorized.

### 12.9 Acceptance Checklist

- [ ] Live view opens for an authorized Run.
- [ ] Video signaling works.
- [ ] Video errors are actionable.
- [ ] Telemetry is displayed.
- [ ] Telemetry freshness is visible.
- [ ] Logs are displayed.
- [ ] Job/Run state remains authoritative.
- [ ] Duplicate events are handled.
- [ ] Event gaps are detectable where sequence information is provided.
- [ ] Reconnect refreshes current state.
- [ ] Reconnect does not restart execution.
- [ ] Unknown safety state is not shown as safe.
- [ ] Milestone evidence is recorded.

## 13. F-M07 RESULTS

### 13.1 Phase Mapping

P7.

The canonical phase definitions are maintained in `docs/planning/PHASES.md`.

### 13.2 Objective

Provide the frontend workflows for result discovery, result details, downloads, metrics, experiments, comparisons, and rerun.

### 13.3 Scope

The milestone dossier is:

    docs/frontend/milestones/F-M07-RESULTS/MILESTONE.md

Expected capabilities include:

- result list
- result detail
- result lifecycle
- result files
- metric display
- download workflow
- experiment creation
- experiment membership
- comparison creation
- comparison results
- rerun workflow
- retention status
- failure presentation

### 13.4 Dependencies

- F-M05 EXECUTION.
- F-M06 LIVE.
- B-M05 EXECUTION.
- B-M06 RESULTS.
- DB-M04 EXECUTION DATA.
- C-M03 STAGING.
- Result contract.
- Result File contract.
- metrics contract.
- Experiment contract.
- Comparison contract.
- Download contract.
- authorization contract.

### 13.5 Backend Dependencies

B-M06 RESULTS must provide authoritative APIs for:

- result listing
- result details
- result files
- result metrics
- download requests
- download status
- experiment membership
- comparison generation
- rerun initiation where supported

The frontend must distinguish a Result from its underlying Run.

Comparison data is derived data and must not overwrite the source Result.

### 13.6 Protocol Dependencies

Required contracts include:

- Result
- Result File
- Result Metric
- Experiment
- Comparison
- Download
- retention
- pagination
- idempotency
- error handling

### 13.7 Risks

- Incorrect result status.
- Unauthorized download.
- Expired download link.
- Large result rendering.
- Inconsistent metrics.
- Comparison of incompatible Runs.
- Rerun mutating historical data.
- Result retention misunderstandings.

### 13.8 Exit Criteria

- Results can be listed and opened.
- Result files can be retrieved.
- Metrics are displayed correctly.
- Downloads are authorized.
- Experiments can be managed.
- Comparisons can be created and inspected.
- Rerun creates a new Job and Run.
- Historical Result identity remains unchanged.

### 13.9 Acceptance Checklist

- [ ] Result listing works.
- [ ] Result details work.
- [ ] Result lifecycle is visible.
- [ ] Result files are listed.
- [ ] Download status is displayed.
- [ ] Unauthorized downloads are rejected.
- [ ] Metrics display units and types correctly.
- [ ] Experiment membership works.
- [ ] Comparison results are displayed.
- [ ] Incompatible comparisons are identified.
- [ ] Rerun creates a new Job and Run.
- [ ] Original Results remain unchanged.
- [ ] Retention state is displayed where applicable.
- [ ] Milestone evidence is recorded.

## 14. Backend Milestone Dependencies

The frontend roadmap depends on backend milestones as follows.

| Frontend milestone | Backend dependency | Dependency purpose |
|---|---|---|
| F-M01 STUDIO FOUNDATION | B-M01 CONTROL PLANE | Authentication and foundational APIs as available |
| F-M02 PROJECTS | B-M01 CONTROL PLANE | Organization, project, and authorization services |
| F-M03 BUILD & ARTIFACT | B-M02 ARTIFACT | Artifact registry, upload, validation, and status |
| F-M04 BOOKING | B-M01 CONTROL PLANE; B-M03 PLATFORM; B-M04 BOOKING | Identity, platform catalog, availability, booking, and credits |
| F-M05 EXECUTION | B-M02 ARTIFACT; B-M03 PLATFORM; B-M04 BOOKING; B-M05 EXECUTION | Artifact eligibility, platform validation, booking, Job, and Run |
| F-M06 LIVE | B-M05 EXECUTION; B-M06 RESULTS | Execution state, live data, and Lab-related observation |
| F-M07 RESULTS | B-M05 EXECUTION; B-M06 RESULTS | Run history, Results, metrics, downloads, comparisons, and rerun |

Backend availability does not remove the need for contract tests.

## 15. Database Milestone Dependencies

| Frontend milestone | Database dependency | Purpose |
|---|---|---|
| F-M01 STUDIO FOUNDATION | DB-M01 FOUNDATION | Identity and organization foundation |
| F-M02 PROJECTS | DB-M01 FOUNDATION | Project persistence |
| F-M03 BUILD & ARTIFACT | DB-M01 FOUNDATION; DB-M02 CORE DATA | Artifact and storage metadata |
| F-M04 BOOKING | DB-M02 CORE DATA; DB-M03 BOOKING DATA | Platform, resource, booking, and credit state |
| F-M05 EXECUTION | DB-M04 EXECUTION DATA | Durable Job/Run state |
| F-M06 LIVE | DB-M04 EXECUTION DATA | Execution and live-data metadata |
| F-M07 RESULTS | DB-M04 EXECUTION DATA | Results, files, metrics, experiments, and comparisons |

The frontend must not access database tables directly.

All data access occurs through approved application interfaces.

## 16. Cloud Milestone Dependencies

| Frontend milestone | Cloud milestone | Purpose |
|---|---|---|
| F-M01 STUDIO FOUNDATION | C-M01 FOUNDATION; C-M02 DEVELOPMENT | Development and CI foundations |
| F-M02 PROJECTS | C-M02 DEVELOPMENT | Development API environment |
| F-M03 BUILD & ARTIFACT | C-M02 DEVELOPMENT | Artifact registration and storage integration |
| F-M04 BOOKING | C-M03 STAGING | Integrated booking and commercial testing |
| F-M05 EXECUTION | C-M03 STAGING | Workers, queues, and execution services |
| F-M06 LIVE | C-M03 STAGING | Live data, signaling, and media |
| F-M07 RESULTS | C-M03 STAGING | Result storage and download workflows |

C-M04 PRODUCTION supports production release qualification under P8 PRODUCTION.

## 17. Protocol Dependency Matrix

| Frontend milestone | Required contracts |
|---|---|
| F-M01 STUDIO FOUNDATION | Envelopes, responses, errors, versioning, authentication, IPC |
| F-M02 PROJECTS | Organization, project, membership, pagination, authorization |
| F-M03 BUILD & ARTIFACT | Artifact manifest, artifact registry, upload, validation, signatures |
| F-M04 BOOKING | Platform, availability, booking, credits, cancellation, refund |
| F-M05 EXECUTION | Job, Run, execution commands, events, idempotency |
| F-M06 LIVE | WebSocket, WebRTC signaling, telemetry, logs, Lab state |
| F-M07 RESULTS | Results, files, metrics, experiments, comparisons, downloads, rerun |

Normative contracts must be maintained under `docs/protocol/`.

A referenced contract that does not yet exist must be recorded as a documentation dependency rather than silently treated as complete.

## 18. API Integration Rules

The frontend API client must:

- use typed request and response contracts
- include correlation identifiers where required
- handle API versioning
- handle authorization failures
- handle rate limits
- handle retryable errors
- avoid unsafe retries for non-idempotent operations
- support pagination
- distinguish synchronous completion from asynchronous acceptance
- validate response shape
- avoid logging secrets
- avoid logging source content
- refresh durable state after relevant mutations

The frontend must not infer successful completion merely from an accepted request.

## 19. WebSocket Integration Rules

WebSocket events are used for live updates.

Requirements:

- authenticate connections
- authorize subscriptions
- deduplicate event IDs
- use sequence information where defined
- detect gaps where supported
- reconnect with bounded backoff
- refresh durable state after reconnect
- handle expired authorization
- avoid restarting operations during reconnect
- prevent unbounded buffering

REST or another authoritative query must recover durable state after a reconnect.

## 20. Local Runtime Integration Rules

The Rust Local Runtime is responsible for privileged local operations.

Frontend requirements:

- IPC operations use typed contracts.
- Long operations expose progress.
- Cancellation behavior is defined.
- Filesystem access is scoped.
- Toolchain errors are actionable.
- Build logs are bounded and safely rendered.
- Secrets are redacted.
- Source content is not copied into remote telemetry.
- Package operations are independently validated.
- Native operation failures do not corrupt project metadata.

## 21. Security Dependencies

Security controls are required across every frontend milestone.

Required controls include:

- authentication
- authorization
- tenant-aware navigation and data access
- secure session handling
- safe IPC
- local credential protection
- source privacy
- artifact integrity
- safe download handling
- WebSocket authorization
- video session authorization
- log redaction
- secure error presentation
- dependency scanning

UI visibility is not an authorization boundary.

Every protected backend operation must enforce authorization independently.

## 22. Source-Code Privacy Dependencies

The source-code privacy boundary is a cross-milestone requirement.

The normal workflow is:

    Local Project Source
           |
           v
    Local Runtime
           |
           v
    Local Build and Test
           |
           v
    Package and Validate
           |
           v
    Approved Artifact
           |
           v
    Remote Artifact Upload

The frontend must not:

- upload source archives
- attach source files to API requests
- include source in crash reports
- include source in telemetry
- include source in diagnostic bundles by default
- include source maps in remote packages unless explicitly required and approved
- silently transfer local credentials

Source-privacy tests must be run against representative workflows.

## 23. Accessibility and UX Dependencies

Every milestone must preserve:

- keyboard navigation
- focus visibility
- semantic controls
- screen-reader labels
- sufficient contrast
- scalable layout
- clear validation
- clear error messages
- predictable navigation
- loading feedback
- empty-state guidance
- destructive-action confirmation where appropriate

Accessibility must be included in implementation acceptance, not postponed until production qualification.

## 24. Cross-Platform Dependencies

P0-P1 development establishes the initial Studio foundation.

Frontend validation must cover the supported targets specified by the current milestone and release scope.

The frontend must not assume that:

- filesystem paths are identical across operating systems
- process execution behaves identically
- environment variables have identical conventions
- native credential storage is identical
- file locking behaves identically
- toolchains are installed in the same locations

Cross-platform behavior must be implemented behind appropriate abstractions.

## 25. Testing Strategy

Testing follows this sequence:

    Unit Tests
        |
        v
    Component Tests
        |
        v
    API Contract Tests
        |
        v
    IPC Tests
        |
        v
    Integration Tests
        |
        v
    End-to-End Tests
        |
        v
    Cross-Platform Tests
        |
        v
    Release Qualification

Testing must cover:

- successful workflows
- validation failures
- network failures
- authorization failures
- duplicate operations
- stale data
- reconnect
- cancellation
- timeout
- large result sets
- accessibility
- source privacy
- platform-specific behavior

## 26. Integration Gates

| Gate | Frontend requirement |
|---|---|
| G0 | F-M01 STUDIO FOUNDATION foundation is usable |
| G1 | F-M02 PROJECTS supports local project workflows |
| G2 | F-M03 BUILD & ARTIFACT generates a trusted artifact |
| G3 | Control Plane contracts support required frontend integration |
| G4 | F-M04 BOOKING supports authoritative booking workflows |
| G5 | F-M05 EXECUTION supports durable Job/Run workflows |
| G6 | Lab integration provides safe and authorized status |
| G7 | F-M06 LIVE and F-M07 RESULTS support observation and analysis |
| G8 | Frontend release is qualified for production use |

Gate identifiers are integration checkpoints, not new phases or milestones.

## 27. Frontend Critical Path

The principal frontend critical path is:

    F-M01 STUDIO FOUNDATION
              |
              v
        F-M02 PROJECTS
              |
              v
    F-M03 BUILD & ARTIFACT
              |
              v
        F-M04 BOOKING
              |
              v
       F-M05 EXECUTION
              |
              +-------------+
              |             |
              v             v
          F-M06 LIVE    F-M07 RESULTS

The actual delivery path also depends on backend, database, cloud, protocol, and security readiness.

The frontend team should stabilize each milestone's contract dependencies before treating the milestone as integrated.

## 28. Parallel Work Opportunities

Parallel work is allowed when interfaces and ownership are clear.

Examples:

- F-M01 STUDIO FOUNDATION with DB-M01 FOUNDATION.
- F-M02 PROJECTS with backend project API implementation.
- F-M03 BUILD & ARTIFACT with B-M02 ARTIFACT.
- F-M04 BOOKING with B-M04 BOOKING.
- F-M05 EXECUTION with B-M05 EXECUTION.
- F-M06 LIVE with live transport implementation.
- F-M07 RESULTS with B-M06 RESULTS.

Parallel implementation must use agreed schemas and mocks.

Mocks must be replaced or validated against real contracts before acceptance.

## 29. Frontend Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| Source-code leakage | Critical privacy failure | Local-source tests and package scanning |
| Contract drift | Integration failures | Shared schemas and contract tests |
| Incorrect authorization assumptions | Data exposure | Backend-enforced authorization |
| Stale booking availability | Incorrect booking UX | Revalidate with the backend |
| Duplicate booking requests | Duplicate business operations | Idempotency and UI submission control |
| Job/Run confusion | Incorrect execution status | Separate models and screens |
| Reconnect restarts execution | Unsafe behavior | Reconnect only refreshes state |
| Stale telemetry shown as current | Misleading operator information | Freshness indicators |
| Video failure misreported as execution failure | Incorrect state | Independent transport status |
| Unauthorized downloads | Data exposure | Short-lived authorization and backend checks |
| Large result rendering | UI instability | Pagination and bounded rendering |
| Platform-specific filesystem behavior | Build failures | Native abstraction and platform testing |
| Missing protocol contract | Integration blockage | Track as explicit dependency |
| Inaccessible controls | Usability failure | Accessibility checks in CI |
| Incorrect safety presentation | Potential physical risk | Fail-safe display and safety review |

## 30. Milestone Readiness Rules

A frontend milestone is ready for implementation when:

- objective is clear
- milestone dossier is reviewed
- dependencies are identified
- contracts are available or controlled substitutes are approved
- acceptance criteria are defined
- security impact is assessed
- testing approach is known
- owner is assigned

A frontend milestone is complete only when:

- implementation is present
- tests pass
- integration succeeds
- required review is complete
- documentation is updated
- acceptance evidence is recorded
- tracking status is updated
- no unresolved blocking issue remains

## 31. Frontend-to-Backend Integration Checklist

- [ ] Authentication contract is stable.
- [ ] Authorization behavior is defined.
- [ ] Organization context is explicit.
- [ ] Project contract is stable.
- [ ] Platform contract is stable.
- [ ] Artifact manifest contract is stable.
- [ ] Artifact upload behavior is stable.
- [ ] Booking contract is stable.
- [ ] Credit contract is stable.
- [ ] Job contract is stable.
- [ ] Run contract is stable.
- [ ] WebSocket event contract is stable.
- [ ] WebRTC signaling contract is stable.
- [ ] Telemetry contract is stable.
- [ ] Result contract is stable.
- [ ] Download contract is stable.
- [ ] Error behavior is consistent.
- [ ] Idempotency is defined for retryable operations.
- [ ] Contract tests pass.

## 32. Frontend Release Readiness Checklist

- [ ] All in-scope milestone acceptance criteria are satisfied.
- [ ] Unit tests pass.
- [ ] Component tests pass.
- [ ] Contract tests pass.
- [ ] Integration tests pass.
- [ ] End-to-end tests pass.
- [ ] Accessibility checks pass.
- [ ] Source-privacy checks pass.
- [ ] Security review is complete.
- [ ] Cross-platform tests pass for supported targets.
- [ ] API compatibility is verified.
- [ ] Error and reconnect behavior is tested.
- [ ] Release evidence is recorded.
- [ ] Known issues are documented.
- [ ] Rollback or recovery requirements are documented.

## 33. Roadmap Governance

This roadmap should be updated when:

- frontend milestone dependencies change
- an approved contract changes
- integration ordering changes
- frontend scope changes through formal approval
- a critical risk changes
- supported platforms change
- release qualification changes

Progress belongs in `docs/tracking/`.

Phase definitions belong in `docs/planning/PHASES.md`.

Program sequencing belongs in `docs/planning/IMPLEMENTATION_ROADMAP.md`.

Cross-domain dependency relationships belong in `docs/planning/DEPENDENCY_MAP.md`.

Detailed frontend milestone scope belongs in `docs/frontend/milestones/`.

## 34. Change Control

Changes to this roadmap must preserve the frozen phase and milestone names and identifiers.

A change that affects another domain must identify:

- affected frontend milestone
- affected backend milestone
- affected database milestone
- affected cloud milestone
- affected protocol
- affected security requirement
- acceptance impact
- schedule impact
- testing impact

A phase change requires formal approval and an update to `docs/planning/PHASES.md`.

A milestone scope change must be recorded in the authoritative milestone dossier.

## 35. Frontend Roadmap Acceptance Checklist

- [ ] F-M01 STUDIO FOUNDATION maps to P0-P1.
- [ ] F-M02 PROJECTS maps to P1.
- [ ] F-M03 BUILD & ARTIFACT maps to P2.
- [ ] F-M04 BOOKING maps to P4.
- [ ] F-M05 EXECUTION maps to P5.
- [ ] F-M06 LIVE maps to P7.
- [ ] F-M07 RESULTS maps to P7.
- [ ] Backend dependencies use canonical milestone IDs.
- [ ] Database dependencies use canonical milestone IDs.
- [ ] Cloud dependencies use canonical milestone IDs.
- [ ] Protocol dependencies are explicit.
- [ ] Security dependencies are explicit.
- [ ] Source-code privacy is preserved.
- [ ] Job and Run remain distinct.
- [ ] Live observation is separated from durable state.
- [ ] Safety state is represented conservatively.
- [ ] Risks and mitigations are documented.
- [ ] Milestone dossiers remain authoritative for scope.
- [ ] Phase definitions are delegated to `docs/planning/PHASES.md`.
- [ ] No retired phase or milestone names remain.

## 36. Final Frontend Invariants

1. `docs/planning/PHASES.md` is the canonical phase definition.
2. The frozen frontend milestone IDs and names must remain stable.
3. Frontend milestone dossiers are authoritative for frontend scope.
4. Backend contracts are authoritative for remote business operations.
5. The frontend must not bypass authorization.
6. Customer source code remains local during the normal workflow.
7. Only approved artifacts cross the remote execution boundary.
8. Booking and credit state are server authoritative.
9. Job and Run remain distinct.
10. Durable state is authoritative over transient live events.
11. Reconnect must not restart execution.
12. Video, telemetry, logs, and execution state may have independent transport health.
13. Unknown safety state is not safe.
14. Software Stop is not emergency stop.
15. Result history remains independently addressable.
16. Rerun creates a new Job and Run.
17. Cross-domain contracts must be verified.
18. Security and privacy tests are mandatory.
19. Accessibility is part of acceptance.
20. Milestone completion is evidence-based.

## 37. Changelog

### Current Baseline

- Aligned the frontend roadmap with `docs/planning/PHASES.md`.
- Established the frozen F-M01 through F-M07 milestone mapping.
- Aligned backend dependencies with canonical milestone identifiers.
- Aligned database dependencies with canonical milestone identifiers.
- Aligned cloud dependencies with canonical milestone identifiers.
- Defined frontend critical path and integration gates.
- Defined protocol dependencies.
- Defined frontend security and privacy requirements.
- Defined milestone and release acceptance.
- Removed retired phase and milestone terminology.

### Future Changes

Future changes must record:

- Date.
- Change request identifier.
- Affected frontend milestone.
- Affected phase.
- Affected backend, database, or cloud dependencies.
- Contract impact.
- Security impact.
- Testing impact.
- Approval.
- Effective date.
