# Kritva RaaS Release Roadmap

## 1. Purpose

This document defines the Kritva RaaS release lifecycle, release sequencing, versioning, qualification, rollout, rollback, compatibility, evidence, and operational release controls.

The canonical definition of phases, phase numbers, phase names, phase boundaries, and phase relationships is maintained in:

    planning/PHASES.md

This document does not redefine the phases. It aligns release planning to the canonical phase model and maps releases to the implementation milestones that deliver them.

The detailed scope of each milestone is authoritative in the existing milestone dossiers under:

    docs/**/milestones/

This document defines how implementation work becomes a qualified release.

It covers:

- release families
- release versioning
- release scope
- release sequencing
- phase and milestone alignment
- release readiness
- compatibility
- qualification
- release candidates
- rollout
- rollback
- artifact management
- database migration handling
- protocol compatibility
- Studio compatibility
- Lab Agent compatibility
- Robot rollout controls
- security gates
- operational readiness
- release evidence
- post-release monitoring
- deprecation
- retirement

## 2. Canonical References

| Document | Authority |
|---|---|
| `planning/PHASES.md` | Canonical phase definition |
| `planning/IMPLEMENTATION_ROADMAP.md` | Implementation sequencing and dependencies |
| `planning/DECISIONS.md` | Approved program decisions |
| `docs/**/milestones/` | Authoritative milestone scope |
| `docs/tracking/STATUS.md` | Program implementation status |
| `docs/tracking/MILESTONE_STATUS.md` | Milestone implementation status |
| `docs/tracking/RISK_REGISTER.md` | Program risk status |
| `docs/tracking/DEPENDENCY_TRACKING.md` | Dependency status |
| `docs/security/SECURITY_REQUIREMENTS.md` | Security release requirements |

If a release document conflicts with `planning/PHASES.md`, the phase definition takes precedence.

If this document conflicts with an authoritative milestone dossier regarding milestone scope, the milestone dossier takes precedence.

Release scope must not silently change milestone scope.

## 3. Release Principles

Kritva RaaS releases must follow these principles:

1. Release versions identify tested software states.
2. A release must have reproducible source and build provenance.
3. Release scope must map to accepted milestone work.
4. Security requirements are release gates.
5. Physical safety requirements are release gates for Robot-related releases.
6. Database migrations must be version controlled.
7. Protocol compatibility must be explicit.
8. Artifact format compatibility must be explicit.
9. Studio and backend compatibility must be verified.
10. Lab Agent and runtime compatibility must be verified before applicable execution releases.
11. Production rollout must be controlled.
12. Rollback must be planned before production release.
13. Artifact revocation must be available for security incidents.
14. Release evidence must be retained.
15. Production readiness is evidence-based.
16. Documentation completion does not constitute release readiness.
17. A release must not bypass required phase or milestone acceptance.
18. Cloud availability must not become physical Robot safety authority.

## 4. Release Lifecycle

The release lifecycle is:

    PLAN
      |
      v
    DEVELOP
      |
      v
    INTEGRATE
      |
      v
    INTERNAL ALPHA
      |
      v
    CONTROLLED BETA
      |
      v
    RELEASE CANDIDATE
      |
      v
    GENERAL AVAILABILITY
      |
      v
    OPERATE
      |
      v
    MAINTENANCE
      |
      v
    DEPRECATE
      |
      v
    RETIRE

Not every engineering release must pass through every public lifecycle state.

Internal development builds may remain internal.

Production releases must pass the applicable qualification and approval gates.

## 5. Release Families

The release roadmap is organized around the frozen phase model.

| Release family | Primary phase alignment | Purpose |
|---|---|---|
| R0.x | P0 FOUNDATION through P3 CONTROL PLANE | Engineering and integrated platform foundation |
| R1.x | P4 BOOKING & COMMERCIAL through P7 LIVE & RESULTS | Integrated RaaS product capability |
| R2.x | P8 PRODUCTION and subsequent expansion | Production maturity and controlled product expansion |

The release family is a product-level grouping and does not replace the phase model.

Release versions must remain independently traceable to the phases and milestone IDs that produced them.

## 6. Release Versioning

