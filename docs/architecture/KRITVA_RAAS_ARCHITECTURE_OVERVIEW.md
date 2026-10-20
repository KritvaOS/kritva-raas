# Kritva RaaS --- Consolidated Architecture Overview

**Document type:** Architecture overview and artwork index\
**Architecture baseline:** v0.2\
**Status:** Consolidated target architecture; implementation status must
be verified independently\
**Repository:** `KritvaOS/kritva-raas`\
**Suggested path:**
`docs/architecture/KRITVA_RAAS_ARCHITECTURE_OVERVIEW.md`\
**Audience:** Product, software, cloud, frontend, backend, robotics
integration, security, and intern engineering teams

------------------------------------------------------------------------

## 1. Purpose and status

This document consolidates the concepts represented by Kritva RaaS
architecture overview Slides 0--15. It is a shared navigation point for
the target architecture, components, responsibilities, workflows, trust
boundaries, fleet model, training capability, and resilience behavior.

This is an **architecture baseline and planning document**, not proof
that every capability has been implemented or released. Artwork is
explanatory and may simplify details. Approved architecture documents,
interface contracts, security decisions, acceptance criteria, and
verified repository implementation take precedence over illustrations.

Use **Proposed**, **TBD**, or **Not yet verified** for decisions that
have not been formally finalized. Do not interpret an item in this
document as implemented merely because it appears in an artwork.

## 2. Product scope and core principles

Kritva RaaS (Robot as a Service) is a software platform for robot
application development, resource booking, deployment, execution
coordination, monitoring, results, and training.

The target platform comprises:

-   **Kritva Studio:** Cross-platform desktop application for
    developers, operators, and students.
-   **Kritva Studio Local Runtime:** Local capability for packaging and
    direct artifact transfer, local state, and protected teaching-media
    caching. Its process boundary (embedded library, child process, or
    local service) remains **TBD**.
-   **Kritva RaaS Control Plane:** Cloud-managed identity,
    authorization, subscriptions, booking, billing, fleet registries,
    run metadata, and reconciliation.
-   **Robot Lab Agent:** Lab-side service that manages multiple robots,
    receives and verifies artifacts, coordinates execution through robot
    adapters, maintains a persistent local journal, and reports
    status/events.
-   **Robot Execution Environment:** Robot-specific runtime, controller
    integration, and readiness checks.
-   **Robot-side Safety Systems:** Independent physical safety functions
    and safety-related interlocks.
-   **Training & Teaching Media:** Integrated capability for courses,
    sessions, prerecorded lessons, encrypted downloads, offline
    authorization, and progress synchronization.

Core principles:

1.  **Direct artifact delivery:** `.krv` artifacts transfer directly
    from Studio Local Runtime to the selected Robot Lab Agent. The
    Control Plane and cloud object storage do not relay or store `.krv`
    bytes in the current baseline.
2.  **Separate authorities:** Cloud business authorization, agent
    artifact verification/coordination, robot execution state, and
    physical safety authority are distinct.
3.  **Multi-agent fleet:** Multiple Robot Lab Agents can be registered;
    each agent can manage multiple robots.
4.  **Single authoritative managing agent:** Each robot has one
    authoritative managing Robot Lab Agent at a time in the initial
    architecture.
5.  **Cloud is not real-time motion control:** The cloud manages
    business and coordination metadata; it is not in the robot's
    real-time motion-control loop.
6.  **Teaching is independent of execution:** Teaching-video playback
    must never pause or stop robot execution.
7.  **State must show uncertainty:** Stale, unknown, disconnected, and
    unreconciled states must not be presented as healthy or confirmed.
8.  **Safety remains local and independent:** Cloud authorization and
    agent validation never replace robot-side safety checks.
9.  **Provider-neutral infrastructure:** Cloud provider, database,
    queue, object storage, CDN, and deployment technology remain choices
    unless separately approved.
10. **Modular monolith initially:** Backend modules are logical
    boundaries within one initial modular-monolith deployment; they are
    not automatically separate microservices.

## 3. High-level system topology

