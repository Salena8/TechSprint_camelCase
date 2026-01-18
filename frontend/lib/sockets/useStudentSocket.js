// lib/sockets/useStudentSocket.js
import { useEffect } from "react";
import { getSocketInstance } from "./socket";

export default function useStudentSocket({ classId, studentId, name, onSlideChange, onQuizStart, onLessonUpdate }) {
  useEffect(() => {
    if (!classId || !studentId) return;
    const socket = getSocketInstance();
    socket.connect();

    socket.on('connect', () => {
      console.log('Student socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Student socket disconnected');
    });

    // join as student
    console.log('Student emitting join:', { classId, studentId, name });
    socket.emit("join", { classId, studentId, name });

    const slideHandler = (payload) => {
      // backend emits { index }
      onSlideChange && onSlideChange(payload);
    };
    const quizHandler = (payload) => {
      onQuizStart && onQuizStart(payload);
    };
    const lessonUpdateHandler = (payload) => {
      // backend emits { files: [...] }
      console.log('Student received lessonUpdated:', payload);
      onLessonUpdate && onLessonUpdate(payload);
    };

    socket.on("slideChange", slideHandler);
    socket.on("startQuiz", quizHandler);
    socket.on("lessonUpdated", lessonUpdateHandler);
    

    
    const pingInterval = setInterval(() => {
      socket.emit("attendancePing", { classId, studentId });
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      socket.off("slideChange", slideHandler);
      socket.off("startQuiz", quizHandler);
      socket.off("lessonUpdated", lessonUpdateHandler);
      socket.disconnect();
    };
  }, [classId, studentId, name, onSlideChange, onQuizStart, onLessonUpdate]);
}
