# Backend Development Setup

**Project:** Kritva RaaS  
**Document:** `docs/backend/development/DEVELOPMENT_SETUP.md`  
**Scope:** Backend-specific development environment, language toolchain, local infrastructure dependencies, environment configuration, seed data, test execution, and backend troubleshooting  
**Audience:** Backend developers, service engineers, integration engineers, and maintainers  
**Status:** Backend development setup guide

## 1. Purpose

This document explains how to prepare a local environment for developing and validating the Kritva RaaS backend.

It covers only backend-specific setup:

- Backend language runtime and package toolchain.
- Backend dependency installation and build preparation.
- Docker and Docker Compose services required by the backend.
- PostgreSQL development configuration.
- Local object storage emulation.
- Queue or message broker services.
- Backend environment variables and local configuration.
- Database migrations and seed data.
- Starting and stopping backend services.
- Running backend-specific tests.
- Troubleshooting backend development dependencies.

The exact commands and versions MUST follow the backend repository, its package manifests, container definitions, and authoritative architecture documentation. Examples in this document are templates where the repository-specific configuration has not been established.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns backend-specific environment preparation and local execution instructions:

- Backend language runtime and toolchain setup.
- Backend package-manager usage.
- Backend dependency installation.
- Backend-specific environment configuration.
- Local Docker and Compose service preparation.
- PostgreSQL development connectivity.
- Object storage emulator configuration.
- Queue or message broker configuration.
- Local migration and seed-data procedures.
- Starting, stopping, and inspecting backend processes.
- Running backend-specific test commands.
- Diagnosing backend-specific dependency and configuration failures.

### 2.2 Global Setup Ownership

`docs/development/DEVELOPMENT_SETUP.md` is the authoritative document for global development setup, tooling, and onboarding.

It owns:

- General contributor onboarding.
- Repository access and cloning.
- Global prerequisites shared across domains.
- Common development tooling.
- Repository-wide environment preparation.
- Shared credential and access procedures.
- Global development conventions.
- General workstation setup.

This file MUST link to the global setup document instead of duplicating its instructions.

### 2.3 Other Document Ownership

| Concern | Authoritative document |
|---|---|
| Global development setup and onboarding | `docs/development/DEVELOPMENT_SETUP.md` |
| Global development workflow | Applicable documents under `docs/development/` |
| Global testing strategy | `docs/development/TESTING_STRATEGY.md` |
| Global release process | `docs/development/RELEASE_PROCESS.md` |
| Backend-specific setup | `docs/backend/development/DEVELOPMENT_SETUP.md` |
| Backend-specific development workflow | Applicable documents under `docs/backend/development/` |
| Backend testing implementation | Applicable backend testing documentation under `docs/backend/` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| Backend architecture decisions | `docs/backend/planning/DECISIONS.md` |
| System backend responsibilities | `docs/architecture/BACKEND_ARCHITECTURE.md` |
| Product and system decisions | `planning/DECISIONS.md` |
| Canonical phase definitions | `planning/PHASES.md` |
| API wire contract | `docs/protocol/API_CONTRACT.md` |
| Event wire contract | `docs/protocol/EVENT_CONTRACT.md` |
| Artifact contract and manifest | `docs/protocol/ARTIFACT_MANIFEST.md` |
| PostgreSQL implementation architecture | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Cloud deployment implementation | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Cloud security architecture | `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` |
| Application security and trust boundaries | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Backend milestone scope and acceptance | Authoritative dossiers under `docs/backend/milestones/` |
| Cross-domain milestone scope | Applicable authoritative dossiers under `docs/**/milestones/` |

### 2.4 Explicit Non-Goals

This document MUST NOT become the authoritative home for:

- Global onboarding or repository setup.
- Product or system architecture.
- Backend module design and layering.
- API and event wire-contract definitions.
- Database schema and migration design.
- Production infrastructure provisioning.
- Global test policy or release gates.
- Production secrets management policy.
- Milestone scope and acceptance criteria.
- Task tracking or implementation planning.

When a topic belongs elsewhere, this document MUST link to its authoritative owner.

## 3. Setup Principles

### 3.1 Follow Repository Configuration

Use the versions and commands defined by the current backend repository.

Before installing or upgrading a dependency, inspect the repository's manifests and configuration files, such as:

- Language version files.
- Package manifests and lockfiles.
- Container definitions.
- Compose files.
- Environment templates.
- Migration configuration.
- Test configuration.
- Build scripts.

Do not assume a language, framework, package manager, or service version that is not supported by the repository.

### 3.2 Isolate Local Dependencies

