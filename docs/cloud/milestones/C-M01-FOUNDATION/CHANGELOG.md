# C-M01-FOUNDATION — Changelog

Milestone: C-M01 — Cloud Foundation

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

- Initial C-M01 cloud foundation milestone dossier.
- No implementation is implied by this document.
- The cloud architecture remains provider-neutral.
- Environment isolation is mandatory.
- Production infrastructure must be reproducible through IaC.
- Production secrets must not be stored in source or ordinary configuration.
- PostgreSQL, object storage and queue are infrastructure dependencies, not
  application-owned implementation details.
- Cloud infrastructure does not become physical robot safety authority.
- Active-active multi-region is intentionally outside the initial foundation
  scope.
- C-M01 establishes the infrastructure baseline consumed by later cloud and
  backend milestones.

---

# Appendix A — Phase Mapping

The canonical mapping for C-M01 FOUNDATION (P0) is defined in `planning/PHASES.md` (Section 6). Cross-phase dependencies are owned by `planning/DEPENDENCY_MAP.md` and `planning/IMPLEMENTATION_ROADMAP.md`; milestone scope is owned by this milestone's `MILESTONE.md`. This appendix does not redefine either.

| Phase | Relationship to this milestone | Boundary note |
|---|---|---|
| P0 FOUNDATION | Owning phase |  |
| P1 STUDIO | Downstream consumer of this milestone's outputs |  |
| P2 BUILD & ARTIFACT | Downstream consumer of this milestone's outputs |  |
| P3 CONTROL PLANE | Downstream consumer of this milestone's outputs |  |
| P4 BOOKING & COMMERCIAL | Downstream consumer of this milestone's outputs |  |
| P5 EXECUTION | Downstream consumer of this milestone's outputs | Simulated Lab Agent and simulated robots only. |
| P6 LAB & ROBOT | Downstream consumer of this milestone's outputs | Physical Lab Agent, physical robots, E-stop qualification and hardware safety review. |
| P7 LIVE & RESULTS | Downstream consumer of this milestone's outputs |  |
| P8 PRODUCTION | Downstream consumer of this milestone's outputs |  |

Earlier revisions of this appendix used a superseded phase model and were replaced to remove conflicting phase assignments.

---

# Appendix B — Cloud Trust Boundaries

    +-------------------------------------------------------+
    |                    Internet                           |
    +-------------------------+-----------------------------+
                              |
                              v
    +-------------------------------------------------------+
    |                 Public Edge / TLS                     |
    +-------------------------+-----------------------------+
                              |
                              v
    +-------------------------------------------------------+
    |              Application Trust Zone                   |
    +-------------------------+-----------------------------+
                              |
             +----------------+----------------+
             |                |                |
             v                v                v
        PostgreSQL         Queue          Object Storage
             |                |                |
             +----------------+----------------+
                              |
                              v
    +-------------------------------------------------------+
    |              Controlled Lab Boundary                  |
    +-------------------------+-----------------------------+
                              |
                              v
                         Lab Agent
                              |
                              v
                     Kritva Runtime / Robot

Each boundary must have explicit authentication, authorization and network
controls.

---

# Appendix C — Environment Isolation

    DEVELOPMENT
    +-------------------------------+
    | DB-DEV                        |
    | STORAGE-DEV                   |
    | QUEUE-DEV                     |
    | SECRETS-DEV                   |
    | IAM-DEV                       |
    +-------------------------------+

    STAGING
    +-------------------------------+
    | DB-STG                        |
    | STORAGE-STG                   |
    | QUEUE-STG                     |
    | SECRETS-STG                   |
    | IAM-STG                       |
    +-------------------------------+

    PRODUCTION
    +-------------------------------+
    | DB-PROD                       |
    | STORAGE-PROD                  |
    | QUEUE-PROD                    |
    | SECRETS-PROD                  |
    | IAM-PROD                      |
    +-------------------------------+

No environment may silently share customer production secrets or business
databases with another environment.

---

# Appendix D — IaC Repository Concept

    cloud/
    |
    +-- modules/
    |     +-- network/
    |     +-- iam/
    |     +-- database/
    |     +-- storage/
    |     +-- queue/
    |     +-- compute/
    |     +-- observability/
    |     +-- secrets/
    |
    +-- environments/
          +-- development/
          +-- staging/
          +-- production/

Exact structure may evolve after IaC tool selection.

---

# Appendix E — IaC Change Flow

    Engineer
       |
       v
    Branch
       |
       v
    Pull Request
       |
       +--> Format
       +--> Validate
       +--> Security Scan
       +--> Plan
       |
       v
    Review
       |
       v
    Merge
       |
       v
    Environment Apply
       |
       v
    Verification

No production infrastructure change should depend solely on an engineer's
local shell history.

---

# Appendix F — IAM Model

    Human
      |
      +--> Developer
      +--> Operator
      +--> Security Admin
      +--> Cloud Admin

    Machine
      |
      +--> CI
      +--> API
      +--> Worker
      +--> Lab Agent

