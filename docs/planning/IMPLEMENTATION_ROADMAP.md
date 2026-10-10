# Kritva RaaS Implementation Roadmap

## 1. Purpose

This document defines the implementation sequencing, dependency structure, priority model, resource view, critical path, and cross-domain integration roadmap for Kritva RaaS.

The canonical definition of phases, phase names, phase numbers, phase boundaries, and phase-level acceptance criteria is maintained in:

    docs/planning/PHASES.md

This document does not redefine the phases. It uses `docs/planning/PHASES.md` as the authoritative phase definition and focuses on how work is sequenced across frontend, backend, database, and cloud domains.

The detailed scope of each milestone is authoritative in the corresponding milestone dossier under:

    docs/**/milestones/

This roadmap therefore answers:

- What should be implemented first?
- Which work depends on which other work?
- Which domains can proceed in parallel?
- What is on the critical path?
- Which work is P0, P1, P2, or later?
- What resources are required?
- Which interfaces must be stabilized before integration?
- What evidence is required before progressing?
- How should implementation effort be distributed across domains?

The roadmap is a sequencing and dependency document, not a replacement for milestone task specifications.

## 2. Canonical References

The following documents establish authoritative information:

| Document | Authority |
|---|---|
| `docs/planning/PHASES.md` | Canonical phase definition |
| `docs/planning/DECISIONS.md` | Program-level architectural decisions |
| `docs/**/milestones/` | Authoritative milestone scope |
| `docs/tracking/STATUS.md` | Program status |
| `docs/tracking/PHASE_STATUS.md` | Phase status |
| `docs/tracking/MILESTONE_STATUS.md` | Milestone status |
| `docs/tracking/TASK_STATUS.md` | Task status |
| `docs/tracking/RISK_REGISTER.md` | Program risks |
| `docs/tracking/DEPENDENCY_TRACKING.md` | Dependency status |

If this roadmap conflicts with `docs/planning/PHASES.md`, `docs/planning/PHASES.md` takes precedence for phase definitions.

If this roadmap conflicts with a milestone dossier regarding milestone scope, the milestone dossier takes precedence.

Any conflict between milestone scope and approved architecture must be resolved through formal decision/change control before implementation proceeds.

## 3. Frozen Phase Sequence

The implementation sequence follows the canonical phase model defined in `docs/planning/PHASES.md`.

The program sequence is:

    P0 FOUNDATION
          |
          v
    P1 STUDIO
          |
          v
    P2 BUILD & ARTIFACT
          |
          v
    P3 CONTROL PLANE
          |
          v
    P4 BOOKING & COMMERCIAL
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

The arrows represent primary dependency flow.

They do not prohibit parallel implementation of work whose prerequisites are already satisfied.

## 4. Cross-Domain Milestone Sequence

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

The same milestone may contribute to more than one phase where explicitly shown above.

DB-M02 CORE DATA (P3) is not a P2 BUILD & ARTIFACT milestone. P2 uses the DB-M01 FOUNDATION (P0-P3) identity, organization, project, migration, RLS, and audit foundations. Where P2 work needs persisted artifact, storage, or compatibility metadata, that is a cross-phase dependency on DB-M02 CORE DATA (P3); B-M02 ARTIFACT (P2-P3) completes registry persistence against DB-M02 CORE DATA during P3 CONTROL PLANE.

The milestone dossier remains authoritative for the complete milestone scope.

## 5. Implementation Priority Model

Implementation priorities are defined as follows.

| Priority | Meaning |
|---|---|
| PRI-0 | Critical invariant: required to establish the foundation or protect a safety, security, privacy, financial or data-integrity invariant |
| PRI-1 | Required for the primary product path (defined in `docs/planning/PHASES.md`) |
| PRI-2 | Required for expansion, operational maturity, or non-critical product breadth |
| PRI-3 | Future enhancement or lower-priority capability |

Priority uses the `PRI-n` notation so that it can never be confused with a phase identifier (`P0`-`P8`). Priority is distinct from phase number.

A PRI-1 task may occur in P0 FOUNDATION, P1 STUDIO, or a later phase if it is required for the primary product path.

Milestone priority is assigned from actual delivery criticality using the Priority Matrix (Section 26); not every milestone is PRI-0.

