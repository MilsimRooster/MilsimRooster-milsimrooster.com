import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const hiddenShelfBiblePath = join(
  "C:",
  "Users",
  "KDLEA",
  "Documents",
  "Codex",
  "2026-06-21",
  "okay",
  "hidden-shelf",
  "source",
  "books",
  "txt",
  "gutenberg-10-the-king-james-version-of-the-bible.txt",
);
const generatorPath = join(root, "scripts", "build-digital-bible.mjs");
const readerRoot = join(root, "public", "bible");
const htmlPath = join(readerRoot, "index.html");
const cssPath = join(readerRoot, "styles-kjv-topics-20260811.css");
const appPath = join(readerRoot, "app-licensed-bibles-20260811.js");
const legacyAppPath = join(readerRoot, "app.js");
const legacyCssPath = join(readerRoot, "styles.css");
const kjvDataPath = join(readerRoot, "kjv.json");
const bsbDataPath = join(readerRoot, "bsb.json");
const aboutSourcePath = join(root, "src", "App.jsx");
const middlewarePath = join(root, "functions", "_middleware.js");
const redirectsPath = join(root, "public", "_redirects");

for (const [label, path] of [
  ["Hidden Shelf Project Gutenberg KJV source", hiddenShelfBiblePath],
  ["Digital Bible data generator", generatorPath],
  ["Digital Bible HTML", htmlPath],
  ["Digital Bible CSS", cssPath],
  ["Digital Bible app JS", appPath],
  ["Digital Bible legacy app JS", legacyAppPath],
  ["Digital Bible legacy CSS", legacyCssPath],
  ["Digital Bible KJV generated data", kjvDataPath],
  ["Digital Bible BSB generated data", bsbDataPath],
]) {
  assert.ok(existsSync(path), `${label} should exist at ${path}`);
}

const hiddenShelfBible = readFileSync(hiddenShelfBiblePath, "utf8");
const html = readFileSync(htmlPath, "utf8");
const css = readFileSync(cssPath, "utf8");
const appSource = readFileSync(appPath, "utf8");
const legacyAppSource = readFileSync(legacyAppPath, "utf8");
const legacyCss = readFileSync(legacyCssPath, "utf8");
const kjvData = JSON.parse(readFileSync(kjvDataPath, "utf8"));
const bsbData = JSON.parse(readFileSync(bsbDataPath, "utf8"));
const aboutSource = readFileSync(aboutSourcePath, "utf8");
const middlewareSource = readFileSync(middlewarePath, "utf8");
const redirectsSource = readFileSync(redirectsPath, "utf8");

assert.ok(hiddenShelfBible.includes("Project Gutenberg eBook of The King James Version of the Bible"), "source should be Project Gutenberg ebook #10");
assert.ok(hiddenShelfBible.includes("*** START OF THE PROJECT GUTENBERG EBOOK THE KING JAMES VERSION OF THE BIBLE ***"), "source should include the Gutenberg start marker");

