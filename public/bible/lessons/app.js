import { graphNode, loadBibleGraph, loadLesson, loadLessonIndex, recommendLessonsFor } from "./lesson-loader.js";

const ageLabels = {
  age_5_7: "Ages 5-7",
  age_8_11: "Ages 8-11",
  teens: "Teens",
};

const ageExplanationFields = {
  age_5_7: "age_5_7_explanation",
  age_8_11: "age_8_11_explanation",
  teens: "teen_explanation",
};

const tabLabels = {
  read: "Read It",
  tell: "Tell It",
  understand: "Understand It",
  live: "Live It",
  play: "Play It",
  teacher: "Teacher Notes",
};

const elements = {
  lessonSearch: document.querySelector("#lessonSearch"),
  filterAdvancedToggle: document.querySelector("#filterAdvancedToggle"),
  advancedFilterGrid: document.querySelector("#advancedFilterGrid"),
  ageFilter: document.querySelector("#ageFilter"),
  collectionFilter: document.querySelector("#collectionFilter"),
  bookFilter: document.querySelector("#bookFilter"),
  testamentFilter: document.querySelector("#testamentFilter"),
  topicFilter: document.querySelector("#topicFilter"),
  difficultyFilter: document.querySelector("#difficultyFilter"),
  lessonCount: document.querySelector("#lessonCount"),
  lessonListPanel: document.querySelector(".lesson-list-panel"),
  lessonListToggle: document.querySelector("#lessonListToggle"),
  lessonList: document.querySelector("#lessonList"),
  loadMoreLessons: document.querySelector("#loadMoreLessons"),
  lessonDetail: document.querySelector("#lessonDetail"),
};

const state = {
  lessonIndex: null,
  bibleGraph: null,
  lessonSummaries: [],
  loadedLessons: new Map(),
  activeLessonId: null,
  activeTab: "read",
  visibleLessonCount: 30,
};

