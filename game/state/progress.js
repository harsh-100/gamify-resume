import { STORAGE_KEY } from "../config/constants";

const defaultProgress = () => ({
  completedLevels: [],
  collectedSkills: [],
  lastVisited: null,
});

export function loadProgress() {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw);
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage errors (private mode, quota, etc.)
  }
}

export function markLevelComplete(levelKey, skillsCollected = []) {
  const progress = loadProgress();
  if (!progress.completedLevels.includes(levelKey)) {
    progress.completedLevels.push(levelKey);
  }
  for (const skill of skillsCollected) {
    if (!progress.collectedSkills.includes(skill)) {
      progress.collectedSkills.push(skill);
    }
  }
  progress.lastVisited = levelKey;
  saveProgress(progress);
  return progress;
}
