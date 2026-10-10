# Frontend Development Setup

**Project:** Kritva RaaS  
**Document:** `docs/frontend/development/DEVELOPMENT_SETUP.md`  
**Scope:** Frontend-specific development environment setup and local execution  
**Audience:** Frontend developers, UI engineers, and contributors working on Studio and Web Console  
**Status:** Frontend development setup guide

## 1. Purpose

This document defines the frontend-specific setup required to install dependencies, configure the frontend environment, build the frontend applications, and run Studio and Web Console locally.

It covers:

- Node.js and pnpm requirements.
- Frontend repository and workspace setup.
- Tauri prerequisites on Linux, Windows, and macOS.
- Rust toolchain installation for the Tauri Local Runtime.
- Frontend environment configuration.
- Running Studio and Web Console in development mode.
- Building and validating frontend applications.
- Frontend-specific troubleshooting.

This document assumes that contributors have completed the applicable global development environment setup.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns frontend-specific setup and local development instructions, including:

- Node.js version requirements for frontend development.
- pnpm installation and frontend dependency management.
- Frontend workspace installation.
- Tauri system prerequisites by operating system.
- Rust toolchain setup required by the Tauri Local Runtime.
- Frontend environment variables and local configuration.
- Starting Studio and Web Console.
- Running frontend lint, type-check, test, and build commands.
- Frontend-specific troubleshooting.
- Frontend development validation before submitting changes.

### 2.2 Global Setup Ownership

`docs/development/DEVELOPMENT_SETUP.md` owns global development setup and onboarding.

That document is authoritative for:

- General contributor onboarding.
- Git installation and configuration.
- Repository access and cloning conventions.
- General shell and terminal setup.
- Shared development utilities.
- Common environment-variable conventions.
- Global security and credential-handling guidance.
- General build prerequisites shared across domains.
- Cross-domain development workflow.

This document MUST NOT duplicate those instructions. It SHOULD link to the global setup guide when a prerequisite is shared by multiple domains.

### 2.3 Other Document Ownership

| Concern | Authoritative document |
|---|---|
| Global development setup and onboarding | `docs/development/DEVELOPMENT_SETUP.md` |
| Frontend-specific development setup | `docs/frontend/development/DEVELOPMENT_SETUP.md` |
| Frontend architecture and implementation | Applicable architecture documents under `docs/frontend/` |
| Frontend architecture decisions | `docs/frontend/planning/DECISIONS.md` |
| Frontend milestone scope and acceptance | Authoritative dossiers under `docs/frontend/milestones/` |
| Product/system-level decisions | `docs/planning/DECISIONS.md` |
| Canonical phase definitions | `docs/planning/PHASES.md` |
| Backend implementation and local services | Applicable documents under `docs/backend/` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| API wire contract | `docs/protocol/API_CONTRACT.md` |
| Event wire contract | `docs/protocol/EVENT_CONTRACT.md` |
| Artifact contract and manifest | `docs/protocol/ARTIFACT_MANIFEST.md` |
| Cloud implementation and deployed environments | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Cloud and infrastructure security | `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` |
| Database implementation | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Cross-domain milestone scope | Applicable authoritative dossiers under `docs/**/milestones/` |

The referenced documents remain authoritative for their named responsibilities.

### 2.4 Non-Goals

This document does not define:

- Global workstation setup.
- Complete Git onboarding.
- Backend service installation or configuration.
- Database installation and schema initialization.
- Cloud account setup or infrastructure provisioning.
- Product architecture or system topology.
- Frontend implementation architecture in full.
- API request and response semantics.
- Production deployment procedures.
- Milestone acceptance criteria.
- General contributor policies already defined by the global setup guide.

Where a task requires one of these topics, follow the authoritative document listed above.

## 3. Prerequisites

Before starting frontend setup, ensure that the global development prerequisites described in `docs/development/DEVELOPMENT_SETUP.md` are complete.

You should have:

- Access to the Kritva RaaS source repository.
- Git installed and configured.
- A terminal appropriate for your operating system.
- Network access to the project's approved package registries.
- Permission to install required development tools.
- Access to the frontend environment configuration required for your assigned task.

For Tauri development, additional native build prerequisites are required. These are covered in Section 6.

For Local Runtime development, Rust tooling is required as described in Section 7.

### 3.1 Confirm the Repository

Open a terminal in the repository root.

Confirm that Git recognizes the repository:

    git status

The working tree should be understood before running commands that may update dependencies or generated files.

Do not run destructive cleanup commands against an unfamiliar working tree.

