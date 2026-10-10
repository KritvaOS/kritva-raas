# Kritva RaaS Development Workflow

## 1. Purpose

This document defines the repository-wide development workflow for Kritva RaaS.

It establishes the standard process for converting an approved requirement into
a reviewed, tested, documented and integrated implementation.

The workflow covers:

- task creation;
- task refinement;
- Definition of Ready;
- contract-first design;
- implementation;
- documentation;
- tracking;
- testing;
- code review;
- CI;
- integration;
- release preparation;
- Definition of Done;
- communication;
- architecture decision management.

The objective is to make development predictable across:

- RaaS Studio;
- Studio Local Runtime;
- Control Plane;
- shared packages;
- database;
- cloud infrastructure;
- Lab Agent;
- simulated lab;
- physical lab;
- security;
- documentation.

The workflow is designed for a repository in which multiple engineers or
implementation agents may work in parallel.

## 2. Scope

This workflow applies to:

- features;
- bug fixes;
- refactoring;
- database changes;
- protocol changes;
- security changes;
- infrastructure changes;
- documentation changes;
- test changes;
- release changes;
- physical-lab integration changes.

It applies to:

- application code;
- shared packages;
- contracts;
- database migrations;
- configuration;
- infrastructure;
- documentation;
- CI/CD configuration.

It does not replace:

- architecture decisions;
- detailed database specifications;
- security requirements;
- release roadmap;
- integration plan;
- development setup.

Those documents define the architecture and constraints within which this
workflow operates.

## 3. Goals

The workflow shall:

1. make work traceable;
2. prevent premature implementation;
3. establish contracts before dependent implementation;
4. keep documentation synchronized with implementation;
5. keep project tracking synchronized with reality;
6. enforce architecture review;
7. provide repeatable CI gates;
8. make ownership explicit;
9. support parallel development;
10. reduce integration surprises;
11. preserve source-code privacy;
12. preserve tenant and security boundaries;
13. make physical robotics work simulation-first;
14. provide auditable completion evidence.

## 4. Non-Goals

This document does not:

- prescribe a specific IDE;
- prescribe individual coding style beyond repository standards;
- replace detailed API specifications;
- replace database schema specifications;
- replace security threat models;
- replace release qualification procedures;
- define personnel performance evaluation;
- require a specific Agile methodology.

## 5. Core Development Principle

The governing workflow is:

    Requirement
        |
        v
    Task Definition
        |
        v
    Definition of Ready
        |
        v
    Contract / Architecture
        |
        v
    Implementation
        |
        v
    Unit Tests
        |
        v
    Integration Tests
        |
        v
    Documentation
        |
        v
    Review
        |
        v
    CI
        |
        v
    Acceptance
        |
        v
    Integration
        |
        v
    Tracking Update

A task is not complete merely because code compiles.

## 6. Development Principles

Kritva RaaS development follows these principles:

1. Architecture before implementation.
2. Contract before dependent implementation.
3. Small, reviewable tasks.
4. Explicit ownership.
5. Evidence-based completion.
6. Documentation as part of implementation.
7. Tests as part of implementation.
8. Security as part of implementation.
9. Simulation before physical execution.
10. No silent architectural changes.
11. No hidden dependencies.
12. No undocumented manual steps.
13. CI must protect repository integrity.
14. Tracking must reflect actual state.
15. Communication must surface blockers early.

# 7. Repository Development Model

The repository is a monorepo:

    kritva-raas/
        apps/
        packages/
        database/
        cloud/
        examples/
        tests/
        docs/
        .github/

The development workflow operates across all these areas.

A change may affect multiple domains.

Example:

    Booking Feature
         |
         +--> packages/contracts
         +--> apps/backend
         +--> apps/studio
         +--> database/migrations
         +--> tests/integration
         +--> tests/e2e
         +--> docs/database
         +--> docs/frontend
         +--> docs/planning
         +--> tracking

# 8. Work Item Hierarchy

Work should follow this hierarchy:

    Product Goal
        |
        v
    Phase
        |
        v
    Milestone
        |
        v
    Task
        |
        v
    Subtask
        |
        v
    Implementation
        |
        v
    Evidence

The task is the primary implementation unit.

A task should be small enough to review but large enough to produce a coherent
change.

# 9. Task Identity

Every significant task shall have a stable identifier.

Recommended format:

    KR-<DOMAIN>-<PHASE>-<NUMBER>

Examples:

    KR-CORE-P1-001
    KR-STUDIO-P2-003
    KR-BOOKING-P4-002
    KR-LAB-P5-001

Existing project-specific identifiers may be retained where already
established.

Identifiers must not be silently reused.

# 10. Task Directory

Task-specific documentation should use:

    docs/
        milestones/
            <MILESTONE-ID>/
        tasks/
            <TASK-ID>/
                TASK.md
                ACCEPTANCE_CRITERIA.md

The task acceptance file is intentionally named:

    ACCEPTANCE_CRITERIA.md

The task directory provides its scope.

# 11. Task Lifecycle

The standard lifecycle is:

    BACKLOG
       |
       v
    REFINED
       |
       v
    READY
       |
       v
    IN_PROGRESS
       |
       v
    IMPLEMENTED
       |
       v
    REVIEW
       |
       v
    CI
       |
       v
    ACCEPTED
       |
       v
    INTEGRATED
       |
       v
    CLOSED

