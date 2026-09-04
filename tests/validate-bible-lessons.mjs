import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const lessonsRoot = join(root, "public", "data", "bible_lessons");
const schemaPath = join(lessonsRoot, "schema.json");
const indexPath = join(lessonsRoot, "index.json");
const lessonsPageRoot = join(root, "public", "bible", "lessons");
const pagePath = join(lessonsPageRoot, "index.html");
const pageCssPath = join(lessonsPageRoot, "styles-scripture-activity-20260815.css");
const legacyCssPath = join(lessonsPageRoot, "styles.css");
const loaderPath = join(lessonsPageRoot, "lesson-loader.js");
const appPath = join(lessonsPageRoot, "app-scripture-activity-20260815.js");
const legacyAppPath = join(lessonsPageRoot, "app.js");
const readerPath = join(root, "public", "bible", "index.html");
const aboutSourcePath = join(root, "src", "App.jsx");

for (const [label, path] of [
  ["Bible lessons data folder", lessonsRoot],
  ["Bible lessons schema", schemaPath],
  ["Bible lessons index", indexPath],
  ["Bible lessons page", pagePath],
  ["Bible lessons CSS", pageCssPath],
  ["Bible lessons loader", loaderPath],
  ["Bible lessons app", appPath],
]) {
  assert.ok(existsSync(path), `${label} should exist at ${path}`);
}

const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const index = JSON.parse(readFileSync(indexPath, "utf8"));
const page = readFileSync(pagePath, "utf8");
const css = readFileSync(pageCssPath, "utf8");
const loader = readFileSync(loaderPath, "utf8");
const app = readFileSync(appPath, "utf8");
const legacyApp = readFileSync(legacyAppPath, "utf8");
const legacyCss = readFileSync(legacyCssPath, "utf8");
const reader = readFileSync(readerPath, "utf8");
const aboutSource = readFileSync(aboutSourcePath, "utf8");
const bsb = JSON.parse(readFileSync(join(root, "public", "bible", "bsb.json"), "utf8"));
const kjv = JSON.parse(readFileSync(join(root, "public", "bible", "kjv.json"), "utf8"));

const requiredFields = [
  "lesson_id",
  "title",
  "bible_book",
  "passage",
  "testament",
  "category",
  "summary",
  "age_5_7_explanation",
  "age_8_11_explanation",
  "teen_explanation",
  "key_truths",
  "life_application",
  "quiz_questions",
  "memory_verse",
  "discussion_questions",
  "activity",
  "prayer_prompt",
  "tags",
  "difficulty",
  "estimated_minutes",
  "related_lessons",
  "people",
  "places",
  "themes",
  "events",
  "related_graph_nodes",
];

assert.equal(schema.schema_version, "bible-lesson/v1", "schema should identify bible-lesson/v1");
assert.deepEqual(schema.required, requiredFields, "schema should require the requested lesson fields in order");
assert.ok(Array.isArray(index.lessons), "lesson index should expose lessons");
assert.ok(index.lessons.length >= 50, "lesson library should ship a meaningful first wave, not only three samples");
assert.ok(Array.isArray(index.packs) && index.packs.length >= 4, "lesson index should group lessons into reusable packs");

const expectedLessonIds = new Set(["david-and-goliath", "noahs-ark", "daniel-in-the-lions-den"]);
const actualLessonIds = new Set(index.lessons.map((entry) => entry.lesson_id));
for (const lessonId of expectedLessonIds) {
  assert.ok(actualLessonIds.has(lessonId), `lesson index should keep requested starter lesson ${lessonId}`);
}

const validAgeModes = new Set(["age_5_7", "age_8_11", "teens"]);
const validDifficulties = new Set(["easy", "medium", "hard"]);
const validTestaments = new Set(["Old Testament", "New Testament"]);
const allLessons = [];
const bsbBooks = new Map(bsb.books.map((book) => [book.name, book]));
const kjvBooks = new Map(kjv.books.map((book) => [book.name, book]));

