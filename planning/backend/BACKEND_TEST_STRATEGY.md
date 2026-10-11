# Backend Test Strategy

## Document Control

| Field | Value |
|---|---|
| Document | Backend Test Strategy |
| Path | `planning/backend/BACKEND_TEST_STRATEGY.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; DB-M02 CORE DATA; B-M03 PLATFORM; C-M01 FOUNDATION |

## 1. Purpose

This document defines the backend testing model, measurable test gates, required evidence, and the conditions that block increment acceptance.

The strategy covers application foundation, configuration, HTTP/API behavior, persistence, migrations, identity, authorization, tenant isolation, project and platform operations, transactions, idempotency, audit behavior, security controls, and end-to-end verification.

It defines required test outcomes without prematurely selecting a test framework, assertion library, HTTP test client, database harness, or CI implementation. These choices must be compatible with the approved backend technology decisions.

## 2. Testing Principles

1. Every implemented requirement must map to one or more measurable tests or an explicitly documented non-automated review.
2. Every test must have a clear expected result and a reproducible execution procedure.
3. Tests must verify failure behavior as well as successful behavior.
4. Security, authorization, and tenant-isolation tests must include negative cases.
5. Database-dependent tests must exercise the required database behavior, not only mock repository interfaces.
6. Contract tests must verify externally observable request and response behavior.
7. End-to-end tests must exercise the actual integrated application path within the declared test scope.
8. Test results must identify the revision and execution environment sufficiently to reproduce the result.
9. Test fixtures and evidence must not contain real credentials, private keys, production secrets, or prohibited sensitive data.
10. A test that is skipped, blocked, or not run cannot be reported as passing.
11. A passing test suite does not establish that untested repository history, branches, deployment environments, or external systems are secure.
12. Test coverage percentages alone are not acceptance evidence for security-critical behavior.

## 3. Test Levels

| Level | Purpose | Typical scope | Required evidence |
|---|---|---|---|
| Static and repository checks | Detect prohibited files, secret patterns, formatting or policy violations | Tracked files, changed files, history where required, static analysis | Tool/version, scope, configuration, result, and findings |
| Unit | Verify isolated functions and module behavior | Configuration parsing, validation, request context, policies, service logic | Test command, result, failures, and revision |
| Contract | Verify API requests, responses, errors, and compatibility | REST API v1 routes and schemas | Contract test results and expected-versus-actual behavior |
| Integration | Verify components working together | HTTP layer, services, PostgreSQL, migrations, transactions | Environment description, test results, and cleanup evidence |
| Security | Verify security controls and negative cases | Secret scanning, redaction, authentication, authorization, tenant isolation | Test cases, safe logs, scanner results, and reviewer disposition |
| End-to-end | Verify integrated user-visible flows | Approved primary product path and applicable backend workflows | Scenario, revision, environment, result, and retained diagnostic evidence |
| Performance baseline | Establish repeatable initial measurements | Representative endpoints and database interactions | Workload, environment, measurements, limitations, and analysis |
| Manual review | Evaluate properties that are not fully established by automated tests | Architecture, threat scenarios, sensitive-data handling, operational readiness | Checklist, reviewer role, findings, and disposition |

The project must select concrete tools through the relevant implementation decisions. The strategy does not treat a named tool as mandatory unless an approved decision establishes that requirement.

## 4. Test Environment and Reproducibility

### 4.1 Environment requirements

The test environment must be documented sufficiently to identify:

- Runtime and language versions.
- Package manager and lockfile state.
- Required environment variables and their source.
- Database version and initialization procedure, where applicable.
- Migration setup and teardown behavior.
- External services replaced by controlled test doubles, where applicable.
- Required test commands.
- Cleanup behavior and any retained artifacts.

No environment description may include actual secret values.

### 4.2 Reproducible execution

A test run must record the repository revision or commit, command, environment identifier, execution result, and relevant tool versions.

If a test depends on an unavailable service or environment, the result must be marked Blocked or Not run. A local mock must not be represented as proof that the real external integration works.

### 4.3 Test data

Test data must be synthetic, controlled, and suitable for the test purpose.

- Do not copy production credentials or sensitive production records into fixtures.
- Generate ephemeral test keys at runtime when required.
- Do not persist private key material in snapshots, logs, or test output.
- Keep database credentials outside tracked files.
- Reset or isolate database state so tests are not dependent on uncontrolled execution order.
- Avoid assertions that rely on nondeterministic timestamps, network timing, or external state unless the test explicitly evaluates those properties.

## 5. Required Test Gates

Each criterion below has a stable ID, measurable pass/fail condition, required evidence, and blocking increment.

A criterion is passed only when its stated behavior has been exercised and the required evidence reviewed. The same evidence may support multiple criteria when the test scope clearly covers each requirement.

### 5.1 Repository, configuration, and application foundation

| ID | Criterion and pass/fail condition | Evidence to retain | Blocking increment |
|---|---|---|---|
| BTS-001 | **Reproducible setup. PASS:** a clean checkout can install dependencies and execute the documented foundation test command without undocumented manual changes. **FAIL:** setup requires an unrecorded step or cannot complete. | Revision, runtime/tool versions, command transcript, dependency-install result, and test summary. | B-INC-001 |
| BTS-002 | **Configuration validation. PASS:** automated tests cover missing, malformed, and invalid required settings; each produces the documented failure behavior. **FAIL:** invalid required settings are silently accepted or cause uncontrolled failure. | Test cases, command, result, and sanitized failure output. | B-INC-001 |
| BTS-003 | **Secret-safe configuration failure. PASS:** synthetic credentials inserted into invalid configuration do not appear in error output or logs. **FAIL:** a tested credential value is exposed. | Synthetic test input, automated assertion results, and sanitized output. | B-INC-001 |
| BTS-004 | **Module-boundary verification. PASS:** architecture review confirms that the implemented module dependencies follow the approved backend design and that no prohibited dependency direction is introduced. **FAIL:** an unresolved architecture violation remains. | Dependency inspection or architecture-check output, review checklist, and finding dispositions. | B-INC-001 |
| BTS-005 | **Request context. PASS:** tests demonstrate that request-scoped context is created, propagated to the intended handlers, and isolated between independent requests. **FAIL:** context is missing, leaked across requests, or inconsistently propagated. | Automated tests and execution results. | B-INC-001 |
| BTS-006 | **Request correlation. PASS:** a valid incoming correlation identifier is handled according to the API contract, and requests without one receive the defined behavior; the identifier is observable in the relevant safe diagnostic path. **FAIL:** behavior is inconsistent with the contract or sensitive values are logged. | Contract/unit tests and sanitized correlation logs. | B-INC-001 |
| BTS-007 | **Validation and error contract. PASS:** tests cover representative valid requests and invalid request bodies, parameters, and headers applicable to the implemented routes; invalid requests receive the documented error shape and status behavior. **FAIL:** malformed input causes an undocumented response or unhandled error. | API tests, expected/actual error examples without secrets, and test summary. | B-INC-001 |
| BTS-008 | **Health and readiness. PASS:** automated tests distinguish process health from readiness to accept requests and verify the documented behavior when a required dependency is unavailable. **FAIL:** readiness reports success despite a required unavailable dependency contrary to the contract. | Health/readiness test results and controlled dependency-failure evidence. | B-INC-001 |
| BTS-009 | **Structured logging. PASS:** representative success and failure paths produce the required structured fields and do not emit synthetic credential values. **FAIL:** required fields are absent or tested sensitive values appear in logs. | Log-schema assertions, redaction tests, and sanitized log samples. | B-INC-001 |
| BTS-010 | **Repository secret detection. PASS:** the approved local and CI scanner workflows detect a synthetic finding in their declared scope; the required CI check fails and reports no secret value. **FAIL:** the test finding is missed, the required check is nonblocking, or scanner failure is treated as success. | Scanner configuration, synthetic test procedure, local/CI results, and sanitized failure logs. | B-INC-001 |

### 5.2 Database and migration behavior

| ID | Criterion and pass/fail condition | Evidence to retain | Blocking increment |
|---|---|---|---|
| BTS-011 | **Database connectivity. PASS:** an integration test connects to the controlled test database using credentials supplied outside tracked files, performs the required foundation operation, and cleans up safely. **FAIL:** the test depends on committed credentials or cannot verify actual connectivity. | Test setup, environment description without credential values, command, result, and cleanup result. | B-INC-001 |
| BTS-012 | **Migration reproducibility. PASS:** migrations apply successfully to a clean test database using the approved migration procedure, and the resulting schema meets the documented baseline expectations. **FAIL:** migration application fails or produces an unexpected schema. | Migration command, database/tool versions, clean-database result, and schema verification. | B-INC-001 |
| BTS-013 | **Migration repeatability and upgrade behavior. PASS:** the supported migration workflow behaves deterministically for a fresh database and the documented upgrade scenario; any unsupported downgrade behavior is explicitly documented rather than assumed. **FAIL:** the supported workflow produces inconsistent state or undocumented failure. | Fresh-install and upgrade test results, schema checks, and documented limitations. | B-INC-001 |
| BTS-014 | **Transaction rollback. PASS:** integration tests demonstrate that a controlled failure rolls back the changes required by the transaction contract. **FAIL:** partial changes remain where atomic rollback is required. | Test setup, injected failure point, database assertions, and result. | B-INC-004 |
| BTS-015 | **Idempotent replay. PASS:** repeated requests with the same valid idempotency key and equivalent request data produce the documented replay behavior without duplicate effects. **FAIL:** unintended duplicate effects occur or the response conflicts with the contract. | Request sequence, persisted-state assertions, response comparison, and test result. | B-INC-004 |
| BTS-016 | **Idempotency conflict. PASS:** reusing an idempotency key with a conflicting request is handled according to the approved contract and does not silently apply the conflicting operation. **FAIL:** the conflict is accepted contrary to the contract. | Conflicting request sequence, response assertions, state inspection, and result. | B-INC-004 |

### 5.3 Identity, authorization, and tenant isolation

| ID | Criterion and pass/fail condition | Evidence to retain | Blocking increment |
|---|---|---|---|
| BTS-017 | **Authentication boundary. PASS:** tests demonstrate the documented behavior for a valid test principal, a missing credential, an invalid credential, and an unavailable authentication dependency where applicable. **FAIL:** unauthenticated or invalid principals are accepted contrary to the contract. | Synthetic identity fixtures, API test results, and sanitized error output. | B-INC-002 |
| BTS-018 | **Default-deny authorization. PASS:** tests demonstrate that an operation with no applicable grant is rejected, while an explicitly authorized operation succeeds. **FAIL:** an ungranted operation succeeds. | Permission matrix, positive and negative tests, and results. | B-INC-002 |
| BTS-019 | **Organization membership. PASS:** tests verify the allowed and denied membership operations defined by the organization contract, including access by a principal who is not a member. **FAIL:** a nonmember gains access contrary to policy. | Synthetic users/organizations, API tests, and result summary. | B-INC-002 |
| BTS-020 | **Cross-tenant application isolation. PASS:** tests attempt representative reads and writes against another organization using an unauthorized principal and verify that access is rejected without unintended state changes. **FAIL:** unauthorized cross-tenant data access or mutation succeeds. | Test matrix, requests, response assertions, before/after state, and results. | B-INC-002 |
| BTS-021 | **Tenant-context integrity. PASS:** tests verify that an untrusted request cannot override the authenticated or authorized tenant context to gain access to another tenant's resources. **FAIL:** request-controlled tenant selection bypasses authorization. | Test cases, principal/context setup, API results, and state assertions. | B-INC-002 |
| BTS-022 | **Database tenant enforcement. PASS:** integration tests exercise the database-level tenant-isolation mechanism required by the approved schema and architecture, including a denied cross-tenant operation. **FAIL:** the required database protection is absent or can be bypassed in the tested scenario. | Database setup, role/context configuration, SQL or repository operation, expected denial, and results. | B-INC-002 |
| BTS-023 | **Authorization on project operations. PASS:** tests cover allowed and denied project reads and writes, including access to a project owned by another organization. **FAIL:** an unauthorized project operation succeeds. | Project fixtures, API tests, state assertions, and results. | B-INC-003 |
| BTS-024 | **Platform-administration authorization. PASS:** tests show that a principal without the required platform-administration permission cannot perform protected catalog operations. **FAIL:** an unprivileged principal can perform a protected operation. | Synthetic principals, permission setup, API test results, and state assertions. | B-INC-003 |

### 5.4 Project and platform API behavior

| ID | Criterion and pass/fail condition | Evidence to retain | Blocking increment |
|---|---|---|---|
| BTS-025 | **Project API contract. PASS:** contract tests verify the implemented project routes, required fields, response schemas, validation failures, and documented error behavior. **FAIL:** an implemented route deviates from the approved contract. | Contract test output, schema/version references, and sanitized request/response examples. | B-INC-003 |
| BTS-026 | **Source-code privacy. PASS:** tests and request/response review demonstrate that project metadata APIs do not accept or return source-code payloads or prohibited credential material outside an explicitly approved future contract. **FAIL:** the API persists or returns prohibited payloads. | Schema review, payload-rejection tests, response inspection, and test results. | B-INC-003 |
| BTS-027 | **Platform-catalog API contract. PASS:** contract tests verify the implemented catalog routes, validation, response schemas, and error behavior against the approved contract. **FAIL:** an implemented route violates the contract. | Contract test output, schema/version references, and sanitized examples. | B-INC-003 |
| BTS-028 | **Input and response data classification. PASS:** representative invalid or disallowed payloads are rejected and prohibited secret fields are not returned in responses. **FAIL:** prohibited payloads are accepted or sensitive values are returned. | Validation tests, schema review, and response assertions. | B-INC-003 |

### 5.5 Audit, integration, and end-to-end behavior

| ID | Criterion and pass/fail condition | Evidence to retain | Blocking increment |
|---|---|---|---|
| BTS-029 | **Required audit events. PASS:** tests trigger each required operation in the increment's approved audit scope and verify the required audit record fields and outcome. **FAIL:** a required operation lacks its required audit evidence. | Event-to-operation matrix, persisted audit assertions, and results. | B-INC-004 |
| BTS-030 | **Audit data safety. PASS:** tests verify that audit records exclude passwords, tokens, private key material, and prohibited request payloads. **FAIL:** any tested prohibited value is persisted in an audit record. | Synthetic secret test cases, persisted-record assertions, and sanitized results. | B-INC-004 |
| BTS-031 | **Audit failure behavior. PASS:** tests verify the documented behavior when audit persistence fails, including whether the associated operation must fail or roll back. **FAIL:** actual behavior contradicts the approved audit/transaction contract. | Controlled failure injection, operation result, persisted-state assertions, and contract reference. | B-INC-004 |
| BTS-032 | **API integration. PASS:** integration tests exercise the HTTP layer, service layer, and required persistence components together for each implemented operation in the increment's approved scope. **FAIL:** required integrated behavior is not tested or fails. | Scenario list, environment, command, test results, and sanitized diagnostics. | B-INC-001 for foundation scenarios; B-INC-002 through B-INC-004 for their respective operations |
| BTS-033 | **Primary product path. PASS:** the approved end-to-end scope has a reproducible test or explicitly documented integration verification covering the applicable backend interactions without substituting mocks for components claimed as integrated. **FAIL:** a required path segment is unverified or a mock is represented as a real integration. | Scenario definition, component map, environment, results, and limitations. | Relevant increment and B-M01 CONTROL PLANE acceptance |
| BTS-034 | **Failure and retry behavior. PASS:** the required failure, retry, timeout, and duplicate-request cases for the increment's operations behave according to the approved contract. **FAIL:** a tested failure path causes unauthorized state changes or undocumented results. | Failure-injection scenarios, request sequence, persisted-state checks, and results. | B-INC-004 where transaction/idempotency behavior is involved; otherwise the relevant implementing increment |
| BTS-035 | **Performance baseline. PASS:** the required baseline workload, environment, measurement method, and observed results are documented and reviewed against the B-M01 acceptance requirements. **FAIL:** measurements are not reproducible or required performance evidence is missing. | Workload definition, environment details, commands, raw measurements without sensitive data, summary, and review. | B-INC-001 foundation evidence and B-M01 CONTROL PLANE acceptance |
| BTS-036 | **Review and evidence completeness. PASS:** all tests required by the increment's acceptance criteria have results, all failures have disposition, and the review checklist identifies unrun or blocked tests. **FAIL:** required test evidence is missing or failures are silently omitted. | Completed test matrix, results, failure dispositions, and reviewer record. | Every increment |
| BTS-037 | **Source header compliance. PASS:** `python3 scripts/lint/check_source_headers.py --mode tracked --strict` reports PASSED on the tested revision, the checker's unit tests pass, and the `Source Header Check` workflow is green for that revision. **FAIL:** any in-scope tracked file lacks a compliant header, the checker tests fail, or the workflow is missing or red. | Checker output, unit-test output, and Actions run reference for the revision; verifies BAC-039. | B-INC-001, then every increment |

## 6. Increment-Specific Test Requirements

### 6.1 B-INC-001 SECURE FOUNDATION

Before B-INC-001 can be accepted, its test scope must include:

- Reproducible dependency installation and documented test execution.
- Configuration parsing and invalid-startup behavior.
- HTTP/API routing, validation, error responses, and request correlation.
- Health and readiness behavior, including required dependency failure.
- Structured logging and sensitive-data redaction.
- PostgreSQL connectivity and the required migration-baseline checks.
- Repository secret-scanning behavior and blocking CI verification.
- Synthetic secret detection and safe scanner failure behavior.
- Review evidence for application module boundaries.
- A documented and reviewed performance-baseline scope where required by the existing B-M01 register.

Identity, organization, project, and catalog business behavior need not be implemented merely to pass this foundation increment. However, any foundation interface that those later capabilities depend on must be covered by suitable contract or component tests.

### 6.2 B-INC-002 IDENTITY-ORGANIZATION

Before B-INC-002 can be accepted, its test scope must include:

- Authentication behavior for valid, missing, and invalid test credentials.
- User and organization persistence behavior.
- Membership rules and negative cases.
- Role and permission enforcement.
- Default-deny authorization.
- Tenant-context integrity.
- Application-level cross-tenant rejection.
- Required database-level tenant-isolation behavior.
- Negative tests proving that unauthorized operations do not mutate state.

### 6.3 B-INC-003 PROJECTS-PLATFORM-CATALOG

Before B-INC-003 can be accepted, its test scope must include:

- Project API contract and validation.
- Organization-scoped project access.
- Cross-tenant project read/write rejection.
- Platform-catalog API contract and validation.
- Platform-administration authorization.
- Rejection of disallowed payloads.
- Confirmation that project metadata APIs do not become an unintended source-code or credential storage path.

### 6.4 B-INC-004 AUDIT-TRANSACTIONS-IDEMPOTENCY

Before B-INC-004 can be accepted, its test scope must include:

- Migration behavior relevant to the increment.
- Transaction rollback under controlled failure.
- Idempotent replay and conflicting-key behavior.
- Required audit-event generation.
- Audit persistence failure behavior.
- Audit data redaction and prohibited-field exclusion.
- Failure, retry, and replay scenarios.
- Integration evidence demonstrating the approved components working together.

## 7. Test Execution and Evidence Format

Every retained test result must include, where applicable:

| Evidence field | Requirement |
|---|---|
| Test ID | One or more applicable IDs from this strategy or the increment's approved test plan |
| Revision | Commit or exact repository revision under test |
| Environment | Runtime, database, and relevant dependency versions |
| Command | Reproducible test or verification command |
| Scope | Scenarios, components, branches, or repository refs covered |
| Expected result | Defined pass condition |
| Actual result | Pass, Fail, Blocked, or Not run |
| Diagnostics | Sufficient sanitized output to investigate a failure |
| Finding disposition | Owner, decision, and follow-up where applicable |
| Reviewer | Responsible owner role or delegated reviewer |

Do not embed credentials, tokens, private key material, production records, or other prohibited sensitive data in evidence.

For secret-scanning evidence, retain tool/version, configuration, scan scope, revision/ref coverage, result counts or safe summaries, and finding disposition. Do not reproduce secret values in reports.

## 8. Failure Handling

A failed required test blocks acceptance of its applicable increment.

The owner must:

1. Record the failure against its test ID.
2. Preserve safe diagnostics and the revision under test.
3. Identify whether the failure is a defect, environment issue, test defect, or unresolved contract.
4. Correct the cause or obtain a documented decision from the relevant owner.
5. Rerun the failed test and any required regression tests.
6. Retain the new result and disposition.

A test must not be weakened merely to obtain a pass. Changes to expected behavior require a reviewed contract or acceptance-criteria update.

For suspected secret exposure, follow the security finding and exposure-response process. Do not paste the detected secret into an issue, test report, or commit message.

## 9. Relationship to Other Requirements

This strategy supplements, and does not replace, the established testing and architecture documents:

- [Testing strategy](../../docs/development/TESTING_STRATEGY.md)
- [Backend architecture](../../docs/backend/architecture/BACKEND_ARCHITECTURE.md)
- [API contract](../../docs/protocol/API_CONTRACT.md)
- [Secret management](../../docs/security/SECRETS_MANAGEMENT.md)
- [Key management](../../docs/security/KEY_MANAGEMENT.md)

Where an existing contract imposes a stronger test or acceptance requirement, the stronger requirement applies. Any ambiguity must be resolved with the responsible owner before the affected criterion is accepted.

## 10. Current Status

This strategy is Proposed.

The IDs and pass/fail conditions define the intended verification baseline. The actual test framework, commands, environment, and CI workflow must be finalized as part of the relevant implementation decisions.

No test is reported as passing by virtue of being listed in this document. Results must be generated from the actual repository and reviewed before an increment is accepted.
