# B-M01-CONTROL-PLANE — Acceptance Criteria

Milestone: B-M01 — Control Plane

# 6 Acceptance Criteria

## 6.1 Control Plane Foundation

- [ ] Backend starts successfully in local development.
- [ ] Backend starts with production-style configuration.
- [ ] Configuration is environment-specific.
- [ ] Secrets are not committed.
- [ ] Dependency injection/composition is explicit.
- [ ] Module boundaries are documented.
- [ ] API versioning is implemented.
- [ ] Request IDs are generated or propagated.
- [ ] Correlation IDs are supported.
- [ ] Structured logging is available.
- [ ] Health endpoint exists.
- [ ] Readiness endpoint exists.
- [ ] Failure of required dependencies causes readiness failure.

## 6.2 API v1

- [ ] `/api/v1` namespace exists.
- [ ] API routes are versioned.
- [ ] Request validation exists.
- [ ] Response contracts are consistent.
- [ ] Error responses are structured.
- [ ] HTTP status codes are appropriate.
- [ ] Unauthorized requests are rejected.
- [ ] Forbidden requests are rejected.
- [ ] Not-found behavior does not leak unauthorized resources.
- [ ] Conflict behavior is explicit.
- [ ] Validation errors identify invalid fields.
- [ ] Request IDs appear in responses.
- [ ] API documentation is generated or maintained.
- [ ] API contracts are covered by tests.

## 6.3 Identity

- [ ] User identity model exists.
- [ ] Authenticated principal is available to application services.
- [ ] Authentication adapter is provider-neutral.
- [ ] Current-user endpoint exists.
- [ ] Suspended users cannot perform protected operations.
- [ ] Deactivated users cannot authenticate.
- [ ] Identity failures fail closed.
- [ ] Authentication events can be audited.

## 6.4 Organizations

- [ ] Organization model exists.
- [ ] Organization IDs are unique.
- [ ] Organization membership exists.
- [ ] Membership has lifecycle state.
- [ ] Membership role is explicit.
- [ ] Organization ownership is represented.
- [ ] Organization APIs enforce authorization.
- [ ] Membership changes are auditable.
- [ ] Users cannot access organizations without membership.
- [ ] Organization ownership cannot be silently reassigned.

## 6.5 Authorization

- [ ] Authorization occurs after authentication.
- [ ] Authorization is enforced server-side.
- [ ] Default policy is deny.
- [ ] Organization scope is evaluated.
- [ ] Project scope is evaluated.
- [ ] Role permissions are explicit.
- [ ] ABAC context can be evaluated where required.
- [ ] UI visibility is not treated as authorization.
- [ ] Unauthorized resource existence is not leaked where policy requires
  indistinguishable not-found behavior.
- [ ] Privilege escalation is prevented.
- [ ] Administrative permissions are separate from normal user permissions.
- [ ] Authorization decisions are testable.

## 6.6 Tenant Isolation

- [ ] Every organization-owned Project has an organization ID.
- [ ] Repository queries require tenant context where applicable.
- [ ] Service methods validate tenant ownership.
- [ ] Cross-tenant resource access is rejected.
- [ ] Cross-tenant update is rejected.
- [ ] Cross-tenant delete/archive is rejected.
- [ ] Cross-tenant project membership is rejected.
- [ ] Cross-tenant platform access follows platform global/tenant rules.
- [ ] Tenant isolation tests pass.
- [ ] Database constraints support tenant integrity.

## 6.7 Projects

- [ ] Project belongs to an Organization.
- [ ] Project key is unique within an Organization.
- [ ] Project display name is separate from project key.
- [ ] Project lifecycle supports ACTIVE.
- [ ] Project lifecycle supports ARCHIVED.
- [ ] Deleted semantics follow the approved schema policy.
- [ ] Project metadata is bounded.
- [ ] Project APIs contain no source code payload.
- [ ] Project creation is authorized.
- [ ] Project update is authorized.
- [ ] Project archive is authorized.
- [ ] Project membership is organization-consistent.
- [ ] Project platform binding is organization-consistent.
- [ ] Project operations are audited.

