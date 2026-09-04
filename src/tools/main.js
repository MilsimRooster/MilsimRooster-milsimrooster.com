import QRCode from "qrcode";
import { PDFDocument, degrees, rgb } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
import "./styles.css";
import { tools } from "./tools-data.js";
import {
  base64Decode,
  base64Encode,
  convertUnit,
  countWords,
  formatJson,
  generatePassword,
  minifyJson,
  sha256,
  uuidv4
} from "./utils.js";

const root = document.querySelector("#tools-root");
const slug = document.body.dataset.toolSlug;
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

function pageShell(content) {
  root.innerHTML = `
    <div class="tool-shell">
      <header class="tool-topbar">
        <a class="tool-brand" href="/tools/"><span>RN</span><span>Rooster's Nest</span></a>
        <nav class="tool-nav" aria-label="Toolbox navigation">
          <a href="/">Main Site</a>
          <a href="/tools/">All Tools</a>
          <a href="/tools/password-generator/">Password</a>
          <a href="/tools/json-formatter/">JSON</a>
        </nav>
      </header>
      ${content}
    </div>
  `;
}

function toolUrl(tool) {
  return `/tools/${tool.slug}/`;
}

function renderLanding() {
  pageShell(`
    <section class="hero">
      <p class="kicker">No Login Toolbox</p>
      <h1>Rooster's Nest</h1>
      <p class="tagline">Fast, free tools that work right in your browser. No login. No watermark. No nonsense.</p>
    </section>
    <h2 class="section-title">All Tools</h2>
    <section class="tool-grid">
      ${tools.map((tool) => toolCard(tool)).join("")}
    </section>
  `);
}

function toolCard(tool) {
  return `<a class="card" href="${toolUrl(tool)}"><small>${tool.category}</small><h3>${tool.title}</h3><p>${tool.description}</p></a>`;
}

function relatedTools(current) {
  return tools
    .filter((tool) => tool.slug !== current.slug)
    .slice(0, 4)
    .map((tool) => toolCard(tool))
    .join("");
}

function renderTool(tool, inputMarkup, outputMarkup = `<output id="tool-output" class="output-box"></output>`) {
  pageShell(`
    <section class="tool-header">
      <p class="kicker">${tool.category}</p>
      <h1>${tool.title}</h1>
      <p class="tagline">${tool.description}</p>
    </section>
    <section class="tool-workspace">
      <div class="tool-panel">
        <h2>Input</h2>
        <div class="field-grid">${inputMarkup}</div>
        <p id="tool-error" class="error" role="status"></p>
        <div class="actions">
          <button class="tool-button" id="run-tool" type="button">Run Tool</button>
          <button class="tool-button" id="copy-output" type="button">Copy</button>
          <button class="tool-button" id="download-output" type="button">Download</button>
          <button class="tool-button" id="clear-tool" type="button">Clear</button>
        </div>
      </div>
      <div class="tool-panel">
        <h2>Output</h2>
        ${outputMarkup}
      </div>
    </section>
    <p class="privacy-note">Privacy note: this tool is designed to run in your browser. Avoid pasting secrets you do not need to process.</p>
    <h2 class="section-title">Related Tools</h2>
    <section class="related-grid">${relatedTools(tool)}</section>
  `);
}

function setError(message = "") {
  document.querySelector("#tool-error").textContent = message;
}

function output() {
  return document.querySelector("#tool-output");
}

function setOutput(value) {
  const target = output();
  if (target) target.textContent = value;
}

function wireCommon({ run, clear, downloadName = "roosters-nest-output.txt" }) {
  document.querySelector("#run-tool").addEventListener("click", () => run().catch((error) => setError(error.message)));
  document.querySelector("#clear-tool").addEventListener("click", () => {
    setError("");
    document.querySelectorAll("textarea, input").forEach((field) => {
      if (!["checkbox", "range", "number"].includes(field.type)) field.value = "";
    });
    setOutput("");
    clear?.();
  });
  document.querySelector("#copy-output").addEventListener("click", async () => {
    const text = output()?.textContent || "";
    if (!text) return setError("Nothing to copy yet.");
    await navigator.clipboard.writeText(text);
    setError("Copied.");
  });
  document.querySelector("#download-output").addEventListener("click", () => {
    const text = output()?.textContent || "";
    if (!text) return setError("Nothing to download yet.");
    downloadBlob(new Blob([text], { type: "text/plain" }), downloadName);
  });
}

function replaceDownloadHandler(handler) {
  const oldButton = document.querySelector("#download-output");
  const newButton = oldButton.cloneNode(true);
  oldButton.replaceWith(newButton);
  newButton.addEventListener("click", handler);
}

function isIosSafari() {
  const ua = navigator.userAgent || "";
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return iOS && /Safari/i.test(ua) && !/(CriOS|FxiOS|EdgiOS|OPiOS)/i.test(ua);
}

