# Current Plan

## Document Control

| Field | Value |
|---|---|
| Document | Current Plan |
| Path | `planning/CURRENT_PLAN.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Last updated | 2026-10-12 |
| Related documents | [README.md](README.md); [PLANNING_MIGRATION_PLAN.md](PLANNING_MIGRATION_PLAN.md); [backend/increments/B-INC-001-SECURE-FOUNDATION/TASKS.md](backend/increments/B-INC-001-SECURE-FOUNDATION/TASKS.md) |

## 1. Purpose

This is the ordered list of the next work. It is a view. It holds no task status, decision disposition or acceptance. Those are in the records named in [PLANNING_AUTHORITY_MATRIX.md](PLANNING_AUTHORITY_MATRIX.md). Update this file in the same pull request as the change that makes it stale, and check the date above.

## 2. Active Scope

| Item | Where |
|---|---|
| Active backend increment | B-INC-001 SECURE FOUNDATION, under B-M01 CONTROL PLANE (canonical phase P3 CONTROL PLANE, prerequisite P0 FOUNDATION). Task status is in [TASKS.md](backend/increments/B-INC-001-SECURE-FOUNDATION/TASKS.md) |
| Backend runtime | `apps/backend` (Node.js 24.21.0, Fastify 5.12.5). Its README describes the transport, the request context and the response and error contract |
| Planning alignment | The steps of [PLANNING_MIGRATION_PLAN.md](PLANNING_MIGRATION_PLAN.md) |

## 3. Order of Work

1. **Planning alignment.** Steps 1 to 5 of the migration plan are done ([PLANNING_STATUS_VOCABULARY.md](PLANNING_STATUS_VOCABULARY.md), with the owner decisions OD-1 to OD-3 recorded). Step 6 is the report-only status consistency check (`make status-report`). Steps 7 to 9 follow in the order of the migration plan: consolidation of `docs/tracking/`, phase and task folders, and increment relocation if still wanted. Each step is its own pull request.
2. **Open owner items for B-INC-001.** These do not depend on the planning alignment and can be done in any order:
   - evidence for `B-INC-001-AC-05` and the Security Owner's disposition of the historical credential-shaped finding;
   - owner review records for KR-BE-1-003 to KR-BE-1-007 (these are owner reviews, not independent reviews);
   - the decision on request correlation for KR-BE-1-008;
   - answers from the Security Owner, the Cloud/Infrastructure Owner and the Database lead for the decisions assigned to them (KR-BINC-001-004 and KR-BINC-001-005);
   - the milestone Task Register for B-M01 shows KR-BE-1-001 unchecked while the increment records it Accepted; the status report lists it, and the owner decides whether to update the view;
   - the owner's decision on the links to `SEC-GATE-009` and on success codes per endpoint.
3. **Backend tasks after the transport foundation.** KR-BE-1-008 (correlation), KR-BE-1-009 (health and readiness) and KR-BE-1-041 (structured logging), in the order their dependencies allow.
4. **Integration evidence.** `BTS-032` needs an integration test beyond the current component tests. `SEC-GATE-009` (logging redaction) stays open until its evidence exists.

## 4. Rules for This Plan

- Do not start B-INC-002 to B-INC-004 work until the preceding work and dependencies have been reviewed ([backend/README.md](backend/README.md) Section 4).
- A Proposed planning document does not authorize implementation where a required contract, decision or security review is unresolved.
- Where this plan and a canonical record differ, the canonical record is correct and this plan is a defect to fix.
