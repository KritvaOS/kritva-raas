# B-INC-003 — PROJECTS-PLATFORM-CATALOG

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-003 PROJECTS-PLATFORM-CATALOG Milestone |
| Path | `docs/planning/backend/increments/B-INC-003-PROJECTS-PLATFORM-CATALOG/MILESTONE.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; B-M03 PLATFORM |

## Related documents

- [Tasks](TASKS.md)
- [Acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Review checklist](REVIEW_CHECKLIST.md)
- [Backend implementation plan](../../BACKEND_IMPLEMENTATION_PLAN.md)
- [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Backend test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Backend security gate](../../BACKEND_SECURITY_GATE.md)
- [Parent B-M01 milestone](../../../../backend/milestones/B-M01-CONTROL-PLANE/MILESTONE.md)
- [Parent B-M01 tasks](../../../../backend/milestones/B-M01-CONTROL-PLANE/TASKS.md)

## 1. Purpose

B-INC-003 implements project ownership and metadata operations, project authorization, the platform-catalog integration boundary, platform-catalog APIs, and platform-administration authorization.

It is part of **B-M01 CONTROL PLANE**. The platform-catalog domain is subject to the ownership and contract boundary defined by **B-M03 PLATFORM**. This increment must not redefine platform ownership or create a competing platform catalog.

## 2. Objective

Deliver a coherent and testable project and platform-catalog control-plane slice that:

- Models project identity, ownership, and permitted metadata.
- Persists and retrieves projects through the approved repository boundary.
- Enforces project ownership, membership, authorization, and tenant isolation.
- Exposes project APIs that accept metadata only.
- Coordinates platform-catalog persistence and service behavior with B-M03 PLATFORM.
- Exposes platform-catalog APIs using the approved catalog contract.
- Enforces platform-administration authorization.
- Includes the applicable API contract, authorization, and tenant-isolation test slices.
- Retains reviewable test and security evidence without exposing secrets or source code.

## 3. Canonical placement and ownership

| Item | Decision |
|---|---|
| Increment | B-INC-003 PROJECTS-PLATFORM-CATALOG |
| Parent milestone | B-M01 CONTROL PLANE |
| Platform-catalog ownership boundary | B-M03 PLATFORM |
| Canonical phase | P3 CONTROL PLANE |
| Project domain and APIs | B-INC-003, within the approved control-plane contract |
| Platform-catalog ownership and definition | Governed by B-M03 PLATFORM |
| Platform-catalog repository and service integration | B-INC-003, coordinated with B-M03 PLATFORM |
| Platform-administration authorization | B-INC-003, subject to the B-M03 PLATFORM ownership contract |

B-INC-003 may implement the persistence and API integration needed by the control plane, but it must not redefine the platform catalog's authoritative ownership, lifecycle, or contract. If the B-M03 contract is unavailable or ambiguous, record a dependency/blocker and resolve it with the responsible owner before implementing conflicting behavior.

## 4. Scope

### 4.1 Project domain and access

- `KR-BE-1-022` — Define Project domain model.
- `KR-BE-1-023` — Implement ProjectRepository.
- `KR-BE-1-024` — Implement ProjectService.
- `KR-BE-1-025` — Implement project APIs.
- `KR-BE-1-026` — Implement project authorization.

### 4.2 Platform catalog and administration

- `KR-BE-1-027` — Define platform catalog model.
- `KR-BE-1-028` — Implement PlatformRepository.
- `KR-BE-1-029` — Implement platform catalog service.
- `KR-BE-1-030` — Implement platform catalog APIs.
- `KR-BE-1-031` — Implement platform administration authorization.

The model and persistence implementation must confirm and preserve the B-M03 PLATFORM ownership boundary. Platform API contracts and validation must be covered by automated tests.

### 4.3 Shared verification task slices

- `KR-BE-1-043` — B-INC-003 project and platform-catalog API contract test slice.
- `KR-BE-1-044` — B-INC-003 project and platform-administration authorization test slice.
- `KR-BE-1-045` — B-INC-003 project tenant-isolation test slice.

The original shared-task IDs and estimates remain unchanged. These slices do not close work assigned to other increments.

## 5. Explicit project metadata boundary

Project APIs may accept and return only approved project metadata and other fields explicitly permitted by the approved API contract.

Project APIs must not accept, persist, or implicitly synchronize the following as part of project creation or metadata updates:

- Source files.
- Source archives or source-code bundles.
- Credentials, passwords, API tokens, or authentication secrets.
- Private signing keys or equivalent key material.

This boundary must be reflected in request schemas, validation, response schemas, error handling, logs, and automated contract/privacy tests. Reject unsupported payloads according to the approved API contract. Do not silently accept or store prohibited content.

The metadata-only rule does not authorize a future artifact-upload workflow. Artifact and execution-package transfer belong to their separately defined product contracts.

## 6. Architecture and security constraints

Implementation must:

- Preserve the established repository/service/API separation.
- Enforce project ownership and authorization on protected project operations.
- Apply default-deny behavior where permission or ownership cannot be established.
- Derive tenant context from trusted application state rather than accepting an unverified client override.
- Prevent cross-tenant project access and mutation.
- Verify the applicable database tenant-enforcement contract.
- Preserve the B-M03 PLATFORM boundary for platform-catalog ownership and lifecycle.
- Apply platform-administration authorization to every protected administration operation.
- Validate requests and responses against the approved API contracts.
- Avoid leaking sensitive values through errors, logs, fixtures, and evidence.
- Preserve existing secret-scanning and security-gate controls.
- Avoid inventing canonical BAC, BTS, or SEC-GATE identifiers.

## 7. Dependencies and readiness

The supplied B-M01 task dependencies are authoritative:

| Task | Dependencies | Readiness condition |
|---|---|---|
| KR-BE-1-022 | KR-BE-1-017, KR-BE-1-021 | Organization service and tenant-context foundation available |
| KR-BE-1-023 | KR-BE-1-022 | Project domain model approved |
| KR-BE-1-024 | KR-BE-1-023 | Project repository contract available |
| KR-BE-1-025 | KR-BE-1-024 | Project service contract available |
| KR-BE-1-026 | KR-BE-1-025 | Project API contract and protected operations identified |
| KR-BE-1-027 | KR-BE-1-002 | B-M03 PLATFORM ownership and contract confirmed |
| KR-BE-1-028 | KR-BE-1-027 | Platform-catalog model and ownership boundary approved |
| KR-BE-1-029 | KR-BE-1-028 | Platform repository contract available |
| KR-BE-1-030 | KR-BE-1-029 | Catalog service contract and validation requirements approved |
| KR-BE-1-031 | KR-BE-1-030 | Platform-administration operations and authorization contract identified |
| KR-BE-1-043 | KR-BE-1-006 through KR-BE-1-030, per the B-M01 register | Applicable project and catalog API contracts implemented |
| KR-BE-1-044 | KR-BE-1-020 through KR-BE-1-026, per the B-M01 register | Applicable project and platform-administration authorization paths available |
| KR-BE-1-045 | KR-BE-1-021, KR-BE-1-026 | Tenant-context foundation and project authorization available |

Do not silently alter dependency IDs or reinterpret the dependency ranges in the authoritative B-M01 register. Record any sequencing issue and obtain approval before changing the register.

## 8. Deliverables

- Project domain model and persistence implementation.
- Project service and metadata-only API contract.
- Project authorization and tenant-isolation enforcement.
- Platform-catalog model, persistence, service, and API integration consistent with B-M03 PLATFORM.
- Platform-administration authorization.
- Project and platform-catalog API contract test slice.
- Project and platform-administration authorization test slice.
- Project tenant-isolation test slice.
- Completed acceptance records and traceable evidence.
- Reviewed architecture, security, and documentation changes.
- Updated task and changelog records reflecting actual implementation status.

## 9. Review requirements

The increment requires:

- Backend architecture review.
- Explicit review of the B-M03 PLATFORM ownership boundary.
- API contract and metadata-privacy review.
- Project authorization review.
- Platform-administration authorization review.
- Tenant-isolation and database-enforcement review.
- Automated test review.
- Security and evidence-safety review.
- Acceptance traceability validation.

A review marked complete must identify the reviewer, revision, evidence, findings, and disposition.

## 10. Exit criteria

B-INC-003 may be proposed for closure only when:

1. Every applicable acceptance criterion has a recorded result and evidence reference.
2. Project ownership and protected project operations are enforced.
3. Project APIs enforce the metadata-only boundary.
4. Platform-catalog implementation conforms to the approved B-M03 PLATFORM ownership and contract.
5. Platform-catalog API validation and platform-administration authorization are verified.
6. Cross-tenant project operations are denied, with persisted-state assertions for denied mutations.
7. Required database tenant enforcement has been verified against the approved contract.
8. The B-INC-003 slices of `KR-BE-1-043`, `KR-BE-1-044`, and `KR-BE-1-045` have evidence without incorrectly closing their remaining obligations.
9. Required tests and applicable security gates have actual recorded results.
10. Mandatory findings are resolved and reviewed.
11. Documentation and evidence are complete and secret-safe.
12. The acceptance authority approves closure.

A code commit or a green unit-test summary alone does not satisfy these conditions.

## 11. Deferred work and non-goals

- B-INC-003 does not own the authoritative platform-catalog definition outside the boundary agreed with B-M03 PLATFORM.
- Project APIs do not become source-code upload or artifact-upload APIs.
- Transaction, idempotency, and audit implementation remains assigned to B-INC-004 unless an approved program change explicitly reallocates it.
- `KR-CA-022` through `KR-CA-026` remain deferred and reference-only.
- No task is considered accepted solely because its implementation or test code has been committed.

## 12. Status

**Status: Proposed.**

This milestone defines the planned scope and exit conditions. It does not claim that implementation, verification, security review, or acceptance has occurred.
