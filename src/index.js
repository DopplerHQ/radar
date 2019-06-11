const filesystem = require('./filesystem');
const filetypes = require('./filetypes.json');
const { Key, File, ScannedFile } = require('./objects');

const Config = {
  maxFileSizeMiB: 10,
  excludedFileTypes: [...filetypes.audio, ...filetypes.video, ...filetypes.image, ...filetypes.compressed],
  excludedFiles: ['package-lock.json'],
  excludedDirectories: ['.git', 'node_modules', '.vscode'],
};

const oneMebibyte = 1024 * 1024;

async function scanFile(path) {
  // TODO implement
}

/**
 * @param {String} path
 */
async function scanDirectory(path) {
  // TODO some security around relative paths
  await filesystem.pathExists(path)
    .then(exists => (!exists && Promise.reject(`Path does not exist: ${path}`)));

  await filesystem.getFileStats(path)
    .then(stats => (!stats.isDirectory() && Promise.reject(`Path must be a directory: ${path}`)))

  return _scanDirectory(path);
}

/**
 * @param {String} path
 * @param {Array<Object>} results array containing all scan results
 */
async function _scanDirectory(path, results = {}) {
  const dirEntries = await filesystem.getDirectoryEntries(path);

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

      const fileStats = await filesystem.getFileStats(entryPath);
      const fileSize = fileStats.size;
      const fileSizeInMiB = (fileSize / oneMebibyte);
      if (fileSizeInMiB > Config.maxFileSizeMiB) {
        continue;
      }

      const file = new File(entry.name, path, fileSize);
      if (Config.excludedFileTypes.includes(file.extension())) {
        continue;
      }

      const fullPath = file.fullPath();
      const scannedFile = await scanFileForKeys(file);
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
async function scanFileForKeys(file, onRead) {
  const scannedFile = new ScannedFile(file);
  return filesystem.readFile(scannedFile, onLineRead)
    .catch(() => new ScannedFile(file));
}

/**
 *
 * @param {ScannedFile} scannedFile
 * @param {String} line
 * @param {Number} lineNumber
 */
async function onLineRead(scannedFile, line, lineNumber) {
        const keys = await findKeys(line);
        if (keys.length === 0) {
          return;
        }

        for (const key of keys) {
    scannedFile.addKey(new Key(key, lineNumber));
    }
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
