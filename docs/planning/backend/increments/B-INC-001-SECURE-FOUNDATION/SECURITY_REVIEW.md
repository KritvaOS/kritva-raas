# B-INC-001 — Secure Foundation Security Review

## Document Control

| Field | Value |
|---|---|
| Document | B-INC-001 Secure Foundation Security Review |
| Path | `docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/SECURITY_REVIEW.md` |
| Status | Proposed |
| Owner role | Security Reviewer |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Increment milestone](MILESTONE.md)
- [Increment tasks](TASKS.md)
- [Increment acceptance criteria](ACCEPTANCE_CRITERIA.md)
- [Increment test plan](TEST_PLAN.md)
- [Increment review checklist](REVIEW_CHECKLIST.md)
- [Commit procedure](GIT_COMMIT_STEP.md)
- [Program security gate](../../BACKEND_SECURITY_GATE.md)
- [Program risk register](../../BACKEND_RISK_REGISTER.md)
- [Program acceptance criteria](../../BACKEND_ACCEPTANCE_CRITERIA.md)
- [Program test strategy](../../BACKEND_TEST_STRATEGY.md)
- [Program task register](../../BACKEND_TASK_REGISTER.md)
- [Program changelog](../../BACKEND_CHANGELOG.md)
- [B-M01 milestone](../../../../backend/milestones/B-M01-CONTROL-PLANE/MILESTONE.md)

## 1. Purpose

This review determines whether the B-INC-001 secure foundation has adequate evidence to proceed to increment acceptance.

This document is not a declaration that the system is secure. The status remains **NOT REVIEWED** until an identified reviewer examines the implementation, scan results, test evidence, CI enforcement, repository history, and open findings.

The security gate is governed by `BACKEND_SECURITY_GATE.md`. This dossier records increment-specific evidence and review decisions; it must not weaken or redefine program-level gate requirements.

## 2. Non-Negotiable Secret-Handling Invariant

**No real security key material or secrets may be stored in the repository, in any branch, commit, tag, fixture, generated artifact, test snapshot, log, or documentation example.**

This includes, without limitation:

- Private keys and private certificates.
- Access tokens, refresh tokens, session tokens, and bearer tokens.
- Passwords and database credentials.
- API keys and OAuth client secrets.
- Service-account credentials.
- Encryption keys, signing keys, and key-encryption material.
- Real `.env` files and credential-bearing configuration.
- Scanner output, logs, snapshots, or fixtures that reveal any of the above.

Permitted content is limited to:

- Clearly synthetic placeholders.
- Configuration key names and schema definitions.
- Examples using nonfunctional, unmistakable placeholder values.
- Interfaces to a future approved secret-management mechanism.
- Ephemeral keys generated during tests and kept outside the repository.
- Sanitized evidence that cannot reveal a real credential or key.

A value does not become safe to commit because it is expired, temporary, test-only, or believed to be unused.

## 3. Review Scope

The reviewer must inspect:

1. Technology decision records and dependency versions.
2. Application bootstrap and module boundaries.
3. Configuration loading, validation, and startup failure behaviour.
4. Example configuration and development setup documentation.
5. `.gitignore` and exclusions for local secret files and generated artifacts.
6. Secret scanner selection, configuration, and documented invocation.
7. CI workflow configuration and evidence that scanner failure blocks the required check.
8. Repository history scan scope, findings, and disposition.
9. Logging fields, error serialization, request context, and redaction behaviour.
10. Database connection configuration and any credential-shaped examples.
11. Scanner allowlists and exceptions.
12. Test evidence and clean-checkout reproducibility.
13. Open risks, unresolved decisions, and release-blocking findings.

## 4. Initial Known Finding: Development Setup Example

A prior baseline assessment reported a credential-shaped PostgreSQL URL in `docs/development/DEVELOPMENT_SETUP.md` at revision `2c51027`. The earlier assessment also reported that `.gitignore` and a CI workflow were absent at that baseline.

These are historical reports, not proof of current repository state. The reviewer must verify the current checkout and commit history.

| Field | Required record |
|---|---|
| Finding ID | `B-INC-001-SR-001` |
| Subject | Credential-shaped PostgreSQL URL in development setup |
| Initial status | OPEN — verify current content and history |
| Required inspection | Current file, relevant diff, and historical versions |
| Required correction | Use a clearly synthetic, nonfunctional placeholder if needed |
| Security decision | Determine whether the value was a real credential |
| If real | Execute leak response; rotation/revocation is required as applicable |
| Verification | Rerun local scanner, blocking CI scanner, and history scan |
| Closure evidence | Sanitized finding record, correction commit, scan results, reviewer approval |

