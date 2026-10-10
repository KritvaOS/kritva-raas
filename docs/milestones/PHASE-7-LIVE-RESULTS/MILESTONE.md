# P7 LIVE & RESULTS — Milestone Dossier

**Primary Phase:** P7 LIVE & RESULTS

**Supporting Phases:** P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE; P4 BOOKING & COMMERCIAL; P5 EXECUTION; P6 LAB & ROBOT; P8 PRODUCTION

**Document Type:** Phase-level milestone dossier

**Status:** Planning baseline

**Scope Authority:** This document defines the phase-level objectives, boundaries, dependencies, deliverables, risks, and exit criteria for P7 LIVE & RESULTS. The milestone dossiers under `docs/**/milestones/` are authoritative for their respective milestone scopes.

---

## Ownership and Boundaries

### What this document owns

This document owns the phase-level definition of P7 LIVE & RESULTS, focused on live video, live telemetry, and execution results.

It establishes the expected behavior and integration boundaries for:

- Live video acquisition and presentation workflows.
- Live telemetry acquisition from approved upstream interfaces and presentation to authorized consumers.
- Association of video and telemetry with the correct resource, session, and execution context.
- Live-session lifecycle and user-visible connection state.
- Stream health, freshness, interruption, and recovery reporting.
- Results ingestion, normalization, persistence handoff, and presentation.
- Correlation between execution identity, resource identity, live-session identity, and result records.
- Clear distinction between live observations, completed execution results, and derived summaries.
- Access control and data provenance requirements for video, telemetry, and results.
- Integration handoffs to P5 EXECUTION, P6 LAB & ROBOT, and P8 PRODUCTION.
- Phase-level deliverables, dependencies, risks, and exit criteria.

This dossier defines outcomes and boundaries, not implementation-level API specifications, database schemas, media transport configuration, UI component designs, or detailed test procedures.

### What this document does not own

The following responsibilities remain with their authoritative documents and phases:

