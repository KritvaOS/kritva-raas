# Control Plane backend

This package is the structure created by `KR-BE-1-001`, the HTTP transport of `KR-BE-1-004` and the non-secret configuration of `KR-BE-1-003`. It starts an HTTP server with no domain routes yet: `src/main.ts` reads the `KRITVA_*` settings below and listens. There is no database access, logging library or secrets handling yet. Those belong to later tasks.

## Pinned versions

| Item | Version | Source of the decision |
|---|---|---|
| Node.js | 24.21.0 (`.node-version` at the repository root, `engines.node` here) | `KR-BINC-001-001` |
| npm | 11.19.0, the version bundled with Node.js 24.21.0 | `KR-BINC-001-002` |
| TypeScript | 6.0.3, exact | `KR-BINC-001-001` |
| `@types/node` | 24.19.2, exact | `KR-BE-1-001` plan |
| Fastify | 5.12.5, exact (runtime dependency) | `KR-BINC-001-003` |

`.npmrc` sets `save-exact=true` and `engine-strict=true`, so an install under a different Node.js version fails. Use the official Node.js 24.21.0 distribution from `nodejs.org` and check its SHA-256 against `SHASUMS256.txt`. Putting the pin in place for local setup and CI is the work of `KR-BINC-001-016` and `KR-BINC-001-017`.

## Commands

Run these from this directory with the pinned Node.js on `PATH`.

```
npm ci --ignore-scripts   # install from package-lock.json; install scripts disabled
npm run typecheck         # tsc --noEmit
npm run build             # tsc, output in dist/
npm test                  # build, then node --test on every compiled test in dist/tests
```

The test command passes a quoted glob to `node --test`. Passing a bare directory was tried in `KR-BE-1-001` and failed.

## Rules for this directory

- `package-lock.json` is committed and is the single source of resolved versions. Install with `npm ci`, never `npm install`, except when a reviewed change updates the lockfile.
- No registry token, credential or example value belongs in this directory.
- `.gitignore` here is a narrow rule for `node_modules`, `dist` and `coverage`. It does not complete `KR-BINC-001-006`.

## HTTP transport (`src/transport`)

Only this directory imports Fastify (the "API layer only" constraint of `KR-BINC-001-003`).

| File | Purpose |
|---|---|
| `http-server.ts` | `buildHttpServer({ groups })` builds the app. Route groups passed in are mounted under `/api/v1` (see `api-v1.ts`). Unknown paths return 404 and a known path with another method returns 405 with `Allow`. Validation is strict: no type coercion and no removal of unknown properties |
| `api-v1.ts` | The route-registration pattern: a `RouteGroup` has a name, one path root (for example `/projects`) and a `register` function that adds routes relative to that root. `buildHttpServer({ groups })` checks the groups before any port opens and mounts each in its own scope at `/api/v1` plus its root |
| `response-contract.ts` | The response envelope (`RESPONSES.md` Section 7) and `successBody(spec, data, requestId)`. Every REST API v1 response with a body, success or error, has `protocol_version`, `request_id`, `timestamp`, `status`, `code`, `message`, `data` and `error`. A handler gets the ID from `requestIdOf(request)` and chooses the HTTP status (200, 201, 202); a `204` has no body |
| `error-contract.ts` | The one place that turns a failure into an error envelope with registry codes (`ERROR_CODES.md`): `INVALID_REQUEST` (400, with `MISSING_REQUIRED_FIELD` or `FIELD_INVALID` in `error.field_errors`), `UNSUPPORTED_CONTENT_TYPE` (415), `RESOURCE_NOT_FOUND` (404), `METHOD_NOT_ALLOWED` (405), `PAYLOAD_TOO_LARGE` (413), `SERVICE_UNAVAILABLE` (503, retryable; used by readiness, registry entry awaiting an owner decision), `INTERNAL_ERROR` (500, retryable). A status raised by the framework is kept only for 400, 401 (`AUTH_REQUIRED`), 403 (`AUTHZ_DENIED`), 404 and 429 (`RATE_LIMIT_EXCEEDED`); any other status is reported as `INTERNAL_ERROR`, not as bad input. A domain or application error (for example a 409, 412 or 422) must be mapped to its registry code by the module that owns it before it reaches this handler; otherwise it is reported as `INTERNAL_ERROR`. Add tests with the first such mapping. Router errors go through the same classification (`handleFrameworkError`): an invalid URL is `INVALID_REQUEST`, anything else unrecognized is `INTERNAL_ERROR`. Bodies carry no internal message, stack or submitted value |
| `health.ts` | `registerHealthRoutes(app, { checks, state, checkTimeoutMs, resultCacheMs, now })` registers the two health routes; `createReadinessState()` holds the draining flag (see Health and readiness below) |
| `lifecycle.ts` | `startHttpServer(app, { host, port, onStopping })` and `stop()`; `installShutdownHandlers(server, process, onStopped)` |

