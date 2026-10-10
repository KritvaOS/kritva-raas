# Kritva RaaS Issue Log

## 1. Purpose

This document defines the authoritative issue-management and issue-tracking
model for the Kritva RaaS engineering program.

The issue log captures problems, defects, blockers, gaps, failures, risks that
have materialized, and other actionable conditions discovered during planning,
implementation, testing, review, integration, deployment, operation, or
qualification.

The issue log provides traceability across:

    Phase
       |
       v
    Milestone
       |
       v
    Task
       |
       v
    Issue
       |
       +--> Risk
       +--> Decision
       +--> PR / Commit
       +--> Test Evidence
       +--> Acceptance
       |
       v
    Resolution

The issue log is distinct from the risk register.

A risk represents a potential future problem.

An issue represents a problem that has actually occurred or an identified
condition requiring action.

## 2. Scope

This document covers issues related to:

- frontend;
- backend;
- database;
- cloud;
- contracts;
- security;
- source-code privacy;
- artifact security;
- booking;
- credits;
- lab;
- execution;
- robotics;
- testing;
- performance;
- release;
- operations;
- documentation;
- architecture;
- integration.

It applies across P0 FOUNDATION through P8 PRODUCTION.

## 3. Goals

The issue log shall:

1. provide one authoritative issue record;
2. ensure material issues are not lost in chat, commits, or meetings;
3. establish severity and priority consistently;
4. provide a defined issue lifecycle;
5. provide clear ownership;
6. support rapid triage;
7. link issues to tasks and milestones;
8. link material issues to risks;
9. provide evidence of resolution;
10. support phase and release decisions;
11. expose recurring systemic problems;
12. support auditability.

## 4. Non-Goals

This document does not:

- replace the task tracker;
- replace the milestone tracker;
- replace the phase tracker;
- replace the risk register;
- replace architecture decisions;
- replace code review;
- replace CI;
- replace release management;
- serve as a general discussion forum.

## 5. Issue Definition

An issue is an identified condition that requires investigation, correction,
decision, mitigation, or tracking.

Examples include:

- software defect;
- failed test;
- broken build;
- migration failure;
- security finding;
- source privacy violation;
- artifact integrity failure;
- booking conflict;
- credit inconsistency;
- protocol incompatibility;
- Lab Agent failure;
- robot fault;
- performance regression;
- release blocker;
- documentation inconsistency.

## 6. Issue Versus Task

A task is planned work.

An issue is a problem or condition requiring action.

Example:

    Issue:
    Artifact signature validation fails for a valid package.

        |
        v

    Task:
    Fix signature verification compatibility.

The task resolves the issue.

## 7. Issue Versus Risk

A risk is a possibility.

An issue is an observed condition.

Example:

    Risk:
    Booking concurrency may cause resource allocation conflicts.

    Issue:
    Concurrent booking test actually produced two overlapping allocations.

When a risk materializes, the risk should remain recorded and the resulting
issue should be linked to it.

## 8. Issue ID Convention

Issue IDs use:

    ISSUE-<DOMAIN>-<NUMBER>

Examples:

    ISSUE-FE-001
    ISSUE-BE-001
    ISSUE-DB-001
    ISSUE-CLOUD-001
    ISSUE-SEC-001
    ISSUE-LAB-001
    ISSUE-REL-001

Recommended domains:

| Domain | Code |
|---|---|
| Frontend | FE |
| Backend | BE |
| Database | DB |
| Cloud | CLOUD |
| Contract | CONTRACT |
| Security | SEC |
| Testing | TEST |
| Artifact | ART |
| Booking | BOOK |
| Credits | CREDIT |
| Lab | LAB |
| Execution | EXEC |
| Results | RESULT |
| Release | REL |
| Integration | INT |
| Documentation | DOC |
| Architecture | ARCH |
| Operations | OPS |

## 9. Issue Severity

Severity describes the technical or operational impact of the issue.

| Severity | Definition |
|---|---|
| S0 Critical | Catastrophic safety, security, financial, data, or production impact |
| S1 High | Major functionality or release impact |
| S2 Medium | Significant but contained impact |
| S3 Low | Minor impact with workaround |
| S4 Informational | Observation or improvement with no material impact |

Severity answers:

> How bad is the issue if left unresolved?

## 10. S0 Critical

S0 applies to issues such as:

- physical safety hazard;
- active security compromise;
- cross-tenant data exposure;
- source-code leakage;
- artifact signing compromise;
- corruption of authoritative financial records;
- irreversible production data loss;
- uncontrolled robot behavior;
- critical production outage.

S0 issues require immediate escalation.

## 11. S1 High

S1 applies to:

- major production failure;
- critical milestone blocker;
- release blocker;
- significant data integrity defect;
- major authentication/authorization failure;
- booking or credit failure affecting real users;
- repeated execution failure;
- major protocol incompatibility.

## 12. S2 Medium

S2 applies to:

- significant functional defect;
- contained integration problem;
- repeatable test failure;
- non-critical performance regression;
- recoverable operational problem;
- important documentation or configuration defect.

## 13. S3 Low

S3 applies to:

- minor UI defect;
- low-impact usability issue;
- limited non-critical logging issue;
- minor documentation problem;
- non-blocking technical debt.

## 14. S4 Informational

S4 is used for:

- observations;
- improvement opportunities;
- non-actionable findings;
- future enhancement suggestions.

S4 should not be used to hide real defects.

## 15. Priority

Priority describes how urgently the issue should be addressed.

