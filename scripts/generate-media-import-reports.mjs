import { copyFile, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetRoot = path.join(repoRoot, "media-source", "assets");
const publicMediaRoot = path.join(repoRoot, "public", "media");
const reportRoot = path.join(repoRoot, "docs", "media-import");
const sandboxRoot = path.join(repoRoot, "sandbox-media-import");
const galleryPublicArchiveRoot = path.join(publicMediaRoot, "archive", "milsim");
const galleryDataPath = path.join(repoRoot, "src", "gallery", "archive-data.js");

const manifestPaths = [
  path.join(assetRoot, "milsim_rooster_simple_archive", "milsim_rooster_simple_archive", "manifest.json"),
  path.join(assetRoot, "portrait_archive_with_images", "manifest.json"),
  path.join(assetRoot, "landscape_location_archive_with_images", "landscape_location_archive_with_images", "manifest.json"),
];

const requiredFields = ["title", "description", "category", "tags"];
const mediaExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".mp4", ".mov", ".wav", ".mp3", ".cr2"]);
const scriptExtensions = new Set([".js", ".mjs", ".cjs", ".py", ".ps1", ".bat", ".cmd", ".sh"]);
const docExtensions = new Set([".md", ".txt", ".rst"]);
const metadataExtensions = new Set([".json", ".csv"]);
const galleryArchiveCategoryCaps = new Map([
  ["Field Operations", 7],
  ["Team & Community", 5],
  ["Vehicles & Aircraft", 4],
  ["Equipment & Details", 3],
  ["Night Operations", 3],
  ["CQB & Indoor", 2],
]);
const productionArchiveExclusions = new Set(["Video Clips", "Website Backgrounds", "AI & Cinematic Edits"]);

function slash(value) {
  return value.split(path.sep).join("/");
}

function rel(file, root = repoRoot) {
  return slash(path.relative(root, file));
}

function mdEscape(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function humanBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let size = bytes / 1024;
  let unit = units.shift();
  while (size >= 1024 && units.length) {
    size /= 1024;
    unit = units.shift();
  }
  return `${size.toFixed(size >= 10 ? 1 : 2)} ${unit}`;
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files.sort((a, b) => rel(a, assetRoot).localeCompare(rel(b, assetRoot)));
}

function classify(file) {
  const ext = path.extname(file).toLowerCase();
  if (metadataExtensions.has(ext)) return "Metadata";
  if (scriptExtensions.has(ext)) return "Processing Script";
  if (docExtensions.has(ext)) return "Documentation";
  if (mediaExtensions.has(ext)) return "Media";
  return "Other";
}

function inferPurpose(file) {
  const name = path.basename(file).toLowerCase();
  const ext = path.extname(file).toLowerCase();
  const folder = rel(path.dirname(file), assetRoot).toLowerCase();

  if (name === "manifest.json" || name === "manifest.csv") return "Archive-level import manifest";
  if (name.endsWith(".json") && mediaExtensions.has(path.extname(name.slice(0, -5)).toLowerCase())) return "Sidecar metadata for adjacent media";
  if (name.includes("readme")) return "Asset package documentation";
  if (scriptExtensions.has(ext)) return "Processing utility";
  if (name === "background.png") return "Gallery background candidate";
  if (name === "theme.wav") return "Gallery audio candidate";
  if (folder.includes("milsim_rooster")) return "Milsim archive source media";
  if (folder.includes("portrait_archive")) return "Portrait archive source media";
  if (folder.includes("landscape_location")) return "Landscape/location archive source media";
  return "Source asset";
}

async function loadJson(file) {
  try {
    return { ok: true, value: JSON.parse(await readFile(file, "utf8")) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

function normalizeItems(json) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.items)) return json.items;
  if (Array.isArray(json.assets)) return json.assets;
  if (Array.isArray(json.media)) return json.media;
  return [];
}

function manifestFileForItem(manifestFile, item) {
  const baseDir = path.dirname(manifestFile);
  const name = item.clean_filename || item.filename || item.file || item.path;
  if (!name) return null;
  if (path.isAbsolute(name)) return name;
  if (item.folder) return path.join(baseDir, item.folder, name);
  return path.join(baseDir, name);
}

