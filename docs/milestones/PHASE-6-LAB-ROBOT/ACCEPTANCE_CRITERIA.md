# PHASE-6-LAB-ROBOT — Acceptance Criteria

Milestone: PHASE-6-LAB-ROBOT — Lab Agent, Kritva Runtime and Physical Robot Integration

## 6 Acceptance criteria

### 6.1 Lab Agent identity

- [ ] Lab Agent has unique identity.
- [ ] Identity is authenticated.
- [ ] mTLS or equivalent strong identity is implemented.
- [ ] Private key is protected.
- [ ] Identity can be revoked.
- [ ] Identity rotation is supported.
- [ ] Identity state is auditable.

### 6.2 Connectivity

- [ ] Lab Agent establishes secure connection.
- [ ] Connection is authenticated.
- [ ] Heartbeat is implemented.
- [ ] Heartbeat timeout is detected.
- [ ] Disconnect state is explicit.
- [ ] Reconnect is authenticated.
- [ ] Reconnect does not blindly restart execution.

### 6.3 Registration

- [ ] Lab registers successfully.
- [ ] Robot registers successfully.
- [ ] Resources register successfully.
- [ ] Platform compatibility is reported.
- [ ] Runtime version is reported.
- [ ] SDK version is reported.
- [ ] Resource health is reported.

### 6.4 Artifact security

- [ ] Artifact signature is verified locally.
- [ ] Artifact checksum is verified locally.
- [ ] Artifact compatibility is verified.
- [ ] Revoked artifact is rejected.
- [ ] Expired artifact is rejected where applicable.
- [ ] Unsupported capability is rejected.
- [ ] Prohibited package content is rejected.
- [ ] Source code is not required.

### 6.5 Local policy

- [ ] Local execution policy exists.
- [ ] Policy is evaluated before execution.
- [ ] Unauthorized artifact is rejected.
- [ ] Unauthorized capability is rejected.
- [ ] Execution outside permitted window is rejected.
- [ ] Resource limits are enforced.
- [ ] Safety prerequisites are enforced.
- [ ] Operator approval requirement is enforced.

### 6.6 Runtime integration

- [ ] Lab Agent can discover Runtime.
- [ ] Runtime health is verified.
- [ ] Runtime version is compatible.
- [ ] Runtime can load approved artifact.
- [ ] Runtime can start application.
- [ ] Runtime can stop application.
- [ ] Runtime reports execution state.
- [ ] Runtime failure propagates correctly.

### 6.7 Robot integration

- [ ] Robot identity is stable.
- [ ] Robot state is available.
- [ ] Sensors are accessible through approved interfaces.
- [ ] Actuators are accessible through approved interfaces.
- [ ] Runtime-to-robot adapter is tested.
- [ ] Unsupported hardware operations are rejected.
- [ ] Hardware faults are propagated.

### 6.8 Safety

- [ ] Safety state is independent of resource state.
- [ ] UNKNOWN is not SAFE.
- [ ] DISCONNECTED is not SAFE.
- [ ] E-stop state is observable.
- [ ] E-stop cannot be cleared remotely.
- [ ] Local interlocks are respected.
- [ ] Motion is inhibited when required.
- [ ] Startup requires safe preconditions.
- [ ] Stop behavior is tested.
- [ ] Fault behavior is tested.
- [ ] Local operator controls remain available.
- [ ] No cloud command bypasses safety.

### 6.9 Operator approval

- [ ] Physical execution can require local approval.
- [ ] Approval identity is recorded.
- [ ] Approval is associated with Job/Run.
- [ ] Approval is time bounded where required.
- [ ] Approval cannot override an active safety fault.
- [ ] Approval cannot clear E-stop.
- [ ] Approval is auditable.

### 6.10 Execution

- [ ] Confirmed booking is required.
- [ ] Correct resource is selected.
- [ ] Artifact is validated.
- [ ] Local safety preconditions are satisfied.
- [ ] Runtime starts.
- [ ] Application starts.
- [ ] Robot remains under local safety control.
- [ ] Run state is reported.
- [ ] Completion is reported.
- [ ] Resource is released.

### 6.11 Software stop

