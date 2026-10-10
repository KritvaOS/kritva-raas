# Frontend Release Process

**Project:** Kritva RaaS  
**Document:** `docs/frontend/development/RELEASE_PROCESS.md`  
**Scope:** Frontend-specific release procedures for Studio desktop packaging, code signing and notarization, desktop auto-update, Web Console deployment, and desktop release rollback  
**Audience:** Frontend engineers, release engineers, desktop application maintainers, and deployment reviewers  
**Status:** Frontend release procedure

## 1. Purpose

This document defines the frontend-specific steps required to prepare, package, publish, deploy, verify, and recover Kritva RaaS frontend releases.

It covers:

- Studio desktop application packaging.
- Operating-system-specific release artifacts.
- Desktop application code signing and notarization.
- Desktop application version and compatibility metadata.
- Auto-update publication and validation.
- Web Console build and deployment hand-off.
- Frontend release smoke testing.
- Desktop release rollback and recovery.
- Frontend-specific release evidence and traceability.
- Coordination with backend, protocol, security, and infrastructure owners.

This document complements the global release policy. It does not define the repository-wide release approval process, release branching, global versioning policy, CI release gates, or overall production release authorization.

## 2. Ownership and Boundaries

### 2.1 What This Document Owns

This document owns frontend-specific release implementation and operational steps:

- Packaging the Studio desktop application for supported operating systems.
- Identifying and validating frontend release artifacts.
- Configuring frontend-specific signing and notarization steps.
- Preparing desktop auto-update metadata and release manifests.
- Publishing frontend desktop update artifacts.
- Preparing and deploying the Web Console frontend bundle.
- Performing frontend-specific deployment verification.
- Validating frontend compatibility with the supported backend and Local Runtime interfaces.
- Coordinating frontend rollback and recovery.
- Capturing frontend-specific release evidence.
- Defining frontend release smoke-test expectations.

### 2.2 Global Release Policy Ownership

`docs/development/RELEASE_PROCESS.md` is the authoritative document for global release policy.

It owns:

- Release governance and authorization.
- Repository-wide versioning policy.
- Global release readiness criteria.
- Branching, tagging, and merge requirements.
- Release approval and change-control requirements.
- Cross-domain release coordination.
- Global CI release gates.
- Organization-wide release records.
- Release communication policy.
- Global incident escalation and release cancellation authority.

This frontend document MUST follow that policy and MUST NOT redefine it.

Where a global policy requires approval, tagging, or authorization, the frontend release process MUST use the prescribed mechanism rather than introduce a frontend-only alternative.

### 2.3 Other Document Ownership

| Concern | Authoritative document |
|---|---|
| Global release policy | `docs/development/RELEASE_PROCESS.md` |
| Global development workflow | Applicable documents under `docs/development/` |
| Global development setup | `docs/development/DEVELOPMENT_SETUP.md` |
| Frontend development setup | `docs/frontend/development/DEVELOPMENT_SETUP.md` |
| Frontend development workflow | `docs/frontend/development/DEVELOPMENT_WORKFLOW.md` |
| Frontend testing | `docs/frontend/development/TESTING.md` |
| Frontend architecture | Applicable architecture documents under `docs/frontend/` |
| Frontend architecture decisions | `docs/frontend/planning/DECISIONS.md` |
| Frontend milestone scope and acceptance | Authoritative dossiers under `docs/frontend/milestones/` |
| Canonical phase definitions | `docs/planning/PHASES.md` |
| Product and system decisions | `docs/planning/DECISIONS.md` |
| API contract | `docs/protocol/API_CONTRACT.md` |
| Event contract | `docs/protocol/EVENT_CONTRACT.md` |
| Artifact contract and manifest | `docs/protocol/ARTIFACT_MANIFEST.md` |
| Backend implementation architecture | `docs/backend/architecture/BACKEND_ARCHITECTURE.md` |
| Backend API implementation | `docs/backend/architecture/API_IMPLEMENTATION.md` |
| Database implementation architecture | `docs/database/architecture/DATABASE_ARCHITECTURE.md` |
| Cloud deployment implementation | `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` |
| Cloud infrastructure security | `docs/cloud/architecture/SECURITY_ARCHITECTURE.md` |
| Application security and trust boundaries | `docs/architecture/SECURITY_ARCHITECTURE.md` and applicable documents under `docs/security/` |
| Cross-domain milestone scope | Applicable authoritative dossiers under `docs/**/milestones/` |