Possible exception states:

    BLOCKED
    REJECTED
    DEFERRED
    SUPERSEDED

# 12. Backlog

A task enters BACKLOG when the work is identified but insufficiently defined
for implementation.

A backlog item may contain:

- title;
- problem statement;
- initial scope;
- priority;
- affected domain;
- dependencies.

It should not yet contain assumptions presented as final architecture.

# 13. Refinement

Refinement converts a backlog item into an implementable task.

Refinement should identify:

- objective;
- scope;
- non-goals;
- dependencies;
- interfaces;
- data changes;
- security implications;
- tests;
- documentation;
- acceptance criteria;
- affected phases.

# 14. Definition of Ready

A task is READY only when:

- objective is clear;
- scope is bounded;
- non-goals are stated;
- owner is known;
- dependencies are identified;
- architecture is compatible;
- contract impact is understood;
- database impact is understood;
- security impact is understood;
- acceptance criteria exist;
- test strategy exists;
- documentation impact is known.

A task must not enter implementation merely because someone is available to
work on it.

# 15. Ready Checklist

- [ ] Task ID assigned.
- [ ] Problem statement written.
- [ ] Goal defined.
- [ ] Scope defined.
- [ ] Non-goals defined.
- [ ] Dependencies identified.
- [ ] Owner assigned.
- [ ] Relevant ADRs identified.
- [ ] Contract impact identified.
- [ ] Data impact identified.
- [ ] Security impact identified.
- [ ] Test approach defined.
- [ ] Documentation impact identified.
- [ ] Acceptance criteria written.
- [ ] Completion evidence defined.

# 16. Task Definition

Each task should document:

    Task ID
    Title
    Status
    Owner
    Priority
    Phase
    Milestone
    Context
    Problem
    Goal
    Scope
    Non-goals
    Dependencies
    Architecture
    Contracts
    Data
    Security
    Testing
    Documentation
    Acceptance Criteria
    Evidence

# 17. Priority

Recommended priorities:

| Priority | Meaning |
|---|---|
| P0 | Required for current milestone/release |
| P1 | Important but not blocking core milestone |
| P2 | Useful enhancement |
| EXP | Experimental |
| DEFERRED | Explicitly postponed |

P0 does not mean every task is urgent.

It means the task is required to satisfy the agreed milestone or release
scope.

# 18. Contract-First Development

Any change crossing a system boundary shall begin with contract analysis.

Relevant boundaries include:

    Studio <-> Local Runtime
    Studio <-> Control Plane
    Control Plane <-> Lab Agent
    Lab Agent <-> Runtime
    Runtime <-> Robot
    Application <-> Database
    Application <-> Object Storage
    Application <-> Queue

The workflow is:

    Requirement
        |
        v
    Contract Change
        |
        v
    Contract Review
        |
        v
    Implementation
        |
        v
    Contract Tests
        |
        v
    Integration

# 19. Contract Change Classification

A change shall be classified as:

- no contract impact;
- internal contract;
- public API contract;
- protocol contract;
- database contract;
- artifact contract;
- event contract;
- security contract;
- compatibility-breaking contract.

Breaking changes require explicit review.

# 20. Contract Definition

A contract should define:

- operation;
- request;
- response;
- event;
- errors;
- authentication;
- authorization;
- version;
- idempotency;
- timeout;
- retry semantics;
- correlation;
- compatibility.

Example:

    POST /projects

    Request:
        organization_id
        name
        project_key

    Response:
        project_id
        organization_id
        status

The exact protocol definition belongs in the appropriate contract document.

# 21. Contract Review

Before implementation of a cross-boundary change:

- identify all producers;
- identify all consumers;
- identify version compatibility;
- identify migration path;
- identify rollback behavior;
- identify tests.

No consumer should discover a changed contract only after implementation.

# 22. Database-First Analysis

Database changes require explicit analysis before coding.

The task must identify:

- owning domain;
- tables affected;
- constraints;
- indexes;
- migration;
- data migration;
- rollback;
- retention implications;
- tenant implications;
- authorization implications.

The authoritative ownership model remains:

    One Domain
        |
        v
    One Authoritative Owner

Shared database access does not create shared write ownership.

# 23. API-First and UI-First Coordination

For user-visible functionality, the normal dependency direction is:

    Product Requirement
        |
        v
    Domain Behavior
        |
        v
    API Contract
        |
        v
    API Client
        |
        v
    UI
        |
        v
    E2E

UI may be prototyped earlier, but production behavior must converge on the
approved contract.

# 24. Architecture Decision Review

A task must reference relevant decisions in:

    docs/planning/DECISIONS.md

Examples:

- local build;
- artifact upload;
- modular monolith;
- platform-specific credits;
- Job/Run separation;
- simulated lab first.

If implementation requires contradicting an accepted decision, stop and raise
an architecture decision change.

# 25. No Silent Architecture Changes

The following are prohibited:

- changing a protocol without updating its contract;
- introducing a service boundary without architectural review;
- changing credit semantics without ADR review;
- storing source remotely contrary to the privacy architecture;
- bypassing the Lab Agent boundary;
- allowing cloud systems to override physical safety;
- collapsing Job and Run without a new decision.

# 26. Implementation Start

