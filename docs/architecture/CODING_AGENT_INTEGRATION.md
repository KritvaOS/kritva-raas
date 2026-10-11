# Kritva RaaS Coding-Agent Integration Architecture

## Document Control

| Field | Value |
|---|---|
| Document | Coding-Agent Integration Architecture |
| Path | `docs/architecture/CODING_AGENT_INTEGRATION.md` |
| Project | Kritva RaaS |
| Status | Proposed architecture baseline (governed by SYS-ADR-007) |
| Revision | 3: incorporates external review findings CA-REV-001 to CA-REV-012 and the reviewer's follow-up (tier rules, definition-hash approval binding, policy states, decision owners). Disposition in `docs/tracking/AUDIT_RESPONSE_2026-10-10.md` Section 4.3 |
| Priority | PRI-1 (the capability is part of the primary product path; using it is optional for each user) |
| Owning phases | P1 STUDIO, P2 BUILD & ARTIFACT, P3 CONTROL PLANE |
| Owning milestones | F-M01 STUDIO FOUNDATION, F-M02 PROJECTS, F-M03 BUILD & ARTIFACT, B-M01 CONTROL PLANE, B-M03 PLATFORM, DB-M02 CORE DATA |
| Decision authority | `planning/DECISIONS.md` (SYS-ADR-007) |

## Ownership and Boundaries

This document owns the cross-domain architecture for integrating external coding agents (initially Anthropic Claude Code and OpenAI Codex) into Kritva RaaS Studio. It covers:

- the provider adapter contract;
- isolation tiers and permission modes;
- change sets, the session journal and recovery;
- the Studio IPC surface;
- the local Kritva Studio MCP tool server;
- data-flow, egress and consent rules;
- organization policy and provider metadata;
- build provenance;
- failure handling;
- verification and exit gates.

It does not own:

| Subject | Owning document |
|---|---|
| Milestone scope, tasks and acceptance | The F-M01, F-M02, F-M03, B-M01, B-M03 and DB-M02 dossiers |
| IPC wire details and command naming conventions | `docs/frontend/architecture/IPC_ARCHITECTURE.md` |
| Local Runtime process model | `docs/frontend/architecture/LOCAL_RUNTIME_ARCHITECTURE.md` |
| REST endpoint conventions | `docs/protocol/API_CONTRACT.md` |
| Source-privacy guarantees | `docs/security/SOURCE_CODE_PRIVACY.md` |
| Security requirements | `docs/security/SECURITY_REQUIREMENTS.md` |
| Test strategy | `docs/development/TESTING_STRATEGY.md` |
| Risks | `docs/tracking/RISK_REGISTER.md` |

This document covers coding agents as a product capability for Kritva customers. Coding agents that the Kritva engineering team uses to build Kritva itself are governed by `docs/development/DEVELOPMENT_WORKFLOW.md`, not by this document.

## 1. Purpose

Kritva customers develop robot applications locally in Studio, build a signed `.krv` artifact, and run it remotely. Coding agents can help write, explain, refactor and fix that local code. This document defines how Studio integrates such agents without weakening four existing system invariants:

1. Kritva-operated services never receive customer source code.
2. React never executes arbitrary processes; the Rust Local Runtime owns process launch.
3. Only validated, signed artifacts cross the remote-execution boundary.
4. Software success is never treated as robot-safety approval.

Security claims in this document are limited to what the listed controls can enforce. Where a control only detects a problem, or applies only on some operating systems, the document says so.

## 2. Product Requirements

| ID | Requirement |
|---|---|
| CA-REQ-01 | Studio offers Claude Code and OpenAI Codex as selectable coding-agent providers. Additional providers can be added through the same adapter contract without UI or backend redesign. |
| CA-REQ-02 | The capability is delivered as part of the primary product path (PRI-1). Use of it is optional: Studio, build, validation, packaging, booking and execution work fully when no provider is installed, signed in, consented or permitted. |
| CA-REQ-03 | Agents operate only on the local project selected in Studio, through the Rust Local Runtime. |
| CA-REQ-04 | The user explicitly consents, per project and provider, before any session starts (Section 4.3). |
| CA-REQ-05 | No agent change reaches the user's working tree until the user applies it. Every change is reviewable as a change set and can be applied in full or in part, rejected or reverted (Section 5.5). |
| CA-REQ-06 | Agent success is not build success, artifact acceptance or safety approval. Studio's existing build, test, privacy-scan, validation and signing gates apply unchanged. |
| CA-REQ-07 | Agents can call a defined set of Kritva Studio tools through a local MCP server (Section 7). Agents cannot upload, sign, book, spend credits, start Jobs or Runs, or command robots. |
| CA-REQ-08 | Organizations can govern use through a Control Plane policy (Section 8). |
| CA-REQ-09 | The Control Plane publishes provider metadata, kept separate from robot platform metadata. |
| CA-REQ-10 | Provider failure, including a missing CLI, expired sign-in, outage, unsupported version or crash, is isolated and never breaks normal Studio operation. |
| CA-REQ-11 | Consent can be withdrawn at any time, and withdrawal takes effect on active sessions (Section 8.4). |
| CA-REQ-12 | In a Kritva-launched session, the only MCP server Kritva connects is the Kritva Studio MCP server. Provider configuration that adds tools is isolated where the provider allows it, and disclosed where it does not (Section 5.8). |

