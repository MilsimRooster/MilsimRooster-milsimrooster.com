const elements = {
  versionSelect: document.querySelector("#versionSelect"),
  bookSelect: document.querySelector("#bookSelect"),
  chapterSelect: document.querySelector("#chapterSelect"),
  searchInput: document.querySelector("#searchInput"),
  scriptureText: document.querySelector("#scriptureText"),
  chapterTitle: document.querySelector("#chapterTitle"),
  referenceLine: document.querySelector("#referenceLine"),
  chapterBottomNav: document.querySelector("#chapterBottomNav"),
  previousChapterButton: document.querySelector("#previousChapterButton"),
  nextChapterButton: document.querySelector("#nextChapterButton"),
  searchCount: document.querySelector("#searchCount"),
  searchResults: document.querySelector("#searchResults"),
};

const versions = {
  bsb: {
    file: "bsb.json",
    label: "Berean Standard Bible",
  },
  kjv: {
    file: "kjv.json",
    label: "King James Version",
  },
};

let bible = null;
let activeVersionId = "bsb";
const loadedBibles = new Map();
let verseIndex = [];
let highlightedVerse = null;

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeSearch(value) {
  return value.toLowerCase().replace(/[^a-z0-9\s:.-]/g, " ").replace(/\s+/g, " ").trim();
}

function getBookBySlug(slug) {
  return bible.books.find((book) => book.slug === slug) || bible.books[0];
}

function getSelectedBook() {
  return getBookBySlug(elements.bookSelect.value);
}

function getSelectedChapter(book = getSelectedBook()) {
  const requested = Number(elements.chapterSelect.value) || 1;
  return book.chapters[Math.max(0, Math.min(requested - 1, book.chapters.length - 1))];
}

function referenceFor(verse) {
  return `${verse.book.name} ${verse.chapter}:${verse.number}`;
}

function getAdjacentChapter(offset, book = getSelectedBook(), chapter = getSelectedChapter(book)) {
  const bookIndex = bible.books.findIndex((candidate) => candidate.slug === book.slug);
  if (bookIndex < 0) return null;

  const chapterIndex = book.chapters.findIndex((candidate) => candidate.number === chapter.number);
  if (chapterIndex < 0) return null;

  let nextBookIndex = bookIndex;
  let nextChapterIndex = chapterIndex + offset;

  while (nextBookIndex >= 0 && nextBookIndex < bible.books.length) {
    const nextBook = bible.books[nextBookIndex];

    if (nextChapterIndex < 0) {
      nextBookIndex -= 1;
      if (nextBookIndex < 0) return null;
      nextChapterIndex = bible.books[nextBookIndex].chapters.length - 1;
      continue;
    }

    if (nextChapterIndex >= nextBook.chapters.length) {
      nextBookIndex += 1;
      if (nextBookIndex >= bible.books.length) return null;
      nextChapterIndex = 0;
      continue;
    }

    return {
      book: nextBook,
      chapter: nextBook.chapters[nextChapterIndex],
    };
  }

  return null;
}

function chapterLabel(target) {
  return `${target.book.name} ${target.chapter.number}`;
}

function updateBottomChapterNav(book, chapter) {
  const previous = getAdjacentChapter(-1, book, chapter);
  const next = getAdjacentChapter(1, book, chapter);

  elements.previousChapterButton.disabled = !previous;
  elements.previousChapterButton.textContent = previous ? `Previous: ${chapterLabel(previous)}` : "Previous chapter";

  elements.nextChapterButton.disabled = !next;
  elements.nextChapterButton.textContent = next ? `Next: ${chapterLabel(next)}` : "End of Bible";
}

function buildVerseIndex() {
  verseIndex = bible.books.flatMap((book) =>
    book.chapters.flatMap((chapter) =>
      chapter.verses.map((verse) => ({
        book,
        chapter: chapter.number,
        number: verse.number,
        text: verse.text,
        search: normalizeSearch(`${book.name} ${chapter.number}:${verse.number} ${verse.text}`),
      })),
    ),
  );
}

function populateBookSelect() {
  elements.bookSelect.replaceChildren();
  const groups = new Map();

  for (const book of bible.books) {
    if (!groups.has(book.testament)) {
      const group = document.createElement("optgroup");
      group.label = book.testament;
      groups.set(book.testament, group);
      elements.bookSelect.append(group);
    }

    const option = document.createElement("option");
    option.value = book.slug;
    option.textContent = book.name;
    groups.get(book.testament).append(option);
  }
}

function populateChapterSelect(book) {
  elements.chapterSelect.replaceChildren();

  for (const chapter of book.chapters) {
    const option = document.createElement("option");
    option.value = String(chapter.number);
    option.textContent = String(chapter.number);
    elements.chapterSelect.append(option);
  }
}

