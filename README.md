# MilsimRooster.com

Personal promotional website for Keith League / Milsim Rooster.

## Tech

- Vite
- React
- Cloudflare Pages

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production output is generated in `dist`.

## Cloudflare Pages Deployment

Cloudflare Pages is currently a Direct Upload project, not Git-connected. GitHub pushes do not deploy automatically.

Deploy from this repo:

```bash
npm run check
npm run build
npx wrangler pages deploy dist --project-name milsimrooster-com --branch main
```

Or use the guarded release helper:

```powershell
.\scripts\release-mrcom.ps1
```

For local validation only:

```powershell
.\scripts\release-mrcom.ps1 -SkipDeploy -SkipLiveCheck
```

See `docs/RELEASE_CHECKLIST.md`.

Live domains:

- `https://milsimrooster.com`
- `https://www.milsimrooster.com`
- `https://milsimrooster-com.pages.dev`

Cloudflare Pages project: `milsimrooster-com`.

The `public/_headers` file owns site security headers and browser cache hints for built Vite assets, optimized media, and hosted app assets.

## Rooster Recipes D1 Backend

Rooster Recipes keeps recipe content static in `public/apps/recipes/recipes.json`, while shared ratings and comments use Cloudflare Pages Functions plus Cloudflare D1.

Files:

- `schema.sql` - D1 schema for `recipe_ratings` and `recipe_comments`.
- `migrations/0001_rooster_recipes_feedback.sql` - Wrangler D1 migration copy of the schema.
- `functions/api/ratings.js` - `GET /api/ratings?recipe=slug` and `POST /api/ratings`.
- `functions/api/comments.js` - `POST /api/comments`; clean comments are stored as `approved` and obvious spam is filtered.
- `functions/api/admin/ratings.js` - token-protected `GET /api/admin/ratings`.
- `public/apps/recipes/admin.html` - admin results page.

Create and bind the D1 database:

```bash
npx wrangler d1 create rooster-recipes
```

Copy `wrangler.toml.example` to `wrangler.toml`, replace `REPLACE_WITH_D1_DATABASE_ID` with the database ID from the create command, and keep the binding name as `DB`.

Apply the schema:

```bash
npx wrangler d1 migrations apply rooster-recipes --remote
```

Alternatively, apply the root schema file directly:

```bash
npx wrangler d1 execute rooster-recipes --remote --file=schema.sql
```

Set the admin token used by `/apps/recipes/admin.html`:

```bash
npx wrangler pages secret put ADMIN_TOKEN --project-name milsimrooster-com
```

## Privacy-Safe Traffic Referrer Analytics

The site records aggregate referral buckets through Pages Functions and D1 because Cloudflare HTTP analytics does not expose referrer dimensions to the current Wrangler OAuth session.

Files:

- `public/assets/js/referrer-analytics.js` - posts only the current path and `document.referrer`.
- `functions/_middleware.js` - injects the local analytics script into successful HTML responses.
- `functions/api/referrer.js` - reduces incoming data to day, referrer family, referrer host, and landing page group.
- `functions/api/admin/referrers.js` - token-protected `GET /api/admin/referrers?days=7`.
- `migrations/0002_traffic_referrer_daily.sql` - D1 table for aggregate page-load counts.

The endpoint does not store IPs, user agents, cookies, full referrer URLs, names, or free-form query strings.

## Passive Scanner Probe Analytics

Obvious scanner paths are answered with `410 Gone` before the site routes run. Those hits are also counted in coarse D1 buckets so the admin view can show where the noise is coming from without storing raw visitor identifiers.

Files:

- `functions/_middleware.js` - recognizes junk scanner paths, records an aggregate probe bucket, and returns `410 Gone`.
- `functions/_lib/scanner-analytics.js` - reduces scanner hits to country, ASN, ASN organization, method, path bucket, and user-agent family.
- `functions/api/admin/scanner-probes.js` - token-protected `GET /api/admin/scanner-probes?days=7`.
- `migrations/0003_scanner_probe_daily.sql` - D1 table for aggregate scanner-probe counts.

The scanner logger does not store IPs, raw user agents, cookies, request bodies, or full probe paths.

For Cloudflare dashboard setup, open Workers & Pages > `milsimrooster-com` > Settings > Bindings, add a D1 database binding named `DB`, and redeploy. The same project also needs an `ADMIN_TOKEN` secret/variable for the admin route.

For local testing with Pages Functions:

```bash
npm run build
npx wrangler pages dev dist --d1 DB=rooster-recipes
```

Deploy from the repo root with Wrangler so the root `functions/` folder is uploaded with the Direct Upload deployment:

```bash
npm run check
npm run build
npx wrangler pages deploy dist --project-name milsimrooster-com --branch main
```

## Site Sections

- Home
- About
- Photography
- Videos
- Projects
- Links

## Hosted Apps

- Bible Study Arcade: `/apps/bible-study/`
- Apostles Quest: `/apps/apostles/`
- New Testament Trail: `/apps/apostles/new-testament-trail.html`
- FPS Visualizer: `/apps/fps-visualizer/`
- Rooster Recipes: `/apps/recipes/`
- How Southern Are You?: `/apps/how-southern-are-you/`
- Southern Translator: `/apps/southern-translator/`
- Quotetron: `/apps/quotetron/`
- Bug Strike: `/apps/bug-strike/`
