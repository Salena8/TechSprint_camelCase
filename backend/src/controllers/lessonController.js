const path = require('path');
const { db, DATA_DIR } = require('../config/db');
const { moveFile, genDestPath, ensureDir } = require('../utils/fileUtils');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const LESSONS_DIR = path.join(DATA_DIR, 'lessons');
ensureDir(LESSONS_DIR);

// upload PDF files only for slides
exports.upload = async (req, res) => {
  try {
    const file = req.file;
    const { classId, title } = req.body;
    if (!file) return res.status(400).json({ error: 'file required' });

    // Validate file type - only PDF allowed
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: 'Only PDF files are allowed for slides' });
    }

    const finalDest = genDestPath(LESSONS_DIR, file.originalname);
    moveFile(file.path, finalDest);

    const id = uuidv4();
    const stmt = db.prepare('INSERT INTO lessons (id, class_id, title, filename, original_name, created_at) VALUES (?,?,?,?,?,?)');
    stmt.run(id, classId || null, title || file.originalname, finalDest, file.originalname, Date.now());

    // Notify connected clients about the lesson update
    console.log(`Emitting lessonUpdated to room ${classId} for file: ${title || file.originalname}`);
    req.io.to(classId).emit("lessonUpdated", {
      files: [{ id, title: title || file.originalname, url: `/lessons/${path.basename(finalDest)}`, original_name: file.originalname, created_at: Date.now() }]
    });

    res.json({ ok: true, id, title: title || file.originalname });
  } catch (err) {
    console.error('upload error', err);
    res.status(500).json({ error: 'upload failed' });
  }
};

exports.list = (req, res) => {
  const { classId } = req.query;
  const rows = classId
    ? db.prepare('SELECT id, title, filename, original_name, created_at FROM lessons WHERE class_id = ? ORDER BY created_at DESC').all(classId)
    : db.prepare('SELECT id, title, filename, original_name, created_at FROM lessons ORDER BY created_at DESC').all();
  // For security, do not leak absolute path to client — return a relative URL path we serve later.
  const map = rows.map(r => ({
    id: r.id,
    title: r.title,
    url: `/lessons/${path.basename(r.filename)}`,
    original_name: r.original_name,
    created_at: r.created_at
  }));
  res.json(map);
};