Kritva RaaS uses Semantic Versioning:

    MAJOR.MINOR.PATCH

Examples:

    0.1.0
    0.2.0
    1.0.0
    1.1.0
    2.0.0

Pre-release identifiers may be used:

    0.3.0-alpha.1
    0.3.0-beta.1
    1.0.0-rc.1

Version meaning:

| Component | Meaning |
|---|---|
| MAJOR | Incompatible public contract or product change |
| MINOR | Backward-compatible capability |
| PATCH | Backward-compatible correction |

Versioning applies to the product release.

The following must be versioned independently:

- protocol version
- artifact format version
- database migration level
- API version
- Lab Protocol version
- Studio compatibility version
- runtime compatibility version

These version numbers must not be conflated with product release versions.

## 7. Release Naming and Traceability

Every release must have:

- release version
- source commit
- release branch or release tag
- milestone scope
- phase mapping
- build identifier
- artifact identifiers
- database migration range
- protocol compatibility range
- test evidence
- security evidence
- approval evidence
- deployment evidence

The minimum traceability chain is:

    Release Version
         |
         v
    Git Tag
         |
         v
    Source Commit
         |
         v
    Build
         |
         v
    Tested Artifacts
         |
         v
    Database Migration Set
         |
         v
    Protocol Compatibility
         |
         v
    Release Evidence

## 8. Release Alignment to P0 FOUNDATION

P0 FOUNDATION provides the engineering foundation for release management.

Release work includes:

- Git tagging conventions.
- CI release checks.
- build reproducibility.
- dependency locking.
- security scanning.
- artifact provenance.
- release documentation.
- release evidence storage.
- versioning conventions.
- rollback planning.

Relevant milestone:

- C-M01 FOUNDATION.
- DB-M01 FOUNDATION.
- F-M01 STUDIO FOUNDATION.

P0 FOUNDATION does not by itself imply a production release.

It establishes the controls required to produce reliable engineering releases.

## 9. Release Alignment to P1 STUDIO

P1 STUDIO enables the first usable Studio product workflow.

Relevant milestones:

- F-M01 STUDIO FOUNDATION.
- F-M02 PROJECTS.
- DB-M01 FOUNDATION.
- C-M02 DEVELOPMENT.

Release qualification includes:

- Studio startup.
- Authentication.
- Organization context.
- Project creation.
- Project selection.
- Local workspace behavior.
- Source privacy.
- API and IPC compatibility.
- Supported development-platform builds.

Studio releases must preserve the local-source boundary.

## 10. Release Alignment to P2 BUILD & ARTIFACT

P2 BUILD & ARTIFACT establishes the artifact boundary required for remote execution.

Relevant milestones:

- F-M03 BUILD & ARTIFACT.
- B-M02 ARTIFACT.
- DB-M01 FOUNDATION.
- DB-M02 CORE DATA.
- C-M02 DEVELOPMENT.

Release qualification includes:

- local build
- local tests
- artifact packaging
- manifest validation
- checksum validation
- signature validation
- source-privacy scanning
- artifact security scanning
- compatibility validation
- artifact upload
- artifact registry integrity

No release intended for remote execution may bypass artifact validation.

## 11. Release Alignment to P3 CONTROL PLANE

P3 CONTROL PLANE establishes authoritative product services.

Relevant milestones:

- B-M01 CONTROL PLANE.
- B-M02 ARTIFACT.
- B-M03 PLATFORM.
- DB-M01 FOUNDATION.
- DB-M02 CORE DATA.
- C-M02 DEVELOPMENT.

Release qualification includes:

- authentication
- authorization
- organization isolation
- project services
- platform catalog
- artifact services
- API contracts
- WebSocket infrastructure
- audit
- idempotency
- database transactions

Security and tenant isolation are release blockers.

## 12. Release Alignment to P4 BOOKING & COMMERCIAL

P4 BOOKING & COMMERCIAL introduces authoritative booking and commercial behavior.

Relevant milestones:

- F-M04 BOOKING.
- B-M04 BOOKING.
- DB-M03 BOOKING DATA.
- C-M03 STAGING.

Release qualification includes:

