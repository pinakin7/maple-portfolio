import { createServer } from "node:http";
import { McpServer } from "@modelcontextprotocol/server";
import { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node";
import {
  getStatus,
  statusInputSchema,
  statusSchema,
} from "@maple/shared-schemas";

export function createMcpServer(): McpServer {
  const server = new McpServer({ name: "maple-portfolio", version: "0.1.0" });
  server.registerTool(
    "get_service_status",
    {
      title: "Get Maple Portfolio service status",
      description:
        "Check whether the Maple Portfolio foundation is running. Returns only static service capabilities; no investor data or analytics.",
      inputSchema: statusInputSchema,
      outputSchema: statusSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
        idempotentHint: true,
      },
      _meta: { securitySchemes: [{ type: "noauth" }] },
    },
    async () => {
      const status = getStatus();
      return {
        content: [{ type: "text", text: JSON.stringify(status) }],
        structuredContent: status,
      };
    },
  );
  return server;
}

// Local development only: no credentials, user state, or uploads.
export function createHttpServer() {
  return createServer(async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    const reject = (code: number, message: string) => {
      res.writeHead(code, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: message }));
    };
    try {
      const host = new URL(`http://${req.headers.host ?? ""}`);
      if (!["localhost", "127.0.0.1", "[::1]"].includes(host.hostname))
        return reject(403, "Host not allowed");
      if (req.headers.origin) {
        const origin = new URL(req.headers.origin);
        if (origin.origin !== host.origin)
          return reject(403, "Origin not allowed");
      }
      if (req.url === "/healthz" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(getStatus()));
        return;
      }
      if (req.url !== "/mcp") return reject(404, "Not found");
      if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return reject(405, "Only POST is supported by this stateless endpoint");
      }
      if (
        req.headers["content-type"]?.split(";")[0]?.trim() !==
        "application/json"
      )
        return reject(415, "Expected application/json");
      let size = 0;
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        const buffer = Buffer.from(chunk as Uint8Array);
        size += buffer.length;
        if (size > 16 * 1024) return reject(413, "Request too large");
        chunks.push(buffer);
      }
      let body: unknown;
      try {
        body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      } catch {
        return reject(400, "Invalid JSON");
      }
      const server = createMcpServer();
      const transport = new NodeStreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });
      res.once("close", () => {
        void server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, body);
    } catch {
      // Never log bodies, headers, or investor-supplied values.
      if (!res.headersSent) reject(400, "Invalid request");
      else res.end();
    }
  });
}
