# Cloud Architecture Decision Register

**Document:** `docs/cloud/planning/DECISIONS.md`  
**Project:** Kritva RaaS  
**Status:** Cloud-specific architecture decision register  
**Audience:** Cloud architects, infrastructure engineers, platform engineers, security engineers, and technical reviewers  
**Normative language:** MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY express requirements.

## 1. Purpose

This document records architecture decisions specific to the cloud and infrastructure implementation of Kritva RaaS.

It captures the context, alternatives, rationale, consequences, and validation expectations behind cloud implementation choices. Its purpose is to preserve decision history, make infrastructure trade-offs reviewable, and maintain consistent cloud implementation across environments.

This register MUST contain only cloud-specific decisions. Product-wide and cross-domain architecture decisions MUST be recorded in `docs/planning/DECISIONS.md` and referenced here when they constrain cloud implementation.

The register MUST remain aligned with the authoritative cloud architecture documents, infrastructure security requirements, protocol contracts, and milestone dossiers.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns cloud-specific architecture decision records, including decisions about:

- Cloud provider and service selection for the reference implementation.
- Cloud account, subscription, project, and environment organization.
- Virtual network, subnet, routing, and network-segmentation implementation.
- Infrastructure-as-code tooling, module structure, and state management.
- Cloud resource provisioning and service-to-resource mapping.
- Container hosting and cloud workload placement.
- Cloud load balancing and ingress implementation.
- Cloud-managed database and object-storage integration.
- Cloud messaging, queue, and cache service selection.
- Cloud resource sizing and autoscaling implementation.
- Cloud cost controls and resource budgets.
- Cloud IAM implementation and workload identity.
- Cloud KMS and managed-secret-service integration.
- Infrastructure audit logging and cloud security monitoring.
- Cloud WAF and edge-security implementation.
- Cloud vulnerability scanning and infrastructure patch management.
- Cloud backup, recovery, and environment restoration implementation.
- Infrastructure deployment pipelines and promotion controls.
- Cloud environment configuration and drift detection.
- Cloud-specific resilience, availability, and operational trade-offs.
- Infrastructure-level verification and compliance evidence.

Each decision MUST be limited to cloud or infrastructure implementation. A decision MUST NOT redefine product-wide architecture, application security policy, API semantics, or database behavior.

### 2.2 Product-Wide Decision Ownership

`docs/planning/DECISIONS.md` owns product/system-level architecture decisions and the index to domain decision registers.

This cloud register MUST NOT independently define or override:

- Product-wide system boundaries and component responsibilities.
- Cross-domain service ownership.
- Product-level availability or recovery objectives.
- Application authentication and authorization policy.
- System-level security trust boundaries.
- API, event, and artifact wire contracts.
- Product-level data ownership and persistence authority.
- Business rules for booking, execution, billing, or resource allocation.
- Cross-domain lifecycle semantics.
- Product-wide deployment and release policy.
- System-level compatibility requirements.

If a cloud proposal changes a product/system-level constraint, the proposal MUST be reviewed through `docs/planning/DECISIONS.md`.

Cloud implementation decisions MAY explain how an approved system requirement is realized by infrastructure, but MUST NOT create a competing definition of that requirement.

### 2.3 Other Document Ownership

| Concern | Authoritative document |
|---|---|
| Product/system-level decisions | `docs/planning/DECISIONS.md` |
| Canonical phase definitions | `docs/planning/PHASES.md` |
| Product/system cloud topology and responsibilities | `docs/architecture/CLOUD_ARCHITECTURE.md` |
| Cloud implementation architecture | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Cloud-specific architecture decisions | `docs/cloud/planning/DECISIONS.md` |
| Cloud milestone scope and acceptance | Authoritative dossiers under `docs/cloud/milestones/` |
| Application security model and trust boundaries | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Cloud and infrastructure security implementation | `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` |
| System backend responsibilities and ownership | `docs/architecture/BACKEND_ARCHITECTURE.md` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| API wire contract | `docs/protocol/API_CONTRACT.md` |
| Event wire contract | `docs/protocol/EVENT_CONTRACT.md` |
| Artifact contract and manifest | `docs/protocol/ARTIFACT_MANIFEST.md` |
| System database role and authority | `docs/architecture/DATABASE_ARCHITECTURE.md` |
| PostgreSQL implementation architecture | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Frontend implementation and decisions | Applicable documents under `docs/frontend/` |
| Database-specific decisions | Applicable database decision register under `docs/database/` |
| Backend-specific decisions | `docs/backend/planning/DECISIONS.md` |
| Frontend-specific decisions | `docs/frontend/planning/DECISIONS.md` |
| Cross-domain milestone scope | Applicable authoritative dossiers under `docs/**/milestones/` |

The referenced documents are authoritative for their named responsibilities. This register MUST link to them rather than reproduce their full content.

### 2.4 Decision Register Versus Cloud Architecture

This register records why a cloud implementation choice was made and the consequences of that choice.

`docs/cloud/architecture/CLOUD_ARCHITECTURE.md` describes the current deployable cloud implementation architecture, including environments, accounts, network layout, service-to-resource mapping, infrastructure-as-code organization, resource sizing, scaling, and cost controls.

