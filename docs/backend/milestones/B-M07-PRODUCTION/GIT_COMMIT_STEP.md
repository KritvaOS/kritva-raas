# B-M07-PRODUCTION — Git Commit Step

Milestone: B-M07 — Production

Performed only after the review gate in [REVIEW_CHECKLIST.md](REVIEW_CHECKLIST.md) is fully signed off.

## Branch

    milestone/b-m07-production

## Commit Message

    milestone(b-m07-production): close B-M07 — Production

    - tasks accepted: <list task IDs from TASKS.md>
    - acceptance: ACCEPTANCE_CRITERIA.md all met
    - review: REVIEW_CHECKLIST.md signed off by <reviewer>
    - docs/tracking updated

## Tag

    git tag -a b-m07-production-closed -m "B-M07-PRODUCTION closed"

## Steps

1. Confirm the working tree is clean and CI is green.
2. Confirm tracking files (MILESTONE_STATUS.md, TASK_STATUS.md, STATUS.md) show this milestone ACCEPTED.
3. Commit with the message above.
4. Create the tag.
5. Record the commit hash and tag in CHANGELOG.md and tracking/CHANGE_TRACKING.md.
