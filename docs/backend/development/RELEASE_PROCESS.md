# Backend Release Process

**Project:** Kritva RaaS  
**Document:** `docs/backend/development/RELEASE_PROCESS.md`  
**Scope:** Backend container image build, database migrations during release, canary deployment and rollback, and post-release verification  
**Audience:** Backend engineers, database engineers, release engineers, and service operators  
**Status:** Backend-specific release procedure

## 1. Purpose

This document defines the backend-specific steps required to prepare, deploy, verify, and recover a backend release.

It covers four areas:

- Building and identifying backend container images.
- Coordinating database migrations with backend deployment.
- Performing canary deployment and controlled rollout.
- Verifying backend behavior after release and executing rollback when necessary.

The document assumes that global release authorization, release policy, and organization-wide deployment requirements are defined elsewhere.

It does not independently authorize a production release or redefine the project's release gates.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns the backend implementation and operational steps for:

- Preparing a backend container image for a release.
- Building and labeling release images.
- Recording image digests and source revisions.
- Checking image configuration before deployment.
- Coordinating database migration execution with backend rollout.
- Applying backward-compatible schema changes in the correct sequence.
- Deploying a backend canary.
- Evaluating canary health and application behavior.
- Expanding a rollout after successful canary verification.
- Rolling back backend application deployment.
- Handling migration-related rollback constraints.
- Performing backend-specific post-release verification.
- Recording backend deployment evidence and unresolved issues.

### 2.2 Global Release Policy Ownership

`docs/development/RELEASE_PROCESS.md` is the authoritative document for global release policy and release coordination.

It owns:

- Release eligibility and authorization.
- Organization-wide release readiness requirements.
- Global release gates and required approvals.
- Release ownership and escalation.
- Cross-domain release coordination.
- Repository-wide release records and communication.
- Global release freeze and exception handling.
- Organization-wide rollback decision authority.
- Release completion and closure requirements.

This document MUST follow the global release process and MUST NOT create independent global release gates.

### 2.3 Related Document Ownership

| Concern | Authoritative document |
|---|---|
| Global release policy | `docs/development/RELEASE_PROCESS.md` |
| Global development workflow | Applicable documents under `docs/development/` |
| Backend development workflow | `docs/backend/development/DEVELOPMENT_WORKFLOW.md` |
| Backend development setup | `docs/backend/development/DEVELOPMENT_SETUP.md` |
| Backend testing procedures | `docs/backend/development/TESTING.md` |
| Global testing policy | `docs/development/TESTING_STRATEGY.md` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| Backend architecture decisions | `docs/backend/planning/DECISIONS.md` |
| API contract | `docs/protocol/API_CONTRACT.md` |
| Event contract | `docs/protocol/EVENT_CONTRACT.md` |
| Artifact manifest contract | `docs/protocol/ARTIFACT_MANIFEST.md` |
| Database architecture and migration design | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Database implementation decisions | `docs/database/planning/DECISIONS.md` |
| Database development procedures | Applicable documents under `docs/database/development/` |
| Cloud architecture and deployment topology | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Cloud infrastructure security | `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` |
| Application security and trust boundaries | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Canonical phase definitions | `docs/planning/PHASES.md` |
| Backend milestone scope and acceptance | Authoritative dossiers under `docs/backend/milestones/` |
| Database milestone scope and acceptance | Authoritative dossiers under `docs/database/milestones/` |
| Cloud milestone scope and acceptance | Authoritative dossiers under `docs/cloud/milestones/` |
| Cross-domain milestone scope | Applicable authoritative dossiers under `docs/**/milestones/` |

### 2.4 Explicit Non-Goals

This document MUST NOT become the authoritative home for:

- Global release authorization or release policy.
- Complete CI/CD architecture.
- Container registry administration policy.
- Cloud infrastructure provisioning.
- Cluster administration and networking.
- Database schema design or migration implementation standards.
- Global security policy.
- Complete backend test strategy.
- Frontend or desktop application packaging.
- Product requirements or API contract definitions.
- Milestone acceptance criteria.
- General production incident management.

Where a procedure belongs to another owner, this document MUST link to that owner rather than reproduce its policy.

## 3. Backend Release Principles

### 3.1 Immutable Release Artifacts

A backend release SHOULD use an immutable image reference.

Prefer a registry image digest over a mutable tag when identifying the exact image deployed.

The release record SHOULD identify:

- Source repository.
- Source revision.
- Image repository.
- Image digest.
- Build metadata.
- Target environment.
- Deployment identifier.
- Migration revision, where applicable.

A tag alone MUST NOT be treated as proof of image identity if the registry permits that tag to move.

