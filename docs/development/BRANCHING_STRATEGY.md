# Kritva RaaS Branching and Versioning Strategy

## 1. Purpose

This document defines the production-grade Git branching, commit, pull
request, release, hotfix, tagging, and versioning strategy for Kritva RaaS.

The strategy is designed for the Kritva RaaS monorepo and must support:

- parallel engineering;
- contract-first development;
- frequent integration;
- simulator-first development;
- database evolution;
- RaaS Studio development;
- Control Plane development;
- shared packages;
- Lab Agent development;
- cloud infrastructure;
- security changes;
- release qualification;
- production hotfixes.

The strategy prioritizes integration speed, traceability, reviewability and
release safety over long-lived branch isolation.

The canonical source repository is:

    KritvaOS/kritva-raas

The primary development model is trunk-based development with short-lived
task branches.

## 2. Scope

This document covers:

- branching model;
- trunk-based versus GitFlow decision;
- branch naming;
- branch lifetime;
- commit conventions;
- pull request rules;
- merge policy;
- release branches;
- release tags;
- hotfixes;
- versioning;
- monorepo versioning;
- package compatibility;
- database migration versioning;
- protocol versioning;
- artifact versioning;
- Studio versioning;
- Lab Agent versioning;
- release provenance;
- branch protection;
- phase mapping;
- risks and mitigations.

It does not define:

- product architecture;
- database schema details;
- security architecture;
- release roadmap scope;
- development workstation setup;
- detailed CI implementation.

Those are defined by their respective documents.

## 3. Goals

The branching strategy shall:

1. keep the main branch continuously integrable;
2. minimize branch divergence;
3. keep feature branches short-lived;
4. make every production change traceable;
5. support parallel development;
6. support contract-first changes;
7. support release stabilization;
8. support emergency hotfixes;
9. preserve release reproducibility;
10. support monorepo-wide compatibility;
11. prevent accidental production releases;
12. support automated CI;
13. support rollback;
14. make historical source state recoverable;
15. keep version semantics understandable.

## 4. Non-Goals

This document does not:

- require GitFlow;
- require long-lived feature branches;
- require every package to have an independent release train;
- prescribe a particular Git hosting provider;
- define cloud deployment mechanics;
- define customer support procedures;
- define commercial pricing;
- replace semantic versioning guidance for an individual public API where
  that API has stricter requirements.

# 5. Branching Model Decision

Kritva RaaS shall use:

> **Trunk-based development with short-lived task branches, protected main,
> controlled release branches, and dedicated hotfix branches.**

The model is:

    task branch
         |
         v
       PR
         |
         v
      CI + Review
         |
         v
       main
         |
         +-------------------+
         |                   |
         v                   v
    release branch        development
         |                   |
         v                   |
       RC/GA                 |
         |                   |
         v                   |
       tag <-----------------+
         
