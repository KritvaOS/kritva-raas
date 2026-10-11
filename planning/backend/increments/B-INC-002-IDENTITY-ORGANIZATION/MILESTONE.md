
# B-INC-002 — IDENTITY-ORGANIZATION

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-002 IDENTITY-ORGANIZATION Milestone |
| Path | `planning/backend/increments/B-INC-002-IDENTITY-ORGANIZATION/MILESTONE.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; DB-M02 CORE DATA where applicable |

## Related documents

- [Backend implementation plan](../../BACKEND_IMPLEMENTATION_PLAN.md)
- [Backend task register](../../BACKEND_TASK_REGISTER.md)
- [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Backend test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Backend security gate](../../BACKEND_SECURITY_GATE.md)
- [Backend dependency map](../../BACKEND_DEPENDENCY_MAP.md)
- [Backend risk register](../../BACKEND_RISK_REGISTER.md)
- [Backend resource plan](../../BACKEND_RESOURCE_PLAN.md)
- [Parent B-M01 milestone](../../../../docs/backend/milestones/B-M01-CONTROL-PLANE/MILESTONE.md)
- [Parent B-M01 tasks](../../../../docs/backend/milestones/B-M01-CONTROL-PLANE/TASKS.md)
- [Increment tasks](TASKS.md)
- [Increment acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Review checklist](REVIEW_CHECKLIST.md)
- [Test plan](TEST_PLAN.md)
- [Security review](SECURITY_REVIEW.md)
- [Increment changelog](CHANGELOG.md)
- [Git commit procedure](GIT_COMMIT_STEP.md)

## 1. Purpose

B-INC-002 IDENTITY-ORGANIZATION defines the identity, user, organization, membership, role, permission, authorization, and tenant-context work needed by the Kritva RaaS backend.

The increment is an implementation increment within the canonical phase P3 CONTROL PLANE and the official parent milestone B-M01 CONTROL PLANE. It does not introduce a new official phase or milestone and does not replace the parent milestone's acceptance authority.

The increment must establish a provider-neutral authentication boundary and consistent application-level authorization behavior, while coordinating organization and membership persistence with DB-M01 FOUNDATION and any applicable approved DB-M02 CORE DATA contract.

## 2. Objective

Deliver a testable identity and organization foundation that:

- Represents the authenticated principal and user identity consistently.
- Defines a provider-neutral authentication adapter boundary.
- Rejects missing or invalid authentication according to the approved contract.
- Exposes a current-user endpoint with a stable, documented response contract.
- Represents organizations and memberships without weakening persistence integrity.
- Implements organization and membership repositories against the approved database schema.
- Implements organization services and APIs with explicit authorization rules.
- Defines roles and permissions using a reviewed, auditable policy model.
- Enforces default-deny authorization for protected operations.
- Establishes trustworthy tenant context from the approved authentication and authorization boundary.
- Prevents unauthorized cross-organization reads, writes, and mutations at the application layer and verifies required database enforcement.
- Provides positive and negative authorization, membership, tenant-context, and isolation tests.
- Preserves repository secret-handling rules and produces sanitized, reviewable acceptance evidence.

## 3. Canonical placement and ownership

| Attribute | Value |
|---|---|
| Increment ID | B-INC-002 |
| Increment name | IDENTITY-ORGANIZATION |
| Canonical phase | P3 CONTROL PLANE |
| Parent official milestone | B-M01 CONTROL PLANE |
| Primary implementation owner | Backend Technical Lead |
| Architecture review | Architecture Owner |
| Authentication and authorization review | Security Owner |
| Persistence and schema coordination | Database Technical Lead |
| Independent test verification | QA Owner |
| Official acceptance authority | B-M01 milestone acceptance authority |

B-INC-002 is subordinate to B-M01 CONTROL PLANE. Its acceptance records only the scope and evidence allocated to this increment. It does not declare B-M01 complete.

## 4. Scope

### 4.1 Included implementation tasks

The increment includes these existing B-M01 task IDs:

- `KR-BE-1-010` — Define identity domain model.
- `KR-BE-1-011` — Implement UserRepository.
- `KR-BE-1-012` — Implement authentication adapter boundary.
- `KR-BE-1-013` — Implement current-user endpoint.
- `KR-BE-1-014` — Define Organization model.
- `KR-BE-1-015` — Implement OrganizationRepository.
- `KR-BE-1-016` — Implement MembershipRepository.
- `KR-BE-1-017` — Implement OrganizationService.
- `KR-BE-1-018` — Implement organization APIs.
- `KR-BE-1-019` — Define role/permission model.
- `KR-BE-1-020` — Implement authorization policy layer.
- `KR-BE-1-021` — Implement tenant context enforcement.

It also includes the explicitly scoped identity/organization slices of these existing shared tasks:

- `KR-BE-1-044` — Add authorization tests; B-INC-002 identity and organization slice only.
- `KR-BE-1-045` — Add tenant-isolation tests; B-INC-002 identity and organization slice only.

The shared-task slices retain their original IDs and whole-task estimates. They must not be represented as newly created tasks or counted as additional independent estimates when the remaining slices are planned under B-INC-003.

### 4.2 Included verification

Verification must cover:

- Authentication boundary behavior for valid, missing, and invalid test credentials.
- User lookup and current-principal behavior.
- Organization and membership integrity.
- Organization service and API authorization.
- Default-deny behavior for missing permissions.
- Tenant-context derivation, propagation, and integrity.
- Cross-organization access rejection.
- Application-level isolation and required database tenant enforcement.
- Safe errors and responses for unauthorized operations.
- Integration of the implemented identity and organization operations.
- Architecture, security, documentation, and evidence review.

Canonical test IDs and acceptance traces are defined in `ACCEPTANCE_CRITERIA.md`. The tasks document must derive each task's linked test IDs and security-gate IDs from the acceptance criteria linked to that task.

### 4.3 Explicitly excluded

The following are outside this increment unless an approved change record explicitly changes the boundary:

- Project domain, project APIs, and project authorization, allocated to B-INC-003.
- Platform-catalog domain and platform-administration authorization, allocated to B-INC-003 and subject to B-M03 PLATFORM ownership.
- Transaction and idempotency implementation, allocated to B-INC-004.
- Audit repository, audit service, and business-operation audit hooks, allocated to B-INC-004.
- The remaining B-INC-003 slices of `KR-BE-1-044` and `KR-BE-1-045`.
- The remaining cross-increment scopes of shared test and review tasks.
- Production identity-provider deployment, production IAM, cloud workload identity, and production secret delivery owned by the relevant infrastructure workstream.
- Coding-agent policy tasks `KR-CA-022` through `KR-CA-026`, which remain deferred.
- Any work that silently transfers database milestone ownership to the backend increment.

## 5. Architectural and security constraints

### 5.1 Authentication boundary

Authentication must be implemented behind the approved provider-neutral adapter boundary. Application domain and service code must not become coupled to a particular identity provider's proprietary request or token representation without an approved architecture decision.

The authentication adapter must expose only the principal and identity attributes needed by the approved application contract. Token validation, issuer/audience checks, expiry behavior, and credential trust must follow the approved authentication contract; this dossier does not invent provider-specific settings.

Tests must use synthetic identities and credentials. Real tokens, private keys, passwords, or production identity-provider credentials must not be committed or copied into test evidence.

### 5.2 Organization and membership integrity

Organization and membership models must match the approved DB-M01 schema and the relevant persistence contracts.

Repository and service behavior must make ownership and membership checks explicit. A client-supplied organization identifier is not, by itself, proof that the caller may act in that organization.

The implementation must not bypass schema constraints, create an alternate persistence model, or introduce application-only assumptions that conflict with the approved database contract.

### 5.3 Default-deny authorization

Protected operations must require an explicit authorization decision. Missing, unknown, malformed, or unrecognized permission context must not implicitly grant access.

Authorization checks must be enforced at the application boundary appropriate to the operation, not only in the user interface or API route naming. The policy model must distinguish authentication (who the principal is) from authorization (what that principal may do).

Tests must demonstrate both permitted and denied behavior, including requests with missing permissions and requests that attempt to cross organization boundaries.

### 5.4 Tenant-context integrity and database enforcement

Tenant context must be derived from the trusted authentication and authorization contract and propagated through the relevant service and persistence path.

Untrusted request fields, query parameters, route identifiers, or headers must not allow a caller to override the authorized tenant context.

The implementation must coordinate with the Database Technical Lead to identify which tenant-isolation guarantees are required at the database layer. Application-level checks do not substitute for required database enforcement.

Where database policies, constraints, transaction-local context, or other mechanisms are specified by the approved database contract, the increment must verify the integration against that contract rather than inventing a competing mechanism.

### 5.5 Repository and evidence security

All work in this increment remains subject to the backend-wide invariant:

**No real secrets or security-key material may be stored in the repository.**

This includes authentication tokens, session credentials, API keys, passwords, private keys, database credentials, populated `.env` files, and sensitive test output. Examples and fixtures must use unmistakably nonfunctional placeholders or synthetic values generated during tests.

The applicable later-increment requirements for no prohibited repository secrets, safe examples/fixtures, blocking secret scanning, and secret-safe evidence remain in force. Their presence in an acceptance trace does not transfer ownership of B-INC-001's original security-gate implementation to B-INC-002.

## 6. Dependencies and readiness conditions

B-INC-002 depends on the following inputs being available and reviewed:

1. B-INC-001's accepted or explicitly authorized foundation scope, including application structure, configuration, API conventions, and test workflow.
2. The approved backend architecture and module-boundary decisions.
3. The approved identity/authentication contract and the decision owner for any unresolved provider-specific choices.
4. The DB-M01 organization, user, membership, and tenant-isolation schema/contracts needed by the tasks.
5. The approved REST API v1 conventions for authentication errors, authorization errors, validation, and response formats.
6. A reproducible test environment with synthetic identities and controlled database credentials supplied outside tracked files.
7. Identified owners for security review, database review, and independent test verification.

If a dependency is not approved or available, the affected task must be marked Blocked or remain Proposed. Do not silently substitute a local design for an unresolved cross-workstream contract.

## 7. Deliverables

The expected deliverables are:

- Reviewed identity/principal domain model.
- UserRepository implementation against the approved persistence contract.
- Provider-neutral authentication adapter boundary.
- Current-user endpoint and contract tests.
- Organization model and reviewed schema mapping.
- OrganizationRepository and MembershipRepository implementations.
- OrganizationService with explicit membership and authorization behavior.
- Organization APIs with documented request, response, and error behavior.
- Reviewed role/permission model.
- Default-deny authorization policy layer.
- Tenant-context derivation and enforcement through the relevant application path.
- Verified application-level cross-tenant denial and required database tenant enforcement.
- Identity/organization authorization test slice for `KR-BE-1-044`.
- Identity/organization tenant-isolation test slice for `KR-BE-1-045`.
- Completed acceptance matrix and review findings register.
- Test, security, architecture, documentation, and acceptance evidence suitable for review without revealing secrets.

Deliverable existence alone does not satisfy acceptance. The pass conditions and evidence requirements in `ACCEPTANCE_CRITERIA.md` govern acceptance.

## 8. Required reviews

The following reviews must be completed for the applicable scope:

| Review | Required focus | Owner role |
|---|---|---|
| Architecture | Identity boundaries, provider-neutral adapter, module dependencies, data ownership | Architecture Owner |
| Authentication and security | Authentication contract, failure behavior, default-deny policy, tenant-context integrity | Security Owner |
| Database and persistence | User, organization, membership schema mapping and required tenant enforcement | Database Technical Lead |
| Test review | Positive/negative coverage, reproducibility, cross-tenant assertions, evidence quality | QA Owner |
| API review | Current-user and organization route/response/error contract | Backend Technical Lead with API contract owner |
| Documentation review | Setup, behavior, operational limitations, and accurate status | Documentation Owner |
| Increment acceptance | AC-by-AC evidence and blocker disposition | Authorized B-M01 acceptance authority |

An implementer must not self-approve an independent review where program policy requires independent review.

## 9. Exit criteria

B-INC-002 may be proposed for acceptance only when all applicable conditions below are satisfied:

1. Every in-scope task has a recorded status and evidence reference.
2. The identity, authentication, organization, membership, role, permission, and tenant-context contracts are reviewed and consistent with approved architecture and database ownership.
3. Missing or invalid authentication is rejected according to the approved contract.
4. The current-user endpoint conforms to its approved API contract.
5. Organization and membership operations preserve the required integrity constraints.
6. Protected operations use explicit default-deny authorization.
7. Tenant context cannot be overridden by untrusted request data.
8. Positive and negative tests demonstrate organization membership and authorization behavior.
9. Cross-tenant application tests reject unauthorized reads and writes.
10. Required database tenant enforcement is verified with the Database Technical Lead's evidence; a mocked application test alone is insufficient where real database enforcement is required.
11. The B-INC-002 slices of `KR-BE-1-044` and `KR-BE-1-045` are completed with their remaining B-INC-003 obligations explicitly retained.
12. Required integration tests execute against the applicable real integrated path and test database.
13. Required architecture, security, API, database, and QA reviews are completed and recorded.
14. Every applicable acceptance criterion has an explicit result, evidence reference, reviewer, and disposition.
15. No mandatory failure or unresolved material finding is accepted implicitly.
16. Repository security hygiene and secret-safe evidence requirements are satisfied for the reviewed scope.
17. Documentation reflects actual behavior and does not claim that production identity-provider deployment or full B-M01 acceptance is complete without evidence.
18. The closing commit and annotated tag follow the increment's `GIT_COMMIT_STEP.md` convention after authorized acceptance.

Acceptance of B-INC-002 does not automatically complete B-M01 CONTROL PLANE, DB-M01 FOUNDATION, DB-M02 CORE DATA, or B-INC-003/B-INC-004.

## 10. Deferred coding-agent policy tasks

The following existing tasks remain deferred and are not part of this increment's implementation schedule:

- `KR-CA-022` — Organization coding-agent policy domain model and service.
- `KR-CA-023` — Coding-agent policy GET/PUT API with ETag, If-Match, and default policy.
- `KR-CA-024` — Coding-agent policy validation.
- `KR-CA-025` — Audit events for coding-agent policy changes.
- `KR-CA-026` — Coding-agent policy tests.

These IDs must remain unchanged. Do not implement them as an untracked extension of organization APIs or treat identity/organization acceptance as approval of their policy contract. Their scheduling remains subject to the applicable SYS-ADR-007, DB-M02 CORE DATA, and `KR-CA-031` gates recorded in the authoritative coding-agent integration plan.

## 11. Status

**Status: Proposed.**

This dossier defines the intended increment scope and acceptance boundary. It does not claim that implementation, integration tests, database enforcement, security review, or acceptance has occurred. Criteria remain unaccepted until their required evidence has been produced and reviewed.
