import Phaser from "phaser";
import { SCENES, COLORS, GAME_WIDTH, GAME_HEIGHT, GRAVITY } from "../config/constants";
import Player from "../sprites/Player";
import { PROJECTS } from "../data/projects";
import { startBgm, toggleMute, isMuted, playSfx } from "../audio/AudioManager";
import { markLevelComplete } from "../state/progress";
import { isReduceMotion } from "../state/settings";
import MobileControls from "../input/MobileControls";

const SHOWCASE_KEY = "level-8-showcase";
const WORLD_W = 2400;
const WORLD_H = 540;
const PORTAL_Y = 360;

export default class PortalRoomScene extends Phaser.Scene {
  constructor() {
    super(SCENES.PORTAL);
  }

  init() {
    this.opened = new Set();
    this.activePortal = null;
    this.finaleUnlocked = false;
  }

  create() {
    startBgm(this);
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.physics.world.gravity.y = GRAVITY;

    this.drawBackdrop();

    this.platforms = this.physics.add.staticGroup();
    const ground = this.add.rectangle(WORLD_W / 2, WORLD_H - 30, WORLD_W, 60, 0x161425);
    this.physics.add.existing(ground, true);
    this.platforms.add(ground);

    const spacing = WORLD_W / (PROJECTS.length + 1);
    this.portals = [];
    PROJECTS.forEach((proj, i) => {
      const x = spacing * (i + 1);
      const portal = this.makePortal(proj, x, PORTAL_Y);
      this.portals.push(portal);
    });

    this.player = new Player(this, 100, 380);
    this.physics.add.collider(this.player, this.platforms);

    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(120, 80);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({ W: "W", A: "A", D: "D", SPACE: "SPACE", E: "E" });
    this.jumpKeyDown = false;
    this.reduceMotion = isReduceMotion();
    this.mobile = new MobileControls(this);
    this.makeInteractBtn();

    this.hud = this.add
      .text(16, 16, "", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: COLORS.text,
        backgroundColor: "rgba(11,13,26,0.6)",
        padding: { x: 8, y: 4 },
      })
      .setScrollFactor(0)
      .setDepth(40);

