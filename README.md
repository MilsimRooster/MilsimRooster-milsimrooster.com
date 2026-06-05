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

Live domains:

- `https://milsimrooster.com`
- `https://www.milsimrooster.com`
- `https://milsimrooster-com.pages.dev`

Cloudflare Pages project: `milsimrooster-com`.

The `public/_headers` file owns site security headers and browser cache hints for built Vite assets, optimized media, and hosted app assets.

## Site Sections

- Home
- About
- Photography
- Videos
- Projects
- Links

## Hosted Apps

- Apostles Quest: `/apps/apostles/`
- FPS Visualizer: `/apps/fps-visualizer/`
- Rooster Recipes: `/apps/recipes/`
- How Southern Are You?: `/apps/how-southern-are-you/`
- Southern Translator: `/apps/southern-translator/`
