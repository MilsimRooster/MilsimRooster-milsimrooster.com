import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const appRoot = join(root, "public", "apps", "bible-study");
const htmlPath = join(appRoot, "index.html");
const cssPath = join(appRoot, "styles.css");
const appPath = join(appRoot, "app.mjs");
const dataPath = join(appRoot, "bible-data.mjs");
const enginePath = join(appRoot, "quiz-engine.mjs");
const scriptureLinksPath = join(appRoot, "scripture-links.mjs");
const artPath = join(appRoot, "assets", "bible-arcade-board.svg");

for (const [label, path] of [
  ["Bible Study Arcade HTML", htmlPath],
  ["Bible Study Arcade CSS", cssPath],
  ["Bible Study Arcade app module", appPath],
  ["Bible Study Arcade data module", dataPath],
  ["Bible Study Arcade engine module", enginePath],
  ["Bible Study Arcade scripture links module", scriptureLinksPath],
  ["Bible Study Arcade local visual asset", artPath],
]) {
  assert.ok(existsSync(path), `${label} should exist at ${path}`);
}

const html = readFileSync(htmlPath, "utf8");
const css = readFileSync(cssPath, "utf8");
const appSource = readFileSync(appPath, "utf8");
const dataSource = readFileSync(dataPath, "utf8");
const engineSource = readFileSync(enginePath, "utf8");
const scriptureLinksSource = readFileSync(scriptureLinksPath, "utf8");
const allArcadeSource = `${html}\n${css}\n${appSource}\n${dataSource}\n${engineSource}\n${scriptureLinksSource}`;

assert.ok(html.includes('href="styles.css'), "index.html should link the local stylesheet");
assert.ok(html.includes('type="module"'), "index.html should load the app as a browser module");
assert.ok(html.includes('src="app.mjs'), "index.html should load app.mjs");
assert.ok(html.includes("Bible Study Arcade"), "index.html should make the hub title visible");
assert.ok(html.includes("assets/bible-arcade-board.svg"), "index.html should use the local arcade artwork");
assert.ok(!html.includes("Game-first Bible learning"), "header should not show the old game-first eyebrow");
assert.ok(!html.includes("class=\"brand-link\""), "header should not show the large Milsim Rooster brand button");
assert.ok(html.includes("gameScrollHint"), "mobile game picker should include a plain scroll hint for guided users");
assert.ok(html.includes("Swipe for more"), "mobile game picker hint should use short plain-language guidance");
assert.ok(html.includes('href="../apostles/"'), "hub should link to Apostles Quest");
assert.ok(html.includes('href="../apostles/new-testament-trail.html"'), "hub should link to New Testament Trail");

assert.ok(appSource.includes("./quiz-engine.mjs"), "app should import the shared quiz engine");
assert.ok(appSource.includes("./bible-data.mjs"), "app should import Bible game data");
assert.ok(appSource.includes("./scripture-links.mjs"), "app should import shared scripture reference links");
assert.ok(appSource.includes("scriptureLinks"), "app should render scripture links after an answer");
assert.match(engineSource, /export function createQuizSession/, "engine should export createQuizSession");
assert.match(engineSource, /export function shuffle/, "engine should export shuffle");
assert.match(scriptureLinksSource, /www\.biblegateway\.com\/passage/, "scripture links should point to Bible Gateway passage search");
assert.match(scriptureLinksSource, /NIV/, "scripture links should include NIV");
assert.match(scriptureLinksSource, /KJV/, "scripture links should include KJV");
assert.match(css, /@media\s*\(max-width:\s*760px\)/, "CSS should include mobile-first narrow viewport rules");
assert.match(css, /min-height:\s*5[2-9]px/, "answer controls should have large tap targets");
assert.ok(css.includes("overflow-x: auto"), "mobile game picker should support horizontal scrolling");
assert.ok(css.includes(".scripture-links"), "feedback panel should style scripture version links");
assert.ok(css.includes(".scroll-hint") && css.includes("display: none"), "scroll hint should stay hidden outside mobile picker layout");
assert.ok(css.includes(".scroll-hint") && css.includes("inline-flex"), "mobile picker should show the scroll hint as a readable inline cue");
assert.ok(css.includes(".game-tab em") && css.includes("display: none"), "mobile game picker should hide long tab descriptions");
assert.ok(css.includes("grid-template-columns: minmax(0, 1fr) 112px"), "mobile header should keep art compact beside the title");

