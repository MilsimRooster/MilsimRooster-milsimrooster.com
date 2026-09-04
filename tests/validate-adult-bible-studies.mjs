import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { validateScriptureReference } from "../scripts/lib/scripture-reference.mjs";

const root = process.cwd();
const dataRoot = join(root, "public", "data", "bible_studies");
const libraryRoot = join(dataRoot, "library");
const schemaPath = join(dataRoot, "schema.json");
const indexPath = join(dataRoot, "index.json");
const pageRoot = join(root, "public", "bible", "studies");
const pagePath = join(pageRoot, "index.html");
const appPath = join(pageRoot, "app-20260812.js");
const loaderPath = join(pageRoot, "study-loader-20260812.js");
const stylesPath = join(pageRoot, "styles-20260812.css");
const darkThemePath = join(pageRoot, "theme-20260813.css");

for (const [label, path] of [
  ["Adult Bible Studies schema", schemaPath],
  ["Adult Bible Studies index", indexPath],
  ["Adult Bible Studies page", pagePath],
  ["Adult Bible Studies app", appPath],
  ["Adult Bible Studies loader", loaderPath],
  ["Adult Bible Studies styles", stylesPath],
  ["Adult Bible Studies dark theme", darkThemePath],
]) {
  assert.ok(existsSync(path), `${label} should exist at ${path}`);
}

const schema = readJson(schemaPath);
const index = readJson(indexPath);
const kjv = readJson(join(root, "public", "bible", "kjv.json"));
const bsb = readJson(join(root, "public", "bible", "bsb.json"));
const page = readFileSync(pagePath, "utf8");
const app = readFileSync(appPath, "utf8");
const loader = readFileSync(loaderPath, "utf8");
const styles = readFileSync(stylesPath, "utf8");
const darkTheme = readFileSync(darkThemePath, "utf8");
const readerPage = readFileSync(join(root, "public", "bible", "index.html"), "utf8");
const kidsPage = readFileSync(join(root, "public", "bible", "lessons", "index.html"), "utf8");
const explorerPage = readFileSync(join(root, "public", "bible", "explorer", "index.html"), "utf8");
const aboutSource = readFileSync(join(root, "src", "App.jsx"), "utf8");
const headers = readFileSync(join(root, "public", "_headers"), "utf8");
const themeCss = readFileSync(join(root, "public", "assets", "css", "app-theme-20260812.css"), "utf8");

assert.equal(schema.title, "Milsim Rooster Adult Bible Study", "schema should identify the adult study data");
assert.equal(index.schema_version, "adult-bible-study-index/v1", "index should use the adult study index schema");
assert.equal(index.study_count, 10, "the first adult release should contain the ten reviewed studies");
assert.equal(index.studies.length, index.study_count, "index count should match its study entries");
assert.match(index.editorial_notice, /distinguish textual observation from teaching, interpretive caution, and application/i, "index should carry the accuracy boundary shown to readers");

const ids = new Set();
const files = new Set();
const sortOrders = new Set();
const studies = [];

