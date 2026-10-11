# Kritva RaaS Dependency Map

## 1. Purpose

This document defines the dependency relationships between the frozen Kritva RaaS phases and domain milestones.

The canonical phase definition is maintained in:

    planning/PHASES.md

This document does not redefine phase scope. It maps dependencies, sequencing, critical paths, integration points, and cross-domain relationships using the canonical phase and milestone identifiers.

The detailed scope of each milestone is authoritative in the corresponding dossier under:

    docs/**/milestones/

This document answers:

- Which phase depends on which preceding phase?
- Which milestone depends on another milestone?
- Which dependencies are hard blockers?
- Which dependencies permit parallel implementation?
- Which interfaces must be stabilized?
- Which dependencies form the critical path?
- Where do frontend, backend, database, and cloud work converge?
- Which dependencies require explicit integration testing?
- Which dependencies require security or safety review?

## 2. Canonical References

| Document | Authority |
|---|---|
| `planning/PHASES.md` | Canonical phase definition |
| `planning/IMPLEMENTATION_ROADMAP.md` | Implementation sequencing |
| `planning/RELEASE_ROADMAP.md` | Release sequencing and qualification |
| `planning/DECISIONS.md` | Approved program decisions |
| `docs/**/milestones/` | Authoritative milestone scope |
| `docs/tracking/DEPENDENCY_TRACKING.md` | Live dependency status |
| `docs/tracking/RISK_REGISTER.md` | Dependency-related risks |
| `docs/tracking/STATUS.md` | Current implementation status |

If this document conflicts with `planning/PHASES.md`, `planning/PHASES.md` takes precedence for phase identity and phase relationships.

If this document conflicts with a milestone dossier regarding milestone scope, the milestone dossier takes precedence.

Dependency status is maintained in `docs/tracking/DEPENDENCY_TRACKING.md`.

## 3. Dependency Principles

The dependency model follows these principles:

1. Dependencies must be explicit.
2. A dependency must identify both producer and consumer.
3. Interface dependencies should be defined before large-scale parallel implementation.
4. Hard dependencies block downstream acceptance.
5. Soft dependencies may permit parallel implementation.
6. Security dependencies are treated as mandatory.
7. Financial dependencies are treated as mandatory.
8. Physical safety dependencies are treated as mandatory.
9. Database integrity dependencies are treated as mandatory.
10. Contract changes require impact analysis.
11. Dependency completion requires verification by the consuming domain.
12. Documentation alone does not satisfy an implementation dependency.
13. Test evidence is required for critical integration dependencies.
14. Phase dependencies follow `planning/PHASES.md`.
15. Milestone dependencies follow the frozen milestone IDs.
16. Cross-domain dependencies must be traceable.
17. External dependencies must be tracked separately from internal dependencies.
18. A blocked dependency must be visible in program tracking.
19. Dependency completion must not be inferred from schedule.
20. Physical Robot dependencies require explicit safety qualification.

## 4. Dependency Types

| Type | Definition |
|---|---|
| HARD | Downstream implementation or acceptance cannot proceed without it |
| SOFT | Work can proceed using mocks, stubs, or agreed temporary interfaces |
| CONTRACT | Depends on an approved interface or schema |
| DATA | Depends on authoritative data structures |
| SECURITY | Depends on security controls or trust boundaries |
| FINANCIAL | Depends on credit, payment, or financial integrity |
| SAFETY | Depends on Robot or physical safety controls |
| OPERATIONAL | Depends on infrastructure or operational capability |
| RELEASE | Depends on release qualification or compatibility |
| EXTERNAL | Depends on an external system, vendor, or resource |

## 5. Frozen Phase Dependency Graph

The primary dependency graph is:

    P0 FOUNDATION
          |
          +-------------------+
          |                   |
          v                   v
    P1 STUDIO          P2 BUILD & ARTIFACT
          |                   |
          +---------+---------+
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

The graph represents the primary implementation dependency path.

Parallel implementation is permitted where an upstream interface is sufficiently defined and the downstream work does not require completed runtime behavior.

## 6. Phase Dependency Matrix

