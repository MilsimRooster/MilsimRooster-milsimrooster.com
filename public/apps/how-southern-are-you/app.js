import { QUESTIONS, QUESTION_CATEGORIES } from "./questions.js";
import {
  RESULT_TITLES,
  RESULT_OBSERVATIONS,
  RESULT_WARNINGS,
  RESULT_BADGES,
  SHARE_CAPTIONS,
  REGIONAL_NOTES,
  pickResultRange
} from "./results.js";

const QUIZ_LENGTH = 20;
const appUrl = "https://milsimrooster.com/apps/how-southern-are-you/";
const AUDIO_BASE = "./assets/audio/";
const AUDIO_STORAGE_KEY = "howSouthernAudioMuted";
const BACKGROUND_THEME = "welcome_theme.wav";
const HERO_VOLUME = 0.72;
const MUSIC_VOLUME = 0.32;
const MUSIC_DUCKED_VOLUME = 0.06;
const PAUSE_DUCKING_QUERY = "(hover: none), (pointer: coarse)";
const usePauseDucking = window.matchMedia(PAUSE_DUCKING_QUERY).matches;

const state = {
  questions: [],
  index: 0,
  score: 0,
  maxScore: 0,
  lastScore: 0,
  muted: localStorage.getItem(AUDIO_STORAGE_KEY) === "true",
  lastResultClip: "",
  resultAudioToken: 0
};

const els = {
  startScreen: document.querySelector("#startScreen"),
  quizScreen: document.querySelector("#quizScreen"),
  resultScreen: document.querySelector("#resultScreen"),
  startButton: document.querySelector("#startButton"),
  questionCount: document.querySelector("#questionCount"),
  categoryPill: document.querySelector("#categoryPill"),
  progressBar: document.querySelector("#progressBar"),
  questionText: document.querySelector("#questionText"),
  answers: document.querySelector("#answers"),
  scorePercent: document.querySelector("#scorePercent"),
  resultTitle: document.querySelector("#resultTitle"),
  resultBadge: document.querySelector("#resultBadge"),
  resultObservation: document.querySelector("#resultObservation"),
  resultWarning: document.querySelector("#resultWarning"),
  regionalNote: document.querySelector("#regionalNote"),
  shareText: document.querySelector("#shareText"),
  copyButton: document.querySelector("#copyButton"),
  downloadButton: document.querySelector("#downloadButton"),
  randomizeButton: document.querySelector("#randomizeButton"),
  retryButton: document.querySelector("#retryButton"),
  audioToggle: document.querySelector("#audioToggle"),
  replayResultAudio: document.querySelector("#replayResultAudio"),
  musicAudio: document.querySelector("#musicAudio"),
  heroAudio: document.querySelector("#heroAudio"),
  toast: document.querySelector("#toast"),
  resultCard: document.querySelector("#resultCard")
};

const currentAudio = els.heroAudio || new Audio();
const musicAudio = els.musicAudio || new Audio();
let currentClip = "";
let currentMusic = "";
let activeClipOptions = {};
let musicUnlocked = false;
let musicPausedForDuck = false;

currentAudio.volume = HERO_VOLUME;
currentAudio.preload = "auto";
currentAudio.setAttribute("playsinline", "");
musicAudio.loop = true;
musicAudio.volume = MUSIC_VOLUME;
musicAudio.preload = "auto";
musicAudio.setAttribute("playsinline", "");

function audioClipForScore(score) {
  if (score <= 20) return "yankee-spy.wav";
  if (score <= 40) return "visiting-cousin.wav";
  if (score <= 60) return "honorary-southerner.wav";
  if (score <= 80) return "porch-certified.wav";
  if (score <= 95) return "sweet-tea-professional.wav";
  if (score <= 99) return "state-fair-legend.wav";
  return "southern-champion.wav";
}

function updateAudioToggle() {
  els.audioToggle.textContent = state.muted ? "Audio Off" : "Audio On";
  els.audioToggle.setAttribute("aria-pressed", String(!state.muted));
}

