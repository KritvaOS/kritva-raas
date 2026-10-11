# Cloud Architecture

**Document:** `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`  
**Project:** Kritva RaaS  
**Status:** Architecture contract  
**Audience:** Cloud engineering, platform engineering, backend engineering, security, DevOps, SRE, and technical leadership  
**Normative language:** MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are used to express requirements.

## 1. Purpose

This document defines the deployable cloud implementation architecture for Kritva RaaS.

It translates the product and system cloud topology into concrete deployment resources, environment boundaries, cloud accounts and projects, network layouts, service-to-resource mappings, infrastructure-as-code (IaC) modules, provider-neutral interfaces, a chosen reference implementation, deployment sizing, scaling policies, and cost controls.

The architecture MUST support incremental delivery from development through staging to production without requiring a redesign of the deployment foundation at each stage.

The implementation MUST preserve clear boundaries between cloud infrastructure, application services, persistent data, external integrations, and operational tooling.

This document is an implementation architecture contract. It is not the authoritative definition of the product's cloud topology or the rationale for selecting system-level deployment boundaries.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns the concrete implementation of the Kritva RaaS cloud infrastructure, including:

- Cloud environment separation and promotion boundaries.
- Account, subscription, or project organization.
- Virtual private cloud (VPC) and equivalent network layouts.
- Subnets, routes, security groups, firewall rules, and private connectivity.
- Service-to-resource mapping for deployable application workloads.
- Infrastructure-as-code repository and module structure.
- Provider-neutral infrastructure interfaces and provider-specific implementations.
- The selected reference cloud implementation and its assumptions.
- Compute, database, storage, networking, messaging, and observability resource configuration.
- Environment-specific deployment sizing and capacity assumptions.
- Horizontal and vertical scaling policies.
- Availability, backup, recovery, and operational infrastructure settings.
- Infrastructure identity, secret integration, encryption settings, and access controls.
- Deployment configuration, infrastructure validation, and environment provisioning.
- Cloud cost estimation, budgets, allocation, and optimization controls.
- Cloud-specific conformance checks and infrastructure acceptance criteria.

### 2.2 System Architecture Ownership

`docs/architecture/CLOUD_ARCHITECTURE.md` owns the product/system cloud topology, including:

- The logical cloud topology and its rationale.
- System-level deployment boundaries and trust zones.
- The relationship between cloud services, robot-side systems, operators, and external actors.
- Logical connectivity and communication paths.
- System-level availability, isolation, and failure-domain objectives.
- Architectural rationale for service placement and system-level interaction boundaries.

This document MUST link to that system architecture for topology rationale rather than duplicating its definitions.

When a concrete cloud implementation decision appears to conflict with the system topology, the system topology MUST be treated as authoritative. The implementation discrepancy MUST be resolved through an explicit architecture change rather than an undocumented exception.

### 2.3 Other Document Ownership

The following documents own adjacent concerns:

| Concern | Authoritative document |
|---|---|
| Product/system cloud topology and rationale | `docs/architecture/CLOUD_ARCHITECTURE.md` |
| System backend modules and ownership | `docs/architecture/BACKEND_ARCHITECTURE.md` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| Wire-level API contract | `docs/protocol/API_CONTRACT.md` |
| Event contract and event semantics | `docs/protocol/EVENT_CONTRACT.md` |
| Artifact contract and manifest format | `docs/protocol/ARTIFACT_MANIFEST.md` |
| Database schema and migration ownership | `docs/database/architecture/` and the applicable database milestone dossiers |
| Frontend architecture and implementation | `docs/frontend/` |
| Phase definitions | `planning/PHASES.md` |
| Cloud milestone scope and acceptance | `docs/cloud/milestones/` |
| Cross-discipline milestone scope | The applicable authoritative dossiers under `docs/**/milestones/` |
| Product security requirements | The applicable system security and security requirements documents |
| Application-level behavior and business rules | The relevant product, backend, and protocol contracts |

A directory reference identifies the document family responsible for the subject. It does not imply that every file in that directory has identical authority.

### 2.4 Explicit Non-Goals

This document MUST NOT redefine:

- Product capabilities or user workflows.
- The logical ownership of application modules.
- API routes, request or response schemas, or protocol compatibility rules.
- Event payloads, delivery semantics, or event ordering guarantees.
- Artifact content formats or artifact validation rules.
- Database business entities, canonical schemas, or application-level data ownership.
- Robot firmware architecture or real-time control responsibilities.
- Phase definitions or milestone scope.
- Product pricing, contractual commercial terms, or billing policy.

Cloud-specific configuration for a database, event broker, or application service belongs here; the canonical application contract for that component does not.

## 3. Architecture Principles

### 3.1 Repeatable Provisioning

Every cloud resource that can be managed through IaC SHOULD be provisioned through version-controlled IaC.

Manual console changes MUST NOT be the normal mechanism for creating or modifying durable infrastructure.

Any emergency manual change MUST be recorded, reviewed, and reconciled back into IaC.

### 3.2 Environment Isolation

Development, staging, and production MUST have explicit configuration and access boundaries.

Production data, credentials, and workloads MUST NOT be casually reused in development or staging.

The degree of account, project, or network isolation MUST increase with the sensitivity and impact of the environment.

### 3.3 Least Privilege

Workloads MUST receive only the permissions required for their operation.

Human administration, deployment automation, application runtime identity, and emergency access MUST be distinguishable.

Long-lived cloud credentials MUST NOT be embedded in source code, container images, or repository configuration.

### 3.4 Provider-Neutral Contracts

Application deployment definitions SHOULD depend on stable infrastructure capabilities rather than embedding provider-specific details throughout the application configuration.

Provider-neutral abstractions MUST NOT conceal important differences in consistency, availability, security, or failure behavior.

Provider-specific configuration MAY be exposed when a capability cannot be represented safely by a common interface.

### 3.5 Observable Operations

Every production workload MUST emit enough structured logs, metrics, and traces to support diagnosis and operational ownership.

Infrastructure health signals MUST be distinguishable from application health signals.

### 3.6 Cost-Aware Capacity

Initial resource sizes MUST be based on explicit assumptions and validated against measured workload behavior.

Production capacity MUST be increased based on utilization, latency, throughput, queue depth, and service-level objectives rather than unreviewed fixed overprovisioning.

### 3.7 Safe Promotion

A deployment MUST be promoted through the appropriate validation environments before production, except for a documented emergency procedure.

Promotion MUST preserve artifact identity and record the deployed version, configuration revision, and deployment result.

## 4. Reference Implementation

### 4.1 Selection

The reference implementation uses:

