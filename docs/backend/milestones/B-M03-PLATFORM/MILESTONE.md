# B-M03 — Platform

## Milestone Dossier

**Milestone ID:** B-M03-PLATFORM  
**Product:** Kritva RaaS  
**Primary Phase:** P3 CONTROL PLANE  
**Supporting Phases:** None  
**Primary Surface:** RaaS Control Plane / Backend  
**Technology:** TypeScript/Node.js, PostgreSQL, REST API v1, WebSocket, provider-neutral infrastructure  
**Architecture:** Production-oriented Modular Monolith  
**Priority:** PRI-1 (primary product path per Priority Matrix; see `docs/planning/IMPLEMENTATION_ROADMAP.md` Section 5)  
**Status:** PLANNED  
**Primary Outcome:** Establish the authoritative platform, capability, lab, robot and resource model, provide compatibility evaluation services, and establish reusable WebSocket infrastructure for later live execution, telemetry, status and event delivery.

---

# 1 Objective

## 1.1 Milestone Objective

B-M03 establishes the authoritative robotic platform and resource model used by
Kritva RaaS.

The milestone connects the product's logical platform catalog with the
operational resources on which workloads can eventually execute.

The architectural relationship is:

    Platform Catalog
          |
          v
    Platform Version
          |
          +--> Architecture
          +--> Runtime
          +--> SDK
          +--> Capabilities
          +--> Configuration
          |
          v
        Lab
          |
          v
        Robot
          |
          v
       Resource
          |
          v
    Booking / Allocation
          |
          v
        Job
          |
          v
        Run

B-M03 also establishes the reusable WebSocket infrastructure required for:

- platform status;
- lab status;
- robot/resource status;
- Job events;
- Run events;
- telemetry;
- logs;
- safety-state presentation;
- live execution.

The milestone does not implement the complete live execution experience.

## 1.2 Product Goal

The user should be able to discover:

- which robotic platforms exist;
- which versions are supported;
- which architectures are supported;
- which capabilities are available;
- which labs host those platforms;
- which robots exist;
- which resources can be allocated;
- whether a resource is currently available;
- whether a selected artifact is compatible with a target.

The backend must provide authoritative answers.

## 1.3 Platform Catalog Objective

The platform catalog is the logical product definition.

It describes:

- what a platform is;
- which versions exist;
- which architectures are supported;
- which runtime and SDK versions apply;
- which capabilities exist;
- which configurations are valid.

It does not represent the current physical availability of a robot.

## 1.4 Lab Objective

A Lab represents an operational environment containing one or more resources.

Conceptually:

    Lab
      |
      +--> Robot
      |      |
      |      +--> Resource
      |
      +--> Simulator
      |      |
      |      +--> Resource
      |
      +--> Workstation
             |
             +--> Resource

A Lab may be:

- platform-operated;
- organization-owned;
- internal;
- partner-operated;
- production;
- development;
- simulation.

## 1.5 Robot Objective

A Robot represents a physical robotic identity.

Robot identity is distinct from resource allocation.

For example:

    Robot RB-001
         |
         +--> Resource RES-001
         |
         +--> Camera
         +--> Motors
         +--> Sensors
         +--> Runtime
         +--> Safety system

The robot remains a physical identity even when its resource allocation state
changes.

## 1.6 Resource Objective

A Resource is the allocatable operational unit.

A resource may represent:

- physical robot;
- simulator;
- GPU;
- workstation;
- other future execution resource.

Resource state is operational.

Platform state is catalog state.

These must not be conflated.

## 1.7 Capability Objective

Capabilities describe supported functional or technical features.

Examples:

- vision;
- camera;
- navigation;
- motion;
- manipulation;
- audio;
- EtherCAT;
- GPU acceleration;
- simulation;
- telemetry;
- remote video.

Capabilities may be:

- SUPPORTED;
- OPTIONAL;
- EXPERIMENTAL.

Capabilities are globally defined and associated with platform versions.

