# DB-M04-EXECUTION-DATA — Git Commit Step

Milestone: DB-M04-EXECUTION-DATA — Jobs, Runs, Telemetry, Logs and Results

Performed only after the review gate in [REVIEW_CHECKLIST.md](REVIEW_CHECKLIST.md) is fully signed off.

## Branch

    milestone/db-m04-execution-data

## Commit Message

    milestone(db-m04-execution-data): close DB-M04-EXECUTION-DATA — Jobs, Runs, Telemetry, Logs and Results

    - tasks accepted: <list task IDs from TASKS.md>
    - acceptance: ACCEPTANCE_CRITERIA.md all met
    - review: REVIEW_CHECKLIST.md signed off by <reviewer>
    - docs/tracking updated

## Tag

    git tag -a db-m04-execution-data-closed -m "DB-M04-EXECUTION-DATA closed"

## Steps

1. Confirm the working tree is clean and CI is green.
2. Confirm tracking files (MILESTONE_STATUS.md, TASK_STATUS.md, STATUS.md) show this milestone ACCEPTED.
3. Commit with the message above.
4. Create the tag.
5. Record the commit hash and tag in CHANGELOG.md and tracking/CHANGE_TRACKING.md.
