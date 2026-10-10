# Kritva RaaS Resource Plan

## Document Control

| Field | Value |
|---|---|
| Document | Resource Plan |
| Path | `docs/planning/RESOURCE_PLAN.md` |
| Project | Kritva RaaS |
| Status | Planning baseline |
| Scope | P0 FOUNDATION through P8 PRODUCTION |
| Primary audience | Project leadership, engineering leads, hiring owners, finance and operations |
| Planning unit | Full-time equivalent (FTE), person-month (PM), and budget category |
| Estimate type | Indicative planning estimates; validate against approved scope, delivery evidence, and quotations |
| Naming authority | `docs/planning/PHASES.md` |
| Milestone scope authority | Applicable milestone dossiers under `docs/**/milestones/` |

---

## Ownership and Boundaries

### What This Document Owns

This document owns the cross-phase resource and capacity plan for Kritva RaaS. It defines:

- Teams and role families needed across P0 FOUNDATION through P8 PRODUCTION.
- Indicative staffing levels and headcount ramp by phase.
- Hiring priorities, sequencing, and staffing gates.
- Shared engineering tools, development infrastructure, test infrastructure, and laboratory hardware requirements.
- Budget categories, capacity assumptions, cost-control checkpoints, and resource risks.
- Cross-team allocation principles and the resource implications of dependencies between phases.
- Conditions for increasing, maintaining, or reducing staffing and infrastructure commitments.

### What This Document Does Not Own

| Subject | Owning document |
|---|---|
| Canonical phase names, numbers, and phase-level definitions | `docs/planning/PHASES.md` |
| Detailed milestone objectives, scope, dependencies, deliverables, risks, and exit criteria | Applicable milestone dossiers under `docs/**/milestones/` |
| Individual implementation tasks and their owners | Applicable milestone `TASKS.md` |
| Task-specific acceptance conditions | Applicable task-scoped `ACCEPTANCE_CRITERIA.md` |
| Engineering review procedure and completion evidence | Applicable `REVIEW_CHECKLIST.md` |
| Accepted implementation history | Applicable `CHANGELOG.md` |
| Required Git operations and commit sequence | Applicable `GIT_COMMIT_STEP.md` |
| Technical architecture and component boundaries | Applicable architecture documents under `docs/**/architecture/` |
| Domain-specific engineering decisions | Applicable domain `DECISIONS.md` |
| Detailed API, database schema, cloud topology, frontend design, and execution contracts | The corresponding domain architecture and specification documents |
| Final hiring approval, compensation offers, purchase orders, and accounting records | Company leadership and finance processes |
| Formal security approval, robot safety approval, and production release authorization | The designated review and approval owners |

This document estimates the resources required to deliver approved scope. It does not redefine milestone scope, make an implementation task mandatory, approve expenditure, or authorize physical robot operation or production release.

### Boundary Rules

1. Use only the frozen phase and milestone names defined in this plan and `docs/planning/PHASES.md`.
2. Do not create alternative phase names to represent a staffing category, technical workstream, or deployment environment.
3. Allocate staff against the phase where their principal deliverable is owned, not simply where their work begins.
4. Shared specialists may support multiple phases. Their allocations must be recorded once in the capacity model and must not be counted as separate full-time hires in every phase.
5. Treat milestone dossiers as the authority for whether a capability belongs in a phase.
6. Treat estimates as planning ranges until scope, staffing availability, delivery evidence, and costs are validated.
7. Keep simulated execution distinct from physical robotics expansion.
8. Do not assume that a staffing estimate or a completed software milestone constitutes safety approval or production readiness.

---

## 1. Purpose and Planning Approach

The purpose of this resource plan is to estimate the people, infrastructure, tools, laboratory equipment, and budget categories needed to progress Kritva RaaS from foundation work through production launch.

The plan supports five management decisions:

1. Which roles must be available for each phase?
2. When should those roles be hired, contracted, or shared?
3. What engineering infrastructure and physical equipment must be ready before the corresponding work starts?
4. What approximate person-month capacity and budget exposure should leadership expect?
5. What evidence is required before increasing the resource commitment for the next phase?

The estimates are intended for initial company and engineering planning. They are not supplier quotations, compensation commitments, or a promise that every phase will require the same calendar duration.

### 1.1 Planning Principles

- **Deliverable-led staffing:** Staff to the approved milestone deliverables rather than to speculative feature lists.
- **Small core team:** Keep architecture, integration, release ownership, and safety-critical decisions with a compact, accountable core team.
- **Specialist leverage:** Use short-term specialist support where work is bounded and ongoing full-time capacity is not justified.
- **Evidence before expansion:** Increase staffing when the current phase demonstrates working outputs and the next phase has sufficiently defined scope.
- **Shared infrastructure:** Prefer reusable CI, test, observability, and development infrastructure over independent setups for each team.
- **Simulation before hardware scale-up:** Build and validate software execution paths in simulation before expanding physical robot activity.
- **Explicit safety budget:** Allocate time and money for risk assessment, testing, independent review, and remediation.
- **No double counting:** Distinguish a shared person's total FTE from the fraction allocated to an individual phase.
- **Contingency:** Preserve capacity for integration, defects, external dependencies, and rework.

### 1.2 Estimation Units

| Unit | Meaning | Use |
|---|---|---|
| FTE | One full-time-equivalent person's capacity over the stated period | Staffing and team capacity |
| PM | One person-month of effort | Phase effort estimation |
| Calendar month | Elapsed project time | Schedule and hiring planning |
| Shared FTE | Fraction of a person's time allocated to a phase | Architecture, DevOps, security, finance, and other cross-phase support |
| CapEx | Capital expenditure | Lab equipment, robot hardware, workstations, and durable infrastructure |
| OpEx | Operating expenditure | Salaries, cloud services, licenses, support, and recurring lab costs |
| Contingency | Reserved budget for uncertainty and unexpected work | Cost and schedule resilience |

A person-month is an effort measure, not a guarantee of calendar throughput. Parallel work, onboarding, reviews, integration dependencies, and specialist availability affect delivery time.

---

## 2. Frozen Phase and Milestone Model

The following phase sequence is the only phase model used by this resource plan.

| Phase | Canonical name | Primary resource-planning focus |
|---|---|---|
| P0 | FOUNDATION | Architecture alignment, engineering foundations, and initial tooling |
| P1 | STUDIO | Desktop Studio |
| P2 | BUILD & ARTIFACT | Local build and artifact |
| P3 | CONTROL PLANE | Backend, identity, and data |
| P4 | BOOKING & COMMERCIAL | Resources and financial systems |
| P5 | EXECUTION | Remote execution on simulated robots |
| P6 | LAB & ROBOT | Physical robotics expansion |
| P7 | LIVE & RESULTS | Video, telemetry, and results |
| P8 | PRODUCTION | Security hardening, scale, operations, and launch |

### 2.1 Frontend Milestone Alignment

| Milestone | Canonical name | Phase alignment | Resource-planning implication |
|---|---|---|---|
| F-M01 | STUDIO FOUNDATION | P0-P1 | Initial frontend foundations and desktop Studio capability |
| F-M02 | PROJECTS | P1 | Project-oriented Studio workflows |
| F-M03 | BUILD & ARTIFACT | P2 | Local build and artifact workflows |
| F-M04 | BOOKING | P4 | Booking and commercial user workflows |
| F-M05 | EXECUTION | P5 | Remote execution workflows for simulated robots |
| F-M06 | LIVE | P7 | Live video and telemetry experience |
| F-M07 | RESULTS | P7 | Results presentation and review workflows |

### 2.2 Backend Milestone Alignment

| Milestone | Canonical name | Phase alignment | Resource-planning implication |
|---|---|---|---|
| B-M01 | CONTROL PLANE | P3 | Control-plane services and associated integration |
| B-M02 | ARTIFACT | P2-P3 | Artifact services and their integration with the control plane |
| B-M03 | PLATFORM | P3 | Backend platform capabilities |
| B-M04 | BOOKING | P4 | Booking and commercial service integration |
| B-M05 | EXECUTION | P5 | Remote execution service integration |
| B-M06 | RESULTS | P6-P7 | Results-related services and integration |
| B-M07 | PRODUCTION | P8 | Production service readiness |