Startup: `startHttpServer` listens and returns the bound address. If listening fails it throws `HttpStartupError` carrying only the error code (for example `EADDRINUSE`).

Shutdown: `stop()` is idempotent. It stops accepting connections, lets in-flight requests finish, and after `shutdownGraceMs` (default 10 000) closes connections that are still open. `installShutdownHandlers` calls `stop()` on the first `SIGINT` or `SIGTERM`; a second signal is ignored while stopping.

Tests: `tests/transport/http-server.test.ts` uses `app.inject` and opens no port. `tests/transport/lifecycle.test.ts` listens on `127.0.0.1` with an operating-system-assigned port. `tests/run.test.ts` also runs `main.js` as a child process.

## Health and readiness (`src/transport/health.ts`)

| Endpoint | Question it answers | Responses |
|---|---|---|
| `GET /health/live` | Can the process answer? | 200, code `SERVICE_LIVE`. It does not depend on readiness, checks or shutdown |
| `GET /health/ready` | Should traffic be sent here? | 200, code `SERVICE_READY`, only when the service is not draining and every required check returns `true`. Otherwise 503 with the registry error `SERVICE_UNAVAILABLE` (`retryable: true`) |

Both are outside `/api/v1`, answer `GET` and `HEAD`, send `Cache-Control: no-store` and use the response envelope. `HEAD` is added by Fastify for every `GET` route and runs the same handler, so a `HEAD` request is a probe and runs the readiness checks; it returns the same status with no body. A 503 body names no check, reason, setting or error text.

Readiness checks are injected: `buildHttpServer({ readiness: { checks, state, checkTimeoutMs, resultCacheMs, now } })`. A `ReadinessCheck` is `(signal: AbortSignal) => boolean | Promise<boolean>` and counts as available only when it returns `true`; false, a thrown or rejected error, any other value, or no answer within the timeout (2000 ms, an owner decision; a constant with the `checkTimeoutMs` option, not an environment setting) is unavailable. A check that takes no argument is still valid. No check is registered yet because the backend has no database or other dependency. A later task that adds one registers its check here and adds a dependency-unavailable test. `checkTimeoutMs` must be a positive integer up to 2147483647, `resultCacheMs` an integer from 0 to 60000, `now` a function, and every check a function; otherwise `buildHttpServer` throws and the service does not start.

How a readiness request is answered (decision record `KR-BE-1-009-readiness-check-policy.md`, decisions 1 to 3):

1. If the service is draining the answer is 503 and no check runs.
2. Otherwise the outcome of the dependency checks is used: the outcomes of a run that finished less than 1000 ms ago (counted from the end of that run, on a monotonic clock, successes and failures alike), else the run already in flight (at most one per process, shared by every concurrent probe, `HEAD` included), else a new run. `resultCacheMs: 0` turns the reuse off. The clock `now` must be monotonic and return finite numbers; if it throws or returns anything else the reuse is skipped for that read or write and the checks run, so a clock failure never changes the answer. After a timed-out check settles, its reused failure still stands until its period ends, then the check is invoked again.
3. The draining state is read again before the answer is sent, so neither a long run nor reused outcomes can give a 200 after shutdown has begun. The reused value is the outcome of the dependency checks only, never "the service is ready".

Each check gets its own `AbortSignal`, aborted when its timeout fires and when shutdown begins. Aborting asks the operation to stop; it does not prove that it stopped. The request stops waiting at the abort whether or not the check honors it. A check that did not settle is remembered as unsettled: it is not invoked again until its operation settles, other checks still run, and a late answer never changes a result already given. A check that never settles therefore keeps readiness at 503 for the life of the process (fail closed; restart to recover).

Requirements on a real check, binding on the task that adds the first one: honor the signal; set the dependency client's own operation timeout shorter than the check timeout (for a database, a statement timeout) and a bounded connection-acquisition timeout; release what it holds (a connection) on success, error, timeout and cancellation; never run migrations; and be non-blocking, because a synchronous loop stops every timer and the request hangs. Whether the check is `SELECT 1`, a migration-state query or both, and whether it uses the main pool or a dedicated connection, is decided in the database task (decision record decisions 5 and 6).

Configuration is validated before the port opens (`run.ts`), so invalid configuration never listens and there is no "starting" or "failed" readiness state.

Shutdown: the first signal calls `startHttpServer`'s `onStopping` hook, which starts draining (active checks are aborted and readiness answers 503), then the listener stays open for `KRITVA_HTTP_SHUTDOWN_DRAIN_MS` (default 5000, 0 closes at once) so a load balancer can notice the 503. Application routes are still served during the drain. After the drain the shutdown grace period starts, then the server closes, so the longest shutdown is the drain plus the grace period (5 s + 10 s with the defaults). That total must fit inside the termination period of the deployment platform with a margin; the platform and its period are not known yet and no configuration is rejected on an assumed limit. A second signal during the drain is ignored, as before, and does not shorten it. `onStopping` runs inside `stop()`; if it throws, the server still stops and `stop()` then rejects with that error.

