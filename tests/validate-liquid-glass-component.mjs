import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../public/liquid-glass/liquid-glass.css", import.meta.url), "utf8");
const js = await readFile(new URL("../public/liquid-glass/liquid-glass.js", import.meta.url), "utf8");
const headers = await readFile(new URL("../public/_headers", import.meta.url), "utf8");
const index = await readFile(new URL("../about/index.html", import.meta.url), "utf8");
const galleryHome = await readFile(new URL("../index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const assetVersion = "?v=20260607-glass-standard-4";
const nonHomepagePages = [
  "public/apps/apostles/index.html",
  "public/apps/apostles/new-testament-trail.html",
  "public/apps/fps-visualizer/index.html",
  "public/apps/recipes/index.html",
  "public/apps/quotetron/index.html",
  "public/apps/quotetron/about.html",
  "public/apps/quotetron/contact.html",
  "public/apps/quotetron/privacy.html",
];

for (const token of [
  ".mr-liquid-glass",
  ".site-liquid-glass-stage",
  ".mr-liquid-glass__source",
  ".mr-liquid-glass__refract",
  ".mr-liquid-glass__scene",
  ".mr-liquid-glass__replica",
  ".mr-liquid-glass__refract {\n  position: absolute;\n  inset: 0;\n  filter: url(\"#mr-liquid-glass-filter\")",
  ".mr-liquid-glass__replica .topbar",
  "position: static",
  "border-radius: inherit",
  "@media (prefers-reduced-motion: reduce)",
]) {
  assert.ok(css.includes(token), `liquid-glass.css should include ${token}`);
}

for (const token of [
  "MRLiquidGlass",
  "generateDisplacementMap",
  "feDisplacementMap",
  "filter.setAttribute(\"x\", \"0\")",
  "filter.setAttribute(\"y\", \"0\")",
  "filter.setAttribute(\"width\", \"100%\")",
  "filter.setAttribute(\"height\", \"100%\")",
  "localStorage",
  "MutationObserver",
  "cloneNode(true)",
  "classList.add(\"mr-liquid-glass__replica\")",
  "removeAttribute(\"data-liquid-glass-scene\")",
  "proofPreset",
  "savePreset",
]) {
  assert.ok(js.includes(token), `liquid-glass.js should include ${token}`);
}

for (const token of [
  "/liquid-glass/*",
  "Cache-Control: no-store, max-age=0",
]) {
  assert.ok(headers.includes(token), `headers should include homepage Liquid Glass cache token: ${token}`);
}
assert.ok(
  headers.includes("Cache-Control: no-cache, max-age=0, must-revalidate"),
  "headers should force fresh app shell validation",
);
assert.ok(!headers.includes("/apps/liquid-glass-demo/*"), "headers should not expose the retired Liquid Glass demo route");

for (const token of [
  `/liquid-glass/liquid-glass.css${assetVersion}`,
  `/liquid-glass/liquid-glass.js${assetVersion}`,
]) {
  assert.ok(index.includes(token), `secondary page shell should load shared liquid glass asset: ${token}`);
  assert.ok(!galleryHome.includes(token), `gallery home should not load secondary page glass asset: ${token}`);
}

for (const token of [
  "site-liquid-glass-stage",
  "data-liquid-glass-stage",
  "data-liquid-glass-scene",
  "data-liquid-glass-lens",
  "site-glass-pointer",
  "aria-hidden=\"true\"",
]) {
  assert.ok(app.includes(token), `homepage global liquid glass should include ${token}`);
}

for (const token of [
  ".site-liquid-glass-stage .mr-liquid-glass__scene",
  "position: fixed",
  ".site-liquid-glass-stage .mr-liquid-glass",
  "--mrlg-width: 56px",
  "--mrlg-height: 56px",
  "border-radius: 999px",
]) {
  assert.ok(css.includes(token), `shared global bubble should include ${token}`);
}

assert.ok(!app.includes("app-launcher-liquid-stage"), "homepage glass should not be locked to the app launcher");
assert.ok(!app.includes("data-liquid-glass-visual-only"), "homepage glass should keep real refraction");

for (const pagePath of nonHomepagePages) {
  const html = await readFile(new URL(`../${pagePath}`, import.meta.url), "utf8");
  for (const token of [
    "site-liquid-glass-stage",
    "site-glass-pointer",
    "data-liquid-glass-stage",
    "data-liquid-glass-scene",
    "data-liquid-glass-lens",
    "/liquid-glass/liquid-glass.css",
    "/liquid-glass/liquid-glass.js",
  ]) {
    assert.ok(!html.includes(token), `${pagePath} should not include non-homepage Liquid Glass token: ${token}`);
  }
}
