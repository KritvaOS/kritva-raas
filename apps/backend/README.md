# Control Plane backend (application structure baseline)

This package is the minimal structure created by `KR-BE-1-001`. It is **not a running service**: `src/main.ts` is an inert entry point that composes nothing, opens no port and reads no configuration. There is no HTTP framework, database access, logging library, configuration module or secrets handling yet. Those belong to later tasks.

## Pinned versions

| Item | Version | Source of the decision |
|---|---|---|
| Node.js | 24.21.0 (`.node-version`, `engines.node`) | `KR-BINC-001-001` |
| npm | 11.19.0, the version bundled with Node.js 24.21.0 | `KR-BINC-001-002` |
| TypeScript | 6.0.3, exact | `KR-BINC-001-001` |
| `@types/node` | 24.19.2, exact | `KR-BE-1-001` plan |

`.npmrc` sets `save-exact=true` and `engine-strict=true`, so an install under a different Node.js version fails. Use the official Node.js 24.21.0 distribution from `nodejs.org` and check its SHA-256 against `SHASUMS256.txt`. Putting the pin in place for local setup and CI is the work of `KR-BINC-001-016` and `KR-BINC-001-017`.

## Commands

Run these from this directory with the pinned Node.js on `PATH`.

```
npm ci --ignore-scripts   # install from package-lock.json; install scripts disabled
npm run typecheck         # tsc --noEmit
npm run build             # tsc, output in dist/
npm test                  # build, then node --test on dist/tests/runtime-info.test.js
```

The test command names the compiled test file explicitly. Passing a directory to `node --test` was tried and failed.

## Rules for this directory

- `package-lock.json` is committed and is the single source of resolved versions. Install with `npm ci`, never `npm install`, except when a reviewed change updates the lockfile.
- No registry token, credential or example value belongs in this directory.
- `.gitignore` here is a narrow rule for `node_modules`, `dist` and `coverage`. It does not complete `KR-BINC-001-006`.
