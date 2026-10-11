# Kritva RaaS Development Setup

## 1. Purpose

This document defines the production-grade developer setup for the Kritva RaaS
repository.

It establishes a common development environment for engineers working on:

- RaaS Studio;
- Studio Local Runtime;
- React/TypeScript frontend;
- Rust/Tauri native layer;
- Control Plane backend;
- shared packages;
- API contracts;
- PostgreSQL;
- object storage;
- queues;
- authentication;
- simulated Lab Agent;
- simulated robot;
- integration tests;
- end-to-end tests.

The objective is that a new developer can move from a clean development
machine to a working local Kritva RaaS environment using a documented,
repeatable process.

The setup must support both:

1. isolated development of an individual component; and
2. complete local execution of the RaaS product flow.

The canonical local development flow is:

    Developer Machine
          |
          v
    Git Repository
          |
          v
    Bootstrap Toolchain
          |
          v
    Dependencies
          |
          v
    Local Infrastructure
          |
          +---- PostgreSQL
          +---- Object Storage
          +---- Queue
          |
          v
    Backend
          |
          v
    Studio
          |
          v
    Simulated Lab
          |
          v
    Simulated Robot

## 2. Scope

This document covers:

- workstation prerequisites;
- operating-system assumptions;
- repository layout;
- monorepo tooling;
- Node.js;
- pnpm;
- Rust;
- Tauri prerequisites;
- Docker;
- PostgreSQL;
- local infrastructure;
- environment configuration;
- environment files;
- secrets handling;
- dependency installation;
- database initialization;
- migrations;
- seed data;
- service startup;
- Studio startup;
- backend startup;
- simulated Lab startup;
- test execution;
- linting;
- formatting;
- type checking;
- build verification;
- troubleshooting;
- developer onboarding;
- local security practices;
- CI parity;
- Phase 0-8 mapping.

It does not define production deployment.

Production cloud setup is covered by the cloud architecture and deployment
documentation.

It does not define product architecture.

Architecture decisions are recorded in:

    planning/DECISIONS.md

## 3. Goals

The development setup shall:

- provide a reproducible environment;
- minimize machine-specific configuration;
- support Linux and Windows development;
- support future macOS development;
- isolate environment-specific configuration;
- prevent accidental production access;
- provide a complete local RaaS workflow;
- support simulator-first development;
- support database migrations;
- support deterministic test execution;
- align local development with CI;
- make failures diagnosable;
- keep developer secrets out of Git;
- provide predictable onboarding;
- support parallel development across repository packages.

## 4. Non-Goals

This document does not attempt to:

- define production cloud topology;
- define commercial pricing;
- define physical robot wiring;
- define hardware safety certification;
- define customer deployment;
- define production Kubernetes/container orchestration;
- define the final production cloud provider;
- require a specific production object-storage provider;
- require a specific production queue provider;
- replace API contracts;
- replace database schema documents.

## 5. Development Principles

The development environment follows these principles:

1. One repository should be sufficient to understand the product.
2. One supported package manager should be used.
3. Tool versions must be reproducible.
4. Local infrastructure must be disposable.
5. Production credentials must never be required for normal development.
6. Local development should default to simulated infrastructure.
7. Database state must be created from migrations.
8. Seed data must be deterministic.
9. Tests must be runnable without physical robots.
10. CI should use the same commands as developers.
11. Environment configuration must be explicit.
12. Secrets must remain outside version control.
13. Service boundaries must remain visible locally.
14. Developer convenience must not weaken security architecture.

# 6. Repository Layout

The canonical repository is:

    kritva-raas/

The expected top-level structure is:

    kritva-raas/
    ├── README.md
    ├── LICENSE
    ├── CONTRIBUTING.md
    ├── CHANGELOG.md
    ├── .gitignore
    ├── .editorconfig
    ├── package.json
    ├── pnpm-workspace.yaml
    ├── turbo.json
    ├── apps/
    │   ├── studio/
    │   └── backend/
    ├── packages/
    │   ├── ui/
    │   ├── contracts/
    │   ├── api-client/
    │   ├── auth/
    │   ├── config/
    │   └── utils/
    ├── database/
    │   ├── migrations/
    │   └── seeds/
    ├── cloud/
    ├── examples/
    ├── tests/
    │   ├── e2e/
    │   └── integration/
    ├── docs/
    └── .github/

## 6.1 Directory Ownership

| Directory | Responsibility |
|---|---|
| `apps/studio` | Desktop Studio |
| `apps/backend` | Control Plane |
| `packages/ui` | Shared UI components |
| `packages/contracts` | API/protocol contracts |
| `packages/api-client` | Typed backend client |
| `packages/auth` | Shared authentication support |
| `packages/config` | Shared configuration utilities |
| `packages/utils` | General shared utilities |
| `database/migrations` | Versioned database migrations |
| `database/seeds` | Deterministic development data |
| `cloud` | Provider-neutral infrastructure definitions |
| `examples` | Reference/demo applications |
| `tests/integration` | Cross-module integration tests |
| `tests/e2e` | End-to-end tests |
| `docs` | Architecture and project documentation |
| `.github` | CI/CD and repository automation |

## 6.2 Ownership Rule

Application code shall not bypass package boundaries merely for convenience.

Shared code belongs in a package only when it has a clear reusable ownership
model.

Application-specific code remains in its application.

# 7. Required Developer Toolchain

The baseline toolchain consists of:

| Tool | Purpose |
|---|---|
| Git | Source control |
| Node.js | JavaScript/TypeScript runtime |
| Corepack | pnpm version management |
| pnpm | Monorepo package manager |
| Rust | Tauri native layer |
| Cargo | Rust package/build manager |
| Docker | Local infrastructure |
| Docker Compose | Multi-service local infrastructure |
| PostgreSQL | Authoritative local business database |
| Tauri CLI | Desktop development |
| GitHub CLI | Optional repository workflow |
| jq | JSON troubleshooting |
| curl | API troubleshooting |

Exact versions shall be pinned in repository configuration rather than
repeated manually throughout documentation.

# 8. Supported Development Hosts

The primary development target is:

- Linux x86_64.

