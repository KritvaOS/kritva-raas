# B-INC-002 — IDENTITY-ORGANIZATION Security Review

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-002 IDENTITY-ORGANIZATION Security Review |
| Path | `planning/backend/increments/B-INC-002-IDENTITY-ORGANIZATION/SECURITY_REVIEW.md` |
| Status | Proposed |
| Owner role | Security Owner |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; DB-M02 CORE DATA where applicable |

## Related documents

- [Increment milestone](MILESTONE.md)
- [Increment tasks](TASKS.md)
- [Acceptance criteria and authoritative traces](ACCEPTANCE_CRITERIA.md)
- [Test plan](TEST_PLAN.md)
- [Review checklist](REVIEW_CHECKLIST.md)
- [Backend security gate](../../BACKEND_SECURITY_GATE.md)
- [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Backend test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Parent B-M01 milestone](../../../../docs/backend/milestones/B-M01-CONTROL-PLANE/MILESTONE.md)

## 1. Purpose

This document defines the security-review scope for B-INC-002 IDENTITY-ORGANIZATION. It identifies threats, required controls, evidence, and finding-disposition rules for authentication, identity, organization membership, authorization, and tenant isolation.

`ACCEPTANCE_CRITERIA.md` is the only source for this document's acceptance-criterion, canonical test, and backend acceptance trace mappings. This review must not invent or reassign `BAC-*`, `BTS-*`, or `SEC-GATE-*` definitions.

The acceptance criteria currently declare `Not applicable` for the canonical `SEC-GATE-*` trace. This does not exempt the increment from the backend-wide security invariant, applicable BAC requirements, or security review. It means no existing canonical security-gate ID is being asserted as a direct trace for these identity/organization criteria.

No finding is marked closed merely because a mitigation is planned. Findings remain Proposed until reviewed evidence supports a disposition.

## 2. Review scope

In scope:

- Identity and principal representation.
- Authentication adapter boundary.
- Current-user endpoint.
- User, organization, and membership persistence.
- Organization service and APIs.
- Role/permission model.
- Default-deny authorization policy.
- Tenant-context derivation and propagation.
- Application-level cross-tenant access prevention.
- Required database tenant enforcement.
- Authorization and tenant-isolation test slices.
- Test-data, logging, response, and evidence safety.
- Review evidence and finding disposition.

Out of scope for implementation in this increment:

- Project and platform-catalog authorization, assigned to B-INC-003.
- Transaction, idempotency, and audit implementation, assigned to B-INC-004.
- Production identity-provider deployment and production IAM owned by the relevant infrastructure workstream.
- Coding-agent policy tasks `KR-CA-022` through `KR-CA-026`, which remain deferred.

Out-of-scope work must not be claimed as completed by this security review.

## 3. Security-review rules

1. Treat authentication and authorization as separate controls.
2. Treat client-supplied organization or tenant identifiers as untrusted until authorized.
3. Use default-deny behavior for protected operations.
4. Test negative paths and verify the resulting persisted state.
5. Verify database enforcement against the approved DB-M01 contract wherever required.
6. Do not accept mocked tests as proof of real database enforcement.
7. Use synthetic identities and credentials in automated tests.
8. Do not place real credentials, tokens, private keys, or production identity material in source, fixtures, logs, or evidence.
9. Derive AC/BAC/BTS trace references from `ACCEPTANCE_CRITERIA.md`.
10. Record findings with an owner, priority, evidence, disposition, and residual risk.
11. Do not invent a `SEC-GATE-*` trace when the linked AC states `Not applicable`.
12. A mandatory authorization or tenant-isolation failure blocks acceptance regardless of the number of tests that pass.

## 4. Threat and control register

Priority indicates the proposed review urgency: `PRI-1` is the highest priority. The final priority and disposition must be confirmed by the Security Owner using the program's accepted finding-management convention.

### B-INC-002-SR-001 — Authentication boundary bypass