Security, tenant isolation, source privacy, artifact integrity, financial integrity, and physical safety requirements may be elevated to PRI-0 regardless of feature classification.

## 6. Program Sequencing Strategy

The recommended implementation strategy is:

1. Establish engineering foundations.
2. Establish the Studio and local project workflow.
3. Establish local build and trusted artifact generation.
4. Establish the Control Plane and authoritative platform/artifact interfaces.
5. Establish booking and commercial invariants.
6. Establish remote execution using simulation first.
7. Establish controlled Lab and Robot integration.
8. Establish live observation and result workflows.
9. Harden the complete system for production.

The implementation should avoid starting physical Robot execution before the software execution path, artifact validation, authorization, booking, and safety boundaries are proven through controlled environments.

## 7. P0 FOUNDATION Sequencing

P0 FOUNDATION establishes the minimum platform on which all other implementation depends.

Primary work:

- Repository foundation.
- Workspace setup.
- Development environment.
- CI foundation.
- Architecture baseline.
- Security baseline.
- Database foundation.
- Cloud foundation.
- Protocol documentation framework.
- Testing framework.
- Documentation governance.
- Tracking framework.

Primary milestones:

| Domain | Milestone |
|---|---|
| Frontend | F-M01 STUDIO FOUNDATION |
| Database | DB-M01 FOUNDATION |
| Cloud | C-M01 FOUNDATION |

Backend implementation does not require a dedicated P0 milestone under the frozen model, but backend implementation preparation may proceed where dependencies are satisfied.

### P0 Dependency Order

    Repository
       |
       +--> Development Environment
       |
       +--> CI
       |
       +--> Database Foundation
       |
       +--> Cloud Foundation
       |
       +--> Security Foundation
       |
       +--> Protocol Foundation
       |
       +--> F-M01 STUDIO FOUNDATION

### P0 FOUNDATION Priority

P0 FOUNDATION work is predominantly PRI-0.

Particular emphasis must be placed on:

- reproducibility
- security
- tenant boundaries
- source privacy
- migration discipline
- CI
- documentation consistency

## 8. P1 STUDIO Sequencing

P1 STUDIO establishes the Studio application and project workspace.

Primary milestones:

- F-M01 STUDIO FOUNDATION
- F-M02 PROJECTS
- DB-M01 FOUNDATION
- C-M02 DEVELOPMENT

The implementation sequence is:

    F-M01 STUDIO FOUNDATION
             |
             v
       F-M02 PROJECTS
             |
             v
       Local Workspace
             |
             v
    Target Platform Selection
             |
             v
      Local Build Boundary

F-M01 STUDIO FOUNDATION begins during P0 FOUNDATION and continues into P1 STUDIO.

F-M02 PROJECTS depends on the application shell, authentication, organization context, and local workspace boundaries.

Coding-agent integration (PRI-1, `docs/architecture/CODING_AGENT_INTEGRATION.md`) follows the same sequence. F-M01 delivers the adapter trait, mock provider, session manager, journal and lock, environment sanitizer, workspace guard and `agent.*` IPC. F-M02 then delivers the consent lifecycle, sessions in a staging workspace, change-set review and apply, recovery, isolation and the first provider. SYS-ADR-007 MUST be dispositioned before F-M02 coding-agent work starts.

### P1 Parallel Work

The following may proceed in parallel:

- Studio UI implementation.
- Local runtime interface definition.
- Database foundation completion.
- Development environment automation.
- API client scaffolding.
- Platform contract preparation.
- Coding-agent adapter contract and mock provider.

### P1 Critical Dependency

The most important P1 dependency is preservation of the source-code privacy boundary.

Customer source code must remain local.

Remote APIs must receive project metadata and approved artifacts, not normal project source.

This includes coding-agent sessions: no source, prompt, transcript or diff is sent to Kritva services. Disclosure to the user's chosen provider requires per-project consent (`docs/security/SOURCE_CODE_PRIVACY.md` Section 6.1).

## 9. P2 BUILD & ARTIFACT Sequencing

P2 BUILD & ARTIFACT establishes the trusted boundary between local development and remote execution.

Primary milestones:

