# C-M03 STAGING — Milestone Dossier

**Primary Phase:** P4 BOOKING & COMMERCIAL

**Supporting Phases:** P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE; P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS

**Domain:** Cloud Infrastructure

**Milestone:** C-M03 STAGING (P4-P7)

**Document Type:** Cloud milestone dossier

**Status:** Planning baseline

**Scope Authority:** This dossier defines the staging environment, deployment configuration, environment isolation, integration infrastructure, and production-parity requirements for P4 BOOKING & COMMERCIAL through P7 LIVE & RESULTS. Existing milestone dossiers under `docs/**/milestones/` are authoritative for their respective milestone scopes.

---

## Ownership and Boundaries

### What this document owns

This document owns the milestone-level objectives, scope boundaries, dependencies, deliverables, risks, and exit criteria for C-M03 STAGING.

C-M03 STAGING provides a controlled, repeatable, production-like environment in which the Kritva RaaS application can be integrated and validated before production deployment.

Its scope includes:

- Staging environment topology and isolation.
- Staging cloud account, project, subscription, or equivalent environment boundary.
- Staging network topology and connectivity.
- Environment-specific infrastructure configuration.
- Staging compute, container, and orchestration configuration.
- Staging database infrastructure provisioning and connectivity.
- Staging object storage and external service connectivity.
- Staging secrets and configuration injection mechanisms.
- Staging TLS certificates and internal service trust configuration.
- Deployment environments and release-candidate deployment targets.
- Infrastructure-as-code for staging-owned resources.
- Repeatable environment provisioning and teardown where safe.
- Service discovery, internal routing, and ingress configuration.
- Environment-specific DNS and endpoint configuration.
- Resource quotas, capacity baselines, and staging limits.
- Integration with CI/CD deployment workflows.
- Deployment identity and least-privilege infrastructure access.
- Health checks and infrastructure-level readiness probes.
- Infrastructure observability and staging operational diagnostics.
- Production-parity assessment and documented deviations.
- Failure isolation and controlled test-data boundaries.
- Integration-test infrastructure dependencies.
- Staging deployment smoke checks.
- Environment reset and recovery procedures within the staging scope.
- Promotion prerequisites and evidence needed by C-M04 PRODUCTION (P8).
- Documentation of infrastructure assumptions and known limitations.
- Cross-domain handoffs for database, backend, frontend, execution, lab, live, and results integration.

### What this document does not own

The following responsibilities belong to their authoritative documents and milestones:

- Canonical phase definitions: `docs/planning/PHASES.md`.
- Cross-domain architecture and system-level decisions: `docs/planning/DECISIONS.md` and `docs/architecture/`.
- Cloud architecture and system topology: `docs/architecture/CLOUD_ARCHITECTURE.md`.
- Cloud implementation architecture: `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.
- Cloud security architecture: `docs/cloud/architecture/SECURITY_ARCHITECTURE.md`.
- Global application trust boundaries, authentication, and authorization policy: `docs/architecture/SECURITY_ARCHITECTURE.md` and `docs/security/`.
- Cloud foundation, account structure, base networking, and shared infrastructure conventions: C-M01 FOUNDATION (P0).
- Development environment configuration and developer workflows: C-M02 DEVELOPMENT (P1-P3).
- Production infrastructure, production deployment, production hardening, and production operations: C-M04 PRODUCTION (P8).
- Frontend behavior, screens, client state, and user workflows: the applicable frontend milestones.
- Backend API behavior, business logic, orchestration, and application lifecycle semantics: the applicable backend milestones.
- PostgreSQL schema, migrations, transactions, indexes, RLS, and database integrity: the applicable database milestones.
- Job and run persistence: DB-M04 EXECUTION DATA (P5-P7).
- Booking and commercial persistence: DB-M03 BOOKING DATA (P4).
- Platform, resource, artifact, and storage metadata: DB-M02 CORE DATA (P3).
- Booking workflow and commercial service behavior: B-M04 BOOKING (P4).
- Artifact creation and build behavior: B-M02 ARTIFACT (P2-P3) and F-M03 BUILD & ARTIFACT (P2).
- Platform and resource service behavior: B-M03 PLATFORM (P3).
- Job submission, execution orchestration, and run control: B-M05 EXECUTION (P5).
- Lab Agent behavior and physical robot integration: P6 LAB & ROBOT and the applicable backend implementation owners.
- Live video and telemetry presentation: F-M06 LIVE (P7).
- Results service behavior: B-M06 RESULTS (P6-P7).
- Results presentation: F-M07 RESULTS (P7).
- Production application service behavior: B-M07 PRODUCTION (P8).
- Application API contracts and protocol definitions: `docs/protocol/`.
- Global developer setup and workflow: `docs/development/`.
- Global testing strategy: `docs/development/TESTING_STRATEGY.md`.
- Global release policy: `docs/development/RELEASE_PROCESS.md`.
- Database backup, recovery, and schema migration implementation: the applicable database and production owners.
- Telemetry acquisition, log generation, and result computation: the applicable service owners.
- Hardware safety, robot safety approval, and physical deployment authorization: the relevant safety and hardware owners.
- Product scope, commercial policy, and business acceptance: the product and commercial owners.

C-M03 STAGING provisions and operates the infrastructure required to validate those capabilities together. It does not absorb their application, data-model, product, or production ownership.

### Ownership map

| Concern | Authoritative owner | C-M03 STAGING responsibility |
|---|---|---|
| Canonical phase definitions | `docs/planning/PHASES.md` | Follow the frozen model exactly |
| System architecture | `docs/architecture/` | Implement approved infrastructure boundaries |
| Cloud topology | `docs/architecture/CLOUD_ARCHITECTURE.md` | Provide staging topology consistent with system architecture |
| Cloud implementation architecture | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` | Follow cloud implementation conventions |
| Cloud security architecture | `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` | Apply staging infrastructure security controls |
| Cloud foundation | C-M01 FOUNDATION (P0) | Reuse account, networking, and infrastructure conventions |
| Development infrastructure | C-M02 DEVELOPMENT (P1-P3) | Reuse development provisioning patterns where appropriate |
| Staging infrastructure | C-M03 STAGING (P4-P7) | Own staging-specific provisioning and configuration |
| Production infrastructure | C-M04 PRODUCTION (P8) | Receive staging evidence and own production deployment |
| Frontend application behavior | Applicable frontend milestones | Supply reachable staging endpoints and deployment targets |
| Backend application behavior | Applicable backend milestones | Supply runtime infrastructure and deployment configuration |
| Database schema and integrity | Applicable database milestones | Provision/connect staging database infrastructure |
| Artifact and storage metadata | DB-M02 CORE DATA (P3) | Provide required staging storage connectivity |
| Booking and commercial data | DB-M03 BOOKING DATA (P4) | Provide isolated staging database infrastructure |
| Execution data | DB-M04 EXECUTION DATA (P5-P7) | Provide database and storage connectivity |
| Booking service behavior | B-M04 BOOKING (P4) | Deploy and expose required service endpoints |
| Execution service behavior | B-M05 EXECUTION (P5) | Deploy and expose required service endpoints |
| Lab and robot integration | P6 LAB & ROBOT | Provide controlled staging connectivity where applicable |
| Live presentation | F-M06 LIVE (P7) | Provide required reachable endpoints and networking |
| Results service behavior | B-M06 RESULTS (P6-P7) | Deploy and expose required service endpoints |
| Results presentation | F-M07 RESULTS (P7) | Provide required frontend deployment target |
| Production service behavior | B-M07 PRODUCTION (P8) | Supply staging evidence for production handoff |
| Infrastructure as code | C-M03 STAGING (P4-P7) | Own staging-specific infrastructure definitions |
| CI/CD orchestration policy | Global development and release documents | Integrate staging deployment targets |
| Application test strategy | `docs/development/TESTING_STRATEGY.md` | Supply infrastructure needed for defined tests |
| Database schema and migrations | Database domain | Provision environment and connectivity only |
| Application secrets and authorization | Security and application owners | Supply secure configuration mechanisms and infrastructure controls |
| Production backup and recovery | C-M04 PRODUCTION (P8) and database owners | Document staging limitations and handoff requirements |
| Staging tasks | `TASKS.md` | Link to detailed work decomposition |
| Staging acceptance evidence | `ACCEPTANCE_CRITERIA.md` | Link to detailed pass/fail requirements |
| Staging review | `REVIEW_CHECKLIST.md` | Link to review actions |
| Staging change history | `CHANGELOG.md` | Link to accepted changes |
| Staging Git procedure | `GIT_COMMIT_STEP.md` | Link to repository and commit procedure |

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

C-M03 STAGING establishes a repeatable, isolated, observable, and production-like environment for integrated validation of the Kritva RaaS system across P4 BOOKING & COMMERCIAL, P5 EXECUTION, P6 LAB & ROBOT, and P7 LIVE & RESULTS.

The environment must support deployment of compatible application versions, connection to staging-specific dependencies, execution of integration and acceptance tests, diagnosis of failures, and collection of evidence for the production handoff.

The staging environment must resemble the intended production topology and security posture closely enough to expose integration and deployment defects before promotion. Where production equivalence is impractical or unsafe, the deviation must be explicit, justified, and testable.

C-M03 STAGING builds on C-M01 FOUNDATION (P0) and C-M02 DEVELOPMENT (P1-P3). It provides an integrated environment for the application and data capabilities owned by the frontend, backend, and database milestones.

### 1.1 Primary outcomes

C-M03 STAGING must deliver:

1. A dedicated staging environment with an explicit infrastructure boundary.
2. Repeatable provisioning from version-controlled infrastructure definitions.
3. Network segmentation and controlled service connectivity.
4. Environment-specific configuration and secret injection.
5. TLS and certificate handling appropriate to staging.
6. Deployment targets for the frontend and backend services.
7. Connectivity to staging databases, object storage, and other required dependencies.
8. Isolation from production data, credentials, and operational systems.
9. A documented production-parity model.
10. A documented list of approved differences from C-M04 PRODUCTION (P8).
11. Integration with the approved CI/CD deployment workflow.
12. Repeatable deployment of a known application revision.
13. Infrastructure readiness checks and deployment smoke checks.
14. Infrastructure-level observability and diagnostic access.
15. A safe process for staging resets and test-data cleanup.
16. Resource limits and cost controls appropriate to staging.
17. Evidence that core integration paths can be exercised in the environment.
18. A controlled handoff of environment assumptions and validation evidence to C-M04 PRODUCTION (P8).

### 1.2 Production-parity outcome

Production parity means that staging reproduces the important production deployment characteristics relevant to integration and release confidence.

It does not mean that staging must have identical scale, availability commitments, redundancy, cost, or external integrations.

The parity assessment must consider:

- Network and service topology.
- Container or runtime configuration.
- Service discovery and endpoint routing.
- TLS termination and internal transport security.
- Secret injection and identity boundaries.
- Database connectivity and migration workflow.
- Object storage integration.
- Queue, cache, or other shared dependencies where applicable.
- Application configuration and feature flags.
- Health checks and readiness behavior.
- Deployment and rollback mechanics.
- Logging, metrics, tracing, and diagnostic access.
- Resource limits and failure behavior.
- Access controls and environment isolation.

Every material difference must have an owner, rationale, impact assessment, and validation strategy.

### 1.3 Repeatability outcome

A developer or authorized automation must be able to provision or reconcile the staging environment using the documented and version-controlled process.

Manual console operations must not be the sole source of truth for persistent staging configuration.

Any unavoidable manual operation must be documented, access-controlled, and reflected in the environment's configuration record.

