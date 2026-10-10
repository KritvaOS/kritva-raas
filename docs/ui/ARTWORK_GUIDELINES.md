# Kritva RaaS Artwork and Brand Guidelines

## 1. Purpose

This document defines the production-grade artwork, visual identity, media,
illustration, diagram, screenshot, and asset-management standards for Kritva
RaaS.

The objective is to ensure that every visual asset communicates a coherent
Kritva identity across:

- Kritva RaaS Studio;
- Kritva RaaS Web Console;
- documentation;
- GitHub repositories;
- product demonstrations;
- robot/lab environments;
- presentations;
- tutorials;
- screenshots;
- video thumbnails;
- architecture diagrams;
- marketing and educational material.

The visual identity shall communicate:

> Build locally. Book remotely. Run on real robots.

Kritva should be presented as an open robotic computing and operating-system
platform rather than as a generic robotics SaaS product.

## 2. Scope

This specification applies to:

- logos;
- wordmarks;
- product marks;
- application icons;
- favicons;
- brand colors;
- UI artwork;
- illustrations;
- robot imagery;
- laboratory imagery;
- architecture diagrams;
- workflow diagrams;
- screenshots;
- video thumbnails;
- documentation figures;
- presentation artwork;
- promotional artwork;
- social-media artwork;
- repository artwork;
- downloadable asset packages.

It applies to Kritva RaaS and should remain compatible with the broader KritvaOS
brand.

## 3. Goals

The artwork system shall:

1. establish a recognizable Kritva visual identity;
2. communicate robotics, computing and openness;
3. distinguish product UI from promotional artwork;
4. maintain visual consistency across assets;
5. support light and dark UI themes;
6. work on desktop and web surfaces;
7. support documentation and technical diagrams;
8. support real and simulated robots;
9. preserve technical credibility;
10. avoid misleading product claims;
11. maintain licensing clarity;
12. provide reproducible asset management;
13. support localization and accessibility;
14. scale from small icons to large presentation graphics.

## 4. Non-Goals

This document does not define:

- product UI component behavior;
- complete UI color-token definitions;
- typography implementation details;
- frontend component APIs;
- backend branding metadata;
- physical robot industrial design;
- final commercial marketing strategy.

The design system remains authoritative for UI tokens and component styling.

## 5. Brand Position

Kritva is positioned as an:

> Open Robotic Operating System and Open Robotic Computing Platform.

Kritva RaaS extends that platform into:

> A remote robotics development and execution service.

The artwork should therefore emphasize:

- robotics;
- computing;
- openness;
- engineering;
- experimentation;
- real-world execution;
- developer control;
- connected physical systems.

Artwork should avoid presenting Kritva primarily as:

- generic cloud software;
- a consumer social application;
- a generic AI chatbot;
- a hardware-only company;
- a surveillance product.

## 6. Brand Hierarchy

    Kritva
      |
      +-- KritvaOS
      |     |
      |     +-- Core
      |     +-- Sense
      |     +-- Mind
      |     +-- Motion
      |     +-- Skill
      |     +-- Sim
      |     +-- SDK
      |
      +-- Kritva RaaS
      |     |
      |     +-- Studio
      |     +-- Web Console
      |     +-- Cloud / Control Plane
      |     +-- Lab
      |
      +-- Kritva Forge
            |
            +-- Hardware Design Intelligence

Artwork must preserve this hierarchy.

## 7. Definitions

| Term | Definition |
|---|---|
| Master Asset | Highest-quality authoritative source asset |
| Logo | Symbol identifying Kritva |
| Wordmark | Text-based Kritva brand representation |
| Lockup | Combined logo and wordmark |
| Product Mark | Visual identity for a specific Kritva product |
| Artwork | Designed visual composition |
| Illustration | Purpose-created explanatory graphic |
| Diagram | Technical representation of architecture or flow |
| Screenshot | Captured product UI |
| Thumbnail | Small representative image for video/content |
| Asset ID | Stable identifier for an artwork asset |
| Source File | Editable artwork source |
| Export | Distribution-ready generated asset |
| Safe Area | Required space around a logo |
| Clear Space | Minimum exclusion zone around brand marks |
| Raster | Pixel-based image format |
| Vector | Resolution-independent image format |

# 8. Brand Principles

All Kritva artwork shall follow these principles.

## 8.1 Engineering First

Artwork should communicate technical credibility.

Prefer:

- precise geometry;
- clean diagrams;
- structured layouts;
- meaningful data;
- realistic interfaces;
- controlled visual complexity.

Avoid:

- decorative complexity;
- excessive gradients;
- exaggerated science-fiction imagery;
- unexplained technical elements.

## 8.2 Open Platform Identity

Kritva should visually feel like an open platform.

Artwork may communicate:

    Developer
       |
       v
    Kritva SDK
       |
       v
    KritvaOS
       |
       v
    Robot / Lab
       |
       v
    Real-World Result

## 8.3 Human + Robot + Computing

The visual identity should connect:

    Human Developer
          |
          v
      Software
          |
          v
       Runtime
          |
          v
        Robot
          |
          v
      Physical World

Artwork should not depict robots as isolated mechanical objects.

## 8.4 Trust and Safety

RaaS imagery must communicate controlled execution.

Important visual concepts include:

- verified artifacts;
- authenticated access;
- platform compatibility;
- booking;
- resource allocation;
- telemetry;
- local safety;
- controlled lab execution.