- [ ] Stop request reaches Lab Agent.
- [ ] Lab Agent validates Stop.
- [ ] Runtime receives Stop.
- [ ] Application terminates safely.
- [ ] Robot reaches configured safe state.
- [ ] Stop result is reported.
- [ ] Stop is idempotent.
- [ ] Stop is not represented as E-stop.

### 6.12 Emergency stop

- [ ] E-stop is locally actionable.
- [ ] E-stop inhibits appropriate motion.
- [ ] Lab Agent observes E-stop.
- [ ] Control Plane records E-stop.
- [ ] Studio displays E-stop clearly.
- [ ] Cloud cannot clear E-stop.
- [ ] Reset requires approved local procedure.
- [ ] Post-E-stop restart is not automatic.

### 6.13 Telemetry

- [ ] Telemetry timestamps are present.
- [ ] Sequence numbers are present where required.
- [ ] Robot state is reported.
- [ ] Safety state is reported.
- [ ] Runtime state is reported.
- [ ] Telemetry buffering works.
- [ ] Telemetry loss is detectable.
- [ ] Telemetry does not control safety.
- [ ] High-frequency control remains local.

### 6.14 Logs

- [ ] Lab Agent logs are collected.
- [ ] Runtime logs are collected.
- [ ] Application logs are collected.
- [ ] Safety events are collected.
- [ ] Sensitive values are redacted.
- [ ] Log ordering/correlation is preserved.
- [ ] Log loss is detectable.

### 6.15 Disconnect

- [ ] Cloud disconnect is detected.
- [ ] Local execution policy remains active.
- [ ] Safety remains local.
- [ ] Running application follows configured disconnect policy.
- [ ] No unsafe automatic restart occurs.
- [ ] Disconnect is logged.
- [ ] Reconnect reconciles state.

### 6.16 Recovery

- [ ] Lab Agent restart is tested.
- [ ] Runtime restart is tested.
- [ ] Network reconnect is tested.
- [ ] Resource state is reconciled.
- [ ] Job state is reconciled.
- [ ] Run state is reconciled.
- [ ] Unknown physical state is escalated.
- [ ] Automatic recovery is disabled when unsafe.

### 6.17 Results

- [ ] Execution result is collected.
- [ ] Result checksum is recorded.
- [ ] Large files use object storage.
- [ ] Metadata is persisted.
- [ ] Result is associated with Run.
- [ ] Result handoff is idempotent.

### 6.18 Tenant isolation

- [ ] Lab identity cannot access unauthorized organization resources.
- [ ] Artifact access is authorized.
- [ ] Job access is authorized.
- [ ] Run access is authorized.
- [ ] Telemetry access is authorized.
- [ ] Logs are tenant isolated.
- [ ] Results are tenant isolated.

### 6.19 Audit

- [ ] Lab Agent connection is audited.
- [ ] Artifact validation is audited.
- [ ] Deployment is audited.
- [ ] Operator approval is audited.
- [ ] Start is audited.
- [ ] Stop is audited.
- [ ] E-stop event is audited.
- [ ] Fault is audited.
- [ ] Disconnect is audited.
- [ ] Recovery is audited.
- [ ] Result collection is audited.

### 6.20 Physical execution gate

The following must all be true before the first customer-facing physical execution:

- [ ] Safety architecture reviewed.
- [ ] Safety test procedure approved.
- [ ] Emergency stop verified.
- [ ] Interlocks verified.
- [ ] Safe startup verified.
- [ ] Safe stop verified.
- [ ] Power-down procedure verified.
- [ ] Operator trained.
- [ ] Physical test environment isolated.
- [ ] Approved test artifact available.
- [ ] Rollback procedure available.
- [ ] Human safety reviewer approves physical execution.

### 6.21 No-go conditions

P6 LAB & ROBOT shall not close if:

- [ ] cloud can bypass safety;
- [ ] E-stop can be cleared remotely;
- [ ] unknown safety state is treated as safe;
- [ ] disconnected robot is treated as safe;
- [ ] operator approval can bypass safety;
- [ ] unauthorized artifact can execute;
- [ ] Lab Agent identity is weak or shared;
- [ ] Runtime can bypass safety controller;
- [ ] physical restart occurs automatically after uncertain state;
- [ ] telemetry is treated as safety authority;
- [ ] physical execution cannot be stopped locally;
- [ ] physical execution evidence is incomplete.

---