const { gameLaunches, questionPacks } = await import(pathToFileURL(dataPath).href);
const { createQuizSession } = await import(pathToFileURL(enginePath).href);
const { BIBLE_VERSIONS, buildScriptureLinks, buildScriptureUrl } = await import(pathToFileURL(scriptureLinksPath).href);

assert.deepEqual(
  BIBLE_VERSIONS.map((version) => version.id),
  ["NIV", "KJV"],
  "scripture links should expose NIV and KJV in that order",
);

const sampleUrl = buildScriptureUrl("John 3:16", "NIV");
assert.equal(
  sampleUrl,
  "https://www.biblegateway.com/passage/?search=John%203%3A16&version=NIV",
  "scripture link helper should build a Bible Gateway NIV passage URL",
);

const sampleLinks = buildScriptureLinks("Psalm 23:1");
assert.equal(sampleLinks.length, 2, "scripture helper should build two version links");
assert.ok(sampleLinks.some((link) => link.label === "NIV" && link.href.endsWith("version=NIV")), "scripture links should include NIV");
assert.ok(sampleLinks.some((link) => link.label === "KJV" && link.href.endsWith("version=KJV")), "scripture links should include KJV");

assert.ok(Array.isArray(gameLaunches), "gameLaunches should be an array");
assert.ok(gameLaunches.some((game) => game.href === "../apostles/"), "launches should include Apostles Quest");
assert.ok(
  gameLaunches.some((game) => game.href === "../apostles/new-testament-trail.html"),
  "launches should include New Testament Trail",
);

const requiredPacks = [
  "who-said-it",
  "match-the-miracle",
  "pauls-journey-map",
  "parables-quiz",
  "book-order-challenge",
  "character-guess-who",
  "verse-context-challenge",
];
assert.ok(Object.keys(questionPacks).length >= 7, "Bible Study Arcade should have at least seven playable packs");
for (const packId of requiredPacks) {
  assert.ok(questionPacks[packId], `questionPacks should include ${packId}`);
}

const validDifficulties = new Set(["easy", "medium", "hard"]);

for (const packId of requiredPacks) {
  const pack = questionPacks[packId];
  assert.equal(pack.id, packId, `${packId} should declare a matching id`);
  assert.ok(pack.title.length >= 4, `${packId} should have a clear title`);
  assert.ok(pack.oneMoreRoundText.length >= 8, `${packId} should have replay copy`);
  assert.ok(Array.isArray(pack.challenges), `${packId} should have challenges`);
  assert.ok(pack.challenges.length >= 8, `${packId} should have at least 8 challenges`);

  const session = createQuizSession(pack, { roundLength: 5, random: () => 0.42 });
  assert.equal(session.total, 5, `${packId} session should respect requested round length`);
  assert.ok(session.current.prompt, `${packId} session should expose the first prompt`);

  for (const challenge of pack.challenges) {
    assert.ok(challenge.id, `${packId} challenge should have an id`);
    assert.ok(challenge.concept, `${challenge.id} should teach one concept`);
    assert.ok(validDifficulties.has(challenge.difficulty), `${challenge.id} should use a valid difficulty`);
    assert.ok(challenge.prompt.length >= 10, `${challenge.id} should have a real prompt`);
    assert.match(challenge.reference, /^[1-3]?\s?[A-Z][a-z]+/, `${challenge.id} should include a Scripture reference`);
    assert.ok(challenge.explanation.length >= 24, `${challenge.id} should include a useful explanation`);
    assert.ok(challenge.teachingPoint.length >= 16, `${challenge.id} should include a plain teaching point`);
    assert.ok(Array.isArray(challenge.choices), `${challenge.id} should include choices`);
    assert.ok(challenge.choices.length >= 3, `${challenge.id} should include at least 3 choices`);
    assert.equal(challenge.choices.filter((choice) => choice.correct).length, 1, `${challenge.id} should have one correct choice`);

    for (const choice of challenge.choices.filter((choice) => !choice.correct)) {
      assert.ok(choice.wrongNote.length >= 16, `${challenge.id} wrong choice ${choice.id} should teach briefly`);
    }
  }
}

assert.ok(
  questionPacks["parables-quiz"].challenges.length >= 20,
  "Parables Quiz should have enough depth for repeat rounds",
);

for (const banned of [
  "notification",
  "notifications",
  "daily reminder",
  "sign in",
  "create account",
  "login",
  "guilt",
  "streak",
]) {
  assert.ok(!allArcadeSource.toLowerCase().includes(banned), `Bible Study Arcade should avoid "${banned}" language`);
}

console.log("Bible Study Arcade validation passed.");
