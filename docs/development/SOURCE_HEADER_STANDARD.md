# Kritva RaaS Source Header Standard

## Document Control

| Field | Value |
|---|---|
| Document | Source Header Standard |
| Path | `docs/development/SOURCE_HEADER_STANDARD.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE (B-INC-001, task KR-BINC-001-018); C-M01 FOUNDATION |

## 1. Purpose

Every authored source file in kritva-raas starts with a standard header that identifies ownership, purpose, architectural placement, requirement traceability and license. The format and rule IDs (HEADER-001 to HEADER-008) follow the Kritva Core standard (`kritva-core`, `scripts/lint/check_source_headers.py` and `.github/workflows/source-header-check.yml`). RaaS differs from Kritva Core in three ways: the license identifier is proprietary, the RaaS language set is in scope, and Component and Layer use a controlled vocabulary.

## 2. Header Format

The header is a contiguous comment block at the top of the file. A required shebang stays on line 1, with the header immediately after it. Lines that contain only the comment marker separate field groups; a truly blank line ends the block, so do not use one inside the header.

Python, shell, YAML and Git hooks (`#`):

    #==============================================================================
    # Copyright (c) 2026 KritvaOS
    # SPDX-License-Identifier: LicenseRef-KritvaOS-Proprietary
    #
    # File        : project_service.py
    # Description : <one sentence stating the file's purpose>
    #
    # Component   : Control Plane
    # Module      : Project Service
    # Layer       : Service
    #
    # Requirements: KR-BE-1-024, BAC-023
    # API         : Control Plane project service interface
    #
    # Author      : KritvaOS
    # Created     : 10-10-2026
    #==============================================================================

TypeScript, JavaScript and Rust use the same block with `//`. SQL uses `--`.

## 3. Fields

| Field | Rule |
|---|---|
| Copyright | Exactly `Copyright (c) 2026 KritvaOS`. |
| SPDX-License-Identifier | Exactly `LicenseRef-KritvaOS-Proprietary`. The repository owner has designated kritva-raas as proprietary, so the Kritva Core `Apache-2.0` value must not be used. The header identifies the license; it does not replace the license terms or third-party attribution obligations. |
| File | The repository-relative path is canonical, for example `apps/control-plane/src/projects/project-service.ts`. The file name alone is accepted for compatibility with Kritva Core headers, but use the full path in new files so that files with the same name are unambiguous. The value must match the actual file and is updated when the file is renamed or moved. |
| Description | One specific sentence. Generic text such as "source file" or "utility" is not acceptable. |
| Component | One value from Section 4.1: the subsystem that owns the file's primary responsibility. |
| Module | The specific service, component, script, workflow or migration. Free text, but descriptive. |
| Layer | One value from Section 4.2: the architectural responsibility the file implements. |
| Requirements | See Section 5. Never empty and never invented. |
| API | The interface the file provides. It need not be a network API, for example "Control Plane project service interface", "Local Runtime IPC commands", "Command-line interface" or "GitHub Actions workflow". A file with no callable interface says so, for example "No callable API; database migration". |
| Author | Always `KritvaOS`. Ownership is recorded through Component and the planning records, not individual names. |
| Created | The original creation date as `DD-MM-YYYY`, which must be a real calendar date. A rename or later change does not reset it. |

## 4. Controlled Vocabularies

Adding a value requires a reviewed change to this standard and to `COMPONENTS` or `LAYERS` in the checker.

### 4.1 Component

| Value | Scope |
|---|---|
| Studio Frontend | React/TypeScript interface and Studio client behavior |
| Local Runtime | Tauri host, native integration and Rust runtime |
| Control Plane | Node.js backend services, application logic and API implementation |
| Database | Schemas, SQL migrations, database policies and database-owned assets |
| Cloud Infrastructure | Cloud resources, provisioning, deployment and operational configuration |
| Infrastructure | Repository tooling, CI, hooks, linting and engineering automation |

Do not use Infrastructure for product code just because the file is used in a build or deployment.

### 4.2 Layer

| Value | Responsibility |
|---|---|
| Presentation | Screens, views, UI components and interaction presentation |
| Application | Client workflows, use cases and orchestration |
| Domain | Business rules and domain models |
| API | Routes, request and response contracts, API middleware |
| Service | Backend application services and orchestration |
| Persistence | Repositories, data-access adapters and persistence mappings |
| Database Schema | SQL schema, migrations, constraints and database policies |
| Native Runtime | Tauri commands, native integration and Rust host code |
| Infrastructure | Cloud resources, deployment components and provider integrations |
| Development Infrastructure | CI workflows, checkers, scripts and developer tooling |

## 5. Requirements Field