| Priority | Definition |
|---|---|
| PRI-0 | Immediate action; blocks critical execution or safety |
| PRI-1 | Must be addressed in current milestone/release |
| PRI-2 | Planned corrective work |
| PRI-3 | Address when capacity permits |
| PRI-4 | Backlog / informational |

Severity and priority are independent.

Example:

    Severity: S2
    Priority: PRI-1

A medium-impact issue may become urgent because it blocks a critical
milestone.

## 16. Severity/Priority Matrix

| Severity | Typical Priority |
|---|---|
| S0 | PRI-0 |
| S1 | PRI-0/PRI-1 |
| S2 | PRI-1/PRI-2 |
| S3 | PRI-2/PRI-3 |
| S4 | PRI-3/PRI-4 |

The mapping is guidance, not an automatic rule.

## 17. Issue Status Lifecycle

The standard lifecycle is:

    OPEN
       |
       v
    TRIAGED
       |
       v
    ASSIGNED
       |
       v
    IN_PROGRESS
       |
       v
    RESOLVED
       |
       v
    VERIFIED
       |
       v
    CLOSED

Alternative states:

    DUPLICATE
    REJECTED
    DEFERRED
    WONT_FIX
    REOPENED

## 18. Status Definitions

| Status | Meaning |
|---|---|
| OPEN | Newly reported |
| TRIAGED | Severity, priority, scope and ownership assessed |
| ASSIGNED | Owner explicitly assigned |
| IN_PROGRESS | Corrective work underway |
| RESOLVED | Proposed fix or resolution completed |
| VERIFIED | Resolution independently verified |
| CLOSED | Issue formally closed |
| DUPLICATE | Same condition already tracked elsewhere |
| REJECTED | Not a valid issue |
| DEFERRED | Accepted but postponed |
| WONT_FIX | Explicit decision not to fix |
| REOPENED | Previously resolved issue recurred or verification failed |

## 19. Issue Ownership

Every S0-S2 issue must have an owner after triage.

The owner is responsible for:

- investigation;
- corrective action;
- task creation;
- evidence;
- communication;
- verification readiness.

For S0 issues, ownership must be assigned immediately.

## 20. Issue Reporter

The reporter is the person or process that identifies the issue.

The reporter is responsible for providing enough information to reproduce or
understand the condition.

The reporter does not necessarily own the resolution.

## 21. Issue Record Template

Every material issue should contain:

    Issue ID:
    Title:
    Phase:
    Milestone:
    Task:
    Domain:
    Reporter:
    Owner:
    Severity:
    Priority:
    Status:
    Date Reported:
    Target Resolution:
    Description:
    Expected Behavior:
    Actual Behavior:
    Impact:
    Reproduction:
    Root Cause:
    Corrective Action:
    Verification:
    Risk Link:
    Decision Link:
    PR:
    Evidence:
    Notes:

## 22. Primary Issue Table

The compact issue table should contain:

| ID | Title | Phase | Milestone | Task | Severity | Priority | Owner | Status | Risk | PR | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|

This table is the operational summary.

Detailed investigation belongs in the issue record or linked task.

## 23. Initial Issue Log

The initial issue log contains no declared implementation defects.

| ID | Title | Phase | Milestone | Task | Severity | Priority | Owner | Status | Risk | PR | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| None | No active implementation issue declared | 0 | - | - | - | - | TBD | OPEN | - | - | Planning baseline |

This does not mean that the product is defect-free.

It means no implementation issue has yet been formally entered into the issue
log.

## 24. Example Issue — Build Failure

Example only:

| Field | Value |
|---|---|
| ID | ISSUE-BE-001 |
| Title | Backend CI build fails on clean environment |
| Phase | 0 |
| Milestone | P0-004 |
| Task | KR-BE-P0-001 |
| Severity | S1 |
| Priority | PRI-1 |
| Status | OPEN |

Example description:

    Expected:
    Backend builds successfully from a clean checkout.

    Actual:
    Dependency resolution fails during CI.

    Impact:
    Blocks CI qualification and downstream development.

## 25. Example Issue — Database

Example:

| Field | Value |
|---|---|
| ID | ISSUE-DB-001 |
| Title | Migration fails on upgrade path |
| Phase | 1 |
| Milestone | P1-007 |
| Task | KR-DB-P1-007 |
| Severity | S1 |
| Priority | PRI-1 |
| Status | TRIAGED |

The issue should link to the migration task and database risk.

## 26. Example Issue — Security

Example:

| Field | Value |
|---|---|
| ID | ISSUE-SEC-001 |
| Title | Artifact package contains prohibited source file |
| Phase | 2 |
| Milestone | P2-010 |
| Task | KR-ART-P2-007 |
| Severity | S0 |
| Priority | PRI-0 |
| Status | OPEN |

This is a critical source-privacy boundary violation.

It must block artifact acceptance until resolved.

## 27. Example Issue — Booking

Example:

| Field | Value |
|---|---|
| ID | ISSUE-BOOK-001 |
| Title | Concurrent booking creates overlapping allocation |
| Phase | 4 |
| Milestone | P4-003 |
| Task | KR-BOOK-P4-005 |
| Severity | S1 |
| Priority | PRI-1 |
| Status | OPEN |

The issue must be linked to the booking concurrency risk.

## 28. Example Issue — Physical Safety

Example:

| Field | Value |
|---|---|
| ID | ISSUE-LAB-001 |
| Title | Robot does not enter safe state on execution disconnect |
| Phase | 5 |
| Milestone | P5-006 |
| Task | KR-SEC-P5-003 |
| Severity | S0 |
| Priority | PRI-0 |
| Status | OPEN |

