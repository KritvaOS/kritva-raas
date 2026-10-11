# KR-BINC-001-003 — HTTP Framework

## Document Control

| Field | Value |
|---|---|
| Document | KR-BINC-001-003 HTTP Framework Decision Record |
| Path | `planning/backend/increments/B-INC-001-SECURE-FOUNDATION/decisions/KR-BINC-001-003-http-framework.md` |
| Status | Approved |
| Owner role | Backend Technical Lead |
| Related milestones | B-M01 CONTROL PLANE |

## Related documents

- [Runtime and language decision record](KR-BINC-001-001-runtime-language.md)
- [Package manager and lockfile decision record](KR-BINC-001-002-package-manager-lockfile.md)
- [Module boundaries decision record](KR-BE-1-002-module-boundaries.md)
- [Secret-handling and configuration boundary](KR-BINC-001-005-secret-handling-configuration.md)
- [Increment tasks](../TASKS.md)
- [Increment acceptance criteria](../ACCEPTANCE_CRITERIA.md)
- [Backend architecture, Sections 9, 49 to 58](../../../../../docs/architecture/BACKEND_ARCHITECTURE.md)

## 1. Task Record

| Field | Value |
|---|---|
| Task | KR-BINC-001-003 — Decide HTTP framework |
| Owner role | Backend Technical Lead |
| Required approvers | Backend Technical Lead |
| Depends on | `KR-BINC-001-001` (Approved), `KR-BE-1-002` (Approved) |
| Acceptance | B-INC-001-AC-03, B-INC-001-AC-06 |
| Tests | BTS-004, BTS-007, BTS-032 |
| Security gates | Not applicable |
| Decision status | Approved on 2026-10-11 by the Backend Technical Lead, within the scope in Section 8.1. The task stays In Review |

The task asks for options and trade-offs, an approved recommendation, and a representative route that can be implemented and tested without violating the architecture boundaries. This record holds the options, the evidence and the recommendation. The representative route was exercised in a throwaway sandbox project (Section 3). It is not task evidence for the pinned toolchain. The full transport and routing are `KR-BE-1-004` and `KR-BE-1-006`.

## 2. Context and Constraints

- Node.js 24.21.0, TypeScript 6.0.3 with the repository `tsconfig` (strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `skipLibCheck: false`) and npm with a committed lockfile and `--ignore-scripts` are approved (`KR-BINC-001-001`, `-002`).
- The backend is a modular monolith with tiered modules and contract-only dependencies (`KR-BE-1-002`). The HTTP framework is the API layer. Domain and application code must not import it.
- The architecture requires a common request envelope, a response model with a stable error shape and HTTP status mappings (`BACKEND_ARCHITECTURE.md` Sections 52 to 57), and the first test for the API is invalid input receiving the documented error shape (`BTS-007`).
- Candidate frameworks named in the plan are Fastify, NestJS and Express. The owner's preferred candidate is Fastify (direction of 2026-10-11, recorded in `KR-BINC-001-001` Section 5.2; not a decision).
- Secrets and logging follow `KR-BINC-001-005`. The logging library is decided separately (`KR-BE-1-041`).

## 3. Evidence (queried 2026-10-11)

### 3.1 Registry and dependency facts

| Item | Fastify | Express | NestJS |
|---|---|---|---|
| Registry `latest` | 5.12.5 (published 2026-09-16) | 5.3.0 | `@nestjs/core` 12.1.2 |
| Declared `engines.node` | None | `>= 18` | `>= 20` |
| Licence | MIT | MIT | MIT |
| Own TypeScript types | Yes (`fastify.d.ts`) | No. Community `@types/express` 5.0.6 | Yes |
| Built-in request schema validation | Yes (JSON Schema through Ajv, `@fastify/ajv-compiler`) | No. A separate library is needed | Through pipes and a validation library, which is separate |
| Built-in in-process request testing | Yes (`light-my-request`, `app.inject`) | No. A separate library is needed | Through its testing module |
| Disposable lockfile of the framework alone (`npm install --package-lock-only --ignore-scripts`) | 48 packages, no install scripts; MIT 41, BSD-3-Clause 4, ISC 3 | 65 packages, no install scripts; MIT 60, ISC 4, BSD-3-Clause 1 | 75 packages with `@nestjs/common`, `@nestjs/platform-fastify`, `rxjs` and `reflect-metadata`, no install scripts; MIT 63, BSD-3-Clause 5, ISC 4, Apache-2.0 2, 0BSD 1 |
| Notable requirements | Built-in `pino` logger dependency | Body parsing and routing come as packages | Decorators and decorator metadata; peer dependencies on `rxjs`, `reflect-metadata` and a platform adapter |

