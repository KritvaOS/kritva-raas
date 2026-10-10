# B-INC-002 — IDENTITY-ORGANIZATION Acceptance Criteria

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-002 IDENTITY-ORGANIZATION Acceptance Criteria |
| Path | `docs/planning/backend/increments/B-INC-002-IDENTITY-ORGANIZATION/ACCEPTANCE_CRITERIA.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; DB-M02 CORE DATA where applicable |

## Related documents

- [Increment milestone](MILESTONE.md)
- [Increment tasks](TASKS.md)
- [Review checklist](REVIEW_CHECKLIST.md)
- [Test plan](TEST_PLAN.md)
- [Security review](SECURITY_REVIEW.md)
- [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Backend test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Backend security gate](../../BACKEND_SECURITY_GATE.md)
- [Backend task register](../../BACKEND_TASK_REGISTER.md)
- [Parent B-M01 milestone](../../../../backend/milestones/B-M01-CONTROL-PLANE/MILESTONE.md)

## 1. Purpose

This document is the single source of increment-level acceptance traceability for B-INC-002 IDENTITY-ORGANIZATION.

Each criterion has a unique `B-INC-002-AC-nn` identifier, measurable pass/fail conditions, required evidence, and explicit traces to the canonical backend acceptance criteria (`BAC-*`), backend test strategy (`BTS-*`), and security gates (`SEC-GATE-*`).

The canonical IDs and their meanings are owned by the respective program-level documents. This increment must not redefine them or invent replacements.

For every task in `TASKS.md`, the linked acceptance criteria are authoritative. Its `Linked tests` and `Linked security gates` fields must be the exact union of the corresponding traces in this document. If no canonical security gate applies to a criterion, its security-gate trace is `Not applicable`.

The criteria are proposed. None is considered passed until its pass condition is demonstrated and the required evidence is reviewed.

## 2. Acceptance rules

1. Every criterion must have a measurable pass condition and a corresponding fail condition.
2. Evidence must identify the tested revision and the scope actually examined.
3. Required tests must exercise the relevant implementation path; mocked tests alone do not prove required database enforcement.
4. Both permitted and denied behavior must be tested for authentication, authorization, organization membership, and tenant isolation.
5. Missing or unknown permission context must not grant access.
6. Client-supplied organization or tenant identifiers must not be treated as proof of authorization.
7. Database tenant enforcement must be verified against the approved database contract where required.
8. Real credentials, authentication tokens, private keys, and production identity material must not appear in source, fixtures, logs, or retained evidence.
9. A skipped, blocked, or unexecuted test is not a pass.
10. Required architecture, security, database, and QA review findings must have explicit dispositions.
11. The remaining B-INC-003 slices of shared test tasks must remain open after the B-INC-002 slice is accepted.
12. Acceptance of this increment does not establish completion of B-M01 CONTROL PLANE or any database milestone.

## 3. Acceptance criteria

### B-INC-002-AC-01 — Identity and principal model

- **Pass condition:** Identity and principal representations have explicit semantics for the approved authentication boundary, and the domain model is reviewed for consistency with the approved backend architecture.
- **Fail condition:** Principal identity is ambiguous, domain behavior depends on undocumented provider-specific details, or a required architecture decision remains silently assumed.
- **Evidence to retain:** Model/interface review, relevant decision references, and test results for the defined identity semantics.
- **Backend acceptance trace:** BAC-019, BAC-035.
- **Test trace:** BTS-017.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead and Architecture Owner.

### B-INC-002-AC-02 — User repository behavior

- **Pass condition:** UserRepository follows the approved persistence contract and has tests for representative lookup, absent-user, and persistence-error behavior.
- **Fail condition:** Repository behavior contradicts the approved schema, absent users are handled ambiguously, or the required persistence behavior is supported only by an unverified assumption.
- **Evidence to retain:** Repository tests, schema/contract reference, and sanitized results from the applicable database test environment.
- **Backend acceptance trace:** BAC-020.
- **Test trace:** BTS-019.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead and Database Technical Lead.

### B-INC-002-AC-03 — Provider-neutral authentication adapter

- **Pass condition:** The adapter follows the approved authentication contract and maps accepted authentication results to the application principal; invalid or missing authentication does not create an authenticated principal.
- **Fail condition:** Invalid credentials are accepted, authentication behavior is undefined, or application services bypass the approved adapter boundary.
- **Evidence to retain:** Adapter contract, positive/negative tests, and sanitized authentication-failure results.
- **Backend acceptance trace:** BAC-019.
- **Test trace:** BTS-017.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead with Security Owner review.

### B-INC-002-AC-04 — Current-user endpoint contract

- **Pass condition:** The current-user endpoint follows the approved REST API v1 contract, returns only approved principal attributes, and rejects missing or invalid authentication according to the contract.
- **Fail condition:** An unauthenticated request is accepted contrary to the contract, the response exposes unapproved fields, or endpoint behavior is not covered by contract/integration tests.
- **Evidence to retain:** Route and response schema, positive/negative API test results, and sanitized request/response examples.
- **Backend acceptance trace:** BAC-019, BAC-032.
- **Test trace:** BTS-017, BTS-032.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead.

### B-INC-002-AC-05 — Organization domain model

- **Pass condition:** The organization model has explicit identity, lifecycle, and ownership semantics and conforms to the approved backend architecture and DB-M01 organization contract.
- **Fail condition:** Organization semantics conflict with the approved schema, ownership is ambiguous, or project/platform responsibilities are silently introduced into this model.
- **Evidence to retain:** Model and schema mapping review, decision references, and relevant unit tests.
- **Backend acceptance trace:** BAC-020, BAC-035.
- **Test trace:** BTS-019.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead and Architecture Owner.

### B-INC-002-AC-06 — Organization repository integrity

- **Pass condition:** OrganizationRepository implements the approved persistence contract, and representative retrieval, absence, and failure behavior is tested against the applicable database environment.
- **Fail condition:** Repository operations bypass approved schema constraints, return incorrect ownership data, or have no reproducible persistence evidence.
- **Evidence to retain:** Repository tests, schema/contract reference, and sanitized database test results.
- **Backend acceptance trace:** BAC-020.
- **Test trace:** BTS-019.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead and Database Technical Lead.

### B-INC-002-AC-07 — Membership repository integrity

- **Pass condition:** MembershipRepository follows the approved membership schema and distinguishes valid membership, absent membership, and persistence failure. Membership cannot be inferred solely from untrusted request data.
- **Fail condition:** Membership lookup violates the approved relationship contract, unauthorized membership is assumed, or required integrity behavior is untested.
- **Evidence to retain:** Membership repository tests, schema/constraint references, and positive/negative results.
- **Backend acceptance trace:** BAC-020.
- **Test trace:** BTS-019.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead and Database Technical Lead.

### B-INC-002-AC-08 — Organization service authorization behavior

- **Pass condition:** OrganizationService applies the approved membership and authorization rules to protected use cases, and denied operations do not mutate state.
- **Fail condition:** A caller can access or modify an organization without the required membership/permission, or denial behavior is not verified.
- **Evidence to retain:** Service tests, permission/membership test matrix, and before/after state assertions for denied operations.
- **Backend acceptance trace:** BAC-020, BAC-021.
- **Test trace:** BTS-018, BTS-019.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead with Security Owner review.

### B-INC-002-AC-09 — Organization API contract and authorization

- **Pass condition:** Organization API operations follow the approved REST API v1 request, response, validation, and error contract. Protected operations enforce authorization and reject unauthorized organization access.
- **Fail condition:** A protected route permits access without required authorization, API behavior contradicts the approved contract, or integration behavior is unverified.
- **Evidence to retain:** API contract tests, sanitized request/response examples, denied-operation tests, and integration results.
- **Backend acceptance trace:** BAC-020, BAC-021, BAC-032.
- **Test trace:** BTS-018, BTS-019, BTS-032.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead with QA and Security review.

### B-INC-002-AC-10 — Role and permission model

- **Pass condition:** Roles, permissions, and the mapping used for authorization decisions are explicit, reviewed, and consistent with the approved security and architecture requirements.
- **Fail condition:** Permission meaning is ambiguous, unreviewed role mappings silently grant access, or missing/unknown permissions have an implicit allow behavior.
- **Evidence to retain:** Role/permission definitions, reviewed mapping, protected-operation inventory, and relevant tests.
- **Backend acceptance trace:** BAC-021.
- **Test trace:** BTS-018.
- **Security-gate trace:** Not applicable.
- **Owner:** Security Owner and Architecture Owner.

### B-INC-002-AC-11 — Default-deny authorization policy

- **Pass condition:** Protected operations require explicit authorization. Missing, unknown, or ungranted permissions deny access; authorized operations succeed under the approved permission mapping.
- **Fail condition:** An ungranted operation succeeds, a missing permission is interpreted as allow, or policy checks can be bypassed through an alternate application path.
- **Evidence to retain:** Positive/negative authorization matrix, automated test results, and policy review.
- **Backend acceptance trace:** BAC-021.
- **Test trace:** BTS-018.
- **Security-gate trace:** Not applicable.
- **Owner:** Security Owner with Backend Technical Lead and QA Owner.

### B-INC-002-AC-12 — Tenant-context derivation and integrity

- **Pass condition:** Tenant context is derived and enforced according to the approved authentication and authorization contract. Untrusted request fields, headers, query parameters, or route identifiers cannot override the authorized context.
- **Fail condition:** A caller can select another tenant without authorization, context is lost or inconsistently propagated, or tenant integrity is not tested.
- **Evidence to retain:** Context-propagation tests, negative override tests, and sanitized API/service results.
- **Backend acceptance trace:** BAC-022.
- **Test trace:** BTS-020, BTS-021.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead with Security Owner review.

### B-INC-002-AC-13 — Application and database tenant isolation

- **Pass condition:** Representative unauthorized cross-tenant reads and writes are rejected by the application, and required database tenant controls are verified against the approved database contract. Tests assert both response behavior and resulting persisted state.
- **Fail condition:** An unauthorized cross-tenant operation succeeds, required database enforcement is omitted, or isolation is claimed based only on mocked application tests where database enforcement is required.
- **Evidence to retain:** Isolation test matrix, controlled database setup, API results, before/after state assertions, and Database Technical Lead review.
- **Backend acceptance trace:** BAC-017, BAC-022.
- **Test trace:** BTS-020, BTS-021, BTS-022.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead, Database Technical Lead, and Security Owner.

### B-INC-002-AC-14 — Authorization test slice completed

- **Pass condition:** The B-INC-002 identity and organization slice of `KR-BE-1-044` covers permitted and denied operations, missing permissions, and organization/membership-related authorization behavior. Test results identify the B-INC-002 scope separately from the remaining B-INC-003 scope.
- **Fail condition:** Required negative cases are missing, results cannot be tied to the tested revision, or the shared task is incorrectly declared fully complete based only on this increment's slice.
- **Evidence to retain:** Test inventory, test command/results, revision, scope statement, findings, and retained B-INC-003 obligation.
- **Backend acceptance trace:** BAC-021, BAC-031.
- **Test trace:** BTS-018, BTS-019.
- **Security-gate trace:** Not applicable.
- **Owner:** QA Owner and Security Owner.

### B-INC-002-AC-15 — Tenant-isolation test slice completed

- **Pass condition:** The B-INC-002 identity and organization slice of `KR-BE-1-045` tests unauthorized cross-organization behavior at the required application and database boundaries. The B-INC-003 project-specific slice remains explicitly open.
- **Fail condition:** Tests omit required cross-tenant denial or database enforcement, or the shared task is marked fully accepted without the B-INC-003 slice.
- **Evidence to retain:** Isolation test matrix, database and application results, revision, scope statement, state assertions, and retained B-INC-003 obligation.
- **Backend acceptance trace:** BAC-017, BAC-031.
- **Test trace:** BTS-020, BTS-021, BTS-022.
- **Security-gate trace:** Not applicable.
- **Owner:** QA Owner, Database Technical Lead, and Security Owner.

### B-INC-002-AC-16 — Increment integration and test evidence

- **Pass condition:** Applicable identity and organization integration tests execute against the integrated application path. Test commands, revision, results, failures, and dispositions are recorded, and required evidence is reproducible.
- **Fail condition:** Integration is asserted from unit tests alone where an integrated path is required, required tests are skipped without disposition, or evidence does not identify the scope and revision.
- **Evidence to retain:** Integration test inventory, commands and exit codes, tested revision, sanitized output, findings, and review record.
- **Backend acceptance trace:** BAC-031, BAC-032.
- **Test trace:** BTS-032, BTS-036.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead and QA Owner.

### B-INC-002-AC-17 — Architecture, security, and documentation review

- **Pass condition:** Required architecture and security reviews are complete for this increment; developer/operational documentation reflects actual behavior; material findings have owners and dispositions; acceptance evidence is complete.
- **Fail condition:** Required review is missing, documentation describes unimplemented behavior as operational, or material findings/evidence gaps remain undispositioned.
- **Evidence to retain:** Signed review records, updated documentation, finding dispositions, and the completed acceptance matrix.
- **Backend acceptance trace:** BAC-034, BAC-035, BAC-037, BAC-038.
- **Test trace:** BTS-036.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead, Architecture Owner, Security Owner, Documentation Owner, and authorized acceptance authority.

### B-INC-002-AC-18 — Repository security hygiene and secret-safe evidence

- **Pass condition:** The reviewed increment introduces no prohibited secrets or security-key material. Examples, fixtures, logs, scanner/test output, and retained evidence use safe placeholders or synthetic values and meet the applicable backend-wide repository security requirements.
- **Fail condition:** A real credential or key is committed or retained in evidence, a required repository security check is missing from the applicable workflow, or a potential exposure lacks explicit disposition.
- **Evidence to retain:** Relevant scan/check results and configuration references, changed-file review, sanitized test evidence, and finding disposition. Never reproduce an actual secret in the evidence.
- **Backend acceptance trace:** BAC-007, BAC-009, BAC-010, BAC-013.
- **Test trace:** BTS-036.
- **Security-gate trace:** Not applicable.
- **Owner:** Security Owner and Repository/CI Owner, with Backend Technical Lead.

## 4. Mandatory blocking conditions

B-INC-002 cannot be accepted if any of the following remains true:

- Missing or invalid authentication is accepted contrary to the approved contract.
- A protected operation succeeds without the required permission.
- Organization membership or ownership is assumed from untrusted caller input.
- Tenant context can be overridden by an unauthorized caller.
- A required application or database tenant-isolation test fails or has not been run.
- Required database enforcement is claimed without evidence from the applicable database test environment.
- A required shared test slice is absent or is represented as completing the entire shared task.
- A required architecture, security, database, or QA review is missing.
- A mandatory BAC criterion applicable to this increment is failed, blocked, or lacks evidence.
- Real secrets or security-key material are introduced into tracked content or retained evidence.
- A material finding lacks an accountable owner and disposition.
- A test result or review is claimed without a recorded execution or review.

## 5. Acceptance record

Complete this table during review. `TBD` is an intentional pre-implementation state, not a pass.

| Criterion | Result | Evidence reference | Finding/issue | Reviewer | Date |
|---|---|---|---|---|---|
| B-INC-002-AC-01 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-02 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-03 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-04 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-05 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-06 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-07 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-08 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-09 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-10 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-11 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-12 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-13 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-14 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-15 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-16 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-17 | TBD | TBD | TBD | TBD | TBD |
| B-INC-002-AC-18 | TBD | TBD | TBD | TBD | TBD |

## 6. Status

**Status: Proposed.**

These criteria define the intended acceptance boundary. No criterion is marked passed until its complete pass condition is demonstrated and the required evidence is reviewed.
