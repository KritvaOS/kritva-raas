# KR-BE-1-009 — Readiness Check Policy and Shutdown Drain

## Document Control

| Field | Value |
|---|---|
| Document | KR-BE-1-009 Readiness Check Policy Decision Record |
| Path | `planning/backend/increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BE-1-009-readiness-check-policy.md` |
| Status | Proposed |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Increment tasks](../TASKS.md)
- [Increment acceptance criteria](../ACCEPTANCE_CRITERIA.md)
- [Response contract decision record](KR-BE-1-007-response-contract.md)
- [Correlation policy decision record](KR-BE-1-008-correlation-policy.md)
- [API contract](../../../../../docs/protocol/API_CONTRACT.md), Section 52.1 (health and readiness endpoints)
- [Backend changelog](../../../BACKEND_CHANGELOG.md), entries PB-055, PB-056 and PB-057
- [Backend security gate](../../../BACKEND_SECURITY_GATE.md)

## 1. Task Record

| Field | Value |
|---|---|
| Task | Decision input for `KR-BE-1-009` follow-up work and for the first task that registers a real readiness check. It is not a separate task and does not change the status of `KR-BE-1-009`, which stays In Review |
| Owner role | Backend Technical Lead |
| Required approvers | Backend Technical Lead. Also required for decisions 5 to 8: Database Technical Lead and Cloud/Infrastructure Owner |
| Acceptance | B-INC-001-AC-11 (not satisfied by this record) |
| Tests | BTS-008 (fake checks only; no controlled evidence against a real dependency) |
| Decision status | Proposed as a whole. Decisions 1 to 4 and 9 have owner direction (Section 3); decisions 5 to 8 are Proposed or Pending |

## 2. Why This Record Exists

