# Kritva RaaS Code Review Process

## 1. Purpose

This document defines the production-grade code review process for Kritva RaaS.

The objective is to ensure that every significant change entering the
repository is:

- correct;
- secure;
- architecturally consistent;
- contract-compatible;
- adequately tested;
- documented;
- maintainable;
- observable;
- performant where required;
- traceable to an approved task.

Code review is an engineering control, not merely a style or approval step.

The review process applies equally to work performed by:

- human developers;
- implementation agents;
- automated tooling;
- external contributors where permitted.

The reviewer remains responsible for independently evaluating the submitted
change.

## 2. Scope

This document covers review of:

- application code;
- Studio code;
- Rust/Tauri code;
- backend code;
- shared packages;
- protocol contracts;
- database migrations;
- cloud/infrastructure code;
- tests;
- security changes;
- documentation changes;
- Lab Agent code;
- simulator code;
- physical-robot integration code;
- release-related changes.

It defines:

- reviewer responsibilities;
- author responsibilities;
- review stages;
- approval rules;
- checklists;
- automation;
- review SLAs;
- disagreement handling;
- architecture escalation;
- security review;
- safety review;
- performance review;
- review evidence;
- review completion.

It does not replace:

- `DECISIONS.md`;
- `DEVELOPMENT_WORKFLOW.md`;
- `BRANCHING_STRATEGY.md`;
- security architecture;
- database architecture;
- release roadmap;
- integration plan.

## 3. Goals

The review process shall:

1. detect defects before integration;
2. validate implementation against requirements;
3. preserve architectural decisions;
4. detect contract incompatibilities;
5. protect customer source-code privacy;
6. protect tenant isolation;
7. protect artifact integrity;
8. protect physical safety;
9. verify meaningful tests;
10. prevent documentation drift;
11. identify performance regressions;
12. provide independent engineering judgment;
13. make approval criteria explicit;
14. keep review turnaround predictable;
15. preserve an auditable decision trail.

## 4. Non-Goals

Code review is not intended to:

- replace automated tests;
- replace CI;
- replace architecture design;
- replace security testing;
- replace safety certification;
- rewrite code for the author;
- enforce personal coding preferences;
- require reviewers to inspect every line equally;
- prevent reasonable implementation autonomy.

## 5. Review Principles

Kritva RaaS code review follows these principles:

1. Review requirements before implementation details.
2. Review architecture before code style.
3. Review contracts before consumers.
4. Review security at the boundary.
5. Review tests as evidence, not decoration.
6. Review documentation as part of completion.
7. Prefer objective standards over personal preference.
8. Blocking comments must identify a real defect or risk.
9. Non-blocking suggestions must be clearly marked.
10. Review disagreements must be resolved through evidence.
11. Safety-critical decisions receive explicit human review.
12. CI is mandatory but does not replace human judgment.
13. Large changes should be decomposed.
14. Reviewers should review within defined service levels.
15. Approval means responsibility for the reviewed scope.

# 6. Review Lifecycle

The standard review lifecycle is:

    Task Ready
        |
        v
    Implementation
        |
        v
    Self Review
        |
        v
    Pull Request
        |
        v
    Automated Checks
        |
        v
    Human Review
        |
        +----> Changes Requested
        |           |
        |           v
        |        Revision
        |           |
        |           +------> Human Review
        |
        v
    Approval
        |
        v
    Merge
        |
        v
    Integration Verification

# 7. Review Roles

| Role | Responsibility |
|---|---|
| Author | Implementation and evidence |
| Primary Reviewer | Overall technical review |
| Domain Reviewer | Domain-specific correctness |
| Security Reviewer | Security-sensitive changes |
| Database Reviewer | Schema/migration changes |
| Architecture Reviewer | Architecture changes |
| Safety Reviewer | Physical/safety changes |
| Release Reviewer | Release-impacting changes |
| Maintainer | Final repository ownership |

Not every PR requires every role.

# 8. Author Responsibilities

The author must:

- understand the task;
- implement within scope;
- update required contracts;
- add tests;
- update documentation;
- run local verification;
- inspect the final diff;
- identify risks;
- identify migration impact;
- identify security impact;
- identify performance impact;
- identify compatibility impact;
- provide review evidence.

The author must not expect the reviewer to discover basic omissions.

# 9. Reviewer Responsibilities

The reviewer must independently assess:

- correctness;
- scope;
- architecture;
- contracts;
- data;
- security;
- testing;
- documentation;
- performance;
- operational impact.

The reviewer should distinguish:

- defects;
- risks;
- required changes;
- recommendations;
- optional improvements.

# 10. Primary Reviewer

The primary reviewer owns the overall review.

Responsibilities include:

- verifying task scope;
- reviewing architecture;
- reviewing implementation;
- checking acceptance criteria;
- confirming CI status;
- confirming required specialist reviews;
- deciding whether the PR is ready for merge.

The primary reviewer does not need to be the deepest expert in every affected
domain but must ensure that specialist review is obtained when required.

# 11. Domain Reviewer

A domain reviewer is required when a change materially affects a specialized
area.

Examples:

| Area | Domain Reviewer |
|---|---|
| Booking | Booking owner |
| Credits | Credit/domain owner |
| Artifact | Artifact/security owner |
| Database | Database owner |
| Studio | Studio owner |
| Lab | Robotics/Lab owner |
| Protocol | Protocol owner |
| Security | Security reviewer |

# 12. Architecture Reviewer

Architecture review is required when a PR:

- changes a product-wide decision;
- introduces a system boundary;
- changes domain ownership;
- changes data authority;
- changes protocol semantics;
- changes execution architecture;
- changes safety boundaries;
- changes cloud topology materially.

