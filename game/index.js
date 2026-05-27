import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from "./config/constants";
import BootScene from "./scenes/BootScene";
import MenuScene from "./scenes/MenuScene";
import LevelScene from "./scenes/LevelScene";
import StoryCardScene from "./scenes/StoryCardScene";
import PortalRoomScene from "./scenes/PortalRoomScene";
import FinaleScene from "./scenes/FinaleScene";
import PauseScene from "./scenes/PauseScene";

export function createGame(parent) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: COLORS.bg,
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    scene: [BootScene, MenuScene, LevelScene, StoryCardScene, PortalRoomScene, FinaleScene, PauseScene],
  });
}