for (const entry of index.lessons) {
  assert.ok(entry.file.endsWith(".json"), `${entry.lesson_id} should point to a JSON file`);
  assert.ok(entry.collection, `${entry.lesson_id} index entry should include collection for library-scale filtering`);
  assert.ok(Number.isInteger(entry.sort_order), `${entry.lesson_id} index entry should include sort_order`);
  const lessonPath = join(lessonsRoot, entry.file);
  assert.ok(existsSync(lessonPath), `${entry.lesson_id} file should exist`);
  const lesson = JSON.parse(readFileSync(lessonPath, "utf8"));
  allLessons.push(lesson);

  for (const field of requiredFields) {
    assert.ok(Object.hasOwn(lesson, field), `${lesson.lesson_id} should include ${field}`);
  }

  assert.equal(lesson.lesson_id, entry.lesson_id, `${entry.lesson_id} should declare matching lesson_id`);
  assert.ok(lesson.title.length >= 8, `${lesson.lesson_id} should have a clear title`);
  assert.ok(lesson.bible_book.length >= 3, `${lesson.lesson_id} should include bible_book`);
  assert.match(lesson.passage, /^[1-3]?\s?[A-Z][a-z]+/, `${lesson.lesson_id} should include a Scripture passage`);
  assertPassageStartsInTranslation(lesson, bsbBooks, "BSB");
  assertPassageStartsInTranslation(lesson, kjvBooks, "KJV");
  assert.ok(validTestaments.has(lesson.testament), `${lesson.lesson_id} should use a valid testament`);
  assert.ok(lesson.category.length >= 4, `${lesson.lesson_id} should include category`);
  assert.ok(lesson.summary.length >= 40, `${lesson.lesson_id} should include a useful summary`);
  assert.ok(lesson.age_5_7_explanation.length >= 30, `${lesson.lesson_id} should include ages 5-7 explanation`);
  assert.ok(lesson.age_8_11_explanation.length >= 45, `${lesson.lesson_id} should include ages 8-11 explanation`);
  assert.ok(lesson.teen_explanation.length >= 60, `${lesson.lesson_id} should include teen explanation`);
  assert.ok(Array.isArray(lesson.key_truths) && lesson.key_truths.length >= 2, `${lesson.lesson_id} should include key truths`);
  assert.ok(lesson.life_application.length >= 40, `${lesson.lesson_id} should include a life application`);
  assert.ok(Array.isArray(lesson.quiz_questions) && lesson.quiz_questions.length >= 1, `${lesson.lesson_id} should include quiz questions`);
  assert.ok(lesson.memory_verse.reference && lesson.memory_verse.prompt, `${lesson.lesson_id} should include memory verse reference and prompt`);
  assert.ok(Array.isArray(lesson.discussion_questions) && lesson.discussion_questions.length >= 3, `${lesson.lesson_id} should include discussion questions`);
  assert.ok(lesson.activity.title && lesson.activity.instructions, `${lesson.lesson_id} should include an activity`);
  assert.ok(lesson.prayer_prompt.length >= 30, `${lesson.lesson_id} should include a prayer prompt`);
  assert.ok(Array.isArray(lesson.tags) && lesson.tags.length >= 3, `${lesson.lesson_id} should include tags`);
  assert.ok(validDifficulties.has(lesson.difficulty), `${lesson.lesson_id} should include valid difficulty`);
  assert.ok(Number.isInteger(lesson.estimated_minutes) && lesson.estimated_minutes >= 5, `${lesson.lesson_id} should include estimated minutes`);
  assert.ok(Array.isArray(lesson.related_lessons), `${lesson.lesson_id} should include related lessons`);
  assert.ok(Array.isArray(lesson.people), `${lesson.lesson_id} should include people graph links`);
  assert.ok(Array.isArray(lesson.places), `${lesson.lesson_id} should include places graph links`);
  assert.ok(Array.isArray(lesson.themes) && lesson.themes.length >= 1, `${lesson.lesson_id} should include theme graph links`);
  assert.ok(Array.isArray(lesson.events) && lesson.events.length >= 1, `${lesson.lesson_id} should include event graph links`);
  assert.ok(Array.isArray(lesson.related_graph_nodes), `${lesson.lesson_id} should include related graph node links`);
  assert.ok(lesson.age_modes.every((mode) => validAgeModes.has(mode)), `${lesson.lesson_id} should expose valid age modes`);

  for (const question of lesson.quiz_questions) {
    assert.ok(question.type, `${lesson.lesson_id} quiz question should include type`);
    assert.ok(question.question.length >= 10, `${lesson.lesson_id} quiz question should include question text`);
    assert.ok(question.answer.length >= 2, `${lesson.lesson_id} quiz question should include answer`);
    assert.ok(question.explanation.length >= 20, `${lesson.lesson_id} quiz question should teach briefly`);
  }
}

const combinedLessonText = allLessons.map((lesson) => JSON.stringify(lesson)).join("\n").toLowerCase();
for (const banned of ["maybe god", "one interpretation", "scholars disagree", "denomination"]) {
  assert.ok(!combinedLessonText.includes(banned), `children's lessons should avoid debated framing phrase "${banned}"`);
}

