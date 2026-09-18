# mcp-stripe_connect

Stripe MCP Pack — read-only access to Stripe data via API key.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `stripe_list_customers` | List Stripe customers. Supports pagination. |
| `stripe_get_customer` | Get a Stripe customer by ID. |
| `stripe_list_charges` | List Stripe payment charges for your account, optionally filtered by customer ID. Returns charge ID, amount, currency, status, and timestamp. Supports limit (1-100) pagination. |
| `stripe_list_subscriptions` | List subscriptions on a Stripe account via the Stripe API (api.stripe.com/v1/subscriptions), authenticated with a Stripe secret or restricted key passed as _apiKey, with optional customer id and status filters (active, canceled, past_due, trialing, unpaid) and a limit of 1-100. Returns each subscription id, customer, price and plan items, status, and current period start and end. Answers who is subscribed to a Stripe billing plan and on what terms. |
| `stripe_get_balance` | Get the current Stripe account balance. |
| `stripe_list_invoices` | List Stripe invoices, optionally filtered by customer ID and/or status (draft, open, paid, void, uncollectible). Returns invoice ID, amount due, due date, and payment status. |

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/stripe_connect/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Stripe_connect data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

## No MCP client? Call it over HTTP

This pack takes your own API key (`_apiKey`) — we don't front one for it, so there's no curl here that would run without it. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/stripe_list_customers`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.
