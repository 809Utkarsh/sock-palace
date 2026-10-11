# Sock Palace

Sock store: browse socks, add to cart (saved in the database even before login),
log in only at "Proceed to Buy", place an order and get a "Coming soon to your doorstep" message.

```
frontend/   React + Vite + Tailwind   → Vercel project #1
backend/    Express API               → Vercel project #2 (serverless)
            Postgres database         → Neon (added from Vercel → Storage)
```

## Database tables

| Table | What it stores |
|---|---|
| `users` | name, email, password hash, created_at, last_login_at |
| `products` | the socks (name, price, category, tag, images, sizes) |
| `cart_items` | every Add to Cart: `guest_id` before login, `user_id` after login, `product_id`, `size`, `quantity` |
| `orders` | user, total, status (`pending` → shipped → delivered), delivery address |
| `order_items` | products, sizes, quantities and prices in each order |

## Run locally

```bash
# backend
cd backend
cp .env.example .env        # paste DATABASE_URL + JWT_SECRET
npm install
npm run db:setup            # creates tables + 12 sample socks (safe to re-run)
npm run dev                 # http://localhost:4000

# frontend (new terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

## Deploy on Vercel (free)

1. Push this repo to GitHub.
2. **Backend:** Vercel → Add New → Project → import the repo → Root Directory = `backend` → Deploy.
3. **Database:** open the backend project → Storage → Create Database → Neon (Free) → connect.
   This adds `DATABASE_URL` automatically.
4. Backend project → Settings → Environment Variables: add `JWT_SECRET` (long random string)
   and `FRONTEND_URL` (filled in after step 6). Redeploy.
5. Run `npm run db:setup` once from your machine (with that `DATABASE_URL` in `backend/.env`).
6. **Frontend:** Add New → Project → same repo → Root Directory = `frontend`,
   env var `VITE_API_URL` = backend URL (e.g. `https://sock-palace-api.vercel.app`) → Deploy.
7. Set the backend `FRONTEND_URL` to the frontend URL and redeploy the backend.

## Replacing the placeholder images

Put your photos in `frontend/public/products/` and update the image paths
(see `backend/scripts/setup-db.js`), then run `npm run db:setup` again.
