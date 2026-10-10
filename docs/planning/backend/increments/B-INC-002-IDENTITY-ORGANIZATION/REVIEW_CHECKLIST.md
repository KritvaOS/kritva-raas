# B-INC-002 — IDENTITY-ORGANIZATION Review Checklist

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-002 IDENTITY-ORGANIZATION Review Checklist |
| Path | `docs/planning/backend/increments/B-INC-002-IDENTITY-ORGANIZATION/REVIEW_CHECKLIST.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; DB-M02 CORE DATA where applicable |

## Related documents

- [Increment milestone](MILESTONE.md)
- [Increment tasks](TASKS.md)
- [Increment acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Test plan](TEST_PLAN.md)
- [Security review](SECURITY_REVIEW.md)
- [Backend implementation plan](../../BACKEND_IMPLEMENTATION_PLAN.md)
- [Backend task register](../../BACKEND_TASK_REGISTER.md)
- [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Backend test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Backend security gate](../../BACKEND_SECURITY_GATE.md)
- [Parent B-M01 milestone](../../../../backend/milestones/B-M01-CONTROL-PLANE/MILESTONE.md)
- [Parent B-M01 tasks](../../../../backend/milestones/B-M01-CONTROL-PLANE/TASKS.md)

## 1. Purpose

Use this checklist to review implementation quality, identity and organization architecture, authentication, authorization, tenant-context integrity, database enforcement, tests, security, documentation, and acceptance evidence for B-INC-002 IDENTITY-ORGANIZATION.

A checked item means the reviewer examined the relevant implementation and evidence. It must not be checked solely because a task, source file, test file, or planning document exists.

This checklist does not replace `ACCEPTANCE_CRITERIA.md`. The acceptance criteria are the authoritative source for pass/fail conditions and BAC/BTS/SEC-GATE traceability.

## 2. Review outcome

Record one outcome:

- **ACCEPT:** All applicable criteria and mandatory reviews pass; no blocking finding remains.
- **ACCEPT WITH TRACKED NON-BLOCKING ACTIONS:** Permitted only when the authorized acceptance authority confirms that the remaining actions are non-blocking and do not violate mandatory security, authorization, or tenant-isolation requirements.
- **REJECT:** One or more required criteria fail or required evidence is insufficient.
- **BLOCKED:** A required decision, dependency, environment, or reviewer is unavailable.

Record the outcome, rationale, reviewer roles, date, and evidence location in the review record. Do not infer an outcome from a merge, branch name, commit, or partial test result.

## 3. Scope and canonical placement

- [ ] Increment ID is `B-INC-002`.
- [ ] Increment name is `IDENTITY-ORGANIZATION`.
- [ ] Canonical phase is `P3 CONTROL PLANE`.
- [ ] Parent official milestone is `B-M01 CONTROL PLANE`.
- [ ] The increment does not create a new official phase or milestone.
- [ ] Existing task IDs `KR-BE-1-010` through `KR-BE-1-021` are preserved.
- [ ] Existing task descriptions and engineering-day estimates match the B-M01 task register.
- [ ] `KR-BE-1-044` is scoped only to identity and organization authorization tests in this increment.
- [ ] `KR-BE-1-045` is scoped only to identity and organization tenant-isolation tests in this increment.
- [ ] The shared tasks retain their original IDs and whole-task estimates.
- [ ] Remaining B-INC-003 authorization and tenant-isolation obligations are explicitly retained.
- [ ] Coding-agent tasks `KR-CA-022` through `KR-CA-026` remain deferred and are not included in this increment's implementation schedule.
- [ ] Project and platform-catalog implementation remains assigned to B-INC-003.
- [ ] Transaction, idempotency, and audit implementation remains assigned to B-INC-004.
- [ ] DB-M01 and DB-M02 ownership boundaries are preserved.
- [ ] No planning document claims implementation, testing, review, or acceptance without evidence.

## 4. Task and acceptance traceability

- [ ] `ACCEPTANCE_CRITERIA.md` is treated as the single increment-level trace source.
- [ ] Every task's linked AC identifiers exist in `ACCEPTANCE_CRITERIA.md`.
- [ ] Every linked AC has a measurable pass condition, fail condition, evidence requirement, owner, and canonical BAC/BTS/security-gate traces.
- [ ] Each task's `Linked tests` field is the exact union of the BTS traces of its linked ACs.
- [ ] Each task's `Linked security gates` field is the exact union of the security-gate traces of its linked ACs.
- [ ] A task uses `Not applicable` for security gates only when all its linked ACs have no applicable canonical security-gate trace.
- [ ] No test or security-gate ID has been added to a task independently of its linked AC traces.
- [ ] BAC identifiers and their meanings match `BACKEND_ACCEPTANCE_CRITERIA.md`.
- [ ] BTS identifiers and their meanings match `BACKEND_TEST_STRATEGY.md`.
- [ ] SEC-GATE identifiers and their meanings match `BACKEND_SECURITY_GATE.md`.
- [ ] No canonical identifier has been renamed, repurposed, or invented.
- [ ] Every acceptance criterion has a corresponding acceptance-record row.
- [ ] All pre-implementation acceptance rows remain explicitly `TBD`; none is marked passed without evidence.
- [ ] The repository documentation checker has been run and its actual result retained.
- [ ] Any traceability discrepancy has been corrected before the dossier is approved for implementation.

## 5. Identity model and authentication boundary

- [ ] Identity and principal semantics are explicitly documented.
- [ ] The domain model follows the approved backend architecture.
- [ ] Provider-specific token details do not leak unnecessarily into domain services.
- [ ] The authentication adapter boundary follows the approved authentication contract.
- [ ] Valid authentication produces the expected principal.
- [ ] Missing authentication is rejected according to the approved contract.
- [ ] Invalid, expired, or otherwise unacceptable authentication is rejected according to the approved contract and available test cases.
- [ ] Failure behavior does not create a partially authenticated principal.
- [ ] Authentication failures do not expose credentials, token contents, private key material, or sensitive internal details.
- [ ] Tests use synthetic identities and credentials.
- [ ] Any provider-specific decision needed for implementation is recorded and approved by its decision owner.
- [ ] The current-user endpoint returns only approved identity attributes.
- [ ] The current-user endpoint conforms to the approved REST API v1 response and error contract.
- [ ] Current-user behavior is covered by positive and negative tests.

## 6. Organization and membership integrity

- [ ] Organization identity, lifecycle, and ownership semantics are documented.
- [ ] Organization model behavior matches the approved DB-M01 schema and constraints.
- [ ] OrganizationRepository uses the approved persistence contract.
- [ ] MembershipRepository uses the approved relationship model and constraints.
- [ ] Repository behavior distinguishes an absent record or membership from an infrastructure failure.
- [ ] Organization and membership lookups are tested against the applicable database environment.
- [ ] Application code does not silently bypass database constraints.
- [ ] A client-supplied organization ID is not treated as proof of authorization.
- [ ] OrganizationService checks the approved membership and permission requirements.
- [ ] Denied organization operations do not mutate persisted state.
- [ ] Organization API operations follow the approved REST API v1 contract.
- [ ] Request validation, response schemas, and error behavior are tested.
- [ ] Organization responses expose only fields approved by the API contract.
- [ ] Project and platform-catalog responsibilities have not been silently added to this increment.

## 7. Roles, permissions, and default-deny authorization

- [ ] Role and permission names and meanings are explicit.
- [ ] The role-to-permission mapping is reviewed by the appropriate security and architecture owners.
- [ ] Protected operations are identified and mapped to their required permissions.
- [ ] Missing permission context denies access to protected operations.
- [ ] Unknown or unrecognized permissions do not grant access.
- [ ] Unauthenticated and unauthorized cases are distinguishable according to the approved API contract.
- [ ] Authorized operations succeed under the approved policy.
- [ ] Unauthorized operations fail without disclosing sensitive data.
- [ ] Authorization checks are enforced at the appropriate application boundary.
- [ ] The policy layer cannot be bypassed through an alternate service or route path.
- [ ] Tests include both permitted and denied operations.
- [ ] Organization membership and role/permission decisions are tested together where required.
- [ ] The identity and organization slice of `KR-BE-1-044` is complete and separately evidenced.
- [ ] The remaining project/platform slice of `KR-BE-1-044` remains open until B-INC-003 acceptance.

## 8. Tenant-context integrity and isolation

- [ ] The source of trusted tenant context is documented.
- [ ] Tenant context is derived according to the approved authentication and authorization contract.
- [ ] Tenant context is propagated consistently through the required request, service, and persistence path.
- [ ] Caller-controlled route values, query parameters, headers, and request fields cannot override authorized tenant context.
- [ ] Missing or invalid tenant context does not grant access.
- [ ] Representative cross-organization reads are tested.
- [ ] Representative cross-organization writes and mutations are tested.
- [ ] Denied operations are checked for unintended persisted-state changes.
- [ ] Application-level isolation tests execute against the applicable integration path.
- [ ] The required database tenant-isolation mechanisms are identified from the approved database contract.
- [ ] Database enforcement is tested where required; mocked application tests are not accepted as a substitute for database verification.
- [ ] Database test setup and evidence are reviewed by the Database Technical Lead.
- [ ] Test evidence identifies the schema/policy setup and the tested revision.
- [ ] No test claims complete database enforcement when only an application-level check was exercised.
- [ ] The identity and organization slice of `KR-BE-1-045` is complete and separately evidenced.
- [ ] The remaining project-specific slice of `KR-BE-1-045` remains open until B-INC-003 acceptance.

## 9. Integration, regression, and test evidence

- [ ] Required tests are mapped to the canonical BTS definitions through the acceptance criteria.
- [ ] Test cases exercise success and failure behavior.
- [ ] Authentication tests cover accepted and rejected test credentials.
- [ ] Authorization tests cover allowed, denied, and missing-permission behavior.
- [ ] Membership tests cover valid and absent membership as applicable.
- [ ] Tenant tests attempt representative unauthorized cross-tenant operations.
- [ ] Database-dependent behavior is exercised against the required test database.
- [ ] Integration tests exercise the actual integrated identity/organization path within the declared scope.
- [ ] Tests are reproducible from the documented setup.
- [ ] Test evidence records the repository revision, command, exit status, and result.
- [ ] Skipped, blocked, or not-run tests are explicitly identified and not reported as passing.
- [ ] Test output and fixtures contain no real credentials or prohibited sensitive values.
- [ ] The evidence package supports review of the full pass condition for each applicable criterion.
- [ ] Failures and material findings have explicit owners and dispositions.

## 10. Security and repository hygiene

- [ ] The backend-wide no-secrets-in-repository invariant is preserved.
- [ ] No real authentication token, password, API key, private key, database credential, or production identity-provider secret is tracked.
- [ ] Examples and fixtures use unmistakably nonfunctional placeholders or synthetic values.
- [ ] Test credentials are generated or supplied through the approved test mechanism and are not committed as real secrets.
- [ ] Logs, API responses, snapshots, scanner output, and retained diagnostics do not expose credentials or key material.
- [ ] Applicable repository secret scanning and blocking CI controls remain enabled.
- [ ] Required checks are not bypassed by this increment.
- [ ] Potential real credential exposure is referred to the Security Owner.
- [ ] A possible exposure is not treated as resolved solely because a current file was edited.
- [ ] Security findings and dispositions are recorded without copying secret values into reports.
- [ ] Applicable later-increment BAC requirements for repository hygiene, safe fixtures, blocking secret scanning, and secret-safe evidence are addressed.
- [ ] No B-INC-001-only `SEC-GATE-*` ID has been reassigned to identity or tenant-isolation behavior.

## 11. Architecture and database review

- [ ] Identity and organization module boundaries match the approved architecture.
- [ ] Dependencies between domain, service, repository, and API layers are reviewed.
- [ ] Authentication and authorization boundaries are explicit.
- [ ] Organization and membership persistence matches the approved DB-M01 contract.
- [ ] Database ownership remains with the appropriate database workstream.
- [ ] Required tenant-isolation controls are reconciled with the database contract.
- [ ] No alternate tenant-isolation scheme has been introduced without an approved decision.
- [ ] No production identity-provider or cloud IAM capability is claimed without evidence from the responsible workstream.
- [ ] Material architecture and database findings are dispositioned before acceptance.

## 12. Documentation and review quality

- [ ] Every document's Document Control section uses the standard five fields: Document, Path, Status, Owner role, Related milestones.
- [ ] The `Path` value is the full repository path beginning with `docs/`.
- [ ] Extra links are in a separate `Related documents` section.
- [ ] Links to backend planning documents use `../../BACKEND_...`.
- [ ] Links to B-M01 documents use `../../../../backend/milestones/B-M01-CONTROL-PLANE/...`.
- [ ] Links to sibling increment documents resolve within the B-INC-002 folder.
- [ ] Canonical phase and official milestone names match the repository authority.
- [ ] The task register, acceptance criteria, and review checklist agree on task IDs and scope.
- [ ] The acceptance criteria remain the sole source of AC-to-BAC/BTS/SEC-GATE mappings.
- [ ] Documentation describes actual implementation and does not claim unperformed tests or reviews.
- [ ] Deferred `KR-CA-022` through `KR-CA-026` are referenced without being scheduled or implemented by implication.
- [ ] The review outcome and material findings are recorded.
- [ ] Required independent review has been completed by the designated reviewer roles.

## 13. Mandatory acceptance blockers

Do not accept B-INC-002 if any of the following is true:

- [ ] An authentication failure is accepted contrary to the approved contract.
- [ ] A protected operation succeeds without the required permission.
- [ ] Organization membership is assumed from untrusted caller input.
- [ ] Tenant context can be overridden without authorization.
- [ ] Required database tenant enforcement has not been verified.
- [ ] Required cross-tenant negative tests are missing or failing.
- [ ] A shared test task is marked fully complete when only its B-INC-002 slice is done.
- [ ] Required canonical BAC criteria fail, are blocked, or lack evidence.
- [ ] Required integration evidence is missing or cannot be reproduced.
- [ ] A mandatory review is missing.
- [ ] A material finding lacks an owner and disposition.
- [ ] A prohibited secret or security-key value is present in tracked content or retained evidence.
- [ ] The acceptance matrix claims a pass without reviewed evidence.
- [ ] A closing commit or tag is prepared before authorized acceptance.

## 14. Review record

| Field | Value |
|---|---|
| Review outcome | TBD |
| Backend Technical Lead | TBD |
| Architecture Owner | TBD |
| Security Owner | TBD |
| Database Technical Lead | TBD |
| QA Owner | TBD |
| Documentation Owner | TBD |
| Evidence location | TBD |
| Blocking findings | TBD |
| Non-blocking actions | TBD |
| Review date | TBD |
| Acceptance authority | TBD |

## 15. Status

**Status: Proposed.**

This checklist is a review instrument. It does not assert that B-INC-002 has been implemented, tested, reviewed, or accepted. All checked items require actual evidence and review.