Once a task reaches READY:

    READY
      |
      v
    Branch
      |
      v
    Contract
      |
      v
    Implementation
      |
      v
    Tests
      |
      v
    Docs
      |
      v
    Review

The implementation branch should remain focused on the task objective.

# 27. Branching

Branch names should identify work.

Examples:

    feat/KR-BOOKING-P4-002-resource-allocation
    fix/KR-ARTIFACT-P2-004-manifest-validation
    docs/KR-ARCH-P0-003-contract-versioning

Branches should not contain unrelated work.

# 28. Commit Discipline

Commits should be:

- focused;
- logically complete;
- buildable where practical;
- reviewable;
- traceable to a task.

Recommended structure:

    <type>: <short description>

Examples:

    feat: implement booking resource allocation
    fix: reject incompatible artifact architecture
    docs: define artifact upload contract

Task IDs may be included where project convention requires them.

# 29. Implementation Evidence

Implementation evidence may include:

- commit hash;
- test output;
- CI result;
- screenshots;
- API traces;
- migration results;
- simulator output;
- hardware validation;
- benchmark results.

Evidence must demonstrate the acceptance criteria rather than merely proving
that a developer ran arbitrary commands.

# 30. Test-Driven Acceptance

Tests should map to acceptance criteria.

Example:

    Acceptance Criterion
            |
            v
        Test Case
            |
            v
        Evidence
            |
            v
        Review

Every critical acceptance criterion should have a verification method.

# 31. Testing Strategy

Testing levels are:

    Unit
      |
      v
    Component
      |
      v
    Integration
      |
      v
    E2E
      |
      v
    Simulation
      |
      v
    HIL
      |
      v
    Physical Validation

The lowest practical test level should be used for fast feedback.

# 32. Unit Tests

Unit tests should cover:

- domain rules;
- state transitions;
- validation;
- calculations;
- policy;
- serialization;
- artifact manifest processing.

Unit tests should not require external infrastructure unless unavoidable.

# 33. Integration Tests

Integration tests should cover:

- PostgreSQL;
- repositories;
- object storage;
- queue;
- application services;
- protocol handlers.

They should validate actual integration boundaries.

# 34. End-to-End Tests

E2E tests validate business workflows.

Primary MVP flow:

    Login
      |
      v
    Create Project
      |
      v
    Select Robot Platform
      |
      v
    Build Locally
      |
      v
    Generate .krv
      |
      v
    Book Robot
      |
      v
    Upload Artifact
      |
      v
    Start Job
      |
      v
    Live Execution
      |
      v
    Complete
      |
      v
    Results
      |
      v
    Run Again

# 35. Simulation Requirement

New execution features should first be validated using the simulated lab.

The preferred sequence is:

    Software
       |
       v
    Simulated Lab
       |
       v
    Integration
       |
       v
    HIL
       |
       v
    Physical Robot

Physical testing must not become the default development loop.

# 36. Security Review During Development

Security impact must be assessed before review.

Questions include:

- Does the task handle secrets?
- Does it handle source code?
- Does it cross a tenant boundary?
- Does it change authentication?
- Does it change authorization?
- Does it change artifact trust?
- Does it expose a new API?
- Does it change Lab Agent behavior?
- Does it affect physical execution?

Critical security changes require explicit security review.

# 37. Documentation as a Deliverable

Documentation is part of implementation.

A task is incomplete if required documentation has not been updated.

Potential documentation areas:

    docs/architecture/
    docs/protocol/
    docs/frontend/
    docs/backend/
    docs/cloud/
    docs/database/
    docs/security/
    docs/planning/
    docs/development/
    docs/ui/

# 38. Documentation Update Rules

Update documentation when a change affects:

- architecture;
- API;
- protocol;
- database;
- security;
- setup;
- deployment;
- user workflow;
- release behavior;
- operational behavior.

Do not postpone required documentation to an unspecified future task.

# 39. Documentation Traceability

A task should identify:

    Code Change
        |
        +--> Architecture Doc
        +--> Contract Doc
        +--> Database Doc
        +--> Security Doc
        +--> Development Doc
        +--> Tracking Doc

Only affected documents need updating.

# 40. Tracking System

The repository tracking structure includes:

    docs/tracking/
        STATUS.md
        PHASE_STATUS.md
        MILESTONE_STATUS.md
        TASK_STATUS.md
        ISSUE_LOG.md
        RISK_REGISTER.md
        DEPENDENCY_TRACKING.md
        DECISION_LOG.md
        CHANGE_TRACKING.md

Tracking documents are authoritative project-status records.

# 41. Task Status Updates

A task status must change when the actual implementation state changes.

Example:

    READY
      |
      v
    IN_PROGRESS
      |
      v
    IMPLEMENTED
      |
      v
    REVIEW
      |
      v
    ACCEPTED

Do not leave a task marked IN_PROGRESS after it has moved into review.

# 42. Milestone Tracking

Milestone status should aggregate task evidence.

A milestone is not complete because all task titles have been checked.

Completion requires:

- task acceptance;
- integration evidence;
- milestone acceptance criteria;
- review checklist;
- required documentation;
- known blockers resolved or explicitly accepted.

# 43. Status Integrity

Tracking must never be optimized to make the project appear healthier.

Status must represent reality.

