# PHASE-8-PRODUCTION — Acceptance Criteria

Milestone: PHASE-8-PRODUCTION — Production Hardening, Scale and Launch Readiness

## 6 Acceptance criteria

### 6.1 Production environment

- [ ] Production environment is isolated.
- [ ] Production credentials are unique.
- [ ] Production secrets are managed securely.
- [ ] Production database is private.
- [ ] Object storage is private.
- [ ] Queue is protected.
- [ ] TLS is enabled.
- [ ] DNS is controlled.
- [ ] Edge protection is enabled.
- [ ] Production configuration is versioned.
- [ ] Infrastructure is reproducible.

### 6.2 Application availability

- [ ] Multiple application instances can run.
- [ ] Load balancing works.
- [ ] Health checks work.
- [ ] Unhealthy instances are removed.
- [ ] Deployment does not require persistent local state.
- [ ] Graceful shutdown works.
- [ ] Restart recovery works.
- [ ] Application rollback works.

### 6.3 Authentication

- [ ] Production authentication is enabled.
- [ ] MFA policy is enforced where required.
- [ ] Session expiration works.
- [ ] Refresh-token rotation works.
- [ ] Token revocation works.
- [ ] Account lockout/rate limiting works.
- [ ] Recovery flow is protected.
- [ ] Service identities are separated from users.
- [ ] Lab Agent identities are unique.

### 6.4 Authorization

- [ ] Deny-by-default policy is enforced.
- [ ] Organization boundary is enforced.
- [ ] Project boundary is enforced.
- [ ] Platform permissions are enforced.
- [ ] Lab permissions are enforced.
- [ ] Resource permissions are enforced.
- [ ] Artifact permissions are enforced.
- [ ] Booking permissions are enforced.
- [ ] Credit permissions are enforced.
- [ ] Job permissions are enforced.
- [ ] Run permissions are enforced.
- [ ] Result permissions are enforced.
- [ ] Administrative permissions are separated.
- [ ] Privilege escalation tests pass.

### 6.5 Tenant isolation

- [ ] API tenant isolation passes.
- [ ] Application tenant isolation passes.
- [ ] Repository tenant isolation passes.
- [ ] Database tenant isolation passes.
- [ ] Object storage tenant isolation passes.
- [ ] WebSocket tenant isolation passes.
- [ ] WebRTC tenant isolation passes.
- [ ] Results tenant isolation passes.
- [ ] Audit tenant access is controlled.
- [ ] Cross-tenant automated tests pass.

### 6.6 Source-code privacy

- [ ] Source code remains local.
- [ ] Studio does not upload source.
- [ ] Local Runtime does not upload source.
- [ ] Artifact package contains no unintended source.
- [ ] Logs contain no source by default.
- [ ] Telemetry contains no source by default.
- [ ] Crash diagnostics contain no source by default.
- [ ] Network egress testing passes.
- [ ] Privacy review is complete.

### 6.7 Artifact security

- [ ] Production artifacts are signed.
- [ ] Signatures are independently verified.
- [ ] Checksums are verified.
- [ ] Revoked artifacts are rejected.
- [ ] Expired artifacts are rejected where required.
- [ ] Incompatible artifacts are rejected.
- [ ] Capability policy is enforced.
- [ ] Artifact provenance is recorded.
- [ ] Signing keys are protected.
- [ ] Signing events are auditable.

### 6.8 Secrets

- [ ] No production secret is committed.
- [ ] Secrets are centrally managed.
- [ ] Secrets are encrypted at rest.
- [ ] Secrets are protected in transit.
- [ ] Secrets are injected only where required.
- [ ] Secret access is audited.
- [ ] Rotation is tested.
- [ ] Revocation is tested.
- [ ] Break-glass access is controlled.

### 6.9 Key management

- [ ] Production keys have defined ownership.
- [ ] Signing keys are protected.
- [ ] Token-signing keys are separated.
- [ ] Encryption keys are separated.
- [ ] CA keys are separated.
- [ ] Key rotation is documented.
- [ ] Key revocation is tested.
- [ ] High-value keys are non-exportable where practical.
- [ ] Key access is audited.

### 6.10 Database