function stopAudio() {
  activeClipOptions = {};
  currentAudio.pause();
  currentAudio.currentTime = 0;
}

function stopMusic() {
  musicPausedForDuck = false;
  musicAudio.pause();
  musicAudio.currentTime = 0;
}

function stopAllAudioForPageLifecycle() {
  stopAudio();
  stopMusic();
}

function stopAllAudioForPageExit() {
  musicUnlocked = false;
  stopAllAudioForPageLifecycle();
}

function resumeMusicAfterPageReturn() {
  if (!document.hidden && !state.muted && musicUnlocked) {
    startBackgroundTheme();
  }
}

function duckMusic() {
  musicPausedForDuck = false;
  if (usePauseDucking) {
    musicPausedForDuck = !musicAudio.paused;
    musicAudio.pause();
    return;
  }
  if (musicAudio.paused) return;
  musicAudio.volume = MUSIC_DUCKED_VOLUME;
}

function restoreMusic() {
  if (state.muted) return;
  musicAudio.volume = MUSIC_VOLUME;
  if (musicPausedForDuck) {
    musicPausedForDuck = false;
    musicAudio.play().then(() => {
      musicUnlocked = true;
    }).catch(() => {
      musicUnlocked = false;
    });
  }
}

function playMusic(file, options = {}) {
  if (state.muted || !file) return Promise.resolve(false);
  const nextMusic = `${AUDIO_BASE}${file}`;
  if (currentMusic !== nextMusic) {
    musicAudio.src = nextMusic;
    currentMusic = nextMusic;
    musicAudio.load();
  }
  musicAudio.loop = true;
  musicAudio.volume = MUSIC_VOLUME;
  const playAttempt = musicAudio.play();
  if (!playAttempt || typeof playAttempt.then !== "function") {
    musicUnlocked = true;
    return Promise.resolve(true);
  }
  return playAttempt.then(() => {
    musicUnlocked = true;
    return true;
  }).catch(() => {
    musicUnlocked = false;
    if (options.silentBlocked) return;
    showToast("Tap Start Quiz to start audio.");
    return false;
  });
}

function startBackgroundTheme() {
  return playMusic(BACKGROUND_THEME);
}

function playClip(file, options = {}) {
  if (state.muted || !file) return;
  stopAudio();
  activeClipOptions = {
    restoreMusicAfter: options.restoreMusicAfter !== false,
    startMusicAfter: options.startMusicAfter === true
  };
  duckMusic();
  const nextClip = `${AUDIO_BASE}${file}`;
  if (currentClip !== nextClip) {
    currentAudio.src = nextClip;
    currentClip = nextClip;
  }
  currentAudio.preload = "auto";
  currentAudio.play().catch(() => {
    if (activeClipOptions.restoreMusicAfter) restoreMusic();
    showToast("Audio is blocked. Click Start Quiz or Replay Result Audio.");
  });
}

function setMuted(value) {
  state.muted = value;
  localStorage.setItem(AUDIO_STORAGE_KEY, String(state.muted));
  if (state.muted) {
    stopAudio();
    stopMusic();
  }
  updateAudioToggle();
  if (!state.muted && musicUnlocked) startBackgroundTheme();
}