If a task is blocked, mark it BLOCKED.

If a task is awaiting safety review, record that gate explicitly.

# 44. Communication Model

Communication should be:

- concise;
- factual;
- traceable;
- action-oriented.

Important updates should state:

1. what changed;
2. current state;
3. evidence;
4. blockers;
5. next action.

Example:

    KR-BOOKING-P4-002
    Status: REVIEW
    Implementation: complete
    Tests: 42 passed
    CI: pending
    Blocker: none
    Next: reviewer approval

# 45. Blocker Communication

A blocker should be raised immediately when it prevents progress.

A blocker record should contain:

- task;
- blocker;
- impact;
- owner;
- dependency;
- required decision;
- expected next action.

Do not wait for a milestone review to reveal an active blocker.

# 46. Dependency Communication

Dependencies should be explicit.

Example:

    TASK-A
       |
       v
    Contract C
       |
       +------> TASK-B
       |
       +------> TASK-C

When a dependency slips, affected owners should be informed.

# 47. Review Request

A review request should contain:

- task ID;
- summary;
- scope;
- architecture impact;
- contract impact;
- database impact;
- security impact;
- tests;
- documentation;
- known limitations;
- requested reviewer.

# 48. Code Review Responsibilities

The author is responsible for:

- correctness;
- tests;
- documentation;
- evidence;
- responding to review comments.

The reviewer is responsible for:

- architecture;
- correctness;
- security;
- maintainability;
- test adequacy;
- acceptance criteria.

The reviewer is not expected to reconstruct an undocumented design.

# 49. Review Sequence

Recommended review order:

    1. Requirement
    2. Scope
    3. Architecture
    4. Contract
    5. Data
    6. Security
    7. Implementation
    8. Tests
    9. Documentation
    10. Acceptance Evidence

This prevents detailed code review from hiding a fundamentally incorrect design.

# 50. Review Outcomes

A review may result in:

- APPROVED;
- APPROVED WITH NON-BLOCKING FOLLOW-UP;
- CHANGES REQUESTED;
- BLOCKED;
- ARCHITECTURE REVIEW REQUIRED.

A reviewer should clearly distinguish blocking from non-blocking comments.

# 51. Architecture Review Trigger

Architecture review is required when a task:

- changes a product-wide decision;
- adds a new system boundary;
- changes a protocol;
- changes data ownership;
- changes tenant isolation;
- changes artifact security;
- changes physical safety;
- changes execution semantics;
- changes release compatibility.

# 52. Database Review Trigger

Database review is required when a task:

- adds a table;
- changes a table;
- changes ownership;
- adds a migration;
- changes constraints;
- changes indexes materially;
- changes retention;
- changes tenant relationships;
- changes transaction semantics.

# 53. Security Review Trigger

Security review is required for:

- authentication;
- authorization;
- secrets;
- keys;
- source privacy;
- artifact signing;
- tenant isolation;
- public endpoints;
- Lab Agent identity;
- privileged operations.

# 54. Safety Review Trigger

Human safety review is required for changes involving:

- physical motion;
- motor control;
- emergency stop;
- safety interlocks;
- robot enable;
- physical deployment;
- unsafe-state recovery.

Software completion must not be interpreted as physical safety approval.

# 55. CI Workflow

The CI pipeline should follow:

    Checkout
       |
       v
    Toolchain Setup
       |
       v
    Dependency Install
       |
       v
    Format
       |
       v
    Lint
       |
       v
    Typecheck
       |
       v
    Unit Tests
       |
       v
    Integration Tests
       |
       v
    Build
       |
       v
    E2E
       |
       v
    Security Checks
       |
       v
    Artifact / Evidence
       |
       v
    Review Gate

Not every workflow needs every expensive gate, but required gates must be
explicit.

# 56. CI Gate Classes

| Gate | Purpose |
|---|---|
| Format | Consistency |
| Lint | Static quality |
| Typecheck | Type correctness |
| Unit | Component correctness |
| Integration | Boundary correctness |
| E2E | Workflow correctness |
| Security | Security regression prevention |
| Build | Packaging correctness |
| Migration | Database correctness |
| Artifact | Execution-package correctness |

# 57. Pull Request Gates

A normal pull request should require:

- formatting;
- lint;
- typecheck;
- relevant unit tests;
- relevant integration tests;
- build;
- security checks where applicable.

Changes affecting complete workflows should also run E2E tests.

# 58. Merge Rule

A change should not merge when:

- required CI fails;
- blocking review comments remain;
- acceptance criteria are incomplete;
- required architecture review is missing;
- required security review is missing;
- required safety review is missing;
- documentation is materially incomplete.

# 59. CI Failure Handling

A failed CI check must be classified as:

- implementation failure;
- test failure;
- infrastructure failure;
- flaky test;
- tooling failure;
- unrelated failure.

Flaky tests must be tracked rather than permanently ignored.

# 60. Flaky Test Policy

A flaky test must:

1. be identified;
2. be tracked;
3. have an owner;
4. have a mitigation;
5. be repaired.

Disabling a test requires explicit justification.

# 61. Migration CI

Database changes must be validated against:

- clean database;
- current schema;
- migration sequence;
- seed where relevant.

A pull request must not rely on a developer's manually modified database.

# 62. Contract CI

