# C-M04 PRODUCTION — Milestone Dossier

**Primary Phase:** P8 PRODUCTION

**Supporting Phases:** P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE; P4 BOOKING & COMMERCIAL; P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS

**Domain:** Cloud Infrastructure

**Milestone:** C-M04 PRODUCTION (P8)

**Document Type:** Cloud milestone dossier

**Status:** Planning baseline

**Scope Authority:** This dossier defines production cloud infrastructure, high availability, disaster recovery, production security controls, operational readiness, and go-live infrastructure. Existing milestone dossiers under `docs/**/milestones/` are authoritative for their respective milestone scopes.

---

## Ownership and Boundaries

### What this document owns

This document owns the milestone-level objectives, scope boundaries, dependencies, deliverables, risks, and exit criteria for C-M04 PRODUCTION (P8).

C-M04 PRODUCTION establishes and validates the production environment in which the Kritva RaaS system is operated for real users and workloads. It owns the production infrastructure lifecycle, production deployment boundary, infrastructure availability, disaster recovery, operational readiness, and infrastructure aspects of go-live.

Its scope includes:

- Production environment topology and resource boundaries.
- Production account, project, subscription, and network configuration.
- Production infrastructure as code.
- High availability architecture and deployment configuration.
- Availability-zone or equivalent failure-domain separation where supported.
- Production compute, container, and orchestration configuration.
- Production ingress, egress, DNS, routing, and service discovery.
- Production TLS, certificate lifecycle, and infrastructure trust configuration.
- Production identity, workload identity, and infrastructure access controls.
- Production secret-management integration.
- Production database infrastructure, availability, backup integration, and recovery coordination.
- Production object storage, durability configuration, and lifecycle integration.
- Production queues, caches, and supporting dependency infrastructure.
- Production workload deployment and release integration.
- Immutable artifact and deployment revision traceability.
- Production observability infrastructure.
- Infrastructure alerts, dashboards, and operational diagnostics.
- Capacity planning and production resource limits.
- Availability objectives and infrastructure-level service indicators.
- Backup and restore orchestration for cloud-owned resources.
- Disaster recovery architecture and recovery exercises.
- Recovery Time Objective (RTO) and Recovery Point Objective (RPO) evidence.
- Production rollback and recovery coordination.
- Production access, change control, and operational safeguards.
- Incident response infrastructure and escalation integration.
- Production environment hardening and configuration validation.
- Go-live infrastructure readiness and cutover execution.
- Post-deployment infrastructure verification.
- Production handoff, operational runbooks, and ownership records.
- Production readiness evidence and known-risk disposition.
- Infrastructure retirement and rollback safeguards for go-live.
- Production-specific parity closure based on evidence from C-M03 STAGING (P4-P7).

### What this document does not own

The following responsibilities belong to their authoritative documents and milestones:

- Canonical phase definitions: `docs/planning/PHASES.md`.
- System-level architecture and cross-domain decisions: `docs/planning/DECISIONS.md` and `docs/architecture/`.
- System cloud topology: `docs/architecture/CLOUD_ARCHITECTURE.md`.
- Cloud implementation architecture: `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.
- Cloud infrastructure security architecture: `docs/cloud/architecture/SECURITY_ARCHITECTURE.md`.
- Application trust boundaries, authentication, authorization, and security policy: `docs/architecture/SECURITY_ARCHITECTURE.md` and `docs/security/`.
- Shared cloud account, network, identity, and infrastructure conventions: C-M01 FOUNDATION (P0).
- Development infrastructure and developer environment configuration: C-M02 DEVELOPMENT (P1-P3).
- Staging infrastructure and production-parity assessment: C-M03 STAGING (P4-P7).
- Frontend screens, workflows, client behavior, and application-level acceptance: applicable frontend milestones.
- Backend API behavior, business rules, job lifecycle, and service-level correctness: applicable backend milestones.
- PostgreSQL schema, migrations, transactions, RLS, indexes, and data integrity: applicable database milestones.
- Artifact creation and build semantics: F-M03 BUILD & ARTIFACT (P2), B-M02 ARTIFACT (P2-P3), and their authoritative dependencies.
- Platform and resource service behavior: B-M03 PLATFORM (P3).
- Booking and commercial behavior: F-M04 BOOKING (P4), B-M04 BOOKING (P4), and DB-M03 BOOKING DATA (P4).
- Execution workflow and job orchestration behavior: F-M05 EXECUTION (P5), B-M05 EXECUTION (P5), and DB-M04 EXECUTION DATA (P5-P7).
- Lab Agent behavior and physical robot integration: P6 LAB & ROBOT and applicable service owners.
- Live presentation and results presentation: F-M06 LIVE (P7) and F-M07 RESULTS (P7).
- Results service behavior and execution-result persistence: B-M06 RESULTS (P6-P7) and DB-M04 EXECUTION DATA (P5-P7).
- Production application service behavior: B-M07 PRODUCTION (P8).
- Global CI, code review, branching, testing, and release policy: `docs/development/`.
- Global test strategy: `docs/development/TESTING_STRATEGY.md`.
- Global release policy: `docs/development/RELEASE_PROCESS.md`.
- Business-level service objectives and contractual commitments: product and business owners.
- Application-level correctness, data semantics, and domain-specific test acceptance: the relevant application and database owners.
- Robot functional safety, hardware certification, and physical deployment authorization: relevant safety and hardware owners.
- Detailed production tasks, acceptance matrices, review execution, change history, and commit procedure: the sibling files for this milestone.

C-M04 PRODUCTION supplies and operates the production infrastructure required by these capabilities. It does not absorb application, product, database-schema, hardware-safety, or global engineering-policy ownership.

### Ownership map

| Concern | Authoritative owner | C-M04 PRODUCTION responsibility |
|---|---|---|
| Canonical phase definitions | `docs/planning/PHASES.md` | Follow the frozen model exactly |
| System architecture | `docs/architecture/` | Implement approved production infrastructure boundaries |
| System cloud topology | `docs/architecture/CLOUD_ARCHITECTURE.md` | Apply the approved topology |
| Cloud implementation architecture | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` | Follow cloud implementation conventions |
| Cloud security architecture | `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` | Apply production infrastructure controls |
| Cloud foundation | C-M01 FOUNDATION (P0) | Reuse shared account, network, identity, and infrastructure conventions |
| Development environment | C-M02 DEVELOPMENT (P1-P3) | Reuse appropriate provisioning and deployment patterns |
| Staging environment | C-M03 STAGING (P4-P7) | Receive validated configuration and parity evidence |
| Production environment | C-M04 PRODUCTION (P8) | Own production resources, availability, recovery, and go-live infrastructure |
| Frontend application behavior | Applicable frontend milestones | Provide hosting, delivery, and runtime infrastructure |
| Backend application behavior | Applicable backend milestones | Provide runtime, routing, and infrastructure integration |
| Database schema and integrity | Applicable database milestones | Provide production database infrastructure and recovery coordination |
| Artifact creation | F-M03 BUILD & ARTIFACT (P2), B-M02 ARTIFACT (P2-P3) | Deploy approved, traceable artifacts |
| Platform service behavior | B-M03 PLATFORM (P3) | Provide production runtime and connectivity |
| Booking behavior | B-M04 BOOKING (P4) and F-M04 BOOKING (P4) | Provide production infrastructure for approved services |
| Execution behavior | B-M05 EXECUTION (P5) and F-M05 EXECUTION (P5) | Provide production runtime and connectivity |
| Lab and robot integration | P6 LAB & ROBOT and applicable service owners | Provide approved connectivity and operational boundaries |
| Live presentation | F-M06 LIVE (P7) | Provide production endpoints and infrastructure availability |
| Results service behavior | B-M06 RESULTS (P6-P7) | Provide runtime, storage, and connectivity |
| Results presentation | F-M07 RESULTS (P7) | Provide production frontend delivery |
| Production application services | B-M07 PRODUCTION (P8) | Coordinate infrastructure deployment; do not redefine service behavior |
| Database migrations | Applicable database milestones | Provide controlled production migration execution infrastructure |
| Backup and restore infrastructure | C-M04 PRODUCTION with database owners | Own cloud orchestration and coordinate data-level validation |
| Disaster recovery | C-M04 PRODUCTION with database and service owners | Own infrastructure recovery design and exercises |
| Application authentication and authorization | Security and application owners | Supply secure infrastructure identity and connectivity |
| Global release policy | `docs/development/RELEASE_PROCESS.md` | Integrate production deployment targets and gates |
| Global test policy | `docs/development/TESTING_STRATEGY.md` | Supply production verification infrastructure |
| Go-live business authorization | Product and business owners | Supply infrastructure readiness evidence |
| Physical robot safety | Relevant safety and hardware owners | Enforce approved infrastructure access boundaries |
| Production tasks | `TASKS.md` | Link to detailed work decomposition |
| Production acceptance evidence | `ACCEPTANCE_CRITERIA.md` | Link to detailed pass/fail requirements |
| Production review | `REVIEW_CHECKLIST.md` | Link to review actions |
| Production change history | `CHANGELOG.md` | Link to accepted changes |
| Production Git procedure | `GIT_COMMIT_STEP.md` | Link to repository and commit procedure |

### Sibling document ownership

The following files are maintained alongside this dossier:

- [`TASKS.md`](TASKS.md) — task decomposition, sequencing, dependencies, and task ownership.
- [`ACCEPTANCE_CRITERIA.md`](ACCEPTANCE_CRITERIA.md) — detailed pass/fail conditions and evidence requirements.
- [`REVIEW_CHECKLIST.md`](REVIEW_CHECKLIST.md) — review actions and evidence inspection.
- [`CHANGELOG.md`](CHANGELOG.md) — accepted changes and milestone history.
- [`GIT_COMMIT_STEP.md`](GIT_COMMIT_STEP.md) — repository and commit procedure.

This dossier defines the milestone contract. It does not duplicate task-level instructions, detailed acceptance matrices, review execution records, change history, or commit procedures.

---

## 1. Objective

C-M04 PRODUCTION establishes a secure, resilient, recoverable, observable, and operationally controlled production environment for the Kritva RaaS system.

The environment must support controlled go-live, deployment of approved application revisions, reliable access to required dependencies, operational monitoring, failure recovery, and the agreed production service objectives.

Production infrastructure must be reproducible from reviewed definitions, separated from development and staging environments, and governed by explicit access and change controls.

High availability and disaster recovery must be designed and validated according to documented service requirements rather than assumed from cloud-provider defaults.

### 1.1 Primary outcomes

C-M04 PRODUCTION must deliver:

1. A dedicated production resource and security boundary.
2. Version-controlled production infrastructure definitions.
3. Production networking, ingress, egress, DNS, and service discovery.
4. High-availability deployment configuration appropriate to the service objectives.
5. Controlled production identity, permissions, and secret delivery.
6. Production runtime and service deployment targets.
7. Traceable deployment of approved application artifacts.
8. Production database infrastructure and migration integration.
9. Backup, restore, and disaster recovery procedures.
10. Documented and tested recovery objectives.
11. Production observability, dashboards, alerts, and diagnostics.
12. Capacity limits and scaling configuration.
13. Production access and change-control procedures.
14. Incident response and escalation integration.
15. Go-live readiness checks and controlled cutover.
16. Post-deployment verification and rollback decision criteria.
17. Operational runbooks and ownership assignments.
18. An explicit list of accepted residual risks and limitations.
19. A handoff package identifying how the environment is operated and recovered.

### 1.2 Production reliability outcome

Production reliability must be based on the agreed workload and service objectives.

The infrastructure must identify the components whose failure would interrupt user access, execution, data persistence, artifact access, telemetry, or results delivery.

For each critical component, the design must state its failure assumptions, mitigation, monitoring, and recovery path.

Availability must not be claimed solely because multiple replicas or managed services are configured. The deployment must be tested against the relevant failure scenarios.

### 1.3 High-availability outcome

High availability (HA) means that the production design reduces the impact of defined component and infrastructure failures and provides a verified path to continue or restore service.

Depending on the selected cloud architecture, this may include:

- Multiple workload replicas.
- Availability-zone or equivalent failure-domain distribution.
- Redundant ingress or routing.
- Health-based traffic routing.
- Managed-service redundancy.
- Database high availability.
- Redundant network paths where supported.
- Queue or storage durability controls.
- Defined failover behavior.
- Capacity sufficient to tolerate the specified failure.

HA does not automatically provide protection against regional failure, data corruption, destructive operator actions, or application-level defects. Those scenarios require separate controls and recovery evidence.

### 1.4 Disaster-recovery outcome

Disaster recovery (DR) means restoring the production service and its required data after a disruptive event that exceeds normal HA mechanisms.

The DR design must define:

- Recovery scope and dependencies.
- Recovery Time Objective (RTO).
- Recovery Point Objective (RPO).
- Backup and replication strategy.
- Recovery environment and access requirements.
- Restoration sequence.
- Data consistency checks.
- Application and infrastructure verification.
- Recovery communication and ownership.
- Evidence from recovery exercises.

RTO and RPO values must be agreed with the relevant business, service, and data owners. They must not be invented solely to complete the cloud milestone.

### 1.5 Go-live outcome

Go-live means that the production environment and the approved application revision are activated for the intended users and workloads under an authorized release decision.

