const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const shell = document.querySelector(".shell");
const W = canvas.width;
const H = canvas.height;
const core = window.BugStrikeCore;
const layout = core.hybridLayout({ canvasWidth: W, canvasHeight: H, sideHudWidth: 300 });
const FIELD_W = layout.fieldWidth;
const FIELD_H = layout.fieldHeight;
const HUD_X = layout.hudX;
const HUD_W = layout.hudWidth;
const loadedImages = new Map();
const loadedSounds = new Map();
const debugParams = new URLSearchParams(location.search);

const STORAGE = {
  scores: "bug-strike.leaderboard",
  achievements: "bug-strike.achievements",
  settings: "bug-strike.settings",
};

const ACHIEVEMENTS = [
  ["kills_1000", "CENTURION", "Destroy 1,000 enemies"],
  ["kills_5000", "DESTROYER", "Destroy 5,000 enemies"],
  ["boss_1", "FIRST CLEANSE", "Defeat your first malware boss"],
  ["boss_5", "ROOT ACCESS", "Defeat 5 malware bosses"],
  ["combo_1000", "CHAIN MASTER", "Reach a 1,000x combo"],
  ["combo_2000", "UNSTOPPABLE", "Reach a 2,000x combo"],
];

const keys = new Set();
const pointer = { active: false, fire: false, x: FIELD_W / 2, y: H - 120 };
const rnd = (min, max) => Math.random() * (max - min) + min;
const clamp = core.clamp;
const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
let renderProfile = core.renderProfile();

function refreshRenderProfile() {
  renderProfile = core.renderProfile({
    coarsePointer: window.matchMedia?.("(pointer: coarse)")?.matches ?? false,
    viewportWidth: window.innerWidth,
    pixelRatio: window.devicePixelRatio ?? 1,
    forceLite: debugParams.has("lite") || debugParams.has("mobilelite"),
  });
  if (shell) shell.dataset.quality = renderProfile.name;
  document.body.dataset.quality = renderProfile.name;
}

function scaledEffectCount(count, minimum = 0) {
  return Math.max(minimum, Math.round(count * renderProfile.particleScale));
}

function scaledBlur(value) {
  return value * renderProfile.shadowBlurScale;
}

function fitShellToCanvas() {
  refreshRenderProfile();
  if (!shell) return;
  const bodyStyle = getComputedStyle(document.body);
  const padX = parseFloat(bodyStyle.paddingLeft) + parseFloat(bodyStyle.paddingRight);
  const padY = parseFloat(bodyStyle.paddingTop) + parseFloat(bodyStyle.paddingBottom);
  const controlReserve = renderProfile.name === "lite" ? Math.min(92, Math.max(68, window.innerHeight * 0.1)) : 0;
  const maxW = Math.max(320, window.innerWidth - padX);
  const maxH = Math.max(240, window.innerHeight - padY - controlReserve);
  const ratio = W / H;
  const width = Math.min(W, maxW, maxH * ratio);
  shell.style.width = `${Math.floor(width)}px`;
  shell.style.height = `${Math.floor(width / ratio)}px`;
}

let state = "menu";
let previousPanel = "menu";
let last = performance.now();
let muteUntil = 0;
let specialWasPressed = false;
const audioState = {
  shoot: 0,
  hit: 0,
  explosion: 0,
  pickup: 0,
  boostUntil: 0,
  music: null,
  musicIndex: -1,
  musicStarted: false,
};

const game = {
  player: { x: FIELD_W / 2 - 30, y: H - 120, w: 60, h: 90, inv: 0 },
  lives: 3,
  score: 0,
  high: 0,
  boost: 100,
  boosting: false,
  strike: 100,
  rapid: 0,
  triple: 0,
  shield: false,
  bombs: 0,
  stage: 0,
  stageFlash: 0,
  nextBoss: 20000,
  boss: null,
  bossKills: 0,
  kills: 0,
  combo: 0,
  comboTimer: 0,
  entities: [],
  missiles: [],
  enemyShots: [],
  powerups: [],
  powerupMisses: 0,
  particles: [],
  playerTrail: [],
  trailTimer: 0,
  engineDustTimer: 0,
  packetTraceTimer: 0,
  damageFumeTimer: 0,
  threatGlintTimer: 0,
  shake: 0,
  flash: { t: 0, color: "rgba(101, 243, 255, ALPHA)" },
  hudPulse: 0,
  combatToast: null,
  achievementToast: null,
  stars: Array.from({ length: 150 }, () => ({ x: rnd(0, FIELD_W), y: rnd(0, H), s: rnd(0.8, 3.5), r: Math.random() < 0.8 ? 1 : 2 })),
  spawn: 0,
  asteroid: 80,
  formation: 240,
};

const VISUALS = Object.freeze({
  stageTint: ["#1cff8a", "#42b7ff", "#d85cff"],
  enemyGlow: ["#ff4747", "#41d8ff", "#9cff57"],
  powerupGlow: {
    rapid: "#65f3ff",
    shield: "#69ffb1",
    triple: "#ffd64d",
    bomb: "#ff8a3d",
    life: "#ff5d75",
    laser: "#ff3838",
    mega: "#bb72ff",
    score: "#ffd64d",
    coin: "#ffb83d",
    random: "#55cfff",
  },
});

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function addScreenKick(amount = 3) {
  game.shake = Math.min(18, Math.max(game.shake, amount));
}

function addFlash(color, amount = 0.5) {
  game.flash = { t: Math.min(1, Math.max(game.flash?.t ?? 0, amount)), color };
}

function addCombatToast(text, color = "#65f3ff", seconds = 1.2) {
  game.combatToast = { text, color, t: seconds, maxT: seconds };
}

function addAchievementToast(name, desc) {
  game.achievementToast = { name, desc, t: 3.8, maxT: 3.8 };
  game.hudPulse = Math.max(game.hudPulse, 0.85);
}

function triggerBossPhaseSurge(b) {
  if (!b || b.phaseSurged) return;
  b.phaseSurged = true;
  b.phaseSurge = 1.35;
  b.hitFlash = 1;
  addCombatToast(`${b.name} CORE BREACH`, "#ff8a3d", 1.45);
  addFlash("rgba(255, 138, 61, ALPHA)", 0.24);
  addScreenKick(7);
  emitDefeatBreakup(b.x + b.w / 2, b.y + b.h / 2, "#ff8a3d", 1.2);
}

const DEFAULT_SETTINGS = Object.freeze({
  version: 2,
  musicVolume: 20,
  sfxVolume: 10,
});

function readSettings() {
  const saved = readJson(STORAGE.settings, {});
  const migrateOldDefaults = !saved.version || saved.version < DEFAULT_SETTINGS.version;
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    version: DEFAULT_SETTINGS.version,
    musicVolume: migrateOldDefaults && saved.musicVolume === 50 ? DEFAULT_SETTINGS.musicVolume : (saved.musicVolume ?? DEFAULT_SETTINGS.musicVolume),
    sfxVolume: migrateOldDefaults && saved.sfxVolume === 70 ? DEFAULT_SETTINGS.sfxVolume : (saved.sfxVolume ?? DEFAULT_SETTINGS.sfxVolume),
  };
}

function saveSettings() {
  writeJson(STORAGE.settings, {
    version: DEFAULT_SETTINGS.version,
    musicVolume: Number(document.getElementById("musicVolume")?.value ?? DEFAULT_SETTINGS.musicVolume),
    sfxVolume: Number(document.getElementById("sfxVolume")?.value ?? DEFAULT_SETTINGS.sfxVolume),
  });
}

function sliderVolume(id, fallback) {
  const input = document.getElementById(id);
  return input ? Number(input.value) / 100 : fallback;
}

function playSound(key, scale = 1) {
  const source = loadedSounds.get(key);
  if (!source) return;
  const clip = source.cloneNode();
  clip.volume = clamp(sliderVolume("sfxVolume", DEFAULT_SETTINGS.sfxVolume / 100) * scale, 0, 1);
  clip.play().catch(() => {});
}

function playNext(prefix, count, prop, scale = 1) {
  const idx = audioState[prop] % count;
  audioState[prop] += 1;
  playSound(`${prefix}.${idx}`, scale);
}

function playBoostSound() {
  const now = performance.now();
  if (now < audioState.boostUntil) return;
  audioState.boostUntil = now + 650;
  playSound("boost", 0.55);
}

function updateMusicVolume() {
  if (audioState.music) audioState.music.volume = clamp(sliderVolume("musicVolume", DEFAULT_SETTINGS.musicVolume / 100), 0, 1);
}

function updateRangeFill(input) {
  if (!input) return;
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = Number(input.value || min);
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  input.style.setProperty("--fill", `${clamp(pct, 0, 100)}%`);
}

function updateAllRangeFills() {
  document.querySelectorAll('input[type="range"]').forEach(updateRangeFill);
}

function musicKeys() {
  return window.ASSET_MANIFEST?.audio?.music?.map((asset) => asset.key) ?? [];
}

function playMusicAt(index) {
  const keys = musicKeys();
  if (!keys.length) return;
  if (audioState.music) {
    audioState.music.pause();
    audioState.music.currentTime = 0;
  }
  audioState.musicIndex = ((index % keys.length) + keys.length) % keys.length;
  const music = loadedSounds.get(keys[audioState.musicIndex]);
  if (!music) return;
  audioState.music = music;
  music.loop = false;
  music.onended = () => playMusicAt(audioState.musicIndex + 1);
  updateMusicVolume();
  music.play().then(() => {
    audioState.musicStarted = true;
  }).catch(() => {});
}

function startMusic() {
  if (audioState.musicStarted) return;
  playMusicAt(audioState.musicIndex + 1);
}

function unlockAudio() {
  startMusic();
}

function initSettings() {
  const settings = readSettings();
  const music = document.getElementById("musicVolume");
  const sfx = document.getElementById("sfxVolume");
  if (music) music.value = String(settings.musicVolume);
  if (sfx) sfx.value = String(settings.sfxVolume);
  updateAllRangeFills();
  updateMusicVolume();
}

function exposeDebugState() {
  if (!["localhost", "127.0.0.1"].includes(location.hostname)) return;
  window.__bugStrikeDebug = {
    state: () => ({
      state,
      bombs: game.bombs,
      strike: game.strike,
      boosting: game.boosting,
      lives: game.lives,
      score: game.score,
      specialWasPressed,
      player: { x: game.player.x, y: game.player.y },
      pointer: { active: pointer.active, fire: pointer.fire },
      powerupMisses: game.powerupMisses,
      combatToast: game.combatToast,
      renderProfile,
    }),
  };
}

function scores() {
  return readJson(STORAGE.scores, []).sort((a, b) => b.score - a.score).slice(0, 10);
}

function unlocked() {
  return new Set(readJson(STORAGE.achievements, []));
}

function showPanel(id) {
  document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === id));
}

function syncStateShell(next = state) {
  if (shell) shell.dataset.state = next;
  document.body.dataset.state = next;
}

function setState(next) {
  state = next;
  syncStateShell(next);
  showPanel(next === "playing" ? "" : next);
  if (next === "leaderboard") renderLeaderboard();
}

function resetGame() {
  Object.assign(game, {
    lives: 3, score: 0, boost: 100, boosting: false, strike: 100, rapid: 0, triple: 0, shield: false, bombs: 0,
    stage: 0, stageFlash: 0, nextBoss: 20000, boss: null, bossKills: 0, kills: 0,
    combo: 0, comboTimer: 0, entities: [], missiles: [], enemyShots: [], powerups: [], powerupMisses: 0, particles: [], playerTrail: [], trailTimer: 0,
    engineDustTimer: 0, packetTraceTimer: 0, damageFumeTimer: 0, threatGlintTimer: 0,
    shake: 0, flash: { t: 0, color: "rgba(101, 243, 255, ALPHA)" }, hudPulse: 0, combatToast: null, achievementToast: null,
    spawn: 0, asteroid: 80, formation: 240,
  });
  game.player.x = FIELD_W / 2 - 30;
  game.player.y = H - 120;
  pointer.active = false;
  pointer.fire = false;
  pointer.x = game.player.x + game.player.w / 2;
  pointer.y = game.player.y + game.player.h / 2;
  game.player.inv = 90;
  game.high = scores()[0]?.score ?? 0;
  specialWasPressed = false;
  spawnFormation("arrow");
  game.entities.forEach((entity, idx) => { entity.y += 55 + idx * 8; });
  game.spawn = core.nextEnemySpawnDelay(game.stage);
}

function addScore(points) {
  game.score += core.scoreForKill(points, game.combo);
}

function addCombo() {
  game.combo += 1;
  game.comboTimer = 5;
  game.hudPulse = Math.min(1, game.hudPulse + 0.18);
  checkAchievements();
}

function checkAchievements() {
  const set = unlocked();
  let changed = false;
  for (const [id, name, desc] of ACHIEVEMENTS) {
    const ok = core.isAchievementReached({ id, kills: game.kills, bossKills: game.bossKills, combo: game.combo });
    if (ok && !set.has(id)) {
      set.add(id);
      changed = true;
      addAchievementToast(name, desc);
    }
  }
  if (changed) writeJson(STORAGE.achievements, [...set]);
}

function spawnEnemy(x = rnd(55, FIELD_W - 105), y = -80, type = "terminid") {
  const profile = core.enemyProfile(game.stage);
  game.entities.push({ kind: "enemy", type, x, y, w: 50, h: 70, hp: profile.hp, maxHp: profile.hp, vx: rnd(-profile.vxMax, profile.vxMax), vy: profile.vy, fire: rnd(50, 130), phase: rnd(0, Math.PI * 2), spawnAge: 0 });
}

function spawnAsteroid() {
  game.entities.push({ kind: "asteroid", x: rnd(35, FIELD_W - 105), y: -80, w: 70, h: 70, hp: 3, maxHp: 3, vx: rnd(-1.2, 1.2), vy: rnd(2.2, 4.4), spin: rnd(-4, 4), rot: rnd(0, 360), spawnAge: 0 });
}

function spawnFormation(forcedType = null) {
  const type = forcedType ?? ["line", "arrow", "diamond", "walls"][Math.floor(rnd(0, 4))];
  if (type === "line") for (let i = 0; i < 7; i++) spawnEnemy(95 + i * 95, -90);
  if (type === "arrow") for (let r = 0; r < 4; r++) for (let c = -r; c <= r; c += 2) spawnEnemy(FIELD_W / 2 - 25 + c * 42, -90 - r * 58);
  if (type === "diamond") [[0,0],[-1,1],[1,1],[-2,2],[0,2],[2,2],[-1,3],[1,3]].forEach(([c,r]) => spawnEnemy(FIELD_W / 2 - 25 + c * 56, -90 - r * 52));
  if (type === "walls") for (let i = 0; i < 6; i++) { spawnEnemy(70, -90 - i * 75); spawnEnemy(FIELD_W - 120, -90 - i * 75); }
}

function spawnBoss(forcedIndex = null) {
  const names = ["ADWARE", "TROJAN", "WORM", "ROOTKIT"];
  const idx = forcedIndex === null ? game.bossKills % names.length : clamp(forcedIndex, 0, names.length - 1);
  const profile = core.bossProfile({ stage: game.stage, bossIndex: idx, bossKills: game.bossKills });
  game.boss = { name: names[idx], idx, x: FIELD_W / 2 - 70, y: -220, w: 140, h: 210, hp: profile.hp, maxHp: profile.hp, vx: 2.2, fire: profile.fireDelay, fireDelay: profile.fireDelay, anchorY: profile.anchorY, yDrift: profile.yDrift, phase: 1, motion: rnd(0, Math.PI * 2), volley: 0, spawnAge: 0, phaseSurge: 0, phaseSurged: false };
  addCombatToast(`${names[idx]} DETECTED`, "#ff4747", 1.6);
  addFlash("rgba(255, 71, 71, ALPHA)", 0.32);
  addScreenKick(6);
}

function spawnPowerup(x, y, forced = false) {
  if (!core.shouldDropPowerup({ forced, roll: Math.random(), combo: game.combo, misses: game.powerupMisses })) {
    game.powerupMisses += 1;
    return;
  }
  game.powerupMisses = 0;
  game.powerups.push({ type: core.choosePowerupType({ roll: Math.random(), lives: game.lives, bombs: game.bombs }), x, y, w: 35, h: 35, phase: rnd(0, Math.PI * 2) });
}