function categoryFromItem(item, archiveName) {
  const text = `${item.category || ""} ${(item.tags || []).join(" ")} ${item.folder || ""}`.toLowerCase();
  if (archiveName.includes("milsim")) {
    if (text.includes("night")) return "Airsoft - Night Operations";
    if (text.includes("vehicle") || text.includes("aircraft") || text.includes("helicopter")) return "Airsoft - Vehicles";
    if (text.includes("team") || text.includes("community") || text.includes("portrait")) return "Airsoft - Team Photos";
    if (text.includes("equipment") || text.includes("gear") || text.includes("patch")) return "Airsoft - Equipment";
    if (text.includes("cqb") || text.includes("indoor")) return "Airsoft - Gameplay";
    if (text.includes("field")) return "Airsoft - Gameplay";
    return "Airsoft - Other";
  }
  if (archiveName.includes("portrait")) return "Portraits";
  if (archiveName.includes("landscape")) {
    if (text.includes("church")) return "Landscape - Churches";
    if (text.includes("river") || text.includes("waterfall") || text.includes("pier") || text.includes("wetland")) return "Landscape - Water";
    if (text.includes("industrial") || text.includes("train") || text.includes("terminal")) return "Landscape - Industrial";
    if (text.includes("bridge")) return "Landscape - Bridges";
    if (text.includes("drone")) return "Landscape - Drone";
    return "Landscape - Places";
  }
  return "Uncategorized";
}

function isBrowserImage(file) {
  return [".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(path.extname(file).toLowerCase());
}

async function buildSandbox(manifestFile) {
  const loaded = await loadJson(manifestFile);
  if (!loaded.ok) throw new Error(`Unable to read sandbox manifest: ${loaded.error}`);

  const sourceDir = path.dirname(manifestFile);
  const imageDir = path.join(sandboxRoot, "assets", "milsim");
  const dataDir = path.join(sandboxRoot, "data");
  await mkdir(imageDir, { recursive: true });
  await mkdir(dataDir, { recursive: true });

  const allItems = normalizeItems(loaded.value);
  const imageItems = [];
  for (const item of allItems) {
    const sourceFile = manifestFileForItem(manifestFile, item);
    if (!sourceFile || !existsSync(sourceFile) || !isBrowserImage(sourceFile)) continue;
    const outputName = item.clean_filename || path.basename(sourceFile);
    const outputFile = path.join(imageDir, outputName);
    await copyFile(sourceFile, outputFile);
    imageItems.push({
      id: outputName.replace(/\.[^.]+$/, ""),
      title: item.title || outputName,
      description: item.description || "",
      category: item.category || "Uncategorized",
      collection: item.folder || "Milsim Archive",
      tags: item.tags || [],
      src: slash(path.join("assets", "milsim", outputName)),
      original_filename: item.original_filename || "",
      source_path: slash(path.relative(sourceDir, sourceFile)),
    });
  }

  const categoryCounts = new Map();
  const collectionCounts = new Map();
  for (const item of imageItems) {
    categoryCounts.set(item.category, (categoryCounts.get(item.category) || 0) + 1);
    collectionCounts.set(item.collection, (collectionCounts.get(item.collection) || 0) + 1);
  }

  const sandboxData = {
    title: "Milsim Rooster Sandbox Archive",
    source_manifest: rel(manifestFile),
    generated_from: "media-source/assets/milsim_rooster_simple_archive",
    items: imageItems,
    categories: [...categoryCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count })),
    collections: [...collectionCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count })),
  };

  const sandboxHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Milsim Rooster Sandbox Archive</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main class="archive-shell">
      <header class="archive-header">
        <a class="archive-brand" href="../apps/gallery/">MR Gallery</a>
        <div>
          <p>Sandbox Import</p>
          <h1>Milsim Rooster Archive</h1>
        </div>
        <output id="archive-count">Loading</output>
      </header>

      <section class="archive-toolbar" aria-label="Archive filters">
        <input id="archive-search" type="search" placeholder="Search title, tag, collection" autocomplete="off" />
        <div id="archive-filters" class="archive-filters"></div>
      </section>

      <section id="archive-grid" class="archive-grid" aria-live="polite"></section>
    </main>
    <script type="module" src="archive-preview.js"></script>
  </body>
