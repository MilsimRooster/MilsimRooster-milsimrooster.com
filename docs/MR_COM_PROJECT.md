# MR.com Project Context

This project covers milsimrooster.com and the small HTML apps published under it. Keep this context focused on MR.com site and app work.

## Project Homes

- Main website repo: `E:\games\website`
- Live domain: `https://milsimrooster.com`
- Cloudflare Pages project: `milsimrooster-com`
- Cloudflare account: `a9f7ed0e9eafed72f895c32880099c53`
- GitHub remote: `https://github.com/MilsimRooster/MilsimRooster-milsimrooster.com.git`
- Apostles source repo: `E:\games\Apostles-Quest`
- FPS Visualizer source repo: `E:\games\FPSVisualizer`

## Deployment

Cloudflare Pages is currently Direct Upload, not Git-connected. GitHub pushes do not automatically deploy the site.

Build and deploy from `E:\games\website`:

```powershell
npm run check
npm run build
npx wrangler pages deploy dist --project-name milsimrooster-com --branch main
```

Wrangler is authenticated as `info@keithleague.com`.

## Live Routes

- Home: `https://milsimrooster.com/`
- Apostles Quest: `https://milsimrooster.com/apps/apostles/`
- FPS Visualizer: `https://milsimrooster.com/apps/fps-visualizer/`
- Rooster Recipes: `https://milsimrooster.com/apps/recipes/`
- Quotetron: `https://milsimrooster.com/apps/quotetron/`

All four routes were checked live and returned HTTP `200` with the expected page titles.

## Current App State

### Home Page

- Main page includes launch cards for Apostles Quest, FPS Visualizer, Rooster Recipes, How Southern Are You?, Southern Translator, and Quotetron.
- The apps launcher should feel like a clear "Games and Utilities" section for the MR.com app family.

### Apostles Quest

- Mobile hint layout was fixed so the Apostle card stacks below the question instead of being cut off.
- Added topbar controls:
  - `Setup` returns to the mode/team setup screen.
  - `Reset` restarts play.
  - `Main Site` returns to `https://milsimrooster.com/`.
- Mobile map callout was adjusted so text and map content fit better on small screens.
- Website copy currently cache-busts Apostles assets with `styles.css?v=20260604-nav-map-1` and `game.js?v=20260604-nav-map-1`.
- Matching source changes were pushed to the standalone Apostles repo.

### FPS Visualizer

- Hosted under `/apps/fps-visualizer/`.
- Important behavior: preserve the interactive BB plotting chart with sliders. A previous plain white/text-only version was considered broken because the chart was lost.

### Rooster Recipes

- Hosted under `/apps/recipes/`.
- Current app includes search, category/protein filters, recipe cards, shopping list, simple meal plan, shared D1-backed rating faces, and auto-approved clean feedback comments.
- Recipe categories include beef, chicken, fish, desserts, and others.
- Fish options and pie/dessert expansion were requested and added.
- Rating face style should stay playful; 1-star uses a softer bad rating face, not a harsh black-and-white frown.
- Recipe disclaimer should be "Rooster style": practical, friendly, and clear that measurements are starting points to verify with taste, temperature, and common sense.
- D1 backend files live in `functions/api/ratings.js`, `functions/api/comments.js`, `functions/api/admin/ratings.js`, `schema.sql`, and `migrations/0001_rooster_recipes_feedback.sql`.
- Bind the D1 database to Cloudflare Pages as `DB`; the admin results route also expects an `ADMIN_TOKEN` secret.

### How Southern Are You?

- Hosted under `/apps/how-southern-are-you/`.
- Current app uses a 500-question Southern-culture humor bank with score-labeled answers.
- Validation lives in `tests/validate-how-southern.mjs` and `tests/validate-southern-content-bank.mjs`.

### Southern Translator

- Hosted under `/apps/southern-translator/`.
- Current app includes a 2,112-entry phrase database across Southern, Appalachian, Alabama, rural, church, food, military, weather, and humor categories.
- Validation lives in `tests/validate-southern-translator.mjs`.

## Stabilization Notes

June 5, 2026 stabilization pass:

- Added `npm run check` to run the site validators before build/deploy.
- Corrected `README.md` to describe the real Direct Upload Cloudflare Pages workflow.
- Converted `public/_headers` into active Cloudflare Pages header rules and added cache hints for Vite assets, optimized media, and hosted app assets.
- Added `tests/validate-headers.mjs` so header/security/cache rules are checked with the rest of the site.
- Replaced the external-link arrow glyph with visible `Open` text for a simpler, more robust link label.

## Security Snapshot

Cloudflare security analytics showed, for the checked 24-hour window:

- `0` suspicious activity
- `50` requests mitigated by Cloudflare
- `4.6k` total requests
- `584` served by Cloudflare
- `3.96k` served by origin
- Top source IP: `195.178.110.199` with about `2.54k` requests

Traffic analytics also showed:

- `203` unique visitors in the previous 24 hours
- `51.72 MB` bandwidth
- Netherlands was the top traffic country/region, followed by the United States
- Share stats showed `89` attacks blocked in the last month

Interpretation: not an emergency. This looks like normal public-site scanning/crawler behavior plus Cloudflare doing its job. Watch the high-volume source IP; challenge or block it if it keeps hammering the site.

Live response headers looked good:

- HSTS enabled
- Content Security Policy present
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- strict referrer policy
- restrictive permissions policy

## Near-Term Priorities

1. Keep MR.com planning, site work, and app handoffs anchored in this project context.
2. Consider adding a Cloudflare rule if `195.178.110.199` keeps dominating traffic.
3. Improve static asset caching once app edits settle down.
4. Decide whether to keep Direct Upload or connect Cloudflare Pages to GitHub for push-to-deploy.
5. Before adding shared ratings/submissions, design a small backend with spam/rate-limit protections.