``` text
Kritva Studio
  ├── Cloud APIs ───────────────────────> Kritva RaaS Control Plane
  │                                        ├── Identity & Access
  │                                        ├── Subscription & Entitlements
  │                                        ├── Booking & Scheduling
  │                                        ├── Billing & Payments
  │                                        ├── Training & Media Authorization
  │                                        ├── Agent Registry
  │                                        ├── Robot Registry & Assignment
  │                                        └── Run Metadata & Reconciliation
  │
  ├── Direct .krv artifact transfer ────> Selected Robot Lab Agent
  │                                        ├── Artifact verification
  │                                        ├── Persistent local journal
  │                                        ├── Robot adapters
  │                                        └── Per-robot coordination
  │                                                 |
  │                                                 v
  │                                        Robot Execution Environment
  │                                                 |
  │                                                 v
  │                                        Robot-side Safety Systems
  │
  └── Encrypted teaching-media download <── Media Delivery / Storage
```

The direct `.krv` path bypasses the Control Plane and cloud storage. The
precise transfer transport, connection establishment, NAT/firewall
traversal, peer authentication, and key-management mechanisms remain
**TBD**. The baseline does not include a cloud relay for artifact bytes.
If direct transfer is unavailable, report the limitation rather than
silently relaying the artifact through the cloud.

## 4. Component responsibilities and boundaries

### 4.1 Kritva Studio

Responsibilities: user interface and local workflow management;
application development/testing/packaging workflow; resource selection
and booking; deployment initiation; monitoring and result presentation;
training playback; display of current, last-known, stale, or reconciled
state with freshness indicators.

Not responsible for cloud business authority, replacing Agent
verification, or replacing robot-side execution checks and physical
safety systems.

### 4.2 Kritva Studio Local Runtime

Responsibilities: package `.krv` artifacts and integrate with
signing/checksum workflows; initiate direct artifact transfer to the
selected Agent; maintain necessary local workflow state; store encrypted
teaching media and enforce local offline authorization through the
chosen implementation.

It does not replace receiving-agent artifact verification or robot-side
safety checks. The process boundary and signing/trust implementation
remain **TBD**.

### 4.3 Kritva RaaS Control Plane

Logical responsibilities: - Identity, roles, organizations, permissions,
and authorization. - Subscription plans, entitlements, billing, and
payment records. - Booking, scheduling, availability, and booking
policy. - Agent and robot registries, ownership metadata, and
robot-to-agent assignment. - Training catalog, enrollment, sessions,
progress, and teaching-media authorization metadata. - Run metadata,
validated event ingestion, deduplication, reconciliation, audit,
notifications, and administration.

The Control Plane is not a real-time robot motion controller and does
not relay or store `.krv` bytes under the current baseline. Cloud
records can be stale during an agent or network outage.

### 4.4 Robot Lab Agent

Responsibilities: - Authenticate to the Control Plane using an
outbound-initiated connection. - Report agent heartbeat and health
separately from each robot's state. - Manage multiple robots through
robot-specific adapters. - Receive `.krv` artifacts and independently
verify checksum, trusted signature, compatibility metadata, target,
permissions, and applicable local policy. - Coordinate execution and
monitor per-robot status. - Maintain a persistent local execution
journal and unacknowledged events. - Buffer events during outages and
reconcile after reconnection. - Deliver logs, telemetry, images, or
video to Studio where connectivity permits; selected uploads to cloud
are optional.

The Agent does not replace robot-side safety systems. Agent-online does
not imply every managed robot is online or healthy. One robot must not
have simultaneous independent authoritative control by multiple agents
in the initial architecture.

### 4.5 Robot Execution Environment and safety

The Robot Execution Environment provides robot-specific runtime,
application execution, controller/sensor/actuator integration,
compatibility and readiness checks, and execution-state reporting.

Robot-side Safety Systems provide independent safety checks, interlocks,
emergency stops, collision detection, and other hardware/manufacturer
safety functions. Successful cloud authorization or Agent validation
does not override a robot-side refusal.

## 5. Fleet model and robot lifecycle

### 5.1 Fleet topology

-   Multiple Robot Lab Agents may be registered with the Control Plane.
-   Each Agent may manage multiple robots.
-   Each robot has one authoritative managing Agent at a time in the
    initial architecture.
-   The Control Plane stores the cloud-side assignment record.
-   The Agent maintains local observations and its execution journal.
-   Fleet status is aggregated from Agent reports and may be stale or
    unknown.

### 5.2 Ownership and organization

Support both `ORGANIZATION_MANAGED` and `CUSTOMER_OWNED`. Ownership,
managing organization, physical lab/location, and managing-agent
assignment are separate concepts and should be represented separately.

### 5.3 Independent state dimensions