### 3.2 Confirm Frontend Package Location

The frontend package and workspace layout MUST be discovered from the repository's current package metadata.

Look for the applicable files:

    package.json
    pnpm-workspace.yaml
    pnpm-lock.yaml

These files may be located at the repository root or within a frontend-specific directory.

Do not assume that every frontend package is independently installable.

Use the workspace root and scripts defined by the repository rather than creating a separate package installation layout.

## 4. Node.js Setup

### 4.1 Required Runtime

Frontend development uses Node.js.

The required Node.js version MUST be taken from the repository's version declaration and package metadata. The repository may specify the supported version through files such as:

- `.nvmrc`
- `.node-version`
- `package.json` `engines`
- Tool-version configuration maintained by the project

When multiple declarations exist, follow the project's documented version policy and resolve conflicting declarations before changing the toolchain.

Do not automatically select the newest Node.js release.

### 4.2 Check the Installed Version

Run:

    node --version
    npm --version

Compare the Node.js version with the version required by the repository.

The npm version is useful for diagnosing installation issues, but pnpm is the package manager used by this setup when the repository declares pnpm.

### 4.3 Install Node.js

Use an approved Node.js distribution or version manager suitable for your operating system.

If the repository contains an `.nvmrc` file and you use nvm, select the declared version from the repository root:

    nvm install
    nvm use

If the project uses a different version manager, use that tool's documented commands and honor the repository's version declaration.

Avoid mixing system Node.js, version-manager Node.js, and unrelated global package installations without understanding which executable is active.

### 4.4 Validate the Active Executable

On Linux or macOS, run:

    command -v node
    command -v npm

On Windows PowerShell, run:

    Get-Command node
    Get-Command npm

If the active executable is not from the expected installation, correct the environment before installing frontend dependencies.

## 5. pnpm Setup

### 5.1 Package Manager

The frontend uses pnpm where declared by the repository's package metadata.

The exact pnpm version SHOULD be pinned through the repository's `packageManager` field or its approved tool-version configuration.

Do not upgrade pnpm independently of the project toolchain.

### 5.2 Check pnpm

Run:

    pnpm --version

If pnpm is unavailable, install or activate the version required by the repository.

Where Corepack is supported and configured for the project, it MAY be used to activate the declared package-manager version.

For example, after verifying the repository's Node.js and package-manager requirements:

    corepack enable
    corepack pnpm --version

If the project specifies another approved installation method, follow that method.

### 5.3 Install Dependencies

Run dependency installation from the declared pnpm workspace root.

    pnpm install

For a clean, reproducible CI-style installation, use the lockfile-enforcing mode supported by the repository's pinned pnpm version:

    pnpm install --frozen-lockfile

The lockfile-enforcing installation SHOULD be used to verify that dependency metadata and the committed lockfile are consistent.

Do not delete or regenerate the lockfile merely to work around an installation failure.

### 5.4 Dependency Management Rules

- Use pnpm for workspace dependency management when the repository declares pnpm.
- Do not mix npm, Yarn, and pnpm lockfiles in the same workspace without an explicit project decision.
- Do not commit generated dependency directories.
- Do not install dependencies from untrusted registries.
- Do not add a package globally when it belongs in the project workspace.
- Do not upgrade unrelated dependencies as part of a setup fix.
- Review lockfile changes before committing.

### 5.5 Confirm Installation

Run:

    pnpm --version
    pnpm list --depth 0

The listing may differ depending on the workspace and package selected. Use it as a diagnostic rather than an expectation that every package appears in one command.

## 6. Tauri Native Prerequisites

### 6.1 When Native Prerequisites Are Needed

Tauri prerequisites are required when developing, building, or running the Tauri desktop application.

They may not be required for a browser-only Web Console workflow.

The exact native dependencies depend on the Tauri version and the operating system.

Use the Tauri documentation corresponding to the version declared in the project. Do not copy package names from documentation for a different major version without verification.

### 6.2 Linux

A Linux workstation generally requires:

- A supported C toolchain.
- A build system such as `make`.
- A compatible WebView implementation.
- GTK and related development headers required by the selected Tauri version.
- Additional native libraries required by the project's dependencies.
- Rust tooling for the Tauri application.

The required development packages vary by Linux distribution and Tauri version.

On Debian or Ubuntu, inspect the official Tauri prerequisites for the applicable version before installing system packages.

A package installation may resemble the following, but the exact package list MUST be verified for the selected Tauri version and distribution:

    sudo apt update

Install only the required packages identified by the official prerequisites.

