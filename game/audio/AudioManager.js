const BGM_KEY = "bgm-main";
const STORAGE_MUTE_KEY = "harsh-quest-mute";
const REGISTRY_KEY = "gamify-bgm-instance";

function getStoredMute() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_MUTE_KEY) === "1";
}

function setStoredMute(value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_MUTE_KEY, value ? "1" : "0");
}

function getStoredSound(scene) {
  const sound = scene.game.registry.get(REGISTRY_KEY);
  if (!sound) return null;
  if (sound.manager && !sound.pendingRemove) return sound;
  return null;
}

export function startBgm(scene) {
  if (!scene.cache.audio.exists(BGM_KEY)) return;
  scene.sound.mute = getStoredMute();

  let sound = getStoredSound(scene);
  if (sound) {
    if (!sound.isPlaying) sound.play();
    return;
  }

  sound = scene.sound.add(BGM_KEY, { loop: true, volume: 0.45 });
  scene.game.registry.set(REGISTRY_KEY, sound);
  sound.play();
}

export function toggleMute(scene) {
  scene.sound.mute = !scene.sound.mute;
  setStoredMute(scene.sound.mute);
  return scene.sound.mute;
}

export function isMuted(scene) {
  return scene.sound.mute;
}

export function hasBgm(scene) {
  return scene.cache.audio.exists(BGM_KEY);
}

export function playSfx(scene, key, options = {}) {
  if (!scene.cache.audio.exists(key)) return;
  scene.sound.play(key, { volume: 0.6, ...options });
}
