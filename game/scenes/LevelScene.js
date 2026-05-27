import Phaser from "phaser";
import { SCENES, COLORS, GAME_WIDTH, GRAVITY } from "../config/constants";
import Player from "../sprites/Player";
import { markLevelComplete } from "../state/progress";
import { startBgm, toggleMute, isMuted, playSfx } from "../audio/AudioManager";
import { isReduceMotion } from "../state/settings";
import MobileControls from "../input/MobileControls";

export default class LevelScene extends Phaser.Scene {
  constructor() {
    super(SCENES.LEVEL);
  }

  init(data) {
    this.level = data.level;
    this.collectedThisRun = [];
    this.completing = false;
  }

  create() {
    const level = this.level;
    startBgm(this);

    this.physics.world.setBounds(0, 0, level.worldWidth, level.worldHeight);
    this.physics.world.gravity.y = GRAVITY;

    this.drawSkyGradient(level.background.topColor, level.background.bottomColor, level.worldWidth, level.worldHeight);
    this.drawSilhouette(level);

    this.reduceMotion = isReduceMotion();

    if (level.snow && !this.reduceMotion) this.spawnSnow(level.worldWidth);

    this.platforms = this.physics.add.staticGroup();
    const ground = this.add.rectangle(
      level.worldWidth / 2,
      level.ground.y + level.ground.height / 2,
      level.worldWidth,
      level.ground.height,
      COLORS.ground
    );
    this.physics.add.existing(ground, true);
    this.platforms.add(ground);

    for (const p of level.platforms) {
      const r = this.add.rectangle(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h, COLORS.platform);
      this.physics.add.existing(r, true);
      this.platforms.add(r);
    }

    this.orbs = this.physics.add.group({ allowGravity: false, immovable: true });
    for (const s of level.skills) {
      const orbTex = this.ensureOrbTexture(s.color);
      const orb = this.orbs.create(s.x, s.y, orbTex);
      orb.skillId = s.id;
      orb.collected = false;
      orb.skillColor = s.color;
      orb.body.setCircle(8);

      const label = this.add
        .text(s.x, s.y - 22, s.id, {
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#ffffff",
          backgroundColor: "rgba(11,13,26,0.65)",
          padding: { x: 5, y: 2 },
        })
        .setOrigin(0.5)
        .setDepth(5);
      orb.label = label;

      this.tweens.add({
        targets: [orb, label],
        y: "-=6",
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }

    this.obstacles = this.physics.add.group({ allowGravity: false, immovable: true });
    for (const o of level.obstacles) {
      const tex = this.ensureObstacleTexture(o.type, o.color);
      const sprite = this.obstacles.create(o.x, o.y, tex);
      sprite.body.setSize(22, 22);
      const mobile = o.type !== "auth-gate" && o.type !== "paper-stack";
      if (mobile) {
        this.tweens.add({
          targets: sprite,
          x: o.x + 30,
          duration: 1400,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      } else if (o.type === "paper-stack") {
        this.tweens.add({
          targets: sprite,
          x: o.x + 16,
          duration: 1600,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      }
    }

    const goalTex = this.ensureGoalTexture();
    this.goal = this.physics.add.sprite(level.goal.x, level.goal.y, goalTex);
    this.goal.body.setAllowGravity(false);
    this.goal.body.setImmovable(true);
    this.tweens.add({
      targets: this.goal,
      y: level.goal.y - 8,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.player = new Player(this, level.spawn.x, level.spawn.y);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.orbs, this.collectOrb, null, this);
    this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);

    this.cameras.main.setBounds(0, 0, level.worldWidth, level.worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(120, 80);
    this.cameras.main.fadeIn(380, 11, 13, 26);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({ W: "W", A: "A", D: "D", SPACE: "SPACE" });
    this.mobile = new MobileControls(this);

    this.hudText = this.add
      .text(16, 16, "", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: COLORS.text,
        backgroundColor: "rgba(11,13,26,0.6)",
        padding: { x: 8, y: 4 },
      })
      .setScrollFactor(0)
      .setDepth(20);

    this.muteHudText = this.add
      .text(GAME_WIDTH - 16, 16, isMuted(this) ? "🔇 M" : "🔊 M", {
        fontFamily: "monospace",
        fontSize: "12px",
        color: COLORS.textMuted,
        backgroundColor: "rgba(11,13,26,0.6)",
        padding: { x: 6, y: 4 },
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(20)
      .setInteractive({ useHandCursor: true });
    this.muteHudText.on("pointerdown", () => {
      toggleMute(this);
      this.muteHudText.setText(isMuted(this) ? "🔇 M" : "🔊 M");
    });

    this.titleText = this.add
      .text(GAME_WIDTH / 2, 40, level.title, {
        fontFamily: "monospace",
        fontSize: "16px",
        color: COLORS.text,
        backgroundColor: "rgba(11,13,26,0.6)",
        padding: { x: 10, y: 6 },
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(20);
    this.tweens.add({ targets: this.titleText, alpha: 0, delay: 3000, duration: 800 });

    this.refreshHud();

    this.input.keyboard.on("keydown-ESC", () => this.scene.launch(SCENES.PAUSE, { from: SCENES.LEVEL }));
    this.input.keyboard.on("keydown-M", () => {
      toggleMute(this);
      this.muteHudText.setText(isMuted(this) ? "🔇 M" : "🔊 M");
    });

    this.jumpKeyDown = false;
  }

  update(time) {
    if (this.completing) return;
    const mState = this.mobile.state;
    const left = this.cursors.left.isDown || this.keys.A.isDown || mState.left;
    const right = this.cursors.right.isDown || this.keys.D.isDown || mState.right;
    const jumpHeld = this.cursors.up.isDown || this.keys.W.isDown || this.keys.SPACE.isDown || mState.jumpHeld;
    const mobileJump = this.mobile.consumeJumpPress();
    const jumpPressed = (jumpHeld && !this.jumpKeyDown) || mobileJump;
    const jumpReleased = !jumpHeld && this.jumpKeyDown;
    this.jumpKeyDown = jumpHeld;

    if (jumpPressed && (this.player.body.blocked.down || time - this.player.lastGroundedAt < 120)) {
      playSfx(this, "sfx-jump", { volume: 0.4 });
    }
    if (jumpPressed) this.player.requestJump(time);
    this.player.update(time, { left, right, jumpReleased });

    if (this.player.y > this.level.worldHeight + 80) this.respawn();
  }

  respawn() {
    this.player.setVelocity(0, 0);
    this.player.setPosition(this.level.spawn.x, this.level.spawn.y);
    if (!this.reduceMotion) this.cameras.main.flash(180, 255, 100, 100);
  }

  collectOrb(_player, orb) {
    if (orb.collected || !orb.skillId) return;
    orb.collected = true;
    orb.body.enable = false;
    this.collectedThisRun.push(orb.skillId);
    playSfx(this, "sfx-collect", { volume: 0.55 });

    if (!this.reduceMotion) this.burstParticles(orb.x, orb.y, orb.skillColor || 0x4cc9f0);

    if (orb.label) {
      this.tweens.add({
        targets: orb.label,
        alpha: 0,
        y: orb.label.y - 14,
        duration: 220,
        onComplete: () => orb.label.destroy(),
      });
    }
    this.tweens.add({
      targets: orb,
      scale: 1.6,
      alpha: 0,
      duration: 220,
      onComplete: () => orb.destroy(),
    });
    this.refreshHud();
  }

  hitObstacle(_player, obstacle) {
    const dir = this.player.x < obstacle.x ? -1 : 1;
    this.player.bump(dir);
    if (!this.reduceMotion) this.cameras.main.shake(140, 0.005);
    playSfx(this, "sfx-hit", { volume: 0.4 });
  }

  reachGoal() {
    if (this.completing) return;
    this.completing = true;
    playSfx(this, "sfx-win", { volume: 0.7 });
    if (!this.reduceMotion) this.cameras.main.flash(420, 76, 201, 240);
    this.player.setVelocity(0, 0);

    const result = markLevelComplete(this.level.key, this.collectedThisRun);
    this.cameras.main.fadeOut(420, 11, 13, 26);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start(SCENES.STORY, {
        level: this.level,
        progress: result,
        collectedThisRun: [...this.collectedThisRun],
      });
    });
  }

  burstParticles(x, y, color) {
    const key = `burst-${color}`;
    if (!this.textures.exists(key)) {
      const g = this.add.graphics();
      g.fillStyle(color, 1);
      g.fillCircle(3, 3, 3);
      g.generateTexture(key, 6, 6);
      g.destroy();
    }
    const emitter = this.add.particles(x, y, key, {
      lifespan: 500,
      speed: { min: 80, max: 180 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.2, end: 0 },
      alpha: { start: 1, end: 0.1 },
      quantity: 14,
      emitting: false,
    });
    emitter.explode(14, x, y);
    this.time.delayedCall(600, () => emitter.destroy());
  }

  refreshHud() {
    const unique = new Set(this.collectedThisRun);
    this.hudText.setText(`Skills: ${unique.size} / ${this.level.skills.length}    ESC: Pause`);
  }

  drawSkyGradient(top, bottom, width, height) {
    const key = `sky-${top}-${bottom}-${width}-${height}`;
    if (!this.textures.exists(key)) {
      const tex = this.textures.createCanvas(key, width, height);
      const ctx = tex.getContext();
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, hex(top));
      gradient.addColorStop(1, hex(bottom));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      tex.refresh();
    }
    this.add.image(0, 0, key).setOrigin(0, 0).setScrollFactor(0.4);
  }

  drawSilhouette(level) {
    const color = level.silhouette?.color ?? 0x6b3a1a;
    const alpha = level.silhouette?.alpha ?? 0.55;
    const worldWidth = level.worldWidth;
    const worldHeight = level.worldHeight;
    const g = this.add.graphics();
    g.setScrollFactor(0.7);
    g.fillStyle(color, alpha);
    const baseY = worldHeight - 80;
    let x = 0;
    let seed = (level.key.length * 37) % 200;
    while (x < worldWidth) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const w = 90 + (seed % 90);
      const h = 70 + ((seed >> 4) % 110);
      g.fillRect(x, baseY - h, w, h);
      g.fillTriangle(x, baseY - h, x + w / 2, baseY - h - 30, x + w, baseY - h);
      x += w + 8;
    }
  }

  spawnSnow(worldWidth) {
    const key = "snowflake";
    if (!this.textures.exists(key)) {
      const g = this.add.graphics();
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(2, 2, 2);
      g.generateTexture(key, 4, 4);
      g.destroy();
    }
    this.add.particles(0, 0, key, {
      x: { min: 0, max: worldWidth },
      y: -10,
      lifespan: 8000,
      speedY: { min: 30, max: 70 },
      speedX: { min: -10, max: 10 },
      scale: { start: 1, end: 0.6 },
      alpha: { start: 0.85, end: 0.4 },
      quantity: 1,
      frequency: 100,
    }).setScrollFactor(0.6);
  }

  ensureOrbTexture(color) {
    const key = `orb-${color}`;
    if (this.textures.exists(key)) return key;
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.25);
    g.fillCircle(12, 12, 12);
    g.fillStyle(color, 1);
    g.fillCircle(12, 12, 8);
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(9, 9, 2);
    g.generateTexture(key, 24, 24);
    g.destroy();
    return key;
  }

  ensureObstacleTexture(type, color) {
    const key = `obstacle-${type}-${color ?? "default"}`;
    if (this.textures.exists(key)) return key;
    const g = this.add.graphics();
    switch (type) {
      case "browser-bug":
        g.fillStyle(color ?? 0x4286f4, 1);
        g.fillCircle(14, 16, 12);
        g.fillStyle(0x000000, 1);
        g.fillCircle(10, 14, 2);
        g.fillCircle(18, 14, 2);
        g.lineStyle(2, 0x000000, 1);
        g.beginPath();
        g.moveTo(2, 18); g.lineTo(0, 14);
        g.moveTo(2, 22); g.lineTo(0, 24);
        g.moveTo(26, 18); g.lineTo(28, 14);
        g.moveTo(26, 22); g.lineTo(28, 24);
        g.strokePath();
        break;
      case "auth-gate":
        g.fillStyle(color ?? 0x903030, 1);
        g.fillRect(2, 4, 24, 22);
        g.fillStyle(0xf4d35e, 1);
        g.fillRect(12, 12, 4, 6);
        g.fillCircle(14, 12, 3);
        break;
      case "code-review":
        g.fillStyle(0x141728, 1);
        g.fillRect(2, 6, 24, 18);
        g.lineStyle(2, color ?? 0xe55934, 1);
        g.beginPath();
        for (let i = 0; i < 24; i += 2) {
          const y = i % 4 === 0 ? 13 : 17;
          g.lineTo(2 + i, y);
        }
        g.strokePath();
        break;
      case "flaky-test":
        g.fillStyle(color ?? 0xff6fa3, 1);
        g.fillRoundedRect(2, 4, 24, 22, 4);
        g.fillStyle(0xffffff, 1);
        g.fillRect(7, 11, 14, 2);
        g.fillRect(7, 17, 10, 2);
        g.fillStyle(0x000000, 1);
        g.fillCircle(22, 6, 2);
        break;
      case "paper-stack":
        g.fillStyle(color ?? 0xeae0c8, 1);
        g.fillRect(2, 18, 24, 8);
        g.fillStyle(0xd4c89f, 1);
        g.fillRect(4, 12, 22, 7);
        g.fillStyle(0xeae0c8, 1);
        g.fillRect(2, 6, 24, 7);
        g.lineStyle(1, 0x888266, 1);
        g.beginPath();
        g.moveTo(5, 9); g.lineTo(23, 9);
        g.moveTo(5, 15); g.lineTo(23, 15);
        g.moveTo(5, 21); g.lineTo(23, 21);
        g.strokePath();
        break;
      case "scaling-spike":
        g.fillStyle(color ?? 0xa6c8e0, 1);
        g.fillTriangle(14, 2, 26, 26, 2, 26);
        g.fillStyle(0xffffff, 0.6);
        g.fillTriangle(14, 8, 20, 22, 8, 22);
        break;
      default:
        g.fillStyle(0xb0b0b0, 0.85);
        g.fillCircle(14, 14, 14);
    }
    g.generateTexture(key, 28, 28);
    g.destroy();
    return key;
  }

  ensureGoalTexture() {
    const key = "goal-flag";
    if (this.textures.exists(key)) return key;
    const g = this.add.graphics();
    g.fillStyle(0x222222, 1);
    g.fillRect(8, 0, 2, 48);
    g.fillStyle(COLORS.goal, 1);
    g.fillTriangle(10, 4, 30, 12, 10, 20);
    g.generateTexture(key, 32, 48);
    g.destroy();
    return key;
  }
}

function hex(num) {
  return "#" + num.toString(16).padStart(6, "0");
}
