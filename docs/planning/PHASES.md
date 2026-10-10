# Kritva RaaS Phase Definition

## 1. Purpose

This document is the canonical phase definition for the Kritva RaaS program.

It defines the frozen program phases P0 through P8, their objectives, scope, activities, inputs, outputs, dependencies, risks, demonstrations, exit criteria, and acceptance criteria.

This document is the single source of truth for phase numbering and phase naming.

All other documentation must reference this document rather than independently redefining phase names, phase numbers, or phase boundaries.

The authoritative milestone scope is maintained in the existing milestone dossiers under `docs/**/milestones/`.

This document defines phase boundaries and cross-domain relationships; it does not replace the detailed scope, task breakdown, acceptance criteria, or implementation evidence maintained by individual milestone dossiers.

## 2. Change Control

The following phase model is frozen:

| Phase | Name |
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

No other phase numbering or phase naming is permitted in current planning, architecture, milestone, tracking, development, release, or implementation documentation.

Any proposed change to phase numbering, phase naming, phase boundaries, or phase relationships must be recorded as a formal change request and approved before documentation is changed.

Historical references must not redefine the current phase model.

Milestone scope must be taken from the authoritative milestone dossier for that milestone.

Phase completion requires evidence against the acceptance criteria defined by this document and the applicable milestone dossiers.

Documentation completion does not constitute implementation completion.

Implementation status must be determined from repository evidence, tests, review records, and accepted implementation artifacts.

## 3. Phase Model

The Kritva RaaS program is organized into nine sequentially numbered phases.

The phases provide a program-level structure for implementation and integration.

Work may proceed in parallel where dependencies permit, but a downstream phase must not be considered complete until its required upstream dependencies are satisfied.

The phase model is:

| Phase | Objective |
|---|---|
| P0 | Establish the engineering, repository, architecture, development, security, cloud, and database foundations. |
| P1 | Establish the RaaS Studio application foundation and project workspace experience. |
| P2 | Establish local build, packaging, artifact generation, artifact validation, and artifact trust boundaries. |
| P3 | Establish the Control Plane, platform catalog, artifact services, API services, and authoritative business-state interfaces required by downstream phases. |
| P4 | Establish platform booking, resource availability, credits, commercial controls, and financial workflow foundations. |
| P5 | Establish remote execution orchestration, Job/Run lifecycle management, workers, and simulated execution. |
| P6 | Establish Lab and Robot integration, Lab Agent connectivity, runtime integration, and physical execution readiness. |
| P7 | Establish live execution observation, video, telemetry, logs, results, experiments, comparisons, and rerun workflows. |
| P8 | Establish production security, reliability, observability, scalability, operational readiness, and launch readiness. |

### 3.1 Primary Product Path (MVP)

The primary product path, also referred to as the MVP, is the end-to-end customer flow: Build Locally, Book Remotely, Run, Observe, and Results. It is a product-scope concept used for priority (PRI-1 in `docs/planning/IMPLEMENTATION_ROADMAP.md`) and acceptance traceability.

It is not a phase, a milestone, or a substitute for either. It spans P1 STUDIO through P7 LIVE & RESULTS, and its scope is defined by the milestone dossiers it crosses. "MVP" MUST NOT be used as a phase name or as a milestone name.

## 4. Phase Principles

The following principles apply across P0 through P8.

1. PostgreSQL is authoritative for structured business state.
2. Object storage is used for large artifacts and result files.
3. Queue delivery is not authoritative business state.
4. Job and Run are separate concepts.
5. Organization is the primary tenant boundary.
6. Customer source code remains on the developer machine during the normal RaaS workflow.
7. Only an approved execution artifact crosses the remote execution boundary.
8. Artifact integrity, compatibility, authorization, and policy validation occur before execution.
9. Booking state is server authoritative.
10. Credit and financial state is strongly consistent.
11. Resource allocation prevents conflicting active allocations.
12. Idempotency is required for retryable business operations.
13. Local Lab Agent, runtime, and safety systems remain authoritative for robot safety.
14. Software Stop is not equivalent to emergency stop.
15. Live data is for observation; durable state is for truth.
16. Security and tenant isolation apply across every phase.
17. Provider-specific infrastructure remains behind provider-neutral interfaces.
18. Phase completion is evidence-based.
19. Milestone scope is authoritative in the corresponding milestone dossier.
20. Architecture changes require explicit review and change control.

## 5. Phase Dependency Model

The high-level dependency flow is:

    P0 FOUNDATION
          |
          +----------------------+
          |                      |
          v                      v
    P1 STUDIO              P3 CONTROL PLANE
          |                  ^       |
          v                  |       v
    P2 BUILD & ARTIFACT ----+   P4 BOOKING & COMMERCIAL
                                      |
                                      v
                                P5 EXECUTION
                                      |
                                      v
                                P6 LAB & ROBOT
                                      |
                                      v
                                P7 LIVE & RESULTS
                                      |
                                      v
                                P8 PRODUCTION

The dependency diagram represents logical dependencies rather than a prohibition on parallel implementation.

P1 may begin after the P0 foundations required by Studio development are available.

P2 depends on the local Studio and build foundations established through P1.

P3 establishes the Control Plane required for remote product workflows.

