# PHASE-0-FOUNDATION — Acceptance Criteria

Milestone: PHASE-0-FOUNDATION — Architecture and Engineering Foundation

## 6 Acceptance criteria

### 6.1 Repository

- [ ] Repository structure matches approved architecture.
- [ ] Root README explains bootstrap.
- [ ] LICENSE exists.
- [ ] CONTRIBUTING.md exists.
- [ ] CHANGELOG.md exists.
- [ ] `.gitignore` exists.
- [ ] `.editorconfig` exists.
- [ ] No secrets are committed.
- [ ] Repository has reproducible dependency lock state.

### 6.2 Workspace

- [ ] pnpm workspace resolves.
- [ ] Workspace packages resolve.
- [ ] Turborepo/workspace orchestration works.
- [ ] Node version policy is documented.
- [ ] Rust version policy is documented.
- [ ] Package naming is consistent.
- [ ] Dependency direction is documented.
- [ ] Circular package dependencies are prohibited or explicitly reviewed.

### 6.3 Package boundaries

- [ ] UI contains reusable presentation components.
- [ ] Contracts contain shared protocol/API types.
- [ ] API client contains client transport logic.
- [ ] Auth contains authentication/session boundary code.
- [ ] Config contains validated configuration.
- [ ] Utils contains only generic utilities.
- [ ] Business logic is not placed in generic utility packages.
- [ ] Backend domain logic is not duplicated in frontend packages.

### 6.4 Studio

- [ ] Tauri application builds.
- [ ] React application renders.
- [ ] TypeScript compilation passes.
- [ ] Rust compilation passes.
- [ ] Routing foundation exists.
- [ ] IPC boundary exists.
- [ ] API client boundary exists.
- [ ] Session boundary exists.
- [ ] Error boundary exists.
- [ ] Loading state exists.
- [ ] Empty state exists.
- [ ] Basic accessibility checks pass.

### 6.5 Backend

- [ ] Backend builds.
- [ ] Application starts.
- [ ] Health endpoint works.
- [ ] Readiness endpoint works.
- [ ] Configuration is validated.
- [ ] Structured logging works.
- [ ] Request correlation works.
- [ ] API error model is consistent.
- [ ] Repository layer exists.
- [ ] Infrastructure adapter layer exists.
- [ ] Domain/application separation is visible.

### 6.6 Contracts

- [ ] Request envelope is versioned.
- [ ] Response envelope is versioned.
- [ ] Event envelope is versioned.
- [ ] Request ID is supported.
- [ ] Event ID is supported.
- [ ] Trace correlation is supported.
- [ ] Organization context is supported.
- [ ] Error code vocabulary is defined.
- [ ] Pagination convention is defined.
- [ ] Timestamp convention is defined.
- [ ] Identifier convention is defined.
- [ ] Contract compatibility rules are documented.

### 6.7 API

- [ ] REST API versioning is defined.
- [ ] Authentication middleware boundary exists.
- [ ] Authorization middleware boundary exists.
- [ ] Request validation boundary exists.
- [ ] Error mapping is consistent.
- [ ] Idempotency boundary is defined.
- [ ] API correlation headers/metadata are defined.
- [ ] WebSocket authentication boundary exists.
- [ ] Durable state remains authoritative over live events.

### 6.8 Database

- [ ] PostgreSQL starts locally.
- [ ] Database migrations run cleanly.
- [ ] Migration naming convention exists.
- [ ] Schema ownership is documented.
- [ ] UUIDv7 convention is documented.
- [ ] Timestamp convention uses timezone-aware timestamps.
- [ ] Foreign-key conventions are documented.
- [ ] Index conventions are documented.
- [ ] Transaction conventions are documented.
- [ ] JSONB usage is bounded and justified.
- [ ] Database test harness works.

### 6.9 Security

- [ ] Authentication integration seam exists.
- [ ] Authorization integration seam exists.
- [ ] Tenant context propagation exists.
- [ ] Deny-by-default authorization is documented.
- [ ] Secret handling rules are documented.
- [ ] Security scanning runs in CI.
- [ ] Dependency scanning runs in CI.
- [ ] Source code is not uploaded by foundational APIs.
- [ ] Audit integration seam exists.