Relevant decisions are recorded in:

    planning/DECISIONS.md

An implementation must not silently override an accepted ADR.

# 13. Security Reviewer

Security review is required for:

- authentication;
- authorization;
- tenant isolation;
- secrets;
- key management;
- source-code privacy;
- artifact signing;
- public APIs;
- privileged operations;
- Lab Agent identity;
- security policy;
- sensitive data handling.

# 14. Database Reviewer

Database review is required for:

- schema changes;
- migrations;
- constraints;
- indexes;
- transaction changes;
- retention changes;
- tenant relationships;
- financial state;
- booking allocation;
- execution state.

# 15. Safety Reviewer

Human safety review is mandatory for changes involving:

- physical robot motion;
- motor control;
- emergency stop;
- safety interlocks;
- enable/disable behavior;
- recovery from unsafe state;
- physical deployment behavior.

Software approval does not constitute physical safety approval.

# 16. Review Independence

The author should not approve their own PR.

Where practical, the reviewer should not be the sole designer and implementer
of a high-risk architecture change.

For critical changes, independent review should be used.

# 17. Review Eligibility

A reviewer should have sufficient knowledge of the affected area.

Reviewers should not approve changes they cannot reasonably evaluate.

If expertise is missing:

    Primary Reviewer
         |
         v
    Identify Gap
         |
         v
    Request Specialist
         |
         v
    Continue Review

# 18. Pull Request Entry Criteria

A PR is ready for formal review when:

- task is READY/IN_PROGRESS;
- implementation is complete for the stated scope;
- acceptance criteria are addressed;
- tests are present;
- documentation is updated;
- self-review is complete;
- CI has started or completed as required;
- known limitations are documented.

A PR should not be submitted merely to reserve reviewer attention.

# 19. Author Self-Review

Before requesting review, the author should inspect:

    git diff
    git status

The author should verify:

- no accidental files;
- no secrets;
- no debug code;
- no unrelated changes;
- correct migration;
- correct tests;
- correct documentation;
- correct task reference.

# 20. Review Order

The recommended review order is:

    1. Task
    2. Scope
    3. Acceptance Criteria
    4. Architecture
    5. Contracts
    6. Data
    7. Security
    8. Implementation
    9. Tests
    10. Performance
    11. Documentation
    12. CI
    13. Final Decision

This prevents reviewers from spending significant time on implementation
details before discovering a fundamental design problem.

# 21. Correctness Review

The reviewer must determine whether the implementation actually solves the
stated problem.

Questions:

- Does the implementation satisfy the task?
- Does it satisfy every acceptance criterion?
- Are normal cases correct?
- Are error cases correct?
- Are state transitions valid?
- Are edge cases handled?
- Are invalid inputs rejected?
- Are retries safe?
- Are concurrent operations safe?
- Is behavior deterministic where required?

# 22. Scope Review

The reviewer should verify:

- requested functionality is present;
- non-goals remain unchanged;
- unrelated functionality has not been modified;
- accidental refactoring is absent;
- unnecessary dependencies were not introduced.

A broader change requires explicit justification.

# 23. State Machine Review

Stateful domains require explicit state review.

Examples:

    Booking
    Job
    Run
    Result
    Artifact
    Resource
    Credit Reservation

The reviewer should verify:

- valid states;
- valid transitions;
- terminal states;
- retry behavior;
- cancellation behavior;
- timeout behavior;
- reconciliation behavior.

# 24. Concurrency Review

Concurrency-sensitive changes must consider:

- duplicate requests;
- race conditions;
- transaction isolation;
- locks;
- optimistic concurrency;
- unique constraints;
- idempotency;
- retry behavior.

Critical examples:

- booking overlap;
- credit reservation;
- job creation;
- artifact upload;
- result generation.

# 25. Contract Review

For a boundary change, reviewers must verify:

- contract definition;
- request schema;
- response schema;
- error semantics;
- event semantics;
- version;
- authentication;
- authorization;
- idempotency;
- timeout;
- retry behavior;
- backward compatibility.

The question is:

> Can every known consumer continue to behave correctly?

# 26. Protocol Review

Protocol changes must be reviewed against:

- producer;
- consumer;
- simulator;
- Lab Agent;
- runtime;
- contract tests.

Preferred flow:

    Contract
       |
       +--> Producer
       |
       +--> Consumer
       |
       +--> Simulator
       |
       +--> Contract Tests

# 27. API Review

API reviewers should inspect:

- resource naming;
- HTTP semantics;
- status codes;
- request validation;
- response consistency;
- error model;
- pagination;
- authorization;
- idempotency;
- versioning.

Avoid leaking internal database structures directly into public APIs.

# 28. Database Review

Reviewers should verify:

- correct domain owner;
- normalized model where appropriate;
- constraints;
- indexes;
- foreign keys;
- tenant boundary;
- transaction boundary;
- migration ordering;
- compatibility;
- rollback strategy;
- retention implications.

# 29. Migration Review

Every migration should be checked for:

- clean-database execution;
- upgrade from current schema;
- compatibility with deployed application;
- data preservation;
- lock duration;
- backfill size;
- rollback strategy;
- expand-contract requirements.

Destructive changes require explicit review.

# 30. Tenant Isolation Review

Tenant-sensitive changes must verify:

    Request
       |
       v
    Principal
       |
       v
    Organization
       |
       v
    Resource Ownership
       |
       v
    Repository Filter
       |
       v
    Database Constraint / RLS
       |
       v
    Data

Reviewers should actively search for missing tenant filters.

# 31. Security Review

Security review should consider:

- authentication;
- authorization;
- input validation;
- output encoding;
- secrets;
- cryptography;
- session management;
- token handling;
- logging;
- audit;
- tenant isolation;
- artifact trust;
- dependency security.

# 32. Source-Code Privacy Review

Changes involving Studio, build, upload or artifacts must verify:

- source remains local;
- package contents are controlled;
- source is not uploaded accidentally;
- logs do not expose source;
- temporary files are handled safely;
- object storage does not contain source unexpectedly.

The expected boundary is:

    Source
       |
       v
    Local Build
       |
       v
    .krv Artifact
       |
       v
    Remote Environment

# 33. Artifact Security Review

Reviewers should verify:

- manifest;
- checksum;
- signature;
- signing trust;
- compatibility;
- capabilities;
- prohibited content;
- provenance;
- revocation behavior.

The Lab Agent must not trust artifact metadata supplied solely by an
untrusted client.

# 34. Authentication Review

Authentication changes require review of:

- identity lifecycle;
- token issuance;
- token expiry;
- refresh;
- revocation;
- MFA;
- session handling;
- service identity;
- Lab Agent identity;
- credential storage.

# 35. Authorization Review

Authorization review must answer:

- Who can perform the operation?
- On which organization?
- On which project?
- On which resource?
- Under what operational conditions?
- What happens when authorization fails?

Deny-by-default remains the standard.

# 36. Secrets Review

Reviewers must ensure:

- secrets are not committed;
- secrets are not logged;
- secrets are not embedded in artifacts;
- frontend code cannot access backend secrets;
- development credentials remain isolated;
- key rotation is not accidentally bypassed.

# 37. Audit Review

Security-sensitive or business-critical operations should generate appropriate
audit evidence.

Reviewers should verify:

- actor;
- action;
- resource;
- organization;
- timestamp;
- outcome;
- correlation;
- relevant metadata.

# 38. Test Review

Tests must demonstrate behavior.

Reviewers should ask:

- Does the test fail when the bug is reintroduced?
- Does the test cover the acceptance criterion?
- Are failure paths tested?
- Are authorization boundaries tested?
- Are concurrency cases tested?
- Are retries tested?
- Are migrations tested?
- Are simulator behaviors tested?

# 39. Test Coverage Principle

Coverage percentage alone is not sufficient.

A small number of high-value tests may be more useful than broad superficial
coverage.

The target is meaningful behavioral coverage.

# 40. Unit Test Review

Check:

- isolation;
- deterministic behavior;
- edge cases;
- invalid inputs;
- state transitions;
- error handling.

Avoid excessive mocking that prevents the test from validating real behavior.

# 41. Integration Test Review

Check:

- real persistence behavior;
- real transaction behavior;
- protocol boundaries;
- object storage interaction;
- queue behavior;
- authorization;
- migration behavior.

# 42. E2E Review

The primary RaaS workflow should remain testable:

    Login
      |
      v
    Project
      |
      v
    Platform
      |
      v
    Local Build
      |
      v
    Artifact
      |
      v
    Booking
      |
      v
    Job
      |
      v
    Simulated Run
      |
      v
    Result

Changes affecting this workflow should consider E2E impact.

# 43. Simulator Review

Simulator changes must preserve contract compatibility.

Reviewers should verify:

- valid execution;
- invalid artifact behavior;
- timeout;
- cancellation;
- telemetry;
- logs;
- failures;
- resource states.

# 44. Physical Robotics Review

Physical integration review must consider:

- local authority;
- communication loss;
- safe state;
- emergency stop;
- startup;
- shutdown;
- fault handling;
- cloud outage.

The invariant remains:

> Cloud failure must not create unsafe robot motion.

# 45. Performance Review

Performance review is required when a change may materially affect:

- API latency;
- database queries;
- booking allocation;
- credit transactions;
- artifact upload;
- job scheduling;
- telemetry;
- video;
- Studio responsiveness;
- startup;
- build time.

# 46. Performance Review Questions

Reviewers should ask:

- Does query complexity scale reasonably?
- Are indexes appropriate?
- Is there an N+1 pattern?
- Are transactions unnecessarily long?
- Is data copied unnecessarily?
- Is memory usage bounded?
- Is an asynchronous operation more appropriate?
- Is high-frequency telemetry using the correct transport?

# 47. Resource and Capacity Review

Changes affecting scale should identify:

- expected request rate;
- database load;
- storage growth;
- queue load;
- memory;
- CPU;
- network;
- concurrency.

Measured evidence is preferred over assumptions.

# 48. Error Handling Review

Reviewers should verify:

- errors are explicit;
- errors are actionable;
- sensitive information is not exposed;
- transient errors can be retried;
- permanent errors are not blindly retried;
- state is not corrupted on failure.

# 49. Retry Review

Retries require special care.

Safe pattern:

    Request
       |
       v
    Idempotency Check
       |
       v
    Operation
       |
       v
    Persist Result
       |
       v
    Return

Physical commands must not be retried blindly.

# 50. Observability Review

A significant change should provide sufficient observability.

Check:

- structured logs;
- request ID;
- trace/correlation ID;
- error code;
- metrics where appropriate;
- state transition visibility.

Observability must not expose secrets or sensitive source.

# 51. Documentation Review

Reviewers must check whether the change affects:

- architecture;
- API;
- protocol;
- database;
- security;
- setup;
- operations;
- release behavior;
- user workflow.

Required documentation must be updated before approval.

# 52. Decision Record Review

If an implementation changes an accepted architecture decision, reviewers
must stop normal approval and request ADR review.

The flow is:

    PR
      |
      v
    Architecture Conflict
      |
      v
    ADR Review
      |
      +--> Keep Existing Decision
      |
      +--> Supersede Decision
      |
      v
    Continue PR Review

