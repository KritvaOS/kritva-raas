# Kritva RaaS Platforms Schema

## 1. Document Control

| Item | Value |
|---|---|
| Document | Platforms Schema |
| Path | `docs/database/schema/PLATFORMS.md` |
| Product | Kritva Robotics-as-a-Service |
| Database | PostgreSQL |
| Primary Catalog Schema | `platform` |
| Operational Schema | `lab` |
| Primary Domain Owner | Platform / Lab modules |
| Tenant Model | Global platform catalog with organization-scoped project usage |
| Identifier Strategy | UUIDv7 |
| Data Classification | Internal / Confidential / Operational |
| Phase Coverage | Phase 0–Phase 8 |
| Related Domains | Organization, Project, Artifact, Booking, Credit, Execution, Result |

# 2. Purpose

This document defines the production-grade PostgreSQL data model for robotic
platforms and the physical resources through which Kritva RaaS executes jobs.

The model establishes authoritative persistence for:

- robotic platform definitions;
- platform versions;
- hardware/software capabilities;
- processor and target architectures;
- platform configurations;
- laboratories;
- physical robots;
- allocatable resources;
- maintenance windows;
- availability;
- platform/resource operational state.

The schema provides the catalog and resource foundation required for:

    Project
       |
    Target Platform
       |
    Platform Version
       |
    Capability / Architecture
       |
    Lab
       |
    Resource
       |
    Robot
       |
    Booking
       |
    Job / Run

# 3. Scope

This document defines:

- platforms;
- platform versions;
- architectures;
- capabilities;
- platform-version capabilities;
- platform configurations;
- labs;
- robots;
- resources;
- resource configurations;
- maintenance windows;
- availability;
- lifecycle state;
- ownership;
- tenant relationships;
- audit metadata;
- foreign keys;
- unique constraints;
- indexes;
- check constraints;
- example records;
- SQL DDL;
- repository interfaces;
- application services;
- platform selection flows;
- availability flows;
- maintenance flows;
- Phase 0–Phase 8 mapping;
- risks;
- open questions;
- acceptance criteria.

# 4. Non-Goals

This document does not define:

- robot firmware implementation;
- robot real-time control;
- EtherCAT control;
- physical emergency-stop implementation;
- Lab Agent protocol in full;
- Job execution state machine;
- booking transaction implementation;
- credit ledger implementation;
- project ownership;
- artifact binary format;
- customer source-code storage.

The Lab Agent and runtime remain responsible for local robot safety and
real-time execution.

# 5. Design Principles

The platform model follows these principles:

1. A Platform is a reusable robotic product definition.
2. A Platform Version identifies a compatible release of a Platform.
3. Capabilities describe what a Platform Version supports.
4. Architectures describe CPU/target execution architectures.
5. Labs contain physical or simulated resources.
6. Robots represent physical robot identities.
7. Resources represent allocatable execution units.
8. A Resource may represent a whole robot or a specific allocatable capacity.
9. Platform catalog data is global unless explicitly designated otherwise.
10. Physical resources may belong to a Lab or organization according to
   deployment policy.
11. Availability is derived from resource state, maintenance, reservations and
   operational policy.
12. Maintenance windows block allocation for their effective intervals.
13. Platform configuration is versioned and auditable.
14. Historical execution must retain sufficient platform/resource identity.
15. Project target bindings reference catalog records rather than copying them.
16. Platform compatibility is validated against the Artifact manifest.
17. Safety state remains local to the Lab Agent/robot.
18. Database state is authoritative for catalog and resource allocation state.

# 6. Global Platform Versus Tenant Data

The platform catalog is normally global:

    platform.platforms
    platform.platform_versions
    platform.architectures
    platform.capabilities
    platform.platform_version_capabilities

Customer-specific platform usage is represented through:

    organization
          |
    project
          |
    project_platform_bindings

Physical operational infrastructure is represented through:

    lab.labs
          |
    lab.resources
          |
    lab.robots

This separation prevents every customer from receiving a duplicate copy of
the platform catalog.

# 7. Platform Model

The conceptual hierarchy is:

    Platform
       |
       +-- Platform Version
       |      |
       |      +-- Architecture
       |      +-- Capability
       |      +-- Configuration
       |
       +-- Project Bindings
       |
       +-- Resources
              |
              +-- Robot
              |
              +-- Lab

# 8. Platform Lifecycle

Recommended Platform lifecycle:

    DRAFT
      |
      v
    ACTIVE
      |
      +----> DEPRECATED
      |
      +----> RETIRED

A retired platform remains available for historical references but cannot be
selected for new bookings.

# 9. Platform Version Lifecycle

Recommended:

    DRAFT
      |
      v
    ACTIVE
      |
      +----> DEPRECATED
      |
      +----> RETIRED

A version may be deprecated while later versions remain active.

# 10. Resource Lifecycle

Recommended:

    PROVISIONING
        |
        v
    AVAILABLE
        |
        +----> RESERVED
        |
        +----> BUSY
        |
        +----> MAINTENANCE
        |
        +----> OFFLINE
        |
        +----> FAULT
        |
        +----> RETIRED

Operational state may change frequently and must be reconciled with the Lab
Agent.

# 11. Robot Lifecycle

Recommended:

    PROVISIONING
        |
        v
    ACTIVE
        |
        +----> MAINTENANCE
        |
        +----> FAULT
        |
        +----> RETIRED

A Robot is physical identity; Resource is the allocatable execution object.

# 12. Capability Model

Capabilities represent stable functional requirements.

Examples:

- camera;
- depth_camera;
- imu;
- lidar;
- arm_control;
- leg_control;
- gripper;
- microphone;
- speaker;
- gpu;
- npu;
- ethercat;
- realtime_control;
- ros2;
- simulation.

Capabilities must have stable keys.

# 13. Architecture Model

Architecture identifies the execution target.

Examples:

| Architecture Key | Meaning |
|---|---|
| x86_64 | 64-bit x86 |
| arm64 | 64-bit ARM |
| armv7 | 32-bit ARM |
| riscv64 | 64-bit RISC-V |

Architecture is distinct from host OS.

A Windows x86_64 Studio host may build an ARM64 artifact for an ARM64 robot.

# 14. Platform Table

`platform.platforms` is the authoritative product-level robotic platform
catalog.

Examples:

- Humanoid-A;
- Humanoid-B;
- Kritva Edge Reference;
- simulation platform.

# 15. `platform.platforms` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| platform_id | uuid | No | UUIDv7 | Platform identifier |
| platform_key | varchar(100) | No | None | Stable platform key |
| name | varchar(200) | No | None | Display name |
| description | varchar(2000) | Yes | NULL | Description |
| platform_type | platform_type | No | `PHYSICAL` | Platform category |
| status | platform_status | No | `DRAFT` | Lifecycle |
| manufacturer | varchar(200) | Yes | NULL | Manufacturer |
| model | varchar(200) | Yes | NULL | Model |
| default_architecture_id | uuid | Yes | NULL | Default architecture |
| metadata | jsonb | No | `'{}'` | Bounded metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 16. Platform Type

Initial values:

    PHYSICAL
    SIMULATED
    REFERENCE

A simulated platform can use the same compatibility model as a physical
platform while executing on simulator resources.

