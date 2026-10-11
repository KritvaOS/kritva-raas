# B-INC-002 — IDENTITY-ORGANIZATION Test Plan

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-002 IDENTITY-ORGANIZATION Test Plan |
| Path | `planning/backend/increments/B-INC-002-IDENTITY-ORGANIZATION/TEST_PLAN.md` |
| Status | Proposed |
| Owner role | QA Owner |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; DB-M02 CORE DATA where applicable |

## Related documents

- [Increment milestone](MILESTONE.md)
- [Increment tasks](TASKS.md)
- [Acceptance criteria and canonical traces](ACCEPTANCE_CRITERIA.md)
- [Review checklist](REVIEW_CHECKLIST.md)
- [Security review](SECURITY_REVIEW.md)
- [Backend test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Backend security gate](../../BACKEND_SECURITY_GATE.md)
- [Parent B-M01 tasks](../../../../docs/backend/milestones/B-M01-CONTROL-PLANE/TASKS.md)

## 1. Purpose

This plan defines the verification approach for B-INC-002 IDENTITY-ORGANIZATION.

The acceptance criteria in `ACCEPTANCE_CRITERIA.md` are the **only source of test traceability for this increment**. The matrix below derives its acceptance-criterion and test-ID mappings from that file. It does not introduce new `BAC-*`, `BTS-*`, or `SEC-GATE-*` identifiers or redefine the canonical meanings of those IDs.

The canonical test strategy remains authoritative for test definitions. This plan describes the increment-specific scope, scenarios, environments, evidence, and exit conditions.

## 2. Test objectives

Verify that:

1. Identity and principal models conform to the approved authentication contract.
2. User, organization, and membership persistence follows the approved database contracts.
3. Missing and invalid authentication is rejected according to the approved contract.
4. The current-user and organization APIs follow the approved REST API v1 contract.
5. Organization membership and authorization rules are enforced consistently.
6. Protected operations use default-deny authorization.
7. Tenant context cannot be overridden by untrusted request data.
8. Unauthorized cross-tenant reads and writes are rejected, with no unintended persisted-state changes.
9. Required database tenant enforcement is tested against the approved database contract.
10. Shared authorization and tenant-isolation test tasks are completed only for the scope assigned to this increment.
11. Integration evidence, test results, and retained diagnostics are reproducible and safe.

## 3. Test principles

- Tests must be deterministic and reproducible from the documented development/test setup.
- Use synthetic users, organizations, memberships, permissions, and credentials.
- Never commit real credentials, authentication tokens, private keys, or production identity-provider material.
- Use the approved test database and schema; do not claim database enforcement from mocks alone.
- Test both allowed and denied operations.
- Verify persisted state after denied mutations.
- Distinguish an absent record or membership from an infrastructure failure.
- Keep test output and retained evidence free of secret values and unnecessary personal data.
- Record the repository revision, command, exit status, environment prerequisites, and actual result.
- Mark unexecuted tests `Not run`, and dependency-blocked tests `Blocked`; neither is a pass.
- Do not claim that a canonical test ID passed unless its complete applicable scope was exercised and evidence was reviewed.

## 4. Test environment and prerequisites

The environment must provide:

- A clean checkout at a recorded revision.
- The approved runtime, dependency manager, test runner, and database migration tooling established by the foundation increment.
- A configured test database using credentials supplied outside tracked files.
- The approved schema and tenant-enforcement configuration required by DB-M01.
- Synthetic test principals with controlled permissions.
- Synthetic organizations and memberships covering same-tenant and cross-tenant cases.
- A way to inspect persisted state before and after negative operations.
- A reproducible mechanism for exercising authentication success and failure paths.
- Sanitized test logging and evidence retention.

Record actual tool and dependency versions in the test execution report. Do not fill in version values before they are verified.

If an authentication provider or database enforcement dependency is not available, record the affected scope as Blocked and identify the owner. A mock or stub may support unit testing, but must not be presented as proof of the unavailable integration.

## 5. Test matrix

The following matrix is derived from the AC-to-BTS mappings in `ACCEPTANCE_CRITERIA.md`. The `BTS-*` identifiers retain their canonical meanings in `BACKEND_TEST_STRATEGY.md`.

