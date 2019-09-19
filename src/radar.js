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

    const filesToScan = await (async () => {
      if (stats.isDirectory()) {
        return await this._getDirectoryFiles(path);
      }
      if (stats.isFile()) {
        return [await Radar._getFileObject(path, this.basePath)];
      }
      return null;
    })();

    if (filesToScan !== null) {
      this._onFilesToScan(filesToScan.length);
      const results = await asyncPool(this._config.getMaxConcurrentFileReads(), filesToScan, this._scanFile);
      return Radar._getResultsMap(path, results.filter(result => result.hasSecrets()));
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
   * @returns {Promise<File>}
   */
  static async _getFileObject(fullPath, basePath, fileSize = undefined) {
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

    if (Radar._isNameWhitelisted(name, relativePath, this._config.getIncludedFiles())) {
      return true;
    }

    if (Radar._isNameBlacklisted(name, relativePath, this._config.getExcludedFiles())) {
      return false;
    }

    if (Radar._isExtensionWhitelisted(ext, this._config.getIncludedFileExts())) {
      return true;
    }

    if (Radar._isExtensionBlacklisted(ext, this._config.getExcludedFileExts())) {
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

    if (Radar._isDirectoryWhitelisted(nameLower, relativePathLower, this._config.getIncludedDirectories())) {
      return true;
    }

    if (Radar._isDirectoryBlacklisted(nameLower, relativePathLower, this._config.getExcludedDirectories())) {
      return false;
    }

    return true;
  }

  // TODO unit test these individual functions
  static _isNameWhitelisted(name, relativePath, includedFiles) {
    return globs.isMatch(name, includedFiles) || globs.isMatch(relativePath, includedFiles);
  }

  static _isNameBlacklisted(name, relativePath, excludedFiles) {
    return globs.isMatch(name, excludedFiles) || globs.isMatch(relativePath, excludedFiles);
  }

  static _isDirectoryWhitelisted(name, relativePath, includedDirectories) {
    return globs.isMatch(name, includedDirectories) || globs.isMatch(relativePath, includedDirectories);
  }

  static _isDirectoryBlacklisted(name, relativePath, excludedDirectories) {
    return globs.isMatch(name, excludedDirectories) || globs.isMatch(relativePath, excludedDirectories);
  }

  static _isExtensionWhitelisted(ext, includedFileExts) {
    return globs.isMatch(ext, includedFileExts);
  }

  static _isExtensionBlacklisted(ext, excludedFileExts) {
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
   * @returns {Promise<ScannedFile>}
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
    return this._config;
  }
}

module.exports = Radar;
