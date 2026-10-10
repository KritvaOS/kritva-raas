# F-M01-STUDIO-FOUNDATION — Changelog

Milestone: F-M01 — Studio Foundation

# 11. Changelog

## Added

- Date:
- Change:
- Task:
- Author:
- Evidence:

## Changed

- Date: 2026-10-10
- Change: Revised coding-agent scope after external review CA-REV-001 to CA-REV-012 (staging workspace and change sets, isolation tiers, journal and recovery, MCP execution contract, consent lifecycle, policy cache rules); added KR-CA-035; updated acceptance and review items.
- Task: KR-CA-035
- Author: Planning update
- Evidence: `docs/architecture/CODING_AGENT_INTEGRATION.md` revision 2

- Date: 2026-10-10
- Change: Added coding-agent integration foundation scope (Section 2.5, deliverable 21, tasks KR-CA-001 to KR-CA-005, acceptance Section 6.14, review Section 7.11) per SYS-ADR-007 (Proposed).
- Task: KR-CA-001 to KR-CA-005
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

- Initial milestone dossier.
- No implementation is implied by this document.
- F-M01 remains scoped to Studio foundation.
- Future feature implementation must be tracked through subsequent milestones
  and task-specific acceptance criteria.

---

# Appendix A — Milestone Traceability

## A.1 Product-to-Milestone Trace

    Kritva RaaS
        |
        v
    RaaS Studio
        |
        v
    F-M01 STUDIO FOUNDATION
        |
        +--> Shell
        +--> Navigation
        +--> Authentication
        +--> Session
        +--> Dashboard
        +--> Profile
        +--> Settings
        +--> Platform Awareness
        |
        v
    F-M02 PROJECTS
        |
        v
    F-M03 BUILD & ARTIFACT
        |
        v
    F-M04 BOOKING
        |
        v
    F-M05 EXECUTION
        |
        v
    F-M06 LIVE
        |
        v
    F-M07 RESULTS

## A.2 Phase Mapping

The canonical mapping for F-M01 STUDIO FOUNDATION (P0-P1) is defined in `docs/planning/PHASES.md` (Section 6). Cross-phase dependencies are owned by `docs/planning/DEPENDENCY_MAP.md` and `docs/planning/IMPLEMENTATION_ROADMAP.md`; milestone scope is owned by this milestone's `MILESTONE.md`. This appendix does not redefine either.

| Phase | Relationship to this milestone | Boundary note |
|---|---|---|
| P0 FOUNDATION | Owning phase (start) |  |
| P1 STUDIO | Owning phase (completion) |  |
| P2 BUILD & ARTIFACT | Downstream consumer of this milestone's outputs |  |
| P3 CONTROL PLANE | Downstream consumer of this milestone's outputs |  |
| P4 BOOKING & COMMERCIAL | Downstream consumer of this milestone's outputs |  |
| P5 EXECUTION | Downstream consumer of this milestone's outputs | Simulated Lab Agent and simulated robots only. |
| P6 LAB & ROBOT | Downstream consumer of this milestone's outputs | Physical Lab Agent, physical robots, E-stop qualification and hardware safety review. |
| P7 LIVE & RESULTS | Downstream consumer of this milestone's outputs |  |
| P8 PRODUCTION | Downstream consumer of this milestone's outputs |  |

Earlier revisions of this appendix used a superseded phase model and were replaced to remove conflicting phase assignments.

## A.3 Task Dependency Graph

    KR-FE-0-001
          |
          +------------------+
          |                  |
          v                  v
    KR-FE-0-002        KR-FE-0-003
          |                  |
          v                  v
    KR-FE-0-022        KR-FE-0-004
                             |
                    +--------+--------+
                    |        |        |
                    v        v        v
                  Tokens   Layout   Components
                    |        |
                    +--------+
                         |
                         v
                  Navigation
                         |
                         v
                    Route Guard
                         |
                         v
                     Login
                         |
                         v
                  Authentication
                         |
                         v
                      Session
                         |
              +----------+----------+
              |          |          |
              v          v          v
          Dashboard   Profile   Settings
              |
              v
        Platform Awareness