function openBlobForIos(blob, message) {
  const url = URL.createObjectURL(blob);
  const opened = window.open(url, "_blank", "noopener");
  if (!opened) window.location.href = url;
  setError(message || "Opened in a new tab. Use Share or Save from Safari.");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function downloadBlob(blob, filename, iosMessage = "") {
  if (isIosSafari()) {
    openBlobForIos(blob, iosMessage);
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function inputText(label = "Text") {
  return `<label for="tool-input">${label}</label><textarea id="tool-input" placeholder="Paste or type here"></textarea>`;
}

function canvasToBlob(canvas, type = "image/png", quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

async function fileToDrawable(file) {
  if (!file) throw new Error("Choose an image first.");
  const inferredType = file.type || imageTypeFromName(file.name);
  if (!inferredType.startsWith("image/")) throw new Error("Choose a supported image file.");

  if ("createImageBitmap" in window) {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        image: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => bitmap.close?.()
      };
    } catch {
      // Fall back to an HTMLImageElement for browsers/files that reject ImageBitmap.
    }
  }

  const url = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";
  image.src = url;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = () => reject(new Error("The source image cannot be decoded by this browser."));
  });

  return {
    image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    cleanup: () => URL.revokeObjectURL(url)
  };
}

const pdfImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

async function makeImagePdf(files) {
  if (!files.length) throw new Error("Choose at least one image.");
  const pdfDoc = await PDFDocument.create();
  for (const file of files) {
    const image = await embedPdfImage(pdfDoc, file);
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  return new Blob([await pdfDoc.save()], { type: "application/pdf" });
}

async function embedPdfImage(pdfDoc, file) {
  const type = file.type || imageTypeFromName(file.name);
  if (!pdfImageTypes.has(type)) {
    throw new Error(`${file.name} is not supported. Use JPG, PNG, WebP, or AVIF.`);
  }
  const bytes = await file.arrayBuffer();
  if (type === "image/jpeg") {
    try {
      return await pdfDoc.embedJpg(bytes);
    } catch {
      return pdfDoc.embedPng(await convertImageToPngBytes(file));
    }
  }
  if (type === "image/png") {
    try {
      return await pdfDoc.embedPng(bytes);
    } catch {
      return pdfDoc.embedPng(await convertImageToPngBytes(file));
    }
  }
  return pdfDoc.embedPng(await convertImageToPngBytes(file));
}

function imageTypeFromName(name) {
  if (/\.jpe?g$/i.test(name)) return "image/jpeg";
  if (/\.png$/i.test(name)) return "image/png";
  if (/\.webp$/i.test(name)) return "image/webp";
  if (/\.avif$/i.test(name)) return "image/avif";
  return "";
}

async function convertImageToPngBytes(file) {
  let decoded;
  try {
    decoded = await fileToDrawable(file);
  } catch {
    throw new Error(`${file.name} could not be decoded by this browser.`);
  }
  const canvas = document.createElement("canvas");
  canvas.width = decoded.width;
  canvas.height = decoded.height;
  canvas.getContext("2d").drawImage(decoded.image, 0, 0);
  decoded.cleanup();
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error(`${file.name} could not be converted for PDF output.`);
  return blob.arrayBuffer();
}

function renderPdfWorkbench(tool) {
  pageShell(`
    <section class="tool-header">
      <p class="kicker">${tool.category}</p>
      <h1>${tool.title}</h1>
      <p class="tagline">${tool.description}</p>
    </section>
    <section class="pdf-workbench" id="pdf-workbench" aria-label="PDF Workbench">
      <aside class="pdf-page-rail" id="pdf-page-rail" aria-label="PDF pages"></aside>
      <section class="pdf-main-panel">
        <div class="pdf-toolbar" aria-label="PDF tools">
          <label class="pdf-upload" for="pdf-file-input">Open PDF<input id="pdf-file-input" type="file" accept="application/pdf,.pdf"></label>
          <button class="tool-button" id="pdf-tool-text" type="button" data-pdf-tool="text">Text</button>
          <button class="tool-button" id="pdf-tool-highlight" type="button" data-pdf-tool="highlight">Highlight</button>
          <button class="tool-button" id="pdf-tool-pen" type="button" data-pdf-tool="pen">Pen</button>
          <div class="pdf-pen-colors" aria-label="Pen colors">
            <button class="pdf-color-swatch is-red" type="button" data-pen-color="red" aria-label="Red pen"></button>
            <button class="pdf-color-swatch is-black" type="button" data-pen-color="black" aria-label="Black pen"></button>
            <button class="pdf-color-swatch is-blue" type="button" data-pen-color="blue" aria-label="Blue pen"></button>
          </div>
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
          <button class="tool-button" id="pdf-undo-annotation" type="button">Undo</button>
          <button class="tool-button" id="pdf-clear-page" type="button">Clear Page</button>
          <button class="tool-button pdf-rail-toggle" id="pdf-toggle-rail" type="button" aria-pressed="false">Hide Pages</button>
        </div>
        <p id="tool-error" class="error" role="status"></p>
        <div class="pdf-viewer-stage" id="pdf-viewer-stage">
          <canvas id="pdf-canvas"></canvas>
          <div id="pdf-annotation-layer" class="pdf-annotation-layer" aria-label="PDF annotation layer">
            <div id="pdf-text-guide" class="pdf-text-guide" hidden></div>
          </div>
          <div class="pdf-empty-state" id="pdf-empty-state">Open a PDF to start viewing and marking it up.</div>
        </div>
      </section>
    </section>
    <p class="privacy-note">Privacy note: PDFs stay in your browser. This tool does not upload or store your files on MR.com.</p>
    <h2 class="section-title">Related Tools</h2>
    <section class="related-grid">${relatedTools(tool)}</section>
  `);
}

const TEXT_ANNOTATION_BASELINE_OFFSET = 1;
const TEXT_GUIDE_WIDTH = 260;
const PDF_PEN_COLORS = {
  red: { css: "#b3352d", pdf: [0.7, 0.18, 0.14] },
  black: { css: "#111111", pdf: [0.07, 0.07, 0.07] },
  blue: { css: "#1d4ed8", pdf: [0.11, 0.31, 0.85] }
};

const pdfState = {
  bytes: null,
  pdf: null,
  currentPage: 1,
  scale: 1,
  activeTool: "text",
  penColor: "red",
  pages: [],
  annotations: new Map(),
  history: [],
  pageRailCollapsed: false,
  drawing: null,
  renderToken: 0
};

function currentPdfPageState() {
  return pdfState.pages[pdfState.currentPage - 1];
}

function annotationList(pageNumber = pdfState.currentPage) {
  if (!pdfState.annotations.has(pageNumber)) {
    pdfState.annotations.set(pageNumber, []);
  }
  return pdfState.annotations.get(pageNumber);
}

function availablePageNumbers() {
  return pdfState.pages
    .filter((page) => !page.deleted)
    .map((page) => page.number);
}

function normalizePoint(event, layer) {
  // Store normalized page coordinates so annotations survive zoom and canvas size changes.
  const rect = layer.getBoundingClientRect();
  return {
    x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
    y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
  };
}

function setActivePdfTool(tool) {
  pdfState.activeTool = tool;
  document.querySelectorAll("[data-pdf-tool]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.pdfTool === tool);
  });
  updatePdfTextGuideVisibility();
}

