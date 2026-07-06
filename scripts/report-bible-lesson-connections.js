const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const root = process.cwd();
const lessonsRoot = join(root, "public", "data", "bible_lessons");
const graphRoot = join(root, "public", "data", "bible_graph");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function main() {
  const lessonIndex = readJson(join(lessonsRoot, "index.json"));
  const graphIndex = readJson(join(graphRoot, "index.json"));
  const lessonRows = lessonIndex.lessons.map((entry) => {
    const lesson = readJson(join(lessonsRoot, entry.file));
    return {
      id: lesson.lesson_id,
      title: lesson.title,
      people: lesson.people?.length || 0,
      places: lesson.places?.length || 0,
      themes: lesson.themes?.length || 0,
      events: lesson.events?.length || 0,
      related_lessons: lesson.related_lessons?.length || 0,
      related_graph_nodes: lesson.related_graph_nodes?.length || 0,
    };
  });

  const missing = lessonRows.filter((row) => row.events === 0 || row.themes === 0 || row.related_graph_nodes === 0);
  const noPeople = lessonRows.filter((row) => row.people === 0);
  const noPlaces = lessonRows.filter((row) => row.places === 0);
  const strongest = [...lessonRows].sort((a, b) => b.related_graph_nodes - a.related_graph_nodes || a.title.localeCompare(b.title)).slice(0, 12);

  console.log("Bible Lesson Connection Report");
  console.log("==============================");
  console.log(`Lessons checked: ${lessonRows.length}`);
  console.log(`Graph nodes available: ${Object.values(graphIndex.node_counts).reduce((sum, count) => sum + count, 0)}`);
  console.log(`Lessons missing required graph links: ${missing.length}`);
  console.log(`Lessons without people links: ${noPeople.length}`);
  console.log(`Lessons without place links: ${noPlaces.length}`);
  console.log("");
  console.log("Most connected lessons:");
  for (const row of strongest) {
    console.log(`- ${row.title}: ${row.related_graph_nodes} graph links (${row.people} people, ${row.places} places, ${row.themes} themes, ${row.events} events)`);
  }
  if (missing.length > 0) {
    console.log("");
    console.log("Missing required links:");
    for (const row of missing) {
      console.log(`- ${row.id}: events=${row.events}, themes=${row.themes}, related_graph_nodes=${row.related_graph_nodes}`);
    }
  }
}

main();
