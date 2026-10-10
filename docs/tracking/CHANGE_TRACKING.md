# Kritva RaaS Change Tracking

## 1. Purpose

This document defines the authoritative change-management and change-tracking
framework for the Kritva RaaS program.

Change tracking ensures that modifications to product scope, architecture,
contracts, schedule, security, safety, database, infrastructure, commercial
model, implementation plans, documentation, and release commitments are
deliberate, assessed, approved, implemented, verified, and traceable.

The governing flow is:

    Change Identified
          |
          v
    Change Request
          |
          v
    Classification
          |
          v
    Impact Assessment
          |
          v
    Review
          |
          v
    Approval / Rejection
          |
          v
    Implementation
          |
          v
    Verification
          |
          v
    Documentation Update
          |
          v
    Change Log
          |
          v
    Closure

The purpose is not to prevent change.

The purpose is to prevent uncontrolled change.

## 2. Scope

This framework applies to changes affecting:

- product scope;
- product requirements;
- architecture;
- protocols;
- APIs;
- database schemas;
- security boundaries;
- safety boundaries;
- source-code privacy;
- artifact format;
- Studio;
- Control Plane;
- Lab Agent;
- runtime;
- simulation;
- physical robots;
- booking;
- credits;
- commercial rules;
- cloud infrastructure;
- vendors;
- dependencies;
- schedule;
- milestones;
- phases;
- testing;
- release;
- documentation;
- operational procedures.

The framework applies from P0 FOUNDATION through P8 PRODUCTION.

## 3. Goals

The change-management process shall:

1. make material changes explicit;
2. distinguish changes from normal implementation work;
3. classify changes consistently;
4. assess impact before approval;
5. identify affected requirements;
6. identify affected architecture;
7. identify affected contracts;
8. identify affected schedule;
9. identify affected risks;
10. identify affected dependencies;
11. identify affected tasks;
12. identify affected documentation;
13. preserve historical traceability;
14. prevent silent scope expansion;
15. protect safety and security gates;
16. maintain release integrity.

## 4. Non-Goals

This document does not replace:

- task tracking;
- issue tracking;
- risk tracking;
- dependency tracking;
- decision logging;
- release management;
- code review;
- configuration management.

Change tracking coordinates these systems.

## 5. Change Definition

A change is a modification to an approved or currently baselined product,
engineering, schedule, documentation, or operational state.

Examples:

- adding a new robot platform;
- changing the artifact protocol;
- changing the tenant model;
- moving a milestone;
- changing database ownership;
- adding a required security gate;
- removing an MVP feature;
- changing a hardware target.

## 6. Change Versus Task

Normal implementation work does not necessarily require a change request.

Example:

    Approved Requirement
          |
          v
    Implement Task
          |
          v
    Test
          |
          v
    Close Task

A change request is required when the approved baseline itself changes.

## 7. Change Versus Issue

An issue records something that happened.

A change records a deliberate modification.

Example:

    Issue:
        Simulator cannot represent required sensor behavior.

    Change:
        Add HIL qualification before physical deployment.

The issue may trigger the change.

## 8. Change Versus Risk

A risk is uncertainty.

A change is an intentional modification.

Example:

    Risk:
        Robot vendor delivery may slip.

    Change:
        Move HIL milestone and add simulator coverage.

## 9. Change Versus Decision

A change may require a new decision.

Example:

    Change Request
         |
         v
    Architecture Impact
         |
         v
    ADR Required
         |
         v
    Decision
         |
         v
    Implementation

The change record shall reference the decision where applicable.

## 10. Change ID

Change IDs use:

    CR-<YEAR>-<NUMBER>

Examples:

    CR-2026-001
    CR-2026-002

IDs are immutable.

A rejected or cancelled change retains its ID.

## 11. Change Status

| Status | Meaning |
|---|---|
| PROPOSED | Change request created |
| TRIAGED | Classification and initial review completed |
| ASSESSMENT | Impact analysis in progress |
| APPROVAL_PENDING | Awaiting approval |
| APPROVED | Approved for implementation |
| REJECTED | Not approved |
| DEFERRED | Valid but intentionally postponed |
| IMPLEMENTING | Work underway |
| VERIFICATION | Implementation being validated |
| COMPLETED | Change implemented and verified |
| CANCELLED | Change withdrawn |
| SUPERSEDED | Replaced by another change |

## 12. Change Lifecycle

The standard lifecycle is:

    PROPOSED
       |
       v
    TRIAGED
       |
       v
    ASSESSMENT
       |
       v
    APPROVAL_PENDING
       |
       v
    APPROVED
       |
       v
    IMPLEMENTING
       |
       v
    VERIFICATION
       |
       v
    COMPLETED

Alternative paths:

    PROPOSED --> REJECTED
    TRIAGED --> DEFERRED
    ASSESSMENT --> DEFERRED
    APPROVED --> CANCELLED
    APPROVED --> SUPERSEDED

## 13. Change Categories

Primary categories are:

