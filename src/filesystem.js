const fs = require('fs');
const readline = require('readline');
const temp = require('temp').track();

const ScannedFile = require('./objects/scannedfile');

class Filesystem {
  /**
   * @param {String} path
   */
  static async pathExists(path) {
    return Promise.resolve(fs.existsSync(path));
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
    })
      .finally(() => rl.close());
  }

  static async makeTempDirectory(name) {
    return new Promise((resolve, reject) => {
      temp.mkdir(name, (err, info) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(info);
        }
      });
    });
  }

  /**
   *
   * @param {String} path
   * @param {String} basePath
   * @returns {String}
   */
  static getRelativePath(path, basePath) {
    if (!path.includes('/') || !basePath.includes('/') || !path.startsWith(basePath)) {
      return path;
    }

    let relativePath = path.substring(basePath.length);
    while (relativePath.startsWith('/')) {
      relativePath = relativePath.substring(1);
    }
    return relativePath;
  }
}

module.exports = Filesystem;