Do not assume that a successful browser installation also provides the development headers needed to compile a desktop application.

### 6.3 Fedora and RHEL-Based Linux

On Fedora or a RHEL-based system, install the compiler, build utilities, WebView development packages, GTK development headers, and other dependencies specified by the applicable Tauri documentation.

Use the distribution's supported package manager.

Do not blindly reuse Debian package names or install libraries from an unrelated distribution.

Where the workstation uses a managed corporate image, confirm whether development packages must be installed by an administrator.

### 6.4 Windows

Windows Tauri development generally requires:

- A supported Windows version.
- Microsoft C++ build tools.
- The Windows SDK required by the selected Tauri version.
- WebView2 runtime or the required development components.
- Rust tooling.
- Node.js and pnpm.

Install the required Microsoft components using the official installer and documentation.

After installation, open a terminal configured for the selected C++ build toolchain if the project requires it.

Verify that the required compiler and SDK are available before troubleshooting application source code.

### 6.5 macOS

macOS Tauri development generally requires:

- A supported macOS version.
- Xcode Command Line Tools or the Xcode components required by the selected Tauri version.
- Rust tooling.
- Node.js and pnpm.
- Any additional dependencies required by the project's native plugins.

Check the installed command-line tools:

    xcode-select -p
    clang --version

If the command-line tools are missing, install them using Apple's supported installation workflow.

Do not assume that installing the full Xcode application is required when the applicable Tauri version only requires the command-line tools.

### 6.6 Native Dependency Validation

Before building the desktop application:

1. Confirm Node.js and pnpm versions.
2. Confirm native compiler availability.
3. Confirm the required WebView dependencies.
4. Confirm that platform-specific development headers are installed.
5. Confirm that the Rust toolchain is available.
6. Run the project's native development command from the correct package.

A native compilation error should be classified as a toolchain, dependency, or source error before changing application code.

## 7. Rust Toolchain for the Local Runtime

### 7.1 Scope

Rust setup is required when the frontend includes a Tauri Local Runtime or another frontend-integrated Rust component.

This section covers the frontend's use of Rust. General system toolchain policy remains owned by `docs/development/DEVELOPMENT_SETUP.md`.

### 7.2 Rust Version

The Rust version MUST follow the repository's declared toolchain configuration, if present.

Check for:

- `rust-toolchain`
- `rust-toolchain.toml`
- `Cargo.toml` requirements
- Tauri version constraints
- Native dependency requirements

Do not upgrade Rust independently when the repository pins a toolchain.

### 7.3 Check Rust Installation

Run:

    rustc --version
    cargo --version
    rustup --version

The required commands must be available to the shell used for frontend development.

If a version is inconsistent with the repository, activate the declared toolchain rather than immediately modifying project metadata.

### 7.4 Install or Activate Rust

When rustup is the project's approved toolchain manager, use its documented installation and toolchain-selection workflow.

If the repository declares a toolchain file, run the project commands from the directory where the toolchain configuration applies.

For example:

    rustup show
    rustc --version
    cargo --version

A repository-pinned toolchain should take precedence over an arbitrary globally selected compiler version.

### 7.5 Rust Components and Targets

Install only the Rust components and targets required by the project.

Common development components may include formatting and linting tools when the repository uses them.

For example:

    rustup component list --installed

Do not install additional targets unless cross-compilation or the project build requires them.

### 7.6 Validate the Local Runtime

From the directory containing the applicable Cargo manifest, run the project's documented validation command.

Where supported by the repository:

    cargo check

A successful `cargo check` helps verify Rust dependency resolution and compilation without producing a final release binary.

It does not replace a complete Tauri build or runtime validation.

### 7.7 Rust Dependency Policy

- Follow the committed `Cargo.lock` where the application is a binary or the project otherwise requires a pinned dependency graph.
- Do not update unrelated Rust dependencies to solve an isolated setup issue.
- Review changes to `Cargo.toml` and `Cargo.lock`.
- Use supported Rust versions for the declared Tauri release.
- Keep native dependencies aligned with the documented operating-system prerequisites.

## 8. Frontend Environment Configuration

### 8.1 Configuration Principles

Frontend environment configuration MUST be based on the repository's current configuration templates and runtime conventions.

Before creating environment files, inspect the relevant frontend package for:

- `.env.example`
- `.env.template`
- Package-specific configuration documentation
- Development scripts
- Tauri configuration
- Framework-specific environment conventions

Use the actual variable names declared by the project.

This guide MUST NOT invent a replacement configuration schema.

### 8.2 Local Environment Files

