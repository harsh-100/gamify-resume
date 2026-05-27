import Phaser from "phaser";
import {
  PLAYER_SPEED,
  JUMP_VELOCITY,
  COYOTE_MS,
  JUMP_BUFFER_MS,
} from "../config/constants";

const RENDER_SCALE = 0.4;
const FRAME_W = 150;
const FRAME_H = 240;
const BODY_SRC_W = 80;
const BODY_SRC_H = 230;
const BODY_OFFSET_X = (FRAME_W - BODY_SRC_W) / 2;
const BODY_OFFSET_Y = FRAME_H - BODY_SRC_H - 2;

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player", 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(RENDER_SCALE);
    this.setOrigin(0.5, 0.5);

    this.body.setSize(BODY_SRC_W, BODY_SRC_H);
    this.body.setOffset(BODY_OFFSET_X, BODY_OFFSET_Y);

    this.setCollideWorldBounds(true);
    this.setMaxVelocity(PLAYER_SPEED, 900);

    this.lastGroundedAt = 0;
    this.jumpRequestedAt = -Infinity;
    this.facing = 1;
    this.currentAnim = null;

    this.play("player-idle");
  }

  requestJump(now) {
    this.jumpRequestedAt = now;
  }

  update(time, inputs) {
    const onGround = this.body.blocked.down || this.body.touching.down;
    if (onGround) this.lastGroundedAt = time;

    if (inputs.left && !inputs.right) {
      this.setVelocityX(-PLAYER_SPEED);
      this.facing = -1;
      this.setFlipX(true);
    } else if (inputs.right && !inputs.left) {
      this.setVelocityX(PLAYER_SPEED);
      this.facing = 1;
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    const withinCoyote = time - this.lastGroundedAt <= COYOTE_MS;
    const bufferedJump = time - this.jumpRequestedAt <= JUMP_BUFFER_MS;

    if (bufferedJump && withinCoyote) {
      this.setVelocityY(JUMP_VELOCITY);
      this.jumpRequestedAt = -Infinity;
      this.lastGroundedAt = -Infinity;
    }

    if (inputs.jumpReleased && this.body.velocity.y < JUMP_VELOCITY * 0.4) {
      this.setVelocityY(this.body.velocity.y * 0.5);
    }

    this.updateAnimation(onGround);
  }

  updateAnimation(onGround) {
    let next;
    if (!onGround) {
      next = this.body.velocity.y < 0 ? "player-jump" : "player-fall";
    } else if (Math.abs(this.body.velocity.x) > 5) {
      next = "player-walk";
    } else {
      next = "player-idle";
    }
    if (next !== this.currentAnim) {
      this.play(next);
      this.currentAnim = next;
    }
  }

  bump(dirX) {
    this.setVelocityX(dirX * PLAYER_SPEED * 0.9);
    this.setVelocityY(-220);
  }
}