### 2.3 Database Milestone Alignment

| Milestone | Canonical name | Phase alignment | Resource-planning implication |
|---|---|---|---|
| DB-M01 | FOUNDATION | P0-P3 | Data foundations across the initial phases |
| DB-M02 | CORE DATA | P3 | Core platform data |
| DB-M03 | BOOKING DATA | P4 | Booking and commercial data |
| DB-M04 | EXECUTION DATA | P5-P7 | Execution, laboratory, telemetry, and results data as defined by milestone scope |

### 2.4 Cloud Milestone Alignment

| Milestone | Canonical name | Phase alignment | Resource-planning implication |
|---|---|---|---|
| C-M01 | FOUNDATION | P0 | Initial cloud and engineering infrastructure |
| C-M02 | DEVELOPMENT | P1-P3 | Development infrastructure and engineering integration |
| C-M03 | STAGING | P4-P7 | Staging infrastructure and validation environments |
| C-M04 | PRODUCTION | P8 | Production infrastructure and operational readiness |

Milestone alignment identifies the relevant resource-planning area. It does not change the phase boundaries or authorize work outside an approved milestone's scope.

---

## 3. Resource Model and Assumptions

### 3.1 Baseline Team Structure

The initial team is expected to combine a small set of full-time engineering owners with specialists shared across phases.

| Team or role family | Primary accountability | Expected staffing approach |
|---|---|---|
| Product and engineering leadership | Scope, sequencing, architecture decisions, and resource allocation | Core leadership |
| Frontend engineering | Desktop Studio and user-facing workflows | Core engineers, with phase-specific ramp |
| Backend engineering | Control plane, service integration, and execution-related services | Core engineers, with phase-specific ramp |
| Database engineering | Data model, migrations, integrity, and performance | Shared initially; increase when workload justifies it |
| Cloud and DevOps | CI/CD, development environments, deployment, and operations | Shared initially; dedicated capacity as deployment complexity grows |
| Build and artifact engineering | Local build integration, artifact handling, and reproducibility | Core engineering allocation aligned with P2 BUILD & ARTIFACT |
| QA and test automation | Automated tests, integration coverage, and regression evidence | Shared initially; increase as integration scope grows |
| Security engineering | Threat modeling, identity review, hardening, and production security | Specialist support initially; stronger dedicated capacity for P8 PRODUCTION |
| Robotics and simulation engineering | Simulated robot execution and environment integration | Introduce for P5 EXECUTION |
| Robotics hardware and controls | Physical hardware integration, actuation, sensors, and lab validation | Introduce for P6 LAB & ROBOT |
| Video and telemetry engineering | Live media, telemetry pipelines, and results integration | Introduce for P7 LIVE & RESULTS |
| SRE and operations | Reliability, incident response, observability, and production operations | Part-time initially; dedicated capacity for P8 PRODUCTION |
| Finance and commercial operations | Cost controls, booking workflows, pricing and financial-system processes | Business owner plus engineering support for P4 BOOKING & COMMERCIAL |
| Technical documentation | Architecture records, operator instructions, onboarding, and release notes | Shared responsibility, with an accountable documentation owner |

### 3.2 Hiring Versus Contracting

Use full-time hires when work is continuous, central to the product, or requires long-term system ownership. Use contractors or specialist consultants when the scope is bounded, independent review is valuable, or the workload is intermittent.

| Work category | Preferred initial approach | Trigger for dedicated capacity |
|---|---|---|
| Core architecture and integration | Internal ownership | Always retain accountable internal owners |
| Desktop Studio | Core frontend engineer(s) | Sustained feature and maintenance backlog |
| Build and artifact | Core engineering ownership | Multiple concurrent build targets or sustained artifact complexity |
| Backend and data | Core backend owner plus shared data expertise | Growing service count, throughput, or operational load |
| Security assessment | Independent specialist review plus internal remediation owner | Repeated assessments or continuous security operations |
| Simulation | Internal integration owner with targeted specialist support | Multiple simulation environments or sustained test demand |
| Physical robotics | Small internal integration team plus equipment/vendor support | Multiple concurrent robots, repeated integration, or sustained lab operations |
| Video and telemetry | Internal service ownership plus targeted media expertise | Sustained live workload, reliability requirements, and customer demand |
| SRE and operations | Shared DevOps/SRE allocation initially | Production availability and incident-response obligations |
| Finance and commercial systems | Business owner with limited engineering allocation | Increasing transaction volume, reconciliation burden, or audit needs |

### 3.3 Capacity Assumptions

For initial planning:

- One full-time engineer contributes approximately 1.0 FTE before leave, onboarding, meetings, reviews, and cross-team duties.
- A planning allowance of 0.75-0.85 effective delivery FTE per full-time engineering FTE is reasonable for early estimates.
- Leads and architects should have explicit delivery allocations rather than being counted as 100% feature capacity while carrying management duties.
- Shared infrastructure and security roles should be allocated across phases, with their total allocation capped at the person's available capacity.
- Phase overlap is expected. The sum of all phase FTE figures may exceed the simultaneous company headcount because estimates describe effort across different calendar windows.
- Physical equipment procurement, vendor lead times, and lab setup can affect elapsed time even when engineering effort is available.
- Estimates must be revised when milestone dossiers, acceptance criteria, or actual implementation evidence change.

These assumptions are planning defaults, not contractual productivity targets.

---

## 4. Phase-Level Resource Summary

The table below gives an indicative staffing range for the active phase team. It is not the total company headcount and excludes fractional support from leadership, finance, security, and shared infrastructure where noted.

| Phase | Primary capability | Indicative active team | Main hiring emphasis | Resource gate |
|---|---|---:|---|---|
| P0 FOUNDATION | Engineering foundations | 3-5 FTE | Leadership, architecture, core engineering, DevOps | Scope and development environment established |
| P1 STUDIO | Desktop Studio | 4-6 FTE | Frontend and desktop integration | Studio workflows demonstrated |
| P2 BUILD & ARTIFACT | Local build and artifact | 4-7 FTE | Build integration, artifact handling, test automation | Repeatable local build and artifact evidence |
| P3 CONTROL PLANE | Backend, identity, and data | 5-8 FTE | Backend, database, identity, platform integration | Core service and data contracts validated |
| P4 BOOKING & COMMERCIAL | Resources and financial systems | 5-8 FTE | Commercial workflows, booking, data integrity | Booking and financial flows validated |
| P5 EXECUTION | Remote execution on simulated robots | 6-9 FTE | Execution integration, simulation, QA | Repeatable simulated remote execution |
| P6 LAB & ROBOT | Physical robotics expansion | 7-11 FTE | Robotics integration, controls, lab and safety review | Physical lab readiness and approved test procedures |
| P7 LIVE & RESULTS | Video, telemetry, and results | 7-11 FTE | Media, telemetry, results integration, reliability | End-to-end live and results evidence |
| P8 PRODUCTION | Security hardening, scale, operations, and launch | 8-13 FTE | Security, SRE, performance, support, release | Production-readiness approvals |

### 4.1 Interpreting the Ranges

- The lower end assumes a narrow initial product scope, reuse of existing tooling, limited parallel work, and strong founder involvement.
- The upper end assumes more parallel delivery, higher integration complexity, additional test coverage, and a larger operational burden.
- A specialist may contribute across multiple phases without becoming a dedicated full-time hire.
- The phase team ranges should not be added together to calculate peak headcount.
- Hiring decisions should be based on the next phase's dependency needs and the team's demonstrated throughput, not solely on the upper end of the range.

### 4.2 Shared Roles Not Fully Represented in Phase Teams

The following roles can remain shared across phases for some or all of the roadmap:

- Engineering leadership and architecture review.
- Cloud infrastructure and developer productivity.
- Security review and compliance support.
- QA strategy and test automation.
- Documentation and developer experience.
- Finance, procurement, and commercial operations.
- Recruiting and people operations.

The phase allocation tables must include their planned FTE contribution when estimating effort. Shared roles must not be added to every phase as if each phase had its own separate full-time person.

---

## 5. P0 FOUNDATION — Resource Plan

### 5.1 Objective

Establish the minimum engineering and organizational foundation needed to execute the approved roadmap with controlled scope, reproducible development environments, and clear ownership.