The actual signing infrastructure, cloud deployment implementation, and native runtime compatibility requirements remain owned by their respective implementation teams and documents.

### 2.4 Explicit Non-Goals

This document MUST NOT become the authoritative home for:

- Global release policy or approval requirements.
- Repository-wide release tagging and versioning rules.
- General CI/CD architecture.
- Cloud infrastructure provisioning and operations.
- Backend deployment procedures.
- Database migration and rollback procedures.
- Complete application security policy.
- API or event contract definitions.
- Native runtime implementation and release procedures.
- Milestone acceptance criteria.
- General development setup or testing strategy.

When a topic belongs elsewhere, this document MUST link to its authoritative owner.

## 3. Frontend Release Principles

### 3.1 Release Only Approved Changes

Frontend release candidates MUST satisfy the applicable global release policy.

The frontend team MUST NOT bypass required approvals or publish an unapproved release because packaging or deployment is technically possible.

### 3.2 Keep Release Artifacts Identifiable

Every published frontend artifact MUST be associated with an identifiable application version and release record.

The release record SHOULD identify the source revision, artifact type, target platform, build configuration, and relevant compatibility information.

### 3.3 Separate Build, Publication, and Activation

Creating an artifact, publishing it, and making it available to users are distinct operations.

The release process SHOULD preserve this separation where the platform supports it.

A successful build MUST NOT be treated as proof that the artifact has been published, signed, deployed, or activated successfully.

### 3.4 Preserve Artifact Integrity

Published artifacts MUST be protected against unauthorized modification.

Signing, checksums, provenance, and transport security MUST follow the applicable security and release policies.

The frontend release process MUST NOT weaken verification requirements to work around a packaging failure.

### 3.5 Verify the User-Facing Result

Release validation MUST verify the actual packaged desktop application or deployed Web Console.

A development-server test alone is insufficient evidence that the production artifact works correctly.

### 3.6 Make Recovery Deliberate

The release process MUST identify how to stop further distribution of a faulty release and how to restore a known-good user experience.

Desktop rollback may require a corrective release rather than a binary downgrade. Recovery MUST respect update security and version compatibility.

### 3.7 Protect Credentials

Signing keys, notarization credentials, deployment tokens, and update-signing keys MUST be managed through approved secret-management mechanisms.

Credentials MUST NOT be committed to the repository or embedded in frontend bundles.

## 4. Frontend Release Types

### 4.1 Studio Desktop Release

A Studio desktop release distributes the desktop application for supported operating systems.

It may include:

- Application bundles.
- Installer packages.
- Platform-specific signing metadata.
- Update manifests.
- Update packages.
- Checksums and provenance records.

The actual supported platforms and package formats MUST follow the current product architecture and release configuration.

### 4.2 Web Console Release

A Web Console release publishes the frontend web bundle to the approved deployment environment.

The release MAY involve:

- Building static assets.
- Producing a deployment bundle.
- Publishing assets to the approved hosting service.
- Updating application entry points.
- Invalidating relevant caches.
- Running smoke tests.
- Confirming the deployed version.

Infrastructure provisioning and hosting configuration remain owned by the cloud implementation documentation.

### 4.3 Coordinated Frontend Release

A coordinated release occurs when Studio and Web Console changes must be released together or must interoperate with a common backend or protocol change.

The release MUST identify dependencies and compatibility assumptions.

The global release policy governs overall coordination and authorization.

### 4.4 Corrective Release

A corrective release addresses a defect in a published frontend release.

It MUST follow the same global release authorization requirements as other releases.

The frontend team SHOULD prioritize restoring correct user behavior and limiting further exposure while preserving artifact integrity and auditability.

## 5. Release Readiness Inputs

### 5.1 Source Revision

The frontend release MUST identify the exact approved source revision used to produce the release artifacts.

The release process MUST follow the global policy for selecting, tagging, and recording that revision.

### 5.2 Application Version

The application version MUST match the approved versioning policy.

Desktop package metadata, Web Console version metadata, and auto-update manifests MUST remain consistent with the intended release.

Do not invent a separate frontend versioning scheme if the global policy already defines one.

### 5.3 Configuration

Release configuration MUST be reviewed for the target environment.

Verify:

- API endpoint configuration.
- Realtime or event endpoint configuration.
- Local Runtime configuration.
- Public feature configuration.
- Application identity and package metadata.
- Update feed configuration.
- Environment-specific security settings.

Private credentials MUST NOT be included in public frontend configuration.

### 5.4 Compatibility