## A.4 Interface Summary

| Boundary | Protocol/Mechanism | F-M01 Responsibility |
|---|---|---|
| React ↔ Rust | Tauri IPC | Establish typed boundary |
| React ↔ API | HTTPS client | Establish client boundary |
| Studio ↔ Auth | Auth API | Login/session/logout |
| Studio ↔ Platform | REST/API contract | Read platform awareness |
| Studio ↔ Storage | Secure abstraction | Session credentials |
| Studio ↔ CI | Build pipeline | Build/test/package |

## A.5 Data Flow

Authentication flow:

    User
      |
      v
    Login UI
      |
      v
    Auth Client
      |
      v
    Control Plane
      |
      v
    Authentication Service
      |
      v
    Session
      |
      v
    Secure Local Session Storage
      |
      v
    Authenticated Studio

Platform awareness flow:

    Control Plane
         |
         v
    Platform API
         |
         v
    API Client
         |
         v
    Platform State
         |
         v
    Dashboard / Platform UI

The Studio does not become authoritative for platform availability.

## A.6 F-M01 Resource Estimate

Indicative effort:

| Capability | Estimated Effort |
|---|---:|
| Frontend | 12–16 engineer-days |
| Rust/Tauri | 6–9 engineer-days |
| UX/UI | 3–5 engineer-days |
| QA | 6–8 engineer-days |
| DevOps | 3–4 engineer-days |
| Security | 2–3 engineer-days |
| Architecture/Review | 2–3 engineer-days |
| Documentation | 1–2 engineer-days |

The estimate is intentionally approximate and should be refined after task
breakdown and repository inspection.

## A.7 F-M01 Definition of Done

F-M01 is Done only when:

    Requirements
         |
         v
    Design
         |
         v
    Implementation
         |
         v
    Tests
         |
         v
    Security Review
         |
         v
    Accessibility Review
         |
         v
    CI
         |
         v
    Demo
         |
         v
    Acceptance
         |
         v
    Tracking Update

All stages must have evidence.

## A.8 Final Milestone Invariants

1. F-M01 is a foundation milestone, not the complete RaaS Studio.
2. Tauri remains the desktop application shell.
3. Rust owns native capabilities.
4. React/TypeScript owns the application UI.
5. Native capabilities are exposed through narrow interfaces.
6. API calls are centralized behind typed client abstractions.
7. Authentication is server-authoritative.
8. Authorization is server-authoritative.
9. Session state is explicit.
10. Session expiry is handled centrally.
11. Protected routes cannot be bypassed by navigation.
12. Dashboard does not fabricate unavailable business data.
13. Platform awareness does not equal booking availability.
14. Platform awareness does not equal compatibility approval.
15. Source code remains local.
16. Session credentials are not stored in plaintext.
17. Tokens are never written to logs.
18. UI cannot override physical safety authority.
19. Placeholder functionality must be visibly identified.
20. Loading, empty and error states are first-class.
21. Accessibility is part of acceptance.
22. Light and dark themes are part of the foundation.
23. Linux x86_64 and Windows x86_64 are P0 targets.
24. macOS Apple Silicon remains P1.
25. Automated tests are required before acceptance.
26. CI is required before acceptance.
27. Security review is required before acceptance.
28. UI review is required before acceptance.
29. Documentation must reflect actual implementation state.
30. F-M01 completion must not be claimed without acceptance evidence.

## A.9 Milestone Principle

> F-M01 establishes the trusted foundation on which the entire Kritva RaaS
> Studio is built. The objective is not to produce a visually complete
> application, but to establish a secure, testable, accessible and
> extensible desktop shell with clear boundaries between React, Rust, local
> runtime services and the remote Control Plane. Authentication, session
> management, navigation, dashboard, profile, settings and platform awareness
> are therefore treated as architectural foundations rather than isolated
> screens. Every subsequent Studio milestone must be able to build on this
> foundation without redesigning its security, navigation, state, native
> integration or testing model.
