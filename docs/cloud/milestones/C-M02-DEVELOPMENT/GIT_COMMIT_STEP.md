# C-M02-DEVELOPMENT — Git Commit Step

Milestone: C-M02-DEVELOPMENT — Shared Development Environment

Performed only after the review gate in [REVIEW_CHECKLIST.md](REVIEW_CHECKLIST.md) is fully signed off.

## Branch

    milestone/c-m02-development

## Commit Message

    milestone(c-m02-development): close C-M02-DEVELOPMENT — Shared Development Environment

    - tasks accepted: <list task IDs from TASKS.md>
    - acceptance: ACCEPTANCE_CRITERIA.md all met
    - review: REVIEW_CHECKLIST.md signed off by <reviewer>
    - docs/tracking updated

## Tag

    git tag -a c-m02-development-closed -m "C-M02-DEVELOPMENT closed"

## Steps

1. Confirm the working tree is clean and CI is green.
2. Confirm tracking files (MILESTONE_STATUS.md, TASK_STATUS.md, STATUS.md) show this milestone ACCEPTED.
3. Commit with the message above.
4. Create the tag.
5. Record the commit hash and tag in CHANGELOG.md and tracking/CHANGE_TRACKING.md.