- AWS as the initial cloud provider.
- AWS Organizations for account separation.
- Amazon VPC for network isolation.
- Amazon ECS on AWS Fargate for containerized backend workloads.
- Amazon ECR for container images.
- Application Load Balancer for supported HTTPS ingress.
- Amazon RDS for PostgreSQL for relational persistence.
- Amazon S3 for object and artifact storage.
- Amazon SQS for asynchronous work queues where the applicable backend contract requires queue-based processing.
- Amazon ElastiCache for Redis only where a validated workload requires caching or ephemeral coordination.
- AWS Secrets Manager and AWS Systems Manager Parameter Store for secret and configuration management, respectively.
- Amazon CloudWatch for baseline logs, metrics, and alarms.
- AWS KMS for managed encryption keys.
- AWS Certificate Manager for supported TLS certificate management.
- Terraform as the initial IaC implementation.
- Git-based CI/CD with short-lived federated cloud access for infrastructure and application deployment.

These choices define a practical reference implementation, not a requirement that every listed service be provisioned in every environment.

The system topology in `docs/architecture/CLOUD_ARCHITECTURE.md` remains authoritative for where logical services belong and how they interact.

### 4.2 Reference Implementation Constraints

The initial implementation SHOULD favor managed services where they reduce operational burden without violating system requirements.

Kubernetes MUST NOT be introduced solely because it is a common cloud deployment pattern. It MAY be adopted later if measured requirements justify its operational cost and complexity.

A service MUST NOT receive a dedicated managed resource merely to mirror its source-code module boundary. Resource separation SHOULD be based on security, scaling, availability, lifecycle, data ownership, and operational needs.

The reference implementation MUST be replaceable incrementally. Provider-specific assumptions MUST be isolated in infrastructure modules, configuration, and adapter boundaries wherever practical.

### 4.3 Provider-Neutral Capability Model

Infrastructure modules SHOULD expose capability-oriented interfaces such as:

| Capability | Required behavior |
|---|---|
| Container runtime | Deploy versioned container images with controlled configuration and health checks |
| Relational persistence | Provide durable transactions, backups, access isolation, and migration support |
| Object storage | Store versioned or immutable objects as required by the artifact contract |
| Work queue | Support the delivery, retry, and dead-letter behavior required by the consuming workload |
| Secret storage | Supply authorized workloads with secrets without exposing values in logs or source control |
| Observability | Provide structured logs, metrics, alarms, and operational retention |
| Network ingress | Enforce approved entry points, TLS, and routing restrictions |
| Identity | Bind workload and human identities to narrowly scoped permissions |
| Encryption | Protect data at rest and in transit using approved mechanisms |

A provider-neutral interface MUST document behavioral requirements, not merely normalize resource names.

### 4.4 Portability Requirements

Provider portability is a design objective, not a claim of zero migration cost.

The following MUST remain independent of provider-specific resource identifiers where practical:

- Application business logic.
- API and event contracts.
- Artifact metadata and application-level validation.
- Database migration definitions.
- Deployment intent and environment promotion policy.
- Workload health semantics.
- Cost and capacity reporting inputs.

The following are expected to remain provider-specific in the reference implementation:

- IAM policy syntax and identity federation configuration.
- VPC routing and security group resources.
- Managed database and queue configuration.
- Load balancer listeners and target registration.
- Provider-specific observability resources.
- KMS key policies and service integrations.

A future provider implementation MUST satisfy the capability contract and pass the applicable conformance checks before replacing the reference implementation.

## 5. Environment Model

### 5.1 Canonical Environments

The cloud implementation uses three durable environments:

| Environment | Purpose | Canonical cloud milestone |
|---|---|---|
| Development | Integration, feature validation, and engineering testing | C-M02 DEVELOPMENT |
| Staging | Release-candidate validation, integration verification, and pre-production rehearsal | C-M03 STAGING |
| Production | Customer-facing workloads and production data | C-M04 PRODUCTION |

The shared cloud foundation is established under C-M01 FOUNDATION.

The canonical phase definitions are maintained in `planning/PHASES.md`. This document does not redefine phase scope.

### 5.2 Development

Development infrastructure MUST support frequent deployments, test data, isolated experimentation, and rapid recovery.

Development MAY use smaller compute sizes, reduced database capacity, shorter log retention, and lower availability configurations than production.

Development MUST NOT depend on production credentials.

Development MUST NOT contain unrestricted copies of production personal or customer-sensitive data.

Non-production resources SHOULD have automatic cleanup for temporary environments and abandoned resources, subject to retention and debugging requirements.

### 5.3 Staging

Staging MUST be sufficiently representative of production to validate deployment behavior, security controls, service integration, and operational procedures.

Staging SHOULD use the same infrastructure modules and service families as production.

Staging MAY use smaller resource sizes and reduced redundancy when those differences do not invalidate the test being performed.

Any material difference between staging and production MUST be documented and considered when evaluating test results.

Staging MUST use controlled test identities, synthetic data, or appropriately sanitized datasets.

### 5.4 Production

Production MUST have explicit access control, backup, monitoring, incident response, and change-management procedures.

Production infrastructure changes MUST be reviewed and traceable to an approved revision.

Production MUST use dedicated credentials, encryption configuration, and data stores.

Production resource deletion MUST require appropriate protection and review.

The production environment MUST not rely on development or staging services for its normal operation.

### 5.5 Ephemeral Environments

Ephemeral environments MAY be created for pull requests, integration tests, or short-lived experiments.

They MUST:

- Use isolated naming and resource boundaries.
- Avoid production data and production credentials.
- Have an explicit owner and expiry policy.
- Apply budget and quota controls.
- Be destroyed automatically or through a controlled cleanup process.
- Avoid creating public ingress by default.
- Avoid creating durable resources that outlive the environment unless explicitly approved.

Ephemeral environments MUST NOT become an undocumented fourth durable environment.

## 6. Account and Project Layout

### 6.1 Organization Structure

The AWS organization SHOULD separate production from non-production using dedicated accounts.

The recommended initial account layout is:

| Account | Purpose | Access posture |
|---|---|---|
| Management | Organization and billing administration | Restricted administrative access; no application workloads |
| Security | Central security findings and audit integration | Restricted security administration |
| Shared Services | Shared CI/CD integration, approved tooling, and shared operational services | Platform team controlled |
| Development | Development workloads and test resources | Engineering access under least privilege |
| Staging | Release-candidate workloads and validation | Restricted engineering and QA access |
| Production | Customer workloads and production data | Strongly restricted, audited access |

The Security and Shared Services accounts MAY be introduced incrementally if the initial operational scale does not justify them immediately. Production isolation MUST NOT be deferred.

### 6.2 Account Boundaries

The management account MUST NOT host normal application workloads.

Development identities MUST NOT have unrestricted administrative access to production.

Cross-account access MUST use explicit trust relationships and narrowly scoped roles.

