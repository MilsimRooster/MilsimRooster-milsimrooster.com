import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const galleryHtml = await readFile(new URL("../apps/gallery/index.html", import.meta.url), "utf8");
const gallerySource = await readFile(new URL("../src/gallery/main.js", import.meta.url), "utf8");
const galleryData = await readFile(new URL("../src/gallery/archive-data.js", import.meta.url), "utf8");
const galleryStyles = await readFile(new URL("../src/gallery/styles.css", import.meta.url), "utf8");
const homeSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const viteConfig = await readFile(new URL("../vite.config.mjs", import.meta.url), "utf8");

for (const token of [
  "/src/gallery/main.js",
  "sphere-gallery",
  "/apps/gallery/assets/theme-gallery.wav",
  "expand-view",
  "expanded-meta",
  "archive-progress",
  "modal-prev",
  "modal-next",
  "Previous archive image",
  "Next archive image",
  "Sound On",
  "autoplay",
  "inert"
]) {
  assert.ok(galleryHtml.includes(token), `gallery HTML should include ${token}`);
}

for (const token of [
  "Inside The Field Archive",
  "Spherical Gallery",
  "gallery-controls",
  "filter-pill",
  "data-filter=",
  "expanded-caption",
  "active-category",
  "active-meta",
  "expanded-category",
  "Milsim Rooster field archive.",
  "Participants moving",
  "Participant operating",
  "People gathered",
  "Detail photo focused",
  "Vehicle or aircraft moment",
  "Low-light or night operation"
]) {
  assert.ok(!galleryHtml.includes(token), `gallery HTML should not include ${token}`);
}

for (const token of [
  "import gsap from \"gsap\"",
  "import * as THREE from \"three\"",
  "import { archiveItems, archiveStats } from \"./archive-data.js\"",
  "PerspectiveCamera",
  "Raycaster",
  "visual-data-trim-1",
  "const radius = 23",
  "const galleryItems = archiveItems",
  "startTheme",
  "visitedStorageKey",
  "markVisited",
  "updateProgressHud",
  "stepModal",
  "ArrowLeft",
  "ArrowRight",
  "Enter",
  "targetYaw += dx",
  "targetPitch += dy",
  "openItem",
  "setModalMetadata",
  "expanded.inert = false",
  "expanded.inert = true",
  "expandedMeta.replaceChildren",
  "item.archiveId",
  "/media/archive/milsim/"
]) {
  assert.ok(gallerySource.includes(token), `gallery source should include ${token}`);
}

for (const token of [
  "legacyGalleryItems",
  "applyFilter",
  "filterButtons",
  "/media/optimized/photography/events/",
  "/media/optimized/photography/portraits/",
  "item.tags || []",
  "expandedCaption",
  "item.caption",
  "expandedMeta.innerHTML",
  "const activeCategory",
  "const activeMeta",
  "const expandedCategory",
  "activeCategory.textContent",
  "activeMeta.textContent",
  "expandedCategory.textContent",
  "FIELD ARCHIVE",
  "item.category.toUpperCase()",
  "formatArchiveLabel(item.collection",
  "formatArchiveLabel(item.collection || item.category)"
]) {
  assert.ok(!gallerySource.includes(token), `gallery source should not include ${token}`);
}

for (const token of [
  "gallery-controls",
  "gallery-intro"
]) {
  assert.ok(!galleryStyles.includes(token), `gallery CSS should not include dead selector ${token}`);
}

for (const token of [
  "visual-data-trim-1",
  ".gallery-hud small",
  ".modal-nav",
  ".modal-prev",
  ".modal-next"
]) {
  assert.ok(galleryStyles.includes(token), `gallery CSS should include ${token}`);
}

for (const token of [
  "Participants moving through",
  "Participant operating in the field",
  "People gathered during",
  "Detail photo focused on",
  "Vehicle or aircraft moment captured",
  "Low-light or night operation moment"
]) {
  assert.ok(!galleryData.includes(token), `gallery data should not include generic caption: ${token}`);
}

assert.ok(galleryData.includes('"caption": ""'), "gallery data should keep captions blank for archive photos");

assert.ok(homeSource.includes("href: \"/apps/gallery/\""), "home nav should link to the standalone gallery");
assert.ok(homeSource.includes("className=\"gallery-launch-button\""), "home page should include the gallery launch button");
assert.ok(!homeSource.includes("<Section id=\"photography\""), "old embedded photography gallery should be replaced");
assert.ok(viteConfig.includes("apps/gallery/index.html"), "Vite should build the gallery page");
