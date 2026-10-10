# C-M03-STAGING — Acceptance Criteria

Milestone: C-M03-STAGING — Production-Parity Staging Environment

## 6 Acceptance criteria

### 6.1 Environment isolation

- [ ] Staging has a unique environment identity.
- [ ] Staging is isolated from Development.
- [ ] Staging is isolated from Production.
- [ ] Staging database is separate.
- [ ] Staging object storage is separate.
- [ ] Staging queue is separate.
- [ ] Staging secrets are separate.
- [ ] Staging service identities are separate.
- [ ] Staging Lab Agent identity is separate.
- [ ] Production credentials cannot be used by Staging services.
- [ ] Staging data is synthetic or explicitly approved.

### 6.2 Production parity

- [ ] Application architecture matches Production architecture.
- [ ] API deployment model matches Production.
- [ ] Worker deployment model matches Production.
- [ ] PostgreSQL engine/version matches Production target.
- [ ] Migration mechanism matches Production.
- [ ] Queue semantics match Production.
- [ ] Object-storage semantics match Production.
- [ ] Authentication path matches Production.
- [ ] Authorization path matches Production.
- [ ] Secret injection model matches Production.
- [ ] KMS/key-management model is equivalent.
- [ ] Network trust boundaries match Production.
- [ ] Observability model matches Production.
- [ ] Lab Protocol matches Production.
- [ ] Artifact format matches Production.
- [ ] Deployment pipeline matches Production.
- [ ] Rollback strategy matches Production.
- [ ] Differences are documented and formally reviewed.

### 6.3 Deployment

- [ ] Release candidate is traceable to Git commit.
- [ ] Build artifact is immutable.
- [ ] Deployment is automated.
- [ ] Deployment is authenticated.
- [ ] Deployment authorization is enforced.
- [ ] Database migrations are controlled.
- [ ] Deployment health checks execute.
- [ ] Smoke tests execute.
- [ ] Deployment evidence is retained.
- [ ] Failed deployment is clearly reported.
- [ ] Rollback is tested.
- [ ] Deployment cannot silently report success after failed health checks.

### 6.4 Database

- [ ] Staging PostgreSQL is operational.
- [ ] Database version is documented.
- [ ] Database configuration differences from Production are documented.
- [ ] Representative synthetic dataset exists.
- [ ] Migration baseline is reproducible.
- [ ] Migration failure is handled safely.
- [ ] Backup succeeds.
- [ ] Restore succeeds.
- [ ] Restored data passes integrity checks.
- [ ] Database connection pool remains bounded.
- [ ] Database performance is measured.
- [ ] Slow queries are observable.
- [ ] Connection saturation is observable.
- [ ] Destructive migrations are explicitly reviewed.

### 6.5 Object storage

- [ ] Artifact storage works.
- [ ] Result storage works.
- [ ] Video/recording storage works where enabled.
- [ ] Storage is private.
- [ ] Tenant authorization is enforced.
- [ ] Checksums are validated.
- [ ] Large-object operations are tested.
- [ ] Expired/invalid object access is rejected.
- [ ] Lifecycle policy is verified.
- [ ] Storage failure behavior is understood.

### 6.6 Queue and workers

- [ ] Queue is durable.
- [ ] Worker consumption is operational.
- [ ] Retry policy is documented.
- [ ] Dead-letter behavior is tested.
- [ ] Duplicate delivery is tolerated.
- [ ] Worker restart is safe.
- [ ] Queue backlog is observable.
- [ ] Worker concurrency is bounded.
- [ ] Job state remains authoritative in PostgreSQL.
- [ ] Failed jobs can be diagnosed.
- [ ] Reconciliation can identify inconsistent queue/domain state.

### 6.7 Security

- [ ] Authentication tests pass.
- [ ] Authorization tests pass.
- [ ] Tenant-isolation tests pass.
- [ ] API security tests pass.
- [ ] Object-storage authorization tests pass.
- [ ] Database exposure tests pass.
- [ ] Network exposure tests pass.
- [ ] TLS tests pass.
- [ ] WebSocket authorization tests pass.
- [ ] Lab Agent authentication tests pass.
- [ ] Secret scanning passes.
- [ ] Dependency scanning passes.
- [ ] Image scanning passes where applicable.
- [ ] Artifact integrity verification passes.
- [ ] Artifact signature verification passes.
- [ ] Audit events are generated.
- [ ] Security findings have disposition.
- [ ] No unresolved critical security vulnerability remains without formal risk acceptance.

### 6.8 Performance

