# PHASE-0-FOUNDATION — Review Checklist

Milestone: PHASE-0-FOUNDATION — Architecture and Engineering Foundation

## Review Gate

The milestone may be closed only when every item below is checked by the reviewer, the acceptance criteria in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) are all met, and the exit criteria in [MILESTONE.md](MILESTONE.md) are satisfied.

- [ ] All tasks in [TASKS.md](TASKS.md) are ACCEPTED (none open, none deferred without a change record).
- [ ] Every acceptance criterion has recorded evidence (test run, demo capture, or document).
- [ ] Architecture, protocol and database contracts referenced by this milestone were not changed without a change record.
- [ ] Security review items for this milestone are closed (source-code privacy, tenant isolation, secrets).
- [ ] Documentation affected by this milestone is updated and the tracking files are current.
- [ ] CHANGELOG.md is updated.
- [ ] The commit/tag step in [GIT_COMMIT_STEP.md](GIT_COMMIT_STEP.md) is prepared.

## 7 Test and verification plan

### 7.1 Verification strategy

P0 FOUNDATION verification follows:

    Static checks
        |
        v
    Unit tests
        |
        v
    Contract tests
        |
        v
    Database tests
        |
        v
    Integration tests
        |
        v
    E2E smoke
        |
        v
    Clean-machine bootstrap
        |
        v
    CI verification
        |
        v
    Architecture/security review

### 7.2 Repository verification

Verify:

- clean clone;
- dependency installation;
- workspace discovery;
- package build;
- lockfile consistency.

### 7.3 Studio verification

Verify:

- development startup;
- production build;
- Tauri packaging skeleton;
- IPC invocation;
- API client invocation;
- error handling.

### 7.4 Backend verification

Verify:

- startup;
- configuration validation;
- health;
- readiness;
- structured logging;
- correlation;
- API error handling.

### 7.5 Contract verification

For each envelope:

    construct
      |
      v
    serialize
      |
      v
    deserialize
      |
      v
    validate
      |
      v
    compare

Verify compatibility for valid and invalid messages.

### 7.6 Database verification

Run:

    clean database
        |
        v
    apply migrations
        |
        v
    validate schema
        |
        v
    run database tests
        |
        v
    rollback/recovery procedure
        |
        v
    repeat from clean state

### 7.7 Security verification

Verify:

- secrets scan;
- dependency scan;
- static analysis;
- tenant context cannot be omitted from protected domain operations;
- unauthorized access fails;
- repository does not persist source code;
- logs do not expose secrets.

### 7.8 CI verification

Create a controlled failing branch.

Verify that CI detects:

- formatting failure;
- lint failure;
- type failure;
- unit failure;
- build failure;
- migration failure;
- security failure.

### 7.9 Integration smoke test

The foundational integration test shall perform:

    Studio
      |
      v
    Backend /health
      |
      v
    Backend /readiness
      |
      v
    PostgreSQL
      |
      v
    Repository mock
      |
      v
    Contract validation
      |
      v
    Lab Protocol validation
      |
      v
    Simulated Lab Agent

### 7.10 Clean-machine verification

Use a clean Linux x86_64 environment.

Perform:

    git clone <repository>
    corepack enable
    pnpm install
    pnpm build
    pnpm test

Then start local infrastructure and execute migrations.

The exact repository commands shall be documented by the implementation.

### 7.11 Performance verification

P0 FOUNDATION does not require production-scale performance.

It shall establish baseline measurements for:

- backend startup;
- health response;
- database connection;
- migration execution;
- contract serialization;
- unit test execution;
- CI duration.

### 7.12 Evidence

Evidence shall include:

- CI run;
- test output;
- build output;
- migration output;
- clean-machine bootstrap result;
- security scan result;
- architecture review;
- security review.

---

## 8 Demo script

### 8.1 Demo objective

Demonstrate that the Kritva RaaS engineering foundation can be cloned, bootstrapped, built, tested, and exercised across Studio, Backend, PostgreSQL, contracts, and simulated lab interfaces.

### 8.2 Step 1 — Clone

Start from a clean machine.

    git clone <repository>
    cd kritva-raas

Expected:

Repository structure is immediately recognizable.

### 8.3 Step 2 — Install

Enable Corepack and install dependencies.

Expected:

- lockfile respected;
- workspace resolves;
- no undeclared dependency required.

### 8.4 Step 3 — Validate workspace

Run the documented workspace validation command.

Expected:

All packages are discovered.

### 8.5 Step 4 — Start database

Start local PostgreSQL.

Expected:

Database becomes reachable.

### 8.6 Step 5 — Run migrations

Apply migrations.

Expected:

Database reaches expected schema version.

### 8.7 Step 6 — Start backend

Start backend.

Expected:

Backend reports:

    HEALTH = OK
    READINESS = READY

### 8.8 Step 7 — Start Studio

Start Studio.

Expected:

Studio launches and displays foundation shell.

### 8.9 Step 8 — API connectivity

Studio invokes backend health/readiness.

Expected:

Request ID and correlation metadata are visible.

### 8.10 Step 9 — Contract test

Send a valid request envelope.

Expected:

Backend validates and returns a valid response envelope.

Send an invalid request.

Expected:

Structured error response is returned.

### 8.11 Step 10 — Database access

Execute a controlled repository operation.

Expected:

Repository accesses PostgreSQL through the defined abstraction.

### 8.12 Step 11 — Simulated Lab Protocol

Send a protocol-compatible command to the simulated Lab Agent.

Expected:

Message validates and response follows the shared protocol envelope.

### 8.13 Step 12 — Run tests

Execute unit, integration, and smoke tests.

Expected:

All required P0 FOUNDATION tests pass.

### 8.14 Step 13 — Run CI-equivalent checks

Execute:

    format
    lint
    typecheck
    test
    build
    security checks

Expected:

All required gates pass.

### 8.15 Step 14 — Demonstrate source privacy

Inspect network/API calls generated by the foundational flow.

Expected:

No customer source-code upload path exists.

### 8.16 Step 15 — Demonstrate provider neutrality

Replace an infrastructure adapter with a mock implementation.

Expected:

Domain/application code remains unchanged.

### 8.17 Demo completion

P0 FOUNDATION demo passes when:

> A clean environment can build and execute the foundational Studio, Backend, Database, Contract, and simulated Lab interfaces through documented commands with all mandatory quality gates passing.

---
