import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const appRoot = join(root, "public", "apps", "rotorline");
const indexPath = join(appRoot, "index.html");
const homepagePath = join(root, "src", "App.jsx");
const headersPath = join(root, "public", "_headers");

assert.ok(existsSync(indexPath), "Rotorline production index should exist");
assert.ok(existsSync(join(appRoot, "assets")), "Rotorline production assets should exist");

const index = readFileSync(indexPath, "utf8");
const homepage = readFileSync(homepagePath, "utf8");
const headers = readFileSync(headersPath, "utf8");

assert.ok(index.includes("Rotorline: Island Strike"), "Rotorline page should keep its game title");
assert.ok(index.includes('src="./assets/'), "Rotorline scripts should use deploy-safe relative paths");
assert.ok(index.includes('href="./assets/'), "Rotorline styles should use deploy-safe relative paths");
assert.ok(homepage.includes('name: "Rotorline: Island Strike"'), "Homepage should list Rotorline");
assert.ok(homepage.includes('href: "/apps/rotorline/"'), "Homepage should link directly to the Rotorline route");
assert.ok(headers.includes("/apps/rotorline/*"), "Rotorline route should have an explicit cache rule");
assert.ok(headers.includes("connect-src 'self' blob:"), "CSP should allow Three.js to decode embedded GLB textures through blob URLs");

const files = [];
const walk = (directory) => {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) walk(path);
    else files.push(path);
  }
};
walk(appRoot);

const cloudflareFileLimit = 25 * 1024 * 1024;
const oversized = files.filter((path) => statSync(path).size > cloudflareFileLimit);
assert.deepEqual(oversized, [], "Rotorline assets must stay within Cloudflare Pages' 25 MiB file limit");
assert.ok(files.some((path) => path.endsWith("mh6-little-bird.glb")), "MH-6 player helicopter model should be packaged");
assert.ok(files.some((path) => path.endsWith("music-menu.ogg")), "Rotorline title music should be packaged");
console.log(`Rotorline validation passed (${files.length} files).`);
