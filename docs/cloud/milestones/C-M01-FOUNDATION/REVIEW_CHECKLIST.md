# C-M01-FOUNDATION — Review Checklist

Milestone: C-M01 — Cloud Foundation

## Review Gate

The milestone may be closed only when every item below is checked by the reviewer, the acceptance criteria in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) are all met, and the exit criteria in [MILESTONE.md](MILESTONE.md) are satisfied.

- [ ] All tasks in [TASKS.md](TASKS.md) are ACCEPTED (none open, none deferred without a change record).
- [ ] Every acceptance criterion has recorded evidence (test run, demo capture, or document).
- [ ] Architecture, protocol and database contracts referenced by this milestone were not changed without a change record.
- [ ] Security review items for this milestone are closed (source-code privacy, tenant isolation, secrets).
- [ ] Documentation affected by this milestone is updated and the tracking files are current.
- [ ] CHANGELOG.md is updated.
- [ ] The commit/tag step in [GIT_COMMIT_STEP.md](GIT_COMMIT_STEP.md) is prepared.

# 7 Test and Verification Plan

## 7.1 Verification Pyramid

    IaC Static Validation
            |
            v
    Security Validation
            |
            v
    Development Provisioning
            |
            v
    Integration Verification
            |
            v
    Staging Provisioning
            |
            v
    Failure Testing
            |
            v
    Production Readiness

## 7.2 IaC Tests

Validate:

- syntax;
- formatting;
- module references;
- dependency graph;
- policy validation;
- security rules;
- naming;
- required tags;
- environment isolation.

## 7.3 Network Tests

Test:

- public ingress;
- private database access;
- private storage access;
- queue access;
- administrative access;
- unauthorized inbound access;
- unauthorized outbound access;
- DNS resolution;
- TLS negotiation.

## 7.4 IAM Tests

Test:

    Developer
       |
       +--> Dev = ALLOW
       +--> Staging = LIMITED
       +--> Prod = DENY

    CI
       |
       +--> Dev = ALLOW
       +--> Staging = ALLOW
       +--> Prod = APPROVAL / CONTROLLED

    Runtime
       |
       +--> Database = REQUIRED
       +--> Secrets = REQUIRED
       +--> Admin = DENY

Expected permissions must be explicitly verified.

## 7.5 Secret Tests

Verify:

- secret retrieval;
- unauthorized retrieval denied;
- secret rotation;
- application restart after rotation;
- no plaintext logs;
- no secret in IaC state where avoidable;
- no secret in build artifact.

## 7.6 TLS Tests

Verify:

- valid certificate;
- certificate chain;
- hostname;
- expiration monitoring;
- invalid certificate rejection;
- HTTP policy;
- rotation.

## 7.7 Observability Tests

Generate:

- infrastructure failure;
- application health change;
- database connection failure;
- queue failure;
- certificate warning.

Verify:

- metric appears;
- log appears;
- alert triggers;
- operator can identify affected resource.

## 7.8 CI/CD Tests

Test:

    Pull Request
       |
       v
    Validation
       |
       v
    Plan
       |
       v
    Review
       |
       v
    Apply
       |
       v
    Verify

Negative test:

    Unauthorized Production Apply
                |
                v
             DENIED

## 7.9 Drift Test

Change a controlled resource outside IaC.

Expected:

- drift is detected;
- alert/report is generated;
- remediation is defined;
- IaC remains authoritative.

## 7.10 Failure Testing

Inject:

- API compute failure;
- worker compute failure;
- database connectivity failure;
- queue failure;
- storage failure;
- DNS failure in controlled environment;
- secret-provider failure;
- certificate issue;
- IAM denial.

Verify expected failure behavior.

## 7.11 Recovery Test

Destroy a disposable Development environment.

Recreate:

    IaC
      |
      v
    Network
      |
      v
    IAM
      |
      v
    Data Services
      |
      v
    Compute
      |
      v
    Observability

Expected:

- deterministic recreation;
- no undocumented manual step;
- required configuration restored.

## 7.12 Security Verification

Perform:

- IAM policy review;
- network exposure scan;
- secret scan;
- IaC security scan;
- dependency scan;
- public bucket/storage scan;
- privileged-access review.

## 7.13 Cost Verification

Verify:

- resource tags;
- billing attribution;
- budget threshold;
- cost alert;
- environment breakdown.

## 7.14 Staging Verification

Staging must prove that:

- deployment identity works;
- network works;
- database works;
- object storage works;
- queue works;
- secrets work;
- observability works;
- CI/CD promotion works.

---

# 8 Demo Script

## 8.1 Demo Objective

Demonstrate that the cloud foundation can be provisioned, secured, observed
and promoted without relying on undocumented manual operations.

## 8.2 Step 1 — IaC Plan

Run the IaC validation/plan pipeline.

Expected:

- validation succeeds;
- plan is generated;
- changes are reviewable.

## 8.3 Step 2 — Development Provisioning

Apply Development infrastructure.

Expected:

- network created;
- IAM created;
- database created;
- storage created;
- queue created;
- observability configured.

## 8.4 Step 3 — Verify Network

Show:

- public endpoint;
- private database;
- private storage;
- restricted queue.

Attempt unauthorized access.

Expected:

    DENIED

## 8.5 Step 4 — Verify IAM

Demonstrate:

    Developer -> Development
    Developer -> Production = DENIED

    CI -> Development
    CI -> Staging
    CI -> Production = Controlled

## 8.6 Step 5 — Verify Secrets

Retrieve a test secret using workload identity.

Expected:

- application receives secret;
- secret is not printed;
- unauthorized identity is denied.

## 8.7 Step 6 — Verify Observability

Create a controlled infrastructure event.

Expected:

- metric changes;
- log appears;
- alert triggers;
- dashboard shows event.

## 8.8 Step 7 — Verify CI/CD

Merge a harmless infrastructure change.

Expected:

    Git
      |
      v
    CI
      |
      v
    Plan
      |
      v
    Review
      |
      v
    Apply
      |
      v
    Verify

## 8.9 Step 8 — Verify Staging

Promote the same infrastructure configuration to Staging.

Expected:

- environment isolation remains;
- credentials remain separate;
- data stores remain separate.

## 8.10 Step 9 — Verify Drift

Modify a disposable Development resource manually.

Expected:

- drift is detected;
- remediation is visible.

## 8.11 Step 10 — Verify Recovery

Destroy disposable Development infrastructure.

Recreate from IaC.

Expected:

- environment restored;
- no undocumented manual dependency;
- observability restored.

## 8.12 Demo Success Criteria

The demonstration passes when:

- infrastructure is reproducible;
- network is private-by-default;
- IAM is least privilege;
- secrets are protected;
- CI/CD works;
- observability works;
- drift is detectable;
- recovery is repeatable.

---