## 8.5 Minimalism

Artwork should be visually strong without becoming noisy.

The preferred composition is:

- one primary subject;
- one clear message;
- limited secondary detail;
- strong hierarchy;
- sufficient negative space.

# 9. Logo System

The Kritva logo system shall support:

1. symbol-only mark;
2. wordmark;
3. horizontal lockup;
4. stacked lockup;
5. monochrome versions;
6. light-background version;
7. dark-background version;
8. transparent-background version;
9. application icon;
10. favicon.

## 9.1 Master Logo

The master logo must be maintained as vector artwork.

Preferred master formats:

- SVG;
- editable vector source;
- high-resolution PDF where required.

Raster exports are derived assets and must not become the source of truth.

## 9.2 Logo Variants

| Variant | Primary Use |
|---|---|
| Symbol | App icon, compact UI |
| Wordmark | Documentation and branding |
| Horizontal Lockup | Website/header |
| Stacked Lockup | Posters/presentations |
| Monochrome Dark | Light backgrounds |
| Monochrome Light | Dark backgrounds |
| Transparent | Overlay artwork |
| Small Mark | Favicon/application surfaces |

## 9.3 Clear Space

A minimum clear-space region must surround the logo.

The clear-space unit should be based on a repeatable logo dimension rather than
an arbitrary pixel value.

Recommended conceptual rule:

    Clear Space = X

    +-------------------------+
    |           X             |
    |      +----------+       |
    |  X   |  KRITVA  |   X   |
    |      +----------+       |
    |           X             |
    +-------------------------+

The final X value must be defined in the official logo master specification.

## 9.4 Minimum Size

The logo must remain legible at:

- application icon size;
- favicon size;
- documentation inline size;
- presentation size;
- large-format artwork size.

When the full lockup becomes unreadable, use the approved symbol-only mark.

## 9.5 Logo Prohibitions

Do not:

- stretch the logo;
- compress the logo;
- rotate the logo;
- distort proportions;
- change internal geometry;
- add unofficial shadows;
- add uncontrolled glow;
- add arbitrary gradients;
- place over unreadable imagery;
- redraw the logo;
- recreate the wordmark with an unapproved font;
- add unofficial slogans to the mark.

# 10. Wordmark Usage

The Kritva wordmark shall use the approved master artwork.

Do not type "Kritva" in a normal font as a substitute where the official
wordmark is required.

Text references to the company/product may use normal product typography.

## 10.1 Product Naming

Preferred:

- Kritva;
- KritvaOS;
- Kritva RaaS;
- Kritva RaaS Studio;
- Kritva Forge.

Avoid inconsistent forms such as:

- KritvaOS RaaS Studio Product;
- Kritva Cloud Robotics;
- Kritva Robot Cloud.

Product naming should follow the official product hierarchy.

# 11. Colour Philosophy

Kritva's visual palette should communicate:

- technical precision;
- modern computing;
- robotics;
- trust;
- openness;
- energy.

The exact production color tokens are defined by the UI design system.

Artwork may extend the palette only when the extension remains semantically
consistent.

## 11.1 Primary Brand Color

A single primary Kritva brand color should remain visually dominant in:

- logo;
- major brand accents;
- selected UI states;
- artwork highlights;
- diagrams.

The official design-token source remains authoritative for exact values.

## 11.2 Supporting Colors

Supporting colors may be used for:

- success;
- warning;
- error;
- information;
- robot state;
- telemetry;
- architecture layers.

Semantic colors must not be confused with branding colors.

## 11.3 Light Background

Preferred:

- clean neutral background;
- strong dark text;
- restrained brand accent;
- subtle secondary surfaces.

## 11.4 Dark Background

Preferred:

- deep neutral background;
- high-contrast text;
- controlled brand accent;
- restrained secondary surfaces.

Do not simply invert the light artwork.

# 12. Colour Usage Rules

- [ ] Brand color remains recognizable.
- [ ] Semantic colors retain their meaning.
- [ ] Contrast is sufficient.
- [ ] Color is not the only status indicator.
- [ ] Artwork works in grayscale when required.
- [ ] Dark-background assets remain legible.
- [ ] Light-background assets remain legible.

# 13. Illustration Style

Kritva illustrations should use a consistent technical illustration language.

Preferred characteristics:

- clean geometric shapes;
- controlled line weight;
- moderate detail;
- structured composition;
- technical labels;
- subtle depth;
- limited decorative effects.

Avoid:

- childish cartoon styling for core engineering content;
- excessive photorealistic effects;
- random 3D objects;
- generic stock-vector appearance;
- visual clutter.

## 13.1 Illustration Layers

A typical technical illustration may contain:

    Background
        |
        +-- Environment
        |
        +-- Robot
        |
        +-- Computing
        |
        +-- Connectivity
        |
        +-- Developer / User
        |
        +-- Labels / Callouts

Each layer should have a clear purpose.

# 14. Robot Illustration Style

Robots should be represented as engineering systems.

Preferred visual elements:

- actuators;
- joints;
- sensors;
- compute modules;
- network links;
- control signals;
- perception;
- telemetry.

Avoid unrealistic anatomy unless the artwork is explicitly conceptual.

## 14.1 Humanoid Representation

Where a humanoid robot is shown:

- proportions should be plausible;
- major joints should be technically credible;
- sensors should have logical locations;
- compute should be represented appropriately;
- motion should appear physically plausible.

# 15. Robot Photography