function shoot() {
  const rate = game.rapid > 0 ? core.TUNING.rapidFireRate : core.TUNING.baseFireRate;
  if (performance.now() < muteUntil) return;
  muteUntil = performance.now() + rate * 1000;
  const cx = game.player.x + game.player.w / 2;
  const shots = game.triple > 0 ? [-6, 0, 6] : [0];
  shots.forEach((vx) => game.missiles.push({ x: cx - 5, y: game.player.y - 18, w: 10, h: 30, vx, vy: -14, age: 0 }));
  emitMuzzleFlash(cx, game.player.y - 12, game.triple > 0 ? 1.2 : 1);
  playNext("player.shoot", 2, "shoot", 0.55);
}

function bugStrike() {
  const result = core.applySpecialCharge({ strike: game.strike, bombs: game.bombs });
  if (!result.canFire) return;
  game.strike = result.strike;
  game.bombs = result.bombs;
  for (const e of game.entities) e.hp -= 6;
  if (game.boss) game.boss.hp -= 600;
  playSound("special.bugStrike", 0.85);
  burst(FIELD_W / 2, FIELD_H / 2, "#9cff57", 80);
  addFlash("rgba(156, 255, 87, ALPHA)", 0.55);
  addScreenKick(14);
}

function spawnBossVolley(b) {
  b.volley = (b.volley ?? 0) + 1;
  const cx = b.x + b.w / 2;
  const y = b.y + b.h - 20;
  const targetX = game.player.x + game.player.w / 2;
  const aim = clamp((targetX - cx) / 150, -1.8, 1.8);
  const shot = (x, vx, vy, frame = 0, w = 15, h = 40, extra = {}) => game.enemyShots.push({
    x,
    y,
    w,
    h,
    vx,
    vy,
    frame,
    age: 0,
    hp: extra.hp ?? 3,
    homing: Boolean(extra.homing),
    turnRate: extra.turnRate ?? 0.055,
    maxVx: extra.maxVx ?? 1.25,
  });

  if (b.idx === 0) {
    [-80, -40, 0, 40, 80].forEach((off, idx) => shot(cx + off, off / 70, 4.6, idx % 3, 15, 40, { homing: idx === 2, turnRate: 0.04, maxVx: 0.9 }));
    return;
  }
  if (b.idx === 1) {
    [-0.45, 0, 0.45].forEach((spread, idx) => shot(cx - 7, aim + spread, 5.2, idx, 15, 40, { homing: idx === 1, turnRate: 0.065, maxVx: 1.35 }));
    return;
  }
  if (b.idx === 2) {
    [-95, -63, -31, 1, 33, 65, 97].forEach((off, idx) => {
      const sweep = Math.sin((b.volley + idx) * 0.7) * 0.9;
      shot(cx + off, sweep, 4.2 + (idx % 2) * 0.6, idx % 3, 15, 40, { homing: idx === 1 || idx === 5, turnRate: 0.045, maxVx: 1.1 });
    });
    return;
  }
  [-96, -48, 0, 48, 96].forEach((off, idx) => shot(cx + off, Math.sign(off) * 0.28, 4.9, idx % 3, off === 0 ? 21 : 15, off === 0 ? 56 : 40, { hp: off === 0 ? 4 : 3, homing: off === 0, turnRate: 0.045, maxVx: 1.0 }));
  if (b.phase === 2) [-150, 150].forEach((off, idx) => shot(cx + off, -Math.sign(off) * 1.15, 3.9, idx, 15, 40, { homing: true, turnRate: 0.05, maxVx: 1.2 }));
}

function damagePlayer() {
  const result = core.applyPlayerDamage({ lives: game.lives, shield: game.shield, inv: game.player.inv });
  if (result.inv === game.player.inv && result.lives === game.lives && result.shield === game.shield) return;
  game.lives = result.lives;
  game.shield = result.shield;
  game.player.inv = result.inv;
  playNext("player.hit", 2, "hit", result.absorbed ? 0.45 : 0.8);
  burst(game.player.x + 30, game.player.y + 45, result.absorbed ? "#65f3ff" : "#ff4747", result.absorbed ? 18 : 30);
  addFlash(result.absorbed ? "rgba(101, 243, 255, ALPHA)" : "rgba(255, 71, 71, ALPHA)", result.absorbed ? 0.25 : 0.5);
  addScreenKick(result.absorbed ? 4 : 9);
  if (result.gameOver) endGame();
}

function endGame() {
  const list = scores();
  if (game.score > 0 && (list.length < 10 || game.score > list.at(-1).score)) {
    document.getElementById("finalScore").textContent = `Score: ${game.score}`;
    document.getElementById("initialsInput").value = "";
    setState("initials");
  } else {
    document.getElementById("gameOverScore").textContent = `Final Score: ${game.score}`;
    setState("gameOver");
  }
}

function burst(x, y, color, count = 14) {
  count = scaledEffectCount(count);
  if (count <= 0) return;
  if (count >= 10) {
    game.particles.push({ kind: "ring", x, y, vx: 0, vy: 0, t: 0.45, maxT: 0.45, color, radius: rnd(10, 18), size: rnd(38, 62) });
  }
  for (let i = 0; i < count; i++) {
    const angle = rnd(0, Math.PI * 2);
    const speed = rnd(1.2, count > 30 ? 8 : 5.5);
    const kind = i % 4 === 0 ? "shard" : "spark";
    const lifetime = rnd(0.3, count > 30 ? 1.05 : 0.72);
    game.particles.push({
      kind,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      t: lifetime,
      maxT: lifetime,
      color,
      size: kind === "shard" ? rnd(5, 12) : rnd(2, 5),
      rot: rnd(0, Math.PI * 2),
      spin: rnd(-0.25, 0.25),
    });
  }
}

function emitDefeatBreakup(x, y, color, intensity = 1) {
  const ringLife = 0.34 + intensity * 0.08;
  if (renderProfile.particleScale > 0.5) game.particles.push({ kind: "ring", x, y, vx: 0, vy: 0, t: ringLife, maxT: ringLife, color, radius: 8, size: 48 + intensity * 32 });
  const shardCount = scaledEffectCount(7 + intensity * 7, 2);
  const glyphs = ["0", "1", "ERR", "BUG", "//"];
  for (let i = 0; i < shardCount; i++) {
    const angle = rnd(0, Math.PI * 2);
    const speed = rnd(1.4, 3.8 + intensity * 2.6);
    const isGlyph = i % 3 === 0;
    const lifetime = rnd(0.34, 0.7 + intensity * 0.16);
    game.particles.push({
      kind: isGlyph ? "codeGlyph" : "dataShard",
      text: glyphs[Math.floor(rnd(0, glyphs.length))],
      x: x + rnd(-4, 4) * intensity,
      y: y + rnd(-4, 4) * intensity,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - rnd(0.2, 0.75),
      t: lifetime,
      maxT: lifetime,
      color,
      size: isGlyph ? rnd(8, 12 + intensity * 2) : rnd(5, 12 + intensity * 5),
      rot: rnd(0, Math.PI * 2),
      spin: rnd(-0.28, 0.28),
    });
  }
}

function emitPickupFeedback(p) {
  const color = VISUALS.powerupGlow[p.type] ?? "#65f3ff";
  const cx = p.x + p.w / 2;
  const cy = p.y + p.h / 2;
  game.particles.push({ kind: "ring", x: cx, y: cy, vx: 0, vy: 0, t: 0.52, maxT: 0.52, color, radius: 14, size: 68 });
  game.particles.push({
    kind: "text",
    text: `+${p.type.toUpperCase()}`,
    x: cx,
    y: cy - 14,
    vx: 0,
    vy: -0.34,
    t: 0.9,
    maxT: 0.9,
    color,
    fontSize: 16,
    rise: 18,
  });
  burst(cx, cy, color, 8);
}

function emitShotDisruptFeedback(s, color, destroyed) {
  const cx = s.x + s.w / 2;
  const cy = s.y + s.h / 2;
  game.particles.push({
    kind: "ring",
    x: cx,
    y: cy,
    vx: 0,
    vy: 0,
    t: destroyed ? 0.3 : 0.2,
    maxT: destroyed ? 0.3 : 0.2,
    color,
    radius: destroyed ? 10 : 5,
    size: destroyed ? 34 : 22,
  });
  burst(cx, cy, color, destroyed ? 8 : 4);
}

function emitMuzzleFlash(x, y, intensity = 1) {
  game.particles.push({
    kind: "muzzleFlash",
    x,
    y,
    vx: 0,
    vy: -0.35,
    t: 0.12,
    maxT: 0.12,
    color: "#9cff57",
    size: 18 * intensity,
  });
  for (let i = 0; i < scaledEffectCount(Math.ceil(3 * intensity), 1); i++) {
    game.particles.push({
      kind: "packetTrace",
      x: x + rnd(-10, 10),
      y: y + rnd(-4, 10),
      vx: rnd(-0.2, 0.2),
      vy: rnd(0.2, 0.7),
      t: rnd(0.08, 0.16),
      maxT: 0.16,
      color: i % 2 ? "#65f3ff" : "#9cff57",
      size: rnd(2, 4),
    });
  }
}

function emitImpactFeedback(x, y, color, strength = 1) {
  const count = scaledEffectCount(3 + strength * 5, 1);
  game.particles.push({
    kind: "impactCore",
    x,
    y,
    vx: 0,
    vy: 0,
    t: 0.18 + strength * 0.04,
    maxT: 0.18 + strength * 0.04,
    color,
    radius: 4 + strength * 4,
    size: 18 + strength * 16,
  });
  for (let i = 0; i < count; i++) {
    const angle = rnd(0, Math.PI * 2);
    const speed = rnd(0.55, 2.2 + strength * 1.2);
    game.particles.push({
      kind: "impactBit",
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      t: rnd(0.16, 0.34 + strength * 0.08),
      maxT: 0.42,
      color,
      size: rnd(2.5, 5.5 + strength * 2),
      rot: rnd(0, Math.PI * 2),
      spin: rnd(-0.2, 0.2),
    });
  }
}

function emitEngineDust(dt, boosting) {
  game.engineDustTimer -= dt;
  if (game.engineDustTimer > 0) return;
  game.engineDustTimer = (boosting ? 0.018 : 0.045) / Math.max(0.55, renderProfile.particleScale);
  const p = game.player;
  const jets = [
    [p.x + 21, p.y + p.h - 2],
    [p.x + p.w - 21, p.y + p.h - 2],
    [p.x + p.w / 2, p.y + p.h + 1],
  ];
  const count = scaledEffectCount(boosting ? 3 : 2, 1);
  for (let i = 0; i < count; i++) {
    const [x, y] = jets[i % jets.length];
    const lifetime = rnd(0.22, boosting ? 0.48 : 0.34);
    game.particles.push({
      kind: "engine",
      x: x + rnd(-3, 3),
      y: y + rnd(0, 5),
      vx: rnd(-0.22, 0.22),
      vy: rnd(0.55, boosting ? 1.65 : 1.15),
      t: lifetime,
      maxT: lifetime,
      color: i === 2 ? "#65f3ff" : "#9cff57",
      size: rnd(2, boosting ? 5 : 3.6),
    });
  }
}

function emitDamageFumes(dt) {
  const danger = game.lives <= 1 || game.player.inv > 0;
  if (!danger) {
    game.damageFumeTimer = 0;
    return;
  }

  game.damageFumeTimer -= dt;
  if (game.damageFumeTimer > 0) return;
  game.damageFumeTimer = game.lives <= 1 ? 0.06 : 0.11;

  const p = game.player;
  const vents = [
    [p.x + p.w * 0.24, p.y + p.h * 0.34],
    [p.x + p.w * 0.76, p.y + p.h * 0.48],
    [p.x + p.w * 0.52, p.y + p.h * 0.18],
  ];
  const [x, y] = vents[Math.floor(rnd(0, vents.length))];
  const lifetime = rnd(0.35, game.lives <= 1 ? 0.9 : 0.62);
  game.particles.push({
    kind: "damageFume",
    x: x + rnd(-4, 4),
    y: y + rnd(-3, 3),
    vx: rnd(-0.22, 0.22),
    vy: rnd(-0.72, -0.22),
    t: lifetime,
    maxT: lifetime,
    color: Math.random() > 0.35 ? "#ff5d5d" : "#9aa3ad",
    size: rnd(4, game.lives <= 1 ? 9 : 6),
  });
}

function emitThreatGlints(dt) {
  if (renderProfile.name === "lite") return;
  const pressure = Math.min(1, (game.enemyShots.length / 18) + (game.entities.length / 34) + (game.boss ? 0.75 : 0));
  if (pressure <= 0.16) {
    game.threatGlintTimer = 0;
    return;
  }

  game.threatGlintTimer -= dt;
  if (game.threatGlintTimer > 0) return;
  game.threatGlintTimer = rnd(0.035, 0.13) / (0.65 + pressure);

  const sources = [
    ...game.enemyShots.slice(-18).map((s) => ({ x: s.x, y: s.y, w: s.w, h: s.h, color: s.homing ? "#ffd64d" : "#ff5d5d" })),
    ...game.entities.slice(-16).map((e) => ({ x: e.x, y: e.y, w: e.w, h: e.h, color: e.kind === "asteroid" ? "#a8987b" : VISUALS.enemyGlow[game.stage % VISUALS.enemyGlow.length] })),
  ];
  if (game.boss) sources.push({ x: game.boss.x, y: game.boss.y, w: game.boss.w, h: game.boss.h, color: "#ff4747" });
  if (sources.length === 0) return;

  const src = sources[Math.floor(rnd(0, sources.length))];
  const lifetime = rnd(0.18, 0.42);
  game.particles.push({
    kind: "threatGlint",
    x: src.x + rnd(src.w * 0.1, src.w * 0.9),
    y: src.y + rnd(src.h * 0.12, src.h * 0.88),
    vx: rnd(-0.18, 0.18),
    vy: rnd(-0.25, 0.16),
    t: lifetime,
    maxT: lifetime,
    color: src.color,
    size: rnd(5, game.boss ? 15 : 10),
    spin: rnd(-0.045, 0.045),
  });
}

function emitPacketTrace(dt) {
  game.packetTraceTimer -= dt;
  if (game.packetTraceTimer > 0 || game.missiles.length === 0) return;
  game.packetTraceTimer = (game.rapid > 0 ? 0.026 : 0.046) / Math.max(0.55, renderProfile.particleScale);
  for (const m of game.missiles.slice(0, renderProfile.name === "lite" ? 5 : 12)) {
    if (Math.random() > 0.68) continue;
    const lifetime = rnd(0.16, 0.28);
    game.particles.push({
      kind: "packetTrace",
      x: m.x + m.w / 2 + rnd(-4, 4),
      y: m.y + m.h + rnd(-2, 8),
      vx: rnd(-0.08, 0.08),
      vy: rnd(0.5, 1.2),
      t: lifetime,
      maxT: lifetime,
      color: Math.random() > 0.55 ? "#9cff57" : "#65f3ff",
      size: rnd(1.6, 3.4),
    });
  }
}

function addPlayerTrail(prevX, prevY, boosting, dt) {
  const speed = Math.hypot(game.player.x - prevX, game.player.y - prevY);
  game.trailTimer -= dt;
  if (speed < 0.35 && !boosting) return;
  if (game.trailTimer > 0) return;
  game.trailTimer = (boosting ? 0.024 : 0.055) / Math.max(0.55, renderProfile.particleScale);
  game.playerTrail.push({
    x: prevX,
    y: prevY,
    w: game.player.w,
    h: game.player.h,
    key: core.playerSpriteKey({ boosting, lives: game.lives }),
    t: boosting ? 0.2 : 0.16,
    maxT: boosting ? 0.2 : 0.16,
    boosting,
  });
  if (game.playerTrail.length > renderProfile.trailCap) game.playerTrail.splice(0, game.playerTrail.length - renderProfile.trailCap);
}