Account-level service quotas SHOULD be reviewed before a new environment is activated.

Centralized billing MUST preserve the ability to attribute costs to the owning environment and workload.

### 6.3 Account Naming

Account names SHOULD use stable, environment-oriented identifiers.

Resource names MUST NOT rely on account display names for uniqueness.

The canonical environment identifier SHOULD be one of:

- `dev`
- `staging`
- `prod`

The exact account IDs MUST be maintained in protected environment configuration and MUST NOT be hard-coded into reusable application modules.

### 6.4 Region Strategy

The initial deployment SHOULD use one primary AWS region selected according to latency, service availability, regulatory requirements, and cost.

The primary region MUST be configurable through the deployment environment rather than embedded in application source code.

Disaster recovery in a second region SHOULD be introduced when recovery objectives, business impact, or customer commitments justify the additional cost and operational complexity.

A second region MUST NOT be treated as operationally ready until replication, access, recovery automation, and failover procedures have been tested.

## 7. Network Architecture Implementation

### 7.1 VPC Strategy

Each durable environment MUST have an explicitly managed network boundary.

Development, staging, and production SHOULD use separate VPCs.

Production MUST NOT share application subnets or security groups with non-production environments.

CIDR allocations MUST be planned to avoid conflicts with corporate networks, robot connectivity networks, VPNs, and future private connectivity.

The exact logical topology and trust-zone rationale are owned by `docs/architecture/CLOUD_ARCHITECTURE.md`.

### 7.2 Subnet Layout

The reference VPC SHOULD use multiple Availability Zones where supported by the selected region and service.

The baseline subnet categories are:

| Subnet category | Intended resources | Publicly reachable |
|---|---|---|
| Public ingress | Approved internet-facing load balancers and controlled network egress components | Only explicitly approved ingress resources |
| Private application | ECS tasks and application workloads | No direct inbound internet access |
| Private data | Relational databases and private data services | No direct inbound internet access |
| Private endpoints | Private service endpoints and supported internal integrations | No direct inbound internet access |

Subnets SHOULD be distributed across at least two Availability Zones for production services that require zone-level resilience.

Managed services that do not reside in customer-managed subnets MUST still be governed through explicit endpoint policies, resource policies, identity controls, and network rules where supported.

### 7.3 Routing and Egress

Public ingress MUST be restricted to approved endpoints.

Application tasks SHOULD use private subnets.

Outbound internet access MUST be limited to the destinations and protocols required by the workload.

Private service endpoints SHOULD be used for supported AWS services when they reduce exposure or materially improve security and cost predictability.

NAT gateway placement and count MUST be selected based on availability requirements, traffic patterns, and cost. Production egress MUST NOT introduce an undocumented single point of failure.

### 7.4 Security Groups and Firewall Rules

Security groups MUST follow a default-deny approach for inbound access.

Rules MUST reference known workload security groups or approved network ranges rather than broad address ranges whenever practical.

Database ingress MUST be restricted to authorized application or operational workloads.

Administrative access MUST use approved identity and access mechanisms. Direct public SSH access to application hosts MUST NOT be enabled as a normal operational path.

Unused rules MUST be removed.

### 7.5 Private Connectivity

Private connectivity to enterprise systems, development labs, or robot-related infrastructure MUST be introduced only when required by a defined integration.

Such connectivity MUST have explicit route ownership, identity controls, encryption, logging, and failure handling.

Publicly reachable robot endpoints MUST NOT be assumed as a default architectural requirement.

Cloud networking MUST NOT be treated as a replacement for robot-side safety controls or real-time communication guarantees.

## 8. Service-to-Resource Mapping

### 8.1 Mapping Rules

Every deployable service MUST map to:

- A versioned deployment definition.
- A runtime resource or managed service.
- A workload identity.
- A network policy.
- A configuration source.
- A logging and metrics destination.
- A health-check strategy.
- A scaling policy or explicit fixed-capacity rationale.
- An owner and operational runbook.

The table below defines infrastructure defaults. It does not redefine backend module ownership or product behavior.

### 8.2 Reference Mapping

| Workload or capability | Reference resource | Deployment requirements |
|---|---|---|
| HTTPS ingress | Application Load Balancer | TLS, approved listeners, access logging, health checks |
| Stateless backend API | ECS service on Fargate | Private subnets, health checks, bounded scaling |
| Background processing | ECS service on Fargate | Queue integration where required, graceful shutdown, retry limits |
| Scheduled jobs | EventBridge Scheduler with an approved task or job target | Explicit schedule, idempotent execution, failure visibility |
| Relational persistence | Amazon RDS for PostgreSQL | Private access, backups, encryption, migration control |
| Artifact and object storage | Amazon S3 | Restricted bucket policies, encryption, lifecycle policies |
| Asynchronous queue | Amazon SQS | Explicit retry and dead-letter policies |
| Optional cache | Amazon ElastiCache for Redis | Private access, bounded capacity, defined cache semantics |
| Container registry | Amazon ECR | Image scanning policy, lifecycle rules, immutable release tags where supported |
| Secrets | AWS Secrets Manager | Runtime retrieval, access restrictions, rotation plan |
| Non-secret configuration | Parameter Store or approved configuration mechanism | Versioned values, environment separation |
| Logs and metrics | Amazon CloudWatch | Structured logs, retention, alarms, cost controls |
| Encryption keys | AWS KMS | Key policy, rotation policy where supported, least privilege |
| TLS certificates | AWS Certificate Manager | Approved domain validation and renewal |
| Infrastructure state | Encrypted, access-controlled remote Terraform backend | Locking, versioning, restricted write access |

Not every service MUST use every listed resource. Optional resources MUST be introduced only when justified by an explicit workload requirement.

### 8.3 Runtime Separation

Stateless application workloads SHOULD be independently deployable when their scaling, availability, security, or release needs differ materially.

Small workloads MAY share an ECS service if their lifecycle and operational requirements are genuinely aligned.

The number of ECS services MUST NOT be determined solely by the number of application packages.

Long-running background workers MUST use an execution model that supports graceful shutdown, bounded retries, and observable failure.

### 8.4 Resource Ownership

Each durable resource MUST have an identifiable owner.

Resource tags SHOULD include:

- `Project`
- `Environment`
- `ManagedBy`
- `Owner`
- `CostCenter`
- `DataClassification`
- `Lifecycle`

Tag values MUST use a consistent naming convention.

Resource ownership MUST be available to operational and cost-reporting workflows without requiring interpretation of arbitrary resource names.

## 9. Infrastructure-as-Code Architecture

### 9.1 IaC Requirements

Terraform is the reference IaC tool.

All reusable infrastructure definitions MUST be version-controlled.

Production changes MUST be applied from reviewed and approved plans.