## 3. Architecture Overview

    +------------------------------------------------------------------+
    |                     DEVELOPER MACHINE                            |
    |                                                                  |
    |  Studio UI (React/TypeScript)                                    |
    |    provider picker | consent | session view | change review      |
    |              |  typed IPC (agent.*)        ^ agent.* events      |
    |              v                             |                     |
    |  Studio Local Runtime (Rust/Tauri)                               |
    |    Session Manager + Session Journal + Workspace Lock            |
    |    Provider Adapters (Claude Code, Codex, Mock)                  |
    |    Staging Workspace | Change-Set Service | Env Sanitizer        |
    |    Isolation Launcher | Workspace Guard (detection only)         |
    |    Kritva Studio MCP Server  <-- tool calls from agent process   |
    |              |                                                   |
    |              v                                                   |
    |  Provider CLI process (user-installed, user-authenticated)  -----+--> Provider service
    |    cwd = per-session staging workspace                           |    (Anthropic / OpenAI)
    +------------------------------+-----------------------------------+
                                   | policy + provider metadata (read)
                                   | no source, prompts, transcripts or diffs
                                   v
    +------------------------------------------------------------------+
    |  Kritva Control Plane                                            |
    |    B-M01: organization coding-agent policy                       |
    |    B-M03: coding-agent provider metadata                         |
    +------------------------------------------------------------------+

The agent never works in the user's working tree. It works in a per-session staging workspace (Section 5.5), and Studio applies reviewed changes back.

## 4. Source Privacy, Egress and Consent

### 4.1 Guarantee

The guarantee is precise: **Kritva-operated services do not receive customer source code, prompts, agent transcripts or diffs through this capability.** Any exception requires its own decision record.

Coding-agent providers are third parties that the user chooses. During a session, the provider receives the content the agent reads, under the user's provider account and terms. Provider CLIs may also have their own telemetry, error reporting and network dependencies. Kritva does not control these, and the disclosure says so plainly.

### 4.2 Kritva-Controlled Egress Inventory

Every Kritva-controlled path that can leave the machine has a rule and a negative test:

| Egress path | Rule for coding-agent content | Negative test |
|---|---|---|
| Control Plane REST API | Policy and provider-metadata reads only; no content fields accepted | API contract test rejects content fields; network capture |
| WebSocket | No agent events published | Network capture |
| Product telemetry | No agent content; no session telemetry by default (Section 8.6) | Telemetry payload inspection |
| Crash reports | Agent output, task text, paths and diffs excluded; stack traces redacted | Crash-report fixture with agent session active |
| Studio update checks | Version information only | Network capture |
| Support bundles and diagnostic export | Agent journal and output excluded unless the user selects them explicitly and previews the content | Bundle inspection test |
| Local log export | Agent output redacted and excluded by default | Export inspection test |
| Artifact upload | Only the `.krv` and approved metadata; the privacy scan applies unchanged | Existing F-M03 privacy tests with agent-applied changes |

### 4.3 Consent

Before consent, the consent screen shows:

- the provider and its CLI version;
- the project and workspace scope;
- the maximum permission mode;
- the MCP tools the agent can use;
- the isolation tier for this OS (Section 5.4), including that in the reduced-assurance tier the agent may be able to read files outside the project;
- whether provider configuration isolation is full or partial (Section 5.8);
- a statement that the provider's own terms, retention and telemetry apply, and that Kritva does not control them;
- the disclosure version.

Consent rules:

- Consent is stored locally per user, organization, project, provider and disclosure version.
- Consent is requested again when the disclosure version changes, the organization changes, or the provider reports a different signed-in account (where the CLI exposes this).
- Consent can be withdrawn from the project settings or the agent panel (`agent.consent.withdraw`). Withdrawal stops active sessions with that provider for the project (Section 8.4).
- There is no "allow for all projects" option.

## 5. Provider Adapter Contract

Each provider is implemented as a Rust adapter behind a provider-neutral trait. The contract normalizes common behaviour, makes provider differences explicit through capabilities, and verifies capabilities at session start rather than trusting declarations.

### 5.1 Capability Descriptor

