import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

for (const token of [
  "--glass-rim",
  "--glass-cyan-rim",
  "--glass-glare",
  "--glass-edge-hot",
  "--glass-inner-cool",
  ".hero-copy::after",
  ".topbar::after",
  "liquid-glass edge glint",
  "radial-gradient(ellipse at 14% -10%, rgba(255, 255, 255, 0.58)",
  "mask-image: linear-gradient(90deg, transparent 0%, #000 12%, #000 58%, transparent 82%)",
  "mix-blend-mode: screen",
  "backdrop-filter: blur(24px) saturate(145%) contrast(86%)",
]) {
  assert.ok(css.includes(token), `src/styles.css should include ${token}`);
}

assert.ok(css.includes("border-right-color: var(--glass-cyan-rim)"), "buttons should use the cyan right rim");
assert.ok(!css.includes("height: 2px;\n  border-radius: 999px;\n  pointer-events: none;\n  /* liquid-glass edge glint */"), "glass glints should not be flat 2px strips");

const tallGlintGroup = css.match(/\.video-card::after,[\s\S]*?\.links-list::after \{[\s\S]*?height: 42%;/);
assert.ok(tallGlintGroup, "shared card glint group should still exist for non-media cards");
assert.ok(!tallGlintGroup[0].includes(".gallery-category::after"), "gallery sections should not use the tall card glint that creates hard media edges");
assert.ok(!tallGlintGroup[0].includes(".hero-copy::after"), "hero copy should use a custom soft glint instead of the tall hard cutoff");
assert.ok(!tallGlintGroup[0].includes(".project-card::after"), "project cards should not use the tall card glint that creates hard software-card edges");

for (const token of [
  ".hero-copy::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;",
  "background:\n    radial-gradient(ellipse at 18% 0%, rgba(255, 255, 255, 0.32)",
  ".gallery-category::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;",
  ".media-tile {\n  position: relative;\n  border-radius: 8px;",
  "linear-gradient(180deg, transparent 0%, transparent 72%, rgba(0, 0, 0, 0.16) 100%)",
  ".split-card p {\n  color: rgba(247, 248, 242, 0.90);",
  ".project-card::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;",
  "radial-gradient(ellipse at 13% 0%, rgba(255, 255, 255, 0.24)",
  ".app-launch::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;",
  "linear-gradient(90deg, transparent 0%, transparent 64%, rgba(126, 239, 229, 0.16) 88%, transparent 100%)",
]) {
  assert.ok(css.includes(token), `src/styles.css should include softened bloom rule: ${token}`);
}

const projectAfter = css.match(/\.project-card::after \{[\s\S]*?\n\}/);
assert.ok(projectAfter, "project cards should define a custom full-card bloom");
assert.ok(!projectAfter[0].includes("height:"), "project card bloom should not have an internal hard height cutoff");

const appLaunchAfter = css.match(/\.app-launch::after \{[\s\S]*?\n\}/);
assert.ok(appLaunchAfter, "app launcher buttons should define a custom full-button bloom");
assert.ok(!appLaunchAfter[0].includes("width:"), "app launcher bloom should not have an internal hard width cutoff");
assert.ok(!appLaunchAfter[0].includes("height:"), "app launcher bloom should not have an internal hard height cutoff");
