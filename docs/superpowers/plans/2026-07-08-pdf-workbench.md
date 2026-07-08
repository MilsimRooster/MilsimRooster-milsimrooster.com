# PDF Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish Phase 1 of MR.com's local-only PDF Workbench at `/tools/pdf/`.

**Architecture:** Add the PDF Workbench as a first-class Rooster's Nest tool page in the existing static Vite toolbox. The runtime remains browser-only: PDF rendering uses `pdfjs-dist`, export/edit composition uses `pdf-lib`, and app state stores page rotations, deleted pages, and normalized annotations.

**Tech Stack:** Vite, browser JavaScript modules, `pdf-lib`, `pdfjs-dist`, existing Rooster's Nest `src/tools/main.js`, `src/tools/styles.css`, and Node validation scripts in `tests/`.

---

## File Structure

- Modify `package.json` and `package-lock.json`: add `pdfjs-dist` dependency if missing.
- Modify `vite.config.mjs`: add `pdf` to the tool slug input list.
- Modify `tools/pdf/index.html`: new static route for `/tools/pdf/`.
- Modify `src/tools/tools-data.js`: add PDF Workbench as the first PDF tool.
- Modify `src/tools/main.js`: import PDF.js, add PDF Workbench render/init logic, and keep existing tools intact.
- Modify `src/tools/styles.css`: add PDF Workbench layout, page rail, canvas stage, annotation overlay, and responsive rules.
- Modify `public/_headers`: add `/tools/pdf/*` no-cache rule.
- Create `tests/validate-pdf-workbench.mjs`: static validator for route, controls, dependencies, privacy copy, and integration.
- Modify `package.json`: add the new validator to `npm run check`.

## Task 1: Add Failing Validator

**Files:**
- Create: `tests/validate-pdf-workbench.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing validator**

Create `tests/validate-pdf-workbench.mjs` with assertions that require:

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pagePath = join(root, "tools", "pdf", "index.html");
const toolsDataPath = join(root, "src", "tools", "tools-data.js");
const runtimePath = join(root, "src", "tools", "main.js");
const stylesPath = join(root, "src", "tools", "styles.css");
const vitePath = join(root, "vite.config.mjs");
const headersPath = join(root, "public", "_headers");
const packagePath = join(root, "package.json");
const aboutPath = join(root, "src", "App.jsx");

assert.ok(existsSync(pagePath), "PDF Workbench page should exist at /tools/pdf/");

const page = readFileSync(pagePath, "utf8");
const toolsData = readFileSync(toolsDataPath, "utf8");
const runtime = readFileSync(runtimePath, "utf8");
const styles = readFileSync(stylesPath, "utf8");
const vite = readFileSync(vitePath, "utf8");
const headers = readFileSync(headersPath, "utf8");
const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
const about = readFileSync(aboutPath, "utf8");

assert.ok(page.includes('data-tool-slug="pdf"'), "PDF route should declare data-tool-slug=\"pdf\"");
assert.ok(page.includes("PDF Workbench - Rooster's Nest"), "PDF route should have a clear title");
assert.ok(page.includes("no upload"), "PDF route metadata should mention no upload");

assert.ok(toolsData.includes('slug: "pdf"'), "PDF Workbench should be registered in tools-data");
assert.ok(toolsData.indexOf('slug: "pdf"') < toolsData.indexOf('slug: "jpg-to-pdf"'), "PDF Workbench should be the first PDF tool");
assert.ok(vite.includes('"pdf"'), "Vite should build /tools/pdf/");
assert.ok(headers.includes("/tools/pdf/*"), "Headers should include /tools/pdf/* cache rule");
assert.ok(about.includes("PDFs"), "Main MR.com app tile should continue to mention PDF tools");
assert.equal(pkg.dependencies["pdf-lib"], "^1.17.1", "pdf-lib should stay available for export");
assert.ok(pkg.dependencies["pdfjs-dist"], "pdfjs-dist should be available for rendering");

for (const token of [
  "renderPdfWorkbench",
  "initPdfWorkbench",
  "pdfjsLib",
  "PDFDocument",
  "pdf-file-input",
  "pdf-page-rail",
  "pdf-canvas",
  "pdf-annotation-layer",
  "pdf-tool-text",
  "pdf-tool-highlight",
  "pdf-tool-pen",
  "pdf-rotate-page",
  "pdf-delete-page",
  "pdf-export",
  "Privacy note: PDFs stay in your browser",
  "normalized"
]) {
  assert.ok(runtime.includes(token), `runtime should include ${token}`);
}

for (const token of [
  ".pdf-workbench",
  ".pdf-page-rail",
  ".pdf-viewer-stage",
  ".pdf-annotation-layer",
  ".pdf-toolbar",
  "@media (max-width: 760px)"
]) {
  assert.ok(styles.includes(token), `styles should include ${token}`);
}

console.log("PDF Workbench validation passed.");
```

- [ ] **Step 2: Add validator to `npm run check`**