Do not conflate: - **Lifecycle:** registered, configured, active,
maintenance, retired. - **Connectivity:** online, offline, unknown. -
**Health:** healthy, degraded, faulted, unknown. - **Execution:** idle,
preparing, running, completed, failed, stopped, or other defined
states. - **Safety:** normal, reduced, safety stop, fault, unknown, as
exposed by the robot integration.

A registered robot is not automatically bookable. A bookable robot is
not guaranteed to be healthy or ready at execution time.

### 5.4 Controlled reassignment

Reassignment must validate permission, current execution and safety
state, conflicting assignments, the new Agent's identity/connectivity,
and record reconciliation. The handover protocol is **TBD**. Do not
imply automatic failover or simultaneous independent control unless a
separately approved design supports it.

## 6. Training, teaching media, subscriptions, and booking

Training is integrated alongside robot booking and execution; it does
not replace the overall RaaS architecture.

### 6.1 Training & Teaching Media

Logical capabilities include training catalog, courses, lessons,
enrollment, sessions, teaching-media authorization linked to
subscriptions/course entitlements, encrypted downloads, local encrypted
cache, authorized playback, multi-window use, and progress/session
synchronization when connectivity returns.

Teaching-media storage/delivery should be separate from the application
API backend where practical. A provider-neutral object-storage/CDN
approach may be evaluated; no specific provider is selected here.

### 6.2 Offline authorization validity

Administrators control the offline authorization policy:

1.  **Same as Subscription Validity:** Offline authorization expires
    with the subscription.
2.  **Limited Offline Duration:** Authorization expires at the earlier
    of subscription expiry or the configured offline deadline.

Authorization is linked to the applicable subscription and period, and
may also be constrained by course/media entitlements. Offline revocation
cannot be guaranteed immediately while a device is disconnected.
Encryption and local authorization reduce unauthorized access but cannot
guarantee prevention of screen recording or external capture.

Teaching-video playback must never pause, stop, or otherwise control
robot execution.

### 6.3 Subscription and billing

Administrators configure available plans, prices, billing models, usage
rules, booking allowances, feature entitlements, and offline
authorization policies. Plans may provide training-only access, robot
booking, execution access, or combinations according to configured
policy. Not every plan must include every capability.

Planned billing models: - Pay-per-Booking. - Subscription. - Usage-Based
Billing.

The current planning rule is that a user selects one billing model at
the subscription level. Exact offerings, rates, entitlement
combinations, taxes, refunds, and billing edge cases require separate
business decisions. Payment-provider webhooks must be verified
server-side, and backend payment state remains authoritative. Applicable
booking/payment operations should be idempotent.

### 6.4 Booking workflow

1.  Browse robots/resources and capabilities.
2.  Check available dates and time slots.
3.  Validate permissions, entitlements, resource state, and booking
    rules.
4.  Reserve the slot while preventing conflicts.
5.  Confirm booking according to payment policy.
6.  At execution time, separately validate authorization, robot
    assignment, artifact, readiness, and robot-side safety.

A booking reserves a resource; it does not guarantee future robot
availability or override execution-time safety checks. Training
completion may be a prerequisite for selected courses, robots, or
operations, but is not universally mandatory.

## 7. Backend architecture, APIs, and data

The initial backend is a **modular monolith** with logical module
boundaries:

-   Identity & Access Management.
-   Training & Catalog Management.
-   Teaching Media Authorization.
-   Subscription & Entitlement Management.
-   Billing & Payments.
-   Booking & Scheduling.
-   Robot Registry & Fleet Management.
-   Agent Registry.
-   Run Coordination & Reconciliation.
-   Results & Media Metadata.
-   Audit, Notifications & Administration.

Logical API domains follow the same boundaries. Exact endpoint paths,
HTTP methods, schemas, versioning, authentication details, and
compatibility rules must be defined in API contracts; this overview does
not freeze them.

Storage principles: - **Primary database:** users, organizations,
subscriptions, entitlements, bookings, training records, registries,
assignments, run metadata, reconciliation records. - **Cache/queue:**
optional transient caching and asynchronous work; durable business
records must not depend solely on transient cache. - **Teaching-media
storage/delivery:** prerecorded content delivered encrypted to Studio. -
**Results/observability storage:** selected logs, reports, telemetry,
images, videos, and execution results. - **`.krv` bytes:** excluded from
cloud storage and Control Plane relay in the current baseline.

## 8. Cloud infrastructure principles

