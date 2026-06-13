# Website Media Architecture

## Current Runtime

- The gallery is a standalone Vite input at `apps/gallery/index.html`.
- The gallery runtime lives in `src/gallery/main.js` and uses Three.js, GSAP, and a canvas texture per card.
- The current gallery item list is hardcoded in `src/gallery/main.js`.
- The current gallery reads optimized public assets from `/media/optimized/photography/...`.
- Gallery validation is covered by `tests/validate-gallery.mjs`, which checks the standalone page, Three.js wiring, filters, modal expansion, and required public media path families.
- The public media convention is documented in `public/media/README.md`: use lowercase, web-safe filenames and reference them with `/media/...` paths.

## New Source Assets

- New archive packages are staged in `media-source/assets` and are not yet copied into `public/media/optimized`.
- Each package includes manifest metadata and sidecar JSON files.
- The milsim archive has the strongest immediate fit for the Gallery Phase 1 archive-card direction.
- A conservative milsim archive subset is generated into `src/gallery/archive-data.js` with browser assets copied to `public/media/archive/milsim`.

## Existing Gap

- The gallery can render curated images, but it does not yet consume archive manifests.
- Metadata such as category, collection, tags, and archive ids can now flow from the generated gallery data module.
- The sandbox import remains available for broader review before adding more source media.
