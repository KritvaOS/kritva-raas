# C-M02-DEVELOPMENT — Acceptance Criteria

Milestone: C-M02-DEVELOPMENT — Shared Development Environment

## 6 Acceptance criteria

### 6.1 Environment foundation

- [ ] Development environment has a unique environment identifier.
- [ ] Development resources are isolated from Production.
- [ ] Development configuration is version controlled.
- [ ] Critical Development resources are managed through IaC.
- [ ] Manual changes are detectable.
- [ ] Environment inventory is documented.
- [ ] Resource ownership is documented.
- [ ] Resource naming follows the approved convention.
- [ ] Development region/zone strategy is documented.
- [ ] Development cost ownership is identified.

### 6.2 Network

- [ ] Private services are not directly exposed to the public Internet.
- [ ] PostgreSQL is reachable only through approved network paths.
- [ ] Queue endpoints are protected.
- [ ] Object storage is private by default.
- [ ] Application ingress is limited to required endpoints.
- [ ] Administrative access is controlled.
- [ ] Lab connectivity uses the approved secure boundary.
- [ ] Network rules are represented in IaC.
- [ ] Network changes are reviewable.

### 6.3 DNS and TLS

- [ ] Development DNS names resolve correctly.
- [ ] TLS is enabled for externally reachable endpoints.
- [ ] Certificate lifecycle is automated or operationally documented.
- [ ] HTTP is redirected or rejected where appropriate.
- [ ] Internal service names are deterministic.
- [ ] Certificate errors are observable.
- [ ] No production certificate/private key is reused improperly.

### 6.4 Compute

- [ ] API deployment target exists.
- [ ] Worker deployment target exists.
- [ ] Application instances are replaceable.
- [ ] Application instances do not depend on local persistent state.
- [ ] Health endpoint is available.
- [ ] Readiness endpoint is available.
- [ ] Startup failure is visible.
- [ ] Application restart does not corrupt authoritative state.
- [ ] Worker restart does not silently lose durable jobs.
- [ ] Resource limits are defined.
- [ ] Environment variables do not contain plaintext restricted secrets.

### 6.5 PostgreSQL

- [ ] Development PostgreSQL exists.
- [ ] Database is isolated from other environments.
- [ ] Application access uses restricted credentials.
- [ ] Migration access is separately controlled.
- [ ] Administrative access is restricted.
- [ ] PostgreSQL monitoring is enabled.
- [ ] Connection limits are configured.
- [ ] Application connection pooling is bounded.
- [ ] Initial schema migrations execute successfully.
- [ ] Existing migrations are repeatable.
- [ ] Migration failure prevents unsafe deployment progression.
- [ ] Backup is enabled.
- [ ] Restore has been tested.
- [ ] Database credentials are retrieved through the approved secret mechanism.
- [ ] Database is not publicly reachable.
- [ ] Development data contains no uncontrolled Production data.

### 6.6 Object storage

- [ ] Artifact storage exists.
- [ ] Result storage exists.
- [ ] Required temporary storage exists.
- [ ] Buckets/namespaces are private.
- [ ] Application identities have minimum required access.
- [ ] Object ownership is represented by application metadata.
- [ ] Object checksums can be validated.
- [ ] Artifact upload works.
- [ ] Artifact download authorization works.
- [ ] Result-file upload works.
- [ ] Result-file download authorization works.
- [ ] Unauthorized object access is rejected.
- [ ] Storage lifecycle policy is configured.
- [ ] Development storage is separate from Production storage.

### 6.7 Queue

- [ ] Development queue exists.
- [ ] Queue access is authenticated.
- [ ] Publish works.
- [ ] Consume works.
- [ ] Acknowledgement works.
- [ ] Retry policy is defined.
- [ ] Dead-letter behavior is defined.
- [ ] Duplicate delivery is tolerated by consumers.
- [ ] Message correlation identifiers are retained.
- [ ] Queue metrics are visible.
- [ ] Queue is not treated as the source of business truth.
- [ ] Job state remains authoritative in PostgreSQL.

### 6.8 Secrets

- [ ] Development secrets are stored in the approved secret system.
- [ ] Secrets are not committed to Git.
- [ ] Secrets are not embedded in container images.
- [ ] Secrets are not written to normal logs.
- [ ] Runtime secret injection works.
- [ ] Service identities receive only required secrets.
- [ ] Secret rotation can be performed without redesign.
- [ ] Development secrets cannot authenticate to Production.
- [ ] Production signing keys are not present in Development.
- [ ] Production database credentials are not present in Development.

### 6.9 CI/CD

