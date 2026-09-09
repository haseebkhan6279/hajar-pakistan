# HAJAR

Pakistani couture label — white-and-gold storefront, admin dashboard, NestJS API.

## Apps

| App | Path | Stack | Port |
|-----|------|-------|------|
| Storefront | `web/` | Next.js 15 · React 19 · Tailwind v4 | 3001 |
| Admin | `dashboard/` | Vite · React 19 · React Router 7 · TanStack Query · ApexCharts | 5173 |
| API | `api/` | NestJS 11 · MongoDB · JWT · Cloudinary | 3000 |

Collections: **ZOUQ 1** · **ZOUQ 2** · **BY NAZISH ALI** — seeded on first API boot,
editable from the dashboard.

## First run

```bash
# 1. install everything (npm workspaces — run from the repo root)
npm install

# 2. configure the API
cp api/.env.example api/.env
#    fill in MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
#    Cloudinary keys are only needed for image upload

# 3. point the front ends at the API
cp web/.env.example web/.env.local
cp dashboard/.env.example dashboard/.env
```

Then, in four terminals:

```bash
npm run db             # MongoDB on 127.0.0.1:27017  (leave running)
npm run dev:api        # http://localhost:3000/api
npm run dev:web        # http://localhost:3001
npm run dev:dashboard  # http://localhost:5173
```

> **`npm run db` must be running before the API starts.** Without a database the
> API exits, the storefront falls back to an empty catalogue, and every
> collection page reads "Nothing here yet".

### The development database

`npm run db` runs a portable MongoDB kept in `.localdb/` (gitignored, ~740 MB,
nothing installed system-wide). Data lives in `.localdb/data` and persists
between restarts. To remove it entirely, delete the folder.

For production, point `MONGODB_URI` in `api/.env` at a hosted cluster instead —
MongoDB Atlas has a free tier — and skip `npm run db`.

Sign in to the dashboard with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `api/.env`.
The admin user and the three collections are upserted on every API boot.

> Install from the **repo root**, not from inside an app. These are npm workspaces —
> installing inside `web/` alone leaves two copies of React and the Next build fails
> with `Cannot read properties of null (reading 'useContext')`.

## Seeding the catalogue

```bash
npm run seed:catalog -w api   # 18 real products + the three collections
npm run reset:admin -w api    # re-hash the admin password from .env
npm run sync:collections -w api  # push brand.ts collection copy onto existing rows
```

`sync:collections` exists because the boot seeder writes `DEFAULT_CATEGORIES`
with `$setOnInsert` — so a collection created on an earlier boot keeps the
tagline it was born with, and a rename in the dashboard survives a restart. When
the house copy in [api/src/common/brand.ts](api/src/common/brand.ts) changes, run
this once to catch the existing rows up. It writes name, tagline, parentSlug and
sortOrder only; covers, product filing and everything else are untouched, and it
does not go near products the way `seed:catalog` does.

`seed:catalog` loads the live catalogue generated from the Shopify product
export — names, prices, sizes, descriptions, specs and imagery (hosted on
Shopify's CDN). It upserts by slug, so it is safe to re-run, but it **overwrites
edits made in the dashboard** for those products.

| Collection | Pieces |
|---|---|
| ZOUQ 1 | Subh-e-Feroza · Midnight Breeze · Black Mist · Husn-e-Mughal · Whimsical Charm · Minty Hint · Ethereal Glory · Amber |
| ZOUQ 2 | Frost Silhouette · Pistachio Élégance · Peacock Royale · Rosé Lumière · Moonlight Élan · Whisper Blanc |
| BY NAZISH ALI | Blush Hour · Moonlight Pearl · Lilac Éclat · Ivory Regalia |

The export predates the three-collection structure, so pieces were filed by
line — couture and bridal to BY NAZISH ALI, the heritage names to ZOUQ 1, the
newer studio line to ZOUQ 2. **Reassign any of them from the dashboard.**

## Home-page hero

The hero is a slider over four pieces chosen for imagery that carries a
full-bleed frame. The order lives in `HERO_SLUGS` in
[web/src/lib/data.ts](web/src/lib/data.ts):

```
moonlight-pearl · lilac-eclat · ivory-regalia · frost-silhouette
```

Any slug not in the catalogue is skipped; if none match, the hero falls back to
the newest published pieces, so it is never blank.

## Storefront routes

`/` · `/products` · `/products/[slug]` · `/category/[slug]` · `/cart` · `/checkout` ·
`/order/confirmation` · `/journal` · `/journal/[slug]` · `/about` · `/contact` · `/size-guide` ·
`/shipping-returns` · `/privacy` · `/cookies` · `/terms`

Plus `sitemap.xml`, `robots.txt`, `manifest.webmanifest` and a generated OG image.

## Admin routes

`/sign-in` · `/` · `/orders` · `/products` · `/products/new` · `/products/:id/edit` ·
`/categories` · `/analytics`

## API surface

Public (no auth):

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | liveness |
| GET | `/api/catalog/products` | published products (`?q=`, `?category=`) |
| GET | `/api/catalog/products/by-slug/:slug` | one published product |
| GET | `/api/catalog/categories` | collections with published counts |
| POST | `/api/orders` | place a cash-on-delivery order |

Authenticated (Bearer JWT from `POST /api/auth/login`):

`GET/POST/PATCH/DELETE /api/products` · `/api/categories` ·
`GET /api/orders`, `PATCH /api/orders/:id/status` · `POST /api/uploads` ·
`GET /api/auth/me`

## Notes

- **Payment is cash on delivery.** Nothing is charged online. Delivery is PKR 350,
  free over PKR 15,000 — the threshold lives in `api/src/orders/orders.service.ts`
  and `web/src/components/cart/CartProvider.tsx`; change both together.
- **The storefront degrades gracefully.** With the API down, pages still render and
  show an empty state rather than erroring.
- **Seeded imagery is hosted on Shopify's CDN**, carried over from the export.
  `cdn.shopify.com` is allow-listed in `next.config.ts`. New uploads through the
  dashboard go to Cloudinary; both hosts render side by side.
- **The logo** lives at `web/public/brand/hajar-logo.jpg`. The header crops the
  gold roundel out of the square tile (`LogoMark` in
  [web/src/components/Brand.tsx](web/src/components/Brand.tsx)); the footer shows
  the full tile. Swap the file to change both.
- **The campaign film** is `web/public/media/hajar-campaign.mp4` (1920×1080, 10s,
  ~7 MB), shown as a full-bleed band between the collections and the featured
  grid. It costs nothing on first load: the `src` is only attached once the band
  scrolls into view, and playback stops again when it leaves. Replace the file to
  change the film, or pass `src`/`title`/`body` to `<CampaignVideo />` in
  [web/src/app/page.tsx](web/src/app/page.tsx).
- **Slugs fold accents** — "Rosé Lumière" becomes `rose-lumiere`, not
  `ros-lumire`. The same rule lives in `api/src/common/slug.ts`,
  `web/src/lib/paths.ts` and `dashboard/src/lib/data.ts`; change all three
  together.

See [DESIGN.md](./DESIGN.md) for tokens, type and motion.
