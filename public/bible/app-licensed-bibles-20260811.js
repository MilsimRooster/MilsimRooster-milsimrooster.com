const elements = {
  versionSelect: document.querySelector("#versionSelect"),
  bookSelect: document.querySelector("#bookSelect"),
  chapterSelect: document.querySelector("#chapterSelect"),
  searchInput: document.querySelector("#searchInput"),
  openChapterButton: document.querySelector("#openChapterButton"),
  scripturePanel: document.querySelector("#scripturePanel"),
  scriptureText: document.querySelector("#scriptureText"),
  chapterTitle: document.querySelector("#chapterTitle"),
  referenceLine: document.querySelector("#referenceLine"),
  chapterBottomNav: document.querySelector("#chapterBottomNav"),
  previousChapterButton: document.querySelector("#previousChapterButton"),
  nextChapterButton: document.querySelector("#nextChapterButton"),
  searchPanel: document.querySelector("#searchPanel"),
  searchCount: document.querySelector("#searchCount"),
  searchResults: document.querySelector("#searchResults"),
  searchMoreButton: document.querySelector("#searchMoreButton"),
  returnToSearchButton: document.querySelector("#returnToSearchButton"),
  returnToLessonLink: document.querySelector("#returnToLessonLink"),
  returnToGuideLink: document.querySelector("#returnToGuideLink"),
  topicSelect: document.querySelector("#topicSelect"),
  topicDetail: document.querySelector("#topicDetail"),
  topicTitle: document.querySelector("#topicTitle"),
  topicSummary: document.querySelector("#topicSummary"),
  topicReferences: document.querySelector("#topicReferences"),
};

const SEARCH_DEBOUNCE_MS = 120;
const RESULTS_PAGE_SIZE = 80;

const versions = {
  bsb: {
    file: "bsb.json",
    label: "Berean Standard Bible",
  },
  kjv: {
    file: "kjv.json",
    label: "King James Version",
  },
  niv: { label: "New International Version", abbreviation: "NIV", remote: true },
  nlt: { label: "New Living Translation", abbreviation: "NLT", remote: true },
  nasb: { label: "New American Standard Bible 1995", abbreviation: "NASB", remote: true },
};

const apiBookCodes = ["GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL","MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD","REV"];

