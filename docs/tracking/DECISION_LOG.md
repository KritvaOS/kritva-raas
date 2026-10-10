# Kritva RaaS — Decision Log Index

## 1. Purpose

This document is the central index of architectural, product, engineering, delivery, security, and operational decisions that affect Kritva RaaS.

It provides a searchable register of Architecture Decision Records (ADRs) without duplicating their content.

Each index entry contains only:

- decision ID
- decision date
- decision title
- decision status
- accountable owner
- link to the ADR in the owning `DECISIONS.md`

The ADR itself is the authoritative record of the decision, rationale, alternatives, consequences, and implementation implications.

This index supports cross-domain traceability, governance reviews, milestone planning, and identification of decisions that may affect delivery dependencies.

## 2. Canonical References

| Concern | Reference |
|---|---|
| Canonical phase definitions | `docs/planning/PHASES.md` |
| Project-level decisions | `docs/planning/DECISIONS.md` |
| Master project status | `docs/tracking/STATUS.md` |
| Phase status | `docs/tracking/PHASE_STATUS.md` |
| Milestone status | `docs/tracking/MILESTONE_STATUS.md` |
| Task status | `docs/tracking/TASK_STATUS.md` |
| Frontend decisions | `docs/frontend/planning/DECISIONS.md` |
| Backend decisions | `docs/backend/planning/DECISIONS.md` |
| Database decisions | `docs/database/planning/DECISIONS.md` |
| Cloud decisions | `docs/cloud/planning/DECISIONS.md` |
| UI decisions | `docs/ui/DECISIONS.md` |
| Security decisions | `docs/security/DECISIONS.md` |
| Relevant milestone scope | `docs/**/milestones/` |
| Project risks | `docs/tracking/RISK_REGISTER.md` |

A reference path identifies the expected location of an owning decision register. If the file or ADR is not present, record the entry as a documentation gap and resolve it with the responsible owner.

## 3. Indexing Rules

1. This file is an index only.
2. Do not copy ADR rationale, alternatives, consequences, or implementation details into this document.
3. Every decision entry must link to the ADR in its owning `DECISIONS.md`.
4. Use stable, unique decision IDs.
5. Use ISO 8601 dates in `YYYY-MM-DD` format.
6. Use the exact decision title recorded in the ADR.
7. Record one accountable owner for each decision.
8. Use only the approved status vocabulary.
9. Use frozen phase names when phase traceability is necessary.
10. Use canonical milestone identifiers and names when milestone traceability is necessary.
11. Do not invent decision records or claim that a decision has been approved without its authoritative ADR.
12. When an ADR is superseded, retain the index entry and update its status and replacement reference as appropriate.
13. Update this index when an ADR is created, approved, superseded, or retired.
14. Keep the owning `DECISIONS.md` as the source of truth for decision content.

## 4. Decision Status Vocabulary

| Status | Meaning |
|---|---|
| `PROPOSED` | The decision has been drafted but has not been approved. |
| `UNDER REVIEW` | The decision is being reviewed by the required stakeholders. |
| `ACCEPTED` | The decision has been approved and is currently applicable. |
| `REJECTED` | The proposal was reviewed and not approved. |
| `SUPERSEDED` | A later accepted decision replaces this decision. |
| `WITHDRAWN` | The proposal was withdrawn before acceptance. |
| `RETIRED` | The decision is no longer applicable and has no active replacement requirement. |

The status in this index must match the status in the authoritative ADR.

## 5. Decision ID Convention

Use the ID convention established by the owning decision register. If the project has not established a convention for a domain, agree one with project governance before adding entries.

Recommended domain prefixes:

| Domain | Recommended prefix |
|---|---|
| Project-wide | `KR-ADR` |
| Frontend | `KR-FE-ADR` |
| Backend | `KR-BE-ADR` |
| Database | `KR-DB-ADR` |
| Cloud | `KR-CL-ADR` |
| UI | `KR-UI-ADR` |
| Security | `KR-SEC-ADR` |

These prefixes are indexing guidance. Existing ADR identifiers must be preserved.

Do not renumber an accepted ADR because its scope changes or its owning document moves. Preserve stable identifiers and update links when the source file is reorganized.

## 6. Master Decision Index

The following table is the consolidated index of decisions across the project.

Entries must be added only after their authoritative ADRs have been located and verified. The initial baseline contains no fabricated ADR records.

| ID | Date | Title | Status | Owner | ADR link |
|---|---|---|---|---|---|
| No verified entries indexed | — | — | — | — | Reconcile owning decision registers |

### 6.1 Initial reconciliation requirements

