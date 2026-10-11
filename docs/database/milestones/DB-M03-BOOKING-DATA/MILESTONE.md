# DB-M03 BOOKING DATA — Milestone Dossier

**Primary Phase:** P4 BOOKING & COMMERCIAL

**Supporting Phases:** P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE; P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS; P8 PRODUCTION

**Domain:** Database

**Milestone:** DB-M03 BOOKING DATA (P4)

**Document Type:** Database milestone dossier

**Status:** Planning baseline

**Scope Authority:** This dossier defines persistence for bookings, availability, credits, ledger entries, commercial plans, and invoices. Existing milestone dossiers under `docs/**/milestones/` are authoritative for their respective milestone scopes.

---

## Ownership and Boundaries

### What this document owns

This document owns the milestone-level objectives, scope boundaries, dependencies, deliverables, risks, and exit criteria for DB-M03 BOOKING DATA.

DB-M03 BOOKING DATA extends the database foundation established by DB-M01 FOUNDATION (P0-P3) and uses core platform, resource, artifact, and storage metadata established by DB-M02 CORE DATA (P3) where commercial workflows require those references.

Its scope covers the persistence model for:

- Booking records and booking lifecycle state.
- Booking ownership and relationships to organizations, projects, identities, platforms, and resources where applicable.
- Availability windows and availability-query support.
- Resource booking constraints and conflict-prevention foundations.
- Booking status history and lifecycle timestamps.
- Credit balances and credit-account associations.
- Credit grants, allocations, holds, consumption, release, and adjustment records where required.
- Append-oriented ledger entries and balance reconciliation foundations.
- Commercial plans and plan-version metadata.
- Plan-to-organization or account associations where required.
- Invoice records and invoice line-item metadata.
- Invoice status, totals, currency, and lifecycle timestamps.
- References between bookings, credit movements, ledger entries, plans, and invoices where required.
- Relational integrity, uniqueness constraints, and indexes for the owned data model.
- RLS integration for tenant-scoped booking and commercial records.
- Migration and schema verification for DB-M03-owned tables.
- Idempotency and consistency requirements for financial or credit-affecting database operations.
- Audit integration using the foundation established by DB-M01 FOUNDATION (P0-P3).
- Handoffs to backend booking services, execution services, cloud infrastructure, and downstream database milestones.

This dossier defines the required persistence semantics and integrity boundaries. It does not define every SQL statement, API endpoint, payment-provider integration, frontend workflow, or production operational procedure.

### What this document does not own

The following responsibilities remain with their authoritative documents and milestones:

- Canonical phase definitions: `planning/PHASES.md`.
- Cross-domain architectural decisions: `planning/DECISIONS.md`.
- System architecture: `docs/architecture/`.
- PostgreSQL baseline, migration tooling, identity/organization/project schema, foundational RLS, and audit schema: DB-M01 FOUNDATION (P0-P3).
- Platform, resource, artifact, and storage metadata: DB-M02 CORE DATA (P3).
- Execution, lab, live, and results persistence: DB-M04 EXECUTION DATA (P5-P7).
- Booking API behavior, request validation, service methods, and booking workflow orchestration: B-M04 BOOKING (P4).
- Frontend booking and commercial experiences: F-M04 BOOKING (P4).
- Runtime execution dispatch and execution lifecycle: B-M05 EXECUTION (P5).
- Resource registration and platform management behavior: B-M03 PLATFORM (P3).
- Application authentication and global authorization policy: P3 CONTROL PLANE and the security domain.
- Payment processing, external payment-provider APIs, settlement, refunds, and payment reconciliation execution: the applicable backend and commercial integration documents.
- Tax calculation rules, jurisdiction-specific compliance, and accounting policy: the applicable commercial, finance, and legal owners.
- Cloud infrastructure, managed database provisioning, secret delivery, and network configuration: `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.
- Production database availability, backups, recovery, capacity, and operational access: P8 PRODUCTION and the applicable operational documents.
- Global testing policy: `docs/development/TESTING_STRATEGY.md`.
- Global release and deployment policy: `docs/development/RELEASE_PROCESS.md`.

### Ownership map

| Concern | Authoritative owner | DB-M03 BOOKING DATA responsibility |
|---|---|---|
| Canonical phase definitions | `planning/PHASES.md` | Follow the frozen model exactly |
| System architecture | `docs/architecture/` | Follow approved system boundaries |
| Cross-domain decisions | `planning/DECISIONS.md` | Consume approved decisions |
| PostgreSQL and migration foundation | DB-M01 FOUNDATION (P0-P3) | Reuse established conventions |
| Identity, organization, membership, and project schema | DB-M01 FOUNDATION (P0-P3) | Reference foundational entities |
| Platform, resource, artifact, and storage metadata | DB-M02 CORE DATA (P3) | Reference core entities where applicable |
| Booking persistence | DB-M03 BOOKING DATA (P4) | Own booking records and lifecycle persistence |
| Availability persistence | DB-M03 BOOKING DATA (P4) | Own availability windows and booking-conflict data |
| Credit accounts and credit movements | DB-M03 BOOKING DATA (P4) | Own credit and ledger persistence |
| Plans and invoices | DB-M03 BOOKING DATA (P4) | Own commercial plan and invoice records |
| Booking workflow and API | B-M04 BOOKING (P4) | Supply persistence structures and integrity constraints |
| Booking UI | F-M04 BOOKING (P4) | Supply data relationships through backend contracts |
| Execution lifecycle | B-M05 EXECUTION (P5) | Supply booking references where required |
| Execution, lab, live, and results data | DB-M04 EXECUTION DATA (P5-P7) | Supply stable booking references where required |
| Payment-provider integration | Applicable backend/commercial integration owner | Persist approved transaction references and statuses only |
| Tax and accounting policy | Applicable finance, legal, and commercial owners | Persist agreed invoice metadata without defining policy |
| Cloud infrastructure | Cloud domain | Define database requirements and environment assumptions |
| Production operations | P8 PRODUCTION and operational owners | Hand off production database requirements |
| DB-M03 tasks | `TASKS.md` | Link to task decomposition |
| DB-M03 acceptance evidence | `ACCEPTANCE_CRITERIA.md` | Link to pass/fail requirements |
| DB-M03 review | `REVIEW_CHECKLIST.md` | Link to review actions |
| DB-M03 change history | `CHANGELOG.md` | Link to accepted changes |
| DB-M03 Git procedure | `GIT_COMMIT_STEP.md` | Link to repository and commit procedure |

### Sibling document ownership

The following files are maintained alongside this dossier:

- [`TASKS.md`](TASKS.md) — task decomposition, sequencing, dependencies, and task ownership.
- [`ACCEPTANCE_CRITERIA.md`](ACCEPTANCE_CRITERIA.md) — detailed pass/fail conditions and evidence requirements.
- [`REVIEW_CHECKLIST.md`](REVIEW_CHECKLIST.md) — review actions and evidence inspection.
- [`CHANGELOG.md`](CHANGELOG.md) — accepted changes and milestone history.
- [`GIT_COMMIT_STEP.md`](GIT_COMMIT_STEP.md) — repository and commit procedure.

This dossier defines the milestone contract. It does not duplicate task-level instructions, detailed acceptance matrices, review execution records, change history, or commit procedures.

---

## 1. Objective

DB-M03 BOOKING DATA establishes the persistent data model for booking and commercial operations during P4 BOOKING & COMMERCIAL.

The milestone provides consistent, auditable, and transactionally safe records for bookings, availability, credits, ledger movements, plans, and invoices. It builds on the foundational identity, organization, project, migration, RLS, and audit conventions established by DB-M01 FOUNDATION (P0-P3), and uses the core platform and resource metadata established by DB-M02 CORE DATA (P3).

The schema must preserve booking integrity, prevent invalid resource conflicts within the defined data boundary, support traceable credit movements, and maintain consistent relationships between commercial plans, invoices, and the entities to which they apply.

### 1.1 Primary outcomes

DB-M03 BOOKING DATA must deliver the following outcomes:

1. A canonical relational representation of bookings.
2. Explicit booking ownership and association with the applicable organization, project, identity, platform, or resource.
3. Availability records and query-supporting structures.
4. A defined booking lifecycle and persisted status history where required.
5. Database-level integrity for booking references and required state values.
6. A credit-account model with clear ownership and currency or unit semantics where applicable.
7. Traceable credit grants, holds, consumption, releases, and adjustments where required.
8. An append-oriented ledger model that preserves financial or credit movement history.
9. Consistency between credit balances and their underlying movements.
10. Commercial plan records with explicit lifecycle and version semantics where required.
11. Invoice records with stable identifiers, currency, totals, status, and line-item metadata.
12. Explicit relationships between bookings, credit movements, plans, and invoices where required by the approved contract.
13. Idempotency and transaction-integrity requirements for credit-affecting operations.
14. RLS integration for organization-scoped commercial data.
15. Audit integration for relevant booking and commercial changes.
16. Repeatable migrations and automated schema verification.
17. Clear boundaries between database persistence, booking service behavior, payment-provider integrations, and accounting policy.
18. Stable data references for downstream execution and results workflows.

### 1.2 Booking outcome

Bookings must have stable identity, ownership, a defined lifecycle, and explicit references to the applicable resources or platform capabilities.

The database must support the accepted booking workflow without allowing duplicate or conflicting reservations that violate the defined booking constraints.

The schema provides persistence and integrity. Availability decisions, authorization, booking orchestration, and user-facing conflict resolution remain with B-M04 BOOKING (P4) and the applicable service contracts.

### 1.3 Availability outcome

The availability model must represent the intervals and resource constraints needed to determine whether a booking can be accepted.

Availability records must have unambiguous time semantics and explicit relationships to the relevant resource or resource class.

The model must support conflict checks that are correct under concurrent booking attempts. A read-only availability query alone is not sufficient to prevent conflicting bookings.

### 1.4 Credits and ledger outcome

The credit model must represent the account or ownership scope, available balance semantics, and traceable movements that affect that balance.

Credit-affecting operations must be designed so that concurrent requests, retries, and partial failures do not silently create or lose credits.

Ledger entries must retain sufficient information to reconstruct the balance according to the approved accounting model. Corrections should be represented as explicit adjustments or reversals rather than silently rewriting historical movements.

### 1.5 Plans and invoices outcome

The commercial schema must represent plan definitions and their approved associations with organizations or accounts.

Invoice records must capture the commercial document identity, applicable currency, amounts, status, and line-item details required by the accepted billing contract.

The database records commercial facts and relationships. It does not independently determine tax policy, calculate legally binding tax amounts, issue payment-provider requests, or establish accounting compliance.

### 1.6 Security and audit outcome

Booking and commercial records must follow the foundational RLS and audit conventions established by DB-M01 FOUNDATION (P0-P3).

Tenant-scoped records must be protected according to their organization and ownership relationships. Credit balances, ledger entries, plans, and invoices must not become visible or mutable outside their authorized scope.

Relevant changes must be auditable under the accepted policy. Audit coverage depends on both database support and the backend services responsible for emitting required events.

### 1.7 Completion principle

DB-M03 BOOKING DATA is complete when its owned entities and relationships are implemented through the approved migration workflow, their integrity requirements are enforced, and representative concurrency, access-control, and consistency behavior is verified.

Completion requires evidence that the data model remains correct under retries and concurrent operations, not merely that booking and invoice tables exist.

Detailed pass/fail conditions belong in `ACCEPTANCE_CRITERIA.md`.

---

## 2. Scope and non-scope

### 2.1 In-scope capabilities

#### 2.1.1 Extension of the database foundation

DB-M03 must extend DB-M01 FOUNDATION (P0-P3) using its established conventions for:

- Identifiers and primary keys.
- Timestamp semantics.
- Foreign keys and relational integrity.
- Migration tooling and history.
- Database roles and privileges.
- RLS and tenant context.
- Audit persistence.
- Schema verification and test execution.

It must reuse the platform and resource identities established by DB-M02 CORE DATA (P3) where booking requires those references.

DB-M03 must not introduce a competing identity, organization, project, platform, or resource model.

#### 2.1.2 Booking identity

Each booking must have a stable identifier independent of mutable descriptive fields.

The schema must define:

- Booking identifier type.
- Required organization or account ownership.
- Requesting identity or principal reference where required.
- Project reference where applicable.
- Resource or platform association.
- Booking lifecycle state.
- Requested and confirmed time intervals.
- Creation and update timestamps.
- Idempotency reference where required.
- Approved uniqueness constraints.

The exact set of mandatory relationships must follow the approved booking contract.

#### 2.1.3 Booking ownership and tenancy

Every tenant-scoped booking must have an explicit ownership relationship.

The schema must use the organization and identity structures established by DB-M01 FOUNDATION (P0-P3).

A booking must not rely only on a client-supplied organization label or an unvalidated resource identifier.

Where project ownership is relevant, the booking must be associated with the appropriate project relationship or with an explicitly approved alternative.

RLS and service authorization must apply consistently to booking records and their related commercial data.

#### 2.1.4 Booking lifecycle

The database must persist the booking states required by the approved workflow.

The accepted model must define:

- Initial booking state.
- Pending or requested state where applicable.
- Confirmed or accepted state.
- Rejected or unavailable outcome where persisted.
- Cancellation state.
- Completion or expiry state where applicable.
- Failure state where required.
- Permitted lifecycle timestamps.
- Whether status history is retained separately.

The schema must prevent invalid state values and preserve the meaning of timestamps. Detailed transition rules and user-facing workflow behavior belong to B-M04 BOOKING (P4).

#### 2.1.5 Booking status history

Where the approved contract requires historical state transitions, the schema must represent them as traceable records.

History may include the booking identifier, previous and new state, transition timestamp, actor or system principal, and correlation reference where applicable.

A mutable current-state column must not be treated as a complete history of the booking lifecycle.

The service owner determines which transitions are valid and ensures required history is written consistently.

#### 2.1.6 Booking-to-resource relationship

A booking must explicitly reference the resource or resource class it reserves, according to the accepted booking model.

The schema must define the cardinality and enforce referential integrity.

If one booking can reserve multiple resources, the model must represent that relationship explicitly rather than storing an ambiguous list of identifiers in a text field.

Resource identity and platform metadata come from DB-M02 CORE DATA (P3). Runtime dispatch and physical resource operation remain outside DB-M03.

#### 2.1.7 Booking time semantics

Booking intervals must use a consistent and documented time representation.

The model must define:

- Start and end semantics.
- Time-zone handling.
- Whether interval endpoints are inclusive or exclusive.
- Validation of interval ordering.
- Treatment of daylight-saving transitions where applicable.
- Handling of open-ended or recurring intervals, if supported.
- The distinction between requested and confirmed intervals.

The database should enforce basic interval validity, such as requiring the end to follow the start.

Recurring bookings are not implied by this milestone; they require an explicit approved contract.

#### 2.1.8 Availability windows

The availability schema must represent windows during which a resource or resource class may be booked.

The model must define:

- Stable availability record identity where needed.
- Resource or resource-class relationship.
- Start and end timestamps.
- Availability type or status.
- Applicable ownership or visibility scope.
- Source or provenance where required.
- Creation and update timestamps.
- Effective lifecycle semantics.

The schema must distinguish declared availability from a final booking acceptance decision.

Maintenance windows, operational health, and live resource state may be inputs to availability but remain owned by the relevant platform, execution, lab, and operational services.

#### 2.1.9 Availability exceptions and blocking windows

Where the accepted contract supports unavailable periods, the schema must represent blocking windows or exceptions explicitly.

Examples may include maintenance, administrative blocks, or resource unavailability.

The model must identify the relevant resource and interval, along with the applicable status and provenance.

A blocking record must not be treated as a completed maintenance operation or proof of physical state.

The service owner determines how blocking windows interact with bookings and how conflicts are surfaced.

#### 2.1.10 Booking conflict integrity

The data model must support preventing overlapping confirmed bookings when the accepted resource model disallows overlap.

The design must account for concurrent transactions. Two requests must not both reserve the same exclusive resource and interval merely because both observed the resource as available before either committed.

Depending on the approved PostgreSQL design, this may use range constraints, exclusion constraints, locking, serializable transactions, or another reviewed mechanism.

The selected mechanism and its limits must be documented and tested.

#### 2.1.11 Booking idempotency

Where booking creation or confirmation supports retryable requests, the schema must persist the idempotency information required to prevent duplicate logical operations.

The model must define:

- Idempotency-key scope.
- Associated organization or caller scope.
- Operation identity.
- Uniqueness semantics.
- Retention or expiry requirements.
- Relationship to the resulting booking.
- Behavior when the same key is reused with different request content.

The backend service owns request interpretation and response replay. DB-M03 provides the persistence and uniqueness foundations.

#### 2.1.12 Credit account identity

The credit model must define a stable account identifier and its ownership scope.

The account may be associated with an organization, customer, or another approved commercial principal.

The schema must document:

- Account identity.
- Owning organization or principal.
- Credit unit or currency semantics.
- Lifecycle state.
- Creation and update timestamps.
- Uniqueness rules.
- Whether multiple accounts per organization are permitted.
- Whether credits are transferable.

The model must not assume that all credits are interchangeable across plans, organizations, or commercial contexts unless the approved contract explicitly establishes that rule.

#### 2.1.13 Credit balance representation

The schema must define how a credit balance is represented and reconciled with credit movements.

If a cached or materialized balance is stored for efficient access, its relationship to the ledger must be explicit.

The model must define which value is authoritative and how consistency is maintained.

Balance updates and ledger inserts that represent one logical operation must be coordinated transactionally where both are stored in PostgreSQL.

A balance must not be silently adjusted without a corresponding traceable movement when the ledger contract requires one.

#### 2.1.14 Credit grants and allocations

Where the commercial contract supports credit grants or allocations, the schema must represent their origin and ownership.

Records may need to identify:

- The target credit account.
- Granted amount or units.
- Source plan, promotion, purchase, or administrative action where applicable.
- Effective time.
- Expiry time where applicable.
- Status.
- Reference to the corresponding ledger movement.
- Actor or provenance metadata where required.

The database must enforce applicable positive-value and uniqueness constraints. Eligibility and promotional rules belong to the commercial service owner.

#### 2.1.15 Credit holds and reservations

Where booking requires reserving credits before final consumption, the schema must represent the hold separately from the final debit.

The model must define:

- Hold identity.
- Associated account.
- Booking or operation reference.
- Reserved amount.
- Hold state.
- Creation and expiry timestamps.
- Release or consumption reference.
- Idempotency semantics.

A held amount must not be counted as both freely available credit and permanently consumed credit.

The backend booking and credit services own hold lifecycle orchestration. The database must provide the constraints and transactional structures required for consistency.

#### 2.1.16 Credit consumption and release

The schema must support recording consumption, release, and adjustment operations where required by the approved credit model.

A release must be distinguishable from a new grant. A reversal must be distinguishable from deletion of the original movement.

The model must preserve links between the original movement and its reversal or correction when that relationship is meaningful.

The database must prevent invalid duplicate consumption or release records where a uniqueness or state constraint can enforce the accepted rule.

#### 2.1.17 Append-oriented ledger

The credit or financial ledger must preserve traceable movements.

A ledger entry should include the relevant account, amount or unit delta, movement type, effective timestamp, recorded timestamp where distinct, source reference, idempotency reference where applicable, and correlation or audit context where required.

The approved model must define sign conventions and units.

Ordinary application operations must not silently rewrite historical ledger entries. Corrections should be recorded as explicit compensating entries or approved adjustments.

#### 2.1.18 Ledger ordering and reconciliation

The schema must support deterministic retrieval of ledger movements and balance reconciliation.

The design must define how entries are ordered when timestamps are equal, for example through a stable sequence or unique identifier.

If a balance snapshot or cached balance is maintained, the model must provide sufficient references to reconcile it against the applicable movements.

The database should enforce relationships and uniqueness rules that prevent duplicate application of the same logical movement.

Reconciliation execution, alerting, and operational response belong to the relevant backend and production owners.

#### 2.1.19 Credit operation atomicity

Operations that change a credit balance and append the corresponding ledger movement must be atomic within the supported database transaction boundary.

The schema and constraints must support safe handling of:

- Concurrent consumption attempts.
- Duplicate requests.
- Hold creation.
- Hold release.
- Hold consumption.
- Reversal and adjustment.
- Transaction rollback.
- Retry after an uncertain response.

The exact transaction and locking strategy belongs to the backend implementation, but the data model must not make consistent execution impossible.

#### 2.1.20 Commercial plan identity

The schema must define stable identities for commercial plans.

The model must distinguish a plan's stable identity from its descriptive name and any versioned commercial terms.

Required attributes may include a plan key, display name, description, lifecycle state, and timestamps according to the approved contract.

A plan name must not be treated as an immutable identifier.

#### 2.1.21 Plan versions and terms

Where plans can change over time, the schema must represent versioned terms or otherwise preserve the terms applicable to an existing booking or invoice.

The model must define:

- Plan identity.
- Plan version or effective period.
- Included credits or units where applicable.
- Price and currency where applicable.
- Validity period.
- Status.
- Whether a published plan version is immutable.
- How bookings and invoices reference the applicable version.

A change to a current plan must not silently rewrite the commercial terms of historical bookings or invoices.

Eligibility, pricing policy, discounts, and tax calculation remain with the applicable commercial owners.

#### 2.1.22 Plan assignment and entitlement references

Where a plan is assigned to an organization or commercial account, the schema must represent that relationship explicitly.

The model must define the effective period and lifecycle semantics of the assignment where required.

The schema may store plan-associated credit allocations or references to credit grants, but it must not duplicate the complete credit ledger.

Plan assignment does not automatically establish that a booking is authorized or that a payment has succeeded. Those decisions belong to the relevant services.

#### 2.1.23 Invoice identity and lifecycle

The schema must define a stable invoice identifier and any required human-readable invoice number.

The model must distinguish internal identity from an externally issued or legally significant invoice number.

Invoice lifecycle state must have explicit semantics, such as draft, issued, paid, voided, or another approved set.

The schema must define required lifecycle timestamps and the relationships between invoice status and relevant commercial records.

Exact legal invoice numbering, tax treatment, and jurisdictional requirements belong to the applicable finance and legal owners.

#### 2.1.24 Invoice line items

The invoice model must represent line items where required by the approved invoice contract.

Each line item must have a stable relationship to its invoice and the required description, quantity or units, unit amount, line amount, and applicable tax metadata.

If a line item references a plan or booking, the relationship must be explicit where required.

Historical invoice terms must remain interpretable even if a referenced plan later changes. The model must preserve the applicable invoiced values rather than relying solely on mutable current plan data.

#### 2.1.25 Invoice totals and currency

The schema must define amount representation and currency semantics.

The implementation must avoid floating-point representations for exact monetary values where they could introduce rounding errors.

The accepted model must define:

- Currency code or approved unit.
- Precision and scale.
- Line-item amount semantics.
- Subtotal representation.
- Tax and adjustment fields where required.
- Total amount semantics.
- Rounding policy reference where applicable.

The database must enforce the applicable value and consistency constraints. Tax calculation and accounting policy remain outside DB-M03.

#### 2.1.26 Invoice relationships

The schema must define relationships between invoices and the commercial records they represent.

Depending on the approved contract, an invoice may reference an organization, account, plan assignment, booking, credit purchase, or other commercial source.

The relationship must preserve the provenance needed to explain the invoice without assuming that every invoice corresponds to exactly one booking.

Foreign keys and relationship cardinality must reflect the accepted model.

#### 2.1.27 Invoice status history

Where invoice status history is required, the schema must retain the status transitions and relevant timestamps or provenance.

The model must distinguish invoice status from payment-provider status and from the state of a related booking.

Payment-provider events, settlement execution, refunds, and reconciliation processing belong to the relevant integration services.

#### 2.1.28 Commercial record consistency

The schema must define the required relationships among plans, plan assignments, credit accounts, credit movements, bookings, and invoices.

The model must avoid duplicating authoritative values across tables without a clear reason.

Where a value is intentionally snapshotted for historical interpretation, its meaning and source must be documented.

The schema must define which records are authoritative for current balance, historical commercial terms, invoice totals, and booking state.

#### 2.1.29 RLS and commercial data isolation

All tenant-scoped booking and commercial records must follow the RLS and tenant-context conventions established by DB-M01 FOUNDATION (P0-P3).

The model must identify the ownership path for each protected record, including related line items and ledger movements.

RLS policies must prevent a tenant from reading or modifying another tenant's bookings, credit balances, ledger entries, plans where access is restricted, or invoices.

Tests must cover related-record access, not only direct access to the top-level table.

#### 2.1.30 Audit integration

Relevant booking and commercial changes must use the audit conventions established by DB-M01 FOUNDATION (P0-P3).

Potentially auditable changes include booking creation or cancellation, credit grants and adjustments, ledger-affecting operations, plan publication, and invoice lifecycle changes.

The exact required event set is determined by the security and backend owners.

DB-M03 provides the data relationships and constraints needed for traceability. It does not redefine the foundational audit schema or independently implement every application audit event.

#### 2.1.31 Migration and schema verification

All DB-M03-owned tables and constraints must be introduced through the approved migration workflow.

The migration set must support initialization after DB-M01 FOUNDATION (P0-P3) and DB-M02 CORE DATA (P3).

Schema verification must check the presence of required entities, constraints, indexes, and RLS policies.

Migrations must not require undocumented manual database modifications.

#### 2.1.32 Database tests

Tests must cover the correctness of the booking and commercial schema.

Relevant cases include:

- Booking identity and ownership.
- Valid booking intervals.
- Availability and conflicting booking constraints.
- Concurrent reservation attempts.
- Booking idempotency.
- Credit account ownership.
- Ledger uniqueness and immutability.
- Balance and ledger consistency.
- Credit hold and release references.
- Plan versioning.
- Invoice line-item integrity.
- Monetary precision and currency consistency.
- RLS isolation.
- Migration initialization and history.
- Audit integration.

Global testing conventions belong to `docs/development/TESTING_STRATEGY.md`.

#### 2.1.33 Development and integration workflow

The milestone must provide a documented workflow for applying DB-M03 migrations to a database initialized through DB-M01 FOUNDATION (P0-P3) and DB-M02 CORE DATA (P3).

The workflow must identify prerequisites, migration commands, schema verification, and test execution.

Destructive reset commands must be restricted to disposable databases.

#### 2.1.34 Error and integrity behavior

The database must reject invalid records and relationships where constraints can enforce the accepted rules.

Relevant failures include:

- Invalid booking interval.
- Duplicate booking idempotency key.
- Conflicting exclusive-resource booking.
- Invalid credit account reference.
- Duplicate credit movement.
- Invalid hold release or consumption reference.
- Invalid plan version reference.
- Invalid invoice line-item relationship.
- Invalid monetary amount or currency representation.
- Unauthorized RLS access.

The backend owns mapping these failures to public API behavior. DB-M03 must ensure that the database integrity rules and failures are observable to trusted service and test infrastructure.

#### 2.1.35 Documentation and downstream handoff

DB-M03 must document the booking and commercial schema, relationship semantics, credit and ledger invariants, plan versioning, invoice structure, and RLS assumptions.

It must provide stable booking references for DB-M04 EXECUTION DATA (P5-P7) where the execution contract requires them.

It must also identify which commercial and payment behaviors remain with backend services and external integration owners.

Task decomposition, detailed acceptance evidence, review execution, change history, and commit procedure remain in sibling files.

### 2.2 Explicit non-scope

The following are outside DB-M03 BOOKING DATA unless an approved scope change explicitly assigns them to this milestone:

- PostgreSQL foundation and migration tooling.
- Identity, organization, project, and foundational audit schema.
- Platform, resource, artifact, and storage metadata schema.
- Booking frontend screens and user interaction design.
- Booking API endpoints and workflow orchestration.
- Runtime execution dispatch and execution lifecycle persistence.
- Lab Agent and physical robot control.
- Live video, telemetry, and results persistence.
- Payment-provider API implementation.
- Card-data storage or payment credential handling.
- Payment settlement execution and external reconciliation.
- Refund execution through external payment providers.
- Tax calculation policy and jurisdiction-specific legal compliance.
- Accounting standards and finance policy.
- Commercial pricing strategy and product policy.
- Cloud infrastructure provisioning and secret distribution.
- Production backup, recovery, high availability, and capacity management.
- Global CI, repository workflow, and release orchestration.
- Analytics, revenue reporting, and data warehouse pipelines.
- Production-scale performance guarantees without representative measurement.

DB-M03 may define persistence fields and references needed to support these capabilities. It must not take over their implementation ownership.

### 2.3 Canonical phase relationship table

| Phase | Relationship to DB-M03 BOOKING DATA | Boundary |
|---|---|---|
| P0 FOUNDATION | Supplies engineering and database conventions | DB-M03 follows established migration and verification conventions |
| P1 STUDIO | Supplies foundational organization and project context | DB-M03 does not own Studio workflows |
| P2 BUILD & ARTIFACT | Supplies applicable artifact or build references where commercial contracts require them | DB-M03 does not own build execution or artifact storage |
| P3 CONTROL PLANE | Supplies identity, organization, project, platform, and resource references | DB-M03 reuses foundational entities and constraints |
| P4 BOOKING & COMMERCIAL | Primary phase for DB-M03 BOOKING DATA | DB-M03 owns booking, availability, credits, ledger, plans, and invoice persistence |
| P5 EXECUTION | Consumes booking references for execution where required | DB-M04 EXECUTION DATA (P5-P7) owns execution persistence |
| P6 LAB & ROBOT | Consumes applicable booking and resource references | DB-M04 EXECUTION DATA (P5-P7) owns applicable lab and robot persistence |
| P7 LIVE & RESULTS | Consumes applicable booking and execution references | DB-M04 EXECUTION DATA (P5-P7) owns live and results persistence |
| P8 PRODUCTION | Uses commercial and booking data under production operational controls | Production operations remain with P8 PRODUCTION and the applicable operational owners |

### 2.4 Canonical database milestone relationship table

| Database milestone | Phase mapping | Relationship to DB-M03 BOOKING DATA |
|---|---|---|
| DB-M01 FOUNDATION (P0-P3) | P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE | Supplies PostgreSQL, migration, identity, organization, project, RLS, and audit foundations |
| DB-M02 CORE DATA (P3) | P3 CONTROL PLANE | Supplies platform, resource, artifact, and storage metadata |
| DB-M03 BOOKING DATA (P4) | P4 BOOKING & COMMERCIAL | Owns bookings, availability, credits, ledger, plans, and invoices |
| DB-M04 EXECUTION DATA (P5-P7) | P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS | Owns execution, lab, live, and results persistence |

### 2.5 Canonical cross-domain milestone mapping

| Domain | Canonical milestone | Relationship to DB-M03 BOOKING DATA |
|---|---|---|
| Frontend | F-M01 STUDIO FOUNDATION (P0-P1) | Consumes foundational application context |
| Frontend | F-M02 PROJECTS (P1) | Consumes project and organization context |
| Frontend | F-M03 BUILD & ARTIFACT (P2) | Consumes artifact data through approved service contracts |
| Frontend | F-M04 BOOKING (P4) | Consumes booking and commercial data through approved backend contracts |
| Frontend | F-M05 EXECUTION (P5) | Consumes execution data owned by the execution domain |
| Frontend | F-M06 LIVE (P7) | Consumes live data through approved service contracts |
| Frontend | F-M07 RESULTS (P7) | Consumes results through approved service contracts |
| Backend | B-M01 CONTROL PLANE (P3) | Supplies foundational identity and ownership relationships |
| Backend | B-M02 ARTIFACT (P2-P3) | Supplies applicable artifact references |
| Backend | B-M03 PLATFORM (P3) | Supplies platform and resource references |
| Backend | B-M04 BOOKING (P4) | Owns booking service behavior and uses DB-M03 persistence |
| Backend | B-M05 EXECUTION (P5) | Uses booking references and owns execution service behavior |
| Backend | B-M06 RESULTS (P6-P7) | Uses applicable booking references and owns results service behavior |
| Backend | B-M07 PRODUCTION (P8) | Uses commercial data under production operational controls |
| Database | DB-M01 FOUNDATION (P0-P3) | Supplies the foundational schema and security conventions |
| Database | DB-M02 CORE DATA (P3) | Supplies platform, resource, artifact, and storage metadata |
| Database | DB-M03 BOOKING DATA (P4) | Owns this booking and commercial data model |
| Database | DB-M04 EXECUTION DATA (P5-P7) | Owns execution, lab, live, and results persistence |
| Cloud | C-M01 FOUNDATION (P0) | Supplies cloud foundation conventions |
| Cloud | C-M02 DEVELOPMENT (P1-P3) | Supplies development environment infrastructure |
| Cloud | C-M03 STAGING (P4-P7) | Supplies staging infrastructure for integration |
| Cloud | C-M04 PRODUCTION (P8) | Owns production infrastructure and deployment controls |

### 2.6 Required data invariants

All DB-M03 implementations must preserve these invariants:

- **Stable booking identity:** bookings have stable identifiers independent of mutable names or descriptions.
- **Explicit ownership:** every tenant-scoped booking and commercial record has an unambiguous ownership path.
- **Valid intervals:** booking and availability intervals follow the accepted time semantics and ordering constraints.
- **Conflict safety:** concurrent requests cannot silently create conflicting reservations for an exclusive resource.
- **Idempotent operations:** retryable booking and credit operations have explicit uniqueness and replay semantics.
- **Ledger traceability:** credit-affecting operations are represented by traceable movements.
- **No silent history rewrite:** historical ledger entries and issued invoice facts are not silently overwritten.
- **Balance consistency:** stored balances, holds, and ledger movements follow one documented accounting model.
- **Plan version stability:** changes to current plan terms do not silently rewrite historical commercial terms.
- **Invoice integrity:** invoice totals and line items follow the accepted precision, currency, and relationship rules.
- **Tenant isolation:** booking, credit, ledger, plan, and invoice records follow the approved RLS boundary.
- **Audit traceability:** required changes use the audit foundation established by DB-M01 FOUNDATION (P0-P3).
- **Foundational reuse:** identity, organization, project, platform, and resource references reuse their authoritative models.
- **Domain ownership:** execution, lab, live, and results persistence remains with DB-M04 EXECUTION DATA (P5-P7).
- **No implied payment success:** an invoice or credit record does not prove that an external payment succeeded unless verified by the owning service.
- **Documented limitations:** the database schema does not imply unsupported legal, accounting, payment, or production guarantees.

---

## 3. Dependencies

### 3.1 DB-M01 FOUNDATION (P0-P3)

DB-M03 depends on DB-M01 FOUNDATION for:

- PostgreSQL baseline and supported environment assumptions.
- Migration tooling and history.
- Identity, organization, membership, and project schema.
- Identifier and timestamp conventions.
- Foreign-key and constraint conventions.
- Database roles and least-privilege expectations.
- RLS and tenant-context conventions.
- Audit persistence and provenance conventions.
- Schema verification and database testing workflow.

DB-M03 must extend these foundations without creating competing identity or ownership representations.

### 3.2 DB-M02 CORE DATA (P3)

DB-M03 may require platform, resource, artifact, and storage metadata references established by DB-M02 CORE DATA.

Required alignment includes:

- Stable platform and resource identifiers.
- Resource ownership or visibility scope.
- Platform and resource lifecycle semantics.
- Artifact references where commercial terms involve artifacts.
- Approved metadata relationships.
- Deprecation and availability assumptions.

DB-M03 does not own platform or resource registration. It must document what happens when a referenced platform or resource is disabled, deprecated, or otherwise unavailable.

### 3.3 B-M04 BOOKING (P4)

B-M04 BOOKING depends on the booking, availability, credit, plan, ledger, and invoice schema for persistence.

Required alignment includes:

- Booking lifecycle semantics.
- Resource reservation cardinality.
- Conflict prevention.
- Idempotency scope.
- Credit hold and consumption behavior.
- Invoice and plan relationships.
- Audit-event requirements.
- Transaction boundaries.
- Error behavior for integrity violations.

DB-M03 owns the data model and database-level constraints. B-M04 BOOKING owns API behavior, workflow orchestration, authorization checks, and business-rule execution.

### 3.4 F-M04 BOOKING (P4)

F-M04 BOOKING consumes the booking and commercial data through backend contracts.

The frontend requires stable status values and clear semantics for availability, booking outcomes, credits, plans, and invoice presentation.

DB-M03 does not define frontend rendering, navigation, interaction, or error presentation. The backend contract must provide the fields and status mapping required by the frontend.

### 3.5 B-M05 EXECUTION (P5)

B-M05 EXECUTION may require a durable reference to the booking that authorizes or contextualizes execution.

DB-M03 must provide stable booking identifiers and lifecycle semantics that the execution service can reference.

The exact execution-start rules, runtime dispatch, cancellation behavior, and execution lifecycle remain with B-M05 EXECUTION and the applicable execution data owner.

### 3.6 DB-M04 EXECUTION DATA (P5-P7)

DB-M04 EXECUTION DATA may need to reference booking identifiers and applicable commercial context.

DB-M03 must document the stable booking reference and the lifecycle states that downstream services may rely on.

DB-M04 owns execution, lab, live, and results records. It must not duplicate booking, credit, ledger, plan, or invoice ownership.

### 3.7 Commercial plan contract

The plan schema depends on an approved commercial plan contract.

The contract must define:

- Plan identity.
- Versioning and effective dates.
- Included credits or units where applicable.
- Price and currency where applicable.
- Assignment scope.
- Plan status and deprecation behavior.
- Whether published plan terms are immutable.
- The relationship between plans, bookings, credit grants, and invoices.

Pricing strategy, discount policy, tax policy, and legal terms remain with the relevant commercial, finance, and legal owners.

### 3.8 Credit and ledger semantics

The credit model depends on an agreed definition of the credit unit and balance behavior.

Required decisions include:

- Whether credits are monetary or non-monetary units.
- Whether balances can become negative.
- Whether credits expire.
- Whether credits are transferable.
- How holds affect available balance.
- How consumption and release are represented.
- How adjustments and reversals are recorded.
- How balance snapshots are reconciled.
- Whether multiple credit accounts may exist per organization.
- How duplicate operations are detected.

These decisions must be documented before the schema is accepted. The database must not invent commercial policy through undocumented column semantics.

### 3.9 Booking conflict contract

The booking model depends on an agreed resource reservation contract.

The contract must define:

- The resource or resource class being reserved.
- Exclusive versus shared reservation semantics.
- Interval boundary behavior.
- Permitted overlaps.
- Whether availability can change after a booking is requested.
- How maintenance and blocking windows affect reservations.
- How concurrent booking attempts are resolved.
- How cancellation and expiry release a reservation.

DB-M03 provides database-level integrity mechanisms where applicable. B-M04 BOOKING owns the workflow and conflict-response behavior.

### 3.10 Idempotency and transaction design

Booking and credit-affecting operations depend on stable idempotency semantics.

The design must identify:

- Key scope and uniqueness.
- The relationship between an idempotency key and the logical operation.
- Behavior when a key is reused with different inputs.
- Transaction boundaries.
- Locking or concurrency strategy.
- Retry behavior after a failed or uncertain response.
- Retention of idempotency records.
- Whether the result of a completed operation can be retrieved safely.

The backend owns the complete request-processing flow. DB-M03 supplies uniqueness constraints and persistence structures that make safe retries possible.

### 3.11 Invoice and monetary contract

Invoice persistence depends on an approved amount and currency model.

Required inputs include:

- Currency representation.
- Monetary precision and scale.
- Line-item semantics.
- Subtotal and total definitions.
- Tax and adjustment fields where required.
- Rounding policy reference.
- Invoice numbering requirements.
- Invoice status and lifecycle semantics.
- Historical plan-term preservation.
- Required references to bookings, accounts, or plan assignments.

DB-M03 does not define jurisdiction-specific tax law, legal invoice requirements, or accounting standards. Those remain with the relevant finance and legal owners.

### 3.12 Payment integration dependency

If external payment processing is used, DB-M03 requires an approved contract for the references and statuses persisted in the database.

The contract must distinguish internal invoice state from external payment-provider state and must identify the stable transaction reference where applicable.

DB-M03 may persist provider references and reconciliation status metadata, but it does not own payment-provider API calls, credentials, settlement, refunds, or payment reconciliation execution.

### 3.13 Security architecture dependency

Booking and commercial records must follow the security conventions established by DB-M01 FOUNDATION (P0-P3).

Required alignment includes:

- Organization and account ownership.
- Access to booking records.
- Access to credit balances and ledger history.
- Access to plan definitions and assignments.
- Access to invoices and line items.
- Privileged commercial operations.
- Audit requirements.
- Tenant-context propagation.

Tests must exercise actual ordinary application roles and applicable RLS policies.

### 3.14 Migration and verification tooling

DB-M03 depends on the migration and schema verification workflow established by DB-M01 FOUNDATION (P0-P3).

The workflow must support:

- Applying DB-M03 migrations after the earlier database milestones.
- Tracking migration history.
- Detecting migration failures.
- Verifying constraints and indexes.
- Verifying RLS policies.
- Running isolated database tests.
- Reproducing the schema in a clean supported environment.

### 3.15 Database test environment

The test environment must support concurrent database operations and realistic transaction behavior.

It must be capable of exercising:

- Simultaneous booking attempts.
- Conflicting availability windows.
- Duplicate idempotency keys.
- Concurrent credit consumption.
- Hold release and consumption.
- Ledger consistency.
- Invoice amount constraints.
- Tenant isolation.
- Migration and rollback behavior where applicable.

Tests must run against an isolated database and must not perform destructive operations against shared or production environments.

### 3.16 Cloud and production dependencies

The cloud domain supplies the database infrastructure and environment assumptions required for development, integration, and staging.

P8 PRODUCTION and the applicable operational owners define production requirements for availability, backup, recovery, access, monitoring, and capacity.

DB-M03 must document the database requirements and assumptions without claiming production readiness from development-level schema tests.

### 3.17 Dependency readiness criteria

A dependency is ready when:

- Its authoritative owner is identified.
- Required contracts are documented.
- Data ownership and relationship semantics are agreed.
- Security implications are reviewed.
- Transaction and concurrency assumptions are explicit where relevant.
- Unresolved policy decisions are recorded.
- DB-M03 can verify the applicable database-level behavior.

Dependencies must be classified as blocking, conditionally blocking, or non-blocking.

- **Blocking:** the schema cannot be correctly or securely established without the dependency.
- **Conditionally blocking:** implementation can proceed, but acceptance of the affected capability must wait.
- **Non-blocking:** the dependency affects a later or optional capability without invalidating the accepted core schema.

Detailed dependency assignments and sequencing belong in `TASKS.md`.

### 3.18 Cross-phase handoff table

| Handoff | Producing phase or milestone | Consuming phase or milestone | Required evidence |
|---|---|---|---|
| Foundational identity and ownership schema | DB-M01 FOUNDATION (P0-P3) | DB-M03 BOOKING DATA (P4) | Booking and commercial records use approved identifiers |
| Platform and resource metadata | DB-M02 CORE DATA (P3) | DB-M03 BOOKING DATA (P4) | Booking resource references use canonical identifiers |
| Booking and availability persistence | DB-M03 BOOKING DATA (P4) | B-M04 BOOKING (P4) | Booking service can persist valid records and enforce required integrity |
| Credit and ledger persistence | DB-M03 BOOKING DATA (P4) | B-M04 BOOKING (P4) | Credit operations have traceable and consistent database records |
| Plan and invoice persistence | DB-M03 BOOKING DATA (P4) | B-M04 BOOKING (P4) | Commercial services can persist plans and invoices using agreed semantics |
| Booking API and status contract | B-M04 BOOKING (P4) | F-M04 BOOKING (P4) | Frontend receives stable status and commercial fields |
| Booking references | DB-M03 BOOKING DATA (P4) | DB-M04 EXECUTION DATA (P5-P7) | Execution records can reference bookings without duplicating their data |
| Booking authorization and lifecycle | B-M04 BOOKING (P4) | B-M05 EXECUTION (P5) | Execution service uses the agreed booking reference and authorization contract |
| Database environment requirements | Database domain | C-M03 STAGING (P4-P7) | Staging environment satisfies the documented database requirements |
| Production commercial-data requirements | Database domain | P8 PRODUCTION | Operational needs and unresolved production requirements are handed off |

### 3.19 Dependency change control

Changes to booking lifecycle, resource conflict semantics, credit accounting, ledger immutability, plan versioning, or invoice representation may affect multiple services and downstream records.

A proposed change must identify:

- The affected entity or relationship.
- The business or technical reason.
- The affected migrations and constraints.
- The effect on booking or credit consistency.
- The effect on invoice history and plan terms.
- The effect on RLS and audit behavior.
- The affected backend and frontend contracts.
- The downstream impact on DB-M04 EXECUTION DATA (P5-P7).
- The migration and compatibility strategy.
- The owners required to review the change.

Changes must follow the accepted review and release process. DB-M03 must not silently redefine commercial semantics to accommodate a single service.

---

## 4. Deliverables

### 4.1 Booking schema specification

Deliver a schema specification for booking identity, ownership, resource relationships, lifecycle state, intervals, and required history.

The specification must identify required and optional references and document the intended conflict-prevention model.

**Completion evidence:** the schema is reviewable and aligned with the accepted booking contract.

### 4.2 Booking records and lifecycle fields

Deliver booking tables and constraints for the accepted lifecycle.

The model must define stable identifiers, ownership, resource references, state values, interval fields, and lifecycle timestamps.

**Completion evidence:** tests verify valid booking creation, invalid state rejection, and required relationship integrity.

### 4.3 Booking status history

Where required by the accepted contract, deliver status-history persistence with clear event ordering and provenance.

The model must distinguish current booking state from historical transitions.

**Completion evidence:** tests verify valid history relationships and deterministic retrieval.

### 4.4 Availability schema

Deliver availability-window records and the required relationship to the relevant resource or resource class.

The schema must define interval semantics, state values, ownership scope, and applicable constraints.

**Completion evidence:** tests verify valid windows and rejection of invalid intervals.

### 4.5 Blocking windows and exceptions

Where supported by the accepted contract, deliver persistence for unavailable periods and availability exceptions.

The model must identify the relevant resource, interval, state, and provenance.

**Completion evidence:** tests verify relationship integrity and the intended interaction with availability queries.

### 4.6 Booking conflict prevention

Deliver the database constraints or transaction-supporting structures required to prevent invalid overlapping reservations for exclusive resources.

The implementation must account for concurrent booking attempts.

**Completion evidence:** concurrency tests demonstrate that conflicting transactions cannot both commit a reservation that violates the accepted exclusivity rule.

### 4.7 Booking idempotency

Deliver persistence for the idempotency behavior required by the booking contract.

The schema must define key scope, uniqueness, operation association, and the relationship to the resulting booking.

**Completion evidence:** tests demonstrate that duplicate requests using the same valid key do not create duplicate logical bookings.

### 4.8 Credit account schema

Deliver credit-account identity and ownership structures.

The schema must define the account scope, credit unit or currency semantics, lifecycle state, and uniqueness rules.

**Completion evidence:** tests verify account ownership, valid account creation, and rejection of invalid references.

### 4.9 Credit grant and allocation records

Where required by the approved commercial contract, deliver records for credit grants and allocations.

The schema must preserve the source, amount, ownership, effective period, and associated ledger reference as applicable.

**Completion evidence:** tests verify valid grants, applicable amount constraints, and required relationship integrity.

### 4.10 Credit hold schema

Where booking requires reserving credits, deliver hold records with explicit identity, account relationship, amount, state, and lifecycle timestamps.

The model must distinguish reserved credits from consumed credits.

**Completion evidence:** tests verify valid hold creation, duplicate-operation prevention, and required relationships to the booking or logical operation.

### 4.11 Credit consumption, release, and adjustment records

Deliver the persistence required for consumption, release, reversal, and adjustment according to the approved credit model.

The model must preserve traceable references to the related operations and original movements where applicable.

**Completion evidence:** tests verify that duplicate consumption or release operations are rejected where the contract requires uniqueness and that corrections preserve historical traceability.

### 4.12 Ledger schema

Deliver append-oriented ledger persistence for credit or financial movements.

The model must define movement identity, account, amount or unit delta, movement type, effective time, recorded time where distinct, and required source or correlation references.

**Completion evidence:** tests verify valid ledger entries, uniqueness constraints, and rejection of invalid values.

### 4.13 Ledger immutability and reconciliation support

Deliver the constraints and role expectations needed to protect historical ledger entries from silent modification.

Where a cached balance or snapshot is stored, document its relationship to the ledger and the required reconciliation semantics.

**Completion evidence:** tests demonstrate the intended mutation restrictions and verify the required balance-to-ledger consistency checks.

### 4.14 Transaction consistency requirements

Deliver the database-level structures and documented invariants required for atomic credit-affecting operations.

The model must support coordination of balance changes, ledger inserts, and hold state changes within the approved transaction boundary.

**Completion evidence:** transaction tests verify rollback behavior and reject representative inconsistent or duplicate operations.

### 4.15 Commercial plan schema

Deliver plan identity, lifecycle, and required descriptive metadata.

The schema must distinguish stable plan identity from display names and version-specific commercial terms.

**Completion evidence:** tests verify stable identity, uniqueness, and valid lifecycle values.

### 4.16 Plan version and effective terms

Where plans are versioned, deliver the representation of version identity, effective period, included credits or units, price, currency, and approved terms.

The model must preserve the terms applicable to historical bookings and invoices.

**Completion evidence:** tests verify plan version uniqueness, valid effective periods, and the intended behavior when a new version is published.

### 4.17 Plan assignment and credit association

Where applicable, deliver the relationship between a plan and its assigned organization or commercial account.

The model must define effective dates and the relationship to relevant credit grants or entitlements without duplicating the ledger.

**Completion evidence:** tests verify assignment ownership, valid plan references, and applicable uniqueness rules.

### 4.18 Invoice schema

Deliver invoice identity and lifecycle persistence.

The model must define stable invoice identity, required numbering semantics, ownership, status, currency, amount fields, and lifecycle timestamps.

**Completion evidence:** tests verify invoice creation, uniqueness, valid status values, and required relationship integrity.

### 4.19 Invoice line-item schema

Deliver invoice line-item persistence with the required description, quantity or units, unit amount, line amount, and applicable tax metadata.

The model must preserve the invoiced values required to interpret historical invoices even when current plan terms change.

**Completion evidence:** tests verify line-item relationships, amount constraints, and historical value preservation.

### 4.20 Monetary precision and currency constraints

Deliver the approved monetary representation and applicable constraints.

The schema must avoid unsafe floating-point representations for exact monetary amounts and must document precision, scale, and currency semantics.

**Completion evidence:** tests verify valid amount representation, currency consistency, and rejection of invalid values.

### 4.21 Invoice relationships and provenance

Deliver the relationships between invoices and the commercial records they represent.

The model must support the approved association with organizations, accounts, bookings, plan assignments, or other commercial sources.

**Completion evidence:** tests verify required references and reject invalid source relationships.

### 4.22 RLS integration

Deliver RLS policies or policy extensions for DB-M03-owned tables using DB-M01 FOUNDATION (P0-P3) conventions.

The policy design must cover top-level records and related data such as line items, credit movements, and booking history.

**Completion evidence:** tests under the ordinary application role verify authorized access and reject cross-organization access.

### 4.23 Audit integration

Deliver the required relationships and integration points for booking and commercial audit events.

The implementation must reuse the foundational audit schema and must not create a competing audit data model.

**Completion evidence:** schema and service integration tests verify that relevant booking, credit, plan, and invoice operations can be associated with required audit records.

### 4.24 Migration set

Deliver ordered migrations for all DB-M03-owned tables, constraints, indexes, and RLS policies.

Migrations must use the tooling and history established by DB-M01 FOUNDATION (P0-P3).

**Completion evidence:** a clean supported database can apply the full migration sequence without undocumented manual changes.

### 4.25 Schema verification

Deliver repeatable verification for the expected booking and commercial schema.

The checks must cover required entities, constraints, indexes, foreign keys, and RLS policies within the documented verification scope.

**Completion evidence:** verification passes against the expected schema and detects representative missing or altered objects.

### 4.26 Automated database tests

Deliver automated tests for booking, availability, credits, ledger, plans, and invoices.

The suite must include constraint, relationship, concurrency, idempotency, tenant isolation, and migration cases as applicable.

**Completion evidence:** tests execute against an isolated supported PostgreSQL environment and produce repeatable results.

### 4.27 Development initialization and upgrade workflow

Deliver a documented workflow for applying DB-M03 migrations after DB-M01 FOUNDATION (P0-P3) and DB-M02 CORE DATA (P3).

The workflow must identify prerequisites, commands, schema verification, and test execution.

**Completion evidence:** a developer can initialize or upgrade the database using the documented workflow without manual schema changes.

### 4.28 Database error and integrity behavior

Deliver constraints and tests for invalid booking, credit, ledger, plan, and invoice operations.

The backend remains responsible for translating database failures into public API responses.

**Completion evidence:** representative invalid operations fail predictably and can be diagnosed by trusted service and test infrastructure without exposing secrets.

### 4.29 Execution handoff

Deliver the stable booking reference and lifecycle semantics required by DB-M04 EXECUTION DATA (P5-P7) and B-M05 EXECUTION (P5).

The handoff must identify what a booking reference guarantees and which authorization or execution-start decisions remain with the consuming service.

**Completion evidence:** downstream owners can reference booking records without duplicating booking state or assuming unsupported execution guarantees.

### 4.30 Commercial and payment handoff

Deliver documentation distinguishing database persistence from pricing policy, payment-provider state, tax calculation, and accounting requirements.

The handoff must identify which transaction references and statuses are persisted and which external operations remain with their authoritative owners.

**Completion evidence:** commercial and payment integration owners can implement their services without treating the schema as a substitute for external payment or legal compliance.

### 4.31 Deliverable ownership summary

| Deliverable | Authoritative owner | DB-M03 BOOKING DATA responsibility |
|---|---|---|
| PostgreSQL and migration foundation | DB-M01 FOUNDATION (P0-P3) | Reuse the foundation |
| Platform and resource metadata | DB-M02 CORE DATA (P3) | Reference approved identifiers |
| Booking schema | DB-M03 BOOKING DATA (P4) | Own booking persistence |
| Availability schema | DB-M03 BOOKING DATA (P4) | Own availability and blocking-window persistence |
| Credit account schema | DB-M03 BOOKING DATA (P4) | Own credit account records |
| Credit ledger | DB-M03 BOOKING DATA (P4) | Own traceable credit movement persistence |
| Plan schema | DB-M03 BOOKING DATA (P4) | Own plan and version metadata |
| Invoice schema | DB-M03 BOOKING DATA (P4) | Own invoice and line-item persistence |
| Booking API and workflow | B-M04 BOOKING (P4) | Supply persistence structures and constraints |
| Booking UI | F-M04 BOOKING (P4) | Supply data through backend contracts |
| Execution persistence | DB-M04 EXECUTION DATA (P5-P7) | Supply stable booking references |
| Payment-provider integration | Applicable backend/commercial integration owner | Persist approved references and statuses only |
| Tax and accounting policy | Applicable finance and legal owners | Persist agreed fields without defining policy |
| Production database operations | P8 PRODUCTION and operational owners | Hand off requirements |
| Detailed DB-M03 acceptance evidence | `ACCEPTANCE_CRITERIA.md` | Link to authoritative criteria |
| DB-M03 task sequencing | `TASKS.md` | Link to authoritative task plan |

### 4.32 Required milestone records

The DB-M03 BOOKING DATA directory maintains these sibling records:

| File | Purpose |
|---|---|
| `MILESTONE.md` | Objective, scope, dependencies, deliverables, risks, exit criteria, and ownership boundaries |
| `TASKS.md` | Work decomposition, sequencing, dependencies, and ownership |
| `ACCEPTANCE_CRITERIA.md` | Detailed pass/fail conditions and evidence requirements |
| `REVIEW_CHECKLIST.md` | Review actions and evidence inspection |
| `CHANGELOG.md` | Accepted changes and milestone history |
| `GIT_COMMIT_STEP.md` | Repository and commit procedure |

These records are complementary. The milestone dossier establishes the scope contract. The sibling files own task-level planning, acceptance evidence, review execution, accepted history, and commit procedure.

---

## 9. Risks

### 9.1 Conflicting concurrent bookings

**Risk:** Two concurrent requests reserve the same exclusive resource and overlapping intervals.

**Impact:** Double booking, failed execution preparation, and inconsistent commercial records.

**Mitigation:**

- Define exclusive versus shared resource semantics.
- Use a database-level conflict-prevention mechanism appropriate to the accepted model.
- Test concurrent booking transactions.
- Ensure failed conflicts leave no partial reservation or credit hold.
- Document the boundary between availability queries and authoritative reservation.

**Owner:** Database and backend booking domains.

### 9.2 Availability differs from booking acceptance

**Risk:** A resource appears available during a query but becomes unavailable before the booking is committed.

**Impact:** Confusing user experience and invalid assumptions about reservation guarantees.

**Mitigation:**

- Treat availability reads as advisory unless the contract guarantees otherwise.
- Enforce the final reservation constraint transactionally.
- Return a deterministic conflict outcome through B-M04 BOOKING (P4).
- Test simultaneous attempts and stale availability data.

**Owner:** Backend booking domain, with database support.

### 9.3 Invalid time intervals

**Risk:** Booking or availability records contain an end time that precedes or equals the start time, or use inconsistent boundary semantics.

**Impact:** Incorrect conflict checks and unreliable scheduling.

**Mitigation:**

- Define interval semantics explicitly.
- Enforce valid interval ordering.
- Use consistent timestamp and time-zone conventions.
- Test boundary cases and adjacent intervals.
- Document any recurring or open-ended interval behavior separately.

**Owner:** Database and backend booking domains.

### 9.4 Duplicate booking operations

**Risk:** A client or service retry creates multiple bookings for one logical request.

**Impact:** Duplicate reservations, duplicate credit holds, or inconsistent invoices.

**Mitigation:**

- Define idempotency-key scope.
- Enforce the intended uniqueness constraint.
- Bind keys to the logical operation and ownership scope.
- Test retries after success and uncertain responses.
- Define behavior for key reuse with different request content.

**Owner:** Backend booking domain, with database support.

### 9.5 Booking ownership is ambiguous

**Risk:** A booking lacks a reliable relationship to the owning organization or authorized principal.

**Impact:** Unauthorized access and inconsistent commercial attribution.

**Mitigation:**

- Enforce required ownership relationships.
- Reuse DB-M01 FOUNDATION (P0-P3) identifiers.
- Validate ownership in the service layer.
- Apply RLS to booking records.
- Test invalid and cross-organization references.

**Owner:** Database and security domains.

### 9.6 Resource reference becomes invalid

**Risk:** A booking references a resource that is deleted, deprecated, or no longer eligible for reservation.

**Impact:** Invalid reservations and failures in downstream execution preparation.

**Mitigation:**

- Define reference and lifecycle semantics.
- Preserve historical references where required.
- Enforce foreign keys.
- Validate resource eligibility in B-M04 BOOKING (P4).
- Coordinate lifecycle changes with DB-M02 CORE DATA (P3).

**Owner:** Database and backend platform domains.

### 9.7 Credit balance diverges from the ledger

**Risk:** A balance changes without a corresponding ledger movement, or the ledger records a movement that is not reflected in the balance.

**Impact:** Incorrect available credits and unreliable commercial records.

**Mitigation:**

- Define the authoritative balance model.
- Coordinate balance changes and ledger inserts transactionally.
- Use stable source references and idempotency constraints.
- Test rollback and concurrent operations.
- Provide reconciliation semantics and evidence.

**Owner:** Database and backend commercial domains.

### 9.8 Duplicate credit consumption

**Risk:** Retried or concurrent requests consume the same credits more than once.

**Impact:** Overcharging or negative balances inconsistent with the accepted policy.

**Mitigation:**

- Define logical operation identity.
- Enforce idempotency or uniqueness constraints.
- Use appropriate transaction and locking behavior.
- Test duplicate and concurrent consumption.
- Ensure failed operations do not leave partial ledger state.

**Owner:** Backend commercial domain, with database support.

### 9.9 Credit holds are double-counted

**Risk:** Reserved credits remain fully available while also being treated as consumed, or are consumed twice when a hold is finalized.

**Impact:** Incorrect balances and overspending.

**Mitigation:**

- Define available, held, and consumed balance semantics.
- Give holds explicit states and stable identities.
- Link hold consumption and release to the originating hold.
- Make finalization idempotent.
- Test hold, release, and consumption races.

**Owner:** Database and backend commercial domains.

### 9.10 Credit release occurs more than once

**Risk:** A retry releases the same hold repeatedly or creates duplicate credit restoration.

**Impact:** Artificial credit creation or inconsistent account balances.

**Mitigation:**

- Enforce unique logical release operations.
- Reference the original hold and movement.
- Define terminal hold states.
- Test duplicate release attempts.
- Preserve an explicit history of corrections.

**Owner:** Backend commercial domain, with database support.

### 9.11 Ledger history is rewritten

**Risk:** Historical ledger entries can be modified or deleted by ordinary application operations.

**Impact:** Loss of financial or credit provenance and inability to reconstruct balances.

**Mitigation:**

- Restrict update and delete privileges.
- Use append-oriented corrections or reversals.
- Test mutation restrictions.
- Audit privileged adjustments.
- Document approved retention and correction procedures.

**Owner:** Database and security domains.

### 9.12 Unclear credit units

**Risk:** Credit amounts are interpreted inconsistently across plans, accounts, and bookings.

**Impact:** Incorrect consumption, conversion, or commercial presentation.

**Mitigation:**

- Define the unit and precision.
- Clarify whether units are monetary or non-monetary.
- Define transfer and conversion rules.
- Validate amount semantics at the service boundary.
- Avoid implicit mixing of incompatible credit units.

**Owner:** Commercial and backend owners, with database support.

### 9.13 Expiry semantics are ambiguous

**Risk:** Credit grants, holds, or plan assignments expire without clear time semantics or consistent processing.

**Impact:** Incorrect availability and disputes over remaining credits.

**Mitigation:**

- Define effective and expiry timestamps.
- Establish inclusive or exclusive expiry behavior.
- Document the trusted process that applies expiry.
- Test boundary conditions.
- Keep operational expiry processing with the appropriate service owner.

**Owner:** Commercial domain and backend owners.

### 9.14 Plan changes rewrite historical terms

**Risk:** Updating a plan changes the interpretation of an existing booking or invoice.

**Impact:** Historical commercial records become inconsistent or cannot be explained.

**Mitigation:**

- Version plan terms where required.
- Preserve the applicable version or snapshot in the relevant commercial record.
- Define publication and effective-date semantics.
- Test plan updates against existing bookings and invoices.
- Keep pricing policy with the commercial owner.

**Owner:** Database and commercial domains.

### 9.15 Invoice totals do not match line items

**Risk:** Stored invoice totals diverge from the sum of their line items, adjustments, or applicable taxes.

**Impact:** Incorrect invoices and inconsistent commercial reporting.

**Mitigation:**

- Define subtotal, adjustment, tax, and total semantics.
- Use exact monetary representations.
- Define rounding rules with the appropriate finance owner.
- Validate totals in the service and transaction boundary.
- Test representative invoice calculations and persistence.

**Owner:** Backend commercial and finance domains, with database support.

### 9.16 Monetary precision is insufficient

**Risk:** Monetary values use a representation that introduces rounding errors or cannot represent the required currency precision.

**Impact:** Incorrect invoice totals and reconciliation differences.

**Mitigation:**

- Define currency and precision requirements.
- Avoid unsafe floating-point representations for exact amounts.
- Document scale and rounding semantics.
- Test boundary values.
- Obtain finance review for the accepted model.

**Owner:** Database and finance domains.

### 9.17 Invoice identity is not stable

**Risk:** Internal invoice identity is conflated with a mutable label or externally issued invoice number.

**Impact:** Duplicate invoices, broken references, and difficult reconciliation.

**Mitigation:**

- Separate internal identifiers from human-readable invoice numbers.
- Define uniqueness and issuance semantics.
- Preserve required historical references.
- Test duplicate numbering behavior.
- Keep legal numbering policy with the applicable finance and legal owners.

**Owner:** Database and commercial domains.

### 9.18 Invoice state is confused with payment state

**Risk:** An invoice is marked paid based only on an unverified local operation or an ambiguous provider response.

**Impact:** Incorrect commercial status and inconsistent reconciliation.

**Mitigation:**

- Distinguish invoice lifecycle from provider transaction status.
- Define the trusted source of payment confirmation.
- Persist stable external references where required.
- Keep provider integration and reconciliation with the applicable service owner.
- Test invalid state changes at the service boundary.

**Owner:** Backend payment integration and commercial domains.

### 9.19 RLS fails to protect related records

**Risk:** Invoice line items, ledger entries, or booking history are accessible even when their parent record is not authorized.

**Impact:** Sensitive commercial data can leak through secondary queries.

**Mitigation:**

- Define ownership and RLS for each related table.
- Test direct and indirect access paths.
- Use approved tenant context.
- Review privileged roles and policy bypass behavior.
- Verify policies using the ordinary application role.

**Owner:** Database and security domains.

### 9.20 Tenant context leaks across pooled connections

**Risk:** A reused connection retains the previous request's organization context.

**Impact:** Unauthorized access to another organization's bookings, credits, or invoices.

**Mitigation:**

- Establish context for each transaction or operation.
- Clear request-scoped context reliably.
- Test connection reuse across tenants.
- Review exception and rollback paths.
- Align backend context propagation with the database policy.

**Owner:** Backend and database domains.

### 9.21 Missing audit events

**Risk:** Important booking, credit, plan, or invoice operations are not represented in the audit trail.

**Impact:** Reduced traceability and difficulty investigating disputes or unauthorized changes.

**Mitigation:**

- Identify required audit events with security and backend owners.
- Reuse DB-M01 FOUNDATION (P0-P3) audit conventions.
- Test representative service operations.
- Document failure behavior when required audit persistence fails.
- Do not treat the existence of audit tables as proof of complete coverage.

**Owner:** Backend and security domains, with database support.

### 9.22 Sensitive commercial data is exposed

**Risk:** Credit balances, invoice details, or ledger history are exposed through overly broad access or logs.

**Impact:** Commercial confidentiality and privacy violations.

**Mitigation:**

- Apply least privilege and RLS.
- Restrict direct access to sensitive tables.
- Avoid logging secrets and unnecessary invoice payloads.
- Test cross-organization denial.
- Review audit metadata and error reporting.

**Owner:** Security, backend, and database domains.

### 9.23 Migration changes break existing bookings or invoices

**Risk:** A migration changes a required relationship or value representation without preserving existing data semantics.

**Impact:** Historical records become invalid or downstream consumers fail.

**Mitigation:**

- Review compatibility before destructive schema changes.
- Define data transformation and backfill requirements.
- Test migration sequences with representative data.
- Preserve stable references.
- Coordinate with DB-M04 EXECUTION DATA (P5-P7) where booking references are consumed.

**Owner:** Database domain and affected service owners.

### 9.24 Booking deletion removes required history

**Risk:** Deleting a booking cascades into ledger, invoice, or status-history records that must remain traceable.

**Impact:** Loss of commercial provenance and broken downstream references.

**Mitigation:**

- Define deletion and retention semantics.
- Prefer lifecycle state changes where historical references must remain valid.
- Review cascading relationships.
- Test deletion effects on related records.
- Preserve ledger and invoice history according to the approved model.

**Owner:** Database and commercial domains.

### 9.25 Database tests do not exercise concurrency

**Risk:** Tests validate only sequential requests and miss races in booking or credit operations.

**Impact:** Defects emerge under real concurrent workloads.

**Mitigation:**

- Include concurrent reservation attempts.
- Test simultaneous credit consumption and hold finalization.
- Verify idempotency under retries.
- Assert final database state, not only response status.
- Run tests against PostgreSQL behavior representative of the supported environment.

**Owner:** Database and backend domains.

### 9.26 Commercial policy is embedded implicitly in schema

**Risk:** Database constraints encode undocumented assumptions about pricing, credit expiry, tax, or plan eligibility.

**Impact:** Policy changes become difficult and data behavior diverges from commercial requirements.

**Mitigation:**

- Document commercial rules with their authoritative owners.
- Use database constraints for agreed integrity invariants.
- Keep pricing and eligibility decisions in the appropriate services.
- Record approved exceptions.
- Review schema changes for hidden policy assumptions.

**Owner:** Commercial domain and database domain.

### 9.27 Production readiness is inferred from development tests

**Risk:** Passing database tests is interpreted as proof of production recovery, availability, or financial reconciliation readiness.

**Impact:** Commercial operations begin without required operational controls.

**Mitigation:**

- Record the environment used for verification.
- Separate schema correctness from production operations.
- Hand off production requirements to P8 PRODUCTION.
- Require appropriate operational validation.
- Avoid unsupported compliance or availability claims.

**Owner:** P8 PRODUCTION and operational owners.

### 9.28 Documentation diverges from the data model

**Risk:** Booking, credit, ledger, plan, or invoice semantics change without corresponding documentation updates.

**Impact:** Services implement incompatible assumptions and downstream records become inconsistent.

**Mitigation:**

- Review schema documentation with migrations.
- Keep entity ownership explicit.
- Link changes to tasks and acceptance evidence.
- Record accepted changes in `CHANGELOG.md`.
- Review downstream impact before changing stable references.

**Owner:** Database domain and DB-M03 milestone owner.

---

## 10. Exit criteria

DB-M03 BOOKING DATA may be declared complete only when the booking, availability, credit, ledger, plan, and invoice data model is implemented through the approved migration workflow and verified against the accepted integrity, consistency, and access-control requirements.

Acceptance requires evidence that the schema behaves correctly under concurrent operations and retries, preserves commercial history, and enforces the intended tenant boundaries. The presence of tables alone is insufficient.

Detailed pass/fail conditions and evidence requirements belong in `ACCEPTANCE_CRITERIA.md`. Review execution and evidence inspection belong in `REVIEW_CHECKLIST.md`.

### 10.1 Scope and ownership

- [ ] The implemented scope matches this dossier.
- [ ] Booking and availability persistence have explicit ownership.
- [ ] Credit accounts and ledger movements have explicit ownership.
- [ ] Plan and invoice persistence have explicit ownership.
- [ ] DB-M01 FOUNDATION (P0-P3) remains authoritative for foundational identity, organization, project, migration, RLS, and audit conventions.
- [ ] DB-M02 CORE DATA (P3) remains authoritative for platform, resource, artifact, and storage metadata.
- [ ] DB-M04 EXECUTION DATA (P5-P7) remains authoritative for execution, lab, live, and results persistence.
- [ ] Backend service behavior and database persistence responsibilities are distinguished.
- [ ] Payment-provider integration, tax policy, and accounting policy remain with their authoritative owners.
- [ ] Canonical phase and milestone references follow the frozen model.
- [ ] Sibling task, acceptance, review, changelog, and Git procedure files are maintained separately.

### 10.2 Booking schema

- [ ] Booking records have stable identifiers.
- [ ] Required organization, identity, project, and resource references are explicit.
- [ ] Booking lifecycle values and timestamps are documented.
- [ ] Requested and confirmed interval semantics are clear where both exist.
- [ ] Invalid intervals are rejected.
- [ ] Status history is represented where required.
- [ ] Booking-to-resource cardinality is explicit.
- [ ] Required foreign keys and uniqueness constraints are implemented.
- [ ] Deletion and retention semantics preserve required commercial history.
- [ ] Booking ownership follows the approved RLS and authorization model.

### 10.3 Availability and conflict integrity

- [ ] Availability records have explicit resource or resource-class relationships.
- [ ] Availability intervals use consistent time semantics.
- [ ] Blocking windows and exceptions are represented where required.
- [ ] Invalid availability intervals are rejected.
- [ ] Exclusive versus shared reservation semantics are documented.
- [ ] The selected conflict-prevention mechanism is documented.
- [ ] Concurrent conflicting booking attempts are tested.
- [ ] A failed conflict does not leave partial booking or credit state.
- [ ] Availability queries are not mistaken for final reservation guarantees.
- [ ] Lifecycle behavior for disabled or unavailable resources is documented.

### 10.4 Booking idempotency

- [ ] Idempotency-key scope is documented.
- [ ] Required uniqueness constraints are implemented.
- [ ] A key is associated with the intended logical operation.
- [ ] Repeated requests do not create duplicate logical bookings.
- [ ] Key reuse with different request content has defined behavior.
- [ ] Retry behavior after uncertain responses is tested.
- [ ] Retention and expiry semantics are documented where required.

### 10.5 Credit accounts and balances

- [ ] Credit accounts have stable identifiers and explicit ownership.
- [ ] Credit units or currency semantics are documented.
- [ ] Balance semantics are explicit.
- [ ] The authoritative balance representation is identified.
- [ ] Any cached balance has a documented reconciliation relationship to the ledger.
- [ ] Credit grant and allocation records exist where required.
- [ ] Credit holds distinguish reserved from consumed amounts.
- [ ] Hold consumption and release have stable references.
- [ ] Duplicate credit-affecting operations are prevented where required.
- [ ] Concurrent credit operations preserve the approved balance invariant.

### 10.6 Ledger integrity

- [ ] Ledger entries have stable identifiers.
- [ ] Movement type and sign conventions are documented.
- [ ] Account and source relationships are explicit.
- [ ] Required idempotency or uniqueness references exist.
- [ ] Ledger ordering is deterministic.
- [ ] Historical entries cannot be silently rewritten by ordinary application operations.
- [ ] Corrections and reversals preserve historical traceability.
- [ ] Balance and ledger consistency checks are documented.
- [ ] Transaction tests cover rollback and duplicate operations.
- [ ] Required ledger-related audit behavior is documented.

### 10.7 Plans and commercial terms

- [ ] Plans have stable identifiers.
- [ ] Display names are distinct from stable identity.
- [ ] Plan lifecycle semantics are documented.
- [ ] Plan versioning and effective-period semantics are explicit where required.
- [ ] Applicable price, currency, and credit terms are represented.
- [ ] Published terms cannot silently rewrite historical booking or invoice terms.
- [ ] Plan assignment ownership is explicit where applicable.
- [ ] Credit grant or entitlement relationships do not duplicate ledger ownership.
- [ ] Pricing, eligibility, discount, and tax policy remain with the authoritative commercial owners.

### 10.8 Invoice integrity

- [ ] Invoices have stable internal identifiers.
- [ ] External or human-readable invoice numbering semantics are explicit.
- [ ] Invoice lifecycle values and timestamps are documented.
- [ ] Invoice line items reference their parent invoice.
- [ ] Historical invoiced values remain interpretable when current plan terms change.
- [ ] Currency and monetary precision follow the approved contract.
- [ ] Exact monetary amounts avoid unsafe floating-point representation.
- [ ] Subtotal, adjustment, tax, and total semantics are documented where applicable.
- [ ] Required invoice-to-account, booking, or plan references are explicit.
- [ ] Invoice state is distinguished from payment-provider state.
- [ ] Tests verify amount constraints and required relationship integrity.

### 10.9 RLS, roles, and tenant isolation

- [ ] Every DB-M03-owned table has a documented ownership and visibility scope.
- [ ] Required RLS policies are present.
- [ ] Related records such as line items, holds, ledger entries, and status history are protected.
- [ ] Policies are tested under the ordinary application role.
- [ ] Cross-organization access attempts are rejected.
- [ ] Missing or invalid tenant context fails closed where required.
- [ ] Privileged role and RLS-bypass assumptions are reviewed.
- [ ] Tenant context cannot leak across reused database connections.
- [ ] Booking, credit, ledger, plan, and invoice access follows the approved security model.

### 10.10 Audit integration

- [ ] DB-M03 reuses the audit conventions established by DB-M01 FOUNDATION (P0-P3).
- [ ] Required booking and commercial audit actions are documented with the relevant owners.
- [ ] Relevant records can be associated with the required audit context.
- [ ] Application-level event emission remains assigned to the backend owner.
- [ ] Sensitive payment or commercial information is not copied unnecessarily into audit metadata.
- [ ] Audit integration does not introduce a competing audit schema.
- [ ] Representative audit-related integration tests pass.

### 10.11 Migration and schema verification

- [ ] DB-M03 migrations use the approved migration tooling and history.
- [ ] Migration identifiers and ordering are valid.
- [ ] A clean supported database can apply the full migration sequence.
- [ ] Migration failures are reported clearly.
- [ ] Migration history matches the expected schema state.
- [ ] Required tables and columns exist.
- [ ] Required foreign keys, unique constraints, and check constraints exist.
- [ ] Required indexes exist.
- [ ] Required RLS policies exist.
- [ ] Schema verification detects representative missing or altered objects.
- [ ] No undocumented manual schema changes are required.

### 10.12 Automated verification

- [ ] Tests run against an isolated supported PostgreSQL environment.
- [ ] Booking identity and ownership tests pass.
- [ ] Availability interval and conflict tests pass.
- [ ] Concurrent reservation tests pass.
- [ ] Booking idempotency tests pass.
- [ ] Credit account and ownership tests pass.
- [ ] Credit hold, consumption, release, and adjustment tests pass where applicable.
- [ ] Ledger consistency and mutation-protection tests pass.
- [ ] Plan versioning tests pass where applicable.
- [ ] Invoice line-item and monetary integrity tests pass.
- [ ] RLS and cross-organization isolation tests pass.
- [ ] Migration initialization and history tests pass.
- [ ] Failed transactions do not leave partial inconsistent state.
- [ ] Test results and required evidence are recorded in the sibling acceptance and review documents.

### 10.13 Backend and downstream handoff

- [ ] B-M04 BOOKING (P4) can use the schema for booking, availability, credits, plans, and invoices.
- [ ] F-M04 BOOKING (P4) can obtain stable booking and commercial fields through approved backend contracts.
- [ ] B-M05 EXECUTION (P5) can reference booking identity and applicable lifecycle semantics.
- [ ] DB-M04 EXECUTION DATA (P5-P7) can reference bookings without duplicating booking persistence.
- [ ] Payment integration owners can distinguish persisted internal records from external provider operations.
- [ ] Finance and legal owners can identify the boundary between stored invoice facts and applicable policy.
- [ ] Known lifecycle, retention, and transaction limitations are documented.
- [ ] No unresolved ownership conflict blocks downstream integration.

### 10.14 Documentation and traceability

- [ ] Booking identity, lifecycle, and interval semantics are documented.
- [ ] Availability and conflict-prevention assumptions are documented.
- [ ] Credit balance, hold, and ledger invariants are documented.
- [ ] Plan identity, versioning, and historical terms are documented.
- [ ] Invoice identity, line items, currency, and amount semantics are documented.
- [ ] RLS and tenant-context assumptions are documented.
- [ ] Migration and schema verification workflows are documented.
- [ ] Known limitations and unresolved dependencies are explicit.
- [ ] Authoritative architecture, backend, security, cloud, testing, and release documents are linked.
- [ ] `TASKS.md` contains the detailed task decomposition.
- [ ] `ACCEPTANCE_CRITERIA.md` contains detailed pass/fail conditions and evidence requirements.
- [ ] `REVIEW_CHECKLIST.md` contains review actions and evidence inspection.
- [ ] `CHANGELOG.md` contains accepted change history.
- [ ] `GIT_COMMIT_STEP.md` contains the repository and commit procedure.

### 10.15 Final milestone acceptance

DB-M03 BOOKING DATA is ready for formal acceptance when:

1. Booking and availability records have stable identities, explicit ownership, and valid interval semantics.
2. The approved conflict-prevention mechanism is implemented and verified under concurrent requests.
3. Booking operations support the required idempotency guarantees.
4. Credit accounts, holds, consumption, release, adjustments, and ledger movements preserve the approved consistency rules.
5. Historical ledger entries are protected against silent modification.
6. Commercial plans and their version semantics preserve the applicable terms for historical records.
7. Invoice records and line items satisfy the approved amount, currency, and relationship constraints.
8. Required RLS policies protect booking and commercial data across tenant boundaries.
9. Required audit integration follows DB-M01 FOUNDATION (P0-P3) conventions.
10. Migrations and schema verification use the established database foundation.
11. Required automated tests pass, including representative concurrency and retry cases.
12. Backend and downstream owners can use the schema without duplicating booking or commercial ownership.
13. Critical risks are mitigated or formally dispositioned by the relevant owners.
14. Required acceptance and review evidence is available through the sibling files.
15. No unresolved issue invalidates booking integrity, credit consistency, ledger traceability, invoice integrity, or tenant isolation.

Acceptance of DB-M03 BOOKING DATA does not establish payment-provider settlement, tax or accounting compliance, production database availability, or production-scale transaction capacity. Those outcomes remain with the applicable backend, commercial, finance, cloud, and P8 PRODUCTION owners.
