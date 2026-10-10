# Kritva RaaS Risk Register

## 1. Purpose

This document defines the authoritative risk-management framework and active
risk register for the Kritva RaaS program.

The risk register identifies potential conditions that could prevent Kritva RaaS
from achieving its product, engineering, safety, security, commercial,
operational, schedule, and production objectives.

The register provides traceability across:

    Product Goal
        |
        v
    Phase
        |
        v
    Milestone
        |
        v
    Risk
        |
        +--> Trigger
        +--> Mitigation
        +--> Owner
        +--> Task
        +--> Issue
        +--> Decision
        |
        v
    Residual Risk
        |
        v
    Acceptance / Monitoring

A risk is a potential future adverse condition.

An issue is an adverse condition that has actually occurred.

## 2. Scope

This register covers risks associated with:

- product architecture;
- frontend and Studio;
- backend and Control Plane;
- database;
- cloud infrastructure;
- protocols;
- authentication and authorization;
- tenant isolation;
- source-code privacy;
- artifact security;
- booking;
- credits and financial integrity;
- Lab Agent;
- simulation;
- physical robots;
- safety;
- performance;
- scalability;
- schedule;
- staffing;
- commercial execution;
- regulatory/compliance obligations;
- production release;
- operations.

The register applies to P0 FOUNDATION through P8 PRODUCTION. The Phase column uses canonical
identifiers from `docs/planning/PHASES.md`. Physical robot operation, emergency-stop
qualification, and hardware-specific safety risks belong to P6 LAB & ROBOT; P5 EXECUTION
owns only simulated-execution and simulation-fidelity risks. A risk that spans phases
is split into separate rows, each owned by one phase, or lists every owning phase explicitly.

## 3. Goals

The risk-management process shall:

1. identify material risks early;
2. score risks consistently;
3. assign accountable owners;
4. define preventive mitigations;
5. define observable triggers;
6. track residual risk;
7. connect risks to tasks and milestones;
8. convert materialized risks into issues;
9. support phase-gate decisions;
10. support release readiness;
11. expose safety and security risks explicitly;
12. prevent schedule pressure from silently overriding critical controls.

## 4. Non-Goals

This document does not:

- replace the issue log;
- replace task tracking;
- replace milestone tracking;
- replace architecture decisions;
- replace security requirements;
- replace safety procedures;
- replace release management;
- replace detailed project schedules.

## 5. Risk Definition

A risk is an uncertain event or condition that, if it occurs, may negatively
affect one or more Kritva RaaS objectives.

A risk contains:

- risk ID;
- title;
- category;
- description;
- affected phase;
- affected milestone;
- likelihood;
- impact;
- score;
- mitigation;
- contingency;
- owner;
- trigger;
- status;
- residual score.

## 6. Risk Versus Issue

The distinction is mandatory.

    Risk:
        "The booking service may permit overlapping allocations."

    Issue:
        "Concurrent booking test produced overlapping allocations."

When a risk materializes:

    Risk
      |
      v
    Issue
      |
      v
    Corrective Task
      |
      v
    Resolution
      |
      v
    Residual Risk Review

The original risk remains in the register until explicitly closed, retired, or
superseded.

## 7. Risk Versus Task

A risk is uncertainty.

A task is planned work.

Example:

    Risk:
        Artifact signing keys may be compromised.

    Mitigation Task:
        Implement controlled production signing service.

The task reduces the risk but is not itself the risk.

## 8. Risk Versus Decision

Some risks require an architectural or product decision.

Example:

    Risk
      |
      v
    Architecture Decision Required
      |
      v
    ADR
      |
      v
    Mitigation Tasks

Material decisions shall be recorded in:

    docs/planning/DECISIONS.md

## 9. Risk Categories

The primary risk categories are:

| Category | Code | Scope |
|---|---|---|
| Technical | TECH | Architecture, implementation, integration |
| Safety | SAFE | Robot and physical-world safety |
| Security | SEC | Cybersecurity, privacy, trust |
| Schedule | SCH | Timing, dependencies, execution |
| Commercial | COMM | Pricing, adoption, economics |
| Regulatory | REG | Legal, compliance, jurisdiction |
| Operational | OPS | Reliability, support, production |
| Resource | RES | People, skills, hardware, capacity |
| Quality | QUAL | Defects, validation, acceptance |
| Dependency | DEP | External systems/vendors/platforms |

The requested core categories TECH, SAFE, SEC, SCH, COMM and REG are mandatory.
Additional categories are used where they improve risk visibility.

## 10. Risk Scoring Model

Risk uses:

    Risk Score = Likelihood x Impact

Likelihood and impact are each scored from 1 to 5.

Therefore:

    Minimum Score = 1
    Maximum Score = 25

## 11. Likelihood Scale

| Score | Level | Definition |
|---:|---|---|
| 1 | Rare | Unlikely during the relevant lifecycle |
| 2 | Unlikely | Possible but not expected |
| 3 | Possible | Credible and reasonably foreseeable |
| 4 | Likely | Expected unless actively controlled |
| 5 | Almost Certain | Expected to occur or already trending strongly |

Likelihood must be based on evidence where available.

## 12. Impact Scale

| Score | Level | Definition |
|---:|---|---|
| 1 | Negligible | Minimal local impact |
| 2 | Minor | Limited rework or user impact |
| 3 | Moderate | Material milestone/product impact |
| 4 | Major | Major release, security, commercial, or operational impact |
| 5 | Critical | Safety, catastrophic security, major financial/data loss, or severe production impact |

## 13. Risk Score Bands

| Score | Rating | Required Treatment |
|---:|---|---|
| 1-4 | Low | Monitor |
| 5-9 | Medium | Mitigate and review |
| 10-14 | High | Active mitigation and owner review |
| 15-19 | Very High | Executive/phase-owner attention |
| 20-25 | Critical | Immediate mitigation; may block phase/release |

Score bands are governance guidance.

Safety and security policy may override numeric scoring.

## 14. Critical Override Rule

A risk may be treated as critical even if the numeric score is below 20 when
it involves:

- physical safety;
- emergency-stop failure;
- uncontrolled robot motion;
- customer source-code exposure;
- critical cryptographic key compromise;
- cross-tenant data exposure;
- irreversible financial corruption;
- catastrophic data loss.

## 15. Inherent Risk

Inherent risk is the estimated risk before planned mitigation.

Example:

    Likelihood = 4
    Impact = 5
    Inherent Score = 20

## 16. Residual Risk

Residual risk is the remaining risk after mitigation is implemented.

Example:

    Inherent:
        4 x 5 = 20

    Residual:
        2 x 5 = 10

Residual risk must not be assumed to be zero merely because mitigation tasks
are planned.

## 17. Risk Treatment

Each risk should use one or more treatments:

- AVOID;
- REDUCE;
- TRANSFER;
- ACCEPT;
- MONITOR.

For safety-critical risks, acceptance requires explicit authority.

