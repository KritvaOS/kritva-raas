# F-M05-EXECUTION — Acceptance Criteria

Milestone: F-M05 — Execution

# 6. Acceptance Criteria

## 6.1 Job Creation

- [ ] User can select an eligible artifact.
- [ ] User can select an eligible booking.
- [ ] Artifact ownership is validated.
- [ ] Booking ownership is validated.
- [ ] Artifact/booking platform compatibility is validated.
- [ ] Booking time window is validated.
- [ ] Artifact security status is validated.
- [ ] Job creation requires authorization.
- [ ] Job creation uses an idempotency key.
- [ ] Duplicate requests do not create duplicate Jobs.
- [ ] Job creation returns a durable Job ID.
- [ ] Job creation does not imply execution started.

## 6.2 Job Lifecycle

- [ ] CREATED is displayed.
- [ ] QUEUED is displayed.
- [ ] VALIDATING is displayed.
- [ ] ALLOCATING is displayed.
- [ ] DEPLOYING is displayed.
- [ ] STARTING is displayed.
- [ ] RUNNING is displayed.
- [ ] STOPPING is displayed.
- [ ] COMPLETED is displayed.
- [ ] FAILED is displayed.
- [ ] CANCELLED is displayed.
- [ ] TIMEOUT is displayed.
- [ ] Illegal transitions are rejected.
- [ ] State changes are durable.
- [ ] State changes are auditable.

## 6.3 Run Lifecycle

- [ ] Run ID is displayed when created.
- [ ] Run state is distinct from Job state.
- [ ] Run preparation is visible.
- [ ] Run starting is visible.
- [ ] Run running state is visible.
- [ ] Run stopping state is visible.
- [ ] Run stopped state is visible.
- [ ] Run completed state is visible.
- [ ] Run failed state is visible.
- [ ] Historical Runs are preserved.
- [ ] Retry does not overwrite historical Run state.

## 6.4 Execution Start

- [ ] Start control appears only when valid.
- [ ] Start requires authorization.
- [ ] Booking validity is rechecked.
- [ ] Artifact validity is rechecked.
- [ ] Resource allocation is rechecked.
- [ ] Lab Agent state is checked.
- [ ] Runtime readiness is checked.
- [ ] Safety policy is checked.
- [ ] Start command is idempotent.
- [ ] UI does not claim RUNNING before authoritative state.

## 6.5 Software Stop

- [ ] Software Stop is clearly named.
- [ ] Software Stop is distinct from Emergency Stop.
- [ ] Software Stop requires authorization.
- [ ] Software Stop command is idempotent.
- [ ] Request acknowledgement is displayed.
- [ ] Stop-in-progress is displayed.
- [ ] Run is not shown STOPPED before confirmation.
- [ ] Stop timeout is displayed.
- [ ] Stop failure is displayed.
- [ ] Audit event is generated.
- [ ] Software Stop does not claim physical E-stop activation.

## 6.6 Physical E-Stop Presentation

- [ ] Physical E-stop state is shown separately.
- [ ] Physical E-stop source is identified where possible.
- [ ] Physical E-stop state freshness is shown or enforced.
- [ ] ACTIVE state is visually prominent.
- [ ] UNKNOWN state is treated as unknown, not SAFE.
- [ ] DISCONNECTED state does not imply SAFE.
- [ ] UI does not provide a fake E-stop release control.
- [ ] UI does not claim software stop equals E-stop.
- [ ] Physical safety review is completed before physical deployment.
- [ ] Safety state is not derived from Job state alone.

## 6.7 Safety State

- [ ] Runtime safety state is displayed.
- [ ] Robot/resource safety state is displayed.
- [ ] Lab Agent health is displayed.
- [ ] Stale safety state is identified.
- [ ] Safety fault is identified.
- [ ] Safety state is independently sourced.
- [ ] Safety state cannot be overridden by normal UI controls.
- [ ] Safety warnings are actionable.
- [ ] Safety state survives UI refresh through durable state retrieval.

## 6.8 Logs

- [ ] Logs are displayed.
- [ ] Logs stream live.
- [ ] Log timestamps are displayed.
- [ ] Log severity is displayed.
- [ ] Log source is displayed.
- [ ] Logs are associated with Job/Run.
- [ ] Logs are ordered.
- [ ] Duplicate events are deduplicated.
- [ ] Sequence gaps are detected.
- [ ] Logs can be filtered.
- [ ] Log stream reconnect works.
- [ ] Durable log retrieval is available after reconnect.
- [ ] Sensitive values are redacted.

## 6.9 Connectivity

- [ ] Studio connection state is visible.
- [ ] Lab Agent connection state is visible.
- [ ] Runtime state is visible.
- [ ] WebSocket disconnect is detected.
- [ ] Reconnect is attempted according to policy.
- [ ] Durable Job/Run state is refreshed after reconnect.
- [ ] Event sequence gaps trigger resynchronization.
- [ ] UI does not infer execution stopped merely because the WebSocket disconnected.
- [ ] UI does not infer execution is safe merely because the cloud is connected.

## 6.10 Authorization

- [ ] User authentication is required.
- [ ] Organization membership is validated.
- [ ] Project access is validated.
- [ ] Artifact access is validated.
- [ ] Booking access is validated.
- [ ] Job access is validated.
- [ ] Run access is validated.
- [ ] Execution commands are authorized.
- [ ] Cross-tenant Job access is rejected.
- [ ] Cross-tenant Run access is rejected.
- [ ] UI visibility is not treated as authorization.

## 6.11 Failure Handling

- [ ] Artifact validation failure is displayed.
- [ ] Booking invalidation is displayed.
- [ ] Resource unavailable is displayed.
- [ ] Lab Agent unavailable is displayed.
- [ ] Runtime unavailable is displayed.
- [ ] Deployment failure is displayed.
- [ ] Start failure is displayed.
- [ ] Stop timeout is displayed.
- [ ] Safety fault is displayed.
- [ ] Network timeout is displayed.
- [ ] Retry availability is explicit.
- [ ] Errors do not create false success state.

## 6.12 Audit

- [ ] Job creation is auditable.
- [ ] Start is auditable.
- [ ] Software stop is auditable.
- [ ] Cancellation is auditable.
- [ ] Retry is auditable.
- [ ] Safety-state transitions are auditable where required.
- [ ] Actor identity is recorded.
- [ ] Timestamp is recorded.
- [ ] Job/Run identity is recorded.
- [ ] Organization identity is recorded.

## 6.13 UI Quality

- [ ] Job detail is understandable.
- [ ] Run state is distinguishable.
- [ ] Controls are state-aware.
- [ ] Dangerous actions require confirmation where appropriate.
- [ ] Software stop is visually distinct from emergency stop.
- [ ] Safety state is prominent.
- [ ] Loading state is supported.
- [ ] Empty state is supported.
- [ ] Error state is supported.
- [ ] Disconnected state is supported.
- [ ] Dark theme works.
- [ ] Light theme works.
- [ ] Keyboard navigation works.
- [ ] Accessibility labels exist for execution controls.

---
