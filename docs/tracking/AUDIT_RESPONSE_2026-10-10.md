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
| — | Checker gaps (second audit, Section 4) | — | No check for retired stage sequences, priority prose, or MVP use outside `planning`. | `check_docs.py` adds: (14) retired program-stage labels in sequence diagrams and canonical P0-P8 order in phase diagrams; (15) priority prose using `Pn` (errors in planning, tracking, milestones, development and deployment documents; warnings elsewhere); (16) "MVP" used as a phase, milestone or stage name anywhere in `docs/`. `CHANGE_TRACKING.md` Section 93 was renamed to "Change and the Primary Product Path (MVP)" and linked to `PHASES.md` Section 3.1. Run against commit `1051811`, the updated checker reports all 24 problems found in the second audit. | Closed |
| — | Domain phase mappings (second audit, Section 3) | — | Database, security and protocol mappings (for example identity and the `auth.*` commands under phase number 1) need owner review. | Not changed, as the second audit recommends. These remain approval blockers (RAAS-012). | Open: domain owners |

### 4.1 Checker Run Evidence

| Field | Value |
|---|---|
| Command | `python3 scripts/docs/check_docs.py` |
| Checkout | Full repository at commit `1051811` plus the corrections in this section |
| Result | 324 documents checked, 0 errors, 1810 warnings |
| Warnings | All are bare `Phase N` labels, summarised as 85 per-file lines across architecture (14 files), cloud (14), database (13), protocol (10), security (10), backend (7), development (6), frontend (6) and ui (5). They are the RAAS-012 domain-owner remapping backlog. |

## 4.2 Findings Raised During Coding-Agent Planning (CR-2026-001)

| ID | Severity | Finding | Action | Status |
|---|---|---|---|---|
| RAAS-015 | Medium | 204 task IDs are reused between phase-dossier and domain-milestone `TASKS.md` registers. For example, KR-FE-1-001 is a different task in PHASE-1-STUDIO and in F-M02 PROJECTS. | New coding-agent tasks use the unique `KR-CA-nnn` namespace. The checker reports reused IDs as a warning and rejects duplicate `KR-CA` IDs. Renumbering the existing registers needs an owner decision on the namespace scheme. | Open: planning owner |
| RAAS-016 | Low | The F-M02 PROJECTS changelog notes and the B-M03 PLATFORM integration acceptance items used superseded frontend milestone numbers. | Corrected to canonical milestone names. | Closed |

## 4.3 External Review of the Coding-Agent Integration (CA-REV-001 to CA-REV-012)

The external review assessed `docs/architecture/CODING_AGENT_INTEGRATION.md` revision 1. Its verdict: accept the direction, with corrections required before SYS-ADR-007 approval. Revision 2 addressed every finding. The reviewer's follow-up assessed 11 of 12 as closed at planning level, CA-REV-001 as partially closed, and recommended Option 2 for decision A. Revision 3 addresses the follow-up. The reviewer's revision 3 assessment closed CA-REV-001 at planning level after the no-silent-downgrade rule was added, kept CA-REV-012 provisional, and found no reason to reopen the other ten findings.