## 18. Avoid

Avoidance removes the risky activity or architecture.

Example:

    Do not execute customer source code remotely.
    Execute only packaged artifacts.

## 19. Reduce

Reduction lowers likelihood or impact.

Examples:

- contract tests;
- sandboxing;
- signing;
- redundancy;
- rate limiting;
- safety interlocks;
- automated validation.

## 20. Transfer

Transfer moves part of the exposure through:

- contractual terms;
- managed service agreements;
- insurance;
- third-party responsibility.

Transfer does not eliminate accountability.

## 21. Accept

Acceptance means the remaining risk is understood and explicitly accepted.

Critical safety/security risks should not be accepted informally.

## 22. Monitor

Monitoring is appropriate when:

- risk is low;
- mitigation is already effective;
- further reduction is not currently justified.

## 23. Risk Lifecycle

The standard lifecycle is:

    IDENTIFIED
        |
        v
    ASSESSED
        |
        v
    MITIGATION_PLANNED
        |
        v
    MITIGATION_IN_PROGRESS
        |
        v
    MONITORED
        |
        +------> MATERIALIZED
        |             |
        |             v
        |           ISSUE
        |
        v
    RESIDUAL_REVIEW
        |
        v
    ACCEPTED / CLOSED / RETIRED

Alternative states:

    ESCALATED
    TRANSFERRED
    SUPERSEDED

## 24. Risk Status Definitions

| Status | Meaning |
|---|---|
| IDENTIFIED | Risk recorded but not yet assessed |
| ASSESSED | Likelihood and impact established |
| MITIGATION_PLANNED | Mitigation defined |
| MITIGATION_IN_PROGRESS | Mitigation actively implemented |
| MONITORED | Controls operating; residual risk monitored |
| MATERIALIZED | Risk occurred and issue created |
| ESCALATED | Requires higher-level decision |
| ACCEPTED | Residual risk explicitly accepted |
| CLOSED | No longer materially relevant |
| RETIRED | Risk eliminated by product/architecture change |
| SUPERSEDED | Replaced by another risk |

## 25. Risk Owner

Every High, Very High, and Critical risk must have an accountable owner.

The owner is responsible for:

- monitoring;
- mitigation;
- trigger detection;
- escalation;
- residual assessment;
- linkage to tasks;
- communication.

## 26. Risk Trigger

A trigger is an observable condition indicating that risk probability or impact
has increased or the risk has materialized.

Examples:

- CI failure rate exceeds threshold;
- booking conflict reproduced;
- source scanner detects prohibited content;
- robot enters unexpected state;
- credit reconciliation mismatch;
- release milestone slips;
- security finding confirmed.

## 27. Risk Mitigation

Mitigation describes preventive actions intended to reduce likelihood or
impact.

Mitigation should be:

- actionable;
- owned;
- testable;
- linked to tasks;
- measurable where practical.

## 28. Contingency

Contingency describes what happens if the risk occurs.

Examples:

- rollback;
- feature disablement;
- artifact revocation;
- booking suspension;
- robot shutdown;
- service isolation;
- restore;
- incident response.

## 29. Risk Table Template

The primary register uses:

| ID | Category | Risk | Phase | Milestone | Likelihood | Impact | Score | Rating | Mitigation | Owner | Trigger | Status |
|---|---|---|---|---|---:|---:|---:|---|---|---|---|---|

Additional fields should include:

- inherent score;
- residual likelihood;
- residual impact;
- residual score;
- contingency;
- linked task;
- linked issue;
- decision;
- review date.

## 30. Initial Risk Register

The following register establishes the initial Kritva RaaS risk baseline.

All risks are planning risks and are not claims that the adverse event has
already occurred.

## 31. Risk Register — Architecture and Technical

| ID | Category | Risk | Phase | L | I | Score | Rating | Mitigation | Owner | Trigger | Status |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| R-TECH-001 | TECH | Modular-monolith boundaries become tightly coupled | P3 CONTROL PLANE | 3 | 4 | 12 | High | Enforce domain ownership, repositories, contracts, architecture review | Architecture Owner | Cross-domain direct writes or circular dependencies | MITIGATION_PLANNED |
| R-TECH-002 | TECH | Studio, backend and Lab contracts drift | P2 BUILD & ARTIFACT | 4 | 4 | 16 | Very High | Protocol-first contracts, versioning, contract tests | Integration Owner | Contract test failure or incompatible payload | MITIGATION_PLANNED |
| R-TECH-003 | TECH | Artifact/runtime compatibility failures | P2 BUILD & ARTIFACT | 3 | 4 | 12 | High | Manifest, compatibility matrix, validation before deployment | Artifact Owner | Valid artifact rejected or incompatible artifact accepted | MITIGATION_PLANNED |
| R-TECH-004 | TECH | Job and Run state becomes inconsistent | P5 EXECUTION | 3 | 5 | 15 | Very High | Explicit state machines, durable state, reconciliation | Execution Owner | State mismatch or unreconciled job | MITIGATION_PLANNED |
| R-TECH-005 | TECH | Local build environment is not reproducible | P2 BUILD & ARTIFACT | 3 | 4 | 12 | High | Pinned toolchains, deterministic builds, CI parity | Build Owner | Clean build differs from developer build | MITIGATION_PLANNED |
| R-TECH-006 | TECH | Simulation differs materially from physical robot behavior | P6 LAB & ROBOT | 4 | 5 | 20 | Critical | HIL, representative adapters, physical qualification | Robotics Owner | Simulation passes while HIL/physical behavior diverges | MITIGATION_PLANNED |
| R-TECH-007 | TECH | Third-party dependency breaks compatibility | P0 FOUNDATION | 3 | 3 | 9 | Medium | Version pinning, dependency scanning, upgrade policy | Platform Owner | Dependency release or CVE causes build/runtime failure | MITIGATION_PLANNED |
| R-TECH-008 | TECH | Object storage and PostgreSQL metadata become inconsistent | P2 BUILD & ARTIFACT | 3 | 4 | 12 | High | Transactional metadata, outbox/reconciliation, checksums | Backend Owner | Missing object or orphaned metadata | MITIGATION_PLANNED |
| R-TECH-009 | TECH | Queue/event delivery is lost or duplicated | P5 EXECUTION | 3 | 4 | 12 | High | At-least-once events, IDs, deduplication, durable state | Integration Owner | Event gap or duplicate processing | MITIGATION_PLANNED |
| R-TECH-010 | TECH | WebSocket/telemetry channel cannot sustain required load | P7 LIVE & RESULTS | 3 | 3 | 9 | Medium | Load tests, backpressure, rate limits, specialized transport | Execution Owner | Dropped telemetry exceeds target | MITIGATION_PLANNED |
| R-TECH-011 | TECH | Simulated Lab Agent and simulated robot do not exercise the real execution protocol, lifecycle and failure paths | P5 EXECUTION | 3 | 4 | 12 | High | Protocol-conformant simulator, fault injection, documented simulation limits, contract tests against the Lab protocol | Execution Owner | Simulated run passes while protocol or lifecycle conformance tests fail | MITIGATION_PLANNED |

