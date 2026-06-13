import assert from "node:assert/strict";
import { stat, readFile } from "node:fs/promises";

const appDir = new URL("../public/apps/how-southern-are-you/", import.meta.url);

const audioFiles = [
  "welcome_theme.wav",
  "questions.wav",
  "welcome.wav",
  "calculating.wav",
  "yankee-spy.wav",
  "visiting-cousin.wav",
  "honorary-southerner.wav",
  "porch-certified.wav",
  "sweet-tea-professional.wav",
  "state-fair-legend.wav",
  "southern-champion.wav",
  "try-again.wav",
  "share-result.wav",
  "wrong-answer.wav",
  "correct-answer.wav",
  "bless-your-heart.wav",
  "gravy-biscuit.wav"
];

for (const file of audioFiles) {
  const info = await stat(new URL(`assets/audio/${file}`, appDir));
  assert.ok(info.isFile(), `${file} should exist`);
  assert.ok(info.size > 1024, `${file} should not be empty`);
}

const [html, appJs, css] = await Promise.all([
  readFile(new URL("index.html", appDir), "utf8"),
  readFile(new URL("app.js", appDir), "utf8"),
  readFile(new URL("style.css", appDir), "utf8")
]);

assert.ok(html.includes('id="audioToggle"'), "audio toggle should exist");
assert.ok(!html.includes('id="playWelcomeAudio"'), "play welcome audio button should not exist");
assert.ok(html.includes('id="replayResultAudio"'), "replay result audio button should exist");
assert.ok(html.includes('id="musicAudio"'), "background audio element should exist in the DOM");
assert.ok(html.includes('id="heroAudio"'), "hero audio element should exist in the DOM");
assert.ok(html.includes("Hear Bubba say it"), "result audio label should exist");
assert.ok(html.includes("./app.js?v=20260607-audio-lifecycle-1"), "quiz app script should be cache-busted for audio lifecycle handling");

assert.ok(appJs.includes('AUDIO_STORAGE_KEY = "howSouthernAudioMuted"'), "mute storage key should be named");
assert.ok(appJs.includes("localStorage.getItem(AUDIO_STORAGE_KEY)"), "mute state should load from localStorage");
assert.ok(appJs.includes("localStorage.setItem(AUDIO_STORAGE_KEY"), "mute state should save to localStorage");
assert.ok(appJs.includes("currentAudio.pause()"), "new clips should stop previous audio");
assert.ok(appJs.includes("currentAudio.currentTime = 0"), "new clips should reset previous audio");
assert.ok(appJs.includes(".catch("), "missing or blocked audio should not crash");
assert.ok(appJs.includes("new Audio()"), "audio should use a reusable element");
assert.ok(!appJs.includes("playWelcomeAudio"), "welcome clip should not have a separate play button");
assert.ok(appJs.includes("enableAudioAndPlayClip"), "explicit play buttons should unmute and play");
assert.ok(appJs.includes("showToast(\"Tap Start Quiz"), "blocked background playback should surface a visible fallback");
assert.ok(appJs.includes('playClip("welcome.wav", { startMusicAfter: true })'), "start quiz should trigger welcome.wav before background music");
assert.ok(
  appJs.indexOf('playClip("welcome.wav", { startMusicAfter: true })') < appJs.indexOf("state.questions = categoryBalancedQuestions()"),
  "welcome voice should be queued before rendering quiz state",
);
assert.ok(appJs.includes("playWelcome = true"), "start quiz should be able to skip welcome.wav on retry");
assert.ok(appJs.includes("startQuiz({ playWelcome: false })"), "retry should not replay welcome.wav");
assert.ok(appJs.includes('playClip("try-again.wav")'), "retry should trigger try-again.wav");
assert.ok(appJs.includes("musicAudio.loop = true"), "background music should loop");
assert.ok(appJs.includes('BACKGROUND_THEME = "welcome_theme.wav"'), "welcome theme should be the background track");
assert.ok(appJs.includes("startBackgroundTheme()"), "background theme should start from user interaction");
assert.ok(!appJs.includes("playMusic(BACKGROUND_THEME, { silentBlocked: true })"), "background music should not auto-start on page load");
assert.ok(appJs.includes('document.addEventListener("pointerdown"'), "mobile first tap should unlock background music");
assert.ok(appJs.includes('document.addEventListener("touchstart"'), "mobile touch should unlock background music");
assert.ok(appJs.includes("shouldAutoUnlockMusic"), "global audio unlock should skip controls with their own voice triggers");
assert.ok(appJs.includes('target.closest("#startButton")'), "start button should not auto-start background music before welcome voice");
assert.ok(appJs.includes("musicUnlocked = true"), "background music should unlock after playback succeeds");
assert.ok(appJs.includes("musicUnlocked = false"), "failed playback should remain retryable");
assert.ok(!appJs.includes('playMusic("questions.wav")'), "questions theme should not replace the continuous background theme");
assert.ok(appJs.includes("stopMusic()"), "background music should be stoppable");
assert.ok(appJs.includes("MUSIC_DUCKED_VOLUME"), "background music should duck during voice clips");
assert.ok(appJs.includes("duckMusic()"), "voice clips should lower background music");
assert.ok(appJs.includes("restoreMusic()"), "background music should restore after voice clips");
assert.ok(appJs.includes("startMusicAfter: options.startMusicAfter === true"), "voice clips should optionally start music after narration");
assert.ok(!appJs.includes('startBackgroundTheme();\n  if (playWelcome) playClip("welcome.wav")'), "welcome voice should not collide with immediate background start");
assert.ok(appJs.includes("PAUSE_DUCKING_QUERY"), "mobile should use pause ducking when volume control is unreliable");
assert.ok(appJs.includes("musicPausedForDuck = !musicAudio.paused"), "mobile ducking should only resume background music when it paused active music");
assert.ok(appJs.includes("musicAudio.play().then"), "mobile ducking should resume the background track");
assert.ok(appJs.includes("stopAllAudioForPageLifecycle"), "page lifecycle should stop quiz audio");
assert.ok(appJs.includes("stopAllAudioForPageExit"), "page exit should stop quiz audio and reset unlock state");
assert.ok(appJs.includes('document.addEventListener("visibilitychange"'), "quiz audio should pause when the page is hidden");
assert.ok(appJs.includes('window.addEventListener("pagehide"'), "quiz audio should stop on pagehide");
assert.ok(appJs.includes('window.addEventListener("beforeunload"'), "quiz audio should stop before unload");
assert.ok(appJs.includes('window.addEventListener("freeze"'), "quiz audio should stop when the page freezes");

for (const [range, file] of [
  ["score <= 20", "yankee-spy.wav"],
  ["score <= 40", "visiting-cousin.wav"],
  ["score <= 60", "honorary-southerner.wav"],
  ["score <= 80", "porch-certified.wav"],
  ["score <= 95", "sweet-tea-professional.wav"],
  ["score <= 99", "state-fair-legend.wav"],
  ["southern-champion.wav", "southern-champion.wav"]
]) {
  assert.ok(appJs.includes(range), `mapping should include ${range}`);
  assert.ok(appJs.includes(file), `mapping should include ${file}`);
}

assert.ok(css.includes(".audio-toggle"), "audio toggle should be styled");
assert.ok(css.includes(".result-audio-row"), "result audio row should be styled");