The first production Studio target is:

- Linux x86_64;
- Windows x86_64.

Future target:

- macOS Apple Silicon.

The local architecture should not assume that the developer workstation has
the same architecture as the target robot.

The robot architecture is represented by the artifact/platform compatibility
model.

# 9. Node.js Setup

Node.js is required for:

- React;
- TypeScript;
- frontend tooling;
- package scripts;
- workspace tooling;
- API client generation where applicable.

The repository shall pin the supported Node major/minor version using a
repository mechanism such as `.nvmrc` or the `engines` field.

Example:

    node --version

The version must satisfy the repository-defined requirement.

Developers shall not select arbitrary Node versions for normal development.

# 10. pnpm Setup

pnpm is the canonical JavaScript package manager.

Developers should enable Corepack:

    corepack enable

Then activate the repository-required pnpm version.

Verify:

    pnpm --version

The repository must contain a package-manager declaration such as:

    "packageManager": "pnpm@<pinned-version>"

The lockfile is authoritative for dependency resolution.

The lockfile shall be committed.

Developers shall not use npm or yarn to modify workspace dependencies.

# 11. Rust Setup

Rust is required for:

- Tauri;
- Studio native functionality;
- local filesystem operations;
- secure credential-store integration;
- local process/build orchestration.

Install the standard Rust toolchain using the supported Rust distribution.

Verify:

    rustc --version
    cargo --version

The repository shall define the supported Rust toolchain using
`rust-toolchain.toml` or an equivalent pinned mechanism.

Rust formatting and linting are mandatory:

    cargo fmt --check
    cargo clippy --all-targets --all-features -- -D warnings

# 12. Tauri Prerequisites

Tauri development requires OS-specific native dependencies.

On Linux, the repository shall document the required:

- GTK/WebKit development packages;
- compiler toolchain;
- system libraries;
- desktop integration dependencies.

On Windows, developers shall install the supported:

- Microsoft C++ build tools;
- WebView2 runtime/development dependencies.

On macOS, developers shall install the supported Xcode command-line tools.

The exact package list should be maintained with the Studio build
documentation rather than embedded as undocumented assumptions in source code.

# 13. Docker Setup

Docker is used for disposable local infrastructure.

Typical local services include:

    PostgreSQL
    Object Storage
    Queue
    Optional observability services

Verify:

    docker --version
    docker compose version

Docker Desktop may be used where appropriate.

Linux developers may use native Docker Engine.

# 14. PostgreSQL Setup

PostgreSQL is the authoritative structured data store.

The local environment must use a PostgreSQL version compatible with the
repository database migrations.

Verify:

    psql --version

The recommended development model is containerized PostgreSQL.

Example conceptual topology:

    Developer
        |
        v
    Docker Compose
        |
        +--> PostgreSQL
        |
        +--> Object Storage
        |
        +--> Queue

# 15. Local Infrastructure Philosophy

Local infrastructure is disposable.

The source of truth for database structure is:

    database/migrations/

The source of truth for development data is:

    database/seeds/

A developer should be able to destroy local infrastructure and recreate it
without manually reconstructing database state.

Example:

    docker compose down -v
    docker compose up -d

The use of `-v` is destructive and must only be used when local database state
can be discarded.

# 16. Environment Model

The supported environments are:

    Local
      |
      v
    Development
      |
      v
    Staging
      |
      v
    Production

Local development must never silently connect to Development, Staging or
Production resources.

Each environment has independent:

- database;
- object storage;
- queue;
- secrets;
- API configuration;
- identity configuration;
- signing configuration.

# 17. Environment Files

Recommended local files:

    .env.example
    .env.local

Application-specific configuration may use:

    apps/backend/.env.example
    apps/studio/.env.example

Actual local values must not be committed.

`.env.example` contains names and safe example values only.

`.env.local` contains developer-specific local configuration.

# 18. Environment Variable Rules

Configuration should be divided into:

### Public Configuration

Safe to expose to frontend code.

Examples:

- API base URL;
- environment name;
- feature flags that are not security controls.

### Server Configuration

Available only to backend services.

Examples:

- database URL;
- object-storage credentials;
- queue credentials.

### Restricted Secrets

Never exposed to browser or Studio UI code.

Examples:

- signing credentials;
- administrative keys;
- production credentials.

The frontend must never receive backend secrets.

# 19. Example Local Environment

Conceptual example:

    NODE_ENV=development
    APP_ENV=local

    API_HOST=127.0.0.1
    API_PORT=4000
    API_BASE_URL=http://127.0.0.1:4000

    DATABASE_URL=postgresql://<db-user>:<db-password>@127.0.0.1:5432/kritva_raas

    OBJECT_STORAGE_ENDPOINT=http://127.0.0.1:9000
    OBJECT_STORAGE_BUCKET=kritva-local

    QUEUE_ENDPOINT=local

    AUTH_MODE=development
    LAB_MODE=simulated

    LOG_LEVEL=debug

Actual variable names shall be defined by the implementation configuration
package and must not diverge between applications without reason.

# 20. Environment Loading Order

Configuration precedence should be deterministic.

Recommended order:

    Built-in defaults
        |
        v
    Environment-specific configuration
        |
        v
    .env files
        |
        v
    Process environment
        |
        v
    Explicit runtime overrides

Security-sensitive values must never have unsafe fallback defaults.

# 21. Configuration Validation

Applications shall validate configuration during startup.

Missing required configuration should produce a clear error.

Example:

    Configuration error:
      DATABASE_URL is required for backend startup.

The application must not start with a partially valid production-like
configuration.

# 22. Repository Bootstrap

A new developer should follow:

    1. Install prerequisites
    2. Clone repository
    3. Enable Corepack
    4. Verify Node and pnpm
    5. Verify Rust
    6. Verify Docker
    7. Create local environment
    8. Install dependencies
    9. Start infrastructure
    10. Run migrations
    11. Load development seed
    12. Start backend
    13. Start simulated lab
    14. Start Studio
    15. Run tests

# 23. Clone Repository

Example:

    git clone https://github.com/KritvaOS/kritva-raas.git
    cd kritva-raas

Verify:

    git status

