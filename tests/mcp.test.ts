import { request } from "node:http";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { once } from "node:events";
import { test } from "node:test";
import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { createHttpServer } from "../apps/mcp-server/src/server.js";
import { statusSchema } from "@maple/shared-schemas";

async function start() {
  const server = createHttpServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert(address && typeof address !== "string");
  return {
    url: new URL(`http://127.0.0.1:${address.port}/mcp`),
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        server.closeAllConnections();
      }),
  };
}

test("real HTTP MCP initialization, discovery, tool call, and invalid inputs", async () => {
  const app = await start();
  const client = new Client({ name: "synthetic-test", version: "0.1.0" });
  try {
    await client.connect(new StreamableHTTPClientTransport(app.url));
    const { tools } = await client.listTools();
    assert.deepEqual(
      tools.map((tool) => tool.name),
      ["get_service_status"],
    );
    assert.equal(tools[0]?.annotations?.readOnlyHint, true);
    const result = await client.callTool({
      name: "get_service_status",
      arguments: {},
    });
    const fixture: unknown = JSON.parse(
      await readFile(
        new URL("./fixtures/synthetic-status.json", import.meta.url),
        "utf8",
      ),
    );
    assert.deepEqual(statusSchema.parse(result.structuredContent), fixture);
    assert.deepEqual(result.content, [
      { type: "text", text: JSON.stringify(fixture) },
    ]);
    const invalid = await client.callTool({
      name: "get_service_status",
      arguments: { portfolioId: "synthetic" },
    });
    assert.equal(invalid.isError, true);
    await assert.rejects(
      client.callTool({ name: "get_holdings", arguments: {} }),
      /not found/,
    );
  } finally {
    await client.close();
    await app.close();
  }
});

test("HTTP boundary rejects uploads, foreign origins/hosts, invalid JSON and oversized requests", async () => {
  const app = await start();
  try {
    const post = (body: string, headers: Record<string, string> = {}) =>
      fetch(app.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body,
      });
    assert.equal(
      (await post("{}", { Origin: "https://untrusted.example" })).status,
      403,
    );
    const foreignHostStatus = await new Promise<number | undefined>(
      (resolve, reject) => {
        const req = request(
          app.url,
          { method: "POST", headers: { Host: "untrusted.example" } },
          (response) => {
            response.resume();
            resolve(response.statusCode);
          },
        );
        req.on("error", reject);
        req.end("{}");
      },
    );
    assert.equal(foreignHostStatus, 403);
    assert.equal((await post("{")).status, 400);
    assert.equal((await post("x".repeat(17000))).status, 413);
    assert.equal(
      (await post("{}", { "Content-Type": "text/csv" })).status,
      415,
    );
    assert.equal((await fetch(app.url)).status, 405);
    assert.equal(
      (await fetch(new URL("/upload", app.url), { method: "POST" })).status,
      404,
    );
    const health = await fetch(new URL("/healthz", app.url));
    assert.equal(health.status, 200);
    assert.equal(health.headers.get("cache-control"), "no-store");
    statusSchema.parse(await health.json());
  } finally {
    await app.close();
  }
});