P4 depends on the business-state and platform interfaces established through P3.

P5 depends on artifact, platform, booking, authorization, and infrastructure interfaces.

P6 extends execution into the Lab and Robot environment.

P7 consumes execution, Lab, telemetry, logging, video, and result data.

P8 hardens and qualifies the integrated system for production.

## 6. Cross-Domain Milestone Mapping

The following table is the canonical relationship between phases and domain milestones.

| Phase | Frontend | Backend | Database | Cloud |
|---|---|---|---|---|
| P0 FOUNDATION | F-M01 STUDIO FOUNDATION | — | DB-M01 FOUNDATION | C-M01 FOUNDATION |
| P1 STUDIO | F-M01 STUDIO FOUNDATION; F-M02 PROJECTS | — | DB-M01 FOUNDATION | C-M02 DEVELOPMENT |
| P2 BUILD & ARTIFACT | F-M03 BUILD & ARTIFACT | B-M02 ARTIFACT | DB-M01 FOUNDATION | C-M02 DEVELOPMENT |
| P3 CONTROL PLANE | — | B-M01 CONTROL PLANE; B-M02 ARTIFACT; B-M03 PLATFORM | DB-M01 FOUNDATION; DB-M02 CORE DATA | C-M02 DEVELOPMENT |
| P4 BOOKING & COMMERCIAL | F-M04 BOOKING | B-M04 BOOKING | DB-M03 BOOKING DATA | C-M03 STAGING |
| P5 EXECUTION | F-M05 EXECUTION | B-M05 EXECUTION | DB-M04 EXECUTION DATA | C-M03 STAGING |
| P6 LAB & ROBOT | — | B-M06 RESULTS | DB-M04 EXECUTION DATA | C-M03 STAGING |
| P7 LIVE & RESULTS | F-M06 LIVE; F-M07 RESULTS | B-M06 RESULTS | DB-M04 EXECUTION DATA | C-M03 STAGING |
| P8 PRODUCTION | — | B-M07 PRODUCTION | — | C-M04 PRODUCTION |

DB-M02 CORE DATA (P3) is not a P2 BUILD & ARTIFACT milestone. P2 uses the DB-M01 FOUNDATION (P0-P3) identity, organization, project, migration, RLS, and audit foundations. Where P2 work needs persisted artifact, storage, or compatibility metadata, that is a cross-phase dependency on DB-M02 CORE DATA (P3); B-M02 ARTIFACT (P2-P3) completes registry persistence against DB-M02 CORE DATA during P3 CONTROL PLANE.

The milestone dossiers under `docs/**/milestones/` are authoritative for milestone scope.

Where a milestone spans multiple phases, each phase owns only the portion of work necessary to satisfy that phase's objectives and exit criteria.

## 7. P0 FOUNDATION

### 7.1 Objective

Establish the common engineering foundation required for all subsequent Kritva RaaS implementation.

### 7.2 Activities

- Establish repository and workspace conventions.
- Establish development environment requirements.
- Establish source-control and branching conventions.
- Establish CI foundations.
- Establish architecture documentation.
- Establish protocol documentation structure.
- Establish database architecture and migration conventions.
- Establish security architecture and security requirements.
- Establish cloud account and environment foundations.
- Establish secrets and key-management foundations.
- Establish testing strategy.
- Establish documentation governance.
- Establish milestone and task tracking.
- Establish provider-neutral infrastructure boundaries.

### 7.3 Inputs

- Approved Kritva RaaS product direction.
- Frozen P0-P8 phase model.
- Repository structure.
- Architecture decisions.
- Security requirements.
- Development requirements.
- Database requirements.
- Cloud requirements.

### 7.4 Outputs

- Working repository foundation.
- Development setup documentation.
- CI foundation.
- Architecture baseline.
- Protocol documentation baseline.
- Database foundation plan.
- Security baseline.
- Cloud foundation.
- Tracking framework.
- Milestone governance framework.

### 7.5 Dependencies

P0 has no upstream Kritva RaaS phase dependency.

External dependencies include:

- Git hosting.
- Development machines.
- Required language toolchains.
- CI execution environment.
- PostgreSQL development environment.
- Cloud account access where required.

### 7.6 Risks

- Inconsistent repository conventions.
- Architecture decisions made without traceability.
- Environment drift.
- Missing CI checks.
- Security requirements being deferred.
- Cloud provider coupling.
- Database migration inconsistency.
- Documentation drift.

### 7.7 Demo

Demonstrate:

1. Repository checkout.
2. Developer environment bootstrap.
3. Workspace dependency installation.
4. Local infrastructure startup.
5. Database migration execution.
6. Basic CI execution.
7. Documentation validation.
8. Security scanning baseline.
9. Successful test execution.

### 7.8 Exit Criteria

P0 exits when:

- Repository conventions are documented.
- Development setup is reproducible.
- CI executes required baseline checks.
- Architecture baseline is approved.
- Security baseline is approved.
- Database foundation approach is approved.
- Cloud foundation exists for required environments.
- Documentation governance is operational.
- Tracking structures are available.
- No unresolved P0 blocker prevents P1 implementation.

### 7.9 Acceptance Checklist

