# Cloud Security Architecture

**Document:** `docs/cloud/architecture/SECURITY_ARCHITECTURE.md`  
**Project:** Kritva RaaS  
**Status:** Infrastructure security architecture contract  
**Audience:** Cloud engineering, platform engineering, DevSecOps, security engineering, SRE, and technical leadership  
**Normative language:** MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY express requirements.

## 1. Purpose

This document defines the cloud and infrastructure security architecture for Kritva RaaS.

It specifies how cloud infrastructure is protected through cloud IAM, workload identity, network security controls, key management, secrets services, infrastructure audit logging, edge protection, vulnerability management, patch management, and cloud security monitoring.

The objective is to establish a repeatable infrastructure security baseline across development, staging, and production while preserving a clear boundary between infrastructure controls and application-level security responsibilities.

Cloud security MUST be implemented through version-controlled configuration, automated policy checks, explicit ownership, and auditable operational procedures.

This document covers infrastructure enforcement and evidence. It does not define the application's authentication, authorization, session, tenant, or trust-boundary model.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns cloud and infrastructure security implementation, including:

- Cloud account and organization security configuration.
- Cloud IAM policies, administrative roles, and workload identity.
- CI/CD federation and infrastructure deployment permissions.
- Network security groups, firewall rules, routing restrictions, and private endpoints.
- Cloud KMS configuration and key policies.
- Cloud secrets-management services and secret-access controls.
- Infrastructure audit logging and protection of audit records.
- Web Application Firewall (WAF), edge protection, and public ingress controls.
- Cloud resource configuration baselines and policy enforcement.
- Cloud workload and container vulnerability management.
- Infrastructure and operating-system patch management where applicable.
- Cloud security posture monitoring and security findings.
- Cloud security incident detection and response integration.
- Infrastructure encryption and resource-level data protection settings.
- Security-specific cloud monitoring, alarms, and evidence collection.
- Cloud security exceptions, remediation tracking, and acceptance checks.

### 2.2 Application Security Ownership

`docs/architecture/SECURITY_ARCHITECTURE.md` and the applicable documents under `docs/security/` own the application security model, including:

- Application trust boundaries and their rationale.
- Authentication and identity semantics at the product level.
- Application authorization and permission evaluation.
- User, tenant, workspace, and resource access rules.
- Application session and token semantics.
- API-level authentication and authorization requirements.
- Application-level security invariants and abuse cases.
- Security requirements for business workflows.
- Application security threat modeling and security acceptance criteria.

This document MUST reference those authorities instead of restating their design.

Cloud IAM policies MAY restrict which workload can reach a resource. They MUST NOT be treated as a replacement for application authorization.

### 2.3 Other Document Ownership

| Concern | Authoritative document |
|---|---|
| Application security model, trust boundaries, and authentication/authorization design | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Cloud and infrastructure security implementation | `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` |
| Product/system cloud topology | `docs/architecture/CLOUD_ARCHITECTURE.md` |
| Cloud implementation architecture and resource deployment | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| System backend modules and ownership | `docs/architecture/BACKEND_ARCHITECTURE.md` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| API implementation and API error handling | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| API wire contract | `docs/protocol/API_CONTRACT.md` |
| Event contract | `docs/protocol/EVENT_CONTRACT.md` |
| Artifact manifest and artifact semantics | `docs/protocol/ARTIFACT_MANIFEST.md` |
| PostgreSQL implementation, database roles, and database-level access controls | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Phase definitions | `docs/planning/PHASES.md` |
| Cloud milestone scope and acceptance | `docs/cloud/milestones/` |
| Cross-discipline milestone scope | The applicable authoritative dossiers under `docs/**/milestones/` |

A referenced document remains authoritative only for the concern identified in the table. This document MUST NOT create a competing definition of an adjacent concern.

### 2.4 Explicit Non-Goals

This document MUST NOT define or duplicate:

- User login, password, session, or token behavior.
- Application authentication flows.
- Application role and permission semantics.
- Tenant membership or resource-level authorization rules.
- API authentication and authorization behavior.
- Product-level trust boundaries.
- Business-level data ownership or privacy policy.
- API request and response contracts.
- Application event authorization semantics.
- Application-level audit event schemas.
- The cloud resource topology or service-to-resource mapping in detail.
- PostgreSQL schema, transaction, or RLS implementation details beyond infrastructure security requirements.
- Robot-side security mechanisms or real-time safety behavior.
- Phase definitions or milestone scope.

When a security requirement spans both application and infrastructure layers, each authoritative document MUST define only the controls it owns and link to the other layer.

## 3. Security Principles

### 3.1 Least Privilege

Cloud identities MUST receive only the permissions needed for their approved operations.

Administrative, deployment, workload runtime, monitoring, and recovery privileges MUST be separated.

Broad wildcard permissions SHOULD be avoided. Where a wildcard is required by a provider API or service integration, its scope and justification MUST be documented.

### 3.2 Explicit Trust

Every cloud trust relationship MUST identify the trusted principal, permitted actions, resource scope, and conditions.

Cross-account access MUST use explicit trust policies.

