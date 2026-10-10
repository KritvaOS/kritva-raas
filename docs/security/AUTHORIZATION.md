# Kritva RaaS Authorization

## 1. Purpose

This document defines the production-grade authorization architecture for
Kritva RaaS.

Authorization determines whether an authenticated principal is permitted to
perform a requested operation against a specific resource in a specific
organization and execution context.

The fundamental authorization question is:

> Given this principal, may this principal perform this action on this
> resource under the current context and policy?

Authentication establishes identity. Authorization establishes permission.

The authorization system shall support:

- organization-scoped access;
- role-based access control (RBAC);
- attribute-based access control (ABAC);
- resource ownership;
- project membership;
- platform access;
- artifact operations;
- booking operations;
- credit operations;
- job and run operations;
- result access;
- lab administration;
- administrative access;
- support access;
- service identities;
- Lab Agent identities;
- delegated access;
- step-up authorization;
- policy enforcement;
- authorization decision auditing.

## 2. Scope

This document covers authorization for:

- Web Console;
- RaaS Studio;
- Control Plane APIs;
- Projects;
- Platforms;
- Labs;
- Resources;
- Robots;
- Artifacts;
- Bookings;
- Credits;
- Jobs;
- Runs;
- Results;
- Experiments;
- Organizations;
- administrative functions;
- support operations;
- service identities;
- Lab Agents.

It defines the authorization model from API entry point through domain service
and repository boundaries.

## 3. Non-Goals

This document does not define:

- password authentication;
- SSO authentication;
- MFA implementation;
- token issuance;
- source-code privacy;
- artifact signing;
- physical robot safety mechanisms;
- database physical storage design.

Those are covered by authentication, source privacy, artifact security, safety,
and database architecture documents.

Authorization must integrate with those controls.

## 4. Authorization Principles

The authorization architecture shall follow these principles:

1. Deny by default.
2. Authenticate before authorizing.
3. Authorize every protected operation.
4. Scope customer access to an organization.
5. Use RBAC for understandable baseline permissions.
6. Use ABAC for contextual restrictions.
7. Enforce authorization at multiple layers.
8. Never trust client-side authorization.
9. Never infer authorization from UI visibility.
10. Do not rely solely on database isolation.
11. Use explicit resource ownership.
12. Separate customer administration from platform administration.
13. Separate support access from unrestricted administrator access.
14. Require explicit delegation for impersonation or delegated operations.
15. Audit security-sensitive authorization decisions.
16. Protect authorization policy from unauthorized modification.
17. Fail closed when authorization state is unavailable.
18. Keep physical safety policy independent from cloud authorization.

# 5. Definitions

| Term | Definition |
|---|---|
| Principal | Authenticated human or machine identity |
| User | Human principal |
| Service Identity | Non-human application principal |
| Role | Named collection of permissions |
| Permission | Atomic authorization capability |
| Resource | Object against which an action is performed |
| Action | Operation requested against a resource |
| Scope | Organizational/resource boundary for authorization |
| RBAC | Role-Based Access Control |
| ABAC | Attribute-Based Access Control |
| Policy | Rule used to evaluate authorization |
| PEP | Policy Enforcement Point |
| PDP | Policy Decision Point |
| PIP | Policy Information Point |
| Resource Owner | Principal or organization controlling a resource |
| Delegation | Explicit temporary authority granted by one principal to another |
| Support Access | Controlled operational access for support personnel |
| Break-Glass | Emergency elevated access |
| Step-Up | Additional authentication required before sensitive authorization |
| Decision | Allow or deny result from policy evaluation |

# 6. Authorization Architecture

The conceptual architecture is:

    Client
      |
      v
    TLS / Authentication
      |
      v
    Principal
      |
      v
    +----------------------+
    | API Policy Enforcement|
    | Point                 |
    +----------+-----------+
               |
               v
    +----------------------+
    | Authorization        |
    | Decision Service     |
    +----------+-----------+
               |
       +-------+-------+
       |               |
       v               v
      RBAC            ABAC
       |               |
       +-------+-------+
               |
               v
    Resource / Organization Context
               |
               v
        Allow / Deny
               |
               v
       Domain Application Service
               |
               v
          Repository

The authorization decision shall be made from authenticated identity,
requested operation, resource context, organization context, and applicable
policy attributes.

# 7. RBAC and ABAC Strategy

Kritva RaaS shall use a hybrid RBAC + ABAC model.

RBAC answers:

> What classes of operations can this role perform?

ABAC answers:

> Is this operation permitted in this particular context?

Examples:

RBAC:

    PROJECT_MEMBER -> project.read

ABAC:

    user.organization_id == project.organization_id

Another example:

    LAB_ADMIN -> lab.resource.operate

combined with:

    resource.lab_id belongs to an organization administered by the principal

RBAC provides predictability.

ABAC provides contextual security.

# 8. RBAC Design

Roles shall be explicit named entities.

Roles should not directly encode individual resource IDs.

Examples:

    ORG_OWNER
    ORG_ADMIN
    ORG_MEMBER
    ORG_VIEWER
    PROJECT_OWNER
    PROJECT_ADMIN
    PROJECT_MEMBER
    PROJECT_VIEWER
    LAB_ADMIN
    LAB_OPERATOR
    PLATFORM_ADMIN
    SUPPORT_AGENT
    SYSTEM_ADMIN

Roles may be composed through policy inheritance where required.

# 9. Role Scope

Roles shall have an explicit scope.

Possible scopes:

    GLOBAL
    ORGANIZATION
    PROJECT
    LAB
    PLATFORM
    RESOURCE

A role assigned in one organization shall not automatically grant access to
another organization.

# 10. Role Assignment

Role assignment shall contain:

    principal_id
    role_id
    scope_type
    scope_id
    granted_by
    granted_at
    expires_at
    status

Role assignments shall be auditable.

Temporary roles should have explicit expiration.

# 11. Organization as Primary Tenant Boundary

Organization is the primary customer authorization boundary.

Customer-owned resources shall normally be associated with:

    organization_id

Authorization shall verify that the principal has the required relationship
with that organization.

The authorization sequence is:

    Principal
       |
       v
    Organization Membership
       |
       v
    Role
       |
       v
    Resource Ownership
       |
       v
    Action Permission

# 12. Organization Roles

Initial organization roles:

| Role | Purpose |
|---|---|
| ORG_OWNER | Full customer organization administration |
| ORG_ADMIN | Administrative management |
| ORG_MEMBER | Normal customer operations |
| ORG_VIEWER | Read-only customer access |

Additional specialized roles may be introduced without weakening the tenant
boundary.

# 13. ORG_OWNER

ORG_OWNER may manage:

- organization settings;
- memberships;
- organization roles;
- projects;
- billing-related organization operations where authorized;
- credit administration;
- platform access;
- organization-level API keys;
- organization-level integrations.

ORG_OWNER shall not bypass physical robot safety policy.

# 14. ORG_ADMIN

ORG_ADMIN may manage:

- users/memberships subject to policy;
- projects;
- project roles;
- platform bindings;
- organization settings;
- operational resources available to the organization.

Sensitive ownership operations may remain restricted to ORG_OWNER.

# 15. ORG_MEMBER

ORG_MEMBER may normally:

- view organization resources;
- create projects where policy allows;
- work within assigned projects;
- build/upload artifacts;
- request bookings;
- create jobs where authorized;
- view permitted results.

ORG_MEMBER shall not administer organization identity unless separately granted.

# 16. ORG_VIEWER

ORG_VIEWER is read-only.

It may view resources explicitly visible to the organization but may not:

- modify projects;
- create bookings;
- consume credits;
- execute jobs;
- modify artifacts;
- administer users.

# 17. Project Roles

Project roles:

    PROJECT_OWNER
    PROJECT_ADMIN
    PROJECT_MEMBER
    PROJECT_VIEWER

Project roles are subordinate to organization membership.

A project role cannot grant access to a principal who has no valid relationship
with the owning organization.

# 18. Project Owner

PROJECT_OWNER may:

- manage project settings;
- manage project members;
- manage platform bindings;
- manage project artifacts;
- request bookings;
- initiate authorized jobs;
- view project results.

Project ownership shall not override organization-level restrictions.

# 19. Project Admin

PROJECT_ADMIN may:

- manage project configuration;
- manage project members where permitted;
- manage platform bindings;
- manage artifacts;
- operate project workflows.

Ownership transfer remains a separate privileged operation.

# 20. Project Member

PROJECT_MEMBER may:

- read project information;
- create builds;
- manage permitted artifacts;
- request bookings;
- submit authorized jobs;
- view project runs/results.

Credit consumption remains subject to organization and project policy.

# 21. Project Viewer

PROJECT_VIEWER may:

- view project metadata;
- view permitted artifacts;
- view bookings;
- view runs;
- view results.

It may not modify execution state.

# 22. Platform Roles

Platform administration is distinct from customer project access.

Roles may include:

    PLATFORM_ADMIN
    PLATFORM_OPERATOR
    PLATFORM_VIEWER

Platform roles control the global platform catalog and platform lifecycle.

# 23. PLATFORM_ADMIN

PLATFORM_ADMIN may manage:

- platform definitions;
- platform versions;
- architectures;
- capabilities;
- configurations;
- lifecycle state;
- platform availability policy.

Platform administration shall not automatically grant access to customer
organization data.

# 24. Platform Viewer

PLATFORM_VIEWER may inspect:

- platform definitions;
- versions;
- capabilities;
- configurations;
- availability.

It shall not modify platform configuration.

# 25. Lab Roles

Lab roles:

    LAB_ADMIN
    LAB_OPERATOR
    LAB_VIEWER

Lab authorization is separate from global platform administration.

# 26. LAB_ADMIN

LAB_ADMIN may manage:

- lab configuration;
- Lab Agents;
- resources;
- robots;
- maintenance windows;
- availability windows;
- operational policies.

LAB_ADMIN shall not automatically gain unrestricted access to customer source
code or artifacts.

# 27. LAB_OPERATOR

LAB_OPERATOR may:

- inspect lab health;
- manage permitted operational state;
- start/stop permitted operational workflows;
- inspect job execution;
- respond to operational failures.

Physical safety gates remain independent.

# 28. LAB_VIEWER

LAB_VIEWER may inspect:

- lab status;
- resources;
- robot state;
- job state;
- operational telemetry where policy permits.

It may not modify operational state.

# 29. Support Role

SUPPORT_AGENT is a controlled operational role.

Support access shall be:

- explicitly granted;
- time limited where practical;
- scoped;
- audited;
- customer-visible where policy requires;
- unable to bypass safety restrictions.

Support access is not equivalent to SYSTEM_ADMIN.

# 30. System Administration

SYSTEM_ADMIN is a highly privileged role.

It may manage:

- global configuration;
- identity infrastructure;
- system-level policy;
- operational infrastructure.

SYSTEM_ADMIN shall not be used for normal customer operations.

Administrative privileges shall be separated from daily user identities where
practical.

# 31. Permission Model

Permissions should follow:

    <resource>.<action>

Examples:

    organization.read
    organization.update
    organization.members.manage

    project.read
    project.create
    project.update
    project.delete
    project.members.manage

    artifact.upload
    artifact.read
    artifact.execute

    booking.read
    booking.create
    booking.cancel

    job.create
    job.start
    job.stop
    job.read

    result.read
    result.download

# 32. Permission Naming

Permissions shall be:

- stable;
- explicit;
- machine-readable;
- documented;
- auditable.

Wildcard permissions should be restricted to internal administrative policy.

A permission shall not silently imply unrelated capabilities.

# 33. Organization Permission Matrix

| Permission | Owner | Admin | Member | Viewer |
|---|---:|---:|---:|---:|
| organization.read | Y | Y | Y | Y |
| organization.update | Y | Y | N | N |
| organization.members.manage | Y | Y | N | N |
| organization.roles.manage | Y | Y | N | N |
| organization.billing.read | Y | Y* | N | N |
| organization.billing.manage | Y | N* | N | N |
| organization.api_keys.manage | Y | Y* | N | N |
| organization.audit.read | Y | Y* | N | N |

`*` indicates policy-dependent delegated permission.

# 34. Project Permission Matrix

| Permission | Owner | Admin | Member | Viewer |
|---|---:|---:|---:|---:|
| project.read | Y | Y | Y | Y |
| project.update | Y | Y | N | N |
| project.delete | Y | Y* | N | N |
| project.members.manage | Y | Y | N | N |
| project.platform.manage | Y | Y | N | N |
| project.artifact.read | Y | Y | Y | Y |
| project.artifact.manage | Y | Y | Y | N |
| project.booking.create | Y | Y | Y* | N |
| project.job.create | Y | Y | Y* | N |
| project.result.read | Y | Y | Y | Y |