### 5.2 Staffing Plan

| Role | Indicative FTE | Hiring approach | Primary responsibility |
|---|---:|---|---|
| Engineering lead / architect | 0.5-1.0 | Founder or core hire | Architecture alignment, scope control, integration decisions |
| Senior software engineer | 1.0-2.0 | Core hire | Initial codebase and engineering foundations |
| DevOps / infrastructure engineer | 0.5-1.0 | Shared or contract initially | Repository automation, CI, development environments |
| QA / test automation engineer | 0.25-0.5 | Shared initially | Test strategy and early automated checks |
| Product / project coordination | 0.25-0.5 | Founder or shared | Planning, dependency tracking, acceptance evidence |

Indicative active team: 3-5 FTE.

### 5.3 Hiring Gate

Before increasing the team:

- Confirm the canonical phase and milestone model.
- Establish repository access, branching conventions, CI, and baseline tests.
- Assign accountable owners to the initial approved work.
- Confirm development workstation and build requirements.
- Identify the initial security, licensing, and dependency-management requirements.
- Establish a cost-tracking method for engineering time and infrastructure.

### 5.4 Tooling and Infrastructure

| Category | Initial provision | Cost treatment |
|---|---|---|
| Developer workstations | Suitable engineering workstations | CapEx or employee equipment |
| Source control | Hosted repository and access controls | OpEx |
| CI runners | Small shared runners | OpEx |
| Development environments | Reproducible local and CI configurations | Setup effort and OpEx |
| Issue and documentation tracking | Shared project tracking and documentation | OpEx |
| Code quality | Static analysis, formatting, and test tools | OpEx or approved open-source tooling |
| Secrets management | Restricted development credentials | OpEx and engineering effort |
| Backup | Repository and essential project data backup | OpEx |

### 5.5 Budget Categories

- Engineering payroll and founder allocation.
- Workstations and basic developer equipment.
- Source-control, CI, and project-management services.
- Initial cloud and build infrastructure.
- Legal, licensing, and business setup costs where applicable.
- Recruiting and onboarding.
- Contingency for development-environment issues and setup rework.

### 5.6 Exit Evidence

P0 FOUNDATION is ready to support expansion when the development environment is reproducible, baseline engineering practices are established, ownership is assigned, and the approved next-phase scope is sufficiently clear. Detailed acceptance conditions remain with the applicable milestone dossiers.

---

## 6. P1 STUDIO — Resource Plan

### 6.1 Objective

Staff the desktop Studio experience and the initial project workflows without prematurely hiring for later backend, commercial, or physical robotics requirements.

### 6.2 Staffing Plan

| Role | Indicative FTE | Hiring approach | Primary responsibility |
|---|---:|---|---|
| Frontend / desktop engineer | 2.0-3.0 | Core hires | Desktop Studio application and user workflows |
| UX / product design | 0.25-0.75 | Shared or contract | Interaction design, usability, and workflow clarity |
| Frontend integration / architecture | 0.5-1.0 | Shared core owner | Application structure and interface contracts |
| QA / UI automation | 0.5-0.75 | Shared or growing role | Workflow tests and regression coverage |
| DevOps / developer productivity | 0.25-0.5 | Shared | Build, packaging, and development automation |
| Product coordination | 0.25-0.5 | Shared | Requirements, prioritization, and acceptance review |

Indicative active team: 4-6 FTE.

### 6.3 Hiring Gate

Add frontend capacity when the desktop Studio scope is approved and the existing team cannot deliver the required workflows without creating integration or quality risk.

Before hiring, confirm:

- Supported desktop platforms and packaging expectations.
- Ownership of the frontend architecture and application lifecycle.
- Interface contracts with backend services.
- UX requirements and acceptance evidence for the Studio workflows.
- Automated testing strategy for critical user paths.
- A practical approach to application distribution and updates.

### 6.4 Tooling and Infrastructure

- Desktop development and debugging environments.
- UI test automation and screenshot or workflow evidence where appropriate.
- Cross-platform build and packaging infrastructure if multiple platforms are in scope.
- Design and product collaboration tools.
- Local test services and controlled test data.
- Application crash reporting for development and test environments, where justified.
- Secure handling of local configuration and credentials.

### 6.5 Budget Categories

- Frontend and desktop engineering payroll.
- Design and usability support.
- Desktop test machines and peripherals.
- Build, packaging, and CI capacity.
- Development licenses and collaboration services.
- Test automation and regression maintenance.
- Contingency for platform-specific behavior and UI rework.

### 6.6 Boundary

P1 STUDIO owns the staffing needed for desktop Studio and the associated project workflows. Backend identity and data services belong to P3 CONTROL PLANE; local build and artifact capability belongs to P2 BUILD & ARTIFACT. Cross-phase integration should be planned without duplicating ownership.

### 6.7 Exit Evidence

The team can demonstrate the approved desktop Studio workflows, repeatable development and test procedures, and clear integration contracts for downstream capabilities.

---

## 7. P2 BUILD & ARTIFACT — Resource Plan

### 7.1 Objective

Provide the engineering capacity to implement local build and artifact workflows with repeatability, diagnosability, and testable outputs.

### 7.2 Staffing Plan

| Role | Indicative FTE | Hiring approach | Primary responsibility |
|---|---:|---|---|
| Build / integration engineer | 1.0-2.0 | Core hire or dedicated allocation | Local build workflow and integration |
| Backend / artifact engineer | 1.0-2.0 | Core engineer | Artifact-related service and interface work within approved scope |
| Frontend engineer | 0.5-1.0 | Shared from Studio team | Build and artifact user workflows |
| QA / automation engineer | 0.5-1.0 | Shared or dedicated as workload grows | Repeatability, regression, and failure-path tests |
| DevOps / CI engineer | 0.5-1.0 | Shared | Build runners, caching, artifact storage integration |
| Security / supply-chain specialist | 0.1-0.25 | Specialist review | Dependency and artifact integrity guidance |

Indicative active team: 4-7 FTE.

### 7.3 Hiring Gate

Prioritize additional build capacity when local build reliability, artifact correctness, supported target count, or debugging demands exceed the capacity of the existing team.

Before expanding:

- Define the build and artifact contracts in the applicable technical specifications.
- Confirm reproducibility requirements and supported environments.
- Establish artifact identity, versioning, retention, and integrity requirements.
- Define test cases for failed builds, partial outputs, and invalid artifacts.
- Confirm how build and artifact outputs integrate with the control plane.
- Identify infrastructure limits and expected build concurrency.

### 7.4 Tooling and Infrastructure

| Category | Provision |
|---|---|
| Build infrastructure | Reproducible local and CI build environments |
| CI capacity | Runners sized for expected concurrent builds |
| Artifact storage | Versioned storage with access controls and retention |
| Observability | Build logs, structured errors, and diagnostic evidence |
| Quality | Automated build verification and artifact validation |
| Security | Dependency scanning and integrity checks as appropriate |
| Test data | Representative inputs and known-good artifacts |

### 7.5 Budget Categories

- Build and integration engineering.
- CI compute, caching, and artifact storage.
- Test automation and regression infrastructure.
- Security scanning and supply-chain review.
- Development workstations and storage.
- Integration rework and build-performance contingency.

### 7.6 Boundary

P2 BUILD & ARTIFACT owns local build and artifact capability. P3 CONTROL PLANE owns backend platform and identity integration. The resource plan allocates engineering effort across this boundary but does not redefine service contracts or artifact architecture.

### 7.7 Exit Evidence

The approved local build and artifact workflows are repeatable, their failures are diagnosable, and downstream integration requirements are documented and testable.

---

## 8. P3 CONTROL PLANE — Resource Plan

### 8.1 Objective

Staff the backend, identity, and data capabilities needed to coordinate the platform and provide dependable service interfaces for downstream booking and execution work.

### 8.2 Staffing Plan

