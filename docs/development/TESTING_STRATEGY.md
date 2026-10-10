# Kritva RaaS Testing Strategy

## 1. Purpose

This document defines the production-grade, product-wide testing strategy for
Kritva RaaS.

The strategy establishes a consistent verification model across:

- RaaS Studio;
- Studio Local Runtime;
- shared packages;
- Control Plane;
- PostgreSQL;
- object storage;
- asynchronous workers;
- booking;
- credits;
- artifact management;
- Lab Agent;
- simulated labs;
- simulated robots;
- physical robots;
- telemetry;
- video;
- results;
- security controls;
- cloud infrastructure.

Testing is treated as an engineering control throughout the complete product
lifecycle.

The strategy is designed around the product principle:

> Build locally. Book remotely. Run on real robots.

The primary product workflow is:

    Login
      |
      v
    Create Project
      |
      v
    Select Robot Platform
      |
      v
    Build Locally
      |
      v
    Generate .krv Artifact
      |
      v
    Book Robot
      |
      v
    Upload Artifact
      |
      v
    Validate
      |
      v
    Start Job
      |
      v
    Live Video / Telemetry / Logs
      |
      v
    Complete Run
      |
      v
    Results
      |
      v
    Run Again

Testing must verify this flow end-to-end while also verifying every
individual boundary independently.

## 2. Scope

This strategy applies to:

- application code;
- frontend;
- Tauri/Rust native layer;
- backend;
- APIs;
- WebSockets;
- protocol contracts;
- database;
- object storage;
- queues;
- workers;
- authentication;
- authorization;
- tenant isolation;
- source-code privacy;
- artifact security;
- booking;
- credits;
- job execution;
- results;
- simulator;
- Lab Agent;
- robot runtime;
- telemetry;
- video;
- cloud infrastructure;
- deployment;
- release processes.

It covers:

- unit testing;
- component testing;
- contract testing;
- integration testing;
- end-to-end testing;
- simulated lab testing;
- hardware-in-the-loop testing;
- physical robot testing;
- performance testing;
- security testing;
- resilience testing;
- chaos testing;
- recovery testing;
- migration testing;
- compatibility testing;
- release qualification.

## 3. Goals

The testing strategy shall:

1. detect defects as early as practical;
2. verify business requirements;
3. verify architecture contracts;
4. protect tenant boundaries;
5. protect customer source code;
6. protect artifact integrity;
7. verify financial correctness;
8. verify booking correctness;
9. verify execution correctness;
10. verify result integrity;
11. verify robot safety boundaries;
12. validate failure behavior;
13. validate recovery behavior;
14. validate performance;
15. validate security;
16. support repeatable releases;
17. provide objective release evidence.

## 4. Non-Goals

This document does not:

- define individual test cases;
- replace task acceptance criteria;
- define detailed security architecture;
- define detailed database schema;
- define physical robot safety certification;
- replace human safety approval;
- require every test at every pipeline stage;
- mandate a single cloud provider;
- require production traffic for performance testing.

## 5. Testing Principles

Kritva RaaS follows these principles:

1. Test early.
2. Test at the lowest effective layer.
3. Prefer deterministic tests.
4. Test contracts independently.
5. Test integration realistically.
6. Test critical user journeys end-to-end.
7. Test failure paths deliberately.
8. Test security continuously.
9. Test production-like behavior before release.
10. Test physical robotics progressively.
11. Never rely on physical robots for basic software validation.
12. Never use cloud testing as a substitute for local safety testing.
13. Preserve test evidence.
14. Automate repeatable checks.
15. Keep test data isolated.
16. Keep environments reproducible.
17. Treat flaky tests as defects.
18. Measure meaningful behavior, not only coverage.
19. Release only with explicit quality evidence.

# 6. Test Pyramid

The primary testing pyramid is:

    +--------------------------------------+
    | Physical Robot / Production-like     |
    | Qualification / Safety Validation    |
    +--------------------------------------+
    | Hardware-in-the-Loop                 |
    +--------------------------------------+
    | End-to-End / Full Product            |
    +--------------------------------------+
    | Integration / Simulated Lab          |
    +--------------------------------------+
    | Contract / Component                 |
    +--------------------------------------+
    | Unit Tests                            |
    +--------------------------------------+

The majority of tests should execute at the lower levels.

Higher-level tests provide confidence across boundaries but should not become
the primary mechanism for detecting basic defects.

## 7. Test Layer Distribution

| Layer | Primary Purpose | Relative Volume |
|---|---|---:|
| Unit | Logic correctness | Very High |
| Component | Module behavior | High |
| Contract | Boundary compatibility | High |
| Integration | Real dependencies | Medium |
| E2E | Product workflows | Medium |
| Simulation | Execution behavior | Medium |
| HIL | Hardware integration | Low |
| Physical | Real-world qualification | Low |
| Chaos | Failure behavior | Targeted |

The exact percentages are implementation-dependent.

The principle is more important than fixed percentages.

# 8. Test Classification

Every test should have a classification where practical:

- `UNIT`
- `COMPONENT`
- `CONTRACT`
- `INTEGRATION`
- `E2E`
- `SIMULATION`
- `HIL`
- `PHYSICAL`
- `PERFORMANCE`
- `SECURITY`
- `CHAOS`
- `RECOVERY`
- `MIGRATION`
- `COMPATIBILITY`

Classification allows appropriate execution frequency.

# 9. Test Ownership

| Area | Primary Test Owner |
|---|---|
| Studio | Studio owner |
| Local Runtime | Runtime owner |
| Backend | Backend owner |
| Database | Database owner |
| Protocol | Protocol owner |
| Artifact | Artifact owner |
| Booking | Booking owner |
| Credits | Credit owner |
| Lab Agent | Lab owner |
| Simulator | Simulation owner |
| Security | Security owner |
| Physical Robot | Robotics/Safety owner |
| Cloud | Infrastructure owner |

The primary owner is accountable for test completeness.

# 10. Test Naming

Tests should use descriptive names that identify behavior.

Preferred structure:

    <component>_<behavior>_<condition>_<expected_result>

Example:

    booking_rejects_overlapping_resource_allocation

Test names should communicate intent rather than implementation.

# 11. Test Data Principles

Test data must be:

- deterministic where possible;
- isolated by environment;
- safe;
- reproducible;
- minimal;
- synthetic unless production data is explicitly authorized;
- versioned where needed.

Production customer data must not be copied into development or test
environments without explicit authorization and appropriate controls.

# 12. Test Data Domains

Representative test data should cover:

- users;
- organizations;
- memberships;
- projects;
- platforms;
- platform versions;
- configurations;
- labs;
- robots;
- resources;
- artifacts;
- bookings;
- credit wallets;
- ledger entries;
- jobs;
- runs;
- results;
- experiments;
- audit records.

