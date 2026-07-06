import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const graphRoot = join(root, "public", "data", "bible_graph");
const lessonsRoot = join(root, "public", "data", "bible_lessons");
const explorerRoot = join(root, "public", "bible", "explorer");

const requiredPaths = [
  ["Bible graph root", graphRoot],
  ["Bible graph index", join(graphRoot, "index.json")],
  ["Bible graph schema", join(graphRoot, "schema.json")],
  ["People graph folder", join(graphRoot, "people")],
  ["Places graph folder", join(graphRoot, "places")],
  ["Themes graph folder", join(graphRoot, "themes")],
  ["Events graph folder", join(graphRoot, "events")],
  ["Miracles graph folder", join(graphRoot, "miracles")],
  ["Parables graph folder", join(graphRoot, "parables")],
  ["Prophecies graph folder", join(graphRoot, "prophecies")],
  ["Commands graph folder", join(graphRoot, "commands")],
  ["Promises graph folder", join(graphRoot, "promises")],
  ["Objects graph folder", join(graphRoot, "objects")],
  ["Memory verses graph folder", join(graphRoot, "memory_verses")],
  ["Quiz banks graph folder", join(graphRoot, "quiz_banks")],
  ["Bible graph validator", join(root, "scripts", "validate-bible-graph.js")],
  ["Bible graph coverage report", join(root, "scripts", "report-bible-graph-coverage.js")],
  ["Bible lesson connections report", join(root, "scripts", "report-bible-lesson-connections.js")],
  ["Bible Explorer page", join(explorerRoot, "index.html")],
  ["Bible Explorer app", join(explorerRoot, "app.js")],
  ["Bible Explorer styles", join(explorerRoot, "styles.css")],
];

for (const [label, path] of requiredPaths) {
  assert.ok(existsSync(path), `${label} should exist at ${path}`);
}

const graphIndex = JSON.parse(readFileSync(join(graphRoot, "index.json"), "utf8"));
const lessonIndex = JSON.parse(readFileSync(join(lessonsRoot, "index.json"), "utf8"));
const lessonApp = readFileSync(join(root, "public", "bible", "lessons", "app.js"), "utf8");
const lessonLoader = readFileSync(join(root, "public", "bible", "lessons", "lesson-loader.js"), "utf8");
const lessonPage = readFileSync(join(root, "public", "bible", "lessons", "index.html"), "utf8");
const explorerPage = readFileSync(join(explorerRoot, "index.html"), "utf8");
const explorerApp = readFileSync(join(explorerRoot, "app.js"), "utf8");

assert.equal(graphIndex.schema_version, "bible-graph-index/v1", "graph index should identify its schema");
assert.ok(graphIndex.node_counts.people >= 30, "graph should seed at least 30 people");
assert.ok(graphIndex.node_counts.places >= 12, "graph should seed at least 12 places");
assert.ok(graphIndex.node_counts.themes >= 20, "graph should seed at least 20 themes");
assert.ok(graphIndex.node_counts.events >= 20, "graph should seed at least 20 events");

const danielLesson = JSON.parse(readFileSync(join(lessonsRoot, "daniel-in-the-lions-den.json"), "utf8"));
for (const field of ["people", "places", "themes", "events", "related_graph_nodes"]) {
  assert.ok(Array.isArray(danielLesson[field]), `Daniel lesson should include ${field}`);
}

assert.ok(danielLesson.people.includes("daniel"), "Daniel lesson should link to Daniel");
assert.ok(danielLesson.places.includes("babylon"), "Daniel lesson should link to Babylon");
for (const theme of ["prayer", "courage", "faithfulness"]) {
  assert.ok(danielLesson.themes.includes(theme), `Daniel lesson should link to ${theme}`);
}
assert.ok(danielLesson.events.includes("daniel-in-the-lions-den"), "Daniel lesson should link to its event");
assert.ok(danielLesson.related_lessons.includes("fiery-furnace"), "Daniel lesson should recommend Fiery Furnace");

for (const entry of lessonIndex.lessons) {
  const lesson = JSON.parse(readFileSync(join(lessonsRoot, entry.file), "utf8"));
  assert.ok(Array.isArray(lesson.people), `${lesson.lesson_id} should include people graph links`);
  assert.ok(Array.isArray(lesson.places), `${lesson.lesson_id} should include places graph links`);
  assert.ok(Array.isArray(lesson.themes) && lesson.themes.length >= 1, `${lesson.lesson_id} should include at least one theme`);
  assert.ok(Array.isArray(lesson.events) && lesson.events.length >= 1, `${lesson.lesson_id} should include at least one event`);
  assert.ok(Array.isArray(lesson.related_graph_nodes), `${lesson.lesson_id} should include related_graph_nodes`);
  assert.ok(Array.isArray(lesson.related_lessons), `${lesson.lesson_id} should include related_lessons`);
}

assert.ok(lessonLoader.includes("loadBibleGraph"), "lesson loader should expose the Bible graph loader");
assert.ok(lessonLoader.includes("recommendLessonsFor"), "lesson loader should expose lesson recommendations");
assert.ok(lessonApp.includes("Connections"), "lesson detail UI should render a Connections section");
assert.ok(lessonApp.includes("People to Know"), "lesson detail UI should show people in kid-friendly language");
assert.ok(lessonApp.includes("Big Ideas"), "lesson detail UI should show a kid-friendly theme label");
assert.ok(lessonApp.includes("Try Next"), "lesson detail UI should show suggested next lessons");
assert.ok(lessonApp.includes("recommendLessonsFor(lesson, state.lessonSummaries, state.bibleGraph, 3)"), "lesson detail UI should cap kid-facing next lessons at three");
assert.ok(!lessonApp.includes('renderConnectionGroup("Places"'), "lesson detail UI should keep place graph details out of kid-facing Connections");
assert.ok(!lessonApp.includes('renderConnectionGroup("Big Themes"'), "lesson detail UI should avoid graph-heavy theme wording");
assert.ok(!lessonApp.includes("Open the Bible Explorer"), "lesson detail Connections should not expose the full graph explorer");
assert.ok(lessonPage.includes('href="/bible/explorer/"'), "lesson page should link to Bible Explorer");

assert.ok(explorerPage.includes("Bible Explorer"), "Bible Explorer should have a clear title");
assert.ok(explorerApp.includes("browse people"), "Bible Explorer app should support people browsing");
assert.ok(explorerApp.includes("browse places"), "Bible Explorer app should support places browsing");
assert.ok(explorerApp.includes("browse themes"), "Bible Explorer app should support theme browsing");
assert.ok(explorerApp.includes("browse events"), "Bible Explorer app should support event browsing");

console.log("Bible knowledge layer validation passed.");