The infrastructure milestone owns technical readiness, production deployment execution, infrastructure verification, and the infrastructure rollback path.

Go-live authorization remains a joint decision governed by the applicable business, security, service, data, and operational approval process.

A successful deployment command is not sufficient evidence of production readiness.

### 1.6 Operational outcome

The production environment must have clear ownership for routine operations, alert response, infrastructure changes, incident escalation, recovery, and access review.

Runbooks must be actionable by the designated operators.

Monitoring must distinguish infrastructure availability from application-level correctness and business outcomes.

### 1.7 Completion principle

C-M04 PRODUCTION is complete when production infrastructure is reproducible, secure, appropriately resilient, recoverable within approved objectives, observable, and ready for authorized go-live.

Completion requires verified deployment and rollback procedures, successful relevant HA and DR exercises, production access controls, operational ownership, and evidence that the intended production workload can be served.

Any unvalidated failure mode or material limitation must be documented and dispositioned by the relevant owner before go-live approval.

Detailed pass/fail requirements belong in `ACCEPTANCE_CRITERIA.md`.

---

## 2. Scope and non-scope

### 2.1 In-scope capabilities

#### 2.1.1 Production environment boundary

C-M04 must establish a clearly identifiable production boundary.

The boundary may use a dedicated cloud account, project, subscription, network, cluster, or a documented combination appropriate to the approved architecture.

The design must prevent accidental changes from development and staging identities and must make production targets explicit in deployment and operational workflows.

The environment specification must identify:

- Production account or project.
- Network and compute boundaries.
- Resource naming and tagging.
- Workload and administrative identities.
- Secret namespaces and access roles.
- Data-store boundaries.
- Public and private endpoints.
- Deployment targets.
- Recovery and backup resources.
- External integration boundaries.
- Resource ownership.
- Environment-specific operational controls.

#### 2.1.2 Production infrastructure as code

Persistent production infrastructure must be represented in version-controlled infrastructure definitions.

The implementation must reuse approved cloud foundation conventions and avoid creating an independent infrastructure model.

The definitions must include, as applicable:

- Network and routing resources.
- Compute or orchestration resources.
- Load balancing and ingress.
- Service discovery.
- Database infrastructure.
- Object storage.
- Queue and cache infrastructure.
- Identity and access bindings.
- Secret references.
- TLS configuration.
- Monitoring and alerting.
- Backup and recovery resources.
- Resource limits and scaling settings.
- Production-specific configuration.

Sensitive values must be supplied through controlled mechanisms and must not be committed as plaintext.

#### 2.1.3 Reproducible provisioning and change review

The production environment must support controlled provisioning and reconciliation.

Infrastructure changes must be reviewable, attributable, and associated with a known configuration revision.

The workflow must identify:

- Change request or approved trigger.
- Required permissions.
- Configuration revision.
- Planned changes.
- Validation results.
- Execution record.
- Post-change checks.
- Failure handling.
- Rollback or recovery path where supported.

Emergency changes must be recorded and reconciled into the declared configuration.

Production changes must not rely on undocumented console operations as the sole source of truth.

#### 2.1.4 Production network architecture

Production networking must implement the approved system topology and security boundaries.

The design must identify:

- Public ingress.
- Private service networks.
- Egress routes.
- Database and storage paths.
- Administrative access paths.
- Service-to-service communication.
- DNS and certificate dependencies.
- External service integrations.
- Monitoring and management paths.
- Recovery-site or secondary-region connectivity where required.

Network rules must restrict access to approved paths and expose only the endpoints required for production operation.

#### 2.1.5 Ingress, load balancing, and routing

Production ingress must support the approved external access model and route traffic to healthy service instances.

The configuration must identify:

- Production hostnames.
- TLS termination.
- Routing rules.
- Health-based traffic selection.
- Request limits and timeouts where applicable.
- Rate or connection limits where required by the approved architecture.
- Administrative endpoint restrictions.
- Health-check behavior.
- Failover behavior.
- Diagnostic information for routing failures.

The application owners remain responsible for API behavior and application-level access policy.

#### 2.1.6 DNS and endpoint lifecycle

Production DNS and service endpoints must have documented ownership and change procedures.

The implementation must account for endpoint stability, certificate compatibility, failover behavior, and the effect of endpoint changes on dependent services.

Where a recovery environment uses alternate endpoints, the cutover and return-to-primary procedures must be documented and tested as appropriate.

#### 2.1.7 TLS and certificate lifecycle

Production endpoints must use approved TLS configuration.

The environment must define:

- Certificate provisioning.
- Certificate ownership.
- Renewal and expiry monitoring.
- Trust-chain validation.
- Private-key access controls.
- Internal transport security where required.
- Certificate rotation procedure.
- Failure and recovery handling.

Certificate expiration must be observable before it interrupts critical service paths.

Private keys must not be committed to source control or exposed through deployment logs.

#### 2.1.8 Production identity and access management

Production access must follow least privilege and separation of duties appropriate to the approved security architecture.

The model must distinguish:

- Deployment identities.
- Runtime workload identities.
- Infrastructure administrators.
- Database administration identities.
- Observability readers.
- Incident responders.
- Recovery operators.
- Audit or compliance reviewers.

Access must be attributable, revocable, and periodically reviewable according to the applicable security policy.

Production credentials must not be reused by staging or development workloads by default.

#### 2.1.9 Production secrets

Production secrets must use the approved secret-management mechanism.

The implementation must support controlled retrieval, access restriction, rotation where required, revocation, and auditability.

Secrets must not be stored in source control, container images, ordinary configuration files, or deployment output.

The production workflow must define how a compromised credential is revoked and replaced without relying on undocumented manual steps.

Application owners remain responsible for defining which credentials are required by their services.

#### 2.1.10 Workload identity and runtime permissions

Each production workload must receive only the permissions required for its function.

The infrastructure must avoid broad shared credentials where narrower identities are supported.

Permissions must be reviewed for:

- Database access.
- Object storage access.
- Queue and cache access.
- Secret retrieval.
- Service-to-service communication.
- Telemetry and logging emission.
- Deployment and orchestration actions.
- Backup and restore operations.

Runtime workloads must not inherit unrestricted infrastructure administration privileges.

#### 2.1.11 Compute and orchestration

Production compute must be configured for the approved service requirements.

The environment may use managed containers, virtual machines, orchestration platforms, or another approved runtime.

The configuration must define:

- Runtime and image versions.
- Replica and placement strategy.
- CPU and memory requests or limits.
- Health and readiness probes.
- Restart behavior.
- Scaling rules.
- Service discovery.
- Network and identity bindings.
- Log and metric destinations.
- Upgrade and maintenance approach.
- Capacity behavior during failure.

The selected topology must be justified against the intended workload and availability objectives.

#### 2.1.12 High availability architecture

Production must identify the components requiring high availability and the failure scenarios each mechanism addresses.

The design should consider:

- Workload instance failure.
- Node or host failure.
- Availability-zone failure where supported.
- Ingress or load-balancer failure.
- Database primary failure.
- Network path failure.
- Queue or cache failure.
- Storage service disruption.
- Loss of a critical external dependency.
- Capacity loss during failover.

For each applicable scenario, the design must identify detection, failover behavior, expected interruption, data implications, and recovery verification.

Redundancy must be tested rather than inferred from configuration alone.

#### 2.1.13 Capacity and scaling

Production capacity must be based on expected workload, concurrency, data volume, and service objectives.

The plan must identify:

- Expected normal load.
- Expected peak load.
- Critical service concurrency.
- Compute and memory assumptions.
- Database connection and storage requirements.
- Object storage and data-retention assumptions.
- Network throughput needs.
- Queue or cache capacity.
- Scaling triggers and limits.
- Quota constraints.
- Capacity behavior during failover.
- Monitoring and alert thresholds.

Any capacity claim must identify its evidence and assumptions.

Detailed application performance characteristics remain with the service owners.

#### 2.1.14 Production deployment pipeline

Production deployment must use the approved CI/CD and release process.

The pipeline must support controlled deployment of approved revisions, environment-specific configuration, and attributable deployment records.

The process must identify:

- Permitted deployment identities.
- Approval and authorization gates.
- Artifact provenance.
- Infrastructure and application revisions.
- Configuration revision.
- Deployment ordering.
- Readiness verification.
- Post-deployment smoke checks.
- Failure handling.
- Rollback decision criteria.
- Audit and evidence retention.

The cloud milestone implements production-specific deployment integration. It does not redefine the global release policy.

#### 2.1.15 Artifact integrity and traceability

Production deployments must use approved, identifiable artifacts.

Where container images are used, the deployment record should capture immutable image digests. Other deployment formats must provide equivalent traceability.

The workflow must identify the source revision, artifact identity, deployment time, and configuration revision.

Where signing or provenance verification is required by the security architecture, the production deployment path must enforce the approved checks.

Artifact creation and build correctness remain with the relevant build and backend owners.

#### 2.1.16 Deployment strategy

The production deployment strategy must be selected according to the application topology, failure impact, and operational capability.

Supported strategies may include rolling deployment, blue-green deployment, canary rollout, or another approved method.

The chosen strategy must define:

- Traffic transition behavior.
- Health-based progression.
- Failure thresholds.
- Abort criteria.
- Version coexistence assumptions.
- Database compatibility requirements.
- Rollback or forward-recovery procedure.
- Evidence recorded during rollout.

The implementation must not assume that application rollback is always safe after a database migration or irreversible external side effect.

#### 2.1.17 Production database infrastructure

Production database infrastructure must meet the approved availability, durability, security, and capacity requirements.

The implementation must coordinate with database owners on:

- Managed-service or self-managed deployment model.
- High-availability configuration.
- Storage and connection capacity.
- Encryption and access control.
- Backup and restore integration.
- Replication and failover.
- Monitoring and alerting.
- Maintenance windows.
- Migration execution.
- Recovery validation.

Schema definitions, RLS, constraints, indexes, transaction semantics, and migration content remain with the database domain.

#### 2.1.18 Database failover and consistency

Database failover behavior must be documented and tested to the extent supported by the selected architecture.

The plan must identify:

- Failure detection.
- Promotion or failover mechanism.
- Connection recovery behavior.
- Replication lag assumptions.
- Data consistency checks.
- Application reconnection requirements.
- Recovery of failed or stale replicas.
- Operator actions required.
- Evidence of successful recovery.

A successful database failover must not be treated as proof that all application workflows recovered correctly.

#### 2.1.19 Backup policy and execution

The production environment must provide the approved infrastructure mechanisms to execute and monitor backups.

The backup plan must identify:

- Protected resources and data classes.
- Backup frequency.
- Retention periods.
- Encryption and access controls.
- Backup destination and isolation.
- Cross-zone or cross-region copy where required.
- Failure alerting.
- Restoration dependencies.
- Retention deletion controls.
- Evidence and audit records.

Frequency and retention must be agreed with the relevant service, database, and business owners.

The cloud milestone owns infrastructure orchestration and protection of cloud resources. Application-consistent backup semantics and database-specific procedures remain with their authoritative owners.

#### 2.1.20 Restore and recovery verification

A backup is not accepted as recoverable until a restore procedure has been exercised and the restored environment has been verified.

The recovery process must identify:

- Recovery trigger and authorization.
- Required credentials and access.
- Infrastructure provisioning order.
- Database and storage restoration order.
- Configuration restoration.
- Application deployment order.
- Data consistency checks.
- Service readiness checks.
- Traffic restoration.
- Recovery evidence and completion declaration.

The exercise must record elapsed recovery time and the recoverable data point.

#### 2.1.21 Disaster recovery architecture

The DR architecture must address failures beyond the scope of ordinary HA.

The required approach may use a secondary region, alternate environment, recoverable infrastructure definitions, replicated data, backups, or a documented combination.

The design must state:

- Covered disaster scenarios.
- Recovery scope.
- Recovery environment.
- Required dependencies.
- RTO and RPO.
- Data replication and backup assumptions.
- Recovery authority and access.
- Restoration sequence.
- DNS or endpoint cutover.
- Verification and return-to-primary procedure.
- Known limitations.

The selected strategy must be consistent with approved business and service requirements.

#### 2.1.22 RTO and RPO

Recovery Time Objective and Recovery Point Objective must be explicit for the production service and its critical data dependencies.

The cloud milestone must coordinate these values with service, database, security, and business owners.

RTO must describe the maximum intended restoration interval for the agreed scope.

RPO must describe the maximum acceptable data-loss interval for the agreed scope.

Where different services or data classes have different objectives, those differences must be documented rather than collapsed into a misleading system-wide value.

Measured recovery results must be compared with the approved objectives.

#### 2.1.23 Disaster-recovery exercises

The production environment must support planned recovery exercises.

Exercises should validate relevant combinations of:

- Infrastructure recreation.
- Data restoration.
- Database failover or restore.
- Object storage recovery.
- Secret and identity availability.
- Service deployment.
- Endpoint cutover.
- Application readiness.
- Data consistency.
- Operator access.
- Recovery communications.

Exercises must have an approved scope, controlled execution, recorded results, and follow-up ownership.

A tabletop review alone does not prove that a technical restore path works.

#### 2.1.24 Object storage durability and recovery

