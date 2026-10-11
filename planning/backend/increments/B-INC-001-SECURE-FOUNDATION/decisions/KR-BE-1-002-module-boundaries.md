# KR-BE-1-002 — Backend Module Boundaries

## Document Control

| Field | Value |
|---|---|
| Document | KR-BE-1-002 Module Boundaries Decision Record |
| Path | `planning/backend/increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BE-1-002-module-boundaries.md` |
| Status | Approved |
| Owner role | Architecture Owner |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Plan for KR-BE-1-002](../plans/KR-BE-1-002-module-boundaries-plan.md)
- [Backend architecture, Sections 6 to 13 and 29 to 34](../../../../../docs/architecture/BACKEND_ARCHITECTURE.md)
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

This record states the initial modules, their tiers, the allowed and prohibited dependencies and the dispositions of the open points listed in the plan. It follows `BACKEND_ARCHITECTURE.md` and adds the dependency direction that document leaves open. It is a design record. Nothing is enforced in code, no module directory exists and no automated check exists. It was Proposed until the independent review of Section 8 was done. Revision 2 (2026-10-11) answered the first review, the reviewer re-reviewed it and found it approvable, and the Architecture Owner approved it on 2026-10-11 (Section 10). The approval does not make the task Accepted. An Approved decision would not make the task Accepted.

## 3. Owner Answers (2026-10-11)

Dinesh Annayya, who states that he owns the architecture, answered the plan questions in session on 2026-10-11. These are directions for this record. The approval is in Section 10.

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

### 5.4 Ownership clarifications (revision 2)

Each row gives one owner and one direction. These clarify the responsibilities of `BACKEND_ARCHITECTURE.md` and do not change them, except where stated.

| Concept | Owner and meaning | Direction |
|---|---|---|
| Booking and resource allocation | Booking owns the customer-facing booking: quote, time window, booking lifecycle and cancellation policy. Resource Allocation owns the allocatable resource records and the operational allocation and lock of a resource, including conflict prevention on the resource | Booking calls a Resource Allocation operation to hold or release a resource. Resource Allocation never writes booking state and Booking never writes resource records. Each module owns the state transitions of its own records |
| Resource inventory | Lab owns what a Lab Agent observes: reported inventory, health, capabilities, heartbeat and telemetry. Resource Allocation owns the authoritative allocatable resource records and locks | Lab reports inventory by calling a Resource Allocation application-service operation. Resource Allocation does not subscribe to Lab events |
| Run lifecycle | Runs is the sole authority over the persisted run lifecycle and status. Lab is the external-boundary adapter: it reports execution observations by calling the Runs contract. The "execution state" in architecture Section 25 is read as the Lab-side dispatch and agent tracking, not the persisted run lifecycle | Lab, Scheduler and workers never write run state directly. Jobs remains the sole writer of job state |
| Audit | Synchronous: a use case calls the Audit append contract inside the same transaction (the `CreateBooking` sequence, architecture Section 33). Audit does not subscribe to domain events. The architecture's listing of audit as an event consumer (Section 28) is not used in the foundation increments. Event-driven audit would need a recorded exception to Section 6, item 9 | Higher tier calls Audit (tier 1) |
| Event consumers that are not modules | The WebSocket publisher, notifications, analytics and workers named in architecture Section 28 are adapters at the API and infrastructure edge. They subscribe to declared event contracts and call module application services. They are not modules and are not given a tier | They sit above all modules and follow Section 6 as callers |
| Compatibility of an artifact with a platform | Artifacts owns artifact metadata, integrity, validation and artifact-intrinsic requirements. Platforms owns supported platform versions, capabilities and runtime constraints. Jobs owns the job-creation use case that queries both contracts and rejects an incompatible pair | Jobs calls both contracts. Jobs never reads either module's tables |
| Event wording | Four different things: the bus and envelope (Events); an event type, declared in the publisher's contract area; a subscriber's dependency on that declared type (allowed, and counted as a contract dependency for the tier rule); and the delivery mechanism (infrastructure). Section 6, item 8 forbids dependence on the publisher's implementation, not on its declared event type | A subscriber of a lower-tier publisher is a downward dependency. The Scheduler dispatch event consumed by Lab is downward (tier 10 over tier 8) |