# 13. Test Tenant Model

Tests must include multiple organizations.

Minimum isolation scenario:

    Organization A
       |
       +--> Project A
       +--> Artifact A
       +--> Booking A
       +--> Result A

    Organization B
       |
       +--> Project B
       +--> Artifact B
       +--> Booking B
       +--> Result B

Tests must prove that A cannot access B's protected data.

# 14. Test Identity Model

Test identities should include:

- organization owner;
- organization admin;
- organization member;
- organization viewer;
- project owner;
- project admin;
- project member;
- project viewer;
- platform operator;
- lab operator;
- support agent;
- system service;
- Lab Agent.

Authorization tests should exercise both allowed and denied operations.

# 15. Environment Model

The testing environment hierarchy is:

    Developer Local
          |
          v
    CI
          |
          v
    Development
          |
          v
    Simulation Lab
          |
          v
    Staging
          |
          v
    HIL
          |
          v
    Physical Qualification
          |
          v
    Production

Not every test runs at every stage.

# 16. Developer Local Environment

Developer environments support:

- unit tests;
- component tests;
- contract tests;
- local integration tests;
- local PostgreSQL;
- local object storage;
- local queue;
- simulated lab;
- E2E smoke tests.

The environment should be disposable.

# 17. CI Environment

CI must provide:

- clean checkout;
- pinned dependencies;
- reproducible build;
- isolated database;
- isolated test data;
- automated test execution;
- artifact generation;
- test reports.

CI must not depend on an individual developer workstation.

# 18. Development Environment

Development should provide:

- deployed backend;
- PostgreSQL;
- object storage;
- queue;
- authentication;
- simulated lab;
- observability;
- representative configuration.

It is intended for integrated team testing.

# 19. Simulation Lab Environment

The Simulation Lab provides:

- virtual Lab Agent;
- simulated resources;
- simulated robots;
- simulated runtime;
- deterministic telemetry;
- simulated video;
- configurable failures.

It is the primary pre-HIL execution environment.

# 20. Staging Environment

Staging should resemble production sufficiently to validate:

- deployment;
- configuration;
- migrations;
- authentication;
- authorization;
- cloud integration;
- performance;
- observability;
- release workflows.

Production data should not be required.

# 21. HIL Environment

Hardware-in-the-loop validates:

- actual hardware interfaces;
- firmware/runtime integration;
- network behavior;
- timing;
- sensor interfaces;
- actuator interfaces;
- Lab Agent behavior.

HIL should operate under controlled safety procedures.

# 22. Physical Qualification Environment

Physical qualification validates:

- real robot behavior;
- actual motion;
- real sensors;
- actual actuators;
- fault behavior;
- communication loss;
- safety controls.

Physical qualification is gated by human safety approval.

# 23. Production Environment

Production monitoring and validation should use:

- synthetic transactions where safe;
- health checks;
- canary validation;
- controlled operational tests.

Production must not be used as an experimental test environment.

# 24. Unit Testing

Unit tests validate isolated logic.

Examples:

- validation;
- state transitions;
- calculations;
- manifest parsing;
- permission decisions;
- credit calculations;
- booking policy;
- result classification.

Unit tests should be:

- fast;
- deterministic;
- isolated;
- repeatable.

# 25. Component Testing

Component tests validate a module with its immediate dependencies.

Examples:

- booking service;
- artifact service;
- credit service;
- project service;
- Studio local build service.

Component tests should expose meaningful module behavior without requiring
the complete system.

# 26. Contract Testing

Contract testing validates interfaces between independently evolving
components.

Important boundaries include:

    Studio <-> Control Plane
    Control Plane <-> Lab Agent
    Lab Agent <-> Runtime
    Backend <-> PostgreSQL repositories
    Backend <-> Object Storage
    Backend <-> Queue
    Runtime <-> Robot interfaces

# 27. Contract Test Requirements

A contract test should verify:

- schema;
- required fields;
- optional fields;
- types;
- status codes;
- error codes;
- authentication;
- authorization;
- idempotency;
- compatibility;
- versioning.

# 28. REST Contract Testing

REST contracts should test:

- request validation;
- response schema;
- status codes;
- error format;
- pagination;
- filtering;
- authorization.

Example request:

    {
        "protocol_version": "1.0",
        "request_id": "req-001",
        "command": "project.create",
        "context": {
            "organization_id": "org-001"
        },
        "payload": {}
    }

# 29. WebSocket Contract Testing

WebSocket tests should validate:

- authentication;
- connection establishment;
- subscription;
- event format;
- sequence;
- ordering;
- disconnect;
- reconnect;
- authorization.

# 30. Event Contract Testing

Events should be validated for:

- event ID;
- timestamp;
- resource;
- organization context;
- sequence;
- correlation;
- payload;
- schema version.

At-least-once delivery must be tested through duplicate-event scenarios.

# 31. Protocol Compatibility

Protocol tests should include:

- current client/current server;
- previous client/current server;
- current client/previous compatible server where supported;
- invalid version;
- unsupported version.

Breaking protocol changes require explicit approval.

# 32. Database Integration Testing

Database integration tests should use a real PostgreSQL-compatible environment.

Tests must validate:

- constraints;
- indexes;
- transactions;
- isolation;
- foreign keys;
- exclusion constraints;
- migrations;
- tenant boundaries.

Mocking PostgreSQL behavior is insufficient for database-critical behavior.

# 33. Transaction Testing

Critical transactions require explicit tests.

Examples:

- booking confirmation;
- credit reservation;
- credit consumption;
- refund;
- resource allocation;
- job creation;
- state transitions.

Tests should include concurrent requests.

# 34. Booking Concurrency Test

Minimum scenario:

    Request A ----+
                  |
                  v
              Resource R
                  ^
                  |
    Request B ----+

Only one conflicting allocation may succeed.

The test must prove this under actual concurrent execution.

# 35. Credit Concurrency Testing

Credit tests must verify:

- simultaneous reservations;
- insufficient balance;
- duplicate reservation;
- cancellation;
- refund;
- consumption;
- reconciliation.

The wallet and ledger must remain internally consistent.

# 36. Artifact Integration Testing

Artifact tests should verify:

- package creation;
- manifest;
- checksum;
- signature;
- upload;
- download;
- validation;
- rejection;
- revocation;
- expiration.

Source files must not accidentally enter the remote artifact.

# 37. Source Privacy Testing

Automated tests should inspect:

- artifact contents;
- upload payloads;
- request payloads;
- logs;
- temporary storage;
- diagnostic bundles.

The expected invariant is:

    Source Code
        |
        X----> Control Plane
        |
        v
    Local Build
        |
        v
    Signed .krv