| Consumer Phase | Primary Upstream Dependency | Dependency Type |
|---|---|---|
| P0 FOUNDATION | None | — |
| P1 STUDIO | P0 FOUNDATION | HARD |
| P2 BUILD & ARTIFACT | P1 STUDIO | HARD |
| P3 CONTROL PLANE | P0 FOUNDATION; P2 BUILD & ARTIFACT | HARD |
| P4 BOOKING & COMMERCIAL | P3 CONTROL PLANE | HARD |
| P5 EXECUTION | P2 BUILD & ARTIFACT; P3 CONTROL PLANE; P4 BOOKING & COMMERCIAL | HARD |
| P6 LAB & ROBOT | P5 EXECUTION | HARD |
| P7 LIVE & RESULTS | P5 EXECUTION; P6 LAB & ROBOT | HARD |
| P8 PRODUCTION | P0 FOUNDATION through P7 LIVE & RESULTS | HARD |

The exact phase definitions remain in `planning/PHASES.md`.

## 7. P0 FOUNDATION Dependencies

P0 FOUNDATION has no upstream Kritva RaaS phase dependency.

It depends on external engineering resources such as:

- source-control hosting
- development machines
- CI execution
- required language toolchains
- PostgreSQL development capability
- cloud account access
- required security tooling

Primary milestones:

- F-M01 STUDIO FOUNDATION
- DB-M01 FOUNDATION
- C-M01 FOUNDATION

### P0 Dependency Outputs

P0 must establish dependencies consumed by:

- P1 STUDIO
- P2 BUILD & ARTIFACT
- P3 CONTROL PLANE
- P4 BOOKING & COMMERCIAL
- P5 EXECUTION
- P6 LAB & ROBOT
- P7 LIVE & RESULTS
- P8 PRODUCTION

Key outputs include:

- repository conventions
- CI
- development environment
- architecture baseline
- database foundation
- security baseline
- cloud foundation
- protocol governance
- testing framework
- documentation governance

## 8. P1 STUDIO Dependencies

P1 STUDIO depends on P0 FOUNDATION.

Primary milestones:

- F-M01 STUDIO FOUNDATION
- F-M02 PROJECTS
- DB-M01 FOUNDATION
- C-M02 DEVELOPMENT

Primary dependency chain:

    P0 FOUNDATION
          |
          v
    F-M01 STUDIO FOUNDATION
          |
          v
    F-M02 PROJECTS
          |
          v
    Local Project Workspace

Critical dependencies include:

- authentication
- organization context
- authorization
- local workspace
- API client
- Tauri IPC
- project metadata
- local source boundary
- coding-agent adapter contract and SYS-ADR-007 disposition

P1 STUDIO does not require P3 CONTROL PLANE to complete all local Studio work, provided approved interfaces and controlled development substitutes are available.

## 9. P2 BUILD & ARTIFACT Dependencies

P2 BUILD & ARTIFACT depends on P1 STUDIO.

Primary milestones:

- F-M03 BUILD & ARTIFACT
- B-M02 ARTIFACT
- DB-M01 FOUNDATION
- DB-M02 CORE DATA
- C-M02 DEVELOPMENT

Primary dependency chain:

    P1 STUDIO
          |
          v
    F-M03 BUILD & ARTIFACT
          |
          +------------------+
          |                  |
          v                  v
    Local Build        Artifact Contract
          |                  |
          +--------+---------+
                   |
                   v
             B-M02 ARTIFACT
                   |
                   v
            DB-M02 CORE DATA

Critical interfaces include:

- artifact manifest
- artifact format
- checksum
- signature
- platform identity
- architecture
- runtime version
- SDK version
- capability requirements
- storage metadata

Source code must remain outside the remote artifact upload boundary.

## 10. P3 CONTROL PLANE Dependencies

P3 CONTROL PLANE depends on:

- P0 FOUNDATION
- P1 STUDIO
- P2 BUILD & ARTIFACT

Primary milestones:

- B-M01 CONTROL PLANE
- B-M02 ARTIFACT
- B-M03 PLATFORM
- DB-M01 FOUNDATION
- DB-M02 CORE DATA
- C-M02 DEVELOPMENT

Dependency chain:

    DB-M01 FOUNDATION
           |
           v
    DB-M02 CORE DATA
           |
           +-------------------+
           |                   |
           v                   v
    B-M03 PLATFORM       B-M02 ARTIFACT
           |                   |
           +---------+---------+
                     |
                     v
              B-M01 CONTROL PLANE

