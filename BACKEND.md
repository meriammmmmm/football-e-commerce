# Local demo backend

This project includes a small local backend for client demos. It needs no API keys or payment account.

- `POST /api/auth/demo` creates or returns a local demo user from an email address.
- `GET /api/products` returns the demo catalogue.
- `POST /api/orders` saves an order created from checkout.
- `GET /api/orders?email=...` lists demo orders for that email.

Data is intentionally held in server memory, so it resets whenever the development server restarts. Before launch, replace `src/lib/demoStore.ts` with a real database and connect checkout to a payment provider such as Stripe or Shopify Payments.