function setPdfPenColor(color) {
  if (!PDF_PEN_COLORS[color]) return;
  pdfState.penColor = color;
  document.querySelectorAll("[data-pen-color]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.penColor === color);
  });
}

function recordPdfHistory(entry) {
  pdfState.history.push(entry);
  if (pdfState.history.length > 100) pdfState.history.shift();
  updatePdfEditingControls();
}

function setPdfRailCollapsed(collapsed) {
  pdfState.pageRailCollapsed = collapsed;
  document.querySelector("#pdf-workbench")?.classList.toggle("is-rail-collapsed", collapsed);
  const toggle = document.querySelector("#pdf-toggle-rail");
  if (toggle) {
    toggle.setAttribute("aria-pressed", collapsed ? "true" : "false");
    toggle.textContent = collapsed ? "Show Pages" : "Hide Pages";
  }
}

function togglePdfPageRail() {
  setPdfRailCollapsed(!pdfState.pageRailCollapsed);
}

function updatePdfEditingControls() {
  const undoButton = document.querySelector("#pdf-undo-annotation");
  const clearButton = document.querySelector("#pdf-clear-page");
  if (undoButton) undoButton.disabled = !pdfState.pdf || pdfState.history.length === 0;
  if (clearButton) clearButton.disabled = !pdfState.pdf || annotationList().length === 0;
  setPdfRailCollapsed(pdfState.pageRailCollapsed);
}

function updatePdfStatus() {
  const status = document.querySelector("#pdf-page-status");
  if (!pdfState.pdf) {
    status.textContent = "No PDF loaded";
    return;
  }

  const visible = availablePageNumbers();
  status.textContent = `Page ${pdfState.currentPage} of ${pdfState.pages.length} | ${visible.length} kept`;
}

function renderPageRail() {
  const rail = document.querySelector("#pdf-page-rail");
  if (!pdfState.pdf) {
    rail.innerHTML = `<p class="pdf-rail-empty">Open a PDF to see pages.</p>`;
    return;
  }

  rail.innerHTML = pdfState.pages.map((page) => `
    <button class="pdf-page-thumb ${page.number === pdfState.currentPage ? "is-current" : ""} ${page.deleted ? "is-deleted" : ""}" type="button" data-page="${page.number}">
      <span>Page ${page.number}</span>
      <small>${page.deleted ? "Deleted" : `${page.rotation} deg`}</small>
    </button>
  `).join("");

  rail.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextPage = Number(button.dataset.page);
      if (pdfState.pages[nextPage - 1]?.deleted) return;
      pdfState.currentPage = nextPage;
      renderPdfPage().catch((error) => setError(error.message));
    });
  });
}