| Category | Code | Description |
|---|---|---|
| Scope | SCOPE | Product functionality or boundary |
| Architecture | ARCH | System design or component boundary |
| Contract | CONTRACT | API, protocol, schema, artifact contract |
| Schedule | SCHEDULE | Timeline, milestone or phase |
| Security | SECURITY | Security/privacy controls |
| Safety | SAFETY | Physical safety or robot operation |
| Database | DATABASE | Data model or migration |
| Infrastructure | INFRA | Cloud, deployment or runtime infrastructure |
| Commercial | COMMERCIAL | Pricing, credits, subscription |
| Regulatory | REGULATORY | Legal/compliance |
| Dependency | DEPENDENCY | External/internal prerequisite |
| Quality | QUALITY | Testing or acceptance |
| Documentation | DOC | Documentation baseline |
| Release | RELEASE | Release scope/process |

The four primary requested categories are SCOPE, ARCHITECTURE, CONTRACT and
SCHEDULE.

## 14. Change Priority

| Priority | Meaning |
|---|---|
| PRI-0 | Safety/security/production-critical or emergency |
| PRI-1 | Current milestone or release critical |
| PRI-2 | Planned product/engineering change |
| PRI-3 | Future improvement |
| PRI-4 | Informational/minor |

## 15. Change Impact

Impact is assessed independently of priority.

| Impact | Meaning |
|---|---|
| Low | Local change with minimal downstream effect |
| Medium | Multiple tasks/components affected |
| High | Phase, architecture, contract or release impact |
| Critical | Safety, security, financial, regulatory or major product impact |

## 16. Change Urgency

| Urgency | Meaning |
|---|---|
| Immediate | Must be acted on now |
| Current Cycle | Required in current milestone |
| Planned | Can be scheduled normally |
| Future | Can wait for later planning |

## 17. Change Request Source

Changes may originate from:

- product owner;
- architecture review;
- engineering;
- security review;
- safety review;
- testing;
- customer feedback;
- vendor;
- dependency failure;
- regulatory requirement;
- production incident;
- release qualification;
- risk materialization.

## 18. Change Request Table

The primary change register shall contain:

| ID | Date | Category | Title | Priority | Impact | Requestor | Owner | Status | Phase | Milestone |
|---|---|---|---|---|---|---|---|---|---|---|

Additional fields include:

- rationale;
- affected requirements;
- affected decisions;
- affected dependencies;
- affected risks;
- affected tasks;
- affected documentation;
- approval;
- implementation evidence;
- verification evidence.

## 19. Initial Change Log

The initial project baseline contains no material implementation changes beyond
the already approved planning and architecture baseline.

| ID | Date | Category | Title | Priority | Impact | Requestor | Owner | Status | Phase | Milestone |
|---|---|---|---|---|---|---|---|---|---|---|
| None | 2026-10-08 | - | No active change request declared | - | - | - | TBD | OPEN_BASELINE | 0 | Planning |

The baseline row is informational and is not a change request.

## 20. Change Request Structure

Every material change request should contain:

    Change ID
    Title
    Requestor
    Date
    Category
    Priority
    Current Baseline
    Proposed Change
    Reason
    Desired Outcome
    Alternatives
    Impact Assessment
    Risks
    Dependencies
    Schedule Impact
    Cost Impact
    Approval
    Implementation Plan
    Verification
    Documentation Updates

## 21. Current Baseline

The current baseline is the approved state against which the change is
evaluated.

Baselines may include:

- product roadmap;
- architecture;
- database architecture;
- protocol;
- security architecture;
- testing strategy;
- release process;
- milestone scope;
- phase scope;
- approved documentation.

## 22. Proposed Change

The proposed change must clearly state:

- what changes;
- what remains unchanged;
- why it changes;
- expected benefit;
- expected consequence.

Avoid vague descriptions such as:

    "Improve architecture."

Use:

    "Replace direct Lab Agent polling with event-driven heartbeat updates
    while preserving the existing Lab Protocol contract."

## 23. Rationale

Every material change requires a reason.

Typical reasons include:

- new requirement;
- defect;
- security finding;
- safety finding;
- dependency change;
- performance evidence;
- cost;
- customer requirement;
- vendor change;
- regulatory requirement;
- schedule constraint.

## 24. Alternatives

Where meaningful, record:

- do nothing;
- proposed change;
- alternative implementation;
- deferred implementation.

The selected option should have explicit rationale.

## 25. Impact Assessment

The impact assessment is mandatory for P1 and above.

Template:

    Change ID:
    Baseline:
    Proposed Change:

    Product Scope Impact:
    Architecture Impact:
    Contract Impact:
    Database Impact:
    Security Impact:
    Safety Impact:
    Cloud/Infrastructure Impact:
    Testing Impact:
    Schedule Impact:
    Resource Impact:
    Commercial Impact:
    Regulatory Impact:
    Documentation Impact:
    Release Impact:

    Risks Introduced:
    Risks Reduced:

    Dependencies Added:
    Dependencies Removed:

    Tasks Added:
    Tasks Modified:
    Tasks Cancelled:

    Estimated Effort:
    Required Reviewers:
    Required Approval:

## 26. Product Scope Impact

Assess:

