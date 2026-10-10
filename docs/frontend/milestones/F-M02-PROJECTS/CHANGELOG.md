# F-M02-PROJECTS — Changelog

Milestone: F-M02 — Projects

# 11. Changelog

## Added

- Date:
- Change:
- Task:
- Author:
- Evidence:

## Changed

- Date: 2026-10-10
- Change: Revised coding-agent scope after external review CA-REV-001 to CA-REV-012 (staging workspace and change sets, isolation tiers, journal and recovery, MCP execution contract, consent lifecycle, policy cache rules); added KR-CA-036 to KR-CA-038; updated acceptance and review items.
- Task: KR-CA-036 to KR-CA-038
- Author: Planning update
- Evidence: `docs/architecture/CODING_AGENT_INTEGRATION.md` revision 2

- Date: 2026-10-10
- Change: Added coding-agent session scope (Section 2.5, deliverables 21-25, risks R-FM02-013 to R-FM02-015, tasks KR-CA-006 to KR-CA-014, acceptance Section 6.13, review Sections 7.13 and 8.12a) per SYS-ADR-007 (Proposed). Corrected the Notes, which referred to superseded milestone numbers.
- Task: KR-CA-006 to KR-CA-014
- Author: Planning update
- Evidence: `docs/architecture/CODING_AGENT_INTEGRATION.md`

- Date:
- Change:
- Task:
- Author:
- Evidence:

## Fixed

- Date:
- Issue:
- Task:
- Author:
- Evidence:

## Removed

- Date:
- Change:
- Reason:
- Task:
- Author:
- Evidence:

## Notes

- Initial F-M02 milestone dossier.
- No implementation is implied by this document.
- F-M02 depends on the Studio foundation established by F-M01.
- Build and artifact functionality belongs to F-M03 BUILD & ARTIFACT.
- Platform discovery and selection are part of F-M02 PROJECTS; the platform catalogue is served by B-M03 PLATFORM.
- Booking and credits belong to F-M04 BOOKING.
- Coding-agent sessions start in F-M02; the MCP server and second provider follow in F-M03 BUILD & ARTIFACT.

---

# Appendix A — Phase Mapping

The canonical mapping for F-M02 PROJECTS (P1) is defined in `docs/planning/PHASES.md` (Section 6). Cross-phase dependencies are owned by `docs/planning/DEPENDENCY_MAP.md` and `docs/planning/IMPLEMENTATION_ROADMAP.md`; milestone scope is owned by this milestone's `MILESTONE.md`. This appendix does not redefine either.

| Phase | Relationship to this milestone | Boundary note |
|---|---|---|
| P0 FOUNDATION | Upstream dependency; outputs consumed by this milestone |  |
| P1 STUDIO | Owning phase |  |
| P2 BUILD & ARTIFACT | Downstream consumer of this milestone's outputs |  |
| P3 CONTROL PLANE | Downstream consumer of this milestone's outputs |  |
| P4 BOOKING & COMMERCIAL | Downstream consumer of this milestone's outputs |  |
| P5 EXECUTION | Downstream consumer of this milestone's outputs | Simulated Lab Agent and simulated robots only. |
| P6 LAB & ROBOT | Downstream consumer of this milestone's outputs | Physical Lab Agent, physical robots, E-stop qualification and hardware safety review. |
| P7 LIVE & RESULTS | Downstream consumer of this milestone's outputs |  |
| P8 PRODUCTION | Downstream consumer of this milestone's outputs |  |

Earlier revisions of this appendix used a superseded phase model and were replaced to remove conflicting phase assignments.

---

# Appendix B — Project Data Flow

## B.1 Create

    User
      |
      v
    Project Form
      |
      +----> Local Workspace Picker
      |             |
      |             v
      |        Local Workspace
      |
      +----> Platform Catalog
      |             |
      |             v
      |        Platform Version
      |             |
      |             v
      |        KritvaOS / SDK
      |
      v
    Project API
      |
      v
    Control Plane
      |
      v
    PostgreSQL
      |
      v
    Project Created
      |
      v
    Studio Workspace

## B.2 Open

    Project List
        |
        v
    Project ID
        |
        v
    Project API
        |
        v
    Project Metadata
        |
        +----> Local Workspace Association
        |
        +----> Platform Configuration
        |
        v
    Project Workspace

## B.3 Edit

    Project Workspace
          |
          v
    Metadata / Settings
          |
          v
    Validation
          |
          v
    Project API
          |
          v
    PostgreSQL
          |
          v
    Updated Project

---

# Appendix C — Local Workspace Model

## C.1 Conceptual Model

    Remote Project
        |
        | Project ID
        |
        +----------------------+
                               |
                               v
                       Local Workspace
                               |
                    +----------+----------+
                    |                     |
                    v                     v
              Workspace Path       Local Project Marker
                    |                     |
                    v                     v
             Source Files          Local Metadata