### 5.5 Shared infrastructure that is not a module

Some capabilities used by many modules belong to no module: the transaction boundary port (`KR-BE-1-033`), idempotency (`KR-BE-1-034`, `KR-BE-1-035`), request context, correlation and logging (`KR-BE-1-005`, `KR-BE-1-008`, `KR-BE-1-041`), configuration (`KR-BE-1-003`), and the migration baseline (`KR-BE-1-032`). They have no domain meaning, depend on no module and are used by modules and the API layer. A module reaches them through their ports. This adds the transaction boundary port to the shared items of Section 5.2 and does not change the kernel limit. Idempotency has no module in the architecture's map; its home is decided with `KR-BE-1-034`.

> Classification note (2026-10-11, external audit finding F-06): the request-context implementation (`src/shared/request-context.ts`: `RequestContext`, `REQUEST_ID_PATTERN`, the `AsyncLocalStorage` lifecycle and ID generation) is shared infrastructure under this section, not shared-kernel types under Section 5.2, although it sits under `src/shared`. A future dependency checker must treat it as a permitted cross-cutting dependency. It imports no module and no framework.

### 5.6 CreateBooking contract

The `CreateBooking` use case belongs to Booking, which owns the orchestration and the transaction boundary. It calls the Credits contract to reserve credits, the Resource Allocation contract to hold the resource, and the Audit append contract. It never writes another module's tables or calls another module's repository implementation. The event is published only after the authoritative state is committed (architecture Section 33). The use case requires that the contracts take part in one transaction. Whether the chosen persistence design can provide this atomicity is decided in `KR-BE-1-033`. If it cannot, that task records the alternative consistency and recovery strategy and does not claim this example is satisfied.

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
| 1 | Each of the fifteen modules has one responsibility and one tier | Reviewer: finding (overlaps). Revision 2 adds Section 5.4. Re-review: resolved |
| 2 | Every allowed dependency in Section 5.1 points to a lower tier | Reviewer: pass (both reviews) |
| 3 | No module appears twice in a dependency cycle through Section 5.1 | Reviewer: pass for the listed graph, with the qualification that future event subscriptions are not proved cycle-free |
| 4 | The prohibited list covers direct table access, shared repositories and cross-domain writes | Reviewer: pass (both reviews) |
| 5 | Each pressure point of Section 7 has one owner and one direction | Reviewer: finding. Revision 2 adds Section 5.4. Re-review: resolved |
| 6 | The decision does not contradict `BACKEND_ARCHITECTURE.md` | Reviewer: finding (Audit as event consumer, run state, booking and resource reservation). Revision 2 resolves them in Sections 5.4 to 5.6. Re-review: resolved, with the two owner confirmations of Section 10.0 |
| 7 | The tier order holds against the task lists of the later increments (B-INC-002 and after) | Reviewer: partial. Revision 2 adds the reconciliation of Section 12 for B-INC-002 to B-INC-004. Later increments are not covered. Re-review: partly resolved within the stated scope |
| 8 | The event rule (Section 6, items 8 and 9) leaves no hidden cycle | Reviewer: pass in principle, wording to clarify. Revision 2 adds the event wording of Section 5.4. Re-review: resolved |
| 9 | The record claims no enforcement, no automated check and no module code | Reviewer: pass (both reviews) |

## 9. Consequences and Follow-Up

- A follow-up task proposes the automated dependency check, with its own tool decision. It is not selected here.
- The Database Technical Lead answers the foreign-key question with `KR-BINC-001-004`. A decision there that needs a cross-module reference changes Section 6, item 2 only by a recorded change to this decision.
- The first task that adds a module creates its directory and follows Sections 5 and 6.
- `KR-BE-1-003` onward consume these rules and the secret-handling policy.