| ID | Severity | Finding | Correction (architecture section) | Status |
|---|---|---|---|---|
| CA-REV-001 | High | Isolation mechanism unspecified; the workspace guard is not a boundary | Isolation tiers A, B and C with separate read, write and network boundaries; tier C disclosed; policy `min_isolation_tier`; escape test list (5.4; SEC-186; R-SEC-015) | Closed in plan (revision 3). Revision 2 was partially closed: tier C outside-read semantics needed clarification. Revision 3 adds tier rules in 5.4: tier C makes no isolation claim; per-session disclosure and acknowledgement that any user-readable file may be read; policy requiring tier A rejects tier C regardless of consent; tier A listed only after CAT-03 enforcement tests per OS and provider plus a session-start probe; combinations below the required tier shown unsupported; a failed tier A probe never silently downgrades (rule 6) (SEC-186, CAT-03). Reviewer confirmed closure at planning level on 2026-10-10; tier A qualification per combination remains a release verification obligation |
| CA-REV-002 | High | Direct workspace writes weaken review guarantees | Per-session staging workspace; immutable change sets with content hashes; conflict detection; atomic idempotent apply; `WORKSPACE_WRITE` deferred (5.3, 5.5; SEC-184, SEC-185) | Closed in plan |
| CA-REV-003 | High | Build, test and package side effects underspecified | Saved-profile-only inputs; staging-only execution with manual-build limits; build-definition changes highlighted; bound approvals, including the build-profile and test-target definition version hash (revision 3); package never signs or uploads (7.2, 7.5; SEC-192, CAT-09) | Closed in plan |
| CA-REV-004 | High | Consent and privacy scope imprecise | Guarantee limited to Kritva-operated services; egress inventory with negative tests; consent contents and lifecycle including withdrawal (4.1 to 4.3; SEC-190) | Closed in plan |
| CA-REV-005 | High | Policy cache and offline behaviour incomplete | Unconfigured states; monotonic-clock cache age; checksum; revalidation before consequential calls; deterministic effect on active sessions (8.2 to 8.4; SEC-191, SEC-195) | Closed in plan. Revision 3 separates `POLICY_UNCONFIGURED` from `POLICY_UNAVAILABLE` in UI, IPC, audit, API (`configured` field) and remediation, and makes the pre-P3 local default restrictive. Default for a never-configured organization: Option 2 recommended, awaiting product-owner decision in SYS-ADR-007 |
| CA-REV-006 | High | Checkpoint and recovery imprecise | Restore point scope; durable session journal; cross-process lock; crash, full-disk and corruption recovery; honest cancellation reporting (5.6) | Closed in plan |
| CA-REV-007 | High | PRI-1 needs P1 and P2 exit gates | Exit gates in architecture Section 12, referenced from PHASES.md and the PHASE-1 and PHASE-2 acceptance criteria | Closed in plan |
| CA-REV-008 | Medium | Adapter capability negotiation and errors | Capability verification handshake; CLI re-check; normalized error taxonomy; configuration isolation (5.2, 5.8, 5.9; SEC-194) | Closed in plan |
| CA-REV-009 | Medium | MCP schemas, transport and indirect injection | Per-tool schemas and limits; stdio preferred; loopback token and replay protection; AND-of-controls authorization; output hygiene (7.1, 7.4 to 7.6; SEC-193) | Closed in plan |
| CA-REV-010 | Medium | Provenance ambiguous | Content-hash registry; deterministic flag; not an attestation (9; ARTIFACT_MANIFEST Section 13) | Closed in plan |
| CA-REV-011 | Medium | Test plan not measurable | Test matrix CAT-01 to CAT-13 with suite, expected result, evidence and blocking milestone (`TESTING_STRATEGY.md` Section 37.1) | Closed in plan |
| CA-REV-012 | Medium | Cross-document consistency | Checker run on the full checkout (0 errors); KR-CA IDs unique (checker rule 18); DB-M02 stays in P3; P1 and P2 safe without the P3 policy (default local policy); SYS-ADR-007 gate is a task dependency of F-M02 | Provisionally closed: open decisions A to E now have accountable owners and resolution gates (architecture Section 13); final closure needs the product owner's SYS-ADR-007 disposition, ADR conditions and phase and milestone references consistent with it, and a retained full-checkout checker run with task-ID uniqueness. Reviewer agreed with provisional status on 2026-10-10 |

New tasks: KR-CA-035 (F-M01), KR-CA-036 to KR-CA-038 (F-M02), KR-CA-039 (F-M03). "Closed in plan" means the planning documents are corrected. Implementation evidence is still required at the exit gates.

## 5. Remaining Actions Before an Approved Implementation Baseline

1. Disposition SYS-ADR-001 to SYS-ADR-006 (RAAS-004). The tracker gate in `DECISIONS.md` Section 4.2.1 stays in force.
2. Fill the Section 23.2 commitment baseline in `RESOURCE_PLAN.md` and assign named owners in tracking (RAAS-007). This blocks a committed delivery and spending baseline, but not approval of the indicative plan.
3. Domain owners reconcile the legacy phase-to-scope mappings in architecture, protocol, security and schema documents (RAAS-012). Afterwards, promote the `Phase N` warnings to errors and add domain-specific mapping checks.
4. Approve the corrections recorded in `PHASES.md` Section 25.
5. Add `python3 scripts/docs/check_docs.py` to CI and record each run's result here or in `STATUS.md`.
6. Decide the task-ID namespace scheme and renumber reused task IDs (RAAS-015).
7. Disposition SYS-ADR-007 and CR-2026-001 (coding-agent integration) before F-M02 PROJECTS coding-agent work starts, including the default for a never-configured organization (Option 2 recommended). Name owners for open decisions B to E (architecture Section 13); no provider and OS combination is released while B or D is open for it.
