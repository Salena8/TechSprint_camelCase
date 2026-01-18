const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure tmp directory exists
const tmpDir = path.join(__dirname, '../../tmp');
try {
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
    console.log('Created tmp directory:', tmpDir);
  }
} catch (error) {
  console.error('Failed to create tmp directory:', error);
  // Fallback to system temp directory
  const os = require('os');
  const tmpDir = os.tmpdir();
}

const tmp = multer({
  dest: tmpDir,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Basic validation
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});
const lessonController = require('../controllers/lessonController');

router.post('/upload', tmp.single('file'), lessonController.upload);
router.get('/', lessonController.list);

module.exports = router;