## 32. Risk Register — Security and Privacy

| ID | Category | Risk | Phase | L | I | Score | Rating | Mitigation | Owner | Trigger | Status |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| R-SEC-001 | SEC | Customer source code leaves developer machine | P2 BUILD & ARTIFACT | 2 | 5 | 10 | High | Local-only source/build, privacy scanner, artifact allowlist | Security Owner | Source-like file detected in upload | MITIGATION_PLANNED |
| R-SEC-002 | SEC | Cross-tenant data access occurs | P3 CONTROL PLANE | 2 | 5 | 10 | High | Authz, repository filtering, DB constraints/RLS, tenant tests | Security Owner | Tenant isolation test failure | MITIGATION_PLANNED |
| R-SEC-003 | SEC | Artifact signing key is compromised | P2 BUILD & ARTIFACT | 2 | 5 | 10 | High | KMS/HSM, controlled signing, key separation, rotation | Security Owner | Unauthorized signing operation | MITIGATION_PLANNED |
| R-SEC-004 | SEC | Artifact contains malicious or prohibited payload | P2 BUILD & ARTIFACT | 3 | 5 | 15 | Very High | Scanning, allowlist, signature, sandboxing, Lab validation | Artifact Security Owner | Scanner or Lab Agent rejection | MITIGATION_PLANNED |
| R-SEC-005 | SEC | Authentication credentials are compromised | P3 CONTROL PLANE | 3 | 5 | 15 | Very High | MFA, passkeys, secure sessions, rate limiting | Identity Owner | Suspicious login or credential reuse | MITIGATION_PLANNED |
| R-SEC-006 | SEC | Authorization bypass permits privileged action | P3 CONTROL PLANE | 2 | 5 | 10 | High | RBAC + ABAC, deny-by-default, authorization tests | Security Owner | Unauthorized action succeeds | MITIGATION_PLANNED |
| R-SEC-007 | SEC | Secrets leak through source, logs or artifacts | P0 FOUNDATION | 3 | 5 | 15 | Very High | Secret scanning, redaction, managed secrets, no plaintext fallback | Security Owner | Secret scanner finding | MITIGATION_PLANNED |
| R-SEC-008 | SEC | Lab Agent identity or private key is compromised | P5 EXECUTION; P6 LAB & ROBOT | 2 | 5 | 10 | High | mTLS, local key protection, rotation/revocation | Lab Security Owner | Invalid Lab Agent identity | MITIGATION_PLANNED |
| R-SEC-009 | SEC | Audit records can be modified or deleted improperly | P8 PRODUCTION | 2 | 4 | 8 | Medium | Append-oriented storage, access controls, tamper evidence | Security Owner | Audit integrity verification fails | MITIGATION_PLANNED |
| R-SEC-010 | SEC | Vulnerable dependency reaches production | P8 PRODUCTION | 3 | 4 | 12 | High | SCA, SBOM, severity gates, patch process | Security Owner | High-severity dependency finding | MITIGATION_PLANNED |

## 33. Risk Register — Safety

| ID | Category | Risk | Phase | L | I | Score | Rating | Mitigation | Owner | Trigger | Status |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| R-SAFE-001 | SAFE | Robot fails to enter safe state after cloud disconnect | P6 LAB & ROBOT | 2 | 5 | 10 | Critical | Local runtime authority, watchdog, safe-state design, HIL | Safety Owner | Disconnect test fails | MITIGATION_PLANNED |
| R-SAFE-002 | SAFE | Emergency-stop path is unavailable or ineffective | P6 LAB & ROBOT | 2 | 5 | 10 | Critical | Independent E-stop, physical validation, human review | Safety Owner | E-stop test failure | MITIGATION_PLANNED |
| R-SAFE-003 | SAFE | Remote artifact commands cause unsafe robot behavior | P6 LAB & ROBOT | 2 | 5 | 10 | Critical | Capability policy, sandbox, runtime limits, HIL, physical gate | Robotics Safety Owner | Unsafe command observed | MITIGATION_PLANNED |
| R-SAFE-004 | SAFE | Fault recovery automatically restarts unsafe motion | P6 LAB & ROBOT | 2 | 5 | 10 | Critical | No unsafe auto-restart, explicit operator recovery | Safety Owner | Fault causes automatic motion restart | MITIGATION_PLANNED |
| R-SAFE-005 | SAFE | Simulation creates false confidence in safety | P6 LAB & ROBOT | 3 | 5 | 15 | Very High | Simulation limitation documentation, HIL, human safety review | Safety Owner | Physical behavior not represented in simulation | MITIGATION_PLANNED |
| R-SAFE-006 | SAFE | Simulated execution evidence is presented or accepted as physical safety evidence | P5 EXECUTION | 3 | 5 | 15 | Very High | Label simulated data and results, exclude physical safety claims from P5 acceptance, require P6 qualification before physical operation | Safety Owner | P5 evidence cited as proof of physical robot safety | MITIGATION_PLANNED |

## 34. Risk Register — Schedule and Resource

| ID | Category | Risk | Phase | L | I | Score | Rating | Mitigation | Owner | Trigger | Status |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| R-SCH-001 | SCH | P0 FOUNDATION takes longer than planned | P0 FOUNDATION | 3 | 4 | 12 | High | Prioritize P0, limit scope, daily/weekly tracking | Project Owner | P0 critical path slips | MITIGATION_PLANNED |
| R-SCH-002 | SCH | Backend/database/cloud work becomes a serial bottleneck | P0 FOUNDATION | 4 | 4 | 16 | Very High | Parallelize contract/design work, dependency mapping | Engineering Owner | Multiple domains waiting on same task | MITIGATION_PLANNED |
| R-SCH-003 | SCH | Physical robot availability delays P6 LAB & ROBOT | P6 LAB & ROBOT | 4 | 4 | 16 | Very High | Simulation first, reserve HIL resources early | Lab Owner | Hardware unavailable near qualification | MITIGATION_PLANNED |
| R-SCH-004 | SCH | Specialist security/safety review capacity is insufficient | P6 LAB & ROBOT; P8 PRODUCTION | 3 | 4 | 12 | High | Reserve reviewers, define gates early | Project Owner | Review queue threatens milestone | MITIGATION_PLANNED |
| R-RES-001 | RES | Required robotics/cloud/security skills are unavailable | P0 FOUNDATION | 3 | 4 | 12 | High | Early staffing plan, cross-training, specialist contractors | Project Owner | Critical task has no qualified owner | MITIGATION_PLANNED |
| R-RES-002 | RES | Lab infrastructure capacity is insufficient for concurrent users | P8 PRODUCTION | 3 | 4 | 12 | High | Capacity model, reservation limits, staged scale-out | Lab Owner | Queue time exceeds target | MITIGATION_PLANNED |

