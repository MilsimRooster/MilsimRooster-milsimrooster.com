const GRAPH_DATA_BASE = "/data/bible_graph/";
const LESSON_DATA_BASE = "/data/bible_lessons/";

const browseLabels = {
  people: "browse people",
  places: "browse places",
  themes: "browse themes",
  events: "browse events",
};

const visibleTypes = [
  ["people", "People"],
  ["places", "Places"],
  ["themes", "Themes"],
  ["events", "Events"],
];

const elements = {
  search: document.querySelector("#graphSearch"),
  typeTabs: document.querySelector("#typeTabs"),
  nodeList: document.querySelector("#nodeList"),
  nodeDetail: document.querySelector("#nodeDetail"),
};

const state = {
  graph: null,
  lessonIndex: null,
  activeFolder: "people",
  activeNodeId: null,
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}: ${response.status}`);
  return response.json();
}

function allNodes() {
  return Object.entries(state.graph?.nodes || {}).flatMap(([folder, nodes]) => nodes.map((node) => ({ ...node, folder })));
}

function activeNodes() {
  const query = elements.search.value.trim().toLowerCase();
  const pool = query ? allNodes() : state.graph.nodes[state.activeFolder] || [];
  return pool
    .filter((node) => !query || nodeSearchText(node).includes(query))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function nodeSearchText(node) {
  return [
    node.name,
    node.type,
    node.summary,
    node.kid_summary,
    node.passage,
    node.reference,
    ...(node.themes || []),
    ...(node.lessons || []),
  ].join(" ").toLowerCase();
}

function renderTabs() {
  elements.typeTabs.innerHTML = visibleTypes.map(([folder, label]) => `
    <button class="${folder === state.activeFolder ? "active" : ""}" type="button" data-folder="${escapeHtml(folder)}">
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(String(state.graph.node_counts[folder] || 0))}</span>
    </button>
  `).join("");
}

function renderNodeList() {
  const nodes = activeNodes();
  if (nodes.length === 0) {
    elements.nodeList.innerHTML = `<p class="empty-state">No graph nodes found.</p>`;
    return;
  }

  elements.nodeList.innerHTML = nodes.map((node) => `
    <button class="${node.id === state.activeNodeId ? "active" : ""}" type="button" data-folder="${escapeHtml(node.folder || state.activeFolder)}" data-node-id="${escapeHtml(node.id)}">
      <span>${escapeHtml(typeLabel(node.type))}</span>
      <strong>${escapeHtml(node.name)}</strong>
      <em>${escapeHtml(node.kid_summary || node.summary)}</em>
    </button>
  `).join("");
}

function renderNodeDetail() {
  const node = selectedNode();
  if (!node) {
    const first = activeNodes()[0];
    if (first) {
      selectNode(first.folder || state.activeFolder, first.id, { replaceUrl: false });
      return;
    }
    elements.nodeDetail.innerHTML = `<h2>Nothing selected</h2>`;
    return;
  }

  const relatedLessons = lessonsForNode(node);
  const relatedQuestions = quizBanksForNode(node, relatedLessons.map((lesson) => lesson.lesson_id));
  const people = relatedNodes("people", node.people || node.related_people);
  const places = relatedNodes("places", node.places || node.related_places);
  const themes = relatedNodes("themes", node.themes);
  const events = relatedNodes("events", node.events || node.major_events || node.related_events);

  elements.nodeDetail.innerHTML = `
    <header class="detail-head">
      <span>${escapeHtml(typeLabel(node.type))}</span>
      <h2>${escapeHtml(node.name)}</h2>
      <p>${escapeHtml(node.kid_summary || node.summary)}</p>
      ${node.passage || node.reference ? `<a class="passage-link" href="${readerHref(node.passage || node.reference)}">${escapeHtml(node.passage || node.reference)}</a>` : ""}
    </header>

    <section class="detail-grid">
      ${renderDetailGroup("People", people)}
      ${renderDetailGroup("Places", places)}
      ${renderDetailGroup("Themes", themes)}
      ${renderDetailGroup("Events", events)}
    </section>

    <section class="lesson-strip">
      <h3>Related Lessons</h3>
      ${relatedLessons.length > 0
        ? relatedLessons.map((lesson) => `
          <a href="/bible/lessons/?lesson=${escapeHtml(lesson.lesson_id)}">
            <strong>${escapeHtml(lesson.title)}</strong>
            <span>${escapeHtml(lesson.passage)} / ${escapeHtml(lesson.difficulty)}</span>
          </a>
        `).join("")
        : `<p>No related lessons yet.</p>`}
    </section>

    <section class="question-strip">
      <h3>Related Quiz Questions</h3>
      ${relatedQuestions.length > 0
        ? relatedQuestions.map((question) => `
          <article>
            <span>${escapeHtml(question.bankName)}</span>
            <strong>${escapeHtml(question.question)}</strong>
            <p>${escapeHtml(question.answer)}</p>
          </article>
        `).join("")
        : `<p>No related quiz questions yet.</p>`}
    </section>
  `;
}

function selectedNode() {
  return allNodes().find((node) => node.folder === state.activeFolder && node.id === state.activeNodeId)
    || allNodes().find((node) => node.id === state.activeNodeId);
}

function typeLabel(type) {
  return String(type || "node").replaceAll("_", " ");
}

function lessonsForNode(node) {
  const lessonIds = new Set(node.lessons || []);
  for (const id of node.related_lessons || []) lessonIds.add(id);
  for (const id of node.lesson_ids || []) lessonIds.add(id);
  return state.lessonIndex.lessons.filter((lesson) => lessonIds.has(lesson.lesson_id)).slice(0, 12);
}

function quizBanksForNode(node, lessonIds) {
  const lessonSet = new Set(lessonIds);
  return (state.graph.nodes.quiz_banks || [])
    .filter((bank) => bank.lesson_ids?.some((lessonId) => lessonSet.has(lessonId)) || node.type === "quiz_bank")
    .flatMap((bank) => (bank.questions || [])
      .filter((question) => lessonSet.has(question.lesson_id) || node.type === "quiz_bank")
      .slice(0, 6)
      .map((question) => ({ ...question, bankName: bank.name })))
    .slice(0, 6);
}

function relatedNodes(folder, ids = []) {
  const idSet = new Set(ids || []);
  return (state.graph.nodes[folder] || [])
    .filter((node) => idSet.has(node.id))
    .map((node) => ({ ...node, folder }))
    .slice(0, 8);
}

function renderDetailGroup(title, nodes) {
  return `
    <section>
      <h3>${escapeHtml(title)}</h3>
      ${nodes.length > 0
        ? nodes.map((node) => `
          <button type="button" data-folder="${escapeHtml(node.folder)}" data-node-id="${escapeHtml(node.id)}">
            <strong>${escapeHtml(node.name)}</strong>
            <span>${escapeHtml(node.kid_summary || node.summary)}</span>
          </button>
        `).join("")
        : `<p>No ${escapeHtml(title.toLowerCase())} links yet.</p>`}
    </section>
  `;
}

function readerHref(reference) {
  const match = String(reference || "").match(/^([1-3]?\s?[A-Za-z]+)\s+(\d+)/);
  if (!match) return "/bible/";
  return `/bible/#kjv.${match[1].toLowerCase().replace(/\s+/g, "-")}.${match[2]}`;
}