## 1.8 Compatibility Objective

Compatibility determines whether:

    Artifact
       |
       v
    Target Platform
       |
       v
    Target Platform Version
       |
       v
    Architecture
       |
       v
    Runtime / SDK
       |
       v
    Capabilities
       |
       v
    Configuration
       |
       v
    COMPATIBLE / INCOMPATIBLE / UNKNOWN

Compatibility must be evaluated server-side.

The Studio must not implement its own authoritative compatibility rules.

## 1.9 WebSocket Objective

B-M03 establishes a reusable WebSocket infrastructure layer.

The WebSocket layer must support:

- authenticated connections;
- authorization;
- tenant context;
- subscriptions;
- event envelopes;
- connection lifecycle;
- heartbeat;
- reconnect support;
- event sequencing;
- deduplication identifiers;
- backpressure;
- cleanup;
- graceful shutdown.

The WebSocket layer is a delivery mechanism.

It is not the authoritative state store.

## 1.10 Authoritative State Principle

The fundamental rule is:

> Live data is for observation; durable state is for truth.

Therefore:

    REST / PostgreSQL
          |
          | authoritative snapshot
          v
    WebSocket
          |
          | live updates
          v
        Studio

A WebSocket disconnect does not imply:

- robot stopped;
- Job failed;
- Run failed;
- safety state changed.

The client must resynchronize from durable state after reconnect.

---

# 2 Scope and Non-Scope

## 2.1 In Scope

B-M03 includes:

- platform registry;
- platform lifecycle;
- platform versions;
- architectures;
- capabilities;
- platform-version capability mappings;
- platform configurations;
- labs;
- robots;
- resources;
- maintenance windows;
- availability windows;
- resource state;
- compatibility service;
- compatibility API;
- platform/resource authorization;
- platform administration;
- resource status APIs;
- WebSocket infrastructure;
- WebSocket authentication;
- WebSocket authorization;
- subscriptions;
- event envelopes;
- event sequence numbers;
- event IDs;
- heartbeat;
- connection lifecycle;
- reconnect/resynchronization contract;
- backpressure;
- connection cleanup;
- WebSocket integration tests;
- coding-agent provider metadata registry and API (Section 2.7).

## 2.2 Explicitly Out of Scope

B-M03 does not implement:

- booking;
- credit reservation;
- payment;
- Job orchestration;
- Run orchestration;
- physical robot control;
- physical E-stop;
- motor control;
- robot firmware;
- Lab Agent implementation;
- WebRTC media;
- full telemetry processing;
- result processing;
- experiment comparison;
- artifact packaging;
- coding-agent sessions, adapters or provider credentials (Studio Local Runtime only).

## 2.3 Platform vs Resource

The distinction is mandatory.

| Concept | Meaning |
|---|---|
| Platform | Logical robotic product/type |
| Platform Version | Versioned platform software/hardware contract |
| Architecture | CPU/target architecture |
| Capability | Supported feature |
| Configuration | Supported platform configuration |
| Lab | Operational environment |
| Robot | Physical robot identity |
| Resource | Allocatable execution unit |

## 2.4 Platform Registry Boundary

The platform registry defines supported platform types.

Example:

    Platform:
      Kritva Reference Robot

    Version:
      1.0

    Architecture:
      arm64

    Runtime:
      KritvaOS 1.0

    SDK:
      Kritva SDK 1.0

    Capabilities:
      vision
      motion
      camera

## 2.5 Resource Registry Boundary

The resource registry describes operational instances.

Example:

    Platform:
      Kritva Reference Robot

        |
        +--> Lab Bangalore
                |
                +--> Robot RB-001
                |      |
                |      +--> Resource RES-001
                |
                +--> Robot RB-002
                       |
                       +--> Resource RES-002

## 2.6 WebSocket Boundary

WebSocket is intended for live state and event delivery.

It must not become:

- the authoritative database;
- a command queue without durable state;
- a source of truth for booking;
- a replacement for REST;
- a replacement for safety systems.

