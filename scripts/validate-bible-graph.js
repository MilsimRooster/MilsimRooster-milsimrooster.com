const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");

const root = process.cwd();
const graphRoot = join(root, "public", "data", "bible_graph");
const lessonsRoot = join(root, "public", "data", "bible_lessons");

const folders = {
  person: "people",
  place: "places",
  theme: "themes",
  event: "events",
  miracle: "miracles",
  parable: "parables",
  prophecy: "prophecies",
  command: "commands",
  promise: "promises",
  object: "objects",
  memory_verse: "memory_verses",
  quiz_bank: "quiz_banks",
};

const pluralToType = Object.fromEntries(Object.entries(folders).map(([type, folder]) => [folder, type]));

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function main() {
  assert.ok(existsSync(graphRoot), "Bible graph root should exist");
  const schema = readJson(join(graphRoot, "schema.json"));
  const graphIndex = readJson(join(graphRoot, "index.json"));
  const lessonIndex = readJson(join(lessonsRoot, "index.json"));
  const lessonIds = new Set(lessonIndex.lessons.map((lesson) => lesson.lesson_id));

  assert.equal(schema.schema_version, "bible-graph/v1", "graph schema should use bible-graph/v1");
  assert.equal(graphIndex.schema_version, "bible-graph-index/v1", "graph index should use bible-graph-index/v1");
  assert.ok(graphIndex.node_counts.people >= 30, "graph should include at least 30 people");
  assert.ok(graphIndex.node_counts.places >= 12, "graph should include at least 12 places");
  assert.ok(graphIndex.node_counts.themes >= 20, "graph should include at least 20 themes");
  assert.ok(graphIndex.node_counts.events >= 20, "graph should include at least 20 events");

  const nodeIdsByFolder = new Map();
  const allNodes = [];
  for (const [folder, nodes] of Object.entries(graphIndex.nodes)) {
    assert.ok(folders[pluralToType[folder]], `graph index folder ${folder} should be known`);
    assert.ok(existsSync(join(graphRoot, folder)), `${folder} folder should exist`);
    nodeIdsByFolder.set(folder, new Set(nodes.map((node) => node.id)));

    for (const compactNode of nodes) {
      const path = join(graphRoot, compactNode.file);
      assert.ok(existsSync(path), `${compactNode.type}:${compactNode.id} should have a JSON file`);
      const node = readJson(path);
      allNodes.push({ folder, node });
      assert.equal(node.id, compactNode.id, `${compactNode.file} should declare matching id`);
      assert.equal(node.type, pluralToType[folder], `${compactNode.file} should declare matching type`);
      assert.ok(node.name, `${compactNode.file} should include name`);
      assert.ok(node.summary, `${compactNode.file} should include summary`);
    }
  }

  for (const entry of lessonIndex.lessons) {
    const lesson = readJson(join(lessonsRoot, entry.file));
    for (const field of ["people", "places", "themes", "events", "related_graph_nodes"]) {
      assert.ok(Array.isArray(lesson[field]), `${lesson.lesson_id} should include graph field ${field}`);
    }
    assert.ok(lesson.themes.length >= 1, `${lesson.lesson_id} should link at least one theme`);
    assert.ok(lesson.events.length >= 1, `${lesson.lesson_id} should link at least one event`);
    assert.ok(Array.isArray(lesson.related_lessons), `${lesson.lesson_id} should include related lessons`);

    assertRefsExist(lesson, "people", "people", nodeIdsByFolder);
    assertRefsExist(lesson, "places", "places", nodeIdsByFolder);
    assertRefsExist(lesson, "themes", "themes", nodeIdsByFolder);
    assertRefsExist(lesson, "events", "events", nodeIdsByFolder);

    for (const ref of lesson.related_graph_nodes) {
      const [type, id] = String(ref).split(":");
      assert.ok(type && id, `${lesson.lesson_id} related_graph_nodes entry ${ref} should use type:id`);
      const folder = folders[type];
      assert.ok(folder, `${lesson.lesson_id} related_graph_nodes entry ${ref} should use a known type`);
      assert.ok(nodeIdsByFolder.get(folder)?.has(id), `${lesson.lesson_id} related graph node ${ref} should exist`);
    }

    for (const relatedLessonId of lesson.related_lessons) {
      assert.ok(lessonIds.has(relatedLessonId), `${lesson.lesson_id} related lesson ${relatedLessonId} should exist`);
    }
  }

  for (const { folder, node } of allNodes) {
    for (const field of ["lessons", "related_lessons", "lesson_ids"]) {
      for (const lessonId of asArray(node[field])) {
        assert.ok(lessonIds.has(lessonId), `${node.type}:${node.id} references missing lesson ${lessonId}`);
      }
    }

    assertNodeRefs(node, "people", "people", nodeIdsByFolder);
    assertNodeRefs(node, "related_people", "people", nodeIdsByFolder);
    assertNodeRefs(node, "places", "places", nodeIdsByFolder);
    assertNodeRefs(node, "related_places", "places", nodeIdsByFolder);
    assertNodeRefs(node, "themes", "themes", nodeIdsByFolder);
    assertNodeRefs(node, "major_events", "events", nodeIdsByFolder);
    assertNodeRefs(node, "related_events", "events", nodeIdsByFolder);
    assertNodeRefs(node, "memory_verses", "memory_verses", nodeIdsByFolder);

    if (folder === "events") {
      assert.ok(Number.isInteger(node.timeline_order), `event:${node.id} should include numeric timeline_order`);
    }
  }

  const danielLesson = readJson(join(lessonsRoot, "daniel-in-the-lions-den.json"));
  assert.ok(danielLesson.people.includes("daniel"), "Daniel lesson should link to Daniel");
  assert.ok(danielLesson.places.includes("babylon"), "Daniel lesson should link to Babylon");
  for (const theme of ["prayer", "courage", "faithfulness"]) {
    assert.ok(danielLesson.themes.includes(theme), `Daniel lesson should link to ${theme}`);
  }
  assert.ok(danielLesson.related_lessons.includes("fiery-furnace"), "Daniel lesson should recommend Fiery Furnace");

  console.log(`Bible graph validation passed. Nodes: ${allNodes.length}. Lessons checked: ${lessonIndex.lessons.length}.`);
}

function assertRefsExist(lesson, field, folder, nodeIdsByFolder) {
  for (const id of lesson[field]) {
    assert.ok(nodeIdsByFolder.get(folder)?.has(id), `${lesson.lesson_id} ${field} reference ${id} should exist`);
  }
}

function assertNodeRefs(node, field, folder, nodeIdsByFolder) {
  for (const id of asArray(node[field])) {
    assert.ok(nodeIdsByFolder.get(folder)?.has(id), `${node.type}:${node.id} ${field} reference ${id} should exist`);
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

main();
