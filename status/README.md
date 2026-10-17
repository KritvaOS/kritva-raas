# RaaS status report

`status.json` is this repository's machine-readable status report for the kritva-program consolidator (schema 2.0, vendored as `status.schema.json`; SHA-256 in `status.schema.json.sha256`, verified in CI). It is generated, never hand-edited:

```
python3 scripts/status/gen_status.py                 # write status/status.json
python3 scripts/status/gen_status.py --check         # local: full comparison
python3 scripts/status/gen_status.py --check-facts   # CI: planning-derived facts only
python3 -m unittest discover -s tests/status_report
```

(`make status-gen-test` and `make status-gen-check` run the last two checks.)

## Scope

Every task in the `TASKS.md` of B-INC-001 to B-INC-004 (67 tasks). KR-BE-1-044 and KR-BE-1-045 appear in B-INC-002 and B-INC-003 as slices; they are reported once with a reference to each file, and generation fails if the two statuses ever differ. Adding an increment is an explicit edit of `INCREMENTS` in the generator.

## Authority

This repo reports facts only. These tasks are not in the approved kritva-program baseline (v2, frozen), so this report earns no progress credit; they are tracked in the program's planning inventory as PLANNING_ONLY (D-024, D-030). Review, acceptance, weights and approvals live in kritva-program (`v2/tracking/`).

| Planning Status line | Reported execution |
|---|---|
| Accepted | COMPLETE (the repo owner's acceptance; not a program approval) |
| In Review, In Progress | IN_PROGRESS |
| Blocked | BLOCKED |
| Proposed, Ready, Not started | NOT_STARTED |
| no Status line | NOT_STARTED (nothing recorded as begun) |
| anything else (Deferred, Rejected, unknown) | generation fails; no guessing |

Every evidence entry is a record reference (the TASKS.md path) with no commit, CI run or hash, so it can never support a PASS. `readiness` is PLANNABLE for a task with no recorded status and IMPLEMENTABLE otherwise; it is not a safety clearance. `git_sync` is SYNCED only when git confirms a clean tree whose HEAD equals origin/main.

`source.commit` is the inspected revision, not the commit that contains the report, and is expected to trail HEAD after later commits. Regenerate after planning records change; `--check-facts` in CI fails when they drift. The canonical schema is `schema/status.schema.json` in KritvaOS/kritva-program.