# 35. Artifact Permission Matrix

| Permission | Owner | Admin | Member | Viewer |
|---|---:|---:|---:|---:|
| artifact.read | Y | Y | Y | Y |
| artifact.upload | Y | Y | Y | N |
| artifact.validate | Y | Y | Y | N |
| artifact.delete | Y | Y | Y* | N |
| artifact.execute | Y | Y | Y* | N |
| artifact.download | Y | Y | Y | Y* |
| artifact.revoke | Y | Y | N | N |

Execution additionally requires platform, booking, capability and policy checks.

# 36. Booking Permission Matrix

| Permission | Owner | Admin | Member | Viewer |
|---|---:|---:|---:|---:|
| booking.read | Y | Y | Y | Y |
| booking.create | Y | Y | Y* | N |
| booking.cancel | Y | Y | Y* | N |
| booking.modify | Y | Y | Y* | N |
| booking.override | N | N | N | N |

Booking overrides require explicit privileged policy.

# 37. Job Permission Matrix

| Permission | Owner | Admin | Member | Viewer |
|---|---:|---:|---:|---:|
| job.read | Y | Y | Y | Y |
| job.create | Y | Y | Y* | N |
| job.start | Y | Y | Y* | N |
| job.stop | Y | Y | Y* | N |
| job.retry | Y | Y | Y* | N |
| job.override | N | N | N | N |

Job authorization is subject to artifact and booking policy.

# 38. Result Permission Matrix

| Permission | Owner | Admin | Member | Viewer |
|---|---:|---:|---:|---:|
| result.read | Y | Y | Y | Y |
| result.download | Y | Y | Y | Y* |
| result.delete | Y | Y | Y* | N |
| experiment.manage | Y | Y | Y* | N |
| comparison.create | Y | Y | Y* | N |

# 39. Lab Permission Matrix

| Permission | Lab Admin | Operator | Viewer |
|---|---:|---:|---:|
| lab.read | Y | Y | Y |
| lab.update | Y | N | N |
| lab.agent.manage | Y | N | N |
| resource.read | Y | Y | Y |
| resource.update | Y | Y* | N |
| robot.read | Y | Y | Y |
| robot.operate | Y | Y* | N |
| maintenance.manage | Y | Y* | N |

All robot operations remain subject to local safety controls.

# 40. Platform Permission Matrix

| Permission | Platform Admin | Viewer |
|---|---:|---:|
| platform.read | Y | Y |
| platform.create | Y | N |
| platform.update | Y | N |
| platform.version.manage | Y | N |
| platform.capability.manage | Y | N |
| platform.configuration.manage | Y | N |
| platform.lifecycle.manage | Y | N |

# 41. RBAC Limitations

RBAC alone cannot express:

- resource ownership;
- organization boundaries;
- time restrictions;
- booking windows;
- capability compatibility;
- emergency state;
- robot availability;
- support delegation;
- authentication assurance.

Therefore RBAC shall always be complemented by ABAC and domain rules.

# 42. ABAC Attributes

Authorization may use:

### Principal attributes

    principal_id
    principal_type
    organization_membership
    roles
    authentication_assurance
    device_trust
    support_status

### Resource attributes

    organization_id
    project_id
    owner_id
    platform_id
    resource_id
    status
    sensitivity

### Request attributes

    action
    command
    timestamp
    source
    network_context
    session_id

### Operational attributes

    booking_id
    booking_status
    resource_state
    robot_state
    maintenance_state
    capability
    artifact_state

# 43. Contextual Policy Example

An execution request may require:

    principal.organization_id == project.organization_id

AND:

    principal has project.job.create

AND:

    booking.status == CONFIRMED

AND:

    booking.organization_id == principal.organization_id

AND:

    artifact.status == APPROVED

AND:

    artifact.platform_version compatible with resource

AND:

    resource.state == AVAILABLE

AND:

    required capabilities authorized

Authorization is therefore a policy composition rather than a single role lookup.

# 44. Policy Enforcement Points

Authorization shall be enforced at multiple PEPs.

Primary PEPs:

1. API gateway/API middleware.
2. Application service.
3. Domain service.
4. Repository/data-access boundary.
5. Lab Agent.
6. Local runtime for operationally critical commands.

# 45. API PEP

The API PEP shall:

- authenticate principal;
- identify requested action;
- resolve organization context;
- invoke authorization policy;
- reject unauthorized requests.

The API layer shall not trust client-supplied organization IDs without validation.

# 46. Application Service PEP

Application services shall recheck authorization before domain mutation.

Example:

    BookingService.createBooking()

shall verify:

- principal;
- organization;
- project;
- platform;
- booking policy;
- requested operation.

# 47. Domain PEP

Domain services shall enforce invariants that must never be bypassed.

Example:

    JobService.startJob()

shall verify:

- authorized caller;
- valid job state;
- booking;
- artifact;
- platform;
- resource policy.

# 48. Repository Boundary

Repositories shall prevent accidental cross-tenant access.

Repository queries should include organization context where applicable.

Example conceptual interface:

    getProject(
        organization_id,
        project_id
    )

rather than:

    getProject(project_id)

when the entity is tenant-owned.

# 49. Lab Agent PEP

The Lab Agent shall independently enforce authorization for commands crossing
into the lab.

The cloud decision is not sufficient for safety-critical execution.

The Lab Agent shall verify:

- authenticated Control Plane identity;
- command authorization;
- lab/resource assignment;
- artifact identity;
- booking;
- capability;
- local safety state.

# 50. Local Runtime PEP

The local runtime shall independently reject commands that violate:

- physical safety;
- emergency stop;
- hardware interlock;
- local capability policy;
- execution lifecycle.

Cloud authorization cannot override a local safety denial.

# 51. Policy Decision Point

A centralized authorization service may provide common policy evaluation.

Conceptual:

    AuthorizationRequest
        |
        v
    +--------------------+
    | PDP                |
    | Policy Evaluation  |
    +---------+----------+
              |
              v
       AuthorizationDecision

The PDP shall remain provider-neutral.

# 52. Policy Information Points

Authorization decisions may obtain information from:

- Identity;
- Organization;
- Project;
- Platform;
- Booking;
- Credit;
- Lab;
- Resource;
- Artifact;
- Job;
- Run;
- safety state.

