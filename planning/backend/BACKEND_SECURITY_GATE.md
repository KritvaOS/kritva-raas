# Backend Security Gate

## Document Control

| Field | Value |
|---|---|
| Document | Backend Security Gate |
| Path | `planning/backend/BACKEND_SECURITY_GATE.md` |
| Status | Proposed |
| Owner role | Security Owner |
| Related milestones | B-M01 CONTROL PLANE; DB-M01 FOUNDATION; C-M01 FOUNDATION; DB-M02 CORE DATA |

## 1. Purpose

This document defines mandatory security acceptance gates for Kritva RaaS backend implementation. It establishes the repository secret-protection invariant, records the supplied repository-scan baseline, defines measurable controls, and specifies the evidence required to accept each gate.

The gate distinguishes:

- A manual scan result from automated enforcement.
- The current working-tree state from Git history.
- Detection of a credential-shaped string from confirmation that a real credential is valid or exposed.
- Repository protection from runtime secret management.
- B-INC-001 foundation requirements from later identity, tenant-isolation, audit, and production requirements.

A gate is not passed because a control is planned, a tool is installed, or a configuration file exists. The required behavior must be exercised and evidence retained.

## 2. Non-Negotiable Security Invariant

**No real secrets or security-key material may be stored in the repository, whether in the current working tree, a commit, a branch, a tag, or generated artifacts intended for version control.**

Prohibited content includes, but is not limited to:

- Private keys and private certificates.
- Signing keys, encryption keys, and other security-key material.
- API keys, access tokens, refresh tokens, passwords, and OAuth client secrets.
- Database passwords and credential-bearing connection strings.
- Cloud credentials, service-account keys, and deployment credentials.
- Populated `.env` files or equivalent local secret files.
- Authentication headers, session cookies, or credential-bearing URLs in logs and fixtures.
- Scanner reports, snapshots, test output, or diagnostic artifacts that reproduce actual secrets.

Permitted repository content includes:

- Configuration schemas and variable names.
- Secret-manager interfaces and documented injection mechanisms.
- Nonfunctional placeholders that cannot be mistaken for real credentials.
- Documentation describing secret handling.
- Tests that generate ephemeral synthetic credentials or keys at runtime and do not persist them.
- Scanner configuration and narrowly scoped, reviewed false-positive rules that do not exempt actual secret values.

A real credential must never be committed as a test fixture or example, even if it is restricted to development use.

## 3. Security Ownership Boundaries

| Area | Required ownership |
|---|---|
| Repository secret policy and security finding disposition | Security Owner |
| Local ignore rules, hooks, and repository checks | Repository/CI Owner |
| Configuration parsing, startup validation, and logging redaction | Backend Technical Lead |
| Database credential use and database access boundaries | Backend Technical Lead with Database Technical Lead review |
| Cloud IAM, workload identity, secret-manager integration, and production secret delivery | Cloud/Infrastructure Owner |
| Identity, authentication, authorization, and tenant enforcement | Backend Technical Lead with Security Owner review |
| Official milestone acceptance | Relevant Milestone Owner |

B-INC-001 may define and test integration interfaces for externally managed secrets. It must not claim that cloud-managed secret injection, production IAM, or production key management is complete without evidence from the responsible cloud workstream.

## 4. Supplied Baseline at Commit 2c51027

### 4.1 Scan scope and reported method

The repository owner reports the following baseline:

| Field | Reported value |
|---|---|
| Repository revision | `2c51027` |
| Reported history size | 7 commits |
| Working-tree scan | Performed |
| Git-history scan | Performed |
| Scanner | detect-secrets |
| Additional checks | Regex sweep for private keys, cloud keys, tokens, and credential-bearing URLs |
| Reported findings | One local-development database URL example |
| Reported private-key findings | None |
| Reported private-certificate findings | None |
| Reported token findings | None |
| Reported API-key findings | None |
| `.gitignore` present | No |
| CI workflow present | No |
| Automated blocking enforcement | Not established |

These values are a record of the scan results supplied for this planning document. This document does not independently execute the scans or verify their output.

### 4.2 Reported finding

The reported finding is in the local-development setup documentation:

`docs/development/DEVELOPMENT_SETUP.md`

The reported value was a database URL of the form `DATABASE_URL=postgresql://<db-user>:<db-password>@127.0.0.1:5432/<db-name>` with a literal username and password filled in. The literal value is not repeated here so that this document does not itself contain a credential-shaped string.

The string contained a username and password in a database URL. The supplied information identifies it as a local-development example credential. It does not establish that the credential is used by a deployed system, is valid outside the local environment, or has been exposed to an external party.

The required action is to replace the credential-bearing example with an unmistakable, nonfunctional placeholder, inspect the resulting diff, and rescan the working tree and relevant Git history.

The replacement must not embed a real password or encourage users to reuse a committed password. Documentation must explain how a developer supplies their own local credential without committing it.

If investigation establishes that the value was a real or reused credential, the Security Owner must assess exposure and require revocation or rotation as appropriate. Changing the current file alone does not remove the earlier value from Git history.

### 4.2.1 Rescan recorded 2026-10-11

This is a manual, pattern-based rescan. It is not a scanner run, and it does not replace the scanner decision (`KR-BINC-001-008`). Matched values are deliberately not reproduced here.

| Item | Result |
|---|---|
| Method | `git grep` with Perl-compatible patterns over tracked files, run in a fresh clone in a sandbox |
| Revision scanned | The branch carrying PR #11, based on `main` at `19e1ae4` plus the changes of the preceding approval pull requests. A later scan of `main` is recorded in 4.2.2 |
| Categories | Credential-bearing URLs; private key headers; cloud access key identifiers (AKIA form); GitHub, Slack and JWT-shaped tokens; quoted password, secret, key or token assignments of 8 or more characters |
| Working tree before this change | One match: the credential-shaped URL in this document (section 4.2). `DEVELOPMENT_SETUP.md` already used a placeholder form |
| Working tree after this change | No match in any category |
| Git history | The literal was introduced in `941781f` (2026-10-10, "Implementation plan") in `docs/development/DEVELOPMENT_SETUP.md` and changed in `ba50564`. 36 of the 37 commits reachable from `origin/main` contain a credential-shaped URL. The literal stays in history |
| Refs covered | `origin/main` and the one remote branch visible to the clone. No tags exist. Forks, pull request refs, other clones and external copies were not examined |

The Security Owner is asked to assess the exposure of the earlier value in Git history. The supplied information calls it a local-development example, which this scan does not confirm or refute. Whether it was ever used outside a local environment, and whether history needs rewriting or the value needs rotation, is the Security Owner's decision. Nothing here closes SEC-GATE-005 or any other gate.

### 4.2.2 Rescan of `main` at `f7483db`, recorded 2026-10-11

This scan checks the merged state after pull requests #9 to #14. It uses the same method and categories as 4.2.1, and it is also manual, pattern-based and not a scanner run. The scan that was run on the branch of PR #12 before its merge is superseded by this one and is not relied on. Matched values are not reproduced.