Contract changes should trigger:

- schema validation;
- producer tests;
- consumer tests;
- compatibility tests.

Where feasible:

    Contract
       |
       +--> Producer
       |
       +--> Consumer
       |
       +--> Simulator
       |
       +--> E2E

# 63. Artifact CI

Artifact changes should validate:

- manifest;
- checksum;
- signature;
- package contents;
- prohibited source content;
- platform compatibility;
- architecture compatibility.

# 64. Security CI

Security CI should include where applicable:

- secret scanning;
- dependency scanning;
- static analysis;
- container scanning;
- artifact scanning;
- policy checks.

Security checks must not be treated as optional formatting checks.

# 65. Documentation CI

Documentation validation should verify:

- required files exist;
- links are valid where automated;
- formatting is valid;
- generated references are consistent where applicable.

Documentation changes should not silently invalidate repository navigation.

# 66. Definition of Done

A task is DONE only when:

- implementation is complete;
- acceptance criteria are satisfied;
- tests pass;
- relevant CI passes;
- code review is complete;
- documentation is updated;
- tracking is updated;
- known limitations are recorded;
- required security review is complete;
- required safety review is complete;
- integration is complete or explicitly accepted as a follow-up.

"Code merged" is not by itself Definition of Done.

# 67. Definition of Done Checklist

- [ ] Scope implemented.
- [ ] Non-goals remain unchanged.
- [ ] Contract implemented.
- [ ] Database changes implemented.
- [ ] Tests added.
- [ ] Tests pass.
- [ ] Security checked.
- [ ] Documentation updated.
- [ ] Tracking updated.
- [ ] Review approved.
- [ ] CI passes.
- [ ] Evidence recorded.
- [ ] No unresolved blocking issue.
- [ ] Integration completed.

# 68. Exception Handling

If a task cannot satisfy all completion criteria:

- do not mark it fully complete;
- record the missing criterion;
- record owner;
- record risk;
- record follow-up task;
- explicitly approve the exception if required.

Example:

    Task: ACCEPTED
    Exception: Physical safety review pending
    Impact: Software milestone complete; physical deployment blocked
    Follow-up: SAFETY-REVIEW-001

# 69. Physical Safety Exception

Physical safety is a special gate.

A software task may be accepted for continued software development while
physical deployment remains blocked.

This preserves the agreed principle:

    Safety Gate
         |
         +--> blocks physical deployment
         |
         +--> does not necessarily block unrelated software work

# 70. Documentation Completion Flow

The documentation workflow is:

    Implementation
        |
        v
    Identify Changed Behavior
        |
        v
    Identify Affected Docs
        |
        v
    Update Docs
        |
        v
    Review Docs
        |
        v
    Merge

Documentation should describe actual behavior, not intended future behavior.

# 71. Tracking Completion Flow

The tracking workflow is:

    Implementation
        |
        v
    Evidence
        |
        v
    Task Status
        |
        v
    Milestone Status
        |
        v
    Phase Status
        |
        v
    Project Status

Status updates should happen close to the actual transition.

# 72. Change Log

Significant user-visible or architectural changes should update:

    CHANGELOG.md

The changelog should distinguish:

- added;
- changed;
- fixed;
- security;
- deprecated;
- removed.

Internal implementation details need not all appear in the public-facing
changelog.

# 73. Architecture Decision Log

When a decision changes, update:

    docs/planning/DECISIONS.md

The change should include:

- context;
- decision;
- rationale;
- consequences;
- alternatives;
- migration;
- affected tasks.

# 74. Risk Register

Material risks should be recorded in:

    docs/tracking/RISK_REGISTER.md

A risk should contain:

- identifier;
- description;
- probability;
- impact;
- owner;
- mitigation;
- status;
- trigger.

# 75. Issue Log

Issues discovered during implementation that require follow-up should enter:

    docs/tracking/ISSUE_LOG.md

Not every code comment is an issue.

Issues represent work or risk requiring explicit tracking.

# 76. Change Tracking

Cross-cutting changes should be recorded in:

    docs/tracking/CHANGE_TRACKING.md

Examples:

- protocol migration;
- database migration;
- API deprecation;
- authentication change;
- platform capability change.

# 77. Milestone Review

At milestone completion:

    Tasks
      |
      v
    Acceptance
      |
      v
    Integration
      |
      v
    Review Checklist
      |
      v
    Milestone Evidence
      |
      v
    Status Update
      |
      v
    Close

The milestone review should verify actual integrated behavior.

# 78. Phase Gate

Each phase has:

- entry criteria;
- task scope;
- integration checkpoints;
- exit criteria.

Phase completion requires evidence across affected domains.

A phase must not be closed solely because its task count reaches zero.

# 79. Parallel Development

Parallel work is encouraged when dependencies permit.

Example:

    Contract
       |
       +----> Backend
       |
       +----> Studio
       |
       +----> Simulator
       |
       +----> Tests

The contract becomes the synchronization point.

# 80. Parallel Work Rules

Parallel tasks must have:

- explicit ownership;
- explicit dependency;
- stable contract;
- non-overlapping ownership where practical.

If two developers need the same unstable interface, contract design should be
completed before both implementations proceed.

# 81. Integration Branch Discipline

Integration should happen frequently enough to avoid long-lived divergence.