This issue blocks physical execution qualification.

## 29. Example Issue — Release

Example:

| Field | Value |
|---|---|
| ID | ISSUE-REL-001 |
| Title | Release rollback fails after database migration |
| Phase | 8 |
| Milestone | P8-004 |
| Task | KR-REL-P8-002 |
| Severity | S1 |
| Priority | PRI-1 |
| Status | TRIAGED |

The issue blocks production readiness until rollback is verified.

## 30. Triage Process

The standard triage flow is:

    Issue Reported
          |
          v
    Initial Screening
          |
          v
    Reproduce / Validate
          |
          v
    Severity Assessment
          |
          v
    Priority Assessment
          |
          v
    Ownership
          |
          v
    Task / Risk Linkage
          |
          v
    Corrective Action
          |
          v
    Verification
          |
          v
    Closure

## 31. Initial Screening

The triage owner determines:

- Is this a real issue?
- Is it already tracked?
- What domain is affected?
- What phase is affected?
- What milestone is affected?
- Is immediate escalation required?

## 32. Reproduction

For software issues, capture:

- environment;
- version;
- commit;
- configuration;
- input;
- expected result;
- actual result;
- logs;
- reproduction steps.

For infrastructure issues, capture:

- environment;
- service;
- deployment;
- region;
- configuration;
- timestamp;
- relevant telemetry.

For physical issues, capture:

- robot;
- hardware configuration;
- runtime;
- safety state;
- test procedure;
- observed behavior;
- safety response.

## 33. Severity Assessment

Severity must be determined from impact rather than implementation effort.

A difficult-to-fix cosmetic issue is not automatically high severity.

A simple configuration defect that exposes customer source code is critical.

## 34. Priority Assessment

Priority considers:

- severity;
- phase criticality;
- milestone dependency;
- release timing;
- customer impact;
- safety;
- security;
- financial impact;
- workaround availability.

## 35. Triage SLA

Recommended initial response targets:

| Severity | Initial Triage |
|---|---|
| S0 | Immediate |
| S1 | Same business day |
| S2 | 1 business day |
| S3 | 3 business days |
| S4 | Next planning cycle |

For production incidents, operational incident procedures may be faster.

## 36. S0 Escalation

S0 issues require:

- immediate owner;
- immediate phase-owner notification;
- security/safety notification where applicable;
- explicit mitigation;
- documented resolution;
- independent verification.

S0 issues may block the entire affected release or phase.

## 37. S1 Escalation

S1 issues require:

- same-day triage;
- owner;
- corrective task;
- milestone impact assessment;
- risk review;
- acceptance impact assessment.

## 38. S2-S4 Handling

S2 issues require planned corrective work.

S3 issues may be scheduled as technical debt.

S4 issues may be recorded for future consideration.

The lower priority must not obscure cumulative systemic problems.

## 39. Issue-to-Task Linkage

Most actionable issues should produce a corrective task.

Flow:

    Issue
      |
      v
    Corrective Task
      |
      v
    PR
      |
      v
    CI
      |
      v
    Verification
      |
      v
    Issue Closure

Example:

    ISSUE-SEC-001
         |
         v
    KR-ART-P2-007
         |
         v
    PR #123
         |
         v
    Security Test
         |
         v
    VERIFIED
         |
         v
    CLOSED

## 40. Issue-to-Risk Linkage

When an issue demonstrates that a known risk has materialized:

    Risk R-014
       |
       v
    ISSUE-BOOK-001
       |
       v
    Corrective Task
       |
       v
    Resolution

The risk remains relevant until the underlying risk condition is reassessed.

## 41. Issue-to-Milestone Linkage

Every S0-S2 issue must identify its affected milestone when one exists.

This determines whether milestone status becomes:

- AMBER;
- RED;
- BLOCKED.

## 42. Issue-to-Phase Linkage

A material issue should identify its phase.

An S0 issue may block phase progression.

An S1 issue may block milestone acceptance.

S2-S4 issues generally require tracked corrective action but may not block
phase completion.

## 43. Issue-to-Decision Linkage

Some issues require architecture or product decisions rather than code fixes.

Example:

    Issue
      |
      v
    Decision Required
      |
      v
    ADR
      |
      v
    Corrective Task(s)

The decision must be recorded in:

    docs/planning/DECISIONS.md

## 44. Issue Resolution Types

Possible resolutions include:

- FIXED;
- CONFIGURATION_CHANGED;
- DESIGN_CHANGED;
- WORKAROUND;
- DUPLICATE;
- REJECTED;
- DEFERRED;
- WONT_FIX;
- SUPERSEDED.

The resolution must explain what happened.

## 45. Root Cause

Root cause should be recorded for S0-S2 issues where reasonably determinable.

Possible categories:

- implementation defect;
- architecture defect;
- configuration defect;
- dependency defect;
- process defect;
- test gap;
- documentation gap;
- infrastructure failure;
- hardware failure;
- external service failure;
- requirement ambiguity.

## 46. Corrective Action

Corrective action must identify:

- what changed;
- which task implemented it;
- which PR contains it;
- which tests verify it;
- whether documentation changed.

## 47. Verification

Resolution must be verified by appropriate evidence.

Examples:

- regression test;
- integration test;
- security test;
- migration test;
- HIL test;
- physical qualification;
- production verification.

## 48. Closure Rules

An issue may move to CLOSED only when:

- corrective action is complete;
- acceptance criteria pass;
- verification is complete;
- required evidence is recorded;
- linked task is accepted;
- residual risk is assessed.

## 49. Reopening

An issue must be REOPENED when:

- the same failure recurs;
- verification fails;
- the fix is incomplete;
- a regression is detected;
- production evidence contradicts closure.

A reopened issue retains its original history.

## 50. Duplicate Issues

A duplicate issue should:

- identify the original issue;
- retain useful evidence;
- become DUPLICATE;
- not be silently deleted.

## 51. Deferred Issues

A deferred issue must have:

- reason;
- owner;
- target planning point;
- accepted residual impact;
- linked risk where appropriate.

Critical safety/security issues should not be casually deferred.

## 52. Wont-Fix Issues

WONT_FIX requires explicit rationale.

Examples:

- behavior is intentional;
- cost exceeds approved benefit;
- product scope excludes the behavior.

For S0/S1 issues, WONT_FIX requires explicit senior technical/product
approval and residual-risk assessment.

## 53. Issue Aging

Issue age should be monitored.

Recommended categories:

| Age | Category |
|---|---|
| 0-7 days | Fresh |
| 8-30 days | Aging |
| 31-60 days | Old |
| >60 days | Long-running |

Critical issues should not be allowed to age without explicit review.

## 54. Issue Aging Rules

Long-running S0/S1 issues require:

- owner review;
- mitigation status;
- target resolution;
- escalation if target is missed.

## 55. Issue Repetition

Repeated issues should trigger systemic analysis.

Example:

    ISSUE-DB-001
    ISSUE-DB-004
    ISSUE-DB-009

If all arise from migration quality, create a systemic risk or process
improvement task.

## 56. Systemic Issue Handling

A systemic issue may require:

- architecture change;
- process change;
- tooling;
- additional tests;
- new acceptance criteria;
- new milestone;
- training/documentation.

Fixing one symptom is insufficient if the underlying class of failure remains.

## 57. Issue Review Cadence

Active issues should be reviewed:

- weekly during project execution;
- at milestone reviews;
- before phase gates;
- before release qualification.

S0/S1 issues require more frequent review as needed.

## 58. Issue Dashboard

The issue dashboard should summarize:

| Metric | Value |
|---|---:|
| Open | 0 |
| S0 | 0 |
| S1 | 0 |
| S2 | 0 |
| S3 | 0 |
| S4 | 0 |
| Blocked Milestones | 0 |
| Overdue | 0 |
| Reopened | 0 |

Initial values are zero because no implementation issue has been formally
declared.

## 59. P0 FOUNDATION Issue Mapping

P0 FOUNDATION issues are expected to cover:

- repository;
- workspace;
- development environment;
- CI;
- tests;
- contracts;
- security automation;
- release foundation.

Example issue linkage:

    ISSUE-BE-001
       |
       +--> P0-004 CI Foundation
       +--> KR-BE-P0-001
       +--> RISK-FOUNDATION-001

## 60. P1 STUDIO Issue Mapping

P1 STUDIO issue domains include:

- Studio;
- local runtime;
- projects;
- IPC;
- local source privacy.

## 61. P2 BUILD & ARTIFACT Issue Mapping

P2 BUILD & ARTIFACT issue domains include:

- local build;
- artifact generation;
- artifact signing;
- artifact validation;
- upload;
- source privacy.

Source-code leakage is an S0 condition.

## 62. P3 CONTROL PLANE Issue Mapping

P3 CONTROL PLANE issue domains include:

- identity;
- authentication;
- organizations;
- authorization;
- platforms;
- database;
- APIs;
- tenant isolation.

## 63. P4 BOOKING & COMMERCIAL Issue Mapping

P4 BOOKING & COMMERCIAL issue domains include:

- booking;
- resource allocation;
- time slots;
- credits;
- rate cards;
- wallet;
- ledger;
- reservations;
- consumption.

## 64. P5 EXECUTION Issue Mapping

P5 EXECUTION issue domains include:

- Lab Protocol;
- simulated Lab Agent;
- simulation;
- Job;
- Run;
- execution events;
- logs.

Simulated evidence must not be recorded as physical safety evidence.

## 65. P6 LAB & ROBOT Issue Mapping

P6 LAB & ROBOT issue domains include:

- physical Lab Agent;
- robot registration;
- hardware;
- HIL;
- emergency stop;
- safe state;
- physical execution.

Any unsafe physical behavior is S0.

## 66. P7 LIVE & RESULTS Issue Mapping

P7 LIVE & RESULTS issue domains include:

- telemetry;
- video;
- results;
- data provenance.

## 67. P8 PRODUCTION Issue Mapping

P8 PRODUCTION issue domains include:

- tenant isolation and security qualification;
- secrets and key management;
- audit;
- backup and recovery;
- performance, load, stress and soak;
- multiple labs;
- production observability;
- release candidate, canary, pilot and launch.

## 68. Issue Flow Across the Product

The complete issue flow is:

    Detection
       |
       v
    Issue Log
       |
       v
    Triage
       |
       +------> Risk Update
       |
       +------> Decision
       |
       +------> Corrective Task
       |
       v
    Implementation
       |
       v
    Review
       |
       v
    CI / Qualification
       |
       v
    Verification
       |
       v
    Closure
       |
       v
    Milestone / Phase Status Update

## 69. Issue Impact on Milestone Status

| Issue | Typical Milestone Effect |
|---|---|
| S0 | RED / BLOCKED |
| S1 | RED or AMBER |
| S2 | AMBER where material |
| S3 | Usually no gate impact |
| S4 | No gate impact |

The phase or milestone owner may adjust the effect based on context.

## 70. Issue Impact on Phase Status

A phase may become BLOCKED when:

- an S0 issue blocks a mandatory safety/security requirement;
- an S1 issue blocks a mandatory exit criterion;
- a dependency failure prevents required qualification;
- an unresolved issue makes phase acceptance impossible.

## 71. Issue Impact on Release

A release must not proceed when unresolved issues violate:

- security gates;
- safety gates;
- financial integrity;
- data integrity;
- mandatory functional acceptance;
- release rollback requirements.

## 72. Security Issue Rules

Security issues must additionally record:

- affected asset;
- trust boundary;
- exploitability;
- data impact;
- authentication impact;
- authorization impact;
- source/privacy impact;
- remediation;
- verification.

Security issues should follow the security severity policy where more specific.

## 73. Source Privacy Issue Rules

If source code leaves the developer machine unexpectedly:

1. classify as S0;
2. stop affected artifact flow;
3. preserve evidence;
4. investigate exposure;
5. revoke affected artifacts if necessary;
6. determine whether credentials or keys were exposed;
7. remediate;
8. independently verify.

## 74. Artifact Security Issue Rules

Artifact issues must consider:

- signature;
- checksum;
- manifest;
- provenance;
- prohibited files;
- dependency integrity;
- compatibility;
- revocation.

Invalid production artifacts must not be deployed.

## 75. Database Issue Rules

Database issues must identify:

- schema;
- migration;
- transaction;
- constraint;
- index;
- data integrity;
- recovery implications.

Data corruption is potentially S0.

## 76. Booking Issue Rules

Booking issues must consider:

- resource;
- allocation;
- time range;
- concurrency;
- idempotency;
- credit reservation;
- cancellation;
- refund.

Overlapping physical resource allocations are high severity.

## 77. Credit Issue Rules

Credit issues must consider:

- wallet;
- ledger;
- transaction;
- reservation;
- consumption;
- refund;
- reconciliation.

The ledger remains the authoritative financial evidence.

## 78. Lab Issue Rules

Lab issues must identify:

- Lab;
- Lab Agent;
- resource;
- robot;
- runtime;
- hardware;
- firmware;
- safety state.

Physical safety takes precedence over service availability.

## 79. Execution Issue Rules

Execution issues must identify:

- Job;
- Run;
- artifact;
- platform;
- resource;
- runtime;
- state transition;
- logs;
- telemetry.

Job and Run state must remain durable and reconcilable.

## 80. Performance Issue Rules

Performance issues should include:

- workload;
- baseline;
- measured result;
- target;
- environment;
- percentile where relevant;
- resource utilization;
- regression comparison.

## 81. Cloud Issue Rules

Cloud issues should identify:

- environment;
- service;
- region;
- deployment;
- infrastructure component;
- configuration;
- impact;
- recovery status.

## 82. Issue Evidence Model

The preferred evidence chain is:

    Issue
      |
      +--> Reproduction
      +--> Logs
      +--> Metrics
      +--> Test
      +--> Task
      +--> PR
      +--> Commit
      +--> Verification
      +--> Closure

Evidence should remain accessible for the required retention period.

## 83. Issue Audit Trail

Material issue status changes should record:

| Field | Required |
|---|---|
| Timestamp | Yes |
| Actor | Yes |
| Previous Status | Yes |
| New Status | Yes |
| Reason | Yes |
| Evidence | Where applicable |

The issue log should not erase historical state.

## 84. Issue Update Rules

An issue must be updated when:

- triage completes;
- severity changes;
- priority changes;
- owner changes;
- status changes;
- blocker changes;
- linked task changes;
- risk changes;
- resolution occurs;
- verification occurs.

## 85. Severity Change Rules

Severity may change when:

- impact is better understood;
- exploitability changes;
- affected scope expands;
- safety impact is discovered;
- data exposure is confirmed.

Every material severity change requires rationale.

## 86. Priority Change Rules

Priority may change when:

- milestone timing changes;
- release timing changes;
- customer impact changes;
- a workaround disappears;
- a higher-priority dependency appears.

## 87. Issue Triage Checklist

During triage:

- [ ] Issue is valid.
- [ ] Duplicate search completed.
- [ ] Domain identified.
- [ ] Phase identified.
- [ ] Milestone identified.
- [ ] Task identified or created.
- [ ] Severity assigned.
- [ ] Priority assigned.
- [ ] Owner assigned.
- [ ] Reproduction captured.
- [ ] Impact assessed.
- [ ] Risk linkage assessed.
- [ ] Decision linkage assessed.

## 88. Issue Resolution Checklist

Before RESOLVED:

- [ ] Root cause understood where practical.
- [ ] Corrective task complete.
- [ ] PR exists where applicable.
- [ ] Tests added or updated.
- [ ] Regression test passes.
- [ ] Documentation updated.
- [ ] Risk updated.
- [ ] Decision updated where applicable.
- [ ] Evidence recorded.

## 89. Issue Verification Checklist

Before VERIFIED:

- [ ] Fix reproduced successfully.
- [ ] Original failure no longer occurs.
- [ ] Regression tests pass.
- [ ] Related workflows pass.
- [ ] Security/safety review complete where required.
- [ ] Production verification complete where required.
- [ ] Residual impact assessed.

## 90. Issue Closure Checklist

Before CLOSED:

- [ ] Status is VERIFIED.
- [ ] Evidence is complete.
- [ ] Linked task is ACCEPTED.
- [ ] Milestone impact updated.
- [ ] Risk impact updated.
- [ ] Release impact updated.
- [ ] No unresolved follow-up is hidden.
- [ ] Closure rationale recorded.

## 91. Issue Reopen Checklist

