const LESSON_DATA_BASE = "/data/bible_lessons/";
const GRAPH_DATA_BASE = "/data/bible_graph/";

export async function loadLessonIndex() {
  const response = await fetch(`${LESSON_DATA_BASE}index.json`);
  if (!response.ok) {
    throw new Error(`Could not load Bible lesson index: ${response.status}`);
  }

  return response.json();
}

export async function loadBibleGraph() {
  const response = await fetch(`${GRAPH_DATA_BASE}index.json`);
  if (!response.ok) {
    throw new Error(`Could not load Bible knowledge graph: ${response.status}`);
  }

  return response.json();
}

export async function loadLesson(file) {
  const response = await fetch(`${LESSON_DATA_BASE}${file}`);
  if (!response.ok) {
    throw new Error(`Could not load Bible lesson: ${response.status}`);
  }

  return response.json();
}

export function graphNode(graph, folder, id) {
  return graph?.nodes?.[folder]?.find((node) => node.id === id) || null;
}

export function recommendLessonsFor(lesson, lessonSummaries, graph, limit = 4) {
  if (!lesson || !Array.isArray(lessonSummaries)) return [];

  const scores = new Map();
  for (const lessonId of lesson.related_lessons || []) {
    addScore(scores, lessonId, 10);
  }

  for (const eventId of lesson.events || []) {
    const event = graphNode(graph, "events", eventId);
    for (const lessonId of event?.lessons || []) addScore(scores, lessonId, 7);
  }

  for (const personId of lesson.people || []) {
    const person = graphNode(graph, "people", personId);
    for (const lessonId of person?.lessons || []) addScore(scores, lessonId, 5);
  }

  for (const themeId of lesson.themes || []) {
    const theme = graphNode(graph, "themes", themeId);
    for (const lessonId of theme?.lessons || []) addScore(scores, lessonId, 3);
  }

  const currentSummary = lessonSummaries.find((entry) => entry.lesson_id === lesson.lesson_id);
  for (const summary of lessonSummaries) {
    if (summary.lesson_id === lesson.lesson_id) continue;
    if (currentSummary && Math.abs(summary.sort_order - currentSummary.sort_order) === 1) {
      addScore(scores, summary.lesson_id, 2);
    }
    if (summary.difficulty === "easy" && lesson.difficulty !== "easy") {
      addScore(scores, summary.lesson_id, 1);
    }
  }

  return [...scores.entries()]
    .filter(([lessonId]) => lessonId !== lesson.lesson_id)
    .filter(([lessonId]) => lessonSummaries.some((summary) => summary.lesson_id === lessonId))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([lessonId]) => lessonSummaries.find((summary) => summary.lesson_id === lessonId));
}

function addScore(scores, lessonId, amount) {
  if (!lessonId) return;
  scores.set(lessonId, (scores.get(lessonId) || 0) + amount);
}

export { GRAPH_DATA_BASE, LESSON_DATA_BASE };