| Role | Indicative FTE | Hiring approach | Primary responsibility |
|---|---:|---|---|
| Backend engineer | 2.0-3.0 | Core hires | Control-plane and platform service implementation |
| Identity / access-control engineer | 0.5-1.0 | Shared specialist or core allocation | Authentication, authorization, and access policy integration |
| Database engineer | 0.5-1.0 | Shared initially | Data model, migrations, integrity, and query behavior |
| API / integration engineer | 0.5-1.0 | Shared or dedicated | Service contracts and integration testing |
| QA / automation engineer | 0.5-1.0 | Shared or dedicated | API, data, and service integration tests |
| DevOps / SRE | 0.5-1.0 | Shared | Development deployment, logs, metrics, and environment reliability |
| Security specialist | 0.1-0.5 | Specialist review | Threat modeling and access-control review |

Indicative active team: 5-8 FTE.

### 8.3 Hiring Gate

Add backend or data capacity when service ownership, integration complexity, or data integrity requirements exceed the current team's available capacity.

Before expanding:

- Confirm backend milestone scope and dependency ordering.
- Establish API ownership and versioning conventions.
- Confirm identity and authorization responsibilities.
- Define data ownership, migration, and backup requirements.
- Establish service-level logging and diagnostic conventions.
- Identify development environment and staging dependencies.
- Plan negative tests for unauthorized access, invalid requests, and inconsistent data.

### 8.4 Tooling and Infrastructure

- Backend development and integration environments.
- Database migration and schema-validation tooling.
- API contract and integration test automation.
- Centralized development logs and metrics.
- Secrets management and access control.
- Database backup and restore verification.
- CI deployment workflows for non-production environments.
- Dependency and vulnerability scanning.

### 8.5 Budget Categories

- Backend and database engineering payroll.
- Identity and security specialist support.
- Development and test infrastructure.
- Database hosting and backup.
- Observability and deployment tooling.
- API and integration test automation.
- Contingency for schema changes and service integration rework.

### 8.6 Boundary

P3 CONTROL PLANE owns backend, identity, and core platform data integration. P4 BOOKING & COMMERCIAL owns booking and financial workflows. P2 BUILD & ARTIFACT owns local build and artifact capability. Detailed service and schema ownership remains with the corresponding architecture and milestone documents.

### 8.7 Exit Evidence

The required control-plane interfaces, identity behavior, and core data flows are implemented and tested to the applicable milestone acceptance criteria. The team can support downstream integration without relying on undocumented assumptions.

---

## 9. P4 BOOKING & COMMERCIAL — Resource Plan

### 9.1 Objective

Provide the product, engineering, and operational capacity required for resource booking and financial-system workflows.

### 9.2 Staffing Plan

| Role | Indicative FTE | Hiring approach | Primary responsibility |
|---|---:|---|---|
| Backend engineer | 1.5-2.5 | Core team allocation or hire | Booking and commercial services |
| Frontend engineer | 0.75-1.5 | Shared or dedicated | Booking and commercial user workflows |
| Database engineer | 0.5-1.0 | Shared | Booking data integrity and transaction behavior |
| Finance / commercial operations owner | 0.5-1.0 | Business owner or hire | Pricing inputs, reconciliation, and commercial processes |
| QA / automation engineer | 0.5-1.0 | Shared or dedicated | Booking, cancellation, and financial-flow validation |
| Security / access-control support | 0.1-0.25 | Shared specialist | Authorization and sensitive-data review |
| DevOps / SRE | 0.25-0.75 | Shared | Service deployment and observability |

Indicative active team: 5-8 FTE.

### 9.3 Hiring Gate

Do not add commercial engineering capacity until the intended booking model, resource types, financial-system boundaries, and acceptance expectations are defined.

Before expanding:

- Confirm which resources can be booked and under what conditions.
- Identify the source of truth for resource availability.
- Define transaction and reconciliation responsibilities.
- Establish failure, cancellation, and retry behavior.
- Confirm access-control requirements for financial and booking data.
- Identify any external payment or financial-system integrations.
- Assign an accountable business owner for commercial rules.

### 9.4 Tooling and Infrastructure

- Transactional database and migration tooling.
- Integration-test environments for booking workflows.
- Controlled financial-system test credentials.
- Audit logging for relevant booking and financial operations.
- Reconciliation reports and exception handling.
- Monitoring for failed transactions and inconsistent states.
- Secure storage for sensitive configuration and credentials.

### 9.5 Budget Categories

- Backend and frontend engineering.
- Database and transaction testing.
- Finance and commercial operations.
- External integration or payment-provider fees where applicable.
- Security review and audit logging.
- Staging infrastructure and reconciliation tooling.
- Contingency for transaction failures and commercial-rule changes.

### 9.6 Boundary

P4 BOOKING & COMMERCIAL owns resources and financial systems. It does not own the overall backend identity model, remote execution implementation, physical robot operations, or production operations strategy.

### 9.7 Exit Evidence

The approved booking and financial workflows can be demonstrated with testable transaction behavior, defined failure handling, and traceable reconciliation evidence.

---

## 10. P5 EXECUTION — Resource Plan

### 10.1 Objective

Staff remote execution on simulated robots so that the platform can coordinate execution requests, manage lifecycle behavior, and produce reliable diagnostic evidence without depending on physical robot availability.

### 10.2 Staffing Plan

| Role | Indicative FTE | Hiring approach | Primary responsibility |
|---|---:|---|---|
| Execution backend engineer | 1.0-2.0 | Core hire or dedicated allocation | Execution coordination and lifecycle integration |
| Simulation engineer | 1.0-2.0 | Core hire or specialist | Simulated robot environments and behavior |
| Systems / integration engineer | 1.0-1.5 | Core hire | End-to-end execution integration |
| Frontend engineer | 0.5-1.0 | Shared | Execution workflows and status presentation |
| QA / test automation engineer | 1.0-1.5 | Core allocation | Repeated execution tests and failure injection |
| DevOps / SRE | 0.5-1.0 | Shared | Worker environments, logs, metrics, and reliability |
| Security specialist | 0.1-0.5 | Shared review | Execution access and isolation review |

Indicative active team: 6-9 FTE.

### 10.3 Hiring Gate

Increase execution staffing only after the required control-plane and artifact dependencies are available and the simulated execution scope is defined.

Before expanding:

- Define execution request, state, timeout, cancellation, and failure contracts.
- Confirm how simulated robots are represented and provisioned.
- Define worker isolation and resource limits.
- Establish repeatable end-to-end tests.
- Identify observability requirements for queued, active, failed, and completed work.
- Define cleanup behavior after failed or interrupted runs.
- Confirm how results and execution evidence are handed to downstream phases.

### 10.4 Tooling and Infrastructure

- Simulated robot environments and deterministic test fixtures.
- Worker and job execution infrastructure.
- Automated integration tests with repeatable inputs.
- Log aggregation and execution tracing.
- Resource and concurrency monitoring.
- Failure injection and recovery tests.
- Controlled test artifacts and execution records.
- CI capacity for repeated end-to-end validation.

### 10.5 Budget Categories

- Execution and simulation engineering.
- Worker compute and storage.
- Test automation and CI capacity.
- Observability and diagnostic retention.
- Isolation and security testing.
- Simulation environment maintenance.
- Contingency for execution reliability and integration defects.

### 10.6 Boundary

P5 EXECUTION owns remote execution on simulated robots. Physical robotics expansion belongs to P6 LAB & ROBOT. Live video, telemetry, and results presentation belong to P7 LIVE & RESULTS. P5 resource planning must not assume physical robot procurement as a prerequisite for completing simulation-based execution work.

### 10.7 Exit Evidence

The approved simulated execution workflows can be repeatedly exercised, failures can be diagnosed, and execution state and evidence can be handed to downstream components through defined interfaces.

---

## 11. P6 LAB & ROBOT — Resource Plan

### 11.1 Objective

Expand the platform into physical robotics through controlled laboratory setup, hardware integration, and approved test procedures.

This phase introduces physical-world variability and safety responsibilities. Hardware and lab spending must be gated by readiness of the software integration path, test procedures, and accountable human reviewers.

### 11.2 Staffing Plan

