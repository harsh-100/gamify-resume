import Phaser from "phaser";
import { SCENES, COLORS, GAME_WIDTH, GAME_HEIGHT } from "../config/constants";
import { toggleMute, isMuted } from "../audio/AudioManager";
import { isReduceMotion, toggleReduceMotion } from "../state/settings";

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super(SCENES.PAUSE);
  }

  init(data) {
    this.fromScene = data?.from || SCENES.LEVEL;
  }

  create() {
    this.scene.pause(this.fromScene);

    this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.65)
      .setScrollFactor(0);

    const cardW = 400;
    const cardH = 340;
    this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, cardW, cardH, 0x141728, 0.98)
      .setStrokeStyle(2, 0x4cc9f0);

    const baseY = GAME_HEIGHT / 2 - cardH / 2;
    this.add
      .text(GAME_WIDTH / 2, baseY + 26, "PAUSED", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: COLORS.accent,
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.statusLabel = this.add
      .text(GAME_WIDTH / 2, baseY + 64, this.statusText(), {
        fontFamily: "monospace",
        fontSize: "11px",
        color: COLORS.textMuted,
        align: "center",
      })
      .setOrigin(0.5);

    this.button(GAME_WIDTH / 2, baseY + 110, "▶  Resume  (Esc)", "#4cc9f0", "#0b0d1a", () => this.resume());

    this.muteBtn = this.button(GAME_WIDTH / 2, baseY + 154, this.muteBtnLabel(), "rgba(255,255,255,0.1)", "#ffffff", () => {
      toggleMute(this);
      this.muteBtn.setText(this.muteBtnLabel());
      this.statusLabel.setText(this.statusText());
    });

    this.motionBtn = this.button(GAME_WIDTH / 2, baseY + 198, this.motionBtnLabel(), "rgba(255,255,255,0.1)", "#ffffff", () => {
      toggleReduceMotion();
      this.motionBtn.setText(this.motionBtnLabel());
      this.statusLabel.setText(this.statusText());
    });

    this.button(GAME_WIDTH / 2, baseY + 254, "◂  Exit to Menu", "rgba(255,255,255,0.06)", "#ffffff", () => {
      this.scene.stop(this.fromScene);
      this.scene.start(SCENES.MENU);
    });

    this.add
      .text(GAME_WIDTH / 2, baseY + cardH - 22, "Esc resumes  •  M mutes  •  R reduces motion", {
        fontFamily: "monospace",
        fontSize: "10px",
        color: COLORS.textMuted,
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-ESC", () => this.resume());
    this.input.keyboard.on("keydown-M", () => {
      toggleMute(this);
      this.muteBtn.setText(this.muteBtnLabel());
      this.statusLabel.setText(this.statusText());
    });
    this.input.keyboard.on("keydown-R", () => {
      toggleReduceMotion();
      this.motionBtn.setText(this.motionBtnLabel());
      this.statusLabel.setText(this.statusText());
    });
  }

  statusText() {
    const audio = isMuted(this) ? "muted" : "on";
    const motion = isReduceMotion(this) ? "reduced" : "full";
    return `Audio: ${audio}    Motion: ${motion}`;
  }

  muteBtnLabel() {
    return isMuted(this) ? "🔇  Unmute  (M)" : "🔊  Mute  (M)";
  }

  motionBtnLabel() {
    return isReduceMotion() ? "⚡  Restore Motion  (R)" : "🌿  Reduce Motion  (R)";
  }

  resume() {
    this.scene.resume(this.fromScene);
    this.scene.stop();
  }

  button(x, y, label, bg, color, onClick) {
    const btn = this.add
      .text(x, y, label, {
        fontFamily: "monospace",
        fontSize: "13px",
        color,
        backgroundColor: bg,
        padding: { x: 14, y: 7 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    btn.on("pointerover", () => btn.setStyle({ backgroundColor: "#ffffff", color: "#0b0d1a" }));
    btn.on("pointerout", () => btn.setStyle({ backgroundColor: bg, color }));
    btn.on("pointerdown", onClick);
    return btn;
  }
}
