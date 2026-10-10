# F-M07-RESULTS — Acceptance Criteria

Milestone: F-M07 — Results

# 6. Acceptance Criteria

## 6.1 Results Dashboard

- [ ] Results dashboard is accessible from the Studio.
- [ ] Results are organization-scoped.
- [ ] Results can be filtered.
- [ ] Results can be searched where supported.
- [ ] Result status is shown.
- [ ] Run status is shown separately.
- [ ] Project is shown.
- [ ] Platform is shown.
- [ ] Experiment is shown where applicable.
- [ ] Key metrics can be shown.
- [ ] Result date/time is shown.
- [ ] Pagination works.
- [ ] Loading state exists.
- [ ] Empty state exists.
- [ ] Error state exists.

## 6.2 Result Detail

- [ ] Result ID is displayed.
- [ ] Run ID is displayed.
- [ ] Job ID is displayed.
- [ ] Project is displayed.
- [ ] Artifact is displayed.
- [ ] Platform is displayed.
- [ ] Platform version is displayed.
- [ ] Runtime/SDK context is displayed where relevant.
- [ ] Resource is displayed.
- [ ] Result status is displayed.
- [ ] Execution outcome is displayed.
- [ ] Duration is displayed.
- [ ] Files are displayed.
- [ ] Metrics are displayed.
- [ ] Experiment membership is displayed.
- [ ] Comparison is accessible.
- [ ] Rerun is accessible when permitted.
- [ ] Download actions are accessible when permitted.

## 6.3 Result Lifecycle

- [ ] CREATED is represented.
- [ ] PROCESSING is represented.
- [ ] AVAILABLE is represented.
- [ ] FAILED is represented.
- [ ] CANCELLED is represented.
- [ ] ARCHIVED is represented.
- [ ] PURGED is represented.
- [ ] Invalid transitions are rejected.
- [ ] Result is not shown AVAILABLE prematurely.
- [ ] Result state is durable.

## 6.4 Result Files

- [ ] Files are listed.
- [ ] Filename is shown.
- [ ] File type is shown.
- [ ] Size is shown.
- [ ] Status is shown.
- [ ] Checksum is shown where available.
- [ ] Creation time is shown.
- [ ] Availability is shown.
- [ ] Archived files are handled correctly.
- [ ] Purged files cannot be downloaded.
- [ ] Failed files display failure state.
- [ ] File access is authorized.

## 6.5 Metrics

- [ ] Metrics are structured.
- [ ] Metric name is displayed.
- [ ] Metric value is displayed.
- [ ] Metric type is respected.
- [ ] Unit is displayed where available.
- [ ] Aggregation is displayed.
- [ ] RAW metrics are distinguishable.
- [ ] AVERAGE metrics are distinguishable.
- [ ] P95/P99 metrics are distinguishable.
- [ ] Invalid metric values are handled.
- [ ] Metrics are associated with the correct Result.
- [ ] Metric semantics are not invented by the UI.

## 6.6 Experiments

- [ ] User can create an Experiment where authorized.
- [ ] Experiment belongs to a Project.
- [ ] Experiment status is displayed.
- [ ] Runs can be added.
- [ ] Runs can be removed where allowed.
- [ ] Run role can be displayed.
- [ ] Membership is tenant-scoped.
- [ ] Membership is auditable.
- [ ] Historical Run identity remains unchanged.

## 6.7 Comparison

- [ ] User can select comparable Runs.
- [ ] Baseline is identifiable.
- [ ] Candidate is identifiable.
- [ ] Metrics can be selected.
- [ ] Comparison validates metric compatibility.
- [ ] Comparison processing state is displayed.
- [ ] Comparison becomes AVAILABLE only after successful processing.
- [ ] Baseline value is shown.
- [ ] Candidate value is shown.
- [ ] Delta is shown where meaningful.
- [ ] Direction is shown where meaningful.
- [ ] IMPROVED is supported.
- [ ] DEGRADED is supported.
- [ ] UNCHANGED is supported.
- [ ] NOT_COMPARABLE is supported.
- [ ] Comparison does not modify source Results.

## 6.8 Rerun

- [ ] Rerun action is available only when authorized.
- [ ] Original Run is identified.
- [ ] Original artifact is identified.
- [ ] Original platform is identified.
- [ ] Original configuration is displayed.
- [ ] Current compatibility is revalidated.
- [ ] Current booking is required.
- [ ] Expired bookings cannot be silently reused.
- [ ] Material configuration changes require confirmation.
- [ ] Rerun uses an idempotency key.
- [ ] Rerun creates a new Job.
- [ ] Rerun creates a new Run.
- [ ] Original Run remains unchanged.
- [ ] Original Result remains unchanged.
- [ ] Rerun lineage is visible.
- [ ] Rerun follows current authorization.
- [ ] Rerun follows current artifact policy.
- [ ] Rerun follows current safety policy.

## 6.9 Downloads

- [ ] Download requires authorization.
- [ ] Download request is scoped to Result File.
- [ ] Download access is short-lived.
- [ ] Permanent object-storage credentials are not exposed.
- [ ] Download state is displayed.
- [ ] REQUESTED is supported.
- [ ] GENERATED is supported.
- [ ] DOWNLOADED is supported.
- [ ] FAILED is supported.
- [ ] CANCELLED is supported.
- [ ] Expired access is rejected.
- [ ] Download is auditable.
- [ ] File checksum can be verified where supported.
- [ ] Unauthorized downloads are rejected.

## 6.10 Security and Privacy

- [ ] Tenant isolation is enforced.
- [ ] Project authorization is enforced.
- [ ] Result authorization is enforced.
- [ ] File authorization is enforced.
- [ ] Download authorization is enforced.
- [ ] Experiment authorization is enforced.
- [ ] Comparison authorization is enforced.
- [ ] Rerun authorization is enforced.
- [ ] Result files do not expose source code unintentionally.
- [ ] Logs/files are handled according to privacy policy.
- [ ] Audit events exist for sensitive actions.

## 6.11 Historical Integrity

- [ ] Historical Run is immutable from normal Rerun workflow.
- [ ] Historical Result is not overwritten.
- [ ] Historical metrics remain associated with original Result.
- [ ] Historical files remain associated with original Result.
- [ ] Rerun creates new execution identity.
- [ ] Rerun creates new Result identity.
- [ ] Rerun lineage is traceable.

## 6.12 Failure Handling

- [ ] Result processing failure is visible.
- [ ] File processing failure is visible.
- [ ] Comparison failure is visible.
- [ ] Download failure is visible.
- [ ] Rerun creation failure is visible.
- [ ] Object-storage failure is represented.
- [ ] Missing file is represented.
- [ ] Archived result is represented.
- [ ] Purged result is represented.
- [ ] Retry behavior is explicit.

## 6.13 UI Quality

- [ ] Results dashboard is understandable.
- [ ] Result detail hierarchy is clear.
- [ ] Files are easy to inspect.
- [ ] Metrics are readable.
- [ ] Comparison is understandable.
- [ ] Rerun impact is clear.
- [ ] Download status is clear.
- [ ] Loading states work.
- [ ] Empty states work.
- [ ] Error states work.
- [ ] Accessibility labels exist.
- [ ] Keyboard navigation works.
- [ ] Dark theme works.
- [ ] Light theme works.
- [ ] Large result sets remain usable.

---
