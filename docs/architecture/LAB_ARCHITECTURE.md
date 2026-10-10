# Kritva RaaS Lab Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Lab Architecture |
| Path | `docs/architecture/LAB_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service (RaaS) |
| Primary Boundary | Cloud Control Plane ↔ Lab |
| Lab-Side Components | Lab Agent, Kritva Runtime, Robot |
| Execution Model | Artifact-based remote execution |
| Control Model | Cloud-coordinated, locally executed |
| Safety Model | Local robot safety is authoritative |
| Network Model | Secure outbound lab connectivity preferred |
| Status | Architecture Baseline |

## 2. Purpose

This document defines the production-grade architecture for the Kritva RaaS laboratory
environment.

The lab is the boundary between the cloud-based RaaS Control Plane and the physical or
simulated robotic execution environment.

The lab architecture provides the mechanisms required to:

- register a lab;
- register Lab Agents;
- authenticate Lab Agents;
- discover robot resources;
- report capabilities;
- report health;
- receive authorized execution work;
- obtain validated `.krv` artifacts;
- deploy artifacts;
- start and stop applications;
- observe execution;
- collect telemetry;
- provide live video;
- collect logs;
- collect results;
- handle network failures;
- reconcile execution state;
- enforce local policy;
- preserve robot safety boundaries.

The central architectural principle is:

    Cloud
      |
      | coordination / authorization
      v
    Lab Agent
      |
      | local control
      v
    Kritva Runtime
      |
      | execution
      v
    Robot

The cloud does not directly control motors, safety actuators, or hard real-time control
loops.

## 3. Scope

This document covers:

1. Lab topology.
2. Lab Agent architecture.
3. Kritva Runtime integration.
4. Robot integration.
5. Agent registration.
6. Agent authentication.
7. Heartbeats.
8. Resource discovery.
9. Capability reporting.
10. Platform identification.
11. Artifact download.
12. Artifact validation.
13. Deployment.
14. Application execution.
15. Stop/cancel behavior.
16. Logs.
17. Telemetry.
18. Video.
19. Result collection.
20. Offline handling.
21. Reconnection.
22. State reconciliation.
23. Safety boundaries.
24. Lab isolation.
25. Multi-lab operation.
26. Simulation support.
27. Lab observability.
28. Phase 0-8 mapping.

## 4. Goals

The lab architecture shall:

1. Provide a secure cloud-to-lab boundary.
2. Prevent direct Internet exposure of robot networks.
3. Provide authenticated Lab Agents.
4. Discover lab resources automatically.
5. Report robot/platform capabilities.
6. Validate artifacts before execution.
7. Execute only authorized jobs.
8. Keep real-time control local.
9. Preserve physical safety independence.
10. Support telemetry and live observation.
11. Support video streaming without making video a control channel.
12. Tolerate temporary network outages.
13. Reconcile state after reconnection.
14. Support multiple labs.
15. Support physical and simulated resources.
16. Provide clear operational state.
17. Prevent cross-lab authorization leakage.
18. Provide auditable execution.
19. Support future robot platforms without redesigning the control plane.

## 5. Non-Goals

The lab architecture does not attempt to:

- replace robot firmware;
- replace a robot safety controller;
- replace physical emergency stop systems;
- execute cloud-based hard real-time motor control;
- expose robot networks directly to the Internet;
- make the Lab Agent a general-purpose remote shell;
- permit arbitrary cloud commands to robot hardware;
- store all telemetry indefinitely;
- make WebRTC/video a control mechanism;
- assume cloud connectivity is always available;
- treat a cloud `STOP` request as a physical emergency stop.

## 6. Architectural Principles

The lab architecture follows these principles:

1. Local execution.
2. Cloud coordination.
3. Explicit authorization.
4. Secure lab boundary.
5. Least privilege.
6. Local safety authority.
7. Artifact immutability.
8. Capability-driven scheduling.
9. Explicit state transitions.
10. Idempotent commands.
11. Reconciliation after failure.
12. Observable execution.
13. Per-lab isolation.
14. No direct robot Internet exposure.
15. No cloud dependency for local safety.

## 7. High-Level Topology

    +-------------------------------------------------------------+
    |                         Cloud                               |
    |                                                             |
    |  RaaS Control Plane                                         |
    |       |                                                     |
    |       +--> Scheduler                                       |
    |       +--> Job Service                                     |
    |       +--> Artifact Service                                |
    |       +--> Result Service                                  |
    |       +--> Lab Service                                     |
    |       +--> Realtime Service                                |
    |                                                             |
    +---------------------------+---------------------------------+
                                |
                         Secure Lab Protocol
                                |
                         Outbound Connection
                                |
    +---------------------------v---------------------------------+
    |                           LAB                              |
    |                                                             |
    |   +------------------+                                     |
    |   |   Lab Agent      |                                     |
    |   |                  |                                     |
    |   | Registration     |                                     |
    |   | Heartbeat        |                                     |
    |   | Resource Manager |                                     |
    |   | Artifact Manager |                                     |
    |   | Deployment       |                                     |
    |   | Telemetry        |                                     |
    |   | Video Gateway    |                                     |
    |   +--------+---------+                                     |
    |            |                                                |
    |            v                                                |
    |   +------------------+                                     |
    |   | Kritva Runtime   |                                     |
    |   +--------+---------+                                     |
    |            |                                                |
    |            v                                                |
    |   +------------------+                                     |
    |   | Robot / Simulator|                                     |
    |   +------------------+                                     |
    |                                                             |
    +-------------------------------------------------------------+

## 8. Lab Trust Boundary

The Lab Agent is the primary cloud-to-lab trust boundary.

The cloud should communicate with the Lab Agent rather than directly with robot
controllers.

The Lab Agent controls which operations may cross into the lab.

Conceptually:

    Internet / Cloud
          |
          X
    Robot Network
          |
          ^
          |
    Lab Agent

The Lab Agent must not become an unrestricted bridge between cloud and robot networks.

## 9. Lab Components

A production lab may contain:

| Component | Responsibility |
|---|---|
| Lab Agent | Cloud-facing orchestration boundary |
| Kritva Runtime | Application execution environment |
| Robot Controller | Robot-specific control |
| Robot Hardware | Physical robot |
| Safety Controller | Local safety |
| Sensors | Perception/input |
| Actuators | Motion/output |
| Camera System | Video |
| Network | Local communication |
| Local Storage | Artifact/cache/log storage |

The exact topology varies by robot platform.

## 10. Lab Agent

The Lab Agent is a privileged but constrained service running inside the lab.

Responsibilities include:

- secure registration;
- cloud authentication;
- heartbeat;
- capability discovery;
- resource discovery;
- artifact retrieval;
- artifact verification;
- deployment coordination;
- execution coordination;
- telemetry collection;
- log collection;
- result collection;
- video integration;
- local policy enforcement;
- state reconciliation.

The Lab Agent does not implement application business logic.

## 11. Kritva Runtime

Kritva Runtime is the local execution environment for a Kritva application.

It is responsible for:

- loading the approved artifact;
- starting the application;
- providing runtime interfaces;
- connecting to robot services;
- exposing local execution status;
- enforcing runtime-level resource policies;
- collecting execution state;
- stopping the application safely according to platform policy.

The runtime is local to the robot or robot execution host.

## 12. Robot Integration

Robot integration provides the mapping between Kritva Runtime and physical hardware.

A robot may expose:

- sensors;
- actuators;
- motor controllers;
- encoders;
- cameras;
- IMU;
- networking;
- EtherCAT;
- CAN;
- SPI;
- I2C;
- serial;
- GPIO.

The RaaS cloud does not need to understand each low-level interface.

The platform integration layer abstracts these details into platform capabilities.

## 13. Robot Platform Identity

Each execution resource must identify:

- platform ID;
- platform version;
- runtime version;
- architecture;
- operating environment;
- capability set.

Example:

    platform_id = humanoid-a
    platform_version = 1.2
    architecture = arm64
    runtime_version = kritva-runtime-1.0

## 14. Resource Model

A resource is an executable target.

Examples:

- physical humanoid;
- mobile robot;
- robotic arm;
- simulation instance;
- test fixture.

A lab may contain multiple resources.

    Lab
      |
      +--> Resource A
      +--> Resource B
      +--> Resource C

Each resource must have a unique identity within the RaaS system.

## 15. Resource State

Recommended resource states:

    UNKNOWN
    OFFLINE
    INITIALIZING
    AVAILABLE
    RESERVED
    DEPLOYING
    RUNNING
    STOPPING
    FAULT
    MAINTENANCE

The exact state machine may be extended for platform-specific requirements.

## 16. Resource Capability Model

Capabilities should describe what a resource supports.

Examples:

    motion
    camera
    lidar
    imu
    force_sensor
    navigation
    manipulation
    ethercat
    ros2
    gpu
    ai_acceleration

Capabilities should be machine-readable.

Example:

    {
        "resource_id": "robot-001",
        "platform_id": "humanoid-a",
        "architecture": "arm64",
        "capabilities": [
            "motion",
            "camera",
            "imu",
            "ethercat"
        ]
    }

## 17. Capability Versioning

Capabilities may have versions.

Example:

    camera:2
    motion:3
    navigation:1

Capability changes must be visible to the Control Plane.

A job must not execute if required capabilities are unavailable.

## 18. Agent Registration

Lab Agent registration establishes trust between a new agent and the Control Plane.

Conceptual flow:

    Lab Agent
       |
       | registration request
       v
    Control Plane
       |
       +--> Validate registration
       +--> Assign agent identity
       +--> Associate lab
       +--> Issue credentials
       |
       v
    Registered Agent

Registration must not automatically grant access to every lab resource.

## 19. Agent Identity

Every Lab Agent must have a unique identity.

The identity should include:

- agent ID;
- lab ID;
- credential/certificate identity;
- software version;
- registration timestamp;
- status.

Credentials should be stored securely on the Lab Agent.

## 20. Agent Authentication

Recommended mechanisms include:

- mutual TLS;
- certificate-based identity;
- short-lived access tokens;
- hardware-backed identity where available.

The exact mechanism depends on deployment requirements.

Authentication must establish:

    Who is this agent?
    Which lab does it belong to?
    Is it currently authorized?

## 21. Agent Authorization

Authentication does not imply authorization.

The Control Plane must determine:

- which lab the agent belongs to;
- which resources it may manage;
- which commands it may receive;
- whether it is enabled;
- whether it is revoked.

A revoked agent must not receive new jobs.

## 22. Agent Credential Rotation

Agent credentials must support rotation.

Rotation should allow:

1. new credential issuance;
2. secure installation;
3. validation;
4. old credential revocation;
5. continued operation where possible.

Credential rotation should not require physical robot access for every routine renewal
if the lab deployment permits secure remote renewal.

## 23. Agent Heartbeat

The Lab Agent periodically sends heartbeat information.

Heartbeat should contain:

- agent ID;
- timestamp;
- software version;
- health;
- connected resource count;
- active execution count;
- resource summary;
- protocol version.

Conceptually:

    Agent
      |
      | heartbeat
      v
    Control Plane
      |
      v
    agent.last_heartbeat

## 24. Heartbeat State

The Control Plane should classify agents as:

| State | Meaning |
|---|---|
| ONLINE | Recent heartbeat |
| DEGRADED | Heartbeat present but health degraded |
| STALE | Heartbeat exceeds threshold |
| OFFLINE | Agent unavailable |
| REVOKED | Agent no longer trusted |
| MAINTENANCE | Intentionally unavailable |

Exact thresholds are configurable.

## 25. Heartbeat Failure

Heartbeat loss must not automatically issue a physical stop command.

Instead:

1. Mark agent stale/offline.
2. Prevent new allocations.
3. Mark active executions as uncertain if required.
4. Preserve last known state.
5. Attempt reconnection/reconciliation.
6. Apply local lab safety policy independently.

## 26. Resource Discovery

The Lab Agent discovers local resources.

Discovery may use:

- static configuration;
- Kritva Runtime APIs;
- platform adapters;
- hardware discovery;
- robot management APIs.

The agent reports normalized resource information to the Control Plane.

## 27. Discovery Data

Resource discovery should identify:

- resource ID;
- platform;
- platform version;
- runtime version;
- architecture;
- capabilities;
- state;
- health;
- maintenance status;
- software versions.

## 28. Discovery Reconciliation

Discovery is not a one-time registration event.

The agent periodically reconciles:

    Local Reality
         |
         v
    Resource Discovery
         |
         v
    Control Plane State

Changes such as:

- robot replacement;
- firmware update;
- capability change;
- resource removal;
- maintenance;

must become visible.

## 29. Resource Registration

The Control Plane creates or updates resource records based on authorized agent
reports.

A resource must not become schedulable merely because the agent reports it.

The Control Plane must also evaluate:

- platform status;
- lab status;
- maintenance state;
- authorization;
- compatibility.

## 30. Lab Resource Availability

Availability is determined from:

    Resource Health
        +
    Agent Health
        +
    Maintenance
        +
    Existing Bookings
        +
    Active Allocations
        +
    Platform Policy

A resource with a healthy robot but offline agent is not available for cloud execution.

## 31. Artifact Execution Boundary

The cloud sends an execution artifact, not customer source code.

Normal flow:

    Customer Source
         |
         | local
         v
    Local Build
         |
         v
    Signed .krv
         |
         v
    Cloud
         |
         v
    Lab Agent
         |
         v
    Kritva Runtime

## 32. Artifact Authorization

Before an artifact reaches the Lab Agent, the Control Plane validates:

- user authorization;
- organization ownership;
- project;
- booking;
- platform;
- architecture;
- runtime compatibility;
- artifact status;
- signature;
- checksum.

The Lab Agent must independently verify critical integrity information.

## 33. Artifact Download

The Lab Agent obtains an authorized artifact from object storage.

Preferred flow:

    Lab Agent
       |
       | request artifact authorization
       v
    Control Plane
       |
       v
    Short-lived object access
       |
       v
    Object Storage
       |
       v
    Lab Agent local cache

The artifact should not require the Control Plane API to proxy the entire binary.

## 34. Artifact Integrity

After download, the Lab Agent must verify:

- expected size;
- checksum;
- signature;
- artifact format;
- compatibility metadata.

An integrity failure must prevent deployment.

## 35. Artifact Cache

The Lab Agent may cache artifacts locally.

Cache policy should consider:

- disk capacity;
- artifact size;
- frequency of use;
- artifact retention;
- security;
- expiration;
- revocation.

Cached artifacts must not bypass authorization.

## 36. Artifact Revocation

If artifacts can be revoked, the Lab Agent must check revocation/validity information
before execution.

A previously downloaded artifact must not automatically remain executable forever.

## 37. Deployment Model

Deployment converts an approved artifact into an executable local runtime instance.

Conceptually:

    Artifact
       |
       v
    Validate
       |
       v
    Stage
       |
       v
    Configure
       |
       v
    Prepare
       |
       v
    Ready
       |
       v
    Start

## 38. Deployment Isolation

Each job should execute in an isolated runtime context.

Isolation may use:

- process isolation;
- container isolation;
- dedicated runtime directory;
- namespace isolation;
- resource limits;
- platform-specific sandboxing.

The exact mechanism depends on robot OS and runtime architecture.

## 39. Local Filesystem

The Lab Agent should maintain controlled directories.

Conceptually:

    /var/lib/kritva/
        agent/
        cache/
        artifacts/
        jobs/
        results/
        logs/

Exact paths are platform-specific.

The application must not receive unrestricted access to the Lab Agent's filesystem.

## 40. Runtime Filesystem Policy

The Kritva Runtime should expose only required paths to the application.

Sensitive directories such as:

- agent credentials;
- system configuration;
- other customers' artifacts;
- unrelated job data;

must remain inaccessible.

## 41. Deployment Configuration

A job may require configuration such as:

- environment variables;
- platform parameters;
- runtime options;
- sensor configuration;
- execution limits.

Configuration must be validated against the platform policy.

Arbitrary privileged configuration must not be accepted from untrusted job input.

## 42. Execution Start

Execution should follow:

    CREATED
       |
       v
    VALIDATING
       |
       v
    ALLOCATING
       |
       v
    DEPLOYING
       |
       v
    STARTING
       |
       v
    RUNNING

The Lab Agent reports each meaningful transition.

## 43. Execution Stop

A normal stop follows:

    RUNNING
       |
       v
    STOPPING
       |
       v
    STOPPED / COMPLETED

Stop behavior is platform-specific.

The Lab Agent must distinguish:

- application stop;
- job cancellation;
- robot fault;
- safety stop;
- physical E-stop.

## 44. Cloud Stop Command

A cloud `job.stop` command requests the Lab Agent to stop the application.

It is not a physical emergency-stop command.

The Lab Agent must execute the request according to local policy and runtime state.

## 45. Job Cancellation

Cancellation means the RaaS system no longer wants the job to continue.

If execution has already begun, cancellation may result in:

    CANCEL_REQUESTED
          |
          v
    LOCAL STOP PROCEDURE
          |
          v
    CANCELLED

The final state must reflect what actually happened.

## 46. Safety Boundary

Safety-critical behavior remains local.

The following remain authoritative:

- physical E-stop;
- safety PLC/controller;
- robot safety firmware;
- motor driver protection;
- local motion limits;
- collision protection;
- local watchdogs.

Cloud services must never be required for these protections.

## 47. Safety State

The Lab Agent should report a safety-related state when available.

Examples:

    SAFE
    LIMITED
    SAFETY_STOP
    FAULT
    UNKNOWN

Safety state is informational to the Control Plane unless the platform contract
explicitly defines safe cloud-coordinated actions.

## 48. Safety Stop Handling

If the robot enters a safety stop:

1. Runtime execution state is updated.
2. Lab Agent reports the condition.
3. Control Plane marks the run appropriately.
4. New execution may be blocked.
5. Physical recovery remains local.
6. Cloud must not attempt to override the safety controller.

## 49. Local Watchdogs

Where required, robot execution should have local watchdogs.

A watchdog may stop or limit execution if:

- runtime becomes unresponsive;
- heartbeat with the local controller is lost;
- safety constraints are violated;
- control-loop deadlines are missed.

This is independent of cloud heartbeat.

## 50. Cloud Heartbeat vs Robot Watchdog

These are distinct:

    Cloud Heartbeat
        |
        v
    "Is the Lab Agent reachable?"

    Local Watchdog
        |
        v
    "Is robot execution safe and responsive?"

Loss of cloud heartbeat must not be treated as equivalent to loss of a local safety
watchdog.

## 51. Real-Time Control

Hard real-time loops must remain local.

Examples:

- motor control;
- EtherCAT cycles;
- encoder processing;
- actuator loops;
- safety response.

The cloud is unsuitable for deterministic sub-millisecond control.

## 52. Kritva Runtime Boundary

The Kritva Runtime should provide stable APIs to the application.

Conceptually:

    Kritva Application
          |
          v
    Kritva Runtime API
          |
          +--> Sensors
          +--> Motion
          +--> Robot State
          +--> Networking
          +--> Time
          +--> Configuration
          |
          v
    Platform Adapter
          |
          v
    Robot Hardware

## 53. Runtime Version Compatibility

The Lab Agent must report runtime version.

The Control Plane must verify:

    artifact.runtime_version
              compatible with
    resource.runtime_version

Compatibility must be explicit.

## 54. Platform Adapter

The platform adapter translates generic Kritva Runtime interfaces into robot-specific
implementation.

Examples:

    Generic Motion API
          |
          v
    Humanoid-A Adapter
          |
          v
    Robot Controller

This keeps the Control Plane independent of robot hardware details.

## 55. Robot Hardware Abstraction

The application should interact with capabilities rather than raw hardware whenever
possible.

For example:

    motion.set_joint_target(...)

rather than exposing:

    /dev/raw_motor_controller

to the remote application by default.

## 56. Device Access Policy

Direct hardware access should require explicit platform authorization.

Examples:

- GPIO;
- SPI;
- I2C;
- serial;
- CAN;
- EtherCAT.

The runtime must restrict access to approved devices and interfaces.

## 57. Network Access Policy

Remote applications should not receive unrestricted network access.

The runtime may provide:

- allowed service endpoints;
- local robot APIs;
- approved cloud services;
- platform network interfaces.

Outbound network policy should be explicit.

## 58. Execution Resource Limits

The Lab Agent/Runtime should enforce limits such as:

- CPU;
- memory;
- disk;
- process count;
- network;
- execution duration;
- device access.

Limits prevent one application from destabilizing a shared lab resource.

## 59. Resource Allocation

Before deployment:

    Control Plane
        |
        v
    Resource Allocation
        |
        v
    Lab Agent
        |
        v
    Runtime

The resource must remain allocated until the run is safely completed or released.

## 60. Allocation Ownership

Every allocation should identify:

- job ID;
- run ID;
- resource ID;
- organization;
- start time;
- allocation state.

This enables reconciliation after failures.

## 61. Resource Locking

A resource may have only one incompatible active execution allocation.

The Control Plane is authoritative for cloud scheduling.

The Lab Agent is the final local enforcement point.

Both layers should prevent unsafe simultaneous deployment.

## 62. Telemetry Architecture

Telemetry is divided into:

1. Runtime telemetry.
2. Robot telemetry.
3. Resource telemetry.
4. Lab Agent health telemetry.
5. Application metrics.

Conceptually:

    Robot / Runtime
         |
         v
    Lab Agent Collector
         |
         +--> Filter
         +--> Normalize
         +--> Buffer
         |
         v
    Cloud Telemetry Path
         |
         v
    RaaS

## 63. Telemetry Categories

Examples:

- CPU;
- memory;
- temperature;
- battery;
- joint state;
- velocity;
- sensor status;
- network status;
- runtime state;
- application metrics.

High-frequency raw signals should be locally sampled and aggregated where necessary.

## 64. Telemetry Rate Control

The Lab Agent must prevent telemetry from overwhelming:

- lab network;
- cloud network;
- Control Plane;
- database.

Policies may include:

- sampling;
- aggregation;
- compression;
- batching;
- priority;
- dropping non-critical samples.

## 65. Telemetry Persistence

Not all telemetry must be stored permanently.

The system may retain:

- live telemetry;
- summarized metrics;
- selected execution traces;
- full telemetry exports when requested.

The storage architecture may evolve independently from the transactional database.

## 66. Telemetry Failure

Telemetry loss should not automatically terminate robot execution.

Execution and observation are separate paths.

However, safety-critical local monitoring must remain independent of cloud telemetry.

## 67. Live Telemetry

The Control Plane may expose live telemetry to Studio through WebSocket.

Flow:

    Robot
      |
      v
    Lab Agent
      |
      v
    Realtime Service
      |
      v
    WebSocket
      |
      v
    Studio

WebSocket state is not authoritative history.

## 68. Video Architecture

Video is an observation stream.

Preferred architecture:

    Camera
      |
      v
    Local Video Pipeline
      |
      v
    Lab Agent / Media Gateway
      |
      v
    WebRTC / Approved Streaming Path
      |
      v
    Studio

The video channel must not be used for command/control.

## 69. Video Locality

Video should be processed as close to the camera as practical.

The lab may perform:

- encoding;
- resolution selection;
- frame-rate selection;
- bitrate control;
- stream selection.

This reduces unnecessary bandwidth.

## 70. Video Authorization

Only authorized users with access to the relevant job/run should receive the stream.

The Lab Agent should not expose a publicly accessible camera endpoint.

## 71. Video Failure

If video fails:

- execution may continue;
- the Control Plane reports video unavailable;
- local safety remains unaffected;
- the user can still inspect telemetry/logs where available.

If a specific application requires video as a declared runtime dependency, the platform
policy may choose to stop that application.

## 72. Logs

Logs are collected from:

- Lab Agent;
- Kritva Runtime;
- application;
- platform adapter.

Logs should include:

    timestamp
    severity
    component
    job_id
    run_id
    resource_id
    correlation_id
    message

Secrets and sensitive credentials must be filtered.

## 73. Log Streaming

Live logs may flow:

    Application
        |
        v
    Runtime
        |
        v
    Lab Agent
        |
        v
    WebSocket / Log Service
        |
        v
    Studio

Logs should also be persisted according to retention policy.

## 74. Local Log Buffering

The Lab Agent should buffer logs during temporary network outages.

The buffer must have bounded size.

When full, policy should prioritize:

- errors;
- warnings;
- lifecycle events;

over verbose debug output.

## 75. Result Collection

At completion:

    Runtime
       |
       v
    Lab Agent
       |
       +--> result metadata
       +--> result files
       +--> logs
       +--> metrics
       |
       v
    Cloud
       |
       v
    Result Service

Large result files should be uploaded to object storage.

## 76. Result Integrity

Results should include:

- checksum;
- size;
- content type;
- creation timestamp;
- run ID;
- artifact ID where relevant.

The Control Plane records authoritative result metadata.

## 77. Execution State Authority

During execution:

- Control Plane owns business job state.
- Lab Agent owns local execution state.
- Kritva Runtime owns process/runtime state.
- Robot controller owns hardware state.
- Safety controller owns safety state.

These authorities must not be conflated.

## 78. State Synchronization

Conceptually:

    Control Plane
         |
         | command
         v
    Lab Agent
         |
         | local command
         v
    Runtime
         |
         v
    Robot

and:

    Robot
         |
         v
    Runtime
         |
         v
    Lab Agent
         |
         | state/event
         v
    Control Plane

## 79. Command Model

Lab commands should use a common protocol envelope.

Conceptually:

    {
        "protocol_version": "1.0",
        "request_id": "req-123",
        "command": "job.start",
        "job_id": "job-123",
        "run_id": "run-123",
        "payload": {}
    }

The actual wire contract is defined by the protocol architecture.

## 80. Command Idempotency

Commands with side effects must be idempotent where practical.

Examples:

- artifact fetch;
- deployment prepare;
- deployment start;
- job start;
- job stop;
- job cancel;
- resource lock;
- resource release.

Duplicate command delivery must not create duplicate executions.

## 81. Command Acknowledgement

The Lab Agent should distinguish:

    RECEIVED
    ACCEPTED
    REJECTED
    IN_PROGRESS
    COMPLETED
    FAILED

Receipt does not mean successful execution.

## 82. Asynchronous Execution

Long-running operations must be asynchronous.

Example:

    job.start
       |
       v
    ACCEPTED
       |
       v
    deployment
       |
       v
    starting
       |
       v
    running
       |
       v
    completed

The cloud must not hold a synchronous request open for the duration of a robot run.

## 83. Lab Protocol Versioning

Every protocol message should identify its protocol version.

Compatibility should account for:

- protocol version;
- Lab Agent version;
- runtime version;
- platform version;
- artifact format.

Breaking protocol changes require explicit version management.

## 84. Protocol Compatibility

A Lab Agent should advertise:

    protocol_version
    supported_commands
    agent_version

The Control Plane should avoid sending unsupported commands.

## 85. Offline Mode

The lab must tolerate temporary loss of cloud connectivity.

Offline behavior includes:

- continue active execution where safe;
- preserve local execution state;
- buffer telemetry/logs within limits;
- prevent unauthorized new jobs;
- maintain local safety;
- reconnect automatically;
- reconcile state.

## 86. New Job Policy While Offline

If the Lab Agent cannot authenticate current cloud authorization, it should not accept
new cloud jobs.

Local offline execution may be permitted only if explicitly configured as a separate
trusted operating mode.

Default RaaS behavior should be:

    Cloud Offline
        |
        v
    No New Remote Jobs

## 87. Active Job During Offline

An active job may continue according to local execution policy.

The Lab Agent must not automatically terminate a running application merely because
cloud connectivity is temporarily lost unless the platform's safety/execution policy
requires it.

## 88. Offline Buffering

The Lab Agent may buffer:

- lifecycle events;
- logs;
- telemetry summaries;
- result metadata.

Buffer limits must prevent disk exhaustion.

## 89. Reconnection

After reconnection:

    Lab Agent
       |
       v
    Authenticate
       |
       v
    Report current state
       |
       v
    Control Plane reconciliation
       |
       +--> Active jobs
       +--> Resources
       +--> Results
       +--> Logs
       +--> Telemetry
       |
       v
    Consistent State

## 90. Reconciliation Rules

Reconciliation must prefer observed local execution state over assumptions.

Examples:

    Cloud says RUNNING
    Lab says STOPPED

The Control Plane must record the discrepancy and converge to the actual state.

## 91. Reconciliation Safety

Reconciliation must not blindly issue:

- restart;
- stop;
- redeploy;

without validating current state and authorization.

The purpose of reconciliation is state convergence, not automatic command replay.

## 92. Agent Restart

After Lab Agent restart:

1. Load persistent local state.
2. Authenticate.
3. Discover resources.
4. Discover active runtime instances.
5. Report state.
6. Reconcile jobs.
7. Resume telemetry/log collection.
8. Continue or safely recover execution according to local policy.

## 93. Runtime Restart

If Kritva Runtime restarts:

- active process state must be detected;
- job state must be reconciled;
- the application must not accidentally start twice;
- local runtime policy determines whether restart is permitted.

## 94. Robot Restart

Robot restart is a platform-specific event.

The Lab Agent must detect:

- robot offline;
- reboot;
- safety state;
- runtime availability.

Execution must not automatically resume unless restart/resume semantics are explicitly
supported and safe.

## 95. Agent Shutdown

Controlled shutdown should:

1. stop accepting new work;
2. report maintenance state;
3. finish safe operations where possible;
4. preserve state;
5. close cloud connection;
6. stop.

Physical robot shutdown remains a separate local procedure.

## 96. Maintenance Mode

A lab/resource may be placed into maintenance.

Maintenance should:

- prevent new bookings;
- prevent new job allocation;
- permit current job completion or controlled stop;
- expose reason;
- expose expected availability where appropriate.

## 97. Fault Handling

Faults should distinguish:

- agent fault;
- runtime fault;
- robot fault;
- network fault;
- safety fault;
- artifact fault;
- application fault.

A single generic `FAILED` state is insufficient for operations.

## 98. Fault Reporting

Fault records should include:

- category;
- code;
- message;
- component;
- job ID;
- run ID;
- resource ID;
- timestamp;
- recoverability.

Sensitive diagnostic information should be protected.

## 99. Artifact Failure

If artifact validation fails:

    Artifact
       |
       v
    REJECTED
       |
       v
    No Deployment
       |
       v
    Job FAILED / REJECTED

The robot must never execute an artifact that failed mandatory validation.

## 100. Deployment Failure

If deployment fails:

1. Mark deployment failed.
2. Do not start the application.
3. Preserve diagnostics.
4. Release resource when safe.
5. Update job/run state.
6. Make resource available only if health permits.

## 101. Application Failure

If the application exits unexpectedly:

- capture exit status;
- capture logs;
- capture diagnostics;
- stop related runtime services as required;
- release resource;
- mark run failed;
- collect results where available.

## 102. Runtime Failure

If the runtime itself fails:

- application state becomes uncertain;
- local safety policy applies;
- resource health is evaluated;
- Lab Agent reports fault;
- Control Plane marks execution appropriately;
- restart requires explicit policy.

## 103. Robot Fault

Robot fault must be treated as distinct from application failure.

The Lab Agent reports:

    ROBOT_FAULT

The Control Plane should prevent new execution until the resource is healthy and
authorized again.

## 104. Physical E-Stop

Physical E-stop is always authoritative.

When E-stop occurs:

- local hardware enters its safety state;
- cloud execution state may become stale;
- Lab Agent reports the safety condition when possible;
- cloud must not attempt to override the E-stop.

Recovery requires local human/safety procedure.

## 105. Safety Review Gate

Physical deployment should include a human safety review.

Software acceptance may proceed while the physical safety gate remains open, but:

- physical deployment;
- formal physical-lab closure;

must remain blocked until the safety review is approved.

## 106. Lab Security Zones

A production lab should separate:

    External Network
          |
          v
    Lab Firewall
          |
          v
    Lab Management Network
          |
          +--> Lab Agent
          |
          v
    Robot Control Network
          |
          +--> Robot
          +--> Safety Controller
          +--> Motion Hardware

Exact segmentation depends on the robot platform.

## 107. Lab Agent Network Permissions

The Lab Agent should have only required access to:

- Control Plane endpoint;
- object storage transfer endpoint;
- robot management interfaces;
- runtime;
- telemetry sources;
- video sources.

It should not have unrestricted access to unrelated lab hosts.

## 108. Robot Network Permissions

Robots should not require public Internet access for normal RaaS execution.

Where Internet access is required for an explicit robot feature, it should be:

- restricted;
- authenticated;
- monitored;
- documented.

## 109. Local Credential Storage

Lab Agent credentials must be stored using appropriate OS facilities.

Examples include:

- protected filesystem;
- OS secret store;
- hardware-backed key storage.

Credentials must not be embedded in artifacts.

## 110. Artifact Trust Chain

The intended trust chain is:

    User
      |
      v
    Signed Artifact
      |
      v
    Control Plane Validation
      |
      v
    Object Storage
      |
      v
    Lab Agent Verification
      |
      v
    Kritva Runtime Verification
      |
      v
    Execution

Each layer may reject an artifact.

## 111. Artifact Execution Policy

The Lab Agent must enforce policies such as:

- supported architecture;
- supported runtime;
- allowed platform;
- artifact signature;
- artifact size;
- execution duration;
- resource limits;
- capability requirements.

## 112. Application Permissions

A `.krv` manifest may declare:

- required capabilities;
- device access;
- network requirements;
- CPU/memory requirements;
- runtime version;
- execution duration.

The Lab Agent compares these requirements against platform policy.

## 113. Capability Matching

Conceptually:

    Artifact Requirements
           |
           v
    +-------------------+
    | Capability Matcher |
    +---------+---------+
              |
              v
    Resource Capabilities
              |
        +-----+-----+
        |           |
       Match      Reject

Execution is allowed only when mandatory requirements are satisfied.

## 114. Privileged Capabilities

High-risk capabilities should require explicit platform authorization.

Examples:

- direct motor control;
- raw EtherCAT;
- unrestricted network;
- privileged filesystem;
- safety controller interface.

The artifact cannot grant itself privileges.

## 115. Configuration Security

Remote configuration must be validated.

The Lab Agent should reject:

- unknown configuration keys;
- prohibited device mappings;
- invalid limits;
- unsupported runtime options.

## 116. Video Security

Camera access must be authorized.

Applications should not automatically receive unrestricted access to all cameras in a
lab.

The platform capability model should define:

    camera.front
    camera.depth
    camera.wrist

or equivalent logical identifiers.

## 117. Telemetry Security

Telemetry may contain sensitive information.

Access should be scoped to:

- organization;
- project;
- booking;
- job;
- run.

Lab-wide administrative telemetry requires separate authorization.

## 118. Lab Isolation

Each lab is an independent trust and operational boundary.

A compromise or outage in Lab A must not automatically affect:

- Lab B;
- Lab C;
- unrelated cloud jobs.

The Control Plane must maintain explicit lab identity.

## 119. Multi-Lab Scheduling

Scheduler input includes:

    Platform
    Capability
    Time
    Lab Availability
    Resource Availability
    Health
    Maintenance
    Geography
    Policy

The scheduler selects a compatible resource.

## 120. Multi-Platform Scheduling

A platform may have multiple physical resources:

    Humanoid-A
       |
       +--> Robot 001
       +--> Robot 002
       +--> Robot 003

The scheduler treats individual resources as execution targets.

## 121. Simulator Integration

Simulation should implement the same broad Lab Agent execution contract.

Conceptually:

    Control Plane
       |
       +--> Physical Lab Agent
       |
       +--> Simulation Agent

This enables:

- CI;
- developer testing;
- deterministic execution;
- pre-hardware validation.

## 122. Simulator Safety

Simulation does not require physical E-stop, but the execution contract should still
model:

- stop;
- fault;
- timeout;
- resource limits;
- state transitions.

This keeps software semantics aligned.

## 123. Observability

The Lab Agent should emit:

- agent health;
- connection state;
- resource health;
- job state;
- deployment state;
- runtime state;
- telemetry status;
- video status;
- storage state.

## 124. Agent Metrics

Recommended metrics:

    agent_heartbeat_age
    agent_connection_state
    agent_resource_count
    agent_active_jobs
    artifact_download_seconds
    deployment_duration
    job_start_duration
    job_failure_count
    telemetry_drop_count
    video_stream_count
    local_storage_usage

## 125. Resource Metrics

Recommended resource metrics:

    resource_cpu
    resource_memory
    resource_temperature
    resource_battery
    resource_network
    resource_runtime_state
    resource_safety_state

Platform-specific metrics may be added.

## 126. Local Storage Monitoring

The Lab Agent must monitor local disk.

Low disk space can prevent:

- artifact download;
- deployment;
- logging;
- result collection.

Thresholds should generate alerts before exhaustion.

## 127. Time Synchronization

Accurate time is important for:

- logs;
- telemetry;
- run duration;
- audit;
- correlation.

Lab hosts should maintain synchronized system time.

The architecture should not assume perfect clock synchronization and should include
server timestamps where necessary.

## 128. Correlation IDs

Commands, events, logs, telemetry, and results should carry correlation identifiers
where appropriate.

Example:

    request_id
    job_id
    run_id
    correlation_id

This enables end-to-end debugging.

## 129. Protocol Error Model

Errors should distinguish:

- authentication failure;
- authorization failure;
- unsupported protocol;
- unsupported command;
- invalid artifact;
- incompatible platform;
- resource unavailable;
- safety state;
- runtime failure;
- network failure;
- internal failure.

## 130. Retry Policy

Retries should apply only to operations that are safe to retry.

Suitable examples:

- heartbeat;
- metadata refresh;
- artifact download;
- telemetry upload.

Execution start requires stronger idempotency and state verification.

## 131. Retry Backoff

Network retries should use bounded exponential backoff with jitter where appropriate.

The Lab Agent must not create an aggressive retry storm against the cloud.

## 132. Cloud Outage

During cloud outage:

- Lab Agent retains local state;
- active execution follows local policy;
- new remote jobs are blocked;
- local safety continues;
- logs/telemetry may buffer;
- reconnection is attempted.

## 133. Lab Network Outage

During local network failure:

- robot safety remains local;
- runtime state remains local;
- Lab Agent may lose hardware visibility;
- cloud may see the agent as degraded/offline;
- recovery requires local network restoration.

## 134. Cloud/Robot Split-Brain

A split-brain condition may occur when:

    Cloud believes RUNNING
    Lab believes STOPPED

or the reverse.

The recovery mechanism is:

1. Query local state.
2. Identify execution identity.
3. Compare timestamps/state.
4. Reconcile.
5. Record discrepancy.
6. Avoid duplicate start.

## 135. Execution Identity

Every execution must have a unique:

- job ID;
- run ID;
- execution instance ID where necessary.

The execution identity must remain stable across retries/reconnections.

## 136. Deployment Identity

Each deployment should identify:

- artifact ID;
- artifact version;
- resource ID;
- run ID;
- deployment attempt.

This prevents stale artifacts from being mistaken for current execution.

## 137. Artifact Cleanup

After execution, local artifacts may be cleaned according to policy.

Cleanup must not occur while:

- execution is active;
- logs are still being collected;
- results are being generated;
- rollback/recovery requires the artifact.

## 138. Local Result Buffer

Results should be staged locally before cloud upload.

If upload fails:

- retain locally;
- retry;
- report pending state;
- enforce bounded storage.

The result must not be declared fully persisted until cloud confirmation is available.

## 139. Local Log Retention

Local logs should have bounded retention.

Critical failures should be retained longer than verbose operational logs where storage
constraints require prioritization.

## 140. Agent Upgrade

Lab Agent upgrades should be controlled.

The upgrade process should support:

- version compatibility;
- rollback;
- health verification;
- credential preservation;
- runtime compatibility.

## 141. Runtime Upgrade

Kritva Runtime upgrades require:

- compatibility validation;
- platform validation;
- artifact compatibility;
- safety review where required;
- rollback plan.

A runtime upgrade must not silently invalidate existing production artifacts.

## 142. Platform Upgrade

Platform firmware or hardware upgrades should update:

- platform version;
- capabilities;
- runtime compatibility;
- maintenance state.

The resource should remain unavailable until validation completes.

## 143. Lab Commissioning

Before a new physical lab becomes production-capable:

1. Install Lab Agent.
2. Establish identity.
3. Validate connectivity.
4. Discover resources.
5. Validate platform versions.
6. Validate runtime.
7. Validate safety systems.
8. Execute simulation/test artifact.
9. Execute controlled physical test.
10. Complete human safety review.
11. Mark resources available.

## 144. Lab Decommissioning

When removing a lab:

- disable scheduling;
- stop new bookings;
- finish/cancel active work;
- revoke agent credentials;
- archive records;
- remove cloud connectivity;
- remove secrets;
- update platform inventory.

## 145. Physical Safety Review

The software architecture cannot determine whether a physical robot is safe.

Human review must verify:

- E-stop;
- motion limits;
- safe workspace;
- mechanical integrity;
- controller state;
- power systems;
- communication;
- recovery procedures.

The software release must not bypass this gate.

## 146. Production Lab Acceptance

A physical lab is production-ready only when:

- connectivity is secure;
- resources are correctly identified;
- capabilities are correct;
- runtime versions are approved;
- safety review is approved;
- test execution passes;
- monitoring works;
- recovery procedure is documented.

## 147. Phase Mapping

| Phase | Lab Scope | Primary Outcome |
|---|---|---|
| Phase 0 | Lab contract + mock agent | Software boundary |
| Phase 1 | Local agent | Development integration |
| Phase 2 | Artifact retrieval | Artifact-to-lab path |
| Phase 3 | Deployment/runtime | Remote execution foundation |
| Phase 4 | Resource/booking integration | Resource allocation |
| Phase 5 | Job execution | End-to-end execution |
| Phase 6 | Physical lab | Real robots |
| Phase 7 | Telemetry/video/results | Full observation |
| Phase 8 | Production hardening | Production RaaS labs |

## 148. P0 FOUNDATION — Lab Foundation

Deliver:

- Lab Protocol baseline;
- Lab Agent skeleton;
- mock resource;
- registration contract;
- heartbeat contract;
- resource discovery contract.

Acceptance:

- mock agent connects;
- identity is validated;
- heartbeat is visible;
- resource is discovered.

## 149. P1 STUDIO — Development Lab

Deliver:

- local Lab Agent;
- simulated resource;
- local Kritva Runtime;
- development cloud connection;
- protocol implementation.

Acceptance:

- development Control Plane communicates with agent;
- agent can report resource state;
- reconnect works.

## 150. P2 BUILD & ARTIFACT — Artifact

Deliver:

- artifact authorization;
- object-storage download;
- checksum verification;
- signature verification;
- local artifact cache.

Acceptance:

- valid artifact downloads;
- invalid artifact is rejected;
- unauthorized artifact is rejected;
- cache is bounded.

## 151. Phase 3 — Deployment

Deliver:

- runtime staging;
- deployment lifecycle;
- configuration;
- execution start;
- execution stop;
- logs.

Acceptance:

- artifact deploys;
- runtime starts;
- job state is reported;
- stop works;
- duplicate start is prevented.

## 152. P4 BOOKING & COMMERCIAL — Resource and Booking

Deliver:

- resource allocation;
- booking validation;
- platform matching;
- capability matching;
- maintenance state.

Acceptance:

- only booked resources execute;
- resource conflicts are prevented;
- incompatible artifacts are rejected.

## 153. P5 EXECUTION

Deliver:

- production-like job lifecycle;
- worker interaction;
- run state;
- resource release;
- failure handling;
- reconciliation.

Acceptance:

- complete software execution works;
- worker retries are safe;
- resource is released after completion/failure;
- restart/recovery works.

## 154. P6 LAB & ROBOT — Physical Lab

Deliver:

- production Lab Agent;
- real robot integration;
- runtime;
- platform adapter;
- safety validation;
- physical commissioning.

Acceptance:

- robot is correctly identified;
- capabilities match reality;
- controlled execution works;
- safety review passes.

## 155. P7 LIVE & RESULTS

Deliver:

- live telemetry;
- video;
- logs;
- result collection;
- buffering;
- streaming authorization.

Acceptance:

- live video works;
- telemetry works;
- logs are available;
- results are persisted;
- temporary network loss is handled.

## 156. P8 PRODUCTION

Deliver:

- multi-lab operation;
- credential rotation;
- monitoring;
- alerts;
- upgrade/rollback;
- disaster recovery;
- operational runbooks;
- physical safety governance.

Acceptance:

- production lab is observable;
- agent recovery is tested;
- runtime recovery is tested;
- lab outage is isolated;
- safety gate is approved.

## 157. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Cloud directly controls robot | Critical | Lab Agent boundary |
| Network loss during motion | Critical | Local safety/runtime |
| Unauthorized agent | Critical | Strong identity + revocation |
| Duplicate execution | Critical | Idempotency + allocation |
| Malicious artifact | Critical | Signature + policy + sandbox |
| Artifact incompatibility | High | Capability matching |
| Agent compromise | Critical | Least privilege + isolation |
| Telemetry overload | High | Sampling/buffering |
| Video overload | High | Local encoding/rate control |
| Lab outage | High | Per-lab isolation |
| Agent restart | High | Persistent state + reconciliation |
| Runtime crash | High | Local watchdog/recovery |
| Disk exhaustion | High | Monitoring + bounded buffers |
| Credential compromise | Critical | Secure storage + rotation |
| Safety ambiguity | Critical | Local safety authority |

## 158. Risk: Cloud-to-Robot Direct Control

Mitigation:

- cloud communicates only through Lab Agent;
- Lab Agent enforces commands;
- runtime owns local execution;
- safety controller remains independent.

## 159. Risk: Unsafe Stop Semantics

Mitigation:

- clearly distinguish application stop from physical E-stop;
- document UI semantics;
- preserve local safety authority;
- require human review for physical safety behavior.

## 160. Risk: Malicious Artifact

Mitigation:

- signed artifact;
- checksum;
- manifest;
- capability policy;
- runtime isolation;
- filesystem restrictions;
- network restrictions;
- execution resource limits.

## 161. Risk: Agent Compromise

Mitigation:

- minimal OS privileges;
- credential isolation;
- per-lab identity;
- network segmentation;
- no unrestricted bridge;
- agent update mechanism;
- revocation.

## 162. Risk: Network Partition

Mitigation:

- local execution policy;
- local watchdog;
- bounded buffering;
- no new remote jobs offline;
- state reconciliation after reconnection.

## 163. Risk: Duplicate Start

Mitigation:

- run identity;
- idempotency key;
- local active-run detection;
- resource lock;
- Control Plane state validation.

## 164. Risk: Stale Artifact

Mitigation:

- artifact version;
- checksum;
- signature;
- revocation;
- compatibility checks;
- deployment identity.

## 165. Risk: Physical Platform Mismatch

Mitigation:

- platform identity;
- platform version;
- capability matching;
- runtime version matching;
- resource policy;
- commissioning validation.

## 166. Risk: Telemetry Failure Hides Fault

Mitigation:

- local safety systems independent of telemetry;
- local fault handling;
- telemetry health monitoring;
- explicit telemetry availability state.

## 167. Risk: Video Failure

Mitigation:

- separate video and execution channels;
- report video state;
- continue execution where safe;
- allow platform policy to require video if needed.

## 168. Open Questions

1. What exact Lab Protocol transport will be used?
2. Will mTLS be mandatory for all production agents?
3. Will agents use WebSocket, HTTP/2, gRPC, or another transport?
4. What exact runtime sandbox will be used on each robot OS?
5. Which robot platforms require containers?
6. Which platforms require native processes?
7. What is the artifact signature technology?
8. Where are signing keys managed?
9. Will the Lab Agent support automatic updates?
10. How are platform adapters versioned?
11. What is the minimum local offline execution window?
12. How much telemetry should be buffered locally?
13. What video protocol will be standardized?
14. Will WebRTC terminate directly at the Lab Agent?
15. Is a media gateway required for multi-user viewing?
16. Which telemetry data is retained permanently?
17. What are the initial CPU/memory execution limits?
18. Which devices require privileged access?
19. How is hardware-backed identity supported?
20. What exact physical safety review checklist is required?
21. Which safety systems must be independently validated?
22. What robot platforms will be supported first?
23. Which platforms require dedicated Lab Agents?
24. What happens when runtime and agent versions are incompatible?
25. What is the supported agent upgrade/rollback strategy?

## 169. Lab Architectural Invariants

The following invariants must remain true:

1. Lab Agent is the cloud-to-lab boundary.
2. Robots are not directly Internet-exposed.
3. Kritva Runtime executes locally.
4. Hard real-time control remains local.
5. Physical safety systems remain authoritative.
6. Cloud stop is not physical E-stop.
7. Every Lab Agent has a unique identity.
8. Every resource has a unique identity.
9. New jobs require authorization.
10. Artifact integrity is verified before execution.
11. Artifact compatibility is verified before deployment.
12. Remote applications cannot grant themselves privileged capabilities.
13. Resource allocation prevents conflicting execution.
14. Commands are idempotent where practical.
15. Active execution state survives agent/cloud reconnection.
16. Offline labs cannot silently accept unauthorized new jobs.
17. Reconnection reconciles observed state rather than blindly replaying commands.
18. Video is an observation channel, not a control channel.
19. Telemetry failure does not automatically imply robot safety failure.
20. Cloud infrastructure cannot replace local robot safety.

## 170. Full Acceptance Criteria Checklist

### Lab Architecture

- [ ] Lab topology is documented.
- [ ] Lab Agent boundary is defined.
- [ ] Kritva Runtime boundary is defined.
- [ ] Robot integration boundary is defined.
- [ ] Physical and simulated resources are supported conceptually.
- [ ] Trust boundaries are explicit.

### Agent Registration

- [ ] Agent registration flow exists.
- [ ] Unique agent identity exists.
- [ ] Lab association exists.
- [ ] Authentication exists.
- [ ] Authorization exists.
- [ ] Credential storage is secure.
- [ ] Credential rotation exists.
- [ ] Agent revocation exists.

### Heartbeat

- [ ] Agent heartbeat exists.
- [ ] Heartbeat contains health information.
- [ ] Heartbeat timeout is configurable.
- [ ] Stale state is detected.
- [ ] Offline state is detected.
- [ ] Heartbeat loss does not automatically issue unsafe robot commands.

### Resource Discovery

- [ ] Resources are discoverable.
- [ ] Resource IDs are stable.
- [ ] Platform identity is reported.
- [ ] Platform version is reported.
- [ ] Runtime version is reported.
- [ ] Architecture is reported.
- [ ] Capabilities are reported.
- [ ] Resource health is reported.
- [ ] Maintenance state is reported.
- [ ] Discovery is reconciled periodically.

### Platform Compatibility

- [ ] Artifact platform is identified.
- [ ] Resource platform is identified.
- [ ] Architecture is matched.
- [ ] Runtime version is matched.
- [ ] Capability requirements are matched.
- [ ] Incompatible execution is rejected.

### Artifact

- [ ] Artifact authorization exists.
- [ ] Artifact download is supported.
- [ ] Artifact checksum is verified.
- [ ] Artifact signature is verified.
- [ ] Artifact format is verified.
- [ ] Artifact cache is bounded.
- [ ] Artifact revocation is supported or explicitly deferred.
- [ ] Unauthorized artifacts are rejected.

### Deployment

- [ ] Deployment state is modeled.
- [ ] Artifact staging exists.
- [ ] Runtime configuration is validated.
- [ ] Deployment is isolated.
- [ ] Deployment identity exists.
- [ ] Deployment failure is handled.
- [ ] Cleanup is supported.

### Execution

- [ ] Job start exists.
- [ ] Job stop exists.
- [ ] Job cancel exists.
- [ ] Execution is asynchronous.
- [ ] Run identity exists.
- [ ] Duplicate start is prevented.
- [ ] Resource allocation is enforced.
- [ ] Resource release occurs.
- [ ] Runtime failure is handled.
- [ ] Application failure is handled.

### Kritva Runtime

- [ ] Runtime version is reported.
- [ ] Runtime API boundary is defined.
- [ ] Platform adapters are supported.
- [ ] Device access is restricted.
- [ ] Network access is restricted.
- [ ] Resource limits exist.
- [ ] Runtime state is observable.
- [ ] Runtime restart is handled.

### Safety

- [ ] Physical E-stop remains authoritative.
- [ ] Safety controller remains local.
- [ ] Local watchdog is supported where required.
- [ ] Cloud stop is explicitly not E-stop.
- [ ] Safety state is reported.
- [ ] Safety faults block unsafe new execution.
- [ ] Physical safety review is required before production deployment.
- [ ] Cloud outage does not replace local safety behavior.

### Telemetry

- [ ] Telemetry collection exists.
- [ ] Telemetry categories are defined.
- [ ] Sampling/rate control exists.
- [ ] Buffering exists.
- [ ] Telemetry overload is prevented.
- [ ] Live telemetry is available.
- [ ] Telemetry persistence policy is defined.
- [ ] Telemetry failure is observable.

### Video

- [ ] Video architecture is defined.
- [ ] Video is separate from control.
- [ ] Video access is authorized.
- [ ] Video bandwidth is controlled.
- [ ] Video failure is represented.
- [ ] Camera access is scoped.
- [ ] Local encoding is supported where appropriate.

### Logs

- [ ] Agent logs exist.
- [ ] Runtime logs exist.
- [ ] Application logs exist.
- [ ] Logs contain correlation IDs.
- [ ] Secrets are filtered.
- [ ] Local buffering is bounded.
- [ ] Cloud log upload is supported.

### Results

- [ ] Result metadata is collected.
- [ ] Result files are collected.
- [ ] Result checksums are recorded.
- [ ] Object storage integration exists.
- [ ] Local result buffering exists.
- [ ] Upload retry exists.
- [ ] Result completion is confirmed.

### Offline Handling

- [ ] New jobs are blocked when cloud authorization is unavailable.
- [ ] Active jobs follow local policy.
- [ ] Local safety continues.
- [ ] Logs can buffer.
- [ ] Telemetry can buffer where configured.
- [ ] Results can buffer.
- [ ] Automatic reconnection exists.
- [ ] State reconciliation exists.
- [ ] Duplicate execution after reconnect is prevented.

### Recovery

- [ ] Agent restart is handled.
- [ ] Runtime restart is handled.
- [ ] Robot restart is detected.
- [ ] Cloud outage is handled.
- [ ] Lab network outage is handled.
- [ ] Split-brain state is reconciled.
- [ ] Resource allocation is reconciled.
- [ ] Result state is reconciled.

### Security

- [ ] Lab Agent uses strong identity.
- [ ] Lab Agent permissions are least privilege.
- [ ] Robot networks are not directly exposed.
- [ ] Artifact trust is verified.
- [ ] Application permissions are constrained.
- [ ] Device access is restricted.
- [ ] Network access is restricted.
- [ ] Credentials are protected.
- [ ] Credentials can be revoked.

### Multi-Lab

- [ ] Labs have unique identities.
- [ ] Agents are associated with labs.
- [ ] Resources are associated with labs.
- [ ] Scheduling is lab-aware.
- [ ] Lab failure is isolated.
- [ ] Lab credentials are isolated.
- [ ] Cross-lab access is prevented.

### Simulation

- [ ] Simulation follows compatible execution contracts.
- [ ] Simulation resources are identifiable.
- [ ] Simulation failures are represented.
- [ ] Simulation can support automated testing.
- [ ] Physical safety assumptions are not incorrectly applied to simulation.

### Observability

- [ ] Agent health is visible.
- [ ] Resource health is visible.
- [ ] Runtime health is visible.
- [ ] Execution state is visible.
- [ ] Telemetry health is visible.
- [ ] Video health is visible.
- [ ] Local disk health is visible.
- [ ] Alerts exist for critical failures.

### Upgrades

- [ ] Agent upgrade path is defined.
- [ ] Agent rollback is defined.
- [ ] Runtime upgrade compatibility is defined.
- [ ] Platform upgrade process is defined.
- [ ] Artifact compatibility is preserved.
- [ ] Production upgrades require validation.

### Phase Completion

- [ ] Phase 0 lab foundation is complete.
- [ ] Phase 1 development lab is complete.
- [ ] Phase 2 artifact integration is complete.
- [ ] Phase 3 deployment/runtime integration is complete.
- [ ] Phase 4 resource/booking integration is complete.
- [ ] Phase 5 remote execution is complete.
- [ ] Phase 6 physical lab commissioning is complete.
- [ ] Phase 7 live/results capabilities are complete.
- [ ] Phase 8 production hardening is complete.

## 171. Final Lab Architecture Baseline

The Kritva RaaS lab architecture establishes a strict boundary between cloud
coordination and local robotic execution.

The complete execution topology is:

    User
      |
      v
    Kritva RaaS Studio
      |
      | HTTPS / WebSocket
      v
    RaaS Control Plane
      |
      +--> Authorization
      +--> Booking
      +--> Artifact
      +--> Job
      +--> Resource
      +--> Result
      |
      v
    Secure Lab Protocol
      |
      v
    Lab Agent
      |
      +--> Resource Manager
      +--> Artifact Manager
      +--> Deployment Manager
      +--> Runtime Manager
      +--> Telemetry Collector
      +--> Log Collector
      +--> Video Integration
      +--> Local Policy
      |
      v
    Kritva Runtime
      |
      +--> Application
      +--> Platform Adapter
      |
      v
    Robot Controller
      |
      +--> Sensors
      +--> Actuators
      +--> Motion
      +--> Cameras
      |
      v
    Physical Robot

The authority model is:

    Control Plane
        = business authorization and scheduling

    Lab Agent
        = cloud-to-lab enforcement and orchestration

    Kritva Runtime
        = local application execution

    Robot Controller
        = robot hardware control

    Safety Controller
        = physical safety authority

The architecture deliberately prevents the cloud from becoming a remote motor-control
system.

The cloud can say:

    "Run this authorized artifact on this booked resource."

The Lab Agent determines:

    "Can this operation be safely and legitimately executed here?"

The Kritva Runtime determines:

    "How should the application execute against this platform?"

The robot controller determines:

    "How should hardware be controlled?"

The safety system determines:

    "Is this physical action safe?"

This separation is fundamental to Kritva RaaS.

The normal execution flow is:

    Build Locally
         |
         v
    Signed .krv
         |
         v
    Book Resource
         |
         v
    Authorize Job
         |
         v
    Lab Agent
         |
         v
    Verify Artifact
         |
         v
    Allocate Resource
         |
         v
    Deploy
         |
         v
    Start Kritva Runtime
         |
         v
    Execute
         |
         +--> Telemetry
         +--> Video
         +--> Logs
         |
         v
    Complete
         |
         v
    Collect Results
         |
         v
    Release Resource

Failure and recovery follow a different but equally important principle:

    Failure
       |
       v
    Preserve Local Safety
       |
       v
    Preserve Execution Identity
       |
       v
    Preserve Evidence
       |
       v
    Reconnect
       |
       v
    Reconcile
       |
       v
    Converge to Actual State

The Lab Agent therefore serves as the critical operational bridge between Kritva RaaS
and real robots, while intentionally avoiding ownership of physical safety itself.

The architecture is designed to support the evolution from:

    Mock Lab
       |
       v
    Simulator
       |
       v
    Development Robot
       |
       v
    Single Production Robot
       |
       v
    Multi-Robot Lab
       |
       v
    Multi-Lab RaaS Platform

without changing the fundamental control boundary.

The governing invariants remain:

1. Build locally.
2. Upload only the required execution artifact.
3. Authenticate every Lab Agent.
4. Authorize every execution.
5. Verify every artifact.
6. Match artifact requirements to resource capabilities.
7. Keep real-time control local.
8. Keep safety local.
9. Treat cloud stop as application/job control, not E-stop.
10. Make execution commands idempotent.
11. Preserve execution identity.
12. Reconcile after disconnection.
13. Isolate labs from each other.
14. Keep robots off the public Internet.
15. Treat video as observation.
16. Treat telemetry as observation and diagnostics.
17. Persist authoritative business state in the Control Plane.
18. Never assume cloud state equals physical state during failures.
19. Require human safety approval before physical production deployment.
20. Prefer deterministic, observable, recoverable execution.

This architecture is the foundation for connecting KritvaOS-powered robots to the Kritva
RaaS platform while preserving the critical separation between cloud software,
robot runtime, and physical safety.
