(function initCore(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.BugStrikeCore = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : window, function createCore() {
  const TUNING = Object.freeze({
    playerSpeed: 370,
    boostSpeed: 660,
    boostDrain: 25,
    boostRecharge: 22,
    strikeRecharge: 8,
    baseFireRate: 0.16,
    rapidFireRate: 0.065,
    enemySpawnBase: 0.82,
    enemySpawnStep: 0.054,
    enemySpawnMin: 0.34,
    asteroidMin: 2.6,
    asteroidMax: 4.4,
    formationMin: 7.5,
    formationMax: 12,
    comboWindow: 5,
    maxReserveLives: 5,
    shieldInvFrames: 70,
    hitInvFrames: 120,
  });

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function scoreForKill(basePoints, combo) {
    const multiplier = Math.min(4, 1 + combo * 0.25);
    return Math.floor(basePoints * multiplier);
  }

  function playerDelta({ x, y, boosting, dt }) {
    const magnitude = Math.hypot(x, y);
    if (magnitude === 0) return { dx: 0, dy: 0 };
    const speed = boosting ? TUNING.boostSpeed : TUNING.playerSpeed;
    return {
      dx: (x / magnitude) * speed * dt,
      dy: (y / magnitude) * speed * dt,
    };
  }

  function playerSpriteKey({ boosting, lives }) {
    if (boosting) return "debugger.boost";
    if (lives <= 1) return "debugger.damaged";
    return "debugger.normal";
  }

  function keyboardControlState(codes) {
    const pressed = codes instanceof Set ? (code) => codes.has(code) : (code) => codes.includes(code);
    return {
      x: (pressed("ArrowRight") || pressed("KeyD") ? 1 : 0) - (pressed("ArrowLeft") || pressed("KeyA") ? 1 : 0),
      y: (pressed("ArrowDown") || pressed("KeyS") ? 1 : 0) - (pressed("ArrowUp") ? 1 : 0),
      boost: pressed("KeyW") || pressed("ShiftLeft") || pressed("ShiftRight"),
      fire: pressed("Space"),
    };
  }

  function hybridLayout({ canvasWidth, canvasHeight, sideHudWidth }) {
    const hudWidth = Math.max(0, Math.min(sideHudWidth, canvasWidth));
    return {
      fieldWidth: canvasWidth - hudWidth,
      fieldHeight: canvasHeight,
      hudX: canvasWidth - hudWidth,
      hudWidth,
    };
  }

  function nextEnemySpawnDelay(stage) {
    return Number(clamp(TUNING.enemySpawnBase - stage * TUNING.enemySpawnStep, TUNING.enemySpawnMin, TUNING.enemySpawnBase).toFixed(2));
  }

  function enemyProfile(stage) {
    const tier = stage % 3;
    const hp = tier === 0 ? 1 : tier === 1 ? 2 : 3;
    const earlyRamp = Math.min(stage, 10) * 0.24;
    const lateRamp = Math.max(0, stage - 10) * 0.045;
    return {
      hp,
      vy: Number(clamp(2.8 + earlyRamp + lateRamp, 2.8, 6.1).toFixed(2)),
      vxMax: 0.7,
    };
  }

  function applyPlayerDamage(playerState) {
    if (playerState.inv > 0) {
      return { lives: playerState.lives, shield: playerState.shield, inv: playerState.inv, gameOver: false, absorbed: false };
    }
    if (playerState.shield) {
      return { lives: playerState.lives, shield: false, inv: TUNING.shieldInvFrames, gameOver: false, absorbed: true };
    }
    const lives = Math.max(0, playerState.lives - 1);
    return { lives, shield: false, inv: TUNING.hitInvFrames, gameOver: lives <= 0, absorbed: false };
  }

  function isAchievementReached({ id, kills, bossKills, combo }) {
    const target = Number(id.split("_")[1]);
    if (id.startsWith("kills")) return kills >= target;
    if (id.startsWith("boss")) return bossKills >= target;
    if (id.startsWith("combo")) return combo >= target;
    return false;
  }

  function isNewPress(wasPressed, pressed) {
    return Boolean(pressed && !wasPressed);
  }

  function shouldHandleSpecialKey(eventState) {
    return (eventState.code === "ControlLeft" || eventState.code === "ControlRight" || eventState.code === "KeyB") && !eventState.repeat;
  }

  function shouldDropPowerup({ forced = false, roll = Math.random(), combo = 0, misses = 0 }) {
    if (forced) return true;
    if (misses >= 8) return true;
    const chance = Math.min(0.9, 0.18 + combo * 0.035 + misses * 0.08);
    return roll <= chance;
  }

  function choosePowerupType({ roll = Math.random(), lives = 3, bombs = 0 }) {
    const table = [
      ["rapid", 0.34],
      ["shield", 0.31],
      ["triple", 0.08],
      ["bomb", bombs >= 3 ? 0.12 : 0.24],
      ["life", lives <= 2 ? 0.03 : 0],
    ];
    const total = table.reduce((sum, [, weight]) => sum + weight, 0);
    let cursor = clamp(roll, 0, 0.999999) * total;
    for (const [type, weight] of table) {
      cursor -= weight;
      if (cursor <= 0 && weight > 0) return type;
    }
    return "shield";
  }

  function applyLifePickup(lives) {
    return Math.min(TUNING.maxReserveLives, lives + 1);
  }

  function bossProfile({ stage, bossIndex, bossKills }) {
    const hp = 900 + stage * 170 + bossKills * 110 + bossIndex * 130;
    const fireDelay = Math.max(34, Math.round(65 - stage * 0.7 - bossKills * 1.8));
    const pressure = bossKills + Math.floor(stage / 8) + bossIndex;
    const anchorY = Math.min(190, 55 + pressure * 10);
    const yDrift = Math.min(58, 10 + pressure * 3);
    return { hp, fireDelay, anchorY, yDrift };
  }

  function damageHostileShot({ hp = 1, damage = 1 }) {
    const nextHp = Math.max(0, hp - damage);
    return { hp: nextHp, destroyed: nextHp <= 0 };
  }

  function packetDisruptsShot(packet, shot, radius = 22) {
    const expanded = {
      x: packet.x - radius,
      y: packet.y - radius,
      w: packet.w + radius * 2,
      h: packet.h + radius * 2,
    };
    return expanded.x < shot.x + shot.w && expanded.x + expanded.w > shot.x && expanded.y < shot.y + shot.h && expanded.y + expanded.h > shot.y;
  }

  function homingShotVx({ x, targetX, vx = 0, turnRate = 0.06, maxVx = 1.2 }) {
    const direction = targetX === x ? 0 : Math.sign(targetX - x);
    return Number(clamp(vx + direction * turnRate, -maxVx, maxVx).toFixed(3));
  }

  function addBombCharge(bombs, maxBombs = 3) {
    return Math.min(maxBombs, bombs + 1);
  }

  function applySpecialCharge(specialState) {
    if (specialState.bombs > 0) {
      return { canFire: true, strike: specialState.strike, bombs: specialState.bombs - 1, source: "bomb" };
    }
    if (specialState.strike >= 100) {
      return { canFire: true, strike: 0, bombs: 0, source: "strike" };
    }
    return { canFire: false, strike: specialState.strike, bombs: specialState.bombs, source: null };
  }

  function shieldAuraLayers(time) {
    return [0, 1, 2].map((idx) => {
      const wave = (Math.sin(time * 5.2 + idx * 1.7) + 1) / 2;
      return {
        rx: [47, 55, 63][idx],
        ry: [57, 66, 74][idx],
        alpha: Number((0.18 + wave * [0.22, 0.16, 0.1][idx]).toFixed(3)),
        lineWidth: [4, 3, 2][idx],
      };
    });
  }

  return {
    TUNING,
    clamp,
    scoreForKill,
    playerDelta,
    playerSpriteKey,
    keyboardControlState,
    hybridLayout,
    nextEnemySpawnDelay,
    enemyProfile,
    applyPlayerDamage,
    isAchievementReached,
    isNewPress,
    shouldHandleSpecialKey,
    shouldDropPowerup,
    choosePowerupType,
    applyLifePickup,
    bossProfile,
    damageHostileShot,
    packetDisruptsShot,
    homingShotVx,
    addBombCharge,
    applySpecialCharge,
    shieldAuraLayers,
  };
});