- [ ] Inspect `docs/planning/DECISIONS.md`.
- [ ] Inspect `docs/frontend/planning/DECISIONS.md`, if present.
- [ ] Inspect `docs/backend/planning/DECISIONS.md`, if present.
- [ ] Inspect `docs/database/planning/DECISIONS.md`, if present.
- [ ] Inspect `docs/cloud/planning/DECISIONS.md`, if present.
- [ ] Inspect `docs/ui/DECISIONS.md`, if present.
- [ ] Inspect `docs/security/DECISIONS.md`, if present.
- [ ] Extract verified decision IDs, dates, titles, statuses, and owners.
- [ ] Confirm that each decision has an authoritative ADR section or file.
- [ ] Add a direct link to each ADR in its owning `DECISIONS.md`.
- [ ] Identify duplicate IDs or conflicting statuses.
- [ ] Record missing owners, dates, or ADR links as reconciliation actions.
- [ ] Verify that the index does not duplicate ADR content.

## 7. Project-Wide Decisions

**Owning register:** `docs/planning/DECISIONS.md`

Project-wide decisions affect multiple engineering domains, governance, canonical planning, or overall product direction.

Index only verified entries from the owning register.

| ID | Date | Title | Status | Owner | ADR link |
|---|---|---|---|---|---|
| No verified entries indexed | — | — | — | — | Reconcile `docs/planning/DECISIONS.md` |

Project-wide decisions should use frozen phase names and milestone identifiers when the ADR's scope requires traceability to the delivery plan.

Do not create an index entry merely because a topic appears important. A decision must have an authoritative ADR.

## 8. Frontend Decisions

**Owning register:** `docs/frontend/planning/DECISIONS.md`

Frontend decisions may affect UI architecture, component conventions, navigation, client-side state, API integration, accessibility, or frontend testing.

| ID | Date | Title | Status | Owner | ADR link |
|---|---|---|---|---|---|
| No verified entries indexed | — | — | — | — | Reconcile `docs/frontend/planning/DECISIONS.md` |

When a decision affects delivery planning, use the canonical frontend milestone identifiers:

- F-M01 STUDIO FOUNDATION
- F-M02 PROJECTS
- F-M03 BUILD & ARTIFACT
- F-M04 BOOKING
- F-M05 EXECUTION
- F-M06 LIVE
- F-M07 RESULTS

The index must contain only the ADR metadata and its link. Keep design rationale, technical alternatives, and implementation guidance in the owning ADR.

## 9. Backend Decisions

**Owning register:** `docs/backend/planning/DECISIONS.md`

Backend decisions may affect API contracts, service boundaries, domain behavior, lifecycle semantics, authorization, integration, observability, or reliability.

| ID | Date | Title | Status | Owner | ADR link |
|---|---|---|---|---|---|
| No verified entries indexed | — | — | — | — | Reconcile `docs/backend/planning/DECISIONS.md` |

When a decision affects delivery planning, use the canonical backend milestone identifiers:

- B-M01 CONTROL PLANE
- B-M02 ARTIFACT
- B-M03 PLATFORM
- B-M04 BOOKING
- B-M05 EXECUTION
- B-M06 RESULTS
- B-M07 PRODUCTION

The index must not restate the API design, architecture rationale, or consequences of a backend ADR.

## 10. Database Decisions

**Owning register:** `docs/database/planning/DECISIONS.md`

Database decisions may affect schema conventions, migrations, transaction behavior, data ownership, isolation, indexing, integrity, retention, or recovery.

| ID | Date | Title | Status | Owner | ADR link |
|---|---|---|---|---|---|
| No verified entries indexed | — | — | — | — | Reconcile `docs/database/planning/DECISIONS.md` |

When a decision affects delivery planning, use the canonical database milestone identifiers:

- DB-M01 FOUNDATION
- DB-M02 CORE DATA
- DB-M03 BOOKING DATA
- DB-M04 EXECUTION DATA

Do not introduce an additional database milestone into the index. Production-related decisions must link to their actual owning ADR and retain the frozen milestone model.

## 11. Cloud Decisions

**Owning register:** `docs/cloud/planning/DECISIONS.md`

Cloud decisions may affect environment configuration, infrastructure, networking, deployment, secrets, observability, recovery, or operational readiness.

| ID | Date | Title | Status | Owner | ADR link |
|---|---|---|---|---|---|
| No verified entries indexed | — | — | — | — | Reconcile `docs/cloud/planning/DECISIONS.md` |

When a decision affects delivery planning, use the canonical cloud milestone identifiers:

- C-M01 FOUNDATION
- C-M02 DEVELOPMENT
- C-M03 STAGING
- C-M04 PRODUCTION

Keep infrastructure choices, deployment procedures, and operational tradeoffs in the owning ADR rather than duplicating them here.

## 12. UI Decisions

**Owning register:** `docs/ui/DECISIONS.md`