- [ ] Repository structure is documented.
- [ ] Development environment is reproducible.
- [ ] CI baseline passes.
- [ ] Architecture baseline is reviewed.
- [ ] Security baseline is reviewed.
- [ ] Database migration strategy is defined.
- [ ] Cloud foundation is provisioned or explicitly staged.
- [ ] Secrets are not stored in source control.
- [ ] Documentation references are valid.
- [ ] Phase and milestone naming is consistent.
- [ ] P0 evidence is recorded.

## 8. P1 STUDIO

### 8.1 Objective

Establish the RaaS Studio application foundation and project workspace required for local development workflows.

### 8.2 Activities

- Establish Tauri and Rust native integration.
- Establish React and TypeScript application structure.
- Establish navigation and application shell.
- Establish authentication integration.
- Establish session handling.
- Establish organization context.
- Establish project creation and project selection.
- Establish local workspace handling.
- Establish platform-aware project configuration.
- Establish API client integration.
- Establish local runtime integration boundaries.
- Establish loading, error, and empty states.
- Establish initial cross-platform Studio build support.

### 8.3 Inputs

- P0 FOUNDATION outputs.
- Authentication contracts.
- Authorization contracts.
- Project data model.
- Platform catalog interfaces.
- Studio UI requirements.

### 8.4 Outputs

- Working Studio shell.
- Authentication flow.
- Organization context.
- Project workspace.
- Local workspace boundary.
- API client foundation.
- Local runtime boundary.
- Initial Studio test coverage.

### 8.5 Dependencies

- P0 FOUNDATION.
- F-M01 STUDIO FOUNDATION.
- F-M02 PROJECTS.
- DB-M01 FOUNDATION.
- C-M02 DEVELOPMENT.

### 8.6 Risks

- Source code accidentally entering server APIs.
- Weak local workspace isolation.
- Authentication state inconsistencies.
- Platform metadata drift.
- Native/runtime boundary instability.
- Cross-platform build differences.

### 8.7 Demo

Demonstrate:

1. Launch Studio.
2. Authenticate.
3. Select organization.
4. Create project.
5. Open local project workspace.
6. Configure target platform.
7. Restart Studio.
8. Restore authenticated session and project context.
9. Confirm source remains local.

### 8.8 Exit Criteria

- Studio launches reliably.
- Authentication works.
- Project lifecycle works.
- Local source remains local.
- Organization context is enforced.
- Project metadata is persisted correctly.
- API and IPC boundaries are tested.
- P1 evidence is recorded.

### 8.9 Acceptance Checklist

- [ ] F-M01 STUDIO FOUNDATION accepted.
- [ ] F-M02 PROJECTS accepted.
- [ ] Authentication is functional.
- [ ] Organization context is enforced.
- [ ] Project creation works.
- [ ] Project selection works.
- [ ] Local workspace works.
- [ ] Source privacy tests pass.
- [ ] Studio build passes on supported development targets.
- [ ] P1 evidence is recorded.

## 9. P2 BUILD & ARTIFACT

### 9.1 Objective

Establish the trusted local build and artifact workflow from source code to a validated execution artifact.

### 9.2 Activities

- Detect local build toolchains.
- Build locally.
- Run local tests.
- Capture build logs.
- Support build cancellation.
- Generate `.krv` artifacts.
- Generate artifact manifest.
- Calculate checksums.
- Validate package contents.
- Perform source-privacy scanning.
- Perform artifact security scanning.
- Sign approved artifacts.
- Validate signatures.
- Upload artifact metadata and artifact content without source code.
- Register artifact versions.
- Establish artifact compatibility metadata.

### 9.3 Inputs

- P1 STUDIO outputs.
- Artifact architecture.
- Artifact security requirements.
- Artifact manifest contract.
- Platform catalog.
- Runtime and SDK compatibility data.

### 9.4 Outputs

- Reproducible local build workflow.
- `.krv` artifact.
- Artifact manifest.
- Integrity metadata.
- Signature metadata.
- Artifact registry integration.
- Compatibility metadata.
- Source-privacy evidence.

### 9.5 Dependencies

- P1 STUDIO.
- F-M03 BUILD & ARTIFACT.
- B-M02 ARTIFACT.
- DB-M01 FOUNDATION.
- DB-M02 CORE DATA (P3), as a cross-phase dependency for persisted artifact metadata only; it is not a P2 milestone.
- C-M02 DEVELOPMENT.

### 9.6 Risks

- Source leakage.
- Unsigned artifacts.
- Invalid manifest data.
- Architecture mismatch.
- Runtime mismatch.
- Dependency packaging errors.
- Malicious artifact content.
- Artifact storage inconsistency.

### 9.7 Demo

Demonstrate:

1. Create local project source.
2. Build locally.
3. Run tests.
4. Generate `.krv`.
5. Inspect manifest.
6. Validate checksum.
7. Sign artifact.
8. Validate signature.
9. Upload artifact.
10. Verify that source files were not uploaded.
11. Register artifact version.
12. Validate compatibility with a platform version.

### 9.8 Exit Criteria

- Local build is functional.
- Artifact generation is deterministic enough for defined requirements.
- Manifest validation works.
- Source-privacy controls pass.
- Integrity validation works.
- Signature validation works.
- Artifact registry accepts valid artifacts.
- Invalid artifacts are rejected.
- P2 evidence is recorded.

