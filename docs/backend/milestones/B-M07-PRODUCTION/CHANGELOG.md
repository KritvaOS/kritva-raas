# B-M07-PRODUCTION — Changelog

Milestone: B-M07 — Production

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

- Initial B-M07 production milestone dossier.
- No implementation is implied by this document.
- Production readiness requires evidence, not documentation alone.
- The architecture remains a provider-neutral modular monolith.
- PostgreSQL remains the authoritative business-state store.
- Object storage remains the authoritative store for large binary content.
- Queue delivery is not business truth.
- Organization remains the primary tenant boundary.
- Local robot safety remains authoritative over cloud control.
- Initial database recovery targets are RPO <=15 minutes and RTO <=4 hours.
- Active-active multi-region is intentionally not required for the initial
  production architecture.
- Production release must be traceable from source through deployment and
  database migration.
- Physical robot deployment remains subject to a separate safety gate.

---

# Appendix A — Phase Mapping

The canonical mapping for B-M07 PRODUCTION (P8) is defined in `planning/PHASES.md` (Section 6). Cross-phase dependencies are owned by `planning/DEPENDENCY_MAP.md` and `planning/IMPLEMENTATION_ROADMAP.md`; milestone scope is owned by this milestone's `MILESTONE.md`. This appendix does not redefine either.

| Phase | Relationship to this milestone | Boundary note |
|---|---|---|
| P0 FOUNDATION | Upstream dependency; outputs consumed by this milestone |  |
| P1 STUDIO | Upstream dependency; outputs consumed by this milestone |  |
| P2 BUILD & ARTIFACT | Upstream dependency; outputs consumed by this milestone |  |
| P3 CONTROL PLANE | Upstream dependency; outputs consumed by this milestone |  |
| P4 BOOKING & COMMERCIAL | Upstream dependency; outputs consumed by this milestone |  |
| P5 EXECUTION | Upstream dependency; outputs consumed by this milestone | Simulated Lab Agent and simulated robots only. |
| P6 LAB & ROBOT | Upstream dependency; outputs consumed by this milestone | Physical Lab Agent, physical robots, E-stop qualification and hardware safety review. |
| P7 LIVE & RESULTS | Upstream dependency; outputs consumed by this milestone |  |
| P8 PRODUCTION | Owning phase |  |

Earlier revisions of this appendix used a superseded phase model and were replaced to remove conflicting phase assignments.

---

# Appendix B — Production Request Flow

    Client
       |
       v
    DNS
       |
       v
    TLS / Edge
       |
       v
    Load Balancer
       |
       v
    API Instance
       |
       +--> Authentication
       |
       +--> Authorization
       |
       +--> Tenant Context
       |
       +--> Application Service
       |
       +--> Repository
       |
       v
    PostgreSQL
       |
       v
    Response

Every production request must remain within the defined trust boundaries.

---

# Appendix C — Production Asynchronous Flow

    API
       |
       v
    PostgreSQL Transaction
       |
       +--> Durable Business State
       |
       +--> Outbox/Event
                |
                v
              Queue
                |
                v
              Worker
                |
                v
       External / Long Operation
                |
                v
       Result / Status Update

The database state is committed before asynchronous work is considered
durably scheduled when the operation requires atomic state/event behavior.

---

# Appendix D — Outbox Pattern

For operations requiring atomic state and event publication:

    BEGIN
       |
       +--> Business State Update
       |
       +--> Outbox Event
       |
       COMMIT
          |
          v
       Outbox Worker
          |
          v
       Queue / Event Bus

This avoids:

    DB COMMIT succeeded
          +
    Event publication failed

without an observable recovery path.

---

# Appendix E — Authentication Boundary

    User / Studio
          |
          v
    Authentication
          |
          v
    Principal
          |
          v
    Authorization
          |
          v
    Application Service

Authentication establishes identity.

Authorization establishes permission.

They must not be treated as the same control.

---

# Appendix F — Tenant Authorization

    Request
       |
       v
    Principal
       |
       v
    Organization Membership
       |
       v
    Project Membership / Role
       |
       v
    Resource Ownership
       |
       v
    Authorization Decision
       |
       v
    Repository Query
       |
       v
    Tenant-Scoped Data

The repository must not rely solely on the client-provided organization ID.

---

# Appendix G — Security Event Flow

    Security Event
         |
         v
    Application / Gateway
         |
         +--> Structured Log
         |
         +--> Audit Event
         |
         +--> Metric
         |
         v
    Detection
         |
         v
    Alert
         |
         v
    Incident Response

Security events must preserve enough context for investigation without
persisting unnecessary sensitive information.

