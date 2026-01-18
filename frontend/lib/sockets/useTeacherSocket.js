// lib/sockets/useTeacherSocket.js
import { useEffect } from "react";
import { getSocketInstance } from "./socket";

export default function useTeacherSocket(classId, handlers = {}) {
  
  useEffect(() => {
    if (!classId) return;

    const socket = getSocketInstance();
    socket.connect();

    socket.on('connect', () => {
      console.log('Teacher socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Teacher socket disconnected');
    });

    // Start/join teacher socket to the class room
    console.log('Teacher starting class:', classId);
    socket.emit("startClass", { classId });

    // Listen for class started confirmation
    socket.on("classStarted", (data) => {
      console.log('Teacher received classStarted:', data);
    });

    const onJoin = (data) => {
      console.log('Teacher received student join:', data);
      handlers.onStudentJoin && handlers.onStudentJoin(data);
    };
    const onQuizResult = (data) => {
      handlers.onQuizResult && handlers.onQuizResult(data);
    };

    socket.on("join", onJoin);

    socket.on("lessonUpdated", ({ files }) => {
      setLessonFiles(files);
      const pdf = files.find(f => f.type === "pdf");
      if (pdf) setCurrentPdf(pdf.url);
    });
    

    socket.on("quizResult", onQuizResult);

    return () => {
      socket.off("join", onJoin);
      socket.off("quizResult", onQuizResult);
      socket.disconnect();
    };
  }, [classId]);
}
