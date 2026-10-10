# B-M02-ARTIFACT — Changelog

Milestone: B-M02 — Artifact

# 11 Changelog

## Added

- Date:
- Change:
- Task:
- Author:
- Evidence:

## Changed

- Date:
- Change:
- Task:
- Author:
- Evidence:

## Fixed

- Date:
- Issue:
- Task:
- Author:
- Evidence:

## Removed

- Date:
- Change:
- Reason:
- Task:
- Author:
- Evidence:

## Notes

- Initial B-M02 milestone dossier.
- No implementation is implied by this document.
- Artifact is the primary software trust object crossing the developer-machine
  boundary.
- Source code remains local under the normal RaaS workflow.
- PostgreSQL is authoritative for artifact metadata and lifecycle state.
- Object storage is authoritative for artifact binary payloads.
- Artifact versions are immutable.
- Execution eligibility is server-authoritative.
- Revocation prevents new execution but does not erase historical Run evidence.

---

# Appendix A — Phase Mapping

## Phase 0 — FOUNDATION

B-M02 consumes:

- object-storage abstraction;
- database migration framework;
- security scanning;
- secrets management;
- key management;
- CI.

## Phase 1 — STUDIO

B-M02 consumes B-M01:

- organizations;
- Projects;
- authorization;
- repositories;
- API v1;
- audit;
- idempotency.

## Phase 2 — BUILD & ARTIFACT

B-M02 is a primary Phase 2 backend milestone.

It enables:

- local build artifact upload;
- artifact registry;
- artifact selection;
- execution eligibility.

## Phase 3 — CONTROL PLANE

B-M02 provides:

- immutable artifact identity;
- compatibility validation;
- approval state;
- revocation;
- execution-readiness.

## Phase 4 — BOOKING & COMMERCIAL

Artifacts later contribute to:

- usage;
- execution records;
- credit consumption;
- billing evidence.

B-M02 does not own financial state.

## Phase 5 — EXECUTION

Artifact validation is extended with:

- Lab Agent validation;
- runtime validation;
- physical platform validation;
- hardware-specific policy.

## Phase 6 — LAB & ROBOT

Artifact security is strengthened through:

- production signing;
- stronger malware scanning;
- key rotation;
- revocation;
- security monitoring;
- incident response.

## Phase 7 — LIVE & RESULTS

Artifact infrastructure evolves toward:

- large registry scale;
- storage lifecycle automation;
- high-volume uploads;
- cache/read optimization;
- artifact distribution optimization.

## Phase 8 — PRODUCTION

The approved artifact lifecycle becomes part of the production release and
execution trust chain.

---

# Appendix B — Artifact Architecture

    +--------------------+
    | Developer Machine  |
    |                    |
    | Source             |
    | Local Build        |
    | Local Test         |
    | Package            |
    +---------+----------+
              |
              | `.krv`
              v
    +--------------------+
    |   Control Plane    |
    |                    |
    | Artifact Service   |
    | Validation         |
    | Security           |
    | Authorization      |
    +---------+----------+
              |
       +------+------+
       |             |
       v             v
    PostgreSQL    Object Storage
       |             |
       +------+------+
              |
              v
       Artifact Registry
              |
              v
       Execution Eligibility
              |
              v
          Job Service
              |
              v
             Lab

---

# Appendix C — Artifact State Machine

    CREATED
       |
       v
    UPLOADING
       |
       v
    UPLOADED
       |
       v
    VALIDATING
       |
       +------------------+
       |                  |
       v                  v
    REJECTED          QUARANTINED
       |                  |
       |                  v
       |              REVIEW
       |                  |
       +------------------+
              |
              v
            VALID
              |
              v
           APPROVED
              |
        +-----+-----+
        |           |
        v           v
     REVOKED      EXPIRED
        |           |
        +-----+-----+
              |
              v
          ARCHIVED
              |
              v
            PURGED

State transitions must be explicit and audited.

---

# Appendix D — Upload Architecture

    Studio
      |
      | Create Upload Session
      v
    Control Plane
      |
      +--> Authorization
      |
      +--> Upload Record
      |
      v
    Object Storage
      |
      | Upload Binary
      v
    Complete Upload
      |
      v
    Control Plane
      |
      v
    Validation Pipeline