### 1.4 Integration outcome

Staging must allow the approved application services and data stores to interact using their defined contracts.

The environment must support representative flows across:

- Studio and project access.
- Artifact and build integration where enabled.
- Booking and commercial integration.
- Job submission and execution lifecycle.
- Lab or robot integration where the approved environment supports it.
- Live telemetry and log discovery.
- Results publication and retrieval.

These are environment-level integration objectives. The behavior and acceptance rules of each flow remain owned by the relevant frontend, backend, database, and lab milestones.

### 1.5 Security outcome

Staging must be isolated from production and use controlled access, environment-specific secrets, and least-privilege infrastructure identities.

Production credentials, production data, and production control paths must not be copied into staging without an explicitly approved and secure mechanism.

Staging must be safe to reset within its documented boundaries without affecting production systems or shared development environments.

### 1.6 Completion principle

C-M03 STAGING is complete when the environment can be provisioned and reconciled repeatably, application revisions can be deployed through the approved workflow, required dependencies are reachable, environment isolation is verified, and the production-parity assessment is documented.

Acceptance also requires representative smoke checks, observability sufficient to diagnose deployment failures, documented deviations from production, and an explicit handoff to C-M04 PRODUCTION (P8).

The existence of infrastructure resources alone is insufficient evidence of milestone completion.

Detailed pass/fail conditions belong in `ACCEPTANCE_CRITERIA.md`.

---

## 2. Scope and non-scope

### 2.1 In-scope capabilities

#### 2.1.1 Staging environment boundary

C-M03 must establish a clearly identifiable staging boundary within the cloud foundation.

The boundary may use a dedicated account, project, subscription, namespace, network, or a documented combination appropriate to the approved cloud architecture.

The chosen boundary must prevent accidental access to production resources and must support independent configuration, deployment, and controlled reset.

The implementation must document:

- Environment identifier.
- Cloud account or project boundary.
- Network and namespace boundaries.
- Environment-specific identities.
- Resource ownership and tagging.
- Access roles.
- Secret boundaries.
- Dependency endpoints.
- Data isolation expectations.
- Reset and cleanup limitations.

The boundary must be consistent with C-M01 FOUNDATION (P0) conventions.

#### 2.1.2 Environment topology

The staging topology must identify the infrastructure components needed for the integrated application.

Depending on the approved architecture, these may include:

- Frontend hosting.
- Backend application services.
- Ingress or gateway components.
- Internal service discovery.
- PostgreSQL or managed database services.
- Object storage.
- Queue or messaging services.
- Cache services.
- Observability services.
- External integration adapters.
- A controlled Lab Agent or simulator connection.
- Supporting identity or access services.

The topology must distinguish required components from optional integrations and explicitly identify components that are simulated in staging.

The topology document itself belongs to `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`; this milestone defines the staging-specific deployment and parity requirements.

#### 2.1.3 Infrastructure as code

Staging-owned infrastructure must be described in version-controlled infrastructure definitions.

The implementation must use the approved infrastructure tooling and conventions established by the cloud foundation.

The definitions must include, as applicable:

- Environment-specific variables.
- Network and routing resources.
- Compute or orchestration resources.
- Database connectivity.
- Object storage configuration.
- Ingress and service routing.
- Identity and access bindings.
- Secret references.
- TLS configuration.
- Monitoring and logging integrations.
- Resource limits and cost controls.

Secrets must not be committed as plaintext values.

Staging configuration must be distinguishable from development and production configuration without duplicating the entire infrastructure implementation unnecessarily.

#### 2.1.4 Provisioning and reconciliation

The environment must support repeatable provisioning or reconciliation.

The workflow must detect configuration drift where supported and must make changes reviewable before application.

Provisioning should be idempotent for the supported operations.

The workflow must define:

- Prerequisites.
- Required permissions.
- Environment variables or configuration inputs.
- Provisioning command or pipeline.
- Readiness verification.
- Failure reporting.
- Safe retry behavior.
- Teardown restrictions.
- Post-provision verification.

A failed provisioning attempt must not silently leave the environment in an unknown state.

#### 2.1.5 Network segmentation

The staging environment must implement the approved network boundaries and routing rules.

The design must identify:

- Publicly reachable endpoints.
- Internal-only services.
- Ingress and egress paths.
- Database and storage access paths.
- Administrative access paths.
- Required external integrations.
- Network policies or firewall rules.
- DNS dependencies.
- Any temporary test access exceptions.

Default access must be restrictive. Connectivity must be granted only where required for a documented integration path.

Staging must not expose databases, internal administration interfaces, or unrestricted service ports to the public internet.

#### 2.1.6 Service discovery and routing

The environment must provide predictable service discovery and routing for deployed application components.

The implementation must define internal service names, ports, endpoint configuration, and health-check paths where applicable.

Frontend and backend configuration must use staging-specific endpoints.

Service discovery must not depend on undocumented developer machine addresses or transient container addresses.

#### 2.1.7 Ingress and endpoint configuration

Staging must provide the approved ingress or gateway path for external test access.

The configuration must identify:

- Public or restricted staging hostnames.
- TLS termination point.
- Backend routing rules.
- Request size and timeout assumptions where applicable.
- Health-check endpoints.
- Access restrictions for administrative endpoints.
- CORS and origin assumptions where relevant to the deployed application.
- Any temporary access mechanism and its expiry.

Application-level authorization and business behavior remain with the application owners.

#### 2.1.8 TLS and certificate configuration

Staging endpoints must use the approved TLS configuration for the intended access model.

Certificates must be provisioned and renewed through a documented mechanism appropriate to staging.

Internal transport security must follow the approved architecture and security requirements.

The milestone must identify certificate ownership, trust roots, renewal behavior, and failure diagnostics.

Certificate private keys must not be committed to source control or exposed through logs.

Staging certificates and trust configuration must not accidentally grant access to production endpoints or identities.

#### 2.1.9 Environment configuration

Staging must use explicit, versioned configuration for non-secret environment settings.

Configuration must identify:

- Environment name.
- Service endpoints.
- Database connection references.
- Object storage configuration.
- Queue or cache endpoints where applicable.
- Feature flags required for staging.
- Timeout and retry defaults where infrastructure-owned.
- Logging and observability destinations.
- External integration mode.
- Lab or simulator mode.
- Resource limits.
- Migration and startup expectations.

Configuration values that belong to application behavior must remain documented by the applicable frontend or backend owners.

C-M03 owns delivery of those values to the staging runtime, not their semantic definition.

#### 2.1.10 Secret management

Staging secrets must be stored in the approved secret-management mechanism or supplied through an equivalent controlled deployment integration.

The environment must support:

- Least-privilege access.
- Separation between staging and production secrets.
- Rotation where required.
- Restricted administrative access.
- Safe injection into workloads.
- Prevention of accidental secret logging.
- Removal or revocation of obsolete credentials.
- Clear ownership for each secret reference.

Secret values must not appear in source control, container images, build logs, diagnostic bundles, or ordinary application configuration files.

Application owners remain responsible for defining which credentials the application requires.

#### 2.1.11 Workload identity and permissions

Workloads must use environment-appropriate identities and minimum required privileges.

The infrastructure must avoid shared, unrestricted credentials where narrower workload identities are supported.

Permissions must be reviewed for:

- Database access.
- Object storage access.
- Queue or messaging access.
- Secret retrieval.
- Internal service communication.
- Observability emission.
- Deployment and administrative actions.

Staging identities must not be authorized to mutate production resources.

#### 2.1.12 Compute and runtime configuration

C-M03 must provision the compute or runtime environment required by the approved application topology.

This may include virtual machines, containers, managed orchestration, or another approved runtime.

The configuration must identify:

- Runtime version or image references.
- CPU and memory limits.
- Scaling or replica settings.
- Process startup configuration.
- Health and readiness probes.
- Restart behavior.
- Required mounted configuration.
- Network and identity bindings.
- Log and metric destinations.
- Environment-specific overrides.

Application correctness and process lifecycle semantics remain with the backend and frontend owners.

#### 2.1.13 Container image and artifact references

Staging deployments must identify immutable or otherwise reproducible application image and artifact references.

Where images are used, deployment records should capture the image digest or equivalent immutable reference.

Where application artifacts are deployed through another mechanism, the revision or artifact identity must be traceable.

Staging must not rely on a mutable development tag as the sole evidence of what was deployed.

Artifact creation and registry metadata remain with the applicable build and artifact owners. C-M03 owns environment-side retrieval, deployment configuration, and traceability.

#### 2.1.14 Deployment pipeline integration

The staging environment must integrate with the approved CI/CD deployment workflow.

The workflow must define:

- Which revisions may be deployed.
- How deployment identity is authenticated.
- Which infrastructure and application configurations are selected.
- How deployment begins.
- How readiness is verified.
- How smoke checks are executed.
- How failure is reported.
- How a previous known-good revision is restored where supported.
- What evidence is recorded for the deployment.

The pipeline must not bypass required review or security gates.

Global branch, review, and release policy remains in `docs/development/` and `docs/development/RELEASE_PROCESS.md`.

#### 2.1.15 Deployment traceability

Every staging deployment must be traceable to the source revision, application artifact or image reference, configuration revision, and deployment time.

The environment must provide enough information to determine which version is currently deployed.

Where multiple services are deployed independently, the environment should record their individual revisions and the integrated version set.

This information supports defect reproduction and the production handoff.

#### 2.1.16 Database infrastructure

Staging must provide the database infrastructure and connectivity required by the accepted application topology.

The infrastructure must identify:

- Database endpoint and environment boundary.
- Authentication mechanism.
- Secret reference.
- Network access policy.
- Connection limits or relevant service quotas.
- Required extensions or managed-service capabilities.
- Backup or reset assumptions applicable to staging.
- Migration execution identity.
- Health and connectivity checks.

Schema design, migrations, transactions, RLS, and data-integrity rules belong to the applicable database milestones.

C-M03 must not create an alternative schema or bypass the database migration workflow.

#### 2.1.17 Database initialization and migration execution

The staging deployment workflow must invoke the approved database migration procedure where required.

Migration execution must use a controlled identity and must be ordered according to the authoritative database dependencies.

The workflow must distinguish successful application deployment from successful database migration.

If migration execution fails, the environment must report the failure and must not falsely report full readiness.

Production migration compatibility and rollback policy remain with the database and C-M04 PRODUCTION (P8) owners.

#### 2.1.18 Object storage and external payload connectivity

Where the application uses object storage for artifacts, logs, telemetry, or results, staging must provide the required isolated storage configuration.

The environment must identify:

- Staging storage namespace or bucket.
- Workload permissions.
- Endpoint and network path.
- Encryption configuration where required.
- Lifecycle configuration assumptions.
- Retrieval access mechanism.
- Cleanup and reset procedure.
- External service dependencies.

Storage metadata and artifact identity remain with DB-M02 CORE DATA (P3) and the applicable backend owners.

C-M03 provides the environment-side infrastructure and connectivity.

#### 2.1.19 Queue, cache, and supporting dependencies

If the accepted application architecture uses queues, caches, or other shared infrastructure, staging must provide the required dependencies or documented substitutes.

The environment must define:

- Whether the dependency is dedicated to staging.
- Endpoint and authentication configuration.
- Resource limits.
- Data reset behavior.
- Health checks.
- Failure behavior visible to the deployment workflow.
- Any difference from the production topology.

A simulated dependency must be explicitly marked as simulated and must not be presented as evidence that the production integration has been validated.

#### 2.1.20 External integration modes

External integrations must use an explicitly selected staging mode.

Permitted modes may include:

- A dedicated staging endpoint.
- A vendor sandbox.
- A controlled simulator.
- A mock service for tests that do not require external integration validation.
- A disabled integration with an explicit test limitation.

Production endpoints and production credentials must not be used merely because a sandbox is unavailable.

Each deviation must identify what behavior remains unverified and which owner must address the gap.

#### 2.1.21 Lab and robot connectivity

Where P6 LAB & ROBOT integration is supported in staging, the infrastructure must provide a controlled path to the designated Lab Agent or simulator.

The design must identify network reachability, service identity, access restrictions, environment ownership, and the consequences of disconnecting the integration.

Physical robot access must not be assumed to be available in every staging deployment.

Any simulator substitution must be documented, including which integration properties it can and cannot validate.

Hardware safety approval and physical deployment authorization remain outside C-M03 STAGING.

#### 2.1.22 Frontend deployment target

Staging must provide the deployment target and endpoint configuration needed by the applicable frontend milestones.

This includes hosting, TLS, environment configuration delivery, and required access restrictions.

Frontend functionality, browser behavior, and user workflow acceptance remain with the frontend owners.

The cloud milestone is responsible for making the agreed frontend build reachable in the intended staging environment.

#### 2.1.23 Backend deployment target

Staging must provide the runtime, connectivity, configuration, identity, and observability required by the applicable backend services.

The environment must support controlled deployment and basic readiness verification.

Business rules, API behavior, job orchestration, booking policy, result computation, and application-level error semantics remain with the backend owners.

#### 2.1.24 Health checks and readiness

The staging environment must distinguish infrastructure readiness from application readiness.

Infrastructure checks may verify:

- Resource creation.
- Network reachability.
- DNS resolution.
- TLS validity.
- Database connectivity.
- Storage connectivity.
- Required dependency availability.
- Workload startup.
- Health and readiness probes.

Application readiness endpoints and their semantics remain with the application owners.

A successful infrastructure deployment must not be reported as fully ready if a required dependency or application health check fails.

#### 2.1.25 Smoke checks

Staging must support repeatable smoke checks after deployment.

The checks should verify that:

- The expected frontend endpoint is reachable.
- Required backend health endpoints respond.
- Database connectivity is available.
- Required storage connectivity works.
- Service-to-service communication follows the expected path.
- The deployed revision matches the deployment record.
- Required environment configuration is present.
- No critical infrastructure failure is reported.

These checks establish deployment and connectivity readiness. They do not replace functional acceptance tests owned by the application domains.

#### 2.1.26 Infrastructure observability

The environment must provide enough infrastructure-level observability to diagnose provisioning and deployment failures.

The baseline should cover:

- Workload health.
- Resource utilization.
- Restart and failure signals.
- Network or endpoint errors where available.
- Database connectivity failures.
- Storage connectivity failures.
- Deployment status.
- Certificate or DNS failures.
- Infrastructure provisioning errors.
- Relevant platform events.

Application log content and application-level metrics are owned by the relevant service owners, while C-M03 provides the infrastructure paths and destinations.

#### 2.1.27 Operational access

Staging administrative access must be restricted to authorized users and automation identities.

The access model must distinguish routine deployment access from privileged infrastructure administration.

Access must be reviewable and revocable.

Emergency access, if supported, must be documented and audited according to the applicable security policy.

C-M03 must not create undocumented shared administrative accounts.

#### 2.1.28 Environment isolation

Staging must be isolated from production data, credentials, identities, and mutable resources.

The design must prevent accidental cross-environment operations.

Required controls may include:

- Separate workload identities.
- Separate secret namespaces.
- Separate storage namespaces.
- Separate databases or database instances.
- Restricted network paths.
- Environment-specific DNS.
- Explicit deployment target selection.
- Environment tagging.
- Policy checks on destructive operations.

Any intentional cross-environment dependency must be explicitly approved and documented.

#### 2.1.29 Test data and reset behavior

Staging must define how test data is created, isolated, and removed.

The reset process must identify the resources it may delete and must require an explicit staging target.

Destructive operations must not accept an ambiguous environment identifier.

Production data must not be copied into staging without approved authorization, minimization, and protection measures.

Application-level fixture semantics belong to the relevant test and service owners.

#### 2.1.30 Resource limits and cost controls

Staging must use resource limits appropriate to its validation purpose.

The configuration should identify:

- Compute size and replica limits.
- Database capacity or service-tier assumptions.
- Storage quotas or lifecycle rules.
- Queue and cache limits where applicable.
- Network or managed-service quotas.
- Budget or usage alerts where supported.
- Automatic shutdown or scale-down behavior where approved.
- Exceptions for integration or load tests.

Staging must not be assumed to provide production-scale capacity unless that capacity is explicitly configured and measured.

#### 2.1.31 Production-parity matrix

The milestone must maintain a production-parity assessment that compares staging with C-M04 PRODUCTION (P8).

The assessment must cover the material infrastructure characteristics required by the approved architecture.

For each characteristic, it must identify:

- Production expectation.
- Staging implementation.
- Parity status.
- Difference and rationale.
- Risk introduced by the difference.
- Validation approach.
- Owner of any follow-up action.

A difference is acceptable only when its impact is understood and the required validation evidence is identified.

#### 2.1.32 Staging deviations

Staging may differ from production in scale, redundancy, cost profile, external integration mode, or selected operational controls.

Every material deviation must be explicit.

The milestone must not silently treat a simulator, mock service, smaller database tier, reduced replica count, or relaxed availability setting as production-equivalent evidence.

The production owner decides whether a deviation is acceptable for the intended promotion.

#### 2.1.33 Deployment rollback and recovery

Where supported by the deployment architecture, staging must provide a documented path to restore a previous known-good application revision.

The procedure must distinguish application rollback from database schema rollback.

A database migration must not be reversed automatically unless the database owner has approved that operation.

The environment must define recovery behavior for failed infrastructure updates, failed application rollout, and failed smoke checks.

Production recovery and disaster-recovery implementation belong to C-M04 PRODUCTION (P8) and the applicable database owners.

#### 2.1.34 Infrastructure drift

The staging environment must support detection or review of drift between the declared configuration and deployed resources where the chosen tooling permits.

Drift must be classified by impact and addressed through the approved infrastructure workflow.

Unreviewed manual changes must not silently become permanent configuration.

Where a manual change is required to restore service, it must be recorded and reconciled into version-controlled definitions or explicitly removed.

#### 2.1.35 Environment lifecycle

The staging environment must have a defined lifecycle, including provisioning, use, maintenance, reset, and decommissioning.

The lifecycle must identify who may create or remove resources and how shared resources are protected.

Any teardown procedure must verify the target environment before deleting resources.

The procedure must preserve the evidence and records required for acceptance or incident investigation.

#### 2.1.36 Security validation

The staging infrastructure must be reviewed against the approved cloud security requirements.

The review should cover:

- Public exposure.
- Network segmentation.
- Identity and privilege boundaries.
- Secret delivery.
- TLS and certificate handling.
- Storage access.
- Database reachability.
- Administrative access.
- Environment isolation.
- Logging and diagnostic access.
- Destructive operations.
- Cross-environment connectivity.

Application authorization behavior remains with the security and application owners.

#### 2.1.37 Infrastructure failure behavior

The environment must expose meaningful failure information for provisioning, routing, workload startup, dependency connectivity, and deployment readiness.

A failed dependency must not be hidden by a misleading success state.

Where automated retry is supported, its scope and limits must be documented.

Infrastructure retries must not duplicate application-side operations or bypass service-level idempotency requirements.

#### 2.1.38 Evidence and deployment records

Staging must retain the evidence needed to reproduce and assess a deployment.

Evidence may include:

- Source revision.
- Application image digest or artifact reference.
- Infrastructure revision.
- Environment configuration revision.
- Deployment timestamp.
- Migration status.
- Smoke-check results.
- Readiness status.
- Relevant infrastructure diagnostics.
- Known deviations.
- Outstanding failures or limitations.

Secrets and sensitive payloads must not be included in deployment evidence.

Retention and access to these records must follow the approved operational policy.

#### 2.1.39 Promotion readiness handoff

C-M03 must provide an evidence-based handoff to C-M04 PRODUCTION (P8).

The handoff must identify:

- The staging topology and infrastructure revision.
- The application versions validated.
- Database migration status.
- Smoke-check and integration evidence.
- Security review status.
- Production-parity assessment.
- Approved deviations.
- Known limitations.
- Unresolved infrastructure risks.
- Required production-specific changes.
- Owners for follow-up actions.

Passing staging checks does not itself authorize production deployment.

#### 2.1.40 Documentation and operational handoff

The milestone must document staging provisioning, configuration, access, deployment, readiness verification, diagnostics, reset, and known limitations.

Documentation must identify the authoritative owner for each application, database, storage, and external integration dependency.

The milestone must not duplicate the complete cloud architecture or global development workflow.

Detailed work decomposition, acceptance evidence, review execution, change history, and commit procedure remain in sibling files.

### 2.2 Explicit non-scope

The following are outside C-M03 STAGING unless an approved scope change explicitly assigns them to this milestone:

- Defining the canonical phase or milestone model.
- Replacing the system architecture or cloud architecture.
- Rebuilding the cloud foundation.
- Defining the developer workstation environment.
- Implementing frontend features or application workflows.
- Implementing backend business logic or APIs.
- Defining or implementing database schema and migrations.
- Defining booking eligibility, credit, ledger, or invoice rules.
- Implementing build engines or artifact creation.
- Implementing job scheduling or execution orchestration.
- Implementing Lab Agent behavior or physical robot control.
- Implementing telemetry acquisition or processing.
- Implementing log generation, indexing, or search.
- Implementing result computation or domain-specific validation.
- Defining global application authentication and authorization policy.
- Owning global CI, branching, code review, or release policy.
- Providing production data or production credentials to staging.
- Claiming production-scale performance based on smaller staging resources.
- Establishing production availability or recovery guarantees.
- Owning production backups, disaster recovery, or production operations.
- Approving physical robot safety or deployment.
- Making product or commercial acceptance decisions.
- Authorizing production promotion solely because staging deployment succeeds.

C-M03 may provide infrastructure support and evidence for these capabilities, but implementation ownership remains with the authoritative domains.

### 2.3 Canonical phase relationship table

| Phase | Relationship to C-M03 STAGING | Boundary |
|---|---|---|
| P0 FOUNDATION | Supplies cloud and engineering foundations | C-M03 follows established account, network, identity, and infrastructure conventions |
| P1 STUDIO | Supplies the initial application context | C-M03 provides the staging deployment target, not Studio behavior |
| P2 BUILD & ARTIFACT | Supplies build and artifact capabilities | C-M03 deploys identified artifacts and does not own their creation |
| P3 CONTROL PLANE | Supplies identity, project, platform, resource, artifact, and service integration foundations | C-M03 provides environment-specific connectivity and isolation |
| P4 BOOKING & COMMERCIAL | Primary phase for staging validation of booking and commercial integration | C-M03 provides infrastructure for integrated validation; business rules remain with service owners |
| P5 EXECUTION | Requires staging validation of execution service integration | C-M03 provides runtime infrastructure and connectivity |
| P6 LAB & ROBOT | Requires controlled validation of lab or robot integration where supported | C-M03 provides network and runtime access; physical control remains outside cloud ownership |
| P7 LIVE & RESULTS | Requires staging validation of live and results integration | C-M03 provides reachable services and infrastructure observability |
| P8 PRODUCTION | Receives the production-parity assessment and staging evidence | C-M04 PRODUCTION owns production deployment and operations |

### 2.4 Canonical cloud milestone relationship table