const topics = [
  ["Anxiety and worry", "Scripture redirects anxious thought toward prayer, trust, and attention to today's responsibilities.", ["Philippians 4:6-7", "Matthew 6:25-34", "1 Peter 5:7", "Psalm 56:3-4"]],
  ["Anger", "God's wisdom makes room for honest anger while warning against haste, bitterness, and revenge.", ["Ephesians 4:26-32", "James 1:19-20", "Proverbs 15:1", "Romans 12:17-21"]],
  ["Bereavement and grief", "The Bible permits deep mourning and anchors hope in God's presence and the resurrection.", ["Psalm 34:18", "John 11:25-36", "1 Thessalonians 4:13-18", "Revelation 21:4"]],
  ["Decision-making", "Wise choices grow from prayer, Scripture, honest counsel, and a heart willing to obey.", ["Proverbs 3:5-6", "James 1:5", "Psalm 119:105", "Proverbs 15:22"]],
  ["Depression and discouragement", "Biblical servants spoke openly from despair while continuing to seek God, community, rest, and hope.", ["Psalm 42:5-11", "1 Kings 19:4-8", "2 Corinthians 4:8-9", "Romans 15:13"]],
  ["Doubt", "Scripture treats doubt as a reason to seek Christ honestly, examine testimony, and ask for help believing.", ["Mark 9:23-24", "John 20:24-29", "James 1:5-8", "Jude 1:22"]],
  ["Failure and starting again", "Failure need not have the final word: confession, grace, correction, and renewed obedience open a path forward.", ["Psalm 51:1-12", "Proverbs 24:16", "John 21:15-19", "1 John 1:9"]],
  ["Fear", "Courage in Scripture is not denial of danger but confidence that God remains present and faithful.", ["Isaiah 41:10", "Psalm 27:1", "Joshua 1:9", "2 Timothy 1:7"]],
  ["Forgiveness", "Believers receive mercy in Christ and are called to forgive repeatedly and release personal vengeance. Forgiveness does not remove the need for truth, wise boundaries, justice, or immediate safety.", ["Matthew 6:14-15", "Matthew 18:21-35", "Romans 12:17-21", "Ephesians 4:32"]],
  ["Guidance", "Scripture directs believers to seek God's ways, trust him rather than self-sufficiency, renew their thinking, and ask him for wisdom.", ["Psalm 25:4-5", "Proverbs 3:5-6", "Romans 12:1-2", "James 1:5"]],
  ["Guilt and shame", "The gospel distinguishes godly conviction from condemning shame and points the repentant person toward cleansing and restoration.", ["Romans 8:1", "Psalm 32:1-5", "2 Corinthians 7:10", "1 John 1:9"]],
  ["Hope", "Christian hope rests on God's character, Christ's resurrection, and promises that remain larger than present circumstances.", ["Romans 5:1-5", "Romans 15:13", "1 Peter 1:3-5", "Hebrews 6:19"]],
  ["Loneliness", "God sees the isolated, places people in community, and promises a presence that does not abandon his people.", ["Psalm 68:5-6", "Psalm 139:1-12", "Hebrews 13:5-6", "2 Timothy 4:16-17"]],
  ["Marriage", "Biblical marriage calls husband and wife toward covenant faithfulness, mutual care, sacrificial love, and honor.", ["Genesis 2:18-24", "Ephesians 5:21-33", "1 Corinthians 13:4-7", "1 Peter 3:7"]],
  ["Parenting", "Parents are charged to teach faithfully, model wisdom, correct with care, and avoid crushing their children. Proverbs 22:6 is wisdom for formation, not an unconditional guarantee about every child's outcome.", ["Deuteronomy 6:4-9", "Proverbs 22:6", "Ephesians 6:1-4", "Colossians 3:20-21"]],
  ["Patience", "Patience grows as faith learns to endure delay, suffering, and difficult people without surrendering love.", ["Romans 12:12", "James 1:2-4", "James 5:7-11", "Galatians 5:22-23"]],
  ["Prayer", "Prayer includes worship, confession, thanksgiving, petition, lament, and persistent trust in God's wisdom and will.", ["Matthew 6:5-13", "Philippians 4:6-7", "1 Thessalonians 5:16-18", "1 John 5:14-15"]],
  ["Purpose and calling", "Every believer is called to love God and neighbor, practice good works, and faithfully steward particular gifts and opportunities.", ["Micah 6:8", "Matthew 22:37-40", "Ephesians 2:10", "1 Peter 4:10-11"]],
  ["Relationships and conflict", "Scripture favors truthful, gentle conversation, direct reconciliation, wise boundaries, and peace where possible.", ["Matthew 5:23-24", "Matthew 18:15-17", "Romans 12:18", "Ephesians 4:15"]],
  ["Salvation", "Salvation is God's gracious rescue received through faith in Jesus Christ, bringing forgiveness, new life, and reconciliation with God.", ["John 3:16-17", "Romans 3:23-24", "Romans 10:9-13", "Ephesians 2:8-10"]],
  ["Self-control and temptation", "Temptation is common, but God provides escape, grace, renewed thinking, and practices that strengthen self-control.", ["1 Corinthians 10:13", "Galatians 5:22-24", "James 1:12-16", "2 Timothy 2:22"]],
  ["Stress and exhaustion", "Jesus welcomes the weary; Scripture joins spiritual trust with rest, limits, shared burdens, and renewed strength.", ["Matthew 11:28-30", "Mark 6:31", "Galatians 6:2", "Isaiah 40:28-31"]],
  ["Suffering", "The Bible does not trivialize pain; it invites lament, endurance, compassionate presence, and hope in God's final restoration.", ["Psalm 13:1-6", "Romans 8:18-39", "2 Corinthians 1:3-5", "James 1:2-4"]],
  ["Work and integrity", "Work can honor God when done honestly, diligently, justly, and for service rather than status alone.", ["Proverbs 11:1", "Colossians 3:22-24", "1 Thessalonians 4:11-12", "James 5:4"]],
];