- new functionality;
- removed functionality;
- changed user workflow;
- changed MVP boundary;
- changed platform support;
- changed commercial feature set.

## 27. Architecture Impact

Assess:

- components;
- boundaries;
- data ownership;
- service topology;
- runtime;
- cloud;
- lab architecture;
- physical architecture.

Architecture changes require ADR review.

## 28. Contract Impact

Assess:

- API;
- REST;
- WebSocket;
- Lab Protocol;
- artifact manifest;
- database contract;
- event schema;
- SDK.

Contract changes require compatibility analysis.

## 29. Database Impact

Assess:

- schema;
- tables;
- columns;
- constraints;
- indexes;
- migrations;
- data migration;
- retention;
- tenant isolation;
- historical data.

Breaking database changes require expand-contract planning where applicable.

## 30. Security Impact

Assess:

- authentication;
- authorization;
- tenant isolation;
- source privacy;
- artifact security;
- secrets;
- keys;
- audit;
- network boundaries.

Security-critical changes require security review.

## 31. Safety Impact

Assess:

- robot motion;
- E-stop;
- safe state;
- watchdog;
- Lab Agent;
- runtime authority;
- automatic recovery;
- HIL;
- physical qualification.

Any material physical-safety change requires safety review.

## 32. Schedule Impact

Assess:

- task duration;
- milestone date;
- phase gate;
- critical path;
- release date;
- external dependency dates.

Do not hide schedule impact inside implementation notes.

## 33. Resource Impact

Assess:

- engineering capacity;
- specialist review;
- hardware;
- cloud capacity;
- test environments;
- procurement;
- vendor support.

## 34. Commercial Impact

Assess:

- pricing;
- credits;
- subscription;
- utilization;
- cost;
- margin;
- customer commitments.

## 35. Regulatory Impact

Assess:

- privacy;
- data residency;
- safety certification;
- payment rules;
- export restrictions;
- customer geography.

## 36. Documentation Impact

Identify affected documents such as:

- architecture;
- protocol;
- database;
- security;
- planning;
- tracking;
- development;
- release;
- user documentation.

## 37. Release Impact

Assess:

- release version;
- compatibility;
- migration;
- rollback;
- artifact format;
- Studio version;
- Lab Agent version;
- runtime;
- operational procedures.

## 38. Change Approval Principle

Approval must be proportional to impact.

Low-impact changes may be approved within the owning team.

High-impact changes require cross-functional review.

Critical safety/security changes require specialist approval.

## 39. Approval Workflow

    Change Request
          |
          v
       Triage
          |
          v
    Impact Assessment
          |
          v
    Domain Review
          |
          +----> Security if needed
          +----> Safety if needed
          +----> Architecture if needed
          +----> Database if needed
          +----> Commercial if needed
          +----> Legal if needed
          |
          v
       Approval
          |
          v
     Implementation
          |
          v
      Verification
          |
          v
       Closure

## 40. Approval Levels

| Change | Required Approval |
|---|---|
| P3 local implementation | Domain Owner |
| P2 product change | Product + Domain Owner |
| Architecture | Architecture Owner |
| Contract | Integration + affected Domain Owners |
| Database | Data Architecture Owner |
| Security | Security Owner |
| Safety | Safety Authority |
| Commercial | Product/Commercial Owner |
| Regulatory | Legal/Compliance |
| Release-critical | Release Owner + relevant specialists |
| P0 | Project Leadership + required specialist authority |

## 41. Emergency Change

An emergency change is allowed only when delaying action creates greater
material risk.

Examples:

- critical security vulnerability;
- critical safety failure;
- production outage;
- financial corruption;
- regulatory blocker.

Emergency changes require:

1. minimum viable review;
2. explicit authorization;
3. implementation;
4. verification;
5. retrospective documentation.

## 42. Emergency Change Flow

    Critical Event
         |
         v
    Emergency Review
         |
         v
    Authorize
         |
         v
    Implement
         |
         v
    Verify
         |
         v
    Retrospective Change Record
         |
         v
    Permanent Baseline Update

## 43. Scope Change Rules

Scope changes include:

- adding functionality;
- removing functionality;
- changing MVP;
- adding platform;
- removing platform;
- changing user workflow;
- changing commercial feature.

Scope changes must identify:

- product benefit;
- effort;
- dependencies;
- schedule impact;
- release impact.

## 44. Architecture Change Rules

Architecture changes require:

- architecture impact assessment;
- affected ADR identification;
- risk review;
- dependency review;
- implementation plan;
- migration strategy;
- rollback strategy where practical.

## 45. Contract Change Rules

Contract changes require:

- version impact;
- producer impact;
- consumer impact;
- compatibility strategy;
- contract tests;
- migration;
- deprecation plan.

## 46. Schedule Change Rules

Schedule changes must identify:

- original date;
- new date;
- cause;
- affected critical path;
- dependent milestones;
- resource consequences;
- release consequence.

Schedule changes must not silently reduce acceptance criteria.

## 47. Baseline Changes

A baseline changes only after approval.

Before approval:

    Proposed State