# 53. Review Comment Classification

Comments should be classified as:

| Classification | Meaning |
|---|---|
| BLOCKER | Must change before merge |
| REQUIRED | Must resolve before approval |
| QUESTION | Clarification needed |
| SUGGESTION | Recommended but optional |
| NIT | Minor preference |
| PRAISE | Positive observation |

Only real defects or risks should block a PR.

# 54. Blocking Comment Standard

A blocking comment should identify:

1. what is wrong;
2. why it matters;
3. expected behavior;
4. evidence or rationale;
5. suggested direction where useful.

Poor:

    This looks wrong.

Better:

    This allocation query does not include organization_id. A project ID
    obtained from another tenant could therefore retrieve the resource.
    Please enforce the tenant boundary at the repository query and add a
    cross-tenant regression test.

# 55. Review Comment Tone

Review should be:

- technical;
- respectful;
- specific;
- evidence-based.

Avoid:

- personal criticism;
- sarcasm;
- assumptions about intent;
- unnecessary absolutism.

# 56. Reviewer Response to Disagreement

When the author disagrees:

    Comment
       |
       v
    Author Explanation
       |
       v
    Evidence / Test / Design Reference
       |
       v
    Reviewer Reassessment
       |
       +--> Accept
       |
       +--> Escalate
       |
       v
    Decision

The objective is correct engineering, not reviewer authority.

# 57. Architecture Disagreement

Architecture disagreements should reference:

- ADR;
- requirements;
- constraints;
- measured evidence;
- operational impact.

If unresolved:

    Author + Reviewer
           |
           v
    Architecture Owner
           |
           v
       ADR Decision

The result should be recorded.

# 58. Security Disagreement

Security reviewers have authority to block a security-sensitive change when a
credible unresolved risk exists.

Disagreements should be escalated to the security owner rather than resolved
through informal pressure.

# 59. Safety Disagreement

For physical robotics:

> Safety concerns are blocking until explicitly resolved by the appropriate
> human safety authority.

No software schedule should override an unresolved physical safety concern.

# 60. Review SLA

The repository should use practical review service levels.

Recommended targets:

| Review Type | Initial Response |
|---|---:|
| Normal PR | 1 business day |
| PRI-0/PRI-1 milestone PR | Same business day |
| Security-critical | 4 business hours where practical |
| Release-blocking | 4 business hours |
| Production hotfix | 1 hour where practical |
| Safety-critical | Same business day or explicitly escalated |

These are response targets, not guarantees.

# 61. Review Completion SLA

Once a reviewer starts a review, the reviewer should complete it or provide
actionable feedback within:

- one business day for normal changes;
- same business day for milestone blockers;
- four business hours for release blockers where practical.

If the reviewer cannot meet the SLA, ownership should be reassigned or the
delay communicated.

# 62. Review Queue Management

A PR waiting for review should have visible ownership.

If a PR remains unreviewed beyond its target:

    Author
       |
       v
    Reviewer Reminder
       |
       v
    Maintainer Escalation
       |
       v
    Reviewer Reassignment

Do not bypass required review merely to improve a dashboard metric.

# 63. Large PR Policy

If a PR is too large to review effectively, the reviewer may request
decomposition.

Preferred decomposition:

    Contract
       |
       v
    Data Layer
       |
       v
    Backend
       |
       v
    Studio
       |
       v
    E2E

The decomposition should preserve a coherent incremental path.

# 64. Generated Code Review

Generated code may not require line-by-line manual review if:

- generator is trusted;
- generator input is reviewed;
- generated output is validated;
- reproducibility is verified.

The reviewer remains responsible for generated behavior.

# 65. Dependency Review

New dependencies require review for:

- necessity;
- security;
- license;
- maintenance;
- size;
- runtime impact;
- compatibility.

A dependency should not be added merely to solve a small problem already
covered by existing project infrastructure.

# 66. Configuration Review

Configuration changes must be reviewed for:

- environment scope;
- defaults;
- security;
- compatibility;
- migration;
- local behavior;
- production behavior.

Unsafe defaults are blocking.

# 67. Logging Review

Reviewers should verify that logs:

- contain useful context;
- do not contain passwords;
- do not contain tokens;
- do not expose signing keys;
- do not expose source unnecessarily;
- preserve correlation.

# 68. Object Storage Review

Changes involving object storage should verify:

- authorization;
- tenant ownership;
- object naming;
- checksum;
- retention;
- lifecycle;
- download authorization;
- signed URL expiration where used.

# 69. Queue Review

Queue changes should verify:

- durable business state remains authoritative;
- duplicate delivery is safe;
- worker retries are safe;
- dead-letter behavior exists where needed;
- idempotency exists;
- reconciliation exists for critical operations.

# 70. Credit Review

Credit changes require particular scrutiny.

Verify:

- platform-specific credit type;
- rate-card selection;
- effective dates;
- reservation;
- consumption;
- refund;
- ledger;
- concurrency;
- audit.

The principle remains:

> Subscription determines access; robotic platform determines credit type;
> resource configuration and duration determine consumption.

# 71. Booking Review

Booking changes must verify:

- tenant;
- project;
- platform;
- platform version;
- configuration;
- resource;
- time range;
- overlap;
- credit reservation;
- cancellation;
- concurrency.

Resource overlap must be prevented transactionally.

# 72. Job and Run Review

Reviewers must preserve the distinction:

    Booking
       |
       v
      Job
       |
       v
      Run
       |
       v
    Result

Job represents orchestration.

Run represents historical execution.

A rerun should produce a new Run rather than overwrite history.