Production object storage must be configured according to the approved durability, access, retention, and recovery requirements.

The implementation must define:

- Storage namespace and ownership.
- Encryption.
- Access control.
- Versioning or equivalent protection where required.
- Lifecycle and retention policy.
- Replication or backup requirements.
- Recovery behavior.
- Deletion safeguards.
- Monitoring and alerting.

Artifact, telemetry, log, and result data semantics remain with the relevant service and database owners.

#### 2.1.25 Queue, cache, and supporting services

Production queues, caches, and other supporting infrastructure must be configured according to their failure impact and data-retention requirements.

For each dependency, the design must identify:

- Availability and durability expectations.
- Replication or failover configuration.
- Capacity limits.
- Monitoring.
- Backup or reconstruction strategy.
- Data-loss implications.
- Application recovery behavior.
- Operational ownership.

A cache may be reconstructable while a durable queue may require stronger protection. The recovery approach must reflect the actual semantics of the dependency.

#### 2.1.26 Production observability

Production must provide the infrastructure observability required for safe operation and incident response.

The baseline must cover:

- Workload health and restart behavior.
- CPU, memory, storage, and network utilization.
- Ingress and routing health.
- Database availability and connectivity.
- Storage and supporting dependency health.
- Deployment outcomes.
- Backup and restore outcomes.
- Certificate and DNS health.
- Replication and failover indicators where available.
- Capacity and quota pressure.
- Infrastructure configuration changes.
- Relevant platform and security events.

Application instrumentation and business-level metrics remain with the service owners.

#### 2.1.27 Alerts and escalation

Production alerts must identify actionable infrastructure conditions and route them to an assigned operational owner.

The design must define:

- Alert condition.
- Severity.
- Notification destination.
- Response expectation.
- Escalation path.
- Suppression or deduplication behavior where supported.
- Diagnostic context.
- Closure evidence.

Alert thresholds must be reviewed against the approved service objectives.

Alerts that cannot be acted upon or have no owner must not be treated as operationally complete.

#### 2.1.28 Service-level indicators and objectives

C-M04 must provide the infrastructure telemetry needed to evaluate agreed service-level indicators.

Potential indicators include endpoint availability, infrastructure-related error rates, request latency, dependency availability, and recovery performance.

Service-level objectives and contractual service commitments are owned by the product, business, and service owners.

The cloud milestone must not invent a service-level commitment or claim an application objective has been met based only on infrastructure health.

#### 2.1.29 Production logging and audit access

The production environment must provide controlled access to infrastructure logs and audit records.

The design must identify:

- Log and audit destinations.
- Access roles.
- Retention assumptions.
- Search or retrieval mechanism.
- Sensitive-data restrictions.
- Required infrastructure change records.
- Incident investigation access.
- Evidence preservation expectations.

Application log generation and application-level event semantics remain with the relevant service owners.

#### 2.1.30 Production security hardening

Production infrastructure must be reviewed against the approved cloud security architecture.

The review should include:

- Public exposure.
- Network segmentation.
- Workload identity.
- Administrative access.
- Secret management.
- TLS and certificate lifecycle.
- Storage access.
- Database connectivity.
- Runtime privileges.
- Artifact provenance controls.
- Infrastructure change permissions.
- Audit and monitoring coverage.
- Backup access and isolation.
- Recovery environment security.

Application authorization, business-level permissions, and domain security behavior remain with their authoritative owners.

#### 2.1.31 Vulnerability and patch management

Production infrastructure must have a documented approach to supported runtime and infrastructure patching.

The approach must identify:

- Responsible owner.
- Supported runtime versions.
- Patch assessment process.
- Deployment and maintenance windows.
- Validation requirements.
- Rollback or recovery options.
- Emergency patch handling.
- Evidence of applied updates.

Patching must not introduce unreviewed production configuration drift.

Application dependency vulnerability management remains with the applicable software owners and global security process.

#### 2.1.32 Production change control

Production infrastructure changes must be attributable, reviewed, and executed through the approved process.

The workflow must distinguish ordinary changes, emergency changes, and recovery operations.

It must define authorization, evidence, verification, and reconciliation requirements.

Changes affecting availability, network access, data protection, or recovery behavior must include an impact assessment.

Global code review, branching, and release policy remains in `docs/development/`.

#### 2.1.33 Incident response integration

The production environment must support the approved incident response process.

Infrastructure responsibilities include:

- Alert routing.
- Diagnostic access.
- Relevant audit records.
- Operational runbooks.
- Escalation contacts or roles.
- Infrastructure recovery actions.
- Evidence preservation.
- Post-incident configuration reconciliation.

Incident severity definitions and business communications remain with the applicable operational and business owners.

#### 2.1.34 Capacity and quota monitoring

Production must monitor relevant resource and service quotas before they threaten availability.

The monitoring baseline should cover compute, database connections, storage capacity, network limits, queue depth, and external service quotas where applicable.

Capacity planning must include failover headroom and recovery activity where these can increase resource demand.

The environment must define what happens when a limit is approached or exceeded.

#### 2.1.35 Production data protection

Production infrastructure must protect data in transit and at rest according to the approved architecture and applicable requirements.

The environment must enforce storage access boundaries, encryption settings where required, backup isolation, and controlled administrative access.

Data classification, retention semantics, and application-level data minimization remain with the relevant security, data, and service owners.

#### 2.1.36 Deployment verification

After deployment, production must verify that the expected infrastructure and application revisions are active and that required readiness checks pass.

Verification should include:

- Artifact identity.
- Configuration revision.
- Workload health.
- Endpoint reachability.
- Dependency connectivity.
- Database migration status.
- Error and restart signals.
- Relevant service-level indicators.
- Alert state.
- Deployment record completeness.

Application-specific functional validation remains with the relevant service owners.

#### 2.1.37 Go-live planning and cutover

The go-live procedure must define the controlled transition to production traffic or users.

The plan must identify:

- Release candidate and artifact references.
- Infrastructure revision.
- Required approvals.
- Data migration prerequisites.
- Dependency readiness.
- DNS or traffic transition.
- Deployment sequence.
- Verification period.
- Abort conditions.
- Rollback or forward-recovery decision criteria.
- Communication and escalation.
- Completion declaration.

The cutover must not proceed if required infrastructure or security gates fail.

#### 2.1.38 Go-live authorization

Infrastructure readiness is necessary but not sufficient for go-live authorization.

The decision must consider:

- Required application acceptance.
- Data migration status.
- Security review.
- Operational ownership.
- Monitoring and alert readiness.
- Backup and restore evidence.
- HA and DR evidence.
- Known defects and residual risks.
- Business approval.
- Relevant lab or robot safety approval where physical operations are involved.

The authorized decision-maker must be identified in the applicable release and operational process.

C-M04 supplies evidence and executes the approved infrastructure transition; it does not unilaterally approve product or safety readiness.

#### 2.1.39 Rollback and forward recovery

Production must have a documented response to a failed deployment or go-live.

The response must identify:

- Conditions that trigger rollback or abort.
- Who can authorize the action.
- The last known-good application and infrastructure revisions.
- Traffic restoration steps.
- Database compatibility constraints.
- Handling of irreversible external side effects.
- Data consistency checks.
- Post-recovery verification.
- Incident and audit records.

Application rollback and schema rollback must be treated as separate decisions.

Where rollback is unsafe, the approved forward-recovery path must be documented.

#### 2.1.40 Operational runbooks

Production must provide runbooks for routine infrastructure operations and material failure scenarios.

Runbooks should cover:

- Deployment.
- Post-deployment verification.
- Infrastructure rollback.
- Workload restart or replacement.
- Database failover coordination.
- Backup monitoring.
- Restore and disaster recovery.
- Certificate renewal.
- Access revocation.
- Capacity exhaustion.
- Network or endpoint failure.
- Incident diagnostics.
- Environment configuration changes.

Each runbook must identify prerequisites, required permissions, expected results, failure conditions, and escalation ownership.

Detailed service-level runbooks remain with their authoritative service owners.

#### 2.1.41 Operational ownership and access review

The production environment must identify owners for infrastructure, runtime, database operations, observability, incident response, and disaster recovery.

The model must specify:

- Primary and backup operational ownership where required.
- Administrative access.
- Deployment authority.
- Recovery authority.
- Escalation path.
- Access review cadence.
- Credential revocation.
- Handover expectations.

A critical operational function must not depend solely on undocumented knowledge held by one individual.

#### 2.1.42 Production configuration drift

The environment must support detection or review of drift between declared and deployed production configuration.

Material drift must be classified, assigned, and resolved or explicitly approved.

Emergency modifications must be recorded and reconciled into the authoritative infrastructure definitions.

Unreviewed drift affecting security, availability, data protection, or recovery must be treated as a production risk.

#### 2.1.43 Go-live evidence and auditability

The production deployment must retain evidence sufficient to reconstruct the go-live event.

Evidence may include:

- Approved release reference.
- Source and artifact revisions.
- Infrastructure and configuration revisions.
- Deployment timestamps.
- Approval record references.
- Migration status.
- Health and smoke-check results.
- Relevant service indicators.
- Alert status.
- Backup and recovery readiness.
- Known deviations.
- Rollback decision and outcome if applicable.

Evidence must be access-controlled and must not contain plaintext secrets or unnecessary sensitive payloads.

#### 2.1.44 Post-go-live observation

The go-live procedure must include a defined observation period appropriate to the service risk.

The plan must specify which infrastructure and service indicators are reviewed, who reviews them, and what conditions trigger escalation or rollback.

The observation period must not be considered successful merely because the deployment process completed.

Application-level correctness and business outcome verification remain with their respective owners.

#### 2.1.45 Production lifecycle and retirement

Production infrastructure must have controlled procedures for resource replacement, major configuration changes, and retirement.

Destructive actions must require explicit environment confirmation and appropriate authorization.

Retirement must consider dependencies, data retention, backup preservation, audit requirements, DNS, credentials, and external integrations.

The milestone must not introduce an undocumented teardown path that can delete production resources without safeguards.

### 2.2 Explicit non-scope

The following are outside C-M04 PRODUCTION unless an approved scope change explicitly assigns them to this milestone:

- Defining the canonical phase and milestone model.
- Replacing the system architecture or cloud architecture.
- Rebuilding the shared cloud foundation.
- Owning development or staging infrastructure.
- Implementing frontend screens or application workflows.
- Implementing backend business logic or API behavior.
- Defining booking and commercial rules.
- Implementing build engines or artifact creation.
- Defining platform and resource service semantics.
- Implementing job scheduling or execution orchestration.
- Implementing Lab Agent behavior or physical robot control.
- Implementing telemetry acquisition or result computation.
- Defining database schema, migrations, RLS, or transaction semantics.
- Defining application authentication and authorization policy.
- Owning global CI, branching, code review, or release policy.
- Defining contractual business service-level commitments.
- Claiming physical robot safety based on cloud infrastructure validation.
- Authorizing product launch without required business approval.
- Approving physical deployment without required safety authorization.
- Treating infrastructure availability as proof of application correctness.
- Treating a successful backup job as proof of successful restoration.
- Treating configured redundancy as proof of tested high availability.
- Treating staging validation as proof that production-specific controls are complete.

C-M04 may provide infrastructure, tooling, evidence, and operational support for these activities, but implementation and approval ownership remains with the authoritative domains.

### 2.3 Canonical phase relationship table

| Phase | Relationship to C-M04 PRODUCTION | Boundary |
|---|---|---|
| P0 FOUNDATION | Supplies the shared cloud and engineering foundations | C-M04 follows approved foundation conventions |
| P1 STUDIO | Supplies the initial application context | C-M04 provides production hosting and runtime infrastructure, not Studio behavior |
| P2 BUILD & ARTIFACT | Supplies build and artifact capabilities | C-M04 deploys approved artifacts and does not own their creation |
| P3 CONTROL PLANE | Supplies identity, project, platform, resource, and artifact integration foundations | C-M04 operates production infrastructure for the approved control-plane services |
| P4 BOOKING & COMMERCIAL | Supplies booking and commercial capabilities | C-M04 provides production runtime, connectivity, and operational controls |
| P5 EXECUTION | Supplies execution capabilities | C-M04 provides production runtime and availability mechanisms |
| P6 LAB & ROBOT | Supplies lab and robot integration capabilities | C-M04 provides only approved infrastructure connectivity and boundaries |
| P7 LIVE & RESULTS | Supplies live and results capabilities | C-M04 provides production hosting, observability infrastructure, and availability mechanisms |
| P8 PRODUCTION | Primary phase for production infrastructure, HA, DR, and go-live | C-M04 owns production cloud infrastructure and its operational readiness |

### 2.4 Canonical cloud milestone relationship table

| Cloud milestone | Phase mapping | Relationship to C-M04 PRODUCTION |
|---|---|---|
| C-M01 FOUNDATION (P0) | P0 FOUNDATION | Supplies shared cloud account, network, identity, and infrastructure conventions |
| C-M02 DEVELOPMENT (P1-P3) | P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE | Supplies development provisioning and deployment patterns |
| C-M03 STAGING (P4-P7) | P4 BOOKING & COMMERCIAL; P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS | Supplies staging evidence, validated configuration, and parity findings |
| C-M04 PRODUCTION (P8) | P8 PRODUCTION | Owns production infrastructure, HA, DR, operational readiness, and go-live infrastructure |

