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
| `error-contract.ts` | The one place that turns a failure into an error body (`API_CONTRACT.md` Section 18, provisional until `KR-BE-1-007`). Bodies carry no internal message, stack or submitted value. `request_id` and `correlation_id` are null until `KR-BE-1-005` |
| `lifecycle.ts` | `startHttpServer(app, { host, port })` and `stop()`; `installShutdownHandlers(server, process, onStopped)` |

Startup: `startHttpServer` listens and returns the bound address. If listening fails it throws `HttpStartupError` carrying only the error code (for example `EADDRINUSE`).

Shutdown: `stop()` is idempotent. It stops accepting connections, lets in-flight requests finish, and after `shutdownGraceMs` (default 10 000) closes connections that are still open. `installShutdownHandlers` calls `stop()` on the first `SIGINT` or `SIGTERM`; a second signal is ignored while stopping.

Tests: `tests/transport/http-server.test.ts` uses `app.inject` and opens no port. `tests/transport/lifecycle.test.ts` listens on `127.0.0.1` with an operating-system-assigned port. `tests/run.test.ts` also runs `main.js` as a child process.

## Configuration (`src/config`)

`loadConfig(env)` is the only place that reads settings; `run.ts` passes it the process environment. Validation happens before the server is built, so invalid configuration never listens. Failures name the setting and the reason, never the value, and all problems are reported together. A `KRITVA_` name that is not listed here is rejected, so a typo cannot silently fall back to a default. Values are not trimmed.

| Setting | Required | Default | Range |
|---|---|---|---|
| `KRITVA_HTTP_PORT` | Yes | none | 1 to 65535 |
| `KRITVA_HTTP_HOST` | No | `127.0.0.1` | IP address or hostname |
| `KRITVA_HTTP_SHUTDOWN_GRACE_MS` | No | `10000` | 0 to 300000 |
| `KRITVA_HTTP_BODY_LIMIT_BYTES` | No | `1048576` | 1 to 104857600 |

These are non-secret settings. Secret and credential settings are not implemented yet; they follow the approval of `KR-BINC-001-005`. `.env.example` lists the settings with placeholders; the application does not read it, so export the values in your shell or inject them from your runtime, and keep real local values outside tracked files.

Run: `KRITVA_HTTP_PORT=8080 node dist/src/main.js` after `npm run build`. The first signal (`SIGINT` or `SIGTERM`) stops the server and exits 0. Invalid configuration or a port that is in use exits 1.

## API v1 routing rules (`KR-BE-1-006`)

- The version is in the path: everything is under `/api/v1`. Any other prefix (`/api/v2`, `/api`, `/api/v1` itself) is 404.
- A module's API layer exposes one `RouteGroup` with one path root. Roots are lower-case segments joined by single hyphens; two groups may not share a root or nest one inside the other, so each path root has one owner. Invalid or overlapping groups throw `RouteRegistrationError` when the server is built.
- A route registered as `/` in a group is served at the bare root without a trailing slash.
- Matching is exact: no trailing slash, no doubled slash, no case folding. This also means an empty identifier never matches a path parameter.
- A known path with another method returns 405 with `Allow` (OPTIONS included, as no CORS is configured); an unknown path is 404 whatever the method. Both are JSON in the provisional error body.
- Each group is its own scope, so a hook added by one group does not run for another.
- No group exists yet, so the server serves no route. Domain APIs are added by their own tasks.

## Request context (`KR-BE-1-005`, request ID only)

- Every request gets a `RequestContext` before any other hook runs. It carries one field, `requestId`, generated by the server as `req-<uuid>`. A client `X-Request-ID` or `X-Correlation-ID` header is ignored and never echoed, so a caller cannot choose or forge the identifier.
- The ID is returned in the `X-Request-ID` response header on every response (success, 404, 405, validation and server errors) and appears as `request_id` in the error body.
- Handlers and services read the context with `currentRequestContext()` (or `requireRequestContext()`) from `src/shared/request-context.ts`. It uses `AsyncLocalStorage`, so the value follows awaits and timers of one request and cannot leak to another. Outside a request it is absent and `requireRequestContext()` throws `RequestContextMissingError`.
- The context type lives in the shared layer; only `src/transport/request-context.ts` knows Fastify.
- Not done here: correlation ID (`KR-BE-1-008`), principal and tenant (identity tasks), log fields (`KR-BE-1-041`).
