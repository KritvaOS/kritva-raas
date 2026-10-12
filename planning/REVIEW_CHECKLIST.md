# Planning Review Checklist

## Document Control

| Field | Value |
|---|---|
| Document | Planning Review Checklist |
| Path | `planning/REVIEW_CHECKLIST.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related documents | [README.md](README.md); [AGENT_RULES.md](AGENT_RULES.md); [PLANNING_AUTHORITY_MATRIX.md](PLANNING_AUTHORITY_MATRIX.md); [backend/increments/B-INC-001-SECURE-FOUNDATION/REVIEW_CHECKLIST.md](backend/increments/B-INC-001-SECURE-FOUNDATION/REVIEW_CHECKLIST.md) |

## 1. Purpose

This checklist is for reviewing a pull request that changes planning documents or that implements a task. It collects the questions the repository already asks. It adds no requirement. Increment checklists stay the checklist for increment acceptance. Code review follows [docs/development/CODE_REVIEW.md](../docs/development/CODE_REVIEW.md).

## 2. Scope and Authority

- [ ] The change does one kind of thing (a path move, a vocabulary change, a consolidation, a task, a decision).
- [ ] Every value that is shown in more than one place has one canonical record, and the other places link to it.
- [ ] No frozen phase name, official milestone identifier or task identifier is renumbered or reworded.
- [ ] A phase document does not restate milestone scope. A milestone dossier owns its own scope.
- [ ] A document marked Proposed is not used as authority for implementation.

## 3. Status and Evidence

- [ ] No task is marked Accepted without the owner's recorded acceptance.
- [ ] A decision Approved is not described as a task Accepted.
- [ ] A status changed only where evidence supports it. A merge, a branch or a passing subset of tests is not evidence of acceptance.
- [ ] Tests and gates are marked NOT RUN unless they were run, and the evidence names where it came from.
- [ ] Component tests are not presented as integration or end-to-end evidence (for example `BTS-032`).
- [ ] A run on a runtime other than the pinned one is labeled feasibility only.
- [ ] The review is labeled for what it was: owner review, AI inspection or independent human review.

## 4. Traceability

- [ ] A task commit carries `Tasks`, `Acceptance`, `Tests` and `Security-Gates` trailers equal to the task entry in the increment `TASKS.md`.
- [ ] A planning commit carries `Tasks: None` with the other trace fields Not applicable.
- [ ] A planning change has a PB-nnn entry in [BACKEND_CHANGELOG.md](backend/BACKEND_CHANGELOG.md) with reason, files, unchanged items and review.
- [ ] Decisions go through the decision record and, where required, an approval package.

## 5. Security and Secrets

- [ ] No secret, credential, token or personal data is in the change, the commit message or the pull request text.
- [ ] A change that touches a security gate says which gate and whether it is closed. A gate is not closed without its evidence.
- [ ] A dependency change names the dependency, the version and the lockfile change.

## 6. Checks

- [ ] `make check` passes from a clean checkout and the transcript is on the pull request.
- [ ] A documentation change does not raise the docs-check warning count without a note.
- [ ] A moved or renamed document has its links, references and checker paths updated in the same change.
