import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/gallery/main.js", import.meta.url), "utf8");
const galleryData = await readFile(new URL("../src/gallery/archive-data.js", import.meta.url), "utf8");
const archiveItems = JSON.parse(galleryData.match(/export const archiveItems = ([\s\S]*?);\n$/)[1]);

assert.ok(!source.includes("/media/optimized/photography/portraits/"), "archive gallery should not include portrait portfolio images");
assert.ok(!source.includes("/media/optimized/photography/events/"), "archive gallery should not include event portfolio images");
assert.ok(archiveItems.length > 0, "archive gallery should include generated archive items");

for (const item of archiveItems) {
  assert.equal(item.filter, "archive", `${item.title} should be marked as archive content`);
  assert.ok(item.src.startsWith("/media/archive/milsim/"), `${item.title} should use the public archive media path`);
}