## 2.7 Coding-Agent Provider Metadata

B-M03 publishes the catalogue of supported coding-agent providers that Studio uses to decide whether a provider and CLI version are supported. Architecture: `docs/architecture/CODING_AGENT_INTEGRATION.md` Section 8.2. Decisions: SYS-ADR-007, BE-ADR-011. Persistence: DB-M02 CORE DATA (DB-ADR-011). Wire format: `docs/protocol/API_CONTRACT.md` Section 27.4.

Scope:

- provider registry with `provider_id`, display name, status (`SUPPORTED`, `DEPRECATED`, `BLOCKED`), supported adapter versions, supported CLI version range, capabilities, disclosure version and documentation link;
- read API for authenticated Studio users; write API for platform operators, with audit events;
- initial records for `claude-code` and `openai-codex`.

Boundary (mandatory, following Section 2.3):

| Concept | Meaning |
|---|---|
| Platform | Logical robotic product that runs `.krv` artifacts |
| Coding-agent provider | Developer tool that edits local source; never an execution target |

Providers MUST NOT appear in `/platforms`, capability, configuration, resource or compatibility results, and the compatibility service MUST NOT consider them.

---

# 3 Dependencies

## 3.1 Upstream Milestones

B-M03 depends on:

- B-M01 Control Plane;
- B-M02 Artifact;
- PostgreSQL architecture;
- platform schema baseline;
- authentication;
- authorization;
- audit;
- API v1;
- object-storage-independent platform metadata.

## 3.2 Database Dependencies

The baseline platform/lab schema includes:

    platform.platforms
    platform.platform_versions
    platform.architectures
    platform.capabilities
    platform.platform_version_capabilities
    platform.platform_configurations

    lab.labs
    lab.robots
    lab.resources
    lab.maintenance_windows
    lab.availability_windows

## 3.3 Artifact Dependency

B-M02 provides:

- artifact manifest;
- platform ID;
- platform version;
- architecture;
- KritvaOS version;
- SDK version;
- capabilities;
- configuration metadata.

B-M03 provides the authoritative target-side compatibility model.

## 3.4 Booking Dependency

B-M04 will consume:

- resource identity;
- resource availability;
- maintenance windows;
- platform eligibility;
- resource allocation semantics.

B-M03 does not implement booking.

## 3.5 Execution Dependency

B-M05 and later execution services consume:

- resource identity;
- robot identity;
- platform compatibility;
- resource state;
- WebSocket event infrastructure.

## 3.6 Live Dependency

F-M06 consumes the WebSocket foundation for:

- Job events;
- Run events;
- telemetry;
- logs;
- safety status;
- Lab status;
- robot status.

---

# 4 Deliverables

## 4.1 Platform Registry

Deliver:

- Platform repository;
- Platform Version repository;
- Architecture repository;
- Capability repository;
- Platform Configuration repository;
- platform service;
- platform administration API;
- platform discovery API.

## 4.2 Platform Lifecycle

Baseline lifecycle:

    DRAFT
      |
      v
    ACTIVE
      |
      v
    DEPRECATED
      |
      v
    RETIRED

Lifecycle meanings:

| State | Meaning |
|---|---|
| DRAFT | Defined but not generally available |
| ACTIVE | Supported for normal use |
| DEPRECATED | Supported with migration warning |
| RETIRED | No new normal use |

## 4.3 Capability Registry

Capabilities are globally defined.

Example:

    capability:
      vision

    platform-version:
      Kritva Reference Robot 1.0

    support:
      SUPPORTED

Capability support values:

- SUPPORTED;
- OPTIONAL;
- EXPERIMENTAL.

## 4.4 Platform Configuration

Configurations describe valid target variants.

Examples:

- standard camera;
- high-resolution camera;
- GPU configuration;
- simulation configuration;
- research configuration.

Configuration data is bounded JSONB where appropriate.

