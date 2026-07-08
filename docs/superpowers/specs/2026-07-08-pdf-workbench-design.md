# PDF Workbench Design

## Decision

Build MR.com's PDF tool in phases, with Phase 3 as the destination. The first release should be a useful local-only PDF workbench, not a half-finished clone of a full desktop editor. The architecture should make signatures, forms, OCR, redaction, and stamps natural follow-up features.

## Product Shape

The tool will live as part of Rooster's Nest, with the direct route `/tools/pdf/`. It should feel like an operator utility: dense, clear, and practical. The first screen is the working surface, not a landing page.

Core promise: users can open a PDF in the browser, mark it up, change basic page structure, and export an edited copy without the file being uploaded to MR.com.

## Phase 1: PDF Workbench

Phase 1 ships the foundation:

- Upload/open a PDF locally in the browser.
- Render pages with zoom and page navigation.
- Show a compact page rail with page thumbnails.
- Add text notes onto pages.
- Add highlight rectangles.
- Add freehand pen marks.
- Rotate pages.
- Delete pages.
- Export the edited PDF.
- Show clear local-only privacy wording.

This phase should use a simple internal annotation model that can later support signatures, stamps, and redaction overlays.

## Phase 2: Document Operations

Phase 2 expands utility features:

- Merge multiple PDFs.
- Split or extract selected pages.
- Reorder pages by thumbnail controls.
- Add blank pages.
- Import images into a PDF.
- Add basic page-size controls when generating new pages.

These features build on the same page rail and export pipeline.

## Phase 3: Full Editor Destination

Phase 3 is the "C" version:

- Signatures.
- Fill visible form fields where possible.
- OCR for scanned PDFs.
- Searchable OCR text layer where feasible.
- Redaction workflow that actually removes or covers exported content appropriately.
- Watermarks and stamps.

Phase 3 should be added only after Phase 1's local editing and export path is stable.

## Architecture

Use a static browser app in the existing MR.com tool system.

- `pdfjs-dist` renders pages to canvas for viewing.
- `pdf-lib` modifies and exports PDF bytes.
- App state stores the original file bytes, page list, page rotations, deleted-page flags, and annotations.
- Annotations store normalized page coordinates, so they survive zoom and canvas size changes.
- Export composes a fresh PDF using `pdf-lib`, applying retained pages, rotations, and annotations.
- No server-side upload, storage, or parsing in Phase 1.

The app should follow the existing `/tools/` structure and keep PDF responsibilities separated into rendering, state, annotation tools, export, and UI wiring.

## Error Handling

The app should handle:

- No file loaded.
- Non-PDF upload.
- Password-protected or malformed PDFs.
- Empty result after deleting all pages.
- Export failure.
- Very large files with a practical warning instead of a crash.

Errors should be visible in the app and written in plain language.

## Testing And Verification

Add a validator to the existing `npm run check` chain. It should confirm:

- The PDF route exists.
- Required viewer controls exist.
- Required editing controls exist.
- Local-only privacy wording exists.
- `pdfjs-dist` and `pdf-lib` are referenced or imported.
- The app is linked from Rooster's Nest or the MR.com app list.
- The header cache rules include `/tools/pdf/*`.

Before live completion:

- Run `npm run check`.
- Run `npm run build`.
- Deploy with Cloudflare Pages Direct Upload.
- Verify the live custom domain serves the PDF route and the built JS references the PDF libraries and controls.

## Explicit Non-Goals For Phase 1

- OCR.
- Redaction.
- Digital signature cryptography.
- Editing existing embedded PDF text in place.
- Server-side PDF processing.
- Account storage or document history.

These are deferred so Phase 1 can ship quickly and become the foundation for the full editor.
