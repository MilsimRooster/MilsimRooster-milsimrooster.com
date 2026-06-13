# Safe Integration Plan

## Recommendation

Proceed with a sandbox import before production gallery changes.

## Proposed Work

1. Create `sandbox-media-import/` with a small manifest loader and static preview.
2. Copy a selected subset of milsim source media into a sandbox public path using web-safe names.
3. Build operation/archive cards from `manifest.json` grouped by source folder/category.
4. Add metadata fields to the sandbox card model: title, category, tags, collection/folder, source file, and asset count.
5. Validate search/filter behavior and missing-file handling in the sandbox.
6. After sandbox validation, integrate the selected manifest-derived item model into `src/gallery/main.js` or generate a dedicated gallery data module.

## Files Likely Affected Later

- `src/gallery/main.js`
- `src/gallery/styles.css`
- `tests/validate-gallery.mjs`
- `public/media/optimized/...` or a new generated gallery media path

## Risk Level

Low for documentation and sandbox work. Medium for production gallery integration because the current sphere uses hardcoded card data and hand-tuned visual density.

## Rollback Strategy

- Keep source assets unchanged.
- Keep sandbox files isolated under `sandbox-media-import/`.
- For production changes, add data-driven gallery loading as an additive path and leave current hardcoded gallery items available until validation passes.
- Run `npm run check` and `npm run build` before deploy.
