import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("functions/_middleware.js", "utf8");

assert.match(source, /wp-admin/);
assert.match(source, /wp-content/);
assert.match(source, /cgi-bin/);
assert.match(source, /\\.php/);
assert.match(source, /status:\s*410/);
assert.match(source, /context\.next\(\)/);

const blockedExamples = [
  "/wp-admin/",
  "/wp-content/plugins/hellopress/wp_filemanager.php",
  "/cgi-bin/",
  "/info.php",
  "/alfa.php",
  "/xmlrpc.php",
  "/wp-login.php"
];

const allowedExamples = [
  "/",
  "/about/",
  "/apps/apostles/new-testament-trail",
  "/apps/apostles/new-testament-trail.html",
  "/apps/bug-strike/src/core.js",
  "/media/archive/second-layer/img-1951.jpg"
];

const patterns = [
  /^\/[^/?#]*\.php$/i,
  /^\/(?:wp-admin|wp-content|wp-includes)(?:\/|$)/i,
  /^\/cgi-bin(?:\/|$)/i,
  /^\/(?:xmlrpc|wp-login)\.php$/i
];

const isScannerProbe = (pathname) => patterns.some((pattern) => pattern.test(pathname));

for (const path of blockedExamples) {
  assert.equal(isScannerProbe(path), true, `${path} should be blocked`);
}

for (const path of allowedExamples) {
  assert.equal(isScannerProbe(path), false, `${path} should stay allowed`);
}