| Field | Meaning |
|---|---|
| `providerId` | Stable identifier, for example `claude-code` or `openai-codex` |
| `adapterVersion` | Kritva adapter version (semver) |
| `cliVersionRange` | Supported provider CLI versions |
| `permissionModes` | Supported subset of `READ_ONLY`, `PROPOSE` (and `WORKSPACE_WRITE` in a later release; see Section 5.3) |
| `isolationTier` | Achievable tier per operating system: `A`, `B` or `C` (Section 5.4) |
| `configIsolation` | `FULL`, `PARTIAL` or `NONE` (Section 5.8) |
| `mcpTransports` | Supported transports for the Kritva Studio MCP server: `STDIO`, `LOOPBACK` |
| `supportsStreaming` | Whether incremental output events are available |
| `supportsResume` | Whether a session can be resumed |
| `changeReporting` | `PATCH` (the adapter receives proposed edits) or `WORKSPACE_DIFF` (the adapter computes a diff of the staging workspace) |

### 5.2 Discovery, Version and Capability Verification

- Discovery reports one status per provider: `AVAILABLE`, `NOT_INSTALLED`, `NOT_AUTHENTICATED`, `UNSUPPORTED_VERSION`, `DISABLED_BY_POLICY` or `ERROR`.
- The CLI version is read at discovery and checked again at session start. If the CLI is upgraded during a session, that session continues on the running process, and the next session re-checks.
- Declared capabilities are advisory. At session start, the adapter verifies the effective permission mode, configuration isolation and MCP connectivity with a handshake. If verification fails, the adapter refuses the session with `CAPABILITY_MISMATCH`.
- Studio never stores, reads or forwards provider credentials. Authentication stays in the provider CLI's own credential store.

### 5.3 Permission Modes

| Kritva mode | Agent may | Agent may not | Release |
|---|---|---|---|
| `READ_ONLY` | Read staging-workspace files and answer questions | Modify files; run build, test or package tools | First release; first-use default |
| `PROPOSE` | Edit files in its staging workspace; request build, test and package tools with per-call approval | Change the user's working tree; anything outside Section 7 | First release; maximum mode |
| `WORKSPACE_WRITE` | Reserved | — | Deferred. It may be offered only after isolation tier A or B and the recovery tests in Section 11 pass on that OS, under a new decision record |

Each adapter maps the Kritva modes to the provider's own settings for the supported CLI versions, and contract tests verify the mapping. Studio never uses a provider mode that bypasses permission prompts or sandboxing. An adapter that cannot enforce a requested mode refuses the session rather than downgrading silently.

`READ_ONLY` for the agent does not by itself make MCP tools read-only. Tool permissions are evaluated separately (Section 7.5). In `READ_ONLY`, the build, test and package tools are denied.

### 5.4 Isolation Tiers

Read, write and network boundaries are defined separately:

| Tier | Mechanism | Read boundary | Write boundary | Network | First-release use |
|---|---|---|---|---|---|
| A | Provider-native sandbox, or an OS sandbox applied by the Isolation Launcher, verified at session start | Staging workspace and the provider's own required paths | Staging workspace only | Provider service endpoints only, where the sandbox supports it | `READ_ONLY`, `PROPOSE` |
| B | Container or VM (future) | Staging workspace | Staging workspace | Allowlisted | Not in the first release |
| C | Reduced assurance: working directory, sanitized environment and workspace guard only | Not confined: the agent can read anything the user can read | Not confined, but detected after the session | Not confined | `READ_ONLY` and `PROPOSE` only, with explicit disclosure in consent |

The supported tier per operating system and provider is recorded in the adapter compatibility matrix. Studio shows the tier in the agent panel. An organization policy can require tier A (`min_isolation_tier`).

Tier rules:

1. **Tier C makes no isolation claim.** Studio, documentation and audit records MUST NOT describe a tier C session as sandboxed, isolated or confined. The panel label is "Reduced assurance: not isolated".
2. **Tier C disclosure before every session.** Before a tier C session starts, Studio states that the agent can read any file the user's account can read, including files outside the project, and that writes outside the staging workspace are detected only after the session. The user must acknowledge this for the session. The acknowledgement is recorded in the session journal with the tier, provider, provider version and OS. Acknowledgement is per session and is not remembered across sessions.
3. **Policy overrides consent.** If the effective policy requires tier A, a session that can only reach tier C is rejected with `POLICY_DENIED` (or `TIER_UNAVAILABLE` when detected by the session-start probe) before launch. User consent or acknowledgement cannot override this.
4. **Tier A is proven by enforcement tests, not by the handshake.** A provider and OS combination is listed as tier A only after the CAT-03 enforcement tests pass on that combination: a read outside the read boundary fails, a write outside the staging workspace fails, and network access to a non-allowed endpoint fails where the sandbox claims network control. A sandbox flag or capability response alone is not evidence. At session start the adapter repeats a short probe (one denied read and one denied write). The probe does not replace the pre-release CAT-03 matrix, which keeps the separate denied-network test.
6. **No silent downgrade.** If the session-start probe fails, the session stops before the agent receives any task or file. If the effective policy requires tier A, the session is rejected with `TIER_UNAVAILABLE` under rule 3 and no tier C option is offered. If tier C is permitted, Studio shows the rule 2 disclosure and requires a fresh acknowledgement before the session is restarted at tier C. The failed probe, the user's choice and the resulting tier are recorded in the session journal.
5. **Unsupported combinations.** A provider and OS combination that cannot reach the tier required by the effective policy is shown as "Unsupported under your organization's policy" and cannot be started. A combination with no verified tier at all is marked `UNSUPPORTED` in the compatibility matrix and is not released.