## 6.8 Platform Catalog

- [ ] Platform catalog exists.
- [ ] Platform is globally identifiable.
- [ ] Platform lifecycle is supported.
- [ ] Platform version exists.
- [ ] Architecture exists.
- [ ] Capability exists.
- [ ] Platform-version capability relationship exists.
- [ ] Platform configuration exists.
- [ ] Catalog APIs expose authoritative data.
- [ ] Deprecated platforms are distinguishable.
- [ ] Retired platforms are distinguishable.
- [ ] Platform catalog does not depend on frontend hard-coding.
- [ ] Platform administration requires elevated authorization.
- [ ] Platform changes are audited.

## 6.9 Repository Foundation

- [ ] Repository interfaces are domain-oriented.
- [ ] Repositories do not contain HTTP concerns.
- [ ] Repositories do not contain UI concerns.
- [ ] Repositories support tenant-aware queries.
- [ ] Repository errors are mapped consistently.
- [ ] Transactions are controlled by application services.
- [ ] Database connection handling is centralized.
- [ ] Repository tests exist.
- [ ] Integration tests use a real PostgreSQL-compatible environment.

## 6.10 Transactions

- [ ] Application services define transaction boundaries.
- [ ] Multi-write business operations are atomic.
- [ ] Rollback behavior is tested.
- [ ] Partial organization/project operations cannot leave invalid state.
- [ ] Audit requirements are considered within transaction boundaries.
- [ ] Isolation level follows database architecture baseline.
- [ ] Explicit locking is used only where required.
- [ ] Optimistic concurrency is used where appropriate.

## 6.11 Idempotency

- [ ] Idempotency foundation exists.
- [ ] Idempotency key is scoped appropriately.
- [ ] Duplicate requests do not create duplicate business objects where
  idempotency is required.
- [ ] Replayed requests have deterministic behavior.
- [ ] Idempotency records have retention policy.
- [ ] Idempotency behavior is tested.
- [ ] Future booking/credit/job operations can reuse the abstraction.

## 6.12 Audit

- [ ] Audit repository exists.
- [ ] Audit service exists.
- [ ] Actor is recorded.
- [ ] Organization is recorded where applicable.
- [ ] Resource type is recorded.
- [ ] Resource ID is recorded.
- [ ] Action is recorded.
- [ ] Timestamp is recorded.
- [ ] Request ID is recorded.
- [ ] Outcome is recorded.
- [ ] Security-sensitive operations are audited.
- [ ] Administrative changes are audited.
- [ ] Audit records cannot be silently changed through normal CRUD paths.
- [ ] Audit data is distinct from application logs.

## 6.13 Security

- [ ] Authentication tests pass.
- [ ] Authorization tests pass.
- [ ] Tenant-isolation tests pass.
- [ ] Input validation tests pass.
- [ ] SQL injection defenses are verified.
- [ ] Sensitive fields are not logged.
- [ ] Authentication tokens are not logged.
- [ ] Secrets are not returned through APIs.
- [ ] Error responses do not expose internal stack traces in production mode.
- [ ] Administrative APIs require elevated authorization.

## 6.14 Testing

- [ ] Unit tests pass.
- [ ] Repository tests pass.
- [ ] Database migration tests pass.
- [ ] API contract tests pass.
- [ ] API integration tests pass.
- [ ] Authorization tests pass.
- [ ] Tenant-isolation tests pass.
- [ ] Audit tests pass.
- [ ] Idempotency tests pass.
- [ ] E2E Control Plane test passes.
- [ ] CI passes.

## 6.15 Documentation

- [ ] API v1 documented.
- [ ] Identity model documented.
- [ ] Organization model documented.
- [ ] Authorization model documented.
- [ ] Project APIs documented.
- [ ] Platform catalog documented.
- [ ] Repository architecture documented.
- [ ] Audit model documented.
- [ ] Configuration documented.
- [ ] Local development documented.
- [ ] Test strategy documented.
- [ ] Milestone evidence recorded.

---
