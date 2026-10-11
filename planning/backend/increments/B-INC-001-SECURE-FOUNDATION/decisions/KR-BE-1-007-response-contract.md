# KR-BE-1-007 — REST API v1 Response Contract

## Document Control

| Field | Value |
|---|---|
| Document | KR-BE-1-007 Response Contract Decision Record |
| Path | `planning/backend/increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BE-1-007-response-contract.md` |
| Status | Approved |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Increment tasks](../TASKS.md)
- [Increment acceptance criteria](../ACCEPTANCE_CRITERIA.md)
- [Error envelope decision record](KR-BE-1-007-error-envelope.md), which this record completes
- [API contract](../../../../../docs/protocol/API_CONTRACT.md), Sections 12, 13, 18 and 20
- [Response specification](../../../../../docs/protocol/RESPONSES.md)
- [Error code registry](../../../../../docs/protocol/ERROR_CODES.md)
- [Security gate record](../../../BACKEND_SECURITY_GATE.md)

## 1. Task Record

| Field | Value |
|---|---|
| Task | Decision input for `KR-BE-1-007` (Implement validation/error contract). It is not a separate task and does not change the status of `KR-BE-1-007`, which stays Proposed |
| Owner role | Backend Technical Lead |
| Required approvers | Backend Technical Lead |
| Acceptance | B-INC-001-AC-08 (not satisfied by this record) |
| Tests | BTS-007 (NOT RUN against the final contract) |
| Decision status | Approved on 2026-10-11, within the scope in Section 7 |

## 2. Why This Record Exists

The error envelope record (`KR-BE-1-007-error-envelope.md`, approved 2026-10-11) decided errors only and left six items open. The request-ID part of `KR-BE-1-005` has since been merged (PB-042). An AI design inspection (ChatGPT) ranked deciding the whole response contract before implementing `KR-BE-1-007` first among five options, and the Backend Technical Lead chose that option in session. The inspection is an input, not an independent human review.

## 3. Decisions

| # | Decision |
|---|---|
| 1 | **Success responses are wrapped.** Every REST API v1 response that has a body uses the full envelope of `RESPONSES.md` Section 7. A success has `status` from `RESPONSES.md` Section 13 (for example `SUCCESS` or `ACCEPTED`), a stable `code` defined by the endpoint contract, `data` with the payload, and `error` null. A collection's payload is the `items` and `page` object of `API_CONTRACT.md` Section 15.1. A `204` has no body and so no envelope |
| 2 | **Request ID.** The server generates `request_id` for every request. It equals the `X-Request-ID` response header. A client `X-Request-ID` or `X-Correlation-ID` is ignored and not echoed. A trusted-gateway exception needs its own decision. `RESPONSES.md` Section 11 is amended: the echo rule applies to protocols whose request carries a `request_id`, not to REST API v1 |
| 3 | **Correlation.** The envelope has no correlation field. Whether a validated `X-Correlation-ID` is accepted and reflected is decided with `KR-BE-1-008` |
| 4 | **Registry additions.** `METHOD_NOT_ALLOWED` (405, `status` `INVALID_REQUEST`, with an `Allow` header) and `PAYLOAD_TOO_LARGE` (413, `status` `REJECTED`) are added to `ERROR_CODES.md` because the transport already produces both cases. `ARTIFACT_TOO_LARGE` stays artifact-specific. `RESOURCE_GONE` (410) is deferred: no endpoint needs it yet and its semantics are undefined. Malformed JSON uses `INVALID_REQUEST` and needs no new code. The `VALIDATION_ERROR` versus `INVALID_REQUEST` conflict was already settled by `API_CONTRACT.md` Section 20 |
| 5 | **Safe responses.** Messages and details never contain credentials, internal exception text, stack traces or submitted values (`API_CONTRACT.md` Section 18). Tests for `KR-BE-1-007` must assert this for validation, 404, 405, 413 and unexpected errors |
| 6 | **SEC-GATE-009 relationship.** `SEC-GATE-009` is the logging-redaction gate (`BACKEND_SECURITY_GATE.md`). It is not conformance evidence for the response contract. For `B-INC-001-AC-08` it applies only to error content reaching logs. It stays open until logging redaction tests inject synthetic credentials into representative logging paths and show none in the emitted logs. Response-contract tests are not closure evidence. The links in `TASKS.md` and the commit trailers of merged commits are left unchanged; removing the link from AC-08, `KR-BE-1-006` and `KR-BE-1-007` is a separate owner decision |

## 4. What Changed in the Documents

- `API_CONTRACT.md`: Section 12 (request ID rule), Section 13 (success wrapping, `204`, request ID), Section 15.1 (collection as `data`), Section 18 (correlation sentence), Section 20 (405 and 413 rows, 410 deferred).
- `RESPONSES.md`: Section 11 (REST API v1 request-ID rule) and the HTTP mapping gains 405 and 413.
- `ERROR_CODES.md`: Sections 25.11 `METHOD_NOT_ALLOWED` and 25.12 `PAYLOAD_TOO_LARGE`, and the HTTP mapping table of Section 16.
- `ACCEPTANCE_CRITERIA.md` and `TEST_PLAN.md`: a note on `B-INC-001-AC-08` stating decision 6. Links are unchanged.

## 5. Consequences for KR-BE-1-007

`KR-BE-1-007` replaces the provisional nested body of `apps/backend/src/transport/error-contract.ts` with the full envelope, adds a success-envelope helper, and tests success, validation, 404, 405, malformed JSON, oversized bodies, unexpected errors and request-ID consistency with the `X-Request-ID` header. It may start now. It must not add domain behavior and must not claim `BTS-032`.

## 6. Not Changed

`RESPONSES.md` and `ERROR_CODES.md` otherwise, endpoint success codes (each endpoint's task defines them), `apps/backend`, dependencies, CI and task statuses.

## 7. Scope: What Is and Is Not Decided

Decided: the items in Section 3. Not decided: success `code` values per endpoint, correlation handling (`KR-BE-1-008`), `RESOURCE_GONE`, removal of the `SEC-GATE-009` link from AC-08, other documents that may describe the older shape (`BACKEND_ARCHITECTURE.md` Sections 52 to 57 and `API_ARCHITECTURE.md` are still unchecked), authentication, authorization, tenant semantics and domain routes. This record does not satisfy `B-INC-001-AC-07`, `B-INC-001-AC-08`, `BTS-006` or `BTS-032`, and closes no gate.

## 8. Approval Record

| Approver role | Decision | Date | Evidence |
|---|---|---|---|
| Backend Technical Lead | Approved | 2026-10-11 | Dinesh Annayya chose the option "decide the whole response contract first", which includes wrapping success responses, then implementing `KR-BE-1-007`. Decisions 2 to 6 and the registry details (add 405 and 413, defer 410) are Claude's recommendation within that option; they take effect when he reviews and merges this change, and he may amend them |

### 8.1 Independence

The approver is also the owner who directed the work. The recommendation came from an AI design inspection and from Claude, and no independent human reviewer took part. An Approved decision does not make `KR-BE-1-007` or `B-INC-001-AC-08` Accepted.