### 3.2 Reproducible Build Inputs

The backend image SHOULD be built from the reviewed source revision and the repository's declared build configuration.

Build dependencies SHOULD be pinned or otherwise controlled according to the project's build policy.

Do not modify source code after the release revision has been identified and continue using the same release identifier without recording the change.

### 3.3 Deployment and Schema Compatibility

The backend application and database schema MUST remain compatible throughout the rollout.

Where old and new backend instances may run concurrently, schema changes MUST support both versions for the duration of that overlap.

Prefer additive, backward-compatible changes before deploying code that depends on new schema behavior.

### 3.4 Controlled Rollout

Deploy the backend to a limited canary target before expanding rollout when the deployment environment supports canary operation.

The canary MUST be evaluated using meaningful service health and functional evidence.

A process that starts successfully is not sufficient evidence that the backend is operating correctly.

### 3.5 Rollback Readiness

Before deployment, identify the application rollback target and relevant migration constraints.

Application rollback MUST NOT assume that the database can always be reverted safely.

If a migration is irreversible or destructive, the recovery strategy MUST be defined before the migration is executed.

### 3.6 Evidence-Based Completion

Backend release completion MUST be based on observed results, not merely successful deployment commands.

Record the deployed image, migration outcome, canary result, post-release checks, and any remaining limitations.

Global release completion remains governed by `docs/development/RELEASE_PROCESS.md`.

## 4. Backend Release Inputs

### 4.1 Required Release Identity

Before building the image, identify the exact source revision intended for release.

The release record SHOULD include:

- Source revision or commit.
- Applicable release identifier.
- Backend image name.
- Target environment.
- Required configuration revision.
- Applicable database migration revision.
- Relevant API and event contract changes.
- Required dependent services.
- Rollback image or known-good revision.

The required fields and approval process remain subject to global release policy.

### 4.2 Source Revision

The source revision MUST correspond to the reviewed implementation being released.

The build SHOULD start from a clean, controlled source checkout.

Uncommitted changes MUST NOT be included silently in a release image.

If the build system incorporates generated files, submodules, or external source dependencies, record their relevant identities as required by the repository's build process.

### 4.3 Configuration

Release configuration MUST be supplied through the approved environment configuration mechanism.

Do not embed environment-specific credentials or production secrets in the container image.

Configuration required by the new backend version SHOULD be identified before rollout.

### 4.4 Dependencies

Identify the backend dependencies required for startup and normal operation.

These may include:

- PostgreSQL.
- Object storage.
- Queue or message broker.
- Authentication or identity services.
- Other backend services.
- External interfaces required by the deployed backend functionality.

The list MUST reflect the actual backend implementation rather than assume that every deployment uses every dependency.

### 4.5 Pre-Build Validation

Confirm that:

- The intended source revision is selected.
- Required dependencies are declared.
- Configuration expectations are documented.
- Required tests have completed according to global policy.
- The release image can be built using the repository's supported process.
- The intended image repository and target environment are known.

Backend-specific tests are described in `docs/backend/development/TESTING.md`.

Global test requirements are owned by `docs/development/TESTING_STRATEGY.md`.

## 5. Container Image Build

### 5.1 Build Ownership

This document defines the backend release-image build procedure.

The repository's container build files, dependency manifests, and build scripts remain authoritative for the actual build implementation.

Cloud infrastructure and registry configuration remain owned by the relevant cloud architecture and operations documents.

### 5.2 Inspect the Build Definition

Before building, inspect the backend's current build definition.

Confirm:

- The expected build context.
- The intended Dockerfile or equivalent container definition.
- The runtime base image.
- Dependency installation steps.
- Compilation or packaging steps.
- Runtime entry point.
- Required runtime files.
- Default user and permissions.
- Exposed ports and health-check configuration, if applicable.

Do not assume that a particular Dockerfile path exists without checking the repository.

### 5.3 Build the Release Image

Use the build command documented by the repository.

The following is an illustrative template, not a guarantee that the repository uses these exact names:

    docker build \
      --pull \
      -f <backend-container-definition> \
      -t <image-repository>:<release-tag> \
      <backend-build-context>

Replace all placeholders with the repository's actual paths and release values.

Use the approved build system where local Docker builds are not the supported release mechanism.

### 5.4 Build Reproducibility

Use the intended source revision and controlled dependencies.

Where supported, capture build metadata and provenance.

If the build is not reproducible, record the known limitation and follow the applicable global release policy.

Do not claim reproducibility merely because the build command succeeds twice.

### 5.5 Build Failure Handling

If the image build fails:

1. Capture the failing build step and relevant diagnostic output.
2. Determine whether the failure is caused by source code, dependency resolution, build configuration, or the environment.
3. Correct the underlying problem through the normal development workflow.
4. Re-run the applicable backend checks.
5. Build a new image from the corrected source revision.
6. Record the resulting image identity.

Do not silently replace a failed build with an image from another source revision.

### 5.6 Local Image Inspection

Before publication, inspect the resulting image.

Verify, as applicable:

- The image was built successfully.
- The expected application entry point exists.
- Runtime dependencies are present.
- The container starts with the intended configuration.
- The service binds to the expected interface and port.
- The process does not require unintended privileged access.
- Secrets are not embedded in image layers.
- The configured health check reflects meaningful service readiness.

The required checks depend on the actual container implementation.

### 5.7 Image Identity

Record the resulting image digest after the image is built and published to the intended registry.

The release record SHOULD link the source revision to the image digest.

If an image is rebuilt from changed source or build inputs, treat it as a new artifact.

### 5.8 Image Publication

Publish the image using the repository's approved registry workflow.

Verify that publication succeeded and that the expected digest is available from the registry.

Registry credentials MUST be supplied through approved mechanisms and MUST NOT be written into source files or release logs.

### 5.9 Image Promotion

Where the same image is promoted between environments, preserve the image digest.

Do not rebuild the image independently for each environment unless the approved build architecture explicitly requires it.

Environment-specific values SHOULD be injected through configuration rather than embedded into the image.

### 5.10 Build Record

Record the following where applicable:

| Field | Required evidence |
|---|---|
| Source revision | Exact commit or source identifier |
| Image repository | Registry and image name |
| Image tag | Release-identification tag, if used |
| Image digest | Immutable artifact identity |
| Build result | Successful or failed |
| Build environment | Relevant build runner or environment |
| Configuration assumptions | Non-secret configuration requirements |
| Known limitations | Relevant unresolved build or runtime constraints |

Do not include passwords, tokens, private keys, or other secrets in the build record.

## 6. Pre-Deployment Readiness

### 6.1 Deployment Preconditions

Before deployment, confirm that the backend release satisfies the applicable global release requirements.

Backend-specific checks SHOULD confirm:

- The image digest is known.
- The target environment is correct.
- Required configuration is available.
- Required dependencies are reachable.
- The current schema version is known.
- Pending migrations are identified.
- The application rollback target is known.
- The migration recovery constraints are understood.
- Canary health checks are available.
- Post-release verification procedures are prepared.

### 6.2 Configuration Compatibility

Compare the required configuration of the new backend version with the target environment.

Identify:

- New required settings.
- Changed defaults.
- Removed settings.
- Credential or permission changes.
- External service endpoint changes.
- Feature flags or behavior switches.

Do not assume that a successful image build proves that the deployment configuration is complete.

### 6.3 Dependency Readiness

Confirm the readiness of dependencies required for the planned deployment.

For example, a backend release may require a database schema change before the new application code can function.

Dependency readiness MUST be evaluated against the actual deployment architecture.

### 6.4 Capacity and Resource Constraints

Confirm that the target environment has sufficient capacity for the deployment and any temporary overlap between old and new instances.

Consider additional database connections, concurrent workers, queue consumers, and temporary resource demand where relevant.

Cloud capacity planning remains owned by the relevant cloud documents.

### 6.5 Deployment Plan

The backend deployment plan SHOULD identify:

- The image digest to deploy.
- The intended rollout sequence.
- Migration steps and ordering.
- Canary targets.
- Health and functional checks.
- Rollout expansion conditions.
- Rollback triggers.
- Application rollback target.
- Migration-related recovery limitations.
- Responsible operator or deployment owner.

The plan MUST be consistent with the global release process.

## 7. Database Migrations During Release

### 7.1 Migration Ownership

Database architecture and migration design are owned by `docs/database/architecture/DATABASE_ARCHITECTURE.md`.

Database-specific decisions are owned by `docs/database/planning/DECISIONS.md`.

The relevant database development procedures define how migrations are authored, reviewed, and maintained.

This document owns the backend release sequencing and verification required when a backend deployment includes database migrations.

### 7.2 Identify Pending Migrations

Before deployment, determine:

- The current database schema revision.
- The migration revision required by the release.
- The ordered migrations that have not yet been applied.
- Whether any migration changes existing data.
- Whether the migration is backward-compatible.
- Whether the migration can be retried safely.
- Whether rollback of the application remains possible after migration.

Do not infer migration state from the application version alone.

### 7.3 Migration Classification

For release planning, identify the operational characteristics of each migration.

