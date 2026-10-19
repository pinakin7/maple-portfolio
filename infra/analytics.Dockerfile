# syntax=docker/dockerfile:1
FROM ghcr.io/astral-sh/uv:0.12.23 AS uv
FROM python:3.12.14-slim-bookworm
COPY --from=uv /uv /uvx /bin/
WORKDIR /app
COPY services/analytics/pyproject.toml services/analytics/uv.lock ./
RUN --mount=type=secret,id=proxy_ca \
    if [ -f /run/secrets/proxy_ca ]; then export SSL_CERT_FILE=/run/secrets/proxy_ca; fi; \
    uv sync --locked --no-dev --no-install-project
COPY services/analytics/analytics ./analytics
RUN useradd --uid 10001 --create-home maple && chmod -R a+rX /app
USER maple
EXPOSE 8000
CMD ["/app/.venv/bin/uvicorn", "analytics.main:app", "--host", "0.0.0.0", "--port", "8000", "--no-access-log"]
