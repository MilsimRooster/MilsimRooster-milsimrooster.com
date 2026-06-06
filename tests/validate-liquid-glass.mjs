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