| Migration characteristic | Release consideration |
|---|---|
| Additive schema change | Determine whether old and new code can both use the resulting schema |
| New nullable field | Verify compatibility with existing records and application defaults |
| New required field | Determine the required backfill and enforcement sequence |
| Data backfill | Estimate runtime, resource demand, and recovery needs |
| Index creation | Evaluate locking and resource implications for the target database |
| Constraint enforcement | Confirm existing data satisfies the constraint |
| Column or table removal | Verify no deployed application version still depends on the object |
| Data transformation | Establish validation and recovery requirements before execution |

This table provides release-planning considerations, not a replacement for database migration design.

### 7.4 Expand-and-Contract Sequencing

When an application and database schema must evolve across multiple deployments, prefer a compatible sequence.

A typical pattern is:

1. Add the new schema elements without removing the old ones.
2. Deploy code that can operate with the compatible schema.
3. Backfill or transform data where required.
4. Verify that the new representation is correct.
5. Deploy code that no longer depends on the old representation.
6. Remove obsolete schema elements only when compatibility conditions are satisfied.

The exact sequence MUST follow the database architecture and approved migration design.

Do not use this pattern mechanically when the migration requires a different, explicitly reviewed approach.

### 7.5 Migration Execution

Run migrations through the repository's approved migration mechanism.

The following is an illustrative command pattern only:

    <repository-migration-command> <approved-release-options>

The actual command MUST be taken from the backend and database repository documentation.

Do not invent a migration command or bypass the approved migration runner.

### 7.6 Migration Execution Controls

Before executing a migration:

- Verify the target database and environment.
- Confirm the expected migration revision.
- Confirm that the required backup or recovery provisions are available where applicable.
- Verify that the migration is part of the intended release.
- Check that the migration has been reviewed according to the applicable process.
- Confirm that its expected runtime and operational effects are understood.
- Ensure the operator can observe completion and failure.

Destructive operations MUST NOT be executed against an unintended database.

### 7.7 Migration Idempotency and Retry

Determine whether the migration runner can safely retry a failed operation.

Do not assume that every migration is idempotent.

If a migration fails partway through, inspect the actual database state before retrying.

Follow the database owner's recovery procedure rather than manually repeating statements without understanding their effects.

### 7.8 Migration Duration

For migrations that may take significant time, establish an execution plan that accounts for database load, locking, and application availability.

Long-running migrations SHOULD have a defined observation and failure-handling approach.

Do not assume that a migration is harmless because it executes successfully in a small local database.

### 7.9 Migration Verification

After migration, verify:

- The migration runner reports the expected outcome.
- The database schema reflects the intended change.
- Required constraints and indexes are present.
- Required backfills or transformations completed.
- Existing data remains valid.
- The backend can operate with the resulting schema.
- Relevant database health indicators remain acceptable.

Use the database owner's approved validation methods where available.

### 7.10 Application Compatibility After Migration

Before expanding deployment, confirm that the new backend version operates correctly against the resulting schema.

If old and new backend versions coexist during a canary, confirm that the schema remains compatible with both versions.

Do not expand the rollout if the schema change has created an unresolved compatibility problem.

### 7.11 Migration Failure

If migration execution fails:

1. Stop dependent rollout steps.
2. Capture the migration failure and current schema revision.
3. Determine whether the migration was atomic or partially applied.
4. Inspect the database state using the approved database procedures.
5. Assess the impact on currently deployed backend instances.
6. Consult the database owner for recovery options.
7. Resume only after the recovery path is understood and approved.

Do not automatically drop or recreate database objects to force the deployment forward.

### 7.12 Migration and Application Rollback

Application rollback and database rollback are separate decisions.

Rolling back the backend image does not reverse database changes.

A database downgrade MUST NOT be attempted unless the migration design explicitly supports it and the required data-preservation conditions are satisfied.

If a migration is irreversible, recovery may require a forward fix, a compatible application version, or an approved data restoration procedure.

The recovery choice MUST follow the database architecture and global release authority.

### 7.13 Migration Evidence

Record:

- Database environment.
- Starting schema revision.
- Migration identifiers.
- Execution start and completion.
- Migration outcome.
- Resulting schema revision.
- Validation performed.
- Errors or warnings.
- Recovery actions, if any.
- Remaining compatibility limitations.

Do not include database credentials or sensitive record contents in release evidence.

## 8. Canary Deployment

### 8.1 Purpose

A canary deployment introduces a new backend version to a limited target before broader rollout.

Its purpose is to detect application, configuration, dependency, and operational regressions while limiting initial exposure.

Canary availability depends on the deployment architecture.

If the environment does not support a canary, use the approved alternative deployment procedure defined by the global release process.

