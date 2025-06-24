// clean-cache.js
// Run with: node clean-cache.js

const fs = require('fs');
const path = require('path');

function deleteFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`Deleted: ${folderPath}`);
  } else {
    console.log(`Not found: ${folderPath}`);
  }
}

deleteFolder(path.join(__dirname, 'frontend', '.next'));
deleteFolder(path.join(__dirname, 'frontend', 'node_modules', '.cache'));
console.log('Cache clean complete.');