function selectNode(folder, id, { replaceUrl = true } = {}) {
  state.activeFolder = folder;
  state.activeNodeId = id;
  renderTabs();
  renderNodeList();
  renderNodeDetail();

  if (replaceUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("type", folderSingular(folder));
    url.searchParams.set("id", id);
    history.replaceState(null, "", url);
  }
}

function folderFromType(type) {
  const normalized = String(type || "").replaceAll("_", "-");
  if (normalized === "person") return "people";
  if (normalized === "place") return "places";
  if (normalized === "theme") return "themes";
  if (normalized === "event") return "events";
  return visibleTypes.some(([folder]) => folder === type) ? type : "people";
}

function folderSingular(folder) {
  if (folder === "people") return "person";
  if (folder === "places") return "place";
  if (folder === "themes") return "theme";
  if (folder === "events") return "event";
  return folder;
}

function wireEvents() {
  elements.typeTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-folder]");
    if (!button) return;
    state.activeFolder = button.dataset.folder;
    state.activeNodeId = state.graph.nodes[state.activeFolder]?.[0]?.id || null;
    elements.search.value = "";
    renderTabs();
    renderNodeList();
    renderNodeDetail();
  });

  elements.nodeList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-node-id]");
    if (!button) return;
    selectNode(button.dataset.folder, button.dataset.nodeId);
  });

  elements.nodeDetail.addEventListener("click", (event) => {
    const button = event.target.closest("[data-node-id]");
    if (!button) return;
    selectNode(button.dataset.folder, button.dataset.nodeId);
  });

  elements.search.addEventListener("input", () => {
    renderNodeList();
  });
}

async function init() {
  const [graph, lessonIndex] = await Promise.all([
    fetchJson(`${GRAPH_DATA_BASE}index.json`),
    fetchJson(`${LESSON_DATA_BASE}index.json`),
  ]);
  state.graph = graph;
  state.lessonIndex = lessonIndex;

  const params = new URLSearchParams(window.location.search);
  state.activeFolder = folderFromType(params.get("type"));
  state.activeNodeId = params.get("id") || state.graph.nodes[state.activeFolder]?.[0]?.id || null;

  wireEvents();
  renderTabs();
  renderNodeList();
  renderNodeDetail();
}

init().catch((error) => {
  elements.nodeDetail.innerHTML = `
    <h2>Explorer unavailable</h2>
    <p>${escapeHtml(error.message)}</p>
  `;
});