| Cloud milestone | Phase mapping | Relationship to C-M03 STAGING |
|---|---|---|
| C-M01 FOUNDATION (P0) | P0 FOUNDATION | Supplies the shared cloud foundation and conventions |
| C-M02 DEVELOPMENT (P1-P3) | P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE | Supplies development environment patterns and reusable infrastructure |
| C-M03 STAGING (P4-P7) | P4 BOOKING & COMMERCIAL; P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS | Owns staging infrastructure, integration environment, and production-parity evidence |
| C-M04 PRODUCTION (P8) | P8 PRODUCTION | Owns production infrastructure, deployment, hardening, and operational controls |

### 2.5 Canonical frontend milestone relationship table

| Frontend milestone | Phase mapping | Staging relationship |
|---|---|---|
| F-M01 STUDIO FOUNDATION (P0-P1) | P0 FOUNDATION; P1 STUDIO | Supplies the initial frontend deployment and environment requirements |
| F-M02 PROJECTS (P1) | P1 STUDIO | Supplies project workflow requirements for staging validation |
| F-M03 BUILD & ARTIFACT (P2) | P2 BUILD & ARTIFACT | Supplies build and artifact frontend integration requirements |
| F-M04 BOOKING (P4) | P4 BOOKING & COMMERCIAL | Supplies booking frontend integration requirements |
| F-M05 EXECUTION (P5) | P5 EXECUTION | Supplies execution frontend integration requirements |
| F-M06 LIVE (P7) | P7 LIVE & RESULTS | Supplies live presentation integration requirements |
| F-M07 RESULTS (P7) | P7 LIVE & RESULTS | Supplies results presentation integration requirements |

### 2.6 Canonical backend milestone relationship table

| Backend milestone | Phase mapping | Staging relationship |
|---|---|---|
| B-M01 CONTROL PLANE (P3) | P3 CONTROL PLANE | Supplies control-plane deployment requirements |
| B-M02 ARTIFACT (P2-P3) | P2 BUILD & ARTIFACT; P3 CONTROL PLANE | Supplies artifact-service deployment requirements |
| B-M03 PLATFORM (P3) | P3 CONTROL PLANE | Supplies platform and resource service requirements |
| B-M04 BOOKING (P4) | P4 BOOKING & COMMERCIAL | Supplies booking service deployment requirements |
| B-M05 EXECUTION (P5) | P5 EXECUTION | Supplies execution service deployment requirements |
| B-M06 RESULTS (P6-P7) | P6 LAB & ROBOT; P7 LIVE & RESULTS | Supplies results service deployment requirements |
| B-M07 PRODUCTION (P8) | P8 PRODUCTION | Owns production application behavior and production-specific service requirements |

### 2.7 Canonical database milestone relationship table

| Database milestone | Phase mapping | Staging relationship |
|---|---|---|
| DB-M01 FOUNDATION (P0-P3) | P0 FOUNDATION; P1 STUDIO; P2 BUILD & ARTIFACT; P3 CONTROL PLANE | Supplies the database foundation and security conventions |
| DB-M02 CORE DATA (P3) | P3 CONTROL PLANE | Supplies platform, resource, artifact, and storage metadata requirements |
| DB-M03 BOOKING DATA (P4) | P4 BOOKING & COMMERCIAL | Supplies booking and commercial schema requirements |
| DB-M04 EXECUTION DATA (P5-P7) | P5 EXECUTION; P6 LAB & ROBOT; P7 LIVE & RESULTS | Supplies job, run, telemetry/log metadata, and results schema requirements |

### 2.8 Canonical production-parity dimensions

| Dimension | Staging expectation | Evidence required |
|---|---|---|
| Environment boundary | Explicitly separated from production | Account/project/namespace and resource inventory |
| Network topology | Reflects required production routing patterns | Network diagram and connectivity checks |
| Service discovery | Uses defined service identities and endpoints | Endpoint configuration and resolution checks |
| TLS | Uses approved staging certificates and trust configuration | Certificate validation evidence |
| Workload identity | Uses staging-specific least-privilege identities | Role and permission review |
| Secret delivery | Uses controlled secret references | Configuration inspection without secret disclosure |
| Compute runtime | Uses compatible runtime and image configuration | Deployment revision and runtime metadata |
| Database connectivity | Uses staging-specific database infrastructure | Connection and migration evidence |
| Database schema | Uses the approved migration workflow | Migration status and schema verification |
| Object storage | Uses isolated staging storage and access controls | Read/write and access-boundary checks |
| Queue or cache | Uses the approved staging dependency or documented substitute | Connectivity and dependency-mode evidence |
| Application configuration | Uses versioned staging configuration | Configuration revision and required-key checks |
| Deployment workflow | Uses the approved pipeline and identity | Deployment record and smoke-check output |
| Health checks | Distinguishes infrastructure and application readiness | Readiness and dependency-check evidence |
| Observability | Supports infrastructure failure diagnosis | Sample logs, metrics, or platform events |
| Reset behavior | Cannot target production accidentally | Reset procedure and environment-guard evidence |
| Capacity | Has documented limits and known differences | Resource configuration and quota record |
| External integrations | Uses approved staging, sandbox, or simulated modes | Integration-mode declaration and test evidence |
| Lab connectivity | Controlled and explicit where enabled | Connectivity evidence or documented simulation limits |
| Rollback | Has a documented recovery path where supported | Procedure and validation evidence |
| Production handoff | Contains parity and risk assessment | Handoff record and open-item list |

### 2.9 Required environment invariants

C-M03 STAGING must preserve these invariants:

- **Environment identity:** every deployed resource can be associated with the staging environment.
- **Environment isolation:** staging operations cannot accidentally mutate production resources.
- **Configuration traceability:** the deployed environment corresponds to identifiable configuration revisions.
- **Deployment traceability:** deployed application versions can be identified and reproduced.
- **Secret separation:** staging does not reuse production secrets by default.
- **Least privilege:** workloads receive only the infrastructure permissions required for their functions.
- **Network restriction:** services and data stores are reachable only through approved paths.
- **TLS integrity:** endpoint and internal trust configuration follows the approved security model.
- **Dependency clarity:** required dependencies and simulated substitutes are explicitly identified.
- **Database integrity:** schema changes use the authoritative migration workflow.
- **Storage isolation:** staging payloads use staging-owned storage boundaries.
- **Readiness accuracy:** deployment success is not reported when required checks fail.
- **Diagnostic usefulness:** infrastructure failures produce actionable diagnostic information.
- **Reset safety:** destructive staging operations require an unambiguous environment target.
- **Parity transparency:** material differences from production are documented.
- **Capacity honesty:** staging capacity is not represented as production capacity without evidence.
- **Promotion separation:** successful staging validation does not itself authorize production deployment.
- **Ownership clarity:** cloud infrastructure, application behavior, database semantics, and production operations remain distinct responsibilities.

---

## 3. Dependencies

### 3.1 C-M01 FOUNDATION (P0)

C-M03 depends on C-M01 FOUNDATION for:

- Cloud account or project conventions.
- Base network and connectivity patterns.
- Shared identity and access mechanisms.
- Infrastructure-as-code tooling and conventions.
- Resource tagging and environment identification.
- Baseline security and logging controls.
- Approved cloud service choices.
- Shared DNS or certificate conventions where applicable.

C-M03 must reuse the cloud foundation rather than create an independent account, network, or identity model without an approved architectural decision.

### 3.2 C-M02 DEVELOPMENT (P1-P3)

C-M03 depends on C-M02 DEVELOPMENT for reusable development environment patterns and integration with the application development workflow.

Relevant dependencies include:

- Service packaging and deployment conventions.
- Environment configuration conventions.
- Development-to-staging artifact flow.
- CI/CD integration patterns.
- Developer and automation identity assumptions.
- Database initialization and migration workflow.
- Local or development substitutes for external dependencies.
- Existing infrastructure definitions suitable for controlled reuse.

Staging may differ from development in isolation, access, capacity, and operational controls, but the relationship must be explicit.

### 3.3 Cloud architecture

C-M03 depends on `docs/architecture/CLOUD_ARCHITECTURE.md` and `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` for approved topology and implementation conventions.

The staging implementation must align with:

- Service boundaries.
- Network trust boundaries.
- Deployment topology.
- External dependency paths.
- Data-store placement.
- Service discovery.
- Environment isolation.
- Observability architecture.
- Production transition assumptions.

If the architecture is incomplete or contradictory, the relevant owner must resolve the issue before the affected infrastructure is treated as accepted.

### 3.4 Cloud security architecture

C-M03 depends on `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` for cloud infrastructure security requirements.

Required alignment includes:

- Identity and access management.
- Network segmentation.
- Public exposure policy.
- Secret management.
- TLS and certificate handling.
- Administrative access.
- Logging and audit requirements.
- Environment separation.
- Secure configuration delivery.
- Infrastructure privilege boundaries.

Application-level authentication and authorization remain with the security and application owners.

### 3.5 Frontend deployment dependencies

The applicable frontend milestones must provide the frontend artifacts and runtime requirements needed for staging.

The staging environment must know:

- Deployment artifact or image format.
- Required environment configuration.
- Public or restricted endpoint requirements.
- API endpoint configuration.
- TLS and origin assumptions.
- Health-check expectations where supported.
- Any build-time versus runtime configuration distinction.

C-M03 supplies the hosting and environment configuration mechanisms. Frontend owners remain responsible for application behavior and client-side acceptance.

### 3.6 Backend deployment dependencies

The applicable backend milestones must provide runtime requirements and deployment-compatible artifacts.

Required information includes:

- Service artifact or image reference.
- Runtime and process configuration.
- Required environment variables and secret references.
- Network ports and service endpoints.
- Health and readiness endpoint semantics.
- Database and external dependency requirements.
- Resource requirements.
- Startup and shutdown assumptions.
- Logging and metrics integration.
- Migration invocation requirements.

C-M03 supplies the environment and deployment mechanisms. Backend owners remain responsible for service behavior, API semantics, and execution correctness.

### 3.7 Database dependencies

C-M03 depends on the applicable database milestones for schema, migration, security, and integrity requirements.

- DB-M01 FOUNDATION (P0-P3) defines the database foundation, identity and project schema, RLS, audit, and migration conventions.
- DB-M02 CORE DATA (P3) defines platform, resource, artifact, and storage metadata.
- DB-M03 BOOKING DATA (P4) defines booking and commercial persistence.
- DB-M04 EXECUTION DATA (P5-P7) defines jobs, runs, telemetry/log metadata, and results persistence.

C-M03 provisions staging database infrastructure and connectivity. It does not define schemas, bypass RLS, or substitute manual DDL for approved migrations.

### 3.8 Artifact and deployment dependencies

Staging deployment depends on the applicable build and artifact workflows producing identifiable artifacts.

The environment must be able to retrieve approved artifacts using controlled identities and record which artifact was deployed.

The dependency contract must identify:

- Artifact identity or image digest.
- Registry or storage endpoint.
- Retrieval permissions.
- Version immutability assumptions.
- Artifact provenance.
- Required compatibility checks.
- Handling of unavailable or revoked artifacts.

Artifact creation and metadata remain with the applicable build, backend, and database owners.

### 3.9 Booking and commercial integration

P4 BOOKING & COMMERCIAL validation requires the staging environment to support the relevant frontend, backend, and database services.

The cloud milestone must provide required network connectivity, runtime configuration, and isolated dependencies.

The staging environment must not use live commercial accounts or production payment credentials by default.

Booking rules, credits, invoices, payment behavior, and commercial acceptance remain with the applicable product, backend, and database owners.