| Item | Result |
|---|---|
| Revision scanned | `f7483db` (merge of PR #14), tracked files |
| Method and categories | As in 4.2.1. The credential-URL pattern requires a user name and password that are not wrapped in angle brackets, so it does not match the placeholder forms below |
| Tracked files | No match in any category |
| Placeholder forms | `DEVELOPMENT_SETUP.md` (Section 19 example) and the example form in 4.2 of this document are intentionally URL-shaped, nonfunctional placeholders with `<db-user>` and `<db-password>` markers. They are not the earlier value. "No match" means no populated credential under these patterns. It does not mean that no URL-shaped template exists |
| Git history | 40 of the 49 commits reachable from `f7483db` contain a credential-shaped URL under the same pattern. The literal was introduced in `941781f` and is absent from the tracked files from PR #11 onward. It stays in history. The count is per commit and per pattern match. It is not a count of distinct credentials or of independent exposure events |
| Refs covered | The history reachable from `f7483db` in the clone used. No tags were seen. Forks, pull request refs, other branches that were not fetched, other clones and external copies were not examined |

This does not establish that history, other refs or external copies are clean, and the exposure assessment remains pending with the Security Owner. Nothing here closes SEC-GATE-001, SEC-GATE-005, SEC-GATE-006 or any other gate.

### 4.3 Baseline interpretation

The reported scan is a manual baseline only.

It does not establish:

- That a secret scanner runs before every commit.
- That CI blocks a commit or pull request containing a secret.
- That every branch, tag, remote ref, or external copy has been examined.
- That all possible credential formats are detected.
- That the repository will remain free of secrets after the baseline scan.
- That runtime secrets are securely injected or managed.
- That production infrastructure is secure.

No clean-repository claim may be made without identifying the scan scope, method, revision, findings, and limitations.

## 5. Required Security Controls

### 5.1 Repository protection

The repository must provide appropriate ignore rules for local secret files and sensitive generated output. Ignore rules are a convenience and a preventive measure; they are not a substitute for secret scanning.

Safe examples must contain clearly nonfunctional placeholders. Configuration documentation must not require committing a populated environment file.

### 5.2 Local detection

Where supported by the approved tooling, a local pre-commit check must detect candidate secrets before a commit is created.

The team must document the limitations of local hooks, including the fact that they can be bypassed. CI enforcement remains mandatory even if local detection is implemented.

### 5.3 Blocking CI detection

CI must execute the approved scanner against the defined change scope and fail the required check when a confirmed, non-exempt secret finding is detected.

The check must:

- Run automatically for the relevant protected-branch workflow.
- Produce actionable failure information without printing secret values.
- Avoid relying on an unreviewed baseline that silently suppresses new findings.
- Use a documented and reviewed false-positive process.
- Be demonstrated with a synthetic test finding.
- Prevent acceptance when the required scan has not run or has failed.

A scanner's exit status must be interpreted according to its documented behavior. The pipeline must not accidentally convert a scanner failure, missing executable, or configuration error into a successful security result.

### 5.4 History assessment

The initial history assessment must identify the refs and commits scanned, the scanner configuration, the working-tree status, findings, and known limitations.

Future scans must cover the agreed repository history and relevant refs. If the repository grows, the scan scope must not silently shrink to the latest commit while continuing to be described as a full-history scan.

A finding in Git history must be investigated even if the affected file has since been corrected. History rewriting, if needed, must follow an approved process and must not replace credential revocation or rotation when exposure is plausible.

### 5.5 Configuration and runtime secrets

Secrets must be supplied through an approved local or deployment mechanism, not committed source files.

Required controls include:

- Validate required configuration during startup.
- Fail safely when mandatory configuration is absent or invalid.
- Do not include secret values in startup errors.
- Redact credentials, authorization headers, cookies, and sensitive connection-string fields from logs.
- Do not return secret values in API responses.
- Do not put long-lived secrets in browser applications or client binaries.
- Keep development, test, staging, and production credentials separate.
- Use the appropriate external secret-management and identity facilities for deployed environments.

### 5.6 Key management

Key-management documentation and interfaces may be version-controlled. Actual private keys, private certificates, signing-key material, and encryption-key material may not.

Runtime generation of ephemeral test keys is permitted when the test controls their lifecycle, does not persist them in the repository, and does not print their private material.

Key rotation, revocation, storage, access control, and production lifecycle are subject to the key-management requirements and the ownership of the responsible infrastructure workstream.

## 6. Measurable Security Gate Criteria

Each criterion has a stable ID, a binary pass/fail condition, required evidence, and an increment that it blocks.

A criterion passes only when all conditions in its pass definition are satisfied. A criterion that has not been tested or lacks required evidence is not passed.

| ID | Criterion and pass/fail condition | Evidence to retain | Blocking increment |
|---|---|---|---|
| SEC-GATE-001 | **Repository baseline and finding disposition. PASS:** the working tree and the agreed Git-history scope have been scanned; the reported `DATABASE_URL` example is replaced with an unmistakable nonfunctional placeholder; findings and limitations are documented; the rescan result is inspected. **FAIL:** the credential-bearing example remains, scan scope is unknown, or findings lack disposition. | Scanner name/version, commands or reproducible procedure, revision, commit/ref coverage, safe scan summary, finding disposition, diff review, and rescan result. Never retain actual secret values in the report. | B-INC-001 |
| SEC-GATE-002 | **Ignore rules. PASS:** appropriate rules cover the approved local secret-file patterns and sensitive generated outputs; tracked-file checks show that adding an ignore rule has not been mistaken for removing an already tracked file. **FAIL:** required patterns are missing or tracked sensitive files remain unaddressed. | Reviewed ignore-file diff, test commands, results for representative filenames, and tracked-file inspection results. | B-INC-001 |
| SEC-GATE-003 | **Safe configuration examples. PASS:** all committed examples use clearly nonfunctional placeholders and no populated credential values; documented setup can obtain local values without committing them. **FAIL:** an example embeds an actual credential or a reusable example password. | File review, example-configuration validation output, and relevant documentation review. | B-INC-001 |
| SEC-GATE-004 | **Local secret detection. PASS:** the approved local check detects a synthetic secret before commit under the documented workflow, or a reviewed decision explicitly records why a local hook is unsupported while retaining mandatory CI enforcement. **FAIL:** the local check is silently absent or claimed as passing without a demonstrated test. | Tool and configuration versions, safe synthetic test procedure, observed result, and any approved limitation. | B-INC-001 |
| SEC-GATE-005 | **Blocking CI detection. PASS:** a required CI check runs the approved scanner; a synthetic finding makes the check fail; scanner execution/configuration failures also fail closed; output does not reveal the test secret. **FAIL:** the check is optional, skipped, nonblocking, or demonstrated only with a clean repository. | Workflow diff, required-check configuration, synthetic finding test result, failure logs with the synthetic value redacted, and clean-run result. | B-INC-001 |
| SEC-GATE-006 | **History coverage. PASS:** the agreed refs and history have been scanned; coverage and limitations are recorded; every finding has a disposition; any confirmed exposure is handled through the approved response process. **FAIL:** the scan covers only the current file while being described as full history, or findings remain unassessed. | Revision/ref inventory, scanner configuration, safe result summary, findings and dispositions, and documented scope limitations. | B-INC-001 |
| SEC-GATE-007 | **Secret-exposure response. PASS:** a documented procedure identifies escalation ownership, exposure assessment, revocation or rotation when appropriate, remediation, and verification; a review or tabletop exercise demonstrates that the procedure can be followed. **FAIL:** response ownership or required remediation steps are absent. | Approved procedure, exercise/review record, and follow-up actions. Use synthetic examples; do not include exposed values. | B-INC-001 |
| SEC-GATE-008 | **Startup configuration safety. PASS:** automated tests prove that missing and malformed required settings fail startup or readiness according to the contract, and failure output excludes the test secret. **FAIL:** the service accepts invalid required configuration or exposes secret values. | Test cases, command, result, and redacted output tied to the tested revision. | B-INC-001 |
| SEC-GATE-009 | **Logging redaction. PASS:** automated tests inject synthetic credentials into representative logging paths and verify that the emitted logs contain none of the tested secret values. **FAIL:** any tested secret value appears in emitted logs or the test does not cover the relevant path. | Test source, test command, result, and sanitized captured log evidence. | B-INC-001 |
| SEC-GATE-010 | **Scanner exception control. PASS:** false-positive handling is documented, narrowly scoped, reviewable, and auditable; a suppression cannot authorize committing an actual secret. **FAIL:** broad or unreviewed exclusions hide meaningful findings. | Scanner configuration, reviewed exception policy, synthetic test results, and exception approval record where applicable. | B-INC-001 |
| SEC-GATE-011 | **Database credential handling. PASS:** application configuration and examples do not require committed database credentials; logs and errors redact credential-bearing URL components; database integration tests use controlled test credentials supplied outside tracked files. **FAIL:** credentials are embedded in source, examples, test fixtures, or logs. | Configuration tests, database-test setup, sanitized logs, and source/fixture review. | B-INC-001 |
| SEC-GATE-012 | **Secret-safe evidence. PASS:** security reports, test artifacts, scanner output, and retained logs do not expose actual secrets; evidence records identify scope and revision. **FAIL:** retained evidence includes a real credential or omits enough context to verify the claim. | Evidence review checklist, safe artifact samples, revision metadata, and test/scan summaries. | B-INC-001 |
| SEC-GATE-013 | **Security gate execution and review. PASS:** every mandatory B-INC-001 security criterion has been tested, its evidence inspected, and its result recorded; unresolved mandatory failures block acceptance. **FAIL:** a criterion is merely planned, untested, or marked passed without evidence. | Completed gate matrix, evidence references, reviewer disposition, and outstanding-findings list. | B-INC-001 |

## 7. Gate Execution Rules

### 7.1 Pass, fail, and blocked

- **Pass:** the criterion's full pass condition is demonstrated and evidence is retained.
- **Fail:** evidence demonstrates that the pass condition is not satisfied.
- **Blocked:** the criterion cannot be tested because a dependency, decision, or environment is unavailable.
- **Not run:** no valid execution result exists.

Blocked and Not run are not equivalent to Pass. Any mandatory criterion that is not passed blocks acceptance of the increment named in the criterion.

### 7.2 Finding severity and disposition

A scanner finding must be investigated and classified by the responsible owner. A credential-shaped string is not automatically proof of a live secret, but it must not be ignored solely because it appears in documentation or has a local-development label.

For suspected actual credential exposure:

1. Restrict further exposure and notify the Security Owner.
2. Identify the credential type, owner, potential scope, and likely exposure window without copying the value into reports.
3. Revoke or rotate the credential when exposure is plausible or confirmed.
4. Remove the value from current files and remediate affected history according to the approved procedure.
5. Rescan the relevant working tree, refs, and history.
6. Record remediation evidence and residual limitations.

Removing a value from the current version does not by itself resolve a historical exposure.

### 7.3 No secret-based exceptions

No review, deadline, test requirement, or false-positive rule may authorize committing real security-key material or credentials. A required gate may not be waived to permit prohibited material.

A false-positive exception must refer to a narrowly defined rule or finding, not embed a secret value in an allowlist. The exception must be reviewed and must not disable scanning of unrelated content.

## 8. Relationship to Other Security Requirements

This document defines repository and backend acceptance gates. It does not replace the detailed requirements in:

- [Secret management](../../docs/security/SECRETS_MANAGEMENT.md)
- [Key management](../../docs/security/KEY_MANAGEMENT.md)
- [Backend architecture](../../docs/backend/architecture/BACKEND_ARCHITECTURE.md)
- [API contract](../../docs/protocol/API_CONTRACT.md)
- [Coding-agent integration](../../docs/architecture/CODING_AGENT_INTEGRATION.md)

The backend must satisfy these requirements in the scope applicable to each increment. Conflicts or missing requirements must be referred to the relevant technical and security owners rather than resolved through an undocumented local exception.

## 9. Current Status

The reported scan at `2c51027` is a manual baseline. The reported private-key, certificate, token, and API-key checks found no matches. The reported local-development database URL example was replaced in the working tree, and a sanitized pattern-based rescan of tracked files is recorded in section 4.2.1 (2026-10-11).

Current evidence, kept separate:

| Item | State |
|---|---|
| Current-file remediation and sanitized working-tree rescan | Recorded in section 4.2.1 |
| Exposure assessment of the earlier value in Git history | Pending with the Security Owner. Not decided, and not decided by the secret-handling policy approval |
| Automated scanner selection and enforcement | Not established. The manual rescan is not a scanner run (`KR-BINC-001-008` is on hold) |
| Gate closure | Not asserted |

No `.gitignore` or CI workflow existed at that reported baseline, and automated blocking enforcement has not been established by the supplied evidence.

Accordingly:

- SEC-GATE-001 is not passed until the Security Owner has reviewed the recorded evidence, assessed the history exposure and recorded the finding disposition. The example is replaced and the working-tree rescan is recorded, but the disposition is still outstanding.
- SEC-GATE-002 through SEC-GATE-013 are not passed merely because they are specified here.
- B-INC-001 cannot be accepted until its mandatory security criteria pass.
- The current baseline must not be described as CI-enforced or as proof that all repository history and external copies are clean.

The Security Owner is responsible for reviewing the completed evidence and recording the final gate disposition.
