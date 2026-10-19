# M1 SDK and transport decision

Checked 2026-10-19 against primary sources:

- [OpenAI MCP server guide](https://developers.openai.com/apps-sdk/build/mcp-server)
  (currently redirects into plugin documentation): tools may work without custom
  UI; use explicit schemas and accurate tool annotations; support Streamable HTTP.
- [Official TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk):
  its main branch identifies v2 as stable, with split server/client/node packages.
- [OpenAI submission guidelines](https://developers.openai.com/apps-sdk/app-submission-guidelines):
  explicit read-only/destructive/open-world annotations and privacy protections.
  This milestone does not submit an app or satisfy public launch requirements.

The OpenAI guide still names the v1 `@modelcontextprotocol/sdk` install. The
SDK's own current stable documentation and registry provide v2 packages. M1
therefore pins `@modelcontextprotocol/server` and `client` 2.3.1, and the official
Node HTTP adapter 2.1.1, rather than copying legacy transport imports. Zod v4
provides strict versioned input/output schemas in `packages/shared-schemas`.
Python Pydantic currently defines only its independent liveness response; no
cross-language financial contracts or generation are claimed in M1.

Each HTTP POST receives a new server/transport. Stateless mode avoids session
storage; JSON responses avoid an unnecessary long-lived SSE connection. Only
`get_service_status` is registered, with readOnly=true, destructive=false,
openWorld=false and idempotent=true. It has no authorization requirement because
its entire result is static public service metadata. The implementation does
not grant this exemption to future portfolio tools.

The dashboard is a standalone React/Vite scaffold. No embedded UI resource or
ChatGPT integration is advertised until M4. Authentication/session authorization
is M3; no investor data can be accepted by M1. Local hostname/origin restrictions
must be reconsidered alongside HTTPS and authentication before any deployment.
