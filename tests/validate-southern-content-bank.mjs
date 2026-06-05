import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const appDir = new URL("public/apps/how-southern-are-you/", root);
const bank = JSON.parse(await readFile(new URL("question-bank.json", appDir), "utf8"));
const report = JSON.parse(await readFile(new URL("content-report.json", appDir), "utf8"));
const questionsJs = await readFile(new URL("questions.js", appDir), "utf8");

const sanitized = questionsJs
  .replace(/export\s+const\s+/g, "const ")
  .replace(/export\s+function\s+/g, "function ");
const context = {};
vm.createContext(context);
vm.runInContext(`${sanitized}\nresult = { QUESTIONS, QUESTION_CATEGORIES };`, context);
const { QUESTIONS, QUESTION_CATEGORIES } = context.result;

const bannedTriviaStarts = /^(which|what|who|when|where)\s+(southern|regional|cultural|historical|state|city|food|tradition|activity)\b/i;
const corporateWords = /\b(identify|consume|regional cuisine|community engagement|recreational activity|frequency|preference|tradition do you|demographic)\b/i;
const difficulties = new Set(["Easy", "Medium", "Hard"]);
const errors = [];
const normalized = new Set();

assert.equal(bank.version, 2);
assert.equal(bank.quizType, "southern-culture-humor");
assert.equal(bank.questions.length, 500);
assert.equal(QUESTIONS.length, 500);
assert.ok(QUESTION_CATEGORIES.includes("southern_culture"));

for (const question of bank.questions) {
  const key = question.question.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (normalized.has(key)) errors.push(`duplicate question: ${question.question}`);
  normalized.add(key);

  if (question.category !== "southern_culture") errors.push(`wrong category: ${question.id}`);
  if (!difficulties.has(question.difficulty)) errors.push(`bad difficulty: ${question.id}`);
  if (!Array.isArray(question.answers) || question.answers.length !== 4) errors.push(`bad answers: ${question.id}`);
  if (!Number.isInteger(question.correctAnswerIndex) || question.correctAnswerIndex < 0 || question.correctAnswerIndex > 3) {
    errors.push(`bad correctAnswerIndex: ${question.id}`);
  }
  if (!question.explanation || question.explanation.split(/\s+/).length > 18) errors.push(`explanation too long: ${question.id}`);
  if (!question.question.endsWith("?")) errors.push(`not a question: ${question.id}`);
  if (question.question.split(/\s+/).length > 15) errors.push(`question too long: ${question.id}`);
  if (bannedTriviaStarts.test(question.question)) errors.push(`trivia wording: ${question.id}`);
  if (corporateWords.test(question.question)) errors.push(`corporate wording: ${question.id}`);
  if (!question.answers.every((answer) => answer.text.split(/\s+/).length <= 6)) errors.push(`answer too long: ${question.id}`);
  if (!question.answers.every((answer) => Number.isFinite(answer.points))) errors.push(`missing points: ${question.id}`);
  if (question.answers[question.correctAnswerIndex]?.points !== 5) errors.push(`top answer not scored: ${question.id}`);
}

assert.deepEqual(errors, []);
assert.equal(report.totalQuestionsAdded, 350);
assert.equal(report.finalQuestionCount, 500);
assert.equal(report.categoryBreakdown.southern_culture, 500);
assert.equal(report.validationErrorsFound, 0);
