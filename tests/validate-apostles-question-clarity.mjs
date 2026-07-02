import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../public/apps/apostles/game.js", import.meta.url), "utf8");
const prefix = source.slice(0, source.indexOf("const state ="));
const context = {
  q(text, answer, wrong, category, hint) {
    return { text, answer, wrong, category, hint };
  },
  shuffle(items) {
    return [...items];
  },
};

vm.runInNewContext(`${prefix}
globalThis.questions = questions;`, context);

assert.ok(context.questions.length >= 100, "Apostles Quest should keep a broad classroom question bank");

const bannedQuestionPhrases = [
  "traditionally connected",
  "in church tradition",
  "manifest yourself",
  "without deceit",
  "martyred",
  "entrusted with caring",
  "first deacons",
  "may point to strong political",
  "name means 'manly'",
  "former job would make him familiar",
  "shares a first name",
];

for (const question of context.questions) {
  assert.ok(question.text.length <= 92, `Question is too long for classroom play: ${question.text}`);
  for (const phrase of bannedQuestionPhrases) {
    assert.ok(
      !question.text.toLowerCase().includes(phrase.toLowerCase()),
      `Question should use plainer language instead of "${phrase}": ${question.text}`,
    );
  }
}

console.log("Apostles Quest question clarity validation passed.");