Identify dependencies on:

- Backend API behavior.
- Event contract behavior.
- Artifact metadata.
- Local Runtime commands and lifecycle.
- Desktop operating-system requirements.
- Auto-update compatibility.
- Browser and Web Console deployment behavior.

The frontend MUST use approved contracts and supported interfaces.

### 5.5 Validation Evidence

Review the relevant frontend test results using `docs/frontend/development/TESTING.md`.

Required global checks and approval gates remain defined by `docs/development/RELEASE_PROCESS.md` and the applicable global CI policy.

### 5.6 Release Notes

Prepare frontend release notes describing material user-visible changes, compatibility considerations, known limitations, and corrective actions.

Release notes MUST follow the global release communication policy.

Do not disclose secrets, sensitive internal diagnostics, or information prohibited by the applicable security policy.

## 6. Studio Desktop Packaging Workflow

### 6.1 Packaging Objective

The packaging process MUST produce installable or distributable Studio artifacts for the supported operating systems.

Each artifact MUST be built from the approved source revision using the intended release configuration.

### 6.2 Pre-Packaging Checks

Before packaging:

1. Confirm the approved source revision and version.
2. Verify frontend dependencies and lockfile consistency.
3. Run the required frontend validation.
4. Confirm production environment configuration.
5. Confirm desktop package metadata.
6. Confirm platform-specific build prerequisites.
7. Verify that signing credentials are available through approved mechanisms.
8. Confirm that generated artifacts will be stored in the intended release location.

Global setup instructions belong to `docs/frontend/development/DEVELOPMENT_SETUP.md`.

### 6.3 Release Build Configuration

The release build MUST use production settings rather than development-server defaults.

Check that:

- Development endpoints are not embedded accidentally.
- Debug-only behavior is disabled where required.
- Source maps follow the approved exposure policy.
- Application identity is correct.
- Update endpoints point to the intended environment.
- Native capabilities match the approved application configuration.
- Build metadata identifies the intended version.

### 6.4 Build Reproducibility

Where supported, the build process SHOULD produce repeatable artifacts from the same source revision and declared inputs.

Record relevant toolchain versions and build configuration.

Unexpected artifact differences SHOULD be investigated before publication.

### 6.5 Artifact Inventory

For every desktop target, maintain an inventory containing:

- Application version.
- Source revision.
- Operating-system target.
- Architecture.
- Package format.
- Artifact filename.
- Artifact size.
- Checksum or integrity metadata.
- Signing status.
- Notarization status where applicable.
- Build timestamp.
- Publication location.

The inventory SHOULD be generated or validated automatically where tooling supports it.

### 6.6 Packaging Validation

Before signing or publication, verify that:

- The expected artifact exists.
- The artifact is not empty or truncated.
- Package metadata is correct.
- The expected application identifier is present.
- Included assets are present.
- No development-only secrets or configuration are included.
- The artifact can be inspected using the target platform's packaging tools.

A successful build command alone is not sufficient.

## 7. Linux Desktop Packaging

### 7.1 Supported Targets

The actual supported Linux distributions, architectures, and package formats MUST be defined by the product's supported-platform policy.

This document does not establish new platform support commitments.

### 7.2 Build Environment

Build the Linux desktop artifact in the approved Linux build environment.

The environment SHOULD match the runtime libraries and system dependencies expected on supported targets.

Record the build image or environment version when reproducibility depends on it.

### 7.3 Package Formats

Use the package formats approved for the current product release.

Depending on the supported distribution strategy, these MAY include native distribution packages or portable application bundles.

Do not publish additional package formats without confirming support, validation, and maintenance requirements.

### 7.4 Package Metadata

Validate:

- Application identifier.
- Product name.
- Version.
- Architecture.
- Required dependencies.
- Desktop entry and application icon.
- File associations or permissions where applicable.
- Installer and uninstall behavior.

Package metadata MUST match the intended product identity.

### 7.5 Signing and Integrity

Apply the approved integrity and signing controls for the chosen distribution mechanism.

If the selected package format does not support a platform-native signing workflow, provide the integrity verification mechanism required by the global release policy.

### 7.6 Installation Smoke Test

On a supported Linux environment:

1. Install the packaged application.
2. Launch Studio using the normal user workflow.
3. Verify application startup.
4. Confirm configuration points to the intended environment.
5. Exercise representative UI navigation.
6. Verify expected Local Runtime availability behavior.
7. Confirm that logs and errors are usable for diagnosis.
8. Uninstall or replace the package using the supported procedure.