assert.ok(html.includes("<title>Digital Bible | Milsim Rooster</title>"), "reader should have a clear page title");
assert.ok(html.includes('href="styles-kjv-topics-20260811.css?v=20260815-lesson-return-2"'), "reader should load cache-busted KJV and topics CSS");
assert.ok(html.includes('src="app-licensed-bibles-20260811.js?v=20260830-guide-return-1"'), "reader should load the cache-busted licensed-Bibles JS with guide return support");
assert.ok(html.includes('id="versionSelect"'), "reader should expose a version selector");
assert.ok(html.includes('id="bookSelect"'), "reader should expose a book selector");
assert.ok(html.includes('id="chapterSelect"'), "reader should expose a chapter selector");
assert.ok(html.includes('id="searchInput"'), "reader should expose Bible search");
assert.ok(html.includes('id="searchMoreButton"'), "reader should progressively reveal large result sets");
assert.ok(html.includes('id="returnToSearchButton"'), "reader should offer an always-visible return from a selected passage");
assert.ok(html.includes('id="returnToLessonLink"'), "reader should provide a return path to the exact originating kids lesson");
assert.ok(html.includes('id="returnToGuideLink"'), "reader should provide a return path to the exact guide question");
assert.ok(html.includes('id="openChapterButton"'), "reader should provide a deliberate open/close control");
assert.ok(html.includes('id="scripturePanel" class="scripture-panel" aria-live="polite" hidden'), "Bible viewer should start closed");
assert.ok(html.indexOf('id="searchPanel"') > html.indexOf('id="openChapterButton"'), "whole-Bible results should appear below the open button");
assert.ok(html.indexOf('id="searchPanel"') < html.indexOf('id="scripturePanel"'), "whole-Bible results should appear before the chapter viewer");
assert.ok(html.includes('id="scriptureText"'), "reader should render scripture text");
assert.ok(html.includes('id="chapterBottomNav"'), "reader should include bottom chapter navigation");
assert.ok(html.includes('id="nextChapterButton"'), "reader should include a next chapter button near the bottom");
assert.ok(html.includes('<option value="niv" selected>New International Version (NIV)</option>'), "reader should make NIV the selected default");
assert.ok(html.includes('value="niv"'), "reader should list NIV as an online reading option");
assert.ok(html.includes('id="topicSelect"'), "reader should provide a supplemental topic selector");
assert.ok(!html.includes("The Billy Graham Training Center Bible"), "reader should not expose topical-guide development notes");
assert.ok(!html.includes("Project Gutenberg ebook #10"), "reader should keep source metadata out of the reading interface");
assert.ok(!html.includes("King James Version by default"), "reader should not explain its default selection under the title");
assert.ok(html.includes('id="licensedCopyright" class="licensed-copyright" hidden'), "licensed copyright should start hidden inside the Scripture viewer");
assert.ok(!html.includes("Licensed translations supplied by API.Bible and displayed by permission"), "reader should not show a generic provider note before a licensed passage opens");
assert.ok(!html.includes("Hidden Shelf Text Archive"), "reader title area should not show the Hidden Shelf archive eyebrow");
assert.ok(!html.includes("Bible Study Arcade"), "reader should not be the removed game UI");

assert.ok(css.includes("@media (max-width: 760px)"), "reader CSS should include mobile layout rules");
assert.ok(css.includes("font-family"), "reader CSS should define readable typography");
assert.ok(css.includes(".verse-number"), "reader CSS should style verse numbers");
assert.ok(css.includes(".chapter-bottom-nav"), "reader CSS should style bottom chapter navigation");
assert.ok(css.includes(".chapter-nav-button"), "reader CSS should style bottom chapter navigation buttons");
assert.ok(css.includes(".licensed-copyright"), "reader CSS should style required licensed-passage copyright notices");

