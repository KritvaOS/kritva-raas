# Approval Package — KR-BINC-001-005 Secret-Handling and Configuration Boundary

## 1. Document Control

| Field | Value |
|---|---|
| Document | Approval Package for KR-BINC-001-005 Secret-Handling and Configuration Boundary |
| Path | `docs/planning/backend/decisions/approvals/APPROVAL-KR-BINC-001-005-secret-handling.md` |
| Status | Draft |
| Owner role | Security Owner |
| Decision ID | KR-BINC-001-005 |
| Task ID | KR-BINC-001-005 |
| Increment | B-INC-001 |
| Revision | 2 (2026-10-11) |

Status here is the package workflow status (Draft, Requested, Closed, Withdrawn). The decision disposition is recorded in the decision record.

## 2. Purpose and Requested Disposition

This package asks the Security Owner to review and the Cloud/Infrastructure Owner to review the secret-handling and configuration policy, and to record for each role: Approved, Rejected, or Returned for revision. The decision becomes Approved only when both required roles have recorded approval. Nothing here is approved yet.

## 3. Canonical Decision Record

[KR-BINC-001-005 Secret-Handling and Configuration Boundary](../../increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BINC-001-005-secret-handling-configuration.md)

The decision record is authoritative for the final disposition. The outcome is recorded in its Approval Record table and not in this package.

## 4. Decision Scope

Covers: the secret classes and their repository rules, the permitted secret sources, the prohibited repository content, the configuration boundary, logging and diagnostic redaction rules, repository protection requirements and the exposure escalation outline.

Does not cover: the disposition of the finding already on record (see Section 7), the production secret manager and workload identity (cloud workstream), the choice of secret scanner (KR-BINC-001-008, on hold), or any implementation. This is a policy definition. It claims no runtime enforcement, no log redaction in place and no repository protection yet, and approving it closes no security gate.

## 5. Recommendation Summary

Proposed until approved:

1. Secret classes S0 to S4 follow `SECRETS_MANAGEMENT.md`. S2 to S4 values are never committed.
2. S2 and S3 values reach a process only through runtime environment injection, a secret-manager reference resolved at startup, an untracked local development file, or values generated at runtime in tests.
3. One configuration module reads external configuration, validates it at startup and exposes typed values. A failure names the setting and never prints its value.
4. Secrets are held as secret-typed values and are redacted centrally in logs, errors, health output, traces and diagnostics.
5. Repository protection (ignore rules, scanner, history assessment) and the exposure escalation flow are requirements for later tasks.

## 6. Options and Trade-offs

| Option | Result |
|---|---|
| Restate `SECRETS_MANAGEMENT.md` in full for the backend | Rejected: duplicates the authoritative document and risks drift |
| Narrow backend boundary that cites the authoritative sections | Recommended |
| Wait for the toolchain decisions first | Rejected: the policy is technology-neutral and later tasks need it first |

## 7. Required Evidence and Review Questions

Evidence: the decision record and the security documents it cites (secrets management, key management and the backend security gate). The policy is documentation. No enforcement exists yet, so there is no test or scan result to review.

Known open finding. `BACKEND_SECURITY_GATE.md` Section 4.2.1 records that a credential-shaped example was removed from the working tree and that a sanitized rescan of tracked files found no remaining match. The earlier value remains in Git history. Its exposure assessment is pending with the Security Owner. Approving this policy does not decide whether the value was real or reused, does not require or exclude rotation or history remediation, and does not close any security gate. The Security Owner records the finding's disposition separately from the policy disposition.

Revision 2 incorporates the corrections from an independent review of revision 1: the stale status in `BACKEND_SECURITY_GATE.md` Section 9, test-credential and S4 wording, explicit URL, nested-error, telemetry and redaction-failure rules, the assessment fields of the exposure outline, and the meaning of separate credentials.

Review questions for the Security Owner:

1. Do the secret classes, permitted sources and prohibited content match the program secret-handling documents?
2. Is the redaction rule set (central utility, field allowlist, sensitive headers) sufficient for the backend?
3. Does the exposure escalation outline match the incident process, given that the response tasks complete it later?
4. What is your disposition of the history finding recorded in `BACKEND_SECURITY_GATE.md` Section 4.2.1, recorded separately from the policy decision?

Review questions for the Cloud/Infrastructure Owner:

1. Does the boundary between the backend configuration schema and cloud-owned secret storage, rotation and workload identity match the cloud plan?
2. Is the separate-credential rule (runtime, migration and administration) feasible for the cloud design?

## 8. Dependencies and Downstream Impact

- KR-BE-1-003, KR-BE-1-041, KR-BINC-001-006, KR-BINC-001-007, KR-BINC-001-008, KR-BINC-001-013 and KR-BINC-001-014 take their requirements from this record.
- KR-BINC-001-008 (scanner selection) stays on hold for its own comparative evaluation. This approval does not select a scanner.
- The cloud-owned production implementation is not changed by this record.

## 9. Required Approvers and Review Record

| Role | Review requested | Evidence |
|---|---|---|
| Security Owner | Not yet requested | This package and the decision record |
| Cloud/Infrastructure Owner (review) | Not yet requested | This package and the decision record |

The review request dates are recorded here when the package moves to Requested. The dispositions are not recorded here.

## 10. Approval Instructions

1. Review this package and the decision record, each role for its own questions.
2. Record each role's disposition, date and evidence in the Approval Record table of the decision record. Evidence cites the review by reference only and never reproduces a secret value.
3. Keep the task In Review until its Definition of Done is met.
4. Set this package to Closed with a link to the recorded outcomes.

## 11. References

- Task: KR-BINC-001-005 in the [B-INC-001 task register](../../increments/B-INC-001-SECURE-FOUNDATION/TASKS.md)
- Acceptance criteria: B-INC-001-AC-04, B-INC-001-AC-12 and B-INC-001-AC-14 in the [acceptance criteria](../../increments/B-INC-001-SECURE-FOUNDATION/ACCEPTANCE_CRITERIA.md)
- Linked tests: BTS-002, BTS-003, BTS-009, BTS-010 (NOT RUN)
- Linked security gates: SEC-GATE-002, SEC-GATE-008, SEC-GATE-009 (not closed)
- [Readiness review](../../increments/B-INC-001-SECURE-FOUNDATION/decisions/IMPLEMENTATION_READINESS.md)
- [Decision approvals README](../README.md)