Coding-agent sessions follow the same invariant (`docs/architecture/CODING_AGENT_INTEGRATION.md` Section 11):

- Network capture during agent sessions shows no source, prompt, transcript or diff sent to any Kritva endpoint.
- The agent process environment contains no Kritva credential.
- Every adapter passes one shared contract suite against the deterministic mock provider in CI.
- Real-provider contract tests run against dedicated test accounts and non-confidential fixture projects, on a scheduled job for each supported CLI version.
- MCP negative tests and a prompt-injection fixture prove that signing, upload, booking, credit, Job, Run and robot operations are unreachable.
- The primary product path E2E suite also runs with no coding-agent provider installed.

## 37.1 Coding-Agent Test Matrix

This matrix is the release-gating evidence for `docs/architecture/CODING_AGENT_INTEGRATION.md` Section 11. Real-provider rows run against dedicated test accounts and non-confidential fixture projects. A pass against the mock provider is never counted as real-provider evidence.

Dimensions for rows marked "per combination": supported OS × provider (Claude Code, OpenAI Codex) × supported CLI version × permission mode (`READ_ONLY`, `PROPOSE`) × isolation tier.

| ID | Area | Cases | Suite | Expected result | Evidence retained | Blocks exit |
|---|---|---|---|---|---|---|
| CAT-01 | Adapter contract | Discovery statuses, capability verification, error taxonomy, mode mapping (per combination) | Adapter contract suite | All cases pass; unsupported mode refused | CI report per CLI version | F-M02 (first provider), F-M03 (both) |
| CAT-02 | Environment | Inspect agent process environment | Runtime security suite | No Kritva token, key, credential or signing material | Test log | F-M01, F-M02 |
| CAT-03 | Isolation | Symlinks, path traversal, hard links, nested mounts, subprocesses, background processes, reads outside the read boundary, writes outside staging, network to non-allowed endpoints (per OS, provider and tier); session-start probe and its failure path (no silent downgrade: stop before agent work, reject when tier A is required, fresh acknowledgement otherwise); tier C per-session disclosure; policy requiring tier A rejects a tier-C-only combination despite consent | Isolation suite | Tier A enforcement proven by denied read, write and network operations, not by the handshake; tier C disclosed every session and writes detected; combination below the required tier shown unsupported | Per-OS and per-provider report; compatibility matrix entry | F-M02 |
| CAT-04 | Change sets | Apply full, per file, per hunk; concurrent edit conflict; idempotent re-apply; revert | Change-set suite | Working tree changes only on apply; conflicts never overwritten | Test log | F-M02 |
| CAT-05 | Recovery | Kill Studio during session and during apply; OS restart; disk full; corrupt journal | Fault-injection suite | No loss of pre-existing user work; user informed | Fault-injection report | F-M02 |
| CAT-06 | Consent | First use; disclosure change; organization change; withdrawal during a session | E2E | Behaviour per architecture Sections 4.3 and 8.4 | E2E recording | F-M02 |
| CAT-07 | Policy | Expiry, revocation and tool removal during a session; cache corruption; clock change; offline start; organization with no policy versus policy fetch failure | Policy suite | Calls denied immediately; session stopped within 10 s; `READ_ONLY` fallback on fetch failure; `POLICY_UNCONFIGURED` and `POLICY_UNAVAILABLE` distinguished in UI, IPC and audit | Test log | F-M02 (local), P3 CONTROL PLANE (server) |
| CAT-08 | MCP tools | Positive and negative case per tool; schema rejection; unknown fields; oversize input | MCP suite | Only the catalogue is reachable; invalid input rejected | Test log | F-M03 |
| CAT-09 | MCP authorization | Approval binding and invalidation, including a change to the staging workspace, the build profile or the test-target definition after approval; denial when any control denies; loopback token and replay | MCP security suite | All denials enforced | Test log | F-M03 |
| CAT-10 | Prompt injection | Malicious instructions in source, build logs, test output, instruction files and generated artifacts; malicious build script; resource exhaustion | Adversarial suite | No signing, upload, booking, credit, Job, Run or robot effect; limits enforced | Fixture report | F-M03 |
| CAT-11 | Egress | Every path in architecture Section 4.2 during agent sessions | Network-capture suite | No coding-agent content to Kritva | Capture summary | F-M02, F-M03 |
| CAT-12 | Provenance | Applied, unapplied, manually edited, reverted, branch-switched builds | Build suite | `agent_assisted` deterministic per architecture Section 9 | Test log | F-M03 |
| CAT-13 | No provider | Full primary product path with no provider installed, and with providers disabled by policy | E2E | Path passes | E2E report | Every phase exit from P1 STUDIO onward |

# 38. Authentication Testing

Authentication tests include:

- valid login;
- invalid credentials;
- account lock;
- MFA;
- session expiry;
- refresh;
- token revocation;
- password recovery;
- disabled user;
- service identity.

# 39. Authorization Testing

Authorization testing should use a permission matrix.

Example:

| Operation | Owner | Admin | Member | Viewer |
|---|---|---|---|---|
| View Project | Yes | Yes | Yes | Yes |
| Modify Project | Yes | Yes | Policy | No |
| Delete Project | Yes | Policy | No | No |
| Book Resource | Yes | Yes | Policy | No |
| Execute Job | Yes | Yes | Policy | No |

The exact matrix is defined by authorization policy.

# 40. Tenant Isolation Testing

Tests must attempt:

- cross-tenant read;
- cross-tenant update;
- cross-tenant delete;
- cross-tenant artifact download;
- cross-tenant result download;
- cross-tenant booking access;
- cross-tenant credit access.

All must be rejected.

# 41. Object Storage Security Testing

Tests should verify:

- unauthorized object access;
- expired download authorization;
- wrong tenant;
- wrong project;
- wrong artifact;
- deleted object;
- corrupted object.

# 42. Queue and Worker Testing

Worker tests should cover:

- successful job;
- duplicate message;
- retry;
- transient failure;
- permanent failure;
- timeout;
- dead-letter behavior;
- reconciliation.

Workers must be idempotent for operations requiring retries.

# 43. End-to-End Testing

E2E tests validate complete user journeys.

The primary smoke test is:

    Login
      |
      v
    Project
      |
      v
    Platform
      |
      v
    Local Build
      |
      v
    Artifact
      |
      v
    Booking
      |
      v
    Job
      |
      v
    Simulated Robot
      |
      v
    Result
      |
      v
    Rerun

# 44. E2E Test Categories

E2E suites should include:

- happy path;
- authentication failure;
- authorization failure;
- invalid artifact;
- incompatible platform;
- insufficient credits;
- booking conflict;
- job failure;
- timeout;
- cancellation;
- result generation;
- rerun.

# 45. E2E Test Stability

E2E tests must be:

- deterministic where possible;
- independently resettable;
- isolated;
- observable;
- diagnosable.

A flaky E2E test should be treated as a defect, not permanently ignored.

# 46. E2E Test Data Reset

Each E2E test should use isolated data.

Preferred pattern:

    Create Test Organization
          |
          v
    Create Project
          |
          v
    Execute Test
          |
          v
    Verify
          |
          v
    Cleanup / Expire

Persistent shared state should be minimized.

# 47. Simulated Lab

The simulated lab is a first-class testing environment.

It should model:

- Lab Agent;
- resources;
- robots;
- runtime;
- network;
- telemetry;
- logs;
- video;
- failures.

# 48. Simulated Robot Model

The simulator should expose configurable:

- joint positions;
- velocities;
- limits;
- sensor values;
- actuator responses;
- battery state;
- faults;
- latency;
- packet loss.

It need not reproduce every physical characteristic.

It must reproduce software-relevant contracts.

# 49. Simulation Determinism

Simulation tests should support deterministic execution.

Preferred controls include:

- fixed seed;
- fixed time;
- controlled scheduler;
- reproducible sensor inputs;
- deterministic fault injection.

A failed simulation should be reproducible from recorded parameters.

# 50. Simulation Fault Injection

The simulator should support:

- network disconnect;
- delayed response;
- dropped message;
- invalid telemetry;
- robot fault;
- resource unavailable;
- runtime crash;
- artifact rejection;
- timeout.

# 51. Simulation State Model

A representative flow is:

    Resource AVAILABLE
          |
          v
       RESERVED
          |
          v
         BUSY
          |
          v
       EXECUTING
          |
          v
      COMPLETED
          |
          v
       AVAILABLE

Fault transitions must also be tested.

# 52. Simulated Telemetry

Telemetry tests should verify:

- schema;
- timestamps;
- sequence;
- units;
- missing data;
- out-of-order data;
- duplicate data;
- rate;
- aggregation.

High-frequency telemetry should not require the product database to store every
sample as authoritative business state.

# 53. Simulated Video

Video tests should validate:

- stream availability;
- authorization;
- start;
- stop;
- disconnect;
- reconnect;
- latency measurement;
- failure indication.

Video quality tests should remain separate from business correctness tests.

# 54. Lab Agent Testing

Lab Agent tests should verify:

- identity;
- authentication;
- command validation;
- artifact validation;
- resource selection;
- execution;
- telemetry;
- logs;
- fault handling;
- reconnect.

The Lab Agent must independently enforce local policy.

# 55. Runtime Testing

Runtime tests should verify:

- startup;
- artifact loading;
- capability validation;
- execution;
- telemetry;
- shutdown;
- fault handling.

The runtime must not rely solely on cloud authorization for physical safety.

# 56. Hardware-in-the-Loop Testing

HIL connects software to real hardware without exposing uncontrolled production
operation.

Typical topology:

    Control Plane
         |
         v
    Lab Agent
         |
         v
    Runtime
         |
         v
    HIL Hardware
         |
         v
    Sensors / Actuators

# 57. HIL Objectives

HIL validates:

- electrical interfaces;
- driver behavior;
- timing;
- protocol behavior;
- firmware interaction;
- sensor acquisition;
- actuator command paths;
- fault detection.

# 58. HIL Safety

HIL must have:

- physical emergency stop;
- controlled power;
- limited operating envelope;
- test operator;
- safe default state;
- documented procedures.

No automated test should bypass a safety mechanism.

# 59. Physical Robot Testing

Physical tests are the final validation layer.

They should be limited to scenarios already validated through:

    Unit
      |
      v
    Integration
      |
      v
    Simulation
      |
      v
    HIL
      |
      v
    Physical

# 60. Physical Test Categories

Physical qualification should cover:

- startup;
- nominal execution;
- stop;
- cancellation;
- communication loss;
- sensor fault;
- actuator fault;
- runtime fault;
- emergency stop;
- recovery.

# 61. Physical Safety Gate

Physical execution requires:

- approved test procedure;
- identified robot;
- approved test artifact;
- operator;
- safety boundary;
- emergency stop;
- test evidence.

A software test result does not replace human safety approval.

# 62. Performance Testing

Performance testing validates:

- latency;
- throughput;
- concurrency;
- resource consumption;
- scalability;
- stability.

Performance testing must use realistic workloads.

# 63. Performance Test Types

| Type | Purpose |
|---|---|
| Baseline | Establish normal behavior |
| Load | Expected workload |
| Stress | Above expected workload |
| Spike | Sudden workload |
| Soak | Long-duration stability |
| Capacity | Find practical limit |
| Regression | Detect degradation |

# 64. API Performance

Measure:

- p50;
- p95;
- p99;
- error rate;
- throughput;
- CPU;
- memory;
- database utilization.

Targets should be established per API class.

# 65. Database Performance

Measure:

- query latency;
- rows examined;
- index usage;
- lock contention;
- transaction duration;
- connection utilization.

Slow queries should be identified before production scale.

# 66. Booking Performance

Booking performance testing must include:

- concurrent booking requests;
- conflicting bookings;
- multiple resources;
- multiple organizations;
- varying time ranges.

Correctness takes precedence over raw throughput.

# 67. Credit Performance

Credit performance must preserve ledger correctness under load.

The test must verify:

    Requests
       |
       v
    Concurrent Transactions
       |
       v
    Wallet + Ledger
       |
       v
    Balanced State

No performance optimization may weaken financial integrity.

# 68. Job Scheduling Performance

Measure:

- queue delay;
- validation time;
- allocation time;
- deployment time;
- startup time;
- execution overhead.

The test should separate scheduling latency from robot execution time.

# 69. Studio Performance

Studio testing should consider:

- startup;
- project load;
- build invocation;
- artifact generation;
- large log streams;
- telemetry rendering;
- video rendering;
- memory usage.

# 70. Security Testing

Security testing includes:

- SAST;
- dependency scanning;
- secret scanning;
- DAST where appropriate;
- authorization tests;
- tenant isolation;
- artifact security;
- session testing;
- API abuse testing.

# 71. Security Test Environment

Security testing should run primarily against:

- isolated development;
- security test;
- staging.

Production security testing requires explicit authorization.

# 72. Authentication Security Tests

Test:

- brute-force resistance;
- token replay;
- refresh-token reuse;
- session invalidation;
- account enumeration;
- privilege escalation;
- MFA bypass attempts.

# 73. Authorization Security Tests

Test:

- horizontal privilege escalation;
- vertical privilege escalation;
- project boundary;
- organization boundary;
- platform administration;
- Lab access;
- artifact access;
- result access.

# 74. Artifact Security Testing

Security tests should attempt:

- modified binary;
- modified manifest;
- invalid signature;
- expired artifact;
- revoked artifact;
- incompatible artifact;
- malicious payload;
- unauthorized capability.

