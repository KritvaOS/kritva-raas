# F-M06-LIVE — Acceptance Criteria

Milestone: F-M06 — Live Execution

# 6. Acceptance Criteria

## 6.1 Live Session

- [ ] Authorized user can open an active Run.
- [ ] Live session is created.
- [ ] Session is associated with correct Job/Run.
- [ ] Session authorization is enforced.
- [ ] Session expiration is handled.
- [ ] Unauthorized users cannot create a session.
- [ ] Cross-tenant live sessions are rejected.
- [ ] Session resources are cleaned up.

## 6.2 WebRTC Video

- [ ] Video session can be established.
- [ ] WebRTC signaling succeeds.
- [ ] Video track renders.
- [ ] Video connection state is displayed.
- [ ] Connecting state is displayed.
- [ ] Reconnecting state is displayed.
- [ ] Failed state is displayed.
- [ ] Video disconnect does not imply Run failure.
- [ ] Video reconnect works.
- [ ] Camera is authorized.
- [ ] Camera stream is associated with the correct resource.
- [ ] Unauthorized camera access is rejected.
- [ ] Video does not require source upload.
- [ ] WebRTC media does not unnecessarily traverse application API servers.

## 6.3 Video Quality

- [ ] Basic video quality is acceptable.
- [ ] Resolution is available where supported.
- [ ] Frame rate is available where supported.
- [ ] Packet loss is detectable where supported.
- [ ] Degraded media is visible.
- [ ] Poor network conditions do not crash the Studio.
- [ ] Video reconnect uses bounded backoff.
- [ ] Repeated reconnects do not create duplicate sessions.

## 6.4 Telemetry

- [ ] Telemetry subscription works.
- [ ] Telemetry values update in realtime.
- [ ] Signal names are clear.
- [ ] Units are shown.
- [ ] Timestamps are shown.
- [ ] Quality is shown where provided.
- [ ] Current values are distinguishable from historical values.
- [ ] Stale telemetry is marked.
- [ ] Unsupported signals are handled.
- [ ] Telemetry reconnect works.
- [ ] Sequence gaps are detected.
- [ ] Telemetry resynchronization works.

## 6.5 Realtime Logs

- [ ] Logs stream in realtime.
- [ ] Logs show timestamp.
- [ ] Logs show severity.
- [ ] Logs show source.
- [ ] Logs show message.
- [ ] Logs are associated with Run.
- [ ] Duplicate log events are deduplicated.
- [ ] Sequence gaps are detected.
- [ ] Log replay/resync works where supported.
- [ ] Filtering works.
- [ ] Pausing visual scroll does not stop receiving logs.
- [ ] Sensitive values are redacted.

## 6.6 Realtime Events

- [ ] Job events are received.
- [ ] Run events are received.
- [ ] Resource events are received.
- [ ] Safety events are received.
- [ ] Lab Agent events are received.
- [ ] Event IDs are processed.
- [ ] Duplicate events are ignored safely.
- [ ] Sequence gaps are detected.
- [ ] Event state converges to durable state after resync.

## 6.7 Lab Status

- [ ] Lab Agent connection is shown.
- [ ] Heartbeat/freshness is shown.
- [ ] Lab offline state is shown.
- [ ] Lab maintenance state is shown where relevant.
- [ ] Lab Agent disconnect is not shown as Run failure.
- [ ] Reconnection is visible.

## 6.8 Robot Status

- [ ] Robot state is shown where supported.
- [ ] Resource state is shown.
- [ ] Robot connection is shown.
- [ ] Fault state is shown.
- [ ] Battery state is shown where supported.
- [ ] Robot status timestamp is shown.
- [ ] Stale robot state is marked.
- [ ] Robot state is not conflated with safety state.

## 6.9 Safety State

- [ ] Safety state is shown.
- [ ] Safety source is identified where supported.
- [ ] Safety timestamp is shown.
- [ ] Safety freshness is evaluated.
- [ ] SAFE/READY is distinguishable from RUNNING.
- [ ] UNKNOWN is shown as UNKNOWN.
- [ ] STALE is shown as STALE.
- [ ] Physical E-stop state is shown separately.
- [ ] Physical E-stop ACTIVE is prominent.
- [ ] WebSocket disconnect does not imply SAFE.
- [ ] Video disconnect does not imply SAFE.
- [ ] Telemetry disconnect does not imply SAFE.

## 6.10 Reconnect

- [ ] WebSocket disconnect is detected.
- [ ] WebSocket reconnect works.
- [ ] WebRTC disconnect is detected.
- [ ] WebRTC reconnect works.
- [ ] Telemetry reconnect works.
- [ ] Logs reconnect works.
- [ ] Event subscriptions are restored.
- [ ] Durable state is refreshed.
- [ ] Sequence gaps are handled.
- [ ] Duplicate events do not corrupt state.
- [ ] Reconnect does not restart execution.
- [ ] Reconnect does not issue control commands.
- [ ] Reconnect does not alter safety state.

## 6.11 Authorization

- [ ] Live session requires authentication.
- [ ] Run access is checked.
- [ ] Organization access is checked.
- [ ] Project access is checked.
- [ ] Video access is checked.
- [ ] Telemetry access is checked.
- [ ] Logs access is checked.
- [ ] Cross-tenant access is rejected.

## 6.12 Performance

- [ ] Video playback is usable under nominal network conditions.
- [ ] Telemetry remains responsive under nominal load.
- [ ] Logs remain responsive under nominal load.
- [ ] UI remains responsive during high event rates.
- [ ] Memory usage is bounded.
- [ ] Disconnected streams do not leak resources.
- [ ] Closed sessions release connections.
- [ ] Reconnect does not create unbounded timers/subscriptions.

## 6.13 UI Quality

- [ ] Live screen is understandable.
- [ ] Video dominates the primary observation area.
- [ ] Status information remains visible.
- [ ] Telemetry is readable.
- [ ] Logs are readable.
- [ ] Connection status is visible.
- [ ] Stale data is visually distinct.
- [ ] Safety warnings are prominent.
- [ ] Dark theme works.
- [ ] Light theme works.
- [ ] Keyboard accessibility is supported.
- [ ] Loading and empty states are supported.

---