### 2.5 Canonical frontend milestone relationship table

| Frontend milestone | Phase mapping | Production relationship |
|---|---|---|
| F-M01 STUDIO FOUNDATION (P0-P1) | P0 FOUNDATION; P1 STUDIO | Supplies the initial frontend deployment and runtime requirements |
| F-M02 PROJECTS (P1) | P1 STUDIO | Supplies project workflow requirements for production validation |
| F-M03 BUILD & ARTIFACT (P2) | P2 BUILD & ARTIFACT | Supplies build and artifact frontend integration requirements |
| F-M04 BOOKING (P4) | P4 BOOKING & COMMERCIAL | Supplies booking frontend production requirements |
| F-M05 EXECUTION (P5) | P5 EXECUTION | Supplies execution frontend production requirements |
| F-M06 LIVE (P7) | P7 LIVE & RESULTS | Supplies live presentation production requirements |
| F-M07 RESULTS (P7) | P7 LIVE & RESULTS | Supplies results presentation production requirements |

### 2.6 Canonical backend milestone relationship table

| Backend milestone | Phase mapping | Production relationship |
|---|---|---|
| B-M01 CONTROL PLANE (P3) | P3 CONTROL PLANE | Supplies control-plane service production requirements |
| B-M02 ARTIFACT (P2-P3) | P2 BUILD & ARTIFACT; P3 CONTROL PLANE | Supplies artifact-service production requirements |
| B-M03 PLATFORM (P3) | P3 CONTROL PLANE | Supplies platform and resource service production requirements |
| B-M04 BOOKING (P4) | P4 BOOKING & COMMERCIAL | Supplies booking service production requirements |
| B-M05 EXECUTION (P5) | P5 EXECUTION | Supplies execution service production requirements |
| B-M06 RESULTS (P6-P7) | P6 LAB & ROBOT; P7 LIVE & RESULTS | Supplies results service production requirements |
| B-M07 PRODUCTION (P8) | P8 PRODUCTION | Owns production application service behavior; C-M04 owns the cloud infrastructure supporting it |

### 2.7 Canonical database milestone relationship table

| Database milestone | Phase mapping | Production relationship |
|---|---|---|
| DB-M01 FOUNDATION (P0-P3) | P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE | Supplies database foundation, identity, and project schema requirements |
| DB-M02 CORE DATA (P3) | P3 CONTROL PLANE | Supplies platform, resource, artifact, and storage metadata requirements |
| DB-M03 BOOKING DATA (P4) | P4 BOOKING & COMMERCIAL | Supplies booking and commercial schema requirements |
| DB-M04 EXECUTION DATA (P5-P7) | P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS | Supplies jobs, runs, telemetry/log metadata, and results schema requirements |

### 2.8 Production readiness dimensions

| Dimension | Production expectation | Required evidence |
|---|---|---|
| Environment boundary | Explicitly separated production resources | Resource inventory and access-boundary checks |
| Infrastructure as code | Reviewed, version-controlled production definitions | Infrastructure revision and provisioning record |
| Network topology | Approved production routing and segmentation | Connectivity and access validation |
| TLS | Valid certificates and documented lifecycle | Certificate and endpoint checks |
| Identity | Least-privilege workload and operator identities | Role and permission review |
| Secrets | Controlled production secret delivery | Secret-access and rotation evidence |
| Runtime | Supported runtime and resource configuration | Runtime inventory and health checks |
| Deployment | Approved, traceable production release | Deployment record and artifact identity |
| High availability | Defined and tested failure handling | HA exercise evidence |
| Database | Production access, availability, and recovery integration | Connectivity, migration, failover, and recovery evidence |
| Object storage | Required durability and access protection | Access, lifecycle, and recovery evidence |
| Backup | Required resources are protected | Backup execution and retention records |
| Restore | Recoverability is demonstrated | Restore exercise and data validation |
| Disaster recovery | Approved recovery path and objectives | DR exercise, measured RTO, and measured RPO |
| Observability | Infrastructure health and failure are detectable | Dashboards, alert tests, and diagnostic evidence |
| Capacity | Limits and failover headroom are understood | Capacity assumptions, quotas, and measurements |
| Security | Production infrastructure controls are verified | Security review and finding disposition |
| Change control | Production changes are attributable and reviewed | Change records and post-change checks |
| Incident response | Operators can diagnose and recover | Runbooks, ownership, and escalation records |
| Go-live | Authorized cutover and verification | Approval references and deployment evidence |
| Residual risk | Unresolved limitations are explicit | Risk register and owner disposition |

### 2.9 Required production invariants

C-M04 PRODUCTION must preserve these invariants:

- **Environment identity:** production resources have an explicit, verifiable production identity.
- **Environment separation:** development and staging identities cannot mutate production without an explicitly approved mechanism.
- **Change traceability:** persistent infrastructure changes are attributable and linked to a reviewed revision or recorded emergency action.
- **Deployment traceability:** production deployments identify their artifacts and configuration revisions.
- **Least privilege:** workloads and operators receive only required permissions.
- **Secret protection:** production credentials are controlled and not exposed through ordinary logs or artifacts.
- **Network restriction:** public and internal access follows approved network boundaries.
- **TLS integrity:** production endpoints use the approved trust and certificate model.
- **High availability evidence:** HA claims are supported by relevant failure tests.
- **Recoverability evidence:** backup and DR claims are supported by restore or recovery exercises.
- **Data protection:** database and storage recovery assumptions are explicit and verified by their owners.
- **Readiness accuracy:** go-live status reflects required infrastructure and application checks.
- **Capacity honesty:** capacity and availability claims reflect measured evidence and documented assumptions.
- **Operational ownership:** every critical infrastructure function has an identified owner and escalation path.
- **Incident readiness:** required diagnostics and recovery procedures are accessible to authorized operators.
- **Parity closure:** staging deviations relevant to production have been reviewed and dispositioned.
- **Go-live separation:** infrastructure readiness does not replace business, application, security, or safety authorization.
- **Recovery safety:** destructive restoration or rollback actions require explicit scope and authorization.
- **Auditability:** production deployment and infrastructure-change evidence is retained.
- **Ownership clarity:** production infrastructure, application behavior, database semantics, and physical safety remain distinct responsibilities.

---

## 3. Dependencies

### 3.1 C-M01 FOUNDATION (P0)

C-M04 depends on C-M01 FOUNDATION for the shared cloud foundation, account conventions, networking, identity, infrastructure-as-code tooling, resource tagging, and baseline security controls.

Production must reuse these foundations while applying stricter production access, availability, monitoring, and recovery controls where required.

Any production-specific deviation from the foundation must be documented and approved through the relevant architecture and security processes.

### 3.2 C-M02 DEVELOPMENT (P1-P3)

C-M04 depends on C-M02 DEVELOPMENT for reusable infrastructure and deployment patterns.

Relevant dependencies include:

- Application packaging and runtime conventions.
- Environment configuration conventions.
- Artifact flow.
- CI/CD integration patterns.
- Service discovery and endpoint configuration.
- Database migration workflow.
- Observability integration.
- Infrastructure provisioning patterns.

Production configuration must not inherit development-only credentials, endpoints, permissions, or relaxed security settings.

### 3.3 C-M03 STAGING (P4-P7)

C-M04 depends on C-M03 STAGING for staging evidence and production-parity assessment.

Relevant handoff items include:

- Validated infrastructure configuration.
- Deployed artifact references.
- Integration and smoke-check evidence.
- Database migration evidence.
- Security review findings.
- Known environment differences.
- External integration modes.
- Runtime and dependency assumptions.
- Unresolved infrastructure risks.

Staging evidence reduces production uncertainty but does not replace production-specific HA, DR, security, capacity, and go-live validation.

### 3.4 Cloud architecture

C-M04 depends on `docs/architecture/CLOUD_ARCHITECTURE.md` and `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` for approved system topology and implementation conventions.

Production must align with the approved service boundaries, data paths, network trust boundaries, deployment topology, and operational assumptions.

If the architecture does not define a required production property, the relevant architecture owner must resolve it before the property is treated as an accepted design assumption.

### 3.5 Cloud security architecture

C-M04 depends on `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` for production infrastructure security requirements.

The implementation must align with requirements for:

- Production identity and access management.
- Network segmentation.
- Public exposure.
- Secret delivery.
- TLS and certificate lifecycle.
- Infrastructure administration.
- Audit and monitoring.
- Backup and recovery access.
- Artifact and deployment trust.
- Environment isolation.
- Security incident response.

Application-level authentication and authorization remain with the security and application owners.

### 3.6 Frontend deployment dependencies

The applicable frontend milestones must provide production deployment requirements and approved frontend artifacts.

Required inputs include:

- Artifact or image format.
- Runtime configuration requirements.
- Production endpoint and origin assumptions.
- API endpoint configuration.
- TLS requirements.
- Health-check expectations where supported.
- Asset delivery and caching requirements where applicable.
- Release compatibility constraints.

C-M04 supplies production hosting and infrastructure configuration. Frontend owners remain responsible for client behavior, workflows, and application-level acceptance.

### 3.7 Backend deployment dependencies

The applicable backend milestones must provide production service requirements.

Required inputs include:

- Runtime and packaging requirements.
- Service ports and endpoint definitions.
- Health and readiness semantics.
- Database and storage dependencies.
- Required workload identities.
- Resource and scaling assumptions.
- Startup and shutdown behavior.
- Logging, metrics, and tracing requirements.
- Migration compatibility constraints.
- Failure and retry behavior.

C-M04 provides production infrastructure and deployment integration. Backend owners remain responsible for API behavior, business logic, and service correctness.

### 3.8 Database dependencies

C-M04 depends on the applicable database milestones for production schema, migration, access, and data-integrity requirements.

- DB-M01 FOUNDATION (P0-P3) defines the database foundation, identity and project schema, RLS, audit, and migration conventions.
- DB-M02 CORE DATA (P3) defines platform, resource, artifact, and storage metadata.
- DB-M03 BOOKING DATA (P4) defines booking and commercial persistence.
- DB-M04 EXECUTION DATA (P5-P7) defines jobs, runs, telemetry/log metadata, and results persistence.

The cloud milestone owns production database infrastructure integration, infrastructure-level protection, and recovery coordination. Database owners define schema correctness, transaction behavior, migration content, data consistency, and database-specific restore validation.

### 3.9 Artifact and provenance dependencies

Production deployment depends on approved, identifiable artifacts produced through the relevant build and artifact workflows.

The release path must establish:

- Artifact identity.
- Source revision or equivalent provenance.
- Registry or storage location.
- Integrity verification where required.
- Retrieval permissions.
- Compatibility with production runtime.
- Deployment record format.
- Handling of unavailable or revoked artifacts.

C-M04 must not build or modify application artifacts as an undocumented production deployment side effect.

### 3.10 Booking and commercial services

P4 BOOKING & COMMERCIAL services must provide production runtime and dependency requirements.

Production infrastructure must support the required database connectivity, service routing, secrets, monitoring, and operational controls.

Commercial rules, booking correctness, payment semantics, and financial data integrity remain with the applicable product, backend, and database owners.

### 3.11 Execution services

P5 EXECUTION services must provide production runtime, capacity, and dependency requirements.

The production design must consider execution workload behavior, required concurrency, service availability, persistence dependencies, and operational diagnostics.

C-M04 does not define job state transitions, scheduling policy, execution retry semantics, or worker correctness.

### 3.12 Lab and robot integration

Where P6 LAB & ROBOT is part of the production deployment, C-M04 depends on approved integration and safety requirements.

The required inputs include:

- Network and endpoint requirements.
- Workload identity and authentication.
- Operational access boundaries.
- Physical-device or simulator mode.
- Failure and disconnect behavior.
- Monitoring and escalation.
- Safety restrictions and deployment authorization.

Production infrastructure readiness does not imply that a physical robot is safe to operate. Relevant hardware and safety owners must authorize physical deployment.

### 3.13 Live and results services

P7 LIVE & RESULTS services must provide production endpoint, storage, retention, and capacity requirements.

- F-M06 LIVE (P7) owns live presentation behavior.
- B-M06 RESULTS (P6-P7) owns results service behavior.
- F-M07 RESULTS (P7) owns results presentation behavior.
- DB-M04 EXECUTION DATA (P5-P7) owns the related persistent metadata model.

C-M04 provides production infrastructure, observability paths, and availability controls. It does not define telemetry semantics, result computation, or user-facing presentation behavior.

### 3.14 Production application service

B-M07 PRODUCTION (P8) defines production application service behavior and its service-level requirements.

C-M04 must provide the infrastructure and operational controls required to deploy and operate those services.

The two scopes must remain distinct: backend service correctness belongs to B-M07 PRODUCTION (P8), while cloud infrastructure availability, recovery, and go-live execution belong to C-M04 PRODUCTION (P8).

### 3.15 Service objectives and business requirements

Production HA and DR decisions depend on agreed service objectives.

Required inputs include:

- Availability expectations.
- Critical user and workload paths.
- Acceptable interruption.
- Acceptable data loss.
- Recovery priorities.
- Peak workload assumptions.
- Data retention requirements.
- Operational support expectations.
- Go-live authorization requirements.