- F-M03 BUILD & ARTIFACT
- B-M02 ARTIFACT
- DB-M01 FOUNDATION
- C-M02 DEVELOPMENT

Cross-phase dependency (not a P2 milestone):

- DB-M02 CORE DATA (P3), for persisted artifact, storage, and compatibility metadata.

The dependency sequence is:

    Local Project
         |
         v
    Local Toolchain
         |
         v
    Local Build
         |
         v
    Local Test
         |
         v
    Package
         |
         v
    Privacy Scan
         |
         v
    Manifest
         |
         v
    Integrity Check
         |
         v
    Signature
         |
         v
    Artifact Registry
         |
         v
    Compatibility Validation

P2 must stabilize the artifact contract before remote execution implementation is integrated.

In parallel, F-M03 BUILD & ARTIFACT adds the second coding-agent provider and the Kritva Studio MCP server. The MCP tools call the build, test, package and validate services above. They never call signing, upload or any Control Plane operation.

### P2 Critical Dependencies

- Artifact manifest contract.
- Artifact format.
- Platform identity.
- Platform version.
- Architecture.
- Runtime compatibility.
- SDK compatibility.
- Capability requirements.
- Artifact signature.
- Artifact checksum.
- Object storage metadata.
- Coding-agent MCP tool catalogue (`docs/architecture/CODING_AGENT_INTEGRATION.md` Section 7).

### P2 BUILD & ARTIFACT Priority

Artifact security and source privacy are PRI-0 invariants even though their primary implementation occurs during P2 BUILD & ARTIFACT.

## 10. P3 CONTROL PLANE Sequencing

P3 CONTROL PLANE establishes the authoritative product backend.

Primary milestones:

- B-M01 CONTROL PLANE
- B-M02 ARTIFACT
- B-M03 PLATFORM
- DB-M01 FOUNDATION
- DB-M02 CORE DATA
- C-M02 DEVELOPMENT

The implementation sequence is:

    Identity
       |
       v
    Organization
       |
       v
    Authorization
       |
       v
    Projects
       |
       +----------------+
       |                |
       v                v
    Platforms        Artifacts
       |                |
       +-------+--------+
               |
               v
        Compatibility
               |
               v
        Product APIs

### P3 Core Dependencies

P3 depends on:

- P0 FOUNDATION.
- P1 STUDIO.
- P2 BUILD & ARTIFACT.
- DB-M01 FOUNDATION.
- DB-M02 CORE DATA.
- C-M02 DEVELOPMENT.

### P3 Parallel Work

The following may proceed concurrently:

- API implementation.
- Database implementation.
- Platform catalog implementation.
- Artifact service implementation.
- Authorization implementation.
- Frontend API client integration.
- Cloud development environment automation.

### P3 CONTROL PLANE Critical Invariants

- Organization tenant isolation.
- Authorization enforcement.
- Artifact integrity.
- Platform compatibility.
- Idempotency.
- Auditability.
- Durable business state.

## 11. P4 BOOKING & COMMERCIAL Sequencing

P4 BOOKING & COMMERCIAL introduces authoritative resource and commercial workflows.

Primary milestones:

- F-M04 BOOKING
- B-M04 BOOKING
- DB-M03 BOOKING DATA
- C-M03 STAGING

The dependency sequence is:

    Platform Catalog
         |
         v
    Resource Catalog
         |
         v
    Availability
         |
         v
    Quote
         |
         v
    Credit Reservation
         |
         v
    Booking
         |
         v
    Resource Allocation
         |
         v
    Execution Eligibility

Commercial state must remain server authoritative.

The frontend may display balances, rates, availability, and quotes, but authoritative validation occurs in the Control Plane.

### P4 Critical Invariants

- No conflicting active allocation.
- No unauthorized credit consumption.
- No ledger imbalance.
- Historical rate data remains stable.
- Payment callbacks are idempotent.
- Booking confirmation revalidates availability.
- Credit reservation and booking state remain consistent.

### P4 Parallel Work

- Frontend booking UX.
- Backend booking service.
- Database booking constraints.
- Credit service.
- Payment abstraction.
- Staging infrastructure.

## 12. P5 EXECUTION Sequencing