### 3.10 Execution integration

P5 EXECUTION validation requires staging connectivity among the frontend, backend execution service, database, and required dependencies.

The environment must support deployment and smoke validation of the agreed execution path.

C-M03 does not define job state transitions, scheduling policy, retry semantics, or worker behavior.

These remain with B-M05 EXECUTION (P5) and DB-M04 EXECUTION DATA (P5-P7), as applicable.

### 3.11 Lab and robot integration

Where P6 LAB & ROBOT is included in the staging configuration, the environment depends on the applicable Lab Agent, simulator, or approved integration endpoint.

Required information includes:

- Connectivity and network requirements.
- Authentication and workload identity.
- Service endpoint and protocol.
- Required ports and routing.
- Simulator versus physical-device mode.
- Failure and disconnect behavior.
- Safety restrictions and physical access requirements.

The cloud milestone must not assume that physical robot integration is safe or available simply because a network route exists.

### 3.12 Live and results integration

P7 LIVE & RESULTS requires staging connectivity for the applicable telemetry, log, result, and artifact paths.

C-M03 must support the approved endpoints and storage access paths.

The environment must distinguish infrastructure reachability from successful telemetry ingestion, result computation, or user-facing rendering.

- F-M06 LIVE (P7) owns live presentation behavior.
- B-M06 RESULTS (P6-P7) owns results service behavior.
- F-M07 RESULTS (P7) owns results presentation behavior.
- DB-M04 EXECUTION DATA (P5-P7) owns the related persistent metadata model.

### 3.13 External services and simulators

Any external dependency must have a declared integration mode.

The environment owner must know whether staging connects to:

- A dedicated staging service.
- A vendor sandbox.
- A simulator.
- A controlled mock.
- No external service.

The selected mode must be consistent with the intended validation claim.

A mock may validate service wiring and error handling but must not be presented as proof of interoperability with a real external service.

### 3.14 CI/CD and release workflow

C-M03 depends on the global development and release workflow for:

- Approved deployment triggers.
- Deployment identity.
- Review and approval gates.
- Artifact provenance.
- Configuration revision handling.
- Deployment status reporting.
- Smoke-check integration.
- Failure notification.
- Rollback expectations.
- Evidence retention.

The staging milestone implements the environment-specific deployment integration but does not redefine global branch, review, or release policy.

### 3.15 Observability dependencies

C-M03 depends on the approved logging, metrics, tracing, and diagnostic infrastructure.

The environment must define the destinations and access mechanisms required for infrastructure-level diagnostics.

Application owners must supply relevant service instrumentation and avoid logging secrets or sensitive payloads.

The staging environment must not assume that a running workload is healthy solely because its process exists.

### 3.16 Test data and fixture dependencies

Staging integration tests depend on controlled test data and fixture mechanisms supplied by the applicable service and test owners.

The cloud environment must provide safe storage, database access, and reset boundaries.

Test data must be distinguishable from production data, and cleanup must be scoped to the staging environment.

The cloud milestone does not define business-level fixture semantics or replace application-owned test suites.

### 3.17 Resource quota and cost dependencies

Staging depends on the available cloud quota, service limits, and budget constraints.

The environment must identify limits that could affect validation, including:

- Compute capacity.
- Database connections and storage.
- Object storage capacity.
- Network throughput.
- Queue or cache limits.
- External service quotas.
- Lab or simulator availability.
- Concurrent test capacity.

Any constraint that weakens the intended validation must be recorded as a production-parity deviation.

### 3.18 Dependency readiness criteria

A dependency is ready when:

- Its authoritative owner is identified.
- Required interface and configuration details are documented.
- Network and identity requirements are explicit.
- The staging integration mode is selected.
- Environment isolation is understood.
- Failure behavior and diagnostics are defined.
- Any production-parity deviation is recorded.
- Required smoke or integration evidence can be collected.

Dependencies must be classified as blocking, conditionally blocking, or non-blocking.

- **Blocking:** staging cannot be safely provisioned or cannot validate its core environment contract without the dependency.
- **Conditionally blocking:** the environment can be built, but acceptance of the affected integration must wait.
- **Non-blocking:** the dependency affects a later or optional integration without invalidating the accepted staging baseline.

Detailed dependency assignments and sequencing belong in `TASKS.md`.

### 3.19 Cross-phase handoff table

| Handoff | Producing phase or milestone | Consuming phase or milestone | Required evidence |
|---|---|---|---|
| Cloud foundation | C-M01 FOUNDATION (P0) | C-M03 STAGING (P4-P7) | Approved account, network, identity, and provisioning conventions |
| Development deployment patterns | C-M02 DEVELOPMENT (P1-P3) | C-M03 STAGING (P4-P7) | Reusable service and configuration patterns |
| Application artifacts | Applicable build and artifact owners | C-M03 STAGING (P4-P7) | Identifiable and retrievable deployment artifacts |
| Booking integration requirements | P4 BOOKING & COMMERCIAL and applicable service owners | C-M03 STAGING (P4-P7) | Isolated endpoints and required dependency configuration |
| Execution integration requirements | B-M05 EXECUTION (P5) | C-M03 STAGING (P4-P7) | Runtime, network, and readiness requirements |
| Lab and robot integration requirements | P6 LAB & ROBOT | C-M03 STAGING (P4-P7) | Approved connectivity or documented simulation mode |
| Live and results integration requirements | P7 LIVE & RESULTS and applicable service owners | C-M03 STAGING (P4-P7) | Endpoints, storage paths, and integration checks |
| Staging environment | C-M03 STAGING (P4-P7) | C-M04 PRODUCTION (P8) | Infrastructure revision, parity assessment, validation evidence, and open risks |
| Staging database environment | C-M03 STAGING (P4-P7) | Applicable database milestones | Connectivity, migration identity, and isolation evidence |
| Production operational requirements | C-M04 PRODUCTION (P8) | C-M03 STAGING (P4-P7) | Production expectations used to assess staging parity |

### 3.20 Dependency change control

Changes to staging topology, runtime, secret management, ingress, database connectivity, external integrations, or environment isolation may affect several service domains.

A proposed change must identify:

- The affected staging resource or configuration.
- The reason for the change.
- The relevant infrastructure definition.
- The impact on security and isolation.
- The impact on application deployment.
- The impact on database and storage dependencies.
- The impact on production parity.
- The affected smoke or integration checks.
- The deployment and rollback implications.
- The authoritative owners required to review the change.
- Any change to the production handoff evidence.

Changes must follow the approved review and release process. C-M03 must not silently change application semantics or weaken environment isolation to work around an integration defect.

---

## 4. Deliverables

### 4.1 Staging environment specification

Deliver a staging-specific environment specification describing the environment boundary, topology, major infrastructure resources, service connectivity, access model, and dependency modes.

The specification must reference the authoritative cloud architecture rather than duplicating its full system design.

**Completion evidence:** reviewers can identify the staging boundary, deployed components, and required connectivity from the documented specification.

### 4.2 Infrastructure-as-code baseline

Deliver version-controlled infrastructure definitions for the resources owned by C-M03 STAGING.

The definitions must use approved cloud foundation conventions and must separate environment-specific configuration from shared infrastructure logic.

**Completion evidence:** the staging environment can be provisioned or reconciled through the documented infrastructure workflow without relying on undocumented manual changes.

### 4.3 Environment identity and isolation

Deliver an explicit staging identity and resource boundary.

The boundary must distinguish staging resources, workload identities, secrets, databases, and storage from production.

**Completion evidence:** environment inventory and access checks demonstrate that staging resources are identifiable and production mutation paths are not granted to staging workloads.

### 4.4 Network and routing configuration

Deliver staging network, firewall or security-group, ingress, egress, DNS, and service-routing configuration as required by the approved topology.

**Completion evidence:** required connectivity checks pass and unapproved public or cross-environment access is denied.

### 4.5 TLS and certificate configuration

Deliver staging TLS configuration and the documented certificate provisioning and renewal mechanism.

**Completion evidence:** endpoint certificates validate against the intended trust model and certificate failures can be diagnosed.

### 4.6 Secret and configuration delivery

Deliver the staging mechanism for non-secret configuration and secret references.

The mechanism must support least-privilege retrieval, environment separation, and safe rotation where required.

**Completion evidence:** workloads receive the required configuration without plaintext secrets in source control, deployment artifacts, or ordinary logs.

### 4.7 Workload identity and permissions

Deliver staging-specific workload identities and least-privilege access bindings.

Permissions must cover only the approved database, storage, messaging, secret, and observability operations.

**Completion evidence:** role and permission review demonstrates that staging identities cannot mutate production resources.

### 4.8 Compute and runtime configuration

Deliver the compute or runtime resources required by the approved staging topology.

The configuration must identify runtime versions, image references, resource limits, health checks, and environment-specific settings.

**Completion evidence:** the required workloads can start and expose their expected readiness signals.

### 4.9 Frontend deployment target

Deliver the staging hosting configuration and endpoint for the applicable frontend artifacts.

The configuration must provide the expected TLS, environment settings, and access restrictions.

**Completion evidence:** the deployed frontend is reachable through the intended staging endpoint and its deployed revision is traceable.

### 4.10 Backend deployment targets

Deliver runtime targets and environment configuration mechanisms for the required backend services.

The targets must support controlled deployment, service discovery, dependency connectivity, and readiness checks.

**Completion evidence:** required backend workloads start and pass their agreed infrastructure-level health checks.

### 4.11 Artifact retrieval and deployment traceability

Deliver the staging integration needed to retrieve approved application artifacts and record the deployed revisions.

The record must identify the artifact or image digest, source revision where available, configuration revision, and deployment time.

**Completion evidence:** a reviewer can identify the exact application version deployed in staging.

### 4.12 CI/CD staging integration

Deliver the environment-specific deployment integration for the approved CI/CD workflow.

The integration must use a controlled deployment identity and must not bypass required review or security gates.

**Completion evidence:** a permitted deployment can target staging, report its outcome, and record the revision deployed.

### 4.13 Database infrastructure and connectivity

Deliver staging database infrastructure configuration and access paths required by the application.

This includes endpoint configuration, secret references, network access, and the migration execution identity.

**Completion evidence:** authorized services can connect to the staging database, while unapproved access is denied.

### 4.14 Migration execution integration

Deliver the staging deployment integration for the authoritative database migration workflow.

Migration execution must be distinguishable from application deployment and must report failures clearly.

**Completion evidence:** the approved migration process can be invoked and its result verified in the staging environment.

### 4.15 Object storage integration

Deliver staging-specific object storage configuration and workload access.

The configuration must isolate staging payloads and use the approved access mechanism.

**Completion evidence:** authorized staging workloads can perform the required operations and cannot access unrelated production storage.

### 4.16 Supporting dependency configuration

Where required, deliver staging queue, cache, messaging, or other supporting infrastructure configuration.

Each dependency must be identified as dedicated, shared under approved controls, simulated, or disabled.

**Completion evidence:** required dependencies pass their connectivity checks and substitutions are documented.

### 4.17 External integration mode declaration

Deliver an explicit configuration record for each relevant external integration.

The record must identify the selected staging mode and the validation claims supported by that mode.

**Completion evidence:** no integration is ambiguously treated as production-equivalent when it uses a mock or simulator.

### 4.18 Lab and robot connectivity

Where included in the approved staging scope, deliver controlled connectivity to the designated Lab Agent or simulator.

The configuration must document endpoint, identity, network requirements, and simulation limitations.

**Completion evidence:** the approved connectivity check passes or the unsupported physical integration is explicitly recorded as a limitation.

