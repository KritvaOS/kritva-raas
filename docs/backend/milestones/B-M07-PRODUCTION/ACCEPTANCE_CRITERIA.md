# B-M07-PRODUCTION — Acceptance Criteria

Milestone: B-M07 — Production

# 6 Acceptance Criteria

## 6.1 Security

- [ ] Production authentication is enabled.
- [ ] MFA policy is enforced according to production policy.
- [ ] Session lifecycle is secure.
- [ ] Refresh-token rotation is implemented where applicable.
- [ ] API keys are scoped and revocable.
- [ ] Lab Agent identity is authenticated.
- [ ] Authorization is deny-by-default.
- [ ] Every protected operation performs authorization.
- [ ] Tenant ownership is verified server-side.
- [ ] Cross-tenant access tests pass.
- [ ] Rate limiting is enabled.
- [ ] Request-size limits are enabled.
- [ ] Upload restrictions are enabled.
- [ ] Security headers are configured.
- [ ] CORS policy is explicit.
- [ ] Error responses do not expose sensitive internals.
- [ ] Secrets are not logged.
- [ ] Secrets are not committed.
- [ ] Production secrets are managed by a secret provider.
- [ ] Critical keys use KMS/HSM-equivalent protection.
- [ ] Production signing keys are protected.
- [ ] Token-signing keys are separated from artifact-signing keys.
- [ ] Object storage is private by default.
- [ ] Database is private by default.
- [ ] Production network paths are explicitly authorized.
- [ ] Security scanning is integrated into CI.
- [ ] Critical security findings block release according to policy.

## 6.2 Tenant Isolation

- [ ] Organization is the primary tenant boundary.
- [ ] Customer-owned records have a verified ownership path.
- [ ] Repository queries enforce tenant scope.
- [ ] Application services enforce tenant scope.
- [ ] API authorization enforces tenant scope.
- [ ] Object storage access is tenant-safe.
- [ ] Result downloads are tenant-safe.
- [ ] Experiment access is tenant-safe.
- [ ] Booking access is tenant-safe.
- [ ] Credit access is tenant-safe.
- [ ] Job/Run access is tenant-safe.
- [ ] Administrative roles are explicitly scoped.
- [ ] Cross-tenant positive/negative tests exist.
- [ ] Tenant isolation tests run in CI.

## 6.3 Database

- [ ] PostgreSQL production deployment is HA-capable.
- [ ] Database credentials are externally managed.
- [ ] TLS is enabled.
- [ ] Network access is restricted.
- [ ] Connection pools are bounded.
- [ ] Total connection budget is documented.
- [ ] Slow queries are observable.
- [ ] Critical indexes are verified.
- [ ] Booking exclusion constraints remain active.
- [ ] Credit ledger integrity remains active.
- [ ] Idempotency constraints remain active.
- [ ] Transaction isolation is documented.
- [ ] Migration process is automated.
- [ ] Migration rollback/forward strategy is documented.
- [ ] PITR is enabled.
- [ ] Backup retention is defined.
- [ ] Restore has been tested.
- [ ] Restore evidence exists.

## 6.4 Object Storage

- [ ] Storage is private by default.
- [ ] Encryption is enabled.
- [ ] Access is least-privilege.
- [ ] Application paths cannot access arbitrary objects.
- [ ] Checksums are validated.
- [ ] Lifecycle rules exist.
- [ ] Retention rules are documented.
- [ ] Large files are streamed rather than loaded entirely into application
  memory.
- [ ] Recovery procedure is tested.
- [ ] Access is auditable where required.

## 6.5 Observability

- [ ] Structured logs are enabled.
- [ ] Request IDs are present.
- [ ] Trace IDs are present.
- [ ] Organization context is safely propagated.
- [ ] Job/Run correlation is supported.
- [ ] Metrics are emitted.
- [ ] Distributed traces are available for critical flows.
- [ ] API dashboards exist.
- [ ] Database dashboards exist.
- [ ] Queue dashboards exist.
- [ ] Worker dashboards exist.
- [ ] Lab connectivity dashboards exist.
- [ ] Result processing dashboards exist.
- [ ] Security dashboards exist.
- [ ] Alerts exist for critical failure conditions.
- [ ] Alert ownership is defined.
- [ ] Alert runbooks exist.

## 6.6 Availability

- [ ] API instances are stateless.
- [ ] Multiple application instances can operate concurrently.
- [ ] Load balancing is enabled.
- [ ] Health checks are configured.
- [ ] Unhealthy instances are removed from traffic.
- [ ] Workers can fail and recover.
- [ ] Queue supports durable processing.
- [ ] Database HA is configured.
- [ ] Object storage durability is verified.
- [ ] WebSocket reconnect is supported.
- [ ] Cloud dependency failures produce safe degradation.
- [ ] No single application instance is a required business-state authority.

