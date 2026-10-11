# KR-BE-1-007 — Canonical REST API v1 Error Envelope

## Document Control

| Field | Value |
|---|---|
| Document | KR-BE-1-007 Error Envelope Decision Record |
| Path | `planning/backend/increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BE-1-007-error-envelope.md` |
| Status | Approved |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Increment tasks](../TASKS.md)
- [Increment acceptance criteria](../ACCEPTANCE_CRITERIA.md)
- [HTTP framework decision record](KR-BINC-001-003-http-framework.md)
- [API contract](../../../../../docs/protocol/API_CONTRACT.md), Sections 18 to 20
- [Response specification](../../../../../docs/protocol/RESPONSES.md)
- [Error code registry](../../../../../docs/protocol/ERROR_CODES.md)

## 1. Task Record

| Field | Value |
|---|---|
| Task | Decision input for `KR-BE-1-007` (Implement validation/error contract). It is not a separate task and does not change the status of `KR-BE-1-007` |
| Owner role | Backend Technical Lead |
| Required approvers | Backend Technical Lead |
| Acceptance | B-INC-001-AC-08 (not satisfied by this record) |
| Tests | BTS-007 (NOT RUN against the final contract) |
| Decision status | Approved on 2026-10-11 for the error envelope only, within the scope in Section 6 |

## 2. The Conflict

Three protocol documents described REST error bodies differently.

| Source | Error body | Codes |
|---|---|---|
| `API_CONTRACT.md` Section 18 (before this record) | A single nested `error` object with `code`, `message`, `retryable`, `request_id`, `correlation_id` and a `details` array | `VALIDATION_ERROR`, `INVALID_JSON`, `UNAUTHENTICATED`, `RESOURCE_NOT_FOUND`, `METHOD_NOT_ALLOWED`, `RATE_LIMITED` and others |
| `RESPONSES.md` Section 7 and `ERROR_CODES.md` Section 6 | A full envelope: `protocol_version`, `request_id`, `timestamp`, `status`, `code`, `message`, `data`, `error` with `details`, `retryable` and `field_errors` | `INVALID_REQUEST`, `MISSING_REQUIRED_FIELD`, `FIELD_INVALID`, `AUTH_REQUIRED`, `RESOURCE_NOT_FOUND`, `RATE_LIMIT_EXCEEDED` and domain codes |

The transport of `KR-BE-1-004` followed `API_CONTRACT.md` Section 18 provisionally and says so. The conflict was put to an AI design inspection (ChatGPT, `main` at `fb01b9e`), which recommended the full envelope with an explicit owner decision. That inspection is an input, not an independent human review.

## 3. Decision

The canonical error-response envelope for REST API v1 is the full response envelope of `RESPONSES.md` Section 7 with the error model of `ERROR_CODES.md` Sections 6 to 8. Codes come from the `ERROR_CODES.md` registry. `API_CONTRACT.md` Sections 18 and 20 and its three error examples are updated to conform. This is done in the same change as this record.

## 4. What Changed in the Documents

- `API_CONTRACT.md` Section 18 now defines the full envelope and says it replaces the nested object. Section 20 lists the retired codes with the registry code and `status` that replaces each. Sections 21, 29 (cancel conflict), 37, 56 and the idempotency, validation and rate-limit examples use the registry codes.
- `RESPONSES.md` and `ERROR_CODES.md` are not changed by this record.

## 5. Gaps This Decision Exposes (Proposed, not approved)

> Update 2026-10-11: `KR-BE-1-007-response-contract.md` approves `METHOD_NOT_ALLOWED` and `PAYLOAD_TOO_LARGE`, defers `RESOURCE_GONE`, wraps success responses, fixes the request-ID rule and states the `SEC-GATE-009` relationship. The text below is the record as approved on that date.

The registry has no generic code for three cases the transport already produces or the contract already names. These are proposals for the owner. None is approved and `ERROR_CODES.md` is not changed.

| Case | Proposal | HTTP and `status` |
|---|---|---|
| Method not supported for a known path | Add `METHOD_NOT_ALLOWED` to the generic registry | 405, `INVALID_REQUEST` |
| Request body over the limit | Add `PAYLOAD_TOO_LARGE` to the generic registry (`ARTIFACT_TOO_LARGE` is artifact-specific) | 413, `REJECTED` |
| Resource permanently unavailable | Add `RESOURCE_GONE` to the generic registry | 410, `NOT_FOUND` |

Also proposed: malformed JSON uses `INVALID_REQUEST` and needs no new code; the HTTP mapping table of `ERROR_CODES.md` Section 16 gains 405 and 410.

Until those are approved, `KR-BE-1-007` may not invent codes. It either uses `INVALID_REQUEST` for these cases and records the limitation, or waits for the registry change.

## 6. Scope: What Is and Is Not Decided

Decided: the error envelope and the use of the `ERROR_CODES.md` registry for REST API v1.

Not decided here, and needed before or during `KR-BE-1-007`:

1. **Success responses.** `API_CONTRACT.md` Section 13 says a success response is the endpoint's resource representation. `RESPONSES.md` wraps success in the same envelope with `data`. This record changes errors only. Whether success is also wrapped must be decided before the first endpoint returns data. Recommendation: wrap success in the same envelope, so a client reads one shape. It changes every endpoint example in the catalogue.
2. **Request ID.** The envelope requires a `request_id`, so a null value is no longer allowed. The transport has none today. `KR-BE-1-007` therefore needs the request-ID source from the request-context task (`KR-BE-1-005`) or an agreed interim rule. Recommendation: build the request-ID part of `KR-BE-1-005` first, without principal or tenant semantics. The task register lists only `KR-BE-1-006` as a dependency of `KR-BE-1-007`; that is not changed here.
3. **Correlation.** The envelope has no correlation field. `X-Correlation-ID` stays a request header. Where it is reflected is decided with `KR-BE-1-005` and `KR-BE-1-008`.
4. **Other documents.** `BACKEND_ARCHITECTURE.md` Sections 52 to 57 and `API_ARCHITECTURE.md` may describe the older shape. They have not been checked in this change.
5. **Traceability.** `SEC-GATE-009` is defined as logging redaction in `BACKEND_SECURITY_GATE.md`, yet `B-INC-001-AC-08` and `KR-BE-1-007` link it. The owner reconciles the mapping or states the intended relationship. No gate is claimed here.
6. **Implementation.** The provisional `apps/backend/src/transport/error-contract.ts` still produces the old nested body. It is changed by `KR-BE-1-007`, not by this record.

This decision does not approve domain routes, authentication behavior or any other protocol change.

## 7. Approval Record

| Approver role | Decision | Date | Evidence |
|---|---|---|---|
| Backend Technical Lead | Approved | 2026-10-11 | Dinesh Annayya, acting as Backend Technical Lead, chose the full `RESPONSES.md` envelope in session on 2026-10-11 after the two options and the AI design inspection were put to him |

### 7.1 Independence

The approver is also the owner who directed the work. The recommendation came from an AI design inspection and from Claude, and no independent human reviewer took part. An Approved decision does not make `KR-BE-1-007` or `B-INC-001-AC-08` Accepted; neither is implemented against this contract yet.