assert.ok(appSource.includes("versionSelect"), "reader app should wire the version selector");
assert.equal(appSource.trimEnd(), legacyAppSource.trimEnd(), "fingerprinted reader app should match the maintained legacy source");
assert.equal(css.trimEnd(), legacyCss.trimEnd(), "fingerprinted reader CSS should match the maintained legacy source");
assert.ok(appSource.includes("bsb.json"), "reader app should load generated BSB data");
assert.ok(appSource.includes("kjv.json"), "reader app should keep the generated KJV data available");
assert.ok(appSource.includes('activeVersionId = "niv"'), "reader app should initialize with NIV");
assert.ok(html.includes('value="nlt"') && html.includes('value="nasb"'), "reader should list NIV, NLT, and NASB licensed translations");
assert.ok(appSource.includes('/api/bible?action=passage'), "licensed translations should load through the server-side API proxy");
assert.ok(appSource.includes("reportFums"), "licensed Scripture views should report API.Bible fair-use tokens");
assert.ok(appSource.includes("licensedCopyright.hidden = false"), "licensed copyright should appear only after licensed Scripture loads");
assert.ok(appSource.includes("const topics = ["), "reader app should include the supplemental topical guide");
assert.ok(!appSource.includes("lament, listening, and persistent trust"), "topic summaries should not add listening to prayer without direct support from their cited passages");
assert.ok(appSource.includes("Proverbs 22:6 is wisdom for formation, not an unconditional guarantee"), "parenting topic should identify Proverbs as wisdom rather than a guaranteed outcome");
assert.ok(appSource.includes("Forgiveness does not remove the need for truth, wise boundaries, justice, or immediate safety"), "forgiveness topic should preserve safety and justice boundaries");
assert.ok(appSource.includes("topicReferences"), "topic references should be interactive");
assert.ok(appSource.includes("button.dataset.reference.match"), "topic references should parse book, chapter, and verse");
assert.ok(appSource.includes('bookName === "Psalm" ? "Psalms"'), "topic references should resolve the conventional singular Psalm label");
assert.ok(appSource.includes("applyHashSelection({ openViewer: true, preserveSearch: false })"), "topic references should open the selected passage directly");
assert.ok(appSource.includes("renderChapter"), "reader app should render selected chapters");
assert.ok(appSource.includes("runSearch"), "reader app should support search");
assert.ok(appSource.includes("setViewerOpen"), "reader app should manage the closed and open Bible states");
assert.ok(appSource.includes("openViewer: hasSharedSelection"), "shared chapter and verse links should open the Bible automatically");
assert.ok(appSource.includes("applyHashSelection({ openViewer: true })"), "selecting a search result should open its chapter");
assert.ok(appSource.includes("verseIndex = bible.books.flatMap"), "search index should include every book in the selected Bible");
assert.ok(!appSource.includes(".slice(0, 80)"), "whole-Bible search should not silently discard matches outside its first result batch");
assert.ok(appSource.includes("exact-word matches across ${versionLabel}"), "search status should describe exact-word matching across the selected Bible translation");
assert.ok(appSource.includes("function tokenizeSearch"), "search should tokenize verses and queries for whole-word matching");
assert.ok(appSource.includes('verse.searchWords.includes(` ${term} `)'), "search should not match query terms inside larger words");
assert.ok(!appSource.includes("verse.search.includes(term)"), "search should not use broad substring matching");
assert.ok(appSource.includes("SEARCH_DEBOUNCE_MS = 120"), "search should debounce typing to avoid repeated work");
assert.ok(appSource.includes("matches.slice(0, visibleResultLimit)"), "search should cap rendered DOM results without discarding total matches");
assert.ok(appSource.includes("searchResultsCollapsed = true"), "selecting a result should collapse the results panel before opening scripture");
assert.ok(appSource.includes("returnToSearchButton"), "reader should wire the fixed return-to-search control");
assert.ok(appSource.includes("preserveSearchResults"), "opening a result should preserve the existing result list and scroll position");
assert.ok(css.includes("max-height: min(430px, 52dvh)"), "search results should remain in a compact scrollable panel");
assert.ok(!css.includes("max-height: none"), "mobile search results should not expand into a page-length list");
assert.ok(css.includes(".return-to-search-button"), "reader should style a fixed return-to-search action");
assert.ok(css.includes(".return-to-lesson-link"), "reader should style a fixed return-to-lesson action");
assert.ok(appSource.includes("configureLessonReturn"), "reader should restore the originating lesson from URL context");
assert.ok(appSource.includes("configureGuideReturn"), "reader should restore the originating question guide context");
assert.ok(appSource.includes('params.get("returnTo") !== "questions"'), "reader should only show the guide return for guide-originated passages");
assert.ok(appSource.includes('params.get("lesson")'), "reader should read the originating lesson id");
assert.ok(appSource.includes("${location.pathname}${location.search}${nextHash}"), "reader hash updates should preserve lesson return context");
assert.ok(appSource.includes("location.hash"), "reader app should support shareable hash navigation");
assert.ok(appSource.includes("nextChapterButton"), "reader app should wire the bottom next chapter button");
assert.ok(appSource.includes("goToAdjacentChapter"), "reader app should support moving to adjacent chapters from the bottom");
assert.ok(appSource.includes("chapterBottomNav"), "reader app should update bottom chapter navigation state");

assert.equal(kjvData.translation, "King James Version", "KJV data should identify the KJV translation");
assert.equal(kjvData.source.ebook, "Project Gutenberg ebook #10", "KJV data should cite the Gutenberg source");
assert.equal(kjvData.source.license, "Public domain in the United States via Project Gutenberg", "KJV data should carry public-domain licensing");
assert.equal(kjvData.books.length, 66, "KJV data should contain the 66-book Protestant canon");
assert.equal(bsbData.translation, "Berean Standard Bible", "BSB data should identify the BSB translation");
assert.equal(bsbData.abbreviation, "BSB", "BSB data should include the BSB abbreviation");
assert.equal(bsbData.source.license, "Public domain. All uses are freely permitted.", "BSB data should carry public-domain licensing");
assert.equal(bsbData.source.url, "https://bereanbible.com/bsb.txt", "BSB data should cite the official text download");
assert.equal(bsbData.books.length, 66, "BSB data should contain the 66-book Protestant canon");

const bookBySlug = new Map(kjvData.books.map((book) => [book.slug, book]));
assert.equal(bookBySlug.get("genesis").chapters.length, 50, "Genesis should have 50 chapters");
assert.equal(bookBySlug.get("john").chapters.length, 21, "John should have 21 chapters");
assert.equal(bookBySlug.get("revelation").chapters.length, 22, "Revelation should have 22 chapters");