After approval:

    New Baseline

The old baseline remains historically traceable.

## 48. Baseline Versioning

Major baseline categories should have identifiable versions where practical:

    Product Baseline
    Architecture Baseline
    Contract Baseline
    Database Baseline
    Security Baseline
    Release Baseline

Documentation commits and release tags provide the immutable evidence.

## 49. Documentation Versioning

Documentation shall be version controlled in Git.

Each material change should be traceable to:

- change request;
- commit;
- pull request;
- decision where applicable;
- task;
- release.

## 50. Documentation Change Classes

| Class | Description |
|---|---|
| Editorial | Typo, formatting, grammar |
| Clarification | No change in meaning |
| Baseline | Approved behavior/design change |
| Historical | Correction to historical record |
| Deprecated | Marks obsolete information |
| Migration | Updates documentation for transition |

Editorial changes normally do not require formal change approval.

Baseline changes do.

## 51. Documentation Rule

A document must not claim a new architecture or process state before the change
has been approved.

Planning documents may describe proposals explicitly as proposed.

## 52. Document Status Language

Use:

    PROPOSED
    BASELINED
    IMPLEMENTED
    VERIFIED
    DEPRECATED
    SUPERSEDED

Avoid ambiguous language such as:

    "probably"
    "expected"
    "temporary"
    "final"

unless context clearly identifies the state.

## 53. Change Traceability

The preferred trace is:

    CR-2026-001
          |
          +--> ADR-021
          |
          +--> KR-ARCH-P2-004
          |
          +--> R-TECH-012
          |
          +--> DEP-CONTRACT-010
          |
          +--> PR #123
          |
          +--> Commit abc123
          |
          +--> Verification Evidence

## 54. Change and Decision Log

Architecture changes must update:

    docs/tracking/DECISION_LOG.md

if they create, modify or supersede a material decision.

## 55. Change and Risk Register

Changes must update:

    docs/tracking/RISK_REGISTER.md

when they:

- introduce risk;
- reduce risk;
- change risk probability;
- change impact;
- remove a risk.

## 56. Change and Dependency Tracking

Changes must update:

    docs/tracking/DEPENDENCY_TRACKING.md

when they:

- add dependencies;
- remove dependencies;
- change suppliers;
- change versions;
- change required-by dates;
- alter dependency criticality.

## 57. Change and Issue Tracking

Changes triggered by issues shall link to:

    docs/tracking/ISSUE_LOG.md

The issue remains the evidence of the observed problem.

## 58. Change and Task Tracking

Implementation must be represented by tasks in:

    docs/tracking/TASK_STATUS.md

A change request is not complete merely because approval was granted.

## 59. Change and Milestones

Milestone scope changes must update:

- milestone definition;
- task list;
- acceptance criteria;
- review checklist;
- status.

## 60. Change and Phase

Phase changes must update:

- phase scope;
- exit criteria;
- dependency map;
- risk posture;
- schedule;
- release assumptions.

## 61. Change and Release

Release-impacting changes require review of:

- release scope;
- qualification;
- compatibility;
- migration;
- rollback;
- release notes.

## 62. Change Request Interfaces

Change management interacts with:

    Product
       |
       v
    Planning
       |
       v
    Change Tracking
       |
       +--> Decisions
       +--> Risks
       +--> Dependencies
       +--> Issues
       +--> Tasks
       +--> Milestones
       +--> Releases
       |
       v
    Engineering
       |
       v
    Verification

## 63. Change Data Model

Conceptually:

    ChangeRequest
      - change_id
      - title
      - category
      - priority
      - status
      - requestor
      - owner
      - baseline
      - proposed_change
      - rationale
      - impact
      - approval
      - implementation
      - verification

Related entities:

    Change
      |
      +--> Decision
      +--> Risk
      +--> Dependency
      +--> Issue
      +--> Task
      +--> Milestone
      +--> Release
      +--> Document

## 64. Change Request Interface

A structured change request should contain:

    {
        "change_id": "CR-2026-001",
        "title": "Example architecture change",
        "category": "ARCH",
        "priority": "P1",
        "status": "PROPOSED",
        "requestor": "owner",
        "baseline": "P3 CONTROL PLANE architecture",
        "proposed_change": "Change description",
        "rationale": "Reason",
        "affected_phase": "1",
        "affected_milestone": "M1",
        "approval_required": [
            "architecture"
        ]
    }

## 65. Approval Record

Approval evidence should include:

- approver;
- role;
- decision;
- date;
- conditions;
- comments.

Possible approval outcomes:

    APPROVED
    APPROVED_WITH_CONDITIONS
    REJECTED
    DEFERRED

## 66. Conditional Approval

Conditional approval requires:

- explicit conditions;
- responsible owner;
- completion criteria;
- deadline;
- verification.

A conditionally approved change is not fully complete until conditions are
satisfied.

## 67. Change Rejection

Rejected changes remain recorded.

The record should capture:

- rejection reason;
- approver;
- date;
- alternative path if applicable.

Rejected changes must not be silently reintroduced without a new review.

## 68. Change Deferral

Deferred changes remain visible.

