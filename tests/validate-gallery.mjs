import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const galleryHtml = await readFile(new URL("../apps/gallery/index.html", import.meta.url), "utf8");
const rootHtml = await readFile(new URL("../index.html", import.meta.url), "utf8");
const aboutHtml = await readFile(new URL("../about/index.html", import.meta.url), "utf8");
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
  "depth-mode-toggle",
  "Dive Deeper",
  "modal-prev",
  "modal-next",
  "Previous archive image",
  "Next archive image",
  "Sound On",
  "autoplay",
  "inert"
]) {
  assert.ok(galleryHtml.includes(token), `gallery HTML should include ${token}`);
  assert.ok(rootHtml.includes(token), `root HTML should include gallery token ${token}`);
}

for (const token of [
  "sphere-gallery",
  "gallery-shell",
  "gallery-topbar",
  "/about/",
  "/about/#videos",
  "/about/#projects",
  "/about/#links"
]) {
  assert.ok(rootHtml.includes(token), `root page should be the gallery home and include ${token}`);
  assert.ok(galleryHtml.includes(token), `standalone gallery should include ${token}`);
}

for (const token of [
  "/src/main.jsx",
  "/liquid-glass/liquid-glass.css",
  "site-liquid-glass-stage",
  "gallery-launch-button",
  "mission-card"
]) {
  assert.ok(!rootHtml.includes(token), `root gallery home should not include secondary page token ${token}`);
}

