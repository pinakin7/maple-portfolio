import { createHttpServer } from "./server.js";

const port = Number(process.env.PORT ?? "3000");
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("Invalid PORT");
const host = process.env.HOST ?? "127.0.0.1";
const server = createHttpServer();
server.requestTimeout = 10_000;
server.headersTimeout = 10_000;
server.listen(port, host, () =>
  console.log(`Maple Portfolio MCP listening on ${host}:${port}/mcp`),
);
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    server.close();
    server.closeAllConnections();
  });
}
