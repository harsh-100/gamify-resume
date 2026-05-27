import Phaser from "phaser";
import { SCENES, COLORS, GAME_WIDTH, GAME_HEIGHT } from "../config/constants";
import { getNextLevel } from "../levels";
import { startBgm } from "../audio/AudioManager";
import { isReduceMotion } from "../state/settings";

const PETAL_COLORS = [0xff6fa3, 0xf4d35e, 0x4cc9f0, 0xa6e22e, 0xff9d5c];
const AUTO_ADVANCE_MS = 2200;

export default class StoryCardScene extends Phaser.Scene {
  constructor() {
    super(SCENES.STORY);
  }

  init(data) {
    this.level = data.level;
    this.progress = data.progress;
    this.collectedThisRun = data.collectedThisRun || [];
  }

  create() {
    startBgm(this);
    this.advanced = false;
    this.cameras.main.setBackgroundColor(0x0b0d1a);

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.4);

    if (!isReduceMotion()) this.spawnPetalRain();

    const cardW = 720;
    const cardH = 420;
    const cardY = (GAME_HEIGHT - cardH) / 2;

    this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, cardW, cardH, 0x141728, 0.96)
      .setStrokeStyle(2, 0x4cc9f0)
      .setDepth(10);

    const banner = this.add
      .text(GAME_WIDTH / 2, cardY + 32, "✦  CHAPTER COMPLETE  ✦", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: COLORS.accent,
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(11);

    this.tweens.add({
      targets: banner,
      scale: 1.06,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.add
      .text(GAME_WIDTH / 2, cardY + 64, this.level.story.title, {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(11);

    this.add
      .text(GAME_WIDTH / 2, cardY + 104, this.level.story.body.join("\n\n"), {
        fontFamily: "monospace",
        fontSize: "13px",
        color: COLORS.textMuted,
        wordWrap: { width: cardW - 80 },
        lineSpacing: 4,
      })
      .setOrigin(0.5, 0)
      .setDepth(11);

    const unique = Array.from(new Set(this.collectedThisRun));
    const skillsHeader =
      unique.length > 0
        ? `Skills acquired (${unique.length})`
        : "No skills collected this run";
    this.add
      .text(GAME_WIDTH / 2, cardY + cardH - 110, skillsHeader, {
        fontFamily: "monospace",
        fontSize: "12px",
        color: COLORS.textMuted,
      })
      .setOrigin(0.5)
      .setDepth(11);

    if (unique.length > 0) {
      this.add
        .text(GAME_WIDTH / 2, cardY + cardH - 88, unique.join("   •   "), {
          fontFamily: "monospace",
          fontSize: "14px",
          color: COLORS.accent,
          fontStyle: "bold",
          wordWrap: { width: cardW - 60 },
          align: "center",
        })
        .setOrigin(0.5, 0)
        .setDepth(11);
    }

    const next = getNextLevel(this.level.key);

    const primary = next ? `Next: ${this.short(next.title)}  ▸` : "Back to menu  ▸";
    const primaryBtn = this.add
      .text(GAME_WIDTH / 2 + 90, cardY + cardH - 36, primary, {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#0b0d1a",
        backgroundColor: "#4cc9f0",
        padding: { x: 14, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(11);
    primaryBtn.on("pointerover", () => primaryBtn.setStyle({ backgroundColor: "#ffffff" }));
    primaryBtn.on("pointerout", () => primaryBtn.setStyle({ backgroundColor: "#4cc9f0" }));
    primaryBtn.on("pointerdown", () => this.goToNext(next));

    const menuBtn = this.add
      .text(GAME_WIDTH / 2 - 110, cardY + cardH - 36, "◂ Menu", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#ffffff",
        backgroundColor: "rgba(255,255,255,0.08)",
        padding: { x: 12, y: 7 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(11);
    menuBtn.on("pointerdown", () => {
      this.advanced = true;
      this.scene.start(SCENES.MENU);
    });

    const autoHint = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 24, next ? "Advancing to next chapter… click anywhere to continue now" : "Returning to menu…", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: COLORS.textMuted,
      })
      .setOrigin(0.5)
      .setDepth(11);
    this.tweens.add({ targets: autoHint, alpha: 0.4, duration: 700, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    this.input.keyboard.once("keydown-ENTER", () => this.goToNext(next));
    this.input.keyboard.once("keydown-SPACE", () => this.goToNext(next));
    this.input.once("pointerdown", () => this.goToNext(next));

    this.time.delayedCall(AUTO_ADVANCE_MS, () => this.goToNext(next));
  }

  goToNext(next) {
    if (this.advanced) return;
    this.advanced = true;
    if (!next) {
      this.scene.start(SCENES.MENU);
      return;
    }
    if (next.isShowcase) {
      this.scene.start(SCENES.PORTAL);
    } else {
      this.scene.start(SCENES.LEVEL, { level: next });
    }
  }

  spawnPetalRain() {
    PETAL_COLORS.forEach((color, idx) => {
      const key = this.ensurePetalTexture(color, idx);
      this.add.particles(0, -20, key, {
        x: { min: 0, max: GAME_WIDTH },
        y: -20,
        lifespan: 5200,
        speedY: { min: 80, max: 160 },
        speedX: { min: -40, max: 40 },
        accelerationY: 15,
        rotate: { start: 0, end: 360 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.9, end: 0.6 },
        alpha: { start: 1, end: 0.85 },
        quantity: 1,
        frequency: 110,
      });
    });
  }

  ensurePetalTexture(color, idx) {
    const key = `petal-${idx}`;
    if (this.textures.exists(key)) return key;
    const g = this.add.graphics();
    g.fillStyle(color, 1);
    g.fillCircle(6, 4, 4);
    g.fillCircle(2, 8, 4);
    g.fillCircle(10, 8, 4);
    g.fillCircle(6, 12, 4);
    g.fillStyle(0xffffff, 0.55);
    g.fillCircle(6, 8, 2.5);
    g.fillStyle(0xffd166, 1);
    g.fillCircle(6, 8, 1.5);
    g.generateTexture(key, 14, 16);
    g.destroy();
    return key;
  }

  short(title) {
    return title.split("—")[0].trim();
  }
}