In `package.json`, insert `node tests/validate-pdf-workbench.mjs` after `node tests/validate-tools-logic.mjs`.

- [ ] **Step 3: Run validator to verify it fails**

Run: `node tests/validate-pdf-workbench.mjs`

Expected: FAIL because `tools/pdf/index.html` does not exist yet.

## Task 2: Add Route And Tool Registration

**Files:**
- Create: `tools/pdf/index.html`
- Modify: `src/tools/tools-data.js`
- Modify: `vite.config.mjs`
- Modify: `public/_headers`

- [ ] **Step 1: Add `tools/pdf/index.html`**

Create a standard Rooster's Nest tool page:

```html
<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta name="description" content="Open, mark up, rotate, delete pages, and export PDFs locally in your browser with no upload." /><meta property="og:title" content="PDF Workbench - Rooster's Nest" /><meta property="og:description" content="A browser-only PDF viewer and editor for local markup and export." /><link rel="canonical" href="https://milsimrooster.com/tools/pdf/" /><title>PDF Workbench - Rooster's Nest</title></head><body data-tool-slug="pdf"><div id="tools-root"></div><script type="module" src="/src/tools/main.js"></script></body></html>
```

- [ ] **Step 2: Register PDF Workbench in `tools-data.js`**

Insert this object before `jpg-to-pdf`:

```js
{ slug: "pdf", title: "PDF Workbench", category: "PDF Tools", description: "View, mark up, rotate, delete pages, and export PDFs locally in your browser." },
```

- [ ] **Step 3: Add `pdf` to Vite tool inputs**

Insert `"pdf",` before `"jpg-to-pdf"` in `toolSlugs`.

- [ ] **Step 4: Add PDF cache rule**

Add to `public/_headers` after `/tools/*`:

```txt
/tools/pdf/*
  Cache-Control: no-cache, max-age=0, must-revalidate
```

- [ ] **Step 5: Run validator**

Run: `node tests/validate-pdf-workbench.mjs`

Expected: still FAIL because runtime and CSS do not contain the workbench implementation yet.

## Task 3: Install PDF Renderer Dependency

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install `pdfjs-dist`**

Run: `npm install pdfjs-dist@latest`

Expected: `package.json` gains `pdfjs-dist` under dependencies and `package-lock.json` updates.

- [ ] **Step 2: Run validator**

Run: `node tests/validate-pdf-workbench.mjs`

Expected: still FAIL until runtime and CSS are implemented.

## Task 4: Implement PDF Workbench Runtime

**Files:**
- Modify: `src/tools/main.js`

- [ ] **Step 1: Import PDF.js**

At the top of `src/tools/main.js`, add:

```js
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
```

Then after imports:

```js
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;
```

- [ ] **Step 2: Add PDF Workbench UI render function**

Add `renderPdfWorkbench(tool)` before `initTool(tool)`:

```js
function renderPdfWorkbench(tool) {
  pageShell(`
    <section class="tool-header">
      <p class="kicker">${tool.category}</p>
      <h1>${tool.title}</h1>
      <p class="tagline">${tool.description}</p>
    </section>
    <section class="pdf-workbench" aria-label="PDF Workbench">
      <aside class="pdf-page-rail" id="pdf-page-rail" aria-label="PDF pages"></aside>
      <section class="pdf-main-panel">
        <div class="pdf-toolbar" aria-label="PDF tools">
          <label class="pdf-upload" for="pdf-file-input">Open PDF<input id="pdf-file-input" type="file" accept="application/pdf,.pdf"></label>
          <button class="tool-button" id="pdf-tool-text" type="button" data-pdf-tool="text">Text</button>
          <button class="tool-button" id="pdf-tool-highlight" type="button" data-pdf-tool="highlight">Highlight</button>
          <button class="tool-button" id="pdf-tool-pen" type="button" data-pdf-tool="pen">Pen</button>
          <button class="tool-button" id="pdf-rotate-page" type="button">Rotate</button>
          <button class="tool-button" id="pdf-delete-page" type="button">Delete Page</button>
          <button class="tool-button" id="pdf-export" type="button">Export</button>
        </div>
        <div class="pdf-subtoolbar">
          <button class="tool-button" id="pdf-prev-page" type="button">Prev</button>
          <output id="pdf-page-status">No PDF loaded</output>
          <button class="tool-button" id="pdf-next-page" type="button">Next</button>
          <label for="pdf-zoom">Zoom</label>
          <input id="pdf-zoom" type="range" min="60" max="180" value="100">
        </div>
        <p id="tool-error" class="error" role="status"></p>
        <div class="pdf-viewer-stage" id="pdf-viewer-stage">
          <canvas id="pdf-canvas"></canvas>
          <div id="pdf-annotation-layer" class="pdf-annotation-layer" aria-label="PDF annotation layer"></div>
          <div class="pdf-empty-state" id="pdf-empty-state">Open a PDF to start viewing and marking it up.</div>
        </div>
      </section>
    </section>
    <p class="privacy-note">Privacy note: PDFs stay in your browser. This tool does not upload or store your files on MR.com.</p>
    <h2 class="section-title">Related Tools</h2>
    <section class="related-grid">${relatedTools(tool)}</section>
  `);
}
```