Local infrastructure services SHOULD run in an isolated development environment.

Use dedicated development databases, storage buckets, queues, and credentials.

Do not point local development commands at production resources.

### 3.3 Keep Configuration Explicit

Every required backend setting SHOULD have a documented source and a clear purpose.

Use the repository's supported configuration mechanism rather than introducing multiple competing ways to configure the same setting.

### 3.4 Protect Secrets

Local environment files containing credentials MUST NOT be committed.

Use synthetic development credentials and the approved secret-management process for shared or hosted environments.

### 3.5 Reproducible Setup

A new contributor SHOULD be able to prepare the backend environment by following the documented steps without relying on undocumented workstation state.

If a setup step requires a manual operation, record the reason and expected result.

## 4. Prerequisites

### 4.1 Global Prerequisites

Complete the common workstation and repository setup described in:

- `docs/development/DEVELOPMENT_SETUP.md`

That document is authoritative for repository access, general tooling, and contributor onboarding.

### 4.2 Backend Repository

Ensure the backend source is available and that the working tree corresponds to the intended branch or revision.

Follow the global branching and source-control policy under `docs/development/`.

The backend setup guide does not define branch naming, commit rules, or merge procedures.

### 4.3 Language Runtime

Install the backend language runtime at the version specified by the repository.

The exact runtime MUST be confirmed from the repository's version declaration and build configuration.

Examples of possible version sources include:

- A language-specific version file.
- A package manifest.
- A compiler or SDK configuration.
- A container image declaration.
- A CI build definition.

Do not independently upgrade the runtime to the newest available version without checking compatibility.

### 4.4 Package Manager

Use the package manager and lockfile selected by the repository.

Examples may include a language-specific dependency manager, a workspace package manager, or a compiler-integrated build tool.

Install dependencies using the documented repository command.

Avoid manually changing locked dependency versions merely to resolve a local setup issue.

### 4.5 Docker Engine

Install and start a supported Docker Engine or equivalent container runtime if the backend uses containers for local dependencies.

Verify that the current user can run containers without unnecessarily granting administrative privileges.

Use the globally documented tooling setup for installation instructions.

### 4.6 Docker Compose

Confirm that a compatible Docker Compose implementation is available.

A repository may use the Compose plugin command:

    docker compose version

If the repository explicitly uses a different supported Compose invocation, follow that configuration.

### 4.7 Available Resources

Ensure sufficient local resources for the backend process and its dependencies.

The required CPU, memory, disk space, and ports depend on the actual service configuration.

If resource limits are configured in Compose, inspect them before increasing limits or disabling restrictions.

## 5. Inspect the Backend Configuration

### 5.1 Locate the Service Entry Point

Identify the documented backend application entry point and its package or workspace.

Do not assume the repository root is the backend package root.

### 5.2 Locate Dependency Definitions

Inspect the relevant package manifest and lockfile.

Confirm:

- Language and framework versions.
- Runtime dependencies.
- Development dependencies.
- Build and test commands.
- Database driver.
- Storage SDK.
- Queue client.
- Configuration library.

### 5.3 Locate Container Definitions

Find the Compose file or files used for local development.

Identify:

- Service names.
- Container images.
- Published ports.
- Internal service ports.
- Persistent volumes.
- Health checks.
- Environment variables.
- Dependency relationships.
- Initialization scripts.

Use the actual repository definitions as the source of truth.

### 5.4 Locate Environment Templates

Find the backend environment template or configuration reference.

A repository may use `.env.example`, a typed configuration file, or another documented mechanism.

The template MUST contain placeholder values rather than real credentials.

### 5.5 Locate Database Initialization

Identify the migration tool, schema initialization process, and seed-data mechanism.

Do not initialize the database by manually applying schema changes that bypass the project's migration system.

### 5.6 Locate Test Commands

Inspect the backend package scripts, test configuration, and CI definitions.

Use the repository's documented test entry points rather than inventing command aliases.

## 6. Language Toolchain and Dependencies

### 6.1 Verify the Runtime

Run the version command appropriate to the selected language and compare the result with the repository's requirement.

For example, a Node.js backend may use:

    node --version
    npm --version

These commands are illustrative. They MUST NOT be interpreted as a declaration that the backend uses Node.js.

### 6.2 Install Dependencies

Use the package manager selected by the repository.

A dependency installation SHOULD:

- Respect the lockfile.
- Use the expected workspace root.
- Avoid unintended dependency upgrades.
- Fail clearly if required native build tools are missing.
- Preserve the repository's dependency declarations.

For an npm-managed project, an example lockfile-enforcing command is:

    npm ci