Record:

- reason;
- target phase;
- dependency;
- condition for reconsideration.

## 69. Change Cancellation

A change may be cancelled when:

- no longer required;
- replaced;
- infeasible;
- scope removed.

Cancellation does not erase history.

## 70. Change Supersession

When one change supersedes another:

    CR-2026-003
         |
         v
    SUPERSEDES
         |
         v
    CR-2026-001

Both remain traceable.

## 71. Change Implementation

Implementation shall identify:

- tasks;
- owners;
- branches;
- commits;
- pull requests;
- tests;
- documentation updates.

## 72. Change Verification

Verification should prove:

- proposed state implemented;
- old behavior no longer applies where intended;
- compatibility maintained;
- tests pass;
- documentation matches implementation.

## 73. Change Closure

A change is COMPLETED only when:

- implementation is complete;
- required tests pass;
- required reviews pass;
- documentation is updated;
- related tracking records are updated;
- evidence is available.

## 74. Change Metrics

Recommended metrics:

- total change requests;
- approved;
- rejected;
- deferred;
- completed;
- emergency changes;
- average approval time;
- average implementation time;
- schedule impact;
- scope churn;
- architecture changes;
- contract changes;
- changes after release freeze.

## 75. Change Churn

High change churn may indicate:

- unclear requirements;
- inadequate planning;
- architecture instability;
- weak dependency analysis;
- insufficient stakeholder alignment.

Change volume should be analyzed rather than automatically minimized.

## 76. Change Budget

The project may establish a change budget for:

- scope changes;
- architecture changes;
- milestone changes;
- release changes.

A change budget does not override safety/security requirements.

## 77. Change Freeze

During release qualification:

- scope is frozen;
- architecture is frozen;
- contracts are frozen;
- database changes are controlled;
- release dependencies are frozen.

Exceptions require explicit approval.

## 78. Release Freeze Exception

Permitted exceptions:

- critical security;
- critical safety;
- production blocker;
- regulatory requirement;
- severe data/financial integrity defect.

The exception must be documented.

## 79. Change Impact on Testing

Every change must identify affected testing levels:

- unit;
- component;
- contract;
- integration;
- E2E;
- simulation;
- HIL;
- physical;
- performance;
- security;
- recovery.

## 80. Change Impact on Security

Security changes may require:

- threat-model update;
- security requirements update;
- security tests;
- key/secret review;
- penetration testing;
- tenant isolation testing.

## 81. Change Impact on Safety

Safety changes may require:

- safety analysis;
- HIL;
- physical test;
- operator procedure update;
- human review;
- deployment gate.

## 82. Change Impact on Database

Database changes may require:

- migration;
- backfill;
- compatibility;
- rollback;
- performance testing;
- tenant isolation testing.

## 83. Change Impact on Contracts

Contract changes may require:

- version increment;
- compatibility period;
- consumer updates;
- producer updates;
- contract tests;
- deprecation.

## 84. Change Impact on Artifact

Artifact changes may require:

- manifest update;
- format version;
- signing;
- validation;
- compatibility matrix;
- Lab Agent update;
- runtime update.

## 85. Change Impact on Commercial Model

Commercial changes may require:

- credit model update;
- pricing update;
- billing integration;
- refund policy;
- invoice update;
- customer communication.

## 86. Change Impact on Operations

Operational changes may require:

- monitoring;
- alerts;
- runbooks;
- dashboards;
- capacity changes;
- support procedures.

## 87. Change Impact on Vendors

Vendor changes may require:

- dependency update;
- contract review;
- security review;
- cost analysis;
- compatibility testing;
- exit strategy review.

## 88. Change Impact on Hardware

Hardware changes may require:

- procurement;
- mechanical/electrical validation;
- firmware;
- driver;
- runtime;
- safety review;
- HIL;
- physical qualification.

## 89. Change Impact on Schedule

Schedule impact should identify:

    Current Milestone
          |
          v
    Proposed Change
          |
          v
    Added / Removed Work
          |
          v
    Dependency Changes
          |
          v
    Critical Path
          |
          v
    New Date
          |
          v
    Release Impact

## 90. Schedule Recovery

When a change threatens schedule, possible actions are:

- parallelize work;
- reduce non-P0 scope;
- use simulation;
- add resources;
- change dependency order;
- defer P2/P3 scope;
- use approved alternative dependency.

Schedule recovery must not remove mandatory safety/security controls.

## 91. Scope Trade-off

When scope increases:

    Added Scope
        |
        +--> Add Capacity
        +--> Extend Schedule
        +--> Remove Other Scope
        +--> Reduce Non-Critical Features

The selected trade-off must be explicit.

## 92. Change and Critical Path

A change affecting critical-path work requires:

- schedule assessment;
- dependency assessment;
- milestone impact;
- resource assessment;
- escalation.

## 93. Change and Product MVP

MVP changes require explicit product approval.

MVP scope is:

    Primary MVP:
    Login
      ->
    Create Project
      ->
    Select Robot Platform
      ->
    Build Locally
      ->
    Generate .krv
      ->
    Book Robot
      ->
    Upload Artifact
      ->
    Start Job
      ->
    Live Video
      ->
    Telemetry / Logs
      ->
    Complete
      ->
    Results
      ->
    Run Again