Expected behavior is rejection or quarantine.

# 75. Source Privacy Security Tests

Security testing should attempt to determine whether source can escape through:

- upload;
- logs;
- telemetry;
- crash reports;
- diagnostics;
- object storage;
- error messages.

Any unintended source transfer is a critical defect.

# 76. Dependency Security Testing

Dependency testing should detect:

- known vulnerabilities;
- license issues;
- unexpected transitive dependencies;
- abandoned critical packages.

Risk acceptance must be explicit.

# 77. Chaos Testing

Chaos testing validates resilience to controlled failures.

Target failures include:

- database unavailability;
- queue outage;
- object storage outage;
- network partition;
- Lab Agent disconnect;
- runtime crash;
- worker crash;
- authentication service failure.

# 78. Chaos Principles

Chaos testing must:

- be controlled;
- be observable;
- have rollback;
- have defined expected behavior;
- avoid unsafe physical behavior.

Physical chaos testing requires separate safety authorization.

# 79. Database Failure Testing

Test:

- connection loss;
- restart;
- transaction rollback;
- timeout;
- failover where available.

Verify that the application does not incorrectly report successful business
operations when persistence failed.

# 80. Queue Failure Testing

Verify:

- requests remain recoverable;
- duplicate processing is safe;
- retries occur;
- dead-letter behavior works;
- authoritative state remains correct.

# 81. Object Storage Failure Testing

Verify:

- artifact upload failure;
- partial upload;
- download failure;
- checksum mismatch;
- unavailable result file.

Business state must not falsely report an available object.

# 82. Lab Disconnect Testing

Test:

    Cloud
      |
      X
    Lab Agent

Expected behavior:

- cloud records loss;
- job state becomes appropriate;
- local runtime follows safe policy;
- no unsafe restart occurs;
- reconnect supports recovery where safe.

# 83. Runtime Crash Testing

A runtime crash should result in:

- fault detection;
- appropriate Job/Run state;
- logs;
- telemetry;
- result status;
- safe robot behavior.

# 84. Recovery Testing

Recovery tests verify:

- restart;
- reconnect;
- replay;
- reconciliation;
- retry;
- state restoration.

Recovery should preserve authoritative business state.

# 85. Reconciliation Testing

Reconciliation must detect mismatches such as:

- Booking says active but resource is free;
- Job says running but Lab Agent disconnected;
- Artifact metadata exists but object is missing;
- credit reservation exists without corresponding lifecycle completion.

# 86. Migration Testing

Every production migration should be tested against:

- clean installation;
- previous production-like schema;
- representative data volume;
- rollback or recovery procedure where supported.

Destructive migrations require additional approval.

# 87. Compatibility Testing

Compatibility should cover:

- Studio versions;
- backend versions;
- protocol versions;
- artifact format;
- platform versions;
- SDK versions;
- Lab Agent versions;
- runtime versions.

# 88. Backward Compatibility

Where backward compatibility is required:

    Old Consumer
         |
         v
    New Provider

must be explicitly tested.

Compatibility requirements must be documented rather than assumed.

# 89. Release Qualification

Every release must have a qualification record containing:

- version;
- commit;
- environment;
- test suites;
- results;
- known failures;
- accepted risks;
- approvals.

# 90. Quality Gates

Quality gates are cumulative.

    Gate 0
      |
      v
    Gate 1
      |
      v
    Gate 2
      |
      v
    Gate 3
      |
      v
    Gate 4
      |
      v
    Gate 5
      |
      v
    Gate 6
      |
      v
    Gate 7
      |
      v
    Gate 8

A later phase must not silently weaken an earlier gate.

# 91. Phase 0 Quality Gate

Phase 0 requires:

- repository builds;
- formatting passes;
- lint passes;
- basic unit framework;
- CI operates;
- contract framework exists;
- test environment is documented;
- security scanning baseline exists.

# 92. Phase 1 Quality Gate

Phase 1 requires:

- unit tests;
- database integration tests;
- migration tests;
- authentication tests;
- authorization tests;
- tenant isolation tests;
- project/platform contract tests.

# 93. Phase 2 Quality Gate

Phase 2 requires:

- Studio unit/component tests;
- Tauri IPC tests;
- local build tests;
- artifact tests;
- source privacy tests;
- signing/verification tests;
- upload/download tests.

# 94. Phase 3 Quality Gate

Phase 3 requires:

- Lab Agent contract tests;
- simulator tests;
- Job lifecycle tests;
- Run lifecycle tests;
- result tests;
- primary E2E flow;
- disconnect/retry tests.

# 95. Phase 4 Quality Gate

Phase 4 requires:

- booking concurrency tests;
- allocation tests;
- credit ledger tests;
- reservation tests;
- refund tests;
- rate-card tests;
- insufficient-credit tests.

# 96. Phase 5 Quality Gate

Phase 5 requires:

- simulation qualification;
- Lab Agent tests;
- runtime tests;
- HIL tests;
- controlled physical tests;
- safety review;
- fault recovery tests.

# 97. Phase 6 Quality Gate

Phase 6 requires:

- security suite;
- tenant isolation suite;
- secret scanning;
- dependency scanning;
- penetration testing where required;
- backup/restore testing;
- disaster recovery testing;
- production observability validation.

# 98. Phase 7 Quality Gate

Phase 7 requires:

- load testing;
- stress testing;
- soak testing;
- capacity validation;
- multi-resource testing;
- multi-lab testing;
- operational recovery tests.

# 99. Phase 8 Quality Gate

Phase 8 requires:

- complete E2E;
- security qualification;
- production migration validation;
- release qualification;
- simulator qualification;
- HIL qualification where applicable;
- physical qualification;
- rollback validation;
- operational readiness.

# 100. Test Execution Frequency

| Test Type | Frequency |
|---|---|
| Unit | Every PR |
| Component | Every PR |
| Contract | Every PR |
| Integration | Every PR / merge |
| E2E smoke | Every merge |
| Full E2E | Scheduled / release |
| Security static | Every PR |
| Security dynamic | Scheduled / release |
| Simulation | Every relevant PR |
| HIL | Scheduled / release |
| Physical | Qualification |
| Performance | Scheduled / release |
| Chaos | Scheduled |
| DR | Scheduled |

# 101. CI Pipeline

A representative CI pipeline is:

    Checkout
       |
       v
    Install Dependencies
       |
       v
    Format
       |
       v
    Lint
       |
       v
    Typecheck
       |
       v
    Unit Tests
       |
       v
    Component Tests
       |
       v
    Contract Tests
       |
       v
    Integration Tests
       |
       v
    Security Scans
       |
       v
    Build
       |
       v
    E2E Smoke
       |
       v
    Publish Evidence