| Acceptance criterion | Canonical test trace | Required verification focus |
|---|---|---|
| B-INC-002-AC-01 | BTS-017 | Identity/principal semantics and authentication-boundary consistency |
| B-INC-002-AC-02 | BTS-019 | User repository behavior, absent-user handling, and relevant persistence behavior |
| B-INC-002-AC-03 | BTS-017 | Authentication adapter success and rejection behavior |
| B-INC-002-AC-04 | BTS-017, BTS-032 | Current-user authentication boundary and API integration contract |
| B-INC-002-AC-05 | BTS-019 | Organization model and persistence-contract consistency |
| B-INC-002-AC-06 | BTS-019 | Organization repository behavior against the applicable database environment |
| B-INC-002-AC-07 | BTS-019 | Membership repository and membership-integrity behavior |
| B-INC-002-AC-08 | BTS-018, BTS-019 | Organization-service authorization, membership checks, and denied-mutation assertions |
| B-INC-002-AC-09 | BTS-018, BTS-019, BTS-032 | Organization API contract, authorization, and integrated behavior |
| B-INC-002-AC-10 | BTS-018 | Role/permission definitions and authorization-policy mapping |
| B-INC-002-AC-11 | BTS-018 | Default-deny authorization and permitted/denied policy cases |
| B-INC-002-AC-12 | BTS-020, BTS-021 | Tenant-context integrity and resistance to untrusted context overrides |
| B-INC-002-AC-13 | BTS-020, BTS-021, BTS-022 | Application isolation, tenant-context integrity, and required database enforcement |
| B-INC-002-AC-14 | BTS-018, BTS-019 | B-INC-002 slice of the shared authorization test task |
| B-INC-002-AC-15 | BTS-020, BTS-021, BTS-022 | B-INC-002 slice of the shared tenant-isolation test task |
| B-INC-002-AC-16 | BTS-032, BTS-036 | Integration verification and evidence completeness |
| B-INC-002-AC-17 | BTS-036 | Review, documentation, and evidence completeness |
| B-INC-002-AC-18 | BTS-036 | Increment evidence safety and evidence completeness |

`BTS-032` and `BTS-036` retain their canonical cross-increment scope. This plan does not change their definitions or imply that a test ID is owned exclusively by B-INC-002 beyond the applicable scope.

## 6. Scenario design

### 6.1 Identity and authentication

Cover:

- A valid synthetic authentication result maps to the expected principal.
- Missing authentication is rejected.
- Invalid or unacceptable authentication is rejected according to the approved contract.
- An invalid result cannot create a partially authenticated principal.
- User lookup returns the expected identity for an existing test user.
- An absent user follows the approved not-found or rejection contract.
- Persistence failure is not misreported as a normal absent-user result.
- Current-user responses contain only approved fields.
- Authentication errors do not expose credentials or token contents.

Use the actual adapter boundary and integrated request path for integration tests. A unit test of an adapter mock alone does not prove the real authentication integration.

### 6.2 Organization and membership

Cover:

- Organization retrieval for an authorized principal.
- Organization retrieval for a principal without the required membership or permission.
- Membership lookup for an existing relationship.
- Membership lookup when the relationship is absent.
- Organization and membership repository behavior when the database operation fails.
- Attempts to access an organization by supplying an unauthorized organization identifier.
- Attempts to mutate organization state without the required permission.
- State assertions proving that denied operations did not make unintended changes.
- Validation and response behavior for malformed or unauthorized organization requests.

Test fixtures must respect the approved schema and constraints. Do not weaken constraints merely to make a test fixture easier to create.

### 6.3 Role/permission model and default-deny authorization

Cover:

- An explicitly authorized operation succeeds.
- An operation with a missing permission is denied.
- An operation with an ungranted permission is denied.
- An unknown permission or role does not grant access.
- An authenticated principal without required organization membership is denied where membership is required.
- Authorization is enforced on each protected application path in scope.
- A denied operation does not disclose protected organization or membership data.
- Alternate service or route paths cannot bypass the approved policy layer.

The expected role-to-permission mappings must come from the approved authorization contract. This plan does not invent role names or assign new permissions.

### 6.4 Tenant-context integrity and isolation

Use at least two synthetic organizations and principals with deliberately different access rights.

Cover:

- An authorized request within the principal's permitted organization.
- An attempt to select a different organization through a route identifier.
- An attempt to override tenant context through a request field, query parameter, or header where such inputs are accepted by the application.
- Missing or invalid tenant context.
- Cross-tenant reads.
- Cross-tenant writes and mutations.
- Repeated requests using different tenant identifiers while retaining the same authenticated principal.
- Before/after database state checks for denied writes.
- Database-level enforcement required by the approved DB-M01 contract.

The test report must state which layer was exercised for each result: application policy, service/repository path, database enforcement, or an integrated combination. Do not infer database isolation from an HTTP 403 alone.

### 6.5 API and integrated behavior

