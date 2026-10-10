# F-M05-EXECUTION — Tasks

Milestone: F-M05 — Execution
Source of scope: [MILESTONE.md](MILESTONE.md)

# 5. Detailed Task Breakdown

## 5.1 Task Register

| ID | Description | Estimate | Owner Role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-FE-3-001 | Define execution information architecture | 1.5d | UX/UI | F-M04 | [ ] |
| KR-FE-3-002 | Define Job/Run API contracts | 2.5d | Architect/Backend | F-M04 | [ ] |
| KR-FE-3-003 | Define execution event contract | 2.0d | Architect/Backend | 002 | [ ] |
| KR-FE-3-004 | Implement artifact/booking eligibility validation | 2.5d | Backend | 002 | [ ] |
| KR-FE-3-005 | Implement Job creation service | 3.0d | Backend | 004 | [ ] |
| KR-FE-3-006 | Implement Job state machine | 3.0d | Backend | 005 | [ ] |
| KR-FE-3-007 | Implement Run creation/lifecycle | 3.0d | Backend | 006 | [ ] |
| KR-FE-3-008 | Implement execution command service | 3.0d | Backend | 006,007 | [ ] |
| KR-FE-3-009 | Implement idempotent execution commands | 2.0d | Backend | 008 | [ ] |
| KR-FE-3-010 | Implement Lab Agent execution adapter | 4.0d | Robotics/Backend | 008 | [ ] |
| KR-FE-3-011 | Implement simulation execution adapter | 3.0d | Robotics | 010 | [ ] |
| KR-FE-3-012 | Implement execution WebSocket events | 3.0d | Backend | 003,006 | [ ] |
| KR-FE-3-013 | Implement reconnect/resync | 2.5d | Frontend/Backend | 012 | [ ] |
| KR-FE-3-014 | Implement Job creation UI | 2.0d | Frontend | 002,005 | [ ] |
| KR-FE-3-015 | Implement Job detail UI | 2.5d | Frontend | 006,007 | [ ] |
| KR-FE-3-016 | Implement Job lifecycle display | 2.0d | Frontend | 015 | [ ] |
| KR-FE-3-017 | Implement Run lifecycle display | 2.0d | Frontend | 015 | [ ] |
| KR-FE-3-018 | Implement execution control panel | 2.5d | Frontend | 008,015 | [ ] |
| KR-FE-3-019 | Implement software stop flow | 2.5d | Frontend/Backend | 008,018 | [ ] |
| KR-FE-3-020 | Implement cancellation flow | 2.0d | Frontend/Backend | 008 | [ ] |
| KR-FE-3-021 | Implement retry policy/UI | 2.0d | Frontend/Backend | 008 | [ ] |
| KR-FE-3-022 | Implement log streaming UI | 3.0d | Frontend | 012 | [ ] |
| KR-FE-3-023 | Implement log filtering/search | 1.5d | Frontend | 022 | [ ] |
| KR-FE-3-024 | Implement Lab Agent status display | 1.5d | Frontend | 010 | [ ] |
| KR-FE-3-025 | Implement runtime status display | 1.5d | Frontend | 010 | [ ] |
| KR-FE-3-026 | Implement safety state model/UI | 3.0d | Frontend/Safety | 024,025 | [ ] |
| KR-FE-3-027 | Implement physical E-stop presentation | 2.0d | Frontend/Safety | 026 | [ ] |
| KR-FE-3-028 | Implement execution audit events | 2.0d | Backend/Security | 008 | [ ] |
| KR-FE-3-029 | Add Job lifecycle tests | 2.5d | QA | 005-007 | [ ] |
| KR-FE-3-030 | Add command idempotency tests | 2.0d | QA | 008,009 | [ ] |
| KR-FE-3-031 | Add execution concurrency tests | 2.5d | QA | 008 | [ ] |
| KR-FE-3-032 | Add Lab Agent integration tests | 3.0d | QA/Robotics | 010,011 | [ ] |
| KR-FE-3-033 | Add WebSocket reconnect tests | 2.0d | QA | 012,013 | [ ] |
| KR-FE-3-034 | Add log-stream tests | 2.0d | QA | 022 | [ ] |
| KR-FE-3-035 | Add safety-state tests | 3.0d | QA/Safety | 026,027 | [ ] |
| KR-FE-3-036 | Add software-stop tests | 2.0d | QA | 019 | [ ] |
| KR-FE-3-037 | Add E-stop presentation tests | 2.0d | QA/Safety | 027 | [ ] |
| KR-FE-3-038 | Add execution E2E test | 3.0d | QA | 014-027 | [ ] |
| KR-FE-3-039 | Add disconnect/failure E2E tests | 2.5d | QA | 013,032 | [ ] |
| KR-FE-3-040 | Complete security/safety review | 3.0d | Security/Safety | All | [ ] |
| KR-FE-3-041 | Complete UI review | 2.0d | UX/UI | 014-027 | [ ] |
| KR-FE-3-042 | Complete milestone documentation | 1.5d | Documentation | All | [ ] |
| KR-FE-3-043 | Milestone acceptance and evidence | 1.0d | Architect/Product | All | [ ] |

