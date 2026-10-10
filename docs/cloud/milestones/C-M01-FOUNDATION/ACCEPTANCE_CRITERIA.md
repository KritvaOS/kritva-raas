# C-M01-FOUNDATION — Acceptance Criteria

Milestone: C-M01 — Cloud Foundation

# 6 Acceptance Criteria

## 6.1 Account and Environment

- [ ] Cloud account/project hierarchy is documented.
- [ ] Environment boundaries are documented.
- [ ] Development is isolated from Production.
- [ ] Staging is production-like but uses non-production data.
- [ ] Production access is restricted.
- [ ] Resource naming is consistent.
- [ ] Resource tags/labels are consistent.
- [ ] Ownership is identifiable.
- [ ] Cost attribution is possible.

## 6.2 Infrastructure as Code

- [ ] All foundational resources are defined in IaC.
- [ ] IaC repository structure is documented.
- [ ] IaC state is remote.
- [ ] IaC state is protected.
- [ ] IaC state is encrypted.
- [ ] Environment state is isolated.
- [ ] IaC validation runs in CI.
- [ ] IaC plan runs in CI.
- [ ] IaC apply is controlled.
- [ ] Production apply requires approval.
- [ ] Drift detection exists.
- [ ] Manual changes are detectable.
- [ ] IaC documentation exists.
- [ ] Resource deletion protection is enabled where appropriate.

## 6.3 Networking

- [ ] Network topology is documented.
- [ ] Public and private resources are separated.
- [ ] Application workloads have controlled ingress.
- [ ] Database is not publicly exposed.
- [ ] Queue is not publicly exposed.
- [ ] Sensitive storage is not publicly exposed.
- [ ] Firewall/security-group rules are least privilege.
- [ ] Egress policy exists.
- [ ] Administrative access is restricted.
- [ ] Lab connectivity has an explicit boundary.
- [ ] Network changes are auditable.

## 6.4 DNS and TLS

- [ ] DNS ownership is defined.
- [ ] Environment DNS names are documented.
- [ ] Production TLS is enabled.
- [ ] Certificate management is automated where possible.
- [ ] Certificate expiration is monitored.
- [ ] Private keys are not stored in source.
- [ ] Certificate rotation is tested.
- [ ] HTTP-to-HTTPS policy is defined.

## 6.5 IAM

- [ ] Human roles are defined.
- [ ] Service roles are defined.
- [ ] CI/CD identity is defined.
- [ ] Workload identity is defined.
- [ ] Lab identity is defined.
- [ ] Least privilege is applied.
- [ ] Production privileges are separated.
- [ ] MFA is required for privileged human access.
- [ ] Shared administrative accounts are prohibited.
- [ ] Access changes are audited.
- [ ] Periodic access review exists.
- [ ] Break-glass access is controlled and audited.

## 6.6 Secrets

- [ ] Secret provider is integrated.
- [ ] Development secrets are isolated.
- [ ] Staging secrets are isolated.
- [ ] Production secrets are isolated.
- [ ] Secrets are not committed.
- [ ] Secrets are not baked into images.
- [ ] Secrets are not logged.
- [ ] Secret access is least privilege.
- [ ] Secret rotation is supported.
- [ ] Secret revocation is supported.
- [ ] Secret access is auditable where supported.

## 6.7 Keys

- [ ] KMS integration exists.
- [ ] Encryption keys are environment-specific.
- [ ] Signing keys are purpose-specific.
- [ ] Token keys are separate from artifact-signing keys.
- [ ] Critical keys are protected.
- [ ] Key rotation policy exists.
- [ ] Key revocation policy exists.
- [ ] Key access is auditable.
- [ ] Production critical keys are not freely exportable.

## 6.8 CI/CD

- [ ] CI validates source.
- [ ] CI validates IaC.
- [ ] CI performs security scanning.
- [ ] CI generates deployment evidence.
- [ ] CI uses controlled cloud identity.
- [ ] Development deployment is automated.
- [ ] Staging deployment is controlled.
- [ ] Production deployment has approval.
- [ ] Long-lived cloud credentials are avoided.
- [ ] Deployment logs are retained.
- [ ] Failed deployment is visible.

## 6.9 Observability

- [ ] Cloud metrics are collected.
- [ ] Infrastructure logs are collected.
- [ ] Audit logs are collected.
- [ ] Resource health is visible.
- [ ] Database health is visible.
- [ ] Queue health is visible.
- [ ] Storage health is visible.
- [ ] Certificate status is visible.
- [ ] Deployment status is visible.
- [ ] Base dashboards exist.
- [ ] Base alerts exist.
- [ ] Alert ownership is defined.

## 6.10 Cost Management

- [ ] Resources have cost attribution.
- [ ] Environment costs are distinguishable.
- [ ] Budget thresholds exist.
- [ ] Cost alerts exist.
- [ ] Unexpected cost growth is detectable.
- [ ] Production workloads are not automatically terminated by cost controls
  without explicit policy.

## 6.11 Database Foundation

- [ ] PostgreSQL production substrate exists.
- [ ] Database is private.
- [ ] Database TLS is enabled.
- [ ] Database credentials use secret management.
- [ ] Backup policy exists.
- [ ] Restore procedure exists.
- [ ] Connection limits are documented.
- [ ] Database monitoring exists.

## 6.12 Object Storage

- [ ] Object storage exists per required environment.
- [ ] Production storage is private.
- [ ] Encryption is enabled.
- [ ] Access is least privilege.
- [ ] Lifecycle policy exists.
- [ ] Storage usage is monitored.
- [ ] Public access is disabled by default.

## 6.13 Queue

- [ ] Queue infrastructure exists.
- [ ] Queue access is restricted.
- [ ] Queue credentials use workload identity/secret management.
- [ ] Durability policy is defined.
- [ ] Retry/dead-letter capability is available where required.
- [ ] Queue metrics exist.

## 6.14 Recovery

- [ ] IaC state recovery is documented.
- [ ] Database recovery is documented.
- [ ] Object storage recovery is documented.
- [ ] Secret recovery process exists.
- [ ] DNS recovery is documented.
- [ ] Certificate recovery is documented.
- [ ] Infrastructure recreation is tested.
- [ ] Recovery ownership is assigned.

## 6.15 Security

- [ ] IaC security scan passes.
- [ ] IAM review passes.
- [ ] Network review passes.
- [ ] Secret review passes.
- [ ] Cloud audit logging is enabled.
- [ ] Public exposure scan passes.
- [ ] Critical findings are resolved or formally accepted.
- [ ] Security evidence is retained.

---