### 9.9 Acceptance Checklist

- [ ] F-M03 BUILD & ARTIFACT accepted.
- [ ] B-M02 ARTIFACT accepted for P2 scope.
- [ ] Artifact manifest is validated.
- [ ] Artifact checksum is validated.
- [ ] Artifact signature is validated.
- [ ] Source-privacy test passes.
- [ ] Invalid artifact tests pass.
- [ ] Compatibility validation passes.
- [ ] Artifact upload does not upload source.
- [ ] P2 evidence is recorded.

## 10. P3 CONTROL PLANE

### 10.1 Objective

Establish the authoritative Control Plane interfaces and services required to operate the RaaS product.

### 10.2 Activities

- Establish API foundation.
- Establish identity integration.
- Establish authorization.
- Establish organization boundaries.
- Establish project services.
- Establish platform catalog services.
- Establish artifact services.
- Establish repositories.
- Establish audit foundations.
- Establish idempotency foundations.
- Establish WebSocket infrastructure.
- Establish service configuration.
- Establish authoritative business-state interfaces.

### 10.3 Inputs

- P0 FOUNDATION.
- P1 STUDIO.
- P2 BUILD & ARTIFACT.
- Database schemas.
- Security architecture.
- Protocol contracts.
- Platform catalog requirements.

### 10.4 Outputs

- Control Plane API.
- Identity services.
- Organization services.
- Project services.
- Platform services.
- Artifact services.
- Repository interfaces.
- Authorization enforcement.
- Audit foundation.
- WebSocket foundation.

### 10.5 Dependencies

- B-M01 CONTROL PLANE.
- B-M02 ARTIFACT.
- B-M03 PLATFORM.
- DB-M01 FOUNDATION.
- DB-M02 CORE DATA.
- C-M02 DEVELOPMENT.

### 10.6 Risks

- Tenant isolation failure.
- Authorization bypass.
- API contract drift.
- Database transaction errors.
- Incorrect platform compatibility.
- Duplicate asynchronous operations.
- Incomplete audit coverage.

### 10.7 Demo

Demonstrate:

1. Authenticate.
2. Create organization context.
3. Create project.
4. Discover platform.
5. Discover platform version.
6. Discover capabilities.
7. Register artifact.
8. Validate artifact compatibility.
9. Exercise API idempotency.
10. Receive an authorized WebSocket event.
11. Verify audit evidence.

### 10.8 Exit Criteria

- Control Plane APIs are functional.
- Tenant boundaries are enforced.
- Authorization is enforced.
- Platform catalog is authoritative.
- Artifact registry is integrated.
- Repository boundaries are established.
- API and event contracts are tested.
- P3 evidence is recorded.

### 10.9 Acceptance Checklist

- [ ] B-M01 CONTROL PLANE accepted.
- [ ] B-M02 ARTIFACT accepted for P3 scope.
- [ ] B-M03 PLATFORM accepted.
- [ ] DB-M01 FOUNDATION accepted for P3 scope.
- [ ] DB-M02 CORE DATA accepted.
- [ ] Authentication works.
- [ ] Authorization works.
- [ ] Tenant isolation tests pass.
- [ ] Platform discovery works.
- [ ] Artifact compatibility works.
- [ ] Idempotency tests pass.
- [ ] P3 evidence is recorded.

## 11. P4 BOOKING & COMMERCIAL

### 11.1 Objective

Establish authoritative resource booking and commercial workflows.

### 11.2 Activities

- Establish availability.
- Establish booking lifecycle.
- Establish time slots.
- Establish resource allocations.
- Prevent conflicting active allocations.
- Establish platform-specific credit types.
- Establish credit plans.
- Establish rate cards.
- Establish credit wallets.
- Establish credit reservations.
- Establish credit consumption.
- Establish refunds.
- Establish invoice records.
- Establish payment abstraction.
- Establish reconciliation.
- Establish booking audit history.

### 11.3 Inputs

- P3 CONTROL PLANE.
- Platform catalog.
- Resource model.
- Credit requirements.
- Booking requirements.
- Commercial policies.

### 11.4 Outputs

- Booking service.
- Availability service.
- Resource allocation service.
- Credit service.
- Credit ledger.
- Rate-card model.
- Invoice model.
- Payment abstraction.
- Reconciliation workflows.

### 11.5 Dependencies

- F-M04 BOOKING.
- B-M04 BOOKING.
- DB-M03 BOOKING DATA.
- C-M03 STAGING.
- P3 CONTROL PLANE.

### 11.6 Risks

- Double booking.
- Double charging.
- Credit ledger divergence.
- Incorrect historical pricing.
- Refund errors.
- Concurrent booking races.
- Payment callback duplication.
- Resource-state divergence.

### 11.7 Demo

Demonstrate:

1. Discover an available resource.
2. Request a quote.
3. Verify required credits.
4. Reserve credits.
5. Confirm booking.
6. Allocate resource.
7. Reject a conflicting allocation.
8. Complete a booking.
9. Consume credits.
10. Cancel a booking.
11. Apply refund policy.
12. Reconcile financial state.

### 11.8 Exit Criteria