## 10. Approval Record

| Approver role | Decision | Date | Evidence |
|---|---|---|---|
| Architecture Owner | Approved | 2026-10-11 | Dinesh Annayya, who states that he owns the architecture, approved this record (revision 2) in session on 2026-10-11 and confirmed the two choices of Section 10.0. Reviewed: this record, the independent review and the re-review of Section 11 |

### 10.0 Owner confirmation

The Architecture Owner confirmed on 2026-10-11, in answer to a direct question: (1) audit writes are synchronous in the foundation scope, and event-driven Audit stays an optional later capability that needs a recorded exception to Section 6, item 9; (2) the "execution state" in architecture Section 25 means Lab-side dispatch and agent tracking, and Runs owns the persisted run lifecycle. The reviewer regards both as clarifications and not as architecture changes, provided architecture Section 28 stays an optional event-consumer capability. Rejecting either would have been an architecture change.

### 10.1 Approved scope and what is not approved

Approved: the modules, tiers, allowed dependencies, prohibited couplings, ownership clarifications (Sections 4 to 7) and the two confirmations above, as inspected by design review only.

Not approved by this record:

- Enforcement in code, an automated dependency check or any module implementation.
- The foreign-key policy (Database Technical Lead).
- Any change to `BACKEND_ARCHITECTURE.md`.
- The reconciliation of increments after B-INC-004.

### 10.2 Independence

The approver is also the repository owner who directed these answers and no human reviewer took part. The only independent element is the AI review of Section 11, which is design inspection from supplied text. An Approved decision does not make `KR-BE-1-002` Accepted, and `B-INC-001-AC-03` is not closed by this record alone.

## 11. Independent Review Record (BTS-004, B-INC-001-AC-03)

| Field | Value |
|---|---|
| Reviewer | ChatGPT (external AI reviewer chosen by the repository owner), 2026-10-11 |
| Subject | Revision 1 of this record, supplied as text, against `BACKEND_ARCHITECTURE.md` Sections 6 to 13, 29 to 34 and 59 |
| Verdict | Return for revision. `B-INC-001-AC-03` does not pass yet |
| Limits | Design inspection only. The reviewer is an AI assistant working from the text it was given. The Architecture Owner directed the answers and also decides |

| # | Severity | Finding (reviewer) | Disposition |
|---|---|---|---|
| 1 | Blocker | Booking and Resource Allocation both appear to own reservations | Accepted. Section 5.4 row 1 |
| 2 | Blocker | Lab and Resource Allocation inventory ownership ambiguous | Accepted. Section 5.4 row 2 |
| 3 | Blocker | Run state ownership not reconciled with Lab's execution state | Accepted. Section 5.4 row 3, with the reading of architecture Section 25 left for the owner to confirm (Section 10.0) |
| 4 | Blocker | Audit as an event consumer conflicts with the tier and event rules | Accepted. Synchronous audit writes chosen (Section 5.4 row 4); the owner confirms (Section 10.0) |
| 5 | Should-fix | Artifact and platform compatibility needs an ownership split | Accepted. Section 5.4 row 6 |
| 6 | Should-fix | CreateBooking needs an explicit transaction contract | Accepted. Section 5.6; atomicity left to `KR-BE-1-033` |
| 7 | Note | Event rule wording | Accepted. Section 5.4 row 7 |
| 8 | Should-fix | Later-increment compatibility only partly shown | Accepted for B-INC-002 to B-INC-004 (Section 12). Later increments stay open and are not claimed |
| 9 | Note | Scope and enforcement claims bounded; the scripted check is not enforcement | Accepted. Nothing in this record claims otherwise |

## 12. Reconciliation with Later Increment Tasks

Source: the task lists of B-INC-002, B-INC-003 and B-INC-004. Dependencies by task ID are read as module dependencies where the task names a module. This is inspection of the task lists, not of code.

