# Backend Risk Register

## Document Control

| Field | Value |
|---|---|
| Document | Backend Risk Register |
| Path | `docs/planning/backend/BACKEND_RISK_REGISTER.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; DB-M02 CORE DATA; B-M03 PLATFORM; C-M01 FOUNDATION; C-M02 DEVELOPMENT |

## 1. Purpose

This document records implementation risks specific to the backend planning and delivery work. It supplements the program risk register without duplicating risks that are already owned and managed at program level.

Backend risks use the dedicated `R-BE-nnn` namespace.

The program risk register at `docs/tracking/RISK_REGISTER.md` remains authoritative for program-wide risks, including secrets exposure, cross-tenant access, authentication compromise, architecture coupling, contract drift, schedule bottlenecks, resource availability, and cross-domain test quality.

Where a program risk applies, this register references its existing ID and tracks only the additional backend-specific exposure or delivery action.

## 2. Risk Management Rules

1. A risk describes a possible future adverse condition; an issue describes a condition that has occurred.
2. Risk IDs in this document must use `R-BE-nnn` and must not collide with IDs in the program register.
3. Every risk must have a canonical phase, owner role, likelihood, impact, mitigation, observable trigger, and linked acceptance or test gate.
4. Likelihood and impact use the program register's 1–5 scales.
5. The score is likelihood multiplied by impact.
6. A mandatory security or tenant-isolation failure may block acceptance regardless of its numeric risk score.
7. Mitigation is not considered complete merely because a task is planned.
8. When a risk materializes, create or update the appropriate issue and retain the original risk record until its disposition is approved.
9. Risk acceptance requires the relevant authority and documented rationale.
10. Changes to a program-owned risk must be recorded in the program risk register; this document must not silently replace its owner, score, or status.

## 3. Scoring Model

### 3.1 Likelihood

| Score | Level | Meaning |
|---:|---|---|
| 1 | Rare | Unlikely during the relevant implementation |
| 2 | Unlikely | Possible but not expected |
| 3 | Possible | Credible and reasonably foreseeable |
| 4 | Likely | Expected unless actively controlled |
| 5 | Almost Certain | Expected to occur or already strongly indicated |

### 3.2 Impact

| Score | Level | Meaning |
|---:|---|---|
| 1 | Negligible | Minimal local impact |
| 2 | Minor | Limited rework or delay |
| 3 | Moderate | Material task or increment impact |
| 4 | Major | Major increment, milestone, or integration impact |
| 5 | Critical | Severe security, data integrity, milestone, or release impact |

### 3.3 Score Bands

| Score | Rating | Required treatment |
|---:|---|---|
| 1–4 | Low | Monitor |
| 5–9 | Medium | Mitigate and review |
| 10–14 | High | Active mitigation and owner review |
| 15–19 | Very High | Escalate to the relevant milestone or program owner |
| 20–25 | Critical | Immediate mitigation; acceptance may be blocked |

Security and tenant-isolation policies may require a block even when the calculated score is below the Critical band.

## 4. Backend-Specific Risk Register

All risks below are Proposed. Initial scores are planning assessments, not evidence-based measurements. The owner must reassess them as implementation evidence becomes available.

| ID | Risk and consequence | Canonical phase | Likelihood | Impact | Score | Owner role | Mitigation | Trigger | Linked gate | Related program risk |
|---|---|---|---:|---:|---:|---|---|---|---|---|
| R-BE-001 | Runtime, language, package manager, HTTP framework, migration tool, or scanner decisions remain unresolved when dependent implementation begins, causing rework or incompatible tooling. | P3 CONTROL PLANE | 3 | 3 | 9 | Backend Technical Lead | Record options, recommendation, rationale, compatibility constraints, and approval before dependent tasks become Ready. | A task requires an unapproved technology choice or CI cannot reproduce the selected toolchain. | BAC-001; BTS-001 | R-TECH-001 |
| R-BE-002 | Backend module boundaries or API semantics are interpreted differently by implementers, resulting in circular dependencies, inconsistent errors, or integration rework. | P3 CONTROL PLANE | 3 | 4 | 12 | Backend Technical Lead | Review module boundaries and API contracts before implementation; add contract tests and architecture review evidence. | An implementation introduces an unapproved dependency direction or fails a contract test. | BAC-002; BAC-004; BTS-004; BTS-007 | R-TECH-001; R-TECH-002 |
| R-BE-003 | Database test infrastructure or migration prerequisites are unavailable when backend integration needs them, blocking reproducible testing and obscuring schema defects. | P3 CONTROL PLANE | 3 | 4 | 12 | Database Technical Lead | Agree the migration tool and test database procedure early; establish a clean-database test and record the responsible dependency owner. | A required migration or database integration test cannot run in the approved test environment. | BTS-011; BTS-012; BAC-014; BAC-015 | R-SCH-002; R-DEP-001 |
| R-BE-004 | Existing task estimates omit or underrepresent shared verification, security scanning, architecture review, remediation, and evidence preparation, making increment effort appear smaller than required. | P3 CONTROL PLANE | 4 | 3 | 12 | Backend Technical Lead | Keep direct implementation estimates separate from shared test/review estimates; refine effort after task and acceptance review; do not treat sums as schedule commitments. | Shared work is repeatedly deferred, acceptance evidence is incomplete, or task effort materially exceeds its estimate. | BAC-031; BAC-035; BAC-038 | R-SCH-002; R-RES-001; R-QUAL-001 |
| R-BE-005 | Cross-increment test tasks are marked complete based on partial coverage, leaving required authorization, migration, audit, or end-to-end scenarios unverified at final acceptance. | P3 CONTROL PLANE | 3 | 4 | 12 | QA Owner | Map each test to its acceptance scope, preserve uncompleted obligations, and require an evidence matrix before increment or milestone acceptance. | An acceptance criterion has no test evidence or a shared test task is accepted without all required scope. | BTS-036; BAC-031; BAC-038 | R-QUAL-001 |
| R-BE-006 | Platform-catalog work is pulled into B-M01 without resolving the B-M03 PLATFORM ownership boundary, causing duplicated implementation or conflicting contracts. | P3 CONTROL PLANE | 3 | 3 | 9 | B-M01 Milestone Owner | Review ownership, contracts, and task mapping with the B-M03 PLATFORM Owner before catalog work becomes Ready. | Two workstreams claim the same deliverable or catalog changes conflict with the approved scope. | BAC-025; BAC-035 | R-TECH-001; R-TECH-002 |
| R-BE-007 | Coding-agent policy implementation starts before required architecture and database decisions are resolved, causing incompatible persistence or policy behavior. | P3 CONTROL PLANE | 3 | 4 | 12 | Coding-Agent Architecture Owner | Keep gated tasks Blocked until SYS-ADR-007, the applicable DB-M02 CORE DATA dependency, and KR-CA-031 are explicitly dispositioned. | A coding-agent policy task starts without the required approved decision or schema dependency. | BAC-035; BAC-038 | R-TECH-001; R-DEP-002 |
| R-BE-008 | The documented backend security controls are mistaken for implemented controls, leaving repository secret protection or CI enforcement absent when the increment is accepted. | P0 FOUNDATION | 3 | 5 | 15 | Security Owner | Track the reported manual scan separately from automated enforcement; require demonstrated scanner behavior, blocking CI, reviewed findings, and retained evidence. | An acceptance review marks a security criterion passed based only on documentation or the earlier manual scan. | SEC-GATE-005; SEC-GATE-013; BAC-010 | R-SEC-007 |
| R-BE-009 | The development setup documentation fix is assumed complete without verifying the actual file and rescan, leaving a credential-shaped example unresolved. | P0 FOUNDATION | 3 | 4 | 12 | Security Owner | Verify the actual `DEVELOPMENT_SETUP.md` diff, confirm the replacement is unmistakably nonfunctional, and rescan the agreed working-tree and history scope. | The placeholder change is absent, ambiguous, or has no retained rescan evidence. | SEC-GATE-001; BAC-007 | R-SEC-007 |
| R-BE-010 | Backend planning and implementation drift from canonical phase, milestone, task-ID, or document-link conventions, causing traceability and repository-checker failures. | P0 FOUNDATION | 2 | 3 | 6 | Backend Technical Lead | Run the repository documentation checker after each planning batch; review canonical labels, task-ID uniqueness, relative links, and references to existing files. | A checker run reports an error or a review finds a noncanonical phase/milestone label or colliding task ID. | BAC-038; BTS-036 | R-TECH-002; R-QUAL-001 |

## 5. Program Risk Cross-References

The following program risks remain authoritative in `docs/tracking/RISK_REGISTER.md`. They are referenced here only to connect backend delivery work to the existing program-level risk owner and mitigation.

| Program risk ID | Existing program risk | Backend relationship | Backend handling |
|---|---|---|---|
| R-SEC-007 | Secrets leak through source, logs, or artifacts | Backend repository controls, safe configuration, logging redaction, and scanner enforcement contribute to the program mitigation. | Track implementation and evidence through SEC-GATE criteria; do not create a competing program-level risk record. |
| R-SEC-002 | Cross-tenant data access occurs | Backend authorization and database tenant-isolation tests provide evidence for the control-plane portion of the risk. | Track the implementation gates and report failures to the program risk owner. |
| R-SEC-005 | Authentication credentials are compromised | Backend authentication boundary and credential-handling behavior contribute to the program control. | Coordinate the implementation with the Identity Owner and Security Owner. |
| R-SEC-006 | Authorization bypass permits privileged action | Backend default-deny and administrative authorization tests contribute to mitigation. | Use the applicable acceptance and authorization test evidence. |
| R-TECH-001 | Modular-monolith boundaries become tightly coupled | Backend module decisions and architecture review are direct mitigation evidence. | Track backend-specific decision and review readiness under R-BE-001 and R-BE-002. |
| R-TECH-002 | Studio, backend, and Lab contracts drift | REST API v1 and cross-workstream contract tests contribute to mitigation. | Track contract compatibility evidence under R-BE-002 and R-BE-010. |
| R-SCH-002 | Backend/database/cloud work becomes a serial bottleneck | Dependency resolution and shared-work estimation affect the backend contribution to the program schedule. | Track actual dependency blockers and task-estimate changes. |
| R-RES-001 | Required robotics, cloud, or security skills are unavailable | Backend delivery requires qualified architecture, database, security, and CI owners. | Record owner-role gaps and escalate through the resource plan. |
| R-QUAL-001 | Automated tests miss cross-domain failures | Backend contract, integration, authorization, migration, and end-to-end coverage contribute to mitigation. | Track required test scope and retained evidence. |
| R-DEP-001 | External service outage blocks core workflow | External database, identity, or other required service dependencies may block backend verification. | Track actual dependency availability and approved failure behavior. |
| R-DEP-002 | Coding-agent provider outage, rate limit, or pricing change degrades the agent capability | Backend coding-agent policy work must preserve the approved integration boundary and not create unapproved provider coupling. | Keep policy work behind its explicit contract and schema gates. |

Program risk scores, statuses, owners, and mitigation commitments must be read from the authoritative program register. This backend document does not override them.

## 6. Risk Review Cadence

The Backend Technical Lead should review this register:

- During B-INC-001 task refinement.
- Before the B-INC-001 implementation baseline is frozen.
- When a required dependency becomes Blocked.
- When a security or architecture gate fails.
- Before each increment acceptance review.
- When an issue materially changes likelihood, impact, or mitigation effectiveness.

The review must update likelihood and impact based on available evidence, record materialized risks as issues, and identify the owner and next action.

## 7. Risk Escalation

Escalate a risk when:

- Its score enters the High, Very High, or Critical band.
- A mandatory security or tenant-isolation gate fails.
- A dependency blocks a critical implementation path.
- An unresolved architecture decision threatens a public contract.
- A required owner role is unavailable.
- The risk threatens an existing milestone's scope or acceptance.
- A mitigation cannot be completed within the approved increment.

Critical security or tenant-isolation failures block acceptance regardless of score. Schedule pressure is not a basis for accepting prohibited secret exposure or unauthorized cross-tenant access.

## 8. Current Status

This register is Proposed.

The initial scores are planning assessments. The Security Owner, Backend Technical Lead, and relevant milestone owners must validate them during B-INC-001 review.

The reported manual scan baseline and the reported DEVELOPMENT_SETUP finding are recorded as backend delivery risks, not as proof that automated controls already exist. The actual remediation, rescan, scanner configuration, and CI enforcement must be verified against the repository before their linked gates are marked passed.