If the repository provides an example environment file, copy it to the documented local filename.

For example, if the package explicitly uses `.env.example` and `.env.local`:

    cp .env.example .env.local

Run the command from the directory containing those files.

On Windows, use an equivalent file-copy command.

Do not create environment files in the repository root when the frontend framework expects them inside a package directory.

### 8.3 Required Variables

The frontend configuration may include settings for:

- Backend API base URL.
- WebSocket or other realtime endpoint.
- Development mode.
- Local Runtime integration.
- Feature flags intended for local development.
- Public build-time configuration.

The exact variable names, accepted values, defaults, and required/optional status MUST be documented by the frontend package or its configuration schema.

Do not assume that a variable exposed to browser code is secret.

### 8.4 Public and Private Configuration

Values compiled into browser JavaScript or exposed through frontend runtime configuration MUST be treated as public.

The frontend MUST NOT embed:

- Database passwords.
- Private API credentials.
- Cloud access keys.
- Signing secrets.
- Backend service credentials.
- Long-lived privileged tokens.

A backend endpoint or public client identifier may be exposed when the system design explicitly permits it.

Secrets MUST remain in the approved backend or infrastructure secret-management boundary.

### 8.5 API Endpoint Configuration

The configured API endpoint MUST match the backend environment being used.

For local development, use the endpoint documented by the backend development setup.

Do not assume a fixed port or host unless it is defined by the current project configuration.

If the frontend and backend run on different origins, ensure that the backend's approved local CORS configuration supports the development workflow.

Frontend configuration MUST NOT be used to bypass backend authorization or access controls.

### 8.6 Realtime Endpoint Configuration

If the frontend consumes realtime updates, configure the endpoint according to the project's documented API and event integration model.

The endpoint MUST correspond to the correct environment.

The frontend MUST follow the published event and API contracts rather than hard-code assumptions about backend message formats.

Refer to:

- `docs/protocol/API_CONTRACT.md`
- `docs/protocol/EVENT_CONTRACT.md`

### 8.7 Tauri Configuration

Tauri-specific configuration may include the application identifier, frontend development URL, build output path, native permissions, and platform packaging settings.

These values MUST follow the current Tauri configuration files and frontend architecture.

Do not change application identifiers, permission scopes, or packaging settings merely to resolve a local startup issue.

Security-sensitive changes require review under the applicable security and architecture documents.

### 8.8 Environment File Safety

Local environment files containing credentials or private values MUST NOT be committed.

Before committing configuration changes, inspect:

    git status
    git diff --check
    git diff

Confirm that no secrets, local machine paths, generated credentials, or unrelated environment changes are included.

## 9. Running Studio and Web Console

### 9.1 Discover Available Scripts

Before starting the frontend, inspect the package scripts.

Run from the appropriate workspace root:

    pnpm run

Alternatively, inspect the relevant `package.json` file.

Use the script names defined by the repository. The names in this guide describe workflow intent and MUST NOT be interpreted as guaranteed script names.

### 9.2 Install Dependencies First

From the pnpm workspace root:

    pnpm install

For reproducibility checks:

    pnpm install --frozen-lockfile

If installation fails, resolve the dependency or toolchain problem before attempting to run the application.

### 9.3 Start the Web Console

Identify the package and script intended to run the browser-based Web Console.

From the appropriate workspace root, use the documented development script.

For example, if the package declares a `dev` script:

    pnpm --filter <web-console-package> dev

Replace `<web-console-package>` with the actual package selector declared by the workspace.

Do not use a guessed package name.

If the project uses a root-level script to launch the Web Console, use that script instead.

### 9.4 Start Studio

Identify the package and script intended to run Studio.

For a browser-based Studio development workflow, use the corresponding frontend development script.

For a Tauri desktop workflow, use the package's documented Tauri development command.

If the project exposes a `tauri dev` script through pnpm, the invocation may resemble:

    pnpm --filter <studio-package> tauri dev

Replace the package selector and script with the values actually declared by the repository.

Do not run the Tauri command from an unrelated package.

### 9.5 Local Runtime

When Studio integrates with the Local Runtime, verify that the runtime's required local services or processes are available before starting workflows that depend on them.

The Local Runtime's complete service architecture and lifecycle MUST be documented in the relevant frontend or system architecture documents.

This setup guide covers only the frontend toolchain required to build and launch the integration.

If the Local Runtime requires a separate backend or system service, follow the applicable setup instructions owned by that component.

### 9.6 Startup Validation

After startup, confirm that:

- The development command completes without a fatal error.
- The expected local URL or desktop window is available.
- Browser developer tools do not show unresolved startup errors.
- Required environment variables are loaded.
- API requests use the expected development endpoint.
- Realtime connections are attempted only when configured and supported.
- Native runtime dependencies load successfully for the Tauri application.

A successful frontend startup does not prove that backend services are available or that a complete user workflow is operational.

### 9.7 Separate Processes

Studio, Web Console, and backend services may run as separate processes.

Use the repository's documented scripts to start each required process.

Avoid launching multiple copies of the same application when they contend for a development port or shared local resource.

When a port conflict occurs, identify the process owner before terminating anything.

## 10. Frontend Validation Commands

### 10.1 Discover Validation Scripts

Use the scripts defined by the frontend package and workspace.

Typical validation categories include:

- Linting.
- Type checking.
- Unit tests.
- Component or integration tests.
- Production builds.
- Tauri or native compilation checks.

Do not assume that all categories are implemented in every package.

### 10.2 Linting

If the package defines a lint script, run the package's lint command.

For example:

    pnpm --filter <frontend-package> lint

Replace the package selector with the actual workspace package.

Resolve lint failures rather than disabling rules without review.

### 10.3 Type Checking

If the package provides a type-check script, run it before submitting changes.

For example:

    pnpm --filter <frontend-package> typecheck

Use the actual script name declared in the package.

Type checking is particularly important when modifying shared interfaces, API mappings, or application state.

### 10.4 Unit and Component Tests

Run the package's documented test command.

For example:

    pnpm --filter <frontend-package> test

If the repository uses a separate command for component tests or integration tests, run the applicable command as well.

Tests MUST be isolated from production data and credentials.

### 10.5 Production Build

Run the production build command defined by the package.

For example:

    pnpm --filter <frontend-package> build

A successful development server does not prove that the production build succeeds.

Investigate build-time environment requirements separately from development-time configuration.

### 10.6 Tauri Build Validation

When changing Tauri configuration, native integration, or Rust code, run the project's documented native validation commands.

At minimum, use the applicable Rust and frontend checks.

Where the environment supports the full native build, validate the actual Tauri package as well.

A browser-only build MUST NOT be treated as proof that native compilation or desktop startup works.

### 10.7 Change Review

Before submitting frontend changes, inspect:

    git status
    git diff --check
    git diff

Verify that the change includes only intended files and does not contain local environment files, generated artifacts, credentials, or unrelated dependency updates.

Follow the project's contribution and review workflow defined in the global development documentation.

## 11. Troubleshooting

### 11.1 Node.js Version Mismatch

**Symptoms**

- Package installation fails with an engine requirement.
- A framework or build tool refuses to start.
- Different developers observe different build behavior.

**Actions**

1. Check `node --version`.
2. Inspect the repository's Node.js version declaration.
3. Confirm which executable the shell is using.
4. Activate the required version.
5. Retry dependency installation.

Do not bypass an engine constraint without understanding why it exists.

### 11.2 pnpm Not Found

**Symptoms**

- The shell reports that `pnpm` is unavailable.
- A workspace script cannot be started.

**Actions**

1. Confirm the required Node.js version.
2. Check whether the project uses Corepack or another approved package-manager installation method.
3. Activate the declared pnpm version.
4. Open a new terminal if the executable path changed.
5. Verify `pnpm --version`.

Do not replace pnpm with npm simply to bypass a missing package-manager installation.

### 11.3 Lockfile or Dependency Resolution Failure

**Symptoms**

- Frozen installation reports a lockfile mismatch.
- A package cannot be resolved.
- Dependency installation produces unexpected changes.

**Actions**

1. Confirm the pnpm version.
2. Confirm the workspace root.
3. Check registry configuration and network access.
4. Inspect the lockfile diff.
5. Confirm whether the branch intentionally changed dependency metadata.
6. Resolve the underlying dependency issue before updating the lockfile.

Do not remove the lockfile as a first troubleshooting step.

### 11.4 Native Compilation Failure on Linux

**Symptoms**

- Tauri compilation reports missing native libraries.
- A compiler cannot find GTK or WebView headers.
- Linking fails for a platform dependency.

**Actions**

1. Confirm the Linux distribution and release.
2. Confirm the Tauri version.
3. Review the official prerequisites for that exact version.
4. Install the required development packages.
5. Confirm that the compiler and linker are available.
6. Retry the native build.

Do not copy package names from another distribution without checking compatibility.

### 11.5 Native Compilation Failure on Windows

**Symptoms**