Changes to this flow are high-impact product changes.

## 94. Change and Source Privacy

A change that would cause customer source to leave the developer machine is a
critical security architecture change.

It requires:

- security review;
- threat-model update;
- architecture decision;
- explicit approval.

It must not be introduced as an implementation detail.

## 95. Change and Physical Safety

Any change affecting remote robot execution requires review of:

- local safety authority;
- E-stop;
- safe state;
- watchdog;
- fault handling;
- automatic restart;
- HIL;
- physical qualification.

## 96. Change and Credit Integrity

Any change affecting credits must consider:

- platform-specific wallets;
- rate cards;
- reservation;
- consumption;
- refunds;
- ledger;
- reconciliation.

Financial integrity changes require data and commercial review.

## 97. Change and Booking Integrity

Any booking change must consider:

- resource allocation;
- exclusion constraints;
- maintenance;
- availability;
- cancellation;
- idempotency;
- credit reservation.

## 98. Change and Tenant Isolation

Any data or API change must evaluate:

- organization ownership;
- authorization;
- repository filtering;
- object storage paths;
- cache keys;
- event context;
- logs.

## 99. Change and Cloud

Cloud changes must consider:

- environment isolation;
- infrastructure as code;
- provider adapter;
- security;
- backup;
- observability;
- cost;
- rollback.

## 100. Change and Provider Neutrality

Provider-specific changes should remain inside infrastructure adapters where
possible.

Changing providers should not require rewriting domain logic.

## 101. P0 FOUNDATION Mapping

P0 FOUNDATION change management establishes:

- change IDs;
- baseline rules;
- approval workflow;
- document versioning;
- architecture decision linkage;
- initial change log.

Primary objective:

    Establish controlled change before implementation scales.

## 102. P1 STUDIO Mapping

P1 STUDIO changes focus on:

- Studio;
- local runtime;
- local project workflow;
- IPC boundary;
- local source-privacy boundary.

Changes that weaken the local source-privacy boundary require security review.

## 103. P2 BUILD & ARTIFACT Mapping

P2 BUILD & ARTIFACT changes focus on:

- local build;
- artifact;
- artifact manifest;
- signing;
- source privacy;
- artifact security.

Contract and security impact are especially important.

## 104. P3 CONTROL PLANE Mapping

P3 CONTROL PLANE changes focus on:

- core platform architecture;
- database;
- authentication;
- authorization;
- tenant model;
- API contracts;
- object storage metadata.

High-impact changes require architecture and security review.

## 105. P4 BOOKING & COMMERCIAL Mapping

P4 BOOKING & COMMERCIAL changes focus on:

- booking;
- resource allocation;
- credits;
- wallets;
- ledger;
- rate cards;
- refunds.

Financial/resource consistency is mandatory.

## 106. P5 EXECUTION Mapping

P5 EXECUTION changes focus on:

- simulated Lab Agent;
- execution;
- Job/Run;
- simulation;
- protocol;
- execution events and logs.

Changes that would introduce physical execution belong to P6 LAB & ROBOT and require safety review there.

## 107. P6 LAB & ROBOT Mapping

P6 LAB & ROBOT changes focus on:

- physical Lab Agent;
- robot hardware;
- HIL;
- physical qualification;
- safety;
- E-stop.

Safety changes receive specialist review.

## 108. P7 LIVE & RESULTS Mapping

P7 LIVE & RESULTS changes focus on:

- telemetry;
- video;
- results;
- observation data and provenance.

Changes affecting result integrity or provenance require review.

## 109. P8 PRODUCTION Mapping

P8 PRODUCTION changes focus on:

- security qualification;
- secrets and keys;
- audit;
- recovery;
- production infrastructure;
- scale, capacity and multi-lab operation;
- release;
- commercial and operational readiness;
- physical fleet rollout.

Security-impacting and release-impacting changes are tightly controlled.

## 110. Initial Change Governance State

Current state:

    Current Phase:
        P0 FOUNDATION

    Change Process:
        Defined

    Change Register:
        Initialized

    Active Change Requests:
        None declared

    Emergency Changes:
        None declared

    Baseline:
        Planning / Architecture

    Implementation:
        Not Started

## 111. Open Questions

The following change-management questions remain open:

1. Exact change-approval tooling.
2. Exact named approvers for each domain.
3. Whether change IDs should be generated automatically.
4. Whether change impact scores should become numeric.
5. Whether documentation version numbers should be generated automatically.
6. Whether a dedicated change-request issue template should be added.
7. Whether change metrics should feed the master dashboard automatically.
8. Whether product scope changes require customer advisory review.
9. Whether commercial changes require financial approval thresholds.
10. Whether emergency changes require a dedicated incident/change integration.
11. Whether all baseline documents should receive explicit semantic versions.
12. Whether release freeze dates should be recorded centrally.

These questions do not block initial operation.

