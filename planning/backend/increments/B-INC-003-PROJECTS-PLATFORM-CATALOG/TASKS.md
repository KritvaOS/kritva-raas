# B-INC-003 — PROJECTS-PLATFORM-CATALOG Task Register

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-003 PROJECTS-PLATFORM-CATALOG Task Register |
| Path | `planning/backend/increments/B-INC-003-PROJECTS-PLATFORM-CATALOG/TASKS.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; B-M03 PLATFORM |

## Related documents

- [Milestone](MILESTONE.md)
- [Acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Review checklist](REVIEW_CHECKLIST.md)
- [Backend implementation plan](../../BACKEND_IMPLEMENTATION_PLAN.md)
- [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Backend test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Backend security gate](../../BACKEND_SECURITY_GATE.md)
- [Parent B-M01 tasks](../../../../docs/backend/milestones/B-M01-CONTROL-PLANE/TASKS.md)

## 1. Task rules

- Existing B-M01 task IDs, titles, estimates, owners, and dependencies are preserved.
- Shared tasks `KR-BE-1-043`, `KR-BE-1-044`, and `KR-BE-1-045` retain their original task identities and whole-task estimates. Their B-INC-003 slices are not additional estimates.
- `ACCEPTANCE_CRITERIA.md` is the single source of truth for AC-to-BAC/BTS/SEC-GATE traceability.
- Each task's `Linked tests` must equal the exact union of the test traces of its linked ACs.
- Each task's `Linked security gates` must equal the exact union of the security-gate traces of its linked ACs.
- Do not add a test or security-gate ID unless it is present in the linked AC traces.
- If a required trace is missing from the ACs, update and review the AC mapping first, then recalculate the task union.
- The B-M03 PLATFORM ownership boundary applies to `KR-BE-1-027` through `KR-BE-1-031`.
- Every task remains Proposed until implementation, verification, and evidence review establish its actual status.

## 2. Tasks

### KR-BE-1-022 — Define Project domain model

- **Description:** Define the project domain model, including project identity, ownership relationship, and approved metadata, in accordance with the established control-plane architecture.
- **Inputs:** Approved control-plane architecture; organization and tenant-context contracts from the dependency tasks; approved project metadata boundary.
- **Outputs/files:** Project domain model and associated model tests or contract documentation, in the repository's established source layout.
- **Dependencies:** KR-BE-1-017, KR-BE-1-021.
- **Owner role:** Backend.
- **Estimate:** 2d (existing B-M01 estimate).
- **Definition of done:** Project identity and ownership are represented explicitly; permitted metadata is consistent with the approved contract; the model does not introduce source-file, source-archive, credential, or private-key fields that violate the project metadata boundary; relevant tests and review evidence are available.
- **Linked AC:** B-INC-003-AC-01.
- **Linked tests:** BTS-023, BTS-025.
- **Linked security gates:** Not applicable.

### KR-BE-1-023 — Implement ProjectRepository

- **Description:** Implement project persistence and retrieval through the approved repository boundary.
- **Inputs:** Approved project domain model; database/schema contract; ownership and tenant-context contracts.
- **Outputs/files:** Project repository implementation, relevant query/persistence tests, and associated schema or migration changes if required by the approved design.
- **Dependencies:** KR-BE-1-022.
- **Owner role:** Backend/Database.
- **Estimate:** 2.5d (existing B-M01 estimate).
- **Definition of done:** Repository operations preserve project identity, ownership, and metadata integrity; queries use the approved ownership and tenant context; relevant repository and database tests pass; no repository operation grants access solely on the basis of an untrusted project identifier.
- **Linked AC:** B-INC-003-AC-02.
- **Linked tests:** BTS-023, BTS-025.
- **Linked security gates:** Not applicable.

### KR-BE-1-024 — Implement ProjectService

- **Description:** Implement project service operations over the project repository and established organization/tenant context.
- **Inputs:** ProjectRepository contract; project domain model; approved ownership and access semantics.
- **Outputs/files:** Project service implementation and unit/service tests in the repository's established source layout.
- **Dependencies:** KR-BE-1-023.
- **Owner role:** Backend.
- **Estimate:** 2.5d (existing B-M01 estimate).
- **Definition of done:** Service operations preserve project ownership and access semantics; service behavior does not bypass the approved authorization boundary; permitted and denied paths are tested; denied mutations are checked for unintended persisted-state changes where applicable.
- **Linked AC:** B-INC-003-AC-03.
- **Linked tests:** BTS-023.
- **Linked security gates:** Not applicable.

### KR-BE-1-025 — Implement project APIs

- **Description:** Implement project endpoints according to the approved API contract and metadata-only request/response boundary.
- **Inputs:** ProjectService contract; approved API schemas; request-validation and response-classification rules; metadata-only privacy requirements.
- **Outputs/files:** Project API routes/handlers, request and response schemas, validation logic, API contract tests, and relevant integration tests.
- **Dependencies:** KR-BE-1-024.
- **Owner role:** Backend.
- **Estimate:** 2.5d (existing B-M01 estimate).
- **Definition of done:** Project APIs follow the approved contract; only approved project metadata is accepted; source files, source archives, credentials, authentication secrets, and private signing keys are not accepted or stored through project metadata APIs; request validation, response classification, and sanitized error/log behavior are tested; applicable integration evidence is recorded.
- **Linked AC:** B-INC-003-AC-04, B-INC-003-AC-12.
- **Linked tests:** BTS-025, BTS-026, BTS-028, BTS-032.
- **Linked security gates:** SEC-GATE-009, SEC-GATE-012.

### KR-BE-1-026 — Implement project authorization

- **Description:** Enforce project ownership, membership, permission, and tenant-context rules on protected project operations.
- **Inputs:** Project API contract; approved authorization policy; organization/membership and tenant-context facilities; applicable database tenant-enforcement contract.
- **Outputs/files:** Project authorization implementation, policy integration, negative-path tests, cross-tenant tests, and relevant security evidence.
- **Dependencies:** KR-BE-1-025.
- **Owner role:** Security/Backend.
- **Estimate:** 2d (existing B-M01 estimate).
- **Definition of done:** Protected project operations enforce the approved access policy; unauthorized and cross-tenant operations are denied; tests cover unauthorized and cross-tenant behavior; denied mutations do not produce unintended persisted-state changes; required database enforcement is tested against the applicable database environment; applicable security-gate evidence is reviewed.
- **Linked AC:** B-INC-003-AC-05, B-INC-003-AC-06.
- **Linked tests:** BTS-020, BTS-021, BTS-022, BTS-023.
- **Linked security gates:** SEC-GATE-013.

### KR-BE-1-027 — Define platform catalog model

- **Description:** Define the platform-catalog model and its relationship to the authoritative platform contract.
- **Inputs:** Existing platform model and contract; B-M03 PLATFORM ownership/lifecycle definition; applicable architecture decisions.
- **Outputs/files:** Platform-catalog model and documentation identifying the authoritative ownership and lifecycle boundary.
- **Dependencies:** KR-BE-1-002.
- **Owner role:** Architect/Backend.
- **Estimate:** 2d (existing B-M01 estimate).
- **Definition of done:** The model is reviewed against B-M03 PLATFORM; the responsible platform/architecture owner confirms the ownership boundary; the model does not create a competing authoritative catalog or silently redefine platform ownership, identity, or lifecycle.
- **Linked AC:** B-INC-003-AC-07.
- **Linked tests:** BTS-027.
- **Linked security gates:** Not applicable.

### KR-BE-1-028 — Implement PlatformRepository

- **Description:** Implement platform-catalog persistence in coordination with the approved platform-catalog model and B-M03 PLATFORM ownership boundary.
- **Inputs:** Reviewed platform-catalog model; approved catalog contract; applicable database/schema contract.
- **Outputs/files:** PlatformRepository implementation, repository tests, and relevant schema or migration changes if required.
- **Dependencies:** KR-BE-1-027.
- **Owner role:** Backend/Database.
- **Estimate:** 2.5d (existing B-M01 estimate).
- **Definition of done:** Repository behavior conforms to the approved catalog contract; persistence does not redefine catalog ownership or lifecycle; repository and applicable database tests pass; contract alignment is reviewed.
- **Linked AC:** B-INC-003-AC-08.
- **Linked tests:** BTS-027.
- **Linked security gates:** Not applicable.

### KR-BE-1-029 — Implement platform catalog service

- **Description:** Implement platform-catalog service operations using the approved repository and catalog contract.
- **Inputs:** PlatformRepository contract; approved catalog domain model; validation and response semantics.
- **Outputs/files:** Platform-catalog service implementation, service tests, and relevant contract documentation.
- **Dependencies:** KR-BE-1-028.
- **Owner role:** Backend.
- **Estimate:** 2.5d (existing B-M01 estimate).
- **Definition of done:** Service behavior follows the approved catalog contract; validation and response semantics are covered by tests; service behavior does not redefine authoritative platform ownership or lifecycle; review evidence is recorded.
- **Linked AC:** B-INC-003-AC-09.
- **Linked tests:** BTS-027, BTS-028.
- **Linked security gates:** Not applicable.

### KR-BE-1-030 — Implement platform catalog APIs

- **Description:** Expose the approved platform-catalog service through the required API contract.
- **Inputs:** Platform-catalog service contract; approved API schemas; validation and response-classification rules; applicable integration requirements.
- **Outputs/files:** Platform-catalog API routes/handlers, request and response schemas, validation logic, API contract tests, and integration tests.
- **Dependencies:** KR-BE-1-029.
- **Owner role:** Backend.
- **Estimate:** 2.5d (existing B-M01 estimate).
- **Definition of done:** Catalog APIs follow the approved contract; request validation and response behavior are tested; applicable integration tests pass and are evidenced; protected administration operations remain subject to the separate authorization implementation in KR-BE-1-031.
- **Linked AC:** B-INC-003-AC-10.
- **Linked tests:** BTS-027, BTS-028, BTS-032.
- **Linked security gates:** Not applicable.

### KR-BE-1-031 — Implement platform administration authorization

- **Description:** Enforce the approved authorization policy for protected platform-administration operations.
- **Inputs:** Platform-catalog API contract; approved administrative permission policy; platform ownership boundary defined by B-M03 PLATFORM.
- **Outputs/files:** Platform-administration authorization implementation, policy integration, positive/negative authorization tests, and security-review evidence.
- **Dependencies:** KR-BE-1-030.
- **Owner role:** Security.
- **Estimate:** 2d (existing B-M01 estimate).
- **Definition of done:** Protected administrative operations require the approved authorization; authentication alone does not grant administration privileges; unauthorized requests are denied; denied mutations do not cause unintended state changes; applicable authorization tests and security-gate review evidence are recorded.
- **Linked AC:** B-INC-003-AC-11.
- **Linked tests:** BTS-024.
- **Linked security gates:** SEC-GATE-013.

### KR-BE-1-043 — Add API contract tests (B-INC-003 slice)

- **Description:** Implement the B-INC-003 slice of the shared API contract test task for project and platform-catalog APIs.
- **Inputs:** Project API contract; platform-catalog API contract; metadata-only privacy requirements; request/response classification rules; implemented API paths.
- **Outputs/files:** Project and catalog contract-test cases, validation/privacy test cases, integration test results, and a shared-task slice record.
- **Dependencies:** KR-BE-1-006 through KR-BE-1-030, per the B-M01 register.
- **Owner role:** QA.
- **Estimate:** 3d (existing B-M01 estimate; shared-task estimate, not an additional B-INC-003 estimate).
- **Definition of done:** The B-INC-003 slice covers the linked project and platform-catalog contract criteria; metadata-only and validation behavior is exercised; applicable integration behavior is tested; test results identify the revision, actual outcomes, failures, and blockers; obligations belonging to other increments remain separately tracked.
- **Linked AC:** B-INC-003-AC-04, B-INC-003-AC-10, B-INC-003-AC-12, B-INC-003-AC-13, B-INC-003-AC-16.
- **Linked tests:** BTS-025, BTS-026, BTS-027, BTS-028, BTS-032, BTS-036.
- **Linked security gates:** SEC-GATE-009, SEC-GATE-012, SEC-GATE-013.

### KR-BE-1-044 — Add authorization tests (B-INC-003 slice)

- **Description:** Implement the B-INC-003 slice of the shared authorization test task for project and platform-administration operations.
- **Inputs:** Approved project ownership/permission policy; platform-administration authorization policy; implemented protected operations; applicable security-review requirements.
- **Outputs/files:** Project and platform-administration authorization test cases, authorization matrix, actual results, and a shared-task slice record.
- **Dependencies:** KR-BE-1-020 through KR-BE-1-026, per the B-M01 register.
- **Owner role:** Security/QA.
- **Estimate:** 3d (existing B-M01 estimate; shared-task estimate, not an additional B-INC-003 estimate).
- **Definition of done:** Allowed and denied project and platform-administration operations are tested; linked authorization and evidence criteria have reviewed results; applicable security gates are executed and reviewed; other increment obligations remain separately tracked and are not marked complete by this slice.
- **Linked AC:** B-INC-003-AC-05, B-INC-003-AC-11, B-INC-003-AC-14, B-INC-003-AC-17.
- **Linked tests:** BTS-023, BTS-024, BTS-036.
- **Linked security gates:** SEC-GATE-012, SEC-GATE-013.

### KR-BE-1-045 — Add tenant-isolation tests (B-INC-003 slice)

- **Description:** Implement the B-INC-003 slice of the shared tenant-isolation test task for project operations.
- **Inputs:** Project authorization implementation; tenant-context contract; applicable database tenant-enforcement contract; synthetic test principals and tenants.
- **Outputs/files:** Project cross-tenant test cases, tenant-context and database-enforcement results, denied-mutation state assertions, and a shared-task slice record.
- **Dependencies:** KR-BE-1-021, KR-BE-1-026.
- **Owner role:** Security/QA.
- **Estimate:** 2.5d (existing B-M01 estimate; shared-task estimate, not an additional B-INC-003 estimate).
- **Definition of done:** Cross-tenant project access and tenant-context integrity are tested; required database enforcement is verified against the applicable database environment; denied mutations have persisted-state assertions; evidence identifies the tested revision and actual scope; other increment obligations remain separately tracked.
- **Linked AC:** B-INC-003-AC-06, B-INC-003-AC-15, B-INC-003-AC-17.
- **Linked tests:** BTS-020, BTS-021, BTS-022, BTS-036.
- **Linked security gates:** SEC-GATE-012, SEC-GATE-013.

## 3. Task status rules

Use the repository's established task-status vocabulary. A task must not be marked complete until its linked acceptance criteria have recorded outcomes, the exact linked test and security-gate unions have the required execution/review evidence, and the required evidence has been reviewed.

A task may be implemented while remaining unaccepted. Record implementation status separately from acceptance where the repository workflow supports that distinction.

## 4. Traceability validation

Before merging task changes:

1. Read the task's linked AC IDs.
2. Compute the union of their test traces from `ACCEPTANCE_CRITERIA.md`.
3. Compare the union exactly with `Linked tests`.
4. Compute the union of their security-gate traces from `ACCEPTANCE_CRITERIA.md`.
5. Compare the union exactly with `Linked security gates`.
6. Treat `Not applicable` as valid only when no linked AC contributes a concrete security-gate ID.
7. Fail validation if any ID is missing or extra.
8. Preserve the canonical meanings of all BAC, BTS, and SEC-GATE identifiers.

## 5. Status

**Status: Proposed.**

This task register defines planned work and traceability. It does not assert that tasks have been implemented, tested, or accepted.