- availability
- booking lifecycle
- resource allocation
- conflict prevention
- credit reservation
- credit consumption
- refund
- invoice
- payment integration
- reconciliation
- audit

Financial integrity is a release blocker.

A release must not be promoted if booking state and credit state can diverge in an unrecoverable manner.

## 13. Release Alignment to P5 EXECUTION

P5 EXECUTION establishes remote execution.

Relevant milestones:

- F-M05 EXECUTION.
- B-M05 EXECUTION.
- DB-M04 EXECUTION DATA.
- C-M03 STAGING.

Release qualification includes:

- Job lifecycle
- Run lifecycle
- execution eligibility
- artifact validation
- booking validation
- worker behavior
- queue behavior
- deployment
- start
- stop
- timeout
- failure
- cleanup
- recovery

The first execution release should use simulated execution before physical Robot rollout.

## 14. Release Alignment to P6 LAB & ROBOT

P6 LAB & ROBOT introduces controlled Lab and Robot integration.

Relevant milestones:

- B-M06 RESULTS.
- DB-M04 EXECUTION DATA.
- C-M03 STAGING.

Release qualification includes:

- Lab Agent identity
- secure Lab connectivity
- heartbeat
- resource state
- Robot state
- artifact validation
- deployment
- runtime integration
- disconnect behavior
- reconnect behavior
- safety-state reporting

Physical Robot release requires explicit safety qualification.

A cloud-side release must never be allowed to override local Robot safety authority.

## 15. Release Alignment to P7 LIVE & RESULTS

P7 LIVE & RESULTS establishes live observation and durable result workflows.

Relevant milestones:

- F-M06 LIVE.
- F-M07 RESULTS.
- B-M06 RESULTS.
- DB-M04 EXECUTION DATA.
- C-M03 STAGING.

Release qualification includes:

- live Job and Run state
- WebSocket events
- WebRTC video
- telemetry
- logs
- Robot and Lab status
- reconnect
- Results
- Result Files
- metrics
- Experiments
- Comparisons
- Downloads
- rerun

Live transport failure must not corrupt durable execution state.

## 16. Release Alignment to P8 PRODUCTION

P8 PRODUCTION establishes production readiness.

Relevant milestones:

- B-M07 PRODUCTION.
- C-M04 PRODUCTION.

Release qualification includes:

- production security
- tenant isolation
- database reliability
- object storage security
- queue reliability
- observability
- backup
- restore
- disaster recovery
- capacity
- incident response
- vulnerability management
- release rollback
- operational readiness

A production release requires evidence across all applicable preceding phases.

## 17. Release Readiness Levels

Release readiness is divided into:

| Level | Meaning |
|---|---|
| Engineering Build | Developer or CI build |
| Internal Alpha | Controlled internal integration |
| Controlled Beta | Controlled external or designated-user testing |
| Release Candidate | Candidate for production approval |
| General Availability | Approved production release |

The readiness level must be recorded with the release.

## 18. Engineering Build

An Engineering Build may be generated continuously.

Minimum requirements:

- source builds
- unit tests pass
- lint and type checks pass where applicable
- dependency resolution succeeds
- basic security scanning passes
- build metadata is recorded

Engineering Builds are not production releases.

## 19. Internal Alpha

Internal Alpha requires:

- milestone implementation substantially complete
- integration tests
- security checks
- database migration validation
- contract validation
- basic end-to-end workflow
- known issue review
- rollback approach

Internal Alpha may use development or staging infrastructure.

## 20. Controlled Beta

Controlled Beta requires:

- milestone acceptance
- end-to-end validation
- representative workload
- user workflow validation
- security review
- operational monitoring
- known-risk acceptance
- rollback validation

Where physical Robot operation is included, the applicable safety review is mandatory.

## 21. Release Candidate

A Release Candidate must be functionally frozen except for release-blocking corrections.

Required:

- complete release test suite
- security qualification
- migration qualification
- protocol compatibility verification
- artifact verification
- deployment verification
- rollback verification
- monitoring verification
- release evidence
- approval

Any material change after Release Candidate creation requires requalification.

## 22. General Availability

General Availability requires:

