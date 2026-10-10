# B-INC-004 — AUDIT-TRANSACTIONS-IDEMPOTENCY Test Plan

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-004 AUDIT-TRANSACTIONS-IDEMPOTENCY Test Plan |
| Path | `docs/planning/backend/increments/B-INC-004-AUDIT-TRANSACTIONS-IDEMPOTENCY/TEST_PLAN.md` |
| Status | Proposed |
| Owner role | QA Owner |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION |

## Related documents

- [Milestone](MILESTONE.md)
- [Tasks](TASKS.md)
- [Acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Security review](SECURITY_REVIEW.md)
- [Review checklist](REVIEW_CHECKLIST.md)
- [Backend test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Backend security gate](../../BACKEND_SECURITY_GATE.md)

## 1. Purpose and scope

This plan defines verification for the B-INC-004 database migration baseline, transaction-boundary pattern, idempotency behavior, audit repository/service, audit hooks, and shared verification slices.

The official parent milestone is **B-M01 CONTROL PLANE**. Migration work must coordinate with **DB-M01 FOUNDATION** and approved migration-tool decision **KR-BINC-001-004**.

The plan covers:

- Migration baseline and migration regression behavior.
- Transaction boundaries, rollback, persisted-state consistency, and failure/retry behavior.
- Idempotency persistence, equivalent-request replay, conflicting-key behavior, and applicable retries.
- Audit record contract, data protection, service behavior, and failure handling.
- Required audit hooks for identity, project, and platform-administration operations.
- Audit verification, migration, API integration, and Control Plane E2E tests.
- Applicable security-gate execution, review, documentation, and evidence.

**No test is claimed as passed.** Results remain TBD until actual execution against an identified revision and environment, followed by review.

## 2. Traceability rules

`ACCEPTANCE_CRITERIA.md` is the single source of truth for AC-to-BAC/BTS/SEC-GATE mappings.

- The matrix below reproduces each AC's `Test trace` and `Security-gate trace` exactly.
- Do not add or remove identifiers in the matrix without reviewing the corresponding AC first.
- Each task's `Linked tests` must equal the exact union of the test traces of its linked ACs.
- Each task's `Linked security gates` must equal the exact union of the security-gate traces of its linked ACs.
- Canonical BTS IDs identify test categories; execution evidence must identify the concrete test case, command, revision, environment, actual result, and reviewer.
- `Not applicable` means that the AC has no directly traced canonical security gate. It does not waive generally applicable security requirements.
- Planned tests and unexecuted checks must not be reported as passed.

## 3. Acceptance-criteria traceability matrix

| Acceptance criterion | Canonical test trace | Security-gate trace | Required verification focus |
|---|---|---|---|
| B-INC-004-AC-01 — Database migration baseline | BTS-012, BTS-013 | SEC-GATE-011 | Approved migration-tool alignment, migration ordering/versioning, migration execution, credential handling |
| B-INC-004-AC-02 — Transaction-boundary behavior | BTS-014, BTS-034 | Not applicable | Transaction boundaries, rollback, persisted-state consistency, failure/retry behavior |
| B-INC-004-AC-03 — Idempotency persistence and key semantics | BTS-015, BTS-016 | Not applicable | Key scope, request identity, replay/conflict persistence semantics |
| B-INC-004-AC-04 — Idempotency middleware and service behavior | BTS-015, BTS-016, BTS-034 | Not applicable | Equivalent replay, conflicting key reuse, retry behavior, duplicate-effect prevention |
| B-INC-004-AC-05 — Audit repository contract and data protection | BTS-029, BTS-030 | SEC-GATE-009, SEC-GATE-012 | Audit event contract, field classification, secret exclusion, evidence safety |
| B-INC-004-AC-06 — Audit service behavior and event data safety | BTS-029, BTS-030, BTS-031 | SEC-GATE-009, SEC-GATE-012 | Audit event construction, data safety, audit failure behavior |
| B-INC-004-AC-07 — Audit and transaction consistency | BTS-014, BTS-029, BTS-031 | Not applicable | Transaction outcome versus audit behavior, rollback/failure consistency |
| B-INC-004-AC-08 — Identity-operation audit coverage | BTS-029 | SEC-GATE-009, SEC-GATE-012 | Required identity events, event metadata, secret exclusion |
| B-INC-004-AC-09 — Project-operation audit coverage | BTS-029 | SEC-GATE-009, SEC-GATE-012 | Required project events, authorization/tenant context, secret exclusion |
| B-INC-004-AC-10 — Platform-administration audit coverage | BTS-029 | SEC-GATE-009, SEC-GATE-012 | Required administrative events, authorization boundary, secret exclusion |
| B-INC-004-AC-11 — Audit failure behavior and data safety | BTS-030, BTS-031, BTS-034 | SEC-GATE-009, SEC-GATE-012, SEC-GATE-013 | Approved failure policy, failure/retry behavior, safe logs/evidence, gate execution/review |
| B-INC-004-AC-12 — Migration regression coverage | BTS-012, BTS-013 | SEC-GATE-011 | Migration/version regression, environment/revision traceability, database credential safety |
| B-INC-004-AC-13 — Audit verification test coverage | BTS-029, BTS-030, BTS-031, BTS-036 | SEC-GATE-009, SEC-GATE-012, SEC-GATE-013 | Required events, data safety, failure behavior, review/evidence completeness |
| B-INC-004-AC-14 — API integration verification | BTS-032, BTS-034, BTS-036 | SEC-GATE-009, SEC-GATE-012, SEC-GATE-013 | Integrated transaction/idempotency/audit behavior, failure/retry, evidence, gates |
| B-INC-004-AC-15 — Control Plane end-to-end verification | BTS-033, BTS-034, BTS-036 | SEC-GATE-013 | Primary product path, applicable retry behavior, actual E2E evidence |
| B-INC-004-AC-16 — Architecture, security, documentation, and evidence review | BTS-036 | SEC-GATE-012, SEC-GATE-013 | Review records, findings, documentation, sanitized evidence, gate disposition |