### 4.19 Health and readiness checks

Deliver infrastructure-level health and readiness checks for required staging resources.

The checks must distinguish resource provisioning, dependency connectivity, workload startup, and application readiness.

**Completion evidence:** the deployment reports a failure when a required readiness check fails rather than presenting a misleading success state.

### 4.20 Deployment smoke checks

Deliver repeatable smoke checks for the staging deployment.

Checks must cover the frontend endpoint, required backend health endpoints, database connectivity, storage connectivity, service routing, and deployed revision identification as applicable.

**Completion evidence:** the checks execute through the documented workflow and produce reviewable results.

### 4.21 Infrastructure observability baseline

Deliver the infrastructure logging, metrics, platform-event access, or diagnostic integration required to investigate provisioning and deployment failures.

**Completion evidence:** representative infrastructure failure conditions can be diagnosed using the documented access path without exposing secrets.

### 4.22 Administrative access model

Deliver staging administrative and deployment access definitions.

The model must distinguish routine deployment access from privileged infrastructure administration.

**Completion evidence:** access is restricted to authorized identities, can be revoked, and does not rely on undocumented shared administrator credentials.

### 4.23 Environment reset procedure

Deliver a documented staging reset and cleanup procedure within the approved resource boundary.

The procedure must identify which data and resources may be removed, how the environment target is verified, and what evidence must be preserved.

**Completion evidence:** reset safeguards prevent ambiguous targeting and demonstrate that production resources are excluded.

### 4.24 Resource limits and cost controls

Deliver staging resource limits and cost-control configuration appropriate to the expected validation workload.

The configuration must identify material quotas and limits that affect testing.

**Completion evidence:** the environment has documented resource limits, and any constraint that weakens production-parity claims is recorded.

### 4.25 Production-parity matrix

Deliver a parity matrix comparing staging with the intended C-M04 PRODUCTION (P8) infrastructure.

The matrix must cover topology, security, runtime, deployment, dependencies, database, storage, observability, failure behavior, and capacity assumptions as applicable.

**Completion evidence:** every material difference has a rationale, impact assessment, validation strategy, and owner.

### 4.26 Staging deviation register

Deliver a record of material differences between staging and production.

The register must distinguish accepted differences from unresolved gaps.

**Completion evidence:** no material difference is hidden or presented as validated parity without evidence.

### 4.27 Deployment recovery procedure

Deliver a documented procedure for failed staging deployments and restoration of a previous known-good application revision where supported.

The procedure must distinguish application rollback from database schema rollback.

**Completion evidence:** recovery steps are reviewable and do not automatically reverse database migrations without database-owner approval.

### 4.28 Infrastructure drift review

Deliver the supported process for detecting, reviewing, and reconciling staging infrastructure drift.

**Completion evidence:** the declared infrastructure and deployed environment can be compared, and material drift has an owner and disposition.

### 4.29 Security validation evidence

Deliver evidence of the staging infrastructure security review.

The review must cover environment isolation, network exposure, workload identity, secret handling, TLS, storage access, database reachability, and administrative permissions.

**Completion evidence:** required controls are verified and unresolved findings are recorded with owners and impact.

### 4.30 Deployment and environment evidence

Deliver a deployment record that identifies the infrastructure and application revisions, migration status, smoke-check results, readiness status, and known deviations.

**Completion evidence:** an authorized reviewer can reconstruct which staging environment and application revisions were validated.

### 4.31 Integration environment readiness

Deliver evidence that the required integration environment is ready for the approved P4 BOOKING & COMMERCIAL, P5 EXECUTION, P6 LAB & ROBOT, and P7 LIVE & RESULTS validation scope.

The evidence must distinguish infrastructure reachability from application-level functional acceptance.

**Completion evidence:** each required integration path is either validated through its agreed check or documented as a limitation with an owner.

### 4.32 Production handoff package

Deliver a handoff package for C-M04 PRODUCTION (P8).

The package must include:

- Staging topology and infrastructure revision.
- Environment configuration revision.
- Deployed application revisions.
- Database migration status.
- Smoke-check and integration evidence.
- Security review status.
- Production-parity matrix.
- Approved deviations.
- Known limitations and unresolved risks.
- Required production-specific changes.
- Follow-up owners.

**Completion evidence:** the production owner can determine what has been validated, what remains unverified, and which production-specific controls are still required.

### 4.33 Documentation and operational guidance

Deliver staging-specific provisioning, deployment, readiness, diagnostics, reset, and recovery documentation.

The documentation must link to the authoritative cloud architecture, security architecture, global development workflow, and release policy.

**Completion evidence:** an authorized operator can follow the documented staging workflow without relying on undocumented assumptions.

### 4.34 Deliverable ownership summary

| Deliverable | Authoritative owner | C-M03 STAGING responsibility |
|---|---|---|
| Cloud foundation | C-M01 FOUNDATION (P0) | Reuse foundation conventions |
| Development environment patterns | C-M02 DEVELOPMENT (P1-P3) | Reuse appropriate patterns |
| Staging infrastructure | C-M03 STAGING (P4-P7) | Own staging-specific resources and configuration |
| Production infrastructure | C-M04 PRODUCTION (P8) | Receive staging evidence and parity findings |
| Frontend application behavior | Applicable frontend milestones | Provide hosting and endpoint configuration |
| Backend application behavior | Applicable backend milestones | Provide runtime and connectivity configuration |
| Database schema and migrations | Applicable database milestones | Provision connectivity and migration integration |
| Artifact creation and metadata | Applicable build, backend, and database owners | Deploy identified artifacts |
| Staging secret delivery | C-M03 STAGING with security owners | Provide secure references and access bindings |
| Booking integration behavior | B-M04 BOOKING (P4) and F-M04 BOOKING (P4) | Provide staging runtime and network paths |
| Execution integration behavior | B-M05 EXECUTION (P5) and F-M05 EXECUTION (P5) | Provide staging runtime and network paths |
| Lab and robot behavior | P6 LAB & ROBOT and applicable backend owners | Provide controlled connectivity where supported |
| Live presentation behavior | F-M06 LIVE (P7) | Provide reachable staging endpoints |
| Results service behavior | B-M06 RESULTS (P6-P7) | Provide runtime and dependency connectivity |
| Results presentation behavior | F-M07 RESULTS (P7) | Provide reachable staging endpoints |
| Global test policy | `docs/development/TESTING_STRATEGY.md` | Implement staging infrastructure needed by tests |
| Global release policy | `docs/development/RELEASE_PROCESS.md` | Integrate staging deployment targets |
| Detailed staging tasks | `TASKS.md` | Link to authoritative task plan |
| Detailed staging acceptance | `ACCEPTANCE_CRITERIA.md` | Link to authoritative acceptance requirements |

### 4.35 Required milestone records

The C-M03 STAGING directory maintains these sibling records:

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

### 9.1 Staging is not isolated from production

**Risk:** Staging workloads can access or mutate production databases, storage, credentials, or service endpoints.

**Impact:** Test operations can corrupt production data, disclose sensitive information, or trigger unintended production behavior.

**Mitigation:**

- Establish an explicit staging resource boundary.
- Use separate workload identities and secret references.
- Restrict network paths to approved endpoints.
- Verify production mutation access is denied.
- Guard destructive operations with explicit environment selection.
- Review cross-environment dependencies before acceptance.

**Owner:** Cloud and security domains.

### 9.2 Infrastructure differs materially from production

**Risk:** Staging topology, runtime, routing, storage, or security differs from production in ways that invalidate test evidence.

**Impact:** Defects emerge only after production deployment.

**Mitigation:**

- Maintain the production-parity matrix.
- Identify material deviations.
- Record the rationale and impact of each deviation.
- Define compensating validation where feasible.
- Require C-M04 PRODUCTION (P8) review of relevant gaps.

**Owner:** Cloud domain and C-M04 PRODUCTION (P8).

### 9.3 Manual configuration becomes the source of truth

**Risk:** Persistent staging settings are changed manually without corresponding infrastructure-as-code updates.

**Impact:** The environment cannot be reliably reproduced and later deployments behave differently.

**Mitigation:**

- Version-control staging infrastructure.
- Use the approved provisioning workflow.
- Detect or review configuration drift.
- Record emergency manual changes.
- Reconcile manual changes into code or remove them.

**Owner:** C-M03 STAGING.

### 9.4 Deployment revision is ambiguous

**Risk:** Staging uses mutable image tags or unrecorded artifact versions.

**Impact:** Failures cannot be reproduced and promotion evidence cannot be tied to a known revision.

**Mitigation:**

- Record immutable artifact or image references where supported.
- Capture source and configuration revisions.
- Record deployment timestamps.
- Verify deployed revisions after rollout.
- Avoid using a mutable development tag as the sole identifier.

**Owner:** Cloud deployment and artifact owners.

### 9.5 Secrets are exposed

**Risk:** Staging secrets appear in source control, build logs, deployment output, diagnostic bundles, or application configuration.

**Impact:** Unauthorized access to staging or connected systems.

**Mitigation:**

- Use the approved secret-management mechanism.
- Inject secrets through controlled workload identities.
- Restrict secret retrieval permissions.
- Prevent secret values from being logged.
- Rotate or revoke exposed credentials.
- Review deployment diagnostics for accidental disclosure.

**Owner:** Cloud and security domains.

### 9.6 Shared credentials weaken environment isolation

**Risk:** Staging and production share credentials or workload identities without an approved boundary.

**Impact:** Staging compromise or test mistakes can affect production.

**Mitigation:**

- Use environment-specific identities.
- Separate secret namespaces.
- Restrict production network paths.
- Verify effective permissions.
- Record and review any unavoidable shared identity.

**Owner:** Security and cloud domains.

### 9.7 Excessive network exposure

**Risk:** Databases, internal services, administrative endpoints, or observability interfaces are publicly reachable without sufficient restrictions.

**Impact:** Unauthorized access and expanded attack surface.

**Mitigation:**

- Restrict ingress and egress.
- Use explicit network rules.
- Separate public and internal endpoints.
- Validate firewall or security-group behavior.
- Review public exposure during acceptance.

**Owner:** C-M03 STAGING and security domain.

### 9.8 TLS or certificate configuration is invalid

**Risk:** Certificates are expired, incorrectly scoped, or inconsistent with the intended trust model.

**Impact:** Deployment failures, insecure connections, or misleading test results.

**Mitigation:**

- Automate certificate provisioning and renewal where supported.
- Verify hostname and trust-chain behavior.
- Document internal trust configuration.
- Alert or report certificate failures.
- Keep private keys out of source control and logs.

**Owner:** Cloud and security domains.

### 9.9 Database migration failure is hidden

**Risk:** Application deployment reports success despite failed or incomplete database migration.

**Impact:** Services run against an incompatible schema and fail unpredictably.

**Mitigation:**

- Track migration status separately from application rollout.
- Stop readiness progression when required migrations fail.
- Use the authoritative database migration workflow.
- Report migration errors clearly.
- Coordinate schema compatibility with database and backend owners.

**Owner:** Cloud deployment and database domains.

### 9.10 Database connectivity bypasses security controls

**Risk:** Staging services access the database through overly broad network or database privileges.

**Impact:** Data leakage, unauthorized mutation, or misleading RLS validation.

**Mitigation:**

- Restrict network reachability.
- Use workload-specific identities or credentials.
- Apply the database owners' role and RLS model.
- Test connectivity using ordinary application identities.
- Avoid privileged administrative roles for routine application traffic.

**Owner:** Database, cloud, and security domains.

### 9.11 External storage is shared incorrectly

**Risk:** Staging writes to or reads from production object storage or another unintended namespace.