let bible = null;
let activeVersionId = "niv";
const loadedBibles = new Map();
let verseIndex = [];
let highlightedVerse = null;
let viewerOpen = false;
let searchTimer = null;
let currentSearchMatches = [];
let currentSearchQuery = "";
let visibleResultLimit = RESULTS_PAGE_SIZE;
let searchResultsCollapsed = false;

function configureLessonReturn() {
  const params = new URLSearchParams(location.search);
  const lessonId = params.get("lesson");
  if (!lessonId || !/^[a-z0-9-]+$/.test(lessonId)) return;

  const lessonTitle = params.get("lessonTitle")?.trim();
  elements.returnToLessonLink.href = `/bible/lessons/?lesson=${encodeURIComponent(lessonId)}`;
  elements.returnToLessonLink.textContent = lessonTitle
    ? `Back to ${lessonTitle} lesson`
    : "Back to this lesson";
  elements.returnToLessonLink.hidden = false;
}

function configureGuideReturn() {
  const params = new URLSearchParams(location.search);
  if (params.get("returnTo") !== "questions") return;

  const questionNumber = Number(params.get("question"));
  const guideQuery = params.get("guideQuery")?.trim() || "";
  const returnParams = new URLSearchParams();
  if (Number.isInteger(questionNumber) && questionNumber >= 1 && questionNumber <= 60) {
    returnParams.set("question", String(questionNumber));
  }
  if (guideQuery) returnParams.set("q", guideQuery);

  const query = returnParams.toString();
  elements.returnToGuideLink.href = `/bible/questions/${query ? `?${query}` : ""}`;
  elements.returnToGuideLink.hidden = false;
}

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