# 73. Result Review

Result changes should verify:

- ownership;
- Run relationship;
- lifecycle;
- file metadata;
- checksum;
- retention;
- download authorization;
- reproducibility.

# 74. Release Review

Release-impacting PRs should identify:

- release version;
- compatibility;
- migration;
- protocol;
- artifact format;
- rollback;
- documentation;
- security impact.

# 75. Hotfix Review

Hotfix reviews may be expedited but must verify:

- root cause;
- minimal scope;
- regression test;
- security impact;
- compatibility;
- rollback;
- merge-back.

# 76. Automation

Automation should perform mechanical checks.

Recommended automation includes:

- formatting;
- lint;
- type checking;
- unit tests;
- integration tests;
- E2E;
- dependency scanning;
- secret scanning;
- static analysis;
- migration validation;
- contract validation;
- artifact scanning.

Automation should reduce reviewer workload rather than replace engineering
judgment.

# 77. Required Automation Principle

A reviewer should not manually check something that can be reliably and
cheaply enforced automatically.

Examples:

    Formatting       -> Formatter
    Secret scanning  -> Secret Scanner
    Type correctness -> Typecheck
    Build            -> CI
    Schema validation-> Contract CI

Human review focuses on reasoning and risk.

# 78. Review Automation Failures

If automation is unavailable:

- do not silently bypass required security or release gates;
- document the failure;
- determine whether an alternative validation exists;
- escalate when required.

Temporary CI outages should not become permanent manual exceptions.

# 79. Review Evidence

A completed review should have evidence including:

- PR;
- CI status;
- approvals;
- review comments;
- test results;
- relevant specialist approvals;
- acceptance evidence.

The evidence should remain recoverable after merge.

# 80. Review and Tracking Integration

After approval and merge:

    PR
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
    Release Tracking

Review completion must be reflected in project tracking.

# 81. Review and Documentation Integration

The reviewer should verify that documentation updates correspond to actual
behavior.

Documentation must not describe intended future behavior as if it were
implemented.

# 82. Review and Branching Strategy

Code review follows:

    Task Branch
        |
        v
    PR
        |
        v
    CI
        |
        v
    Review
        |
        v
    Squash Merge
        |
        v
    main

The repository uses trunk-based development.

Long-lived feature branches should not be used as a substitute for review.

# 83. Review and Versioning

The reviewer should identify whether the change affects:

- product version;
- protocol version;
- database migration;
- artifact format;
- component compatibility.

Version impact should be recorded before release.

# 84. Review and Simulator-First Development

For execution changes:

    Implementation
        |
        v
    Unit
        |
        v
    Integration
        |
        v
    Simulator
        |
        v
    HIL
        |
        v
    Physical

A physical robot should not be the first place where a new execution behavior
is validated.

# 85. Review of Tauri/Rust Changes

Reviewers should inspect:

- IPC boundaries;
- command authorization;
- filesystem access;
- process execution;
- credential storage;
- path validation;
- privilege boundaries;
- error handling;
- platform-specific behavior.

Unrestricted shell or filesystem access from the UI should be treated as a
security concern.

# 86. Review of Backend Changes

Backend review should inspect:

- domain boundaries;
- application services;
- repository ownership;
- transactions;
- authorization;
- validation;
- error handling;
- persistence;
- asynchronous processing.

Business logic should not leak indiscriminately into transport handlers.

# 87. Review of Shared Packages

Shared package changes require extra care because the blast radius may be large.

Reviewers should identify:

- all consumers;
- API changes;
- type changes;
- runtime changes;
- version impact;
- compatibility.

# 88. Review of Cloud Changes

Cloud changes should be reviewed for:

- least privilege;
- environment isolation;
- secret handling;
- network exposure;
- failure behavior;
- cost;
- provider coupling;
- rollback.

# 89. Review of Physical Lab Changes

Physical lab changes should additionally verify:

- Lab Agent identity;
- runtime compatibility;
- robot identity;
- resource allocation;
- safety state;
- local authority;
- communication loss;
- fault recovery.

# 90. Review Checklist — Correctness

- [ ] Task requirement is satisfied.
- [ ] Acceptance criteria are satisfied.
- [ ] Scope is correct.
- [ ] Non-goals remain intact.
- [ ] Normal path works.
- [ ] Error paths work.
- [ ] Edge cases are handled.
- [ ] State transitions are valid.
- [ ] Concurrency behavior is correct.
- [ ] Retry behavior is correct.
- [ ] Idempotency is correct.
- [ ] Historical state is preserved where required.

# 91. Review Checklist — Contracts

- [ ] Contract impact identified.
- [ ] Request schema reviewed.
- [ ] Response schema reviewed.
- [ ] Error model reviewed.
- [ ] Event model reviewed.
- [ ] Versioning reviewed.
- [ ] Compatibility reviewed.
- [ ] Producer impact reviewed.
- [ ] Consumer impact reviewed.
- [ ] Simulator impact reviewed.
- [ ] Contract tests exist.

# 92. Review Checklist — Security

- [ ] Authentication reviewed.
- [ ] Authorization reviewed.
- [ ] Tenant isolation reviewed.
- [ ] Secrets reviewed.
- [ ] Key handling reviewed.
- [ ] Input validation reviewed.
- [ ] Sensitive output reviewed.
- [ ] Logging reviewed.
- [ ] Audit behavior reviewed.
- [ ] Source privacy reviewed.
- [ ] Artifact security reviewed.
- [ ] Security reviewer involved where required.

# 93. Review Checklist — Database

