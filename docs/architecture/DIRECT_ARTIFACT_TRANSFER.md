# Kritva RaaS Direct Artifact Transfer Architecture

## Document Control

| Field | Value |
|---|---|
| Document | Direct Artifact Transfer Architecture |
| Path | `docs/architecture/DIRECT_ARTIFACT_TRANSFER.md` |
| Project | Kritva RaaS |
| Status | Direction approved by the product owner in a working session (2026-10-19), conveyed by the owner's representative; owner confirmation pending in the pull request. Architecture not yet reviewed in detail. Nothing here is implemented |
| Decision authority | `planning/DECISIONS.md` (SYS-ADR-008) |
| Supersedes | The cloud object-storage upload and Lab Agent fetch flow for the execution artifact, in the documents listed in Section 9 |
| Owning phases | P2 BUILD & ARTIFACT, P3 CONTROL PLANE, P5 LAB AGENT |

## 1. Purpose

This document defines how a validated `.krv` execution artifact reaches a reserved destination system. The artifact travels **directly from the user's workstation to the destination system**. The cloud authenticates the user, identifies the reserved System ID, and authorizes the transfer, but it never receives, stores, or proxies the artifact bytes.

The purpose is to avoid loading the cloud with artifact traffic and storage, and to keep one more copy of the user's build output out of the cloud.

## 2. Principles

| ID | Principle |
|---|---|
| DT-REQ-01 | The cloud Control Plane MUST NOT receive, store, relay, or proxy the bytes of an execution artifact. |
| DT-REQ-02 | The Control Plane authenticates the user, resolves the reserved System ID, and issues a transfer grant scoped to one user, one reservation, one destination system, and one artifact digest. |
| DT-REQ-03 | The destination system MUST independently validate the grant. A countdown, a UI state, or a cloud message does not by itself authorize a transfer. |
| DT-REQ-04 | The destination MUST validate the artifact (manifest, size, digest, signature, platform compatibility) before it is made executable. |
| DT-REQ-05 | If the direct path is unavailable, the transfer MUST fail with a clear, categorized error. There is no silent fallback through the cloud. |
| DT-REQ-06 | The cloud records only metadata: artifact identifier, digest, size, transfer status, grant records, and audit events. |
| DT-REQ-07 | Source code never crosses this boundary; only a validated `.krv` artifact does (unchanged from `ARTIFACT_ARCHITECTURE.md`). |
| DT-REQ-08 | Results, logs, video and images are outside this decision. They continue to use the storage design in `docs/cloud/architecture/STORAGE_ARCHITECTURE.md` unless a later decision changes it. |

## 3. Flow

```
  User workstation (Studio + Local Runtime)
        |
        |  1. Build, validate, package, sign the .krv locally
        |  2. Control API: register artifact metadata (digest, size, manifest) -- no bytes
        v
  Cloud Control Plane
        |  3. Authenticate user; check reservation, authorization, destination availability
        |  4. Issue a short-lived transfer grant bound to user, reservation, System ID, digest
        |  5. Tell the destination Lab Agent to expect that transfer (grant identifier, digest, expiry)
        v
  Studio ======== 6. Direct artifact transfer (grant presented to the destination) ========> Destination / Lab Agent
                                                                  |
                                              7. Validate grant, then digest, signature, manifest
                                              8. Store locally; report status to the Control Plane (metadata only)
```

The control path (steps 2 to 5 and the status reports) uses the existing REST and WebSocket contracts. Only step 6 carries artifact bytes.

## 4. Transfer Grant

The grant is issued per transfer and MUST carry or reference at least: grant identifier, user and organization, reservation identifier and window, destination System ID, artifact identifier and digest, maximum size, permitted operation (`deliver`), issue time, expiry, and a single-use nonce. It MUST be signed by the Control Plane so that the destination can verify it without calling the cloud for every chunk. Exact claim names and the signing scheme belong in `docs/protocol/LAB_PROTOCOL.md` and `docs/protocol/AUTHENTICATION.md` and are an open item (Section 8).

Whatever the final format, the security contract MUST also cover the following requirements. They state what must be defined, not how:

| Requirement | What must be defined |
|---|---|
| Issuer and recipient | The destination knows which authority issued the grant and which System ID may accept it |
| Trust | How the destination verifies the signature, trusts the issuer's verification key, and handles key rotation |
| Transfer identity | The grant is bound to one transfer session, not reusable for arbitrary uploads |
| Replay | A replayed new transfer is rejected, while an authenticated, idempotent continuation of the same transfer is allowed. "Single use" does not mean rejecting every later request that carries the same grant |
| Transport authentication | The workstation and destination authenticate each other independently of the grant signature |
| Resource limits | The destination enforces the permitted size and operation before allocating disk or processing untrusted content |
| Secret handling | The grant never appears in URLs, command-line arguments, application logs, diagnostics, or telemetry |

## 5. Destination Behavior