## 35. Risk Register — Commercial

| ID | Category | Risk | Phase | L | I | Score | Rating | Mitigation | Owner | Trigger | Status |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| R-COMM-001 | COMM | Platform-specific credit model is confusing to customers | P4 BOOKING & COMMERCIAL | 3 | 4 | 12 | High | Clear pricing UX, examples, rate transparency | Product Owner | Support/user feedback shows confusion | MITIGATION_PLANNED |
| R-COMM-002 | COMM | Credit pricing does not cover robot operating cost | P4 BOOKING & COMMERCIAL | 3 | 5 | 15 | Very High | Data-driven rate cards, cost model, periodic review | Commercial Owner | Contribution margin below target | MITIGATION_PLANNED |
| R-COMM-003 | COMM | Robot utilization is too low for viable RaaS economics | P8 PRODUCTION | 3 | 5 | 15 | Very High | Capacity analytics, platform selection, targeted demand generation | Business Owner | Utilization below threshold | MITIGATION_PLANNED |
| R-COMM-004 | COMM | Users expect source-level remote development instead of artifact execution | P2 BUILD & ARTIFACT | 3 | 4 | 12 | High | Product messaging, local build UX, documentation | Product Owner | Repeated source-upload requests | MITIGATION_PLANNED |
| R-COMM-005 | COMM | Subscription model does not align with platform usage | P4 BOOKING & COMMERCIAL | 3 | 4 | 12 | High | Separate access subscription and platform credits | Product Owner | High cancellation or low conversion | MITIGATION_PLANNED |

## 36. Risk Register — Regulatory and Compliance

| ID | Category | Risk | Phase | L | I | Score | Rating | Mitigation | Owner | Trigger | Status |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| R-REG-001 | REG | Data protection obligations differ by customer jurisdiction | P8 PRODUCTION | 3 | 4 | 12 | High | Data classification, minimization, retention, legal review | Compliance Owner | New jurisdiction/customer requirement | MITIGATION_PLANNED |
| R-REG-002 | REG | Robot operation requires jurisdiction-specific safety compliance | P6 LAB & ROBOT | 3 | 5 | 15 | Very High | Safety review, local compliance checklist, deployment gates | Safety Owner | New market/hardware certification requirement | MITIGATION_PLANNED |
| R-REG-003 | REG | Payment/billing requirements are not fully supported | P4 BOOKING & COMMERCIAL | 2 | 4 | 8 | Medium | Payment-provider/legal review, invoice requirements | Commercial Owner | Billing requirement identified | MITIGATION_PLANNED |
| R-REG-004 | REG | Customer data retention policy conflicts with operational retention | P8 PRODUCTION | 3 | 4 | 12 | High | Configurable retention, deletion/anonymization policy | Privacy Owner | Customer deletion/retention request cannot be fulfilled | MITIGATION_PLANNED |
| R-REG-005 | REG | Export-control or technology-transfer obligations affect deployment | P8 PRODUCTION | 2 | 5 | 10 | High | Legal review before international expansion | Business/Legal Owner | Restricted jurisdiction/customer identified | MITIGATION_PLANNED |

## 37. Risk Register — Operations and Quality

| ID | Category | Risk | Phase | L | I | Score | Rating | Mitigation | Owner | Trigger | Status |
|---|---|---|---|---:|---:|---:|---|---|---|---|
| R-OPS-001 | OPS | Lab Agent disconnect leaves cloud state stale | P5 EXECUTION | 3 | 4 | 12 | High | Heartbeat, durable state, reconciliation | Lab Owner | Heartbeat timeout with stale allocation | MITIGATION_PLANNED |
| R-OPS-002 | OPS | Robot maintenance state is not reflected in booking availability | P6 LAB & ROBOT | 3 | 4 | 12 | High | Resource-state integration and reconciliation | Lab Owner | Booking allocated to unavailable robot | MITIGATION_PLANNED |
| R-QUAL-001 | QUAL | Automated tests miss cross-domain failures | P5 EXECUTION | 4 | 4 | 16 | Very High | Contract, integration, E2E, simulation and HIL tests | QA Owner | Production-like flow fails despite unit tests | MITIGATION_PLANNED |
| R-QUAL-002 | QUAL | Release qualification does not represent production workloads | P8 PRODUCTION | 3 | 4 | 12 | High | Production-like environments and workload profiles | Release Owner | Production behavior differs materially | MITIGATION_PLANNED |
| R-DEP-001 | DEP | External service outage blocks core workflow | P3 CONTROL PLANE | 3 | 4 | 12 | High | Adapter boundaries, retry, timeout, fallback, graceful degradation | Platform Owner | External dependency unavailable | MITIGATION_PLANNED |

## 38. Risk Count

The initial register contains more than 30 material risks spanning:

- technical;
- security;
- safety;
- schedule;
- resource;
- commercial;
- regulatory;
- operational;
- quality;
- dependency.

The register is intentionally broader than the initial minimum to avoid
artificially hiding cross-domain exposure.

## 39. Risk Ownership Model

Risk ownership follows domain accountability.

| Domain | Typical Owner |
|---|---|
| Architecture | Architecture Owner |
| Frontend | Frontend Owner |
| Backend | Backend Owner |
| Database | Database Owner |
| Cloud | Cloud Owner |
| Security | Security Owner |
| Safety | Safety Owner |
| Lab | Lab Owner |
| Commercial | Product/Commercial Owner |
| Regulatory | Compliance/Legal Owner |
| Release | Release Owner |
| Quality | QA Owner |

A single named individual should replace role placeholders during execution.

## 40. Risk Review Frequency

Risk review shall occur:

- weekly during active development;
- at milestone reviews;
- at phase gates;
- before release qualification;
- after major architecture changes;
- after material incidents.

Critical risks require more frequent review.

## 41. Risk Escalation

The escalation path is:

    Risk Owner
        |
        v
    Milestone Owner
        |
        v
    Phase Owner
        |
        v
    Project Owner
        |
        +--> Security Authority
        +--> Safety Authority
        +--> Architecture Authority
        +--> Commercial / Legal Authority
        |
        v
    Executive Decision where required

## 42. Risk Trigger Monitoring

Triggers should be observable through:

- CI;
- tests;
- monitoring;
- metrics;
- audit logs;
- security scanners;
- booking reconciliation;
- credit reconciliation;
- Lab Agent heartbeat;
- robot telemetry;
- customer feedback;
- schedule tracking.

## 43. Trigger Response

When a trigger fires:

    Trigger
       |
       v
    Reassess Risk
       |
       +--> Increase Likelihood
       +--> Increase Impact
       +--> Escalate
       +--> Create Issue
       |
       v
    Update Mitigation

A trigger does not automatically mean the risk has materialized.

## 44. Risk Materialization

When the adverse event actually occurs:

1. retain the risk record;
2. create an issue;
3. link the issue to the risk;
4. update risk status to MATERIALIZED;
5. assess actual impact;
6. execute contingency;
7. implement corrective action;
8. reassess residual risk.

## 45. Risk Contingency

Each High or higher risk should have a contingency plan.

Examples:

    Security:
        revoke artifact/key and isolate affected service.

    Booking:
        suspend affected resource and reconcile allocations.

    Credit:
        freeze affected wallet operations and reconcile ledger.

    Robot:
        stop execution and place robot in safe state.

    Cloud:
        fail over or restore from backup.

## 46. Risk Mitigation Tasks

Material mitigation work should be represented as tasks.

Example:

    R-SEC-003
       |
       +--> KR-SEC-P6-005
       +--> KR-ART-P2-004
       +--> KR-REL-P8-001

The risk register identifies the exposure.

The task tracker records execution.

## 47. Risk and Milestone Planning

Milestone planning shall review risks before entering READY.

Required questions:

- What can prevent completion?
- What can delay completion?
- What can invalidate acceptance?
- What security risk exists?
- What safety risk exists?
- What external dependency exists?
- What evidence is required?

## 48. Risk and Phase Gates

Phase acceptance must include risk review.

A phase may not be marked COMPLETE if:

- a critical safety risk is unaddressed;
- a critical security risk is unaddressed;
- a mandatory exit-criteria risk remains uncontrolled;
- residual risk has not been explicitly accepted.

## 49. Risk and Release Gates

Before production release:

- Critical risks require disposition;
- Very High risks require explicit review;
- High risks require mitigation or acceptance;
- residual risks must be documented.

Release readiness must not be inferred solely from test pass rate.

## 50. Risk and Source Privacy

The source-code privacy architecture establishes:

    Customer Source
          |
          v
    Developer Machine
          |
          v
    Local Build
          |
          v
    .krv Artifact
          |
          v
    Control Plane

Risk R-SEC-001 specifically protects this boundary.

A source privacy risk must consider:

- source files;
- compiler inputs;
- git metadata;
- source maps;
- secrets;
- logs;
- crash dumps;
- temporary files.

## 51. Risk and Artifact Security

Artifact security risks include:

- malicious payloads;
- unauthorized modification;
- signature compromise;
- incompatible binaries;
- prohibited content;
- dependency vulnerabilities;
- replay;
- revoked artifacts.

Artifact validation must occur both in the Control Plane and at the Lab Agent
boundary where appropriate.

## 52. Risk and Tenant Isolation

Tenant isolation risks cover:

- API authorization;
- repository filtering;
- PostgreSQL constraints;
- optional RLS;
- object storage paths;
- cache keys;
- queue messages;
- logs;
- telemetry;
- results;
- downloads.

Defense in depth is mandatory.

## 53. Risk and Booking

Booking risks cover:

- availability;
- concurrency;
- overlapping allocations;
- resource state;
- maintenance;
- idempotency;
- cancellation;
- credit reservation.

PostgreSQL exclusion constraints are part of the planned defense for resource
allocation overlap.

## 54. Risk and Credits

Credit risks cover:

- platform-specific wallets;
- rate cards;
- reservations;
- consumption;
- refunds;
- ledger integrity;
- reconciliation.

The ledger remains authoritative evidence.

The wallet is a current-state projection.

## 55. Risk and Execution

Execution risks cover:

- artifact compatibility;
- deployment;
- Job state;
- Run state;
- disconnect;
- timeout;
- cancellation;
- telemetry;
- result generation.

Cloud state must remain reconcilable with local Lab state.

## 56. Risk and Physical Safety

Physical robot control remains local.

The cloud does not replace:

- emergency stop;
- local safety controller;
- hardware interlock;
- safe-state enforcement.

The governing principle is:

> Cloud availability must never be a prerequisite for emergency stop or
> local physical safety.

## 57. Risk and Simulation

Simulation is required to accelerate development but does not establish physical
safety by itself.

The progression is:

    Simulation
        |
        v
    Integration
        |
        v
    HIL
        |
        v
    Controlled Physical Robot
        |
        v
    Production Robot Pool

## 58. Risk and Testing

Testing reduces risk through:

- unit tests;
- component tests;
- contract tests;
- integration tests;
- E2E tests;
- simulation;
- HIL;
- physical qualification;
- performance;
- security;
- recovery;
- chaos testing.

Test coverage must be risk-driven.

## 59. Risk and Recovery

Recovery risks include:

- database restore;
- object storage restore;
- queue replay;
- service redeployment;
- Lab Agent reconnect;
- robot recovery;
- credit reconciliation.

Recovery objectives remain:

    Database RPO <= 15 minutes
    Database RTO <= 4 hours

These are initial targets and must be validated through qualification.

## 60. Risk and Cloud

Cloud architecture follows:

    Internet
       |
       v
    DNS / Edge / TLS
       |
       v
    Load Balancer / API Gateway
       |
       v
    Stateless API
       |
       +--> PostgreSQL
       +--> Object Storage
       +--> Queue
       +--> Secrets
       |
       v
    Workers
       |
       v
    Lab Connectivity
       |
       v
    Lab Agent

Cloud failure must not create unsafe physical behavior.

## 61. Risk and Scaling

The planned scaling progression is:

    Query / Index Optimization
          |
          v
    Connection Tuning
          |
          v
    Vertical Scaling
          |
          v
    Read Replicas
          |
          v
    Partitioning
          |
          v
    Domain Extraction
          |
          v
    Sharding if justified

Premature microservice or sharding complexity is itself a technical risk.

## 62. Risk and Commercial Model

Commercial architecture follows:

    Subscription
        |
        v
    Access Entitlement

    Platform
        |
        v
    Credit Type

    Resource Configuration + Duration
        |
        v
    Credit Consumption

The principle is:

> Subscription determines access; robotic platform determines credit type;
> resource configuration and duration determine consumption.

## 63. Risk and Platform Economics

Each platform requires:

- cost model;
- utilization assumptions;
- credit rate;
- cancellation policy;
- refund policy;
- capacity model.

Rates should be data-driven rather than hard-coded in application logic.

## 64. Risk and Regulatory Compliance

Regulatory risk must be evaluated by:

- customer geography;
- operating geography;
- data location;
- robot type;
- use case;
- industry;
- payment model;
- export restrictions.

The system shall provide configurable controls where requirements differ by
jurisdiction.

## 65. Risk and Data Retention

Retention risk is controlled through:

- data classification;
- explicit retention policies;
- object lifecycle;
- audit retention;
- financial retention;
- telemetry/log/video policy;
- deletion/anonymization procedures.

Backups must be considered separately from active data deletion requirements.

## 66. Risk and Staffing

Critical skills include:

- frontend;
- backend;
- database;
- cloud;
- security;
- robotics;
- Lab Agent;
- testing;
- safety;
- commercial operations.

Critical tasks must not remain ownerless.

## 67. Risk and Schedule

