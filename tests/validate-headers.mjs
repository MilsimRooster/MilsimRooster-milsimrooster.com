import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const headers = await readFile(new URL("../public/_headers", import.meta.url), "utf8");

for (const token of [
  "/*",
  "Strict-Transport-Security: max-age=31536000; includeSubDomains",
  "Content-Security-Policy: default-src 'self'",
  "frame-ancestors 'none'",
  "X-Frame-Options: DENY",
  "X-Content-Type-Options: nosniff",
  "Referrer-Policy: strict-origin-when-cross-origin",
  "Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()",
  "/assets/*",
  "Cache-Control: public, max-age=31556952, immutable",
  "/media/optimized/*",
  "Cache-Control: public, max-age=2592000",
  "/apps/*/*.js",
  "/apps/*/*.css",
  "/apps/*/*.json",
  "Cache-Control: public, max-age=3600"
]) {
  assert.ok(headers.includes(token), `public/_headers should include ${token}`);
}

const headerBlocks = headers
  .split(/\n(?=\/)/)
  .map((block) => block.trimEnd())
  .filter(Boolean);

for (const block of headerBlocks) {
  const lines = block.split("\n");
  assert.ok(lines[0].startsWith("/"), `header block should start with a route pattern: ${lines[0]}`);

  for (const line of lines.slice(1).filter(Boolean)) {
    assert.ok(/^\s{2}\S/.test(line), `header line should be indented by two spaces: ${line}`);
  }
}