## 4. Test design and execution requirements

### 4.1 Database migration baseline

Verify:

- The selected migration tool and behavior align with KR-BINC-001-004.
- The implementation coordinates with DB-M01 FOUNDATION and the approved database baseline.
- Migration order, versioning, and applicable execution rules are explicit.
- Repeated application, failure, and rollback behavior are tested where required by the approved tool and design.
- Schema/version checks identify the expected database state.
- Test results identify the actual database environment and implementation revision.
- Database credentials are not embedded in source, command output, logs, or retained evidence.

Do not assume that every migration tool supports automatic rollback. Test and document the behavior supported by the approved tool and design.

### 4.2 Transaction boundaries and rollback

Verify:

- Transaction ownership is explicit.
- Operations requiring atomicity use the approved transaction pattern.
- Success and failure paths produce the expected persisted state.
- Rollback tests assert state after the failure, not just the returned error.
- Retry behavior is tested where required.
- Audit behavior matches the approved transaction-consistency policy.
- External effects are not assumed to roll back automatically with database transactions.

### 4.3 Idempotency

Use synthetic request identifiers and payloads.

Verify:

- Equivalent requests with the same idempotency key follow the approved replay contract.
- Reuse of a key with a conflicting request is handled deterministically.
- Repeated or concurrent requests do not cause unintended duplicate effects.
- Failed requests and retries follow the approved contract.
- Persistence and transaction behavior preserve the expected idempotency state.
- Stored idempotency data does not retain prohibited secrets or uncontrolled sensitive response bodies.
- Errors and diagnostics do not disclose sensitive idempotency values.

Record the expected and actual status, response semantics, side-effect count, and persisted state for each replay/conflict scenario.

### 4.4 Audit repository and service

Verify:

- The audit record schema contains the required approved event metadata.
- Event construction and persistence follow the approved contract.
- Credentials, authentication secrets, private signing keys, and sensitive request payloads are excluded.
- Data classification and retention requirements are followed.
- Audit service success and failure behavior are explicit.
- Diagnostics and error paths do not disclose prohibited values.
- Event data can be verified using sanitized records.

### 4.5 Audit hooks

Verify the required event coverage separately for:

- Identity operations.
- Project operations.
- Platform-administration operations.

For each operation group, check applicable success/failure outcomes, required event metadata, secret exclusion, and preservation of authorization and transaction boundaries.

Use an audit-event coverage matrix that maps each required event to the concrete test case and actual result.

### 4.6 Audit and transaction failure behavior

Verify the approved policy for audit failures, including:

- Whether the business operation may proceed or must fail when audit persistence fails.
- How transaction outcome and audit outcome remain consistent with the approved design.
- What happens during rollback and retry.
- Whether audit events can be duplicated, omitted, or misleading after a failure.
- Whether logs and evidence remain sanitized.