Validation is staged so that a partly validated artifact can never become executable. A valid grant alone never causes content to be executed.

1. Authenticate the connection. Validate the grant, destination identity, permitted operation, expiry, and reservation authorization.
2. Check framing, declared size, resource limits, and free storage before accepting substantial data.
3. Create or resume a uniquely identified transfer in a non-executable staging area.
4. Stream the bytes while enforcing size and offset limits. Verify the final digest against the authorized digest.
5. Parse the bounded manifest and package structure safely. Verify the artifact signature and its binding to the manifest and payload. Reject unsafe archive paths, path traversal, unexpected links, malformed structures, and resource-exhaustion payloads.
6. Validate platform, runtime, compatibility, and execution policy.
7. Atomically mark the artifact `READY` only after every required check has passed.
8. Report `TRANSFER_STARTED`, `TRANSFER_PROGRESS`, `TRANSFER_COMPLETED`, `TRANSFER_FAILED` and validation results to the Control Plane as metadata. A metadata report does not prove artifact validity or execution success. The Control Plane records it as the destination's authenticated assertion with provenance (reporting System ID, transfer correlation, idempotent events, audit); a compromised destination can lie about validation, and the Control Plane cannot verify content it never receives.

Resumable transfer needs, at minimum: a stable transfer-session identity with durable received-offset state; a check that resumed data belongs to the same authorized artifact and destination; safe handling of duplicate chunks, unexpected offsets, truncated data and concurrent attempts; a final digest check after resumption (a byte offset alone is not proof that earlier data is trustworthy); deletion or quarantine of partial data after expiry, cancellation or integrity failure; and a defined recovery when the grant expires before completion.

Reservation expiry, cancellation and revocation:

- While connected, the destination receives and enforces cancellation or revocation as the final protocol defines.
- While disconnected, the destination cannot know of a cancellation that has not reached it. It enforces only the signed grant expiry and reservation window. Immediate revocation during a network partition is NOT guaranteed (DT-OD-05).
- After grant or reservation expiry no new transfer operation is authorized. What happens to a transfer in progress follows an explicit expiry policy (DT-OD-05).
- An already running physical execution is never terminated unsafely because a reservation ended. Transfer authorization, the Job and Run lifecycle, and the local safe-stop and handoff procedure are separate.

## 6. Failure Handling

| Condition | Required behavior |
|---|---|
| Destination unreachable from the workstation | Fail with a categorized error and the next recovery step. No cloud-proxied fallback |
| Grant expired or reservation ended | Reject at the destination; the client may request a new grant while the reservation is valid |
| Interrupted transfer | Resume from the last verified offset while the grant is valid; otherwise restart under a new grant |
| Digest or signature mismatch | Reject and delete; report `ARTIFACT_INVALID` |
| Destination loses cloud connectivity | Enforce only what is locally verifiable (signed grant expiry and reservation window). An unexpired grant does not prove the booking was not cancelled meanwhile. New authorization requests fail closed. Status is shown as pending or unreported, never as cloud-confirmed. State is reconciled idempotently on reconnection. Robot state is never inferred from a lost connection alone |
| Cloud unavailable during transfer | Whether an accepted transfer may complete is bounded by DT-OD-05; the status is reported when the cloud returns |

## 7. Acceptance Tests

| ID | Test |
|---|---|
| DT-AT-01 | A packet capture or storage audit of a complete transfer shows no artifact bytes at the Control Plane or in cloud object storage |
| DT-AT-02 | A transfer without a grant, with an expired grant, with a grant for another System ID, or with a replayed grant is rejected by the destination |
| DT-AT-03 | A tampered artifact is rejected by digest or signature verification |
| DT-AT-04 | A transfer attempted after reservation expiry or cancellation is rejected and partial data removed |
| DT-AT-05 | With the destination unreachable, the client reports a clear failure and nothing is uploaded to the cloud |
| DT-AT-06 | An interrupted transfer resumes from a verified offset and ends with the same digest |
| DT-AT-07 | A replayed new transfer is rejected, while an authenticated continuation of the same transfer is accepted |
| DT-AT-08 | A partially validated artifact is never marked `READY` or executable, and an archive with an unsafe path or link is rejected |

## 8. Open Items (not decided)