Schedule risk should be measured against the critical path:

    Foundation
        |
        v
    Core Platform
        |
        v
    Product MVP
        |
        v
    Remote Execution
        |
        v
    Booking + Commercial
        |
        v
    Physical Lab
        |
        v
    Production Security
        |
        v
    Scale
        |
        v
    Launch

Parallel work should be used where dependencies permit.

## 68. Risk and Documentation

Documentation drift is a project risk.

Material architecture, API, database, security and operational changes must
update the relevant documentation.

The tracking hierarchy remains:

    Planning
       |
       v
    Milestones
       |
       v
    Tasks
       |
       v
    Issues / Risks
       |
       v
    Evidence

## 69. Risk Review Record

Each formal review should record:

- date;
- participants;
- risks reviewed;
- score changes;
- new risks;
- closed risks;
- escalations;
- mitigation progress;
- residual acceptance.

## 70. Risk Score Update Rules

Likelihood and impact must be reassessed when:

- architecture changes;
- mitigation completes;
- new evidence appears;
- issue materializes;
- phase changes;
- deployment scope changes;
- commercial model changes;
- regulatory scope changes.

Scores must not remain unchanged merely for reporting convenience.

## 71. Residual Risk Acceptance

Residual risk acceptance requires:

- documented score;
- rationale;
- mitigation state;
- contingency;
- owner;
- approving authority where required.

Critical safety/security residual risk requires explicit approval.

## 72. Risk Closure

A risk may be CLOSED when:

- it is no longer applicable;
- the underlying architecture is removed;
- the risk has been eliminated;
- the lifecycle has ended;
- it has been replaced by a more accurate risk.

A risk should not be closed simply because mitigation work is complete.

## 73. Risk Retirement

A risk may be RETIRED when the risky capability is removed.

Example:

    Remote source execution
        |
        v
    Removed from product architecture
        |
        v
    Related source-execution risk retired

## 74. Risk Supersession

A risk becomes SUPERSEDED when a new risk represents the same exposure more
accurately.

The original risk must link to the replacement.

## 75. Risk Aging

Recommended risk age categories:

| Age | Review |
|---|---|
| 0-30 days | Normal |
| 31-90 days | Aging |
| 91-180 days | Long-running |
| >180 days | Executive review |

Long-running risks require evidence that they remain relevant.

## 76. Risk Dashboard

The project dashboard should report:

| Metric | Initial Value |
|---|---:|
| Total Risks | 40+ |
| Critical | As scored |
| Very High | As scored |
| High | As scored |
| Medium | As scored |
| Low | As scored |
| Materialized | 0 |
| Closed | 0 |
| Escalated | 0 |

Exact totals should be generated from the maintained register rather than
manually inferred after the initial baseline changes.

## 77. Risk Trend

Risk trends should track:

- new risks;
- closed risks;
- increased scores;
- reduced scores;
- materialized risks;
- overdue mitigation;
- residual exposure.

The goal is not simply to reduce risk count.

The goal is to reduce unacceptable exposure.

## 78. Risk Metrics

Recommended metrics include:

- total risk exposure;
- critical-risk count;
- very-high-risk count;
- average score;
- maximum score;
- residual exposure;
- mitigation completion;
- overdue mitigation;
- materialization rate;
- risk aging;
- risk concentration by category;
- risk concentration by phase.

## 79. Risk Concentration

Particular attention should be paid to concentration around:

- physical safety;
- source privacy;
- artifact security;
- tenant isolation;
- booking/credit integrity;
- simulation-to-physical transition;
- production readiness.

Multiple medium risks in one area may represent a high systemic risk.

## 80. Risk Aggregation

Risk aggregation should consider correlated risks.

Example:

    R-TECH-006
    R-QUAL-001
    R-SAFE-005

Together they may indicate a broader:

    Simulation-to-Physical Confidence Risk

The project may create a systemic risk if correlation becomes material.

## 81. Risk Escalation Thresholds

Immediate escalation is required when:

- score >= 20;
- physical safety is threatened;
- source privacy is threatened;
- cross-tenant access is demonstrated;
- production financial integrity is compromised;
- critical cryptographic material is compromised.

## 82. Risk Communication

Risk communication should be:

- factual;
- evidence-based;
- concise;
- owner-oriented;
- action-oriented.

Do not hide material risks to maintain an artificially positive project status.

## 83. Risk and RAG Status

Risk register informs project RAG:

| Condition | Typical RAG |
|---|---|
| Controlled low/medium risk | GREEN |
| Material high risk with active mitigation | AMBER |
| Uncontrolled critical/high risk | RED |
| Blocking safety/security risk | RED / BLOCKED |

RAG status remains a management judgment supported by evidence.

## 84. Risk and Phase Status

Phase status should reflect:

- unresolved critical risks;
- milestone blockers;
- mitigation completion;
- residual acceptance.

A phase cannot be GREEN solely because implementation is progressing.

## 85. Risk and Milestone Status

Milestones should review risks at:

- planning;
- READY;
- implementation;
- qualification;
- acceptance.

High-risk milestones require explicit mitigation evidence.

## 86. Risk and Task Status

A task linked to a High or higher risk should identify:

- risk ID;
- mitigation objective;
- acceptance evidence.

The task should not be marked ACCEPTED if its stated mitigation is incomplete.

## 87. Risk-to-Issue Flow

The mandatory materialization flow is:

    Risk Trigger
        |
        v
    Actual Adverse Event
        |
        v
    ISSUE-<DOMAIN>-<NUMBER>
        |
        v
    Corrective Task
        |
        v
    Fix / Mitigation
        |
        v
    Verification
        |
        v
    Residual Risk Review

## 88. Risk-to-Decision Flow

When mitigation requires architectural change:

    Risk
      |
      v
    Decision Required
      |
      v
    ADR
      |
      v
    Task(s)
      |
      v
    Evidence
      |
      v
    Residual Risk

## 89. Initial Critical Risks

The highest-attention initial risks are:

1. R-TECH-006 — Simulation differs from physical behavior.
2. R-TECH-002 — Contract drift.
3. R-TECH-004 — Job/Run inconsistency.
4. R-SEC-004 — Malicious/prohibited artifact.
5. R-SEC-005 — Authentication compromise.
6. R-SEC-007 — Secret leakage.
7. R-SAFE-001 — Unsafe disconnect recovery.
8. R-SAFE-002 — Emergency-stop failure.
9. R-SAFE-003 — Unsafe remote commands.
10. R-SAFE-004 — Unsafe automatic restart.
11. R-SAFE-005 — False simulation safety confidence.
12. R-SCH-002 — Core dependency bottleneck.
13. R-SCH-003 — Physical hardware availability.
14. R-COMM-002 — Pricing below operating cost.
15. R-COMM-003 — Low robot utilization.

These risks should receive priority attention during detailed planning.

## 90. Initial Risk Mitigation Priorities