# 17. Platform DDL

    CREATE SCHEMA IF NOT EXISTS platform;

    CREATE TYPE platform.platform_type AS ENUM (
        'PHYSICAL',
        'SIMULATED',
        'REFERENCE'
    );

    CREATE TYPE platform.platform_status AS ENUM (
        'DRAFT',
        'ACTIVE',
        'DEPRECATED',
        'RETIRED'
    );

    CREATE TABLE platform.platforms (
        platform_id UUID PRIMARY KEY,
        platform_key VARCHAR(100) NOT NULL,
        name VARCHAR(200) NOT NULL,
        description VARCHAR(2000) NULL,
        platform_type platform.platform_type
            NOT NULL DEFAULT 'PHYSICAL',
        status platform.platform_status
            NOT NULL DEFAULT 'DRAFT',
        manufacturer VARCHAR(200) NULL,
        model VARCHAR(200) NULL,
        default_architecture_id UUID NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT platforms_key_unique
            UNIQUE (platform_key),
        CONSTRAINT platforms_metadata_object_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 18. Platform Indexes

Required:

    UNIQUE (platform_key)

Recommended:

    INDEX (status)

    INDEX (platform_type, status)

    INDEX (manufacturer, model)

# 19. Platform Version Table

`platform.platform_versions` represents a specific compatible software and
hardware definition of a Platform.

A version may define:

- runtime compatibility;
- SDK compatibility;
- operating system;
- architecture;
- protocol compatibility;
- capabilities;
- configuration model.

# 20. `platform.platform_versions` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| platform_version_id | uuid | No | UUIDv7 | Version identifier |
| platform_id | uuid | No | None | Parent Platform |
| version | varchar(64) | No | None | Version string |
| status | platform_version_status | No | `DRAFT` | Lifecycle |
| runtime_version | varchar(64) | Yes | NULL | Kritva runtime |
| sdk_min_version | varchar(64) | Yes | NULL | Minimum SDK |
| sdk_max_version | varchar(64) | Yes | NULL | Maximum SDK |
| os_name | varchar(100) | Yes | NULL | Target OS |
| os_version | varchar(100) | Yes | NULL | OS version |
| architecture_id | uuid | No | None | Target architecture |
| release_notes | varchar(5000) | Yes | NULL | Release notes |
| metadata | jsonb | No | `'{}'` | Version metadata |
| released_at | timestamptz | Yes | NULL | Release timestamp |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 21. Platform Version Constraints

A Platform Version must belong to exactly one Platform.

The tuple:

    (platform_id, version)

must be unique.

# 22. Platform Version DDL

    CREATE TYPE platform.platform_version_status AS ENUM (
        'DRAFT',
        'ACTIVE',
        'DEPRECATED',
        'RETIRED'
    );

    CREATE TABLE platform.platform_versions (
        platform_version_id UUID PRIMARY KEY,
        platform_id UUID NOT NULL,
        version VARCHAR(64) NOT NULL,
        status platform.platform_version_status
            NOT NULL DEFAULT 'DRAFT',
        runtime_version VARCHAR(64) NULL,
        sdk_min_version VARCHAR(64) NULL,
        sdk_max_version VARCHAR(64) NULL,
        os_name VARCHAR(100) NULL,
        os_version VARCHAR(100) NULL,
        architecture_id UUID NOT NULL,
        release_notes VARCHAR(5000) NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        released_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT platform_versions_platform_fk
            FOREIGN KEY (platform_id)
            REFERENCES platform.platforms(platform_id)
            ON DELETE RESTRICT,
        CONSTRAINT platform_versions_architecture_fk
            FOREIGN KEY (architecture_id)
            REFERENCES platform.architectures(architecture_id)
            ON DELETE RESTRICT,
        CONSTRAINT platform_versions_unique
            UNIQUE (platform_id, version),
        CONSTRAINT platform_versions_metadata_object_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 23. Platform Version Indexes

Recommended:

    INDEX (platform_id, status)

    INDEX (architecture_id, status)

    INDEX (released_at)

# 24. Architecture Table

`platform.architectures` defines target processor architectures.

Architectures are global catalog data.

# 25. `platform.architectures` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| architecture_id | uuid | No | UUIDv7 | Architecture identifier |
| architecture_key | varchar(64) | No | None | Stable key |
| name | varchar(100) | No | None | Display name |
| description | varchar(500) | Yes | NULL | Description |
| bit_width | integer | No | None | CPU bit width |
| endianness | varchar(16) | No | `'little'` | Endianness |
| status | architecture_status | No | `ACTIVE` | Lifecycle |
| metadata | jsonb | No | `'{}'` | Bounded metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |

# 26. Architecture DDL

    CREATE TYPE platform.architecture_status AS ENUM (
        'ACTIVE',
        'DEPRECATED'
    );

    CREATE TABLE platform.architectures (
        architecture_id UUID PRIMARY KEY,
        architecture_key VARCHAR(64) NOT NULL,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(500) NULL,
        bit_width INTEGER NOT NULL,
        endianness VARCHAR(16) NOT NULL DEFAULT 'little',
        status platform.architecture_status NOT NULL DEFAULT 'ACTIVE',
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT architectures_key_unique
            UNIQUE (architecture_key),
        CONSTRAINT architectures_bit_width_check
            CHECK (bit_width IN (32, 64)),
        CONSTRAINT architectures_endianness_check
            CHECK (endianness IN ('little', 'big')),
        CONSTRAINT architectures_metadata_object_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 27. Capability Table

`platform.capabilities` defines globally recognized platform capabilities.

A capability is intentionally stable and machine-readable.

# 28. `platform.capabilities` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| capability_id | uuid | No | UUIDv7 | Capability identifier |
| capability_key | varchar(100) | No | None | Stable key |
| name | varchar(150) | No | None | Display name |
| category | varchar(80) | No | None | Capability category |
| description | varchar(500) | Yes | NULL | Description |
| status | capability_status | No | `ACTIVE` | Lifecycle |
| metadata | jsonb | No | `'{}'` | Capability metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |

# 29. Capability DDL

    CREATE TYPE platform.capability_status AS ENUM (
        'ACTIVE',
        'DEPRECATED'
    );

    CREATE TABLE platform.capabilities (
        capability_id UUID PRIMARY KEY,
        capability_key VARCHAR(100) NOT NULL,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(80) NOT NULL,
        description VARCHAR(500) NULL,
        status platform.capability_status
            NOT NULL DEFAULT 'ACTIVE',
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT capabilities_key_unique
            UNIQUE (capability_key),
        CONSTRAINT capabilities_metadata_object_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 30. Platform-Version Capability Table

Capabilities are assigned to Platform Versions rather than directly to
Projects.

# 31. `platform.platform_version_capabilities` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| platform_version_id | uuid | No | None | Platform version |
| capability_id | uuid | No | None | Capability |
| support_level | capability_support_level | No | `SUPPORTED` | Support strength |
| configuration | jsonb | No | `'{}'` | Capability configuration |
| created_at | timestamptz | No | `now()` | Assignment time |
| created_by | uuid | Yes | NULL | Assigning actor |

# 32. Capability Support Level

Initial values:

    SUPPORTED
    OPTIONAL
    EXPERIMENTAL

# 33. Capability Relationship DDL

    CREATE TYPE platform.capability_support_level AS ENUM (
        'SUPPORTED',
        'OPTIONAL',
        'EXPERIMENTAL'
    );

    CREATE TABLE platform.platform_version_capabilities (
        platform_version_id UUID NOT NULL,
        capability_id UUID NOT NULL,
        support_level platform.capability_support_level
            NOT NULL DEFAULT 'SUPPORTED',
        configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        PRIMARY KEY (platform_version_id, capability_id),
        CONSTRAINT pvc_platform_version_fk
            FOREIGN KEY (platform_version_id)
            REFERENCES platform.platform_versions(platform_version_id)
            ON DELETE CASCADE,
        CONSTRAINT pvc_capability_fk
            FOREIGN KEY (capability_id)
            REFERENCES platform.capabilities(capability_id)
            ON DELETE RESTRICT,
        CONSTRAINT pvc_configuration_object_check
            CHECK (jsonb_typeof(configuration) = 'object')
    );

# 34. Platform Configuration Table

`platform.platform_configurations` represents versioned configuration profiles
for a Platform Version.

Examples:

- developer;
- research;
- production;
- simulation;
- high-performance.

# 35. `platform.platform_configurations` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| configuration_id | uuid | No | UUIDv7 | Configuration ID |
| platform_version_id | uuid | No | None | Target version |
| configuration_key | varchar(100) | No | None | Stable configuration key |
| name | varchar(150) | No | None | Display name |
| description | varchar(1000) | Yes | NULL | Description |
| status | configuration_status | No | `ACTIVE` | Lifecycle |
| configuration | jsonb | No | `'{}'` | Declarative configuration |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 36. Configuration DDL

    CREATE TYPE platform.configuration_status AS ENUM (
        'ACTIVE',
        'DEPRECATED',
        'RETIRED'
    );

    CREATE TABLE platform.platform_configurations (
        configuration_id UUID PRIMARY KEY,
        platform_version_id UUID NOT NULL,
        configuration_key VARCHAR(100) NOT NULL,
        name VARCHAR(150) NOT NULL,
        description VARCHAR(1000) NULL,
        status platform.configuration_status
            NOT NULL DEFAULT 'ACTIVE',
        configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT platform_configurations_version_fk
            FOREIGN KEY (platform_version_id)
            REFERENCES platform.platform_versions(platform_version_id)
            ON DELETE RESTRICT,
        CONSTRAINT platform_configurations_unique
            UNIQUE (platform_version_id, configuration_key),
        CONSTRAINT platform_configurations_object_check
            CHECK (jsonb_typeof(configuration) = 'object')
    );

# 37. Configuration Principle

Configuration JSONB is bounded declarative metadata.

It must not contain:

- passwords;
- private keys;
- API tokens;
- session tokens;
- customer source code;
- unrestricted logs.

Secrets belong in the secret-management infrastructure.

# 38. Lab Table

The Lab schema is operational infrastructure associated with platform
availability.

`lab.labs` represents a physical or simulated execution facility.

# 39. `lab.labs` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| lab_id | uuid | No | UUIDv7 | Lab identifier |
| lab_key | varchar(100) | No | None | Stable key |
| name | varchar(200) | No | None | Lab name |
| description | varchar(1000) | Yes | NULL | Description |
| lab_type | lab_type | No | `PHYSICAL` | Physical/simulated |
| status | lab_status | No | `PROVISIONING` | Lifecycle |
| organization_id | uuid | Yes | NULL | Optional owner |
| timezone | varchar(64) | No | `'UTC'` | Scheduling timezone |
| location_metadata | jsonb | No | `'{}'` | Bounded location metadata |
| metadata | jsonb | No | `'{}'` | Operational metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 40. Lab Ownership

A Lab may be:

- Kritva-operated/global;
- organization-owned;
- simulation infrastructure.

`organization_id` is nullable because not every Lab is tenant-owned.

A global Lab is available according to platform/commercial policy.

# 41. Lab DDL

    CREATE SCHEMA IF NOT EXISTS lab;

    CREATE TYPE lab.lab_type AS ENUM (
        'PHYSICAL',
        'SIMULATED'
    );

    CREATE TYPE lab.lab_status AS ENUM (
        'PROVISIONING',
        'ACTIVE',
        'MAINTENANCE',
        'OFFLINE',
        'RETIRED'
    );

    CREATE TABLE lab.labs (
        lab_id UUID PRIMARY KEY,
        lab_key VARCHAR(100) NOT NULL,
        name VARCHAR(200) NOT NULL,
        description VARCHAR(1000) NULL,
        lab_type lab.lab_type NOT NULL DEFAULT 'PHYSICAL',
        status lab.lab_status NOT NULL DEFAULT 'PROVISIONING',
        organization_id UUID NULL,
        timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
        location_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT labs_key_unique
            UNIQUE (lab_key),
        CONSTRAINT labs_organization_fk
            FOREIGN KEY (organization_id)
            REFERENCES organization.organizations(organization_id)
            ON DELETE RESTRICT,
        CONSTRAINT labs_location_metadata_check
            CHECK (jsonb_typeof(location_metadata) = 'object'),
        CONSTRAINT labs_metadata_object_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 42. Robot Table

`lab.robots` represents physical robot identity.

A Robot is not itself necessarily the allocatable scheduling unit.

# 43. `lab.robots` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| robot_id | uuid | No | UUIDv7 | Robot identifier |
| lab_id | uuid | No | None | Lab |
| platform_id | uuid | No | None | Platform |
| serial_number | varchar(200) | No | None | Physical serial |
| robot_key | varchar(100) | No | None | Lab-local stable key |
| name | varchar(200) | Yes | NULL | Human name |
| status | robot_status | No | `PROVISIONING` | Robot lifecycle |
| commissioned_at | timestamptz | Yes | NULL | Commissioning |
| retired_at | timestamptz | Yes | NULL | Retirement |
| metadata | jsonb | No | `'{}'` | Bounded metadata |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 44. Robot DDL

    CREATE TYPE lab.robot_status AS ENUM (
        'PROVISIONING',
        'ACTIVE',
        'MAINTENANCE',
        'FAULT',
        'RETIRED'
    );

    CREATE TABLE lab.robots (
        robot_id UUID PRIMARY KEY,
        lab_id UUID NOT NULL,
        platform_id UUID NOT NULL,
        serial_number VARCHAR(200) NOT NULL,
        robot_key VARCHAR(100) NOT NULL,
        name VARCHAR(200) NULL,
        status lab.robot_status NOT NULL DEFAULT 'PROVISIONING',
        commissioned_at TIMESTAMPTZ NULL,
        retired_at TIMESTAMPTZ NULL,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT robots_lab_fk
            FOREIGN KEY (lab_id)
            REFERENCES lab.labs(lab_id)
            ON DELETE RESTRICT,
        CONSTRAINT robots_platform_fk
            FOREIGN KEY (platform_id)
            REFERENCES platform.platforms(platform_id)
            ON DELETE RESTRICT,
        CONSTRAINT robots_lab_serial_unique
            UNIQUE (lab_id, serial_number),
        CONSTRAINT robots_lab_key_unique
            UNIQUE (lab_id, robot_key),
        CONSTRAINT robots_metadata_object_check
            CHECK (jsonb_typeof(metadata) = 'object')
    );

# 45. Resource Table

`lab.resources` represents an allocatable execution resource.

Examples:

- complete robot;
- robot control partition;
- simulator instance;
- dedicated GPU;
- development robot slot.

For the initial RaaS implementation, a resource will normally map to one
physical Robot or one simulator execution unit.

# 46. `lab.resources` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| resource_id | uuid | No | UUIDv7 | Resource identifier |
| lab_id | uuid | No | None | Lab |
| robot_id | uuid | Yes | NULL | Physical robot |
| platform_id | uuid | No | None | Platform |
| resource_key | varchar(100) | No | None | Lab-local key |
| name | varchar(200) | No | None | Resource name |
| resource_type | resource_type | No | `ROBOT` | Resource category |
| status | resource_status | No | `PROVISIONING` | Operational state |
| capacity_units | integer | No | `1` | Allocation capacity |
| configuration | jsonb | No | `'{}'` | Resource configuration |
| last_heartbeat_at | timestamptz | Yes | NULL | Last Lab Agent heartbeat |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 47. Resource Type

Initial values:

    ROBOT
    SIMULATOR
    GPU
    WORKSTATION

# 48. Resource Status

Initial values:

    PROVISIONING
    AVAILABLE
    RESERVED
    BUSY
    MAINTENANCE
    OFFLINE
    FAULT
    RETIRED

# 49. Resource DDL

    CREATE TYPE lab.resource_type AS ENUM (
        'ROBOT',
        'SIMULATOR',
        'GPU',
        'WORKSTATION'
    );

    CREATE TYPE lab.resource_status AS ENUM (
        'PROVISIONING',
        'AVAILABLE',
        'RESERVED',
        'BUSY',
        'MAINTENANCE',
        'OFFLINE',
        'FAULT',
        'RETIRED'
    );

    CREATE TABLE lab.resources (
        resource_id UUID PRIMARY KEY,
        lab_id UUID NOT NULL,
        robot_id UUID NULL,
        platform_id UUID NOT NULL,
        resource_key VARCHAR(100) NOT NULL,
        name VARCHAR(200) NOT NULL,
        resource_type lab.resource_type NOT NULL DEFAULT 'ROBOT',
        status lab.resource_status NOT NULL DEFAULT 'PROVISIONING',
        capacity_units INTEGER NOT NULL DEFAULT 1,
        configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
        last_heartbeat_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT resources_lab_fk
            FOREIGN KEY (lab_id)
            REFERENCES lab.labs(lab_id)
            ON DELETE RESTRICT,
        CONSTRAINT resources_robot_fk
            FOREIGN KEY (robot_id)
            REFERENCES lab.robots(robot_id)
            ON DELETE RESTRICT,
        CONSTRAINT resources_platform_fk
            FOREIGN KEY (platform_id)
            REFERENCES platform.platforms(platform_id)
            ON DELETE RESTRICT,
        CONSTRAINT resources_lab_key_unique
            UNIQUE (lab_id, resource_key),
        CONSTRAINT resources_capacity_check
            CHECK (capacity_units > 0),
        CONSTRAINT resources_configuration_object_check
            CHECK (jsonb_typeof(configuration) = 'object')
    );

# 50. Resource Robot Relationship

The initial invariant is:

    resource_type = ROBOT
        => robot_id IS NOT NULL

For non-robot resources:

    robot_id MAY BE NULL

This should be enforced with a check constraint if the product model remains
stable.

# 51. Resource Indexes

Recommended:

    INDEX (lab_id, status)

    INDEX (platform_id, status)

    INDEX (robot_id)

    INDEX (status)

    INDEX (last_heartbeat_at)

# 52. Maintenance Windows

Maintenance windows define intervals during which a Resource or Lab cannot be
allocated normally.

A maintenance window may be:

- planned;
- emergency;
- preventive;
- software upgrade;
- hardware repair.

# 53. `lab.maintenance_windows` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| maintenance_window_id | uuid | No | UUIDv7 | Window identifier |
| lab_id | uuid | Yes | NULL | Lab-wide maintenance |
| resource_id | uuid | Yes | NULL | Resource-specific maintenance |
| maintenance_type | maintenance_type | No | `PLANNED` | Maintenance category |
| status | maintenance_status | No | `SCHEDULED` | Lifecycle |
| title | varchar(200) | No | None | Maintenance title |
| description | varchar(1000) | Yes | NULL | Description |
| starts_at | timestamptz | No | None | Start |
| ends_at | timestamptz | No | None | End |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 54. Maintenance Ownership

At least one of:

    lab_id
    resource_id

must be supplied.

A maintenance window may be:

- Lab-wide;
- Resource-specific.

# 55. Maintenance DDL

    CREATE TYPE lab.maintenance_type AS ENUM (
        'PLANNED',
        'PREVENTIVE',
        'EMERGENCY',
        'UPGRADE',
        'REPAIR'
    );

    CREATE TYPE lab.maintenance_status AS ENUM (
        'SCHEDULED',
        'ACTIVE',
        'COMPLETED',
        'CANCELLED'
    );

    CREATE TABLE lab.maintenance_windows (
        maintenance_window_id UUID PRIMARY KEY,
        lab_id UUID NULL,
        resource_id UUID NULL,
        maintenance_type lab.maintenance_type
            NOT NULL DEFAULT 'PLANNED',
        status lab.maintenance_status
            NOT NULL DEFAULT 'SCHEDULED',
        title VARCHAR(200) NOT NULL,
        description VARCHAR(1000) NULL,
        starts_at TIMESTAMPTZ NOT NULL,
        ends_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT maintenance_lab_fk
            FOREIGN KEY (lab_id)
            REFERENCES lab.labs(lab_id)
            ON DELETE RESTRICT,
        CONSTRAINT maintenance_resource_fk
            FOREIGN KEY (resource_id)
            REFERENCES lab.resources(resource_id)
            ON DELETE RESTRICT,
        CONSTRAINT maintenance_target_check
            CHECK (
                lab_id IS NOT NULL
                OR resource_id IS NOT NULL
            ),
        CONSTRAINT maintenance_time_check
            CHECK (ends_at > starts_at)
    );

# 56. Maintenance Indexes

Recommended:

    INDEX (lab_id, starts_at, ends_at)

    INDEX (resource_id, starts_at, ends_at)

    INDEX (status, starts_at, ends_at)

# 57. Availability

Availability is the effective ability of a Resource to accept a Booking.

It is not simply a stored boolean.

Effective availability is:

    Resource Operational State
        +
    Lab Operational State
        +
    Maintenance Windows
        +
    Existing Bookings
        +
    Resource Capacity
        +
    Platform Eligibility
        +
    Scheduling Policy

# 58. Availability Table

A durable availability table may store recurring operating windows and
exceptions.

It should not duplicate every minute of availability.

# 59. `lab.availability_windows` Columns

| Column | Type | Nullable | Default | Description |
|---|---|---:|---|---|
| availability_window_id | uuid | No | UUIDv7 | Window ID |
| lab_id | uuid | Yes | NULL | Lab |
| resource_id | uuid | Yes | NULL | Resource |
| day_of_week | smallint | No | None | ISO day 1–7 |
| starts_at_local | time | No | None | Daily start |
| ends_at_local | time | No | None | Daily end |
| status | availability_status | No | `ACTIVE` | Window status |
| effective_from | date | No | None | Start date |
| effective_until | date | Yes | NULL | End date |
| created_at | timestamptz | No | `now()` | Creation |
| updated_at | timestamptz | No | `now()` | Update |
| created_by | uuid | Yes | NULL | Creating actor |
| updated_by | uuid | Yes | NULL | Updating actor |

# 60. Availability Ownership

At least one target is required:

    lab_id
    resource_id

A resource-specific window overrides or refines the Lab default according to
scheduling policy.

# 61. Availability DDL

    CREATE TYPE lab.availability_status AS ENUM (
        'ACTIVE',
        'DISABLED'
    );

    CREATE TABLE lab.availability_windows (
        availability_window_id UUID PRIMARY KEY,
        lab_id UUID NULL,
        resource_id UUID NULL,
        day_of_week SMALLINT NOT NULL,
        starts_at_local TIME NOT NULL,
        ends_at_local TIME NOT NULL,
        status lab.availability_status
            NOT NULL DEFAULT 'ACTIVE',
        effective_from DATE NOT NULL,
        effective_until DATE NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_by UUID NULL,
        updated_by UUID NULL,
        CONSTRAINT availability_lab_fk
            FOREIGN KEY (lab_id)
            REFERENCES lab.labs(lab_id)
            ON DELETE RESTRICT,
        CONSTRAINT availability_resource_fk
            FOREIGN KEY (resource_id)
            REFERENCES lab.resources(resource_id)
            ON DELETE RESTRICT,
        CONSTRAINT availability_target_check
            CHECK (
                lab_id IS NOT NULL
                OR resource_id IS NOT NULL
            ),
        CONSTRAINT availability_day_check
            CHECK (day_of_week BETWEEN 1 AND 7),
        CONSTRAINT availability_time_check
            CHECK (ends_at_local > starts_at_local),
        CONSTRAINT availability_date_check
            CHECK (
                effective_until IS NULL
                OR effective_until >= effective_from
            )
    );

# 62. Availability Indexes

Recommended:

    INDEX (lab_id, day_of_week, status)

    INDEX (resource_id, day_of_week, status)

    INDEX (effective_from, effective_until)

# 63. Platform Configuration and Resource Configuration

There are two configuration layers:

    Platform Configuration
        |
        | defines supported configuration profile
        v
    Resource Configuration
        |
        | defines actual installed/allocated instance
        v
    Robot / Resource

Platform configuration is catalog data.

Resource configuration is operational data.

# 64. Resource Configuration

Resource configuration is stored in `lab.resources.configuration`.

It may contain:

- installed runtime profile;
- available peripherals;
- resource-specific limits;
- operational labels.

It must not contain credentials or secrets.

# 65. Platform Compatibility

Compatibility is determined by:

    Artifact Manifest
          +
    Platform Version
          +
    Architecture
          +
    Required Capabilities
          +
    Runtime / SDK Constraints
          +
    Resource Configuration

A Project binding alone does not guarantee runtime compatibility.

# 66. Project Relation

Projects reference Platforms through:

    project.project_platform_bindings

The Platform domain remains authoritative for:

- platform definition;
- version;
- capabilities;
- architecture;
- configuration.

# 67. Artifact Relation

Artifacts identify their intended:

- platform;
- platform version;
- architecture;
- runtime;
- SDK;
- required capabilities.

Artifact validation must compare these against Platform records.

# 68. Booking Relation

Booking uses:

    platform_id
    resource_id
    lab_id
    start_time
    end_time

Availability is evaluated before booking creation.

The Booking domain owns the booking transaction.

# 69. Credit Relation

Credit plans are platform-specific.

The relationship is:

    Platform
       |
    Credit Plan
       |
    Organization Wallet
       |
    Credit Ledger

Platform availability therefore influences the commercial catalog.

# 70. Execution Relation

Jobs execute against:

    platform
    platform_version
    resource
    robot
    lab

The Run should preserve historical snapshots of these identifiers where
required.

# 71. Historical Platform Identity

A Run should retain:

- platform ID;
- platform version ID;
- resource ID;
- robot ID;
- runtime version;
- SDK version;
- architecture.

This prevents historical execution meaning from depending on mutable catalog
records.

# 72. Lab Agent Relation

The Lab Agent is the operational bridge between cloud control plane and local
robot infrastructure.

Conceptually:

    Cloud Control Plane
          |
    Lab Agent
          |
    Resource
          |
    Robot / Simulator

The Lab Agent protocol remains separate from this database schema.

# 73. Lab Agent Heartbeat

Resource operational state may be updated from:

- Lab Agent registration;
- heartbeat;
- health reports;
- deployment state;
- execution reconciliation.

The database should not infer physical safety state solely from a stale
heartbeat.

# 74. Safety Boundary

The database is not a physical safety controller.

The following remain local:

- physical E-stop;
- motor safety;
- hardware interlocks;
- local safe-state transitions;
- real-time watchdog behavior.

Cloud `resource.status` is an operational representation, not a replacement
for physical safety state.

# 75. Resource Availability Flow

    Query Availability
          |
    Resolve Platform
          |
    Resolve Candidate Resources
          |
    Check Resource Status
          |
    Check Lab Status
          |
    Check Maintenance
          |
    Check Existing Bookings
          |
    Check Capacity
          |
    Check Platform Compatibility
          |
    Apply Scheduling Policy
          |
    Return Available Slots

# 76. Maintenance Flow

    Schedule Maintenance
          |
    Validate Resource/Lab
          |
    Check Existing Bookings
          |
    Prevent New Allocation
          |
    Execute Maintenance
          |
    Update Operational State
          |
    Complete Window
          |
    Restore Availability

# 77. Platform Registration Flow

    Create Platform
          |
    Create Version
          |
    Define Architecture
          |
    Define Capabilities
          |
    Bind Capabilities
          |
    Define Configuration
          |
    Provision Resources
          |
    Validate Lab
          |
    Activate Platform

# 78. Platform Activation

A Platform Version should not become `ACTIVE` until:

- architecture is valid;
- required capabilities exist;
- configuration is valid;
- compatibility metadata is valid;
- at least one supported execution path is defined where required.

# 79. Resource Provisioning

    Create Lab
       |
    Register Resource
       |
    Associate Platform
       |
    Optional Robot
       |
    Configure Runtime
       |
    Register Lab Agent
       |
    Health Check
       |
    Resource AVAILABLE

# 80. Example Platform Row

    platform_id:
      0194c7d0-8b00-7abc-9def-523456789001

    platform_key:
      humanoid-a

    name:
      Kritva Humanoid A

    platform_type:
      PHYSICAL

    status:
      ACTIVE

# 81. Example Platform Version

    platform_version_id:
      0194c7d0-8b00-7abc-9def-523456789002

    platform_id:
      0194c7d0-8b00-7abc-9def-523456789001

    version:
      1.0

    architecture:
      arm64

    status:
      ACTIVE

# 82. Example Capability

    capability_key:
      camera

    name:
      RGB Camera

    category:
      vision

    status:
      ACTIVE

# 83. Example Lab

    lab_id:
      0194c7d0-8b00-7abc-9def-523456789003

    lab_key:
      blr-lab-01

    name:
      Kritva Bangalore Robotics Lab

    lab_type:
      PHYSICAL

    status:
      ACTIVE

# 84. Example Robot

    robot_id:
      0194c7d0-8b00-7abc-9def-523456789004

    lab_id:
      0194c7d0-8b00-7abc-9def-523456789003

    platform_id:
      0194c7d0-8b00-7abc-9def-523456789001

    serial_number:
      HMA-0001

    status:
      ACTIVE

# 85. Example Resource

    resource_id:
      0194c7d0-8b00-7abc-9def-523456789005

    lab_id:
      0194c7d0-8b00-7abc-9def-523456789003

    robot_id:
      0194c7d0-8b00-7abc-9def-523456789004

    platform_id:
      0194c7d0-8b00-7abc-9def-523456789001

    resource_key:
      humanoid-a-01

    status:
      AVAILABLE

# 86. Example Maintenance Window

    maintenance_window_id:
      0194c7d0-8b00-7abc-9def-523456789006

    resource_id:
      0194c7d0-8b00-7abc-9def-523456789005

    maintenance_type:
      PREVENTIVE

    starts_at:
      2026-10-15T09:00:00Z

    ends_at:
      2026-10-15T12:00:00Z

# 87. Example Availability Window

    availability_window_id:
      0194c7d0-8b00-7abc-9def-523456789007

    lab_id:
      0194c7d0-8b00-7abc-9def-523456789003

    day_of_week:
      1

    starts_at_local:
      09:00

    ends_at_local:
      18:00

# 88. Complete Relationship Diagram

    +----------------------+
    | platform.platforms   |
    |----------------------|
    | platform_id PK       |
    | platform_key         |
    | status               |
    +----------+-----------+
               |
               | 1:N
               v
    +---------------------------+
    | platform_versions        |
    |---------------------------|
    | platform_version_id PK   |
    | platform_id FK           |
    | architecture_id FK       |
    +------+--------------------+
           |
           +----------------------+
           |                      |
           v                      v
    capabilities             configurations
           ^
           |
    platform_version_capabilities

# 89. Operational Relationship Diagram

    platform.platforms
          |
          +----------------------+
          |                      |
          v                      v
      lab.robots            lab.resources
          |                      |
          |                      |
          v                      v
       lab.labs <---------- lab.resources
          |
          +--> maintenance_windows
          |
          +--> availability_windows

# 90. Full RaaS Resource Relationship

    Organization
        |
    Project
        |
    Platform Binding
        |
    Platform
        |
    Platform Version
        |
    Capability / Architecture
        |
    Lab
        |
    Resource
        |
    Robot
        |
    Booking
        |
    Job
        |
    Run
        |
    Result

# 91. Repository Interfaces

Recommended repositories:

    PlatformRepository
    PlatformVersionRepository
    ArchitectureRepository
    CapabilityRepository
    PlatformConfigurationRepository
    LabRepository
    RobotRepository
    ResourceRepository
    MaintenanceRepository
    AvailabilityRepository

# 92. Platform Repository

Recommended operations:

    create
    get_by_id
    get_by_key
    list_active
    update
    activate
    deprecate
    retire

# 93. Platform Version Repository

Recommended operations:

    create
    get
    list_by_platform
    activate
    deprecate
    retire
    get_compatible_versions

# 94. Capability Repository

Recommended operations:

    create
    get_by_key
    list
    assign_to_version
    remove_from_version
    list_for_version

# 95. Resource Repository

Recommended operations:

    create
    get
    list_by_lab
    list_by_platform
    update_status
    update_heartbeat
    configure
    retire

# 96. Maintenance Repository

Recommended operations:

    create
    get
    list_by_resource
    list_by_lab
    cancel
    activate
    complete

# 97. Availability Repository

Recommended operations:

    create_window
    update_window
    disable_window
    list_for_lab
    list_for_resource
    resolve_effective_schedule

# 98. Application Services

Recommended services:

    PlatformService
    PlatformVersionService
    CapabilityService
    PlatformConfigurationService
    LabService
    RobotService
    ResourceService
    MaintenanceService
    AvailabilityService
    PlatformCompatibilityService

# 99. Platform Compatibility Service

Conceptual interface:

    checkCompatibility(
        artifact_manifest,
        platform_id,
        platform_version_id,
        resource_id
    )

The result must identify:

- compatible/incompatible;
- architecture mismatch;
- runtime mismatch;
- SDK mismatch;
- capability mismatch;
- platform version mismatch.

# 100. Availability Service

Conceptual interface:

    queryAvailability(
        platform_id,
        start_time,
        end_time,
        requested_capacity
    )

It must evaluate:

- active platform;
- compatible versions;
- resources;
- lab status;
- maintenance;
- existing bookings;
- resource state.

# 101. Resource Allocation

Resource allocation should use transactional locking.

Conceptual flow:

    Candidate Resources
          |
    Filter Availability
          |
    Lock Candidate
          |
    Recheck Availability
          |
    Create Booking
          |
    Mark Resource RESERVED
          |
    Commit

This avoids race conditions between availability queries and bookings.

# 102. Maintenance Conflict

A maintenance window must not be created over an existing committed booking
without explicit operational override.

Where emergency maintenance requires interruption:

- Booking domain must be notified;
- affected Jobs must be reconciled;
- customers must receive appropriate events;
- physical safety remains local.

# 103. Availability Is Derived

The database should not maintain a continuously materialized:

    available = true/false

column as the sole authority.

Availability is derived from durable state.

Cached availability may be used for performance but must be invalidated or
reconciled.

# 104. Platform Catalog Visibility

Platform visibility may depend on:

- platform status;
- version status;
- commercial availability;
- organization entitlement;
- credit plan;
- resource availability.

Commercial entitlement is not owned by this schema.

# 105. Credit Relationship

Platform-specific credit policy follows:

    Platform
       |
    Credit Plan
       |
    Organization Wallet
       |
    Credit Ledger

This supports the agreed principle:

> Subscription determines access; robotic platform determines credit type;
> resource configuration and duration determine consumption.

# 106. Project Target Binding

A Project binding contains intended target information.

The final execution path is:

    Project Binding
         |
    Artifact Manifest
         |
    Platform Compatibility
         |
    Resource Selection
         |
    Booking
         |
    Job
         |
    Run

# 107. Configuration Versioning

Platform configuration changes must be auditable.

Recommended approach:

- immutable released configuration versions;
- new configuration record for material changes;
- deprecate old configuration;
- do not silently mutate historical configuration semantics.

# 108. Historical Resource State

Runs should capture:

- platform;
- version;
- architecture;
- resource;
- robot;
- runtime;
- SDK;
- configuration identity.

This ensures reproducibility.

# 109. Resource Health

Operational resource health may include:

- online/offline;
- heartbeat;
- temperature;
- battery;
- CPU;
- memory;
- safety state.

Only durable identity/status fields belong in the relational resource model.

High-frequency telemetry belongs to the telemetry subsystem.

# 110. Lab Health

Lab status may be updated by:

- operator;
- Lab Agent;
- monitoring;
- incident response.

A Lab marked OFFLINE must not allocate new resources.

# 111. Resource Fault

A Resource in `FAULT` must not be allocated.

Fault handling requires:

    Resource FAULT
        |
    Block New Booking
        |
    Reconcile Existing Jobs
        |
    Operator/Lab Agent Investigation
        |
    Clear Fault
        |
    AVAILABLE

No cloud operation may bypass a local physical safety fault.

# 112. Retention

Initial retention direction:

| Data | Retention |
|---|---|
| Platform | Long-term |
| Platform Version | Long-term |
| Architecture | Long-term |
| Capability | Long-term |
| Configuration | Long-term / version policy |
| Lab | Operational lifecycle |
| Robot | Long-term physical history |
| Resource | Long-term operational history |
| Maintenance | Multi-year operational history |
| Availability | Policy-based |
| High-frequency telemetry | Separate policy |
| Booking | Booking policy |
| Historical execution references | Long-term |

# 113. Platform Retirement

Retired Platforms must remain resolvable for historical records.

Retirement should block:

- new Project bindings;
- new bookings;
- new Jobs.

Existing historical Runs remain readable.

# 114. Platform Version Retirement

A retired version must remain available for historical compatibility checks.

It should not be accepted for new Artifact deployment unless an explicit
override policy exists.

# 115. Robot Retirement

Retired Robots remain part of physical history.

They must not receive new bookings.

Existing historical Runs continue to reference the Robot.

# 116. Resource Retirement

Retired Resources cannot be allocated.

The resource record remains for:

- audit;
- execution history;
- maintenance history;
- reconciliation.

# 117. Security

Platform configuration must not contain secrets.

Resource configuration must not contain:

- credentials;
- private keys;
- bearer tokens;
- passwords.

Secrets belong in the managed secret store.

# 118. Authorization

Global Platform catalog administration requires privileged administrative
authorization.

Lab administration requires operational permissions.

Customer Users may only see Platforms and Resources allowed by:

- organization entitlement;
- platform availability;
- booking policy;
- commercial policy.

# 119. Tenant-Owned Labs

If `lab.organization_id` is set, the Lab is tenant-owned.

Tenant-owned resources must not be visible to other Organizations unless an
explicit sharing model is introduced.

If `organization_id` is NULL, the Lab is globally operated and visibility is
controlled by platform/commercial policy.

# 120. Cross-Tenant Resource Protection

Resource selection must never expose:

- private tenant-owned Labs;
- private tenant-owned Robots;
- private tenant-owned Resources.

The scheduler must filter tenant ownership before presenting candidates.

# 121. Audit Requirements

Audit events are required for:

- platform creation;
- platform activation;
- platform deprecation;
- platform retirement;
- version creation;
- version activation;
- capability changes;
- configuration changes;
- Lab creation;
- Robot registration;
- Resource registration;
- Resource state changes;
- maintenance creation/cancellation;
- availability changes.

# 122. Event Requirements

Recommended events:

    platform.created
    platform.updated
    platform.activated
    platform.deprecated
    platform.retired

    platform.version.created
    platform.version.activated
    platform.version.deprecated
    platform.version.retired

    capability.created
    capability.updated
    capability.assigned
    capability.removed

    lab.created
    lab.updated
    lab.online
    lab.offline

    robot.registered
    robot.activated
    robot.fault
    robot.retired

    resource.registered
    resource.available
    resource.reserved
    resource.busy
    resource.maintenance
    resource.fault
    resource.released
    resource.retired

    maintenance.created
    maintenance.started
    maintenance.completed
    maintenance.cancelled

# 123. Event Authority

Events notify consumers of changes.

They do not replace:

- Platform state;
- Resource state;
- Lab state;
- Maintenance records.

PostgreSQL remains authoritative.

# 124. Database DDL Ordering

Recommended migration order:

    1. platform schema
    2. platform enum types
    3. architecture
    4. capability
    5. platform
    6. platform versions
    7. version capabilities
    8. platform configurations
    9. lab schema
    10. labs
    11. robots
    12. resources
    13. maintenance windows
    14. availability windows
    15. indexes
    16. composite integrity constraints

# 125. Example Platform Query

    SELECT
        p.platform_id,
        p.platform_key,
        p.name
    FROM platform.platforms AS p
    WHERE p.status = 'ACTIVE'
    ORDER BY p.name;

# 126. Example Version Query

    SELECT
        pv.platform_version_id,
        pv.version,
        pv.runtime_version,
        a.architecture_key
    FROM platform.platform_versions AS pv
    JOIN platform.architectures AS a
      ON a.architecture_id = pv.architecture_id
    WHERE pv.platform_id = :platform_id
      AND pv.status = 'ACTIVE';

# 127. Example Capability Query

    SELECT
        c.capability_key,
        pvc.support_level
    FROM platform.platform_version_capabilities AS pvc
    JOIN platform.capabilities AS c
      ON c.capability_id = pvc.capability_id
    WHERE pvc.platform_version_id = :platform_version_id
      AND c.status = 'ACTIVE';

# 128. Example Resource Query

    SELECT
        r.resource_id,
        r.resource_key,
        r.status,
        l.lab_key
    FROM lab.resources AS r
    JOIN lab.labs AS l
      ON l.lab_id = r.lab_id
    WHERE r.platform_id = :platform_id
      AND r.status = 'AVAILABLE'
      AND l.status = 'ACTIVE';

# 129. Availability Query

    SELECT
        r.resource_id
    FROM lab.resources AS r
    JOIN lab.labs AS l
      ON l.lab_id = r.lab_id
    WHERE r.platform_id = :platform_id
      AND r.status = 'AVAILABLE'
      AND l.status = 'ACTIVE';

The actual availability service must additionally exclude:

- maintenance windows;
- existing bookings;
- capacity conflicts;
- scheduling restrictions.

# 130. Phase 0 Mapping

Phase 0 establishes:

- Platform domain ownership;
- logical schema boundaries;
- UUIDv7;
- migration strategy;
- catalog versus operational data;
- repository/application-service boundaries.

# 131. Phase 1 Mapping

Phase 1 establishes:

- Organization integration;
- platform visibility authorization;
- global versus tenant-owned Labs;
- administrative ownership.

# 132. Phase 2 Mapping

Phase 2 implements:

- Platforms;
- Platform Versions;
- Architectures;
- Capabilities;
- Configurations;
- Project target bindings;
- basic Labs;
- Resources;
- availability foundation.

# 133. Phase 3 Mapping

Phase 3 integrates:

- resource allocation;
- Jobs;
- Runs;
- resource state transitions;
- reconciliation.

# 134. Phase 4 Mapping

Phase 4 integrates:

- Platform-specific credit plans;
- resource-based pricing;
- booking availability;
- maintenance conflict handling.

# 135. Phase 5 Mapping

Phase 5 integrates:

- Lab Agents;
- physical resource execution;
- deployment;
- runtime compatibility;
- artifact/platform compatibility.

# 136. Phase 6 Mapping

Phase 6 expands:

- physical Robots;
- multi-resource Labs;
- maintenance;
- availability;
- operational health;
- resource scheduling.

# 137. Phase 7 Mapping

Phase 7 integrates:

- experiments;
- results;
- telemetry;
- audit;
- historical platform snapshots;
- operational analytics.

# 138. Phase 8 Mapping

Phase 8 completes:

- retention;
- capacity;
- production observability;
- backup/restore;
- disaster recovery;
- security hardening;
- production platform lifecycle;
- resource operational hardening.

# 139. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Wrong platform selected | Critical | Compatibility validation |
| Resource allocated twice | Critical | Transactional locking |
| Maintenance conflict | High | Maintenance-aware scheduler |
| Stale resource status | High | Heartbeat + reconciliation |
| Cross-tenant resource exposure | Critical | Tenant filtering |
| Platform retirement breaks history | High | Preserve historical references |
| Capability drift | High | Versioned capability bindings |
| Configuration drift | High | Versioned configurations |
| Robot identity confusion | High | Stable serial + robot ID |
| Resource/Robot ambiguity | Medium | Explicit resource abstraction |
| Availability cache staleness | High | Durable state reconciliation |
| Secret leakage | Critical | Secret store, not JSONB |
| Unsafe remote action | Critical | Local safety authority |
| Duplicate default resource | Medium | Unique constraints |
| Lab outage | High | Lab health and failover policy |

# 140. Open Questions

1. Final platform catalog administration model.
2. Final ownership model for Kritva-operated Labs.
3. Whether tenant-owned Labs may be shared.
4. Final platform entitlement model.
5. Final architecture taxonomy.
6. Whether architecture needs ABI/toolchain metadata.
7. Final capability taxonomy.
8. Whether capabilities need versioned schemas.
9. Final platform configuration schema validation.
10. Whether configuration should be immutable after release.
11. Final Lab Agent registration model.
12. Final resource capacity model.
13. Whether a Robot may expose multiple allocatable Resources.
14. Whether simulator resources share the Robot model.
15. Final maintenance conflict policy.
16. Final recurring availability model.
17. Final timezone/DST behavior.
18. Final scheduler selection policy.
19. Final resource reservation locking strategy.
20. Final historical snapshot requirements.
21. Final RLS decision.
22. Final telemetry storage architecture.
23. Final platform commercial entitlement model.

# 141. Acceptance Criteria — Platform Catalog

- [ ] `platform` schema exists.
- [ ] `platforms` table exists.
- [ ] Platform key is globally unique.
- [ ] Platform lifecycle is implemented.
- [ ] Platform type is constrained.
- [ ] Platform metadata is bounded JSONB.
- [ ] Platform creation is auditable.
- [ ] Platform activation is controlled.
- [ ] Platform retirement preserves history.
- [ ] Retired Platforms cannot be selected for new operations.

# 142. Acceptance Criteria — Platform Versions

- [ ] Platform Versions exist.
- [ ] Every version references one Platform.
- [ ] `(platform_id, version)` is unique.
- [ ] Version lifecycle is implemented.
- [ ] Architecture is mandatory.
- [ ] Runtime compatibility is represented.
- [ ] SDK compatibility is represented.
- [ ] Release timestamp is supported.
- [ ] Historical versions remain resolvable.
- [ ] Retired versions are blocked from new operations.

# 143. Acceptance Criteria — Architectures

- [ ] Architecture catalog exists.
- [ ] Architecture key is unique.
- [ ] Bit width is validated.
- [ ] Endianness is validated.
- [ ] Architecture lifecycle exists.
- [ ] Platform versions reference architecture.
- [ ] Host and target architecture remain conceptually distinct.

# 144. Acceptance Criteria — Capabilities

- [ ] Capability catalog exists.
- [ ] Capability key is unique.
- [ ] Capability category exists.
- [ ] Capability lifecycle exists.
- [ ] Platform Versions can have multiple capabilities.
- [ ] A capability can be assigned to multiple versions.
- [ ] Duplicate assignments are prevented.
- [ ] Capability configuration is bounded.
- [ ] Support level is represented.

# 145. Acceptance Criteria — Configurations

- [ ] Platform configurations exist.
- [ ] Configurations reference Platform Version.
- [ ] Configuration keys are unique per version.
- [ ] Configuration lifecycle exists.
- [ ] Configuration JSONB is bounded.
- [ ] Secrets are prohibited.
- [ ] Released configurations are auditable.
- [ ] Historical configurations remain traceable.

# 146. Acceptance Criteria — Labs

- [ ] `lab` schema exists.
- [ ] Labs can be physical.
- [ ] Labs can be simulated.
- [ ] Lab lifecycle exists.
- [ ] Lab key is unique.
- [ ] Optional Organization ownership is supported.
- [ ] Global Labs are supported.
- [ ] Lab timezone is stored.
- [ ] Lab operational state is represented.

# 147. Acceptance Criteria — Robots

- [ ] Robots exist.
- [ ] Robot references Lab.
- [ ] Robot references Platform.
- [ ] Serial number is unique within Lab.
- [ ] Robot key is unique within Lab.
- [ ] Robot lifecycle exists.
- [ ] Robot retirement preserves history.
- [ ] Robot configuration metadata is bounded.
- [ ] Physical safety state is not replaced by database status.

# 148. Acceptance Criteria — Resources

- [ ] Resources exist.
- [ ] Resources reference Lab.
- [ ] Resources reference Platform.
- [ ] Resources may reference Robot.
- [ ] Resource keys are unique within Lab.
- [ ] Resource type is constrained.
- [ ] Resource status is constrained.
- [ ] Capacity is positive.
- [ ] Heartbeat timestamp is supported.
- [ ] Resource configuration is bounded.
- [ ] Retired resources cannot be allocated.

# 149. Acceptance Criteria — Maintenance

- [ ] Maintenance windows exist.
- [ ] Maintenance may target Lab.
- [ ] Maintenance may target Resource.
- [ ] At least one target is required.
- [ ] Start is before end.
- [ ] Maintenance lifecycle exists.
- [ ] Maintenance blocks allocation.
- [ ] Existing booking conflicts are handled.
- [ ] Maintenance changes are audited.

# 150. Acceptance Criteria — Availability

- [ ] Availability windows exist.
- [ ] Availability may target Lab.
- [ ] Availability may target Resource.
- [ ] Day-of-week is validated.
- [ ] Start/end times are validated.
- [ ] Effective dates are validated.
- [ ] Availability does not replace booking state.
- [ ] Maintenance is considered.
- [ ] Resource operational state is considered.
- [ ] Lab operational state is considered.

# 151. Acceptance Criteria — Compatibility

- [ ] Artifact manifest is validated against Platform.
- [ ] Platform Version is validated.
- [ ] Architecture is validated.
- [ ] Runtime compatibility is validated.
- [ ] SDK compatibility is validated.
- [ ] Required capabilities are validated.
- [ ] Resource Platform is validated.
- [ ] Incompatible execution is rejected before deployment.

# 152. Acceptance Criteria — Tenant Isolation

- [ ] Global Platform catalog is distinguished from tenant data.
- [ ] Tenant-owned Labs are isolated.
- [ ] Tenant-owned Resources are isolated.
- [ ] Project target bindings are organization-authorized.
- [ ] Private resources cannot be exposed cross-tenant.
- [ ] Scheduler applies tenant visibility rules.
- [ ] Cross-tenant tests pass.

# 153. Acceptance Criteria — Safety

- [ ] Database is not treated as physical E-stop.
- [ ] Local robot safety remains authoritative.
- [ ] Fault resources cannot receive normal allocation.
- [ ] Safety interlocks are respected.
- [ ] Cloud outage does not create unsafe automatic robot behavior.
- [ ] Resource reconciliation exists after connectivity loss.
- [ ] Emergency maintenance has explicit operational handling.

# 154. Acceptance Criteria — Integration

- [ ] Organization integration passes.
- [ ] Project integration passes.
- [ ] Artifact integration passes.
- [ ] Booking integration passes.
- [ ] Credit integration passes.
- [ ] Execution integration passes.
- [ ] Result integration passes.
- [ ] Lab Agent integration passes.
- [ ] Audit integration passes.
- [ ] Event integration passes.

# 155. Acceptance Criteria — Operations

- [ ] Empty database migration succeeds.
- [ ] CI validates migrations.
- [ ] Seed catalog is deterministic.
- [ ] Default capabilities are deterministic.
- [ ] Platform version seeding is repeatable.
- [ ] Backup includes Platform and Lab schemas.
- [ ] Restore includes Platform and Lab schemas.
- [ ] Schema drift detection exists.
- [ ] Resource state monitoring exists.
- [ ] Availability monitoring exists.

# 156. Acceptance Criteria — Performance

- [ ] Platform lookup by key is indexed.
- [ ] Version lookup by Platform is indexed.
- [ ] Capability lookup is indexed.
- [ ] Resource lookup by Platform is indexed.
- [ ] Resource lookup by Lab is indexed.
- [ ] Maintenance lookup by Resource is indexed.
- [ ] Availability lookup is indexed.
- [ ] Tenant resource filtering is indexed.
- [ ] Scheduler query plans are validated under expected scale.

# 157. Acceptance Criteria — Retention

- [ ] Platform history is retained.
- [ ] Version history is retained.
- [ ] Capability history is retained.
- [ ] Configuration history is retained.
- [ ] Robot history is retained.
- [ ] Resource history is retained.
- [ ] Maintenance history is retained.
- [ ] Availability retention is policy-controlled.
- [ ] Historical Runs remain resolvable after retirement.

# 158. Acceptance Criteria — Phase Gates

Phase 0:

- [ ] Platform domain boundary accepted.
- [ ] Lab operational boundary accepted.
- [ ] UUIDv7 strategy accepted.
- [ ] Global versus tenant ownership accepted.

Phase 1:

- [ ] Organization authorization integrated.
- [ ] Tenant-owned resource visibility implemented.

Phase 2:

- [ ] Platform catalog implemented.
- [ ] Versions implemented.
- [ ] Architectures implemented.
- [ ] Capabilities implemented.
- [ ] Configurations implemented.
- [ ] Labs/resources foundation implemented.

Phase 3:

- [ ] Resource allocation integrates with Jobs.
- [ ] Resource state reconciliation passes.

Phase 4:

- [ ] Platform-specific credits integrate.
- [ ] Availability integrates with Booking.
- [ ] Maintenance conflicts are handled.

Phase 5:

- [ ] Artifact compatibility validation passes.
- [ ] Lab Agent integration passes.
- [ ] Physical execution path passes.

Phase 6:

- [ ] Robot/resource operational model passes.
- [ ] Maintenance and availability pass.
- [ ] Operational monitoring passes.

Phase 7:

- [ ] Results and experiments retain platform history.
- [ ] Audit/events integrate.

Phase 8:

- [ ] Retention passes.
- [ ] Backup/restore passes.
- [ ] DR passes.
- [ ] Capacity tests pass.
- [ ] Production security review passes.
- [ ] Safety review confirms cloud/database boundaries do not replace local
  safety controls.

# 159. Final Invariants

The following must always remain true:

1. Every Platform has an immutable UUIDv7 identifier.
2. Platform keys are globally unique.
3. Platform Versions belong to exactly one Platform.
4. Platform Version keys are unique within Platform.
5. Every Platform Version has an Architecture.
6. Capabilities are globally defined.
7. Platform Versions may support multiple Capabilities.
8. Duplicate capability assignments are prohibited.
9. Platform configurations belong to Platform Versions.
10. Configuration secrets are never stored in JSONB.
11. Labs contain operational infrastructure.
12. Labs may be global or tenant-owned.
13. Robots belong to Labs.
14. Robots identify physical machines.
15. Resources identify allocatable execution units.
16. Resources belong to Labs.
17. Resources reference a Platform.
18. Robot resources reference a Robot.
19. Resource allocation state is explicit.
20. Retired resources cannot be newly allocated.
21. Maintenance windows block allocation during their effective intervals.
22. Availability is derived from durable operational and scheduling state.
23. Bookings remain owned by the Booking domain.
24. Credit ledgers remain owned by the Credit domain.
25. Jobs and Runs remain owned by Execution.
26. Project bindings reference Platform catalog records.
27. Artifact compatibility is independently validated.
28. Historical Runs retain platform/resource identity.
29. Tenant-owned resources cannot cross tenant boundaries.
30. PostgreSQL is authoritative for catalog/resource metadata.
31. High-frequency telemetry is not stored as ordinary resource columns.
32. Database state does not replace physical safety controls.
33. Cloud commands cannot bypass local robot safety.
34. Platform retirement does not destroy historical references.
35. Cross-domain writes use application services.
36. Critical resource allocation is transactional and idempotent.

# 160. Final Architecture Statement

> **Kritva RaaS treats a Platform as a durable robotic execution contract. A
> Platform defines the product, Platform Version defines the compatible
> release, Architecture defines the execution target, and Capabilities define
> the supported functions. Configurations make those capabilities
> operationally selectable without duplicating platform definitions.**
>
> **Labs and Resources provide the bridge from the global platform catalog to
> actual execution infrastructure. A Robot identifies physical hardware,
> while a Resource identifies the allocatable execution unit. Maintenance and
> availability are modeled explicitly so the scheduler can make decisions
> from durable operational state rather than a fragile availability flag.**
>
> **Project bindings express customer intent, Artifacts express executable
> requirements, Booking controls reservation, and Execution controls the
> actual Run. The Platform schema therefore remains a catalog and resource
> authority rather than absorbing the responsibilities of Project, Artifact,
> Booking, Credit or Execution.**
>
> **Most importantly, the database is not the robot safety controller.
> Physical E-stop, interlocks, motor safety, real-time watchdogs and safe-state
> behavior remain local to the Lab Agent and robot. Cloud and database state
> provide operational coordination, authorization, scheduling and historical
> evidence while preserving the local safety boundary.**
