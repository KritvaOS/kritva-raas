# Kritva RaaS — Session Handoff

Updated: 11-10-2026 (PR #5 to PR #37 recorded; backend transport, configuration and API v1 routing merged; error envelope decision merged in PR AD; request-ID part of KR-BE-1-005 merged in PR AE (PR #39); response contract in PR AF). For any Claude session (any model) continuing work on KritvaOS/kritva-raas

## 1. Repositories

| Item | Value |
|---|---|
| Repo | `KritvaOS/kritva-raas` (proprietary; SPDX `LicenseRef-KritvaOS-Proprietary`) |
| Local folder on Dinesh's machine | `/home/dinesha/workarea/kritvaOS/kritva-raas` |
| Reference repo | `KritvaOS/kritva-core` (Apache-2.0; source of the header standard and Makefile style) |
| `main` at last check | `fb01b9e` (PR #37). This line is always one PR behind: run `git ls-remote origin HEAD` for the real head |

## 2. How we work

1. **ChatGPT is the reviewer.** Dinesh pushes, ChatGPT reviews, Claude reads the review in ChatGPT (built-in browser, chat "Raas Implementation"), verifies each claim against the repo, fixes, and aligns with ChatGPT before committing. ChatGPT cannot see unmerged work, so paste the relevant sections into the message.
2. **Commits use ChatGPT-aligned text** (scope is always `backend`):

   ```
   <type>(backend): <summary> [<TASK-ID>]

   Tasks: ...
   Acceptance: ...
   Tests: ...
   Security-Gates: ...
   Evidence: ...
   ```
   Task trailers must equal the task's entry in the increment `TASKS.md` (the traceability checker enforces this). A planning-only or record-correction commit uses `Tasks: None (<reason>)` with the other trace fields Not applicable (`GIT_COMMIT_STEP.md` Section 4.1). Never attach a task ID or a task-ID union to a commit that does not implement those tasks. Attribution trailers are `Co-Authored-By` and `Claude-Session`; whether to keep the `Claude-Session` trailer is an open owner decision (PB-011).
3. **Patch delivery** (Claude has no shell on Dinesh's machine):
   - Claude commits in a cloud clone, verifies `git am` plus `make check` on a fresh clone of the real base, runs `git format-patch`, and delivers a folder `claude-patches-<name>/` to the repo folder on the device (via SendUserFile, then device_commit_files). The folder holds the patch(es), `PR-description.md` (a `# PR title` section and a `# PR description` section) and `run.sh`.
   - **Default flow (owner standard, 10-10-2026): the PR is created from the terminal, not the GitHub web form.** The user runs one command: `bash claude-patches-<name>/run.sh`. It stops at the first failure, deletes nothing, and: checks `gh`, aborts a stale `git am`, refuses if files are staged, switches to `main` and pulls, creates the branch, applies the patches, runs `make check`, pushes, and runs `gh pr create` with the title and the body taken from `PR-description.md`. Stacked PRs add a guard that stops with a message when the earlier PR is not merged yet, so merge in order. After the merge the user deletes the folder with `rm -rf claude-patches-<name>`.
   - The generator used in the cloud session was a small shell script (`mk_run.sh <outdir> <folder> <branch> <title>`); recreate it if the session is new. Do not use a branch name with `/` in a file name without `tr / -`.
   - `gh` is installed and signed in on Dinesha's machine (scopes repo/workflow/read:org/gist). If PR creation says "No commits between main and <branch>", check whether the PR was already created and merged (merged branches are deleted automatically).
   - Fallbacks: if `gh` is missing or signed out, open the compare page and paste the title and body, or ask Claude to fill the form in the built-in browser (needs the user's explicit yes).
   - If `git am` fails with a dirty-index error, or leaves `.git/rebase-apply`, run `git am --abort` and fix the index first (`git restore --staged <file>`). If it fails because local `main` is stale: `git am --abort; git fetch; git reset --hard origin/main`, then re-apply.
   - `.github/` paths cannot be written to the device; send those files as attachments.
4. **Every patch delivery includes a consolidated PR title and description**: summary, scope and exclusions, commit list with subjects, task / AC / test / security-gate table where tasks are involved, task status and that linked tests are NOT RUN unless run, validation actually performed, owner approvals pending, follow-ups.
5. **Verify after each push or merge** via the GitHub API in the built-in browser (`api.github.com/repos/KritvaOS/kritva-raas/pulls`, `.../commits/<sha>/check-runs`). `fetch()` from an api.github.com tab fails; navigate and read the page text, and for large JSON save it and parse with python. Read access with `git fetch` and `git ls-remote` from the cloud sandbox works; writes (gh, push) do not. Always base a new branch on the real `origin/main` and confirm the base SHA before editing.
6. **Do not open or edit a PR for the user without an explicit yes.** Creating a PR publishes content.

## 3. Repository checks

| Command | What it does |
|---|---|
| `make check` | Runs every check below; required before every PR |
| `make header-test` | 20 unit tests for the header checker |
| `make header-check` | `scripts/lint/check_source_headers.py --mode tracked --strict`; scans only tracked files, so `git add` new files first |
| `make docs-check` | `scripts/docs/check_docs.py` (0 problems expected; about 1811 legacy warnings are known). Broken relative links in new docs fail it |
| `make traceability-check` | `scripts/docs/check_backend_traceability.py` |
| `make approvals-test`, `make approvals-check` | 28 unit tests and the check for the approval packages (`scripts/docs/check_backend_approvals.py`). Since PR #9 an Approved decision record needs a row for every required approver (from its Task Record), every row Approved with a date and evidence |
| `make build/test/lint/format/format-check` | Fail on purpose until toolchain decisions KR-BINC-001-001 to 004 are made |

CI: `source-header-check` and `docs-check` (the `docs-check` job also runs the approval checker). Ruleset 24843399 on the default branch: no deletion, no force-push, required checks `source-header-check` and `docs-check`, pull request required (0 approvals), no bypass.

## 4. Key documents

- `docs/planning/backend/` — program plan, task register, dependency map, security gate (SEC-GATE-001 to 013), test strategy (BTS-001 to 037), acceptance criteria (BAC-001 to 039), risk register, resource plan, `BACKEND_CHANGELOG.md` (PB-001 to PB-021 on `d5fcb39`; PB-022 and PB-023 merged (#19, #20); PB-024 merged (#21); PB-025 merged (#22); PB-026 in PR O).
- `docs/planning/backend/increments/B-INC-001` to `B-INC-004` — 8 files each. B-INC-001 has 21 criteria and 29 tasks.
- `docs/planning/backend/decisions/` — approval workflow and packages: README, `approvals/APPROVAL-<DECISION-ID>-<slug>.md`. The decision record in its increment `decisions/` directory is the only source of truth for the final disposition.
- `docs/development/SOURCE_HEADER_STANDARD.md`, `docs/security/SECRETS_MANAGEMENT.md`, `docs/security/KEY_MANAGEMENT.md`, `Makefile`.

## 5. Status

Done and accepted: KR-BINC-001-018 (PR #2) and KR-BINC-001-019 (PR #4). Audit findings RAAS-AUD-01, 03 to 06 closed; RAAS-AUD-02 stays open by design. KR-BINC-001-001 and -002 are In Review with their records Approved on 11-10-2026 by Dinesh as Backend Technical Lead (PR M, PB-024; he is also the owner who directed them, stated in the records); KR-BINC-001-005 is In Review with its record Proposed, nothing else Accepted, linked tests NOT RUN, no security gate closed.

## 6. B-INC-001 history and current state

- **PR #5** (`914e555`): non-task planning commit, then decision records for KR-BINC-001-005, 001 and 002. **PR #6** (`8bc4558`): references, Batch B order, planning-only commit rule. **PR #7** (`13c5a91`): decisions README, three Draft approval packages, the approval checker, PB-012. **PR #8** (`19e1ae4`): this handoff file.
- An independent external audit of `main` at `19e1ae4` (ChatGPT) led to three PRs, all merged with required checks:
  - **PR #9** (PB-013): checker hardening: an Approved record must have every required approver Approved, not just no Pending row.
  - **PR #10** (PB-014): runtime compatibility evidence recorded (executed in a sandbox, partial) and the runtime approval package now says approval waits for the Section 6 evidence. Findings: Node.js 24.21.0 came from the npm registry package, not nodejs.org, so no official checksum was verified; npm 10.9.4 was used, not the bundled npm 11; TypeScript 6 needs an explicit `rootDir` (TS5011); TypeScript 7.0.2 compiled the sample with no deprecated option reported; typescript-eslint 8.71.1 declares support only for TypeScript below 6.1.
  - **PR #11** (PB-015): the credential-shaped URL removed from `BACKEND_SECURITY_GATE.md`; sanitized rescan in section 4.2.1. The literal remains in Git history (36 of 37 commits on `origin/main`, introduced in `941781f`). Exposure assessment is pending with the Security Owner.
- **Merged on 11-10-2026:** **PR #12** (PB-016, `b74eda2`): corrections to the secret-handling record and approval package after an independent ChatGPT review (gate record section 9, the open history finding surfaced, S4 and test-credential wording, URL, nested-error and telemetry redaction, drop-on-failure, exposure assessment fields). **PR #13** (PB-017, `f8a875e`): the KR-BE-1-001 implementation plan (`plans/KR-BE-1-001-application-structure-plan.md`), revised after a ChatGPT review. **PR #14** (`f7483db`): this handoff.
- **External re-audit of `main` at `f7483db` (ChatGPT, 11-10-2026):** closed: finding 1 (checker), the 005 corrections, the plan revisions. Partly closed: finding 2 (wording fixed; runtime evidence still partial, which blocks approving 001 and so KR-BE-1-001) and finding 4 (value removed from current files; Git-history exposure pending with the Security Owner). New: N-01 rescan evidence needed an exact revision and an explicit placeholder note; N-02 this handoff was stale; N-03 six changelog entries said "Pending"; N-04 S4 runtime boundary wording. **PR #15** (PB-018, `8f1964d`) addressed N-01 to N-04: gate record section 4.2.2 (rescan of `f7483db`: no match in tracked files; 40 of 49 commits in history contain a credential-shaped URL under the pattern, per commit and not per credential), real SHAs in the changelog, the S4 sentence, and the handoff.
- **Second re-audit of `main` at `8f1964d` (ChatGPT, 11-10-2026):** N-01, N-03 and N-04 closed; N-02 partly (this file is always one PR behind). New P1: the 005 package and record still pointed to the superseded rescan 4.2.1 and said no scan result existed to review; **PR H** (PB-019) fixed that (package revision 3, merged as PR #16). ChatGPT then confirmed the 005 package is ready to send. ChatGPT drafted the two requests: Security Owner (approve the policy, and separately assess the history finding, never copying the value) and Cloud/Infrastructure Owner (review the cloud boundary, controlled cryptographic interface for high-value keys, distinct database identities). Neither request may claim redaction, startup validation, scanning, CI enforcement, history cleanup or production secret delivery exists, or that any gate is closed. Move the package to Requested only when the requests are actually sent.
- **Blockers for approving 001 (ChatGPT, priority order):** (1) Backend Technical Lead picks the Node.js 24 patch and the pin policy; (2) verify the release against official nodejs.org checksums (sandbox cannot reach nodejs.org; needs Dinesh's machine or another network-enabled runner); (3) show the npm bundled with that Node.js works (sandbox can, with the official binary); (4) settle the TypeScript 7.0.2 scope (suggested: approve 6.0.3 as baseline, 7.0.2 a later candidate); (5) finalize the compatibility shortlist (framework and migration tool undecided; Database Technical Lead for migrations). Then approve 001, then 002, then unblock KR-BE-1-001.
- **001 decisions on 11-10-2026:** Dinesh agreed to keep TypeScript 6.0.3 as the baseline and defer 7.0.2 (not a Backend Technical Lead approval). PR I records a pin-method proposal (`.node-version` canonical exact pin, matching `engines.node`, `engine-strict=true`, official distribution only, bundled npm recorded per pin change, CI consistency check for KR-BINC-001-017) as a recommendation, and the evidence fields for the official distribution check (decision record Section 6.1). PR I is merged (#17, `62ca09d`). PR J (PB-021, merged as #18, `d5fcb39`) records the official check Dinesh ran with a throwaway script on 11-10-2026: Node.js 24.21.0 from nodejs.org, SHA-256 matched, bundled npm 11.19.0, install scripts disabled, `npm ci` and the toolchain passed, a mismatched lockfile was rejected. The first run did not verify the manifest signature. Dinesh then required the key to be authenticated; a second throwaway script (PR K, PB-022) fetched key `5BE8A3F6C8A5C01D106C0AD820B1A390B168D356` by full fingerprint from keys.openpgp.org, matched it to the fingerprint he copied from the nodejs/node README, and both signature files verified (exit 0). No web-of-trust certification; both sources are Node.js project channels; v24.21.0 only. Owner direction on 11-10-2026 (PR L, PB-023, not a Backend Technical Lead approval): pin proposal A with a digest-pinned container image added later for deployment; Fastify as the preferred candidate for KR-BINC-001-003 (still to be decided there); node-pg-migrate, graphile-migrate and dbmate as the KR-BINC-001-004 shortlist (Database Technical Lead review; flags: graphile-migrate stable is from 2022 with a 2.0 RC, dbmate ships a native binary). Still open: the Backend Technical Lead approval of the pin method and the 001 and 002 dispositions, and the later KR-BINC-001-003 and KR-BINC-001-004 decisions. The 005 review requests were drafted for Dinesh to send; the package moves to Requested only after they are sent.
- **Open owner questions for the plan:** application directory (`apps/backend` in the setup and branching docs, `apps/control-plane` in the header standard example); the setup document shows a root pnpm and turbo layout while 002 recommends npm; ignore rules (`KR-BINC-001-006` first, or a narrow `apps/backend/.gitignore`). Command contract learned in a sandbox: compile tests with tsc, then `node --test` on the explicit compiled file path (a directory argument failed).
- **Recommendations (not approvals):** Node.js 24 LTS pinned exactly (Node 26 after it enters LTS on 2026-10-28); TypeScript 6.0.3 baseline with 7.0.2 as an upgrade candidate; npm with `package-lock.json` and `npm ci`. The runtime record must still state the pin mechanism, the exact Node.js and npm releases and the checksum source.
- **Batch B order** (readiness Section 4): approvals of 001, 002 and 005; KR-BE-1-001; KR-BE-1-002; KR-BINC-001-003 and 004; the 008 comparative scanner evaluation in parallel. KR-BE-1-001 stays blocked until 001 and 002 are approved.
- **KR-BINC-001-008 is held**: only a detect-secrets 1.5.0 trial exists (missing file argument and plain `scan` fail open). gitleaks and trufflehog need a machine with network access.
- **PR AE (PB-042), KR-BE-1-005 request ID only, In Review:** `src/shared/request-context.ts` (AsyncLocalStorage `RequestContext { requestId }`, server-generated `req-<uuid>`), `src/transport/request-context.ts` (first onRequest hook, `X-Request-ID` header on every response, `request_id` in the error body). Client `X-Request-ID` and `X-Correlation-ID` are ignored and not echoed. Not done: correlation (KR-BE-1-008), principal and tenant, so AC-07 and BTS-006 are not satisfied and SEC-GATE-009 stays open. Suite 67 tests. Success-response wrapping is still undecided.
- **PR AF (PB-043), REST API v1 response contract, Approved by Dinesh choosing Option A:** success and error responses both use the full RESPONSES.md envelope; request_id server-generated = X-Request-ID; client IDs ignored; METHOD_NOT_ALLOWED and PAYLOAD_TOO_LARGE registered, RESOURCE_GONE deferred; SEC-GATE-009 stated as logging redaction (links unchanged). Record `decisions/KR-BE-1-007-response-contract.md`. KR-BE-1-007 is ready to start next (full envelope helper, success helper, tests). Parallel: AC-05 evidence, reviews of 003/004/005/006, owner replies pending. Still open: success codes per endpoint, correlation (KR-BE-1-008), whether to remove the SEC-GATE-009 link from AC-08/006/007, BACKEND_ARCHITECTURE/API_ARCHITECTURE unchecked.
- **Next steps (start only when Dinesh asks):** PR AD (PB-041, merged) records the owner's decision: the canonical REST error envelope is the full RESPONSES.md envelope with the ERROR_CODES.md registry, and API_CONTRACT.md Sections 18 and 20 are reconciled. Open before KR-BE-1-007: success-response wrapping (not decided), request-ID source (recommend the request-ID part of KR-BE-1-005 first), proposed registry additions METHOD_NOT_ALLOWED, PAYLOAD_TOO_LARGE, RESOURCE_GONE (not approved), SEC-GATE-009 mapping to AC-08. ChatGPT's order: error decision; fix gate mapping and handoff; advance AC-05 evidence independently; refine KR-BE-1-005 scope; independent reviews of 003/004/006; then KR-BE-1-007. BTS-032 is not satisfied (component tests only). 005 package Requested; replies pending from Security Owner, Cloud owner and Database lead (KR-BINC-001-004).
- **Open owner decisions:** the `Claude-Session` trailer (PB-011); approvals of 001, 002 and 005; the Git-history exposure disposition; the three plan questions.
- Web search is disabled for the organization. Version facts were read through the built-in browser and the npm registry (reachable from the sandbox; nodejs.org is blocked from it).

## 7. Lessons learned

- Derive a task's test and gate traces from the union of its linked ACs; do not copy IDs from ChatGPT without checking them.
- Verify a reviewer's claims against the files before applying them (section numbers, status wording). The 005 review's claims all checked out, and the one factual fix needed was verified first.
- In ChatGPT, type into the main chat composer, not a "Writing" canvas block. Read the full reply with a JS slice of `main.innerText`, because page-text output truncates and the reply may still be streaming.
- Keep "docs checks passed", "decision reviewed", "decision approved", "task accepted" and "gate closed" as separate states. Task evidence can contribute to a gate without closing it.
- Try a command contract before writing it into a plan: `node --test <directory>` failed in the sandbox, and a `sed` edit of a one-line JSON file silently changed nothing. Edit JSON with a JSON library.
- A shell block that deletes the patch folder can destroy the only copy when `git am` fails; run.sh deletes nothing and cleanup is a separate last step by the user.
- A reviewer's "closed" claim can still leave a pointer to a superseded section behind; after adding a new record section, grep for every reference to the old one.
- A new changelog entry always says "Pending until this change is merged"; fill the real SHA in the next correction cycle (the re-audit flagged stale Pending fields).
- Stacked PRs: each later changelog entry sits next to the earlier one, so apply and verify the whole chain on a fresh clone of the real base; check the base SHA (`git ls-remote origin HEAD`) because a local mirror can be stale.
- GitHub shows a billing warning banner on the repository (payment method); it can stop Actions runs. Owner to fix.
- Dinesh's `git pull` can revert local edits Claude made on the device; re-check files before relying on them.
- A delivery script that narrows `PATH` (to use a pinned Node) must restore the original `PATH` before calling `gh` (PR O failed at `gh pr create` for this reason).
- When a plan places a file, check it against the approved decision text before building (the `.node-version` location was wrong in the plan and caught only by the BTS-036 review).