P5 EXECUTION establishes the first complete remote execution path.

Primary milestones:

- F-M05 EXECUTION
- B-M05 EXECUTION
- DB-M04 EXECUTION DATA
- C-M03 STAGING

The core sequence is:

    Approved Artifact
         |
         v
    Confirmed Booking
         |
         v
    Eligibility Validation
         |
         v
    Job
         |
         v
    Queue
         |
         v
    Worker
         |
         v
    Lab Agent
         |
         v
    Deploy
         |
         v
    Run
         |
         v
    Result Metadata
         |
         v
    Cleanup

P5 should initially use a simulated Lab Agent and simulated execution environment.

Physical Robot execution is not required to prove the software execution orchestration path.

### P5 Critical Invariants

- Job and Run remain distinct.
- PostgreSQL remains authoritative.
- Queue is not business truth.
- Artifact-only deployment.
- Start and stop commands are idempotent.
- Unsafe physical actions are not blindly retried.
- Cleanup occurs after terminal execution.
- Booking and compatibility checks occur before execution.

## 13. P6 LAB & ROBOT Sequencing

P6 LAB & ROBOT extends the proven execution path into the Lab and Robot environment.

Primary milestones:

- B-M06 RESULTS
- DB-M04 EXECUTION DATA
- C-M03 STAGING

P6 depends strongly on P5 EXECUTION.

The recommended sequence is:

    Simulated Execution
          |
          v
    Lab Agent Integration
          |
          v
    Secure Lab Connectivity
          |
          v
    Resource Validation
          |
          v
    Robot State Integration
          |
          v
    Controlled Robot Execution
          |
          v
    Safety Qualification
          |
          v
    Approved Lab Operation

### P6 Safety Gate

Physical execution must not be treated as a normal software-only extension.

Required controls include:

- local safety authority
- emergency stop capability
- runtime safety monitoring
- controlled robot state
- Lab Agent authentication
- disconnect handling
- safe recovery behavior
- explicit human safety review

Cloud services must not become the physical safety authority.

## 14. P7 LIVE & RESULTS Sequencing

P7 LIVE & RESULTS builds the observation and analysis layer around execution.

Primary milestones:

- F-M06 LIVE
- F-M07 RESULTS
- B-M06 RESULTS
- DB-M04 EXECUTION DATA
- C-M03 STAGING

The implementation sequence is:

    Running Job / Run
           |
           +------------------+
           |                  |
           v                  v
        Video             Telemetry
           |                  |
           +--------+---------+
                    |
                    v
                  Logs
                    |
                    v
              Durable Result
                    |
          +---------+---------+
          |         |         |
          v         v         v
       Metrics   Experiment  Files
          |         |
          +----+----+
               |
               v
          Comparison
               |
               v
             Rerun

Live observation must remain separate from durable business state.

### P7 Critical Invariants

- Live state is not business truth.
- Video failure does not terminate execution automatically unless an explicit safety policy requires it.
- Telemetry freshness is visible.
- WebSocket events are deduplicated.
- Durable state survives Studio reconnect.
- Results are authorization protected.
- Rerun creates a new Job and Run.
- Historical Results remain immutable after publication except through controlled lifecycle transitions.

## 15. P8 PRODUCTION Sequencing

P8 PRODUCTION hardens the integrated product.

Primary milestones:

- B-M07 PRODUCTION
- C-M04 PRODUCTION

P8 work includes:

- security hardening
- tenant isolation validation
- performance validation
- scalability
- observability
- database reliability
- backup
- recovery
- disaster recovery
- operational runbooks
- release controls
- incident response
- vulnerability management
- production monitoring
- production qualification

The sequence is:

    Integrated Product
          |
          v
    Security Qualification
          |
          v
    Performance Qualification
          |
          v
    Reliability Qualification
          |
          v
    Recovery Qualification
          |
          v
    Operational Qualification
          |
          v
    Production Readiness
          |
          v
    Controlled Production Release

## 16. Critical Path

The principal critical path is:

    P0 FOUNDATION
         |
         v
    P1 STUDIO
         |
         v
    P2 BUILD & ARTIFACT
         |
         v
    P3 CONTROL PLANE
         |
         v
    P4 BOOKING & COMMERCIAL
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