P3 CONTROL PLANE establishes authoritative services required by P4 BOOKING & COMMERCIAL.

## 11. P4 BOOKING & COMMERCIAL Dependencies

P4 BOOKING & COMMERCIAL depends on P3 CONTROL PLANE.

Primary milestones:

- F-M04 BOOKING
- B-M04 BOOKING
- DB-M03 BOOKING DATA
- C-M03 STAGING

Dependency chain:

    B-M03 PLATFORM
          |
          v
    Resource Availability
          |
          v
    DB-M03 BOOKING DATA
          |
          v
    B-M04 BOOKING
          |
          +----------------+
          |                |
          v                v
    F-M04 BOOKING     Credit Services
          |                |
          +--------+-------+
                   |
                   v
          Execution Eligibility

Critical dependencies include:

- platform catalog
- resource catalog
- resource availability
- booking state
- resource allocation
- credit type
- credit plan
- rate card
- wallet
- credit reservation
- financial ledger

## 12. P5 EXECUTION Dependencies

P5 EXECUTION depends on:

- P2 BUILD & ARTIFACT
- P3 CONTROL PLANE
- P4 BOOKING & COMMERCIAL

Primary milestones:

- F-M05 EXECUTION
- B-M05 EXECUTION
- DB-M04 EXECUTION DATA
- C-M03 STAGING

Dependency chain:

    Approved Artifact
          |
          v
    B-M02 ARTIFACT
          |
          v
    B-M03 PLATFORM
          |
          v
    B-M04 BOOKING
          |
          v
    B-M05 EXECUTION
          |
          v
    DB-M04 EXECUTION DATA
          |
          v
    F-M05 EXECUTION

Execution must validate:

- authorization
- artifact state
- artifact signature
- artifact integrity
- platform compatibility
- booking
- resource allocation
- resource state
- policy

## 13. P6 LAB & ROBOT Dependencies

P6 LAB & ROBOT depends on P5 EXECUTION.

Primary milestones:

- B-M06 RESULTS
- DB-M04 EXECUTION DATA
- C-M03 STAGING

Key dependencies include:

- Lab Agent identity
- Lab Protocol
- runtime interface
- resource state
- Robot state
- artifact validation
- deployment
- start/stop behavior
- heartbeat
- disconnect handling
- reconnect handling
- local safety authority

The dependency chain is:

    P5 EXECUTION
          |
          v
    Simulated Lab Agent
          |
          v
    Lab Agent Connectivity
          |
          v
    Runtime Integration
          |
          v
    Controlled Robot Execution

Physical Robot operation requires safety qualification before production use.

## 14. P7 LIVE & RESULTS Dependencies

P7 LIVE & RESULTS depends on:

- P5 EXECUTION
- P6 LAB & ROBOT

Primary milestones:

- F-M06 LIVE
- F-M07 RESULTS
- B-M06 RESULTS
- DB-M04 EXECUTION DATA
- C-M03 STAGING

Dependency chain:

    P5 EXECUTION
          |
          v
    P6 LAB & ROBOT
          |
          +----------------+
          |                |
          v                v
        Video          Telemetry
          |                |
          +-------+--------+
                  |
                  v
                Logs
                  |
                  v
               Results
                  |
          +-------+-------+
          |               |
          v               v
      Experiment      Comparison
          |
          v
        Rerun

Live transport is observational and must not replace durable execution state.

## 15. P8 PRODUCTION Dependencies

P8 PRODUCTION depends on integrated evidence from:

- P0 FOUNDATION
- P1 STUDIO
- P2 BUILD & ARTIFACT
- P3 CONTROL PLANE
- P4 BOOKING & COMMERCIAL
- P5 EXECUTION
- P6 LAB & ROBOT
- P7 LIVE & RESULTS

Primary milestones:

- B-M07 PRODUCTION
- C-M04 PRODUCTION

Critical dependencies include:

- security qualification
- tenant isolation
- database reliability
- backup
- recovery
- observability
- incident response
- deployment automation
- rollback
- capacity validation
- production monitoring
- physical safety qualification where applicable

## 16. Frontend Milestone Dependency Graph

The frontend dependency graph is:

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
              +----------+
              |          |
              v          v
          F-M06 LIVE  F-M07 RESULTS

