const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const classRoutes = require('./routes/classRoutes');
const lessonRoutes = require('./routes/lessonRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API
app.use('/api/class', classRoutes);
app.use('/api/lessons', lessonRoutes);

// Serve lessons folder (files are moved into data/lessons)
const LESSONS_DIR = path.join(__dirname, '../data/lessons');
if (!fs.existsSync(LESSONS_DIR)) fs.mkdirSync(LESSONS_DIR, { recursive: true });
app.use('/lessons', express.static(LESSONS_DIR, {
  setHeaders: (res, path) => {
    if (path.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Range');
      res.setHeader('Accept-Ranges', 'bytes');
    }
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});


const FRONTEND_OUT = path.join(__dirname, '../frontend_out');
if (fs.existsSync(FRONTEND_OUT)) {
  app.use(express.static(FRONTEND_OUT));
  app.get('*', (req, res) => {
    res.sendFile(path.join(FRONTEND_OUT, 'index.html'));
  });
}

module.exports = app;

