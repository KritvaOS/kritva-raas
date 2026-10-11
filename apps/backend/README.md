# Control Plane backend

This package is the structure created by `KR-BE-1-001` plus the HTTP transport of `KR-BE-1-004`. It is **not a running service yet**: `src/main.ts` is an inert entry point that composes nothing, opens no port and reads no configuration, because host and port need the configuration framework (`KR-BE-1-003`). There is no database access, logging library, configuration module or secrets handling yet. Those belong to later tasks.

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
| `http-server.ts` | `buildHttpServer({ routes })` builds the app. Routes passed in are mounted under `/api/v1`. Unknown paths return 404 and a known path with another method returns 405 with `Allow`. Validation is strict: no type coercion and no removal of unknown properties |
| `error-contract.ts` | The one place that turns a failure into an error body (`API_CONTRACT.md` Section 18, provisional until `KR-BE-1-007`). Bodies carry no internal message, stack or submitted value. `request_id` and `correlation_id` are null until `KR-BE-1-005` |
| `lifecycle.ts` | `startHttpServer(app, { host, port })` and `stop()`; `installShutdownHandlers(server, process, onStopped)` |

Startup: `startHttpServer` listens and returns the bound address. If listening fails it throws `HttpStartupError` carrying only the error code (for example `EADDRINUSE`).

Shutdown: `stop()` is idempotent. It stops accepting connections, lets in-flight requests finish, and after `shutdownGraceMs` (default 10 000) closes connections that are still open. `installShutdownHandlers` calls `stop()` on the first `SIGINT` or `SIGTERM`; a second signal is ignored while stopping.

Tests: `tests/transport/http-server.test.ts` uses `app.inject` and opens no port. `tests/transport/lifecycle.test.ts` listens on `127.0.0.1` with an operating-system-assigned port.
