# Codex — Maple Portfolio Implementation

Repository: `pinakin7/maple-portfolio`

Read `AGENTS.md` and `docs/IMPLEMENTATION_PLAN.md` before edits. Implement one milestone per draft PR. Follow current official OpenAI Apps SDK / MCP documentation, checking API changes rather than copying obsolete examples.

## First assignment: M1 foundation
1. Inspect repository, existing issues and project plan.
2. Scaffold `apps/mcp-server` (TypeScript, official current MCP SDK), `apps/dashboard` (React/TypeScript), `packages/shared-schemas`, and `services/analytics` (Python/FastAPI).
3. Implement a runnable minimal MCP server, with a non-sensitive health/status tool, using a supported HTTP transport for remote MCP.
4. Provide reproducible dependency locks, local run scripts, `.gitignore` protections, lint/format/typecheck/test configurations, Docker-based local developer setup and GitHub Actions CI.
5. Add a synthetic fixture (no real investor data) and working automated test of the MCP tool.
6. Update README with exact install/run/test steps and limitations.
7. Open a **draft PR** targeting main; link the M1 issue. Provide CI results, setup instructions and any SDK decisions.

### Non-negotiable constraints
- Do not request brokerage passwords or use undocumented Wealthsimple APIs, reverse engineering, or scraping.
- Never trade; read-only analytics except explicit deletion in later milestone.
- Do not persist sensitive financial data or create public upload endpoints in M1.
- Use Decimal-based money math when it arrives; validate all inputs at service boundaries.
- Do not fabricate support for unimplemented tools, tax limits or data-provider coverage.
- No deployment, GitHub merges, repository settings changes, paid services, production API keys or public directory submission without explicit approval.

### Definition of done
Local bootstrap, tests, lint and type checks succeed; MCP server actually responds; CI green; concise developer docs; draft PR open and unmerged.

Next milestones: refer to `docs/IMPLEMENTATION_PLAN.md` and linked GitHub issues.
