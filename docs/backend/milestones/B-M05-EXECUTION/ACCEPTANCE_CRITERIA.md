# B-M05-EXECUTION — Acceptance Criteria

Milestone: B-M05 — Execution

# 6 Acceptance Criteria

## 6.1 Job Domain

- [ ] Job entity exists.
- [ ] Job has stable identity.
- [ ] Job belongs to Organization.
- [ ] Job references Project.
- [ ] Job references Artifact.
- [ ] Job references Booking.
- [ ] Job references Resource.
- [ ] Job references Platform.
- [ ] Job lifecycle is explicit.
- [ ] Job state history is preserved.
- [ ] Job creation is idempotent.
- [ ] Job authorization is enforced.

## 6.2 Run Domain

- [ ] Run entity exists.
- [ ] Run has stable identity.
- [ ] Run references Job.
- [ ] Run represents an execution attempt.
- [ ] Run lifecycle is explicit.
- [ ] Run state history is preserved.
- [ ] Run records actual start/end.
- [ ] Run records exit status.
- [ ] Run records failure information.
- [ ] Run records timeout information.
- [ ] Historical execution context is preserved.

## 6.3 Eligibility

- [ ] Organization authorization is checked.
- [ ] Project authorization is checked.
- [ ] Artifact ownership/access is checked.
- [ ] Artifact status is checked.
- [ ] Artifact signature is checked.
- [ ] Artifact integrity is checked.
- [ ] Booking status is checked.
- [ ] Booking time window is checked.
- [ ] Resource allocation is checked.
- [ ] Platform compatibility is checked.
- [ ] Resource state is checked.
- [ ] Execution policy is checked.
- [ ] Failed eligibility prevents execution.
- [ ] Eligibility result is auditable.

## 6.4 Queue

- [ ] Queue abstraction exists.
- [ ] Queue message has stable message ID.
- [ ] Queue message references Job.
- [ ] Queue messages are idempotently processable.
- [ ] Queue acknowledgement exists.
- [ ] Queue retry exists.
- [ ] Dead-letter handling exists.
- [ ] Queue failure does not erase Job state.
- [ ] Durable Job state supports recovery.
- [ ] Queue adapter is provider-neutral.

## 6.5 Worker

- [ ] Worker framework exists.
- [ ] Worker identity exists.
- [ ] Worker heartbeat exists.
- [ ] Worker claims Jobs safely.
- [ ] Only one active worker owns a Job at a time.
- [ ] Worker timeout is detected.
- [ ] Worker failure recovery exists.
- [ ] Worker concurrency is bounded.
- [ ] Worker shutdown is graceful.
- [ ] Worker does not bypass domain services.

## 6.6 Job State Machine

- [ ] CREATED exists.
- [ ] QUEUED exists.
- [ ] VALIDATING exists.
- [ ] ALLOCATING exists.
- [ ] DEPLOYING exists.
- [ ] STARTING exists.
- [ ] RUNNING exists.
- [ ] STOPPING exists.
- [ ] COMPLETED exists.
- [ ] FAILED exists.
- [ ] CANCELLED exists.
- [ ] TIMEOUT exists.
- [ ] Invalid transitions are rejected.
- [ ] State transitions are auditable.

## 6.7 Run State Machine

- [ ] CREATED exists.
- [ ] PREPARING exists.
- [ ] STARTING exists.
- [ ] RUNNING exists.
- [ ] STOPPING exists.
- [ ] STOPPED exists.
- [ ] COMPLETED exists.
- [ ] FAILED exists.
- [ ] TIMEOUT exists.
- [ ] CANCELLED exists.
- [ ] Invalid transitions are rejected.
- [ ] Run transitions are auditable.

## 6.8 Lab Agent

- [ ] Lab Agent contract exists.
- [ ] Contract supports resource status.
- [ ] Contract supports artifact validation.
- [ ] Contract supports deployment.
- [ ] Contract supports start.
- [ ] Contract supports stop.
- [ ] Contract supports status.
- [ ] Contract supports result collection.
- [ ] Contract supports cleanup.
- [ ] Simulated Lab Agent implements the contract.
- [ ] Simulated Lab Agent supports fault injection.

