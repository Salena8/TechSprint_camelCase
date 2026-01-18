// components/teacher/UploadLessonPack.js
import { useState, useEffect } from "react";
import { uploadLesson, listLessons, absoluteLessonUrl } from "@/lib/classroom";

export default function UploadLessonPack({ classId }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    if (classId) load();
  }, [classId]);

  async function load() {
    const list = await listLessons(classId);
    setLessons(list || []);
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return alert("Select a file");
    try {
      await uploadLesson(file, classId, title || file.name);
      setFile(null);
      setTitle("");
      await load();
      alert("Uploaded");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  }

  return (
    <div className="bg-white rounded-xl-2 p-4 shadow-soft">
      <h4 className="font-semibold mb-3">Upload PDF Lesson</h4>
      <form onSubmit={handleUpload} className="flex gap-2 items-center">
        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
        <input type="text" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} className="p-2 border rounded" />
        <button type="submit" className="px-4 py-2 rounded bg-pastel-green">Upload</button>
      </form>

      <div className="mt-4">
        <h5 className="text-sm text-gray-600 mb-2">Uploaded Files</h5>
        <ul className="space-y-2">
          {lessons.length === 0 && <li className="text-sm text-gray-400">No uploaded files</li>}
          {lessons.map((l) => (
            <li key={l.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{l.title}</div>
                <div className="text-xs text-gray-500">{new Date(l.created_at).toLocaleString()}</div>
              </div>
              <div>
                <a href={absoluteLessonUrl(l.url)} target="_blank" rel="noreferrer" className="text-blue-600 mr-3">View</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