---

# Appendix H — Observability Correlation

Conceptual correlation:

    trace_id
       |
       +--> HTTP Request
       |
       +--> Application Service
       |
       +--> DB Operation
       |
       +--> Queue Message
       |
       +--> Worker
       |
       +--> Job
       |
       +--> Run
       |
       +--> Lab Agent Event

Where propagation crosses a trust boundary, only approved context may be
forwarded.

---

# Appendix I — Health Model

    Liveness
       |
       +--> Process is alive

    Readiness
       |
       +--> Can accept traffic

    Dependency Health
       |
       +--> PostgreSQL
       +--> Queue
       +--> Object Storage
       +--> Secret Provider

    Operational Health
       |
       +--> Error Rate
       +--> Latency
       +--> Backlog
       +--> Capacity

Health checks must not expose sensitive infrastructure information publicly.

---

# Appendix J — Availability Model

    User Traffic
        |
        v
    Load Balancer
       / \
      /   \
     v     v
   API A  API B
      \   /
       \ /
        v
    Shared Durable State
        |
        +--> PostgreSQL
        +--> Object Storage
        +--> Queue

No API instance owns exclusive business state.

---

# Appendix K — Database HA Model

    Application
         |
         v
    Database Endpoint
         |
      +--+--+
      |     |
      v     v
   Primary Standby
      |
      v
   WAL / Replication

Exact topology depends on the production provider and must remain behind a
database infrastructure abstraction.

---

# Appendix L — Backup and Recovery

    Production
       |
       +--> PostgreSQL
       |      |
       |      +--> WAL
       |      +--> Backups
       |
       +--> Object Storage
              |
              +--> Versioning / Recovery
              |
              v
         Recovery Environment
              |
              v
         Validation
              |
              v
          Production

Recovery procedures must be executable by operators who were not involved in
the original implementation.

---

# Appendix M — RPO/RTO Evidence

RPO:

> Maximum acceptable amount of data loss measured in time.

Target:

    <= 15 minutes

RTO:

> Maximum acceptable time to restore service.

Target:

    <= 4 hours

Evidence must record:

- incident start;
- recovery start;
- recovery completion;
- latest recoverable transaction;
- data loss;
- service restoration time;
- exceptions.

---

# Appendix N — Release Provenance

    Git Tag
       |
       v
    Commit
       |
       v
    Build
       |
       v
    Artifact
       |
       +--> SBOM
       +--> Dependency Manifest
       +--> Build Metadata
       |
       v
    Deployment
       |
       +--> DB Migration
       +--> Configuration
       |
       v
    Production Release

A production release must be reconstructible from recorded evidence.

---

# Appendix O — Production Deployment

    Staging
       |
       v
    Qualification
       |
       v
    Approval
       |
       v
    Canary
       |
       v
    Smoke Test
       |
       v
    Expanded Rollout
       |
       v
    Full Production
       |
       v
    Monitoring

Physical robot deployment must not automatically follow cloud deployment.

---

# Appendix P — Rollback

    Production N
       |
       v
    Deploy N+1
       |
       v
    Validation
       |
    +--+--+
    |     |
   PASS  FAIL
    |     |
    v     v
 Continue Rollback
          |
          v
      N Restored

Database migrations must support the selected rollback strategy.

---

# Appendix Q — Incident Lifecycle

    DETECT
       |
       v
    TRIAGE
       |
       v
    CONTAIN
       |
       v
    RECOVER
       |
       v
    VERIFY
       |
       v
    COMMUNICATE
       |
       v
    POSTMORTEM
       |
       v
    CORRECTIVE ACTION

Every production incident must result in tracked evidence and follow-up
actions according to severity.

---

# Appendix R — Capacity Model

Capacity planning must consider:

    Users
      |
      +--> API requests/sec
      |
      +--> WebSocket connections
      |
      +--> Jobs/hour
      |
      +--> Runs/hour
      |
      +--> Telemetry samples/sec
      |
      +--> Log bytes/sec
      |
      +--> Video GB/day
      |
      +--> Result files/day
      |
      +--> Database rows/day
      |
      +--> Object storage GB/month

Capacity assumptions must be documented and periodically revalidated.

---

# Appendix S — Noisy-Neighbour Protection

    Organization A
       |
       +--> API quota
       +--> Queue quota
       +--> Storage quota
       +--> Execution quota

    Organization B
       |
       +--> Independent policy

Shared infrastructure must not permit unrestricted resource consumption by a
single tenant.

---

# Appendix T — Production Cost Controls

Cost observability must cover:

- compute;
- database;
- object storage;
- media;
- network;
- queue;
- observability;
- backups.

The system should support:

- quotas;
- alerts;
- budget thresholds;
- retention optimization;
- workload visibility.

Commercial pricing remains separate from infrastructure cost accounting.

---

# Appendix U — Compliance Evidence Model

Evidence categories:

    Access
       |
    Audit
       |
    Change
       |
    Security
       |
    Backup
       |
    Recovery
       |
    Vulnerability
       |
    Incident
       |
    Retention

Each evidence item should include:

- timestamp;
- environment;
- release/version;
- actor or automation identity;
- result;
- supporting artifact.

---

# Appendix V — Vulnerability Severity

Initial classification:

| Severity | Example | Release Treatment |
|---|---|---|
| Critical | Remote compromise / tenant escape | Block |
| High | Significant exploitable weakness | Normally block |
| Medium | Limited exploitability | Risk review |
| Low | Minor issue | Track |
| Informational | Hardening opportunity | Track |

Exceptions require explicit documented approval.

---

# Appendix W — Production Configuration

Production configuration must be classified:

    Public
       |
       +--> Non-sensitive product configuration

    Internal
       |
       +--> Operational settings

    Confidential
       |
       +--> Service configuration

    Restricted
       |
       +--> Credentials / tokens

    Critical
       |
       +--> Signing / root trust material

Secrets must never be treated as ordinary application configuration.

---

# Appendix X — Open Questions

1. Which cloud provider hosts the first production environment?
2. Which managed PostgreSQL service is selected?
3. What managed queue technology is selected?
4. What object-storage provider is selected?
5. Which observability platform is selected?
6. What is the first production region?
7. Which availability zones are used?
8. What exact production SLOs will be committed to customers?
9. Are any customer-facing SLAs offered at R1.0?
10. What is the expected initial concurrent-user count?
11. What is the expected peak API request rate?
12. What is the expected concurrent Job count?
13. What is the expected concurrent Run count?
14. What is the expected telemetry rate per robot?
15. What is the expected daily video volume?
16. What is the expected monthly result-storage volume?
17. What noisy-neighbour limits are required?
18. Is PostgreSQL read replication required at R1.0?
19. Is connection pooling externalized?
20. Which database HA model is selected?
21. What is the exact backup retention?
22. What is the exact PITR window?
23. What object-storage recovery model is required?
24. Is cross-region backup required?
25. What is the acceptable disaster scenario for initial RPO/RTO?
26. What production incident coverage hours are required?
27. Is 24x7 on-call required at initial GA?
28. Who owns security incidents?
29. Who owns database incidents?
30. Who owns Lab Agent incidents?
31. What compliance framework is the first target?
32. Which geographic data-residency requirements apply?
33. What customer data deletion commitments apply?
34. Are customer exports required?
35. What audit-log export format is required?
36. How long are audit logs retained?
37. What SIEM integration is required?
38. What vulnerability scanner is selected?
39. What container/image scanning is selected?
40. What SBOM format is required?
41. What signing/provenance system is selected?
42. What production artifact promotion process is required?
43. What release approval roles are required?
44. What percentage of production rollout is considered canary?
45. How long is the canary observation period?
46. What rollback threshold triggers automatic rollback?
47. Which database migration tools are selected?
48. What schema migration locking limits are acceptable?
49. What maximum deployment downtime is permitted?
50. What maintenance-window policy applies?
51. What WebSocket connection target is required?
52. What reconnect storm protection is required?
53. What telemetry ingestion SLO is required?
54. What Result publication SLO is required?
55. What download bandwidth policy applies?
56. What customer storage quota model applies?
57. Who pays for storage beyond the included quota?
58. How are physical-lab outages communicated?
59. How are robot safety incidents escalated?
60. What evidence is required before physical production rollout?
61. What operational metrics are customer-visible?
62. Which internal metrics must remain restricted?
63. What production support model exists after GA?
64. What release cadence is targeted?
65. What maintenance policy applies to Lab Agents?
66. How are emergency security releases handled?
67. How are emergency physical-safety releases handled?
68. What disaster-recovery frequency is required?
69. What backup-restore drill frequency is required?
70. What penetration-testing cadence is required?

These questions must be converted into explicit decisions before the affected
production capability is declared operational.

---

# Appendix Y — Production Readiness Review

The Production Readiness Review must examine:

    Architecture
       |
       +--> Security
       |
       +--> Database
       |
       +--> Infrastructure
       |
       +--> Performance
       |
       +--> Observability
       |
       +--> DR
       |
       +--> Compliance
       |
       +--> Release
       |
       +--> Lab / Safety