- **Phase:** P3 CONTROL PLANE
- **Priority:** PRI-1
- **Threat:** A request without valid authentication, or with an unacceptable authentication result, is treated as an authenticated principal.
- **Affected scope:** Authentication adapter, principal construction, current-user endpoint, and protected organization operations.
- **Acceptance trace:** B-INC-002-AC-01, B-INC-002-AC-03, B-INC-002-AC-04.
- **Backend acceptance trace:** BAC-019, BAC-032, BAC-035 as defined by the linked acceptance criteria.
- **Canonical test trace:** BTS-017, BTS-032, BTS-036 as applicable to the linked ACs.
- **Security-gate trace:** Not applicable.
- **Required controls:** Follow the approved authentication contract; reject missing and invalid authentication; prevent partially authenticated principals; keep provider-specific verification behind the approved adapter boundary.
- **Verification:** Positive and negative adapter tests, current-user API tests, and integrated authentication-boundary tests.
- **Evidence:** Sanitized test results, tested revision, adapter contract, and review record.
- **Owner:** Security Owner and Backend Technical Lead.
- **Disposition:** TBD.
- **Residual risk:** TBD.

### B-INC-002-SR-002 — Organization membership or ownership bypass

- **Phase:** P3 CONTROL PLANE
- **Priority:** PRI-1
- **Threat:** A caller gains access to an organization by supplying its identifier without valid membership or authorization.
- **Affected scope:** Organization model, repositories, service, and API.
- **Acceptance trace:** B-INC-002-AC-05, B-INC-002-AC-06, B-INC-002-AC-07, B-INC-002-AC-08, B-INC-002-AC-09.
- **Backend acceptance trace:** BAC-020, BAC-021, BAC-032, BAC-035 as defined by the linked acceptance criteria.
- **Canonical test trace:** BTS-018, BTS-019, BTS-032 as applicable to the linked ACs.
- **Security-gate trace:** Not applicable.
- **Required controls:** Enforce the approved membership and permission rules in protected operations; use the approved persistence contract; distinguish missing membership from infrastructure failure; reject unauthorized reads and writes.
- **Verification:** Authorized and unauthorized organization requests, absent-membership cases, and persisted-state assertions after denied mutations.
- **Evidence:** Test matrix, sanitized API results, relevant state assertions, and reviewed schema/contract references.
- **Owner:** Backend Technical Lead and Security Owner.
- **Disposition:** TBD.
- **Residual risk:** TBD.

### B-INC-002-SR-003 — Default-deny authorization failure

- **Phase:** P3 CONTROL PLANE
- **Priority:** PRI-1
- **Threat:** A protected operation succeeds when the caller has no permission, has an unknown permission, or reaches a code path that bypasses policy evaluation.
- **Affected scope:** Role/permission definitions, authorization policy layer, and organization operations.
- **Acceptance trace:** B-INC-002-AC-10, B-INC-002-AC-11, B-INC-002-AC-14.
- **Backend acceptance trace:** BAC-021, BAC-031, BAC-034, BAC-035 as defined by the linked acceptance criteria.
- **Canonical test trace:** BTS-018, BTS-019, BTS-036 as applicable to the linked ACs.
- **Security-gate trace:** Not applicable.
- **Required controls:** Require explicit permission decisions; deny on missing or unknown permission context; review role-to-permission mappings; enforce policy at the required application boundary.
- **Verification:** Positive and negative authorization matrix, missing/unknown-permission tests, and tests of protected paths within the increment's scope.
- **Evidence:** Policy review, automated results, tested revision, and disposition of authorization failures.
- **Owner:** Security Owner.
- **Disposition:** TBD.
- **Residual risk:** TBD.

### B-INC-002-SR-004 — Tenant-context spoofing or substitution

- **Phase:** P3 CONTROL PLANE
- **Priority:** PRI-1
- **Threat:** A caller selects or substitutes another tenant through a route identifier, request field, query parameter, header, or inconsistent context propagation.
- **Affected scope:** Tenant-context derivation, request/service propagation, and persistence access.
- **Acceptance trace:** B-INC-002-AC-12, B-INC-002-AC-13.
- **Backend acceptance trace:** BAC-017, BAC-022, BAC-034 as defined by the linked acceptance criteria.
- **Canonical test trace:** BTS-020, BTS-021, BTS-022 as applicable to the linked ACs.
- **Security-gate trace:** Not applicable.
- **Required controls:** Derive tenant context from trusted authentication/authorization state; reject unauthorized context changes; propagate context consistently; apply the approved database enforcement.
- **Verification:** Attempt context substitution through every applicable accepted input path; verify denial and no unintended state change; test required database controls.
- **Evidence:** Context-integrity tests, isolation matrix, controlled database results, and review record.
- **Owner:** Backend Technical Lead, Security Owner, and Database Technical Lead.
- **Disposition:** TBD.
- **Residual risk:** TBD.