### 6.10 Testing

- [ ] Unit tests run.
- [ ] Integration tests run.
- [ ] E2E skeleton runs.
- [ ] Database integration tests run.
- [ ] Contract tests have a foundation.
- [ ] Test fixtures are reproducible.
- [ ] Tests do not depend on production systems.
- [ ] CI executes required test layers.

### 6.11 CI

- [ ] Pull-request CI exists.
- [ ] Main-branch CI exists.
- [ ] Formatting check runs.
- [ ] Lint runs.
- [ ] Type checking runs.
- [ ] Unit tests run.
- [ ] Integration tests run.
- [ ] Build runs.
- [ ] Security checks run.
- [ ] Database migration validation runs.
- [ ] CI failure blocks merge where required.
- [ ] CI results are retained.

### 6.12 Local development

- [ ] New developer can bootstrap from documentation.
- [ ] Local PostgreSQL starts.
- [ ] Local dependencies start.
- [ ] Migrations run.
- [ ] Backend starts.
- [ ] Studio starts.
- [ ] Tests run.
- [ ] CI-equivalent checks run locally.
- [ ] No undocumented credentials are required.

### 6.13 Interfaces

- [ ] Object storage interface exists.
- [ ] Queue interface exists.
- [ ] Secrets interface exists.
- [ ] Audit interface exists.
- [ ] Lab Protocol interface exists.
- [ ] Lab Agent skeleton exists.
- [ ] Interfaces are provider-neutral.
- [ ] Implementations can be replaced without domain rewrites.

### 6.14 Documentation

- [ ] Architecture documentation exists.
- [ ] Protocol documentation exists.
- [ ] Database documentation exists.
- [ ] Security documentation exists.
- [ ] Frontend documentation exists.
- [ ] Backend documentation exists.
- [ ] Cloud documentation exists.
- [ ] Development setup exists.
- [ ] Development workflow exists.
- [ ] Branching strategy exists.
- [ ] Milestone convention exists.
- [ ] Task convention exists.

### 6.15 Cross-domain exit criteria

P0 FOUNDATION shall not close based solely on individual domain completion.

The following integrated flow must work:

    Developer
       |
       v
    Studio Skeleton
       |
       | contract
       v
    Backend Skeleton
       |
       | repository
       v
    PostgreSQL
       |
       | object adapter
       +------> Object Storage Interface
       |
       | queue adapter
       +------> Queue Interface
       |
       v
    Simulated Lab Protocol
       |
       v
    Simulated Lab Agent

Acceptance requires:

- [ ] Studio starts.
- [ ] Studio can call backend health endpoint.
- [ ] Backend loads configuration.
- [ ] Backend connects to PostgreSQL.
- [ ] Migration status is valid.
- [ ] Request correlation is visible.
- [ ] Organization context can be propagated.
- [ ] Contract serialization/deserialization succeeds.
- [ ] Repository boundary can be exercised.
- [ ] Object storage adapter can be mocked.
- [ ] Queue adapter can be mocked.
- [ ] Lab Protocol messages validate.
- [ ] Simulated Lab Agent skeleton responds.
- [ ] CI executes the integrated test.
- [ ] No source code crosses the intended artifact boundary.
- [ ] No physical robot is required for P0 FOUNDATION acceptance.

### 6.16 Quality gates

- [ ] No unresolved P0 architecture defect.
- [ ] No unresolved critical security defect.
- [ ] No unresolved critical CI defect.
- [ ] No known broken clean-machine bootstrap.
- [ ] No undocumented mandatory manual setup.
- [ ] No package boundary violation accepted without review.
- [ ] No provider-specific implementation leaked into domain interfaces.
- [ ] No production secret present in repository.
- [ ] No uncontrolled dependency drift.
- [ ] No acceptance criterion marked complete without evidence.

---
