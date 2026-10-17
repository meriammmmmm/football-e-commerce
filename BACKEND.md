# Headbutt backend

The app uses PostgreSQL-compatible storage. Supabase works through its PostgreSQL connection string; no Supabase service key is needed by the server routes.

Set one of these environment variables in Vercel and locally:

- `SUPABASE_DB_URL` or `SUPABASE_DATABASE_URL` (recommended for Supabase)
- `POSTGRES_URL_NON_POOLING`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL`, `STORAGE_URL`, or `DATABASE_URL`

The database tables are created lazily by the server. Check `/api/health` after deployment to see whether the app is using the database or its safe fallback.

If the database is missing or temporarily unavailable, the public catalogue still works and account, order, and review writes fall back to the in-memory demo store instead of crashing the website. Fallback data is temporary and resets when a server instance restarts; configure Supabase for persistent data.

- `POST /api/auth/demo` creates or returns a local demo user from an email address.
- `GET /api/products` returns the demo catalogue.
- `POST /api/orders` saves an order created from checkout.
- `GET /api/orders?email=...` lists demo orders for that email.

The demo store is intentionally retained as a resilience fallback. Checkout is still a demo flow and does not take payment; connect a payment provider such as Stripe or Shopify Payments before accepting live orders.