Long-lived branches require explicit justification.

The preferred pattern is:

    Small Branch
        |
        v
    CI
        |
        v
    Review
        |
        v
    Main
        |
        v
    Continuous Integration

# 82. Merge Conflict Policy

When conflicts occur:

1. identify semantic differences;
2. identify source-of-truth branch;
3. reconcile behavior;
4. rerun tests;
5. update documentation if behavior changed.

Do not resolve complex conflicts mechanically without understanding behavior.

# 83. Generated Files

Generated files must be classified.

If generated output is reproducible and not required in source control, do not
commit it.

If generated output is a release artifact or required source input, its
repository policy must be explicit.

# 84. Dependency Updates

Dependency updates are tasks when they materially affect:

- runtime;
- security;
- build;
- compatibility;
- licensing.

A dependency update should record:

- old version;
- new version;
- reason;
- test result;
- security impact.

# 85. Refactoring Workflow

Refactoring should preserve externally observable behavior unless the task
explicitly changes behavior.

Preferred:

    Refactor
       |
       v
    Existing Tests
       |
       v
    Refactor
       |
       v
    Same Contract
       |
       v
    CI

Large refactors should be split into reviewable increments.

# 86. Bug Fix Workflow

Bug workflow:

    Report
      |
      v
    Reproduce
      |
      v
    Root Cause
      |
      v
    Regression Test
      |
      v
    Fix
      |
      v
    Full Verification
      |
      v
    Review
      |
      v
    Close

A bug fix without a regression test requires explicit justification.

# 87. Security Bug Workflow

Security bugs follow:

    Discovery
       |
       v
    Containment
       |
       v
    Assessment
       |
       v
    Fix
       |
       v
    Verification
       |
       v
    Disclosure / Communication
       |
       v
    Tracking Closure

Do not disclose sensitive exploit details in ordinary public development
discussion before the security process permits it.

# 88. Physical Fault Workflow

Physical robot faults follow:

    Detection
       |
       v
    Safe State
       |
       v
    Local Diagnosis
       |
       v
    Lab Record
       |
       v
    Software/HW Analysis
       |
       v
    Validation
       |
       v
    Controlled Re-enable

Cloud availability must never override the local safe-state transition.

# 89. Release Preparation

When a task contributes to a release:

- identify release;
- verify acceptance;
- update changelog;
- update compatibility information;
- verify migration;
- verify rollback;
- verify documentation.

Release workflow is governed by:

    docs/planning/RELEASE_ROADMAP.md

# 90. Communication Before Merge

The author should communicate when:

- architecture changed;
- contract changed;
- migration changed;
- security behavior changed;
- compatibility changed;
- physical behavior changed.

Routine implementation details do not require broad communication.

# 91. Communication After Merge

After significant work is merged, update:

- task status;
- milestone status where applicable;
- changelog where applicable;
- decision log where applicable;
- issue/risk tracking where applicable.

# 92. Communication Format

Recommended update:

    Task: KR-ARTIFACT-P2-004
    Status: ACCEPTED
    Change: Artifact manifest validation implemented
    Tests: 31 passed
    CI: green
    Docs: updated
    Risks: none
    Next: dependent integration task

# 93. Review Evidence Package

A review package should allow the reviewer to answer:

1. What changed?
2. Why?
3. What contract changed?
4. What data changed?
5. What security implications exist?
6. What tests prove correctness?
7. What documentation changed?
8. What remains open?

# 94. Phase 0 Workflow Mapping

Phase 0 establishes:

- repository;
- architecture;
- development setup;
- contract model;
- tracking;
- decision process.

Development workflow emphasis:

    Requirement
       |
       v
    Architecture
       |
       v
    Contract
       |
       v
    Task

Exit criteria include a functioning development workflow and CI baseline.

# 95. Phase 1 Workflow Mapping

Phase 1 focuses on:

- backend;
- identity;
- organizations;
- projects;
- platforms;
- database.

Workflow emphasis:

- migration review;
- authorization review;
- contract testing;
- tenant isolation.

# 96. Phase 2 Workflow Mapping

Phase 2 focuses on:

- Studio;
- local build;
- artifact;
- upload.

Workflow emphasis:

- contract-first Studio/API work;
- source privacy;
- artifact validation;
- cross-platform build checks.

# 97. Phase 3 Workflow Mapping

Phase 3 focuses on:

- Lab Agent;
- simulation;
- Job;
- Run;
- Results.

Workflow emphasis:

- protocol-first development;
- simulator parity;
- E2E;
- failure injection;
- idempotency.

# 98. Phase 4 Workflow Mapping

Phase 4 focuses on:

- credits;
- booking;
- resources;
- commercial rules.

Workflow emphasis:

- database transaction review;
- financial correctness;
- concurrency testing;
- rate-card compatibility.

# 99. Phase 5 Workflow Mapping

Phase 5 focuses on:

- physical Lab Agent;
- physical resources;
- robot execution;
- safety.

Workflow emphasis:

- HIL;
- safety review;
- hardware validation;
- simulator-to-hardware comparison.

# 100. Phase 6 Workflow Mapping

Phase 6 focuses on:

- security;
- production readiness;
- tenant isolation;
- recovery.

Workflow emphasis:

- security gates;
- penetration/security testing;
- backup/restore;
- production-like CI.