### 8.2 Canary Preconditions

Before starting the canary, confirm:

- The intended image digest is available.
- Required migrations have completed successfully, if applicable.
- The schema is compatible with existing and new backend instances.
- Required configuration is present.
- The canary target is correctly isolated or routed.
- Health checks and functional probes are ready.
- The known-good application version is identified.
- Rollback actions and migration constraints are understood.

### 8.3 Canary Target

Deploy the new image to the smallest meaningful target supported by the environment.

The target may be a single instance, a limited worker group, or another approved subset.

The chosen target SHOULD provide representative backend behavior without exposing the entire workload to an unverified release.

### 8.4 Image Verification

After deployment, verify that the canary is running the intended image digest.

Do not rely solely on a mutable tag or deployment name.

Confirm the active revision using the deployment platform's supported inspection mechanism.

### 8.5 Startup and Readiness

Verify that the canary process starts and reaches its intended readiness state.

Where applicable, confirm:

- Application initialization completed.
- Required configuration was loaded.
- Database connectivity works.
- Required schema checks pass.
- Required service dependencies are reachable.
- The service is accepting the expected workload.

A process being alive does not necessarily mean the service is ready.

### 8.6 Functional Verification

Run representative backend checks against the canary.

These SHOULD cover the key operations affected by the release.

Depending on the change, verify:

- API request and response behavior.
- Authentication and authorization outcomes.
- Database reads and writes.
- Event publication or consumption.
- Object storage operations.
- Queue processing.
- Lab-agent communication.
- Artifact handling.

Use the relevant backend testing procedures in `docs/backend/development/TESTING.md`.

### 8.7 Health and Error Signals

Observe the backend signals available in the target environment.

Relevant indicators may include:

- Request error rate.
- Response latency.
- Process restarts.
- Application exceptions.
- Database connection failures.
- Queue processing failures.
- Dependency timeouts.
- Resource utilization.
- Readiness transitions.

Use the deployment environment's configured observability tools. This document does not prescribe a particular monitoring product.

### 8.8 Canary Observation Window

Define an appropriate observation window for the release and workload.

The window SHOULD be long enough to exercise the changed behavior meaningfully.

For asynchronous workflows, account for the time required for queued work to be processed.

Do not expand the rollout solely because the initial health check passed.

### 8.9 Canary Decision

After observing the canary, choose one of the following actions:

- **Proceed:** Evidence supports expansion of the rollout.
- **Hold:** Evidence is incomplete or an issue requires investigation.
- **Rollback:** A release-related regression or unacceptable risk requires recovery.

The decision MUST follow global release authority and the approved deployment plan.

### 8.10 Canary Failure

If the canary fails:

1. Prevent further rollout expansion.
2. Preserve relevant logs and deployment evidence.
3. Determine whether the failure is caused by application code, configuration, migration, or a dependency.
4. Assess whether existing backend instances are affected.
5. Execute the approved rollback or recovery procedure when required.
6. Verify recovery.
7. Record the outcome and unresolved risks.

Do not continue rollout merely to determine whether a known failure will spread.

## 9. Controlled Rollout

### 9.1 Expansion Preconditions

Expand beyond the canary only after the canary evidence supports proceeding.

Confirm that:

- The intended image is active.
- Required functional checks pass.
- Error and latency signals are acceptable for the deployment plan.
- Dependencies remain healthy.
- Migration compatibility is maintained.
- No unresolved blocker requires a hold or rollback.

### 9.2 Incremental Expansion

Where supported, expand the deployment in controlled increments.

The increment size and number of stages SHOULD reflect the system's capacity, workload, and failure impact.

Do not assume a universal rollout percentage or fixed number of stages.

### 9.3 Version Overlap

During a rolling deployment, multiple backend versions may run concurrently.

Ensure that the application protocol, configuration, and database schema remain compatible for the duration of that overlap.

If concurrent versions are not supported, use the approved deployment method that avoids unsupported mixed-version operation.

### 9.4 Monitor Each Stage

After each rollout increment, verify that the new instances remain healthy and that application behavior is acceptable.

If an adverse signal appears, pause expansion and follow the canary decision process.

### 9.5 Completion of Rollout

Confirm that the intended backend deployment target has reached the expected image revision.

Check that obsolete instances have been removed or are no longer serving workload as intended.

Verify that background workers and asynchronous consumers have also reached the intended version where applicable.

### 9.6 Rollout Evidence

Record the image digest, deployment stages, observed results, and final deployment state.

If rollout stopped early, document which targets were updated and which remain on the previous version.

## 10. Backend Rollback

### 10.1 Rollback Authority