- [ ] **Step 3: Add state and helpers**

Add `initPdfWorkbench()` with state:

```js
const pdfState = {
  bytes: null,
  pdf: null,
  currentPage: 1,
  scale: 1,
  activeTool: "text",
  pages: [],
  annotations: new Map(),
  drawing: null
};
```

Use normalized annotation coordinates:

```js
function normalizePoint(event, layer) {
  const rect = layer.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / rect.width,
    y: (event.clientY - rect.top) / rect.height
  };
}
```

- [ ] **Step 4: Implement open/render/navigation**

`initPdfWorkbench()` must wire:

- `#pdf-file-input` change: read bytes, `pdfjsLib.getDocument({ data: bytes.slice(0) }).promise`, initialize pages, render page 1.
- `#pdf-prev-page` and `#pdf-next-page`: move through non-deleted pages.
- `#pdf-zoom`: update `pdfState.scale` and re-render.
- `renderPdfPage()`: render current PDF page to `#pdf-canvas`, apply rotation, size `#pdf-annotation-layer`, render annotations, update page status.
- `renderPageRail()`: list page buttons with active/deleted state.

- [ ] **Step 5: Implement annotation interactions**

On `#pdf-annotation-layer`:

- Text tool click prompts for note text and stores `{ type: "text", x, y, text }`.
- Highlight tool pointer drag stores `{ type: "highlight", x, y, width, height }`.
- Pen tool pointer drag stores `{ type: "pen", points: [...] }`.

Each annotation is normalized to page dimensions and rendered into absolutely positioned overlay elements.

- [ ] **Step 6: Implement rotate/delete/export**

- `#pdf-rotate-page`: add 90 degrees to the current page rotation and re-render.
- `#pdf-delete-page`: mark current page deleted, prevent deleting every page, then move to the next available page.
- `#pdf-export`: use `PDFDocument.load(pdfState.bytes)`, create a new PDF, copy non-deleted pages, set rotation, draw text/highlights/pen paths using page dimensions, save and `downloadBlob(..., "edited.pdf")`.

- [ ] **Step 7: Hook slug into `initTool`**

At the start of `initTool(tool)`, add:

```js
  if (tool.slug === "pdf") {
    renderPdfWorkbench(tool);
    initPdfWorkbench();
    return;
  }
```

- [ ] **Step 8: Run validator**

Run: `node tests/validate-pdf-workbench.mjs`

Expected: FAIL only for CSS tokens if runtime is complete.

## Task 5: Add PDF Workbench CSS

**Files:**
- Modify: `src/tools/styles.css`

- [ ] **Step 1: Add layout styles**

Add CSS for:

- `.pdf-workbench`
- `.pdf-page-rail`
- `.pdf-main-panel`
- `.pdf-toolbar`
- `.pdf-subtoolbar`
- `.pdf-viewer-stage`
- `.pdf-annotation-layer`
- `.pdf-empty-state`
- `.pdf-annotation`
- `.pdf-annotation-text`
- `.pdf-annotation-highlight`
- `.pdf-annotation-pen`

The layout should be a left page rail plus main canvas stage on desktop and stacked on mobile.

- [ ] **Step 2: Run validator**

Run: `node tests/validate-pdf-workbench.mjs`

Expected: PASS.

## Task 6: Full Check, Build, Deploy, Live Verify

**Files:**
- No new source files unless validation exposes gaps.

- [ ] **Step 1: Run full check**

Run: `npm run check`

Expected: PASS. Existing module-type warnings may appear from analytics helper files.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: PASS with Vite output including `tools/pdf/index.html`.

- [ ] **Step 3: Deploy**

Run: `npx wrangler pages deploy dist --project-name milsimrooster-com --branch main --commit-dirty=true`

Expected: Cloudflare Pages deploy completes and returns a preview URL.

- [ ] **Step 4: Live route checks**

Run a Node fetch smoke check against `https://milsimrooster.com/tools/pdf/` and the built JS asset. Confirm:

- route returns 200
- page includes `data-tool-slug="pdf"`
- built JS includes `PDF Workbench`
- built JS includes `pdfjs-dist` worker references or PDF.js code
- built JS includes export/delete/rotate control IDs

- [ ] **Step 5: Browser render check**

Use Playwright screenshot:

```powershell
npx --yes playwright screenshot --wait-for-selector ".pdf-workbench" --timeout 60000 --viewport-size "1280,900" "https://milsimrooster.com/tools/pdf/?v=pdf-workbench-check" "C:\Users\KDLEA\Documents\Codex\2026-07-05\we\work\pdf-workbench-live.png"
```

Expected: screenshot command exits 0.
