import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { shouldInjectAppTheme } from "../functions/_middleware.js";

const root = process.cwd();
const middlewarePath = join(root, "functions", "_middleware.js");
const scriptPath = join(root, "public", "assets", "js", "app-theme-20260812.js");
const stylePath = join(root, "public", "assets", "css", "app-theme-20260812.css");

for (const [label, path] of [
  ["theme middleware", middlewarePath],
  ["shared app theme script", scriptPath],
  ["shared app theme CSS", stylePath],
]) {
  assert.equal(existsSync(path), true, `${label} should exist`);
}

const middleware = readFileSync(middlewarePath, "utf8");
const script = readFileSync(scriptPath, "utf8");
const style = readFileSync(stylePath, "utf8");

for (const pathname of [
  "/apps/apostles/",
  "/apps/quotetron/about.html",
  "/bible/",
  "/bible/lessons/",
  "/tools/",
  "/tools/pdf/",
]) {
  assert.equal(shouldInjectAppTheme(pathname), true, `${pathname} should receive the app theme`);
}

for (const pathname of [
  "/",
  "/about/",
  "/assets/js/app-theme-20260812.js",
  "/api/referrer",
]) {
  assert.equal(shouldInjectAppTheme(pathname), false, `${pathname} should not receive the app theme`);
}

for (const token of [
  "/assets/css/app-theme-20260812.css",
  "/assets/js/app-theme-20260812.js",
  "shouldInjectAppTheme(pathname)",
  "new SiteHeadInjector(shouldInjectAppTheme(pathname))",
]) {
  assert.ok(middleware.includes(token), `middleware should include ${token}`);
}

for (const token of [
  "mr-color-theme",
  "prefers-color-scheme: dark",
  "localStorage.getItem",
  "localStorage.setItem",
  "data-mr-theme-toggle",
  "aria-label",
  "DOMContentLoaded",
  'addEventListener("storage"',
]) {
  assert.ok(script.includes(token), `theme script should include ${token}`);
}

for (const token of [
  ".mr-theme-toggle",
  'html[data-mr-theme="light"]',
  'html[data-mr-theme="dark"]',
  '[data-mr-app="apostles"]',
  '[data-mr-app="bible"]',
  '[data-mr-app="tools"]',
  '[data-mr-app="quotetron"]',
  "@media (max-width: 600px)",
  "@media (prefers-reduced-motion: reduce)",
]) {
  assert.ok(style.includes(token), `theme CSS should include ${token}`);
}

assert.equal(script.includes("document.cookie"), false, "theme preference should not use cookies");
assert.equal(script.includes("fetch("), false, "theme control should be entirely local");

console.log("Shared app theme validation passed.");