The Workspace Guard is a detection control in every tier, not an enforcement control. It reports modifications outside the staging workspace and fails the session.

### 5.5 Staging Workspace and Change Sets

- **Staging.** At session start, Studio creates a per-session staging workspace that copies the project working tree. It uses a git worktree where possible, or a copy otherwise. The agent's working directory is the staging workspace.
- **Change set.** When the session completes, Studio computes a change set: an immutable, identified list of file operations (add, modify, delete, rename, mode change). Each operation records the base content hash from the user's working tree and the new content hash. Symlinks are recorded as links, never followed.
- **Apply.** The user applies the change set in full, per file or per hunk. Each application:
  - checks every base hash against the current working tree;
  - on a mismatch, caused by a concurrent edit by the user or another tool, marks that operation `CONFLICT`, never overwrites it, and offers a merge view;
  - writes atomically per file (temporary file, then rename) and records the result in the session journal.
- **Idempotency.** Apply, partial apply and revert are idempotent per change-set ID and operation ID.
- **Revert.** Revert undoes the applied operations of a change set by using the recorded hashes and the restore point taken immediately before the apply.

### 5.6 Session Lifecycle, Journal, Lock and Recovery

    REQUESTED -> CONSENT_CHECK -> POLICY_CHECK -> CAPABILITY_CHECK -> STAGED -> STARTING
        -> RUNNING <-> AWAITING_APPROVAL
        -> COMPLETED | CANCELLED | FAILED | TIMED_OUT | STOPPED_BY_POLICY
        -> REVIEWING -> APPLIED | PARTIALLY_APPLIED | REJECTED

- **Session journal.** A durable on-disk journal records: session ID, provider, mode, isolation tier, staging location, a manifest of the working tree at start, every approval decision, the change set, each apply or revert outcome, and the restore points. The journal never leaves the machine (Section 4.2).
- **Restore point before apply.** The restore point covers every file the change set touches, including untracked, ignored, hidden and generated files, permissions and symlinks. It does not rely on git stash alone.
- **Workspace lock.** An OS-level file lock enforces one active agent session per project workspace across all Studio processes.
- **Cancellation.** Cancellation terminates the provider process tree within a bounded timeout. If a process cannot be terminated, Studio reports the unresolved process to the user and does not report a clean stop. Because the agent works in staging, cancellation never changes the user's working tree.
- **Recovery.** At start-up, Studio scans the journal. If a session ended without a terminal state, or an apply was interrupted (Studio crash, OS crash, forced termination, full disk), Studio:
  - completes or rolls back the interrupted apply using the restore point;
  - shows the user what happened;
  - offers to review or discard the staged change set.
- **Integrity.** If the journal or a restore point is unreadable or corrupt, Studio stops automatic recovery, keeps the staging workspace, and alerts the user. It never discards user files.
- **Timeouts.** Each session has an idle and an absolute timeout. Defaults are set in the adapter configuration and bounded by policy.

### 5.7 Process Controls

The Isolation Launcher starts the provider CLI with these controls:

- working directory = staging workspace root;
- executable resolved from an allowlisted path, with version and identity checks;
- a sanitized environment containing no Kritva session tokens, API keys, Control Plane credentials or signing material;
- arguments built by the adapter from typed requests, never from free-form UI strings;
- stdout and stderr captured, size-bounded, redacted for secrets, and streamed as events;
- a tracked process tree;
- CPU, memory and wall-clock limits where the OS supports them.

### 5.8 Provider Configuration Isolation

Provider CLIs can load user-level or project-level configuration: other MCP servers, hooks, plugins and instruction files.

- The adapter launches the provider with a Kritva-controlled configuration. That configuration connects only the Kritva Studio MCP server and disables user-level and project-level MCP servers, hooks and plugins where the provider supports it (`configIsolation: FULL`).
- If the provider cannot fully isolate configuration (`PARTIAL` or `NONE`), the consent screen states that other configured tools or hooks may be active and are outside Kritva's tool allowlist. An organization policy can require `FULL` (`require_config_isolation`).
- Project instruction files in the workspace, for example agent instruction markdown files, are workspace content. They are treated as untrusted input to the agent and never as Kritva configuration.

### 5.9 Normalized Error Taxonomy

Adapters map provider-specific failures to:

`LAUNCH_FAILED`, `NOT_INSTALLED`, `AUTH_EXPIRED`, `UNSUPPORTED_VERSION`, `CAPABILITY_MISMATCH`, `MODE_UNSUPPORTED`, `PROVIDER_REFUSED`, `QUOTA_OR_RATE_LIMIT`, `TRANSPORT_FAILED`, `PROTOCOL_MISMATCH`, `PARTIAL_OUTPUT`, `TIMEOUT`, `CANCELLED`, `STOPPED_BY_POLICY`, `POLICY_DENIED`, `POLICY_UNCONFIGURED`, `POLICY_UNAVAILABLE`, `TIER_UNAVAILABLE`, `WORKSPACE_ESCAPE`.

The provider's original message is kept, redacted, for display.

## 6. Studio IPC Surface

React interacts only through typed IPC commands and events defined in `docs/frontend/architecture/IPC_ARCHITECTURE.md`:

| Command | Purpose |
|---|---|
| `agent.providers.list` | Providers, capabilities, verified isolation tier and status, including "unsupported under policy" |
| `agent.policy.status` | Effective policy and its source: `ORGANIZATION`, `CACHED`, `LOCAL_DEFAULT`, `POLICY_UNCONFIGURED` or `POLICY_UNAVAILABLE` |
| `agent.consent.get` / `agent.consent.record` / `agent.consent.withdraw` | Per-project, per-provider consent state |
| `agent.session.start` | Start a session (provider, mode, task text, optional file scope, tier C acknowledgement when the session runs at tier C) |
| `agent.session.status` | Current state |
| `agent.session.respond` | Answer an approval request, bound to its request ID |
| `agent.session.cancel` | Cancel |
| `agent.changes.get` | Change set with operations, hashes and conflicts |
| `agent.changes.apply` | Apply all or selected operations or hunks |
| `agent.changes.revert` | Revert applied operations of a change set |
| `agent.recovery.list` / `agent.recovery.resolve` | Interrupted sessions found in the journal, and the user's resolution |

Events: `agent.session.state`, `agent.session.output` (redacted, bounded), `agent.session.approvalRequested`, `agent.session.changes`, `agent.session.policyStopped`.

There is no generic "run command" IPC. Task text is passed to the adapter as data and never becomes a shell string.

## 7. Kritva Studio MCP Server

### 7.1 Tool Catalogue and Input Limits

Each tool has a published JSON schema in the Local Runtime contract package. Unknown fields are rejected, and size limits apply to every input and output.

| Tool | Inputs (validated) | Output limit | Effect |
|---|---|---|---|
| `kritva.project.info` | none | 16 KB | Read project metadata (name, platform, KritvaOS, SDK) |
| `kritva.platform.describe` | optional platform version ID from the project's catalogue cache | 64 KB | Read cached platform and compatibility metadata |
| `kritva.build.run` | saved build profile ID | status and summary, 16 KB | Run a saved build profile in the staging workspace |
| `kritva.test.run` | saved test target ID | status and summary, 16 KB | Run a saved test target in the staging workspace |
| `kritva.artifact.package` | saved build profile ID | package path and summary, 4 KB | Package an unsigned `.krv` into the staging build-output directory |
| `kritva.artifact.validate` | path of a package produced in this session | report, 64 KB | Run local validation and the privacy scan |
| `kritva.build.logs` | build or test run ID from this session; byte range up to 256 KB | 256 KB | Read redacted logs of this session's runs only |

### 7.2 Execution Contract for Build, Test and Package

- "Build" and "test" mean the build profiles and test targets that the user has saved in Studio (F-M03 BUILD & ARTIFACT build configuration). Agents can select a saved profile by ID. They cannot supply commands, scripts, flags, environment variables or paths.
- Building a project runs project-defined build and test scripts. That is true for manual builds too. The agent-specific risk is that the agent changed those scripts. When the staging change set modifies build-definition files (the build manifest, build scripts, toolchain configuration or test configuration), the approval prompt highlights them.
- Runs execute in the staging workspace, never in the user's working tree. They use the same isolation tier as the session, the same timeout, process-tree cleanup, CPU, memory and disk limits as manual builds, and the same network policy as manual builds.
- Outputs are written only to the staging build-output directory. Symlinked output paths are rejected.
- `kritva.artifact.package` never signs and never uploads. Its output can be validated, and then discarded or kept for inspection. A shippable artifact is built again by the user from the working tree after the change set is applied.

### 7.3 Tools That MUST NOT Be Exposed

Artifact signing, artifact upload, any booking, credit, Job or Run operation, any Lab Agent or robot command, any Control Plane mutation, any filesystem access outside the staging workspace, and any generic shell execution. These operations require a human in Studio and, where applicable, Control Plane authorization.

### 7.4 Transport

- **Stdio** is preferred. Studio starts the MCP server as a child of the session, and its lifetime equals the session.
- **Loopback** is used only when the provider cannot use stdio. The server binds to `127.0.0.1` on an ephemeral port and requires a per-session random 256-bit bearer token. The token expires at session end, request IDs are single-use (replay is rejected), and connections from other processes without the token are refused.
- The server is never exposed on a non-loopback interface.

