import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const redirects = readFileSync(join(root, "public", "_redirects"), "utf8");

for (const rule of [
  "/apps/fellowship-hall / 302",
  "/apps/fellowship-hall/ / 302",
  "/apps/fellowship-hall/* / 302",
]) {
  assert.ok(redirects.includes(rule), `retired Fellowship Hall route should redirect away from the removed app: ${rule}`);
}

for (const staleRewrite of [
  "/apps/fellowship-hall/schedule /apps/fellowship-hall/ 200",
  "/apps/fellowship-hall/invite/* /apps/fellowship-hall/ 200",
  "/apps/fellowship-hall/hub /apps/fellowship-hall/ 200",
  "/apps/fellowship-hall/hub/* /apps/fellowship-hall/ 200",
  "/apps/fellowship-hall/admin/* /apps/fellowship-hall/ 200",
]) {
  assert.equal(redirects.includes(staleRewrite), false, `retired Fellowship Hall SPA rewrite should be absent: ${staleRewrite}`);
}

for (const path of [
  join(root, "public", "apps", "fellowship-hall"),
  join(root, "functions", "_lib", "fellowship-api.js"),
  join(root, "migrations", "0005_fellowship_hall.sql"),
  join(root, "migrations", "0006_fellowship_admin_settings.sql"),
  join(root, "migrations", "0007_fellowship_prayers.sql"),
  join(root, "tests", "validate-fellowship-hall.mjs"),
  join(root, "tests", "validate-fellowship-hall-live.mjs"),
]) {
  assert.equal(existsSync(path), false, `retired Fellowship Hall implementation should be removed: ${path}`);
}

for (const path of [
  join(root, "functions", "apps", "fellowship-hall", "[[path]].js"),
  join(root, "functions", "api", "fellowship", "[[path]].js"),
  join(root, "functions", "api", "admin", "fellowship", "[[path]].js"),
]) {
  assert.ok(existsSync(path), `retired route handler should exist: ${path}`);
  const module = await import(pathToFileURL(path).href);
  const response = module.onRequest();
  assert.equal(response.status, 410, `retired route handler should return 410: ${path}`);
}

console.log("Retired Fellowship Hall validation passed.");