Real robot photography is preferred for:

- product demonstrations;
- lab announcements;
- physical deployment;
- validation;
- case studies;
- RaaS availability.

Photographs should show:

- robot;
- relevant environment;
- safe laboratory setup;
- meaningful context.

Avoid showing:

- unsafe operation;
- exposed hazardous wiring;
- unidentified people without permission;
- confidential lab information;
- credentials;
- internal network details.

# 16. Laboratory Imagery

Lab imagery should communicate:

- real hardware;
- controlled environment;
- engineering practice;
- safety;
- repeatability.

Preferred compositions include:

    Robot
       |
       +-- Sensors
       +-- Compute
       +-- Power
       +-- Network
       |
       v
    Lab Infrastructure
       |
       v
    Remote Developer

# 17. Human Imagery

When developers or engineers appear:

- portray realistic engineering activity;
- show development environments where appropriate;
- avoid staged "hands-on-keyboard" clichés;
- avoid exposing private source code;
- avoid passwords/API keys;
- avoid personal data.

People should support the technical narrative rather than dominate it.

# 18. Stock Photography

Stock imagery may be used only when:

- licensing is documented;
- the source is approved;
- attribution requirements are understood;
- the image does not falsely represent Kritva hardware.

Do not imply that a stock robot is a Kritva product.

# 19. AI-Generated Artwork

AI-generated artwork may be used for:

- conceptual illustrations;
- educational artwork;
- promotional backgrounds;
- non-authoritative visual concepts.

AI-generated artwork must not be presented as:

- actual Kritva hardware;
- actual lab equipment;
- actual product screenshots;
- validated architecture;
- safety-certified equipment.

When realism matters, use real product imagery.

# 20. Technical Diagram Style

Technical diagrams must prioritize correctness over decoration.

Preferred:

- rectangular components;
- consistent arrows;
- explicit boundaries;
- labels;
- directionality;
- clear hierarchy.

Example:

    Developer Machine
          |
          | .krv artifact
          v
    RaaS Control Plane
          |
          | secure lab protocol
          v
       Lab Agent
          |
          v
     Kritva Runtime
          |
          v
        Robot

# 21. Diagram Conventions

| Element | Meaning |
|---|---|
| Solid box | Component |
| Rounded box | Service/process |
| Solid arrow | Primary flow |
| Dashed arrow | Optional/asynchronous flow |
| Double boundary | Trust boundary |
| Cylinder | Persistent data |
| Cloud shape | External service |
| Shield | Security boundary |
| Robot icon | Physical resource |
| Person icon | Human actor |

## 21.1 Arrow Rules

Arrows should:

- have clear direction;
- avoid unnecessary crossings;
- use consistent weight;
- be labeled when meaning is ambiguous.

## 21.2 Trust Boundaries

Security boundaries should be visually explicit.

    +-------------------------------------------+
    | Developer Machine                         |
    |                                           |
    | Source -> Local Build -> .krv             |
    +-------------------+-----------------------+
                        |
                        | artifact only
                        v
    +-------------------------------------------+
    | RaaS Control Plane                        |
    +-------------------------------------------+

# 22. Architecture Diagram Rules

Architecture diagrams must identify:

- system boundary;
- external actors;
- trust boundaries;
- data flow;
- control flow;
- persistent state;
- physical boundaries where relevant.

Do not use artwork to hide architectural uncertainty.

# 23. Workflow Diagram Rules

RaaS workflow diagrams should preserve:

    Discover
       ->
    Select Platform
       ->
    Build Locally
       ->
    Package .krv
       ->
    Book
       ->
    Upload
       ->
    Validate
       ->
    Execute
       ->
    Observe
       ->
    Results
       ->
    Rerun

# 24. Security Diagram Rules

Security diagrams should visually distinguish:

- source;
- artifact;
- authentication;
- authorization;
- signing;
- verification;
- lab identity;
- robot safety.

Security diagrams must never imply that cloud infrastructure controls the
physical emergency-stop function.

# 25. Screenshots

Screenshots are product evidence and must be treated as controlled assets.

## 25.1 Screenshot Requirements

A production screenshot must have:

- correct product version;
- realistic data;
- no credentials;
- no API keys;
- no private source;
- no personal information unless authorized;
- correct theme;
- correct platform state.

## 25.2 Screenshot Composition

Preferred:

- application window clearly visible;
- relevant screen centered;
- unnecessary desktop content removed;
- cursor removed unless demonstrating interaction;
- useful state visible.

## 25.3 Screenshot Types

| Type | Purpose |
|---|---|
| Feature | Explain feature |
| Workflow | Explain flow |
| Evidence | Demonstrate behavior |
| Marketing | Promote product |
| Documentation | Explain operation |
| Error | Explain recovery |
| Accessibility | Demonstrate accessible state |

# 26. Screenshot Annotation

Annotations may include:

- numbered callouts;
- arrows;
- highlighted regions;
- short labels.

Annotations must not obscure the actual UI.

Use a consistent annotation style.

# 27. Screenshot Privacy

Before publishing:

- [ ] no passwords;
- [ ] no API keys;
- [ ] no tokens;
- [ ] no private URLs;
- [ ] no personal email;
- [ ] no private source code;
- [ ] no internal IP addresses;
- [ ] no customer information;
- [ ] no confidential robot identifiers.

# 28. Video Thumbnails

Video thumbnails should communicate one clear message.