# 53. Authorization Decision

Conceptual response:

    {
        "decision": "ALLOW",
        "principal_id": "user-001",
        "action": "job.create",
        "resource_type": "project",
        "resource_id": "project-001",
        "organization_id": "org-001",
        "policy_version": "authz-1",
        "reason_code": "PROJECT_MEMBER_ALLOWED"
    }

The client should normally receive only the minimum information necessary.

# 54. Deny Reason

Internal authorization systems should record a reason code.

Examples:

    NOT_ORG_MEMBER
    ROLE_MISSING
    PROJECT_ACCESS_DENIED
    RESOURCE_NOT_FOUND
    BOOKING_REQUIRED
    PLATFORM_NOT_ALLOWED
    CAPABILITY_NOT_ALLOWED
    AUTH_ASSURANCE_TOO_LOW
    SUPPORT_SCOPE_EXPIRED
    RESOURCE_UNAVAILABLE

Detailed policy information shall not be exposed if it creates a security
disclosure.

# 55. Fail-Closed Behavior

If required authorization information cannot be retrieved:

    authorization unavailable
            |
            v
          DENY

The system shall not convert a policy-service outage into implicit allow.

# 56. Authorization Caching

Authorization decisions may be cached only where safe.

Cache keys should include:

    principal
    role/policy version
    organization
    resource
    action
    relevant context

Sensitive decisions should have short TTLs.

Role revocation shall invalidate affected authorization caches.

# 57. Policy Versioning

Authorization policies shall be versioned.

A decision should be traceable to:

    policy_version

Policy changes shall be auditable.

# 58. Permission Changes

Adding a permission shall not automatically grant it to every principal unless
the role definition explicitly includes it.

Changing a role is a security-sensitive operation.

# 59. Role Assignment Security

Role assignment requires:

- authenticated principal;
- permission to assign the role;
- organization scope;
- target principal validation;
- optional step-up authentication;
- audit event.

A principal must not grant privileges it does not possess.

# 60. Privilege Escalation Prevention

The system shall prevent:

    Member -> Owner

unless the operation is explicitly authorized.

Similarly:

    Project Admin -> Organization Owner

shall not be possible through project role administration.

# 61. Delegation

Delegation permits one principal to grant limited authority to another.

Delegation shall be:

- explicit;
- scoped;
- time bounded;
- auditable;
- revocable.

# 62. Delegation Model

Conceptual:

    Grantor
      |
      v
    Delegation
      |
      +-- principal
      +-- permissions
      +-- resources
      +-- organization
      +-- start
      +-- expiration
      |
      v
    Delegate

Delegation cannot exceed the grantor's effective authority.

# 63. Delegation Constraints

A delegation shall specify:

- grantor;
- delegate;
- scope;
- permissions;
- start time;
- expiration;
- reason;
- optional restrictions.

Delegation shall not create permanent hidden privileges.

# 64. Support Delegation

Support personnel may receive temporary access to troubleshoot customer
resources.

Example:

    Customer
       |
       v
    Support Grant
       |
       v
    SUPPORT_AGENT
       |
       v
    Specific Organization / Project
       |
       v
    Time-Limited Access

Support access shall be narrower than unrestricted system administration.

# 65. Support Access Restrictions

Support personnel shall not automatically receive:

- source code;
- private keys;
- passwords;
- customer credentials;
- unrestricted artifact contents;
- unrestricted robot control.

Support access shall follow least privilege.

# 66. Customer-Approved Support

Where practical, sensitive support operations should require customer approval.

Approval shall specify:

- scope;
- duration;
- support identity;
- requested operation.

# 67. Break-Glass Access

Emergency access may be required for production incidents.

Break-glass access shall:

- require explicit activation;
- require strong authentication;
- be time limited;
- be narrowly scoped;
- generate high-priority audit events;
- be reviewed afterward.

Break-glass shall not bypass physical safety controls.

# 68. Impersonation

Impersonation shall be avoided where possible.

If required, it shall preserve the original actor.

Audit identity should include:

    actor_principal
    effective_principal

Example:

    actor = support-agent-001
    effective_user = customer-user-001

The system shall never make impersonation indistinguishable from normal user
activity.

# 69. Audit of Authorization Decisions

Security-sensitive authorization decisions shall be auditable.

The audit record should contain:

    decision_id
    timestamp
    principal_id
    effective_principal_id
    action
    resource_type
    resource_id
    organization_id
    decision
    policy_version
    reason_code
    request_id
    session_id

Secrets shall not be included.

# 70. Audit Decision Categories

Audit priority should distinguish:

    ALLOW_NORMAL
    DENY_NORMAL
    ALLOW_SENSITIVE
    DENY_SENSITIVE
    DELEGATED_ALLOW
    BREAK_GLASS_ALLOW
    ADMIN_ALLOW
    POLICY_ERROR

# 71. Audit Integrity

Authorization audit records shall be protected from unauthorized modification.

The audit system should support:

- append-oriented storage;
- access control;
- retention;
- integrity monitoring;
- administrative review.

# 72. Resource Not Found vs Forbidden

The API may intentionally return:

    404 NOT_FOUND

instead of:

    403 FORBIDDEN

where revealing resource existence would create an information leak.

The behavior shall be defined consistently per resource class.

# 73. Organization Scoping

Every customer-owned request shall carry or derive an organization context.

Preferred:

    authenticated principal
            |
            v
    resolved organization
            |
            v
    resource lookup
            |
            v
    authorization

The client shall not be allowed to select an arbitrary organization ID.

# 74. Cross-Tenant Access Prevention

A customer principal shall never access another organization's:

- projects;
- artifacts;
- bookings;
- credits;
- jobs;
- runs;
- results;
- experiments;
- private operational information.

Cross-tenant access shall be denied even if the object identifier is known.

# 75. Tenant-Scoped Repository Pattern

Preferred:

    projectRepository.get(
        organizationId,
        projectId
    )

and:

    artifactRepository.list(
        organizationId,
        projectId
    )

rather than unscoped customer queries.

# 76. Organization Switching

If a user belongs to multiple organizations, the active organization shall be
explicitly selected.

The server shall verify that the principal has valid membership in the
selected organization.

Organization switching shall not modify the user's global identity.

# 77. Organization Membership Changes

When membership is removed:

- active authorization should be invalidated promptly;
- sessions may be revoked according to policy;
- role assignments become ineffective;
- delegated access from that organization is revoked.

