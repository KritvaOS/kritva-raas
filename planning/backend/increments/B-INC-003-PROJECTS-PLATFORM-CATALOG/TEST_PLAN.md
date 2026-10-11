# B-INC-003 — PROJECTS-PLATFORM-CATALOG Test Plan

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-003 PROJECTS-PLATFORM-CATALOG Test Plan |
| Path | `planning/backend/increments/B-INC-003-PROJECTS-PLATFORM-CATALOG/TEST_PLAN.md` |
| Status | Proposed |
| Owner role | QA Owner |
| Related milestones | B-M01 CONTROL PLANE; B-M03 PLATFORM |

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

This plan defines the verification needed for B-INC-003 under the official parent milestone **B-M01 CONTROL PLANE**.

In scope:

- Project domain model, persistence, service behavior, API contract, and authorization.
- Project tenant isolation across application, service/repository, and applicable database boundaries.
- The metadata-only project API boundary and secret-safe handling.
- Platform-catalog model, persistence, service, API contract, and administration authorization.
- The B-M03 PLATFORM authoritative ownership/lifecycle boundary.
- B-INC-003 slices of the shared API contract, authorization, and tenant-isolation test tasks.
- Integration verification, review, and acceptance evidence.

This plan does not claim that implementation or testing has occurred. All test results remain **TBD** until executed against an identified revision and reviewed.

## 2. Traceability rules

`ACCEPTANCE_CRITERIA.md` is the single source of truth for AC-to-BAC/BTS/SEC-GATE mappings.

- The matrix below reproduces each AC's `Test trace` and `Security-gate trace` exactly.
- Do not add or remove canonical identifiers in this matrix without first reviewing the corresponding AC.
- Task-level `Linked tests` and `Linked security gates` must be the exact unions of the linked AC traces in `TASKS.md`.
- A test ID in the trace identifies the canonical test category; the concrete test case, command, environment, revision, and result must be recorded in execution evidence.
- `Not applicable` means the AC has no directly traced canonical security gate. It does not remove general security obligations.
- An unexecuted test must not be recorded as passed.

## 3. Acceptance-criteria traceability matrix

| Acceptance criterion | Canonical test trace | Security-gate trace | Required verification focus |
|---|---|---|---|
| B-INC-003-AC-01 — Project domain model | BTS-023, BTS-025 | Not applicable | Model identity, ownership, metadata contract, and API-facing model compatibility |
| B-INC-003-AC-02 — Project persistence and ownership | BTS-023, BTS-025 | Not applicable | Persistence integrity, ownership-aware queries, repository contract |
| B-INC-003-AC-03 — Project service access semantics | BTS-023 | Not applicable | Permitted/denied service operations and denied-mutation behavior |
| B-INC-003-AC-04 — Project API contract | BTS-025, BTS-032 | Not applicable | Project request/response contract, validation, errors, and integration |
| B-INC-003-AC-05 — Project authorization | BTS-023 | SEC-GATE-013 | Project authorization matrix, allowed/denied behavior, gate execution/review |
| B-INC-003-AC-06 — Project tenant isolation | BTS-020, BTS-021, BTS-022 | SEC-GATE-013 | Cross-tenant isolation, tenant-context integrity, database tenant enforcement |
| B-INC-003-AC-07 — Platform-catalog ownership boundary | BTS-027 | Not applicable | Alignment with B-M03 PLATFORM's authoritative catalog contract |
| B-INC-003-AC-08 — Platform-catalog persistence | BTS-027 | Not applicable | Repository and persistence behavior against the approved catalog contract |
| B-INC-003-AC-09 — Platform-catalog service contract | BTS-027, BTS-028 | Not applicable | Catalog service behavior, validation, and response classification |
| B-INC-003-AC-10 — Platform-catalog API contract | BTS-027, BTS-028, BTS-032 | Not applicable | API contract, validation, and applicable integration behavior |
| B-INC-003-AC-11 — Platform-administration authorization | BTS-024 | SEC-GATE-013 | Administrative privilege checks and denied-operation behavior |
| B-INC-003-AC-12 — Project metadata-only and secret-safe API boundary | BTS-026, BTS-028 | SEC-GATE-009, SEC-GATE-012 | Prohibited payload rejection, response classification, logging redaction, secret-safe evidence |
| B-INC-003-AC-13 — Shared project and catalog API contract verification | BTS-025, BTS-027, BTS-032, BTS-036 | SEC-GATE-009, SEC-GATE-012, SEC-GATE-013 | Shared-task contract slice, integration results, evidence completeness, applicable gate records |
| B-INC-003-AC-14 — Project and platform-administration authorization test slice | BTS-023, BTS-024, BTS-036 | SEC-GATE-012, SEC-GATE-013 | Shared authorization slice, actual results, secret-safe evidence, applicable gate records |
| B-INC-003-AC-15 — Project tenant-isolation test slice | BTS-020, BTS-021, BTS-022, BTS-036 | SEC-GATE-012, SEC-GATE-013 | Shared isolation slice, application/database boundary results, evidence completeness |
| B-INC-003-AC-16 — API integration verification and evidence | BTS-032, BTS-036 | SEC-GATE-013 | Integration execution, reproducibility, revision traceability, gate execution/review |
| B-INC-003-AC-17 — Architecture, security, documentation, and evidence review | BTS-036 | SEC-GATE-012, SEC-GATE-013 | Review records, finding dispositions, documentation, secret-safe evidence |

