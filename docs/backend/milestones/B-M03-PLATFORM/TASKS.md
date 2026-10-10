# B-M03-PLATFORM — Tasks

Milestone: B-M03 — Platform
Source of scope: [MILESTONE.md](MILESTONE.md)

# 5 Detailed Task Breakdown

## 5.1 Task Register

| ID | Description | Estimate | Owner Role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-BE-2-053 | Define platform domain model | 2d | Architect/Backend | B-M01 | [ ] |
| KR-BE-2-054 | Define platform lifecycle rules | 1d | Architect | 053 | [ ] |
| KR-BE-2-055 | Define architecture model | 1.5d | Backend | 053 | [ ] |
| KR-BE-2-056 | Define capability model | 1.5d | Architect/Backend | 053 | [ ] |
| KR-BE-2-057 | Define platform configuration model | 2d | Backend | 053,056 | [ ] |
| KR-BE-2-058 | Implement PlatformRepository | 2d | Backend/Database | 053 | [ ] |
| KR-BE-2-059 | Implement PlatformVersionRepository | 2d | Backend/Database | 053 | [ ] |
| KR-BE-2-060 | Implement ArchitectureRepository | 1.5d | Backend/Database | 055 | [ ] |
| KR-BE-2-061 | Implement CapabilityRepository | 1.5d | Backend/Database | 056 | [ ] |
| KR-BE-2-062 | Implement ConfigurationRepository | 2d | Backend/Database | 057 | [ ] |
| KR-BE-2-063 | Implement PlatformService | 2.5d | Backend | 058-062 | [ ] |
| KR-BE-2-064 | Implement Platform APIs | 2.5d | Backend | 063 | [ ] |
| KR-BE-2-065 | Implement Platform Administration APIs | 2d | Backend | 063 | [ ] |
| KR-BE-2-066 | Define Lab model | 1.5d | Architect/Backend | B-M01 | [ ] |
| KR-BE-2-067 | Define Robot model | 1.5d | Backend | 066 | [ ] |
| KR-BE-2-068 | Define Resource model | 2d | Architect/Backend | 066,067 | [ ] |
| KR-BE-2-069 | Define maintenance windows | 1.5d | Backend | 068 | [ ] |
| KR-BE-2-070 | Define availability windows | 1.5d | Backend | 068 | [ ] |
| KR-BE-2-071 | Implement LabRepository | 2d | Backend/Database | 066 | [ ] |
| KR-BE-2-072 | Implement RobotRepository | 2d | Backend/Database | 067 | [ ] |
| KR-BE-2-073 | Implement ResourceRepository | 2.5d | Backend/Database | 068 | [ ] |
| KR-BE-2-074 | Implement MaintenanceRepository | 2d | Backend/Database | 069 | [ ] |
| KR-BE-2-075 | Implement AvailabilityRepository | 2d | Backend/Database | 070 | [ ] |
| KR-BE-2-076 | Implement LabService | 2d | Backend | 071 | [ ] |
| KR-BE-2-077 | Implement ResourceService | 2.5d | Backend | 072,073 | [ ] |
| KR-BE-2-078 | Implement Resource status APIs | 2d | Backend | 077 | [ ] |
| KR-BE-2-079 | Implement Lab APIs | 2d | Backend | 076 | [ ] |
| KR-BE-2-080 | Implement compatibility domain model | 2d | Architect/Backend | B-M02,053 | [ ] |
| KR-BE-2-081 | Implement compatibility engine | 3d | Backend | 080 | [ ] |
| KR-BE-2-082 | Implement compatibility APIs | 2d | Backend | 081 | [ ] |
| KR-BE-2-083 | Implement compatibility audit evidence | 1.5d | Backend/Security | 081 | [ ] |
| KR-BE-2-084 | Define WebSocket protocol | 2d | Architect/Backend | API v1 | [ ] |
| KR-BE-2-085 | Implement WebSocket gateway | 3d | Backend | 084 | [ ] |
| KR-BE-2-086 | Implement WebSocket authentication | 2d | Security/Backend | 085 | [ ] |
| KR-BE-2-087 | Implement WebSocket authorization | 2.5d | Security/Backend | 086 | [ ] |
| KR-BE-2-088 | Implement subscription manager | 2.5d | Backend | 087 | [ ] |
| KR-BE-2-089 | Implement event envelope/sequence | 2d | Backend | 084 | [ ] |
| KR-BE-2-090 | Implement heartbeat | 1d | Backend | 085 | [ ] |
| KR-BE-2-091 | Implement backpressure controls | 2d | Backend | 088,089 | [ ] |
| KR-BE-2-092 | Implement connection cleanup | 1.5d | Backend | 085 | [ ] |
| KR-BE-2-093 | Implement reconnect/resync contract | 2d | Backend | 089 | [ ] |
| KR-BE-2-094 | Add platform tests | 2.5d | QA | 063-065 | [ ] |
| KR-BE-2-095 | Add lab/robot/resource tests | 3d | QA | 076-079 | [ ] |
| KR-BE-2-096 | Add compatibility tests | 3d | QA | 081-083 | [ ] |
| KR-BE-2-097 | Add WebSocket contract tests | 3d | QA | 085-093 | [ ] |
| KR-BE-2-098 | Add WebSocket security tests | 2.5d | Security/QA | 086,087 | [ ] |
| KR-BE-2-099 | Add tenant isolation tests | 2.5d | Security/QA | All | [ ] |
| KR-BE-2-100 | Add fault/reconnect tests | 2.5d | QA | 093 | [ ] |
| KR-BE-2-101 | Add platform/resource E2E test | 3d | QA | 064,078,082 | [ ] |
| KR-BE-2-102 | Add WebSocket E2E test | 3d | QA | 097-100 | [ ] |
| KR-BE-2-103 | Performance/load baseline | 3d | QA/Backend | 102 | [ ] |
| KR-BE-2-104 | Security review | 2.5d | Security | 081,085-093 | [ ] |
| KR-BE-2-105 | Architecture review | 2d | Architect | All | [ ] |
| KR-BE-2-106 | Documentation update | 1.5d | Documentation | All | [ ] |
| KR-BE-2-107 | Milestone acceptance/evidence | 1d | Architect/Product | All | [ ] |
| KR-CA-027 | Implement coding-agent provider registry model, repository and read API | 2.0d | Backend | DB-M02 (KR-CA-032) | [ ] |
| KR-CA-028 | Implement operator write API with audit for provider metadata | 1.0d | Backend | KR-CA-027 | [ ] |
| KR-CA-029 | Seed `claude-code` and `openai-codex` provider records | 0.5d | Backend | KR-CA-027 | [ ] |
| KR-CA-030 | Add provider metadata contract tests and platform-separation negative tests | 1.0d | QA | KR-CA-027 to KR-CA-029 | [ ] |

Estimates are indicative engineering-day estimates and must be refined during
task refinement.

## 5.2 Platform Dependency Flow

    Platform
       |
       v
    Version
       |
       +--> Architecture
       +--> Runtime
       +--> SDK
       +--> Capabilities
       +--> Configuration
       |
       v
    Compatibility Engine

## 5.3 Operational Dependency Flow

    Lab
       |
       +--> Robot
       |      |
       |      v
       |   Resource
       |
       +--> Simulator
              |
              v
           Resource

## 5.4 WebSocket Dependency Flow

    Event Source
         |
         v
    Event Envelope
         |
         v
    Event Router
         |
         v
    Subscription Manager
         |
         v
    Authorization
         |
         v
    Connection
         |
         v
       Client

---