# 78. Project Membership

Project membership is an additional authorization relationship.

The authorization system shall evaluate:

    organization membership
          +
    project membership
          +
    role
          +
    action

Project membership cannot cross organizations.

# 79. Platform Access

Platform access shall consider:

- organization eligibility;
- project platform binding;
- platform lifecycle;
- subscription/access policy;
- required capabilities;
- resource availability.

A visible platform is not necessarily executable by the caller.

# 80. Artifact Authorization

Artifact operations shall require:

- organization ownership;
- project relationship;
- artifact lifecycle state;
- action permission;
- platform compatibility where execution is requested.

Artifact security validation remains independent.

# 81. Booking Authorization

Booking authorization shall evaluate:

- organization;
- project;
- platform;
- resource;
- booking action;
- credit policy;
- time;
- user role.

A user may be allowed to create bookings but not override allocation conflicts.

# 82. Credit Authorization

Credit operations shall be strongly restricted.

Examples:

    credit.balance.read
    credit.grant
    credit.adjust
    credit.refund
    credit.ledger.read

Ledger adjustments should require privileged roles and explicit audit.

# 83. Job Authorization

Job creation shall require:

    authenticated principal
    +
    project permission
    +
    valid artifact
    +
    valid booking
    +
    platform eligibility
    +
    capability authorization

Job stop may have a different policy from job creation.

# 84. Run Authorization

Run access shall inherit organization/project boundaries.

A Run shall retain historical identity context including:

- organization;
- project;
- platform;
- artifact;
- resource;
- robot.

Historical access shall not accidentally cross tenants after later resource
changes.

# 85. Result Authorization

Results shall be accessible only to principals authorized for the associated
project/run.

Result download is a separate permission from result metadata visibility.

# 86. Experiment Authorization

Experiment management shall require project-level write access.

Viewing experiments may be granted to project viewers.

Adding Runs to experiments requires access to both:

- experiment;
- Run.

# 87. Administrative Authorization

Administrative APIs shall be separated from customer APIs where practical.

Example:

    /api/v1/...
    /admin/v1/...

The distinction is architectural, not a substitute for authorization.

Administrative APIs require explicit administrative roles.

# 88. Support API

Support operations should use separate endpoints or explicit operation classes.

Support requests should contain:

    support_case_id
    target_organization
    target_resource
    requested_action
    authorization_context

# 89. Admin Separation

Global administrators should not automatically inherit customer project roles.

Customer data access should be explicit.

This reduces accidental privileged access.

# 90. Service Authorization

Service identities require authorization just like users.

Example:

    result-processor
        |
        v
    result.write

does not imply:

    result-processor
        |
        X
    organization.admin

# 91. Lab Agent Authorization

The Lab Agent is authorized as a machine principal.

Its authorization shall be constrained by:

- Lab Agent identity;
- assigned lab;
- assigned resources;
- allowed command set;
- environment;
- platform;
- operational policy.

# 92. Lab Command Authorization

Commands shall have explicit permissions.

Examples:

    lab.read
    resource.read
    resource.reserve
    robot.status.read
    robot.execution.start
    robot.execution.stop
    robot.maintenance

High-risk commands require stronger policy.

# 93. Physical Safety Boundary

Authorization cannot authorize unsafe physical action.

Final execution path:

    Cloud Authorization
           |
           v
    Lab Agent Authorization
           |
           v
    Local Safety Policy
           |
           v
    Hardware Interlock
           |
           v
    Physical Operation

Any layer may deny.

# 94. Capability-Based Authorization

Artifact capability declarations shall participate in authorization.

Example:

    artifact requires:
        camera
        imu
        motor_control

Execution requires:

    declared capability
       +
    platform support
       +
    project authorization
       +
    booking authorization
       +
    lab policy
       +
    runtime grant

# 95. Network Authorization

Network capability shall be explicitly controlled.

An artifact declaring network access shall not automatically receive unrestricted
internet access.

Policy may restrict:

- destination;
- port;
- protocol;
- network;
- bandwidth;
- duration.

# 96. Administrative Policy Changes

Changes to authorization policy shall require:

- privileged authentication;
- explicit permission;
- audit;
- versioning;
- change review where applicable.

Production policy changes should follow controlled deployment.

# 97. Policy Deployment

Authorization policy changes should follow:

    Development
        |
        v
    Automated Tests
        |
        v
    Review
        |
        v
    Staging
        |
        v
    Validation
        |
        v
    Production

Emergency changes shall be separately audited.

# 98. Policy Testing

Policies shall be tested for:

- expected allows;
- expected denies;
- tenant isolation;
- privilege escalation;
- delegation;
- support access;
- expired roles;
- revoked memberships;
- stale cache;
- service identity restrictions.

# 99. Negative Authorization Testing

Security testing shall prioritize denial cases.

Examples:

- wrong organization;
- wrong project;
- missing role;
- expired delegation;
- revoked user;
- revoked service;
- invalid booking;
- incompatible platform;
- unauthorized capability;
- maintenance state;
- insufficient assurance.

# 100. Authorization Consistency

The same operation shall have consistent authorization semantics across:

- Web Console;
- Studio;
- REST API;
- WebSocket;
- administrative API;
- service-to-service interface.

UI restrictions shall never be considered sufficient.

# 101. API Command Matrix

| Command | Primary Permission | Additional Policy |
|---|---|---|
| project.create | project.create | organization membership |
| project.update | project.update | project scope |
| artifact.upload | artifact.upload | project access |
| artifact.execute | artifact.execute | booking + capability |
| booking.create | booking.create | credit + availability |
| booking.cancel | booking.cancel | ownership/policy |
| job.create | job.create | artifact + booking |
| job.start | job.start | resource + safety |
| job.stop | job.stop | execution ownership |
| result.read | result.read | project/run scope |
| result.download | result.download | result ownership |
| credit.adjust | credit.adjust | privileged admin |
| lab.update | lab.update | lab admin |
| robot.operate | robot.operate | local safety |
| user.manage | organization.members.manage | org admin |
| role.assign | organization.roles.manage | privilege containment |

# 102. Sensitive Operations

Sensitive operations should require:

- stronger role;
- recent authentication;
- MFA;
- explicit confirmation;
- audit.

Examples:

- role escalation;
- credit adjustment;
- API key creation;
- service identity creation;
- Lab Agent enrollment;
- robot operation;
- organization ownership transfer;
- policy modification.