Preferred composition:

    +-----------------------------------------+
    | Kritva RaaS                             |
    |                                         |
    |       ROBOT / UI / WORKFLOW             |
    |                                         |
    |       Short title                       |
    +-----------------------------------------+

## 28.1 Thumbnail Rules

- [ ] Kritva identity is visible.
- [ ] Title is readable at small size.
- [ ] One primary subject exists.
- [ ] Contrast is strong.
- [ ] No excessive text.
- [ ] No misleading hardware.
- [ ] No confidential data.

# 29. Video Artwork

Video intros/outros should be restrained.

Preferred:

- Kritva logo;
- product name;
- short descriptor;
- consistent transition.

Avoid long animated brand sequences that delay technical content.

# 30. File Format Standards

| Asset | Preferred Format | Alternatives |
|---|---|---|
| Logo | SVG | PDF, PNG |
| Icon | SVG | PNG |
| Illustration | SVG | PNG, WebP |
| Diagram | SVG | PNG, PDF |
| Screenshot | PNG | WebP |
| Photography | JPEG | WebP |
| Transparent Artwork | PNG/WebP | SVG |
| Video | MP4 | WebM |
| Video Thumbnail | PNG/WebP | JPEG |
| Editable Artwork | Source-specific | — |

# 31. SVG Requirements

SVG assets should:

- [ ] use valid XML;
- [ ] have viewBox;
- [ ] avoid unnecessary embedded raster images;
- [ ] avoid external network references;
- [ ] use predictable dimensions;
- [ ] preserve accessibility metadata where appropriate;
- [ ] be optimized for repository use.

# 32. Raster Requirements

Raster assets should:

- use sufficient resolution;
- avoid unnecessary upscaling;
- use appropriate compression;
- preserve transparency when required;
- avoid accidental color-profile conversion.

# 33. Video Requirements

Production video should specify:

- resolution;
- frame rate;
- codec;
- audio policy;
- thumbnail;
- captions where applicable.

Do not publish raw development recordings containing secrets or private data.

# 34. Naming Convention

Assets should use:

    <brand>-<product>-<asset>-<variant>-<size>.<ext>

Examples:

    kritva-raas-logo-primary.svg
    kritva-raas-logo-dark.svg
    kritva-raas-studio-dashboard-light.png
    kritva-raas-studio-dashboard-dark.png
    kritva-raas-architecture-control-plane.svg
    kritva-raas-live-run-thumbnail.png

Names should be:

- lowercase;
- predictable;
- hyphen-separated;
- descriptive;
- stable.

# 35. Asset IDs

Where assets are part of a controlled library, use stable IDs.

Example:

    ART-LOGO-001
    ART-ILL-001
    ART-DIAG-001
    ART-SCREEN-001
    ART-VIDEO-001

Asset IDs should not be reused for different artwork.

# 36. Versioning

Master artwork should have explicit versioning.

Example:

    ART-LOGO-001 v1.0
    ART-LOGO-001 v1.1

Minor changes may update the revision.

Brand geometry changes require a new major version or new asset ID.

# 37. Asset Directory Structure

Recommended structure:

    docs/
        ui/
            assets/
                brand/
                logos/
                icons/
                illustrations/
                diagrams/
                screenshots/
                video/
                thumbnails/
                source/
                archive/

Product repository assets may use a corresponding structure under the
application/package where required.

# 38. Source vs Export

The source file is authoritative for editable artwork.

Exports must be reproducible from source.

    Source Artwork
          |
          v
       Export
          |
          +--> SVG
          +--> PNG
          +--> WebP
          +--> PDF

Do not manually modify an export and treat it as the new master.

# 39. Asset Metadata

Controlled assets should record:

- asset ID;
- title;
- description;
- owner;
- source;
- license;
- creator;
- creation date;
- revision;
- approved status;
- intended use;
- restrictions.

# 40. Asset Approval States

| State | Meaning |
|---|---|
| DRAFT | Work in progress |
| REVIEW | Awaiting review |
| APPROVED | Approved for intended use |
| PUBLISHED | Released for use |
| DEPRECATED | Do not use for new work |
| RETIRED | No longer valid |

# 41. Asset Review

Artwork review should verify:

- [ ] brand correctness;
- [ ] technical correctness;
- [ ] visual quality;
- [ ] accessibility;
- [ ] licensing;
- [ ] privacy;
- [ ] security;
- [ ] intended usage.

# 42. Licensing Principles

Every externally sourced visual asset must have a known license.

Possible sources include:

- internally created;
- commissioned;
- permissively licensed;
- public domain;
- approved stock;
- approved AI-generated content.

Unknown-license assets must not enter production artwork.

# 43. Internal Artwork

Internally created assets should record:

- creator;
- date;
- source file;
- repository;
- license status;
- ownership status.

Where Kritva distributes the repository under Apache License 2.0, artwork licensing
must be intentionally documented rather than assumed.

# 44. Third-Party Artwork

For third-party assets:

- [ ] source URL is recorded;
- [ ] license is recorded;
- [ ] attribution requirement is recorded;
- [ ] redistribution rights are confirmed;
- [ ] modification rights are confirmed;
- [ ] commercial-use rights are confirmed where required.

# 45. Font Licensing

Fonts must be separately reviewed.

- [ ] License permits intended distribution.
- [ ] Desktop application embedding rights are understood.
- [ ] Documentation redistribution rights are understood.
- [ ] Web use is permitted where applicable.
- [ ] No unlicensed font is committed.