The review must distinguish:

- implemented;
- tested;
- qualified;
- monitored;
- documented;
- approved.

Documentation alone does not satisfy qualification.

---

# Appendix Z — Definition of Done

B-M07 is Done when a production-like deployment can:

1. authenticate users securely;
2. authorize operations correctly;
3. enforce tenant isolation;
4. create projects;
5. register artifacts;
6. book resources;
7. reserve and consume credits safely;
8. create Jobs;
9. execute Runs;
10. ingest telemetry;
11. ingest logs;
12. expose live state;
13. generate Results;
14. store result files;
15. support experiments;
16. support downloads;
17. operate real Lab Agent connectivity;
18. survive individual API instance failure;
19. recover workers;
20. tolerate controlled database failover;
21. restore from backup;
22. meet measured RPO/RTO targets;
23. meet agreed performance targets;
24. expose actionable observability;
25. alert on critical conditions;
26. execute incident runbooks;
27. pass security qualification;
28. pass tenant-isolation qualification;
29. pass release qualification;
30. support controlled production rollout.

---

# Appendix AA — Final Production Invariants

1. Production deployment is reproducible.
2. Production configuration is environment-specific.
3. Production secrets are never stored in source.
4. Production keys are protected.
5. Production APIs are authenticated.
6. Production APIs are authorized.
7. Authorization is deny-by-default.
8. Organization is the primary tenant boundary.
9. Cross-tenant access is prohibited.
10. PostgreSQL is authoritative for structured business state.
11. Object storage is authoritative for large binary content.
12. Queue delivery is not business truth.
13. Financial transactions remain strongly consistent.
14. Booking/resource allocation remains strongly consistent.
15. Idempotency protects retryable business operations.
16. API instances are stateless.
17. Worker processing is recoverable.
18. Database connections are bounded.
19. Scaling does not exhaust the database.
20. WebSocket state is not the authoritative business state.
21. Live disconnect does not automatically fail execution.
22. Result processing is observable.
23. Telemetry ingestion is capacity-controlled.
24. Large files are streamed.
25. Storage growth is monitored.
26. Retention is enforced.
27. Audit events are retained according to policy.
28. Critical security events are alertable.
29. Vulnerabilities are tracked.
30. Critical vulnerabilities can block release.
31. Build provenance is recorded.
32. SBOM is generated.
33. Production deployments are controlled.
34. Database migrations are tested.
35. Rollback is tested.
36. Backups are tested through restoration.
37. RPO is measured.
38. RTO is measured.
39. Disaster recovery is rehearsed.
40. Incident response is rehearsed.
41. Operational ownership is explicit.
42. Production dashboards exist.
43. Production alerts have owners.
44. Runbooks are actionable.
45. Customer data is handled according to policy.
46. Compliance claims are evidence-based.
47. Cloud failure does not become physical safety authority.
48. Local Lab Agent/runtime remains authoritative for physical safety.
49. No unsafe automatic physical restart exists.
50. Physical deployment requires a separate safety gate.
51. Production readiness is evidence-based.
52. B-M07 completion requires security, scale, recovery, observability and
    release evidence.

---

# Appendix AB — Milestone Principle

> B-M07 turns the Kritva RaaS backend from a development-capable system into a
> production-operable platform. Production readiness is treated as an
> engineering property rather than a deployment event. The backend remains a
> provider-neutral modular monolith with PostgreSQL as the authoritative
> business-state store, object storage for large content, durable queues for
> asynchronous work and a secure Lab Agent boundary for physical laboratories.
> Security is enforced through authentication, authorization, tenant
> isolation, protected secrets and keys, auditability and controlled
> infrastructure access. Scalability is achieved through stateless API
> instances, independently scalable workers and bounded database resources
> rather than premature service decomposition. Observability connects logs,
> metrics, traces, audit events and operational dashboards through consistent
> correlation identifiers. High availability is established through redundant
> application instances, resilient workers, database HA and durable storage.
> Disaster recovery is validated through actual backup restoration and measured
> RPO/RTO rather than documentation alone. Performance is qualified under
> representative API, booking, credit, execution, telemetry and WebSocket
> workloads. Compliance is treated as an evidence-producing engineering
> process rather than an unsupported certification claim. Release readiness
> connects source, CI, security scanning, SBOM, provenance, migrations,
> staging, production deployment, rollback and post-release verification.
> Throughout the milestone, the most important system boundary remains intact:
> cloud infrastructure controls software services, while the Lab Agent,
> Kritva Runtime and physical safety mechanisms remain authoritative over
> real-world robot behavior.