- Booking is transactionally authoritative.
- Active resource allocations cannot overlap.
- Credit reservation and release are idempotent.
- Ledger entries are balanced.
- Historical rates remain immutable.
- Payment callbacks are idempotent.
- Reconciliation detects inconsistencies.
- P4 evidence is recorded.

### 11.9 Acceptance Checklist

- [ ] F-M04 BOOKING accepted.
- [ ] B-M04 BOOKING accepted.
- [ ] DB-M03 BOOKING DATA accepted.
- [ ] C-M03 STAGING supports required workflow.
- [ ] Availability works.
- [ ] Booking lifecycle works.
- [ ] Allocation exclusion works.
- [ ] Credit reservation works.
- [ ] Credit consumption works.
- [ ] Refund workflow works.
- [ ] Ledger integrity tests pass.
- [ ] Tenant isolation tests pass.
- [ ] P4 evidence is recorded.

## 12. P5 EXECUTION

### 12.1 Objective

Establish remote execution orchestration from an approved artifact and confirmed booking to a durable Job and Run lifecycle.

### 12.2 Activities

- Establish Job service.
- Establish Run service.
- Establish execution queue.
- Establish workers.
- Validate execution eligibility.
- Validate booking window.
- Validate artifact integrity.
- Validate artifact compatibility.
- Allocate execution resource.
- Deploy artifact.
- Start Run.
- Monitor execution.
- Stop execution.
- Handle timeout.
- Handle failure.
- Perform cleanup.
- Persist durable state.
- Establish simulated Lab Agent execution.

### 12.3 Inputs

- P2 BUILD & ARTIFACT.
- P3 CONTROL PLANE.
- P4 BOOKING & COMMERCIAL.
- Execution protocol.
- Artifact validation.
- Resource allocation.

### 12.4 Outputs

- Job orchestration.
- Run lifecycle.
- Queue abstraction.
- Worker implementation.
- Simulated Lab Agent.
- Execution state persistence.
- Retry and timeout policies.
- Cleanup workflow.

### 12.5 Dependencies

- F-M05 EXECUTION.
- B-M05 EXECUTION.
- DB-M04 EXECUTION DATA.
- C-M03 STAGING.
- P3 CONTROL PLANE.
- P4 BOOKING & COMMERCIAL.

### 12.6 Risks

- Duplicate execution.
- Incorrect retry of physical actions.
- Lost Job state.
- Queue/database divergence.
- Artifact deployment failure.
- Resource allocation failure.
- Timeout ambiguity.
- Unsafe stop semantics.

### 12.7 Demo

Demonstrate:

1. Confirm booking.
2. Select approved artifact.
3. Create Job.
4. Validate execution eligibility.
5. Queue Job.
6. Claim Job with worker.
7. Deploy artifact to simulated Lab Agent.
8. Start Run.
9. Observe lifecycle.
10. Stop Run.
11. Persist result metadata.
12. Recover from worker interruption.
13. Demonstrate failure and cleanup.

### 12.8 Exit Criteria

- Job state is durable.
- Run state is durable.
- Queue is not business truth.
- Execution eligibility is validated.
- Artifact is deployed without source.
- Start and stop operations are idempotent.
- Worker recovery is tested.
- Cleanup occurs after terminal execution.
- P5 evidence is recorded.

### 12.9 Acceptance Checklist

- [ ] F-M05 EXECUTION accepted.
- [ ] B-M05 EXECUTION accepted.
- [ ] DB-M04 EXECUTION DATA accepted for P5 scope.
- [ ] C-M03 STAGING supports execution.
- [ ] Job lifecycle works.
- [ ] Run lifecycle works.
- [ ] Worker recovery works.
- [ ] Artifact-only deployment works.
- [ ] Timeout handling works.
- [ ] Cleanup works.
- [ ] Duplicate execution protection works.
- [ ] Stop semantics are documented.
- [ ] P5 evidence is recorded.

## 13. P6 LAB & ROBOT

### 13.1 Objective

Extend the execution system from simulated infrastructure into controlled Lab and Robot environments.

### 13.2 Activities

- Establish Lab Agent identity.
- Establish secure Lab connectivity.
- Establish Lab Agent registration.
- Establish heartbeat.
- Establish resource status.
- Establish artifact validation at the Lab boundary.
- Establish deployment through the Lab Agent.
- Establish runtime integration.
- Establish Robot state integration.
- Establish local safety-state reporting.
- Establish disconnect and reconnect behavior.
- Establish physical execution qualification.
- Establish safety review gates.

### 13.3 Inputs

- P5 EXECUTION.
- Lab architecture.
- Lab protocol.
- Runtime integration.
- Robot interface.
- Safety requirements.

### 13.4 Outputs

- Registered Lab Agent.
- Secure Lab channel.
- Lab resource state.
- Robot state.
- Runtime integration.
- Physical execution qualification evidence.
- Safety review evidence.

### 13.5 Dependencies

- B-M06 RESULTS.
- DB-M04 EXECUTION DATA.
- C-M03 STAGING.
- P5 EXECUTION.
- Approved physical safety controls.

### 13.6 Risks

- Physical robot safety failure.
- Loss of Lab connectivity.
- Incorrect robot state.
- Unsafe automatic restart.
- Artifact incompatibility.
- Lab Agent credential compromise.
- Resource state divergence.

