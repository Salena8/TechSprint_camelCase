// components/teacher/AttendanceTracker.js
import { useEffect, useState } from "react";
import { getSocketInstance } from "@/lib/sockets/socket";
import { absoluteLessonUrl } from "@/lib/classroom";

export default function AttendanceTracker({ classCode }) {
  const [rows, setRows] = useState([]); // { student_id, name, joined_at, last_seen }
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!classCode) return;
    // fetch attendance from backend REST
    fetch(`${(typeof window !== "undefined" && window.__SERVER_URL__) || "http://localhost:8000"}/api/class/${classCode}/attendance`)
      .then((r) => r.json())
      .then((data) => {
        setRows(data || []);
        setLastUpdated(Date.now());
      });

    const socket = getSocketInstance();
    socket.connect();

    function onJoin(payload) {
      // payload: { id, name }
      // add/update rows
      const now = Date.now();
      setRows((prev) => {
        if (prev.find((p) => p.student_id === payload.id)) {
          return prev.map((p) => (p.student_id === payload.id ? { ...p, name: payload.name, last_seen: now } : p));
        }
        return [...prev, { student_id: payload.id, name: payload.name, joined_at: now, last_seen: now }];
      });
      setLastUpdated(Date.now());
    }

    function onAttendancePing(payload) {
      // payload: { classId, studentId }
      setRows((prev) => prev.map((p) => (p.student_id === payload.studentId ? { ...p, last_seen: Date.now() } : p)));
      setLastUpdated(Date.now());
    }

    socket.on("join", onJoin);
    socket.on("attendancePing", onAttendancePing);

    return () => {
      socket.off("join", onJoin);
      socket.off("attendancePing", onAttendancePing);
    };
  }, [classCode]);

  // compute metrics
  const now = Date.now();
  const presentThreshold = 1000 * 60 * 5; // 5 minutes considered present
  const total = rows.length;
  const present = rows.filter((r) => (now - (r.last_seen || r.joined_at || 0)) < presentThreshold).length;
  const leftEarly = total - present;
  const attendanceRate = total ? Math.round((present / total) * 100) : 0;

  function fmt(ts) {
    if (!ts) return "-";
    const d = new Date(ts);
    return d.toLocaleTimeString();
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl-2 p-4 shadow-soft text-center">
          <div className="text-sm text-gray-500">Total Students</div>
          <div className="text-2xl font-bold">{total}</div>
        </div>
        <div className="bg-white rounded-xl-2 p-4 shadow-soft text-center">
          <div className="text-sm text-gray-500">Currently Present</div>
          <div className="text-2xl font-bold text-green-600">{present}</div>
        </div>
        <div className="bg-white rounded-xl-2 p-4 shadow-soft text-center">
          <div className="text-sm text-gray-500">Left Early</div>
          <div className="text-2xl font-bold text-red-500 py-5">{leftEarly}</div>
        </div>
        <div className="bg-white rounded-xl-2 p-4 shadow-soft text-center">
          <div className="text-sm text-gray-500">Attendance Rate</div>
          <div className="text-2xl font-bold">{attendanceRate}%</div>
        </div>
      </div>

      <div className="bg-white rounded-xl-2 p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Live Attendance</h4>
          <div className="text-xs text-gray-400">Updated {lastUpdated ? `${Math.round((Date.now() - lastUpdated) / 1000)}s` : "—"} ago</div>
        </div>

        <ul className="mt-3 space-y-3">
          {rows.map((r) => (
            <li key={r.student_id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{r.name || r.student_id}</div>
                <div className="text-xs text-gray-500">Joined: {fmt(r.joined_at)}</div>
              </div>
              <div className="text-sm text-gray-600">
                { (Date.now() - (r.last_seen || 0)) < presentThreshold ? <span className="text-green-600">Present</span> : <span className="text-red-500">Left</span> }
              </div>
            </li>
          ))}
          {rows.length === 0 && <li className="text-sm text-gray-400">No students yet</li>}
        </ul>
      </div>
    </div>
  );
}