Each identity receives only the permissions required for its function.

---

# Appendix G — CI/CD Identity Flow

    Git Provider
        |
        v
    Trusted Workflow
        |
        v
    Identity Federation
        |
        v
    Environment Role
        |
        v
    Cloud API
        |
        v
    IaC

The CI workflow must be constrained by repository, branch, environment and
approval policy.

---

# Appendix H — Secret Flow

    Secret Creation
          |
          v
    Secret Manager
          |
          v
    Workload Identity
          |
          v
    Runtime
          |
          v
    Application

Secret values must not be propagated through:

- Git;
- source files;
- Docker build arguments;
- public artifacts;
- ordinary logs.

---

# Appendix I — Network Security Model

    Internet
       |
       X
    Private DB

    Internet
       |
       X
    Private Queue

    Internet
       |
       X
    Private Storage

    Internet
       |
       v
    Controlled Edge
       |
       v
    API

The preferred default is deny unless a documented requirement permits access.

---

# Appendix J — DNS and TLS

    Client
       |
       v
    DNS
       |
       v
    TLS Certificate
       |
       v
    Edge / Load Balancer
       |
       v
    Application

Certificate lifecycle:

    Issue
      |
      v
    Deploy
      |
      v
    Monitor
      |
      v
    Renew
      |
      v
    Revoke if required

---

# Appendix K — Observability Model

    Infrastructure
       |
       +--> Metrics
       +--> Logs
       +--> Audit
       +--> Events
       |
       v
    Collector / Platform
       |
       +--> Dashboards
       +--> Alerts
       +--> Search
       +--> Retention

Observability data itself is sensitive operational information and requires
access controls.

---

# Appendix L — Cloud Audit Model

Audit categories:

    IAM
      |
    Network
      |
    Resource
      |
    Secret
      |
    Key
      |
    Deployment
      |
    Administrative

Audit data must be retained according to security and compliance policy.

---

# Appendix M — Backup Foundation

    PostgreSQL
       |
       +--> Automated Backup
       +--> PITR
       +--> Restore Test

    IaC State
       |
       +--> Versioning
       +--> Recovery

    Object Storage
       |
       +--> Lifecycle / Versioning
       +--> Recovery

Backup is not considered complete until restoration has been demonstrated.

---

# Appendix N — Cost Management

    Resource
       |
       v
    Tag
       |
       v
    Cost Allocation
       |
       v
    Budget
       |
       v
    Alert
       |
       v
    Review

Cost controls must provide visibility before attempting automatic remediation.

---

# Appendix O — Production Foundation Readiness

The production cloud foundation must answer:

1. Who owns the account?
2. Who can administer it?
3. Which identities deploy?
4. Where are secrets stored?
5. Where are keys protected?
6. Which resources are public?
7. Which resources are private?
8. How is traffic controlled?
9. How is infrastructure provisioned?
10. How is drift detected?
11. How is failure detected?
12. How is backup performed?
13. How is recovery performed?
14. How is cost monitored?
15. How is access audited?
16. How is production deployment approved?

If these questions cannot be answered with evidence, the foundation is not
production-ready.

---

# Appendix P — Operational Runbooks

Initial runbooks:

- provision environment;
- update infrastructure;
- rotate secret;
- rotate certificate;
- rotate key;
- revoke identity;
- restore database;
- recover object storage;
- recover IaC state;
- investigate failed deployment;
- investigate database outage;
- investigate queue outage;
- investigate network outage;
- respond to suspicious IAM activity;
- recover from cloud resource drift.

Each runbook must contain:

- trigger;
- prerequisites;
- steps;
- validation;
- rollback/recovery;
- escalation;
- evidence.

---

# Appendix Q — Open Questions

