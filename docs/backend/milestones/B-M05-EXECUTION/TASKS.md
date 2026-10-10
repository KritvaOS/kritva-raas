# B-M05-EXECUTION — Tasks

Milestone: B-M05 — Execution
Source of scope: [MILESTONE.md](MILESTONE.md)

# 5 Detailed Task Breakdown

## 5.1 Task Register

| ID | Description | Estimate | Owner Role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-BE-5-001 | Define Job domain model | 2d | Architect/Backend | B-M01 | [ ] |
| KR-BE-5-002 | Define Job state machine | 2d | Architect | 001 | [ ] |
| KR-BE-5-003 | Define Run domain model | 2d | Architect/Backend | 001 | [ ] |
| KR-BE-5-004 | Define Run state machine | 1.5d | Architect | 003 | [ ] |
| KR-BE-5-005 | Define execution eligibility contract | 2d | Architect/Backend | B-M02-04 | [ ] |
| KR-BE-5-006 | Define execution policy | 1.5d | Architect/Product | 002,004 | [ ] |
| KR-BE-5-007 | Implement JobRepository | 2.5d | Backend/Database | 001 | [ ] |
| KR-BE-5-008 | Implement RunRepository | 2.5d | Backend/Database | 003 | [ ] |
| KR-BE-5-009 | Implement Job state history | 1.5d | Backend | 002 | [ ] |
| KR-BE-5-010 | Implement Run state history | 1.5d | Backend | 004 | [ ] |
| KR-BE-5-011 | Implement JobService | 3d | Backend | 007,009 | [ ] |
| KR-BE-5-012 | Implement RunService | 3d | Backend | 008,010 | [ ] |
| KR-BE-5-013 | Implement eligibility service | 3d | Backend | 005 | [ ] |
| KR-BE-5-014 | Implement execution command service | 2.5d | Backend | 011-013 | [ ] |
| KR-BE-5-015 | Define Queue interface | 1.5d | Architect/Backend | B-M01 | [ ] |
| KR-BE-5-016 | Implement queue adapter | 2.5d | Backend/Infrastructure | 015 | [ ] |
| KR-BE-5-017 | Implement durable Job enqueue | 2d | Backend | 011,016 | [ ] |
| KR-BE-5-018 | Implement worker framework | 3d | Backend | 016 | [ ] |
| KR-BE-5-019 | Implement Job claiming | 2d | Backend | 018 | [ ] |
| KR-BE-5-020 | Implement worker heartbeat | 1.5d | Backend | 018 | [ ] |
| KR-BE-5-021 | Implement worker timeout recovery | 2d | Backend | 019,020 | [ ] |
| KR-BE-5-022 | Implement dead-letter handling | 2d | Backend | 016,018 | [ ] |
| KR-BE-5-023 | Define Lab Agent contract | 2d | Architect/Robotics | B-M03 | [ ] |
| KR-BE-5-024 | Implement Lab Agent client | 3d | Backend/Robotics | 023 | [ ] |
| KR-BE-5-025 | Implement simulated Lab Agent | 4d | Robotics/Backend | 023 | [ ] |
| KR-BE-5-026 | Implement simulated runtime | 3d | Robotics | 025 | [ ] |
| KR-BE-5-027 | Implement deployment flow | 3d | Backend | 013,024 | [ ] |
| KR-BE-5-028 | Implement start flow | 2.5d | Backend | 027 | [ ] |
| KR-BE-5-029 | Implement stop flow | 2.5d | Backend | 028 | [ ] |
| KR-BE-5-030 | Implement execution monitor | 3d | Backend | 028 | [ ] |
| KR-BE-5-031 | Implement timeout service | 3d | Backend | 030 | [ ] |
| KR-BE-5-032 | Implement cancellation flow | 2.5d | Backend | 029 | [ ] |
| KR-BE-5-033 | Implement cleanup flow | 2.5d | Backend | 029-032 | [ ] |
| KR-BE-5-034 | Implement retry policy | 2d | Backend | 021,032 | [ ] |
| KR-BE-5-035 | Implement execution events | 2d | Backend | 011,012 | [ ] |
| KR-BE-5-036 | Implement execution audit | 2d | Security/Backend | 011-014 | [ ] |
| KR-BE-5-037 | Implement Job API | 2.5d | Backend | 011,014 | [ ] |
| KR-BE-5-038 | Implement Run API | 2.5d | Backend | 012 | [ ] |
| KR-BE-5-039 | Implement execution control API | 2.5d | Backend | 014,032 | [ ] |
| KR-BE-5-040 | Implement idempotent start/stop | 2d | Backend | 039 | [ ] |
| KR-BE-5-041 | Implement booking validation | 2d | Backend | B-M04 | [ ] |
| KR-BE-5-042 | Implement credit consumption integration | 2d | Backend | B-M04 | [ ] |
| KR-BE-5-043 | Implement execution reconciliation | 2.5d | Backend | 033,042 | [ ] |
| KR-BE-5-044 | Add Job unit tests | 2.5d | QA | 007-014 | [ ] |
| KR-BE-5-045 | Add Run unit tests | 2.5d | QA | 008-012 | [ ] |
| KR-BE-5-046 | Add queue/worker tests | 3d | QA | 016-022 | [ ] |
| KR-BE-5-047 | Add Lab Agent contract tests | 3d | QA/Robotics | 023-026 | [ ] |
| KR-BE-5-048 | Add execution lifecycle tests | 3d | QA | 027-034 | [ ] |
| KR-BE-5-049 | Add timeout tests | 2.5d | QA | 031 | [ ] |
| KR-BE-5-050 | Add cancellation tests | 2.5d | QA | 032 | [ ] |
| KR-BE-5-051 | Add worker crash recovery tests | 3d | QA | 021,033 | [ ] |
| KR-BE-5-052 | Add idempotency tests | 2.5d | QA | 040 | [ ] |
| KR-BE-5-053 | Add tenant isolation tests | 2.5d | Security/QA | 037-040 | [ ] |
| KR-BE-5-054 | Add artifact execution security tests | 3d | Security/QA | 013,027 | [ ] |
| KR-BE-5-055 | Add execution E2E tests | 4d | QA | 041-043,048 | [ ] |
| KR-BE-5-056 | Add simulated fault injection tests | 3d | QA/Robotics | 025,048-051 | [ ] |
| KR-BE-5-057 | Add load/concurrency tests | 3d | QA | 046,055 | [ ] |
| KR-BE-5-058 | Add execution reconciliation tests | 2.5d | QA | 043 | [ ] |
| KR-BE-5-059 | Security review | 3d | Security | 013,027,036,040 | [ ] |
| KR-BE-5-060 | Architecture review | 2d | Architect | All | [ ] |
| KR-BE-5-061 | Physical safety boundary review | 2d | Robotics/Safety | 029,032 | [ ] |
| KR-BE-5-062 | Documentation update | 1.5d | Documentation | All | [ ] |
| KR-BE-5-063 | Milestone acceptance/evidence | 1d | Architect/Product | All | [ ] |

Estimates are indicative engineering-day estimates and must be refined during
task refinement.

## 5.2 Execution Dependency Flow

    Artifact
       |
       v
    Booking
       |
       v
    Eligibility
       |
       v
    Job
       |
       v
    Queue
       |
       v
    Worker
       |
       v
    Execution Service
       |
       v
    Lab Agent
       |
       v
    Run

## 5.3 Worker Dependency Flow

    Queue
      |
      v
    Worker
      |
      v
    Claim Job
      |
      v
    Validate
      |
      v
    Execute
      |
      v
    Ack / Retry / Dead Letter

## 5.4 Run Dependency Flow

    Job
      |
      v
    Run Created
      |
      v
    Preparing
      |
      v
    Starting
      |
      v
    Running
      |
      +--> Completed
      +--> Failed
      +--> Timeout
      +--> Cancelled

---
