const fs = require('fs');
const readline = require('readline');

const { ScannedFile } = require('./objects');

class Filesystem {
  /**
   * @param {String} path
   */
  static async pathExists(path) {
    return new Promise((resolve) => {
      if (fs.existsSync(path))
        return resolve(true);
      return resolve(false);
    });
  }

  /**
   * @param {String} path
   */
  static async getFileStats(path) {
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
   * @param {Boolean} withFileTypes true if fs.Dirent objects should be returned
   */
  static async getDirectoryEntries(path, withFileTypes = false) {
    return new Promise((resolve, reject) => {
      fs.readdir(path, { withFileTypes }, (err, files) => {
        if (err) {
          return reject(err);
        }
        return resolve(files);
      });
    })
  }

  /**
   *
   * @param {ScannedFile} scannedFile file to read
   * @param {Function} onLineRead function to call after a new line is read from the file
   */
  static async readFile(scannedFile, onLineRead) {
    const filePath = scannedFile.file().fullPath();
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity
    });

    return new Promise((resolve, reject) => {
      try {
        let lineNumber = 0;

        rl.on('line', async (line) => {
          ++lineNumber;
          const currLineNumber = lineNumber;
          onLineRead(scannedFile, line, currLineNumber);
        });

        rl.on('close', () => {
          resolve(scannedFile);
        })
      }
      catch(err) {
        reject(err);
      }
    });
  }
}

module.exports = Filesystem;
