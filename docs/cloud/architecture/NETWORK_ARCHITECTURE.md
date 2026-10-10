# Kritva RaaS Network Architecture

## 1. Document Control

| Item | Value |
|---|---|
| Document | Network Architecture |
| Path | `docs/cloud/architecture/NETWORK_ARCHITECTURE.md` |
| Product | Kritva Robotics-as-a-Service |
| Repository | `KritvaOS/kritva-raas` |
| Primary Network Boundary | Cloud VPC/VNet |
| Application | RaaS Control Plane |
| API | REST `/api/v1/` |
| Realtime | WebSocket |
| Media | WebRTC where required |
| Database | PostgreSQL |
| Object Storage | S3-compatible |
| Queue | Durable Queue |
| Lab Boundary | Lab Agent |
| Internet Exposure | Edge/API only |
| Production Model | Private-by-default |
| Region Strategy | Single primary region initially |
| Availability | Multi-zone where supported |
| Lab Connectivity | Secure outbound-first |
| TLS | Required |
| Physical Safety | Local to lab/robot |

## 2. Purpose

This document defines the production-grade network architecture for Kritva
RaaS.

The network must securely connect:

- RaaS Studio;
- Web Console;
- administrators;
- Control Plane;
- PostgreSQL;
- object storage;
- queue;
- workers;
- scheduler;
- Lab Agents;
- robot labs;
- WebSocket clients;
- optional WebRTC media paths.

The central network principle is:

> **Expose the service, not the infrastructure; connect the lab, not the robot
> network.**

The network must provide:

- secure ingress;
- controlled egress;
- tenant-safe application access;
- private data services;
- secure Lab Agent connectivity;
- realtime communication;
- optional low-latency media;
- environment isolation;
- observability;
- explicit firewall policy;
- future regional expansion.

## 3. Scope

This document covers:

- VPC/VNet architecture;
- subnets;
- routing;
- ingress;
- API gateway;
- load balancing;
- WebSocket;
- WebRTC;
- lab connectivity;
- VPN/tunnel options;
- outbound-only connectivity;
- segmentation;
- DNS;
- TLS;
- certificates;
- egress control;
- firewall/security groups;
- private endpoints;
- network monitoring;
- environment isolation;
- network scaling;
- network failure handling.

## 4. Non-Goals

This document does not define:

- detailed application authorization;
- complete API semantics;
- database schema;
- cloud provider-specific IaC;
- robot motor-control networking;
- EtherCAT network design;
- physical safety certification;
- final WebRTC vendor;
- final cloud provider.

Those details belong in:

    docs/backend/architecture/
    docs/cloud/deployment/
    docs/cloud/operations/
    Lab/robot architecture

## 5. Network Principles

The network follows these principles:

1. Private-by-default.
2. Public exposure only at the edge.
3. No public PostgreSQL.
4. No public queue.
5. No public secret store.
6. No direct public access to robots.
7. Lab Agent is the cloud-to-lab boundary.
8. Outbound-only lab connectivity is preferred.
9. VPN is supported where required.
10. TLS is mandatory for Internet-facing traffic.
11. Internal traffic is encrypted where practical.
12. Network policy is deny-by-default.
13. Egress is controlled.
14. Environments are isolated.
15. Administrative access is tightly restricted.
16. WebSocket is a realtime channel, not durable state.
17. WebRTC media is separated from control traffic.
18. Physical safety remains local.

## 6. Logical Network Topology

The target topology is:

    Internet
       |
       v
    DNS
       |
       v
    CDN / Edge / WAF
       |
       v
    Public Load Balancer / API Gateway
       |
       v
    Private Application Subnets
       |
       +-------------------+
       |                   |
       v                   v
    Control Plane       WebSocket
       |                   |
       +---------+---------+
                 |
       +---------+---------+
       |         |         |
       v         v         v
    PostgreSQL Queue   Object Storage
       |
       v
    Private Services
       |
       v
    Lab Connectivity
       |
       v
    Secure Lab Agent Channel
       |
       v
    Lab Network
       |
       v
    Robot / Kritva Runtime

## 7. VPC/VNet

Each cloud environment should have an isolated VPC/VNet or equivalent private
network boundary.

Recommended:

    Development VPC
    Staging VPC
    Production VPC

Environment sharing should be avoided unless explicitly justified.

Production should not share its primary application network with development.

## 8. VPC Responsibilities

The VPC/VNet provides:

- private IP addressing;
- routing;
- subnet isolation;
- security boundaries;
- controlled Internet access;
- private service connectivity.

Application business logic must not depend on specific private IP addresses.

## 9. CIDR Strategy

CIDR ranges must be planned before production deployment.

The design should reserve space for:

- application;
- workers;
- databases;
- internal services;
- future expansion;
- private endpoints;
- VPN/tunnel ranges where required.

Example only:

    Production VPC
    10.20.0.0/16

    Application
    10.20.10.0/24

    Worker
    10.20.20.0/24

    Data
    10.20.30.0/24

    Private Services
    10.20.40.0/24

These values are illustrative and must not be treated as final.

## 10. Subnet Model

Recommended logical subnet classes:

| Subnet | Exposure | Purpose |
|---|---|---|
| Edge/Public | Limited | Load balancer/edge components |
| Application | Private | Control Plane |
| Worker | Private | Workers/scheduler |
| Data | Private | PostgreSQL |
| Private Services | Private | Internal endpoints |
| Management | Restricted | Operational access |

Not every cloud provider requires a physically separate subnet for every class,
but the security boundary must be preserved.

## 11. Public Subnets

Public subnets should contain only components that require public reachability.

Preferred contents:

- public load balancer;
- controlled edge components;
- NAT gateway where provider architecture requires it.