The most critical cross-domain dependencies are:

1. F-M01 STUDIO FOUNDATION → F-M02 PROJECTS.
2. F-M02 PROJECTS → F-M03 BUILD & ARTIFACT.
3. F-M03 BUILD & ARTIFACT ↔ B-M02 ARTIFACT.
4. B-M02 ARTIFACT ↔ DB-M02 CORE DATA.
5. B-M03 PLATFORM ↔ DB-M02 CORE DATA.
6. B-M01 CONTROL PLANE → B-M04 BOOKING.
7. B-M04 BOOKING ↔ DB-M03 BOOKING DATA.
8. B-M04 BOOKING → B-M05 EXECUTION.
9. B-M05 EXECUTION ↔ DB-M04 EXECUTION DATA.
10. B-M05 EXECUTION → B-M06 RESULTS.
11. B-M06 RESULTS → F-M06 LIVE and F-M07 RESULTS.
12. P6 LAB & ROBOT → P7 LIVE & RESULTS.
13. B-M07 PRODUCTION and C-M04 PRODUCTION → P8 PRODUCTION.

A critical-path delay in any of these relationships can delay the integrated product.

## 17. Parallel Workstreams

The following workstreams can be developed in parallel when their interfaces are approved.

### Workstream A — Studio

- F-M01 STUDIO FOUNDATION.
- F-M02 PROJECTS.
- F-M03 BUILD & ARTIFACT.
- F-M04 BOOKING.
- F-M05 EXECUTION.
- F-M06 LIVE.
- F-M07 RESULTS.

### Workstream B — Backend

- B-M01 CONTROL PLANE.
- B-M02 ARTIFACT.
- B-M03 PLATFORM.
- B-M04 BOOKING.
- B-M05 EXECUTION.
- B-M06 RESULTS.
- B-M07 PRODUCTION.

### Workstream C — Database

- DB-M01 FOUNDATION.
- DB-M02 CORE DATA.
- DB-M03 BOOKING DATA.
- DB-M04 EXECUTION DATA.

### Workstream D — Cloud

- C-M01 FOUNDATION.
- C-M02 DEVELOPMENT.
- C-M03 STAGING.
- C-M04 PRODUCTION.

Parallel execution must follow approved contracts and dependency gates.

## 18. Interface-First Sequencing

Implementation should stabilize interfaces before parallel domain implementation becomes large.

The recommended interface order is:

1. Authentication contract.
2. Authorization model.
3. Organization and project contract.
4. Platform catalog contract.
5. Artifact manifest.
6. Artifact registry contract.
7. Booking contract.
8. Credit contract.
9. Job contract.
10. Run contract.
11. Lab Protocol.
12. Event contract.
13. WebSocket contract.
14. Result contract.
15. Rerun contract.

An interface should be considered stable only when:

- schema is documented
- ownership is defined
- versioning is defined
- error behavior is defined
- idempotency requirements are defined
- authorization requirements are defined
- tests exist
- downstream consumers are identified

## 19. Database Sequencing

Database work should follow the domain dependency sequence.

### DB-M01 FOUNDATION

Supports:

- P0 FOUNDATION.
- P1 STUDIO.
- P2 BUILD & ARTIFACT.
- P3 CONTROL PLANE.

Primary focus:

- PostgreSQL foundation
- migrations
- conventions
- identity
- organization
- project
- audit foundation
- tenant isolation foundation

### DB-M02 CORE DATA

Supports P3 CONTROL PLANE.

Primary focus:

- platform
- platform version
- architecture
- capability
- lab
- robot
- resource
- artifact metadata
- storage metadata
- compatibility metadata
- retention metadata

### DB-M03 BOOKING DATA

Supports P4 BOOKING & COMMERCIAL.

Primary focus:

- booking
- time slots
- allocations
- credit types
- plans
- rates
- wallets
- ledger
- reservations
- consumption
- refunds
- invoices
- payment metadata
- reconciliation

### DB-M04 EXECUTION DATA

Supports P5 EXECUTION through P7 LIVE & RESULTS.

Primary focus:

- Job
- Run
- execution state
- telemetry metadata
- log metadata
- video metadata
- Result
- Result File
- Result Metric
- Experiment
- Comparison
- Download
- retention

## 20. Cloud Sequencing

### C-M01 FOUNDATION

Supports P0 FOUNDATION.

Focus:

- account/project structure
- network
- IAM
- secrets
- KMS
- DNS/TLS
- audit
- observability
- cost controls
- foundational persistence

### C-M02 DEVELOPMENT

Supports P1 STUDIO through P3 CONTROL PLANE.

Focus:

- development environment
- CI/CD
- development compute
- development database
- object storage
- queue
- secrets
- observability
- development connectivity

### C-M03 STAGING

Supports P4 BOOKING & COMMERCIAL through P7 LIVE & RESULTS.

Focus:

- staging application
- staging database
- staging object storage
- staging queue
- Lab connectivity
- execution workers
- WebSocket infrastructure
- media infrastructure
- monitoring

### C-M04 PRODUCTION

Supports P8 PRODUCTION.

Focus:

- production infrastructure
- high availability
- backup
- recovery
- monitoring
- alerting
- security
- operational controls
- production deployment

## 21. Resource View

The implementation requires four primary engineering capability groups.

| Capability | Primary responsibility |
|---|---|
| Product/UI | Studio, project workflow, booking, execution, live, results |
| Backend | Control Plane, artifact, platform, booking, execution, results, production |
| Database | PostgreSQL schemas, migrations, integrity, performance, recovery |
| Cloud/Infrastructure | environments, CI/CD, networking, security, observability, reliability |

Specialist review is required for:

- security
- database architecture
- financial integrity
- protocol architecture
- physical Robot safety
- production operations

## 22. Resource Allocation Strategy

Early resources should prioritize foundation and interface work.

Recommended emphasis:

| Phase | Highest resource focus |
|---|---|
| P0 FOUNDATION | Architecture, infrastructure, database, security |
| P1 STUDIO | Frontend and local runtime integration |
| P2 BUILD & ARTIFACT | Frontend, backend artifact, security |
| P3 CONTROL PLANE | Backend, database, cloud |
| P4 BOOKING & COMMERCIAL | Backend, database, frontend |
| P5 EXECUTION | Backend, frontend, cloud, database |
| P6 LAB & ROBOT | Runtime, Lab, Robot, backend |
| P7 LIVE & RESULTS | Frontend, backend, media, data |
| P8 PRODUCTION | Cloud, backend, database, security, operations |

The program should avoid concentrating all resources on frontend feature delivery while backend, database, cloud, security, and integration dependencies remain unresolved.

## 23. Integration Gates

Major integration gates should occur at the following points.

### Gate G0

P0 FOUNDATION complete enough to support implementation.

### Gate G1

P1 STUDIO complete enough to create and manage a local project.

### Gate G2

P2 BUILD & ARTIFACT complete enough to produce a trusted `.krv` artifact.

### Gate G3

P3 CONTROL PLANE complete enough to authenticate, authorize, discover platforms, and register artifacts.

### Gate G4

P4 BOOKING & COMMERCIAL complete enough to reserve resources and credits transactionally.

### Gate G5

P5 EXECUTION complete enough to execute an approved artifact in a simulated environment.

### Gate G6

P6 LAB & ROBOT complete enough for controlled Robot execution under approved safety controls.

### Gate G7

P7 LIVE & RESULTS complete enough to observe, analyze, store, compare, and rerun execution.

### Gate G8

P8 PRODUCTION complete enough for controlled production operation.

## 24. End-to-End Integration Path

The target integrated product path is:

    Developer
       |
       v
    RaaS Studio
       |
       v
    Local Project
       |
       v
    Local Build
       |
       v
    .krv Artifact
       |
       v
    Artifact Validation
       |
       v
    Control Plane
       |
       v
    Platform Selection
       |
       v
    Booking
       |
       v
    Credit Reservation
       |
       v
    Job
       |
       v
    Run
       |
       v
    Lab Agent
       |
       v
    Kritva Runtime
       |
       v
    Robot / Simulator
       |
       +----------+
       |          |
       v          v
    Video     Telemetry
       |          |
       +-----+----+
             |
             v
           Logs
             |
             v
           Result
             |
             v
        Experiment
             |
             v
         Comparison
             |
             v
           Rerun

