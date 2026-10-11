# Security Decision Register

This register holds security-specific architecture decisions (ADRs). Product/system-wide decisions are recorded in [../planning/DECISIONS.md](../../planning/DECISIONS.md); the decision index is [../tracking/DECISION_LOG.md](../tracking/DECISION_LOG.md).

Security ADRs MUST be recorded here when they concern: authentication and authorization models, source-code privacy controls, artifact signing and trust, key and secrets management, tenant isolation mechanisms, and audit logging policy.

## Status

No security-specific ADR has been recorded separately yet. Baseline security positions are specified in:

- [SECURITY_REQUIREMENTS.md](SECURITY_REQUIREMENTS.md)
- [THREAT_MODEL.md](THREAT_MODEL.md)
- [../architecture/SECURITY_ARCHITECTURE.md](../architecture/SECURITY_ARCHITECTURE.md)

## SEC-ADR-001 — Coding-Agent Security Controls

    ID:            SEC-ADR-001
    Title:         Coding-agent security controls
    Status:        PROPOSED
    Date:          2026-10-10
    Owner:         Security Owner
    Context:       Studio launches third-party coding-agent CLIs (Claude Code, OpenAI Codex) on customer workspaces (SYS-ADR-007).
    Decision:      Sanitized agent environment (no Kritva tokens, keys or signing material); workspace-scoped execution with post-session
                   escape detection with declared isolation tiers; staging workspace with explicit apply and restore points; READ_ONLY and PROPOSE only; no permission-bypass modes; per-project consent
                   disclosing third-party data flow; local-only MCP server with no sign, upload, booking, credit, Job, Run or robot tools;
                   no source, prompt, transcript or diff sent to Kritva services.
    Alternatives considered: Cloud-hosted agents (rejected, breaks source privacy); unrestricted agent tool access (rejected, prompt-injection risk).
    Consequences:  SEC-180 to SEC-195 in SECURITY_REQUIREMENTS.md; trust boundary TB-08 and scenarios AS-031 to AS-035 in THREAT_MODEL.md; risks R-SEC-011 to R-SEC-014.
    Affected documents: docs/architecture/CODING_AGENT_INTEGRATION.md; SOURCE_CODE_PRIVACY.md; SECURITY_REQUIREMENTS.md; THREAT_MODEL.md
    Superseded by:

## ADR Template

    ID:            SEC-ADR-<nnn>
    Title:
    Status:        PROPOSED | ACCEPTED | SUPERSEDED | REJECTED
    Date:
    Owner:
    Context:
    Decision:
    Alternatives considered:
    Consequences:
    Affected documents:
    Superseded by:

## Register

| ID | Title | Status | Date | Owner |
|---|---|---|---|---|
| SEC-ADR-001 | Coding-agent security controls | PROPOSED | 2026-10-10 | Security Owner |
