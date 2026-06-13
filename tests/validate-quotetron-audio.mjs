import assert from "node:assert/strict";
import { stat, readFile } from "node:fs/promises";

const appDir = new URL("../public/apps/quotetron/", import.meta.url);

for (const file of [
  "theme.mp3",
  "decision-take.wav",
  "decision-negotiate.wav",
  "decision-pass.wav",
]) {
  const info = await stat(new URL(`assets/audio/${file}`, appDir));
  assert.ok(info.isFile(), `${file} should exist`);
  assert.ok(info.size > 1024, `${file} should not be empty`);
}

const [html, appJs] = await Promise.all([
  readFile(new URL("index.html", appDir), "utf8"),
  readFile(new URL("assets/js/app.js", appDir), "utf8"),
]);

for (const token of [
  'id="sound-take"',
  'id="sound-negotiate"',
  'id="sound-pass"',
  'id="theme-song"',
  'id="sound-toggle"',
  "assets/js/app.js?v=20260607-audio-lifecycle-1",
]) {
  assert.ok(html.includes(token), `Quotetron HTML should include ${token}`);
}

for (const token of [
  'MOBILE_AUDIO_QUERY = "(hover: none), (pointer: coarse)"',
  "useMobileAudioMix",
  "DESKTOP_THEME_VOLUME",
  "MOBILE_THEME_VOLUME",
  "DESKTOP_DUCKED_THEME_VOLUME",
  "MOBILE_DUCKED_THEME_VOLUME",
  "DESKTOP_DECISION_SOUND_VOLUME",
  "MOBILE_DECISION_SOUND_VOLUME",
  "usePauseDuckingForDecision",
  "ensureAudioGraph",
  "createMediaElementSource(themeSong)",
  "themeGainNode.gain.value",
  "setThemeLevel",
  "duckThemeForDecisionSound",
  "restoreThemeAfterDecisionSound",
  'sound.addEventListener("ended", restoreThemeAfterDecisionSound, { once: true })',
  'sound.addEventListener("pause", restoreThemeAfterDecisionSound, { once: true })',
  "themeWasPlayingBeforeDuck = !themeSong.paused",
  "themeSong.pause()",
  "pauseAudioForPageLifecycle",
  "stopAudioForPageExit",
  'document.addEventListener("visibilitychange"',
  'window.addEventListener("pagehide"',
  'window.addEventListener("beforeunload"',
  'window.addEventListener("freeze"',
]) {
  assert.ok(appJs.includes(token), `Quotetron audio should include ${token}`);
}

assert.ok(!appJs.includes("const decisionSoundVolume = 1"), "mobile decision clips should not be hard-coded to full volume");