Do not invent fail-open or fail-closed semantics. If the policy is not approved or is ambiguous, record a blocker.

### 4.7 API integration

Exercise actual API integration paths that use the transaction pattern, idempotency middleware/service, and audit hooks.

Include successful requests, equivalent replays, conflicting idempotency-key reuse, applicable failure/retry paths, and audit assertions. Record which integrated boundaries were exercised.

### 4.8 Control Plane end-to-end

The E2E test must exercise the approved primary product path through the intended integrated components and dependencies.

Verify relevant transaction, idempotency, and audit outcomes where in scope. Retain actual test output, environment, revision, failure/retry observations, and sanitized evidence. Do not use an isolated unit test as a substitute for the E2E requirement.

## 5. Shared-task slice boundaries

| Task | B-INC-004 slice | Boundary rule |
|---|---|---|
| KR-BE-1-046 — Add audit verification tests | Required audit events, audit data safety, audit failure behavior, review evidence | Other increments' audit obligations remain separately tracked |
| KR-BE-1-047 — Add migration tests | Approved migration baseline and persistence regression coverage | Must align with DB-M01 FOUNDATION and KR-BINC-001-004 |
| KR-BE-1-048 — Add API integration tests | Transaction/idempotency/audit integration and relevant failure/retry paths | Other increments' API integration obligations remain separately tracked |
| KR-BE-1-049 — Add Control Plane E2E test | Approved Control Plane primary product path and relevant failure/retry behavior | Do not use this slice to claim unrelated E2E coverage |

These tasks retain their original B-M01 estimates. The B-INC-004 slices do not create additional estimates for the shared tasks.

## 6. Execution record

Populate with actual results only.

| Test record | Canonical BTS IDs | Revision | Environment | Result | Evidence reference | Reviewer |
|---|---|---|---|---|---|---|
| Migration baseline | BTS-012, BTS-013 | TBD | TBD | TBD | TBD | TBD |
| Transaction rollback | BTS-014 | TBD | TBD | TBD | TBD | TBD |
| Idempotency replay/conflict | BTS-015, BTS-016 | TBD | TBD | TBD | TBD | TBD |
| Transaction/idempotency retry behavior | BTS-034 | TBD | TBD | TBD | TBD | TBD |
| Audit repository/service | BTS-029, BTS-030 | TBD | TBD | TBD | TBD | TBD |
| Audit failure behavior | BTS-031 | TBD | TBD | TBD | TBD | TBD |
| Identity audit hooks | BTS-029 | TBD | TBD | TBD | TBD | TBD |
| Project audit hooks | BTS-029 | TBD | TBD | TBD | TBD | TBD |
| Platform-administration audit hooks | BTS-029 | TBD | TBD | TBD | TBD | TBD |
| Audit verification slice | BTS-029, BTS-030, BTS-031, BTS-036 | TBD | TBD | TBD | TBD | TBD |
| Migration regression slice | BTS-012, BTS-013 | TBD | TBD | TBD | TBD | TBD |
| API integration slice | BTS-032, BTS-034, BTS-036 | TBD | TBD | TBD | TBD | TBD |
| Control Plane E2E | BTS-033, BTS-034, BTS-036 | TBD | TBD | TBD | TBD | TBD |
| Architecture/security/docs/evidence review | BTS-036 | TBD | TBD | TBD | TBD | TBD |

## 7. Exit criteria

B-INC-004 testing may be recommended for acceptance only when:

1. All 16 ACs have recorded outcomes supported by reviewed evidence.
2. Migration behavior aligns with DB-M01 FOUNDATION and KR-BINC-001-004.
3. Required transaction rollback and persisted-state assertions have actual results.
4. Idempotency replay, conflict, and applicable failure/retry behavior have actual results.
5. Required audit events are verified across identity, project, and platform-administration operations.
6. Audit data protection and failure behavior are verified against the approved policy.
7. Migration, audit, API integration, and E2E tests have actual execution records.
8. Applicable security gates have execution and review records.
9. Shared-task slice evidence is scoped correctly.
10. Task-level test and security-gate unions match the linked AC traces exactly.
11. Documentation and retained evidence are complete, reviewable, and sanitized.
12. KR-CA-025 remains deferred and is not represented as completed.

**Current status: Proposed. No tests are claimed as passed.**