# 46. Icon Licensing

Use an approved icon library.

The library license must permit intended use.

Do not mix unrelated icon styles without review.

# 47. Robot Photography Licensing

For photographs:

- [ ] ownership is known;
- [ ] photographer rights are documented;
- [ ] people have appropriate permissions;
- [ ] lab owner permissions are confirmed;
- [ ] robot owner permissions are confirmed;
- [ ] publication scope is understood.

# 48. AI Artwork Licensing and Provenance

AI-generated assets should record:

- generation source/tool where required;
- prompt or production notes where useful;
- human reviewer;
- intended use;
- whether it represents real hardware.

AI artwork must never be used to fabricate evidence.

# 49. Documentation Artwork

Documentation diagrams should prioritize clarity over branding.

A diagram should remain understandable if the logo is removed.

Branding should be subtle and should not interfere with technical meaning.

# 50. README Artwork

Repository README artwork should:

- load quickly;
- have appropriate dimensions;
- contain meaningful alt text where supported;
- not dominate technical content;
- use approved brand assets.

# 51. GitHub Artwork

GitHub repository artwork may include:

- repository banner;
- architecture diagram;
- product illustration;
- screenshot;
- logo.

All must be maintained from approved sources.

# 52. Marketing Artwork

Marketing artwork may be more expressive but must remain truthful.

It may emphasize:

- robot experience;
- remote development;
- developer workflow;
- platform ecosystem;
- real-world robotics.

It must not imply:

- unsupported robots;
- unsupported capabilities;
- production certification;
- guaranteed performance;
- physical deployment that has not occurred.

# 53. Educational Artwork

Educational material may simplify architecture.

Simplification must not create materially incorrect technical claims.

For example:

    Level 1 -> Programming -> Kritva SDK
    Level 2 -> Linux -> Kritva Core
    Level 3 -> Embedded Systems -> Kritva Edge
    Level 4 -> Sensors -> Kritva Sense
    Level 5 -> Motor Control -> Kritva Motion
    Level 6 -> Robotics -> Kritva Skill
    Level 7 -> Simulation -> Kritva Sim

The illustration should preserve the conceptual relationship without claiming
that each level is a strict prerequisite unless officially defined.

# 54. Product Screenshot Lifecycle

    Capture
       |
       v
    Redact
       |
       v
    Review
       |
       v
    Approve
       |
       v
    Publish
       |
       v
    Deprecate
       |
       v
    Archive

# 55. Screenshot Versioning

Screenshots tied to UI releases should record:

- Studio version;
- UI milestone;
- operating system;
- theme;
- capture date;
- data state.

Old screenshots must be marked deprecated when they materially misrepresent the
current product.

# 56. Diagram Versioning

Architecture diagrams must be updated when architecture changes materially.

A diagram must not remain published if it contradicts:

- protocol;
- security boundary;
- deployment architecture;
- source privacy;
- robot safety authority.

# 57. Artwork Accessibility

Where artwork communicates information:

- provide alt text;
- provide surrounding textual explanation where necessary;
- avoid text-only color coding;
- avoid tiny unreadable labels;
- provide accessible equivalent for important diagrams.

Decorative artwork may use empty alt semantics where the consuming medium supports
it.

# 58. Diagram Accessibility

Important diagrams should have:

1. descriptive title;
2. concise explanation;
3. accessible text alternative;
4. clear reading order.

Example:

    Figure: Local Build and Remote Execution Boundary

    Description:
    Source code remains on the developer machine. Only the packaged .krv
    artifact crosses into the RaaS Control Plane and laboratory execution path.

# 59. Colour-Blindness Review

Artwork should remain understandable under common color-vision differences.

Check:

- [ ] status icons include labels;
- [ ] chart lines are distinguishable;
- [ ] diagram paths are labeled;
- [ ] color is not the only distinction.

# 60. Illustration Accessibility

Illustrations should not rely on:

- subtle color differences;
- tiny labels;
- animation;
- visual-only arrows.

Use labels and structure.

# 61. Motion Artwork

Motion graphics should:

- be purposeful;
- be short;
- avoid excessive flashing;
- respect reduced-motion contexts where technically possible;
- not interfere with accessibility.

Avoid rapid flashing that could create accessibility or health risks.

# 62. Product Animation

Animation may illustrate:

- data flow;
- build progress;
- robot motion;
- telemetry;
- state transitions.

Animation must not imply that a simulated operation is physical execution.

# 63. Simulation vs Physical Imagery

Simulation should be visually distinguishable from physical operation.

Recommended labels:

- SIMULATION;
- VIRTUAL ROBOT;
- PHYSICAL LAB;
- LIVE ROBOT.

Never use simulated imagery in a way that implies a physical robot performed
the depicted action.

# 64. Live Robot Imagery

For actual robot operation:

- identify environment where appropriate;
- show realistic status;
- avoid fabricated telemetry;
- distinguish demonstration from production operation.

# 65. Safety Imagery

Safety-related imagery should be conservative.

Do not depict:

- unsafe human proximity;
- bypassed safety systems;
- disabled emergency-stop equipment;
- uncontrolled robot movement;
- unsafe laboratory practices.

# 66. Diagram Data Accuracy

Technical artwork is considered a technical artifact.

Reviewers should validate:

- component names;
- protocol names;
- data flow;
- system boundaries;
- security boundaries;
- ownership;
- physical/software boundaries.

