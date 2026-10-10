# B-M02-ARTIFACT — Git Commit Step

Milestone: B-M02 — Artifact

Performed only after the review gate in [REVIEW_CHECKLIST.md](REVIEW_CHECKLIST.md) is fully signed off.

## Branch

    milestone/b-m02-artifact

## Commit Message

    milestone(b-m02-artifact): close B-M02 — Artifact

    - tasks accepted: <list task IDs from TASKS.md>
    - acceptance: ACCEPTANCE_CRITERIA.md all met
    - review: REVIEW_CHECKLIST.md signed off by <reviewer>
    - docs/tracking updated

## Tag

    git tag -a b-m02-artifact-closed -m "B-M02-ARTIFACT closed"

## Steps

1. Confirm the working tree is clean and CI is green.
2. Confirm tracking files (MILESTONE_STATUS.md, TASK_STATUS.md, STATUS.md) show this milestone ACCEPTED.
3. Commit with the message above.
4. Create the tag.
5. Record the commit hash and tag in CHANGELOG.md and tracking/CHANGE_TRACKING.md.