Use the equivalent supported command for the actual backend toolchain.

### 6.3 Build Preparation

Run the backend's documented compile, type-check, or build command before attempting to diagnose application startup failures.

This separates toolchain problems from configuration and service problems.

### 6.4 Native Dependencies

Some packages require native libraries or compiler toolchains.

Install only the system dependencies required by the repository and supported platform.

If a native dependency fails to build, capture the relevant error and verify the compiler, SDK, and library versions before changing application code.

### 6.5 Dependency Cache Problems

When dependency installation fails:

1. Confirm the runtime and package-manager versions.
2. Verify access to the configured package registry.
3. Inspect the lockfile and manifest.
4. Review the first meaningful installation error.
5. Clear only the relevant cache if corruption is suspected.
6. Reinstall using the repository's documented command.

Do not delete lockfiles or broadly upgrade dependencies as the first troubleshooting step.

## 7. Local Docker Compose Services

### 7.1 Purpose

Compose provides a repeatable way to start the backend's local infrastructure dependencies.

The actual service set MUST be taken from the repository's Compose configuration.

PostgreSQL, object storage emulation, and a queue or message broker are covered below because they are common backend dependencies. A service SHOULD be started only if the backend configuration requires it.

### 7.2 Inspect the Compose Model

Before starting services, inspect the resolved Compose configuration.

A common validation command is:

    docker compose config

Review the output for:

- Correct service definitions.
- Expected image versions.
- Correct port mappings.
- Valid environment variable references.
- Named volumes.
- Health checks.
- Dependency ordering.
- Unexpected external endpoints.

Resolved configuration may contain sensitive values. Do not publish it without reviewing and redacting secrets.

### 7.3 Start Required Services

Start only the dependencies needed for local backend development.

An example command is:

    docker compose up -d

Use the repository's documented Compose file and service selection.

Do not start optional services automatically when they are not required for the current task.

### 7.4 Check Service Status

Inspect service status and logs:

    docker compose ps
    docker compose logs --tail=100

Replace the example commands with the repository's supported invocation when necessary.

A running container is not necessarily a ready service. Check the configured health status and application connectivity.

### 7.5 Service Readiness

The backend SHOULD wait for required services to become ready before initializing connections or applying migrations.

Compose startup order alone MUST NOT be treated as proof that PostgreSQL, storage, or a queue is ready to accept requests.

Use health checks, connection retries, or another supported readiness mechanism.

## 8. PostgreSQL Development Setup

### 8.1 Service Configuration

Use the PostgreSQL image and version declared by the backend or database configuration.

Avoid silently changing the database major version during routine local setup.

### 8.2 Connection Settings

The backend's connection settings typically identify:

- Host.
- Port.
- Database name.
- Username.
- Password or credential source.
- TLS mode where applicable.
- Connection timeout.
- Pool size.

The actual variable names and configuration structure MUST follow the repository.

### 8.3 Host Versus Container Connectivity

The hostname depends on where the backend process runs.

When the backend runs on the host, it generally uses the published host port.

When the backend runs in the same Compose network, it generally uses the Compose service name and internal service port.

Do not use `localhost` inside a backend container to refer to a different container unless the network configuration explicitly supports that behavior.

### 8.4 Verify Database Readiness

Check that the database accepts connections using the available PostgreSQL client or the repository's health check.

For example, where `pg_isready` is installed:

    pg_isready -h localhost -p 5432

Adjust the host and port to the actual configuration.

A readiness check does not prove that the application credentials or schema are correct.

### 8.5 Create or Initialize the Development Database

Use the repository's documented initialization process.

The process SHOULD establish the required development database and application credentials without using a production identity.

If the Compose configuration initializes the database automatically, verify that initialization completed successfully.

### 8.6 Apply Migrations

Run migrations using the backend's documented migration command.

Migrations MUST be applied through the approved migration tool and in the expected order.

Do not edit migration history or manually mark a migration as complete to bypass an error.

### 8.7 Verify Schema State

Confirm that the migration tool reports the expected schema version.

If the backend exposes a database health check, use it to confirm that the application can connect and perform its required readiness operations.