function renderPdfAnnotations() {
  const layer = document.querySelector("#pdf-annotation-layer");
  const textGuide = document.querySelector("#pdf-text-guide");
  layer.replaceChildren();
  if (textGuide) layer.append(textGuide);
  const annotations = [...annotationList()];
  const draft = currentDraftPdfAnnotation();
  if (draft) annotations.push(draft);

  for (const annotation of annotations) {
    if (annotation.type === "text") renderTextPdfAnnotation(layer, annotation);
    if (annotation.type === "highlight") renderHighlightPdfAnnotation(layer, annotation);
    if (annotation.type === "pen") renderPenPdfAnnotation(layer, annotation);
  }
}

function showPdfTextGuide(point) {
  const guide = document.querySelector("#pdf-text-guide");
  if (!guide || !pdfState.pdf || pdfState.activeTool !== "text") return;
  const left = Math.min(1, Math.max(0, point.x));
  const top = Math.min(1, Math.max(0, point.y));
  guide.style.left = `min(${left * 100}%, calc(100% - ${TEXT_GUIDE_WIDTH}px))`;
  guide.style.top = `${top * 100}%`;
  guide.hidden = false;
}

function hidePdfTextGuide() {
  const guide = document.querySelector("#pdf-text-guide");
  if (guide) guide.hidden = true;
}

function updatePdfTextGuideVisibility() {
  const layer = document.querySelector("#pdf-annotation-layer");
  if (!layer) return;
  layer.classList.toggle("is-text-mode", pdfState.pdf && pdfState.activeTool === "text");
  if (!pdfState.pdf || pdfState.activeTool !== "text") hidePdfTextGuide();
}

function currentDraftPdfAnnotation() {
  if (!pdfState.drawing) return null;
  const drawing = pdfState.drawing;

  if (drawing.type === "highlight") {
    const x = Math.min(drawing.start.x, drawing.end.x);
    const y = Math.min(drawing.start.y, drawing.end.y);
    const width = Math.abs(drawing.end.x - drawing.start.x);
    const height = Math.abs(drawing.end.y - drawing.start.y);
    if (width <= 0 || height <= 0) return null;
    return { type: "highlight", x, y, width, height, draft: true };
  }

  if (drawing.type === "pen" && drawing.points.length > 1) {
    return { type: "pen", color: drawing.color, points: drawing.points, draft: true };
  }

  return null;
}

function placePdfAnnotation(element, annotation) {
  element.style.left = `${annotation.x * 100}%`;
  element.style.top = `${annotation.y * 100}%`;
  if ("width" in annotation) element.style.width = `${annotation.width * 100}%`;
  if ("height" in annotation) element.style.height = `${annotation.height * 100}%`;
}

function renderTextPdfAnnotation(layer, annotation) {
  const element = document.createElement("div");
  element.className = "pdf-annotation pdf-annotation-text";
  element.textContent = annotation.text;
  placePdfAnnotation(element, annotation);
  layer.append(element);
}

function renderHighlightPdfAnnotation(layer, annotation) {
  const element = document.createElement("div");
  element.className = `pdf-annotation pdf-annotation-highlight${annotation.draft ? " is-draft" : ""}`;
  placePdfAnnotation(element, annotation);
  layer.append(element);
}

function renderPenPdfAnnotation(layer, annotation) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("pdf-annotation", "pdf-annotation-pen");
  if (annotation.draft) svg.classList.add("is-draft");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");

  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  polyline.setAttribute("points", annotation.points.map((point) => `${point.x * 100},${point.y * 100}`).join(" "));
  polyline.style.stroke = PDF_PEN_COLORS[annotation.color || "red"].css;
  svg.append(polyline);
  layer.append(svg);
}

async function renderPdfPage() {
  if (!pdfState.pdf) return;

  const token = ++pdfState.renderToken;
  const pageState = currentPdfPageState();
  const page = await pdfState.pdf.getPage(pdfState.currentPage);
  const viewport = page.getViewport({ scale: pdfState.scale, rotation: pageState.rotation });
  const canvas = document.querySelector("#pdf-canvas");
  const context = canvas.getContext("2d");

  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;

  const emptyState = document.querySelector("#pdf-empty-state");
  emptyState.hidden = true;

  await page.render({ canvasContext: context, viewport }).promise;
  if (token !== pdfState.renderToken) return;

  const layer = document.querySelector("#pdf-annotation-layer");
  layer.style.width = `${viewport.width}px`;
  layer.style.height = `${viewport.height}px`;
  layer.hidden = false;
  renderPdfAnnotations();
  renderPageRail();
  updatePdfStatus();
  updatePdfEditingControls();
  updatePdfTextGuideVisibility();
}