### 13.7 Demo

Demonstrate:

1. Register Lab Agent.
2. Establish secure connection.
3. Report heartbeat.
4. Report resource status.
5. Validate artifact.
6. Deploy artifact.
7. Start controlled execution.
8. Observe robot state.
9. Disconnect Lab Agent.
10. Demonstrate safe disconnect handling.
11. Reconnect.
12. Verify execution state.
13. Demonstrate local safety authority.

### 13.8 Exit Criteria

- Lab Agent identity is secure.
- Lab connectivity is authenticated.
- Robot state is observable.
- Artifact validation occurs locally.
- Runtime integration works.
- Disconnect behavior is safe.
- Reconnect does not blindly restart execution.
- Physical safety review is complete for the approved scope.
- P6 evidence is recorded.

### 13.9 Acceptance Checklist

- [ ] B-M06 RESULTS accepted for P6 scope.
- [ ] DB-M04 EXECUTION DATA accepted for P6 scope.
- [ ] C-M03 STAGING supports Lab integration.
- [ ] Lab Agent authentication works.
- [ ] Heartbeat works.
- [ ] Resource state works.
- [ ] Robot state works.
- [ ] Artifact validation works at the Lab boundary.
- [ ] Disconnect handling works.
- [ ] Reconnect handling works.
- [ ] Safety review is complete.
- [ ] No cloud action can override local safety authority.
- [ ] P6 evidence is recorded.

## 14. P7 LIVE & RESULTS

### 14.1 Objective

Provide live execution observation and durable result analysis for completed and active Runs.

### 14.2 Activities

- Establish live execution state.
- Establish WebSocket event delivery.
- Establish WebRTC video.
- Establish telemetry ingestion.
- Establish log streaming.
- Establish lab and robot status.
- Establish reconnect behavior.
- Establish result generation.
- Establish result files.
- Establish result metrics.
- Establish experiments.
- Establish comparisons.
- Establish downloads.
- Establish rerun workflow.
- Establish retention and archival.

### 14.3 Inputs

- P5 EXECUTION.
- P6 LAB & ROBOT.
- Live transport contracts.
- Result schema.
- Video architecture.
- Telemetry architecture.
- Log architecture.

### 14.4 Outputs

- F-M06 LIVE.
- F-M07 RESULTS.
- B-M06 RESULTS.
- Durable result records.
- Result files.
- Metrics.
- Experiments.
- Comparisons.
- Download workflows.
- Rerun workflows.

### 14.5 Dependencies

- F-M06 LIVE.
- F-M07 RESULTS.
- B-M06 RESULTS.
- DB-M04 EXECUTION DATA.
- C-M03 STAGING.
- P5 EXECUTION.
- P6 LAB & ROBOT.

### 14.6 Risks

- Live state becoming authoritative instead of durable state.
- Stale telemetry being displayed as current.
- Video failure affecting robot execution.
- Event duplication.
- Event loss.
- Result corruption.
- Incorrect comparison.
- Unauthorized result access.
- Retention errors.

### 14.7 Demo

Demonstrate:

1. Start a Run.
2. Open live execution view.
3. Receive Job and Run state.
4. View live video.
5. View telemetry.
6. View logs.
7. Disconnect Studio.
8. Reconnect Studio.
9. Verify execution continues independently.
10. Complete Run.
11. Generate Result.
12. View metrics.
13. Download result file.
14. Add Run to Experiment.
15. Compare Runs.
16. Rerun the experiment using a new Job and Run.

### 14.8 Exit Criteria

- Live state is observable.
- Durable state remains authoritative.
- Video is independently managed from execution control.
- Telemetry freshness is visible.
- Logs are available.
- Reconnect works.
- Results are durable.
- Result files are accessible according to authorization.
- Experiment and comparison workflows work.
- Rerun creates a new Job and Run.
- P7 evidence is recorded.

### 14.9 Acceptance Checklist

- [ ] F-M06 LIVE accepted.
- [ ] F-M07 RESULTS accepted.
- [ ] B-M06 RESULTS accepted.
- [ ] DB-M04 EXECUTION DATA accepted for P7 scope.
- [ ] C-M03 STAGING supports live and result workflows.
- [ ] WebSocket state updates work.
- [ ] WebRTC video works.
- [ ] Telemetry freshness is enforced.
- [ ] Logs are available.
- [ ] Reconnect works.
- [ ] Results are durable.
- [ ] Result authorization works.
- [ ] Experiments work.
- [ ] Comparisons work.
- [ ] Rerun creates a new Job and Run.
- [ ] P7 evidence is recorded.

## 15. P8 PRODUCTION

### 15.1 Objective

Establish production readiness through security hardening, reliability, scalability, observability, disaster recovery, operational controls, and release qualification.

### 15.2 Activities

- Harden authentication and authorization.
- Validate tenant isolation.
- Harden artifact security.
- Harden secrets and key management.
- Validate production database configuration.
- Validate object storage security.
- Validate queue reliability.
- Validate API scalability.
- Validate WebSocket scalability.
- Validate media scalability.
- Establish production observability.
- Establish incident management.
- Establish backup and recovery.
- Establish disaster recovery.
- Establish vulnerability management.
- Establish release controls.
- Establish operational runbooks.
- Establish production launch gates.

