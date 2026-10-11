# Task Documentation

Each implementation task gets its own folder `docs/tasks/<TASK-ID>/` **when the task is activated** (moved from the backlog to READY). Tasks are not pre-created for the whole backlog.

## Task ID format

    KR-<DOMAIN>-<PHASE>-<NNN>

| Part | Values |
|---|---|
| DOMAIN | FE (frontend), BE (backend), DB (database), CL (cloud), SEC (security), UI, DOC |
| PHASE | 0-8, per [planning/PHASES.md](../../planning/PHASES.md) |
| NNN | zero-padded sequence within domain and phase |

Examples: `KR-FE-1-001`, `KR-BE-3-014`, `KR-DB-4-003`.

Backlogs that define task IDs: [frontend](../frontend/planning/FRONTEND_TASKS.md), [backend](../backend/planning/BACKEND_TASKS.md), [database](../database/planning/DATABASE_TASKS.md), [cloud](../cloud/planning/CLOUD_TASKS.md).

## Folder contents

    docs/tasks/<TASK-ID>/
    ├── TASK.md                  scope, inputs, outputs, design notes, links to contracts
    └── ACCEPTANCE_CRITERIA.md   verifiable checklist and evidence required

Copy `_TEMPLATE/` to start a task.

## Lifecycle

    BACKLOG -> READY -> IN_PROGRESS -> REVIEW -> ACCEPTED   (or BLOCKED / CANCELLED)

Status is tracked in [tracking/TASK_STATUS.md](../tracking/TASK_STATUS.md). A task is ACCEPTED only after its acceptance criteria are met with evidence and the review in its milestone's REVIEW_CHECKLIST.md passes.