This path must remain consistent with the contracts and invariants established by the applicable phases and milestone dossiers.

## 25. Primary Product Path (Critical Path)

The primary product path (MVP), as defined in `docs/planning/PHASES.md` Section 3.1, is not a phase or milestone. Its milestone critical path is:

    F-M01 STUDIO FOUNDATION
            |
            v
    F-M02 PROJECTS (incl. coding-agent sessions)
            |
            v
    F-M03 BUILD & ARTIFACT (incl. MCP tools, second provider)
            |
            v
    B-M02 ARTIFACT
            |
            v
    B-M01 CONTROL PLANE
            |
            v
    B-M03 PLATFORM
            |
            v
    F-M04 BOOKING
            |
            v
    B-M04 BOOKING
            |
            v
    B-M05 EXECUTION
            |
            v
    F-M05 EXECUTION
            |
            v
    F-M06 LIVE
            |
            v
    F-M07 RESULTS

The database and cloud milestones supporting these steps must be completed to the required integration level.

The coding-agent capability is on this path, but its runtime use is not. Every step MUST also pass with no coding-agent provider installed.

## 26. Priority Matrix

| Work Area | Priority |
|---|---|
| Repository and CI foundation | PRI-0 |
| Authentication | PRI-0 |
| Authorization | PRI-0 |
| Tenant isolation | PRI-0 |
| Source-code privacy | PRI-0 |
| Artifact integrity | PRI-0 |
| Database integrity | PRI-0 |
| Booking integrity | PRI-0 |
| Credit ledger integrity | PRI-0 |
| Physical safety | PRI-0 |
| Studio foundation | PRI-1 |
| Project workflow | PRI-1 |
| Local build | PRI-1 |
| Artifact packaging | PRI-1 |
| Platform discovery | PRI-1 |
| Booking | PRI-1 |
| Remote execution | PRI-1 |
| Live observation | PRI-1 |
| Results | PRI-1 |
| Coding-agent integration (Claude Code, OpenAI Codex, MCP tools) | PRI-1 |
| Coding-agent source-privacy, credential and MCP-tool restrictions | PRI-0 |
| Coding-agent policy and provider metadata | PRI-1 |
| Experiments | PRI-2 |
| Advanced comparison | PRI-2 |
| Production scale optimization | PRI-2 |
| Advanced commercial features | PRI-2 |

Safety and security classifications override normal feature priority.

## 27. Dependency Management

Every cross-domain dependency should have:

- dependency identifier
- provider
- consumer
- required capability
- expected completion
- dependency status
- owner
- blocking impact
- validation method
- resolution evidence

Dependencies should be tracked through `docs/tracking/DEPENDENCY_TRACKING.md`.

A dependency becomes satisfied only after the consuming domain verifies the required interface or capability.

## 28. Risk Management

The implementation roadmap must continuously monitor:

- architecture drift
- contract drift
- schedule dependencies
- resource availability
- database migration risk
- cloud readiness
- source privacy
- tenant isolation
- artifact security
- financial integrity
- execution reliability
- Lab connectivity
- Robot safety
- production readiness

The authoritative risk register is:

    docs/tracking/RISK_REGISTER.md

A risk that threatens a critical-path milestone must be escalated immediately.

## 29. Schedule Protection

Critical-path work should receive priority over independent enhancements.

When schedule pressure occurs:

1. Protect security and safety invariants.
2. Protect database and financial integrity.
3. Protect artifact and execution boundaries.
4. Protect critical integration contracts.
5. Defer non-critical UI enhancements.
6. Defer advanced analytics.
7. Defer non-essential commercial features.
8. Do not remove mandatory validation solely to recover schedule.

Schedule acceleration must not bypass architecture or safety review.

## 30. Definition of Ready for Roadmap Work

Work should not enter active implementation until:

- objective is understood
- milestone is identified
- phase is identified
- dependencies are known
- acceptance criteria exist
- required interfaces are identified
- security impact is assessed
- database impact is assessed
- testing approach is known
- owner is identified
- implementation evidence location is known

## 31. Definition of Done for Roadmap Work