## 112. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Uncontrolled scope growth | Schedule/product | Formal scope change approval |
| Silent architecture drift | Technical | ADR linkage and architecture review |
| Contract incompatibility | Integration | Versioning and contract tests |
| Hidden schedule impact | Schedule | Mandatory impact assessment |
| Documentation drift | Quality | Change-to-document traceability |
| Safety change bypass | Safety | Specialist approval |
| Security change bypass | Security | Security gate |
| Database migration surprise | Technical | Migration review |
| Vendor change surprise | Dependency | Dependency register |
| Excessive change churn | Schedule | Baseline and planning review |
| Emergency changes become normal | Governance | Emergency criteria and retrospective |
| Release instability | Release | Change freeze and qualification |

## 113. Change Review Checklist

For each material change:

- [ ] Change ID assigned.
- [ ] Requestor identified.
- [ ] Owner assigned.
- [ ] Category assigned.
- [ ] Priority assigned.
- [ ] Baseline identified.
- [ ] Proposed change described.
- [ ] Rationale documented.
- [ ] Alternatives considered.
- [ ] Impact assessed.
- [ ] Risks assessed.
- [ ] Dependencies assessed.
- [ ] Schedule assessed.
- [ ] Approval authority identified.

## 114. Architecture Change Checklist

- [ ] Architecture impact assessed.
- [ ] Existing ADRs identified.
- [ ] New ADR required?
- [ ] Domain boundaries reviewed.
- [ ] Data ownership reviewed.
- [ ] Protocol impact reviewed.
- [ ] Security reviewed.
- [ ] Safety reviewed.
- [ ] Migration defined.
- [ ] Rollback considered.

## 115. Contract Change Checklist

- [ ] Producer identified.
- [ ] Consumer identified.
- [ ] Version identified.
- [ ] Compatibility reviewed.
- [ ] Contract tests updated.
- [ ] Migration strategy defined.
- [ ] Deprecation defined.
- [ ] Studio impact reviewed.
- [ ] Backend impact reviewed.
- [ ] Lab Agent impact reviewed.

## 116. Schedule Change Checklist

- [ ] Current date recorded.
- [ ] Proposed date recorded.
- [ ] Cause documented.
- [ ] Critical path assessed.
- [ ] Dependencies assessed.
- [ ] Resources assessed.
- [ ] Milestones assessed.
- [ ] Release impact assessed.
- [ ] Scope trade-off considered.

## 117. Security Change Checklist

- [ ] Authentication impact assessed.
- [ ] Authorization impact assessed.
- [ ] Tenant isolation assessed.
- [ ] Source privacy assessed.
- [ ] Artifact security assessed.
- [ ] Secrets assessed.
- [ ] Keys assessed.
- [ ] Audit assessed.
- [ ] Security tests defined.
- [ ] Security approval recorded.

## 118. Safety Change Checklist

- [ ] Physical safety impact assessed.
- [ ] E-stop impact assessed.
- [ ] Safe-state impact assessed.
- [ ] Watchdog impact assessed.
- [ ] Fault-recovery impact assessed.
- [ ] Automatic restart reviewed.
- [ ] HIL impact assessed.
- [ ] Physical qualification impact assessed.
- [ ] Human safety review recorded.

## 119. Database Change Checklist

- [ ] Tables affected identified.
- [ ] Constraints affected identified.
- [ ] Indexes affected identified.
- [ ] Migration defined.
- [ ] Backfill assessed.
- [ ] Rollback assessed.
- [ ] Compatibility assessed.
- [ ] Tenant isolation assessed.
- [ ] Performance assessed.
- [ ] Recovery assessed.

## 120. Release Change Checklist

- [ ] Release scope assessed.
- [ ] Version impact assessed.
- [ ] Artifact impact assessed.
- [ ] Database migration assessed.
- [ ] Compatibility assessed.
- [ ] Testing updated.
- [ ] Rollback updated.
- [ ] Release notes updated.
- [ ] Risk disposition updated.
- [ ] Approval recorded.

## 121. Documentation Acceptance Criteria

- [ ] Change process documented.
- [ ] Change categories documented.
- [ ] Change lifecycle documented.
- [ ] Approval workflow documented.
- [ ] Impact assessment template documented.
- [ ] Change log format documented.
- [ ] Documentation versioning documented.
- [ ] Baseline rules documented.
- [ ] Emergency process documented.
- [ ] Release freeze process documented.

## 122. Change Register Acceptance Criteria

- [ ] Unique change IDs defined.
- [ ] Initial change log populated.
- [ ] Requestor field defined.
- [ ] Owner field defined.
- [ ] Status field defined.
- [ ] Category field defined.
- [ ] Priority field defined.
- [ ] Impact field defined.
- [ ] Phase field defined.
- [ ] Milestone field defined.

## 123. Change Workflow Acceptance Criteria

- [ ] PROPOSED state defined.
- [ ] TRIAGED state defined.
- [ ] ASSESSMENT state defined.
- [ ] APPROVAL_PENDING state defined.
- [ ] APPROVED state defined.
- [ ] IMPLEMENTING state defined.
- [ ] VERIFICATION state defined.
- [ ] COMPLETED state defined.
- [ ] REJECTED state defined.
- [ ] DEFERRED state defined.
- [ ] CANCELLED state defined.
- [ ] SUPERSEDED state defined.