The binary should preferably travel directly between Studio/local runtime and
object storage using controlled short-lived access rather than through the
application process.

---

# Appendix E — Validation Pipeline

    Uploaded Artifact
          |
          v
    Package Detection
          |
          v
    Manifest Parsing
          |
          v
    Structural Validation
          |
          v
    Path/Content Validation
          |
          v
    Checksum Verification
          |
          v
    Signature Verification
          |
          v
    Security Scan
          |
          v
    Platform Compatibility
          |
          v
    Policy Evaluation
          |
          v
       APPROVED

Any mandatory stage failing prevents approval.

---

# Appendix F — Trust Model

    Integrity
       +
    Authenticity
       +
    Security
       +
    Compatibility
       +
    Authorization
       +
    Lifecycle
       |
       v
    Execution Eligible

No individual signal is sufficient.

For example:

    Checksum PASS
        !=
    Trusted Artifact

and:

    Signature PASS
        !=
    Compatible Artifact

and:

    Compatible Artifact
        !=
    Authorized Artifact

---

# Appendix G — Artifact Manifest Contract

The manifest should contain at minimum:

    artifact_format
    artifact_format_version
    application_id
    application_version
    platform_id
    platform_version
    architecture
    kritva_os_version
    sdk_version
    capabilities
    entrypoint
    checksum
    signature

Optional future fields may include:

    runtime_version
    minimum_runtime_version
    maximum_runtime_version
    resource_requirements
    environment_requirements
    configuration_schema_version
    sbom_reference
    provenance
    build_id

Additional fields must be versioned and validated.

---

# Appendix H — Artifact Registry Query

Conceptual request:

    GET /api/v1/artifacts?
        project_id=project-001&
        platform_id=platform-001&
        status=APPROVED&
        page=1&
        page_size=25

The backend applies organization and authorization filtering before returning
results.

The client cannot remove tenant filters through query parameters.

---

# Appendix I — Artifact Detail

Conceptual response:

    {
        "artifact_id": "artifact-001",
        "project_id": "project-001",
        "application_id": "vision-demo",
        "application_version": "1.2.0",
        "status": "APPROVED",
        "digest": "sha256:...",
        "platform": {
            "id": "kritva-reference-robot",
            "version": "1.0"
        },
        "architecture": "arm64",
        "kritva_os_version": "1.0",
        "sdk_version": "1.0",
        "signature_status": "VALID",
        "security_status": "PASS",
        "compatibility_status": "COMPATIBLE",
        "execution_eligible": true
    }

---

# Appendix J — Signature Verification Architecture

    Artifact
       |
       v
    Signature
       |
       v
    Signing Identity
       |
       v
    Trust Store / KMS / PKI
       |
       +--> Valid?
       |
       +--> Revoked?
       |
       +--> Expired?
       |
       +--> Allowed Algorithm?
       |
       v
    Verification Result

Production signing keys must remain outside ordinary application workers.

---

# Appendix K — Revocation Architecture

    Approved Artifact
           |
           v
       Revocation
           |
           +--> Reason
           +--> Actor
           +--> Time
           +--> Evidence
           |
           v
        REVOKED
           |
           v
    Execution Eligibility
           |
           v
           NO

Revocation should be visible to later Job and Lab validation.

---

# Appendix L — Retention Architecture

    ACTIVE
      |
      | retention expires / administrative archive
      v
    ARCHIVED
      |
      | purge policy satisfied
      v
    PURGED

Retention must coordinate:

- PostgreSQL metadata;
- object storage;
- audit requirements;
- historical Run references;
- legal holds;
- organization policy.

---

# Appendix M — Object Storage Consistency

Authoritative relationship:

    Artifact Metadata
          |
          v
    storage_reference
          |
          v
    Object Storage Object
          |
          v
    checksum

Reconciliation validates:

    metadata exists
    object exists
    checksum matches
    lifecycle agrees

Any discrepancy becomes an operational finding.

---

# Appendix N — Execution Eligibility

Conceptual function:

    isExecutionEligible(artifactId, target):
        authenticate
        authorize
        load artifact
        verify lifecycle
        verify approval
        verify revocation
        verify expiry
        verify compatibility
        verify security status
        verify target
        return eligibility

