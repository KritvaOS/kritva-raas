# F-M02-PROJECTS — Acceptance Criteria

Milestone: F-M02 — Projects

# 6. Acceptance Criteria

## 6.1 Project List

- [ ] Authorized projects are displayed.
- [ ] Unauthorized projects are not displayed.
- [ ] Project name is displayed.
- [ ] Project key is displayed.
- [ ] Project status is displayed.
- [ ] Platform information is displayed where available.
- [ ] KritvaOS version is displayed where available.
- [ ] SDK version is displayed where available.
- [ ] Last updated information is displayed.
- [ ] Local workspace state is represented.
- [ ] Open action is available for accessible projects.
- [ ] Create Project action is available to authorized users.
- [ ] Loading state exists.
- [ ] Empty state exists.
- [ ] Error state exists.

## 6.2 Project Creation

- [ ] Create Project opens from the Projects screen.
- [ ] Name is required.
- [ ] Project key is required.
- [ ] Project key is validated.
- [ ] Duplicate project keys are handled safely.
- [ ] Description is optional.
- [ ] Workspace selection is available.
- [ ] Platform selection is available.
- [ ] KritvaOS selection is available.
- [ ] SDK selection is available.
- [ ] Invalid combinations are prevented or clearly rejected.
- [ ] Create request contains metadata only.
- [ ] Source code is never included.
- [ ] Successful creation returns a project ID.
- [ ] Successful creation opens the Project Workspace.
- [ ] Creation failure preserves recoverable user input where safe.

## 6.3 Project Opening

- [ ] Accessible project opens successfully.
- [ ] Project metadata loads.
- [ ] Workspace association is restored.
- [ ] Platform configuration is restored.
- [ ] KritvaOS version is restored.
- [ ] SDK version is restored.
- [ ] Invalid project IDs show safe errors.
- [ ] Unauthorized projects are inaccessible.
- [ ] Loading state is visible.
- [ ] Network failure is recoverable.

## 6.4 Metadata

- [ ] Project name can be displayed.
- [ ] Project description can be displayed.
- [ ] Project key is displayed.
- [ ] Organization context is displayed.
- [ ] Project status is displayed.
- [ ] Metadata editing uses authoritative APIs.
- [ ] Invalid metadata is rejected safely.
- [ ] Concurrent update conflicts are handled according to backend contract.
- [ ] Metadata updates do not upload source.

## 6.5 Local Workspace

- [ ] Native directory picker opens.
- [ ] User-selected directory is returned safely.
- [ ] Directory validation is performed.
- [ ] Invalid paths are rejected.
- [ ] Inaccessible directories are reported.
- [ ] Workspace association persists locally.
- [ ] Workspace can be reopened.
- [ ] Workspace association survives application restart.
- [ ] No source content is uploaded.
- [ ] No authentication secret is stored in the workspace.
- [ ] Workspace paths are handled safely across supported operating systems.

## 6.6 Platform Selection

- [ ] Platforms are retrieved through the platform API.
- [ ] Platform list is not hard-coded as authoritative data.
- [ ] Platform lifecycle is respected.
- [ ] Platform version is selectable.
- [ ] Architecture is visible where relevant.
- [ ] Capabilities are visible where relevant.
- [ ] Deprecated platform versions are clearly identified.
- [ ] Retired versions cannot be selected for new projects.
- [ ] Selection failures are recoverable.

## 6.7 KritvaOS Selection

- [ ] KritvaOS versions are associated with the selected platform.
- [ ] Invalid versions are not selectable.
- [ ] Deprecated versions show appropriate warnings.
- [ ] Retired versions cannot be selected where policy prohibits them.
- [ ] Selected version persists with project settings.
- [ ] Version changes are reflected in project metadata.

## 6.8 SDK Selection

- [ ] SDK versions are displayed from authoritative metadata.
- [ ] SDK compatibility is represented.
- [ ] Invalid SDK combinations are rejected.
- [ ] Selected SDK version persists.
- [ ] SDK selection is available to later build workflows.
- [ ] SDK changes do not upload source.

## 6.9 Project Authorization

- [ ] Viewer can view projects.
- [ ] Member permissions follow authorization policy.
- [ ] Admin permissions follow authorization policy.
- [ ] Owner permissions follow authorization policy.
- [ ] UI does not rely on hidden buttons as security.
- [ ] Backend rejects unauthorized operations.
- [ ] Unauthorized errors are rendered safely.

## 6.10 Source Privacy

- [ ] Project creation sends no source files.
- [ ] Project listing sends no source files.
- [ ] Project metadata update sends no source files.
- [ ] Platform selection sends no source files.
- [ ] Workspace association sends no source contents.
- [ ] Logs do not contain source content.
- [ ] Diagnostics do not contain source content.
- [ ] Network tests confirm the source privacy boundary.

## 6.11 UX

- [ ] Project workflow is understandable without documentation.
- [ ] Required fields are clearly marked.
- [ ] Validation is close to the relevant field.
- [ ] Destructive or consequential actions are clear.
- [ ] Loading states prevent accidental duplicate submission.
- [ ] Empty states explain what to do next.
- [ ] Errors explain recovery steps.
- [ ] Keyboard navigation works.
- [ ] Accessibility labels exist.
- [ ] Light and dark themes work.

## 6.12 Quality

- [ ] Unit tests pass.
- [ ] Component tests pass.
- [ ] API integration tests pass.
- [ ] Workspace integration tests pass.
- [ ] E2E project flow passes.
- [ ] Source privacy tests pass.
- [ ] Linux verification passes.
- [ ] Windows verification passes.
- [ ] CI passes.
- [ ] Documentation is updated.

---
