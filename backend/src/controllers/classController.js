const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// create a new class (teacher)
exports.createClass = (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'title required' });

    const id = uuidv4().split('-')[0].toUpperCase(); // short code
    const stmt = db.prepare('INSERT INTO classes (id, title, created_at) VALUES (?,?,?)');
    stmt.run(id, title, Date.now());
    res.json({ ok: true, id, title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'create failed' });
  }
};

exports.getClass = (req, res) => {
  const { id } = req.params;
  const cls = db.prepare('SELECT id, title, created_at FROM classes WHERE id = ?').get(id);
  if (!cls) return res.status(404).json({ error: 'class not found' });
  res.json(cls);
};

// list attendance for a class
exports.getAttendance = (req, res) => {
  const { id } = req.params;
  const rows = db.prepare(`
    SELECT a.student_id, s.name, a.joined_at, a.last_seen
    FROM attendance a
    LEFT JOIN students s ON s.id = a.student_id
    WHERE a.class_id = ?
    ORDER BY a.joined_at ASC
  `).all(id);
  res.json(rows);
};
