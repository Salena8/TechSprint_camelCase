// lib/classroom.js
const SERVER = (typeof window !== "undefined" && window.__SERVER_URL__) || "http://localhost:8000";

export async function createClass(title) {
  const res = await fetch(`${SERVER}/api/class/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function uploadLesson(file, classId, title) {
  const fd = new FormData();
  fd.append("file", file);
  if (classId) fd.append("classId", classId);
  if (title) fd.append("title", title);
  const res = await fetch(`${SERVER}/api/lessons/upload`, {
    method: "POST",
    body: fd,
  });
  return res.json();
}

export async function listLessons(classId = "") {
  const qs = classId ? `?classId=${encodeURIComponent(classId)}` : "";
  const res = await fetch(`${SERVER}/api/lessons${qs}`);
  return res.json();
}

export function absoluteLessonUrl(url) {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const origin = (typeof window !== "undefined" && window.__SERVER_URL__) || "http://localhost:8000";
  if (url.startsWith("/")) return `${origin}${url}`;
  return `${origin}/${url}`;
}