Priority mitigation areas are:

    1. Physical safety boundary
    2. Source-code privacy
    3. Artifact integrity
    4. Authentication and authorization
    5. Tenant isolation
    6. Contract compatibility
    7. Job/Run state integrity
    8. Booking concurrency
    9. Credit ledger integrity
    10. Simulation/HIL transition
    11. Production recovery
    12. Commercial unit economics

## 91. P0 FOUNDATION Risk Actions

P0 FOUNDATION should prioritize:

- validate architecture assumptions;
- establish CI;
- establish security scanning;
- establish secret management;
- establish contracts;
- establish migration discipline;
- establish task ownership;
- establish risk review cadence.

P0 FOUNDATION should also convert major architectural uncertainty into explicit ADRs.

## 92. P1 STUDIO Risk Actions

P1 STUDIO should prioritize:

- local source-code privacy boundary;
- Studio and local runtime stability;
- project workflow integrity;
- IPC boundary security;
- local configuration and credential handling.

## 93. P2 BUILD & ARTIFACT Risk Actions

P2 BUILD & ARTIFACT should prioritize:

- source privacy;
- artifact allowlisting;
- signing;
- manifest validation;
- compatibility checks;
- local-build reproducibility.

## 94. P3 CONTROL PLANE Risk Actions

P3 CONTROL PLANE should prioritize:

- authentication;
- authorization;
- tenant isolation;
- project ownership;
- platform catalog integrity;
- database constraints;
- external dependency isolation.

Tenant isolation testing must be established before multi-tenant production use.

## 95. P4 BOOKING & COMMERCIAL Risk Actions

P4 BOOKING & COMMERCIAL should prioritize:

- booking concurrency;
- allocation exclusion;
- credit reservations;
- ledger integrity;
- refunds;
- rate-card correctness.

## 96. P5 EXECUTION Risk Actions

P5 EXECUTION should prioritize:

- simulated Lab Agent identity;
- protocol compatibility;
- simulation determinism and fidelity limits;
- Job/Run state;
- event delivery;
- disconnect recovery;
- clear labelling of simulated evidence.

P5 EXECUTION does not own physical safety, E-stop qualification, or hardware readiness.

## 97. P6 LAB & ROBOT Risk Actions

P6 LAB & ROBOT should prioritize:

- physical safety;
- E-stop;
- safe state;
- watchdogs;
- HIL;
- hardware qualification;
- jurisdiction-specific robot operation compliance;
- human safety review.

## 98. P7 LIVE & RESULTS Risk Actions

P7 LIVE & RESULTS should prioritize:

- telemetry and video channel capacity;
- telemetry reliability;
- result integrity;
- data provenance (simulated versus physical);
- observation access control.

## 99. P8 PRODUCTION Risk Actions

P8 PRODUCTION should prioritize:

- security qualification;
- key management;
- audit integrity;
- backup and recovery;
- capacity, load, stress and soak;
- multi-lab operation;
- release qualification;
- unresolved risk disposition;
- canary monitoring and rollback;
- commercial readiness.

## 100. Open Questions

The following remain open for future refinement:

1. Exact named risk owners.
2. Exact quantitative probability definitions.
3. Exact financial thresholds for commercial risks.
4. Exact utilization thresholds for each platform.
5. Exact safety certification requirements by robot platform.
6. Exact regulatory jurisdictions for initial launch.
7. Exact customer data residency requirements.
8. Exact SLA/SLO thresholds.
9. Exact production capacity targets.
10. Exact risk dashboard automation.
11. Whether risk scoring should include a detectability dimension.
12. Whether financial exposure should be separately quantified.
13. Whether a separate compliance register is required.
14. Whether external supplier risks require separate vendor records.
15. Whether risk reviews should be tied automatically to milestone status.

These questions do not block initial risk-register operation.

## 101. Acceptance Criteria — Structure

- [ ] Purpose defined.
- [ ] Scope defined.
- [ ] Goals defined.
- [ ] Non-goals defined.
- [ ] Risk definition established.
- [ ] Risk/task distinction established.
- [ ] Risk/issue distinction established.
- [ ] Risk/decision distinction established.
- [ ] Categories established.
- [ ] Lifecycle established.

## 102. Acceptance Criteria — Scoring

- [ ] Likelihood scale 1-5 defined.
- [ ] Impact scale 1-5 defined.
- [ ] Score formula defined.
- [ ] Risk bands defined.
- [ ] Critical override defined.
- [ ] Inherent risk defined.
- [ ] Residual risk defined.
- [ ] Residual review defined.

## 103. Acceptance Criteria — Risk Categories

- [ ] Technical risks represented.
- [ ] Safety risks represented.
- [ ] Security risks represented.
- [ ] Schedule risks represented.
- [ ] Commercial risks represented.
- [ ] Regulatory risks represented.
- [ ] Operational risks represented.
- [ ] Resource risks represented.
- [ ] Quality risks represented.
- [ ] Dependency risks represented.

## 104. Acceptance Criteria — Register

- [ ] At least 30 initial risks populated.
- [ ] Every risk has an ID.
- [ ] Every risk has a category.
- [ ] Every risk has a description.
- [ ] Every risk has a phase.
- [ ] Every risk has likelihood.
- [ ] Every risk has impact.
- [ ] Every risk has score.
- [ ] Every High+ risk has an owner.
- [ ] Every High+ risk has mitigation.
- [ ] Every High+ risk has a trigger.
- [ ] Every risk has a status.

## 105. Acceptance Criteria — Mitigation

- [ ] Mitigation is actionable.
- [ ] Mitigation can map to tasks.
- [ ] Contingency is considered.
- [ ] Owner is accountable.
- [ ] Trigger is observable.
- [ ] Residual risk is assessed.
- [ ] Mitigation completion is verified.

## 106. Acceptance Criteria — Issue Linkage

- [ ] Risk can become an issue.
- [ ] Issue retains risk linkage.
- [ ] Materialized risk changes status.
- [ ] Corrective task is created.
- [ ] Verification updates risk state.
- [ ] Residual risk is reassessed.

## 107. Acceptance Criteria — Task Linkage

- [ ] Risks link to tasks.
- [ ] Mitigation tasks are explicit.
- [ ] Task acceptance supports mitigation evidence.
- [ ] Task status does not automatically equal risk closure.
- [ ] Residual risk is reviewed after mitigation.

## 108. Acceptance Criteria — Decision Linkage

- [ ] Architecture risks can link to decisions.
- [ ] Product risks can link to decisions.
- [ ] ADR references are retained.
- [ ] Decision outcomes update mitigation.

## 109. Acceptance Criteria — Phase Mapping

- [ ] P0 FOUNDATION risks mapped.
- [ ] P1 STUDIO risks mapped.
- [ ] P2 BUILD & ARTIFACT risks mapped.
- [ ] P3 CONTROL PLANE risks mapped.
- [ ] P4 BOOKING & COMMERCIAL risks mapped.
- [ ] P5 EXECUTION risks mapped.
- [ ] P6 LAB & ROBOT risks mapped.
- [ ] P7 LIVE & RESULTS risks mapped.
- [ ] P8 PRODUCTION risks mapped.