Business and service owners must approve these assumptions. C-M04 must not silently invent contractual commitments.

### 3.16 Backup and recovery dependencies

The backup and recovery design depends on the authoritative database, storage, and service owners.

Required inputs include:

- Protected resources and data classes.
- Backup consistency requirements.
- Recovery ordering.
- Replication behavior.
- Retention and deletion rules.
- Encryption and access requirements.
- Restoration validation.
- Application compatibility after restore.
- Acceptable recovery data point.
- Recovery authorization.

C-M04 coordinates infrastructure provisioning, orchestration, monitoring, and recovery execution. Data owners validate the correctness and completeness of restored data.

### 3.17 RTO and RPO approval

RTO and RPO must be approved for the agreed production recovery scope.

The cloud team must coordinate with service, database, security, and business owners to identify dependencies and measure recovery performance.

If measured recovery time or data loss exceeds the approved objective, the gap must be treated as a release-blocking risk unless an authorized owner explicitly accepts the deviation through the applicable process.

### 3.18 Observability and incident response

C-M04 depends on the approved observability and incident response arrangements.

The environment must know:

- Where infrastructure logs and metrics are emitted.
- Which alerts are actionable.
- Who receives each alert.
- How incident diagnostics are accessed.
- Which runbook applies.
- Who authorizes recovery operations.
- How evidence is preserved.
- How unresolved issues are escalated.

Application instrumentation and business-level monitoring remain with service owners.

### 3.19 Capacity and quota dependencies

Production sizing depends on workload estimates, measured performance, cloud quotas, and service limits.

The capacity plan must consider normal operation, peak workload, failure conditions, and recovery activity.

Relevant service owners must provide expected concurrency, data growth, and critical-path assumptions.

The cloud milestone must document any quota or capacity constraint that prevents the agreed workload or failover model from being supported.

### 3.20 Release and change-control dependencies

C-M04 depends on the global release and development workflow for approval, review, artifact provenance, deployment authorization, and evidence retention.

Production-specific integration must implement these policies without redefining them.

Emergency changes and recovery operations must remain attributable and must be reconciled into the authoritative infrastructure configuration.

### 3.21 Security and compliance dependencies

Production security requirements depend on the approved security architecture and applicable organizational obligations.

Required inputs include:

- Access-control requirements.
- Data protection requirements.
- Audit retention requirements.
- Secret-management requirements.
- Encryption requirements.
- Vulnerability and patch expectations.
- Incident response requirements.
- Backup access restrictions.
- Recovery environment security.
- Required security approvals.

C-M04 implements infrastructure controls and supplies evidence; it does not independently declare compliance with obligations owned by the security or business domains.

### 3.22 Go-live dependency readiness

Go-live depends on coordinated readiness across the infrastructure, frontend, backend, database, security, operations, and business owners.

Before cutover, the release must have:

- An approved release candidate.
- Known artifact and configuration revisions.
- Required database migrations.
- Verified infrastructure readiness.
- Required security approval.
- Monitoring and alert coverage.
- Backup and restore readiness.
- HA and DR evidence appropriate to the agreed scope.
- Operational ownership and escalation.
- Documented rollback or forward-recovery criteria.
- Dispositioned release-blocking risks.
- Explicit authorization from the designated decision-maker.

The precise approval sequence belongs to the global release and operational processes.

### 3.23 Dependency readiness criteria

A dependency is ready when:

- Its authoritative owner is identified.
- Production interface and configuration requirements are documented.
- Security and identity assumptions are explicit.
- Availability and failure behavior are understood.
- Required backup or recovery behavior is defined.
- Operational diagnostics are available.
- Relevant readiness evidence exists.
- Known gaps have an owner and disposition.

Dependencies must be classified as blocking, conditionally blocking, or non-blocking.

- **Blocking:** production cannot safely operate or satisfy a required recovery or security invariant without the dependency.
- **Conditionally blocking:** production can be prepared, but go-live or the affected capability must wait for evidence or approval.
- **Non-blocking:** the issue does not invalidate the accepted production infrastructure baseline and has a documented disposition.

Detailed dependency sequencing belongs in `TASKS.md`.

### 3.24 Cross-phase handoff table

| Handoff | Producing phase or milestone | Consuming phase or milestone | Required evidence |
|---|---|---|---|
| Cloud foundation | C-M01 FOUNDATION (P0) | C-M04 PRODUCTION (P8) | Approved account, network, identity, and infrastructure conventions |
| Development deployment patterns | C-M02 DEVELOPMENT (P1-P3) | C-M04 PRODUCTION (P8) | Reusable provisioning and deployment patterns |
| Staging validation | C-M03 STAGING (P4-P7) | C-M04 PRODUCTION (P8) | Parity matrix, integration evidence, known limitations, and open risks |
| Application artifacts | Applicable build and artifact owners | C-M04 PRODUCTION (P8) | Approved, identifiable, retrievable artifacts |
| Booking service requirements | P4 BOOKING & COMMERCIAL and applicable service owners | C-M04 PRODUCTION (P8) | Runtime, database, network, and security requirements |
| Execution service requirements | B-M05 EXECUTION (P5) | C-M04 PRODUCTION (P8) | Runtime, capacity, persistence, and readiness requirements |
| Lab and robot requirements | P6 LAB & ROBOT | C-M04 PRODUCTION (P8) | Approved connectivity and safety constraints |
| Live and results requirements | P7 LIVE & RESULTS and applicable service owners | C-M04 PRODUCTION (P8) | Endpoint, storage, observability, and capacity requirements |
| Database requirements | Applicable database milestones | C-M04 PRODUCTION (P8) | Schema, migration, access, backup, and recovery requirements |
| Production infrastructure | C-M04 PRODUCTION (P8) | Applicable application and operational owners | Runtime, availability, recovery, access, and deployment evidence |
| Go-live decision | Designated release and business authorities | C-M04 PRODUCTION (P8) | Explicit authorization and dispositioned blocking risks |
| Production operations | C-M04 PRODUCTION (P8) and assigned operational owners | Ongoing production operation | Runbooks, alerts, ownership, access, and recovery procedures |

### 3.25 Dependency change control

A change to production topology, identity, network routing, database availability, storage durability, backup policy, recovery architecture, or deployment strategy can affect multiple service domains.

Each material change must identify:

- The affected resource or configuration.
- The reason and authorization.
- The infrastructure revision.
- The impact on availability and security.
- The impact on data protection and recovery.
- The affected application and database owners.
- The validation and monitoring plan.
- The rollback or forward-recovery approach.
- The expected effect on RTO and RPO.
- The required post-change evidence.
- Any change to go-live readiness.

Changes must follow the approved production change process. C-M04 must not silently weaken recovery, security, or availability controls to work around an application defect.

---

## 4. Deliverables

### 4.1 Production environment specification

Deliver a production-specific environment specification describing the resource boundary, topology, service dependencies, operational roles, and environment-specific controls.

The specification must reference the authoritative cloud architecture rather than duplicating its full system design.

**Completion evidence:** an authorized reviewer can identify production resources, trust boundaries, service dependencies, and recovery-related components from the specification.

### 4.2 Production infrastructure-as-code baseline

Deliver version-controlled infrastructure definitions for production-owned resources.

The definitions must follow the approved cloud foundation and implementation conventions.

**Completion evidence:** production infrastructure can be provisioned or reconciled through the approved workflow, with reviewed configuration and attributable execution records.

### 4.3 Production boundary and resource inventory

Deliver a production resource inventory and explicit environment identity.

The inventory must identify critical resources, ownership, location, access boundaries, and operational purpose.

**Completion evidence:** production resources can be distinguished from development and staging resources and associated with an accountable owner.

### 4.4 Production network and routing configuration

Deliver production network segmentation, ingress, egress, DNS, service discovery, and routing configuration as required by the approved topology.

**Completion evidence:** required traffic paths work, unapproved paths are denied, and failure behavior is documented.

### 4.5 TLS and certificate lifecycle

Deliver production certificate configuration and the supported provisioning, renewal, monitoring, and rotation procedure.

**Completion evidence:** production endpoints validate against the intended trust model and certificate expiry or renewal failures are observable.

### 4.6 Production identity and access controls

Deliver production workload identities, operator roles, deployment permissions, and access boundaries.

The design must distinguish routine operation from privileged administration and recovery.

**Completion evidence:** permissions are reviewed, least privilege is applied, and unauthorized cross-environment access is denied.

### 4.7 Production secret-management integration

Deliver the production secret retrieval and injection mechanism.

The mechanism must support controlled access, rotation or revocation where required, and auditability.

**Completion evidence:** required workloads can retrieve approved secrets without exposing plaintext values in source control, images, or ordinary logs.

### 4.8 Compute and orchestration baseline

Deliver production runtime resources and configuration appropriate to the approved topology.

The configuration must identify runtime versions, placement, replica counts, resource limits, health checks, restart behavior, and scaling controls.

**Completion evidence:** required workloads can start, recover from supported component failures, and expose the expected health signals.

### 4.9 High-availability design and configuration

Deliver the production HA design for critical infrastructure components.

The design must identify failure scenarios, mitigation mechanisms, expected interruption, data implications, and verification procedures.

**Completion evidence:** required HA mechanisms are configured and relevant failure exercises demonstrate the expected behavior.

### 4.10 Capacity and scaling baseline

Deliver production capacity assumptions, quota inventory, scaling settings, and relevant thresholds.

The plan must account for expected workload, peak conditions, and required failover headroom.

**Completion evidence:** the intended production workload has a documented capacity basis and material quota risks have been dispositioned.

### 4.11 Production deployment pipeline integration

Deliver the production-specific CI/CD deployment integration.

The pipeline must enforce the approved release process, use controlled deployment identities, and retain deployment evidence.

**Completion evidence:** an approved revision can be deployed through the documented process with attributable approvals and a traceable result.

### 4.12 Artifact integrity and deployment traceability

Deliver production deployment records that identify artifact, source, infrastructure, and configuration revisions.

Where required, integrate the approved artifact integrity or provenance verification.

**Completion evidence:** the deployed production revision can be identified and associated with its approved release record.

### 4.13 Database infrastructure and failover

Deliver production database infrastructure configuration in coordination with the database owners.

The deliverable must cover access, availability, capacity, failover, monitoring, and recovery integration.

**Completion evidence:** required connectivity and database failover checks pass, and database-specific validation evidence is available from the authoritative owner.

### 4.14 Database migration deployment integration

Deliver the controlled production migration invocation and verification path.

The workflow must report migration status independently of application rollout and must respect the approved migration policy.

**Completion evidence:** migration execution is attributable, failure is visible, and release readiness reflects the verified migration outcome.

### 4.15 Backup configuration and monitoring

Deliver backup configuration for the agreed production resources and data classes.

The configuration must identify schedule, retention, encryption, access, destination, monitoring, and failure reporting.

**Completion evidence:** required backup jobs execute successfully, their outcomes are observable, and retention settings match approved requirements.

### 4.16 Restore procedure and evidence

Deliver a documented restore procedure and evidence from a representative restore exercise.

The exercise must include required infrastructure, data, configuration, and service verification.

**Completion evidence:** restored data and services are validated, and measured recovery time and data point are recorded.

### 4.17 Disaster recovery architecture

Deliver the approved DR design, including recovery scope, target environment, dependencies, restoration order, and endpoint cutover.

**Completion evidence:** the recovery architecture is documented, access is available to authorized operators, and required resources can be restored through the documented path.

### 4.18 RTO and RPO assessment

Deliver approved RTO and RPO targets for the agreed production recovery scope and the measured results of relevant exercises.

**Completion evidence:** measured recovery performance is compared with approved objectives, and any gap has an owner and formal disposition.

### 4.19 Disaster-recovery exercise record

Deliver records of the required DR exercises.

The records must include scope, prerequisites, execution steps, timestamps, data validation, service verification, issues, and follow-up ownership.

**Completion evidence:** the exercises demonstrate the agreed recovery path or identify blocking gaps explicitly.

### 4.20 Object storage protection

Deliver production object storage configuration for access, encryption, durability, lifecycle, retention, and recovery as applicable.

**Completion evidence:** access controls and required durability or recovery settings are verified, with storage-owner validation of data semantics.

### 4.21 Supporting dependency resilience

Deliver production configuration and recovery assumptions for required queues, caches, and supporting services.

**Completion evidence:** failure handling, capacity, monitoring, and recovery behavior are documented and verified to the agreed scope.

### 4.22 Production observability baseline

Deliver production infrastructure dashboards, log access, metrics, and diagnostic integrations.

The baseline must cover workload health, resource saturation, routing, database and storage health, deployment outcomes, backups, certificates, and recovery signals as applicable.

**Completion evidence:** representative infrastructure conditions can be detected and diagnosed through the documented operational path.

### 4.23 Production alerting and escalation

Deliver actionable infrastructure alerts and their assigned notification and escalation routes.

**Completion evidence:** representative alert conditions trigger the intended route and have a documented owner and response expectation.

### 4.24 Operational runbooks

Deliver production infrastructure runbooks for deployment, verification, failure response, backup monitoring, restore, DR, certificate renewal, capacity exhaustion, and access revocation as applicable.