Emergency production fix:

    production tag
         |
         v
      hotfix/*
         |
         v
       PR
         |
         v
       main
         |
         v
    release/tag

# 6. Trunk-Based Development vs GitFlow

## 6.1 Options Considered

| Model | Advantages | Disadvantages |
|---|---|---|
| Trunk-based | Fast integration, low divergence, CI-friendly | Requires disciplined CI |
| GitFlow | Explicit long-lived release branches | Merge overhead, divergence |
| GitHub Flow | Simple task-to-main model | Needs explicit release policy |
| Long-lived feature branches | Strong isolation | Integration risk increases |

## 6.2 Decision

Trunk-based development is selected.

GitFlow is explicitly rejected as the default.

## 6.3 Rationale

Kritva RaaS has:

- a monorepo;
- shared contracts;
- shared packages;
- a rapidly evolving architecture;
- multiple implementation streams;
- simulator-first integration;
- frequent cross-domain changes.

Long-lived branches would increase:

- contract drift;
- merge conflicts;
- dependency divergence;
- database migration conflicts;
- stale documentation;
- integration surprises.

The main branch should therefore remain the primary integration point.

## 6.4 GitFlow Rejection

The following GitFlow model is not the default:

    develop
      |
      +--> feature/*
      |
      v
    release/*
      |
      v
    main

A permanent `develop` branch is not required.

The `main` branch is both:

- the integration trunk;
- the source from which release branches are created.

# 7. Branch Types

The repository supports the following branch classes:

| Branch | Purpose | Lifetime |
|---|---|---|
| `main` | Integration trunk | Permanent |
| `feat/*` | New functionality | Short-lived |
| `fix/*` | Non-emergency defect fix | Short-lived |
| `refactor/*` | Internal refactoring | Short-lived |
| `docs/*` | Documentation-only work | Short-lived |
| `test/*` | Test infrastructure or coverage | Short-lived |
| `build/*` | Build/tooling changes | Short-lived |
| `security/*` | Security fixes/hardening | Short-lived |
| `chore/*` | Maintenance | Short-lived |
| `release/*` | Release stabilization | Temporary |
| `hotfix/*` | Production emergency fix | Very short-lived |
| `experiment/*` | Explicitly non-production experiment | Temporary |

# 8. Main Branch

The `main` branch is the canonical integration branch.

Properties:

- protected;
- review-required;
- CI-required;
- no direct developer pushes;
- no force push;
- no history rewriting;
- release branches originate from `main`;
- production tags point to reviewed commits.

The main branch should remain in a buildable and testable state.

# 9. Main Branch Invariant

The primary invariant is:

> `main` must always represent the latest accepted integrated development
> state.

It is not necessarily production-ready at every commit.

Production readiness is established by release qualification and tagging.

# 10. Task Branches

Task branches are created from the latest suitable `main` commit.

Example:

    git checkout main
    git pull --ff-only
    git checkout -b feat/KR-BOOKING-P4-002-resource-allocation

Task branches should normally contain one coherent task.

# 11. Branch Naming Convention

The preferred pattern is:

    <type>/<task-id>-<short-description>

Examples:

    feat/KR-STUDIO-P2-003-project-dashboard
    fix/KR-ARTIFACT-P2-004-manifest-validation
    docs/KR-DEV-P0-002-development-workflow
    test/KR-LAB-P3-005-simulator-fault-injection

For work without a formal task ID:

    chore/update-dependencies
    refactor/simplify-auth-service

Task IDs are preferred for milestone work.

# 12. Branch Name Rules

Branch names shall:

- use lowercase where practical;
- use hyphens for descriptions;
- include the task ID when one exists;
- avoid spaces;
- avoid secrets;
- avoid customer identifiers;
- remain reasonably short;
- identify intent.

Do not use:

    mybranch
    test
    final
    final2
    urgent
    temp
    dinesh-work

# 13. Branch Lifetime

Recommended maximum lifetime:

| Branch | Target |
|---|---|
| Normal task | 1–5 working days |
| Complex task | As short as practical |
| Release branch | Until release |
| Hotfix | Hours/days |
| Experiment | Explicitly time-boxed |

The objective is not a rigid number of days.

The objective is to minimize divergence from `main`.

# 14. Branch Size

Prefer:

    One Task
        |
        v
    One Branch
        |
        v
    One PR

Large tasks should be decomposed rather than implemented as oversized
branches.

# 15. Feature Flags

When functionality cannot be safely merged incomplete, use controlled feature
flags where appropriate.

The preferred model is:

    Incomplete Feature
          |
          v
    Merge Behind Flag
          |
          v
    main remains deployable
          |
          v
    Enable When Qualified

Feature flags must not become permanent substitutes for completing work.

# 16. Contract Changes

Cross-boundary contract changes follow:

    Task Branch
        |
        v
    Contract Update
        |
        v
    Contract Tests
        |
        v
    Producer/Consumer Changes
        |
        v
    PR
        |
        v
    main

The branch must contain sufficient compatibility logic for consumers that
remain on the previous contract version when required.

# 17. Breaking Contract Changes

Breaking changes require:

- explicit task;
- contract review;
- compatibility analysis;
- migration plan;
- version impact;
- release impact.

A breaking protocol change must not be hidden inside an unrelated feature PR.

# 18. Database Changes

Database migrations live in the same repository and are reviewed with the
code that depends on them.

Preferred flow:

    Code + Migration
          |
          v
        PR
          |
          v
       CI Migration Test
          |
          v
        main

Database changes must follow expand-contract principles when deployed across
versions.

# 19. Commit Strategy

Commits should represent coherent units of engineering work.

A commit should ideally:

- compile;
- pass relevant tests;
- have a clear purpose;
- be understandable independently;
- avoid unrelated changes.

Not every intermediate local commit must be perfect, but the final PR history
must be reviewable.

# 20. Commit Convention

Kritva RaaS shall use Conventional Commit-style prefixes.

Preferred format:

    <type>(<scope>): <description>

Examples:

    feat(booking): add resource allocation
    fix(artifact): reject incompatible architecture
    docs(development): define branching workflow
    test(lab): add simulator timeout coverage
    refactor(auth): simplify permission evaluation
    chore(deps): update TypeScript tooling
    build(studio): update Tauri configuration
    security(auth): enforce refresh token rotation

# 21. Commit Types

| Type | Meaning |
|---|---|
| `feat` | New functionality |
| `fix` | Defect correction |
| `docs` | Documentation |
| `test` | Test changes |
| `refactor` | Internal restructuring |
| `build` | Build/toolchain |
| `chore` | Maintenance |
| `security` | Security-specific change |
| `perf` | Performance improvement |
| `ci` | CI/CD change |

# 22. Commit Scope

Scopes should correspond to meaningful repository areas.

Examples:

    studio
    backend
    contracts
    artifact
    booking
    credits
    lab
    database
    security
    cloud
    docs

The scope vocabulary should remain small and understandable.

# 23. Breaking Commit Indicator

Where Conventional Commit semantics are used, breaking changes may be marked:

    feat(protocol)!: change execution contract

or documented explicitly in the commit body.

Breaking changes still require ADR/contract review.

# 24. Commit Body

Use a commit body when rationale is not obvious.

Example:

    feat(booking): add atomic credit reservation

    Reserve credits and resource allocation within the booking transaction.
    This prevents a confirmed booking from existing without the required
    credit reservation.

# 25. Commit Message Rules

Commit messages shall:

- describe the change;
- use imperative or concise descriptive language;
- avoid vague messages;
- avoid issue-only descriptions.

Avoid:

    changes
    fixes
    update
    work
    stuff
    final

# 26. Co-Authorship and Automation

Where implementation agents or other contributors materially contribute to a
commit, repository policy may record attribution using standard Git trailers.

Any attribution must be truthful.

Automation must not fabricate authorship.

# 27. Pull Request Model

Every change entering `main` shall normally enter through a pull request.

A PR is the primary review and integration unit.

A PR should contain:

- task reference;
- problem;
- solution;
- scope;
- tests;
- documentation;
- architecture impact;
- security impact;
- migration impact;
- known limitations.

# 28. PR Size

PRs should be as small as practical while remaining coherent.

Preferred:

    Task A
      |
      v
    PR A

rather than:

    PR
      |
      +--> Task A
      +--> Task B
      +--> Refactor C
      +--> Documentation D
      +--> unrelated fix E

Unrelated fixes should normally be separate PRs.

# 29. PR Title

PR titles should follow commit-style conventions.

Examples:

    feat(booking): add platform resource allocation
    fix(artifact): validate runtime compatibility
    docs(development): add branching strategy

# 30. PR Description

Minimum structure:

    ## Summary

    ## Scope

    ## Architecture Impact

    ## Contract Impact

    ## Database Impact

    ## Security Impact

    ## Testing

    ## Documentation

    ## Risks / Known Limitations

    ## Acceptance Criteria

# 31. PR Review Requirements

A PR requires:

- at least one qualified reviewer;
- passing required CI;
- resolved blocking comments;
- acceptance criteria satisfied.

Higher-risk changes may require multiple reviewers.

# 32. Required Specialist Review

Additional review should be required for:

| Change | Review |
|---|---|
| Architecture | Architect/reviewer |
| Database | Backend/database reviewer |
| Security | Security reviewer |
| Physical safety | Human safety reviewer |
| Protocol | Interface owner |
| Release | Release owner |

# 33. CODEOWNERS

The repository should use CODEOWNERS to identify default reviewers for
critical areas.

Examples:

    apps/studio/
    apps/backend/
    packages/contracts/
    database/
    docs/security/
    cloud/

CODEOWNERS should assist ownership discovery but must not replace human review.

# 34. PR CI Gates

Required gates should include, as applicable:

    Format
    Lint
    Typecheck
    Unit Tests
    Integration Tests
    Build
    Security Checks
    Migration Checks
    Contract Tests
    E2E Tests

The exact gate set depends on affected areas.

# 35. PR Merge Policy

A PR may merge only when:

- required reviews are approved;
- required CI passes;
- merge conflicts are resolved;
- acceptance criteria are satisfied;
- required documentation is updated;
- required tracking is updated;
- required architecture/security/safety gates are satisfied.

# 36. Merge Method

The repository should prefer a merge strategy that preserves a clean,
understandable main history.

The selected platform configuration should standardize on one method.

Preferred policy:

- squash merge for ordinary task PRs;
- preserve the PR title as the primary commit message;
- retain detailed commit history in the PR itself.

Exceptions may be made for release or carefully structured multi-commit work.

# 37. Why Squash Merge

Squash merging provides:

- concise main history;
- one logical change per task;
- easier reverts;
- clearer release notes;
- less noise from fixup commits.

The PR remains the detailed review record.

# 38. Main History

The main branch should read approximately as:

    feat(studio): add project dashboard
    feat(artifact): add package validation
    feat(booking): add resource allocation
    test(lab): add timeout simulation
    docs(development): define release workflow

This makes release history understandable.

# 39. Rebase Policy

Before merge, task branches should normally be synchronized with `main`.

Preferred:

    git fetch origin
    git rebase origin/main

Then rerun required tests.

Do not rebase a branch while another contributor is actively building on the
same branch unless coordination is explicit.

# 40. Force Push

Force pushing to `main` is prohibited.

Force pushing a personal task branch may be permitted before review when
required for rebasing or history cleanup.

Use:

    git push --force-with-lease

Never use unrestricted force push where avoidable.

# 41. Main Branch Protection

The `main` branch should enforce:

- no direct pushes;
- no force pushes;
- required PR;
- required CI;
- required review;
- stale approval invalidation where appropriate;
- conversation resolution where appropriate.

# 42. Release Strategy

Kritva RaaS uses temporary release branches when release stabilization requires
a controlled freeze.

Normal development continues on `main`.

Flow:

    main
      |
      +------------------------+
      |                        |
      v                        v
    release/1.0.0           future work
      |
      +--> RC
      |
      +--> fixes
      |
      v
     GA tag

# 43. Release Branch Naming

Release branch format:

    release/<major>.<minor>.<patch>

Examples:

    release/1.0.0
    release/1.1.0

For prerelease trains:

    release/1.0.0-rc.1

However, branch names should normally identify the release family rather than
each RC iteration.

Preferred:

    release/1.0

for a long stabilization cycle, if repository policy chooses a release-family
branch.

The exact convention shall be standardized before R1.0.

# 44. Release Branch Creation

A release branch is created from a known-good `main` commit.

Example:

    git checkout main
    git pull --ff-only
    git checkout -b release/1.0.0
    git push -u origin release/1.0.0

The branch creation commit becomes the release stabilization baseline.

# 45. Release Branch Scope

After release branch creation:

Allowed:

- release-blocking bug fixes;
- security fixes;
- compatibility fixes;
- documentation corrections;
- release metadata;
- migration corrections.

Normally prohibited:

- unrelated features;
- large refactors;
- new experimental capabilities;
- unreviewed architecture changes.

# 46. Release Development Flow

    main
      |
      v
    release/1.0.0
      |
      +--> fix
      |
      +--> CI
      |
      +--> RC
      |
      +--> final validation
      |
      v
    v1.0.0 tag
      |
      v
    Production

Changes required for the release should also be propagated to `main`.

# 47. Release Branch Merge-Back

Release-specific fixes must not remain only on the release branch.

Flow:

    release/1.0.0
         |
         +--> fix
         |
         +--> merge/cherry-pick equivalent
         |
         v
       main

The final synchronization must be verified.

# 48. Release Tags

Production releases shall be represented by immutable Git tags.

Preferred format:

    v<MAJOR>.<MINOR>.<PATCH>

Examples:

    v1.0.0
    v1.1.0
    v2.0.0

Prereleases:

    v1.0.0-alpha.1
    v1.0.0-beta.1
    v1.0.0-rc.1

# 49. Tag Rules

Release tags must:

- point to a qualified commit;
- be created only by authorized release automation/personnel;
- be immutable;
- have release notes;
- identify source revision;
- identify artifact versions;
- identify database migration level;
- identify protocol compatibility.

Tags must never be moved to different commits.

# 50. Annotated Tags

Release tags should be annotated or signed where supported.

Example:

    git tag -a v1.0.0 -m "Kritva RaaS 1.0.0"

Verification:

    git show v1.0.0

# 51. Release Provenance

Every release must be traceable:

    Release
       |
       v
    Git Tag
       |
       v
    Commit
       |
       v
    Source Tree
       |
       +--> Build
       +--> Artifact
       +--> Database Migration
       +--> Protocol Version
       +--> Release Evidence

# 52. Versioning Decision

Kritva RaaS shall use semantic versioning as the primary product release
convention:

    MAJOR.MINOR.PATCH

Meaning:

- MAJOR: incompatible public behavior;
- MINOR: backward-compatible functionality;
- PATCH: backward-compatible fixes.

The release roadmap defines the planned release families.

# 53. Release Families

The current planning baseline is:

| Release | Purpose |
|---|---|
| R0.1 | Foundation |
| R0.2 | Core Platform |
| R0.3 | Artifact/Execution Foundation |
| R0.4 | Integrated Simulation |
| R1.0 Alpha | First integrated product |
| R1.0 Beta | Controlled product validation |
| R1.0 RC | Release candidate |
| R1.0 GA | First production release |
| R1.1 | Stabilization |
| R1.2 | Platform and operations expansion |
| R2.0 | Commercial/ecosystem expansion |

R0.x releases are engineering releases.

# 54. Product Version vs Component Version

The monorepo contains multiple components.

The product release version represents the integrated RaaS release.

Components may have internal versions where required.

The product version remains the primary customer-facing compatibility reference.

# 55. Monorepo Versioning

The monorepo should use a coordinated product release version for:

- Studio;
- Backend;
- contracts;
- Lab Agent;
- SDK-compatible interfaces where applicable.

Packages that are not independently consumed outside the repository do not need
independent public release versions.

# 56. Independent Package Versioning

Independent package versioning may be introduced only when a package becomes:

- externally consumed;
- independently released;
- independently compatible;
- independently supported.

Until then, coordinated monorepo versioning is preferred.

# 57. Internal Package Versions

Internal packages may use:

    0.x

or a product-aligned version if required by tooling.

The exact internal package version must not imply an independent public support
contract unless one exists.

# 58. Protocol Versioning

Protocol versioning is independent of product versioning.

Example:

    Product: 1.0.0
    Lab Protocol: 1.0

A product patch release may retain the same protocol version.

A breaking protocol change requires protocol version change and compatibility
planning.

# 59. Database Versioning

Database schema version is independent of product semantic version.

Migration history is authoritative.

Conceptually:

    Product Version
         |
         +--> Application Version
         |
         +--> Protocol Version
         |
         +--> Database Migration Level
         |
         +--> Artifact Format Version

These versions must be recorded together for production releases.

# 60. Artifact Versioning

A `.krv` artifact must contain:

- application version;
- artifact format version;
- platform;
- architecture;
- KritvaOS version;
- SDK version;
- runtime version;
- checksum;
- signature.

Artifact format version is separate from product version.

# 61. Artifact Compatibility

Compatibility should be evaluated using:

    Artifact
       |
       +--> Format
       +--> Platform
       +--> Architecture
       +--> Runtime
       +--> SDK
       +--> Capabilities
       +--> Policy
       |
       v
    Compatible / Rejected

A matching product version alone is insufficient.

# 62. Studio Versioning

Studio releases should align with product releases.

Example:

    Kritva RaaS 1.0.0
        |
        +--> Studio 1.0.0
        +--> Backend 1.0.0
        +--> Lab Agent compatible release
        +--> Protocol 1.0

Minor component variations are allowed only if documented.

# 63. Lab Agent Versioning

Lab Agent compatibility must be explicit.

The Lab Agent shall identify:

- agent version;
- supported protocol;
- supported runtime;
- supported platform versions;
- security capability.

A Lab Agent must reject unsupported incompatible protocol versions rather than
attempting unsafe interpretation.

# 64. Release Compatibility Matrix

Each production release should maintain:

| Component | Version | Compatible With |
|---|---|---|
| Studio | Product version | Control Plane range |
| Backend | Product version | DB migration range |
| Protocol | Protocol version | Lab Agent range |
| Lab Agent | Agent version | Runtime range |
| Artifact | Format version | Runtime range |
| Database | Migration level | Backend range |

# 65. Hotfix Strategy

Production emergency fixes use:

    hotfix/<version>-<short-description>

Example:

    hotfix/1.0.1-artifact-validation

Hotfix branches originate from the production tag or release commit requiring
the correction.

# 66. Hotfix Flow

    v1.0.0
       |
       v
    hotfix/1.0.1-artifact-validation
       |
       +--> fix
       +--> regression test
       +--> security review if required
       +--> CI
       |
       v
    v1.0.1
       |
       +--> main
       |
       +--> active release branch if applicable

# 67. Hotfix Restrictions

A hotfix must contain only:

- the emergency correction;
- required regression test;
- required compatibility changes;
- required documentation;
- release metadata.

Feature work belongs on `main`.

# 68. Hotfix Review

Hotfixes still require review.

Emergency severity may reduce the number of reviewers but does not eliminate
traceability.

Every hotfix must record:

- incident/issue;
- affected version;
- root cause;
- fix;
- validation;
- release tag.

# 69. Hotfix Merge-Back

A hotfix must be propagated to all maintained branches that require the fix.

Example:

    hotfix
      |
      +--> main
      |
      +--> active release branch
      |
      v
    subsequent releases

# 70. Revert Strategy

When a merged change causes serious regression, prefer a revert over rewriting
history.

Example:

    git revert <commit>

The revert itself is a normal reviewed change.

History rewriting is prohibited on `main`.

# 71. Release Rollback

Rollback should use a previously qualified immutable tag or artifact.

Example:

    v1.0.1
      |
      X
      |
      v1.0.0
      |
      v
    rollback target

Rollback does not mean moving the `v1.0.1` tag.

# 72. Release Branch Protection

Release branches should be protected similarly to `main`.

Required:

- PR review;
- CI;
- no force push;
- no direct unreviewed changes;
- controlled tag creation.

# 73. Emergency Release

Emergency release flow:

    Incident
       |
       v
    Impact Assessment
       |
       v
    Hotfix Branch
       |
       v
    Regression Test
       |
       v
    Review
       |
       v
    CI
       |
       v
    Tag
       |
       v
    Deploy
       |
       v
    Verify
       |
       v
    Merge Back

# 74. Release Candidate Policy

An RC is created only after:

- release scope is frozen;
- required tests pass;
- blocking defects are resolved;
- compatibility is validated;
- documentation is ready;
- release evidence is available.

RC changes should be limited to release-blocking fixes.

# 75. Release Freeze

Release freeze means:

- no new feature scope;
- no unrelated refactor;
- no unreviewed contract changes;
- no unnecessary dependency updates.

Only changes necessary to qualify the release should enter the release branch.

# 76. Dependency Updates During Release

Dependency updates during release stabilization require justification.

Security-critical updates may be accepted.

Routine updates should normally wait for the next development cycle.

# 77. Documentation Versioning

Documentation changes follow the same branch workflow.

Architecture documentation that changes product behavior must be reviewed with
the implementation.

Pure editorial corrections may use lightweight documentation PRs.

# 78. Decision Record Versioning

Architecture decisions are not versioned like application binaries.

They are historical records.

When a decision changes:

    ADR-001
       |
       v
    Superseded by ADR-021

The old decision remains available for historical traceability.

# 79. Release Notes

Release notes should summarize:

- new features;
- fixes;
- security changes;
- compatibility changes;
- migrations;
- known limitations;
- deprecations.

Release notes should link changes to meaningful tasks or PRs where practical.

# 80. Release Evidence

A release evidence package should contain:

- source commit;
- Git tag;
- CI results;
- test summary;
- security results;
- database migration level;
- protocol compatibility;
- artifact checks;
- release approval;
- rollback reference.

# 81. Monorepo Release Flow

The monorepo release flow is:

    main
      |
      v
    Release Candidate
      |
      v
    Integrated Build
      |
      +--> Studio
      +--> Backend
      +--> Contracts
      +--> Lab Agent
      +--> Artifacts
      +--> Database
      |
      v
    Qualification
      |
      v
    Git Tag
      |
      v
    Release

# 82. Partial Package Changes

A change to one package does not automatically imply a product release.

However, every merged change must maintain repository integrity.

Examples:

- UI-only change may not require protocol version change.
- Internal backend refactor may not require product minor version.
- Breaking protocol change requires explicit compatibility analysis.
- Database migration may require release notes.

# 83. Version Impact Analysis

Every release candidate should answer:

| Question | Result |
|---|---|
| Product version | Defined |
| Protocol change | Yes/No |
| Database migration | Defined |
| Artifact format change | Yes/No |
| Studio compatibility | Defined |
| Lab Agent compatibility | Defined |
| Security impact | Defined |
| Rollback | Defined |

# 84. Branch and Version Interface

The relationship is:

    Task Branch
        |
        v
    main
        |
        v
    Release Branch
        |
        v
    RC
        |
        v
    Git Tag
        |
        v
    Product Version

Branches represent development state.

Tags represent immutable release state.

Versions describe compatibility and product identity.

# 85. Phase 0 Mapping

Phase 0 establishes:

- main branch protection;
- branch naming;
- commit convention;
- PR rules;
- CI baseline;
- versioning baseline.

Acceptance:

- repository workflow is enforceable;
- developers can create task branches;
- PR gates are defined.

# 86. Phase 1 Mapping

Phase 1 focuses on:

- backend;
- database;
- identity;
- projects;
- platforms.

Branching requirements:

- migrations reviewed;
- backend changes integrated frequently;
- database compatibility tested.

# 87. Phase 2 Mapping

Phase 2 focuses on:

- Studio;
- local build;
- artifact.

Branching requirements:

- Studio changes remain short-lived;
- artifact contract changes are reviewed;
- cross-platform builds are tested.

# 88. Phase 3 Mapping

Phase 3 focuses on:

- simulated lab;
- Job;
- Run;
- Results.

Branching requirements:

- protocol-first changes;
- simulator contract parity;
- E2E CI.

# 89. Phase 4 Mapping

Phase 4 focuses on:

- credits;
- booking;
- resource allocation.

Branching requirements:

- financial changes receive appropriate review;
- migration compatibility is tested;
- concurrency behavior is verified.

# 90. Phase 5 Mapping

Phase 5 focuses on:

- physical Lab Agent;
- runtime;
- robot.

Branching requirements:

- physical changes use controlled branches;
- safety review is mandatory;
- simulator remains the first validation target.

# 91. Phase 6 Mapping

Phase 6 focuses on:

- production security;
- tenant isolation;
- recovery.

Branching requirements:

- security changes require security review;
- release branches are protected;
- production tags are controlled.

# 92. Phase 7 Mapping

Phase 7 focuses on:

- scale;
- multiple resources;
- operations.

Branching requirements:

- capacity changes remain measurable;
- operational fixes are integrated rapidly;
- release stabilization is controlled.

# 93. Phase 8 Mapping

Phase 8 focuses on:

- production launch.

Branching requirements:

- release branch;
- RC;
- GA tag;
- controlled hotfix process;
- release provenance;
- rollback.

# 94. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Long-lived branches | High | Trunk-based workflow |
| Contract drift | Critical | Contract-first PR |
| Main instability | Critical | CI + branch protection |
| Bad release | Critical | Release branch + RC |
| Hotfix divergence | High | Merge-back |
| Version confusion | High | Product/component/version separation |
| Migration conflict | High | Migration review |
| PR size explosion | High | Task decomposition |
| Review bottleneck | Medium | CODEOWNERS + clear ownership |
| Accidental tag mutation | Critical | Protected immutable tags |
| Unreviewed emergency fix | High | Hotfix review |
| Simulator divergence | High | Contract tests |
| Documentation drift | Medium | DoD |
| Monorepo coupling | Medium | Package boundaries |

# 95. Mitigation Strategy

The strategy reduces risk through:

    Small Branches
         |
         v
    Frequent Integration
         |
         v
    Automated CI
         |
         v
    Human Review
         |
         v
    Protected Main
         |
         v
    Controlled Release
         |
         v
    Immutable Tag

# 96. Open Questions

The following items remain to be finalized as repository operations mature:

1. Exact branch protection settings.
2. Exact CODEOWNERS ownership map.
3. Exact squash-merge configuration.
4. Exact release automation.
5. Exact signing method for Git tags.
6. Exact release approval authority.
7. Exact package versioning automation.
8. Exact changelog generation tooling.
9. Exact automated semantic-release policy, if adopted.
10. Exact release branch naming convention before R1.0.
11. Exact support duration for release branches.
12. Exact hotfix severity thresholds.
13. Exact production tag permissions.
14. Exact artifact provenance integration.
15. Exact GitHub Actions runner matrix.

These questions do not change the core decision to use trunk-based development.

# 97. Branching Acceptance Checklist

- [ ] `main` is the integration trunk.
- [ ] `main` is protected.
- [ ] Direct pushes to `main` are disabled.
- [ ] Force pushes to `main` are disabled.
- [ ] Task branches are short-lived.
- [ ] Branch naming convention is documented.
- [ ] Task IDs are used where applicable.
- [ ] Long-lived `develop` branch is not required.
- [ ] GitFlow is not used as the default.
- [ ] Release branches are temporary.
- [ ] Hotfix branches are supported.

# 98. Commit Acceptance Checklist

- [ ] Commit convention is documented.
- [ ] Conventional Commit-style prefixes are used.
- [ ] Commit messages are meaningful.
- [ ] Breaking changes are identifiable.
- [ ] Unrelated changes are avoided.
- [ ] Task traceability is maintained.
- [ ] Attribution is truthful.
- [ ] Sensitive information is excluded.

# 99. Pull Request Acceptance Checklist

- [ ] Every change enters through a PR unless explicitly authorized as an
      emergency operation.
- [ ] PR has a task reference.
- [ ] PR scope is clear.
- [ ] PR architecture impact is stated.
- [ ] Contract impact is stated.
- [ ] Database impact is stated.
- [ ] Security impact is stated.
- [ ] Testing is documented.
- [ ] Documentation is updated.
- [ ] Required reviewers approve.
- [ ] Required CI passes.
- [ ] Blocking comments are resolved.

# 100. Contract Acceptance Checklist

- [ ] Cross-boundary changes are identified.
- [ ] Contract is defined before dependent implementation.
- [ ] Producers are identified.
- [ ] Consumers are identified.
- [ ] Version impact is analyzed.
- [ ] Compatibility is analyzed.
- [ ] Contract tests exist.
- [ ] Breaking changes are explicitly reviewed.
- [ ] Migration path is documented.

# 101. Release Branch Acceptance Checklist

- [ ] Release branch originates from qualified `main`.
- [ ] Release scope is defined.
- [ ] Feature scope is frozen.
- [ ] Release-blocking fixes are reviewed.
- [ ] CI passes.
- [ ] Compatibility matrix is complete.
- [ ] Database migration level is known.
- [ ] Protocol version is known.
- [ ] Artifact format is known.
- [ ] Release documentation is complete.

# 102. Tag Acceptance Checklist

- [ ] Release commit is qualified.
- [ ] Tag follows version convention.
- [ ] Tag is immutable.
- [ ] Tag permissions are restricted.
- [ ] Release notes exist.
- [ ] Source commit is recorded.
- [ ] Build evidence exists.
- [ ] Security evidence exists.
- [ ] Database migration level is recorded.
- [ ] Protocol compatibility is recorded.
- [ ] Rollback target is known.

# 103. Hotfix Acceptance Checklist

- [ ] Incident is identified.
- [ ] Affected release is identified.
- [ ] Hotfix branch originates from correct release state.
- [ ] Root cause is understood.
- [ ] Regression test exists.
- [ ] Required security review is complete.
- [ ] Required safety review is complete.
- [ ] CI passes.
- [ ] Hotfix is tagged.
- [ ] Fix is merged back to `main`.
- [ ] Other maintained release branches are updated where necessary.
- [ ] Incident record is updated.

# 104. Monorepo Versioning Acceptance Checklist

- [ ] Product release version is defined.
- [ ] Component versions are defined where required.
- [ ] Protocol version is explicit.
- [ ] Database migration level is explicit.
- [ ] Artifact format version is explicit.
- [ ] Studio compatibility is explicit.
- [ ] Lab Agent compatibility is explicit.
- [ ] Release provenance is complete.
- [ ] Version changes are reviewed.

# 105. CI Acceptance Checklist

- [ ] Format gate exists.
- [ ] Lint gate exists.
- [ ] Typecheck gate exists.
- [ ] Unit-test gate exists.
- [ ] Integration gate exists where applicable.
- [ ] E2E gate exists where applicable.
- [ ] Security gate exists where applicable.
- [ ] Build gate exists.
- [ ] Migration gate exists where applicable.
- [ ] Contract gate exists where applicable.
- [ ] Required gates protect `main`.
- [ ] Required gates protect release branches.

# 106. Integration Acceptance Checklist

- [ ] Task branch is synchronized before merge.
- [ ] Merge conflicts are resolved semantically.
- [ ] Tests are rerun after rebase.
- [ ] Contract consumers remain compatible.
- [ ] Database migrations remain ordered.
- [ ] Documentation remains synchronized.
- [ ] Tracking reflects merged state.
- [ ] Release impact is recorded where applicable.

# 107. Security Acceptance Checklist

- [ ] Branches contain no secrets.
- [ ] PRs do not expose credentials.
- [ ] Production signing keys are protected.
- [ ] Production tags are access controlled.
- [ ] Security fixes use controlled branches.
- [ ] Security CI runs where applicable.
- [ ] Artifact signing is not bypassed.
- [ ] Tenant isolation changes receive security review.
- [ ] Authentication changes receive security review.

# 108. Safety Acceptance Checklist

- [ ] Physical behavior changes are identified.
- [ ] Simulator validation is completed first.
- [ ] HIL validation is completed where required.
- [ ] Human safety review is complete.
- [ ] Local safety remains authoritative.
- [ ] Cloud availability is not treated as a safety mechanism.
- [ ] Physical deployment approval is explicit.

# 109. Documentation Acceptance Checklist

- [ ] Relevant development documentation is updated.
- [ ] Architecture documentation is updated.
- [ ] Contract documentation is updated.
- [ ] Database documentation is updated.
- [ ] Security documentation is updated.
- [ ] Release documentation is updated where applicable.
- [ ] Changelog is updated where appropriate.
- [ ] Decision records are updated where architecture changed.

# 110. Final Branching Invariants

The following are mandatory:

1. `main` is the canonical integration branch.
2. `main` is protected.
3. Developers use short-lived task branches.
4. There is no permanent GitFlow `develop` branch.
5. Every meaningful change is reviewed through a PR.
6. Contract changes are explicit.
7. Database changes are migration-backed.
8. Architecture changes require ADR review.
9. Release branches are temporary.
10. Production releases use immutable tags.
11. Hotfixes originate from the affected production state.
12. Hotfixes are merged back into maintained development branches.
13. Release tags are never moved.
14. Product version and protocol version remain distinct.
15. Product version and database migration level remain distinct.
16. Artifact format version remains distinct from product version.
17. Monorepo components remain coordinated unless independent release is
    explicitly justified.
18. CI protects the integration trunk.
19. Documentation and tracking are part of completion.
20. Branching must support frequent integration rather than isolate teams.

# 111. Final Development Flow

The canonical development path is:

    Requirement
        |
        v
    Task
        |
        v
    feat/<task-id>-<description>
        |
        v
    Contract / Design
        |
        v
    Implementation
        |
        v
    Tests
        |
        v
    Documentation
        |
        v
    Pull Request
        |
        v
    CI + Review
        |
        v
    main
        |
        v
    Release Branch
        |
        v
    RC
        |
        v
    Qualification
        |
        v
    Immutable Tag
        |
        v
    Release

Emergency path:

    Production
        |
        v
    Incident
        |
        v
    hotfix/<version>-<description>
        |
        v
    Regression Test
        |
        v
    Review + CI
        |
        v
    Hotfix Tag
        |
        +----> main
        |
        +----> maintained release branches

# 112. Final Principle

> Kritva RaaS shall use trunk-based development with short-lived, task-oriented
> branches because the product is a rapidly evolving monorepo whose highest
> integration risks arise from contract drift, shared dependencies, database
> changes and cross-domain divergence. `main` shall remain the protected
> integration trunk; task branches shall be small and reviewable; contracts,
> architecture, security and database changes shall be explicit; pull
> requests and CI shall be mandatory quality gates; temporary release branches
> shall provide controlled stabilization without creating a permanent
> GitFlow-style development branch; and production state shall be represented
> by immutable, traceable Git tags. Hotfixes shall originate from the affected
> production state, remain narrowly scoped, receive appropriate review and
> propagate back to maintained development branches. Product, protocol,
> database, artifact and component versions shall remain distinct but
> traceable. This strategy is intended to keep Kritva RaaS continuously
> integrable during Phases 0-8 while preserving the ability to stabilize,
> qualify, release, rollback and repair the platform safely.