| Role | Indicative FTE | Hiring approach | Primary responsibility |
|---|---:|---|---|
| Robotics systems engineer | 1.0-2.0 | Core hire | Robot integration and system behavior |
| Embedded / controls engineer | 1.0-2.0 | Core hire or specialist | Device interfaces, controls, and low-level integration |
| Simulation / systems integration engineer | 0.5-1.0 | Shared from P5 | Correlation between simulated and physical behavior |
| Lab / hardware engineer | 1.0-1.5 | Core hire or contractor | Bench setup, wiring, instrumentation, and hardware maintenance |
| QA / validation engineer | 1.0-1.5 | Core hire | Repeatable validation and defect evidence |
| Safety reviewer | 0.25-0.75 | Independent or designated specialist | Risk assessment and approval of physical test procedures |
| DevOps / infrastructure support | 0.25-0.5 | Shared | Test data, environment configuration, and lab tooling |

Indicative active team: 7-11 FTE.

### 11.3 Hiring Gate

Physical robotics hiring and procurement should begin only when:

- The intended robot and hardware configuration is documented.
- Required interfaces and software contracts are defined.
- The lab layout and electrical requirements are understood.
- Risk assessment and emergency-stop expectations are documented.
- Test procedures define operating limits and responsible personnel.
- Required safety review is available.
- The team has a repeatable software test path to reduce unnecessary hardware debugging.

### 11.4 Tooling and Laboratory Hardware

| Category | Initial provision | Planning considerations |
|---|---|---|
| Robot hardware | Limited approved robot configuration | Purchase only against defined validation objectives |
| Controllers and compute | Compatible embedded and host compute | Confirm interfaces, drivers, and software support |
| Power and protection | Appropriate supplies, fusing, and isolation | Size for the chosen hardware and documented risks |
| Networking | Managed network equipment and suitable cabling | Isolate lab systems where needed |
| Instrumentation | Multimeters, power measurement, and diagnostic equipment | Match equipment to actual electrical and control requirements |
| Mechanical fixtures | Secure mounts, guards, and test fixtures | Prevent unintended movement and mechanical hazards |
| Safety equipment | Emergency-stop and protective measures appropriate to the robot | Define ownership, inspection, and test procedures |
| Spare parts | Essential connectors, cables, sensors, and replaceable components | Set minimum stock based on lead times |
| Lab workstations | Engineering and diagnostic workstations | Include access controls and reproducible tool configurations |
| Storage | Secure storage for hardware, logs, and test evidence | Protect equipment and preserve traceability |

Exact robot models, quantities, vendors, and prices should be maintained in the approved bill of materials and procurement records rather than duplicated here.

### 11.5 Budget Categories

- Robotics platforms and spare components.
- Embedded compute and controller hardware.
- Sensors, encoders, communication interfaces, and cabling.
- Power supplies, protection, and instrumentation.
- Lab space, fixtures, and physical safety provisions.
- Hardware integration and validation engineering.
- Vendor support, shipping, and repair.
- Insurance or other risk-related costs where applicable.
- Contingency for hardware damage, replacement, and integration rework.

### 11.6 Boundary

P6 LAB & ROBOT owns physical robotics expansion and associated lab resources. P5 EXECUTION remains the owner of remote execution on simulated robots. P7 LIVE & RESULTS owns video, telemetry, and results product capabilities. Physical testing must follow the applicable human safety approval process; a resource allocation is not safety authorization.

### 11.7 Exit Evidence

The approved physical hardware configuration is documented, the lab is prepared for the authorized test scope, validation procedures are repeatable, and safety-related review evidence is available as required by the applicable acceptance criteria.

---

## 12. P7 LIVE & RESULTS — Resource Plan

### 12.1 Objective

Provide the people and infrastructure needed for video, telemetry, and results workflows, including integration, retention, observability, and end-to-end validation.

### 12.2 Staffing Plan

| Role | Indicative FTE | Hiring approach | Primary responsibility |
|---|---:|---|---|
| Backend / results engineer | 1.0-2.0 | Core hire or allocation | Results services and data integration |
| Video / media engineer | 1.0-2.0 | Core hire or specialist | Video ingestion, streaming, or playback as scoped |
| Telemetry engineer | 1.0-1.5 | Core hire or allocation | Telemetry collection and data pipeline integration |
| Frontend engineer | 1.0-1.5 | Core hire | Live views and results presentation |
| Database / data engineer | 0.5-1.0 | Shared or dedicated | Results storage, query performance, and retention |
| QA / end-to-end test engineer | 1.0-1.5 | Core allocation | Cross-component validation and evidence |
| SRE / observability engineer | 0.5-1.0 | Shared or dedicated | Metrics, alerts, reliability, and operational visibility |
| Security / privacy reviewer | 0.1-0.5 | Specialist review | Access, retention, and sensitive-data handling |

Indicative active team: 7-11 FTE.

### 12.3 Hiring Gate

Add dedicated media or telemetry staff when the approved requirements demonstrate sustained engineering work in streaming, data rates, retention, latency, or reliability.

Before expanding:

- Define supported video and telemetry sources.
- Establish latency, availability, and retention expectations.
- Confirm data ownership and the authoritative results model.
- Define access controls for video and execution evidence.
- Identify storage and bandwidth requirements.
- Establish representative load and failure tests.
- Confirm how live views degrade when media or telemetry services are unavailable.
- Define privacy and retention obligations for captured data.

### 12.4 Tooling and Infrastructure

- Representative media sources and test streams.
- Video and telemetry test environments.
- Storage and retention policy configuration.
- Load-test tooling for expected data volume.
- Metrics, tracing, and alerting for media and telemetry pipelines.
- End-to-end test fixtures linking execution events to results.
- Secure access to stored video and telemetry.
- Test data deletion and retention verification.

### 12.5 Budget Categories

- Video, telemetry, backend, and frontend engineering.
- Media processing and storage.
- Network bandwidth and data transfer.
- Telemetry ingestion and query infrastructure.
- Load testing and observability.
- Security and privacy review.
- Retention and backup costs.
- Contingency for throughput, latency, and media compatibility issues.

### 12.6 Boundary

P7 LIVE & RESULTS owns video, telemetry, and results capabilities. P6 LAB & ROBOT owns physical hardware and laboratory integration. P8 PRODUCTION owns production hardening, scale, operations, and launch. Resource planning should account for shared interfaces without transferring ownership of these capabilities.

### 12.7 Exit Evidence

The approved video, telemetry, and results workflows can be validated end to end; data access and retention are defined; and operational measurements demonstrate behavior against the applicable acceptance criteria.

---

## 13. P8 PRODUCTION — Resource Plan

### 13.1 Objective

Allocate the security, reliability, performance, support, and operational capacity required to prepare the approved product scope for production launch.

### 13.2 Staffing Plan

| Role | Indicative FTE | Hiring approach | Primary responsibility |
|---|---:|---|---|
| Engineering / release lead | 0.5-1.0 | Core leadership | Release coordination and technical readiness |
| SRE / production operations | 1.5-2.5 | Dedicated hire or team | Reliability, observability, incidents, and operational procedures |
| Security engineer | 1.0-1.5 | Dedicated or specialist-supported | Hardening, vulnerability management, and security remediation |
| Backend / platform engineer | 1.0-2.0 | Core team | Production service reliability and defect correction |
| Infrastructure / DevOps engineer | 1.0-1.5 | Dedicated or shared | Deployment automation, configuration, and recovery |
| Performance / load-test engineer | 0.5-1.0 | Specialist or core allocation | Capacity validation and performance tuning |
| QA / release validation engineer | 1.0-1.5 | Core hire or allocation | Release verification and regression evidence |
| Support / operations engineer | 0.5-1.0 | Hire or planned rotation | Triage, runbooks, and operational response |
| Documentation / enablement | 0.25-0.5 | Shared | Operator, support, and release documentation |

Indicative active team: 8-13 FTE.

### 13.3 Hiring Gate

Increase production staffing only when the intended deployment model, operational obligations, support expectations, and release criteria are documented.

Before expanding:

- Define target production scale and expected concurrency.
- Establish availability, latency, recovery, and support expectations.
- Confirm incident ownership and escalation paths.
- Identify security and vulnerability remediation responsibilities.
- Define backup, restore, disaster recovery, and configuration recovery procedures.
- Confirm monitoring, alerting, and on-call coverage.
- Establish capacity and load-test evidence.
- Identify release approvals and rollback criteria.
- Confirm which physical robot deployments, if any, are separately authorized for operation.

