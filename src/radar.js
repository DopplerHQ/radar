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
    Object.keys(filetypes).forEach(filetype => config.setExcludedFileExts(filetypes[filetype].map(f => f.toLowerCase())));
    this._config = config;
    this._onFilesToScan = onFilesToScan;
    this._onFileScanned = onFileScanned;

    // these function gets executed outside of this context, so explicitly bind them
    this._onLineRead = this._onLineRead.bind(this);
    this._scanFile = this._scanFile.bind(this);
  }

  /**
   *
   * @param {String} path
   */
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

      if (entry.isDirectory() && !this._isDirectoryExcluded(entry.name)) {
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
   *
   * @param {String} path
   * @param {String} name
   * @returns {File}
   */
  async _getFileObject(path, name) {
    const fullPath = `${path}/${name}`;
    const fileStats = await Filesystem.getFileStats(fullPath);
    const fileSize = fileStats.size;
    return new File(name.toLowerCase(), path.toLowerCase(), fileSize);
  }

  /**
   *
   * @param {File} file
   * @returns {Boolean}
   */
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

  /**
   * Checks if a file has been marked as excluded. Name white/blacklisting takes precedence over extension white/blacklisting
   * @param {String} name
   * @param {String} ext
   * @returns {Boolean}
   */
  _isFileExcluded(name, ext) {
    const isNameWhitelisted = this._config.getIncludedFiles().includes(name);
    if (isNameWhitelisted) {
      return false;
    }
    const isNameBlacklisted = this._config.getExcludedFiles().includes(name);
    if (isNameBlacklisted) {
      return true;
    }

    const isExtensionWhitelisted = this._config.getIncludedFileExts().includes(ext);
    if (isExtensionWhitelisted) {
      return false;
    }
    const isExtensionBlacklisted = this._config.getExcludedFileExts().includes(ext);
    if (isExtensionBlacklisted) {
      return true;
    }

    return false;
  }

  /**
   * Checks if a directory has been marked as excluded
   * @param {String} name
   * @returns {Boolean}
   */
  _isDirectoryExcluded(name) {
    const isNameWhitelisted = this._config.getIncludedDirectories().includes(name);
    if (isNameWhitelisted) {
      return false;
    }
    const isNameBlacklisted = this._config.getExcludedDirectories().includes(name);
    if (isNameBlacklisted) {
      return true;
    }

    return false;
  }

  /**
   *
   * @param {Number} bytes
   * @return {Boolean}
   */
  _isFileTooLarge(bytes) {
    const sizeMiB = (bytes / OneMebibyte);
    return sizeMiB > this._config.getMaxFileSizeMiB()
  }

  /**
   * @param {File} file
   * @returns {ScannedFile}
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

  /**
   *
   * @param {String} path
   * @param {Array<ScannedFile>} scanResults
   */
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
   * @returns {String}
   */
  static _getRelativePath(basePath, fullPath) {
    const relativePath = fullPath.substring(basePath.length);
    return relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  }
}

module.exports = { Radar, Config };