- [ ] Domain ownership correct.
- [ ] Migration included.
- [ ] Constraints reviewed.
- [ ] Indexes reviewed.
- [ ] Foreign keys reviewed.
- [ ] Tenant ownership reviewed.
- [ ] Transaction boundary reviewed.
- [ ] Concurrency reviewed.
- [ ] Migration compatibility tested.
- [ ] Retention impact reviewed.

# 94. Review Checklist — Tests

- [ ] Unit tests present where applicable.
- [ ] Integration tests present where applicable.
- [ ] E2E tests present where applicable.
- [ ] Regression test exists for bug fixes.
- [ ] Negative paths are tested.
- [ ] Authorization tests exist where relevant.
- [ ] Concurrency tests exist where relevant.
- [ ] Simulator tests exist where relevant.
- [ ] Physical tests exist where required.
- [ ] Tests actually validate acceptance criteria.

# 95. Review Checklist — Documentation

- [ ] Task documentation updated.
- [ ] Architecture documentation updated.
- [ ] Contract documentation updated.
- [ ] Database documentation updated.
- [ ] Security documentation updated.
- [ ] Development documentation updated.
- [ ] Changelog updated where applicable.
- [ ] ADR updated where required.
- [ ] User-facing behavior documented where applicable.

# 96. Review Checklist — Performance

- [ ] Query performance considered.
- [ ] Index usage considered.
- [ ] Transaction duration considered.
- [ ] Memory impact considered.
- [ ] CPU impact considered.
- [ ] Network impact considered.
- [ ] API latency considered.
- [ ] Storage growth considered.
- [ ] Queue load considered.
- [ ] High-frequency telemetry path considered.

# 97. Review Checklist — Maintainability

- [ ] Code is understandable.
- [ ] Names are meaningful.
- [ ] Interfaces are bounded.
- [ ] Domain ownership is clear.
- [ ] Duplication is reasonable.
- [ ] Error handling is consistent.
- [ ] Complexity is justified.
- [ ] No unnecessary abstraction is introduced.
- [ ] No hidden dependency exists.
- [ ] Future extension path is reasonable.

# 98. Review Checklist — Operations

- [ ] Logs are sufficient.
- [ ] Metrics are sufficient where needed.
- [ ] Failure modes are understood.
- [ ] Recovery behavior is understood.
- [ ] Timeouts are appropriate.
- [ ] Retries are safe.
- [ ] Reconciliation exists where required.
- [ ] Configuration is documented.
- [ ] Rollback is considered.

# 99. Review Checklist — Safety

- [ ] Physical impact identified.
- [ ] Local safety remains authoritative.
- [ ] Emergency stop is not bypassed.
- [ ] Communication loss is safe.
- [ ] Fault state is safe.
- [ ] Startup behavior is safe.
- [ ] Shutdown behavior is safe.
- [ ] Simulator validation completed.
- [ ] HIL validation completed where required.
- [ ] Human safety approval completed.

# 100. Review Checklist — Final Approval

- [ ] All blocking comments resolved.
- [ ] Required specialist reviews complete.
- [ ] CI green.
- [ ] Acceptance criteria satisfied.
- [ ] Documentation complete.
- [ ] Tracking complete.
- [ ] No unresolved architecture conflict.
- [ ] No unresolved security blocker.
- [ ] No unresolved safety blocker.
- [ ] Merge is appropriate.

# 101. Phase 0 Review Mapping

Phase 0 reviews focus on:

- architecture;
- repository;
- contracts;
- development setup;
- security baseline;
- branching;
- CI.

Reviewers must prioritize architectural consistency over implementation detail.

# 102. Phase 1 Review Mapping

Phase 1 focuses on:

- identity;
- organizations;
- projects;
- platforms;
- database;
- authorization.

Review emphasis:

- tenant isolation;
- repository ownership;
- migration safety;
- API contracts.

# 103. Phase 2 Review Mapping

Phase 2 focuses on:

- Studio;
- local build;
- artifact;
- upload.

Review emphasis:

- source privacy;
- Tauri IPC;
- artifact integrity;
- platform compatibility;
- local filesystem security.

# 104. Phase 3 Review Mapping

Phase 3 focuses on:

- simulated Lab;
- Job;
- Run;
- Results.

Review emphasis:

- protocol compatibility;
- state machines;
- simulator parity;
- retries;
- E2E behavior.

# 105. Phase 4 Review Mapping

Phase 4 focuses on:

- credits;
- booking;
- resource allocation.

Review emphasis:

- transaction integrity;
- concurrency;
- ledger correctness;
- platform-specific credit semantics.

# 106. Phase 5 Review Mapping

Phase 5 focuses on:

- Lab Agent;
- physical resources;
- robots;
- safety.

Review emphasis:

- local safety;
- identity;
- fault handling;
- HIL;
- physical approval.

# 107. Phase 6 Review Mapping

Phase 6 focuses on:

- security;
- production readiness;
- tenant isolation;
- recovery.

Review emphasis:

- security controls;
- secrets;
- keys;
- audit;
- backup/restore;
- production gates.

# 108. Phase 7 Review Mapping

Phase 7 focuses on:

- scale;
- operations;
- multiple resources;
- multiple labs.

Review emphasis:

- capacity;
- performance;
- observability;
- recovery;
- operational simplicity.

# 109. Phase 8 Review Mapping

Phase 8 focuses on:

- production launch.

Review emphasis:

- complete product workflow;
- release readiness;
- security;
- safety;
- rollback;
- customer impact.