`docs/cloud/architecture/SECURITY_ARCHITECTURE.md` describes cloud and infrastructure security implementation.

`docs/architecture/CLOUD_ARCHITECTURE.md` owns the product/system cloud topology and the rationale for the system's cloud responsibilities.

These documents MUST link to relevant accepted decisions when a decision materially constrains their contents. This register MUST NOT duplicate their complete implementation specifications.

### 2.5 Explicit Non-Goals

This document MUST NOT become the authoritative home for:

- Product/system architecture decisions.
- Complete cloud topology specifications.
- Detailed Terraform or other infrastructure-as-code implementation instructions.
- Application authentication and authorization design.
- API, event, or artifact wire contracts.
- PostgreSQL schema and transaction policy.
- Backend module implementation decisions.
- Frontend architecture decisions.
- Product requirements or business policy.
- Milestone acceptance criteria.
- Operational runbooks.
- Incident records.
- General infrastructure coding guidelines that do not represent a consequential architecture decision.

When content belongs elsewhere, this register MUST link to the authoritative owner.

## 3. Cloud Decision Principles

### 3.1 Single Authority

Each cloud architecture decision MUST have one authoritative record.

An accepted decision MUST NOT be independently recreated in another document with conflicting wording or status.

Other documents MAY summarize a decision where necessary, but MUST link to this register.

### 3.2 Implementation Scope

A cloud decision MUST identify the infrastructure concern it governs.

A decision SHOULD be as narrow as possible while solving the stated problem.

A cloud-specific choice MUST NOT silently impose a product-wide architecture constraint.

### 3.3 Provider and Service Selection

A decision selecting a cloud provider or managed service MUST document the relevant requirements and trade-offs.

The analysis SHOULD consider:

- Functional fit.
- Security capabilities.
- Availability and failure behavior.
- Operational complexity.
- Portability requirements.
- Performance and scaling.
- Regional availability.
- Data location and retention requirements.
- Pricing and cost predictability.
- Integration with the existing deployment model.

A service MUST NOT be selected solely because it is available in the chosen provider.

### 3.4 Reproducible Infrastructure

Infrastructure MUST be reproducible through documented and reviewable provisioning procedures.

Infrastructure-as-code SHOULD be the authoritative source for managed resources.

Untracked manual changes SHOULD be avoided. Any required emergency change MUST have a defined reconciliation path.

### 3.5 Environment Separation

Cloud environments MUST have explicit identities, configuration, resource boundaries, and deployment controls.

Environment-specific differences MUST be documented.

Production credentials and sensitive production data MUST NOT be copied into development or staging environments without an approved and controlled process.

### 3.6 Least Privilege

Cloud identities and workloads MUST receive only the permissions required for their responsibilities.

Broad administrative privileges MUST NOT be the default runtime configuration.

Emergency privileges MUST be controlled, auditable, and time-bounded where supported.

### 3.7 Reliability and Recovery

Cloud decisions affecting reliability MUST state their failure assumptions and recovery implications.

Recovery capabilities MUST be validated rather than inferred from a service's advertised availability.

### 3.8 Cost Accountability

Material cloud resource decisions SHOULD include an expected cost profile and a mechanism to observe or constrain expenditure.

Autoscaling MUST NOT be treated as a complete cost-control strategy.

### 3.9 Security Alignment

Cloud security implementation MUST comply with the approved application security model and system trust boundaries.

Cloud controls MUST complement application controls rather than replace them.

### 3.10 Evidence-Based Decisions

Claims about cost, availability, latency, throughput, recovery time, and recovery point SHOULD be supported by measurements, service documentation, controlled tests, or explicit assumptions.

Unverified assumptions MUST be identified as such.

## 4. Decision Record Format

### 4.1 Required Fields

Every accepted cloud decision MUST include:

- **ID:** Stable, unique identifier.
- **Title:** Concise decision name.
- **Status:** Proposed, Accepted, Rejected, Superseded, or Withdrawn.
- **Date:** Date of the decision or latest status transition.
- **Context:** Problem, requirements, and constraints.
- **Decision:** Selected cloud implementation approach.
- **Rationale:** Reasons for selecting the approach.
- **Alternatives:** Material alternatives considered.
- **Consequences:** Benefits, limitations, and obligations.
- **Affected resources:** Accounts, environments, services, modules, or infrastructure boundaries.
- **Related decisions:** IDs of decisions that constrain or depend on this decision.
- **References:** Links to architecture documents, provider documentation, tests, and milestone dossiers.
- **Review triggers:** Conditions that would require reconsideration.
- **Validation evidence:** Tests, measurements, or implementation references where applicable.

A proposed decision MAY have incomplete implementation evidence. Required evidence MUST be completed before the implementation is declared conformant.

### 4.2 Stable IDs

Cloud decision IDs MUST use the prefix `CL-ADR-` followed by a zero-padded numeric identifier.

Examples:

- `CL-ADR-001`
- `CL-ADR-002`
- `CL-ADR-003`

An ID MUST NOT be reused after rejection, withdrawal, or supersession.

Product/system decision IDs MUST follow the convention defined in `docs/planning/DECISIONS.md`.