assert.ok(page.includes('id="lessonFilters"'), "lesson browser should expose filters");
assert.ok(page.includes('id="lessonSearch"'), "lesson browser should expose lesson search for larger libraries");
assert.ok(page.includes('id="filterAdvancedToggle"'), "lesson browser should expose a compact mobile advanced-filter toggle");
assert.ok(page.includes('id="advancedFilterGrid"'), "lesson browser should wrap advanced filters for mobile collapse");
assert.ok(page.includes('id="collectionFilter"'), "lesson browser should expose pack filtering for larger libraries");
assert.ok(page.includes('id="lessonList"'), "lesson browser should expose a lesson list");
assert.ok(page.includes('id="lessonListToggle"'), "lesson browser should expose a compact mobile lesson-list toggle");
assert.ok(page.includes('id="lessonLibraryBody"'), "lesson browser should wrap the lesson list so it can collapse on mobile");
assert.ok(page.includes('id="loadMoreLessons"'), "lesson browser should expose progressive loading for large lesson lists");
assert.ok(page.includes('id="lessonDetail"'), "lesson browser should expose lesson detail");
assert.ok(page.indexOf('id="lessonDetail"') < page.indexOf('class="lesson-list-panel'), "lesson detail should precede the library in source order for mobile");
assert.ok(!page.includes('<p class="eyebrow">Bible Lessons</p>'), "lesson hero should avoid redundant eyebrow title text");
assert.ok(!page.includes("Short lessons that move from reading"), "lesson hero should avoid stacking a subtitle under the page title");
assert.ok(page.includes("Read It") && page.includes("Tell It") && page.includes("Understand It"), "lesson detail should include ladder tab labels");
assert.ok(page.includes("Live It") && page.includes("Play It") && page.includes("45-Min Class Plan"), "lesson detail should include play and full class-plan tabs");
assert.ok(page.includes('src="app-scripture-activity-20260815.js"'), "lesson page should load its uniquely named app script");
assert.ok(page.includes('href="styles-scripture-activity-20260815.css"'), "lesson page should load its uniquely named stylesheet");
assert.ok(app.includes('./lesson-loader.js?v=20260815-scripture-activity-1'), "lesson app should cache-bust its loader module import");
assert.equal(app.trimEnd(), legacyApp.trimEnd(), "uniquely named lesson app should match the maintained source");
assert.equal(css.trimEnd(), legacyCss.trimEnd(), "uniquely named lesson CSS should match the maintained source");
assert.ok(page.includes('href="/bible/explorer/"'), "lesson page should link to the Bible Explorer");

assert.ok(css.includes(".lesson-shell"), "lesson CSS should style the lesson app shell");
assert.ok(css.includes(".filter-grid"), "lesson CSS should style filters");
assert.ok(css.includes(".lesson-tabs"), "lesson CSS should style lesson tabs");
assert.ok(css.includes("@media (max-width: 760px)"), "lesson CSS should include mobile rules");
assert.ok(css.includes(".lesson-list-panel.collapsed .lesson-library-body"), "lesson CSS should collapse the lesson library body on mobile");
assert.ok(css.includes(".filter-grid.collapsed"), "lesson CSS should collapse advanced filters on mobile");
assert.ok(css.includes("grid-column: 1"), "lesson CSS should keep the library in the left desktop column despite mobile-first source order");
assert.ok(css.includes("overflow-x: hidden"), "lesson CSS should guard against iPhone Safari horizontal overflow");
assert.ok(css.includes("--mobile-gutter:"), "lesson CSS should use a tunable mobile gutter instead of oversized fixed spacing");
assert.ok(css.includes("@media (max-width: 430px)"), "lesson CSS should include an iPhone-width sizing pass");
assert.ok(css.includes("--coral:"), "lesson palette should include a warm coral game accent");
assert.ok(css.includes("--gold:"), "lesson palette should include a gold reward accent");
assert.ok(css.includes("--aqua:"), "lesson palette should include a bright aqua accent");
assert.ok(css.includes(".lesson-hero::before"), "lesson hero should include a simple color accent bar instead of extra title text");

