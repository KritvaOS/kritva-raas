# External Audit Response — Implementation Plan (2026-10-10)

## Document Control

| Field | Value |
|---|---|
| Document | External audit response |
| Path | `docs/tracking/AUDIT_RESPONSE_2026-10-10.md` |
| Audited revision | `941781fb77e8a8addba421bf0be4cc9d249edddc` ("Implementation plan") |
| Audit type | External static documentation review |
| Findings | RAAS-001 to RAAS-009 (first audit); RAAS-013 and RAAS-014 (second audit, commit `1051811`) |
| Response status | Two audit rounds addressed; RAAS-004, RAAS-007 and RAAS-012 need owner or leadership decisions to close |

## 1. Purpose

This document records how each external audit finding was verified and corrected, and what remains open. It does not approve any decision, schedule, or budget.

## 2. Finding Disposition

| ID | Severity | Verified | Correction | Status |
|---|---|---|---|---|
| RAAS-001 | High | Yes. `PHASES.md` and `IMPLEMENTATION_ROADMAP.md` mapped DB-M02 CORE DATA to P2 BUILD & ARTIFACT. | Removed DB-M02 CORE DATA from the P2 mapping row and the P2 primary-milestone list. P2 now cites DB-M01 FOUNDATION and records DB-M02 CORE DATA (P3) as an explicit cross-phase dependency for persisted artifact metadata. | Closed |
| RAAS-002 | High | Yes. F-M05 described execution on a "simulated or physical robotic resource". The F-M05 changelog phase appendix also assigned physical robots and HIL to P5. | F-M05 objective, execution environment, acceptance criteria (Section 6.6) and review checklist (Step 10) are now limited to the simulated Lab Agent and simulated robots. Physical E-stop qualification is a P6 LAB & ROBOT gate. The software stop and physical E-stop distinction is preserved. | Closed |
| RAAS-003 | High | Yes. Physical safety, E-stop, robot operation compliance and physical robot availability risks were assigned to the numeric value 5. The register, change-tracking and issue-log phase sections followed a superseded phase model. | Every risk now uses a canonical phase identifier. Physical safety risks moved to P6 LAB & ROBOT. Simulation-fidelity risks were split out (R-TECH-011, R-SAFE-006) and assigned to P5 EXECUTION. The phase risk-action, change-mapping and issue-mapping sections were rewritten on the canonical model. | Closed |
| RAAS-004 | High | Yes. SYS-ADR-001 to SYS-ADR-006 are Proposed. | Added a disposition tracker with an accountable owner (role), required disposition, gate, approval evidence and implementation reference, plus a baseline rule: the plan must not be approved as a frozen implementation baseline while any SYS-ADR whose gate has been reached is still Proposed. | Open: needs owner decisions |
| RAAS-005 | Medium | Yes. Milestone dossiers used `Phase N — NAME`. | Normalized to `PN NAME` across milestone dossiers, planning and tracking documents. Phase-mapping appendices in 15 milestone changelogs that followed a superseded phase model were replaced with canonical tables that link to `PHASES.md`. | Closed for milestones, planning and tracking; see Section 3 |
| RAAS-006 | Medium | Yes. Priorities `P0`-`P3` were the same as the phase identifiers, and every milestone was `P0`. | Introduced `PRI-0` to `PRI-3` in the roadmap, task, change, issue, development, cloud-task and security-requirement priority fields. Milestone priorities were reassigned from the Priority Matrix: PRI-0 for B-M01, B-M02, B-M04, B-M07 and C-M01; PRI-1 for the others. | Closed |
| RAAS-007 | Medium | Yes. | Added `RESOURCE_PLAN.md` Section 23.2: the plan's status is now indicative, with a list of elements needed for a commitment baseline and a time-phased allocation format. No owners, dates or costs were invented. | Open: needs leadership and finance input |
| RAAS-008 | Medium | Yes. | `scripts/docs/check_docs.py` now validates the mapping tables, primary phases, milestone-name spelling, phase-label form, the P5/P6 boundary, risk-register phases, priority notation and MVP usage. Run against the audited revision, it reports 512 errors. It reports 0 errors after the corrections. | Closed |
| RAAS-009 | Low | Yes. | Defined the primary product path (MVP) in `PHASES.md` Section 3.1 as a product-scope concept, not a phase or milestone. Renamed the roadmap's critical-path section to match. | Closed |

## 3. Additional Findings During Correction