The working tree should initially be clean.

# 24. Install JavaScript Dependencies

Run:

    corepack enable
    pnpm install --frozen-lockfile

`--frozen-lockfile` should be used for reproducible installation.

A developer may update dependencies only through an intentional dependency
change.

# 25. Install Rust Dependencies

For Studio:

    cargo fetch

If the repository contains a Rust workspace:

    cargo metadata --locked

Rust dependency lock files must be committed where required by the project.

# 26. Bootstrap Validation

A bootstrap script should eventually provide:

    pnpm bootstrap

The command should validate:

- Node version;
- pnpm version;
- Rust version;
- Docker;
- required environment files;
- dependency installation;
- local infrastructure availability;
- database connectivity.

Until a single bootstrap command exists, developers should execute the
documented steps individually.

# 27. Start Local Infrastructure

Start:

    docker compose up -d

Check:

    docker compose ps

Expected state:

    PostgreSQL       healthy
    Object Storage   healthy
    Queue            healthy or local equivalent

Infrastructure startup failure must be resolved before application debugging.

# 28. Database Initialization

The database lifecycle is:

    Empty Database
          |
          v
    Migration
          |
          v
    Schema
          |
          v
    Seed
          |
          v
    Development Database

The application must not depend on manually created tables.

# 29. Database Migration

The repository shall expose a canonical migration command.

Conceptually:

    pnpm db:migrate

Migration execution should be deterministic and ordered.

Migration files must be committed.

Developers must not modify an already-applied migration in a shared branch.

# 30. Database Seed

Development seed data should create:

- development organization;
- test users;
- test project;
- test platform;
- simulated platform version;
- capabilities;
- simulated lab;
- simulated resource;
- development credit plan;
- development wallet;
- sample artifact metadata where required.

Seed data must be clearly marked as development data.

# 31. Seed Safety

Seed scripts must never:

- contact production;
- create production credentials;
- create real financial transactions;
- provision physical robot actions;
- send external customer communications.

# 32. Local Backend Startup

The Control Plane backend should support:

    pnpm dev:backend

The backend should expose:

- health endpoint;
- readiness endpoint;
- API endpoints;
- WebSocket endpoint where applicable.

Example:

    curl http://127.0.0.1:4000/health

Expected response should indicate local development status.

# 33. Backend Startup Dependencies

Backend startup order:

    Configuration
        |
        v
    Database
        |
        v
    Object Storage / Queue
        |
        v
    Backend
        |
        v
    Ready

The backend should distinguish liveness from readiness.

# 34. Studio Startup

The Studio application should support:

    pnpm dev:studio

The development flow is:

    React UI
        |
        v
    Tauri
        |
        v
    Rust Native Layer
        |
        +--> Local Files
        +--> Local Build
        +--> Credential Store
        |
        v
    Control Plane API

Studio should default to the Local environment.

# 35. Studio Security During Development

Development Studio must not contain:

- production signing keys;
- production database credentials;
- production cloud credentials;
- unrestricted administrative tokens.

Local credentials should use:

- OS credential storage where practical;
- disposable development credentials;
- short-lived tokens.

# 36. Simulated Lab Startup

The simulated Lab environment should support:

    pnpm dev:lab

The conceptual flow is:

    Control Plane
         |
         v
    Lab Protocol
         |
         v
    Simulated Lab Agent
         |
         v
    Simulated Runtime
         |
         v
    Simulated Robot

The simulator must use the same external contracts as the intended real lab
where practical.

# 37. Complete Local System

The complete local environment is:

    +---------------- Developer Machine ----------------+
    |                                                   |
    |  Studio                                           |
    |    |                                              |
    |    v                                              |
    |  Local Runtime                                    |
    |    |                                              |
    |    +---- local source/build                      |
    |                                                   |
    |  Backend                                          |
    |    |                                              |
    |    +---- PostgreSQL                               |
    |    +---- Object Storage                           |
    |    +---- Queue                                    |
    |                                                   |
    |  Simulated Lab Agent                              |
    |    |                                              |
    |    v                                              |
    |  Simulated Runtime                                |
    |    |                                              |
    |    v                                              |
    |  Simulated Robot                                  |
    +---------------------------------------------------+

# 38. Canonical End-to-End Developer Flow

The complete local test path is:

    Create Project
         |
         v
    Select Simulated Platform
         |
         v
    Local Source
         |
         v
    Local Build
         |
         v
    Package .krv
         |
         v
    Validate Artifact
         |
         v
    Upload Artifact
         |
         v
    Book Simulated Resource
         |
         v
    Create Job
         |
         v
    Simulated Lab
         |
         v
    Run
         |
         v
    Results
         |
         v
    Rerun

No physical robot is required for this workflow.

# 39. Workspace Commands

The root package should expose predictable commands.

Recommended command classes:

    pnpm install
    pnpm dev
    pnpm dev:studio
    pnpm dev:backend
    pnpm dev:lab
    pnpm build
    pnpm test
    pnpm test:unit
    pnpm test:integration
    pnpm test:e2e
    pnpm lint
    pnpm typecheck
    pnpm format
    pnpm format:check
    pnpm db:migrate
    pnpm db:seed

Exact script names shall remain centralized in the root `package.json`.

# 40. Development Command Principle

A developer should not need to know internal implementation details merely to
start the system.

Preferred:

    pnpm dev

rather than requiring multiple undocumented commands.

For component debugging, component-specific commands remain available.

# 41. Monorepo Task Execution

The repository may use Turborepo for task orchestration.

The dependency graph should ensure:

    packages/contracts
        |
        +--> packages/api-client
        |
        +--> apps/backend
        |
        +--> apps/studio

Build tasks should respect package dependencies.

# 42. Contract Package

`packages/contracts` is authoritative for shared wire-level contracts where
the implementation uses generated or shared TypeScript definitions.

It may contain:

- request schemas;
- response schemas;
- event schemas;
- error schemas;
- version constants;
- validation schemas.

It must not become a dumping ground for application business logic.

# 43. API Client Package

`packages/api-client` provides typed interaction with the Control Plane.

It should handle:

- request construction;
- response decoding;
- authentication propagation;
- error normalization;
- correlation IDs;
- WebSocket/event subscriptions where appropriate.

Business decisions remain in application/domain services.

# 44. UI Package

`packages/ui` contains reusable presentation components.

It should not contain:

- backend credentials;
- business database access;
- production secrets;
- platform-specific execution authority.

# 45. Configuration Package

`packages/config` provides common configuration parsing and validation.

It should distinguish:

- browser-safe configuration;
- Studio-local configuration;
- backend-only configuration.

A backend secret must never be imported into frontend code.

# 46. Local Database Access

Only backend infrastructure should access PostgreSQL directly.

Studio must not connect directly to PostgreSQL.

The flow is:

    Studio
       |
       v
    API
       |
       v
    Application Service
       |
       v
    Repository
       |
       v
    PostgreSQL

# 47. Local Object Storage Access

Large artifacts/results should follow:

    Studio
       |
       v
    Control Plane
       |
       +--> authorization
       |
       v
    Signed/controlled storage operation
       |
       v
    Object Storage

The Studio must not receive unrestricted storage credentials.

# 48. Local Queue

The queue is infrastructure, not business truth.

Persistent business state remains in PostgreSQL.

The flow is:

    Application
       |
       v
    PostgreSQL transaction
       |
       v
    Outbox/Event
       |
       v
    Queue
       |
       v
    Worker

Queue loss must not silently corrupt authoritative state.

# 49. Logging

Local logs should include:

- timestamp;
- level;
- service;
- environment;
- request ID;
- correlation/trace ID where available;
- event name;
- error code.

Example:

    2026-10-08T20:00:01Z INFO backend
    request_id=req-123 trace_id=abc
    event=booking.created booking_id=booking-001

Secrets must never appear in logs.

# 50. Local Observability

At minimum, developers should be able to inspect:

- backend logs;
- Studio logs;
- Lab Agent logs;
- database status;
- object-storage status;
- queue status.

Docker logs:

    docker compose logs -f

Service-specific logs should remain distinguishable.

# 51. Testing Layers

The repository shall support:

    Unit Tests
        |
        v
    Component Tests
        |
        v
    Integration Tests
        |
        v
    End-to-End Tests
        |
        v
    HIL Tests
        |
        v
    Physical Validation

Most developer testing should terminate before physical hardware.

# 52. Unit Tests

Unit tests validate isolated behavior.

Examples:

- configuration;
- artifact manifest;
- credit calculation;
- booking policy;
- state transitions;
- authorization policy;
- protocol validation.

Unit tests should not require Docker where unnecessary.

# 53. Integration Tests

Integration tests validate:

- PostgreSQL;
- repositories;
- application services;
- object storage;
- queue;
- protocol handlers.

Integration tests may use disposable containers.

# 54. End-to-End Tests

E2E tests validate:

    Login
      |
      v
    Project
      |
      v
    Platform
      |
      v
    Build
      |
      v
    Artifact
      |
      v
    Booking
      |
      v
    Job
      |
      v
    Simulated Run
      |
      v
    Result

# 55. Database Reset

A deterministic reset operation should eventually be available:

    pnpm db:reset

This should:

1. stop dependent application activity;
2. recreate local schema;
3. apply migrations;
4. load seed data.

It must be impossible for this command to target production.

# 56. Formatting

Formatting is mandatory.

JavaScript/TypeScript formatting should use the repository-defined formatter.

Rust formatting:

    cargo fmt --all -- --check

Documentation formatting should follow repository conventions.

# 57. Linting

Run:

    pnpm lint

Rust:

    cargo clippy --all-targets --all-features -- -D warnings

Lint failures should be treated as development failures.

# 58. Type Checking

Run:

    pnpm typecheck

TypeScript strictness should remain enabled unless a documented architectural
exception exists.

# 59. Build Verification

Run:

    pnpm build

Build verification must cover affected workspace packages.

Studio builds should verify both frontend and native layers.

# 60. Full Verification

A developer preparing a significant change should run:

    pnpm format:check
    pnpm lint
    pnpm typecheck
    pnpm test
    pnpm build

Where relevant:

    pnpm test:integration
    pnpm test:e2e

# 61. Git Workflow

Before starting work:

    git status
    git pull --rebase

Create a focused branch.

Example:

    git checkout -b feat/booking-platform-selection

Keep commits:

- focused;
- reviewable;
- logically complete.

Do not commit:

- `.env.local`;
- credentials;
- build outputs;
- local database files;
- IDE secrets;
- production configuration.

# 62. Pre-Commit Checklist

Before committing:

- [ ] tests pass;
- [ ] lint passes;
- [ ] typecheck passes;
- [ ] formatting passes;
- [ ] no secrets are present;
- [ ] no accidental generated files are included;
- [ ] migration changes are intentional;
- [ ] documentation is updated where required.

# 63. Database Development Rules

Database changes require:

1. migration;
2. repository/domain update;
3. tests;
4. documentation if contract changes;
5. seed adjustment where required.

Never manually modify shared development databases to make an application
appear correct.

# 64. Migration Rules

Migrations must be:

- ordered;
- immutable after shared use;
- reversible where practical;
- compatible with application rollout;
- tested on a clean database.

Production migrations must use the expand-contract approach where required.

# 65. Local Authentication

Local development should provide a safe development authentication mode.

It may use seeded test identities.

Example conceptual identities:

    developer@example.local
    admin@example.local
    operator@example.local

These are not production identities.

Local authentication must still exercise authorization boundaries.

# 66. Local Authorization

Development should support at least:

- organization owner;
- organization member;
- project member;
- project viewer;
- platform operator;
- lab operator;
- administrator.

Tests must prove unauthorized users cannot access another organization's
resources.

# 67. Local Tenant Isolation

The local environment must test:

    Organization A
        |
        X
        |
    Organization B

Cross-tenant access must return an appropriate authorization or not-found
response according to the security policy.

Repository filtering and API authorization must both be tested.

# 68. Local Artifact Flow

Artifact development flow:

    Source
      |
      v
    Build
      |
      v
    Package
      |
      v
    Manifest
      |
      v
    Checksum
      |
      v
    Signature
      |
      v
    Upload
      |
      v
    Validate