1. Product code cites the requirement and task IDs it implements, for example `SEC-182`, `KR-BE-1-024` or `KR-BINC-001-005`. Cite a `BAC-*` ID as the acceptance criterion the file implements or verifies.
2. Separate multiple IDs with commas.
3. The source header checker, its workflow, hook and tests cite `HEADER-001`, plus the planning task `KR-BINC-001-018`. Do not use `HEADER-001` for other code.
4. When no product requirement applies, write `N/A — <specific reason>`, citing the governing audit finding or task where one exists.
5. Never invent an ID, and never use a commit hash, test name or milestone title in its place.

## 6. Scope and Exemptions

The checker examines tracked files only. In scope:

| Type | Extensions or paths | Comment |
|---|---|---|
| TypeScript and JavaScript | `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs` | `//` |
| Rust | `.rs` | `//` |
| SQL, including handwritten migrations | `.sql` | `--` |
| Python and shell | `.py`, `.sh`, `.bash` | `#` |
| CI workflows | `.github/workflows/*.yml`, `.yaml` | `#` |
| Git hook | `.githooks/pre-commit` | `#` |
| C, C++, HDL and device tree (inherited from Kritva Core) | `.c`, `.cpp`, `.h`, `.hpp`, `.v`, `.sv`, `.dts` and related | `//` or `#` |

Exempt:

- Directories `.git`, `build`, `out`, `dist`, `target`, `coverage`, `node_modules`, `third_party`, `vendor`, `generated` and `external`, in any position in the path.
- Files that cannot carry comments or are tool-generated: JSON (including lockfiles and manifests), Markdown, `*.min.js` and `requirements.txt`. Handwritten `*.d.ts` declaration files are in scope; generated ones live in excluded output directories.
- `tests/source_header_check/fixtures/`, for deliberately malformed fixture files only. The test module `tests/source_header_check/test_check_source_headers.py` is in scope and must carry a header.

Do not put handwritten source in an exempt directory. A new exemption must be explicit (a directory, file name or suffix), documented here and reviewed.

## 7. Rule IDs

| Rule | Failure |
|---|---|
| HEADER-001 | `SPDX-License-Identifier` missing, duplicated, or not exactly `LicenseRef-KritvaOS-Proprietary` |
| HEADER-002 | `Created` missing, not `DD-MM-YYYY`, or not a real date |
| HEADER-003 | Not exactly one copyright line, or that line is not exactly `Copyright (c) 2026 KritvaOS` |
| HEADER-004 | A required field is missing, empty or duplicated |
| HEADER-005 | `File` matches neither the repository-relative path nor the file name (RaaS addition) |
| HEADER-006 | File is unreadable or not valid UTF-8 |
| HEADER-007 | `Component` or `Layer` is outside the controlled vocabulary, or `Author` is not `KritvaOS` (RaaS addition) |
| HEADER-008 | Header missing, malformed, or not starting on line 1 (line 2 after a shebang) |

HEADER-001 to 004, 006 and 008 keep their Kritva Core meanings. RaaS checks them more strictly: values are compared exactly rather than as substrings, duplicates are rejected, and the header must start at the top of the file. Kritva Core does not use HEADER-005 or HEADER-007; RaaS defines them as above.

Checker-enforced rules: everything in this table. Review-checked conventions, which the checker cannot judge: Description is specific, Module is descriptive, Requirements cites real IDs (Section 5), API describes the real interface, and Created is the original creation date.

## 8. Enforcement

| Mechanism | Command or file | Role |
|---|---|---|
| CI | `.github/workflows/source-header-check.yml`, on every push and pull request | Authoritative automated check. It blocks merges only once `Source Header Check` and `docs-check` are configured as required status checks in branch protection for `main`; until that configuration is verified, it is an automated check, not proven merge enforcement. |
| Checker | `python3 scripts/lint/check_source_headers.py --mode tracked --strict` | Same command locally and in CI. Without `--strict` the checker is report-only (it lists violations and exits 0); `--strict` exits 1 on any violation. |
| Checker tests | `python3 -m unittest discover -s tests/source_header_check -v` | Run in CI before the check |
| Pre-commit hook | `.githooks/pre-commit`; enable with `git config core.hooksPath .githooks` | Optional local convenience |

To check specific files before staging them, run `python3 scripts/lint/check_source_headers.py --mode files --files <paths>`.

## 9. Planning Traceability

Task KR-BINC-001-018 in B-INC-001 SECURE FOUNDATION; acceptance criterion `B-INC-001-AC-21`; backend acceptance criterion `BAC-039`; test `BTS-037`. Acceptance requires the checker output, the unit-test output and a green `Source Header Check` run for the implementation revision. This document on its own does not show that enforcement is implemented.