- C++ compiler or SDK errors.
- Native dependencies fail to compile.
- The build tool cannot find required Windows components.

**Actions**

1. Confirm the installed Microsoft C++ build tools.
2. Confirm the required Windows SDK.
3. Confirm WebView2 prerequisites.
4. Open a terminal configured for the appropriate toolchain.
5. Re-run the native build and inspect the first meaningful error.

Avoid changing Rust or frontend source code until the native toolchain has been verified.

### 11.6 Native Compilation Failure on macOS

**Symptoms**

- Compiler tools are unavailable.
- The build reports missing SDK components.
- Native linking fails.

**Actions**

1. Run `xcode-select -p`.
2. Run `clang --version`.
3. Confirm that the required command-line tools or Xcode components are installed.
4. Check the applicable Tauri prerequisites.
5. Retry the native build.

### 11.7 Rust Toolchain Mismatch

**Symptoms**

- Cargo reports unsupported language or dependency features.
- The project compiles differently across workstations.
- Native dependencies fail under the active compiler.

**Actions**

1. Run `rustc --version`.
2. Run `cargo --version`.
3. Inspect `rust-toolchain.toml` or the applicable repository configuration.
4. Activate the required toolchain.
5. Retry `cargo check`.

Do not update the project's pinned Rust version solely to make one workstation compile.

### 11.8 Environment Variable Not Loaded

**Symptoms**

- API requests target the wrong endpoint.
- The application reports missing configuration.
- A feature appears disabled unexpectedly.

**Actions**

1. Identify the frontend package and framework.
2. Inspect the package's environment-file conventions.
3. Verify the exact variable name.
4. Confirm the environment file is in the expected directory.
5. Restart the development process after changing configuration.
6. Check whether the variable is intended for development or build time.

Do not expose secrets through frontend variables to work around missing backend configuration.

### 11.9 API Connection Failure

**Symptoms**

- The frontend cannot load data.
- Browser developer tools show connection failures.
- Requests fail due to origin or network policy.

**Actions**

1. Confirm the configured API endpoint.
2. Verify that the required backend service is running.
3. Check the backend's local development instructions.
4. Inspect the browser network panel.
5. Check the documented CORS and local networking configuration.
6. Confirm that the request matches `docs/protocol/API_CONTRACT.md`.

Do not weaken production security controls to solve a local development issue.

### 11.10 Realtime Connection Failure

**Symptoms**

- Live updates do not appear.
- A WebSocket or other realtime connection repeatedly fails.
- The application displays stale status.

**Actions**

1. Confirm that realtime functionality is configured for the current workflow.
2. Verify the configured endpoint.
3. Confirm that the backend realtime service is running.
4. Inspect connection and handshake errors.
5. Check the event integration against `docs/protocol/EVENT_CONTRACT.md`.
6. Verify that the environment is authorized to provide the required updates.

### 11.11 Port Already in Use

**Symptoms**

- The development server cannot bind to its configured port.
- The application reports an address-in-use error.

**Actions**

1. Identify the process using the port.
2. Determine whether it belongs to another development server.
3. Stop the process only when it is safe to do so.
4. Restart the intended application.
5. Use a different supported development port only if the project's configuration allows it.

Do not terminate an unknown process merely to free a port.

### 11.12 Tauri Starts but the Web Console Works

**Symptoms**

- The browser frontend works, but the desktop application fails.
- The desktop window is blank.
- Native plugins fail even though the browser build succeeds.

**Actions**

1. Confirm the Tauri-specific development command.
2. Verify the frontend development URL and output configuration.
3. Check the operating-system prerequisites.
4. Inspect Rust and native build errors.
5. Review Tauri permissions and plugin configuration.
6. Validate the desktop build separately from the browser build.

### 11.13 Stale Build Output

**Symptoms**

- The application appears to use old code.
- Generated assets do not reflect the latest source.
- Build behavior differs from the current working tree.

**Actions**

1. Stop the relevant development process.
2. Check whether the workspace defines a supported clean command.
3. Inspect generated files and their ownership.
4. Use the project's documented cleanup procedure.
5. Rebuild and restart the application.

Do not delete broad directory trees or generated files without confirming that the project expects them to be regenerated.

### 11.14 Tests Pass Locally but Fail in CI

**Symptoms**

- CI reports type, lint, test, or build failures that are not reproduced locally.
- Native builds fail only on one operating system.

**Actions**