The local development environment should make the artifact contents inspectable
without exposing source to remote services.

# 69. Local Credit Flow

Development credit flow:

    Seed Wallet
        |
        v
    Rate Card
        |
        v
    Booking Request
        |
        v
    Credit Reservation
        |
        v
    Job
        |
        v
    Consumption
        |
        v
    Ledger

All mutations must remain auditable.

# 70. Local Booking Flow

Booking flow:

    Request
       |
       v
    Validate Project
       |
       v
    Validate Platform
       |
       v
    Validate Resource
       |
       v
    Calculate Credits
       |
       v
    Reserve Credits
       |
       v
    Allocate Resource
       |
       v
    Confirm Booking

Concurrency tests should verify that overlapping bookings cannot succeed for
the same exclusive resource.

# 71. Local Job Flow

Job lifecycle:

    CREATED
       |
       v
    QUEUED
       |
       v
    VALIDATING
       |
       v
    ALLOCATING
       |
       v
    DEPLOYING
       |
       v
    STARTING
       |
       v
    RUNNING
       |
       v
    STOPPING
       |
       v
    COMPLETED

Failure states include:

    FAILED
    CANCELLED
    TIMEOUT

# 72. Local Result Flow

Result flow:

    Run
      |
      v
    Result CREATED
      |
      v
    PROCESSING
      |
      v
    AVAILABLE
      |
      v
    Download

Large files are stored in object storage.

Metadata remains in PostgreSQL.

# 73. Developer Data Reset Strategy

When local state becomes inconsistent:

    Stop Services
        |
        v
    Reset Database
        |
        v
    Recreate Storage
        |
        v
    Reapply Migrations
        |
        v
    Reseed
        |
        v
    Restart Services

Developers should prefer deterministic reset over undocumented manual repair.

# 74. Troubleshooting — Dependency Installation

Symptoms:

- package resolution errors;
- peer dependency conflicts;
- lockfile mismatch.

Actions:

    node --version
    pnpm --version
    git status
    pnpm install --frozen-lockfile

Do not immediately delete the lockfile.

If the lockfile is intentionally changed, the dependency change must be
reviewed.

# 75. Troubleshooting — Node Version

If package scripts fail unexpectedly:

    node --version

Compare with the repository-required version.

Use the repository's Node version manager configuration.

Do not solve version mismatches by changing application code.

# 76. Troubleshooting — Rust Version

Check:

    rustc --version
    cargo --version

Then verify:

    rustup show

Use the repository-pinned toolchain.

# 77. Troubleshooting — Docker

Check:

    docker info
    docker compose ps

If containers repeatedly restart:

    docker compose logs <service>

Inspect:

- port conflicts;
- environment variables;
- volume state;
- image availability;
- health checks.

# 78. Troubleshooting — PostgreSQL

Check connectivity:

    psql "$DATABASE_URL"

If unavailable:

    docker compose ps
    docker compose logs postgres

If schema is incorrect:

    pnpm db:migrate

If local state is disposable:

    pnpm db:reset

# 79. Troubleshooting — Port Conflict

Typical local ports may include:

| Service | Example |
|---|---:|
| Backend API | 4000 |
| PostgreSQL | 5432 |
| Object Storage API | 9000 |
| Object Storage Console | 9001 |
| Studio dev server | implementation-defined |

Check:

    ss -ltnp

or the platform equivalent.

Never solve port conflicts by changing production configuration.

# 80. Troubleshooting — Backend Cannot Start

Check in order:

    1. Environment file
    2. Node version
    3. Dependencies
    4. PostgreSQL
    5. Migrations
    6. Object storage
    7. Queue
    8. Backend logs

The readiness endpoint should identify unavailable dependencies.

# 81. Troubleshooting — Studio Cannot Start

Check:

    1. Node version
    2. pnpm dependencies
    3. Rust toolchain
    4. Tauri native dependencies
    5. API endpoint
    6. Local credential configuration

Run frontend and Rust checks independently when debugging.

# 82. Troubleshooting — Simulator Cannot Connect

Verify:

    Control Plane
        |
        X
    Lab Protocol
        |
        X
    Simulator

Check:

- protocol version;
- endpoint;
- credentials;
- Lab Agent identity;
- network port;
- simulator logs;
- backend logs.

# 83. Troubleshooting — Database Migration Failure

Do not manually edit production-like schemas.

For local development:

1. inspect migration error;
2. determine whether migration itself is incorrect;
3. restore clean local database;
4. rerun migrations;
5. fix migration;
6. rerun full migration chain.

# 84. Troubleshooting — Stale Dependencies

Preferred:

    pnpm install --frozen-lockfile

If a dependency must change:

    pnpm update <package>

Review the resulting lockfile.

Do not commit unrelated dependency churn.

# 85. Troubleshooting — Authentication

Verify:

- local auth mode;
- test user;
- token expiry;
- API endpoint;
- browser/Studio storage;
- clock synchronization.

Never insert production credentials to solve a local authentication problem.

# 86. Troubleshooting — Authorization

When access is denied, inspect:

    Principal
       |
       v
    Organization
       |
       v
    Project
       |
       v
    Role
       |
       v
    Permission
       |
       v
    Resource

Authorization failures should be diagnosable without exposing secrets.

# 87. Troubleshooting — Artifact Upload

Check:

- artifact exists;
- manifest is valid;
- checksum is correct;
- signature is valid;
- platform matches;
- architecture matches;
- runtime version matches;
- SDK version matches;
- capability requirements are supported.

# 88. Troubleshooting — Job Stuck

Inspect:

    Job
      |
      +--> database state
      +--> queue
      +--> worker
      +--> Lab Agent
      +--> Runtime
      +--> Resource

A job must never remain indefinitely in a transitional state without an
operational timeout or reconciliation mechanism.

# 89. Troubleshooting — Result Missing

Verify:

    Run exists
      |
      v
    Result exists
      |
      v
    Result status
      |
      v
    Result file metadata
      |
      v
    Object storage object

PostgreSQL remains authoritative for result metadata.