F-M04 BOOKING additionally depends on backend, database, and cloud capabilities from P3 CONTROL PLANE and P4 BOOKING & COMMERCIAL.

F-M05 EXECUTION depends on backend execution and database execution capabilities.

F-M06 LIVE and F-M07 RESULTS depend on P5 EXECUTION and P6 LAB & ROBOT.

## 17. Backend Milestone Dependency Graph

The backend dependency graph is:

    B-M02 ARTIFACT
          |
          +---------+
          |         |
          v         v
    B-M03 PLATFORM B-M01 CONTROL PLANE
          |         |
          +----+----+
               |
               v
         B-M04 BOOKING
               |
               v
        B-M05 EXECUTION
               |
               v
         B-M06 RESULTS
               |
               v
        B-M07 PRODUCTION

B-M02 ARTIFACT spans P2 BUILD & ARTIFACT and P3 CONTROL PLANE.

B-M06 RESULTS spans P6 LAB & ROBOT and P7 LIVE & RESULTS.

## 18. Database Milestone Dependency Graph

The database dependency graph is:

    DB-M01 FOUNDATION
          |
          v
    DB-M02 CORE DATA
          |
          v
    DB-M03 BOOKING DATA
          |
          v
    DB-M04 EXECUTION DATA

DB-M01 FOUNDATION supports P0 FOUNDATION through P3 CONTROL PLANE.

DB-M02 CORE DATA supports P3 CONTROL PLANE.

DB-M03 BOOKING DATA supports P4 BOOKING & COMMERCIAL.

DB-M04 EXECUTION DATA supports P5 EXECUTION through P7 LIVE & RESULTS.

## 19. Cloud Milestone Dependency Graph

The cloud dependency graph is:

    C-M01 FOUNDATION
          |
          v
    C-M02 DEVELOPMENT
          |
          v
    C-M03 STAGING
          |
          v
    C-M04 PRODUCTION

C-M01 FOUNDATION supports P0 FOUNDATION.

C-M02 DEVELOPMENT supports P1 STUDIO through P3 CONTROL PLANE.

C-M03 STAGING supports P4 BOOKING & COMMERCIAL through P7 LIVE & RESULTS.

C-M04 PRODUCTION supports P8 PRODUCTION.

## 20. Cross-Domain Dependency Matrix

| Producer | Consumer | Dependency |
|---|---|---|
| F-M01 STUDIO FOUNDATION | F-M02 PROJECTS | Studio application foundation |
| F-M02 PROJECTS | F-M03 BUILD & ARTIFACT | Local project workspace |
| F-M03 BUILD & ARTIFACT | B-M02 ARTIFACT | Artifact contract |
| B-M02 ARTIFACT | B-M05 EXECUTION | Approved executable artifact |
| B-M03 PLATFORM | B-M04 BOOKING | Platform/resource eligibility |
| B-M04 BOOKING | B-M05 EXECUTION | Confirmed booking and allocation |
| DB-M03 BOOKING DATA | B-M04 BOOKING | Authoritative booking state |
| DB-M04 EXECUTION DATA | B-M05 EXECUTION | Durable Job/Run state |
| B-M05 EXECUTION | B-M06 RESULTS | Execution data |
| B-M06 RESULTS | F-M07 RESULTS | Result services |
| C-M03 STAGING | B-M05 EXECUTION | Execution infrastructure |
| C-M03 STAGING | B-M06 RESULTS | Live/result infrastructure |
| B-M05 EXECUTION | P6 LAB & ROBOT | Execution integration |
| P6 LAB & ROBOT | F-M06 LIVE | Robot/Lab state |
| P6 LAB & ROBOT | B-M06 RESULTS | Runtime and Lab data |
| B-M07 PRODUCTION | P8 PRODUCTION | Backend production readiness |
| C-M04 PRODUCTION | P8 PRODUCTION | Production infrastructure |

## 21. Integration Point IP-01: Studio to Local Runtime

The Studio depends on the Local Runtime for operations that must remain local.

Required integration:

    Studio
      |
      | Tauri IPC
      v
    Local Runtime
      |
      +--> Workspace
      +--> Build
      +--> Test
      +--> Package
      +--> Privacy Scan
      +--> Sign

Critical properties:

- source remains local
- IPC is authenticated within the local application boundary
- long operations are cancellable
- progress is observable
- failures are actionable