1. Confirm the local Node.js and pnpm versions.
2. Confirm the Rust toolchain when relevant.
3. Use the lockfile-enforcing dependency installation.
4. Run the exact validation script used by CI.
5. Check operating-system-specific dependencies.
6. Inspect environment variables and configuration differences.
7. Reproduce the failure before modifying shared configuration.

## 12. Frontend Development Security

### 12.1 Credential Handling

Local development credentials MUST be handled according to the project's approved security requirements.

Never commit passwords, tokens, private keys, or other credentials to frontend source control.

If a credential is accidentally committed, follow the project's security incident and rotation procedure. Removing it from the latest commit alone may not remove it from repository history or other copies.

### 12.2 Browser-Visible Configuration

Anything embedded in the browser bundle or exposed through browser-accessible configuration MUST be treated as public.

Frontend environment configuration MUST NOT be used as a storage mechanism for privileged backend or cloud credentials.

### 12.3 Native Permissions

Tauri permissions and native plugin capabilities MUST remain limited to the functionality required by the application.

Permission changes MUST be reviewed for their security impact.

A permission MUST NOT be broadened merely to suppress a runtime error without identifying the required capability.

### 12.4 Dependency Safety

Use the project's approved registries and dependency versions.

Review material dependency changes and investigate security findings using the project's established process.

Do not disable dependency or build security checks solely to complete a local setup.

### 12.5 Local Service Exposure

Development servers SHOULD bind to local interfaces unless remote access is intentionally required.

If a development server must be exposed to another device, ensure that the network exposure and access controls are understood.

Never expose a privileged local runtime or development endpoint to an untrusted network without an approved design.

## 13. Frontend Environment Reset

A local reset MAY be necessary after changing Node.js versions, switching branches with incompatible dependencies, or changing native toolchains.

Before resetting the environment:

1. Inspect the working tree.
2. Preserve uncommitted source changes.
3. Identify the affected frontend package.
4. Identify the repository-supported cleanup procedure.
5. Confirm which generated artifacts are safe to recreate.
6. Reinstall dependencies from the declared workspace root.
7. Reapply local environment configuration from the documented template.
8. Repeat the required validation commands.

A reset MUST NOT remove source files, committed configuration, migration artifacts, or unrelated developer data.

If a reset requires deleting local databases or backend state, follow the relevant backend or database setup instructions instead of treating it as a frontend-only operation.

## 14. Recommended Setup Sequence

Use the following sequence for a new frontend workstation.

1. Complete `docs/development/DEVELOPMENT_SETUP.md`.
2. Confirm repository access and working-tree status.
3. Identify the frontend workspace root and package scripts.
4. Install the Node.js version required by the repository.
5. Activate the required pnpm version.
6. Install frontend dependencies.
7. Configure the required local frontend environment variables.
8. For browser-only development, run the Web Console or Studio browser workflow.
9. For Tauri development, install the native prerequisites for the current operating system.
10. For Local Runtime development, activate the declared Rust toolchain.
11. Start the required frontend application.
12. Verify API connectivity and any required realtime integration.
13. Run lint, type checking, tests, and build commands applicable to the changed package.
14. Inspect the working tree before committing changes.

The setup sequence is a local development workflow, not a replacement for milestone acceptance criteria or the project's contribution review process.

## 15. Relationship to Phases and Milestones

### 15.1 Phase Authority

`docs/planning/PHASES.md` is the canonical source for phase definitions.

This setup guide MUST NOT redefine phase meaning or use phase references to expand milestone scope.

Setup requirements MAY support work in multiple phases. Their applicability does not alter the authoritative milestone scope.

### 15.2 Canonical Phases

| Phase | Canonical name |
|---|---|
| P0 | FOUNDATION |
| P1 | STUDIO |
| P2 | BUILD & ARTIFACT |
| P3 | CONTROL PLANE |
| P4 | BOOKING & COMMERCIAL |
| P5 | EXECUTION |
| P6 | LAB & ROBOT |
| P7 | LIVE & RESULTS |
| P8 | PRODUCTION |

These names MUST be used exactly whenever phases are referenced in this document.

### 15.3 Frontend Milestones

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 |
| F-M02 | PROJECTS | P1 |
| F-M03 | BUILD & ARTIFACT | P2 |
| F-M04 | BOOKING | P4 |
| F-M05 | EXECUTION | P5 |
| F-M06 | LIVE | P7 |
| F-M07 | RESULTS | P7 |

Frontend milestone scope and acceptance MUST be taken from the authoritative dossiers under `docs/frontend/milestones/`.

This document defines setup procedures only. It MUST NOT introduce or modify milestone acceptance criteria.