## 6.7 Scalability

- [ ] API can scale horizontally.
- [ ] Worker concurrency is configurable.
- [ ] Queue depth is observable.
- [ ] Telemetry ingestion can scale independently where necessary.
- [ ] WebSocket capacity is measured.
- [ ] Database connection budget remains bounded.
- [ ] Storage growth is measurable.
- [ ] Capacity model exists.
- [ ] Autoscaling thresholds are documented.
- [ ] Noisy-neighbour controls exist where required.
- [ ] Production load test passes.

## 6.8 Performance

- [ ] API p95 targets are measured.
- [ ] API p99 behavior is measured.
- [ ] Booking contention is tested.
- [ ] Credit transaction contention is tested.
- [ ] Job queue latency is measured.
- [ ] Result processing latency is measured.
- [ ] Telemetry ingestion throughput is measured.
- [ ] WebSocket connection limits are measured.
- [ ] Large downloads are tested.
- [ ] Database saturation behavior is understood.
- [ ] Soak test passes.
- [ ] No unacceptable memory growth is observed.

## 6.9 Queue and Workers

- [ ] Queue messages are durable where required.
- [ ] Consumers are idempotent.
- [ ] Retry policies are explicit.
- [ ] Dead-letter handling exists.
- [ ] Worker heartbeat exists.
- [ ] Worker lease/claim is safe.
- [ ] Graceful shutdown exists.
- [ ] Duplicate messages do not corrupt state.
- [ ] Unsafe physical commands are not blindly retried.
- [ ] Queue backlog alerts exist.

## 6.10 WebSocket

- [ ] Connections are authenticated.
- [ ] Subscriptions are authorized.
- [ ] Tenant isolation applies.
- [ ] Heartbeats exist.
- [ ] Disconnect is detected.
- [ ] Reconnect is supported.
- [ ] Event sequence is supported.
- [ ] Duplicate events can be detected.
- [ ] Gaps can be detected.
- [ ] Backpressure is handled.
- [ ] Durable state remains authoritative.

## 6.11 Disaster Recovery

- [ ] Backup policy is documented.
- [ ] PITR is enabled.
- [ ] Backup monitoring exists.
- [ ] Restore runbook exists.
- [ ] Restore has been executed.
- [ ] RPO <=15 minutes is demonstrated or an approved exception exists.
- [ ] RTO <=4 hours is demonstrated or an approved exception exists.
- [ ] Object-storage recovery is tested.
- [ ] Configuration recovery is tested.
- [ ] Infrastructure recreation is tested.
- [ ] DR evidence is retained.
- [ ] DR drill findings are tracked.

## 6.12 Incident Response

- [ ] Severity model exists.
- [ ] Escalation policy exists.
- [ ] Incident commander role exists.
- [ ] Security incident procedure exists.
- [ ] Data-loss procedure exists.
- [ ] Database incident procedure exists.
- [ ] Lab connectivity incident procedure exists.
- [ ] Customer communication procedure exists.
- [ ] Evidence-preservation procedure exists.
- [ ] Postmortem process exists.
- [ ] Corrective actions are tracked.

## 6.13 Compliance

- [ ] Data classification exists.
- [ ] Access-control evidence exists.
- [ ] Audit evidence exists.
- [ ] Change-management evidence exists.
- [ ] Backup evidence exists.
- [ ] Restore evidence exists.
- [ ] Vulnerability evidence exists.
- [ ] Retention policy exists.
- [ ] Data deletion policy exists.
- [ ] Security incident evidence is retained.
- [ ] Compliance control mapping is documented.
- [ ] No unsupported certification claim is made.

## 6.14 Release Readiness

- [ ] Release branch/tag strategy is defined.
- [ ] CI gates are active.
- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] E2E tests pass.
- [ ] Security scans pass.
- [ ] Dependency scans pass.
- [ ] SBOM is generated.
- [ ] Build provenance is recorded.
- [ ] Database migrations are qualified.
- [ ] Staging deployment succeeds.
- [ ] Production deployment is automated.
- [ ] Rollback is tested.
- [ ] Smoke tests exist.
- [ ] Release evidence is archived.
- [ ] Production approval is explicit.

## 6.15 Physical Safety

- [ ] Cloud is not treated as physical safety authority.
- [ ] Lab Agent remains the local cloud-to-lab boundary.
- [ ] Runtime safety remains local.
- [ ] Emergency stop remains independent.
- [ ] Loss of cloud connectivity cannot silently command unsafe behavior.
- [ ] Automatic restart after uncertain physical state is prohibited unless
  explicitly safety-qualified.
- [ ] Physical deployment has separate safety approval.

---
