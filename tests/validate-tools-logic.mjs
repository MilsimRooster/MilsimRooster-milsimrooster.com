import assert from "node:assert/strict";
import {
  base64Decode,
  base64Encode,
  convertUnit,
  countWords,
  formatJson,
  minifyJson,
  sha256
} from "../src/tools/utils.js";

assert.equal(base64Decode(base64Encode("Rooster tools")), "Rooster tools");
assert.equal(formatJson('{"b":2,"a":1}'), '{\n  "b": 2,\n  "a": 1\n}');
assert.equal(minifyJson('{\n "a": 1\n}'), '{"a":1}');
assert.deepEqual(countWords("One two three."), {
  words: 3,
  characters: 14,
  charactersNoSpaces: 12,
  sentences: 1,
  readingMinutes: 1
});
assert.equal(Number(convertUnit(12, "inch", "foot", "length").toFixed(8)), 1);
assert.equal(Math.round(convertUnit(32, "fahrenheit", "celsius", "temperature")), 0);
assert.equal(await sha256("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
