# KR-BE-1-002 — Backend Module Boundaries

## Document Control

| Field | Value |
|---|---|
| Document | KR-BE-1-002 Module Boundaries Decision Record |
| Path | `docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BE-1-002-module-boundaries.md` |
| Status | Proposed |
| Owner role | Architecture Owner |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Plan for KR-BE-1-002](../plans/KR-BE-1-002-module-boundaries-plan.md)
- [Backend architecture, Sections 6 to 13 and 29 to 34](../../../../../architecture/BACKEND_ARCHITECTURE.md)
- [Increment tasks](../TASKS.md)
- [Increment acceptance criteria](../ACCEPTANCE_CRITERIA.md)
- [Commit procedure](../GIT_COMMIT_STEP.md)

## 1. Task Record

| Field | Value |
|---|---|
| Task | KR-BE-1-002 — Define backend module boundaries |
| Owner role | Architecture Owner |
| Required approvers | Architecture Owner |
| Depends on | `KR-BE-1-001` (Accepted, PB-029) |
| Acceptance | B-INC-001-AC-02, B-INC-001-AC-03 |
| Tests | BTS-001, BTS-004 |
| Security gates | SEC-GATE-003 |

## 2. Status and Scope

This record states the initial modules, their tiers, the allowed and prohibited dependencies and the dispositions of the open points listed in the plan. It follows `BACKEND_ARCHITECTURE.md` and adds the dependency direction that document leaves open. It is a design record. Nothing is enforced in code, no module directory exists and no automated check exists. It is Proposed until the review of Section 8 is done and the Architecture Owner records the decision. An Approved decision would not make the task Accepted.

## 3. Owner Answers (2026-10-11)

Dinesh Annayya, who states that he owns the architecture, answered the plan questions in session on 2026-10-11. These are directions for this record, not an approval.

| # | Question (plan Section 5) | Answer |
|---|---|---|
| 1 | Architecture Owner | The repository owner, Dinesh Annayya. He is also the author of the direction, so the review of Section 8 is the only independent element |
| 2 | Tiered one-way rule and prohibited list | Accepted as the candidate (Sections 5 and 6) |
| 3 | Pressure points | Accepted as listed. Credit plans are owned by Credits; Platforms refers to a plan by identifier only |
| 4 | Event types | Declared by the publisher in a contract area with no implementation. A subscriber depends on that contract only. Cycles are judged on implementation dependencies |
| 5 | Shared code | A small kernel limited to identifier, error base, clock and request-context types with no domain meaning. Any addition needs review |
| 6 | Spanning use case | Lives in the module that owns the primary aggregate. It calls the other modules' contracts and owns the transaction |
| 7 | Foreign keys across modules | Not decided here. Referred to the Database Technical Lead together with `KR-BINC-001-004`. This record only forbids reading or writing another module's tables |
| 8 | Enforcement for BTS-004 | Manual inspection against the checklist of Section 8 for this task. An automated dependency check is a follow-up task with its own tool decision |
| 9 | Directory layout | No module directory is created by this task. The first task that adds a module creates its directory under these rules |

## 4. Modules and Responsibilities

The fifteen modules and their responsibilities are those of `BACKEND_ARCHITECTURE.md` Sections 14 to 28. They are not restated beyond the one-line summary below.

| Tier | Module | Responsibility (summary) |
|---|---|---|
| 1 | Audit | Append-only record of security-sensitive and business-critical operations |
| 1 | Events | Internal event bus and the event envelope |
| 2 | Identity | Authentication context and users |
| 3 | Organizations | Tenancy, membership and roles |
| 4 | Projects | Project metadata and ownership |
| 4 | Platforms | Platform catalog, versions and capabilities |
| 4 | Artifacts | Artifact lifecycle and metadata |
| 5 | Credits | Wallets, credit plans, balances and transactions |
| 5 | Resource Allocation | Resource records, reservation and locking |
| 6 | Booking | Availability and reservations |
| 7 | Jobs | Job lifecycle and the sole authority over job state |
| 8 | Scheduler | When eligible jobs may execute; dispatch intent |
| 8 | Runs | Execution instances of a job |
| 9 | Results | Result metadata and files |
| 10 | Lab | Lab Agent boundary, inventory report, command dispatch, telemetry and result ingress |

## 5. Dependency Rule

A module may depend only on the contracts of modules in a lower tier. Modules in the same tier do not depend on each other. A contract is the module's application service interface and its declared event types. A dependency never includes another module's infrastructure, repository implementation or tables. Notification to a higher tier goes through Events. References to modules of the same or a higher tier are plain identifiers.

### 5.1 Allowed dependencies by module