## 4. Test design and execution requirements

### 4.1 Project domain model and persistence

Verify:

- Required project identity and ownership fields are represented and validated.
- Metadata follows the approved contract.
- Repository operations preserve ownership and metadata integrity.
- Lookup and mutation behavior uses the approved ownership and tenant context.
- A project identifier alone cannot authorize access.
- Database constraints, queries, and tenant enforcement are tested where required by the approved design.

Retain model/repository test output and any relevant schema or migration verification.

### 4.2 Project service and API contract

Verify:

- Project service operations preserve the approved access semantics.
- Request validation rejects missing, malformed, or disallowed fields according to the contract.
- Responses contain only approved fields.
- Error responses follow the API contract and do not disclose sensitive internal details.
- Integration tests exercise the implemented API path rather than only isolated helpers.
- Denied mutations do not cause unintended persisted-state changes where applicable.

### 4.3 Project authorization and tenant isolation

Use synthetic principals and isolated tenants. Do not use real customer credentials or production data.

Cover at least:

- A principal performing an operation permitted by the approved policy.
- An authenticated principal without the required project permission.
- An unauthenticated request where authentication is required.
- A principal attempting to read another tenant's project.
- A principal attempting to modify another tenant's project.
- Missing, invalid, or improperly substituted tenant context.
- Repository/database access paths that must enforce tenant restrictions.
- Before/after state checks for denied writes.

Record the tested boundary for every isolation result. Application-layer denial alone must not be reported as proof of database-level enforcement.

### 4.4 Platform catalog and B-M03 boundary

Verify:

- The model, repository, service, and API conform to the approved platform-catalog contract.
- The B-M03 PLATFORM owner or designated architecture owner confirms the authoritative ownership and lifecycle boundary.
- Control-plane integration does not create a competing authoritative catalog.
- Catalog validation and response classification follow the approved contract.
- Administrative operations are independently protected by the platform-administration authorization policy.

Do not infer administrative authorization from successful catalog reads or from authentication alone.

### 4.5 Metadata-only and secret-safe behavior

Negative tests must exercise prohibited inputs without retaining the sensitive contents in logs or evidence. Use harmless synthetic markers for credentials and key-like payloads.

Verify that project APIs reject or otherwise prevent prohibited source files, source archives, credentials, authentication secrets, and private signing keys from entering the project metadata path. Confirm the exact behavior against the approved API contract.

