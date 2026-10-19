# Maple Portfolio — Agent Guide

## Mission
Free, open-source, privacy-first, read-only Canadian portfolio analysis through a ChatGPT app, initially from Wealthsimple CSV exports. Not affiliated with Wealthsimple.

## Working protocol
- Before editing read `docs/IMPLEMENTATION_PLAN.md`, `CODEX_TASK.md` and the relevant GitHub issue.
- One branch and draft PR per milestone. No merging, deployment, repo settings changes or public submission without owner's explicit approval.
- Use latest official OpenAI MCP, Apps SDK and plugin review documentation.
- Keep changes scoped, documented and tested; report security implications and unresolved decisions.
- Never collect passwords, SINs or unnecessary identifiers; never use private Wealthsimple endpoints or automate trades.
- Financial CSV data is untrusted. Use strict file validation and per-session authorization. Never log, commit or expose private investor information.
- Use synthetic tests only. Monetary calculations use decimal arithmetic, with explicit currency and source dates.
- Distinguish contributions from purchases and never estimate CRA contribution room from holdings.
- Do not offer personalized securities advice in MVP or assert unverified ETF constituent coverage.

## PR template
Summary; linked issue; tests run and results; manual verification; threat/privacy analysis; limitations and follow-up.
