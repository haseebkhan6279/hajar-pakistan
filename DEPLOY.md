# Deploying HAJAR to Vercel

Three Vercel projects from this one repository, each with a different **Root
Directory**. Create them at vercel.com → Add New → Project → import the repo,
then set Root Directory in the import screen.

| Project        | Root Directory | Framework Preset | Notes                        |
| -------------- | -------------- | ---------------- | ---------------------------- |
| `hajar-api`    | `api`          | Other            | NestJS as a serverless function |
| `hajar-web`    | `web`          | Next.js          | Storefront                   |
| `hajar-dashboard` | `dashboard` | Vite             | Admin SPA                    |

Vercel detects the npm workspace lockfile at the repo root on its own; leave
Install and Build commands at their defaults.

## Deploy the API first — this order is not optional

`web` calls the API **at build time** (`generateStaticParams` in
`src/app/products/[slug]/page.tsx` and `src/app/category/[slug]/page.tsx`).

If the API is unreachable during the web build, `fetchJson` in
`src/lib/catalog.ts` swallows the error and returns `FALLBACK_PRODUCTS`. **The
build still succeeds** — and ships a storefront full of placeholder demo
products with no warning anywhere in the log. Always confirm
`https://<api-host>/api/health` returns `{"ok":true}` before building web.

## Environment variables

Set these under Settings → Environment Variables. Apply to Production, Preview
and Development unless noted.

### `hajar-api`

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | The `mongodb+srv://…` string from Atlas, with `/hajar` before the `?` |
| `JWT_SECRET` | A long random string. Changing it signs everyone out. |
| `ADMIN_EMAIL` | Dashboard login |
| `ADMIN_PASSWORD` | Dashboard password — see caveat below |
| `SEED_ON_BOOT` | `false` |
| `CORS_ORIGIN` | Your domains **plus the localhost entries** — see below |

`PORT` is not used on Vercel; the platform owns the socket.

`SEED_ON_BOOT=false` matters here. The seeder upserts the admin user and the
default collections in `OnModuleInit`, which on serverless runs on **every cold
start** — a bcrypt hash plus five writes charged to whichever unlucky request
warms the container. Seed deliberately from your machine instead:

```bash
npm run reset:admin -w api        # admin user from ADMIN_EMAIL / ADMIN_PASSWORD
npm run sync:collections -w api   # push brand copy onto the collection rows
```

### `hajar-web`

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://<api-domain>/api` — note the `/api` suffix |

### `hajar-dashboard`

| Variable | Value |
| --- | --- |
| `VITE_API_URL` | `https://<api-domain>/api` |

Both are baked in at build time, not read at runtime. Changing either means
redeploying that project.

## CORS

`CORS_ORIGIN` is a comma separated list with no spaces:

```
https://hajar.pk,https://www.hajar.pk,http://localhost:3001,http://localhost:5173,http://127.0.0.1:3001,http://127.0.0.1:5173
```

The localhost entries belong in production too. They are what lets you point a
dashboard or storefront running on your own machine at the deployed API, which
is the quickest way to check something against real data. `localhost` and
`127.0.0.1` are *different origins* to a browser — it sends whatever is in the
address bar — so both forms are listed.

That is a deliberate, small trade: only a page actually served from localhost
carries a localhost `Origin`, so an ordinary malicious site cannot use these
entries. Auth is a bearer token read from localStorage, which is per-origin,
so a page on localhost cannot read the deployed dashboard's token either.

Preview deployments need nothing added — `src/setup.ts` accepts any
`*.vercel.app` origin by regex. A custom domain is **not** covered by that and
must be listed here explicitly.

## File uploads are switched off

No Cloudinary keys are set, so there is no image storage. The API boots fine
without them — `src/uploads/uploads.service.ts` reports itself unconfigured
rather than reading the keys with `getOrThrow`, which would have taken the
whole process down at startup.

What this means day to day:

- `POST /api/uploads` returns **503** with a plain message, which the dashboard
  shows as "Uploads are switched off".
- **You cannot add images to a product from the dashboard.** That field is
  file-upload only, with no paste-a-URL option. Existing products are
  unaffected — their images are Shopify CDN URLs already in the database.
- Instagram import still works. It hot-links the original image and flags the
  tile with a warning instead of mirroring it, so that tile stops working once
  Instagram's signed URL expires.

To switch it on later, set the three `CLOUDINARY_*` variables and redeploy.
Nothing else has to change.

### When you do turn it on, mind the 4.5 MB cap

Vercel caps a serverless function's request body at **4.5 MB**, while
`src/uploads/uploads.controller.ts` accepts images to 8 MB and video to 40 MB.
Anything larger is rejected by the platform with a 413 before Nest sees it. The
fix is uploading from the browser straight to Cloudinary with a signed preset,
so the file never passes through the API — a real feature, not a config change.

## What runs where

`api/api/[[...slug]].ts` is the Vercel entry: an optional catch-all, so Vercel
routes every `/api/*` request to it natively without a rewrite, and the function
sees the original path. It calls `app.init()` rather than `app.listen()` and
caches the bootstrap *promise* at module scope, so concurrent requests during a
cold start share one Nest app and one Mongo pool.

`src/main.ts` is still the long-running server for local development and for any
host that wants a real process. Both call `configureApp()` from `src/setup.ts`,
so prefix, validation and CORS cannot drift apart.