- approved Release Candidate
- production infrastructure readiness
- production database readiness
- production secrets and keys
- observability
- incident response
- backup and recovery
- support readiness
- rollback readiness
- operational ownership
- final approval

General Availability does not automatically authorize every physical Robot configuration.

Robot rollout remains subject to applicable safety and operational qualification.

## 23. Qualification Matrix

| Qualification | P0 | P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 |
|---|---|---|---|---|---|---|---|---|---|
| Build | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Unit tests | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Integration tests | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Security | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Database | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Artifact | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Booking | — | — | — | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Execution | — | — | — | — | — | ✓ | ✓ | ✓ | ✓ |
| Lab/Robot | — | — | — | — | — | — | ✓ | ✓ | ✓ |
| Live/Results | — | — | — | — | — | — | ✓ | ✓ | ✓ |
| Production | — | — | — | — | — | — | — | — | ✓ |

## 24. Release Branching

The default release workflow is:

    main
      |
      v
    release/<version>
      |
      +--> qualification
      |
      +--> release corrections
      |
      v
    tag
      |
      v
    deployment

Release branches must remain short-lived.

Release branches must not become a substitute for normal development branches.

Hotfixes should be based on the affected production release tag and merged back into the appropriate active development line.

## 25. Release Freeze

Release freeze begins when the release enters Release Candidate qualification.

During freeze:

- no unrelated feature changes
- no uncontrolled dependency upgrades
- no schema changes without explicit approval
- no protocol changes without compatibility review
- no artifact format changes
- no security control removal

Release-blocking fixes are permitted.

Every release-blocking fix must be re-tested.

## 26. Database Release Strategy

Database changes must be migration-backed.

The release process must identify:

- current migration level
- new migration level
- migration ordering
- backward compatibility
- rollback strategy
- data migration
- expected duration
- lock impact
- validation

Preferred migration approach:

    Expand
      |
      v
    Deploy Compatible Code
      |
      v
    Backfill
      |
      v
    Validate
      |
      v
    Contract

Destructive migrations must not be introduced without explicit review.

Database rollback must distinguish schema rollback from application rollback.

## 27. Protocol Compatibility

Protocol versions must be independently tracked.

Compatibility must be defined for:

- Studio ↔ Control Plane
- Control Plane ↔ Lab Agent
- Lab Agent ↔ Runtime
- WebSocket clients
- artifact manifest
- artifact format
- API contracts

A release must not silently introduce an incompatible protocol change.

Backward compatibility should be preferred where practical.

Breaking protocol changes require:

- version increment
- migration plan
- compatibility matrix
- rollout sequence
- rollback strategy
- client qualification

## 28. Artifact Release Strategy

Every release producing executable artifacts must record:

- artifact ID
- artifact version
- product release
- platform
- platform version
- architecture
- runtime
- SDK
- checksum
- signature
- signing key identifier
- build provenance
- compatibility
- lifecycle state

Production artifacts must be immutable after publication.

If an artifact is compromised:

1. revoke the artifact
2. block execution
3. preserve evidence
4. identify affected releases
5. issue corrected artifact
6. deploy corrected release
7. review incident

## 29. Studio Release Compatibility

Studio compatibility must identify:

- minimum backend API version
- supported protocol versions
- artifact format support
- runtime integration version
- supported host platforms
- authentication requirements

Studio updates must not unexpectedly invalidate existing local projects.

Backward-compatible project metadata changes are preferred.

## 30. Lab Agent and Runtime Compatibility

Applicable releases must identify:

- Lab Agent version
- Runtime version
- supported protocol version
- artifact format
- platform version
- Robot configuration
- required capabilities

Before production Lab rollout:

- Lab Agent must authenticate.
- Runtime must validate the artifact.
- Platform compatibility must pass.
- Robot configuration must pass.
- Safety state must be valid.
- Rollback/recovery behavior must be tested.

## 31. Rollout Strategy

The default production rollout sequence is:

    Internal
       |
       v
    Canary
       |
       v
    Pilot
       |
       v
    Limited GA
       |
       v
    Full GA

Each stage must have:

- entry criteria
- monitoring
- success criteria
- rollback criteria
- approval authority