Record the environment and observed result.

### 7.7 Linux Release Failure

If the package fails to install or launch:

- Stop publication of the affected artifact.
- Preserve diagnostic output.
- Identify whether the defect is packaging-related, dependency-related, or application-related.
- Correct the cause and rebuild from the approved source.
- Repeat the relevant validation before publication.

Do not declare a package supported based only on a successful build on the build machine.

## 8. Windows Desktop Packaging

### 8.1 Supported Targets

Windows versions, architectures, and package formats MUST follow the approved product support policy.

### 8.2 Build and Package

Build the Studio desktop application in the approved Windows release environment.

Validate the generated installer or application package using the intended distribution mechanism.

### 8.3 Package Metadata

Verify:

- Product name and application identity.
- Version and architecture.
- Installer metadata.
- Required runtime dependencies.
- Application icon and display metadata.
- Installation directory behavior.
- Upgrade and uninstall behavior.

### 8.4 Code Signing

Sign Windows release artifacts using the approved signing identity and signing process.

Verify the signature after signing.

Signing credentials MUST be protected and MUST NOT be included in the repository or distributed package.

Where the distribution model signs multiple artifact layers, validate each required layer.

### 8.5 Installation and Upgrade Validation

On a supported Windows environment:

1. Install the packaged application.
2. Launch Studio.
3. Confirm the displayed version.
4. Verify representative navigation and application behavior.
5. Confirm expected runtime availability handling.
6. Upgrade from a supported prior release where required.
7. Verify that the upgrade preserves the expected user configuration.
8. Uninstall and reinstall when relevant to the distribution model.

### 8.6 Windows Release Failure

If installation, signing, launch, or upgrade validation fails, withhold the affected artifact from publication.

Correct the issue, rebuild, re-sign, and repeat the relevant checks.

Do not modify a signed artifact after signing.

## 9. macOS Desktop Packaging

### 9.1 Supported Targets

The supported macOS versions, architectures, and package formats MUST follow the approved product support policy.

### 9.2 Build Environment

Use the approved macOS build environment and signing toolchain.

Record relevant build environment information where required for reproducibility or diagnosis.

### 9.3 Application Identity

Verify the application bundle identifier, version, entitlements, and other signing-related metadata.

The configured identity MUST match the approved application identity and intended distribution channel.

### 9.4 Code Signing

Sign the application using the approved Developer ID or other authorized signing identity appropriate to the distribution model.

Validate the resulting signature and required entitlements.

Do not add unnecessary entitlements to work around a launch or IPC failure.

### 9.5 Notarization

Where required by the selected macOS distribution method, submit the signed artifact for notarization using the approved process.

Verify the notarization result and staple the ticket where applicable.

A submitted artifact MUST NOT be treated as notarized until the result has been confirmed.

### 9.6 Package Validation

Verify that:

- The application bundle is complete.
- The signature is valid.
- Required entitlements are correct.
- Notarization has completed where required.
- The package opens on a supported test environment.
- The expected application version is displayed.
- Update behavior is compatible with the release channel.

### 9.7 macOS Release Failure

If signing or notarization fails:

- Preserve the relevant diagnostic output.
- Confirm the signing identity and entitlement configuration.
- Verify that the package has not changed unexpectedly.
- Correct the issue and rebuild if required.
- Re-sign and repeat notarization when the artifact changes.
- Validate the final distributed artifact.

Do not bypass required signing or notarization controls to accelerate publication.

## 10. Code Signing and Notarization Management

### 10.1 Signing Policy

Signing and notarization MUST follow the applicable global release and security requirements.

This document defines the frontend packaging steps, not the organization's complete key-management or certificate-governance policy.

### 10.2 Credential Handling

Signing and notarization credentials MUST be provided through approved secret-management or signing infrastructure.

They MUST NOT be:

- Committed to source control.
- Included in application bundles.
- Printed in CI logs.
- Embedded in frontend JavaScript.
- Shared through unapproved artifact locations.
- Exposed in release evidence.

### 10.3 Signing Order

Where the platform requires signing before packaging, notarization, or update publication, follow the platform's required order.

Any operation that modifies signed content after signing MUST trigger the required re-signing and re-validation steps.

### 10.4 Verification

Verify the final distributed artifact rather than relying only on the signing command's exit status.

The verification SHOULD confirm the expected signer, application identity, integrity, and notarization state where applicable.

### 10.5 Certificate or Key Rotation