It must not become an unrestricted arbitrary data store.

## 4.5 Lab Registry

Labs contain operational resources.

Lab lifecycle:

    PROVISIONING
       |
       v
    ACTIVE
       |
       +--> MAINTENANCE
       |
       +--> OFFLINE
       |
       v
    RETIRED

## 4.6 Robot Registry

Robot lifecycle:

    PROVISIONING
       |
       v
    ACTIVE
       |
       +--> MAINTENANCE
       +--> FAULT
       |
       v
    RETIRED

A Robot represents physical identity.

## 4.7 Resource Registry

Resource lifecycle:

    PROVISIONING
       |
       v
    AVAILABLE
       |
       +--> RESERVED
       +--> BUSY
       +--> MAINTENANCE
       +--> OFFLINE
       +--> FAULT
       |
       v
    RETIRED

Resource type:

- ROBOT;
- SIMULATOR;
- GPU;
- WORKSTATION.

## 4.8 Maintenance Windows

Maintenance windows describe periods when resources or labs should not be
allocated.

Types:

- PLANNED;
- PREVENTIVE;
- EMERGENCY;
- UPGRADE;
- REPAIR.

Statuses:

- SCHEDULED;
- ACTIVE;
- COMPLETED;
- CANCELLED.

## 4.9 Availability Windows

Availability windows express operational availability policy.

They are not a replacement for real-time resource state.

A resource may be within an availability window but still be unavailable because
of:

- fault;
- maintenance;
- reservation;
- capacity;
- operational policy.

## 4.10 Compatibility Service

The service evaluates:

    Artifact
       |
       +--> Platform
       +--> Version
       +--> Architecture
       +--> Runtime
       +--> SDK
       +--> Capabilities
       +--> Configuration
       |
       v
    Compatibility Result

Result:

    COMPATIBLE
    INCOMPATIBLE
    UNKNOWN
    REQUIRES_REVIEW

## 4.11 WebSocket Gateway

Deliver:

- connection manager;
- authentication middleware;
- authorization middleware;
- subscription manager;
- event router;
- sequence handling;
- heartbeat;
- backpressure;
- connection cleanup;
- graceful shutdown.

## 4.12 Event Envelope

Baseline event:

    {
        "protocol_version": "1.0",
        "event_id": "evt-12345",
        "timestamp": "2026-10-08T20:00:02Z",
        "event": "resource.status_changed",
        "resource": {
            "type": "resource",
            "id": "resource-001"
        },
        "context": {
            "organization_id": "org-001"
        },
        "sequence": 1001,
        "correlation": {
            "trace_id": "trace-001",
            "span_id": "span-001"
        },
        "metadata": {},
        "data": {}
    }

## 4.13 WebSocket Connection

Connection lifecycle:

    CONNECTING
       |
       v
    AUTHENTICATING
       |
       v
    AUTHORIZED
       |
       v
    CONNECTED
       |
       +--> DEGRADED
       |
       +--> CLOSING
       |
       v
    CLOSED

## 4.14 Subscription Model

A client may subscribe to scoped topics.

Conceptual:

    {
        "action": "subscribe",
        "topics": [
            {
                "type": "resource",
                "id": "resource-001"
            }
        ]
    }

Authorization is evaluated for every subscription.

The client cannot subscribe to an organization or resource it cannot access.

## 4.15 Event Ordering

Events are at-least-once.

Each event has:

- event ID;
- sequence;
- resource identity.

Clients must deduplicate by event ID.

Clients detect gaps using sequence numbers.

On gap:

    Detect Gap
       |
       v
    Fetch Snapshot
       |
       v
    Resume Events

## 4.16 WebSocket Heartbeat

Heartbeat provides connection health.

It must not be interpreted as robot health.

For example:

    WebSocket = CONNECTED
        !=
    Robot = HEALTHY

and:

    WebSocket = DISCONNECTED
        !=
    Robot = STOPPED

## 4.17 Backpressure

