# KR-BE-1-002 — Backend Module Boundaries Plan

## Document Control

| Field | Value |
|---|---|
| Document | KR-BE-1-002 Implementation Plan |
| Path | `docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/plans/KR-BE-1-002-module-boundaries-plan.md` |
| Status | Proposed |
| Owner role | Architecture Owner |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Increment tasks](../TASKS.md)
- [Increment acceptance criteria](../ACCEPTANCE_CRITERIA.md)
- [Backend architecture, Sections 6 to 13 and 29 to 34](../../../../../architecture/BACKEND_ARCHITECTURE.md)
- [Plan for KR-BE-1-001](KR-BE-1-001-application-structure-plan.md)
- [Evidence record for KR-BE-1-001](../evidence/KR-BE-1-001-evidence.md)
- [Commit procedure](../GIT_COMMIT_STEP.md)

## 1. Purpose and Status

This plan prepares `KR-BE-1-002` so that the Architecture Owner can settle the open boundary questions and the task can then record its decision. It is a plan, not a decision. It changes no code, creates no module directory, changes no task acceptance and approves nothing. The candidate dependency rules in Section 4 are proposals for review. The task record in `TASKS.md` remains authoritative for scope, Definition of Done and linked items.

`KR-BE-1-001` is Accepted (PB-029), so the dependency is met. The task still needs the Architecture Owner's review input.

## 2. Task Record Summary

| Field | Value |
|---|---|
| Task | KR-BE-1-002 — Define backend module boundaries |
| Owner role | Architecture Owner |
| Dependencies | `KR-BE-1-001` (Accepted); architecture review input |
| Acceptance | B-INC-001-AC-02, B-INC-001-AC-03 |
| Tests | BTS-001, BTS-004 |
| Security gates | SEC-GATE-003 |
| Outputs | Module-boundary decision or architecture update; dependency rules; architecture review evidence |
| Definition of done | Each initial module has a documented responsibility; allowed dependency directions are explicit; prohibited cycles and direct cross-domain writes are documented; reviewer findings are dispositioned |

`B-INC-001-AC-03` passes when the module responsibilities and allowed dependency directions are documented and reviewed, and identified cycles or prohibited cross-domain dependencies are resolved or explicitly dispositioned. BTS-004 asks for dependency inspection or architecture-check output, a review checklist and finding dispositions.

## 3. What the Architecture Settles and What It Leaves Open

`BACKEND_ARCHITECTURE.md` already settles the following, and this task must not contradict it:

- one deployable modular monolith with logical isolation (Sections 6 and 7);
- the layer order API, application, domain, ports, infrastructure (Sections 8 and 29);
- fifteen initial modules with a primary responsibility each (Sections 13 to 28);
- no direct access to another module's tables; cross-module interaction through application services, domain interfaces or explicit module contracts (Section 29);
- repository interfaces belong to application and domain boundaries, implementations to infrastructure (Section 30);
- transactions are owned by application use cases (Section 33);
- PostgreSQL is authoritative for state, the queue carries work and the WebSocket carries notifications (Sections 34 and 59).

It leaves open what a decision must state:

| # | Open point | Why it matters |
|---|---|---|
| A | The allowed direction between modules. Section 29 gives the layer order, not a module order | Without it, a cycle (for example Jobs, Booking, Credits and Scheduler calling each other) cannot be called a violation |
| B | Overlapping responsibilities. Credit plans appear in both Platforms ("credit-plan association") and Credits ("credit plans, platform-specific credit types"). Resource inventory appears in Lab and Resource Allocation. Job state is touched by Jobs, Runs, Scheduler and workers | Ambiguous ownership is the AC-03 fail condition |
| C | Where a use case that spans modules lives (`CreateBooking` touches Booking, Credits and Audit) | Decides who may call whom and who owns the transaction |
| D | Where shared code lives and what it may contain | A shared folder becomes a hidden coupling point |
| E | Where event types are declared, since Audit and Events are written or read by many modules | A subscriber can create a dependency on a publisher |
| F | How a violation is detected (manual inspection or an automated check) | BTS-004 asks for inspection or checker output |
| G | Whether modules may reference each other's tables through foreign keys | Touches the database design, which is the Database Technical Lead's |

