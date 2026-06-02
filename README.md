# mcp-stripe_connect

Stripe MCP Pack — read-only access to Stripe data via API key.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `stripe_list_customers` | List Stripe customers. Supports pagination. |
| `stripe_get_customer` | Get a Stripe customer by ID. |
| `stripe_list_charges` | List recent charges. |
| `stripe_list_subscriptions` | List active subscriptions. |
| `stripe_get_balance` | Get the current Stripe account balance. |
| `stripe_list_invoices` | List invoices. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "stripe_connect": {
      "url": "https://gateway.pipeworx.io/stripe_connect/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Stripe_connect data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