Estimates are indicative engineering-day estimates and must be refined during
task refinement.

## 5.2 Job Creation Interface

Conceptual operation:

    createJob({
        projectId,
        artifactId,
        bookingId,
        idempotencyKey
    })

The server validates:

- organization ownership;
- project access;
- artifact ownership;
- artifact security state;
- platform compatibility;
- booking validity;
- booking/resource eligibility;
- execution policy.

## 5.3 Job Response

Conceptual response:

    {
        "job_id": "job-001",
        "project_id": "project-001",
        "artifact_id": "artifact-001",
        "booking_id": "booking-001",
        "status": "CREATED",
        "created_at": "...",
        "run_id": null
    }

The response does not imply that execution has started.

## 5.4 Start Interface

Conceptual operation:

    startJob({
        jobId,
        idempotencyKey
    })

Possible response:

    ACCEPTED

The actual state must be observed through durable Job/Run state.

## 5.5 Software Stop Interface

Conceptual operation:

    stopRun({
        jobId,
        runId,
        mode: "SOFTWARE_STOP",
        idempotencyKey
    })

The operation is a request.

It is not evidence that the robot has already stopped.

## 5.6 Command State

Execution commands should expose:

- REQUESTED;
- ACCEPTED;
- IN_PROGRESS;
- COMPLETED;
- FAILED;
- TIMEOUT;
- REJECTED.

Example:

    Software Stop
         |
         v
      REQUESTED
         |
         v
      ACCEPTED
         |
         v
      IN_PROGRESS
         |
         v
      COMPLETED

If the runtime cannot confirm completion:

    IN_PROGRESS
         |
         v
      TIMEOUT

The UI must not show STOPPED until the authoritative Run state indicates that
execution has stopped.

## 5.7 Job/Run Relationship

Conceptually:

    Job J-001
       |
       +-- Run R-001
       |
       +-- Run R-002
       |
       +-- Run R-003

Whether multiple Runs are permitted for a Job depends on retry policy.

A retry must not silently overwrite historical Run records.

## 5.8 Execution Events

Conceptual event:

    {
        "protocol_version": "1.0",
        "event_id": "evt-001",
        "timestamp": "...",
        "event": "run.state_changed",
        "resource": {
            "type": "run",
            "id": "run-001"
        },
        "context": {
            "organization_id": "org-001",
            "job_id": "job-001"
        },
        "sequence": 42,
        "data": {
            "from": "STARTING",
            "to": "RUNNING"
        }
    }

Events are at-least-once.

The UI must deduplicate using event identity and detect sequence gaps.

## 5.9 Log Event

Conceptual event:

    {
        "event": "run.log",
        "resource": {
            "type": "run",
            "id": "run-001"
        },
        "sequence": 1001,
        "data": {
            "severity": "INFO",
            "source": "runtime",
            "message": "Application started"
        }
    }

High-frequency logs may use specialized transport later.

## 5.10 Safety Event

Conceptual event:

    {
        "event": "safety.state_changed",
        "resource": {
            "type": "resource",
            "id": "resource-001"
        },
        "data": {
            "state": "PHYSICAL_ESTOP_ACTIVE",
            "source": "safety_controller",
            "observed_at": "..."
        }
    }

Safety events must identify their source and freshness.

---