The infrastructure pipeline MUST detect unreviewed drift where supported and MUST provide a documented reconciliation procedure.

The use of Terraform does not remove the requirement to validate provider behavior, security settings, resource dependencies, and deletion effects.

### 9.2 Repository Layout

The recommended cloud infrastructure layout is:

    infra/
      README.md
      versions.tf
      providers.tf
      backend.tf
      modules/
        account-baseline/
        network/
        ingress/
        container-runtime/
        relational-database/
        object-storage/
        queue/
        cache/
        identity/
        secrets/
        observability/
        backup/
        cost-controls/
      environments/
        dev/
          main.tf
          variables.tf
          outputs.tf
          terraform.tfvars.example
        staging/
          main.tf
          variables.tf
          outputs.tf
          terraform.tfvars.example
        prod/
          main.tf
          variables.tf
          outputs.tf
          terraform.tfvars.example
      policies/
      scripts/
      tests/

The actual repository MAY place this structure under a dedicated infrastructure repository. The logical separation between reusable modules and environment composition MUST remain.

### 9.3 Module Responsibilities

Each module MUST have one coherent infrastructure responsibility.

A module SHOULD expose a small, documented interface.

Modules MUST NOT silently create unrelated resources or broad account-level permissions.

A module MUST document:

- Purpose and supported use cases.
- Required inputs and their constraints.
- Outputs and their stability expectations.
- Resources created and their lifecycle behavior.
- Security assumptions.
- Cost implications.
- Upgrade and migration considerations.
- Validation and test coverage.

### 9.4 Environment Composition

Environment configuration MUST compose reusable modules rather than duplicate their implementation.

Environment-specific values MUST be explicit.

Secrets MUST NOT be stored in plaintext Terraform variable files.

Environment configuration MUST distinguish safe defaults from values requiring explicit approval.

Production configuration MUST fail validation if mandatory security or recovery settings are absent.

### 9.5 Terraform State

Terraform state MUST be stored in a remote backend with encryption, access control, and versioning where supported.

State locking MUST be enabled through the selected backend mechanism.

State access MUST be limited to authorized infrastructure automation and administrators.

State files MUST NOT be committed to source control.

Sensitive state outputs MUST be treated as secrets even when Terraform marks them as sensitive.

Production state MUST be separated from non-production state.

State recovery procedures MUST be documented and tested.

### 9.6 Module Versioning

Reusable modules MUST be versioned or pinned to an immutable source revision for controlled deployments.

A production deployment MUST NOT consume an unpinned moving branch.

Breaking module changes MUST include a migration plan.

Provider and module upgrades MUST be tested in development and staging before production promotion, except under an approved emergency procedure.

### 9.7 Policy and Validation

Infrastructure changes SHOULD pass:

- Formatting and static validation.
- Provider and module version checks.
- Security policy checks.
- Resource naming and tagging checks.
- Network exposure checks.
- Encryption and backup checks.
- Cost and quota checks.
- Environment-specific policy checks.
- Plan review and approval.
- Applicable infrastructure integration tests.

A failed mandatory policy check MUST block deployment unless a documented, time-bounded exception has been approved by the appropriate owner.

## 10. Identity and Access Implementation

### 10.1 Human Access

Human cloud access MUST use federated identity or an approved equivalent.

Individual long-lived IAM user credentials SHOULD NOT be used for routine administration.

Production administrative access MUST be restricted to authorized personnel and logged.

Elevated privileges SHOULD be time-bounded where the available identity platform supports it.

### 10.2 Workload Identity

Each independently deployed workload SHOULD use a distinct IAM role when its permissions differ from other workloads.

ECS tasks MUST use task roles for application access to AWS resources.

Application permissions MUST NOT be granted through the underlying compute host identity as a shortcut.

Task execution permissions and application runtime permissions MUST remain distinct.

### 10.3 CI/CD Identity

CI/CD MUST use short-lived federated credentials where supported.

Deployment identities MUST be restricted by repository, branch, environment, and operation as applicable.

Build jobs MUST NOT receive production deployment permissions merely because they can build an image.

Production deployment permission MUST be isolated from untrusted pull-request execution.

### 10.4 Cross-Account Access

Cross-account roles MUST have explicit trust policies.

The source identity, target account, permitted operations, and audit expectations MUST be documented.

Wildcard permissions SHOULD be avoided and MUST be justified when unavoidable.

### 10.5 Secrets and Configuration

Secrets MUST be retrieved through an approved secret-management mechanism.

Secret values MUST NOT appear in:

- Source code.
- Container image layers.
- Terraform variable files committed to version control.
- Build logs.
- Application logs.
- Unredacted exception messages.
- Public artifacts.

Secret rotation MUST account for dependent workload behavior and connection lifecycles.

Non-secret configuration MAY be stored in a parameter service or version-controlled environment configuration, depending on sensitivity and change requirements.

## 11. Container Runtime and Deployment

### 11.1 Image Construction

Application images MUST be built through controlled CI.

Images SHOULD use minimal maintained base images.

Builds SHOULD be reproducible and MUST record the source revision and image digest.

Images MUST NOT contain production credentials or environment-specific secrets.

Dependency and image vulnerability scanning MUST be performed according to the project security policy.

### 11.2 Registry Policy

Amazon ECR is the reference image registry.

Images MUST be referenced by immutable digest for production deployment whenever the deployment mechanism supports it.

Mutable tags MAY be used for development convenience but MUST NOT be the sole production artifact identity.

Registry lifecycle rules MUST preserve deployed images and required rollback versions.

### 11.3 ECS Service Configuration

Each ECS service MUST define:

- Task CPU and memory.
- Container image reference.
- Task role and execution role.
- Network placement.
- Environment-specific configuration.
- Secret references.
- Container health checks.
- Logging configuration.
- Desired task count or scaling policy.
- Deployment failure behavior.
- Graceful shutdown behavior.
- Resource limits and timeout assumptions.

Services MUST run without requiring local persistent container storage unless a documented use case requires it.

### 11.4 Health Checks

Health checks MUST distinguish process liveness from readiness to serve requests where the runtime supports that distinction.

Readiness checks SHOULD validate only dependencies necessary for safe request handling.

A temporary failure of an optional downstream service MUST NOT automatically cause all instances to be marked unhealthy if the application can safely continue in a degraded mode.

Health-check intervals, timeouts, and thresholds MUST be selected to avoid both delayed detection and unnecessary restart loops.

### 11.5 Deployment Strategy

The reference deployment strategy SHOULD use rolling deployment with explicit health-based replacement.

Blue/green or canary deployment MAY be used where the workload's risk, traffic volume, or recovery requirements justify it.

Deployment configuration MUST define what constitutes success and failure.

A failed rollout MUST stop further promotion and provide actionable diagnostic evidence.