### 15.4 Cross-Domain Dependencies

Frontend setup may depend on backend APIs, cloud environments, or database-backed workflows.

When another domain is required, follow its authoritative setup and architecture documentation.

This document MUST NOT duplicate backend, database, or cloud setup procedures.

### 15.5 Traceability

A frontend milestone dossier MAY reference this guide when setup is required to complete the milestone.

Changes to setup requirements MUST be reviewed against affected frontend packages and operating systems.

The presence of a setup instruction in a milestone dossier does not make that dossier a competing authority for general setup behavior.

## 16. Maintenance and Change Control

### 16.1 Toolchain Changes

Changes to Node.js, pnpm, Rust, Tauri, or native dependencies MUST be evaluated for compatibility with the repository.

Material toolchain changes SHOULD be reviewed alongside package metadata, lockfiles, CI configuration, and the applicable frontend architecture documents.

### 16.2 Documentation Updates

This document MUST be updated when any of the following changes materially:

- Required Node.js or pnpm versions.
- Frontend workspace layout.
- Tauri version or operating-system prerequisites.
- Rust toolchain requirements.
- Environment-file conventions.
- Studio or Web Console startup commands.
- Frontend validation scripts.
- Frontend-specific troubleshooting procedures.

### 16.3 Avoiding Duplicate Instructions

When a setup requirement becomes shared across multiple domains, move its authoritative instructions to `docs/development/DEVELOPMENT_SETUP.md` and retain a concise reference here.

When a requirement remains specific to frontend development, keep it in this document.

The same instruction MUST NOT be maintained independently in both documents with potentially conflicting commands.

### 16.4 Verification After Changes

After changing setup instructions, verify that:

- Referenced files exist in the repository.
- Package selectors and scripts match the current package metadata.
- Commands are appropriate for the stated operating system.
- Environment variable names are defined by the project.
- Native prerequisites match the selected Tauri version.
- The documented validation workflow can be followed.
- Cross-domain setup links point to the authoritative owners.

Do not claim that a command or workflow was tested unless it has actually been executed and verified.

## 17. Frontend Setup Checklist

### 17.1 Prerequisites

- [ ] Global setup is complete.
- [ ] Repository access is working.
- [ ] The frontend workspace root is identified.
- [ ] The required Node.js version is installed.
- [ ] The required pnpm version is available.
- [ ] Dependencies install from the committed lockfile.

### 17.2 Environment

- [ ] The correct frontend environment template has been identified.
- [ ] Required configuration variables are documented.
- [ ] Local environment files are not committed.
- [ ] API endpoints target the intended environment.
- [ ] Realtime endpoints are configured when required.
- [ ] No private credentials are exposed to browser code.

### 17.3 Studio and Web Console

- [ ] The correct package and development script are identified.
- [ ] The Web Console starts successfully when required.
- [ ] Studio starts successfully in the selected browser or desktop workflow.
- [ ] Tauri prerequisites are installed for the current operating system when required.
- [ ] The Local Runtime Rust toolchain is correct when required.
- [ ] API and realtime connectivity are checked where applicable.

### 17.4 Validation

- [ ] Linting passes for the affected package.
- [ ] Type checking passes where provided.
- [ ] Relevant tests pass.
- [ ] The production build succeeds.
- [ ] Native build validation succeeds when Tauri code or configuration is affected.
- [ ] The working tree contains only intended changes.
- [ ] No secrets, generated artifacts, or unrelated dependency changes are included.

## 18. Definition of Done

Frontend development setup is ready for ongoing use when:

1. Global setup responsibilities are clearly separated from frontend-specific instructions.
2. Node.js and pnpm requirements follow the current repository configuration.
3. Tauri prerequisites are documented by operating system.
4. Rust toolchain requirements for the Local Runtime are explicit.
5. Studio and Web Console startup instructions use actual repository package scripts.
6. Frontend environment configuration follows the current project conventions.
7. Troubleshooting covers the common frontend-specific toolchain and runtime failures.
8. Security guidance prevents accidental exposure of secrets or unnecessary native permissions.
9. Validation commands are traceable to the actual frontend workspace.
10. Phase and milestone references use the frozen canonical model.
11. Other domains' setup instructions remain in their authoritative documents.
12. The guide does not duplicate global onboarding or define product architecture.

This document owns frontend-specific setup only. Global setup and onboarding remain owned by `docs/development/DEVELOPMENT_SETUP.md`; architecture, protocol, security, and milestone scope remain owned by their respective authoritative documents. All changes MUST preserve this ownership boundary.