async function openPdfFile(file) {
  if (!file) return;
  const type = file.type || "";
  if (type && type !== "application/pdf") {
    throw new Error("Choose a PDF file.");
  }

  const bytes = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
  pdfState.bytes = bytes;
  pdfState.pdf = pdf;
  pdfState.currentPage = 1;
  pdfState.scale = 1;
  pdfState.pages = Array.from({ length: pdf.numPages }, (_, index) => ({
    number: index + 1,
    rotation: 0,
    deleted: false
  }));
  pdfState.annotations = new Map();
  pdfState.history = [];
  document.querySelector("#pdf-zoom").value = "100";
  setError(`Loaded ${file.name}`);
  await renderPdfPage();
  updatePdfTextGuideVisibility();
}

function movePdfPage(delta) {
  const visible = availablePageNumbers();
  if (!visible.length) return;
  const currentIndex = visible.indexOf(pdfState.currentPage);
  const nextIndex = Math.min(visible.length - 1, Math.max(0, currentIndex + delta));
  pdfState.currentPage = visible[nextIndex];
  renderPdfPage().catch((error) => setError(error.message));
}

function rotateCurrentPdfPage() {
  if (!pdfState.pdf) return setError("Open a PDF first.");
  const pageState = currentPdfPageState();
  const previousRotation = pageState.rotation;
  pageState.rotation = (pageState.rotation + 90) % 360;
  recordPdfHistory({ type: "rotate-page", pageNumber: pdfState.currentPage, rotation: previousRotation });
  renderPdfPage().catch((error) => setError(error.message));
}

function deleteCurrentPdfPage() {
  if (!pdfState.pdf) return setError("Open a PDF first.");
  const visible = availablePageNumbers();
  if (visible.length <= 1) return setError("Keep at least one page.");
  const deletedPageNumber = pdfState.currentPage;
  currentPdfPageState().deleted = true;
  recordPdfHistory({ type: "delete-page", pageNumber: deletedPageNumber });
  const nextVisible = availablePageNumbers();
  pdfState.currentPage = nextVisible.find((page) => page > pdfState.currentPage) || nextVisible.at(-1);
  renderPdfPage().catch((error) => setError(error.message));
}

function clearCurrentPdfPageAnnotations() {
  if (!pdfState.pdf) return setError("Open a PDF first.");
  const currentAnnotations = annotationList();
  if (!currentAnnotations.length) return setError("No marks on this page.");
  pdfState.annotations.set(pdfState.currentPage, []);
  recordPdfHistory({ type: "clear-page", pageNumber: pdfState.currentPage, annotations: [...currentAnnotations] });
  renderPdfAnnotations();
  updatePdfEditingControls();
  setError("Cleared marks on this page.");
}

function undoLastPdfAction() {
  if (!pdfState.pdf || !pdfState.history.length) return setError("Nothing to undo.");
  const action = pdfState.history.pop();

  if (action.type === "add-annotation") {
    annotationList(action.pageNumber).pop();
    pdfState.currentPage = action.pageNumber;
  }

  if (action.type === "clear-page") {
    pdfState.annotations.set(action.pageNumber, action.annotations);
    pdfState.currentPage = action.pageNumber;
  }

  if (action.type === "rotate-page") {
    pdfState.pages[action.pageNumber - 1].rotation = action.rotation;
    pdfState.currentPage = action.pageNumber;
  }

  if (action.type === "delete-page") {
    pdfState.pages[action.pageNumber - 1].deleted = false;
    pdfState.currentPage = action.pageNumber;
  }

  renderPdfPage().catch((error) => setError(error.message));
  setError("Undid last PDF change.");
}

function drawTextAnnotation(page, annotation, pageWidth, pageHeight) {
  page.drawText(annotation.text.slice(0, 160), {
    x: annotation.x * pageWidth,
    y: pageHeight - annotation.y * pageHeight + TEXT_ANNOTATION_BASELINE_OFFSET,
    size: 12,
    color: rgb(0.08, 0.1, 0.08),
    maxWidth: Math.max(80, pageWidth - annotation.x * pageWidth - 24)
  });
}

function drawHighlightAnnotation(page, annotation, pageWidth, pageHeight) {
  page.drawRectangle({
    x: annotation.x * pageWidth,
    y: pageHeight - (annotation.y + annotation.height) * pageHeight,
    width: annotation.width * pageWidth,
    height: annotation.height * pageHeight,
    color: rgb(1, 0.86, 0.2),
    opacity: 0.35
  });
}