The Control Plane itself should not require a public IP address.

## 12. Application Subnets

Application subnets host:

- Control Plane;
- API workers;
- WebSocket-capable application instances.

These instances receive traffic only through approved ingress paths.

They should not accept arbitrary Internet traffic.

## 13. Worker Subnets

Worker subnets host:

- background workers;
- scheduler;
- reconciliation workers;
- asynchronous processors.

Workers normally do not need public ingress.

They require controlled access to:

- PostgreSQL;
- queue;
- object storage;
- secret store;
- approved external services.

## 14. Data Subnets

Data subnets contain:

- PostgreSQL;
- other stateful private services if required.

Data subnets should have no direct Internet ingress.

Only explicitly authorized application workloads may connect.

## 15. Private Service Endpoints

Where supported, use private endpoints for:

- object storage;
- secret store;
- queue;
- container registry;
- cloud control APIs.

This reduces unnecessary Internet traversal.

## 16. Network Flow

The preferred production flow is:

    Internet
       |
       v
    Edge
       |
       v
    Public LB
       |
       v
    Private API
       |
       +--> PostgreSQL
       +--> Queue
       +--> Object Storage
       +--> Secret Store

Data services remain inside private trust boundaries.

## 17. Internet Ingress

Internet ingress is limited to:

- HTTPS API;
- WebSocket;
- WebRTC signaling where required;
- media infrastructure where required.

The following must not be Internet-accessible:

- PostgreSQL;
- queue;
- worker nodes;
- scheduler;
- secret store;
- internal management endpoints;
- robot networks.

## 18. Edge Layer

The edge layer may provide:

- DNS;
- CDN;
- WAF;
- DDoS protection;
- TLS termination;
- request filtering;
- rate limiting.

The exact implementation is provider-dependent.

## 19. API Gateway

