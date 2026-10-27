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
- `GET /api/products` returns the catalogue (database first, bundled JSON as fallback).
- `POST /api/orders` saves an order created from checkout.
- `GET /api/orders?email=...` lists demo orders for that email.

The demo store is intentionally retained as a resilience fallback. Checkout is still a demo flow and does not take payment; connect a payment provider such as Stripe or Shopify Payments before accepting live orders.

## Catalogue and the admin mobile app

The catalogue lives in the `products` table and the photos in `product_images`.
Both tables are created by the server on first use.

On the first request the server copies the shirts from
`src/lib/headbuttProducts.json` into `products`, so the storefront keeps
showing the same catalogue. A marker row in `app_settings` records that this
happened, which stops deleted shirts from reappearing on the next request.
New shirts added from the admin app appear at the top of the catalogue and are
live on the storefront immediately. If the database is unavailable, the
bundled JSON catalogue is served instead, so the shop never goes blank.

### The admin app on a phone

`/admin` is a mobile-first app for adding shirts. Open it on a phone, add it
to the home screen, and it runs like a normal app: no app store, no browser
chrome.

Set these in `.env.local` and in the Vercel project environment:

- `ADMIN_PIN` — the PIN that unlocks the admin app. The phone exchanges it once
  for a signed session cookie; the PIN itself is never stored on the device.
- `ADMIN_SESSION_SECRET` — optional. Signing secret for the session cookie.
  When it is not set, the server derives one from `ADMIN_PIN`.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` — optional. When both are set, that
  account is created as the owner and kept in step with the environment, so
  the owner can always be recovered from the Vercel settings.
- `ADMIN_NAME` — optional display name for that owner account.

Changing `ADMIN_PIN` locks every device out until the new PIN is entered.

### Signing in with email

The login screen has two tabs: **Email** and **PIN**.

- **Email** uses the staff accounts in the `admin_users` table. Passwords are
  hashed with scrypt and a random salt, never stored or returned in clear.
- **PIN** is the shared shortcut from `ADMIN_PIN`.

The first account is created from the login screen itself: enter a name, an
email, a password and the admin PIN. That account becomes the **owner**. After
that, the **Staff** tab lets the owner add people (each gets their own email
and password), remove them, and change their own password. Staff accounts can
add and edit shirts but cannot manage other accounts.

Sign-in attempts are rate limited per IP address: eight failures locks that
address out for fifteen minutes.

Admin endpoints:

- `POST /api/admin/session` signs in with `{ "pin": "..." }` or `{ "email": "...", "password": "..." }`.
- `GET /api/admin/session` reports who is signed in.
- `DELETE /api/admin/session` ends the session (the **Sign out** button).
- `GET /api/admin/setup` reports whether the first account still has to be created.
- `GET /api/admin/accounts` lists the staff accounts.
- `POST /api/admin/accounts` creates an account (the first one needs the PIN).
- `PATCH /api/admin/accounts/:id` changes a password.
- `DELETE /api/admin/accounts/:id` removes an account.
- `POST /api/products` creates a shirt, optionally with photos.
- `PATCH /api/products/:id` updates a shirt.
- `DELETE /api/products/:id` removes a shirt.
- `POST /api/products/:id/image` stores a photo (`{ "image": "data:image/...;base64,..." }`).
- `GET /api/products/:id/image` serves a stored photo to the storefront.

Photos are resized in the browser before upload, then stored as bytes in
`product_images` and served by the image route. This is because the Vercel
filesystem is read-only at runtime, so a photo cannot be written to `public/`.

The photo URL carries a version number as a path segment
(`/api/products/:id/image/v1750000000000`), so replacing a photo always shows
the new one. The version must stay in the path: the Next.js image optimizer
rejects local URLs that carry a query string, and the shop renders product
photos through `next/image` in the search overlay and the player carousel.

The app is a PWA: `public/admin/manifest.webmanifest` and `public/admin/sw.js`
are served from the `/admin` scope, and the icons come from
`public/admin/icons/`. Regenerate the icons after changing the logo:

```bash
npm run icons:admin
```

The service worker only caches the app shell. Catalogue data and photos always
come from the network so a new shirt shows up straight away.

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