Database schema design, transaction policy, indexing, and migration architecture remain owned by `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

### 8.8 Reset Local Database State

A local database reset MAY remove development data.

Before resetting, confirm that the target is a disposable development database and not a shared or production resource.

Use the documented reset or recreation procedure.

Do not use destructive volume-removal commands without understanding which services and data they affect.

## 9. Object Storage Emulator

### 9.1 Purpose

If the backend depends on object storage, local development may use an emulator or a dedicated development-compatible storage service.

The selected implementation MUST follow the repository's architecture and Compose configuration.

### 9.2 Endpoint Configuration

Identify the correct storage endpoint for the backend process.

As with PostgreSQL, host-based and container-based execution may require different endpoint addresses.

The backend MUST NOT use production storage endpoints during local development unless explicitly authorized by the relevant environment policy.

### 9.3 Credentials

Use development-only credentials supported by the emulator.

Do not copy production access keys into local environment files.

### 9.4 Bucket or Container Initialization

Create required buckets or containers using the repository's initialization scripts or documented service procedure.

The initialization process SHOULD be repeatable.

Use test-only names and synthetic objects.

### 9.5 Connectivity Validation

Verify that the backend can:

- Reach the configured endpoint.
- Authenticate using the development credentials.
- Access the required bucket or container.
- Upload and retrieve a test object where relevant.
- Handle a missing object or storage error appropriately.

Remove temporary test objects where cleanup is required.

### 9.6 Storage Failures

If storage initialization fails, check:

- Emulator health.
- Endpoint hostname and port.
- Credential configuration.
- Bucket initialization.
- Network reachability.
- Backend storage adapter configuration.

Do not resolve an authentication failure by switching the backend to production credentials.

## 10. Queue or Message Broker Setup

### 10.1 Identify the Required Service

Inspect the backend configuration to determine whether asynchronous work uses a queue or message broker.

The actual technology, version, topology, and service names MUST come from the repository.

Do not introduce a new queue implementation solely because an example uses one.

### 10.2 Local Service Configuration

Identify:

- Broker endpoint.
- Connection credentials.
- Required virtual host, namespace, or equivalent.
- Queue or topic names.
- Consumer configuration.
- Retry and acknowledgement behavior.
- Health-check mechanism.

The exact settings MUST match the backend implementation.

### 10.3 Initialization

Use the repository's initialization scripts or service configuration to create required queues, topics, or other resources.

Initialization SHOULD be repeatable and safe for an empty development environment.

### 10.4 Connectivity Validation

Verify that the backend can connect to the broker using the configured development credentials.

Where appropriate, confirm that a test message can be published and consumed through the intended backend adapter.

A successful connection alone does not prove that the consumer processes messages correctly.

### 10.5 Failure Behavior

Confirm that the backend handles expected broker unavailability according to its implementation contract.

Local setup MUST NOT silently disable required asynchronous behavior just to make startup succeed.

## 11. Backend Environment Configuration

### 11.1 Environment Template

Create a local environment configuration using the repository's documented template.

A typical workflow may involve copying an example file, but the actual filename and command MUST follow the repository.

Do not overwrite an existing local configuration without reviewing its contents.

### 11.2 Configuration Categories

Backend configuration may include:

| Category | Typical settings |
|---|---|
| Application | Environment name, service port, log level |
| Database | Connection endpoint, database name, credentials |
| Object storage | Endpoint, bucket, region or namespace, development credentials |
| Queue | Broker endpoint, queue or topic names, credentials |
| API | Public or internal base URL where required |
| Events | Event endpoint or broker configuration |
| Security | Development-only keys and test identity settings |
| Observability | Local log output and tracing configuration |
| External integrations | Explicitly configured test endpoints |

These categories are illustrative. The actual variables and defaults MUST follow the backend configuration implementation.

### 11.3 Required Versus Optional Settings

Identify which variables are mandatory for application startup and which enable optional capabilities.

Missing required settings SHOULD produce a clear startup error.

Optional settings SHOULD have documented defaults where a default is safe.

Do not add fallback defaults that silently route development requests to production services.

### 11.4 Environment Separation

Keep local, test, staging, and production configuration separate.

A local `.env` file MUST NOT be reused as a production deployment configuration without the approved deployment process.

Environment-specific secrets MUST be managed according to the applicable security policy.

### 11.5 Validate Configuration

After configuring the environment:

1. Run the backend's configuration validation command if available.
2. Confirm required variables are present.
3. Confirm endpoints point to local or approved test services.
4. Confirm ports match the Compose configuration.
5. Confirm that secret values are not logged.
6. Start the backend and inspect initialization messages.

### 11.6 Configuration Changes

When adding a new backend configuration variable, update the authoritative environment template and relevant implementation documentation.

Document whether the variable is required, its expected format, and its intended environment.

Do not put private values into the example template.

## 12. Seed Data and Development Fixtures

### 12.1 Purpose

Seed data creates a known initial state for local backend development and testing.

It SHOULD be deterministic and safe to apply to a disposable development database.

### 12.2 Seed Data Ownership

The backend's seed mechanism MUST follow the data ownership and schema defined by the authoritative database and backend architecture.

This setup guide explains how to run seed data. It does not define product entities, database schemas, or business rules.

### 12.3 Seed Categories

Where supported, separate:

- Minimal reference data required for startup.
- Synthetic development records.
- Test fixtures used by automated tests.
- Optional demonstration data.

Avoid making large demonstration datasets mandatory for every developer.

### 12.4 Deterministic Seeds

Seed operations SHOULD produce predictable results.

Repeated execution SHOULD either be safe or fail clearly when the operation is not repeatable.

Avoid uncontrolled random identifiers or timestamps when they make tests difficult to reproduce.

### 12.5 Synthetic Data

Use synthetic data rather than copied production records.

Seed data MUST NOT contain real credentials, access tokens, private keys, or unnecessary personal information.

### 12.6 Running Seeds

Use the repository's documented seed command.

A generic example might be:

    <backend-package-manager> run seed

This is a placeholder, not an executable command. Replace it with the actual command declared by the backend repository.

### 12.7 Verify Seed Results

After seeding:

- Confirm that the operation completed successfully.
- Verify the expected records through the approved application or database inspection method.
- Confirm that repeated execution behaves as documented.
- Check application startup and tests that depend on the seed data.

### 12.8 Reset and Reseed

Use the documented local reset procedure before reseeding when required.

Do not assume that reseeding automatically deletes old records.

Confirm that all destructive operations target only disposable development resources.

## 13. Starting the Backend

### 13.1 Startup Order

Use the order required by the backend architecture.

A typical local workflow is:

1. Start required Compose services.
2. Wait for service readiness.
3. Validate environment configuration.
4. Apply database migrations.
5. Load optional seed data.
6. Start the backend application.
7. Verify the application's health endpoint or readiness mechanism.

This is a general sequence. Follow repository-specific startup instructions where they differ.

### 13.2 Start Command

Use the backend's documented development command.

Do not assume a particular framework or package-manager script.

The development command SHOULD enable the intended local behavior without changing production configuration.

### 13.3 Startup Verification

After starting the backend, confirm:

- The process remains running.
- Configuration validation succeeds.
- Database connectivity is established.
- Required storage connectivity is established where applicable.
- Required queue connectivity is established where applicable.
- The configured service port is available.
- The health or readiness check succeeds.
- Logs do not show repeated connection or initialization failures.

### 13.4 Running the Backend in a Container

If the backend itself runs in Compose, follow the repository's service configuration and documented command.

Verify that environment variables, network aliases, mounted files, and dependency readiness work inside the container.

Do not assume host-based connectivity settings are correct inside a container.

### 13.5 Stop and Restart

Use the repository's documented process or Compose commands to stop and restart the backend.

Stopping the application SHOULD NOT automatically destroy local database or storage state unless the documented workflow explicitly does so.

Before recreating services, understand the impact on named volumes and persistent data.

## 14. Running Backend Tests

### 14.1 Testing Policy Ownership

The global testing strategy is owned by `docs/development/TESTING_STRATEGY.md`.

This section explains how to run backend-specific tests locally. It does not redefine global test levels, quality gates, release criteria, or cross-domain acceptance.

### 14.2 Discover the Test Commands

Inspect the backend package manifest, test configuration, and repository documentation.

Use the supported commands for:

- Unit tests.
- Service or module tests.
- Database integration tests.
- Storage adapter tests.
- Queue or broker integration tests.
- API tests.
- Backend linting and type checks where applicable.

Do not invent script names when the repository already defines the commands.

### 14.3 Unit Tests

Unit tests SHOULD be runnable without unnecessary external services where the implementation permits.

They SHOULD use deterministic fixtures and controlled dependencies.

If unit tests require PostgreSQL, object storage, or a broker, determine whether they are actually integration tests or whether the dependency can be isolated.

### 14.4 Database Integration Tests

Database integration tests MUST use a dedicated test database or another explicitly isolated test environment.

The tests SHOULD verify relevant persistence behavior, transaction handling, and data access contracts.

Do not run destructive integration tests against a shared development database without authorization.

### 14.5 Storage Integration Tests

Storage integration tests SHOULD use the configured emulator or a dedicated test service.

Verify upload, retrieval, metadata handling, and expected error behavior as relevant to the backend implementation.

### 14.6 Queue Integration Tests

Queue integration tests SHOULD use an isolated broker namespace, queue, topic, or equivalent test resource.

Verify message publication, consumption, acknowledgement, and error handling when those behaviors are part of the implementation.

Tests MUST clean up test resources when necessary.

### 14.7 API Tests

API tests SHOULD validate the implemented request and response behavior against `docs/protocol/API_CONTRACT.md`.

They SHOULD cover relevant validation failures and error responses.

Backend API implementation details remain owned by `docs/backend/architecture/API_IMPLEMENTATION.md`.

### 14.8 Test Configuration

Tests SHOULD use a dedicated test configuration rather than production configuration.

Test credentials MUST be synthetic or specifically provisioned for the test environment.

The test configuration MUST NOT silently use production endpoints.

### 14.9 Test Failures

When a backend test fails:

1. Identify the failing test and its scope.
2. Confirm the required services are healthy.
3. Verify test environment variables.
4. Inspect the first meaningful application or assertion failure.
5. Check fixture and seed-data assumptions.
6. Determine whether the failure is in implementation, test setup, or dependency infrastructure.
7. Preserve relevant diagnostics and correct the underlying cause.

Do not disable a meaningful test merely to make the local test command pass.

### 14.10 Report Results

Record the actual commands and results when backend validation is handed to another contributor.

Distinguish tests that passed from tests that were skipped, blocked, or not run.

Global reporting and CI evidence requirements remain defined by the global testing strategy.

## 15. Logs, Health Checks, and Diagnostics

### 15.1 Application Logs

Use the backend's configured logging mechanism.

Logs SHOULD identify initialization failures, dependency connection errors, and application startup status.

Do not log credentials, access tokens, or sensitive payloads.

### 15.2 Container Logs

Inspect the relevant Compose service logs rather than dumping every service's output unnecessarily.

Filter or limit output when services produce large volumes of logs.

Review logs for secret exposure before sharing them.

### 15.3 Health Checks

Use the application's documented health or readiness endpoint, if provided.

Distinguish basic process liveness from readiness to serve requests.

A backend may be running but not ready because a required database, queue, or storage dependency is unavailable.

### 15.4 Port Conflicts

When startup fails because a port is occupied:

1. Identify the configured port.
2. Determine which process owns it.
3. Stop or reconfigure the conflicting local service.
4. Update the backend configuration consistently if a different port is required.
5. Repeat connectivity checks.

Do not change only the client endpoint while leaving the server on the original port.

### 15.5 Dependency Connectivity

When a dependency is unreachable, check the endpoint from the backend's execution environment.

A hostname that resolves on the host may not resolve inside a container.

Confirm network membership, service names, ports, credentials, and readiness.

### 15.6 Startup Diagnostics

A useful startup diagnostic should help identify:

- Missing required configuration.
- Invalid configuration format.
- Failed database connectivity.
- Missing schema or migration state.
- Storage initialization failures.
- Broker connection failures.
- Port binding problems.

Diagnostics MUST NOT expose secrets or sensitive infrastructure details.

## 16. Troubleshooting

### 16.1 Runtime Version Mismatch

**Symptoms**

- Dependency installation fails.
- Build commands fail unexpectedly.
- Runtime syntax or API errors appear.

**Actions**

1. Check the installed runtime version.
2. Inspect the repository's declared version.
3. Confirm the package manager is compatible.
4. Use the documented version-selection mechanism.
5. Reinstall dependencies only if necessary.

Do not upgrade project dependencies to compensate for an incorrect local runtime.

### 16.2 Package Installation Failure

**Symptoms**

- Registry requests fail.
- Native modules fail to compile.
- Lockfile resolution fails.

**Actions**

1. Verify registry connectivity.
2. Check runtime and package-manager versions.
3. Inspect the first installation error.
4. Confirm native build prerequisites.
5. Check lockfile consistency.
6. Retry with the documented installation command.

### 16.3 Docker Service Will Not Start

**Symptoms**

- Container exits immediately.
- Compose reports invalid configuration.
- Required ports cannot be bound.

**Actions**

1. Validate the Compose configuration.
2. Inspect the affected service's logs.
3. Check image availability and version.
4. Verify environment variable references.
5. Check port conflicts and volume permissions.
6. Confirm that the container runtime is healthy.

### 16.4 PostgreSQL Connection Failure

**Symptoms**

- Connection refused.
- Hostname resolution failure.
- Authentication rejected.
- Database does not exist.

**Actions**

1. Check PostgreSQL container status and health.
2. Confirm host-versus-container hostname selection.
3. Verify the published and internal ports.
4. Confirm database name and credentials.
5. Verify that initialization completed.
6. Confirm that the backend loaded the intended environment file.

### 16.5 Migration Failure

**Symptoms**

- Schema version mismatch.
- Migration execution stops.
- Application reports missing tables or columns.

**Actions**

1. Inspect the migration error.
2. Confirm the target database.
3. Verify migration ordering and repository version.
4. Check whether a previous migration partially completed.
5. Follow the database migration recovery procedure.
6. Re-run only the approved migration command.

Do not manually modify migration history to conceal a failed migration.

### 16.6 Object Storage Failure

**Symptoms**

- Requests time out.
- Authentication fails.
- Buckets or containers are missing.
- Uploads succeed but retrieval fails.

**Actions**

1. Confirm emulator health.
2. Check the configured endpoint.
3. Verify credentials and resource names.
4. Confirm initialization scripts completed.
5. Test connectivity from the backend environment.
6. Inspect the backend storage adapter configuration.

### 16.7 Queue or Broker Failure

**Symptoms**

- Backend startup waits indefinitely.
- Message publication fails.
- Consumers cannot connect.
- Messages remain unprocessed.

**Actions**

1. Verify the broker is healthy.
2. Confirm endpoint and credentials.
3. Check namespace, queue, or topic configuration.
4. Inspect consumer logs.
5. Verify that the expected resource exists.
6. Confirm that the local environment enables the required worker.

### 16.8 Backend Startup Failure

**Symptoms**

- Process exits immediately.
- Configuration validation fails.
- Readiness checks remain unhealthy.

**Actions**

1. Inspect the earliest startup error.
2. Validate required environment variables.
3. Confirm required dependencies are ready.
4. Check schema and seed-data state.
5. Check port availability.
6. Run the documented build or type-check command.
7. Restart after correcting the root cause.

### 16.9 Tests Pass Locally but Fail in CI

**Symptoms**

- Test ordering changes the outcome.
- Tests depend on local seed data.
- Environment-specific behavior differs.

**Actions**

1. Compare runtime and dependency versions.
2. Check test configuration and environment variables.
3. Verify test database isolation.
4. Check resource and timing assumptions.
5. Remove reliance on unmanaged local state.
6. Follow global CI troubleshooting guidance under `docs/development/`.

### 16.10 Unexpected Production Connectivity

**Symptoms**

- Local logs reference a production endpoint.
- A local request accesses unexpected external resources.
- Tests depend on production data.

**Actions**

1. Stop the affected local process.
2. Identify the source of the endpoint or credential.
3. Replace the configuration with the approved local or test setting.
4. Review logs and any unintended data changes.
5. Notify the appropriate owner if sensitive information or production resources may have been exposed.

Do not continue testing until the environment is understood and safe.

## 17. Cleanup and Environment Reset

### 17.1 Normal Shutdown

Stop the backend and its local dependencies using the documented repository commands.

Normal shutdown SHOULD preserve development data unless the user explicitly requests a reset.

### 17.2 Disposable Test Resources

Test databases, queues, buckets, and temporary files SHOULD be isolated so they can be removed without affecting normal development data.

Use explicit resource names and documented cleanup operations.

### 17.3 Resetting Compose Services

Before recreating containers, inspect which volumes and resources will be affected.

Removing a container does not necessarily remove its named volumes. Conversely, removing volumes may permanently delete local development data.

Do not use broad destructive cleanup commands without understanding their scope.

### 17.4 Resetting the Database

Use the documented database reset procedure.

Verify the target database and environment before executing destructive operations.

After reset, apply migrations and seed data using the approved workflow.

### 17.5 Returning to a Clean State

A clean local setup SHOULD allow the backend to be started from documented repository state without relying on undocumented manual changes.

If the environment cannot be restored reproducibly, document the missing setup step and update the appropriate owner document.

## 18. Relationship to Phases and Milestones

### 18.1 Phase Authority

`planning/PHASES.md` is the canonical source for phase definitions.

This document describes backend setup only and MUST NOT redefine phase scope.

### 18.2 Canonical Phases

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

### 18.3 Backend Milestones

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| B-M01 | CONTROL PLANE | P3 |
| B-M02 | ARTIFACT | P2-P3 |
| B-M03 | PLATFORM | P3 |
| B-M04 | BOOKING | P4 |
| B-M05 | EXECUTION | P5 |
| B-M06 | RESULTS | P6-P7 |
| B-M07 | PRODUCTION | P8 |

The authoritative dossiers under `docs/backend/milestones/` define backend milestone scope and acceptance.

This document MUST NOT add setup requirements to a milestone or replace its acceptance criteria.

### 18.4 Cross-Domain Dependencies

Backend setup may depend on database and cloud implementation choices.

Use the authoritative database and cloud documents for their respective responsibilities.

This guide MUST NOT redefine another domain's setup or acceptance process.

## 19. Maintenance and Change Control

### 19.1 When to Update This Document

Update this guide when backend-specific setup changes materially, including:

- Language runtime or package manager requirements.
- Compose service definitions.
- PostgreSQL initialization.
- Object storage emulator configuration.
- Queue or broker setup.
- Environment variables.
- Migration or seed commands.
- Backend startup or test commands.
- Backend-specific troubleshooting.

### 19.2 Global Setup Changes

Changes to repository access, shared tooling, contributor onboarding, or global workstation setup MUST be made in `docs/development/DEVELOPMENT_SETUP.md`.

This document MUST link to the global instructions instead of duplicating them.

### 19.3 Architecture Changes

Changes to backend module structure, dependency injection, configuration architecture, or service layering SHOULD be reflected in `docs/backend/architecture/BACKEND_ARCHITECTURE.md`.

System-level backend responsibilities belong to `docs/architecture/BACKEND_ARCHITECTURE.md`.

### 19.4 Database Changes

Changes to schema ownership, migration strategy, transaction behavior, indexing, or database operational design belong to `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