**Completion evidence:** designated operators can follow the runbooks using approved access, and prerequisites, failure conditions, and escalation paths are explicit.

### 4.25 Incident response integration

Deliver infrastructure-specific incident response procedures and diagnostic access.

**Completion evidence:** infrastructure alerts, audit records, recovery actions, and escalation contacts are available to authorized responders.

### 4.26 Production security validation

Deliver evidence of the production infrastructure security review.

The review must cover network exposure, identity, secrets, TLS, runtime privileges, storage, database access, backup protection, deployment permissions, and auditability.

**Completion evidence:** required findings are resolved or formally dispositioned by the authorized security owner.

### 4.27 Vulnerability and patch management

Deliver the production infrastructure patching and maintenance procedure.

**Completion evidence:** ownership, supported versions, change approval, validation, emergency patching, and rollback or recovery expectations are documented.

### 4.28 Infrastructure drift management

Deliver the supported process for detecting, reviewing, and reconciling production infrastructure drift.

**Completion evidence:** material drift can be identified and assigned, and emergency changes are reconciled into authoritative configuration or explicitly dispositioned.

### 4.29 Production change-control integration

Deliver the production-specific integration with the approved change-control and release workflow.

**Completion evidence:** material infrastructure changes are attributable, reviewed, verified, and recorded; emergency changes have a documented reconciliation path.

### 4.30 Go-live deployment plan

Deliver a go-live plan covering release candidate, artifact references, infrastructure revision, migration prerequisites, cutover sequence, validation, abort criteria, rollback or forward recovery, and communications.

**Completion evidence:** the plan identifies required approvals, responsible owners, and observable success or abort conditions.

### 4.31 Go-live authorization record

Deliver a reference to the approved go-live decision and its required evidence.

The decision must consider infrastructure readiness, application acceptance, data migration, security, operational ownership, HA/DR readiness, and relevant safety approvals.

**Completion evidence:** the authorized decision-maker and approval record are identifiable; infrastructure deployment alone is not treated as authorization.

### 4.32 Post-deployment verification

Deliver production verification checks for the deployed revision.

The checks must include infrastructure health, endpoint reachability, dependency connectivity, migration status, artifact identity, relevant service indicators, and alert state as applicable.

**Completion evidence:** verification results are recorded against the actual deployed revision and reviewed by the designated owners.

### 4.33 Rollback and forward-recovery procedure

Deliver the production response procedure for failed deployment or go-live.

The procedure must identify decision authority, abort criteria, previous known-good revisions, traffic restoration, database compatibility, data validation, and recovery evidence.

**Completion evidence:** the selected rollback or forward-recovery approach is documented and does not assume unsafe database reversal.

### 4.34 Production operational ownership

Deliver the production ownership and access model for routine operations, deployment, incident response, database coordination, backup, restore, and DR.

**Completion evidence:** critical functions have identified owners, access is reviewable, and escalation paths are documented.

### 4.35 Production parity closure record

Deliver a record of staging deviations relevant to production and their final disposition.

**Completion evidence:** each material deviation is resolved, accepted by the authorized owner, or explicitly blocks the affected go-live scope.

### 4.36 Production evidence and audit record

Deliver the evidence package for infrastructure deployment, security validation, HA, DR, go-live, and post-deployment verification.

**Completion evidence:** authorized reviewers can identify the deployed revisions, relevant approvals, test results, known limitations, and residual risks.

### 4.37 Production handoff package

Deliver a package for the designated production operators and service owners containing:

- Production topology and infrastructure revision.
- Environment and access model.
- Deployment procedure.
- Operational dashboards and alerts.
- Runbooks.
- Backup and restore procedures.
- DR architecture and exercise evidence.
- RTO and RPO assessment.
- Known limitations and accepted risks.
- Escalation and ownership information.
- Change-control and configuration-drift procedures.
- Production revision and deployment evidence.

**Completion evidence:** designated operators can identify how to deploy, monitor, diagnose, recover, and escalate without relying on undocumented assumptions.

### 4.38 Deliverable ownership summary

| Deliverable | Authoritative owner | C-M04 PRODUCTION responsibility |
|---|---|---|
| Shared cloud foundation | C-M01 FOUNDATION (P0) | Reuse approved conventions |
| Development environment | C-M02 DEVELOPMENT (P1-P3) | Reuse suitable provisioning and deployment patterns |
| Staging environment | C-M03 STAGING (P4-P7) | Consume parity and integration evidence |
| Production infrastructure | C-M04 PRODUCTION (P8) | Own production resources and operational controls |
| Frontend application behavior | Applicable frontend milestones | Provide production hosting and delivery infrastructure |
| Backend application behavior | Applicable backend milestones | Provide production runtime and service connectivity |
| Database schema and migrations | Applicable database milestones | Provide infrastructure integration and recovery coordination |
| Artifact creation | Applicable build and artifact owners | Deploy approved, traceable artifacts |
| HA and infrastructure failover | C-M04 PRODUCTION with relevant service owners | Own infrastructure design and validation |
| Database failover semantics | Database domain | Coordinate infrastructure and application recovery |
| Backup and restore infrastructure | C-M04 PRODUCTION with database and service owners | Own cloud orchestration and coordinate data validation |
| Disaster recovery | C-M04 PRODUCTION with database and service owners | Own infrastructure recovery design and exercises |
| Application observability | Applicable service owners | Provide infrastructure observability paths |
| Infrastructure observability | C-M04 PRODUCTION | Own platform metrics, logs, alerts, and diagnostic access |
| Application security policy | Security and application owners | Apply infrastructure controls |
| Production go-live authorization | Designated release and business authorities | Supply evidence and execute approved cutover |
| Physical robot safety | Relevant safety and hardware owners | Enforce approved infrastructure boundaries |
| Detailed production tasks | `TASKS.md` | Link to authoritative task plan |
| Detailed production acceptance | `ACCEPTANCE_CRITERIA.md` | Link to authoritative acceptance requirements |

### 4.39 Required milestone records

The C-M04 PRODUCTION directory maintains these sibling records:

| File | Purpose |
|---|---|
| `MILESTONE.md` | Objective, scope, dependencies, deliverables, risks, exit criteria, and ownership boundaries |
| `TASKS.md` | Work decomposition, sequencing, dependencies, and ownership |
| `ACCEPTANCE_CRITERIA.md` | Detailed pass/fail conditions and evidence requirements |
| `REVIEW_CHECKLIST.md` | Review actions and evidence inspection |
| `CHANGELOG.md` | Accepted changes and milestone history |
| `GIT_COMMIT_STEP.md` | Repository and commit procedure |

These records are complementary. This dossier defines the milestone contract. The sibling files own task-level planning, acceptance evidence, review execution, accepted history, and commit procedure.

---

## 9. Risks

### 9.1 Production environment is not isolated

**Risk:** Development or staging identities, automation, or networks can mutate production resources.

**Impact:** Unauthorized changes, data loss, exposure, or service interruption.

**Mitigation:**

- Establish an explicit production boundary.
- Separate environment identities and secrets.
- Restrict network paths.
- Verify effective permissions.
- Require explicit production deployment targeting.
- Audit privileged and destructive operations.

**Owner:** Cloud and security domains.

### 9.2 High availability is assumed rather than tested

**Risk:** Redundant replicas or managed services are considered sufficient without validating failure behavior.

**Impact:** Production outages exceed expectations when a component or failure domain becomes unavailable.

**Mitigation:**

- Identify critical components and failure scenarios.
- Document expected failover behavior.
- Validate relevant failure paths.
- Measure service interruption.
- Record limitations and remediation owners.

**Owner:** C-M04 PRODUCTION with relevant service owners.

### 9.3 Single points of failure remain

**Risk:** A critical ingress, database, identity dependency, storage path, or operational component has no effective failover or recovery path.

**Impact:** A single failure interrupts production.

**Mitigation:**

- Review the production topology.
- Identify critical dependencies.
- Assess failure-domain separation.
- Validate failover paths.
- Document accepted single points of failure.
- Require explicit risk disposition for critical gaps.

**Owner:** Cloud architecture and C-M04 PRODUCTION.

### 9.4 Disaster recovery is unproven

**Risk:** The DR design exists on paper but has not been exercised against the intended recovery scope.

**Impact:** Production cannot be restored within approved objectives after a major disruption.

**Mitigation:**

- Exercise the documented recovery path.
- Verify access and prerequisites.
- Restore infrastructure and data.
- Validate service readiness and data consistency.
- Record measured recovery time and data point.
- Assign owners to exercise findings.

**Owner:** C-M04 PRODUCTION with database and service owners.

### 9.5 RTO or RPO targets are unrealistic

**Risk:** Recovery objectives are set without considering backup frequency, replication lag, restoration time, dependencies, or operator access.

**Impact:** The organization cannot meet its stated recovery commitments.

**Mitigation:**

- Obtain approval from business and service owners.
- Measure recovery exercises.
- Compare actual results with targets.
- Document service-specific objectives.
- Treat material gaps as blocking until dispositioned.

**Owner:** Business, service, database, and cloud owners.

### 9.6 Backups are incomplete or unusable

**Risk:** Backup jobs omit critical data, fail silently, or create backups that cannot be restored.

**Impact:** Irrecoverable data loss or prolonged service interruption.

**Mitigation:**

- Define protected resources and data classes.
- Monitor backup success and failure.
- Protect backup access and retention.
- Exercise restoration.
- Validate restored data with database and service owners.
- Preserve restore evidence.

**Owner:** C-M04 PRODUCTION with database and service owners.

### 9.7 Backup deletion or compromise

**Risk:** A compromised identity or destructive operation can delete or alter both production data and its backups.

**Impact:** Recovery becomes impossible or incomplete.

**Mitigation:**

- Separate backup access from routine workload permissions.
- Apply retention and deletion safeguards.
- Restrict backup administration.
- Use independent or immutable protection where required and supported.
- Test recovery access during exercises.
- Audit destructive backup operations.

**Owner:** Cloud, security, and database domains.

### 9.8 Database failover causes inconsistent behavior

**Risk:** Database failover succeeds at the infrastructure level but application connections, transactions, or dependent workflows do not recover correctly.

**Impact:** Errors, partial writes, stale reads, or inconsistent user-visible behavior.

**Mitigation:**

- Document database failover semantics.
- Validate connection recovery.
- Coordinate with application owners.
- Test data consistency.
- Monitor replication lag and failover events.
- Keep schema and transaction correctness with database owners.

**Owner:** Database, backend, and cloud domains.

### 9.9 Database migrations break rollback

**Risk:** A production migration is incompatible with the previous application revision or cannot be safely reversed.

**Impact:** A failed rollout cannot return to the prior state without additional recovery work.

**Mitigation:**

- Review migration compatibility.
- Separate application rollback from schema rollback.
- Use approved migration procedures.
- Define forward recovery where reversal is unsafe.
- Require database-owner review for destructive changes.

**Owner:** Database and backend domains, with cloud deployment support.

### 9.10 Production capacity is insufficient

**Risk:** Production resources cannot support the expected workload, peak concurrency, or failover load.

**Impact:** Elevated latency, failed requests, queue growth, or service unavailability.

**Mitigation:**

- Document workload assumptions.
- Validate capacity using representative evidence.
- Monitor quotas and saturation.
- Include failover headroom.
- Define scaling limits and alerts.
- Reassess after material workload changes.

**Owner:** Cloud and service owners.

### 9.11 Capacity limits prevent failover

**Risk:** Remaining infrastructure lacks sufficient capacity after a node, zone, or other failure.

**Impact:** The HA design cannot sustain the intended workload.

**Mitigation:**

- Include degraded-capacity scenarios in sizing.
- Validate quota availability.
- Define supported failover load.
- Measure resource utilization during exercises.
- Document reduced-service modes where applicable.

**Owner:** C-M04 PRODUCTION and service owners.

### 9.12 Misconfigured autoscaling destabilizes services

**Risk:** Scaling triggers, limits, or cooldown behavior cause oscillation, overload, or resource exhaustion.

**Impact:** Availability and cost become unpredictable.

**Mitigation:**

- Document scaling assumptions.
- Use representative load evidence.
- Set safe minimum and maximum limits.
- Monitor scaling events and saturation.
- Test relevant scaling transitions.
- Keep application concurrency semantics with service owners.

**Owner:** Cloud and service owners.

### 9.13 Production credentials are exposed

**Risk:** Secrets leak through source control, images, logs, deployment output, or overly broad access.

**Impact:** Unauthorized production access and possible data compromise.

**Mitigation:**

- Use controlled secret management.
- Restrict retrieval permissions.
- Rotate or revoke exposed credentials.
- Prevent plaintext secret logging.
- Audit secret access.
- Exercise the credential-compromise response.

**Owner:** Security and cloud domains.

### 9.14 Excessive infrastructure privileges

**Risk:** Workloads, deployment pipelines, or operators receive broader permissions than required.

**Impact:** A compromise or mistake can affect multiple production services or data stores.

**Mitigation:**

- Apply least privilege.
- Separate runtime and administrative identities.
- Restrict deployment and recovery roles.
- Review effective permissions.
- Audit privileged operations.
- Revoke obsolete access.

**Owner:** Cloud and security domains.

### 9.15 Network exposure is too broad