The global release process defines who can authorize rollback and how rollback decisions are coordinated.

This document defines the backend-specific execution and verification steps.

### 10.2 Rollback Triggers

Potential triggers include:

- Persistent startup or readiness failures.
- A material increase in application errors.
- Unacceptable response latency.
- Incorrect API behavior.
- Data corruption or unexpected persistence behavior.
- Queue processing failures.
- Critical dependency integration failures.
- Security or authorization regressions.
- A migration compatibility problem.
- A failure that prevents the backend from performing its required role.

The actual rollback threshold MUST follow the approved release plan and global policy.

### 10.3 Immediate Containment

When rollback is required:

1. Stop rollout expansion.
2. Preserve relevant deployment and application evidence.
3. Identify the affected backend instances and workloads.
4. Confirm the known-good image digest.
5. Assess whether database changes affect application rollback.
6. Execute the approved backend recovery action.
7. Verify restored service behavior.

Do not remove evidence needed to diagnose the failure.

### 10.4 Application Image Rollback

Deploy the known-good image using the approved deployment mechanism.

Verify the exact image digest of the restored version.

Confirm that the restored application is compatible with the current database schema and configuration.

Do not assume that a previous image is compatible with every later schema revision.

### 10.5 Migration Compatibility Assessment

Before restoring an older application image, determine whether the current database schema remains compatible with that version.

If the migration was additive and backward-compatible, the older version may remain usable, but this MUST be verified rather than assumed.

If compatibility is uncertain, stop and consult the database owner.

### 10.6 Destructive or Irreversible Migrations

If a migration removed or transformed data, do not automatically reverse it.

Assess the available recovery options, including:

- Deploying a compatible application version.
- Applying a corrective migration.
- Restoring data through the approved recovery process.
- Restoring a database backup when authorized and appropriate.

Database restoration can affect data written after the backup. Assess that impact before proceeding.

### 10.7 Rollback Verification

After rollback, verify:

- The known-good image is active.
- Backend readiness is restored.
- Representative API operations work.
- Required database operations work.
- Queue processing resumes where applicable.
- Required dependencies remain accessible.
- Error and latency signals have returned to acceptable levels.
- No unintended duplicate or partial processing has occurred where relevant.

### 10.8 Rollback Failure

If rollback does not restore expected behavior:

1. Stop further deployment changes.
2. Preserve current diagnostic evidence.
3. Determine whether the failure involves the application, configuration, database, or dependencies.
4. Consult the relevant backend, database, or cloud owner.
5. Follow the global incident and recovery process.
6. Record the current system state and remaining risks.

Do not repeatedly switch versions without understanding the resulting application and database state.

### 10.9 Rollback Record

Record:

- Reason for rollback.
- Affected image digest.
- Restored image digest.
- Deployment targets affected.
- Migration state.
- Verification performed.
- Data or workload impact.
- Recovery actions.
- Remaining issues.

Global incident reporting and release closure remain owned by their authoritative documents.

## 11. Post-Release Verification

### 11.1 Purpose

Post-release verification confirms that the deployed backend behaves correctly in the target environment after rollout.

It is distinct from the pre-release test suite.

The verification scope MUST reflect the actual changes and dependencies of the release.

### 11.2 Deployment Identity

Confirm that the deployed backend uses the intended image digest and configuration revision.

Where multiple backend services or workers are released together, verify the intended version of each affected component.

### 11.3 Service Readiness

Verify that the backend is healthy and ready according to the environment's configured readiness checks.

Check for repeated restarts, failed initialization, and unexpected dependency failures.

### 11.4 API Verification

Run representative API checks for the operations affected by the release.

Verify expected response behavior and relevant error handling.

Do not use only a generic health endpoint as proof that all changed functionality works.

### 11.5 Database Verification

Confirm that required migrations completed and that the backend can read and write the affected data.

Verify relevant schema-dependent workflows.

Database-specific integrity checks SHOULD follow the approved database procedures.

### 11.6 Queue Verification

Where asynchronous processing is affected, confirm that messages can be published and consumed as expected.

Check for abnormal backlog growth, repeated processing failures, or stuck consumers.

### 11.7 Storage Verification

Where object storage or artifact handling is affected, verify the relevant upload, retrieval, metadata, or integrity behavior.

Do not perform destructive operations against unrelated data as part of a smoke test.

### 11.8 Dependency Verification

Check the dependencies relevant to the changed backend behavior.

A dependency may be reachable while still returning incorrect or incompatible responses.

Use representative functional probes where available.

### 11.9 Error and Performance Signals

Review the relevant application errors, latency, restart behavior, and resource utilization after deployment.

Compare against an appropriate pre-release baseline when available.