# 110. Review Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Reviewer misses architecture issue | Critical | Architecture checklist |
| PR too large | High | Decomposition |
| Review delay | Medium | Review SLA |
| Style debate blocks work | Medium | Comment classification |
| Security reviewed late | Critical | Security trigger |
| Missing tests | High | DoD + CI |
| Documentation drift | Medium | Review checklist |
| Contract drift | Critical | Contract review |
| Reviewer lacks expertise | High | Specialist review |
| Approval without evidence | High | Acceptance checklist |
| Safety bypass | Critical | Mandatory human gate |
| CI false confidence | High | Human review |
| Reviewer overload | Medium | Ownership and escalation |

# 111. Review Risk Mitigation

The review system mitigates risk through:

    Task Definition
        |
        v
    Automated Checks
        |
        v
    Primary Review
        |
        +--> Architecture
        +--> Security
        +--> Database
        +--> Safety
        |
        v
    Approval
        |
        v
    CI
        |
        v
    Merge

No individual control is assumed to catch every defect.

# 112. Handling Review Deadlocks

A deadlock exists when author and reviewer cannot reach agreement after
reasonable discussion.

Process:

1. summarize disagreement;
2. identify governing requirement;
3. identify relevant ADR;
4. gather evidence;
5. involve domain owner;
6. involve architecture owner if required;
7. record decision;
8. continue implementation.

The goal is resolution, not winning the discussion.

# 113. Review Escalation Levels

| Level | Escalation |
|---|---|
| 1 | Author and reviewer |
| 2 | Domain owner |
| 3 | Architecture owner |
| 4 | Security/safety owner |
| 5 | Engineering leadership |

Escalation should be proportional to risk.

# 114. Reviewer Load Management

Maintainers should monitor:

- open PR count;
- review age;
- reviewer load;
- blocked tasks;
- release blockers.

Review ownership should be redistributed when bottlenecks occur.

# 115. Review Metrics

Recommended metrics:

- median review response time;
- median time to approval;
- PR age;
- reopened review rate;
- post-merge defect rate;
- escaped defect rate;
- review iteration count;
- CI failure rate;
- security defect rate.

Metrics should improve engineering flow, not encourage superficial approvals.

# 116. Anti-Pattern: Rubber-Stamp Approval

A reviewer must not approve merely because:

- author is trusted;
- CI is green;
- change is small;
- release is urgent.

Approval requires sufficient engineering review.

# 117. Anti-Pattern: Review by Preference

Do not block a PR solely because:

- another style would also work;
- reviewer personally prefers another library;
- naming could be marginally different.

If a concern is subjective, label it as a suggestion.

# 118. Anti-Pattern: CI-Only Review

Green CI does not prove:

- architecture correctness;
- product correctness;
- security correctness;
- usability;
- safety.

Human review remains required.

# 119. Anti-Pattern: Giant Review

A PR containing multiple unrelated features is difficult to validate.

Request decomposition when review quality is materially compromised.

# 120. Anti-Pattern: Hidden Follow-Up

Do not approve a known blocker with an undocumented verbal promise.

If follow-up is acceptable:

- create a task;
- identify owner;
- record impact;
- explicitly classify the current change as accepted with follow-up.

# 121. Review Completion Record

A completed review should allow reconstruction of:

    Task
      |
      v
    PR
      |
      v
    Reviewers
      |
      v
    Comments
      |
      v
    CI
      |
      v
    Approval
      |
      v
    Commit
      |
      v
    Integration

This provides engineering traceability.

# 122. Open Questions

The following review-process details remain to be finalized:

1. Exact reviewer SLAs after team size is established.
2. Exact CODEOWNERS ownership map.
3. Exact mandatory two-reviewer thresholds.
4. Exact security reviewer roster.
5. Exact safety reviewer roster.
6. Exact automated PR checklist.
7. Exact review metrics dashboard.
8. Exact escalation contacts.
9. Exact release-review approval matrix.
10. Exact emergency hotfix review process.
11. Exact automated architecture-drift detection.

These do not change the core review principles.

# 123. Full Acceptance Criteria — Process

- [ ] Every significant PR has a task.
- [ ] Task acceptance criteria are visible.
- [ ] Author self-review is complete.
- [ ] Primary reviewer is identified.
- [ ] Required specialist reviewers are identified.
- [ ] Review order is followed.
- [ ] Blocking comments are distinguished from suggestions.
- [ ] Approval rules are enforced.
- [ ] Review evidence is retained.

# 124. Full Acceptance Criteria — Correctness

- [ ] Requirements are satisfied.
- [ ] Acceptance criteria are satisfied.
- [ ] Edge cases are reviewed.
- [ ] Error handling is reviewed.
- [ ] State transitions are reviewed.
- [ ] Concurrency is reviewed.
- [ ] Retry behavior is reviewed.
- [ ] Idempotency is reviewed.
- [ ] Historical state is preserved.

# 125. Full Acceptance Criteria — Contracts

- [ ] Contract impact is identified.
- [ ] Contract changes are reviewed.
- [ ] Producers are identified.
- [ ] Consumers are identified.
- [ ] Compatibility is tested.
- [ ] Versioning is explicit.
- [ ] Error semantics are defined.
- [ ] Contract tests pass.
- [ ] Breaking changes are explicitly approved.

# 126. Full Acceptance Criteria — Security

- [ ] Authentication is reviewed.
- [ ] Authorization is reviewed.
- [ ] Tenant isolation is reviewed.
- [ ] Source privacy is reviewed.
- [ ] Artifact security is reviewed.
- [ ] Secrets are reviewed.
- [ ] Keys are reviewed.
- [ ] Logs are reviewed.
- [ ] Audit behavior is reviewed.
- [ ] Security CI passes.

# 127. Full Acceptance Criteria — Database