### 4.3 Status Definitions

| Status | Meaning |
|---|---|
| Proposed | Under discussion; not an approved infrastructure constraint |
| Accepted | Approved and authoritative until superseded or withdrawn |
| Rejected | Reviewed and not selected |
| Superseded | Replaced by a later decision |
| Withdrawn | No longer applicable and not replaced by a direct successor |

A proposed decision MUST NOT be described as an established infrastructure requirement.

A rejected decision SHOULD record its rejection rationale.

A superseded decision MUST identify its successor.

### 4.4 Scope and Impact

Every decision MUST identify the cloud resources, environments, and implementation areas it affects.

When a decision affects several environments, the record MUST distinguish common requirements from environment-specific configuration.

When a decision affects application behavior or database semantics, it MUST identify the boundary and reference the appropriate owner.

### 4.5 Alternatives

Material alternatives SHOULD be recorded with their trade-offs.

Alternatives SHOULD be evaluated against the actual requirements rather than abstract claims of portability or simplicity.

A concise alternatives analysis MAY be used for low-risk, easily reversible choices.

### 4.6 Consequences

Consequences MUST identify material effects on:

- Infrastructure complexity.
- Security posture.
- Reliability and recovery.
- Operational workload.
- Environment consistency.
- Performance and scaling.
- Cost and budget predictability.
- Vendor dependency.
- Migration and rollback.
- Monitoring and auditability.
- Compliance obligations.
- Development workflow.

Follow-up work SHOULD be linked to its authoritative task or milestone dossier.

## 5. Cloud Decision Index

### 5.1 Index Purpose

The index provides a discoverable entry point for cloud implementation decisions.

The entries below are proposed placeholders for review. They do not establish that a particular provider, service, or implementation approach has already been approved or deployed.

Each entry MUST be completed, rejected, withdrawn, or removed from the active index through the decision workflow.

### 5.2 Initial Register

| ID | Decision title | Status | Scope | Record |
|---|---|---|---|---|
| CL-ADR-001 | Cloud decision governance and ownership | Proposed | Decision boundaries and record maintenance | Section 6 |
| CL-ADR-002 | Cloud provider and managed-service selection | Proposed | Reference implementation service choices | Section 7 |
| CL-ADR-003 | Cloud accounts and environment isolation | Proposed | Account, project, and environment boundaries | Section 8 |
| CL-ADR-004 | Infrastructure-as-code and state management | Proposed | Provisioning workflow and module structure | Section 9 |
| CL-ADR-005 | Network segmentation and ingress controls | Proposed | VPC, subnet, routing, and ingress | Section 10 |
| CL-ADR-006 | Workload hosting and deployment strategy | Proposed | Containers, compute, and deployment | Section 11 |
| CL-ADR-007 | Cloud data and messaging services | Proposed | Managed storage, queues, and cache integration | Section 12 |
| CL-ADR-008 | Cloud identity and infrastructure security | Proposed | IAM, workload identity, secrets, and audit | Section 13 |
| CL-ADR-009 | Infrastructure recovery and resilience | Proposed | Backup, restore, and recovery implementation | Section 14 |
| CL-ADR-010 | Cloud cost and resource governance | Proposed | Sizing, scaling, budgets, and cost visibility | Section 15 |

These entries identify decision areas that may need explicit records. They MUST NOT be interpreted as a mandate to use a specific cloud provider, managed service, or infrastructure-as-code tool.

### 5.3 Index Maintenance

When a decision is accepted, the index MUST link to its complete record and show its current status.

When a decision is superseded, the index MUST identify its successor.

When a decision depends on a product/system decision, the full record SHOULD link to the relevant entry in `docs/planning/DECISIONS.md`.

The index MUST NOT duplicate product-wide decision content.

## 6. CL-ADR-001 — Cloud Decision Governance and Ownership

**Status:** Proposed  
**Scope:** Cloud-specific architecture decision records

### 6.1 Context

Cloud implementation choices can be repeated across architecture documents, infrastructure code, planning files, and milestone dossiers.

Without explicit ownership, an implementation preference can be mistaken for a product-wide requirement, or infrastructure code can become the only record of a consequential architectural decision.

### 6.2 Proposed Decision

Cloud-specific architecture decisions MUST be recorded in this register.

Product/system-level decisions MUST be recorded in `docs/planning/DECISIONS.md`.

Product/system cloud topology MUST be documented in `docs/architecture/CLOUD_ARCHITECTURE.md`.

