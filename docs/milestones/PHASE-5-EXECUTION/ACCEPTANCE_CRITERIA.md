# PHASE-5-EXECUTION — Acceptance Criteria

Milestone: PHASE-5-EXECUTION — Remote Execution, Jobs, Runs and Simulated Robot Environment

## 6 Acceptance criteria

### 6.1 Job

- [ ] Job can be created.
- [ ] Job has organization ownership.
- [ ] Job references project.
- [ ] Job references artifact.
- [ ] Job references booking.
- [ ] Job references resource.
- [ ] Job has idempotency key.
- [ ] Job state is durable.
- [ ] Job transitions are validated.
- [ ] Job state history is persisted.

### 6.2 Run

- [ ] Run is created from Job.
- [ ] Run has unique identity.
- [ ] Run references Job.
- [ ] Run references artifact version.
- [ ] Run captures platform snapshot.
- [ ] Run captures runtime/SDK snapshot.
- [ ] Run captures resource snapshot.
- [ ] Run state is durable.
- [ ] Run transitions are validated.
- [ ] Run state history is persisted.

### 6.3 Eligibility

- [ ] User is authenticated.
- [ ] User is authorized.
- [ ] Organization is valid.
- [ ] Project is valid.
- [ ] Artifact is accessible.
- [ ] Artifact is approved.
- [ ] Artifact checksum is valid.
- [ ] Artifact signature is valid.
- [ ] Booking is confirmed/eligible.
- [ ] Booking time window is valid.
- [ ] Resource allocation exists.
- [ ] Resource is eligible.
- [ ] Platform is compatible.
- [ ] Runtime is compatible.
- [ ] SDK is compatible.
- [ ] Execution policy allows execution.

### 6.4 Queue

- [ ] Job can be queued.
- [ ] Queue delivery is at least once.
- [ ] Duplicate delivery is safe.
- [ ] Acknowledgement works.
- [ ] Negative acknowledgement works.
- [ ] Retry policy works.
- [ ] Dead-letter behavior works.
- [ ] Queue is not treated as business truth.

### 6.5 Worker

- [ ] Worker claims work.
- [ ] Claim is durable.
- [ ] Worker heartbeat works.
- [ ] Stale worker claims are detected.
- [ ] Work can be recovered.
- [ ] Worker does not create duplicate Run attempts.
- [ ] Worker can terminate cleanly.
- [ ] Worker failures are observable.

### 6.6 Lab Agent

- [ ] Simulated Lab Agent registers.
- [ ] Heartbeat works.
- [ ] Resource status works.
- [ ] Artifact validation works.
- [ ] Artifact deployment works.
- [ ] Run start works.
- [ ] Run stop works.
- [ ] Run status works.
- [ ] Result collection works.
- [ ] Cleanup works.

### 6.7 Simulated robot

- [ ] Robot state is deterministic.
- [ ] Commands are bounded.
- [ ] Sensor simulation works.
- [ ] Actuator simulation works.
- [ ] Execution completion is deterministic.
- [ ] Fault injection works.
- [ ] Robot faults propagate to Run state.

### 6.8 Sandbox

- [ ] Artifact runs in isolated environment.
- [ ] Host filesystem is inaccessible.
- [ ] Other tenant execution data is inaccessible.
- [ ] Host credentials are unavailable.
- [ ] Control Plane secrets are unavailable.
- [ ] Writable filesystem is bounded.
- [ ] CPU limit is enforced.
- [ ] Memory limit is enforced.
- [ ] Execution timeout is enforced.
- [ ] Network policy is enforced.
- [ ] Process isolation is enforced.
- [ ] Sandbox cleanup occurs after Run.

### 6.9 Artifact privacy

- [ ] Only `.krv` artifact is deployed.
- [ ] Source is not required.
- [ ] Git metadata is not required.
- [ ] Compiler inputs are not required.
- [ ] Local development credentials are not deployed.
- [ ] Sandbox cannot access Studio workspace.

### 6.10 Lifecycle

- [ ] CREATED works.
- [ ] QUEUED works.
- [ ] VALIDATING works.
- [ ] ALLOCATING works.
- [ ] DEPLOYING works.
- [ ] STARTING works.
- [ ] RUNNING works.
- [ ] STOPPING works.
- [ ] COMPLETED works.
- [ ] FAILED works.
- [ ] CANCELLED works.
- [ ] TIMEOUT works.