This guide SHOULD describe only how a contributor invokes the documented local setup and migration process.

### 19.5 Contract Changes

API contract changes MUST follow `docs/protocol/API_CONTRACT.md`.

Event contract changes MUST follow `docs/protocol/EVENT_CONTRACT.md`.

Artifact contract changes MUST follow `docs/protocol/ARTIFACT_MANIFEST.md`.

Backend implementation behavior MUST remain consistent with those authoritative contracts.

### 19.6 Testing and Release Changes

Global testing requirements MUST follow `docs/development/TESTING_STRATEGY.md`.

Global release requirements MUST follow `docs/development/RELEASE_PROCESS.md`.

This document MUST NOT create separate global testing or release policies.

## 20. Backend Setup Checklist

### 20.1 Toolchain

- [ ] Global workstation setup is complete.
- [ ] The correct backend repository and revision are available.
- [ ] The required language runtime is installed.
- [ ] The package manager matches the repository.
- [ ] Dependencies install successfully.
- [ ] The backend builds or passes its documented type checks.

### 20.2 Local Dependencies

- [ ] Docker or the required container runtime is available.
- [ ] Compose configuration validates.
- [ ] Required PostgreSQL services are healthy.
- [ ] Required object storage services are available.
- [ ] Required queue or broker services are available.
- [ ] Service hostnames and ports match the backend execution environment.

