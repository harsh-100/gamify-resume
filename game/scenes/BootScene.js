import Phaser from "phaser";
import { SCENES, COLORS, GAME_WIDTH, GAME_HEIGHT } from "../config/constants";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENES.BOOT);
  }

  preload() {
    this.load.spritesheet("player", "/assets/sprites/player.png", {
      frameWidth: 150,
      frameHeight: 240,
    });

    this.load.audio("bgm-main", [
      "/assets/audio/bgm.mp3",
      "/assets/audio/bgm.ogg",
    ]);

    this.load.audio("sfx-collect", [
      "/assets/audio/sfx-collect.mp3",
      "/assets/audio/sfx-collect.ogg",
    ]);
    this.load.audio("sfx-jump", [
      "/assets/audio/sfx-jump.mp3",
      "/assets/audio/sfx-jump.ogg",
    ]);
    this.load.audio("sfx-hit", [
      "/assets/audio/sfx-hit.mp3",
      "/assets/audio/sfx-hit.ogg",
    ]);
    this.load.audio("sfx-win", [
      "/assets/audio/sfx-win.mp3",
      "/assets/audio/sfx-win.ogg",
    ]);

    this.load.on("loaderror", (file) => {
      console.warn("[gamify] asset failed to load:", file.key, file.src);
    });

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "Loading...", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: COLORS.textMuted,
      })
      .setOrigin(0.5);
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.bg);

    this.anims.create({
      key: "player-idle",
      frames: [{ key: "player", frame: 0 }],
      frameRate: 1,
    });

    this.anims.create({
      key: "player-walk",
      frames: this.anims.generateFrameNumbers("player", { start: 1, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "player-jump",
      frames: [{ key: "player", frame: 6 }],
      frameRate: 1,
    });

    this.anims.create({
      key: "player-fall",
      frames: [{ key: "player", frame: 7 }],
      frameRate: 1,
    });

    this.time.delayedCall(100, () => this.scene.start(SCENES.MENU));
  }
}
