import Phaser from "phaser";
import { SCENES, COLORS, GAME_WIDTH, GAME_HEIGHT } from "../config/constants";
import { loadProgress } from "../state/progress";
import { startBgm } from "../audio/AudioManager";
import { isReduceMotion } from "../state/settings";
import { drawSkillConstellation } from "../ui/SkillTree";

const PETAL_COLORS = [0xff6fa3, 0xf4d35e, 0x4cc9f0, 0xa6e22e, 0xff9d5c, 0xb39ddb];

export default class FinaleScene extends Phaser.Scene {
  constructor() {
    super(SCENES.FINALE);
  }

  create() {
    startBgm(this);
    this.cameras.main.setBackgroundColor(0x05060f);
    this.cameras.main.fadeIn(600, 5, 6, 15);

    const cx = GAME_WIDTH / 2;
    if (!isReduceMotion()) this.spawnPetals();

    const spot = this.add.graphics();
    spot.fillStyle(0xffffff, 0.06);
    spot.fillEllipse(cx, GAME_HEIGHT / 2 + 40, 540, 380);

    this.add
      .text(cx, 80, "✦  JOURNEY COMPLETE  ✦", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: COLORS.accent,
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 130, "Harsh's Dev Quest", {
        fontFamily: "monospace",
        fontSize: "32px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const lines = [
      "Thank you for walking this path.",
      "",
      "From a curious B.Tech student in Jaipur",
      "to system thinking in Dortmund —",
      "every chapter shaped what comes next.",
      "",
      "If something here connected with you,",
      "the rest of the story is one click away.",
    ];
    this.typeOnText(cx, 190, lines);

    const progress = loadProgress();
    const skills = progress.collectedSkills || [];

    if (skills.length > 0) {
      this.time.delayedCall(2000, () => {
        const header = this.add
          .text(cx, GAME_HEIGHT - 240, `THE SKILLS YOU UNLOCKED  (${skills.length})`, {
            fontFamily: "monospace",
            fontSize: "11px",
            color: COLORS.accent,
            fontStyle: "bold",
          })
          .setOrigin(0.5);
        header.setAlpha(0);
        this.tweens.add({ targets: header, alpha: 1, duration: 600 });

        const objs = drawSkillConstellation(this, skills, 80, GAME_HEIGHT - 215, GAME_WIDTH - 160, {
          cols: Math.min(7, Math.max(5, skills.length)),
          radius: 7,
          spacingY: 38,
        });
        objs.forEach((o, i) => {
          o.setAlpha(0);
          this.tweens.add({ targets: o, alpha: 1, duration: 400, delay: i * 14 });
        });
      });
    }

    this.makeButton(cx - 130, GAME_HEIGHT - 70, "📄  Download Resume", "#4cc9f0", "#0b0d1a", () => this.downloadResume());
    this.makeButton(cx + 130, GAME_HEIGHT - 70, "✉  Reach Out", "rgba(255,255,255,0.1)", "#ffffff", () => {
      if (typeof window !== "undefined") {
        window.open("https://www.linkedin.com/in/harsh-agarwal-669221192/", "_blank", "noopener,noreferrer");
      }
    });
    this.makeButton(cx, GAME_HEIGHT - 28, "↻  Replay", "rgba(255,255,255,0.06)", "#ffffff", () => this.scene.start(SCENES.MENU));
  }

  makeButton(x, y, label, bg, color, onClick) {
    const btn = this.add
      .text(x, y, label, {
        fontFamily: "monospace",
        fontSize: "14px",
        color,
        backgroundColor: bg,
        padding: { x: 14, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    btn.on("pointerover", () => btn.setStyle({ backgroundColor: "#ffffff", color: "#0b0d1a" }));
    btn.on("pointerout", () => btn.setStyle({ backgroundColor: bg, color }));
    btn.on("pointerdown", onClick);
    return btn;
  }

  typeOnText(x, startY, lines) {
    let acc = "";
    const fullText = lines.join("\n");
    const obj = this.add
      .text(x, startY, "", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: COLORS.text,
        align: "center",
        lineSpacing: 4,
      })
      .setOrigin(0.5, 0);

    let i = 0;
    const tick = this.time.addEvent({
      delay: 26,
      loop: true,
      callback: () => {
        acc += fullText[i];
        obj.setText(acc);
        i++;
        if (i >= fullText.length) tick.remove();
      },
    });
  }

  downloadResume() {
    if (typeof window === "undefined") return;
    const url = "/assets/resume/Harsh_Agarwal_Resume.pdf";
    const a = document.createElement("a");
    a.href = url;
    a.download = "Harsh_Agarwal_Resume.pdf";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  spawnPetals() {
    PETAL_COLORS.forEach((c, i) => {
      const key = `finale-petal-${i}`;
      if (!this.textures.exists(key)) {
        const g = this.add.graphics();
        g.fillStyle(c, 1);
        g.fillCircle(6, 4, 4);
        g.fillCircle(2, 8, 4);
        g.fillCircle(10, 8, 4);
        g.fillCircle(6, 12, 4);
        g.fillStyle(0xffd166, 1);
        g.fillCircle(6, 8, 1.5);
        g.generateTexture(key, 14, 16);
        g.destroy();
      }
      this.add.particles(0, -20, key, {
        x: { min: 0, max: GAME_WIDTH },
        y: -20,
        lifespan: 6000,
        speedY: { min: 60, max: 130 },
        speedX: { min: -30, max: 30 },
        rotate: { start: 0, end: 360 },
        scale: { start: 0.9, end: 0.5 },
        alpha: { start: 0.95, end: 0.7 },
        quantity: 1,
        frequency: 140,
      });
    });
  }
}