Primary dependency:

- F-M01 STUDIO FOUNDATION → F-M02 PROJECTS → F-M03 BUILD & ARTIFACT

The Local Runtime also hosts coding-agent adapters and the Kritva Studio MCP server (IP-12).

## 22. Integration Point IP-02: Studio to Control Plane

Required integration:

    Studio
       |
       | HTTPS / WebSocket
       v
    Control Plane

Dependencies include:

- authentication
- authorization
- organization context
- project metadata
- platform discovery
- artifact operations
- booking
- Job/Run state
- Results

The Control Plane remains authoritative for remote business state.

## 23. Integration Point IP-03: Artifact Boundary

Required integration:

    Local Source
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
    Lab

The boundary must prevent normal source-code transfer.

Dependencies include:

- F-M03 BUILD & ARTIFACT
- B-M02 ARTIFACT
- DB-M02 CORE DATA
- artifact manifest
- signature validation
- compatibility validation

## 24. Integration Point IP-04: Platform and Resource

Required integration:

    B-M03 PLATFORM
          |
          v
    DB-M02 CORE DATA
          |
          v
    Resource
          |
          v
    Booking Eligibility

The Platform catalog defines supported platform properties.

The Resource represents an allocatable operational unit.

Robot identity and resource allocation must remain distinct.

## 25. Integration Point IP-05: Booking and Credits

Required integration:

    Booking Request
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
    Booking Confirmation
          |
          v
    Resource Allocation

Dependencies:

- B-M04 BOOKING
- DB-M03 BOOKING DATA
- F-M04 BOOKING
- C-M03 STAGING

Credit reservation and booking confirmation must be coordinated through authoritative application services.

## 26. Integration Point IP-06: Booking to Execution

Required integration:

    Confirmed Booking
          |
          v
    Resource Allocation
          |
          v
    Execution Eligibility
          |
          v
    Job
          |
          v
    Run

Execution must revalidate required conditions.

A previously valid booking does not guarantee current execution eligibility if:

- booking expired
- resource changed state
- artifact was revoked
- compatibility changed
- authorization changed
- safety state became invalid

## 27. Integration Point IP-07: Execution to Lab

Required integration:

    B-M05 EXECUTION
          |
          | Lab Protocol
          v
    Lab Agent
          |
          v
    Kritva Runtime
          |
          v
    Robot / Simulator

Required dependencies:

- authentication
- authorization
- artifact validation
- deployment
- start
- stop
- status
- heartbeat
- cleanup

Physical execution adds safety requirements.

## 28. Integration Point IP-08: Execution to Results

Required integration:

    Job
      |
      v
    Run
      |
      +--> Logs
      +--> Telemetry
      +--> Video Metadata
      |
      v
    Result
      |
      +--> Result Files
      +--> Metrics
      +--> Experiment
      +--> Comparison

Durable Result state must remain independent of transient live transport.

## 29. Integration Point IP-09: Live Data

Live data paths include:

    Job/Run State -> REST/WebSocket
    Video -> WebRTC
    Telemetry -> WebSocket or specialized transport
    Logs -> WebSocket + durable storage
    Safety State -> live + durable snapshot
    Lab State -> REST/WebSocket

A live connection failure must not restart execution.

Reconnect must reconstruct state from authoritative durable state and current snapshots.

## 30. Integration Point IP-10: Results and Rerun

The rerun dependency is:

    Existing Result
          |
          v
    Selected Configuration
          |
          v
    New Job
          |
          v
    New Run
          |
          v
    New Result

Rerun must never mutate the identity of the original Job or Run.

Historical Results remain independently addressable.

## 31. Integration Point IP-11: Production

Production integrates:

    B-M07 PRODUCTION
            |
            +------+
            |      |
            v      v
      C-M04 PRODUCTION
            |
            v
       Production
            |
            +--> PostgreSQL
            +--> Object Storage
            +--> Queue
            +--> Workers
            +--> WebSocket
            +--> Media
            +--> Lab Connectivity

Production readiness depends on integrated evidence from all applicable upstream phases.

## 32. Integration Point IP-12: Studio to Coding-Agent Provider

Architecture: `docs/architecture/CODING_AGENT_INTEGRATION.md`. Decision: SYS-ADR-007.