The source remains below the local workspace boundary.

## C.2 Local Marker Principles

The local marker may contain:

- project ID;
- workspace association version;
- local settings;
- last-known platform ID;
- last-known SDK version.

It must not contain:

- access tokens;
- refresh tokens;
- signing keys;
- cloud credentials;
- source archives;
- passwords.

---

# Appendix D — Project Configuration Dependency

The configuration hierarchy is:

    Organization
        |
        v
    Project
        |
        v
    Platform Binding
        |
        v
    Platform Version
        |
        v
    Architecture
        |
        v
    KritvaOS Runtime
        |
        v
    SDK Version
        |
        v
    Future Build Configuration

The Studio should guide the user from parent configuration to dependent
configuration.

A child selection must not silently remain valid after its parent changes.

---

# Appendix E — Project UI Structure

    Projects
    |
    +-- Search
    +-- Filter
    +-- Create Project
    |
    +-- Project List
          |
          +-- Project Name
          +-- Project Key
          +-- Status
          +-- Platform
          +-- KritvaOS
          +-- SDK
          +-- Workspace
          +-- Updated
          +-- Open

Project Workspace:

    Project
    |
    +-- Overview
    +-- Workspace
    +-- Platform
    +-- Settings
    |
    +-- Future
         +-- Build
         +-- Artifacts
         +-- Booking
         +-- Jobs
         +-- Results

---

# Appendix F — F-M02 Definition of Done

F-M02 is complete only when:

    Project Requirements
          |
          v
    UI / API Design
          |
          v
    Implementation
          |
          v
    Local Workspace Integration
          |
          v
    Platform Integration
          |
          v
    Automated Tests
          |
          v
    Source Privacy Verification
          |
          v
    Security Review
          |
          v
    E2E Qualification
          |
          v
    Demo
          |
          v
    Acceptance
          |
          v
    Tracking Update

Every stage requires evidence.

---

# Appendix G — Final Milestone Invariants

1. A Project belongs to an Organization.
2. Project ownership is server-authoritative.
3. Project access is authorization-controlled.
4. Project key is unique within its organization.
5. Project key is distinct from project display name.
6. Project metadata is not source code.
7. Project source remains local.
8. Workspace association remains local.
9. Local workspace paths are not treated as globally portable identity.
10. Platform information comes from the authoritative platform catalog.
11. Platform selection is not equivalent to booking.
12. Platform selection is not equivalent to compatibility approval.
13. KritvaOS selection is part of the project's target configuration.
14. SDK selection is part of the project's target configuration.
15. Invalid platform/runtime/SDK combinations must not be silently accepted.
16. Retired platform versions must not be selectable for new projects.
17. Backend authorization cannot be bypassed through UI state.
18. Project IDs must not grant implicit access.
19. Project creation must not upload source.
20. Project metadata APIs must not carry source content.
21. Local filesystem operations must use controlled native interfaces.
22. Tauri IPC must remain narrow and typed.
23. Authentication remains owned by the authentication subsystem.
24. Project state remains distinct from future Job and Run state.
25. Project configuration must support later build and artifact workflows.
26. Project configuration must support later booking and execution workflows.
27. Project configuration changes must remain traceable.
28. Loading, empty and error states are first-class.
29. Accessibility is part of milestone acceptance.
30. Cross-platform behavior must be verified on P0 targets.
31. Tests must cover both UI behavior and backend authorization.
32. Source privacy must be tested at the network boundary.
33. A project is not considered complete because its UI renders.
34. A milestone is not complete because implementation is merged.
35. F-M02 acceptance requires evidence.
36. F-M02 must provide a stable foundation for F-M03 and F-M04.
37. Architecture changes must be recorded through the project decision/change
    process.
38. Scope expansion into build, artifact, booking or execution must be handled
    through the appropriate future milestone.
39. Project metadata must remain bounded and structured.
40. The Project Workspace is the developer's durable context for the rest of
    the Kritva RaaS development lifecycle.

# Appendix H — Milestone Principle

> F-M02 turns the Kritva RaaS Studio from an authenticated application shell
> into a meaningful developer workspace. The Project becomes the bridge between
> local source development and the remote RaaS platform without violating the
> source-privacy boundary. The Studio knows which project the developer is
> working on, where its source workspace exists locally, which robotic
> platform is targeted, which KritvaOS runtime is expected, and which SDK is
> intended for development. The Control Plane remains authoritative for
> project identity, organization ownership, authorization and persistent
> metadata, while the local Studio remains authoritative for the developer's
> source workspace. This separation is fundamental to the later build,
> artifact, booking and execution milestones. F-M02 is therefore accepted not
> merely when project screens render, but when project identity, local
> workspace, platform configuration, authorization, privacy and persistence
> operate together as a reliable foundation for the rest of Kritva RaaS.
