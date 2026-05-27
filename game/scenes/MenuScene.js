import Phaser from "phaser";
import { SCENES, COLORS, GAME_WIDTH, GAME_HEIGHT } from "../config/constants";
import { loadProgress } from "../state/progress";
import { LEVELS, getFirstUncompletedLevel } from "../levels";
import { startBgm, toggleMute, isMuted, hasBgm } from "../audio/AudioManager";
import { isReduceMotion, toggleReduceMotion } from "../state/settings";
import { colorForSkill } from "../ui/SkillTree";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super(SCENES.MENU);
  }

  create() {
    this.cameras.main.setBackgroundColor(COLORS.bg);
    this.cameras.main.fadeIn(380, 11, 13, 26);

    this.add
      .text(GAME_WIDTH / 2, 60, "HARSH'S", {
        fontFamily: "monospace",
        fontSize: "44px",
        color: COLORS.accent,
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 112, "DEV QUEST", {
        fontFamily: "monospace",
        fontSize: "44px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 158, "A playable journey from Jaipur to Dortmund", {
        fontFamily: "monospace",
        fontSize: "12px",
        color: COLORS.textMuted,
      })
      .setOrigin(0.5);

    const progress = loadProgress();
    const startLevel = getFirstUncompletedLevel(progress.completedLevels);

    const startBtn = this.add
      .text(GAME_WIDTH / 2, 206, `▶  ${progress.completedLevels.length > 0 ? "CONTINUE" : "START JOURNEY"}`, {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#0b0d1a",
        backgroundColor: "#4cc9f0",
        padding: { x: 18, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    startBtn.on("pointerover", () => startBtn.setStyle({ backgroundColor: "#ffffff" }));
    startBtn.on("pointerout", () => startBtn.setStyle({ backgroundColor: "#4cc9f0" }));
    startBtn.on("pointerdown", () => this.beginLevel(startLevel));

    this.add
      .text(GAME_WIDTH / 2, 252, "— or pick a chapter —", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: COLORS.textMuted,
      })
      .setOrigin(0.5);

    const cardW = 200;
    const cardH = 64;
    const gap = 12;
    const perRow = 4;
    const totalRow = perRow * cardW + (perRow - 1) * gap;
    const startX = (GAME_WIDTH - totalRow) / 2;

    LEVELS.forEach((level, i) => {
      const row = Math.floor(i / perRow);
      const col = i % perRow;
      const x = startX + col * (cardW + gap);
      const y = 278 + row * (cardH + 14);
      const completed = progress.completedLevels.includes(level.key);
      const bg = this.add
        .rectangle(x + cardW / 2, y + cardH / 2, cardW, cardH, 0x141728, 1)
        .setStrokeStyle(2, completed ? 0x4cc9f0 : 0x3a3f57)
        .setInteractive({ useHandCursor: true });

      this.add
        .text(x + 10, y + 6, `Chapter ${i + 1}${completed ? "  ✓" : ""}`, {
          fontFamily: "monospace",
          fontSize: "10px",
          color: completed ? COLORS.accent : COLORS.textMuted,
        });

      this.add
        .text(x + 10, y + 24, this.shortTitle(level.title), {
          fontFamily: "monospace",
          fontSize: "12px",
          color: "#ffffff",
          wordWrap: { width: cardW - 20 },
        });

      bg.on("pointerover", () => bg.setFillStyle(0x1d2236, 1));
      bg.on("pointerout", () => bg.setFillStyle(0x141728, 1));
      bg.on("pointerdown", () => this.beginLevel(level));
    });

    const done = progress.completedLevels.length;
    const skillsArr = progress.collectedSkills || [];
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 70, `Progress: ${done} / ${LEVELS.length}   •   Skills: ${skillsArr.length}`, {
        fontFamily: "monospace",
        fontSize: "12px",
        color: COLORS.textMuted,
      })
      .setOrigin(0.5);

    this.drawSkillChips(skillsArr, GAME_WIDTH / 2, GAME_HEIGHT - 50);

    const muteLabel = () => `${isMuted(this) ? "🔇" : "🔊"} ${isMuted(this) ? "Muted" : "Sound on"}  (M)`;
    const motionLabel = () => `${isReduceMotion() ? "🌿" : "⚡"} ${isReduceMotion() ? "Reduced motion" : "Full motion"}  (R)`;

    const muteBtn = this.add
      .text(GAME_WIDTH - 16, 16, muteLabel(), {
        fontFamily: "monospace",
        fontSize: "11px",
        color: COLORS.textMuted,
        backgroundColor: "rgba(20,23,40,0.7)",
        padding: { x: 8, y: 4 },
      })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });
    muteBtn.on("pointerdown", () => {
      toggleMute(this);
      muteBtn.setText(muteLabel());
    });

    const motionBtn = this.add
      .text(GAME_WIDTH - 16, 44, motionLabel(), {
        fontFamily: "monospace",
        fontSize: "11px",
        color: COLORS.textMuted,
        backgroundColor: "rgba(20,23,40,0.7)",
        padding: { x: 8, y: 4 },
      })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });
    motionBtn.on("pointerdown", () => {
      toggleReduceMotion();
      motionBtn.setText(motionLabel());
    });

    this.input.keyboard.on("keydown-M", () => {
      toggleMute(this);
      muteBtn.setText(muteLabel());
    });
    this.input.keyboard.on("keydown-R", () => {
      toggleReduceMotion();
      motionBtn.setText(motionLabel());
    });

    if (!hasBgm(this)) {
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT - 28, "(no music loaded — see assets/audio/README.md)", {
          fontFamily: "monospace",
          fontSize: "10px",
          color: COLORS.textMuted,
        })
        .setOrigin(0.5);
    } else {
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT - 28, "Arrows / WASD to move  •  Space to jump  •  ESC to pause", {
          fontFamily: "monospace",
          fontSize: "10px",
          color: COLORS.textMuted,
        })
        .setOrigin(0.5);
    }

    this.input.keyboard.once("keydown-ENTER", () => this.beginLevel(startLevel));
  }

  beginLevel(level) {
    startBgm(this);
    this.cameras.main.fadeOut(280, 11, 13, 26);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      if (level.isShowcase) {
        this.scene.start(SCENES.PORTAL);
      } else {
        this.scene.start(SCENES.LEVEL, { level });
      }
    });
  }

  shortTitle(title) {
    return title.split("—")[0].trim();
  }

  drawSkillChips(skills, centerX, y) {
    if (!skills.length) return;
    const dotR = 4;
    const gap = 9;
    const total = skills.length * (dotR * 2 + gap) - gap;
    let x = centerX - total / 2 + dotR;
    skills.forEach((s) => {
      this.add.circle(x, y, dotR, colorForSkill(s), 1).setStrokeStyle(1, 0xffffff, 0.4);
      x += dotR * 2 + gap;
    });
  }
}