Inspect:

- Request validation and response schemas.
- Error messages and application logs.
- Any request-body logging, tracing, and diagnostic paths.
- Test reports, screenshots, and retained evidence.
- Evidence redaction before committing or publishing it.

A rejected request is not sufficient evidence if the payload was already logged or persisted elsewhere.

## 5. Shared-task slice boundaries

The following tasks are shared B-M01 tasks. Their estimates remain the original whole-task estimates; this increment's slice does not create additional effort.

| Task | B-INC-003 scope | Out-of-scope handling |
|---|---|---|
| KR-BE-1-043 — Add API contract tests | Project and platform-catalog contract, metadata-only boundary, applicable integration tests | Track other increments' contract obligations separately |
| KR-BE-1-044 — Add authorization tests | Project authorization and platform-administration authorization | Do not mark other increments' authorization work complete through this slice |
| KR-BE-1-045 — Add tenant-isolation tests | Project tenant isolation and applicable database enforcement | Keep other increments' isolation obligations separately tracked |

Every shared-task result must identify the tested increment slice, implementation revision, executed test scope, actual result, and remaining obligations.

## 6. Execution record

Populate this table with actual results. Do not use `Pass` as a placeholder for planned execution.

| Test record | Canonical BTS IDs | Revision | Environment | Result | Evidence reference | Reviewer |
|---|---|---|---|---|---|---|
| Project model/repository | BTS-023, BTS-025 | TBD | TBD | TBD | TBD | TBD |
| Project service/API contract | BTS-023, BTS-025, BTS-032 | TBD | TBD | TBD | TBD | TBD |
| Project authorization | BTS-023 | TBD | TBD | TBD | TBD | TBD |
| Project tenant isolation | BTS-020, BTS-021, BTS-022 | TBD | TBD | TBD | TBD | TBD |
| Platform-catalog contract | BTS-027, BTS-028 | TBD | TBD | TBD | TBD | TBD |
| Platform-catalog integration | BTS-027, BTS-028, BTS-032 | TBD | TBD | TBD | TBD | TBD |
| Platform administration authorization | BTS-024 | TBD | TBD | TBD | TBD | TBD |
| Metadata-only and secret-safe behavior | BTS-026, BTS-028 | TBD | TBD | TBD | TBD | TBD |
| Shared API contract slice | BTS-025, BTS-027, BTS-032, BTS-036 | TBD | TBD | TBD | TBD | TBD |
| Shared authorization slice | BTS-023, BTS-024, BTS-036 | TBD | TBD | TBD | TBD | TBD |
| Shared tenant-isolation slice | BTS-020, BTS-021, BTS-022, BTS-036 | TBD | TBD | TBD | TBD | TBD |
| API integration and evidence | BTS-032, BTS-036 | TBD | TBD | TBD | TBD | TBD |
| Architecture/security/docs/evidence review | BTS-036 | TBD | TBD | TBD | TBD | TBD |

## 7. Exit criteria

B-INC-003 testing may be recommended for acceptance only when:

1. All 17 ACs have a recorded result supported by reviewed evidence.
2. Required tests have been executed against an identified revision.
3. Failures and blockers have explicit dispositions; unresolved mandatory failures block acceptance.
4. Project authorization and tenant-isolation results cover the required boundaries.
5. Platform-catalog alignment with B-M03 PLATFORM is confirmed.
6. The metadata-only and secret-safe boundary is verified, including relevant logging and evidence handling.
7. Applicable security gates have execution and review records.
8. Shared-task slice evidence is scoped correctly and does not close unrelated work.
9. Documentation and evidence are complete enough for independent review and do not expose prohibited secrets.
10. The reviewer confirms that task-level test and security-gate unions exactly match the linked AC traces.

**Current status: Proposed. No tests are claimed as passed.**