### 7.5 Authorization and Approval

A tool call is allowed only if all of these allow it: recorded consent, organization policy (`mcp_enabled`, `allowed_mcp_tools`), session mode, per-call approval where required, and current session state. If any one denies, the call is denied. Tool annotations or hints are never treated as authorization.

- Approval prompts show the tool and its arguments, resolved to human-readable names, for example the build profile name and whether build-definition files changed.
- An approval is bound to the request ID, the tool, its arguments, the staging-workspace content hash, and the version hash of each referenced definition: the build profile for `kritva.build.run` and `kritva.artifact.package`, and the test-target definition for `kritva.test.run`. If the staging workspace or any referenced definition changes before execution, the approval is invalidated and the user is asked again.
- Build-profile and test-target definitions are resolved by Studio from project configuration, not from agent-supplied text. The agent supplies only an identifier.
- Every call is logged locally in the session journal with tool, argument summary, decision, outcome and duration.

### 7.6 Output Hygiene and Indirect Prompt Injection

- Tool output is bounded, redacted for secrets and stripped of paths outside the workspace before it is returned to the agent.
- `kritva.build.logs` can read only runs from the current session. It cannot read other projects or other sessions.
- Content from source files, build logs, test output, instruction files and generated artifacts is untrusted. No such content can change tool permissions, approvals or the catalogue.

## 8. Organization Policy and Provider Metadata

### 8.1 Policy Fields (B-M01 CONTROL PLANE, stored by DB-M02 CORE DATA)

Field names here are descriptive. The wire format is defined in `docs/protocol/API_CONTRACT.md` Section 25.4.

| Field | Meaning | Default when no policy is set |
|---|---|---|
| `enabled` | Agents allowed for the organization | See Section 8.2 |
| `allowedProviders` | Allowed `providerId` values | Providers whose combination with the current OS is `SUPPORTED` in the compatibility matrix at a verified tier; no other provider |
| `maxPermissionMode` | `READ_ONLY` or `PROPOSE` in the first release | `PROPOSE` |
| `requireConsent` | Always true | true (cannot be set false) |
| `mcpEnabled`, `allowedMcpTools` | MCP use and tool subset | true; read-only tools (`kritva.project.info`, `kritva.platform.describe`, `kritva.build.logs`, `kritva.artifact.validate`) without approval, and the other Section 7.1 tools with per-call approval |
| `minIsolationTier` | `A` or `C` | `C` (with disclosure) |
| `requireConfigIsolation` | Require `configIsolation: FULL` | false |
| `maxCacheAgeSeconds` | Maximum age of the cached policy | 86400 |
| `policyVersion`, `updatedAt`, `updatedBy` | Metadata | — |

Changing the policy requires an organization-administrator permission and produces an audit event.

### 8.2 Defaults and Unconfigured States

| State | Behaviour |
|---|---|
| Not signed in | Agents unavailable (projects require sign-in) |
| P1 STUDIO and P2 BUILD & ARTIFACT, before the Control Plane policy exists | Built-in local default policy, shown to the user as "Local default policy (not set by your organization)". It is restrictive: only the defaults in Section 8.1, only verified provider and OS combinations, tier C only with the Section 5.4 disclosure, and no mode above `PROPOSE`. It does not mean that every provider, mode, tier or tool is allowed. |
| Organization has never set a policy (P3 CONTROL PLANE onward) | State `POLICY_UNCONFIGURED`. Recommended (Option 2, pending decision in SYS-ADR-007): agents are unavailable until an organization administrator initializes the policy. Studio shows "Coding agents are not enabled for your organization" and, for administrators, a link to the policy page. Audit event `agent.policy.unconfigured`. The alternative (Option 1) applies the local default policy with `enabled: true`. |
| Policy fetch fails and there is no valid cache | State `POLICY_UNAVAILABLE`. `READ_ONLY` only, MCP tools that run builds or tests disabled. Studio shows "Organization policy could not be loaded" with a retry action and the last error category. Audit event `agent.policy.fetch_failed` with the error category. |

`POLICY_UNCONFIGURED` and `POLICY_UNAVAILABLE` are separate states in the IPC surface, the UI, the audit log and the remediation text. The Control Plane returns an explicit "no policy set" response, distinct from an error, so the client never infers "unconfigured" from a failed request.

### 8.3 Cache, Freshness and Integrity

- Studio caches the last policy response with its `ETag`, the server `Date`, and a local monotonic timestamp from the time of the fetch. Age is computed from the monotonic clock, so changing the system clock does not extend it.
- The cache is stored in the Studio application-data directory with a checksum. A cache that is missing, corrupt or older than `maxCacheAgeSeconds` is treated as absent, which means `READ_ONLY`.
- When online, Studio revalidates the policy at session start and before each build, test or package tool call if the cache is older than 15 minutes.
- Policy is a governance control enforced by Studio on the user's machine. It is not a security boundary against a user with local administrative control. Administrator documentation states this.

