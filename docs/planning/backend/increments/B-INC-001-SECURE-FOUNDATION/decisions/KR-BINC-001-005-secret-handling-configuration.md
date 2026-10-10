# KR-BINC-001-005 — Secret-Handling and Configuration Boundary

## Document Control

| Field | Value |
|---|---|
| Document | KR-BINC-001-005 Secret-Handling and Configuration Boundary |
| Path | `docs/planning/backend/increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BINC-001-005-secret-handling-configuration.md` |
| Status | Proposed |
| Owner role | Security Owner |
| Related milestones | B-M01 CONTROL PLANE; C-M01 FOUNDATION |

## Related documents

- [Readiness review](IMPLEMENTATION_READINESS.md)
- [Approval package](../../../decisions/approvals/APPROVAL-KR-BINC-001-005-secret-handling.md)
- [Increment tasks](../TASKS.md)
- [Increment acceptance criteria](../ACCEPTANCE_CRITERIA.md)
- [Commit procedure](../GIT_COMMIT_STEP.md)
- [Program security gate](../../../BACKEND_SECURITY_GATE.md)
- [Secrets management](../../../../../security/SECRETS_MANAGEMENT.md)
- [Key management](../../../../../security/KEY_MANAGEMENT.md)

## 1. Task Record

| Field | Value |
|---|---|
| Task | KR-BINC-001-005 — Define secret-handling and configuration boundary |
| Owner role | Security Owner |
| Required approvers | Security Owner; Cloud/Infrastructure Owner review |
| Acceptance | B-INC-001-AC-04, B-INC-001-AC-12, B-INC-001-AC-14 |
| Tests | BTS-002, BTS-003, BTS-009, BTS-010 |
| Security gates | SEC-GATE-002, SEC-GATE-008, SEC-GATE-009 |
| Decision status | Proposed — not approved |

This is a policy-definition record. It states requirements that later tasks implement and test. It does not claim that configuration validation, log redaction or repository protection is enforced yet. Those tests and gates are NOT RUN and NOT IMPLEMENTED until their implementing tasks produce evidence.

## 2. Context and Constraints

- `docs/security/SECRETS_MANAGEMENT.md` and `docs/security/KEY_MANAGEMENT.md` are the authoritative security documents. This record narrows them for the backend repository and adds no new secret architecture.
- `docs/planning/backend/BACKEND_IMPLEMENTATION_PLAN.md` Section 12 sets the invariant: no real secret or security-key material may be committed.
- Production secret delivery, workload identity and the production secret-manager integration belong to the cloud workstream (C-M01 FOUNDATION). The backend consumes secrets through the boundary defined here.
- The runtime, language and package manager are not decided (KR-BINC-001-001 and 002). This policy is technology-neutral.

## 3. Secret Classes and Handling

Classes follow `SECRETS_MANAGEMENT.md` Section 7.

| Class | Description | Backend repository rule |
|---|---|---|
| S0 | Public, non-secret | May be committed |
| S1 | Internal, non-sensitive configuration | May be committed as defaults or documented examples |
| S2 | Confidential, such as service API credentials | Never committed; supplied at runtime |
| S3 | Restricted, such as database credentials | Never committed; supplied at runtime; redacted in all output |
| S4 | Critical, such as root signing keys | Never present in this repository, in local development, or in test fixtures |

S2 to S4 values are secrets. S0 and S1 values remain configuration data.

## 4. Permitted Secret Sources

A running backend process may receive S2 and S3 values only through:

1. Environment variables injected by the runtime environment.
2. A secret reference resolved at startup through the secret-manager interface defined by the cloud workstream (`SECRETS_MANAGEMENT.md` Sections 14 and 15).
3. For local development only: an untracked local file such as `.env`, per `SECRETS_MANAGEMENT.md` Section 59 (never shared, never used for production).
4. In tests: values generated at runtime and not persisted, or controlled test credentials supplied outside tracked files.

Production and staging must not depend on developer `.env` files. Development must not use production credentials (`SECRETS_MANAGEMENT.md` Sections 5.4 and 58).

## 5. Prohibited Repository Content

None of the following may be committed to tracked files, fixtures, snapshots, logs, test reports or crash output:

- Private keys and private certificates.
- Signing or encryption key material.
- API keys, access or refresh tokens, passwords and OAuth client secrets.
- Database passwords and credential-bearing connection strings.
- Service-account keys and cloud credentials.
- Populated `.env` files and equivalent local secret files.
- Captured output that contains any of the above.

Permitted content: schemas, variable names, interfaces, secret-manager references, documented workflows, obviously nonfunctional placeholders, and tests that use ephemeral runtime-generated key material that is not persisted.