## 124. Change Approval Acceptance Criteria

- [ ] Approval authority is defined.
- [ ] Architecture approval is defined.
- [ ] Security approval is defined.
- [ ] Safety approval is defined.
- [ ] Database approval is defined.
- [ ] Commercial approval is defined.
- [ ] Regulatory approval is defined.
- [ ] Release approval is defined.
- [ ] Emergency approval is defined.

## 125. Change Traceability Acceptance Criteria

- [ ] Changes link to tasks.
- [ ] Changes link to risks.
- [ ] Changes link to dependencies.
- [ ] Changes link to issues.
- [ ] Changes link to decisions.
- [ ] Changes link to milestones.
- [ ] Changes link to releases.
- [ ] Changes link to documentation.
- [ ] Implementation evidence is retained.
- [ ] Verification evidence is retained.

## 126. Documentation Versioning Acceptance Criteria

- [ ] Documentation is Git-controlled.
- [ ] Material document changes reference change IDs.
- [ ] Baseline changes are traceable.
- [ ] Superseded documentation remains historically recoverable.
- [ ] Current documentation state is identifiable.
- [ ] Proposed documentation is clearly labelled.
- [ ] Historical corrections are distinguished from new baselines.

## 127. Phase Acceptance Criteria

- [ ] P0 FOUNDATION change controls established.
- [ ] P1 STUDIO local-boundary changes controlled.
- [ ] P2 BUILD & ARTIFACT artifact/source privacy changes controlled.
- [ ] P3 CONTROL PLANE architecture, identity and data changes controlled.
- [ ] P4 BOOKING & COMMERCIAL booking/credit changes controlled.
- [ ] P5 EXECUTION simulated execution/protocol changes controlled.
- [ ] P6 LAB & ROBOT safety/hardware changes controlled.
- [ ] P7 LIVE & RESULTS observation and results changes controlled.
- [ ] P8 PRODUCTION security, operations and release changes controlled.

## 128. Final Change Management Invariants

The following invariants are mandatory:

1. Every material change has a unique immutable ID.
2. Every material change identifies its baseline.
3. Every material change has a requestor.
4. Every material change has an owner.
5. Every material change has a category.
6. Every material change has a status.
7. Every material change has an impact assessment appropriate to its priority.
8. Scope changes require product review.
9. Architecture changes require architecture review.
10. Contract changes require compatibility review.
11. Schedule changes require schedule impact assessment.
12. Security changes require security review.
13. Safety changes require safety review.
14. Database changes require migration review.
15. Release-critical changes require release review.
16. Changes must not silently rewrite approved baselines.
17. Rejected changes remain historically visible.
18. Deferred changes remain visible.
19. Superseded changes remain traceable.
20. Emergency changes require retrospective documentation.
21. Approved changes require implementation evidence.
22. Completed changes require verification evidence.
23. Material documentation changes are version controlled.
24. Change records link to affected risks.
25. Change records link to affected dependencies.
26. Change records link to affected decisions.
27. Change records link to implementation tasks.
28. Safety and security gates cannot be removed silently for schedule recovery.
29. Release freeze exceptions require explicit authorization.
30. The change register remains synchronized with project planning, decisions,
    risks, dependencies, issues, tasks and release tracking.

## 129. Final Change Management Flow

The canonical flow is:

    BASELINE
       |
       v
    CHANGE IDENTIFIED
       |
       v
    CHANGE REQUEST
       |
       v
    TRIAGE
       |
       v
    IMPACT ASSESSMENT
       |
       +----> Risk
       +----> Dependency
       +----> Decision
       +----> Issue
       +----> Schedule
       +----> Documentation
       |
       v
    APPROVAL
       |
       +----> REJECTED
       +----> DEFERRED
       |
       v
    IMPLEMENT
       |
       v
    TEST
       |
       v
    VERIFY
       |
       v
    UPDATE BASELINE
       |
       v
    UPDATE DOCUMENTATION
       |
       v
    CLOSE CHANGE

## 130. Final Principle

> Kritva RaaS CHANGE_TRACKING.md shall provide disciplined control over
> modifications to the approved product and engineering baseline without
> preventing necessary evolution. Every material change shall be explicitly
> requested, classified, impact-assessed, reviewed, approved, implemented,
> verified and recorded. Scope, architecture, contract and schedule changes
> receive particular scrutiny because they can propagate across multiple
> phases and domains. Security and physical safety changes require specialist
> review and cannot be silently bypassed to recover schedule. Approved changes
> shall remain traceable to decisions, risks, dependencies, issues, tasks,
> milestones, documentation and releases. Documentation shall be version
> controlled so that the project can always determine what the approved
> baseline was at a given point in time. The objective is not zero change; it
> is controlled, evidence-based change that preserves architectural integrity,
> product intent, safety, security, schedule transparency and production
> readiness throughout the Kritva RaaS lifecycle.