The server must protect itself and clients from high-frequency event streams.

Mechanisms may include:

- bounded queues;
- per-connection limits;
- topic rate limits;
- coalescing;
- latest-value semantics for selected telemetry;
- disconnect on sustained overload.

Critical state events must not be silently dropped without an explicit recovery
mechanism.

---

# 9 Risks

## 9.1 R-BM03-001 — Platform/Resource Confusion

**Risk:** Product treats platform and physical robot as the same entity.

**Impact:** High.

**Mitigation:**

- explicit domain model;
- separate identifiers;
- separate repositories;
- architecture review.

## 9.2 R-BM03-002 — Incorrect Compatibility

**Risk:** Incompatible artifact is accepted for execution.

**Impact:** Critical.

**Mitigation:**

- server-side compatibility engine;
- authoritative catalog;
- tests;
- execution eligibility integration.

## 9.3 R-BM03-003 — Stale Resource State

**Risk:** UI treats stale state as current availability.

**Impact:** High.

**Mitigation:**

- timestamps;
- durable snapshot;
- explicit freshness;
- booking authority remains server-side.

## 9.4 R-BM03-004 — WebSocket Becomes Source of Truth

**Risk:** Product assumes missing WebSocket data means resource failure.

**Impact:** Critical.

**Mitigation:**

- REST snapshot;
- explicit reconnect/resync;
- durable state authority;
- documentation;
- tests.

## 9.5 R-BM03-005 — WebSocket Tenant Leakage

**Risk:** User subscribes to another tenant's resource events.

**Impact:** Critical.

**Mitigation:**

- per-subscription authorization;
- tenant-aware topic model;
- negative security tests.

## 9.6 R-BM03-006 — Event Flood

**Risk:** High-frequency events exhaust server/client resources.

**Impact:** High.

**Mitigation:**

- bounded queues;
- rate limits;
- coalescing;
- backpressure;
- subscription limits.

## 9.7 R-BM03-007 — Event Loss

**Risk:** Important event is lost during network interruption.

**Impact:** High.

**Mitigation:**

- event sequence;
- event ID;
- snapshot recovery;
- durable state.

## 9.8 R-BM03-008 — Duplicate Events

**Risk:** At-least-once delivery causes duplicate UI or business actions.

**Impact:** Medium.

**Mitigation:**

- event IDs;
- client dedupe;
- commands remain idempotent.

## 9.9 R-BM03-009 — Lab State Misinterpretation

**Risk:** Lab connectivity is interpreted as robot safety.

**Impact:** Critical.

**Mitigation:**

- separate safety model;
- explicit state semantics;
- no safety authority in WebSocket.

## 9.10 R-BM03-010 — Maintenance/Availability Conflict

**Risk:** Resource appears available while maintenance is active.

**Impact:** High.

**Mitigation:**

- maintenance overrides;
- deterministic availability rules;
- booking integration tests.

## 9.11 R-BM03-011 — Platform Version Drift

**Risk:** Platform metadata changes without preserving historical meaning.

**Impact:** High.

**Mitigation:**

- immutable/versioned platform versions;
- historical snapshots;
- controlled deprecation.

## 9.12 R-BM03-012 — Overly Generic Configuration

**Risk:** JSONB configuration becomes an uncontrolled schema bypass.

**Impact:** Medium.

**Mitigation:**

- bounded schema;
- validation;
- versioned configuration contract.

## 9.13 R-BM03-013 — Premature Live Complexity

**Risk:** B-M03 becomes a full telemetry/media platform.

**Impact:** Medium.

**Mitigation:**

- reusable WebSocket infrastructure only;
- F-M06 owns live product experience;
- WebRTC remains separate.

## 9.14 R-BM03-014 — Resource Identity Collision

**Risk:** Resource identifiers are reused after retirement.

**Impact:** High.

**Mitigation:**

- immutable identity;
- no unsafe reuse;
- historical references.

## 9.15 R-BM03-015 — Provider Metadata Conflated with Platforms