### 15.3 Inputs

- P0-P7 evidence.
- Production security requirements.
- Production cloud infrastructure.
- Operational requirements.
- Reliability targets.
- Release requirements.

### 15.4 Outputs

- Production infrastructure.
- Production security controls.
- Production observability.
- Backup and recovery evidence.
- Disaster recovery evidence.
- Operational runbooks.
- Release evidence.
- Production readiness decision.

### 15.5 Dependencies

- B-M07 PRODUCTION.
- C-M04 PRODUCTION.
- P0 FOUNDATION.
- P3 CONTROL PLANE.
- P4 BOOKING & COMMERCIAL.
- P5 EXECUTION.
- P6 LAB & ROBOT.
- P7 LIVE & RESULTS.

### 15.6 Risks

- Production tenant isolation failure.
- Data loss.
- Credential compromise.
- Key compromise.
- Insufficient database capacity.
- Queue overload.
- WebSocket scaling failure.
- Observability gaps.
- Recovery failure.
- Unsafe production robot operation.
- Incomplete operational readiness.

### 15.7 Demo

Demonstrate:

1. Production deployment.
2. Authentication and authorization.
3. Tenant isolation.
4. Artifact validation.
5. Booking.
6. Credit transaction.
7. Job creation.
8. Run execution.
9. Live observation.
10. Result generation.
11. Audit trail.
12. Backup.
13. Restore.
14. Failure recovery.
15. Monitoring and alerting.
16. Controlled release and rollback procedure.

### 15.8 Exit Criteria

- Production security requirements are satisfied.
- Tenant isolation is verified.
- Production database is operational.
- Backups are verified.
- Recovery procedures are tested.
- Observability is operational.
- Critical alerts are configured.
- Incident response is documented.
- Release controls are operational.
- Production capacity targets are validated.
- Physical safety controls remain local and authoritative.
- Production go/no-go review is complete.
- P8 evidence is recorded.

### 15.9 Acceptance Checklist

- [ ] B-M07 PRODUCTION accepted.
- [ ] C-M04 PRODUCTION accepted.
- [ ] Security requirements are verified.
- [ ] Tenant isolation tests pass.
- [ ] Production database recovery is tested.
- [ ] Backup restoration is tested.
- [ ] Object storage controls are verified.
- [ ] Queue reliability is verified.
- [ ] Observability is operational.
- [ ] Audit logging is operational.
- [ ] Incident response is tested.
- [ ] Release rollback is tested.
- [ ] Production capacity targets are verified.
- [ ] Physical safety authority remains local.
- [ ] P8 evidence is recorded.

## 16. Cross-Phase Integration Requirements

Every phase must preserve the interfaces established by preceding phases.

P1 must preserve P0 engineering and security foundations.

P2 must preserve P1 local-source boundaries.

P3 must preserve P2 artifact trust boundaries.

P4 must preserve P3 authorization and platform ownership boundaries.

P5 must preserve P4 booking and financial invariants.

P6 must preserve P5 execution lifecycle semantics.

P7 must preserve P5 and P6 execution and safety authority.

P8 must preserve all established product, security, financial, artifact, execution, and safety invariants.

Cross-phase integration must include:

- Contract tests.
- API compatibility tests.
- Database migration tests.
- Authentication tests.
- Authorization tests.
- Tenant isolation tests.
- Artifact security tests.
- Idempotency tests.
- Failure and retry tests.
- Observability tests.
- Audit tests.
- End-to-end tests.

## 17. Phase Completion Evidence

Each phase must maintain evidence sufficient to demonstrate completion.

Required evidence categories include:

| Evidence | Requirement |
|---|---|
| Implementation | Code or infrastructure implementing the approved scope |
| Tests | Automated and applicable manual verification |
| Review | Required technical and security review |
| Documentation | Updated authoritative documentation |
| Integration | Cross-domain integration evidence |
| Security | Security verification appropriate to scope |
| Safety | Safety review where physical execution is involved |
| Operations | Operational evidence where applicable |
| Tracking | Updated task, milestone, risk, and issue state |
| Release | Version/tag/release evidence where applicable |

A phase must not be marked complete solely because its documentation exists.

## 18. Phase-to-Documentation Rules

The following ownership rules apply.

`docs/planning/PHASES.md` owns phase names, numbers, boundaries, and canonical phase relationships.

`docs/planning/IMPLEMENTATION_ROADMAP.md` owns implementation sequencing and dependency planning.

`docs/planning/DECISIONS.md` owns approved program-level decisions.

`docs/**/milestones/` owns detailed milestone scope.

`docs/tracking/` owns implementation status and evidence tracking.

`docs/protocol/` owns normative protocol contracts.

`docs/database/schema/` owns normative database schema definitions.

`docs/architecture/` owns system-level architectural definitions.

Domain architecture directories own implementation-level architecture for their domain.

No subordinate document may redefine the phase model.

## 19. Parallelization Rules

The program may execute independent work in parallel.

Examples include:

- Studio work and database foundation work.
- Artifact implementation and Control Plane implementation where interfaces are already defined.
- Cloud environment work and application implementation.
- Frontend implementation and backend implementation against approved contracts.
- Testing infrastructure and feature implementation.