A beautiful incorrect diagram is unacceptable.

# 67. Artwork Interfaces

Artwork interfaces include:

| Interface | Requirement |
|---|---|
| UI | Correct dimensions and theme |
| Documentation | Readable at document width |
| GitHub | Fast-loading web asset |
| Presentation | High-resolution export |
| Video | Thumbnail-safe composition |
| Print | Vector/high-resolution |
| Mobile/Web | Responsive crop where needed |

# 68. UI Artwork Integration

UI artwork must:

- use design-system tokens where applicable;
- support light/dark contexts;
- avoid competing with primary actions;
- preserve accessible contrast;
- use approved asset imports.

Large artwork should be lazy-loaded when appropriate.

# 69. React Asset Integration

Frontend assets should use a controlled import mechanism.

Example:

    import kritvaLogo from "@/assets/brand/kritva-logo.svg";

Assets should not be copied into arbitrary feature folders.

Shared assets belong to the shared asset library.

# 70. Asset Optimization

Before publication:

- [ ] SVG optimized;
- [ ] PNG compressed;
- [ ] WebP generated where useful;
- [ ] unused metadata removed where safe;
- [ ] dimensions verified;
- [ ] file size checked.

Optimization must not reduce important visual quality.

# 71. Asset Performance

Artwork must not unnecessarily increase application startup cost.

Preferred practices:

- SVG for scalable simple graphics;
- WebP for suitable raster artwork;
- lazy-loading large illustrations;
- lazy-loading video;
- responsive image sizes where applicable.

# 72. File Naming Acceptance

Asset names must:

- [ ] use lowercase;
- [ ] use hyphens;
- [ ] identify product;
- [ ] identify purpose;
- [ ] identify variant where needed;
- [ ] avoid spaces;
- [ ] avoid ambiguous names;
- [ ] avoid version numbers in paths unless required.

# 73. Asset Repository Hygiene

Do not commit:

- duplicate exports;
- temporary renders;
- huge uncompressed screenshots;
- raw camera dumps;
- secret-containing recordings;
- unknown-license artwork;
- obsolete assets without archive classification.

# 74. Asset Archive

Deprecated assets should move to an archive or be clearly marked.

Archive metadata should identify:

- replacement asset;
- retirement date;
- reason;
- last approved version.

# 75. Brand Review Gate

A new major brand asset requires:

- [ ] visual review;
- [ ] product review;
- [ ] technical review if diagram;
- [ ] accessibility review;
- [ ] licensing review;
- [ ] final approval.

# 76. Phase 0 Mapping

Phase 0 artwork work includes:

- logo integration;
- asset directory;
- color foundation;
- icon library;
- diagram conventions;
- screenshot conventions;
- licensing metadata;
- initial artwork package.

Acceptance:

- [ ] master assets identified;
- [ ] naming standard established;
- [ ] design-system alignment verified.

# 77. Phase 1 Mapping

Phase 1 artwork includes:

- login branding;
- dashboard imagery;
- project illustrations;
- navigation icons;
- platform visuals.

Review:

- [ ] Studio branding;
- [ ] theme;
- [ ] accessibility;
- [ ] asset performance.

# 78. Phase 2 Mapping

Phase 2 artwork includes:

- build workflow diagrams;
- local-build illustrations;
- artifact illustrations;
- source-privacy diagrams.

Critical review:

- [ ] source boundary is technically accurate;
- [ ] artifact-only boundary is not misleading.

# 79. Phase 3 Mapping

Phase 3 artwork includes:

- live execution diagrams;
- Job/Run diagrams;
- telemetry illustrations;
- video thumbnails;
- execution workflow diagrams.

Review must preserve Job/Run distinction.

# 80. Phase 4 Mapping

Phase 4 artwork includes:

- booking workflow;
- platform/resource diagrams;
- credit explanations;
- availability illustrations.

Financial visuals must not misrepresent credits as money.

# 81. Phase 5 Mapping

Phase 5 artwork includes:

- lab imagery;
- physical robot imagery;
- Lab Agent diagrams;
- robot/resource illustrations;
- safety boundary diagrams.

Physical/simulation distinction is mandatory.

# 82. Phase 6 Mapping

Phase 6 artwork includes:

- security architecture diagrams;
- source privacy diagrams;
- artifact security diagrams;
- tenant isolation diagrams.

Security diagrams require security review.

# 83. Phase 7 Mapping

Phase 7 artwork includes:

- scale architecture;
- operations dashboards;
- fleet illustrations;
- performance diagrams.

Artwork must reflect actual architecture.

# 84. Phase 8 Mapping

Phase 8 artwork includes:

- production launch artwork;
- release diagrams;
- supported-platform imagery;
- product demonstrations;
- production documentation screenshots.

All published artwork must match the production release.

# 85. Risks

| Risk | Mitigation |
|---|---|
| Logo inconsistency | Controlled master assets |
| Visual drift | Design review |
| Incorrect architecture diagram | Technical review |
| Fake hardware representation | Label conceptual artwork |
| License violation | Asset metadata |
| Source leakage | Screenshot/privacy review |
| Unsafe robot imagery | Safety review |
| Simulation mistaken for physical | Explicit labels |
| Excessive asset size | Optimization |
| Outdated screenshots | Version tracking |
| Accessibility failure | Alt text and audits |
| Brand dilution | Asset approval process |

# 86. Licensing Risk

