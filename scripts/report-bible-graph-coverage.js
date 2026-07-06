const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const root = process.cwd();
const graphRoot = join(root, "public", "data", "bible_graph");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function main() {
  const index = readJson(join(graphRoot, "index.json"));
  const allNodes = Object.entries(index.nodes).flatMap(([folder, nodes]) => nodes.map((node) => ({ folder, ...node })));
  const people = index.nodes.people || [];
  const themes = index.nodes.themes || [];
  const noLessonNodes = allNodes.filter((node) => !Array.isArray(node.lessons) || node.lessons.length === 0);

  const mostConnectedPeople = people
    .map((node) => ({ name: node.name, id: node.id, count: node.lessons?.length || 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 10);

  const mostConnectedThemes = themes
    .map((node) => ({ name: node.name, id: node.id, count: node.lessons?.length || 0 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 10);

  console.log("Bible Graph Coverage");
  console.log("====================");
  console.log(`Total graph nodes: ${allNodes.length}`);
  for (const [folder, count] of Object.entries(index.node_counts)) {
    console.log(`${label(folder)} count: ${count}`);
  }
  console.log("");
  console.log(`Graph nodes with no related lesson: ${noLessonNodes.length}`);
  for (const node of noLessonNodes.slice(0, 20)) {
    console.log(`- ${node.type}:${node.id} (${node.name})`);
  }
  if (noLessonNodes.length > 20) {
    console.log(`- ...${noLessonNodes.length - 20} more`);
  }
  console.log("");
  console.log("Most connected people:");
  for (const node of mostConnectedPeople) {
    console.log(`- ${node.name}: ${node.count} lessons`);
  }
  console.log("");
  console.log("Most connected themes:");
  for (const node of mostConnectedThemes) {
    console.log(`- ${node.name}: ${node.count} lessons`);
  }
}

function label(folder) {
  return folder
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

main();