| ID | Finding | Action |
|---|---|---|
| RAAS-010 | `F-M01`, `F-M02` and `UI_ACCEPTANCE_CRITERIA.md` used a superseded frontend milestone sequence, with old names attached to the F-M04 and F-M06 identifiers. | Corrected to the canonical F-M01 to F-M07 names and scope. F-M05 UI acceptance is now limited to simulated execution. |
| RAAS-011 | `C-M02 DEVELOPMENT` had no `**Primary Phase:**` header. | Added P1 STUDIO with supporting phases P2 and P3. |
| RAAS-012 | Architecture, protocol, security, UI, database-schema and development documents still use bare numeric phase labels. Some sections follow a superseded model, for example identity under phase number 1 and jobs under phase number 3 in API, data, security and backend architecture. `SECURITY_REQUIREMENTS.md` uses a numeric phase column on a different model. | Reported as checker warnings, not fixed. Each domain owner needs to remap these sections because they assign technical scope. |

## 4. Second Audit (commit `1051811`)

The second external review reused the identifiers RAAS-010 and RAAS-011, which this register had already assigned in Section 3. To keep identifiers unique, its new findings are recorded here as RAAS-013 and RAAS-014. The external identifiers are kept for traceability.

| ID | External ID | Severity | Finding | Correction | Status |
|---|---|---|---|---|---|
| RAAS-013 | RAAS-010 (second audit) | Medium | `RISK_REGISTER.md` Section 67 measured schedule risk against a superseded nine-stage sequence that used retired stage names and put remote execution before booking and commercial work. | Replaced it with references to `PHASES.md`, `IMPLEMENTATION_ROADMAP.md` Section 25 and `DEPENDENCY_MAP.md`, plus the canonical P0-P8 order for reference. Risk-specific schedule dependencies stay on the risk rows. | Closed |
| RAAS-014 | RAAS-011 (second audit) | Medium | The roadmap said that safety, security and integrity requirements could be elevated to the phase-like label for phase 0 when it meant priority. | Changed to PRI-0. Priority prose using phase-like notation was also corrected in `CHANGE_TRACKING.md`, `ISSUE_LOG.md` (severity/priority matrix), `CODE_REVIEW.md`, `STAGING.md`, `PRODUCTION.md`, `CLOUD_TASKS.md` and the P0 FOUNDATION acceptance criteria. Ambiguous phase references were made explicit, for example in `PHASES.md` and in the `IMPLEMENTATION_ROADMAP.md` P3 CONTROL PLANE invariants heading. | Closed |
| — | Checker gaps (second audit, Section 4) | — | No check for retired stage sequences, priority prose, or MVP use outside `docs/planning`. | `check_docs.py` adds: (14) retired program-stage labels in sequence diagrams and canonical P0-P8 order in phase diagrams; (15) priority prose using `Pn` (errors in planning, tracking, milestones, development and deployment documents; warnings elsewhere); (16) "MVP" used as a phase, milestone or stage name anywhere in `docs/`. `CHANGE_TRACKING.md` Section 93 was renamed to "Change and the Primary Product Path (MVP)" and linked to `PHASES.md` Section 3.1. Run against commit `1051811`, the updated checker reports all 24 problems found in the second audit. | Closed |
| — | Domain phase mappings (second audit, Section 3) | — | Database, security and protocol mappings (for example identity and the `auth.*` commands under phase number 1) need owner review. | Not changed, as the second audit recommends. These remain approval blockers (RAAS-012). | Open: domain owners |

### 4.1 Checker Run Evidence

| Field | Value |
|---|---|
| Command | `python3 scripts/docs/check_docs.py` |
| Checkout | Full repository at commit `1051811` plus the corrections in this section |
| Result | 324 documents checked, 0 errors, 1810 warnings |
| Warnings | All are bare `Phase N` labels, summarised as 85 per-file lines across architecture (14 files), cloud (14), database (13), protocol (10), security (10), backend (7), development (6), frontend (6) and ui (5). They are the RAAS-012 domain-owner remapping backlog. |

## 5. Remaining Actions Before an Approved Implementation Baseline

1. Disposition SYS-ADR-001 to SYS-ADR-006 (RAAS-004). The tracker gate in `DECISIONS.md` Section 4.2.1 stays in force.
2. Fill the Section 23.2 commitment baseline in `RESOURCE_PLAN.md` and assign named owners in tracking (RAAS-007). This blocks a committed delivery and spending baseline, but not approval of the indicative plan.
3. Domain owners reconcile the legacy phase-to-scope mappings in architecture, protocol, security and schema documents (RAAS-012). Afterwards, promote the `Phase N` warnings to errors and add domain-specific mapping checks.
4. Approve the corrections recorded in `PHASES.md` Section 25.
5. Add `python3 scripts/docs/check_docs.py` to CI and record each run's result here or in `STATUS.md`.
