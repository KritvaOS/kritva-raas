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

## 5. Destination Behavior

1. Accept a transfer only with a valid, unexpired, unused grant for its own System ID.
2. Support resumable transfer and reject chunks that do not match the grant's digest and size.
3. Verify the digest, signature, manifest, and platform compatibility before marking the artifact `READY`.
4. Refuse and report a transfer if the reservation window has ended; remove partial data.
5. Revoke access when a reservation is cancelled or expires. A transfer in progress is stopped; an already running physical execution is not terminated unsafely, and its state is reported as it is actually known.
6. Report `TRANSFER_STARTED`, `TRANSFER_PROGRESS`, `TRANSFER_COMPLETED`, `TRANSFER_FAILED` and validation results to the Control Plane as metadata.

## 6. Failure Handling

| Condition | Required behavior |
|---|---|
| Destination unreachable from the workstation | Fail with a categorized error and the next recovery step. No cloud-proxied fallback |
| Grant expired or reservation ended | Reject at the destination; the client may request a new grant while the reservation is valid |
| Interrupted transfer | Resume from the last verified offset while the grant is valid; otherwise restart under a new grant |
| Digest or signature mismatch | Reject and delete; report `ARTIFACT_INVALID` |
| Destination loses cloud connectivity | Keep enforcing the grant it already holds; do not accept new grants until it is reconnected |
| Cloud unavailable during transfer | An accepted transfer may complete; the status is reported when the cloud returns |

## 7. Acceptance Tests

| ID | Test |
|---|---|
| DT-AT-01 | A packet capture or storage audit of a complete transfer shows no artifact bytes at the Control Plane or in cloud object storage |
| DT-AT-02 | A transfer without a grant, with an expired grant, with a grant for another System ID, or with a replayed grant is rejected by the destination |
| DT-AT-03 | A tampered artifact is rejected by digest or signature verification |
| DT-AT-04 | A transfer attempted after reservation expiry or cancellation is rejected and partial data removed |
| DT-AT-05 | With the destination unreachable, the client reports a clear failure and nothing is uploaded to the cloud |
| DT-AT-06 | An interrupted transfer resumes from a verified offset and ends with the same digest |

## 8. Open Items (not decided)

| ID | Open item | Needed before |
|---|---|---|
| DT-OD-01 | Connectivity model: a destination endpoint reachable by the workstation, or a connection the Lab Agent initiates and the workstation joins, while the cloud still carries no bytes. Network traversal for labs behind NAT or firewalls | P5 LAB AGENT design acceptance |
| DT-OD-02 | Grant claim names, signing algorithm, key rotation, and transport authentication between workstation and destination | P3 CONTROL PLANE authentication acceptance |
| DT-OD-03 | Whether any cloud retention of artifacts (for example for reproducibility or support) is wanted. If so it is a separate feature with its own decision and consent, not a fallback | Owner decision |
| DT-OD-04 | Capacity and bandwidth assumptions for large artifacts on lab networks | Capacity and load test plan |

## 9. Documents Affected

Each document below carries a notice pointing here. The detailed flow sections still describe the superseded cloud-storage route until each document is revised in a follow-up change.

| Document | Sections that describe the superseded route |
|---|---|
| `docs/architecture/ARTIFACT_ARCHITECTURE.md` | Upload authorization, object storage relationship, artifact download |
| `docs/architecture/SYSTEM_ARCHITECTURE.md` | Studio to object storage access, object storage role for artifacts |
| `docs/architecture/CLOUD_ARCHITECTURE.md` | Object storage as artifact store |
| `docs/cloud/architecture/STORAGE_ARCHITECTURE.md` | Artifact binary store, upload flow |
| `docs/architecture/LAB_ARCHITECTURE.md` | Artifact download from object storage |
| `docs/architecture/API_ARCHITECTURE.md` | Artifact upload authorization and download |
| `docs/backend/architecture/ARTIFACT_SERVICE.md` | Upload session, controlled fetch authorization |
| `docs/protocol/LAB_PROTOCOL.md` | `artifact_fetch` and `artifact_fetch_ack` |
| `docs/protocol/COMMANDS.md` | Artifact upload and fetch commands |
| `docs/security/THREAT_MODEL.md` | Control Plane to object storage trust boundary for artifacts |