function drawPenAnnotation(page, annotation, pageWidth, pageHeight) {
  const penColor = PDF_PEN_COLORS[annotation.color || "red"].pdf;
  for (let index = 1; index < annotation.points.length; index += 1) {
    const from = annotation.points[index - 1];
    const to = annotation.points[index];
    page.drawLine({
      start: { x: from.x * pageWidth, y: pageHeight - from.y * pageHeight },
      end: { x: to.x * pageWidth, y: pageHeight - to.y * pageHeight },
      thickness: 2,
      color: rgb(...penColor),
      opacity: 0.9
    });
  }
}

async function exportEditedPdf() {
  if (!pdfState.bytes) return setError("Open a PDF first.");
  const keptPages = pdfState.pages.filter((page) => !page.deleted);
  if (!keptPages.length) return setError("Keep at least one page.");

  const sourcePdf = await PDFDocument.load(pdfState.bytes);
  const nextPdf = await PDFDocument.create();
  const copiedPages = await nextPdf.copyPages(sourcePdf, keptPages.map((page) => page.number - 1));

  copiedPages.forEach((page, index) => {
    const pageState = keptPages[index];
    page.setRotation(degrees(pageState.rotation));
    const { width, height } = page.getSize();
    for (const annotation of annotationList(pageState.number)) {
      if (annotation.type === "text") drawTextAnnotation(page, annotation, width, height);
      if (annotation.type === "highlight") drawHighlightAnnotation(page, annotation, width, height);
      if (annotation.type === "pen") drawPenAnnotation(page, annotation, width, height);
    }
    nextPdf.addPage(page);
  });

  const bytes = await nextPdf.save();
  downloadBlob(new Blob([bytes], { type: "application/pdf" }), "edited.pdf");
  setError("Exported edited.pdf");
}

function commitPdfDrawing(event) {
  if (!pdfState.drawing) return;
  const layer = document.querySelector("#pdf-annotation-layer");
  if (event?.clientX != null) {
    const point = normalizePoint(event, layer);
    if (pdfState.drawing.type === "highlight") pdfState.drawing.end = point;
    if (pdfState.drawing.type === "pen") pdfState.drawing.points.push(point);
  }
  const drawing = pdfState.drawing;
  pdfState.drawing = null;
  let addedAnnotation = false;
  if (drawing.type === "highlight") {
    const x = Math.min(drawing.start.x, drawing.end.x);
    const y = Math.min(drawing.start.y, drawing.end.y);
    const width = Math.abs(drawing.end.x - drawing.start.x);
    const height = Math.abs(drawing.end.y - drawing.start.y);
    if (width > 0.01 && height > 0.01) {
      annotationList().push({ type: "highlight", x, y, width, height });
      addedAnnotation = true;
    }
  }
  if (drawing.type === "pen" && drawing.points.length > 1) {
    annotationList().push({ type: "pen", color: drawing.color, points: drawing.points });
    addedAnnotation = true;
  }
  if (addedAnnotation) recordPdfHistory({ type: "add-annotation", pageNumber: pdfState.currentPage });
  renderPdfAnnotations();
  updatePdfEditingControls();
}

function initPdfWorkbench() {
  setActivePdfTool("text");
  setPdfPenColor(pdfState.penColor);

  document.querySelector("#pdf-file-input").addEventListener("change", (event) => {
    openPdfFile(event.target.files[0]).catch((error) => setError(error.message));
  });
  document.querySelector("#pdf-prev-page").addEventListener("click", () => movePdfPage(-1));
  document.querySelector("#pdf-next-page").addEventListener("click", () => movePdfPage(1));
  document.querySelector("#pdf-toggle-rail").addEventListener("click", togglePdfPageRail);
  document.querySelector("#pdf-undo-annotation").addEventListener("click", undoLastPdfAction);
  document.querySelector("#pdf-clear-page").addEventListener("click", clearCurrentPdfPageAnnotations);
  document.querySelector("#pdf-zoom").addEventListener("input", (event) => {
    pdfState.scale = Number(event.target.value) / 100;
    renderPdfPage().catch((error) => setError(error.message));
  });
  document.querySelector("#pdf-rotate-page").addEventListener("click", rotateCurrentPdfPage);
  document.querySelector("#pdf-delete-page").addEventListener("click", deleteCurrentPdfPage);
  document.querySelector("#pdf-export").addEventListener("click", () => {
    exportEditedPdf().catch((error) => setError(error.message));
  });
  document.querySelectorAll("[data-pdf-tool]").forEach((button) => {
    button.addEventListener("click", () => setActivePdfTool(button.dataset.pdfTool));
  });
  document.querySelectorAll("[data-pen-color]").forEach((button) => {
    button.addEventListener("click", () => {
      setPdfPenColor(button.dataset.penColor);
      setActivePdfTool("pen");
    });
  });

  const layer = document.querySelector("#pdf-annotation-layer");
  layer.addEventListener("pointerenter", (event) => {
    if (!pdfState.pdf || pdfState.activeTool !== "text") return;
    showPdfTextGuide(normalizePoint(event, layer));
  });
  layer.addEventListener("pointerdown", (event) => {
    if (!pdfState.pdf) return setError("Open a PDF first.");
    const point = normalizePoint(event, layer);
    if (pdfState.activeTool === "text") {
      const text = window.prompt("Text note");
      if (text?.trim()) {
        annotationList().push({ type: "text", x: point.x, y: point.y, text: text.trim() });
        recordPdfHistory({ type: "add-annotation", pageNumber: pdfState.currentPage });
        renderPdfAnnotations();
        updatePdfEditingControls();
      }
      return;
    }

    layer.setPointerCapture(event.pointerId);
    pdfState.drawing = pdfState.activeTool === "highlight"
      ? { type: "highlight", start: point, end: point }
      : { type: "pen", color: pdfState.penColor, points: [point] };
  });
  layer.addEventListener("pointermove", (event) => {
    if (pdfState.activeTool === "text" && pdfState.pdf) showPdfTextGuide(normalizePoint(event, layer));
    if (!pdfState.drawing) return;
    const point = normalizePoint(event, layer);
    if (pdfState.drawing.type === "highlight") pdfState.drawing.end = point;
    if (pdfState.drawing.type === "pen") pdfState.drawing.points.push(point);
    renderPdfAnnotations();
  });
  layer.addEventListener("pointerup", commitPdfDrawing);
  layer.addEventListener("pointercancel", () => {
    pdfState.drawing = null;
    renderPdfAnnotations();
  });
  layer.addEventListener("pointerleave", hidePdfTextGuide);

  renderPageRail();
  updatePdfEditingControls();
  updatePdfTextGuideVisibility();
}

