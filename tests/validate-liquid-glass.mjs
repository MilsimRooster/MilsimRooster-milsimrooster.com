import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

for (const token of [
  "--glass-rim",
  "--glass-cyan-rim",
  "--glass-glare",
  ".hero-copy::after",
  ".topbar::after",
  "liquid-glass edge glint",
  "radial-gradient(circle at 12% 8%",
  "linear-gradient(90deg, var(--glass-rim)",
]) {
  assert.ok(css.includes(token), `src/styles.css should include ${token}`);
}

assert.ok(css.includes("border-right-color: var(--glass-cyan-rim)"), "buttons should use the cyan right rim");
