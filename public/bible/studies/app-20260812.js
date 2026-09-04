import { loadStudy, loadStudyIndex } from "./study-loader-20260812.js";

const translationLabels = {
  kjv: "King James Version",
  bsb: "Berean Standard Bible",
  niv: "New International Version",
  nlt: "New Living Translation",
  nasb: "New American Standard Bible 1995",
};

const cautionLabels = {
  genre: "Genre matters",
  scope: "Keep the claim in scope",
  "legitimate-dispute": "Where Christians differ",
  "pastoral-safety": "Pastoral safety",
  "textual-note": "Text and translation note",
};

const elements = {
  search: document.querySelector("#studySearch"),
  topicFilter: document.querySelector("#topicFilter"),
  translationSelect: document.querySelector("#translationSelect"),
  detail: document.querySelector("#studyDetail"),
  library: document.querySelector(".study-library"),
  libraryToggle: document.querySelector("#libraryToggle"),
  list: document.querySelector("#studyList"),
  count: document.querySelector("#studyCount"),
};

const state = {
  index: null,
  summaries: [],
  loaded: new Map(),
  activeStudyId: null,
};

const mobileQuery = window.matchMedia("(max-width: 760px)");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function hydrateTopics() {
  const topics = uniqueSorted(state.summaries.flatMap((study) => study.tags || []));
  elements.topicFilter.innerHTML = '<option value="all">All topics</option>'
    + topics.map((topic) => `<option value="${escapeHtml(topic)}">${escapeHtml(topic)}</option>`).join("");
}

function filteredStudies() {
  const query = elements.search.value.trim().toLowerCase();
  const topic = elements.topicFilter.value || "all";

  return state.summaries.filter((study) => {
    if (topic !== "all" && !(study.tags || []).includes(topic)) return false;
    if (!query) return true;
    return [study.title, study.category, ...(study.tags || [])].join(" ").toLowerCase().includes(query);
  });
}

function renderStudyList() {
  const studies = filteredStudies();
  elements.count.textContent = studies.length === 1 ? "1 study" : `${studies.length} studies`;

  if (!studies.length) {
    elements.list.innerHTML = '<p class="loading-card">No studies match those filters.</p>';
    return;
  }

  elements.list.innerHTML = studies.map((study) => `
    <button class="study-card ${study.study_id === state.activeStudyId ? "active" : ""}" type="button" data-study-id="${escapeHtml(study.study_id)}">
      <span>${escapeHtml(study.category)}</span>
      <strong>${escapeHtml(study.title)}</strong>
      <em>${escapeHtml(String(study.estimated_minutes))} min · ${escapeHtml((study.tags || []).slice(0, 3).join(" / "))}</em>
    </button>
  `).join("");
}

function normalizeReference(reference) {
  return {
    ...reference,
    end: reference.end || reference.start,
  };
}

function referenceLabel(reference) {
  const ref = normalizeReference(reference);
  if (ref.label) return ref.label;
  const sameVerse = ref.start.chapter === ref.end.chapter && ref.start.verse === ref.end.verse;
  const sameChapter = ref.start.chapter === ref.end.chapter;
  if (sameVerse) return `${ref.book} ${ref.start.chapter}:${ref.start.verse}`;
  if (sameChapter) return `${ref.book} ${ref.start.chapter}:${ref.start.verse}-${ref.end.verse}`;
  return `${ref.book} ${ref.start.chapter}:${ref.start.verse}-${ref.end.chapter}:${ref.end.verse}`;
}

function readerHref(reference) {
  const ref = normalizeReference(reference);
  const version = elements.translationSelect.value || "kjv";
  return `/bible/#${encodeURIComponent(version)}.${encodeURIComponent(ref.book_slug)}.${ref.start.chapter}.${ref.start.verse}`;
}

function renderReferenceLink(reference) {
  const label = referenceLabel(reference);
  const version = elements.translationSelect.value || "kjv";
  const translation = translationLabels[version] || translationLabels.kjv;
  return `<a class="reference-link" href="${readerHref(reference)}" target="_blank" rel="noopener" aria-label="Open ${escapeHtml(label)} in ${escapeHtml(translation)}">${escapeHtml(label)}</a>`;
}

function renderReferences(references) {
  return `<div class="reference-list">${references.map(renderReferenceLink).join("")}</div>`;
}

function renderClaims(claims) {
  return `<div class="claim-list">${claims.map((claim) => `
    <article class="claim-card">
      <p>${escapeHtml(claim.text)}</p>
      ${renderReferences(claim.supporting_references || [])}
    </article>
  `).join("")}</div>`;
}

function renderCautions(cautions) {
  return `<div class="claim-list">${cautions.map((caution) => `
    <article class="claim-card">
      <h4>${escapeHtml(cautionLabels[caution.kind] || "Interpretive caution")}</h4>
      <p>${escapeHtml(caution.text)}</p>
      ${renderReferences(caution.supporting_references || [])}
    </article>
  `).join("")}</div>`;
}