function update(dt) {
  if (state !== "playing") {
    game.boosting = false;
    return;
  }
  const gp = navigator.getGamepads?.()[0];
  const keyboard = core.keyboardControlState(keys);
  let mx = keyboard.x;
  let my = keyboard.y;
  if (gp) {
    mx += Math.abs(gp.axes[0]) > 0.2 ? gp.axes[0] : 0;
    my += Math.abs(gp.axes[1]) > 0.2 ? gp.axes[1] : 0;
    mx += (gp.buttons[15]?.pressed ? 1 : 0) - (gp.buttons[14]?.pressed ? 1 : 0);
    my += (gp.buttons[13]?.pressed ? 1 : 0) - (gp.buttons[12]?.pressed ? 1 : 0);
  }
  const gamepadFirePressed = Boolean(gp?.buttons[7]?.pressed || gp?.buttons[5]?.pressed || gp?.buttons[2]?.pressed);
  const gamepadBoostPressed = Boolean(gp?.buttons[0]?.pressed || gp?.buttons[4]?.pressed || gp?.buttons[6]?.pressed);
  const gamepadSpecialPressed = Boolean(gp?.buttons[1]?.pressed || gp?.buttons[3]?.pressed);
  const boosting = (keyboard.boost || gamepadBoostPressed) && game.boost > 0;
  game.boosting = boosting;
  const prevPlayerX = game.player.x;
  const prevPlayerY = game.player.y;
  if (pointer.active) {
    game.player.x = clamp(pointer.x - game.player.w / 2, 0, FIELD_W - game.player.w);
    game.player.y = clamp(pointer.y - game.player.h / 2, 120, H - game.player.h);
  } else {
    const delta = core.playerDelta({ x: mx, y: my, boosting, dt });
    game.player.x = clamp(game.player.x + delta.dx, 0, FIELD_W - game.player.w);
    game.player.y = clamp(game.player.y + delta.dy, 120, H - game.player.h);
  }
  addPlayerTrail(prevPlayerX, prevPlayerY, boosting, dt);
  emitEngineDust(dt, boosting);
  emitDamageFumes(dt);
  emitThreatGlints(dt);
  game.boost = clamp(game.boost + (boosting ? -core.TUNING.boostDrain : core.TUNING.boostRecharge) * dt, 0, 100);
  game.strike = clamp(game.strike + core.TUNING.strikeRecharge * dt, 0, 100);
  if (boosting) playBoostSound();
  if (keyboard.fire || pointer.fire || gamepadFirePressed) shoot();
  if (core.isNewPress(specialWasPressed, gamepadSpecialPressed)) bugStrike();
  specialWasPressed = gamepadSpecialPressed;

  game.spawn -= dt; game.asteroid -= dt; game.formation -= dt;
  if (game.spawn <= 0) { spawnEnemy(); game.spawn = core.nextEnemySpawnDelay(game.stage); }
  if (game.asteroid <= 0) { spawnAsteroid(); game.asteroid = rnd(core.TUNING.asteroidMin, core.TUNING.asteroidMax); }
  if (game.formation <= 0) { spawnFormation(); game.formation = rnd(core.TUNING.formationMin, core.TUNING.formationMax); }
  if (!game.boss && game.score >= game.nextBoss) spawnBoss();
  if (Math.floor(game.score / 15000) > game.stage) {
    game.stage += 1;
    game.stageFlash = 1;
    addCombatToast(`STAGE ${game.stage}`, stageColor(1), 1.1);
  }

  game.rapid = Math.max(0, game.rapid - dt);
  game.triple = Math.max(0, game.triple - dt);
  game.comboTimer -= dt;
  if (game.comboTimer <= 0) game.combo = 0;
  game.player.inv = Math.max(0, game.player.inv - dt * 60);
  game.stageFlash = Math.max(0, game.stageFlash - dt);
  game.shake = Math.max(0, game.shake - dt * 28);
  game.hudPulse = Math.max(0, game.hudPulse - dt * 2.2);
  if (game.combatToast) {
    game.combatToast.t -= dt;
    if (game.combatToast.t <= 0) game.combatToast = null;
  }
  if (game.achievementToast) {
    game.achievementToast.t -= dt;
    if (game.achievementToast.t <= 0) game.achievementToast = null;
  }
  if (game.flash) game.flash.t = Math.max(0, game.flash.t - dt * 2.8);

  for (const s of game.stars) { s.y += s.s * 60 * dt; if (s.y > H) { s.y = 0; s.x = rnd(0, FIELD_W); } }
  for (const m of game.missiles) { m.x += m.vx * 60 * dt; m.y += m.vy * 60 * dt; m.age = (m.age ?? 0) + dt; }
  emitPacketTrace(dt);
  for (const p of game.powerups) {
    if (p.static) continue;
    p.y += 145 * dt;
    p.x += Math.sin(performance.now() / 220 + p.phase) * 80 * dt;
  }
  for (const e of game.entities) {
    e.spawnAge = (e.spawnAge ?? 0) + dt;
    e.x += e.vx * 60 * dt; e.y += e.vy * 60 * dt; e.rot = (e.rot ?? 0) + (e.spin ?? 0);
    if (e.kind === "enemy") {
      e.fire -= 60 * dt;
      if (e.fire <= 0) {
        const homing = Math.random() < 0.22;
        game.enemyShots.push({ x: e.x + e.w / 2 - 7, y: e.y + e.h, w: 15, h: 40, vx: 0, vy: homing ? 4.7 : 5.5, frame: Math.floor(rnd(0, 3)), age: 0, hp: 3, homing, turnRate: 0.04, maxVx: 0.95 });
        e.fire = rnd(80, 170);
      }
    }
  }
  if (game.boss) {
    const b = game.boss;
    b.spawnAge = (b.spawnAge ?? 0) + dt;
    b.phaseSurge = Math.max(0, (b.phaseSurge ?? 0) - dt);
    b.motion = (b.motion ?? 0) + dt * (0.95 + b.idx * 0.08);
    const targetY = b.anchorY + Math.sin(b.motion) * b.yDrift;
    b.y += clamp(targetY - b.y, -150 * dt, 150 * dt);
    b.x += b.vx * 60 * dt;
    if (b.x < 35 || b.x + b.w > FIELD_W - 35) b.vx *= -1;
    const breached = b.hp < b.maxHp * 0.5;
    b.phase = breached ? 2 : 1;
    if (breached) triggerBossPhaseSurge(b);
    b.fire -= 60 * dt;
    if (b.fire <= 0) {
      spawnBossVolley(b);
      b.fire = b.fireDelay;
    }
  }
  const targetX = game.player.x + game.player.w / 2;
  for (const s of game.enemyShots) {
    if (s.homing) s.vx = core.homingShotVx({ x: s.x + s.w / 2, targetX, vx: s.vx ?? 0, turnRate: s.turnRate ?? 0.055, maxVx: s.maxVx ?? 1.25 });
    s.x += (s.vx ?? 0) * 60 * dt;
    s.y += s.vy * 60 * dt;
    s.age = (s.age ?? 0) + dt;
    s.hitFlash = Math.max(0, (s.hitFlash ?? 0) - dt * 7);
  }

  collide();
  game.missiles = game.missiles.filter((m) => m.y > -60 && m.x > -60 && m.x < FIELD_W + 60);
  game.enemyShots = game.enemyShots.filter((s) => s.y < H + 70 && s.hp > 0);
  game.entities = game.entities.filter((e) => e.y < H + 120 && e.hp > 0);
  game.powerups = game.powerups.filter((p) => p.static || p.y < H + 60);
  for (const p of game.particles) {
    p.t -= dt;
    p.x += (p.vx ?? 0) * 60 * dt;
    p.y += (p.vy ?? 0) * 60 * dt;
    p.rot = (p.rot ?? 0) + (p.spin ?? 0) * 60 * dt;
    if (p.kind === "ring") p.radius = (p.radius ?? 0) + (p.size ?? 40) * dt;
  }
  for (const e of game.entities) e.hitFlash = Math.max(0, (e.hitFlash ?? 0) - dt * 6);
  if (game.boss) game.boss.hitFlash = Math.max(0, (game.boss.hitFlash ?? 0) - dt * 5);
  for (const t of game.playerTrail) t.t -= dt;
  game.particles = game.particles.filter((p) => p.t > 0);
  if (game.particles.length > renderProfile.particleCap) game.particles.splice(0, game.particles.length - renderProfile.particleCap);
  game.playerTrail = game.playerTrail.filter((trail) => trail.t > 0);
}

function collide() {
  for (const m of game.missiles) {
    let clearedShots = 0;
    for (const s of game.enemyShots) {
      if (s.hp <= 0 || !core.packetDisruptsShot(m, s)) continue;
      const result = core.damageHostileShot({ hp: s.hp, damage: 1 });
      s.hp = result.hp;
      s.hitFlash = result.destroyed ? 0 : 1;
      emitShotDisruptFeedback(s, s.homing ? "#ffdf47" : "#ff6868", result.destroyed);
      emitImpactFeedback(m.x + m.w / 2, Math.max(m.y, s.y), s.homing ? "#ffdf47" : "#ff6868", result.destroyed ? 1.2 : 0.7);
      if (result.destroyed) {
        s.y = H + 999;
        addScore(s.homing ? 35 : 20);
        clearedShots += 1;
      }
    }
    if (clearedShots > 0) {
      m.age = (m.age ?? 0) + clearedShots * 0.015;
    }
    for (const e of game.entities) {
      if (hit(m, e)) {
        m.y = -999; e.hp -= 1;
        e.hitFlash = 1;
        emitImpactFeedback(m.x + m.w / 2, Math.max(e.y + 8, m.y + 10), e.kind === "asteroid" ? "#fff1bf" : "#65f3ff", e.kind === "asteroid" ? 0.9 : 1);
        if (e.hp <= 0) {
          const defeatColor = e.kind === "asteroid" ? "#a8987b" : "#ff8a3d";
          burst(e.x + e.w / 2, e.y + e.h / 2, defeatColor);
          emitDefeatBreakup(e.x + e.w / 2, e.y + e.h / 2, defeatColor, e.kind === "asteroid" ? 0.7 : 1);
          addScreenKick(e.kind === "asteroid" ? 2.2 : 2.8);
          playNext("explosion", 2, "explosion", e.kind === "asteroid" ? 0.45 : 0.65);
          addScore(e.kind === "asteroid" ? 140 : 220); game.kills += 1; addCombo(); spawnPowerup(e.x + e.w / 2, e.y + e.h / 2); checkAchievements();
        }
      }
    }
    if (game.boss && hit(m, game.boss)) {
      m.y = -999; game.boss.hp -= 1;
      game.boss.hitFlash = 1;
      emitImpactFeedback(m.x + m.w / 2, Math.max(game.boss.y + 18, m.y + 10), "#ffef7d", 1.45);
      if (game.boss.hp <= 0) {
        burst(game.boss.x + 70, game.boss.y + 105, "#ffef7d", 80);
        emitDefeatBreakup(game.boss.x + game.boss.w / 2, game.boss.y + game.boss.h / 2, "#ffef7d", 2.2);
        addFlash("rgba(255, 214, 77, ALPHA)", 0.65);
        addScreenKick(16);
        playNext("explosion", 2, "explosion", 0.9);
        for (let i = 0; i < 5; i++) spawnPowerup(rnd(game.boss.x, game.boss.x + game.boss.w), rnd(game.boss.y, game.boss.y + game.boss.h), true);
        addScore(2000); game.bossKills += 1; game.combo += 15; game.comboTimer = 5; game.boss = null; game.nextBoss = game.score + 35000 + game.bossKills * 15000; checkAchievements();
      }
    }
  }
  for (const e of game.entities) if (hit(game.player, e)) { e.hp = 0; damagePlayer(); }
  for (const s of game.enemyShots) if (hit(game.player, s)) { s.y = H + 999; damagePlayer(); }
  if (game.boss && hit(game.player, game.boss)) damagePlayer();
  for (const p of game.powerups) {
    if (!hit(game.player, p)) continue;
    emitPickupFeedback(p);
    p.y = H + 999; addScore(100);
    playNext("pickup", 6, "pickup", 0.7);
    addFlash("rgba(101, 243, 255, ALPHA)", 0.18);
    addCombatToast(`${p.type.toUpperCase()} PATCH`, VISUALS.powerupGlow[p.type] ?? "#65f3ff", 1.05);
    game.hudPulse = 0.75;
    if (p.type === "rapid") game.rapid = 10;
    if (p.type === "triple") game.triple = 6;
    if (p.type === "shield") game.shield = true;
    if (p.type === "bomb") game.bombs = core.addBombCharge(game.bombs);
    if (p.type === "life") game.lives = core.applyLifePickup(game.lives);
  }
}

function stageColor(alpha = 1) {
  const hex = VISUALS.stageTint[game.stage % VISUALS.stageTint.length];
  return rgbaFromHex(hex, alpha);
}