Deployable cloud implementation architecture MUST be documented in `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

Cloud and infrastructure security implementation MUST be documented in `docs/cloud/architecture/SECURITY_ARCHITECTURE.md`.

Cloud milestone scope and acceptance MUST remain in the authoritative dossiers under `docs/cloud/milestones/`.

### 6.3 Rationale

This separation preserves decision history while keeping system topology, infrastructure implementation, and infrastructure security in their proper authoritative documents.

### 6.4 Consequences

- Cloud decisions require stable IDs and explicit status.
- Cross-domain decisions must be escalated to the product-wide register.
- Cloud architecture documents MUST link to relevant accepted decisions.
- Infrastructure code MUST remain consistent with accepted decisions.
- Milestone dossiers remain authoritative for acceptance.
- Superseded decisions remain discoverable.

### 6.5 Review Triggers

Review this decision if the documentation structure, cloud ownership model, or decision workflow changes materially.

## 7. CL-ADR-002 — Cloud Provider and Managed-Service Selection

**Status:** Proposed  
**Scope:** Cloud provider and managed-service choices

### 7.1 Context

Cloud services differ in capabilities, operational complexity, regional availability, pricing, security features, and portability.

Choosing a provider or managed service can affect deployment workflows and migration cost for the lifetime of the platform.

### 7.2 Proposed Decision

Every material provider or managed-service selection MUST be supported by a decision record when it creates a meaningful architectural constraint.

The record MUST identify the required capability, selected service, alternatives, operational implications, and expected cost drivers.

A decision MUST distinguish a chosen reference implementation from a requirement that the system be permanently tied to one provider.

### 7.3 Rationale

Explicit service-selection decisions make vendor dependencies visible and enable informed trade-offs between managed capabilities and operational control.

### 7.4 Consequences

- Material vendor dependencies MUST be documented.
- Portability requirements MUST be based on actual product needs.
- Provider-neutral interfaces SHOULD be introduced only where they provide meaningful value.
- The cost of operating and migrating the selected service SHOULD be considered.
- Region-specific limitations MUST be documented when they affect deployment.
- Service replacement MUST include data migration and recovery implications where applicable.

### 7.5 Alternatives

Potential alternatives may include managed services, self-managed services on cloud compute, or equivalent capabilities from another provider.

The selected option MUST be justified against security, operational burden, reliability, compatibility, and cost requirements.

### 7.6 Ownership Boundary

The product/system cloud topology is owned by `docs/architecture/CLOUD_ARCHITECTURE.md`.

The deployable provider-specific implementation is owned by `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

This record owns the rationale for a cloud-specific provider or service choice.

### 7.7 Review Triggers

Review this decision if a service becomes unavailable in a required region, cost changes materially, security requirements change, or the operational burden no longer justifies the selected service.

## 8. CL-ADR-003 — Cloud Accounts and Environment Isolation

**Status:** Proposed  
**Scope:** Cloud account, project, and environment boundaries

### 8.1 Context

Development, staging, and production have different risk profiles, credentials, data requirements, and change-control needs.

Insufficient separation can allow test workloads or credentials to affect production resources.

Excessive fragmentation can also increase operational complexity.

### 8.2 Proposed Decision

Cloud environments MUST have explicit isolation boundaries and documented promotion paths.

The selected account, project, or subscription structure MUST provide appropriate separation for identities, resources, network access, and operational permissions.

The exact environment layout MUST be documented in `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

### 8.3 Rationale

Explicit environment boundaries reduce accidental cross-environment access and make deployments, auditing, and incident containment more predictable.

### 8.4 Consequences

- Environment identities MUST be explicit.
- Production credentials MUST NOT be reused in development.
- Environment-specific configuration MUST be traceable.
- Production access MUST be restricted and auditable.
- Cross-environment access MUST be justified and narrowly scoped.
- Resource naming and tagging SHOULD make environment ownership identifiable.
- Test data MUST be controlled and appropriate to the target environment.

### 8.5 Alternatives

Possible approaches include separate accounts or projects, logically separated environments within an account, or a hybrid arrangement.

The selected approach MUST be justified by the threat model, team size, deployment model, audit needs, and operational cost.

### 8.6 Review Triggers

Review this decision if environment isolation is insufficient, access boundaries become difficult to audit, or account fragmentation materially increases operational risk.

## 9. CL-ADR-004 — Infrastructure-as-Code and State Management

**Status:** Proposed  
**Scope:** Infrastructure provisioning and change management

### 9.1 Context

Manual infrastructure changes are difficult to reproduce, review, and reconcile with deployed resources.

Infrastructure-as-code introduces its own risks, including state corruption, concurrent updates, unintended replacement, and poorly controlled privileges.

### 9.2 Proposed Decision

Managed cloud infrastructure SHOULD be provisioned and updated through version-controlled infrastructure-as-code.

The selected tool, module layout, state backend, locking behavior, and environment workflow MUST be documented in `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

### 9.3 Rationale

Declarative provisioning improves reproducibility, reviewability, and drift detection.

### 9.4 Consequences

- Infrastructure changes SHOULD be reviewed through version control.
- State MUST be protected against unauthorized access and accidental disclosure.
- Concurrent state modifications MUST be controlled.
- Secrets MUST NOT be committed to source control or exposed through state artifacts without appropriate protection.
- Plans or equivalent change previews SHOULD be reviewed before production application.
- Module interfaces SHOULD be explicit and versioned where necessary.
- Drift MUST be detected and reconciled through a documented workflow.
- Destructive changes MUST receive appropriate review.

### 9.5 Alternatives

Alternatives include imperative provisioning scripts, managed infrastructure templates, or a different declarative infrastructure tool.

The selected mechanism MUST be justified by maintainability, team skills, provider integration, policy enforcement, and state safety.

### 9.6 Review Triggers