# 103. Ownership Transfer

Ownership transfer shall be treated as a privileged workflow.

It shall require:

- current owner authorization;
- target validation;
- explicit confirmation;
- audit;
- notification;
- optional step-up authentication.

# 104. Role Expiration

Temporary roles shall have:

    granted_at
    expires_at

Expired roles shall not authorize operations.

No manual cleanup should be required for expiration enforcement.

# 105. Delegation Expiration

Delegations shall automatically expire.

An expired delegation shall not authorize requests even if cached policy data
exists.

# 106. Authorization Cache Invalidation

Cache invalidation shall occur after:

- membership removal;
- role change;
- delegation revocation;
- account suspension;
- resource ownership change;
- policy update.

Short TTLs provide a secondary safety mechanism.

# 107. Authorization Concurrency

Authorization must account for state changes during operations.

Example:

    Authorization: ALLOW
          |
          v
    Booking Cancelled
          |
          v
    Execute Operation

Sensitive operations should revalidate relevant state within the transaction
or domain boundary.

# 108. Transactional Authorization

For critical mutations, authorization and state transition should be evaluated
within a transaction where practical.

Examples:

- credit adjustment;
- booking allocation;
- job state transition;
- role assignment.

# 109. Authorization and Idempotency

Authorization shall be evaluated before executing an idempotent operation.

An idempotency key shall not allow an unauthorized principal to replay another
principal's operation.

Idempotency records shall remain organization scoped.

# 110. Authorization and Audit

Authorization decisions and business audit events are related but distinct.

Authorization audit answers:

> Was this action permitted?

Business audit answers:

> What business state changed?

Sensitive operations should produce both.

# 111. Authorization Observability

Operational metrics should include:

- authorization allow rate;
- authorization deny rate;
- denied-by-policy count;
- policy evaluation latency;
- policy errors;
- stale policy/cache events;
- cross-tenant denial attempts;
- privileged access events.

# 112. Security Alerts

Alerts should include:

- repeated cross-tenant access attempts;
- privilege escalation attempts;
- abnormal role changes;
- unusual support access;
- repeated break-glass usage;
- unexpected administrative commands;
- abnormal Lab Agent command patterns.

# 113. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Missing tenant filter | Repository scoping + integration tests |
| Privilege escalation | Role hierarchy + privilege containment |
| Stale authorization cache | Short TTL + invalidation |
| Client bypass | Server-side PEP |
| Admin overreach | Separate roles + audit |
| Support abuse | Time-limited delegation |
| Policy outage | Fail closed |
| Hidden permission | Explicit permission catalog |
| Cross-project leakage | Project-scoped authorization |
| Service overprivilege | Scoped service roles |
| Unsafe robot operation | Local safety PEP |
| Delegation abuse | Expiration + audit |
| Audit tampering | Append-oriented protected logs |
| Policy misconfiguration | Versioning + tests + review |

# 114. Failure Modes

Authorization failures shall be categorized.

Examples:

    AUTHZ_DENIED
    AUTHZ_CONTEXT_UNAVAILABLE
    AUTHZ_POLICY_ERROR
    AUTHZ_RESOURCE_NOT_FOUND
    AUTHZ_SCOPE_INVALID
    AUTHZ_ROLE_MISSING
    AUTHZ_DELEGATION_EXPIRED

A policy evaluation error shall not become an allow.

# 115. Data Model

The Identity/Organization domains should own:

- roles;
- permissions;
- role assignments;
- organization memberships;
- project memberships;
- delegations.

Authorization infrastructure may own:

- policy versions;
- decision metadata;
- policy configuration.

Domain resources remain owned by their respective domains.

# 116. Role Assignment Example

Conceptual:

    role_assignment {
        principal_id: user-001
        role: PROJECT_MEMBER
        scope_type: PROJECT
        scope_id: project-001
        granted_by: user-002
        granted_at: ...
        expires_at: null
    }

# 117. Delegation Example

Conceptual:

    delegation {
        grantor: org-owner-001
        delegate: support-agent-001
        organization_id: org-001
        permissions:
            - project.read
            - result.read
        resources:
            - project-001
        starts_at: ...
        expires_at: ...
        reason: "Support case 1234"
    }

# 118. Authorization Service Interface

Conceptual:

    AuthorizationDecision authorize(
        Principal principal,
        Action action,
        ResourceContext resource,
        RequestContext request
    )

The result shall contain:

    decision
    policy_version
    reason_code
    decision_id

# 119. Resource Context

Conceptual:

    ResourceContext {
        organization_id
        resource_type
        resource_id
        project_id
        owner_id
        attributes
    }

Only attributes required for policy evaluation should be loaded.

# 120. Request Context

Conceptual:

    RequestContext {
        request_id
        timestamp
        source
        session_id
        device_id
        authentication_assurance
    }

# 121. Authorization Flow

    Client
      |
      v
    Authenticate
      |
      v
    Resolve Principal
      |
      v
    Resolve Organization
      |
      v
    Resolve Resource
      |
      v
    Evaluate RBAC
      |
      v
    Evaluate ABAC
      |
      v
    Evaluate Domain Constraints
      |
      v
    ALLOW / DENY
      |
      v
    Execute Operation
      |
      v
    Audit

# 122. Job Start Flow

    Start Job
       |
       v
    Authenticate
       |
       v
    job.start permission?
       |
       v
    Project membership?
       |
       v
    Organization match?
       |
       v
    Booking valid?
       |
       v
    Artifact approved?
       |
       v
    Platform compatible?
       |
       v
    Capability authorized?
       |
       v
    Resource eligible?
       |
       v
    Local safety allows?
       |
       v
    START
       |
       +----> DENY at any failed gate

# 123. Support Access Flow

    Support Case
         |
         v
    Scope Request
         |
         v
    Customer Approval / Policy
         |
         v
    Time-Limited Delegation
         |
         v
    Support Agent
         |
         v
    Authorization
         |
         v
    Operation
         |
         v
    Audit + Notification

# 124. Administrative Access Flow

    Administrator
         |
         v
    Strong Authentication
         |
         v
    Admin Role
         |
         v
    Step-Up if Sensitive
         |
         v
    Authorization
         |
         v
    Operation
         |
         v
    Audit

# 125. Phase Mapping

