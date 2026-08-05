const PROGRESS_KEY = "excel-learn:completed";
const FAVORITES_KEY = "excel-learn:favorites";
const WRONG_KEY = "excel-learn:wrong";

function readSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeSet(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

export function getCompletedIds(): Set<string> {
  return readSet(PROGRESS_KEY);
}

export function markCompleted(id: string) {
  const s = readSet(PROGRESS_KEY);
  s.add(id);
  writeSet(PROGRESS_KEY, s);
}

export function getFavoriteIds(): Set<string> {
  return readSet(FAVORITES_KEY);
}

export function isFavorite(id: string): boolean {
  return readSet(FAVORITES_KEY).has(id);
}

export function toggleFavorite(id: string): boolean {
  const s = readSet(FAVORITES_KEY);
  if (s.has(id)) {
    s.delete(id);
  } else {
    s.add(id);
  }
  writeSet(FAVORITES_KEY, s);
  return s.has(id);
}

export function getWrongIds(): Set<string> {
  return readSet(WRONG_KEY);
}

export function addWrongAnswer(id: string) {
  const s = readSet(WRONG_KEY);
  s.add(id);
  writeSet(WRONG_KEY, s);
}

export function removeWrongAnswer(id: string) {
  const s = readSet(WRONG_KEY);
  s.delete(id);
  writeSet(WRONG_KEY, s);
}