Cover:

- Current-user route behavior through the configured HTTP transport.
- Organization route behavior through the configured HTTP transport.
- Authentication and authorization failures through the same integrated path.
- Request validation and error-contract consistency.
- Relevant persistence effects for successful and denied operations.
- Database or authentication dependency failures where required by the approved contracts.

Retain sanitized request/response examples and actual test output. Avoid retaining authorization headers, cookies, tokens, populated connection strings, or sensitive principal attributes.

## 7. Shared task-slice verification

### 7.1 KR-BE-1-044 — Authorization tests

The B-INC-002 slice covers identity and organization authorization only.

- Verify the linked `B-INC-002-AC-11`, `B-INC-002-AC-14`, and `B-INC-002-AC-16` conditions.
- Record the identity/organization test inventory and actual results.
- Retain the full task's original estimate and identifier in the authoritative task register.
- Record that the project and platform-administration authorization slice remains assigned to B-INC-003.
- Do not mark the entire shared task accepted based only on the B-INC-002 slice.

### 7.2 KR-BE-1-045 — Tenant-isolation tests

The B-INC-002 slice covers identity and organization isolation only.

- Verify the linked `B-INC-002-AC-13` and `B-INC-002-AC-15` conditions.
- Include cross-tenant denial, persisted-state assertions, and required database enforcement.
- Record which isolation boundaries were exercised and which database contract was verified.
- Retain the full task's original estimate and identifier in the authoritative task register.
- Record that the project-specific isolation slice remains assigned to B-INC-003.
- Do not mark the entire shared task accepted based only on the B-INC-002 slice.

## 8. Evidence requirements

For each executed test group, retain:

- Tested Git revision.
- Test ID or IDs and the corresponding acceptance criterion IDs.
- Command or reproducible test invocation.
- Test environment and relevant tool/database versions.
- Exit status and actual pass/fail summary.
- Failure details needed to diagnose the result, with sensitive values removed.
- Test data scope, using synthetic identifiers.
- Relevant before/after state assertions for mutation and isolation tests.
- Links to issues or finding records for failures.
- Reviewer and review date where review is required.

Do not retain real credentials, tokens, private key material, production identity-provider secrets, or unredacted authentication headers. Do not paste sensitive scanner or application output into commit messages.

Evidence must distinguish:

- Passed and reviewed.
- Failed.
- Blocked by a dependency.
- Not run.
- Partially covered.
- Deferred by an explicitly authorized decision, where deferral is permitted.

## 9. Failure handling and defect disposition

When a test fails:

1. Preserve the failing test output after sanitization.
2. Record the tested revision, command, and exact scenario.
3. Identify whether the issue is implementation, contract, environment, fixture, or test-harness related.
4. Open or update a tracked finding with an owner and priority.
5. Determine whether the failure blocks one or more acceptance criteria.
6. Correct the cause or obtain an explicitly authorized disposition where the governing criteria permit one.
7. Rerun the affected test and relevant regression tests.
8. Update the acceptance record only after inspecting the actual result.

Do not convert a failure to Pass by changing the expected result without review against the approved contract.

## 10. Test execution record

Complete this record when execution begins.

| Field | Value |
|---|---|
| Repository revision | TBD |
| Runtime/tool versions | TBD |
| Database and schema revision | TBD |
| Test environment | TBD |
| Test command(s) | TBD |
| Test summary | TBD |
| Failed tests/findings | TBD |
| Blocked tests and dependencies | TBD |
| Not-run tests | TBD |
| Evidence location | TBD |
| QA reviewer | TBD |
| Review date | TBD |

## 11. Exit criteria

Testing is ready for acceptance review only when:

- Every applicable AC has a recorded result and evidence reference.
- Required canonical tests for the increment's scope have been executed and reviewed.
- Authentication and authorization success/failure behavior is covered.
- Organization and membership persistence behavior is verified.
- Required tenant-context and cross-tenant cases are exercised.
- Required database tenant enforcement is verified against the approved database contract.
- The B-INC-002 slices of `KR-BE-1-044` and `KR-BE-1-045` are evidenced without closing the B-INC-003 obligations.
- Integration tests run against the applicable integrated path.
- Failures, blocked tests, and not-run tests are explicit.
- Test evidence contains no prohibited secrets or unsafe sensitive output.
- Review findings and evidence gaps have explicit dispositions.

A green unit-test summary by itself is insufficient to establish these exit criteria.

## 12. Status

**Status: Proposed.**

No tests are claimed as executed or passed by this plan. Execution results must be recorded against the actual implementation revision.