Automatic rollback SHOULD be enabled when the service and deployment mechanism support reliable health-based rollback.

### 11.6 Graceful Shutdown

Application workloads MUST handle termination signals.

Workers MUST stop accepting new work and complete, release, or safely requeue in-flight work according to the applicable processing contract.

Connection pools and external clients MUST be closed within the termination grace period.

The grace period MUST be long enough for the expected shutdown sequence but bounded to avoid stalled deployments.

## 12. Database and Persistent Storage Resources

### 12.1 Relational Database

Amazon RDS for PostgreSQL is the reference relational database service.

The cloud implementation MUST configure:

- Private network access.
- Encryption at rest.
- TLS for database connections where supported.
- Automated backups and retention.
- Explicit database and connection limits.
- Monitoring and alerting.
- Maintenance-window policy.
- Credential storage and rotation approach.
- Recovery and restore procedures.
- Resource protection for production.

Database schemas, canonical entities, migrations, and application data ownership remain governed by the database architecture and applicable database milestone dossiers.

### 12.2 Connection Management

Application connection pools MUST be bounded.

Maximum connection capacity MUST be calculated across all concurrently running tasks and background workers.

Autoscaling MUST account for database connection limits.

A service MUST NOT scale without considering its impact on database connection pressure.

Connection exhaustion MUST generate observable alerts and actionable diagnostic information.

### 12.3 Migration Execution

Schema migrations MUST be run through a controlled deployment step or approved migration job.

Multiple application instances MUST NOT independently race to apply the same migration.

Migration jobs MUST use narrowly scoped credentials.

Destructive schema changes MUST follow an expand-and-contract approach where compatibility with the currently deployed application requires it.

Rollback procedures MUST account for the possibility that a migration is not safely reversible.

### 12.4 Object Storage

Amazon S3 is the reference object-storage service.

Buckets MUST have public access blocked unless an explicitly approved product requirement establishes a safe alternative.

Buckets MUST use encryption and access policies appropriate to their data classification.

Artifact identity, manifest semantics, validation, and immutability requirements are owned by the artifact contract and related system documents.

Cloud storage configuration MUST implement those requirements without redefining them.

### 12.5 Object Lifecycle

Object lifecycle policies MUST reflect the retention requirements of each object class.

Temporary uploads, intermediate artifacts, logs, and durable customer artifacts SHOULD have distinct lifecycle rules when their retention needs differ.

Deletion policies MUST account for legal, contractual, audit, and recovery obligations.

Lifecycle expiration MUST NOT silently delete objects that are still referenced by durable application records.

### 12.6 Cache

Redis MUST be optional until a measured workload justifies it.

The application MUST remain correct if a cache entry expires or is evicted.

A cache MUST NOT become the sole durable source of truth unless an explicitly reviewed system design assigns it that role.

Cache capacity, eviction policy, connection limits, encryption, and network access MUST be configured for the actual workload.

## 13. Asynchronous Processing Resources

### 13.1 Queue Provisioning

Amazon SQS is the reference queue service where queue-based asynchronous processing is required by the backend design.

Queue provisioning MUST define:

- Queue purpose and owning workload.
- Message retention.
- Visibility timeout.
- Retry behavior.
- Dead-letter queue policy.
- Encryption configuration.
- Access policy.
- Queue-depth and failure alarms.
- Expected processing capacity.

The event contract and application processing semantics remain owned by the corresponding protocol and backend documents.

### 13.2 Retry and Dead-Letter Behavior

Retry settings MUST be bounded.

Visibility timeout MUST be compatible with the expected processing duration and worker behavior.

Repeatedly failing messages MUST be observable and routed to a dead-letter queue when appropriate.

Dead-letter messages MUST have a documented inspection and replay procedure.

Replay MUST respect idempotency and must not blindly repeat irreversible external actions.

### 13.3 Scheduled Work

Scheduled jobs SHOULD use a managed scheduler when its behavior matches the workload requirements.

Each scheduled job MUST have an explicit owner, schedule, time zone assumption, retry policy, failure destination, and monitoring strategy.

Jobs that can be triggered more than once MUST be idempotent or protected against duplicate effects.

Schedules MUST be environment-specific and MUST NOT unintentionally activate production work from non-production configuration.

## 14. Observability Resources

### 14.1 Logging

CloudWatch is the baseline logging destination.

Application logs SHOULD be structured and include stable correlation identifiers where available.

Logs MUST NOT contain secret values or unnecessary sensitive data.

Log groups MUST have explicit retention policies.

Production log retention MUST satisfy operational, audit, and applicable contractual requirements.

### 14.2 Metrics

Infrastructure metrics MUST cover, where applicable:

- CPU and memory utilization.
- Task count and task replacement.
- Request count and error rate.
- Request latency.
- Load balancer target health.
- Database CPU, storage, connections, and replication health where relevant.
- Queue depth, age of oldest message, and dead-letter count.
- Object storage usage and request behavior where relevant.
- Network throughput and egress cost.
- Deployment failures and rollback events.

Application-specific business metrics remain owned by the relevant service architecture and observability definitions.

### 14.3 Alarms

Production alarms MUST have an identified owner and an actionable response.

Alarms SHOULD focus on symptoms affecting service health, customer outcomes, capacity, security, or recovery.

Alarm thresholds MUST be calibrated using workload measurements where available.

Alarm changes MUST be reviewed to avoid alert fatigue and silent failure.

### 14.4 Distributed Tracing

Distributed tracing SHOULD be enabled for cross-service request paths when the overhead and data handling requirements are acceptable.

Trace context MUST be propagated consistently across supported synchronous and asynchronous boundaries.

Sensitive request content MUST NOT be captured merely to improve trace detail.

### 14.5 Audit and Security Logs

Cloud control-plane audit logging MUST be enabled for production accounts.

Audit records MUST be protected against unauthorized modification and deletion.

Security findings SHOULD be centralized into the approved security monitoring workflow.

Retention and access MUST be consistent with security policy and applicable obligations.

## 15. Availability, Backup, and Recovery

### 15.1 Availability Configuration

Production services MUST use availability configurations consistent with their approved service requirements.

Stateless services SHOULD span multiple Availability Zones when their availability objectives justify it.

Managed data services MUST use the approved backup and availability settings.

Single-AZ resources MAY be used for development or staging when the reduced availability is intentional and documented.

### 15.2 Backup Policy

Production persistent data MUST have an approved backup policy.

The policy MUST define:

- Backup frequency.
- Retention period.
- Encryption and access controls.
- Recovery point objective (RPO).
- Recovery time objective (RTO).
- Restore validation frequency.
- Responsible owner.
- Required evidence of successful restore tests.

Backups MUST be isolated from routine application write permissions where supported.