for (const entry of index.studies) {
  assert.match(entry.study_id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, "study IDs should be stable slugs");
  assert.ok(!ids.has(entry.study_id), `study ID should be unique: ${entry.study_id}`);
  assert.ok(!files.has(entry.file), `study file should be unique: ${entry.file}`);
  assert.ok(!sortOrders.has(entry.sort_order), `study sort order should be unique: ${entry.sort_order}`);
  ids.add(entry.study_id);
  files.add(entry.file);
  sortOrders.add(entry.sort_order);

  assert.match(entry.file, /^library\/[a-z0-9-]+\.json$/, `${entry.study_id} should point into the published library`);
  const studyPath = join(dataRoot, entry.file);
  assert.ok(existsSync(studyPath), `${entry.study_id} study file should exist`);
  const study = readJson(studyPath);
  studies.push(study);

  for (const field of schema.required) {
    assert.ok(Object.hasOwn(study, field), `${study.study_id || entry.study_id} should include ${field}`);
  }

  assert.equal(study.schema_version, "adult-bible-study/v1", `${entry.study_id} should use the adult study schema`);
  assert.equal(study.study_id, entry.study_id, `${entry.study_id} should match its index entry`);
  assert.equal(study.title, entry.title, `${entry.study_id} title should match its index entry`);
  assert.equal(study.estimated_minutes, entry.estimated_minutes, `${entry.study_id} duration should match its index entry`);
  assert.deepEqual(study.tags, entry.tags, `${entry.study_id} tags should match its index entry`);
  assert.ok(study.summary.length >= 70, `${entry.study_id} should provide a useful summary`);
  assert.ok(study.primary_references.length >= 1, `${entry.study_id} should identify its primary passages`);
  assert.ok(study.observations.length >= 2, `${entry.study_id} should include passage observations`);
  assert.ok(study.teaching.length >= 2, `${entry.study_id} should include supported teaching`);
  assert.ok(study.interpretive_cautions.length >= 1, `${entry.study_id} should include interpretive cautions`);
  assert.ok(study.application.length >= 2, `${entry.study_id} should keep application distinct`);
  assert.ok(study.discussion.length >= 2, `${entry.study_id} should include discussion prompts`);
  assert.ok(study.prayer.length >= 35, `${entry.study_id} should include a substantive prayer prompt`);
  assert.equal(study.review.status, "public-ready", `${entry.study_id} should be explicitly approved for the public index`);
  assert.equal(study.review.reference_review, "automated-passed", `${entry.study_id} should pass complete KJV and BSB reference validation`);
  assert.equal(study.review.doctrinal_review, "independent-editorial", `${entry.study_id} should carry an independent editorial review marker`);
  assert.equal(study.review.reviewed_at, "2026-08-12", `${entry.study_id} should carry a review date`);
  assert.equal(study.review.content_version, index.library_version, `${entry.study_id} content version should match the library version`);

  for (const reference of study.primary_references) {
    assert.equal(reference.role, "primary", `${entry.study_id} primary references should be labeled primary`);
    assertReference(reference, entry.study_id);
  }

  for (const [sectionName, statements] of [
    ["observations", study.observations],
    ["teaching", study.teaching],
    ["interpretive_cautions", study.interpretive_cautions],
  ]) {
    for (const statement of statements) {
      assert.ok(statement.text.length >= 35, `${entry.study_id} ${sectionName} statements should be substantive`);
      assert.ok(Array.isArray(statement.supporting_references) && statement.supporting_references.length >= 1, `${entry.study_id} ${sectionName} statements should cite Scripture`);
      for (const reference of statement.supporting_references) {
        assert.equal(reference.role, "supporting", `${entry.study_id} claim references should be labeled supporting`);
        assertReference(reference, `${entry.study_id} ${sectionName}`);
        if (sectionName === "observations") {
          assert.ok(isInsideAnyPrimary(reference, study.primary_references), `${entry.study_id} observation evidence ${reference.label} should stay inside a primary passage`);
        }
      }
    }
  }

  for (const caution of study.interpretive_cautions) {
    assert.ok(["genre", "scope", "legitimate-dispute", "pastoral-safety", "textual-note"].includes(caution.kind), `${entry.study_id} should use a recognized caution kind`);
  }

  assertNoUnsafeMarkupOrVerseFields(study, entry.study_id);
}

const actualFiles = readdirSync(libraryRoot).filter((file) => file.endsWith(".json")).sort();
const indexedFiles = [...files].map((file) => basename(file)).sort();
assert.deepEqual(actualFiles, indexedFiles, "the public library should contain only indexed, public-ready studies");

const highRiskRequirements = {
  "wisdom-for-anxiety-and-fear": ["pastoral-safety"],
  "forgiveness-and-reconciliation": ["pastoral-safety"],
  "enduring-suffering-with-hope": ["pastoral-safety"],
  "marriage-as-covenant": ["pastoral-safety", "legitimate-dispute"],
  "romans-grace-faith-new-life": ["legitimate-dispute"],
  "james-faith-in-life": ["legitimate-dispute", "pastoral-safety"],
};

for (const [studyId, requiredKinds] of Object.entries(highRiskRequirements)) {
  const study = studies.find((candidate) => candidate.study_id === studyId);
  assert.ok(study, `risk-sensitive study should exist: ${studyId}`);
  const kinds = new Set(study.interpretive_cautions.map((caution) => caution.kind));
  if (requiredKinds.includes("pastoral-safety")) {
    assert.ok(study.pastoral_safety.length >= 1, `${studyId} should include explicit pastoral safeguards`);
  }
  for (const kind of requiredKinds) assert.ok(kinds.has(kind), `${studyId} should include a ${kind} caution`);
}

const combinedProse = studies.map((study) => JSON.stringify(study)).join("\n").toLowerCase();
for (const banned of [
  "all christians agree",
  "the bible guarantees",
  "god guarantees you",
  "if you have enough faith",
  "anxiety proves weak faith",
  "mental illness is weak faith",
  "stay in an abusive",
]) {
  assert.ok(!combinedProse.includes(banned), `adult studies should not contain unsafe overclaim: ${banned}`);
}