The lockfiles above were created in disposable directories in the sandbox only. Nothing was added to the repository.

### 3.2 Sandbox compilation and route check

Run on 2026-10-11 in a disposable project under Node.js 22.22.0 and npm 10.9.4 (not the pinned toolchain), with TypeScript 6.0.3, `@types/node` 24.19.2 and a copy of the repository `tsconfig.json` unchanged.

| Check | Result |
|---|---|
| Fastify 5.12.5: a `POST /api/v1/orders` route with a JSON Schema body, a service port as the only dependency of the route, a custom error handler mapping validation failure to a stable `INVALID_REQUEST` shape, a not-found handler, and tests with `app.inject` and `node:test` | Compiled with no error under the unchanged `tsconfig` (`skipLibCheck: false`). Four tests passed: valid request 201, invalid body 400 with the documented shape, unknown route 404 with the documented shape, and `ready` then `close` without listening |
| Express 5.3.0 with `@types/express` 5.0.6 and a comparable route | Type-checked with no error under the unchanged `tsconfig`. No validation or in-process test helper is included |
| NestJS 12.1.2 with a decorated controller | Failed under the unchanged `tsconfig` (decorator errors TS1241, TS1270, TS1206). It compiled when `experimentalDecorators` and `emitDecoratorMetadata` were added. A constructor parameter type imported from another file was not tested against `verbatimModuleSyntax` |

The route in the Fastify check imports only an interface for its service, which is the shape the module rules need (the API layer calls an application contract). This shows the boundary is expressible. It does not test the module rules in a real module.

## 4. Options Considered

| Criterion | Fastify | Express | NestJS |
|---|---|---|---|
| Typed handlers | Own types. The route generic types `request.body`, but that type is a cast and is not derived from the schema. A schema-derived type provider is a possible addition, not selected here | Community types. Same cast limit | Decorator-driven types, with the compile flags above |
| Schema validation | Built in, per route, failure carries a validation object that one error handler can map to the error contract | Needs a separate library and glue | Needs pipes and a library |
| Testability | `inject` without opening a port; `ready` and `close` give a testable lifecycle (`B-INC-001-AC-06`) | A separate library, or a listening port in tests | Testing module with a larger setup |
| Fit with the module boundaries | A plain function registers routes for a module and receives its contracts. No second module system | Same, with less structure | Brings its own module and dependency-injection system, which overlaps the tiered modules and contracts already approved and would need a second set of rules |
| Maintenance and supply chain | 48 packages in the disposable tree, no install scripts. Active release in the last month | 65 packages, no install scripts. Active | 75 packages, no install scripts. Active. The largest surface |
| Fit with approved toolchain | Compiles under the unchanged `tsconfig`. No `engines` declared, so Node 24.21.0 compatibility has to be shown by running it (Section 6) | Compiles. Declares `>= 18` | Needs `tsconfig` flags that the scaffold does not set |
| Cost of reversal | Routes sit in the API layer only, so a change touches the transport adapters and their tests | Same | Higher, because decorators and its injection spread into application code |

Other frameworks were not evaluated. The decision is limited to the three named in the plan.

## 5. Recommendation (not a decision until approved)

Fastify, exact version 5.12.5, as the HTTP framework of the backend API layer, with these seven constraints:

1. **Boundary:** Fastify types and objects appear only in the API layer of a module and in the composition root. Domain, application and port code never import Fastify. A route receives application contracts, never repositories or other modules' implementations (`KR-BE-1-002` Sections 5 and 6).
2. **Plugins:** Fastify's encapsulation is used as the transport boundary. Each additional `@fastify/*` or third-party plugin is a new dependency that needs its own review and an exact pin. `@fastify/cors` and the like are not approved by this record.
3. **Validation and error contract:** each route declares a schema for body, parameters and headers where applicable. One error handler maps validation failures, not-found, method errors and unhandled errors to the documented error shape and status mapping (architecture Sections 54 to 57). A route never returns a stack trace or a secret (`KR-BINC-001-005`). The exact envelope is defined in `KR-BE-1-006` and `KR-BE-1-007`.
4. **Typed bodies:** the route generic is a cast. A schema-derived type provider is decided in `KR-BE-1-007` if the cast proves to be a risk. This record does not select one.
5. **Logging:** Fastify's built-in logger is not the logging decision. The logger option is set only by `KR-BE-1-041`, with the central redaction rules of `KR-BINC-001-005`. Request and header logging stays off until that task.
6. **Lifecycle and tests:** the app is built by a function that takes its contracts, so tests use `inject`, `ready` and `close` without opening a port. A listening server is created only in the composition root.
7. **Pin:** Fastify is added to `apps/backend` by `KR-BE-1-004` with an exact version and the committed lockfile, under the approved package policy. This record changes no file in `apps/backend`.

NestJS is not recommended: it adds a second module and injection system next to the approved module rules, needs decorator compile flags the scaffold does not set, and has the largest dependency surface. Express is not recommended: it adds no validation or test helper, so several extra libraries would each need their own decision, and its types come from a separate community package.

## 6. Verification Required Before This Is Treated as Settled

| Item | When |
|---|---|
| Fastify 5.12.5 installs from the lockfile with `npm ci --ignore-scripts` and runs the representative route test on Node.js 24.21.0 with npm 11.19.0 (the sandbox used Node.js 22.22.0) | `KR-BE-1-004`, with the clean-checkout evidence |
| The route and its test respect the module rules in a real module (a route that imports no repository or other module's implementation) | `KR-BE-1-004` and `KR-BE-1-006`, reviewed under BTS-004 |
| The error contract tests for BTS-007 | `KR-BE-1-007` |
| Fastify's dependency tree in the real lockfile has no install script and the licences are acceptable | `KR-BE-1-004`, lockfile review |

Until then, the sandbox run in Section 3.2 is a feasibility check and not task evidence.

## 7. Consequences and Dependencies

- `KR-BE-1-004` (HTTP transport), `KR-BE-1-006` (API v1 routing) and `KR-BE-1-007` (validation and error contract) build on this decision. They stay blocked until it is approved.
- `KR-BE-1-041` (logging) and the configuration framework (`KR-BE-1-003`) stay independent decisions.
- A change of framework later is a new decision record.

## 8. Approval Record

| Approver role | Decision | Date | Evidence |
|---|---|---|---|
| Backend Technical Lead | Approved | 2026-10-11 | Dinesh Annayya, acting as Backend Technical Lead, approved Fastify in session on 2026-10-11 ("approve Fastify") after the recommendation of Section 5 and the evidence of Section 3 were put to him |

### 8.1 Approved scope and what is not approved

Approved: Fastify, exact version 5.12.5, as the HTTP framework of the backend API layer, with the seven constraints of Section 5 (API layer only, reviewed plugins, one error-contract handler, typed-body note, logging left to `KR-BE-1-041`, a testable lifecycle, and the pin by `KR-BE-1-004`). NestJS and Express are not selected.

Evidence accepted: the registry and disposable-lockfile facts of Section 3.1 and the sandbox compile-and-route check of Section 3.2, which is feasibility evidence under Node.js 22.22.0 and not evidence on the pinned toolchain.

Not approved by this record:

- Any dependency, lockfile change, route or server code in `apps/backend`.
- Any Fastify plugin, type provider or logger.
- The final request and response envelope and error codes (`KR-BE-1-006`, `KR-BE-1-007`).
- Compatibility of Fastify 5.12.5 with the pinned runtime, which is shown in `KR-BE-1-004`.

### 8.2 Independence

The recommendation matches the owner's stated preference, and the approver is the same person. No independent reviewer has taken part. The evidence of Section 3 is reproducible from the registry and a disposable project. An Approved decision does not make `KR-BINC-001-003` Accepted, and the representative route on the pinned runtime is still to be shown in `KR-BE-1-004` (Section 6).