The rollout may stop or revert when defined thresholds are exceeded.

## 32. Application Rollout

Application rollout should use:

- immutable build artifacts
- controlled deployment
- health checks
- readiness checks
- version reporting
- migration status
- automated rollback where safe
- manual approval where required

Stateless application instances should support controlled replacement.

## 33. Database Rollout

Database rollout must precede application behavior that depends on new schema elements when compatibility requires it.

Migration failures must stop progression.

Long-running migrations require explicit operational review.

Production migrations must be monitored for:

- duration
- lock contention
- CPU
- memory
- I/O
- query latency
- replication health

## 34. Robot Rollout

Physical Robot rollout must follow:

    Simulation
       |
       v
    Controlled Lab
       |
       v
    Test Robot
       |
       v
    Controlled Robot Pool
       |
       v
    Production Robot Pool

Every transition requires:

- safety qualification
- operational qualification
- monitoring
- rollback or safe-stop procedure
- approved operator ownership

A cloud outage must not create an unsafe Robot state.

## 35. Feature Flags

Feature flags may be used for:

- incomplete product capabilities
- controlled beta features
- staged rollout
- risky infrastructure changes
- experimental capabilities

Feature flags must have:

- owner
- purpose
- default state
- environment scope
- rollout scope
- removal plan

Security controls must not depend on a remotely changeable feature flag unless the failure mode is explicitly safe.

## 36. Rollback Strategy

Rollback planning is mandatory before production deployment.

Rollback may involve:

- application rollback
- configuration rollback
- feature-flag rollback
- artifact revocation
- worker rollback
- Lab Agent rollback
- Studio rollback
- database compatibility rollback
- infrastructure rollback

Database rollback must not be assumed to mean reverse migration.

If reverse migration is unsafe, the release must use a forward-compatible correction.

## 37. Emergency Release

Emergency releases may bypass normal schedule sequencing only when necessary to address:

- critical security vulnerability
- data integrity failure
- financial integrity failure
- severe production outage
- physical safety issue

Emergency releases still require:

- incident record
- scope
- approval
- testing appropriate to urgency
- deployment evidence
- post-release review

Physical safety issues receive highest priority.

## 38. Security Release Gates

A release must not proceed when any applicable critical security requirement is unresolved.

Security gates include:

- authentication
- authorization
- tenant isolation
- secret management
- key management
- artifact signing
- artifact validation
- source privacy
- dependency scanning
- vulnerability scanning
- audit logging
- secure storage
- network controls

Critical findings require explicit risk acceptance or correction before release.

## 39. Safety Release Gates

Applicable Robot releases require:

- safety review
- emergency stop validation
- local safety authority
- runtime safety checks
- Lab Agent safety behavior
- disconnect behavior
- safe recovery behavior
- operator procedures

Software Stop must remain distinct from emergency stop.

The cloud cannot replace local emergency stop or hardware safety mechanisms.

## 40. Release Observability

Every production release must expose sufficient information to determine:

- deployed version
- build identifier
- source commit
- environment
- database migration level
- protocol version
- artifact version
- Lab Agent version where applicable
- runtime version where applicable

Monitoring must cover:

- API health
- database health
- queue health
- worker health
- WebSocket health
- video/session health
- Lab Agent connectivity
- Robot state where applicable
- error rate
- latency
- resource utilization

## 41. Release Success Metrics

Typical release metrics include:

| Metric | Purpose |
|---|---|
| Deployment success rate | Deployment reliability |
| Rollback rate | Release quality |
| API error rate | Product health |
| API latency | Performance |
| Job failure rate | Execution health |
| Run failure rate | Runtime health |
| Artifact rejection rate | Build/package health |
| Booking failure rate | Commercial health |
| Credit reconciliation failures | Financial integrity |
| Lab disconnect rate | Lab reliability |
| Result generation failure rate | Results reliability |
| Security findings | Security posture |
| Incident count | Operational quality |

Thresholds must be established for each production release where appropriate.

## 42. Release Evidence

Release evidence should include:

- release checklist
- test results
- integration results
- security results
- database migration results
- performance results
- artifact checksums
- artifact signatures
- deployment logs
- configuration version
- approval records
- rollback validation
- monitoring validation
- incident references if applicable

Evidence must be retained according to applicable operational and security retention policies.

## 43. Release Approval

Release approval must consider:

1. Scope completeness.
2. Milestone acceptance.
3. Test results.
4. Security.
5. Database.
6. Protocol compatibility.
7. Artifact integrity.
8. Operational readiness.
9. Safety where applicable.
10. Rollback readiness.
11. Known risks.
12. Open incidents.
13. Monitoring readiness.

The release owner must record the approval decision.

## 44. Release Blockers

Typical blockers include:

- failing critical tests
- unresolved tenant isolation issue
- critical security vulnerability
- invalid artifact signature
- database migration failure
- financial reconciliation failure
- booking conflict
- execution integrity failure
- unsafe Robot behavior
- missing backup validation
- missing rollback
- incompatible protocol
- insufficient monitoring
- unresolved critical incident

A blocker may be overridden only through explicit documented risk acceptance by the appropriate authority.

## 45. Release Readiness Checklist

Before Release Candidate:

- [ ] Scope mapped to milestones.
- [ ] Required milestone acceptance complete.
- [ ] Tests pass.
- [ ] Security checks pass.
- [ ] Database migrations validated.
- [ ] Protocol compatibility validated.
- [ ] Artifact compatibility validated.
- [ ] Deployment tested.
- [ ] Rollback tested.
- [ ] Monitoring configured.
- [ ] Known issues reviewed.

Before General Availability:

- [ ] Release Candidate approved.
- [ ] Production infrastructure ready.
- [ ] Production secrets ready.
- [ ] Production database ready.
- [ ] Backup verified.
- [ ] Recovery verified.
- [ ] Incident procedures ready.
- [ ] Operational ownership assigned.
- [ ] Support readiness verified.
- [ ] Safety approval complete where applicable.
- [ ] Final release approval recorded.

## 46. Post-Release Monitoring

Immediately after production rollout, monitor:

- deployment health
- API errors
- latency
- database performance
- queue depth
- worker failures
- booking failures
- credit failures
- Job failures
- Run failures
- Lab connectivity
- Robot state
- video health
- result generation
- security alerts

The monitoring period must be defined for each release.

## 47. Post-Release Review

A release review should examine:

- deployment outcome
- incidents
- rollbacks
- performance
- user impact
- security findings
- reliability
- financial reconciliation
- Lab behavior
- Robot behavior
- documentation gaps
- follow-up tasks

Material findings must enter the appropriate tracking system.

## 48. Deprecation

A deprecated release or interface must have:

- deprecation date
- supported replacement
- migration instructions
- compatibility period
- owner
- communication plan
- retirement date

Deprecation must not silently break active customers or physical Robot operations.

## 49. Retirement

Retirement requires:

- usage assessment
- dependency assessment
- migration completion
- artifact handling
- database handling
- protocol handling
- operational notification
- security review
- final shutdown
- evidence retention

Retired artifacts must not remain executable where security policy requires revocation.

## 50. Release Compatibility Matrix

The release process should maintain a compatibility matrix covering:

| Component | Required compatibility |
|---|---|
| Studio | Control Plane API and protocol |
| Control Plane | Database migration level |
| Control Plane | Artifact registry |
| Control Plane | Booking and credit services |
| Execution | Artifact format |
| Execution | Platform version |
| Lab Agent | Lab Protocol |
| Lab Agent | Runtime |
| Runtime | Artifact |
| Runtime | Robot configuration |
| Results | Run and telemetry schema |
| Production | Cloud infrastructure |

Compatibility must be tested before production rollout.

## 51. Release Planning by Phase

| Phase | Release objective |
|---|---|
| P0 FOUNDATION | Establish release engineering controls |
| P1 STUDIO | Qualify Studio and project workflows |
| P2 BUILD & ARTIFACT | Qualify trusted artifact generation |
| P3 CONTROL PLANE | Qualify authoritative backend services |
| P4 BOOKING & COMMERCIAL | Qualify booking and financial workflows |
| P5 EXECUTION | Qualify remote execution |
| P6 LAB & ROBOT | Qualify controlled Robot integration |
| P7 LIVE & RESULTS | Qualify live observation and results |
| P8 PRODUCTION | Qualify production operation |