# 101. Phase 7 Workflow Mapping

Phase 7 focuses on:

- scale;
- multiple resources;
- multiple labs;
- operations.

Workflow emphasis:

- capacity testing;
- operational readiness;
- observability;
- failure recovery.

# 102. Phase 8 Workflow Mapping

Phase 8 focuses on:

- production launch;
- release qualification;
- customer readiness.

Workflow emphasis:

- complete acceptance;
- security approval;
- safety approval;
- rollback;
- support readiness.

# 103. Development Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Tasks enter development too early | High | Definition of Ready |
| Contract drift | Critical | Contract-first review |
| Documentation drift | High | DoD documentation gate |
| Status drift | Medium | Evidence-based tracking |
| CI bypass | High | Branch protection |
| Architecture drift | Critical | ADR review |
| Long branches | Medium | Frequent integration |
| Simulator divergence | High | Contract/HIL testing |
| Security discovered late | Critical | Early security review |
| Database drift | High | Migration discipline |
| Hidden dependency | High | Dependency mapping |
| Review bottleneck | Medium | Clear reviewer ownership |
| Physical testing too early | Critical | Simulator-first |
| Flaky CI | High | Explicit flaky-test tracking |
| Unowned blockers | High | Blocker owner requirement |

# 104. Mitigation Strategy

The workflow addresses risk through:

    Clear Task
       |
       v
    Ready Gate
       |
       v
    Contract
       |
       v
    Implementation
       |
       v
    Automated Tests
       |
       v
    Review
       |
       v
    CI
       |
       v
    Acceptance
       |
       v
    Tracking

No single gate is sufficient by itself.

# 105. Open Questions

The following workflow details may be refined as the team grows:

1. Exact issue tracker integration.
2. Exact branch protection configuration.
3. Exact CODEOWNERS structure.
4. Exact CI runner matrix.
5. Exact automated documentation validation.
6. Exact release approval workflow.
7. Exact reviewer rotation.
8. Exact escalation SLA.
9. Exact incident communication channel.
10. Exact hardware-lab booking process for developers.
11. Exact implementation-agent handoff format.
12. Exact automated task-status synchronization.

These open questions do not change the core workflow.

# 106. Implementation-Agent Workflow

Where an implementation agent such as Codex or Claude is used, the same workflow
applies.

The agent receives:

- task;
- acceptance criteria;
- relevant architecture;
- contracts;
- dependencies;
- constraints.

The agent implements only within the approved scope.

The reviewer validates:

- architecture;
- correctness;
- tests;
- documentation;
- evidence.

An implementation agent must not silently change product-wide architecture.

# 107. Agent Handoff

Recommended handoff:

    Task ID
    Objective
    Scope
    Non-goals
    Relevant ADRs
    Files/areas
    Contract
    Acceptance Criteria
    Test Requirements
    Documentation Requirements
    Expected Evidence

This minimizes ambiguity between architecture and implementation.

# 108. Reviewer Workflow

The reviewer should begin with the task definition.

Then:

    Task
      |
      v
    Acceptance Criteria
      |
      v
    Contract
      |
      v
    Implementation
      |
      v
    Tests
      |
      v
    Docs
      |
      v
    CI
      |
      v
    Decision

The reviewer should not approve based solely on successful compilation.

# 109. Acceptance Evidence

Evidence should be concise but sufficient.

Examples:

    115/115 tests passed
    migration applied cleanly
    contract compatibility test passed
    simulator E2E passed
    artifact signature verified
    tenant isolation test passed
    CI green

For physical work:

    simulator qualification passed
    HIL qualification passed
    human safety review approved

# 110. Final Acceptance Criteria — Task Lifecycle

- [ ] Every significant task has an ID.
- [ ] Task status is explicit.
- [ ] Task owner is explicit.
- [ ] Scope is explicit.
- [ ] Non-goals are explicit.
- [ ] Dependencies are explicit.
- [ ] Acceptance criteria are explicit.
- [ ] Definition of Ready is satisfied.
- [ ] Definition of Done is satisfied.

# 111. Final Acceptance Criteria — Contract-First

- [ ] Cross-boundary changes identify affected contracts.
- [ ] Contract changes are reviewed before implementation.
- [ ] Producers are identified.
- [ ] Consumers are identified.
- [ ] Version compatibility is documented.
- [ ] Error semantics are defined.
- [ ] Idempotency semantics are defined where required.
- [ ] Contract tests exist.
- [ ] Breaking changes receive explicit approval.

# 112. Final Acceptance Criteria — Architecture

- [ ] Relevant ADRs are identified.
- [ ] Implementation conforms to accepted decisions.
- [ ] Architecture deviations are documented.
- [ ] New architectural decisions are recorded.
- [ ] No system boundary is introduced silently.
- [ ] Data ownership is explicit.
- [ ] Security boundary is explicit.
- [ ] Physical safety boundary is explicit.

# 113. Final Acceptance Criteria — Documentation

- [ ] Required architecture docs are updated.
- [ ] Contract docs are updated.
- [ ] Database docs are updated.
- [ ] Security docs are updated.
- [ ] Development docs are updated.
- [ ] User-visible behavior is documented.
- [ ] Changelog is updated where applicable.
- [ ] No materially incorrect documentation remains.

