# F-M02-PROJECTS — Tasks

Milestone: F-M02 — Projects
Source of scope: [MILESTONE.md](MILESTONE.md)

# 5. Detailed Task Breakdown

## 5.1 Task Register

| ID | Description | Estimate | Owner Role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-FE-1-001 | Define Project UI information architecture | 1.5d | UX/UI | F-M01 | [ ] |
| KR-FE-1-002 | Define Project API contracts | 2.0d | Backend | F-M01 | [ ] |
| KR-FE-1-003 | Integrate project API client | 2.0d | Frontend | 002 | [ ] |
| KR-FE-1-004 | Implement Projects list | 2.0d | Frontend | 003 | [ ] |
| KR-FE-1-005 | Implement project search/filter | 1.0d | Frontend | 004 | [ ] |
| KR-FE-1-006 | Implement project creation form | 2.0d | Frontend | 003 | [ ] |
| KR-FE-1-007 | Implement project key validation | 1.0d | Frontend/Backend | 002,006 | [ ] |
| KR-FE-1-008 | Implement local workspace picker | 2.0d | Rust/Frontend | F-M01 | [ ] |
| KR-FE-1-009 | Implement workspace validation | 1.5d | Rust | 008 | [ ] |
| KR-FE-1-010 | Implement workspace persistence | 1.5d | Rust | 009 | [ ] |
| KR-FE-1-011 | Implement platform catalog client | 1.5d | Frontend | 003 | [ ] |
| KR-FE-1-012 | Implement platform selector | 1.5d | Frontend | 011 | [ ] |
| KR-FE-1-013 | Implement KritvaOS version selector | 1.5d | Frontend | 011,012 | [ ] |
| KR-FE-1-014 | Implement SDK version selector | 1.5d | Frontend | 013 | [ ] |
| KR-FE-1-015 | Implement compatibility filtering | 1.5d | Frontend/Backend | 013,014 | [ ] |
| KR-FE-1-016 | Implement project settings | 2.0d | Frontend | 006,012-014 | [ ] |
| KR-FE-1-017 | Implement project overview | 2.0d | Frontend | 004,016 | [ ] |
| KR-FE-1-018 | Implement project metadata editing | 1.5d | Frontend | 017 | [ ] |
| KR-FE-1-019 | Implement project state handling | 1.5d | Frontend | 003,017 | [ ] |
| KR-FE-1-020 | Implement project authorization handling | 1.0d | Frontend/Backend | 003,019 | [ ] |
| KR-FE-1-021 | Implement project loading/error/empty states | 1.5d | Frontend | 004,017 | [ ] |
| KR-FE-1-022 | Add project navigation/deep links | 1.0d | Frontend | 004,017 | [ ] |
| KR-FE-1-023 | Add local workspace security checks | 1.5d | Rust/Security | 009 | [ ] |
| KR-FE-1-024 | Add project unit/component tests | 2.0d | QA/Frontend | 004-021 | [ ] |
| KR-FE-1-025 | Add project integration tests | 2.0d | QA | 003-020 | [ ] |
| KR-FE-1-026 | Add project E2E tests | 2.0d | QA | 017-022 | [ ] |
| KR-FE-1-027 | Add source privacy tests | 1.5d | Security/QA | 008-010 | [ ] |
| KR-FE-1-028 | Add cross-platform workspace tests | 1.5d | QA/Rust | 008-010 | [ ] |
| KR-FE-1-029 | Update CI for project tests | 1.0d | DevOps | 024-028 | [ ] |
| KR-FE-1-030 | Complete project documentation | 1.5d | Frontend/Docs | All | [ ] |
| KR-FE-1-031 | Conduct F-M02 review | 1.0d | Architect | All | [ ] |

Estimates are engineering-day estimates and should be refined during task
refinement.

## 5.2 Project API Contract

The client should expose typed operations conceptually equivalent to:

    ProjectApi.listProjects(context)
    ProjectApi.getProject(projectId)
    ProjectApi.createProject(request)
    ProjectApi.updateProject(projectId, request)
    ProjectApi.archiveProject(projectId)
    PlatformApi.listPlatforms(filter)
    PlatformApi.listVersions(platformId)

The exact endpoint names are defined by the backend contract.

## 5.3 Project Create Request

Conceptual request:

    {
        "name": "Vision Tracker",
        "project_key": "vision-tracker",
        "description": "Robotic vision application",
        "platform_id": "platform-001",
        "platform_version_id": "platform-version-001",
        "kritva_os_version": "1.0",
        "sdk_version": "1.0",
        "artifact_format": "krv",
        "allow_remote_execution": true
    }

No source code is included.

No local file contents are included.

## 5.4 Project Response

Conceptual response:

    {
        "project_id": "project-001",
        "organization_id": "org-001",
        "project_key": "vision-tracker",
        "name": "Vision Tracker",
        "status": "ACTIVE",
        "platform": {
            "id": "platform-001",
            "version_id": "platform-version-001"
        },
        "kritva_os_version": "1.0",
        "sdk_version": "1.0",
        "artifact_format": "krv",
        "allow_remote_execution": true
    }