# 102. PR Quality Gate

A PR should not merge when:

- required CI fails;
- required tests fail;
- required review is missing;
- security scan has an unresolved blocker;
- migration validation fails;
- acceptance criteria are incomplete;
- required safety review is missing.

# 103. Flaky Test Policy

A flaky test is a defect.

When detected:

1. classify;
2. reproduce;
3. identify cause;
4. fix;
5. restore to required suite.

Temporarily quarantined tests require:

- owner;
- issue;
- reason;
- expiry/review date.

Permanent quarantine is not acceptable.

# 104. Test Failure Policy

A failed test must be classified as:

- product defect;
- test defect;
- environment defect;
- infrastructure defect;
- known accepted exception.

The classification must be evidence-based.

# 105. Test Evidence

Test evidence should include:

- test suite;
- commit;
- environment;
- timestamp;
- result;
- logs;
- relevant artifacts;
- failure details.

Release evidence should be retained according to release policy.

# 106. Test Observability

Test environments should expose:

- logs;
- metrics;
- traces;
- database state where authorized;
- queue state;
- Lab Agent state;
- simulator state.

A test that fails without diagnostic evidence is expensive to maintain.

# 107. Test Isolation

Tests should avoid sharing mutable state.

Preferred:

    Test A -> Database A
    Test B -> Database B
    Test C -> Database C

Where full isolation is impractical, transactions or controlled reset mechanisms
must be used.

# 108. Test Time Control

Time-dependent domains require controlled time.

Examples:

- booking windows;
- credit expiration;
- artifact expiration;
- session expiration;
- maintenance;
- result retention.

Tests should use injectable clocks where architecture permits.

# 109. Test Randomness

Randomized testing may be used for:

- malformed inputs;
- protocol fuzzing;
- scheduler behavior;
- simulator faults.

Random seeds must be recorded for failed runs.

# 110. Property-Based Testing

Property-based testing is recommended for:

- validation;
- parsers;
- serialization;
- state transitions;
- credit calculations;
- protocol handling.

Examples of properties:

- ledger remains balanced;
- invalid state transitions are rejected;
- serialization round-trips;
- tenant boundaries remain enforced.

# 111. Fuzz Testing

Fuzzing should target:

- artifact manifest;
- protocol payloads;
- API inputs;
- file parsing;
- configuration;
- telemetry payloads.

Fuzz failures must be reproducible.

# 112. Security Fuzzing

Security-sensitive parsers and protocol handlers should receive targeted
fuzzing.

Examples:

- malformed manifests;
- invalid signatures;
- oversized payloads;
- nested JSON;
- invalid Unicode;
- corrupted archives.

# 113. Test Data Retention

Test data should be retained only as necessary.

Long-lived test environments should have cleanup policies.

Production customer data should never be retained in test environments by
default.

# 114. Test Secrets

Test secrets must be:

- environment-specific;
- non-production;
- rotatable;
- centrally managed where practical.

Production secrets must not be copied into CI or developer environments.

# 115. Test Artifact Management

Test artifacts may include:

- `.krv` packages;
- logs;
- reports;
- screenshots;
- traces;
- simulator recordings;
- performance results.

Artifacts must be classified and retained appropriately.

# 116. Test Database Strategy

The database strategy should support:

- disposable local database;
- isolated CI database;
- persistent Development database;
- persistent Staging database;
- controlled Production database.

Migrations are authoritative.

# 117. Test Object Storage Strategy

Object storage tests should use separate buckets or equivalent isolated
namespaces per environment.

Test artifacts must not share production storage.

# 118. Test Queue Strategy

Each environment should use isolated queues/topics.

Messages from test environments must not reach production workers.

# 119. Test Network Strategy

Test environments should model:

- normal connectivity;
- latency;
- packet loss;
- disconnect;
- reconnect.

Simulation should be used before physical testing.

# 120. Test Environment Configuration

Configuration should be:

- version-controlled where safe;
- environment-specific;
- reproducible;
- documented.

Secrets are injected rather than committed.

# 121. Production-Like Testing

Before GA, staging should reproduce important production characteristics:

- authentication;
- authorization;
- database configuration;
- object storage behavior;
- queues;
- observability;
- deployment;
- migrations.

Provider-specific implementation details should remain isolated behind
infrastructure adapters.

# 122. Test Deployment

Deployments should be tested using:

    Build
      |
      v
    Deploy
      |
      v
    Migration
      |
      v
    Health Check
      |
      v
    Smoke Test
      |
      v
    E2E
      |
      v
    Qualification

# 123. Rollback Testing

Rollback must be tested for:

- application;
- configuration;
- database-compatible releases;
- Studio where practical;
- Lab Agent where practical.

Database rollback should not be assumed if migrations are destructive.

# 124. Canary Testing

Production rollout should support:

- internal;
- canary;
- pilot;
- limited GA;
- full GA.

Canary tests should validate critical workflows before broader rollout.

# 125. Synthetic Monitoring

Production synthetic tests may validate:

- login;
- project access;
- platform discovery;
- booking availability;
- non-destructive health operations.

Synthetic tests must not consume customer credits or operate physical robots
unless explicitly designed and approved.

# 126. Test Safety Boundary

The testing system must never:

- bypass emergency stop;
- bypass local safety interlocks;
- automatically restart unsafe robot motion;
- authorize physical motion solely because a cloud test passed.

# 127. Test Security Boundary

Test tooling must not:

- weaken production authentication;
- disable authorization globally;
- expose production secrets;
- upload source code intentionally;
- bypass artifact verification.

# 128. Test Review Integration

Every significant test change should be reviewed like production code.

Reviewers should verify:

- test intent;
- determinism;
- coverage value;
- false-positive risk;
- false-negative risk;
- cleanup;
- security;
- maintenance cost.

# 129. Testing and Code Review

Code review should ask:

- Which tests prove this change?
- Which failure modes are covered?
- Which existing tests changed?
- Why were tests not added if behavior changed?

A code change without appropriate tests requires justification.

# 130. Testing and Development Workflow

The development sequence is:

    Requirement
       |
       v
    Testable Acceptance Criteria
       |
       v
    Implementation
       |
       v
    Unit Tests
       |
       v
    Integration Tests
       |
       v
    Contract Tests
       |
       v
    E2E / Simulation
       |
       v
    Review
       |
       v
    CI
       |
       v
    Acceptance

# 131. Testing and Release Roadmap

Testing aligns with the release families:

- R0.1 Foundation;
- R0.2 Core Platform;
- R0.3 Artifact/Execution Foundation;
- R0.4 Integrated Simulation;
- R1.0 Alpha;
- R1.0 Beta;
- R1.0 RC;
- R1.0 GA;
- R1.1 Stabilization;
- R1.2 Platform and Operations Expansion;
- R2.0 Commercial and Ecosystem Expansion.

