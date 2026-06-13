# Quotetron Tasks

## Build

- [x] Replace starter interaction with app-specific behavior.
- [x] Add app-specific validation and empty states.
- [x] Add final copy and examples.
- [x] Add copyable quote summary.
- [x] Add task-based rate helper with suggested hourly and quote buttons.
- [x] Add Quotetron hero, mascot, and social preview metadata.
- [x] Remove extra hero eyebrow, polish the rate-helper image crop, and expand the profession picker.
- [x] Replace the hero wordmark with a real cropped Quotetron title asset.
- [x] Remove the visible hero wordmark while keeping accessible page structure.
- [x] Add the cleaned transparent Quotetron logo asset to the hero.
- [x] Add optimized decision-state popup assets for take, negotiate, and pass.
- [x] Add optional decision-state trigger audio and a sound toggle.
- [x] Tighten result controls, resize rate-helper mascot, and fix quote form card stretch.
- [x] Move decision popup image to the result-card top corner and constrain decision copy width.
- [x] Remove visible business score card and rate-helper mascot, then extend the hero instead of using a dark spacer band.
- [x] Preserve the full hero artwork composition before app cards begin.

## Test

- [ ] Run App Factory QA.
- [ ] Check mobile layout at 390px width.
- [ ] Check desktop layout at 1440px width.
- [ ] Check browser console for errors.
- [ ] Check links, metadata, sitemap, and robots file.

## Deploy

- [ ] Copy into MR.com app folder.
- [ ] Run `npm run check`.
- [ ] Run `npm run build`.
- [ ] Run `npx wrangler pages deploy dist --project-name milsimrooster-com --branch main`.
- [ ] Verify the live custom domain directly.