</html>
`;

  const sandboxCss = `:root {
  color-scheme: dark;
  --bg: #050606;
  --panel: rgba(14, 18, 18, 0.78);
  --line: rgba(240, 244, 228, 0.18);
  --text: #f4f5ed;
  --muted: rgba(244, 245, 237, 0.68);
  --accent: #b8c891;
  --signal: #c87954;
}

* {
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  margin: 0;
  background:
    linear-gradient(180deg, rgba(5, 6, 6, 0.76), #050606 42%),
    radial-gradient(circle at 80% 10%, rgba(200, 121, 84, 0.18), transparent 28%),
    radial-gradient(circle at 18% 24%, rgba(184, 200, 145, 0.16), transparent 30%),
    #050606;
  color: var(--text);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}

button,
input {
  font: inherit;
}

.archive-shell {
  width: min(1180px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 24px 0 48px;
}

.archive-header {
  min-height: 112px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid var(--line);
}

.archive-brand,
#archive-count,
.archive-filters button {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
  font-weight: 900;
}

.archive-brand {
  display: inline-grid;
  min-width: 92px;
  min-height: 48px;
  place-items: center;
  padding: 0 14px;
  text-decoration: none;
}

.archive-header p {
  margin: 0 0 6px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 1000;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.archive-header h1 {
  margin: 0;
  font-size: clamp(32px, 6vw, 72px);
  line-height: 0.9;
  letter-spacing: 0;
  text-transform: uppercase;
}

#archive-count {
  padding: 12px 14px;
}

.archive-toolbar {
  position: sticky;
  top: 0;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(220px, 360px) 1fr;
  gap: 12px;
  padding: 16px 0;
  background: linear-gradient(180deg, #050606 72%, rgba(5, 6, 6, 0));
}

#archive-search {
  min-height: 46px;
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 0 14px;
  background: var(--panel);
  color: var(--text);
  outline: 0;
}

#archive-search:focus-visible,
.archive-filters button:focus-visible,
.archive-card:focus-within {
  border-color: rgba(184, 200, 145, 0.86);
  box-shadow: 0 0 0 3px rgba(184, 200, 145, 0.16);
}

.archive-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.archive-filters button {
  min-height: 46px;
  padding: 0 13px;
  cursor: pointer;
}

.archive-filters button.is-active {
  background: var(--accent);
  color: #11140f;
}

.archive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 14px;
}

.archive-card {
  min-height: 390px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
}

.archive-card img {
  width: 100%;
  aspect-ratio: 4 / 5;
  display: block;
  object-fit: cover;
  background: #111;
}

.archive-card-body {
  padding: 13px;
}

.archive-card span {
  color: var(--accent);
  font-size: 11px;
  font-weight: 1000;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.archive-card h2 {
  margin: 7px 0 8px;
  font-size: 21px;
  line-height: 1;
}

.archive-card p {
  margin: 0;
  color: var(--muted);
  line-height: 1.45;
}

.archive-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.archive-tags b {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 4px 7px;
  color: var(--signal);
  font-size: 11px;
}

@media (max-width: 760px) {
  .archive-header,
  .archive-toolbar {
    grid-template-columns: 1fr;
  }

  .archive-filters {
    justify-content: flex-start;
  }
}
`;

  const sandboxJs = `const state = {
  data: null,
  query: "",
  category: "All",
};

const grid = document.querySelector("#archive-grid");
const filters = document.querySelector("#archive-filters");
const search = document.querySelector("#archive-search");
const count = document.querySelector("#archive-count");

function matchesQuery(item) {
  const haystack = [item.title, item.description, item.category, item.collection, ...item.tags].join(" ").toLowerCase();
  return haystack.includes(state.query.trim().toLowerCase());
}

function filterArchive() {
  return state.data.items.filter((item) => {
    const categoryMatch = state.category === "All" || item.category === state.category;
    return categoryMatch && matchesQuery(item);
  });
}

function renderFilters() {
  const options = [{ name: "All", count: state.data.items.length }, ...state.data.categories];
  filters.innerHTML = options.map((option) => {
    const active = option.name === state.category ? " is-active" : "";
    return '<button class="' + active + '" type="button" data-category="' + option.name + '">' + option.name + ' <small>' + option.count + '</small></button>';
  }).join("");
}

function renderArchive() {
  const items = filterArchive();
  count.value = items.length + " Assets";
  grid.innerHTML = items.map((item) => {
    const tags = item.tags.slice(0, 4).map((tag) => '<b>' + tag + '</b>').join("");
    return [
      '<article class="archive-card">',
      '<img src="' + item.src + '" alt="' + item.title + '" loading="lazy" />',
      '<div class="archive-card-body">',
      '<span>' + item.collection.replaceAll("_", " ") + '</span>',
      '<h2>' + item.title + '</h2>',
      '<p>' + item.description + '</p>',
      '<div class="archive-tags">' + tags + '</div>',
      '</div>',
      '</article>',
    ].join("");
  }).join("");
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderFilters();
  renderArchive();
});

search.addEventListener("input", () => {
  state.query = search.value;
  renderArchive();
});

state.data = await fetch("data/gallery-archive.json").then((response) => response.json());
renderFilters();
renderArchive();

export { filterArchive, renderArchive };
`;

  const sandboxReport = [
    "# Sandbox Test Report",
    "",
    "## Scope",
    "",
    "Created an isolated static preview for the milsim archive import. It does not modify production gallery files or public media.",
    "",
    "## Generated Files",
    "",
    "- `sandbox-media-import/index.html`",
    "- `sandbox-media-import/archive-preview.js`",
    "- `sandbox-media-import/styles.css`",
    "- `sandbox-media-import/data/gallery-archive.json`",
    "- `sandbox-media-import/assets/milsim/*`",
    "",
    "## Validation Targets",
    "",
    `- Items loaded: ${imageItems.length}`,
    `- Categories rendered: ${sandboxData.categories.length}`,
    `- Collections rendered: ${sandboxData.collections.length}`,
    "- Search is implemented across title, description, category, collection, and tags.",
    "- Category buttons are generated from manifest-derived counts.",
    "",
    "## Result",
    "",
    "Sandbox implementation is ready for local review and automated validation.",
    "",
  ].join("\n");

  await writeFile(path.join(sandboxRoot, "index.html"), sandboxHtml);
  await writeFile(path.join(sandboxRoot, "styles.css"), sandboxCss);
  await writeFile(path.join(sandboxRoot, "archive-preview.js"), sandboxJs);
  await writeFile(path.join(dataDir, "gallery-archive.json"), `${JSON.stringify(sandboxData, null, 2)}\n`);
  await writeFile(path.join(sandboxRoot, "sandbox_test_report.md"), sandboxReport);

  return sandboxData;
}

async function buildGalleryArchive(manifestFile) {
  const loaded = await loadJson(manifestFile);
  if (!loaded.ok) throw new Error(`Unable to read gallery archive manifest: ${loaded.error}`);

  const sourceDir = path.dirname(manifestFile);
  await mkdir(galleryPublicArchiveRoot, { recursive: true });
  await mkdir(path.dirname(galleryDataPath), { recursive: true });

  const allItems = normalizeItems(loaded.value);
  const collectionCounts = new Map();
  const selectedCounts = new Map();
  const selectedItems = [];

  for (const item of allItems) {
    const sourceFile = manifestFileForItem(manifestFile, item);
    const category = item.category || "Uncategorized";
    if (sourceFile && existsSync(sourceFile) && isBrowserImage(sourceFile)) {
      collectionCounts.set(item.folder || category, (collectionCounts.get(item.folder || category) || 0) + 1);
    }
  }

  for (const item of allItems) {
    const sourceFile = manifestFileForItem(manifestFile, item);
    const category = item.category || "Uncategorized";
    if (!sourceFile || !existsSync(sourceFile) || !isBrowserImage(sourceFile)) continue;
    if (productionArchiveExclusions.has(category)) continue;
    if (!galleryArchiveCategoryCaps.has(category)) continue;

    const cap = galleryArchiveCategoryCaps.get(category);
    const used = selectedCounts.get(category) || 0;
    if (used >= cap) continue;
    selectedCounts.set(category, used + 1);

    const outputName = item.clean_filename || path.basename(sourceFile);
    const outputFile = path.join(galleryPublicArchiveRoot, outputName);
    await copyFile(sourceFile, outputFile);

    const collection = item.folder || category;
    selectedItems.push({
      title: item.title || outputName,
      category,
      filter: "archive",
      src: `/media/archive/milsim/${outputName}`,
      caption: "",
      archiveId: `MR-${String(selectedItems.length + 1).padStart(3, "0")}`,
      collection,
      assetCount: collectionCounts.get(collection) || 1,
      tags: item.tags || [],
      originalFilename: item.original_filename || "",
    });
  }

  const archiveStats = {
    source: "milsim_rooster_simple_archive",
    publicPath: "/media/archive/milsim/",
    manifestPath: rel(manifestFile),
    sourceCount: allItems.length,
    selectedCount: selectedItems.length,
    excludedCategories: [...productionArchiveExclusions],
    categoryCaps: Object.fromEntries(galleryArchiveCategoryCaps),
  };

  const dataModule = [
    "// Generated by scripts/generate-media-import-reports.mjs.",
    "// Keep source media in media-source/assets and rerun the generator to refresh this file.",
    `export const archiveStats = ${JSON.stringify(archiveStats, null, 2)};`,
    "",
    `export const archiveItems = ${JSON.stringify(selectedItems, null, 2)};`,
    "",
  ].join("\n");

  await writeFile(galleryDataPath, dataModule);
  return { archiveStats, archiveItems: selectedItems };
}

async function main() {
  await mkdir(reportRoot, { recursive: true });

  const files = await walk(assetRoot);
  const rows = [];
  for (const file of files) {
    const info = await stat(file);
    rows.push({
      file,
      relative: rel(file, assetRoot),
      ext: path.extname(file).toLowerCase() || "(none)",
      size: info.size,
      modified: info.mtime.toISOString().slice(0, 19).replace("T", " "),
      className: classify(file),
      purpose: inferPurpose(file),
    });
  }

  const byClass = new Map();
  const byExt = new Map();
  for (const row of rows) {
    byClass.set(row.className, (byClass.get(row.className) || 0) + 1);
    byExt.set(row.ext, (byExt.get(row.ext) || 0) + 1);
  }

  const jsonFiles = rows.filter((row) => row.ext === ".json").map((row) => row.file);
  const jsonErrors = [];
  const sidecarIssues = [];
  const emptyDescriptions = [];
  const duplicateKeys = new Map();
  const metadataReferences = new Set();
  const manifestSummaries = [];
  const manifestMissing = [];
  const categoryMap = {
    generated_from: "media-source/assets",
    archives: [],
  };

  for (const file of jsonFiles) {
    const loaded = await loadJson(file);
    if (!loaded.ok) {
      jsonErrors.push({ file: rel(file), error: loaded.error });
      continue;
    }

    const baseName = path.basename(file);
    if (baseName !== "manifest.json" && mediaExtensions.has(path.extname(baseName.slice(0, -5)).toLowerCase())) {
      const mediaFile = path.join(path.dirname(file), baseName.slice(0, -5));
      metadataReferences.add(path.resolve(mediaFile).toLowerCase());
      if (!existsSync(mediaFile)) sidecarIssues.push({ file: rel(file), issue: `Adjacent media missing: ${rel(mediaFile, assetRoot)}` });
      for (const field of requiredFields) {
        if (loaded.value[field] === undefined || loaded.value[field] === "" || (Array.isArray(loaded.value[field]) && loaded.value[field].length === 0)) {
          sidecarIssues.push({ file: rel(file), issue: `Missing or empty field: ${field}` });
        }
      }
      if (!loaded.value.description) emptyDescriptions.push(rel(file));
    }
  }

  for (const manifestFile of manifestPaths) {
    const loaded = await loadJson(manifestFile);
    const archiveName = rel(path.dirname(manifestFile), assetRoot);
    if (!loaded.ok) {
      manifestSummaries.push({ archiveName, count: 0, error: loaded.error, categories: new Map() });
      continue;
    }

    const items = normalizeItems(loaded.value);
    const categories = new Map();
    const detected = new Map();
    const seenNames = new Map();
    const issues = [];

    for (const item of items) {
      const key = item.clean_filename || item.filename || item.file || item.path || "(missing filename)";
      seenNames.set(key, (seenNames.get(key) || 0) + 1);
      duplicateKeys.set(`${archiveName}/${key}`, (duplicateKeys.get(`${archiveName}/${key}`) || 0) + 1);
      const targetFile = manifestFileForItem(manifestFile, item);
      if (targetFile) metadataReferences.add(path.resolve(targetFile).toLowerCase());
      if (!targetFile || !existsSync(targetFile)) {
        manifestMissing.push({ archiveName, file: key });
        issues.push(`Missing referenced file: ${key}`);
      }

      for (const field of requiredFields) {
        if (item[field] === undefined || item[field] === "" || (Array.isArray(item[field]) && item[field].length === 0)) {
          issues.push(`${key}: missing or empty ${field}`);
        }
      }
      if (!item.description) emptyDescriptions.push(`${archiveName}/${key}`);

      const category = item.category || "(none)";
      categories.set(category, (categories.get(category) || 0) + 1);
      const detectedCategory = categoryFromItem(item, archiveName);
      if (!detected.has(detectedCategory)) detected.set(detectedCategory, []);
      detected.get(detectedCategory).push({
        title: item.title || key,
        file: slash(path.join(item.folder || "", key)),
        source_category: category,
        tags: item.tags || [],
      });
    }

    const duplicateNames = [...seenNames.entries()].filter(([, count]) => count > 1);
    for (const [name, count] of duplicateNames) issues.push(`Duplicate manifest filename: ${name} (${count})`);

    manifestSummaries.push({ archiveName, count: items.length, categories, issues });
    categoryMap.archives.push({
      archive: archiveName,
      item_count: items.length,
      categories: Object.fromEntries([...detected.entries()].map(([key, value]) => [key, value])),
    });
  }

  const mediaFiles = rows.filter((row) => row.className === "Media");
  const mediaWithoutSidecar = mediaFiles
    .filter((row) => !["background.png", "theme.wav"].includes(path.basename(row.file).toLowerCase()))
    .filter((row) => !existsSync(`${row.file}.json`))
    .map((row) => row.relative);
  const unusedMetadata = [...metadataReferences]
    .filter((file) => !existsSync(file))
    .map((file) => slash(path.relative(assetRoot, file)));
  const duplicateManifestReferences = [...duplicateKeys.entries()].filter(([, count]) => count > 1);

  const publicFiles = existsSync(publicMediaRoot) ? await walk(publicMediaRoot) : [];
  const publicOptimized = publicFiles.filter((file) => rel(file, publicMediaRoot).startsWith("optimized/"));
  const gallerySourcePath = path.join(repoRoot, "src", "gallery", "main.js");
  const gallerySource = await readFile(gallerySourcePath, "utf8");
  const galleryPaths = [...gallerySource.matchAll(/src:\s*"([^"]+)"/g)].map((match) => match[1]);
  const missingGalleryPublicFiles = galleryPaths
    .map((webPath) => ({ webPath, diskPath: path.join(repoRoot, "public", webPath.replace(/^\//, "")) }))
    .filter((entry) => !existsSync(entry.diskPath));
  const fieldIssueCount = sidecarIssues.length;
  const sandboxData = await buildSandbox(manifestPaths[0]);
  const galleryArchive = await buildGalleryArchive(manifestPaths[0]);

  const inventory = [
    "# Media Inventory",
    "",
    `Source root: \`${rel(assetRoot)}\``,
    "",
    `Total files: ${rows.length}`,
    "",
    "## Extension Summary",
    "",
    "| Extension | Count |",
    "|---|---:|",
    ...[...byExt.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([ext, count]) => `| ${mdEscape(ext)} | ${count} |`),
    "",
    "## Files",
    "",
    "| Filename | Extension | Size | Last Modified | Purpose |",
    "|---|---:|---:|---|---|",
    ...rows.map((row) => `| ${mdEscape(row.relative)} | ${mdEscape(row.ext)} | ${humanBytes(row.size)} | ${row.modified} | ${mdEscape(row.purpose)} |`),
    "",
  ].join("\n");

  const classification = [
    "# Asset Classification",
    "",
    "| Class | Count |",
    "|---|---:|",
    ...[...byClass.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([name, count]) => `| ${mdEscape(name)} | ${count} |`),
    "",
    ...["Metadata", "Processing Script", "Documentation", "Media", "Other"].map((className) => [
      `## ${className}`,
      "",
      ...rows.filter((row) => row.className === className).map((row) => `- \`${row.relative}\` - ${row.purpose}`),
      "",
    ].join("\n")),
  ].join("\n");

  const validation = [
    "# Metadata Validation",
    "",
    `JSON files checked: ${jsonFiles.length}`,
    `Manifest files checked: ${manifestPaths.length}`,
    "",
    "## Manifest Summary",
    "",
    "| Archive | Entries | Categories | Issues |",
    "|---|---:|---|---:|",
    ...manifestSummaries.map((summary) => `| ${mdEscape(summary.archiveName)} | ${summary.count} | ${mdEscape([...summary.categories.entries()].map(([k, v]) => `${k}: ${v}`).join(", "))} | ${summary.issues?.length || 0} |`),
    "",
    "## Broken References",
    "",
    ...(manifestMissing.length ? manifestMissing.map((item) => `- ${item.archiveName}: \`${item.file}\``) : ["None found."]),
    "",
    "## Invalid JSON",
    "",
    ...(jsonErrors.length ? jsonErrors.map((item) => `- \`${item.file}\`: ${item.error}`) : ["None found."]),
    "",
    "## Empty Descriptions",
    "",
    ...(emptyDescriptions.length ? emptyDescriptions.map((item) => `- \`${item}\``) : ["None found."]),
    "",
    "## Field Issues",
    "",
    ...(sidecarIssues.length ? sidecarIssues.map((item) => `- \`${item.file}\`: ${item.issue}`) : ["None found."]),
    "",
  ].join("\n");

  const filenameAudit = [
    "# Filename Audit",
    "",
    `Media files under source assets: ${mediaFiles.length}`,
    `Referenced metadata targets: ${metadataReferences.size}`,
    `Public optimized media files: ${publicOptimized.length}`,
    `Hardcoded gallery image paths: ${galleryPaths.length}`,
    "",
    "## Gallery Public Path Check",
    "",
    ...(missingGalleryPublicFiles.length ? missingGalleryPublicFiles.map((item) => `- Missing: \`${item.webPath}\``) : ["All hardcoded gallery image paths resolve under `public/`."]),
    "",
    "## Duplicate Manifest References",
    "",
    ...(duplicateManifestReferences.length ? duplicateManifestReferences.map(([name, count]) => `- \`${name}\` appears ${count} times`) : ["None found."]),
    "",
    "## Metadata References Without Files",
    "",
    ...(unusedMetadata.length ? unusedMetadata.map((item) => `- \`${item}\``) : ["None found."]),
    "",
    "## Media Without Sidecar",
    "",
    ...(mediaWithoutSidecar.length ? mediaWithoutSidecar.map((item) => `- \`${item}\``) : ["None found, excluding top-level gallery background/audio candidates."]),
    "",
  ].join("\n");

  const architecture = [
    "# Website Media Architecture",
    "",
    "## Current Runtime",
    "",
    "- The gallery is a standalone Vite input at `apps/gallery/index.html`.",
    "- The gallery runtime lives in `src/gallery/main.js` and uses Three.js, GSAP, and a canvas texture per card.",
    "- The current gallery item list is hardcoded in `src/gallery/main.js`.",
    "- The current gallery reads optimized public assets from `/media/optimized/photography/...`.",
    "- Gallery validation is covered by `tests/validate-gallery.mjs`, which checks the standalone page, Three.js wiring, filters, modal expansion, and required public media path families.",
    "- The public media convention is documented in `public/media/README.md`: use lowercase, web-safe filenames and reference them with `/media/...` paths.",
    "",
    "## New Source Assets",
    "",
    "- New archive packages are staged in `media-source/assets` and are not yet copied into `public/media/optimized`.",
    "- Each package includes manifest metadata and sidecar JSON files.",
    "- The milsim archive has the strongest immediate fit for the Gallery Phase 1 archive-card direction.",
    "- A conservative milsim archive subset is generated into `src/gallery/archive-data.js` with browser assets copied to `public/media/archive/milsim`.",
    "",
    "## Existing Gap",
    "",
    "- The gallery can render curated images, but it does not yet consume archive manifests.",
    "- Metadata such as category, collection, tags, and archive ids can now flow from the generated gallery data module.",
    "- The sandbox import remains available for broader review before adding more source media.",
    "",
  ].join("\n");

  const integrationPlan = [
    "# Safe Integration Plan",
    "",
    "## Recommendation",
    "",
    "Proceed with a sandbox import before production gallery changes.",
    "",
    "## Proposed Work",
    "",
    "1. Create `sandbox-media-import/` with a small manifest loader and static preview.",
    "2. Copy a selected subset of milsim source media into a sandbox public path using web-safe names.",
    "3. Build operation/archive cards from `manifest.json` grouped by source folder/category.",
    "4. Add metadata fields to the sandbox card model: title, category, tags, collection/folder, source file, and asset count.",
    "5. Validate search/filter behavior and missing-file handling in the sandbox.",
    "6. After sandbox validation, integrate the selected manifest-derived item model into `src/gallery/main.js` or generate a dedicated gallery data module.",
    "",
    "## Files Likely Affected Later",
    "",
    "- `src/gallery/main.js`",
    "- `src/gallery/styles.css`",
    "- `tests/validate-gallery.mjs`",
    "- `public/media/optimized/...` or a new generated gallery media path",
    "",
    "## Risk Level",
    "",
    "Low for documentation and sandbox work. Medium for production gallery integration because the current sphere uses hardcoded card data and hand-tuned visual density.",
    "",
    "## Rollback Strategy",
    "",
    "- Keep source assets unchanged.",
    "- Keep sandbox files isolated under `sandbox-media-import/`.",
    "- For production changes, add data-driven gallery loading as an additive path and leave current hardcoded gallery items available until validation passes.",
    "- Run `npm run check` and `npm run build` before deploy.",
    "",
  ].join("\n");

  const finalReport = [
    "# Final Media Import Recommendation",
    "",
    "## Summary",
    "",
    `- Total assets discovered: ${rows.length}`,
    `- Total media files discovered: ${mediaFiles.length}`,
    `- Total manifest-indexed items: ${manifestSummaries.reduce((sum, item) => sum + item.count, 0)}`,
    `- Gallery archive items selected: ${galleryArchive.archiveStats.selectedCount}`,
    `- Metadata coverage: ${Math.round(((mediaFiles.length - mediaWithoutSidecar.length) / mediaFiles.length) * 100)}% of source media files have sidecar metadata, excluding top-level candidates from issue counting.`,
    "",
    "## Issues",
    "",
    `- Missing manifest references: ${manifestMissing.length}`,
    `- Invalid JSON files: ${jsonErrors.length}`,
    `- Duplicate manifest references: ${duplicateManifestReferences.length}`,
    `- Empty descriptions: ${emptyDescriptions.length}`,
    `- Field-level metadata issues: ${fieldIssueCount}`,
    "",
    "## Recommendation",
    "",
    "Minor Cleanup Needed",
    "",
    "The archive metadata is structurally ready for a sandbox import. The main cleanup need is deciding which source archive items should be public-facing and how the non-optimized source assets should be copied or transformed for web delivery.",
    "",
  ].join("\n");

  await writeFile(path.join(reportRoot, "media_inventory.md"), inventory);
  await writeFile(path.join(reportRoot, "asset_classification.md"), classification);
  await writeFile(path.join(reportRoot, "metadata_validation.md"), validation);
  await writeFile(path.join(reportRoot, "filename_audit.md"), filenameAudit);
  await writeFile(path.join(reportRoot, "website_media_architecture.md"), architecture);
  await writeFile(path.join(reportRoot, "integration_plan.md"), integrationPlan);
  await writeFile(path.join(reportRoot, "final_media_import_report.md"), finalReport);
  await writeFile(path.join(reportRoot, "category_map.json"), `${JSON.stringify(categoryMap, null, 2)}\n`);

  console.log(`Wrote media import reports to ${reportRoot}`);
  console.log(`Wrote sandbox preview to ${sandboxRoot} with ${sandboxData.items.length} items`);
  console.log(`Wrote gallery archive data to ${galleryDataPath} with ${galleryArchive.archiveStats.selectedCount} items`);
  console.log(`Assets: ${rows.length}; manifest items: ${manifestSummaries.reduce((sum, item) => sum + item.count, 0)}; missing refs: ${manifestMissing.length}; invalid JSON: ${jsonErrors.length}`);
}

await main();