A successful backup job alone MUST NOT be treated as proof that recovery works.

### 15.3 Recovery Testing

Restore procedures MUST be tested periodically.

Recovery tests MUST verify data integrity, application compatibility, access controls, and the ability to resume service.

Recovery evidence MUST record the tested environment, recovery duration, observed data loss window, and unresolved issues.

A recovery design that has not been tested MUST be identified as unverified.

### 15.4 Disaster Recovery

Multi-region disaster recovery SHOULD be introduced when approved business requirements justify the additional infrastructure and operating cost.

The selected strategy MUST identify dependencies that cannot fail over automatically.

Failover MUST account for DNS, secrets, identity, database state, object storage, queue state, external integrations, and deployment artifacts.

Recovery procedures MUST prevent uncontrolled dual-writer operation or conflicting execution of irreversible jobs.

The system-level failure-domain rationale remains owned by `docs/architecture/CLOUD_ARCHITECTURE.md`.

## 16. Sizing and Capacity Planning

### 16.1 Sizing Principles

Initial sizing MUST be treated as a hypothesis to validate, not a guaranteed capacity commitment.

Sizing MUST consider:

- Expected request rate and concurrency.
- CPU and memory per task.
- Request and job duration.
- Database connection demand.
- Database storage growth.
- Object storage growth and retention.
- Queue arrival and processing rates.
- Network ingress and egress.
- Availability and recovery requirements.
- Peak-to-average workload ratio.
- Observed latency and error-rate objectives.

### 16.2 Initial Environment Sizing

The following is an initial planning baseline, not a final production capacity specification.

| Resource | Development | Staging | Production starting point |
|---|---|---|---|
| Stateless API tasks | 1 small task per service where practical | 1–2 tasks per service | At least 2 tasks for critical stateless services |
| Background workers | 0–1 task per required worker | 1 task per required worker | At least 1 task per required worker, with redundancy where required |
| PostgreSQL | Small single-AZ instance | Representative small instance; availability as needed | Multi-AZ deployment when required by availability objectives |
| Object storage | Environment-isolated bucket or prefix with strict policy | Environment-isolated storage | Dedicated production buckets and retention policies |
| Queue | Low-volume queue and dead-letter policy | Representative queue settings | Production queue and dead-letter configuration |
| Cache | Disabled unless needed | Disabled unless needed | Enabled only when justified by measurement |
| NAT and egress | Cost-optimized | Representative of test needs | Availability and cost balanced for production |
| Observability retention | Short, explicit retention | Release-validation retention | Retention based on operational and compliance requirements |

Exact CPU, memory, instance class, storage size, throughput, and task counts MUST be established using actual workload measurements and documented assumptions.

### 16.3 Load Testing

Load tests SHOULD establish:

- Sustainable request throughput.
- p50, p95, and p99 latency.
- Error rate under normal and peak load.
- CPU and memory saturation points.
- Database connection pressure.
- Queue backlog growth and drain rate.
- Object storage throughput where relevant.
- Recovery behavior after overload.

Production capacity SHOULD include a documented headroom policy based on the measured workload and its variability.

### 16.4 Capacity Review

Capacity MUST be reviewed when any of the following occurs:

- Sustained utilization approaches the approved threshold.
- Request latency or error rates breach service objectives.
- Queue backlog grows persistently.
- Database connections or storage approach operational limits.
- Customer or workload volume changes materially.
- A new service or expensive integration is introduced.
- Cost trends deviate materially from the approved forecast.

## 17. Scaling Strategy

### 17.1 Stateless Services

ECS service autoscaling SHOULD use CPU, memory, request load, or a suitable application metric.

Minimum and maximum task counts MUST be defined explicitly.

Scaling policies MUST account for startup time, dependency capacity, and deployment behavior.

Autoscaling MUST NOT be allowed to create unbounded cost or overwhelm downstream services.

### 17.2 Background Workers

Worker scaling SHOULD consider queue depth, age of the oldest message, processing latency, and downstream capacity.

Scaling MUST respect database connection limits and external service quotas.

Workers MUST use bounded concurrency where unrestricted concurrency could cause resource exhaustion or duplicate side effects.

### 17.3 Database Scaling

Database scaling SHOULD be driven by observed CPU, memory, storage, connection, and query-performance measurements.

Vertical scaling MAY be used before introducing more complex database architectures.

Read replicas MAY be introduced for validated read-scaling or recovery needs, provided the application handles the relevant consistency semantics.

Database connection pooling or proxying MAY be introduced when connection churn or connection count justifies it.

### 17.4 Storage Scaling

Object storage capacity SHOULD use managed scaling behavior where available.

Storage lifecycle policies MUST control unnecessary retention.

Database storage autoscaling MAY be enabled within an approved maximum capacity.

Capacity expansion MUST NOT be treated as a substitute for investigating leaks, runaway logs, or unexpected data growth.

### 17.5 Scaling Safety

Every autoscaling policy MUST have:

- A defined minimum and maximum.
- A documented target metric.
- A scale-out response expectation.
- A scale-in stabilization strategy.
- A downstream capacity check.
- A cost impact assessment.
- A validation method.

Scaling policies MUST be tested under representative load before production use.

## 18. Cost Controls and FinOps

### 18.1 Cost Attribution

All eligible resources MUST carry the approved project, environment, ownership, and cost-allocation tags.

Costs SHOULD be attributed by environment and major workload.

Shared infrastructure costs MUST have an explicit allocation approach.

Unallocated material costs MUST be reviewed rather than silently absorbed.

### 18.2 Budgets and Alerts

Budgets MUST be configured for production and non-production accounts.

Alerts SHOULD cover forecasted overspend as well as actual spend.

Budget alerts MUST identify a responsible owner or operational channel.

A budget alert MUST trigger investigation; it MUST NOT automatically terminate critical production workloads unless an explicitly approved policy establishes that behavior.

### 18.3 Cost Optimization

The cloud team SHOULD review:

- Idle or underutilized tasks.
- Overprovisioned database instances.
- NAT gateway data processing and cross-zone traffic.
- Unused load balancers and public addresses.
- Object storage retention and retrieval patterns.
- Log volume and retention.
- Data transfer and egress.
- Queue polling and unnecessary background work.
- Container image retention.
- Development and ephemeral environment lifetime.

Cost optimization MUST preserve security, availability, data integrity, and required recovery capabilities.

### 18.4 Non-Production Controls

Development and staging SHOULD use smaller resource classes where representative testing does not require production-equivalent capacity.

Non-production resources SHOULD be stopped or removed when idle if doing so does not invalidate active work or required evidence.

Ephemeral resources MUST have expiry policies.

Scheduled cleanup MUST exclude production and any resource explicitly protected from automated deletion.