When reopening:

- [ ] Existing issue ID retained.
- [ ] Recurrence evidence recorded.
- [ ] New impact assessed.
- [ ] Severity re-evaluated.
- [ ] Priority re-evaluated.
- [ ] Corrective task updated or created.
- [ ] Previous closure evidence preserved.

## 92. Issue Aging Review

Weekly issue review should identify:

- oldest open issue;
- oldest S0/S1;
- overdue issues;
- repeated issues;
- blocked issues;
- issues blocking milestones;
- issues blocking release.

## 93. Issue Metrics

Recommended metrics:

- open issue count;
- issues by severity;
- issues by priority;
- mean time to triage;
- mean time to resolution;
- mean time to verification;
- reopened issue rate;
- duplicate rate;
- aging distribution;
- issues per milestone;
- issues per release;
- escaped defects.

## 94. Issue Quality Metrics

The project should also monitor:

- percentage with owners;
- percentage with reproduction evidence;
- percentage linked to tasks;
- percentage linked to risks where applicable;
- percentage resolved with regression tests;
- percentage reopened;
- percentage closed without adequate evidence.

## 95. Issue Review Dashboard

A production issue dashboard should expose:

    Open Issues
        |
        +--> S0
        +--> S1
        +--> S2
        +--> S3
        +--> S4

    Blockers
        |
        +--> Milestones
        +--> Phases
        +--> Release

    Aging
        |
        +--> 0-7 days
        +--> 8-30 days
        +--> 31-60 days
        +--> >60 days

## 96. Issue Data Flow

The authoritative flow is:

    Detection Source
         |
         v
    Issue Record
         |
         v
    Triage
         |
         +----------------+
         |                |
         v                v
       Risk            Decision
         |                |
         +--------+-------+
                  |
                  v
            Corrective Task
                  |
                  v
                 PR
                  |
                  v
              CI / Test
                  |
                  v
             Verification
                  |
                  v
               Closure

## 97. Issue Sources

Issues may originate from:

- developer testing;
- CI;
- code review;
- integration testing;
- E2E;
- simulation;
- HIL;
- physical qualification;
- security testing;
- production monitoring;
- customer reports;
- operational review;
- migration;
- backup/recovery tests.

## 98. Issue Intake Rules

Issue reports should include enough information to avoid unnecessary
back-and-forth.

Minimum intake:

- title;
- observed condition;
- environment;
- expected behavior;
- actual behavior;
- reporter.

S0/S1 reports should include immediate impact.

## 99. Issue Classification

Every issue should be classified by:

- domain;
- phase;
- milestone;
- severity;
- priority;
- lifecycle state.

Additional classification may include:

- security;
- safety;
- data;
- financial;
- performance;
- release.

## 100. Issue Notes Standards

Notes should be:

- factual;
- concise;
- dated when material;
- evidence-based;
- free from blame.

Avoid:

- speculation presented as fact;
- personal criticism;
- undocumented decisions;
- vague statements such as "fixed somehow."

## 101. Issue Communication

S0/S1 issues should be communicated to affected owners promptly.

Communication should include:

- issue;
- impact;
- current status;
- mitigation;
- owner;
- next action.

## 102. Issue Escalation

Escalation path:

    Task Owner
        |
        v
    Milestone Owner
        |
        v
    Phase Owner
        |
        v
    Project Owner
        |
        v
    Security / Safety / Architecture Authority
        |
        v
    Executive Decision where required

Escalation should match issue impact.

## 103. Issue and Architecture

Architecture issues require review when:

- the existing design cannot satisfy requirements;
- a recurring defect indicates an architectural problem;
- a protocol contract must change;
- database ownership changes;
- security boundary changes.

The corresponding decision belongs in `DECISIONS.md`.

## 104. Issue and Testing

A resolved defect should normally receive a regression test when practical.

Critical issues must have durable verification evidence.

The testing strategy remains authoritative for test-level requirements.

## 105. Issue and Release

Before release approval:

- all S0 issues must be closed;
- S1 issues must be closed or explicitly approved;
- S2 issues require release-impact review;
- deferred issues require documented residual risk.

Safety-critical issues cannot be bypassed through schedule pressure.

## 106. Issue and Phase Gate

Phase acceptance must include issue review.

Required checks:

- no unresolved blocking S0;
- no unapproved S1 affecting exit criteria;
- deferred issues documented;
- residual risks accepted;
- issue metrics reviewed.

## 107. Issue and Production

Production issues may additionally require:

- incident record;
- customer communication;
- rollback;
- artifact revocation;
- security response;
- data recovery;
- post-incident review.

Production incidents must remain traceable to the underlying issue.

## 108. Issue Closure and Lessons Learned

Significant issues should produce lessons learned.

Lessons may result in:

- new test;
- new checklist;
- new ADR;
- new security requirement;
- new process rule;
- new monitoring;
- new milestone.

## 109. Open Questions

The following remain open for implementation refinement:

1. Whether issue IDs will be synchronized with GitHub Issues.
2. Whether issue status will be automated from PR/CI state.
3. Whether severity should exactly mirror a future security severity taxonomy.
4. Whether production incidents require a separate incident identifier.
5. Whether issue aging targets should vary by phase.
6. Whether issue dashboards will be generated automatically.
7. Whether issue history should be stored in a database.
8. Whether issue closure requires independent review for S2 issues.
9. Whether customer-reported issues receive a separate classification.
10. Whether automated duplicate detection will be introduced.

These questions do not prevent initial issue-log operation.

## 110. Risks and Mitigations

