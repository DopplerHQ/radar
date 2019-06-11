const fs = require('fs');

/**
 * @param {String} path
 */
async function isPathExists(path) {
  return new Promise((resolve) => {
    if (fs.existsSync(path))
      return resolve(true);
    return resolve(false);
  });
}

/**
 * @param {String} path
 */
async function getFileStats(path) {
  return new Promise((resolve, reject) => {
    fs.lstat(path, (err, stats) => {
      if (err) {
        return reject(err);
      }
      return resolve(stats);
    });
  });
}

/**
 * @param {String} path
 */
async function getDirectoryEntries(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, { withFileTypes: true }, (err, files) => {
      if (err) {
        return reject(err);
      }
      return resolve(files);
    });
  })
}

module.exports = { isPathExists, getFileStats, getDirectoryEntries }