UI decisions may affect visual conventions, interaction patterns, navigation, responsive behavior, accessibility, or screen-level consistency.

| ID | Date | Title | Status | Owner | ADR link |
|---|---|---|---|---|---|
| No verified entries indexed | — | — | — | — | Reconcile `docs/ui/DECISIONS.md` |

When a UI decision affects delivery planning, use the frozen frontend milestone identifiers and the canonical phase mapping in `docs/planning/PHASES.md`.

The UI decision index must not duplicate screen specifications, design rationale, or implementation details from its ADR.

## 13. Security Decisions

**Owning register:** `docs/security/DECISIONS.md`

Security decisions may affect authentication, authorization, data protection, secrets handling, auditability, threat mitigation, deployment controls, or production acceptance.

| ID | Date | Title | Status | Owner | ADR link |
|---|---|---|---|---|---|
| No verified entries indexed | — | — | — | — | Reconcile `docs/security/DECISIONS.md` |

Security decisions must retain the authority, review, and approval information recorded in their ADRs.

Where a security decision affects a milestone or phase, record the applicable canonical identifier in the ADR and use the same reference in the index only when needed for traceability.

## 14. Cross-Domain Decision Traceability

A decision may affect more than one domain. Keep a single authoritative ADR and reference it from this index rather than copying its content into several domain registers.

Where cross-domain traceability is required, the owning ADR should identify the affected domains, phases, and milestones.

The index should remain limited to its required fields. Do not add a separate rationale, implementation plan, risk analysis, or dependency narrative here.

### 14.1 Frozen phase reference

Use these exact phase names when phase traceability is required:

| Phase | Canonical name |
|---|---|
| P0 | FOUNDATION |
| P1 | STUDIO |
| P2 | BUILD & ARTIFACT |
| P3 | CONTROL PLANE |
| P4 | BOOKING & COMMERCIAL |
| P5 | EXECUTION |
| P6 | LAB & ROBOT |
| P7 | LIVE & RESULTS |
| P8 | PRODUCTION |

This table is an index reference only. `docs/planning/PHASES.md` remains the sole authority for phase definitions and boundaries.

### 14.2 Milestone reference rules

- Use the exact frozen milestone identifier.
- Use the exact frozen milestone name.
- Preserve the canonical phase mapping.
- Do not create aliases for retired milestone names.
- Do not infer milestone scope from an ADR title.
- Refer to the authoritative milestone dossier when scope needs clarification.

## 15. ADR Link Format

Each index entry must link directly to the ADR section or standalone ADR file in the owning `DECISIONS.md`.

Recommended link patterns include:

- `[KR-ADR-001](../planning/DECISIONS.md#kr-adr-001)`
- `[KR-BE-ADR-001](../backend/planning/DECISIONS.md#kr-be-adr-001)`
- `[KR-DB-ADR-001](../database/planning/DECISIONS.md#kr-db-adr-001)`

These are examples of link syntax only. They are not claims that those ADRs exist.

Use the actual identifier and verified heading anchor or file path. Do not invent anchors or link to a file that has not been checked.

If the owning register uses a different ID convention, preserve its existing convention.

## 16. Index Update Workflow

Update this index when a decision is added, reviewed, accepted, rejected, superseded, withdrawn, or retired.

### Step 1: Locate the authoritative ADR

Identify the owning `DECISIONS.md` and the exact ADR section or standalone file.

### Step 2: Verify metadata

Confirm the decision ID, date, exact title, current status, and accountable owner.

### Step 3: Verify the link

Confirm that the link resolves to the actual ADR.

### Step 4: Add or update the index entry

Update only the metadata fields and ADR link. Do not copy ADR content.

### Step 5: Reconcile status

Ensure the index status matches the owning ADR.

### Step 6: Check references

Where applicable, verify that the ADR's phase and milestone references match the frozen canonical model.

### Step 7: Review the change

Confirm that no retired names, invented decisions, duplicate IDs, or invalid links have been introduced.

## 17. Decision Status Changes

When an ADR status changes, update the index in the same change where practical.

| ADR event | Index action |
|---|---|
| New proposal | Add entry as `PROPOSED` |
| Review begins | Change status to `UNDER REVIEW` |
| Approval | Change status to `ACCEPTED` |
| Rejection | Change status to `REJECTED` |
| Replacement accepted | Mark replaced ADR `SUPERSEDED` and link the replacement in the authoritative ADR |
| Proposal withdrawn | Change status to `WITHDRAWN` |
| Decision no longer applicable | Change status to `RETIRED` after approval |

Do not mark an ADR superseded merely because another decision discusses a related topic. The relationship must be explicit in the authoritative ADR.

## 18. Duplicate and Conflict Resolution

