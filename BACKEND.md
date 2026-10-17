# Headbutt backend

The app uses PostgreSQL-compatible storage. Neon is the recommended durable provider for this project because it works directly with Vercel and the existing `pg` server code. No Supabase service key is needed.

Set one of these environment variables in Vercel and locally:

- `NEON_DATABASE_URL` (recommended; use Neon’s pooled connection string)
- `NEON_DATABASE_URL_UNPOOLED` (optional direct connection fallback)
- `SUPABASE_DB_URL` or `SUPABASE_DATABASE_URL` (legacy compatibility only)
- `POSTGRES_URL_NON_POOLING`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL`, `STORAGE_URL`, or `DATABASE_URL`

The database tables are created lazily by the server. Check `/api/health` after deployment to see whether the app is using the database or its safe fallback.

## Moving existing data

Changing the connection string does not copy existing rows. To preserve the old Supabase data, temporarily make the old project available, export its PostgreSQL database, and import that export into Neon before removing the Supabase integration from Vercel. Do not delete the Supabase project until the Neon import has been checked.

After importing, set only `NEON_DATABASE_URL` in the Vercel Production environment and verify `/api/health` reports `backend: "database"`. The app checks Neon first, while the old Supabase variables remain supported only as a recovery path.

If the database is missing or temporarily unavailable, the public catalogue still works and account, order, and review writes fall back to the in-memory demo store instead of crashing the website. Fallback data is temporary and resets when a server instance restarts; configure Neon for persistent data.

- `POST /api/auth/demo` creates or returns a local demo user from an email address.
- `GET /api/products` returns the demo catalogue.
- `POST /api/orders` saves an order created from checkout.
- `GET /api/orders?email=...` lists demo orders for that email.

The demo store is intentionally retained as a resilience fallback. Checkout is still a demo flow and does not take payment; connect a payment provider such as Stripe or Shopify Payments before accepting live orders.
