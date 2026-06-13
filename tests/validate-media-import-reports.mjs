import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportRoot = path.join(repoRoot, "docs", "media-import");
const sandboxRoot = path.join(repoRoot, "sandbox-media-import");
const galleryDataPath = path.join(repoRoot, "src", "gallery", "archive-data.js");

execFileSync("node", ["scripts/generate-media-import-reports.mjs"], {
  cwd: repoRoot,
  stdio: "pipe",
});

for (const file of [
  "media_inventory.md",
  "asset_classification.md",
  "metadata_validation.md",
  "filename_audit.md",
  "website_media_architecture.md",
  "integration_plan.md",
  "final_media_import_report.md",
  "category_map.json",
]) {
  assert.ok(existsSync(path.join(reportRoot, file)), `${file} should be generated`);
}

const validation = await readFile(path.join(reportRoot, "metadata_validation.md"), "utf8");
assert.ok(validation.includes("JSON files checked: 95"), "metadata validation should include JSON check count");
assert.ok(validation.includes("Missing or empty field: tags"), "metadata validation should report missing landscape tags");
assert.ok(validation.includes("Broken References\n\nNone found."), "metadata validation should report no broken refs");

const finalReport = await readFile(path.join(reportRoot, "final_media_import_report.md"), "utf8");
assert.ok(finalReport.includes("Field-level metadata issues: 20"), "final report should surface field-level metadata issue count");
assert.ok(finalReport.includes("Minor Cleanup Needed"), "final report should include recommendation");

for (const file of [
  "index.html",
  "archive-preview.js",
  "styles.css",
  "data/gallery-archive.json",
  "sandbox_test_report.md",
]) {
  assert.ok(existsSync(path.join(sandboxRoot, file)), `${file} should be generated in sandbox`);
}

const sandboxData = JSON.parse(await readFile(path.join(sandboxRoot, "data", "gallery-archive.json"), "utf8"));
assert.ok(sandboxData.items.length >= 18, "sandbox should include a useful milsim sample set");
assert.ok(sandboxData.categories.some((category) => category.name === "Field Operations"), "sandbox should include Field Operations category");
assert.ok(sandboxData.categories.some((category) => category.name === "Vehicles & Aircraft"), "sandbox should include Vehicles & Aircraft category");
assert.ok(sandboxData.items.every((item) => existsSync(path.join(sandboxRoot, item.src))), "sandbox item media files should exist");

const sandboxHtml = await readFile(path.join(sandboxRoot, "index.html"), "utf8");
const sandboxJs = await readFile(path.join(sandboxRoot, "archive-preview.js"), "utf8");
assert.ok(sandboxHtml.includes("archive-preview.js"), "sandbox HTML should load preview JS");
assert.ok(sandboxHtml.includes("archive-search"), "sandbox HTML should expose search input");
assert.ok(sandboxJs.includes("renderArchive"), "sandbox JS should render archive cards");
assert.ok(sandboxJs.includes("filterArchive"), "sandbox JS should filter archive cards");

assert.ok(existsSync(galleryDataPath), "gallery archive data module should be generated");
const galleryDataSource = await readFile(galleryDataPath, "utf8");
const statsMatch = galleryDataSource.match(/export const archiveStats = ([\s\S]*?);\n\nexport const archiveItems = /);
const itemsMatch = galleryDataSource.match(/export const archiveItems = ([\s\S]*?);\n$/);
assert.ok(statsMatch, "gallery archive stats should be exported as JSON");
assert.ok(itemsMatch, "gallery archive items should be exported as JSON");
const archiveStats = JSON.parse(statsMatch[1]);
const archiveItems = JSON.parse(itemsMatch[1]);
assert.equal(archiveStats.source, "milsim_rooster_simple_archive", "archive source should be recorded");
assert.equal(archiveStats.publicPath, "/media/archive/milsim/", "archive public path should be recorded");
assert.ok(archiveItems.length >= 18, "gallery should include a curated archive subset");
assert.ok(archiveItems.length <= 30, "gallery archive subset should stay conservative");
assert.ok(archiveItems.every((item) => item.filter === "archive"), "archive items should use the archive filter");
assert.ok(archiveItems.every((item) => item.archiveId && item.collection && item.assetCount), "archive items should include archive metadata");
assert.equal(archiveItems.find((item) => item.collection === "Field_Operations")?.assetCount, 18, "archive asset count should describe the full source collection");
assert.equal(archiveItems.find((item) => item.collection === "Vehicles_and_Aircraft")?.assetCount, 8, "vehicle asset count should describe the full source collection");
assert.ok(archiveItems.every((item) => !["Video Clips", "Website Backgrounds", "AI & Cinematic Edits"].includes(item.category)), "production archive should exclude utility/video/AI categories");
assert.ok(archiveItems.some((item) => item.category === "Field Operations"), "archive should include Field Operations");
assert.ok(archiveItems.some((item) => item.category === "Vehicles & Aircraft"), "archive should include Vehicles & Aircraft");
assert.ok(archiveItems.every((item) => existsSync(path.join(repoRoot, "public", item.src.replace(/^\//, "")))), "gallery archive public assets should exist");
