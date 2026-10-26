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

## Google reviews (avatars and photos)

The review cards on the homepage show each reviewer's Google profile picture and
the photos attached to their review. Only the **Google Business Profile API**
returns both, so it is the source the site uses.

Set these in `.env.local` and in the Vercel project environment:

- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — the OAuth client
- `GOOGLE_REFRESH_TOKEN` — the long-lived token used by the server
- `GOOGLE_BUSINESS_ACCOUNT_ID` — the Google account id that owns the listing
- `GOOGLE_BUSINESS_LOCATION_ID` — optional; the server discovers it if unset

Refresh the credentials whenever the token is revoked or expires:

```bash
npm run auth:google-business
```

The script opens Google's consent screen (sign in with the account that owns
the Headbutt listing), then rewrites `GOOGLE_REFRESH_TOKEN` and
`GOOGLE_BUSINESS_LOCATION_ID` in `.env.local`. The redirect URI it uses is
`http://localhost:8080`; pass `--port` if a different one is registered on the
OAuth client. Restart the dev server afterwards.

The Google Cloud project must have the My Business API enabled and Business
Profile API access approved. `GET /api/google-reviews` reports the exact
failure (`invalid_grant`, missing approval, unknown location) when it cannot
load live reviews; the page then falls back to the built-in review list.

The Places API (New) is a secondary source: it can supply the rating and
review count, but Google returns no review objects for this place, so it
cannot provide avatars or photos.

