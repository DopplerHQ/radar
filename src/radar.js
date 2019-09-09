const asyncPool = require("tiny-async-pool");
const Path = require('path');

const Filesystem = require('./filesystem');
const File = require('./objects/file');
const ScannedFile = require('./objects/scannedfile');
const Scanner = require('./Scanner');
const Config = require('./config');
const FileClassifier = require('./file_classifier');
const globs = require('./globs');

const OneMebibyte = 1024 * 1024;

class Radar {
  /**
   *
   * @param {Object} config
   * @param {function} onFilesToScan called with the total number of files to be scanned
   * @param {function} onFileScanned called whenever a file is scanned
   */
  constructor(config = {}, onFilesToScan = () => {}, onFileScanned = () => {}) {
    this._onFilesToScan = onFilesToScan;
    this._onFileScanned = onFileScanned;

    // verify all specified secret_types are valid
    const allSecretTypes = Scanner.listSecretTypes();
    if ((config.secretTypes !== undefined) && (config.secretTypes.length > 0)) {
      config.secretTypes.forEach((secretType) => {
        if (!allSecretTypes.includes(secretType)) {
          throw new Error(`Invalid secret type ${secretType}`)
        }
      });
    }

    this._config = new Config(config);
    const secretTypesToUse = this._config.getSecretTypes();
    this._secretTypes = Scanner.loadSecretTypes(secretTypesToUse);

    // these function gets executed outside of this context, so explicitly bind them
    this._onLineRead = this._onLineRead.bind(this);
    this._scanFile = this._scanFile.bind(this);
  }

  /**
   *
   * @param {String} path
   */
  async scan(path) {
    await Filesystem.pathExists(path)
      .then(exists => (!exists && Promise.reject(`Path does not exist: ${path}`)));

    const stats = await Filesystem.getFileStats(path);
    this.basePath = path;

    if (stats.isDirectory()) {
      const filesToScan = await this._getDirectoryFiles(path);
      this._onFilesToScan(filesToScan.length);
      return asyncPool(this._config.getMaxConcurrentFileReads(), filesToScan, this._scanFile)
        .then(results => Radar._getResultsMap(path, results.filter(result => result.hasSecrets())));
    }

    if (stats.isFile()) {
      this._onFilesToScan(1);
      const file = await Radar._getFileObject(path, this.basePath);
      return this._scanFile(file)
        .then(results => Radar._getResultsMap(file.path(), [results].filter(result => result.hasSecrets())));
    }
  }

  /**
   *
   * @param {string} path
   * @param {string} basePath
   */
  async shouldScanFile(path, basePath = "") {
    const file = await Radar._getFileObject(path, basePath, 0);
    return this._shouldScanFile(file);
  }

  /**
   * @param {String} path
   * @param {Array<File>} filesToScan array of files to scan
   */
  async _getDirectoryFiles(path, filesToScan = []) {
    const dirEntries = await Filesystem.getDirectoryEntries(path, true);

    for (const entry of dirEntries) {
      const entryPath = Path.join(path, entry.name);

      const file = await Radar._getFileObject(entryPath, this.basePath);
      if (entry.isDirectory() && this._checkDirectory(entry.name, file.relativePath())) {
        await this._getDirectoryFiles(entryPath, filesToScan);
      }

      if (entry.isFile()) {
        if (this._shouldScanFile(file)) {
          filesToScan.push(file);
        }
      }
    }

    return filesToScan;
  }

  /**
   *
   * @param {string} fullPath
   * @param {string} basePath
   * @param {number} fileSize will be calculated if undefined
   * @returns {File}
   */
  static async _getFileObject(fullPath, basePath, fileSize) {
    const path = fullPath.substring(0, fullPath.lastIndexOf('/'));
    const name = fullPath.substring(fullPath.lastIndexOf('/') + 1);
    if (basePath.endsWith(name)) {
      basePath = path;
    }

    if (fileSize === undefined) {
      const fileStats = await Filesystem.getFileStats(fullPath);
      fileSize = fileStats.size;
    }

    return new File(name, path, basePath, fileSize);
  }