The actual execution service must call the authoritative backend eligibility
contract rather than reimplementing artifact rules independently.

---

# Appendix O — API Surface

Initial conceptual endpoints:

    POST   /api/v1/artifacts/uploads
    POST   /api/v1/artifacts/uploads/:uploadId/complete
    GET    /api/v1/artifacts
    POST   /api/v1/artifacts
    GET    /api/v1/artifacts/:artifactId
    GET    /api/v1/artifacts/:artifactId/versions
    GET    /api/v1/artifacts/:artifactId/validation
    GET    /api/v1/artifacts/:artifactId/compatibility
    POST   /api/v1/artifacts/:artifactId/revoke
    POST   /api/v1/artifacts/:artifactId/archive

Exact REST semantics may be refined during API contract review.

---

# Appendix P — Artifact Audit Events

Recommended events include:

    artifact.upload_session_created
    artifact.upload_completed
    artifact.validation_started
    artifact.validation_failed
    artifact.signature_verified
    artifact.signature_failed
    artifact.security_scan_completed
    artifact.compatibility_evaluated
    artifact.approved
    artifact.rejected
    artifact.revoked
    artifact.archived
    artifact.purged
    artifact.downloaded

Events must carry:

- actor;
- organization;
- artifact;
- request ID;
- timestamp;
- outcome;
- relevant evidence reference.

---

# Appendix Q — Security Evidence

For each approved artifact, the system should be able to establish:

    Who uploaded it?
          |
    Which Project?
          |
    Which organization?
          |
    Which digest?
          |
    Which signature?
          |
    Which signing identity?
          |
    Which validation version?
          |
    Which scanner/policy?
          |
    Which compatibility result?
          |
    When approved?
          |
    Is it currently revoked?

This evidence chain supports operational investigation and release
qualification.

---

# Appendix R — Artifact Privacy Boundary

The artifact may contain executable code and packaged dependencies.

It must not normally contain:

- developer passwords;
- API keys;
- cloud credentials;
- signing private keys;
- database passwords;
- infrastructure secrets;
- unrelated source repositories.

Artifact scanning should identify policy violations.

The Control Plane must not expose raw artifact contents through ordinary
metadata APIs.

---

# Appendix S — Operational Metrics

Recommended metrics:

- upload requests;
- upload failures;
- upload bytes;
- validation queue depth;
- validation latency;
- validation failure rate;
- signature verification failures;
- security scan failures;
- compatibility failures;
- approval rate;
- revocation count;
- archived artifact count;
- purge count;
- reconciliation findings;
- storage volume;
- artifact download count.

Metrics should be tenant-safe and must not expose customer content.

---

# Appendix T — Open Questions

1. Is every production artifact required to be signed?
2. Which signing algorithm is mandatory for the first release?
3. Which signing trust hierarchy is used?
4. Where is the signing service hosted?
5. Is signing performed locally, by a controlled service, or both?
6. Which artifacts can be locally signed?
7. Which artifacts require server-side re-signing?
8. What exact `.krv` package format version is first production?
9. Is compression mandatory?
10. What maximum artifact size is supported?
11. What maximum number of package files is supported?
12. Are symbolic links permitted?
13. Which executable formats are permitted?
14. Which libraries are permitted?
15. Is an SBOM mandatory?
16. Which malware scanner is used?
17. What happens if the scanner is unavailable?
18. Is scanner failure fail-closed for all environments?
19. What exact compatibility rules apply to runtime versions?
20. Can one artifact support multiple architectures?
21. Can one artifact support multiple platform versions?
22. How are optional capabilities represented?
23. How are platform configurations encoded in the manifest?
24. Which fields are immutable after approval?
25. Can metadata be corrected without creating a new artifact?
26. What is the version naming convention?
27. Is semantic versioning mandatory?
28. Can the same application version have multiple builds?
29. If so, is build ID separate from application version?
30. Is digest the canonical binary identity?
31. How long are archived artifacts retained?
32. Can customers request early purge?
33. What happens to artifacts referenced by historical Runs?
34. What is the legal hold mechanism?
35. How quickly must revocation propagate to execution systems?
36. Can revocation be temporary?
37. Can revoked artifacts ever be re-approved?
38. What is the quarantine workflow?
39. Who can approve quarantined artifacts?
40. What support access is permitted?
41. Can an organization define private artifact policies?
42. What artifact quotas apply?
43. What storage quotas apply?
44. What upload concurrency limits apply?
45. Should uploads support multipart/resumable transfer?
46. What is the maximum upload-session lifetime?
47. Should artifact downloads be available to users?
48. Should only metadata be downloadable through the Control Plane?
49. What download audit level is required?
50. Which result/job retention policies must protect artifact history?
51. Which artifact evidence must be preserved after purge?
52. How is artifact migration handled across manifest versions?
53. What compatibility guarantees are required across KritvaOS releases?
54. What artifact format compatibility policy applies to R1.x and R2.x?
55. Which artifact security events require immediate alerting?

