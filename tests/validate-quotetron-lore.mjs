import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const appDir = new URL("../public/apps/quotetron/", import.meta.url);
const [html, aboutHtml, privacyHtml, contactHtml, css, appJs] = await Promise.all([
  readFile(new URL("index.html", appDir), "utf8"),
  readFile(new URL("about.html", appDir), "utf8"),
  readFile(new URL("privacy.html", appDir), "utf8"),
  readFile(new URL("contact.html", appDir), "utf8"),
  readFile(new URL("assets/css/styles.css", appDir), "utf8"),
  readFile(new URL("assets/js/app.js", appDir), "utf8"),
]);

for (const token of [
  'id="open-lore-button"',
  'class="lore-bubble"',
  'aria-controls="lore-dialog"',
  'id="lore-dialog"',
  'class="lore-dialog"',
  "The Legend of Quotetron",
  "The Hammer of Truth",
  "The Wrench of Precision",
  "The Saw of Efficiency",
  "The Level of Accuracy",
  "The Blueprint of Wisdom",
  "Build smart. Quote smarter.",
  "Run.",
  "assets/css/styles.css?v=20260608-mobile-hero-2",
  "assets/js/app.js?v=20260607-audio-lifecycle-1",
]) {
  assert.ok(html.includes(token), `Quotetron lore HTML should include ${token}`);
}

for (const token of [
  ".lore-bubble",
  ".lore-dialog",
  ".lore-card",
  ".lore-close",
  ".lore-artifacts",
  ".lore-callout",
  ".lore-dialog::backdrop",
  "@media (max-width: 760px)",
  ".hero::before",
  "aspect-ratio: 3 / 2",
  "text-align: center",
  "justify-content: center",
]) {
  assert.ok(css.includes(token), `Quotetron lore CSS should include ${token}`);
}

for (const token of [
  "openLoreButton",
  "loreDialog",
  "closeLoreButton",
  "openLore",
  "closeLore",
  "loreDialog.showModal()",
  "loreDialog.close()",
  'event.key === "Escape"',
  "event.target === loreDialog",
]) {
  assert.ok(appJs.includes(token), `Quotetron lore JS should include ${token}`);
}

for (const source of [html, aboutHtml, privacyHtml, contactHtml, appJs]) {
  assert.ok(source.includes("Quotetron"), "Quotetron pages and share payload should use approved app name");
  assert.ok(!source.includes("Freelance Quote Floor Calculator"), "legacy app name should not appear on Quotetron pages");
}