**Risk:** Internal services, databases, administrative interfaces, or observability endpoints are publicly reachable.

**Impact:** Unauthorized access, data exposure, or service compromise.

**Mitigation:**

- Review public ingress.
- Restrict egress and service-to-service access.
- Validate firewall and routing rules.
- Limit administrative endpoints.
- Monitor relevant access events.
- Reassess network rules after topology changes.

**Owner:** C-M04 PRODUCTION and security domain.

### 9.16 Certificate expiry or trust failure

**Risk:** Production certificates expire, renewal fails, or trust configuration becomes invalid.

**Impact:** Users or services cannot establish secure connections.

**Mitigation:**

- Automate renewal where supported.
- Monitor expiry and renewal outcomes.
- Validate trust chains.
- Document rotation and recovery.
- Test certificate failure diagnostics.
- Restrict private-key access.

**Owner:** Cloud and security domains.

### 9.17 Deployment provenance is missing

**Risk:** Production deploys an untraceable artifact or a mutable reference whose contents cannot be established.

**Impact:** Supply-chain risk and inability to reproduce or investigate a release.

**Mitigation:**

- Use approved artifacts.
- Record immutable artifact references where supported.
- Capture source and configuration revisions.
- Verify required provenance or integrity evidence.
- Retain deployment records.
- Restrict deployment identities.

**Owner:** Artifact and cloud deployment owners.

### 9.18 Production pipeline is overprivileged

**Risk:** CI/CD credentials can bypass required gates or mutate unrelated production resources.

**Impact:** Unauthorized release, destructive changes, or broad compromise.

**Mitigation:**

- Scope deployment identities.
- Enforce the approved release process.
- Separate staging and production credentials.
- Require appropriate approval.
- Record deployment outcomes.
- Review pipeline permissions.

**Owner:** Cloud, security, and release-process owners.

### 9.19 Rollback is unsafe or incomplete

**Risk:** Rollback restores an application revision without accounting for schema changes, external side effects, or incompatible state.

**Impact:** Service remains broken or data becomes inconsistent.

**Mitigation:**

- Define abort criteria.
- Validate application and schema compatibility.
- Separate application rollback from database rollback.
- Document forward recovery.
- Verify data consistency after recovery.
- Assign decision authority.

**Owner:** Cloud deployment, backend, and database domains.

### 9.20 Monitoring fails to detect an outage

**Risk:** Infrastructure dashboards or alerts omit a critical failure mode or are not routed to an accountable operator.

**Impact:** An outage persists without timely detection or response.

**Mitigation:**

- Map alerts to critical service paths.
- Test representative alert conditions.
- Assign an owner and escalation path.
- Monitor alert delivery.
- Review thresholds against service objectives.
- Include failover and recovery signals.

**Owner:** Cloud and operational owners.

### 9.21 Alert fatigue hides critical events

**Risk:** Excessive or non-actionable alerts overwhelm operators.

**Impact:** Critical incidents are missed or response is delayed.

**Mitigation:**

- Define actionable severity levels.
- Deduplicate where supported.
- Assign clear ownership.
- Review false-positive patterns.
- Validate escalation.
- Retire alerts that have no useful action or owner.

**Owner:** Operational and observability owners.

### 9.22 Application health is confused with infrastructure health

**Risk:** Healthy infrastructure is interpreted as proof that application workflows are correct.

**Impact:** Go-live proceeds despite broken business or service behavior.

**Mitigation:**

- Separate infrastructure checks from application acceptance.
- Require service-owner validation.
- Verify critical workflows through approved tests.
- Review application-level indicators.
- Ensure go-live approval considers all required domains.

**Owner:** Service owners and designated go-live authority.

### 9.23 Production and staging configuration diverge unexpectedly

**Risk:** Production configuration differs from the validated staging configuration without a documented reason.

**Impact:** Integration or deployment defects appear during go-live.

**Mitigation:**

- Review the C-M03 STAGING (P4-P7) parity assessment.
- Record production-specific differences.
- Validate production overrides.
- Compare infrastructure revisions.
- Document remaining limitations.
- Require relevant owner review.

**Owner:** Cloud domain and service owners.

### 9.24 Recovery environment is not secure or available

**Risk:** Recovery infrastructure lacks required identities, secrets, network access, capacity, or approved artifacts.

**Impact:** DR cannot complete when needed or introduces a security exposure.

**Mitigation:**

- Include recovery resources in readiness checks.
- Validate recovery access.
- Verify artifact availability.
- Protect recovery secrets.
- Exercise endpoint cutover.
- Include recovery capacity and quota assumptions.

**Owner:** C-M04 PRODUCTION and security domain.

### 9.25 Recovery procedures depend on undocumented knowledge

**Risk:** Recovery requires knowledge or access held by an unavailable individual.

**Impact:** Recovery is delayed or cannot be completed within approved objectives.

**Mitigation:**

- Document executable runbooks.
- Assign primary and backup ownership where required.
- Verify operator access.
- Exercise procedures with designated operators.
- Record prerequisites and escalation paths.
- Keep recovery evidence accessible.

**Owner:** Cloud and operational owners.

### 9.26 Recovery actions destroy evidence

**Risk:** Restoration or rollback removes logs, audit records, or deployment evidence needed to investigate the incident.

**Impact:** Root cause remains unknown and future recovery is less reliable.

**Mitigation:**

- Define evidence preservation before destructive recovery.
- Separate operational state from retained evidence.
- Restrict deletion privileges.
- Record recovery actions and timestamps.
- Verify evidence retention after exercises.

**Owner:** Cloud, security, and operational owners.

### 9.27 External dependency outage interrupts production

**Risk:** A required identity, messaging, storage, vendor, or external integration service becomes unavailable.

**Impact:** Critical workflows fail despite healthy local infrastructure.

**Mitigation:**

- Identify critical dependencies.
- Document failure behavior.
- Monitor dependency availability.
- Define timeouts and escalation with service owners.
- Assess fallback or degraded modes where appropriate.
- Include dependency failures in recovery planning.

**Owner:** Relevant service and integration owners, with cloud support.

### 9.28 Production data is insufficiently protected

**Risk:** Storage, backups, database access, or recovery procedures fail to preserve the required production data.

**Impact:** Data exposure, corruption, or irreversible loss.

**Mitigation:**

- Apply approved encryption and access controls.
- Separate routine workload and recovery privileges.
- Validate backup coverage.
- Exercise restoration.
- Review retention and deletion controls.
- Require data-owner validation.

**Owner:** Security, database, storage, and cloud domains.

### 9.29 Infrastructure drift weakens production controls

**Risk:** Manual changes alter network rules, privileges, capacity, or recovery settings without review.

**Impact:** Security and availability assumptions become invalid.

**Mitigation:**

- Detect or review drift.
- Classify material changes.
- Reconcile emergency changes.
- Review security- and recovery-sensitive settings.
- Retain change records.
- Require explicit disposition for unavoidable deviations.

**Owner:** C-M04 PRODUCTION.

### 9.30 Patch or maintenance activity causes an outage

**Risk:** Runtime, operating-system, managed-service, or infrastructure updates are applied without adequate validation or recovery planning.

**Impact:** Production downtime, incompatibility, or security exposure.

**Mitigation:**

- Define supported versions and patch ownership.
- Review maintenance impact.
- Use controlled deployment procedures.
- Validate health after changes.
- Preserve recovery options.
- Record emergency patches and reconcile configuration.

**Owner:** Cloud and relevant service owners.

### 9.31 Go-live occurs without complete authorization

**Risk:** Infrastructure deployment proceeds despite missing application, security, data, operational, business, or safety approval.

**Impact:** Unsafe or incomplete service activation.

**Mitigation:**

- Identify the designated go-live authority.
- Define required evidence and gates.
- Verify approval references.
- Record unresolved risks.
- Block cutover when required approvals are missing.
- Keep physical safety approval separate from cloud readiness.

**Owner:** Designated release and business authorities, with C-M04 execution support.

### 9.32 Cutover causes unexpected traffic or data behavior

**Risk:** DNS, routing, traffic transition, or application state changes produce unexpected behavior during go-live.

**Impact:** Failed requests, inconsistent state, or service interruption.

**Mitigation:**

- Document the cutover sequence.
- Validate endpoint configuration.
- Define traffic transition and verification.
- Establish abort criteria.
- Monitor critical indicators.
- Maintain an approved rollback or forward-recovery path.

**Owner:** Cloud and application service owners.

### 9.33 Go-live observation is too short or incomplete

**Risk:** The deployment is declared successful before representative production behavior is observed.

**Impact:** Latent failures appear after formal launch.

**Mitigation:**

- Define an observation period appropriate to the release risk.
- Monitor agreed infrastructure and service indicators.
- Assign reviewers.
- Define escalation and abort conditions.
- Record the final observation outcome.
- Avoid treating pipeline completion as proof of stable operation.

**Owner:** Operational and service owners.

### 9.34 Production quotas are exhausted

**Risk:** Cloud quota, database connections, storage, or external service limits are reached unexpectedly.

**Impact:** New workloads cannot start, requests fail, or recovery operations cannot complete.

**Mitigation:**

- Inventory relevant quotas.
- Monitor usage and growth.
- Include failover and DR capacity.
- Define alert thresholds.
- Plan quota changes in advance.
- Record constraints that affect recovery objectives.

**Owner:** C-M04 PRODUCTION and relevant service owners.

### 9.35 Production operations lack clear ownership

**Risk:** Alerts, recovery actions, access review, or maintenance have no accountable owner.

**Impact:** Incidents are delayed or changes are performed without adequate authorization.

**Mitigation:**

- Assign owners to critical infrastructure functions.
- Define escalation paths.
- Review access and ownership periodically.
- Document runbooks.
- Validate operator access.
- Avoid single-person operational dependencies where practical.

**Owner:** Production operational leadership.

### 9.36 Audit or incident evidence is incomplete

**Risk:** Production deployment, access, change, backup, or recovery records are missing or inaccessible.

**Impact:** Incident investigation, accountability, and risk review are impaired.

**Mitigation:**

- Define evidence destinations and access roles.
- Retain required records.
- Verify evidence collection during exercises.
- Protect evidence from routine cleanup.
- Review traceability during acceptance.

**Owner:** Cloud, security, and operational owners.

### 9.37 Production cost grows beyond expectations

**Risk:** Redundancy, logging, backups, storage retention, or scaling causes unexpected costs.

**Impact:** Operational sustainability is weakened or protective controls are removed under pressure.

**Mitigation:**

- Document capacity and cost assumptions.
- Monitor major resource categories.
- Review retention and scaling policies.
- Set budget or usage alerts where supported.
- Assess cost changes before weakening resilience controls.
- Keep cost-driven deviations explicit and approved.

**Owner:** Cloud and business owners.

### 9.38 Staging evidence is overinterpreted

**Risk:** Passing C-M03 STAGING (P4-P7) checks is treated as proof of production HA, DR, security, or capacity.

**Impact:** Production-specific failure modes remain untested.

**Mitigation:**

- Identify staging evidence limitations.
- Require production-specific HA and DR exercises.
- Validate production permissions and configuration.
- Perform production deployment smoke checks.
- Document all remaining parity differences.

**Owner:** C-M04 PRODUCTION and relevant service owners.

### 9.39 Physical deployment safety is conflated with infrastructure readiness

**Risk:** Cloud readiness is used to imply that physical robot operation is safe.

**Impact:** Physical deployment may proceed without required hardware or safety validation.

**Mitigation:**

- Keep physical safety approval separate.
- Identify approved robot integration modes.
- Document infrastructure connectivity limits.
- Require the relevant P6 LAB & ROBOT and safety owners to authorize physical operation.
- Block claims of physical validation without direct evidence.

**Owner:** Lab, hardware, and safety owners.

### 9.40 Operational documentation becomes stale

**Risk:** Runbooks, recovery procedures, access assumptions, or infrastructure diagrams do not match deployed production configuration.

**Impact:** Operators follow unsafe or ineffective procedures during an incident.

**Mitigation:**

- Update documentation with material infrastructure changes.
- Review runbooks during recovery exercises.
- Record accepted changes in `CHANGELOG.md`.
- Verify operational links and access paths.
- Assign ownership for documentation maintenance.

**Owner:** C-M04 PRODUCTION milestone owner.

---

## 10. Exit criteria

C-M04 PRODUCTION may be declared complete only when production infrastructure is provisioned through the approved workflow, secured against unauthorized access, configured for the agreed availability and recovery objectives, observable, operationally owned, and ready for an authorized go-live.

Acceptance requires evidence that production resources are identifiable and isolated, deployments are traceable, required high-availability mechanisms have been validated, backup and restore procedures work, disaster recovery has been exercised to the agreed scope, and production operations have actionable runbooks and escalation paths.

Go-live requires an explicit authorization record and evidence that all required infrastructure, application, data, security, operational, and relevant safety gates have been satisfied.

Detailed pass/fail conditions and evidence requirements belong in `ACCEPTANCE_CRITERIA.md`. Review execution and evidence inspection belong in `REVIEW_CHECKLIST.md`.

### 10.1 Scope and ownership