1. Which cloud provider is selected for the first production deployment?
2. Which account/project hierarchy does the provider support?
3. Will Development and Staging use separate cloud projects/accounts?
4. Will Production use a dedicated billing boundary?
5. Which IaC framework is selected?
6. Where will IaC state be stored?
7. What state-locking mechanism is used?
8. What is the exact production region?
9. Which availability zones are required?
10. Is a dedicated VPC/VNet required per environment?
11. Which network CIDR ranges are reserved?
12. What private DNS model is used?
13. Which managed TLS service is selected?
14. What certificate rotation policy is required?
15. Which identity federation mechanism is used for CI?
16. What exact administrative roles are required?
17. Is just-in-time privileged access available?
18. What is the break-glass mechanism?
19. What secret-management service is selected?
20. Which KMS service is selected?
21. Which keys require HSM-equivalent protection?
22. Which PostgreSQL service is selected?
23. What PostgreSQL HA configuration is required at R1.0?
24. Which queue service is selected?
25. Which object-storage service is selected?
26. Which compute platform hosts the modular monolith?
27. Which compute platform hosts workers?
28. Is Kubernetes required at initial launch?
29. What is the minimum production instance count?
30. What autoscaling mechanism is used later?
31. Which observability platform is selected?
32. Where are infrastructure logs retained?
33. Which SIEM receives security events?
34. What is the cloud audit-log retention?
35. What are the budget thresholds?
36. Who receives cost alerts?
37. What data classifications require separate storage?
38. What data-residency requirements apply?
39. Is cross-region backup required at R1.0?
40. What is the infrastructure recovery target?
41. How frequently must infrastructure recovery be tested?
42. Which production changes require manual approval?
43. What constitutes an emergency change?
44. How are emergency changes recorded?
45. What is the production deployment window?
46. Is zero-downtime deployment required for R1.0?
47. What maintenance windows apply?
48. What network connectivity is required for physical labs?
49. Is outbound-only Lab Agent connectivity sufficient?
50. Is a site-to-site VPN required?
51. Is private connectivity required for customer labs?
52. What firewall rules are required for Lab Agents?
53. What is the initial cloud cost ceiling?
54. Which infrastructure resources require deletion protection?
55. Which resources require immutable backup?
56. Which compliance framework is targeted first?
57. What evidence retention period applies?
58. What access-review frequency is required?
59. What penetration testing frequency is required?
60. What production support hours are required?
61. What on-call model is required?
62. What cloud-provider exit requirements should be preserved?
63. Which provider-specific features are acceptable as implementation details?
64. What infrastructure abstraction level is required for future portability?
65. What evidence is required before production account activation?
66. What evidence is required before connecting a physical lab?
67. Who approves the final C-M01 foundation gate?

These questions must become explicit architecture, security, operational or
commercial decisions before the affected capability is promoted to production.

---

# Appendix R — Definition of Done

C-M01 is Done when a clean environment can be created through IaC and provide:

    Account / Project
          |
          v
       Network
          |
          v
         IAM
          |
          v
    Secrets / KMS
          |
          v
      PostgreSQL
          |
          v
    Object Storage
          |
          v
        Queue
          |
          v
       Compute
          |
          v
    Observability
          |
          v
        CI/CD

and the environment can be:

- securely accessed;
- monitored;
- deployed;
- modified;
- audited;
- recovered;
- destroyed and recreated.

The demonstration must succeed in Development and Staging, with Production
foundation qualified sufficiently for controlled application promotion.

---

# Appendix S — Final Foundation Invariants

1. Infrastructure is defined as code.
2. Infrastructure changes are reviewed.
3. Infrastructure state is protected.
4. Environments are isolated.
5. Production is not dependent on Development.
6. Production access is restricted.
7. Administrative identities are named.
8. Privileged human access uses MFA.
9. CI/CD uses controlled identity.
10. Workloads use dedicated identity.
11. Secrets are externally managed.
12. Secrets are not committed.
13. Critical keys are protected.
14. Public exposure is minimized.
15. Database is private.
16. Queue is private.
17. Storage is private.
18. Network policy is explicit.
19. DNS is controlled.
20. TLS is mandatory for public interfaces.
21. Certificates are monitored.
22. Cloud audit logs are enabled.
23. Infrastructure metrics are collected.
24. Infrastructure logs are collected.
25. Critical failures generate alerts.
26. Resource ownership is identifiable.
27. Costs are attributable.
28. Budget thresholds are monitored.
29. Backup exists.
30. Restore is tested.
31. Recovery is documented.
32. IaC drift is detectable.
33. CI validates infrastructure.
34. Production infrastructure changes are controlled.
35. Deployment identity is auditable.
36. Infrastructure can be recreated.
37. Provider-specific implementation details do not leak into product domain
    architecture.
38. Cloud failure does not become physical robot safety authority.
39. Lab connectivity is explicitly bounded.
40. C-M01 establishes infrastructure capability, not application completion.

---

# Appendix T — Milestone Principle

> C-M01 establishes the trusted cloud foundation for Kritva RaaS. The
> foundation is intentionally built before application functionality is
> promoted into production because every later capability depends on a
> predictable infrastructure boundary. Accounts and environments establish
> ownership and isolation; Infrastructure as Code establishes
> reproducibility; networking establishes trust boundaries; IAM establishes
> least privilege; secret and key management protect sensitive credentials and
> cryptographic material; CI/CD establishes controlled change; and base
> observability establishes the ability to detect and diagnose infrastructure
> failure. PostgreSQL, object storage and queue are introduced as managed
> infrastructure capabilities without making their providers part of the RaaS
> business architecture. Development, Staging and Production remain
> independently secured and independently observable. Recovery is treated as a
> capability that must be demonstrated through recreation and restoration,
> not merely documented. Most importantly, the cloud foundation does not
> extend its authority into the physical safety domain: the Lab Agent, Kritva
> Runtime and local robot safety mechanisms remain authoritative for physical
> operation. C-M01 therefore provides the infrastructure contract on which
> subsequent backend, execution, results, security, scale and production
> launch milestones can safely build.