### 8.4 Policy or Consent Changes During an Active Session

| Event | Effect |
|---|---|
| A provider or tool is disabled, the mode is lowered, the policy expires, or consent is withdrawn | New tool calls are denied immediately. The session moves to `STOPPED_BY_POLICY` within 10 seconds, and the process tree is terminated. |
| Workspace | Unchanged, because the agent worked in staging. The staged change set is kept for review unless consent was withdrawn, in which case the staging workspace is deleted after the user confirms. |
| Record | The event, its reason and the policy version are recorded in the session journal and shown to the user. |

### 8.5 Provider Metadata (B-M03 PLATFORM, stored by DB-M02 CORE DATA)

`GET /api/v1/coding-agent-providers` (wire format in `docs/protocol/API_CONTRACT.md` Section 27.4) returns, for each provider:

- `providerId` and display name;
- status: `SUPPORTED`, `DEPRECATED` or `BLOCKED`;
- supported adapter versions;
- supported CLI version range;
- capability summary;
- disclosure version;
- documentation link.

Provider metadata is separate from robot platforms, capabilities and resources, and never appears in compatibility results.

### 8.6 Telemetry

No session telemetry is sent to Kritva by default. Any future usage reporting is limited to provider ID, mode, duration, outcome and counts, and requires its own decision record.

## 9. Integration with Build and Provenance

- An applied change is ordinary working-tree content. To produce a shippable `.krv`, it goes through the unchanged build, test, privacy-scan, validation and signing pipeline.
- **Agent-assisted flag.** Studio keeps a local registry of the content hashes that applied change-set operations produced. At build time, `build_metadata.agent_assisted` (`docs/protocol/ARTIFACT_MANIFEST.md` Section 13) is set to true if, and only if, at least one file in the build input has a current content hash in that registry.
  - Deterministic: it depends only on the actual build input.
  - A manual edit, revert, branch switch or build from a different commit changes the hashes and therefore the result.
  - A completed or rejected session that was never applied does not set the flag.
- The flag is informational. It is not an attestation of what was AI-generated or verified, and it never relaxes validation, signing, compatibility or safety requirements. The manifest never records the provider, prompts, transcripts, file paths or diffs.

## 10. Failure Handling

| Failure | Required behaviour |
|---|---|
| CLI missing or unsupported version | Provider shown unavailable; rest of Studio unaffected |
| Sign-in expired | `AUTH_EXPIRED`; session does not start; the user signs in through the provider CLI |
| Capability verification fails | `CAPABILITY_MISMATCH`; session refused |
| Provider outage, quota or rate limit | Session `FAILED`; staging and change set preserved |
| Process crash or hang | Process tree terminated; `FAILED` or `TIMED_OUT`; unresolved processes reported |
| Write outside staging detected | `WORKSPACE_ESCAPE`; session `FAILED`; security event logged locally; user alerted with affected paths |
| MCP tool denied | Call denied with a reason; session continues |
| Policy change, expiry or consent withdrawal | Section 8.4 |
| Studio or OS crash, forced termination, full disk | Recovery from the journal (Section 5.6) |
| Journal or restore point corrupt | Automatic recovery stops; user alerted; no user files discarded |
| Concurrent human edit | Affected operations marked `CONFLICT`; never overwritten |

## 11. Verification Requirements

Release-gating tests are listed in the test matrix in `docs/development/TESTING_STRATEGY.md` Section 37.1. Each matrix row names its suite, expected result, retained evidence, and whether a failure blocks milestone exit. The matrix covers:

1. supported OS × provider × CLI version × permission mode × isolation tier;
2. adapter contract and capability-verification tests per provider and version (a pass against the mock provider is not evidence of real-provider compatibility);
3. environment sanitization;
4. isolation and escape tests: symlinks, path traversal, hard links, nested mounts, subprocesses, background processes, and reads outside the workspace (tier A must block them; tier C must disclose them);
5. change-set tests: apply, partial apply, conflict on concurrent edit, idempotency, revert;
6. recovery fault injection: Studio kill during session and during apply, OS restart, full disk, corrupt journal;
7. MCP tests: a positive and a negative case for every tool, schema rejection, approval binding and invalidation, loopback token and replay, catalogue enumeration, forbidden operations, malicious-project and indirect prompt-injection fixtures (source, logs, test output, instruction files, generated artifacts), and resource exhaustion;
8. policy tests: expiry, revocation and tool removal during active sessions, cache corruption, clock change, offline start;
9. consent tests: first use, disclosure change, withdrawal during a session, organization change;
10. egress negative tests for every row in Section 4.2;
11. provenance determinism tests;
12. no-provider and provider-disabled end-to-end regression of the full primary product path.