- [ ] Repository CI executes automatically.
- [ ] Formatting checks execute.
- [ ] Lint checks execute.
- [ ] Type checks execute where applicable.
- [ ] Unit tests execute.
- [ ] Integration tests execute.
- [ ] Security checks execute.
- [ ] Build artifacts are versioned.
- [ ] Development deployment is automated.
- [ ] Deployment identifies commit SHA.
- [ ] Deployment identifies environment.
- [ ] Deployment records timestamp.
- [ ] Deployment result is retained.
- [ ] Failed deployment is visible.
- [ ] Rollback is documented and tested.
- [ ] Database migration stage is controlled.
- [ ] Post-deployment smoke tests execute.
- [ ] Failed smoke tests prevent false-positive deployment success.

### 6.10 Database deployment

- [ ] Migration ordering is deterministic.
- [ ] Migration version is visible.
- [ ] Migration failure is observable.
- [ ] Destructive migrations are explicitly reviewed.
- [ ] Expand-contract strategy is used for incompatible changes.
- [ ] Application and schema compatibility is considered.
- [ ] Rollback strategy is documented.
- [ ] Backup/restore procedure is documented.
- [ ] Development restore has been demonstrated.

### 6.11 Observability

- [ ] API logs are centralized.
- [ ] Worker logs are centralized.
- [ ] Deployment logs are retained.
- [ ] Database health is observable.
- [ ] Queue health is observable.
- [ ] Object-storage errors are observable.
- [ ] Lab Agent health is observable.
- [ ] Request correlation identifiers are preserved.
- [ ] Trace identifiers are preserved where tracing is available.
- [ ] Application metrics are collected.
- [ ] Worker metrics are collected.
- [ ] Queue metrics are collected.
- [ ] Database metrics are collected.
- [ ] Lab connectivity metrics are collected.
- [ ] Critical Development failures generate alerts or visible operational signals.

### 6.12 Dev Lab connectivity

- [ ] Lab Agent has a unique identity.
- [ ] Lab Agent authentication is validated.
- [ ] Lab Agent registration succeeds.
- [ ] Lab heartbeat succeeds.
- [ ] Lab resource inventory is visible.
- [ ] Simulated resource is registered.
- [ ] Lab Agent can receive authorized commands.
- [ ] Artifact validation works.
- [ ] Artifact deployment works.
- [ ] Job execution works.
- [ ] Run state is reported.
- [ ] Logs are returned.
- [ ] Telemetry is returned where implemented.
- [ ] Disconnect is detectable.
- [ ] Reconnect does not duplicate execution.
- [ ] Cloud-side disconnect does not become physical safety authority.
- [ ] Local Lab Agent/runtime remains authoritative for local safety.

### 6.13 Security and isolation

- [ ] Organization boundary is enforced.
- [ ] Cross-tenant project access is denied.
- [ ] Cross-tenant artifact access is denied.
- [ ] Cross-tenant result access is denied.
- [ ] Cross-tenant object access is denied.
- [ ] Service-to-service access is least privilege.
- [ ] Administrative access is auditable.
- [ ] Development identities cannot access Production resources.
- [ ] Unauthorized API calls fail closed.
- [ ] Secrets are not exposed in logs.
- [ ] Object storage does not permit unintended public access.
- [ ] Database does not permit unintended public access.
- [ ] Security-sensitive actions generate audit evidence.

### 6.14 Cost controls

- [ ] Development resources have environment tags/labels.
- [ ] Cost ownership is identifiable.
- [ ] Budget thresholds are configured where supported.
- [ ] Idle resource strategy is documented.
- [ ] Non-production resources can be scaled down.
- [ ] Temporary resources have lifecycle controls.
- [ ] Unexpected cost increases are observable.

### 6.15 End-to-end acceptance

The following flow shall succeed:

    Developer
        |
        v
    Git Commit
        |
        v
    CI
        |
        v
    Development Deployment
        |
        v
    API
        |
        v
    PostgreSQL
        |
        +--> Object Storage
        |
        +--> Queue
                |
                v
              Worker
                |
                v
           Lab Protocol
                |
                v
           Lab Agent
                |
                v
        Simulated Resource
                |
                v
              Run
                |
                v
             Result

- [ ] User can authenticate.
- [ ] User can create/select an organization context.
- [ ] User can create a project.
- [ ] Platform information can be retrieved.
- [ ] Artifact can be registered/uploaded.
- [ ] Artifact can be validated.
- [ ] Development resource can be selected.
- [ ] Booking can be created in the Development environment where the application modules are enabled.
- [ ] Job can be created.
- [ ] Job can enter the queue.
- [ ] Worker can consume the job.
- [ ] Worker can validate execution eligibility.
- [ ] Worker can contact Lab Agent.
- [ ] Artifact can be deployed.
- [ ] Run can start.
- [ ] Run state is observable.
- [ ] Logs are visible.
- [ ] Telemetry is visible where implemented.
- [ ] Run completes.
- [ ] Result is generated.
- [ ] Result file can be stored.
- [ ] Result can be retrieved.
- [ ] User can initiate a rerun where the corresponding product functionality exists.
- [ ] Audit evidence is generated for security-sensitive operations.

---