const kjvVerses = kjvData.books.flatMap((book) =>
  book.chapters.flatMap((chapter) =>
    chapter.verses.map((verse, verseIndex) => ({ book, chapter, verse, verseIndex })),
  ),
);
assert.equal(kjvVerses.length, 31_102, "KJV data should contain all 31,102 verses");
for (const { book, chapter, verse, verseIndex } of kjvVerses) {
  assert.equal(
    verse.number,
    verseIndex + 1,
    `${book.name} ${chapter.number} should have continuous verse numbering`,
  );
  assert.doesNotMatch(
    verse.text,
    /\b\d+:\d+\b/,
    `${book.name} ${chapter.number}:${verse.number} should not contain an embedded verse marker`,
  );
}

const genesisOneOne = bookBySlug.get("genesis").chapters[0].verses[0];
assert.equal(genesisOneOne.number, 1, "Genesis 1:1 should be verse 1");
assert.equal(genesisOneOne.text, "In the beginning God created the heaven and the earth.", "Genesis 1:1 should parse cleanly");

const formerlyMergedVerses = [
  ["genesis", 3, 5, "For God doth know that in the day ye eat thereof, then your eyes shall be opened, and ye shall be as gods, knowing good and evil."],
  ["john", 3, 5, "Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God."],
  ["romans", 1, 21, "Because that, when they knew God, they glorified him not as God, neither were thankful; but became vain in their imaginations, and their foolish heart was darkened."],
  ["revelation", 5, 12, "Saying with a loud voice, Worthy is the Lamb that was slain to receive power, and riches, and wisdom, and strength, and honour, and glory, and blessing."],
];
for (const [bookSlug, chapterNumber, verseNumber, expectedText] of formerlyMergedVerses) {
  const verse = bookBySlug.get(bookSlug).chapters[chapterNumber - 1].verses.find((entry) => entry.number === verseNumber);
  assert.equal(
    verse?.text,
    expectedText,
    `${bookSlug} ${chapterNumber}:${verseNumber} should remain a distinct, complete verse`,
  );
}

const johnThreeSixteen = bookBySlug.get("john").chapters[2].verses.find((verse) => verse.number === 16);
assert.ok(johnThreeSixteen.text.includes("For God so loved the world"), "John 3:16 should be searchable in structured data");

const revelationLast = bookBySlug.get("revelation").chapters[21].verses.at(-1);
assert.equal(revelationLast.number, 21, "Revelation should end at 22:21");
assert.ok(revelationLast.text.includes("The grace of our Lord Jesus Christ"), "Revelation 22:21 should parse cleanly");

const bsbBookBySlug = new Map(bsbData.books.map((book) => [book.slug, book]));
assert.equal(bsbBookBySlug.get("genesis").chapters.length, 50, "BSB Genesis should have 50 chapters");
assert.equal(bsbBookBySlug.get("john").chapters.length, 21, "BSB John should have 21 chapters");
assert.equal(bsbBookBySlug.get("revelation").chapters.length, 22, "BSB Revelation should have 22 chapters");
assert.equal(bsbBookBySlug.get("genesis").chapters[0].verses[0].text, "In the beginning God created the heavens and the earth.", "BSB Genesis 1:1 should parse cleanly");
assert.ok(bsbBookBySlug.get("john").chapters[2].verses.find((verse) => verse.number === 16).text.includes("For God so loved the world"), "BSB John 3:16 should be searchable");
assert.ok(bsbBookBySlug.get("revelation").chapters[21].verses.at(-1).text.includes("The grace of the Lord Jesus be with all the saints"), "BSB Revelation 22:21 should parse cleanly");

assert.ok(aboutSource.includes('name: "Digital Bible"'), "Apps and Utilities should link to the Digital Bible reader");
assert.ok(aboutSource.includes('href: "/bible/"'), "Digital Bible card should point to /bible/");
assert.ok(!aboutSource.includes('name: "Bible Study Arcade"'), "Apps and Utilities should not keep the removed Bible arcade tile");
assert.ok(middlewareSource.includes("/apps/bible-study"), "retired Bible app route should be handled explicitly");
assert.ok(middlewareSource.includes("/bible/"), "retired Bible app route should redirect to the Digital Bible reader");
assert.ok(middlewareSource.includes("isRetiredBibleAppPath"), "retired Bible app route should have a named guard");
assert.ok(redirectsSource.includes("/apps/bible-study /bible/ 302"), "static retired Bible app route should redirect to the Digital Bible reader");
assert.ok(redirectsSource.includes("/apps/bible-study/* /bible/ 302"), "nested retired Bible app assets should redirect to the Digital Bible reader");

console.log("Digital Bible validation passed.");
