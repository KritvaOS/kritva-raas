# B-INC-003 — PROJECTS-PLATFORM-CATALOG Acceptance Criteria

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-003 PROJECTS-PLATFORM-CATALOG Acceptance Criteria |
| Path | `planning/backend/increments/B-INC-003-PROJECTS-PLATFORM-CATALOG/ACCEPTANCE_CRITERIA.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; B-M03 PLATFORM |

## Related documents

- [Milestone](MILESTONE.md)
- [Tasks](TASKS.md)
- [Review checklist](REVIEW_CHECKLIST.md)
- [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Backend test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Backend security gate](../../BACKEND_SECURITY_GATE.md)
- [Parent B-M01 tasks](../../../../docs/backend/milestones/B-M01-CONTROL-PLANE/TASKS.md)

## 1. Authority and traceability rules

This document defines B-INC-003's increment-specific acceptance criteria and is the single source of truth for the increment's AC-to-BAC/BTS/SEC-GATE mappings.

- `BAC-*` identifiers refer to the canonical backend acceptance criteria.
- `BTS-*` identifiers refer to the canonical backend test strategy.
- `SEC-GATE-*` identifiers refer to the canonical backend security gates.
- This document does not redefine canonical identifiers or their meanings.
- `TASKS.md` must link each task to the applicable acceptance criteria.
- Each task's `Linked tests` must equal the exact union of the linked ACs' `Test trace` entries.
- Each task's `Linked security gates` must equal the exact union of the linked ACs' `Security-gate trace` entries.
- No trace identifier may be added or omitted from a task's union.
- `Not applicable` means that no canonical security gate is directly traced by that AC. It does not waive applicable backend-wide security requirements.

## 2. Acceptance status

All criteria begin as **TBD**. Mark a criterion Pass only after reviewing evidence from the actual implementation revision. Planned work, a code commit, or an unreviewed test result is not sufficient evidence of acceptance.

## 3. Acceptance criteria

### B-INC-003-AC-01 — Project domain model

- **Pass condition:** The project domain model represents project identity, ownership relationships, and approved metadata consistently with the control-plane architecture. The model supports project ownership and access enforcement without introducing fields that violate the approved project metadata boundary.
- **Fail condition:** Project identity or ownership is ambiguous, required ownership information is absent, the model conflicts with the approved architecture, or the model introduces prohibited source or secret fields.
- **Evidence to retain:** Reviewed domain model, relevant model tests, and the architecture or contract reference used for review.
- **Backend acceptance trace:** BAC-023, BAC-024, BAC-035.
- **Test trace:** BTS-023, BTS-025.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead; Architecture Reviewer.

### B-INC-003-AC-02 — Project persistence and ownership

- **Pass condition:** Project persistence preserves project identity, ownership relationships, and metadata integrity. Repository operations use the approved ownership and tenant context; a caller-supplied project identifier alone does not authorize access.
- **Fail condition:** Repository behavior loses or corrupts ownership information, allows unauthorized retrieval through an untrusted identifier, or violates the approved persistence contract.
- **Evidence to retain:** Repository test results, applicable database/schema verification, and reviewed ownership-query behavior.
- **Backend acceptance trace:** BAC-023, BAC-024.
- **Test trace:** BTS-023, BTS-025.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead; Database Technical Lead.

### B-INC-003-AC-03 — Project service access semantics

- **Pass condition:** Project service operations preserve the approved ownership and access semantics and do not bypass the authorization boundary. Permitted and denied operations behave according to the approved contract.
- **Fail condition:** A service operation bypasses required access checks, reports a denied operation as successful, or makes an unintended state change after a denied mutation.
- **Evidence to retain:** Service test results, permitted/denied scenario results, and persisted-state assertions for denied mutations where applicable.
- **Backend acceptance trace:** BAC-023.
- **Test trace:** BTS-023.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead.

### B-INC-003-AC-04 — Project API contract

- **Pass condition:** Project endpoints conform to the approved API request, response, validation, and error contract. Project API behavior preserves ownership and metadata semantics and is verified through applicable API contract and integration tests.
- **Fail condition:** Request or response behavior violates the approved contract, validation is missing for required inputs, errors do not follow the contract, or required integration behavior is unverified.
- **Evidence to retain:** API contract test results, schema and validation results, relevant integration output, and the tested revision.
- **Backend acceptance trace:** BAC-024, BAC-032.
- **Test trace:** BTS-025, BTS-032.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead; QA Owner.

### B-INC-003-AC-05 — Project authorization

- **Pass condition:** Protected project operations enforce the approved ownership, membership, and permission rules. Unauthenticated or unauthorized access is rejected according to the approved API contract, and missing or insufficient authorization does not grant access.
- **Fail condition:** A protected operation succeeds without the required authorization, access depends only on a caller-supplied identifier, or required authorization-gate execution and review are incomplete.
- **Evidence to retain:** Project authorization matrix, positive and negative test results, tested revision, and the applicable security-gate execution/review record.
- **Backend acceptance trace:** BAC-023, BAC-031.
- **Test trace:** BTS-023.
- **Security-gate trace:** SEC-GATE-013.
- **Owner:** Security Owner; Backend Technical Lead.

### B-INC-003-AC-06 — Project tenant isolation

- **Pass condition:** Project operations enforce tenant isolation across the application, service/repository, and required database boundaries. Unauthorized cross-tenant reads and writes are denied, and denied mutations do not cause unintended persisted-state changes.
- **Fail condition:** A principal accesses another tenant's project without authorization, tenant context can be improperly substituted, required database enforcement is absent or unverified, or denied writes leave unintended changes.
- **Evidence to retain:** Cross-tenant test matrix, tenant-context integrity results, required database-enforcement results, before/after state assertions, and the tested revision.
- **Backend acceptance trace:** BAC-017, BAC-023, BAC-031.
- **Test trace:** BTS-020, BTS-021, BTS-022.
- **Security-gate trace:** SEC-GATE-013.
- **Owner:** Security Owner; Backend Technical Lead; Database Technical Lead.

### B-INC-003-AC-07 — Platform-catalog ownership boundary

- **Pass condition:** The platform-catalog model and API-facing contract conform to the authoritative ownership and lifecycle defined by B-M03 PLATFORM. The increment does not create a competing authoritative catalog or silently redefine platform ownership.
- **Fail condition:** The model conflicts with the approved B-M03 PLATFORM contract, establishes conflicting ownership/lifecycle semantics, or lacks the required architecture/platform-owner confirmation.
- **Evidence to retain:** Reviewed model, the B-M03 PLATFORM contract reference and version, and architecture/platform-owner confirmation.
- **Backend acceptance trace:** BAC-025, BAC-035.
- **Test trace:** BTS-027.
- **Security-gate trace:** Not applicable.
- **Owner:** Architecture Owner; B-M03 PLATFORM Owner; Backend Technical Lead.

### B-INC-003-AC-08 — Platform-catalog persistence

- **Pass condition:** Platform-catalog persistence implements the approved catalog contract and preserves the B-M03 PLATFORM ownership boundary. Repository behavior does not introduce conflicting ownership, lifecycle, or data semantics.
- **Fail condition:** Persistence behavior conflicts with the approved catalog contract, changes authoritative ownership semantics, or lacks required repository/database verification.
- **Evidence to retain:** Repository test results, applicable schema verification, and reviewed catalog-contract alignment.
- **Backend acceptance trace:** BAC-025.
- **Test trace:** BTS-027.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead; Database Technical Lead; B-M03 PLATFORM Owner.

### B-INC-003-AC-09 — Platform-catalog service contract

- **Pass condition:** The platform-catalog service uses the approved repository boundary and enforces applicable validation and response semantics. Service behavior remains consistent with the B-M03 PLATFORM ownership and lifecycle contract.
- **Fail condition:** Service behavior violates the catalog contract, returns unapproved data, omits required validation, or independently redefines authoritative platform ownership or lifecycle.
- **Evidence to retain:** Service test results, validation results, and contract-review record.
- **Backend acceptance trace:** BAC-025.
- **Test trace:** BTS-027, BTS-028.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead; B-M03 PLATFORM Owner.

### B-INC-003-AC-10 — Platform-catalog API contract

- **Pass condition:** Platform-catalog APIs conform to the approved request, validation, response, and integration contracts. Catalog API behavior is covered by contract and applicable integration tests. Protected administration operations remain subject to the separate platform-administration authorization criterion.
- **Fail condition:** The API violates the approved catalog contract, required validation or response behavior is untested, integration behavior fails, or API availability is incorrectly treated as proof of administrative authorization.
- **Evidence to retain:** Catalog API contract tests, validation results, integration results, and the reviewed API contract reference.
- **Backend acceptance trace:** BAC-025, BAC-032.
- **Test trace:** BTS-027, BTS-028, BTS-032.
- **Security-gate trace:** Not applicable.
- **Owner:** Backend Technical Lead; QA Owner; B-M03 PLATFORM Owner.

### B-INC-003-AC-11 — Platform-administration authorization

- **Pass condition:** Protected platform-administration operations enforce the approved administrative authorization policy. Authentication alone does not grant administration privileges; unauthorized operations are denied without unintended state changes.
- **Fail condition:** An unauthorized caller performs a protected administrative operation, missing authorization defaults to allow, a denied mutation changes state, or applicable security-gate execution and review remain incomplete.
- **Evidence to retain:** Platform-administration authorization matrix, negative-path test results, state assertions for denied mutations, and the security-gate execution/review record.
- **Backend acceptance trace:** BAC-026, BAC-031.
- **Test trace:** BTS-024.
- **Security-gate trace:** SEC-GATE-013.
- **Owner:** Security Owner; Backend Technical Lead.

### B-INC-003-AC-12 — Project metadata-only and secret-safe API boundary

- **Pass condition:** Project APIs accept only approved project metadata and permitted fields. Project creation and metadata updates do not accept, store, or silently synchronize source files, source archives, credentials, authentication secrets, private signing keys, or equivalent prohibited material. Requests, responses, errors, and logs comply with the approved data-classification and secret-safety requirements.
- **Fail condition:** A prohibited payload is accepted or stored, prohibited source/secret material is silently synchronized, a response exposes unapproved sensitive fields, logs disclose secret values, or required logging-redaction/secret-safe-evidence gates are not verified.
- **Evidence to retain:** Negative request/contract tests, response-classification results, sanitized error/log review, and logging-redaction and secret-safe-evidence gate records.
- **Backend acceptance trace:** BAC-007, BAC-009, BAC-010, BAC-013, BAC-024.
- **Test trace:** BTS-026, BTS-028.
- **Security-gate trace:** SEC-GATE-009, SEC-GATE-012.
- **Owner:** Backend Technical Lead; Security Owner; QA Owner.

### B-INC-003-AC-13 — Shared project and catalog API contract verification

- **Pass condition:** The B-INC-003 slice of the shared API contract test task verifies the applicable project and platform-catalog API contracts, including the metadata-only and validation requirements, through the relevant API paths. Evidence records the tested revision, executed scope, actual results, and unresolved failures or blockers.
- **Fail condition:** Required project or catalog contract coverage is missing, required tests are unexecuted or failing without an accepted disposition, evidence cannot identify the tested revision/scope, or this slice is incorrectly used to close other increments' obligations.
- **Evidence to retain:** Shared-task slice record, contract test inventory, actual test and integration results, sanitized evidence references, and remaining shared-task obligations.
- **Backend acceptance trace:** BAC-031, BAC-032.
- **Test trace:** BTS-025, BTS-027, BTS-032, BTS-036.
- **Security-gate trace:** SEC-GATE-009, SEC-GATE-012, SEC-GATE-013.
- **Owner:** QA Owner; Backend Technical Lead; Security Owner.

### B-INC-003-AC-14 — Project and platform-administration authorization test slice

- **Pass condition:** The B-INC-003 slice of the shared authorization test task exercises relevant allowed and denied project operations and platform-administration operations. Results are traceable to this slice and leave other increments' authorization obligations separately tracked.
- **Fail condition:** Required authorization cases are absent, unauthorized operations succeed, results are not traceable to the tested revision, applicable review evidence is missing, or the slice is used to claim completion of other increments' work.
- **Evidence to retain:** Slice-specific authorization matrix, actual test results, tested revision, security review, and explicit record of remaining shared-task obligations.
- **Backend acceptance trace:** BAC-023, BAC-026, BAC-031.
- **Test trace:** BTS-023, BTS-024, BTS-036.
- **Security-gate trace:** SEC-GATE-012, SEC-GATE-013.
- **Owner:** Security Owner; QA Owner; Backend Technical Lead.

### B-INC-003-AC-15 — Project tenant-isolation test slice

- **Pass condition:** The B-INC-003 slice of the shared tenant-isolation test task verifies project cross-tenant isolation, tenant-context integrity, and required database enforcement. Results identify which boundaries were exercised; application-level denial alone is not represented as proof of database-level enforcement.
- **Fail condition:** Cross-tenant project access succeeds without authorization, required database enforcement is not tested, denied mutations lack required state assertions, evidence is insufficient to identify the exercised boundary, or other increments' obligations are incorrectly marked complete.
- **Evidence to retain:** Cross-tenant test matrix, tenant-context results, database-enforcement results, denied-mutation state assertions, tested revision, and reviewed sanitized evidence.
- **Backend acceptance trace:** BAC-017, BAC-031.
- **Test trace:** BTS-020, BTS-021, BTS-022, BTS-036.
- **Security-gate trace:** SEC-GATE-012, SEC-GATE-013.
- **Owner:** Security Owner; QA Owner; Database Technical Lead.

### B-INC-003-AC-16 — API integration verification and evidence

- **Pass condition:** Applicable project and platform-catalog API integration tests are executed and reviewed. Evidence identifies the tested revision, actual commands and results, test scope, failures, blockers, and sanitized evidence references. Unexecuted tests are not reported as passing.
- **Fail condition:** Required integration tests are missing, failing without an accepted disposition, or not run without an explicit blocker; results cannot be reproduced or traced to the tested revision; or evidence misrepresents the test outcome.
- **Evidence to retain:** Reviewed integration test report, test commands/results, revision, sanitized evidence references, and security-gate execution/review record.
- **Backend acceptance trace:** BAC-031, BAC-032.
- **Test trace:** BTS-032, BTS-036.
- **Security-gate trace:** SEC-GATE-013.
- **Owner:** QA Owner; Backend Technical Lead; Security Owner.

### B-INC-003-AC-17 — Architecture, security, documentation, and evidence review

- **Pass condition:** The increment receives applicable architecture and security reviews. Operational/developer documentation and acceptance evidence allow another engineer to review the delivered scope and reproduce recorded verification. Findings have evidence-supported dispositions, and retained evidence is sanitized and secret-safe.
- **Fail condition:** Required reviews are missing, mandatory findings remain unresolved, documentation or evidence is incomplete, review results cannot be tied to the implementation revision, or evidence exposes prohibited secrets or key material.
- **Evidence to retain:** Completed architecture/security review records, finding dispositions, documentation references, tested revision, evidence inventory, and reviewed sanitized acceptance records.
- **Backend acceptance trace:** BAC-034, BAC-035, BAC-037, BAC-038.
- **Test trace:** BTS-036.
- **Security-gate trace:** SEC-GATE-012, SEC-GATE-013.
- **Owner:** Architecture Owner; Security Owner; Backend Technical Lead; QA Owner.

## 4. Acceptance record

Update this table only after reviewing actual implementation evidence.

| AC ID | Result | Evidence reference | Reviewer | Date | Notes/blockers |
|---|---|---|---|---|---|
| B-INC-003-AC-01 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-02 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-03 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-04 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-05 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-06 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-07 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-08 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-09 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-10 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-11 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-12 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-13 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-14 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-15 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-16 | TBD | TBD | TBD | TBD | TBD |
| B-INC-003-AC-17 | TBD | TBD | TBD | TBD | TBD |

## 5. Status

**Status: Proposed.**

No criterion is claimed as passed until its implementation and evidence have been reviewed.