for (const token of [
  "/src/main.jsx",
  "/liquid-glass/liquid-glass.css",
  "/liquid-glass/liquid-glass.js"
]) {
  assert.ok(aboutHtml.includes(token), `secondary page shell should include ${token}`);
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
  "const depthShellGroup = new THREE.Group()",
  "const depthShellMeshes = []",
  "const depthLayerItems = [",
  "isDepthMode",
  "enterDepthMode",
  "exitDepthMode",
  "toggleDepthMode",
  "const surfaceArchiveHome =",
  "const depthLayerHome =",
  "const surfaceArchiveDive =",
  "const depthLayerDive =",
  "applyArchiveDepthLayout",
  "createDepthLayerTexture",
  "openDepthLayerItem",
  "setDepthLayerMetadata",
  "isDepthLayerItem",
  "expanded.classList.toggle(\"is-media-only\", isDepthLayerItem(item))",
  "expandedTitle.textContent = isDepthLayerItem(item) ? \"\" : item.title",
  "depthModeToggle",
  "const galleryItems = archiveItems",
  "startTheme",
  "syncThemePlaybackState",
  "ensureThemePlayback",
  "themeAudio.addEventListener(\"pause\"",
  "themeAudio.addEventListener(\"playing\"",
  "themeAudio.addEventListener(\"stalled\"",
  "themeAudio.addEventListener(\"waiting\"",
  "ensureThemePlayback();",
  "modalPointers",
  "modalZoomState",
  "resetExpandedImageZoom",
  "applyExpandedImageZoom",
  "onExpandedPointerDown",
  "onExpandedPointerMove",
  "onExpandedPointerUp",
  "expandedImage.addEventListener(\"pointerdown\"",
  "expandedImage.addEventListener(\"pointermove\"",
  "expandedImage.addEventListener(\"pointerup\"",
  "expandedImage.addEventListener(\"lostpointercapture\"",
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
  "createDepthShell",
  "placeDepthShellCard",
  "const rings = 2",
  "ringIndex",
  "itemsPerRing",
  "depth-shell",
  "radius + 10",
  "interactive: true",
  "previewOpacity",
  "activeDepthLayerColor",
  "0xf8f9ed",
  "baseOpacity: 0.94",
  "isFeatured ? 1.12",
  "material.color.lerp",
  "previewScale",
  "mesh.visible = true",
  "depthShellMeshes.push(mesh)",
  "side: THREE.DoubleSide",
  "depthWrite: false",
  "depthShellGroup.rotation.y = currentYaw * 0.72",
  "camera.position",
  "sphereGroup.position.z",
  "z: 88",
  "scale: 4.8",
  "cameraZ: 16",
  "depthShellGroup.position.z",
  "z: 30",
  "scale: 2.05",
  "const previewScale = 0.7",
  "baseScale: 0.9",
  "0.08, travelProgress",
  "const textureState = makeCanvasTexture(item, index)",
  "textureState.texture",
  "document.documentElement.dataset.depthLayerItems = String(depthLayerItems.length)",
  "displayTitle",
  "cardMeshes, false",
  "depthShellMeshes, false",
  "/media/archive/second-layer/",
  "expanded.inert = false",
  "expanded.inert = true",
  "resetExpandedImageZoom();",
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
  "depthShellMeshes.push(mesh); cardMeshes.push(mesh)",
  "cardMeshes.push(mesh); depthShellMeshes.push(mesh)",
  "depthShellMeshes.push(...cardMeshes)",
  "cardMeshes.push(...depthShellMeshes)",
  "raycaster.intersectObjects([...cardMeshes, ...depthShellMeshes]",
  "focusRaycaster.intersectObjects([...cardMeshes, ...depthShellMeshes]",
  "depthShellGroup.add(label",
  "const activeCategory",
  "const activeMeta",
  "const expandedCategory",
  "activeCategory.textContent",
  "activeMeta.textContent",
  "expandedCategory.textContent",
  "FIELD ARCHIVE",
  "item.category.toUpperCase()",
  "formatArchiveLabel(item.collection",
  "formatArchiveLabel(item.collection || item.category)",
  "const dossierItems = [",
  "journalEntries",
  "createDossierTexture",
  "openDossier",
  "setDossierMetadata",
  "Dossier",
  "Journal Entry",
  "Linked Asset",
  "photoCount",
  "DOSSIER"
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
  ".expand-view.is-media-only .expand-card",
  ".expand-view.is-media-only .expand-card > div",
  ".expand-view.is-media-only .expand-card img",
  "#expanded-image",
  "touch-action: none",
  "transform-origin: center center",
  "will-change: transform",
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

const secondLayerAssets = [
  "img-1853c.jpg",
  "img-1951.jpg",
  "img-6931.jpg",
  "prepwork.jpg",
  "whohasmyfinger.jpg",
  "chatgpt-image-may-8-2026-05-50-48-pm.jpg",
  "chatgpt-image-may-8-2026-05-54-24-pm.jpg",
  "chatgpt-image-may-8-2026-10-42-41-am.jpg",
  "report.jpg",
  "img-7763.jpg",
  "img-8825.jpg",
  "img-9106.jpg",
  "img-9658.jpg",
  "jackbranch.jpg",
  "ohshit.jpg",
  "opfor.jpg",
  "owmytooth.jpg",
  "img-9066.jpg",
  "river-jax.jpg",
  "rooftop1.jpg",
  "savemebro.jpg",
  "img-9084.jpg",
  "smoke.jpg",
  "vce55-sv260220-007.jpg",
  "img-9072.jpg",
  "img-8702.jpg",
  "img-9088.jpg",
  "img-7003.jpg",
  "joker.jpg",
  "img-2433.jpg",
  "img-1742.jpg",
  "img-2965.jpg",
  "img-0679.jpg"
];

for (const asset of secondLayerAssets) {
  await stat(new URL(`../public/media/archive/second-layer/${asset}`, import.meta.url));
  assert.ok(gallerySource.includes(`/media/archive/second-layer/${asset}`), `gallery source should reference ${asset}`);
}

const depthLayerDeclarationIndex = gallerySource.indexOf("const depthLayerItems = [");
const depthLayerCreationIndex = gallerySource.indexOf("function createDepthLayerTexture");
assert.ok(depthLayerDeclarationIndex >= 0, "gallery source should declare second-layer image items");
assert.ok(depthLayerCreationIndex >= 0, "gallery source should render second-layer items with image frames");
assert.ok(
  depthLayerDeclarationIndex < depthLayerCreationIndex,
  "gallery source should declare second-layer image items before rendering them"
);
assert.equal(
  (gallerySource.match(/\/media\/archive\/second-layer\//g) || []).length,
  secondLayerAssets.length,
  "gallery source should reference each second-layer image exactly once"
);

assert.ok(homeSource.includes('href: "/"'), "secondary page nav should link back to the gallery home");
assert.ok(!homeSource.includes("gallery-launch-button"), "secondary page should not duplicate the gallery launch card");
assert.ok(!homeSource.includes('className="hero gallery-first-hero"'), "secondary page should not include the old draft homepage hero");
assert.ok(!homeSource.includes('className="hero-gallery-button gallery-launch-button"'), "secondary page should not include a second gallery hero CTA");
assert.ok(!homeSource.includes("Enter the Gallery"), "secondary page should not duplicate the main gallery entry");
assert.ok(!homeSource.includes("The gallery is the front door now"), "secondary page should not use placeholder hero tagline copy");
assert.ok(!homeSource.includes("Open the full photo wall and field archive."), "secondary page should not include explanatory gallery CTA microcopy");
assert.ok(!homeSource.includes("Extra photos are tucked deeper inside the gallery view."), "secondary page should not explain gallery mechanics");
assert.ok(!homeSource.includes("Field footage is still here, just lower on the page."), "secondary page should not describe page structure");
assert.ok(!homeSource.includes("The gallery is the main draw."), "secondary page copy should not read like implementation notes");
assert.ok(!homeSource.includes("<strong>Surface</strong>"), "secondary page should not use placeholder gallery card titles");
assert.ok(!homeSource.includes("<strong>Second Layer</strong>"), "secondary page should not use placeholder gallery card titles");
assert.ok(!homeSource.includes("<strong>Motion</strong>"), "secondary page should not use placeholder gallery card titles");
assert.ok(!homeSource.includes("<small>"), "secondary page should not include the old hero gallery CTA small text");
assert.ok(!homeSource.includes('<div className="mission-card"'), "secondary page should not show non-interactive explanatory cards");
assert.ok(!homeSource.includes('className="hero-actions"'), "secondary page should not use duplicate quick-action buttons");
assert.ok(!homeSource.includes('className="app-launcher-title"'), "secondary page should not duplicate the games and utilities launcher in a hero");
assert.ok(!homeSource.includes('className="app-launcher"'), "secondary page should not include the old hero app launcher grid");
assert.ok(!homeSource.includes("<h3>{video.title}</h3>"), "secondary page video cards should not show generic video labels");
assert.ok(homeSource.includes('<Section id="projects" eyebrow="Apps" title="Apps and Utilities">'), "secondary page projects section should still hold the app tiles");
assert.ok(!homeSource.includes("<Section id=\"photography\""), "old embedded photography gallery should be replaced");
assert.ok(viteConfig.includes("apps/gallery/index.html"), "Vite should build the gallery page");
assert.ok(viteConfig.includes("about/index.html"), "Vite should build the secondary page");