function rgbaFromHex(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawSpriteLit(img, x, y, w, h, options = {}) {
  const {
    glow = "#65f3ff",
    glowAlpha = 0.28,
    glowBlur = 18,
    scale = 1,
    rotation = 0,
    bob = 0,
    alpha = 1,
    flashAlpha = 0,
    flashColor = "#ffffff",
  } = options;
  const cx = x + w / 2;
  const cy = y + h / 2 + bob;
  const profileGlowAlpha = glowAlpha * renderProfile.glowAlphaScale;
  if (glow && profileGlowAlpha > 0.01) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = profileGlowAlpha;
    ctx.shadowColor = glow;
    ctx.shadowBlur = scaledBlur(glowBlur);
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
  if (flashAlpha > 0 && renderProfile.name !== "lite") {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = Math.min(0.85, flashAlpha);
    ctx.shadowColor = flashColor;
    ctx.shadowBlur = 22;
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(scale * 1.025, scale * 1.025);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }
}

function drawBloomOrb(x, y, radius, color, alpha = 0.4) {
  if (renderProfile.name === "lite") return;
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
  glow.addColorStop(0, color.replace("ALPHA", String(alpha)));
  glow.addColorStop(0.5, color.replace("ALPHA", String(alpha * 0.32)));
  glow.addColorStop(1, color.replace("ALPHA", "0"));
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawLightPool(x, y, radius, color, alpha) {
  const pool = ctx.createRadialGradient(x, y, 0, x, y, radius);
  pool.addColorStop(0, rgbaFromHex(color, alpha));
  pool.addColorStop(0.42, rgbaFromHex(color, alpha * 0.26));
  pool.addColorStop(1, rgbaFromHex(color, 0));
  ctx.fillStyle = pool;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawSceneLightWash(t) {
  if (!renderProfile.lightWash) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const stage = VISUALS.stageTint[game.stage % VISUALS.stageTint.length];
  const playerPulse = 0.72 + Math.sin(t * 4.2) * 0.12;
  drawLightPool(
    game.player.x + game.player.w / 2,
    game.player.y + game.player.h * 0.62,
    game.shield ? 165 : (game.boosting ? 128 : 92),
    game.shield ? "#69ffb1" : "#65f3ff",
    (game.shield ? 0.115 : game.boosting ? 0.09 : 0.045) * playerPulse
  );

  if (game.boss) {
    const bossColor = ["#ff4747", "#bb72ff", "#9cff57", "#42b7ff"][game.boss.idx] ?? "#ff4747";
    const hurt = game.boss.phase === 2;
    drawLightPool(
      game.boss.x + game.boss.w / 2,
      game.boss.y + game.boss.h / 2,
      hurt ? 250 : 210,
      hurt ? "#ff5d5d" : bossColor,
      hurt ? 0.12 : 0.075
    );
  }

  const enemyColor = VISUALS.enemyGlow[game.stage % VISUALS.enemyGlow.length];
  for (const e of game.entities.slice(-12)) {
    const color = e.kind === "asteroid" ? "#a8987b" : (e.hp < e.maxHp ? "#ff5d5d" : enemyColor);
    drawLightPool(e.x + e.w / 2, e.y + e.h / 2, e.kind === "asteroid" ? 58 : 72, color, e.kind === "asteroid" ? 0.022 : 0.038);
  }

  for (const s of game.enemyShots.slice(-14)) {
    drawLightPool(s.x + s.w / 2, s.y + s.h / 2, s.homing ? 54 : 42, s.homing ? "#ffd64d" : "#ff4747", s.homing ? 0.052 : 0.034);
  }

  for (const m of game.missiles.slice(-14)) {
    drawLightPool(m.x + m.w / 2, m.y + m.h / 2, 44, "#9cff57", 0.036);
  }

  for (const p of game.powerups.slice(-8)) {
    const color = VISUALS.powerupGlow[p.type] ?? stage;
    drawLightPool(p.x + p.w / 2, p.y + p.h / 2, 78, color, 0.064);
  }
  ctx.restore();
}

function drawSpriteSignalLights(x, y, w, h, color, t, intensity = 1, damaged = false) {
  const pulse = 0.65 + Math.sin(t * 8 + x * 0.02) * 0.22;
  const points = [
    [0.31, 0.3, 2.3],
    [0.69, 0.3, 2.3],
    [0.25, 0.78, 1.8],
    [0.75, 0.78, 1.8],
  ];
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.shadowColor = damaged ? "#ff5d5d" : color;
  ctx.shadowBlur = damaged ? 15 : 10;
  for (const [px, py, r] of points) {
    ctx.globalAlpha = (damaged ? 0.54 : 0.34) * intensity * pulse;
    ctx.fillStyle = damaged ? "#ff5d5d" : color;
    ctx.beginPath();
    ctx.arc(x + w * px, y + h * py, r * intensity, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = (damaged ? 0.32 : 0.18) * intensity;
  ctx.strokeStyle = damaged ? "#ff5d5d" : color;
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 7]);
  ctx.lineDashOffset = -t * 18;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h * 0.52, w * 0.42, h * 0.35, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawSpriteScanSweep(x, y, w, h, color, t, intensity = 1) {
  const sweep = ((t * 0.9 + x * 0.003 + y * 0.001) % 1);
  const lineY = y + h * (0.12 + sweep * 0.76);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.beginPath();
  ctx.rect(x - 3, y - 3, w + 6, h + 6);
  ctx.clip();
  ctx.shadowColor = color;
  ctx.shadowBlur = 10 * intensity;
  ctx.strokeStyle = rgbaFromHex(color, 0.18 * intensity);
  ctx.lineWidth = Math.max(1, 1.4 * intensity);
  ctx.beginPath();
  ctx.moveTo(x + w * 0.16, lineY - 7);
  ctx.lineTo(x + w * 0.84, lineY + 7);
  ctx.stroke();

  const glint = ctx.createLinearGradient(x, lineY - 10, x + w, lineY + 10);
  glint.addColorStop(0, rgbaFromHex(color, 0));
  glint.addColorStop(0.46, rgbaFromHex(color, 0.1 * intensity));
  glint.addColorStop(0.52, "rgba(255,255,255,0.18)");
  glint.addColorStop(1, rgbaFromHex(color, 0));
  ctx.fillStyle = glint;
  ctx.globalAlpha = 0.7;
  ctx.fillRect(x, lineY - 8, w, 16);
  ctx.restore();
}

function drawSpriteCoreNodes(x, y, w, h, color, t, intensity = 1, points = []) {
  const nodes = points.length ? points : [
    [0.5, 0.42, 2.6],
    [0.26, 0.68, 1.8],
    [0.74, 0.68, 1.8],
  ];
  const pulse = 0.62 + Math.sin(t * 7.5 + x * 0.01) * 0.22;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.shadowColor = color;
  ctx.shadowBlur = 14 * intensity;
  ctx.fillStyle = color;
  ctx.strokeStyle = rgbaFromHex(color, 0.18 * intensity);
  ctx.lineWidth = 1;
  for (const [px, py, r] of nodes) {
    const nx = x + w * px;
    const ny = y + h * py;
    const radius = r * intensity * (0.82 + pulse * 0.32);
    ctx.globalAlpha = 0.32 * intensity + pulse * 0.18;
    ctx.beginPath();
    ctx.arc(nx, ny, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  if (nodes.length > 1) {
    ctx.globalAlpha = 0.14 * intensity;
    ctx.beginPath();
    for (let i = 1; i < nodes.length; i++) {
      ctx.moveTo(x + w * nodes[0][0], y + h * nodes[0][1]);
      ctx.lineTo(x + w * nodes[i][0], y + h * nodes[i][1]);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawSpawnMaterialize(x, y, w, h, color, t, age, strength = 1) {
  const life = clamp(1 - (age ?? 99) / 1.15, 0, 1);
  if (life <= 0) return;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const shimmer = 0.68 + Math.sin(t * 14) * 0.18;
  const alpha = life * shimmer * strength;
  drawBloomOrb(cx, cy, Math.max(w, h) * (0.72 + life * 0.34), rgbaFromHex(color, "ALPHA"), 0.1 * alpha);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = rgbaFromHex(color, 0.34 * alpha);
  ctx.fillStyle = rgbaFromHex(color, 0.22 * alpha);
  ctx.shadowColor = color;
  ctx.shadowBlur = 16 * strength;
  ctx.lineWidth = Math.max(1, 1.5 * strength);
  ctx.beginPath();
  ctx.rect(x - 12, y - 12, w + 24, h + 24);
  ctx.clip();

  const sweep = x - 12 + ((t * 96 + x * 0.37) % (w + 24));
  ctx.fillRect(sweep, y - 16, 2.5 * strength, h + 32);
  for (let i = 0; i < 5; i++) {
    const sx = x - 12 + ((t * 58 + i * 27 + y * 0.19) % (w + 24));
    ctx.globalAlpha = 0.18 * alpha * (1 - i * 0.11);
    ctx.fillRect(sx, y - 10, 1.5, h + 20);
  }
  ctx.globalAlpha = 1;

  const pad = 6 + life * 10;
  const len = Math.min(w, h) * 0.22;
  ctx.beginPath();
  ctx.moveTo(x - pad, y + len); ctx.lineTo(x - pad, y - pad); ctx.lineTo(x + len, y - pad);
  ctx.moveTo(x + w + pad, y + len); ctx.lineTo(x + w + pad, y - pad); ctx.lineTo(x + w - len, y - pad);
  ctx.moveTo(x - pad, y + h - len); ctx.lineTo(x - pad, y + h + pad); ctx.lineTo(x + len, y + h + pad);
  ctx.moveTo(x + w + pad, y + h - len); ctx.lineTo(x + w + pad, y + h + pad); ctx.lineTo(x + w - len, y + h + pad);
  ctx.stroke();
  ctx.restore();
}

function drawSpriteShadow(x, y, rx, ry, color = "rgba(0,0,0,ALPHA)", alpha = 0.32) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, rx);
  glow.addColorStop(0, color.replace("ALPHA", String(alpha)));
  glow.addColorStop(0.58, color.replace("ALPHA", String(alpha * 0.28)));
  glow.addColorStop(1, color.replace("ALPHA", "0"));
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSceneBackground(t) {
  const sky = ctx.createLinearGradient(0, 0, FIELD_W, H);
  sky.addColorStop(0, "#02050b");
  sky.addColorStop(0.58, "#04140f");
  sky.addColorStop(1, "#020207");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, FIELD_W, H);

  ctx.fillStyle = stageColor(0.13);
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);

  game.stars.forEach((s) => {
    const pulse = 0.55 + Math.sin(t * (0.8 + s.s * 0.12) + s.x * 0.03) * 0.22;
    ctx.fillStyle = `rgba(210, 248, 255, ${clamp(0.2 + s.s / 7, 0.25, 0.72) * pulse})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  if (renderProfile.backgroundStreams > 0) drawBackgroundDataStreams(t);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.58;
  ctx.strokeStyle = stageColor(0.011);
  ctx.lineWidth = 0.65;
  for (let x = -170 + ((t * 7) % 170); x < FIELD_W + 170; x += 170) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - 70, H);
    ctx.stroke();
  }
  for (let y = (t * 10) % 190; y < H; y += 190) {
    ctx.strokeStyle = stageColor(0.008 + (y % 380 === 0 ? 0.006 : 0));
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(FIELD_W, y);
    ctx.stroke();
  }
  ctx.restore();

  const vignette = ctx.createRadialGradient(FIELD_W / 2, H / 2, 120, FIELD_W / 2, H / 2, FIELD_W * 0.72);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.42)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, FIELD_W, H);

  ctx.strokeStyle = "rgba(101, 243, 255, 0.2)";
  ctx.strokeRect(0.5, 0.5, FIELD_W - 1, FIELD_H - 1);
}

function drawBackgroundDataStreams(t) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const accent = game.boss ? "#ff4747" : VISUALS.stageTint[game.stage % VISUALS.stageTint.length];
  const columns = renderProfile.backgroundStreams;
  for (let i = 0; i < columns; i++) {
    const x = 42 + i * 57 + Math.sin(t * 0.35 + i) * 9;
    const speed = 18 + (i % 5) * 7;
    const offset = (t * speed + i * 61) % (FIELD_H + 120);
    const alpha = 0.035 + (i % 4) * 0.009;
    ctx.strokeStyle = i % 3 === 0 ? rgbaFromHex(accent, alpha + 0.025) : `rgba(101, 243, 255, ${alpha})`;
    ctx.lineWidth = i % 4 === 0 ? 1.2 : 0.7;
    ctx.beginPath();
    for (let y = -120 + offset; y < FIELD_H + 80; y += 210) {
      const lean = Math.sin(t * 0.8 + i + y * 0.01) * 8;
      ctx.moveTo(x + lean, y);
      ctx.lineTo(x + lean - 10, y + 44);
    }
    ctx.stroke();

    if (i % 3 === 1) {
      const glintY = -40 + ((t * (speed * 1.8) + i * 97) % (FIELD_H + 80));
      ctx.fillStyle = rgbaFromHex(accent, 0.09);
      ctx.fillRect(x - 1, glintY, 2, 18);
    }
  }
  ctx.restore();
}

function drawHudBackplate(t) {
  const hud = ctx.createLinearGradient(HUD_X, 0, W, H);
  hud.addColorStop(0, "rgba(2, 8, 15, 0.96)");
  hud.addColorStop(0.48, "rgba(5, 9, 19, 0.94)");
  hud.addColorStop(1, "rgba(3, 3, 9, 0.98)");
  ctx.fillStyle = hud;
  ctx.fillRect(HUD_X, 0, HUD_W, H);

  const hudGlow = ctx.createRadialGradient(HUD_X + 80, 100, 0, HUD_X + 80, 100, HUD_W * 1.2);
  hudGlow.addColorStop(0, stageColor(0.1));
  hudGlow.addColorStop(0.45, "rgba(101, 243, 255, 0.035)");
  hudGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = hudGlow;
  ctx.fillRect(HUD_X, 0, HUD_W, H);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = stageColor(0.035);
  for (let y = -40 + ((t * 12) % 58); y < H; y += 58) ctx.fillRect(HUD_X, y, HUD_W, 1);
  ctx.fillStyle = "rgba(101, 243, 255, 0.05)";
  const sweepY = ((t * 36) % (H + 120)) - 120;
  ctx.fillRect(HUD_X, sweepY, HUD_W, 22);
  ctx.strokeStyle = "rgba(101, 243, 255, 0.25)";
  ctx.beginPath();
  ctx.moveTo(HUD_X + 0.5, 0);
  ctx.lineTo(HUD_X + 0.5, H);
  ctx.stroke();
  ctx.restore();
}

function drawPanelBox(x, y, w, h, accent = "#65f3ff", alpha = 0.12) {
  ctx.save();
  const panel = ctx.createLinearGradient(x, y, x + w, y + h);
  panel.addColorStop(0, "rgba(8, 17, 27, 0.86)");
  panel.addColorStop(0.58, "rgba(2, 7, 16, 0.76)");
  panel.addColorStop(1, "rgba(1, 3, 9, 0.88)");
  ctx.fillStyle = panel;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 5);
  ctx.fill();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = accent;
  ctx.globalAlpha = alpha;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.globalAlpha = alpha * 0.55;
  ctx.fillRect(x, y + 8, 3, h - 16);
  ctx.globalAlpha = alpha * 0.7;
  const tick = Math.min(22, w * 0.16);
  ctx.fillRect(x + 10, y, tick, 1);
  ctx.fillRect(x + w - tick - 10, y + h - 1, tick, 1);
  ctx.restore();
}

function drawScanlines(t) {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(255,255,255,0.006)";
  for (let y = Math.floor(t * 3) % 24; y < H; y += 24) ctx.fillRect(0, y, W, 1);
  ctx.restore();
}

function drawDamageWarningOverlay(t, danger) {
  const pulse = 0.75 + Math.sin(t * 8) * 0.18;
  const edge = ctx.createRadialGradient(FIELD_W / 2, H / 2, FIELD_W * 0.24, FIELD_W / 2, H / 2, FIELD_W * 0.74);
  edge.addColorStop(0, "rgba(255, 71, 71, 0)");
  edge.addColorStop(0.58, `rgba(255, 71, 71, ${danger * 0.1})`);
  edge.addColorStop(1, `rgba(255, 71, 71, ${danger})`);
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = `rgba(255, 93, 93, ${danger * (0.35 + pulse * 0.18)})`;
  ctx.fillStyle = `rgba(255, 93, 93, ${danger * 0.18})`;
  ctx.shadowColor = "#ff4747";
  ctx.shadowBlur = 16 * danger;
  ctx.lineWidth = 1.4;

  const pad = 18;
  const len = 42 + pulse * 10;
  ctx.beginPath();
  ctx.moveTo(pad, pad + len); ctx.lineTo(pad, pad); ctx.lineTo(pad + len, pad);
  ctx.moveTo(FIELD_W - pad, pad + len); ctx.lineTo(FIELD_W - pad, pad); ctx.lineTo(FIELD_W - pad - len, pad);
  ctx.moveTo(pad, FIELD_H - pad - len); ctx.lineTo(pad, FIELD_H - pad); ctx.lineTo(pad + len, FIELD_H - pad);
  ctx.moveTo(FIELD_W - pad, FIELD_H - pad - len); ctx.lineTo(FIELD_W - pad, FIELD_H - pad); ctx.lineTo(FIELD_W - pad - len, FIELD_H - pad);
  ctx.stroke();

  const glitchCount = game.lives <= 1 ? 12 : 6;
  for (let i = 0; i < glitchCount; i++) {
    const side = i % 4;
    const span = 22 + ((i * 17) % 64);
    const flicker = 0.34 + Math.sin(t * 16 + i * 1.7) * 0.2;
    ctx.globalAlpha = danger * flicker;
    if (side === 0) ctx.fillRect(8, 74 + ((t * 42 + i * 67) % (FIELD_H - 150)), span, 2);
    if (side === 1) ctx.fillRect(FIELD_W - 8 - span, 70 + ((t * 38 + i * 59) % (FIELD_H - 145)), span, 2);
    if (side === 2) ctx.fillRect(82 + ((t * 46 + i * 83) % (FIELD_W - 170)), 8, span, 2);
    if (side === 3) ctx.fillRect(82 + ((t * 41 + i * 71) % (FIELD_W - 170)), FIELD_H - 10, span, 2);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawFieldOverlays(t) {
  if (game.flash?.t > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = game.flash.color.replace("ALPHA", String(game.flash.t * 0.2));
    ctx.fillRect(0, 0, FIELD_W, FIELD_H);
    ctx.restore();
  }

  const combatPressure = Math.min(1, (game.enemyShots.length / 22) + (game.entities.length / 40) + (game.boss ? 0.55 : 0));
  if (combatPressure > 0.18) {
    const accent = game.boss ? "#ff4747" : VISUALS.stageTint[game.stage % VISUALS.stageTint.length];
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = combatPressure;
    const pressureX = game.boss ? game.boss.x + game.boss.w / 2 : FIELD_W / 2 + Math.sin(t * 0.8) * FIELD_W * 0.18;
    const pressureY = game.boss ? game.boss.y + game.boss.h / 2 : FIELD_H * 0.24;
    const pressureGlow = ctx.createRadialGradient(pressureX, pressureY, 24, pressureX, pressureY, FIELD_W * 0.55);
    pressureGlow.addColorStop(0, rgbaFromHex(accent, game.boss ? 0.08 : 0.045));
    pressureGlow.addColorStop(0.45, rgbaFromHex(accent, 0.025));
    pressureGlow.addColorStop(1, rgbaFromHex(accent, 0));
    ctx.fillStyle = pressureGlow;
    ctx.fillRect(0, 0, FIELD_W, FIELD_H);
    ctx.globalAlpha = 0.16 * combatPressure;
    ctx.strokeStyle = rgbaFromHex(accent, "0.34");
    ctx.lineWidth = 1;
    ctx.setLineDash([18, 18]);
    ctx.lineDashOffset = -t * 38;
    for (let y = 122; y < FIELD_H - 70; y += 118) {
      ctx.beginPath();
      ctx.moveTo(24, y + Math.sin(t + y) * 3);
      ctx.lineTo(FIELD_W - 24, y + Math.cos(t * 0.8 + y) * 3);
      ctx.stroke();
    }
    ctx.restore();
  }

  const danger = game.lives <= 1 ? 0.34 + Math.sin(t * 8) * 0.08 : game.player.inv > 0 ? 0.14 : 0;
  if (danger > 0) {
    drawDamageWarningOverlay(t, danger);
  }

  if (game.strike >= 100 || game.bombs > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = game.bombs > 0 ? "rgba(255, 138, 61, 0.25)" : "rgba(156, 255, 87, 0.22)";
    ctx.lineWidth = 3 + Math.sin(t * 6) * 1;
    ctx.strokeRect(8.5, 8.5, FIELD_W - 17, FIELD_H - 17);
    ctx.restore();
  }
}

function drawTacticalFrame(t) {
  const accent = game.boss ? "#ff4747" : game.strike >= 100 ? "#9cff57" : "#65f3ff";
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineWidth = 1;
  ctx.strokeStyle = rgbaFromHex(accent, "0.34");
  ctx.shadowColor = accent;
  ctx.shadowBlur = 9;

  const pulse = 0.5 + Math.sin(t * 3.4) * 0.18;
  const corner = 34;
  const inset = 16.5;
  const corners = [
    [inset, inset, 1, 1],
    [FIELD_W - inset, inset, -1, 1],
    [inset, FIELD_H - inset, 1, -1],
    [FIELD_W - inset, FIELD_H - inset, -1, -1],
  ];
  for (const [x, y, sx, sy] of corners) {
    ctx.globalAlpha = 0.42 + pulse * 0.22;
    ctx.beginPath();
    ctx.moveTo(x, y + sy * corner);
    ctx.lineTo(x, y);
    ctx.lineTo(x + sx * corner, y);
    ctx.stroke();
  }

  ctx.shadowBlur = 5;
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "rgba(101, 243, 255, 0.75)";
  for (let y = 94; y < FIELD_H - 80; y += 92) {
    ctx.beginPath();
    ctx.moveTo(FIELD_W - 9, y);
    ctx.lineTo(FIELD_W - 1, y + 18);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.25 + pulse * 0.18;
  const sweep = 24 + ((t * 58) % (FIELD_W - 48));
  ctx.fillStyle = rgbaFromHex(accent, "0.35");
  ctx.fillRect(sweep, 8, 42, 2);
  ctx.fillRect(FIELD_W - sweep - 42, FIELD_H - 10, 42, 2);
  ctx.restore();
}

function drawCombatToast(x, y, w) {
  if (!game.combatToast) return;
  const toast = game.combatToast;
  const life = clamp(toast.t / toast.maxT, 0, 1);
  const alpha = Math.min(1, life * 1.4);
  const slide = (1 - life) * 7;
  const bx = x + slide;
  const bw = w - slide;
  ctx.save();
  ctx.textAlign = "left";
  ctx.font = "bold 12px Arial";
  ctx.globalAlpha = alpha;
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "rgba(4, 10, 16, 0.88)";
  ctx.beginPath();
  ctx.roundRect(bx, y, bw, 24, 4);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = toast.color;
  ctx.strokeRect(bx + 0.5, y + 0.5, bw - 1, 23);
  ctx.fillStyle = toast.color;
  ctx.fillRect(bx + 5, y + 5, 3, 14);
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = alpha * 0.55;
  ctx.fillRect(bx + 10, y + 4, bw - 20, 1);
  ctx.globalAlpha = alpha;
  ctx.shadowColor = toast.color;
  ctx.shadowBlur = 12;
  ctx.fillStyle = toast.color;
  ctx.fillText(toast.text, bx + 16, y + 16);
  ctx.restore();
}

function drawAchievementToast(x, y, w, t) {
  if (!game.achievementToast) return;
  const toast = game.achievementToast;
  const life = clamp(toast.t / toast.maxT, 0, 1);
  const alpha = Math.min(1, life * 1.5);
  const slide = (1 - life) * 16;
  const h = 76;
  ctx.save();
  ctx.globalAlpha = alpha;
  drawPanelBox(x + slide, y, w - slide, h, "#ffd64d", 0.38);
  ctx.globalCompositeOperation = "lighter";
  ctx.shadowColor = "#ffd64d";
  ctx.shadowBlur = 16;
  ctx.fillStyle = "#ffd64d";
  ctx.font = "bold 11px Arial";
  ctx.fillText("ACHIEVEMENT ACQUIRED", x + 14 + slide, y + 20);
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 17px Arial";
  ctx.fillText(toast.name, x + 14 + slide, y + 43);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.68)";
  ctx.font = "bold 10px Arial";
  ctx.fillText(toast.desc, x + 14 + slide, y + 61);
  ctx.fillStyle = "rgba(255, 214, 77, 0.2)";
  ctx.fillRect(x + 14 + slide, y + 68, w - 28 - slide, 2);
  ctx.fillStyle = "rgba(255, 214, 77, 0.85)";
  ctx.fillRect(x + 14 + slide, y + 68, (w - 28 - slide) * life, 2);
  for (let i = 0; i < 5; i++) {
    const px = x + w - 48 + i * 7 + Math.sin(t * 7 + i) * 1.5;
    ctx.fillStyle = i % 2 ? "rgba(101, 243, 255, 0.44)" : "rgba(255, 214, 77, 0.58)";
    ctx.fillRect(px, y + 14 + i * 8, 3, 3);
  }
  ctx.restore();
}

function draw() {
  const t = performance.now() / 1000;
  const shakeX = game.shake > 0 ? Math.sin(t * 71) * game.shake : 0;
  const shakeY = game.shake > 0 ? Math.cos(t * 83) * game.shake * 0.55 : 0;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#02040a";
  ctx.fillRect(0, 0, W, H);
  drawSceneBackground(t);
  drawHudBackplate(t);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, FIELD_W, FIELD_H);
  ctx.clip();
  ctx.translate(shakeX, shakeY);
  drawSceneLightWash(t);
  game.missiles.forEach(drawMissile);
  game.enemyShots.forEach(drawEnemyShot);
  game.entities.forEach(drawEntity);
  game.powerups.forEach(drawPowerup);
  if (game.boss) drawBoss(game.boss);
  game.playerTrail.forEach(drawPlayerTrail);
  drawPlayer();
  drawPointerReticle(t);
  game.particles.forEach(drawParticle);
  if (game.stageFlash > 0) { ctx.fillStyle = `rgba(255,255,255,${game.stageFlash * 0.6})`; ctx.fillRect(0, 0, FIELD_W, FIELD_H); }
  drawFieldOverlays(t);
  ctx.restore();
  drawHud();
  drawTacticalFrame(t);
  if (renderProfile.scanlines) drawScanlines(t);
}

function drawPlayerTrail(trail) {
  const img = loadedImages.get(trail.key);
  if (!img) return;
  const life = Math.max(0, trail.t / trail.maxT);
  const t = performance.now() / 1000;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = life * (trail.boosting ? 0.34 : 0.18);
  ctx.shadowColor = trail.boosting ? "#65f3ff" : "#9cff57";
  ctx.shadowBlur = trail.boosting ? 22 : 13;
  ctx.translate(trail.x + trail.w / 2, trail.y + trail.h / 2 + Math.sin(t * 9) * 0.8);
  ctx.scale(1 + (1 - life) * 0.08, 1 + (1 - life) * 0.12);
  ctx.drawImage(img, -trail.w / 2, -trail.h / 2, trail.w, trail.h);
  ctx.restore();
}

function drawThrusterBloom(p, t) {
  const boost = game.boosting ? 1 : 0.42;
  const pulse = 0.75 + Math.sin(t * 18) * 0.18;
  const jets = [
    [p.x + 21, p.y + p.h - 4, 18 * boost * pulse],
    [p.x + p.w - 21, p.y + p.h - 4, 18 * boost * pulse],
    [p.x + p.w / 2, p.y + p.h - 3, 26 * boost * pulse],
  ];
  jets.forEach(([x, y, len], idx) => {
    const flame = ctx.createLinearGradient(x, y, x, y + len + 28);
    flame.addColorStop(0, "rgba(255,255,255,0.9)");
    flame.addColorStop(0.25, "rgba(101,243,255,0.8)");
    flame.addColorStop(1, "rgba(16,170,255,0)");
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = flame;
    ctx.beginPath();
    ctx.moveTo(x - (idx === 2 ? 7 : 5), y);
    ctx.lineTo(x, y + len + (idx === 2 ? 30 : 18));
    ctx.lineTo(x + (idx === 2 ? 7 : 5), y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function drawPlayer() {
  const p = game.player;
  const key = core.playerSpriteKey({ boosting: game.boosting, lives: game.lives });
  const img = loadedImages.get(key);
  const t = performance.now() / 1000;
  const bob = Math.sin(t * 7) * 1.2;
  const damagePulse = key === "debugger.damaged" ? 0.14 + Math.sin(t * 16) * 0.06 : 0;
  const visibleAlpha = game.player.inv > 0 && Math.floor(game.player.inv / 8) % 2 === 0 ? 0.45 : 1;
  if (img) {
    if (game.shield) drawShield(p.x + 30, p.y + 45);
    drawSpriteShadow(p.x + p.w / 2, p.y + p.h - 5, 54, 14, "rgba(0, 0, 0, ALPHA)", 0.42);
    drawThrusterBloom(p, t);
    drawSpriteLit(img, p.x, p.y, p.w, p.h, {
      bob,
      glow: key === "debugger.damaged" ? "#ff5d5d" : "#65f3ff",
      glowAlpha: 0.34 + damagePulse,
      glowBlur: game.boosting ? 28 : 18,
      scale: game.boosting ? 1.035 : 1,
      alpha: visibleAlpha,
    });
    if (renderProfile.spriteFx) {
      const coreColor = key === "debugger.damaged" ? "#ff5d5d" : "#65f3ff";
      drawSpriteCoreNodes(p.x, p.y + bob, p.w, p.h, coreColor, t, game.boosting ? 1.18 : 0.9, [
        [0.5, 0.42, 3.2],
        [0.27, 0.62, 2],
        [0.73, 0.62, 2],
        [0.5, 0.83, 2.3],
      ]);
      drawSpriteScanSweep(p.x, p.y + bob, p.w, p.h, coreColor, t, game.boosting ? 0.9 : 0.55);
    }
    return;
  }
  if (game.shield) drawShield(p.x + 30, p.y + 45);
  drawSpriteShadow(p.x + p.w / 2, p.y + p.h - 5, 54, 14, "rgba(0, 0, 0, ALPHA)", 0.42);
  drawThrusterBloom(p, t);
  ctx.save(); ctx.translate(p.x + 30, p.y + 45);
  if (game.player.inv > 0 && Math.floor(game.player.inv / 8) % 2 === 0) ctx.globalAlpha = 0.45;
  ctx.fillStyle = game.lives <= 1 ? "#ff5d5d" : "#dfffe3";
  ctx.beginPath(); ctx.moveTo(0, -45); ctx.lineTo(31, 34); ctx.lineTo(10, 23); ctx.lineTo(10, 43); ctx.lineTo(-10, 43); ctx.lineTo(-10, 23); ctx.lineTo(-31, 34); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#132d1e"; ctx.fillRect(-10, -18, 20, 42);
  ctx.fillStyle = "#9cff57"; ctx.fillRect(-5, -12, 10, 7); ctx.fillRect(-16, 18, 8, 24); ctx.fillRect(8, 18, 8, 24);
  if (game.boosting) { ctx.fillStyle = "#d9ff43"; ctx.beginPath(); ctx.moveTo(-12, 42); ctx.lineTo(0, 68); ctx.lineTo(12, 42); ctx.fill(); }
  ctx.restore();
}

function drawPointerReticle(t) {
  if (renderProfile.name === "lite") return;
  if (!pointer.active || state !== "playing") return;
  const cx = game.player.x + game.player.w / 2;
  const cy = game.player.y + game.player.h * 0.46;
  const pulse = 0.62 + Math.sin(t * 9) * 0.18;
  const color = pointer.fire ? "#9cff57" : "#65f3ff";
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = rgbaFromHex(color, pointer.fire ? 0.45 : 0.3);
  ctx.fillStyle = rgbaFromHex(color, pointer.fire ? 0.35 : 0.2);
  ctx.shadowColor = color;
  ctx.shadowBlur = pointer.fire ? 16 : 10;
  ctx.lineWidth = pointer.fire ? 2 : 1.4;
  ctx.setLineDash(pointer.fire ? [10, 6] : [7, 9]);
  ctx.lineDashOffset = -t * (pointer.fire ? 44 : 24);
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 45 + pulse * 6, 57 + pulse * 7, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  const bracket = 16 + pulse * 4;
  const gapX = 52 + pulse * 4;
  const gapY = 64 + pulse * 4;
  ctx.beginPath();
  ctx.moveTo(cx - gapX, cy - gapY + bracket); ctx.lineTo(cx - gapX, cy - gapY); ctx.lineTo(cx - gapX + bracket, cy - gapY);
  ctx.moveTo(cx + gapX, cy - gapY + bracket); ctx.lineTo(cx + gapX, cy - gapY); ctx.lineTo(cx + gapX - bracket, cy - gapY);
  ctx.moveTo(cx - gapX, cy + gapY - bracket); ctx.lineTo(cx - gapX, cy + gapY); ctx.lineTo(cx - gapX + bracket, cy + gapY);
  ctx.moveTo(cx + gapX, cy + gapY - bracket); ctx.lineTo(cx + gapX, cy + gapY); ctx.lineTo(cx + gapX - bracket, cy + gapY);
  ctx.stroke();

  ctx.globalAlpha = pointer.fire ? 0.75 : 0.46;
  ctx.beginPath();
  ctx.moveTo(cx - 18, cy - 48);
  ctx.lineTo(cx + 18, cy - 48);
  ctx.moveTo(cx, cy - 66);
  ctx.lineTo(cx, cy - 30);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy - 48, pointer.fire ? 3 : 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawShield(x, y) {
  const t = performance.now() / 1000;
  const layers = core.shieldAuraLayers(t);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const glow = ctx.createRadialGradient(x, y, 8, x, y, 82);
  glow.addColorStop(0, "rgba(156, 255, 87, 0.18)");
  glow.addColorStop(0.42, "rgba(101, 243, 255, 0.24)");
  glow.addColorStop(1, "rgba(33, 92, 255, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(x, y, 69 + Math.sin(t * 4) * 3, 80 + Math.cos(t * 3) * 3, 0, 0, Math.PI * 2);
  ctx.fill();

  layers.forEach((layer, idx) => {
    ctx.strokeStyle = idx === 0 ? `rgba(156, 255, 87, ${layer.alpha})` : `rgba(101, 243, 255, ${layer.alpha})`;
    ctx.lineWidth = layer.lineWidth;
    ctx.setLineDash(idx === 0 ? [18, 9] : [8, 10]);
    ctx.lineDashOffset = -(t * (34 + idx * 14));
    ctx.beginPath();
    ctx.ellipse(x, y, layer.rx, layer.ry, Math.sin(t * 1.6) * 0.08, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  ctx.strokeStyle = "rgba(101, 243, 255, 0.34)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    const a = t * 0.9 + i * Math.PI / 3;
    const px = x + Math.cos(a) * 52;
    const py = y + Math.sin(a) * 63;
    const qx = x + Math.cos(a + Math.PI / 3) * 52;
    const qy = y + Math.sin(a + Math.PI / 3) * 63;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(qx, qy);
    ctx.stroke();
  }

  for (let i = 0; i < 14; i++) {
    const a = t * (0.9 + i * 0.02) + i * 2.399;
    const pulse = (Math.sin(t * 6 + i) + 1) / 2;
    const px = x + Math.cos(a) * (48 + pulse * 15);
    const py = y + Math.sin(a) * (58 + pulse * 13);
    ctx.fillStyle = i % 2 === 0 ? "rgba(156, 255, 87, 0.72)" : "rgba(101, 243, 255, 0.66)";
    ctx.fillRect(px - 1, py - 1, 2, 2);
  }

  ctx.restore();
}

function drawMissile(m) {
  const frame = Math.floor(((m.age ?? performance.now() / 1000) * 18) % 3);
  const img = loadedImages.get(`packet.shot.${frame}`) ?? loadedImages.get("packet.shot");
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const trail = ctx.createLinearGradient(m.x + m.w / 2, m.y + m.h, m.x + m.w / 2, m.y + m.h + 36);
  trail.addColorStop(0, "rgba(156,255,87,0.36)");
  trail.addColorStop(1, "rgba(101,243,255,0)");
  ctx.fillStyle = trail;
  ctx.beginPath();
  ctx.moveTo(m.x - 1, m.y + m.h - 2);
  ctx.lineTo(m.x + m.w + 1, m.y + m.h - 2);
  ctx.lineTo(m.x + m.w / 2, m.y + m.h + 24);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  if (img) {
    drawSpriteLit(img, m.x, m.y, m.w, m.h, { glow: "#9cff57", glowAlpha: 0.55, glowBlur: 16 });
    return;
  }
  ctx.fillStyle = "#f6f7fb"; ctx.fillRect(m.x, m.y, m.w, m.h); ctx.fillStyle = "#ffdf47"; ctx.fillRect(m.x + 2, m.y + 22, m.w - 4, 12);
}

function drawEnemyShot(s) {
  const frame = Math.floor(((s.age ?? 0) * 12 + (s.frame ?? 0)) % 3);
  const img = loadedImages.get(`projectile.enemy.${frame}`);
  const glow = s.homing ? "#ffd64d" : "#ff4747";
  drawShotArmor(s, glow);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const trail = ctx.createLinearGradient(s.x + s.w / 2, s.y, s.x + s.w / 2, s.y - 30);
  trail.addColorStop(0, s.homing ? "rgba(255,214,77,0.28)" : "rgba(255,71,71,0.24)");
  trail.addColorStop(1, "rgba(255,71,71,0)");
  ctx.fillStyle = trail;
  ctx.beginPath();
  ctx.moveTo(s.x + 1, s.y + 7);
  ctx.lineTo(s.x + s.w - 1, s.y + 7);
  ctx.lineTo(s.x + s.w / 2, s.y - 28);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  if (img) {
    drawSpriteLit(img, s.x, s.y, s.w, s.h, {
      glow,
      glowAlpha: s.homing ? 0.44 : 0.3,
      glowBlur: s.homing ? 16 : 10,
      flashAlpha: (s.hitFlash ?? 0) * 0.55,
      flashColor: s.homing ? "#ffd64d" : "#ffefef",
    });
    return;
  }
  ctx.fillStyle = "#ff5858"; ctx.fillRect(s.x, s.y, s.w, s.h); ctx.fillStyle = "#fff"; ctx.fillRect(s.x + 5, s.y + 5, 5, 28);
  if (s.homing) { ctx.fillStyle = "rgba(255, 223, 71, 0.55)"; ctx.beginPath(); ctx.arc(s.x + s.w / 2, s.y + s.h / 2, 4, 0, Math.PI * 2); ctx.fill(); }
}

function drawShotArmor(s, color) {
  if ((s.hp ?? 1) <= 1) return;
  const t = performance.now() / 1000;
  const cx = s.x + s.w / 2;
  const cy = s.y + s.h * 0.45;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < Math.min(4, s.hp); i++) {
    const a = t * (s.homing ? 4.2 : 2.6) + i * Math.PI * 2 / Math.min(4, s.hp);
    const px = cx + Math.cos(a) * (s.w * 0.65);
    const py = cy + Math.sin(a) * (s.h * 0.26);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.globalAlpha = 0.36 + i * 0.08;
    ctx.beginPath();
    ctx.arc(px, py, s.homing ? 2.2 : 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  if ((s.hitFlash ?? 0) > 0) {
    ctx.globalAlpha = Math.min(0.75, s.hitFlash);
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 13;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, s.w * 0.95 + s.hitFlash * 7, s.h * 0.34 + s.hitFlash * 4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawEntity(e) {
  const assetKey = entityAssetKey(e);
  const img = assetKey ? loadedImages.get(assetKey) ?? loadedImages.get(entityFallbackAssetKey(e)) : null;
  const t = performance.now() / 1000;
  if (img) {
    const damaged = e.hp < e.maxHp;
    const color = e.kind === "asteroid" ? "#a8987b" : VISUALS.enemyGlow[game.stage % VISUALS.enemyGlow.length];
    const bob = e.kind === "asteroid" ? 0 : Math.sin(t * 5.2 + e.phase) * 2.4;
    const rotation = e.kind === "asteroid" ? ((e.rot ?? 0) * Math.PI / 180) : Math.sin(t * 3.2 + e.phase) * 0.055;
    if (damaged) drawBloomOrb(e.x + e.w / 2, e.y + e.h / 2, 42, "rgba(255, 76, 76, ALPHA)", 0.28);
    drawSpriteShadow(e.x + e.w / 2, e.y + e.h - 4, e.kind === "asteroid" ? 34 : 42, e.kind === "asteroid" ? 10 : 12, "rgba(0, 0, 0, ALPHA)", e.kind === "asteroid" ? 0.28 : 0.34);
    drawSpawnMaterialize(e.x, e.y + bob, e.w, e.h, color, t + e.phase, e.spawnAge, e.kind === "asteroid" ? 0.75 : 1);
    drawSpriteLit(img, e.x, e.y, e.w, e.h, {
      bob,
      rotation,
      glow: damaged ? "#ff5d5d" : color,
      glowAlpha: damaged ? 0.42 : 0.26,
      glowBlur: damaged ? 20 : 14,
      scale: damaged ? 1 + Math.sin(t * 18 + e.phase) * 0.012 : 1,
      flashAlpha: (e.hitFlash ?? 0) * 0.48,
      flashColor: e.kind === "asteroid" ? "#fff1bf" : "#ffffff",
    });
    if (e.kind !== "asteroid" && renderProfile.spriteFx) {
      const liveColor = damaged ? "#ff5d5d" : color;
      drawSpriteCoreNodes(e.x, e.y + bob, e.w, e.h, liveColor, t + e.phase, damaged ? 1.05 : 0.75, [
        [0.5, 0.42, 2.5],
        [0.28, 0.35, 1.7],
        [0.72, 0.35, 1.7],
        [0.31, 0.76, 1.5],
        [0.69, 0.76, 1.5],
      ]);
      drawSpriteScanSweep(e.x, e.y + bob, e.w, e.h, liveColor, t + e.phase, damaged ? 0.72 : 0.42);
      drawSpriteSignalLights(e.x, e.y + bob, e.w, e.h, color, t + e.phase, 1, damaged);
    }
    return;
  }
  drawSpawnMaterialize(e.x, e.y, e.w, e.h, e.kind === "asteroid" ? "#a8987b" : "#65f3ff", t + (e.phase ?? 0), e.spawnAge, e.kind === "asteroid" ? 0.75 : 1);
  ctx.save(); ctx.translate(e.x + e.w / 2, e.y + e.h / 2); if (e.kind === "asteroid") ctx.rotate((e.rot ?? 0) * Math.PI / 180);
  if (e.kind === "asteroid") {
    ctx.shadowColor = "#a8987b";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#39404a";
    roughCircle(0, 0, 34, 10);
    ctx.fillStyle = "#9cff57";
    ctx.font = "bold 15px Consolas, monospace";
    ctx.textAlign = "center";
    ctx.fillText("ERR", 0, 5);
  }
  else {
    const palette = game.stage % 3 === 0 ? ["#75e35e", "#17391d"] : game.stage % 3 === 1 ? ["#ff596f", "#57202c"] : ["#bb7bff", "#322052"];
    ctx.shadowColor = palette[0];
    ctx.shadowBlur = 18;
    ctx.fillStyle = palette[0];
    ctx.fillRect(-23, -29, 46, 58);
    ctx.fillStyle = palette[1];
    ctx.fillRect(-17, -13, 34, 24);
    ctx.fillStyle = "#fff35d";
    ctx.fillRect(-14, -23, 7, 7);
    ctx.fillRect(7, -23, 7, 7);
    ctx.strokeStyle = palette[0];
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-17, -8); ctx.lineTo(-34, -19);
    ctx.moveTo(17, -8); ctx.lineTo(34, -19);
    ctx.moveTo(-17, 9); ctx.lineTo(-35, 17);
    ctx.moveTo(17, 9); ctx.lineTo(35, 17);
    ctx.moveTo(-10, 29); ctx.lineTo(-22, 41);
    ctx.moveTo(10, 29); ctx.lineTo(22, 41);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.fillRect(-21, -27, 10, 4);
    ctx.fillRect(5, 22, 16, 4);
  }
  ctx.restore();
}

function entityFallbackAssetKey(e) {
  if (e.kind === "asteroid") return `asteroid.0`;
  const stage = game.stage % 3;
  if (stage === 0) return "bug.malware.0";
  if (stage === 1) return "bug.glitch.0";
  return "bug.kernel.0";
}

function entityAssetKey(e) {
  if (e.kind === "asteroid") return `asteroid.${Math.abs(Math.floor((e.x + e.y) % 6))}`;
  const stage = game.stage % 3;
  const variant = Math.abs(Math.floor((e.x + e.phase) % 3));
  if (stage === 0) return `bug.malware.${variant}`;
  if (stage === 1) return `bug.glitch.${variant}`;
  return `bug.kernel.${variant}`;
}

function drawBossPhaseSurge(b, color, t) {
  const surge = clamp(b.phaseSurge ?? 0, 0, 1.35);
  if (surge <= 0) return;
  const life = surge / 1.35;
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  drawBloomOrb(cx, cy, 160 + (1 - life) * 80, "rgba(255, 138, 61, ALPHA)", 0.2 * life);
  ctx.strokeStyle = rgbaFromHex(color, 0.32 * life);
  ctx.shadowColor = color;
  ctx.shadowBlur = 22;
  ctx.lineWidth = 2 + life * 2;
  for (let i = 0; i < 3; i++) {
    const radius = 58 + i * 28 + (1 - life) * 46;
    ctx.globalAlpha = life * (0.55 - i * 0.12);
    ctx.setLineDash(i % 2 ? [10, 14] : [18, 12]);
    ctx.lineDashOffset = -t * (34 + i * 11);
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius, radius * 0.62, Math.sin(t + i) * 0.12, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.globalAlpha = life * 0.45;
  ctx.strokeStyle = "#ffef7d";
  ctx.beginPath();
  ctx.moveTo(cx - b.w * 0.55, cy);
  ctx.lineTo(cx + b.w * 0.55, cy);
  ctx.moveTo(cx, cy - b.h * 0.34);
  ctx.lineTo(cx, cy + b.h * 0.34);
  ctx.stroke();
  ctx.restore();
}

function drawBoss(b) {
  const bossKeys = ["adware", "trojan", "worm", "rootkit"];
  const bossImg = loadedImages.get(`boss.${bossKeys[b.idx]}.${b.phase === 2 ? "damaged" : "normal"}`);
  const t = performance.now() / 1000;
  const bossGlow = ["#ff4747", "#bb72ff", "#9cff57", "#42b7ff"][b.idx] ?? "#65f3ff";
  const hurt = b.phase === 2;
  drawBloomOrb(b.x + b.w / 2, b.y + b.h / 2, hurt ? 126 : 108, hurt ? "rgba(255, 71, 71, ALPHA)" : "rgba(101, 243, 255, ALPHA)", hurt ? 0.28 : 0.18);
  drawSpriteShadow(b.x + b.w / 2, b.y + b.h - 8, 94, 20, "rgba(0, 0, 0, ALPHA)", 0.44);
  drawSpawnMaterialize(b.x, b.y, b.w, b.h, bossGlow, t + b.motion, b.spawnAge, 1.55);
  if (renderProfile.spriteFx) drawBossPhaseSurge(b, bossGlow, t);
  if (bossImg) {
    drawSpriteLit(bossImg, b.x, b.y, b.w, b.h, {
      bob: Math.sin(t * 3.2 + b.motion) * 2.8,
      rotation: Math.sin(t * 1.6 + b.motion) * 0.025,
      glow: hurt ? "#ff5d5d" : bossGlow,
      glowAlpha: hurt ? 0.5 : 0.34,
      glowBlur: hurt ? 34 : 26,
      scale: hurt ? 1 + Math.sin(t * 13) * 0.01 : 1,
      flashAlpha: (b.hitFlash ?? 0) * 0.62,
      flashColor: "#ffffff",
    });
    if (renderProfile.spriteFx) {
      drawSpriteCoreNodes(b.x, b.y, b.w, b.h, hurt ? "#ff5d5d" : bossGlow, t + b.motion, hurt ? 1.45 : 1.05, [
        [0.5, 0.34, 4.3],
        [0.28, 0.52, 3],
        [0.72, 0.52, 3],
        [0.34, 0.72, 2.4],
        [0.66, 0.72, 2.4],
      ]);
      drawSpriteScanSweep(b.x, b.y, b.w, b.h, hurt ? "#ff5d5d" : bossGlow, t + b.motion, hurt ? 0.95 : 0.68);
      drawBossSignalHarness(b, bossGlow, t, hurt);
    }
    drawBossBar(b);
    return;
  }
  ctx.save(); ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
  ctx.fillStyle = b.phase === 2 ? "#e14949" : ["#9ea436", "#a53c52", "#8e62d9", "#4a6f9f"][b.idx];
  ctx.beginPath(); ctx.roundRect(-70, -105, 140, 210, 8); ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.fillRect(-52, -72, 104, 42);
  ctx.fillStyle = "#111820"; ctx.fillRect(-46, -8, 92, 82);
  ctx.strokeStyle = "#9cff57"; ctx.lineWidth = 5;
  ctx.beginPath();
  for (let y = -78; y <= 78; y += 26) { ctx.moveTo(-70, y); ctx.lineTo(-92, y - 12); ctx.moveTo(70, y); ctx.lineTo(92, y - 12); }
  ctx.stroke();
  ctx.fillStyle = "#ffd64d"; ctx.font = "bold 18px Arial"; ctx.fillText(b.name, -ctx.measureText(b.name).width / 2, -45);
  ctx.fillStyle = "#9cff57"; ctx.font = "bold 14px Consolas, monospace"; ctx.fillText("VIRUS", -22, 37);
  ctx.restore();
  drawBossBar(b);
}

function drawBossSignalHarness(b, color, t, hurt) {
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  const pulse = 0.55 + Math.sin(t * (hurt ? 10 : 5) + b.motion) * 0.2;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = hurt ? "#ff5d5d" : color;
  ctx.shadowColor = hurt ? "#ff5d5d" : color;
  ctx.shadowBlur = hurt ? 22 : 15;
  ctx.globalAlpha = hurt ? 0.34 + pulse * 0.22 : 0.18 + pulse * 0.16;
  ctx.lineWidth = hurt ? 2 : 1.5;
  ctx.setLineDash(hurt ? [8, 8] : [16, 12]);
  ctx.lineDashOffset = -t * (hurt ? 46 : 24);
  ctx.beginPath();
  ctx.ellipse(cx, cy, b.w * 0.48 + pulse * 6, b.h * 0.38 + pulse * 8, Math.sin(t) * 0.05, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  const nodes = [
    [0.23, 0.32, 3.6],
    [0.77, 0.32, 3.6],
    [0.31, 0.69, 3],
    [0.69, 0.69, 3],
    [0.5, 0.18, 2.7],
  ];
  ctx.fillStyle = hurt ? "#ff8a3d" : color;
  nodes.forEach(([px, py, r], idx) => {
    ctx.globalAlpha = (hurt ? 0.55 : 0.36) + Math.sin(t * 7 + idx) * 0.12;
    ctx.beginPath();
    ctx.arc(b.x + b.w * px, b.y + b.h * py, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawBossBar(b) {
  meter(FIELD_W / 2 - 180, 42, 360, 18, b.hp / b.maxHp, `${b.name} POWER`, "#ff3434", true);
}

function drawPowerup(p) {
  const powerupImg = loadedImages.get(`powerup.${p.type}`);
  const t = performance.now() / 1000;
  const color = VISUALS.powerupGlow[p.type] ?? "#65f3ff";
  const bob = Math.sin(t * 5 + p.phase) * 4;
  const pulse = 0.5 + Math.sin(t * 7 + p.phase) * 0.18;
  drawSpriteShadow(p.x + p.w / 2, p.y + p.h / 2 + bob + 14, 28, 7, "rgba(0, 0, 0, ALPHA)", 0.26);
  drawBloomOrb(p.x + p.w / 2, p.y + p.h / 2 + bob, 38, rgbaFromHex(color, "ALPHA"), 0.12 + pulse * 0.14);
  if (powerupImg) {
    drawSpriteLit(powerupImg, p.x, p.y, p.w, p.h, {
      bob,
      rotation: Math.sin(t * 2 + p.phase) * 0.08,
      glow: color,
      glowAlpha: 0.5,
      glowBlur: 18,
      scale: 1 + pulse * 0.025,
    });
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.22 + pulse * 0.22;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x + p.w / 2, p.y + p.h / 2 + bob, 24 + pulse * 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([7, 10]);
    ctx.lineDashOffset = -t * 20;
    ctx.globalAlpha = 0.16 + pulse * 0.18;
    ctx.strokeRect(p.x - 7, p.y + bob - 7, p.w + 14, p.h + 14);
    ctx.setLineDash([]);
    ctx.restore();
    return;
  }
  const colors = { rapid: "#65f3ff", shield: "#6fffb0", triple: "#ffe45f", bomb: "#ff8a3d", life: "#ff6f91" };
  ctx.fillStyle = colors[p.type]; ctx.beginPath(); ctx.arc(p.x + 15, p.y + 15, 15, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#071017"; ctx.font = "bold 12px Arial"; ctx.textAlign = "center"; ctx.fillText(p.type[0].toUpperCase(), p.x + 15, p.y + 20);
}

function drawParticle(p) {
  const life = Math.max(0, Math.min(1, p.maxT ? p.t / p.maxT : p.t));
  if (p.kind === "text") {
    const color = p.color ?? "#ffd64d";
    ctx.save();
    ctx.globalAlpha = Math.min(1, life * 1.35);
    ctx.textAlign = "center";
    ctx.shadowColor = color;
    ctx.shadowBlur = 16;
    ctx.fillStyle = color;
    ctx.font = `bold ${p.fontSize ?? 28}px Arial`;
    ctx.fillText(p.text, p.x, p.y - (1 - life) * (p.rise ?? 24));
    ctx.restore();
    return;
  }
  if (p.kind === "ring") {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = life * 0.75;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2 + life * 4;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius ?? 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    return;
  }
  if (p.kind === "muzzleFlash") {
    const size = (p.size ?? 18) * (0.6 + life * 0.7);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = life * 0.72;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - size);
    ctx.lineTo(p.x + size * 0.42, p.y + size * 0.25);
    ctx.lineTo(p.x, p.y + size * 0.1);
    ctx.lineTo(p.x - size * 0.42, p.y + size * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  }
  if (p.kind === "impactCore") {
    const radius = (p.radius ?? 6) + (1 - life) * (p.size ?? 24) * 0.28;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = life * 0.68;
    ctx.strokeStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 16;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = life * 0.3;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }
  if (p.kind === "impactBit") {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = life * 0.74;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 9;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.5;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot ?? 0);
    ctx.beginPath();
    ctx.moveTo(-(p.size ?? 4), 0);
    ctx.lineTo(p.size ?? 4, 0);
    ctx.stroke();
    ctx.restore();
    return;
  }
  if (p.kind === "dataShard") {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = life * 0.76;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 11;
    ctx.strokeStyle = p.color;
    ctx.fillStyle = rgbaFromHex(p.color, 0.18 + life * 0.16);
    ctx.lineWidth = 1.5;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot ?? 0);
    const size = p.size ?? 8;
    ctx.fillRect(-size / 2, -size * 0.22, size, size * 0.44);
    ctx.strokeRect(-size / 2, -size * 0.22, size, size * 0.44);
    ctx.globalAlpha = life * 0.28;
    ctx.beginPath();
    ctx.moveTo(-size * 0.8, 0);
    ctx.lineTo(size * 0.8, 0);
    ctx.stroke();
    ctx.restore();
    return;
  }
  if (p.kind === "codeGlyph") {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = life * 0.58;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = p.color;
    ctx.font = `bold ${p.size ?? 10}px Consolas, monospace`;
    ctx.textAlign = "center";
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot ?? 0);
    ctx.fillText(p.text ?? "0", 0, 0);
    ctx.restore();
    return;
  }
  if (p.kind === "damageFume") {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = life * 0.42;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(
      p.x,
      p.y,
      (p.size ?? 5) * (1.1 + (1 - life) * 1.2),
      (p.size ?? 5) * (0.55 + (1 - life) * 0.8),
      Math.sin(p.x + p.y) * 0.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
    return;
  }
  if (p.kind === "threatGlint") {
    const size = p.size ?? 8;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot ?? 0) + (1 - life) * 0.8);
    ctx.globalAlpha = life * 0.58;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(size, 0);
    ctx.moveTo(0, -size * 0.55);
    ctx.lineTo(0, size * 0.55);
    ctx.stroke();
    ctx.globalAlpha = life * 0.22;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    return;
  }
  if (p.kind === "engine" || p.kind === "packetTrace") {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = life * (p.kind === "engine" ? 0.7 : 0.52);
    ctx.shadowColor = p.color;
    ctx.shadowBlur = p.kind === "engine" ? 12 : 8;
    ctx.fillStyle = p.color;
    ctx.translate(p.x, p.y);
    if (p.kind === "packetTrace") {
      ctx.fillRect(-(p.size ?? 2) / 2, -1, p.size ?? 2, 2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, (p.size ?? 2) * (0.8 + (1 - life) * 0.8), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return;
  }
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.min(1, life * 1.25);
  ctx.shadowColor = p.color;
  ctx.shadowBlur = p.kind === "shard" ? 10 : 14;
  ctx.fillStyle = p.color;
  if (p.kind === "shard") {
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot ?? 0);
    ctx.fillRect(-(p.size ?? 8) / 2, -1.5, p.size ?? 8, 3);
  } else {
    ctx.beginPath();
    ctx.arc(p.x, p.y, (p.size ?? 3) + life * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function roughCircle(x, y, r, points) {
  ctx.beginPath();
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const rr = r * (0.75 + ((i * 37) % 9) / 30);
    const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath(); ctx.fill();
}

function drawHud() {
  if (!["playing", "pause"].includes(state)) return;
  const t = performance.now() / 1000;
  meter(24, 18, 230, 13, game.boost / 100, "BOOST", game.boost > 20 ? "#65f3ff" : "#ff4747", true);
  meter(FIELD_W - 254, 18, 230, 13, game.strike / 100, "BUG STRIKE", game.strike >= 100 ? "#9cff57" : "#8c94ff", true);
  if (game.combo > 1) {
    ctx.textAlign = "center";
    const comboScale = 1 + game.hudPulse * 0.12;
    ctx.save();
    ctx.translate(FIELD_W / 2, 30);
    ctx.scale(comboScale, comboScale);
    ctx.font = "bold 18px Arial";
    ctx.shadowColor = "#ffd64d";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#ffd64d";
    ctx.fillText(`COMBO x${game.combo}`, 0, 0);
    ctx.restore();
  }

  const x = HUD_X + 24;
  if (game.hudPulse > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `rgba(101, 243, 255, ${game.hudPulse * 0.05})`;
    ctx.fillRect(HUD_X, 0, HUD_W, H);
    ctx.restore();
  }
  ctx.textAlign = "left";
  ctx.shadowColor = "rgba(101, 243, 255, 0.75)";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#65f3ff";
  ctx.font = "bold 22px Arial";
  ctx.fillText("BUG STRIKE", x, 46);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(101, 243, 255, 0.22)";
  ctx.fillRect(x, 62, HUD_W - 48, 1);

  drawHudReadout(x - 8, 78, HUD_W - 32, 132, t);
  ctx.font = "bold 14px Arial";
  ctx.fillStyle = "#9cff57";
  ctx.fillText("SCORE", x, 98);
  ctx.font = "bold 28px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(String(game.score), x, 128);

  ctx.font = "bold 14px Arial";
  ctx.fillStyle = "#ffd64d";
  ctx.fillText("HIGH SCORE", x, 166);
  ctx.font = "bold 23px Arial";
  ctx.fillStyle = "#fff38a";
  ctx.fillText(String(game.high), x, 194);
  drawPanelBox(x, 224, HUD_W - 48, 86, "#65f3ff", 0.28);
  ctx.font = "bold 14px Arial";
  ctx.fillStyle = "#65f3ff";
  ctx.fillText("LIVES", x + 14, 253);
  ctx.fillStyle = game.lives > 1 ? "#fff" : "#ff4747";
  ctx.font = "bold 34px Arial";
  ctx.fillText(String(game.lives), x + 14, 292);
  drawPips(x + 54, 283, 5, game.lives, game.lives <= 1 ? "#ff4747" : "#65f3ff", t);
  ctx.fillStyle = "#ff8a3d";
  ctx.font = "bold 14px Arial";
  ctx.fillText("BOMBS", x + 126, 253);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 34px Arial";
  ctx.fillText(String(game.bombs), x + 126, 292);
  drawPips(x + 166, 283, 3, game.bombs, "#ff8a3d", t);
  if (debugParams.has("toasttest")) {
    game.combatToast = { text: "ROOTKIT CORE BREACH", color: "#ff8a3d", t: 8, maxT: 8 };
  }
  drawCombatToast(x, 316, HUD_W - 48);

  ctx.font = "bold 14px Arial";
  ctx.fillStyle = "#65f3ff";
  ctx.fillText("ACTIVE PATCHES", x, 358);
  meter(x, 390, HUD_W - 48, 14, game.rapid / 10, `RAPID ${Math.ceil(game.rapid)}`, "#65f3ff");
  meter(x, 438, HUD_W - 48, 14, game.triple / 6, `SPREAD ${Math.ceil(game.triple)}`, "#ffd64d");
  meter(x, 486, HUD_W - 48, 14, game.shield ? 1 : 0, `SHIELD ${game.shield ? "ONLINE" : "OFFLINE"}`, game.shield ? "#9cff57" : "#52606e");
  drawThreatScan(x, 534, HUD_W - 48, 128, t);
  drawTacticalMap(x, 676, HUD_W - 48, 52, t);

  drawPanelBox(x, H - 158, HUD_W - 48, 110, "#9cff57", 0.22);
  ctx.fillStyle = "#9cff57";
  ctx.font = "bold 14px Arial";
  ctx.fillText("RUN STATUS", x + 14, H - 125);
  ctx.fillStyle = "#ddd";
  ctx.font = "bold 16px Arial";
  ctx.fillText(`Stage ${game.stage}`, x + 14, H - 94);
  ctx.fillText(`Kills ${game.kills}`, x + 14, H - 66);
  drawAchievementToast(x, H - 250, HUD_W - 48, t);
}

function drawHudReadout(x, y, w, h, t) {
  ctx.save();
  const bg = ctx.createLinearGradient(x, y, x + w, y + h);
  bg.addColorStop(0, "rgba(101, 243, 255, 0.045)");
  bg.addColorStop(0.5, "rgba(2, 8, 15, 0.02)");
  bg.addColorStop(1, "rgba(156, 255, 87, 0.035)");
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = "rgba(101, 243, 255, 0.05)";
  const sweep = y + ((t * 28) % h);
  ctx.fillRect(x, sweep, w, 9);
  ctx.strokeStyle = "rgba(101, 243, 255, 0.12)";
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.restore();
}

function drawTacticalMap(x, y, w, h, t) {
  const pressure = clamp((game.enemyShots.length / 20) + (game.entities.length / 28) + (game.boss ? 0.45 : 0), 0, 1);
  const accent = game.boss ? "#ff4747" : pressure > 0.5 ? "#ffd64d" : "#65f3ff";
  drawPanelBox(x, y, w, h, accent, 0.16 + pressure * 0.18);

  const plotX = x + 84;
  const plotY = y + 10;
  const plotW = w - 98;
  const plotH = h - 20;
  const mapPoint = (obj) => ({
    x: plotX + clamp((obj.x + obj.w / 2) / FIELD_W, 0, 1) * plotW,
    y: plotY + clamp((obj.y + obj.h / 2) / FIELD_H, 0, 1) * plotH,
  });

  ctx.save();
  ctx.textAlign = "left";
  ctx.fillStyle = accent;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 8;
  ctx.font = "bold 11px Arial";
  ctx.fillText("SIGNAL MAP", x + 12, y + 20);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "bold 9px Arial";
  ctx.fillText(`B${game.entities.length}`, x + 12, y + 38);
  ctx.fillText(`P${game.enemyShots.length}`, x + 45, y + 38);

  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = "rgba(101, 243, 255, 0.12)";
  ctx.strokeRect(plotX + 0.5, plotY + 0.5, plotW - 1, plotH - 1);
  ctx.strokeStyle = "rgba(101, 243, 255, 0.06)";
  for (let i = 1; i < 4; i++) {
    const gx = plotX + (plotW / 4) * i;
    ctx.beginPath();
    ctx.moveTo(gx, plotY);
    ctx.lineTo(gx, plotY + plotH);
    ctx.stroke();
  }
  const sweep = plotX + ((t * 32) % plotW);
  ctx.strokeStyle = rgbaFromHex(accent, "0.32");
  ctx.beginPath();
  ctx.moveTo(sweep, plotY);
  ctx.lineTo(sweep, plotY + plotH);
  ctx.stroke();

  ctx.beginPath();
  ctx.rect(plotX, plotY, plotW, plotH);
  ctx.clip();
  for (const e of game.entities.slice(-18)) {
    const p = mapPoint(e);
    ctx.fillStyle = e.kind === "asteroid" ? "rgba(168, 152, 123, 0.72)" : "rgba(101, 243, 255, 0.78)";
    ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
  }
  for (const s of game.enemyShots.slice(-22)) {
    const p = mapPoint(s);
    ctx.fillStyle = s.homing ? "rgba(255, 214, 77, 0.78)" : "rgba(255, 93, 93, 0.68)";
    ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
  }
  if (game.boss) {
    const p = mapPoint(game.boss);
    ctx.strokeStyle = "rgba(255, 71, 71, 0.86)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4 + Math.sin(t * 6) * 1.5, 0, Math.PI * 2);
    ctx.stroke();
  }
  const playerPoint = mapPoint(game.player);
  ctx.fillStyle = "rgba(156, 255, 87, 0.95)";
  ctx.shadowColor = "#9cff57";
  ctx.shadowBlur = 9;
  ctx.beginPath();
  ctx.arc(playerPoint.x, playerPoint.y, 2.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawThreatScan(x, y, w, h, t) {
  const enemies = game.entities.filter((e) => e.kind === "enemy" && e.hp > 0).length;
  const packets = game.enemyShots.filter((s) => s.hp > 0).length;
  const bossPct = game.boss ? game.boss.hp / game.boss.maxHp : 0;
  const pressure = clamp((enemies * 0.08) + (packets * 0.035) + (game.boss ? 0.32 : 0), 0, 1);
  const accent = game.boss ? "#ff4747" : pressure > 0.55 ? "#ffd64d" : "#65f3ff";

  drawPanelBox(x, y, w, h, accent, 0.2 + pressure * 0.2);
  ctx.save();
  ctx.textAlign = "left";
  ctx.fillStyle = accent;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 9;
  ctx.font = "bold 13px Arial";
  ctx.fillText("THREAT SCAN", x + 14, y + 28);
  ctx.shadowBlur = 0;

  drawScanRow(x + 14, y + 51, w - 28, "BUGS", enemies, Math.min(1, enemies / 10), "#65f3ff", t);
  drawScanRow(x + 14, y + 75, w - 28, "PACKETS", packets, Math.min(1, packets / 18), "#ff8a3d", t + 0.8);
  if (game.boss) {
    drawScanRow(x + 14, y + 99, w - 28, "BOSS", `${Math.ceil(bossPct * 100)}%`, bossPct, "#ff4747", t + 1.4);
  } else {
    drawScanRow(x + 14, y + 99, w - 28, "FIELD", pressure > 0.55 ? "HOT" : "CLEAR", pressure, pressure > 0.55 ? "#ffd64d" : "#9cff57", t + 1.4);
  }

  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = rgbaFromHex(accent, "0.24");
  ctx.beginPath();
  const sweep = x + 12 + ((t * 42) % (w - 24));
  ctx.moveTo(sweep, y + 38);
  ctx.lineTo(sweep + 16, y + h - 14);
  ctx.stroke();
  ctx.restore();
}

function drawScanRow(x, y, w, label, value, pct, color, t) {
  const barX = x + 82;
  const barW = w - 82;
  ctx.fillStyle = "rgba(255,255,255,0.76)";
  ctx.font = "bold 11px Arial";
  ctx.fillText(label, x, y + 4);
  ctx.textAlign = "right";
  ctx.fillStyle = color;
  ctx.fillText(String(value), x + 70, y + 4);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(barX, y - 5, barW, 8);
  const fillW = Math.max(4, barW * clamp(pct, 0, 1));
  const fill = ctx.createLinearGradient(barX, y, barX + barW, y);
  fill.addColorStop(0, color);
  fill.addColorStop(1, "rgba(255,255,255,0.86)");
  ctx.fillStyle = fill;
  ctx.shadowColor = color;
  ctx.shadowBlur = 7 + Math.sin(t * 5) * 2;
  ctx.fillRect(barX, y - 5, fillW, 8);
  ctx.shadowBlur = 0;
}

function drawPips(x, y, max, active, color, t) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < max; i++) {
    const on = i < active;
    ctx.fillStyle = on ? color : "rgba(255,255,255,0.11)";
    ctx.shadowColor = on ? color : "transparent";
    ctx.shadowBlur = on ? 9 + Math.sin(t * 7 + i) * 2 : 0;
    ctx.beginPath();
    ctx.arc(x + i * 15, y, on ? 4.5 : 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function meter(x, y, w, h, pct, label, color, compact = false) {
  ctx.textAlign = "left";
  const amount = Math.max(0, (w - 4) * clamp(pct, 0, 1));
  const t = performance.now() / 1000;
  ctx.save();
  ctx.fillStyle = "rgba(8, 14, 24, 0.88)";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(215, 221, 229, 0.55)";
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  for (let i = x + 8; i < x + w - 4; i += 18) ctx.fillRect(i, y + 2, 1, h - 4);
  if (amount > 0) {
    const fill = ctx.createLinearGradient(x, y, x + w, y);
    fill.addColorStop(0, color);
    fill.addColorStop(0.55, "#ffffff");
    fill.addColorStop(1, color);
    ctx.shadowColor = color;
    ctx.shadowBlur = compact ? 8 : 12;
    ctx.fillStyle = fill;
    ctx.fillRect(x + 2, y + 2, amount, h - 4);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.32)";
    ctx.fillRect(x + 3, y + 3, Math.max(0, amount - 2), Math.max(1, Math.floor((h - 5) / 2)));
    ctx.fillStyle = "rgba(255,255,255,0.48)";
    const sweep = x + 2 + ((t * 34) % Math.max(12, amount));
    if (sweep < x + 2 + amount) ctx.fillRect(sweep, y + 2, 2, h - 4);
  }
  ctx.restore();
  ctx.fillStyle = "#fff"; ctx.font = compact ? "bold 11px Arial" : "bold 12px Arial";
  ctx.shadowColor = color;
  ctx.shadowBlur = compact ? 4 : 6;
  ctx.fillText(label, x, y - 7);
  ctx.shadowBlur = 0;
}

function renderLeaderboardLegacy() {
  const scoreBox = document.getElementById("scores");
  const list = scores();
  scoreBox.innerHTML = list.length ? list.slice(0, 5).map((s) => `<li>${s.name} - ${s.score}</li>`).join("") : "<li>--- no scores yet ---</li>";
  const set = unlocked();
  document.getElementById("achievements").innerHTML = ACHIEVEMENTS.map(([id, name, desc]) => `<li>${set.has(id) ? "✓" : " "} ${name}: ${desc}</li>`).join("");
}

function renderLeaderboard() {
  const scoreBox = document.getElementById("scores");
  const list = scores();
  scoreBox.innerHTML = list.length
    ? list.slice(0, 3).map((s, idx) => `<li><span class="rank">${String(idx + 1).padStart(2, "0")}</span><span>${s.name}</span><strong>${s.score}</strong></li>`).join("")
    : "<li><span class=\"rank\">--</span><span>NO RUNS</span><strong>0</strong></li>";
  const set = unlocked();
  document.getElementById("achievements").innerHTML = ACHIEVEMENTS.map(([id, name, desc]) => {
    const isUnlocked = set.has(id);
    return `<li class="${isUnlocked ? "unlocked" : "locked"}"><span class="rank">${isUnlocked ? "OK" : "--"}</span><span>${name}</span><small>${desc}</small></li>`;
  }).join("");
}

function loop(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function updatePointerFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = W / rect.width;
  const scaleY = H / rect.height;
  const rawX = (e.clientX - rect.left) * scaleX;
  pointer.x = clamp(rawX, 0, FIELD_W);
  pointer.y = clamp((e.clientY - rect.top) * scaleY, 0, FIELD_H);
  pointer.active = state === "playing" && rawX <= FIELD_W;
}

document.addEventListener("keydown", (e) => {
  unlockAudio();
  keys.add(e.code);
  if (state === "playing" && core.shouldHandleSpecialKey({ code: e.code, repeat: e.repeat })) {
    bugStrike();
    e.preventDefault();
  }
  if (e.code === "Escape" && state === "playing") { previousPanel = "pause"; setState("pause"); }
  else if (e.code === "Escape" && state === "pause") setState("playing");
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyB"].includes(e.code)) e.preventDefault();
});
document.addEventListener("keyup", (e) => keys.delete(e.code));

canvas.addEventListener("pointermove", (e) => {
  updatePointerFromEvent(e);
});

canvas.addEventListener("pointerdown", (e) => {
  unlockAudio();
  if (state !== "playing") return;
  updatePointerFromEvent(e);
  canvas.setPointerCapture?.(e.pointerId);
  if (e.button === 0) pointer.fire = true;
  if (e.button === 2) bugStrike();
  if (e.button === 0 || e.button === 2) e.preventDefault();
});

canvas.addEventListener("pointerup", (e) => {
  if (e.button === 0) pointer.fire = false;
});

canvas.addEventListener("pointerleave", () => {
  pointer.fire = false;
  pointer.active = false;
});

canvas.addEventListener("contextmenu", (e) => {
  if (state === "playing") e.preventDefault();
});

document.querySelectorAll("[data-touch-action]").forEach((button) => {
  button.addEventListener("pointerdown", (e) => {
    unlockAudio();
    const action = button.dataset.touchAction;
    if (action === "fire") pointer.fire = true;
    if (action === "bomb" && state === "playing") bugStrike();
    if (action === "pause" && state === "playing") { previousPanel = "pause"; setState("pause"); }
    e.preventDefault();
  });
  button.addEventListener("pointerup", (e) => {
    if (button.dataset.touchAction === "fire") pointer.fire = false;
    e.preventDefault();
  });
  button.addEventListener("pointercancel", () => {
    if (button.dataset.touchAction === "fire") pointer.fire = false;
  });
  button.addEventListener("lostpointercapture", () => {
    if (button.dataset.touchAction === "fire") pointer.fire = false;
  });
});

document.addEventListener("click", (e) => {
  unlockAudio();
  const action = e.target?.dataset?.action;
  if (!action) return;
  if (action === "start") { resetGame(); setState("playing"); }
  if (action === "resume") setState("playing");
  if (action === "settings") { previousPanel = state; setState("settings"); }
  if (action === "leaderboard") { previousPanel = state; setState("leaderboard"); }
  if (action === "menu") setState("menu");
  if (action === "back") setState(previousPanel === "pause" ? "pause" : previousPanel);
  if (action === "save-score") {
    const name = (document.getElementById("initialsInput").value || "AAA").toUpperCase().replace(/[^A-Z]/g, "").padEnd(3, "A").slice(0, 3);
    writeJson(STORAGE.scores, [...scores(), { name, score: game.score }].sort((a, b) => b.score - a.score).slice(0, 10));
    document.getElementById("gameOverScore").textContent = `Final Score: ${game.score}`;
    setState("gameOver");
  }
  if (action === "skip-score") { document.getElementById("gameOverScore").textContent = `Final Score: ${game.score}`; setState("gameOver"); }
});

document.getElementById("musicVolume")?.addEventListener("input", () => {
  saveSettings();
  updateRangeFill(document.getElementById("musicVolume"));
  updateMusicVolume();
});
document.getElementById("sfxVolume")?.addEventListener("input", (e) => {
  saveSettings();
  updateRangeFill(e.currentTarget);
});

CanvasRenderingContext2D.prototype.roundRect ??= function(x, y, w, h, r) {
  this.beginPath(); this.moveTo(x + r, y); this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r); this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r); this.closePath(); return this;
};

fitShellToCanvas();
window.addEventListener("resize", fitShellToCanvas);
initSettings();
syncStateShell();
exposeDebugState();
game.high = scores()[0]?.score ?? 0;
window.loadImageAssets?.().then((images) => {
  images.forEach((img, key) => loadedImages.set(key, img));
});
window.loadAudioAssets?.().then((sounds) => {
  sounds.forEach((sound, key) => loadedSounds.set(key, sound));
});
if (debugParams.has("playtest")) {
  resetGame();
  spawnAsteroid();
  game.entities.forEach((entity, idx) => {
    if (entity.kind === "asteroid") entity.y += 270;
    else entity.y += 115 + idx * 6;
  });
  game.missiles.push({ x: game.player.x + 25, y: game.player.y - 45, w: 10, h: 30, vx: 0, vy: -14, age: 0.08 });
  setState("playing");
}
if (debugParams.has("bossplaytest")) {
  const bossNames = ["adware", "trojan", "worm", "rootkit"];
  const requested = debugParams.get("bossplaytest");
  const idx = Math.max(0, bossNames.indexOf(requested));
  resetGame();
  game.entities = [];
  game.bossKills = Number(debugParams.get("kills") ?? idx);
  game.stage = Number(debugParams.get("stage") ?? game.stage);
  spawnBoss(idx);
  game.boss.y = game.boss.anchorY;
  game.boss.x = FIELD_W / 2 - game.boss.w / 2;
  game.boss.vx = 0;
  setState("playing");
}
if (debugParams.has("poweruptest")) {
  const types = ["shield", "rapid", "triple", "laser", "mega", "life", "bomb", "score", "coin", "random"];
  resetGame();
  game.entities = [];
  game.spawn = 999;
  game.asteroid = 999;
  game.formation = 999;
  game.powerups = types.map((type, idx) => ({
    type,
    x: 275 + (idx % 4) * 115,
    y: 170 + Math.floor(idx / 4) * 105,
    w: 46,
    h: 46,
    phase: idx * 0.45,
    static: true,
  }));
  setState("playing");
}
if (debugParams.has("enemyshottest")) {
  resetGame();
  game.entities = [];
  game.missiles = [];
  game.enemyShots = Array.from({ length: 9 }, (_, idx) => ({
    x: 275 + (idx % 3) * 115,
    y: 170 + Math.floor(idx / 3) * 110,
    w: 24,
    h: 64,
    vy: 0,
    vx: 0,
    frame: idx % 3,
    age: 0,
    hp: 3 + (idx % 2),
    homing: idx % 3 === 1,
    hitFlash: idx % 3 === 2 ? 1 : 0,
  }));
  game.spawn = 999;
  game.asteroid = 999;
  game.formation = 999;
  setState("playing");
}
if (debugParams.has("impacttest")) {
  resetGame();
  game.entities = [
    { kind: "enemy", type: "terminid", x: FIELD_W / 2 - 115, y: 185, w: 50, h: 70, hp: 3, maxHp: 3, vx: 0, vy: 0, fire: 999, phase: 0 },
    { kind: "asteroid", x: FIELD_W / 2 + 65, y: 195, w: 70, h: 70, hp: 3, maxHp: 3, vx: 0, vy: 0, spin: 0, rot: 18 },
  ];
  game.enemyShots = [
    { x: FIELD_W / 2 - 16, y: 285, w: 15, h: 40, vy: 0, vx: 0, frame: 0, age: 0, hp: 2, homing: false, hitFlash: 1 },
    { x: FIELD_W / 2 + 46, y: 285, w: 15, h: 40, vy: 0, vx: 0, frame: 1, age: 0, hp: 3, homing: true, hitFlash: 1 },
  ];
  game.missiles = [];
  game.powerups = [];
  emitMuzzleFlash(game.player.x + game.player.w / 2, game.player.y - 12, 1.2);
  emitImpactFeedback(FIELD_W / 2 - 90, 225, "#65f3ff", 1.2);
  emitImpactFeedback(FIELD_W / 2 + 100, 235, "#fff1bf", 1.1);
  emitImpactFeedback(FIELD_W / 2, 305, "#ff6868", 0.85);
  emitImpactFeedback(FIELD_W / 2 + 58, 305, "#ffdf47", 1.1);
  game.spawn = 999;
  game.asteroid = 999;
  game.formation = 999;
  setState("playing");
}
if (debugParams.has("spawntest")) {
  resetGame();
  game.entities = [];
  game.enemyShots = [];
  game.missiles = [];
  game.powerups = [];
  game.spawn = 999;
  game.asteroid = 999;
  game.formation = 999;
  spawnEnemy(FIELD_W / 2 - 130, 152);
  spawnEnemy(FIELD_W / 2 - 28, 118);
  spawnAsteroid();
  const asteroid = game.entities[game.entities.length - 1];
  asteroid.x = FIELD_W / 2 + 82;
  asteroid.y = 174;
  asteroid.vx = 0;
  asteroid.vy = 0;
  spawnBoss(3);
  game.boss.y = 86;
  game.boss.x = FIELD_W / 2 - game.boss.w / 2 + 210;
  game.boss.vx = 0;
  setState("playing");
}
if (debugParams.has("breakuptest")) {
  resetGame();
  game.entities = [];
  game.enemyShots = [];
  game.missiles = [];
  game.powerups = [];
  game.spawn = 999;
  game.asteroid = 999;
  game.formation = 999;
  emitDefeatBreakup(FIELD_W / 2 - 155, 210, "#ff8a3d", 1);
  emitDefeatBreakup(FIELD_W / 2 + 5, 245, "#65f3ff", 1.25);
  emitDefeatBreakup(FIELD_W / 2 + 165, 205, "#ffef7d", 1.8);
  burst(FIELD_W / 2 - 155, 210, "#ff8a3d", 12);
  burst(FIELD_W / 2 + 165, 205, "#ffef7d", 18);
  setState("playing");
}
if (debugParams.has("achievementtest")) {
  resetGame();
  game.entities = [];
  game.enemyShots = [];
  game.missiles = [];
  game.powerups = [];
  game.spawn = 999;
  game.asteroid = 999;
  game.formation = 999;
  game.combo = 1000;
  addAchievementToast("CHAIN MASTER", "Reach a 1,000x combo");
  setState("playing");
}
if (debugParams.has("toasttest")) {
  resetGame();
  game.entities = [];
  game.enemyShots = [];
  game.missiles = [];
  game.powerups = [];
  game.spawn = 999;
  game.asteroid = 999;
  game.formation = 999;
  game.combatToast = { text: "ROOTKIT CORE BREACH", color: "#ff8a3d", t: 8, maxT: 8 };
  setState("playing");
}
if (debugParams.has("bossphasetest")) {
  resetGame();
  game.lives = 99;
  game.player.inv = 999;
  game.entities = [];
  game.enemyShots = [];
  game.missiles = [];
  game.powerups = [];
  game.spawn = 999;
  game.asteroid = 999;
  game.formation = 999;
  spawnBoss(Number(debugParams.get("boss") ?? 3));
  game.boss.y = 118;
  game.boss.x = FIELD_W / 2 - game.boss.w / 2;
  game.boss.vx = 0;
  game.boss.hp = Math.floor(game.boss.maxHp * 0.45);
  game.boss.phase = 2;
  triggerBossPhaseSurge(game.boss);
  game.combatToast = { text: `${game.boss.name} CORE BREACH`, color: "#ff8a3d", t: 8, maxT: 8 };
  setState("playing");
}
if (debugParams.has("bombtest")) {
  resetGame();
  game.entities = [];
  game.missiles = [];
  game.enemyShots = [];
  game.powerups = [];
  game.bombs = 3;
  game.strike = 0;
  game.spawn = 999;
  game.asteroid = 999;
  game.formation = 999;
  setState("playing");
}
if (debugParams.has("shieldtest")) {
  resetGame();
  game.entities = [];
  game.missiles = [];
  game.enemyShots = [];
  game.powerups = [];
  game.shield = true;
  game.spawn = 999;
  game.asteroid = 999;
  game.formation = 999;
  setState("playing");
}
if (debugParams.has("pointertest")) {
  resetGame();
  game.entities = [];
  game.enemyShots = [];
  game.powerups = [];
  game.missiles = [];
  game.spawn = 999;
  game.asteroid = 999;
  game.formation = 999;
  pointer.active = true;
  pointer.fire = true;
  pointer.x = game.player.x + game.player.w / 2;
  pointer.y = game.player.y + game.player.h / 2;
  setState("playing");
}
if (debugParams.has("damagetest")) {
  resetGame();
  game.lives = 1;
  game.player.inv = 90;
  game.entities = [];
  game.enemyShots = [];
  game.powerups = [];
  game.spawn = 999;
  game.asteroid = 999;
  game.formation = 999;
  setState("playing");
}
if (debugParams.has("paneltest")) {
  const panel = debugParams.get("paneltest");
  const allowedPanels = new Set(["pause", "settings", "leaderboard", "initials", "gameOver"]);
  if (allowedPanels.has(panel)) {
    resetGame();
    document.getElementById("finalScore").textContent = "Score: 1234567";
    document.getElementById("gameOverScore").textContent = "Final Score: 1234567";
    previousPanel = "menu";
    setState(panel);
  }
}
requestAnimationFrame(loop);