function initTool(tool) {
  if (tool.slug === "pdf") {
    renderPdfWorkbench(tool);
    initPdfWorkbench();
    return;
  }

  if (tool.slug === "qr-code-generator") {
    renderTool(tool, `
      ${inputText("Text or URL")}
      <div class="field-row">
        <label for="qrDownloadFormat">Download format</label>
        <select id="qrDownloadFormat">
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
        </select>
      </div>
    `, `<div id="tool-output" class="qr-output output-box"></div>`);
    wireCommon({
      run: async () => {
        setError("");
        const text = document.querySelector("#tool-input").value.trim();
        if (!text) throw new Error("Enter text or a URL first.");
        const canvas = document.createElement("canvas");
        await QRCode.toCanvas(canvas, text, {
          margin: 2,
          width: 512,
          color: {
            dark: "#000000ff",
            light: "#ffffffff"
          }
        });
        output().replaceChildren(canvas);
      },
      clear: () => { output().innerHTML = ""; },
      downloadName: "qr-code.png"
    });
    replaceDownloadHandler(async () => {
      const canvas = output().querySelector("canvas");
      if (!canvas) return setError("Generate a QR code first.");
      const format = document.querySelector("#qrDownloadFormat").value === "jpg" ? "jpg" : "png";
      const type = format === "jpg" ? "image/jpeg" : "image/png";
      const filename = format === "jpg" ? "qr-code.jpg" : "qr-code.png";
      const blob = await canvasToBlob(canvas, type, 0.94);
      if (!blob) return setError("Could not prepare that QR image.");
      downloadBlob(blob, filename, "Opened QR image in a new tab. Use Share or Save Image from Safari.");
    });
  } else if (tool.slug === "password-generator") {
    renderTool(tool, `
      <div class="field-row"><label for="length">Length</label><input id="length" type="number" min="8" max="128" value="24"></div>
      <div class="field-row inline"><label><input id="upper" type="checkbox" checked> Uppercase</label><label><input id="lower" type="checkbox" checked> Lowercase</label><label><input id="numbers" type="checkbox" checked> Numbers</label><label><input id="symbols" type="checkbox" checked> Symbols</label></div>
    `);
    wireCommon({ run: async () => setOutput(generatePassword({
      length: Number(document.querySelector("#length").value),
      upper: document.querySelector("#upper").checked,
      lower: document.querySelector("#lower").checked,
      numbers: document.querySelector("#numbers").checked,
      symbols: document.querySelector("#symbols").checked
    })) });
  } else if (tool.slug === "uuid-generator") {
    renderTool(tool, `<div class="field-row"><label for="count">How many?</label><input id="count" type="number" min="1" max="100" value="5"></div>`);
    wireCommon({ run: async () => setOutput(Array.from({ length: Math.min(100, Number(document.querySelector("#count").value) || 1) }, uuidv4).join("\n")) });
  } else if (tool.slug === "sha256-hash-generator") {
    renderTool(tool, inputText());
    wireCommon({ run: async () => setOutput(await sha256(document.querySelector("#tool-input").value)) });
  } else if (tool.slug === "base64-encode-decode") {
    renderTool(tool, `${inputText()}<div class="field-row"><label for="mode">Mode</label><select id="mode"><option value="encode">Encode</option><option value="decode">Decode</option></select></div>`);
    wireCommon({ run: async () => setOutput(document.querySelector("#mode").value === "encode" ? base64Encode(document.querySelector("#tool-input").value) : base64Decode(document.querySelector("#tool-input").value)) });
  } else if (tool.slug === "json-formatter") {
    renderTool(tool, `${inputText("JSON")}<div class="field-row"><label for="mode">Mode</label><select id="mode"><option value="format">Format</option><option value="minify">Minify</option></select></div>`);
    wireCommon({ run: async () => setOutput(document.querySelector("#mode").value === "format" ? formatJson(document.querySelector("#tool-input").value) : minifyJson(document.querySelector("#tool-input").value)), downloadName: "formatted.json" });
  } else if (tool.slug === "word-counter") {
    renderTool(tool, inputText());
    wireCommon({ run: async () => setOutput(JSON.stringify(countWords(document.querySelector("#tool-input").value), null, 2)) });
  } else if (tool.slug === "unit-converter") {
    renderTool(tool, `
      <div class="field-row"><label for="amount">Amount</label><input id="amount" type="number" value="1"></div>
      <div class="field-row inline"><div><label for="kind">Type</label><select id="kind"><option value="length">Length</option><option value="weight">Weight</option><option value="temperature">Temperature</option></select></div><div><label for="from">From</label><select id="from"></select></div><div><label for="to">To</label><select id="to"></select></div></div>
    `);
    const units = { length: ["meter","kilometer","centimeter","inch","foot","yard","mile"], weight: ["gram","kilogram","ounce","pound"], temperature: ["celsius","fahrenheit","kelvin"] };
    const fill = () => {
      const kindField = document.querySelector("#kind");
      const fromField = document.querySelector("#from");
      const toField = document.querySelector("#to");
      fromField.innerHTML = units[kindField.value].map((u) => `<option>${u}</option>`).join("");
      toField.innerHTML = fromField.innerHTML;
      toField.selectedIndex = 1;
    };
    document.querySelector("#kind").addEventListener("change", fill);
    fill();
    wireCommon({ run: async () => setOutput(String(convertUnit(document.querySelector("#amount").value, document.querySelector("#from").value, document.querySelector("#to").value, document.querySelector("#kind").value))) });
  } else if (tool.slug === "image-resize") {
    renderTool(tool, `<div class="field-row"><label for="image-file">Image</label><input id="image-file" type="file" accept="image/*"></div><div class="field-row inline"><div><label for="width">Width</label><input id="width" type="number" min="1" value="1200"></div><div><label for="height">Height</label><input id="height" type="number" min="1" value="800"></div></div>`, `<div id="tool-output" class="output-box image-preview-box"></div>`);
    let resizedBlob = null;
    let previewUrl = "";
    wireCommon({ run: async () => {
      const file = document.querySelector("#image-file").files[0]; if (!file) throw new Error("Choose an image first.");
      const width = Number(document.querySelector("#width").value);
      const height = Number(document.querySelector("#height").value);
      if (!Number.isFinite(width) || width < 1 || !Number.isFinite(height) || height < 1) throw new Error("Enter a valid width and height.");
      const decoded = await fileToDrawable(file);
      const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(decoded.image, 0, 0, canvas.width, canvas.height); decoded.cleanup();
      resizedBlob = await canvasToBlob(canvas, "image/png");
      if (!resizedBlob) throw new Error("The resized image could not be prepared.");
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = URL.createObjectURL(resizedBlob);
      output().innerHTML = `<div class="image-preview-frame"><img class="preview-image" src="${previewUrl}" alt="Resized preview"></div>`;
    }, clear: () => {
      resizedBlob = null;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = "";
      output().innerHTML = "";
    } });
    replaceDownloadHandler(() => {
      if (!resizedBlob) return setError("Resize an image first.");
      downloadBlob(resizedBlob, "resized-image.png", "Opened resized image in a new tab. Use Share or Save Image from Safari.");
    });
  } else if (tool.slug === "jpg-to-pdf") {
    renderTool(tool, `<div class="field-row"><label for="jpg-files">Image files</label><input id="jpg-files" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple></div>`);
    let pdfBlob = null;
    wireCommon({ run: async () => {
      const files = [...document.querySelector("#jpg-files").files];
      pdfBlob = await makeImagePdf(files);
      setOutput(`PDF ready: ${files.length} image(s).`);
    }, clear: () => { pdfBlob = null; }, downloadName: "images.pdf" });
    replaceDownloadHandler(() => pdfBlob ? downloadBlob(pdfBlob, "images.pdf") : setError("Create the PDF first."));
  }
}

if (slug) {
  const tool = tools.find((item) => item.slug === slug);
  if (tool) initTool(tool);
  else renderLanding();
} else {
  renderLanding();
}