Review this decision if state management becomes unreliable, infrastructure drift recurs, module reuse creates excessive coupling, or the selected tool cannot support required policy controls.

## 10. CL-ADR-005 — Network Segmentation and Ingress Controls

**Status:** Proposed  
**Scope:** Cloud networking and ingress implementation

### 10.1 Context

Cloud networking determines which workloads can communicate, which services are reachable from external networks, and how traffic is routed between infrastructure components.

Weak segmentation can expose internal services or make compromise containment difficult.

### 10.2 Proposed Decision

Cloud networking MUST implement explicit ingress, egress, and workload communication boundaries.

Public exposure MUST be limited to resources that require external reachability.

The network layout, subnet strategy, routing, firewall rules, and ingress implementation MUST be documented in `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

### 10.3 Rationale

Explicit segmentation reduces the attack surface and makes permitted communication paths easier to review.

### 10.4 Consequences

- Internal services SHOULD remain private unless external access is required.
- Administrative access MUST use approved, auditable access paths.
- Security-group or firewall rules MUST be scoped to required traffic.
- Unrestricted inbound and outbound rules SHOULD be avoided.
- Private service connectivity SHOULD be used where it materially reduces exposure.
- DNS, certificate, and load-balancer dependencies MUST be documented.
- Network changes MUST be tested for both reachability and isolation.

### 10.5 Ownership Boundary

Cloud network implementation belongs to `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

Cloud network security controls and infrastructure threat mitigation belong to `docs/cloud/architecture/SECURITY_ARCHITECTURE.md`.

System trust boundaries and application-level access policy remain owned by the applicable product/system security documents.

### 10.6 Review Triggers

Review this decision if new public endpoints are introduced, network rules become excessively broad, or required communication paths cannot be explained and audited.

## 11. CL-ADR-006 — Workload Hosting and Deployment Strategy

**Status:** Proposed  
**Scope:** Cloud compute and workload deployment

### 11.1 Context

Backend services, workers, and supporting components require a hosting strategy that balances operational effort, deployment safety, scalability, and cost.

Different workloads may have different startup, resource, networking, and lifecycle requirements.

### 11.2 Proposed Decision

The cloud implementation MUST define an explicit hosting model for each deployable workload category.

The selected compute service, container model, deployment mechanism, health checks, scaling rules, and shutdown behavior MUST be documented in `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

### 11.3 Rationale

Explicit workload placement makes runtime assumptions and operational responsibilities visible.

### 11.4 Consequences

- Workloads MUST declare required resources and configuration.
- Deployments MUST have a defined health and readiness strategy.
- Rolling or replacement deployments MUST account for in-flight work where applicable.
- Secrets MUST be injected through approved mechanisms rather than embedded in images.
- Images SHOULD be immutable and traceable to their source revision.
- Resource limits SHOULD prevent uncontrolled consumption.
- Rollback behavior MUST be documented for material deployment changes.
- Worker scaling MUST account for queue depth and processing capacity where relevant.

### 11.5 Alternatives

Possible approaches include managed containers, virtual machines, serverless compute, or other supported hosting models.

The choice MUST reflect workload lifecycle, latency, operational requirements, and cost.

### 11.6 Ownership Boundary

This record owns the rationale for cloud workload hosting and deployment implementation choices.

Backend service behavior and module lifecycle belong to the backend architecture documents.

Product-wide deployment and release requirements belong to the product/system decision register and architecture documents.

### 11.7 Review Triggers

Review this decision if workload startup or shutdown behavior conflicts with service requirements, scaling becomes unstable, or operational overhead exceeds the benefits of the selected hosting model.

## 12. CL-ADR-007 — Cloud Data and Messaging Services

**Status:** Proposed  
**Scope:** Cloud-managed storage, messaging, and cache integration

### 12.1 Context

Cloud-managed storage, messaging, and cache services can reduce operational effort but introduce provider-specific behavior, pricing, limits, and availability characteristics.

Their implementation must remain consistent with system data ownership and protocol semantics.

### 12.2 Proposed Decision

The cloud architecture MUST identify the selected infrastructure service for each cloud-managed data or messaging requirement.

The selection MUST distinguish the infrastructure service from the authoritative data model and application contract.

### 12.3 Rationale

This distinction allows cloud infrastructure to evolve without creating a competing definition of application data or event semantics.

### 12.4 Consequences

- Cloud storage access MUST use explicit workload identities and permissions.
- Data retention and lifecycle settings MUST be documented.
- Encryption requirements MUST be implemented through approved controls.
- Messaging resource configuration MUST reflect the actual delivery semantics required by the system.
- Cache usage MUST NOT silently become the authoritative source of persistent business data.
- Service quotas and size limits MUST be considered.
- Backup and restore requirements MUST be coordinated with the data owner.
- Provider-specific limitations MUST be documented.

### 12.5 Ownership Boundary

System data authority belongs to `docs/architecture/DATABASE_ARCHITECTURE.md`.

PostgreSQL implementation policy belongs to `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

Event semantics belong to `docs/protocol/EVENT_CONTRACT.md`.

Artifact semantics belong to `docs/protocol/ARTIFACT_MANIFEST.md`.