Investigate unexpected changes before declaring the backend release healthy.

### 11.10 Asynchronous Workflows

If the release affects queued jobs or background processing, verify that the relevant workflow can reach its expected completion or terminal state.

The observation period SHOULD account for the normal processing time of the workload.

### 11.11 Security-Sensitive Changes

For releases affecting authentication, authorization, credential handling, or sensitive data access, perform the relevant backend-specific verification.

Follow the applicable security policy and required security review.

### 11.12 Verification Outcome

Record each required check as:

- Passed.
- Failed.
- Blocked.
- Not run.

A blocked or unrun check MUST NOT be represented as passed.

Whether incomplete verification prevents release completion is governed by the global release process and applicable milestone acceptance criteria.

## 12. Release Evidence and Handoff

### 12.1 Backend Release Record

The backend release record SHOULD include:

- Release identifier.
- Source revision.
- Image repository and digest.
- Target environment.
- Configuration revision, where applicable.
- Database migration revision and result.
- Canary outcome.
- Rollout outcome.
- Post-release verification results.
- Rollback status, if applicable.
- Known limitations and follow-up work.

### 12.2 Evidence Quality

Evidence SHOULD be specific, reproducible, and tied to the deployed artifact.

Avoid unsupported statements such as "all tests passed" when only a subset of tests ran.

Identify the exact commands or deployment-platform actions used when those details are necessary to reproduce the result.

### 12.3 Sensitive Information

Release evidence MUST NOT include:

- Passwords.
- Access tokens.
- Private keys.
- Database credentials.
- Unredacted sensitive records.
- Other secrets or restricted operational details.

Review logs and diagnostic output before attaching them to a release record.

### 12.4 Handoff to Global Release Coordination

Provide the global release owner with the backend-specific evidence required by `docs/development/RELEASE_PROCESS.md`.

Report incomplete checks, known limitations, and unresolved migration constraints explicitly.

Do not independently declare global release closure when the global process requires additional domain approvals or evidence.

## 13. Relationship to Phases and Milestones

### 13.1 Canonical Phase Authority

`docs/planning/PHASES.md` is the authoritative source for phase definitions.

This document describes backend release procedures and MUST NOT redefine phase scope.

### 13.2 Canonical Phases

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

### 13.3 Backend Milestones

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| B-M01 | CONTROL PLANE | P3 |
| B-M02 | ARTIFACT | P2-P3 |
| B-M03 | PLATFORM | P3 |
| B-M04 | BOOKING | P4 |
| B-M05 | EXECUTION | P5 |
| B-M06 | RESULTS | P6-P7 |
| B-M07 | PRODUCTION | P8 |

The authoritative dossiers under `docs/backend/milestones/` define backend milestone scope and acceptance.

This document does not independently establish release acceptance criteria for any milestone.

### 13.4 Database Milestones

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| DB-M01 | FOUNDATION | P0-P3 |
| DB-M02 | CORE DATA | P3 |
| DB-M03 | BOOKING DATA | P4 |
| DB-M04 | EXECUTION DATA | P5-P7 |

The authoritative dossiers under `docs/database/milestones/` define database milestone scope and acceptance.

These references identify database work that may affect backend release sequencing; they do not transfer database ownership to the backend team.

### 13.5 Cloud Milestones

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| C-M01 | FOUNDATION | P0 |
| C-M02 | DEVELOPMENT | P1-P3 |
| C-M03 | STAGING | P4-P7 |
| C-M04 | PRODUCTION | P8 |

The authoritative dossiers under `docs/cloud/milestones/` define cloud milestone scope and acceptance.

Cloud deployment implementation and infrastructure readiness remain owned by the cloud domain.

### 13.6 Milestone Scope and Release Evidence

A release may contribute evidence to one or more milestones.

The applicable milestone dossier determines the required evidence and acceptance criteria.

This document MUST NOT duplicate or override those requirements.

## 14. Maintenance and Change Control

### 14.1 When to Update This Document

Update this document when backend release execution changes materially, including:

- Container image build and publication.
- Image identity and promotion.
- Migration sequencing during deployment.
- Canary deployment procedure.
- Rollout expansion.
- Application rollback.
- Migration recovery coordination.
- Post-release verification.
- Backend release evidence.

### 14.2 Global Policy Changes

Changes to global release authorization, release gates, approval requirements, or release closure MUST be made in `docs/development/RELEASE_PROCESS.md`.

This document MUST link to the global policy rather than introduce a competing policy.

### 14.3 Database Procedure Changes

Changes to migration authoring, schema design, or database recovery policy MUST be reflected in the appropriate database-owned documentation.

