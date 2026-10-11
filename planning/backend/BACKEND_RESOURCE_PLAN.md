# Backend Resource Plan

## Document Control

| Field | Value |
|---|---|
| Document | Backend Resource Plan |
| Path | `planning/backend/BACKEND_RESOURCE_PLAN.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; DB-M02 CORE DATA; B-M03 PLATFORM; C-M01 FOUNDATION; C-M02 DEVELOPMENT |

## 1. Purpose

This document translates the existing B-M01 CONTROL PLANE engineering-task estimates into an indicative, role-based backend effort view. It identifies the roles needed for each proposed implementation increment, separates direct implementation effort from shared verification effort, and records the resource commitments that remain undecided.

This document follows the ownership and commitment-baseline rules in `planning/RESOURCE_PLAN.md`, particularly Section 23.2.

It does not establish a committed schedule, hiring plan, FTE allocation, cost forecast, budget, or named-person assignment.

## 2. Resource Planning Rules

1. Existing task estimates are the starting point for effort planning.
2. Existing B-M01 estimates are engineering-day estimates and must be refined during task refinement.
3. An existing task estimate is a total task estimate. Where several roles share a task, the task estimate must not be counted once for every role.
4. Role-level effort allocation remains TBD where the existing task register does not split the estimate by role.
5. Newly introduced B-INC-001 tasks remain unestimated until their scope and acceptance criteria are reviewed.
6. Shared test and review effort is shown separately from direct increment effort to prevent double-counting.
7. Effort in engineering days is not a calendar duration or a staffing commitment.
8. No FTE, start date, end date, budget, compensation, contractor rate, or cost figure is introduced by this document.
9. Every commitment field must remain TBD until its decision owner approves the relevant record.
10. A resource estimate does not authorize hiring or expenditure.

## 3. Source and Estimation Method

The direct implementation estimates in this document are derived from the existing B-M01 task register:

- KR-BE-1-001 through KR-BE-1-009 cover the application foundation.
- KR-BE-1-010 through KR-BE-1-021 cover identity and organization.
- KR-BE-1-022 through KR-BE-1-031 cover projects and platform catalog.
- KR-BE-1-032 through KR-BE-1-040 cover migrations, transactions, idempotency, and audit.
- KR-BE-1-041 covers structured logging.
- KR-BE-1-042 through KR-BE-1-054 cover cross-cutting testing, reviews, performance baseline, documentation, and acceptance.

The source estimates are planning estimates. They have not been validated against implementation evidence, current team capacity, or a committed schedule.

### 3.1 Estimation boundaries

The increment sums below include only the listed existing direct implementation tasks. They do not include:

- Newly proposed KR-BINC-001 tasks.
- The separate cross-increment verification and review pool.
- Gated coding-agent policy tasks.
- Unestimated integration work discovered during refinement.
- Hiring, onboarding, infrastructure procurement, or operational support effort not represented by the source task estimates.

These exclusions must be assessed during task refinement rather than assumed to require no effort.

## 4. Indicative Existing Task Effort by Increment

| Increment | Existing task IDs included | Existing estimated effort | Principal owner roles represented | Estimate status |
|---|---|---:|---|---|
| B-INC-001 SECURE FOUNDATION | KR-BE-1-001 to KR-BE-1-009; KR-BE-1-041 | 16.0 engineering days | Backend Technical Lead, Backend Engineer, Architecture Owner | Derived from existing task estimates; refinement required |
| B-INC-002 IDENTITY-ORGANIZATION | KR-BE-1-010 to KR-BE-1-021 | 24.5 engineering days | Backend Engineer, Architecture Owner, Security Owner, Database Engineer | Derived from existing task estimates; refinement required |
| B-INC-003 PROJECTS-PLATFORM-CATALOG | KR-BE-1-022 to KR-BE-1-031 | 23.0 engineering days | Backend Engineer, Architecture Owner, Security Owner, Database Engineer | Derived from existing task estimates; refinement required |
| B-INC-004 AUDIT-TRANSACTIONS-IDEMPOTENCY | KR-BE-1-032 to KR-BE-1-040 | 16.5 engineering days | Backend Engineer, Database Engineer, Security Owner | Derived from existing task estimates; refinement required |

**Direct implementation subtotal: 80.0 engineering days.**

This subtotal is the sum of the mapped existing task estimates. It is not a forecast of elapsed delivery time or total program effort.

## 5. Cross-Increment Test and Review Effort

The following existing tasks are shared verification or acceptance work. Their estimates are kept separate from the direct implementation totals so they are not counted twice.

| Existing task ID | Responsibility | Existing estimate | Principal owner role | Planning treatment |
|---|---|---:|---|---|
| KR-BE-1-042 | Repository unit tests | 3.0d | QA Owner with Backend Engineer | Allocate to applicable increment test scope during refinement |
| KR-BE-1-043 | API contract tests | 3.0d | QA Owner | Allocate to applicable API increments during refinement |
| KR-BE-1-044 | Authorization tests | 3.0d | Security Owner with QA Owner | Primarily B-INC-002 and B-INC-003 scope |
| KR-BE-1-045 | Tenant-isolation tests | 2.5d | Security Owner with QA Owner | Primarily B-INC-002 and B-INC-003 scope |
| KR-BE-1-046 | Audit verification tests | 2.0d | QA Owner with Security Owner | B-INC-004 scope |
| KR-BE-1-047 | Migration tests | 2.0d | Database Technical Lead with QA Owner | Foundation prerequisite and B-INC-004 scope |
| KR-BE-1-048 | API integration tests | 3.0d | QA Owner | Allocate across applicable API increments |
| KR-BE-1-049 | Control Plane end-to-end test | 3.0d | QA Owner | Cross-increment integration and milestone acceptance |
| KR-BE-1-050 | Security review | 2.5d | Security Owner | Cross-increment review |
| KR-BE-1-051 | Architecture review | 2.0d | Architecture Owner | Cross-increment review |
| KR-BE-1-052 | Performance baseline | 2.0d | Backend Engineer with QA Owner | Foundation evidence and B-M01 acceptance |
| KR-BE-1-053 | Documentation update | 1.5d | Documentation Owner | Cross-increment documentation |
| KR-BE-1-054 | Milestone acceptance and evidence | 1.0d | Architecture Owner with Product Owner | Official B-M01 acceptance |

**Shared test, review, and acceptance subtotal: 28.5 engineering days.**

The task estimates above are the full existing task estimates. They are not additional role-by-role estimates. Refinement must determine how the work is allocated across increments and roles without duplicating effort.

### 5.1 Existing task estimate reconciliation

| Effort category | Indicative engineering-day sum |
|---|---:|
| Direct implementation tasks mapped to B-INC-001 through B-INC-004 | 80.0d |
| Cross-increment tests, reviews, documentation, and acceptance | 28.5d |
| Combined existing B-M01 task estimate baseline | 108.5d |

This combined figure covers the existing B-M01 tasks from KR-BE-1-001 through KR-BE-1-054, grouped according to the proposed increment mapping and the shared-task treatment above.

It excludes the separate coding-agent policy task estimates and all new B-INC-001 tasks.

## 6. New B-INC-001 Security and Foundation Work

The new tasks KR-BINC-001-001 through KR-BINC-001-019 cover technology decisions, repository protections, secret scanning, CI enforcement, history assessment, safe configuration, redaction tests, and reproducible setup.

Their estimates are **TBD** because they do not have approved effort estimates in the existing B-M01 task register.

| Task range | Work area | Required owner roles | Estimate | Decision owner |
|---|---|---|---|---|
| KR-BINC-001-001 to KR-BINC-001-004 | Runtime, language, package manager, HTTP framework, and migration-tool decisions | Backend Technical Lead; Database Technical Lead for migration review | TBD | Backend Technical Lead |
| KR-BINC-001-005 to KR-BINC-001-008 | Secret policy, ignore rules, safe examples, and scanner selection | Security Owner; Repository/CI Owner; Backend Technical Lead | TBD | Security Owner |
| KR-BINC-001-009 to KR-BINC-001-010 | Local detection and blocking CI scanning | Repository/CI Owner; Security Owner | TBD | Repository/CI Owner |
| KR-BINC-001-011 to KR-BINC-001-012 | History assessment and exposure response procedure | Security Owner | TBD | Security Owner |
| KR-BINC-001-013 to KR-BINC-001-015 | Configuration failure, log redaction, and scanner exception verification | Backend Technical Lead; Security Owner | TBD | Backend Technical Lead for application tests; Security Owner for scanner policy |
| KR-BINC-001-016 to KR-BINC-001-017 | Security documentation and clean-checkout workflow verification | Documentation Owner; Backend Technical Lead | TBD | Backend Technical Lead |
| KR-BINC-001-018 | Source header standard and CI check | Backend Technical Lead | TBD | Backend Technical Lead |
| KR-BINC-001-019 | Repository Makefile for local validation | Repository/CI Owner | TBD | Repository/CI Owner |

These tasks must not be treated as zero-effort work merely because no estimate is currently available.

The increment estimate must be updated after task refinement and before the resource commitment is approved.

## 7. Role-Based Effort Planning

The existing task register identifies owner roles but does not provide a separate effort allocation for every role on shared tasks. Accordingly, this document identifies required role participation and preserves the task-level estimate without inventing a role-level split.

| Role | Expected contribution | Effort commitment |
|---|---|---|
| Backend Technical Lead | Task sequencing, technical decisions, implementation coordination, acceptance evidence | TBD |
| Backend Engineer | Application foundation, configuration, HTTP/API implementation, services, logging, integration fixes | TBD |
| Architecture Owner | Module boundaries, architecture decisions, architecture review, milestone evidence | TBD |
| Database Technical Lead | PostgreSQL access, migration strategy, schema coordination, transaction and persistence review | TBD |
| Security Owner | Secret policy, scanner decisions, authorization/security review, finding disposition | TBD |
| Repository/CI Owner | Ignore rules, local checks, CI workflow, required-check behavior, safe scanner evidence | TBD |
| QA Owner | Unit, contract, integration, authorization, migration, and end-to-end test implementation and execution | TBD |
| Documentation Owner | Setup instructions, security workflow, architecture and implementation documentation | TBD |
| Product Owner | Product acceptance inputs and milestone acceptance coordination | TBD |
| Cloud/Infrastructure Owner | Secret-manager, workload identity, and cloud integration boundaries | TBD |

The table does not imply that each role requires a separate full-time hire. Shared specialists must be allocated once against available capacity and must not be counted as a full-time resource in every increment.

## 8. Resource Commitments and Decision Ownership

The following fields follow the commitment-baseline requirements in Section 23.2 of `planning/RESOURCE_PLAN.md`.

Every commitment field remains TBD until its decision owner records an approved value in the relevant record of truth.

| Commitment field | Current value | Decision owner | Record of truth | Acceptance condition |
|---|---|---|---|---|
| Time-phased role allocation | TBD | Backend Technical Lead with program resource-planning owner | Phase-level FTE allocation sheet | Each role allocation is recorded by phase and calendar month and does not exceed available capacity |
| Named accountable owners | TBD | Relevant milestone owner | `docs/tracking/STATUS.md` and applicable milestone tracking | Each milestone and shared specialist role has an accountable owner |
| Hiring dates | TBD | Hiring Owner and leadership | Hiring pipeline | Each proposed hire has an approved role, start target, and hiring gate |
| Salary and contractor cost assumptions | TBD | Finance Owner | Budget forecast | Salary bands, rates, and loaded-cost assumptions are approved |
| Infrastructure and lab costs | TBD | Cloud/Infrastructure Owner and relevant hardware owner, with Finance Owner review | Infrastructure cost model and applicable bill of materials | Required cost inputs and quotations are recorded |
| Monthly budget forecast | TBD | Finance Owner | Budget forecast | Forecast includes budget categories and contingency |
| Dependency reconciliation | TBD | Backend Technical Lead with relevant workstream owners | Phase-level FTE allocation sheet | Allocation timing is reconciled with the dependency map and milestone dependencies |
| Baseline approval | TBD | Leadership and Finance Owner | `docs/tracking/CHANGE_TRACKING.md` | Approval, approver, and date are recorded |

No value in this table is a commitment to hire, spend, deliver, or complete by a particular date.

## 9. Increment-Level Resource Readiness

### 9.1 B-INC-001 SECURE FOUNDATION

Before approving a resource commitment for B-INC-001:

- Refine the 16.0 engineering-day direct implementation baseline.
- Estimate the 19 new foundation and security tasks.
- Confirm the required backend, architecture, database, security, QA, documentation, and repository/CI owner roles.
- Allocate shared test and review effort to the appropriate foundation scenarios.
- Record the runtime, package manager, HTTP framework, migration tool, and scanner decisions.
- Include CI integration, secret-scanning verification, remediation, and evidence preparation.
- Reconcile database and cloud prerequisites with their responsible owners.

### 9.2 B-INC-002 IDENTITY-ORGANIZATION

Before approving a resource commitment:

- Refine the 24.5 engineering-day direct implementation baseline.
- Confirm backend, database, architecture, security, and QA capacity.
- Allocate authorization and tenant-isolation verification effort.
- Confirm identity-provider and schema dependencies.
- Record unresolved dependencies as Blocked rather than assuming resource availability.

### 9.3 B-INC-003 PROJECTS-PLATFORM-CATALOG

Before approving a resource commitment:

- Refine the 23.0 engineering-day direct implementation baseline.
- Confirm backend, database, architecture, security, and QA capacity.
- Reconcile project authorization and platform-catalog ownership.
- Allocate contract and integration verification effort.
- Confirm that B-M03 PLATFORM scope is not duplicated in B-M01 CONTROL PLANE.

### 9.4 B-INC-004 AUDIT-TRANSACTIONS-IDEMPOTENCY

Before approving a resource commitment:

- Refine the 16.5 engineering-day direct implementation baseline.
- Confirm backend, database, security, and QA capacity.
- Allocate migration, transaction rollback, idempotency, and audit verification effort.
- Confirm failure-injection and integration-test environment availability.
- Include review and remediation effort before acceptance.

## 10. Capacity and Scheduling Rules

The engineering-day estimates must not be converted into calendar dates without considering:

- Actual role availability.
- Shared-task allocation.
- Dependencies between tasks.
- Parallel execution opportunities.
- Code review and security review.
- Test environment readiness.
- Defect correction and regression testing.
- Documentation and evidence preparation.
- Onboarding and other non-delivery responsibilities.

The planning owner must identify bottlenecks where a single specialist supports multiple workstreams. Shared roles must not be assigned overlapping commitments beyond their available capacity.

The schedule must be revised when actual implementation effort or dependency readiness materially differs from the assumptions used in task refinement.

## 11. Estimate Refinement and Approval

The Backend Technical Lead is responsible for coordinating estimate refinement.

Each task estimate must identify:

- Task ID and approved scope.
- Owner role and any collaborating roles.
- Dependencies and required external inputs.
- Implementation effort.
- Test, review, and remediation effort.
- Required evidence.
- Estimate assumptions and uncertainty.
- Decision owner for any unapproved commitment.

Where the existing task register supplies only a combined estimate for multiple owner roles, role-level effort must be refined by the relevant owners. The original task total must not be duplicated across participating roles.

The resulting plan must be reconciled with the program resource plan and the dependency map before any schedule or staffing commitment is approved.

## 12. Current Status

This resource plan is Proposed.

The direct implementation subtotals are derived from the existing B-M01 task estimates. The shared test and review subtotal is shown separately to avoid double-counting. The new B-INC-001 task effort and all resource commitments remain TBD.

This document does not assert that sufficient staffing is available, that the tasks can run in parallel, or that any calendar date, FTE allocation, budget, or expenditure has been approved.

The next action is to refine B-INC-001 task effort and role allocation after the increment dossier has been reviewed.