### B-INC-002-SR-005 — Database tenant-isolation gap

- **Phase:** P3 CONTROL PLANE
- **Priority:** PRI-1
- **Threat:** Application-level authorization is present, but required database-level tenant enforcement is missing, misconfigured, or not exercised by the tests.
- **Affected scope:** Tenant-aware repository operations and approved DB-M01 controls.
- **Acceptance trace:** B-INC-002-AC-13, B-INC-002-AC-15.
- **Backend acceptance trace:** BAC-017, BAC-031, BAC-034 as defined by the linked acceptance criteria.
- **Canonical test trace:** BTS-020, BTS-021, BTS-022, BTS-036 as applicable to the linked ACs.
- **Security-gate trace:** Not applicable.
- **Required controls:** Identify required database controls from the approved contract; test the relevant database configuration and operations; review isolation evidence with the Database Technical Lead.
- **Verification:** Cross-tenant read/write tests against the applicable database environment, with before/after state assertions. Mocks alone are insufficient.
- **Evidence:** Database setup and schema/policy references, test results, sanitized state assertions, and reviewer confirmation.
- **Owner:** Database Technical Lead and Security Owner.
- **Disposition:** TBD.
- **Residual risk:** TBD.

### B-INC-002-SR-006 — Sensitive identity data disclosure

- **Phase:** P3 CONTROL PLANE
- **Priority:** PRI-1
- **Threat:** Current-user or organization API responses, errors, or logs disclose credentials, token contents, or identity/organization fields not approved for disclosure.
- **Affected scope:** Authentication adapter, current-user endpoint, organization APIs, and failure/logging paths.
- **Acceptance trace:** B-INC-002-AC-03, B-INC-002-AC-04, B-INC-002-AC-09, B-INC-002-AC-18.
- **Backend acceptance trace:** BAC-019, BAC-032, BAC-007, BAC-009, BAC-010, BAC-013 as defined by the linked acceptance criteria.
- **Canonical test trace:** BTS-017, BTS-032, BTS-036 as applicable to the linked ACs.
- **Security-gate trace:** Not applicable.
- **Required controls:** Limit response fields to the approved contract; sanitize failure output; keep credentials out of logs and fixtures; review evidence for sensitive values.
- **Verification:** Response-schema assertions, negative-path tests, and inspection of sanitized logs and retained test artifacts.
- **Evidence:** API contract results, reviewed response schemas, and evidence-safety check.
- **Owner:** Backend Technical Lead and Security Owner.
- **Disposition:** TBD.
- **Residual risk:** TBD.

### B-INC-002-SR-007 — Unsafe identity or organization persistence behavior

- **Phase:** P3 CONTROL PLANE
- **Priority:** PRI-2
- **Threat:** Incorrect repository behavior, ambiguous absence/error handling, or schema-contract mismatch undermines membership and authorization decisions.
- **Affected scope:** UserRepository, OrganizationRepository, MembershipRepository, and their services.
- **Acceptance trace:** B-INC-002-AC-02, B-INC-002-AC-05, B-INC-002-AC-06, B-INC-002-AC-07, B-INC-002-AC-08.
- **Backend acceptance trace:** BAC-020, BAC-021, BAC-035 as defined by the linked acceptance criteria.
- **Canonical test trace:** BTS-017, BTS-018, BTS-019 as applicable to the linked ACs.
- **Security-gate trace:** Not applicable.
- **Required controls:** Follow approved persistence contracts; distinguish absent records from infrastructure failures; preserve required constraints; test repository behavior and denied mutations.
- **Verification:** Repository and service tests against the applicable schema and controlled database environment.
- **Evidence:** Test results, schema references, and reviewed failure behavior.
- **Owner:** Backend Technical Lead and Database Technical Lead.
- **Disposition:** TBD.
- **Residual risk:** TBD.

### B-INC-002-SR-008 — Incomplete negative-test coverage or misleading acceptance