### 13.4 Tooling and Infrastructure

| Category | Provision |
|---|---|
| Production deployment | Controlled, auditable deployment pipeline |
| Security | Vulnerability scanning, secrets controls, access reviews, and security testing |
| Observability | Centralized logs, metrics, traces, dashboards, and actionable alerts |
| Reliability | Health checks, failure recovery, and service dependency visibility |
| Capacity | Load testing, resource monitoring, and capacity forecasting |
| Data protection | Backup, restore validation, and retention enforcement |
| Incident response | Runbooks, escalation procedures, and incident records |
| Release management | Versioned artifacts, approvals, rollback, and release evidence |
| Support | Ticketing, triage workflows, and operational documentation |

### 13.5 Budget Categories

- Production operations and SRE payroll.
- Security engineering and independent assessments.
- Production compute, networking, and storage.
- Monitoring, logging, alerting, and incident tooling.
- Backup, recovery, and disaster-recovery infrastructure.
- Load testing and performance optimization.
- Support coverage and operator enablement.
- Production readiness reviews and remediation.
- Contingency for launch defects, scale changes, and recovery exercises.

### 13.6 Boundary

P8 PRODUCTION owns production hardening, scale, operations, and launch readiness. It does not replace the domain owners for frontend, backend, database, cloud, booking, execution, or physical robotics capabilities. Release authorization remains with the designated accountable leadership and review owners.

### 13.7 Exit Evidence

Production launch should proceed only when the applicable milestone exit criteria and release approvals are satisfied, security and reliability findings are dispositioned, operational procedures are tested, and accountable owners accept the remaining risks.

---

## 14. Hiring and Headcount Ramp

### 14.1 Recommended Hiring Sequence

| Sequence | Phase | Hiring priority | Reason |
|---:|---|---|---|
| 1 | P0 FOUNDATION | Core engineering, architecture, DevOps | Establish a reliable engineering base |
| 2 | P1 STUDIO | Desktop Studio and QA capacity | Deliver the primary developer-facing workflow |
| 3 | P2 BUILD & ARTIFACT | Build, artifact, and test integration | Make local outputs repeatable and diagnosable |
| 4 | P3 CONTROL PLANE | Backend, identity, and data | Establish platform service foundations |
| 5 | P4 BOOKING & COMMERCIAL | Booking integration and commercial operations | Support resource and financial workflows |
| 6 | P5 EXECUTION | Execution, simulation, and test automation | Validate remote execution without physical hardware dependency |
| 7 | P6 LAB & ROBOT | Robotics integration, lab, and safety review | Introduce controlled physical validation |
| 8 | P7 LIVE & RESULTS | Video, telemetry, and results | Deliver end-to-end evidence and live experience |
| 9 | P8 PRODUCTION | Security, SRE, performance, and support | Prepare for scale and operational launch |

This sequence represents a preferred staffing progression, not a rule that no work may overlap. Hire earlier when a long lead time or specialist dependency makes earlier recruitment necessary.

### 14.2 Hiring Approval Checklist

Before opening a role, record:

- Phase and milestone supported.
- Required deliverables and expected duration.
- Skills that are unavailable within the current team.
- Full-time versus fractional allocation.
- Employee versus contractor recommendation.
- Expected start date and onboarding lead time.
- Equipment and software requirements.
- Manager and technical reviewer.
- Budget owner and approval status.
- Evidence that the role is needed now rather than in a later phase.

### 14.3 Headcount Ramp Controls

- Hire core owners before expanding parallel implementation capacity.
- Avoid hiring a specialist before the scope, interfaces, and acceptance criteria are sufficiently defined.
- Use fractional allocation for intermittent security, finance, design, and database work when practical.
- Reassess team composition at phase boundaries and after major integration findings.
- Maintain an explicit list of unfilled roles and the delivery risks they create.
- Do not treat an unfilled role as available capacity.
- Do not count a contractor at full capacity if they are shared with another client or project.
- Revisit the plan when actual delivery effort materially differs from estimates.

---

## 15. Tooling, Infrastructure, and Lab Investment Plan

### 15.1 Shared Engineering Infrastructure

Shared infrastructure should be budgeted centrally where practical. The phase plan should record usage and capacity needs without assigning the full cost to every consuming phase.

| Infrastructure | First needed | Expansion trigger | Owner |
|---|---|---|---|
| Source control and access management | P0 FOUNDATION | More contributors or stricter access requirements | Engineering leadership |
| CI runners and automated checks | P0 FOUNDATION | Queue times or test duration constrain delivery | DevOps |
| Desktop build and test environments | P1 STUDIO | More supported platforms or packaging targets | Frontend owner |
| Build workers and artifact storage | P2 BUILD & ARTIFACT | Increased concurrency or retention requirements | Build/artifact owner |
| Backend development environments | P3 CONTROL PLANE | Service count or integration demand grows | Backend owner |
| Database backup and migration tooling | P3 CONTROL PLANE | Data volume or recovery obligations grow | Database owner |
| Booking integration test environment | P4 BOOKING & COMMERCIAL | External financial-system integration requires isolation | Commercial/backend owners |
| Simulated robot environments | P5 EXECUTION | More execution targets or concurrent test runs | Simulation owner |
| Physical robotics lab | P6 LAB & ROBOT | Approved hardware validation scope requires it | Robotics/lab owner |
| Video and telemetry infrastructure | P7 LIVE & RESULTS | Measured data rates or retention require scale-up | Media/data owners |
| Production observability and recovery | P8 PRODUCTION | Production readiness and support requirements | SRE/operations |

### 15.2 Infrastructure Approval Criteria

Before approving new infrastructure expenditure, document:

1. The phase and milestone it supports.
2. The workload or validation objective.
3. Expected capacity and utilization.
4. Security, privacy, and access requirements.
5. Setup and ongoing operating cost.
6. Maintenance and support ownership.
7. Alternatives considered, including shared infrastructure.
8. A review date or trigger for expansion.

### 15.3 Laboratory Procurement Controls

Physical laboratory purchases should be tied to approved validation objectives and the corresponding bill of materials.

- Start with the smallest hardware configuration that can produce meaningful validation evidence.
- Confirm vendor availability, lead times, warranty, and replacement options.
- Verify power, networking, mechanical mounting, and lab safety requirements.
- Budget for connectors, cables, fixtures, instrumentation, and spare parts—not only the main robot.
- Assign a person responsible for inventory, configuration, maintenance, and safe storage.
- Record hardware revisions and software compatibility.
- Purchase additional robot units only when parallel testing or availability requirements justify the expense.
- Separate capital purchases from recurring lab operation and maintenance.

### 15.4 Cloud Cost Controls

- Tag resources by environment, owner, and purpose.
- Define budgets and alerts for non-production environments.
- Shut down idle compute where practical.
- Set retention policies for logs, artifacts, video, and telemetry.
- Monitor data transfer and storage growth.
- Review reserved or committed spend only after workload patterns become predictable.
- Keep development, staging, and production access and configuration appropriately separated.
- Review cost per build, execution, and retained result when sufficient measurements exist.

---

## 16. Budget Framework

### 16.1 Budget Categories

| Category | Typical contents | Classification |
|---|---|---|
| Engineering payroll | Salaries, benefits, employer costs | OpEx |
| Contractors and specialists | Short-term implementation, reviews, and consulting | OpEx |
| Recruitment | Search fees, interview costs, and onboarding | OpEx |
| Developer equipment | Workstations, displays, and peripherals | CapEx or company policy |
| Engineering tools | Paid development, testing, and collaboration services | OpEx |
| CI and build infrastructure | Compute, runners, caching, and artifact storage | OpEx |
| Cloud infrastructure | Compute, databases, networking, storage, and transfer | OpEx |
| Security | Assessment, scanning, review, and remediation support | OpEx |
| Test infrastructure | Automation environments, test systems, and test data | Mixed |
| Robotics hardware | Robots, controllers, sensors, and spares | CapEx |
| Laboratory setup | Fixtures, instrumentation, protection, and work surfaces | Mixed |
| Video and telemetry | Media processing, bandwidth, ingestion, and retention | OpEx |
| Production operations | Monitoring, support, backup, and recovery | OpEx |
| Legal and commercial | Contracts, licensing, compliance, and transaction-related costs | Mixed |
| Contingency | Approved reserve for uncertainty | Reserve |

