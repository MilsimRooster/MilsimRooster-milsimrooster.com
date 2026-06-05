import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const portraitBlock = source.match(/name: "Portraits"[\s\S]*?items: \[([\s\S]*?)\]/);

assert.ok(portraitBlock, "Portraits category should exist");

const portraits = [...portraitBlock[1].matchAll(/"([^"]+\.jpg)"/g)].map((match) => match[1]);

assert.deepEqual(portraits, [
  "/media/optimized/photography/portraits/img-9535.jpg",
  "/media/optimized/photography/portraits/img-9797.jpg"
]);