- [ ] The implemented environment matches the scope defined in this dossier.
- [ ] C-M04 PRODUCTION owns production cloud infrastructure, HA, DR, operational readiness, and go-live infrastructure.
- [ ] C-M01 FOUNDATION (P0) remains authoritative for the shared cloud foundation.
- [ ] C-M02 DEVELOPMENT (P1-P3) remains authoritative for development infrastructure patterns.
- [ ] C-M03 STAGING (P4-P7) remains authoritative for staging infrastructure and parity evidence.
- [ ] Applicable frontend milestones remain authoritative for frontend behavior.
- [ ] Applicable backend milestones remain authoritative for service behavior.
- [ ] Applicable database milestones remain authoritative for schema, migrations, RLS, and data integrity.
- [ ] Artifact owners remain authoritative for artifact creation and provenance.
- [ ] Security owners remain authoritative for application trust and authorization policy.
- [ ] Lab and robot owners remain authoritative for physical integration and safety.
- [ ] Global development and release policies remain in their authoritative documents.
- [ ] Business and service owners approve relevant service objectives.
- [ ] Go-live authorization remains with the designated release and business authorities.
- [ ] Sibling task, acceptance, review, changelog, and Git procedure files are maintained separately.

### 10.2 Production boundary and access

- [ ] Production resources have an explicit and verifiable identity.
- [ ] The production resource inventory is complete for the accepted scope.
- [ ] Production resources are distinguishable from development and staging resources.
- [ ] Workload identities are scoped to their production functions.
- [ ] Administrative and deployment identities are distinct where required.
- [ ] Least-privilege permissions have been reviewed.
- [ ] Unapproved cross-environment mutation is denied.
- [ ] Public and internal endpoints follow the approved network policy.
- [ ] Privileged access is attributable, revocable, and reviewable.
- [ ] Destructive actions require explicit environment confirmation.
- [ ] Production secrets are not reused by development or staging by default.
- [ ] Access review and revocation procedures are documented.

### 10.3 Infrastructure as code and change control

- [ ] Persistent production resources are represented in version-controlled infrastructure definitions.
- [ ] Approved cloud foundation conventions are reused.
- [ ] Infrastructure provisioning and reconciliation are documented.
- [ ] Production changes are reviewed and attributable.
- [ ] Configuration revisions are recorded.
- [ ] Provisioning failures are reported clearly.
- [ ] Emergency changes are recorded and reconciled.
- [ ] Material drift can be detected or reviewed.
- [ ] Drift affecting security, availability, or recovery has an owner and disposition.
- [ ] Destructive infrastructure operations are guarded.
- [ ] Production configuration is not dependent on undocumented manual steps.

### 10.4 Network, routing, and TLS

- [ ] Production network topology matches the approved architecture.
- [ ] Required public and internal endpoints are identified.
- [ ] Network segmentation and access rules are verified.
- [ ] Ingress and egress paths are documented.
- [ ] Service discovery and DNS are configured.
- [ ] Unapproved public exposure is denied.
- [ ] Required service-to-service connectivity checks pass.
- [ ] Failure behavior for critical routing components is documented.
- [ ] Production TLS certificates validate against the intended trust model.
- [ ] Certificate renewal and rotation procedures are documented.
- [ ] Certificate expiry or renewal failures are observable.
- [ ] Private keys are not exposed through source control or logs.

### 10.5 Runtime and deployment

- [ ] Production runtime resources are provisioned.
- [ ] Runtime and artifact references are identifiable.
- [ ] Resource limits and scaling settings are documented.
- [ ] Health and readiness probes are configured.
- [ ] Required workload startup and restart behavior is verified.
- [ ] Production deployment uses the approved release workflow.
- [ ] Deployment identities have appropriate permissions.
- [ ] Required approval gates are enforced.
- [ ] Artifact and configuration revisions are recorded.
- [ ] Required artifact provenance or integrity checks are enforced.
- [ ] Deployment failures are visible and actionable.
- [ ] Post-deployment verification checks are repeatable.
- [ ] Rollback or forward-recovery procedures are documented.
- [ ] Database compatibility is considered before application rollback.

### 10.6 High availability

- [ ] Critical production components and their failure scenarios are identified.
- [ ] HA design matches approved service objectives.
- [ ] Required replica or failure-domain configuration is implemented.
- [ ] Critical ingress and routing failure behavior is assessed.
- [ ] Database HA and failover behavior are documented.
- [ ] Required storage and supporting dependency availability is assessed.
- [ ] Capacity during the agreed failure scenarios is understood.
- [ ] Relevant HA exercises have been executed.
- [ ] Failover outcomes and service interruption are recorded.
- [ ] Data implications and recovery actions are documented.
- [ ] HA claims are supported by evidence rather than configuration intent alone.
- [ ] Unresolved HA gaps are explicitly dispositioned.

### 10.7 Capacity and scaling

- [ ] Expected workload and peak assumptions are documented.
- [ ] Compute and memory capacity are documented.
- [ ] Database connections and storage capacity are assessed.
- [ ] Object storage and retention assumptions are documented.
- [ ] Queue and cache capacity are assessed where applicable.
- [ ] Relevant cloud and service quotas are identified.
- [ ] Scaling triggers and limits are documented.
- [ ] Failover and recovery headroom are considered.
- [ ] Capacity alerts are configured where required.
- [ ] Capacity claims have supporting measurements or justified assumptions.
- [ ] Material quota or capacity risks have owners and disposition.

### 10.8 Database and data protection

- [ ] Production database infrastructure is provisioned according to the approved design.
- [ ] Database access and workload identities are verified.
- [ ] Database schema and migration ownership remains with the database domain.
- [ ] Production migrations use the approved workflow.
- [ ] Migration status is recorded independently of application rollout.
- [ ] Database failover and connection recovery are assessed.
- [ ] Replication and consistency assumptions are documented.
- [ ] Backup scope and retention are approved.
- [ ] Backup encryption and access controls are verified where required.
- [ ] Backup execution is observable.
- [ ] A representative restore exercise has succeeded.
- [ ] Restored data has been validated by the relevant data owner.
- [ ] Object storage access and durability configuration are verified.
- [ ] Backup and restore claims are supported by evidence.

### 10.9 Disaster recovery

- [ ] DR scope and covered failure scenarios are documented.
- [ ] The recovery environment and required dependencies are identified.
- [ ] RTO and RPO targets are approved for the agreed scope.
- [ ] Backup and replication assumptions are documented.
- [ ] Recovery access and credentials are available to authorized operators.
- [ ] Infrastructure and data restoration order is documented.
- [ ] Endpoint or traffic cutover procedure is documented.
- [ ] Required DR exercises have been executed.
- [ ] Recovery elapsed time is recorded.
- [ ] The recovered data point is recorded.
- [ ] Restored data and service readiness are validated.
- [ ] Measured results are compared with approved RTO and RPO.
- [ ] Gaps have an owner and an explicit disposition.
- [ ] Recovery procedures preserve required evidence.
- [ ] Return-to-primary behavior is documented where applicable.

### 10.10 Observability and incident response

- [ ] Infrastructure health and resource utilization are observable.
- [ ] Routing, database, storage, and supporting dependency health are observable.
- [ ] Deployment outcomes are recorded.
- [ ] Backup and recovery outcomes are observable.
- [ ] Certificate, DNS, and relevant security events are observable.
- [ ] Critical alerts have an owner and escalation path.
- [ ] Representative alert delivery has been tested.
- [ ] Operators have documented diagnostic access.
- [ ] Infrastructure runbooks exist for critical failure scenarios.
- [ ] Incident response and escalation are integrated with the approved operational process.
- [ ] Application correctness is not inferred solely from infrastructure health.
- [ ] Required evidence is retained and protected from routine cleanup.

### 10.11 Security and maintenance

- [ ] Production infrastructure security review is complete for the accepted scope.
- [ ] Network exposure and segmentation have been reviewed.
- [ ] Workload and administrative permissions have been reviewed.
- [ ] Secret management and access have been reviewed.
- [ ] TLS and certificate lifecycle controls have been reviewed.
- [ ] Database, storage, and backup access controls have been reviewed.
- [ ] Deployment identity and artifact trust controls have been reviewed.
- [ ] Required audit records are available.
- [ ] Infrastructure patching and maintenance ownership are documented.
- [ ] Supported runtime versions are identified.
- [ ] Emergency patch procedures are documented.
- [ ] Unresolved security findings have authorized dispositions.
- [ ] Compliance claims remain with the applicable security and business owners.

### 10.12 Go-live readiness

- [ ] The release candidate and artifact references are approved and traceable.
- [ ] Production infrastructure revision is known.
- [ ] Required database migrations are complete and verified.
- [ ] Required frontend and backend application acceptance is available.
- [ ] Required infrastructure readiness checks pass.
- [ ] Required smoke checks pass.
- [ ] Monitoring and alerting are operational.
- [ ] Backup and restore readiness is evidenced.
- [ ] HA and DR evidence matches the approved go-live scope.
- [ ] Production access and operational ownership are established.
- [ ] Runbooks and escalation paths are available to designated operators.
- [ ] Staging deviations relevant to production have been reviewed.
- [ ] Blocking risks are resolved or explicitly dispositioned by authorized owners.
- [ ] Required security approval is recorded.
- [ ] Relevant lab or robot safety approval is recorded when physical operations are involved.
- [ ] The designated go-live authority is identified.
- [ ] The go-live authorization record is available.
- [ ] Infrastructure readiness is not treated as the sole go-live authorization.

### 10.13 Cutover and post-deployment verification

- [ ] The cutover sequence and required approvals are documented.
- [ ] Traffic transition or endpoint activation is controlled.
- [ ] Abort conditions are explicit.
- [ ] Rollback or forward-recovery authority is explicit.
- [ ] Deployed artifact and configuration revisions are verified.
- [ ] Required service and dependency checks pass.
- [ ] Database migration status is verified.
- [ ] Relevant infrastructure and service indicators are reviewed.
- [ ] Critical alert state is reviewed after deployment.
- [ ] A defined post-go-live observation period is completed.
- [ ] Observation results are recorded.
- [ ] Any rollback or recovery action is recorded.
- [ ] Unresolved post-deployment risks have owners and dispositions.

### 10.14 Operational ownership and handoff

- [ ] Critical infrastructure functions have assigned owners.
- [ ] Routine deployment ownership is documented.
- [ ] Incident response ownership is documented.
- [ ] Backup, restore, and DR ownership is documented.
- [ ] Administrative and recovery access is documented.
- [ ] Access review and revocation procedures are documented.
- [ ] Operational runbooks are available and current.
- [ ] Recovery prerequisites and escalation paths are explicit.
- [ ] Infrastructure drift procedures are documented.
- [ ] Production change records are retained.
- [ ] The production handoff package is complete.
- [ ] Operators can identify how to deploy, monitor, diagnose, recover, and escalate.

### 10.15 Documentation and traceability

- [ ] Production topology and resource boundaries are documented.
- [ ] Infrastructure definitions and revisions are identifiable.
- [ ] Network, TLS, identity, and secret assumptions are documented.
- [ ] HA design and exercise evidence are available.
- [ ] Backup and restore procedures are documented.
- [ ] DR architecture, RTO, and RPO evidence are available.
- [ ] Production alerting and operational runbooks are documented.
- [ ] Go-live, cutover, and recovery procedures are documented.
- [ ] Known limitations and accepted residual risks are recorded.
- [ ] Authoritative cloud architecture and security documents are linked.
- [ ] Global development and release policy documents are linked.
- [ ] `TASKS.md` contains the detailed task decomposition.
- [ ] `ACCEPTANCE_CRITERIA.md` contains detailed pass/fail conditions and evidence requirements.
- [ ] `REVIEW_CHECKLIST.md` contains review actions and evidence inspection.
- [ ] `CHANGELOG.md` contains accepted change history.
- [ ] `GIT_COMMIT_STEP.md` contains the repository and commit procedure.

### 10.16 Final milestone acceptance

C-M04 PRODUCTION is ready for formal acceptance when:

1. Production infrastructure is provisioned and reconciled through the approved workflow.
2. The production boundary, access controls, secrets, and network restrictions are verified.
3. Production deployments use approved and traceable artifacts.
4. Required runtime and dependency readiness checks pass.
5. HA mechanisms are configured and validated against the agreed failure scenarios.
6. Backup and restore procedures have been exercised and data restoration validated.
7. DR has been exercised to the agreed scope, with measured recovery results compared against approved RTO and RPO.
8. Production observability, alerts, incident response, and operational runbooks are available.
9. Capacity assumptions, quotas, and failover headroom are documented.
10. Production security findings have authorized dispositions.
11. Staging parity gaps relevant to production have been resolved or explicitly accepted.
12. Go-live procedures define approvals, cutover, observation, abort, and recovery.
13. The designated authority has explicitly authorized go-live.
14. Required post-deployment verification has passed.
15. Production ownership and operational handoff are complete.
16. Required acceptance and review evidence is available through the sibling files.
17. No unresolved issue invalidates a critical production security, availability, recoverability, or go-live invariant.

Acceptance of C-M04 PRODUCTION does not by itself establish application correctness, contractual service-level compliance, regulatory compliance, or physical robot safety. Those outcomes remain with the relevant service, business, security, data, hardware, and safety owners and require their own evidence and approvals.