Network reachability MUST NOT be interpreted as proof of application-level authorization.

### 3.3 Defense in Depth

Critical resources SHOULD be protected by multiple independent controls, such as IAM, network isolation, encryption, resource policies, and monitoring.

No single control SHOULD be treated as sufficient when a second independent control is practical and materially reduces risk.

### 3.4 Secure Defaults

New environments and resources MUST start from an approved secure baseline.

Public access, broad network ingress, unrestricted administrative privileges, and unencrypted storage MUST NOT be enabled by default.

### 3.5 Auditable Changes

Security-sensitive infrastructure changes MUST be attributable to an identity and linked to an approved revision or documented emergency action.

Manual changes MUST be reconciled with the source-controlled infrastructure definition.

### 3.6 Continuous Verification

Security configuration MUST be checked at provisioning time and monitored for drift where supported.

A successful initial deployment MUST NOT be treated as proof that the resource remains compliant.

### 3.7 Bounded Exceptions

Security exceptions MUST identify an owner, justification, scope, compensating controls, approval, and review or expiry date.

An exception MUST NOT silently become the permanent security baseline.

## 4. Reference Cloud Security Implementation

### 4.1 Reference Provider

The initial reference implementation uses AWS.

The implementation SHOULD use AWS Organizations, IAM, VPC security controls, AWS KMS, AWS Secrets Manager, AWS CloudTrail, AWS Config where appropriate, Amazon GuardDuty, AWS Security Hub, AWS WAF, and Amazon ECR image scanning or an approved equivalent.

The exact resource placement, account structure, and deployment topology are owned by `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

This document defines the security properties that those resources MUST enforce.

### 4.2 Provider-Neutral Requirements

Security requirements SHOULD be expressed in provider-neutral terms where practical.

The implementation MUST define the equivalent provider-specific controls for:

- Human identity federation.
- Workload identity.
- Least-privilege policy enforcement.
- Network isolation.
- Secret storage.
- Key management.
- Audit logging.
- Vulnerability detection.
- Security posture monitoring.
- Incident notification.
- Security evidence retention.

Provider-neutral abstractions MUST NOT hide a material difference in policy evaluation, logging, encryption, or failure behavior.

### 4.3 Security Control Mapping

| Security capability | AWS reference implementation | Required outcome |
|---|---|---|
| Organization guardrails | AWS Organizations and applicable service control policies | Restrict prohibited account-level actions |
| Human cloud access | IAM Identity Center or approved federation | Centralized, attributable access |
| Workload identity | IAM roles and service-specific identity mechanisms | Short-lived, narrowly scoped permissions |
| Network enforcement | VPC, security groups, network ACLs, routing, and endpoints | Restricted connectivity |
| Key management | AWS KMS | Controlled cryptographic key use |
| Secrets | AWS Secrets Manager | Protected runtime secret retrieval |
| Audit trail | AWS CloudTrail | Attributable control-plane activity |
| Configuration monitoring | AWS Config or equivalent | Detect noncompliant resource configuration |
| Threat detection | Amazon GuardDuty or equivalent | Detect suspicious cloud activity |
| Security findings | AWS Security Hub or approved central workflow | Aggregate and track findings |
| Edge filtering | AWS WAF and supported edge controls | Filter approved public ingress |
| Image scanning | Amazon ECR scanning or approved scanner | Detect image vulnerabilities |
| Security notification | Approved monitoring and incident channels | Route actionable security findings |

The table identifies reference services, not a requirement to enable every service in every environment. Any omitted control MUST have a documented rationale and an equivalent risk treatment.

## 5. Cloud Organization and Account Security

### 5.1 Account Separation

Production MUST be isolated from non-production using a dedicated cloud account or an approved equivalent boundary.

The organization SHOULD maintain separate accounts for management, security operations, shared services, development, staging, and production when operationally justified.

The organization management account MUST NOT host ordinary application workloads.

The detailed account layout is owned by `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

### 5.2 Organization Guardrails

Organization-level guardrails SHOULD prevent high-impact misconfiguration, including:

- Disabling mandatory audit logging.
- Disabling required security monitoring.
- Removing mandatory security services.
- Leaving approved organizational boundaries without authorization.
- Creating prohibited public resource configurations.
- Disabling required encryption or backup controls.
- Modifying protected security resources without appropriate permission.

Guardrails MUST be tested to ensure they do not block necessary recovery operations without providing an approved alternative.

### 5.3 Account Root Access

Root credentials MUST be protected using the provider's strongest supported authentication controls.

Root access MUST NOT be used for routine administration.

Root credentials MUST NOT be shared or embedded in automation.

Root-access events MUST be monitored and investigated according to the security incident process.

Recovery arrangements for root access MUST be documented and restricted.

### 5.4 Account Recovery

Account recovery procedures MUST be documented.

Recovery access MUST be independent of ordinary application runtime credentials.

Emergency access MUST be attributable, restricted, and reviewed after use.

## 6. Cloud IAM and Workload Identity

### 6.1 Human Identity

Human access to cloud resources MUST use approved centralized identity federation or an equivalent managed identity mechanism.