    this.hintText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 28, "Walk near a portal, press E to open. Open every portal to unlock the finale.", {
        fontFamily: "monospace",
        fontSize: "12px",
        color: COLORS.textMuted,
        backgroundColor: "rgba(11,13,26,0.6)",
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(40);

    this.muteBtn = this.add
      .text(GAME_WIDTH - 16, 16, isMuted(this) ? "🔇 M" : "🔊 M", {
        fontFamily: "monospace",
        fontSize: "12px",
        color: COLORS.textMuted,
        backgroundColor: "rgba(11,13,26,0.6)",
        padding: { x: 6, y: 4 },
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(40)
      .setInteractive({ useHandCursor: true });
    this.muteBtn.on("pointerdown", () => {
      toggleMute(this);
      this.muteBtn.setText(isMuted(this) ? "🔇 M" : "🔊 M");
    });

    this.input.keyboard.on("keydown-M", () => {
      toggleMute(this);
      this.muteBtn.setText(isMuted(this) ? "🔇 M" : "🔊 M");
    });
    this.input.keyboard.on("keydown-ESC", () => this.scene.launch(SCENES.PAUSE, { from: SCENES.PORTAL }));
    this.input.keyboard.on("keydown-E", () => this.tryOpenNearest());

    this.refreshHud();
  }

  update(time) {
    if (this.activePortal) return;

    const mState = this.mobile.state;
    const left = this.cursors.left.isDown || this.keys.A.isDown || mState.left;
    const right = this.cursors.right.isDown || this.keys.D.isDown || mState.right;
    const jumpHeld = this.cursors.up.isDown || this.keys.W.isDown || this.keys.SPACE.isDown || mState.jumpHeld;
    const mobileJump = this.mobile.consumeJumpPress();
    const jumpPressed = (jumpHeld && !this.jumpKeyDown) || mobileJump;
    const jumpReleased = !jumpHeld && this.jumpKeyDown;
    this.jumpKeyDown = jumpHeld;

    if (jumpPressed) this.player.requestJump(time);
    this.player.update(time, { left, right, jumpReleased });

    let near = null;
    let nearestDist = 90;
    for (const p of this.portals) {
      const d = Math.abs(p.x - this.player.x);
      if (d < nearestDist) {
        nearestDist = d;
        near = p;
      }
    }
    if (near !== this.nearPortal) {
      if (this.nearPortal) this.nearPortal.prompt.setAlpha(0);
      this.nearPortal = near;
      if (near) near.prompt.setAlpha(1);
    }
    if (this.interactBtn) this.interactBtn.setAlpha(near && this.mobile.enabled ? 1 : 0);

    if (this.finaleUnlocked && Math.abs(this.player.x - (WORLD_W - 80)) < 60 && this.player.body.blocked.down) {
      this.gotoFinale();
    }
  }

  makePortal(proj, x, y) {
    const tex = this.ensurePortalTexture(proj.color);
    const portal = this.physics.add.sprite(x, y, tex);
    portal.body.setAllowGravity(false);
    portal.body.setImmovable(true);
    portal.project = proj;
    portal.setData("id", proj.id);

    this.tweens.add({
      targets: portal,
      y: y - 8,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    const label = this.add
      .text(x, y + 80, proj.name, {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#ffffff",
        backgroundColor: "rgba(11,13,26,0.7)",
        padding: { x: 6, y: 3 },
      })
      .setOrigin(0.5)
      .setDepth(5);
    portal.label = label;

    const prompt = this.add
      .text(x, y - 90, "Press E", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#0b0d1a",
        backgroundColor: "#4cc9f0",
        padding: { x: 6, y: 3 },
      })
      .setOrigin(0.5)
      .setDepth(6)
      .setAlpha(0);
    portal.prompt = prompt;
    return portal;
  }

  tryOpenNearest() {
    const p = this.nearPortal;
    if (!p) return;
    this.opened.add(p.project.id);
    this.showModal(p.project);
    this.refreshHud();
  }

  showModal(proj) {
    this.activePortal = proj.id;
    const overlay = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7)
      .setScrollFactor(0)
      .setDepth(50);

    const cardW = 640;
    const cardH = 380;
    const cardY = (GAME_HEIGHT - cardH) / 2;
    const card = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, cardW, cardH, 0x141728, 0.98)
      .setStrokeStyle(2, proj.color)
      .setScrollFactor(0)
      .setDepth(51);

    const elems = [overlay, card];
    elems.push(
      this.add
        .text(GAME_WIDTH / 2, cardY + 32, "PROJECT", {
          fontFamily: "monospace",
          fontSize: "12px",
          color: COLORS.textMuted,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(52),
      this.add
        .text(GAME_WIDTH / 2, cardY + 64, proj.name, {
          fontFamily: "monospace",
          fontSize: "26px",
          color: "#ffffff",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(52),
      this.add
        .text(GAME_WIDTH / 2, cardY + 108, proj.pitch, {
          fontFamily: "monospace",
          fontSize: "14px",
          color: COLORS.text,
          wordWrap: { width: cardW - 80 },
          align: "center",
        })
        .setOrigin(0.5, 0)
        .setScrollFactor(0)
        .setDepth(52),
      this.add
        .text(GAME_WIDTH / 2, cardY + 178, "STACK", {
          fontFamily: "monospace",
          fontSize: "11px",
          color: COLORS.textMuted,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(52),
      this.add
        .text(GAME_WIDTH / 2, cardY + 198, proj.stack.join("  •  "), {
          fontFamily: "monospace",
          fontSize: "12px",
          color: COLORS.accent,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(52),
      this.add
        .text(GAME_WIDTH / 2, cardY + 232, proj.why, {
          fontFamily: "monospace",
          fontSize: "12px",
          color: COLORS.textMuted,
          wordWrap: { width: cardW - 80 },
          align: "center",
          fontStyle: "italic",
        })
        .setOrigin(0.5, 0)
        .setScrollFactor(0)
        .setDepth(52),
    );

    const buttons = [];
    if (proj.links.live) {
      buttons.push({ label: "Visit ↗", url: proj.links.live, primary: true });
    }
    if (proj.links.github) {
      buttons.push({ label: "GitHub ↗", url: proj.links.github, primary: !proj.links.live });
    }

    buttons.forEach((b, i) => {
      const btnX = GAME_WIDTH / 2 + (i - (buttons.length - 1) / 2) * 140;
      const btn = this.add
        .text(btnX, cardY + cardH - 60, b.label, {
          fontFamily: "monospace",
          fontSize: "13px",
          color: b.primary ? "#0b0d1a" : "#ffffff",
          backgroundColor: b.primary ? "#4cc9f0" : "rgba(255,255,255,0.1)",
          padding: { x: 12, y: 7 },
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(52)
        .setInteractive({ useHandCursor: true });
      btn.on("pointerdown", () => {
        if (typeof window !== "undefined") window.open(b.url, "_blank", "noopener,noreferrer");
      });
      elems.push(btn);
    });

    const close = this.add
      .text(GAME_WIDTH / 2, cardY + cardH - 24, "Close (Esc)", {
        fontFamily: "monospace",
        fontSize: "11px",
        color: COLORS.textMuted,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(52)
      .setInteractive({ useHandCursor: true });
    elems.push(close);

    const dismiss = () => {
      elems.forEach((e) => e.destroy());
      this.input.keyboard.off("keydown-ESC", dismiss);
      this.activePortal = null;
    };
    close.on("pointerdown", dismiss);
    this.input.keyboard.once("keydown-ESC", dismiss);
  }

  refreshHud() {
    const total = PROJECTS.length;
    const opened = this.opened.size;
    this.hud.setText(`Portals opened: ${opened} / ${total}    E: open    ESC: pause`);
    if (opened === total && !this.finaleUnlocked) {
      this.finaleUnlocked = true;
      this.spawnFinaleDoor();
    }
  }

  spawnFinaleDoor() {
    const x = WORLD_W - 80;
    const door = this.add.rectangle(x, WORLD_H - 110, 60, 110, 0x4cc9f0, 0.85).setStrokeStyle(3, 0xffffff);
    this.tweens.add({
      targets: door,
      alpha: 0.6,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    this.add
      .text(x, WORLD_H - 200, "FINALE  ▸", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#0b0d1a",
        backgroundColor: "#4cc9f0",
        padding: { x: 8, y: 5 },
      })
      .setOrigin(0.5);
    playSfx(this, "sfx-win");
    if (!this.reduceMotion) this.cameras.main.flash(500, 76, 201, 240);
  }

  makeInteractBtn() {
    if (!this.mobile.enabled) return;
    const x = GAME_WIDTH - 36 - 36;
    const y = GAME_HEIGHT - 28 - 36 - 90;
    const bg = this.add
      .circle(x, y, 30, 0xffffff, 0.15)
      .setStrokeStyle(2, 0xffffff, 0.55)
      .setScrollFactor(0)
      .setDepth(45)
      .setInteractive({ useHandCursor: true });
    const t = this.add
      .text(x, y, "E", {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(46);
    bg.on("pointerdown", () => {
      bg.setFillStyle(0x4cc9f0, 0.45);
      this.tryOpenNearest();
    });
    const release = () => bg.setFillStyle(0xffffff, 0.15);
    bg.on("pointerup", release);
    bg.on("pointerout", release);
    this.interactBtn = bg;
    this.interactBtnText = t;
    bg.setAlpha(0);
    t.setAlpha(1);
  }

  gotoFinale() {
    markLevelComplete(SHOWCASE_KEY, []);
    this.cameras.main.fadeOut(400, 11, 13, 26);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start(SCENES.FINALE);
    });
  }

  drawBackdrop() {
    const key = "portal-room-bg";
    if (!this.textures.exists(key)) {
      const tex = this.textures.createCanvas(key, WORLD_W, WORLD_H);
      const ctx = tex.getContext();
      const g = ctx.createLinearGradient(0, 0, 0, WORLD_H);
      g.addColorStop(0, "#0a0820");
      g.addColorStop(1, "#02010a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, WORLD_W, WORLD_H);
      ctx.strokeStyle = "rgba(76,201,240,0.15)";
      ctx.lineWidth = 1;
      for (let i = 0; i < WORLD_W; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, WORLD_H);
        ctx.stroke();
      }
      for (let i = 0; i < WORLD_H; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(WORLD_W, i);
        ctx.stroke();
      }
      tex.refresh();
    }
    this.add.image(0, 0, key).setOrigin(0, 0).setScrollFactor(1);
  }

  ensurePortalTexture(color) {
    const key = `portal-${color}`;
    if (this.textures.exists(key)) return key;
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.15);
    g.fillEllipse(40, 60, 70, 110);
    g.fillStyle(color, 0.7);
    g.fillEllipse(40, 60, 56, 96);
    g.fillStyle(0xffffff, 0.55);
    g.fillEllipse(40, 50, 24, 36);
    g.generateTexture(key, 80, 120);
    g.destroy();
    return key;
  }
}