function tokenizeSearch(value) {
  return normalizeSearch(value).match(/[a-z0-9]+(?::[0-9]+)?/g) || [];
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

function updateOpenChapterButton(book = getSelectedBook(), chapter = getSelectedChapter(book)) {
  elements.openChapterButton.textContent = viewerOpen
    ? "Close Bible"
    : `Open ${book.name} ${chapter.number}`;
  elements.openChapterButton.setAttribute("aria-expanded", String(viewerOpen));
}

function setViewerOpen(open, options = {}) {
  viewerOpen = Boolean(open);
  elements.scripturePanel.hidden = !viewerOpen;
  updateOpenChapterButton();

  if (!viewerOpen && options.clearHash && location.hash) {
    history.replaceState(null, "", `${location.pathname}${location.search}`);
  }
}

function buildVerseIndex() {
  verseIndex = bible.books.flatMap((book) =>
    book.chapters.flatMap((chapter) =>
      chapter.verses.map((verse) => ({
        book,
        chapter: chapter.number,
        number: verse.number,
        text: verse.text,
        searchWords: ` ${tokenizeSearch(`${book.name} ${chapter.number}:${verse.number} ${verse.text}`).join(" ")} `,
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
      versionId: "niv",
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
    history.replaceState(null, "", `${location.pathname}${location.search}${nextHash}`);
  }
}

function renderChapter(options = {}) {
  const book = getSelectedBook();
  const chapter = getSelectedChapter(book);
  if (versions[activeVersionId].remote) {
    renderLicensedChapter(book, chapter, options);
    return;
  }
  const licensedCopyright = document.querySelector("#licensedCopyright");
  licensedCopyright.hidden = true;
  licensedCopyright.textContent = "";
  const abbreviation = bible.abbreviation ? ` (${bible.abbreviation})` : "";
  elements.referenceLine.textContent = `${bible.translation}${abbreviation} | ${book.testament}`;
  elements.chapterTitle.textContent = `${book.name} ${chapter.number}`;
  elements.scriptureText.innerHTML = chapter.verses.map((verse) => {
    const highlighted = highlightedVerse === verse.number ? " is-highlighted" : "";
    return `<p class="verse${highlighted}" id="v${verse.number}"><a class="verse-number" href="#${book.slug}.${chapter.number}.${verse.number}" aria-label="${book.name} ${chapter.number}:${verse.number}">${verse.number}</a>${escapeHtml(verse.text)}</p>`;
  }).join("");

  updateBottomChapterNav(book, chapter);
  updateOpenChapterButton(book, chapter);

  if (viewerOpen) {
    updateHash(book, chapter, highlightedVerse);
  }

  if (highlightedVerse) {
    document.querySelector(`#v${highlightedVerse}`)?.scrollIntoView({ block: "center" });
  } else if (options.scrollToTop) {
    elements.chapterTitle.scrollIntoView({ block: "start" });
  }
}

function reportFums(fumsToken) {
  if (!fumsToken) return;
  const storageKey = "mrBibleDeviceId";
  let deviceId = localStorage.getItem(storageKey);
  if (!deviceId) { deviceId = crypto.randomUUID(); localStorage.setItem(storageKey, deviceId); }
  let sessionId = sessionStorage.getItem(storageKey);
  if (!sessionId) { sessionId = crypto.randomUUID(); sessionStorage.setItem(storageKey, sessionId); }
  fetch(`https://fums.api.bible/f3?t=${encodeURIComponent(fumsToken)}&dId=${encodeURIComponent(deviceId)}&sId=${encodeURIComponent(sessionId)}`, { mode: "no-cors", keepalive: true });
}

async function renderLicensedChapter(book, chapter, options = {}) {
  const bookIndex = bible.books.findIndex((candidate) => candidate.slug === book.slug);
  const passage = `${apiBookCodes[bookIndex]}.${chapter.number}`;
  const licensedCopyright = document.querySelector("#licensedCopyright");
  licensedCopyright.hidden = true;
  licensedCopyright.textContent = "";
  elements.referenceLine.textContent = `${versions[activeVersionId].label} (${versions[activeVersionId].abbreviation}) | ${book.testament}`;
  elements.chapterTitle.textContent = `${book.name} ${chapter.number}`;
  elements.scriptureText.innerHTML = '<p class="licensed-loading">Loading licensed Scripture…</p>';
  updateBottomChapterNav(book, chapter);
  updateOpenChapterButton(book, chapter);
  if (viewerOpen) updateHash(book, chapter, highlightedVerse);
  try {
    const response = await fetch(`/api/bible?action=passage&version=${activeVersionId}&passage=${passage}`);
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Licensed Bible passage unavailable.");
    elements.scriptureText.innerHTML = `<div class="licensed-scripture">${payload.data.content}</div>`;
    licensedCopyright.textContent = payload.data.copyright || "Licensed translation supplied by API.Bible.";
    licensedCopyright.hidden = false;
    reportFums(payload.meta?.fumsToken);
    if (highlightedVerse) document.querySelector(`[data-verse-id$=".${highlightedVerse}"]`)?.scrollIntoView({ block: "center" });
    else if (options.scrollToTop) elements.chapterTitle.scrollIntoView({ block: "start" });
  } catch (error) {
    licensedCopyright.hidden = true;
    elements.scriptureText.textContent = error.message;
  }
}

function renderResults(matches, query) {
  if (!query) {
    searchResultsCollapsed = false;
    elements.searchPanel.hidden = true;
    elements.returnToSearchButton.hidden = true;
    elements.searchCount.textContent = "Ready";
    elements.searchResults.replaceChildren();
    elements.searchMoreButton.hidden = true;
    return;
  }

  elements.searchPanel.hidden = searchResultsCollapsed;
  const versionLabel = versions[activeVersionId].label;
  const visibleMatches = matches.slice(0, visibleResultLimit);
  elements.searchCount.textContent = matches.length === 1
    ? `1 exact-word match across ${versionLabel}`
    : `${matches.length} exact-word matches across ${versionLabel}`;
  elements.searchResults.innerHTML = visibleMatches.map((verse) => (
    `<a class="result-link" href="#${activeVersionId}.${verse.book.slug}.${verse.chapter}.${verse.number}">
      <strong>${escapeHtml(referenceFor(verse))}</strong>
      <span>${escapeHtml(verse.text)}</span>
    </a>`
  )).join("");

  const remaining = matches.length - visibleMatches.length;
  elements.searchMoreButton.hidden = remaining <= 0;
  elements.searchMoreButton.textContent = remaining > 0
    ? `Show ${Math.min(RESULTS_PAGE_SIZE, remaining)} more of ${remaining}`
    : "Show more results";
}

function runSearch() {
  clearTimeout(searchTimer);
  searchTimer = null;
  const query = normalizeSearch(elements.searchInput.value);
  if (!query) {
    currentSearchMatches = [];
    currentSearchQuery = "";
    visibleResultLimit = RESULTS_PAGE_SIZE;
    renderResults([], query);
    return;
  }

  const terms = tokenizeSearch(query);
  if (!terms.length) {
    currentSearchMatches = [];
    currentSearchQuery = query;
    visibleResultLimit = RESULTS_PAGE_SIZE;
    renderResults([], query);
    return;
  }

  if (versions[activeVersionId].remote) {
    runLicensedSearch(query);
    return;
  }

  // verseIndex contains every verse in the active translation, not merely the
  // chapter currently displayed. Padding makes each lookup an exact word or
  // reference token, so "stress" cannot match "mistress" or "distressed".
  const matches = verseIndex.filter((verse) =>
    terms.every((term) => verse.searchWords.includes(` ${term} `)),
  );

  currentSearchMatches = matches;
  currentSearchQuery = query;
  visibleResultLimit = RESULTS_PAGE_SIZE;
  renderResults(matches, query);
}

async function runLicensedSearch(query) {
  elements.searchPanel.hidden = false;
  elements.searchCount.textContent = `Searching ${versions[activeVersionId].label}…`;
  elements.searchResults.replaceChildren();
  try {
    const response = await fetch(`/api/bible?action=search&version=${activeVersionId}&query=${encodeURIComponent(query)}`);
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Search unavailable.");
    const verses = payload.data?.verses || [];
    elements.searchCount.textContent = `${payload.data?.total ?? verses.length} matches across ${versions[activeVersionId].label}`;
    elements.searchResults.innerHTML = verses.map((verse) => {
      const [bookCode, chapter, number] = verse.id.split(".");
      const book = bible.books[apiBookCodes.indexOf(bookCode)];
      if (!book) return "";
      return `<a class="result-link" href="#${activeVersionId}.${book.slug}.${chapter}.${number}"><strong>${escapeHtml(verse.reference)}</strong><span>${escapeHtml(verse.text)}</span></a>`;
    }).join("");
    currentSearchQuery = query;
    reportFums(payload.meta?.fumsToken);
  } catch (error) { elements.searchCount.textContent = error.message; }
}

function scheduleSearch() {
  clearTimeout(searchTimer);
  searchResultsCollapsed = false;
  elements.returnToSearchButton.hidden = true;
  const query = normalizeSearch(elements.searchInput.value);

  if (!query) {
    runSearch();
    return;
  }

  searchTimer = setTimeout(runSearch, SEARCH_DEBOUNCE_MS);
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
  const safeVersionId = versions[versionId] ? versionId : "niv";
  if (versions[safeVersionId].remote) {
    if (!loadedBibles.has("kjv")) loadedBibles.set("kjv", await fetch("kjv.json").then((response) => response.json()));
    activeVersionId = safeVersionId;
    bible = loadedBibles.get("kjv");
    elements.versionSelect.value = safeVersionId;
    verseIndex = [];
    populateBookSelect();
    return;
  }
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

async function applyHashSelection(options = {}) {
  const selection = parseHash();
  const preserveSearchResults = Boolean(
    currentSearchQuery
    && selection.versionId === activeVersionId
    && options.preserveSearch !== false
  );
  await loadVersion(selection.versionId);
  setSelection(selection);
  setViewerOpen(options.openViewer ?? viewerOpen);
  renderChapter();
  if (!preserveSearchResults) {
    runSearch();
  }
}

async function loadBible() {
  const hasSharedSelection = Boolean(location.hash.replace(/^#/, "").trim());
  await applyHashSelection({ openViewer: hasSharedSelection });
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

elements.searchInput.addEventListener("input", scheduleSearch);
elements.searchMoreButton.addEventListener("click", () => {
  visibleResultLimit += RESULTS_PAGE_SIZE;
  renderResults(currentSearchMatches, currentSearchQuery);
});
elements.searchResults.addEventListener("click", (event) => {
  if (!event.target.closest?.(".result-link")) return;

  searchResultsCollapsed = true;
  elements.searchPanel.hidden = true;
  elements.returnToSearchButton.hidden = false;
});
elements.returnToSearchButton.addEventListener("click", () => {
  setViewerOpen(false, { clearHash: true });
  searchResultsCollapsed = false;
  elements.searchPanel.hidden = !currentSearchQuery;
  elements.returnToSearchButton.hidden = true;

  requestAnimationFrame(() => {
    elements.searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
    elements.searchInput.focus({ preventScroll: true });
  });
});
elements.openChapterButton.addEventListener("click", () => {
  if (viewerOpen) {
    setViewerOpen(false, { clearHash: true });
    searchResultsCollapsed = false;
    elements.searchPanel.hidden = !currentSearchQuery;
    elements.returnToSearchButton.hidden = true;
    return;
  }

  elements.returnToSearchButton.hidden = true;
  setViewerOpen(true);
  renderChapter({ scrollToTop: true });
});
elements.previousChapterButton.addEventListener("click", () => goToAdjacentChapter(-1));
elements.nextChapterButton.addEventListener("click", () => goToAdjacentChapter(1));
window.addEventListener("hashchange", () => {
  applyHashSelection({ openViewer: true });
});

function populateTopics() {
  for (const [title] of topics) {
    const option = document.createElement("option");
    option.value = title;
    option.textContent = title;
    elements.topicSelect.append(option);
  }
}

elements.topicSelect.addEventListener("change", () => {
  const topic = topics.find(([title]) => title === elements.topicSelect.value);
  elements.topicDetail.hidden = !topic;
  if (!topic) return;

  const [title, summary, references] = topic;
  elements.topicTitle.textContent = title;
  elements.topicSummary.textContent = summary;
  elements.topicReferences.innerHTML = references.map((reference) => (
    `<button class="topic-reference" type="button" data-reference="${escapeHtml(reference)}">${escapeHtml(reference)}</button>`
  )).join("");
});

elements.topicReferences.addEventListener("click", async (event) => {
  const button = event.target.closest?.(".topic-reference");
  if (!button) return;

  const match = button.dataset.reference.match(/^(.+?) (\d+):(\d+)/);
  if (!match) return;
  const [, bookName, chapter, verse] = match;
  const normalizedBookName = bookName === "Psalm" ? "Psalms" : bookName;
  const book = bible.books.find((candidate) => candidate.name === normalizedBookName);
  if (!book) return;

  history.replaceState(null, "", `${location.pathname}${location.search}#${activeVersionId}.${book.slug}.${chapter}.${verse}`);
  await applyHashSelection({ openViewer: true, preserveSearch: false });
  elements.scripturePanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

populateTopics();
configureLessonReturn();
configureGuideReturn();

loadBible().catch((error) => {
  elements.chapterTitle.textContent = "Reader unavailable";
  elements.referenceLine.textContent = "Digital Bible";
  elements.scriptureText.textContent = error.message;
});
