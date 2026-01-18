const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function moveFile(tmpPath, destPath) {
  ensureDir(path.dirname(destPath));
  fs.renameSync(tmpPath, destPath);
  return destPath;
}

function genDestPath(destDir, originalName) {
  const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.\-_]/g,'_')}`;
  return path.join(destDir, safeName);
}

module.exports = { ensureDir, moveFile, genDestPath };