Use a provider-neutral deployment view until infrastructure choices are
approved. Logical concerns include secure API entry, Control Plane
compute and suitable background workers, primary database, optional
cache/queue, teaching-media storage/delivery, optional results storage,
secrets/key management, metrics/logs/alerts/audit, backup, and recovery.

Do not assume a specific cloud provider, Kubernetes, database, queue,
CDN, or deployment technology without a recorded decision.

## 9. Security architecture

### 9.1 Separate checks

**Cloud authorization:** user identity and permissions;
subscription/entitlement and booking checks; cloud-managed authorization
for the requested operation.

**Agent artifact verification:** checksum/integrity, trusted signature,
compatibility metadata, target validation, permissions, and local
execution policy. A checksum alone does not prove authenticity.

**Robot-side readiness and safety:** robot-specific
compatibility/readiness checks and independent safety-system decisions
before/during physical execution.

These are distinct checks and must not be collapsed into one generic
authorization step.

### 9.2 Network boundaries

-   Studio-to-cloud API traffic is distinct from direct artifact
    transfer.
-   Agent-to-cloud communication is authenticated and
    outbound-initiated; unsolicited inbound cloud connections into a lab
    are not required by the baseline.
-   Direct artifact transfer terminates at the selected Agent, not
    directly at a robot controller.
-   Robot communication occurs through the managing Agent's
    adapter/local interfaces.
-   Lab networks and robot interfaces are controlled boundaries.
-   TLS, peer authentication, transport, NAT traversal, and
    key-management details for direct transfer remain **TBD**.

Cross-cutting controls include role/organization authorization, tenant
isolation, secrets/key management, audit logging, idempotency, payment
webhook verification, artifact signature/checksum verification, event
deduplication, monitoring, backup, and recovery. Specific algorithms,
protocols, and compliance claims require approval.

## 10. Artifact-to-execution workflow

1.  **Build & package:** Create a `.krv` execution artifact in Studio.
2.  **Request authorization:** Check identity, permissions, subscription
    entitlements, booking validity, and cloud-managed policy.
3.  **Select target:** Select a robot and resolve its authoritative
    managing Agent.
4.  **Direct transfer:** Transfer `.krv` from Studio Local Runtime to
    the selected Agent; do not use cloud relay/storage.
5.  **Agent verification:** Verify checksum, trusted signature,
    compatibility, target, permissions, and local policy.
6.  **Robot readiness & safety:** Robot execution environment and
    robot-side safety systems independently determine whether execution
    is permitted.
7.  **Execute & monitor:** Coordinate execution, journal events, monitor
    state, and collect results.

Failure behavior: - Cloud authorization denied: do not proceed with the
cloud-dependent operation. - Direct transfer unavailable: report the
limitation; do not silently relay the artifact through the cloud. -
Artifact verification fails: reject the artifact. - Robot not ready or
safety refuses: do not start or continue physical operation contrary to
safety behavior. - Cloud connection lost during an existing run: follow
the predefined local continuation policy and robot-side safety rules. -
Cloud reconnects: reconcile state; never automatically restart a run or
clear a safety stop.

## 11. Reliability, offline operation, and reconciliation

### 11.1 State authority

  -----------------------------------------------------------------------
  State/record                        Authority
  ----------------------------------- -----------------------------------
  Subscription, booking, cloud        Cloud Control Plane
  authorization                       

  Robot/Agent registry and cloud      Cloud Control Plane
  assignment records                  

  Local execution journal and events  Robot Lab Agent
  observed/coordinated by Agent       

  Actual physical execution state     Robot execution environment, as
                                      reported through Agent

  Physical safety state               Robot-side safety systems

  Consolidated cloud run history      Cloud records after validation and
                                      reconciliation

  Studio display                      Latest known/reconciled view, with
                                      freshness clearly indicated
  -----------------------------------------------------------------------

### 11.2 Outage policy

An already-running application may continue during cloud loss only
according to a predefined local continuation policy and robot-side
safety behavior. New cloud-dependent operations require cloud
authorization. The allowed outage operations must be explicitly defined
and tested.

If a robot is offline while its Agent remains online, the Agent reports
that robot separately. If an Agent is offline, cloud status for its
robots becomes stale or unknown until reports resume. Do not assume
automatic Agent failover.

### 11.3 Event journal and reconciliation

Events should carry unique event IDs, monotonic per-agent sequence
numbers, timestamps and clock-quality metadata, and run
identifiers/idempotency protections as appropriate.