- Canonical phase definitions: `docs/planning/PHASES.md`.
- System-level architecture and decisions: `docs/architecture/` and `docs/planning/DECISIONS.md`.
- Frontend implementation patterns and application structure: `docs/frontend/`.
- Backend service architecture and implementation: `docs/backend/architecture/`.
- API wire contracts: `docs/protocol/API_CONTRACT.md`.
- Realtime and event contracts: the applicable documents under `docs/protocol/`.
- Global authentication, authorization, trust boundaries, and application security: `docs/architecture/SECURITY_ARCHITECTURE.md` and `docs/security/`.
- Database schemas, migrations, indexing, retention, and recovery: `docs/database/architecture/DATABASE_ARCHITECTURE.md`.
- Cloud media transport, network topology, infrastructure, scaling, and deployment: `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.
- Global testing policy: `docs/development/TESTING_STRATEGY.md`.
- Global release policy: `docs/development/RELEASE_PROCESS.md`.
- Booking and commercial eligibility: P4 BOOKING & COMMERCIAL.
- Execution orchestration and authoritative execution lifecycle: P5 EXECUTION.
- Lab Agent and physical robot telemetry acquisition: P6 LAB & ROBOT.
- Production deployment and operational readiness: P8 PRODUCTION.

The P7 phase directory contains the following sibling files, which own the detailed milestone workflow:

- [`TASKS.md`](TASKS.md) — task decomposition, sequencing, dependencies, and ownership.
- [`ACCEPTANCE_CRITERIA.md`](ACCEPTANCE_CRITERIA.md) — detailed pass/fail criteria and required evidence.
- [`REVIEW_CHECKLIST.md`](REVIEW_CHECKLIST.md) — review actions and evidence inspection.
- [`CHANGELOG.md`](CHANGELOG.md) — accepted changes and milestone history.
- [`GIT_COMMIT_STEP.md`](GIT_COMMIT_STEP.md) — repository and commit procedure.

This dossier links to those files instead of reproducing their contents.

### Ownership map

| Concern | Authoritative owner | P7 relationship |
|---|---|---|
| Canonical phase definitions | `docs/planning/PHASES.md` | Uses the frozen phase model |
| System architecture | `docs/architecture/` | Follows system-wide ownership boundaries |
| System-level decisions | `docs/planning/DECISIONS.md` | Consumes approved cross-domain decisions |
| Frontend implementation | `docs/frontend/` | Implements live and results user experiences |
| Backend implementation | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` | Implements live-session and results services |
| API wire contract | `docs/protocol/API_CONTRACT.md` | Uses approved request, response, and error semantics |
| Realtime/event contracts | Applicable documents under `docs/protocol/` | Uses approved stream and event contracts |
| Application security | `docs/architecture/SECURITY_ARCHITECTURE.md` and `docs/security/` | Applies access, trust, and data-protection requirements |
| Database implementation | `docs/database/architecture/DATABASE_ARCHITECTURE.md` | Persists results and required metadata |
| Cloud implementation | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` | Supplies streaming, storage, networking, and deployment infrastructure |
| Global testing strategy | `docs/development/TESTING_STRATEGY.md` | Follows common verification policy |
| Global release process | `docs/development/RELEASE_PROCESS.md` | Follows shared release policy |
| Booking and commercial state | P4 BOOKING & COMMERCIAL dossier and domain documents | Supplies authorized booking context |
| Execution orchestration and lifecycle | P5 EXECUTION dossier and domain documents | Supplies execution identity and lifecycle events |
| Physical telemetry acquisition | P6 LAB & ROBOT dossier and domain documents | Supplies target-side telemetry and fault context |
| Live video, telemetry consumption, and results outcomes | This document | Authoritative at phase level |
| P7 tasks and sequencing | `TASKS.md` | Authoritative for task decomposition |
| P7 acceptance | `ACCEPTANCE_CRITERIA.md` | Authoritative for detailed acceptance |
| P7 review | `REVIEW_CHECKLIST.md` | Authoritative for review execution |
| P7 change history | `CHANGELOG.md` | Authoritative for accepted history |
| P7 Git procedure | `GIT_COMMIT_STEP.md` | Authoritative for commit procedure |

---

## 1. Objective

P7 LIVE & RESULTS establishes the platform capabilities needed to observe an authorized execution in progress and inspect its outcomes after completion.

The phase connects the execution and physical-resource information produced by earlier phases to an authorized user-facing experience. It provides the live video and telemetry views needed for observation, along with a reliable results path that preserves execution identity, resource context, timestamps, data provenance, and outcome status.

P7 must make it possible to distinguish what is happening now from what happened previously, what the platform has confirmed, and what remains unknown or incomplete.

### 1.1 Primary outcomes

P7 is intended to deliver the following outcomes:

1. Authorized users can open a live session for an eligible execution or resource.
2. The application can display live video when the configured source and transport are available.
3. The application can display supported telemetry with meaningful units, timestamps, and validity information.
4. Video, telemetry, and execution state can be correlated with the correct session, resource, and execution.
5. Users can distinguish a connected stream from a stale, interrupted, or unavailable stream.
6. Stream interruptions and recovery are visible rather than silently concealed.
7. Execution lifecycle updates are reflected accurately in the live experience.
8. Completed execution results can be retrieved and presented consistently.
9. Results preserve the relationship to their originating execution and resource.
10. Incomplete, failed, cancelled, or uncertain executions are not represented as successful results.
11. Authorized consumers can inspect the result information permitted by their access scope.
12. Video, telemetry, and results follow the approved security and data-protection boundaries.
13. Live-session and results services provide sufficient diagnostics for troubleshooting.
14. The experience remains understandable when optional video or telemetry sources are unavailable.
15. The integration is verifiable through automated tests and controlled end-to-end evidence.

### 1.2 Live observation outcome

The live experience provides an authorized view of the execution and resource state while the operation is in progress.

It may include:

- Video from an approved camera or streaming source.
- Telemetry from the supported physical or lab integration.
- Execution lifecycle and progress.
- Resource and connection health.
- Stream freshness and interruption indicators.
- Relevant fault notifications.
- Session identity and execution correlation.

The live view must not imply that video or telemetry is available merely because an execution has started. Each source has its own connection, availability, freshness, and validity state.

### 1.3 Results outcome

The results experience presents the confirmed outcome and associated information for an execution.

Depending on the accepted execution contract, results may include:

- Execution identity and final status.
- Start and completion timestamps.
- Resource identity.
- Summary metrics.
- Structured output data.
- Artifact or log references.
- Selected telemetry summaries.
- Failure or cancellation details.
- Relevant diagnostics.
- Links to associated live-session or stored evidence where permitted.

P7 must preserve the distinction between raw observations, execution events, persisted outputs, and derived summaries. A summary must not overwrite or misrepresent the underlying evidence.

### 1.4 Data integrity outcome

The phase must ensure that live and results information remains attributable to its source.

At a minimum, the system must preserve the identifiers and metadata required to associate each data item with the appropriate execution, resource, and session.

Timestamps, units, source identity, validity, and completion status must be represented according to the approved contracts. If an association cannot be established, the system must expose the uncertainty rather than attach the data to a guessed execution.

### 1.5 Security outcome

P7 handles potentially sensitive video, physical telemetry, execution output, and diagnostic information.

The phase must apply the approved identity and authorization model to:

- Opening a live session.
- Viewing video.
- Subscribing to telemetry.
- Retrieving execution results.
- Accessing logs and artifacts associated with an execution.
- Reconnecting to an existing session.
- Accessing historical results after execution completion.

Access to a project or execution does not automatically grant access to every associated media source or diagnostic record. Authorization must follow the applicable security and resource-scope rules.

### 1.6 Completion principle

P7 is complete when the agreed live video and telemetry experience, execution-state presentation, and results workflow operate through approved contracts, preserve correct data association and authorization, and provide adequate evidence under normal and failure conditions.

A rendered video frame alone is not sufficient evidence. The phase must also demonstrate correct session identity, stream-state reporting, telemetry interpretation, execution correlation, results integrity, access control, and recoverable failure behavior.

Detailed task-level acceptance criteria are maintained in `ACCEPTANCE_CRITERIA.md`.

---

## 2. Scope and non-scope

### 2.1 In-scope capabilities

P7 includes live observation and results capabilities required to provide an authorized, understandable, and traceable view of execution activity and outcomes.

#### 2.1.1 Live-session lifecycle

P7 includes the application and service behavior needed to establish and manage a live observation session.

The lifecycle must define:

- How an authorized user requests a live session.
- Which execution or resource the session refers to.
- How the request is validated.
- How a session is established or rejected.
- How connection state is reported.
- How the session is closed.
- How interruption and recovery are represented.
- How session expiration or access revocation is handled.
- How the session is correlated with execution and resource identifiers.
- How the system behaves when no live source is available.

The live-session lifecycle is not a second execution lifecycle. P5 EXECUTION remains authoritative for execution orchestration, while P7 owns the observation session and its user-facing state.

#### 2.1.2 Live video integration

P7 includes consumption and presentation of video from an approved source through the selected media contract.

The implementation must support the agreed video workflow, which may include:

- Resolving the approved video source for a resource or execution.
- Establishing an authorized viewing session.
- Presenting the stream using the selected transport.
- Showing connection and playback state.
- Reporting unavailable or interrupted video.
- Recovering from supported transient failures.
- Releasing session resources when viewing ends.
- Associating the stream with the correct resource and execution context.
- Avoiding exposure of unauthorized stream URLs or credentials.
- Presenting an understandable state when no video is configured.

The exact media transport, codec support, relay architecture, source configuration, and infrastructure topology belong to the protocol and cloud architecture documents.

P7 defines the product-level behavior and required integration outcomes, not a universal video transport implementation.

#### 2.1.3 Video availability and quality state

The live experience must distinguish stream availability from playback quality and freshness.

Where the underlying transport provides sufficient information, the experience should expose:

- Connecting.
- Connected and receiving media.
- Temporarily interrupted.
- Reconnecting.
- Unavailable.
- Failed.
- Closed or expired.

Additional quality information may include latency, frame rate, resolution, or dropped-frame indicators when available and useful for the accepted scope.

The interface must not invent quality metrics that the transport does not provide. If a quality indicator is unavailable, the UI must not imply that the stream has been measured or verified.

#### 2.1.4 Live telemetry consumption

P7 includes receiving and presenting telemetry supplied through approved interfaces.

Telemetry may include, depending on the supported resource:

- Position or joint feedback.
- Velocity or movement state.
- Sensor readings.
- Controller state.
- Resource health.
- Execution progress.
- Fault and warning events.
- Operational mode.
- Relevant environment measurements.

P6 LAB & ROBOT owns the acquisition and target-facing interpretation of physical telemetry. P7 consumes the published telemetry contract and presents the information with its required metadata.

P7 must not silently reinterpret hardware-specific measurements or introduce undocumented scaling and unit conversions.

#### 2.1.5 Telemetry presentation and freshness

The live experience must make the current state and quality of telemetry understandable.

The implementation should:

- Display units where needed to interpret a value.
- Preserve timestamps or age information where relevant.
- Distinguish current values from stale values.
- Indicate missing or unavailable telemetry.
- Represent invalid measurements according to the contract.
- Avoid presenting missing data as zero.
- Avoid presenting stale values as live observations.
- Associate readings with the correct resource and execution.
- Handle telemetry sources that update at different rates.
- Avoid blocking the entire live experience because an optional telemetry channel is unavailable.

The required behavior depends on the agreed telemetry contract and the accepted resource configuration.

#### 2.1.6 Execution-state presentation

P7 consumes authoritative execution events and presents the state needed to understand a live or completed operation.

The presentation may include:

- Queued or pending status where relevant to the active workflow.
- Starting or initialization status.
- Running status.
- Progress information when available.
- Completion.
- Failure.
- Cancellation.
- Timeout or uncertain outcome.
- Relevant fault information.

P5 EXECUTION owns the lifecycle model, state transitions, and authoritative execution status. P7 must not invent a competing state machine or declare success based solely on the disappearance of video, cessation of telemetry, or closure of a session.

#### 2.1.7 Correlation across live data

P7 must associate video, telemetry, execution events, and session information with the correct context.

The relevant identifiers may include:

- Project or workspace.
- Resource.
- Booking, where applicable.
- Execution.
- Live session.
- Video source.
- Telemetry source.
- Result record.

Not every data item requires every identifier. The applicable contracts define which references are mandatory.

P7 must reject, isolate, or visibly report data that cannot be safely associated with the intended session. It must not guess an execution association based solely on arrival time or a display label.

#### 2.1.8 Live event handling

The live experience may consume events indicating:

- Execution state changes.
- Stream connection changes.
- Telemetry availability changes.
- Resource health changes.
- Faults and warnings.
- Session lifecycle changes.
- Relevant result availability.

Event ordering, delivery guarantees, schemas, and transport behavior are owned by the applicable protocol and backend documents.

P7 must handle duplicate, delayed, or missing updates according to the approved contract. The user interface must not regress to an older state merely because an earlier event arrives late.

#### 2.1.9 Results retrieval

P7 includes the user-facing and service integration behavior required to retrieve results for an authorized execution.

The results workflow must:

- Resolve the requested execution.
- Verify the caller's access.
- Retrieve the available result record or references.
- Represent the execution outcome accurately.
- Present the available result fields.
- Indicate when results are still being produced.
- Indicate when results are unavailable.
- Handle missing or expired referenced data.
- Preserve links to the originating execution and resource.
- Avoid confusing partial results with final results.

The authoritative execution status comes from P5 EXECUTION. P7 presents the status and associated results according to the approved result contract.

#### 2.1.10 Results data model at the product boundary

P7 defines the information required for a coherent results experience, without owning the physical database schema.

The accepted result representation may include:

- Execution identifier.
- Resource identifier.
- Final execution status.
- Start and end timestamps.
- Duration where derivation is valid.
- Summary metrics.
- Structured output references.
- Relevant logs or artifacts.
- Selected telemetry summaries.
- Error or failure information.
- Result availability and completeness state.
- Links to authorized supporting evidence.

Each field must have a defined meaning and source. Derived values must be distinguishable from directly reported values when that distinction matters.

Database tables, indexes, migrations, partitioning, retention, and backup behavior belong to the database domain.

#### 2.1.11 Result completeness and finality

P7 must distinguish between an execution that has finished and a result set that is fully available.

The system may encounter:

- An execution still in progress.
- A terminal execution whose result processing is pending.
- A result set containing partial outputs.
- A failed execution with diagnostic output.
- A completed execution with optional data missing.
- An unavailable or expired artifact reference.
- A result whose integrity check failed.

The interface must represent these conditions accurately. It must not convert incomplete data into a successful final result or hide material errors.

The precise terminal-state semantics and completion events remain owned by P5 EXECUTION and the relevant result contract.

#### 2.1.12 Results history and discovery

P7 includes the result discovery experience within the accepted product scope.

Authorized users should be able to locate results through the approved project and execution context. The supported workflow may include filtering by status, resource, date, or other fields already available through the authoritative API.

P7 does not own the global project model, resource registry, or execution query architecture. It consumes the applicable API contracts.

Search indexing, advanced analytics, broad reporting, and data warehouse capabilities are outside scope unless explicitly approved.

#### 2.1.13 Supporting evidence access

Where the result contract provides links to logs, artifacts, video recordings, or other evidence, P7 may expose those references to authorized users.

The implementation must:

- Preserve the originating execution association.
- Respect access restrictions for each referenced item.
- Handle missing or expired objects.
- Avoid exposing long-lived credentials in the UI.
- Indicate when supporting evidence is not available.
- Avoid implying that a reference is valid before it has been verified by the owning service.

Artifact storage and retrieval are owned by the relevant artifact, backend, and cloud documents. P7 owns the user-facing integration and correct association.

#### 2.1.14 Session and resource access control

P7 must enforce the approved access policy when users open live sessions or retrieve results.

The phase includes:

- Requiring an authenticated principal where applicable.
- Checking access to the project, execution, and resource.
- Respecting the relevant authorization scope.
- Protecting live stream credentials and session tokens.
- Preventing cross-project data exposure.
- Handling expired or revoked access.
- Avoiding reliance on unguessable identifiers as authorization.
- Applying access rules to supporting evidence references.

Global identity, authorization policy, credential management, and trust-boundary design remain with the security and control-plane owner documents.

#### 2.1.15 Live-session termination and cleanup

P7 includes clean termination of a viewing session and release of associated application resources.

The behavior must address:

- User-initiated close.
- Navigation away from the live view.
- Session expiration.
- Access revocation.
- Source disconnection.
- Application shutdown.
- Reconnection failure.
- Resource or execution becoming unavailable.

The implementation must not retain media sessions indefinitely after they are no longer required. Exact transport teardown and resource accounting belong to the backend and cloud implementation documents.

Closing a live observation session must not be treated as cancelling the underlying execution unless the user explicitly invokes a separate authorized execution action.

#### 2.1.16 Error handling and user feedback

P7 must provide understandable feedback for common live and results failures.

Examples include:

- Access denied.
- Execution not found.
- Live source not configured.
- Video connection failure.
- Telemetry unavailable.
- Session expired.
- Resource disconnected.
- Results pending.
- Results unavailable.
- Supporting evidence expired.
- Data integrity validation failed.

The experience should explain what is unavailable without exposing secrets, internal infrastructure details, or sensitive diagnostic payloads.

Error codes and wire-level error structure are owned by the protocol and backend documents. P7 maps those errors into appropriate user-facing behavior.

#### 2.1.17 Accessibility and usability

The live and results experiences must remain usable when data is changing rapidly or when one or more data sources fail.

The accepted scope should address:

- Clear labels for live and final states.
- Readable timestamps and units.
- Visible stale and unavailable states.
- Keyboard-accessible controls.
- Appropriate focus management.
- Accessible status announcements where necessary.
- Error messages that explain the next useful action.
- A clear distinction between live data and historical results.
- Avoidance of color-only status encoding.
- Graceful behavior when video is unavailable but other information remains available.

Detailed frontend design conventions and accessibility testing policy belong to the frontend and global testing documents.

#### 2.1.18 Operational diagnostics

P7 must provide sufficient diagnostic context for investigating live and results failures.

Relevant diagnostics may include:

- Session creation and termination.
- Stream connection and interruption.
- Telemetry subscription and freshness.
- Execution state updates.
- Results retrieval and completeness.
- Authorization rejection.
- Correlation failures.
- Missing or expired evidence references.
- Relevant integration errors.

Logs, metrics, tracing, dashboards, alert rules, retention, and production incident procedures belong to the backend, cloud, security, and production owner documents.

#### 2.1.19 Performance and responsiveness

P7 includes performance verification for the accepted live and results workflow.

The team must establish appropriate acceptance targets for:

- Live-session establishment.
- Time to first usable video frame when video is configured.
- Telemetry display freshness.
- Execution-state update latency.
- Results retrieval latency.
- UI responsiveness during stream interruption and recovery.
- Resource cleanup after session termination.

Targets must be grounded in the selected transport, hardware, network, and staging environment. This dossier does not invent universal latency or frame-rate guarantees.

Capacity planning, infrastructure sizing, production scaling, and service-level objectives belong to the appropriate cloud and production documents.

### 2.2 Live video scope boundary

P7 owns the integration and presentation outcome for live video. It does not own the entire video infrastructure stack.

The phase must define the product behavior expected from the selected source and transport, including connection state, authorization, interruption handling, and association with the correct resource and execution.

The following are owned elsewhere:

- Camera hardware and firmware: hardware and lab integration owners.
- Video source configuration at the physical target: P6 LAB & ROBOT and the applicable hardware owner.
- Transport and event protocol definitions: `docs/protocol/`.
- Media relay, network topology, storage, and infrastructure provisioning: cloud architecture and implementation documents.
- Frontend player components and application structure: `docs/frontend/`.
- Global media security policy: security owner documents.
- Production media capacity and operations: P8 PRODUCTION.

P7 must not claim end-to-end video availability when the source, network, or media service is unavailable.

### 2.3 Telemetry scope boundary

P7 owns the consumption and presentation of telemetry through approved contracts.

P6 LAB & ROBOT owns the target-facing acquisition and mapping of physical signals. P7 must preserve the published meaning, units, timestamp, validity, and provenance information.

P7 must not:

- Reimplement hardware-driver acquisition.
- Guess units or scaling.
- Convert missing values to plausible-looking defaults.
- Treat stale values as current.
- Infer physical safety from a telemetry display.
- Create a competing resource-health model.

Where telemetry semantics are insufficient, the integration must return to the contract owner for clarification rather than inventing new semantics in the presentation layer.

### 2.4 Results scope boundary

P7 owns the results retrieval, presentation, and user-facing interpretation required by the accepted workflow.

It does not own the authoritative execution lifecycle or the full internal result-generation pipeline.

P5 EXECUTION owns execution orchestration and authoritative lifecycle state. Backend and artifact owners define the relevant result-producing services and artifact references. The database domain owns persistence design.

P7 must not infer successful execution from the presence of output files, the closure of a stream, or the absence of an error message. The final outcome must come from the approved execution and results contracts.

### 2.5 Explicit non-scope

The following are outside P7 LIVE & RESULTS unless explicitly approved through a documented scope change:

- Global repository setup, coding standards, and development workflow.
- Studio foundation, project administration, and project authorization implementation.
- Build execution and artifact creation internals.
- Global identity-provider implementation and credential issuance.
- Booking creation, reservation conflict resolution, credits, billing, and commercial policy.
- Remote execution dispatch, scheduling, retry policy, and authoritative execution lifecycle.
- Lab Agent implementation and physical robot driver development.
- Physical sensor acquisition and controller-specific telemetry mapping.
- Design or certification of robot safety systems.
- A universal media relay or video platform beyond the accepted integration.
- A general-purpose video recording, editing, or media-management product.
- Advanced analytics, business intelligence, or arbitrary data warehouse queries.
- General-purpose result computation unrelated to the accepted execution workflow.
- Database schema and migration implementation.
- Cloud network architecture, infrastructure provisioning, and secret distribution.
- Production deployment, production scaling, and operational on-call procedures.
- Changes to upstream contracts without the relevant owner review.
- Claims of guaranteed stream latency, availability, or safety without supporting evidence.

P7 may integrate with these capabilities through approved contracts. It must not duplicate their ownership because they are dependencies of the live or results experience.

### 2.6 Canonical phase relationship table

| Phase | Relationship to P7 | Boundary |
|---|---|---|
| P0 FOUNDATION | Supplies common repository, build, and engineering foundations | P7 follows shared engineering conventions |
| P1 STUDIO | Supplies the Studio foundation and project-facing context | P7 integrates with the established application |
| P2 BUILD & ARTIFACT | Supplies artifact creation and artifact references | P7 consumes authorized supporting evidence where required |
| P3 CONTROL PLANE | Supplies identity, authorization context, projects, platforms, and artifact registration | P7 consumes approved control-plane contracts |
| P4 BOOKING & COMMERCIAL | Supplies booking and commercial context | P7 presents only authorized booking-related context needed by the workflow |
| P5 EXECUTION | Owns execution orchestration and authoritative lifecycle | P7 presents execution state and consumes execution results |
| P6 LAB & ROBOT | Owns Lab Agent and physical-resource integration | P7 consumes approved video, telemetry, and physical-resource events |
| P7 LIVE & RESULTS | Owns live observation and results outcomes | Provides authorized live video/telemetry experience and results access |
| P8 PRODUCTION | Owns production deployment and operational readiness | Establishes production controls for live and results services |

### 2.7 Canonical cross-domain milestone mapping

| Domain | Canonical milestone | Relationship to P7 |
|---|---|---|
| Frontend | F-M01 STUDIO FOUNDATION (P0-P1) | Supplies the shared Studio foundation |
| Frontend | F-M02 PROJECTS (P1) | Supplies project-facing context |
| Frontend | F-M03 BUILD & ARTIFACT (P2) | Supplies artifact-related user experience |
| Frontend | F-M04 BOOKING (P4) | Supplies booking-related context |
| Frontend | F-M05 EXECUTION (P5) | Supplies execution initiation and status experience |
| Frontend | F-M06 LIVE (P7) | Owns live observation UI |
| Frontend | F-M07 RESULTS (P7) | Owns results UI |
| Backend | B-M01 CONTROL PLANE (P3) | Supplies identity and control-plane contracts |
| Backend | B-M02 ARTIFACT (P2-P3) | Supplies artifact registration, discovery, and references |
| Backend | B-M03 PLATFORM (P3) | Supplies platform and resource metadata |
| Backend | B-M04 BOOKING (P4) | Supplies booking and commercial eligibility |
| Backend | B-M05 EXECUTION (P5) | Supplies authoritative execution lifecycle and dispatch |
| Backend | B-M06 RESULTS (P6-P7) | Covers result-service behavior within its defined scope |
| Backend | B-M07 PRODUCTION (P8) | Owns production backend readiness and operations |
| Database | DB-M01 FOUNDATION (P0-P3) | Supplies foundational persistence conventions |
| Database | DB-M02 CORE DATA (P3) | Supplies control-plane data and relationships |
| Database | DB-M03 BOOKING DATA (P4) | Owns booking and commercial persistence |
| Database | DB-M04 EXECUTION DATA (P5-P7) | Persists execution, lab, and results data within its defined scope |
| Cloud | C-M01 FOUNDATION (P0) | Supplies foundational cloud conventions |
| Cloud | C-M02 DEVELOPMENT (P1-P3) | Supplies development infrastructure and environments |
| Cloud | C-M03 STAGING (P4-P7) | Supplies staging infrastructure for live and results integration |
| Cloud | C-M04 PRODUCTION (P8) | Owns production infrastructure and operational readiness |

### 2.8 Required integration invariants

All P7 implementations must preserve the following invariants:

- **Authorized observation:** live sessions and result records are accessible only to authorized principals.
- **Correct association:** video, telemetry, events, and results are associated with the correct execution and resource.
- **Authoritative execution state:** P5 EXECUTION remains the source of execution lifecycle truth.
- **Target-side provenance:** physical telemetry preserves the source and semantics established by P6 LAB & ROBOT.
- **Truthful stream state:** connected, interrupted, stale, and unavailable streams are distinguishable.
- **Truthful result state:** incomplete or uncertain outcomes are not represented as successful final results.
- **Data quality:** missing, stale, invalid, and unavailable data is not silently fabricated.
- **Session cleanup:** ended or expired viewing sessions release their associated resources.
- **Contract compliance:** upstream and downstream integration follows approved API and event contracts.
- **Access isolation:** one project or execution cannot expose another project's protected data.
- **Production boundary:** P8 PRODUCTION remains authoritative for production readiness.
- **Bounded guarantees:** performance and availability claims remain limited to measured and accepted conditions.

---

## 3. Dependencies

### 3.1 Required upstream dependencies

P7 consumes capabilities from earlier phases through approved contracts. It must not duplicate upstream functionality merely because a dependency is incomplete.

#### P0 FOUNDATION

Required inputs:

- Shared repository and engineering conventions.
- Common build and test foundations.
- Standard identifier and error conventions where established.
- Configuration and environment practices.
- Code review and change-management procedures.

P7 must use the shared conventions and resolve missing foundational behavior through the relevant owner.

#### P1 STUDIO

Required inputs:

- Established application foundation.
- Project-facing context needed to open live sessions and retrieve results.
- Approved frontend integration conventions.
- Shared navigation and accessibility conventions.

P7 must integrate with the existing application structure rather than create a separate product shell.

#### P2 BUILD & ARTIFACT

Required inputs:

- Stable artifact and output references where relevant.
- Artifact validation and registration semantics.
- Authorized access to supporting output evidence.
- Defined behavior for missing or expired artifact references.

P7 must not assume that the existence of an artifact reference proves successful execution or permanent availability.

#### P3 CONTROL PLANE

Required inputs:

- Authenticated principal and authorization context.
- Project and platform identity.
- Resource and execution references where applicable.
- Approved API error and identifier conventions.
- Access-control behavior for protected resources.

P7 must not implement a parallel identity provider or project authorization system.

#### P4 BOOKING & COMMERCIAL

Required inputs:

- Booking identity and status where relevant to the user workflow.
- Resource association and booking context.
- Applicable access eligibility information.
- Defined behavior for cancelled or expired bookings.

P7 consumes booking context only as required by the live or results workflow. It does not implement booking or commercial rules.

#### P5 EXECUTION

Required inputs:

- Authoritative execution identifier.
- Execution lifecycle contract.
- Execution state-change events or query interfaces.
- Terminal outcome and failure semantics.
- Execution-to-resource association.
- Result availability and completion semantics.
- Correlation conventions for commands and outputs.

P7 must not invent a competing execution state machine.

#### P6 LAB & ROBOT

Required inputs:

- Physical resource identity and supported capability information.
- Approved video source association where applicable.
- Telemetry acquisition and interpretation contracts.
- Health and fault information.
- Telemetry units, timestamps, validity, and provenance.
- Supported behavior when a source disconnects or becomes unavailable.

P7 consumes these interfaces. It does not replace hardware-specific acquisition or driver behavior.

### 3.2 Cross-domain dependency matrix

| Dependency | Required input | P7 use | Owner |
|---|---|---|---|
| Identity and authorization | Authenticated principal and permitted resource scope | Gate live and results access | P3 CONTROL PLANE and security owner documents |
| Project context | Authorized project reference | Resolve user-visible context | P3 CONTROL PLANE |
| Resource metadata | Stable resource identifier and metadata | Associate live data and results | P3 CONTROL PLANE and P6 LAB & ROBOT |
| Booking context | Booking status and resource relationship where required | Present authorized context | P4 BOOKING & COMMERCIAL |
| Execution lifecycle | State, identity, and terminal outcome | Present authoritative execution status | P5 EXECUTION |
| Physical telemetry | Values, units, timestamps, and validity | Display live measurements | P6 LAB & ROBOT |
| Video source | Authorized source and session contract | Establish and display video | P6 LAB & ROBOT and relevant media infrastructure owners |
| Event transport | Event schema, ordering, and delivery behavior | Consume live updates | Protocol and backend owners |
| Result data | Result identity, completeness, and output references | Retrieve and present results | Backend and artifact owners |
| Database persistence | Approved result and metadata persistence interfaces | Retrieve durable results | Database domain |
| Cloud media path | Network, relay, and media service configuration | Connect to the approved video source | Cloud domain |
| Object storage | Authorized output and evidence references | Expose supporting evidence | Backend and cloud domains |
| Security policy | Access rules, data classification, and audit requirements | Protect video, telemetry, and results | Security domain |
| Test environment | Representative data sources and integration environment | Validate end-to-end behavior | Testing and domain owners |
| Production controls | Deployment, monitoring, and recovery requirements | Prepare the handoff to production | P8 PRODUCTION |

### 3.3 Dependency on API and event contracts

P7 depends on stable contracts for live-session operations, stream metadata, telemetry updates, execution events, and results retrieval.

The applicable contract documents must define, as needed:

- Request and response schemas.
- Stable identifiers.
- Authentication and authorization requirements.
- Error codes and failure behavior.
- Event identity and correlation.
- Timestamp representation.
- Data validity and freshness.
- Retry and reconnect behavior.
- Compatibility and versioning expectations.

P7 must not independently invent wire-level schemas when an authoritative contract exists. Any required contract change must be reviewed by the owner and reflected in the appropriate protocol documentation.

### 3.4 Dependency on live video infrastructure

Video presentation depends on the configured camera or media source, network connectivity, and selected transport.

The infrastructure owner must establish the relevant:

- Source configuration.
- Transport and relay behavior.
- Network reachability.
- Authentication or session-token requirements.
- Codec and browser compatibility assumptions.
- Connection limits and resource cleanup behavior.
- Diagnostic and monitoring interfaces.
- Staging environment configuration.

P7 must define how the user experience behaves when these dependencies are unavailable. It must not claim that the stream is operational merely because the session request succeeded.

### 3.5 Dependency on telemetry acquisition

Telemetry quality depends on the source and acquisition layer.

P6 LAB & ROBOT must define the supported physical signal mapping and publish the corresponding contract. P7 must consume that contract without changing the underlying meaning.

If units, scaling, timestamps, or validity semantics are missing, the affected telemetry must not be presented as authoritative until the contract owner resolves the ambiguity.

### 3.6 Dependency on execution lifecycle

P7 depends on P5 EXECUTION for authoritative state and terminal outcomes.

The integration must establish:

- How execution state is queried or subscribed to.
- How events are correlated with an execution.
- How duplicate or delayed events are handled.
- How the final outcome is determined.
- How a terminal execution with pending results is represented.
- How cancellation and failure are displayed.
- How unavailable execution status is represented.

The live UI may display the latest known execution state, but it must distinguish that state from a current, verified observation when event delivery is interrupted.

### 3.7 Dependency on result production and storage

Results may be generated by execution services, stored as structured records, or represented by references to artifacts and logs.

P7 requires a defined contract for:

- Result identity.
- Execution association.
- Result completeness.
- Result availability.
- Supported fields and units.
- Error and failure details.
- Referenced artifacts.
- Access control.
- Retention or expiry behavior where relevant.

The backend and artifact owners define result production and storage behavior. The database domain defines persistence. P7 consumes these capabilities and presents the result state truthfully.

### 3.8 Dependency on database architecture

P7 may require durable result metadata, session references, and associations among execution, resource, and result records.

The database domain owns the physical schema, migrations, indexing, query optimization, retention, and backup or restore behavior.

P7 defines the required information and behavioral invariants. It must not create competing persistence conventions or rely on undocumented database internals.

### 3.9 Dependency on security and privacy

Video, telemetry, logs, and results may reveal sensitive operational or personal information.

The security owner must establish the applicable:

- Authentication and authorization rules.
- Resource and project access boundaries.
- Credential and token handling.
- Data classification.
- Logging and audit requirements.
- Transport protection.
- Retention and deletion policy.
- Restrictions on sharing or exporting evidence.

P7 must implement the product-facing enforcement and error behavior required by those policies. It must not define an independent security model.

### 3.10 Dependency on frontend and backend implementation

The frontend and backend teams must agree on the contracts and state transitions needed for the live and results workflows.

The integration must define:

- Loading and connection states.
- Stream and telemetry status representation.
- Execution-state updates.
- Result completeness and finality.
- Error mapping.
- Authorization failure behavior.
- Session cleanup.
- Reconnection behavior.
- Data refresh and consistency expectations.

Frontend component structure, backend module boundaries, and code-level implementation conventions remain in their respective architecture and development documents.

### 3.11 Dependency on cloud and deployment environments

The accepted live and results workflow must be tested in an environment that provides the necessary service connectivity, media path, data sources, and access controls.

The cloud owner must provide the relevant development or staging configuration, including required service endpoints, network policies, credentials, and diagnostics.

P7 must document application-level prerequisites but does not own environment provisioning or production infrastructure.

### 3.12 Dependency readiness and blocking policy

A dependency is ready when its contract is available, its owner is identified, and P7 can validate its assumptions without relying on undocumented behavior.

A missing dependency must be classified as:

- **Blocking:** the affected live or results capability cannot be correctly or securely demonstrated.
- **Conditionally blocking:** implementation may continue, but the affected capability cannot be accepted until the dependency is resolved.
- **Non-blocking:** the dependency concerns an optional or later capability and does not invalidate the agreed scope.

A mock or synthetic source may be used for isolated development and automated testing. It must be identified as simulated and must not be presented as evidence of physical video or telemetry behavior.

Dependency ownership and impact must be recorded in `TASKS.md`; detailed acceptance evidence belongs in `ACCEPTANCE_CRITERIA.md`.

### 3.13 Cross-phase handoff table

| Handoff | Producing phase | Consuming phase | Required evidence |
|---|---|---|---|
| Shared engineering foundation | P0 FOUNDATION | P7 LIVE & RESULTS | Common build, test, and engineering conventions are available |
| Studio and project context | P1 STUDIO | P7 LIVE & RESULTS | Required user and project context can be consumed |
| Artifact references | P2 BUILD & ARTIFACT | P7 LIVE & RESULTS | Supporting output references and access semantics are defined |
| Identity, projects, platforms, and authorization | P3 CONTROL PLANE | P7 LIVE & RESULTS | Required identity and access contracts are available |
| Booking context | P4 BOOKING & COMMERCIAL | P7 LIVE & RESULTS | Relevant resource and booking references are available where needed |
| Execution lifecycle and outcomes | P5 EXECUTION | P7 LIVE & RESULTS | Execution events, finality, and result availability semantics are defined |
| Physical telemetry and resource faults | P6 LAB & ROBOT | P7 LIVE & RESULTS | Telemetry provenance, validity, and resource identity are documented |
| Live and results capabilities | P7 LIVE & RESULTS | P8 PRODUCTION | Application behavior, operational dependencies, and diagnostics are documented |
| Production deployment and operations | P8 PRODUCTION | Deployed live and results services | Production controls and readiness evidence satisfy the production owner dossier |

---

## 4. Deliverables

The following deliverables define phase-level outcomes. Detailed implementation tasks, verification procedures, and pass/fail conditions remain in the sibling files.

### 4.1 Live-session workflow

P7 delivers a live-session workflow that allows an authorized user to open and close a session associated with the correct execution or resource.

The workflow must:

- Validate the requested context.
- Enforce applicable authorization.
- Establish a session through the approved contract.
- Expose session and connection state.
- Handle unavailable sources.
- Support the accepted interruption and recovery behavior.
- Release session resources when the session ends.
- Preserve resource and execution correlation.

**Completion evidence:** integration tests demonstrate session creation, authorization failure, normal closure, interruption, and cleanup.

### 4.2 Live video presentation

P7 delivers the user-facing video experience for the accepted source and transport.

The experience must show video when available and provide a clear status when the source is connecting, interrupted, unavailable, or closed.

It must not expose credentials or assume that a successful session request guarantees video delivery.

**Completion evidence:** controlled integration tests demonstrate video establishment, expected playback behavior, stream interruption, and understandable failure states in the supported environment.

### 4.3 Video connection and freshness state

P7 delivers a coherent representation of video connection and playback state using the information provided by the selected transport.

Where supported, the experience may display useful quality indicators such as frame rate or latency. It must not invent metrics that cannot be measured.

**Completion evidence:** tests verify the status transitions supported by the accepted transport and confirm that unavailable measurements are not presented as verified quality.

### 4.4 Live telemetry presentation

P7 delivers the presentation of the supported telemetry set.

The experience must preserve telemetry meaning, units, source association, timestamps, and validity semantics defined by the upstream contract.

**Completion evidence:** contract and integration tests verify telemetry rendering, units, source correlation, and handling of unavailable or invalid values.

### 4.5 Telemetry freshness and interruption handling

P7 delivers the user-facing behavior needed to distinguish current telemetry from stale or unavailable telemetry.

The experience must remain understandable when a telemetry source stops updating, reconnects, or provides invalid measurements.

**Completion evidence:** tests demonstrate stale-data indication, missing-value behavior, source interruption, and recovery without presenting stale values as fresh.

### 4.6 Execution-state integration

P7 delivers the integration that presents authoritative execution lifecycle information from P5 EXECUTION.

The implementation must preserve the distinction between execution status, live-session status, and result availability.

**Completion evidence:** integration tests verify correct state presentation for successful, failed, cancelled, interrupted, and unresolved execution scenarios supported by the contract.

### 4.7 Live-data correlation

P7 delivers the association needed to connect video, telemetry, execution events, and session state to the correct resource and execution.

The implementation must not guess the association when identifiers are missing or inconsistent.

**Completion evidence:** tests verify correct correlation and demonstrate that mismatched or uncorrelated data is rejected, isolated, or visibly marked according to the contract.

### 4.8 Results retrieval and presentation

P7 delivers an authorized results workflow for completed or otherwise terminal executions.

The experience must present the authoritative outcome and available result fields while distinguishing pending, partial, failed, unavailable, and final results.

**Completion evidence:** tests cover successful retrieval, access denial, pending results, partial output, failed execution, unavailable references, and completed results.

### 4.9 Results integrity and provenance

P7 delivers a results representation that preserves execution and resource identity and the provenance of associated evidence.

The implementation must distinguish reported values from derived summaries when needed for interpretation and must not invent missing fields.

**Completion evidence:** contract and integration tests verify result identity, source association, finality, and handling of missing or inconsistent references.

### 4.10 Supporting evidence access

P7 delivers the authorized user-facing access path for supporting evidence referenced by a result, where such evidence is included in the accepted scope.

This may include logs, output artifacts, stored media, or selected execution evidence.

The workflow must respect authorization and handle missing, expired, or inaccessible references without implying that the content is available.

**Completion evidence:** tests verify access control, correct execution association, and error handling for unavailable or expired references.

### 4.11 Session termination and cleanup

P7 delivers lifecycle handling for user-initiated closure, expiration, access revocation, and supported interruption scenarios.

Closing a viewing session must not accidentally cancel the underlying execution.

**Completion evidence:** tests verify session teardown, resource cleanup, access revocation behavior, and separation between live-session closure and execution cancellation.

### 4.12 Error handling and recovery

P7 delivers consistent user-facing error handling for live and results operations.

The implementation must provide useful feedback for connection failures, missing sources, stale telemetry, authorization errors, unavailable results, and incomplete evidence.

**Completion evidence:** tests verify representative error mappings and ensure that sensitive implementation details are not exposed.

### 4.13 Security and access isolation

P7 delivers the product-level integration of the approved security model for live sessions and results.

The implementation must protect stream access, telemetry, result records, and supporting evidence using the applicable project, execution, and resource permissions.

**Completion evidence:** security and integration tests demonstrate that unauthorized callers cannot access protected sessions, streams, telemetry, results, or evidence references.

### 4.14 Performance and responsiveness evidence

P7 delivers measurements for the agreed live and results workflow in the supported test environment.

Evidence should cover the acceptance targets defined for:

- Live-session establishment.
- Time to first usable frame where video is configured.
- Telemetry freshness.
- Execution-state update latency.
- Results retrieval.
- UI responsiveness during interruption and recovery.
- Session cleanup.

**Completion evidence:** repeatable measurements demonstrate that the accepted implementation meets its documented targets under the defined test conditions.

These measurements do not establish universal guarantees or production capacity.

### 4.15 Diagnostics and support handoff

P7 delivers the diagnostic context required to investigate failures in live sessions and results retrieval.

The handoff must identify the relevant correlation identifiers, status transitions, source errors, and diagnostic references available through the approved services.

**Completion evidence:** representative failures can be diagnosed using the documented workflow without exposing secrets or requiring undocumented internal knowledge.

### 4.16 Deployment and configuration handoff

P7 delivers application-level configuration requirements for the supported live and results workflow.

Documentation must identify required service endpoints, media-source assumptions, relevant feature configuration, access requirements, and expected failure behavior.

Cloud infrastructure provisioning, network configuration, secret distribution, production rollout, and operational runbooks remain owned by the cloud and production domains.

**Completion evidence:** an authorized engineer can configure and validate the supported workflow using the documented procedure in the designated test environment.

### 4.17 Verification evidence

P7 delivers evidence for:

- Live-session creation and termination.
- Video availability and interruption.
- Stream status and supported quality indicators.
- Telemetry rendering and freshness.
- Execution-state correlation.
- Results retrieval and completeness.
- Authorization and access isolation.
- Supporting evidence access.
- Event ordering and duplicate-update behavior.
- Missing or stale data.
- Session cleanup and recovery.
- Performance under the accepted test conditions.
- Diagnostic usefulness for representative failures.

The global testing strategy defines shared verification policy. Domain testing documents define detailed tools and procedures. P7-specific acceptance and review evidence belongs in `ACCEPTANCE_CRITERIA.md` and `REVIEW_CHECKLIST.md`.

### 4.18 Documentation and ownership handoff

P7 delivers a clear handoff for the live and results capabilities.

The handoff must identify:

- The supported live-session workflow.
- The selected video source and transport assumptions.
- The telemetry contract and provenance requirements.
- The execution-state integration.
- Results fields and completeness semantics.
- Access-control expectations.
- Error and recovery behavior.
- Diagnostic references.
- Performance targets and measured conditions.
- Known limitations and unsupported configurations.
- Authoritative protocol, frontend, backend, database, cloud, security, and testing documents.

**Completion evidence:** documentation links resolve, domain owners are identified, and the accepted workflow can be understood without relying on undocumented assumptions.

### 4.19 Deliverable ownership summary

| Deliverable | Phase-level owner | Implementation owner |
|---|---|---|
| Live-session lifecycle | P7 LIVE & RESULTS | Frontend and backend live-session owners |
| Video presentation | P7 LIVE & RESULTS | Frontend owner with media infrastructure support |
| Video source integration | P7 LIVE & RESULTS | Backend/media integration and P6 LAB & ROBOT |
| Physical telemetry acquisition | P6 LAB & ROBOT | Lab Agent and hardware integration owners |
| Telemetry presentation and freshness | P7 LIVE & RESULTS | Frontend and backend live-data owners |
| Execution lifecycle authority | P5 EXECUTION | Backend execution owner |
| Execution-state presentation | P7 LIVE & RESULTS | Frontend and backend integration owners |
| Result production | Backend and execution domain owners | Backend result-service owners |
| Result retrieval and presentation | P7 LIVE & RESULTS | Frontend and backend results owners |
| Result persistence schema | Database domain | Database domain |
| Supporting artifact storage | Artifact and cloud owners | Artifact and cloud domains |
| Authorization policy | P3 CONTROL PLANE and security owner documents | Security and backend owners |
| Live media infrastructure | Cloud domain | Cloud domain |
| Production deployment | P8 PRODUCTION | Cloud and production owners |
| Detailed P7 acceptance evidence | `ACCEPTANCE_CRITERIA.md` | Task owners and reviewers |

### 4.20 Required phase records

The P7 phase directory maintains the following sibling records:

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

### 9.1 Unauthorized live-session access

**Risk:** An unauthorized user can open a live session or view a protected stream.

**Impact:** Exposure of sensitive video, telemetry, or operational context.

**Mitigation:**

- Enforce authorization for the requested project, execution, and resource.
- Protect stream credentials and session tokens.
- Do not treat unguessable identifiers as authorization.
- Test cross-project and cross-resource access attempts.
- Follow the approved security architecture.

**Owner:** Security and backend domains.

### 9.2 Cross-project results exposure

**Risk:** A results query or evidence reference exposes data belonging to another project or execution.

**Impact:** Confidentiality breach and loss of trust in the platform.

**Mitigation:**

- Apply authorization at the service boundary.
- Validate execution and resource ownership relationships.
- Apply access rules to referenced artifacts and logs.
- Test identifier substitution and unauthorized retrieval.
- Avoid relying solely on frontend filtering.

**Owner:** P3 CONTROL PLANE, backend, and security owners.

### 9.3 Video source unavailable

**Risk:** The source, media path, or network is unavailable when the user opens a live session.

**Impact:** The user cannot observe the operation and may mistake a blank player for a stopped execution.

**Mitigation:**

- Expose distinct connection and unavailable states.
- Keep execution status visible when video is unavailable.
- Provide useful diagnostic feedback.
- Avoid claiming video is active until media is received.
- Test source and transport failure scenarios.

**Owner:** P7 live-session owner with media infrastructure support.

### 9.4 Video state is misleading

**Risk:** The interface shows an apparently active stream even though frames are stale or no new media is arriving.

**Impact:** Users make decisions based on outdated visual information.

**Mitigation:**

- Use transport-provided connection and freshness information where available.
- Distinguish playback state from session-request success.
- Define stale-stream behavior.
- Avoid unsupported quality claims.
- Test interruption and recovery scenarios.

**Owner:** P7 live-session and frontend owners.

### 9.5 Telemetry is stale or invalid

**Risk:** Old or invalid telemetry is displayed as a current measurement.

**Impact:** Incorrect interpretation of the robot or lab resource state.

**Mitigation:**

- Preserve timestamps and validity metadata.
- Define freshness behavior for the accepted telemetry sources.
- Mark missing or stale values explicitly.
- Never substitute zero for missing measurements without contract-defined meaning.
- Test delayed, invalid, and interrupted telemetry.

**Owner:** P6 LAB & ROBOT for acquisition semantics; P7 LIVE & RESULTS for presentation.

### 9.6 Incorrect telemetry units or scaling

**Risk:** The UI displays a measurement with incorrect units, scaling, or interpretation.

**Impact:** Users misunderstand physical state or compare incompatible measurements.

**Mitigation:**

- Use the upstream telemetry contract as the source of meaning.
- Document units and scaling.
- Validate representative values against the accepted source.
- Avoid implicit conversion based on field names.
- Require contract-owner review for changes.

**Owner:** P6 LAB & ROBOT and P7 integration owners.

### 9.7 Incorrect execution-state presentation

**Risk:** The live UI shows an outdated or incorrect execution status because of delayed, duplicated, or missing events.

**Impact:** Users misunderstand whether an operation is running, completed, or failed.

**Mitigation:**

- Keep P5 EXECUTION authoritative for lifecycle state.
- Preserve event identity and correlation.
- Handle duplicate and out-of-order updates.
- Reconcile state through the approved query or recovery contract.
- Distinguish last-known state from current verified state.

**Owner:** P5 and P7 integration owners.

### 9.8 Results shown before completion

**Risk:** Partial or intermediate outputs are presented as final results.

**Impact:** Users make decisions based on incomplete evidence.

**Mitigation:**

- Define result completeness and finality.
- Distinguish execution termination from result availability.
- Display pending and partial states explicitly.
- Use authoritative completion semantics.
- Test delayed result generation and incomplete outputs.

**Owner:** Backend results and P7 owners.

### 9.9 Incorrect success classification

**Risk:** A failed, cancelled, or uncertain execution is presented as successful because outputs exist or the live session closed.

**Impact:** Misleading records and incorrect downstream decisions.

**Mitigation:**

- Consume authoritative execution outcome.
- Keep session closure separate from execution completion.
- Preserve failure and cancellation information.
- Do not infer success from output presence.
- Test terminal failure and uncertain-outcome scenarios.

**Owner:** P5 EXECUTION and P7 integration owners.

### 9.10 Result-to-execution association is incorrect

**Risk:** A result or supporting artifact is attached to the wrong execution or resource.

**Impact:** Incorrect audit trail and misleading result presentation.

**Mitigation:**

- Validate identifiers and relationships.
- Preserve execution and resource references.
- Avoid matching solely by timestamps or display labels.
- Reject or isolate inconsistent references.
- Test mismatched and missing identifiers.

**Owner:** Backend results, artifact, and P7 owners.

### 9.11 Event loss or reordering

**Risk:** Live state updates arrive late, out of order, or not at all.

**Impact:** The interface becomes inconsistent with the authoritative service state.

**Mitigation:**

- Follow the event delivery contract.
- Handle duplicate and delayed events.
- Detect gaps where supported.
- Reconcile through an approved state query or resubscription mechanism.
- Clearly indicate when the latest state cannot be verified.

**Owner:** Backend and protocol owners, with P7 integration support.

### 9.12 Session resources are not released

**Risk:** Ended or expired live sessions retain media connections, subscriptions, or backend resources.

**Impact:** Resource leaks, unnecessary load, and increased operating cost.

**Mitigation:**

- Define session termination behavior.
- Release subscriptions and media resources on closure.
- Handle navigation, expiration, and access revocation.
- Test repeated open-close cycles.
- Monitor resource cleanup through the owning services.

**Owner:** P7 live-session and backend owners.

### 9.13 Closing the live view cancels execution unexpectedly

**Risk:** A UI lifecycle event accidentally triggers execution cancellation.

**Impact:** An operation is interrupted when the user only intended to stop viewing it.

**Mitigation:**

- Separate live-session closure from execution-control actions.
- Use distinct API operations and UI affordances.
- Require explicit authorization for cancellation.
- Test navigation away and session teardown.
- Keep execution control with P5 EXECUTION.

**Owner:** Frontend and backend integration owners.

### 9.14 Stream or telemetry credentials leak

**Risk:** Media URLs, temporary tokens, or access credentials appear in browser state, logs, or error messages.

**Impact:** Unauthorized stream access or security exposure.

**Mitigation:**

- Use approved short-lived access mechanisms where applicable.
- Avoid logging credentials.
- Protect tokens from unnecessary exposure.
- Apply access checks at the service boundary.
- Test error and diagnostic paths.
- Follow the security owner documents.

**Owner:** Security, backend, and cloud domains.

### 9.15 Result references expire or disappear

**Risk:** A result refers to an artifact, recording, or log that is unavailable or expired.

**Impact:** The result appears incomplete or unusable.

**Mitigation:**

- Define reference availability and retention expectations.
- Check availability through the owning service.
- Present missing evidence explicitly.
- Avoid treating a broken reference as valid evidence.
- Keep storage lifecycle with the artifact and cloud owners.

**Owner:** Backend, artifact, and cloud domains.

### 9.16 Sensitive information appears in telemetry or results

**Risk:** Video, telemetry, logs, or outputs reveal information beyond the intended access scope.

**Impact:** Privacy, security, or contractual exposure.

**Mitigation:**

- Apply data classification and access policy.
- Limit exposure to authorized users.
- Avoid unnecessary diagnostic payloads.
- Follow retention and deletion requirements.
- Test authorization for each protected data path.

**Owner:** Security, backend, and cloud domains.

### 9.17 Performance degrades under simultaneous streams

**Risk:** Multiple concurrent sessions exceed the capacity of the accepted environment.

**Impact:** Increased latency, stalled video, stale telemetry, or failed sessions.

**Mitigation:**

- Define the concurrency and load conditions for acceptance.
- Measure session setup and steady-state behavior.
- Observe relevant stream and service metrics.
- Keep resource-intensive media work outside unrelated critical paths.
- Assign production capacity and scaling to P8 PRODUCTION.

**Owner:** Backend and cloud domains, with P7 performance evidence.

### 9.18 UI becomes unresponsive during reconnect

**Risk:** Reconnection loops or frequent telemetry updates block the live experience.

**Impact:** Users cannot understand the current state or navigate away reliably.

**Mitigation:**

- Keep connection and UI state transitions explicit.
- Bound retries and background work according to the approved contract.
- Avoid unbounded buffering.
- Test repeated interruptions.
- Ensure session termination remains available during reconnect.

**Owner:** Frontend and backend live-session owners.

### 9.19 Video and telemetry are temporally misaligned

**Risk:** The UI combines video and telemetry from different time intervals or sessions without indicating the mismatch.

**Impact:** Users infer a false relationship between a displayed movement and a measurement.

**Mitigation:**

- Preserve source timestamps and session identity.
- Document timestamp semantics and clock assumptions.
- Avoid implying frame-level synchronization unless supported.
- Expose limitations where sources update at different rates.
- Test representative delays and clock differences.

**Owner:** P6 LAB & ROBOT for source semantics; P7 for presentation.

### 9.20 Result summaries hide source limitations

**Risk:** A derived metric is displayed without its source, assumptions, or missing-data limitations.

**Impact:** Users interpret a derived result as a direct measurement or fully verified outcome.

**Mitigation:**

- Define the meaning and source of derived fields.
- Preserve provenance where required.
- Identify missing or excluded inputs.
- Avoid unsupported claims of accuracy.
- Keep computation ownership with the designated result-service owner.

**Owner:** Backend results and P7 owners.

### 9.21 Contract drift between frontend and backend

**Risk:** The UI and services interpret stream state, telemetry fields, or result completeness differently.

**Impact:** Incorrect presentation, runtime failures, and inconsistent test results.

**Mitigation:**

- Use authoritative protocol contracts.
- Add contract tests for relevant interfaces.
- Review changes with affected owners.
- Keep generated or shared types aligned with approved contracts.
- Avoid duplicating schema definitions without traceability.

**Owner:** Frontend, backend, and protocol owners.

### 9.22 Observability is insufficient for troubleshooting

**Risk:** A failed live session or incomplete result cannot be diagnosed from available information.

**Impact:** Long recovery time and repeated integration failures.

**Mitigation:**

- Preserve relevant correlation identifiers.
- Record meaningful state transitions and errors.
- Provide diagnostics without exposing secrets.
- Define a troubleshooting handoff.
- Validate representative failure investigation before acceptance.

**Owner:** Backend and cloud domains, with P7 integration support.

### 9.23 Test data is mistaken for real data

**Risk:** Simulated video, telemetry, or results are presented without clear source identification.

**Impact:** Reviewers or users believe the physical integration has been validated when it has not.

**Mitigation:**

- Mark simulated sources clearly in test and demonstration environments.
- Preserve data-source identity.
- Separate simulated acceptance evidence from physical integration evidence.
- Document which results are synthetic.
- Require physical-source evidence for claims about physical behavior.

**Owner:** P7 integration owner and testing owners.

### 9.24 Scope expands into upstream or production ownership

**Risk:** P7 absorbs execution orchestration, physical telemetry acquisition, database architecture, cloud infrastructure, or production operations.

**Impact:** Duplicated ownership, inconsistent contracts, and delayed completion.

**Mitigation:**

- Keep ownership boundaries explicit.
- Use approved contracts and handoffs.
- Assign changes to the authoritative domain owner.
- Record approved scope changes through the project workflow.
- Review cross-domain changes with affected owners.

**Owner:** P7 phase owner and relevant domain owners.

### 9.25 Acceptance overstates live or production readiness

**Risk:** A passing demonstration is treated as proof of production-scale availability, safety, or service-level compliance.

**Impact:** Deployment proceeds without sufficient capacity, operational, or security evidence.

**Mitigation:**

- Record the tested configuration and environment.
- Separate phase acceptance from production readiness.
- Document measured performance and limitations.
- Require P8 PRODUCTION to evaluate production controls.
- Avoid unsupported availability or latency guarantees.

**Owner:** P7 phase owner and P8 production owner.

---

## 10. Exit criteria

P7 LIVE & RESULTS may be declared complete only when the accepted live video and telemetry workflow, execution-state presentation, and results workflow are implemented, verified, and reviewed against the approved contracts and security boundaries.

Acceptance must be based on evidence from the supported sources and test environment. A static UI, mocked event stream, or single successful video frame does not establish the complete phase outcome.

Detailed pass/fail criteria are maintained in `ACCEPTANCE_CRITERIA.md`. Review execution and evidence inspection are maintained in `REVIEW_CHECKLIST.md`.

### 10.1 Scope and ownership

- [ ] The accepted P7 scope is consistent with this dossier.
- [ ] Live-session, video, telemetry-consumption, and results responsibilities are explicit.
- [ ] P5 EXECUTION remains authoritative for execution orchestration and lifecycle.
- [ ] P6 LAB & ROBOT remains authoritative for physical telemetry acquisition and target-facing behavior.
- [ ] P4 BOOKING & COMMERCIAL remains authoritative for booking and commercial rules.
- [ ] P8 PRODUCTION remains authoritative for production readiness and operations.
- [ ] The frontend, backend, protocol, database, cloud, security, and testing owners are identified.
- [ ] The canonical phase and milestone references follow the frozen model.
- [ ] The sibling task, acceptance, review, changelog, and Git procedure files are maintained separately.

### 10.2 Live-session lifecycle

- [ ] An authorized user can request a live session for a valid execution or resource.
- [ ] Invalid or unauthorized requests are rejected.
- [ ] Session identity and resource/execution correlation are preserved.
- [ ] Connection and session states are distinguishable.
- [ ] Unavailable sources produce an understandable state.
- [ ] Session interruption and recovery follow the approved contract.
- [ ] Session expiration and access revocation are handled.
- [ ] User-initiated closure releases associated session resources.
- [ ] Closing a viewing session does not implicitly cancel the execution.
- [ ] Session lifecycle behavior is covered by automated or integration tests.

### 10.3 Live video

- [ ] The accepted video source and transport are documented.
- [ ] Video is presented when the configured source is available.
- [ ] Connection state is not confused with receipt of usable media.
- [ ] Stream interruption and unavailability are visible.
- [ ] Recovery behavior is documented and tested where supported.
- [ ] Unsupported quality metrics are not displayed as verified measurements.
- [ ] Stream credentials are not exposed unnecessarily.
- [ ] The video experience remains understandable when the source is unavailable.
- [ ] Video access is restricted to authorized users.
- [ ] The tested configuration and known limitations are documented.

### 10.4 Telemetry presentation

- [ ] The supported telemetry set is documented.
- [ ] Units and scaling follow the authoritative telemetry contract.
- [ ] Source identity and execution/resource association are preserved.
- [ ] Timestamps and validity semantics are retained where provided.
- [ ] Stale values are distinguishable from current values.
- [ ] Missing values are not silently replaced with plausible measurements.
- [ ] Invalid telemetry is handled according to the contract.
- [ ] Different telemetry update rates do not create misleading state.
- [ ] Telemetry source interruption and recovery are tested.
- [ ] The UI does not infer physical safety from telemetry or connection status.

### 10.5 Execution-state integration

- [ ] P5 EXECUTION remains the source of authoritative execution lifecycle state.
- [ ] Execution identifiers are preserved through the live workflow.
- [ ] State updates are associated with the correct execution.
- [ ] Duplicate and out-of-order events are handled according to the contract.
- [ ] Missing updates do not cause an unsupported success claim.
- [ ] The last-known state is distinguishable from a verified current state when needed.
- [ ] Completion, failure, cancellation, and uncertain outcomes are represented accurately.
- [ ] Live-session closure is independent of execution termination.
- [ ] Contract or integration tests cover the accepted lifecycle states.

### 10.6 Results retrieval and integrity

- [ ] Authorized users can retrieve results for an eligible execution.
- [ ] Access checks are enforced at the service boundary.
- [ ] Results are associated with the correct execution and resource.
- [ ] Result completeness and finality are represented accurately.
- [ ] Pending results are distinguishable from final results.
- [ ] Partial output is not represented as a complete result.
- [ ] Failed and cancelled executions retain their correct outcome.
- [ ] Result fields have defined meanings and source semantics.
- [ ] Derived values are distinguishable from direct measurements where required.
- [ ] Missing or inconsistent result references are handled explicitly.
- [ ] The implementation does not infer success from the existence of output files.

### 10.7 Supporting evidence

- [ ] Supporting evidence references are associated with the correct execution.
- [ ] Access control is applied to logs, artifacts, recordings, and other protected references.
- [ ] Missing or expired evidence is represented accurately.
- [ ] Credentials are not embedded in user-visible links.
- [ ] The UI does not imply that unavailable evidence has been verified.
- [ ] Artifact and storage behavior remains with the authoritative owner documents.

### 10.8 Security and access isolation

- [ ] Live-session creation is authorized.
- [ ] Video access is authorized.
- [ ] Telemetry access is authorized.
- [ ] Results retrieval is authorized.
- [ ] Supporting evidence access is authorized.
- [ ] Cross-project and cross-resource access tests pass.
- [ ] Expired or revoked access is handled.
- [ ] Stream tokens and credentials are protected.
- [ ] Sensitive information is not exposed in errors or diagnostics.
- [ ] The implementation follows the approved security architecture.

### 10.9 Data consistency and provenance

- [ ] Video, telemetry, execution events, and results preserve the required source association.
- [ ] Stable identifiers are used according to the approved contracts.
- [ ] Data with missing or inconsistent associations is not silently assigned to another execution.
- [ ] Telemetry provenance and validity are preserved.
- [ ] Timestamp and unit semantics are documented where required.
- [ ] Simulated data is distinguishable from physical data.
- [ ] Derived summaries do not conceal material missing-data limitations.
- [ ] Result and event correlation behavior is covered by tests.

### 10.10 Performance and responsiveness

- [ ] Acceptance targets are documented for the supported test environment.
- [ ] Live-session establishment is measured.
- [ ] Time to first usable frame is measured where video is configured.
- [ ] Telemetry freshness is measured against the agreed target.
- [ ] Execution-state update latency is measured.
- [ ] Results retrieval is measured.
- [ ] UI responsiveness during stream interruption is verified.
- [ ] Session cleanup behavior is verified.
- [ ] Relevant tests use documented conditions and repeatable evidence.
- [ ] No universal performance or availability claim is made beyond the measured conditions.

### 10.11 Diagnostics and error handling

- [ ] Live-session failures provide useful user-facing feedback.
- [ ] Video source and transport errors are distinguishable where possible.
- [ ] Telemetry interruption and stale-data conditions are diagnosable.
- [ ] Execution-state synchronization failures are diagnosable.
- [ ] Results-pending and results-unavailable states are distinguishable.
- [ ] Relevant identifiers support correlation across services.
- [ ] Error messages do not reveal secrets or unnecessary internal details.
- [ ] Representative failures can be investigated using the documented diagnostic process.

### 10.12 Verification evidence

- [ ] Unit tests cover applicable state mapping and presentation behavior.
- [ ] Contract tests cover the approved API and event interfaces.
- [ ] Integration tests cover live-session establishment and teardown.
- [ ] Integration tests cover video availability and interruption.
- [ ] Tests cover telemetry freshness and invalid data.
- [ ] Tests cover execution-state correlation.
- [ ] Tests cover result completeness and finality.
- [ ] Tests cover authorization and access isolation.
- [ ] Tests cover missing or expired evidence references.
- [ ] Tests cover event duplication or reordering where relevant.
- [ ] Performance measurements are linked to the agreed test conditions.
- [ ] Simulated evidence is clearly identified as simulated.
- [ ] Any accepted exception has an explicit owner and documented disposition.

### 10.13 Documentation and handoff

- [ ] The live-session workflow is documented.
- [ ] The video source and transport assumptions are documented.
- [ ] The telemetry contract and provenance requirements are documented.
- [ ] Execution-state integration is documented.
- [ ] Results fields, completeness, and finality semantics are documented.
- [ ] Access-control expectations are documented.
- [ ] Session cleanup and recovery behavior are documented.
- [ ] Diagnostics and performance evidence are available.
- [ ] Known limitations and unsupported configurations are explicit.
- [ ] Protocol, frontend, backend, database, cloud, security, and testing details link to their authoritative documents.
- [ ] The sibling task, acceptance, review, changelog, and Git procedure files are complete for the accepted scope.

### 10.14 Final phase acceptance

P7 LIVE & RESULTS is ready for formal acceptance when:

1. The accepted live-session workflow works through approved contracts.
2. Video is presented correctly for the supported source and unavailable states are represented honestly.
3. Supported telemetry is displayed with the required units, timestamps, provenance, and validity semantics.
4. Live information is associated with the correct resource and execution.
5. Execution status remains consistent with the authoritative P5 EXECUTION contract.
6. Results are retrievable by authorized users and preserve execution identity and outcome.
7. Partial, pending, failed, cancelled, and unavailable results are represented accurately.
8. Supporting evidence references respect authorization and availability rules.
9. Session termination and recovery behavior are verified.
10. Required automated, integration, security, and performance tests pass.
11. Critical risks are mitigated or formally dispositioned by their owners.
12. Required evidence is available through the sibling acceptance and review records.
13. No unresolved issue invalidates access isolation, execution correlation, data integrity, or truthful result presentation.
14. Remaining work is explicitly assigned to its authoritative phase or domain owner.

Acceptance of P7 does not imply that production deployment, production-scale capacity, or operational readiness is complete. Those outcomes remain governed by P8 PRODUCTION and its authoritative milestone dossier. Live video and telemetry availability remain bounded by the accepted source, transport, environment, and measured conditions.
