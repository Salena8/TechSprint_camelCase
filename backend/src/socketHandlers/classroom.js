
const {db} = require('../config/db');

module.exports = function(io) {
  const teacherForClass = new Map();

  io.on('connection', (socket) => {
    console.log('[socket] connected', socket.id);

    // Teacher starts class (will join room)
    // payload: { classId }
    socket.on('startClass', (payload) => {
      const { classId } = payload;
      if (!classId) return;
      teacherForClass.set(classId, socket.id);
      socket.join(classId);
      console.log(`[socket] class started ${classId} by ${socket.id}`);
      io.to(classId).emit('classStarted', { classId });
    });

    // Student joins class
    socket.on('join', (payload) => {
      try {
        const { classId, studentId, name } = payload;
        console.log(`[socket] join event received:`, payload);
        if (!classId || !studentId) return;
    
        socket.join(classId);
        console.log(`[socket] student ${studentId} joined room ${classId}`);
    
        // 1️ ENSURE CLASS EXISTS 
        const cls = db.prepare('SELECT id FROM classes WHERE id = ?').get(classId);
        if (!cls) {
          console.warn(`[socket] class ${classId} does not exist, skipping attendance`);
          return;
        }
    
        // ENSURE STUDENT EXISTS
        const s = db.prepare('SELECT id FROM students WHERE id = ?').get(studentId);
        if (!s) {
          db.prepare(
            'INSERT INTO students (id, name, created_at) VALUES (?,?,?)'
          ).run(studentId, name || 'Student', Date.now());
        } else if (name) {
          db.prepare('UPDATE students SET name = ? WHERE id = ?')
            .run(name, studentId);
        }
    
       
        const att = db.prepare(
          'SELECT id FROM attendance WHERE class_id = ? AND student_id = ?'
        ).get(classId, studentId);
    
        if (!att) {
          db.prepare(
            'INSERT INTO attendance (class_id, student_id, joined_at, last_seen) VALUES (?,?,?,?)'
          ).run(classId, studentId, Date.now(), Date.now());
        } else {
          db.prepare(
            'UPDATE attendance SET last_seen = ? WHERE id = ?'
          ).run(Date.now(), att.id);
        }
    
        
        io.to(classId).emit('join', { id: studentId, name });
    
        console.log(`[socket] ${name || studentId} joined ${classId}`);
      } catch (err) {
        console.error('[socket][join] DB error:', err.message);
      }
    });
    

    // Slide change (teacher emits)
    // payload: { classId, index } or { classId, page }
    socket.on('slideChange', (payload) => {
      const { classId, index, page } = payload;
      if (!classId) return;
      console.log(`[socket] slide change in ${classId}:`, { index, page });
      io.to(classId).emit('slideChange', { index, page });
      
    });
    socket.on("requestLesson", ({ code }) => {
      console.log(`[socket] requestLesson for code: ${code}`);
    });
    

    // Start quiz (teacher emits)
    // payload: { classId, quizId, quizData }
    socket.on('startQuiz', (payload) => {
      const { classId, quizId, quizData } = payload;
      if (!classId) return;
      io.to(classId).emit('startQuiz', { quizId, quizData });
    });

    // Student submits answer
    // payload: { classId, studentId, quizId, score }
    socket.on('submitAnswer', (payload) => {
      const { classId, studentId, quizId, score } = payload;
      if (!classId || !studentId || quizId == null) return;
      db.prepare('INSERT INTO quiz_results (class_id, student_id, quiz_id, score, submitted_at) VALUES (?,?,?,?,?)')
        .run(classId, studentId, quizId, score || 0, Date.now());

      // Emit result to room for leaderboard update
      io.to(classId).emit('quizResult', { studentId, quizId, score });
    });

   
    socket.on('attendancePing', (payload) => {
      const { classId, studentId } = payload;
      if (!classId || !studentId) return;
      const att = db.prepare('SELECT id FROM attendance WHERE class_id = ? AND student_id = ?').get(classId, studentId);
      if (att) {
        db.prepare('UPDATE attendance SET last_seen = ? WHERE id = ?').run(Date.now(), att.id);
      }
    });

    socket.on('disconnect', () => {
      console.log('[socket] disconnect', socket.id);
      // If a teacher disconnects, we could notify the room
      for (const [classId, teacherSid] of teacherForClass.entries()) {
        if (teacherSid === socket.id) {
          teacherForClass.delete(classId);
          io.to(classId).emit('teacherDisconnected', { classId });
        }
      }
    });
  });
};
