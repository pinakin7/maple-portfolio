# Maple Portfolio

Free, open-source, privacy-first, read-only Canadian portfolio analysis project.
Independent of Wealthsimple and OpenAI; not affiliated with or endorsed by either.

**M1 development foundation only.** The only MCP tool is `get_service_status`.
It returns static service capabilities and does not inspect investor data. CSV
import, portfolio analysis, authentication, temporary sessions, embedded ChatGPT
UI, financial calculations and directory submission are future milestones.
Never enter brokerage credentials or real financial data in this scaffold.

## Prerequisites and clean installation

Use Node **24.19.0**, npm **11.9.0**, Python **3.12.14**, and
[uv](https://docs.astral.sh/uv/getting-started/installation/) **0.12.23**.
Run from the repository root:

```sh
npm ci
uv sync --locked --project services/analytics
```

`package-lock.json` and `services/analytics/uv.lock` lock all resolved
transitive dependencies. Use `npm ci` / `uv sync --locked`, not an unlocked
upgrade, to reproduce this foundation.

## Run locally

In separate terminals at the repository root:

```sh
npm run dev:mcp
npm run dev:dashboard
uv run --locked --project services/analytics uvicorn analytics.main:app --app-dir services/analytics --host 127.0.0.1 --port 8000 --no-access-log
```

- MCP Streamable HTTP: `http://127.0.0.1:3000/mcp` (POST).
- Service liveness: `http://127.0.0.1:3000/healthz` (GET).
- React development scaffold: `http://127.0.0.1:5173`.
- Analytics skeleton liveness: `http://127.0.0.1:8000/healthz`.

`npm run start:mcp` runs without watch mode. `PORT` selects an MCP port;
`HOST` defaults to loopback. The dashboard is deliberately informational: it
has no upload form, portfolio data, or connection to the analytics service.

Check liveness:

```sh
curl --fail http://127.0.0.1:3000/healthz
curl --fail http://127.0.0.1:8000/healthz
```

For a manual MCP call after starting the server:

```sh
curl --fail http://127.0.0.1:3000/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  --data '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_service_status","arguments":{}}}'
```

Use an MCP client to perform initialization and discovery. The automated HTTP
integration test demonstrates the complete initialization → list tools → call
flow using the official SDK client and a synthetic status fixture.

## Required checks

```sh
npm run check
uv run --locked --project services/analytics ruff check services/analytics
uv run --locked --project services/analytics ruff format --check services/analytics
uv run --locked --project services/analytics mypy services/analytics/analytics services/analytics/tests
uv run --locked --project services/analytics pytest services/analytics/tests
```

`npm run check` checks formatting, ESLint, strict TypeScript, real HTTP MCP
integration/security tests, and the dashboard production build. `npm run format`
formats JS/TS/docs; use `uv run --project services/analytics ruff format
services/analytics` for Python. CI repeats these checks and builds/smoke-tests
the local containers. It contains no deployment jobs.

## Docker local development

With Docker Engine and Compose v2:

```sh
docker compose config --quiet
docker compose up --build -d
curl --fail http://127.0.0.1:3000/healthz
curl --fail http://127.0.0.1:8000/healthz
curl --fail http://127.0.0.1:5173/
docker compose down
```

All published ports bind to host loopback. Containers run as non-root users;
there are no data volumes. Images include development tools and are intended
for local development only. In a corporate/proxied environment, provide its CA
bundle through the Docker BuildKit `proxy_ca` secret (both Dockerfiles support
it); keep TLS verification enabled. Do not bake credentials or CA files into
images.

## SDK decisions, privacy and limitations

See [the SDK decision](docs/SDK_DECISIONS.md) and
[the implementation plan](docs/IMPLEMENTATION_PLAN.md).

The MCP endpoint uses stateless Streamable HTTP with JSON responses. No session
IDs, database, uploads, cookies, secrets or financial data are needed by its
single `noauth` health tool. Requests have a 16 KiB body limit, strict tool input
validation, local Host/Origin checks and no body/header logging. Unsupported
routes/tools fail closed; GET/DELETE on `/mcp` return 405 because this scaffold
does not offer an SSE stream or stateful sessions.

This is not a publicly deployable portfolio service: before handling any
investor data, implement identity-bound authorization, secure CSV validation,
TTL/deletion, redacted observability, and the later security/privacy review.
There are no financial calculations, investment advice, brokerage connections
or claims about contribution room or ETF coverage. Only synthetic fixtures are
allowed in tests. Keep real CSVs, uploads, `.env` and private data out of Git.

Task documents were brought in unchanged from the existing
`docs/implementation-and-codex-plan` branch because `main` contained only the
original README. No planning branch was merged.