`KR-BE-1-009` (PB-055, merged in PR #95) added `GET /health/live` and `GET /health/ready`. Readiness runs injected checks and none is registered because the backend has no database. PB-055 required a cancellation mechanism and a concurrency policy before a real check is registered and left the shutdown drain open. This record states the policy for that work. The owner gave direction on 2026-11-04 and 2026-11-05; it is recorded in Section 3 decision by decision, so that a general instruction is not read as approval of every engineering detail. The policy was drafted by Claude and reviewed by ChatGPT (an AI design review, not an independent human review).

## 3. Decisions and Their Disposition

Disposition vocabulary of this section: **Approved by owner direction** (the owner decided it, see Section 6), **Proposed** (a recommendation nobody has decided), **Pending** (waits for a named role).

| # | Decision | Disposition |
|---|---|---|
| 1 | **Cancellation.** The check contract becomes `(signal: AbortSignal) => boolean \| Promise<boolean>`. Each check receives its own signal, combined from the drain signal (aborted when shutdown begins) and its own timeout, so one slow check never cancels another. A check that takes no argument stays valid. Aborting a signal asks an operation to stop; it does not prove the operation stopped, so the runner stops waiting on its own timer and on draining instead of relying on the check | Approved by owner direction (2026-11-04) |
| 2 | **Timeout.** 2000 ms per check, a fixed constant with a constructor option for tests and controlled use. It is not an environment setting. Whether it becomes one is revisited when the probe settings are known | Approved by owner direction (2026-11-04) |
| 3 | **Concurrency.** At most one readiness run in flight per process; concurrent probes (`HEAD` included) await that run. The outcomes of a finished run are reused for 1000 ms, counted from the end of the run on a monotonic clock, successes and failures both. The cache holds dependency outcomes only, never "the service is ready": the draining state is re-read for every response, including cache hits. A run ended by draining is not reused. Each check has its own unsettled marker: a check that timed out is not invoked again until its underlying operation settles, other checks still run, a late result never changes one already reported, and a check that never settles keeps readiness at 503 for the life of the process (fail closed; confirmed 2026-11-05) | Approved by owner direction (2026-11-04 and 2026-11-05) |
| 4 | **Shutdown drain.** New non-secret setting `KRITVA_HTTP_SHUTDOWN_DRAIN_MS`, integer 0 to 300000, default 5000, 0 keeps the immediate shutdown. On shutdown, draining begins (active checks are aborted, readiness answers 503), the listener stays open for the drain period and application routes are still served, then the existing grace timer starts and the server closes. Worst-case shutdown is drain plus grace (5 s + 10 s = 15 s with the defaults). A second signal during the drain stays ignored, as today, and this is documented as a limitation | Approved by owner direction (2026-11-04 and 2026-11-05) |
| 5 | **Database check requirements** (binding on the first database task; no database check exists): a bounded connection-acquisition timeout; a statement timeout shorter than the runner timeout; the connection released on success, error, timeout and cancellation; readiness never runs migrations; whether the check is `SELECT 1`, a migration-state query or both is decided with `KR-BINC-001-004` | Proposed (Database Technical Lead Pending) |
| 6 | **Connection strategy.** Two options: the main application pool (leaning: a check that cannot get a normal connection shows the same failure requests would see, while a dedicated connection can report healthy during pool exhaustion), or a dedicated or reserved connection (keeps dependency reachability observable during pool saturation, and must fit the database connection budget). The final choice belongs to the Database Technical Lead in the database task | Proposed (Database Technical Lead Pending) |
| 7 | **Diagnostics.** The response body stays free of any reason, check name or error text. The failing check's name and outcome are recorded in structured logs once `KR-BE-1-041` exists, without connection strings or error text that can carry them | Proposed (requirement on `KR-BE-1-041`) |
| 8 | **Termination budget.** The deployment platform and its termination grace period are not known. The required budget is the 5-second drain plus the existing shutdown grace plus a margin for signal delivery and cleanup; it is not validated and no configuration is rejected on an assumed limit. The prober timeout, interval and failure threshold are also needed | Pending (Cloud/Infrastructure Owner) |
| 9 | **Response codes.** `SERVICE_UNAVAILABLE` (503, `UNAVAILABLE`, retryable) in the transport error registry, and the success codes `SERVICE_LIVE` and `SERVICE_READY`, as implemented by PB-055 | Approved by owner direction (2026-11-04) |

## 4. Facts Behind the Decisions

- Today's runner (`isAvailable` in `apps/backend/src/transport/health.ts`) races a check against a timer. It does not cancel the check, does not share runs between probes, and does not remember a timed-out check.
- Fastify answers `HEAD` for every `GET` route by running the same handler, so a `HEAD` probe runs the checks.
- Today `stop()` calls the `onStopping` hook, starts the grace timer and closes the listener at once, so a prober gets a refused connection and the draining 503 cannot be observed over a socket. Decision 4 changes that.
- Probe settings and the termination period are deployment facts that are not known. Commonly used defaults of orchestrators and load balancers must be confirmed against the platform actually chosen.
- The backend has no database, so decisions 5 and 6 have not been tested against a real dependency.

## 5. Evidence Required Before the First Real Check Is Registered

Tests against a real or controlled dependency showing: readiness 503 when the dependency is unavailable (BTS-008); the signal aborted at the timeout and the operation actually ending; many concurrent probes causing one dependency call per run; a check that ignores the signal not accumulating runs; no connection left held after a timeout; and a response body that discloses nothing from a failing check. Evidence from fake checks is not a substitute.

### 5.1 Not Decided and Not Changed

Not decided: decisions 5 to 8 in full, the platform, any change to the second-signal behavior, and the database check itself. This record does not satisfy `B-INC-001-AC-11` or `BTS-008` and closes no gate; `SEC-GATE-008` stays open.

## 6. Approval Record

| Approver role | Decision | Date | Evidence |
|---|---|---|---|
| Backend Technical Lead | Approved | 2026-11-05 | Scope: decisions 1 to 4 and 9 only. Decisions provided by Prithvi Raj in chat on 2026-11-04 (decisions 1, 2, 9 and the direction for 3 and 4) and 2026-11-05 (confirmation of the 5000 ms default, routes served during the drain, and fail-closed for a check that never settles), recorded under the Backend Technical Lead role (Dinesh Annayya) at Prithvi's direction. No separate confirmation from Dinesh Annayya is recorded |
| Database Technical Lead | Pending | | Decisions 5 and 6 not yet reviewed |
| Cloud/Infrastructure Owner | Pending | | Decision 8 not yet reviewed |

### 6.1 Independence

The policy was written by Claude and reviewed by ChatGPT. The decisions marked Approved by owner direction were given by the repository owner who directed the work, and are recorded under the Backend Technical Lead role at his direction without a confirmation from the person named in that role. No independent human reviewer took part. The record as a whole stays Proposed because required approver rows are Pending.
