# F-M07-RESULTS — Tasks

Milestone: F-M07 — Results
Source of scope: [MILESTONE.md](MILESTONE.md)

# 5. Detailed Task Breakdown

## 5.1 Task Register

| ID | Description | Estimate | Owner Role | Dependencies | Status |
|---|---|---:|---|---|---|
| KR-FE-3-086 | Define Results information architecture | 1.5d | UX/UI | F-M06 | [ ] |
| KR-FE-3-087 | Define Result API contracts | 2.5d | Architect/Backend | F-M05 | [ ] |
| KR-FE-3-088 | Define Result File API | 2.0d | Backend | 087 | [ ] |
| KR-FE-3-089 | Define Metrics API | 2.0d | Backend | 087 | [ ] |
| KR-FE-3-090 | Define Experiment API | 2.0d | Backend | 087 | [ ] |
| KR-FE-3-091 | Define Comparison API | 2.5d | Backend | 089,090 | [ ] |
| KR-FE-3-092 | Define Rerun contract | 2.5d | Architect/Backend | F-M05 | [ ] |
| KR-FE-3-093 | Define Download contract | 2.0d | Backend/Security | 088 | [ ] |
| KR-FE-3-094 | Implement Result repository/service | 3.0d | Backend | 087 | [ ] |
| KR-FE-3-095 | Implement Result lifecycle | 2.5d | Backend | 094 | [ ] |
| KR-FE-3-096 | Implement Result File service | 3.0d | Backend | 088,094 | [ ] |
| KR-FE-3-097 | Implement object-storage adapter | 3.0d | Backend/Cloud | 096 | [ ] |
| KR-FE-3-098 | Implement Metrics service | 3.0d | Backend | 089,094 | [ ] |
| KR-FE-3-099 | Implement Experiment service | 3.0d | Backend | 090 | [ ] |
| KR-FE-3-100 | Implement Comparison service | 3.5d | Backend | 098,099 | [ ] |
| KR-FE-3-101 | Implement Download service | 2.5d | Backend | 093,097 | [ ] |
| KR-FE-3-102 | Implement Rerun orchestration | 3.5d | Backend | 092, F-M04,F-M05 | [ ] |
| KR-FE-3-103 | Implement Result dashboard | 3.0d | Frontend | 087,095 | [ ] |
| KR-FE-3-104 | Implement Result detail | 3.0d | Frontend | 094-098 | [ ] |
| KR-FE-3-105 | Implement Result Files panel | 2.0d | Frontend | 096 | [ ] |
| KR-FE-3-106 | Implement Metrics panel | 2.5d | Frontend | 098 | [ ] |
| KR-FE-3-107 | Implement Experiment UI | 3.0d | Frontend | 099 | [ ] |
| KR-FE-3-108 | Implement Comparison UI | 3.0d | Frontend | 100 | [ ] |
| KR-FE-3-109 | Implement Rerun UI | 3.0d | Frontend | 102 | [ ] |
| KR-FE-3-110 | Implement Download UI | 2.0d | Frontend | 101 | [ ] |
| KR-FE-3-111 | Implement Result refresh/recovery | 2.0d | Frontend | 103,104 | [ ] |
| KR-FE-3-112 | Implement Result audit events | 2.0d | Backend/Security | 094,101,102 | [ ] |
| KR-FE-3-113 | Add Result lifecycle tests | 2.5d | QA | 094,095 | [ ] |
| KR-FE-3-114 | Add Result File tests | 2.0d | QA | 096 | [ ] |
| KR-FE-3-115 | Add Metrics tests | 2.0d | QA | 098 | [ ] |
| KR-FE-3-116 | Add Experiment tests | 2.0d | QA | 099 | [ ] |
| KR-FE-3-117 | Add Comparison tests | 2.5d | QA | 100 | [ ] |
| KR-FE-3-118 | Add Download tests | 2.0d | QA/Security | 101 | [ ] |
| KR-FE-3-119 | Add Rerun tests | 2.5d | QA | 102 | [ ] |
| KR-FE-3-120 | Add tenant-isolation tests | 2.0d | Security/QA | 094-102 | [ ] |
| KR-FE-3-121 | Add Result E2E test | 3.0d | QA | 103-110 | [ ] |
| KR-FE-3-122 | Add Rerun E2E test | 3.0d | QA | 109,121 | [ ] |
| KR-FE-3-123 | Add download-integrity test | 2.0d | QA | 110 | [ ] |
| KR-FE-3-124 | Add failure/recovery tests | 2.5d | QA | 095,096,101 | [ ] |
| KR-FE-3-125 | Complete security/privacy review | 2.5d | Security | All | [ ] |
| KR-FE-3-126 | Complete UI/accessibility review | 2.0d | UX/UI | 103-110 | [ ] |
| KR-FE-3-127 | Complete milestone documentation | 1.5d | Documentation | All | [ ] |
| KR-FE-3-128 | Milestone acceptance and evidence | 1.0d | Architect/Product | All | [ ] |

Estimates are indicative engineering-day estimates and must be refined during
task refinement.

## 5.2 Result Query Interface

Conceptual operation:

    listResults({
        projectId,
        status,
        platformId,
        experimentId,
        from,
        to,
        page
    })

The server performs authorization and filtering.

The Studio must not retrieve all tenant results and filter locally.

## 5.3 Result Detail Interface

Conceptual operation:

    getResult({
        resultId
    })

The response should include:

- Result;
- Run summary;
- artifact summary;
- platform summary;
- key metrics;
- file summary;
- experiment references.

## 5.4 Result File Interface

Conceptual operation:

    listResultFiles({
        resultId
    })

File metadata should not expose unrestricted storage credentials.

## 5.5 Metrics Interface

Conceptual operation:

    listResultMetrics({
        resultId
    })

Metrics are structured records.

Example:

    {
        "metric_id": "metric-001",
        "name": "p95_latency",
        "value": 38.2,
        "type": "NUMBER",
        "aggregation": "P95",
        "unit": "ms"
    }

## 5.6 Experiment Interface

Conceptual operations:

    createExperiment(...)
    getExperiment(...)
    updateExperiment(...)
    addRunToExperiment(...)
    removeRunFromExperiment(...)
    listExperimentRuns(...)

Experiment membership changes must be authorized and auditable.

## 5.7 Comparison Interface

Conceptual operation:

    createComparison({
        experimentId,
        baselineRunId,
        candidateRunIds,
        metrics
    })

The service validates:

- Run ownership;
- Result availability;
- metric compatibility;
- experiment membership;
- comparison policy.

## 5.8 Rerun Interface

Conceptual operation:

    createRerun({
        sourceRunId,
        artifactId,
        bookingId,
        configurationOverrides,
        idempotencyKey
    })

The server revalidates all execution requirements.

## 5.9 Download Interface

Conceptual operation:

    requestDownload({
        resultFileId,
        idempotencyKey
    })

Response:

    {
        "download_id": "download-001",
        "status": "GENERATED",
        "expires_at": "...",
        "access": "short-lived"
    }

The actual access mechanism remains provider-neutral.

## 5.10 Result Event

Conceptual event:

    {
        "event": "result.status_changed",
        "resource": {
            "type": "result",
            "id": "result-001"
        },
        "data": {
            "from": "PROCESSING",
            "to": "AVAILABLE"
        }
    }

The event informs the UI.

The durable Result row remains authoritative.

---