Individual long-lived access keys SHOULD NOT be used for routine administration.

Human identities MUST be individually attributable.

Shared administrator identities MUST NOT be used for normal operations.

### 6.2 Administrative Roles

Administrative permissions MUST be limited to personnel with an approved operational need.

Read-only, deployment, security investigation, infrastructure administration, and recovery duties SHOULD use distinct roles when their permissions differ materially.

Production administrative access SHOULD be time-bounded and require additional approval where the identity platform supports it.

### 6.3 Workload Roles

Each independently deployed workload SHOULD use a distinct runtime role when its resource permissions differ from those of other workloads.

Workloads MUST use the approved workload identity mechanism rather than embedded access keys.

ECS tasks MUST use task roles for application access to AWS services.

Task execution permissions and application runtime permissions MUST be separate.

A workload MUST NOT inherit broad infrastructure administration privileges.

### 6.4 Role Trust Policies

Role trust policies MUST constrain the permitted principal and, where supported, the source account, workload, repository, branch, environment, or other relevant identity attributes.

Trust policies MUST NOT permit arbitrary external principals.

Cross-account roles MUST identify the source account and the intended use.

Changes to trust policies MUST receive security review.

### 6.5 CI/CD Federation

CI/CD systems SHOULD use short-lived federated credentials.

Deployment permissions MUST be separated from untrusted build and test execution.

Pull-request jobs MUST NOT receive production deployment credentials.

Production deployment roles MUST be restricted to approved repositories, branches, environments, and workflows where the identity provider supports those conditions.

Credential issuance and deployment actions MUST be auditable.

### 6.6 Permission Boundaries

IAM policies MUST scope actions to the resources that require them wherever the provider supports resource-level permissions.

Wildcard actions MUST be avoided where narrower actions exist.

Policies MUST be reviewed when a new service integration or resource type is introduced.

Permissions that are no longer required MUST be removed.

### 6.7 Access Reviews

Privileged identities and cross-account trust relationships MUST be reviewed periodically.

Review frequency SHOULD reflect privilege level and operational risk.

Unused identities, obsolete trust relationships, and abandoned deployment roles MUST be disabled or removed.

Access review results MUST identify remediation actions and owners.

## 7. Network Security Controls

### 7.1 Network Boundary

Network controls MUST implement the approved topology defined by `docs/architecture/CLOUD_ARCHITECTURE.md`.

Development, staging, and production SHOULD use separate network boundaries.

Production MUST NOT share application security groups with non-production workloads.

Network segmentation MUST be enforced through actual routing and security controls, not merely naming conventions.

### 7.2 Ingress

Only approved public endpoints MAY accept inbound internet traffic.

Public ingress MUST use approved listeners and protocols.

Administrative services, databases, caches, and internal workers MUST NOT be directly exposed to the public internet.

Public ingress changes MUST be reviewed before deployment.

### 7.3 Security Groups

Security groups MUST follow a default-deny inbound approach.

Inbound rules SHOULD reference known workload security groups or narrowly scoped network ranges.

Rules allowing unrestricted access MUST be justified, approved, and monitored.

Unused security group rules MUST be removed.

### 7.4 Network ACLs and Routing

Network ACLs MAY provide additional subnet-level filtering where they offer meaningful protection.

Routing tables MUST be reviewed for unintended public or cross-environment paths.

Route changes MUST be reviewed when they introduce new trust relationships or external connectivity.

Network ACLs MUST NOT be configured in a way that silently breaks required traffic without a documented operational test.

### 7.5 Egress Controls

Outbound connectivity MUST be limited to required destinations and protocols where practical.

Workloads SHOULD use private service endpoints for supported cloud services when this reduces exposure or materially improves control.

Broad unrestricted egress SHOULD be avoided for sensitive workloads.

Egress controls MUST account for software updates, approved external integrations, certificate validation, and operational dependencies.

### 7.6 Cross-Environment Isolation

Production and non-production network paths MUST be explicitly controlled.

Non-production workloads MUST NOT receive implicit access to production databases, secrets, or internal endpoints.

Any approved cross-environment path MUST document its purpose, source, destination, permitted protocols, identity requirements, and monitoring.

### 7.7 Private Connectivity

VPNs, private links, peering, and other private connectivity mechanisms MUST be introduced only for a defined integration requirement.

Private connectivity MUST have explicit route ownership, access control, and failure handling.

A private network path MUST NOT be treated as a substitute for application authentication or authorization.

## 8. Edge Security and WAF

### 8.1 Public Edge

Public HTTP(S) ingress SHOULD use the approved managed edge and load-balancing architecture.

TLS MUST be enforced for public application endpoints.

The implementation MUST define how HTTP requests are redirected to HTTPS or rejected when insecure transport is not permitted.

The authoritative system topology and endpoint placement are owned by `docs/architecture/CLOUD_ARCHITECTURE.md`.

### 8.2 WAF

AWS WAF or an approved equivalent SHOULD protect public HTTP(S) endpoints where the exposure and risk justify it.