# 90. Local Security Checklist

Developers must:

- [ ] use local environment files;
- [ ] avoid production credentials;
- [ ] use OS credential storage where applicable;
- [ ] keep `.env.local` ignored;
- [ ] inspect staged files before commit;
- [ ] avoid copying secrets into tickets;
- [ ] avoid logging tokens;
- [ ] avoid storing source in test artifacts;
- [ ] use disposable development credentials;
- [ ] report accidental secret exposure immediately.

# 91. Local Source Privacy

The local environment shall reinforce the product architecture:

    Source
       |
       v
    Local Build
       |
       v
    Artifact

The backend should not receive:

- Git history;
- source directories;
- compiler input trees;
- editor files;
- source maps unless explicitly required;
- development secrets.

# 92. CI Parity

CI should use the same primary commands as local development:

    pnpm install --frozen-lockfile
    pnpm format:check
    pnpm lint
    pnpm typecheck
    pnpm test
    pnpm build

CI may add security, integration and E2E jobs.

The goal is:

    Developer Command
          =
    CI Command

where practical.

# 93. CI Environment

CI shall use isolated:

- database;
- object storage;
- queue;
- credentials;
- artifact signing/test keys.

Production credentials must not be available to ordinary pull-request jobs.

# 94. Development Containers

A development container may be provided in the future.

If provided, it should contain:

- Node;
- pnpm;
- Rust;
- Docker client where required;
- PostgreSQL client;
- standard diagnostic tools.

The container must not hide important host integration requirements for Tauri.

# 95. IDE Recommendations

Developers may use any compatible IDE.

Recommended capabilities:

- TypeScript language server;
- ESLint integration;
- Prettier integration;
- Rust Analyzer;
- Git integration;
- Docker integration;
- PostgreSQL client.

IDE configuration must not be required for correctness.

# 96. Documentation Development

When architecture or setup changes:

- update relevant documentation;
- update examples;
- update environment templates;
- update bootstrap scripts;
- update CI where necessary.

Documentation is part of the implementation contract.

# 97. Developer Onboarding

A new developer should complete:

    1. Repository access
    2. Git configuration
    3. Toolchain installation
    4. Repository clone
    5. pnpm installation
    6. Rust installation
    7. Docker installation
    8. Environment configuration
    9. Dependency installation
    10. Infrastructure startup
    11. Database migration
    12. Database seed
    13. Backend startup
    14. Simulator startup
    15. Studio startup
    16. Unit tests
    17. Integration tests
    18. E2E test
    19. First sample project
    20. First simulated Run
    21. First Result
    22. First clean commit

# 98. Onboarding Completion Test

The onboarding is successful when the developer can demonstrate:

    Studio
      |
      v
    Project
      |
      v
    Simulated Platform
      |
      v
    Local Build
      |
      v
    .krv
      |
      v
    Booking
      |
      v
    Job
      |
      v
    Simulated Robot
      |
      v
    Run
      |
      v
    Result

without requiring assistance from another developer.

# 99. Developer Environment Health Check

A future health command should provide:

    pnpm doctor

It should report:

- Git;
- Node;
- pnpm;
- Rust;
- Cargo;
- Docker;
- PostgreSQL;
- environment;
- dependencies;
- database;
- simulator.

Example conceptual output:

    Kritva RaaS Development Health
    --------------------------------
    Git                 PASS
    Node                PASS
    pnpm                PASS
    Rust                PASS
    Docker              PASS
    PostgreSQL          PASS
    Environment         PASS
    Dependencies        PASS
    Database            PASS
    Simulator           PASS

# 100. Phase Mapping

| Phase | Development Setup Responsibility |
|---|---|
| Phase 0 | Toolchain, repository, monorepo, environment baseline |
| Phase 1 | Backend, database, migrations, auth |
| Phase 2 | Studio, local build, artifact workflow |
| Phase 3 | Simulator, Job/Run, E2E |
| Phase 4 | Credits, booking, resource allocation |
| Phase 5 | Lab Agent and physical development tools |
| Phase 6 | Security, CI hardening, recovery |
| Phase 7 | Scale testing and operational tooling |
| Phase 8 | Production qualification and release readiness |

# 101. Phase 0 Acceptance

Phase 0 is complete when:

- repository structure is established;
- package manager is pinned;
- Node version is pinned;
- Rust version is pinned;
- Docker setup is documented;
- PostgreSQL setup is documented;
- environment templates exist;
- basic bootstrap works;
- CI uses the same baseline commands.

# 102. Phase 1 Acceptance

Phase 1 is complete when:

- backend starts locally;
- PostgreSQL starts locally;
- migrations run cleanly;
- seed data loads;
- authentication works;
- authorization works;
- tenant isolation tests pass;
- backend health/readiness works.

# 103. Phase 2 Acceptance

Phase 2 is complete when:

- Studio starts locally;
- Tauri native layer works;
- local source can be selected;
- local build can execute;
- `.krv` artifact can be generated;
- artifact can be validated;
- artifact can be uploaded;
- source does not leave the local build boundary.

# 104. Phase 3 Acceptance

Phase 3 is complete when:

- simulated Lab Agent starts;
- protocol connection works;
- Job can be created;
- Run can be created;
- simulated execution works;
- telemetry/logs are visible;
- result is generated;
- E2E workflow passes.

# 105. Phase 4 Acceptance

Phase 4 is complete when:

- platform-specific credits work;
- rate calculation works;
- wallet works;
- reservation works;
- booking works;
- resource allocation works;
- concurrent booking protection works;
- cancellation/refund behavior works.

# 106. Phase 5 Acceptance

Phase 5 is complete when:

- physical Lab Agent can authenticate;
- platform compatibility is checked;
- resource identity is correct;
- local safety policy is enforced;
- controlled hardware execution succeeds;
- hardware faults are handled safely;
- simulator and hardware contracts remain aligned.

# 107. Phase 6 Acceptance

Phase 6 is complete when:

- security scanning is integrated;
- secrets are managed correctly;
- key management is operational;
- tenant isolation is tested;
- audit logging is operational;
- backups are configured;
- restore is tested;
- production-like CI gates pass.

