import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tools, categories } from "../src/tools/tools-data.js";

const landing = await readFile(new URL("../tools/index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const headers = await readFile(new URL("../public/_headers", import.meta.url), "utf8");
const runtime = await readFile(new URL("../src/tools/main.js", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/tools/styles.css", import.meta.url), "utf8");

assert.equal(tools.length, 11, "Toolbox should include 11 tools after adding PDF Workbench");
assert.equal(categories.length, 9, "Toolbox should include 9 requested categories");
assert.equal(tools[0].slug, "pdf", "PDF Workbench should be the first tool tile");
assert.equal(tools[1].slug, "jpg-to-pdf", "Image to PDF should be the second tool tile");
assert.equal(tools[2].slug, "image-resize", "Image Resize should be the third tool tile");
assert.ok(landing.includes("Rooster's Nest"), "landing should use Rooster's Nest branding");
assert.ok(landing.includes("No Login Toolbox"), "landing should include subtitle");
assert.ok(app.includes('href: "/tools/"'), "main site should link to /tools/");
assert.ok(headers.includes("/tools/*"), "headers should include /tools cache rule");
assert.ok(runtime.includes("Privacy note"), "ToolLayout should include privacy note");
assert.ok(runtime.includes("Related Tools"), "ToolLayout should include related tools");
assert.ok(runtime.includes("All Tools"), "landing should use a simple All Tools section");
assert.ok(!runtime.includes("policy-strip"), "landing should not repeat no-login promises in a badge strip");
assert.ok(!runtime.includes("No accounts"), "landing should not repeat account/no-login copy in badges");
assert.ok(!runtime.includes("Tool Categories"), "landing should not show the category grid");
assert.ok(!runtime.includes("Featured Tools"), "landing should not show the featured grid");
assert.ok(!runtime.includes("All Phase 1 Tools"), "landing should not expose phase language");
assert.ok(runtime.includes("PDFDocument"), "Image to PDF should use a real PDF document writer");
assert.ok(runtime.includes("image/webp"), "Image to PDF should accept modern web image formats");
assert.ok(runtime.includes("image/avif"), "Image to PDF should accept AVIF images when the browser can decode them");
assert.ok(runtime.includes("createImageBitmap"), "image tools should use robust browser image decoding");
assert.ok(runtime.includes("image.onload"), "image tools should fall back when ImageBitmap decoding fails");
assert.ok(runtime.includes("isIosSafari"), "image downloads should handle iOS Safari");
assert.ok(runtime.includes("window.open"), "iOS Safari downloads should open the generated image for saving");
assert.ok(runtime.includes("Opened resized image in a new tab"), "iOS Safari users should get save guidance");
assert.ok(runtime.includes("image-preview-box"), "Image Resize should use a dedicated preview frame");
assert.ok(runtime.includes("image-preview-frame"), "Image Resize should wrap previews in a fitted frame");
assert.ok(styles.includes(".image-preview-box"), "image preview frame should be styled");
assert.ok(styles.includes(".image-preview-frame"), "image preview inner frame should be styled");
assert.ok(styles.includes("object-fit:contain"), "preview images should be contained, not clipped");
assert.ok(!runtime.includes("await image.decode()"), "image tools should not rely only on image.decode()");
assert.ok(!runtime.includes("buildPdf("), "Image to PDF should not rely on the old manual PDF byte builder");
assert.ok(runtime.includes("qrDownloadFormat"), "QR Code Generator should expose an image format selector");
assert.ok(runtime.includes("QRCode.toCanvas"), "QR Code Generator should render to canvas for PNG/JPG downloads");
assert.ok(runtime.includes("image/png"), "QR Code Generator should support PNG downloads");
assert.ok(runtime.includes("image/jpeg"), "QR Code Generator should support JPG downloads");
assert.ok(runtime.includes("qr-code.png"), "QR Code Generator should download PNG files by default");
assert.ok(runtime.includes("qr-code.jpg"), "QR Code Generator should download JPG files when selected");
assert.ok(!runtime.includes("qr-code.svg"), "QR Code Generator should not download SVG files");

for (const tool of tools) {
  const page = new URL(`../tools/${tool.slug}/index.html`, import.meta.url);
  assert.ok(existsSync(page), `${tool.slug} page should exist`);
  const source = await readFile(page, "utf8");
  assert.ok(source.includes(`data-tool-slug="${tool.slug}"`), `${tool.slug} should declare its slug`);
  assert.ok(source.includes("<meta name=\"description\""), `${tool.slug} should include metadata`);
  assert.ok(source.includes("<link rel=\"canonical\""), `${tool.slug} should include canonical link`);
}

const toolboxText = [
  landing,
  runtime,
  await readFile(new URL("../src/tools/tools-data.js", import.meta.url), "utf8")
].join("\n").toLowerCase();

for (const forbidden of ["church", "bible", "scripture"]) {
  assert.ok(!toolboxText.includes(forbidden), `toolbox should not include ${forbidden} content`);
}