### 16.2 Budget Model

Build the financial forecast using separate quantities and rates rather than one untraceable phase total.

For each phase:

    Phase personnel cost =
        Sum(role FTE × loaded monthly cost × allocated months)

    Phase infrastructure cost =
        Setup cost + recurring cost × active months

    Phase equipment cost =
        Approved quantities × verified unit cost

    Phase specialist cost =
        Approved specialist days × contracted daily rate

    Phase contingency =
        Approved contingency percentage × eligible cost base

    Phase total =
        Personnel + infrastructure + equipment + specialist cost
        + other direct costs + contingency

Use actual compensation assumptions, vendor quotations, cloud estimates, tax treatment, and procurement rules when producing the approved budget. Do not treat indicative staffing ranges as a financial forecast without calendar durations and loaded cost assumptions.

### 16.3 Budget Confidence Levels

| Confidence | Evidence | Use |
|---|---|---|
| Low | Broad scope and role estimates only | Early planning and option comparison |
| Medium | Milestone scope and staffing allocations defined | Hiring and preliminary budget decisions |
| High | Named roles, durations, quotations, and infrastructure assumptions validated | Budget approval and committed spending |
| Actual | Recorded payroll, invoices, and usage | Forecast updates and variance analysis |

### 16.4 Contingency Guidance

Contingency should reflect uncertainty, not serve as an unrestricted spending pool.

- Use a higher reserve where scope, hardware availability, or external integrations are uncertain.
- Reduce the reserve only after implementation and cost evidence improve confidence.
- Record the owner, reason, and approval for contingency use.
- Keep physical hardware replacement and production incident reserves visible.
- Reforecast when actual spending or effort materially exceeds the baseline.

---

## 17. Cross-Phase Resource Dependencies

| Dependency | Resource implication | Planning response |
|---|---|---|
| P0 FOUNDATION to P1 STUDIO | Desktop engineers need stable development conventions and integration ownership | Establish tooling and ownership before team expansion |
| P1 STUDIO to P2 BUILD & ARTIFACT | Build workflows need frontend integration and test capacity | Allocate shared frontend and QA capacity |
| P2 BUILD & ARTIFACT to P3 CONTROL PLANE | Artifact integration requires agreed service and data contracts | Plan interface reviews and integration testing |
| P3 CONTROL PLANE to P4 BOOKING & COMMERCIAL | Booking depends on platform and data foundations | Confirm service and schema readiness before expanding commercial implementation |
| P3 CONTROL PLANE to P5 EXECUTION | Execution depends on available platform services and authorization contracts | Staff execution integration when dependencies are testable |
| P5 EXECUTION to P6 LAB & ROBOT | Simulation experience informs physical integration, but does not prove physical safety | Retain simulation ownership and provide independent physical-test review |
| P5 EXECUTION and P6 LAB & ROBOT to P7 LIVE & RESULTS | Execution and physical test activity generate data consumed by live and results workflows | Define shared evidence interfaces and allocate integration capacity |
| P7 LIVE & RESULTS to P8 PRODUCTION | Live data and results affect capacity, storage, and support requirements | Use measured workloads to size production infrastructure |
| C-M01 FOUNDATION to C-M02 DEVELOPMENT | Development infrastructure must support the active engineering team | Expand only against observed CI and environment needs |
| C-M02 DEVELOPMENT to C-M03 STAGING | Integrated workflows need repeatable staging and controlled test data | Budget staging capacity before integration load grows |
| C-M03 STAGING to C-M04 PRODUCTION | Production requires operational and security readiness | Fund observability, recovery, security, and support before launch |

### 17.1 Shared-Capacity Conflicts

The following shared roles are likely to become bottlenecks if their allocation is not explicit:

- Engineering leadership and architecture review.
- DevOps and CI infrastructure.
- QA and end-to-end integration.
- Database engineering.
- Security review.
- Documentation and release coordination.
- Robotics integration and lab support.
- SRE and production operations.

Each phase plan should record the percentage of shared capacity required, the time window, and the consequence if that capacity is unavailable.

### 17.2 Dependency Escalation

Escalate a resource dependency when:

- A required specialist is unavailable during the planned integration window.
- A downstream team is implementing against an unstable or undocumented contract.
- Shared infrastructure cannot support the expected test volume.
- Hardware procurement lead time threatens the validation schedule.
- A safety, security, privacy, or financial review is not available before its gate.
- Actual effort repeatedly exceeds the estimate without an approved scope change.

The escalation record should name the affected phase, blocked deliverable, accountable owner, decision needed, and revised date or resource allocation.

---

## 18. Resource Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Hiring ahead of validated scope | Cost growth and idle capacity | Use phase gates and approved deliverables |
| Understaffed integration work | Late defects and schedule slippage | Reserve explicit QA and integration capacity |
| Overloaded technical leadership | Slow decisions and architecture bottlenecks | Allocate leadership time explicitly and delegate bounded decisions |
| Shared specialist conflicts | Delayed reviews and blocked teams | Maintain a shared-capacity calendar and named backup |
| CI and test infrastructure under-provisioned | Slow feedback and reduced throughput | Measure queue time and test duration before scaling |
| Uncontrolled cloud spend | Budget variance | Set budgets, alerts, tagging, and recurring reviews |
| Premature robot procurement | Idle equipment and unnecessary risk | Tie purchases to approved physical validation objectives |
| Hardware lead-time uncertainty | Delayed lab validation | Confirm lead times early and identify acceptable alternatives |
| Inadequate safety capacity | Unsafe or unauthorized testing | Reserve qualified review and require approval before physical testing |
| Video and telemetry cost growth | Higher storage, bandwidth, and processing cost | Define retention and measure workload before expansion |
| Weak production staffing | Slow incident response and unstable launch | Establish operational ownership and recovery drills |
| Contractor knowledge loss | Maintenance and continuity risk | Require documentation, reviews, and internal ownership |
| Poor estimate quality | Misleading budgets and staffing decisions | Track actual PM and update estimates at phase boundaries |
| Duplicate role counting | Inflated headcount forecasts | Maintain a single capacity allocation model |
| Unclear phase ownership | Rework and gaps between teams | Use milestone dossiers and the ownership rules in this document |

### 18.1 Risk Review Cadence

Review resource risks at least at each phase boundary and whenever a major dependency, cost, staffing, or scope assumption changes.

Review outcomes should include:

- Updated staffing and shared-capacity allocations.
- Hiring decisions and deferred roles.
- Infrastructure and equipment purchase decisions.
- Budget forecast changes.
- Risks requiring leadership action.
- Revised resource assumptions for the next phase.

---

## 19. Capacity Tracking and Forecast Updates

### 19.1 Required Tracking Fields

Maintain a capacity record for each role allocation.

| Field | Description |
|---|---|
| Phase | One of P0 FOUNDATION through P8 PRODUCTION |
| Milestone | Canonical milestone identifier, where applicable |
| Role | Engineering or operational role family |
| Owner | Accountable person or hiring owner |
| Planned FTE | Intended allocation |
| Available FTE | Actual capacity available |
| Start and end dates | Planned allocation window |
| Planned PM | Forecast effort |
| Actual PM | Recorded effort |
| Hiring status | Not started, planned, in progress, blocked, or filled |
| Cost rate | Approved loaded monthly or daily rate |
| Forecast cost | Expected personnel or contractor cost |
| Variance | Difference between plan and actual or revised forecast |
| Dependency | Deliverable or phase dependent on the allocation |
| Risk / action | Capacity gap and mitigation |

### 19.2 Monthly Review

The monthly review should answer:

1. Is the current phase adequately staffed?
2. Which roles are over-allocated or under-allocated?
3. Which hiring actions are necessary in the next review period?
4. Are actual person-months consistent with the forecast?
5. Are infrastructure and lab resources being used as expected?
6. Have any new dependencies changed the required staffing sequence?
7. Is there evidence to justify hiring for the next phase?
8. Do budget variances require corrective action?

### 19.3 Forecast Update Rules

Update the resource plan when:

- Milestone scope is formally changed.
- A role's allocation or availability changes materially.
- Actual effort exceeds the planned range.
- A supplier quotation changes a significant equipment assumption.
- Cloud, storage, or media consumption differs materially from the forecast.
- An integration dependency creates additional engineering work.
- A safety, security, or production review identifies mandatory remediation.
- A phase is delayed, shortened, or re-sequenced by an approved decision.

Retain the previous forecast and record the reason for material changes so leadership can distinguish baseline estimates from revised commitments.

---

## 20. Phase Resource Readiness Gates

| Phase | Required resource readiness before substantial execution |
|---|---|
| P0 FOUNDATION | Accountable technical owner, initial engineering capacity, repository and CI access, and baseline tooling |
| P1 STUDIO | Desktop Studio owner, frontend capacity, UX input, and UI test environment |
| P2 BUILD & ARTIFACT | Build/artifact owner, repeatable build environment, artifact storage, and automated validation |
| P3 CONTROL PLANE | Backend owner, identity and data expertise, integration environment, and schema/test tooling |
| P4 BOOKING & COMMERCIAL | Commercial rules owner, booking engineering capacity, transactional test environment, and reconciliation plan |
| P5 EXECUTION | Execution owner, simulation capacity, isolated worker environment, and end-to-end test automation |
| P6 LAB & ROBOT | Robotics owner, approved hardware configuration, prepared lab, validation equipment, and required safety review |
| P7 LIVE & RESULTS | Media/telemetry ownership, representative test data, storage plan, observability, and privacy review where applicable |
| P8 PRODUCTION | Named operations owner, security capacity, recovery procedures, performance evidence, support plan, and release approvals |

A readiness gate confirms that the necessary resources and prerequisites exist. It does not replace milestone acceptance criteria or formal authorization.

---

## 21. Resource Plan Governance

### 21.1 Accountabilities

| Responsibility | Accountable role |
|---|---|
| Overall resource baseline | Project leadership |
| Phase staffing and priority | Engineering leadership with phase owners |
| Role definitions and hiring requests | Hiring manager and relevant technical lead |
| Budget baseline and financial controls | Finance owner and authorized leadership |
| Infrastructure sizing and cost review | DevOps / SRE owner |
| Laboratory procurement and inventory | Robotics / lab owner |
| Safety review availability | Designated qualified safety reviewer |
| Security assessment and remediation tracking | Security owner |
| Actual effort and allocation reporting | Each role owner or team lead |
| Forecast change approval | Authorized project leadership |

### 21.2 Change Control

A change to the resource baseline should record:

- What changed and why.
- Affected phases and milestones.
- New or removed roles and FTE allocations.
- Person-month and budget impact.
- Dependencies and schedule implications.
- Risks introduced or reduced.
- Approver and effective date.

Changes to staffing assumptions must not silently change milestone scope or acceptance criteria.

### 21.3 Decision Principles

When deciding whether to hire, contract, or defer:

1. Prefer the smallest team that can deliver the approved scope safely and reliably.
2. Protect critical architecture, integration, security, and operational ownership.
3. Do not defer mandatory safety, security, data-protection, or recovery work to preserve a nominal budget.
4. Avoid permanent hires for work that is genuinely short-lived and independently reviewable.
5. Avoid relying on contractors for product-critical knowledge without an internal owner.
6. Reassess the staffing model when measured workload differs from assumptions.
7. Make unresolved capacity gaps visible instead of treating them as implicit overtime.

---

## 22. Recommended Resource Planning Deliverables

Maintain the following supporting records so that this plan remains an actionable management document rather than a static estimate.

| Deliverable | Purpose | Suggested owner |
|---|---|---|
| Role and responsibility matrix | Clarifies accountability across teams | Engineering leadership |
| Phase-level FTE allocation sheet | Tracks capacity by phase and time window | Project planning owner |
| Hiring pipeline | Tracks approved roles, candidates, and start dates | Hiring owners |
| Budget forecast | Converts role allocations and costs into financial estimates | Finance owner |
| Infrastructure cost model | Tracks compute, storage, networking, and tooling costs | DevOps / SRE |
| Robotics bill of materials | Records approved hardware, quantities, suppliers, and prices | Robotics / lab owner |
| Lab readiness checklist | Records equipment, setup, maintenance, and safety prerequisites | Robotics / lab owner |
| Shared-capacity calendar | Avoids conflicts for specialists and reviewers | Project planning owner |
| Monthly actuals report | Compares planned and actual person-months and cost | Finance and engineering |
| Resource risk register | Tracks hiring, capacity, procurement, and operational risks | Project leadership |

These records should link back to this plan and the applicable milestone dossiers. Avoid duplicating detailed technical specifications, task lists, or acceptance criteria in the resource plan.

---

## 23. Immediate Planning Actions

The following actions establish a usable initial resource baseline.

1. Confirm the current phase and milestone status against repository evidence.
2. Record existing contributors and their actual available FTE, rather than assuming full-time availability.
3. Map each approved milestone to the roles required for its deliverables.
4. Identify missing core ownership in architecture, integration, QA, DevOps, security, and operations.
5. Convert the indicative ranges into calendar-based allocations for the next planned delivery window.
6. Obtain current salary and contractor-rate assumptions.
7. Estimate recurring CI, cloud, storage, and tooling expenditure.
8. Create a separately owned robotics bill of materials before committing to physical hardware purchases.
9. Set the hiring and spending approval gates for the next phase.
10. Review the resource baseline monthly and at every phase boundary.

### 23.1 First Review Priorities

For the initial review, prioritize:

- Current engineering capacity and named role ownership.
- The actual status of approved deliverables.
- Critical dependencies and unfilled roles.
- CI and development infrastructure bottlenecks.
- The first credible staffing and cost forecast.
- The readiness evidence required before physical robotics expansion.
- The security, SRE, and support capacity required before production launch.

---

## 24. References

Use the following documents as the authoritative source for their respective subjects.

- `docs/planning/PHASES.md` — canonical phase names, numbers, and phase-level definitions.
- Applicable frontend milestone dossiers under `docs/frontend/milestones/` — frontend milestone scope.
- Applicable backend milestone dossiers under `docs/backend/milestones/` — backend milestone scope.
- Applicable database milestone dossiers under `docs/database/milestones/` — database milestone scope.
- Applicable cloud milestone dossiers under `docs/cloud/milestones/` — cloud milestone scope.
- Applicable project milestone dossiers under `docs/milestones/` — project-level phase scope.
- Domain architecture documents under `docs/**/architecture/` — technical component and integration boundaries.
- Domain planning decisions under `docs/**/planning/DECISIONS.md` — recorded domain decisions.
- Applicable milestone `TASKS.md` — implementation tasks and task ownership.
- Applicable task-scoped `ACCEPTANCE_CRITERIA.md` — task-specific acceptance conditions.
- Applicable `REVIEW_CHECKLIST.md` — review and evidence expectations.
- Applicable `CHANGELOG.md` — accepted implementation history.
- Applicable `GIT_COMMIT_STEP.md` — Git operation and commit guidance.

When a conflict exists, use the canonical phase model and the applicable authoritative milestone dossier for scope. Update this resource plan to reflect approved changes rather than redefining those sources.

---

## 25. Summary

This plan provides a phase-by-phase view of the people, infrastructure, laboratory resources, and budget categories required for Kritva RaaS.

The core staffing progression is:

- P0 FOUNDATION: establish engineering foundations and ownership.
- P1 STUDIO: build the desktop Studio experience.
- P2 BUILD & ARTIFACT: deliver repeatable local build and artifact capability.
- P3 CONTROL PLANE: implement backend, identity, and core data capabilities.
- P4 BOOKING & COMMERCIAL: support resource booking and financial systems.
- P5 EXECUTION: validate remote execution on simulated robots.
- P6 LAB & ROBOT: expand into controlled physical robotics validation.
- P7 LIVE & RESULTS: deliver video, telemetry, and results workflows.
- P8 PRODUCTION: complete security hardening, scale, operations, and launch readiness.

The staffing ranges are indicative and must be validated against actual scope, available capacity, delivery evidence, and cost assumptions. Hiring and spending should follow explicit gates, shared specialists should be counted once, and physical robot operation and production launch must retain their separate review and authorization requirements.
