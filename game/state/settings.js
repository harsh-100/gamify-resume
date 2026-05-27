const STORAGE_KEY = "harsh-quest-settings";

const defaults = () => ({
  reduceMotion: false,
});

function read() {
  if (typeof window === "undefined") return defaults();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults();
    return { ...defaults(), ...JSON.parse(raw) };
  } catch {
    return defaults();
  }
}

function write(s) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

export function getSettings() {
  return read();
}

export function isReduceMotion() {
  return read().reduceMotion;
}

export function setReduceMotion(value) {
  const s = read();
  s.reduceMotion = !!value;
  write(s);
  return s.reduceMotion;
}

export function toggleReduceMotion() {
  return setReduceMotion(!isReduceMotion());
}