assert.ok(page.includes("Adult Bible Studies"), "adult page should have a clear title");
assert.ok(page.includes('id="studySearch"'), "adult page should expose search");
assert.ok(page.includes('id="topicFilter"'), "adult page should expose topic filtering");
assert.ok(page.includes('id="translationSelect"'), "adult page should let readers choose the Bible translation opened by citations");
assert.ok(page.includes('<option value="kjv" selected>'), "adult citation links should default to KJV");
assert.ok(page.indexOf('class="study-library') < page.indexOf('id="studyDetail"'), "the compact study chooser should precede study detail for mobile users");
assert.ok(page.includes('src="app-20260812.js"'), "adult page should use a fingerprinted app asset");
assert.ok(page.includes('href="styles-20260812.css"'), "adult page should use a fingerprinted stylesheet");
assert.ok(page.includes('href="theme-20260813.css"'), "adult page should load its versioned dark-theme palette");
assert.ok(loader.includes("/data/bible_studies/"), "adult loader should read the dedicated study library");
assert.ok(app.includes("What the Passages Say"), "adult UI should label textual observation separately");
assert.ok(app.includes("What This Teaches"), "adult UI should label teaching separately");
assert.ok(app.includes("Interpretive Cautions"), "adult UI should label interpretive cautions separately");
assert.ok(app.includes("Put It into Practice"), "adult UI should label application separately");
assert.ok(app.includes('target="_blank"'), "Scripture evidence links should preserve the reader's study page");
assert.ok(app.includes("ref.book_slug"), "adult UI should build links from structured book slugs");
assert.ok(styles.includes("@media (max-width: 760px)"), "adult UI should include a mobile layout");
assert.ok(styles.includes(".study-library.collapsed .study-list"), "adult study library should collapse on mobile");
assert.ok(darkTheme.includes('html[data-mr-theme="dark"]'), "adult UI should react to the shared dark-theme state");
assert.ok(darkTheme.includes(":is(.study-controls, .study-library, .study-detail)"), "adult dark mode should recolor its primary surfaces");
assert.ok(darkTheme.includes("var(--page) !important"), "adult dark mode should replace the fixed light page background");
assert.ok(readerPage.includes('href="/bible/studies/"'), "Digital Bible should link to Adult Studies");
assert.ok(kidsPage.includes('href="/bible/studies/"'), "Kids Lessons should link to Adult Studies");
assert.ok(explorerPage.includes('href="/bible/studies/"'), "Bible Explorer should link to Adult Studies");
assert.ok(aboutSource.includes('name: "Adult Bible Studies"'), "Apps and Utilities should list Adult Bible Studies");
assert.ok(aboutSource.includes('href: "/bible/studies/"'), "Adult Bible Studies card should use the public route");
assert.ok(headers.includes("/data/bible_studies/*"), "study data should use revalidation-friendly response headers");
assert.ok(themeCss.includes('[data-mr-app="bible-studies"]'), "Adult Studies should participate in the shared light/dark theme");

console.log(`Adult Bible Studies validation passed (${studies.length} studies).`);

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function assertReference(reference, context) {
  assert.doesNotThrow(() => validateScriptureReference(reference, kjv), `${context} reference should resolve in repaired KJV: ${reference.label}`);
  assert.doesNotThrow(() => validateScriptureReference(reference, bsb), `${context} reference should resolve in BSB: ${reference.label}`);
}

function isInsideAnyPrimary(reference, primaryReferences) {
  return primaryReferences.some((primary) => {
    if (reference.book_slug !== primary.book_slug) return false;
    return comparePoint(reference.start, primary.start) >= 0 && comparePoint(reference.end, primary.end) <= 0;
  });
}

function comparePoint(left, right) {
  if (left.chapter !== right.chapter) return left.chapter - right.chapter;
  return left.verse - right.verse;
}

function assertNoUnsafeMarkupOrVerseFields(value, context, path = "study") {
  if (typeof value === "string") {
    assert.ok(!/[<>]/.test(value), `${context} ${path} should not contain HTML`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoUnsafeMarkupOrVerseFields(item, context, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;

  for (const [key, child] of Object.entries(value)) {
    assert.ok(!["quote", "verse_text", "scripture_text", "niv_text", "nlt_text", "nasb_text"].includes(key), `${context} should not bake Bible translation text into ${path}.${key}`);
    assertNoUnsafeMarkupOrVerseFields(child, context, `${path}.${key}`);
  }
}