## 4. Candidate Rules for Review (not decided)

### 4.1 Tiers and one-way dependency

Candidate rule: modules are placed in tiers. A module may depend only on the contracts of modules in a lower tier. Modules in the same tier do not depend on each other. Notification to a higher tier goes through Events. A dependency on a module's contract never includes its infrastructure or its tables.

| Tier | Modules | May depend on (contracts only) |
|---|---|---|
| 1 Cross-cutting | Audit, Events | Nothing in the domain. Entities are referred to by opaque identifier |
| 2 Identity | Identity | Tier 1 |
| 3 Tenancy | Organizations | Tiers 1 and 2 |
| 4 Catalog | Projects, Platforms, Artifacts | Tiers 1 to 3 |
| 5 Capacity and money | Credits, Resource Allocation | Tiers 1 to 4 |
| 6 Reservation | Booking | Tiers 1 to 5 |
| 7 Execution request | Jobs | Tiers 1 to 6 |
| 8 Execution | Scheduler, Runs | Tiers 1 to 7 |
| 9 Outputs | Results | Tiers 1 to 8 |
| 10 Lab edge | Lab | Tiers 1 to 9 |

The ordering follows the responsibilities in the architecture: a job references an artifact and a booking, a booking spends credits and holds resources, a run records an execution of a job, and the Lab module is the boundary to physical labs and feeds the modules below it. The tiers are a candidate. The architecture review may reorder them.

### 4.2 Prohibited coupling (candidate list)

1. A dependency from a lower tier to a higher tier, or between two modules of the same tier, in code. Use Events or move the shared concept down.
2. Reading or writing another module's tables, directly or through a shared repository.
3. A cross-module call that bypasses the other module's application service or contract.
4. A domain object of one module used as a persisted type of another.
5. A shared folder that holds domain types. Shared code is limited to question D.
6. A module that decides state owned by another module (for example Scheduler or Runs writing job state). The owner exposes an operation; the caller asks.
7. A transaction that spans modules without a use case that owns it (Section 33 of the architecture).

### 4.3 Pressure points the review must settle

| Pressure point | Candidate resolution |
|---|---|
| Credit plans in Platforms and Credits | Credits owns plans and balances. Platforms refers to a plan by identifier. If the architecture wants Platforms to own the association, Credits depends on Platforms and the tier order changes |
| Resource inventory in Lab and Resource Allocation | Resource Allocation owns resource records and locks. Lab reports inventory through its contract (Lab depends on Resource Allocation, as in tier 10 over tier 5) |
| Job state authority | Jobs is the only writer of job state. Scheduler, Runs and workers call Jobs operations. This matches PostgreSQL authority in Section 59 |
| Scheduler dispatch to a lab | Scheduler decides and emits a dispatch intent through Events. Lab consumes it and commands the agent. The Scheduler never touches hardware (Section 23). This makes a higher tier subscribe to a lower-tier event |
| Runs and Results | Runs depends on Jobs. Results depends on Runs. Lab writes through both contracts |
| Audit written by every module | Audit exposes an append operation only. Callers never read or change records through it. Audit holds opaque entity identifiers |

## 5. Questions for the Architecture Owner

The recommendations are not decisions. The Architecture Owner answered all nine on 2026-10-11 (recorded in `decisions/KR-BE-1-002-module-boundaries.md` Section 3): every recommendation accepted; credit plans owned by Credits; event types declared by their publisher. Putting Identity below Organizations made the tiers ten, not nine.