Cloud-managed resource selection and configuration belong to `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

### 12.6 Review Triggers

Review this decision if a service's delivery behavior conflicts with application requirements, retention obligations change, cost becomes material, or migration to an alternative service is considered.

## 13. CL-ADR-008 — Cloud Identity and Infrastructure Security

**Status:** Proposed  
**Scope:** Cloud IAM, workload identity, secrets, and infrastructure security controls

### 13.1 Context

Cloud infrastructure requires controlled identities for people, CI/CD pipelines, workloads, and automated operations.

Broad credentials, unmanaged secrets, and insufficient auditability can create systemic infrastructure risk.

### 13.2 Proposed Decision

Cloud identities and workload permissions MUST be managed through explicit, reviewable controls.

The cloud security implementation MUST define workload identity, administrative access, secret management, key management, infrastructure audit logging, and security monitoring.

Detailed controls MUST be documented in `docs/cloud/architecture/SECURITY_ARCHITECTURE.md`.

### 13.3 Rationale

Centralized and auditable cloud security controls reduce credential exposure and help constrain the impact of compromised workloads or operators.

### 13.4 Consequences

- Human and workload identities MUST be distinguishable.
- Long-lived credentials SHOULD be avoided where supported alternatives exist.
- CI/CD SHOULD use short-lived federated identity where feasible.
- Workload permissions MUST follow least privilege.
- Secrets MUST be stored in approved secret-management services.
- Key-management permissions MUST be scoped and audited.
- Infrastructure audit logs MUST be protected against unauthorized alteration.
- Security findings MUST have defined ownership and remediation paths.
- Privileged access MUST be reviewed periodically.

### 13.5 Ownership Boundary

This decision covers cloud identity and infrastructure security implementation.

Application authentication, application authorization, tenant policy, and system trust boundaries are owned by `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/`.

Backend enforcement of application security belongs to the relevant backend implementation documents.

### 13.6 Review Triggers

Review this decision if new workload identities are introduced, privileged access expands, credentials cannot be rotated safely, or infrastructure audit coverage becomes insufficient.

## 14. CL-ADR-009 — Infrastructure Recovery and Resilience

**Status:** Proposed  
**Scope:** Cloud backup, restoration, and recovery implementation

### 14.1 Context

Cloud resources can fail because of accidental deletion, deployment defects, regional disruption, credential compromise, or provider-level incidents.

Service availability alone does not prove that application state can be restored within required limits.

### 14.2 Proposed Decision

Cloud infrastructure MUST implement recovery mechanisms appropriate to the approved product/system requirements.

Backup, restore, replication, infrastructure recreation, and recovery validation MUST be documented in the cloud implementation architecture.

Recovery assumptions MUST distinguish infrastructure recovery from application-level data consistency.

### 14.3 Rationale

A documented and tested recovery process reduces the risk that infrastructure failure becomes prolonged service disruption or permanent data loss.

### 14.4 Consequences

- Backup scope and retention MUST be explicit.
- Backup access MUST be restricted.
- Recovery dependencies MUST be documented.
- Restoration procedures SHOULD be tested periodically.
- Infrastructure recreation MUST use controlled and reviewable provisioning.
- Recovery tests SHOULD verify application usability rather than only resource creation.
- Regional recovery assumptions MUST be documented when relevant.
- Recovery evidence MUST record material failures and corrective actions.

### 14.5 Ownership Boundary

This record owns cloud infrastructure recovery implementation choices.

Database backup, restore, and migration safety belong to `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

Product-level recovery objectives belong to the product/system architecture and decision register.

### 14.6 Review Triggers

Review this decision if recovery tests fail, backup retention requirements change, infrastructure dependencies change materially, or the existing recovery design no longer meets approved objectives.

## 15. CL-ADR-010 — Cloud Cost and Resource Governance

**Status:** Proposed  
**Scope:** Cloud resource sizing, scaling, and cost controls

### 15.1 Context

Cloud costs can grow through idle resources, excessive logging, overprovisioning, uncontrolled autoscaling, data transfer, and unmanaged test environments.

Optimizing only for the lowest nominal service price can increase operational burden or reduce reliability.

### 15.2 Proposed Decision

Material cloud architecture choices SHOULD include cost drivers and a method for measuring actual expenditure.

The cloud implementation MUST define resource ownership, environment tagging or equivalent attribution, and appropriate budget or anomaly controls.