**Impact:** Production data contamination, leakage, or deletion.

**Mitigation:**

- Use staging-specific storage boundaries.
- Restrict workload permissions.
- Verify endpoint and namespace configuration.
- Test denied access to production resources.
- Guard cleanup operations with explicit environment identity.

**Owner:** Cloud and storage owners.

### 9.12 External integrations use unsafe production endpoints

**Risk:** A staging service uses a live external endpoint or production credential because a sandbox is unavailable.

**Impact:** Unintended external transactions, data exposure, or irreversible side effects.

**Mitigation:**

- Declare the integration mode.
- Prefer dedicated staging endpoints or vendor sandboxes.
- Use controlled simulators or mocks when appropriate.
- Do not substitute production credentials without explicit approval.
- Document the behavior that remains unverified.

**Owner:** Integration and security owners.

### 9.13 Simulators are mistaken for physical integration evidence

**Risk:** A simulator or mock is used but the evidence is presented as proof of physical robot interoperability.

**Impact:** Physical integration failures are discovered too late.

**Mitigation:**

- Label simulation mode explicitly.
- Document simulator capabilities and limitations.
- Separate software connectivity evidence from hardware validation.
- Require the relevant P6 LAB & ROBOT owners to review the handoff.
- Keep hardware safety approval separate.

**Owner:** Lab and robot owners, with cloud support.

### 9.14 Insufficient staging capacity

**Risk:** Staging resource limits prevent representative integration or concurrency testing.

**Impact:** Tests fail for environmental reasons or fail to expose production bottlenecks.

**Mitigation:**

- Document resource limits.
- Identify quota constraints.
- Define the intended staging workload.
- Record capacity-related parity deviations.
- Use separate representative measurements before claiming production-scale performance.

**Owner:** Cloud and service owners.

### 9.15 Cost controls interrupt validation unexpectedly

**Risk:** Automated shutdown, quota enforcement, or budget limits terminate a required test or service.

**Impact:** Incomplete validation and confusing failures.

**Mitigation:**

- Document cost-control behavior.
- Coordinate scheduled tests with resource policies.
- Record shutdown and quota events.
- Provide an approved temporary capacity procedure.
- Avoid unbounded staging resource creation.

**Owner:** C-M03 STAGING and relevant test owners.

### 9.16 Readiness checks provide false confidence

**Risk:** A workload is marked ready even though required dependencies or application-level health checks fail.

**Impact:** Integration tests run against a broken environment and failures are misattributed.

**Mitigation:**

- Separate infrastructure and application readiness.
- Check required dependency connectivity.
- Verify the deployed revision.
- Fail readiness when a required check fails.
- Keep application readiness semantics with the application owners.

**Owner:** Cloud and application owners.

### 9.17 Smoke checks are too shallow

**Risk:** Smoke checks validate only endpoint reachability and do not verify required service-to-service or data-store connectivity.

**Impact:** Important deployment defects pass staging validation.

**Mitigation:**

- Define smoke-check coverage with service owners.
- Include database and storage connectivity.
- Validate internal routing and expected service health.
- Record results against the deployed revision.
- Keep functional acceptance tests with their authoritative owners.

**Owner:** C-M03 STAGING and service owners.

### 9.18 Observability is insufficient

**Risk:** Infrastructure failures cannot be diagnosed because logs, metrics, platform events, or deployment records are missing.

**Impact:** Recovery is slow and staging defects remain unresolved.

**Mitigation:**

- Establish infrastructure observability destinations.
- Capture deployment and provisioning errors.
- Verify diagnostic access.
- Restrict observability permissions.
- Ensure sensitive values are not exposed.

**Owner:** Cloud domain and observability owners.

### 9.19 Reset operation targets the wrong environment

**Risk:** A staging reset or cleanup command accepts an ambiguous target or reuses a production context.

**Impact:** Irreversible data loss or service interruption.

**Mitigation:**

- Require explicit environment identity.
- Validate account, project, namespace, or equivalent target.
- Restrict destructive permissions.
- Test safeguards in a disposable environment.
- Record the reset operation and outcome.

**Owner:** C-M03 STAGING.

### 9.20 Reset removes required evidence

**Risk:** A reset deletes deployment, test, or diagnostic evidence needed for acceptance or investigation.

**Impact:** Failures cannot be reproduced and milestone evidence is lost.

**Mitigation:**

- Define evidence retention before reset.
- Preserve required deployment records.
- Separate resettable application data from required audit evidence.
- Document which resources are removed.
- Verify evidence preservation in reset testing.

**Owner:** Cloud and test owners.

### 9.21 Infrastructure drift is ignored

**Risk:** Manual changes cause the deployed environment to diverge from its declared configuration.

**Impact:** Reproducibility and parity become unreliable.

**Mitigation:**

- Review drift regularly or through supported automation.
- Classify drift by impact.
- Reconcile approved changes into infrastructure code.
- Remove unauthorized changes.
- Record deviations that cannot be eliminated.

**Owner:** C-M03 STAGING.

### 9.22 Deployment rollback is unsafe

**Risk:** Application rollback is attempted without considering database migration compatibility or external side effects.

**Impact:** The restored application may fail against the current schema or create inconsistent state.

**Mitigation:**

- Document application rollback separately from schema rollback.
- Coordinate with database owners.
- Preserve known-good artifact references.
- Define compatibility requirements.
- Require explicit approval for destructive schema reversal.

**Owner:** Cloud deployment, backend, and database domains.

### 9.23 CI/CD privileges are excessive

**Risk:** The staging deployment identity has broad administrative permissions or can deploy to production.

**Impact:** Pipeline compromise or configuration mistakes can affect unrelated environments.

**Mitigation:**

- Use environment-scoped deployment identities.
- Grant minimum required permissions.
- Separate staging and production deployment roles.
- Restrict secret access.
- Review effective permissions and deployment target selection.

**Owner:** Cloud and security domains.

### 9.24 Application configuration is inconsistent

**Risk:** Services receive missing, conflicting, or incorrect staging configuration.

**Impact:** Integration failures are caused by environment configuration rather than application logic.

**Mitigation:**

- Maintain versioned configuration.
- Validate required configuration keys.
- Separate secret references from ordinary values.
- Record configuration revision with each deployment.
- Coordinate configuration semantics with service owners.

**Owner:** Cloud deployment and application owners.

### 9.25 External dependency outage blocks staging

**Risk:** A vendor sandbox, external service, or shared dependency is unavailable.

**Impact:** Integration validation cannot complete or results become inconclusive.

**Mitigation:**

- Identify external dependencies and their owners.
- Define supported retry and timeout assumptions.
- Use an approved simulator only for tests it can meaningfully represent.
- Record unavailable validations.
- Avoid presenting blocked tests as passing.

**Owner:** Integration owners and C-M03 STAGING.

### 9.26 Production parity is asserted without evidence

**Risk:** Staging is declared production-equivalent based on architecture intent rather than observed configuration.

**Impact:** Release decisions rely on unsupported assumptions.

**Mitigation:**

- Maintain the parity matrix.
- Compare actual deployed settings where possible.
- Record evidence for material dimensions.
- Identify unsupported claims.
- Obtain production-owner review of relevant deviations.

**Owner:** Cloud domain and C-M04 PRODUCTION (P8).

### 9.27 Production requirements arrive too late

**Risk:** Production constraints are discovered only after staging infrastructure is accepted.

**Impact:** Significant rework is required to address networking, identity, deployment, observability, or recovery differences.

**Mitigation:**

- Consult C-M04 PRODUCTION (P8) during parity planning.
- Capture production expectations early.
- Record differences and owners.
- Validate deployment and configuration compatibility.
- Keep production-specific hardening with the production owner.

**Owner:** C-M03 STAGING and C-M04 PRODUCTION (P8).

### 9.28 Staging data contains sensitive production information

**Risk:** Production datasets or logs are copied into staging without approval or minimization.

**Impact:** Sensitive data is exposed through weaker staging access or retention controls.

**Mitigation:**

- Prefer synthetic or sanitized test data.
- Require approved handling for any production-derived dataset.
- Restrict access and retention.
- Avoid copying production secrets.
- Document data provenance and cleanup.

**Owner:** Security, data governance, and application owners.

### 9.29 Infrastructure changes break unrelated integration work

**Risk:** A staging change removes shared resources, changes endpoints, or interrupts tests without coordination.

**Impact:** Multiple teams experience failures and evidence becomes inconsistent.

**Mitigation:**

- Define shared-resource ownership.
- Record environment changes.
- Coordinate disruptive updates.
- Use versioned deployment configuration.
- Provide a recovery procedure for failed infrastructure changes.

**Owner:** C-M03 STAGING and affected integration owners.

### 9.30 Documentation becomes stale

**Risk:** Topology, endpoints, deployment steps, reset behavior, or parity assumptions change without documentation updates.

**Impact:** Operators follow unsafe or incorrect procedures.

**Mitigation:**

- Update documentation with infrastructure changes.
- Link to authoritative architecture and release policy.
- Keep environment-specific procedures in the cloud domain.
- Record accepted changes in `CHANGELOG.md`.
- Review documentation during milestone acceptance.

**Owner:** C-M03 STAGING milestone owner.

---

## 10. Exit criteria

C-M03 STAGING may be declared complete only when the staging environment is repeatably provisioned, securely isolated, deployable through the approved workflow, and sufficiently production-like for the intended P4 BOOKING & COMMERCIAL through P7 LIVE & RESULTS integration scope.

Acceptance requires evidence of environment identity, network and workload access controls, deployment traceability, required dependency connectivity, readiness checks, infrastructure diagnostics, and an explicit production-parity assessment.

The milestone must document material differences from C-M04 PRODUCTION (P8), and the production handoff must distinguish validated behavior from unverified capabilities.

Detailed pass/fail conditions and evidence requirements belong in `ACCEPTANCE_CRITERIA.md`. Review execution and evidence inspection belong in `REVIEW_CHECKLIST.md`.

### 10.1 Scope and ownership

- [ ] The implemented environment matches the scope defined in this dossier.
- [ ] C-M03 STAGING owns only staging-specific infrastructure, configuration, integration environment, and parity evidence.
- [ ] C-M01 FOUNDATION (P0) remains authoritative for the cloud foundation.
- [ ] C-M02 DEVELOPMENT (P1-P3) remains authoritative for development infrastructure patterns.
- [ ] C-M04 PRODUCTION (P8) remains authoritative for production infrastructure and operations.
- [ ] Frontend owners remain authoritative for frontend application behavior.
- [ ] Backend owners remain authoritative for application service behavior.
- [ ] Database owners remain authoritative for schema, migrations, RLS, and data integrity.
- [ ] Artifact owners remain authoritative for artifact creation and metadata.
- [ ] Security owners remain authoritative for application trust and authorization policy.
- [ ] Lab and robot owners remain authoritative for physical integration and safety.
- [ ] Global development and release policies remain in their authoritative documents.
- [ ] Canonical phase and milestone references follow the frozen model.
- [ ] Sibling task, acceptance, review, changelog, and Git procedure files are maintained separately.

### 10.2 Environment boundary and isolation

- [ ] The staging environment has a documented identity.
- [ ] Account, project, namespace, network, or equivalent boundaries are explicit.
- [ ] Staging resources can be identified through naming, tagging, or inventory.
- [ ] Workload identities are environment-specific where required.
- [ ] Staging secrets are separated from production secrets.
- [ ] Staging storage is separated from production storage.
- [ ] Staging database access is isolated from production.
- [ ] Cross-environment network paths are restricted and documented.
- [ ] Unapproved production mutation access is denied.
- [ ] Destructive operations require an unambiguous staging target.
- [ ] Environment reset safeguards have been verified.
- [ ] Any intentional cross-environment dependency is documented and approved.