- [ ] Data ownership is correct.
- [ ] Migration exists.
- [ ] Migration is tested.
- [ ] Constraints are reviewed.
- [ ] Indexes are reviewed.
- [ ] Tenant relationships are reviewed.
- [ ] Transaction boundaries are reviewed.
- [ ] Concurrency is reviewed.
- [ ] Retention impact is reviewed.

# 128. Full Acceptance Criteria — Testing

- [ ] Unit tests are adequate.
- [ ] Integration tests are adequate.
- [ ] E2E tests are adequate.
- [ ] Regression tests exist.
- [ ] Negative paths are covered.
- [ ] Security paths are covered.
- [ ] Contract tests pass.
- [ ] Simulator tests pass where applicable.
- [ ] HIL tests pass where applicable.
- [ ] Physical tests pass where required.

# 129. Full Acceptance Criteria — Documentation

- [ ] Architecture docs are updated.
- [ ] Protocol docs are updated.
- [ ] Database docs are updated.
- [ ] Security docs are updated.
- [ ] Development docs are updated.
- [ ] Changelog is updated where applicable.
- [ ] ADRs are updated where required.
- [ ] User-facing behavior is documented where applicable.

# 130. Full Acceptance Criteria — Performance

- [ ] Performance impact is considered.
- [ ] Database queries are reviewed.
- [ ] Indexes are reviewed.
- [ ] Transaction duration is considered.
- [ ] Memory impact is considered.
- [ ] CPU impact is considered.
- [ ] Network impact is considered.
- [ ] Storage impact is considered.
- [ ] High-frequency paths use suitable transports.

# 131. Full Acceptance Criteria — Review SLA

- [ ] Normal review target is defined.
- [ ] PRI-0/PRI-1 review target is defined.
- [ ] Security review target is defined.
- [ ] Release-blocking target is defined.
- [ ] Hotfix target is defined.
- [ ] Safety escalation path is defined.
- [ ] Reviewer reassignment exists for missed SLAs.

# 132. Full Acceptance Criteria — Disagreements

- [ ] Author can challenge review comments.
- [ ] Reviewer can reassess based on evidence.
- [ ] Architecture disagreements can escalate.
- [ ] Security disagreements can escalate.
- [ ] Safety disagreements can escalate.
- [ ] Final decisions are documented.
- [ ] Unresolved blockers cannot be silently merged.

# 133. Full Acceptance Criteria — Automation

- [ ] Formatting is automated.
- [ ] Linting is automated.
- [ ] Typechecking is automated.
- [ ] Unit tests are automated.
- [ ] Integration tests are automated where applicable.
- [ ] E2E tests are automated where applicable.
- [ ] Secret scanning is automated.
- [ ] Dependency scanning is automated.
- [ ] Contract checks are automated where applicable.
- [ ] Migration checks are automated where applicable.

# 134. Full Acceptance Criteria — Phase Gates

- [ ] Phase 0 review process is operational.
- [ ] Phase 1 database/security review is operational.
- [ ] Phase 2 artifact/Studio review is operational.
- [ ] Phase 3 protocol/simulator review is operational.
- [ ] Phase 4 financial/resource review is operational.
- [ ] Phase 5 physical safety review is operational.
- [ ] Phase 6 LAB & ROBOT safety review is operational.
- [ ] Phase 8 PRODUCTION security and scale review is operational.
- [ ] Phase 8 release review is operational.

# 135. Final Review Invariants

The following are mandatory:

1. Every significant change receives review.
2. The author does not self-approve.
3. Review begins with requirements and architecture.
4. Contract changes are explicitly reviewed.
5. Database changes are explicitly reviewed.
6. Security-sensitive changes receive security review.
7. Physical safety changes receive human safety review.
8. Tests are evidence of behavior, not merely coverage numbers.
9. Documentation is part of review.
10. CI is required but does not replace human review.
11. Blocking comments must be technically justified.
12. Subjective preferences should not block progress.
13. Review disagreements are resolved through evidence.
14. Review SLAs are monitored.
15. Large PRs should be decomposed when necessary.
16. Architecture conflicts require ADR review.
17. Production hotfixes receive expedited but real review.
18. Simulator-first development remains the preferred robotics path.
19. Local safety remains authoritative for physical execution.
20. Approval represents informed engineering acceptance of the reviewed scope.

# 136. Final Review Flow

The canonical review flow is:

    Approved Task
        |
        v
    Implementation
        |
        v
    Author Self-Review
        |
        v
    Pull Request
        |
        v
    Automated Validation
        |
        v
    Primary Review
        |
        +----> Domain Review
        +----> Security Review
        +----> Database Review
        +----> Architecture Review
        +----> Safety Review
        |
        v
    Acceptance Criteria
        |
        v
    Approval
        |
        v
    Squash Merge
        |
        v
    main
        |
        v
    Integration Verification

# 137. Final Principle

> Kritva RaaS code review shall be an independent engineering control that
> validates not only whether code works, but whether it implements the
> approved requirement within the agreed architecture, contracts, security
> boundaries, data model, testing strategy and operational constraints.
> Reviewers shall begin with requirements and architecture, inspect contracts
> before consumers, verify tenant and source-code privacy boundaries, examine
> financial and execution state transitions, require meaningful tests,
> validate documentation, and evaluate performance and operational impact
> where applicable. Automated CI shall enforce mechanical quality gates while
> human reviewers provide architectural and engineering judgment. Security
> and physical safety concerns shall receive explicit specialist review, and
> unresolved safety concerns shall block physical deployment. Review
> disagreements shall be resolved through evidence and escalation rather than
> authority, while review SLAs shall keep engineering flow predictable.
> Approval therefore represents informed acceptance of a complete engineering
> change, not merely confirmation that the code compiles.