### Risk 1 — Issues remain undocumented

Mitigation:

- explicit issue intake;
- review checkpoints;
- CI/security integration.

### Risk 2 — Severity inflation

Mitigation:

- severity definitions;
- evidence-based triage;
- phase-owner review.

### Risk 3 — Critical issues hidden as tasks

Mitigation:

- material problems require issue records;
- task records reference issue IDs.

### Risk 4 — Issues remain open indefinitely

Mitigation:

- aging review;
- owner;
- target resolution;
- escalation.

### Risk 5 — Issues closed without evidence

Mitigation:

- verification gate;
- closure checklist.

### Risk 6 — Repeated defects

Mitigation:

- systemic issue review;
- root-cause analysis;
- regression tests.

### Risk 7 — Security/safety issues deferred

Mitigation:

- S0 classification;
- explicit gates;
- senior review.

## 111. Acceptance Criteria — Structure

- [ ] Purpose defined.
- [ ] Scope defined.
- [ ] Goals defined.
- [ ] Non-goals defined.
- [ ] Issue definition established.
- [ ] Risk distinction established.
- [ ] Task distinction established.
- [ ] Issue ID convention established.
- [ ] Severity defined.
- [ ] Priority defined.
- [ ] Lifecycle defined.

## 112. Acceptance Criteria — Severity

- [ ] S0 defined.
- [ ] S1 defined.
- [ ] S2 defined.
- [ ] S3 defined.
- [ ] S4 defined.
- [ ] Safety impact considered.
- [ ] Security impact considered.
- [ ] Financial impact considered.
- [ ] Data impact considered.

## 113. Acceptance Criteria — Priority

- [ ] P0 defined.
- [ ] P1 defined.
- [ ] P2 defined.
- [ ] P3 defined.
- [ ] P4 defined.
- [ ] Priority distinguished from severity.
- [ ] Milestone impact considered.
- [ ] Release impact considered.

## 114. Acceptance Criteria — Lifecycle

- [ ] OPEN supported.
- [ ] TRIAGED supported.
- [ ] ASSIGNED supported.
- [ ] IN_PROGRESS supported.
- [ ] RESOLVED supported.
- [ ] VERIFIED supported.
- [ ] CLOSED supported.
- [ ] DUPLICATE supported.
- [ ] REJECTED supported.
- [ ] DEFERRED supported.
- [ ] WONT_FIX supported.
- [ ] REOPENED supported.

## 115. Acceptance Criteria — Issue Table

- [ ] ID column exists.
- [ ] Title column exists.
- [ ] Phase column exists.
- [ ] Milestone column exists.
- [ ] Task column exists.
- [ ] Severity column exists.
- [ ] Priority column exists.
- [ ] Owner column exists.
- [ ] Status column exists.
- [ ] Risk column exists.
- [ ] PR column exists.
- [ ] Notes column exists.

## 116. Acceptance Criteria — Triage

- [ ] Initial screening defined.
- [ ] Reproduction defined.
- [ ] Severity assessment defined.
- [ ] Priority assessment defined.
- [ ] Ownership defined.
- [ ] Task linkage defined.
- [ ] Risk linkage defined.
- [ ] Decision linkage defined.
- [ ] Escalation defined.
- [ ] Triage SLAs defined.

## 117. Acceptance Criteria — Resolution

- [ ] Root cause process defined.
- [ ] Corrective action defined.
- [ ] PR linkage defined.
- [ ] Test verification defined.
- [ ] Evidence defined.
- [ ] Residual risk assessment defined.
- [ ] Closure criteria defined.
- [ ] Reopen criteria defined.

## 118. Acceptance Criteria — Task Linkage

- [ ] Issues can link to tasks.
- [ ] Corrective tasks can be created.
- [ ] Task acceptance affects issue resolution.
- [ ] PR evidence can be linked.
- [ ] Milestone status can be updated.

## 119. Acceptance Criteria — Risk Linkage

- [ ] Issues can link to risks.
- [ ] Materialized risks remain tracked.
- [ ] Residual risk is reassessed.
- [ ] Risk owner is notified.
- [ ] Risk register remains synchronized.

## 120. Acceptance Criteria — Phase Mapping

- [ ] P0 FOUNDATION issue mapping defined.
- [ ] P1 STUDIO issue mapping defined.
- [ ] P2 BUILD & ARTIFACT issue mapping defined.
- [ ] P3 CONTROL PLANE issue mapping defined.
- [ ] P4 BOOKING & COMMERCIAL issue mapping defined.
- [ ] P5 EXECUTION issue mapping defined.
- [ ] P6 LAB & ROBOT issue mapping defined.
- [ ] P7 LIVE & RESULTS issue mapping defined.
- [ ] P8 PRODUCTION issue mapping defined.

## 121. Acceptance Criteria — Security

- [ ] Security issues receive explicit severity.
- [ ] Source privacy violations are critical.
- [ ] Artifact integrity failures are tracked.
- [ ] Tenant isolation failures are tracked.
- [ ] Security evidence is retained.
- [ ] Security closure is independently verified where required.

## 122. Acceptance Criteria — Safety

- [ ] Physical safety issues receive explicit treatment.
- [ ] Unsafe robot behavior is S0.
- [ ] Emergency stop failures are S0.
- [ ] Safe-state failures are S0.
- [ ] Safety issues block physical qualification where required.
- [ ] Human safety review is represented.

## 123. Acceptance Criteria — Financial Integrity

- [ ] Credit issues are tracked.
- [ ] Wallet issues are tracked.
- [ ] Ledger issues are tracked.
- [ ] Booking/credit inconsistencies are tracked.
- [ ] Reconciliation is required.
- [ ] Financial corruption is treated as critical.

