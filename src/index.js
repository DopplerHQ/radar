const filesystem = require('./filesystem');
const filetypes = require('./filetypes.json');
const { Key, File, ScannedFile } = require('./objects');
const { findKeys } = require('./scanner');

const Config = {
  maxFileSizeMiB: 10,
  includedFileTypes: [],
  includedFiles: [],
  includedDirectories: [],
  excludedFileTypes: [],
  excludedFiles: ['package-lock.json'],
  excludedDirectories: ['.git', 'node_modules', '.vscode'],
};
Object.keys(filetypes).forEach(filetype => Config.excludedFileTypes.push(...filetypes[filetype]));

const oneMebibyte = 1024 * 1024;

/**
TODO:
- support globs (folders and asterisks)
- support git repos
- support just scanning a file
- test against an api leak list to check effectiveness and false positive rate
- scan strings for high entropy words http://blog.dkbza.org/2007/05/scanning-data-for-entropy-anomalies.html
*/

async function scan(path) {
  const stats = await filesystem.getFileStats(path);

  await filesystem.pathExists(path)
    .then(exists => (!exists && Promise.reject(`Path does not exist: ${path}`)));

  if (stats.isDirectory()) {
    return scanDirectory(path);
  }

  if (stats.isFile()) {
    const name = path.substring(path.lastIndexOf('/') + 1);
    const parentDirPath = path.substring(0, path.lastIndexOf('/'));
    const results = await scanFile(name, parentDirPath);

    return results ? results.toObject() : {};
  }
}

/**
 * @param {String} path
 * @param {Array<Object>} results array containing all scan results
 */
async function scanDirectory(path, results = {}) {
  const dirEntries = await filesystem.getDirectoryEntries(path, true);

  for (const entry of dirEntries) {
    const entryPath = `${path}/${entry.name}`;

    if (entry.isDirectory()) {
      const isDirectoryExcluded = Config.excludedDirectories.includes(entry.name);
      if (isDirectoryExcluded) {
        continue;
      }

      await scanDirectory(entryPath, results);
    }

    if (entry.isFile()) {
      const scannedFile = await scanFile(entry.name, path)
        .catch(() => null);
      if (scannedFile && scannedFile.hasKeys()) {
        results[entryPath] = scannedFile.toObject();
      }
    }
  }

  return results;
}

async function scanFile(name, path) {
  const isFileExcluded = Config.excludedFiles.includes(name);
  if (isFileExcluded) {
    return Promise.reject();
  }

  const fullPath = `${path}/${name}`;
  const fileStats = await filesystem.getFileStats(fullPath);
  const fileSize = fileStats.size;
  const fileSizeInMiB = (fileSize / oneMebibyte);
  if (fileSizeInMiB > Config.maxFileSizeMiB) {
    return Promise.reject();
  }

  const file = new File(name, path, fileSize);
  if (Config.excludedFileTypes.includes(file.extension())) {
    return Promise.reject();
  }

  return scanFileForKeys(file);
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
function onLineRead(scannedFile, line, lineNumber) {
  const keys = findKeys(line);
  if (keys.length === 0) {
    return;
  }

  for (const key of keys) {
    const { term, confidence } = key;
    scannedFile.addKey(new Key(term, lineNumber, confidence));
  }
}

module.exports = { scan }