Work is complete only when:

- implementation exists
- tests pass
- documentation is updated
- required review is complete
- security review is complete where applicable
- safety review is complete where applicable
- integration evidence exists
- tracking status is updated
- no unresolved blocker remains
- milestone acceptance criteria are satisfied

## 32. Roadmap Governance

This roadmap should be updated when:

- an approved dependency changes
- milestone sequencing changes
- resource allocation changes materially
- a critical-path risk changes
- an architecture decision changes implementation sequencing
- a release decision changes scope

It should not be edited merely to reflect implementation progress.

Implementation progress belongs in `docs/tracking/`.

Phase definitions belong in `docs/planning/PHASES.md`.

Milestone scope belongs in `docs/**/milestones/`.

## 33. Change Control

Any change to this roadmap must preserve the frozen phase and milestone identifiers.

Changes may modify:

- sequencing
- dependencies
- resource allocation
- priority
- integration timing
- critical-path assumptions

Changes must not silently modify the canonical phase definitions.

If a proposed roadmap change requires changing a phase definition, the change must first be approved through the program change-control process and then reflected in `docs/planning/PHASES.md`.

## 34. Roadmap Acceptance Checklist

- [ ] All phases use the canonical definitions from `docs/planning/PHASES.md`.
- [ ] P0 FOUNDATION is sequenced first.
- [ ] P1 STUDIO follows the required P0 dependencies.
- [ ] P2 BUILD & ARTIFACT follows Studio and local build dependencies.
- [ ] P3 CONTROL PLANE follows artifact and database foundations.
- [ ] P4 BOOKING & COMMERCIAL follows Control Plane and platform dependencies.
- [ ] P5 EXECUTION follows booking and artifact dependencies.
- [ ] P6 LAB & ROBOT follows execution readiness.
- [ ] P7 LIVE & RESULTS follows execution and Lab integration.
- [ ] P8 PRODUCTION follows integrated system qualification.
- [ ] Frontend milestone IDs are canonical.
- [ ] Backend milestone IDs are canonical.
- [ ] Database milestone IDs are canonical.
- [ ] Cloud milestone IDs are canonical.
- [ ] Milestone scope is delegated to authoritative milestone dossiers.
- [ ] Critical path is documented.
- [ ] Parallel work is identified.
- [ ] Resource requirements are identified.
- [ ] Integration gates are defined.
- [ ] Security and safety priorities are protected.
- [ ] Roadmap does not redefine phase scope.
- [ ] Change-control rules are defined.

## 35. Final Roadmap Invariants

1. `docs/planning/PHASES.md` is authoritative for phase definitions.
2. This document is authoritative for implementation sequencing and dependency planning.
3. Milestone dossiers are authoritative for milestone scope.
4. Tracking documents are authoritative for implementation status.
5. Phase and milestone IDs must remain stable unless formally changed.
6. Critical-path dependencies must be explicitly tracked.
7. Independent work should proceed in parallel where safe.
8. Security and safety cannot be traded away for schedule.
9. Database and financial integrity are protected throughout implementation.
10. Source-code privacy remains a system invariant.
11. Artifact trust remains a system invariant.
12. Organization tenant isolation remains a system invariant.
13. Job and Run remain separate.
14. Durable state remains authoritative over queues and live transport.
15. Local safety remains authoritative for Robot operation.
16. Production readiness is evidence-based.
17. Documentation does not substitute for implementation.
18. Milestone acceptance does not substitute for system integration.
19. Roadmap changes require controlled review.
20. The frozen phase and milestone model must remain consistent across the repository.

## 36. Changelog

### Current Baseline

- Aligned roadmap sequencing with `docs/planning/PHASES.md`.
- Established cross-domain milestone mapping using the frozen milestone identifiers.
- Established the critical path.
- Established implementation priority rules.
- Established parallel workstreams.
- Established resource planning guidance.
- Established integration gates.
- Established roadmap governance and change control.
- Removed retired phase and milestone terminology.

### Future Changes

Future changes should record:

- Date.
- Change request identifier.
- Affected phase.
- Affected milestone.
- Sequencing change.
- Dependency change.
- Resource impact.
- Critical-path impact.
- Approval.
- Effective date.