When signing credentials are rotated, validate the new signing path before using it for a production release.

Where auto-update verification depends on a separate update-signing key, treat that key and its rotation as a distinct compatibility concern.

### 10.6 Signing Failure

A signing or notarization failure MUST prevent publication of the affected artifact when signing is required.

Record the failure, correct the cause, and repeat verification.

Do not downgrade security controls as an ad hoc workaround.

## 11. Desktop Auto-Update

### 11.1 Purpose

The auto-update mechanism delivers approved Studio updates to installed desktop clients.

Its implementation MUST follow the frontend architecture, supported desktop framework, and authoritative update configuration.

### 11.2 Update Metadata

The update metadata SHOULD identify:

- Application version.
- Target platform and architecture.
- Artifact location.
- Integrity or signature metadata.
- Release channel.
- Compatibility information required by the updater.

The actual metadata schema MUST follow the updater implementation and its authoritative contract.

### 11.3 Version Compatibility

Before publishing an update, verify that the new version can upgrade from the supported prior versions.

Consider changes to:

- Application configuration.
- Local user data.
- IPC commands and events.
- Local Runtime compatibility.
- Update metadata.
- Platform-specific package formats.

Do not assume that an older client can interpret new update metadata unless compatibility is established.

### 11.4 Update Signing

When the updater requires signed metadata or signed packages, produce and verify the required signatures using the approved process.

Do not distribute update metadata that points to an unsigned or incorrect artifact.

### 11.5 Update Feed Publication

Before publishing an update feed:

1. Validate the target version.
2. Confirm that the platform-specific artifacts exist.
3. Verify integrity and signature metadata.
4. Confirm the artifact locations.
5. Validate compatibility information.
6. Confirm the intended release channel.
7. Ensure that the feed does not reference a partially uploaded artifact.

Where supported, upload artifacts before publishing metadata that makes them discoverable.

### 11.6 Staged Distribution

If staged distribution is supported, use the approved release-channel and rollout controls.

A staged rollout SHOULD allow the team to observe failures before broadening distribution.

Do not invent rollout percentages or automatic promotion rules without an approved release configuration.

### 11.7 Update Validation

Validate the update path using representative supported prior versions.

Verify that:

- The client discovers the update.
- The update metadata is accepted.
- Integrity verification succeeds.
- The update can be downloaded.
- Installation or activation completes correctly.
- The updated application launches.
- Existing user data is handled as intended.
- Failure produces a safe and understandable result.

### 11.8 Update Failure

If update validation fails:

- Stop further distribution where possible.
- Preserve the failing artifact and relevant diagnostics.
- Identify whether the issue is in metadata, signing, transport, installation, or application startup.
- Correct the problem through an approved release.
- Repeat the affected upgrade tests.

The frontend MUST NOT disable update signature verification to make a release install.

### 11.9 Auto-Update Rollback

If a published update is faulty, follow Section 14.

Removing or replacing an update feed entry may prevent additional clients from discovering the update, but it does not necessarily revert clients that have already installed it.

A corrective update may be required.

## 12. Web Console Deployment

### 12.1 Deployment Ownership

This section owns frontend bundle preparation and deployment verification.

Cloud infrastructure provisioning, service topology, access control, and hosting-resource configuration remain owned by `docs/cloud/architecture/CLOUD_ARCHITECTURE.md` and applicable cloud operations documentation.

Global release authorization remains owned by `docs/development/RELEASE_PROCESS.md`.

### 12.2 Build Preparation

Before building the Web Console:

1. Confirm the approved source revision and application version.
2. Verify frontend dependencies and lockfile consistency.
3. Run the applicable frontend validation.
4. Select the intended deployment environment.
5. Verify API and event endpoint configuration.
6. Confirm public configuration values.
7. Check that no development-only settings remain.
8. Confirm the expected output directory and artifact format.

### 12.3 Environment Configuration

The bundle MUST use configuration appropriate to the intended environment.

Public frontend configuration MUST NOT contain secrets.

API and event endpoints MUST match the approved deployment configuration.

Where runtime configuration is used, validate the final configuration served to the browser rather than assuming that build-time settings are the only source.

### 12.4 Build Artifact Validation

Before deployment, verify that:

- The build completed successfully.
- The expected entry point exists.
- Required static assets are present.
- Asset references resolve correctly.
- The application version is identifiable.
- Source-map publication follows the approved policy.
- No development server or local-only endpoint is embedded.
- The artifact inventory identifies the source revision.

### 12.5 Deployment Package