## 12. Delivery Sequence and Exit Gates

| Step | Phase | Milestone | Content | Tasks |
|---|---|---|---|---|
| 1 | P0 FOUNDATION / P1 STUDIO | F-M01 STUDIO FOUNDATION | Adapter trait, error taxonomy, session manager, journal and lock, environment sanitizer, workspace guard, `agent.*` IPC contract, mock provider | KR-CA-001 to KR-CA-005, KR-CA-035 |
| 2 | P1 STUDIO | F-M02 PROJECTS | Discovery and capability verification, consent lifecycle, staging and change sets, review and apply, recovery, isolation launcher (tier A where available), first provider adapter, default local policy | KR-CA-006 to KR-CA-014, KR-CA-036 to KR-CA-038 |
| 3 | P2 BUILD & ARTIFACT | F-M03 BUILD & ARTIFACT | Second provider adapter, MCP server with schemas and execution contract, build/test/package handoff, provenance registry | KR-CA-015 to KR-CA-021, KR-CA-039 |
| 4 | P3 CONTROL PLANE | B-M01 CONTROL PLANE | Organization policy API | KR-CA-022 to KR-CA-026 |
| 4 | P3 CONTROL PLANE | B-M03 PLATFORM | Provider metadata API | KR-CA-027 to KR-CA-030 |
| 4 | P3 CONTROL PLANE | DB-M02 CORE DATA | Policy and provider persistence | KR-CA-031 to KR-CA-033 |
| 4 | P3 CONTROL PLANE | PHASE-3-CONTROL-PLANE integration | Studio switches to the Control Plane policy and provider metadata | KR-CA-034 |

Coding-agent tasks use the `KR-CA-nnn` namespace so that their IDs are unique across all task registers. P1 and P2 local operation is safe without the P3 policy, because the default local policy applies.

**P1 STUDIO exit gate** (in addition to the F-M01 and F-M02 acceptance criteria):

- the complete project workflow passes with no provider installed;
- mock-provider contract and lifecycle tests pass, and errors are normalized;
- the first provider works end to end: consent, mode, staging, cancellation, review, apply, conflict handling, revert and recovery;
- `PROPOSE` never changes the working tree without an explicit apply;
- environment and isolation tests pass on each supported OS for the tier claimed there;
- consent withdrawal, policy expiry and offline behaviour are tested;
- SYS-ADR-007 was accepted before F-M02 coding-agent implementation started.

**P2 BUILD & ARTIFACT exit gate** (in addition to the F-M03 acceptance criteria):

- both Claude Code and OpenAI Codex pass the contract suite for their declared CLI versions;
- the MCP server exposes only the catalogue in Section 7.1 and authorizes every call;
- build, test and package runs are bounded and confined to staging, with approval binding;
- applied agent changes pass the unchanged build, privacy-scan, validation and signing gates;
- malicious-project and prompt-injection fixtures cannot trigger signing, upload, booking, credit spend, Jobs, Runs or robot commands;
- crash, timeout, cancellation, concurrent-edit and restore tests pass, with evidence retained;
- provenance is deterministic.

## 13. Decisions

Resolved in this revision (subject to SYS-ADR-007 acceptance):

1. The first release offers `READ_ONLY` and `PROPOSE` only. `WORKSPACE_WRITE` is deferred.
2. Agents work in a per-session staging workspace, and changes reach the working tree only through explicit apply.
3. In Kritva-launched sessions, Kritva connects only the Kritva Studio MCP server. Partial configuration isolation is disclosed and can be prohibited by policy.
4. Policy and consent changes during a session follow Section 8.4.

Open:

| ID | Decision | Recommendation | Accountable owner (role) | Must be resolved by |
|---|---|---|---|---|
| A | Default for an organization that has never set a policy (Section 8.2) | Option 2: unavailable until an administrator initializes the policy | Product owner, with security lead | B-M01 CONTROL PLANE exit (P3) |
| B | Provider terms and disclosure text (R-COMM-006) | Legal review per provider before release | Legal counsel, with product owner | Release of each provider; P1 exit gate for the first provider |
| C | Resumable sessions in the first release | Not in the first release unless recovery tests CAT-08 pass for resume | Frontend architecture lead | F-M02 PROJECTS exit (P1) |
| D | Supported CLI version ranges and verified isolation tier per OS and provider | Record in the compatibility matrix from CAT-03 results | Local Runtime lead, with security lead | Release of each provider and OS combination; no combination ships unresolved |
| E | Validation of the resource estimate (about 1 FTE more in each of P1 and P2) against named owners (RESOURCE_PLAN Section 23.2) | Confirm before P1 starts | Engineering manager, with finance | P1 STUDIO start |

Owners are roles until named people are assigned in RESOURCE_PLAN Section 23.2. A provider and OS combination is not released while decision B or D is open for it.
