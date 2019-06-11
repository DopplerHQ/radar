const fs = require('fs');
const readline = require('readline');

const filesystem = require('./filesystem');
const { Key, File, ScannedFile } = require('./objects');

const audioFileTypes = ['aif', 'cda', 'mid', 'mp3', 'mpa', 'ogg', 'wav', 'wma', 'wpl'];
const videoFileTypes = ['3g2', '3gp', 'avi', 'flv', 'h264', 'm4v', 'mkv', 'mov', 'mp4', 'mpg', 'mpeg', 'rm', 'swf', 'vob', 'wmv'];
const imageFileTypes = ['ai', 'bmp', 'gif', 'ico', 'jpeg', 'jpg', 'png', 'ps', 'psd', 'svg', 'tif', 'tiff'];
const compressedFileTypes = ['7z', 'arj', 'deb', 'pkg', 'rar', 'rpm', 'gz', 'z', 'zip'];

const Config = {
  maxFileSizeMiB: 10,
  excludedFileTypes: [...audioFileTypes, ...videoFileTypes, ...imageFileTypes, ...compressedFileTypes],
  excludedFiles: ['package-lock.json'],
  excludedDirectories: ['.git', 'node_modules', '.vscode'],
};

async function scanFile(path) {
  // TODO implement
}

/**
 * @param {String} path
 */
async function scanDirectory(path) {
  // TODO some security around relative paths
  const exists = await filesystem.isPathExists(path);
  if (!exists) {
    return Promise.reject(new Error(`Path does not exist: ${path}`));
  }

  const pathStats = await filesystem.getFileStats(path)
    .catch((err) => {
      console.error(err);
      return null;
    })
  if ((pathStats === null) || !pathStats.isDirectory()) {
    return Promise.reject(new Error(`Path must be a directory: ${path}`));
  }

  return _scanDirectory(path);
}

/**
 * @param {String} path
 * @param {Array<Object>} results array containing all scan results
 */
async function _scanDirectory(path, results = {}) {
  const dirEntries = await filesystem.getDirectoryEntries(path)
    .catch((err) => {
      console.error(err);
      return null;
    })
  if (dirEntries === null) {
    return Promise.reject(new Error(`Error reading path: ${path}`));
  }

  for (const entry of dirEntries) {
    const entryPath = `${path}/${entry.name}`;

    if (entry.isDirectory()) {
      const isDirectoryExcluded = Config.excludedDirectories.includes(entry.name);
      if (isDirectoryExcluded) {
        continue;
      }

      await _scanDirectory(entryPath, results);
    }

    if (entry.isFile()) {
      const isFileExcluded = Config.excludedFiles.includes(entry.name);
      if (isFileExcluded) {
        continue;
      }

      const fileStats = await filesystem.getFileStats(entryPath)
        .catch((err) => {
          console.error(err);
          return null;
        });
      if (fileStats === null) {
        return Promise.reject(new Error(`Error reading file: ${entryPath}`));
      }

      const fileSize = fileStats.size;
      const fileSizeInMiB = (fileSize / (1024 * 1024));
      if (fileSizeInMiB > Config.maxFileSizeMiB) {
        continue;
      }

      const file = new File(entry.name, path, fileSize);
      if (Config.excludedFileTypes.includes(file.extension())) {
        continue;
      }

      const fullPath = file.fullPath();
      const scannedFile = await _scanFile(file);
      if (scannedFile.hasKeys()) {
        results[fullPath] = scannedFile.toObject();
      }
    }
  }

  return results;
}

/**
 * @param {File} file
 */
async function _scanFile(file) {
  const scannedFile = await scanFileForKeys(file)
    .catch((err) => {
      console.error(new Error(`Error reading file: ${file.fullPath()}`));
      return null;
    });

  if (scannedFile === null) {
    return new ScannedFile(file);
  }

  return scannedFile;
}

/**
 * @param {File} file
 */
async function scanFileForKeys(file) {
  const rl = readline.createInterface({
    input: fs.createReadStream(file.fullPath()),
    crlfDelay: Infinity
  });

  return new Promise((resolve, reject) => {
    try {
      const scannedFile = new ScannedFile(file);
      let lineNumber = 0;

      rl.on('line', async (line) => {
        ++lineNumber;
        // copy the line number so it can be asynchronously incremented without messing up our local number
        const currLineNumber = lineNumber;

        const keys = await findKeys(line);
        if (keys.length === 0) {
          return;
        }

        for (const key of keys) {
          scannedFile.addKey(new Key(key, currLineNumber));
        }
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

/**
 * @param {String} line
 */
async function findKeys(line) {
  const keys = [];
  for (const word of line.split(' ')) {
    if (!isValidCharacters(word)) {
      continue;
    }

    let ruleMatches = 0;

    if (word.length > 15) {
      ++ruleMatches;
    }

    if ((word.startsWith('\'') && word.endsWith('\''))
      || (word.startsWith('"') && word.endsWith('"'))
      || (word.startsWith('`') && word.endsWith('`'))) {
      ++ruleMatches;
    }

    if (word.includes('://')) {
      ++ruleMatches;
    }

    if (containsLetters(word) && containsNumbers(word)) {
      ++ruleMatches;
    }

    if (containsDelimeters(word)) {
      ++ruleMatches;
    }

    // TODO explicitly check for (and include) email addresses?
    // TODO check strings against a dictionary?
    // TODO check word entropy

    // TODO weight each of the above rules, rather than this simplistic algo
    if (ruleMatches >= 2) {
      keys.push(word);
    }
  }
  return keys;
}

/**
 * Checks for alphanumerics and common symbols
 * @param {String} text
 */
function isValidCharacters(text) {
  for (let i = 0; i < text.length; ++i) {
    const charCode = text[i].charCodeAt(0);
    const isValid = (charCode >= 33) && (charCode <= 126);
    if (!isValid) {
      return false;
    }
  }
  return true;
}

function containsLetters(text) {
  return text.match(/[a-zA-Z]/i);
}

function containsNumbers(text) {
  return text.match(/[0-9]/i);
}

function containsDelimeters(text) {
  // removed period and underscore due to prevalence in variable names
  // return text.match(/(\.|-|_|\+|&|=)/i);
  return text.match(/(-|\+|&|=)/i);
}

module.exports = { scanDirectory, scanFile }