Placeholders must be unmistakably nonfunctional. A placeholder must not parse as a usable credential or reusable example password. Placeholder rules for examples are completed by KR-BINC-001-007.

## 6. Configuration Ownership and Boundary

1. The backend has one configuration boundary: a single module that reads external configuration, validates it and exposes typed values to the rest of the application. No other module reads environment variables or configuration files directly.
2. Required values are validated at startup. Invalid or missing required values stop startup or keep the service from becoming ready, and the failure output names the setting without printing its value (`B-INC-001-AC-04`, `SEC-GATE-008`).
3. Defaults are explicit and safe. A default must never be a credential, and an unsafe default is rejected.
4. S2 and S3 values are held only as secret-typed values that cannot be rendered by default string formatting, serialization or logging.
5. Database credential-bearing URL components are redacted wherever a connection setting is reported (`SEC-GATE-011`, completed by KR-BINC-001-007 and KR-BINC-001-013).
6. Separate credentials exist for application runtime, migrations and administration. The application runtime never uses a database superuser credential (`SECRETS_MANAGEMENT.md` Section 45).
7. The Cloud/Infrastructure Owner owns production secret storage, rotation, workload identity and IAM. The Backend Technical Lead owns the application's configuration schema and its validation.

## 7. Logging, Error and Diagnostic Redaction

Per `SECRETS_MANAGEMENT.md` Sections 5.5, 67 and 68:

1. Secrets never appear in application logs, error messages, health or readiness responses, API error payloads, traces, metrics, crash reports or support bundles.
2. Redaction happens in one central utility, applied before a value is persisted or emitted.
3. Structured logs use an allowlist of fields. Fields such as `password`, `token`, `access_token`, `refresh_token`, `api_key`, `client_secret` and `private_key`, and sensitive request headers (including `Authorization` and cookies), are excluded.
4. Correlation uses request identifiers, never credential values.
5. Redaction is verified with synthetic credential-like values injected into representative logging paths (`B-INC-001-AC-12`, `SEC-GATE-009`). KR-BE-1-041 and KR-BINC-001-014 implement and test this.

## 8. Repository Protection Requirements

The following are requirements for later tasks, listed here so those tasks have one source:

1. KR-BINC-001-006 adds ignore rules covering real environment files and secret-bearing artifacts, while keeping safe examples trackable. Ignore rules do not remove a file that is already tracked, so existing tracked files are inspected separately (`B-INC-001-AC-14`, `SEC-GATE-002`).
2. KR-BINC-001-008 to 010 select, run locally and enforce the secret scanner in CI. Exceptions must be narrow, justified, reviewed and auditable, and cannot authorize committing an actual secret (`SEC-GATE-010`).
3. KR-BINC-001-011 assesses the agreed history scope and records its limits. A clean scan covers only what was scanned.

## 9. Exposure Escalation

1. A detected credential is treated as potentially exposed. Removing it from the current file does not remove it from Git history or external copies.
2. The finder reports a suspected exposure to the Security Owner without reproducing the value in a ticket, chat, log or pull request.
3. The Security Owner classifies severity (`SECRETS_MANAGEMENT.md` Section 66). Critical and High exposure triggers immediate rotation or revocation.
4. The flow is detect, classify, revoke or rotate, investigate, remove, rescan, audit (`SECRETS_MANAGEMENT.md` Section 65).
5. Responsibilities and the closure criteria are completed in KR-BINC-001-012. Evidence records cite the finding by sanitized reference only.

## 10. Options Considered

| Option | Result |
|---|---|
| Backend-only policy that restates `SECRETS_MANAGEMENT.md` in full | Rejected: duplicates the authoritative document and risks drift |
| This record: a narrow backend boundary that cites the authoritative sections | Recommended |
| Wait for the toolchain decisions before writing the policy | Rejected: the policy is technology-neutral and the configuration and logging tasks need it first |

## 11. Consequences and Dependencies

- KR-BE-1-003, KR-BE-1-041, KR-BINC-001-006, 007, 008, 013 and 014 take their requirements from this record.
- The cloud-owned production implementation is not changed by this record.
- Mechanisms (the secret type, the redaction utility, the scanner) are chosen by the tasks that implement them.

## 12. Approval Record

| Approver role | Decision | Date | Evidence |
|---|---|---|---|
| Security Owner | Pending | — | — |
| Cloud/Infrastructure Owner (review) | Pending | — | — |

The task stays Proposed until both reviews are recorded and the Definition of Done in `../TASKS.md` is met.