Reconnection sequence: 1. Authenticate the reconnecting Agent. 2. Report
current state and unacknowledged events. 3. Validate and deduplicate
events in the cloud. 4. Durably accept records before acknowledging
them. 5. Detect and surface missing events, sequence gaps, conflicts,
and incomplete history. 6. Reconcile cloud run history and refresh
Studio with freshness indicators.

The local journal should survive supported outages and restarts.
Retention, capacity, storage-exhaustion behavior, and detailed
reconciliation conflict policy remain **TBD**. Connectivity recovery
must not automatically restart a run or clear a safety stop.

## 12. Proposed implementation roadmap

These are proposed phases, not committed dates or claims of completion.

  -----------------------------------------------------------------------
  Phase                   Focus                   Intended outcome
  ----------------------- ----------------------- -----------------------
  P1                      Architecture & Platform Baseline, boundaries,
                          Foundation              repository/CI
                                                  foundation,
                                                  identity/access and
                                                  API/adapter contracts.

  P2                      Cloud Control Plane &   Backend foundation,
                          Commercial Workflows    organizations,
                                                  subscriptions,
                                                  entitlements, booking,
                                                  billing integration.

  P3                      Studio & Direct         Studio workflows, Local
                          Deployment              Runtime, `.krv`
                                                  packaging, direct
                                                  transfer, first Agent
                                                  integration.

  P4                      Single-Robot Execution  Artifact verification,
                          & Observability         readiness checks,
                                                  execution coordination,
                                                  monitoring and results.

  P5                      Multi-Robot Fleet &     Multiple robots per
                          Resilience              Agent, multiple Agents,
                                                  assignment, outage
                                                  behavior and
                                                  reconciliation.

  P6                      Training, Scale &       Training media,
                          Operational Readiness   encrypted offline
                                                  lessons, production
                                                  hardening, operations
                                                  and recovery.
  -----------------------------------------------------------------------

### Robot Lab Agent implementation track

-   **LA-P1:** Architecture, identity, assignment, adapter and security
    contracts.
-   **LA-P2:** Agent service, configuration, registration, heartbeat,
    health, persistence.
-   **LA-P3:** Single-robot adapter, artifact receiver/validation, run
    tracking and status.
-   **LA-P4:** Multi-robot state isolation and concurrency controls.
-   **LA-P5:** Persistent journal, outage behavior, replay protection
    and reconciliation.
-   **LA-P6:** Media/operations as required, diagnostics, deployment,
    upgrades and recovery.

### Proposed evidence-based gates

-   **G1 --- Architecture & Security Readiness:** Boundaries and
    contracts reviewed; security/safety responsibilities documented.
-   **G2 --- End-to-End Execution:** Direct transfer, Agent
    verification, robot-side checks, execution and status reporting
    demonstrated.
-   **G3 --- Fleet Reliability:** Multi-robot operation,
    outage/recovery, reconciliation and deduplication tested.
-   **G4 --- Commercial & Training Readiness:** Booking, subscriptions,
    billing, teaching-media authorization, offline expiry, monitoring
    and recovery reviewed.

No gate is considered passed without documented evidence and relevant
review.

## 13. Artwork index --- Slides 0--15

  -----------------------------------------------------------------------
  Slide                   Topic                   Main purpose
  ----------------------- ----------------------- -----------------------
  0                       Complete Architecture   One-page navigation map
                          Overview                for the 15-topic
                                                  series.

  1                       Product Vision & Value  Explain Kritva RaaS,
                          Proposition             target users, use
                                                  cases, and
                                                  differentiators.

  2                       RaaS System             Show Studio, cloud,
                          Architecture            agents, robots, and
                                                  system boundaries.

  3                       Kritva Studio User      Show core Studio
                          Experience              workspaces and proposed
                                                  training/media
                                                  experience.

  4                       Frontend & Local        Explain UI, Studio
                          Runtime Architecture    services, Local
                                                  Runtime, direct
                                                  transfer, and media
                                                  cache.

  5                       Cloud Backend           Show modular-monolith
                          Architecture            business domains and
                                                  integrations.

  6                       Cloud Infrastructure    Show provider-neutral
                          Architecture            compute, storage,
                                                  networking, operations,
                                                  and resilience.

  7                       Booking, Billing &      Explain billing models,
                          Subscription            subscription
                                                  entitlements, booking,
                                                  and authorization.

  8                       API Architecture        Show logical API
                                                  domains and distinguish
                                                  API traffic from direct
                                                  artifact transfer.

  9                       Security Architecture   Show trust zones,
                                                  artifact verification,
                                                  media protection, and
                                                  robot-side safety.

  10                      Artifact-to-Execution   Show packaging through
                          Workflow                authorization, direct
                                                  transfer, verification,
                                                  safety, and monitoring.

  11                      Roadmap &               Show proposed phased
                          Implementation Phases   delivery, Agent track,
                                                  milestones, and
                                                  evidence-based gates.

  12                      Component               Clarify ownership
                          Responsibilities &      across Studio, cloud,
                          Boundaries              Agent, robot runtime,
                                                  and safety.

  13                      Fleet Management &      Show multi-agent
                          Robot Lifecycle         topology, ownership,
                                                  lifecycle, states,
                                                  eligibility, and
                                                  reassignment.

  14                      Deployment Topology &   Show network boundaries
                          Network Connectivity    and direct, cloud,
                                                  agent, media, and
                                                  results paths.

  15                      Reliability, Offline    Show outage behavior,
                          Operation &             local journal,
                          Reconciliation          reconciliation, state
                                                  authority, and safety
                                                  rules.
  -----------------------------------------------------------------------