- [ ] Performance workload definitions are version controlled.
- [ ] Representative datasets are prepared.
- [ ] API load test completes.
- [ ] Database load test completes.
- [ ] Queue/worker load test completes.
- [ ] Artifact transfer test completes.
- [ ] Result retrieval test completes.
- [ ] WebSocket load test completes.
- [ ] Concurrent execution test completes.
- [ ] Booking contention test completes.
- [ ] Credit transaction contention test completes.
- [ ] Performance bottlenecks are documented.
- [ ] Resource saturation thresholds are documented.
- [ ] No unexplained critical performance regression remains.

### 6.9 Initial performance qualification targets

The following are target engineering thresholds and shall be finalized before formal qualification:

| Metric | Initial target |
|---|---:|
| API read p95 | < 500 ms |
| API write p95 | < 750 ms |
| Booking operation p95 | < 1 s excluding external dependencies |
| Credit operation p95 | < 1 s |
| Result query p95 | < 500 ms |
| Health p95 | < 200 ms |
| Queue publish p95 | < 500 ms |
| Normal API error rate | < 1% |
| Sustained DB CPU | < 70% |
| Sustained worker saturation | < 80% |
| WebSocket reconnect success | > 99% under test conditions |

These values are qualification targets and shall not be interpreted as final Production SLA commitments.

### 6.10 Lab connectivity

- [ ] Staging Lab Agent is independently identified.
- [ ] Authentication works.
- [ ] Registration works.
- [ ] Heartbeat works.
- [ ] Resource inventory works.
- [ ] Artifact validation works.
- [ ] Artifact deployment works.
- [ ] Job dispatch works.
- [ ] Run startup works.
- [ ] Run status works.
- [ ] Logs work.
- [ ] Telemetry works where implemented.
- [ ] Result collection works.
- [ ] Disconnect detection works.
- [ ] Reconnect works.
- [ ] Duplicate execution is prevented.
- [ ] Local safety authority is preserved.

### 6.11 Disaster recovery

- [ ] DR scenario is documented.
- [ ] Failure injection is approved.
- [ ] PostgreSQL restore succeeds.
- [ ] Application redeployment succeeds.
- [ ] Configuration is recoverable.
- [ ] Required secrets are recoverable.
- [ ] Object-storage recovery assumptions are validated.
- [ ] Queue recovery is validated.
- [ ] DNS/TLS recovery procedure is validated where required.
- [ ] Lab connectivity is recoverable.
- [ ] Data integrity is verified.
- [ ] RPO is measured.
- [ ] RTO is measured.
- [ ] Gaps are documented.
- [ ] Corrective actions are assigned.

### 6.12 DR targets

The initial platform target remains:

- RPO <= 15 minutes;
- RTO <= 4 hours.

These are platform-level targets carried from the architecture baseline.

Staging shall measure actual recovery performance rather than merely documenting theoretical values.

### 6.13 Observability

- [ ] API logs are centralized.
- [ ] Worker logs are centralized.
- [ ] Database metrics are available.
- [ ] Queue metrics are available.
- [ ] Object-storage errors are observable.
- [ ] Application metrics are available.
- [ ] Distributed tracing is available where implemented.
- [ ] Lab Agent status is visible.
- [ ] Request IDs are preserved.
- [ ] Job IDs are searchable.
- [ ] Run IDs are searchable.
- [ ] Audit events are searchable.
- [ ] Performance dashboards exist.
- [ ] Security dashboards exist.
- [ ] DR evidence is captured.

### 6.14 Release qualification

- [ ] Release candidate has a unique identifier.
- [ ] Release candidate source is known.
- [ ] Dependencies are known.
- [ ] Database migration level is known.
- [ ] Infrastructure version is known.
- [ ] All mandatory automated tests pass.
- [ ] Security qualification passes.
- [ ] Performance qualification passes.
- [ ] DR rehearsal passes.
- [ ] Lab qualification passes.
- [ ] Rollback qualification passes.
- [ ] Known issues are documented.
- [ ] Residual risks are reviewed.
- [ ] Production recommendation is explicitly recorded.

### 6.15 No-go conditions

Staging qualification shall fail if any of the following occurs:

- [ ] critical security vulnerability remains unresolved without approved exception;
- [ ] tenant isolation failure exists;
- [ ] Production credentials are accessible from Staging;
- [ ] artifact integrity can be bypassed;
- [ ] database migration corrupts authoritative data;
- [ ] rollback cannot be performed safely;
- [ ] DR cannot restore required authoritative data;
- [ ] physical safety authority is ambiguous;
- [ ] critical execution lifecycle state cannot be reconstructed;
- [ ] release provenance is missing;
- [ ] critical observability is absent;
- [ ] critical performance regression remains unexplained;
- [ ] release candidate differs from tested artifact.

---
