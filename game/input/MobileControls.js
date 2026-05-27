import { GAME_WIDTH, GAME_HEIGHT } from "../config/constants";

export function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || (navigator.maxTouchPoints || 0) > 0;
}

export default class MobileControls {
  constructor(scene) {
    this.scene = scene;
    this.state = { left: false, right: false, jumpHeld: false, jumpPressedThisFrame: false };
    this.enabled = isTouchDevice();
    if (!this.enabled) return;
    this.create();
  }

  create() {
    const radius = 36;
    const margin = 28;
    const bottomY = GAME_HEIGHT - margin - radius;

    this.leftBtn = this.makeButton(margin + radius, bottomY, radius, "◂");
    this.rightBtn = this.makeButton(margin + radius * 2 + 40 + radius, bottomY, radius, "▸");
    this.jumpBtn = this.makeButton(GAME_WIDTH - margin - radius, bottomY, radius + 6, "▲");

    this.attach(this.leftBtn, "left");
    this.attach(this.rightBtn, "right");
    this.attachJump(this.jumpBtn);
  }

  makeButton(x, y, r, label) {
    const bg = this.scene.add
      .circle(x, y, r, 0xffffff, 0.15)
      .setStrokeStyle(2, 0xffffff, 0.55)
      .setScrollFactor(0)
      .setDepth(45)
      .setInteractive({ useHandCursor: true });
    const t = this.scene.add
      .text(x, y, label, {
        fontFamily: "monospace",
        fontSize: "22px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(46);
    return { bg, t };
  }

  attach(btn, key) {
    const on = () => {
      this.state[key] = true;
      btn.bg.setFillStyle(0x4cc9f0, 0.45);
    };
    const off = () => {
      this.state[key] = false;
      btn.bg.setFillStyle(0xffffff, 0.15);
    };
    btn.bg.on("pointerdown", on);
    btn.bg.on("pointerup", off);
    btn.bg.on("pointerupoutside", off);
    btn.bg.on("pointerout", off);
  }

  attachJump(btn) {
    btn.bg.on("pointerdown", () => {
      this.state.jumpHeld = true;
      this.state.jumpPressedThisFrame = true;
      btn.bg.setFillStyle(0x4cc9f0, 0.45);
    });
    const release = () => {
      this.state.jumpHeld = false;
      btn.bg.setFillStyle(0xffffff, 0.15);
    };
    btn.bg.on("pointerup", release);
    btn.bg.on("pointerupoutside", release);
    btn.bg.on("pointerout", release);
  }

  consumeJumpPress() {
    const v = this.state.jumpPressedThisFrame;
    this.state.jumpPressedThisFrame = false;
    return v;
  }

  destroy() {
    if (!this.enabled) return;
    [this.leftBtn, this.rightBtn, this.jumpBtn].forEach((b) => {
      if (b) {
        b.bg.destroy();
        b.t.destroy();
      }
    });
  }
}
