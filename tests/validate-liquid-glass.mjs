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
  "radial-gradient(ellipse at 14% -4%, rgba(255, 255, 255, 0.26)",
  "linear-gradient(90deg, transparent 0%, transparent 66%, rgba(126, 239, 229, 0.18) 90%, transparent 100%)",
  "mix-blend-mode: screen",
  "backdrop-filter: blur(24px) saturate(145%) contrast(86%)",
]) {
  assert.ok(css.includes(token), `src/styles.css should include ${token}`);
}

assert.ok(css.includes("border-right-color: var(--glass-cyan-rim)"), "buttons should use the cyan right rim");
assert.ok(!css.includes("height: 2px;\n  border-radius: 999px;\n  pointer-events: none;\n  /* liquid-glass edge glint */"), "glass glints should not be flat 2px strips");
assert.ok(!css.includes("inset: 1px auto auto 5%;"), "topbar bloom should not use a clipped inset strip");
assert.ok(!css.includes("inset: 1px 5% auto 5%;"), "shared card bloom should not use a clipped inset strip");
assert.ok(!css.includes("height: 42%;"), "shared glass bloom should not have a hard internal height cutoff");

const sharedGlintGroup = css.match(/\.video-card::after,[\s\S]*?\.links-list::after \{[\s\S]*?\n\}/);
assert.ok(sharedGlintGroup, "shared card glint group should still exist for non-media cards");
assert.ok(sharedGlintGroup[0].includes("inset: 0;"), "shared card glint should cover the whole surface");
assert.ok(!sharedGlintGroup[0].includes("width:"), "shared card glint should not have an internal hard width cutoff");
assert.ok(!sharedGlintGroup[0].includes("height:"), "shared card glint should not have an internal hard height cutoff");
assert.ok(!sharedGlintGroup[0].includes(".gallery-category::after"), "gallery sections should not use the shared card glint");
assert.ok(!sharedGlintGroup[0].includes(".hero-copy::after"), "hero copy should use a custom soft glint");
assert.ok(!sharedGlintGroup[0].includes(".project-card::after"), "project cards should use a custom soft glint");

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
  "footer::before {\n  content: \"\";\n  position: absolute;",
  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.16) 14%, rgba(126, 239, 229, 0.20) 50%, transparent 100%)",
]) {
  assert.ok(css.includes(token), `src/styles.css should include softened bloom rule: ${token}`);
}

const topbarAfter = css.match(/\.topbar::after \{[\s\S]*?\n\}/);
assert.ok(topbarAfter, "topbar should define a full-surface bloom");
assert.ok(topbarAfter[0].includes("inset: 0;"), "topbar bloom should cover the whole surface");
assert.ok(!topbarAfter[0].includes("width:"), "topbar bloom should not have an internal hard width cutoff");
assert.ok(!topbarAfter[0].includes("height:"), "topbar bloom should not have an internal hard height cutoff");

const projectAfter = css.match(/\.project-card::after \{[\s\S]*?\n\}/);
assert.ok(projectAfter, "project cards should define a custom full-card bloom");
assert.ok(!projectAfter[0].includes("height:"), "project card bloom should not have an internal hard height cutoff");

const appLaunchAfter = css.match(/\.app-launch::after \{[\s\S]*?\n\}/);
assert.ok(appLaunchAfter, "app launcher buttons should define a custom full-button bloom");
assert.ok(!appLaunchAfter[0].includes("width:"), "app launcher bloom should not have an internal hard width cutoff");
assert.ok(!appLaunchAfter[0].includes("height:"), "app launcher bloom should not have an internal hard height cutoff");