Sizing and scaling policy MUST be documented in `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

### 15.3 Rationale

Explicit cost governance makes infrastructure expenditure visible and helps balance cost, performance, and reliability.

### 15.4 Consequences

- Resources SHOULD have identifiable owners and environment labels.
- Non-production resources SHOULD have lifecycle controls where practical.
- Autoscaling limits MUST account for both capacity and cost.
- Logging and telemetry retention SHOULD reflect diagnostic value and cost.
- Data transfer and storage growth SHOULD be measured where material.
- Budget thresholds SHOULD trigger actionable notifications.
- Capacity changes MUST consider service limits and workload characteristics.
- Cost optimization MUST NOT bypass security or recovery requirements.

### 15.5 Alternatives

Possible approaches include fixed capacity, scheduled scaling, demand-driven autoscaling, or a hybrid strategy.

The selected approach MUST be justified by workload variability, latency requirements, reliability expectations, and cost predictability.

### 15.6 Review Triggers

Review this decision if expenditure exceeds approved budgets, resource utilization remains consistently low or saturated, or cost-control mechanisms interfere with required service behavior.

## 16. Cloud Decision Workflow

### 16.1 Proposal

A cloud decision proposal MUST identify:

- The affected infrastructure capability.
- The problem or requirement.
- Relevant current cloud architecture.
- Constraints imposed by product/system decisions.
- Material alternatives.
- Expected security implications.
- Expected operational and cost implications.
- Validation requirements.
- The accountable owner.
- Relevant milestone dependencies.

A proposal MUST distinguish measured facts from estimates and assumptions.

### 16.2 Review

The cloud owner responsible for the affected infrastructure MUST review the proposal.

Security, backend, database, and other domain owners SHOULD participate when the decision affects their contracts, implementation responsibilities, or recovery assumptions.

A proposal that changes product-wide behavior MUST be escalated to `docs/planning/DECISIONS.md`.

### 16.3 Acceptance

A decision MAY be marked Accepted only after approval by the authorized cloud owner.

Acceptance MUST identify the selected approach and any material conditions.

A decision that depends on unresolved product/system approval MUST remain Proposed.

### 16.4 Implementation

Implementation MUST follow the accepted decision or record a justified deviation for review.

The cloud implementation architecture and infrastructure-as-code SHOULD be updated to reflect the resulting design.

Infrastructure code MUST NOT silently override an accepted decision.

### 16.5 Verification

Verification MUST confirm that the implementation satisfies the decision's stated requirements.

Evidence MAY include infrastructure plans, policy checks, deployment tests, network tests, security scans, recovery exercises, measurements, or cost reports.

Milestone completion MUST follow the applicable authoritative milestone dossier.

### 16.6 Closure

A decision MAY be marked implemented when the required infrastructure and validation are complete.

The record SHOULD link to the relevant infrastructure revision and evidence.

Implementation completion does not prevent a future decision from superseding the choice.

## 17. Relationship to Phases and Milestones

### 17.1 Phase Authority

`docs/planning/PHASES.md` is the canonical source for phase definitions.

This register MUST NOT redefine phase meaning or use phase references to expand milestone scope.

Cloud decisions MAY reference phases to indicate applicability or expected delivery context.

### 17.2 Canonical Phases

| Phase | Canonical name |
|---|---|
| P0 | FOUNDATION |
| P1 | STUDIO |
| P2 | BUILD & ARTIFACT |
| P3 | CONTROL PLANE |
| P4 | BOOKING & COMMERCIAL |
| P5 | EXECUTION |
| P6 | LAB & ROBOT |
| P7 | LIVE & RESULTS |
| P8 | PRODUCTION |

These names MUST be used exactly whenever phases are referenced in this register.

### 17.3 Cloud Milestones

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| C-M01 | FOUNDATION | P0 |
| C-M02 | DEVELOPMENT | P1-P3 |
| C-M03 | STAGING | P4-P7 |
| C-M04 | PRODUCTION | P8 |

Cloud milestone scope and acceptance MUST be taken from the authoritative dossiers under `docs/cloud/milestones/`.

### 17.4 Cross-Domain Milestone References

Cloud decisions MAY affect frontend, backend, or database implementation milestones.

When a decision affects multiple domains, the record SHOULD identify those dependencies and link to the applicable authoritative dossiers.

This register MUST NOT reproduce frontend, backend, or database milestone scope.

Each domain dossier remains authoritative for its own acceptance criteria.

### 17.5 Milestone Traceability

When a cloud decision is required to deliver a milestone, the relevant milestone dossier SHOULD reference the decision ID.

When implementation reveals that an accepted decision must change, the decision record MUST be reviewed through the defined workflow.

A decision's presence in a milestone dossier does not automatically make it Accepted or implemented.

## 18. Change Control and Supersession

### 18.1 Changes to Accepted Decisions

An accepted decision MUST NOT be silently changed to represent a materially different choice.

A material change MUST create a successor decision or use an explicit review process when the decision's identity and historical meaning remain unchanged.

The record MUST preserve the previous decision and explain the change.

### 18.2 Supersession

A superseding decision MUST:

- Have a new stable ID.
- Reference the decision it supersedes.
- Explain why the earlier choice is no longer appropriate.
- State the replacement choice.
- Identify affected infrastructure resources and environments.
- Document migration, rollback, and compatibility implications.
- Link to updated architecture documents and validation evidence.

The previous record MUST remain available for historical traceability.

### 18.3 Rejected Decisions

A rejected decision MUST remain distinguishable from an accepted decision.

The rejection rationale SHOULD be recorded so future proposals can reuse the analysis.

A rejected ID MUST NOT be reused.

### 18.4 Withdrawn Decisions

A decision MAY be withdrawn when its context no longer applies and no direct successor is required.

The withdrawal MUST state why the decision is no longer relevant.

### 18.5 Conflicting Records

If the cloud implementation architecture conflicts with an accepted cloud decision, the cloud owner MUST resolve the inconsistency.

If a cloud decision conflicts with a product/system decision, the product/system decision remains authoritative until formally changed.

Infrastructure code or a copied description in another document MUST NOT override the authoritative decision record.

## 19. Review and Maintenance

### 19.1 Decision Ownership

Every cloud decision MUST have an accountable owner.

The owner is responsible for status, rationale, references, validation evidence, and review triggers.

The owner SHOULD ensure that current cloud architecture documents reflect accepted decisions without duplicating the complete decision record.

### 19.2 Review Triggers

Cloud decisions SHOULD be reviewed when:

- A major provider or managed-service change is proposed.
- Account or environment boundaries change materially.
- Infrastructure-as-code tooling or state management changes.
- New external ingress paths are introduced.
- Workload hosting or deployment strategy changes.
- Security controls or identity mechanisms change.
- Recovery tests reveal a material weakness.
- Cost assumptions become inaccurate.
- A product/system decision changes.
- A milestone dossier identifies a blocker requiring a cloud architecture change.

### 19.3 Periodic Review

The cloud decision register SHOULD be reviewed at major infrastructure and release checkpoints.

The review SHOULD identify:

- Decisions that remain valid.
- Decisions that need implementation evidence.
- Decisions that should be superseded.
- Proposed decisions that are no longer relevant.
- Infrastructure deviations requiring formal review.
- Cloud implementation concerns that expose a missing product/system decision.

Periodic review MUST NOT become a duplicate review of every infrastructure resource.

### 19.4 Decision Quality

A cloud decision SHOULD be:

- Specific and actionable.
- Narrowly scoped.
- Clear about assumptions.
- Honest about alternatives and trade-offs.
- Verifiable through tests, policy checks, or measurements.
- Traceable to affected infrastructure.
- Consistent with product/system and security requirements.
- Explicit about operational and cost implications.

### 19.5 Exceptions

A deviation from an accepted cloud decision MUST be documented when it materially affects architecture, security, reliability, cost, or compatibility.

The exception MUST identify the scope, rationale, owner, approval, and review date.

A temporary deviation MUST NOT silently become the permanent infrastructure design.

## 20. Cloud Decision Register Checklist

### 20.1 Ownership

- [ ] Cloud-specific decisions are recorded here.
- [ ] Product/system decisions link to `docs/planning/DECISIONS.md`.
- [ ] Product/system cloud topology remains in `docs/architecture/CLOUD_ARCHITECTURE.md`.
- [ ] Cloud implementation architecture remains in `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.
- [ ] Cloud infrastructure security remains in `docs/cloud/architecture/SECURITY_ARCHITECTURE.md`.
- [ ] Application security policy remains in its authoritative security documents.
- [ ] Database implementation decisions remain with the database architecture owner.
- [ ] Backend and frontend implementation decisions remain in their domain registers.
- [ ] API, event, and artifact contracts remain in their protocol documents.
- [ ] No product-wide decision content has been duplicated.

