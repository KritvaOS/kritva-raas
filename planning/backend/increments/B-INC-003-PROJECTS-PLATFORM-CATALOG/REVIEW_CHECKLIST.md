# B-INC-003 — PROJECTS-PLATFORM-CATALOG Review Checklist

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-003 PROJECTS-PLATFORM-CATALOG Review Checklist |
| Path | `planning/backend/increments/B-INC-003-PROJECTS-PLATFORM-CATALOG/REVIEW_CHECKLIST.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE; B-M03 PLATFORM |

## Related documents

- [Milestone](MILESTONE.md)
- [Tasks](TASKS.md)
- [Acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Backend implementation plan](../../BACKEND_IMPLEMENTATION_PLAN.md)
- [Backend acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Backend test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Backend security gate](../../BACKEND_SECURITY_GATE.md)
- [Parent B-M01 tasks](../../../../docs/backend/milestones/B-M01-CONTROL-PLANE/TASKS.md)

## 1. Review record

| Field | Value |
|---|---|
| Reviewed revision | TBD |
| Backend reviewer | TBD |
| Architecture reviewer | TBD |
| B-M03 PLATFORM owner/reviewer | TBD |
| Security reviewer | TBD |
| QA reviewer | TBD |
| Review date | TBD |
| Overall disposition | TBD |
| Evidence location | TBD |

## 2. Document and planning integrity

- [ ] All eight increment dossier files exist at the prescribed paths when the dossier is complete.
- [ ] Document Control tables contain only the standard five fields.
- [ ] Document paths identify the full `docs/...` path.
- [ ] Status values reflect reality; Proposed documents are not represented as accepted.
- [ ] Phase label is exactly `P3 CONTROL PLANE`.
- [ ] Parent milestone is exactly `B-M01 CONTROL PLANE`.
- [ ] The platform-catalog ownership boundary explicitly references `B-M03 PLATFORM`.
- [ ] Existing B-M01 task IDs, titles, estimates, owners, and dependencies are preserved.
- [ ] Shared tasks `KR-BE-1-043`, `KR-BE-1-044`, and `KR-BE-1-045` retain their original task identities and whole-task estimates.
- [ ] Shared-task slices are not counted as additional estimates.
- [ ] Deferred `KR-CA-022` through `KR-CA-026` remain deferred and reference-only.
- [ ] Relative document links resolve from this increment directory.
- [ ] No unapproved scope or ownership transfer has been introduced.

## 3. Acceptance traceability

- [ ] `ACCEPTANCE_CRITERIA.md` is treated as the single source of truth for B-INC-003 AC-to-BAC/BTS/SEC-GATE mappings.
- [ ] Every AC uses the canonical identifiers and meanings from the program-level backend documents.
- [ ] No new or redefined canonical `BAC-*`, `BTS-*`, or `SEC-GATE-*` identifiers appear.
- [ ] Each task links only to acceptance criteria relevant to its scope.
- [ ] For every task, `Linked tests` is exactly the set union of the linked ACs' canonical test traces.
- [ ] For every task, `Linked security gates` is exactly the set union of the linked ACs' security-gate traces.
- [ ] No test or gate identifier is present merely because it appears useful; it must be supported by a linked AC.
- [ ] No trace identifier required by a linked AC is missing from the task.
- [ ] `Not applicable` appears only where all linked ACs have no directly applicable canonical security gate.
- [ ] Shared-task AC mappings, test unions, and gate unions are independently checked.
- [ ] Any AC trace change is followed by recalculation of every affected task union.
- [ ] The checker result and reviewed revision are recorded as actual evidence.

## 4. Project domain and persistence review

- [ ] Project identity and ownership are represented according to the approved architecture.
- [ ] Project metadata fields match the approved domain and API contract.
- [ ] Project ownership is not inferred solely from a client-supplied project or organization identifier.
- [ ] ProjectRepository follows the approved persistence boundary.
- [ ] Required database constraints and tenant-related behavior are verified against the approved schema/contract.
- [ ] Repository failures are not misrepresented as normal absence or authorization outcomes.
- [ ] ProjectService enforces the approved ownership and access semantics.
- [ ] Protected operations cannot bypass the approved authorization path.
- [ ] Denied mutations are tested for unintended persisted-state changes.
- [ ] No unauthorized project data is returned through an alternate service or route path.

## 5. Project API and metadata-only boundary

- [ ] Project API request and response schemas conform to the approved contract.
- [ ] Request validation is exercised for accepted and rejected payloads.
- [ ] Project creation and metadata updates accept only approved project metadata and permitted fields.
- [ ] Source files are not accepted or stored through project metadata APIs.
- [ ] Source archives and source-code bundles are not accepted or stored through project metadata APIs.
- [ ] Credentials, passwords, authentication tokens, and other secrets are not accepted or stored as project metadata.
- [ ] Private signing keys and equivalent key material are not accepted or stored through project metadata APIs.
- [ ] Project creation does not silently synchronize project source.
- [ ] Prohibited or malformed payloads are rejected according to the approved API contract.
- [ ] Response fields follow the approved data-classification contract.
- [ ] Errors do not disclose secret values or unnecessarily sensitive data.
- [ ] Logs and retained test evidence are inspected for secret leakage.
- [ ] Tests distinguish a rejected payload from a successful operation that silently discards prohibited fields.
- [ ] API integration evidence identifies the actual revision and commands/results.

## 6. Project authorization and tenant isolation

- [ ] The approved project ownership, membership, and permission rules are documented and implemented.
- [ ] Unauthenticated protected operations are rejected.
- [ ] Authenticated callers without the required permission are rejected.
- [ ] Default-deny behavior is verified for missing or insufficient authorization.
- [ ] Tests cover permitted and denied project operations.
- [ ] Cross-tenant project reads are tested.
- [ ] Cross-tenant project mutations are tested.
- [ ] Tenant context cannot be overridden by an untrusted request input.
- [ ] The report identifies which application, repository, and database boundaries were exercised.
- [ ] Required database tenant enforcement is tested against the applicable database environment.
- [ ] Mock-only results are not represented as proof of database-level enforcement.
- [ ] Denied writes are followed by persisted-state assertions.
- [ ] Shared tenant-isolation evidence covers only the B-INC-003 slice and records remaining obligations.

## 7. B-M03 PLATFORM ownership and catalog contract

- [ ] The authoritative platform-catalog ownership and lifecycle contract has been located and reviewed.
- [ ] The responsible B-M03 PLATFORM owner or architecture authority has confirmed the boundary.
- [ ] `KR-BE-1-027` does not define a competing authoritative catalog.
- [ ] The catalog model does not silently redefine platform ownership, identity, or lifecycle.
- [ ] `KR-BE-1-028` persistence behavior conforms to the approved platform contract.
- [ ] `KR-BE-1-029` service behavior conforms to the repository and catalog contracts.
- [ ] `KR-BE-1-030` API request/response behavior conforms to the approved catalog API contract.
- [ ] Catalog validation behavior is covered by automated tests.
- [ ] Platform-administration authorization is treated separately from ordinary catalog API validation.
- [ ] Any contract ambiguity is recorded as a blocker rather than resolved by an unapproved assumption.
- [ ] Architecture evidence identifies the contract/version reviewed.

## 8. Platform-administration authorization

- [ ] Protected administrative operations are explicitly identified.
- [ ] Authentication alone does not grant platform-administration privileges.
- [ ] Authorization follows the approved administrative policy.
- [ ] Unauthorized administrative requests are denied.
- [ ] Negative-path tests exercise the applicable administrative API operations.
- [ ] Denied administrative mutations do not produce unintended persisted-state changes.
- [ ] Error responses and logs do not reveal prohibited secrets.
- [ ] The relevant security-gate execution and review evidence is recorded.
- [ ] No platform ownership or lifecycle rule is introduced outside the B-M03 PLATFORM boundary.

## 9. Shared task slices

### KR-BE-1-043 — API contract tests

- [ ] The B-INC-003 slice covers project and platform-catalog API contracts.
- [ ] Metadata-only project API behavior is tested.
- [ ] Request validation and response classification are tested.
- [ ] Applicable integrated API behavior is exercised.
- [ ] The recorded test and gate unions exactly match the linked AC traces.
- [ ] Other increment obligations remain separate.

### KR-BE-1-044 — Authorization tests

- [ ] The B-INC-003 slice covers project and platform-administration authorization.
- [ ] Allowed and denied operations are tested.
- [ ] The recorded test and gate unions exactly match the linked AC traces.
- [ ] Remaining authorization obligations are not marked complete based only on this slice.

### KR-BE-1-045 — Tenant-isolation tests

- [ ] The B-INC-003 slice covers project tenant isolation.
- [ ] Cross-tenant read/write behavior and tenant-context integrity are tested.
- [ ] Required database tenant enforcement is verified.
- [ ] Denied mutations include persisted-state assertions.
- [ ] The recorded test and gate unions exactly match the linked AC traces.
- [ ] Remaining tenant-isolation obligations are not marked complete based only on this slice.

## 10. Security, evidence, and test quality

- [ ] Canonical secret hygiene controls remain enabled.
- [ ] Applicable logging-redaction and secret-safe-evidence gates are executed and reviewed.
- [ ] The applicable security-gate execution/review process is evidenced.
- [ ] No real credentials, tokens, private keys, or production secrets are present in source, fixtures, logs, or evidence.
- [ ] Test results distinguish Passed, Failed, Blocked, Not run, and Partial where applicable.
- [ ] Every claimed pass is supported by actual results for the reviewed revision.
- [ ] Test commands, tool/database versions, and execution scope are recorded where required.
- [ ] Failures and blockers have owners and dispositions.
- [ ] Security findings include evidence, priority, owner, and review status.
- [ ] Findings are not closed merely because a fix was committed.
- [ ] Evidence references are reproducible and do not expose prohibited information.
- [ ] Review records identify the reviewer, revision, date, and disposition.

## 11. Documentation and acceptance readiness

- [ ] Architecture documentation describes project ownership and metadata boundaries.
- [ ] Documentation explicitly describes the B-M03 PLATFORM ownership boundary.
- [ ] API contract and validation behavior are documented.
- [ ] Authorization and tenant-isolation behavior are documented at the required level.
- [ ] Test evidence maps to the increment's acceptance criteria.
- [ ] Task status reflects implementation and acceptance separately where the workflow supports it.
- [ ] All applicable ACs have an evidence reference and explicit result.
- [ ] Required test and security-gate traces have actual execution/review evidence.
- [ ] Mandatory findings are resolved according to the governing acceptance rules.
- [ ] No blocked or unrun mandatory test is silently treated as a pass.
- [ ] The acceptance authority has enough information to decide closure without relying on undocumented assumptions.

## 12. Blockers and findings

| ID | Type | Description | Owner | Priority | Evidence/reference | Disposition |
|---|---|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD | TBD | TBD |

Use the repository's established finding-ID and priority conventions. Do not invent canonical BAC, BTS, or SEC-GATE identifiers to label findings.

## 13. Final review disposition

| Decision | Record |
|---|---|
| Project ownership/persistence review | TBD |
| Project metadata-only boundary | TBD |
| Project authorization and tenant isolation | TBD |
| B-M03 PLATFORM boundary confirmation | TBD |
| Platform catalog contract and validation | TBD |
| Platform-administration authorization | TBD |
| API integration and shared-task slices | TBD |
| Security-gate results | TBD |
| Traceability checker result | TBD |
| Outstanding blocking findings | TBD |
| Final recommendation | TBD |
| Reviewer/date | TBD |

## 14. Status

**Status: Proposed.**

This checklist is a review instrument. Marking a checklist item complete requires reviewed evidence; preparing the checklist itself is not evidence of implementation or acceptance.
