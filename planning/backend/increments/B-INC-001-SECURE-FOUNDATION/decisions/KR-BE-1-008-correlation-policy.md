# KR-BE-1-008 — Request Correlation Policy

## Document Control

| Field | Value |
|---|---|
| Document | KR-BE-1-008 Request Correlation Policy Decision Record |
| Path | `planning/backend/increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BE-1-008-correlation-policy.md` |
| Status | Approved |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Increment tasks](../TASKS.md)
- [Increment acceptance criteria](../ACCEPTANCE_CRITERIA.md)
- [Response contract decision record](KR-BE-1-007-response-contract.md), decision 3, which left this open
- [API contract](../../../../../docs/protocol/API_CONTRACT.md), Sections 12 and 13
- [Backend changelog](../../../BACKEND_CHANGELOG.md), entry PB-056
- [Backend security gate](../../../BACKEND_SECURITY_GATE.md)

## 1. Task Record

| Field | Value |
|---|---|
| Task | Decision input for `KR-BE-1-008` (Implement request correlation). It is not a separate task and does not change the status of `KR-BE-1-008`, which stays Proposed until the implementation is delivered |
| Owner role | Backend Technical Lead |
| Required approvers | Backend Technical Lead |
| Acceptance | B-INC-001-AC-07 (not satisfied by this record); B-INC-001-AC-10 (not touched) |
| Tests | BTS-005, BTS-006 (NOT RUN against the final behavior); BTS-009 (not touched) |
| Decision status | Approved by owner direction on 2026-11-05, within the scope in Section 5 |

## 2. Why This Record Exists

`KR-BE-1-007-response-contract.md` decision 3 left open whether a validated `X-Correlation-ID` is accepted and reflected, and said the question is decided with `KR-BE-1-008`. `API_CONTRACT.md` Section 12 already requires validation of a client value against length and character constraints and forbids using it as a credential. The owner confirmed the policy below after it was drafted by Claude and reviewed by ChatGPT (an AI design review, not an independent human review).

## 3. Decisions

| # | Decision |
|---|---|
| 1 | **Two identifiers.** The request ID (`X-Request-ID`, `request_id`) stays as decided: server generated, client value ignored and never echoed. The correlation ID is a separate identifier carried in the request context and never replaces the request ID |
| 2 | **Accepted client value.** A client `X-Correlation-ID` is accepted only if it consists of 8 to 64 characters, each one of `A-Z`, `a-z`, `0-9`, `.`, `_`, `-`. The value is used exactly as sent, with case preserved. The bounds are a fixed server policy, not environment settings |
| 3 | **Replace, never reject.** An absent header, an empty value, a value outside the rule, and a header sent more than once (which joins into a value containing a separator and so fails the rule) are replaced by a server-generated identifier. The request is not rejected because of its correlation header, because correlation metadata must not decide whether an otherwise valid request is served |
| 4 | **Generated value.** `cor-` followed by a random UUID (`cor-<uuid>`), produced by the server and never derived from request data |
| 5 | **Reflection.** The effective identifier (the accepted client value or the generated one) is returned in the `X-Correlation-ID` response header on every application-generated response for a request that enters the Fastify lifecycle, including 404, 405, 413 and 500 responses, router errors that run before the hooks, health responses and `HEAD`. A request rejected by the HTTP parser before the framework builds a request cannot receive application-level handling and is outside this guarantee |
| 6 | **No envelope field.** The response body gains no correlation field (`KR-BE-1-007-response-contract.md` decision 3). `API_CONTRACT.md` Section 13 is updated to say so |
| 7 | **Never a credential.** The correlation ID is never used for authentication or authorization, and never placed in a URL or a response body |
| 8 | **Logging rule.** The unvalidated header value is never logged and never interpolated into free-form text. The validated effective identifier may become a structured log field when `KR-BE-1-041` exists. `KR-BE-1-008` adds no logger |
| 9 | **No outbound propagation yet.** Propagation to downstream calls (`API_CONTRACT.md` Section 52) waits for the first real downstream integration |

## 4. Authorization to Start KR-BE-1-008

`KR-BE-1-008` depends on `KR-BE-1-005`, which is In Review for the request ID only and is not Accepted. The owner explicitly authorized starting `KR-BE-1-008` while `KR-BE-1-005` remains In Review, on 2026-11-05. This follows the same kind of explicit owner decision recorded for `KR-BE-1-003`; it is not an automatic consequence of that precedent. The authorization does not accept `KR-BE-1-005`, does not change its status, and does not waive any requirement of `KR-BE-1-008`.

## 5. Scope: What Is and Is Not Decided

Decided: the items in Section 3 and the authorization in Section 4. Not decided: structured log field names and format (`KR-BE-1-041`), any use of the identifier beyond diagnostics, trusted-gateway handling of a correlation header, and propagation to downstream services. This record does not satisfy `B-INC-001-AC-07`, `B-INC-001-AC-10`, `BTS-006` or `BTS-009`, and closes no gate. `SEC-GATE-009` stays open: nothing is logged by this task.

## 6. Approval Record

| Approver role | Decision | Date | Evidence |
|---|---|---|---|
| Backend Technical Lead | Approved | 2026-11-05 | Decision provided by Prithvi Raj in chat on 2026-11-05, recorded under the Backend Technical Lead role (Dinesh Annayya) at Prithvi's direction. No separate confirmation from Dinesh Annayya is recorded |

### 6.1 Independence

The recommendation came from Claude and an AI design review (ChatGPT). The decision was given by the repository owner who directed the work, and it is recorded under the Backend Technical Lead role at his direction without a confirmation from the person named in that role. No independent human reviewer took part. An Approved decision does not make `KR-BE-1-008`, `B-INC-001-AC-07` or any gate Accepted or closed.
