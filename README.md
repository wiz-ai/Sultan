# Sultan — Tampa's Middle Eastern Grocery Delivery

A full-stack demo for **Sultan Market**: online shopping, same-day & next-day
delivery, driver route optimization, an AI assistant that speaks English and
Palestinian Arabic, and a recipe system that builds carts in one tap.

Built with **Next.js 14** (App Router, standalone output), TailwindCSS, SQLite
(embedded), Leaflet maps, and OpenAI.

## Feature tour

| Path        | Role     | What's there                                                    |
| ----------- | -------- | --------------------------------------------------------------- |
| `/`         | Everyone | Landing page, categories, bestsellers, delivery pricing         |
| `/shop`     | Customer | Filterable catalog with search, sort, category pills            |
| `/cart`     | Customer | Editable basket with live totals                                |
| `/checkout` | Customer | Smart delivery-window picker (same-day / next-day) + priority   |
| `/recipes`  | Customer | Recipes that add every ingredient to the cart in one tap        |
| `/account`  | Customer | Order history with live status                                  |
| `/admin`    | Staff    | Add/edit/delete products + update order status                  |
| `/driver`   | Driver   | Optimized route map (Leaflet) + delivery list + navigation      |

Plus a floating **AI chat** (bottom-right) that replies in English or
Palestinian/Levantine colloquial Arabic, references the real catalog, and
suggests recipes.

## Local development

```bash
npm install
cp .env.example .env.local   # add your OPENAI_API_KEY
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Key                      | Default                 | Notes                                     |
| ------------------------ | ----------------------- | ----------------------------------------- |
| `OPENAI_API_KEY`         | *(required for chat)*   | If missing, chat gracefully shows a hint. |
| `OPENAI_MODEL`           | `gpt-4o-mini`           | Any chat-completion model works.          |
| `SULTAN_DB_PATH`         | `/tmp/sultan.db` (prod) | SQLite file location.                     |
| `SULTAN_STORE_LAT`       | `28.0395`               | Map origin.                               |
| `SULTAN_STORE_LNG`       | `-82.4572`              | Map origin.                               |

## Deploy to Cloud Run (from GitHub)

1. **Connect the repo** in Cloud Run → "Deploy from repository" → select this
   repo + the branch you want (e.g., `main` or the feature branch).
2. **Build type:** Dockerfile (auto-detected).
3. **Environment variables** on the service:
   - `OPENAI_API_KEY` → your key
   - `OPENAI_MODEL` → `gpt-4o-mini` (optional)
4. **Settings:**
   - CPU: 1 · Memory: **1 GB** (Next.js + native sqlite needs more than 512 MB)
   - Port: `8080` (already wired in the Dockerfile)
   - Allow unauthenticated invocations: **yes** (public storefront)
   - Min instances: `0` for demo, `1` if you want zero cold-starts

## Architecture notes

- **Single container** — Next.js handles both frontend (React / Tailwind) and
  API (`/api/*` routes), so one Cloud Run service is enough.
- **SQLite in `/tmp`** — perfect for a demo. Cloud Run's `/tmp` is
  per-instance ephemeral, so each cold start re-seeds fresh data and multiple
  instances don't share orders. To go production, swap `lib/db.ts` for Firestore
  or Cloud SQL — the repository layer (`lib/repo.ts`) is the only thing that
  depends on it.
- **Route optimization** uses a simple nearest-neighbor heuristic over
  Haversine distance. Good enough for 10–20 stops in Tampa; swap for a real
  VRP solver (e.g. Google OR-Tools) if you need more.
- **AI chat** injects the live catalog + recipe list into the system prompt so
  GPT never recommends a product that isn't in stock.

## Code layout

```
app/                       Next.js App Router
  api/                     REST endpoints
    chat/                  OpenAI proxy (EN / Arabic system prompt)
    products/              CRUD
    orders/                CRUD + status transitions
    delivery/              Driver route + optimizer
    recipes/               Recipes hydrated with live product data
  admin/                   Staff view
  driver/                  Driver view + Leaflet map
  shop/, cart/, checkout/  Customer flow
  recipes/, account/       Customer extras

components/                Shared React components
lib/                       Types, db, repo, pricing, routing, OpenAI client
Dockerfile                 Multi-stage for Cloud Run
```
