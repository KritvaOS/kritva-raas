# B-M03-PLATFORM — Acceptance Criteria

Milestone: B-M03 — Platform

# 6 Acceptance Criteria

## 6.1 Platform Registry

- [ ] Platform registry exists.
- [ ] Platform IDs are unique.
- [ ] Platform lifecycle is explicit.
- [ ] Platform Version exists.
- [ ] Version belongs to Platform.
- [ ] Architecture is represented.
- [ ] Runtime compatibility is represented.
- [ ] SDK compatibility is represented.
- [ ] Platform configurations are represented.
- [ ] Platform catalog is queryable.
- [ ] Platform metadata is tenant-safe.
- [ ] Platform administration is authorized.
- [ ] Platform changes are audited.

## 6.2 Capabilities

- [ ] Capability registry exists.
- [ ] Capability IDs are unique.
- [ ] Capability lifecycle is explicit.
- [ ] Platform-version capability mapping exists.
- [ ] SUPPORTED is represented.
- [ ] OPTIONAL is represented.
- [ ] EXPERIMENTAL is represented.
- [ ] Capability queries are supported.
- [ ] Required capability checks are supported.
- [ ] Deprecated capabilities are distinguishable.

## 6.3 Labs

- [ ] Lab registry exists.
- [ ] Lab lifecycle is explicit.
- [ ] Lab ownership is explicit where required.
- [ ] Lab platform relationships are represented.
- [ ] Lab status is queryable.
- [ ] Lab maintenance state is queryable.
- [ ] Lab administrative operations are authorized.
- [ ] Lab changes are audited.

## 6.4 Robots

- [ ] Robot registry exists.
- [ ] Robot identity is stable.
- [ ] Robot belongs to a Lab.
- [ ] Robot belongs to a Platform.
- [ ] Robot lifecycle is explicit.
- [ ] ACTIVE is supported.
- [ ] MAINTENANCE is supported.
- [ ] FAULT is supported.
- [ ] RETIRED is supported.
- [ ] Robot state is queryable.
- [ ] Robot identity is distinct from Resource identity.

## 6.5 Resources

- [ ] Resource registry exists.
- [ ] Resource has stable identity.
- [ ] Resource type is explicit.
- [ ] ROBOT resource is supported.
- [ ] SIMULATOR resource is supported.
- [ ] GPU resource is supported.
- [ ] WORKSTATION resource is supported.
- [ ] Resource state is explicit.
- [ ] Resource belongs to a Lab.
- [ ] Resource references Platform where required.
- [ ] Robot-resource relationship is represented.
- [ ] Resource status is queryable.
- [ ] Resource changes are auditable.

## 6.6 Maintenance

- [ ] Maintenance windows exist.
- [ ] Maintenance type is explicit.
- [ ] Maintenance status is explicit.
- [ ] Start/end times are validated.
- [ ] Overlapping maintenance behavior is defined.
- [ ] Maintenance affects availability evaluation.
- [ ] Emergency maintenance can override normal availability.
- [ ] Maintenance changes are audited.

## 6.7 Availability

- [ ] Availability windows exist.
- [ ] Availability is distinct from current resource state.
- [ ] Resource fault overrides normal availability.
- [ ] Maintenance overrides normal availability.
- [ ] Availability is queryable.
- [ ] Availability is not treated as booking confirmation.
- [ ] Booking remains authoritative for confirmed allocation.

## 6.8 Compatibility

- [ ] Artifact platform is evaluated.
- [ ] Platform version is evaluated.
- [ ] Architecture is evaluated.
- [ ] Runtime is evaluated.
- [ ] SDK is evaluated.
- [ ] Capabilities are evaluated.
- [ ] Configuration is evaluated where applicable.
- [ ] COMPATIBLE is supported.
- [ ] INCOMPATIBLE is supported.
- [ ] UNKNOWN is supported.
- [ ] REQUIRES_REVIEW is supported.
- [ ] Compatibility is server-authoritative.
- [ ] Compatibility result is auditable.
- [ ] Compatibility logic is reusable by Job service.
- [ ] Compatibility logic does not depend on UI implementation.

## 6.9 WebSocket Authentication

- [ ] WebSocket connections authenticate.
- [ ] Expired credentials are rejected.
- [ ] Invalid credentials are rejected.
- [ ] Suspended identities are rejected.
- [ ] Tenant context is established.
- [ ] Authentication errors are controlled.
- [ ] Authentication data is not logged as secrets.

## 6.10 WebSocket Authorization

- [ ] Subscription authorization is enforced.
- [ ] Cross-tenant subscription is denied.
- [ ] Project-scoped subscription is enforced.
- [ ] Resource-scoped subscription is enforced.
- [ ] Administrative topics require elevated permission.
- [ ] Authorization is re-evaluated when required.
- [ ] Disconnected clients do not retain active subscriptions.

## 6.11 WebSocket Protocol

- [ ] Protocol version exists.
- [ ] Event ID exists.
- [ ] Event timestamp exists.
- [ ] Resource identity exists.
- [ ] Organization context exists where applicable.
- [ ] Sequence exists for ordered streams.
- [ ] Correlation metadata exists.
- [ ] Event data is bounded.
- [ ] Event schema is documented.

## 6.12 WebSocket Reliability

- [ ] Heartbeat exists.
- [ ] Connection timeout exists.
- [ ] Connection cleanup exists.
- [ ] Duplicate events can be detected.
- [ ] Sequence gaps can be detected.
- [ ] Reconnect behavior is documented.
- [ ] Snapshot resynchronization is supported.
- [ ] WebSocket disconnect does not imply Run failure.
- [ ] WebSocket disconnect does not imply robot stop.
- [ ] Reconnect does not automatically restart execution.

## 6.13 Backpressure

- [ ] Per-connection queue is bounded.
- [ ] High-rate streams are controlled.
- [ ] Subscription limits exist.
- [ ] Oversized events are rejected.
- [ ] Sustained overload has deterministic behavior.
- [ ] Server resource exhaustion is prevented.
- [ ] Critical durable state remains recoverable.

## 6.14 Security

- [ ] Tenant isolation tests pass.
- [ ] Platform administration tests pass.
- [ ] Resource authorization tests pass.
- [ ] WebSocket authorization tests pass.
- [ ] Sensitive information is not logged.
- [ ] Audit events exist for administrative operations.
- [ ] Safety authority is not delegated to WebSocket infrastructure.

## 6.15 Integration

- [ ] F-M03 can retrieve platform catalog.
- [ ] F-M04 can retrieve resource information.
- [ ] F-M05 can use compatibility.
- [ ] F-M06 can use WebSocket infrastructure.
- [ ] Future Lab Agent integration has stable contracts.
- [ ] API and WebSocket contracts are documented.

---
