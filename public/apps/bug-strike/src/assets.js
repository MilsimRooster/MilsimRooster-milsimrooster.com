(function initAssets(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    Object.assign(root, factory());
  }
})(typeof globalThis !== "undefined" ? globalThis : window, function createAssets() {
  const image = (key, file, width, height, group) => ({ key, file, width, height, group });
  const sound = (key, file, group) => ({ key, file, group });

  const ASSET_MANIFEST = {
    basePath: "assets/",
    audioPath: "assets/audio/",
    images: [
      image("debugger.normal", "debugger_normal.png", 60, 90, "player"),
      image("debugger.boost", "debugger_boost.png", 60, 90, "player"),
      image("debugger.damaged", "debugger_damaged.png", 60, 90, "player"),
      image("packet.shot", "packet_shot.png", 10, 30, "projectiles"),
      image("packet.shot.0", "packet_shot_01.png", 10, 30, "projectiles"),
      image("packet.shot.1", "packet_shot_02.png", 10, 30, "projectiles"),
      image("packet.shot.2", "packet_shot_03.png", 10, 30, "projectiles"),
      image("bug.malware.0", "bug_malware0.png", 50, 70, "enemies"),
      image("bug.malware.1", "bug_malware1.png", 50, 70, "enemies"),
      image("bug.malware.2", "bug_malware2.png", 50, 70, "enemies"),
      image("player.normal", "eagle1_normal.png", 60, 90, "legacy-player"),
      image("player.boost", "eagle1_boost.png", 60, 90, "legacy-player"),
      image("player.damaged", "eagle1_damaged.png", 60, 90, "legacy-player"),
      image("missile.player", "missle.png", 10, 30, "legacy-projectiles"),
      image("enemy.terminid.0", "terminid.png", 50, 70, "legacy-enemies"),
      image("enemy.terminid.1", "terminid1.png", 50, 70, "legacy-enemies"),
      image("enemy.terminid.2", "terminid2.png", 50, 70, "legacy-enemies"),
      image("enemy.hunter.0", "hunter.png", 50, 70, "enemies"),
      image("enemy.hunter.1", "hunter1.png", 50, 70, "enemies"),
      image("enemy.hunter.2", "hunter2.png", 50, 70, "enemies"),
      image("bug.glitch.0", "bug_glitch0.png", 50, 70, "enemies"),
      image("bug.glitch.1", "bug_glitch1.png", 50, 70, "enemies"),
      image("bug.glitch.2", "bug_glitch2.png", 50, 70, "enemies"),
      image("bug.kernel.0", "bug_kernel0.png", 50, 70, "enemies"),
      image("bug.kernel.1", "bug_kernel1.png", 50, 70, "enemies"),
      image("bug.kernel.2", "bug_kernel2.png", 50, 70, "enemies"),
      image("enemy.automaton.0", "automaton.png", 50, 70, "legacy-enemies"),
      image("enemy.automaton.1", "automaton1.png", 50, 70, "legacy-enemies"),
      image("enemy.automaton.2", "automaton2.png", 50, 70, "legacy-enemies"),
      image("enemy.illuminate.0", "illuminate.png", 50, 70, "legacy-enemies"),
      image("enemy.illuminate.1", "illuminate1.png", 50, 70, "legacy-enemies"),
      image("enemy.illuminate.2", "illuminate2.png", 50, 70, "legacy-enemies"),
      image("projectile.enemy.0", "enemy_blast1.png", 15, 40, "projectiles"),
      image("projectile.enemy.1", "enemy_blast2.png", 15, 40, "projectiles"),
      image("projectile.enemy.2", "enemy_blast3.png", 15, 40, "projectiles"),
      ...Array.from({ length: 6 }, (_, i) => image(`asteroid.${i}`, `aster${i + 1}.png`, 70, 70, "asteroids")),
      image("boss.adware.normal", "boss_adware_normal.png", 140, 210, "bosses"),
      image("boss.adware.damaged", "boss_adware_damaged.png", 140, 210, "bosses"),
      image("boss.trojan.normal", "boss_trojan_normal.png", 140, 210, "bosses"),
      image("boss.trojan.damaged", "boss_trojan_damaged.png", 140, 210, "bosses"),
      image("boss.worm.normal", "boss_worm_normal.png", 140, 210, "bosses"),
      image("boss.worm.damaged", "boss_worm_damaged.png", 140, 210, "bosses"),
      image("boss.rootkit.normal", "boss_rootkit_normal.png", 140, 210, "bosses"),
      image("boss.rootkit.damaged", "boss_rootkit_damaged.png", 140, 210, "bosses"),
      image("boss.charger.normal", "boss_charger_normal.png", 140, 210, "legacy-bosses"),
      image("boss.charger.damaged", "boss_charger_damaged.png", 140, 210, "legacy-bosses"),
      image("boss.brood.normal", "boss_brood_normal.png", 140, 210, "legacy-bosses"),
      image("boss.brood.damaged", "boss_brood_damaged.png", 140, 210, "legacy-bosses"),
      image("boss.summoner.normal", "boss_summoner_normal.png", 140, 210, "legacy-bosses"),
      image("boss.summoner.damaged", "boss_summoner_damaged.png", 140, 210, "legacy-bosses"),
      image("boss.fortress.normal", "boss_fortress_normal.png", 140, 210, "legacy-bosses"),
      image("boss.fortress.damaged", "boss_fortress_damaged.png", 140, 210, "legacy-bosses"),
      image("boss.fallback.normal", "boss_normal.png", 140, 210, "bosses"),
      image("boss.fallback.damaged", "boss_damaged.png", 140, 210, "bosses"),
      image("miniboss.0.normal", "boss11.png", 70, 105, "bosses"),
      image("miniboss.0.damaged", "boss12.png", 70, 105, "bosses"),
      image("miniboss.1.normal", "boss21.png", 75, 112, "bosses"),
      image("miniboss.1.damaged", "boss22.png", 75, 112, "bosses"),
      image("miniboss.2.normal", "boss31.png", 65, 97, "bosses"),
      image("miniboss.2.damaged", "boss32.png", 65, 97, "bosses"),
      image("dropship.small", "dropship_small.png", 100, 150, "dropships"),
      image("dropship.large", "dropship_large.png", 120, 150, "dropships"),
      image("dropship.0", "dropship.png", 100, 150, "legacy-dropships"),
      image("dropship.1", "dropship1.png", 100, 150, "legacy-dropships"),
      image("dropship.2", "dropship2.png", 100, 150, "legacy-dropships"),
      image("hud.life", "lives_icon.png", 25, 25, "ui"),
      image("powerup.rapid", "powerup_rapid.png", 35, 35, "powerups"),
      image("powerup.shield", "powerup_shield.png", 35, 35, "powerups"),
      image("powerup.life", "powerup_life.png", 35, 35, "powerups"),
      image("powerup.bomb", "powerup_bomb.png", 35, 35, "powerups"),
      image("powerup.triple", "powerup_spread.png", 35, 35, "powerups"),
      image("powerup.laser", "powerup_laser.png", 35, 35, "powerups"),
      image("powerup.mega", "powerup_mega.png", 35, 35, "powerups"),
      image("powerup.score", "powerup_score.png", 35, 35, "powerups"),
      image("powerup.coin", "powerup_coin.png", 35, 35, "powerups"),
      image("powerup.random", "powerup_random.png", 35, 35, "powerups"),
      image("powerup.legacy.life", "powerup_extra_life.png", 35, 35, "legacy-powerups"),
      image("powerup.legacy.bomb", "powerup_extra_power_bomb.png", 35, 35, "legacy-powerups"),
      image("powerup.legacy.triple", "trishot.png", 35, 35, "legacy-powerups"),
      image("ui.startMenu", "start_menu.png", 800, 576, "ui"),
      image("shield.overlay", "shield.png", 80, 110, "player"),
    ],
    audio: {
      sfx: [
        sound("player.shoot.0", "player_shoot1.wav", "player"),
        sound("player.shoot.1", "player_shoot2.wav", "player"),
        sound("player.hit.0", "player_hit1.wav", "player"),
        sound("player.hit.1", "player_hit2.wav", "player"),
        sound("explosion.0", "explosion1.wav", "combat"),
        sound("explosion.1", "explosion2.wav", "combat"),
        sound("boost", "boost.wav", "player"),
        sound("special.bugStrike", "Eagle_strike_activation.wav", "player"),
        ...Array.from({ length: 6 }, (_, i) => sound(`pickup.${i}`, `power_up${i + 1}.wav`, "powerups")),
      ],
      music: Array.from({ length: 6 }, (_, i) => sound(`music.${i}`, `background_music${i + 1}.wav`, "music")),
    },
  };

  function loadImageAssets(manifest = ASSET_MANIFEST) {
    if (typeof Image === "undefined") return Promise.resolve(new Map());
    const loaded = new Map();
    return Promise.all(manifest.images.map((asset) => new Promise((resolve) => {
      const img = new Image(asset.width, asset.height);
      img.onload = () => {
        loaded.set(asset.key, img);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = `${manifest.basePath}${asset.file}`;
    }))).then(() => loaded);
  }

  function loadAudioAssets(manifest = ASSET_MANIFEST) {
    if (typeof Audio === "undefined") return Promise.resolve(new Map());
    const loaded = new Map();
    const assets = [...manifest.audio.sfx, ...manifest.audio.music];
    assets.forEach((asset) => {
      const audio = new Audio(`${manifest.audioPath}${asset.file}`);
      audio.preload = "auto";
      loaded.set(asset.key, audio);
      audio.load();
    });
    return Promise.resolve(loaded);
  }

  return { ASSET_MANIFEST, loadImageAssets, loadAudioAssets };
});