This table references the canonical phase definitions in `planning/PHASES.md`; it does not redefine them.

## 52. Release Planning by Milestone

| Domain | Milestone | Release contribution |
|---|---|---|
| Frontend | F-M01 STUDIO FOUNDATION | Studio release foundation |
| Frontend | F-M02 PROJECTS | Project workflow |
| Frontend | F-M03 BUILD & ARTIFACT | Local build and artifact workflow |
| Frontend | F-M04 BOOKING | Booking workflow |
| Frontend | F-M05 EXECUTION | Execution workflow |
| Frontend | F-M06 LIVE | Live observation |
| Frontend | F-M07 RESULTS | Results workflow |
| Backend | B-M01 CONTROL PLANE | Control Plane |
| Backend | B-M02 ARTIFACT | Artifact registry and validation |
| Backend | B-M03 PLATFORM | Platform services |
| Backend | B-M04 BOOKING | Booking and commercial services |
| Backend | B-M05 EXECUTION | Execution orchestration |
| Backend | B-M06 RESULTS | Results and live-support services |
| Backend | B-M07 PRODUCTION | Production hardening |
| Database | DB-M01 FOUNDATION | Database foundation |
| Database | DB-M02 CORE DATA | Core platform and artifact data |
| Database | DB-M03 BOOKING DATA | Booking and financial data |
| Database | DB-M04 EXECUTION DATA | Execution and results data |
| Cloud | C-M01 FOUNDATION | Cloud foundation |
| Cloud | C-M02 DEVELOPMENT | Development environment |
| Cloud | C-M03 STAGING | Staging environment |
| Cloud | C-M04 PRODUCTION | Production environment |

The milestone dossiers remain authoritative for detailed scope.

## 53. Release Governance

Release governance must maintain:

- release owner
- release scope
- release version
- phase mapping
- milestone mapping
- dependency status
- risk status
- security status
- test status
- deployment status
- rollback status
- approval status

No release should be considered approved solely because a version tag exists.

## 54. Final Release Invariants

1. `planning/PHASES.md` is the canonical phase definition.
2. This document defines release sequencing and controls.
3. Milestone dossiers define milestone scope.
4. Release versions remain traceable to source commits.
5. Release artifacts remain traceable to builds.
6. Database migrations remain traceable to releases.
7. Protocol compatibility remains explicit.
8. Artifact compatibility remains explicit.
9. Security gates cannot be silently bypassed.
10. Physical safety gates cannot be silently bypassed.
11. Production rollback is planned before deployment.
12. Artifact revocation is available for security incidents.
13. Database changes are migration-backed.
14. Financial state remains strongly consistent.
15. Tenant isolation remains mandatory.
16. Job and Run remain distinct.
17. Durable state remains authoritative.
18. Live transport does not replace durable state.
19. Cloud services do not become Robot safety authority.
20. Production readiness is evidence-based.
21. Release evidence is retained.
22. Deprecated interfaces have migration paths.
23. Retired artifacts are handled according to security policy.
24. Release changes remain governed and traceable.

## 55. Changelog

### Current Baseline

- Aligned release planning with the canonical phase model in `planning/PHASES.md`.
- Aligned release planning with the frozen frontend milestone IDs.
- Aligned release planning with the frozen backend milestone IDs.
- Aligned release planning with the frozen database milestone IDs.
- Aligned release planning with the frozen cloud milestone IDs.
- Defined release sequencing by phase.
- Defined release qualification.
- Defined rollout and rollback.
- Defined database and protocol compatibility.
- Defined artifact release controls.
- Defined Lab Agent and Robot release controls.
- Defined production release governance.
- Removed retired phase and milestone terminology.

### Future Changes

Future changes must record:

- Date.
- Change request identifier.
- Release version affected.
- Phase affected.
- Milestone affected.
- Scope change.
- Compatibility impact.
- Security impact.
- Safety impact.
- Rollout impact.
- Approval.
- Effective date.
