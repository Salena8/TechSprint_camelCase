const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DATA_DIR = path.join(__dirname, '../../data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, 'db.sqlite');

let db;
try {
  db = new Database(DB_PATH);
  console.log('Database connected successfully');
} catch (error) {
  console.error('Failed to connect to database:', error);
  throw error;
}

// Create schema
try {
  db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  title TEXT,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  class_id TEXT,
  title TEXT,
  filename TEXT,
  original_name TEXT,
  created_at INTEGER,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id TEXT,
  student_id TEXT,
  joined_at INTEGER,
  last_seen INTEGER,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id TEXT,
  student_id TEXT,
  quiz_id TEXT,
  score INTEGER,
  submitted_at INTEGER
);
`);
  console.log('Database schema created successfully');
} catch (error) {
  console.error('Failed to create database schema:', error);
  throw error;
}

module.exports = { db, DATA_DIR };