Prepare the deployment package according to the approved hosting implementation.

The package SHOULD preserve the expected asset paths and content types.

Do not manually edit generated production assets as a substitute for correcting their source or build configuration.

### 12.6 Publication

Deploy the frontend bundle through the approved deployment mechanism.

Follow the global release process for authorization, environment selection, and publication records.

Where supported, preserve the previously deployed version so that frontend rollback can be performed without rebuilding the prior release.

### 12.7 Cache and Asset Handling

When publishing content-hashed assets, ensure that the deployed entry point references assets that are available in the target environment.

Cache invalidation MUST follow the hosting implementation's requirements.

Do not remove assets still referenced by active entry points or supported cached application versions unless the deployment design guarantees that doing so is safe.

### 12.8 Post-Deployment Smoke Test

After deployment:

1. Open the deployed Web Console.
2. Confirm that the expected version is served.
3. Check browser console errors.
4. Verify key navigation.
5. Confirm API connectivity.
6. Verify relevant event or realtime behavior.
7. Check important empty and error states where appropriate.
8. Confirm that static assets load successfully.
9. Verify that no development endpoints or unexpected debug settings are active.

Use `docs/frontend/development/TESTING.md` for frontend testing conventions.

### 12.9 Deployment Failure

If the deployed frontend is broken:

- Stop further rollout where possible.
- Determine whether the issue is in the bundle, configuration, asset publication, cache, or dependency compatibility.
- Restore the previous frontend bundle or apply an approved corrective deployment.
- Repeat the smoke tests.
- Record the outcome according to the global release policy.

Backend and database recovery MUST be handled by their respective owners.

## 13. Frontend Release Smoke Testing

### 13.1 Purpose

Frontend release smoke tests provide a focused check that the published artifact is usable in its target environment.

They do not replace the full testing strategy or milestone acceptance criteria.

### 13.2 Studio Smoke Tests

For a desktop release, verify:

- The application installs or launches through the supported distribution path.
- The application displays the expected version.
- Primary navigation is functional.
- Environment configuration is correct.
- Expected service-unavailable states are handled.
- IPC integration behaves as expected for the tested environment.
- No critical startup errors are present.
- The update mechanism behaves correctly when included in the release.

### 13.3 Web Console Smoke Tests

For a Web Console release, verify:

- The expected deployment is served.
- The entry point and required assets load.
- Primary navigation works.
- API requests reach the intended environment.
- Realtime or event connections behave as expected.
- Critical user journeys remain usable.
- Browser console errors do not indicate a release-blocking defect.
- The deployed version matches the release record.

### 13.4 Environment Limitations

If a smoke test cannot be run because a dependency is unavailable, record the limitation and notify the responsible owner.

Do not claim that a test passed when it was skipped or blocked.

Whether the limitation prevents release is governed by the global release policy and the applicable milestone dossier.

### 13.5 Evidence

Retain appropriate evidence, such as:

- Artifact inventory.
- Signature verification results.
- Notarization results where applicable.
- Installation or update test results.
- Deployment version information.
- Smoke-test outcomes.
- Relevant screenshots or logs.
- Known limitations and corrective actions.

Evidence MUST NOT include signing credentials, private tokens, or unnecessary sensitive data.

## 14. Desktop Release Rollback and Recovery

### 14.1 Purpose

This section describes frontend-specific recovery when a published Studio release causes a material defect.

Global release cancellation, incident escalation, and production authorization remain governed by `docs/development/RELEASE_PROCESS.md`.

### 14.2 Rollback Principles

Rollback MUST prioritize user safety, artifact integrity, and compatibility.

The appropriate response depends on whether the defect affects:

- Artifact installation.
- Application startup.
- User-visible functionality.
- IPC behavior.
- Local Runtime compatibility.
- Auto-update.
- User configuration or local data.

Do not assume that downgrading the application binary is safe after a version has changed persistent data or configuration.

### 14.3 Immediate Containment

When a release defect is confirmed:

1. Notify the release owner through the global incident or release process.
2. Identify the affected application version and platform.
3. Stop or pause further distribution where supported.
4. Disable further discovery of the faulty update where appropriate.
5. Preserve the faulty artifact and diagnostic evidence.
6. Determine whether installed clients are affected.
7. Identify the safest recovery path.

The frontend team MUST NOT unilaterally bypass global release governance.

### 14.4 Revert the Update Feed

If the defect is confined to a newly published update, update the feed or rollout configuration using the approved mechanism.

