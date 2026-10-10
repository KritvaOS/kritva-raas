# B-INC-002 — IDENTITY-ORGANIZATION Tasks

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-002 IDENTITY-ORGANIZATION Tasks |
| Path | `docs/planning/backend/increments/B-INC-002-IDENTITY-ORGANIZATION/TASKS.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; DB-M02 CORE DATA where applicable |

## Related documents

- [Increment milestone](MILESTONE.md)
- [Increment acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Review checklist](REVIEW_CHECKLIST.md)
- [Test plan](TEST_PLAN.md)
- [Security review](SECURITY_REVIEW.md)
- [Git commit procedure](GIT_COMMIT_STEP.md)
- [Backend implementation plan](../../BACKEND_IMPLEMENTATION_PLAN.md)
- [Backend task register](../../BACKEND_TASK_REGISTER.md)
- [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Backend test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Backend security gate](../../BACKEND_SECURITY_GATE.md)
- [Parent B-M01 tasks](../../../../backend/milestones/B-M01-CONTROL-PLANE/TASKS.md)
- [Parent B-M01 milestone](../../../../backend/milestones/B-M01-CONTROL-PLANE/MILESTONE.md)

## 1. Purpose and rules

This file defines the existing B-M01 implementation tasks assigned to B-INC-002 IDENTITY-ORGANIZATION and the specific slices of the existing authorization and tenant-isolation test tasks assigned to this increment.

It preserves the task identifiers, titles, and engineering-day estimates from `docs/backend/milestones/B-M01-CONTROL-PLANE/TASKS.md`. The shared test tasks retain their original IDs and whole-task estimates. Their increment slices are not new tasks and must not be counted as additional full-task effort.

`ACCEPTANCE_CRITERIA.md` is the single source of traceability for this increment. Each task's `Linked AC` values must point to criteria in that file. Its `Linked tests` and `Linked security gates` must be the exact union of the corresponding traces of every linked acceptance criterion. Do not independently add test or gate IDs in this file.

A security-gate trace of `Not applicable` means that no defined canonical `SEC-GATE-*` criterion applies to the linked increment acceptance criteria. It does not waive the backend-wide security invariants or the applicable BAC acceptance requirements.

Task status is Proposed until actual work is authorized. Do not infer completion from a branch, commit, implementation artifact, or partial test result.

## 2. Task status values

Use the status vocabulary in `BACKEND_TASK_REGISTER.md`:

- Proposed
- Ready
- In Progress
- Blocked
- In Review
- Accepted
- Deferred
- Rejected

Every task must have a recorded status supported by evidence. A task with a failed mandatory acceptance condition or unresolved dependency must not be marked Accepted.

## 3. Existing B-M01 implementation tasks

### KR-BE-1-010 — Define identity domain model

- **Description:** Define the backend identity and principal model used by the approved authentication boundary and identity-related services.
- **Inputs:** Approved backend architecture; authentication contract; existing application and module conventions.
- **Outputs/files:** Identity/principal domain types, documented semantics, and relevant unit tests.
- **Dependencies:** `KR-BE-1-002`; approved identity and authentication contract.
- **Owner role:** Architecture Owner and Backend Technical Lead.
- **Estimate:** 2d (existing B-M01 estimate).
- **Definition of done:** Principal and identity attributes have explicit semantics; domain code is not coupled unnecessarily to a provider-specific token representation; the model is reviewed against the approved contract.
- **Linked AC:** B-INC-002-AC-01.
- **Linked tests:** BTS-017.
- **Linked security gates:** Not applicable.

### KR-BE-1-011 — Implement UserRepository

- **Description:** Implement user persistence access against the approved DB-M01 schema and repository conventions.
- **Inputs:** Identity domain model; approved user schema; repository and database access conventions.
- **Outputs/files:** UserRepository implementation and tests for lookup, missing records, and persistence error behavior.
- **Dependencies:** `KR-BE-1-010`; approved persistence contract and database test environment.
- **Owner role:** Backend Technical Lead and Database Technical Lead.
- **Estimate:** 2d (existing B-M01 estimate).
- **Definition of done:** Repository queries follow the approved schema; missing users and database errors have defined behavior; tests use controlled test data; no credentials are embedded in source or fixtures.
- **Linked AC:** B-INC-002-AC-02.
- **Linked tests:** BTS-019.
- **Linked security gates:** Not applicable.

### KR-BE-1-012 — Implement authentication adapter boundary

- **Description:** Implement the provider-neutral adapter boundary that translates the approved authentication result into the application's principal representation.
- **Inputs:** Identity domain model; approved authentication contract; runtime configuration and error conventions.
- **Outputs/files:** Authentication adapter interface and implementation boundary, configuration integration where required, and positive/negative tests.
- **Dependencies:** `KR-BE-1-010`; approved authentication contract and provider-specific decision where needed.
- **Owner role:** Backend Technical Lead with Security Owner review.
- **Estimate:** 2.5d (existing B-M01 estimate).
- **Definition of done:** The adapter has explicit success and failure behavior; untrusted or invalid authentication input cannot create an authenticated principal; provider-specific implementation details do not leak into unrelated domain services; test credentials are synthetic.
- **Linked AC:** B-INC-002-AC-03.
- **Linked tests:** BTS-017.
- **Linked security gates:** Not applicable.

### KR-BE-1-013 — Implement current-user endpoint

- **Description:** Implement the current-user endpoint using the approved authenticated principal and REST API v1 conventions.
- **Inputs:** Authentication adapter; identity model; approved API and error contracts.
- **Outputs/files:** Current-user route/handler, response schema, and contract tests.
- **Dependencies:** `KR-BE-1-012`; B-INC-001 API foundation.
- **Owner role:** Backend Technical Lead.
- **Estimate:** 1.5d (existing B-M01 estimate).
- **Definition of done:** Authenticated requests return only the fields approved by the response contract; missing or invalid authentication is rejected; responses and errors do not expose tokens, credentials, or prohibited internal data.
- **Linked AC:** B-INC-002-AC-04.
- **Linked tests:** BTS-017, BTS-032.
- **Linked security gates:** Not applicable.

### KR-BE-1-014 — Define Organization model

- **Description:** Define the organization domain model and its invariants in alignment with the approved database and backend contracts.
- **Inputs:** Backend architecture; DB-M01 organization schema; identity and principal model.
- **Outputs/files:** Organization domain types, invariant documentation, and relevant tests.
- **Dependencies:** `KR-BE-1-010`; approved DB-M01 organization contract.
- **Owner role:** Backend Technical Lead.
- **Estimate:** 1.5d (existing B-M01 estimate).
- **Definition of done:** Organization identity, lifecycle, and ownership semantics are explicit; the model agrees with the approved schema; it does not introduce project or platform-catalog responsibilities into this increment.
- **Linked AC:** B-INC-002-AC-05.
- **Linked tests:** BTS-019.
- **Linked security gates:** Not applicable.

### KR-BE-1-015 — Implement OrganizationRepository

- **Description:** Implement organization persistence operations using the approved DB-M01 schema and repository conventions.
- **Inputs:** Organization domain model; approved schema and migration contract; database access conventions.
- **Outputs/files:** OrganizationRepository implementation and persistence tests.
- **Dependencies:** `KR-BE-1-014`; approved database schema and test environment.
- **Owner role:** Backend Technical Lead and Database Technical Lead.
- **Estimate:** 2d (existing B-M01 estimate).
- **Definition of done:** Repository behavior conforms to the approved schema; missing records and database failures are handled consistently; organization ownership constraints are not bypassed; tests run against the applicable database environment.
- **Linked AC:** B-INC-002-AC-06.
- **Linked tests:** BTS-019.
- **Linked security gates:** Not applicable.

### KR-BE-1-016 — Implement MembershipRepository

- **Description:** Implement membership persistence operations and enforce the approved membership lookup and integrity contract.
- **Inputs:** Organization and identity models; approved membership schema; database access conventions.
- **Outputs/files:** MembershipRepository implementation and tests for membership lookup and relevant integrity behavior.
- **Dependencies:** `KR-BE-1-014`; approved membership schema and constraints.
- **Owner role:** Backend Technical Lead and Database Technical Lead.
- **Estimate:** 2d (existing B-M01 estimate).
- **Definition of done:** Membership queries use the approved relationship and constraints; lookup behavior distinguishes absent membership from infrastructure failure; organization membership cannot be inferred from untrusted request data; database constraints are not replaced by assumptions in application code.
- **Linked AC:** B-INC-002-AC-07.
- **Linked tests:** BTS-019.
- **Linked security gates:** Not applicable.

### KR-BE-1-017 — Implement OrganizationService

- **Description:** Implement organization use cases using the organization and membership repositories, with explicit membership and authorization behavior.
- **Inputs:** Organization and membership domain models; repository contracts; approved authorization semantics.
- **Outputs/files:** OrganizationService and service-level tests.
- **Dependencies:** `KR-BE-1-015`, `KR-BE-1-016`; approved authorization contract.
- **Owner role:** Backend Technical Lead.
- **Estimate:** 2d (existing B-M01 estimate).
- **Definition of done:** Service operations apply the approved membership and permission rules; failure paths are deterministic; an organization ID supplied by a caller is not treated as proof of access; unauthorized operations do not mutate state.
- **Linked AC:** B-INC-002-AC-08.
- **Linked tests:** BTS-018, BTS-019.
- **Linked security gates:** Not applicable.

### KR-BE-1-018 — Implement organization APIs

- **Description:** Implement organization API operations according to the approved REST API v1 contract and authorization rules.
- **Inputs:** OrganizationService; API v1 foundation; approved request, response, validation, and error conventions.
- **Outputs/files:** Organization routes/handlers, request/response schemas, and contract/integration tests.
- **Dependencies:** `KR-BE-1-017`; approved API contract and authorization behavior.
- **Owner role:** Backend Technical Lead.
- **Estimate:** 2d (existing B-M01 estimate).
- **Definition of done:** Routes implement only approved organization operations; validation and error behavior match the contract; protected operations enforce authorization; cross-organization requests are rejected; responses expose only approved organization and membership fields.
- **Linked AC:** B-INC-002-AC-09.
- **Linked tests:** BTS-018, BTS-019, BTS-032.
- **Linked security gates:** Not applicable.

### KR-BE-1-019 — Define role/permission model

- **Description:** Define roles, permissions, and the mapping used by authorization decisions.
- **Inputs:** Approved backend architecture; organization membership contract; security requirements and protected-operation inventory.
- **Outputs/files:** Role/permission definitions, policy mapping, and documented authorization semantics.
- **Dependencies:** `KR-BE-1-002`; reviewed role and permission requirements.
- **Owner role:** Security Owner and Architecture Owner.
- **Estimate:** 2d (existing B-M01 estimate).
- **Definition of done:** Permission names and meanings are explicit; the mapping of roles to permissions is reviewed; unknown or missing permissions do not imply access; the model is compatible with organization membership and tenant context.
- **Linked AC:** B-INC-002-AC-10.
- **Linked tests:** BTS-018.
- **Linked security gates:** Not applicable.

### KR-BE-1-020 — Implement authorization policy layer

- **Description:** Implement the application authorization layer and require explicit policy decisions for protected operations.
- **Inputs:** Approved role/permission model; authentication principal; organization membership and tenant-context contracts.
- **Outputs/files:** Authorization policy interfaces/implementation, integration points, and positive/negative tests.
- **Dependencies:** `KR-BE-1-019`; approved principal and membership behavior.
- **Owner role:** Security Owner and Backend Technical Lead.
- **Estimate:** 3d (existing B-M01 estimate).
- **Definition of done:** Protected operations default to deny when permission is absent, unknown, or not granted; authorization checks are applied at the required application boundaries; tests cover permitted and denied cases; authorization failures do not leak sensitive data.
- **Linked AC:** B-INC-002-AC-11.
- **Linked tests:** BTS-018.
- **Linked security gates:** Not applicable.

### KR-BE-1-021 — Implement tenant context enforcement

- **Description:** Derive and enforce the authorized tenant context across request, service, and persistence paths, coordinating required database enforcement with DB-M01.
- **Inputs:** Authentication principal; organization and membership contracts; authorization policy layer; approved database tenant-isolation requirements.
- **Outputs/files:** Tenant-context implementation, service/repository integration, negative tests, and database-enforcement evidence references.
- **Dependencies:** `KR-BE-1-020`; approved tenant-context contract and required DB-M01 controls.
- **Owner role:** Backend Technical Lead, Security Owner, and Database Technical Lead.
- **Estimate:** 2d (existing B-M01 estimate).
- **Definition of done:** Tenant context is derived from trusted identity/authorization state; untrusted request data cannot override it; cross-tenant access is rejected; required database enforcement is tested against the approved contract rather than inferred from mocked application behavior.
- **Linked AC:** B-INC-002-AC-12, B-INC-002-AC-13.
- **Linked tests:** BTS-020, BTS-021, BTS-022.
- **Linked security gates:** Not applicable.

## 4. Shared authorization test slice

### KR-BE-1-044 — Add authorization tests (B-INC-002 identity and organization slice)

- **Description:** Implement the identity and organization authorization portion of the existing B-M01 authorization-test task. The project and platform-administration portions remain assigned to B-INC-003.
- **Inputs:** Approved authentication and authorization contracts; role/permission model; organization and membership APIs/services.
- **Outputs/files:** Automated positive and negative authorization tests for identity and organization operations, with results tied to the tested revision.
- **Dependencies:** `KR-BE-1-012`, `KR-BE-1-017`, `KR-BE-1-018`, `KR-BE-1-019`, `KR-BE-1-020`; testable implementation paths.
- **Owner role:** Security Owner and QA Owner.
- **Estimate:** 3d (existing whole-task B-M01 estimate; shared across B-INC-002 and B-INC-003, not additive per slice).
- **Definition of done:** Tests cover allowed operations, missing permissions, invalid authentication where applicable, unauthorized organization access, and membership-related denial. The B-INC-002 slice is recorded separately from the remaining B-INC-003 slice without changing the task ID.
- **Linked AC:** B-INC-002-AC-11, B-INC-002-AC-14, B-INC-002-AC-16.
- **Linked tests:** BTS-018, BTS-019, BTS-032, BTS-036.
- **Linked security gates:** Not applicable.

## 5. Shared tenant-isolation test slice

### KR-BE-1-045 — Add tenant-isolation tests (B-INC-002 identity and organization slice)

- **Description:** Implement the identity and organization tenant-isolation portion of the existing B-M01 tenant-isolation test task. Project-specific isolation remains assigned to B-INC-003.
- **Inputs:** Approved tenant-context contract; organization/membership persistence model; authorization policy layer; DB-M01 tenant-enforcement requirements.
- **Outputs/files:** Automated application and database tenant-isolation tests for identity and organization operations, with safe evidence and explicit test scope.
- **Dependencies:** `KR-BE-1-021`; applicable database tenant-enforcement capability and controlled test environment.
- **Owner role:** Security Owner, Database Technical Lead, and QA Owner.
- **Estimate:** 2.5d (existing whole-task B-M01 estimate; shared across B-INC-002 and B-INC-003, not additive per slice).
- **Definition of done:** Tests attempt representative unauthorized cross-organization reads and writes; assert both response behavior and persisted state; exercise required database controls; record the B-INC-002 scope while retaining the B-INC-003 obligation.
- **Linked AC:** B-INC-002-AC-13, B-INC-002-AC-15.
- **Linked tests:** BTS-020, BTS-021, BTS-022.
- **Linked security gates:** Not applicable.

## 6. Cross-task dependencies

The intended dependency order is:

1. Identity model and approved authentication contract.
2. UserRepository and authentication adapter boundary.
3. Current-user endpoint.
4. Organization model and approved schema mapping.
5. OrganizationRepository and MembershipRepository.
6. OrganizationService and organization APIs.
7. Role/permission model.
8. Authorization policy layer.
9. Tenant-context enforcement and required database integration.
10. Shared authorization and tenant-isolation test slices.
11. Integration, documentation, security, and architecture evidence review.

This is a dependency guide, not permission to bypass an unmet dependency. Tasks may proceed in parallel only where the interfaces and contracts are sufficiently stable and the task owner records the dependency disposition.

## 7. Coding-agent policy task boundary

The following existing tasks remain deferred and are not part of this increment:

- `KR-CA-022` — Organization coding-agent policy domain model and service.
- `KR-CA-023` — Coding-agent policy GET/PUT API with ETag, If-Match, and default policy.
- `KR-CA-024` — Validate policy provider IDs and MCP tool names; reject content fields.
- `KR-CA-025` — Emit audit events for policy changes.
- `KR-CA-026` — Add policy API, authorization, audit, and negative contract tests.

Do not assign these tasks to B-INC-002, add them to its commit sequence, or mark them complete through generic organization or authorization work. Their existing IDs and dependency gates remain authoritative.

## 8. Task completion requirements

Before a task is marked Accepted:

- Its linked acceptance criteria must have explicit results and reviewed evidence.
- Its linked tests must have valid results for the recorded revision, or the criterion must remain not passed.
- Its linked security-gate field must match the exact union of its linked AC security-gate traces.
- Any `Not applicable` trace must correspond to `Not applicable` in the linked acceptance criteria; it must not be used to bypass an applicable backend-wide BAC.
- Database-dependent tests must exercise the required database behavior rather than only mocked interfaces.
- Test evidence must use synthetic identities and sanitized output.
- Cross-increment shared-task obligations must be recorded and remain open until their assigned scope is accepted.
- Required reviews and material finding dispositions must be recorded.
- The task's commit must follow `GIT_COMMIT_STEP.md` and must not claim tests, criteria, or gates passed without evidence.

## 9. Status

**Status: Proposed.**

This register is a planning artifact. It does not assert that any task is implemented, tested, reviewed, or accepted.