No production asset may be approved when its license is unknown.

If licensing evidence is unavailable:

    Asset
      |
      v
    HOLD
      |
      v
    Licensing Review
      |
      +--> APPROVED
      |
      +--> REJECTED

# 87. Brand Dilution Risk

Avoid creating many unofficial variants.

There should be one authoritative:

- logo;
- wordmark;
- product naming convention;
- primary visual language.

Experimental artwork remains explicitly experimental.

# 88. Open Questions

The following may require final brand decisions:

1. Exact final Kritva brand color values.
2. Final logo geometry and clear-space measurement.
3. Final production typeface.
4. Final illustration line-weight standard.
5. Final icon library.
6. Final photography treatment.
7. Final robot visual style.
8. Final video thumbnail template.
9. Final asset-management repository.
10. Final attribution/license metadata format.
11. Final AI-art provenance policy.
12. Final marketing-specific brand extensions.

These questions must not override already-approved product, security, privacy,
or safety requirements.

# 89. Artwork Review Checklist

## Brand

- [ ] Correct Kritva logo.
- [ ] Correct product name.
- [ ] Correct logo variant.
- [ ] Correct clear space.
- [ ] Correct proportions.
- [ ] Correct color.
- [ ] No unauthorized modifications.

## Visual

- [ ] Composition is clear.
- [ ] Hierarchy is strong.
- [ ] Negative space is sufficient.
- [ ] Typography is consistent.
- [ ] Icons are consistent.
- [ ] Illustration style is consistent.

## Technical

- [ ] Architecture is accurate.
- [ ] Labels are correct.
- [ ] Data flow is correct.
- [ ] Security boundary is correct.
- [ ] Physical/software boundary is correct.

## Accessibility

- [ ] Alt text exists where required.
- [ ] Contrast is sufficient.
- [ ] Color is not sole information.
- [ ] Diagram has text explanation.
- [ ] Small text is readable.

## Security/Privacy

- [ ] No credentials.
- [ ] No private source.
- [ ] No customer information.
- [ ] No internal secrets.
- [ ] No confidential infrastructure details.

## Licensing

- [ ] Source identified.
- [ ] License identified.
- [ ] Attribution recorded.
- [ ] Modification rights checked.
- [ ] Distribution rights checked.

# 90. Logo Acceptance Checklist

- [ ] Master SVG exists.
- [ ] Dark-background version exists.
- [ ] Light-background version exists.
- [ ] Transparent version exists.
- [ ] Symbol version exists.
- [ ] Wordmark exists.
- [ ] Lockup exists.
- [ ] App icon exists.
- [ ] Favicon exists.
- [ ] Minimum size defined.
- [ ] Clear space defined.
- [ ] Misuse examples documented.

# 91. Illustration Acceptance Checklist

- [ ] Style follows guideline.
- [ ] Composition is clear.
- [ ] Technical content is accurate.
- [ ] Robot representation is plausible.
- [ ] Simulation/physical state is clear.
- [ ] Accessibility text exists.
- [ ] Source file exists.
- [ ] Export is optimized.
- [ ] License is documented.

# 92. Diagram Acceptance Checklist

- [ ] Architecture is correct.
- [ ] Components are named correctly.
- [ ] Arrows are directional.
- [ ] Trust boundaries are clear.
- [ ] Physical boundaries are clear.
- [ ] Security boundaries are clear.
- [ ] No unnecessary crossings.
- [ ] Legend exists where needed.
- [ ] Accessible description exists.
- [ ] Source file is retained.

# 93. Screenshot Acceptance Checklist

- [ ] Correct release/build.
- [ ] Correct theme.
- [ ] Correct data.
- [ ] No credentials.
- [ ] No source leakage.
- [ ] No personal data.
- [ ] Correct dimensions.
- [ ] Clear crop.
- [ ] Appropriate annotations.
- [ ] Version metadata recorded.

# 94. Video Thumbnail Acceptance Checklist

- [ ] Kritva identity visible.
- [ ] Product identity visible.
- [ ] Main subject clear.
- [ ] Text readable.
- [ ] Contrast sufficient.
- [ ] No misleading robot.
- [ ] No confidential information.
- [ ] Correct aspect ratio.
- [ ] Export optimized.

# 95. Asset Management Acceptance Checklist

- [ ] Asset ID assigned where required.
- [ ] Source file exists.
- [ ] Export exists.
- [ ] Owner recorded.
- [ ] License recorded.
- [ ] Version recorded.
- [ ] Approval status recorded.
- [ ] Intended use recorded.
- [ ] Replacement identified if deprecated.

# 96. Production Artwork Definition of Done

An artwork asset is Done when:

- [ ] design requirements are satisfied;
- [ ] brand review is complete;
- [ ] technical review is complete where applicable;
- [ ] accessibility requirements are satisfied;
- [ ] privacy review is complete where applicable;
- [ ] licensing is documented;
- [ ] source file is retained;
- [ ] production export is generated;
- [ ] asset naming is correct;
- [ ] asset is stored in the correct location;
- [ ] evidence is available;
- [ ] reviewer has approved it.

# 97. Artwork Evidence

Evidence should include:

- source file;
- final export;
- preview;
- asset metadata;
- license evidence;
- reviewer approval;
- technical review where applicable.