# 108. Phase 7 Acceptance

Phase 7 is complete when:

- capacity testing is complete;
- multi-resource execution works;
- operational dashboards exist;
- recovery procedures are tested;
- scaling bottlenecks are measured;
- developer tooling remains usable at target repository size.

# 109. Phase 8 Acceptance

Phase 8 is complete when:

- production release workflow passes;
- full E2E qualification passes;
- physical qualification passes where applicable;
- security approval passes;
- safety approval passes;
- support readiness passes;
- rollback is tested;
- developer and operator runbooks are complete.

# 110. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Tool version drift | High | Pin versions |
| Dependency drift | High | Lockfile |
| Environment drift | High | `.env.example` + validation |
| Docker differences | Medium | Health checks |
| DB drift | High | Migrations |
| Seed drift | Medium | Deterministic seed |
| Secret leakage | Critical | Ignore files + scanning |
| Studio native build failure | High | Document native prerequisites |
| Simulator divergence | High | Contract tests + HIL |
| CI/local mismatch | High | Same commands |
| Monorepo coupling | Medium | package boundaries |
| Slow builds | Medium | caching and task graph |
| Port collisions | Low | configurable local ports |
| Stale local state | Medium | reset commands |
| Production credential misuse | Critical | environment isolation |
| Physical lab dependency | High | simulator-first |

# 111. Performance Considerations

Local development should remain responsive at the expected repository scale.

Optimization order:

    Correctness
        |
        v
    Dependency graph
        |
        v
    Incremental builds
        |
        v
    Caching
        |
        v
    Parallel execution
        |
        v
    Developer hardware optimization

Do not introduce architectural complexity merely to improve a slow local build
without measurement.

# 112. Reproducibility

A developer environment should be reconstructable from:

- Git repository;
- pinned toolchain;
- lockfile;
- migration files;
- seed files;
- environment template;
- documented local infrastructure.

Machine-specific undocumented changes are not part of the supported setup.

# 113. Offline Development

The project should support partial offline development where practical.

For example:

- unit tests;
- TypeScript checks;
- Rust checks;
- documentation;
- local simulator;
- local database.

Cloud-dependent workflows may require network access.

Physical robot execution inherently requires the appropriate lab connection.

# 114. Dependency Security

Dependencies must be:

- reviewed;
- version controlled;
- scanned;
- updated deliberately.

Automated dependency updates must not bypass normal CI checks.

High-risk dependency vulnerabilities should be tracked through the project
security process.

# 115. Local Build Reproducibility

The local artifact should contain enough metadata to identify:

- application;
- application version;
- platform;
- architecture;
- runtime;
- SDK;
- build identifier;
- checksum;
- capabilities.

This metadata is essential for later remote compatibility validation.

# 116. Development Artifact Storage

Local development may use a disposable object-storage bucket.

Recommended logical separation:

    kritva-local-artifacts
    kritva-local-results

Production buckets must never be used for development.

# 117. Development Database Isolation

Each environment should have a separate database.

Local:

    kritva_raas_local

Development:

    kritva_raas_dev

Staging:

    kritva_raas_staging

Production:

    kritva_raas_prod

Names are illustrative; actual deployment naming may vary.

The critical invariant is isolation, not the literal name.

# 118. Developer Branch Validation

Before opening a pull request:

    pnpm format:check
    pnpm lint
    pnpm typecheck
    pnpm test
    pnpm build

For database or integration changes:

    pnpm test:integration
    pnpm test:e2e

For Studio changes:

    Studio build
    Tauri validation

# 119. Pull Request Expectations

A pull request should identify:

- affected applications;
- affected packages;
- database changes;
- environment changes;
- protocol changes;
- security impact;
- documentation impact;
- tests executed.

Architecture-changing work should reference the applicable ADR.

# 120. Architecture Change Rule

If implementation requires changing one of the product-wide decisions in
`planning/DECISIONS.md`, the developer must not silently implement the
change.

The change requires:

    New Evidence
        |
        v
    ADR Review
        |
        v
    New/Superseding ADR
        |
        v
    Implementation

# 121. Open Questions

The following development-setup items remain implementation choices until
explicitly standardized:

1. Exact Node version.
2. Exact pnpm version.
3. Exact Rust stable release.
4. Exact PostgreSQL major version.
5. Exact object-storage emulator.
6. Exact queue emulator.
7. Exact Tauri native dependency packaging.
8. Exact local authentication mechanism.
9. Exact `pnpm doctor` implementation.
10. Exact development container strategy.
11. Exact database migration framework.
12. Exact test framework selection.
13. Exact E2E browser automation framework.
14. Exact CI runner image.
15. Exact local telemetry stack.

These choices must remain consistent with the architectural decisions.

# 122. Full Acceptance Criteria — Repository

- [ ] Repository is a pnpm monorepo.
- [ ] Workspace layout is documented.
- [ ] Root package scripts are documented.
- [ ] Workspace lockfile is committed.
- [ ] Node version is pinned.
- [ ] pnpm version is pinned.
- [ ] Rust version is pinned.
- [ ] Tauri prerequisites are documented.
- [ ] Docker prerequisites are documented.
- [ ] PostgreSQL prerequisites are documented.
- [ ] Supported host platforms are documented.

# 123. Full Acceptance Criteria — Bootstrap

- [ ] Clean-machine bootstrap procedure exists.
- [ ] Repository can be cloned.
- [ ] Dependencies install from lockfile.
- [ ] Environment template exists.
- [ ] Local environment can be created.
- [ ] Infrastructure can be started.
- [ ] Database migrations run.
- [ ] Development seed runs.
- [ ] Backend starts.
- [ ] Simulator starts.
- [ ] Studio starts.

# 124. Full Acceptance Criteria — Configuration

- [ ] `.env.example` exists.
- [ ] Local environment files are ignored.
- [ ] Required configuration is validated.
- [ ] Production configuration cannot be selected accidentally.
- [ ] Frontend cannot access backend secrets.
- [ ] Configuration precedence is deterministic.
- [ ] Missing configuration produces actionable errors.
- [ ] Environment-specific resources are isolated.

# 125. Full Acceptance Criteria — Database

