# mcp-stripe_connect

Stripe MCP Pack — read-only access to Stripe data via API key.

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

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

Add to your MCP client config:

```json
{
  "mcpServers": {
    "stripe_connect": {
      "url": "https://gateway.pipeworx.io/stripe_connect/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use stripe_connect
```

## License

MIT