| Phase | Authorization Focus |
|---|---|
| Phase 0 | Authorization model and permission catalogue |
| Phase 1 | Organization and basic RBAC |
| Phase 2 | Project/resource authorization |
| Phase 3 | API/service authorization |
| Phase 4 | ABAC, delegation and step-up |
| Phase 5 | Booking/job/lab execution authorization |
| Phase 6 | Lab Agent and operational command policy |
| Phase 7 | Support, audit and policy governance |
| Phase 8 | Production hardening and formal security validation |

# 126. Phase 0

Define:

- principal model;
- resource hierarchy;
- organization boundary;
- role catalogue;
- permission catalogue;
- policy architecture;
- audit model.

No production endpoint should exist without an explicit authorization model.

# 127. Phase 1

Implement:

- organization membership;
- organization roles;
- basic project roles;
- API enforcement;
- tenant-scoped repositories;
- deny-by-default behavior.

# 128. Phase 2

Implement:

- project membership;
- platform authorization;
- artifact authorization;
- booking authorization;
- result authorization.

# 129. Phase 3

Implement:

- service authorization;
- API key scopes;
- machine permissions;
- worker permissions;
- idempotency authorization.

# 130. Phase 4

Implement:

- ABAC;
- step-up authorization;
- delegation;
- temporary roles;
- capability-based authorization.

# 131. Phase 5

Implement:

- job authorization;
- run authorization;
- booking/execution policy;
- Lab Agent authorization;
- artifact capability authorization.

# 132. Phase 6

Implement:

- robot command authorization;
- lab resource policy;
- local safety enforcement;
- operational command restrictions;
- device/resource identity integration.

# 133. Phase 7

Implement:

- support access;
- customer-approved delegation;
- break-glass access;
- decision audit;
- security analytics;
- policy governance.

# 134. Phase 8

Implement:

- authorization penetration testing;
- tenant-isolation testing;
- privilege escalation testing;
- formal role review;
- policy performance validation;
- production access review;
- disaster/recovery authorization testing.

# 135. Open Questions

The following require final implementation decisions:

1. Which exact RBAC roles are mandatory for the first production release?
2. Which permissions are customer configurable?
3. Which roles can assign other roles?
4. Is a separate billing administrator role required?
5. Is a separate security administrator role required?
6. Which platform permissions are organization-specific versus global?
7. What ABAC engine or implementation approach will be used?
8. Will policies be stored in database configuration or version-controlled code?
9. What policy propagation latency is acceptable?
10. Which decisions may be cached?
11. What exact support approval model will be used?
12. Is customer approval mandatory for support access?
13. What operations require step-up authentication?
14. Which robot commands require explicit human authorization?
15. How will offline Lab Agent authorization work?
16. What authorization state may be cached locally?
17. How will authorization changes propagate to disconnected labs?
18. What exact break-glass workflow will be used?
19. Which authorization events require customer notification?
20. What retention period applies to authorization decision logs?

# 136. Acceptance Criteria: Core Model

- [ ] Authorization is separate from authentication.
- [ ] Deny-by-default is enforced.
- [ ] Every protected operation has an explicit permission.
- [ ] Organization is the primary tenant boundary.
- [ ] RBAC is implemented.
- [ ] ABAC supports contextual policy.
- [ ] Roles have explicit scopes.
- [ ] Role assignments are auditable.
- [ ] Temporary roles can expire.
- [ ] Privilege escalation is prevented.

# 137. Acceptance Criteria: Organization

- [ ] Organization membership is validated.
- [ ] Organization context is server-derived or validated.
- [ ] Cross-tenant access is denied.
- [ ] Organization roles are implemented.
- [ ] Organization owner privileges are defined.
- [ ] Organization admin privileges are defined.
- [ ] Organization member privileges are defined.
- [ ] Organization viewer is read-only.
- [ ] Membership removal invalidates access promptly.

# 138. Acceptance Criteria: Projects

- [ ] Project roles exist.
- [ ] Project roles require organization membership.
- [ ] Project permissions are explicit.
- [ ] Project member access is scoped.
- [ ] Project viewer cannot mutate project state.
- [ ] Project ownership changes are privileged.
- [ ] Cross-project access is prevented where unauthorized.

# 139. Acceptance Criteria: Permissions

- [ ] Permission names are stable.
- [ ] Permissions are documented.
- [ ] Permission matrix is maintained.
- [ ] Sensitive operations have explicit permissions.
- [ ] Wildcard permissions are restricted.
- [ ] Service permissions are least privilege.
- [ ] Lab permissions are explicit.
- [ ] Administrative permissions are separated.

# 140. Acceptance Criteria: ABAC

- [ ] Principal attributes are available.
- [ ] Resource attributes are available.
- [ ] Request context is available.
- [ ] Organization attributes are enforced.
- [ ] Project attributes are enforced.
- [ ] Booking state can participate in execution authorization.
- [ ] Platform compatibility can participate in authorization.
- [ ] Capability declarations can participate in authorization.
- [ ] Resource state can participate in authorization.
- [ ] Safety state can deny execution independently.

# 141. Acceptance Criteria: PEP/PDP

- [ ] API authorization is enforced server-side.
- [ ] Application services enforce critical authorization.
- [ ] Domain invariants cannot be bypassed.
- [ ] Repository access is tenant scoped.
- [ ] Lab Agent enforces its own command boundary.
- [ ] Local runtime can independently deny unsafe commands.
- [ ] PDP failure fails closed.
- [ ] Authorization decisions are traceable.

# 142. Acceptance Criteria: Administration

- [ ] Administrative roles are explicit.
- [ ] Customer administrators are separated from global administrators.
- [ ] Sensitive admin operations require strong authentication.
- [ ] Role assignment is audited.
- [ ] Privilege escalation is prevented.
- [ ] Production administrative access is reviewed.
- [ ] Administrative policy changes are versioned.

# 143. Acceptance Criteria: Support

- [ ] Support access is separately modeled.
- [ ] Support access is scoped.
- [ ] Support access can expire.
- [ ] Support access is audited.
- [ ] Customer approval is supported where required.
- [ ] Support cannot bypass safety.
- [ ] Support cannot automatically access source code.
- [ ] Support cannot obtain customer credentials.

# 144. Acceptance Criteria: Delegation

- [ ] Delegation is explicit.
- [ ] Delegation has a grantor.
- [ ] Delegation has a delegate.
- [ ] Delegation has defined permissions.
- [ ] Delegation has defined resource scope.
- [ ] Delegation has expiration.
- [ ] Delegation is revocable.
- [ ] Delegation cannot exceed grantor authority.
- [ ] Delegated actions preserve actor identity.

