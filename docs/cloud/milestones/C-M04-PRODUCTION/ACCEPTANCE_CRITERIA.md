# C-M04-PRODUCTION — Acceptance Criteria

Milestone: C-M04-PRODUCTION — Production Environment and Go-Live

## 6 Acceptance criteria

### 6.1 Production environment

- [ ] Production account/project is provisioned.
- [ ] Production environment is independently isolated.
- [ ] Production resources are represented in IaC.
- [ ] Production naming is standardized.
- [ ] Resource ownership is documented.
- [ ] Environment configuration is version controlled.
- [ ] Manual changes are detectable.
- [ ] Production access is restricted.
- [ ] Production audit logging is enabled.

### 6.2 Network

- [ ] Production network is deployed.
- [ ] Private service networking is configured.
- [ ] PostgreSQL is not publicly exposed.
- [ ] Queue is not publicly exposed unnecessarily.
- [ ] Object storage is private by default.
- [ ] Administrative endpoints are restricted.
- [ ] Application ingress is controlled.
- [ ] Network rules are reviewed.
- [ ] Network monitoring is enabled.

### 6.3 DNS and TLS

- [ ] Production DNS is configured.
- [ ] TLS certificates are valid.
- [ ] Certificate renewal is automated or controlled.
- [ ] Certificate expiry is monitored.
- [ ] Public endpoints use approved TLS configuration.
- [ ] Internal service discovery is deterministic.

### 6.4 Compute HA

- [ ] API runs with redundant instances.
- [ ] API instances span failure domains where practical.
- [ ] Load balancing is configured.
- [ ] Health checks work.
- [ ] Failed API instances are removed from service.
- [ ] API replacement is automated or operationally documented.
- [ ] Worker capacity is redundant.
- [ ] Worker restart does not lose durable Job state.
- [ ] WebSocket service survives individual instance failure according to design.
- [ ] Application services are stateless with respect to authoritative business state.

### 6.5 Database HA

- [ ] PostgreSQL Production instance is provisioned.
- [ ] HA configuration is enabled where supported.
- [ ] Failover behavior is documented.
- [ ] Application reconnection behavior is tested.
- [ ] Connection pooling is bounded.
- [ ] Database health is monitored.
- [ ] Database saturation is monitored.
- [ ] Backup is enabled.
- [ ] PITR is enabled where supported.
- [ ] Restore has been tested.
- [ ] Failover has been rehearsed.
- [ ] Database migrations are controlled.

### 6.6 Object storage

- [ ] Production artifact storage exists.
- [ ] Production result storage exists.
- [ ] Large files use object storage.
- [ ] Objects are private.
- [ ] Authorization is enforced before access.
- [ ] Checksums are supported.
- [ ] Lifecycle rules are configured.
- [ ] Storage failures are observable.
- [ ] Production objects are isolated from other environments.

### 6.7 Queue

- [ ] Production queue exists.
- [ ] Queue is durable.
- [ ] Retry policy is configured.
- [ ] Dead-letter policy is configured.
- [ ] Queue backlog is monitored.
- [ ] Worker capacity responds to backlog.
- [ ] Duplicate delivery is handled safely.
- [ ] Queue recovery is tested.
- [ ] Queue is not authoritative business state.

### 6.8 Security

- [ ] Production IAM is least privilege.
- [ ] Service identities are separate.
- [ ] Production secrets are stored securely.
- [ ] Production keys are protected.
- [ ] Artifact signing keys are appropriately protected.
- [ ] Token-signing keys are separated from encryption keys.
- [ ] KMS/HSM-equivalent controls are used where required.
- [ ] Authentication is enabled.
- [ ] Authorization is enabled.
- [ ] Tenant isolation is verified.
- [ ] Audit logging is enabled.
- [ ] Security alerts are enabled.
- [ ] Production credentials are never present in lower environments.
- [ ] Security incident process exists.

### 6.9 Tenant isolation

- [ ] Organization is the primary tenant boundary.
- [ ] Tenant identity propagates through application operations.
- [ ] Repository filtering is enforced.
- [ ] Cross-tenant project access is denied.
- [ ] Cross-tenant artifact access is denied.
- [ ] Cross-tenant booking access is denied.
- [ ] Cross-tenant credit access is denied.
- [ ] Cross-tenant Job/Run access is denied.
- [ ] Cross-tenant Result access is denied.
- [ ] Object-storage tenant boundaries are enforced.
- [ ] Administrative exceptions are audited.

### 6.10 Scaling

- [ ] API scaling mechanism exists.
- [ ] Worker scaling mechanism exists.
- [ ] Scaling thresholds are documented.
- [ ] Queue depth can trigger worker scaling where supported.
- [ ] Database scaling strategy is documented.
- [ ] Connection budgets are documented.
- [ ] WebSocket scaling strategy is documented.
- [ ] Object storage scaling assumptions are documented.
- [ ] Capacity dashboards exist.
- [ ] Saturation alerts exist.
- [ ] Scaling tests pass.

### 6.11 Monitoring