function enableAudioAndPlayClip(file) {
  if (state.muted) setMuted(false);
  playClip(file);
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function categoryBalancedQuestions() {
  const byCategory = new Map(QUESTION_CATEGORIES.map((category) => [
    category,
    shuffle(QUESTIONS.filter((question) => question.category === category))
  ]));
  const preferred = ["food", "sayings", "family", "church", "vehicles", "weather", "manners", "outdoors"];
  const picked = [];

  preferred.forEach((category) => {
    picked.push(...(byCategory.get(category) || []).splice(0, category === "food" || category === "sayings" ? 3 : 2));
  });

  const remaining = shuffle([...byCategory.values()].flat());
  return shuffle([...picked, ...remaining]).slice(0, QUIZ_LENGTH);
}

function showOnly(screen) {
  [els.startScreen, els.quizScreen, els.resultScreen].forEach((el) => el.classList.add("hidden"));
  screen.classList.remove("hidden");
}

function startQuiz({ playWelcome = true } = {}) {
  state.resultAudioToken += 1;
  if (playWelcome) {
    playClip("welcome.wav", { startMusicAfter: true });
  } else {
    startBackgroundTheme();
  }
  state.questions = categoryBalancedQuestions();
  state.index = 0;
  state.score = 0;
  state.maxScore = state.questions.reduce((total, question) => total + Math.max(...question.answers.map((answer) => answer.points)), 0);
  showOnly(els.quizScreen);
  renderQuestion();
}

function renderQuestion() {
  const question = state.questions[state.index];
  const questionNumber = state.index + 1;
  els.questionCount.textContent = `Question ${questionNumber} of ${QUIZ_LENGTH}`;
  els.categoryPill.textContent = (question.subcategory || question.category).replace("_", " ");
  els.progressBar.style.width = `${((questionNumber - 1) / QUIZ_LENGTH) * 100}%`;
  els.questionText.textContent = question.question;
  els.answers.innerHTML = "";

  shuffle(question.answers).forEach((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = answer.text;
    button.addEventListener("click", () => chooseAnswer(answer.points));
    els.answers.append(button);
  });
}

function chooseAnswer(points) {
  startBackgroundTheme();
  state.score += points;
  state.index += 1;
  if (state.index >= state.questions.length) {
    showResults();
    return;
  }
  renderQuestion();
}

function buildResult(score) {
  const range = pickResultRange(score);
  const title = range.label;
  const badge = randomItem(RESULT_BADGES);
  const observation = randomItem(RESULT_OBSERVATIONS);
  const warning = randomItem(RESULT_WARNINGS);
  const regionalNote = randomItem(REGIONAL_NOTES);
  const shareCaption = randomItem(SHARE_CAPTIONS);

  return { range, title, badge, observation, warning, regionalNote, shareCaption };
}

function showResults() {
  const score = Math.round((state.score / state.maxScore) * 100);
  state.lastScore = score;
  state.lastResultClip = audioClipForScore(score);
  const resultAudioToken = state.resultAudioToken;
  const result = buildResult(score);
  playClip("calculating.wav");
  els.progressBar.style.width = "100%";
  els.scorePercent.textContent = `${score}%`;
  els.resultTitle.textContent = result.title;
  els.resultBadge.textContent = result.badge;
  els.resultObservation.textContent = result.observation;
  els.resultWarning.textContent = result.warning;
  els.regionalNote.textContent = result.regionalNote;
  els.shareText.value = `I scored ${score}% Southern on Milsim Rooster's "How Southern Are You?" quiz.\n\nApparently I'm ${result.range.label}.\n\n${result.shareCaption}\n\nTake it here:\n${appUrl}`;
  showOnly(els.resultScreen);
  window.setTimeout(() => {
    if (resultAudioToken === state.resultAudioToken && !els.resultScreen.classList.contains("hidden")) {
      playClip(state.lastResultClip);
    }
  }, 650);
}

async function copyText() {
  try {
    await navigator.clipboard.writeText(els.shareText.value);
    playClip("share-result.wav");
    showToast("Share text copied.");
  } catch {
    els.shareText.select();
    document.execCommand("copy");
    playClip("share-result.wav");
    showToast("Share text selected and copied.");
  }
}

async function downloadResultImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff7e8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#8f3729";
  ctx.font = "900 54px Segoe UI, Arial";
  ctx.fillText("How Southern Are You?", 76, 110);
  ctx.font = "1000 190px Segoe UI, Arial";
  ctx.fillText(els.scorePercent.textContent, 76, 310);
  ctx.fillStyle = "#21170f";
  drawWrappedText(ctx, els.resultTitle.textContent, 76, 420, 1040, 70, "900 64px Segoe UI, Arial");
  ctx.fillStyle = "#f2bc57";
  ctx.fillRect(76, 560, 1040, 70);
  ctx.fillStyle = "#21170f";
  ctx.font = "900 34px Segoe UI, Arial";
  ctx.fillText(els.resultBadge.textContent, 104, 606);
  ctx.fillStyle = "#715f4c";
  drawWrappedText(ctx, els.resultObservation.textContent, 76, 710, 1040, 48, "500 34px Segoe UI, Arial");
  ctx.fillStyle = "#8f3729";
  drawWrappedText(ctx, els.resultWarning.textContent, 76, 890, 1040, 44, "900 31px Segoe UI, Arial");
  ctx.fillStyle = "#21170f";
  ctx.font = "900 30px Segoe UI, Arial";
  ctx.fillText("milsimrooster.com/apps/how-southern-are-you/", 76, 1110);
  const link = document.createElement("a");
  link.download = `how-southern-${state.lastScore}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  showToast("Result image downloaded.");
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, font) {
  ctx.font = font;
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(nextLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
      return;
    }
    line = nextLine;
  });
  if (line) ctx.fillText(line, x, currentY);
}

function randomizeResult() {
  const result = buildResult(state.lastScore);
  els.resultTitle.textContent = result.title;
  els.resultBadge.textContent = result.badge;
  els.resultObservation.textContent = result.observation;
  els.resultWarning.textContent = result.warning;
  els.regionalNote.textContent = result.regionalNote;
  els.shareText.value = `I scored ${state.lastScore}% Southern on Milsim Rooster's "How Southern Are You?" quiz.\n\nApparently I'm ${result.range.label}.\n\n${result.shareCaption}\n\nTake it here:\n${appUrl}`;
}

function showToast(message) {
  els.toast.textContent = message;
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    els.toast.textContent = "";
  }, 2200);
}

updateAudioToggle();

els.startButton.addEventListener("click", startQuiz);
els.retryButton.addEventListener("click", () => {
  startQuiz({ playWelcome: false });
  playClip("try-again.wav");
});
els.copyButton.addEventListener("click", copyText);
els.downloadButton.addEventListener("click", downloadResultImage);
els.randomizeButton.addEventListener("click", randomizeResult);
els.audioToggle.addEventListener("click", () => {
  const nextMuted = !state.muted;
  setMuted(nextMuted);
});
els.replayResultAudio.addEventListener("click", () => enableAudioAndPlayClip(state.lastResultClip));

currentAudio.addEventListener("ended", () => {
  if (activeClipOptions.restoreMusicAfter) restoreMusic();
  if (activeClipOptions.startMusicAfter && !state.muted) startBackgroundTheme();
  activeClipOptions = {};
});

function shouldAutoUnlockMusic(event) {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return true;
  if (target.closest("#startButton")) return false;
  if (target.closest("#retryButton")) return false;
  if (target.closest("#replayResultAudio")) return false;
  if (target.closest("#copyButton")) return false;
  if (target.closest("#audioToggle")) return false;
  return true;
}

document.addEventListener("pointerdown", (event) => {
  if (!shouldAutoUnlockMusic(event)) return;
  if (!musicUnlocked && !state.muted) startBackgroundTheme();
}, { capture: true });

document.addEventListener("touchstart", (event) => {
  if (!shouldAutoUnlockMusic(event)) return;
  if (!musicUnlocked && !state.muted) startBackgroundTheme();
}, { capture: true, passive: true });

document.addEventListener("click", (event) => {
  if (!shouldAutoUnlockMusic(event)) return;
  if (!musicUnlocked && !state.muted) startBackgroundTheme();
}, { capture: true });

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAllAudioForPageLifecycle();
  } else {
    resumeMusicAfterPageReturn();
  }
});

window.addEventListener("pagehide", stopAllAudioForPageExit);
window.addEventListener("beforeunload", stopAllAudioForPageExit);
window.addEventListener("freeze", stopAllAudioForPageLifecycle);
window.addEventListener("pageshow", resumeMusicAfterPageReturn);
