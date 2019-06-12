const filesystem = require('./filesystem');
const filetypes = require('./filetypes.json');
const { Key, File, ScannedFile } = require('./objects');
const { findKeys } = require('./scanner');

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
  const dirEntries = await filesystem.getDirectoryEntries(path, true);

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
    const { term, confidence } = key;
    scannedFile.addKey(new Key(term, lineNumber, confidence));
    }
}

module.exports = { scanDirectory, scanFile }