  /**
   * Check whether the file's name, size, etc pass our configured constraints
   * @param {File} file
   * @returns {Boolean}
   */
  _shouldScanFile(file) {
    const name = file.name().toLowerCase();
    const size = file.size();
    const ext = file.extension().toLowerCase();
    const relativePath = file.relativePath();

    if (!this._checkFileSize(size)) {
      return false;
    }

    if (this._isNameWhitelisted(name, relativePath)) {
      return true;
    }

    if (this._isNameBlacklisted(name, relativePath)) {
      return false;
    }

    if (this._isExtensionWhitelisted(ext)) {
      return true;
    }

    if (this._isExtensionBlacklisted(ext)) {
      return false;
    }

    return true;
  }

  /**
   * Check that the directory isn't blacklisted
   * @param {String} name the directory name
   * @param {String} relativePath Relative path to the directory from the original scan directory. should include the directory name
   * @returns {Boolean}
   */
  _checkDirectory(name, relativePath = "") {
    const nameLower = name.toLowerCase();
    const relativePathLower = relativePath.toLowerCase();

    if (this._isDirectoryWhitelisted(nameLower, relativePathLower)) {
      return true;
    }

    if (this._isDirectoryBlacklisted(nameLower, relativePathLower)) {
      return false;
    }

    return true;
  }

  // TODO unit test these individual functions
  _isNameWhitelisted(name, relativePath) {
    const includedFiles = this._config.getIncludedFiles();
    return globs.isMatch(name, includedFiles) || globs.isMatch(relativePath, includedFiles);
  }

  _isNameBlacklisted(name, relativePath) {
    const excludedFiles = this._config.getExcludedFiles();
    return globs.isMatch(name, excludedFiles) || globs.isMatch(relativePath, excludedFiles);
  }

  _isDirectoryWhitelisted(name, relativePath) {
    const includedDirectories = this._config.getIncludedDirectories();
    return globs.isMatch(name, includedDirectories) || globs.isMatch(relativePath, includedDirectories);
  }

  _isDirectoryBlacklisted(name, relativePath) {
    const excludedDirectories = this._config.getExcludedDirectories();
    return globs.isMatch(name, excludedDirectories) || globs.isMatch(relativePath, excludedDirectories);
  }

  _isExtensionWhitelisted(ext) {
    const includedFileExts = this._config.getIncludedFileExts();
    return globs.isMatch(ext, includedFileExts);
  }

  _isExtensionBlacklisted(ext) {
    const excludedFileExts = this._config.getExcludedFileExts();
    return globs.isMatch(ext, excludedFileExts);
  }

  /**
   * Check that the file size doesn't exceed the max
   * @param {Number} bytes
   * @return {Boolean}
   */
  _checkFileSize(bytes) {
    const mebibytes = (bytes / OneMebibyte);
    const maxFileSizeMiB = this._config.getMaxFileSizeMiB();
    return (maxFileSizeMiB <= 0)
      ? true
      : mebibytes <= maxFileSizeMiB;
  }

  /**
   * @param {File} file
   * @returns {ScannedFile}
   */
  async _scanFile(file) {
    const scannedFile = new ScannedFile(file);
    FileClassifier.classify(file)
      .forEach(tag => scannedFile.addTag(tag, true));
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
    Scanner.findSecrets(this._secretTypes, line, scannedFile)
      .forEach(({ secret, secretType, metadata }) => scannedFile.addSecret(secret, secretType, line, lineNumber, metadata));
  }

  /**
   *
   * @param {String} path
   * @param {Array<ScannedFile>} scanResults
   */
  static _getResultsMap(path, scanResults) {
    const results = {};
    scanResults.forEach((scannedFile) => {
      const relativePath = scannedFile.file().relativePath();
      results[relativePath] = scannedFile.toObject();
    });
    return results;
  }

  listSecretTypes() {
    return Scanner.listSecretTypes();
  }

  listFilters() {
    return Scanner.getFilters()
      .map(file => file.substring(0, file.indexOf('.')));
  }

  config() {
    return this._config.config();
  }
}

module.exports = Radar;