Update this document only where the backend release sequence or verification procedure is affected.

### 14.4 Build and Infrastructure Changes

Changes to the backend image definition SHOULD be reflected in the repository's container build files and related backend architecture documentation.

Changes to registry infrastructure, deployment topology, or cloud resource provisioning MUST be reflected in the appropriate cloud-owned documentation.

### 14.5 Testing Changes

Backend test implementation procedures are owned by `docs/backend/development/TESTING.md`.

Global test policy is owned by `docs/development/TESTING_STRATEGY.md`.

This document SHOULD reference the applicable test requirements without copying their complete procedures.

### 14.6 Milestone Changes

Changes to milestone scope or acceptance MUST be made in the authoritative dossiers under `docs/**/milestones/`.

This document MUST NOT introduce new milestones or independently redefine their completion criteria.

## 15. Backend Release Checklist

### 15.1 Build and Artifact

- [ ] The intended source revision is identified.
- [ ] The repository's approved container build procedure is used.
- [ ] The image builds successfully.
- [ ] The resulting image is inspected.
- [ ] The image contains no unintended embedded secrets.
- [ ] The image is published to the intended registry.
- [ ] The image digest is recorded.
- [ ] The release record links the source revision to the image digest.

### 15.2 Deployment Preparation

- [ ] The target environment is confirmed.
- [ ] Required configuration is available.
- [ ] Required dependencies are ready.
- [ ] The current schema revision is known.
- [ ] Pending migrations are identified.
- [ ] The application rollback target is known.
- [ ] Migration compatibility and recovery constraints are understood.
- [ ] Canary health and functional checks are prepared.
- [ ] Global release requirements are satisfied.

### 15.3 Database Migrations

- [ ] Migrations follow the approved database process.
- [ ] The target database is verified before execution.
- [ ] Migration ordering and compatibility are reviewed.
- [ ] Required backup or recovery provisions are available where applicable.
- [ ] Migration execution outcome is recorded.
- [ ] Resulting schema and data changes are verified.
- [ ] Backend compatibility with the resulting schema is confirmed.
- [ ] Migration rollback constraints are documented.

### 15.4 Canary and Rollout

- [ ] The canary uses the intended image digest.
- [ ] Startup and readiness checks pass.
- [ ] Representative functional checks pass.
- [ ] Relevant error, latency, and dependency signals are reviewed.
- [ ] The observation window is appropriate for the workload.
- [ ] The canary decision is recorded.
- [ ] Rollout expansion follows the approved plan.
- [ ] Mixed-version compatibility is maintained where required.
- [ ] Final deployment state is verified.

### 15.5 Rollback Readiness

- [ ] Rollback triggers are understood.
- [ ] The known-good image digest is available.
- [ ] Application and schema compatibility is assessed.
- [ ] Destructive or irreversible migration constraints are understood.
- [ ] The recovery procedure is known.
- [ ] Rollback verification checks are defined.

### 15.6 Post-Release Verification

- [ ] The deployed image digest is verified.
- [ ] Backend readiness is confirmed.
- [ ] Representative API operations are checked.
- [ ] Relevant database operations are checked.
- [ ] Queue processing is verified where applicable.
- [ ] Storage operations are verified where applicable.
- [ ] Relevant dependencies are checked.
- [ ] Error and performance signals are reviewed.
- [ ] Required asynchronous workflows are verified.
- [ ] Incomplete checks are explicitly recorded.
- [ ] Backend release evidence is handed to the global release owner.

## 16. Definition of Done

Backend release execution is adequately documented and evidenced when:

1. The exact backend source revision and image digest are identified.
2. The container image has been built and published through the approved process.
3. The target environment and configuration are verified.
4. Required migrations have been identified, executed, and validated through the approved database process.
5. Application and schema compatibility have been considered throughout rollout.
6. Canary behavior has been evaluated using relevant health and functional evidence.
7. Rollout expansion has followed the approved deployment plan.
8. A known-good application rollback target and migration recovery constraints are understood.
9. Rollback verification has been performed if rollback was required.
10. Post-release backend verification has been recorded.
11. Known limitations and incomplete checks are visible to the release owner.
12. Global release policy and release closure remain owned by `docs/development/RELEASE_PROCESS.md`.
13. Database, cloud, security, testing, and milestone acceptance responsibilities remain with their authoritative owners.
14. Phase and milestone references follow the frozen canonical model.

This document owns backend-specific release execution only: container image build, migration sequencing during release, canary deployment and rollback, and post-release verification. Global release policy remains owned by `docs/development/RELEASE_PROCESS.md`; all other cross-domain requirements remain with their authoritative documents.