| # | Question | Recommendation |
|---|---|---|
| 1 | Who holds the Architecture Owner role for this task, and is the reviewer the same person as the author of the decision? | Name the role holder in the decision record. State plainly if the owner who directed the work is also the reviewer, as done for the earlier approvals |
| 2 | Adopt the tiered one-way rule of Section 4.1 and the prohibited list of Section 4.2, with the changes the review requires? | Yes, as the candidate to review. It is the simplest rule that makes a cycle visible and checkable |
| 3 | Resolve the pressure points of Section 4.3 as listed or differently? | As listed, except credit plan ownership, which needs the owner's choice because it changes a tier |
| 4 | Event types: declared by their publisher, or in a separate contracts area owned by the lowest tier that needs them? | Declared by the publisher in a contract area with no implementation. A subscriber may depend on that contract only. Cycles are judged on implementation dependencies. This is the least certain rule and needs a clear review |
| 5 | Which cross-cutting code may be shared (identifiers, error base types, clock, request context types)? | A small kernel of technology and identifier types with no domain meaning. Any addition needs review |
| 6 | Where does a spanning use case live? | In the module that owns the primary aggregate. It calls the other modules' contracts and owns the transaction |
| 7 | Foreign keys across module boundaries: allowed or forbidden? | Not decided here. Refer it to the Database Technical Lead, together with the migration tool decision `KR-BINC-001-004`. The boundary decision records only that tables are not read or written across modules |
| 8 | Enforcement for BTS-004: manual inspection now, an automated dependency check later? | Manual inspection against a written checklist for this task, because no module code exists. Propose a follow-up task to automate the check, with its own tool decision. No checker tool is evaluated here |
| 9 | Directory layout for modules in `apps/backend/src` | Not created by this task. The decision records the rule. The first task that adds a module creates its directory |

## 6. Outputs and Evidence

| Item | Content |
|---|---|
| Decision record | `decisions/KR-BE-1-002-module-boundaries.md`: the module responsibilities, tiers, allowed directions, prohibited coupling, the dispositions of Section 4.3, the answers to Section 5, and a status that follows the decision workflow (Proposed until approved) |
| Architecture update | Only if the decision contradicts or extends `BACKEND_ARCHITECTURE.md`. Otherwise the decision record cites the architecture |
| Review record (BTS-004, AC-03) | A review checklist with each module and each rule, the reviewer, the findings and the disposition of each. A generic "reviewed" is not enough |
| Dependency inspection | For this task, a table of every module with its allowed and prohibited dependencies. It is inspection of a design, not code, and the record says so |
| SEC-GATE-003 | Sanitized inspection and rescan of the change showing no populated credential value. No contribution beyond that is claimed |
| Not claimed | Enforcement in code, an automated check, any implemented module, or the closing of AC-03 for the increment |

## 7. Order of Work

1. The Architecture Owner answers Section 5 (this plan is merged first).
2. Write the decision record with the answers, status Proposed.
3. Review the record against the checklist. Use an independent reviewer; the review record states who and any independence limit.
4. Disposition each finding. Set the decision to Approved only when the required approver records it.
5. Record the evidence, then the task acceptance as a separate step.

## 8. Commit Plan

This plan: a planning-only commit, `docs(backend): plan KR-BE-1-002 module boundaries` with `Tasks: None (plan only)`.

The decision record and the task use the task's entry in `GIT_COMMIT_STEP.md`:

```text
docs(backend): define backend module boundaries [KR-BE-1-002]

Tasks: KR-BE-1-002
Acceptance: B-INC-001-AC-02, B-INC-001-AC-03
Tests: BTS-001, BTS-004
Security-Gates: SEC-GATE-003
Evidence: <replace with sanitized evidence reference>
```

## 9. Risks

| Risk | Mitigation |
|---|---|
| The tier order is wrong and a later increment needs an upward call | The review tests the order against the later increments' task lists before approval. A change after approval is a new decision |
| The decision is mistaken for enforcement | The record states that nothing is enforced in code and BTS-004 for this task is design inspection |
| Event rules (question 4) hide a cycle | The review looks at implementation dependencies and at event contracts separately |
| The task is accepted before a human architecture review | The record names the reviewer and its limits |
| Foreign-key policy is decided by accident here | Question 7 sends it to the Database Technical Lead |