- [ ] Availability dashboard exists.
- [ ] API latency dashboard exists.
- [ ] Error dashboard exists.
- [ ] Database dashboard exists.
- [ ] Queue dashboard exists.
- [ ] Worker dashboard exists.
- [ ] Object-storage dashboard exists.
- [ ] WebSocket dashboard exists.
- [ ] Lab dashboard exists.
- [ ] Job/Run dashboard exists.
- [ ] Booking/credit operational dashboard exists.
- [ ] Security dashboard exists.
- [ ] Cost dashboard exists.

### 6.12 Alerting

- [ ] Service outage alert exists.
- [ ] High-latency alert exists.
- [ ] High-error-rate alert exists.
- [ ] Database saturation alert exists.
- [ ] Queue backlog alert exists.
- [ ] Worker failure alert exists.
- [ ] Backup failure alert exists.
- [ ] Certificate expiry alert exists.
- [ ] Security alert exists.
- [ ] Lab disconnect alert exists.
- [ ] Resource fault alert exists.
- [ ] Financial anomaly alerting exists where required.
- [ ] Alerts have owners.
- [ ] Alerts have severity.
- [ ] Alerts have escalation paths.

### 6.13 Backup and DR

- [ ] Automated backups run.
- [ ] Backup success is monitored.
- [ ] PITR is available where supported.
- [ ] Restore is tested.
- [ ] DR runbook exists.
- [ ] DR dependencies are documented.
- [ ] DR rehearsal is completed.
- [ ] RPO is measured.
- [ ] RTO is measured.
- [ ] RPO <= 15 minutes target is evaluated.
- [ ] RTO <= 4 hours target is evaluated.
- [ ] Data integrity after restore is verified.
- [ ] Application recovery is verified.
- [ ] Lab connectivity recovery is verified.

### 6.14 Change management

- [ ] Normal change process exists.
- [ ] Emergency change process exists.
- [ ] Changes are traceable.
- [ ] Production infrastructure changes require review.
- [ ] Database changes require review.
- [ ] Security changes require review.
- [ ] Release changes require approval.
- [ ] Emergency changes are retrospectively reviewed.
- [ ] Rollback strategy exists for material changes.
- [ ] Change evidence is retained.

### 6.15 Release management

- [ ] Production release requires Staging qualification.
- [ ] Release artifact is immutable.
- [ ] Release provenance is recorded.
- [ ] Release version is recorded.
- [ ] Git commit is recorded.
- [ ] Database migration version is recorded.
- [ ] Infrastructure version is recorded.
- [ ] Deployment operator/automation identity is recorded.
- [ ] Deployment outcome is recorded.
- [ ] Rollback is tested.
- [ ] Release notes are prepared.

### 6.16 Go-live

- [ ] Go-Live Checklist is complete.
- [ ] Production Readiness Review is complete.
- [ ] Security approval is complete.
- [ ] Database readiness is complete.
- [ ] Backup readiness is complete.
- [ ] Monitoring readiness is complete.
- [ ] On-call readiness is complete.
- [ ] Lab readiness is complete.
- [ ] Customer-support readiness is complete where applicable.
- [ ] Rollback plan is approved.
- [ ] Communication plan is approved.
- [ ] Go-live decision is recorded.
- [ ] Controlled rollout succeeds.
- [ ] Post-go-live smoke tests pass.
- [ ] No critical incident is active at launch completion.

### 6.17 Operational readiness

- [ ] On-call ownership exists.
- [ ] Escalation contacts exist.
- [ ] Incident severity model exists.
- [ ] Incident runbook exists.
- [ ] Security incident runbook exists.
- [ ] Database recovery runbook exists.
- [ ] Lab failure runbook exists.
- [ ] Deployment runbook exists.
- [ ] Rollback runbook exists.
- [ ] Capacity runbook exists.
- [ ] Cost runbook exists.

### 6.18 Financial integrity

- [ ] Credit wallet is authoritative.
- [ ] Credit ledger is append-oriented/immutable according to design.
- [ ] Credit reservations are transactional.
- [ ] Credit consumption is idempotent.
- [ ] Refunds are auditable.
- [ ] Payment callbacks are idempotent.
- [ ] Financial reconciliation is available.
- [ ] Financial anomalies are observable.
- [ ] Booking/credit state cannot silently diverge.

### 6.19 Physical safety

- [ ] Local robot safety authority is documented.
- [ ] Lab Agent safety boundary is documented.
- [ ] Cloud disconnect behavior is documented.
- [ ] Software Stop is distinguished from emergency stop.
- [ ] Emergency stop remains local.
- [ ] Physical robot activation requires approved safety review.
- [ ] No automatic unsafe restart is enabled.
- [ ] Physical robot fault handling is documented.

### 6.20 No-go conditions

Production launch shall not proceed if:

- [ ] unresolved critical security vulnerability exists;
- [ ] tenant isolation is broken;
- [ ] financial integrity cannot be demonstrated;
- [ ] backup/restore is unverified;
- [ ] RPO/RTO recovery path is untested;
- [ ] rollback is unavailable;
- [ ] release provenance is missing;
- [ ] monitoring is insufficient;
- [ ] on-call ownership is absent;
- [ ] critical database migration is unsafe;
- [ ] physical safety authority is ambiguous;
- [ ] critical Lab Agent failure behavior is undefined.

---