## 110. Acceptance Criteria — Safety

- [ ] E-stop risk represented.
- [ ] Safe-state risk represented.
- [ ] Disconnect risk represented.
- [ ] Unsafe restart risk represented.
- [ ] Remote-command safety risk represented.
- [ ] Simulation confidence risk represented.
- [ ] Human safety review represented.

## 111. Acceptance Criteria — Security

- [ ] Source privacy risk represented.
- [ ] Tenant isolation risk represented.
- [ ] Artifact security risk represented.
- [ ] Signing-key risk represented.
- [ ] Authentication risk represented.
- [ ] Authorization risk represented.
- [ ] Secret leakage risk represented.
- [ ] Lab Agent identity risk represented.
- [ ] Dependency vulnerability risk represented.

## 112. Acceptance Criteria — Commercial

- [ ] Credit pricing risk represented.
- [ ] Platform utilization risk represented.
- [ ] Credit model usability risk represented.
- [ ] Subscription alignment risk represented.
- [ ] Operating-cost coverage considered.

## 113. Acceptance Criteria — Regulatory

- [ ] Data protection risk represented.
- [ ] Robot safety compliance represented.
- [ ] Payment compliance represented.
- [ ] Retention requirements represented.
- [ ] Export-control risk represented.

## 114. Acceptance Criteria — Operations

- [ ] Lab Agent disconnect risk represented.
- [ ] Robot maintenance risk represented.
- [ ] Recovery risk represented.
- [ ] Observability considered.
- [ ] Production monitoring considered.

## 115. Acceptance Criteria — Review

- [ ] Weekly risk review defined.
- [ ] Milestone review defined.
- [ ] Phase-gate review defined.
- [ ] Release review defined.
- [ ] Critical escalation defined.
- [ ] Risk aging defined.
- [ ] Risk trend defined.

## 116. Acceptance Criteria — Governance

- [ ] Every High+ risk has owner.
- [ ] Material risks have triggers.
- [ ] Material risks have mitigation.
- [ ] Critical risks cannot be silently accepted.
- [ ] Residual risk acceptance is explicit.
- [ ] Material risk status changes are traceable.
- [ ] Risk closure is justified.

## 117. Acceptance Criteria — Initial State

- [ ] Initial register contains 30+ risks.
- [ ] Risks are planning risks rather than issues.
- [ ] No risk is falsely marked materialized.
- [ ] No issue is inferred from risk existence.
- [ ] Initial owners may be role-based/TBD.
- [ ] P0 FOUNDATION is the first active execution phase.
- [ ] Risk review begins with P0 FOUNDATION.

## 118. Acceptance Criteria — Production Readiness

- [ ] Critical safety risks reviewed.
- [ ] Critical security risks reviewed.
- [ ] Tenant risks reviewed.
- [ ] Artifact risks reviewed.
- [ ] Booking risks reviewed.
- [ ] Credit risks reviewed.
- [ ] Recovery risks reviewed.
- [ ] Physical deployment risks reviewed.
- [ ] Commercial risks reviewed.
- [ ] Regulatory risks reviewed.

## 119. Final Risk Management Invariants

The following invariants are mandatory:

1. Every material risk has a unique ID.
2. Every risk has a category.
3. Every risk has likelihood and impact.
4. Every risk has a calculated score.
5. Every High+ risk has an accountable owner.
6. Every High+ risk has mitigation.
7. Every High+ risk has an observable trigger.
8. Every material risk identifies its affected phase.
9. Material risks identify affected milestones.
10. Material risks link to mitigation tasks.
11. Materialized risks create issues.
12. Materialized risks remain traceable.
13. Critical safety risks receive explicit safety governance.
14. Critical security risks receive explicit security governance.
15. Financial integrity risks require reconciliation.
16. Residual risk is not assumed to be zero.
17. Risk closure requires justification.
18. Risk acceptance requires explicit authority where material.
19. Risk scores are updated when evidence changes.
20. Schedule pressure cannot silently override safety/security gates.
21. Simulation cannot substitute for physical safety qualification.
22. Cloud controls cannot override local physical safety.
23. Source privacy remains an architectural security boundary.
24. PostgreSQL remains authoritative for structured business state.
25. The risk register informs but does not replace issue, task, milestone or
    release tracking.

## 120. Final Risk Review Flow

The canonical risk-management flow is:

    IDENTIFIED
        |
        v
    ASSESSED
        |
        v
    MITIGATION_PLANNED
        |
        v
    MITIGATION_IN_PROGRESS
        |
        v
    MONITORED
        |
        +---------> MATERIALIZED
        |                |
        |                v
        |              ISSUE
        |                |
        |                v
        |          CORRECTIVE TASK
        |                |
        |                v
        |            VERIFICATION
        |                |
        +----------------+
        |
        v
    RESIDUAL_REVIEW
        |
        +--> ACCEPTED
        +--> CLOSED
        +--> RETIRED
        +--> SUPERSEDED

## 121. Initial Risk Baseline

The initial Kritva RaaS risk posture is:

    Product:
        Planning / Foundation

    Active Phase:
        P0 FOUNDATION

    Implementation:
        Not Started

    Risk Register:
        Populated

    Materialized Risks:
        0 declared

    Active Issues:
        0 declared

    Active Critical Risks:
        Present in planning baseline and require mitigation planning

    Unresolved Safety Risks:
        Present by design because physical qualification has not started

    Unresolved Security Risks:
        Present by design because production qualification has not started

    Production Readiness:
        Not Started

The existence of a risk does not mean the product is unsafe or insecure.

It means the condition requires explicit engineering treatment before the
relevant phase or release gate.

## 122. Final Principle

> Kritva RaaS RISK_REGISTER.md shall be the authoritative record of material
> uncertainties that could prevent the product from meeting its technical,
> safety, security, schedule, commercial, regulatory and operational objectives.
> Risk shall be assessed using a consistent likelihood-by-impact model, with
> explicit severity overrides for critical safety, security, privacy, financial
> and data-integrity conditions. Every material risk shall have an owner,
> mitigation and observable trigger, and significant risks shall be linked to
> tasks, milestones, issues and decisions as appropriate. When a risk
> materializes, it shall become an explicit issue rather than disappearing from
> the register. Residual risk shall be reassessed after mitigation and critical
> safety and security risks shall never be silently accepted for schedule
> convenience. The initial register contains a broad baseline of realistic
> Kritva RaaS risks across all phases, while no risk is treated as a materialized
> issue until engineering evidence confirms that the adverse event has actually
> occurred. The objective of this register is not merely to count risks, but to
> make uncertainty visible early enough that architecture, implementation,
> testing, safety, security, commercial planning and release decisions can
> actively reduce unacceptable exposure.