const mobileLessonsQuery = window.matchMedia("(max-width: 760px)");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function currentAgeMode() {
  return elements.ageFilter.value || "age_8_11";
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function optionHtml(value, label = value) {
  return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
}

function hydrateFilterOptions() {
  const collections = uniqueSorted(state.lessonSummaries.map((lesson) => lesson.collection));
  const books = uniqueSorted(state.lessonSummaries.map((lesson) => lesson.bible_book));
  const testaments = uniqueSorted(state.lessonSummaries.map((lesson) => lesson.testament));
  const topics = uniqueSorted(state.lessonSummaries.flatMap((lesson) => lesson.tags));
  const difficulties = uniqueSorted(state.lessonSummaries.map((lesson) => lesson.difficulty));

  elements.collectionFilter.innerHTML = optionHtml("all", "All lesson packs") + collections.map((collection) => optionHtml(collection, collectionLabel(collection))).join("");
  elements.bookFilter.innerHTML = optionHtml("all", "All books") + books.map((book) => optionHtml(book)).join("");
  elements.testamentFilter.innerHTML = optionHtml("all", "Both testaments") + testaments.map((testament) => optionHtml(testament)).join("");
  elements.topicFilter.innerHTML = optionHtml("all", "All topics") + topics.map((topic) => optionHtml(topic)).join("");
  elements.difficultyFilter.innerHTML = optionHtml("all", "All difficulty") + difficulties.map((difficulty) => optionHtml(difficulty, titleCase(difficulty))).join("");
}

function titleCase(value) {
  return String(value).slice(0, 1).toUpperCase() + String(value).slice(1);
}

function collectionLabel(collectionId) {
  const pack = state.lessonIndex?.packs?.find((entry) => entry.id === collectionId);
  return pack?.name || titleCase(String(collectionId).replaceAll("-", " "));
}

function filteredLessons() {
  const search = elements.lessonSearch.value.trim().toLowerCase();
  const collection = elements.collectionFilter.value || "all";
  const book = elements.bookFilter.value || "all";
  const testament = elements.testamentFilter.value || "all";
  const topic = elements.topicFilter.value || "all";
  const difficulty = elements.difficultyFilter.value || "all";

  return state.lessonSummaries.filter((lesson) => {
    if (collection !== "all" && lesson.collection !== collection) return false;
    if (book !== "all" && lesson.bible_book !== book) return false;
    if (testament !== "all" && lesson.testament !== testament) return false;
    if (topic !== "all" && !lesson.tags.includes(topic)) return false;
    if (difficulty !== "all" && lesson.difficulty !== difficulty) return false;
    if (search && !lessonSearchText(lesson).includes(search)) return false;
    return true;
  });
}

function lessonSearchText(lesson) {
  return [
    lesson.title,
    lesson.passage,
    lesson.bible_book,
    lesson.testament,
    lesson.category,
    collectionLabel(lesson.collection),
    ...(lesson.tags || []),
  ].join(" ").toLowerCase();
}

function renderLessonList() {
  const lessons = filteredLessons();
  const visibleLessons = lessons.slice(0, state.visibleLessonCount);
  elements.lessonCount.textContent = lessons.length === 1
    ? "1 lesson"
    : visibleLessons.length < lessons.length
      ? `Showing ${visibleLessons.length} of ${lessons.length} lessons`
      : `${lessons.length} lessons`;

  if (lessons.length === 0) {
    elements.lessonList.innerHTML = `<p class="empty-state">No lessons match those filters yet.</p>`;
    elements.loadMoreLessons.hidden = true;
    return;
  }

  elements.lessonList.innerHTML = visibleLessons.map((lesson) => `
    <button class="lesson-card ${lesson.lesson_id === state.activeLessonId ? "active" : ""}" type="button" data-lesson-id="${escapeHtml(lesson.lesson_id)}">
      <span>${escapeHtml(lesson.passage)}</span>
      <strong>${escapeHtml(lesson.title)}</strong>
      <em>${escapeHtml(collectionLabel(lesson.collection))} - ${escapeHtml(lesson.tags.slice(0, 3).join(" / "))}</em>
    </button>
  `).join("");

  elements.loadMoreLessons.hidden = visibleLessons.length >= lessons.length;
  elements.loadMoreLessons.textContent = `Show ${Math.min(30, lessons.length - visibleLessons.length)} more lessons`;
}

function syncAdvancedFilterToggle() {
  const isCollapsed = elements.advancedFilterGrid.classList.contains("collapsed");
  elements.filterAdvancedToggle.setAttribute("aria-expanded", String(!isCollapsed));
  elements.filterAdvancedToggle.textContent = isCollapsed ? "More filters" : "Fewer filters";
}

function syncLessonListToggle() {
  const isCollapsed = elements.lessonListPanel.classList.contains("collapsed");
  elements.lessonListToggle.setAttribute("aria-expanded", String(!isCollapsed));
  elements.lessonListToggle.textContent = isCollapsed ? "Browse lessons" : "Hide lessons";
}

function summaryForLesson(lessonId) {
  return state.lessonSummaries.find((lesson) => lesson.lesson_id === lessonId);
}

async function selectLesson(lessonId, { replaceUrl = true, fromLibrary = false } = {}) {
  const summary = summaryForLesson(lessonId) || state.lessonSummaries[0];
  if (!summary) return;

  if (!state.loadedLessons.has(summary.lesson_id)) {
    state.loadedLessons.set(summary.lesson_id, await loadLesson(summary.file));
  }

  state.activeLessonId = summary.lesson_id;
  renderLessonList();
  renderLessonDetail(state.loadedLessons.get(summary.lesson_id));

  if (replaceUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("lesson", summary.lesson_id);
    history.replaceState(null, "", url);
  }

  if (fromLibrary && mobileLessonsQuery.matches) {
    elements.lessonListPanel.classList.add("collapsed");
    syncLessonListToggle();
    elements.lessonDetail.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderLessonDetail(lesson) {
  const ageMode = currentAgeMode();
  const ageExplanation = lesson[ageExplanationFields[ageMode]];

  elements.lessonDetail.innerHTML = `
    <header class="detail-head">
      <div>
        <p class="eyebrow">${escapeHtml(lesson.category)} / ${escapeHtml(ageLabels[ageMode])}</p>
        <h2>${escapeHtml(lesson.title)}</h2>
        <p>${escapeHtml(lesson.summary)}</p>
      </div>
      <div class="lesson-meta">
        <span>${escapeHtml(lesson.testament)}</span>
        <span>${escapeHtml(titleCase(lesson.difficulty))}</span>
        <span>${escapeHtml(String(lesson.estimated_minutes))} min</span>
      </div>
    </header>
    <nav class="lesson-tabs" aria-label="Lesson sections">
      ${Object.entries(tabLabels).map(([tabId, label]) => `
        <button class="${tabId === state.activeTab ? "active" : ""}" type="button" data-tab="${escapeHtml(tabId)}">${escapeHtml(label)}</button>
      `).join("")}
    </nav>
    <section class="tab-panel">
      ${renderTabPanel(lesson, state.activeTab, ageExplanation)}
    </section>
    ${renderConnectionsSection(lesson)}
  `;
}

function renderConnectionsSection(lesson) {
  const people = selectKidPeople(lesson);
  const themes = selectKidThemes(lesson);
  const recommendations = recommendLessonsFor(lesson, state.lessonSummaries, state.bibleGraph, 3);

  return `
    <section class="connections-panel" aria-label="Lesson connections">
      <div class="connections-head">
        <span>Connections</span>
        <h3>See How This Story Fits</h3>
      </div>
      <div class="connections-grid">
        ${renderConnectionGroup("People to Know", people, "person")}
        ${renderConnectionGroup("Big Ideas", themes, "theme")}
        <article class="connection-group try-next">
          <h4>Try Next</h4>
          <div class="connection-links">
            ${recommendations.length > 0
              ? recommendations.map((summary) => `
                <button type="button" data-lesson-id="${escapeHtml(summary.lesson_id)}">
                  <strong>${escapeHtml(summary.title)}</strong>
                  <span>${escapeHtml(summary.passage)}</span>
                </button>
              `).join("")
              : `<p>No next lesson found yet.</p>`}
          </div>
        </article>
      </div>
    </section>
  `;
}

function graphNodesFor(folder, ids = []) {
  return ids
    .map((id) => graphNode(state.bibleGraph, folder, id))
    .filter(Boolean);
}

function selectKidPeople(lesson) {
  const people = graphNodesFor("people", lesson.people);
  return people
    .map((node, index) => ({
      node,
      score: connectionPriority(node, lesson.title, index),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((entry) => entry.node);
}

function selectKidThemes(lesson) {
  const themeIds = (lesson.tags || lesson.themes || []).map(slugifyGraphId);
  const orderedThemes = graphNodesFor("themes", themeIds);
  const fallbackThemes = graphNodesFor("themes", lesson.themes);
  return uniqueNodes([...orderedThemes, ...fallbackThemes]).slice(0, 3);
}

function connectionPriority(node, title, index) {
  const titleText = String(title || "").toLowerCase();
  const nodeName = String(node.name || "").toLowerCase();
  const titleMatch = titleText.includes(nodeName) ? 100 : 0;
  const jesusPriority = node.id === "jesus" ? 90 : 0;
  return titleMatch + jesusPriority - index;
}

function slugifyGraphId(value) {
  return String(value || "")
    .toLowerCase()
    .replaceAll("'", "")
    .replaceAll("’", "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueNodes(nodes) {
  const seen = new Set();
  return nodes.filter((node) => {
    if (!node || seen.has(node.id)) return false;
    seen.add(node.id);
    return true;
  });
}

function renderConnectionGroup(title, nodes, type) {
  return `
    <article class="connection-group">
      <h4>${escapeHtml(title)}</h4>
      ${nodes.length > 0
        ? nodes.map((node) => `
          <a class="connection-chip" href="/bible/explorer/?type=${escapeHtml(type)}&id=${escapeHtml(node.id)}">
            <strong>${escapeHtml(node.name)}</strong>
            <span>${escapeHtml(node.kid_summary || node.summary)}</span>
          </a>
        `).join("")
        : `<p>No ${escapeHtml(title.toLowerCase())} links yet.</p>`}
    </article>
  `;
}

function renderTabPanel(lesson, tabId, ageExplanation) {
  if (tabId === "read") {
    return `
      <h3>Read It</h3>
      <p class="passage-chip">${escapeHtml(lesson.passage)}</p>
      <p>${escapeHtml(lesson.read_it?.prompt || `Read ${lesson.passage}.`)}</p>
      <a class="reader-link" href="${readerHref(lesson.passage)}">Open this passage in the Digital Bible</a>
    `;
  }

  if (tabId === "tell") {
    return `
      <h3>Tell It</h3>
      <p>${escapeHtml(lesson.tell_it)}</p>
      <div class="age-box">
        <strong>${escapeHtml(ageLabels[currentAgeMode()])}</strong>
        <p>${escapeHtml(ageExplanation)}</p>
      </div>
    `;
  }

  if (tabId === "understand") {
    return `
      <h3>Understand It</h3>
      <p>${escapeHtml(lesson.understand_it)}</p>
      <ul class="truth-list">
        ${lesson.key_truths.map((truth) => `<li>${escapeHtml(truth)}</li>`).join("")}
      </ul>
    `;
  }

  if (tabId === "live") {
    return `
      <h3>Live It</h3>
      <p>${escapeHtml(lesson.life_application)}</p>
      <div class="prompt-card">
        <span>Try this</span>
        <strong>Tell one trusted adult how this lesson could help you this week.</strong>
      </div>
    `;
  }

  if (tabId === "play") {
    return `
      <h3>Play It</h3>
      <div class="quiz-stack">
        ${lesson.quiz_questions.map((question, index) => `
          <article class="quiz-card">
            <span>${escapeHtml(question.type.replaceAll("_", " "))}</span>
            <h4>${index + 1}. ${escapeHtml(question.question)}</h4>
            ${question.choices ? `<p>${escapeHtml(question.choices.join(" / "))}</p>` : ""}
            <details>
              <summary>Show answer</summary>
              <strong>${escapeHtml(question.answer)}</strong>
              <p>${escapeHtml(question.explanation)}</p>
            </details>
          </article>
        `).join("")}
      </div>
      <div class="memory-card">
        <span>Memory Verse</span>
        <strong>${escapeHtml(lesson.memory_verse.reference)}</strong>
        <p>${escapeHtml(lesson.memory_verse.prompt)}</p>
      </div>
    `;
  }

  return `
    <h3>Teacher Notes</h3>
    <div class="teacher-grid">
      <section>
        <h4>Discussion Questions</h4>
        <ol>
          ${lesson.discussion_questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}
        </ol>
      </section>
      <section>
        <h4>Simple Activity</h4>
        <strong>${escapeHtml(lesson.activity.title)}</strong>
        <p>${escapeHtml(lesson.activity.instructions)}</p>
      </section>
      <section>
        <h4>Prayer Prompt</h4>
        <p>${escapeHtml(lesson.prayer_prompt)}</p>
      </section>
      <section>
        <h4>Teaching Notes</h4>
        <p>${escapeHtml(titleCase(lesson.difficulty))} / ${escapeHtml(String(lesson.estimated_minutes))} minutes</p>
        <p>${escapeHtml(lesson.tags.join(", "))}</p>
      </section>
    </div>
  `;
}

function readerHref(passage) {
  const match = String(passage).match(/^([1-3]?\s?[A-Za-z]+)\s+(\d+)/);
  if (!match) return "/bible/";

  const bookSlug = match[1].toLowerCase().replace(/\s+/g, "-");
  const chapter = match[2];
  return `/bible/#bsb.${bookSlug}.${chapter}`;
}

function wireEvents() {
  for (const element of [
    elements.bookFilter,
    elements.collectionFilter,
    elements.ageFilter,
    elements.testamentFilter,
    elements.topicFilter,
    elements.difficultyFilter,
  ]) {
    element.addEventListener("change", () => {
      state.visibleLessonCount = 30;
      renderLessonList();
      const activeLesson = state.loadedLessons.get(state.activeLessonId);
      if (activeLesson) renderLessonDetail(activeLesson);
    });
  }

  elements.lessonSearch.addEventListener("input", () => {
    state.visibleLessonCount = 30;
    renderLessonList();
  });

  elements.filterAdvancedToggle.addEventListener("click", () => {
    elements.advancedFilterGrid.classList.toggle("collapsed");
    syncAdvancedFilterToggle();
  });

  elements.lessonList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lesson-id]");
    if (!button) return;
    selectLesson(button.dataset.lessonId, { fromLibrary: true });
  });

  elements.lessonListToggle.addEventListener("click", () => {
    elements.lessonListPanel.classList.toggle("collapsed");
    syncLessonListToggle();
  });

  elements.loadMoreLessons.addEventListener("click", () => {
    state.visibleLessonCount += 30;
    renderLessonList();
  });

  elements.lessonDetail.addEventListener("click", (event) => {
    const lessonButton = event.target.closest("[data-lesson-id]");
    if (lessonButton) {
      selectLesson(lessonButton.dataset.lessonId, { fromLibrary: true });
      return;
    }

    const button = event.target.closest("[data-tab]");
    if (!button) return;
    state.activeTab = button.dataset.tab;
    const activeLesson = state.loadedLessons.get(state.activeLessonId);
    if (activeLesson) renderLessonDetail(activeLesson);
  });

  syncLessonListToggle();
  syncAdvancedFilterToggle();
}

async function init() {
  const [lessonIndex, bibleGraph] = await Promise.all([
    loadLessonIndex(),
    loadBibleGraph(),
  ]);
  state.lessonIndex = lessonIndex;
  state.bibleGraph = bibleGraph;
  state.lessonSummaries = state.lessonIndex.lessons;
  hydrateFilterOptions();
  wireEvents();
  renderLessonList();

  const requestedLesson = new URLSearchParams(window.location.search).get("lesson");
  await selectLesson(requestedLesson || state.lessonSummaries[0]?.lesson_id, { replaceUrl: false });
}

init().catch((error) => {
  elements.lessonDetail.innerHTML = `
    <div class="detail-empty">
      <h2>Lessons unavailable</h2>
      <p>${escapeHtml(error.message)}</p>
    </div>
  `;
});
