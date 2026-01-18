// lib/idb.js - very small localStorage fallback for lessons
export function saveLessonsCache(classId, lessons) {
  try {
    localStorage.setItem(`lessons:${classId}`, JSON.stringify(lessons));
  } catch {}
}
export function loadLessonsCache(classId) {
  try {
    const raw = localStorage.getItem(`lessons:${classId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