# 145. Acceptance Criteria: Break-Glass

- [ ] Break-glass access is explicit.
- [ ] Break-glass requires strong authentication.
- [ ] Break-glass is time limited.
- [ ] Break-glass is narrowly scoped.
- [ ] Break-glass actions are audited.
- [ ] Break-glass usage is reviewed.
- [ ] Break-glass cannot override physical safety.

# 146. Acceptance Criteria: Resource Authorization

- [ ] Projects are tenant scoped.
- [ ] Artifacts are tenant scoped.
- [ ] Bookings are tenant scoped.
- [ ] Credits are tenant scoped.
- [ ] Jobs are tenant scoped.
- [ ] Runs are tenant scoped.
- [ ] Results are tenant scoped.
- [ ] Experiments are tenant scoped.
- [ ] Labs enforce their configured ownership boundary.

# 147. Acceptance Criteria: Execution

- [ ] Job creation requires explicit permission.
- [ ] Job start requires explicit permission.
- [ ] Job stop requires explicit permission.
- [ ] Booking authorization is validated.
- [ ] Artifact authorization is validated.
- [ ] Platform authorization is validated.
- [ ] Capability authorization is validated.
- [ ] Resource eligibility is validated.
- [ ] Local safety remains authoritative.

# 148. Acceptance Criteria: Audit

- [ ] Sensitive authorization decisions are audited.
- [ ] Denied decisions can be investigated.
- [ ] Allow decisions for privileged operations are audited.
- [ ] Delegated decisions are identifiable.
- [ ] Break-glass decisions are identifiable.
- [ ] Policy version is recorded.
- [ ] Reason codes are recorded.
- [ ] Request/session context is recorded.
- [ ] Secrets are excluded from audit data.
- [ ] Audit records are protected from unauthorized modification.

# 149. Acceptance Criteria: Caching

- [ ] Authorization cache keys include required context.
- [ ] Cache TTL is policy controlled.
- [ ] Role changes invalidate affected decisions.
- [ ] Membership removal invalidates affected decisions.
- [ ] Delegation revocation invalidates affected decisions.
- [ ] Policy changes invalidate affected decisions.
- [ ] Cache failure does not create implicit allow.

# 150. Acceptance Criteria: Testing

- [ ] Unit tests cover every core permission.
- [ ] Integration tests cover organization isolation.
- [ ] Negative tests cover unauthorized access.
- [ ] Privilege escalation tests pass.
- [ ] Delegation tests pass.
- [ ] Support access tests pass.
- [ ] Break-glass tests pass.
- [ ] Service identity tests pass.
- [ ] Lab Agent authorization tests pass.
- [ ] Cross-tenant tests pass.
- [ ] Authorization outage tests pass.
- [ ] Cache invalidation tests pass.

# 151. Acceptance Criteria: Production

- [ ] Authorization policy is version controlled.
- [ ] Policy deployment is reviewed.
- [ ] Production policies are environment isolated.
- [ ] Administrative access is audited.
- [ ] Security monitoring is operational.
- [ ] Authorization metrics are available.
- [ ] Cross-tenant attack detection is available.
- [ ] Privilege escalation monitoring is available.
- [ ] Support access review is operational.
- [ ] Authorization penetration testing is completed.

# 152. Final Authorization Invariants

The following invariants are mandatory:

1. Authentication does not imply authorization.
2. Every protected operation requires an explicit authorization decision.
3. Authorization defaults to deny.
4. Organization is the primary customer isolation boundary.
5. Cross-tenant access is never granted by object identifier knowledge.
6. RBAC defines baseline privileges.
7. ABAC evaluates contextual constraints.
8. Project roles cannot bypass organization boundaries.
9. Service identities are explicitly authorized.
10. Lab Agents are explicitly authorized.
11. Support access is scoped and auditable.
12. Delegation is explicit, limited and revocable.
13. Break-glass access is exceptional and auditable.
14. Authorization failures fail closed.
15. Client-side controls are never trusted as the security boundary.
16. Repository access is tenant scoped.
17. Sensitive authorization decisions are auditable.
18. Policy versions are traceable.
19. Authorization state changes invalidate relevant access promptly.
20. Critical execution authorization is revalidated at the appropriate domain
    and operational boundaries.
21. Artifact capabilities participate in execution authorization.
22. Booking state participates in execution authorization.
23. Local robot safety can independently deny any operation.
24. Cloud authorization cannot override emergency stop or hardware safety.
25. No administrative role implicitly grants unrestricted customer data access.

# 153. Final Authorization Architecture

    +--------------------------------------------------------------------+
    |                         CLIENTS                                    |
    |                                                                    |
    | Web Console | RaaS Studio | API Client | Service | Lab Agent       |
    +-------------------------------+------------------------------------+
                                    |
                                    v
                         +----------------------+
                         | Authentication       |
                         | Identity             |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         | Principal Context    |
                         +----------+-----------+
                                    |
                                    v
                    +-------------------------------+
                    | Policy Enforcement Point      |
                    +---------------+---------------+
                                    |
                                    v
                    +-------------------------------+
                    | Authorization Decision Point  |
                    |                               |
                    | RBAC + ABAC + Scope + Policy  |
                    +---------------+---------------+
                                    |
                  +-----------------+------------------+
                  |                                    |
                  v                                    v
        +----------------------+             +----------------------+
        | Domain Authorization |             | Operational Policy   |
        |                      |             |                      |
        | Org / Project        |             | Booking / Resource  |
        | Artifact / Credit    |             | Capability / Safety |
        | Job / Result         |             | Lab / Robot         |
        +----------+-----------+             +----------+-----------+
                   |                                    |
                   +----------------+-------------------+
                                    |
                                    v
                           ALLOW / DENY
                                    |
                                    v
                           Domain Operation
                                    |
                                    v
                              Audit Event

The definitive authorization principle is:

> Kritva RaaS shall use deny-by-default, organization-scoped hybrid RBAC and
> ABAC authorization with explicit permissions, multiple policy enforcement
> points, controlled administration, time-bounded delegation, auditable
> support access, and independent lab/runtime safety enforcement. No client,
> role, API credential, support identity, cloud policy, or authorization
> decision shall be capable of bypassing tenant isolation or overriding the
> local safety boundary of a physical robot.