| Task(s) | Source module (tier) | Target (tier) | Allowed |
|---|---|---|---|
| `KR-BE-1-010`, `-012` identity model and authentication adapter | Identity (2) | Audit, Events (1) later via `KR-BE-1-038` | Yes |
| `KR-BE-1-014` to `-018` Organization model, repositories, service, APIs | Organizations (3) | Identity (2) (`KR-BE-1-014` depends on `KR-BE-1-010`) | Yes |
| `KR-BE-1-019`, `-020`, `-021` role and permission model, authorization policy layer, tenant context | Organizations (3) for roles and membership; the policy layer and tenant context are cross-cutting request-context and application-layer work | Identity (2) | Yes if the policy layer is a shared application-layer capability and not a module. Not decided here; the owner of `KR-BE-1-019` records it |
| `KR-BE-1-022` to `-026` Project model, service, APIs, authorization | Projects (4) | Organizations (3) (`KR-BE-1-022` depends on `KR-BE-1-017` and `-021`) | Yes |
| `KR-BE-1-027` to `-031` Platform catalog | Platforms (4) | Identity, Organizations (2, 3) for administration authorization | Yes |
| `KR-BE-1-032` migration baseline | Shared infrastructure (Section 5.5), touching the tables of Identity, Organizations, Projects and Platforms | Not a module dependency | Yes. Schema migration is not a cross-module read or write |
| `KR-BE-1-033`, `-034`, `-035` transaction boundary, idempotency | Shared infrastructure (Section 5.5) | None | Yes. The home of idempotency is decided in `KR-BE-1-034` |
| `KR-BE-1-036`, `-037` Audit repository and service | Audit (1) | None | Yes |
| `KR-BE-1-038`, `-039`, `-040` audit hooks in identity, project and platform operations | Identity (2), Projects (4), Platforms (4) | Audit (1) | Yes. Synchronous append (Section 5.4) |
| `KR-BE-1-043` to `-049` tests and E2E | Test code | All | Not a module dependency. Tests follow the same rules for production code they exercise |

No task in B-INC-002 to B-INC-004 requires Projects, Platforms and Artifacts to depend on one another. Artifacts and later-increment modules (Credits, Booking, Jobs and the rest) have no task in these three increments and are not reconciled.

### 11.1 Re-review of revision 2

| Field | Value |
|---|---|
| Reviewer | ChatGPT, 2026-10-11, reading the merged record at `main` `734edfa` |
| Verdict | Approvable by the Architecture Owner, subject to explicit confirmation of the two choices (confirmed in Section 10.0). No new blocker or should-fix finding |

| Finding | Re-review result |
|---|---|
| 1 Booking and Resource Allocation | Resolved |
| 2 Lab and Resource Allocation inventory | Resolved |
| 3 Runs and Lab run state | Partly resolved; remaining item was the owner confirmation, now recorded |
| 4 Audit as event consumer | Partly resolved; remaining item was the owner confirmation, now recorded |
| 5 Compatibility split | Resolved |
| 6 CreateBooking transaction contract | Resolved at design level. Atomicity is not proved and stays with `KR-BE-1-033` |
| 7 Event wording | Resolved |
| 8 Later-increment reconciliation | Partly resolved within the stated scope (B-INC-002 to B-INC-004) |
| 9 Bounded claims | Resolved |

Direct inspection of Section 5.1 found no same-tier dependency, no upward dependency and no cycle in the listed graph. This is design evidence, not enforcement of future code.

### 11.2 Follow-up constraints from the re-review

- The role and permission policy layer and tenant context (`KR-BE-1-019`, `-020`, `-021`) stay shared application-layer capabilities and not an undeclared module dependency. The owner of `KR-BE-1-019` records this before implementation depends on it.
- Idempotency stays domain-neutral infrastructure unless `KR-BE-1-034` records a different reviewed disposition.
- The migration baseline (`KR-BE-1-032`) must not introduce shared repositories or let application code bypass ownership.
- `KR-BE-1-033` decides whether one transaction across the contracts is implementable, or records the alternative consistency and recovery strategy.