**Risk:** Coding-agent providers are modelled as platforms or capabilities, which corrupts compatibility results.

**Mitigation:** A separate resource and table; a negative test that platform and compatibility endpoints never return providers.

---

# 10 Exit Criteria

## 10.1 Platform Exit

- [ ] Platform registry works.
- [ ] Platform versions work.
- [ ] Architectures work.
- [ ] Capabilities work.
- [ ] Configurations work.
- [ ] Platform lifecycle works.
- [ ] Administration authorization works.
- [ ] Platform audit works.

## 10.2 Lab Exit

- [ ] Lab registry works.
- [ ] Lab lifecycle works.
- [ ] Lab status works.
- [ ] Lab ownership works.
- [ ] Maintenance works.
- [ ] Availability works.

## 10.3 Robot Exit

- [ ] Robot registry works.
- [ ] Robot identity is stable.
- [ ] Robot lifecycle works.
- [ ] Robot/platform relationship works.
- [ ] Robot/lab relationship works.

## 10.4 Resource Exit

- [ ] Resource registry works.
- [ ] Resource type works.
- [ ] Resource lifecycle works.
- [ ] Resource/robot relationship works.
- [ ] Resource/platform relationship works.
- [ ] Maintenance affects availability.
- [ ] Fault state is represented.

## 10.5 Compatibility Exit

- [ ] Artifact/platform matching works.
- [ ] Architecture matching works.
- [ ] Runtime matching works.
- [ ] SDK matching works.
- [ ] Capability matching works.
- [ ] Configuration matching works.
- [ ] Unknown state works.
- [ ] Incompatible state works.
- [ ] Compatibility is server-authoritative.
- [ ] Coding-agent providers never appear in platform or compatibility results.

## 10.5a Coding-Agent Provider Metadata Exit

- [ ] Provider list and detail APIs work for `claude-code` and `openai-codex`.
- [ ] Status, version ranges, capabilities and disclosure version are served.
- [ ] Operator updates are authorized and audited.

## 10.6 WebSocket Exit

- [ ] Authentication works.
- [ ] Authorization works.
- [ ] Connection lifecycle works.
- [ ] Subscription works.
- [ ] Event envelope works.
- [ ] Event sequence works.
- [ ] Event deduplication works.
- [ ] Heartbeat works.
- [ ] Backpressure works.
- [ ] Cleanup works.
- [ ] Reconnect/resync works.
- [ ] Tenant isolation works.

## 10.7 Integration Exit

- [ ] F-M03 can consume platform metadata.
- [ ] F-M04 can consume resource metadata.
- [ ] F-M05 can consume compatibility.
- [ ] F-M06 can consume WebSocket infrastructure.
- [ ] Future Lab Agent integration has stable contracts.

## 10.8 Quality Exit

- [ ] Unit tests pass.
- [ ] Repository tests pass.
- [ ] API tests pass.
- [ ] Compatibility tests pass.
- [ ] WebSocket tests pass.
- [ ] Security tests pass.
- [ ] Tenant isolation tests pass.
- [ ] Fault/reconnect tests pass.
- [ ] Performance baseline passes.
- [ ] CI passes.

## 10.9 Documentation Exit

- [ ] Platform model documented.
- [ ] Capability model documented.
- [ ] Lab model documented.
- [ ] Robot model documented.
- [ ] Resource model documented.
- [ ] Compatibility model documented.
- [ ] WebSocket protocol documented.
- [ ] Event model documented.
- [ ] Reconnect model documented.
- [ ] Tracking documents updated.

## 10.10 Formal Milestone Status

B-M03 follows:

    PLANNED
       |
       v
    READY
       |
       v
    IN_PROGRESS
       |
       v
    REVIEW
       |
       v
    QUALIFICATION
       |
       v
    ACCEPTED
       |
       v
    COMPLETE

Completion requires implementation evidence, tests, security review,
architecture review and milestone acceptance.

---
