import { createQuizSession } from "./quiz-engine.mjs";
import { defaultPackId, gameLaunches, questionPacks } from "./bible-data.mjs";
import { buildScriptureLinks } from "./scripture-links.mjs";

const state = {
  activePackId: defaultPackId,
  session: createQuizSession(questionPacks[defaultPackId])
};

const el = {
  gameTabs: document.querySelector("#gameTabs"),
  launchGrid: document.querySelector("#launchGrid"),
  packEyebrow: document.querySelector("#packEyebrow"),
  packTitle: document.querySelector("#packTitle"),
  packSummary: document.querySelector("#packSummary"),
  roundCounter: document.querySelector("#roundCounter"),
  scoreCounter: document.querySelector("#scoreCounter"),
  routePanel: document.querySelector("#routePanel"),
  routePlace: document.querySelector("#routePlace"),
  routeStops: document.querySelector("#routeStops"),
  conceptBadge: document.querySelector("#conceptBadge"),
  difficultyBadge: document.querySelector("#difficultyBadge"),
  questionPrompt: document.querySelector("#questionPrompt"),
  answerGrid: document.querySelector("#answerGrid"),
  feedbackPanel: document.querySelector("#feedbackPanel"),
  feedbackTitle: document.querySelector("#feedbackTitle"),
  feedbackCopy: document.querySelector("#feedbackCopy"),
  referenceText: document.querySelector("#referenceText"),
  scriptureLinks: document.querySelector("#scriptureLinks"),
  teachingPoint: document.querySelector("#teachingPoint"),
  roundSummary: document.querySelector("#roundSummary"),
  roundSummaryText: document.querySelector("#roundSummaryText"),
  nextButton: document.querySelector("#nextButton"),
  restartButton: document.querySelector("#restartButton")
};

function renderGameTabs() {
  el.gameTabs.innerHTML = Object.values(questionPacks).map((pack) => `
    <button class="game-tab ${pack.id === state.activePackId ? "active" : ""}" type="button" data-pack="${escapeAttr(pack.id)}">
      <span>${escapeHtml(pack.eyebrow)}</span>
      <strong>${escapeHtml(pack.title)}</strong>
      <em>${escapeHtml(pack.summary)}</em>
    </button>
  `).join("");
}

function renderLaunchGrid() {
  el.launchGrid.innerHTML = gameLaunches.map((game) => `
    <a class="launch-card" href="${escapeAttr(game.href)}">
      <span>${escapeHtml(game.eyebrow)}</span>
      <strong>${escapeHtml(game.title)}</strong>
      <em>${escapeHtml(game.mode)}</em>
      <p>${escapeHtml(game.summary)}</p>
    </a>
  `).join("");
}

function renderRound() {
  const { session } = state;
  const pack = session.pack;
  const challenge = session.current;
  const answered = session.answered;
  const result = session.lastResult;
  const questionNumber = session.currentIndex + 1;

  renderGameTabs();
  el.packEyebrow.textContent = pack.eyebrow;
  el.packTitle.textContent = pack.title;
  el.packSummary.textContent = pack.summary;
  el.roundCounter.textContent = `${questionNumber} / ${session.total}`;
  el.scoreCounter.textContent = `${session.correctCount} correct`;
  el.conceptBadge.textContent = challenge.concept;
  el.difficultyBadge.textContent = challenge.difficulty;
  el.questionPrompt.textContent = challenge.prompt;
  el.answerGrid.innerHTML = challenge.choices.map((choice) => answerButton(choice, result, answered)).join("");

  document.querySelectorAll(".answer-button").forEach((button) => {
    button.addEventListener("click", () => chooseAnswer(button.dataset.choice));
  });

  renderFeedback(result);
  renderRoute(pack, session, challenge);
  renderSummary();

  el.nextButton.textContent = session.complete ? pack.oneMoreRoundText : "Next card";
  el.nextButton.disabled = !answered;
}

function answerButton(choice, result, answered) {
  let status = "";
  if (answered && choice.correct) status = "correct";
  if (answered && result?.choice.id === choice.id && !choice.correct) status = "wrong";

  return `
    <button class="answer-button ${status}" type="button" data-choice="${escapeAttr(choice.id)}" ${answered ? "disabled" : ""}>
      ${escapeHtml(choice.text)}
    </button>
  `;
}

function chooseAnswer(choiceId) {
  state.session.answer(choiceId);
  renderRound();
}

function renderFeedback(result) {
  el.feedbackPanel.hidden = !result;
  if (!result) {
    el.feedbackTitle.textContent = "";
    el.feedbackCopy.textContent = "";
    el.referenceText.textContent = "";
    el.scriptureLinks.innerHTML = "";
    el.teachingPoint.textContent = "";
    return;
  }

  const challenge = result.challenge;
  const answerText = result.correctChoice.text;
  el.feedbackTitle.textContent = result.correct ? "Correct." : `Good try. Answer: ${answerText}.`;
  el.feedbackCopy.textContent = result.correct
    ? challenge.explanation
    : `${result.feedback} ${challenge.explanation}`;
  el.referenceText.textContent = challenge.reference;
  el.scriptureLinks.innerHTML = buildScriptureLinks(challenge.reference).map((link) => `
    <a href="${escapeAttr(link.href)}" target="_blank" rel="noopener noreferrer" aria-label="Read ${escapeAttr(challenge.reference)} in ${escapeAttr(link.label)}">
      ${escapeHtml(link.label)}
    </a>
  `).join("");
  el.teachingPoint.textContent = challenge.teachingPoint;
}

function renderRoute(pack, session, challenge) {
  const stops = pack.routeStops || [];
  el.routePanel.hidden = stops.length === 0;
  if (stops.length === 0) return;

  const activePlace = challenge.place || stops[Math.min(session.currentIndex, stops.length - 1)];
  const activeIndex = Math.max(0, stops.indexOf(activePlace));
  el.routePlace.textContent = activePlace;
  el.routeStops.innerHTML = stops.map((stop, index) => {
    const status = index < activeIndex ? "complete" : index === activeIndex ? "current" : "";
    return `<span class="${status}">${escapeHtml(stop)}</span>`;
  }).join("");
}

function renderSummary() {
  const complete = state.session.complete;
  el.roundSummary.hidden = !complete;
  if (!complete) return;

  const { correctCount, total, pack } = state.session;
  el.roundSummaryText.textContent = `${correctCount} of ${total} right. ${pack.oneMoreRoundText}.`;
}

function setPack(packId) {
  const pack = questionPacks[packId];
  if (!pack) return;
  state.activePackId = packId;
  state.session = createQuizSession(pack);
  renderRound();
}

function nextOrRestart() {
  if (state.session.complete) {
    state.session = state.session.restart();
  } else {
    state.session.next();
  }
  renderRound();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

el.gameTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-pack]");
  if (!button) return;
  setPack(button.dataset.pack);
});

el.nextButton.addEventListener("click", nextOrRestart);
el.restartButton.addEventListener("click", () => setPack(state.activePackId));

renderLaunchGrid();
renderRound();