### 20.2 Record Quality

- [ ] Every accepted decision has a stable ID.
- [ ] Status and date are explicit.
- [ ] Context, decision, rationale, and consequences are recorded.
- [ ] Material alternatives are documented.
- [ ] Affected resources and environments are identified.
- [ ] Related decisions and architecture documents are linked.
- [ ] Review triggers are defined.
- [ ] Superseded decisions identify their successors.

### 20.3 Implementation and Verification

- [ ] Accepted decisions are reflected in current cloud architecture documents.
- [ ] Infrastructure code is consistent with accepted decisions.
- [ ] Validation criteria are explicit.
- [ ] Evidence links identify relevant infrastructure revisions or tests.
- [ ] Deviations are reviewed.
- [ ] Environment separation and least privilege are considered.
- [ ] Recovery, security, and cost implications are considered where applicable.

### 20.4 Phase and Milestone Traceability

- [ ] Phase references use the canonical model in `docs/planning/PHASES.md`.
- [ ] Cloud milestone identifiers and names use the frozen canonical model.
- [ ] Milestone scope is obtained from authoritative cloud milestone dossiers.
- [ ] Cross-domain impacts link to relevant domain dossiers.
- [ ] Milestone acceptance criteria are not duplicated in this register.

## 21. Definition of Done

The cloud decision register is ready for ongoing use when:

1. Its cloud-only ownership boundary is explicit.
2. Product/system decisions are referenced through `docs/planning/DECISIONS.md`.
3. Cloud decisions have stable IDs, statuses, owners, and review triggers.
4. Current cloud implementation architecture remains documented in the appropriate architecture documents.
5. Cloud infrastructure security remains documented in its designated security architecture.
6. Application security, database implementation, backend implementation, and frontend implementation decisions are not duplicated here.
7. Decision history and supersession relationships remain traceable.
8. Cloud milestone scope remains governed by authoritative dossiers.
9. Phase and milestone references use the frozen canonical model.
10. Decisions can be verified without turning this register into an infrastructure task tracker or implementation manual.

This document owns cloud-specific architecture decisions only. Product-wide decisions remain owned by `docs/planning/DECISIONS.md`, and all other domain decisions remain in their respective authoritative registers, architecture documents, contracts, and milestone dossiers. All changes MUST preserve this ownership boundary.