WAF configuration SHOULD include appropriate managed rule groups, request-size limits, and protection against common web attack patterns.

Rules MUST be tuned to avoid blocking legitimate traffic without leaving known attack paths unprotected.

WAF MUST NOT be represented as a replacement for application input validation or application authorization.

### 8.3 Rate and Abuse Controls

Infrastructure-level rate controls MAY be applied at the edge when they protect shared capacity or mitigate abusive traffic.

Rate-control settings MUST be coordinated with application-level quotas and rate limits owned by the relevant application security and API documents.

Infrastructure controls MUST NOT redefine product-level usage entitlements.

### 8.4 Edge Logging

Edge access logs SHOULD be enabled for production public endpoints.

Logs MUST avoid unnecessary capture of sensitive query parameters, tokens, or request bodies.

Access to edge logs MUST be restricted and audited.

Retention MUST align with operational investigation and applicable security requirements.

### 8.5 WAF Rule Changes

WAF rule changes MUST be version-controlled where supported.

Managed rule updates SHOULD be tested against representative traffic before broad production enforcement when the provider allows staged rollout.

Emergency rule changes MUST be reviewed after the incident and reconciled into the approved configuration.

## 9. Cloud KMS and Encryption

### 9.1 Key Management

AWS KMS is the reference key-management service.

Keys MUST have explicit ownership, purpose, access policy, and lifecycle requirements.

Key policies MUST restrict key administration and cryptographic use to approved identities.

Application workloads MUST NOT receive broad key-administration privileges merely because they need to encrypt or decrypt application data.

### 9.2 Key Separation

Production and non-production encryption keys SHOULD be separated where practical.

Keys protecting high-impact resources SHOULD have distinct administrative boundaries from the workloads using them.

Cross-account key access MUST be explicitly approved and narrowly scoped.

### 9.3 Key Rotation

Key rotation MUST follow the applicable security policy and service capabilities.

Where automatic rotation is supported and appropriate, it SHOULD be enabled.

Rotation procedures MUST account for dependent services, encrypted data, and recovery requirements.

Key rotation MUST NOT be assumed to re-encrypt all historical data unless the selected service explicitly guarantees that behavior.

### 9.4 Key Deletion

Key deletion MUST be protected against accidental or unauthorized execution.

Production key deletion MUST require appropriate review and a defined waiting or recovery procedure where supported.

Keys MUST NOT be deleted while required data, backups, or recovery artifacts depend on them.

### 9.5 Encryption at Rest

Persistent cloud resources MUST use approved encryption at rest.

This requirement includes databases, object storage, logs, backups, container registry data, and other supported durable resources.