# 114. Final Acceptance Criteria — Tracking

- [ ] Task status is current.
- [ ] Milestone status is current.
- [ ] Phase status is current where applicable.
- [ ] Risks are updated.
- [ ] Issues are updated.
- [ ] Dependencies are updated.
- [ ] Decisions are updated.
- [ ] Evidence is recorded.
- [ ] Follow-up tasks are created where necessary.

# 115. Final Acceptance Criteria — Review

- [ ] Author review checklist is complete.
- [ ] Required reviewer is assigned.
- [ ] Architecture review completed where required.
- [ ] Security review completed where required.
- [ ] Database review completed where required.
- [ ] Safety review completed where required.
- [ ] Blocking comments are resolved.
- [ ] Non-blocking follow-ups are tracked.

# 116. Final Acceptance Criteria — CI

- [ ] Formatting passes.
- [ ] Lint passes.
- [ ] Typecheck passes.
- [ ] Unit tests pass.
- [ ] Integration tests pass where applicable.
- [ ] E2E tests pass where applicable.
- [ ] Build passes.
- [ ] Migration checks pass where applicable.
- [ ] Security checks pass where applicable.
- [ ] Artifact checks pass where applicable.

# 117. Final Acceptance Criteria — Integration

- [ ] Code is integrated into the target branch.
- [ ] Dependent tasks are notified.
- [ ] Integration tests pass.
- [ ] Contract consumers remain compatible.
- [ ] Tracking reflects integration.
- [ ] Documentation reflects integrated behavior.

# 118. Final Acceptance Criteria — Simulation

- [ ] New execution behavior is tested in simulation where applicable.
- [ ] Simulator implements the required contract.
- [ ] Failure cases are exercised.
- [ ] Cancellation is exercised.
- [ ] Timeout is exercised.
- [ ] Result generation is exercised.
- [ ] Simulator evidence is recorded.

# 119. Final Acceptance Criteria — Physical Robotics

- [ ] Software qualification is complete before hardware testing.
- [ ] HIL testing is complete where required.
- [ ] Safety review is complete.
- [ ] Local safety remains authoritative.
- [ ] Physical deployment is explicitly approved.
- [ ] Hardware faults are handled.
- [ ] Cloud failure cannot create unsafe motion.

# 120. Final Acceptance Criteria — Communication

- [ ] Significant changes were communicated.
- [ ] Blockers were communicated promptly.
- [ ] Dependencies were communicated.
- [ ] Review status was communicated.
- [ ] Final status was communicated.
- [ ] Release impact was communicated where applicable.

# 121. Final Acceptance Criteria — Onboarding

A new contributor should be able to:

- [ ] find the repository structure;
- [ ] find architecture decisions;
- [ ] find the active phase;
- [ ] find the active milestone;
- [ ] find a task;
- [ ] understand Definition of Ready;
- [ ] understand Definition of Done;
- [ ] create a branch;
- [ ] implement a task;
- [ ] run tests;
- [ ] update documentation;
- [ ] update tracking;
- [ ] open a review;
- [ ] interpret CI;
- [ ] complete a simulated E2E workflow.

# 122. Final Development Invariants

The following invariants apply to repository-wide development:

1. No implementation begins without sufficient task definition.
2. No cross-boundary change bypasses contract review.
3. No architectural change bypasses ADR review.
4. No database change bypasses migration discipline.
5. No critical security change bypasses security review.
6. No physical safety change bypasses human safety review.
7. Documentation is part of completion.
8. Tracking is part of completion.
9. Tests are part of completion.
10. CI is part of completion.
11. Evidence is part of completion.
12. Code merged is not automatically code done.
13. Simulation is preferred before physical robotics.
14. Customer source remains within the local development boundary.
15. The `.krv` artifact remains the remote execution boundary.
16. PostgreSQL remains authoritative for structured business state.
17. Job and Run remain distinct.
18. Platform, Resource and Robot remain distinct.
19. Platform-specific credit semantics remain explicit.
20. Local safety remains authoritative for physical operation.

# 123. Final Development Workflow

The complete repository workflow is:

    Product Goal
        |
        v
    Phase / Milestone
        |
        v
    Task
        |
        v
    Refinement
        |
        v
    Definition of Ready
        |
        v
    Architecture / ADR Check
        |
        v
    Contract Design
        |
        v
    Implementation
        |
        +------> Documentation
        |
        +------> Tests
        |
        +------> Tracking
        |
        v
    Review
        |
        v
    CI
        |
        v
    Acceptance
        |
        v
    Integration
        |
        v
    Milestone Evidence
        |
        v
    Release

# 124. Final Principle

> Kritva RaaS development shall operate as an evidence-driven, contract-first
> engineering process in which every meaningful change begins with a clearly
> defined task, proceeds through explicit architecture and interface
> decisions, is implemented within bounded scope, and is completed only after
> tests, documentation, review, CI and tracking agree on the resulting state.
> Cross-boundary behavior is designed before dependent implementation;
> database, security and physical-safety implications are reviewed at the
> appropriate gates; simulation is used before physical robotics; and project
> communication reflects actual engineering state rather than optimistic
> status. The workflow exists to ensure that the growing RaaS monorepo remains
> understandable, reviewable, secure and integrable from Phase 0 foundation
> through Phase 8 production launch.
