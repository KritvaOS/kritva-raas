# B-INC-004 — AUDIT-TRANSACTIONS-IDEMPOTENCY

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-004 AUDIT-TRANSACTIONS-IDEMPOTENCY Milestone |
| Path | `docs/planning/backend/increments/B-INC-004-AUDIT-TRANSACTIONS-IDEMPOTENCY/MILESTONE.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION |

## Related documents

- [Task register](TASKS.md)
- [Acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Review checklist](REVIEW_CHECKLIST.md)
- [Backend implementation plan](../../BACKEND_IMPLEMENTATION_PLAN.md)
- [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Backend test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Backend security gate](../../BACKEND_SECURITY_GATE.md)
- [Parent B-M01 tasks](../../../../backend/milestones/B-M01-CONTROL-PLANE/TASKS.md)

## 1. Milestone purpose

B-INC-004 implements the database migration baseline, transaction-boundary pattern, idempotency behavior, audit persistence and service, and required audit hooks across identity, project, and platform-administration operations.

The increment also covers migration regression tests, audit verification tests, API integration tests, and the Control Plane end-to-end path.

The official parent milestone is **B-M01 CONTROL PLANE**. Migration work must coordinate with **DB-M01 FOUNDATION** and the approved migration-tool decision **KR-BINC-001-004**.

## 2. Scope

### In scope

- Establish the approved database migration baseline.
- Implement and test the transaction-boundary pattern, including rollback and failure/retry behavior.
- Implement idempotency persistence and request replay/conflict semantics.
- Implement idempotency middleware/service integration.
- Define the audit repository contract and implement the audit service.
- Add required audit hooks to identity operations.
- Add required audit hooks to project operations.
- Add required audit hooks to platform-administration operations.
- Verify required audit events, audit data safety, audit failure behavior, and transaction consistency.
- Add migration regression tests.
- Add API integration tests.
- Add the Control Plane end-to-end test.
- Complete the applicable architecture/security review, documentation, and evidence records.

### Out of scope

- Redefining the approved migration-tool decision **KR-BINC-001-004** within this increment.
- Replacing or independently redefining the database foundation established by DB-M01 FOUNDATION.
- Expanding audit coverage into unrelated subsystems without an approved scope change.
- Treating audit logging as permission to retain credentials, authentication secrets, private keys, or sensitive request payloads.
- Implementing **KR-CA-025 — coding-agent policy audit**. This remains deferred and must not be marked complete through B-INC-004.
- Claiming transaction, idempotency, audit, or E2E verification passed without actual execution evidence.

## 3. Required design outcomes

### 3.1 Migration baseline

- Migration ordering, versioning, application, and rollback expectations follow the approved migration-tool decision.
- Migration changes coordinate with DB-M01 FOUNDATION and existing database ownership.
- Migration execution is reproducible and safe against unintended repeated application.
- Migration and persistence regression tests verify the approved baseline.
- Database credentials and connection secrets are handled through the approved secret-management mechanism and are not committed or exposed in logs/evidence.

### 3.2 Transaction boundaries

- Transaction ownership and boundaries are explicit for operations that require atomicity.
- Failure paths are tested for rollback and persisted-state consistency.
- Audit/event behavior is reviewed for consistency with the transaction model.
- External side effects are not assumed to roll back automatically with a database transaction; any such behavior must follow an explicitly approved design.

### 3.3 Idempotency

- The approved idempotency key scope and request identity rules are explicit.
- Repeated equivalent requests follow the approved replay semantics.
- Reuse of a key with a conflicting request is handled deterministically.
- Concurrent requests, failed requests, and retries are covered where required by the approved contract.
- Stored idempotency data excludes prohibited secret material and does not expose sensitive response payloads.

### 3.4 Audit behavior

- Required audit events are defined and emitted for identity operations, project operations, and platform-administration operations.
- Audit records contain the approved event metadata needed for traceability.
- Credentials, authentication secrets, private keys, and sensitive request payloads are excluded.
- Logging and diagnostic paths do not expose prohibited values.
- Audit persistence and failure behavior follow the approved consistency and availability policy.
- Audit failure behavior is explicit; the implementation must not silently invent a fail-open or fail-closed policy.

## 4. Task inventory

| Task ID | Task | Estimate | Owner role |
|---|---|---:|---|
| KR-BE-1-032 | Implement database migration baseline | 2d | Database |
| KR-BE-1-033 | Implement transaction boundary pattern | 2d | Backend/Database |
| KR-BE-1-034 | Implement IdempotencyRepository | 2d | Backend/Database |
| KR-BE-1-035 | Implement idempotency middleware/service | 2d | Backend |
| KR-BE-1-036 | Define AuditRepository | 1.5d | Security/Backend |
| KR-BE-1-037 | Implement AuditService | 2d | Backend/Security |
| KR-BE-1-038 | Add audit hooks to identity operations | 1.5d | Backend/Security |
| KR-BE-1-039 | Add audit hooks to project operations | 1.5d | Backend/Security |
| KR-BE-1-040 | Add audit hooks to platform administration | 1.5d | Backend/Security |
| KR-BE-1-046 | Add audit verification tests | 2d | QA/Security |
| KR-BE-1-047 | Add migration tests | 2d | Database/QA |
| KR-BE-1-048 | Add API integration tests | 3d | QA |
| KR-BE-1-049 | Add Control Plane E2E test | 3d | QA |

The estimates are the existing B-M01 estimates. Shared verification tasks retain their original whole-task estimates; this increment does not add a second estimate for the same shared work.

## 5. Dependencies and coordination

- `KR-BE-1-032` must coordinate with DB-M01 FOUNDATION, the existing migration baseline, and decision `KR-BINC-001-004`.
- Transaction and idempotency work must build on the approved migration/persistence baseline.
- AuditRepository and AuditService must follow the approved security, persistence, and event-data requirements.
- Identity, project, and platform-administration audit hooks must integrate with their respective operation paths without bypassing authorization or transaction boundaries.
- Shared test tasks must retain the scope and dependencies recorded in the parent B-M01 task register.
- The Control Plane E2E test must exercise the intended primary product path and relevant failure/retry behavior.

## 6. Acceptance and traceability

`ACCEPTANCE_CRITERIA.md` is the single source of truth for this increment's acceptance traces.

- Every task must link to one or more increment ACs.
- `Linked tests` must equal the exact union of the `Test trace` values of the linked ACs.
- `Linked security gates` must equal the exact union of the `Security-gate trace` values of the linked ACs.
- No test or gate identifier may be added or removed from a task without a corresponding reviewed change to its linked AC traces.
- `Not applicable` is valid only when no linked AC contributes a concrete security-gate identifier.
- Planned or unexecuted verification remains TBD.

## 7. Security and data-handling requirements

- Audit records must exclude credentials, authentication secrets, private signing keys, and sensitive request payloads.
- Idempotency records must not become an uncontrolled store for sensitive response bodies or secret-bearing requests.
- Database connection secrets must be obtained through the approved configuration/secret mechanism.
- Logs, traces, test output, and retained evidence must be reviewed for sensitive-value leakage.
- Test data must be synthetic or otherwise explicitly approved for the environment.
- Evidence committed to the repository must be sanitized and independently reviewable.
- Applicable SEC-GATE-009, SEC-GATE-011, SEC-GATE-012, and SEC-GATE-013 requirements must be followed according to the AC trace mapping and canonical security-gate definitions.

## 8. Completion criteria

B-INC-004 may be recommended for closure only after:

1. All linked tasks have an accurately recorded implementation status.
2. The migration baseline and migration-tool decision alignment have been reviewed.
3. Transaction rollback, idempotency replay/conflict, and relevant failure/retry behavior have actual test results.
4. Required audit events are verified across the three operation groups.
5. Audit data protection and applicable secret-handling controls are reviewed.
6. Migration, audit, API integration, and E2E tests have recorded actual outcomes.
7. Applicable security gates have execution and review records.
8. Architecture, security, documentation, and evidence reviews are complete.
9. The task-level trace unions match the saved AC traces exactly.
10. Deferred KR-CA-025 remains explicitly out of scope.

## 9. Status

**Status: Proposed.**

This document establishes planned scope and completion conditions. It does not assert that implementation, testing, or review has passed.
