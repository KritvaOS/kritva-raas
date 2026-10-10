# PHASE-0-FOUNDATION — Git Commit Step

Milestone: PHASE-0-FOUNDATION — Architecture and Engineering Foundation

Performed only after the review gate in [REVIEW_CHECKLIST.md](REVIEW_CHECKLIST.md) is fully signed off.

## Branch

    milestone/phase-0-foundation

## Commit Message

    milestone(phase-0-foundation): close PHASE-0-FOUNDATION — Architecture and Engineering Foundation

    - tasks accepted: <list task IDs from TASKS.md>
    - acceptance: ACCEPTANCE_CRITERIA.md all met
    - review: REVIEW_CHECKLIST.md signed off by <reviewer>
    - docs/tracking updated

## Tag

    git tag -a phase-0-foundation-closed -m "PHASE-0-FOUNDATION closed"

## Steps

1. Confirm the working tree is clean and CI is green.
2. Confirm tracking files (MILESTONE_STATUS.md, TASK_STATUS.md, STATUS.md) show this milestone ACCEPTED.
3. Commit with the message above.
4. Create the tag.
5. Record the commit hash and tag in CHANGELOG.md and tracking/CHANGE_TRACKING.md.
