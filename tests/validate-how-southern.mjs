import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import vm from "node:vm";

const appDir = new URL("../public/apps/how-southern-are-you/", import.meta.url);
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
    .replace(/export\s+const\s+/g, "const ")
    .replace(/export\s+function\s+/g, "function ");
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${sanitized}\nresult = { ${names.join(", ")} };`, context);
  return context.result;
}

for (const file of ["index.html", "style.css", "app.js", "questions.js", "results.js", "README.md"]) {
  await ensureFile(file);
}

const [indexHtml, appJs, questionsSource, resultsSource, homeSource] = await Promise.all([
  read("index.html"),
  read("app.js"),
  read("questions.js"),
  read("results.js"),
  readFile(new URL("src/App.jsx", rootDir), "utf8")
]);

const { QUESTIONS, QUESTION_CATEGORIES } = loadDataModule(questionsSource, [
  "QUESTIONS",
  "QUESTION_CATEGORIES"
]);
const {
  RESULT_RANGES,
  RESULT_TITLES,
  RESULT_OBSERVATIONS,
  RESULT_WARNINGS,
  RESULT_BADGES,
  SHARE_CAPTIONS,
  REGIONAL_NOTES
} = loadDataModule(resultsSource, [
  "RESULT_RANGES",
  "RESULT_TITLES",
  "RESULT_OBSERVATIONS",
  "RESULT_WARNINGS",
  "RESULT_BADGES",
  "SHARE_CAPTIONS",
  "REGIONAL_NOTES"
]);

assert.ok(indexHtml.includes("<title>How Southern Are You? | Milsim Rooster</title>"));
assert.ok(indexHtml.includes('meta name="description"'));
assert.ok(indexHtml.includes('property="og:title"'));
assert.ok(indexHtml.includes('type="module" src="./questions.js"'));
assert.ok(indexHtml.includes('type="module" src="./results.js"'));
assert.ok(indexHtml.includes('type="module" src="./app.js"'));

assert.equal(new Set(QUESTIONS.map((question) => question.id)).size, QUESTIONS.length);
assert.ok(QUESTIONS.length >= 500, "question pool should have at least 500 questions");
assert.ok(QUESTION_CATEGORIES.includes("southern_culture"), "category list should include Southern culture");
assert.ok(
  QUESTIONS.every((question) => question.answers.length >= 4 && question.answers.every((answer) => Number.isFinite(answer.points))),
  "every question should have four scored answers"
);
assert.ok(
  QUESTIONS.every((question) =>
    question.answers.every((answer) => answer.text.split(/\s+/).length <= 6)
  ),
  "every answer should be short and punchy"
);
assert.ok(
  QUESTIONS.every((question) => Math.max(...question.answers.map((answer) => answer.points)) === 5),
  "every question should keep a five-point top answer"
);
assert.ok(
  QUESTION_CATEGORIES.every((category) => QUESTIONS.some((question) => question.category === category)),
  "every category should have at least one question"
);

assert.ok(RESULT_RANGES.length >= 6);
assert.ok(RESULT_TITLES.length >= 50);
assert.ok(RESULT_OBSERVATIONS.length >= 75);
assert.ok(RESULT_WARNINGS.length >= 50);
assert.ok(RESULT_BADGES.length >= 50);
assert.ok(SHARE_CAPTIONS.length >= 50);
assert.ok(REGIONAL_NOTES.length >= 25);
assert.ok(appJs.includes("navigator.clipboard"));
assert.ok(appJs.includes("toDataURL(\"image/png\")"));
assert.ok(appJs.includes("how-southern-are-you"));
assert.ok(homeSource.includes("/apps/how-southern-are-you/"));
