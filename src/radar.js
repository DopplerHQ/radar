const asyncPool = require("tiny-async-pool");

const Filesystem = require('./filesystem');
const filetypes = require('./filetypes.json');
const File = require('./objects/file');
const Key = require('./objects/key');
const ScannedFile = require('./objects/scannedfile');
const { findKeys } = require('./scanner');
const Config = require('./config');

const oneMebibyte = 1024 * 1024;

class Radar {
  constructor(config = new Config()) {
    Object.keys(filetypes).forEach(filetype => config.setExcludedFileExts(filetypes[filetype]));
    this._config = config;

    // these function gets executed outside of this context, so explicitly bind them
    this._onLineRead = this._onLineRead.bind(this);
    this._scanFile = this._scanFile.bind(this);
  }

  async scan(path) {
    const stats = await Filesystem.getFileStats(path);

    await Filesystem.pathExists(path)
      .then(exists => (!exists && Promise.reject(`Path does not exist: ${path}`)));

    const filesToScan = stats.isDirectory()
        ? await this._getDirectoryFiles(path)
        : [await this._getFileObject(path)];

    return asyncPool(this._config.getMaxConcurrentFileReads(), filesToScan, this._scanFile)
      .then(results => Radar._getResultsMap(path, results.filter(result => result.hasKeys())));
  }

  /**
   * @param {String} path
   * @param {Array<File>} filesToScan array of files to scan
   */
  async _getDirectoryFiles(path, filesToScan = []) {
    const dirEntries = await Filesystem.getDirectoryEntries(path, true);

    for (const entry of dirEntries) {
      const entryPath = `${path}/${entry.name}`;

      if (entry.isDirectory()) {
        const isDirectoryExcluded = this._config.getExcludedDirectories().includes(entry.name);
        if (isDirectoryExcluded) {
          continue;
        }

        await this._getDirectoryFiles(entryPath, filesToScan);
      }

      if (entry.isFile()) {
        const file = await this._getFileObject(path, entry.name);
        if (this._shouldScanFile(file)) {
          filesToScan.push(file);
        }
      }
    }

    return filesToScan;
  }

  /**
   * @param {String} path file path, excluding file name. include the file name if not sending a name argument
   * @param {String} name file name. will be extracted from path argument if not specified
   */
  async _getFileObject(path, name = "") {
    if (name === "") {
      name = path.substring(path.lastIndexOf('/') + 1);
      path = path.substring(0, path.lastIndexOf('/'));
    }

    const fullPath = `${path}/${name}`;
    const fileStats = await Filesystem.getFileStats(fullPath);
    const fileSize = fileStats.size;
    return new File(name, path, fileSize);
  }

  _shouldScanFile(file) {
    const name = file.name();
    const size = file.size();
    const fileExt = file.extension();

    const isFileExcluded = this._config.getExcludedFiles().includes(name);
    if (isFileExcluded) {
      return false;
    }

    const fileSizeInMiB = (size / oneMebibyte);
    if (fileSizeInMiB > this._config.getMaxFileSizeMiB()) {
      return false;
    }

    const isExtensionWhitelisted = this._config.getIncludedFileExts().includes(fileExt);
    const isExtensionBlacklisted = this._config.getExcludedFileExts().includes(fileExt);
    if (!isExtensionWhitelisted && isExtensionBlacklisted) {
      return false;
    }

    return true;
  }

  /**
   * @param {File} file
   */
  async _scanFile(file) {
    const scannedFile = new ScannedFile(file);
    return Filesystem.readFile(scannedFile, this._onLineRead)
      .catch(() => new ScannedFile(file));
  }

  /**
   * @param {ScannedFile} scannedFile
   * @param {String} line
   * @param {Number} lineNumber
   */
  _onLineRead(scannedFile, line, lineNumber) {
    const keys = findKeys(line, this._config.getMinMatchScore());
    if (keys.length === 0) {
      return;
    }

    for (const key of keys) {
      const { term, confidence } = key;
      scannedFile.addKey(new Key(term, lineNumber, confidence));
    }
  }

  static _getResultsMap(path, scanResults) {
    const results = {};
    const pathLength = path.length;

    scanResults.forEach((scannedFile) => {
      const fullPath = scannedFile.file().fullPath();
      let relativePath = fullPath.substring(pathLength);
      if (relativePath.startsWith('/')) {
        relativePath = relativePath.substring(1);
      }
      results[relativePath] = scannedFile.toObject();
    });

    return results;
  }
}

module.exports = Radar;
