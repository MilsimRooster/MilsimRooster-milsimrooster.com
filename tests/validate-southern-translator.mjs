import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import vm from "node:vm";

const appDir = new URL("../public/apps/southern-translator/", import.meta.url);
const rootDir = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, appDir), "utf8");
}

async function ensureFile(relativePath) {
  const info = await stat(new URL(relativePath, appDir));
  assert.ok(info.isFile(), `${relativePath} should exist`);
}

function loadDataModule(source, names) {
  const sanitized = source
    .replace(/import\s+\{[^}]+\}\s+from\s+["'][^"']+["'];?/g, "")
    .replace(/export\s+const\s+/g, "const ");
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${sanitized}\nresult = { ${names.join(", ")} };`, context);
  return context.result;
}

for (const file of ["index.html", "style.css", "app.js", "phrases.js", "sayings.js", "categories.js", "README.md"]) {
  await ensureFile(file);
}

const [indexHtml, appJs, phrasesSource, sayingsSource, categoriesSource, homeSource] = await Promise.all([
  read("index.html"),
  read("app.js"),
  read("phrases.js"),
  read("sayings.js"),
  read("categories.js"),
  readFile(new URL("src/App.jsx", rootDir), "utf8")
]);

const { PHRASES, ENGLISH_TRANSLATIONS } = loadDataModule(phrasesSource, [
  "PHRASES",
  "ENGLISH_TRANSLATIONS"
]);
const { SAYINGS } = loadDataModule(sayingsSource, ["SAYINGS"]);
const { CATEGORIES } = loadDataModule(categoriesSource, ["CATEGORIES"]);

assert.ok(indexHtml.includes("<title>Southern Translator | Milsim Rooster</title>"));
assert.ok(indexHtml.includes('meta name="description"'));
assert.ok(indexHtml.includes('property="og:title"'));
assert.ok(indexHtml.includes('property="og:description"'));
assert.ok(indexHtml.includes('type="module" src="./phrases.js"'));
assert.ok(indexHtml.includes('type="module" src="./sayings.js"'));
assert.ok(indexHtml.includes('type="module" src="./categories.js"'));
assert.ok(indexHtml.includes('type="module" src="./app.js"'));

assert.ok(CATEGORIES.length >= 12, "category browser should expose planned categories");
assert.ok(PHRASES.length >= 2000, "Southern phrase pool should have at least 2,000 entries");
assert.ok(ENGLISH_TRANSLATIONS.length >= 100, "English-to-Southern pool should have at least 100 entries");
assert.ok(SAYINGS.length >= 100, "random saying pool should have at least 100 entries");
assert.equal(new Set(PHRASES.map((entry) => entry.id)).size, PHRASES.length);
assert.equal(new Set(ENGLISH_TRANSLATIONS.map((entry) => entry.id)).size, ENGLISH_TRANSLATIONS.length);
assert.equal(new Set(SAYINGS.map((entry) => entry.id)).size, SAYINGS.length);
assert.ok(PHRASES.every((entry) => CATEGORIES.some((category) => category.id === entry.category)), "phrase categories should be known");
assert.ok(PHRASES.every((entry) => entry.phrase && entry.literalMeaning && entry.actualMeanings?.length >= 3 && Number.isInteger(entry.severity)));
assert.ok(
  PHRASES.every((entry) =>
    entry.phrase &&
    entry.translation &&
    entry.explanation &&
    entry.region &&
    entry.generation &&
    entry.category &&
    Number.isFinite(entry.confidence) &&
    entry.confidence >= 0 &&
    entry.confidence <= 1
  ),
  "every phrase should include the expanded translation database schema"
);
assert.ok(ENGLISH_TRANSLATIONS.every((entry) => entry.english && entry.southernOptions?.length >= 3 && entry.context));
assert.ok(SAYINGS.every((entry) => entry.saying && entry.meaning && entry.usage && entry.category));
assert.ok(PHRASES.every((entry) => !/^A familiar .+ expression used in everyday conversation\.$/.test(entry.literalMeaning)), "literal meanings should be specific and natural");
assert.ok(PHRASES.every((entry) => !/\binsults expression\b|\bvehicles expression\b|\boutdoors expression\b/.test(entry.literalMeaning)), "literal meanings should not expose raw category ids");
assert.ok(ENGLISH_TRANSLATIONS.every((entry) => !/\(\d+\)$/.test(entry.english)), "English prompts should not show duplicate counters");

for (const requiredCategory of ["church", "family", "food", "farming", "hunting", "fishing", "military", "small-town", "humor", "weather", "politics"]) {
  assert.ok(PHRASES.filter((entry) => entry.category === requiredCategory).length >= 100, `${requiredCategory} should have a deep phrase pool`);
}

assert.ok(appJs.includes("navigator.clipboard"));
assert.ok(appJs.includes("toDataURL(\"image/png\")"));
assert.ok(appJs.includes("southern-translator"));
assert.ok(homeSource.includes("/apps/southern-translator/"));