Probe guidance for a deployment: use `/health/live` for restart decisions and `/health/ready` for traffic decisions. Do not restart on a failed readiness check.

## Configuration (`src/config`)

`loadConfig(env)` is the only place that reads settings; `run.ts` passes it the process environment. Validation happens before the server is built, so invalid configuration never listens. Failures name the setting and the reason, never the value, and all problems are reported together. A `KRITVA_` name that is not listed here is rejected, so a typo cannot silently fall back to a default. Values are not trimmed.

| Setting | Required | Default | Range |
|---|---|---|---|
| `KRITVA_HTTP_PORT` | Yes | none | 1 to 65535 |
| `KRITVA_HTTP_HOST` | No | `127.0.0.1` | IP address or hostname |
| `KRITVA_HTTP_SHUTDOWN_DRAIN_MS` | No | `5000` | 0 to 300000 |
| `KRITVA_HTTP_SHUTDOWN_GRACE_MS` | No | `10000` | 0 to 300000 |
| `KRITVA_HTTP_BODY_LIMIT_BYTES` | No | `1048576` | 1 to 104857600 |

These are non-secret settings. Secret and credential settings are not implemented yet; they follow the approval of `KR-BINC-001-005`. `.env.example` lists the settings with placeholders; the application does not read it, so export the values in your shell or inject them from your runtime, and keep real local values outside tracked files.

Run: `KRITVA_HTTP_PORT=8080 node dist/src/main.js` after `npm run build`. The first signal (`SIGINT` or `SIGTERM`) starts the shutdown described above (drain, then grace) and exits 0. Invalid configuration or a port that is in use exits 1.

## API v1 routing rules (`KR-BE-1-006`)

- The version is in the path: everything is under `/api/v1`. Any other prefix (`/api/v2`, `/api`, `/api/v1` itself) is 404.
- A module's API layer exposes one `RouteGroup` with one path root. Roots are lower-case segments joined by single hyphens; two groups may not share a root or nest one inside the other, so each path root has one owner. Invalid or overlapping groups throw `RouteRegistrationError` when the server is built.
- A route registered as `/` in a group is served at the bare root without a trailing slash.
- Matching is exact: no trailing slash, no doubled slash, no case folding. This also means an empty identifier never matches a path parameter.
- A known path with another method returns 405 with `Allow` (OPTIONS included, as no CORS is configured); an unknown path is 404 whatever the method. Both are JSON in the error envelope.
- Each group is its own scope, so a hook added by one group does not run for another.
- No group exists yet, so the server serves no route. Domain APIs are added by their own tasks.

## Request context (`KR-BE-1-005` request ID, `KR-BE-1-008` correlation ID)

- Every request gets a `RequestContext` before any other hook runs. It carries `requestId`, generated by the server as `req-<uuid>`, and `correlationId`. A client `X-Request-ID` header is ignored and never echoed, so a caller cannot choose or forge the request ID.
- The ID is returned in the `X-Request-ID` response header on every response (success, 404, 405, validation and server errors) and appears as `request_id` in the error body.
- Handlers and services read the context with `currentRequestContext()` (or `requireRequestContext()`) from `src/shared/request-context.ts`. It uses `AsyncLocalStorage`, so the value follows awaits and timers of one request and cannot leak to another. Outside a request it is absent and `requireRequestContext()` throws `RequestContextMissingError`.
- `src/shared/request-context.ts` is shared infrastructure (`KR-BE-1-002` Section 5.5): it imports no module and no framework. Only `src/transport/request-context.ts` knows Fastify. `requestIdOf` throws without a context; `ensureRequestId` serves error paths that can run before the hook, and an invalid URL (a router error) also returns the envelope with `X-Request-ID`.
- Correlation ID (`KR-BE-1-008`): a client `X-Correlation-ID` of 8 to 64 characters from `A-Za-z0-9._-` is used exactly as sent. An absent, empty, malformed or repeated header is replaced by a generated `cor-<uuid>`; the request is never rejected because of it. The effective value is returned in the `X-Correlation-ID` header on every application-generated response (including 404, 405, 413, 500, router errors, health and `HEAD`) and is never put in a body or a URL. A request the HTTP parser rejects before the framework sees it cannot carry the header. `correlationIdOf(request)` returns the value for later logging. It is a diagnostic label only, never a credential, and it is not propagated to downstream calls yet.
- Not done here: principal and tenant (identity tasks), log fields (`KR-BE-1-041`), outbound propagation.
