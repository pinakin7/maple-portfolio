# Maple Portfolio — Implementation Plan

## Mission and boundaries
Free, open-source, read-only ChatGPT app for Canadian investors importing Wealthsimple CSV exports. Independent of Wealthsimple; not endorsed by Wealthsimple or OpenAI. Do not collect brokerage credentials, scrape undocumented APIs, execute trades, or provide personalized investment advice.

## Proposed stack
- `apps/mcp-server/`: TypeScript remote MCP gateway, typed schemas, validated tool inputs, auth/session enforcement and embedded UI resource registration.
- `apps/dashboard/`: React/TypeScript interactive ChatGPT UI including CSV upload, validation, preview and portfolio charts.
- `services/analytics/`: Python FastAPI, Pydantic and Decimal arithmetic; normalized models, versioned CSV adapters and financial analytics.
- `packages/shared-schemas/`: versioned, generated contracts.
- `tests/`: synthetic fixtures and unit/integration/security/e2e suites.
- `infra/`: local development, container deployment, budgets and observability.

Keep the Python analytics engine model-independent. Start with a single deployment where practical. Confirm current OpenAI Apps SDK / plugin submission requirements from primary docs before writing integrations.

## Upload and privacy design
1. ChatGPT opens an app upload UI backed by a short-lived authenticated endpoint. Do not assume attached chat files automatically reach the MCP server.
2. Validate size, format, encoding, columns, currencies, numeric cells, formula injection, duplicate data and CSV ambiguities. Support only verified Wealthsimple export formats; report unsupported files clearly.
3. Parse server-side, normalize into typed records and display summary (account types, currency, report date, holdings count, errors) for user approval.
4. Create opaque, short-lived session-scoped identifiers. Enforce authorization at every tool and API endpoint; never trust a user-supplied portfolio ID alone.
5. Remove raw CSV after processing. Target <=24-hour TTL on normalized sessions, encrypt in transit/at rest, avoid sensitive logs and provide immediate deletion.
6. Pass only the minimum required aggregate/filtered data through MCP into ChatGPT. Explain model processing and retention boundaries in privacy disclosure.
7. No account passwords, SIN, full account numbers or live brokerage access.

## Financial correctness requirements
- Use decimal arithmetic; preserve original currencies, valuation dates, FX sources/date, missing data and categorization coverage.
- Differentiate recurring **purchases** from cash **contributions**; investing existing TFSA cash does not create a new contribution.
- Actual TFSA contribution room cannot be inferred from holdings, annual limit alone or contribution plans. Only reconcile with verified deposit/withdrawal records plus user-provided CRA room and correct year rules.
- Weekly/biweekly/monthly schedules, partial years and holiday skips must use actual scheduled payment dates; final payment adjustment optional.
- ETF overlap only when licensed, verifiable, dated constituents data is available. Never fabricate precision.
- Scenario projections are hypothetical and not personalized advice.

## Tool roadmap
`get_portfolio_summary`, `get_holdings`, `get_asset_allocation`, `analyze_concentration`, `analyze_etf_overlap`, `calculate_contributions`, `reconcile_contributions`, `project_portfolio`, `delete_portfolio`.

Expose only fully implemented, tested tools. Deletion is destructive; require explicit intent, and do not mislabel it read-only.

## Milestones
### M1 — Repository & SDK foundation
Reproducible monorepo, package management, TS strict mode, Python typing, formatting, Docker, CI, synthetic fixtures and working minimal MCP tool. **Accept:** checks pass and fresh checkout starts locally.
### M2 — CSV parser & analytics
Versioned Wealthsimple CSV adapters, secure parsing and normalization, deterministic allocation and contribution computations. **Accept:** tests for malformed input, account/currency ambiguities, schedules, financial precision.
### M3 — MCP tools & auth
Typed tool interfaces, privacy-minimizing outputs, identity-bound temporary sessions, authorization and errors. **Accept:** cross-session data exfiltration tests fail closed.
### M4 — ChatGPT embedded UI
Accessible upload, confirmation, portfolio charts, prompts and empty/error states. **Accept:** synthetic upload-to-analysis demo works in ChatGPT test environment.
### M5 — Security, privacy & regulatory review
Threat model, TTL/deletion, encryption, rate limiting, redacted observability, privacy/terms and Canadian regulatory positioning. **Accept:** automated security checks and documented independent review before public launch.
### M6 — Production & directory submission readiness
Stable HTTPS MCP service, budget limits, metadata, plugin/package according to current requirements, positive/negative evaluator scenarios, demo, submission checklist. **Accept:** review-ready package and explicit owner approval; do not submit automatically.

## Engineering workflow
One scoped branch/draft PR per milestone; CI checks, security notes, changelog and reproduction steps in PR. Codex must not merge, deploy, incur charges, change repo settings or submit the plugin without explicit approval.

## Open decisions
CSV report types/versions; OpenAI authentication and iframe upload support; cost cap and hosting region; optional market data and license; legal review of Canadian securities/privacy obligations. Use synthetic test data initially.