- [ ] PostgreSQL is authoritative locally.
- [ ] Migrations are version controlled.
- [ ] Migrations are deterministic.
- [ ] Seed data is deterministic.
- [ ] Database reset is available.
- [ ] Database connectivity is testable.
- [ ] Schema drift is detectable.
- [ ] Production databases cannot be targeted by reset commands.
- [ ] Repository access is used for application persistence.

# 126. Full Acceptance Criteria — Backend

- [ ] Backend starts with documented commands.
- [ ] Health endpoint works.
- [ ] Readiness endpoint works.
- [ ] Database connectivity is validated.
- [ ] Object storage connectivity is validated.
- [ ] Queue connectivity is validated.
- [ ] Logs contain request correlation.
- [ ] Secrets are redacted.
- [ ] Local authentication works.
- [ ] Local authorization works.

# 127. Full Acceptance Criteria — Studio

- [ ] Studio starts locally.
- [ ] React development workflow works.
- [ ] Tauri development workflow works.
- [ ] Rust layer builds.
- [ ] IPC commands are validated.
- [ ] Local filesystem access is controlled.
- [ ] Credential storage is controlled.
- [ ] Backend API connectivity works.
- [ ] Local source can be selected.
- [ ] Local build can execute.

# 128. Full Acceptance Criteria — Artifact

- [ ] Artifact packaging works.
- [ ] Manifest is generated.
- [ ] Checksum is generated.
- [ ] Signature is generated.
- [ ] Artifact validation works.
- [ ] Compatibility metadata is present.
- [ ] Artifact upload works.
- [ ] Source is excluded from normal artifact contents.
- [ ] Local artifact storage is isolated from production.

# 129. Full Acceptance Criteria — Simulator

- [ ] Simulator starts independently.
- [ ] Simulator authenticates.
- [ ] Simulator implements the agreed protocol.
- [ ] Simulator supports resource state.
- [ ] Simulator accepts valid artifacts.
- [ ] Simulator rejects invalid artifacts.
- [ ] Simulator creates Runs.
- [ ] Simulator produces telemetry.
- [ ] Simulator produces logs.
- [ ] Simulator produces results.
- [ ] Simulator supports failure injection.

# 130. Full Acceptance Criteria — Integration

- [ ] Studio-to-backend integration works.
- [ ] Backend-to-database integration works.
- [ ] Backend-to-object-storage integration works.
- [ ] Backend-to-queue integration works.
- [ ] Backend-to-simulator integration works.
- [ ] Complete E2E flow works.
- [ ] Correlation IDs propagate.
- [ ] Retry behavior is tested.
- [ ] Timeout behavior is tested.
- [ ] Idempotency behavior is tested.

# 131. Full Acceptance Criteria — Security

- [ ] No production secrets are required locally.
- [ ] `.env.local` is ignored.
- [ ] Secret scanning is enabled.
- [ ] Tokens are not logged.
- [ ] Cross-tenant access is denied.
- [ ] Artifact signatures are checked.
- [ ] Restricted configuration is server-only.
- [ ] Development credentials are disposable.
- [ ] Local reset cannot target production.
- [ ] CI pull requests do not receive production credentials.

# 132. Full Acceptance Criteria — Testing

- [ ] Unit tests run locally.
- [ ] Integration tests run locally.
- [ ] E2E tests run locally.
- [ ] Formatting passes.
- [ ] Lint passes.
- [ ] Type checking passes.
- [ ] Rust formatting passes.
- [ ] Rust clippy passes.
- [ ] Build passes.
- [ ] CI uses equivalent commands.

# 133. Full Acceptance Criteria — Onboarding

- [ ] New developer can follow this document.
- [ ] Prerequisites are explicit.
- [ ] Repository clone is explicit.
- [ ] Environment setup is explicit.
- [ ] Infrastructure startup is explicit.
- [ ] Database initialization is explicit.
- [ ] Backend startup is explicit.
- [ ] Simulator startup is explicit.
- [ ] Studio startup is explicit.
- [ ] First E2E execution is explicit.
- [ ] Troubleshooting guidance is available.

# 134. Final Development Setup Invariants

The following are mandatory:

1. pnpm is the canonical JavaScript package manager.
2. Node version is pinned.
3. Rust version is pinned.
4. PostgreSQL is authoritative for structured local business state.
5. Local infrastructure is disposable.
6. Migrations are the source of database structure.
7. Seed scripts are the source of development data.
8. Environment files do not contain production credentials.
9. Studio does not directly access PostgreSQL.
10. Studio does not receive unrestricted backend credentials.
11. Customer source remains local during normal development.
12. `.krv` is the remote execution boundary.
13. Simulator is the default lab for development.
14. Physical robots are not required for ordinary developer testing.
15. CI and local workflows use the same canonical commands where practical.
16. Security checks are part of development rather than post-release activity.
17. Architecture changes require corresponding decision records.
18. Local reset operations cannot affect production.
19. Database migrations are version controlled.
20. The complete local workflow must remain reproducible.

# 135. Final Developer Workflow

The intended developer experience is:

    Clone
      |
      v
    Bootstrap
      |
      v
    Install
      |
      v
    Start Infrastructure
      |
      v
    Migrate + Seed
      |
      v
    Start Backend
      |
      v
    Start Simulator
      |
      v
    Start Studio
      |
      v
    Develop
      |
      v
    Test
      |
      v
    Build
      |
      v
    Commit
      |
      v
    Pull Request
      |
      v
    CI
      |
      v
    Review

# 136. Final Principle

> A Kritva RaaS developer environment shall make the correct architecture the
> easiest architecture to use: a reproducible monorepo, pinned toolchain,
> disposable local infrastructure, authoritative PostgreSQL migrations,
> explicit environment isolation, Tauri plus Rust for the local developer
> boundary, a modular Control Plane, protocol-compatible simulated robotics,
> and a complete local path from source to trusted `.krv` artifact to Job to
> Run to Result. Development must not require production credentials or
> physical robots, and every local workflow must reinforce the same privacy,
> security, tenant, artifact, execution and safety boundaries that govern the
> production RaaS platform.