| Module | May depend on (contracts only) |
|---|---|
| Audit | None |
| Events | None |
| Identity | Audit, Events |
| Organizations | Identity, Audit, Events |
| Projects | Identity, Organizations, Audit, Events |
| Platforms | Identity, Organizations, Audit, Events |
| Artifacts | Identity, Organizations, Audit, Events |
| Credits | Identity, Organizations, Platforms, Audit, Events |
| Resource Allocation | Identity, Organizations, Platforms, Audit, Events |
| Booking | Identity, Organizations, Platforms, Credits, Resource Allocation, Audit, Events |
| Jobs | Identity, Organizations, Projects, Platforms, Artifacts, Credits, Booking, Audit, Events |
| Scheduler | Jobs, Booking, Resource Allocation, Platforms, Audit, Events |
| Runs | Jobs, Platforms, Resource Allocation, Audit, Events |
| Results | Runs, Organizations, Audit, Events |
| Lab | Runs, Results, Resource Allocation, Platforms, Audit, Events |

### 5.2 Shared kernel

The shared kernel holds identifier, error base, clock and request-context types only. It has no domain meaning, no persistence code and no dependency on any module. Every module may use it. Any addition needs review under this decision.

### 5.3 Layers inside a module

Inside each module the layer order of `BACKEND_ARCHITECTURE.md` Section 29 applies: API, application, domain, ports, infrastructure. Repository interfaces are ports. Implementations are infrastructure and are used only by their own module.

## 6. Prohibited Coupling

1. A dependency from a lower tier to a higher tier, or between two modules of the same tier, in code. Use an identifier or Events.
2. Reading or writing another module's tables, directly or through a shared repository.
3. A cross-module call that bypasses the other module's application service or contract.
4. A domain object of one module used as the persisted type of another.
5. Domain types in the shared kernel.
6. A module that decides state owned by another module. Only Jobs writes job state; Scheduler, Runs, Lab and workers ask Jobs to change it.
7. A transaction that spans modules without a use case that owns it (Section 33 of the architecture).
8. A subscriber that depends on an event publisher's implementation. Only the declared event type may be depended on.
9. A lower-tier module that subscribes to a higher-tier module's events. It is a violation unless an exception is recorded in this decision.

## 7. Dispositions of the Pressure Points

| Pressure point | Disposition |
|---|---|
| Credit plans in Platforms and Credits | Credits owns plans and balances. Platforms refers to a plan by identifier only. Credits may validate a platform through the Platforms contract |
| Resource inventory in Lab and Resource Allocation | Resource Allocation owns resource records and locks. Lab reports inventory through the Resource Allocation contract |
| Job state authority | Jobs is the only writer of job state, consistent with PostgreSQL authority (architecture Section 59) |
| Scheduler dispatch to a lab | Scheduler decides and declares a dispatch-intent event. Lab (a higher tier) subscribes and commands the agent. Scheduler never touches hardware |
| Runs and Results | Runs depends on Jobs; Results depends on Runs; Lab writes through both contracts |
| Audit written by every module | Audit exposes an append operation only. Callers cannot read or change records through it. Records hold opaque entity identifiers |
| Artifact compatibility with a platform | Artifacts and Platforms are the same tier and do not depend on each other. Jobs, a higher tier, checks compatibility through both contracts |
| Project to artifact | Projects and Artifacts are the same tier. A project refers to an artifact by identifier only |

## 8. Review Checklist for BTS-004 and AC-03 (design inspection)

This is inspection of a design, not of code. No module code exists. The review states the reviewer, the limits and the disposition of each finding.

| # | Check | Result |
|---|---|---|
| 1 | Each of the fifteen modules has one responsibility and one tier | Not yet reviewed |
| 2 | Every allowed dependency in Section 5.1 points to a lower tier | Not yet reviewed |
| 3 | No module appears twice in a dependency cycle through Section 5.1 | Not yet reviewed |
| 4 | The prohibited list covers direct table access, shared repositories and cross-domain writes | Not yet reviewed |
| 5 | Each pressure point of Section 7 has one owner and one direction | Not yet reviewed |
| 6 | The decision does not contradict `BACKEND_ARCHITECTURE.md` | Not yet reviewed |
| 7 | The tier order holds against the task lists of the later increments (B-INC-002 and after) | Not yet reviewed |
| 8 | The event rule (Section 6, items 8 and 9) leaves no hidden cycle | Not yet reviewed |
| 9 | The record claims no enforcement, no automated check and no module code | Not yet reviewed |

## 9. Consequences and Follow-Up

- A follow-up task proposes the automated dependency check, with its own tool decision. It is not selected here.
- The Database Technical Lead answers the foreign-key question with `KR-BINC-001-004`. A decision there that needs a cross-module reference changes Section 6, item 2 only by a recorded change to this decision.
- The first task that adds a module creates its directory and follows Sections 5 and 6.
- `KR-BE-1-003` onward consume these rules and the secret-handling policy.

## 10. Approval Record

| Approver role | Decision | Date | Evidence |
|---|---|---|---|
| Architecture Owner | Pending | Not recorded | Waiting for the review of Section 8 |

### 10.1 Not approved by this record

- Enforcement in code, an automated dependency check or any module implementation.
- The foreign-key policy (Database Technical Lead).
- Any change to `BACKEND_ARCHITECTURE.md`.

### 10.2 Independence

The Architecture Owner is also the repository owner who directed these answers. The review of Section 8 must come from a reviewer other than the author of this record, and its record must state who reviewed and the limits of that review.