- [ ] Production PostgreSQL is HA-capable.
- [ ] Backups run automatically.
- [ ] PITR is enabled where supported.
- [ ] Restore is tested.
- [ ] Indexes are validated.
- [ ] Query plans are reviewed.
- [ ] Connection pools are bounded.
- [ ] Long transactions are detected.
- [ ] Lock contention is monitored.
- [ ] Database migrations are controlled.

### 6.11 Database partitioning

- [ ] High-volume candidates are measured.
- [ ] Partitioning is justified by evidence.
- [ ] Partition keys are documented.
- [ ] Partition creation is automated.
- [ ] Partition retention is automated.
- [ ] Queries use appropriate partition constraints.
- [ ] Partition maintenance is monitored.
- [ ] Partition failure procedures exist.

### 6.12 Database recovery

- [ ] Backup completion is monitored.
- [ ] Backup integrity is tested.
- [ ] Point-in-time restore is tested.
- [ ] Restore time is measured.
- [ ] RPO <=15 minutes is demonstrated or formally accepted.
- [ ] RTO <=4 hours is demonstrated or formally accepted.
- [ ] Recovery ownership is defined.
- [ ] Recovery runbook exists.

### 6.13 Object storage

- [ ] Object storage is private.
- [ ] Encryption is enabled.
- [ ] Access is tenant controlled.
- [ ] Lifecycle rules are active.
- [ ] Checksums are recorded.
- [ ] Reconciliation is implemented.
- [ ] Orphan detection works.
- [ ] Orphan cleanup is controlled.
- [ ] Retention policy is enforced.

### 6.14 Queue and workers

- [ ] Queue is durable.
- [ ] Queue authentication is enabled.
- [ ] Retry policy is defined.
- [ ] Dead-letter handling exists.
- [ ] Worker idempotency is enforced.
- [ ] Worker heartbeat is available where required.
- [ ] Worker concurrency is bounded.
- [ ] Queue backlog is monitored.
- [ ] Queue recovery is tested.

### 6.15 API performance

Initial targets:

| Operation | Target |
|---|---:|
| API read | p95 < 500 ms |
| API write | p95 < 750 ms |
| Booking operation | p95 < 1 s excluding external dependencies |
| Credit operation | p95 < 1 s |
| Result retrieval | p95 < 500 ms |
| Download authorization | p95 < 500 ms |
| Health endpoint | p95 < 200 ms |

- [ ] Targets are measured in staging.
- [ ] Production baseline is measured.
- [ ] Regression thresholds are defined.

### 6.16 Scalability

- [ ] API scales horizontally.
- [ ] Workers scale horizontally.
- [ ] WebSocket infrastructure scales.
- [ ] WebRTC infrastructure scales within target.
- [ ] Telemetry ingestion scales.
- [ ] Result processing scales.
- [ ] Database capacity is measured.
- [ ] Object storage capacity is measured.
- [ ] Queue throughput is measured.
- [ ] Capacity thresholds are documented.

### 6.17 Observability

- [ ] Structured application logs exist.
- [ ] Metrics exist.
- [ ] Distributed traces exist where appropriate.
- [ ] Audit logs exist.
- [ ] Dashboards exist.
- [ ] Alerts exist.
- [ ] Correlation IDs exist.
- [ ] Health checks exist.
- [ ] Dependency health is visible.
- [ ] Lab health is visible.
- [ ] Robot fleet health is visible.

### 6.18 Alerting

Alerts exist for:

- [ ] API error rate.
- [ ] API latency.
- [ ] database health.
- [ ] database connection exhaustion.
- [ ] queue backlog.
- [ ] worker failure.
- [ ] object-storage failure.
- [ ] WebSocket failure.
- [ ] WebRTC failure.
- [ ] Lab Agent disconnect.
- [ ] artifact validation failure spikes.
- [ ] booking failure spikes.
- [ ] payment/reconciliation failure.
- [ ] security events.
- [ ] backup failure.

### 6.19 Audit

- [ ] Security-sensitive actions are audited.
- [ ] Administrative actions are audited.
- [ ] Financial actions are audited.
- [ ] Booking changes are audited.
- [ ] Artifact operations are audited.
- [ ] Physical execution actions are audited.
- [ ] Safety events are audited.
- [ ] Audit access is controlled.
- [ ] Audit retention is defined.
- [ ] Audit integrity is protected.

### 6.20 Financial integrity