## 124. Acceptance Criteria — Database

- [ ] Migration issues are tracked.
- [ ] Constraint failures are tracked.
- [ ] Data integrity failures are tracked.
- [ ] Backup/restore issues are tracked.
- [ ] Recovery issues are tracked.
- [ ] Production database issues include impact assessment.

## 125. Acceptance Criteria — Cloud

- [ ] Environment issues are tracked.
- [ ] Deployment issues are tracked.
- [ ] Secrets issues are tracked.
- [ ] Monitoring issues are tracked.
- [ ] Recovery issues are tracked.
- [ ] Rollback issues are tracked.

## 126. Acceptance Criteria — Testing

- [ ] Test failures can create issues.
- [ ] Regression tests can close issues.
- [ ] E2E failures can be linked.
- [ ] HIL failures can be linked.
- [ ] Physical qualification failures can be linked.
- [ ] Performance regressions can be linked.

## 127. Acceptance Criteria — Release

- [ ] Release blockers are tracked.
- [ ] S0/S1 release issues are visible.
- [ ] Rollback issues are tracked.
- [ ] Canary issues are tracked.
- [ ] Pilot issues are tracked.
- [ ] Post-release issues are tracked.

## 128. Acceptance Criteria — Governance

- [ ] Issue owners are accountable.
- [ ] Status transitions are traceable.
- [ ] Severity changes are explained.
- [ ] Priority changes are explained.
- [ ] Closure requires evidence.
- [ ] WONT_FIX requires rationale.
- [ ] DEFERRED requires residual-risk review.
- [ ] Critical issues cannot be silently ignored.

## 129. Acceptance Criteria — Initial State

- [ ] No implementation issue is falsely declared.
- [ ] Initial issue table exists.
- [ ] Initial issue state is explicitly documented.
- [ ] S0 count is zero initially.
- [ ] S1 count is zero initially.
- [ ] No active blocker is declared.
- [ ] Issue tracking is ready for P0 FOUNDATION execution.

## 130. Acceptance Criteria — Traceability

- [ ] Issue can link to phase.
- [ ] Issue can link to milestone.
- [ ] Issue can link to task.
- [ ] Issue can link to risk.
- [ ] Issue can link to decision.
- [ ] Issue can link to PR.
- [ ] Issue can link to test evidence.
- [ ] Issue can link to resolution evidence.

## 131. Final Issue Management Invariants

The following invariants are mandatory:

1. Every material issue has a unique ID.
2. Every material issue has a severity.
3. Every material issue has a priority.
4. Every S0-S2 issue has an owner after triage.
5. Every material issue identifies its affected phase where applicable.
6. Every material issue identifies its affected milestone where applicable.
7. Actionable issues have corrective tasks.
8. Material issues link to risks where applicable.
9. Architecture issues link to decisions where applicable.
10. Resolved issues have verification evidence.
11. Closed issues retain historical evidence.
12. Critical issues cannot be silently deferred.
13. Physical safety issues take precedence over schedule.
14. Security boundary violations take precedence over schedule.
15. Financial integrity failures require reconciliation.
16. Database integrity failures require explicit verification.
17. Release blockers must be visible to release governance.
18. Reopened issues retain their original identity.
19. Duplicate issues retain traceability to the original.
20. Status changes are auditable.
21. Severity changes are justified.
22. Priority changes are justified.
23. Issue closure does not erase residual risk.
24. Issue trends are reviewed for systemic problems.
25. The issue log reflects actual observed conditions rather than hypothetical
    risks.

## 132. Final Issue Flow

The canonical flow is:

    OPEN
       |
       v
    TRIAGED
       |
       v
    ASSIGNED
       |
       v
    IN_PROGRESS
       |
       v
    RESOLVED
       |
       v
    VERIFIED
       |
       v
    CLOSED

Alternative paths:

    OPEN -------> REJECTED
    OPEN -------> DUPLICATE
    TRIAGED -----> DEFERRED
    RESOLVED -----> REOPENED
    VERIFIED -----> REOPENED

## 133. Initial Project Issue State

The initial Kritva RaaS issue state is:

    Open Issues:
        0

    S0 Issues:
        0

    S1 Issues:
        0

    S2 Issues:
        0

    S3 Issues:
        0

    S4 Issues:
        0

    Blocked Milestones:
        0

    Blocked Phases:
        0

    Reopened Issues:
        0

    Active Implementation Blockers:
        NONE DECLARED

This reflects the current planning baseline and does not represent a claim that
future implementation will be defect-free.

## 134. Final Principle

> Kritva RaaS ISSUE_LOG.md shall be the authoritative record of material
> problems discovered during engineering, testing, qualification, deployment
> and operation. It shall distinguish observed issues from potential risks and
> planned tasks, assign severity and priority consistently, provide an explicit
> lifecycle from OPEN through TRIAGE, ASSIGNMENT, CORRECTION, VERIFICATION and
> CLOSURE, and maintain traceability to phases, milestones, tasks, risks,
> decisions, PRs and evidence. Critical security, source-privacy, financial
> integrity, data-integrity and physical-safety issues shall receive the
> strongest escalation and cannot be silently deferred to protect schedule.
> Every material issue shall have an accountable owner, actionable resolution
> path and verifiable closure evidence. The initial Kritva RaaS state contains
> no declared implementation issue and therefore reports zero active issues,
> while the issue-management framework is established and ready to capture
> problems as P0 FOUNDATION implementation begins.
