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

1. Push this repository to GitHub.
2. In Cloudflare Pages, create a new project and connect the GitHub repository.
3. Use these build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Production branch: `main`
4. For `milsimrooster.com`, update GoDaddy DNS to use Cloudflare nameservers, then add the domain in Cloudflare Pages as a custom domain.

## Site Sections

- Home
- About
- Photography
- Videos
- Projects
- Contact
- Links