function parseHash() {
  const cleanHash = location.hash.replace(/^#/, "").trim();
  if (!cleanHash) {
    return {
      versionId: "bsb",
      slug: "genesis",
      chapter: 1,
      verse: null,
    };
  }

  const parts = cleanHash.split(/[.:/]/).filter(Boolean);
  const requestedVersion = versions[parts[0]] ? parts.shift() : activeVersionId;

  return {
    versionId: requestedVersion,
    slug: parts[0] || "genesis",
    chapter: Number(parts[1]) || 1,
    verse: Number(parts[2]) || null,
  };
}

function setSelection(selection) {
  const book = getBookBySlug(selection.slug);
  const safeChapter = Math.max(1, Math.min(selection.chapter, book.chapters.length));
  elements.bookSelect.value = book.slug;
  populateChapterSelect(book);
  elements.chapterSelect.value = String(safeChapter);
  highlightedVerse = selection.verse;
}

function updateHash(book, chapter, verse = null) {
  const nextHash = `#${activeVersionId}.${book.slug}.${chapter.number}${verse ? `.${verse}` : ""}`;
  if (location.hash !== nextHash) {
    history.replaceState(null, "", nextHash);
  }
}

function renderChapter(options = {}) {
  const book = getSelectedBook();
  const chapter = getSelectedChapter(book);
  const abbreviation = bible.abbreviation ? ` (${bible.abbreviation})` : "";
  elements.referenceLine.textContent = `${bible.translation}${abbreviation} | ${book.testament}`;
  elements.chapterTitle.textContent = `${book.name} ${chapter.number}`;
  elements.scriptureText.innerHTML = chapter.verses.map((verse) => {
    const highlighted = highlightedVerse === verse.number ? " is-highlighted" : "";
    return `<p class="verse${highlighted}" id="v${verse.number}"><a class="verse-number" href="#${book.slug}.${chapter.number}.${verse.number}" aria-label="${book.name} ${chapter.number}:${verse.number}">${verse.number}</a>${escapeHtml(verse.text)}</p>`;
  }).join("");

  updateBottomChapterNav(book, chapter);
  updateHash(book, chapter, highlightedVerse);

  if (highlightedVerse) {
    document.querySelector(`#v${highlightedVerse}`)?.scrollIntoView({ block: "center" });
  } else if (options.scrollToTop) {
    elements.chapterTitle.scrollIntoView({ block: "start" });
  }
}

function renderResults(matches, query) {
  if (!query) {
    elements.searchCount.textContent = "Ready";
    elements.searchResults.replaceChildren();
    return;
  }

  elements.searchCount.textContent = matches.length === 1 ? "1 match" : `${matches.length} matches`;
  elements.searchResults.innerHTML = matches.map((verse) => (
    `<a class="result-link" href="#${activeVersionId}.${verse.book.slug}.${verse.chapter}.${verse.number}">
      <strong>${escapeHtml(referenceFor(verse))}</strong>
      <span>${escapeHtml(verse.text)}</span>
    </a>`
  )).join("");
}

function runSearch() {
  const query = normalizeSearch(elements.searchInput.value);
  if (!query) {
    renderResults([], query);
    return;
  }

  const terms = query.split(" ").filter(Boolean);
  const matches = verseIndex
    .filter((verse) => terms.every((term) => verse.search.includes(term)))
    .slice(0, 80);

  renderResults(matches, query);
}

function goToAdjacentChapter(offset) {
  const target = getAdjacentChapter(offset);
  if (!target) return;

  highlightedVerse = null;
  elements.bookSelect.value = target.book.slug;
  populateChapterSelect(target.book);
  elements.chapterSelect.value = String(target.chapter.number);
  renderChapter({ scrollToTop: true });
}

async function loadVersion(versionId) {
  const safeVersionId = versions[versionId] ? versionId : "bsb";
  if (!loadedBibles.has(safeVersionId)) {
    const nextBible = await fetch(versions[safeVersionId].file).then((response) => {
      if (!response.ok) {
        throw new Error(`Could not load ${versions[safeVersionId].label}: ${response.status}`);
      }

      return response.json();
    });

    loadedBibles.set(safeVersionId, nextBible);
  }

  activeVersionId = safeVersionId;
  bible = loadedBibles.get(safeVersionId);
  elements.versionSelect.value = safeVersionId;
  buildVerseIndex();
  populateBookSelect();
}

async function applyHashSelection() {
  const selection = parseHash();
  await loadVersion(selection.versionId);
  setSelection(selection);
  renderChapter();
  runSearch();
}

async function loadBible() {
  await applyHashSelection();
}

elements.versionSelect.addEventListener("change", async () => {
  const bookSlug = elements.bookSelect.value || "genesis";
  const chapterNumber = Number(elements.chapterSelect.value) || 1;
  highlightedVerse = null;
  await loadVersion(elements.versionSelect.value);
  setSelection({
    slug: bookSlug,
    chapter: chapterNumber,
    verse: null,
  });
  renderChapter();
  runSearch();
});

elements.bookSelect.addEventListener("change", () => {
  const book = getSelectedBook();
  highlightedVerse = null;
  populateChapterSelect(book);
  elements.chapterSelect.value = "1";
  renderChapter();
});

elements.chapterSelect.addEventListener("change", () => {
  highlightedVerse = null;
  renderChapter();
});

elements.searchInput.addEventListener("input", runSearch);
elements.previousChapterButton.addEventListener("click", () => goToAdjacentChapter(-1));
elements.nextChapterButton.addEventListener("click", () => goToAdjacentChapter(1));
window.addEventListener("hashchange", () => {
  applyHashSelection();
});

loadBible().catch((error) => {
  elements.chapterTitle.textContent = "Reader unavailable";
  elements.referenceLine.textContent = "Digital Bible";
  elements.scriptureText.textContent = error.message;
});