Do not close this finding solely because the current file looks safe. Determine whether a real credential was ever committed or otherwise exposed.

## 5. Threat and Control Review

| Threat / failure mode | Required control | Evidence to inspect | Acceptance trace |
|---|---|---|---|
| Real secret added to source or docs | Safe examples, local scanning, blocking CI | Diff, scanner fixture results, CI workflow/run | `B-INC-001-AC-05`, `AC-14`, `AC-16`, `AC-17`; SEC-GATE-003, SEC-GATE-004, SEC-GATE-005 |
| Secret committed and later removed | History scan and leak response | History-scan scope, finding disposition, response record | `AC-15`, `AC-18`; SEC-GATE-006, SEC-GATE-007 |
| Missing configuration silently accepted | Required-value validation and safe startup failure | Negative startup tests | `AC-04`, `AC-11`; SEC-GATE-008 |
| Sensitive values emitted in logs | Structured logging and field-aware redaction | Redaction tests, sanitized output | `AC-10`, `AC-12`; SEC-GATE-009 |
| Scanner exception hides a true leak | Narrow, justified, reviewed exceptions | Exception inventory and fixture results | `AC-16`, `AC-17`; SEC-GATE-010 |
| Setup works only on one developer's machine | Reproducible setup and clean-checkout validation | Clean-checkout run and instructions | `AC-02`, `AC-19`; SEC-GATE-003 |
| Framework or package choice is undocumented | Recorded decision with alternatives and owner | Decision record and review | `AC-01`, `AC-03` |
| Security checks are assumed but not automated | Explicit workflow and fail-closed scanner job | CI configuration and controlled failing run | `AC-17`, `AC-20`; SEC-GATE-005, SEC-GATE-013 |

Acceptance IDs refer to `ACCEPTANCE_CRITERIA.md`; `SEC-GATE-*` definitions are in `BACKEND_SECURITY_GATE.md`. This table does not replace those definitions.

## 6. Scanner and CI Review

The reviewer must verify that:

- Scanner scope includes tracked files and relevant staged changes.
- Local instructions are accurate and reproducible.
- The scanner catches a synthetic positive fixture.
- Safe negative fixtures do not create unexplained false positives.
- A confirmed finding returns a nonzero status.
- The required CI check runs on the repository's required change paths.
- Scanner failure blocks the protected merge path under repository settings.
- Suppressions are narrowly scoped and reviewed.
- CI output does not print discovered secret values.
- The scanner version and configuration are recorded.
- The workflow does not report success when the scanner did not execute.

A workflow file alone does not prove that branch protection requires the workflow. Record the repository setting or equivalent policy evidence. If that evidence cannot be inspected, mark enforcement **NOT VERIFIED**.

## 7. Repository-History Review

The history review must state:

- Branches, tags, and history range scanned.
- Scanner and version.
- Whether the scan includes deleted files and prior commits.
- Findings and their dispositions.
- Whether the known PostgreSQL URL is present in earlier revisions.
- Whether any confirmed exposure requires revocation, rotation, notification, or further incident handling.
- Limitations, including inaccessible refs or incomplete history.

Do not rewrite history before preserving necessary incident evidence and coordinating the response. If history rewriting is required, follow repository-owner policy, coordinate affected contributors, and verify the resulting refs. History rewriting does not replace credential rotation.

## 8. Leak-Response Procedure

If a real secret, credential, private key, certificate, or signing material is found in a working tree, staged diff, commit, branch, tag, or artifact:

1. **Stop the commit or release.** Do not push or merge the affected change.
2. **Limit exposure.** Restrict access to affected artifacts and logs. Do not paste the value into an issue, chat, review, or incident report.
3. **Notify the responsible security owner** through the approved private incident channel. Record the secret type and exposure location without reproducing the value.
4. **Revoke or rotate the credential/key.** Treat it as compromised if exposure cannot be ruled out. Verify that the old credential no longer works where applicable.
5. **Inspect scope.** Determine affected branches, tags, CI logs, artifacts, caches, and downstream copies.
6. **Remove the exposed value** from the working tree and replace it with a safe placeholder. Preserve sanitized incident evidence separately from the repository.
7. **Assess history cleanup.** Coordinate any history rewrite with the repository owner. Do not assume a deletion commit removes the exposure.
8. **Rescan.** Run local and CI secret scans, including history where available. Review every finding and suppression.
9. **Verify containment.** Confirm rotation/revocation, scan results, and any required notifications or audit actions.
10. **Authorize resumption.** Only the designated security owner may approve closure of the incident and release of the blocked change.