## 14. Cross-sheet consistency checklist

Before publishing or revising artwork, verify:

-   [ ] Direct `.krv` path is always Studio Local Runtime → selected
    Robot Lab Agent and bypasses Control Plane/cloud storage.
-   [ ] Cloud APIs are drawn separately from direct artifact transfer.
-   [ ] Agent-to-cloud reporting is authenticated and
    outbound-initiated.
-   [ ] Multiple Agents can each manage multiple robots.
-   [ ] Each robot has one authoritative managing Agent at a time in the
    initial architecture.
-   [ ] Agent health is distinct from per-robot connectivity and health.
-   [ ] Cloud business authority, Agent execution journal, physical
    execution state, and robot safety authority remain distinct.
-   [ ] Cloud authorization, Agent artifact verification, and robot-side
    safety checks are separate.
-   [ ] Training/media delivery is separate from `.krv` deployment and
    robot execution.
-   [ ] Offline media validity is linked to subscription validity or a
    shorter configured period.
-   [ ] Teaching-video playback never controls robot execution.
-   [ ] Booking does not guarantee execution readiness.
-   [ ] Outage recovery does not automatically restart runs or clear
    safety stops.
-   [ ] Unknown transport, protocol, retention, capacity, or policy
    choices remain marked TBD.
-   [ ] Artwork and roadmap do not imply implementation, release, or
    gate completion without evidence.

## 15. Open decisions to track

1.  Direct-transfer transport, peer authentication, connection
    establishment, NAT/firewall traversal, and key management.
2.  Studio Local Runtime process boundary and lifecycle management.
3.  Artifact signing/trust model and key provisioning/rotation.
4.  Robot adapter contract and robot-side execution/readiness interface.
5.  Robot Lab Agent journal schema, retention, capacity, and
    storage-exhaustion behavior.
6.  Event sequencing, gap detection, reconciliation conflict policy, and
    acknowledgement protocol.
7.  Explicit local continuation policy for cloud outages, including
    allowed operations and restrictions.
8.  Controlled Agent reassignment/handover protocol.
9.  Teaching-media storage/CDN and encryption/key-delivery
    implementation.
10. Offline authorization issuance, renewal, local protection, and
    expiry enforcement.
11. Final subscription plans, entitlement combinations, booking rules,
    and commercial policies.
12. Cloud provider, database, queue, deployment model, observability,
    backup, and recovery objectives.
13. API contracts, schemas, versioning, compatibility, and rate limits.
14. Operational support, upgrade, rollback, and disaster-recovery
    procedures.

## 16. Document maintenance

-   Keep this overview aligned with the approved architecture baseline
    and recorded decisions.
-   Update the revision history and detailed architecture documents when
    a decision changes.
-   Mark capability status accurately using the repository's
    authoritative conventions, such as **Proposed**, **Approved**,
    **Implemented**, **Verified**, or **Released**.
-   Do not treat artwork generation as implementation evidence.
-   Record material architecture changes through the repository's normal
    review process.

### Revision history

  -----------------------------------------------------------------------
  Version                 Date                    Notes
  ----------------------- ----------------------- -----------------------
  v0.2 overview           2026-10-20              Consolidated target
                                                  architecture concepts
                                                  represented by Slides
                                                  0--15; open decisions
                                                  remain explicitly
                                                  identified.

  -----------------------------------------------------------------------