| ID | Open item | Needed before |
|---|---|---|
| DT-OD-01 | Connectivity model. Candidates, none chosen: (A) a direct endpoint over private connectivity such as a routed lab network, VPN or overlay; (B) a restricted, directly reachable Lab Agent endpoint, with its exposure and firewall risks assessed; (C) a Lab Agent-initiated connection to a workstation listener where the workstation is reachable; (D) peer-to-peer NAT traversal with a rendezvous service for connection metadata only. A relay that carries artifact bytes, including a TURN-style relay, violates DT-REQ-01 and DT-REQ-05. The comparison covers network prerequisites, NAT and firewall compatibility, exposure, operational complexity and failure behavior. If no direct path can be set up, the result is a categorized failure | P5 LAB AGENT design acceptance |
| DT-OD-02 | Grant claim names, signing algorithm, key rotation, and transport authentication between workstation and destination | P3 CONTROL PLANE authentication acceptance |
| DT-OD-03 | Whether any cloud retention of artifacts (for example for reproducibility or support) is wanted. If so it is a separate feature with its own decision and consent, not a fallback | Owner decision |
| DT-OD-04 | Capacity and bandwidth assumptions for large artifacts on lab networks | Capacity and load test plan |
| DT-OD-05 | Offline cancellation and revocation policy: whether revocation is immediate only when delivered, whether a bounded stale-authorization interval is accepted, and what happens to an interrupted or in-progress transfer during it | P3 CONTROL PLANE and P5 LAB AGENT design acceptance |

## 9. Documents Affected

Each document below carries a notice pointing here. The detailed flow sections still describe the superseded cloud-storage route until each document is revised in a follow-up change. When a document is revised, its notice and this table are updated to list only what remains superseded.

| Document | Sections that describe the superseded route |
|---|---|
| `docs/architecture/ARTIFACT_ARCHITECTURE.md` | Revised in part (core flow, trust, validation, storage, delivery sections). Remaining sections listed in the document's notice |
| `docs/architecture/SYSTEM_ARCHITECTURE.md` | Revised in part (paths, trust model, ownership, risks, checklists). Command and event names that contain `upload` remain historical |
| `docs/architecture/CLOUD_ARCHITECTURE.md` | Revised in part (object storage, transfer path, phase 2). Remaining mentions refer to metadata |
| `docs/cloud/architecture/STORAGE_ARCHITECTURE.md` | Revised in part (artifact handling, lifecycle, access, checklists). Upload and signed-URL sections now apply to results and media |
| `docs/architecture/LAB_ARCHITECTURE.md` | Revised in part (receipt, integrity, revocation, network, trust chain). Connectivity open |
| `docs/architecture/API_ARCHITECTURE.md` | Revised in part (artifact API, flow, status reporting). Grant operation open |
| `docs/backend/architecture/ARTIFACT_SERVICE.md` | Revised in part (registration, grant binding, transfer states, failure modes). Later upload sections remain, listed in the notice |
| `docs/protocol/LAB_PROTOCOL.md` | `artifact_fetch` and `artifact_fetch_ack` marked superseded; replacement wire contract open (not defined) |
| `docs/protocol/COMMANDS.md` | `artifact.upload`, `artifact.download` and `artifact.fetch` marked superseded; replacements open (not defined) |
| `docs/protocol/AUTHENTICATION.md`, `PROTOCOL_OVERVIEW.md`, `IDEMPOTENCY.md` | Revised in part (group 1): grant authentication requirements (AUTHENTICATION 141.1), flows and command lists, transfer replay versus continuation and status report reconciliation. Wire contract still open |
| `docs/security/SECURITY_REQUIREMENTS.md`, `TENANT_ISOLATION.md`, `SOURCE_CODE_PRIVACY.md` | Revised in part (group 2): artifact requirements SEC-065 to SEC-143, artifact security model, object storage scoped to results, logs and media, grant tenant binding, metadata-only registration, destination-side validation and inspection. Grant claims, key handling and connectivity still open |
| `docs/security/THREAT_MODEL.md` | Revised: TB-04 scoped to results and media, TB-09, direct path data flow and STRIDE, AS-036 to AS-044. Not a completed security review |

Suggested order for the remaining documents (AI review RAAS-DOCS-REVIEW-2, not an approval; groups 1 and 2, the protocol and security documents, are revised in part): (3) `NETWORK_ARCHITECTURE.md`, `DESKTOP_ARCHITECTURE.md`, with options A to D compared and none chosen; (4) `BACKEND_ARCHITECTURE.md`, `APPLICATION_ARCHITECTURE.md`, `ARTIFACTS.md`, `DATA_OWNERSHIP.md`; (5) `OBSERVABILITY_ARCHITECTURE.md` and deployment documents. The F-M03 and B-M02 milestone folders and the task and roadmap records are not changed without an authorized task scope.

Other documents that mention the superseded route and are not in the table above, found by a repository search on 2026-10-19 and not yet reviewed: `docs/architecture/BACKEND_ARCHITECTURE.md`, `docs/architecture/APPLICATION_ARCHITECTURE.md`, `docs/architecture/DESKTOP_ARCHITECTURE.md`, `docs/database/schema/ARTIFACTS.md`, `docs/database/architecture/DATA_OWNERSHIP.md`, `docs/cloud/architecture/NETWORK_ARCHITECTURE.md`, `docs/cloud/architecture/OBSERVABILITY_ARCHITECTURE.md`, `docs/cloud/deployment/`, and the F-M03 and B-M02 milestone folders and planning roadmaps and task lists. Milestone and task records change only with an authorized scope.