Each release must identify applicable test gates.

# 132. R0.1 Testing

R0.1 emphasizes engineering foundations.

Required:

- unit framework;
- CI;
- static analysis;
- formatting;
- basic security scanning;
- basic contract testing.

# 133. R0.2 Testing

R0.2 emphasizes Core Platform behavior.

Required:

- API tests;
- database tests;
- identity tests;
- authorization tests;
- project/platform tests;
- migration tests.

# 134. R0.3 Testing

R0.3 emphasizes artifact and execution foundations.

Required:

- local build tests;
- artifact tests;
- signing tests;
- compatibility tests;
- upload/download tests;
- execution contract tests.

# 135. R0.4 Testing

R0.4 emphasizes integrated simulation.

Required:

- simulated Lab Agent;
- simulated robot;
- complete execution flow;
- telemetry;
- logs;
- results;
- disconnect testing;
- primary E2E.

# 136. R1.0 Alpha Testing

Alpha requires:

- full product integration;
- broad automated suite;
- simulator qualification;
- security baseline;
- initial performance baseline.

Alpha may contain controlled known limitations.

# 137. R1.0 Beta Testing

Beta requires:

- stable E2E;
- tenant isolation;
- credits;
- booking;
- execution;
- results;
- performance;
- recovery;
- security qualification.

# 138. R1.0 RC Testing

RC requires:

- release candidate reproducibility;
- complete regression suite;
- migration qualification;
- compatibility validation;
- security qualification;
- operational readiness.

No unresolved critical defect is acceptable.

# 139. R1.0 GA Testing

GA requires:

- full qualification;
- release evidence;
- physical qualification where product scope requires it;
- rollback validation;
- production smoke tests;
- monitoring.

# 140. R1.1 Testing

R1.1 emphasizes:

- regression;
- reliability;
- defect fixes;
- operational stability;
- performance improvements.

# 141. R1.2 Testing

R1.2 emphasizes:

- multiple platforms;
- multiple labs;
- resource scaling;
- operational tooling;
- compatibility.

# 142. R2.0 Testing

R2.0 emphasizes:

- commercial workflows;
- subscriptions;
- billing;
- invoices;
- refunds;
- ecosystem integrations;
- scale;
- production resilience.

Financial tests receive strong consistency validation.

# 143. Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| Insufficient unit coverage | High | PR test gate |
| Contract drift | Critical | Contract tests |
| E2E instability | High | Deterministic environments |
| Simulator divergence | High | Contract + HIL |
| Physical defect | Critical | Progressive qualification |
| Tenant leakage | Critical | Cross-tenant tests |
| Credit corruption | Critical | Concurrent ledger tests |
| Booking conflict | Critical | Database exclusion/concurrency tests |
| Source leakage | Critical | Privacy tests |
| Artifact tampering | Critical | Signing tests |
| Performance regression | High | Baseline testing |
| Cloud failure | High | Chaos/recovery |
| Flaky tests | Medium | Mandatory remediation |
| Test environment drift | Medium | IaC/reproducibility |
| False confidence | High | Layered testing |

# 144. Risk-Based Test Prioritization

Priority should be based on:

    Impact
    x
    Likelihood
    x
    Detectability

Highest priority areas include:

- financial state;
- tenant isolation;
- source privacy;
- artifact trust;
- physical safety;
- booking conflicts;
- execution state.

# 145. Critical Test Invariants

The following must always hold:

1. One tenant cannot access another tenant's protected data.
2. Customer source code does not leave the local development boundary as part
   of the normal RaaS flow.
3. Invalid artifacts cannot execute.
4. Invalid signatures cannot execute.
5. Booking conflicts cannot create overlapping allocations.
6. Credit ledger transactions remain balanced.
7. Duplicate business requests do not corrupt state.
8. Job and Run history remains reconstructable.
9. Cloud failure does not create unsafe physical motion.
10. Physical safety remains locally authoritative.

# 146. Open Questions

The following remain implementation decisions:

1. Exact test framework for Studio frontend.
2. Exact Rust test framework conventions beyond standard tooling.
3. Exact API contract testing framework.
4. Exact E2E browser automation framework.
5. Exact simulator physics fidelity.
6. Exact HIL hardware matrix.
7. Exact performance thresholds per endpoint.
8. Exact security test tooling.
9. Exact chaos framework.
10. Exact CI execution topology.
11. Exact test artifact retention.
12. Exact production synthetic transaction design.
13. Exact physical robot qualification matrix.
14. Exact minimum coverage thresholds.
15. Exact test ownership mapping.

These questions do not weaken the mandatory testing principles defined here.

# 147. Full Acceptance Criteria — Strategy

- [ ] Product-wide testing strategy is documented.
- [ ] Test pyramid is defined.
- [ ] Test ownership is defined.
- [ ] Test environments are defined.
- [ ] Test classifications are defined.
- [ ] Test data principles are defined.
- [ ] Quality gates are defined.
- [ ] Release testing is defined.

# 148. Full Acceptance Criteria — Unit and Component

- [ ] Unit testing is implemented.
- [ ] Component testing is implemented.
- [ ] Tests are deterministic.
- [ ] Error paths are covered.
- [ ] State transitions are covered.
- [ ] Boundary conditions are covered.
- [ ] Regression tests are added for defects.

# 149. Full Acceptance Criteria — Contracts

- [ ] REST contracts are tested.
- [ ] WebSocket contracts are tested.
- [ ] Event contracts are tested.
- [ ] Lab Agent contracts are tested.
- [ ] Runtime contracts are tested.
- [ ] Compatibility is tested.
- [ ] Invalid versions are tested.
- [ ] Duplicate events are tested.

# 150. Full Acceptance Criteria — Integration

- [ ] PostgreSQL integration tests exist.
- [ ] Object storage integration tests exist.
- [ ] Queue integration tests exist.
- [ ] Authentication integration tests exist.
- [ ] Authorization integration tests exist.
- [ ] Transaction tests exist.
- [ ] Migration tests exist.
- [ ] Reconciliation tests exist.

# 151. Full Acceptance Criteria — E2E

- [ ] Login flow is tested.
- [ ] Project creation is tested.
- [ ] Platform selection is tested.
- [ ] Local build is tested.
- [ ] Artifact generation is tested.
- [ ] Booking is tested.
- [ ] Job execution is tested.
- [ ] Live execution is tested.
- [ ] Results are tested.
- [ ] Rerun is tested.

# 152. Full Acceptance Criteria — Simulation