If two ADRs appear to cover the same decision:

- retain both records until the relationship is reviewed
- identify their owning registers
- verify their IDs and titles
- determine whether one supersedes the other
- record the relationship in the authoritative ADRs
- update the index status and links
- preserve historical traceability

If the same decision ID appears in more than one register, do not silently rename either record. Escalate the collision to the relevant domain owners and record the approved resolution.

If the index and owning ADR disagree, the owning ADR is authoritative. Correct the index and record the correction through the normal review process.

## 19. Decision Review Checklist

Use this checklist when reviewing changes to the index.

- [ ] Every indexed decision has an authoritative ADR.
- [ ] Every ADR link points to the correct record.
- [ ] IDs are unique or approved aliases are explicitly documented.
- [ ] Dates use `YYYY-MM-DD`.
- [ ] Titles match the authoritative ADR exactly.
- [ ] Statuses match the owning registers.
- [ ] Every decision has an accountable owner.
- [ ] Frozen phase names are used where applicable.
- [ ] Frozen milestone identifiers and names are used where applicable.
- [ ] No retired names have been introduced.
- [ ] ADR rationale has not been duplicated.
- [ ] Superseded decisions retain historical traceability.
- [ ] Missing source registers are recorded as documentation gaps.

## 20. Governance Rules

This index may be updated to reflect verified decision metadata and link changes.

Changes to phase definitions must be made only in `docs/planning/PHASES.md` through the approved project governance process.

Changes to milestone scope must be made in the relevant authoritative dossier under `docs/**/milestones/`.

Changes to ADR content must be made in the owning `DECISIONS.md` or standalone ADR file. This index must then be updated to reflect the authoritative metadata.

The index must not be used to approve decisions, change their status without authority, or establish technical requirements not present in the owning ADR.

## 21. Initial Reconciliation Register

Use the following table to track source-register reconciliation. These are documentation actions, not ADR entries.

| Register | Expected location | Reconciliation status | Owner |
|---|---|---|---|
| Project-wide decisions | `docs/planning/DECISIONS.md` | PENDING | TBD |
| Frontend decisions | `docs/frontend/planning/DECISIONS.md` | PENDING | TBD |
| Backend decisions | `docs/backend/planning/DECISIONS.md` | PENDING | TBD |
| Database decisions | `docs/database/planning/DECISIONS.md` | PENDING | TBD |
| Cloud decisions | `docs/cloud/planning/DECISIONS.md` | PENDING | TBD |
| UI decisions | `docs/ui/DECISIONS.md` | PENDING | TBD |
| Security decisions | `docs/security/DECISIONS.md` | PENDING | TBD |

A register may be marked `NOT APPLICABLE` only after confirming that project governance does not require a separate register for that domain.

Do not treat `PENDING` as evidence that an ADR exists.

## 22. Maintenance Checklist

Before committing an index update:

- [ ] The change is limited to ADR metadata and verified links.
- [ ] The owning ADR is authoritative and accessible.
- [ ] The decision ID has been checked for uniqueness.
- [ ] The date and title match the ADR.
- [ ] The status matches the ADR.
- [ ] The owner is recorded.
- [ ] The link resolves correctly.
- [ ] Phase references match `docs/planning/PHASES.md`.
- [ ] Milestone references use the frozen canonical model.
- [ ] No ADR rationale or content has been duplicated.
- [ ] Supersession and retirement links remain intact.
- [ ] Missing information is marked for reconciliation.
- [ ] The change is reviewed by the responsible owner.

## 23. Baseline Acceptance

The decision index is ready for routine use when:

- the metadata-only format is established
- decision status vocabulary is defined
- stable identifier expectations are documented
- owning decision registers are identified
- verified ADRs have been indexed
- links have been checked
- cross-domain traceability follows the frozen model
- missing registers and ADRs are tracked as documentation gaps
- duplicate and superseded records have an agreed handling process
- the update workflow is understood

Baseline acceptance confirms that the index structure is ready. It does not imply that any decision has been approved.

## 24. Changelog

### Initial Frozen-Model Baseline

- Established this file as a decision log index only.
- Defined the required fields: ID, date, title, status, owner, and ADR link.
- Established `docs/planning/PHASES.md` as the canonical phase definition.
- Preserved owning `DECISIONS.md` files as the authority for ADR content.
- Added domain index sections for project-wide, frontend, backend, database, cloud, UI, and security decisions.
- Defined decision status and link-validation rules.
- Added cross-domain traceability guidance using the frozen canonical model.
- Added reconciliation and maintenance checklists.
- Avoided creating unverified ADR entries or duplicating ADR content.

### Future Updates

Future updates must preserve the metadata-only index format, frozen phase names, frozen milestone identifiers, and links to the authoritative ADRs.
