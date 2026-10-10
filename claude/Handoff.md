# Kritva RaaS — Session Handoff

Updated: 10-10-2026 (PR #5 to PR #7 recorded; default PR-creation flow). For any Claude session (any model) continuing work on KritvaOS/kritva-raas.

## 1. Repositories

| Item | Value |
|---|---|
| Repo | `KritvaOS/kritva-raas` (proprietary; SPDX `LicenseRef-KritvaOS-Proprietary`) |
| Local folder on Dinesh's machine | `/home/dinesha/workarea/kritvaOS/kritva-raas` |
| Reference repo | `KritvaOS/kritva-core` (Apache-2.0; source of the header standard and Makefile style) |
| `main` at last check | `13c5a91` — Merge PR #7 (decision-approval packages) |

## 2. How we work

1. **ChatGPT is the reviewer.** Dinesh pushes, ChatGPT reviews, Claude reads the review in ChatGPT (built-in browser, chat "Raas Implementation"), fixes, and aligns with ChatGPT before committing.
2. **Commits use ChatGPT-aligned text** (scope is always `backend`):

   ```
   <type>(backend): <summary> [<TASK-ID>]

   Tasks: ...
   Acceptance: ...
   Tests: ...
   Security-Gates: ...
   Evidence: ...
   ```
   Task trailers must equal the task's entry in the increment `TASKS.md` (the traceability checker enforces this). A planning-only or record-correction commit uses `Tasks: None (<reason>)` with the other trace fields Not applicable (`GIT_COMMIT_STEP.md` Section 4.1). Never attach a task ID or a task-ID union to a commit that does not implement those tasks.
3. **Patch delivery** (Claude has no shell on Dinesh's machine):
   - Claude commits in a cloud clone, verifies `git am` plus `make check` on a fresh clone, runs `git format-patch`, and writes the patches plus the PR title/description file to `<repo>/claude-patches-<name>/` on the device. The files are already on the device; no download is needed.
   - **Default flow (owner standard, 10-10-2026): the PR is created from the terminal, not typed into the GitHub web form.** Every delivery includes the exact command block, chained with `&&` so it stops at the first failure and nothing is deleted before the push succeeds:
     ```
     cd /home/dinesha/workarea/kritvaOS/kritva-raas
     git status --short            # if it shows a staged file (e.g. claude/Handoff.md): git restore --staged <file>
     git am --abort 2>/dev/null; git switch main && git pull
     git switch -c <branch>
     git am claude-patches-<name>/*.patch && git log --oneline -5
     make check && git push -u origin <branch>
     sed -n '/^# PR description/,$p' claude-patches-<name>/PR-description-<name>.md | tail -n +3 > /tmp/pr-body.md
     gh pr create --base main --head <branch> --title "<PR title>" --body-file /tmp/pr-body.md
     rm -rf claude-patches-<name>
     ```
   - Fallbacks: if `gh` is not installed or signed in (`gh auth status`), open the compare page and paste the title and body, or ask Claude to fill the form in the built-in browser (needs the user's explicit yes).
   - If `git am` fails with a dirty-index error, or leaves `.git/rebase-apply`, run `git am --abort` and fix the index first. Never run `rm -rf` on the patch folder in the same chain before the patches applied.
   - If `git am` fails because local `main` is stale: `git am --abort; git fetch; git reset --hard origin/main`, then re-apply.
   - `.github/` paths cannot be written to the device; send those files to Dinesh as attachments.
4. **Every patch delivery includes a consolidated PR title and description** for tracking: summary, scope and exclusions, commit list with subjects, task / AC / test / security-gate table, task status (Proposed / In Review / Accepted) and that linked tests are NOT RUN unless run, validation actually performed, owner approvals pending, follow-ups, and a rollback note. PR #5 and PR #6 were opened with the default title and an empty body, which is why rule 3 now sets them from the terminal.
5. **Verify after each push/merge** via the GitHub API in the built-in browser (`api.github.com/repos/KritvaOS/kritva-raas/pulls`, `.../commits/<sha>/check-runs`). `gh`/`curl` from the cloud sandbox are blocked; the session has no GitHub access to the repo. `fetch()` from an api.github.com tab fails; read the JSON from the page text after navigating.
6. **Do not open or edit a PR for the user without an explicit yes.** Creating a PR publishes content.

## 3. Repository checks

| Command | What it does |
|---|---|
| `make check` | Runs every check below; required before every PR |
| `make header-test` | 20 unit tests for the header checker |
| `make header-check` | `scripts/lint/check_source_headers.py --mode tracked --strict`; scans only tracked files, so `git add` new files first |
| `make docs-check` | `scripts/docs/check_docs.py` (0 problems expected; about 1811 legacy warnings are known) |
| `make traceability-check` | `scripts/docs/check_backend_traceability.py` |
| `make approvals-test`, `make approvals-check` | 18 unit tests and the check for the approval packages (`scripts/docs/check_backend_approvals.py`; added in PR #7) |
| `make build/test/lint/format/format-check` | Fail on purpose until toolchain decisions KR-BINC-001-001 to 004 are made |

CI: `source-header-check` and `docs-check` (the `docs-check` job also runs the approval checker). Ruleset 24843399 on the default branch: no deletion, no force-push, required checks `source-header-check` and `docs-check`, pull request required (0 approvals), no bypass.

## 4. Key documents

- `docs/planning/backend/` — program plan, task register, dependency map, security gate (SEC-GATE-001 to 013), test strategy (BTS-001 to 037), acceptance criteria (BAC-001 to 039), risk register, resource plan, `BACKEND_CHANGELOG.md` (PB-001 to PB-012).
- `docs/planning/backend/increments/B-INC-001` to `B-INC-004` — 8 files each. B-INC-001 has 21 criteria and 29 tasks.
- `docs/planning/backend/decisions/` — approval workflow and packages (PR #7): README, `approvals/APPROVAL-<DECISION-ID>-<slug>.md`. The decision record in its increment `decisions/` directory is the only source of truth for the final disposition.
- `docs/development/SOURCE_HEADER_STANDARD.md`, `docs/architecture/CODING_AGENT_INTEGRATION.md`, `Makefile`.

## 5. Status

Done and accepted: KR-BINC-001-018 (PR #2) and KR-BINC-001-019 (PR #4). Audit findings RAAS-AUD-01, 03 to 06 closed; RAAS-AUD-02 stays open by design.

## 6. B-INC-001 Batch A and follow-ups (10-10-2026)

- **PR #5** (merge `914e555`): non-task planning commit `c815f5b`, then decision records for KR-BINC-001-005 (`d82d0d6`), 001 (`681abf0`) and 002 (`2341ffd`). Tasks are In Review, records Proposed, nothing Accepted, linked tests NOT RUN. An independent external audit found no reason to revert.
- **PR #6** (merge `8bc4558`): PR #5 references, explicit Batch B order, planning-only commit rule. Checks green on head `abeef74`.
- **PR #7** (merge `13c5a91`, 3 commits, 16 files, +840/-5): decisions README, three Draft approval packages, the approval checker with 18 tests, PB-012. Required checks green on head `7a97fd2` (source-header-check 114269756787 and 114269860757, docs-check 114269756968 and 114269861229) and on main after the merge (source-header-check 114270006209, docs-check 114270006260). The PR title was left at the default and the body was empty.
- Recommendations (not approvals): Node.js 24 LTS pinned exactly (Node 26 after it enters LTS on 2026-10-28); TypeScript 6.0.3 baseline with 7.0.2 as an upgrade candidate (`typescript-eslint` declares TypeScript `>=4.8.4 <6.1.0`); npm with `package-lock.json` and `npm ci`.
- **Batch B order** (readiness Section 4): approvals of 001, 002 and 005; KR-BE-1-001; KR-BE-1-002; KR-BINC-001-003 and 004; the 008 comparative scanner evaluation in parallel. KR-BE-1-001 stays blocked until 001 and 002 are approved.
- **KR-BINC-001-008 is held**: only a detect-secrets 1.5.0 trial exists (missing file argument and plain `scan` fail open). gitleaks and trufflehog need a machine with network access.
- Other open work (start only when Dinesh asks): optional ruleset hardening (strict up-to-date checks, pin required checks to GitHub Actions, rename the ruleset to `main-protection`); remaining B-INC-001 tasks, then B-INC-002 to 004. B-INC-001-AC-19 and SEC-GATE-003 stay open because other tasks share them.
- Open owner decisions: the `Claude-Session` commit trailer (PB-011); approvals of 001, 002 and 005.
- Web search is disabled for the organization. Version facts were read through the built-in browser from nodejs.org, the `nodejs/Release` schedule and the npm registry.

## 7. Lessons learned

- Derive a task's test and gate traces from the union of its linked ACs; do not copy IDs from ChatGPT without checking them.
- In ChatGPT, type into the main chat composer, not a "Writing" canvas block. Read the full reply with a JS slice of `main.innerText`, because page-text output truncates.
- Keep "docs checks passed", "decision reviewed", "decision approved", "task accepted" and "gate closed" as separate states.
- A chained shell block that deletes the patch folder can destroy the only copy when `git am` fails; chain with `&&` and delete last.
- Dinesh's `git pull` can revert local edits Claude made on the device; re-check files before relying on them.