function renderStringList(items, ordered = false, className = "") {
  const tag = ordered ? "ol" : "ul";
  return `<${tag} class="${escapeHtml(className)}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
}

function renderStudy(study) {
  const editorialNotice = state.index?.editorial_notice || "Read the full passage and distinguish the text from interpretation and application.";
  const safetySection = study.pastoral_safety?.length ? `
    <section class="study-section caution-section">
      <h3>Pastoral Care and Safety</h3>
      <p class="section-intro">These safeguards prevent a true biblical principle from being used carelessly or harmfully.</p>
      ${renderStringList(study.pastoral_safety, false, "caution-list")}
    </section>
  ` : "";

  elements.detail.innerHTML = `
    <header class="detail-head">
      <div>
        <p class="detail-kicker">Adult Bible Study</p>
        <h2>${escapeHtml(study.title)}</h2>
        <p class="detail-purpose">${escapeHtml(study.summary)}</p>
      </div>
      <div class="study-meta">
        <span>${escapeHtml(String(study.estimated_minutes))} minutes</span>
        ${(study.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
      </div>
      <aside class="accuracy-note">
        <strong>How to use this study</strong>
        <p>${escapeHtml(editorialNotice)}</p>
      </aside>
    </header>

    <div class="study-body">
      <section class="study-section">
        <h3>Read the Passages</h3>
        <p class="section-intro">Open each passage and read the surrounding paragraph before working through the study.</p>
        ${renderReferences(study.primary_references || [])}
      </section>

      <section class="study-section observation-section">
        <h3>What the Passages Say</h3>
        <p class="section-intro">These observations stay close to the words, argument, and setting of the cited passages.</p>
        ${renderClaims(study.observations || [])}
      </section>

      <section class="study-section">
        <h3>What This Teaches</h3>
        <p class="section-intro">These conclusions bring the cited passages together without treating application as if it were quoted Scripture.</p>
        ${renderClaims(study.teaching || [])}
      </section>

      <section class="study-section interpretation-section">
        <h3>Interpretive Cautions</h3>
        <p class="section-intro">Context, genre, translation questions, and legitimate Christian disagreements are identified here.</p>
        ${renderCautions(study.interpretive_cautions || [])}
      </section>

      ${safetySection}

      <section class="study-section">
        <h3>Put It into Practice</h3>
        ${renderStringList(study.application || [], true, "application-list")}
      </section>

      <section class="study-section">
        <h3>Discuss and Reflect</h3>
        ${renderStringList(study.discussion || [])}
      </section>

      <section class="study-section">
        <h3>Prayer Prompt</h3>
        <p class="prayer-card">${escapeHtml(study.prayer)}</p>
      </section>
    </div>
  `;

  document.title = `${study.title} | Adult Bible Studies`;
}

async function selectStudy(studyId, { updateUrl = true, fromLibrary = false } = {}) {
  const summary = state.summaries.find((study) => study.study_id === studyId) || state.summaries[0];
  if (!summary) return;

  try {
    if (!state.loaded.has(summary.study_id)) {
      state.loaded.set(summary.study_id, await loadStudy(summary.file));
    }
    state.activeStudyId = summary.study_id;
    renderStudyList();
    renderStudy(state.loaded.get(summary.study_id));

    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set("study", summary.study_id);
      history.replaceState(null, "", url);
    }

    if (fromLibrary && mobileQuery.matches) {
      elements.library.classList.add("collapsed");
      syncLibraryToggle();
      elements.detail.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (error) {
    elements.detail.innerHTML = `<div class="error-card"><h2>Study unavailable</h2><p>${escapeHtml(error.message)}</p></div>`;
  }
}

function syncLibraryToggle() {
  const collapsed = elements.library.classList.contains("collapsed");
  elements.libraryToggle.setAttribute("aria-expanded", String(!collapsed));
  elements.libraryToggle.textContent = collapsed ? "Browse studies" : "Hide studies";
}

function wireEvents() {
  elements.search.addEventListener("input", renderStudyList);
  elements.topicFilter.addEventListener("change", renderStudyList);
  elements.translationSelect.addEventListener("change", () => {
    const active = state.loaded.get(state.activeStudyId);
    if (active) renderStudy(active);
  });
  elements.list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-study-id]");
    if (button) selectStudy(button.dataset.studyId, { fromLibrary: true });
  });
  elements.libraryToggle.addEventListener("click", () => {
    elements.library.classList.toggle("collapsed");
    syncLibraryToggle();
  });
}

async function initialize() {
  try {
    state.index = await loadStudyIndex();
    state.summaries = [...state.index.studies].sort((a, b) => a.sort_order - b.sort_order);
    hydrateTopics();
    wireEvents();
    renderStudyList();
    syncLibraryToggle();

    const requestedStudy = new URL(location.href).searchParams.get("study");
    await selectStudy(requestedStudy, { updateUrl: Boolean(requestedStudy) });
  } catch (error) {
    elements.count.textContent = "Unavailable";
    elements.detail.innerHTML = `<div class="error-card"><h2>Studies unavailable</h2><p>${escapeHtml(error.message)}</p></div>`;
  }
}

initialize();
