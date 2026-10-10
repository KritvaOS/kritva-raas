# External Audit Response — Implementation Plan (2026-10-10)

## Document Control

| Field | Value |
|---|---|
| Document | External audit response |
| Path | `docs/tracking/AUDIT_RESPONSE_2026-10-10.md` |
| Audited revision | `941781fb77e8a8addba421bf0be4cc9d249edddc` ("Implementation plan") |
| Audit type | External static documentation review |
| Findings | RAAS-001 to RAAS-009 |
| Response status | Corrections applied; RAAS-004 and RAAS-007 need leadership decisions to close |

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

## 4. Remaining Actions Before an Approved Implementation Baseline

1. Disposition SYS-ADR-001 to SYS-ADR-006 (RAAS-004).
2. Fill the Section 23.2 commitment baseline in `RESOURCE_PLAN.md` and assign named owners in tracking (RAAS-007).
3. Remap the legacy phase sections listed by the checker warnings (RAAS-012).
4. Approve the corrections recorded in `PHASES.md` Section 25.
5. Add `python3 scripts/docs/check_docs.py` to CI.