### 6.11 Run lifecycle

- [ ] CREATED works.
- [ ] PREPARING works.
- [ ] STARTING works.
- [ ] RUNNING works.
- [ ] STOPPING works.
- [ ] STOPPED works.
- [ ] COMPLETED works.
- [ ] FAILED works.
- [ ] TIMEOUT works.
- [ ] CANCELLED works.

### 6.12 Cancellation

- [ ] Queued Job can be cancelled.
- [ ] Validation cancellation is handled.
- [ ] Allocation cancellation is handled.
- [ ] Deployment cancellation is handled.
- [ ] Running cancellation uses graceful stop.
- [ ] Cancellation is idempotent.
- [ ] Cancellation is audited.
- [ ] Resource is released.
- [ ] Credit outcome is correct.

### 6.13 Stop

- [ ] Software Stop is implemented.
- [ ] Stop is idempotent.
- [ ] Stop has timeout.
- [ ] Stop result is durable.
- [ ] Stop is visible in Studio.
- [ ] Stop is distinct from emergency stop.
- [ ] UI does not claim software Stop is physical E-stop.

### 6.14 Timeout

- [ ] Queue timeout works.
- [ ] Validation timeout works.
- [ ] Deployment timeout works.
- [ ] Startup timeout works.
- [ ] Execution timeout works.
- [ ] Cleanup timeout is handled.
- [ ] Timeout is persisted.
- [ ] Resource is released.
- [ ] Credit handling follows policy.

### 6.15 Failure handling

- [ ] Deployment failure works.
- [ ] Start failure works.
- [ ] Runtime failure works.
- [ ] Resource fault works.
- [ ] Worker disconnect works.
- [ ] Lab Agent disconnect works.
- [ ] Cleanup failure is recorded.
- [ ] Failure does not falsely become COMPLETED.
- [ ] Failure does not silently lose credit state.

### 6.16 Credit integration

- [ ] Execution references booking credit reservation.
- [ ] Execution does not write credit tables directly.
- [ ] Consumption is requested through Credit Service.
- [ ] Duplicate consumption is idempotent.
- [ ] Failed execution follows configured consumption policy.
- [ ] Cancellation follows configured credit policy.
- [ ] Financial reconciliation remains possible.

### 6.17 Observability

- [ ] Job events are observable.
- [ ] Run events are observable.
- [ ] Worker heartbeat is observable.
- [ ] Lab Agent heartbeat is observable.
- [ ] Execution failures are observable.
- [ ] Cleanup failures are observable.
- [ ] Correlation ID propagates.
- [ ] Audit event is generated.

### 6.18 Studio

- [ ] User can start Job.
- [ ] User sees Job status.
- [ ] User sees Run status.
- [ ] User sees failure.
- [ ] User can request Stop.
- [ ] User can cancel where permitted.
- [ ] User sees execution history.
- [ ] UI reconnect does not restart execution.
- [ ] UI treats durable state as authoritative.

### 6.19 Tenant isolation

- [ ] Organization A cannot execute Organization B artifact.
- [ ] Organization A cannot access Organization B Job.
- [ ] Organization A cannot access Organization B Run.
- [ ] Organization A cannot access Organization B execution logs.
- [ ] Repository filtering is enforced.
- [ ] API authorization is enforced.
- [ ] Sandbox isolation is enforced.

### 6.20 Idempotency

- [ ] Job creation supports idempotency.
- [ ] Queue duplicate delivery is safe.
- [ ] Run start is idempotent.
- [ ] Run stop is idempotent.
- [ ] Credit consumption is idempotent.
- [ ] Cleanup is safe to retry.
- [ ] Reconnect does not create a second Run.

### 6.21 No-go conditions

P5 EXECUTION shall not close if:

- [ ] Job state exists only in queue memory;
- [ ] Run state is not durable;
- [ ] source code is required remotely;
- [ ] sandbox can access host credentials;
- [ ] two Runs can start for one execution request unintentionally;
- [ ] stop is falsely represented as emergency stop;
- [ ] worker failure loses execution state;
- [ ] resource allocation is not released;
- [ ] execution can bypass artifact validation;
- [ ] execution can bypass booking validation;
- [ ] cross-tenant execution is possible;
- [ ] credit consumption can be duplicated;
- [ ] cleanup is not deterministic.

---