## 6.9 Deployment

- [ ] Artifact is retrieved securely.
- [ ] Artifact checksum is verified.
- [ ] Artifact signature is verified.
- [ ] Artifact compatibility is verified.
- [ ] Deployment target is validated.
- [ ] Deployment failure is represented.
- [ ] Deployment does not require source code.
- [ ] Temporary deployment state is cleaned up.

## 6.10 Execution

- [ ] Run can start.
- [ ] Start is idempotent.
- [ ] Run transitions to RUNNING only after actual start acknowledgement.
- [ ] Execution remains associated with the correct resource.
- [ ] Execution remains within booking constraints.
- [ ] Execution status is durable.
- [ ] Execution completion is durable.
- [ ] Execution failure is durable.

## 6.11 Stop and Cancellation

- [ ] Software stop command exists.
- [ ] Stop is idempotent.
- [ ] Stop transitions through STOPPING.
- [ ] Stop acknowledgement is recorded.
- [ ] Cancellation is authorized.
- [ ] Cancellation is not confused with physical E-stop.
- [ ] Physical safety state is not fabricated.
- [ ] Cancellation cleans up resources.
- [ ] Cancellation preserves audit evidence.

## 6.12 Timeouts

- [ ] Queue timeout is defined.
- [ ] Validation timeout is defined.
- [ ] Deployment timeout is defined.
- [ ] Startup timeout is defined.
- [ ] Execution timeout is defined.
- [ ] Cleanup timeout is defined.
- [ ] Timeout state is durable.
- [ ] Timeout initiates controlled stop/cleanup.
- [ ] Timeout does not silently become COMPLETED.
- [ ] Timeout is auditable.

## 6.13 Retry

- [ ] Default retry policy is defined.
- [ ] Retry is idempotent.
- [ ] Retry count is bounded.
- [ ] Retry reasons are recorded.
- [ ] Unsafe actions are not blindly retried.
- [ ] Permanent failures become FAILED.
- [ ] Infrastructure retry is distinguishable from application retry.

## 6.14 Resource Cleanup

- [ ] Resource allocation is released.
- [ ] Worker claim is released.
- [ ] Lab Agent execution state is cleaned.
- [ ] Temporary artifact state is cleaned.
- [ ] Cleanup occurs after success.
- [ ] Cleanup occurs after failure.
- [ ] Cleanup occurs after timeout.
- [ ] Cleanup occurs after cancellation.
- [ ] Cleanup is retryable.
- [ ] Cleanup failure is visible.

## 6.15 Credits

- [ ] Job references required credit reservation.
- [ ] Credit consumption is delegated to Credit Service.
- [ ] Successful execution follows consumption policy.
- [ ] Failed execution follows defined policy.
- [ ] Timeout follows defined policy.
- [ ] Cancellation follows defined policy.
- [ ] Credit operations are idempotent.
- [ ] Credit state remains auditable.

## 6.16 Security

- [ ] Tenant isolation tests pass.
- [ ] Artifact access is authorized.
- [ ] Resource access is authorized.
- [ ] Job access is authorized.
- [ ] Run access is authorized.
- [ ] Execution commands are authorized.
- [ ] Sensitive execution metadata is not leaked.
- [ ] Logs do not expose source code or secrets.
- [ ] Lab Agent credentials are protected.
- [ ] Audit events exist for privileged operations.

## 6.17 Failure Recovery

- [ ] Worker crash is recoverable.
- [ ] Queue duplication is safe.
- [ ] Queue loss is recoverable from durable state.
- [ ] Lab Agent disconnect is represented.
- [ ] Runtime failure is represented.
- [ ] Deployment failure is represented.
- [ ] Timeout is recoverable.
- [ ] Cleanup failure is recoverable.
- [ ] Database rollback does not create impossible Job state.

---