### 18.5 Unit Cost Measurement

As the workload matures, the project SHOULD measure infrastructure cost against meaningful workload units, such as:

- Cost per active project.
- Cost per build.
- Cost per artifact stored.
- Cost per execution request.
- Cost per completed job.
- Cost per active customer or robot, where measurable and meaningful.

These are operational cost metrics. They do not define product pricing or commercial billing policy.

### 18.6 Cost Review Cadence

Cloud cost SHOULD be reviewed at least monthly and after significant architecture changes.

Reviews SHOULD compare actual spend against forecast, identify the largest drivers, and assign corrective actions.

Unexpected increases MUST be investigated for workload growth, configuration changes, data transfer, retries, resource leaks, or anomalous usage.

## 19. Security Configuration

### 19.1 Encryption

Data MUST be encrypted in transit and at rest using approved mechanisms.

Managed-service encryption settings MUST be explicitly configured or verified against the required baseline.

Key policies MUST restrict access to authorized workloads and administrators.

Key rotation MUST follow the approved security policy and service capabilities.

### 19.2 Public Exposure

Public ingress MUST be limited to approved endpoints.

Databases, caches, internal worker tasks, and internal management interfaces MUST NOT have direct public access.

Storage buckets MUST block public access by default.

Any exception MUST document the business need, security controls, owner, and review date.

### 19.3 Image and Dependency Security

Container images MUST be scanned according to the project vulnerability-management policy.

Critical findings MUST block release unless an approved, time-bounded exception exists.

Base images and dependencies MUST be updated through a controlled process.

Runtime privileges SHOULD be reduced to the minimum required.

### 19.4 Infrastructure Security Findings

Security findings MUST have severity, ownership, remediation status, and a target response time according to the security policy.

Infrastructure exceptions MUST be recorded with rationale and expiry or review date.

A temporary exception MUST NOT silently become a permanent baseline.

### 19.5 Data Classification

Resources MUST be configured according to the classification of the data they store or process.

The data owner MUST determine retention and access requirements in the applicable system and data documents.

This document translates those requirements into cloud resource policies; it does not establish the canonical classification of application data.

## 20. Configuration and Environment Promotion

### 20.1 Configuration Separation

Each environment MUST have explicit configuration.

Non-secret configuration SHOULD be version-controlled when doing so is safe and practical.

Secret values MUST be supplied through approved secret-management facilities.

Production configuration changes MUST be reviewed and traceable.

### 20.2 Immutable Deployment Identity

A release MUST identify the application revision, image digest, infrastructure revision, and relevant configuration revision.

Promotion SHOULD reuse the same built image across environments.

Environment-specific behavior MUST be supplied through controlled configuration rather than by rebuilding an otherwise identical application image for each environment.

### 20.3 Promotion Gates

Promotion MUST verify the applicable build, test, security, configuration, and deployment checks.

Production promotion MUST require explicit authorization according to the release policy.

Failed validation MUST block normal promotion.

Emergency deployment procedures MUST be documented and audited.

### 20.4 Drift Detection

Infrastructure drift SHOULD be detected automatically.

Drift MUST be classified as expected, emergency, or unauthorized.

Unauthorized drift MUST be reconciled through IaC.

Emergency changes MUST be captured in the source-controlled configuration as soon as practical.

## 21. Operational Readiness

### 21.1 Required Operational Artifacts

Each production workload MUST have:

- A named technical owner.
- A deployment procedure.
- A rollback or recovery procedure.
- Health and alert definitions.
- A dependency inventory.
- A backup and recovery reference where persistent data is involved.
- A capacity and scaling configuration.
- A cost attribution strategy.
- A security configuration review.
- A runbook for common failures.

### 21.2 Health and Readiness

Infrastructure health checks MUST be defined independently from application-level business success.

Application readiness semantics are owned by the backend and system architecture documents.

Cloud health checks MUST use those semantics rather than inventing new application states.

### 21.3 Incident Response

Production incidents MUST preserve relevant logs, metrics, traces, deployment history, and cloud audit evidence.

Operational procedures SHOULD support isolation, rollback, recovery, and safe restoration of service.

Incident response MUST NOT rely on undocumented console actions as the only recovery mechanism.

### 21.4 Maintenance

Maintenance windows and managed-service upgrade policies MUST be configured according to environment requirements.

Production maintenance MUST consider workload impact, dependency compatibility, backup status, and rollback limitations.

Urgent security upgrades MAY use an expedited procedure with appropriate review and audit.

## 22. Infrastructure Testing and Conformance

### 22.1 Static Validation

Every IaC change MUST pass syntax, formatting, and provider validation checks.

Validation MUST use pinned provider versions or an explicitly reviewed upgrade.

### 22.2 Security Tests

Automated tests SHOULD verify:

- No unintended public database or cache access.
- No public object storage access by default.
- Required encryption settings.
- Required production backups.
- Restricted administrative access.
- Least-privilege workload policies.
- Required logging and audit configuration.
- Required environment and ownership tags.
- Production resource protection.
- Approved network ingress and egress.

### 22.3 Integration Tests

Representative integration tests SHOULD verify:

- Workload deployment and health-check behavior.
- Database connectivity and migration execution.
- Object storage authorization and lifecycle configuration.
- Queue processing and dead-letter behavior where applicable.
- Secret retrieval through workload identity.
- Log and metric delivery.
- Deployment failure handling and rollback.
- Recovery from a supported service interruption.

### 22.4 Cost and Quota Tests

Infrastructure plans SHOULD be reviewed for material cost changes.

Automated checks SHOULD detect unapproved high-cost resource classes, unexpectedly public resources, and quota-sensitive changes.

A plan that exceeds an approved budget threshold MUST require explicit review before application.

### 22.5 Acceptance Evidence

Evidence MUST include the IaC revision, plan result, validation output, security check results, environment, and deployment outcome.

Production acceptance MUST also confirm backup, monitoring, access control, and recovery readiness as applicable.

## 23. Failure Handling

### 23.1 Resource Provisioning Failure

Provisioning failures MUST leave the environment in a diagnosable state.

Retries MUST be bounded and safe.

Partially created resources MUST be identified and reconciled through IaC rather than deleted blindly.

### 23.2 Workload Deployment Failure

A failed workload deployment MUST prevent normal promotion.

The deployment system MUST retain sufficient evidence to identify the failed revision and relevant health signals.

Rollback MUST restore a known-good deployment configuration when safe and supported.

### 23.3 Dependency Failure

Cloud resource configuration MUST define appropriate timeouts, health checks, and failure alarms.

Application retry and degradation behavior remain owned by the application and protocol contracts.

Infrastructure MUST NOT assume that every downstream failure is transient.

### 23.4 Capacity Exhaustion

Capacity limits MUST be observable.