Open questions must become explicit decisions before they affect execution
trust or production release.

---

# Appendix U — Definition of Done

B-M02 is Done when the following lifecycle works:

    Local Build
         |
         v
      `.krv`
         |
         v
    Upload Session
         |
         v
    Object Storage
         |
         v
    Manifest Validation
         |
         v
    Integrity Verification
         |
         v
    Signature Verification
         |
         v
    Security Scan
         |
         v
    Compatibility
         |
         v
      APPROVED
         |
         v
    Registry
         |
         v
    Execution Eligible
         |
         v
      Revoke
         |
         v
    Not Execution Eligible

The complete flow must be supported by automated tests and review evidence.

---

# Appendix V — Final Milestone Invariants

1. Artifact is a first-class domain object.
2. Artifact belongs to a Project.
3. Project belongs to an Organization.
4. Artifact versions are immutable.
5. Artifact binary is stored in object storage.
6. Artifact metadata is stored in PostgreSQL.
7. Artifact upload is authorized.
8. Artifact access is tenant-scoped.
9. Artifact upload does not require customer source code.
10. Manifest is versioned.
11. Manifest is validated.
12. Package structure is validated.
13. Path traversal is rejected.
14. Artifact size limits are enforced.
15. Artifact checksum is verified.
16. Signature is verified where required.
17. Signing trust is explicit.
18. Signing private keys are not distributed to ordinary workers.
19. Security scanning is mandatory where policy requires.
20. Scan failure does not imply approval.
21. Compatibility is evaluated against the authoritative platform catalog.
22. Approval is server-authoritative.
23. Client input cannot force approval.
24. Execution eligibility is explicit.
25. Revoked artifacts cannot become execution eligible without controlled
    revalidation.
26. Expired artifacts cannot execute.
27. Incompatible artifacts cannot execute.
28. Incomplete artifacts cannot execute.
29. Artifact versions cannot silently replace one another.
30. Duplicate upload operations are idempotent where required.
31. Object-storage/database inconsistency is detectable.
32. Reconciliation is auditable.
33. Retention is policy-driven.
34. Purge is controlled.
35. Historical Run evidence is not silently destroyed.
36. Artifact operations are auditable.
37. Cross-tenant artifact access is denied.
38. Source-code privacy remains intact.
39. Large artifact payloads do not require application-memory buffering.
40. B-M02 establishes a stable trust boundary for later execution.
41. Completion requires implementation evidence, security review, tests and
    acceptance evidence.

# Appendix W — Milestone Principle

> B-M02 establishes the Kritva RaaS artifact as a trusted, immutable and
> auditable software object crossing the developer-machine boundary. The
> customer builds locally and uploads only the resulting `.krv` artifact.
> The Control Plane records authoritative metadata in PostgreSQL and stores
> large binary payloads in object storage. Every artifact is structurally
> validated, integrity-checked, signature-verified, security-scanned and
> evaluated for platform compatibility before it becomes execution eligible.
> Artifact versions are immutable; a new binary creates a new version rather
> than replacing historical data. Authorization and tenant isolation apply to
> every artifact operation. Revocation prevents new execution while preserving
> historical evidence. Retention and reconciliation protect the integrity of
> the registry over time. This establishes the secure software boundary needed
> for the later RaaS flow: Build Locally, Upload Artifact, Validate, Book,
> Execute, Observe and Analyze.