assert.ok(loader.includes("loadLessonIndex"), "lesson loader should expose loadLessonIndex");
assert.ok(loader.includes("loadLesson"), "lesson loader should expose loadLesson");
assert.ok(loader.includes("/data/bible_lessons/"), "lesson loader should load reusable lesson JSON data");
assert.ok(app.includes("ageFilter"), "lesson app should support age filtering");
assert.ok(app.includes("lessonSearch"), "lesson app should support search filtering");
assert.ok(app.includes("filterAdvancedToggle"), "lesson app should wire the compact advanced-filter toggle");
assert.ok(app.includes("collectionFilter"), "lesson app should support pack filtering");
assert.ok(app.includes("lessonListToggle"), "lesson app should wire the mobile lesson-list toggle");
assert.ok(app.includes("scrollIntoView"), "lesson app should return mobile users to the lesson after choosing from the library");
assert.ok(app.includes("Connections"), "lesson app should render a graph connections section");
assert.ok(app.includes("People to Know"), "lesson app should render kid-friendly people connections");
assert.ok(app.includes("Big Ideas"), "lesson app should label themes as kid-friendly big ideas");
assert.ok(app.includes("Try Next"), "lesson app should render recommended lessons");
assert.ok(app.includes("recommendLessonsFor(lesson, state.lessonSummaries, state.bibleGraph, 3)"), "lesson app should limit kid-facing recommendations to three");
assert.ok(!app.includes('renderConnectionGroup("Places"'), "lesson app should not expose place graph metadata in kid-facing Connections");
assert.ok(!app.includes('renderConnectionGroup("Big Themes"'), "lesson app should avoid graph-heavy theme wording");
assert.ok(!app.includes("Open the Bible Explorer"), "lesson Connections section should not push kids into the full graph explorer");
assert.ok(app.includes("bookFilter"), "lesson app should support Bible book filtering");
assert.ok(app.includes("testamentFilter"), "lesson app should support testament filtering");
assert.ok(app.includes("topicFilter"), "lesson app should support topic filtering");
assert.ok(app.includes("difficultyFilter"), "lesson app should support difficulty filtering");
assert.ok(app.includes("45-Minute Lesson Outline"), "every lesson should render a complete 45-minute teacher outline");
assert.ok(app.includes("0-5") && app.includes("43-45"), "class plans should cover the full lesson from welcome through closing prayer");
assert.ok(app.includes("Guided reading plan") && app.includes("Storytelling outline"), "Read It and Tell It should include usable teaching guidance");
assert.ok(css.includes(".class-timeline"), "lesson CSS should present the timed teacher outline as a readable timeline");
assert.ok(app.includes("#kjv."), "lesson Scripture links should honor the reader's KJV default");
assert.ok(app.includes("lessonTitle") && app.includes("lesson.lesson_id"), "lesson Scripture links should carry exact return context into the reader");
assert.ok(app.includes("scriptureLink(lesson.passage, lesson)"), "lesson passage references should link into the Digital Bible");
assert.ok(app.includes("scriptureLink(lesson.memory_verse.reference, lesson)"), "memory verse references should link into the Digital Bible");
assert.ok(app.includes("renderActivityPacket(lesson)"), "lessons with activities should render complete written activity material");
assert.ok(app.includes("Student questions") && app.includes("Teacher answer guide"), "activity packets should include questions and answers");
assert.ok(app.includes("Materials:") && app.includes("Directions to read aloud:"), "activity packets should include supplies and teacher-ready directions");
assert.ok(css.includes(".activity-packet") && css.includes(".answer-guide"), "lesson CSS should style activity packets and answer guides");
assert.ok(!app.includes("/bible/#bsb."), "lesson Scripture links should not override the reader to BSB");

assert.ok(reader.includes('href="/bible/lessons/"'), "Digital Bible reader should link to the lesson browser");
assert.ok(aboutSource.includes('name: "Kids Bible Lessons"'), "Apps and Utilities should include Kids Bible Lessons");
assert.ok(aboutSource.includes('href: "/bible/lessons/"'), "Kids Bible Lessons card should point to /bible/lessons/");

console.log("Bible lessons validation passed.");

function assertPassageStartsInTranslation(lesson, bookMap, translationLabel) {
  const match = String(lesson.passage).match(/^([1-3]?\s?[A-Za-z]+)\s+(\d+)/);
  assert.ok(match, `${lesson.lesson_id} should start with a parseable Scripture reference`);
  const [, bookName, chapterValue] = match;
  const book = bookMap.get(bookName);
  assert.ok(book, `${lesson.lesson_id} should reference ${bookName} in ${translationLabel}`);
  const chapter = book.chapters.find((entry) => entry.number === Number(chapterValue));
  assert.ok(chapter, `${lesson.lesson_id} should reference ${bookName} ${chapterValue} in ${translationLabel}`);
}
