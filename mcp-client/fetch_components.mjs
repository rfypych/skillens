import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import fs from "fs";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";


async function run() {
  const transport = new SSEClientTransport(new URL("https://21st.dev/api/mcp"), {
      eventSourceInit: {
          headers: {
              "x-api-key": "21st_sk_802355ade6e929d62c1a30dfba29d22ab1ff37ab72168d9b39e4f23a3fdbae04"
          }
      },
      requestInit: {
          headers: {
              "x-api-key": "21st_sk_802355ade6e929d62c1a30dfba29d22ab1ff37ab72168d9b39e4f23a3fdbae04"
          }
      }
  });

  const client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
  await client.connect(transport);
  
  const tools = await client.listTools();
  console.log("Tools available:", JSON.stringify(tools, null, 2));

  // Search for Bento Grid
  const result = await client.callTool({
      name: "search",
      arguments: { query: "bento grid" }
  });
  
  fs.writeFileSync("bento_search.json", JSON.stringify(result, null, 2));
  console.log("Saved bento_search.json");
  
  // Search for Stats Card
  const result2 = await client.callTool({
      name: "search",
      arguments: { query: "stats dashboard card" }
  });
  fs.writeFileSync("stats_search.json", JSON.stringify(result2, null, 2));
  console.log("Saved stats_search.json");
  
  // Search for Hero
  const result3 = await client.callTool({
      name: "search",
      arguments: { query: "hero welcome animated" }
  });
  fs.writeFileSync("hero_search.json", JSON.stringify(result3, null, 2));
  console.log("Saved hero_search.json");

  process.exit(0);
}
run().catch(console.error);