- **Phase:** P3 CONTROL PLANE
- **Priority:** PRI-2
- **Threat:** Passing happy-path tests conceal authorization or tenant-isolation defects, or the shared authorization/tenant-isolation tasks are marked complete without all assigned slices.
- **Affected scope:** Shared tasks `KR-BE-1-044` and `KR-BE-1-045`, integration tests, and acceptance evidence.
- **Acceptance trace:** B-INC-002-AC-14, B-INC-002-AC-15, B-INC-002-AC-16, B-INC-002-AC-17, B-INC-002-AC-18.
- **Backend acceptance trace:** BAC-017, BAC-021, BAC-031, BAC-032, BAC-034, BAC-035, BAC-037, BAC-038 as defined by the linked acceptance criteria.
- **Canonical test trace:** BTS-018, BTS-019, BTS-020, BTS-021, BTS-022, BTS-032, BTS-036 as applicable to the linked ACs.
- **Security-gate trace:** Not applicable.
- **Required controls:** Maintain AC-to-test traceability; test allowed and denied behavior; record the tested revision and scope; preserve the remaining B-INC-003 obligations; keep blocked and unrun results distinct from passes.
- **Verification:** Review the test matrix, executed results, shared-task slice record, and acceptance evidence.
- **Evidence:** Test report, revision and scope record, review checklist, and completed acceptance matrix.
- **Owner:** QA Owner and Security Owner.
- **Disposition:** TBD.
- **Residual risk:** TBD.

## 5. Finding priority and disposition

Use the program's established priority convention and record a rationale for each finding. The proposed priorities above are starting classifications and require Security Owner confirmation.

| Priority | Review expectation |
|---|---|
| PRI-1 | Critical security boundary or tenant-isolation risk. Must block acceptance until corrected and verified, unless the governing program explicitly permits an alternative disposition that does not weaken mandatory security requirements. |
| PRI-2 | Material security or assurance gap requiring explicit owner, remediation plan, and review. It blocks acceptance when it prevents a mandatory AC from passing or leaves a material authorization/isolation risk unresolved. |
| PRI-3 | Lower-priority issue that still requires an explicit owner and disposition. It cannot be used to waive a mandatory acceptance requirement. |

Permitted finding statuses should follow the repository's established issue convention. At minimum, each finding must distinguish open, blocked, mitigated pending verification, and closed after verification.

A finding is not closed until the reviewer has inspected the mitigation and evidence. A test that was not run cannot establish mitigation effectiveness.

## 6. Security evidence requirements

Retain, as applicable:

- Reviewed authentication and authorization contracts.
- Role/permission mapping review.
- Positive and negative authorization results.
- Tenant-context substitution test results.
- Cross-tenant read/write test results.
- Required database-enforcement evidence.
- Persisted-state assertions for denied mutations.
- Sanitized API response and failure-output checks.
- Test revision, commands, actual exit status, and results.
- Finding owner, priority, disposition, verification evidence, and reviewer.

Do not retain actual credentials, tokens, private keys, production identity material, or unnecessary sensitive personal data. A report must not reproduce the secret it is intended to track.

## 7. Relationship to canonical security gates

The increment acceptance criteria currently map the listed ACs to `Not applicable` for canonical `SEC-GATE-*` traces. Consequently, the threat register does not invent a later-increment security-gate ID.

The backend-wide security invariant and applicable BAC criteria remain binding. Repository-wide secret scanning, blocking CI, and other B-INC-001 gate implementations remain owned by the applicable foundation and program controls; B-INC-002 must preserve and comply with them.

If an approved future change introduces a new canonical security gate, the program-level security-gate authority must define it first. This document must not assign a new meaning to an existing ID.

## 8. Review record

| Field | Value |
|---|---|
| Security reviewer | TBD |
| Review date | TBD |
| Tested revision | TBD |
| Findings opened | TBD |
| Findings closed with evidence | TBD |
| Blocking findings remaining | TBD |
| Database Technical Lead review | TBD |
| QA review | TBD |
| Evidence location | TBD |
| Overall security disposition | TBD |

## 9. Status

**Status: Proposed.**

This register identifies threats and planned verification. It does not assert that controls have been implemented, tested, or accepted. Every finding requires evidence-based review and disposition.
