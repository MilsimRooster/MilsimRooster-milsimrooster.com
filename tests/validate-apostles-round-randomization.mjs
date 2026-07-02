import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

function extractFunction(source, name) {
  const start = source.indexOf(`function ${name}`);
  assert.notEqual(start, -1, `Missing ${name}`);
  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`Could not extract ${name}`);
}

function validateRoundBuilder(label, source, totalCount, roundLength) {
  const context = {
    shuffle(items) {
      return [...items];
    },
  };

  vm.runInNewContext(`${extractFunction(source, "buildRoundOrder")}
globalThis.buildRoundOrder = buildRoundOrder;`, context);

  const firstRound = context.buildRoundOrder(totalCount, roundLength, []);
  const secondRound = context.buildRoundOrder(totalCount, roundLength, firstRound);
  const overlap = secondRound.filter(index => firstRound.includes(index));

  assert.equal(firstRound.length, roundLength, `${label} should build a full first round`);
  assert.equal(new Set(firstRound).size, roundLength, `${label} first round should not repeat questions`);
  assert.equal(secondRound.length, roundLength, `${label} should build a full second round`);
  assert.equal(new Set(secondRound).size, roundLength, `${label} second round should not repeat questions`);
  assert.equal(overlap.length, 0, `${label} should avoid the previous round when the bank has room`);
}

async function readFirst(paths) {
  for (const path of paths) {
    try {
      return await readFile(new URL(path, import.meta.url), "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  throw new Error(`None of these files exist: ${paths.join(", ")}`);
}

const apostlesSource = await readFirst(["../public/apps/apostles/game.js", "../game.js"]);
const trailSource = await readFirst(["../public/apps/apostles/nt-game.js", "../nt-game.js"]);

const apostlesQuestionCount = [...apostlesSource.matchAll(/\bq\(/g)].length;
const trailQuestionCount = [...trailSource.matchAll(/\bcard\(/g)].length - 1;

validateRoundBuilder("Apostles Quest", apostlesSource, apostlesQuestionCount, 10);
validateRoundBuilder("New Testament Trail", trailSource, trailQuestionCount, 10);

assert.ok(!apostlesSource.includes("state.current % questions.length"), "Apostles Quest should use a fixed round deck, not modulo wraparound");
assert.ok(!trailSource.includes("state.current % studyCards.length"), "New Testament Trail should use a fixed round deck, not modulo wraparound");

console.log("Apostles round randomization validation passed.");