The exact resource-level configuration is defined in `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

Unencrypted resources MUST NOT be introduced as a production shortcut.

### 9.6 Encryption in Transit

Cloud service communications MUST use approved encrypted transport where supported.

Service clients MUST validate server identity.

Disabling TLS certificate verification MUST NOT be accepted as a production workaround.

Internal connectivity MUST NOT be assumed safe solely because it uses private IP addresses.

## 10. Secrets Management

### 10.1 Approved Services

AWS Secrets Manager is the reference service for runtime secrets.

AWS Systems Manager Parameter Store or an approved equivalent MAY be used for non-secret configuration.

The choice of service MUST reflect confidentiality, rotation, lifecycle, access-control, and audit requirements.

### 10.2 Secret Categories

Secrets include, where applicable:

- Database credentials.
- Third-party service credentials.
- Signing or integration keys.
- Private keys and client certificates.
- Deployment credentials that cannot be federated.
- Operational recovery credentials.

The application authentication and token model remains owned by `docs/architecture/SECURITY_ARCHITECTURE.md` and the applicable documents under `docs/security/`.

### 10.3 Secret Access

Secrets MUST be accessed through workload identity and narrowly scoped resource policies.

A workload MUST NOT be able to retrieve unrelated service secrets.

Secret access SHOULD be limited to the resources and operations that require it.

Cross-account secret access MUST have explicit trust and key policies.

### 10.4 Secret Storage Restrictions

Secret values MUST NOT be stored in:

- Source code.
- Version-controlled environment files.
- Container image layers.
- Terraform state unless unavoidable and protected by explicit controls.
- Unrestricted CI variables.
- Public artifacts.
- Application or infrastructure logs.
- Exception traces without redaction.

Where infrastructure tooling must handle a secret value, state access and output exposure MUST be tightly restricted.

### 10.5 Rotation

Secrets SHOULD have a documented rotation strategy.

Automatic rotation SHOULD be used where supported and compatible with the dependent service.

Rotation procedures MUST account for active connections, deployment overlap, cached credentials, and rollback behavior.

Rotation failure MUST generate an actionable alert.

### 10.6 Secret Exposure Response

A suspected secret exposure MUST trigger containment, impact assessment, revocation or rotation, and investigation according to the incident process.

The response MUST identify affected resources and access logs where available.

The exposed value MUST NOT be repeated in incident reports or chat messages unless an approved secure process requires it.

## 11. Infrastructure Audit Logging

### 11.1 CloudTrail

AWS CloudTrail or an equivalent provider audit service MUST capture relevant cloud control-plane activity for production.

Audit logging SHOULD cover all required regions and accounts.

The configuration MUST include events needed to investigate identity changes, permission changes, resource exposure, key operations, and security monitoring changes.

### 11.2 Centralization

Production audit records SHOULD be centralized into a protected security or logging account.

Centralization MUST preserve source-account identity and event provenance.

The source workload MUST NOT have unrestricted ability to delete or alter its own security audit records.

### 11.3 Audit Storage Protection

Audit storage MUST use appropriate encryption and access policies.

Retention MUST meet the approved security and operational requirements.

Deletion and lifecycle changes affecting protected audit records MUST be restricted and monitored.

Where supported, integrity validation SHOULD be enabled.

### 11.4 Audit Coverage

Audit coverage MUST include, where applicable:

- Human and workload role assumption.
- IAM policy and trust-policy changes.
- Security group and routing changes.
- Public resource exposure changes.
- KMS key policy and lifecycle changes.
- Secret access and secret policy changes.
- Logging configuration changes.
- Security monitoring configuration changes.
- Production deployment and infrastructure modification.
- Account-level security control changes.

### 11.5 Audit Review

Audit events MUST be available to authorized incident responders.

High-impact events SHOULD generate alerts.

Periodic review SHOULD identify unexpected privileged access, unusual resource changes, and attempts to disable security controls.

### 11.6 Audit Failure

Loss of required production audit logging MUST be treated as a security incident or significant security control failure.

The team MUST investigate the cause and restore coverage.

Where audit gaps exist, their duration and affected accounts MUST be documented.

## 12. Cloud Security Monitoring

### 12.1 Monitoring Baseline

Production accounts MUST have approved cloud security monitoring enabled.

The reference implementation SHOULD use GuardDuty, Security Hub, Config, CloudTrail, and provider-native threat detection where applicable.

Equivalent tools MAY be used if they provide the required detection coverage and evidence.

### 12.2 Configuration Drift

Security monitoring MUST detect material deviations from the approved infrastructure baseline where supported.

Examples include:

- Publicly exposed databases.
- Publicly accessible object storage.
- Unapproved ingress rules.
- Disabled encryption.
- Disabled audit logging.
- Overly broad IAM policies.
- Unapproved cross-account trust.
- Missing required backups.
- Missing security monitoring.
- Unapproved high-risk resource configuration.

### 12.3 Threat Findings

Security findings MUST have a severity, affected resource, source, detection time, owner, status, and remediation path.

High-severity findings MUST be triaged according to the incident-response policy.

Findings MUST NOT be dismissed solely to reduce dashboard counts.

Accepted findings MUST include documented rationale, compensating controls, approval, and a review date.

### 12.4 Monitoring Coverage

The security owner MUST periodically verify that all production accounts and supported regions are covered.

New accounts and regions MUST be enrolled into the approved monitoring baseline before production workloads are activated.

Monitoring exclusions MUST be documented and approved.

### 12.5 Security Alert Routing

High-impact security alerts MUST route to an owned operational or incident-response channel.

Alert delivery MUST be tested.

The alerting path MUST not depend exclusively on the workload suspected of being compromised.

## 13. Vulnerability Management

### 13.1 Scope

Vulnerability management MUST cover applicable infrastructure and deployment artifacts, including:

- Container images.
- Operating-system packages in managed or self-managed compute.
- Infrastructure tooling and providers.
- Cloud configuration weaknesses.
- Supported database engine and extension versions.
- Externally exposed infrastructure components.
- Dependencies used by deployment and maintenance automation.

Application dependency and source-code security requirements remain governed by the applicable application security and development documents.

### 13.2 Container Scanning

Container images MUST be scanned through an approved process.

Production deployment SHOULD be blocked for critical findings unless a documented, time-bounded exception has been approved.

Images MUST be associated with a source revision and immutable digest or equivalent stable identity.

The team MUST be able to identify which deployed workloads use an affected image.

### 13.3 Vulnerability Severity

Findings MUST be prioritized using severity, exploitability, exposure, asset criticality, and available mitigations.

Internet-exposed and privileged infrastructure SHOULD receive higher remediation priority when other risk factors are comparable.

The security policy MUST define response targets for severity categories.

### 13.4 Remediation Tracking

Each material finding MUST have an owner and status.

Remediation MUST be verified after the fix is applied.

If a finding cannot be fixed within the required response target, the owner MUST document the reason, mitigation, approval, and next review date.

### 13.5 Exceptions

Exceptions MUST be specific to the affected resource, image, package, or finding.

A blanket exception for an entire environment SHOULD NOT be used when narrower treatment is possible.

Exceptions MUST expire or undergo a scheduled review.

## 14. Patch Management

### 14.1 Managed Services

Managed cloud services MUST follow the provider's supported maintenance and security-update model.

The project MUST track service version support and relevant maintenance requirements.

Managed-service responsibility MUST NOT be interpreted as eliminating the need for customer configuration, compatibility testing, and update planning.

### 14.2 Container Base Images

Container base images MUST use supported versions.

The build pipeline SHOULD detect stale base images and known vulnerabilities.

Security updates MUST be incorporated through controlled image rebuilds and deployment.

Rebuilding an image MUST NOT be assumed to patch an already deployed container.

### 14.3 Self-Managed Compute

Any self-managed operating system or compute component MUST have a documented patch owner and patching procedure.

Patch schedules MUST consider severity, exposure, compatibility, and operational impact.

Unsupported operating systems MUST NOT be used for production without an approved risk decision and migration plan.

### 14.4 Emergency Patching

Critical actively exploited vulnerabilities MAY require an expedited patch procedure.

The procedure MUST define authorization, validation, rollout, monitoring, and recovery.

Emergency patching MUST preserve auditability.

A post-change review MUST confirm the intended fix and record any remaining exposure.

### 14.5 Patch Evidence

Patch evidence SHOULD include the affected resource or image, previous and resulting versions, execution time, validation outcome, and unresolved findings.

Failed patch attempts MUST be visible and assigned for remediation.

## 15. Infrastructure Policy as Code

### 15.1 Policy Enforcement

Security-critical infrastructure requirements SHOULD be expressed as automated policies.

Policy checks SHOULD run during pull-request validation and before applying production changes.

Policies MUST cover the security properties that can be reliably verified from infrastructure configuration.

### 15.2 Mandatory Checks

The infrastructure pipeline MUST check, where applicable:

- Public exposure restrictions.
- Required encryption.
- IAM least privilege.
- Approved network boundaries.
- Audit logging.
- Security monitoring enrollment.
- Required production backup configuration.
- Resource protection.
- Secret handling.
- Required ownership and environment tags.
- Approved provider and module versions.

### 15.3 Failure Behavior

A failed mandatory security policy MUST block normal production deployment.

Exceptions MUST use the approved security exception process.

A policy exception MUST NOT be implemented by silently disabling the entire policy suite.

### 15.4 Drift Detection

Drift detection SHOULD identify manual changes that weaken the approved security baseline.

Detected drift MUST be classified as authorized emergency change, expected provider behavior, or unauthorized deviation.

Unauthorized security drift MUST be corrected promptly according to severity.

### 15.5 Evidence

The pipeline SHOULD retain policy results, infrastructure plan identity, source revision, approval identity, and deployment outcome.

Evidence MUST be protected from unauthorized alteration.

## 16. Infrastructure Security Incident Response

### 16.1 Response Readiness

The project MUST maintain an infrastructure security incident process that identifies detection, triage, containment, investigation, recovery, and post-incident review responsibilities.

The detailed organization-wide and application security response model remains owned by the applicable documents under `docs/security/`.

### 16.2 Detection and Triage

A security finding MUST be assessed for affected accounts, resources, identities, data exposure, persistence, and potential lateral movement.

Triage MUST distinguish confirmed compromise from suspected compromise and configuration noncompliance.

### 16.3 Containment

Containment MAY include:

- Disabling or restricting a compromised workload role.
- Revoking or rotating exposed credentials.
- Removing unintended public ingress.
- Isolating a workload or network path.
- Restricting access to a compromised resource.
- Blocking a malicious source where evidence supports it.
- Preserving relevant audit and diagnostic records.

Containment MUST consider the risk of interrupting critical production services.

### 16.4 Evidence Preservation

Relevant audit logs, security findings, deployment records, configuration revisions, and forensic evidence MUST be preserved according to the incident process.

Evidence access MUST be restricted.

Investigation procedures MUST avoid unnecessarily modifying the compromised resource before required evidence has been captured, unless immediate containment takes priority.

### 16.5 Recovery

Recovery MUST include validation that the underlying security weakness has been addressed.

Credentials and trust relationships MUST be reviewed after a compromise.

Recovered resources MUST be returned to the approved baseline.

### 16.6 Post-Incident Review

Material incidents MUST result in a documented review.

The review SHOULD identify the initial weakness, detection gap, containment effectiveness, recovery outcome, and preventive actions.

Corrective actions MUST have owners and target dates.

## 17. Security of Infrastructure Automation

### 17.1 Source Control

Infrastructure code MUST be version-controlled.

Production infrastructure changes MUST be reviewed before application except under a documented emergency procedure.

Branch protections SHOULD require relevant validation and approval.

### 17.2 Build and Deployment Separation

Build, test, and deployment stages SHOULD use distinct identities and permissions.

Untrusted code execution MUST NOT inherit production deployment credentials.

Production deployment permissions MUST be granted only to approved workflows.

### 17.3 Provider and Module Dependencies

Infrastructure providers and modules MUST be pinned to approved versions or immutable revisions.

Dependency upgrades MUST be reviewed for security fixes, behavioral changes, and permission changes.

Untrusted modules MUST NOT be introduced into production infrastructure without review.

### 17.4 Plan Review

Production plans MUST be reviewed for:

- New public exposure.
- IAM and trust-policy changes.
- Network routing and security-group changes.
- Encryption and key-policy changes.
- Audit and monitoring changes.
- Resource deletion or replacement.
- Changes to backup and recovery protection.
- Unexpected resource or cost changes.

A plan that weakens a mandatory security control MUST be blocked or handled through an approved exception.

### 17.5 Emergency Changes

Emergency infrastructure changes MUST be attributable and documented.

The responsible owner MUST reconcile the change into source-controlled infrastructure after containment or recovery.

Emergency access MUST be reviewed after use.

## 18. Environment Security Baselines

### 18.1 Development

Development MUST use approved identity and network controls.

Development MAY have lower availability and shorter log retention than production where approved.

Development MUST NOT use production credentials.

Public ingress MUST remain restricted to approved test endpoints.

Development permissions SHOULD support engineering productivity without granting unnecessary production access.

### 18.2 Staging

Staging MUST use security controls representative of production for the behaviors under validation.

Staging MUST have separate secrets and database credentials.

Security policy checks, image scanning, and infrastructure audit logging SHOULD be enabled.

Any deliberate reduction in a security control MUST be documented and MUST NOT invalidate the intended security validation.

### 18.3 Production

Production MUST enforce the approved security baseline before customer workloads are activated.

Production MUST have centralized or equivalently protected audit logging, cloud security monitoring, controlled IAM, encryption, restricted network access, and an actionable incident response path.

Security-critical configuration changes MUST be reviewed and attributable.

### 18.4 Ephemeral Environments

Ephemeral environments MUST use short-lived access and isolated resource names and boundaries.

They MUST NOT receive production secrets or unrestricted production network access.

They MUST have a defined cleanup process.

Security monitoring SHOULD cover ephemeral environments while they exist.

## 19. Security Verification and Acceptance

### 19.1 Initial Verification

Before an environment is accepted, the owner MUST verify:

- Identity federation and role boundaries.
- Workload identity and permission scope.
- Network ingress and egress.
- Encryption and key policies.
- Secret access restrictions.
- Audit logging coverage.
- Security monitoring enrollment.
- Vulnerability scanning.
- Patch-management ownership.
- Security alert routing.
- Exception tracking.

### 19.2 Production Verification

Production acceptance MUST additionally verify that:

- Production and non-production are isolated.
- Privileged access is restricted and auditable.
- Required audit records are protected.
- Critical security findings have been addressed or explicitly accepted.
- Security alerts reach the responsible team.
- Infrastructure changes are reviewed and traceable.
- Recovery and incident procedures are available to authorized responders.
- Security policy enforcement is active.

### 19.3 Continuous Verification

Security verification MUST continue after initial acceptance.

Changes to accounts, roles, network paths, keys, secrets, logging, and public ingress SHOULD trigger targeted security checks.

Monitoring coverage MUST be revalidated when accounts, regions, or significant resource classes are added.

### 19.4 Evidence

Security acceptance evidence SHOULD include:

- Infrastructure revision.
- Policy validation results.
- IAM and trust-policy review.
- Network exposure review.
- Encryption and secret-access checks.
- Audit logging verification.
- Threat detection and security finding status.
- Vulnerability and patch status.
- Approved exceptions.
- Responsible owner and review date.

## 20. Phase and Milestone Traceability

Canonical phase definitions are owned by `docs/planning/PHASES.md`. Cloud milestone scope and acceptance are owned by the authoritative dossiers under `docs/cloud/milestones/`.

The following table maps cloud security implementation emphasis to the frozen cloud milestones. It does not redefine milestone scope.

| Phase | Cloud milestone | Infrastructure security emphasis |
|---|---|---|
| P0 FOUNDATION | C-M01 FOUNDATION | Organization guardrails, identity foundation, audit logging, secure IaC baseline, and initial security policies |
| P1 STUDIO | C-M02 DEVELOPMENT | Development account controls, workload identity, secret handling, network restrictions, and baseline security monitoring |
| P2 BUILD & ARTIFACT | C-M02 DEVELOPMENT | Container image scanning, registry permissions, artifact storage protection, and deployment pipeline security |
| P3 CONTROL PLANE | C-M02 DEVELOPMENT | Cloud IAM boundaries, protected service connectivity, infrastructure audit coverage, and security finding workflows |
| P4 BOOKING & COMMERCIAL | C-M03 STAGING | Staging security validation, edge protection, secrets isolation, and policy enforcement |
| P5 EXECUTION | C-M03 STAGING | Worker identity, network restrictions, workload vulnerability controls, and security monitoring |
| P6 LAB & ROBOT | C-M03 STAGING | Approved integration connectivity and infrastructure security verification for applicable lab and robot paths |
| P7 LIVE & RESULTS | C-M03 STAGING | Production-like monitoring, audit coverage, edge controls, and security acceptance rehearsal |
| P8 PRODUCTION | C-M04 PRODUCTION | Production security baseline, privileged access controls, incident readiness, continuous monitoring, and remediation governance |

The applicable milestone dossier MUST determine the actual scope and acceptance conditions for each milestone.

This table MUST NOT be used to expand milestone scope or imply that all listed security work is completed by a particular phase regardless of the authoritative dossier.

## 21. Security Architecture Change Control

### 21.1 Changes Requiring Review

Security architecture review MUST be required for:

- Changes to account isolation or organization guardrails.
- New public endpoints or major WAF changes.
- New cross-account trust relationships.
- Material changes to workload identity or IAM permissions.
- Changes to encryption key ownership or key policies.
- Changes to secret storage or secret access boundaries.
- Changes to audit logging or security monitoring coverage.
- Introduction of new infrastructure or container execution models.
- Changes to vulnerability or patch-management enforcement.
- Exceptions to mandatory production security controls.

### 21.2 Application Security Changes

If a proposed change alters application trust boundaries, authentication, authorization, session behavior, or application-level permissions, it MUST be reviewed against `docs/architecture/SECURITY_ARCHITECTURE.md` and the applicable documents under `docs/security/`.

This document MUST record only the infrastructure controls required to support the approved application security design.

### 21.3 Cloud Topology Changes

If a proposed change alters logical service placement, network topology, or cloud deployment boundaries, it MUST be reviewed against `docs/architecture/CLOUD_ARCHITECTURE.md`.

The cloud implementation architecture MUST be updated where concrete resource deployment or configuration changes.

This document MUST capture the corresponding infrastructure security controls without duplicating topology rationale.

### 21.4 Exception Governance

Every security exception MUST include:

- A precise scope.
- A documented reason.
- Risk assessment.
- Compensating controls.
- Named owner.
- Required approval.
- Review or expiry date.
- Remediation plan where applicable.

Expired exceptions MUST be resolved, renewed through approval, or removed.

## 22. Implementation Checklist

### 22.1 Identity and Access

- [ ] Human cloud access uses approved federation or equivalent controls.
- [ ] Administrative and workload identities are separated.
- [ ] Runtime roles follow least privilege.
- [ ] CI/CD uses restricted deployment identities.
- [ ] Cross-account trust is explicit and reviewed.
- [ ] Root access is protected and monitored.
- [ ] Privileged access is reviewed periodically.
- [ ] Unused roles and trust relationships are removed.

### 22.2 Network and Edge

- [ ] Production and non-production network boundaries are isolated.
- [ ] Public ingress is limited to approved endpoints.
- [ ] Security groups follow default-deny inbound rules.
- [ ] Egress is restricted where practical.
- [ ] Cross-environment connectivity is explicit.
- [ ] Public HTTP(S) endpoints use approved TLS configuration.
- [ ] WAF is enabled where required.
- [ ] Edge logs are protected and retained appropriately.

### 22.3 Keys and Secrets

- [ ] Encryption at rest is enabled for required resources.
- [ ] Encryption in transit is enforced where supported.
- [ ] KMS policies restrict key administration and usage.
- [ ] Production and non-production key boundaries are appropriate.
- [ ] Secret values are not embedded in source, images, or logs.
- [ ] Runtime secret retrieval uses workload identity.
- [ ] Secret rotation procedures are documented.
- [ ] Key deletion and recovery risks are controlled.

### 22.4 Audit and Monitoring

- [ ] Production cloud audit logging is enabled.
- [ ] Audit records are protected from workload modification.
- [ ] Required security monitoring services are enabled.
- [ ] High-impact findings have actionable alert routes.
- [ ] Security configuration drift is monitored.
- [ ] Vulnerability findings have owners and response targets.
- [ ] Patch ownership and remediation procedures are defined.
- [ ] Incident evidence preservation and recovery procedures are documented.

### 22.5 Governance

- [ ] Application security links to `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable `docs/security/` documents.
- [ ] Cloud topology links to `docs/architecture/CLOUD_ARCHITECTURE.md`.
- [ ] Cloud resource implementation follows `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.
- [ ] Database-specific controls link to `docs/database/architecture/DATABASE_ARCHITECTURE.md`.
- [ ] Phase definitions link to `docs/planning/PHASES.md`.
- [ ] Cloud milestone acceptance follows the authoritative milestone dossiers.
- [ ] Security exceptions are approved, owned, and time-bounded.
- [ ] No duplicate application authentication or authorization design has been introduced.

## 23. Definition of Done

The cloud security architecture is ready for implementation when:

1. Cloud IAM and workload identity boundaries are explicit.
2. Network ingress, egress, and cross-environment controls are defined.
3. Key management and secret storage requirements are testable.
4. Infrastructure audit logging is enabled and protected.
5. Edge protection requirements are defined for approved public endpoints.
6. Vulnerability and patch-management responsibilities are clear.
7. Cloud security monitoring and alert routing are operational.
8. Security exceptions and remediation are governed.
9. Environment acceptance includes verifiable security evidence.
10. Ownership boundaries with application security, cloud architecture, database implementation, protocol contracts, and milestone dossiers are explicit.
11. Phase and milestone references use the frozen canonical model.
12. The infrastructure controls can be validated continuously without redefining application authentication or authorization.

This document owns cloud and infrastructure security. The application security model, trust boundaries, and authentication/authorization design remain owned by `docs/architecture/SECURITY_ARCHITECTURE.md` and the applicable documents under `docs/security/`. All implementation decisions MUST preserve this ownership boundary.
