import { level1Jaipur } from "./level-1-jaipur";
import { level2Tribal } from "./level-2-tribal";
import { level3Img } from "./level-3-img";
import { level4OngraphTrainee } from "./level-4-ongraph-trainee";
import { level5OngraphDev } from "./level-5-ongraph-dev";
import { level6Celebal } from "./level-6-celebal";
import { level7Dortmund } from "./level-7-dortmund";
import { level8Showcase } from "./level-8-showcase";

export const LEVELS = [
  level1Jaipur,
  level2Tribal,
  level3Img,
  level4OngraphTrainee,
  level5OngraphDev,
  level6Celebal,
  level7Dortmund,
  level8Showcase,
];

export function getLevelByKey(key) {
  return LEVELS.find((l) => l.key === key);
}

export function getNextLevel(currentKey) {
  const idx = LEVELS.findIndex((l) => l.key === currentKey);
  if (idx === -1 || idx === LEVELS.length - 1) return null;
  return LEVELS[idx + 1];
}

export function getFirstUncompletedLevel(completedKeys) {
  return LEVELS.find((l) => !completedKeys.includes(l.key)) || LEVELS[0];
}