The leak-response record must not contain the secret itself. Do not use a public issue or commit message to describe the secret's value.

## 9. Review Findings Register

Record findings in the following format. Use program risk IDs from `BACKEND_RISK_REGISTER.md` where applicable; do not duplicate or silently rename program risks.

| Finding ID | Severity | Evidence | Linked risk / gate | Required correction | Owner role | Status |
|---|---|---|---|---|---|---|
| `B-INC-001-SR-001` | TBD after verification | Current file and history inspection required. The working-tree example has been replaced with an unmistakable placeholder; history still contains the loopback development example | SEC-GATE-001, SEC-GATE-003, SEC-GATE-011; R-BE-009 | Verify placeholder vs real credential; rotate and remediate if exposed | Backend Technical Lead + Security Reviewer | OPEN |
| `B-INC-001-SR-002` | TBD | CI scanner enforcement evidence required | SEC-GATE-005, SEC-GATE-010; R-BE-008 | Verify scanner runs and blocks the merge path | CI/Infrastructure Owner | OPEN until verified |
| `B-INC-001-SR-003` | TBD | History scan evidence required | SEC-GATE-006 | Record scope, findings, and dispositions | Security Reviewer | OPEN until verified |
| `B-INC-001-SR-004` | TBD | Log redaction tests required | SEC-GATE-009 | Verify no sensitive values are emitted | Backend Technical Lead | OPEN until verified |

Add rows for all other findings. Do not label severity or closure without evidence. Link each finding to its program risk, canonical security gate, affected task, acceptance criterion, and retest.

## 10. Open Technology Decisions

Technology choices remain open until approved and recorded.

| Decision | Options to evaluate | Recommendation to evaluate | Required review |
|---|---|---|---|
| Runtime and language | Supported Node.js LTS and TypeScript versions | Select a supported LTS baseline and pin the toolchain | Backend Technical Lead |
| Package manager | npm, pnpm | Prefer reproducible lockfile-based installs; select one canonical manager | Backend Technical Lead |
| HTTP framework | Fastify, NestJS, Express | Prefer a framework that supports explicit validation, typed boundaries, and testability without unnecessary complexity | Backend Technical Lead |
| Migration tooling | Prisma, Drizzle, Knex, node-pg-migrate | Choose based on the selected database access model and migration review workflow | Backend Technical Lead |
| Secret scanner | Gitleaks, detect-secrets, or another reviewed option | Prefer deterministic local/CI operation, clear nonzero failure, and manageable reviewed exceptions | Security Reviewer + CI/Infrastructure Owner |

Recommendations are not approvals. Record options considered, decision rationale, owner role, approval status, and any deferred decision. Do not implement inconsistent toolchains while a decision is unresolved.

## 11. Required Review Evidence

The review record must reference:

- The exact reviewed commit SHA.
- Working-tree and diff status.
- Increment AC results.
- Canonical `BTS-*` tests executed.
- Canonical `SEC-GATE-*` status.
- Local scanner output and configuration, sanitized.
- CI workflow and run identifiers.
- History scan scope and disposition.
- Configuration-negative and log-redaction test results.
- Clean-checkout evidence.
- Open findings, exceptions, and linked program risks.
- Reviewer role, review date, decision, and rationale.

Do not attach raw environment dumps, unsanitized logs, private keys, or scanner output containing actual secret values.

## 12. Decision and Sign-Off

Complete only after the evidence has been reviewed.

| Decision field | Value |
|---|---|
| Reviewed commit SHA | TBD |
| Security reviewer role | TBD |
| Review date | TBD |
| Overall status | NOT REVIEWED |
| Blocking findings | TBD |
| Accepted exceptions | None unless explicitly approved and recorded |
| Applicable security gates | Canonical IDs and statuses to be recorded |
| Decision | ACCEPT / REJECT / BLOCKED |
| Rationale | TBD |
| Follow-up tasks | TBD |

**No acceptance by silence.** Missing evidence, an unverified scanner gate, an unresolved confirmed secret exposure, or an open blocking security finding results in **BLOCKED**. An exception cannot authorize committing a real secret or key.