### 10.3 Infrastructure as code and repeatability

- [ ] Staging-owned persistent resources are represented in version-controlled infrastructure definitions.
- [ ] The approved infrastructure tooling and conventions are used.
- [ ] Required configuration inputs are documented.
- [ ] Secrets are not committed as plaintext.
- [ ] Provisioning or reconciliation is repeatable.
- [ ] Supported operations are idempotent where required.
- [ ] Provisioning failures are reported clearly.
- [ ] Safe retry behavior is documented.
- [ ] Teardown restrictions are documented.
- [ ] Manual changes are reconciled or explicitly recorded.
- [ ] The deployed environment can be compared with its declared configuration.
- [ ] No undocumented manual operation is required for the accepted baseline.

### 10.4 Network, routing, and TLS

- [ ] Required public and internal endpoints are identified.
- [ ] Ingress and egress rules follow the approved topology.
- [ ] Database and storage access paths are restricted.
- [ ] Service discovery uses documented names and endpoints.
- [ ] Environment-specific DNS configuration is verified.
- [ ] Administrative endpoints are restricted.
- [ ] Unapproved public exposure is denied.
- [ ] Required service-to-service connectivity checks pass.
- [ ] TLS certificates validate against the intended trust model.
- [ ] Certificate renewal and ownership are documented.
- [ ] Internal transport security follows the approved architecture.
- [ ] Private keys are not exposed through source control or logs.

### 10.5 Configuration, identity, and secrets

- [ ] Required non-secret configuration is versioned and documented.
- [ ] Staging endpoints are distinct from production endpoints.
- [ ] Required configuration values are validated before readiness.
- [ ] Secret references use the approved secret-management mechanism.
- [ ] Workload identities have least-privilege permissions.
- [ ] Staging workloads cannot mutate production resources.
- [ ] Secret rotation or revocation procedures are documented where required.
- [ ] Deployment identities are scoped to staging.
- [ ] Privileged access is restricted and reviewable.
- [ ] Shared administrator credentials are not required.
- [ ] Diagnostic output does not expose secrets.

### 10.6 Compute and application deployment

- [ ] Required compute or runtime resources are provisioned.
- [ ] Runtime and image references are identifiable.
- [ ] CPU, memory, and replica limits are documented.
- [ ] Workload startup and restart behavior are configured.
- [ ] Health and readiness probes are configured as applicable.
- [ ] Frontend deployment targets are reachable.
- [ ] Required backend deployment targets are available.
- [ ] Deployed artifacts or images are traceable to known revisions.
- [ ] Deployment records capture the relevant artifact or image identity.
- [ ] Configuration revision is recorded with the deployment.
- [ ] The approved deployment workflow can target staging.
- [ ] Required review and security gates are not bypassed.
- [ ] Deployment failure is reported clearly.
- [ ] Application rollback procedures are documented where supported.

### 10.7 Database and storage integration

- [ ] Staging database infrastructure is provisioned.
- [ ] Database endpoint and access mechanism are documented.
- [ ] Authorized services can connect to the staging database.
- [ ] Unapproved database access is denied.
- [ ] Migration execution uses the authoritative database workflow.
- [ ] Migration status is distinct from application deployment status.
- [ ] Failed migrations prevent misleading readiness success.
- [ ] Required schema verification can be executed.
- [ ] Object storage uses a staging-specific boundary.
- [ ] Required workload storage permissions are configured.
- [ ] Storage connectivity checks pass.
- [ ] Storage cleanup cannot target production accidentally.
- [ ] Schema and data integrity remain owned by the database domain.

### 10.8 Supporting dependencies and integrations

- [ ] Required queues, caches, or supporting services are available.
- [ ] Each dependency's staging mode is explicit.
- [ ] Simulated or mocked dependencies are clearly identified.
- [ ] External integration credentials and endpoints are appropriate for staging.
- [ ] Production endpoints are not used by default.
- [ ] Dependency health and connectivity checks pass where required.
- [ ] Known external dependency limitations are documented.
- [ ] Lab or robot connectivity is configured only within the approved scope.
- [ ] Simulator limitations are documented where physical integration is not validated.
- [ ] No cloud readiness check is presented as proof of physical robot safety.

### 10.9 Readiness and smoke checks

- [ ] Infrastructure readiness is distinguished from application readiness.
- [ ] Required resource creation checks pass.
- [ ] DNS and network checks pass.
- [ ] TLS validation passes for required endpoints.
- [ ] Database connectivity checks pass.
- [ ] Storage connectivity checks pass.
- [ ] Required workloads start successfully.
- [ ] Required application readiness endpoints pass.
- [ ] The deployed revision is verified.
- [ ] Required smoke checks are repeatable.
- [ ] A required failed check prevents full readiness from being reported.
- [ ] Smoke-check results are retained as deployment evidence.
- [ ] Functional acceptance remains with the relevant application owners.

### 10.10 Observability and diagnostics

- [ ] Infrastructure logs or platform events are available through the documented path.
- [ ] Workload health and restart information can be inspected.
- [ ] Resource utilization can be inspected at the supported level.
- [ ] Deployment and provisioning failures are diagnosable.
- [ ] Database and storage connectivity failures are observable.
- [ ] Certificate, DNS, or routing failures provide useful diagnostic information.
- [ ] Diagnostic access is restricted to authorized identities.
- [ ] Sensitive values are not exposed in diagnostic records.
- [ ] Deployment evidence can be associated with the affected environment revision.
- [ ] The environment does not claim complete application observability solely from infrastructure metrics.

### 10.11 Production-parity assessment

- [ ] The parity matrix compares staging with the intended C-M04 PRODUCTION (P8) environment.
- [ ] Network topology and service routing have been assessed.
- [ ] TLS and workload identity assumptions have been assessed.
- [ ] Secret delivery and access boundaries have been assessed.
- [ ] Runtime and deployment behavior have been assessed.
- [ ] Database connectivity and migration workflow have been assessed.
- [ ] Object storage and supporting dependency behavior have been assessed.
- [ ] Observability and diagnostic assumptions have been assessed.
- [ ] Capacity and quota differences are documented.
- [ ] External integration modes are documented.
- [ ] Lab or simulator limitations are documented where applicable.
- [ ] Each material deviation has a rationale and impact assessment.
- [ ] Each material deviation has an owner and validation strategy.
- [ ] Unsupported production-equivalence claims have been removed.
- [ ] The production owner has the evidence needed to review relevant deviations.

### 10.12 Reset, recovery, and drift

- [ ] The staging lifecycle is documented.
- [ ] Provisioning, maintenance, reset, and teardown ownership are explicit.
- [ ] Reset operations verify the target environment.
- [ ] Reset procedures identify resources that may be deleted.
- [ ] Required deployment and acceptance evidence is preserved.
- [ ] Infrastructure drift can be detected or reviewed through the supported workflow.
- [ ] Material drift has an owner and disposition.
- [ ] A recovery procedure exists for failed infrastructure updates.
- [ ] Application rollback is distinguished from database schema rollback.
- [ ] Destructive database rollback is not automated without database-owner approval.
- [ ] Manual recovery changes are reconciled or documented.

### 10.13 Resource limits and cost controls

- [ ] Staging resource limits are documented.
- [ ] Relevant cloud quotas are identified.
- [ ] Database and storage limits are documented where relevant.
- [ ] Queue, cache, and external service limits are documented where relevant.
- [ ] Budget or usage alerts are configured where supported and required.
- [ ] Automatic shutdown or scale-down behavior is documented where used.
- [ ] Cost controls do not silently invalidate required validation.
- [ ] Capacity-related parity differences are explicit.
- [ ] Production-scale performance is not claimed without representative evidence.

### 10.14 Security validation

- [ ] Staging infrastructure security requirements have been reviewed.
- [ ] Public exposure and network segmentation have been checked.
- [ ] Workload and deployment permissions have been reviewed.
- [ ] Secret management and injection have been reviewed.
- [ ] TLS and certificate handling have been reviewed.
- [ ] Database and object storage access boundaries have been reviewed.
- [ ] Administrative access is restricted.
- [ ] Destructive operations have explicit safeguards.
- [ ] Cross-environment isolation has been tested.
- [ ] Unresolved security findings have owners and impact assessments.
- [ ] Application authorization behavior remains assigned to the security and application owners.

### 10.15 Production handoff

- [ ] The staging topology and infrastructure revision are recorded.
- [ ] The application revisions validated in staging are recorded.
- [ ] Database migration status is available.
- [ ] Smoke-check and integration evidence is available.
- [ ] Security review status is recorded.
- [ ] The production-parity matrix is complete.
- [ ] Material deviations and known limitations are explicit.
- [ ] Required production-specific changes are identified.
- [ ] Unresolved infrastructure risks have owners.
- [ ] Production-specific operational controls are identified as C-M04 PRODUCTION (P8) responsibilities.
- [ ] Staging success is not represented as automatic production authorization.
- [ ] The production owner can determine what has and has not been validated.

### 10.16 Documentation and traceability

- [ ] The staging topology and environment boundary are documented.
- [ ] Provisioning and reconciliation procedures are documented.
- [ ] Deployment and configuration revision tracking is documented.
- [ ] Access, secrets, network, and TLS assumptions are documented.
- [ ] Database and storage integration requirements are documented.
- [ ] Health, smoke-check, and diagnostic procedures are documented.
- [ ] Reset and recovery procedures are documented.
- [ ] Production-parity deviations are documented.
- [ ] Authoritative cloud architecture and security documents are linked.
- [ ] Global development and release policy documents are linked.
- [ ] `TASKS.md` contains the detailed task decomposition.
- [ ] `ACCEPTANCE_CRITERIA.md` contains detailed pass/fail conditions and evidence requirements.
- [ ] `REVIEW_CHECKLIST.md` contains review actions and evidence inspection.
- [ ] `CHANGELOG.md` contains accepted change history.
- [ ] `GIT_COMMIT_STEP.md` contains the repository and commit procedure.

### 10.17 Final milestone acceptance

C-M03 STAGING is ready for formal acceptance when:

1. The staging environment has a documented and verified resource boundary.
2. Staging infrastructure can be provisioned or reconciled through the approved workflow.
3. Environment isolation, least-privilege access, secret separation, and network restrictions are verified.
4. Required frontend and backend artifacts can be deployed through the approved workflow.
5. Deployment and configuration revisions are traceable.
6. Database and storage connectivity work through the approved staging configuration.
7. Required supporting dependencies and integration modes are explicit.
8. Infrastructure and application readiness are reported accurately.
9. Required deployment smoke checks pass and produce reviewable evidence.
10. Infrastructure failures can be diagnosed using the documented observability path.
11. Reset, recovery, and drift procedures are documented and appropriately guarded.
12. Resource limits and cost constraints are documented.
13. The production-parity matrix identifies material differences and their validation implications.
14. The production handoff package identifies tested revisions, evidence, limitations, and open risks.
15. Critical risks are mitigated or formally dispositioned by the relevant owners.
16. Required acceptance and review evidence is available through the sibling files.
17. No unresolved infrastructure issue invalidates environment isolation, deployment traceability, or the intended staging validation scope.

Acceptance of C-M03 STAGING does not establish production availability, production-scale capacity, disaster recovery, production security certification, physical robot safety, or automatic authorization to deploy to production. Those outcomes remain with C-M04 PRODUCTION (P8) and the applicable application, database, security, lab, and operational owners.