- [ ] Simulated Lab Agent exists.
- [ ] Simulated resource exists.
- [ ] Simulated robot exists.
- [ ] Telemetry is simulated.
- [ ] Logs are simulated.
- [ ] Video path is simulated.
- [ ] Network failure is injectable.
- [ ] Runtime failure is injectable.
- [ ] Artifact rejection is injectable.
- [ ] Simulation is reproducible.

# 153. Full Acceptance Criteria — HIL

- [ ] HIL environment is defined.
- [ ] Hardware interfaces are tested.
- [ ] Firmware interaction is tested.
- [ ] Timing is tested.
- [ ] Sensor paths are tested.
- [ ] Actuator paths are tested.
- [ ] Fault behavior is tested.
- [ ] Emergency stop is available.
- [ ] Human safety procedure exists.

# 154. Full Acceptance Criteria — Physical

- [ ] Physical qualification procedure exists.
- [ ] Approved robot is identified.
- [ ] Approved artifact is identified.
- [ ] Operator is identified.
- [ ] Safety boundary is established.
- [ ] Emergency stop is verified.
- [ ] Startup is tested.
- [ ] Shutdown is tested.
- [ ] Fault handling is tested.
- [ ] Communication loss is tested.
- [ ] Human safety approval is recorded.

# 155. Full Acceptance Criteria — Performance

- [ ] API baseline exists.
- [ ] Database baseline exists.
- [ ] Booking performance is measured.
- [ ] Credit performance is measured.
- [ ] Job scheduling performance is measured.
- [ ] Studio performance is measured.
- [ ] Load testing exists.
- [ ] Stress testing exists.
- [ ] Soak testing exists.
- [ ] Capacity limits are documented.

# 156. Full Acceptance Criteria — Security

- [ ] SAST is enabled.
- [ ] Dependency scanning is enabled.
- [ ] Secret scanning is enabled.
- [ ] Authentication tests exist.
- [ ] Authorization tests exist.
- [ ] Tenant isolation tests exist.
- [ ] Artifact security tests exist.
- [ ] Source privacy tests exist.
- [ ] Security regression tests exist.
- [ ] Security qualification is part of release readiness.

# 157. Full Acceptance Criteria — Chaos and Recovery

- [ ] Database outage is tested.
- [ ] Queue outage is tested.
- [ ] Object storage outage is tested.
- [ ] Worker failure is tested.
- [ ] Lab Agent disconnect is tested.
- [ ] Runtime crash is tested.
- [ ] Network partition is tested.
- [ ] Recovery is tested.
- [ ] Reconciliation is tested.
- [ ] Unsafe automatic recovery is prohibited.

# 158. Full Acceptance Criteria — Data

- [ ] Test data is isolated.
- [ ] Test tenants are isolated.
- [ ] Production data is protected.
- [ ] Test secrets are isolated.
- [ ] Test object storage is isolated.
- [ ] Test queues are isolated.
- [ ] Test data cleanup exists.
- [ ] Test artifacts have retention rules.

# 159. Full Acceptance Criteria — CI

- [ ] Clean checkout works.
- [ ] Dependencies are reproducible.
- [ ] Formatting passes.
- [ ] Lint passes.
- [ ] Typechecking passes.
- [ ] Unit tests pass.
- [ ] Component tests pass.
- [ ] Contract tests pass.
- [ ] Integration tests pass.
- [ ] Security scans pass.
- [ ] Build passes.
- [ ] E2E smoke passes.

# 160. Full Acceptance Criteria — Quality Gates

- [ ] Phase 0 gate is implemented.
- [ ] Phase 1 gate is implemented.
- [ ] Phase 2 gate is implemented.
- [ ] Phase 3 gate is implemented.
- [ ] Phase 4 gate is implemented.
- [ ] Phase 5 gate is implemented.
- [ ] Phase 6 gate is implemented.
- [ ] Phase 7 gate is implemented.
- [ ] Phase 8 gate is implemented.

# 161. Final Testing Invariants

The following invariants govern the entire testing strategy:

1. Every production behavior has an appropriate verification layer.
2. Every significant boundary has a contract test.
3. Every critical business invariant has an integration test.
4. Every primary user journey has an E2E test.
5. Every execution path is validated in simulation before physical testing.
6. Every physical deployment is subject to human safety controls.
7. Every security boundary is tested explicitly.
8. Every financial invariant is tested under concurrency.
9. Every tenant boundary is tested for unauthorized access.
10. Every artifact trust decision is tested.
11. Every important failure mode has a recovery strategy.
12. Every release has objective qualification evidence.
13. Flaky tests are treated as defects.
14. Production customer data is not the default test data.
15. Test environments are isolated.
16. Test evidence is retained appropriately.
17. Automated testing enforces repeatable quality gates.
18. Human judgment remains necessary for architecture, security, and safety.
19. Testing never overrides physical safety.
20. A release is accepted only when its required quality gates are satisfied.

# 162. Final Product Test Architecture

The complete verification architecture is:

    +------------------------------------------------------------+
    |                    Product Requirements                    |
    +------------------------------+-----------------------------+
                                   |
                                   v
    +------------------------------------------------------------+
    |                     Acceptance Criteria                    |
    +------------------------------+-----------------------------+
                                   |
                  +----------------+----------------+
                  |                                 |
                  v                                 v
        +-------------------+             +-------------------+
        | Automated Tests   |             | Human Review      |
        +-------------------+             +-------------------+
                  |
                  v
        +-------------------+
        | Unit / Component  |
        +-------------------+
                  |
                  v
        +-------------------+
        | Contract Tests    |
        +-------------------+
                  |
                  v
        +-------------------+
        | Integration Tests |
        +-------------------+
                  |
                  v
        +-------------------+
        | E2E / Simulation  |
        +-------------------+
                  |
                  v
        +-------------------+
        | HIL               |
        +-------------------+
                  |
                  v
        +-------------------+
        | Physical Robot    |
        +-------------------+
                  |
                  v
        +-------------------+
        | Release Qualify   |
        +-------------------+

# 163. Final Principle

> Kritva RaaS testing shall provide layered, evidence-based verification from
> individual functions through complete product workflows and, where
> applicable, real robotic hardware. The majority of defects should be
> detected through fast unit, component, contract and integration tests, while
> E2E and simulated-lab tests validate complete product behavior. Hardware-
> in-the-loop and physical testing shall be reserved for behaviors that require
> real hardware and shall always operate under explicit safety controls.
> Security, tenant isolation, source-code privacy, artifact integrity, booking,
> credits, execution state and result integrity are mandatory test concerns.
> Performance, chaos, recovery and compatibility testing shall be introduced
> according to product maturity and release risk. Every phase from Phase 0
> through Phase 8 shall have explicit quality gates, and every release shall
> retain objective qualification evidence. The testing strategy therefore
> provides a continuous verification chain from requirement to implementation,
> from implementation to integrated behavior, and from simulation to safe
> physical execution.
