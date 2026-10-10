# Backend Acceptance Criteria

## Document Control

| Field | Value |
|---|---|
| Document | Backend Acceptance Criteria |
| Path | `docs/planning/backend/BACKEND_ACCEPTANCE_CRITERIA.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; DB-M02 CORE DATA; B-M03 PLATFORM; C-M01 FOUNDATION |

## 1. Purpose

This document defines the measurable acceptance gates for the Kritva RaaS backend implementation.

Each criterion has a unique identifier, a binary pass/fail condition, required evidence, and an explicit blocking increment or milestone. The criteria are intended to make acceptance auditable and prevent a task, increment, or milestone from being declared complete solely because code exists or a commit was created.

This document provides the backend-wide acceptance baseline. Increment-specific acceptance requirements must be defined in the relevant increment dossier and must not weaken these criteria or the authoritative requirements in the existing milestone dossiers.

## 2. Acceptance Principles

1. Acceptance is evidence-based.
2. A criterion passes only when its complete pass condition is demonstrated.
3. A criterion that is untested, blocked, or missing evidence is not passed.
4. Mandatory security and tenant-isolation requirements cannot be waived by a local implementation decision.
5. Cross-workstream dependencies must be verified against the responsible workstream's deliverables.
6. A test result must identify the repository revision and the scope actually tested.
7. Findings must have explicit dispositions; unresolved mandatory failures block acceptance.
8. Increment acceptance does not automatically establish official milestone completion.
9. Official milestone acceptance remains governed by the corresponding milestone dossier.
10. No acceptance report may claim a scan, test, review, or deployment verification that was not actually executed and inspected.

## 3. Acceptance Status Vocabulary

| Status | Definition |
|---|---|
| Pass | The complete pass condition is demonstrated and the required evidence has been reviewed. |
| Fail | Evidence demonstrates that the pass condition is not satisfied. |
| Blocked | A dependency, decision, or required environment prevents valid verification. |
| Not run | No valid execution result is available. |
| Accepted | The authorized owner has reviewed the evidence and approved the criterion or applicable acceptance scope. |
| Deferred | The relevant owner has explicitly postponed the criterion where deferral is permitted; the criterion is not treated as passed. |

A mandatory criterion in Fail, Blocked, or Not run status prevents acceptance of the increment it blocks.

A deferred criterion does not satisfy a mandatory acceptance requirement unless the authoritative milestone explicitly permits that deferral and the authorized owner has approved it. The no-secrets-in-repository invariant cannot be deferred or waived.

## 4. Backend-Wide Acceptance Criteria

### 4.1 Application foundation

| ID | Criterion and pass/fail condition | Evidence to retain | Blocking increment |
|---|---|---|---|
| BAC-001 | **Reproducible application setup. PASS:** a clean checkout can install dependencies, validate configuration, and execute the documented foundation tests using the approved setup instructions. **FAIL:** an undocumented manual change or unavailable prerequisite prevents reproducible execution. | Revision, approved runtime/tool versions, setup commands, dependency-install result, and test summary. | B-INC-001 |
| BAC-002 | **Approved application architecture. PASS:** architecture review confirms that implemented modules and dependencies follow the approved backend boundaries. **FAIL:** a required boundary is violated without an approved decision. | Architecture review checklist, dependency inspection, finding dispositions, and reviewer record. | B-INC-001 |
| BAC-003 | **Configuration and startup safety. PASS:** automated tests demonstrate that invalid required configuration fails according to the documented startup/readiness contract without disclosing secret values. **FAIL:** invalid configuration is silently accepted or sensitive values appear in failure output. | Configuration tests, startup/readiness results, and sanitized logs. | B-INC-001 |
| BAC-004 | **REST API v1 foundation. PASS:** implemented routes use the approved routing, validation, error, and request-correlation conventions; contract tests cover the foundation endpoints. **FAIL:** required endpoints or errors violate the approved API contract. | API contract test results, route inventory, and sanitized request/response examples. | B-INC-001 |
| BAC-005 | **Health and readiness. PASS:** health and readiness behavior is documented and tested, including the required behavior when a mandatory dependency is unavailable. **FAIL:** the service reports readiness contrary to the approved contract. | Controlled dependency tests, endpoint results, and relevant operational documentation. | B-INC-001 |
| BAC-006 | **Structured and safe logging. PASS:** representative success and failure paths emit the required structured fields and redact synthetic credential values. **FAIL:** required fields are missing or tested sensitive values are exposed. | Logging tests, schema assertions, and sanitized sample output. | B-INC-001 |

### 4.2 Repository and security acceptance

| ID | Criterion and pass/fail condition | Evidence to retain | Blocking increment |
|---|---|---|---|
| BAC-007 | **No prohibited secrets in the repository. PASS:** the required working-tree and agreed history scans have been run, findings are investigated and dispositioned, and no unresolved actual secret or security-key material remains in the relevant repository scope. **FAIL:** prohibited material remains or the required scan evidence is missing. | Scanner versions, commands/configuration, revision and ref scope, safe findings summary, remediation evidence, and reviewed rescan results. | B-INC-001 and every later increment |
| BAC-008 | **Sensitive-file protection. PASS:** reviewed ignore rules cover the approved local secret files and sensitive generated outputs, and inspection confirms that already tracked files are not assumed safe merely because ignore rules exist. **FAIL:** required protection is missing or known tracked sensitive material is unaddressed. | Ignore-rule review, representative filename checks, tracked-file inspection, and findings disposition. | B-INC-001 |
| BAC-009 | **Safe examples and fixtures. PASS:** committed examples, fixtures, snapshots, and test configuration contain no actual credentials or private key material and use unmistakable nonfunctional placeholders. **FAIL:** any prohibited real value is included. | Source/fixture review, automated checks where available, and sanitized test results. | B-INC-001 and every later increment |
| BAC-010 | **Blocking secret scanning. PASS:** the required CI check runs automatically, fails on a confirmed synthetic secret finding, fails closed on scanner execution/configuration errors, and does not disclose the synthetic value in logs. **FAIL:** the check is missing, optional, bypassed by default, or demonstrated only with a clean repository. | Workflow configuration, required-check settings, synthetic finding result, scanner-failure result, and sanitized CI logs. | B-INC-001 and every later increment |
| BAC-011 | **History-scan scope and exposure disposition. PASS:** the relevant history and refs have been scanned within a documented scope, limitations are recorded, and every finding has an explicit disposition. **FAIL:** the claimed scope exceeds the actual scan or a suspected exposure remains unassessed. | Ref/commit inventory, scan configuration, safe results, findings and dispositions, and limitations. | B-INC-001 |
| BAC-012 | **Secret-exposure response. PASS:** the documented response procedure identifies ownership, assessment, revocation or rotation where appropriate, remediation, and verification, and its operation has been reviewed or exercised. **FAIL:** the response procedure is incomplete or cannot be followed. | Approved procedure, review/tabletop record, and tracked follow-up actions. | B-INC-001 |
| BAC-013 | **Secret-safe evidence. PASS:** scanner reports, test results, logs, and retained diagnostics contain no actual secret values and identify the scope needed to evaluate their claims. **FAIL:** retained evidence exposes prohibited values or cannot support its acceptance claim. | Evidence review, sanitized artifacts, revision metadata, and reviewer record. | B-INC-001 and every later increment |

The baseline scan reported at commit `2c51027` is historical evidence supplied for planning. It does not satisfy these criteria by itself because the reported credential-bearing local-development example still requires replacement and rescan, and automated blocking enforcement was not established at that baseline.

### 4.3 Database foundation and integrity

| ID | Criterion and pass/fail condition | Evidence to retain | Blocking increment |
|---|---|---|---|
| BAC-014 | **Database connectivity. PASS:** integration tests verify the required PostgreSQL connection and a representative foundation operation using test credentials supplied outside tracked files. **FAIL:** database integration depends on committed credentials or has not been exercised. | Environment description without credentials, test command, result, and cleanup outcome. | B-INC-001 |
| BAC-015 | **Migration baseline. PASS:** the approved migration procedure applies the required foundation migrations to a clean test database and produces the expected schema. **FAIL:** migration execution fails or schema verification does not match the approved baseline. | Migration tool/version, commands, clean-database result, and schema verification. | B-INC-001 prerequisite and B-INC-004 |
| BAC-016 | **Database transaction behavior. PASS:** tests demonstrate rollback and atomicity wherever the approved transaction contract requires them. **FAIL:** an injected failure leaves unintended partial state. | Failure-injection test, before/after state, and test result. | B-INC-004 |
| BAC-017 | **Tenant-isolation enforcement. PASS:** application and required database controls reject representative unauthorized cross-tenant operations without unintended data access or mutation. **FAIL:** a tested unauthorized cross-tenant operation succeeds. | Isolation test matrix, database setup, API results, state assertions, and reviewed findings. | B-INC-002 |
| BAC-018 | **Migration and persistence regression coverage. PASS:** required migration and persistence tests execute against the approved database test environment and their failures block the applicable acceptance. **FAIL:** required tests are missing, skipped without approval, or nonblocking. | Test inventory, commands, environment, results, and CI configuration. | B-INC-001 prerequisite and B-INC-004 |

Database ownership remains governed by DB-M01 FOUNDATION and any applicable later database milestone. Passing the backend's migration integration tests does not establish acceptance of all database milestone deliverables.

### 4.4 Identity and authorization

| ID | Criterion and pass/fail condition | Evidence to retain | Blocking increment |
|---|---|---|---|
| BAC-019 | **Authentication boundary. PASS:** authentication behavior matches the approved contract for valid, missing, and invalid test credentials. **FAIL:** invalid or absent credentials are accepted contrary to the contract. | Synthetic test identities, API results, and sanitized failure output. | B-INC-002 |
| BAC-020 | **Organization and membership integrity. PASS:** organization and membership operations enforce their approved ownership and membership rules in positive and negative tests. **FAIL:** an unauthorized principal can perform a protected operation. | Test matrix, synthetic identities, persisted-state assertions, and results. | B-INC-002 |
| BAC-021 | **Default-deny authorization. PASS:** operations without the required permission are rejected, and authorized operations succeed under the defined policy. **FAIL:** an ungranted operation succeeds. | Permission matrix, positive/negative test results, and review evidence. | B-INC-002 |
| BAC-022 | **Tenant-context integrity. PASS:** tenant context is derived and enforced according to the approved authentication and authorization contract; untrusted request data cannot bypass that enforcement. **FAIL:** a request can select another tenant without authorization. | Context tests, cross-tenant test cases, and sanitized API results. | B-INC-002 |

### 4.5 Projects and platform catalog

| ID | Criterion and pass/fail condition | Evidence to retain | Blocking increment |
|---|---|---|---|
| BAC-023 | **Project ownership and access. PASS:** project operations enforce organization ownership and reject unauthorized reads and writes. **FAIL:** cross-tenant access or mutation succeeds. | Project fixtures, API tests, before/after state, and results. | B-INC-003 |
| BAC-024 | **Project metadata boundary. PASS:** project APIs accept and return only the approved metadata contract and do not become an unintended path for source-code or credential storage. **FAIL:** prohibited source or credential payloads are persisted or returned. | Schema and contract review, payload-rejection tests, and response inspection. | B-INC-003 |
| BAC-025 | **Platform-catalog ownership and contract. PASS:** platform-catalog behavior conforms to its approved milestone boundary, API contract, and persistence contract. **FAIL:** an implementation crosses milestone ownership without approval or violates the contract. | Scope mapping, contract tests, schema references, and architecture review. | B-INC-003 |
| BAC-026 | **Platform-administration authorization. PASS:** protected catalog operations reject principals lacking the required administrative permission. **FAIL:** an unprivileged principal can perform a protected operation. | Synthetic principals, permission tests, API results, and state assertions. | B-INC-003 |

B-M03 PLATFORM remains authoritative for work assigned to that milestone. A B-INC-003 mapping does not reassign its scope.

### 4.6 Audit and idempotency

| ID | Criterion and pass/fail condition | Evidence to retain | Blocking increment |
|---|---|---|---|
| BAC-027 | **Required audit coverage. PASS:** every operation identified by the approved audit scope produces the required audit record with the expected outcome and fields. **FAIL:** any mandatory operation lacks its required audit record. | Operation-to-event matrix, persisted audit assertions, and test results. | B-INC-004 |
| BAC-028 | **Audit data protection. PASS:** audit records exclude passwords, tokens, private key material, and prohibited sensitive payloads in the tested scenarios. **FAIL:** any tested prohibited value is persisted. | Synthetic test cases, record assertions, and sanitized output. | B-INC-004 |
| BAC-029 | **Idempotency behavior. PASS:** equivalent retries and conflicting reuse of an idempotency key follow the approved API contract and do not cause unintended duplicate effects. **FAIL:** replay or conflict behavior violates the contract. | Request sequences, response comparisons, persisted-state checks, and results. | B-INC-004 |
| BAC-030 | **Audit and transaction consistency. PASS:** controlled failure tests demonstrate the required relationship between business-operation success, transaction outcome, and audit persistence. **FAIL:** the observed behavior contradicts the approved contract. | Failure-injection tests, persisted-state assertions, and contract references. | B-INC-004 |

### 4.7 Testing, reviews, and documentation

| ID | Criterion and pass/fail condition | Evidence to retain | Blocking increment |
|---|---|---|---|
| BAC-031 | **Required automated tests. PASS:** all mandatory tests assigned to the increment have executed successfully, and no required test is silently skipped or excluded. **FAIL:** a mandatory test fails, is unrun, or lacks evidence. | Test inventory, commands, revision, results, and exception/failure dispositions. | Every increment |
| BAC-032 | **API integration verification. PASS:** tests exercise the HTTP layer, service layer, and required persistence components together for the increment's approved operations. **FAIL:** required integrated behavior is unverified or fails. | Scenario inventory, environment, results, and sanitized diagnostics. | Every increment, scoped to its operations |
| BAC-033 | **End-to-end verification. PASS:** the applicable approved primary product path has reproducible verification for its required integrated backend interactions, with mocks and external dependencies identified accurately. **FAIL:** a required interaction is unverified or simulated behavior is represented as a real integration. | Scenario, component map, revision, environment, results, and limitations. | Relevant increment and B-M01 CONTROL PLANE acceptance |
| BAC-034 | **Security review. PASS:** required security findings have explicit disposition, mandatory security criteria pass, and no unresolved prohibited-secret finding remains. **FAIL:** a mandatory finding remains unresolved or required review evidence is missing. | Security checklist, scanner evidence, finding register, remediation, and reviewer disposition. | Every increment |
| BAC-035 | **Architecture review. PASS:** required architecture findings are resolved or explicitly dispositioned by the authorized owner, without unapproved changes to ownership or public contracts. **FAIL:** a blocking architecture violation remains. | Review checklist, decision references, and finding dispositions. | Every increment |
| BAC-036 | **Performance baseline. PASS:** the required workload and environment are documented, measurements are reproducible, and the evidence is reviewed against the existing milestone's requirements. **FAIL:** required measurements or analysis are missing. | Workload, environment, commands, measurements, limitations, and review record. | B-INC-001 foundation evidence and B-M01 CONTROL PLANE acceptance |
| BAC-037 | **Operational and developer documentation. PASS:** setup, configuration, test execution, API behavior, failure handling, and relevant security controls are documented and match observed implementation behavior. **FAIL:** required instructions are missing or materially inaccurate. | Documentation review, validation commands, and review findings. | Every increment |
| BAC-038 | **Acceptance evidence completeness. PASS:** every mandatory criterion for the increment has an evidence reference and recorded status; unresolved blockers are visible and acceptance is not claimed while they remain. **FAIL:** a required criterion has missing evidence or an undisclosed failure. | Completed acceptance matrix, evidence index, finding dispositions, and reviewer record. | Every increment |

## 5. B-INC-001 SECURE FOUNDATION Acceptance Gate

B-INC-001 may be proposed for acceptance only when all applicable B-INC-001 criteria in this document and the security and testing gate documents pass.

The following foundation-specific conditions are mandatory:

1. The selected runtime, language version, package manager, HTTP framework, migration tool, and secret scanner are recorded in reviewed decisions.
2. The application can be set up and tested from a clean checkout using the documented procedure.
3. Configuration, HTTP/API foundation, request context, correlation, validation, error behavior, health, and readiness are implemented and tested.
4. Structured logging is verified not to expose synthetic credentials.
5. PostgreSQL connectivity and the required migration baseline are verified in the approved test environment.
6. The reported credential-bearing local-development example has been replaced and the relevant working tree and history have been rescanned.
7. Repository ignore rules and safe configuration examples are implemented and reviewed.
8. Local detection is demonstrated where supported, or its limitation is explicitly approved while mandatory CI enforcement remains required.
9. Blocking CI secret scanning is configured and demonstrated with a synthetic finding.
10. History-scan coverage, findings, limitations, and dispositions are documented.
11. The secret-exposure response procedure is documented and reviewed or exercised.
12. Required foundation unit, contract, integration, and security tests pass.
13. Architecture and security review evidence is retained.
14. Required performance-baseline work is completed to the scope defined by the authoritative B-M01 requirements, or the milestone owner explicitly records a permitted deferral.
15. The acceptance matrix and documentation are complete, with no unresolved mandatory blocker.

A manual clean scan alone cannot satisfy the repository security gate. The required automated enforcement must be demonstrated.

## 6. B-INC-002 IDENTITY-ORGANIZATION Acceptance Gate

B-INC-002 may be proposed for acceptance only when its detailed dossier is approved and the following conditions are satisfied:

1. The authentication boundary matches the approved contract.
2. User, organization, and membership behavior is implemented and tested.
3. Role and permission semantics are explicit and enforced.
4. Default-deny behavior is demonstrated by negative tests.
5. Application-level tenant isolation is verified.
6. Required database-level tenant protection is verified.
7. Tenant context cannot be overridden by an unauthorized request.
8. Tests demonstrate that unauthorized operations do not mutate protected state.
9. Required security and architecture reviews are complete.
10. No prohibited secret or security-key material has been introduced into tracked files.
11. Evidence is accepted by the relevant owners.

B-INC-002 acceptance does not automatically accept DB-M01 FOUNDATION or another official milestone.

## 7. B-INC-003 PROJECTS-PLATFORM-CATALOG Acceptance Gate

B-INC-003 may be proposed for acceptance only when its detailed dossier is approved and the following conditions are satisfied:

1. Project metadata follows the approved schema and API contract.
2. Project access is organization-scoped and authorization is enforced.
3. Cross-tenant reads and writes are rejected in tests.
4. Project APIs do not persist or return prohibited source-code or credential payloads.
5. Platform-catalog scope and ownership are reconciled with B-M03 PLATFORM.
6. Platform-catalog APIs and validation follow the approved contract.
7. Platform-administration permissions are tested with authorized and unauthorized principals.
8. Required unit, contract, integration, and security tests pass.
9. Required architecture and security reviews are complete.
10. No prohibited secret or security-key material has been introduced into tracked files.
11. Acceptance evidence is reviewed by the relevant owners.

## 8. B-INC-004 AUDIT-TRANSACTIONS-IDEMPOTENCY Acceptance Gate

B-INC-004 may be proposed for acceptance only when its detailed dossier is approved and the following conditions are satisfied:

1. The required transaction-boundary pattern is implemented and documented.
2. Controlled failure tests demonstrate the expected rollback behavior.
3. Idempotent retries follow the approved contract.
4. Conflicting idempotency-key reuse follows the approved conflict behavior.
5. All required audit events are verified.
6. Audit records exclude prohibited secret and sensitive payload values.
7. Audit-persistence failure behavior matches the approved transaction and audit contract.
8. Required migration, integration, replay, and failure-path tests pass.
9. Required security and architecture reviews are complete.
10. No prohibited secret or security-key material has been introduced into tracked files.
11. The acceptance matrix contains reviewed evidence for all mandatory criteria.

## 9. B-M01 CONTROL PLANE Milestone Acceptance

B-M01 CONTROL PLANE is accepted only when the authoritative B-M01 milestone dossier's acceptance requirements are satisfied.

The increment-level acceptance gates in this document provide supporting evidence but do not replace the official milestone criteria.

Before B-M01 acceptance, the milestone owner must confirm that:

- The existing B-M01 tasks are completed or dispositioned according to the authoritative milestone rules.
- Required API, identity, organization, authorization, tenant-isolation, project, and platform-catalog behavior is implemented to the milestone's approved scope.
- Transaction, idempotency, audit, migration, and test obligations required by the milestone are satisfied.
- Required unit, contract, integration, authorization, tenant-isolation, migration, audit, and end-to-end tests have the required evidence.
- Security and architecture reviews are complete.
- The required performance baseline is available and reviewed.
- Documentation and acceptance evidence are complete.
- The mandatory repository security gate passes.
- Coding-agent policy work is included only to the extent authorized by the approved scope and required decision gates; unresolved gated work is not silently treated as complete.
- Cross-workstream dependencies have been accepted by the responsible owners where their deliverables are prerequisites.
- No mandatory acceptance criterion remains failed, blocked, or unrun.

The official milestone owner must record the acceptance decision and its evidence references.

## 10. Cross-Workstream Acceptance Boundaries

| Workstream | Required acceptance boundary | Evidence owner |
|---|---|---|
| Backend | Application behavior, APIs, configuration, authorization, services, and backend tests within approved scope | Backend Technical Lead |
| Database | Schemas, migrations, transaction requirements, and database tenant-isolation controls assigned to the database milestone | Database Technical Lead |
| Cloud | IAM, workload identities, secret-manager integration, production infrastructure, and deployment controls assigned to the cloud milestone | Cloud/Infrastructure Owner |
| Frontend/Studio | Client-side contract integration and behavior within the approved interface boundary | Frontend Technical Lead |
| Security | Repository protection, secret scanning, finding disposition, logging safety, and applicable security review | Security Owner |
| Repository/CI | Required checks, scanner execution, branch-protection enforcement, and retained CI evidence | Repository/CI Owner |
| Coding-agent integration | Policy behavior, provider metadata, persistence boundaries, and decision-gated functionality | Coding-Agent Architecture Owner |

Backend acceptance must not claim that a dependency is complete based solely on the presence of its interface or configuration. The responsible owner must provide evidence for the relevant deliverable.

## 11. Evidence Retention Requirements

Acceptance evidence must be sufficient for an independent reviewer to reproduce or inspect the claim.

At minimum, the acceptance record must contain:

- Criterion ID.
- Implementing task ID or relevant change reference.
- Tested repository revision.
- Test or review procedure.
- Environment and relevant tool versions.
- Expected and actual results.
- Evidence location or retained artifact reference.
- Finding disposition.
- Reviewer role and decision.
- Any limitations affecting the claim.

For security scanning, also retain the scanner configuration, scanned refs and history scope, safe summary of results, and disposition of findings.

Evidence must not reproduce actual secrets, private keys, access tokens, passwords, credential-bearing URLs, or prohibited production data.

If evidence cannot be retained safely, record the limitation and provide a sanitized alternative that still supports independent verification. Do not claim a pass when the available evidence cannot establish the criterion.

## 12. Finding Disposition and Exceptions

A failed criterion must be tracked to resolution or to a formally permitted disposition under the authoritative requirement.

For each finding, record:

- Finding ID or stable reference.
- Affected criterion and task.
- Severity or acceptance impact.
- Reproduction or evidence reference.
- Owner role.
- Remediation or disposition.
- Verification procedure.
- Final status.

A false positive must be supported by evidence and handled through the approved exception process. The exception must not include the secret value or create a broad scanner suppression.

No exception may authorize committing actual credentials or security-key material. A suspected real exposure requires assessment and, where appropriate, revocation or rotation, remediation, and verification.

A schedule or resource constraint is not evidence that a failed criterion is acceptable.

## 13. Final Acceptance Decision

The relevant increment or milestone owner must make the final acceptance decision based on the complete evidence set.

The decision record must state:

- The increment or milestone being accepted.
- The repository revision assessed.
- The criteria included in the acceptance scope.
- The pass/fail status of each mandatory criterion.
- The evidence references reviewed.
- The outstanding findings and their authorized dispositions.
- Any explicitly permitted limitations.
- The owner role responsible for the decision.

Acceptance must be withheld if a mandatory criterion has not passed or its evidence is unavailable.

## 14. Current Status

This document is Proposed.

The criteria define the intended acceptance baseline; they do not assert that implementation, CI enforcement, tests, reviews, or security scans have already passed.

The supplied scan at `2c51027` remains a manual baseline. Its reported local-development database URL finding must be remediated and rescanned, and repository-level secret protection and blocking CI enforcement must be implemented and demonstrated before B-INC-001 can pass the applicable security acceptance criteria.

B-INC-002 through B-INC-004 remain subject to their future detailed dossiers and the required contract, schema, and architecture decisions.

The next acceptance step is to review these criteria against the existing B-M01 CONTROL PLANE and DB-M01 FOUNDATION dossiers, then map each applicable criterion to an existing task or an approved new task without creating duplicate task identifiers.
