import { CATEGORIES } from "./categories.js";
import { ENGLISH_TRANSLATIONS, PHRASES } from "./phrases.js";
import { SAYINGS } from "./sayings.js";

const appUrl = "https://milsimrooster.com/apps/southern-translator/";

const state = {
  mode: "southern",
  activeCategory: "all",
  current: null
};

const els = {
  modeButtons: [...document.querySelectorAll(".mode-button")],
  inputLabel: document.querySelector("#inputLabel"),
  phraseInput: document.querySelector("#phraseInput"),
  translateButton: document.querySelector("#translateButton"),
  surpriseButton: document.querySelector("#surpriseButton"),
  searchInput: document.querySelector("#searchInput"),
  categoryList: document.querySelector("#categoryList"),
  resultKicker: document.querySelector("#resultKicker"),
  resultPhrase: document.querySelector("#resultPhrase"),
  literalMeaning: document.querySelector("#literalMeaning"),
  actualMeaning: document.querySelector("#actualMeaning"),
  severityMeter: document.querySelector("#severityMeter"),
  roosterNotes: document.querySelector("#roosterNotes"),
  shareText: document.querySelector("#shareText"),
  copyButton: document.querySelector("#copyButton"),
  downloadButton: document.querySelector("#downloadButton"),
  toast: document.querySelector("#toast")
};

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function normalized(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

function searchTokens(text) {
  return normalized(text).split(/\s+/).filter((part) => part.length > 2);
}

function scoreMatch(query, entry) {
  const phrase = normalized(entry.phrase);
  const phraseTokens = searchTokens(entry.phrase);
  const queryTokens = searchTokens(query);
  const haystack = normalized(`${entry.literalMeaning} ${entry.actualMeanings.join(" ")} ${entry.roosterNotes}`);
  if (!query) return 1;
  if (phrase === query) return 100;
  if (phrase.includes(query)) return 80;
  return queryTokens.reduce((score, token) => {
    if (phraseTokens.some((phraseToken) => phraseToken.includes(token) || token.includes(phraseToken))) {
      return score + 12;
    }
    return haystack.includes(token) ? score + 1 : score;
  }, 0);
}

function filteredPhrases(queryText = els.searchInput.value) {
  const query = normalized(queryText);
  return PHRASES
    .filter((entry) => state.activeCategory === "all" || entry.category === state.activeCategory)
    .map((entry) => ({ entry, score: scoreMatch(query, entry) }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.phrase.localeCompare(b.entry.phrase))
    .map((match) => match.entry);
}

function findBestPhrase(input) {
  const query = normalized(input);
  if (!query) return randomItem(filteredPhrases());
  return filteredPhrases(input)[0] || randomItem(PHRASES);
}

function findBestEnglish(input) {
  const query = normalized(input);
  if (!query) return randomItem(ENGLISH_TRANSLATIONS);
  const scored = ENGLISH_TRANSLATIONS
    .map((entry) => {
      const haystack = normalized(`${entry.english} ${entry.southernOptions.join(" ")} ${entry.context}`);
      return { entry, score: haystack.includes(query) ? 3 : query.split(/\s+/).filter((part) => haystack.includes(part)).length };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored[0]?.entry || randomItem(ENGLISH_TRANSLATIONS);
}

function severityStars(severity) {
  return `${"*".repeat(severity)}${"-".repeat(5 - severity)}`;
}

function renderPhrase(entry) {
  const actual = randomItem(entry.actualMeanings);
  const category = CATEGORIES.find((item) => item.id === entry.category);
  state.current = {
    title: entry.phrase,
    literal: entry.literalMeaning,
    actual,
    severity: severityStars(entry.severity),
    notes: entry.roosterNotes,
    kicker: category ? category.label : "Southern"
  };
  renderCurrent();
}

function renderEnglish(entry) {
  state.current = {
    title: entry.english,
    literal: "Plain English request.",
    actual: randomItem(entry.southernOptions),
    severity: "**---",
    notes: entry.roosterNotes,
    kicker: "English to Southern"
  };
  renderCurrent();
}

function renderSaying(entry) {
  const category = CATEGORIES.find((item) => item.id === entry.category);
  state.current = {
    title: entry.saying,
    literal: entry.usage,
    actual: entry.meaning,
    severity: "***--",
    notes: category ? `Category: ${category.label}. ${category.tone}` : "Random Southern wisdom.",
    kicker: "Random Southern Wisdom"
  };
  renderCurrent();
}

function renderCurrent() {
  const card = state.current;
  els.resultKicker.textContent = card.kicker;
  els.resultPhrase.textContent = card.title;
  els.literalMeaning.textContent = card.literal;
  els.actualMeaning.textContent = card.actual;
  els.severityMeter.textContent = card.severity;
  els.roosterNotes.textContent = card.notes;
  els.shareText.value = `${card.title}\n\nLiteral Meaning:\n${card.literal}\n\nActual Southern Translation:\n${card.actual}\n\nSeverity: ${card.severity}\n\nRooster Notes:\n${card.notes}\n\n${appUrl}`;
}

function translate() {
  if (state.mode === "english") {
    renderEnglish(findBestEnglish(els.phraseInput.value));
    return;
  }
  if (state.mode === "wisdom") {
    renderSaying(randomItem(SAYINGS));
    return;
  }
  renderPhrase(findBestPhrase(els.phraseInput.value));
}

function surprise() {
  if (state.mode === "english") renderEnglish(randomItem(ENGLISH_TRANSLATIONS));
  else if (state.mode === "wisdom") renderSaying(randomItem(SAYINGS));
  else renderPhrase(randomItem(filteredPhrases()));
}

function setMode(mode) {
  state.mode = mode;
  els.modeButtons.forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
  els.inputLabel.textContent = mode === "english" ? "Enter plain English" : mode === "wisdom" ? "Random wisdom mode" : "Enter a Southern phrase";
  els.phraseInput.placeholder = mode === "english" ? "This is a bad idea" : mode === "wisdom" ? "Click Generate Southern Wisdom" : "Bless your heart";
  els.translateButton.textContent = mode === "wisdom" ? "Generate Southern Wisdom" : "Translate";
  surprise();
}

function renderCategories() {
  const buttons = [{ id: "all", label: "All" }, ...CATEGORIES].map((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category.label;
    button.className = category.id === state.activeCategory ? "active" : "";
    button.addEventListener("click", () => {
      state.activeCategory = category.id;
      renderCategories();
      if (state.mode === "southern") surprise();
    });
    return button;
  });
  els.categoryList.replaceChildren(...buttons);
}

async function copyText() {
  try {
    await navigator.clipboard.writeText(els.shareText.value);
    showToast("Card text copied.");
  } catch {
    els.shareText.select();
    document.execCommand("copy");
    showToast("Card text selected and copied.");
  }
}

function downloadImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff7e8";
  ctx.fillRect(0, 0, 1200, 1200);
  ctx.fillStyle = "#8f3729";
  ctx.font = "900 44px Segoe UI, Arial";
  ctx.fillText("Southern Translator", 76, 100);
  ctx.fillStyle = "#21170f";
  drawWrappedText(ctx, state.current.title, 76, 210, 1040, 72, "1000 64px Segoe UI, Arial");
  ctx.fillStyle = "#715f4c";
  drawWrappedText(ctx, `Literal: ${state.current.literal}`, 76, 470, 1040, 44, "600 32px Segoe UI, Arial");
  ctx.fillStyle = "#21170f";
  drawWrappedText(ctx, state.current.actual, 76, 680, 1040, 58, "900 44px Segoe UI, Arial");
  ctx.fillStyle = "#8f3729";
  drawWrappedText(ctx, `Rooster Notes: ${state.current.notes}`, 76, 920, 1040, 40, "700 30px Segoe UI, Arial");
  ctx.font = "900 28px Segoe UI, Arial";
  ctx.fillText("milsimrooster.com/apps/southern-translator/", 76, 1110);
  const link = document.createElement("a");
  link.download = "southern-translator-card.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
  showToast("Image downloaded.");
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

function showToast(message) {
  els.toast.textContent = message;
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    els.toast.textContent = "";
  }, 2200);
}

els.modeButtons.forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
els.translateButton.addEventListener("click", translate);
els.surpriseButton.addEventListener("click", surprise);
els.searchInput.addEventListener("input", () => {
  if (state.mode === "southern") renderPhrase(findBestPhrase(els.searchInput.value));
});
els.copyButton.addEventListener("click", copyText);
els.downloadButton.addEventListener("click", downloadImage);

renderCategories();
renderPhrase(PHRASES.find((entry) => entry.phrase === "Bless your heart") || PHRASES[0]);