The cloud team MUST define escalation paths for quota exhaustion, database capacity limits, storage limits, and scaling failures.

Automatic retries MUST NOT amplify overload without bound.

### 23.5 Region or Availability-Zone Failure

Recovery behavior MUST match the approved availability and recovery objectives.

Automatic failover MUST be enabled only where the selected service and application semantics support it safely.

Manual failover procedures MUST specify prerequisites, authorization, validation, and restoration steps.

## 24. Phase and Milestone Traceability

The canonical phase definitions are owned by `planning/PHASES.md`. The following table maps cloud implementation work to the frozen cloud milestones; it does not redefine phase or milestone scope.

| Phase | Cloud milestone | Implementation emphasis |
|---|---|---|
| P0 FOUNDATION | C-M01 FOUNDATION | Account baseline, IaC state, identity foundations, naming, tagging, and initial security controls |
| P1 STUDIO | C-M02 DEVELOPMENT | Development environment, repeatable provisioning, CI integration, and baseline workload deployment |
| P2 BUILD & ARTIFACT | C-M02 DEVELOPMENT | Infrastructure support for build-related services and artifact storage according to authoritative system contracts |
| P3 CONTROL PLANE | C-M02 DEVELOPMENT | Development cloud resources for control-plane services and their managed dependencies |
| P4 BOOKING & COMMERCIAL | C-M03 STAGING | Staging infrastructure, environment isolation, release validation, and commercial-workload integration support |
| P5 EXECUTION | C-M03 STAGING | Staging capacity, asynchronous processing resources, and execution-workload validation |
| P6 LAB & ROBOT | C-M03 STAGING | Infrastructure support for applicable lab and robot integration validation |
| P7 LIVE & RESULTS | C-M03 STAGING | Live-workload integration, observability, results infrastructure, and operational rehearsal |
| P8 PRODUCTION | C-M04 PRODUCTION | Production isolation, availability, security, recovery, scaling, cost controls, and operational readiness |

The phase-to-milestone association MUST be interpreted alongside the authoritative dossiers under `docs/**/milestones/`.

The cloud implementation MUST NOT use this table to expand or replace the scope defined by those dossiers.

## 25. Architecture Decision and Change Control

### 25.1 Required Decision Records

A material cloud architecture decision SHOULD record:

- Context and constraints.
- Options considered.
- Selected option.
- Rationale.
- Security and reliability implications.
- Cost implications.
- Portability implications.
- Migration or rollback approach.
- Affected environments and milestones.
- Decision owner and review date.

### 25.2 Changes Requiring Review

Architecture review MUST be required for:

- Introducing a new cloud provider or region.
- Changing production account isolation.
- Introducing a new publicly reachable endpoint.
- Changing database availability or recovery configuration.
- Introducing a new persistent data service.
- Changing the IaC state or access model.
- Introducing Kubernetes or another materially different runtime.
- Changing the production deployment strategy.
- Introducing cross-account or cross-region data flows.
- Making a material change to expected operating cost.

### 25.3 System Topology Changes

If an implementation proposal changes logical service placement, trust boundaries, communication paths, or other system-level topology assumptions, the proposal MUST be reviewed against `docs/architecture/CLOUD_ARCHITECTURE.md`.

The system architecture document MUST be updated when its topology or rationale changes.

This implementation document MUST then record the corresponding concrete resource and deployment changes without duplicating the system-level rationale.

## 26. Implementation Checklist

### 26.1 Foundation

- [ ] Account and environment boundaries are documented.
- [ ] Production is isolated from non-production.
- [ ] IaC remote state is encrypted, access-controlled, and protected.
- [ ] Provider and module versions are pinned.
- [ ] Naming and tagging conventions are enforced.
- [ ] Workload and human identities are separated.
- [ ] Audit logging is enabled for production.
- [ ] Required security baselines are validated.

### 26.2 Networking

- [ ] VPC CIDR ranges are planned and non-conflicting.
- [ ] Public ingress is limited to approved resources.
- [ ] Application and data resources use private networking.
- [ ] Security group rules follow least privilege.
- [ ] Egress paths are documented and monitored.
- [ ] Private endpoints are used where justified.
- [ ] Cross-account and private connectivity paths are reviewed.

### 26.3 Workloads and Data

- [ ] Every workload has an explicit resource mapping.
- [ ] Container images are built and scanned through CI.
- [ ] Production deployments use immutable artifact identity.
- [ ] Database access, backups, and migrations are controlled.
- [ ] Object storage policies enforce access and retention requirements.
- [ ] Queue retry and dead-letter policies are configured where applicable.
- [ ] Secrets are retrieved through approved mechanisms.
- [ ] Runtime health checks and graceful shutdown are validated.

### 26.4 Operations and Cost

- [ ] Logs, metrics, alarms, and audit evidence are available.
- [ ] Production backup and recovery procedures are tested.
- [ ] Capacity assumptions are documented.
- [ ] Autoscaling limits and downstream constraints are configured.
- [ ] Budgets and cost alerts are active.
- [ ] Resource ownership and cost attribution are available.
- [ ] Deployment rollback and failure handling are tested.
- [ ] Operational runbooks and owners are identified.

### 26.5 Governance

- [ ] Cloud topology links to `docs/architecture/CLOUD_ARCHITECTURE.md`.
- [ ] Backend implementation links to `docs/backend/architecture/BACKEND_ARCHITECTURE.md`.
- [ ] API implementation links to `docs/backend/architecture/API_IMPLEMENTATION.md`.
- [ ] Protocol contracts remain authoritative for wire behavior.
- [ ] Phase definitions link to `planning/PHASES.md`.
- [ ] Cloud milestone acceptance follows the authoritative milestone dossiers.
- [ ] No duplicate system-level ownership or contract definitions have been introduced.

## 27. Definition of Done

The cloud implementation architecture is ready for implementation when:

1. The reference provider and deployment assumptions are explicitly documented.
2. The environment, account, network, and service-to-resource boundaries are clear.
3. IaC module responsibilities and environment composition are defined.
4. Provider-neutral capability boundaries are documented without concealing critical behavioral differences.
5. Identity, secrets, encryption, and network security requirements are specified.
6. Initial sizing, scaling, and cost-control mechanisms are defined.
7. Observability, backup, recovery, and operational-readiness requirements are testable.
8. Infrastructure validation and acceptance evidence are specified.
9. Ownership boundaries with system architecture, backend implementation, database architecture, protocol contracts, and milestone dossiers are explicit.
10. All phase and milestone references use the frozen canonical model.

This document defines the deployable cloud implementation architecture. System-level topology and its rationale remain owned by `docs/architecture/CLOUD_ARCHITECTURE.md`; implementation changes MUST preserve that ownership boundary.