Required integration:

    Studio UI
      |
      | Tauri IPC (agent.*)
      v
    Local Runtime ---- Provider adapter ----> Provider CLI ----> Provider service
      |                                          |                (user's account)
      +<--------- Kritva Studio MCP server <-----+
      |
      | HTTPS (policy and provider metadata only)
      v
    Control Plane (B-M01 policy, B-M03 provider metadata)

Critical properties:

- no source, prompt, transcript or diff reaches Kritva services
- per-project consent before third-party disclosure
- sanitized agent environment
- staging workspace, explicit apply, restore points and revert
- MCP tools limited to project, platform, build, test, package and validate
- Studio works with no provider installed

Dependency chain:

- F-M01 STUDIO FOUNDATION (adapter foundation) → F-M02 PROJECTS (sessions, first provider) → F-M03 BUILD & ARTIFACT (MCP server, second provider)
- DB-M02 CORE DATA → B-M03 PLATFORM (provider metadata) → B-M01 CONTROL PLANE (policy) → Studio policy enforcement
- P1 STUDIO and P2 BUILD & ARTIFACT use the default local policy until the P3 CONTROL PLANE policy is available.

## 33. Critical Path

The primary critical path is:

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

At milestone level, the critical path is approximately:

    F-M01 STUDIO FOUNDATION
         |
         v
    F-M02 PROJECTS
         |
         v
    F-M03 BUILD & ARTIFACT
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
    B-M04 BOOKING
         |
         v
    B-M05 EXECUTION
         |
         v
    B-M06 RESULTS
         |
         v
    B-M07 PRODUCTION

Supporting database and cloud milestones must complete their required portions before the corresponding integration gates.

## 34. Critical Path Dependencies

The highest-impact dependencies are:

| ID | Dependency | Impact |
|---|---|---|
| DEP-01 | F-M01 STUDIO FOUNDATION → F-M02 PROJECTS | Blocks local workflow |
| DEP-02 | F-M02 PROJECTS → F-M03 BUILD & ARTIFACT | Blocks artifact generation |
| DEP-03 | F-M03 BUILD & ARTIFACT → B-M02 ARTIFACT | Blocks remote artifact registration |
| DEP-04 | DB-M02 CORE DATA → B-M03 PLATFORM | Blocks platform authority |
| DEP-05 | B-M03 PLATFORM → B-M04 BOOKING | Blocks booking |
| DEP-06 | DB-M03 BOOKING DATA → B-M04 BOOKING | Blocks authoritative booking |
| DEP-07 | B-M04 BOOKING → B-M05 EXECUTION | Blocks remote execution |
| DEP-08 | DB-M04 EXECUTION DATA → B-M05 EXECUTION | Blocks durable execution |
| DEP-09 | B-M05 EXECUTION → B-M06 RESULTS | Blocks durable results |
| DEP-10 | P6 LAB & ROBOT → P7 LIVE & RESULTS | Blocks physical/live integration |
| DEP-11 | B-M07 PRODUCTION → P8 PRODUCTION | Blocks backend production |
| DEP-12 | C-M04 PRODUCTION → P8 PRODUCTION | Blocks production infrastructure |

## 35. Parallelization Opportunities

The following work may proceed in parallel where contracts are stable:

- F-M01 STUDIO FOUNDATION and DB-M01 FOUNDATION.
- DB-M01 FOUNDATION and C-M01 FOUNDATION.
- F-M02 PROJECTS and DB-M01 FOUNDATION.
- F-M03 BUILD & ARTIFACT and B-M02 ARTIFACT.
- B-M01 CONTROL PLANE and B-M03 PLATFORM after shared interfaces are defined.
- B-M02 ARTIFACT and B-M03 PLATFORM.
- F-M04 BOOKING and B-M04 BOOKING.
- DB-M03 BOOKING DATA and B-M04 BOOKING.
- B-M05 EXECUTION and F-M05 EXECUTION.
- C-M03 STAGING and P5 EXECUTION implementation.
- B-M06 RESULTS and F-M06 LIVE/F-M07 RESULTS after execution contracts stabilize.
- B-M07 PRODUCTION and C-M04 PRODUCTION after integrated behavior is known.

Parallelization must not bypass hard dependencies.

## 36. Dependency Verification

A dependency is considered satisfied only when the consuming team verifies it.

Verification may include:

- contract test
- API integration test
- database integration test
- schema validation
- end-to-end test
- security test
- deployment test
- performance test
- safety review
- operational validation

A producer declaring a dependency complete is not sufficient.

## 37. Dependency Failure Handling

When a dependency fails:

1. Mark the dependency as blocked.
2. Identify affected milestones.
3. Identify affected phases.
4. Identify critical-path impact.
5. Assign an owner.
6. Define workaround if safe.
7. Estimate schedule impact.
8. Record risk.
9. Escalate if critical.
10. Revalidate downstream work after resolution.

Workarounds must not weaken:

- security
- tenant isolation
- source privacy
- financial integrity
- artifact security
- physical safety

## 38. Contract Dependencies

The most important contract dependencies are:

- authentication
- authorization
- organization
- project
- platform
- artifact manifest
- artifact registry
- booking
- credits
- Job
- Run
- Lab Protocol
- events
- WebSocket
- Results
- rerun

A contract change requires:

- impact analysis
- producer review
- consumer review
- versioning assessment
- compatibility assessment
- test updates
- documentation updates

## 39. Database Dependency Rules

Database dependencies require:

- migration-backed changes
- transaction boundaries
- referential integrity
- tenant ownership
- concurrency controls
- indexes
- state transition integrity

Critical database dependencies include:

- DB-M01 FOUNDATION → DB-M02 CORE DATA
- DB-M02 CORE DATA → DB-M03 BOOKING DATA
- DB-M03 BOOKING DATA → DB-M04 EXECUTION DATA

Database schema changes must not silently break downstream services.

## 40. Cloud Dependency Rules

Cloud dependencies must remain provider-neutral.

Critical sequence:

    C-M01 FOUNDATION
          |
          v
    C-M02 DEVELOPMENT
          |
          v
    C-M03 STAGING
          |
          v
    C-M04 PRODUCTION

Cloud readiness includes:

- network
- IAM
- secrets
- KMS
- PostgreSQL
- object storage
- queue
- compute
- observability
- backup
- recovery

Cloud failure must not become Robot safety authority.

## 41. Security Dependency Rules

Security dependencies are mandatory across all phases.

Required relationships include:

- authentication → authorization
- authorization → tenant isolation
- artifact security → execution
- secrets → services
- key management → signing
- audit → privileged operations
- tenant isolation → all tenant-owned data
- Lab identity → Lab connectivity

Security blockers must be escalated immediately.

## 42. Financial Dependency Rules

Financial dependencies include:

    Platform
       |
       v
    Credit Type
       |
       v
    Rate Card
       |
       v
    Wallet
       |
       v
    Reservation
       |
       v
    Booking
       |
       v
    Consumption
       |
       v
    Refund / Invoice

Financial state must remain strongly consistent.

Credit reservations and ledger operations must be idempotent.

Historical financial records must not be silently rewritten.

## 43. Safety Dependency Rules

Physical Robot execution requires:

- P5 EXECUTION readiness
- P6 LAB & ROBOT integration
- Lab Agent identity
- runtime integration
- Robot state
- safety monitoring
- emergency stop
- disconnect handling
- human safety review

No cloud dependency may supersede local safety authority.

## 44. Integration Gate Dependencies

| Gate | Required dependencies |
|---|---|
| G0 | P0 FOUNDATION |
| G1 | P1 STUDIO |
| G2 | P2 BUILD & ARTIFACT |
| G3 | P3 CONTROL PLANE |
| G4 | P4 BOOKING & COMMERCIAL |
| G5 | P5 EXECUTION |
| G6 | P6 LAB & ROBOT |
| G7 | P7 LIVE & RESULTS |
| G8 | P8 PRODUCTION |

A gate is passed only when required dependencies are verified.

## 45. Dependency Ownership

Every dependency should have an accountable owner.

Recommended ownership:

| Dependency domain | Primary owner |
|---|---|
| Studio | Frontend |
| API | Backend |
| Database | Database |
| Cloud | Cloud |
| Artifact | Backend + Frontend |
| Booking | Backend + Database |
| Credits | Backend + Database |
| Execution | Backend |
| Lab | Backend + Runtime/Lab |
| Robot safety | Lab/Robot owner |
| Live | Frontend + Backend |
| Results | Backend + Frontend |
| Security | Security owner |
| Release | Release owner |

Cross-domain dependencies require joint ownership where no single domain can independently satisfy the dependency.

## 46. Dependency Status Lifecycle

Dependencies should follow:

    IDENTIFIED
        |
        v
    CLASSIFIED
        |
        v
    ASSESSED
        |
        v
    PLANNED
        |
        v
    WAITING
        |
        v
    AVAILABLE
        |
        v
    VALIDATED
        |
        v
    SATISFIED

Exception states include:

- AT_RISK
- BLOCKED
- FAILED
- DEFERRED
- SUPERSEDED

Status is maintained in:

    docs/tracking/DEPENDENCY_TRACKING.md

## 47. Dependency Acceptance Checklist

- [ ] Dependency has a unique identifier.
- [ ] Producer is identified.
- [ ] Consumer is identified.
- [ ] Dependency type is classified.
- [ ] Required interface is identified.
- [ ] Required completion evidence is defined.
- [ ] Owner is assigned.
- [ ] Critical-path impact is known.
- [ ] Security impact is known.
- [ ] Safety impact is known where applicable.
- [ ] Financial impact is known where applicable.
- [ ] Dependency status is tracked.
- [ ] Consumer verification is complete before satisfaction.
- [ ] Downstream integration tests pass.
- [ ] Documentation is updated.

## 48. Program-Level Dependency Acceptance

- [ ] P0 FOUNDATION dependencies are satisfied.
- [ ] P1 STUDIO dependencies are satisfied.
- [ ] P2 BUILD & ARTIFACT dependencies are satisfied.
- [ ] P3 CONTROL PLANE dependencies are satisfied.
- [ ] P4 BOOKING & COMMERCIAL dependencies are satisfied.
- [ ] P5 EXECUTION dependencies are satisfied.
- [ ] P6 LAB & ROBOT dependencies are satisfied.
- [ ] P7 LIVE & RESULTS dependencies are satisfied.
- [ ] P8 PRODUCTION dependencies are satisfied.
- [ ] Frontend milestone dependencies are tracked.
- [ ] Backend milestone dependencies are tracked.
- [ ] Database milestone dependencies are tracked.
- [ ] Cloud milestone dependencies are tracked.
- [ ] Critical path is continuously monitored.
- [ ] Integration points have owners.
- [ ] Security dependencies are verified.
- [ ] Financial dependencies are verified.
- [ ] Safety dependencies are verified.
- [ ] Production dependencies are verified.

## 49. Final Dependency Invariants

1. `planning/PHASES.md` is the canonical phase definition.
2. This document defines dependency relationships without redefining phase scope.
3. Milestone dossiers under `docs/**/milestones/` are authoritative for milestone scope.
4. Frozen phase IDs remain stable.
5. Frozen milestone IDs remain stable.
6. Hard dependencies block acceptance until satisfied.
7. Soft dependencies may use controlled substitutes.
8. Contract dependencies require verification.
9. Database dependencies require migration and integrity validation.
10. Security dependencies cannot be silently bypassed.
11. Financial dependencies cannot be silently bypassed.
12. Physical safety dependencies cannot be silently bypassed.
13. Critical-path dependencies are continuously monitored.
14. Dependency completion requires consumer verification.
15. Cross-domain dependencies have accountable ownership.
16. Queue availability does not replace durable business-state dependencies.
17. Live transport availability does not replace durable state.
18. Cloud availability does not replace local Robot safety.
19. Dependency status is evidence-based.
20. Dependency changes require controlled review.

## 50. Changelog

### Current Baseline

- Aligned the dependency map with `planning/PHASES.md`.
- Established the frozen phase dependency graph.
- Established frontend milestone dependencies.
- Established backend milestone dependencies.
- Established database milestone dependencies.
- Established cloud milestone dependencies.
- Established cross-domain integration points.
- Established the critical path.
- Established dependency verification rules.
- Established dependency ownership.
- Established security, financial, and safety dependency rules.
- Removed retired phase and milestone terminology.

### Future Changes

Future changes must record:

- Date.
- Change request identifier.
- Dependency identifier.
- Producer.
- Consumer.
- Dependency type.
- Previous relationship.
- New relationship.
- Critical-path impact.
- Resource impact.
- Risk impact.
- Approval.
- Effective date.