- [ ] Ledger transactions remain balanced.
- [ ] Wallet and ledger remain consistent.
- [ ] Credit reservations are idempotent.
- [ ] Consumption is idempotent.
- [ ] Refunds are idempotent.
- [ ] Payment callbacks are idempotent.
- [ ] Historical rates remain immutable.
- [ ] Financial reconciliation passes.
- [ ] No negative balance can occur outside approved policy.

### 6.21 Booking integrity

- [ ] Active resource overlap is impossible.
- [ ] Booking authorization works.
- [ ] Credit reservation is atomic.
- [ ] Resource allocation is reconciled.
- [ ] Cancellation policy works.
- [ ] Robot fault policy works.
- [ ] Booking history is retained.
- [ ] Concurrent booking tests pass.

### 6.22 Lab and robot

- [ ] Lab Agent identity is valid.
- [ ] Lab Agent reconnect works.
- [ ] Robot state is reported.
- [ ] Resource state is reported.
- [ ] Safety state remains local.
- [ ] E-stop remains local.
- [ ] Cloud cannot bypass safety.
- [ ] Cloud failure does not create unsafe authority.
- [ ] Physical recovery procedure is documented.

### 6.23 Live operations

- [ ] Video authorization works.
- [ ] WebRTC operates within target.
- [ ] Telemetry freshness works.
- [ ] WebSocket reconnect works.
- [ ] Live state is never treated as durable truth.
- [ ] Stale state is visible.
- [ ] Video failure does not change execution truth.
- [ ] Result creation is reliable.

### 6.24 Results

- [ ] Result lifecycle works.
- [ ] Result Files work.
- [ ] Metrics work.
- [ ] Experiments work.
- [ ] Comparisons work.
- [ ] Downloads work.
- [ ] Reruns work.
- [ ] Retention works.
- [ ] Object reconciliation works.
- [ ] Historical Runs remain immutable.

### 6.25 CI/CD

- [ ] Pull requests require CI.
- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] E2E tests pass.
- [ ] Security scanning passes.
- [ ] Dependency scanning passes.
- [ ] SBOM is generated.
- [ ] Build provenance exists.
- [ ] Production deployment is controlled.
- [ ] Rollback is tested.

### 6.26 Migration safety

- [ ] Migrations are version controlled.
- [ ] Migrations are reviewed.
- [ ] Expand-contract is used where required.
- [ ] Long migrations are identified.
- [ ] Backfills are resumable.
- [ ] Backfills are monitored.
- [ ] Rollback/forward strategy is documented.
- [ ] Production migration drill passes.

### 6.27 Disaster recovery

- [ ] Infrastructure recovery procedure exists.
- [ ] Database recovery exists.
- [ ] Object storage recovery exists.
- [ ] Queue recovery exists.
- [ ] Secrets recovery exists.
- [ ] DNS recovery exists.
- [ ] Application redeployment is reproducible.
- [ ] DR drill passes.

### 6.28 Incident response

- [ ] Severity model exists.
- [ ] On-call owner exists.
- [ ] Escalation matrix exists.
- [ ] Incident commander role exists.
- [ ] Security incident process exists.
- [ ] Data incident process exists.
- [ ] Physical safety incident process exists.
- [ ] Customer communication process exists.
- [ ] Post-incident review process exists.

### 6.29 Support readiness

- [ ] Customer support workflow exists.
- [ ] Production issue classification exists.
- [ ] Run lookup procedure exists.
- [ ] Artifact lookup exists.
- [ ] Booking lookup exists.
- [ ] Credit lookup exists.
- [ ] Result lookup exists.
- [ ] Audit lookup is appropriately restricted.
- [ ] Escalation to engineering exists.

### 6.30 Release readiness

- [ ] Release candidate is built.
- [ ] Release notes exist.
- [ ] Known issues are documented.
- [ ] Security gates pass.
- [ ] Performance gates pass.
- [ ] DR gates pass.
- [ ] Safety gates pass.
- [ ] Operational gates pass.
- [ ] Rollback is verified.
- [ ] Go/no-go review is complete.

### 6.31 Launch gates

No launch stage may proceed if:

- [ ] critical security vulnerability remains;
- [ ] tenant isolation is unproven;
- [ ] source privacy is unproven;
- [ ] financial reconciliation fails;
- [ ] database recovery is unproven;
- [ ] physical safety gate is open;
- [ ] critical monitoring is missing;
- [ ] rollback is unavailable;
- [ ] critical incident response is undefined.

---
