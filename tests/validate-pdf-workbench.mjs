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

assert.ok(page.includes('data-tool-slug="pdf"'), 'PDF route should declare data-tool-slug="pdf"');
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
  "pdf-text-guide",
  "pdf-tool-text",
  "pdf-tool-highlight",
  "pdf-tool-pen",
  "pdf-pen-colors",
  "data-pen-color",
  "pdf-toggle-rail",
  "pdf-undo-annotation",
  "pdf-clear-page",
  "pdf-rotate-page",
  "pdf-delete-page",
  "pdf-export",
  "history: []",
  "penColor: \"red\"",
  "PDF_PEN_COLORS",
  "TEXT_ANNOTATION_BASELINE_OFFSET",
  "TEXT_GUIDE_WIDTH",
  "recordPdfHistory",
  "showPdfTextGuide",
  "hidePdfTextGuide",
  "updatePdfTextGuideVisibility",
  "setPdfPenColor",
  "undoLastPdfAction",
  "clearCurrentPdfPageAnnotations",
  "togglePdfPageRail",
  "currentDraftPdfAnnotation",
  "placePdfAnnotation",
  "renderHighlightPdfAnnotation",
  "Privacy note: PDFs stay in your browser",
  "normalized",
]) {
  assert.ok(runtime.includes(token), `runtime should include ${token}`);
}

assert.ok(!runtime.includes("style=\"left:"), "annotation geometry should not be rendered as inline style strings under CSP");
assert.ok(runtime.includes("const TEXT_ANNOTATION_BASELINE_OFFSET = 1;"), "text export baseline should sit closer to form lines without colliding");

for (const token of [
  ".pdf-workbench",
  ".pdf-page-rail",
  ".pdf-rail-toggle",
  ".pdf-workbench.is-rail-collapsed",
  ".pdf-pen-colors",
  ".pdf-color-swatch",
  ".pdf-color-swatch.is-active",
  ".pdf-viewer-stage",
  ".pdf-annotation-layer",
  ".pdf-text-guide",
  ".pdf-annotation-layer.is-text-mode",
  ".pdf-annotation-highlight.is-draft",
  ".pdf-toolbar",
  "@media (max-width: 760px)",
]) {
  assert.ok(styles.includes(token), `styles should include ${token}`);
}

console.log("PDF Workbench validation passed.");