Parallel work must not bypass dependency gates.

When parallel implementation changes an upstream contract, downstream work must be reassessed before integration.

Integration branches or equivalent controlled integration mechanisms must be used where multiple active workstreams converge.

## 20. Phase Gate Rules

A phase gate is passed only when:

1. Required milestone scope is implemented.
2. Required tests pass.
3. Required reviews are complete.
4. Required security controls are verified.
5. Required safety reviews are complete.
6. Required documentation is updated.
7. Known blockers are resolved or formally accepted.
8. Evidence is recorded.
9. Dependencies required by the next phase are available.
10. The phase owner or designated reviewer accepts the evidence.

A phase may remain open while downstream implementation proceeds only where the dependency relationship explicitly permits it.

## 21. Program-Level Acceptance Checklist

- [ ] P0 FOUNDATION is defined and governed.
- [ ] P1 STUDIO is defined and governed.
- [ ] P2 BUILD & ARTIFACT is defined and governed.
- [ ] P3 CONTROL PLANE is defined and governed.
- [ ] P4 BOOKING & COMMERCIAL is defined and governed.
- [ ] P5 EXECUTION is defined and governed.
- [ ] P6 LAB & ROBOT is defined and governed.
- [ ] P7 LIVE & RESULTS is defined and governed.
- [ ] P8 PRODUCTION is defined and governed.
- [ ] Frontend milestone mapping is consistent.
- [ ] Backend milestone mapping is consistent.
- [ ] Database milestone mapping is consistent.
- [ ] Cloud milestone mapping is consistent.
- [ ] Milestone dossiers remain authoritative for milestone scope.
- [ ] Tracking documents reference this phase model.
- [ ] Architecture documents reference this phase model.
- [ ] Protocol documents reference this phase model.
- [ ] Database documents reference this phase model.
- [ ] Security documents reference this phase model.
- [ ] Release documents reference this phase model.
- [ ] No subordinate document redefines phase names or numbers.
- [ ] Phase change control is enforced.

## 22. Open Questions

Open questions may exist within individual phase or milestone scopes.

They must not change the frozen phase model without formal change control.

Questions concerning implementation detail should be resolved within the relevant milestone dossier.

Questions affecting multiple domains should be recorded in `docs/planning/DECISIONS.md`.

Questions affecting schedule or dependencies should be recorded in the appropriate tracking document.

Questions affecting phase boundaries require formal change control.

## 23. Change-Control Record

The current phase model is frozen as the canonical Kritva RaaS phase model.

Any future proposal must identify:

- Proposed change.
- Reason.
- Affected phases.
- Affected milestones.
- Affected architecture documents.
- Affected protocol documents.
- Affected database documents.
- Affected tracking documents.
- Affected implementation tasks.
- Migration impact.
- Release impact.
- Risk impact.
- Approval authority.
- Effective date.

Until an approved change is recorded, this document remains authoritative.

## 24. Final Program Invariants

The following invariants apply across the complete phase model.

1. `docs/planning/PHASES.md` is the single source of truth for phase names and numbers.
2. The frozen phase model contains exactly P0 through P8.
3. Milestone dossiers under `docs/**/milestones/` are authoritative for milestone scope.
4. No downstream document may introduce an alternative phase model.
5. Product source code remains local during the normal build workflow.
6. Only approved artifacts cross the remote execution boundary.
7. PostgreSQL remains authoritative for structured business state.
8. Object storage holds large binary artifacts and result files.
9. Queue delivery does not become business truth.
10. Booking state is server authoritative.
11. Credit ledger state is strongly consistent.
12. Active resource allocations cannot overlap.
13. Job and Run remain distinct.
14. Artifact validation precedes execution.
15. Authorization is enforced at every protected boundary.
16. Organization remains the primary tenant boundary.
17. Live state does not replace durable state.
18. Video failure does not become robot safety authority.
19. Cloud services cannot override local robot safety authority.
20. Physical execution requires applicable safety review.
21. Production readiness is evidence-based.
22. Documentation status does not imply implementation status.
23. Phase completion requires accepted evidence.
24. Changes to this phase model require formal change control.

## 25. Changelog

### Current Baseline

- Established the frozen P0-P8 phase model.
- Established canonical phase names and numbers.
- Established cross-domain milestone mapping.
- Established phase ownership and dependency rules.
- Established phase acceptance and exit criteria.
- Established change-control authority.
- Removed retired phase and milestone terminology from the canonical phase definition.

### Corrections Pending Approval

- 2026-10-10 — External audit corrections (RAAS-001 to RAAS-009): DB-M02 CORE DATA removed from the P2 BUILD & ARTIFACT row of the cross-domain mapping to match the frozen mapping DB-M02 CORE DATA (P3), with the P2 dependency documented explicitly; primary product path (MVP) defined separately from the phase model. These are conformance corrections to the frozen model, not phase model changes. Approver: pending.

### Future Changes

All future changes must be recorded here with:

- Date.
- Change request identifier.
- Approved change.
- Reason.
- Affected phases.
- Affected milestones.
- Approver.
- Effective date.

No phase model change is effective until formally approved.