The response contains metadata only.

## 5.5 Project List

The list should support:

- pagination where required;
- search;
- lifecycle filtering;
- platform filtering;
- sorting;
- loading;
- empty state;
- error state.

The UI must not assume the complete dataset is present locally.

## 5.6 Project Key

Project keys must be:

- stable;
- unique within the organization;
- validated server-side;
- validated client-side for usability;
- safe for URLs/routes where used;
- independent of display name.

Changing the display name must not automatically change the project key.

## 5.7 Project Name

The project name is user-facing.

It may contain spaces and normal Unicode supported by the product policy.

It must have defined:

- minimum length;
- maximum length;
- whitespace behavior;
- normalization behavior.

The backend remains authoritative.

## 5.8 Project Description

Description is optional metadata.

It should have a bounded maximum length.

The Studio must not use description as a source-code or configuration storage
mechanism.

## 5.9 Local Workspace Selection

The user selects a directory through the native Tauri/Rust layer.

Preferred flow:

    React
      |
      v
    Workspace Picker Command
      |
      v
    Native OS Dialog
      |
      v
    Selected Directory
      |
      v
    Workspace Validator
      |
      v
    Workspace Association

The native layer should return a structured result rather than arbitrary
filesystem access.

## 5.10 Workspace Validation

Validation should check, as appropriate:

- directory exists;
- directory is accessible;
- directory is not a file;
- permissions allow required local operations;
- path is not obviously unsafe;
- project marker exists or can be initialized;
- workspace is not already claimed by an incompatible local project context.

Validation must not read and transmit source contents.

## 5.11 Workspace Identity

A local project association should preferably include:

- local project identifier;
- workspace root;
- local metadata file or marker;
- association version.

Conceptual local marker:

    .kritva/
        project.json
        workspace.json

The exact marker structure is implementation-defined.

The marker must not contain authentication secrets.

## 5.12 Workspace Portability

Absolute paths are machine-specific.

The project model should therefore distinguish:

- remote Project ID;
- local workspace identity;
- current local path.

A project opened on another machine may require explicit workspace association.

## 5.13 Platform Selection

Platform selection must be driven by the platform catalog.

The UI should not hard-code a list of robot platforms into business logic.

Conceptual flow:

    Project
       |
       v
    Platform Catalog
       |
       v
    Platform
       |
       v
    Platform Version
       |
       v
    Architecture / Capabilities
       |
       v
    Project Binding

## 5.14 Platform Binding

A project may have platform bindings with:

- binding type;
- status;
- platform ID;
- platform version;
- configuration reference where applicable.

The existing project schema supports:

- `SUPPORTED`;
- `PREFERRED`.

The UI should clearly distinguish supported platforms from the preferred
default platform.

## 5.15 KritvaOS Version Selection

KritvaOS selection should be constrained by:

- selected platform;
- selected platform version;
- available runtime versions;
- lifecycle status;
- compatibility rules.

Deprecated versions may be displayed with explicit warning according to product
policy.

Retired versions must not be selectable for new projects.

## 5.16 SDK Version Selection

SDK version selection should consider:

- platform compatibility;
- KritvaOS compatibility;
- project policy;
- SDK lifecycle;
- minimum/maximum supported versions.

The SDK selection must become part of later build compatibility checks.

## 5.17 Selection Dependency

The selectors should follow:

    Platform
       |
       v
    Platform Version
       |
       v
    Architecture
       |
       v
    KritvaOS Version
       |
       v
    SDK Version

Changing a parent selection may invalidate child selections.

The UI must not silently retain invalid combinations.

## 5.18 Configuration Change Warning

If a project already has build/execution history in future milestones, changing
platform or SDK settings may affect reproducibility.

F-M02 should establish the warning pattern for such changes even if historical
build data is not yet implemented.

## 5.19 Project Settings

Project settings should include, where supported:

- default platform;
- default platform version;
- SDK version;
- runtime version;
- artifact format;
- remote execution enablement;
- artifact signature requirement;
- result retention policy.

Settings that are not yet implemented should not be presented as active controls.

## 5.20 Authorization

Project access must follow:

    Authenticated User
          |
          v
    Organization Membership
          |
          v
    Project Membership / Role
          |
          v
    Project API
          |
          v
    Project Data

Project roles defined by the project model include:

- OWNER;
- ADMIN;
- MEMBER;
- VIEWER.

The UI may hide actions the user cannot perform, but the backend must enforce
authorization.

## 5.21 Project Lifecycle

Project lifecycle states:

- ACTIVE;
- ARCHIVED;
- DELETED.

Deleted projects must not appear in ordinary active project lists.

Archived projects should remain distinguishable.

## 5.22 Project Navigation

Preferred route model:

    /projects
    /projects/:projectId
    /projects/:projectId/settings
    /projects/:projectId/platform

Routes must validate session and project access.

A stale project ID must result in a safe NOT_FOUND or equivalent state.

---
