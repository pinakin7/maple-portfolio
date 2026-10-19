# syntax=docker/dockerfile:1
FROM node:24.19.0-bookworm-slim AS base
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
COPY apps/mcp-server/package.json apps/mcp-server/package.json
COPY apps/dashboard/package.json apps/dashboard/package.json
COPY packages/shared-schemas/package.json packages/shared-schemas/package.json
RUN --mount=type=secret,id=proxy_ca \
    if [ -f /run/secrets/proxy_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca; fi; \
    npm ci --strict-ssl=true
COPY apps ./apps
COPY packages ./packages
COPY tsconfig.json ./
RUN chmod -R a+rX /app && chown -R node:node /app
USER node

FROM base AS mcp
ENV HOST=0.0.0.0 PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start:mcp"]

FROM base AS dashboard
EXPOSE 5173
CMD ["npm", "run", "dev", "-w", "@maple/dashboard", "--", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]
