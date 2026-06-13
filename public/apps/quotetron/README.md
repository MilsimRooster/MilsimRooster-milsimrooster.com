# Quotetron

Quotetron is a privacy-first calculator that helps freelancers, laborers, and side-hustlers build better quotes, compare rates, and avoid undercharging.

## Features

- Instant true-hourly and target-quote calculator
- Rate helper for common freelance, photography, design, and labor tasks
- Take, negotiate, or pass recommendation
- Tiny decision-state character popups for take, negotiate, and pass
- Optional trigger audio for each decision state
- Plain-English help popouts for every input
- Copyable quote summary for notes or client planning
- Responsive static HTML, CSS, and JavaScript
- Basic SEO, Open Graph, Twitter/X, Facebook, canonical, and structured data metadata
- Local Quotetron hero and social preview assets
- Compressed WebP artwork for faster mobile loads
- Privacy, contact, sitemap, robots, deployment, launch, and QA docs

## Business-Mode Score

- Search potential: 8/10
- Share potential: 7/10
- Build simplicity: 9/10
- Low maintenance: 9/10
- Monetization opportunity: 7/10
- Total: 40/50

The idea clears the 35/50 gate because it solves a recurring pricing problem, needs no accounts or database, and can monetize through ads, worksheets, affiliate links, or sponsorships without adding infrastructure. The score is documented here rather than shown in the app UI.

## Rate Helper

The rate helper gives starting hourly ranges for common task types across photo/video, creative/digital, home/trades, outdoor/hauling, auto/mobile service, cleaning/moving, tutoring, bookkeeping, and admin help. It adjusts the range for experience level and market strength, then estimates a project quote using the current hours, expenses, fees, and reserve settings.

Rate ranges are practical planning defaults. They should be refreshed before a major public launch because local pricing changes by region, skill, demand, licensing, insurance, equipment, and deliverables.

Source notes are documented in `docs/RATE_SOURCES.md`.

## Local Use

Open `index.html` in a browser or serve the folder with any static server.

## Deployment

Copy this folder into the MR.com site app area, then run the Direct Upload deployment flow documented in `docs/DEPLOYMENT.md`.
