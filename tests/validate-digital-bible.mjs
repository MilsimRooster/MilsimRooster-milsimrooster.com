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
const cssPath = join(readerRoot, "styles.css");
const appPath = join(readerRoot, "app.js");
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
  ["Digital Bible KJV generated data", kjvDataPath],
  ["Digital Bible BSB generated data", bsbDataPath],
]) {
  assert.ok(existsSync(path), `${label} should exist at ${path}`);
}

const hiddenShelfBible = readFileSync(hiddenShelfBiblePath, "utf8");
const html = readFileSync(htmlPath, "utf8");
const css = readFileSync(cssPath, "utf8");
const appSource = readFileSync(appPath, "utf8");
const kjvData = JSON.parse(readFileSync(kjvDataPath, "utf8"));
const bsbData = JSON.parse(readFileSync(bsbDataPath, "utf8"));
const aboutSource = readFileSync(aboutSourcePath, "utf8");
const middlewareSource = readFileSync(middlewarePath, "utf8");
const redirectsSource = readFileSync(redirectsPath, "utf8");

assert.ok(hiddenShelfBible.includes("Project Gutenberg eBook of The King James Version of the Bible"), "source should be Project Gutenberg ebook #10");
assert.ok(hiddenShelfBible.includes("*** START OF THE PROJECT GUTENBERG EBOOK THE KING JAMES VERSION OF THE BIBLE ***"), "source should include the Gutenberg start marker");

assert.ok(html.includes("<title>Digital Bible | Milsim Rooster</title>"), "reader should have a clear page title");
assert.ok(html.includes('href="styles.css?v=20260705-bottom-nav-1"'), "reader should load cache-busted local CSS");
assert.ok(html.includes('src="app.js?v=20260705-bottom-nav-1"'), "reader should load cache-busted local JS");
assert.ok(html.includes('id="versionSelect"'), "reader should expose a version selector");
assert.ok(html.includes('id="bookSelect"'), "reader should expose a book selector");
assert.ok(html.includes('id="chapterSelect"'), "reader should expose a chapter selector");
assert.ok(html.includes('id="searchInput"'), "reader should expose Bible search");
assert.ok(html.includes('id="scriptureText"'), "reader should render scripture text");
assert.ok(html.includes('id="chapterBottomNav"'), "reader should include bottom chapter navigation");
assert.ok(html.includes('id="nextChapterButton"'), "reader should include a next chapter button near the bottom");
assert.ok(html.includes("Berean Standard Bible"), "reader should make BSB visible as the readable default");
assert.ok(html.includes("Project Gutenberg ebook #10"), "reader should show KJV source attribution");
assert.ok(!html.includes("Hidden Shelf Text Archive"), "reader title area should not show the Hidden Shelf archive eyebrow");
assert.ok(!html.includes("Bible Study Arcade"), "reader should not be the removed game UI");

assert.ok(css.includes("@media (max-width: 760px)"), "reader CSS should include mobile layout rules");
assert.ok(css.includes("font-family"), "reader CSS should define readable typography");
assert.ok(css.includes(".verse-number"), "reader CSS should style verse numbers");
assert.ok(css.includes(".chapter-bottom-nav"), "reader CSS should style bottom chapter navigation");
assert.ok(css.includes(".chapter-nav-button"), "reader CSS should style bottom chapter navigation buttons");

assert.ok(appSource.includes("versionSelect"), "reader app should wire the version selector");
assert.ok(appSource.includes("bsb.json"), "reader app should load generated BSB data");
assert.ok(appSource.includes("kjv.json"), "reader app should keep the generated KJV data available");
assert.ok(appSource.includes("renderChapter"), "reader app should render selected chapters");
assert.ok(appSource.includes("runSearch"), "reader app should support search");
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

const genesisOneOne = bookBySlug.get("genesis").chapters[0].verses[0];
assert.equal(genesisOneOne.number, 1, "Genesis 1:1 should be verse 1");
assert.equal(genesisOneOne.text, "In the beginning God created the heaven and the earth.", "Genesis 1:1 should parse cleanly");

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