# 98. Sign-Off Template

    ARTWORK REVIEW SIGN-OFF

    Asset ID:
    Asset Name:
    Product:
    Version:
    Creator:
    Reviewer:
    Date:

    Brand: PASS / FAIL
    Visual: PASS / FAIL
    Technical: PASS / FAIL / N/A
    Accessibility: PASS / FAIL
    Security/Privacy: PASS / FAIL / N/A
    Safety: PASS / FAIL / N/A
    Licensing: PASS / FAIL
    Performance: PASS / FAIL / N/A

    Source:
    Export:
    License:
    Intended Use:

    Findings:
    Actions:
    Decision:

    APPROVED / APPROVED_WITH_ACTIONS / REJECTED

# 99. Asset Lifecycle

The controlled lifecycle is:

    IDEA
      |
      v
    DRAFT
      |
      v
    REVIEW
      |
      v
    APPROVED
      |
      v
    PUBLISHED
      |
      v
    DEPRECATED
      |
      v
    RETIRED

Assets must not skip REVIEW for production brand-critical artwork.

# 100. Release Review

Before a product release:

- [ ] product screenshots are current;
- [ ] diagrams match architecture;
- [ ] artwork matches product naming;
- [ ] logos are current;
- [ ] video thumbnails are current;
- [ ] deprecated assets are not referenced;
- [ ] licenses remain valid;
- [ ] no sensitive information is exposed.

# 101. Final Acceptance Criteria

## Brand

- [ ] Kritva identity is consistent.
- [ ] Logo is used correctly.
- [ ] Wordmark is correct.
- [ ] Product hierarchy is correct.
- [ ] Colors are consistent.
- [ ] Artwork does not dilute brand identity.

## Illustration

- [ ] Technical illustration style is consistent.
- [ ] Robot imagery is credible.
- [ ] Human imagery is appropriate.
- [ ] Simulation and physical imagery are distinct.
- [ ] No misleading claims are introduced.

## Diagrams

- [ ] Architecture is accurate.
- [ ] Data flows are correct.
- [ ] Trust boundaries are correct.
- [ ] Security boundaries are correct.
- [ ] Safety boundaries are correct.
- [ ] Diagram remains understandable without decoration.

## Screenshots

- [ ] Product state is current.
- [ ] Privacy is protected.
- [ ] Security information is protected.
- [ ] Correct theme is represented.
- [ ] Correct version is recorded.

## Video

- [ ] Thumbnail follows template.
- [ ] Product identity is visible.
- [ ] Technical claims are accurate.
- [ ] Captured content is approved.
- [ ] No confidential information appears.

## Assets

- [ ] Naming is correct.
- [ ] Format is correct.
- [ ] Resolution is correct.
- [ ] Source exists.
- [ ] License is known.
- [ ] Metadata exists.
- [ ] Approval is recorded.

# 102. Phase Completion Artwork Gate

A phase cannot claim artwork readiness merely because assets exist.

Artwork readiness requires:

    Assets
       +
    Correctness
       +
    Brand Consistency
       +
    Accessibility
       +
    Licensing
       +
    Privacy
       +
    Technical Accuracy
       =
    Artwork Ready

# 103. Final Invariants

1. The official Kritva logo is the authoritative brand mark.
2. Logo proportions are never modified.
3. Logo variants are controlled.
4. Brand colors remain consistent.
5. Semantic colors are not confused with brand colors.
6. Artwork should communicate engineering credibility.
7. Technical diagrams must be technically correct.
8. Security boundaries must be represented accurately.
9. Physical safety authority must not be misrepresented.
10. Simulation must be distinguishable from physical operation.
11. Screenshots must not expose source code or secrets.
12. Video thumbnails must not imply unsupported capabilities.
13. Unknown-license artwork cannot enter production.
14. Source artwork must be retained for controlled assets.
15. Exported assets must be reproducible.
16. Asset names must be predictable.
17. Deprecated assets must not be used for new content.
18. Important artwork must have accessibility support.
19. Color must not be the only communication channel.
20. AI-generated artwork must not be presented as factual evidence.
21. Real robot imagery must represent real hardware accurately.
22. Stock imagery must not be presented as Kritva hardware.
23. Product screenshots must correspond to identifiable product versions.
24. Architecture diagrams must track architectural changes.
25. Artwork review is required for production-critical visual assets.
26. Licensing review is mandatory for third-party assets.
27. Security/privacy review is mandatory for sensitive screenshots and media.
28. Safety review is mandatory for safety-sensitive robot imagery.
29. Phase and release documentation must use current approved artwork.
30. Brand consistency must be maintained across Kritva and Kritva RaaS.

# 104. Final Artwork Principle

> Kritva artwork is part of the product's technical communication system, not
> merely decoration. Every logo, illustration, robot image, diagram, screenshot
> and video thumbnail must reinforce the identity of Kritva as an open robotic
> operating and computing platform while remaining technically truthful,
> visually consistent, accessible, secure, privacy-conscious and properly
> licensed. Artwork must distinguish software from physical systems,
> simulation from real robots, and conceptual vision from validated product
> capability. Technical diagrams must communicate architecture accurately,
> screenshots must represent real product states without exposing private
> information, and visual assets must remain traceable through controlled
> source files, naming, licensing and approval. The standard for production
> artwork is therefore not simply that it looks attractive, but that it
> communicates the correct engineering story, protects users and intellectual
> property, remains usable across supported platforms and themes, and can be
> maintained as Kritva RaaS evolves from software foundation through simulated
> execution, laboratory deployment and production robotic services.