Verify that clients no longer discover the faulty release where the mechanism supports this behavior.

This action does not revert clients that have already installed the update.

### 14.5 Restore a Known-Good Release

Where supported, republish or reactivate a known-good artifact using the approved distribution process.

Verify the artifact's integrity, signing, compatibility, and publication metadata.

Do not modify a previously signed artifact in place.

If republishing an earlier version is not supported or is unsafe, prepare a corrective release instead.

### 14.6 Corrective Release

A corrective release SHOULD:

- Fix the confirmed defect.
- Preserve the required compatibility guarantees.
- Pass the relevant frontend tests.
- Pass signing and notarization requirements.
- Pass installation or update validation.
- Pass the required smoke tests.
- Follow global release approval requirements.

The corrective release MUST have an identifiable version and release record.

### 14.7 User Data and Configuration

Before recommending a downgrade, determine whether the faulty release changed local configuration, caches, or persistent data.

A rollback MUST NOT silently destroy or corrupt user data.

If a migration is irreversible or incompatible with an older version, use an approved forward-fix or recovery approach.

### 14.8 Web Console Rollback

For a Web Console defect, restore the prior known-good frontend bundle or perform an approved corrective deployment.

Verify the entry point, asset availability, and cache behavior after recovery.

A frontend rollback MUST NOT attempt to reverse backend or database changes that it does not own.

### 14.9 Recovery Verification

After recovery, verify:

- The intended version is distributed or served.
- Faulty update discovery has been stopped where appropriate.
- The application launches and behaves correctly.
- API and event integration remain compatible.
- Desktop signatures and update metadata remain valid.
- Web Console assets are available and consistent.
- The original failure no longer reproduces in the tested environment.

Record residual limitations through the global release process.

### 14.10 Rollback Completion

Rollback is complete from the frontend perspective when the affected distribution path has been contained, the selected recovery has been validated, and the release record captures the result.

Global incident closure and production release status remain owned by the global release process.

## 15. Security and Release Integrity

### 15.1 Artifact Integrity

Every published artifact MUST use the integrity controls required by the distribution mechanism.

Checksums, signatures, provenance, and publication metadata SHOULD be retained where supported and required.

### 15.2 Secrets

The frontend bundle MUST NOT contain private signing keys, update-signing secrets, deployment credentials, or backend service credentials.

Only configuration explicitly intended to be public may be shipped to the browser or desktop frontend.

### 15.3 Dependency Changes

Frontend dependency changes MUST follow the repository's normal review and validation process.

Release preparation SHOULD inspect unexpected dependency or lockfile changes.

Security vulnerability handling and organization-wide dependency policy remain owned by the applicable global security and development documents.

### 15.4 Permissions

Desktop package permissions and native capabilities MUST be consistent with the approved application security model.

Do not grant additional filesystem, process, network, or native command capabilities solely to make a release smoke test pass.

### 15.5 Release Evidence

Release evidence MUST be stored in approved locations and follow the applicable access-control policy.

Do not publish internal diagnostics or environment details that expose secrets or sensitive infrastructure information.

## 16. Relationship to Phases and Milestones

### 16.1 Phase Authority

`docs/planning/PHASES.md` is the canonical source for phase definitions.

This document describes release implementation practices and does not redefine phase scope.

### 16.2 Canonical Phases

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

### 16.3 Frontend Milestones

| Milestone | Canonical name | Phase mapping |
|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 |
| F-M02 | PROJECTS | P1 |
| F-M03 | BUILD & ARTIFACT | P2 |
| F-M04 | BOOKING | P4 |
| F-M05 | EXECUTION | P5 |
| F-M06 | LIVE | P7 |
| F-M07 | RESULTS | P7 |

The authoritative dossiers under `docs/frontend/milestones/` define milestone scope and acceptance.

This document MUST NOT add release deliverables to a milestone or replace its acceptance criteria.

### 16.4 Cross-Domain Dependencies

Frontend release readiness may depend on backend, database, cloud, protocol, or runtime capabilities.

The corresponding domain owner MUST validate those dependencies through its authoritative architecture and milestone documents.

A frontend smoke test MUST NOT be treated as proof that an untested backend, database, or runtime release is correct.

## 17. Release Records and Maintenance

### 17.1 Frontend Release Record

The frontend release record SHOULD identify:

- Application and release version.
- Approved source revision.
- Target operating systems and architectures.
- Desktop package formats.
- Web Console artifact identity where applicable.
- Artifact checksums and signing status.
- Notarization status where applicable.
- Auto-update feed or release channel.
- Deployment environment.
- Smoke-test results.
- Known limitations.
- Rollback or corrective-release information where relevant.

The global release process determines the authoritative record location and required fields.

### 17.2 Artifact Retention

Retain artifacts and metadata according to the global release and artifact-retention policy.

Preserve known-good artifacts when required to support rollback, audit, or reproduction.

Do not delete artifacts that may still be referenced by published update metadata or supported installed versions.

### 17.3 Updating This Document

Update this document when frontend release implementation changes materially, including:

- Supported desktop packaging mechanisms.
- Signing or notarization workflows.
- Auto-update implementation.
- Web Console artifact format.
- Deployment verification.
- Frontend rollback procedures.
- Frontend release evidence requirements.

### 17.4 Global Policy Changes

Changes to global release authorization, versioning, branching, tagging, or release gates MUST be made in `docs/development/RELEASE_PROCESS.md`.

This file MUST link to the global policy rather than duplicate or override it.

### 17.5 Architecture and Contract Changes

Material frontend release architecture changes SHOULD be reviewed against the frontend architecture and recorded through `docs/frontend/planning/DECISIONS.md` when appropriate.

API, event, and artifact compatibility MUST follow their authoritative protocol contracts.

Cloud deployment implementation MUST follow `docs/cloud/architecture/CLOUD_ARCHITECTURE.md`.

Application security requirements MUST follow the authoritative security architecture and applicable security documents.

## 18. Frontend Release Checklist

### 18.1 Release Preparation

- [ ] The approved source revision and version are identified.
- [ ] Relevant frontend tests have been reviewed.
- [ ] Production configuration is correct.
- [ ] API and event endpoints match the intended environment.
- [ ] IPC and Local Runtime compatibility assumptions are understood.
- [ ] Required signing credentials are available through approved mechanisms.
- [ ] The release follows the global authorization process.

### 18.2 Studio Packaging

- [ ] Every intended platform artifact was generated.
- [ ] Package metadata and application identity are correct.
- [ ] Required dependencies and assets are present.
- [ ] No development-only secrets or configuration are included.
- [ ] Artifact integrity information is recorded.
- [ ] Signing has been verified.
- [ ] Notarization has been verified where applicable.
- [ ] Installation and launch checks have been completed.

### 18.3 Auto-Update

- [ ] Update metadata matches the intended version and platform.
- [ ] Artifact locations are valid.
- [ ] Required signatures and integrity metadata are correct.
- [ ] Compatibility with supported prior versions has been assessed.
- [ ] Update installation and launch have been tested.
- [ ] Failure and containment procedures are understood.

### 18.4 Web Console Deployment

- [ ] The production bundle was built from the approved revision.
- [ ] Environment configuration is correct.
- [ ] Required assets are present.
- [ ] Deployment used the approved mechanism.
- [ ] Cache and asset references are consistent.
- [ ] The deployed version was verified.
- [ ] Frontend smoke tests passed or limitations were recorded.

### 18.5 Recovery Readiness

- [ ] A known-good artifact or corrective-release path is identified.
- [ ] Faulty update distribution can be stopped where supported.
- [ ] User-data compatibility has been considered.
- [ ] The rollback or corrective-release process follows global policy.
- [ ] Recovery verification steps are defined.
- [ ] Release evidence can be located.

## 19. Definition of Done

The frontend release process is adequately documented when:

1. Its ownership boundary with the global release process is explicit.
2. Studio packaging steps cover the supported operating-system targets.
3. Signing and notarization are verified where required.
4. Auto-update metadata and artifacts are validated before publication.
5. Web Console deployment includes artifact and post-deployment checks.
6. Frontend smoke testing is distinguishable from global release acceptance.
7. Desktop and Web Console rollback paths are documented.
8. Signing credentials and frontend configuration are handled securely.
9. Release evidence is traceable to the approved source revision and artifact.
10. Global release policy remains owned by `docs/development/RELEASE_PROCESS.md`.
11. Milestone scope remains owned by the authoritative dossiers under `docs/frontend/milestones/`.
12. Phase and milestone references use the frozen canonical model.
13. Backend, database, cloud, protocol, and runtime responsibilities remain with their respective owners.

This document owns frontend-specific release implementation only. Global release governance remains owned by `docs/development/RELEASE_PROCESS.md`; infrastructure, contracts, security policy, and milestone acceptance remain owned by their respective authoritative documents.
