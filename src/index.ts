interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Stripe MCP Pack — read-only access to Stripe data via API key.
 *
 * BYO key: pass your Stripe secret key (sk_...) or restricted key as _apiKey.
 * No OAuth required.
 */


const API = 'https://api.stripe.com/v1';

async function strFetch(apiKey: string, path: string) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Stripe API error (${res.status}): ${text}`);
  }
  return res.json();
}

const tools: McpToolExport['tools'] = [
  {
    name: 'stripe_list_customers',
    description: 'List Stripe customers. Supports pagination.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Stripe secret or restricted API key (sk_...)' },
        limit: { type: 'number', description: 'Max results (1-100, default 10)' },
        starting_after: { type: 'string', description: 'Cursor for pagination (customer ID)' },
      },
      required: ['_apiKey'],
    },
  },
  {
    name: 'stripe_get_customer',
    description: 'Get a Stripe customer by ID.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Stripe secret or restricted API key (sk_...)' },
        id: { type: 'string', description: 'Customer ID (cus_...)' },
      },
      required: ['_apiKey', 'id'],
    },
  },
  {
    name: 'stripe_list_charges',
    description: 'List recent charges.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Stripe secret or restricted API key (sk_...)' },
        limit: { type: 'number', description: 'Max results (1-100, default 10)' },
        customer: { type: 'string', description: 'Filter by customer ID' },
      },
      required: ['_apiKey'],
    },
  },
  {
    name: 'stripe_list_subscriptions',
    description: 'List active subscriptions.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Stripe secret or restricted API key (sk_...)' },
        limit: { type: 'number', description: 'Max results (1-100, default 10)' },
        customer: { type: 'string', description: 'Filter by customer ID' },
        status: { type: 'string', description: 'Filter by status (active, canceled, past_due, etc.)' },
      },
      required: ['_apiKey'],
    },
  },
  {
    name: 'stripe_get_balance',
    description: 'Get the current Stripe account balance.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Stripe secret or restricted API key (sk_...)' },
      },
      required: ['_apiKey'],
    },
  },
  {
    name: 'stripe_list_invoices',
    description: 'List invoices.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Stripe secret or restricted API key (sk_...)' },
        limit: { type: 'number', description: 'Max results (1-100, default 10)' },
        customer: { type: 'string', description: 'Filter by customer ID' },
        status: { type: 'string', description: 'Filter by status (draft, open, paid, void, uncollectible)' },
      },
      required: ['_apiKey'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = args._apiKey as string | undefined;
  delete args._context;
  delete args._apiKey;

  if (!apiKey) {
    return { error: 'api_key_required', message: 'Pass your Stripe API key as _apiKey (sk_... or rk_...)' };
  }

  switch (name) {
    case 'stripe_list_customers': {
      const params = new URLSearchParams();
      if (args.limit) params.set('limit', String(args.limit));
      if (args.starting_after) params.set('starting_after', args.starting_after as string);
      return strFetch(apiKey, `/customers?${params}`);
    }
    case 'stripe_get_customer':
      return strFetch(apiKey, `/customers/${args.id}`);
    case 'stripe_list_charges': {
      const params = new URLSearchParams();
      if (args.limit) params.set('limit', String(args.limit));
      if (args.customer) params.set('customer', args.customer as string);
      return strFetch(apiKey, `/charges?${params}`);
    }
    case 'stripe_list_subscriptions': {
      const params = new URLSearchParams();
      if (args.limit) params.set('limit', String(args.limit));
      if (args.customer) params.set('customer', args.customer as string);
      if (args.status) params.set('status', args.status as string);
      return strFetch(apiKey, `/subscriptions?${params}`);
    }
    case 'stripe_get_balance':
      return strFetch(apiKey, '/balance');
    case 'stripe_list_invoices': {
      const params = new URLSearchParams();
      if (args.limit) params.set('limit', String(args.limit));
      if (args.customer) params.set('customer', args.customer as string);
      if (args.status) params.set('status', args.status as string);
      return strFetch(apiKey, `/invoices?${params}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 10 } } satisfies McpToolExport;