### 20.3 Configuration and Data

- [ ] The local environment uses the documented template.
- [ ] Required variables are configured.
- [ ] No production credentials or endpoints are used unintentionally.
- [ ] Database initialization is complete.
- [ ] Migrations are applied.
- [ ] Required seed data is loaded.
- [ ] Seed data is synthetic and safe for local use.

### 20.4 Execution and Tests

- [ ] The backend starts successfully.
- [ ] Health or readiness checks pass.
- [ ] Required dependencies are reachable.
- [ ] Relevant backend tests run successfully.
- [ ] Test results distinguish passed, failed, skipped, and blocked checks.
- [ ] Failures have been investigated rather than masked.

### 20.5 Cleanup and Documentation

- [ ] Local shutdown procedures are understood.
- [ ] Destructive reset operations are documented.
- [ ] Local resources can be cleaned up safely.
- [ ] Setup deviations are documented.
- [ ] The relevant architecture and global workflow documents are linked.

## 21. Definition of Done

Backend development setup is adequately documented when:

1. The boundary with `docs/development/DEVELOPMENT_SETUP.md` is explicit.
2. Language and package toolchain requirements are traceable to repository configuration.
3. Required Docker and Compose dependencies are documented.
4. PostgreSQL, object storage emulation, and queue configuration are addressed where applicable.
5. Environment variables are configured safely and consistently.
6. Migration and seed-data procedures are reproducible.
7. Backend startup and test execution follow repository-defined commands.
8. Troubleshooting guidance covers common local dependency failures.
9. Destructive cleanup operations are clearly distinguished from normal shutdown.
10. Database, backend architecture, API contract, testing, and release ownership remain with their respective authoritative documents.
11. Backend milestone scope remains owned by the authoritative dossiers under `docs/backend/milestones/`.
12. Phase and milestone references use the frozen canonical model.
13. No global setup, testing, or release policy is duplicated.

This document owns backend-specific development setup only. Global setup and onboarding remain owned by `docs/development/DEVELOPMENT_SETUP.md`; backend architecture, protocol contracts, database implementation, global testing policy, and milestone acceptance remain owned by their respective authoritative documents.
