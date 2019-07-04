const asyncPool = require("tiny-async-pool");

const Filesystem = require('./filesystem');
const filetypes = require('./filetypes.json');
const File = require('./objects/file');
const Key = require('./objects/key');
const ScannedFile = require('./objects/scannedfile');
const Scanner = require('./scanner');
const Config = require('./config');

const OneMebibyte = 1024 * 1024;

class Radar {
  /**
   *
   * @param {Config} config
   * @param {function} onFilesToScan called with the total number of files to be scanned
   * @param {function} onFileScanned called whenever a file is scanned
   */
  constructor(config = new Config(), onFilesToScan = () => {}, onFileScanned = () => {}) {
    Object.keys(filetypes).forEach(filetype => config.setExcludedFileExts(filetypes[filetype]));
    this._config = config;
    this._onFilesToScan = onFilesToScan;
    this._onFileScanned = onFileScanned;

    // these function gets executed outside of this context, so explicitly bind them
    this._onLineRead = this._onLineRead.bind(this);
    this._scanFile = this._scanFile.bind(this);
  }

  async scan(path) {
    const stats = await Filesystem.getFileStats(path);

    await Filesystem.pathExists(path)
      .then(exists => (!exists && Promise.reject(`Path does not exist: ${path}`)));

    if (stats.isDirectory()) {
      const filesToScan = await this._getDirectoryFiles(path);
      this._onFilesToScan(filesToScan.length);
      return asyncPool(this._config.getMaxConcurrentFileReads(), filesToScan, this._scanFile)
        .then(results => Radar._getResultsMap(path, results.filter(result => result.hasKeys())));
    }

    if (stats.isFile()) {
      this._onFilesToScan(1);
      const fileName = path.substring(path.lastIndexOf('/') + 1);
      const filePath = path.substring(0, path.lastIndexOf('/'));
      return this._getFileObject(filePath, fileName)
        .then(this._scanFile)
        .then(results => Radar._getResultsMap(filePath, [results]));
    }
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

  async _getFileObject(path, name) {
    const fullPath = `${path}/${name}`;
    const fileStats = await Filesystem.getFileStats(fullPath);
    const fileSize = fileStats.size;
    return new File(name, path, fileSize);
  }

  _shouldScanFile(file) {
    const name = file.name();
    const size = file.size();
    const ext = file.extension();

    if (this._isFileExcluded(name, ext)) {
      return false;
    }

    if (this._isFileTooLarge(size)) {
      return false;
    }

    return true;
  }

  _isFileExcluded(name, ext) {
    const isNameBlacklisted = this._config.getExcludedFiles().includes(name);
    if (isNameBlacklisted) {
      return true;
    }

    const isExtensionWhitelisted = this._config.getIncludedFileExts().includes(ext);
    const isExtensionBlacklisted = this._config.getExcludedFileExts().includes(ext);
    if (!isExtensionWhitelisted && isExtensionBlacklisted) {
      return true;
    }

    return false;
  }

  _isFileTooLarge(bytes) {
    const sizeMiB = (bytes / OneMebibyte);
    return sizeMiB > this._config.getMaxFileSizeMiB()
  }

  /**
   * @param {File} file
   */
  async _scanFile(file) {
    const scannedFile = new ScannedFile(file);
    await Filesystem.readFile(scannedFile, this._onLineRead)
      .catch(() => {});
    this._onFileScanned();
    return scannedFile;
  }

  /**
   * @param {ScannedFile} scannedFile
   * @param {String} line
   * @param {Number} lineNumber
   */
  _onLineRead(scannedFile, line, lineNumber) {
    const keys = Scanner.findKeys(line, this._config.getMinMatchScore());
    if (keys.length === 0) {
      return;
    }

    for (const key of keys) {
      const { term, confidence } = key;
      scannedFile.addKey(new Key(term, line, lineNumber, confidence));
    }
  }

  static _getResultsMap(path, scanResults) {
    const results = {};
    scanResults.forEach((scannedFile) => {
      const relativePath = Radar._getRelativePath(path, scannedFile.file().fullPath());
      results[relativePath] = scannedFile.toObject();
    });
    return results;
  }

  /**
   *
   * @param {String} basePath file path without the file name
   * @param {String} fullPath file path with the file name
   */
  static _getRelativePath(basePath, fullPath) {
    const relativePath = fullPath.substring(basePath.length);
    return relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  }
}

module.exports = { Radar, Config };