The API gateway is the controlled entry point for:

    /api/v1/*

It should provide:

- TLS;
- request routing;
- request size limits;
- rate limiting;
- connection limits;
- request IDs;
- health routing;
- WebSocket upgrade support.

## 20. API Gateway Does Not Own Authorization

The gateway may validate transport-level authentication tokens, but business
authorization remains in the Control Plane.

The backend determines:

    Principal
       |
       v
    Organization
       |
       v
    Membership
       |
       v
    Role
       |
       v
    Resource Policy
       |
       v
    Allow / Deny

## 21. Load Balancer

The load balancer distributes traffic across healthy application instances.

Conceptually:

    API Gateway
         |
         v
    Load Balancer
      /    |    \
     v     v     v
    API   API   API
     |     |     |
     +-----+-----+
           |
      PostgreSQL

Health checks must distinguish:

- process alive;
- ready for traffic;
- dependency failure.

## 22. Health Endpoints

Recommended:

    /health/live
    /health/ready

Liveness should determine whether the process is functioning.

Readiness should determine whether the instance should receive traffic.

Health endpoints must not disclose sensitive information.

## 23. WebSocket Path

WebSocket is exposed through the same controlled edge boundary where practical.

Conceptually:

    Client
       |
       | WSS
       v
    Edge / Gateway
       |
       v
    WebSocket-capable API
       |
       v
    Event Infrastructure

WebSocket traffic must use authenticated sessions.

## 24. WebSocket Security

WebSocket connections must:

- authenticate;
- authorize subscriptions;
- enforce tenant isolation;
- limit connection lifetime where appropriate;
- enforce message limits;
- enforce rate limits;
- reject unauthorized resource subscriptions.

## 25. WebSocket Reliability

WebSocket is not authoritative.

If disconnected:

    WebSocket Disconnect
          |
          v
    Reconnect
          |
          v
    REST State Query
          |
          v
    Event Replay Where Available
          |
          v
    Continue Realtime

This prevents transient network loss from becoming state loss.

## 26. WebSocket Scaling

Multiple application instances may require shared event distribution.

Future topology:

    Event Producer
         |
         v
    Durable/Event Distribution
       /    |    \
      v     v     v
     WS    WS    WS
      |     |     |
    Client Client Client

The exact fan-out mechanism remains an implementation decision.

## 27. WebRTC

WebRTC is intended for live media such as robot video where appropriate.

Control traffic and media traffic must remain conceptually separate:

    Control Plane
        |
        +--> REST
        +--> WebSocket
        |
        +--> WebRTC Signaling
                 |
                 v
              WebRTC
                 |
                 v
             Live Video

## 28. WebRTC Signaling

WebRTC signaling may use the authenticated Control Plane or dedicated signaling
infrastructure.

Signaling carries:

- session identity;
- SDP offers/answers;
- ICE information;
- authorization context.

Signaling must not expose unauthorized robot media.

## 29. WebRTC Media Path

Preferred media path:

    Browser / Studio
          |
          v
       WebRTC
          |
       +--+--+
       |     |
       v     v
    Direct  TURN
     Path   Relay
       |     |
       +--+--+
          |
          v
       Lab Media Gateway
          |
          v
       Robot Camera

The actual architecture depends on lab network constraints.

## 30. TURN

A TURN relay should be available where direct connectivity is impossible.

TURN must:

- authenticate sessions;
- limit allocation lifetime;
- enforce quotas;
- protect against abuse;
- provide metrics;
- avoid becoming an unrestricted relay.

## 31. WebRTC and Lab Networks

Robot cameras should not require arbitrary inbound Internet access.

Preferred:

    Camera / Robot
         |
         v
    Lab Media Gateway / Agent
         |
         v
    Controlled WebRTC Path

The Lab Agent or a dedicated media gateway can bridge the lab network.

## 32. WebRTC Security

Every media session must be associated with:

- authenticated user;
- organization;
- project/job/run;
- authorized resource;
- expiration.

Media authorization must follow Job/Run/resource authorization.

## 33. DNS Architecture

DNS should separate public and private naming.

Public names:

    api.<domain>
    ws.<domain>
    studio.<domain>
    app.<domain>

Private names:

    db.internal
    queue.internal
    agent-gateway.internal

Exact names remain deployment-specific.

## 34. Public DNS

Public DNS routes users to the edge.

Example:

    api.kritva.example
          |
          v
    Edge / WAF
          |
          v
    Load Balancer

DNS must not expose private service addresses.

## 35. Private DNS

Private DNS allows cloud workloads to resolve:

- database endpoints;
- queue endpoints;
- private service endpoints;
- internal gateways.

Private DNS records should not be publicly resolvable.

## 36. DNS TTL

TTL should balance:

- failover speed;
- caching;
- operational stability.

Short TTLs are useful for controlled migration but increase DNS query volume.

## 37. TLS

TLS is mandatory for public endpoints.

Required:

    HTTPS
    WSS

WebRTC uses its own secure media mechanisms and must be integrated with
authenticated signaling.

## 38. Certificate Management

Certificates should be centrally managed.

The architecture should support:

- automatic renewal;
- expiry monitoring;
- certificate rotation;
- emergency revocation.

Manual certificate copying should be avoided.

## 39. Internal TLS

Internal TLS should be used for sensitive service boundaries where supported.

At minimum protect:

- database connections;
- Lab Agent connections;
- administrative channels;
- sensitive service-to-service traffic.

## 40. Lab-to-Cloud Connectivity

The preferred architecture is outbound-first.

    Lab Network
        |
        v
    Lab Agent
        |
        | Outbound TLS
        v
    Cloud Lab Gateway
        |
        v
    Control Plane

No inbound Internet connection to the robot network is required.

## 41. Why Outbound-Only

Outbound-only connectivity:

- reduces attack surface;
- simplifies firewall rules;
- avoids exposing robot IPs;
- works through many enterprise NATs;
- keeps cloud outside the physical robot network;
- supports multiple geographically distributed labs.

## 42. Persistent Secure Tunnel

The Lab Agent may maintain a persistent secure connection.

Conceptually:

    Lab Agent
        |
        | outbound connection
        v
    Secure Gateway
        |
        v
    Lab Connectivity Service

The connection may use:

- mutually authenticated TLS;
- secure WebSocket;
- QUIC-based transport;
- provider-neutral secure tunnel.

The exact transport remains open.

## 43. VPN Option

VPN is supported for environments requiring network-level connectivity.

Example:

    Lab Network
       |
    VPN Gateway
       |
    Encrypted Tunnel
       |
    Cloud VPN Gateway
       |
    Private VPC
       |
    Lab Service

VPN should not automatically imply unrestricted network access.

## 44. VPN Segmentation

If VPN is used:

- restrict routes;
- restrict source ranges;
- restrict destination ports;
- restrict identities;
- log connections.

A VPN is a transport, not an authorization model.

## 45. Tunnel Option

A secure application-level tunnel may be preferred where the Lab Agent is
sufficient.

Benefits:

- narrower access;
- application identity;
- easier tenant/lab isolation;
- less network exposure.

## 46. Connectivity Selection

| Requirement | Preferred Option |
|---|---|
| Basic lab | Outbound secure Agent |
| Enterprise network | Agent + controlled tunnel |
| Private enterprise lab | VPN |
| High media requirements | Agent/media gateway + WebRTC |
| Multiple isolated labs | Per-lab identity/tunnel |
| Direct robot access | Not permitted by default |

## 47. Lab Identity

Each Lab Agent must authenticate independently.

Identity must include:

- lab ID;
- agent ID;
- credential/certificate;
- version;
- capability set.

Credentials must be revocable.

## 48. Lab Firewall

Typical lab firewall policy:

    OUTBOUND
    Lab Agent -> Cloud Gateway : ALLOW
    Lab Media Gateway -> Approved Media Services : ALLOW

    INBOUND
    Internet -> Robot Network : DENY
    Internet -> Robot : DENY
    Cloud -> Robot : DENY

Exceptions must be explicitly approved.

## 49. Cloud Firewall

Typical cloud firewall policy:

    Internet -> Edge : ALLOW HTTPS/WSS
    Edge -> API : ALLOW
    API -> PostgreSQL : ALLOW
    API -> Queue : ALLOW
    API -> Object Storage : ALLOW
    Worker -> PostgreSQL : ALLOW
    Worker -> Queue : ALLOW
    Worker -> Object Storage : ALLOW
    Lab Agent -> Lab Gateway : ALLOW
    Internet -> PostgreSQL : DENY
    Internet -> Queue : DENY
    Internet -> Workers : DENY
    Internet -> Robot : DENY

## 50. Security Group Model

Security groups/firewalls should be assigned by workload role.

Suggested groups:

    edge-sg
    api-sg
    worker-sg
    scheduler-sg
    database-sg
    lab-gateway-sg
    management-sg

Rules should reference logical groups rather than broad Internet ranges.

## 51. Deny-by-Default

Every security boundary should follow:

    DENY ALL
       |
       v
    Add Required Flow
       |
       v
    Review
       |
       v
    Monitor

Unnecessary broad rules must not be introduced for convenience.

## 52. Ingress Rules

Ingress rules should specify:

- source;
- destination;
- protocol;
- port;
- purpose;
- environment;
- owner;
- expiration if temporary.

Example:

    Source: Edge
    Destination: API
    Protocol: HTTPS
    Port: 443
    Purpose: Public API traffic

## 53. Egress Rules

Egress should be controlled rather than unrestricted.

Application workloads may need access to:

- PostgreSQL;
- queue;
- object storage;
- secret store;
- identity provider;
- approved external APIs;
- Lab Gateway.

Unknown destinations should be denied or monitored.

## 54. NAT

Private workloads requiring Internet access may use controlled NAT.

Example:

    Private API
        |
        v
      NAT
        |
        v
     Internet

NAT must not make private workloads directly Internet-addressable.

## 55. Egress Gateway

A dedicated egress gateway may be used to:

- centralize outbound traffic;
- restrict destinations;
- log external calls;
- enforce policies;
- simplify auditing.

## 56. External Service Allowlist

External service access should be allowlisted where practical.

Examples:

- identity provider;
- payment provider;
- email service;
- observability endpoint;
- container registry;
- cloud APIs.

The exact list is environment-specific.

## 57. Egress Monitoring

Monitor:

- destination;
- volume;
- connection count;
- failures;
- unusual destinations;
- data transfer.

Unexpected egress may indicate:

- misconfiguration;
- credential compromise;
- malware;
- application defect.

## 58. Database Firewall

PostgreSQL should accept traffic only from authorized backend groups.

Conceptually:

    api-sg ----\
    worker-sg ---+--> database-sg:5432
    scheduler-sg-/

No Internet source should be allowed.

## 59. Queue Firewall

The queue should accept traffic only from:

- API workloads;
- worker workloads;
- scheduler/reconciliation workloads.

No public access.

## 60. Object Storage Network Policy

Where supported, object storage should use private endpoints.

Where public endpoint access is unavoidable:

- TLS;
- IAM authorization;
- scoped credentials;
- signed requests;
- egress restrictions.

## 61. Secret Store Network Policy

The secret store should be reachable only by authorized workloads.

Access requires both:

- network reachability;
- workload identity/authorization.

Network access alone must never grant secret access.

## 62. Container Registry

Production workloads may require registry access during deployment.

Prefer:

- private registry endpoints;
- authenticated pulls;
- immutable images;
- restricted credentials.

Runtime workloads should not need registry access unless required.

## 63. Management Network

Administrative access should use a restricted management path.

Possible mechanisms:

- bastion;
- identity-aware access;
- private administration endpoint;
- provider-managed session access.

Direct public SSH to production infrastructure should be avoided.

## 64. Administrative Firewall

Management access should be:

- authenticated;
- least privilege;
- audited;
- time-bound where possible.

Administrative access must not become a general route to robot networks.

## 65. Network Segmentation

Logical segmentation:

    Public Internet
          |
       Edge Zone
          |
    Application Zone
       /       \
      v         v
   Worker      API
      \         /
       \       /
        Data Zone
          |
       PostgreSQL

Separate:

    Lab Network
          |
    Secure Connectivity Zone
          |
    Cloud Lab Gateway

## 66. Tenant Segmentation

Tenant isolation is primarily an application authorization responsibility.

Network segmentation should provide defense-in-depth.

The cloud network must not assume that a private network automatically provides
tenant isolation.

## 67. Lab Segmentation

Each lab should be treated as an independent trust boundary.

The cloud should identify:

- lab;
- agent;
- resource;
- robot;
- capabilities.

Cross-lab traffic should not be allowed by default.

## 68. Robot Network

The robot network should be private to the lab.

Typical:

    Lab LAN
      |
      +--> Lab Agent
      |
      +--> Robot
      |
      +--> Camera
      |
      +--> Sensors / Controllers

Cloud traffic terminates at the Lab Agent or approved media gateway.

## 69. Robot Network Ingress

Default:

    Cloud -> Robot Network = DENY

Only explicitly authorized local Lab Agent operations may reach robot resources.

## 70. Robot Network Egress

Robot network egress should be minimized.

Robot systems should not require unrestricted Internet access.

If Internet access is required for:

- software updates;
- telemetry;
- package retrieval;

it should use controlled gateways.

## 71. Control and Media Separation

Control:

    REST
    WebSocket
    Lab Protocol

Media:

    WebRTC
    RTP/approved media path

The media plane should not become a control-plane bypass.

## 72. Media Authorization

A valid WebRTC session must be tied to an authorized Job/Run/resource.

Media access must terminate when:

- Job ends;
- Run ends;
- booking expires;
- user loses authorization;
- session expires.

## 73. Network Time

Cloud infrastructure should use synchronized time.

Timestamps are important for:

- audit;
- traces;
- Jobs;
- Runs;
- telemetry;
- Lab Agent heartbeats.

Backend time remains UTC.

## 74. Network Observability

Collect:

- load balancer access logs;
- API gateway logs;
- firewall logs;
- VPN/tunnel logs;
- Lab Agent connectivity;
- DNS health;
- TLS certificate status;
- network flow logs where supported.

## 75. Network Metrics

Important metrics:

- requests/sec;
- connection count;
- TLS errors;
- load balancer latency;
- WebSocket connections;
- WebSocket disconnect rate;
- WebRTC session success;
- TURN utilization;
- VPN tunnel status;
- Lab Agent connections;
- egress volume;
- packet/error rates.

## 76. Network Tracing

Distributed tracing should correlate:

    HTTP Request
        |
        v
    Control Plane
        |
        v
    Queue
        |
        v
    Worker
        |
        v
    Lab Agent

Trace IDs must not contain sensitive user information.

## 77. DNS Failure Handling

If DNS becomes unavailable:

- existing connections may continue until expiration;
- new connections may fail;
- application state remains durable.

Critical operational DNS records should have appropriate redundancy.

## 78. TLS Failure Handling

Certificate expiry must be detected before expiry.

Certificate renewal failure should generate an alert.

Production should not depend on manual last-minute certificate renewal.

## 79. Lab Tunnel Failure

If the secure Lab Agent connection fails:

    Tunnel Lost
       |
       v
    Mark Agent Degraded/Offline
       |
       v
    Block New Allocation
       |
       v
    Preserve Durable State
       |
       v
    Reconnect
       |
       v
    Reconcile

The exact handling of active Jobs is governed by Job/Run reconciliation.

## 80. Network Partition

A network partition can produce uncertain external state.

Example:

    Cloud <---X---> Lab

The cloud must not infer:

    "No connection" = "Robot stopped"

Instead:

    Connection Lost
         |
         v
    State = UNKNOWN / RECONCILIATION_REQUIRED
         |
         v
    Reconnect / Reconcile

## 81. API Failure Isolation

A database outage should not cause arbitrary network retries that overload the
database after recovery.

Use:

- bounded connection pools;
- timeouts;
- backoff;
- circuit-breaking where appropriate.

## 82. WebSocket Failure Isolation

WebSocket reconnect storms must be controlled.

Use:

- client backoff;
- server connection limits;
- authentication rate limits;
- subscription limits.

## 83. WebRTC Failure Isolation

Media failure must not terminate durable Job state automatically.

A video failure is different from:

- robot failure;
- Run failure;
- application failure.

The UI should report media degradation independently.

## 84. Rate Limiting

Rate limiting should exist at:

- edge;
- API;
- WebSocket;
- Lab Agent;
- telemetry.

Limits should be differentiated by operation sensitivity.

## 85. Sensitive Operations

More restrictive controls should apply to:

- login;
- artifact upload;
- Job creation;
- Job start;
- Job stop;
- administrative APIs;
- credit operations.

## 86. Network Request Size

The edge must enforce request-size limits.

Large files such as artifacts and results should use object storage rather than
large API payloads.

## 87. Artifact Upload Network Flow

Preferred:

    Studio
       |
       v
    API
       |
       v
    Signed Upload Authorization
       |
       v
    Object Storage
       |
       v
    Completion API
       |
       v
    Validation Worker

This reduces Control Plane bandwidth pressure.

## 88. Result Download Network Flow

Preferred:

    User
      |
      v
    Control Plane Authorization
      |
      v
    Controlled/Signed URL
      |
      v
    Object Storage

Large result data should not flow through API instances unnecessarily.

## 89. Lab Artifact Fetch

Preferred:

    Lab Agent
       |
       v
    Authorized Artifact Fetch
       |
       v
    Object Storage
       |
       v
    Digest Verification
       |
       v
    Local Deployment

The Lab Agent should receive only artifacts authorized for the Job.

## 90. Network Security Testing

Testing should include:

- port scanning;
- firewall validation;
- unauthorized ingress;
- unauthorized egress;
- TLS validation;
- tenant isolation;
- Lab Agent isolation;
- WebSocket authorization;
- WebRTC authorization.

## 91. Network Configuration as Code

Network configuration should be version-controlled where possible.

Changes should be reviewed like application changes.

Examples:

- subnet;
- route;
- firewall;
- security group;
- gateway;
- DNS;
- private endpoint.

## 92. Network Change Process

    Proposed Change
          |
          v
    Architecture Review
          |
          v
    IaC Change
          |
          v
    CI Validation
          |
          v
    Staging
          |
          v
    Production
          |
          v
    Verification

## 93. Environment Network Comparison

| Feature | Development | Staging | Production |
|---|---|---|---|
| Public API | Yes | Yes | Yes |
| WAF | Optional | Yes | Yes |
| Private DB | Yes | Yes | Yes |
| Multi-zone | Optional | Recommended | Required where practical |
| Lab Agent | Mock | Test Lab | Real Labs |
| VPN | Optional | Test | As required |
| Egress Controls | Basic | Controlled | Strict |
| Monitoring | Basic | Full | Full |
| DR | Minimal | Tested | Required |

## 94. Region and Zone Strategy

Initial:

    Region A
      |
      +--> AZ-A
      +--> AZ-B
      +--> AZ-C

Future:

    Global DNS / Edge
       |
       +--> Region A
       |
       +--> Region B

Multi-region should be introduced only after data consistency, routing,
failover and operational requirements are explicitly defined.

## 95. Network Capacity Planning

Capacity must account for:

- API traffic;
- artifact uploads;
- result downloads;
- WebSocket connections;
- WebRTC sessions;
- Lab Agent connections;
- telemetry;
- egress.

Media traffic can dominate bandwidth and must be planned separately.

## 96. Egress Cost

Network egress can become a major RaaS cost driver.

Monitor:

- video egress;
- artifact download;
- result download;
- lab traffic;
- cross-region traffic.

Use object storage and direct media paths where appropriate.

## 97. WebRTC Cost Control

Video policy may include:

- resolution limits;
- frame-rate limits;
- session limits;
- TURN bandwidth limits;
- recording limits;
- maximum concurrent sessions.

The commercial model may later associate video usage with platform plans.

## 98. Lab Bandwidth

Labs may have constrained uplinks.

The architecture should support:

- telemetry rate limiting;
- adaptive video;
- local buffering;
- compressed logs;
- result batching.

Control traffic should receive priority over non-critical telemetry.

## 99. Network QoS

Where lab infrastructure supports QoS:

- safety/control traffic should have priority;
- telemetry should be bounded;
- media should be adaptive;
- bulk transfers should be lowest priority.

Cloud network QoS must not replace local robot safety mechanisms.

## 100. Security Monitoring

Network monitoring should detect:

- unexpected open ports;
- unusual egress;
- repeated authentication failures;
- suspicious Lab Agent connections;
- abnormal WebSocket connections;
- unexpected cross-environment traffic.

## 101. Environment Boundary

No production network route should exist from:

    Development -> Production
    Staging -> Production

unless explicitly required for a controlled operational function.

Similarly, production credentials must never be available to lower environments.

## 102. Shared Services

Shared global services such as:

- DNS;
- certificate authority;
- container registry;
- observability;

may be shared only when isolation is preserved.

Production credentials and data must remain isolated.

## 103. Management Plane

Cloud provider management APIs are distinct from the application data plane.

Application workloads should use workload identity rather than long-lived
administrator credentials.

## 104. Firewall Rule Lifecycle

Every firewall rule should have:

- source;
- destination;
- port;
- protocol;
- reason;
- owner;
- environment;
- review status.

Temporary rules should have an expiration date.

## 105. Firewall Logging

Important deny events should be observable.

Logging should avoid overwhelming systems with expected Internet noise while
retaining useful security evidence.

## 106. Network Incident Response

For a suspected network security incident:

    Detect
      |
      v
    Isolate
      |
      v
    Preserve Evidence
      |
      v
    Revoke Credentials
      |
      v
    Block Traffic
      |
      v
    Validate
      |
      v
    Restore
      |
      v
    Review

Physical robot safety remains under local lab control.

## 107. Network Disaster Recovery

Network DR should include:

- DNS recovery;
- edge recovery;
- VPC reconstruction;
- firewall reconstruction;
- private endpoint reconstruction;
- VPN/tunnel reconstruction;
- certificate recovery;
- Lab Agent reconnect.

Infrastructure as code is therefore mandatory for production recovery.

## 108. Provider-Neutral Network Interfaces

Application-level dependencies should be abstracted around:

    PublicEndpoint
    PrivateServiceEndpoint
    ObjectStorage
    Queue
    SecretStore
    LabGateway
    Observability

The exact cloud implementation is not part of domain logic.

## 109. Network Interface Table

| Interface | Protocol | Exposure |
|---|---|---|
| Public API | HTTPS | Internet via Edge |
| WebSocket | WSS | Internet via Edge |
| WebRTC Signaling | HTTPS/WSS | Internet via Edge |
| WebRTC Media | DTLS-SRTP/ICE | Controlled |
| API → DB | TLS PostgreSQL | Private |
| API → Queue | TLS/provider secure | Private |
| API → Storage | HTTPS/private endpoint | Private |
| Agent → Cloud | TLS tunnel | Outbound |
| VPN Lab → Cloud | Encrypted VPN | Private |
| Admin | Private/identity-aware | Restricted |

## 110. Phase Mapping

| Phase | Network Focus |
|---|---|
| Phase 0 | Network boundaries and topology |
| Phase 1 | VPC, subnets, API ingress, private DB |
| Phase 2 | Object storage and artifact network paths |
| Phase 3 | Queue, workers, scheduler and private service access |
| Phase 4 | Billing/credits and controlled external egress |
| Phase 5 | Job/Run control paths |
| Phase 6 | Lab Agent, VPN/tunnel and robot isolation |
| Phase 7 | WebSocket, WebRTC, telemetry and media scaling |
| Phase 8 | HA, security hardening, DR, egress and network optimization |

## 111. Phase 0 Acceptance

- [ ] Network topology is documented.
- [ ] Public/private boundaries are defined.
- [ ] Lab boundary is defined.
- [ ] Provider-neutral network interfaces are defined.
- [ ] Security principles are approved.

## 112. Phase 1 Acceptance

- [ ] VPC/VNet exists.
- [ ] Subnet architecture exists.
- [ ] Public edge is defined.
- [ ] API gateway is deployed.
- [ ] PostgreSQL is private.
- [ ] Firewall rules are implemented.
- [ ] DNS is configured.
- [ ] TLS is configured.

## 113. Phase 2 Acceptance

- [ ] Object storage uses controlled access.
- [ ] Artifact upload path is validated.
- [ ] Artifact fetch path is validated.
- [ ] Private storage endpoints are used where supported.
- [ ] Large payloads bypass the API where practical.

## 114. Phase 3 Acceptance

- [ ] Queue is private.
- [ ] Worker subnets are private.
- [ ] Worker-to-database access is restricted.
- [ ] Scheduler access is restricted.
- [ ] Queue traffic is authenticated.
- [ ] Egress is controlled.

## 115. Phase 4 Acceptance

- [ ] Billing provider connectivity is controlled.
- [ ] Credit operations use secure API paths.
- [ ] External service allowlists are defined.
- [ ] Egress costs are monitored.
- [ ] Production external integrations are isolated from lower environments.

## 116. Phase 5 Acceptance

- [ ] Job control path is authenticated.
- [ ] Run state is durable.
- [ ] WebSocket status path works.
- [ ] Job cancellation does not bypass safety boundaries.
- [ ] Network failure does not corrupt Job/Run state.

## 117. Phase 6 Acceptance

- [ ] Lab Agent identity exists.
- [ ] Outbound secure connectivity works.
- [ ] VPN option is documented.
- [ ] Tunnel option is documented.
- [ ] Robot network has no public inbound route.
- [ ] Lab disconnect triggers reconciliation.
- [ ] Cross-lab access is denied by default.
- [ ] Physical safety remains local.

## 118. Phase 7 Acceptance

- [ ] WebSocket scaling works.
- [ ] Reconnect works.
- [ ] REST reconciliation works.
- [ ] WebRTC signaling is authorized.
- [ ] WebRTC media is protected.
- [ ] TURN is secured if used.
- [ ] Media does not bypass control authorization.
- [ ] Telemetry bandwidth is bounded.

## 119. Phase 8 Acceptance

- [ ] Multi-zone production network exists.
- [ ] Firewall policy is hardened.
- [ ] Egress controls are enforced.
- [ ] Network flow logs are available.
- [ ] DNS recovery is tested.
- [ ] TLS certificate rotation is tested.
- [ ] Lab connectivity recovery is tested.
- [ ] Disaster recovery reconstruction is tested.
- [ ] Network cost is monitored.

## 120. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Public DB exposure | Critical | Private subnets + deny rules |
| Robot exposure | Critical | Agent boundary + no public route |
| Broad egress | High | Egress gateway/allowlist |
| VPN overreach | High | Route/firewall restrictions |
| WebSocket abuse | High | Auth + limits + quotas |
| WebRTC abuse | High | Auth + TURN controls |
| Certificate expiry | High | Automated renewal/alerts |
| DNS failure | High | Redundancy + monitoring |
| Lab NAT issues | Medium | Outbound Agent + tunnel |
| Network partition | Critical | Reconciliation |
| Cross-tenant leakage | Critical | Server-side authorization |
| Egress cost | High | Monitoring + media controls |
| IP exhaustion | Medium | Planned CIDR allocation |
| Firewall drift | High | IaC + review |

## 121. Risk: Public Robot Exposure

Mitigation:

- no public robot IP;
- no direct cloud-to-robot route;
- Lab Agent boundary;
- outbound-only default;
- strict lab firewall.

## 122. Risk: VPN Creates Excessive Trust

Mitigation:

- narrow routes;
- security groups;
- explicit ports;
- application authentication;
- per-lab identities;
- logging.

VPN connectivity must never imply unrestricted access.

## 123. Risk: WebRTC Becomes a Security Bypass

Mitigation:

- authenticated signaling;
- Job/Run authorization;
- short-lived sessions;
- resource-scoped tokens;
- TURN controls;
- session termination.

## 124. Risk: WebSocket Becomes State Authority

Mitigation:

- REST remains authoritative;
- durable PostgreSQL state;
- reconnect;
- replay where available;
- state reconciliation.

## 125. Risk: Network Partition During Execution

Mitigation:

- durable Job/Run state;
- Lab Agent local state;
- local safety;
- reconnect;
- reconciliation;
- explicit UNKNOWN/RECONCILIATION_REQUIRED states.

## 126. Open Questions

The following network decisions remain open:

1. Final cloud provider.
2. Final VPC CIDR ranges.
3. Number of production availability zones.
4. Final WAF/API gateway.
5. Final public DNS provider.
6. Final certificate management mechanism.
7. Final private endpoint strategy.
8. Final VPN provider/service.
9. Final Lab Agent tunnel transport.
10. Final WebSocket fan-out mechanism.
11. Final WebRTC SFU/TURN architecture.
12. Whether media uses a dedicated lab media gateway.
13. Exact egress allowlist.
14. Exact NAT architecture.
15. Exact management access mechanism.
16. Final network observability platform.
17. Production bandwidth targets.
18. Exact RPO/RTO.
19. Multi-region network timeline.
20. Cross-region traffic policy.

These decisions do not change the core network security model.

## 127. Network Acceptance Checklist

### VPC/VNet

- [ ] VPC/VNet boundary is defined.
- [ ] CIDR ranges are planned.
- [ ] Environment networks are isolated.
- [ ] Subnet roles are documented.
- [ ] IP capacity is sufficient.
- [ ] Future expansion is considered.

### Ingress

- [ ] Internet ingress terminates at controlled edge infrastructure.
- [ ] HTTPS is enforced.
- [ ] WAF is enabled where appropriate.
- [ ] API gateway is deployed.
- [ ] Load balancer health checks are configured.
- [ ] Direct API instance exposure is disabled.

### WebSocket

- [ ] WSS is used.
- [ ] Authentication is enforced.
- [ ] Subscription authorization is enforced.
- [ ] Rate limits exist.
- [ ] Connection limits exist.
- [ ] Reconnect behavior exists.
- [ ] REST reconciliation exists.

### WebRTC

- [ ] Signaling is authenticated.
- [ ] Media sessions are resource-scoped.
- [ ] TURN is secured if used.
- [ ] Media access expires.
- [ ] Media cannot bypass control authorization.
- [ ] Bandwidth is controlled.
- [ ] Media failure is distinct from execution failure.

### Lab Connectivity

- [ ] Lab Agent is the primary cloud-to-lab boundary.
- [ ] Outbound-only connectivity is supported.
- [ ] Secure tunnel is authenticated.
- [ ] VPN is available where required.
- [ ] Lab routes are restricted.
- [ ] Lab identity is unique.
- [ ] Agent credentials are revocable.
- [ ] Reconnect is supported.
- [ ] Reconciliation is supported.

### Segmentation

- [ ] Public zone is isolated.
- [ ] Application zone is private.
- [ ] Worker zone is private.
- [ ] Data zone is private.
- [ ] Management access is restricted.
- [ ] Lab network is isolated.
- [ ] Cross-environment routes are denied by default.
- [ ] Cross-lab routes are denied by default.

### Firewall

- [ ] Ingress is deny-by-default.
- [ ] Egress is controlled.
- [ ] PostgreSQL accepts only authorized sources.
- [ ] Queue accepts only authorized sources.
- [ ] Workers have no public ingress.
- [ ] Robot network has no public ingress.
- [ ] Temporary rules have expiration.
- [ ] Firewall changes are reviewed.

### DNS

- [ ] Public DNS is configured.
- [ ] Private DNS is configured.
- [ ] Private service names are not publicly exposed.
- [ ] DNS health is monitored.
- [ ] DNS failover/recovery is documented.

### TLS

- [ ] HTTPS is enforced.
- [ ] WSS is enforced.
- [ ] Certificates are centrally managed.
- [ ] Renewal is automated where possible.
- [ ] Expiry monitoring exists.
- [ ] Internal sensitive connections use encryption.

### Egress

- [ ] NAT is controlled.
- [ ] External destinations are allowlisted where practical.
- [ ] Egress is monitored.
- [ ] Egress costs are monitored.
- [ ] Unexpected destinations generate alerts.
- [ ] Production egress differs appropriately from development.

### Observability

- [ ] Load balancer logs exist.
- [ ] API gateway logs exist.
- [ ] Firewall logs exist.
- [ ] Lab connectivity logs exist.
- [ ] DNS health is observable.
- [ ] TLS health is observable.
- [ ] WebSocket metrics exist.
- [ ] WebRTC metrics exist.
- [ ] Network flow metrics exist.

### Reliability

- [ ] Multi-zone deployment is implemented where practical.
- [ ] Network failure does not corrupt durable state.
- [ ] Lab partition handling is defined.
- [ ] DNS recovery is defined.
- [ ] Certificate recovery is defined.
- [ ] VPN/tunnel recovery is defined.
- [ ] Network reconstruction is automated through IaC.

### Security

- [ ] No public PostgreSQL.
- [ ] No public queue.
- [ ] No public secret store.
- [ ] No public robot network.
- [ ] Tenant authorization remains server-side.
- [ ] Administrative access is restricted.
- [ ] Network rules are auditable.
- [ ] Security monitoring is enabled.

## 128. Final Network Invariants

The following invariants are mandatory:

1. The Internet can reach only explicitly approved edge services.
2. PostgreSQL is never directly exposed to the Internet.
3. Queues are never directly exposed to the Internet.
4. Secret stores are never directly exposed to the Internet.
5. Worker and scheduler workloads do not require public inbound access.
6. Robot networks are never directly exposed to the Internet.
7. Lab Agents are the primary cloud-to-lab trust boundary.
8. Outbound-only Lab Agent connectivity is the preferred default.
9. VPN connectivity is constrained by explicit routes and firewall policy.
10. A VPN does not automatically grant unrestricted lab access.
11. All public API traffic uses TLS.
12. WebSocket traffic uses authenticated WSS.
13. WebRTC sessions require authenticated and authorized signaling.
14. WebRTC media cannot bypass Job/Run/resource authorization.
15. Private application workloads use controlled egress.
16. Security rules are deny-by-default.
17. Environment networks are isolated.
18. Cross-lab network access is denied by default.
19. PostgreSQL remains the authoritative business-state store.
20. WebSocket remains a realtime transport, not a state authority.
21. Network failure does not imply robot failure.
22. Cloud cannot be used as a physical emergency-stop authority.
23. Lab safety remains local.
24. Network configuration is managed as code.
25. Production network changes are reviewed and auditable.
26. Network observability is enabled by default.
27. Network costs, especially media egress, are measurable.
28. The architecture supports future multi-zone and multi-region evolution
    without requiring premature active-active complexity.

## 129. Final Architecture Summary

The target production network is:

    ┌──────────────────────────────────────────────────────────────┐
    │                         INTERNET                             │
    │                                                              │
    │   RaaS Studio      Web Console       Admin / Users           │
    └───────────────────────┬──────────────────────────────────────┘
                            │
                      HTTPS / WSS
                            │
                            v
                 ┌──────────────────────┐
                 │ Public DNS / Edge    │
                 │ WAF / DDoS / TLS    │
                 └──────────┬───────────┘
                            │
                            v
                 ┌──────────────────────┐
                 │ API Gateway / LB     │
                 └──────────┬───────────┘
                            │
                  ┌─────────┴─────────┐
                  │ Private VPC/VNet  │
                  │                   │
                  │  ┌─────────────┐  │
                  │  │ Control     │  │
                  │  │ Plane       │  │
                  │  └──────┬──────┘  │
                  │         │         │
                  │  ┌──────┴──────┐  │
                  │  │ Workers /    │  │
                  │  │ Scheduler    │  │
                  │  └──────┬──────┘  │
                  │         │         │
                  │  ┌──────┴──────┐  │
                  │  │ Private     │  │
                  │  │ Data Zone   │  │
                  │  │             │  │
                  │  │ PostgreSQL  │  │
                  │  │ Queue       │  │
                  │  │ Storage     │  │
                  │  └─────────────┘  │
                  │                   │
                  │  ┌─────────────┐  │
                  │  │ Lab Gateway │  │
                  │  └──────┬──────┘  │
                  └─────────┼─────────┘
                            │
                     Secure Outbound
                     TLS / Tunnel / VPN
                            │
                            v
                 ┌──────────────────────┐
                 │ Lab Network          │
                 │                      │
                 │  ┌───────────────┐   │
                 │  │ Lab Agent     │   │
                 │  └───────┬───────┘   │
                 │          │           │
                 │    ┌─────┴─────┐     │
                 │    │ Kritva    │     │
                 │    │ Runtime   │     │
                 │    └─────┬─────┘     │
                 │          │           │
                 │       Robot(s)       │
                 │                      │
                 │  Robot LAN remains   │
                 │  private/local       │
                 └──────────────────────┘

The network architecture therefore provides a secure and scalable boundary
between the public RaaS product, private cloud infrastructure, geographically
distributed robot laboratories, and the local real-time robot environment.

> **The cloud connects to the lab; it does not expose the robot network.**
>
> **Control traffic, media traffic, durable state, and physical safety remain
> separate architectural concerns.**
